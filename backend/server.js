import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import resumeRoutes from "./routes/resumeRoutes.js";
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/", resumeRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Resume Analyzer API is running" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: err.message || "Something went wrong",
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Resume Analyzer API running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health\n`);
});
