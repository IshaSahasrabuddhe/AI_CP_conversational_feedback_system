import { useEffect, useRef } from "react";

import type { Message } from "../types";

interface ChatWindowProps {
  messages: Message[];
  draft: string;
  onDraftChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  currentState?: string;
}

export default function ChatWindow({
  messages,
  draft,
  onDraftChange,
  onSend,
  disabled,
  currentState,
}: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const canReopen = currentState === "END";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 backdrop-blur">
      <div className="shrink-0 border-b border-white/10 px-6 py-5">
        <p className="text-xs uppercase tracking-[0.24em] text-sky-200">Conversation Engine</p>
        <div className="mt-2 flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-white">AI Feedback Chat</h2>
          <span className="rounded-full border border-white/10 bg-slate-950/80 px-3 py-1 text-xs font-medium text-slate-300">
            {currentState || "Idle"}
          </span>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-4">
            {messages.map((message) => {
              const isAssistant = message.role === "assistant";
              return (
                <div key={message.id} className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}>
                  <div
                    className={`max-w-[80%] rounded-3xl px-4 py-3 text-sm leading-7 shadow-lg ${
                      isAssistant
                        ? "bg-white/10 text-slate-100"
                        : "bg-gradient-to-r from-orange-500 to-amber-400 text-slate-950"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              );
            })}
            {!messages.length ? <p className="text-sm text-slate-400">Start a conversation to collect feedback.</p> : null}
            <div ref={bottomRef} />
          </div>
        </div>
      </div>

      <div className="shrink-0 border-t border-white/10 px-6 py-5">
        {canReopen ? (
          <p className="mb-3 text-sm text-slate-400">
            This conversation is paused, but you can still send another message to keep adding feedback.
          </p>
        ) : null}
        <div className="flex items-end gap-3">
          <textarea
            className="min-h-[72px] flex-1 resize-none rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-orange-400 disabled:opacity-60"
            placeholder={canReopen ? "Add more feedback whenever you are ready..." : "Tell the assistant what worked, what felt off, or what to improve..."}
            value={draft}
            onChange={(event) => onDraftChange(event.target.value)}
            disabled={disabled}
          />
          <button
            onClick={onSend}
            disabled={disabled || !draft.trim()}
            className="rounded-3xl bg-gradient-to-r from-sky-400 to-cyan-300 px-5 py-3 font-semibold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Send
          </button>
        </div>
      </div>
    </section>
  );
}
