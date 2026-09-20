# VS Code Code Walkthrough Guide for Project Review–3

This guide provides the exact sequence of files to open in VS Code during your Project Review–3 presentation, including the exact talking points (1–3 simple sentences) to say to the faculty for each file.

---

## PRESENTATION FLOW OVERVIEW

1. **Part 1 — Live Website Demonstration** (Browser)
2. **Part 2 — Frontend Architecture** (VS Code)
3. **Part 3 — Backend Architecture & Adaptive Engine** (VS Code)
4. **Part 4 — Database Design & JPA Mappings** (VS Code)
5. **Part 5 — PostgreSQL Live Data Inspection** (Terminal / pgAdmin)
6. **Part 6 — REST API Demonstration** (Postman)

---

## PART 2: FRONTEND WALKTHROUGH (In VS Code)

### File 1: `frontend/src/api/axiosClient.js`
- **Location**: `frontend/src/api/axiosClient.js`
- **What to say**:
  > "This is our centralized Axios HTTP client. It automatically attaches the JWT Bearer token to all outgoing requests via a request interceptor and handles token expiration or 401 unauthorized errors via a response interceptor."

### File 2: `frontend/src/pages/Dashboard.jsx`
- **Location**: `frontend/src/pages/Dashboard.jsx`
- **What to say**:
  > "This is our Student Dashboard. It fetches live statistics from our PostgreSQL database, including quizzes completed, overall accuracy, and calculated learning levels. It also displays personalized practice recommendations."

### File 3: `frontend/src/pages/Quiz.jsx`
- **Location**: `frontend/src/pages/Quiz.jsx`
- **What to say**:
  > "This is the active quiz interface. Notice that for security, the correct answer is never sent to the browser during the quiz. As the student answers, our adaptive engine dynamically adjusts question difficulty and provides real-time rolling accuracy."

### File 4: `frontend/src/pages/QuizResult.jsx`
- **Location**: `frontend/src/pages/QuizResult.jsx`
- **What to say**:
  > "This is the results screen displayed after completing a quiz. It renders the score, accuracy percentage, time taken, and next recommended difficulty tier, along with a full review of questions, student choices, correct answers, and academic explanations."

### File 5: `frontend/src/pages/Performance.jsx`
- **Location**: `frontend/src/pages/Performance.jsx`
- **What to say**:
  > "This is our comprehensive performance analytics page. It analyzes cumulative topic performance from the database, categorizing topics into 'Strong' or 'Needs Practice', and generates targeted study links."

---

## PART 3: BACKEND WALKTHROUGH (In VS Code)

### File 6: `backend/src/main/java/com/examapp/controller/QuizController.java`
- **Location**: `backend/src/main/java/com/examapp/controller/QuizController.java`
- **What to say**:
  > "This is our REST Controller for quizzes. Notice that our controllers are lightweight; they extract the authenticated student's identity securely from the Spring SecurityContext and delegate business logic to our service layer."

### File 7: `backend/src/main/java/com/examapp/service/AdaptiveQuizService.java`
- **Location**: `backend/src/main/java/com/examapp/service/AdaptiveQuizService.java`
- **What to say**:
  > "Our quiz begins at medium difficulty. After every answer, the backend calculates the student's current accuracy. Below 50% moves toward easy questions, 50–75% stays medium, and above 75% moves toward hard questions. We also exclude already answered questions, so the same question is not repeated."

### File 8: `backend/src/main/java/com/examapp/service/QuizService.java`
- **Location**: `backend/src/main/java/com/examapp/service/QuizService.java`
- **What to say**:
  > "This service manages the complete quiz lifecycle: starting an attempt, evaluating submitted answers, and finalizing scores. It enforces attempt ownership to ensure students cannot access or manipulate other students' sessions."

### File 9: `backend/src/main/java/com/examapp/service/PerformanceService.java`
- **Location**: `backend/src/main/java/com/examapp/service/PerformanceService.java`
- **What to say**:
  > "This service maintains longitudinal learning mastery. After each quiz, it updates cumulative topic metrics, calculates average response times, and determines the student's learning level from BEGINNER to EXPERT."

### File 10: `backend/src/main/java/com/examapp/security/SecurityConfig.java`
- **Location**: `backend/src/main/java/com/examapp/security/SecurityConfig.java`
- **What to say**:
  > "Here is our Spring Security configuration. It enforces stateless JWT session management, registers our custom JwtAuthenticationFilter, configures CORS for our React frontend, and protects private student endpoints."

---

## PART 4: DATABASE WALKTHROUGH (In VS Code)

### File 11: `database/01_schema.sql`
- **Location**: `database/01_schema.sql`
- **What to say**:
  > "This is our relational database schema in 3rd Normal Form. It defines all 7 required tables: users, subjects, topics, questions, quiz_attempts, student_answers, and performance, with primary keys, foreign keys with cascade rules, and check constraints."

### File 12: `backend/src/main/java/com/examapp/entity/Question.java`
- **Location**: `backend/src/main/java/com/examapp/entity/Question.java`
- **What to say**:
  > "Here is the JPA Entity mapping for Question. It maps directly to our PostgreSQL table, with difficulty levels constrained to EASY, MEDIUM, and HARD, and correct answers restricted to A, B, C, or D."

### File 13: `database/03_indexes.sql`
- **Location**: `database/03_indexes.sql`
- **What to say**:
  > "We engineered composite B-Tree indexes, such as on `(topic_id, difficulty)`, allowing our Adaptive Quiz Engine to query unasked questions in real-time with sub-millisecond latency without table scans."

### File 14: `database/04_queries_for_review.sql`
- **Location**: `database/04_queries_for_review.sql`
- **What to say**:
  > "We prepared demonstration SQL queries demonstrating table inspection, multi-table JOINs, and adaptive progression tracking for this review."

---

## PART 5: POSTGRESQL LIVE VERIFICATION

Open terminal and execute:
```powershell
$env:PGPASSWORD = "postgres"
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -d exam_prep_db -c "
SELECT 'users' AS table_name, count(*) FROM users
UNION ALL SELECT 'subjects', count(*) FROM subjects
UNION ALL SELECT 'topics', count(*) FROM topics
UNION ALL SELECT 'questions', count(*) FROM questions
UNION ALL SELECT 'quiz_attempts', count(*) FROM quiz_attempts
UNION ALL SELECT 'student_answers', count(*) FROM student_answers
UNION ALL SELECT 'performance', count(*) FROM performance;
"
```
- **What to say**:
  > "As you can see, all 7 tables exist in PostgreSQL with live records, including 6 subjects, 20 topics, and 60 academic questions."

---

## PART 6: POSTMAN DEMONSTRATION

Open Postman and import `postman/Exam_Prep_App.postman_collection.json`.
- Run: `1. Authentication -> Login Student`
  - Show the 200 OK response with the generated JWT token.
- Run: `2. Curriculum -> Get All Subjects`
  - Show the 6 subjects retrieved from the database.
- Run: `3. Adaptive Quiz Engine -> Start Adaptive Quiz`
  - Show that `firstQuestion` is returned with `difficulty: MEDIUM` and `correct_answer` is hidden.
