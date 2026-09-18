import { hoodStudents, hoodAlumni, hoodCompanies, hoodRoles } from "./hoodSource";
import { generateInsights } from "./insights";
import { Rng } from "./seed";
import { INDUSTRIES, MONTHS, SKILLS, EMERGING_SKILLS, DECLINING_SKILLS, INSTITUTION } from "./constants";
import type { TimeSeriesPoint } from "./types";

// Module-level singleton: computed once per server process / client bundle load,
// so every screen reads the same consistent dataset. Real Hood College network
// data (see lib/mock/hoodSource.ts) in place of the generated mock population.
export const students = hoodStudents();
export const alumni = hoodAlumni();
export const companies = hoodCompanies();
export const roles = hoodRoles();

// Cross-link recommendations so profile pages feel coherent rather than random.
const rngLink = new Rng(5005);
for (const s of students) {
  const sameSchoolAlumni = alumni.filter((a) => a.school === s.school);
  s.recommendedAlumniIds = rngLink.pickN(sameSchoolAlumni.length ? sameSchoolAlumni : alumni, 3).map((a) => a.id);
  const matchingRoles = roles.filter((r) => r.requiredSkills.some((sk) => s.topSkills.includes(sk)));
  s.recommendedRoleIds = rngLink.pickN(matchingRoles.length ? matchingRoles : roles, 4).map((r) => r.id);
}
for (const a of alumni) {
  const sameSchoolStudents = students.filter((s) => s.school === a.school);
  a.suggestedStudentIds = rngLink.pickN(sameSchoolStudents.length ? sameSchoolStudents : students, 4).map((s) => s.id);
}

export const aiInsights = generateInsights(students, alumni, companies, roles);

export const institution = INSTITUTION;

// ---- Aggregate KPIs ----
export const kpis = {
  totalAlumni: alumni.length,
  activatedAlumni: alumni.filter((a) => a.activityStatus === "Active").length,
  pendingAlumni: alumni.filter((a) => a.activityStatus === "Dormant").length,
  totalStudents: students.length,
  totalCompanies: companies.length,
  openRoles: roles.length,
  networks: companies.length,
  successfulReferrals: alumni.reduce((s, a) => s + a.referralsSuccessful, 0),
  recentPlacements: Math.round(students.length * 0.12),
  verifiedAlumniPct: Math.round((alumni.filter((a) => a.verified).length / alumni.length) * 100),
  openToWorkAlumni: alumni.filter((a) => a.openToWork).length,
  profileCompletePct: Math.round(
    (alumni.filter((a) => a.scores.profileCompletenessScore >= 80).length / alumni.length) * 100,
  ),
  studentReadinessAvg: Math.round(
    students.reduce((s, st) => s + (st.scores.studentReadinessScore ?? 0), 0) / students.length,
  ),
};

export const activationRate = Math.round((kpis.activatedAlumni / kpis.totalAlumni) * 100);

// ---- Top companies hiring this week ----
export const topCompaniesHiring = [...companies]
  .sort((a, b) => b.hiringActivityScore - a.hiringActivityScore)
  .slice(0, 6)
  .map((c) => ({
    ...c,
    newRolesThisWeek: c.hiringTrend[c.hiringTrend.length - 1] - c.hiringTrend[c.hiringTrend.length - 2],
  }));

// ---- Time series: hiring activation trend (last 6 months) ----
const rngTs = new Rng(6006);
export const activationTrend: TimeSeriesPoint[] = MONTHS.slice(0, 6).map((m, i) => ({
  label: m,
  activated: 80 + i * 14 + rngTs.int(-10, 10),
  pending: 40 + i * 5 + rngTs.int(-8, 8),
}));

// ---- Alumni by industry ----
export const alumniByIndustry = INDUSTRIES.map((industry) => {
  const count = alumni.filter((a) => {
    const co = companies.find((c) => c.name === a.currentCompany);
    return co?.industry === industry;
  }).length;
  return { industry, count };
}).sort((a, b) => b.count - a.count);

// ---- Hiring trend by industry (6 months) ----
export const hiringTrendByIndustry: TimeSeriesPoint[] = MONTHS.slice(0, 6).map((m, i) => {
  const point: TimeSeriesPoint = { label: m };
  for (const industry of INDUSTRIES.slice(0, 5)) {
    const companiesInIndustry = companies.filter((c) => c.industry === industry);
    const total = companiesInIndustry.reduce((s, c) => s + (c.hiringTrend[i] ?? 0), 0);
    point[industry] = total;
  }
  return point;
});

// ---- Skill demand ----
export const skillDemand = SKILLS.map((skill) => {
  const studentCount = students.filter((s) => s.topSkills.includes(skill) || s.skills.some((x) => x.name === skill)).length;
  const roleCount = roles.filter((r) => r.requiredSkills.includes(skill)).length;
  return { skill, studentCount, roleCount, gap: roleCount - studentCount };
}).sort((a, b) => b.roleCount - a.roleCount);

export const emergingSkills = EMERGING_SKILLS;
export const decliningSkills = DECLINING_SKILLS;

// ---- Department comparison (students) ----
export const departmentStats = [...new Set(students.map((s) => s.dept))].map((dept) => {
  const deptStudents = students.filter((s) => s.dept === dept);
  const readiness = Math.round(
    deptStudents.reduce((s, st) => s + (st.scores.studentReadinessScore ?? 0), 0) / deptStudents.length,
  );
  return { dept, count: deptStudents.length, readiness };
}).sort((a, b) => b.readiness - a.readiness);

// ---- Lookups ----
export const studentById = (id: string) => students.find((s) => s.id === id);
export const alumniById = (id: string) => alumni.find((a) => a.id === id);
export const companyById = (id: string) => companies.find((c) => c.id === id);
export const roleById = (id: string) => roles.find((r) => r.id === id);
export const rolesByCompany = (companyId: string) => roles.filter((r) => r.companyId === companyId);
export const alumniByCompany = (companyName: string) => alumni.filter((a) => a.currentCompany === companyName);

// ---- Matching engine: rank students for a given role ----
export function rankStudentsForRole(roleId: string, limit = 20) {
  const role = roleById(roleId);
  if (!role) return [];
  return [...students]
    .map((s) => {
      const skillOverlap = role.requiredSkills.filter((sk) => s.topSkills.includes(sk) || s.skills.some((x) => x.name === sk));
      const skillMatch = Math.round((skillOverlap.length / Math.max(role.requiredSkills.length, 1)) * 100);
      const educationMatch = s.dept === role.dept ? 92 : 60;
      const experienceMatch = s.experience.length > 0 ? 78 : 45;
      const resumeQuality = s.scores.resumeScore ?? 50;
      const overall = Math.round(skillMatch * 0.4 + educationMatch * 0.25 + experienceMatch * 0.2 + resumeQuality * 0.15);
      const missingSkills = role.requiredSkills.filter((sk) => !s.topSkills.includes(sk) && !s.skills.some((x) => x.name === sk));
      return {
        student: s,
        overall,
        skillMatch,
        educationMatch,
        experienceMatch,
        resumeQuality,
        missingSkills,
        why: [
          skillOverlap.length > 0 ? `Matches ${skillOverlap.length}/${role.requiredSkills.length} required skills (${skillOverlap.slice(0, 3).join(", ")})` : `Limited overlap with required skills`,
          s.dept === role.dept ? `${s.dept} background aligns with this ${role.dept} role` : `Different academic department (${s.dept})`,
          `Resume quality score of ${resumeQuality}`,
        ],
      };
    })
    .sort((a, b) => b.overall - a.overall)
    .slice(0, limit);
}
