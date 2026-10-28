import { motion } from "framer-motion";
import { Lightbulb, TrendingUp, Code2, Layers } from "lucide-react";

const categoryIcon = {
  Language: Code2,
  Impact: TrendingUp,
  Structure: Layers,
  Content: Lightbulb,
  Visibility: Lightbulb,
  Tailoring: Layers,
  Depth: TrendingUp,
  Conciseness: Layers,
  "Keyword Match": Code2,
};

const priorityStyle = {
  high: "border-l-coral-400/60 bg-coral-400/5",
  medium: "border-l-sky-400/60 bg-sky-400/5",
  low: "border-l-ink-500/40 bg-ink-700/20",
};

export default function Suggestions({ suggestions }) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass rounded-2xl p-6"
    >
      <div className="flex items-center gap-2 mb-5">
        <Lightbulb size={16} className="text-volt-400" />
        <h3 className="font-display font-semibold text-white text-sm">
          Improvement Suggestions
        </h3>
        <span className="ml-auto text-xs text-ink-500">
          {suggestions.length} found
        </span>
      </div>

      <div className="space-y-3">
        {suggestions.map((s, i) => {
          const Icon = categoryIcon[s.category] || Lightbulb;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 + i * 0.06 }}
              className={`rounded-xl p-4 border-l-2 ${priorityStyle[s.priority] || priorityStyle.low}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 w-6 h-6 rounded-lg bg-ink-700/60 flex items-center justify-center flex-shrink-0">
                  <Icon size={12} className="text-ink-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-ink-500">
                      {s.category}
                    </span>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded font-medium
                      ${
                        s.priority === "high"
                          ? "bg-coral-400/15 text-coral-400"
                          : s.priority === "medium"
                            ? "bg-sky-400/15 text-sky-400"
                            : "bg-ink-600/30 text-ink-400"
                      }`}
                    >
                      {s.priority}
                    </span>
                  </div>
                  <p className="text-sm text-ink-200 leading-relaxed">
                    {s.message}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
