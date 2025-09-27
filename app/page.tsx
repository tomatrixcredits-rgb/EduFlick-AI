import type React from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { cn } from "@/lib/utils"

function Section({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28">
      {children}
    </section>
  )
}

function ProgramOverviewSection() {
  const programHighlights = [
    { label: "Duration", value: "8 Weeks" },
    { label: "Format", value: "Remote • Mentor-led" },
    { label: "Tracks", value: "3 Specialisations" },
    { label: "Time Commitment", value: "5–7 hrs / week" },
    { label: "Community", value: "Private Discord + Alumni Pods" },
    { label: "Outcome", value: "Portfolio-ready launch projects" },
  ]

  const cohortDetails = [
    { label: "Next Cohort", value: "Batch 5 • Starts 16 December 2024" },
    { label: "Application Deadline", value: "12 December 2024" },
    { label: "Support", value: "Daily mentor clinics + async desk" },
  ]

  const tracks = [
    {
      number: "Track 01",
      title: "AI-Powered Content Creation",
      description:
        "Master short-form video, image, and copy generation to produce compelling digital stories that perform across platforms.",
      modules: [
        "Concept lab & story hook frameworks",
        "Multi-format asset generation workflows",
        "Edit automation, captions & distribution",
      ],
      tools: ["Runway", "Pika", "HeyGen", "Kling", "ElevenLabs", "Descript"],
      capstone: "Produce and publish a 60-second AI-generated advert across social channels.",
    },
    {
      number: "Track 02",
      title: "AI-Driven Software Development",
      description: "Build production-ready apps with built-in intelligence and real-time assistance.",
      modules: [
        "Product discovery & UX flow planning",
        "Full-stack builds with AI copilots",
        "Testing, analytics & deployment playbooks",
      ],
      tools: ["FlutterFlow", "Supabase", "Next.js", "Python", "OpenAI APIs", "LangChain"],
      capstone: "Launch a chat-enabled mobile app that gives AI-powered feedback to users.",
    },
    {
      number: "Track 03",
      title: "AI Automation & Agentic Development",
      description: "Design autonomous workflows and multi-step AI agents that save hours every day.",
      modules: [
        "Automation design fundamentals",
        "Multi-agent orchestration & prompt engineering",
        "Monitoring, handoff, and ROI playbooks",
      ],
      tools: ["n8n", "Zapier", "Make", "LangChain", "Pinecone", "Slack/WhatsApp APIs"],
      capstone: "Create a sales-funnel WhatsApp bot that qualifies leads end-to-end.",
    },
  ]

  return (

    <div className="mx-auto max-w-6xl px-4 pb-24">
      <div className="space-y-8">
        <section
          className={cn(
            "rounded-3xl border border-blue-200/15 bg-[#050b1f]/80 p-8 sm:p-10",
            "shadow-[0_40px_120px_-60px_rgba(15,23,42,0.9)]",
          )}
        >
          <div className="flex flex-col gap-10 lg:flex-row">
            <div className="flex-1 space-y-6 text-white/80">
              <div className="space-y-3">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-200/20 bg-blue-500/10 px-4 py-1 text-xs font-medium uppercase tracking-wide text-blue-100/80">
                  Program Overview
                </span>
                <div className="space-y-2">
                  <h2 className="text-3xl font-semibold text-white sm:text-4xl">Eduflick AI Bootcamp</h2>
                  <p className="max-w-xl text-sm sm:text-base">
                    8-week creator fellowship covering the full Eduflick curriculum — from cinematic AI storytelling to intelligent apps and automation studios.
                  </p>
                </div>
              </div>
              <dl className="grid gap-4 text-sm text-blue-100/85 sm:grid-cols-2 lg:grid-cols-3">
                {programHighlights.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-blue-200/15 bg-white/5 p-4">
                    <dt className="text-xs uppercase tracking-wide text-blue-100/70">{item.label}</dt>
                    <dd className="mt-1 text-base text-white">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="flex-1 space-y-4">
              <div className="rounded-2xl border border-blue-200/15 bg-[#061031]/85 p-6 text-white/80">
                <h3 className="text-lg font-semibold text-white">Cohort Timeline</h3>
                <ul className="mt-4 space-y-3 text-sm">
                  {cohortDetails.map((item) => (
                    <li key={item.label} className="flex flex-col gap-1 rounded-xl border border-blue-200/10 bg-white/[0.04] p-4 text-blue-100/85">
                      <span className="text-xs font-semibold uppercase tracking-wide text-blue-100/70">{item.label}</span>
                      <span className="text-sm text-white">{item.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-blue-200/15 bg-[#061031]/85 p-6 text-sm text-blue-100/80">
                <h3 className="text-base font-semibold text-white">How the bootcamp runs</h3>
                <ul className="mt-4 space-y-2">
                  <li className="flex gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-blue-400" aria-hidden />
                    <span>Live sprint rooms every weekend with mentor critiques.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-blue-400" aria-hidden />
                    <span>Async build labs and checklists to ship during the week.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-blue-400" aria-hidden />
                    <span>Dedicated support channel for tooling, prompts, and debugging.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <div className="space-y-6">
          {tracks.map((track) => (
            <article
              key={track.title}
              className="rounded-3xl border border-blue-200/15 bg-[#040b26]/85 p-8 text-white/80 shadow-[inset_0_1px_0_rgba(148,163,252,0.08)]"
            >
              <div className="flex flex-col gap-8 lg:flex-row">
                <div className="flex-1 space-y-4">
                  <span className="inline-flex items-center gap-2 rounded-full border border-blue-200/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-100/80">
                    {track.number}
                  </span>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-semibold text-white">{track.title}</h3>
                    <p className="text-sm leading-relaxed text-blue-100/85">{track.description}</p>
                  </div>
                </div>
                <div className="grid flex-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-blue-200/15 bg-white/[0.03] p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-100/70">Sprint Modules</p>
                    <ul className="mt-3 space-y-2 text-sm">
                      {track.modules.map((module) => (
                        <li key={module} className="text-blue-100/85">
                          {module}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-blue-200/15 bg-white/[0.03] p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-100/70">Tool Stack</p>
                    <ul className="mt-3 space-y-2 text-sm">
                      {track.tools.map((tool) => (
                        <li key={tool} className="text-blue-100/85">
                          {tool}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-blue-200/15 bg-white/[0.03] p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-100/70">Capstone Project</p>
                    <p className="mt-3 text-sm text-blue-100/85">{track.capstone}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

function ExperienceSection() {
  const highlights = [
    {
      title: "AI Production Pod",
      description:
        "Build edits in real time with modern design, script, and edit labs run like a micro studio.",
    },
    {
      title: "Cinematic Operating System",
      description:
        "Access end-to-end pipelines, layered prompt systems, legal templates, licensing, and daily automations.",
    },
    {
      title: "Insight Reviews",
      description:
        "Weekly critiques with festival-winning directors and growth leads to sharpen every deliverable.",
    },
    {
      title: "Creator Economy Access",
      description:
        "Pitch to studio partners, agencies, and collab boards while unlocking micro-grants for your stories.",
    },
  ]

  return (

    <div className="mx-auto max-w-6xl px-4 pb-24">
      <div
        className={cn(
          "rounded-[32px] border border-blue-200/10 bg-[#060d24]/85 p-10",
          "shadow-[0_35px_120px_-60px_rgba(14,23,42,0.85)]",
        )}
      >
        <div className="flex flex-col gap-10 lg:flex-row">
          <div className="flex-1 space-y-5 text-white/85">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-200/15 bg-blue-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-100/80">
              Fellowship Experience
            </span>
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">Designed for emerging AI filmmakers</h2>
              <p className="max-w-lg text-sm sm:text-base text-blue-100/80">
                Everything you need to build, iterate, and ship inside a modern studio. Get tuned for high-output creators balancing art and analytics.
              </p>
            </div>
          </div>
          <div className="grid flex-1 gap-6 sm:grid-cols-2">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-blue-200/10 bg-[#050a1d]/90 p-6 shadow-[inset_0_1px_0_rgba(148,163,252,0.12)]"
              >
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm text-blue-100/80">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function PricingSection() {
  const plans = [
    {
      name: "Basic",
      price: "₹499",
      originalPrice: "₹3,500",
      perks: ["Creator runway trial seat", "Async sprint workbook", "Live kickoff orientation", "Access to AI launchpad community"],
    },
    {
      name: "Pro",
      price: "₹999",
      perks: [
        "Everything in Basic",
        "Weekly mentor studio clinics",
        "Captions + thumbnail automation stack",
        "Creator growth metrics dashboard",
      ],
      cta: "Choose Pro",
    },
    {
      name: "Premium",
      price: "₹1,999",
      perks: ["Everything in Pro", "1:1 story doctor on retainer", "Quarterly studio open-door LOR", "Alumni drop & brand brief priority"],
    },
  ]

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24">
      <div
        className={cn(
          "rounded-3xl border border-blue-200/10 bg-[#040c2a]/80 p-10",
          "shadow-[0_40px_120px_-60px_rgba(30,64,175,0.6)]",
        )}
      >
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm space-y-3">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-200/10 bg-blue-400/10 px-4 py-1 text-sm text-blue-100/80">
              Sign Up
            </span>
            <h2 className="text-3xl font-semibold text-white">Creator Runway Plans</h2>
            <p className="text-blue-100/80">Pick the intensity that fits your momentum. Cohort seats are limited.</p>
          </div>
          <div className="text-left text-blue-100/80">
            <p className="text-sm">Need help choosing?</p>
            <p className="text-base text-white">Write to hello@eduflick.ai</p>
          </div>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.name} className="rounded-2xl border border-blue-200/10 bg-[#050e2c]/80 p-6">
              <div className="space-y-1 text-center">
                <p className="text-xs uppercase tracking-wide text-blue-100/70">{plan.name}</p>
                <p className="text-3xl font-semibold text-white">{plan.price}</p>
                {plan.originalPrice && (
                  <p className="text-sm text-blue-100/60 line-through">{plan.originalPrice}</p>
                )}
              </div>
              <ul className="mt-6 space-y-3 text-sm text-blue-100/80">
                {plan.perks.map((perk) => (
                  <li key={perk} className="flex gap-3">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400" aria-hidden />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>
        <div className="mt-12 flex justify-center">
          <Link
            href="/register"
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold", 
              "bg-blue-500 text-white transition-colors hover:bg-blue-400", 
              "shadow-[inset_0_1px_0_rgba(148,163,252,0.18),0_15px_40px_-18px_rgba(59,130,246,0.6)]", 
              "ring-1 ring-inset ring-blue-200/40"
            )}
          >
            Register & Pay
          </Link>

        </div>
      </div>
    </div>
  )
}

function FAQSection() {
  const faqs = [
    {
      q: "Who is this fellowship for?",
      a: "Students, early professionals, and career switchers who want a fast, execution-first pathway into applied AI storytelling.",
    },
    {
      q: "How long will it take to learn everything?",
      a: "The core fellowship runs in 7 days, with lifetime alumni access and a capstone you can keep improving after the sprint.",
    },
    {
      q: "Do I need prior AI experience?",
      a: "No. We teach by building — every workflow includes guided prompts, checklists, and mentor feedback until it clicks.",
    },
    {
      q: "Will this help me earn as a creator?",
      a: "Absolutely. Each sprint ends with monetisable assets, rate card templates, and live partner briefs for pitching.",
    },
    {
      q: "Can I defer my seat?",
      a: "Seats are limited to keep pods tight. You can defer once to a future cohort if requested before kickoff week.",
    },
    {
      q: "Do I get tool access?",
      a: "Yes — you'll receive access to a premium AI tool suite for the fellowship duration.",
    },
  ]

  return (
    <div className="mx-auto max-w-4xl px-4 pb-32">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-blue-200/10 bg-blue-400/10 px-4 py-1 text-sm text-blue-100/80">
          FAQ
        </span>
        <h2 className="mt-6 text-3xl font-semibold text-white sm:text-4xl">Frequently Asked Questions</h2>
      </div>
      <div className="mt-10 space-y-4">
        {faqs.map((faq) => (
          <div
            key={faq.q}
            className="rounded-2xl border border-blue-200/10 bg-[#050d29]/80 p-6 shadow-[inset_0_1px_0_rgba(148,163,252,0.08)]"
          >
            <h3 className="text-lg font-medium text-white">{faq.q}</h3>
            <p className="mt-2 text-sm text-blue-100/80">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030616] text-white">
      <div aria-hidden className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.2),_rgba(29,78,216,0.15),_transparent_70%)]" />
      <Navbar />
      <div id="top" />
      <Hero />
      <Section id="experience">
        <ExperienceSection />
      </Section>
      <Section id="overview">
        <ProgramOverviewSection />
      </Section>
      <Section id="pricing">
        <PricingSection />
      </Section>
      <Section id="faq">
        <FAQSection />
      </Section>
    </main>
  )
}
