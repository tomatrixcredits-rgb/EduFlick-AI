import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Eduflick AI Legal",
  description: "Legal and support information for Eduflick AI.",
}

export default function LegalLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen bg-[#080c1f] text-white/90">
      <main className="mx-auto w-full max-w-4xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="space-y-12">{children}</div>
      </main>
    </div>
  )
}
