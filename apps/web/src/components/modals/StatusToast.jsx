import { AnimatePresence, motion } from "framer-motion";

export function StatusToast({ message, tone = "success" }) {
  return (
    <AnimatePresence>
      {message ? (
        <motion.div
          initial={{ opacity: 0, y: -18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.98 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className={`fixed right-4 top-4 z-[80] w-[min(92vw,22rem)] rounded-[1.4rem] border px-4 py-3 shadow-[0_20px_50px_rgba(10,22,56,0.18)] backdrop-blur-xl ${
            tone === "error"
              ? "border-[#f3c0c9] bg-[#fff2f4] text-[#972a40]"
              : "border-[#cceada] bg-white/90 text-[#195c3f]"
          }`}
        >
          <p className="text-sm font-semibold">{message}</p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
