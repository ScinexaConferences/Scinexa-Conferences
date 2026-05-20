import { motion } from "framer-motion";
import { HomeHeroSettingsForm } from "../../components/forms/HomeHeroSettingsForm";

export function HeroSectionEdit() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid gap-6"
    >
      <HomeHeroSettingsForm />
    </motion.section>
  );
}
