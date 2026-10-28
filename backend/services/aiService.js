/**
 * Hybrid suggestion engine for resume improvement.
 *
 * Two layers:
 *  1. Rule-based  — fast, deterministic, always runs.
 *  2. AI-powered  — Google Gemini free-tier, runs when GEMINI_API_KEY is set.
 *
 * Public API:
 *   generateSuggestions(resumeText, jobDescription)
 *   → { ruleBased: SuggestionObject[], ai: string[] }
 */

const ACTION_VERBS = [
  "developed",
  "designed",
  "implemented",
  "led",
  "managed",
  "built",
  "created",
  "optimized",
  "improved",
  "reduced",
  "increased",
  "launched",
  "delivered",
  "collaborated",
  "architected",
  "engineered",
  "deployed",
  "automated",
  "mentored",
  "coordinated",
  "spearheaded",
  "oversaw",
  "streamlined",
];

const WEAK_PHRASES = [
  "responsible for",
  "duties included",
  "worked on",
  "helped with",
  "assisted in",
  "involved in",
  "participated in",
  "was part of",
];

const FILLER_WORDS = [
  "very",
  "really",
  "basically",
  "actually",
  "just",
  "quite",
];

/**
 * Checks if the text contains enough measurable numbers/metrics.
 */
const hasMetrics = (text) => {
  const matches = text.match(/\d+[%$kmb]?|\$[\d,.]+|#\d+/gi) || [];
  return matches.length >= 4;
};

/**
 * Checks for presence of LinkedIn/GitHub/portfolio links.
 */
const hasLinks = (text) => /linkedin|github|portfolio|website/i.test(text);

/**
 * Counts action verbs in text.
 */
const countActionVerbs = (text) => {
  const lower = text.toLowerCase();
  return ACTION_VERBS.filter((v) => lower.includes(v)).length;
};

/**
 * Detects weak/passive phrases.
 */
const detectWeakPhrases = (text) => {
  const lower = text.toLowerCase();
  return WEAK_PHRASES.filter((p) => lower.includes(p));
};

/**
 * Checks for a professional summary section.
 */
const hasSummary = (text) => /summary|objective|profile|about me/i.test(text);

/**
 * Checks for project descriptions.
 */
const hasProjects = (text) => /projects?|portfolio|case study/i.test(text);

/**
 * Checks resume length (word count proxy for depth).
 */
const wordCount = (text) => text.split(/\s+/).filter(Boolean).length;

// ─── Gemini AI Layer ────────────────────────────────────────────────────────

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const GEMINI_PROMPT = (resumeText) =>
  `
Analyze the following resume text and provide exactly 5 concise, actionable suggestions to improve it.
Focus on:
- clarity
- impact (use of metrics)
- use of action verbs
- technical skills
- structure

Return ONLY a plain bullet list using "•" as the bullet character.
No intro sentence, no numbering, no markdown, no extra commentary.

Resume:
"""
${resumeText.slice(0, 3000)}
"""
`.trim();

/**
 * Parses Gemini's bullet-list response into a clean string array.
 * Handles "• text", "- text", and plain numbered lines.
 * @param {string} raw
 * @returns {string[]}
 */
const parseBullets = (raw) =>
  raw
    .split("\n")
    .map((line) => line.replace(/^[\s•\-\*\d.]+/, "").trim())
    .filter((line) => line.length > 10)
    .slice(0, 5);

/**
 * Calls Google Gemini API and returns 5 AI-generated suggestions.
 * Returns an empty array if the key is missing or the call fails.
 * @param {string} resumeText
 * @returns {Promise<string[]>}
 */
export const generateAISuggestions = async (resumeText) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.info(
      "[aiService] GEMINI_API_KEY not set — skipping AI suggestions.",
    );
    return [];
  }

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: GEMINI_PROMPT(resumeText) }] }],
        generationConfig: {
          temperature: 0.4, // focused, not creative
          maxOutputTokens: 512,
          topP: 0.9,
        },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_NONE",
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_NONE",
          },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(
        `Gemini API error ${response.status}: ${err?.error?.message ?? response.statusText}`,
      );
    }

    const data = await response.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    if (!raw) throw new Error("Empty response from Gemini");

    return parseBullets(raw);
  } catch (error) {
    console.error(
      "[aiService] Gemini call failed — falling back to rule-based only.\n",
      error.message,
    );
    return [];
  }
};

// ─── Rule-Based Layer ────────────────────────────────────────────────────────

/**
 * Generates rule-based improvement suggestions.
 * @param {string} resumeText
 * @param {string} jobDescription
 * @returns {Array<{ category: string, message: string, priority: 'high'|'medium'|'low' }>}
 */
