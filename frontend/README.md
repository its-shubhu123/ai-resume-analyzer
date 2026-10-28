# 🚀 ResumeIQ — AI-Powered ATS Resume Analyzer & Skill Verifier

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

> A full-stack application that evaluates developer resumes against ATS compliance standards, cross-references claimed skills with actual code on GitHub, and provides qualitative improvements using Google Gemini Generative AI.

---

## 🌐 Live Demo

* **Live Application:** [https://ai-resume-analyzer-frontend-01ki.onrender.com](https://ai-resume-analyzer-frontend-01ki.onrender.com)
* **Backend API Health Check:** [https://ai-resume-analyzer-backend-xv3p.onrender.com/health](https://ai-resume-analyzer-backend-xv3p.onrender.com/health)

---

## ✨ Key Features

* **📄 PDF Resume Parsing:** Extracts and analyzes raw textual data from uploaded PDF documents in-memory.
* **📊 Deterministic ATS Scoring:** Rule-based heuristics evaluate structure, contact information presence, formatting, and word counts out of 100.
* **🐙 GitHub Skill Verification Engine:** 
  * Automatically extracts the candidate's GitHub handle using regular expressions.
  * Queries the **GitHub REST API** to scan public repositories, star counts, descriptions, and primary languages.
  * Cross-verifies claimed resume skills against real code, tagging them as **Verified** or **Unverified**.
* **🧠 Contextual AI Suggestions:** Integrates the **Google Gemini API** (`gemini-pro`) to deliver recruiter-grade, qualitative feedback on bullet points, impact metrics, and phrasing.
* **🎯 Job Description Alignment:** Computes keyword density and extracts missing high-priority technical skills compared to target role descriptions.
* **🎨 Modern UI/UX:** Built with a dark glassmorphism theme using **Tailwind CSS** and smooth layout transitions powered by **Framer Motion**.

---

## 🛠️ Architecture & Tech Stack

```text
ai_resume_analyzer/
├── backend/            # Express REST API (Node.js)
│   ├── controllers/    # Business logic & request handling
│   ├── routes/         # API endpoints
│   ├── services/       # AI, parser, GitHub & ATS services
│   └── server.js       # App entry point & CORS configuration
└── frontend/           # Single-Page Application (React + Vite)
    ├── src/components/ # Modular UI components (Results, Badges, Preview)
    └── src/App.jsx     # State orchestration & animations

Frontend: React.js (Vite), Tailwind CSS, Framer Motion, Lucide React
Backend: Node.js, Express.js, Multer (file handling)
AI & External APIs: Google Gemini API (@google/generative-ai), GitHub REST API v3
Deployment: Render (Decoupled Static Site + Web Service architecture)

Clone the Repository:
git clone https://github.com/its-shubhu123/ai-resume-analyzer.git
cd ai-resume-analyzer

 Configure Backend:
 cd backend
npm install

Create a .env file in the backend/ directory:
PORT=5000
GEMINI_API_KEY=your_actual_gemini_api_key_here

The backend will run on http://localhost:5000.

Configure Frontend:
cd frontend
npm install
npm run dev

The frontend will start on http://localhost:5173.

Author
Shubham Vishwakarma
GitHub: @its-shubhu123
College: National Institute of Technology, Patna (NIT Patna)

This project is open source and available under the MIT License.
