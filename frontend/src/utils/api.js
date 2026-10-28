import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "https://ai-resume-analyzer-backend-xv3p.onrender.com";

/**
 * Sends a resume PDF + optional job description to the backend for analysis.
 * @param {File} file - PDF file
 * @param {string} jobDescription - Optional JD text
 * @returns {Promise<object>} Analysis result
 */
export const analyzeResume = async (file, jobDescription = "") => {
  const formData = new FormData();
  formData.append("resume", file);
  if (jobDescription.trim()) {
    formData.append("jobDescription", jobDescription.trim());
  }

  try {
    const response = await axios.post(`${API_BASE}/analyze`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 30000,
    });
    return response.data;
  } catch (err) {
    if (err.response?.data?.message) {
      throw new Error(err.response.data.message);
    }
    if (err.code === "ECONNABORTED") {
      throw new Error("Request timed out. Please try again.");
    }
    if (!err.response) {
      throw new Error(
        "Cannot reach the server. Make sure the backend is running on port 5000.",
      );
    }
    throw new Error("Analysis failed. Please try again.");
  }
};
