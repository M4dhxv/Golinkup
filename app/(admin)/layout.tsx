import { Sidebar } from "@/components/shell/sidebar";
import { Topbar } from "@/components/shell/topbar";
import { AIAssistantFab } from "@/components/shell/ai-assistant-fab";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh flex-col">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="mx-auto max-w-[1400px] px-6 py-6 md:px-8 md:py-8">{children}</div>
        </main>
      </div>
      <AIAssistantFab />
    </div>
  );
}
