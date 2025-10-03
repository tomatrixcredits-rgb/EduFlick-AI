"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

import { paymentPlans, type PaymentPlan } from "@/lib/plans"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

type PaymentStatus = "idle" | "creating-order" | "waiting-payment" | "success" | "error"

type RazorpayHandlerResponse = {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

type RazorpayErrorEvent = {
  error?: {
    code?: string
    description?: string
    source?: string
    step?: string
    reason?: string
    metadata?: Record<string, unknown>
  }
}

type RazorpayOptions = {
  key: string
  amount: number
  currency: string
  name: string
  description?: string
  image?: string
  order_id: string
  handler: (response: RazorpayHandlerResponse) => void
  prefill?: {
    name?: string
    email?: string
    contact?: string
  }
  notes?: Record<string, unknown>
  theme?: { color?: string }
  modal?: {
    ondismiss?: () => void
  }
}

type RazorpayCheckout = {
  open: () => void
  on: (event: string, handler: (event: RazorpayErrorEvent) => void) => void
  close: () => void
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayCheckout
  }
}

const paymentCompleteStatuses = new Set([
  "paid",
  "success",
  "succeeded",
  "captured",
  "completed",
])

const awaitingPaymentStages = new Set([
  "payment_pending",
  "pending_payment",
  "awaiting_payment",
  "enrolled",
  "registration_complete",
  "payment_required",
])

const RAZORPAY_SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js"

