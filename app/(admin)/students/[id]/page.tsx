import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft, MapPin, Code2, ExternalLink, FileText, BookOpen, Briefcase, Users,
} from "lucide-react";
import { AvatarBadge } from "@/components/shared/avatar-badge";
import { ScoreRing } from "@/components/shared/score-ring";
import { Badge } from "@/components/ui/badge";
import { students, alumniById, roleById } from "@/lib/mock";

export default async function StudentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const person = students.find((s) => s.id === id);
  if (!person) notFound();

  const recommendedAlumni = person.recommendedAlumniIds.map(alumniById).filter((a): a is NonNullable<typeof a> => !!a);
  const recommendedRoles = person.recommendedRoleIds.map(roleById).filter((r): r is NonNullable<typeof r> => !!r);

  return (
    <div>
      <Link href="/students" className="mb-4 flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" /> Back to Student Directory
      </Link>

      <div className="mb-6 flex flex-wrap items-start gap-5 rounded-2xl border border-border bg-card p-6">
        <AvatarBadge label={person.fullName} size="lg" />
        <div className="flex-1 min-w-[220px]">
          <h1 className="text-xl font-bold">{person.fullName}</h1>
          <p className="text-sm text-muted-foreground">{person.headline}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="size-3.5" /> {person.location.city}, {person.location.state}
            </span>
            <span>·</span>
            <span>{person.dept}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="secondary">{person.employmentStatus}</Badge>
            {person.resumeUploaded && <Badge className="bg-tint-green-bg text-tint-green-fg">Resume Uploaded</Badge>}
            {person.githubUrl && (
              <a href={person.githubUrl} className="flex items-center gap-1 rounded-full border border-border px-2.5 py-0.5 text-xs hover:bg-accent">
                <Code2 className="size-3" /> GitHub
              </a>
            )}
            <a href={person.linkedinUrl} className="flex items-center gap-1 rounded-full border border-border px-2.5 py-0.5 text-xs hover:bg-accent">
              <ExternalLink className="size-3" /> LinkedIn
            </a>
          </div>
        </div>
        <div className="flex gap-4">
          <ScoreRing value={person.scores.studentMatchScore ?? 0} label="Career Match" />
          <ScoreRing value={person.scores.resumeScore ?? 0} label="Resume" />
          <ScoreRing value={person.scores.atsScore ?? 0} label="ATS" />
          <ScoreRing value={person.scores.studentReadinessScore ?? 0} label="Readiness" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Section title="Education">
            {person.education.map((ed, i) => (
              <div key={i}>
                <p className="text-sm font-semibold">{ed.schoolName}</p>
                <p className="text-sm text-muted-foreground">{ed.degree} — {ed.fieldOfStudy}</p>
                <p className="text-xs text-muted-foreground">{ed.startYear} – {ed.endYear}</p>
              </div>
            ))}
          </Section>

          {person.experience.length > 0 && (
            <Section title="Experience">
              <div className="flex flex-col gap-4">
                {person.experience.map((exp, i) => (
                  <div key={i}>
                    <p className="text-sm font-semibold">{exp.position}</p>
                    <p className="text-sm text-muted-foreground">{exp.companyName} · {exp.location}</p>
                    <p className="text-xs text-muted-foreground">{exp.startDate} – {exp.endDate}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {person.projects.length > 0 && (
            <Section title="Projects">
              <div className="flex flex-col gap-4">
                {person.projects.map((p, i) => (
                  <div key={i}>
                    <p className="text-sm font-semibold">{p.title}</p>
                    <p className="text-sm text-muted-foreground">{p.description}</p>
                    <p className="text-xs text-muted-foreground">{p.duration}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          <Section title="Skills">
            <div className="flex flex-wrap gap-2">
              {person.skills.map((s) => (
                <span key={s.name} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">
                  {s.name}
                </span>
              ))}
            </div>
          </Section>

          {person.certifications.length > 0 && (
            <Section title="Certifications">
              {person.certifications.map((c, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span>{c.title}</span>
                  <span className="text-xs text-muted-foreground">{c.issuedAt}</span>
                </div>
              ))}
            </Section>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-tint-amber-fg/30 bg-tint-amber-bg/30 p-5">
            <div className="mb-2 flex items-center gap-2">
              <BookOpen className="size-4 text-tint-amber-fg" />
              <p className="text-sm font-semibold">Skill Gap & Recommended Learning</p>
            </div>
            {person.missingSkills.length === 0 ? (
              <p className="text-sm text-muted-foreground">No significant skill gaps detected.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {person.missingSkills.map((skill, i) => (
                  <div key={skill} className="flex items-center justify-between text-sm">
                    <span className="font-medium">{skill}</span>
                    <span className="text-xs text-muted-foreground">{person.recommendedLearning[i]}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Section title="Recommended Alumni">
            <div className="flex flex-col gap-3">
              {recommendedAlumni.map((a) => (
                <Link key={a.id} href={`/alumni/${a.id}`} className="flex items-center gap-3 hover:opacity-80">
                  <AvatarBadge label={a.fullName} size="sm" />
                  <div>
                    <p className="text-sm font-medium">{a.fullName}</p>
                    <p className="text-xs text-muted-foreground">{a.currentTitle} at {a.currentCompany}</p>
                  </div>
                </Link>
              ))}
            </div>
          </Section>

          <Section title="Recommended Jobs">
            <div className="flex flex-col gap-3">
              {recommendedRoles.map((r) => (
                <Link key={r.id} href={`/roles/${r.id}`} className="flex items-center justify-between hover:opacity-80">
                  <div>
                    <p className="text-sm font-medium">{r.title}</p>
                    <p className="text-xs text-muted-foreground">{r.companyName}</p>
                  </div>
                  <Briefcase className="size-3.5 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </Section>

          <div className="rounded-2xl border border-border bg-accent/40 p-5">
            <div className="mb-2 flex items-center gap-2">
              <FileText className="size-4 text-primary" />
              <p className="text-sm font-semibold">Resume Status</p>
            </div>
            <StatRow label="ATS compatibility" value={`${person.scores.atsScore ?? 0}/100`} />
            <StatRow label="Profile completeness" value={`${person.scores.profileCompletenessScore}%`} />
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
    <div className="mt-2 flex items-center justify-between text-sm">
      <span className="flex items-center gap-1.5 text-muted-foreground">
        <Users className="size-3.5" /> {label}
      </span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
