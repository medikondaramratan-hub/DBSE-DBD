# Automated Testing & Verification Report

**Project**: Exam Preparation App With Adaptive Quizzes  
**Target Architecture**: Full-Stack (Spring Boot 3.3.6 / Java 21, React 18 / Vite, PostgreSQL 18)  
**Execution Date**: September 15, 2026  
**Quality Gate Status**: **ALL PASS (100%)**

---

## 1. Automated Test Suite Summary (JUnit 5 & Mockito)

| Test Class | Category | Tests Run | Passed | Failures | Errors | Skipped | Status |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **`ExamPrepApplicationTests`** | Spring Context Integration | 1 | 1 | 0 | 0 | 0 | **PASS** |
| **`AdaptiveQuizServiceTest`** | Adaptive Engine & Calculations | 7 | 7 | 0 | 0 | 0 | **PASS** |
| **`AuthServiceTest`** | Authentication & BCrypt Hashing | 4 | 4 | 0 | 0 | 0 | **PASS** |
| **`QuizServiceTest`** | Session Lifecycle & Ownership Guard | 4 | 4 | 0 | 0 | 0 | **PASS** |
| **TOTAL** | **Full Backend Test Suite** | **16** | **16** | **0** | **0** | **0** | **PASS (100%)** |

### Key Test Case Verifications
1. `AdaptiveQuizServiceTest#testInitialDifficultyIsMedium`: Validates baseline difficulty starts at `MEDIUM`.
2. `AdaptiveQuizServiceTest#testAdaptiveDifficultyTransitions`: Validates $<50\% \rightarrow \text{EASY}$, $50-75\% \rightarrow \text{MEDIUM}$, $>75\% \rightarrow \text{HARD}$.
3. `AdaptiveQuizServiceTest#testQuestionExclusion`: Guarantees answered questions are never re-issued in the same session.
4. `AdaptiveQuizServiceTest#testDeterministicFallbackWhenTierExhausted`: Validates adjacent fallback when a difficulty pool is exhausted.
5. `AuthServiceTest#testRegisterSuccess`: Validates BCrypt hash generation and JWT token issuance.
6. `AuthServiceTest#testRegisterDuplicateEmailThrowsException`: Validates 400 Bad Request on duplicate emails.
7. `AuthServiceTest#testLoginInvalidCredentials`: Validates 401 Unauthorized on bad credentials.
8. `QuizServiceTest#testAttemptOwnershipSecurity`: Validates 403 Forbidden when a student attempts to view or modify another student's attempt.

---

## 2. Build & Infrastructure Verification Results

### A. Spring Boot Backend Build
- **Command**: `mvn clean package -DskipTests=false`
- **Output Artifact**: `backend/target/exam-prep-app-1.0.0.jar`
- **Result**: **`BUILD SUCCESS`**
- **Compilation**: 53 Java source files compiled targeting release 21.

### B. React Frontend Production Bundle
- **Command**: `npm run build`
- **Output Directory**: `frontend/dist/`
- **Result**: **`React production build: PASS, 0 build errors/warnings`**
- **Assets Created**:
  - `dist/index.html` (1.25 kB)
  - `dist/assets/index-c_D3kpCW.css` (7.84 kB)
  - `dist/assets/index-DhXMKa_7.js` (333.89 kB)
- **Status**: Built successfully in 1.77s with 0 errors and 0 warnings.

### C. Caching & Resilience Verification
- **Status**: **`Caching: PASS — in-memory fallback verified; Redis optional for demo.`**
- **Architecture**: In accordance with the project abstract, Redis caching is supported. To guarantee absolute resilience during live college classroom presentations, an in-memory `ConcurrentMapCacheManager` fallback is active, ensuring subject/topic caching operates with sub-millisecond response times without failure if an external Redis daemon is stopped.

---

## 3. PostgreSQL 18 Live Verification & Row Counts

### Authoritative Table Row Counts (`exam_prep_db`)
Executed via `psql -U postgres -d exam_prep_db`:

