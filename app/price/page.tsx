import { Navbar } from "@/components/navbar"
import { cn } from "@/lib/utils"

export default function PricePage() {
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
          Pricing
        </span>

        <h1 className="mt-6 text-balance text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-white">
          Get <span className="font-serif italic text-white/90">Inside</span>
        </h1>
        <p className="mt-3 text-lg text-white/60">One-time payment. Lifetime access. Future updates included.</p>

        <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_30px_80px_-40px_rgba(0,0,0,0.7)]">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-white">Editucation 2.0</h3>
              <ul className="mt-3 space-y-2 text-white/75">
                <li>• 3-stage curriculum with project files</li>
                <li>• Community access and feedback</li>
                <li>• All future updates</li>
              </ul>
            </div>

            <div className="text-left md:text-right">
              <div className="text-4xl font-semibold text-white tracking-tight">$149</div>
              <div className="text-sm text-white/60">one-time</div>
              <a
                href="#checkout"
                className={cn(
                  "mt-4 inline-flex items-center justify-center rounded-xl px-5 py-3 text-base font-medium",
                  "bg-red-600 text-white",
                  "shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_20px_40px_-10px_rgba(239,68,68,0.65)]",
                  "ring-1 ring-inset ring-white/10 hover:bg-red-500 transition-colors",
                )}
              >
                Get inside
              </a>
            </div>
          </div>
        </div>

        {/* FAQ preview */}
        <div className="mx-auto mt-8 max-w-3xl text-left text-white/70">
          <p className="text-sm">Need a refund? See our Refund Policy on the homepage.</p>
        </div>
      </section>
    </main>
  )
}
