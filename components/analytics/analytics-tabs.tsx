"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { label: "Overview", href: "/analytics" },
  { label: "Alumni Engagement", href: "/analytics/engagement" },
  { label: "Network Insights", href: "/analytics/network" },
  { label: "Open Roles", href: "/analytics/roles" },
  { label: "Outreach", href: "/analytics/outreach" },
  { label: "Skill Intelligence", href: "/analytics/skill-intelligence" },
  { label: "Hiring Trends", href: "/analytics/hiring-trends" },
  { label: "Referral Intelligence", href: "/analytics/referral-intelligence" },
  { label: "Career Intelligence", href: "/analytics/career-intelligence" },
  { label: "University Analytics", href: "/analytics/university" },
];

export function AnalyticsTabs() {
  const pathname = usePathname();
  return (
    <div className="mb-6 flex gap-1 overflow-x-auto rounded-2xl border border-border bg-card p-1.5">
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              active ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:bg-accent",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
