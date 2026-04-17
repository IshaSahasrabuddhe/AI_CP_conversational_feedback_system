from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field

from app.models.enums import ConversationState, MessageRole


class ConversationCreateResponse(BaseModel):
    conversation_id: int
    state: ConversationState
    assistant_message: str


class ChatRequest(BaseModel):
    conversation_id: int
    message: str = Field(min_length=1, max_length=4000)


class MessageResponse(BaseModel):
    id: int
    role: MessageRole
    content: str
    timestamp: datetime

    model_config = {"from_attributes": True}


class ConversationSummary(BaseModel):
    id: int
    title: str
    state: ConversationState
    created_at: datetime

    model_config = {"from_attributes": True}


class ChatResponse(BaseModel):
    conversation_id: int
    state: ConversationState
    assistant_message: str
    context: dict[str, Any]


class ConversationHistoryResponse(BaseModel):
    conversation_id: int
    state: ConversationState
    messages: list[MessageResponse]
    context: dict[str, Any] = Field(default_factory=dict)
