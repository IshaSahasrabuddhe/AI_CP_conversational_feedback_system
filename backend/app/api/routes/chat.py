from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.chat import (
    ChatRequest,
    ChatResponse,
    ConversationCreateResponse,
    ConversationHistoryResponse,
    ConversationSummary,
)
from app.services.chat_service import ChatService

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/conversations", response_model=ConversationCreateResponse, status_code=status.HTTP_201_CREATED)
def create_conversation(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ConversationCreateResponse:
    service = ChatService(db)
    conversation, assistant_message = service.create_conversation(current_user)
    return ConversationCreateResponse(
        conversation_id=conversation.id,
        state=conversation.state,
        assistant_message=assistant_message,
    )


@router.get("/conversations", response_model=list[ConversationSummary])
def list_conversations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[ConversationSummary]:
    service = ChatService(db)
    return service.list_conversations(current_user)


@router.post("/send", response_model=ChatResponse)
def send_message(
    payload: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ChatResponse:
    service = ChatService(db)
    try:
        conversation, assistant_message = service.process_message(
            current_user,
            payload.conversation_id,
            payload.message,
        )
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc

    return ChatResponse(
        conversation_id=conversation.id,
        state=conversation.state,
        assistant_message=assistant_message,
        context=conversation.context or {},
    )


@router.get("/history/{conversation_id}", response_model=ConversationHistoryResponse)
def get_history(
    conversation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ConversationHistoryResponse:
    service = ChatService(db)
    try:
        conversation = service.get_conversation(current_user, conversation_id)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc

    return ConversationHistoryResponse(
        conversation_id=conversation.id,
        state=conversation.state,
        messages=conversation.messages,
        context=conversation.context or {},
    )
