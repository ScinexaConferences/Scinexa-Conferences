import { AnimatePresence, motion } from "framer-motion";

export function ConfirmLogoutModal({ isOpen, isSubmitting, onCancel, onConfirm }) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-[#070b16]/60 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.98 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="w-full max-w-md rounded-[2rem] border border-white/50 bg-white/92 p-6 shadow-[0_35px_90px_rgba(7,11,22,0.2)] dark:border-white/10 dark:bg-[#0d1528]/95"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-coral">Logout</p>
            <h3 className="mt-3 font-display text-3xl font-bold">Sign out of the admin workspace?</h3>
            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
              This clears the JWT session from the browser and redirects you back to the login page.
            </p>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex items-center justify-center rounded-full border border-black/10 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-black/[0.03] dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/[0.05]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-full bg-[#8f102d] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(143,16,45,0.28)] transition hover:bg-[#7a0c24] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Signing out..." : "Confirm logout"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
