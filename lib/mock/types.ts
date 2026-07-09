// Types mirror the GoLinkUp Data Dictionary categories:
// Alumni/Student Profile, Experience, Education, Skills, Certifications,
// Projects, Connection Graph, Job/Opportunity, Institution, and Derived/AI Fields.

export type Location = { city: string; state: string; country: string };

export type ExperienceEntry = {
  position: string;
  companyName: string;
  location: string;
  employmentType: "Full-time" | "Part-time" | "Internship" | "Contract";
  workplaceType: "On-site" | "Hybrid" | "Remote";
  startDate: string; // "Jan 2024"
  endDate: string; // "Present" or "May 2023"
  description: string;
  skills: string[];
};

export type EducationEntry = {
  schoolName: string;
  degree: string;
  fieldOfStudy: string;
  startYear: number;
  endYear: number;
  skills: string[];
};

export type SkillEntry = { name: string; endorsements: number };
export type CertificationEntry = { title: string; issuedAt: string; issuedBy: string };
export type ProjectEntry = { title: string; description: string; duration: string };

export type DerivedScores = {
  studentMatchScore?: number;
  alumniMatchScore?: number;
  referralProbability?: number;
  careerFitScore?: number;
  skillGapScore?: number;
  resumeScore?: number;
  atsScore?: number;
  companyAffinityScore?: number;
  hiringActivityScore?: number;
  alumniEngagementScore?: number;
  studentReadinessScore?: number;
  profileCompletenessScore: number;
  networkReachScore?: number;
};

export type PersonBase = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  headline: string;
  photoInitials: string;
  location: Location;
  verified: boolean;
  connectionsCount: number;
  followerCount: number;
  topSkills: string[];
  education: EducationEntry[];
  experience: ExperienceEntry[];
  skills: SkillEntry[];
  certifications: CertificationEntry[];
  projects: ProjectEntry[];
  linkedinUrl: string;
  registeredAt: string;
  scores: DerivedScores;
};

export type Student = PersonBase & {
  kind: "student";
  gradYear: number;
  major: string;
  dept: string;
  school: string;
  degree: string;
  githubUrl?: string;
  resumeUploaded: boolean;
  missingSkills: string[];
  recommendedLearning: string[];
  recommendedAlumniIds: string[];
  recommendedRoleIds: string[];
  employmentStatus: "Job Seeking" | "Interning" | "Employed" | "Not Seeking";
};

export type Alumni = PersonBase & {
  kind: "alumni";
  gradYear: number;
  major: string;
  dept: string;
  school: string;
  degree: string;
  currentCompany: string;
  currentTitle: string;
  openToWork: boolean;
  hiring: boolean;
  activityStatus: "Active" | "Dormant";
  referralsGiven: number;
  referralsSuccessful: number;
  suggestedStudentIds: string[];
};

export type Company = {
  id: string;
  name: string;
  industry: string;
  size: string;
  initials: string;
  location: string;
  alumniCount: number;
  activeAlumniCount: number;
  openRoleCount: number;
  requiredSkills: string[];
  hiringTrend: number[]; // last 6 months role counts
  hiringActivityScore: number;
  departments: string[];
};

export type Role = {
  id: string;
  title: string;
  dept: string;
  companyId: string;
  companyName: string;
  location: string;
  workplaceType: "On-site" | "Hybrid" | "Remote";
  level: "Intern" | "Entry" | "Mid" | "Senior";
  salaryMin: number;
  salaryMax: number;
  postedDaysAgo: number;
  requiredSkills: string[];
  warmPath: boolean;
  alumniReach: number;
  applicationUrl: string;
};

export type TimeSeriesPoint = { label: string; [key: string]: number | string };

export type AIInsight = {
  id: string;
  category: "Matching" | "Hiring" | "Referral" | "Skills" | "Alumni" | "Placement";
  priority: "high" | "medium" | "low";
  title: string;
  detail: string;
  actionLabel: string;
  actionHref: string;
  createdAgo: string;
};
