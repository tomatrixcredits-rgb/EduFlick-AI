import type React from "react"
import { Navbar } from "@/components/navbar"
import { cn } from "@/lib/utils"

function StageCard({
  label,
  color,
  children,
}: {
  label: string
  color: "red" | "blue" | "violet"
  children: React.ReactNode
}) {
  const hue =
    color === "red" ? "rgba(239,68,68,0.4)" : color === "blue" ? "rgba(59,130,246,0.45)" : "rgba(139,92,246,0.45)"
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-6",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_30px_80px_-40px_rgba(0,0,0,0.7)]",
      )}
    >
      {/* blurred glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(300px 140px at 60% 35%, ${hue}, transparent 70%)`,
          filter: "blur(12px)",
          opacity: 0.55,
        }}
      />
      <div className="relative">
        <div className="text-2xl font-semibold text-white">{label}</div>
        <div className="mt-3 text-white/75">{children}</div>
      </div>
    </div>
  )
}

export default function InsidePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      <Navbar />
      <section className="relative mx-auto max-w-5xl px-6 pt-16 pb-24 text-center">
        <span
          className={cn(
            "inline-flex items-center gap-2 rounded-full border border-white/10",
            "bg-white/[0.04] px-4 py-1 text-sm text-white/80",
            "shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]",
          )}
        >
          Inside
        </span>
        <h1 className="mt-6 text-balance text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-white">
          What <span className="font-serif italic text-white/90">To Expect</span>
        </h1>
        <p className="mt-3 text-lg text-white/60">Course is organized in 3 stages</p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <StageCard label="Stage 1" color="red">
            If you're a complete beginner, this is perfect for you. Learn interface, layers, compositions, tools, and
            more.
          </StageCard>
          <StageCard label="Stage 2" color="blue">
            Learn effects and daily-use techniques that are essential for taking your work to the next level.
          </StageCard>
          <StageCard label="Stage 3" color="violet">
            Advanced techniques with detailed breakdown lessons and full editing sessions to master the craft.
          </StageCard>
        </div>
      </section>
    </main>
  )
}
