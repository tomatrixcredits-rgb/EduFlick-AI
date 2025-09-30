import type { Metadata } from "next"

import { legalContact } from "@/lib/legal"

export const metadata: Metadata = {
  title: "Terms & Conditions | Eduflick AI",
  description: "The terms and conditions that govern use of the Eduflick AI platform and services.",
}

type TermsSection = {
  title: string
  body: string | string[]
}

const sections: TermsSection[] = [
  {
    title: "Acceptance of Terms",
    body: `By accessing or using Eduflick AI's platform and related services (the "Service"), you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree to these Terms, please do not use the Service.`,
  },
  {
    title: "Description of Service",
    body: `Eduflick AI provides a subscription-based online learning platform where users can access microlearning modules, full-length course videos, AI instructor support, and progress tracking features. The Service is provided on an "as is" and "as available" basis.`,
  },
  {
    title: "User Accounts and Authentication",
    body: [
      "Account holders must register using their email address and complete OTP verification.",
      "Accounts are strictly personal. You may not share or transfer your login credentials to any other person.",
      "You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.",
    ],
  },
  {
    title: "Intellectual Property Rights",
    body: [
      "All content, including course materials, videos, templates, and software available through the Service, remains the property of Eduflick AI or its licensors and is protected by intellectual property laws.",
      "Your subscription grants a limited, non-transferable license to access and use the content for personal, non-commercial purposes only.",
      "You may not copy, distribute, publish, or create derivative works from the content without prior written consent.",
    ],
  },
  {
    title: "User-Generated Content",
    body: [
      "If you submit or post any content, including comments, ideas, assignments, or other materials made available through the Service, you grant Eduflick AI a worldwide, royalty-free, non-exclusive license to use, reproduce, modify, publish, adapt, and display such content in connection with the Service.",
      "You are solely responsible for the accuracy, legality, and appropriateness of the content you submit.",
      "We reserve the right to remove any content that violates these Terms or poses a risk to other users.",
    ],
  },
  {
    title: "Third-Party Services",
    body: `The Service may integrate with third-party services, including Supabase, Cloudinary, OpenAI, Twilio, and Razorpay. Your use of these third-party services is governed by their respective terms and policies. Eduflick AI is not responsible for the actions or omissions of third-party providers.`,
  },
  {
    title: "Disclaimers and Limitation of Liability",
    body: [
      'The Service is provided "as is" without warranties of any kind, either express or implied. We do not warrant that the Service will be uninterrupted, secure, or error-free.',
      "To the fullest extent permitted by law, Eduflick AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of or inability to use the Service.",
    ],
  },
  {
    title: "Indemnification",
    body: `You agree to indemnify and hold Eduflick AI and its officers, directors, employees, and agents harmless from any claims, damages, obligations, losses, liabilities, costs, or debt arising from your use of the Service or violation of these Terms.`,
  },
  {
    title: "Modifications to the Service and Terms",
    body: `We may update the Service or these Terms at any time. If material changes are made, we will notify you through the Service or by other reasonable means. Your continued use of the Service after updates take effect constitutes acceptance of the modified Terms.`,
  },
  {
    title: "Governing Law and Dispute Resolution",
    body: `These Terms are governed by and construed in accordance with the laws of Kerala, India. Any disputes arising out of or in connection with these Terms will be resolved through binding arbitration in Thiruvananthapuram, Kerala, unless prohibited by applicable law.`,
  },
  {
    title: "Termination",
    body: `We reserve the right to suspend or cancel your access to the Service, without prior notice, if we believe you have violated these Terms or pose a risk to the Service or our business.`,
  },
]

export default function TermsPage() {
  return (
    <article className="rounded-3xl border border-white/10 bg-[#0b102c]/80 p-8 shadow-[0_45px_140px_-90px_rgba(56,189,248,0.65)] sm:p-12">
      <header className="space-y-4 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-blue-200/70">Policies</p>
        <h1 className="text-3xl font-semibold text-white sm:text-4xl">Terms &amp; Conditions</h1>
        <p className="text-sm text-white/70">Effective date: January 6, 2025</p>
        <p className="text-base text-white/80">
          These Terms govern your use of Eduflick AI&apos;s products and services. Please read them carefully before accessing or
          using the platform.
        </p>
      </header>
      <ol className="mt-10 space-y-8 text-left text-white/80">
        {sections.map((section, index) => (
          <li key={section.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-xl font-semibold text-white">
              {index + 1}. {section.title}
            </h2>
            {Array.isArray(section.body) ? (
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-white/80">
                {section.body.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-white/80">{section.body}</p>
            )}
          </li>
        ))}
      </ol>
      <footer className="mt-12 rounded-2xl border border-white/10 bg-[#0d1330]/80 p-6 text-sm text-white/80">
        <p className="text-base font-medium text-white">Questions?</p>
        <p className="mt-2">
          Contact us at <a href={`mailto:${legalContact.email}`} className="font-semibold text-blue-200">{legalContact.email}</a>.
        </p>
      </footer>
    </article>
  )
}
