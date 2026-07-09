import { Mail, MousePointerClick, TrendingUp, Award } from "lucide-react";
import { KpiCard } from "@/components/shared/kpi-card";
import { ProgressListItem } from "@/components/shared/progress-list-item";
import { alumni, kpis } from "@/lib/mock";

export default function AlumniEngagementPage() {
  const avgEngagement = Math.round(alumni.reduce((s, a) => s + (a.scores.alumniEngagementScore ?? 0), 0) / alumni.length);
  const topEngaged = [...alumni].sort((a, b) => (b.scores.alumniEngagementScore ?? 0) - (a.scores.alumniEngagementScore ?? 0)).slice(0, 8);
  const buckets = [
    { label: "Highly engaged (80+)", count: alumni.filter((a) => (a.scores.alumniEngagementScore ?? 0) >= 80).length },
    { label: "Moderately engaged (50-79)", count: alumni.filter((a) => (a.scores.alumniEngagementScore ?? 0) >= 50 && (a.scores.alumniEngagementScore ?? 0) < 80).length },
    { label: "Low engagement (<50)", count: alumni.filter((a) => (a.scores.alumniEngagementScore ?? 0) < 50).length },
  ];

  return (
    <div>
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KpiCard icon={TrendingUp} label="Avg. Engagement Score" value={avgEngagement} tint="green" />
        <KpiCard icon={Mail} label="Emails Sent (weekly)" value="8,200" subtext="75% engagement rate" tint="blue" />
        <KpiCard icon={MousePointerClick} label="Jobs Viewed via Email" value="1,900" subtext="this week" tint="purple" />
        <KpiCard icon={Award} label="Verified Alumni" value={`${kpis.verifiedAlumniPct}%`} tint="amber" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="mb-4 font-semibold">Engagement Distribution</p>
          <div className="flex flex-col gap-4">
            {buckets.map((b) => (
              <ProgressListItem key={b.label} label={b.label} count={b.count} pct={Math.round((b.count / alumni.length) * 100)} />
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="mb-4 font-semibold">Most Engaged Alumni</p>
          <div className="flex flex-col divide-y divide-border">
            {topEngaged.map((a) => (
              <div key={a.id} className="flex items-center justify-between py-2.5 first:pt-0 text-sm">
                <div>
                  <p className="font-medium">{a.fullName}</p>
                  <p className="text-xs text-muted-foreground">{a.currentTitle} at {a.currentCompany}</p>
                </div>
                <span className="font-semibold text-tint-green-fg">{a.scores.alumniEngagementScore}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
