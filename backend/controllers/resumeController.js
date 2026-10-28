import fs from "fs";
import { parseResume } from "../services/parserService.js";
import { calculateAtsScore } from "../services/atsService.js";
import { matchJobDescription } from "../services/matchService.js";
import { generateSuggestions } from "../services/aiService.js";

export const analyzeResume = async (req, res) => {
  // Check file presence
  if (!req.file) {
    return res.status(400).json({
      error: "No file uploaded",
      message: "Please upload a PDF resume.",
    });
  }

  const filePath = req.file.path;
  const jobDescription = req.body.jobDescription || "";

  try {
    // 1. Parse resume text from PDF
    const resumeText = await parseResume(filePath);

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(422).json({
        error: "Parsing failed",
        message:
          "Could not extract meaningful text from the PDF. Please ensure it is not a scanned image.",
      });
    }

    // 2. ATS score
    const atsScore = calculateAtsScore(resumeText);

    // 3. Job description matching
    const { matchScore, missingSkills } = matchJobDescription(
      resumeText,
      jobDescription,
    );

    // 4. Hybrid suggestions — rule-based + Gemini AI (run in parallel with step 3)
    const { ruleBased: suggestions, ai: aiSuggestions } =
      await generateSuggestions(resumeText, jobDescription);

    // Cleanup uploaded file
    fs.unlink(filePath, (err) => {
      if (err) console.warn("Could not delete temp file:", filePath);
    });

    return res.status(200).json({
      atsScore,
      matchScore,
      missingSkills,
      suggestions, // Array<{ category, message, priority }> — rule-based
      aiSuggestions, // string[] — Gemini AI (empty array if key not set)
      resumeText: resumeText.substring(0, 1500),
    });
  } catch (error) {
    // Cleanup on error
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    console.error("Analysis error:", error);
    return res.status(500).json({
      error: "Analysis failed",
      message: error.message || "An unexpected error occurred during analysis.",
    });
  }
};
