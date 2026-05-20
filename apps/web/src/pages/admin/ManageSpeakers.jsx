import { motion } from "framer-motion";
import { SpeakersSettingsForm } from "../../components/forms/SpeakersSettingsForm";

export function ManageSpeakers() {
  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-6">
      <SpeakersSettingsForm />
    </motion.section>
  );
}
