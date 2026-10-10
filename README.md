# 🎓 Hariwa Student Registration Portal
A full-stack web-based Student Registration System built with the MERN Stack — designed for real-world deployment in universities with unreliable internet infrastructure.

LicenseReactNode.jsMongoDBTailwind CSS

📖 Overview
This project replaces the traditional paper-based student enrollment process with a fully digital workflow. Students register online, verify their email via a 6-digit OTP code, complete a digital admission form, upload identity documents, and track their application status in real time — while administrators review, approve, reject, or request corrections from a dedicated dashboard.

Built as a case study for Hariwa University, Herat — Afghanistan.

✨ Features
🔐 Security & Authentication
JWT (JSON Web Token) authentication with Bearer headers
bcrypt password hashing with automatic salt generation
OTP email verification — 6-digit codes with 10-minute expiry & attempt throttling
Role-Based Access Control (RBAC) — separate permissions for student and admin
Rate limiting (sliding-window, IP-based) on sensitive endpoints
Security headers (anti-clickjacking, MIME-sniffing prevention) & input sanitization


💾 Hybrid Fallback Database (Key Innovation)
Runs instantly on a local JSON store (db_store.json) with atomic file writes
Automatically syncs with MongoDB in the background when MONGODB_URI is provided
100% uptime — keeps working even with no database connection (critical for Afghanistan's network conditions)


🌍 Multilingual UI
Three languages: English 🇬🇧 | دری 🇦🇫 | پښتو 🇦🇫
Full RTL / LTR bidirectional layout with automatic direction switching
Persistent language & theme selection (localStorage)


👨‍🎓 Student Portal
Digital enrollment form with dynamic faculty → department filtering
Client-side image compression before Base64 upload (photo, Tazkira, certificate)
Real-time application status tracking (Pending / Approved / Rejected / Need Correction)
Downloadable & printable Student ID card via HTML2Canvas
In-app notification bell with read receipts


🧑‍💼 Admin Dashboard
Review all applications with search & status/faculty filters
Approve, reject, or flag applications for correction with admin notes
Administrative statistics: totals, approval ratios, faculty breakdown


🎨 Modern Design
Glassmorphism design language with backdrop blur effects
Dark / Light theme support
Smooth animations powered by Motion (Framer Motion)
Fully responsive — mobile bottom-nav to desktop sidebar


🛠️ Tech Stack
Layer	Technologies
Frontend	React 19, Vite 6, Tailwind CSS v4, Motion, Lucide Icons, HTML2Canvas, EmailJS Browser
Backend	Node.js 20+, Express.js, esbuild, dotenv
Database	MongoDB + Mongoose (3 schemas: User, Application, Notification) with JSON File Store fallback
Security	JWT, bcrypt.js, RBAC middleware, rate limiter, security headers

📁 Project Structure
src/├── frontend/│ ├── components/       
# Reusable UI (Navbar, Sidebar, Modals, StatusBadge...)│ 
├── controllers/      
# Context providers (LanguageContext, ThemeContext)│  
├── models/          
# api.js, settingsStore.js│   ├── pages/           
# Login, Register, Dashboards, Forms...│  
├── utils/            # emailjsService.js, imageCompressor.js│   └── App.jsx          
# Role-based routing└── backend/    ├── controllers/      
# authController, studentController, notificationController    ├── middleware/      
# authMiddleware (JWT+RBAC), securityMiddleware    ├── models/           
# db.js (Schemas + Fallback engine)    ├── routes/           
# /api/auth, /api/students, /api/notifications    ├── utils/           
# authUtils.js, emailService.js    └── server.js         
# Express + Vite integration

🚀 Getting Started
Prerequisites
Node.js v20+
MongoDB (optional — system works without it via fallback store)
Installation
# Clone the repositorygit clone https://github.com/YOUR-USERNAME/hariwa-student-registration.gitcd hariwa-student-registration# Install dependenciesnpm install# Configure environment variablescp .env.example .env
Environment Variables
PORT=3000MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/uniport   # optionalJWT_SECRET=your_secret_key_hereNODE_ENV=development
Run
# Development (Express + Vite hot reload)npm run dev# Production (bundled with esbuild → dist/server.cjs)npm run buildnpm start


🔄 Application Workflow
Student Register → OTP Email Verification → Login → Complete Enrollment Form     → Upload Documents (auto-compressed) → Status: PENDING     → Admin Review → APPROVED / REJECTED / NEED CORRECTION     → Student notified → Download printable Student ID Card ✅
📊 Status Workflow
Status	Color	Meaning
🟡 Pending	Yellow	Awaiting admin review
🟢 Approved	Green	Accepted — ID card unlocked
🔴 Rejected	Red	Application declined
🔵 Need Correction	Blue	Student must fix & resubmit (same record, no duplicates)
🤝 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

📄 License
This project is licensed under the MIT License.

👤 Author
Sohail Ashraq — Department of Software Engineering, Faculty of Computer Science, Hariwa University

Supervised by Habibullah Andishah
