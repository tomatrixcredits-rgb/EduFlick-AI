import { cn } from "@/lib/utils"

function Avatars() {
  const items = ["/member-1.png", "/member-2.png", "/member-3.png"]
  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-2">
        {items.map((src, i) => (
          <img
            key={i}
            src={src || "/placeholder.svg"}
            alt="Community member avatar"
            className="h-8 w-8 rounded-full border border-black/40"
          />
        ))}
      </div>
      <p className="ml-3 text-sm text-white/70">Join 1,200+ creators remixing their workflows</p>
    </div>
  )
}

const STATS = [
  { label: "Cohort satisfaction", value: "98%" },
  { label: "Avg. project views", value: "32k" },
  { label: "Active mentors", value: "12" },
]

export function Hero() {
  return (

    <section className="relative isolate mx-auto max-w-5xl px-6 pt-36 pb-28">
      <div
        aria-hidden
        className={cn(
          "absolute inset-x-8 -top-24 -z-10 h-[480px] rounded-[40px]",
          "bg-[radial-gradient(circle_at_top,_rgba(96,165,250,0.35),_rgba(37,99,235,0.15),_transparent_70%)]",
          "blur-3xl opacity-70",
        )}
      />

      <div className="space-y-6 text-center">
        <span
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-full border border-white/10",
            "bg-black/40 px-4 py-1 text-sm text-white/70",
            "shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]",
          )}
        >
          Eduflick AI Fellowship · April 2025 Cohort
        </span>

        <h1 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
          Build a signature AI storytelling system in 7 days
        </h1>

        <p className="text-lg text-white/65 md:text-xl">
          Learn the creator stack that blends Runway, Pika, and Descript with human taste so every drop feels cinematic.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <a
            href="#experience"
            className={cn(
              "inline-flex items-center justify-center rounded-xl px-5 py-3 text-base font-medium",
              "bg-blue-400 text-slate-950 transition-colors hover:bg-blue-300",
              "shadow-[0_18px_40px_-20px_rgba(96,165,250,0.7)]",
            )}
          >
            Explore the sprint
          </a>
          <a
            href="#pricing"
            className={cn(
              "inline-flex items-center justify-center rounded-xl px-5 py-3 text-base font-medium",
              "bg-transparent text-white/80 ring-1 ring-blue-200/30 transition-colors hover:text-white hover:ring-blue-200/50",
            )}
          >
            View pricing
          </a>
        </div>

        <div className="flex justify-center pt-6">
          <Avatars />
        </div>

        <dl className="mx-auto grid max-w-3xl gap-4 pt-10 text-left text-white/70 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-center">
            <dt className="text-xs uppercase tracking-[0.2em] text-white/50">Cohort size</dt>
            <dd className="mt-2 text-2xl font-semibold text-white">30 creators</dd>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-center">
            <dt className="text-xs uppercase tracking-[0.2em] text-white/50">Capstone</dt>
            <dd className="mt-2 text-2xl font-semibold text-white">AI Studio Reel</dd>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-center">
            <dt className="text-xs uppercase tracking-[0.2em] text-white/50">Tool access</dt>
            <dd className="mt-2 text-2xl font-semibold text-white">7-day premium</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}
