import { Cpu } from "lucide-react";
import { motion } from "framer-motion";

export default function Header() {
  return (
    <header className="border-b border-ink-700/50 bg-ink-900/80 backdrop-blur-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-5xl h-14 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2.5"
        >
          <div className="w-7 h-7 rounded-lg bg-volt-400 flex items-center justify-center">
            <Cpu size={14} className="text-ink-900" strokeWidth={2.5} />
          </div>
          <span className="font-display font-700 text-white text-lg tracking-tight">
            Resume<span className="text-volt-400">IQ</span>
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xs text-ink-500 font-mono hidden sm:block"
        >
          v1.0.0 · Free · Open Source
        </motion.div>
      </div>
    </header>
  );
}
