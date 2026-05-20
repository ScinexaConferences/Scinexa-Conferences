import { motion } from "framer-motion";
import { getPasswordStrength } from "../../utils/passwords";

export function PasswordStrengthIndicator({ password }) {
  const strength = getPasswordStrength(password);

  return (
    <div className="rounded-[1.35rem] border border-black/5 bg-black/[0.015] p-4 dark:border-white/10 dark:bg-white/[0.03]">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
          Password strength
        </p>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${strength.tone}`}>{strength.label}</span>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2">
        {[0, 1, 2, 3].map((bar) => (
          <div key={bar} className="h-2 rounded-full bg-black/[0.06] dark:bg-white/[0.08]">
            <motion.div
              className={`h-2 rounded-full ${
                bar < strength.progress
                  ? strength.score >= 3
                    ? "bg-[#3fc98d]"
                    : strength.score >= 2
                      ? "bg-[#f2bc52]"
                      : "bg-[#eb5b71]"
                  : "bg-transparent"
              }`}
              initial={false}
              animate={{ width: bar < strength.progress ? "100%" : "0%" }}
              transition={{ duration: 0.24 }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
