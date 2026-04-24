import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "@/lib/router";
import { authApi } from "../api/auth";
import { queryKeys } from "../lib/queryKeys";
import { getRememberedInvitePath } from "../lib/invite-memory";
import { Button } from "@/components/ui/button";
import { AsciiArtAnimation } from "@/components/AsciiArtAnimation";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { useLocale } from "@/context/LocaleContext";
import { BossFlowLogo, BossFlowMark } from "@/components/BossFlowBrand";

type AuthMode = "sign_in" | "sign_up";

export function AuthPage() {
  const { t } = useLocale();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<AuthMode>("sign_in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const nextPath = useMemo(
    () => searchParams.get("next") || getRememberedInvitePath() || "/",
    [searchParams],
  );
  const { data: session, isLoading: isSessionLoading } = useQuery({
    queryKey: queryKeys.auth.session,
    queryFn: () => authApi.getSession(),
    retry: false,
  });

  useEffect(() => {
    if (session) {
      navigate(nextPath, { replace: true });
    }
  }, [session, navigate, nextPath]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (mode === "sign_in") {
        await authApi.signInEmail({ email: email.trim(), password });
        return;
      }
      await authApi.signUpEmail({
        name: name.trim(),
        email: email.trim(),
        password,
      });
    },
    onSuccess: async () => {
      setError(null);
      await queryClient.invalidateQueries({ queryKey: queryKeys.auth.session });
      await queryClient.invalidateQueries({ queryKey: queryKeys.companies.all });
      navigate(nextPath, { replace: true });
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : t("auth.authenticationFailed"));
    },
  });

  const canSubmit =
    email.trim().length > 0 &&
    password.trim().length > 0 &&
    (mode === "sign_in" || (name.trim().length > 0 && password.trim().length >= 8));

  if (isSessionLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">{t("common.loadingAlt")}</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex bg-background">
      <div className="absolute right-6 top-6 z-10">
        <LocaleSwitcher />
      </div>
      {/* Left half — form */}
      <div className="w-full md:w-1/2 flex flex-col overflow-y-auto">
        <div className="w-full max-w-md mx-auto my-auto px-8 py-12">
          <BossFlowLogo
            className="mb-8"
            markClassName="h-9 w-9"
            subtitle="Collaborative control plane for AI teams"
          />

          <h1 className="text-xl font-semibold">
            {mode === "sign_in" ? t("auth.signInTitle") : t("auth.signUpTitle")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "sign_in"
              ? t("auth.signInDescription")
              : t("auth.signUpDescription")}
          </p>

          <form
            className="mt-6 space-y-4"
            method="post"
            action={mode === "sign_up" ? "/api/auth/sign-up/email" : "/api/auth/sign-in/email"}
            onSubmit={(event) => {
              event.preventDefault();
              if (mutation.isPending) return;
              if (!canSubmit) {
                setError(t("auth.fillRequiredFields"));
                return;
              }
              mutation.mutate();
            }}
          >
            {mode === "sign_up" && (
              <div>
                <label htmlFor="name" className="text-xs text-muted-foreground mb-1 block">{t("auth.name")}</label>
                <input
                  id="name"
                  name="name"
                  className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground/50"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  autoComplete="name"
                  autoFocus
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="text-xs text-muted-foreground mb-1 block">{t("auth.email")}</label>
              <input
                id="email"
                name="email"
                className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground/50"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                autoFocus={mode === "sign_in"}
              />
            </div>
            <div>
              <label htmlFor="password" className="text-xs text-muted-foreground mb-1 block">{t("auth.password")}</label>
              <input
                id="password"
                name="password"
                className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground/50"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete={mode === "sign_in" ? "current-password" : "new-password"}
              />
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
            <Button
              type="submit"
              disabled={mutation.isPending}
              aria-disabled={!canSubmit || mutation.isPending}
              className={`w-full ${!canSubmit && !mutation.isPending ? "opacity-50" : ""}`}
            >
              {mutation.isPending
                ? t("auth.working")
                : mode === "sign_in"
                  ? t("auth.signIn")
                  : t("auth.createAccount")}
            </Button>
          </form>

          <div className="mt-5 text-sm text-muted-foreground">
            {mode === "sign_in" ? t("auth.needAccount") : t("auth.haveAccount")}{" "}
            <button
              type="button"
              className="font-medium text-foreground underline underline-offset-2"
              onClick={() => {
                setError(null);
                setMode(mode === "sign_in" ? "sign_up" : "sign_in");
              }}
            >
              {mode === "sign_in" ? t("auth.createOne") : t("auth.signIn")}
            </button>
          </div>
        </div>
      </div>

      {/* Right half — ASCII art animation (hidden on mobile) */}
      <div className="relative hidden w-1/2 overflow-hidden md:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(255,255,255,0.1),transparent_24%),radial-gradient(circle_at_top_left,rgba(103,232,249,0.14),transparent_34%),radial-gradient(circle_at_75%_18%,rgba(251,146,60,0.16),transparent_28%),linear-gradient(180deg,#0f1115_0%,#181c22_100%)]" />
        <div className="absolute inset-0 opacity-45">
          <AsciiArtAnimation />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,17,21,0.2),rgba(15,17,21,0.72))]" />
        <div className="relative z-10 flex h-full flex-col justify-between px-10 py-12">
          <div className="max-w-md space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium tracking-[0.14em] text-zinc-300 uppercase backdrop-blur-sm">
              <BossFlowMark className="h-4 w-4" tone="light" />
              BossFlow Console
            </div>
            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.28)] backdrop-blur-md">
              <BossFlowLogo
                markClassName="h-14 w-14"
                titleClassName="text-lg tracking-[0.22em] text-white"
                subtitleClassName="text-sm text-zinc-300"
                subtitle="Collaborative control plane for AI teams."
                tone="light"
              />
              <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                <img
                  src="/brands/bossflow-mark-white.png"
                  alt="BossFlow logo"
                  className="h-48 w-full object-contain px-10 py-6"
                />
              </div>
            </div>
            <h2 className="text-4xl font-semibold tracking-tight text-white">
              Keep the work moving until it actually lands.
            </h2>
            <p className="text-sm leading-7 text-zinc-300">
              Route tasks across specialists, keep long-running context alive, and review outcomes from one
              operator console.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              ["Shared context", "Persistent issue threads and company memory"],
              ["Operator loops", "Budgets, approvals, and visible execution state"],
              ["Task finish", "Designed to push work through to an actual outcome"],
            ].map(([title, body]) => (
              <div
                key={title}
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-zinc-200 backdrop-blur-sm"
              >
                <BossFlowMark className="mb-4 h-7 w-7" tone="light" />
                <div className="text-sm font-medium text-white">{title}</div>
                <div className="mt-2 text-xs leading-6 text-zinc-400">{body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
