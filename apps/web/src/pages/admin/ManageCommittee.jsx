import { motion } from "framer-motion";
import { CommitteeSettingsForm } from "../../components/forms/CommitteeSettingsForm";

export function ManageCommittee() {
  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-6">
      <CommitteeSettingsForm />
    </motion.section>
  );
}
