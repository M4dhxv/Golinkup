import { TrendingUp, TrendingDown } from "lucide-react";
import { MultiLineTrend } from "@/components/shared/trend-chart";
import { AvatarBadge } from "@/components/shared/avatar-badge";
import { hiringTrendByIndustry, companies, topCompaniesHiring } from "@/lib/mock";
import { INDUSTRIES } from "@/lib/mock/constants";

export default function HiringTrendsPage() {
  const industryGrowth = INDUSTRIES.slice(0, 5).map((industry) => {
    const companiesInIndustry = companies.filter((c) => c.industry === industry);
    const start = companiesInIndustry.reduce((s, c) => s + c.hiringTrend[0], 0);
    const end = companiesInIndustry.reduce((s, c) => s + c.hiringTrend[c.hiringTrend.length - 1], 0);
    const pct = start > 0 ? Math.round(((end - start) / start) * 100) : 0;
    return { industry, pct };
  }).sort((a, b) => b.pct - a.pct);

  return (
    <div>
      <div className="mb-6 rounded-2xl border border-border bg-card p-5">
        <p className="mb-4 font-semibold">Hiring Volume by Industry (6 months)</p>
        <MultiLineTrend
          data={hiringTrendByIndustry}
          keys={INDUSTRIES.slice(0, 5).map((industry, i) => ({ key: industry, label: industry }))}
          height={300}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="mb-4 font-semibold">Industry Momentum</p>
          <div className="flex flex-col divide-y divide-border">
            {industryGrowth.map((i) => (
              <div key={i.industry} className="flex items-center justify-between py-2.5 first:pt-0 text-sm">
                <span className="font-medium">{i.industry}</span>
                <span className={`flex items-center gap-1 font-semibold ${i.pct >= 0 ? "text-tint-green-fg" : "text-tint-rose-fg"}`}>
                  {i.pct >= 0 ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
                  {i.pct >= 0 ? "+" : ""}{i.pct}%
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="mb-4 font-semibold">Top Companies Hiring</p>
          <div className="flex flex-col divide-y divide-border">
            {topCompaniesHiring.map((c) => (
              <div key={c.id} className="flex items-center gap-3 py-2.5 first:pt-0">
                <AvatarBadge label={c.name} size="sm" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.industry}</p>
                </div>
                <span className="text-sm font-semibold text-tint-green-fg">+{Math.max(c.newRolesThisWeek, 0)} roles</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
