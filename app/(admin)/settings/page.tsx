import { GraduationCap, Layers, DollarSign, Users } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { AvatarBadge } from "@/components/shared/avatar-badge";
import { Badge } from "@/components/ui/badge";
import { NotificationPreferences } from "@/components/settings/notification-preferences";
import { institution } from "@/lib/mock";

const teamMembers = [
  { name: "Sarah Chen", role: "Director, Career Services", email: "s.chen@columbia.edu" },
  { name: "Marcus Diallo", role: "Employer Relations Lead", email: "m.diallo@columbia.edu" },
  { name: "Priya Nair", role: "Career Advisor", email: "p.nair@columbia.edu" },
  { name: "Tom Alvarez", role: "Data & Analytics Lead", email: "t.alvarez@columbia.edu" },
];

export default function SettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your institution profile, team, and preferences." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Section title="Institution Profile">
            <div className="flex items-center gap-4">
              <span className="flex size-14 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                CU
              </span>
              <div>
                <p className="font-semibold">{institution.name}</p>
                <p className="text-sm text-muted-foreground">{institution.alumniBaseSize.toLocaleString()} alumni base size</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Stat icon={GraduationCap} label="Alumni Base" value={institution.alumniBaseSize.toLocaleString()} />
              <Stat icon={Layers} label="Tier" value={institution.tier} />
              <Stat icon={DollarSign} label="Subscription" value={institution.subscriptionPrice} />
              <Stat icon={Users} label="Pipeline Stage" value={institution.pipelineStage} />
            </div>
          </Section>

          <Section title="Team Members">
            <div className="flex flex-col divide-y divide-border">
              {teamMembers.map((m) => (
                <div key={m.email} className="flex items-center justify-between py-3 first:pt-0">
                  <div className="flex items-center gap-3">
                    <AvatarBadge label={m.name} />
                    <div>
                      <p className="text-sm font-medium">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.role}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{m.email}</span>
                </div>
              ))}
            </div>
            <button className="mt-4 w-fit rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-accent">
              Invite team member
            </button>
          </Section>

          <Section title="Notification Preferences">
            <NotificationPreferences />
          </Section>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-border bg-accent/40 p-5">
            <p className="mb-2 font-semibold">Billing</p>
            <p className="text-sm text-muted-foreground">
              {institution.tier} · {institution.subscriptionPrice}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Annual giving baseline: {institution.givingBaseline}</p>
            <Badge className="mt-3 bg-tint-green-bg text-tint-green-fg">{institution.pipelineStage}</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="mb-4 font-semibold">{title}</p>
      {children}
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof GraduationCap; label: string; value: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="size-3.5" /> {label}
      </div>
      <p className="font-semibold">{value}</p>
    </div>
  );
}
