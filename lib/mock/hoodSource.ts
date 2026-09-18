// Real Hood College network data, standing in for the generated mock dataset.
//
// lib/hood-data/hood_analysis.json is produced by the separate
// hood-college-network-reliable pipeline (fetch_hood_college.py ->
// select_targeted.py -> build_views.py), which pulls real LinkedIn profiles
// via Apify, filters to the agreed eligible programs + 7 states, and scores
// every job/connection match against Julia's rubric (see that repo's
// README). This module reshapes that JSON into the Student/Alumni/Company/
// Role types the rest of the app already expects, rather than fabricating
// data — where a field has no real signal (resume score, ATS score, salary),
// it's left undefined/zero instead of filled with a random plausible number.
import raw from "@/lib/hood-data/hood_analysis.json";
import type {
  Student, Alumni, Company, Role, EducationEntry, ExperienceEntry,
  SkillEntry, CertificationEntry, DerivedScores,
} from "./types";

const CURRENT_YEAR = 2026;

type HoodPerson = {
  id: string;
  name: string;
  type: "STUDENT" | "ALUMNI";
  headline: string | null;
  linkedin_url: string;
  location: string | null;
  degree: string | null;
  field_of_study: string | null;
  hood_start_year: number | null;
  hood_end_year: number | null;
  current_title: string | null;
  current_company: string | null;
  employers: string[];
  skills: string[];
  connections: number | null;
  followers: number | null;
  open_to_work: boolean;
  certifications: string[];
  program: string;
  program_tier: "Graduate" | "Undergrad";
  study_area: string;
  state: string | null;
  current_company_id: string | null;
  degree_family: string;
  city: string | null;
  industry: string | null;
  job_function: string | null;
};

type HoodCompany = {
  id: string;
  name: string;
  industry: string | null;
  open_roles: number;
  alumni_current: number;
  alumni_past: number;
};

type HoodJob = {
  id: string;
  name: string;
  company: string;
  location: string | null;
  url: string;
  industry: string | null;
  posted_at: string | null;
  job_function: string | null;
  student_skills_mentioned: string[];
};

type JobTableEntry = {
  student: string;
  top: {
    job: string;
    score: number;
    connection: number;
    referral: unknown[];
  }[];
};

const A = raw as {
  people: HoodPerson[];
  companies: HoodCompany[];
  jobs: HoodJob[];
  job_table: JobTableEntry[];
};

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "?";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return `${first}${last}`.toUpperCase();
}

function splitName(name: string): [string, string] {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return [parts[0] ?? name, parts.slice(1).join(" ") || parts[0] || name];
}

function parseLocation(p: HoodPerson): { city: string; state: string; country: string } {
  const text = p.location ?? "";
  const city = text.split(",")[0]?.trim() || text.trim();
  return { city: city || "Unknown", state: p.state ?? "", country: "United States" };
}

function toEducation(p: HoodPerson): EducationEntry {
  const end = p.hood_end_year ?? CURRENT_YEAR;
  return {
    schoolName: "Hood College",
    degree: p.degree || p.program,
    fieldOfStudy: p.field_of_study || p.study_area,
    startYear: p.hood_start_year ?? end - 2,
    endYear: end,
    skills: p.skills.slice(0, 4),
  };
}

/** Only real experience we have is the current role — one honest entry, not a fabricated history. */
function toExperience(p: HoodPerson): ExperienceEntry[] {
  if (!p.current_company) return [];
  return [{
    position: p.current_title || "",
    companyName: p.current_company,
    location: p.location || "",
    employmentType: "Full-time",
    workplaceType: "On-site",
    startDate: "",
    endDate: "Present",
    description: "",
    skills: p.skills.slice(0, 4),
  }];
}

function toSkills(p: HoodPerson): SkillEntry[] {
  // No real endorsement counts in the source data — 0 rather than a fabricated number.
  return p.skills.map((name) => ({ name, endorsements: 0 }));
}

function toCertifications(p: HoodPerson): CertificationEntry[] {
  return p.certifications.map((title) => ({ title, issuedAt: "", issuedBy: "LinkedIn" }));
}

/** Honest completeness: how much of this profile is actually filled in, not a random number. */
function completeness(p: HoodPerson): number {
  let score = 20;
  if (p.headline) score += 10;
  if (p.current_company) score += 15;
  if (p.skills.length > 0) score += Math.min(25, p.skills.length * 3);
  if (p.certifications.length > 0) score += 10;
  if (p.connections && p.connections > 0) score += 10;
  if (p.employers.length > 0) score += 10;
  return Math.min(100, score);
}

function networkReach(p: HoodPerson): number {
  return Math.min(100, Math.round((p.connections ?? 0) / 30));
}

const jobTableByStudent = new Map(A.job_table.map((j) => [j.student, j]));

function studentScores(p: HoodPerson): DerivedScores {
  const jt = jobTableByStudent.get(p.id);
  const topScore = jt?.top[0]?.score;
  return {
    studentMatchScore: topScore !== undefined ? Math.round(topScore) : undefined,
    careerFitScore: topScore !== undefined ? Math.round(topScore) : undefined,
    profileCompletenessScore: completeness(p),
    networkReachScore: networkReach(p),
  };
}

function alumniScores(p: HoodPerson): DerivedScores {
  return {
    profileCompletenessScore: completeness(p),
    networkReachScore: networkReach(p),
  };
}

