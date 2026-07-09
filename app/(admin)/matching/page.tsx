import { PageHeader } from "@/components/shared/page-header";
import { MatchingWorkspace } from "@/components/matching/matching-workspace";

export default function MatchingPage() {
  return (
    <div>
      <PageHeader
        title="Matching Engine"
        subtitle="AI-ranked matches between students, alumni, and open roles — with a transparent explanation for every recommendation."
      />
      <MatchingWorkspace />
    </div>
  );
}
