import { Rng } from "./seed";
import {
  MAJORS, DEGREES, LOCATIONS, COMPANIES, SKILLS, ROLE_TITLES,
  FIRST_NAMES, LAST_NAMES, MONTHS, EMERGING_SKILLS,
} from "./constants";
import type {
  Student, Alumni, Company, Role, EducationEntry, ExperienceEntry,
  SkillEntry, CertificationEntry, ProjectEntry, Location,
} from "./types";

const CURRENT_YEAR = 2026;

function initials(first: string, last: string) {
  return `${first[0]}${last[0]}`.toUpperCase();
}

function makeLocation(rng: Rng): Location {
  const loc = rng.pick(LOCATIONS);
  return { city: loc.city, state: loc.state, country: "United States" };
}

function makeEducation(rng: Rng, major: (typeof MAJORS)[number], gradYear: number): EducationEntry {
  return {
    schoolName: `Columbia University — ${major.school}`,
    degree: rng.pick(DEGREES),
    fieldOfStudy: major.name,
    startYear: gradYear - 4,
    endYear: gradYear,
    skills: rng.pickN(SKILLS, rng.int(2, 4)),
  };
}

function makeExperience(rng: Rng, n: number, current?: { company: string; title: string }): ExperienceEntry[] {
  const entries: ExperienceEntry[] = [];
  for (let i = 0; i < n; i++) {
    const isCurrent = i === 0 && !!current;
    const role = isCurrent
      ? { title: current!.title, dept: "" }
      : rng.pick(ROLE_TITLES);
    const company = isCurrent ? current!.company : rng.pick(COMPANIES).name;
    const startYear = CURRENT_YEAR - i - rng.int(0, 1);
    entries.push({
      position: role.title,
      companyName: company,
      location: `${rng.pick(LOCATIONS).city}, ${rng.pick(LOCATIONS).state}`,
      employmentType: rng.weighted([["Full-time", 0.85], ["Internship", 0.1], ["Contract", 0.05]]),
      workplaceType: rng.weighted([["On-site", 0.45], ["Hybrid", 0.35], ["Remote", 0.2]]),
      startDate: `${rng.pick(MONTHS)} ${startYear}`,
      endDate: i === 0 ? "Present" : `${rng.pick(MONTHS)} ${startYear + 1}`,
      description: `Contributed to core initiatives, collaborating cross-functionally to drive measurable outcomes.`,
      skills: rng.pickN(SKILLS, rng.int(2, 4)),
    });
  }
  return entries;
}

function makeSkills(rng: Rng, pool: string[], n: number): SkillEntry[] {
  return rng.pickN(pool, n).map((name) => ({ name, endorsements: rng.int(1, 60) }));
}

function makeCertifications(rng: Rng): CertificationEntry[] {
  const count = rng.int(0, 2);
  const titles = ["AWS Certified Solutions Architect", "PMP Certification", "Google Data Analytics", "CFA Level I", "Tableau Desktop Specialist"];
  return rng.pickN(titles, count).map((title) => ({
    title,
    issuedAt: `${rng.pick(MONTHS)} ${rng.int(2023, 2026)}`,
    issuedBy: "LinkedIn Learning",
  }));
}

function makeProjects(rng: Rng): ProjectEntry[] {
  const count = rng.int(0, 2);
  const titles = ["Campus Sustainability Dashboard", "NLP Sentiment Classifier", "Peer Tutoring Marketplace", "Alumni Mentorship Matcher", "Market Risk Simulator"];
  return rng.pickN(titles, count).map((title) => ({
    title,
    description: "Independent project applying coursework to a real-world dataset and stakeholder need.",
    duration: `${rng.int(2, 6)} months`,
  }));
}

