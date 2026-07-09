"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { List, Building2, MapPin, Briefcase, Layers, DollarSign, Clock, Factory } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable, type Column } from "@/components/shared/data-table";
import { FilterBar } from "@/components/shared/filter-bar";
import { AvatarBadge } from "@/components/shared/avatar-badge";
import { Badge } from "@/components/ui/badge";
import type { Role, Company } from "@/lib/mock/types";
import { LOCATIONS } from "@/lib/mock/constants";

function salaryBucket(min: number) {
  if (min < 100000) return "<$100k";
  if (min < 150000) return "$100k–$150k";
  if (min < 200000) return "$150k–$200k";
  return "$200k+";
}

function postedBucket(days: number) {
  if (days === 0) return "Today";
  if (days <= 7) return "This week";
  if (days <= 30) return "This month";
  return "Older";
}

export function RolesDirectory({ roles, companies }: { roles: Role[]; companies: Company[] }) {
  const router = useRouter();
  const [view, setView] = useState<"role" | "company">("role");
  const [filters, setFilters] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    return roles.filter((r) => {
      if (filters.location && filters.location !== "all" && r.location !== filters.location) return false;
      if (filters.company && filters.company !== "all" && r.companyName !== filters.company) return false;
      if (filters.level && filters.level !== "all" && r.level !== filters.level) return false;
      if (filters.workType && filters.workType !== "all" && r.workplaceType !== filters.workType) return false;
      if (filters.salary && filters.salary !== "all" && salaryBucket(r.salaryMin) !== filters.salary) return false;
      if (filters.posted && filters.posted !== "all" && postedBucket(r.postedDaysAgo) !== filters.posted) return false;
      if (filters.industry && filters.industry !== "all") {
        const co = companies.find((c) => c.name === r.companyName);
        if (co?.industry !== filters.industry) return false;
      }
      return true;
    });
  }, [roles, companies, filters]);

  const companyNames = useMemo(() => [...new Set(roles.map((r) => r.companyName))], [roles]);
  const industries = useMemo(() => [...new Set(companies.map((c) => c.industry))], [companies]);
  const locations = useMemo(() => LOCATIONS.map((l) => l.city), []);

  const roleColumns: Column<Role>[] = [
    {
      key: "position",
      header: "Position",
      sortValue: (r) => r.title,
      render: (r) => (
        <div className="flex items-center gap-2">
          {r.postedDaysAgo <= 7 && (
            <span className="flex items-center gap-1 rounded-full bg-tint-amber-bg px-1.5 py-0.5 text-[10px] font-semibold text-tint-amber-fg">
              <Clock className="size-2.5" /> {r.postedDaysAgo}d
            </span>
          )}
          <div>
            <p className="font-medium text-foreground">{r.title}</p>
            <p className="text-xs text-muted-foreground">{r.dept}</p>
          </div>
        </div>
      ),
    },
    {
      key: "company",
      header: "Company",
      sortValue: (r) => r.companyName,
      render: (r) => (
        <div className="flex items-center gap-2">
          <AvatarBadge label={r.companyName} size="sm" />
          <span>{r.companyName}</span>
        </div>
      ),
    },
    {
      key: "salary",
      header: "Salary",
      sortValue: (r) => r.salaryMin,
      render: (r) => (
        <div>
          <p className="font-medium">${Math.round(r.salaryMin / 1000)}k - ${Math.round(r.salaryMax / 1000)}k</p>
          <p className="text-xs text-muted-foreground">{r.level}</p>
        </div>
      ),
    },
    {
      key: "location",
      header: "Location",
      sortValue: (r) => r.location,
      render: (r) => (
        <div>
          <span className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="size-3.5" /> {r.location}
          </span>
          <Badge variant="secondary" className="mt-1">{r.workplaceType}</Badge>
        </div>
      ),
    },
    {
      key: "alumni",
      header: "Alumni",
      sortValue: (r) => r.alumniReach,
      render: (r) => (
        <span className="flex items-center gap-1 font-semibold text-tint-blue-fg">
          <Building2 className="size-3.5" /> {r.alumniReach}
        </span>
      ),
    },
  ];

  const companyRows = useMemo(() => {
    return companies
      .map((c) => {
        const companyRoles = roles.filter((r) => r.companyId === c.id);
        return { ...c, roleCount: companyRoles.length, avgAlumniReach: companyRoles.length ? Math.round(companyRoles.reduce((s, r) => s + r.alumniReach, 0) / companyRoles.length) : 0 };
      })
      .filter((c) => c.roleCount > 0)
      .sort((a, b) => b.roleCount - a.roleCount);
  }, [companies, roles]);

  const companyColumns: Column<(typeof companyRows)[number]>[] = [
    {
      key: "name",
      header: "Company",
      sortValue: (c) => c.name,
      render: (c) => (
        <div className="flex items-center gap-3">
          <AvatarBadge label={c.name} />
          <div>
            <p className="font-medium text-foreground">{c.name}</p>
            <p className="text-xs text-muted-foreground">{c.industry}</p>
          </div>
        </div>
      ),
    },
    { key: "roles", header: "Open Roles", sortValue: (c) => c.roleCount, render: (c) => c.roleCount },
    { key: "reach", header: "Avg Alumni Reach", sortValue: (c) => c.avgAlumniReach, render: (c) => c.avgAlumniReach },
    { key: "location", header: "Location", sortValue: (c) => c.location, render: (c) => c.location },
  ];

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Tabs value={view} onValueChange={(v) => setView(v as "role" | "company")}>
          <TabsList>
            <TabsTrigger value="role" className="gap-1.5">
              <List className="size-3.5" /> By Role
            </TabsTrigger>
            <TabsTrigger value="company" className="gap-1.5">
              <Building2 className="size-3.5" /> By Company
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {view === "role" && (
        <>
          <div className="mb-4">
            <FilterBar
              filters={[
                { key: "location", label: "Location", icon: MapPin, options: locations },
                { key: "company", label: "Company", icon: Building2, options: companyNames },
                { key: "workType", label: "WorkType", icon: Briefcase, options: ["On-site", "Hybrid", "Remote"] },
                { key: "level", label: "Level", icon: Layers, options: ["Intern", "Entry", "Mid", "Senior"] },
                { key: "salary", label: "Salary", icon: DollarSign, options: ["<$100k", "$100k–$150k", "$150k–$200k", "$200k+"] },
                { key: "posted", label: "Posted", icon: Clock, options: ["Today", "This week", "This month", "Older"] },
                { key: "industry", label: "Industry", icon: Factory, options: industries },
              ]}
              values={filters}
              onChange={(k, v) => setFilters((f) => ({ ...f, [k]: v }))}
            />
          </div>
          <DataTable
            data={filtered}
            columns={roleColumns}
            getId={(r) => r.id}
            searchPlaceholder="Search roles..."
            searchFn={(r, q) => r.title.toLowerCase().includes(q) || r.companyName.toLowerCase().includes(q)}
            onRowClick={(r) => router.push(`/roles/${r.id}`)}
            pageSize={10}
          />
        </>
      )}

      {view === "company" && (
        <DataTable
          data={companyRows}
          columns={companyColumns}
          getId={(c) => c.id}
          searchPlaceholder="Search companies..."
          searchFn={(c, q) => c.name.toLowerCase().includes(q)}
          onRowClick={(c) => router.push(`/companies/${c.id}`)}
          pageSize={10}
        />
      )}
    </div>
  );
}