const generateRuleBasedSuggestions = (resumeText, jobDescription) => {
  const suggestions = [];
  const lower = resumeText.toLowerCase();

  // --- Action verb check ---
  const verbCount = countActionVerbs(resumeText);
  if (verbCount < 5) {
    suggestions.push({
      category: "Language",
      message: `Use stronger action verbs to start bullet points (e.g., "Engineered", "Spearheaded", "Optimised"). Currently only ${verbCount} detected.`,
      priority: "high",
    });
  }

  // --- Metrics check ---
  if (!hasMetrics(resumeText)) {
    suggestions.push({
      category: "Impact",
      message:
        'Quantify your achievements with numbers, percentages, or dollar values (e.g., "Reduced load time by 40%", "Managed a team of 8 engineers").',
      priority: "high",
    });
  }

  // --- Weak phrases ---
  const weakFound = detectWeakPhrases(resumeText);
  if (weakFound.length > 0) {
    suggestions.push({
      category: "Language",
      message: `Replace passive phrases like "${weakFound.slice(0, 2).join('", "')}" with active, results-oriented language.`,
      priority: "high",
    });
  }

  // --- Professional summary ---
  if (!hasSummary(resumeText)) {
    suggestions.push({
      category: "Structure",
      message:
        "Add a professional summary (3–4 lines) at the top highlighting your key strengths and career goals.",
      priority: "medium",
    });
  }

  // --- Projects section ---
  if (!hasProjects(resumeText)) {
    suggestions.push({
      category: "Content",
      message:
        "Include a Projects section with brief descriptions, technologies used, and links (GitHub / live demo) to showcase practical skills.",
      priority: "medium",
    });
  }

  // --- Contact links ---
  if (!hasLinks(resumeText)) {
    suggestions.push({
      category: "Visibility",
      message:
        "Add links to your LinkedIn profile, GitHub, and/or portfolio website in your contact section.",
      priority: "medium",
    });
  }

  // --- Resume length ---
  const wc = wordCount(resumeText);
  if (wc < 300) {
    suggestions.push({
      category: "Depth",
      message: `Your resume appears short (~${wc} words). Expand bullet points with context, technologies, and outcomes to better showcase your experience.`,
      priority: "medium",
    });
  } else if (wc > 900) {
    suggestions.push({
      category: "Conciseness",
      message: `Your resume is quite long (~${wc} words). Aim for 1–2 pages; trim older or less-relevant experience for clarity.`,
      priority: "low",
    });
  }

  // --- Filler words ---
  const fillerFound = FILLER_WORDS.filter((w) => lower.includes(` ${w} `));
  if (fillerFound.length >= 2) {
    suggestions.push({
      category: "Language",
      message: `Remove filler/hedge words like "${fillerFound.join('", "')}". Every word should add value.`,
      priority: "low",
    });
  }

  // --- Skills section ---
  if (!/skills|technologies|tools/i.test(resumeText)) {
    suggestions.push({
      category: "Structure",
      message:
        "Add a dedicated Skills section listing technical tools, programming languages, and frameworks for ATS visibility.",
      priority: "high",
    });
  }

  // --- Job description-specific ---
  if (jobDescription && jobDescription.trim().length > 30) {
    if (!/tailored|custom|specific/i.test(resumeText)) {
      suggestions.push({
        category: "Tailoring",
        message:
          "Customise your resume for this specific job description by mirroring key phrases and requirements from the posting.",
        priority: "medium",
      });
    }

    // Check if job title is in resume
    const jdWords = jobDescription
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 5);
    const titleMatches = jdWords.filter((w) => lower.includes(w)).length;
    if (titleMatches < 3) {
      suggestions.push({
        category: "Keyword Match",
        message:
          "Incorporate more keywords from the job description naturally into your experience bullets to improve ATS matching.",
        priority: "high",
      });
    }
  }

  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  suggestions.sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority],
  );

  return suggestions.slice(0, 10);
};

// ─── Public Hybrid Export ────────────────────────────────────────────────────

/**
 * Runs both the rule-based engine and the Gemini AI engine in parallel.
 * Always returns rule-based results; AI results are best-effort.
 *
 * @param {string} resumeText   - Extracted resume text
 * @param {string} jobDescription - Optional job description
 * @returns {Promise<{
 *   ruleBased: Array<{ category: string, message: string, priority: string }>,
 *   ai: string[]
 * }>}
 */
export const generateSuggestions = async (resumeText, jobDescription = "") => {
  const [ruleBased, ai] = await Promise.all([
    // Rule-based is synchronous — wrap so Promise.all is clean
    Promise.resolve(generateRuleBasedSuggestions(resumeText, jobDescription)),
    generateAISuggestions(resumeText),
  ]);

  return { ruleBased, ai };
};
