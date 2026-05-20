import { motion } from "framer-motion";
import { UpdatePassword } from "./UpdatePassword";

export function Settings() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid gap-6"
    >
      <UpdatePassword />
    </motion.section>
  );
}
