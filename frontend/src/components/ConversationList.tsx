import type { ConversationSummary } from "../types";

interface ConversationListProps {
  conversations: ConversationSummary[];
  activeConversationId: number | null;
  onCreateConversation: () => void;
  onSelectConversation: (conversationId: number) => void;
}

export default function ConversationList({
  conversations,
  activeConversationId,
  onCreateConversation,
  onSelectConversation,
}: ConversationListProps) {
  return (
    <aside className="flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 p-5 backdrop-blur">
      <div className="mb-5 flex shrink-0 items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-orange-200">Sessions</p>
          <h2 className="mt-1 text-lg font-semibold text-white">Feedback Threads</h2>
        </div>
        <button
          onClick={onCreateConversation}
          className="rounded-2xl border border-orange-300/40 bg-orange-400/10 px-3 py-2 text-sm font-semibold text-orange-100 transition hover:bg-orange-400/20"
        >
          New
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-1">
        {conversations.map((conversation) => {
          const isActive = activeConversationId === conversation.id;
          return (
            <button
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
              className={`mb-3 w-full rounded-2xl border px-4 py-3 text-left transition last:mb-0 ${
                isActive
                  ? "border-orange-300/50 bg-orange-400/15 text-white"
                  : "border-white/10 bg-slate-950/60 text-slate-300 hover:border-white/20 hover:text-white"
              }`}
            >
              <p className="truncate text-sm font-semibold">{conversation.title}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">{conversation.state}</p>
            </button>
          );
        })}
        {!conversations.length ? <p className="text-sm text-slate-400">No conversations yet.</p> : null}
      </div>
    </aside>
  );
}
