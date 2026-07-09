"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Building2, GraduationCap, MapPin } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable, type Column } from "@/components/shared/data-table";
import { FilterBar } from "@/components/shared/filter-bar";
import { AvatarBadge } from "@/components/shared/avatar-badge";
import { Badge } from "@/components/ui/badge";
import type { Alumni, Company } from "@/lib/mock/types";
import { INDUSTRIES } from "@/lib/mock/constants";

export function AlumniDirectory({ alumni, companies }: { alumni: Alumni[]; companies: Company[] }) {
  const router = useRouter();
  const [view, setView] = useState<"people" | "company">("company");
  const [filters, setFilters] = useState<Record<string, string>>({});

  const filteredAlumni = useMemo(() => {
    return alumni.filter((a) => {
      if (filters.industry && filters.industry !== "all") {
        const co = companies.find((c) => c.name === a.currentCompany);
        if (co?.industry !== filters.industry) return false;
      }
      if (filters.status && filters.status !== "all" && a.activityStatus !== filters.status) return false;
      if (filters.school && filters.school !== "all" && a.school !== filters.school) return false;
      return true;
    });
  }, [alumni, companies, filters]);

  const schools = useMemo(() => [...new Set(alumni.map((a) => a.school))], [alumni]);

  const peopleColumns: Column<Alumni>[] = [
    {
      key: "name",
      header: "Name",
      sortValue: (a) => a.fullName,
      render: (a) => (
        <div className="flex items-center gap-3">
          <AvatarBadge label={a.fullName} />
          <div>
            <p className="font-medium text-foreground">{a.fullName}</p>
            <p className="text-xs text-muted-foreground">{a.headline}</p>
          </div>
        </div>
      ),
    },
    { key: "company", header: "Company", sortValue: (a) => a.currentCompany, render: (a) => a.currentCompany },
    { key: "gradYear", header: "Class", sortValue: (a) => a.gradYear, render: (a) => a.gradYear, className: "w-20" },
    {
      key: "status",
      header: "Status",
      sortValue: (a) => a.activityStatus,
      render: (a) => (
        <Badge variant={a.activityStatus === "Active" ? "default" : "secondary"}>{a.activityStatus}</Badge>
      ),
    },
    {
      key: "referrals",
      header: "Referrals",
      sortValue: (a) => a.referralsSuccessful,
      render: (a) => `${a.referralsSuccessful} successful`,
    },
    {
      key: "location",
      header: "Location",
      sortValue: (a) => a.location.city,
      render: (a) => (
        <span className="flex items-center gap-1 text-muted-foreground">
          <MapPin className="size-3.5" /> {a.location.city}
        </span>
      ),
    },
  ];

  const companyRows = useMemo(() => {
    return companies
      .map((c) => {
        const companyAlumni = alumni.filter((a) => a.currentCompany === c.name);
        const active = companyAlumni.filter((a) => a.activityStatus === "Active").length;
        return { ...c, totalAlumni: companyAlumni.length, activeAlumni: active };
      })
      .filter((c) => c.totalAlumni > 0)
      .sort((a, b) => b.totalAlumni - a.totalAlumni);
  }, [alumni, companies]);

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
            <p className="text-xs text-muted-foreground">{c.industry} · {c.size}</p>
          </div>
        </div>
      ),
    },
    { key: "total", header: "Total", sortValue: (c) => c.totalAlumni, render: (c) => c.totalAlumni },
    {
      key: "active",
      header: "Active",
      sortValue: (c) => c.activeAlumni,
      render: (c) => {
        const pct = Math.round((c.activeAlumni / c.totalAlumni) * 100);
        return (
          <div className="w-32">
            <span className="text-sm font-semibold text-tint-green-fg">
              {c.activeAlumni} <span className="text-xs text-muted-foreground">({pct}%)</span>
            </span>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-tint-green-fg" style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      },
    },
    { key: "roles", header: "Roles", sortValue: (c) => c.openRoleCount, render: (c) => `${c.openRoleCount} roles` },
    { key: "location", header: "Location", sortValue: (c) => c.location, render: (c) => c.location },
  ];

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Tabs value={view} onValueChange={(v) => setView(v as "people" | "company")}>
          <TabsList>
            <TabsTrigger value="people" className="gap-1.5">
              <Users className="size-3.5" /> People
            </TabsTrigger>
            <TabsTrigger value="company" className="gap-1.5">
              <Building2 className="size-3.5" /> Company
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {view === "people" && (
        <>
          <div className="mb-4">
            <FilterBar
              filters={[
                { key: "industry", label: "Industry", icon: Building2, options: INDUSTRIES },
                { key: "status", label: "Status", icon: Users, options: ["Active", "Dormant"] },
                { key: "school", label: "School", icon: GraduationCap, options: schools },
              ]}
              values={filters}
              onChange={(k, v) => setFilters((f) => ({ ...f, [k]: v }))}
            />
          </div>
          <DataTable
            data={filteredAlumni}
            columns={peopleColumns}
            getId={(a) => a.id}
            searchPlaceholder="Search alumni..."
            searchFn={(a, q) => a.fullName.toLowerCase().includes(q) || a.currentCompany.toLowerCase().includes(q)}
            onRowClick={(a) => router.push(`/alumni/${a.id}`)}
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
