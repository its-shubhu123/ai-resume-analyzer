import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { analyzeResume } from "../controllers/resumeController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `resume-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// File filter — PDFs only
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// POST /analyze
router.post(
  "/analyze",
  (req, res, next) => {
    upload.single("resume")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res
          .status(400)
          .json({ error: "File upload error", message: err.message });
      } else if (err) {
        return res
          .status(400)
          .json({ error: "Invalid file", message: err.message });
      }
      next();
    });
  },
  analyzeResume,
);

export default router;
