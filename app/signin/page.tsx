"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

import { getSupabaseBrowserClient } from "@/lib/supabase/client"

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<"signin" | "signup">("signin")

  const supabase = useMemo(() => getSupabaseBrowserClient(), [])
  const isAuthConfigured = Boolean(supabase)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      if (!supabase) {
        setError(
          "Authentication is not configured. Please contact the Eduflick AI team to finish setting up Supabase.",
        )
        return
      }

      if (mode === "signin") {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })
        if (signInError) {
          setError(signInError.message)
          return
        }
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        })
        if (signUpError) {
          setError(signUpError.message)
          return
        }
      }

      const next = searchParams.get("next")
      router.replace(next || "/register")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030616] text-white">
      <div aria-hidden className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.2),_rgba(29,78,216,0.15),_transparent_75%)]" />
      <header className="relative z-10 border-b border-white/5 bg-[#050d25]/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5">
          <Link href="/" className="flex items-center gap-3 text-sm font-medium text-white/80">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-blue-400/20 text-sm font-semibold text-white">EA</span>
            Eduflick AI
          </Link>
          <Link href="/" className="inline-flex items-center justify-center rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20">
            Back to site
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-md px-4 pb-24 pt-20 sm:pt-28">
        <div className="rounded-3xl border border-blue-200/15 bg-[#040b1f]/80 p-8 shadow-[0_40px_120px_-60px_rgba(15,23,42,0.9)] sm:p-10">
          <div className="space-y-3 text-center">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-200/20 bg-blue-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-blue-100/80">
              Sign in
            </span>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">Welcome back</h1>
            <p className="text-sm text-blue-100/80">Sign in to continue to registration and payment.</p>
          </div>

          {!isAuthConfigured ? (
            <div className="mt-6 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-100" role="alert">
              Supabase credentials are missing. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your
              environment, then refresh this page.
            </div>
          ) : null}

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <label className="block space-y-2 text-sm text-blue-100/80">
              <span className="text-xs font-semibold uppercase tracking-wide text-blue-100/70">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="w-full rounded-xl border border-blue-200/20 bg-[#060f2d]/80 px-4 py-3 text-sm text-white placeholder:text-blue-100/50 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
              />
            </label>
            <label className="block space-y-2 text-sm text-blue-100/80">
              <span className="text-xs font-semibold uppercase tracking-wide text-blue-100/70">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="w-full rounded-xl border border-blue-200/20 bg-[#060f2d]/80 px-4 py-3 text-sm text-white placeholder:text-blue-100/50 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
              />
            </label>

            {error ? (
              <div className="text-center text-sm text-red-300" role="alert">{error}</div>
            ) : (
              <div className="min-h-[1.25rem]" />
            )}

            <button
              type="submit"
              disabled={isSubmitting || !isAuthConfigured}
              className="inline-flex w-full items-center justify-center rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? (mode === "signin" ? "Signing in..." : "Creating account...") : mode === "signin" ? "Sign in" : "Create account"}
            </button>
            <p className="text-center text-xs text-blue-100/70">
              {mode === "signin" ? (
                <>
                  Don’t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className="text-blue-300 hover:underline"
                  >
                    Create account
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signin")}
                    className="text-blue-300 hover:underline"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </form>
        </div>
      </section>
    </main>
  )
}

