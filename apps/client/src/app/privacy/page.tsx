import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Logic Arena",
  description: "Learn how Logic Arena collects, uses, and protects your personal data.",
};

const SECTIONS = [
  {
    title: "1. Information We Collect",
    content:
      "When you register an account, we collect: your username, email address, and (if applicable) your public Google or GitHub profile information obtained via OAuth 2.0 authentication flows. We also collect usage data such as match results, script versions, ELO history, and session metadata. We do not collect payment information.",
  },
  {
    title: "2. How We Use Your Information",
    content:
      "We use your information to: operate and improve the Logic Arena platform; match you with opponents of similar skill; send important service notifications (e.g., email verification, security alerts); analyse platform-wide usage trends in aggregate, anonymised form; and fulfil any legal obligations.",
  },
  {
    title: "3. OAuth Authentication",
    content:
      "We support sign-in via Google and GitHub OAuth 2.0. When you authenticate through these providers, we receive only the data you have authorised: typically your public profile name, email address, and avatar. We do not receive or store your Google or GitHub passwords. Your OAuth tokens are stored securely and used solely for authentication purposes.",
  },
  {
    title: "4. Data Sharing & Third Parties",
    content:
      "We do not sell your personal data. We may share data with trusted third-party service providers who assist in operating our infrastructure (e.g., cloud hosting providers), subject to strict confidentiality agreements. We may disclose data when required by law or to protect the rights and safety of our users and platform.",
  },
  {
    title: "5. Data Retention",
    content:
      "We retain your account data for as long as your account is active. If you delete your account, we will remove your personally identifiable information within 30 days, except where retention is required by law. Match records and aggregate statistics may be retained in anonymised form indefinitely for platform integrity purposes.",
  },
  {
    title: "6. Cookies & Tracking",
    content:
      "We use essential session cookies to keep you authenticated. We may use analytics cookies with your consent to understand how operators use the platform. You can manage cookie preferences at any time via our Cookie Policy page.",
  },
  {
    title: "7. Security",
    content:
      "We use industry-standard measures to protect your data, including TLS encryption in transit, hashed passwords at rest, and access controls on our infrastructure. No method of transmission over the internet is 100% secure; we encourage you to use strong, unique passwords and enable any available security features.",
  },
  {
    title: "8. Children's Privacy",
    content:
      "Logic Arena is not directed at children under 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us immediately so we can remove it.",
  },
  {
    title: "9. Your Rights",
    content:
      "Depending on your jurisdiction, you may have the right to access, correct, or delete your personal data; restrict or object to processing; and data portability. To exercise these rights, contact us at the address on our Contact page.",
  },
  {
    title: "10. Changes to This Policy",
    content:
      "We may update this Privacy Policy from time to time. We will notify you of material changes by posting the new policy on this page and updating the 'Last updated' date. Continued use of the Service after changes are posted constitutes your acceptance of the updated policy.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-bg-primary font-mono relative overflow-hidden">
      {/* Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(var(--accent-rgb),0.012) 3px, rgba(var(--accent-rgb),0.012) 4px)",
        }}
      />
      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(var(--accent-rgb),0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--accent-rgb),0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] text-accent hover:text-accent/70 uppercase mb-10 transition-colors duration-150"
        >
          ← BACK
        </Link>

        <div className="mb-12 relative">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-accent/50 rounded-tl" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-accent/50 rounded-br" />
          <div className="px-6 py-8">
            <p className="text-[10px] font-black tracking-[0.45em] text-accent/60 uppercase mb-3">
              ⌐ LEGAL_DOCUMENT ¬
            </p>
            <h1 className="text-4xl font-black tracking-[0.15em] text-accent drop-shadow-[0_0_20px_rgba(var(--accent-rgb),0.5)] mb-4 uppercase">
              Privacy Policy
            </h1>
            <p className="text-[11px] text-text-secondary tracking-[0.15em]">
              Last updated: <span className="text-accent/70">January 2026</span>
            </p>
          </div>
        </div>

        <div className="bg-card border border-accent/50 rounded-xl p-6 flex flex-col gap-6" style={{ boxShadow: "var(--card-shadow)" }}>
          {SECTIONS.map((section) => (
            <div key={section.title} className="border-b border-accent/50/50 last:border-0 pb-5 last:pb-0">
              <h2 className="text-[11px] font-black tracking-[0.2em] text-accent uppercase mb-2">
                {section.title}
              </h2>
              <p className="text-[12px] text-text-secondary leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-[10px] text-text-secondary/50 tracking-[0.2em]">
            Cookie questions? <Link href="/cookies" className="text-accent hover:text-accent/70 transition-colors">Cookie Policy →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
