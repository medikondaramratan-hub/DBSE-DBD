# Project Structure & Repository Organization

This document provides a complete layout of the **Exam Preparation App With Adaptive Quizzes** codebase, structured cleanly for VS Code demonstration during **Project Review–3**.

```
ram/
├── .env.example                     # Environment configuration template
├── docker-compose.yml               # PostgreSQL 16 + Redis 7 container orchestration
├── README.md                        # Master project documentation & quick start
│
├── database/                        # Database scripts for review & grading
│   ├── 01_schema.sql                # Complete DDL: 7 tables with PK, FK, UNIQUE, CHECK
│   ├── 02_sample_data.sql           # Idempotent seed data: 60 questions, subjects, demo users
│   ├── 03_indexes.sql               # B-Tree performance optimization indexes
│   ├── 04_queries_for_review.sql    # Analytical verification queries for faculty
│   ├── DATABASE_DESIGN.md           # Schema rationale, 3NF justification, normalization
│   └── ER_DIAGRAM.md                # Relational diagram & entity mapping
│
├── backend/                         # Spring Boot 3.3.6 (Java 21) REST Backend
│   ├── pom.xml                      # Maven configuration (Java 21, Spring Boot 3.3.6)
│   └── src/
│       ├── main/
│       │   ├── java/com/examprep/
│       │   │   ├── config/          # CacheConfig & app configurations
│       │   │   ├── controller/      # Auth, Subject, Quiz, Performance REST controllers
│       │   │   ├── dto/             # Request & Response Data Transfer Objects
│       │   │   ├── entity/          # JPA Domain Entities matching PostgreSQL schema
│       │   │   ├── exception/       # GlobalExceptionHandler & custom exceptions
│       │   │   ├── repository/      # Spring Data JPA repositories with JPQL
│       │   │   ├── security/        # JwtService, JwtAuthenticationFilter, SecurityConfig
│       │   │   ├── service/         # AdaptiveQuizService, QuizService, PerformanceService
│       │   │   ├── util/            # SeedDataLoader (idempotent startup seeder)
│       │   │   └── ExamPrepApplication.java # Spring Boot entry point
│       │   └── resources/
│       │       └── application.yml  # Application properties (DB, JWT, Hibernate validate)
│       └── test/java/com/examprep/
│           ├── AdaptiveQuizServiceTest.java # Unit tests for adaptive difficulty transitions
│           ├── AuthServiceTest.java         # Authentication & BCrypt verification tests
│           └── QuizServiceTest.java         # Quiz session lifecycle & ownership tests
│
├── frontend/                        # React 18 + Vite Frontend Application
│   ├── package.json                 # Dependencies (React 18, React Router v6, Axios, Lucide)
│   ├── vite.config.js               # Dev server configuration with API reverse proxy
│   ├── index.html                   # HTML5 template with Google Fonts (Outfit, Inter)
│   └── src/
│       ├── api/
│       │   └── axiosClient.js       # Centralized Axios client with JWT interceptor
│       ├── components/              # Reusable UI components (Navbar, Sidebar, StatCard, etc.)
│       ├── context/
│       │   └── AuthContext.jsx      # Global authentication state provider
│       ├── layouts/
│       │   └── DashboardLayout.jsx  # Admin/Student responsive shell
│       ├── pages/                   # Application views (Dashboard, Quiz, Result, Performance)
│       ├── styles/
│       │   └── main.css             # Vanilla CSS design system (No Tailwind)
│       ├── App.jsx                  # Route definitions
│       └── main.jsx                 # Client entry point
│
├── postman/                         # API Testing Collection
│   └── Exam_Prep_App.postman_collection.json # 4 folders, complete API test suite
│
└── docs/                            # Comprehensive College Review Documentation
    ├── ADAPTIVE_ALGORITHM.md        # Mathematical formulation of adaptive logic
    ├── API_DOCUMENTATION.md         # Full REST API endpoint reference
    ├── BACKEND_EXPLANATION.md       # Spring Boot architecture & design patterns
    ├── DATABASE_EXPLANATION.md      # PostgreSQL schema, constraints & indexing
    ├── FRONTEND_EXPLANATION.md      # React components, routing & design system
    ├── PROJECT_STRUCTURE.md         # Repository structure guide
    ├── REVIEW3_DEMO_GUIDE.md        # Live demonstration script for faculty
    ├── TEST_REPORT.md               # Automated testing & PostgreSQL validation report
    ├── VIVA_QUESTIONS.md            # 16 standard viva questions with detailed answers
    └── VSCODE_CODE_GUIDE.md         # Step-by-step file presentation order & scripts
```
