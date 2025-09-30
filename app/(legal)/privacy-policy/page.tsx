import type { Metadata } from "next"

import { legalContact } from "@/lib/legal"

export const metadata: Metadata = {
  title: "Privacy Policy | Eduflick AI",
  description: "Learn how Eduflick AI collects, uses, and protects your personal information.",
}

type StructuredContent = {
  heading: string
  description?: string
  items?: string[]
}

type PrivacySection = {
  title: string
  content: string | (string | StructuredContent)[]
}

const sections: PrivacySection[] = [
  {
    title: "Introduction",
    content: `Eduflick AI ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and related services (collectively, the "Service"). By using the Service, you agree to the collection and use of information in accordance with this Privacy Policy. If you do not agree with the practices described here, please do not use the Service.`,
  },
  {
    title: "Information We Collect",
    content: [
      {
        heading: "Personal Information",
        items: [
          "Name",
          "Email address",
          "Phone number",
          "Payment details (such as billing name, billing address, and the last four digits of your payment method)",
        ],
        description: `When you register for the Service, we may collect personally identifiable information, including:`,
      },
      {
        heading: "Usage Data",
        items: [
          "Device information (hardware model, operating system version, unique device identifiers)",
          "Access times and dates",
          "Pages viewed and interactions, including session durations, feature usage, and progress metrics",
        ],
        description: `We may collect information about your interactions with the Service, such as:`,
      },
      {
        heading: "Communications Data",
        description:
          "We may collect messages or other communications you send us through chat, email, or social platforms to provide support and improve the Service.",
      },
      {
        heading: "User Generated Content",
        description:
          "Content you upload (including assignments, project files, audio submissions, or prompt transcripts) and other content you choose to provide.",
      },
      {
        heading: "Integrated Service Provider Data",
        description:
          "If you connect third-party integrations (Supabase, Cloudinary, Twilio, Razorpay, or other services), we may collect information necessary to enable and support those integrations.",
      },
    ],
  },
  {
    title: "How We Use Your Information",
    content: [
      "Provide, operate, and maintain our Service.",
      "Process payments, manage subscriptions, and maintain learning progress tracking.",
      "Personalize your experience, including recommendations and course notifications.",
      "Communicate with you, including sending updates, marketing messages (where permitted), and customer support.",
      "Monitor and analyze usage and trends to improve the Service.",
      "Ensure security by detecting, preventing, and responding to fraud or unauthorized activities.",
      "Comply with legal obligations and enforce our Terms of Service.",
    ],
  },
  {
    title: "Disclosure of Your Information",
    content: [
      "Third-Party Service Providers: Supabase, Cloudinary, OpenAI, Twilio, and Razorpay to operate and support our Service.",
      "Legal Requirements: We may disclose information if required by law or in response to valid requests by public authorities.",
      "Business Transfers: We may share or transfer information as part of a merger, sale, financing, or acquisition of all or a portion of our business.",
    ],
  },
  {
    title: "Data Security",
    content:
      "We use administrative, technical, and physical safeguards to protect your data against unauthorized access, disclosure, alteration, or destruction. However, no security system is impenetrable, and we cannot guarantee the absolute security of your information.",
  },
  {
    title: "Data Retention",
    content:
      "We retain your personal data only for as long as is reasonably necessary for the purposes for which it was collected, including for satisfying legal, tax, accounting, or reporting requirements.",
  },
  {
    title: "Your Rights and Choices",
    content: [
      "Access: Request access to the information we hold about you.",
      "Correction: Request updates or corrections to inaccurate information.",
      "Deletion: Request that we delete your personal information, subject to legal requirements.",
      "Opt-out: Unsubscribe from marketing communications by following the instructions in those messages or contacting us at support@eduflick.ai.",
      "Data Portability: Request a copy of your data in a portable format, where applicable.",
      `To exercise these rights, contact us at ${legalContact.email}.`,
    ],
  },
  {
    title: "Third-Party Links and Services",
    content:
      "The Service may contain links to websites or services that are not operated by Eduflick AI. This Privacy Policy does not apply to third-party sites, and we encourage you to review their policies before providing any personal information.",
  },
  {
    title: "Changes to This Privacy Policy",
    content:
      "We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated \"Effective Date\". Your continued use of the Service after any changes indicates acceptance of the revised policy.",
  },
]

export default function PrivacyPolicyPage() {
  return (
    <article className="rounded-3xl border border-white/10 bg-[#0b102c]/80 p-8 shadow-[0_45px_140px_-90px_rgba(147,51,234,0.65)] sm:p-12">
      <header className="space-y-4 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-purple-200/70">Privacy</p>
        <h1 className="text-3xl font-semibold text-white sm:text-4xl">Privacy Policy</h1>
        <p className="text-sm text-white/70">Effective date: January 6, 2025</p>
        <p className="text-base text-white/80">
          Your trust matters. This policy details what we collect, how we use it, and the choices available to you when you use
          Eduflick AI.
        </p>
      </header>
      <div className="mt-10 space-y-8 text-left text-white/80">
        {sections.map((section) => (
          <section key={section.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-xl font-semibold text-white">{section.title}</h2>
            {Array.isArray(section.content) ? (
              <div className="mt-4 space-y-4 text-sm">
                {section.content.map((entry) => {
                  if (typeof entry === "string") {
                    return <p key={entry}>{entry}</p>
                  }

                  const structured = entry as StructuredContent

                  return (
                    <div key={structured.heading} className="space-y-2">
                      <p className="font-medium text-white/80">{structured.heading}</p>
                      {structured.description && <p>{structured.description}</p>}
                      {structured.items && (
                        <ul className="list-disc space-y-1 pl-5">
                          {structured.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="mt-4 text-sm">{section.content}</p>
            )}
          </section>
        ))}
      </div>
      <footer className="mt-12 rounded-2xl border border-white/10 bg-[#0d1330]/80 p-6 text-sm text-white/80">
        <p className="text-base font-medium text-white">Contact Us</p>
        <address className="mt-3 space-y-1 not-italic text-white/80">
          <a href={`mailto:${legalContact.email}`} className="block font-semibold text-purple-200">
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
