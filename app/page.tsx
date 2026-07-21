"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import {
  ArrowRight,
  CarFront,
  CheckCircle2,
  ChevronDown,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  Zap,
} from "lucide-react";

const accounts = {
  renter: {
    label: "Renter",
    email: "ev-renter@gmail.com",
    description: "Manage your fleet, billing, and account",
    destination: "/renter/account",
  },
  admin: {
    label: "Admin",
    email: "ev-admin@gmail.com",
    description: "Manage operations, inventory, and clients",
    destination: "/admin/dashboard",
  },
} as const;

type AccountRole = keyof typeof accounts;

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<AccountRole>("renter");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedAccount = accounts[role];

  function handleRoleChange(nextRole: AccountRole) {
    setRole(nextRole);
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          email: selectedAccount.email,
          password,
        }),
      });

      if (!response.ok) {
        const result = (await response.json()) as { message?: string };
        setError(result.message ?? "Unable to sign in. Please try again.");
        setIsSubmitting(false);
        return;
      }

      router.replace(selectedAccount.destination);
      router.refresh();
    } catch {
      setError("Unable to connect. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-white lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(480px,0.95fr)]">
      <section className="relative hidden min-h-screen overflow-hidden bg-[#101820] px-12 py-10 text-white lg:flex lg:flex-col xl:px-20 xl:py-14">
        <div className="absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full border border-white/10" />
        <div className="absolute -right-20 -top-20 h-[360px] w-[360px] rounded-full border border-white/10" />
        <div className="absolute bottom-0 left-0 h-2 w-full bg-tertiary" />
        <div className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-tertiary/10 blur-2xl" />

        <div className="relative z-10">
          <div className="relative h-10 w-52">
            <Image
              src="/logo.png"
              alt="Dah Chong Hong Holdings"
              fill
              className="object-contain object-left brightness-0 invert"
              priority
              unoptimized
            />
          </div>
        </div>

        <div className="relative z-10 my-auto max-w-xl py-16">
          <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-tertiary shadow-[0_16px_50px_rgba(200,16,46,0.3)]">
            <Zap size={26} fill="currentColor" />
          </div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-red-300">
            EV Fleet Management
          </p>
          <h1 className="max-w-lg text-5xl font-semibold leading-[1.08] tracking-[-0.035em] xl:text-6xl">
            Mobility, managed with clarity.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">
            One secure platform for electric vehicle rental operations, from fleet performance to customer accounts.
          </p>

          <div className="mt-12 grid max-w-lg grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
              <CarFront className="mb-4 text-red-300" size={23} />
              <p className="text-sm font-medium">Connected fleet</p>
              <p className="mt-1 text-xs leading-5 text-slate-400">Vehicles, contracts, and usage in one place.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
              <ShieldCheck className="mb-4 text-red-300" size={23} />
              <p className="text-sm font-medium">Role-based access</p>
              <p className="mt-1 text-xs leading-5 text-slate-400">A tailored workspace for every team.</p>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-xs text-slate-500">© 2026 Dah Chong Hong Holdings. All rights reserved.</p>
      </section>

      <section className="flex min-h-screen items-center justify-center bg-[#f7f7f6] px-5 py-10 sm:px-10 lg:px-14 xl:px-24">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden">
            <div className="relative h-9 w-48">
              <Image src="/logo.png" alt="Dah Chong Hong Holdings" fill className="object-contain object-left" priority unoptimized />
            </div>
          </div>

          <div className="mb-9">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-tertiary-tint text-tertiary lg:hidden">
              <Zap size={22} fill="currentColor" />
            </div>
            <p className="mb-2 text-sm font-semibold text-tertiary">Welcome back</p>
            <h2 className="text-3xl font-semibold tracking-[-0.025em] text-gray-950 sm:text-4xl">Sign in to your portal</h2>
            <p className="mt-3 text-sm leading-6 text-gray-500">Choose your account type and enter your password to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="account-role" className="mb-2 block text-sm font-medium text-gray-800">Account</label>
              <div className="relative">
                <select
                  id="account-role"
                  value={role}
                  onChange={(event) => handleRoleChange(event.target.value as AccountRole)}
                  className="peer h-[74px] w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 pb-2.5 pt-7 text-sm font-medium text-gray-900 shadow-sm transition hover:border-gray-300 focus:border-tertiary focus:outline-none focus:ring-4 focus:ring-tertiary/10"
                >
                  <option value="renter">Renter — ev-renter@gmail.com</option>
                  <option value="admin">Admin — ev-admin@gmail.com</option>
                </select>
                <span className="pointer-events-none absolute left-4 top-3 text-[11px] font-medium uppercase tracking-wider text-gray-400">
                  {selectedAccount.label} account
                </span>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
              <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
                <CheckCircle2 size={13} className="text-emerald-600" />
                {selectedAccount.description}
              </p>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-gray-800">Password</label>
                <button type="button" className="text-xs font-medium text-tertiary hover:text-tertiary-dark">Forgot password?</button>
              </div>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => { setPassword(event.target.value); setError(""); }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "password-error" : undefined}
                  className={`h-13 w-full rounded-xl border bg-white pl-11 pr-12 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:outline-none focus:ring-4 ${error ? "border-tertiary focus:border-tertiary focus:ring-tertiary/10" : "border-gray-200 hover:border-gray-300 focus:border-tertiary focus:ring-tertiary/10"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {error && <p id="password-error" role="alert" className="mt-2 text-xs font-medium text-tertiary">{error}</p>}
            </div>

            <label className="flex w-fit cursor-pointer items-center gap-2.5 text-sm text-gray-600">
              <input type="checkbox" className="h-4 w-4 rounded border-gray-300 accent-tertiary" />
              Keep me signed in
            </label>

            <button
              type="submit"
              disabled={isSubmitting || !password}
              className="group flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-tertiary px-5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(200,16,46,0.22)] transition hover:bg-tertiary-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Signing in…" : "Sign in"}
              {!isSubmitting && <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />}
            </button>
          </form>

          <div className="mt-8 border-t border-gray-200 pt-6 text-center">
            <p className="text-xs leading-5 text-gray-400">
              Protected by secure authentication. By signing in, you agree to our Terms of Use and Privacy Policy.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
