# Entity-Relationship (ER) Diagram

**Project**: Exam Preparation App With Adaptive Quizzes  
**Database**: PostgreSQL 18  

---

## 1. Visual Mermaid ER Diagram

```mermaid
erDiagram
    users ||--o{ quiz_attempts : "attempts"
    users ||--o{ performance : "tracks"
    subjects ||--o{ topics : "contains"
    subjects ||--o{ quiz_attempts : "categorizes"
    topics ||--o{ questions : "contains"
    topics ||--o{ quiz_attempts : "targets"
    topics ||--o{ performance : "evaluates"
    quiz_attempts ||--o{ student_answers : "records"
    questions ||--o{ student_answers : "answers"

    users {
        bigint user_id PK
        varchar name
        varchar email UK
        varchar password
        varchar role
        timestamp created_at
        timestamp updated_at
    }

    subjects {
        bigint subject_id PK
        varchar subject_name UK
        text description
        varchar icon
        timestamp created_at
    }

    topics {
        bigint topic_id PK
        bigint subject_id FK
        varchar topic_name
        text description
        timestamp created_at
    }

    questions {
        bigint question_id PK
        bigint topic_id FK
        text question_text
        varchar option_a
        varchar option_b
        varchar option_c
        varchar option_d
        varchar correct_answer
        varchar difficulty
        integer marks
        text explanation
        timestamp created_at
    }

    quiz_attempts {
        bigint attempt_id PK
        bigint user_id FK
        bigint subject_id FK
        bigint topic_id FK
        integer total_questions
        integer correct_answers
        integer wrong_answers
        decimal score
        decimal accuracy
        integer time_taken
        varchar starting_difficulty
        varchar final_difficulty
        varchar status
        timestamp started_at
        timestamp completed_at
    }

    student_answers {
        bigint answer_id PK
        bigint attempt_id FK
        bigint question_id FK
        varchar selected_answer
        boolean is_correct
        integer response_time
        varchar question_difficulty
        timestamp answered_at
    }

    performance {
        bigint performance_id PK
        bigint user_id FK
        bigint topic_id FK
        integer total_attempts
        integer total_questions
        integer correct_answers
        integer wrong_answers
        decimal accuracy
        decimal average_response_time
        varchar current_level
        timestamp last_attempted_at
        timestamp updated_at
    }
```

---

## 2. Cardinality & Relationships

| Source Entity | Target Entity | Cardinality | Relationship Description |
|---|---|---|---|
| `users` | `quiz_attempts` | $1 : N$ | One student can take multiple quiz attempts. |
| `users` | `performance` | $1 : N$ | One student has a performance record for each attempted topic. |
| `subjects` | `topics` | $1 : N$ | One subject groups multiple academic topics. |
| `topics` | `questions` | $1 : N$ | One topic contains multiple questions partitioned by difficulty. |
| `quiz_attempts` | `student_answers` | $1 : N$ | One attempt records a sequential set of student question answers. |
| `questions` | `student_answers` | $1 : N$ | A question can be answered across multiple student quiz attempts. |
| `topics` | `performance` | $1 : N$ | A topic tracks performance across various students. |
