import { Navbar } from "@/components/navbar"
import { cn } from "@/lib/utils"

export default function FeaturesPage() {
  const pillars = [
    {
      title: "Ship with rhythm",
      body: "Daily briefs and async reviews keep you publishing instead of procrastinating.",
    },
    {
      title: "Creative taste, automated",
      body: "Blend AI generations with film fundamentals so the work still feels human.",
    },
    {
      title: "Mentors on speed dial",
      body: "Live studio clinics plus DM-able coaches when you hit an edit wall.",
    },
    {
      title: "Community compounding",
      body: "Accountability pods, alumni job drops, and collab threads that keep momentum high.",
    },
  ]

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030616] text-white">
      <div aria-hidden className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.2),_rgba(29,78,216,0.15),_transparent_70%)]" />
      <Navbar />
      <section className="relative mx-auto max-w-5xl px-6 pt-36 pb-24">
        <span
          className={cn(
            "inline-flex items-center gap-2 rounded-full border border-white/10",
            "bg-[#050d25]/70 px-4 py-1 text-sm text-blue-100/80",
            "shadow-[inset_0_1px_0_rgba(148,163,252,0.14)]",
          )}
        >
          Why creators stay
        </span>

        <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Inside the Eduflick AI experience
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-blue-100/80">
          The fellowship is designed to feel focused, calm, and momentum-rich. Here are the pillars that alumni cite the most.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className={cn(
                "rounded-2xl border border-blue-200/10 bg-[#050e2c]/80 p-6",
                "shadow-[inset_0_1px_0_rgba(148,163,252,0.08),0_30px_80px_-60px_rgba(30,64,175,0.55)]",
              )}
            >
              <h3 className="text-lg font-semibold text-white">{pillar.title}</h3>
              <p className="mt-2 text-sm text-blue-100/80">{pillar.body}</p>
              <div className="mt-4 inline-flex items-center gap-2 text-sm text-blue-100/80">
                <span>Learn more</span>
                <span aria-hidden>→</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
