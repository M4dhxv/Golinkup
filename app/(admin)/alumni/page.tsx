import { Download, UserPlus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { AlumniDirectory } from "@/components/alumni/alumni-directory";
import { alumni, companies } from "@/lib/mock";

export default function AlumniPage() {
  const activeCount = alumni.filter((a) => a.activityStatus === "Active").length;
  const activePct = Math.round((activeCount / alumni.length) * 100);
  const companyCount = new Set(alumni.map((a) => a.currentCompany)).size;

  return (
    <div>
      <PageHeader
        title="Alumni Network"
        subtitle={`${alumni.length.toLocaleString()} alumni across ${companyCount} companies · ${activeCount.toLocaleString()} active (${activePct}%)`}
        actions={
          <>
            <button className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-accent">
              <Download className="size-3.5" /> Export People
            </button>
            <button className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-brand-forest-light">
              <UserPlus className="size-3.5" /> Add Alumni
            </button>
          </>
        }
      />
      <AlumniDirectory alumni={alumni} companies={companies} />
    </div>
  );
}
