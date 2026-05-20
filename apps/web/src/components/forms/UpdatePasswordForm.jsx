import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { updateAdminPassword } from "../../services/adminService";
import { getAuthErrorMessage } from "../../utils/auth";
import { getPasswordStrength } from "../../utils/passwords";
import { PasswordField } from "./PasswordField";
import { PasswordStrengthIndicator } from "./PasswordStrengthIndicator";
import { StatusToast } from "../modals/StatusToast";

const initialForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: ""
};

export function UpdatePasswordForm() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setToast(""), 3200);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (form.newPassword !== form.confirmPassword) {
      setError("New password and confirm password must match.");
      return;
    }

    const strength = getPasswordStrength(form.newPassword);

    if (strength.score < 3) {
      setError("Use a stronger password with upper/lowercase letters, a number, and a symbol.");
      return;
    }

    setIsSubmitting(true);

    try {
      await updateAdminPassword(form);
      setForm(initialForm);
      setToast("Password updated successfully.");
    } catch (requestError) {
      setError(getAuthErrorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <StatusToast message={toast} />

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <PasswordField
            label="Current Password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            placeholder="Enter current password"
            autoComplete="current-password"
          />

          <div className="space-y-5">
            <PasswordField
              label="New Password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              placeholder="Set a new secure password"
              autoComplete="new-password"
            />
            <PasswordStrengthIndicator password={form.newPassword} />
          </div>
        </div>

        <PasswordField
          label="Confirm New Password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Re-enter new password"
          autoComplete="new-password"
        />

        {error ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[1.25rem] border border-[#f0c4cb] bg-[#fff2f4] px-4 py-3 text-sm font-medium text-[#99283f]"
          >
            {error}
          </motion.div>
        ) : null}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
            Changes take effect immediately for the current admin account and future sign-ins.
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-w-[11rem] items-center justify-center rounded-full bg-gradient-to-r from-[#4f46ff] via-[#663dff] to-[#2fb6ff] px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-[0_20px_40px_rgba(79,70,255,0.28)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </>
  );
}
