import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Briefcase, Users, TrendingUp } from "lucide-react";
import { AvatarBadge } from "@/components/shared/avatar-badge";
import { MultiLineTrend } from "@/components/shared/trend-chart";
import { Badge } from "@/components/ui/badge";
import { companies, alumniByCompany, rolesByCompany, students } from "@/lib/mock";
import { MONTHS } from "@/lib/mock/constants";

export default async function CompanyProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const company = companies.find((c) => c.id === id);
  if (!company) notFound();

  const companyAlumni = alumniByCompany(company.name);
  const companyRoles = rolesByCompany(company.id);
  const trendData = company.hiringTrend.map((v, i) => ({ label: MONTHS[i], roles: v }));

  const matchedStudents = [...students]
    .map((s) => ({
      student: s,
      overlap: company.requiredSkills.filter((sk) => s.topSkills.includes(sk) || s.skills.some((x) => x.name === sk)).length,
    }))
    .filter((m) => m.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, 6);

  return (
    <div>
      <Link href="/companies" className="mb-4 flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" /> Back to Companies
      </Link>

      <div className="mb-6 flex flex-wrap items-start gap-5 rounded-2xl border border-border bg-card p-6">
        <AvatarBadge label={company.name} size="lg" />
        <div className="flex-1 min-w-[220px]">
          <h1 className="text-xl font-bold">{company.name}</h1>
          <p className="text-sm text-muted-foreground">{company.industry} · {company.size} employees</p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="size-3.5" /> {company.location}</span>
            <span>·</span>
            <span>{company.departments.join(", ")}</span>
          </div>
        </div>
        <div className="flex gap-6 text-center">
          <Stat label="Alumni" value={company.alumniCount} />
          <Stat label="Active" value={company.activeAlumniCount} />
          <Stat label="Open Roles" value={company.openRoleCount} />
          <Stat label="Hiring Score" value={company.hiringActivityScore} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Section title="Hiring Trend (6 months)">
            <MultiLineTrend data={trendData} keys={[{ key: "roles", label: "Open roles", color: "var(--chart-1)" }]} height={220} />
          </Section>

          <Section title={`Open Roles (${companyRoles.length})`}>
            <div className="flex flex-col divide-y divide-border">
              {companyRoles.slice(0, 8).map((r) => (
                <Link key={r.id} href={`/roles/${r.id}`} className="flex items-center justify-between py-3 first:pt-0 hover:opacity-80">
                  <div>
                    <p className="text-sm font-semibold">{r.title}</p>
                    <p className="text-xs text-muted-foreground">{r.location} · {r.workplaceType} · {r.level}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="size-3.5" /> {r.alumniReach}
                  </div>
                </Link>
              ))}
              {companyRoles.length === 0 && <p className="text-sm text-muted-foreground">No open roles currently tracked.</p>}
            </div>
          </Section>

          <Section title="Matched Students">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {matchedStudents.map(({ student, overlap }) => (
                <Link key={student.id} href={`/students/${student.id}`} className="flex items-center gap-3 rounded-xl border border-border p-3 hover:bg-accent/40">
                  <AvatarBadge label={student.fullName} />
                  <div>
                    <p className="text-sm font-medium">{student.fullName}</p>
                    <p className="text-xs text-muted-foreground">{overlap} matching skill{overlap !== 1 ? "s" : ""}</p>
                  </div>
                </Link>
              ))}
            </div>
          </Section>
        </div>

        <div className="flex flex-col gap-6">
          <Section title="Required Skills">
            <div className="flex flex-wrap gap-2">
              {company.requiredSkills.map((s) => (
                <Badge key={s} variant="secondary">{s}</Badge>
              ))}
            </div>
          </Section>

          <Section title="Alumni at this Company">
            <div className="flex flex-col gap-3">
              {companyAlumni.slice(0, 6).map((a) => (
                <Link key={a.id} href={`/alumni/${a.id}`} className="flex items-center gap-3 hover:opacity-80">
                  <AvatarBadge label={a.fullName} size="sm" />
                  <div>
                    <p className="text-sm font-medium">{a.fullName}</p>
                    <p className="text-xs text-muted-foreground">{a.currentTitle}</p>
                  </div>
                </Link>
              ))}
            </div>
          </Section>

          <div className="rounded-2xl border border-border bg-accent/40 p-5">
            <div className="mb-2 flex items-center gap-2">
              <TrendingUp className="size-4 text-primary" />
              <p className="text-sm font-semibold">Industry Insight</p>
            </div>
            <p className="text-sm text-muted-foreground">
              {company.name} is part of the {company.industry} sector, currently tracking {company.openRoleCount} open roles
              with a hiring activity score of {company.hiringActivityScore}/100 — {company.hiringActivityScore >= 60 ? "well above" : "below"} platform average.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-2 flex items-center gap-2">
              <Briefcase className="size-4 text-primary" />
              <p className="text-sm font-semibold">Departments</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {company.departments.map((d) => (
                <Badge key={d} variant="secondary">{d}</Badge>
              ))}
            </div>
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

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
