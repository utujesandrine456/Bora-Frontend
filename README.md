🚀 BORA — AI-Powered Recruitment Platform

Where talent meets its true value

🌍 Overview

BORA is an AI-powered recruitment platform that enables recruiters to efficiently screen, rank, and shortlist candidates using intelligent automation — while keeping humans in control of final hiring decisions.

This repository contains the Frontend Application, built with a focus on performance, scalability, and user experience.

🎯 Problem Statement

Recruiters today struggle with:

High volumes of applications
Time-consuming manual screening
Difficulty comparing diverse candidate profiles

👉 BORA solves this by:

Automating candidate evaluation
Providing objective ranking
Delivering clear, explainable insights
✨ Features
📄 Job creation & management
📂 Resume upload (PDF, CSV, Excel)
🧠 AI-powered screening
📊 Candidate ranking (Top 10 / Top 20)
💡 Explainable AI insights
📈 Analytics & insights dashboard
⚡ Fast and responsive UI
🧱 Tech Stack
Technology	Purpose
Next.js 14	Frontend Framework
TypeScript	Type Safety
Tailwind CSS	Styling
Redux Toolkit	State Management
React Hook Form + Zod	Forms & Validation
Recharts	Data Visualization
React Dropzone	File Uploads
Axios	API Calls
Vercel	Deployment
🧠 How the AI Works
Collect job details and applicant data
Extract key information from resumes
Compare candidates to job requirements
Assign match scores (0–100)
Rank candidates and shortlist Top 10/20
Generate explanations (strengths, gaps, recommendations)
📄 Pages
Page	Route	Description
Auth	/login, /register	Login & Signup
Dashboard	/dashboard	Overview
Jobs	/jobs	Job listings
Create Job	/jobs/create	Add job
Job Details	/jobs/[id]	Run screening
Applicants	/applicants	Manage candidates
Results	/screening/results	Shortlist
Insights	/insights	Analytics
⚙️ Getting Started
# Clone repository
git clone https://github.com/YOUR_ORG/bora-frontend.git

# Navigate into project
cd bora-frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.local.example .env.local

# Run development server
npm run dev

Open 👉 http://localhost:3000

🔐 Environment Variables

Create a .env.local file:

NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
NEXTAUTH_SECRET=your_secret_here
NEXTAUTH_URL=http://localhost:3000

⚠️ Never commit .env.local

🌿 Git Workflow
Branch Structure
main → production (stable)
dev  → integration branch
Personal Branches

Each team member works on their own branch:

sandrine
john
alice
eric
Workflow
git checkout dev
git pull origin dev

git checkout -b your-name

git add .
git commit -m "feat: add feature"

git push origin your-name

👉 Then open Pull Request → dev

📏 Code Standards
Use TypeScript only
Use Tailwind CSS only
Write clean, modular code
Reuse components
📦 Scripts
npm run dev
npm run build
npm run lint
npm run format
🚀 Deployment
Hosted on Vercel
Auto-deploy on merge to main

Live URL: https://bora-ai.vercel.app

🏆 Hackathon Goal

Build a production-ready AI recruitment system that excels in:

Real-world impact
AI explainability
Engineering quality
User experience
👥 Team

Built by Team BORA for Umurava AI Hackathon 2026 🚀
