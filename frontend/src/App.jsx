import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Header from "./components/Header.jsx";
import UploadForm from "./components/UploadForm.jsx";
import ResultsPanel from "./components/ResultsPanel.jsx";
import Loader from "./components/Loader.jsx";
import ErrorBanner from "./components/ErrorBanner.jsx";
import { analyzeResume } from "./utils/api.js";

export default function App() {
  const [phase, setPhase] = useState("idle"); // idle | loading | results | error
  const [results, setResults] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleAnalyze = async (file, jobDescription) => {
    setPhase("loading");
    setErrorMsg("");
    try {
      const data = await analyzeResume(file, jobDescription);
      setResults(data);
      setPhase("results");
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
      setPhase("error");
    }
  };

  const handleReset = () => {
    setPhase("idle");
    setResults(null);
    setErrorMsg("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <AnimatePresence mode="wait">
          {phase === "idle" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <Hero />
              <UploadForm onAnalyze={handleAnalyze} />
            </motion.div>
          )}

          {phase === "loading" && (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Loader />
            </motion.div>
          )}

          {phase === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ErrorBanner message={errorMsg} onRetry={handleReset} />
            </motion.div>
          )}

          {phase === "results" && results && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <ResultsPanel results={results} onReset={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="text-center py-6 text-ink-500 text-sm font-body">
        ResumeIQ — built for developers, by developers
      </footer>
    </div>
  );
}

function Hero() {
  return (
    <div className="text-center mb-12 mt-4">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-volt-400/10 border border-volt-400/20 text-volt-400 text-xs font-mono mb-6"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-volt-400 animate-pulse" />
        AI-powered analysis · No data stored
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-4xl md:text-6xl font-display font-bold text-white mb-4 leading-tight"
      >
        Decode Your{" "}
        <span className="text-volt-400 relative">
          Resume
          <svg
            className="absolute -bottom-1 left-0 w-full"
            height="6"
            viewBox="0 0 200 6"
            preserveAspectRatio="none"
          >
            <path
              d="M0 5 Q50 0 100 5 Q150 10 200 5"
              stroke="#c8ff3a"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              opacity="0.6"
            />
          </svg>
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        className="text-ink-300 text-lg max-w-xl mx-auto leading-relaxed"
      >
        Get your ATS score, job match percentage, missing skills, and actionable
        suggestions in seconds.
      </motion.p>
    </div>
  );
}
