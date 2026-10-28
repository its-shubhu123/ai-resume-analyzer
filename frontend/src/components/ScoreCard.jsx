import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function CircleScore({ score, color, size = 120, stroke = 8 }) {
  const [animated, setAnimated] = useState(0);
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (animated / 100) * circ;

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  const colorMap = { volt: "#c8ff3a", sky: "#60d0f0", coral: "#ff7b61" };

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="-rotate-90"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={colorMap[color] || colorMap.volt}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        className="score-ring"
      />
    </svg>
  );
}

export default function ScoreCard({ atsScore, matchScore }) {
  const atsLabel =
    atsScore >= 75
      ? "Excellent"
      : atsScore >= 55
        ? "Good"
        : atsScore >= 35
          ? "Fair"
          : "Needs Work";
  const atsColor =
    atsScore >= 75
      ? "text-volt-400"
      : atsScore >= 55
        ? "text-sky-400"
        : "text-coral-400";

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* ATS Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-6 flex flex-col items-center text-center"
      >
        <p className="text-xs text-ink-500 font-mono uppercase tracking-wider mb-4">
          ATS Score
        </p>
        <div className="relative">
          <CircleScore score={atsScore} color="volt" size={110} stroke={9} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-display font-bold text-white">
              {atsScore}
            </span>
            <span className="text-xs text-ink-400">/100</span>
          </div>
        </div>
        <span className={`mt-3 text-sm font-semibold ${atsColor}`}>
          {atsLabel}
        </span>
      </motion.div>

      {/* Match Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6 flex flex-col items-center text-center"
      >
        <p className="text-xs text-ink-500 font-mono uppercase tracking-wider mb-4">
          Job Match
        </p>
        <div className="relative">
          <CircleScore
            score={matchScore}
            color={matchScore >= 60 ? "sky" : "coral"}
            size={110}
            stroke={9}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-display font-bold text-white">
              {matchScore}%
            </span>
          </div>
        </div>
        <span
          className={`mt-3 text-sm font-semibold ${matchScore >= 60 ? "text-sky-400" : matchScore > 0 ? "text-coral-400" : "text-ink-500"}`}
        >
          {matchScore === 0
            ? "No JD provided"
            : matchScore >= 60
              ? "Strong match"
              : "Partial match"}
        </span>
      </motion.div>
    </div>
  );
}
