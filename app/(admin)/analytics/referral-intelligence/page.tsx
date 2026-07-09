import { Share2, Users, CheckCircle2 } from "lucide-react";
import { KpiCard } from "@/components/shared/kpi-card";
import { AvatarBadge } from "@/components/shared/avatar-badge";
import { alumni, kpis } from "@/lib/mock";

export default function ReferralIntelligencePage() {
  const totalGiven = alumni.reduce((s, a) => s + a.referralsGiven, 0);
  const conversionRate = Math.round((kpis.successfulReferrals / Math.max(totalGiven, 1)) * 100);
  const topReferrers = [...alumni]
    .filter((a) => a.hiring && a.activityStatus === "Active")
    .sort((a, b) => (b.scores.referralProbability ?? 0) - (a.scores.referralProbability ?? 0))
    .slice(0, 8);

  return (
    <div>
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KpiCard icon={Share2} label="Referrals Given" value={totalGiven} tint="blue" />
        <KpiCard icon={CheckCircle2} label="Successful Referrals" value={kpis.successfulReferrals} tint="green" />
        <KpiCard icon={Users} label="Conversion Rate" value={`${conversionRate}%`} tint="purple" />
        <KpiCard icon={Share2} label="Alumni Actively Hiring" value={alumni.filter((a) => a.hiring).length} tint="amber" />
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <p className="mb-4 font-semibold">Alumni With Highest Referral Capacity Today</p>
        <div className="flex flex-col divide-y divide-border">
          {topReferrers.map((a) => (
            <div key={a.id} className="flex items-center justify-between py-3 first:pt-0">
              <div className="flex items-center gap-3">
                <AvatarBadge label={a.fullName} />
                <div>
                  <p className="text-sm font-semibold">{a.fullName}</p>
                  <p className="text-xs text-muted-foreground">{a.currentTitle} at {a.currentCompany}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-tint-green-fg">{Math.round((a.scores.referralProbability ?? 0) * 100)}% likely</p>
                <p className="text-xs text-muted-foreground">{a.referralsSuccessful} successful referrals</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
