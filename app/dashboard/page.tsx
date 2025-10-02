"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

import { getSupabaseBrowserClient } from "@/lib/supabase/client"

type Enrollment = {
  id: number
  track: string
  plan_id: string | null
  payment_status: "pending" | "paid"
}

export default function DashboardPage() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), [])
  const [fullName, setFullName] = useState<string | null>(null)
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) return
    let isMounted = true
    const load = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      if (!sessionData.session) {
        const next = typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}` : "/dashboard"
        window.location.replace(`/signin?next=${encodeURIComponent(next)}`)
        return
      }

      const { data: userData } = await supabase.auth.getUser()
      const userId = userData.user?.id
      if (!userId) return

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", userId)
        .maybeSingle()

      const { data: enroll } = await supabase
        .from("enrollments")
        .select("id, track, plan_id, payment_status")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()

      // Gate dashboard access by payment status
      if (typeof window !== "undefined") {
        if (!enroll) {
          window.location.replace("/register")
          return
        }
        if ((enroll as { payment_status?: string | null }).payment_status !== "paid") {
          window.location.replace("/register/payment")
          return
        }
      }

      if (!isMounted) return
      setFullName((profile as { full_name?: string | null } | null)?.full_name ?? null)
      setEnrollment((enroll as Enrollment | null) ?? null)
      setLoading(false)
    }
    void load()
    return () => {
      isMounted = false
    }
  }, [supabase])

  const handleSignOut = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    window.location.assign("/")
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030616] text-white">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),_rgba(29,78,216,0.1),_transparent_70%)]"
      />

      <header className="relative z-10 border-b border-white/5 bg-[#050d25]/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <Link href="/" className="flex items-center gap-3 text-sm font-medium text-white/80">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-blue-400/20 text-sm font-semibold text-white">EA</span>
            Eduflick AI
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              className="inline-flex items-center justify-center rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/20"
            >
              Edit profile
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center justify-center rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/20"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-6xl px-4 pb-24 pt-12">
        {loading ? (
          <p className="text-sm text-blue-100/80">Loading your dashboard…</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2 space-y-4">
              <h1 className="text-2xl font-semibold text-white">Welcome{fullName ? `, ${fullName}` : ""}</h1>
              {enrollment ? (
                <div className="rounded-2xl border border-blue-200/15 bg-[#040b1f]/80 p-6">
                  <div className="text-sm text-blue-100/70">Your chosen track</div>
                  <div className="mt-1 text-xl font-semibold text-white">
                    {enrollment.track.replace("ai-", "AI ").replace("-", " ")}
                  </div>
                  <div className="mt-2 text-sm text-blue-100/70">
                    Status: <span className={enrollment.payment_status === "paid" ? "text-emerald-300" : "text-yellow-300"}>{enrollment.payment_status}</span>
                    {enrollment.plan_id ? ` • Plan: ${enrollment.plan_id}` : null}
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-white/10 bg-[#040b1f]/80 p-6">
                  <div className="text-sm text-blue-100/80">No enrollment found.</div>
                  <Link href="/register" className="mt-3 inline-flex rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-400">Register now</Link>
                </div>
              )}
            </div>

            <aside className="space-y-4">
              <div className="rounded-2xl border border-blue-200/15 bg-[#050d25]/80 p-6">
                <div className="text-sm font-semibold text-white">Profile</div>
                <div className="mt-2 text-sm text-blue-100/80">{fullName || "Your name"}</div>
                <Link href="/profile" className="mt-4 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20">Edit details</Link>
              </div>
            </aside>
          </div>
        )}
      </section>
    </main>
  )
}

