-- ============================================================
-- EXAM PREPARATION APP WITH ADAPTIVE QUIZZES
-- Database Performance Indexes (PostgreSQL 18)
-- Review-3 Artifact
-- ============================================================

-- Fast lookup for user authentication by email
CREATE INDEX IF NOT EXISTS idx_users_email 
    ON users(email);

-- Fast retrieval of all topics for a given subject
CREATE INDEX IF NOT EXISTS idx_topics_subject_id 
    ON topics(subject_id);

-- Composite index optimized for the Adaptive Quiz Engine:
-- Enables immediate filtering of unasked questions by topic and target difficulty
CREATE INDEX IF NOT EXISTS idx_questions_topic_difficulty 
    ON questions(topic_id, difficulty);

-- Fast retrieval of quiz history and statistics for a specific student
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id 
    ON quiz_attempts(user_id);

-- Index for retrieving all answered questions in an attempt during calculation & review
CREATE INDEX IF NOT EXISTS idx_student_answers_attempt_id 
    ON student_answers(attempt_id);

-- Composite index for fast topic mastery updates and performance analytics lookups
CREATE INDEX IF NOT EXISTS idx_performance_user_topic 
    ON performance(user_id, topic_id);
