import { Download, UserPlus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StudentDirectory } from "@/components/students/student-directory";
import { students } from "@/lib/mock";

export default function StudentsPage() {
  const readyCount = students.filter((s) => (s.scores.studentReadinessScore ?? 0) >= 85).length;

  return (
    <div>
      <PageHeader
        title="Student Directory"
        subtitle={`${students.length.toLocaleString()} students · ${readyCount} placement-ready`}
        actions={
          <>
            <button className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-accent">
              <Download className="size-3.5" /> Export
            </button>
            <button className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-brand-forest-light">
              <UserPlus className="size-3.5" /> Add Student
            </button>
          </>
        }
      />
      <StudentDirectory students={students} />
    </div>
  );
}
