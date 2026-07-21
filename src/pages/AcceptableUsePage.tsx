import PublicLayout from '../components/PublicLayout';

export default function AcceptableUsePage() {
  return (
    <PublicLayout>
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
        <LegalBadge />
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">Acceptable Use Policy</h1>
        <p className="text-slate-500 text-sm mb-10">
          VPNMASTER, INC. &mdash; Last updated: preliminary draft. This document is not yet finalized and does not constitute legal advice.
        </p>

        <Section title="Purpose">
          <p>
            This Acceptable Use Policy ("AUP") governs how you may use VPNMaster AI VPN. By using the service, you agree to comply with this policy.
          </p>
        </Section>

        <Section title="Prohibited Uses">
          <p>You may not use VPNMaster AI VPN to:</p>
          <ul className="list-disc list-inside mt-3 space-y-1.5 text-slate-400">
            <li>Engage in illegal activity under any applicable law.</li>
            <li>Distribute malware, spyware, or other malicious software.</li>
            <li>Conduct unauthorized access to computer systems or networks.</li>
            <li>Send unsolicited bulk email (spam) or conduct phishing campaigns.</li>
            <li>Harass, threaten, or harm others.</li>
            <li>Infringe intellectual property rights.</li>
            <li>Circumvent geographic restrictions for unauthorized content access.</li>
            <li>Operate large-scale automated traffic, botnets, or scraping operations that abuse service resources.</li>
            <li>Resell or redistribute the service to third parties without authorization.</li>
          </ul>
        </Section>

        <Section title="Bandwidth and Fair Use">
          <p>
            VPNMaster AI VPN is intended for personal use. Excessive bandwidth consumption that disrupts service for other users may result in account review or suspension.
          </p>
        </Section>

        <Section title="Reporting Abuse">
          <p>
            If you become aware of activity violating this policy, please report it through{' '}
            <a href="https://vpnmaster.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors">
              vpnmaster.com
            </a>
            .
          </p>
        </Section>

        <Section title="Enforcement">
          <p>
            Violations of this policy may result in suspension or termination of your account without refund, and may be reported to relevant authorities.
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
