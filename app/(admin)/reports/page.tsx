import { FileText, Download, Plus, Clock } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";

// The three at the top are real exports of the live Hood College network data
// (see lib/mock/hoodSource.ts) — the rest below them are still placeholders.
const savedReports = [
  { name: "Hood College Network — People", type: "Students & Alumni", lastRun: "Live", format: "CSV", href: "/data/hood_people.csv" },
  { name: "Hood College Network — Connections", type: "Connection Strength", lastRun: "Live", format: "CSV", href: "/data/hood_connections.csv" },
  { name: "Hood College Network — Job Matches", type: "Career Intelligence", lastRun: "Live", format: "CSV", href: "/data/hood_job_matches.csv" },
  { name: "Monthly Alumni Engagement", type: "Alumni Engagement", lastRun: "Jul 1, 2026", format: "PDF" },
  { name: "Quarterly Placement Report", type: "Career Intelligence", lastRun: "Jun 30, 2026", format: "XLSX" },
  { name: "Skill Gap Summary", type: "Skill Intelligence", lastRun: "Jun 28, 2026", format: "PDF" },
  { name: "Hiring Trend Digest", type: "Hiring Trends", lastRun: "Jul 5, 2026", format: "PDF" },
  { name: "Referral Activity Log", type: "Referral Intelligence", lastRun: "Jul 3, 2026", format: "CSV" },
];

const templates = [
  { name: "Alumni Engagement", desc: "Activation rates, engagement scores, and outreach performance." },
  { name: "Placement Performance", desc: "Student readiness, placements, and department comparisons." },
  { name: "Skill Intelligence", desc: "Skill demand, gaps, and emerging/declining trends." },
  { name: "Hiring Trends", desc: "Industry momentum and top hiring companies." },
  { name: "Referral Activity", desc: "Referral capacity, conversion, and top referrers." },
  { name: "Custom Report", desc: "Build a report from any combination of fields and filters." },
];

export default function ReportsPage() {
  return (
    <div>
      <PageHeader title="Reports" subtitle="Generate and schedule reports from any dataset in the platform." />

      <div className="mb-8 rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border p-5">
          <p className="font-semibold">Saved Reports</p>
        </div>
        <div className="flex flex-col divide-y divide-border">
          {savedReports.map((r) => (
            <div key={r.name} className="flex items-center justify-between px-5 py-3.5">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-tint-blue-bg text-tint-blue-fg">
                  <FileText className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-medium">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="size-3" /> {r.lastRun}
                </span>
                <Badge variant="secondary">{r.format}</Badge>
                {"href" in r ? (
                  <a
                    href={r.href}
                    download
                    className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent"
                  >
                    <Download className="size-3.5" /> Download
                  </a>
                ) : (
                  <button className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent">
                    <Download className="size-3.5" /> Download
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="mb-4 font-semibold">Create a New Report</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((t) => (
          <button
            key={t.name}
            className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-5 text-left hover:border-ring"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-tint-green-bg text-tint-green-fg">
              <Plus className="size-4" />
            </span>
            <p className="font-semibold">{t.name}</p>
            <p className="text-sm text-muted-foreground">{t.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
