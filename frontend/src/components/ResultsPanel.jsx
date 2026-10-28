import { motion } from "framer-motion";
import { RotateCcw, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import ScoreCard from "./ScoreCard.jsx";
import MatchResult from "./MatchResult.jsx";
import Suggestions from "./Suggestions.jsx";

export default function ResultsPanel({ results, onReset }) {
  const [showPreview, setShowPreview] = useState(false);
  const { atsScore, matchScore, missingSkills, suggestions, resumeText } =
    results;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display font-bold text-2xl text-white">
            Analysis Complete
          </h2>
          <p className="text-ink-400 text-sm mt-1">
            Here's what we found in your resume
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 rounded-xl glass-light text-ink-300 hover:text-white text-sm transition-colors"
        >
          <RotateCcw size={14} /> New Analysis
        </motion.button>
      </div>

      <div className="space-y-5">
        <ScoreCard atsScore={atsScore} matchScore={matchScore} />
        <MatchResult missingSkills={missingSkills} />
        <Suggestions suggestions={suggestions} />

        {/* Resume Preview */}
        {resumeText && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="glass rounded-2xl overflow-hidden"
          >
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="w-full flex items-center gap-2 px-6 py-4 text-left hover:bg-ink-700/20 transition-colors"
            >
              <FileText size={15} className="text-ink-400" />
              <span className="text-sm text-ink-300 font-medium">
                Resume Text Preview
              </span>
              <span className="ml-auto text-ink-500">
                {showPreview ? (
                  <ChevronUp size={15} />
                ) : (
                  <ChevronDown size={15} />
                )}
              </span>
            </button>
            {showPreview && (
              <div className="px-6 pb-6">
                <pre className="text-xs text-ink-400 font-mono leading-relaxed whitespace-pre-wrap bg-ink-900/60 rounded-xl p-4 max-h-64 overflow-y-auto">
                  {resumeText}
                </pre>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
