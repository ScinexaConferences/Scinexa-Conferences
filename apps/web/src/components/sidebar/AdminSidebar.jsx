import { AnimatePresence, motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import scinexaLogo from "../../assets/scinexa-logo.svg";

function PanelIcon({ children }) {
  return <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl">{children}</span>;
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3v3M12 18v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M3 12h3M18 12h3M4.9 19.1 7 17M17 7l2.1-2.1" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

function HeroIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path d="M8 9h8M8 13h5M15.5 15.5 17 17l2.5-3" />
    </svg>
  );
}

function AgendaIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M7 10h10M8 14h4M8 17h7" />
    </svg>
  );
}

function SpeakersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
      <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
      <circle cx="9.5" cy="7" r="3.5" />
      <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M14 4.13a4 4 0 0 1 0 5.74" />
    </svg>
  );
}

function CommitteeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
      <path d="M7 21v-2a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v2" />
      <circle cx="12" cy="7" r="4" />
      <path d="M4 10c0-1.9 1.1-3.4 2.7-4.2M20 10c0-1.9-1.1-3.4-2.7-4.2" />
    </svg>
  );
}

function DownloadsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3v11" />
      <path d="m8 10 4 4 4-4" />
      <path d="M5 19h14" />
    </svg>
  );
}

function RegistrationIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
      <path d="M8 7h8M8 12h8M8 17h5" />
      <rect x="4" y="4" width="16" height="16" rx="2" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
      <path d="M14 8l4 4-4 4" />
      <path d="M8 12h10" />
      <path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4" />
    </svg>
  );
}

function CollapseIcon({ isCollapsed }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8">
      <path d={isCollapsed ? "m10 7 5 5-5 5" : "m14 7-5 5 5 5"} />
    </svg>
  );
}

function SidebarLink({ isCollapsed, to, label, icon, end = false, onClick }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `group flex items-center gap-3 rounded-[1.4rem] border px-3 py-3 text-sm font-semibold transition ${
          isActive
            ? "border-white/20 bg-white/16 text-white shadow-[0_18px_30px_rgba(10,14,34,0.2)]"
            : "border-white/10 bg-white/[0.03] text-[#d7def7] hover:bg-white/[0.08]"
        } ${isCollapsed ? "justify-center" : ""}`
      }
    >
      <PanelIcon>{icon}</PanelIcon>
      {!isCollapsed ? <span className="uppercase tracking-[0.18em]">{label}</span> : null}
    </NavLink>
  );
}

