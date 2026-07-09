import { PageHeader } from "@/components/shared/page-header";
import { IntegrationsGrid } from "@/components/integrations/integrations-grid";

export default function IntegrationsPage() {
  return (
    <div>
      <PageHeader title="Integrations" subtitle="Connect the tools your career services team already uses." />
      <IntegrationsGrid />
    </div>
  );
}
