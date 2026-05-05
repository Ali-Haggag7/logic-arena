import type { Metadata } from "next";
import Link from "next/link";
import { Cookie, FlaskConical, Info, Lock, RefreshCw, ShieldCheck, ToggleRight } from "lucide-react";

import PublicPageLayout, {
  PublicBody, PublicDefinition, PublicFooterCTA, PublicSectionCard, type PublicSection,
} from "@/components/PublicPageLayout";

export const metadata: Metadata = {
  title: "Cookie Policy — Logic Arena",
  description: "A precise breakdown of every cookie Logic Arena sets, why it exists, and how long it lives. No surprises.",
};

const SECTIONS: PublicSection[] = [
  { id: "what-are-cookies", title: "What Are Cookies?", label: "What Are Cookies?" },
  { id: "essential-cookies", title: "Essential Cookies", label: "Essential" },
  { id: "analytics-cookies", title: "Analytics Cookies", label: "Analytics" },
  { id: "third-party-cookies", title: "Third-Party Cookies", label: "Third-Party" },
  { id: "managing-preferences", title: "Managing Preferences", label: "Manage Prefs" },
  { id: "cookie-lifespan", title: "Cookie Lifespan", label: "Lifespan" },
  { id: "policy-updates", title: "Policy Updates", label: "Updates" },
];

interface CookieEntry { name: string; purpose: string; lifespan: string; }

const ESSENTIAL: CookieEntry[] = [
  { name: "auth_session", purpose: "Maintains your authenticated session across page loads. Without it, you cannot stay logged in.", lifespan: "7 days (idle) / 30 days (remembered)" },
  { name: "csrf_token", purpose: "Cryptographic token embedded in each form submission to prevent cross-site request forgery attacks.", lifespan: "Session" },
  { name: "theme_prefs", purpose: "Stores your chosen display theme (Cyberpunk, Light, Obsidian Ember) so it persists without an account.", lifespan: "365 days" },
];

const ANALYTICS: CookieEntry[] = [
  { name: "_arena_analytics", purpose: "Tracks aggregate page views and feature engagement. All data is anonymised — no individual profiling.", lifespan: "12 months" },
  { name: "_session_duration", purpose: "Measures session length to help optimise performance and identify drop-off points.", lifespan: "Session" },
  { name: "_feature_flags", purpose: "Used to A/B test new features on a randomised subset of users. No PII attached.", lifespan: "30 days" },
];

function CookieTable({ cookies }: { cookies: CookieEntry[] }) {
  return (
    <div className="flex flex-col rounded-xl overflow-hidden" style={{ border: "1px solid rgba(var(--accent-rgb),0.12)" }}>
      <div className="hidden sm:grid grid-cols-[1fr_2fr_auto] gap-4 px-5 py-3" style={{ background: "rgba(var(--accent-rgb),0.05)", borderBottom: "1px solid rgba(var(--accent-rgb),0.1)" }}>
        {["Cookie Name","Purpose","Lifespan"].map(h => (
          <span key={h} className="text-[9px] font-black tracking-[0.3em] uppercase" style={{ color: "rgba(var(--accent-rgb),0.45)", fontFamily: "var(--font-mono)" }}>{h}</span>
        ))}
      </div>
      {cookies.map((c, i) => (
        <div key={c.name} className="flex flex-col sm:grid sm:grid-cols-[1fr_2fr_auto] gap-2 sm:gap-4 px-5 py-4" style={{ borderBottom: i < cookies.length - 1 ? "1px solid rgba(var(--accent-rgb),0.07)" : "none" }}>
          <code className="text-[11px] font-black tracking-widest self-start" style={{ fontFamily: "var(--font-mono)", color: "var(--accent)", padding: "2px 8px", background: "rgba(var(--accent-rgb),0.08)", border: "1px solid rgba(var(--accent-rgb),0.18)", borderRadius: "6px", display: "inline-block", whiteSpace: "nowrap" }}>{c.name}</code>
          <p className="text-[12px] sm:text-[13px] leading-[1.8]" style={{ color: "rgba(var(--accent-rgb),0.65)", fontFamily: "var(--font-mono)" }}>{c.purpose}</p>
          <span className="text-[10px] font-black tracking-wider self-start whitespace-nowrap" style={{ color: "rgba(var(--accent-rgb),0.5)", fontFamily: "var(--font-mono)", padding: "2px 8px", background: "rgba(var(--accent-rgb),0.04)", border: "1px solid rgba(var(--accent-rgb),0.1)", borderRadius: "6px" }}>{c.lifespan}</span>
        </div>
      ))}
    </div>
  );
}

