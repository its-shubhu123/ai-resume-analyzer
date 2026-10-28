import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, X, Briefcase, Zap } from "lucide-react";

export default function UploadForm({ onAnalyze }) {
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (f) => {
    if (f && f.type === "application/pdf") setFile(f);
    else alert("Only PDF files are accepted.");
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  const onDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };
  const onDragLeave = () => setDragging(false);

  const handleSubmit = () => {
    if (!file) return;
    onAnalyze(file, jd);
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Drop Zone */}
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => !file && inputRef.current?.click()}
        className={`glass rounded-2xl p-8 flex flex-col items-center justify-center min-h-[220px] cursor-pointer transition-all duration-300
          ${dragging ? "border-volt-400/60 bg-volt-400/5 shadow-[0_0_40px_rgba(200,255,58,0.1)]" : "hover:border-ink-500/70"}
          ${file ? "cursor-default" : ""}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />

        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div
                className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-colors
                ${dragging ? "bg-volt-400/20" : "bg-ink-700/60"}`}
              >
                <Upload
                  size={24}
                  className={dragging ? "text-volt-400" : "text-ink-300"}
                />
              </div>
              <p className="text-ink-200 font-medium mb-1">
                Drop your resume here
              </p>
              <p className="text-ink-500 text-sm">
                or click to browse · PDF only · max 5MB
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="file"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center w-full"
            >
              <div className="w-14 h-14 rounded-2xl bg-volt-400/15 mx-auto mb-3 flex items-center justify-center">
                <FileText size={24} className="text-volt-400" />
              </div>
              <p className="text-ink-100 font-medium text-sm truncate max-w-[180px] mx-auto">
                {file.name}
              </p>
              <p className="text-ink-500 text-xs mt-1">
                {(file.size / 1024).toFixed(1)} KB
              </p>
              <button
                onClick={() => setFile(null)}
                className="mt-3 inline-flex items-center gap-1 text-xs text-ink-400 hover:text-coral-400 transition-colors"
              >
                <X size={12} /> Remove
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Job Description */}
      <div className="glass rounded-2xl p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <Briefcase size={16} className="text-sky-400" />
          <span className="text-sm font-medium text-ink-200">
            Job Description
          </span>
          <span className="text-xs text-ink-500">(optional)</span>
        </div>
        <textarea
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          placeholder="Paste the job description here to get a match score and identify missing skills..."
          className="flex-1 bg-ink-900/50 rounded-xl p-4 text-sm text-ink-200 placeholder-ink-600 border border-ink-700/40
                     focus:outline-none focus:border-sky-500/50 resize-none min-h-[140px] transition-colors"
        />
        <p className="text-xs text-ink-600 mt-2">{jd.length} characters</p>
      </div>

      {/* Submit */}
      <div className="md:col-span-2 flex justify-center mt-2">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          disabled={!file}
          className={`flex items-center gap-3 px-8 py-3.5 rounded-xl font-display font-semibold text-base transition-all duration-200
            ${
              file
                ? "bg-volt-400 text-ink-900 shadow-[0_0_32px_rgba(200,255,58,0.3)] hover:shadow-[0_0_48px_rgba(200,255,58,0.45)]"
                : "bg-ink-700/50 text-ink-500 cursor-not-allowed"
            }`}
        >
          <Zap size={18} strokeWidth={2.5} />
          Analyze Resume
        </motion.button>
      </div>
    </div>
  );
}
