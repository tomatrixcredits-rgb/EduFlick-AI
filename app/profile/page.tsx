"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"

import { getSupabaseBrowserClient } from "@/lib/supabase/client"

export default function ProfilePage() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), [])
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!supabase) return
    let isMounted = true
    const load = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      if (!sessionData.session) {
        const next = typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}` : "/profile"
        window.location.replace(`/signin?next=${encodeURIComponent(next)}`)
        return
      }
      const { data: userData } = await supabase.auth.getUser()
      const userId = userData.user?.id
      if (!userId) return
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, phone, email")
        .eq("id", userId)
        .maybeSingle()
      if (!isMounted) return
      setFullName(((profile as any)?.full_name as string | null) ?? "")
      setPhone(((profile as any)?.phone as string | null) ?? "")
      setEmail(((profile as any)?.email as string | null) ?? "")
    }
    void load()
    return () => {
      isMounted = false
    }
  }, [supabase])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) return
    setStatus("saving")
    setMessage("")
    try {
      const { data: userData } = await supabase.auth.getUser()
      const userId = userData.user?.id
      if (!userId) throw new Error("Not authenticated")
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, full_name: fullName || undefined, phone: phone || undefined, email: email || undefined }),
      })
      if (!response.ok) throw new Error("Failed to save profile")
      setStatus("success")
      setMessage("Profile updated")
    } catch (err) {
      setStatus("error")
      setMessage(err instanceof Error ? err.message : "Unable to save profile")
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030616] text-white">
      <div aria-hidden className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),_rgba(29,78,216,0.1),_transparent_70%)]" />

      <header className="relative z-10 border-b border-white/5 bg-[#050d25]/80">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-5">
          <Link href="/dashboard" className="flex items-center gap-3 text-sm font-medium text-white/80">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-blue-400/20 text-sm font-semibold text-white">EA</span>
            Eduflick AI
          </Link>
          <Link href="/dashboard" className="inline-flex items-center justify-center rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20">Back to dashboard</Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-3xl px-4 pb-24 pt-12">
        <h1 className="text-2xl font-semibold text-white">Edit your profile</h1>
        <form className="mt-8 space-y-5" onSubmit={handleSave}>
          <label className="block space-y-2 text-sm text-blue-100/80">
            <span className="text-xs font-semibold uppercase tracking-wide text-blue-100/70">Full name</span>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full rounded-xl border border-blue-200/20 bg-[#060f2d]/80 px-4 py-3 text-sm text-white placeholder:text-blue-100/50 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
            />
          </label>
          <label className="block space-y-2 text-sm text-blue-100/80">
            <span className="text-xs font-semibold uppercase tracking-wide text-blue-100/70">Phone</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone"
              className="w-full rounded-xl border border-blue-200/20 bg-[#060f2d]/80 px-4 py-3 text-sm text-white placeholder:text-blue-100/50 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
            />
          </label>
          <label className="block space-y-2 text-sm text-blue-100/80">
            <span className="text-xs font-semibold uppercase tracking-wide text-blue-100/70">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full rounded-xl border border-blue-200/20 bg-[#060f2d]/80 px-4 py-3 text-sm text-white placeholder:text-blue-100/50 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
            />
          </label>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
            disabled={status === "saving"}
          >
            {status === "saving" ? "Saving..." : "Save changes"}
          </button>
          <div className="min-h-[1.25rem] text-sm" aria-live="polite" role="status">
            {message ? (
              <span className={status === "success" ? "text-emerald-300" : status === "error" ? "text-red-300" : "text-blue-100/80"}>{message}</span>
            ) : null}
          </div>
        </form>
      </section>
    </main>
  )
}

