"use client";

import Link from "next/link";
import { Search, Bell, GraduationCap, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { institution } from "@/lib/mock";

export function Topbar() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-border bg-background px-6">
      <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
        <span className="text-xl font-extrabold tracking-tight text-primary">golinkup</span>
        <span className="rounded-full border border-brand-lime-dark/40 bg-brand-lime/20 px-2.5 py-0.5 text-xs font-semibold text-brand-forest">
          Admin
        </span>
      </Link>

      <div className="relative flex-1 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search students, alumni, companies, roles..."
          className="w-full rounded-full border border-border bg-secondary/50 py-2 pl-9 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:border-ring focus:bg-background"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Link
          href="/notifications"
          className="flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <Bell className="size-4.5" />
        </Link>

        <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-border bg-secondary/50 px-3 py-1.5 text-sm font-medium text-foreground/80">
          <GraduationCap className="size-4 text-primary" />
          {institution.name}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1.5 rounded-full pl-1 pr-2 py-1 hover:bg-accent">
            <span className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              SC
            </span>
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem render={<Link href="/settings">Settings</Link>} />
            <DropdownMenuItem render={<Link href="/integrations">Integrations</Link>} />
            <DropdownMenuItem render={<Link href="/reports">Reports</Link>} />
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
