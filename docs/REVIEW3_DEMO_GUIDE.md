# Project Review–3 Live Demonstration Guide

**Project**: Exam Preparation App With Adaptive Quizzes  
**Stack**: React.js + Spring Boot 3 + PostgreSQL 18 + Spring Security / JWT  

---

## 1. PRE-DEMO SETUP CHECKLIST (Do this 5 minutes before review)

1. **Verify PostgreSQL is running**:
   ```powershell
   Get-Service postgresql-x64-18
   ```
2. **Start Spring Boot Backend** (Terminal 1):
   ```powershell
   cd backend
   $env:JAVA_HOME = "C:\Users\dell9\.jdks\openjdk-24.0.1"
   & "C:\Program Files\JetBrains\IntelliJ IDEA Community Edition 2025.1.3\plugins\maven\lib\maven3\bin\mvn.cmd" spring-boot:run
   ```
   *Expected URL*: `http://localhost:8080`
3. **Start React Frontend** (Terminal 2):
   ```powershell
   cd frontend
   npm run dev
   ```
   *Expected URL*: `http://localhost:5173`
4. **Open Browser**: Navigate to `http://localhost:5173`.
5. **Open VS Code**: Have the project folder open with tabs pre-staged according to `VSCODE_CODE_GUIDE.md`.

---

## 2. LIVE DEMONSTRATION SCRIPT (Step-by-Step)

### STEP 1: Landing Page & Login
1. Open `http://localhost:5173`.
2. Point out:
   - Educational design aesthetic with clean typography (Outfit/Inter), indigo accents, and subtle elevations.
   - Demo Credentials banner prominently displaying `student@examapp.com` / `Student@123`.
3. Click **"Login"** (or click **"Auto-Fill Review Demo Credentials"** on the login card).
4. Click **"Sign In"**.
   - Explain: *"Spring Boot authenticates credentials via BCrypt and issues a signed JWT token stored in browser localStorage."*

### STEP 2: Student Dashboard
1. The app redirects to `/dashboard`.
2. Show the welcome header: *"Welcome back, Chandrakanth 👋"*.
3. Highlight the 4 Stat Cards:
   - **Quizzes Completed**
   - **Average Accuracy**
   - **Questions Answered**
   - **Current Learning Level**
4. Explain: *"All numbers shown here are derived in real-time from PostgreSQL queries—nothing is hardcoded or mocked."*
5. Show the **Smart Practice Recommendations** box suggesting topics with accuracy below 60%.

### STEP 3: Explore Curriculum (Subjects & Topics)
1. In the sidebar, click **"Curriculum & Subjects"**.
2. Show the 6 core computer science subjects:
   - Database Management Systems (4 topics)
   - Java Programming (4 topics)
   - Data Structures (4 topics)
   - Operating Systems (3 topics)
   - Computer Networks (3 topics)
   - Software Engineering (2 topics)
3. Click **"Explore Topics"** on **Database Management Systems**.
4. Show the topic list: *SQL & Relational Queries*, *Normalization*, *Transactions*, *Indexing*.

### STEP 4: Launch Adaptive Quiz
1. Click **"Start Adaptive Quiz"** on **SQL & Relational Queries**.
2. Show the **Pre-Quiz Briefing Screen**:
   - Total questions: 5
   - Starting difficulty: MEDIUM
   - Explanation of the adaptive rules.
3. Click **"Start Practice Quiz Now"**.

### STEP 5: Demonstrate Adaptive Question Calibration (Two-Attempt Method)

To make the adaptive concept immediately obvious to faculty, demonstrate **both directions** using two short attempts:

#### Attempt A: Demonstrating Downward Calibration (`MEDIUM` → `EASY`)
1. Start quiz on **SQL & Relational Queries**.
2. **Question 1**: Point out the badge: **MEDIUM**.
3. Deliberately select an **incorrect answer** (e.g. choice D) and click **"Submit Answer"**.
4. Point out the feedback banner:
   - Rolling Accuracy drops to `0.0%` ($< 50\%$).
   - The engine calculates: *"Accuracy < 50% → Step down to EASY"*.
5. Click **"Next Question"**:
   - Show how Question 2's badge is now **EASY**!
6. Click **"Finish Exam Now"** to conclude Attempt A.

#### Attempt B: Demonstrating Upward Calibration (`MEDIUM` → `HARD`)
1. Click **"Practice Topic Again"** or start a new quiz on the same topic.
2. **Question 1**: Point out that it starts again at baseline **MEDIUM**.
3. Select the **correct answer** (e.g. choice B: `UNION removes duplicate rows...`) and click **"Submit Answer"**.
4. Point out the feedback banner:
   - Rolling Accuracy is `100.0%` ($> 75\%$).
   - The engine calculates: *"Accuracy > 75% → Elevate to HARD"*.
5. Click **"Next Question"**:
   - Show how Question 2's badge is now **HARD**!
6. Faculty can now clearly see that the difficulty is dynamically calculated from actual student accuracy in both directions.

### STEP 6: Quiz Completion & Results
1. On the final question, click **"Finish Quiz & View Results"**.
2. Show the comprehensive results screen:
   - Total Score (e.g. 4 / 5)
   - Accuracy % (e.g. 80%)
   - Session duration (e.g. 1m 45s calculated from backend timestamps)
   - Performance tier ("Strong")
   - Next Recommended Difficulty (e.g. "HARD")
3. Scroll to **Question Breakdown & Solutions**:
   - Correct answers and student answers are now revealed.
   - Show the academic explanation for each question.

### STEP 7: Performance Analytics
1. Click **"View Performance Analytics"** in the results header.
2. Point out:
   - Cumulative accuracy progress bars for each topic.
   - Status indicators (*"Strong"* vs *"Needs Practice"*).
   - Dynamic practice recommendations.

### STEP 8: Code Walkthrough in VS Code
Follow the exact file sequence in [VSCODE_CODE_GUIDE.md](file:///c:/Users/dell9/OneDrive/Desktop/ram/docs/VSCODE_CODE_GUIDE.md).
- Frontend: `Dashboard.jsx`, `Quiz.jsx`, `QuizResult.jsx`, `axiosClient.js`
- Backend: `QuizController.java`, `AdaptiveQuizService.java`, `QuizService.java`, `SecurityConfig.java`
- Database: `01_schema.sql`, `02_sample_data.sql`, `03_indexes.sql`, JPA entities

### STEP 9: Database Verification & Postman
1. Run query from terminal demonstrating new records in `quiz_attempts` and `student_answers`.
2. Open Postman collection to show API testing.