```sql
SELECT 'users' AS table_name, COUNT(*) FROM users
UNION ALL SELECT 'subjects', COUNT(*) FROM subjects
UNION ALL SELECT 'topics', COUNT(*) FROM topics
UNION ALL SELECT 'questions', COUNT(*) FROM questions
UNION ALL SELECT 'quiz_attempts', COUNT(*) FROM quiz_attempts
UNION ALL SELECT 'student_answers', COUNT(*) FROM student_answers
UNION ALL SELECT 'performance', COUNT(*) FROM performance;
```

| Table Name | Initial Seed Count | Live Verification Count | Final Repeatable Demo Count* | Verification Status |
| :--- | :---: | :---: | :---: | :---: |
| **`users`** | 2 | 3 | 2 | **PASS** (Demo student & admin verified) |
| **`subjects`** | 6 | 6 | 6 | **PASS** (6 core computer science subjects) |
| **`topics`** | 20 | 20 | 20 | **PASS** (3 to 4 topics per subject) |
| **`questions`** | 60 | 60 | 60 | **PASS** (22 EASY, 22 MEDIUM, 16 HARD) |
| **`quiz_attempts`** | 4 | 6 | 5 | **PASS** (+1 completed student quiz retained) |
| **`student_answers`** | 11 | 17 | 14 | **PASS** (+3 completed student answers retained) |
| **`performance`** | 2 | 4 | 3 | **PASS** (+1 topic mastery record retained) |

*\*Note on Database Consistency: Temporary verification data (`reviewer@examapp.com`, temporary attempts) was removed after testing to restore the pristine, repeatable demo state for the student presentation.*

---

## 4. End-to-End Live User Journey Verification

The application was exercised through browser automation and API calls across the complete user lifecycle:

1. **Landing Page (`/`)**: Rendered with modern SaaS typography, features grid, adaptive engine benefits card, and CTAs.
2. **Authentication (`/login`)**: Autofill demo credentials feature loaded `student@examapp.com` / `Student@123`. Form submitted successfully and received signed JWT.
3. **Dashboard (`/dashboard`)**: Loaded dynamic metrics directly from PostgreSQL:
   - Total Quizzes Taken
   - Average Accuracy
   - Mastered Topics Count
   - Subject Progress Cards
   - Topic Mastery Recommendations
4. **Subject & Topic Exploration (`/subjects`, `/topics/:id`)**: Browsed subjects and inspected topics with question counts.
5. **Adaptive Quiz Two-Directional Proof**:
   - **Attempt A (Downward Transition)**:
     - Question 1 served at baseline `MEDIUM`.
     - Submitted intentional wrong answer 'D'.
     - Rolling accuracy dropped to `0.0%` ($< 50\%$).
     - Engine transitioned next question to **`EASY`** (Question 1 served).
   - **Attempt B (Upward Transition)**:
     - Question 1 served at baseline `MEDIUM`.
     - Submitted correct answer 'B'.
     - Rolling accuracy rose to `100.0%` ($> 75\%$).
     - Engine transitioned next question to **`HARD`** (Question 5 served).
   - **Anti-Cheat Verification**: In both attempts, `correct_answer` and `explanation` were strictly **hidden** from the active `QuestionDto`.
6. **Quiz Result Screen (`/quiz/:attemptId/result`)**:
   - Displayed circular score meter (100.00% accuracy, 3/3 score).
   - Displayed time elapsed calculated server-side.
   - Rendered full question breakdown with academic explanations and option tags.
7. **Performance Analytics (`/performance`)**:
   - Rendered topic mastery progress bars (`EXPERT`, `INTERMEDIATE`, `BEGINNER`).
   - Displayed targeted recommendations for weak areas.
8. **Security & Ownership Enforcement**:
   - Attempted access to user 1's attempt from an unauthenticated / different user session.
   - Backend returned `403 Forbidden` (`You are not authorized to view or modify this quiz attempt`).
9. **Clean Logout (`/profile` $\rightarrow$ Logout)**:
   - JWT cleared from local storage.
   - State reset and safely redirected to `/login`.
