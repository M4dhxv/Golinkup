import { Users, UserCheck, Clock, Building2, Briefcase, TrendingUp } from "lucide-react";
import { KpiCard } from "@/components/shared/kpi-card";
import { ProgressListItem } from "@/components/shared/progress-list-item";
import { StackedBarTrend } from "@/components/shared/trend-chart";
import { kpis, activationTrend, alumniByIndustry, roles } from "@/lib/mock";
import { EMERGING_SKILLS } from "@/lib/mock/constants";

export default function AnalyticsOverviewPage() {
  const totalIndustryAlumni = alumniByIndustry.reduce((s, i) => s + i.count, 0);
  const emergingSignals = [
    { title: "AI Program Manager", company: "Google", hot: true },
    { title: "Climate Data Analyst", company: "Stripe", hot: true },
    { title: "Trust & Safety Lead", company: "Meta", hot: false },
    { title: "ML Infrastructure Engineer", company: "Amazon", hot: true },
    { title: "Head of AI Ethics", company: "Microsoft", hot: false },
  ];

  return (
    <div>
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <KpiCard icon={Users} label="Total Alumni" value={kpis.totalAlumni.toLocaleString()} subtext={`+${Math.round(kpis.totalAlumni * 0.02)} this month`} tint="blue" />
        <KpiCard icon={UserCheck} label="Active" value={kpis.activatedAlumni.toLocaleString()} subtext={`${Math.round((kpis.activatedAlumni / kpis.totalAlumni) * 100)}% activation rate`} tint="green" />
        <KpiCard icon={Clock} label="Pending" value={kpis.pendingAlumni.toLocaleString()} subtext={`${Math.round(kpis.pendingAlumni * 0.06)} need follow-up`} tint="amber" />
        <KpiCard icon={Building2} label="Companies" value={kpis.totalCompanies} subtext="+2 this month" tint="purple" />
        <KpiCard icon={Briefcase} label="Open Roles" value={kpis.openRoles} subtext={`+${roles.filter((r) => r.postedDaysAgo <= 7).length} this week`} tint="indigo" />
      </div>

      <div className="mb-6 rounded-2xl border border-tint-purple-fg/20 bg-tint-purple-bg/30 p-5">
        <div className="mb-1 flex items-center gap-2">
          <TrendingUp className="size-4 text-tint-purple-fg" />
          <p className="font-semibold">Emerging Role Signals</p>
        </div>
        <p className="mb-3 text-sm text-muted-foreground">{emergingSignals.length} new role titles appeared this month</p>
        <div className="flex flex-wrap gap-2">
          {emergingSignals.map((s) => (
            <span key={s.title} className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium">
              {s.hot && "🔥"} {s.title} <span className="text-muted-foreground">@ {s.company}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="mb-4 font-semibold">Activation Trend</p>
          <StackedBarTrend
            data={activationTrend}
            keys={[
              { key: "activated", label: "Activated", color: "var(--brand-forest)" },
              { key: "pending", label: "Pending", color: "var(--brand-lime)" },
            ]}
          />
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="mb-4 font-semibold">Alumni by Industry</p>
          <div className="flex flex-col gap-4">
            {alumniByIndustry.slice(0, 6).map((i) => (
              <ProgressListItem key={i.industry} label={i.industry} count={i.count} pct={Math.round((i.count / totalIndustryAlumni) * 100)} />
            ))}
          </div>
        </div>
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        Emerging skills to watch: {EMERGING_SKILLS.slice(0, 5).join(", ")}.
      </p>
    </div>
  );
}
