import { Compass, Award } from "lucide-react";
import { ProgressListItem } from "@/components/shared/progress-list-item";
import { students, alumni, departmentStats } from "@/lib/mock";
import { MAJORS } from "@/lib/mock/constants";

export default function CareerIntelligencePage() {
  const avgCareerFit = Math.round(students.reduce((s, st) => s + (st.scores.careerFitScore ?? 0), 0) / students.length);

  const careerPaths = MAJORS.slice(0, 6).map((m) => {
    const majorAlumni = alumni.filter((a) => a.major === m.name);
    const companyCounts = new Map<string, number>();
    for (const a of majorAlumni) companyCounts.set(a.currentCompany, (companyCounts.get(a.currentCompany) ?? 0) + 1);
    const topCompany = [...companyCounts.entries()].sort((a, b) => b[1] - a[1])[0];
    return { major: m.name, topCompany: topCompany?.[0] ?? "—", count: majorAlumni.length };
  });

  return (
    <div>
      <div className="mb-6 rounded-2xl border border-border bg-card p-5">
        <div className="mb-1 flex items-center gap-2">
          <Compass className="size-4 text-primary" />
          <p className="font-semibold">Average Career Fit Score</p>
        </div>
        <p className="text-3xl font-bold">{avgCareerFit}<span className="text-base text-muted-foreground">/100</span></p>
        <p className="text-sm text-muted-foreground">Across all students, based on skills, education, and target-role alignment.</p>
      </div>

      <div className="mb-6 rounded-2xl border border-border bg-card p-5">
        <p className="mb-4 font-semibold">Placement Performance by Department</p>
        <div className="flex flex-col gap-4">
          {departmentStats.map((d) => (
            <ProgressListItem key={d.dept} label={d.dept} count={d.readiness} pct={d.readiness} />
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center gap-2">
          <Award className="size-4 text-primary" />
          <p className="font-semibold">Common Career Paths by Major</p>
        </div>
        <div className="flex flex-col divide-y divide-border">
          {careerPaths.map((c) => (
            <div key={c.major} className="flex items-center justify-between py-2.5 first:pt-0 text-sm">
              <span className="font-medium">{c.major}</span>
              <span className="text-muted-foreground">{c.count} alumni · most common employer: <strong className="text-foreground">{c.topCompany}</strong></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
