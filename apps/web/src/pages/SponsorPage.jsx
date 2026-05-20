export function SponsorPage() {
  return (
    <section className="section-gap">
      <div className="page-shell grid gap-8 lg:grid-cols-2">
        <div className="glass-panel rounded-[2rem] p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-coral">Sponsorships</p>
          <h1 className="mt-4 font-display text-4xl font-bold">Premium sponsor visibility, not banner clutter</h1>
          <p className="mt-5 text-base leading-7 text-slate-600 dark:text-slate-300">
            Sponsor pages can support prospectus downloads, package comparisons, exhibitor management, lead capture, and post-event reporting.
          </p>
        </div>
        <div className="glass-panel rounded-[2rem] p-8">
          <h2 className="font-display text-2xl font-bold">Sample sponsor tiers</h2>
          <div className="mt-6 space-y-4">
            <div className="rounded-[1.25rem] border border-black/5 p-4 dark:border-white/10">Platinum: keynote presence, exhibition booth, VIP networking</div>
            <div className="rounded-[1.25rem] border border-black/5 p-4 dark:border-white/10">Gold: session branding, booth, digital lead capture</div>
            <div className="rounded-[1.25rem] border border-black/5 p-4 dark:border-white/10">Innovation Partner: startup visibility and demo spotlights</div>
          </div>
        </div>
      </div>
    </section>
  );
}

