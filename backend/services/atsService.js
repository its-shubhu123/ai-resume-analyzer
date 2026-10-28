/**
 * Calculates an ATS (Applicant Tracking System) score for a resume.
 * Score is 0–100 based on:
 *  - Section presence (40 pts)
 *  - Action verb usage (25 pts)
 *  - Measurable impact / numbers (20 pts)
 *  - Keyword density (15 pts)
 */

const SECTIONS = [
  {
    name: "contact",
    patterns: [/email|phone|linkedin|github|address/i],
    weight: 8,
  },
  {
    name: "summary/objective",
    patterns: [/summary|objective|profile|about me/i],
    weight: 6,
  },
  {
    name: "experience/work",
    patterns: [/experience|employment|work history|professional background/i],
    weight: 10,
  },
  {
    name: "education",
    patterns: [/education|degree|university|college|bachelor|master|phd/i],
    weight: 8,
  },
  {
    name: "skills",
    patterns: [/skills|technologies|tools|competencies|expertise/i],
    weight: 8,
  },
];

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
  "analyzed",
  "established",
  "streamlined",
  "spearheaded",
  "oversaw",
  "resolved",
  "integrated",
  "transformed",
  "facilitated",
];

const COMMON_KEYWORDS = [
  "project",
  "team",
  "client",
  "agile",
  "scrum",
  "api",
  "database",
  "performance",
  "scalable",
  "solution",
  "product",
  "cross-functional",
  "stakeholder",
  "deadline",
  "communication",
  "problem-solving",
];

/**
 * @param {string} text - Parsed resume text
 * @returns {number} ATS score 0–100
 */
export const calculateAtsScore = (text) => {
  const lower = text.toLowerCase();
  let score = 0;

  // 1. Section presence (40 pts)
  for (const section of SECTIONS) {
    const found = section.patterns.some((p) => p.test(lower));
    if (found) score += section.weight;
  }

  // 2. Action verbs (25 pts)
  const verbMatches = ACTION_VERBS.filter((v) => lower.includes(v)).length;
  const verbScore = Math.min(25, Math.round((verbMatches / 8) * 25));
  score += verbScore;

  // 3. Measurable impact — numbers/percentages/dollar amounts (20 pts)
  const numberMatches = (text.match(/\d+[%$kmb]?|\$\d+|#\d+/gi) || []).length;
  const impactScore = Math.min(20, Math.round((numberMatches / 5) * 20));
  score += impactScore;

  // 4. Keyword density (15 pts)
  const kwMatches = COMMON_KEYWORDS.filter((k) => lower.includes(k)).length;
  const kwScore = Math.min(15, Math.round((kwMatches / 6) * 15));
  score += kwScore;

  return Math.min(100, Math.max(0, score));
};