export function generateStudents(seed: number, count: number): Student[] {
  const rng = new Rng(seed);
  const students: Student[] = [];
  for (let i = 0; i < count; i++) {
    const first = rng.pick(FIRST_NAMES);
    const last = rng.pick(LAST_NAMES);
    const major = rng.pick(MAJORS);
    const gradYear = rng.int(CURRENT_YEAR, CURRENT_YEAR + 3);
    const topSkills = rng.pickN(SKILLS, 5);
    const missingSkills = rng.bool(0.55) ? rng.pickN(EMERGING_SKILLS, rng.int(1, 2)) : [];
    const completeness = rng.int(35, 100);
    students.push({
      kind: "student",
      id: `stu_${i + 1}`,
      firstName: first,
      lastName: last,
      fullName: `${first} ${last}`,
      headline: `${major.name} @ Columbia University · Class of ${gradYear}`,
      photoInitials: initials(first, last),
      location: makeLocation(rng),
      verified: rng.bool(0.4),
      connectionsCount: rng.int(30, 500),
      followerCount: rng.int(20, 600),
      topSkills,
      education: [makeEducation(rng, major, gradYear)],
      experience: makeExperience(rng, rng.int(0, 2)),
      skills: makeSkills(rng, SKILLS, rng.int(4, 9)),
      certifications: makeCertifications(rng),
      projects: makeProjects(rng),
      linkedinUrl: `https://www.linkedin.com/in/${first.toLowerCase()}-${last.toLowerCase()}`,
      registeredAt: `${rng.pick(MONTHS)} ${rng.int(2023, 2026)}`,
      gradYear,
      major: major.name,
      dept: major.dept,
      school: major.school,
      degree: rng.pick(DEGREES),
      githubUrl: rng.bool(0.6) ? `https://github.com/${first.toLowerCase()}${last.toLowerCase()}` : undefined,
      resumeUploaded: rng.bool(0.8),
      missingSkills,
      recommendedLearning: missingSkills.map((s) => `Intro to ${s}`),
      recommendedAlumniIds: [],
      recommendedRoleIds: [],
      employmentStatus: rng.weighted([
        ["Job Seeking", 0.4], ["Interning", 0.2], ["Employed", 0.15], ["Not Seeking", 0.25],
      ]),
      scores: {
        studentMatchScore: rng.int(45, 98),
        careerFitScore: rng.int(40, 95),
        skillGapScore: rng.int(30, 100),
        resumeScore: rng.int(40, 96),
        atsScore: rng.int(40, 95),
        studentReadinessScore: rng.int(35, 97),
        profileCompletenessScore: completeness,
        networkReachScore: rng.int(20, 90),
      },
    });
  }
  return students;
}

export function generateAlumni(seed: number, count: number): Alumni[] {
  const rng = new Rng(seed);
  const alumni: Alumni[] = [];
  for (let i = 0; i < count; i++) {
    const first = rng.pick(FIRST_NAMES);
    const last = rng.pick(LAST_NAMES);
    const major = rng.pick(MAJORS);
    const gradYear = rng.int(CURRENT_YEAR - 25, CURRENT_YEAR - 1);
    const companyPick = rng.pick(COMPANIES);
    const currentTitle = rng.pick(ROLE_TITLES).title;
    const hiring = rng.bool(0.3);
    const completeness = rng.int(50, 100);
    alumni.push({
      kind: "alumni",
      id: `alu_${i + 1}`,
      firstName: first,
      lastName: last,
      fullName: `${first} ${last}`,
      headline: `${currentTitle} at ${companyPick.name}`,
      photoInitials: initials(first, last),
      location: makeLocation(rng),
      verified: rng.bool(0.65),
      connectionsCount: rng.int(150, 3000),
      followerCount: rng.int(100, 5000),
      topSkills: rng.pickN(SKILLS, 5),
      education: [makeEducation(rng, major, gradYear)],
      experience: makeExperience(rng, rng.int(1, 4), { company: companyPick.name, title: currentTitle }),
      skills: makeSkills(rng, SKILLS, rng.int(5, 12)),
      certifications: makeCertifications(rng),
      projects: [],
      linkedinUrl: `https://www.linkedin.com/in/${first.toLowerCase()}-${last.toLowerCase()}`,
      registeredAt: `${rng.pick(MONTHS)} ${rng.int(2018, 2025)}`,
      gradYear,
      major: major.name,
      dept: major.dept,
      school: major.school,
      degree: rng.pick(DEGREES),
      currentCompany: companyPick.name,
      currentTitle,
      openToWork: rng.bool(0.15),
      hiring,
      activityStatus: rng.weighted([["Active", 0.68], ["Dormant", 0.32]]),
      referralsGiven: rng.int(0, 30),
      referralsSuccessful: rng.int(0, 12),
      suggestedStudentIds: [],
      scores: {
        alumniMatchScore: rng.int(40, 98),
        companyAffinityScore: rng.int(40, 99),
        hiringActivityScore: hiring ? rng.int(55, 99) : rng.int(10, 50),
        alumniEngagementScore: rng.int(30, 99),
        profileCompletenessScore: completeness,
        networkReachScore: rng.int(30, 95),
        referralProbability: rng.float(0.05, 0.95),
      },
    });
  }
  return alumni;
}

