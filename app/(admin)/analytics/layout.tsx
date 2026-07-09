import { PageHeader } from "@/components/shared/page-header";
import { AnalyticsTabs } from "@/components/analytics/analytics-tabs";
import { Download } from "lucide-react";

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <PageHeader
        title="Analytics"
        subtitle="Track engagement, network growth, and opportunity metrics across the Columbia University network."
        actions={
          <button className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-accent">
            <Download className="size-3.5" /> Export Report
          </button>
        }
      />
      <AnalyticsTabs />
      {children}
    </div>
  );
}
