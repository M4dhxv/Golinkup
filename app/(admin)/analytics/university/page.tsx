import { GraduationCap, DollarSign, Layers, TrendingUp } from "lucide-react";
import { KpiCard } from "@/components/shared/kpi-card";
import { ProgressListItem } from "@/components/shared/progress-list-item";
import { institution, kpis, departmentStats, alumniByIndustry } from "@/lib/mock";

export default function UniversityAnalyticsPage() {
  const totalIndustryAlumni = alumniByIndustry.reduce((s, i) => s + i.count, 0);
  const focusDept = [...departmentStats].sort((a, b) => a.readiness - b.readiness)[0];
  const growingIndustry = alumniByIndustry[0];

  return (
    <div>
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KpiCard icon={GraduationCap} label="Alumni Base Size" value={institution.alumniBaseSize.toLocaleString()} tint="blue" />
        <KpiCard icon={Layers} label="Subscription Tier" value={institution.tier} subtext={institution.subscriptionPrice} tint="purple" />
        <KpiCard icon={DollarSign} label="Annual Giving Baseline" value={institution.givingBaseline} tint="green" />
        <KpiCard icon={TrendingUp} label="Student Readiness Avg." value={kpis.studentReadinessAvg} tint="amber" />
      </div>

      <div className="mb-6 rounded-2xl border border-tint-indigo-fg/30 bg-tint-indigo-bg/30 p-5">
        <div className="mb-2 flex items-center gap-2">
          <TrendingUp className="size-4 text-tint-indigo-fg" />
          <p className="font-semibold">Where Career Services Should Focus Next</p>
        </div>
        <p className="text-sm text-muted-foreground">
          {focusDept.dept} has the lowest placement readiness ({focusDept.readiness}/100) of any department — consider
          targeted workshops. Meanwhile, {growingIndustry.industry} has the largest alumni presence ({growingIndustry.count} alumni),
          making it the strongest channel for new referral partnerships.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <p className="mb-4 font-semibold">Alumni Distribution by Industry</p>
        <div className="flex flex-col gap-4">
          {alumniByIndustry.map((i) => (
            <ProgressListItem key={i.industry} label={i.industry} count={i.count} pct={Math.round((i.count / totalIndustryAlumni) * 100)} />
          ))}
        </div>
      </div>
    </div>
  );
}
