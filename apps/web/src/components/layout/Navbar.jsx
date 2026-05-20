import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import scinexaLogo from "../../assets/scinexa-logo.svg";
import { moreMenuItems, primaryNavItems } from "../../data/siteMap";
import { logout, toggleTheme } from "../../store";

export function Navbar() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.ui.theme);
  const auth = useSelector((state) => state.auth);
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
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/85 backdrop-blur-2xl dark:border-white/10 dark:bg-ink/85">
      <div className="page-shell py-4">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="shrink-0">
            <img src={scinexaLogo} alt="Scinexa Conferences" className="h-12 w-auto sm:h-14" />
          </Link>

          <nav className="hidden items-center gap-2 rounded-full border border-[#ece4ff] bg-white/90 px-3 py-2 shadow-[0_14px_36px_rgba(96,63,163,0.08)] lg:flex dark:border-white/10 dark:bg-white/5">
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

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => dispatch(toggleTheme())}
              aria-label={theme === "light" ? "Enable dark mode" : "Enable light mode"}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#eadfff] bg-white text-[#3c237e] shadow-[0_10px_26px_rgba(96,63,163,0.12)] transition hover:-translate-y-0.5 dark:border-white/15 dark:bg-white/5 dark:text-white"
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
            {auth.isAuthenticated ? (
              <>
                <Link
                  to={auth.user?.roles?.includes("ADMIN") ? "/admin" : "/dashboard"}
                  className="hidden rounded-full border border-[#eadfff] bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#31186d] shadow-[0_10px_26px_rgba(96,63,163,0.08)] transition hover:-translate-y-0.5 sm:inline-flex dark:border-white/15 dark:bg-white dark:text-[#31186d]"
                >
                  {auth.user?.roles?.includes("ADMIN") ? "Admin" : "Dashboard"}
                </Link>
                <button
                  type="button"
                  onClick={() => dispatch(logout())}
                  className="hidden rounded-full bg-gradient-to-r from-[#5828ff] to-[#6f45ff] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-[0_18px_34px_rgba(98,63,176,0.28)] transition hover:-translate-y-0.5 sm:inline-flex"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden rounded-full border border-[#eadfff] bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#31186d] shadow-[0_10px_26px_rgba(96,63,163,0.08)] transition hover:-translate-y-0.5 sm:inline-flex dark:border-white/15 dark:bg-white dark:text-[#31186d]"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="hidden rounded-full bg-gradient-to-r from-[#5828ff] to-[#6f45ff] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-[0_18px_34px_rgba(98,63,176,0.28)] transition hover:-translate-y-0.5 sm:inline-flex"
                >
                  Sign up
                </Link>
              </>
            )}
            <button
              type="button"
              onClick={() => setMobileOpen((value) => !value)}
              aria-label="Toggle navigation menu"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#eadfff] bg-white text-[#3c237e] lg:hidden dark:border-white/15 dark:bg-white/5 dark:text-white"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2" aria-hidden="true">
                <path d={mobileOpen ? "M6 6l12 12M18 6 6 18" : "M4 7h16M4 12h16M4 17h16"} strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {mobileOpen ? (
          <div className="mt-4 rounded-[2rem] border border-[#ece4ff] bg-white p-4 shadow-[0_18px_44px_rgba(96,63,163,0.16)] lg:hidden dark:border-white/10 dark:bg-white">
            <nav className="grid gap-2">
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
              {auth.isAuthenticated ? (
                <>
                  <Link
                    to={auth.user?.roles?.includes("ADMIN") ? "/admin" : "/dashboard"}
                    className="mt-2 inline-flex justify-center rounded-full border border-[#eadfff] bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#31186d]"
                  >
                    {auth.user?.roles?.includes("ADMIN") ? "Admin" : "Dashboard"}
                  </Link>
                  <button
                    type="button"
                    onClick={() => dispatch(logout())}
                    className="mt-2 inline-flex justify-center rounded-full bg-gradient-to-r from-[#5828ff] to-[#6f45ff] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="mt-2 inline-flex justify-center rounded-full border border-[#eadfff] bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#31186d]"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="mt-2 inline-flex justify-center rounded-full bg-gradient-to-r from-[#5828ff] to-[#6f45ff] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
}
