import { Share2, Network, Eye, Users } from "lucide-react";
import { KpiCard } from "@/components/shared/kpi-card";
import { ProgressListItem } from "@/components/shared/progress-list-item";
import { alumni, companies } from "@/lib/mock";

export default function NetworkInsightsPage() {
  const avgConnections = Math.round(alumni.reduce((s, a) => s + a.connectionsCount, 0) / alumni.length);
  const avgReach = Math.round(alumni.reduce((s, a) => s + (a.scores.networkReachScore ?? 0), 0) / alumni.length);
  const topCompaniesByReach = [...companies].sort((a, b) => b.alumniCount - a.alumniCount).slice(0, 6);
  const totalAlumniAtTop = topCompaniesByReach.reduce((s, c) => s + c.alumniCount, 0);

  return (
    <div>
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KpiCard icon={Users} label="Avg. Connections" value={avgConnections} tint="blue" />
        <KpiCard icon={Network} label="Avg. Network Reach Score" value={avgReach} tint="green" />
        <KpiCard icon={Share2} label="Second-Degree Reach" value="1,240" subtext="derived alumni connections" tint="purple" />
        <KpiCard icon={Eye} label="Profile Card Views" value="34" subtext="per active alumnus / week" tint="amber" />
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <p className="mb-4 font-semibold">Network Concentration by Company</p>
        <div className="flex flex-col gap-4">
          {topCompaniesByReach.map((c) => (
            <ProgressListItem key={c.id} label={c.name} count={c.alumniCount} pct={Math.round((c.alumniCount / totalAlumniAtTop) * 100)} />
          ))}
        </div>
      </div>
    </div>
  );
}
