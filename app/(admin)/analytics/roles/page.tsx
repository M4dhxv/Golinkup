import { Briefcase, Clock, Globe, Layers } from "lucide-react";
import { KpiCard } from "@/components/shared/kpi-card";
import { ProgressListItem } from "@/components/shared/progress-list-item";
import { roles } from "@/lib/mock";

export default function RolesAnalyticsPage() {
  const byLevel = ["Intern", "Entry", "Mid", "Senior"].map((level) => ({
    label: level,
    count: roles.filter((r) => r.level === level).length,
  }));
  const byWorkType = ["On-site", "Hybrid", "Remote"].map((w) => ({
    label: w,
    count: roles.filter((r) => r.workplaceType === w).length,
  }));
  const newThisWeek = roles.filter((r) => r.postedDaysAgo <= 7).length;

  return (
    <div>
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KpiCard icon={Briefcase} label="Total Roles" value={roles.length} tint="blue" />
        <KpiCard icon={Clock} label="New This Week" value={newThisWeek} tint="amber" />
        <KpiCard icon={Globe} label="Remote Share" value={`${Math.round((byWorkType[2].count / roles.length) * 100)}%`} tint="green" />
        <KpiCard icon={Layers} label="Levels Tracked" value={byLevel.length} tint="purple" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="mb-4 font-semibold">Roles by Level</p>
          <div className="flex flex-col gap-4">
            {byLevel.map((b) => (
              <ProgressListItem key={b.label} label={b.label} count={b.count} pct={Math.round((b.count / roles.length) * 100)} />
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="mb-4 font-semibold">Roles by Work Type</p>
          <div className="flex flex-col gap-4">
            {byWorkType.map((b) => (
              <ProgressListItem key={b.label} label={b.label} count={b.count} pct={Math.round((b.count / roles.length) * 100)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
