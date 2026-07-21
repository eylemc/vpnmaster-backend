import PublicLayout from '../components/PublicLayout';

export default function TermsPage() {
  return (
    <PublicLayout>
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
        <LegalBadge />
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">Terms of Service</h1>
        <p className="text-slate-500 text-sm mb-10">
          VPNMASTER, INC. &mdash; Last updated: preliminary draft. This document is not yet finalized and does not constitute legal advice.
        </p>

        <Section title="Agreement">
          <p>
            By creating an account or using VPNMaster AI VPN, you agree to these Terms of Service and our Privacy Policy. If you do not agree, do not use the service.
          </p>
        </Section>

        <Section title="Service Description">
          <p>
            VPNMaster AI VPN provides a WireGuard-based VPN service with AI-assisted connection health monitoring. The service is offered on a subscription basis. Feature availability may change over time.
          </p>
        </Section>

        <Section title="Eligibility">
          <p>
            You must be at least 18 years old and capable of entering into a binding agreement to use this service. The service is offered to individuals and is not intended for resale.
          </p>
        </Section>

        <Section title="Acceptable Use">
          <p>
            Your use of the service is subject to our{' '}
            <a href="/acceptable-use" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors">
              Acceptable Use Policy
            </a>
            . You may not use the service for illegal activity, to harm others, or to circumvent security controls.
          </p>
        </Section>

        <Section title="Subscriptions and Billing">
          <p>
            Subscriptions are billed monthly. Your subscription renews automatically unless you cancel before the renewal date. All billing is processed by Stripe. By subscribing, you authorize us to charge your payment method on a recurring basis.
          </p>
          <p className="mt-3">
            Refunds are governed by our{' '}
            <a href="/refund-policy" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors">
              Refund Policy
            </a>
            .
          </p>
        </Section>

        <Section title="Cancellation">
          <p>
            You may cancel your subscription at any time through the customer billing portal in your dashboard. Cancellation takes effect at the end of the current billing period.
          </p>
        </Section>

        <Section title="Termination">
          <p>
            We may suspend or terminate your account for violation of these terms or our Acceptable Use Policy. We reserve the right to refuse service at our discretion.
          </p>
        </Section>

        <Section title="Limitation of Liability">
          <p>
            The service is provided "as is" without warranties of any kind. To the extent permitted by law, VPNMASTER, INC. is not liable for indirect, incidental, or consequential damages arising from your use of the service.
          </p>
        </Section>

        <Section title="Governing Law">
          <p>
            These terms are governed by the laws of the State of Delaware, United States, without regard to conflict of law provisions.
          </p>
        </Section>

        <Section title="Changes">
          <p>
            We may revise these terms. Continued use of the service after changes become effective constitutes acceptance of the revised terms.
          </p>
        </Section>
      </article>
    </PublicLayout>
  );
}

function LegalBadge() {
  return (
    <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1 mb-6">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
      <span className="text-xs text-amber-300 font-medium">Preliminary draft — not yet finalized</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-semibold text-white mb-3">{title}</h2>
      <div className="text-slate-400 leading-relaxed space-y-2">{children}</div>
    </section>
  );
}
