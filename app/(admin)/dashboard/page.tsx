import Link from "next/link";
import { UserPlus, UserCheck, Clock, Briefcase, Share2, ArrowRight, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { AttentionCard } from "@/components/shared/attention-card";
import { AvatarBadge } from "@/components/shared/avatar-badge";
import { InsightCard } from "@/components/shared/insight-card";
import { kpis, topCompaniesHiring, aiInsights } from "@/lib/mock";

export default function DashboardPage() {
  const pendingInvites = kpis.pendingAlumni;
  const newRolesThisWeek = topCompaniesHiring.reduce((s, c) => s + Math.max(c.newRolesThisWeek, 0), 0);
  const newActivations = Math.round(kpis.activatedAlumni * 0.02);
  const topInsights = aiInsights.slice(0, 3);

  return (
    <div>
      <PageHeader
        title="Good morning, Sarah! 👋"
        subtitle="Your network is growing. Here's what's happening at Hood College."
        actions={
          <button className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-brand-forest-light">
            <UserPlus className="size-4" /> Add Alumni
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <KpiCard icon={UserCheck} label="Total Alumni" value={kpis.totalAlumni.toLocaleString()} tint="blue" href="/alumni" />
        <KpiCard
          icon={UserCheck}
          label="Activated"
          value={kpis.activatedAlumni.toLocaleString()}
          subtext={`${Math.round((kpis.activatedAlumni / kpis.totalAlumni) * 100)}% activation rate`}
          tint="green"
          href="/alumni"
        />
        <KpiCard
          icon={Clock}
          label="Pending"
          value={kpis.pendingAlumni.toLocaleString()}
          subtext="awaiting activation"
          tint="amber"
          href="/alumni"
        />
        <KpiCard
          icon={Briefcase}
          label="Open Roles"
          value={kpis.openRoles.toLocaleString()}
          subtext="available across alumni employers"
          tint="indigo"
          href="/roles"
        />
        <KpiCard
          icon={Share2}
          label="Networks"
          value={kpis.networks.toLocaleString()}
          subtext="companies employing alumni"
          tint="purple"
          href="/companies"
        />
      </div>

      <p className="mb-3 mt-8 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Needs Attention</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <AttentionCard
          icon={Clock}
          value={pendingInvites}
          label="pending invites"
          tag="Urgent"
          actionLabel="Resend"
          href="/alumni?filter=pending"
          tint="amber"
          urgent
        />
        <AttentionCard
          icon={Briefcase}
          value={newRolesThisWeek}
          label="new roles this week"
          actionLabel="Review"
          href="/roles?filter=new"
          tint="blue"
        />
        <AttentionCard
          icon={UserCheck}
          value={newActivations}
          label="new activations"
          actionLabel="View"
          href="/alumni?filter=active"
          tint="green"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <p className="font-semibold">Top Companies Hiring This Week</p>
              <p className="text-sm text-muted-foreground">New roles added in the last 7 days</p>
            </div>
            <Link href="/companies" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
              View all <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <div className="flex flex-col divide-y divide-border">
            {topCompaniesHiring.map((c) => (
              <Link
                key={c.id}
                href={`/companies/${c.id}`}
                className="flex items-center gap-3 py-3 first:pt-0 last:pb-0 hover:opacity-80"
              >
                <AvatarBadge label={c.name} />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.alumniCount} alumni</p>
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold text-tint-green-fg">
                  <TrendingUp className="size-3.5" />
                  {c.newRolesThisWeek >= 0 ? "+" : ""}
                  {c.newRolesThisWeek} new roles
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-4 flex items-start justify-between">
            <p className="font-semibold">This Week&apos;s Summary</p>
            <span className="text-sm text-muted-foreground">Jul 3 – Jul 9</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <SummaryStat label="Invites Sent" value="156" subtext="124 via import · 32 manual" />
            <SummaryStat label="Activations" value="47" subtext="68% conversion rate" />
            <SummaryStat label="Roles Added" value={newRolesThisWeek.toString()} subtext="across active employers" />
            <SummaryStat label="Activation Rate" value={`${Math.round((kpis.activatedAlumni / kpis.totalAlumni) * 100)}%`} subtext="platform-wide" />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <p className="font-semibold">Recent AI Insights</p>
          <Link href="/insights" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            View all insights <ArrowRight className="size-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {topInsights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SummaryStat({ label, value, subtext }: { label: string; value: string; subtext: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold tracking-tight">{value}</p>
      <p className="text-xs text-muted-foreground">{subtext}</p>
    </div>
  );
}
