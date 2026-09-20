-- ============================================================
-- EXAM PREPARATION APP WITH ADAPTIVE QUIZZES
-- Database Schema Definition (PostgreSQL 18)
-- Review-3 Artifact
-- ============================================================

-- Drop tables in reverse dependency order for clean recreation
DROP TABLE IF EXISTS performance CASCADE;
DROP TABLE IF EXISTS student_answers CASCADE;
DROP TABLE IF EXISTS quiz_attempts CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS topics CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ------------------------------------------------------------
-- 1. USERS TABLE
-- Stores authenticated student and admin credentials and roles
-- ------------------------------------------------------------
CREATE TABLE users (
    user_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'STUDENT' CHECK (role IN ('STUDENT', 'ADMIN')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 2. SUBJECTS TABLE
-- Core academic subjects (DBMS, Java, Data Structures, OS, etc.)
-- ------------------------------------------------------------
CREATE TABLE subjects (
    subject_id BIGSERIAL PRIMARY KEY,
    subject_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50) DEFAULT 'book',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 3. TOPICS TABLE
-- Granular knowledge topics grouped under parent subjects
-- ------------------------------------------------------------
CREATE TABLE topics (
    topic_id BIGSERIAL PRIMARY KEY,
    subject_id BIGINT NOT NULL,
    topic_name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_topic_subject FOREIGN KEY (subject_id) 
        REFERENCES subjects(subject_id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- 4. QUESTIONS TABLE
-- Question repository categorized by topic and difficulty tier
-- (EASY, MEDIUM, HARD) for the adaptive quiz engine
-- ------------------------------------------------------------
CREATE TABLE questions (
    question_id BIGSERIAL PRIMARY KEY,
    topic_id BIGINT NOT NULL,
    question_text TEXT NOT NULL,
    option_a VARCHAR(500) NOT NULL,
    option_b VARCHAR(500) NOT NULL,
    option_c VARCHAR(500) NOT NULL,
    option_d VARCHAR(500) NOT NULL,
    correct_answer VARCHAR(10) NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
    difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD')),
    marks INTEGER DEFAULT 1 CHECK (marks > 0),
    explanation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_question_topic FOREIGN KEY (topic_id) 
        REFERENCES topics(topic_id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- 5. QUIZ_ATTEMPTS TABLE
-- Tracks individual quiz test sessions and aggregate scores
-- ------------------------------------------------------------
CREATE TABLE quiz_attempts (
    attempt_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    subject_id BIGINT,
    topic_id BIGINT,
    total_questions INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    wrong_answers INTEGER DEFAULT 0,
    score DECIMAL(5,2) DEFAULT 0.00,
    accuracy DECIMAL(5,2) DEFAULT 0.00,
    time_taken INTEGER DEFAULT 0, -- elapsed time in seconds
    starting_difficulty VARCHAR(20) DEFAULT 'MEDIUM' CHECK (starting_difficulty IN ('EASY', 'MEDIUM', 'HARD')),
    final_difficulty VARCHAR(20) CHECK (final_difficulty IS NULL OR final_difficulty IN ('EASY', 'MEDIUM', 'HARD')),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'IN_PROGRESS' CHECK (status IN ('IN_PROGRESS', 'COMPLETED', 'ABANDONED')),
    CONSTRAINT fk_attempt_user FOREIGN KEY (user_id) 
        REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_attempt_subject FOREIGN KEY (subject_id) 
        REFERENCES subjects(subject_id) ON DELETE SET NULL,
    CONSTRAINT fk_attempt_topic FOREIGN KEY (topic_id) 
        REFERENCES topics(topic_id) ON DELETE SET NULL
);

-- ------------------------------------------------------------
-- 6. STUDENT_ANSWERS TABLE
-- Records each student response during a quiz attempt
-- Feeds the real-time adaptive engine for difficulty adjustment
-- ------------------------------------------------------------
CREATE TABLE student_answers (
    answer_id BIGSERIAL PRIMARY KEY,
    attempt_id BIGINT NOT NULL,
    question_id BIGINT NOT NULL,
    selected_answer VARCHAR(10) CHECK (selected_answer IS NULL OR selected_answer IN ('A', 'B', 'C', 'D')),
    is_correct BOOLEAN NOT NULL,
    response_time INTEGER DEFAULT 0, -- seconds taken to answer question
    question_difficulty VARCHAR(20) CHECK (question_difficulty IN ('EASY', 'MEDIUM', 'HARD')),
    answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_answer_attempt FOREIGN KEY (attempt_id) 
        REFERENCES quiz_attempts(attempt_id) ON DELETE CASCADE,
    CONSTRAINT fk_answer_question FOREIGN KEY (question_id) 
        REFERENCES questions(question_id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- 7. PERFORMANCE TABLE
-- Cumulative topic-level learning mastery and weak-topic tracker
-- ------------------------------------------------------------
CREATE TABLE performance (
    performance_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    topic_id BIGINT NOT NULL,
    total_attempts INTEGER DEFAULT 0,
    total_questions INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    wrong_answers INTEGER DEFAULT 0,
    accuracy DECIMAL(5,2) DEFAULT 0.00,
    average_response_time DECIMAL(5,2) DEFAULT 0.00,
    current_level VARCHAR(20) DEFAULT 'BEGINNER' CHECK (current_level IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT')),
    last_attempted_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_perf_user FOREIGN KEY (user_id) 
        REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_perf_topic FOREIGN KEY (topic_id) 
        REFERENCES topics(topic_id) ON DELETE CASCADE,
    CONSTRAINT uq_user_topic UNIQUE (user_id, topic_id)
);
