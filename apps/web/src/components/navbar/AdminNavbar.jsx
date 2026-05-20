import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../store";

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function SidebarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 5h5v14H5zM14 5h5v14h-5z" />
    </svg>
  );
}

function SunMoonIcon({ dark }) {
  return dark ? (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2.5M12 19.5V22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M2 12h2.5M19.5 12H22M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
    </svg>
  );
}

export function AdminNavbar({ onMenuToggle, onCollapseToggle, isSidebarCollapsed }) {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.ui.theme);

  return (
    <motion.header
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 border-b border-black/5 bg-white/72 backdrop-blur-2xl dark:border-white/10 dark:bg-[#0b1122]/72"
    >
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuToggle}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-black/10 bg-white/70 text-slate-700 shadow-[0_12px_24px_rgba(11,22,56,0.08)] transition hover:-translate-y-0.5 lg:hidden dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
            aria-label="Open sidebar"
          >
            <MenuIcon />
          </button>

          <button
            type="button"
            onClick={onCollapseToggle}
            className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-black/10 bg-white/70 text-slate-700 shadow-[0_12px_24px_rgba(11,22,56,0.08)] transition hover:-translate-y-0.5 lg:inline-flex dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <SidebarIcon />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => dispatch(toggleTheme())}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-black/10 bg-white/70 text-slate-700 shadow-[0_12px_24px_rgba(11,22,56,0.08)] transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
            aria-label="Toggle theme"
          >
            <SunMoonIcon dark={theme === "dark"} />
          </button>
        </div>
      </div>
    </motion.header>
  );
}
