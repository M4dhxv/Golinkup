import { Sparkles } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { InsightsFeed } from "@/components/insights/insights-feed";
import { aiInsights } from "@/lib/mock";

export default function InsightsPage() {
  const highCount = aiInsights.filter((i) => i.priority === "high").length;
  const categories = new Set(aiInsights.map((i) => i.category)).size;

  return (
    <div>
      <PageHeader
        title="AI Insights"
        subtitle="Proactive, evidence-backed recommendations generated automatically from your network data."
      />

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <KpiCard icon={Sparkles} label="Active Insights" value={aiInsights.length} tint="purple" />
        <KpiCard icon={Sparkles} label="High Priority" value={highCount} tint="rose" />
        <KpiCard icon={Sparkles} label="Categories Covered" value={categories} tint="blue" />
      </div>

      <InsightsFeed insights={aiInsights} />
    </div>
  );
}
