import { useSelector } from "react-redux";
import { motion } from "framer-motion";

function formatSessionExpiry(timestamp) {
  if (!timestamp) {
    return "JWT managed";
  }

  try {
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    }).format(timestamp);
  } catch {
    return "JWT managed";
  }
}

export function AdminProfileCard() {
  const auth = useSelector((state) => state.auth);
  const roles = Array.isArray(auth.user?.roles) ? auth.user.roles : ["ADMIN"];
  const initials = auth.user?.fullName
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "AD";

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-[2rem] border border-white/50 bg-white/78 p-6 shadow-[0_25px_70px_rgba(11,22,56,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.05]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-[linear-gradient(135deg,#4f46ff,#7c3aed)] font-display text-xl font-bold text-white shadow-[0_18px_40px_rgba(98,63,176,0.28)]">
            {initials}
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-coral">Admin profile</p>
            <h2 className="mt-2 font-display text-3xl font-bold">{auth.user?.fullName ?? "Scinexa Admin"}</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{auth.user?.email ?? "admin@scinexa.local"}</p>
          </div>
        </div>

        <div className="rounded-full border border-[#dfe8ff] bg-[#eef4ff] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#3356aa] dark:border-white/10 dark:bg-white/[0.06] dark:text-[#aac4ff]">
          Live
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <article className="rounded-[1.4rem] border border-black/5 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/[0.03]">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Role</p>
          <p className="mt-3 text-lg font-semibold">{roles.join(", ")}</p>
        </article>
        <article className="rounded-[1.4rem] border border-black/5 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/[0.03]">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Session</p>
          <p className="mt-3 text-lg font-semibold">Protected</p>
        </article>
        <article className="rounded-[1.4rem] border border-black/5 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/[0.03]">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Expires</p>
          <p className="mt-3 text-lg font-semibold">{formatSessionExpiry(auth.sessionExpiresAt)}</p>
        </article>
      </div>
    </motion.article>
  );
}
