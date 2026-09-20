# Exam Preparation App With Adaptive Quizzes

> **College Project Review–3 Edition**  
> A full-stack, enterprise-grade educational examination platform featuring real-time adaptive difficulty algorithms, relational analytics, and a modern design system.

---

## 🌟 Executive Summary
The **Exam Preparation App With Adaptive Quizzes** is an intelligent testing system designed to dynamically evaluate a student's knowledge level in real time. Rather than presenting fixed static tests, the application's **Adaptive Quiz Engine** calibrates question difficulty (`EASY`, `MEDIUM`, `HARD`) after every response based on cumulative accuracy, maximizing learning efficiency and assessment precision.

---

## 🛠 Tech Stack

| Layer | Technology | Version / Specifications |
| :--- | :--- | :--- |
| **Front-End** | **React.js** | React 18, React Router v6, Axios, Lucide Icons, Vite |
| **Styling** | **Vanilla CSS** | Custom CSS Design System, Glassmorphism, HSL Tokens |
| **Back-End** | **Spring Boot** | Spring Boot 3.3.6, Target Java 21 |
| **Security** | **Spring Security** | Stateless JWT (HMAC-SHA256), BCrypt Password Hashing |
| **Database** | **PostgreSQL** | PostgreSQL 18, 3NF Normalization, 7 Relational Tables |
| **Build Tools** | **Maven & Vite** | Apache Maven 3.9+, Vite 5+ |
| **Documentation** | **Markdown** | Comprehensive Review Guides, Viva Prep, API Specs |

---

## 📂 Key Architecture & Presentation Folders

When opening this workspace in **VS Code**, the project is organized into seven clean root directories:

```
ram/
├── frontend/             # React 18 single-page application & custom UI design system
├── backend/              # Spring Boot 3.3.6 (Java 21) RESTful backend
├── database/             # PostgreSQL DDL, seed data, indexes & review queries
├── postman/              # Postman API testing collection (ready for review)
├── docs/                 # Complete review guides, viva questions, and architecture docs
├── docker-compose.yml    # Containerized database & Redis setup
└── README.md             # Master documentation
```

---

## ⚡ Quick Start & Run Guide

### 1. Database Setup (PostgreSQL 18)
Ensure PostgreSQL is running locally on port `5432`:
```powershell
# In PostgreSQL (psql or pgAdmin):
CREATE DATABASE exam_prep_db;

# Execute initialization scripts in order:
psql -U postgres -d exam_prep_db -f database/01_schema.sql
psql -U postgres -d exam_prep_db -f database/02_sample_data.sql
psql -U postgres -d exam_prep_db -f database/03_indexes.sql
```

### 2. Run the Spring Boot Backend
```powershell
cd backend
mvn spring-boot:run
```
*Backend runs at: `http://localhost:8080`*  
*Initial seed data checks run idempotently without duplicating questions or users.*

### 3. Run the React Frontend
```powershell
cd frontend
npm install
npm run dev
```
*Frontend runs at: `http://localhost:5173`*

---

## Deployment

Production deployments create accounts through registration; no demo account or credentials are included. See [the deployment guide](docs/DEPLOYMENT.md) for environment variables, database initialization, and frontend/API deployment steps.

---

## 🧠 Adaptive Quiz Algorithm Summary

The adaptive behavior is deterministic, rigorous, and easily demonstrable for faculty review:

```
                 [ Student Starts Quiz ]
                            │
                            ▼
               [ Initial Question: MEDIUM ]
                            │
                            ▼
              [ Calculate Rolling Accuracy ]
              Accuracy = (Correct / Total) * 100
                            │
         ┌──────────────────┼──────────────────┐
         ▼                  ▼                  ▼
    Accuracy < 50%    50% <= Acc <= 75%   Accuracy > 75%
         │                  │                  │
         ▼                  ▼                  ▼
      [ EASY ]          [ MEDIUM ]          [ HARD ]
```

- **Exclusion Guarantee**: Questions previously answered in the current attempt are strictly excluded from subsequent selection.
- **Deterministic Fallback**: If a target difficulty bucket is exhausted, the engine falls back gracefully to adjacent tiers (`HARD` $\rightarrow$ `MEDIUM` $\rightarrow$ `EASY`).
- **Zero Client Leakage**: Active questions do not disclose `correct_answer` or `explanation` until the quiz is completed.

---

## 📚 Review–3 Presentation Documentation (`docs/`)

- **[VS Code Code Presentation Guide](docs/VSCODE_CODE_GUIDE.md)**: 6-step faculty demonstration sequence with exact files and speaking points.
- **[Review–3 Live Demo Script](docs/REVIEW3_DEMO_GUIDE.md)**: Step-by-step walkthrough of the live application.
- **[Viva Questions & Answers](docs/VIVA_QUESTIONS.md)**: 16 high-probability faculty viva questions answered.
- **[Adaptive Algorithm Specification](docs/ADAPTIVE_ALGORITHM.md)**: Mathematical models, formulas, and state charts.
- **[Backend Architecture Guide](docs/BACKEND_EXPLANATION.md)**: Detailed breakdown of controllers, services, and security.
- **[Frontend Architecture Guide](docs/FRONTEND_EXPLANATION.md)**: Design system tokens, state flow, and components.
- **[Database Architecture Guide](docs/DATABASE_EXPLANATION.md)**: Schema analysis, normalization, and indexing.
- **[REST API Documentation](docs/API_DOCUMENTATION.md)**: Complete request/response payloads for all endpoints.
- **[Test & Quality Report](docs/TEST_REPORT.md)**: Test execution results and database verification numbers.
