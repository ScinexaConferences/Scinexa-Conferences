export function NewsletterCard() {
  return (
    <section className="section-gap">
      <div className="page-shell">
        <div className="overflow-hidden rounded-[2rem] bg-ink px-8 py-10 text-white shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-tide">Newsletter</p>
          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl font-bold">Get new conferences, speaker calls, and sponsor openings first.</h2>
              <p className="mt-4 text-white/75">
                Designed for researchers, delegates, and organizing teams who need a reliable global event pipeline.
              </p>
            </div>
            <form className="flex w-full max-w-xl flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="min-h-12 flex-1 rounded-full border border-white/15 bg-white/10 px-5 text-white placeholder:text-white/45"
              />
              <button type="submit" className="rounded-full bg-solar px-5 py-3 font-semibold text-ink">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

