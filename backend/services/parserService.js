import fs from "fs";
import pdfParse from "pdf-parse/lib/pdf-parse.js";

/**
 * Extracts plain text from a PDF file.
 * @param {string} filePath - Absolute path to the PDF file.
 * @returns {Promise<string>} Extracted text.
 */
export const parseResume = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text || "";
};

