"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { LucideIcon } from "lucide-react";

export type FilterDef = {
  key: string;
  label: string;
  icon?: LucideIcon;
  options: string[];
};

export function FilterBar({
  filters,
  values,
  onChange,
}: {
  filters: FilterDef[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((f) => {
        const Icon = f.icon;
        return (
          <Select
            key={f.key}
            value={values[f.key] ?? "all"}
            onValueChange={(v) => onChange(f.key, v ?? "all")}
          >
            <SelectTrigger className="h-9 rounded-full border-border bg-card text-sm">
              {Icon && <Icon className="size-3.5 text-muted-foreground" />}
              <SelectValue placeholder={f.label}>
                {(v: string | null) => (!v || v === "all" ? f.label : v)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All {f.label}</SelectItem>
              {f.options.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      })}
    </div>
  );
}
