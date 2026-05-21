import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import scinexaLogo from "../../assets/scinexa-logo.svg";
import { moreMenuItems, primaryNavItems } from "../../data/siteMap";
import { toggleTheme } from "../../store";

export function Navbar() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.ui.theme);
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef(null);

  useEffect(() => {
    setMobileOpen(false);
    setMobileMoreOpen(false);
    setMoreMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setMoreMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setMoreMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const isActiveItem = (item) => {
    const matchesRoute = item.routeMatch?.some((route) =>
      route === "/"
        ? location.pathname === "/" && !location.hash
        : location.pathname.startsWith(route)
    );

    const matchesHash = item.hashMatch && location.pathname === "/" && location.hash === item.hashMatch;
    return Boolean(matchesRoute || matchesHash);
  };

  const handleAnchorClick = (event, href) => {
    setMobileOpen(false);
    setMobileMoreOpen(false);
    setMoreMenuOpen(false);

    const [, hash] = href.split("#");
    const targetHash = hash ? `#${hash}` : "";

    if (window.location.pathname === "/" && targetHash) {
      const section = document.querySelector(targetHash);
      if (section) {
        event.preventDefault();
        window.history.pushState({}, "", href);
        window.dispatchEvent(new PopStateEvent("popstate"));
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const pillClassName = (active) =>
    `rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] transition ${
      active
        ? "bg-gradient-to-r from-[#6d34ff] to-[#5a45ff] text-white shadow-[0_14px_34px_rgba(109,52,255,0.35)]"
        : "text-slate-600 hover:bg-[#f3ecff] hover:text-[#25115d] dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white"
    }`;

  const linkClassName = (item) => pillClassName(isActiveItem(item));
  const moreIsActive = moreMenuItems.some((item) => isActiveItem(item));

  return (
    <header className="sticky top-0 z-40 border-b border-[#e9ddff] bg-[linear-gradient(135deg,rgba(247,241,255,0.96),rgba(255,246,239,0.94))] shadow-[0_10px_36px_rgba(52,27,96,0.08)] backdrop-blur-2xl dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(12,20,34,0.95),rgba(19,27,48,0.92))]">
      <div className="page-shell py-3 sm:py-4">
        <div className="flex items-center gap-3 lg:gap-6">
          <Link to="/" className="shrink-0">
            <img src={scinexaLogo} alt="Scinexa Conferences" className="h-11 w-auto sm:h-13 md:h-14" />
          </Link>

          <div className="hidden min-w-0 flex-1 justify-center lg:flex">
            <nav className="flex w-full max-w-[980px] items-center justify-center gap-2 px-1 py-1">
              {primaryNavItems.map((item) => (
                <a key={item.label} href={item.href} onClick={(event) => handleAnchorClick(event, item.href)} className={linkClassName(item)}>
                  {item.label}
                </a>
              ))}
              <div ref={moreMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setMoreMenuOpen((value) => !value)}
                  aria-expanded={moreMenuOpen}
                  className={`${pillClassName(moreIsActive)} inline-flex items-center gap-2`}
                >
                  More
                  <svg
                    viewBox="0 0 20 20"
                    className={`h-4 w-4 fill-none stroke-current stroke-2 transition ${moreMenuOpen ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  >
                    <path d="m5 7.5 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {moreMenuOpen ? (
                  <div className="absolute left-1/2 top-full z-50 mt-2 w-72 -translate-x-1/2 rounded-[1.75rem] border border-[#d9cffd] bg-white p-4 shadow-[0_24px_60px_rgba(63,43,124,0.18)] dark:border-white/10 dark:bg-white">
                    <div className="grid gap-1">
                      {moreMenuItems.map((item) => (
                        <a
                          key={item.label}
                          href={item.href}
                          onClick={(event) => handleAnchorClick(event, item.href)}
                          className="rounded-2xl px-4 py-3 text-left text-sm font-semibold text-[#241457] transition hover:bg-[#f5efff] dark:text-[#241457] dark:hover:bg-[#f5efff]"
                        >
                          {item.label}
                        </a>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </nav>
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <Link
              to="/registration"
              className="hidden items-center justify-center rounded-full bg-gradient-to-r from-[#5a1cff] via-[#7b31ff] to-[#2c9fff] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-[0_18px_40px_rgba(104,41,255,0.32)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_46px_rgba(104,41,255,0.42)] lg:inline-flex"
            >
              Registration
            </Link>
            <button
              type="button"
              onClick={() => dispatch(toggleTheme())}
              aria-label={theme === "light" ? "Enable dark mode" : "Enable light mode"}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#eadfff] bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(247,240,255,0.92))] text-[#3c237e] shadow-[0_10px_26px_rgba(96,63,163,0.12)] transition hover:-translate-y-0.5 dark:border-white/15 dark:bg-white/5 dark:text-white"
            >
              {theme === "light" ? (
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2" aria-hidden="true">
                  <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2" aria-hidden="true">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2.5M12 19.5V22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M2 12h2.5M19.5 12H22M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
                </svg>
              )}
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen((value) => !value)}
              aria-label="Toggle navigation menu"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#eadfff] bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(247,240,255,0.92))] text-[#3c237e] lg:hidden dark:border-white/15 dark:bg-white/5 dark:text-white"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2" aria-hidden="true">
                <path d={mobileOpen ? "M6 6l12 12M18 6 6 18" : "M4 7h16M4 12h16M4 17h16"} strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {mobileOpen ? (
          <div className="mt-4 rounded-[2rem] border border-[#ece4ff] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(247,240,255,0.92))] p-4 shadow-[0_18px_44px_rgba(96,63,163,0.16)] lg:hidden dark:border-white/10 dark:bg-white">
            <nav className="grid gap-2">
              <Link
                to="/registration"
                className="mb-2 inline-flex w-full items-center justify-center rounded-[1.3rem] bg-gradient-to-r from-[#5a1cff] via-[#7b31ff] to-[#2c9fff] px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-[0_18px_40px_rgba(104,41,255,0.32)]"
              >
                Registration
              </Link>
              {primaryNavItems.map((item) => (
                <a key={item.label} href={item.href} onClick={(event) => handleAnchorClick(event, item.href)} className={linkClassName(item)}>
                  {item.label}
                </a>
              ))}
              <div className="rounded-[1.5rem] border border-[#ece4ff] bg-white px-2 py-2 dark:border-[#ece4ff] dark:bg-white">
                <button
                  type="button"
                  onClick={() => setMobileMoreOpen((value) => !value)}
                  className={`${pillClassName(moreIsActive)} flex w-full items-center justify-between`}
                >
                  <span>More</span>
                  <svg
                    viewBox="0 0 20 20"
                    className={`h-4 w-4 fill-none stroke-current stroke-2 transition ${mobileMoreOpen ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  >
                    <path d="m5 7.5 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {mobileMoreOpen ? (
                  <div className="mt-2 grid gap-1 border-t border-[#ece4ff] pt-2 dark:border-[#ece4ff]">
                    {moreMenuItems.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        onClick={(event) => handleAnchorClick(event, item.href)}
                        className="rounded-2xl px-4 py-3 text-sm font-semibold text-[#241457] transition hover:bg-[#f5efff] dark:text-[#241457] dark:hover:bg-[#f5efff]"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
}
