"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Building2, MapPin, Briefcase } from "lucide-react";
import { DataTable, type Column } from "@/components/shared/data-table";
import { FilterBar } from "@/components/shared/filter-bar";
import { AvatarBadge } from "@/components/shared/avatar-badge";
import { Badge } from "@/components/ui/badge";
import type { Student } from "@/lib/mock/types";

export function StudentDirectory({ students }: { students: Student[] }) {
  const router = useRouter();
  const [filters, setFilters] = useState<Record<string, string>>({});

  const depts = useMemo(() => [...new Set(students.map((s) => s.dept))], [students]);
  const gradYears = useMemo(() => [...new Set(students.map((s) => String(s.gradYear)))].sort(), [students]);

  const filtered = useMemo(() => {
    return students.filter((s) => {
      if (filters.dept && filters.dept !== "all" && s.dept !== filters.dept) return false;
      if (filters.gradYear && filters.gradYear !== "all" && String(s.gradYear) !== filters.gradYear) return false;
      if (filters.status && filters.status !== "all" && s.employmentStatus !== filters.status) return false;
      return true;
    });
  }, [students, filters]);

  const columns: Column<Student>[] = [
    {
      key: "name",
      header: "Name",
      sortValue: (s) => s.fullName,
      render: (s) => (
        <div className="flex items-center gap-3">
          <AvatarBadge label={s.fullName} />
          <div>
            <p className="font-medium text-foreground">{s.fullName}</p>
            <p className="text-xs text-muted-foreground">{s.major} · Class of {s.gradYear}</p>
          </div>
        </div>
      ),
    },
    { key: "dept", header: "Department", sortValue: (s) => s.dept, render: (s) => s.dept },
    {
      key: "readiness",
      header: "Readiness",
      sortValue: (s) => s.scores.studentReadinessScore ?? 0,
      render: (s) => {
        const v = s.scores.studentReadinessScore ?? 0;
        const color = v >= 75 ? "text-tint-green-fg" : v >= 50 ? "text-tint-amber-fg" : "text-tint-rose-fg";
        return <span className={`font-semibold ${color}`}>{v}</span>;
      },
    },
    {
      key: "match",
      header: "Match Score",
      sortValue: (s) => s.scores.studentMatchScore ?? 0,
      render: (s) => `${s.scores.studentMatchScore ?? 0}`,
    },
    {
      key: "status",
      header: "Status",
      sortValue: (s) => s.employmentStatus,
      render: (s) => <Badge variant="secondary">{s.employmentStatus}</Badge>,
    },
    {
      key: "location",
      header: "Location",
      sortValue: (s) => s.location.city,
      render: (s) => (
        <span className="flex items-center gap-1 text-muted-foreground">
          <MapPin className="size-3.5" /> {s.location.city}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-4">
        <FilterBar
          filters={[
            { key: "dept", label: "Department", icon: Building2, options: depts },
            { key: "gradYear", label: "Grad Year", icon: GraduationCap, options: gradYears },
            { key: "status", label: "Status", icon: Briefcase, options: ["Job Seeking", "Interning", "Employed", "Not Seeking"] },
          ]}
          values={filters}
          onChange={(k, v) => setFilters((f) => ({ ...f, [k]: v }))}
        />
      </div>
      <DataTable
        data={filtered}
        columns={columns}
        getId={(s) => s.id}
        searchPlaceholder="Search students..."
        searchFn={(s, q) => s.fullName.toLowerCase().includes(q) || s.major.toLowerCase().includes(q)}
        onRowClick={(s) => router.push(`/students/${s.id}`)}
        pageSize={10}
      />
    </div>
  );
}
