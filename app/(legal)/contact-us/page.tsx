import type { Metadata } from "next"

import { legalContact } from "@/lib/legal"

export const metadata: Metadata = {
  title: "Contact Us | Eduflick AI",
  description: "Reach the Eduflick AI support team for privacy, billing, and product questions.",
}

export default function ContactPage() {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_40px_120px_-80px_rgba(79,70,229,0.75)] sm:p-12">
      <div className="space-y-6 text-center">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.3em] text-blue-200/70">Support</p>
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">Contact Us</h1>
        </div>
        <p className="mx-auto max-w-2xl text-base text-white/80">
          If you have any questions about this Privacy Policy, please contact us at:
        </p>
        <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-[#0d1330]/80 p-6 text-sm text-white/80">
          <p className="text-base font-medium text-white">Email</p>
          <a href={`mailto:${legalContact.email}`} className="mt-1 block text-lg font-semibold text-blue-200">
            {legalContact.email}
          </a>
          <div className="mt-6 space-y-1 text-center text-sm text-white/80">
            <p className="text-base font-medium text-white">Mailing Address</p>
            <p className="text-white/90">{legalContact.company}</p>
            {legalContact.addressLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
