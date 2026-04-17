from __future__ import annotations

from sqlalchemy import inspect, text
from sqlalchemy.engine import Engine


def run_startup_migrations(engine: Engine) -> None:
    """Apply lightweight schema fixes for local deployments without Alembic."""
    inspector = inspect(engine)
    if "feedback" not in inspector.get_table_names():
        return

    columns = {column["name"]: column for column in inspector.get_columns("feedback")}
    needs_raw_text = "raw_text" not in columns
    needs_issue_tags = "issue_tags" not in columns
    rating_is_required = bool(columns.get("rating", {}).get("nullable") is False)

    if engine.dialect.name == "sqlite":
        if rating_is_required:
            _rebuild_feedback_table_sqlite(engine, columns, include_issue_tags=not needs_issue_tags)
            columns = {column["name"]: column for column in inspect(engine).get_columns("feedback")}
            needs_raw_text = "raw_text" not in columns
            needs_issue_tags = "issue_tags" not in columns

        if needs_raw_text:
            with engine.begin() as connection:
                connection.execute(text("ALTER TABLE feedback ADD COLUMN raw_text TEXT NOT NULL DEFAULT ''"))

        if needs_issue_tags:
            with engine.begin() as connection:
                connection.execute(text("ALTER TABLE feedback ADD COLUMN issue_tags JSON NOT NULL DEFAULT '[]'"))
        return

    with engine.begin() as connection:
        if needs_raw_text:
            connection.execute(text("ALTER TABLE feedback ADD COLUMN IF NOT EXISTS raw_text TEXT NOT NULL DEFAULT ''"))
        if needs_issue_tags:
            connection.execute(text("ALTER TABLE feedback ADD COLUMN IF NOT EXISTS issue_tags JSON NOT NULL DEFAULT '[]'::json"))


def _rebuild_feedback_table_sqlite(engine: Engine, columns: dict, include_issue_tags: bool) -> None:
    with engine.begin() as connection:
        connection.execute(text("ALTER TABLE feedback RENAME TO feedback_legacy"))
        connection.execute(
            text(
                f"""
                CREATE TABLE feedback (
                    id INTEGER NOT NULL PRIMARY KEY,
                    conversation_id INTEGER NOT NULL,
                    rating INTEGER NULL,
                    sentiment VARCHAR(50) NOT NULL,
                    positives JSON NOT NULL,
                    negatives JSON NOT NULL,
                    suggestions JSON NOT NULL,
                    issue_type VARCHAR(50) NOT NULL,
                    issue_tags JSON NOT NULL DEFAULT '[]',
                    raw_text TEXT NOT NULL DEFAULT '',
                    created_at DATETIME NOT NULL,
                    FOREIGN KEY(conversation_id) REFERENCES conversations (id)
                )
                """
            )
        )

        issue_tags_select = "issue_tags" if include_issue_tags and "issue_tags" in columns else "'[]'"
        raw_text_select = "raw_text" if "raw_text" in columns else "''"

        connection.execute(
            text(
                f"""
                INSERT INTO feedback (
                    id,
                    conversation_id,
                    rating,
                    sentiment,
                    positives,
                    negatives,
                    suggestions,
                    issue_type,
                    issue_tags,
                    raw_text,
                    created_at
                )
                SELECT
                    id,
                    conversation_id,
                    rating,
                    sentiment,
                    positives,
                    negatives,
                    suggestions,
                    issue_type,
                    {issue_tags_select},
                    {raw_text_select},
                    created_at
                FROM feedback_legacy
                """
            )
        )
        connection.execute(text("DROP TABLE feedback_legacy"))
        connection.execute(text("CREATE INDEX IF NOT EXISTS ix_feedback_id ON feedback (id)"))
        connection.execute(text("CREATE INDEX IF NOT EXISTS ix_feedback_conversation_id ON feedback (conversation_id)"))