export function hoodStudents(): Student[] {
  return A.people
    .filter((p) => p.type === "STUDENT")
    .map((p): Student => {
      const [firstName, lastName] = splitName(p.name);
      return {
        kind: "student",
        id: p.id,
        firstName,
        lastName,
        fullName: p.name,
        headline: p.headline || `${p.program} @ Hood College`,
        photoInitials: initials(p.name),
        location: parseLocation(p),
        verified: false,
        connectionsCount: p.connections ?? 0,
        followerCount: p.followers ?? 0,
        topSkills: p.skills.slice(0, 5),
        education: [toEducation(p)],
        experience: toExperience(p),
        skills: toSkills(p),
        certifications: toCertifications(p),
        projects: [],
        linkedinUrl: p.linkedin_url,
        registeredAt: "",
        scores: studentScores(p),
        gradYear: p.hood_end_year ?? CURRENT_YEAR + 1,
        major: p.program,
        dept: "Business",
        school: "Hood College",
        degree: p.degree || p.program,
        resumeUploaded: false,
        missingSkills: [],
        recommendedLearning: [],
        recommendedAlumniIds: [],
        recommendedRoleIds: [],
        employmentStatus: p.current_company ? "Employed" : "Job Seeking",
      };
    });
}

export function hoodAlumni(): Alumni[] {
  return A.people
    .filter((p) => p.type === "ALUMNI")
    .map((p): Alumni => {
      const [firstName, lastName] = splitName(p.name);
      return {
        kind: "alumni",
        id: p.id,
        firstName,
        lastName,
        fullName: p.name,
        headline: p.headline || `${p.current_title ?? ""} at ${p.current_company ?? ""}`.trim(),
        photoInitials: initials(p.name),
        location: parseLocation(p),
        verified: false,
        connectionsCount: p.connections ?? 0,
        followerCount: p.followers ?? 0,
        topSkills: p.skills.slice(0, 5),
        education: [toEducation(p)],
        experience: toExperience(p),
        skills: toSkills(p),
        certifications: toCertifications(p),
        projects: [],
        linkedinUrl: p.linkedin_url,
        registeredAt: "",
        scores: alumniScores(p),
        gradYear: p.hood_end_year ?? CURRENT_YEAR - 1,
        major: p.program,
        dept: "Business",
        school: "Hood College",
        degree: p.degree || p.program,
        currentCompany: p.current_company || "",
        currentTitle: p.current_title || "",
        openToWork: p.open_to_work,
        hiring: false,
        activityStatus: "Active",
        referralsGiven: 0,
        referralsSuccessful: 0,
        suggestedStudentIds: [],
      };
    });
}

export function hoodCompanies(): Company[] {
  return A.companies.map((c): Company => {
    const jobsHere = A.jobs.filter((j) => j.company === c.name);
    const skillSet = new Set<string>();
    for (const j of jobsHere) for (const s of j.student_skills_mentioned.slice(0, 6)) skillSet.add(s);
    return {
      id: c.id,
      name: c.name,
      industry: c.industry || "Other",
      size: "",
      initials: c.name.slice(0, 1).toUpperCase(),
      location: jobsHere[0]?.location || "",
      alumniCount: c.alumni_current + c.alumni_past,
      activeAlumniCount: c.alumni_current,
      openRoleCount: c.open_roles,
      requiredSkills: [...skillSet].slice(0, 6),
      // Real 6-month history isn't available from a single point-in-time pull —
      // today's open-role count repeated, an honest flat line rather than a
      // fabricated growth curve.
      hiringTrend: Array(6).fill(c.open_roles),
      hiringActivityScore: Math.min(99, c.open_roles * 4),
      departments: [],
    };
  });
}

const LEVEL_BY_KEYWORD: [RegExp, Role["level"]][] = [
  [/intern/i, "Intern"],
  [/entry|associate|coordinator/i, "Entry"],
  [/senior|lead|director|head|principal|vp|chief/i, "Senior"],
];

function levelOf(title: string): Role["level"] {
  for (const [re, level] of LEVEL_BY_KEYWORD) if (re.test(title)) return level;
  return "Mid";
}

function daysAgo(iso: string | null): number {
  if (!iso) return 0;
  const posted = new Date(iso).getTime();
  const now = new Date(`${CURRENT_YEAR}-09-18`).getTime();
  return Math.max(0, Math.round((now - posted) / 86400000));
}

const companyIdByName = new Map(A.companies.map((c) => [c.name, c.id]));

export function hoodRoles(): Role[] {
  const warmJobIds = new Set<string>();
  for (const jt of A.job_table) for (const top of jt.top) if (top.connection > 0 || top.referral.length > 0) warmJobIds.add(top.job);
  const alumniByCompany = new Map<string, number>();
  for (const p of A.people) {
    if (p.type === "ALUMNI" && p.current_company) {
      alumniByCompany.set(p.current_company, (alumniByCompany.get(p.current_company) ?? 0) + 1);
    }
  }
  return A.jobs.map((j): Role => ({
    id: j.id,
    title: j.name,
    dept: j.job_function?.split(",")[0]?.trim() || "",
    companyId: companyIdByName.get(j.company) || `co:${j.company.toLowerCase()}`,
    companyName: j.company,
    location: j.location || "",
    workplaceType: "On-site",
    level: levelOf(j.name),
    salaryMin: 0,
    salaryMax: 0,
    postedDaysAgo: daysAgo(j.posted_at),
    requiredSkills: j.student_skills_mentioned.slice(0, 6),
    warmPath: warmJobIds.has(j.id),
    alumniReach: alumniByCompany.get(j.company) ?? 0,
    applicationUrl: j.url,
  }));
}
