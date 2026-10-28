import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

export default function MatchResult({ missingSkills }) {
  if (!missingSkills || missingSkills.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 size={16} className="text-volt-400" />
          <h3 className="font-display font-semibold text-white text-sm">
            Missing Skills
          </h3>
        </div>
        <p className="text-ink-400 text-sm">
          No missing skills detected. Great coverage!
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass rounded-2xl p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle size={16} className="text-coral-400" />
        <h3 className="font-display font-semibold text-white text-sm">
          Missing Skills
        </h3>
        <span className="ml-auto text-xs text-ink-500">
          {missingSkills.length} detected
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {missingSkills.map((skill, i) => (
          <motion.span
            key={skill}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35 + i * 0.04 }}
            className="tag"
          >
            {skill}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}
