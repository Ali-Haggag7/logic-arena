import Link from "next/link";
import { Scale, Gavel } from "lucide-react";
import { PublicBody, PublicDefinition, PublicSectionCard, PublicFooterCTA } from "@/components/PublicPageLayout";

export function LegalFooter() {
  return (
    <>
      <PublicSectionCard id="limitation-of-liability" index={10} title="Limitation of Liability" icon={<Scale size={16} />}>
        <div className="flex flex-col gap-4">
          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(var(--accent-rgb), 0.12)" }}>
            <PublicDefinition term="As-Is Service">The Logic Arena platform is provided &quot;as is&quot; and &quot;as available&quot; without any warranty of any kind, express or implied, including warranties of merchantability, fitness for a particular purpose, or non-infringement.</PublicDefinition>
            <PublicDefinition term="Liability Cap">To the maximum extent permitted by applicable law, Logic Arena&apos;s total cumulative liability to you for any claims arising from or relating to these Terms or the Service shall not exceed the greater of: (a) the amount you paid to Logic Arena in the 12 months preceding the claim, or (b) USD $100.</PublicDefinition>
            <PublicDefinition term="Exclusions">Logic Arena shall not be liable for any indirect, incidental, special, consequential, or punitive damages — including loss of profits, loss of data, loss of ELO rating, or loss of goodwill — even if we have been advised of the possibility of such damages.</PublicDefinition>
          </div>
          <PublicBody>Some jurisdictions do not allow the exclusion or limitation of incidental or consequential damages. In such jurisdictions, our liability is limited to the fullest extent permitted by applicable law.</PublicBody>
        </div>
      </PublicSectionCard>

      <PublicSectionCard id="governing-law" index={11} title="Governing Law" icon={<Gavel size={16} />}>
        <div className="flex flex-col gap-4">
          <PublicBody>These Terms of Service are governed by and construed in accordance with applicable law. In the event of a dispute arising out of or relating to these Terms or the Service, both parties agree to first attempt resolution through good-faith negotiation.</PublicBody>
          <PublicBody>If informal resolution is not achieved within 30 days, the dispute shall be resolved through binding arbitration in accordance with the rules of a recognised arbitration body in your jurisdiction. Class action lawsuits and class-wide arbitration are expressly waived to the fullest extent permitted by law.</PublicBody>
          <PublicBody>If any provision of these Terms is found to be unenforceable or invalid by a court of competent jurisdiction, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.</PublicBody>
        </div>
      </PublicSectionCard>

      <PublicFooterCTA>
        Questions about these terms?{" "}
        <Link href="/contact" className="inline-block border-b transition-all duration-200 ml-1 hover:-translate-y-[1px] hover:border-accent hover:text-accent/90" style={{ color: "var(--accent)", borderColor: "rgba(var(--accent-rgb), 0.35)" }}>Contact our team</Link>
        {" "}·{" "}
        <Link href="/privacy" className="inline-block border-b transition-all duration-200 ml-1 hover:-translate-y-[1px] hover:border-accent hover:text-accent/90" style={{ color: "var(--accent)", borderColor: "rgba(var(--accent-rgb), 0.35)" }}>Read our Privacy Policy</Link>
      </PublicFooterCTA>
    </>
  );
}
