"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { GoogleIcon, MicrosoftIcon } from "./brand-icons";

export function LoginCard() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  function handleProviderSignIn(provider: string) {
    setLoadingProvider(provider);
    setTimeout(() => router.push("/dashboard"), 500);
  }

  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleProviderSignIn("email");
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8">
        <span className="text-2xl font-extrabold tracking-tight text-primary">golinkup</span>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-foreground">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sign in to your Columbia University admin workspace.</p>
      </div>

      <div className="flex flex-col gap-2.5">
        <button
          onClick={() => handleProviderSignIn("google")}
          disabled={!!loadingProvider}
          className="flex items-center justify-center gap-2.5 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-accent disabled:opacity-60"
        >
          {loadingProvider === "google" ? <Loader2 className="size-4 animate-spin" /> : <GoogleIcon className="size-4" />}
          Continue with Google
        </button>
        <button
          onClick={() => handleProviderSignIn("microsoft")}
          disabled={!!loadingProvider}
          className="flex items-center justify-center gap-2.5 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-accent disabled:opacity-60"
        >
          {loadingProvider === "microsoft" ? <Loader2 className="size-4 animate-spin" /> : <MicrosoftIcon className="size-4" />}
          Continue with Microsoft
        </button>
        <button
          onClick={() => handleProviderSignIn("sso")}
          disabled={!!loadingProvider}
          className="flex items-center justify-center gap-2.5 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-accent disabled:opacity-60"
        >
          {loadingProvider === "sso" ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4 text-primary" />}
          Continue with Institution SSO
        </button>
      </div>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or continue with email</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleEmailSubmit} className="flex flex-col gap-3">
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@columbia.edu"
            className="w-full rounded-full border border-border bg-card py-2.5 pl-10 pr-4 text-sm outline-none focus:border-ring"
          />
        </div>
        <button
          type="submit"
          disabled={!!loadingProvider}
          className="flex items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-brand-forest-light disabled:opacity-60"
        >
          {loadingProvider === "email" ? <Loader2 className="size-4 animate-spin" /> : <>Continue with Email <ArrowRight className="size-3.5" /></>}
        </button>
      </form>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Don&apos;t have an account? Contact your career services administrator.
      </p>
    </div>
  );
}
