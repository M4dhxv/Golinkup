import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, DollarSign, Clock, Share2, ExternalLink, Target } from "lucide-react";
import { AvatarBadge } from "@/components/shared/avatar-badge";
import { ScoreRing } from "@/components/shared/score-ring";
import { Badge } from "@/components/ui/badge";
import { roles, companyById, rankStudentsForRole } from "@/lib/mock";

export default async function RoleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const role = roles.find((r) => r.id === id);
  if (!role) notFound();

  const company = companyById(role.companyId);
  const ranked = rankStudentsForRole(role.id, 8);

  return (
    <div>
      <Link href="/roles" className="mb-4 flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" /> Back to Open Roles
      </Link>

      <div className="mb-6 flex flex-wrap items-start gap-5 rounded-2xl border border-border bg-card p-6">
        <AvatarBadge label={role.companyName} size="lg" />
        <div className="flex-1 min-w-[220px]">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">{role.title}</h1>
            {role.warmPath && (
              <Badge className="bg-tint-green-bg text-tint-green-fg">
                <Share2 className="mr-1 size-3" /> Warm Path
              </Badge>
            )}
          </div>
          <Link href={`/companies/${role.companyId}`} className="text-sm text-muted-foreground hover:underline">
            {role.companyName} · {role.dept}
          </Link>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="size-3.5" /> {role.location}</span>
            <span className="flex items-center gap-1"><DollarSign className="size-3.5" /> ${Math.round(role.salaryMin / 1000)}k – ${Math.round(role.salaryMax / 1000)}k</span>
            <span className="flex items-center gap-1"><Clock className="size-3.5" /> Posted {role.postedDaysAgo}d ago</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="secondary">{role.level}</Badge>
            <Badge variant="secondary">{role.workplaceType}</Badge>
          </div>
        </div>
        <a
          href={role.applicationUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-brand-forest-light"
        >
          View Posting <ExternalLink className="size-3.5" />
        </a>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Section title="Ranked Matched Students">
            <div className="flex flex-col divide-y divide-border">
              {ranked.map(({ student, overall, skillMatch, educationMatch, experienceMatch, missingSkills, why }) => (
                <div key={student.id} className="flex flex-col gap-3 py-4 first:pt-0">
                  <div className="flex items-center justify-between">
                    <Link href={`/students/${student.id}`} className="flex items-center gap-3 hover:opacity-80">
                      <AvatarBadge label={student.fullName} />
                      <div>
                        <p className="text-sm font-semibold">{student.fullName}</p>
                        <p className="text-xs text-muted-foreground">{student.major} · Class of {student.gradYear}</p>
                      </div>
                    </Link>
                    <ScoreRing value={overall} size={44} label="Overall" />
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-xs text-muted-foreground">
                    <span>Skill match: <strong className="text-foreground">{skillMatch}</strong></span>
                    <span>Education: <strong className="text-foreground">{educationMatch}</strong></span>
                    <span>Experience: <strong className="text-foreground">{experienceMatch}</strong></span>
                  </div>
                  {missingSkills.length > 0 && (
                    <p className="text-xs text-tint-amber-fg">Missing: {missingSkills.join(", ")}</p>
                  )}
                  <div className="rounded-xl bg-secondary/60 p-3 text-xs text-muted-foreground">
                    <div className="mb-1 flex items-center gap-1 font-semibold text-foreground">
                      <Target className="size-3" /> Why this match
                    </div>
                    <ul className="list-inside list-disc space-y-0.5">
                      {why.map((w, i) => <li key={i}>{w}</li>)}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>

        <div className="flex flex-col gap-6">
          <Section title="Required Skills">
            <div className="flex flex-wrap gap-2">
              {role.requiredSkills.map((s) => (
                <Badge key={s} variant="secondary">{s}</Badge>
              ))}
            </div>
          </Section>

          {company && (
            <Section title="About the Company">
              <Link href={`/companies/${company.id}`} className="flex items-center gap-3 hover:opacity-80">
                <AvatarBadge label={company.name} />
                <div>
                  <p className="text-sm font-semibold">{company.name}</p>
                  <p className="text-xs text-muted-foreground">{company.industry} · {company.size}</p>
                </div>
              </Link>
              <p className="mt-3 text-sm text-muted-foreground">
                {company.alumniCount} Columbia alumni work here, {company.activeAlumniCount} of whom are active on GoLinkUp.
              </p>
            </Section>
          )}

          <div className="rounded-2xl border border-border bg-accent/40 p-5">
            <div className="mb-2 flex items-center gap-2">
              <Share2 className="size-4 text-primary" />
              <p className="text-sm font-semibold">Referral Opportunity</p>
            </div>
            <p className="text-sm text-muted-foreground">
              {role.alumniReach} alumni connections can reach this role.{" "}
              {role.warmPath ? "A warm path has been identified for top-matched students." : "No confirmed warm path yet — consider alumni outreach."}
            </p>
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
