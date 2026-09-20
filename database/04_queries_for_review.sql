-- ============================================================
-- EXAM PREPARATION APP WITH ADAPTIVE QUIZZES
-- Demonstration Queries for Project Review-3
-- ============================================================

-- ------------------------------------------------------------
-- 1. BASE TABLE INSPECTIONS
-- ------------------------------------------------------------

-- Check all registered users (passwords remain BCrypt-hashed)
SELECT user_id, name, email, role, created_at FROM users;

-- View all academic subjects
SELECT subject_id, subject_name, icon, created_at FROM subjects;

-- View all topics under their parent subjects
SELECT t.topic_id, s.subject_name, t.topic_name, t.description 
FROM topics t
JOIN subjects s ON t.subject_id = s.subject_id
ORDER BY s.subject_name, t.topic_name;

-- Count questions per difficulty tier across each topic
SELECT 
    s.subject_name,
    t.topic_name,
    q.difficulty,
    COUNT(q.question_id) AS question_count
FROM questions q
JOIN topics t ON q.topic_id = t.topic_id
JOIN subjects s ON t.subject_id = s.subject_id
GROUP BY s.subject_name, t.topic_name, q.difficulty
ORDER BY s.subject_name, t.topic_name, 
    CASE q.difficulty 
        WHEN 'EASY' THEN 1 
        WHEN 'MEDIUM' THEN 2 
        WHEN 'HARD' THEN 3 
    END;

-- Total question inventory summary
SELECT difficulty, COUNT(*) AS total_questions
FROM questions
GROUP BY difficulty;

-- ------------------------------------------------------------
-- 2. QUIZ ATTEMPTS & STUDENT ANSWERS
-- ------------------------------------------------------------

-- Inspect all quiz attempts with student details and results
SELECT 
    qa.attempt_id,
    u.name AS student_name,
    s.subject_name,
    t.topic_name,
    qa.total_questions,
    qa.correct_answers,
    qa.wrong_answers,
    qa.score,
    qa.accuracy || '%' AS accuracy,
    qa.time_taken || 's' AS duration,
    qa.starting_difficulty,
    qa.final_difficulty,
    qa.status,
    qa.started_at
FROM quiz_attempts qa
JOIN users u ON qa.user_id = u.user_id
LEFT JOIN subjects s ON qa.subject_id = s.subject_id
LEFT JOIN topics t ON qa.topic_id = t.topic_id
ORDER BY qa.started_at DESC;

-- Demonstrate adaptive progression:
-- View how question difficulty adjusted dynamically during an attempt
SELECT 
    sa.attempt_id,
    sa.answer_id,
    sa.question_difficulty,
    q.question_text,
    sa.selected_answer,
    q.correct_answer,
    sa.is_correct,
    sa.response_time || 's' AS response_time,
    sa.answered_at
FROM student_answers sa
JOIN questions q ON sa.question_id = q.question_id
WHERE sa.attempt_id = 1
ORDER BY sa.answer_id ASC;

-- ------------------------------------------------------------
-- 3. PERFORMANCE & LEARNING MASTERY ANALYTICS
-- ------------------------------------------------------------

-- Student topic-wise mastery and learning level
SELECT 
    u.name AS student_name,
    s.subject_name,
    t.topic_name,
    p.total_attempts,
    p.total_questions,
    p.correct_answers,
    p.wrong_answers,
    p.accuracy || '%' AS accuracy,
    p.average_response_time || 's' AS avg_response_time,
    p.current_level,
    p.last_attempted_at
FROM performance p
JOIN users u ON p.user_id = u.user_id
JOIN topics t ON p.topic_id = t.topic_id
JOIN subjects s ON t.subject_id = s.subject_id
ORDER BY u.name, p.accuracy ASC;

-- Identify Weak Topics (Accuracy < 60%) for recommendation generation
SELECT 
    u.name,
    t.topic_name,
    p.accuracy || '%' AS accuracy,
    'Practice Recommended: Topic accuracy below 60%' AS recommendation
FROM performance p
JOIN users u ON p.user_id = u.user_id
JOIN topics t ON p.topic_id = t.topic_id
WHERE p.accuracy < 60.00;

-- Identify Strong Topics (Accuracy > 80%)
SELECT 
    u.name,
    t.topic_name,
    p.accuracy || '%' AS accuracy,
    p.current_level
FROM performance p
JOIN users u ON p.user_id = u.user_id
JOIN topics t ON p.topic_id = t.topic_id
WHERE p.accuracy >= 80.00;
