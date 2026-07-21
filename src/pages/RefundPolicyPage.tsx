import PublicLayout from '../components/PublicLayout';

export default function RefundPolicyPage() {
  return (
    <PublicLayout>
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
        <LegalBadge />
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">Refund Policy</h1>
        <p className="text-slate-500 text-sm mb-10">
          VPNMASTER, INC. &mdash; Last updated: preliminary draft. This document is not yet finalized and does not constitute legal advice.
        </p>

        <Section title="Overview">
          <p>
            VPNMaster AI VPN is a monthly subscription service. This policy describes the circumstances under which refunds may be issued.
          </p>
        </Section>

        <Section title="Cancellation">
          <p>
            You may cancel your subscription at any time through the customer billing portal. Cancellation stops future charges. Your service remains active until the end of the current billing period.
          </p>
          <p className="mt-3">
            Cancellation does not automatically trigger a refund for the current billing period.
          </p>
        </Section>

        <Section title="Refund Eligibility">
          <p>
            Refund requests are evaluated case by case. We will generally consider a refund if:
          </p>
          <ul className="list-disc list-inside mt-3 space-y-1.5 text-slate-400">
            <li>You were charged due to a billing error.</li>
            <li>The service was substantially unavailable during a paid period due to a failure on our end.</li>
            <li>Your request is made within 7 days of the charge and you have not made significant use of the service during that period.</li>
          </ul>
        </Section>

        <Section title="Non-Refundable Situations">
          <p>The following are generally not eligible for refunds:</p>
          <ul className="list-disc list-inside mt-3 space-y-1.5 text-slate-400">
            <li>Forgetting to cancel before a renewal date.</li>
            <li>Dissatisfaction with a feature that was accurately described.</li>
            <li>Accounts suspended for violation of our Acceptable Use Policy.</li>
          </ul>
        </Section>

        <Section title="How to Request a Refund">
          <p>
            To request a refund, contact us through{' '}
            <a href="https://vpnmaster.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors">
              vpnmaster.com
            </a>{' '}
            with your account email address and a brief description of the issue. We aim to respond within 3 business days.
          </p>
        </Section>

        <Section title="Processing">
          <p>
            Approved refunds are processed to the original payment method via Stripe and typically appear within 5–10 business days depending on your card issuer.
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
