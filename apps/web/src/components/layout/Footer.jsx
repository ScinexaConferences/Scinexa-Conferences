import scinexaLogo from "../../assets/scinexa-logo.svg";

export function Footer() {
  return (
    <footer className="border-t border-black/5 py-10 dark:border-white/10">
      <div className="page-shell grid gap-8 md:grid-cols-3">
        <div>
          <img src={scinexaLogo} alt="Scinexa Conferences" className="h-14 w-auto" />
          <p className="mt-3 max-w-sm text-sm text-slate-500 dark:text-slate-300">
            A premium conference experience for scientific, medical, and research-led event brands.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Experience</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-500 dark:text-slate-300">
            <li>Conference discovery and registration</li>
            <li>Speakers, agenda, and committee visibility</li>
            <li>Downloads, sponsorships, and abstract journeys</li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Contact</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-500 dark:text-slate-300">
            <li>hello@scinexa.io</li>
            <li>Global operations across APAC, Europe, and the US</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
