# Database Design & Architecture Specification

**Project**: Exam Preparation App With Adaptive Quizzes  
**Database Engine**: PostgreSQL 18  
**Architecture Review**: Project Review–3

---

## 1. Executive Summary & Design Rationale

The relational database schema is engineered specifically for an **Adaptive Learning Management System (LMS)**. The architecture prioritizes:
1. **Third Normal Form (3NF) & BCNF Compliance**: Zero redundant data anomalies, strict foreign key references, and functional dependency isolation.
2. **Deterministic Adaptive Question Selection**: Low-latency retrieval of unattempted questions filtered by topic and difficulty (`EASY`, `MEDIUM`, `HARD`) via composite B-Tree indexes.
3. **Auditability & Quiz Integrity**: Separation of raw student submissions (`student_answers`) from aggregated test sessions (`quiz_attempts`) and longitudinal learning mastery (`performance`).
4. **Data Security**: BCrypt password hashing, role checks (`STUDENT`, `ADMIN`), and answer privacy.

---

## 2. Relational Schema Definition

### 2.1 Table: `users`
Stores student and administrator credentials.
- `user_id` (`BIGSERIAL PRIMARY KEY`): Unique surrogate identifier.
- `name` (`VARCHAR(100) NOT NULL`): Student full name.
- `email` (`VARCHAR(150) UNIQUE NOT NULL`): Login credential, indexed for fast authentication.
- `password` (`VARCHAR(255) NOT NULL`): Salted BCrypt password hash (never stored in plaintext).
- `role` (`VARCHAR(20) NOT NULL DEFAULT 'STUDENT'`): Role check constraint (`'STUDENT'`, `'ADMIN'`).
- `created_at`, `updated_at` (`TIMESTAMP DEFAULT CURRENT_TIMESTAMP`): Audit timestamps.

### 2.2 Table: `subjects`
Academic course disciplines.
- `subject_id` (`BIGSERIAL PRIMARY KEY`): Unique identifier.
- `subject_name` (`VARCHAR(100) UNIQUE NOT NULL`): Descriptive title (e.g., DBMS, Java, OS).
- `description` (`TEXT`): Overview of the subject syllabus.
- `icon` (`VARCHAR(50)`): Frontend icon mapping identifier.
- `created_at` (`TIMESTAMP DEFAULT CURRENT_TIMESTAMP`).

### 2.3 Table: `topics`
Specific curriculum modules belonging to a parent subject.
- `topic_id` (`BIGSERIAL PRIMARY KEY`): Unique identifier.
- `subject_id` (`BIGINT NOT NULL REFERENCES subjects(subject_id) ON DELETE CASCADE`): Foreign key.
- `topic_name` (`VARCHAR(100) NOT NULL`): Name of the topic (e.g., "SQL & Relational Queries").
- `description` (`TEXT`): Topic coverage details.
- `created_at` (`TIMESTAMP DEFAULT CURRENT_TIMESTAMP`).

### 2.4 Table: `questions`
Question bank with adaptive difficulty tiers.
- `question_id` (`BIGSERIAL PRIMARY KEY`): Unique identifier.
- `topic_id` (`BIGINT NOT NULL REFERENCES topics(topic_id) ON DELETE CASCADE`): Parent topic reference.
- `question_text` (`TEXT NOT NULL`): Academic question problem statement.
- `option_a`, `option_b`, `option_c`, `option_d` (`VARCHAR(500) NOT NULL`): Multiple choice options.
- `correct_answer` (`VARCHAR(10) NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D'))`): Answer key.
- `difficulty` (`VARCHAR(20) NOT NULL CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD'))`): Difficulty tier.
- `marks` (`INTEGER DEFAULT 1 CHECK (marks > 0)`): Question weight.
- `explanation` (`TEXT`): Educational rationale revealed only upon quiz completion.
- `created_at` (`TIMESTAMP DEFAULT CURRENT_TIMESTAMP`).

