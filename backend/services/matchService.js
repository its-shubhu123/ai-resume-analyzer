/**
 * Compares resume text against a job description to calculate
 * a match percentage and identify missing skills.
 */

// Common tech & soft skill keywords to check
const SKILL_POOL = [
  // Languages
  "javascript",
  "typescript",
  "python",
  "java",
  "c++",
  "c#",
  "go",
  "rust",
  "ruby",
  "php",
  "swift",
  "kotlin",
  // Frontend
  "react",
  "vue",
  "angular",
  "next.js",
  "svelte",
  "html",
  "css",
  "tailwind",
  "sass",
  "webpack",
  "vite",
  // Backend
  "node.js",
  "express",
  "django",
  "flask",
  "spring",
  "fastapi",
  "graphql",
  "rest",
  "microservices",
  // Databases
  "sql",
  "mysql",
  "postgresql",
  "mongodb",
  "redis",
  "elasticsearch",
  "firebase",
  // DevOps / Cloud
  "aws",
  "azure",
  "gcp",
  "docker",
  "kubernetes",
  "ci/cd",
  "terraform",
  "jenkins",
  "github actions",
  // Tools
  "git",
  "linux",
  "agile",
  "scrum",
  "jira",
  "figma",
  "postman",
  // Soft skills
  "communication",
  "leadership",
  "teamwork",
  "problem-solving",
  "collaboration",
  "mentoring",
  // ML / Data
  "machine learning",
  "deep learning",
  "tensorflow",
  "pytorch",
  "data analysis",
  "pandas",
  "numpy",
];

/**
 * Tokenises a string into lowercase words/phrases.
 */
const tokenise = (text) => text.toLowerCase().replace(/[^\w\s.+#]/g, " ");

/**
 * Extracts skills present in a text block.
 */
const extractSkills = (text) => {
  const lower = tokenise(text);
  return SKILL_POOL.filter((skill) => lower.includes(skill));
};

/**
 * Calculates cosine-like similarity using word overlap.
 */
const textSimilarity = (textA, textB) => {
  const wordsA = new Set(
    tokenise(textA)
      .split(/\s+/)
      .filter((w) => w.length > 3),
  );
  const wordsB = new Set(
    tokenise(textB)
      .split(/\s+/)
      .filter((w) => w.length > 3),
  );
  const intersection = [...wordsA].filter((w) => wordsB.has(w)).length;
  const union = new Set([...wordsA, ...wordsB]).size;
  return union === 0 ? 0 : intersection / union;
};

/**
 * @param {string} resumeText
 * @param {string} jobDescription
 * @returns {{ matchScore: number, missingSkills: string[] }}
 */
export const matchJobDescription = (resumeText, jobDescription) => {
  if (!jobDescription || jobDescription.trim().length < 20) {
    return { matchScore: 0, missingSkills: [] };
  }

  const resumeSkills = extractSkills(resumeText);
  const jdSkills = extractSkills(jobDescription);

  // Skills required by JD but absent from resume
  const missingSkills = jdSkills.filter((s) => !resumeSkills.includes(s));

  // Skill coverage score (60% weight)
  const skillCoverage =
    jdSkills.length > 0
      ? (jdSkills.length - missingSkills.length) / jdSkills.length
      : 0;

  // Text similarity score (40% weight)
  const similarity = textSimilarity(resumeText, jobDescription);

  const matchScore = Math.round((skillCoverage * 0.6 + similarity * 0.4) * 100);

  return {
    matchScore: Math.min(100, Math.max(0, matchScore)),
    missingSkills: missingSkills.slice(0, 12), // cap at 12
  };
};
