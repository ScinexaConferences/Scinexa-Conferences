import { motion } from "framer-motion";
import { AgendaSettingsForm } from "../../components/forms/AgendaSettingsForm";

export function AgendaSectionEdit() {
  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-6">
      <AgendaSettingsForm />
    </motion.section>
  );
}
