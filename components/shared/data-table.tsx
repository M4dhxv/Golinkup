"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown, Download, RefreshCw, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export type Column<T> = {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  sortValue?: (row: T) => string | number;
  className?: string;
};

export function DataTable<T>({
  data,
  columns,
  getId,
  searchPlaceholder = "Search...",
  searchFn,
  onRowClick,
  pageSize = 12,
  toolbarExtra,
}: {
  data: T[];
  columns: Column<T>[];
  getId: (row: T) => string;
  searchPlaceholder?: string;
  searchFn?: (row: T, query: string) => boolean;
  onRowClick?: (row: T) => void;
  pageSize?: number;
  toolbarExtra?: React.ReactNode;
}) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(0);
  const [spinning, setSpinning] = useState(false);

  const filtered = useMemo(() => {
    if (!query || !searchFn) return data;
    const q = query.toLowerCase();
    return data.filter((row) => searchFn(row, q));
  }, [data, query, searchFn]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const col = columns.find((c) => c.key === sortKey);
    if (!col?.sortValue) return filtered;
    const copy = [...filtered];
    copy.sort((a, b) => {
      const av = col.sortValue!(a);
      const bv = col.sortValue!(b);
      const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [filtered, sortKey, sortDir, columns]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageRows = sorted.slice(page * pageSize, page * pageSize + pageSize);

  function toggleSort(key: string) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function toggleAll() {
    if (selected.size === pageRows.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(pageRows.map(getId)));
    }
  }

  function toggleRow(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  }

  function exportCsv() {
    const header = columns.map((c) => c.header).join(",");
    const rows = sorted.map((row) =>
      columns
        .map((c) => {
          const val = c.sortValue ? c.sortValue(row) : "";
          return `"${String(val).replace(/"/g, '""')}"`;
        })
        .join(","),
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "export.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function refresh() {
    setSpinning(true);
    setTimeout(() => setSpinning(false), 600);
  }

  return (
    <div className="rounded-2xl border border-border bg-card">
      <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
        {searchFn && (
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(0);
              }}
              placeholder={searchPlaceholder}
              className="w-full rounded-full border border-border bg-secondary/40 py-2 pl-9 pr-3 text-sm outline-none focus:border-ring"
            />
          </div>
        )}
        {toolbarExtra}
        <div className="ml-auto flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-tint-green-fg" />
            Live
          </span>
          <button
            onClick={refresh}
            className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <RefreshCw className={cn("size-4", spinning && "animate-spin")} />
          </button>
          <button
            onClick={exportCsv}
            className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-medium hover:bg-accent"
          >
            <Download className="size-3.5" /> Export
          </button>
        </div>
      </div>

      {selected.size > 0 && (
        <div className="flex items-center gap-3 border-b border-border bg-accent/50 px-4 py-2 text-sm">
          <span className="font-medium">{selected.size} selected</span>
          <button className="text-primary hover:underline">Bulk tag</button>
          <button className="text-primary hover:underline">Bulk export</button>
          <button className="text-muted-foreground hover:underline" onClick={() => setSelected(new Set())}>
            Clear
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="w-10 px-4 py-3">
                <Checkbox
                  checked={pageRows.length > 0 && selected.size === pageRows.length}
                  onCheckedChange={toggleAll}
                />
              </th>
              {columns.map((col) => (
                <th key={col.key} className={cn("px-4 py-3 font-semibold", col.className)}>
                  {col.sortValue ? (
                    <button className="flex items-center gap-1 hover:text-foreground" onClick={() => toggleSort(col.key)}>
                      {col.header}
                      <ArrowUpDown className="size-3" />
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row) => {
              const id = getId(row);
              return (
                <tr
                  key={id}
                  className="border-b border-border last:border-0 hover:bg-accent/40 cursor-pointer"
                  onClick={() => onRowClick?.(row)}
                >
                  <td className="w-10 px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <Checkbox checked={selected.has(id)} onCheckedChange={() => toggleRow(id)} />
                  </td>
                  {columns.map((col) => (
                    <td key={col.key} className={cn("px-4 py-3", col.className)}>
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              );
            })}
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-10 text-center text-muted-foreground">
                  No results match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-4 py-3 text-sm text-muted-foreground">
        <span>
          {sorted.length} result{sorted.length !== 1 ? "s" : ""}
        </span>
        <div className="flex items-center gap-2">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="flex size-7 items-center justify-center rounded-full border border-border disabled:opacity-40"
          >
            <ChevronLeft className="size-3.5" />
          </button>
          <span>
            Page {page + 1} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            className="flex size-7 items-center justify-center rounded-full border border-border disabled:opacity-40"
          >
            <ChevronRight className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
