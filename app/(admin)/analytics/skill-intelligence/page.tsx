import { Flame, TrendingDown, BookOpen } from "lucide-react";
import { ProgressListItem } from "@/components/shared/progress-list-item";
import { Badge } from "@/components/ui/badge";
import { skillDemand, emergingSkills, decliningSkills, departmentStats } from "@/lib/mock";

export default function SkillIntelligencePage() {
  const mostCommon = skillDemand.slice(0, 8);
  const topGaps = [...skillDemand].sort((a, b) => b.gap - a.gap).slice(0, 6);
  const maxCount = mostCommon[0]?.studentCount || 1;

  return (
    <div>
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="mb-4 font-semibold">Most Common Student Skills</p>
          <div className="flex flex-col gap-4">
            {mostCommon.map((s) => (
              <ProgressListItem key={s.skill} label={s.skill} count={s.studentCount} pct={Math.round((s.studentCount / maxCount) * 100)} />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-tint-green-fg/30 bg-tint-green-bg/30 p-5">
            <div className="mb-3 flex items-center gap-2">
              <Flame className="size-4 text-tint-green-fg" />
              <p className="font-semibold">Emerging Skills</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {emergingSkills.map((s) => (
                <Badge key={s} className="bg-tint-green-bg text-tint-green-fg">{s}</Badge>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-tint-rose-fg/30 bg-tint-rose-bg/30 p-5">
            <div className="mb-3 flex items-center gap-2">
              <TrendingDown className="size-4 text-tint-rose-fg" />
              <p className="font-semibold">Declining Skills</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {decliningSkills.map((s) => (
                <Badge key={s} className="bg-tint-rose-bg text-tint-rose-fg">{s}</Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center gap-2">
          <BookOpen className="size-4 text-primary" />
          <p className="font-semibold">Top Skill Gaps (industry demand vs. student supply)</p>
        </div>
        <div className="flex flex-col divide-y divide-border">
          {topGaps.map((g) => (
            <div key={g.skill} className="flex items-center justify-between py-2.5 first:pt-0 text-sm">
              <span className="font-medium">{g.skill}</span>
              <span className="text-muted-foreground">
                {g.roleCount} roles require it · {g.studentCount} students have it
              </span>
              <Badge variant={g.gap > 0 ? "destructive" : "secondary"}>{g.gap > 0 ? `Gap of ${g.gap}` : "Covered"}</Badge>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <p className="mb-4 font-semibold">Department Readiness Comparison</p>
        <div className="flex flex-col gap-4">
          {departmentStats.map((d) => (
            <ProgressListItem key={d.dept} label={`${d.dept} (${d.count} students)`} count={d.readiness} pct={d.readiness} />
          ))}
        </div>
      </div>
    </div>
  );
}
