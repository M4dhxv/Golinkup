import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft, MapPin, BadgeCheck, Briefcase, Building2, Share2, Users, Mail,
} from "lucide-react";
import { AvatarBadge } from "@/components/shared/avatar-badge";
import { ScoreRing } from "@/components/shared/score-ring";
import { Badge } from "@/components/ui/badge";
import { alumni, companies, studentById } from "@/lib/mock";

export default async function AlumniProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const person = alumni.find((a) => a.id === id);
  if (!person) notFound();

  const company = companies.find((c) => c.name === person.currentCompany);
  const suggestedStudents = person.suggestedStudentIds.map(studentById).filter((s): s is NonNullable<typeof s> => !!s);

  return (
    <div>
      <Link href="/alumni" className="mb-4 flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" /> Back to Alumni Network
      </Link>

      <div className="mb-6 flex flex-wrap items-start gap-5 rounded-2xl border border-border bg-card p-6">
        <AvatarBadge label={person.fullName} size="lg" />
        <div className="flex-1 min-w-[220px]">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">{person.fullName}</h1>
            {person.verified && <BadgeCheck className="size-4.5 text-tint-blue-fg" />}
          </div>
          <p className="text-sm text-muted-foreground">{person.headline}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="size-3.5" /> {person.location.city}, {person.location.state}
            </span>
            <span>·</span>
            <span>Class of {person.gradYear}</span>
            <span>·</span>
            <span>{person.school}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant={person.activityStatus === "Active" ? "default" : "secondary"}>{person.activityStatus}</Badge>
            {person.hiring && <Badge className="bg-tint-green-bg text-tint-green-fg">Actively Hiring</Badge>}
            {person.openToWork && <Badge className="bg-tint-amber-bg text-tint-amber-fg">Open to Work</Badge>}
          </div>
        </div>
        <div className="flex gap-4">
          <ScoreRing value={person.scores.alumniMatchScore ?? 0} label="Match" />
          <ScoreRing value={person.scores.alumniEngagementScore ?? 0} label="Engagement" />
          <ScoreRing value={person.scores.companyAffinityScore ?? 0} label="Affinity" />
          <ScoreRing value={person.scores.networkReachScore ?? 0} label="Reach" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Section title="Career History">
            <div className="flex flex-col gap-4">
              {person.experience.map((exp, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center pt-1">
                    <span className="size-2.5 rounded-full bg-primary" />
                    {i < person.experience.length - 1 && <span className="mt-1 w-px flex-1 bg-border" />}
                  </div>
                  <div className="pb-2">
                    <p className="text-sm font-semibold">{exp.position}</p>
                    <p className="text-sm text-muted-foreground">
                      {exp.companyName} · {exp.location}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {exp.startDate} – {exp.endDate} · {exp.employmentType} · {exp.workplaceType}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Education">
            {person.education.map((ed, i) => (
              <div key={i}>
                <p className="text-sm font-semibold">{ed.schoolName}</p>
                <p className="text-sm text-muted-foreground">{ed.degree} — {ed.fieldOfStudy}</p>
                <p className="text-xs text-muted-foreground">{ed.startYear} – {ed.endYear}</p>
              </div>
            ))}
          </Section>

          <Section title="Skills & Endorsements">
            <div className="flex flex-wrap gap-2">
              {person.skills.map((s) => (
                <span key={s.name} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">
                  {s.name} <span className="text-muted-foreground">· {s.endorsements}</span>
                </span>
              ))}
            </div>
          </Section>
        </div>

        <div className="flex flex-col gap-6">
          {company && (
            <Section title="Current Company">
              <Link href={`/companies/${company.id}`} className="flex items-center gap-3 hover:opacity-80">
                <AvatarBadge label={company.name} />
                <div>
                  <p className="text-sm font-semibold">{company.name}</p>
                  <p className="text-xs text-muted-foreground">{company.industry} · {company.size}</p>
                </div>
              </Link>
              <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Briefcase className="size-3.5" /> {company.openRoleCount} open roles
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Building2 className="size-3.5" /> {company.alumniCount} alumni total
              </div>
            </Section>
          )}

          <Section title="Hiring Activity">
            <StatRow label="Hiring status" value={person.hiring ? "Actively hiring" : "Not currently hiring"} />
            <StatRow label="Hiring activity score" value={`${person.scores.hiringActivityScore ?? 0}/100`} />
          </Section>

          <Section title="Referral History">
            <StatRow label="Referrals given" value={person.referralsGiven} />
            <StatRow label="Successful referrals" value={person.referralsSuccessful} />
            <StatRow label="Referral probability" value={`${Math.round((person.scores.referralProbability ?? 0) * 100)}%`} />
          </Section>

          <Section title="Suggested Students">
            <div className="flex flex-col gap-3">
              {suggestedStudents.map((s) => (
                <Link key={s.id} href={`/students/${s.id}`} className="flex items-center gap-3 hover:opacity-80">
                  <AvatarBadge label={s.fullName} size="sm" />
                  <div>
                    <p className="text-sm font-medium">{s.fullName}</p>
                    <p className="text-xs text-muted-foreground">{s.major} · Class of {s.gradYear}</p>
                  </div>
                </Link>
              ))}
            </div>
          </Section>

          <div className="rounded-2xl border border-border bg-accent/40 p-5">
            <div className="mb-2 flex items-center gap-2">
              <Share2 className="size-4 text-primary" />
              <p className="text-sm font-semibold">Recommended Outreach</p>
            </div>
            <p className="mb-3 text-sm text-muted-foreground">
              {person.fullName} is {person.activityStatus.toLowerCase()} and has referral capacity — a good candidate for warm-path introductions this week.
            </p>
            <button className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground hover:bg-brand-forest-light">
              <Mail className="size-3.5" /> Draft outreach
            </button>
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
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="flex items-center gap-1.5 text-muted-foreground">
        <Users className="size-3.5" /> {label}
      </span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
