# Database Architecture & Relational Design Explanation

## 1. Database Architecture Overview
The **Exam Preparation App** utilizes **PostgreSQL 18** as its authoritative primary database (`exam_prep_db`). The schema is designed following strict **3NF (Third Normal Form)** principles, preventing data redundancy while guaranteeing relational integrity through primary keys, foreign keys with `ON DELETE CASCADE`, unique constraints, check constraints, and targeted indexes.

---

## 2. Table Specifications & Constraints

### 1. `users`
- Stores student and administrator credentials and profile data.
- **Columns**: `id` (BIGSERIAL PK), `name` (VARCHAR 100), `email` (VARCHAR 150 UNIQUE NOT NULL), `password` (VARCHAR 255 NOT NULL - BCrypt hash), `role` (VARCHAR 20 DEFAULT 'STUDENT'), `created_at` (TIMESTAMPTZ), `updated_at` (TIMESTAMPTZ).
- **Constraints**: `chk_users_role`: `role IN ('STUDENT', 'ADMIN')`.

### 2. `subjects`
- Academic course domains (e.g., Computer Science, Mathematics, Physics).
- **Columns**: `id` (BIGSERIAL PK), `name` (VARCHAR 100 UNIQUE NOT NULL), `description` (TEXT), `icon` (VARCHAR 50), `created_at` (TIMESTAMPTZ).

### 3. `topics`
- Specific learning modules within a subject.
- **Columns**: `id` (BIGSERIAL PK), `subject_id` (BIGINT FK -> `subjects(id)` ON DELETE CASCADE), `name` (VARCHAR 150 NOT NULL), `description` (TEXT), `created_at` (TIMESTAMPTZ).
- **Constraints**: `uq_topics_subject_name`: UNIQUE (`subject_id`, `name`).

### 4. `questions`
- Question repository with multiple difficulty tiers.
- **Columns**: `id` (BIGSERIAL PK), `topic_id` (BIGINT FK -> `topics(id)` ON DELETE CASCADE), `question_text` (TEXT NOT NULL), `option_a` (TEXT NOT NULL), `option_b` (TEXT NOT NULL), `option_c` (TEXT NOT NULL), `option_d` (TEXT NOT NULL), `correct_answer` (CHAR(1) NOT NULL), `difficulty` (VARCHAR 10 NOT NULL), `explanation` (TEXT), `marks` (INT DEFAULT 1), `created_at` (TIMESTAMPTZ).
- **Constraints**:
  - `chk_questions_correct_answer`: `correct_answer IN ('A', 'B', 'C', 'D')`.
  - `chk_questions_difficulty`: `difficulty IN ('EASY', 'MEDIUM', 'HARD')`.

### 5. `quiz_attempts`
- Records user quiz sessions.
- **Columns**: `id` (BIGSERIAL PK), `user_id` (BIGINT FK -> `users(id)` ON DELETE CASCADE), `topic_id` (BIGINT FK -> `topics(id)` ON DELETE CASCADE), `total_questions` (INT DEFAULT 0), `correct_answers` (INT DEFAULT 0), `score` (INT DEFAULT 0), `accuracy` (DECIMAL(5,2) DEFAULT 0.00), `status` (VARCHAR 20 DEFAULT 'IN_PROGRESS'), `started_at` (TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP), `completed_at` (TIMESTAMPTZ).
- **Constraints**: `chk_quiz_attempts_status`: `status IN ('IN_PROGRESS', 'COMPLETED')`.

### 6. `student_answers`
- Per-question response log in an attempt.
- **Columns**: `id` (BIGSERIAL PK), `attempt_id` (BIGINT FK -> `quiz_attempts(id)` ON DELETE CASCADE), `question_id` (BIGINT FK -> `questions(id)` ON DELETE CASCADE), `selected_answer` (CHAR(1) NOT NULL), `is_correct` (BOOLEAN NOT NULL), `response_time_seconds` (INT DEFAULT 0), `created_at` (TIMESTAMPTZ).
- **Constraints**:
  - `chk_student_answers_selected`: `selected_answer IN ('A', 'B', 'C', 'D')`.
  - `uq_student_answers_attempt_question`: UNIQUE (`attempt_id`, `question_id`) to prevent answering the same question twice in one session.

### 7. `performance`
- Historical student mastery table aggregated per topic.
- **Columns**: `id` (BIGSERIAL PK), `user_id` (BIGINT FK -> `users(id)` ON DELETE CASCADE), `topic_id` (BIGINT FK -> `topics(id)` ON DELETE CASCADE), `total_attempts` (INT DEFAULT 0), `total_questions_answered` (INT DEFAULT 0), `total_correct_answers` (INT DEFAULT 0), `average_accuracy` (DECIMAL(5,2) DEFAULT 0.00), `mastery_level` (VARCHAR 20 DEFAULT 'LEARNING'), `last_attempt_date` (TIMESTAMPTZ), `updated_at` (TIMESTAMPTZ).
- **Constraints**:
  - `uq_performance_user_topic`: UNIQUE (`user_id`, `topic_id`).
  - `chk_performance_mastery`: `mastery_level IN ('LEARNING', 'PROFICIENT', 'MASTERED')`.

---

## 3. Indexing Strategy (`database/03_indexes.sql`)
1. `idx_users_email` ON `users(email)`: Fast $O(\log N)$ lookup during JWT authentication and login.
2. `idx_topics_subject_id` ON `topics(subject_id)`: Quick filtering of topics when a student selects a subject.
3. `idx_questions_topic_difficulty` ON `questions(topic_id, difficulty)`: Composite B-Tree index specifically accelerating the adaptive engine's difficulty-based question selection queries.
4. `idx_quiz_attempts_user_id` ON `quiz_attempts(user_id)`: Rapid retrieval of student quiz history and dashboard analytics.
5. `idx_student_answers_attempt_id` ON `student_answers(attempt_id)`: Fast aggregation of question reviews and accuracy calculation.
6. `idx_performance_user_topic` ON `performance(user_id, topic_id)`: Instant retrieval of student topic mastery and progress.

---

## 4. Sample Review Queries (`database/04_queries_for_review.sql`)
The database review script provides pre-tested queries demonstrating:
- Overall student accuracy across subjects.
- Student topic mastery status with attempt counts.
- Real-time difficulty distribution of questions per topic.
- Full quiz attempt review showing question prompts, student choices, correct answers, and response times.