export default function CookiesPage() {
  return (
    <PublicPageLayout badge="Legal Document" title="Cookie Policy" subtitle="A precise, jargon-free breakdown of every cookie Logic Arena sets — what it does, why it exists, and exactly how long it lives in your browser." lastUpdated="May 2026" sections={SECTIONS}>

      <PublicSectionCard id="what-are-cookies" index={1} title="What Are Cookies?" icon={<Cookie size={16} />}>
        <div className="flex flex-col gap-4">
          <PublicBody>Cookies are small text files a website stores in your browser when you visit. They act as short-term memory — letting a site remember that you are logged in, what theme you prefer, and how you interact with its features.</PublicBody>
          <PublicBody>Not all cookies are equal. Logic Arena draws a strict line between technically necessary cookies and optional ones. We never activate optional cookies without your explicit consent.</PublicBody>
        </div>
      </PublicSectionCard>

      <PublicSectionCard id="essential-cookies" index={2} title="Essential Cookies" icon={<Lock size={16} />}>
        <div className="flex flex-col gap-5">
          <div className="flex gap-3 items-start p-4 rounded-xl" style={{ background: "rgba(var(--sem-success-rgb,34,197,94),0.06)", border: "1px solid rgba(var(--sem-success-rgb,34,197,94),0.18)" }}>
            <ShieldCheck size={14} className="shrink-0 mt-0.5" style={{ color: "var(--sem-success,#22c55e)" }} />
            <p className="text-[12px] leading-[1.8]" style={{ color: "rgba(var(--sem-success-rgb,34,197,94),0.8)", fontFamily: "var(--font-mono)" }}><strong>Always active.</strong> Essential cookies are required for core functionality. They cannot be disabled without breaking authentication, security, or theme persistence. No consent is required — they fall under the strictly necessary exemption.</p>
          </div>
          <CookieTable cookies={ESSENTIAL} />
        </div>
      </PublicSectionCard>

      <PublicSectionCard id="analytics-cookies" index={3} title="Analytics Cookies" icon={<FlaskConical size={16} />}>
        <div className="flex flex-col gap-5">
          <div className="flex gap-3 items-start p-4 rounded-xl" style={{ background: "rgba(var(--accent-rgb),0.05)", border: "1px solid rgba(var(--accent-rgb),0.18)" }}>
            <ToggleRight size={14} className="shrink-0 mt-0.5" style={{ color: "var(--accent)" }} />
            <p className="text-[12px] leading-[1.8]" style={{ color: "rgba(var(--accent-rgb),0.75)", fontFamily: "var(--font-mono)" }}><strong>Opt-in only.</strong> Analytics cookies are inactive by default. They activate only if you grant consent through our cookie banner. Withdrawal of consent takes immediate effect and does not affect platform access.</p>
          </div>
          <PublicBody>All analytics data is aggregated and anonymised before analysis. No individual user profile is built from these cookies — they exist purely to help us prioritise the development roadmap.</PublicBody>
          <CookieTable cookies={ANALYTICS} />
        </div>
      </PublicSectionCard>

      <PublicSectionCard id="third-party-cookies" index={4} title="Third-Party Cookies" icon={<Info size={16} />}>
        <div className="flex flex-col gap-4">
          <PublicBody>Logic Arena does not embed third-party advertising, social widgets, or tracking pixels. We do not use Google Analytics, Facebook Pixel, or any similar external tracking service.</PublicBody>
          <PublicBody>The only third-party context where cookies may be set is during the OAuth 2.0 sign-in flow via Google or GitHub. When you authenticate through those providers, they may set their own cookies according to their own policies — which we do not control.</PublicBody>
          <PublicBody>We recommend reviewing the cookie policies of <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="border-b transition-all" style={{ color: "var(--accent)", borderColor: "rgba(var(--accent-rgb),0.3)" }}>Google</a> and <a href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement" target="_blank" rel="noopener noreferrer" className="border-b transition-all" style={{ color: "var(--accent)", borderColor: "rgba(var(--accent-rgb),0.3)" }}>GitHub</a> if you use OAuth sign-in.</PublicBody>
        </div>
      </PublicSectionCard>

      <PublicSectionCard id="managing-preferences" index={5} title="Managing Preferences" icon={<ToggleRight size={16} />}>
        <div className="flex flex-col gap-4">
          <PublicBody>You have full control over which cookies are active. Manage them at any time through your browser&apos;s native settings — no platform account required.</PublicBody>
          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(var(--accent-rgb),0.12)" }}>
            <PublicDefinition term="Disable all cookies">You may block all cookies via browser settings. This will prevent login and break preference persistence. Essential functionality will be degraded.</PublicDefinition>
            <PublicDefinition term="Delete existing cookies">Clear cookies through your browser&apos;s &quot;Clear browsing data&quot; panel. This logs you out immediately.</PublicDefinition>
            <PublicDefinition term="Withdraw analytics consent">If you previously consented to analytics cookies, you may withdraw consent at any time. The cookies are deactivated immediately, with no effect on platform access.</PublicDefinition>
          </div>
        </div>
      </PublicSectionCard>

      <PublicSectionCard id="cookie-lifespan" index={6} title="Cookie Lifespan" icon={<RefreshCw size={16} />}>
        <div className="flex flex-col gap-4">
          <PublicBody>Cookie lifespans vary by purpose. Here is a precise summary:</PublicBody>
          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(var(--accent-rgb),0.12)" }}>
            <PublicDefinition term="Session Cookies">Deleted automatically when you close your browser or the tab becomes inactive beyond the idle timeout.</PublicDefinition>
            <PublicDefinition term="Auth Cookies">The <code style={{ fontFamily: "var(--font-mono)", color: "var(--accent)", fontSize: "11px" }}>auth_session</code> cookie persists for 7 days (or 30 days with &quot;Remember me&quot;). After expiry, re-authentication is required.</PublicDefinition>
            <PublicDefinition term="Preference Cookies">Theme and UI preference cookies persist for 365 days from the last time you updated your preference.</PublicDefinition>
            <PublicDefinition term="Analytics Cookies">When consented, analytics cookies are retained for a maximum of 12 months before automatic expiry.</PublicDefinition>
          </div>
        </div>
      </PublicSectionCard>

      <PublicSectionCard id="policy-updates" index={7} title="Policy Updates" icon={<RefreshCw size={16} />}>
        <div className="flex flex-col gap-4">
          <PublicBody>We may update this Cookie Policy when we introduce new platform features that require new cookies, or when applicable regulations change. Updates will be reflected on this page with a revised date.</PublicBody>
          <PublicBody>Material changes — such as introducing a new category of non-essential cookie — will trigger a renewed consent prompt on your next visit to the platform.</PublicBody>
        </div>
      </PublicSectionCard>

      <PublicFooterCTA>
        Questions?{" "}
        <Link href="/contact" className="inline-block border-b transition-all duration-200 ml-1 hover:-translate-y-[1px] hover:border-accent hover:text-accent/90" style={{ color: "var(--accent)", borderColor: "rgba(var(--accent-rgb),0.35)" }}>Contact our team</Link>
        {" "}·{" "}
        <Link href="/privacy" className="inline-block border-b transition-all duration-200 ml-1 hover:-translate-y-[1px] hover:border-accent hover:text-accent/90" style={{ color: "var(--accent)", borderColor: "rgba(var(--accent-rgb),0.35)" }}>Privacy Policy</Link>
      </PublicFooterCTA>
    </PublicPageLayout>
  );
}
