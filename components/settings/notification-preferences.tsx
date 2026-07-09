"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";

const initialPrefs = [
  { key: "weeklyDigest", label: "Weekly digest email", desc: "A summary of alumni, hiring, and referral activity.", on: true },
  { key: "aiInsights", label: "AI insight alerts", desc: "Real-time notifications for high-priority insights.", on: true },
  { key: "newRoles", label: "New role postings", desc: "Notify when alumni employers post new roles.", on: true },
  { key: "referralOpportunities", label: "Referral opportunities", desc: "Notify when alumni referral capacity opens up.", on: false },
];

export function NotificationPreferences() {
  const [prefs, setPrefs] = useState(initialPrefs);

  return (
    <div className="flex flex-col divide-y divide-border">
      {prefs.map((p) => (
        <div key={p.key} className="flex items-center justify-between py-3.5 first:pt-0">
          <div>
            <p className="text-sm font-medium">{p.label}</p>
            <p className="text-xs text-muted-foreground">{p.desc}</p>
          </div>
          <Switch
            checked={p.on}
            onCheckedChange={(v) => setPrefs((ps) => ps.map((x) => (x.key === p.key ? { ...x, on: v } : x)))}
          />
        </div>
      ))}
    </div>
  );
}
