import Link from "next/link"

const legalLinks = [
  { href: "/contact-us", label: "Contact Us" },
  { href: "/terms-and-conditions", label: "Terms & Conditions" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/cancellation-refunds", label: "Cancellation & Refunds" },
] as const

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#040a1f] text-white/70">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="text-xs uppercase tracking-[0.3em] text-blue-200/70">Eduflick AI</p>
        <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
          <p className="text-sm text-white/60 sm:mr-6 sm:text-right">
            © {new Date().getFullYear()} Eduflick AI. All rights reserved.
          </p>
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/80">
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="transition-colors hover:text-white">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
