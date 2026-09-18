import type { Student, Alumni, Company, Role, AIInsight } from "./types";
import { EMERGING_SKILLS, DECLINING_SKILLS } from "./constants";

export function generateInsights(
  students: Student[],
  alumni: Alumni[],
  companies: Company[],
  roles: Role[],
): AIInsight[] {
  const insights: AIInsight[] = [];
  let idc = 0;
  const nextId = () => `insight_${++idc}`;

  // Matching: students highly matched to new roles
  const newRoles = roles.filter((r) => r.postedDaysAgo <= 7);
  const highMatchStudents = students.filter((s) => (s.scores.studentMatchScore ?? 0) >= 80);
  if (newRoles.length && highMatchStudents.length) {
    const topRole = [...newRoles].sort((a, b) => b.alumniReach - a.alumniReach)[0];
    insights.push({
      id: nextId(),
      category: "Matching",
      priority: "high",
      title: `${highMatchStudents.length} students are highly matched to newly opened roles`,
      detail: `Including ${Math.min(highMatchStudents.length, 40)} students matched 80%+ to the "${topRole.title}" role at ${topRole.companyName}, posted ${topRole.postedDaysAgo}d ago.`,
      actionLabel: "Review matches",
      actionHref: "/matching",
      createdAgo: "2h ago",
    });
  }

  // Hiring: industry momentum
  const industryTrend = new Map<string, number>();
  for (const c of companies) {
    const delta = c.hiringTrend[c.hiringTrend.length - 1] - c.hiringTrend[0];
    industryTrend.set(c.industry, (industryTrend.get(c.industry) ?? 0) + delta);
  }
  const sortedIndustries = [...industryTrend.entries()].sort((a, b) => b[1] - a[1]);
  if (sortedIndustries.length) {
    const [topIndustry, growth] = sortedIndustries[0];
    const pct = Math.max(4, Math.round((growth / 20) * 100));
    insights.push({
      id: nextId(),
      category: "Hiring",
      priority: "high",
      title: `${topIndustry} hiring is accelerating`,
      detail: `${topIndustry} roles across tracked employers grew roughly ${pct}% over the last 6 months, outpacing other industries.`,
      actionLabel: "View hiring trends",
      actionHref: "/analytics/hiring-trends",
      createdAgo: "6h ago",
    });
    const [slowIndustry] = sortedIndustries[sortedIndustries.length - 1];
    if (slowIndustry !== topIndustry) {
      insights.push({
        id: nextId(),
        category: "Hiring",
        priority: "medium",
        title: `${slowIndustry} hiring is slowing while ${topIndustry} accelerates`,
        detail: `Career services may want to rebalance outreach toward ${topIndustry} employers this quarter.`,
        actionLabel: "See industry breakdown",
        actionHref: "/analytics/hiring-trends",
        createdAgo: "1d ago",
      });
    }
  }

  // Referral: alumni who can refer today
  const hiringAlumni = alumni.filter((a) => a.hiring && a.activityStatus === "Active");
  const byCompany = new Map<string, Alumni[]>();
  for (const a of hiringAlumni) {
    byCompany.set(a.currentCompany, [...(byCompany.get(a.currentCompany) ?? []), a]);
  }
  const topReferralCompany = [...byCompany.entries()].sort((a, b) => b[1].length - a[1].length)[0];
  if (topReferralCompany) {
    const [companyName, list] = topReferralCompany;
    const matchable = students.filter((s) => (s.scores.studentMatchScore ?? 0) >= 70).length;
    insights.push({
      id: nextId(),
      category: "Referral",
      priority: "high",
      title: `${companyName} alumni can refer ${Math.min(matchable, list.length * 12)} students today`,
      detail: `${list.length} actively hiring alumni at ${companyName} have referral capacity for well-matched students.`,
      actionLabel: "Open referral intelligence",
      actionHref: "/analytics/referral-intelligence",
      createdAgo: "3h ago",
    });
  }

  // Skills: missing emerging skills
  const missingCount = students.filter((s) => s.missingSkills.length > 0).length;
  if (missingCount > 0) {
    const csStudents = students.filter((s) => s.dept === "Engineering");
    const skill = EMERGING_SKILLS[0];
    insights.push({
      id: nextId(),
      category: "Skills",
      priority: "medium",
      title: `Engineering students are missing ${skill} and related tooling`,
      detail: `${Math.min(missingCount, csStudents.length || missingCount)} students could close their top skill gap with a single short course.`,
      actionLabel: "View skill intelligence",
      actionHref: "/analytics/skill-intelligence",
      createdAgo: "1d ago",
    });
  }

  // Alumni: recent company changes (synthetic recency signal from experience[0].startDate)
  const recentMovers = alumni.filter((a) => a.experience[0]?.startDate?.includes("2026")).slice(0, 5);
  if (recentMovers.length >= 2) {
    const names = recentMovers.slice(0, 3).map((a) => a.fullName).join(", ");
    insights.push({
      id: nextId(),
      category: "Alumni",
      priority: "low",
      title: `${recentMovers.length} alumni recently changed companies`,
      detail: `${names}${recentMovers.length > 3 ? ", and others" : ""} started new roles this quarter — a good moment for outreach.`,
      actionLabel: "View alumni network",
      actionHref: "/alumni",
      createdAgo: "2d ago",
    });
  }

  // Placement: readiness
  const readyStudents = students.filter((s) => (s.scores.studentReadinessScore ?? 0) >= 85).length;
  if (readyStudents > 0) {
    insights.push({
      id: nextId(),
      category: "Placement",
      priority: "medium",
      title: `${readyStudents} students are fully placement-ready`,
      detail: `Resume, ATS compatibility, and skill coverage all score 85+. Prioritize these students for warm-path introductions.`,
      actionLabel: "View readiness list",
      actionHref: "/students?filter=ready",
      createdAgo: "5h ago",
    });
  }

  // Declining skill signal
  insights.push({
    id: nextId(),
    category: "Skills",
    priority: "low",
    title: `${DECLINING_SKILLS[0]} demand continues to decline`,
    detail: `Employers are posting fewer roles requiring ${DECLINING_SKILLS[0]}. Curriculum and workshop content may need refreshing.`,
    actionLabel: "See declining skills",
    actionHref: "/analytics/skill-intelligence",
    createdAgo: "3d ago",
  });

  return insights;
}
