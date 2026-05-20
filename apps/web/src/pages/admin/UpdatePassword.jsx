import { motion } from "framer-motion";
import { UpdatePasswordForm } from "../../components/forms/UpdatePasswordForm";

export function UpdatePassword() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: 0.06 }}
      className="rounded-[2rem] border border-white/50 bg-white/78 p-6 shadow-[0_25px_70px_rgba(11,22,56,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.05] sm:p-7"
    >
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-coral">Security</p>
      <h3 className="mt-3 font-display text-3xl font-bold">Update password</h3>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
        Secure the admin workspace with a stronger credential. The form validates password quality before submitting.
      </p>

      <div className="mt-8">
        <UpdatePasswordForm />
      </div>
    </motion.section>
  );
}
