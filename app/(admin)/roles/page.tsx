import { Download, Briefcase, Building2, Users, Clock, Sparkles, Globe } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { RolesDirectory } from "@/components/roles/roles-directory";
import { roles, companies } from "@/lib/mock";

export default function RolesPage() {
  const companiesHiring = new Set(roles.map((r) => r.companyId)).size;
  const alumniReach = roles.reduce((s, r) => s + r.alumniReach, 0);
  const newThisWeek = roles.filter((r) => r.postedDaysAgo <= 7).length;
  const uniquePositions = new Set(roles.map((r) => r.title)).size;
  const remoteRoles = roles.filter((r) => r.workplaceType === "Remote").length;
  const remotePct = Math.round((remoteRoles / roles.length) * 100);

  return (
    <div>
      <PageHeader
        title="Open Roles"
        subtitle={`Track emerging roles, hiring trends, and alumni-powered opportunities across the network — ${roles.length} roles across ${companies.length} companies`}
        actions={
          <button className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-accent">
            <Download className="size-3.5" /> Export
          </button>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <KpiCard icon={Briefcase} label="Total Roles" value={roles.length} subtext="Platform-wide" tint="blue" />
        <KpiCard icon={Building2} label="Companies Hiring" value={companiesHiring} subtext="Unique companies" tint="green" />
        <KpiCard icon={Users} label="Alumni Reach" value={alumniReach.toLocaleString()} subtext="Total connections" tint="purple" />
        <KpiCard icon={Clock} label="New This Week" value={newThisWeek} subtext="Posted recently" tint="amber" />
        <KpiCard icon={Sparkles} label="New Role Types" value={uniquePositions} subtext="Unique positions" tint="indigo" highlighted />
        <KpiCard icon={Globe} label="Remote Roles" value={remoteRoles} subtext={`${remotePct}% of total`} tint="rose" />
      </div>

      <RolesDirectory roles={roles} companies={companies} />
    </div>
  );
}