function SidebarButton({ isCollapsed, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex items-center gap-3 rounded-[1.4rem] border border-[#6e0f27] bg-[#5a0d21] px-3 py-3 text-sm font-semibold text-[#ffe5ea] transition hover:bg-[#720f29] ${
        isCollapsed ? "justify-center" : ""
      }`}
    >
      <PanelIcon>
        <LogoutIcon />
      </PanelIcon>
      {!isCollapsed ? <span className="uppercase tracking-[0.18em]">Logout</span> : null}
    </button>
  );
}

function SidebarContent({ isCollapsed, onCollapseToggle, onLogoutClick, onNavigate }) {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"} gap-3`}>
        <div className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}>
          <img src={scinexaLogo} alt="Scinexa Conferences" className="h-11 w-auto rounded-2xl bg-white px-3 py-2" />
          {!isCollapsed ? (
            <div>
              <p className="font-display text-lg font-bold text-white">Admin Console</p>
              <p className="text-xs uppercase tracking-[0.24em] text-[#9fdfff]">Scinexa</p>
            </div>
          ) : null}
        </div>

        {!isCollapsed ? (
          <button
            type="button"
            onClick={onCollapseToggle}
            className="hidden h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white transition hover:bg-white/[0.1] lg:inline-flex"
            aria-label="Collapse sidebar"
          >
            <CollapseIcon isCollapsed={false} />
          </button>
        ) : null}
      </div>

      <div className={`mt-8 rounded-[1.8rem] border border-white/10 bg-white/[0.06] p-4 backdrop-blur ${isCollapsed ? "hidden" : ""}`}>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9fdfff]">Signed in</p>
        <p className="mt-3 text-lg font-bold text-white">{user?.fullName ?? "Admin User"}</p>
        <p className="mt-1 text-sm text-[#d4ddff]">{user?.email ?? "admin@scinexa.local"}</p>
      </div>

      <nav className="mt-8 flex-1 space-y-3">
        <SidebarLink
          isCollapsed={isCollapsed}
          to="/admin/settings"
          end
          label="Admin Settings"
          icon={<SettingsIcon />}
          onClick={onNavigate}
        />
        <SidebarLink
          isCollapsed={isCollapsed}
          to="/admin/hero-section"
          end
          label="Hero Section Edit"
          icon={<HeroIcon />}
          onClick={onNavigate}
        />
        <SidebarLink
          isCollapsed={isCollapsed}
          to="/admin/agenda-edit"
          end
          label="Edit Agenda"
          icon={<AgendaIcon />}
          onClick={onNavigate}
        />
        <SidebarLink
          isCollapsed={isCollapsed}
          to="/admin/manage-speakers"
          end
          label="Manage Speakers"
          icon={<SpeakersIcon />}
          onClick={onNavigate}
        />
        <SidebarLink
          isCollapsed={isCollapsed}
          to="/admin/manage-committee"
          end
          label="Manage Committee"
          icon={<CommitteeIcon />}
          onClick={onNavigate}
        />
        <SidebarLink
          isCollapsed={isCollapsed}
          to="/admin/manage-downloads"
          end
          label="Manage Downloads"
          icon={<DownloadsIcon />}
          onClick={onNavigate}
        />
        <SidebarLink
          isCollapsed={isCollapsed}
          to="/admin/manage-registrations"
          end
          label="Manage Registrations"
          icon={<RegistrationIcon />}
          onClick={onNavigate}
        />
      </nav>

      <div className="space-y-3 pt-6">
        <SidebarButton isCollapsed={isCollapsed} onClick={onLogoutClick} />
        {isCollapsed ? (
          <button
            type="button"
            onClick={onCollapseToggle}
            className="hidden w-full items-center justify-center rounded-[1.4rem] border border-white/10 bg-white/[0.05] px-3 py-3 text-white transition hover:bg-white/[0.1] lg:inline-flex"
            aria-label="Expand sidebar"
          >
            <CollapseIcon isCollapsed />
          </button>
        ) : null}
      </div>
    </div>
  );
}

export function AdminSidebar({
  isCollapsed,
  isMobileOpen,
  onCollapseToggle,
  onMobileClose,
  onLogoutClick
}) {
  return (
    <>
      <motion.aside
        animate={{ width: isCollapsed ? 104 : 304 }}
        transition={{ duration: 0.24, ease: "easeOut" }}
        className="sticky top-0 hidden h-screen shrink-0 self-start overflow-hidden border-r border-white/10 bg-[linear-gradient(180deg,#09111f,#111b34_46%,#1f1547)] p-5 shadow-[0_28px_80px_rgba(5,8,18,0.3)] lg:block"
      >
        <SidebarContent
          isCollapsed={isCollapsed}
          onCollapseToggle={onCollapseToggle}
          onLogoutClick={onLogoutClick}
        />
      </motion.aside>

      <AnimatePresence>
        {isMobileOpen ? (
          <motion.div
            className="fixed inset-0 z-[60] bg-[#060914]/60 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onMobileClose}
          >
            <motion.aside
              initial={{ x: -36, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -24, opacity: 0 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              className="h-full w-[86vw] max-w-[320px] border-r border-white/10 bg-[linear-gradient(180deg,#09111f,#111b34_46%,#1f1547)] p-5 shadow-[0_28px_80px_rgba(5,8,18,0.4)]"
              onClick={(event) => event.stopPropagation()}
            >
              <SidebarContent
                isCollapsed={false}
                onCollapseToggle={onMobileClose}
                onLogoutClick={onLogoutClick}
                onNavigate={onMobileClose}
              />
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
