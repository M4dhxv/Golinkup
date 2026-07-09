import { Send, MailCheck, MousePointerClick, UserPlus } from "lucide-react";
import { KpiCard } from "@/components/shared/kpi-card";
import { StackedBarTrend } from "@/components/shared/trend-chart";
import { activationTrend } from "@/lib/mock";

export default function OutreachPage() {
  return (
    <div>
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KpiCard icon={Send} label="Invites Sent (weekly)" value="156" subtext="124 via import · 32 manual" tint="blue" />
        <KpiCard icon={MailCheck} label="Email Engagement Rate" value="75%" tint="green" />
        <KpiCard icon={MousePointerClick} label="Jobs Viewed via Email" value="1,900" subtext="this week" tint="purple" />
        <KpiCard icon={UserPlus} label="Activations (weekly)" value="47" subtext="68% conversion rate" tint="amber" />
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <p className="mb-4 font-semibold">Outreach Conversion Trend</p>
        <StackedBarTrend
          data={activationTrend}
          keys={[
            { key: "activated", label: "Converted", color: "var(--brand-forest)" },
            { key: "pending", label: "Awaiting response", color: "var(--brand-lime)" },
          ]}
        />
      </div>
    </div>
  );
}
