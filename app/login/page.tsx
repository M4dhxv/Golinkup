import { LoginCard } from "@/components/auth/login-card";

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-brand-forest px-12 py-12 text-primary-foreground lg:flex">
        <div
          className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-brand-lime/20 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-32 -left-16 size-96 rounded-full bg-brand-lime/10 blur-3xl"
          aria-hidden
        />

        <span className="relative text-2xl font-extrabold tracking-tight text-brand-lime">golinkup</span>

        <div className="relative max-w-md">
          <h1 className="text-4xl font-bold leading-tight text-brand-lime">
            Turn Your Alumni Network Into a Career Engine
          </h1>
          <p className="mt-4 text-primary-foreground/80">
            GoLinkUp Admin surfaces hidden jobs, unlocks warm introductions, and turns career services into a
            proactive, AI-powered operation for Columbia University.
          </p>
        </div>

        <p className="relative text-xs text-primary-foreground/60">© 2026 GoLinkUp. All rights reserved.</p>
      </div>

      <div className="flex w-full flex-1 items-center justify-center bg-background px-6 py-12 lg:w-1/2">
        <LoginCard />
      </div>
    </div>
  );
}
