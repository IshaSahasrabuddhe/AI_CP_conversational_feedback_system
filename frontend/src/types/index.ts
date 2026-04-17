export type ConversationState =
  | "START"
  | "ASK_FEEDBACK"
  | "PRE_FEEDBACK_ANALYSIS"
  | "ISSUE_DETECTION"
  | "ISSUE_HANDLING"
  | "CLASSIFY_INTENT"
  | "ASK_RATING"
  | "HANDLE_VAGUE_RATING"
  | "POSITIVE_FLOW"
  | "NEGATIVE_FLOW"
  | "NEUTRAL_FLOW"
  | "ANALYZE_FEEDBACK"
  | "CLASSIFY_ISSUE_TYPE"
  | "STORE_FEEDBACK"
  | "FEEDBACK_CONTINUE"
  | "END";

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface ConversationSummary {
  id: number;
  title: string;
  state: ConversationState;
  created_at: string;
}

export interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface ConversationHistory {
  conversation_id: number;
  state: ConversationState;
  messages: Message[];
  context?: Record<string, unknown>;
}

export interface ChatResponse {
  conversation_id: number;
  state: ConversationState;
  assistant_message: string;
  context: Record<string, unknown>;
}

export interface CreateConversationResponse {
  conversation_id: number;
  state: ConversationState;
  assistant_message: string;
}
