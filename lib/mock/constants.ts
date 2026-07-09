export const INSTITUTION = {
  name: "Columbia University",
  alumniBaseSize: 18400,
  tier: "Tier 1",
  subscriptionPrice: "$4,200/mo",
  givingBaseline: "$3.1M annual giving",
  pipelineStage: "Signed" as const,
};

export const SCHOOLS = [
  "Columbia College",
  "School of Engineering and Applied Science (SEAS)",
  "Columbia Business School",
  "School of International and Public Affairs (SIPA)",
  "Graduate School of Journalism",
  "Columbia Law School",
  "Mailman School of Public Health",
  "Graduate School of Arts and Sciences (GSAS)",
];

export const MAJORS = [
  { name: "Computer Science", dept: "Engineering", school: "School of Engineering and Applied Science (SEAS)" },
  { name: "Data Science", dept: "Engineering", school: "School of Engineering and Applied Science (SEAS)" },
  { name: "Operations Research", dept: "Engineering", school: "School of Engineering and Applied Science (SEAS)" },
  { name: "Biomedical Engineering", dept: "Engineering", school: "School of Engineering and Applied Science (SEAS)" },
  { name: "Electrical Engineering", dept: "Engineering", school: "School of Engineering and Applied Science (SEAS)" },
  { name: "Economics", dept: "Arts & Sciences", school: "Columbia College" },
  { name: "Political Science", dept: "Arts & Sciences", school: "Columbia College" },
  { name: "Psychology", dept: "Arts & Sciences", school: "Columbia College" },
  { name: "Statistics", dept: "Arts & Sciences", school: "Columbia College" },
  { name: "History", dept: "Arts & Sciences", school: "Columbia College" },
  { name: "Financial Economics", dept: "Business", school: "Columbia Business School" },
  { name: "MBA", dept: "Business", school: "Columbia Business School" },
  { name: "International Affairs", dept: "SIPA", school: "School of International and Public Affairs (SIPA)" },
  { name: "Journalism", dept: "Journalism", school: "Graduate School of Journalism" },
  { name: "Public Health", dept: "Public Health", school: "Mailman School of Public Health" },
  { name: "Computer Science (MS)", dept: "Engineering", school: "School of Engineering and Applied Science (SEAS)" },
];

export const DEGREES = ["B.A.", "B.S.", "M.S.", "M.B.A.", "M.P.A.", "Ph.D."];

export const INDUSTRIES = [
  "Technology",
  "Finance",
  "Healthcare",
  "Consulting",
  "Media & Publishing",
  "Government & Policy",
  "Nonprofit",
  "Consumer & Retail",
  "Biotech & Pharma",
  "Energy & Climate",
];

export const LOCATIONS = [
  { city: "New York", state: "NY" },
  { city: "San Francisco", state: "CA" },
  { city: "Jersey City", state: "NJ" },
  { city: "Boston", state: "MA" },
  { city: "Washington", state: "DC" },
  { city: "Seattle", state: "WA" },
  { city: "Austin", state: "TX" },
  { city: "Chicago", state: "IL" },
  { city: "Los Angeles", state: "CA" },
  { city: "Remote", state: "" },
];

export const COMPANIES = [
  { name: "Google", industry: "Technology", size: "100,000+" },
  { name: "Meta", industry: "Technology", size: "70,000+" },
  { name: "Microsoft", industry: "Technology", size: "220,000+" },
  { name: "Amazon", industry: "Technology", size: "1,500,000+" },
  { name: "NVIDIA", industry: "Technology", size: "29,000+" },
  { name: "OpenAI", industry: "Technology", size: "2,000+" },
  { name: "Stripe", industry: "Technology", size: "8,000+" },
  { name: "Bloomberg", industry: "Media & Publishing", size: "20,000+" },
  { name: "Goldman Sachs", industry: "Finance", size: "45,000+" },
  { name: "Morgan Stanley", industry: "Finance", size: "80,000+" },
  { name: "J.P. Morgan", industry: "Finance", size: "290,000+" },
  { name: "BlackRock", industry: "Finance", size: "20,000+" },
  { name: "Citadel", industry: "Finance", size: "4,000+" },
  { name: "McKinsey & Company", industry: "Consulting", size: "45,000+" },
  { name: "Boston Consulting Group", industry: "Consulting", size: "32,000+" },
  { name: "Bain & Company", industry: "Consulting", size: "18,000+" },
  { name: "Memorial Sloan Kettering", industry: "Healthcare", size: "22,000+" },
  { name: "NewYork-Presbyterian", industry: "Healthcare", size: "48,000+" },
  { name: "Pfizer", industry: "Biotech & Pharma", size: "83,000+" },
  { name: "Regeneron", industry: "Biotech & Pharma", size: "12,000+" },
  { name: "The New York Times", industry: "Media & Publishing", size: "5,800+" },
  { name: "Condé Nast", industry: "Media & Publishing", size: "6,000+" },
  { name: "United Nations", industry: "Government & Policy", size: "37,000+" },
  { name: "U.S. Department of State", industry: "Government & Policy", size: "75,000+" },
  { name: "Teach For America", industry: "Nonprofit", size: "3,000+" },
  { name: "Robin Hood Foundation", industry: "Nonprofit", size: "150+" },
  { name: "DoorDash", industry: "Consumer & Retail", size: "10,000+" },
  { name: "Warby Parker", industry: "Consumer & Retail", size: "3,000+" },
  { name: "Tesla", industry: "Energy & Climate", size: "140,000+" },
  { name: "Brookfield Renewable", industry: "Energy & Climate", size: "5,000+" },
  { name: "Ramp", industry: "Technology", size: "1,000+" },
  { name: "Anthropic", industry: "Technology", size: "1,500+" },
];

