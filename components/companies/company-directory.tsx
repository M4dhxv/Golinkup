"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, MapPin } from "lucide-react";
import { DataTable, type Column } from "@/components/shared/data-table";
import { FilterBar } from "@/components/shared/filter-bar";
import { AvatarBadge } from "@/components/shared/avatar-badge";
import type { Company } from "@/lib/mock/types";
import { INDUSTRIES } from "@/lib/mock/constants";

export function CompanyDirectory({ companies }: { companies: Company[] }) {
  const router = useRouter();
  const [filters, setFilters] = useState<Record<string, string>>({});

  const filtered = useMemo(
    () => companies.filter((c) => !filters.industry || filters.industry === "all" || c.industry === filters.industry),
    [companies, filters],
  );

  const columns: Column<Company>[] = [
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
    { key: "alumni", header: "Alumni", sortValue: (c) => c.alumniCount, render: (c) => c.alumniCount },
    { key: "roles", header: "Open Roles", sortValue: (c) => c.openRoleCount, render: (c) => c.openRoleCount },
    {
      key: "hiring",
      header: "Hiring Score",
      sortValue: (c) => c.hiringActivityScore,
      render: (c) => {
        const color = c.hiringActivityScore >= 70 ? "text-tint-green-fg" : c.hiringActivityScore >= 40 ? "text-tint-amber-fg" : "text-tint-rose-fg";
        return <span className={`font-semibold ${color}`}>{c.hiringActivityScore}</span>;
      },
    },
    {
      key: "location",
      header: "Location",
      sortValue: (c) => c.location,
      render: (c) => (
        <span className="flex items-center gap-1 text-muted-foreground">
          <MapPin className="size-3.5" /> {c.location}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-4">
        <FilterBar
          filters={[{ key: "industry", label: "Industry", icon: Building2, options: INDUSTRIES }]}
          values={filters}
          onChange={(k, v) => setFilters((f) => ({ ...f, [k]: v }))}
        />
      </div>
      <DataTable
        data={filtered}
        columns={columns}
        getId={(c) => c.id}
        searchPlaceholder="Search companies..."
        searchFn={(c, q) => c.name.toLowerCase().includes(q)}
        onRowClick={(c) => router.push(`/companies/${c.id}`)}
        pageSize={10}
      />
    </div>
  );
}
