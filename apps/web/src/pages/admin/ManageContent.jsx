import { motion } from "framer-motion";
import { ContentSettingsForm } from "../../components/forms/ContentSettingsForm";

export function ManageContent() {
  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-6">
      <ContentSettingsForm />
    </motion.section>
  );
}