const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? ""

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan>(paymentPlans[1]!)
  const [customerName, setCustomerName] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [customerContact, setCustomerContact] = useState("")
  const [status, setStatus] = useState<PaymentStatus>("idle")
  const [message, setMessage] = useState("")
  const [isCheckoutReady, setIsCheckoutReady] = useState(false)
  const supabase = useMemo(() => getSupabaseBrowserClient(), [])

  useEffect(() => {
    const name = searchParams.get("name")
    const email = searchParams.get("email")
    const contact = searchParams.get("phone")

    if (name) {
      setCustomerName((prev) => (prev ? prev : name))
    }

    if (email) {
      setCustomerEmail((prev) => (prev ? prev : email))
    }

    if (contact) {
      setCustomerContact((prev) => (prev ? prev : contact))
    }
  }, [searchParams])

  useEffect(() => {
    if (!supabase) {
      setStatus("error")
      setMessage("Authentication is not configured. Please contact the Eduflick AI team.")
      return
    }

    let isMounted = true

    const bootstrapPayment = async () => {
      const { data } = await supabase.auth.getSession()
      if (!isMounted) return

      if (!data.session) {
        const next =
          typeof window !== "undefined"
            ? `${window.location.pathname}${window.location.search}`
            : "/register/payment"
        router.replace(`/signin?next=${encodeURIComponent(next)}`)
        return
      }

      const { data: userData } = await supabase.auth.getUser()
      const user = userData.user

      if (!user) {
        setStatus("error")
        setMessage("We could not verify your account. Please sign in again.")
        return
      }

      if (user.email && isMounted) {
        setCustomerEmail(user.email)
      }

      const userId = user.id
      const [{ data: enrollData }, { data: profileData }] = await Promise.all([
        supabase
          .from("enrollments")
          .select("id, payment_status")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from("profiles")
          .select("full_name, phone, email, onboarding_stage")
          .eq("id", userId)
          .maybeSingle(),
      ])
      if (!isMounted) return

      const enrollment = (Array.isArray(enrollData)
        ? enrollData[0]
        : enrollData) as { id?: number; payment_status?: string | null } | null
      const profile = (Array.isArray(profileData)
        ? profileData[0]
        : profileData) as
        | {
            full_name?: string | null
            phone?: string | null
            email?: string | null
            onboarding_stage?: string | null
          }
        | null

      const metadataNameCandidates = [
        user.user_metadata?.full_name,
        user.user_metadata?.name,
        user.user_metadata?.user_name,
        [user.user_metadata?.given_name, user.user_metadata?.family_name]
          .filter((value) => typeof value === "string" && value)
          .join(" "),
      ]

      const metadataFullName =
        metadataNameCandidates
          .map((value) =>
            typeof value === "string" ? value.trim() : "",
          )
          .find((value) => value.length > 0) || null

      const profileFullName = profile?.full_name?.trim() || null

      let candidateName = metadataFullName || profileFullName || null

      if (!candidateName && user.email) {
        const { data: registrationRows } = await supabase
          .from("registrations")
          .select("name")
          .eq("email", user.email)
          .order("created_at", { ascending: false })
          .limit(1)

        const registrationName = (Array.isArray(registrationRows)
          ? registrationRows[0]?.name
          : registrationRows?.name) as string | undefined

        const trimmedRegistrationName = registrationName?.trim()
        if (trimmedRegistrationName) {
          candidateName = trimmedRegistrationName
          await supabase
            .from("profiles")
            .upsert(
              { id: userId, full_name: trimmedRegistrationName },
              { onConflict: "id" },
            )
            .catch(() => null)
        }
      }

      if (!isMounted) return

      if (!profileFullName && candidateName) {
        await supabase
          .from("profiles")
          .update({ full_name: candidateName })
          .eq("id", userId)
          .catch(() => null)
      }

      if (!isMounted) return

      if (candidateName) {
        setCustomerName((prev) => (prev ? prev : candidateName))
      }

      const profilePhone = profile?.phone?.trim()
      if (profilePhone) {
        setCustomerContact((prev) => (prev ? prev : profilePhone))
      }

      const profileEmail = profile?.email?.trim()
      if (user.email && (!profileEmail || profileEmail.toLowerCase() !== user.email.toLowerCase())) {
        await supabase
          .from("profiles")
          .update({ email: user.email })
          .eq("id", userId)
          .catch(() => null)
      }

      if (!isMounted) return

 main
      if (!enrollment) {
        router.replace("/register")
        return
      }

      const paymentStatus = enrollment.payment_status

      const normalisedStage = profile?.onboarding_stage?.toLowerCase() ?? ""
      const normalisedPaymentStatus = paymentStatus?.toLowerCase() ?? ""
      const hasCompletedPayment =
        paymentCompleteStatuses.has(normalisedPaymentStatus) ||
        normalisedStage === "active" ||
        normalisedStage === "completed"

      if (hasCompletedPayment) {
        router.replace("/dashboard")
        return
      }

      const shouldRemainOnPayment =
        awaitingPaymentStages.has(normalisedStage) ||
        (!!enrollment && !paymentCompleteStatuses.has(normalisedPaymentStatus))

      if (!shouldRemainOnPayment) {
        router.replace("/register")
      }
    }

    void bootstrapPayment()

    return () => {
      isMounted = false
    }
  }, [router, supabase])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    if (window.Razorpay) {
      setIsCheckoutReady(true)
      return
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${RAZORPAY_SCRIPT_SRC}"]`,
    )

    if (existingScript) {
      if (window.Razorpay) {
        setIsCheckoutReady(true)
      }
      return
    }

    const script = document.createElement("script")
    script.src = RAZORPAY_SCRIPT_SRC
    script.async = true
    script.onload = () => {
      setIsCheckoutReady(true)
    }
    script.onerror = () => {
      setMessage("Unable to load Razorpay checkout. Please refresh the page and try again.")
      setStatus("error")
    }

    document.body.appendChild(script)

    return () => {
      if (script.parentElement) {
        script.parentElement.removeChild(script)
      }
    }
  }, [])

  const isProcessing = useMemo(
    () => status === "creating-order" || status === "waiting-payment",
    [status],
  )

  const handleCheckout = async () => {
    if (!selectedPlan) {
      return
    }

    if (!razorpayKeyId) {
      setMessage("Razorpay key is not configured. Please contact the support team.")
      setStatus("error")
      return
    }

    if (!isCheckoutReady || typeof window === "undefined" || !window.Razorpay) {
      setMessage("Razorpay checkout is not ready yet. Please wait a moment and try again.")
      setStatus("error")
      return
    }

    setStatus("creating-order")
    setMessage("")

    try {
      const response = await fetch("/api/payments/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId: selectedPlan.id,
          customer: {
            name: customerName || undefined,
            email: customerEmail || undefined,
            contact: customerContact || undefined,
          },
        }),
      })

      const payload = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(
          payload?.message ?? "Unable to create the payment order. Please try again.",
        )
      }

      const { order } = (payload as {
        order?: { id: string; amount: number; currency: string; notes?: Record<string, unknown> }
      }) ?? {}

      if (!order?.id) {
        throw new Error("Received an invalid order response from the server.")
      }

      let checkout: RazorpayCheckout
      checkout = new window.Razorpay!({
        key: razorpayKeyId,
        amount: order.amount,
        currency: order.currency,
        name: "Eduflick AI",
        description: `${selectedPlan.name} plan`,
        order_id: order.id,
        notes: order.notes,
        prefill: {
          name: customerName || undefined,
          email: customerEmail || undefined,
          contact: customerContact || undefined,
        },
        theme: {
          color: "#2563EB",
        },
        handler: async () => {
          // Mark enrollment as paid in Supabase, then hard-redirect reliably
          try {
            const { data: userData } = await supabase!.auth.getUser()
            const userId = userData.user?.id
            if (userId) {
              const response = await fetch("/api/enroll/paid", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, planId: selectedPlan.id }),
              })

              if (!response.ok) {
                throw new Error()
              }
            }

            setStatus("success")
            setMessage("Payment successful! Your enrollment is confirmed.")
          } catch {
            // Even if updating enrollment fails, proceed to redirect so the user isn't stuck
            setStatus("success")
            setMessage("Payment successful! Finalizing your enrollment…")
          } finally {
            // Close the Razorpay modal and force a navigation to avoid SPA router issues
            try {
              checkout?.close()
            } catch {}

            if (typeof window !== "undefined") {
              setTimeout(() => {
                window.location.assign("/dashboard")
              }, 100)
            }
          }
        },
        modal: {
          ondismiss: () => {
            setStatus("error")
            setMessage("Payment window closed before completion.")
          },
        },
      })

      checkout.on("payment.failed", (event) => {
        setStatus("error")
        setMessage(
          event.error?.description ?? "Payment failed. Please try again.",
        )
      })

      setStatus("waiting-payment")
      checkout.open()
    } catch (error) {
      setStatus("error")
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to initiate payment. Please try again.",
      )
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030616] text-white">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),_rgba(29,78,216,0.1),_transparent_70%)]"
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
            href="/register"
            className="inline-flex items-center justify-center rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20"
          >
            Back to registration
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-5xl px-4 pb-24 pt-20 sm:pt-24">
        <div className="rounded-3xl border border-blue-200/15 bg-[#040b1f]/80 p-6 shadow-[0_40px_120px_-60px_rgba(15,23,42,0.9)] sm:p-10">
          <div className="flex flex-col gap-10 lg:flex-row">
            <div className="lg:flex-1">
              <div className="space-y-3">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-200/20 bg-blue-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-blue-100/80">
                  Step 3 • Secure your seat
                </span>
                <h1 className="text-3xl font-semibold text-white sm:text-4xl">
                  Choose your Eduflick AI plan
                </h1>
                <p className="text-sm text-blue-100/80 sm:text-base">
                  Complete your enrollment securely through Razorpay. Select the plan that best matches your goals and continue to checkout.
                </p>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {paymentPlans.map((plan) => {
                  const isSelected = plan.id === selectedPlan.id
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setSelectedPlan(plan)}
                      className={`relative flex h-full flex-col rounded-2xl border px-5 py-6 text-left transition-all ${
                        isSelected
                          ? "border-blue-400/60 bg-blue-500/10 shadow-lg shadow-blue-500/20"
                          : "border-white/5 bg-[#050d25]/80 hover:border-blue-300/30"
                      }`}
                    >
                      {plan.highlight ? (
                        <span className="absolute right-4 top-4 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-100/90">
                          {plan.highlight}
                        </span>
                      ) : null}
                      <div className="text-lg font-semibold text-white">{plan.name}</div>
                      <div className="mt-1 text-sm text-blue-100/70">{plan.description}</div>
                      <div className="mt-4 text-2xl font-semibold text-blue-100">{plan.price}</div>
                      <ul className="mt-4 space-y-2 text-sm text-blue-100/80">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2">
                            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20 text-[10px] font-semibold text-blue-100">
                              ✓
                            </span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="lg:w-80 lg:flex-none">
              <div className="sticky top-32 space-y-6 rounded-2xl border border-blue-200/15 bg-[#050d25]/80 p-6">
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold text-white">Payment summary</h2>
                  <p className="text-sm text-blue-100/70">
                    You will be redirected to Razorpay to securely complete your payment.
                  </p>
                </div>

                <div className="rounded-xl border border-blue-200/10 bg-[#040b1f] p-4">
                  <div className="flex items-center justify-between text-sm text-blue-100/70">
                    <span>Selected plan</span>
                    <span className="font-medium text-white">{selectedPlan.name}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-base font-semibold text-white">
                    <span>Total due</span>
                    <span>{selectedPlan.price}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm text-blue-100/80">
                    <span className="text-xs font-semibold uppercase tracking-wide text-blue-100/70">Name</span>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(event) => setCustomerName(event.target.value)}
                      placeholder="Enter your name"
                      className="mt-1 w-full rounded-xl border border-blue-200/20 bg-[#060f2d]/80 px-4 py-3 text-sm text-white placeholder:text-blue-100/50 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
                    />
                  </label>
                  <label className="block text-sm text-blue-100/80">
                    <span className="text-xs font-semibold uppercase tracking-wide text-blue-100/70">Email</span>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(event) => setCustomerEmail(event.target.value)}
                      placeholder="Enter your email"
                      className="mt-1 w-full rounded-xl border border-blue-200/20 bg-[#060f2d]/80 px-4 py-3 text-sm text-white placeholder:text-blue-100/50 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
                    />
                  </label>
                  <label className="block text-sm text-blue-100/80">
                    <span className="text-xs font-semibold uppercase tracking-wide text-blue-100/70">Phone</span>
                    <input
                      type="tel"
                      value={customerContact}
                      onChange={(event) => setCustomerContact(event.target.value)}
                      placeholder="Enter your phone number"
                      className="mt-1 w-full rounded-xl border border-blue-200/20 bg-[#060f2d]/80 px-4 py-3 text-sm text-white placeholder:text-blue-100/50 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
                    />
                  </label>
                </div>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleCheckout}
                  className="inline-flex w-full items-center justify-center rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isProcessing
                    ? "Processing payment..."
                    : `Pay ${selectedPlan.price} with Razorpay`}
                </button>

                <div className="min-h-[1.25rem] text-center text-sm" aria-live="polite" role="status">
                  {message ? (
                    <span
                      className={
                        status === "success" ? "text-emerald-300" : "text-red-300"
                      }
                    >
                      {message}
                    </span>
                  ) : null}
                </div>

                {!razorpayKeyId ? (
                  <p className="text-center text-xs text-red-300">
                    Razorpay key is not configured. Add NEXT_PUBLIC_RAZORPAY_KEY_ID to your environment variables to enable payments.
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
