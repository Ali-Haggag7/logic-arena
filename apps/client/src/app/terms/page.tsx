import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — Logic Arena",
  description: "Read the Logic Arena Terms of Service that govern your use of the platform.",
};

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    content:
      "By accessing or using Logic Arena (the 'Service'), you agree to be bound by these Terms of Service. If you do not agree to these terms you may not use the Service. Logic Arena reserves the right to update these terms at any time; continued use constitutes acceptance of the revised terms.",
  },
  {
    title: "2. Account Eligibility",
    content:
      "You must be at least 13 years of age to create an account. By registering you represent that all information you provide is accurate. You are responsible for maintaining the security of your credentials and for all activity that occurs under your account.",
  },
  {
    title: "3. Permitted Use",
    content:
      "Logic Arena is a competitive programming and robot combat simulation platform. You may use the Service to write AliScript programs, deploy virtual robots, and compete in matches. You may not use the Service for any unlawful purpose or in a way that could damage, disable, or impair the platform.",
  },
  {
    title: "4. User-Generated Content",
    content:
      "All scripts, programs, and content you create and submit to Logic Arena remain your intellectual property. By submitting content you grant Logic Arena a non-exclusive, worldwide, royalty-free license to host, store, display, and use that content for the purposes of operating the Service.",
  },
  {
    title: "5. Prohibited Conduct",
    content:
      "You agree not to: (a) attempt to circumvent the AliScript sandbox or execution environment; (b) submit code designed to harm the platform or other users; (c) exploit bugs or vulnerabilities without reporting them; (d) engage in harassment, hate speech, or abusive behaviour toward other operators; (e) create multiple accounts to gain an unfair competitive advantage.",
  },
  {
    title: "6. Competitive Integrity",
    content:
      "Match results are final once recorded by the combat engine. Any attempt to manipulate match outcomes through external means, collusion, or platform exploits will result in immediate account suspension and removal from leaderboards.",
  },
  {
    title: "7. Service Availability",
    content:
      "Logic Arena strives for 99.9% uptime but does not guarantee uninterrupted access to the Service. Scheduled maintenance windows will be announced 24 hours in advance wherever possible. We are not liable for losses arising from service interruptions.",
  },
  {
    title: "8. Intellectual Property",
    content:
      "All platform code, designs, graphics, the AliScript language specification, and the Logic Arena brand are the intellectual property of Logic Arena and its licensors. You are granted a limited, non-transferable licence to use the platform for personal and competitive purposes only.",
  },
  {
    title: "9. Termination",
    content:
      "Logic Arena may suspend or terminate your account at any time for violations of these terms, without prior notice. Upon termination you lose access to your account, scripts, and match history. Sections 4, 8, and 10 survive termination.",
  },
  {
    title: "10. Limitation of Liability",
    content:
      'To the maximum extent permitted by law, Logic Arena shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service. The Service is provided "as is" without warranty of any kind.',
  },
  {
    title: "11. Governing Law",
    content:
      "These Terms are governed by and construed in accordance with applicable law. Any disputes shall be resolved through binding arbitration in accordance with the rules of the relevant arbitration authority in your jurisdiction.",
  },
];

export default function TermsPage() {
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
        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] text-accent hover:text-accent/70 uppercase mb-10 transition-colors duration-150"
        >
          ← BACK
        </Link>

        {/* Hero */}
        <div className="mb-12 relative">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-accent/50 rounded-tl" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-accent/50 rounded-br" />
          <div className="px-6 py-8">
            <p className="text-[10px] font-black tracking-[0.45em] text-accent/60 uppercase mb-3">
              ⌐ LEGAL_DOCUMENT ¬
            </p>
            <h1 className="text-4xl font-black tracking-[0.15em] text-accent drop-shadow-[0_0_20px_rgba(var(--accent-rgb),0.5)] mb-4 uppercase">
              Terms of Service
            </h1>
            <p className="text-[11px] text-text-secondary tracking-[0.15em]">
              Last updated: <span className="text-accent/70">January 2026</span>
            </p>
          </div>
        </div>

        {/* Content */}
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
            Questions? <Link href="/contact" className="text-accent hover:text-accent/70 transition-colors">Contact us →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
