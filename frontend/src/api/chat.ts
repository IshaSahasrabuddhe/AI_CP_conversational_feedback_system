import api from "./client";
import type {
  ChatResponse,
  ConversationHistory,
  ConversationSummary,
  CreateConversationResponse,
} from "../types";

export async function listConversations(): Promise<ConversationSummary[]> {
  const response = await api.get<ConversationSummary[]>("/chat/conversations");
  return response.data;
}

export async function createConversation(): Promise<CreateConversationResponse> {
  const response = await api.post<CreateConversationResponse>("/chat/conversations");
  return response.data;
}

export async function getHistory(conversationId: number): Promise<ConversationHistory> {
  const response = await api.get<ConversationHistory>(`/chat/history/${conversationId}`);
  return response.data;
}

export async function sendMessage(conversationId: number, message: string): Promise<ChatResponse> {
  const response = await api.post<ChatResponse>("/chat/send", { conversation_id: conversationId, message });
  return response.data;
}
