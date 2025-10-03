"use client"

import { FormEvent, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { getSupabaseBrowserClient } from "@/lib/supabase/client"

const trackOptions = [
  {
    value: "ai-content",
    label: "Track 01 – AI-Powered Content Creation",
  },
  {
    value: "ai-software",
    label: "Track 02 – AI-Driven Software Development",
  },
  {
    value: "ai-automation",
    label: "Track 03 – AI Automation & Agentic Development",
  },
]

type RegistrationErrors = Partial<
  Record<"name" | "email" | "phone" | "track" | "form" | "company", string[]>
>

export default function RegisterPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [errors, setErrors] = useState<RegistrationErrors>({})
  const emailInputRef = useRef<HTMLInputElement>(null)

  const supabase = useMemo(() => getSupabaseBrowserClient(), [])

  useEffect(() => {
    if (!supabase) {
      setStatus("error")
      setMessage("Authentication is not configured. Please contact the Eduflick AI team.")
      return
    }
    let isMounted = true
    const bootstrapFlow = async () => {
      const { data } = await supabase.auth.getSession()
      if (!isMounted) return
      if (!data.session) {
        const next = typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}` : "/register"
        router.replace(`/signin?next=${encodeURIComponent(next)}`)
        return
      }

      const { data: userData } = await supabase.auth.getUser()
      const user = userData.user
      if (!user) {
        router.replace("/signin")
        return
      }

      const authEmail = user.email?.trim()
      if (authEmail && emailInputRef.current) {
        emailInputRef.current.value = authEmail
      }

      const userId = user.id
      const [{ data: profile }, { data: enrollment }] = await Promise.all([
        supabase
          .from("profiles")
          .select("onboarding_stage")
          .eq("id", userId)
          .maybeSingle(),
        supabase
          .from("enrollments")
          .select("payment_status")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
      ])

      if (!isMounted) return

      const stage = (profile as { onboarding_stage?: string | null } | null)?.onboarding_stage
      const paymentStatus = (enrollment as { payment_status?: string | null } | null)?.payment_status

      if (paymentStatus === "paid" || stage === "active") {
        router.replace("/dashboard")
        return
      }

      if (paymentStatus === "pending" || stage === "payment_pending") {
        router.replace("/register/payment")
      }
    }

    void bootstrapFlow()
    return () => {
      isMounted = false
    }
  }, [router, supabase])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)
    const company = formData.get("company")?.toString().trim()

    const payload: Record<string, string> = {
      name: formData.get("name")?.toString().trim() ?? "",
      email: formData.get("email")?.toString().trim() ?? "",
      phone: formData.get("phone")?.toString().trim() ?? "",
      track: formData.get("track")?.toString() ?? "",
    }

    if (company) {
      payload.company = company
    }

    setIsSubmitting(true)
    setStatus("idle")
    setMessage("")
    setErrors({})

    try {
      // Keep email in sync with auth email
      const { data: userData } = await supabase!.auth.getUser()
      const authEmail = userData.user?.email?.trim()
      if (authEmail) {
        payload.email = authEmail
      }

      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        setStatus("error")
        setMessage(data?.message ?? "Something went wrong. Please try again.")
        setErrors((data?.errors as RegistrationErrors) ?? {})
        return
      }

      // Create an enrollment row linked to the authenticated user
      const userId = userData.user?.id
      if (!userId) {
        setStatus("error")
        setMessage("You need to be logged in to complete enrollment.")
        return
      }

      const enrollResponse = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          track: payload.track,
        }),
      })

      const enrollJson = await enrollResponse.json().catch(() => null)
      if (!enrollResponse.ok) {
        setStatus("error")
        setMessage(enrollJson?.message ?? "Unable to create enrollment. Please try again.")
        setErrors((enrollJson?.errors as RegistrationErrors) ?? {})
        return
      }

      setStatus("success")
      setMessage("Enrollment created. Redirecting to payment...")
      setErrors({})
      form.reset()

      if (emailInputRef.current) {
        emailInputRef.current.value = payload.email
      }

      const query = new URLSearchParams({
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
      })

      router.push(`/register/payment?${query.toString()}`)
    } catch (error) {
      setStatus("error")
      setMessage("Unable to submit the form right now. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030616] text-white">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.2),_rgba(29,78,216,0.15),_transparent_75%)]"
      />
      <header className="relative z-10 border-b border-white/5 bg-[#050d25]/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5">
          <Link href="/" className="flex items-center gap-3 text-sm font-medium text-white/80">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-blue-400/20 text-sm font-semibold text-white">
              EA
            </span>
            Eduflick AI
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20"
          >
            Back to site
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-3xl px-4 pb-24 pt-20 sm:pt-28">
        <div className="rounded-3xl border border-blue-200/15 bg-[#040b1f]/80 p-8 shadow-[0_40px_120px_-60px_rgba(15,23,42,0.9)] sm:p-12">
          <div className="space-y-3 text-center sm:text-left">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-200/20 bg-blue-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-blue-100/80">
              Secure your seat
            </span>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">Register for Eduflick AI</h1>
            <p className="text-sm text-blue-100/80 sm:max-w-xl">
              Tell us where to send your onboarding kit. Our team will share the payment link and confirm your cohort slot within 24 hours.
            </p>
          </div>

          <form className="mt-10 space-y-6" onSubmit={handleSubmit} noValidate>
            <div className="hidden" aria-hidden>
              <label className="block text-sm">
                <span className="text-xs">Company</span>
                <input
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                />
              </label>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-blue-100/80">
                <span className="text-xs font-semibold uppercase tracking-wide text-blue-100/70">Full name</span>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Enter your full name"
                  aria-invalid={errors.name ? true : undefined}
                  className="w-full rounded-xl border border-blue-200/20 bg-[#060f2d]/80 px-4 py-3 text-sm text-white placeholder:text-blue-100/50 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
                />
                {errors.name?.length ? (
                  <p className="text-xs text-red-300">{errors.name[0]}</p>
                ) : null}
              </label>
              <label className="space-y-2 text-sm text-blue-100/80">
                <span className="text-xs font-semibold uppercase tracking-wide text-blue-100/70">Phone number</span>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="Enter your phone number"
                  aria-invalid={errors.phone ? true : undefined}
                  className="w-full rounded-xl border border-blue-200/20 bg-[#060f2d]/80 px-4 py-3 text-sm text-white placeholder:text-blue-100/50 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
                />
                {errors.phone?.length ? (
                  <p className="text-xs text-red-300">{errors.phone[0]}</p>
                ) : null}
              </label>
            </div>
            <label className="block space-y-2 text-sm text-blue-100/80">
              <span className="text-xs font-semibold uppercase tracking-wide text-blue-100/70">Email</span>
              <input
                type="email"
                name="email"
                required
                ref={emailInputRef}
                placeholder="Enter your email"
                aria-invalid={errors.email ? true : undefined}
                className="w-full rounded-xl border border-blue-200/20 bg-[#060f2d]/80 px-4 py-3 text-sm text-white placeholder:text-blue-100/50 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
              />
              {errors.email?.length ? (
                <p className="text-xs text-red-300">{errors.email[0]}</p>
              ) : null}
            </label>
            <label className="block space-y-2 text-sm text-blue-100/80">
              <span className="text-xs font-semibold uppercase tracking-wide text-blue-100/70">Select your track</span>
              <select
                name="track"
                required
                defaultValue=""
                aria-invalid={errors.track ? true : undefined}
                className="w-full appearance-none rounded-xl border border-blue-200/20 bg-[#060f2d]/80 px-4 py-3 text-sm text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
              >
                <option value="" disabled>
                  Choose a track
                </option>
                {trackOptions.map((track) => (
                  <option key={track.value} value={track.value} className="bg-[#060f2d] text-white">
                    {track.label}
                  </option>
                ))}
              </select>
              {errors.track?.length ? (
                <p className="text-xs text-red-300">{errors.track[0]}</p>
              ) : null}
            </label>
            <button
              type="submit"
              disabled={isSubmitting || !supabase}
              className="inline-flex w-full items-center justify-center rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Submitting..." : "Submit & Continue to Payment"}
            </button>
            <div className="min-h-[1.25rem] text-center text-sm" aria-live="polite" role="status">
              {status !== "idle" ? (
                <span
                  className={
                    status === "success" ? "text-emerald-300" : "text-red-300"
                  }
                >
                  {message}
                </span>
              ) : null}
            </div>
            {errors.form?.length ? (
              <p className="text-center text-xs text-red-300">{errors.form[0]}</p>
            ) : null}
          </form>
        </div>
      </section>
    </main>
  )
}