export const SKILLS = [
  "Python", "SQL", "React", "TypeScript", "Java", "C++", "Machine Learning",
  "Deep Learning", "Data Analysis", "Financial Modeling", "Excel", "PowerPoint",
  "Product Strategy", "Project Management", "Public Speaking", "Docker",
  "Kubernetes", "AWS", "GCP", "PyTorch", "TensorFlow", "Natural Language Processing",
  "A/B Testing", "Tableau", "Power BI", "Statistics", "R", "Go", "System Design",
  "Negotiation", "Salesforce", "Figma", "UX Research", "Regulatory Compliance",
  "Clinical Research", "Policy Analysis", "Grant Writing", "Journalism Ethics",
  "Investigative Reporting", "Investment Analysis", "Valuation", "Risk Management",
];

export const EMERGING_SKILLS = [
  "LLM Fine-tuning", "Prompt Engineering", "RAG Systems", "AI Agents",
  "Vector Databases", "MLOps", "Kubernetes", "Docker", "Climate Risk Modeling",
  "Generative AI", "LangChain",
];

export const DECLINING_SKILLS = [
  "Flash", "jQuery", "Manual QA Testing", "Legacy ETL", "Waterfall PM",
];

export const ROLE_TITLES = [
  { title: "Software Engineer", dept: "Engineering" },
  { title: "Senior Software Engineer", dept: "Engineering" },
  { title: "Data Scientist", dept: "Data" },
  { title: "Machine Learning Engineer", dept: "Data" },
  { title: "Product Manager", dept: "Product" },
  { title: "Associate Product Manager", dept: "Product" },
  { title: "Investment Banking Analyst", dept: "Finance" },
  { title: "Equity Research Associate", dept: "Finance" },
  { title: "Management Consultant", dept: "Consulting" },
  { title: "Business Analyst", dept: "Consulting" },
  { title: "UX Designer", dept: "Design" },
  { title: "Marketing Manager", dept: "Marketing" },
  { title: "Policy Analyst", dept: "Policy" },
  { title: "Clinical Research Coordinator", dept: "Healthcare" },
  { title: "Journalist", dept: "Media" },
  { title: "AI Research Engineer", dept: "Data" },
  { title: "Solutions Architect", dept: "Engineering" },
  { title: "Growth Analyst", dept: "Marketing" },
];

export const FIRST_NAMES = [
  "Jordan", "Alex", "Maya", "Sam", "Priya", "Wei", "Sofia", "Daniel", "Emma",
  "Liam", "Noah", "Olivia", "Aisha", "Carlos", "Yuki", "Isabella", "Ethan",
  "Zoe", "Kwame", "Nina", "Raj", "Lucas", "Mia", "Aiden", "Fatima", "Marcus",
  "Grace", "Diego", "Hana", "Theo", "Amara", "Felix", "Chloe", "Omar", "Ravi",
  "Sasha", "Leo", "Ines", "Jamal", "Clara",
];

export const LAST_NAMES = [
  "Smith", "Chen", "Patel", "Garcia", "Kim", "Nguyen", "Johnson", "Lee",
  "Martinez", "Brown", "Davis", "Rodriguez", "Wilson", "Anderson", "Taylor",
  "Thomas", "Moore", "Jackson", "White", "Harris", "Clark", "Lewis", "Walker",
  "Young", "King", "Wright", "Adeyemi", "Osei", "Cohen", "Rossi",
];

export const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
