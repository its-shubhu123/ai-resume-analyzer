import { motion } from "framer-motion";

const steps = [
  "Parsing your resume...",
  "Running ATS analysis...",
  "Matching job description...",
  "Generating suggestions...",
];

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-8">
      {/* Animated rings */}
      <div className="relative w-24 h-24">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border-2 border-volt-400/30"
            animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
            transition={{
              duration: 2,
              delay: i * 0.6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-8 h-8 rounded-full bg-volt-400"
            animate={{ scale: [0.9, 1.1, 0.9] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-2 text-center">
        {steps.map((step, i) => (
          <motion.p
            key={step}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: [0, 1, 1, 0.3], y: 0 }}
            transition={{ delay: i * 0.9, duration: 0.8 }}
            className="text-sm text-ink-400 font-mono"
          >
            {step}
          </motion.p>
        ))}
      </div>
    </div>
  );
}
