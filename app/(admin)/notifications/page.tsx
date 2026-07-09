import { PageHeader } from "@/components/shared/page-header";
import { NotificationCenter } from "@/components/notifications/notification-center";
import { aiInsights } from "@/lib/mock";

export default function NotificationsPage() {
  return (
    <div>
      <PageHeader title="Notifications" subtitle="Everything that needs your attention, in one place." />
      <NotificationCenter insights={aiInsights} />
    </div>
  );
}
