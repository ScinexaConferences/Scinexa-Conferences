import { motion } from "framer-motion";
import { DownloadsSettingsForm } from "../../components/forms/DownloadsSettingsForm";

export function ManageDownloads() {
  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-6">
      <DownloadsSettingsForm />
    </motion.section>
  );
}
