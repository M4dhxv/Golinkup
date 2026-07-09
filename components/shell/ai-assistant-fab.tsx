"use client";

import { useState } from "react";
import { Sparkles, X, Send } from "lucide-react";
import { cn } from "@/lib/utils";

export function AIAssistantFab() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-80 rounded-2xl border border-border bg-card p-4 shadow-xl">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-full bg-brand-lime">
              <Sparkles className="size-3.5 text-brand-forest" />
            </span>
            <p className="text-sm font-semibold">GoLinkUp AI</p>
          </div>
          <p className="mb-3 rounded-xl bg-secondary p-3 text-sm text-foreground/80">
            Ask me anything — &quot;Which students match the new Google roles?&quot; or &quot;Who should we ask for a referral this week?&quot;
          </p>
          <div className="flex items-center gap-2 rounded-full border border-border px-3 py-2">
            <input
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              placeholder="Ask GoLinkUp AI..."
            />
            <Send className="size-4 text-primary" />
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex size-14 items-center justify-center rounded-full bg-brand-lime shadow-lg transition-transform hover:scale-105",
        )}
        aria-label="Open AI assistant"
      >
        {open ? <X className="size-5 text-brand-forest" /> : <Sparkles className="size-5 text-brand-forest" />}
      </button>
    </div>
  );
}