### 2.5 Table: `quiz_attempts`
Records full quiz test sessions.
- `attempt_id` (`BIGSERIAL PRIMARY KEY`): Unique session identifier.
- `user_id` (`BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE`): Student owner.
- `subject_id` (`BIGINT REFERENCES subjects(subject_id) ON DELETE SET NULL`).
- `topic_id` (`BIGINT REFERENCES topics(topic_id) ON DELETE SET NULL`).
- `total_questions` (`INTEGER DEFAULT 0`): Total items in attempt.
- `correct_answers` (`INTEGER DEFAULT 0`): Count of correct answers.
- `wrong_answers` (`INTEGER DEFAULT 0`): Count of incorrect answers.
- `score` (`DECIMAL(5,2) DEFAULT 0.00`): Weighted score earned.
- `accuracy` (`DECIMAL(5,2) DEFAULT 0.00`): Percentage accuracy: $(Correct / Total) \times 100$.
- `time_taken` (`INTEGER DEFAULT 0`): Total elapsed duration in seconds.
- `starting_difficulty` (`VARCHAR(20) DEFAULT 'MEDIUM' CHECK (starting_difficulty IN ('EASY', 'MEDIUM', 'HARD'))`).
- `final_difficulty` (`VARCHAR(20) CHECK (final_difficulty IS NULL OR final_difficulty IN ('EASY', 'MEDIUM', 'HARD'))`).
- `started_at` (`TIMESTAMP DEFAULT CURRENT_TIMESTAMP`).
- `completed_at` (`TIMESTAMP`): Nullable while quiz is `IN_PROGRESS`.
- `status` (`VARCHAR(20) DEFAULT 'IN_PROGRESS' CHECK (status IN ('IN_PROGRESS', 'COMPLETED', 'ABANDONED'))`).

### 2.6 Table: `student_answers`
Granular per-question audit log within an attempt.
- `answer_id` (`BIGSERIAL PRIMARY KEY`): Unique response identifier.
- `attempt_id` (`BIGINT NOT NULL REFERENCES quiz_attempts(attempt_id) ON DELETE CASCADE`): Session FK.
- `question_id` (`BIGINT NOT NULL REFERENCES questions(question_id) ON DELETE CASCADE`): Question FK.
- `selected_answer` (`VARCHAR(10) CHECK (selected_answer IS NULL OR selected_answer IN ('A', 'B', 'C', 'D'))`).
- `is_correct` (`BOOLEAN NOT NULL`): Evaluation flag.
- `response_time` (`INTEGER DEFAULT 0`): Seconds spent on this specific question.
- `question_difficulty` (`VARCHAR(20) CHECK (question_difficulty IN ('EASY', 'MEDIUM', 'HARD'))`).
- `answered_at` (`TIMESTAMP DEFAULT CURRENT_TIMESTAMP`).

### 2.7 Table: `performance`
Cumulative student topic mastery and weakness tracker.
- `performance_id` (`BIGSERIAL PRIMARY KEY`): Unique metric identifier.
- `user_id` (`BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE`): Student FK.
- `topic_id` (`BIGINT NOT NULL REFERENCES topics(topic_id) ON DELETE CASCADE`): Topic FK.
- `total_attempts` (`INTEGER DEFAULT 0`): Cumulative count of completed quizzes.
- `total_questions` (`INTEGER DEFAULT 0`): Cumulative answered items.
- `correct_answers` (`INTEGER DEFAULT 0`): Cumulative correct items.
- `wrong_answers` (`INTEGER DEFAULT 0`): Cumulative incorrect items.
- `accuracy` (`DECIMAL(5,2) DEFAULT 0.00`): Cumulative mastery percentage.
- `average_response_time` (`DECIMAL(5,2) DEFAULT 0.00`): Average seconds per answer.
- `current_level` (`VARCHAR(20) DEFAULT 'BEGINNER' CHECK (current_level IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'))`).
- `last_attempted_at` (`TIMESTAMP`).
- `updated_at` (`TIMESTAMP DEFAULT CURRENT_TIMESTAMP`).
- `CONSTRAINT uq_user_topic UNIQUE (user_id, topic_id)`.

---

## 3. Database Indexes & Query Optimization Strategy

1. `idx_users_email`: `ON users(email)` - Fast B-Tree lookup for login requests ($O(\log N)$).
2. `idx_topics_subject_id`: `ON topics(subject_id)` - Fast sub-tree fetch when a student selects a subject card.
3. `idx_questions_topic_difficulty`: `ON questions(topic_id, difficulty)` - Composite index powering the Adaptive Engine to rapidly fetch candidate questions matching calculated difficulty without table scans.
4. `idx_quiz_attempts_user_id`: `ON quiz_attempts(user_id)` - Instant retrieval of past quizzes on the student dashboard.
5. `idx_student_answers_attempt_id`: `ON student_answers(attempt_id)` - Rapid assembly of question breakdown during result screen rendering.
6. `idx_performance_user_topic`: `ON performance(user_id, topic_id)` - Composite index for instant update of mastery records.
