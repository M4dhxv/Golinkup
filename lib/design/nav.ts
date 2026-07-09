import {
  LayoutDashboard, Sparkles, GraduationCap, Users, Building2, Briefcase,
  Target, BarChart3, FileText, Bell, Plug, Settings,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "AI Insights", href: "/insights", icon: Sparkles },
    ],
  },
  {
    label: "People",
    items: [
      { label: "Students", href: "/students", icon: GraduationCap },
      { label: "Alumni", href: "/alumni", icon: Users },
    ],
  },
  {
    label: "Market",
    items: [
      { label: "Companies", href: "/companies", icon: Building2 },
      { label: "Open Roles", href: "/roles", icon: Briefcase },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { label: "Matching", href: "/matching", icon: Target },
      { label: "Analytics", href: "/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Operate",
    items: [
      { label: "Reports", href: "/reports", icon: FileText },
      { label: "Notifications", href: "/notifications", icon: Bell },
      { label: "Integrations", href: "/integrations", icon: Plug },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];
