"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Match, Stadium } from "@/lib/data";
import { DEFAULT_ORIGIN_CITY_ID, ORIGIN_CITIES } from "@/lib/travel";

const ORIGIN_STORAGE_KEY = "pitch-perfect-origin-city";

const SUGGESTED_QUESTIONS = [
  "Should I stay near the stadium or downtown?",
  "What's the safest route after the match?",
  "Is this seat good for taking photos?",
];

type ChatRole = "user" | "assistant";

interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
}

interface MatchAiChatProps {
  match: Match;
  stadium: Stadium;
}

export default function MatchAiChat({ match, stadium }: MatchAiChatProps) {
  const [originCityId, setOriginCityId] = useState(DEFAULT_ORIGIN_CITY_ID);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Ask me about where to stay, how to get to the stadium, or which seat angle fits your matchday plan.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem(ORIGIN_STORAGE_KEY);
    if (stored && ORIGIN_CITIES.some((city) => city.id === stored)) {
      setOriginCityId(stored);
    }
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  const askQuestion = async (question: string) => {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || isLoading) return;

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      content: trimmedQuestion,
    };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/match-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId: match.id,
          originCityId,
          question: trimmedQuestion,
          messages: messages
            .filter((message) => message.id !== "welcome")
            .map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!response.ok) throw new Error("AI request failed.");

      const data = (await response.json()) as { answer?: string; demoMode?: boolean };
      const answer = data.answer?.trim() || "I couldn't generate a matchday answer this time.";

      setIsDemoMode(Boolean(data.demoMode));
      setMessages([
        ...nextMessages,
        {
          id: `${Date.now()}-assistant`,
          role: "assistant",
          content: answer,
        },
      ]);
    } catch {
      setMessages([
        ...nextMessages,
        {
          id: `${Date.now()}-assistant`,
          role: "assistant",
          content:
            "I couldn't reach the matchday concierge right now. Try again in a moment, or use the travel notes above as the source of truth.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    askQuestion(input);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="overflow-hidden rounded-2xl border border-emerald-300/15 bg-slate-950/60 shadow-2xl shadow-emerald-950/10"
    >
      <div className="border-b border-slate-500/15 bg-gradient-to-r from-emerald-300/10 via-sky-300/5 to-transparent p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-emerald-300/80">
              AI matchday concierge
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">Ask AI about this match</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Scoped to {match.home} vs {match.away}, {stadium.name}, your saved departure city,
              and the trip options on this page.
            </p>
          </div>
          {isDemoMode && (
            <span className="rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1 text-xs font-medium text-amber-100">
              {/* Demo answers */}
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1fr_300px]">
        <div className="flex min-h-[420px] flex-col">
          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-6">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                      message.role === "user"
                        ? "bg-emerald-400 text-slate-950"
                        : "border border-slate-500/15 bg-slate-900/75 text-slate-200"
                    }`}
                  >
                    {message.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="rounded-2xl border border-slate-500/15 bg-slate-900/75 px-4 py-3 text-sm text-slate-400">
                  Thinking through the matchday plan...
                </div>
              </motion.div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-slate-500/15 p-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about hotels, transport, seats, or timing..."
                className="min-h-12 flex-1 rounded-xl border border-slate-500/20 bg-slate-950/70 px-4 text-sm text-slate-100 outline-none transition-colors placeholder:text-slate-600 focus:border-emerald-300/50 focus:ring-1 focus:ring-emerald-300/20"
              />
              <button
                type="submit"
                disabled={isLoading || input.trim().length === 0}
                className="rounded-xl bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
              >
                Ask AI
              </button>
            </div>
          </form>
        </div>

        <aside className="border-t border-slate-500/15 bg-slate-950/40 p-5 lg:border-l lg:border-t-0">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Try asking
          </p>
          <div className="space-y-3">
            {SUGGESTED_QUESTIONS.map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => askQuestion(question)}
                disabled={isLoading}
                className="w-full rounded-xl border border-slate-500/15 bg-slate-900/60 p-4 text-left text-sm leading-6 text-slate-300 transition-colors hover:border-emerald-300/35 hover:text-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {question}
              </button>
            ))}
          </div>
          <p className="mt-5 text-xs leading-5 text-slate-500">
            {/* Add `OPENAI_API_KEY` to get live model responses. Without it, Pitch Perfect uses a
            local demo concierge based on the same match context. */}
          </p>
        </aside>
      </div>
    </motion.section>
  );
}
