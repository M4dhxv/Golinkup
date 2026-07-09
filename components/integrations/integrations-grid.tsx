"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { AvatarBadge } from "@/components/shared/avatar-badge";
import { cn } from "@/lib/utils";

type Integration = {
  name: string;
  category: string;
  desc: string;
  connected: boolean;
};

const initialIntegrations: Integration[] = [
  { name: "LinkedIn", category: "Data Source", desc: "Sync alumni and student profile data automatically.", connected: true },
  { name: "Workday", category: "ATS", desc: "Pull open roles and hiring status from your ATS.", connected: true },
  { name: "Greenhouse", category: "ATS", desc: "Sync job postings and application pipelines.", connected: false },
  { name: "Gmail", category: "Email", desc: "Send outreach campaigns from your institution inbox.", connected: true },
  { name: "Outlook", category: "Email", desc: "Sync calendar invites for alumni outreach events.", connected: false },
  { name: "Slack", category: "Notifications", desc: "Push AI insights and alerts to a career services channel.", connected: false },
  { name: "Salesforce", category: "CRM", desc: "Sync alumni engagement data with your CRM.", connected: false },
  { name: "Tableau", category: "BI", desc: "Export analytics datasets for custom dashboards.", connected: false },
];

export function IntegrationsGrid() {
  const [integrations, setIntegrations] = useState(initialIntegrations);

  function toggle(name: string) {
    setIntegrations((its) => its.map((i) => (i.name === name ? { ...i, connected: !i.connected } : i)));
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {integrations.map((i) => (
        <div key={i.name} className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <AvatarBadge label={i.name} />
            {i.connected && (
              <span className="flex items-center gap-1 rounded-full bg-tint-green-bg px-2 py-0.5 text-[11px] font-semibold text-tint-green-fg">
                <Check className="size-3" /> Connected
              </span>
            )}
          </div>
          <div>
            <p className="font-semibold">{i.name}</p>
            <p className="text-xs text-muted-foreground">{i.category}</p>
          </div>
          <p className="text-sm text-muted-foreground">{i.desc}</p>
          <button
            onClick={() => toggle(i.name)}
            className={cn(
              "mt-auto rounded-full px-3 py-1.5 text-sm font-semibold",
              i.connected ? "border border-border hover:bg-accent" : "bg-primary text-primary-foreground hover:bg-brand-forest-light",
            )}
          >
            {i.connected ? "Disconnect" : "Connect"}
          </button>
        </div>
      ))}
    </div>
  );
}
