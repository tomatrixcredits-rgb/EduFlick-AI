"use client"

import Link from "next/link"
import type React from "react"
import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

const SECTIONS = ["experience", "overview", "pricing", "faq"] as const

type SectionId = (typeof SECTIONS)[number]

export function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<SectionId | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id as SectionId)
      },
      {
        threshold: [0.5],
        rootMargin: "-80px 0px -40% 0px",
      },
    )

    SECTIONS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: SectionId) => {

    const el = document.getElementById(id)
    e.preventDefault()

    const y = el.getBoundingClientRect().top + window.scrollY - 96
    window.scrollTo({ top: y, behavior: "smooth" })
  }

  const linkClass = (id: SectionId) =>

    cn("text-sm transition-colors", active === id ? "text-white" : "text-white/70 hover:text-white")

  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 mx-auto mt-6 max-w-5xl px-4", className)} aria-label="Primary">
      <div
        className={cn(
          "flex items-center justify-between gap-4 rounded-2xl border border-blue-200/15",
          "bg-[#050d25]/80 px-6 py-3 backdrop-blur-xl supports-[backdrop-filter]:bg-[#050d25]/60",
          "shadow-[inset_0_1px_0_rgba(148,163,252,0.12),0_15px_45px_-20px_rgba(30,64,175,0.45)]",
        )}
      >
        <a href="#experience" onClick={(e) => scrollToSection(e, "experience")} className="flex items-center gap-3">
          <span
            aria-hidden
            className="grid h-8 w-8 place-items-center rounded-full bg-blue-400/20 text-sm font-semibold text-white"
          >
            EA
          </span>
          <span className="text-sm font-medium text-white/80">Eduflick AI</span>
        </a>

        <nav className="hidden items-center gap-6 md:flex" role="navigation" aria-label="In-page">

          {SECTIONS.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => scrollToSection(e, id)}
              className={linkClass(id)}
              aria-current={active === id ? "page" : undefined}
            >
              {id === "experience"
                ? "Experience"
                : id === "overview"
                ? "Overview"
                : id.charAt(0).toUpperCase() + id.slice(1)}
            </a>
          ))}
        </nav>

        <Link
          href="/signin"
          className={cn(
            "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium",
            "bg-blue-500 text-white transition-colors hover:bg-blue-400",
            "shadow-[inset_0_1px_0_rgba(148,163,252,0.18),0_12px_32px_-12px_rgba(59,130,246,0.75)]",
            "ring-1 ring-inset ring-blue-200/40",
          )}
        >
          Log in
        </Link>
      </div>
    </header>
  )
}