export function generateCompanies(seed: number): Company[] {
  const rng = new Rng(seed);
  return COMPANIES.map((c, i) => {
    const alumniCount = rng.int(8, 320);
    const activeAlumniCount = Math.round(alumniCount * rng.float(0.4, 0.85));
    const trend: number[] = [];
    let base = rng.int(2, 20);
    for (let m = 0; m < 6; m++) {
      base = Math.max(0, base + rng.int(-2, 4));
      trend.push(base);
    }
    return {
      id: `co_${i + 1}`,
      name: c.name,
      industry: c.industry,
      size: c.size,
      initials: c.name.slice(0, 1).toUpperCase(),
      location: rng.pick(LOCATIONS).city,
      alumniCount,
      activeAlumniCount,
      openRoleCount: rng.int(1, 24),
      requiredSkills: rng.pickN(SKILLS, rng.int(3, 6)),
      hiringTrend: trend,
      hiringActivityScore: rng.int(20, 99),
      departments: rng.pickN(["Engineering", "Product", "Data", "Finance", "Design", "Marketing", "Consulting"], rng.int(2, 4)),
    };
  });
}

export function generateRoles(seed: number, companies: Company[], count: number): Role[] {
  const rng = new Rng(seed);
  const roles: Role[] = [];
  for (let i = 0; i < count; i++) {
    const company = rng.pick(companies);
    const roleTitle = rng.pick(ROLE_TITLES);
    const level = rng.weighted<Role["level"]>([["Intern", 0.15], ["Entry", 0.35], ["Mid", 0.35], ["Senior", 0.15]]);
    const salaryBase = { Intern: 25, Entry: 85, Mid: 130, Senior: 175 }[level];
    const salaryMin = salaryBase + rng.int(-10, 5);
    roles.push({
      id: `role_${i + 1}`,
      title: roleTitle.title,
      dept: roleTitle.dept,
      companyId: company.id,
      companyName: company.name,
      location: rng.pick(LOCATIONS).city,
      workplaceType: rng.weighted([["On-site", 0.4], ["Hybrid", 0.35], ["Remote", 0.25]]),
      level,
      salaryMin: salaryMin * 1000,
      salaryMax: (salaryMin + rng.int(15, 45)) * 1000,
      postedDaysAgo: rng.int(0, 30),
      requiredSkills: rng.pickN(company.requiredSkills.length ? company.requiredSkills : SKILLS, rng.int(2, 5)),
      warmPath: rng.bool(0.35),
      alumniReach: rng.int(5, 250),
      applicationUrl: `https://${company.name.toLowerCase().replace(/[^a-z0-9]/g, "")}.com/careers/${i + 1}`,
    });
  }
  return roles;
}
