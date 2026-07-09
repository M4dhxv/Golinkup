"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Target, Users, Briefcase, GraduationCap } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AvatarBadge } from "@/components/shared/avatar-badge";
import { ScoreRing } from "@/components/shared/score-ring";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { roles, alumni, students, rankStudentsForRole } from "@/lib/mock";

export function MatchingWorkspace() {
  const [mode, setMode] = useState<"student-job" | "alumni-student">("student-job");
  const [roleQuery, setRoleQuery] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState(roles[0]?.id);
  const [alumniQuery, setAlumniQuery] = useState("");
  const [selectedAlumniId, setSelectedAlumniId] = useState(alumni[0]?.id);

  const filteredRoles = useMemo(
    () => roles.filter((r) => r.title.toLowerCase().includes(roleQuery.toLowerCase()) || r.companyName.toLowerCase().includes(roleQuery.toLowerCase())).slice(0, 40),
    [roleQuery],
  );
  const selectedRole = roles.find((r) => r.id === selectedRoleId);
  const ranked = useMemo(() => (selectedRoleId ? rankStudentsForRole(selectedRoleId, 10) : []), [selectedRoleId]);

  const filteredAlumni = useMemo(
    () => alumni.filter((a) => a.fullName.toLowerCase().includes(alumniQuery.toLowerCase()) || a.currentCompany.toLowerCase().includes(alumniQuery.toLowerCase())).slice(0, 40),
    [alumniQuery],
  );
  const selectedAlumnus = alumni.find((a) => a.id === selectedAlumniId);
  const rankedForAlumnus = useMemo(() => {
    if (!selectedAlumnus) return [];
    return [...students]
      .map((s) => {
        const sameSchool = s.school === selectedAlumnus.school ? 40 : 10;
        const sameDept = s.dept === selectedAlumnus.dept ? 30 : 5;
        const skillOverlap = s.topSkills.filter((sk) => selectedAlumnus.topSkills.includes(sk)).length;
        const score = Math.min(100, sameSchool + sameDept + skillOverlap * 6);
        return { student: s, score, sameSchool: s.school === selectedAlumnus.school, sameDept: s.dept === selectedAlumnus.dept, skillOverlap };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }, [selectedAlumnus]);

  return (
    <div>
      <Tabs value={mode} onValueChange={(v) => setMode(v as typeof mode)} className="mb-6">
        <TabsList>
          <TabsTrigger value="student-job" className="gap-1.5">
            <Briefcase className="size-3.5" /> Student ↔ Job
          </TabsTrigger>
          <TabsTrigger value="alumni-student" className="gap-1.5">
            <GraduationCap className="size-3.5" /> Alumni ↔ Student
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {mode === "student-job" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-4 lg:col-span-1">
            <div className="relative mb-3">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={roleQuery}
                onChange={(e) => setRoleQuery(e.target.value)}
                placeholder="Search open roles..."
                className="w-full rounded-full border border-border bg-secondary/40 py-2 pl-9 pr-3 text-sm outline-none focus:border-ring"
              />
            </div>
            <div className="flex max-h-[560px] flex-col gap-1 overflow-y-auto">
              {filteredRoles.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedRoleId(r.id)}
                  className={cn(
                    "flex flex-col items-start rounded-xl px-3 py-2 text-left text-sm transition-colors",
                    r.id === selectedRoleId ? "bg-primary text-primary-foreground" : "hover:bg-accent",
                  )}
                >
                  <span className="font-medium">{r.title}</span>
                  <span className={cn("text-xs", r.id === selectedRoleId ? "text-primary-foreground/80" : "text-muted-foreground")}>
                    {r.companyName} · {r.location}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedRole && (
              <>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-5">
                  <div>
                    <p className="font-semibold">{selectedRole.title} at {selectedRole.companyName}</p>
                    <p className="text-sm text-muted-foreground">{selectedRole.location} · {selectedRole.workplaceType} · {selectedRole.level}</p>
                  </div>
                  <Link href={`/roles/${selectedRole.id}`} className="text-sm font-semibold text-primary hover:underline">
                    View role details →
                  </Link>
                </div>

                <div className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card p-5">
                  {ranked.map(({ student, overall, skillMatch, educationMatch, experienceMatch, resumeQuality, missingSkills, why }) => (
                    <div key={student.id} className="flex flex-col gap-3 py-4 first:pt-0">
                      <div className="flex items-center justify-between">
                        <Link href={`/students/${student.id}`} className="flex items-center gap-3 hover:opacity-80">
                          <AvatarBadge label={student.fullName} />
                          <div>
                            <p className="text-sm font-semibold">{student.fullName}</p>
                            <p className="text-xs text-muted-foreground">{student.major} · Class of {student.gradYear}</p>
                          </div>
                        </Link>
                        <ScoreRing value={overall} size={44} label="Overall" />
                      </div>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 text-xs text-muted-foreground">
                        <span>Skill: <strong className="text-foreground">{skillMatch}</strong></span>
                        <span>Education: <strong className="text-foreground">{educationMatch}</strong></span>
                        <span>Experience: <strong className="text-foreground">{experienceMatch}</strong></span>
                        <span>Resume: <strong className="text-foreground">{resumeQuality}</strong></span>
                      </div>
                      {missingSkills.length > 0 && (
                        <p className="text-xs text-tint-amber-fg">Missing skills: {missingSkills.join(", ")}</p>
                      )}
                      <div className="rounded-xl bg-secondary/60 p-3 text-xs text-muted-foreground">
                        <div className="mb-1 flex items-center gap-1 font-semibold text-foreground">
                          <Target className="size-3" /> Why this match
                        </div>
                        <ul className="list-inside list-disc space-y-0.5">
                          {why.map((w, i) => <li key={i}>{w}</li>)}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {mode === "alumni-student" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-4 lg:col-span-1">
            <div className="relative mb-3">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={alumniQuery}
                onChange={(e) => setAlumniQuery(e.target.value)}
                placeholder="Search alumni..."
                className="w-full rounded-full border border-border bg-secondary/40 py-2 pl-9 pr-3 text-sm outline-none focus:border-ring"
              />
            </div>
            <div className="flex max-h-[560px] flex-col gap-1 overflow-y-auto">
              {filteredAlumni.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setSelectedAlumniId(a.id)}
                  className={cn(
                    "flex flex-col items-start rounded-xl px-3 py-2 text-left text-sm transition-colors",
                    a.id === selectedAlumniId ? "bg-primary text-primary-foreground" : "hover:bg-accent",
                  )}
                >
                  <span className="font-medium">{a.fullName}</span>
                  <span className={cn("text-xs", a.id === selectedAlumniId ? "text-primary-foreground/80" : "text-muted-foreground")}>
                    {a.currentTitle} at {a.currentCompany}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedAlumnus && (
              <>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-5">
                  <div>
                    <p className="font-semibold">{selectedAlumnus.fullName} — {selectedAlumnus.currentTitle}</p>
                    <p className="text-sm text-muted-foreground">{selectedAlumnus.currentCompany} · {selectedAlumnus.school}</p>
                  </div>
                  <Link href={`/alumni/${selectedAlumnus.id}`} className="text-sm font-semibold text-primary hover:underline">
                    View alumni profile →
                  </Link>
                </div>

                <div className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card p-5">
                  {rankedForAlumnus.map(({ student, score, sameSchool, sameDept, skillOverlap }) => (
                    <div key={student.id} className="flex items-center justify-between gap-3 py-4 first:pt-0">
                      <Link href={`/students/${student.id}`} className="flex items-center gap-3 hover:opacity-80">
                        <AvatarBadge label={student.fullName} />
                        <div>
                          <p className="text-sm font-semibold">{student.fullName}</p>
                          <p className="text-xs text-muted-foreground">
                            {sameSchool && <Badge variant="secondary" className="mr-1">Same school</Badge>}
                            {sameDept && <Badge variant="secondary" className="mr-1">Same dept</Badge>}
                            {skillOverlap > 0 && `${skillOverlap} shared skills`}
                          </p>
                        </div>
                      </Link>
                      <ScoreRing value={score} size={44} label="Fit" />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
