import { useEffect, useState } from "react";

import { createConversation, getHistory, listConversations, sendMessage } from "../api/chat";
import ChatWindow from "../components/ChatWindow";
import ConversationList from "../components/ConversationList";
import { useAuth } from "../context/AuthContext";
import type { ConversationHistory, ConversationSummary, Message } from "../types";

export default function DashboardPage() {
  const { logout } = useAuth();
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [currentState, setCurrentState] = useState<string>("START");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void hydrate();
  }, []);

  async function hydrate() {
    setLoading(true);
    try {
      const conversationList = await listConversations();
      setConversations(conversationList);

      if (conversationList.length) {
        await selectConversation(conversationList[0].id);
      }
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateConversation() {
    setLoading(true);
    try {
      const created = await createConversation();
      const updatedConversations = await listConversations();
      setConversations(updatedConversations);
      setActiveConversationId(created.conversation_id);
      const history = await getHistory(created.conversation_id);
      applyHistory(history);
    } finally {
      setLoading(false);
    }
  }

  async function selectConversation(conversationId: number) {
    setLoading(true);
    try {
      const history = await getHistory(conversationId);
      setActiveConversationId(conversationId);
      applyHistory(history);
    } finally {
      setLoading(false);
    }
  }

  function applyHistory(history: ConversationHistory) {
    setMessages(history.messages);
    setCurrentState(history.state);
  }

  async function handleSend() {
    if (!activeConversationId || !draft.trim()) {
      return;
    }

    const userDraft = draft.trim();
    setDraft("");

    const optimisticMessage: Message = {
      id: Date.now(),
      role: "user",
      content: userDraft,
      timestamp: new Date().toISOString(),
    };
    setMessages((current) => [...current, optimisticMessage]);
    setLoading(true);

    try {
      const response = await sendMessage(activeConversationId, userDraft);
      const history = await getHistory(response.conversation_id);
      applyHistory(history);
      setCurrentState(response.state);
      setConversations(await listConversations());
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="h-screen overflow-hidden px-4 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto flex h-full w-full max-w-[1400px] flex-col gap-4 rounded-[32px] border border-white/10 bg-slate-950/60 p-4 shadow-panel backdrop-blur sm:p-6">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-orange-200">AI feedback app</p>
            <h1 className="mt-2 text-3xl font-bold text-white">Conversational Feedback Dashboard</h1>
          </div>
          <button
            onClick={logout}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
          >
            Log out
          </button>
        </header>

        <div className="grid min-h-0 flex-1 gap-4 overflow-hidden lg:grid-cols-[320px,minmax(0,1fr)]">
          <ConversationList
            conversations={conversations}
            activeConversationId={activeConversationId}
            onCreateConversation={() => void handleCreateConversation()}
            onSelectConversation={(conversationId) => void selectConversation(conversationId)}
          />
          <ChatWindow
            messages={messages}
            draft={draft}
            onDraftChange={setDraft}
            onSend={() => void handleSend()}
            disabled={loading || !activeConversationId}
            currentState={currentState}
          />
        </div>
      </div>
    </main>
  );
}
