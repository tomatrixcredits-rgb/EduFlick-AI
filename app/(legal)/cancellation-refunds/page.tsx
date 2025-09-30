import type { Metadata } from "next"

import { legalContact } from "@/lib/legal"

export const metadata: Metadata = {
  title: "Cancellation & Refunds | Eduflick AI",
  description: "Understand Eduflick AI's policies for cancellations, refunds, and digital purchase eligibility.",
}

type RefundSubsection = {
  heading: string
  items: string[]
}

type RefundSection = {
  title: string
  description?: string
  items?: string[]
  subsections?: RefundSubsection[]
}

const sections: RefundSection[] = [
  {
    title: "Introduction",
    description:
      "Eduflick AI is dedicated to delivering a high-quality learning experience through our mobile app and website. We understand that circumstances may change, and you may request to modify or cancel your subscription. This document outlines our cancellation and refund policy.",
  },
  {
    title: "Subscription Cancellations",
    subsections: [
      {
        heading: "2.1 Cancellation Process",
        items: [
          "You may cancel your subscription from the Account Settings page in the Eduflick AI app or dashboard.",
          "Alternatively, contact our customer support team to assist with the cancellation process.",
        ],
      },
      {
        heading: "2.2 Notice Period",
        items: [
          "You may cancel your subscription at any time, but to avoid being charged for the next billing cycle, cancellation must be completed before the start of the new cycle.",
        ],
      },
      {
        heading: "2.3 Confirmation",
        items: [
          "Once your cancellation request has been processed, you will receive email confirmation that the cancellation has been acknowledged by Eduflick AI.",
        ],
      },
      {
        heading: "2.4 Impact on Access",
        items: [
          "After cancellation, you will continue to have access to Eduflick AI until the end of your current billing cycle.",
          "For users enrolled in project-based cohorts, access remains available until the end of the scheduled cohort period.",
        ],
      },
    ],
  },
  {
    title: "Non-Refundable Subscriptions",
    items: [
      "Subscription fees paid for the current billing period are non-refundable unless otherwise required by law.",
      "Once a billing cycle has started, refunds are not issued for partial months or unused services.",
      "Exceptions may apply in cases of documented service outages lasting longer than 72 consecutive hours.",
    ],
  },
  {
    title: "One-Time Purchases (Digital Content)",
    items: [
      "All digital purchases (courses, bundles, lesson credits, or microlearning modules) are delivered immediately upon successful payment.",
      "Given the digital nature of this content, it is deemed accepted once downloaded or accessed through the Service.",
      "Refunds are generally not provided for digital content unless required by applicable law.",
    ],
  },
  {
    title: "Special Considerations",
    items: [
      "In exceptional cases involving documented downtime, bundles, or special pricing packages, any offer-specific terms will be clearly stated at the time of purchase.",
      "Where applicable, partial refunds may be offered if Eduflick AI is unable to deliver the purchased service and you have complied with all stated terms.",
      "Refunds granted under special cases will be issued via the original payment method and may take between 5-10 business days to appear in your account.",
    ],
  },
]

export default function CancellationRefundsPage() {
  return (
    <article className="rounded-3xl border border-white/10 bg-[#0b102c]/80 p-8 shadow-[0_45px_140px_-90px_rgba(56,189,248,0.55)] sm:p-12">
      <header className="space-y-4 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">Billing</p>
        <h1 className="text-3xl font-semibold text-white sm:text-4xl">Refund Policy</h1>
        <p className="text-sm text-white/70">Effective date: January 6, 2025</p>
        <p className="text-base text-white/80">
          Review how cancellations, refunds, and digital purchase exceptions work for Eduflick AI subscriptions and add-on
          content.
        </p>
      </header>
      <div className="mt-10 space-y-8 text-left text-white/80">
        {sections.map((section, index) => (
          <section key={section.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-xl font-semibold text-white">
              {index + 1}. {section.title}
            </h2>
            {section.description && <p className="mt-4 text-sm">{section.description}</p>}
            {section.items && (
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
            {section.subsections && (
              <div className="mt-6 space-y-5 text-sm">
                {section.subsections.map((subsection) => (
                  <div key={subsection.heading} className="space-y-2 rounded-xl border border-white/10 bg-[#10163a]/70 p-4">
                    <p className="font-medium text-white/90">{subsection.heading}</p>
                    <ul className="list-disc space-y-1 pl-5 text-white/80">
                      {subsection.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
      <footer className="mt-12 rounded-2xl border border-white/10 bg-[#0d1330]/80 p-6 text-sm text-white/80">
        <p className="text-base font-medium text-white">Contact Us</p>
        <p className="mt-2 text-white/80">
          If you have questions or concerns about this policy, reach out to us at
        </p>
        <address className="mt-3 space-y-1 not-italic text-white/80">
          <a href={`mailto:${legalContact.email}`} className="block font-semibold text-cyan-200">
            {legalContact.email}
          </a>
          <p>{legalContact.company}</p>
          {legalContact.addressLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </address>
      </footer>
    </article>
  )
}
