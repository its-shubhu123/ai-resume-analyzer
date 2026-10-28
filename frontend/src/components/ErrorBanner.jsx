import { motion } from "framer-motion";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function ErrorBanner({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-6">
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="w-16 h-16 rounded-2xl bg-coral-500/15 border border-coral-500/25 flex items-center justify-center"
      >
        <AlertCircle size={28} className="text-coral-400" />
      </motion.div>
      <div className="text-center">
        <h3 className="font-display font-semibold text-white text-xl mb-2">
          Analysis Failed
        </h3>
        <p className="text-ink-400 text-sm max-w-sm">{message}</p>
      </div>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-ink-700 hover:bg-ink-600 text-ink-200 text-sm font-medium transition-colors"
      >
        <RotateCcw size={14} /> Try Again
      </button>
    </div>
  );
}
