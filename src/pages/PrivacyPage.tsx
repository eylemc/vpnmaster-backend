import PublicLayout from '../components/PublicLayout';

export default function PrivacyPage() {
  return (
    <PublicLayout>
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
        <LegalBadge />
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">Privacy Policy</h1>
        <p className="text-slate-500 text-sm mb-10">
          VPNMASTER, INC. &mdash; Last updated: preliminary draft. This document is not yet finalized and does not constitute legal advice.
        </p>

        <Section title="Overview">
          <p>
            VPNMaster AI VPN is operated by VPNMASTER, INC., a Delaware corporation. This policy describes how we collect, use, and protect information when you use our VPN service.
          </p>
        </Section>

        <Section title="Information We Collect">
          <p>We collect the minimum information necessary to provide the service:</p>
          <ul className="list-disc list-inside mt-3 space-y-1.5 text-slate-400">
            <li>Account information: email address and hashed password.</li>
            <li>Billing information: processed by our payment processor (Stripe). We do not store full card numbers.</li>
            <li>Connection-quality metadata: aggregate signals such as latency, packet loss, and connection stability, used to generate AI health insights.</li>
          </ul>
        </Section>

        <Section title="What We Do Not Collect">
          <p>
            We do not inspect, store, or analyze the content of your internet traffic, DNS queries, browsing history, application data, or any private communications passing through the VPN tunnel.
          </p>
          <p className="mt-3">
            Our AI features operate exclusively on connection-quality metadata. They are designed to surface health insights without knowledge of what sites you visit or what data you transmit.
          </p>
        </Section>

        <Section title="How We Use Information">
          <ul className="list-disc list-inside space-y-1.5 text-slate-400">
            <li>To operate and maintain your account and subscription.</li>
            <li>To generate AI-assisted connection health insights visible in your dashboard.</li>
            <li>To process billing and send transactional communications.</li>
            <li>To improve service reliability and diagnose technical issues using aggregate, anonymized signals.</li>
          </ul>
        </Section>

        <Section title="Data Retention">
          <p>
            Account data is retained for as long as your account is active, or as required by law. Connection-quality metadata used for health insights is retained for a limited period to provide historical trend information. Billing records are retained as required by applicable law and our payment processor.
          </p>
        </Section>

        <Section title="Third-Party Services">
          <p>
            We use Stripe for payment processing. Stripe's privacy policy governs data shared with them. We do not sell or share your personal data with third parties for advertising purposes.
          </p>
        </Section>

        <Section title="Your Rights">
          <p>
            Depending on your jurisdiction, you may have the right to access, correct, or delete your personal data. To make a request, contact us at the address listed on our main website at{' '}
            <a href="https://vpnmaster.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors">
              vpnmaster.com
            </a>
            .
          </p>
        </Section>

        <Section title="Changes to This Policy">
          <p>
            We may update this policy as the service evolves. Material changes will be communicated via email or a notice on this page.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about this policy? Contact VPNMASTER, INC. through{' '}
            <a href="https://vpnmaster.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors">
              vpnmaster.com
            </a>
            .
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
