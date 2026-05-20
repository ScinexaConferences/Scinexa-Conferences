export function ContactPage() {
  return (
    <section className="section-gap">
      <div className="page-shell grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-coral">Contact us</p>
          <h1 className="mt-4 font-display text-4xl font-bold">Let's talk about your conference portfolio</h1>
          <p className="mt-5 text-base leading-7 text-slate-600 dark:text-slate-300">
            Use this for organizer inquiries, sponsorship sales, media partnerships, or enterprise platform demos.
          </p>
        </div>
        <form className="glass-panel rounded-[2rem] p-8">
          <div className="grid gap-5 md:grid-cols-2">
            <input type="text" placeholder="Name" className="rounded-2xl border border-black/10 bg-white/60 px-4 py-3 outline-none dark:border-white/10 dark:bg-white/5" />
            <input type="email" placeholder="Email" className="rounded-2xl border border-black/10 bg-white/60 px-4 py-3 outline-none dark:border-white/10 dark:bg-white/5" />
            <input type="text" placeholder="Company" className="rounded-2xl border border-black/10 bg-white/60 px-4 py-3 outline-none dark:border-white/10 dark:bg-white/5 md:col-span-2" />
            <textarea placeholder="Message" rows="6" className="rounded-[1.5rem] border border-black/10 bg-white/60 px-4 py-3 outline-none dark:border-white/10 dark:bg-white/5 md:col-span-2" />
          </div>
          <button type="submit" className="mt-6 rounded-full bg-ink px-6 py-3 font-semibold text-white dark:bg-white dark:text-ink">
            Send inquiry
          </button>
        </form>
      </div>
    </section>
  );
}
