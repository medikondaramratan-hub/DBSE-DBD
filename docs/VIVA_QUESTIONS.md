# Project Review–3 Viva Questions & Expert Answers

Comprehensive preparation guide for faculty questions regarding the **Exam Preparation App With Adaptive Quizzes**.

---

### Q1: What is an Adaptive Quiz and how does it differ from a standard quiz?
**Answer**:
A standard quiz presents a static, fixed sequence of questions regardless of whether the student is struggling or finding the test too easy. An **Adaptive Quiz** dynamically analyzes student response accuracy in real time and automatically calibrates subsequent question difficulty. If the student struggles (rolling accuracy < 50%), the engine serves foundational EASY questions to build confidence; if the student excels (> 75%), it serves challenging HARD questions.

---

### Q2: Why did you choose PostgreSQL over MySQL or SQLite?
**Answer**:
1. **PostgreSQL** is an enterprise-grade, ACID-compliant object-relational database with superior support for complex queries, composite indexes, and strict CHECK constraints.
2. It handles concurrent reads and writes gracefully through Multi-Version Concurrency Control (MVCC).
3. Unlike SQLite (which is file-based and lacks multi-user client-server architecture), PostgreSQL is production-grade and compatible with standard tools like pgAdmin and Docker.

---

### Q3: Why Spring Boot for the backend?
**Answer**:
1. Spring Boot is an industry-standard Java framework offering robust architectural separation of concerns (Controller $\rightarrow$ Service $\rightarrow$ Repository).
2. It features seamless integration with **Spring Security** for enterprise authentication, **Spring Data JPA** for object-relational mapping, and built-in connection pooling via HikariCP.
3. Its dependency injection and inversion of control (IoC) make business logic testable and maintainable.

---

### Q4: Why React.js for the frontend?
**Answer**:
1. React utilizes a **Virtual DOM** for high performance and smooth re-rendering of active quiz states and timers without full-page reloads.
2. Its component-driven architecture allows reusable UI elements (e.g., DifficultyBadge, StatCard, ProgressBar).
3. The Single Page Application (SPA) architecture combined with React Router delivers an instantaneous, desktop-like user experience.

---

### Q5: What is a REST API?
**Answer**:
A REST (Representational State Transfer) API is an architectural style for network communication based on stateless, client-server protocols using standard HTTP methods:
- `GET`: Retrieve resources (e.g., `/api/subjects`, `/api/performance/me`)
- `POST`: Create resources or trigger state transitions (e.g., `/api/quizzes/start`, `/api/quizzes/{id}/answer`)
- `PUT`/`PATCH`: Update existing resources
- `DELETE`: Remove resources

---

### Q6: How does JWT authentication work in this application?
**Answer**:
1. Upon successful login, Spring Boot generates a digitally signed JSON Web Token (JWT) using HMAC-SHA512 containing the user's email, role, issued date, and expiration timestamp.
2. The React frontend stores this token and sends it in the HTTP header of every protected request: `Authorization: Bearer <token>`.
3. Our backend `JwtAuthenticationFilter` intercepts each request, verifies the signature, and sets the authentication context without querying the database for a session table (stateless authentication).

---

### Q7: Why use BCrypt for password storage instead of SHA-256 or MD5?
**Answer**:
1. Algorithms like MD5 and standard SHA-256 are fast hash functions, making them vulnerable to brute-force attacks and precomputed rainbow tables.
2. **BCrypt** includes an automatic cryptographic salt to prevent dictionary attacks and features an adjustable **work factor** (cost parameter), meaning it is intentionally computationally intensive to resist GPU cracking.

---

### Q8: What database normalization level did you achieve?
**Answer**:
The database is normalized to **Third Normal Form (3NF)** and **Boyce-Codd Normal Form (BCNF)**:
- **1NF**: All attributes contain atomic values; no multivalued groups.
- **2NF**: In 1NF and no non-prime attribute is partially dependent on any candidate key.
- **3NF**: In 2NF and transitive dependencies are eliminated (non-key attributes depend only on the primary key).

---

### Q9: How exactly is question difficulty changed during a quiz attempt?
**Answer**:
In `AdaptiveQuizService.java`:
1. Every quiz starts at the `MEDIUM` baseline.
2. After each submitted question, the engine calculates:
   $$\text{Rolling Accuracy} = \left(\frac{\text{Correct Responses}}{\text{Total Answered Questions}}\right) \times 100$$
3. Decision rules:
   - $\text{Accuracy} < 50.0\% \implies \text{EASY}$
   - $50.0\% \le \text{Accuracy} \le 75.0\% \implies \text{MEDIUM}$
   - $\text{Accuracy} > 75.0\% \implies \text{HARD}$
4. The engine executes a query excluding previously answered IDs in that attempt. If the target tier is depleted, it falls back deterministically to the nearest adjacent tier.

---

### Q10: How do you prevent students from cheating by inspecting the browser network tab?
**Answer**:
During an active quiz attempt, `QuestionDto` contains only:
- `questionId`, `questionText`, `optionA`, `optionB`, `optionC`, `optionD`, and `difficulty`.
It strictly **omits** `correctAnswer` and `explanation`. The evaluation happens entirely on the server within `QuizService.submitAnswer()`. Only after `finishQuiz()` is called does `QuizResultDto` reveal correct answers and explanations.

---

### Q11: What is Spring Data JPA and how does it relate to Hibernate?
**Answer**:
- **JPA (Java Persistence API)** is the standard Java specification for Object-Relational Mapping (ORM).
- **Hibernate** is the actual underlying implementation that translates Java object interactions into native SQL queries.
- **Spring Data JPA** is an abstraction layer that provides repository interfaces (`JpaRepository`) with automated CRUD query generation, eliminating boilerplate SQL queries.

---

### Q12: Why did you implement database indexes?
**Answer**:
Without indexes, the database must perform a full sequential table scan ($O(N)$). We created targeted B-Tree indexes:
1. `idx_users_email`: Instant lookups during student authentication ($O(\log N)$).
2. `idx_questions_topic_difficulty`: Composite index that allows the adaptive engine to instantly filter unasked questions by topic and difficulty tier.
3. `idx_quiz_attempts_user_id`: Fast retrieval of student attempt histories.

---

### Q13: What happens when a student submits an answer?
**Answer**:
1. The frontend sends `POST /api/quizzes/{attemptId}/answer` with `questionId`, `selectedAnswer`, and `responseTime`.
2. Backend verifies attempt ownership.
3. It compares `selectedAnswer` against `question.getCorrectAnswer()`.
4. Saves a new record in `student_answers`.
5. Calculates current rolling accuracy.
6. Calls `AdaptiveQuizService` to select the next difficulty tier and pre-fetches the next adaptive question.
7. Returns feedback and next question in a single atomic response.

---

### Q14: How is student performance calculated?
**Answer**:
In `PerformanceService.java`, after quiz completion:
- Accuracy: $(Total Correct / Total Answered) \times 100$
- Score: Sum of marks for correct questions.
- Average response time: Cumulative average seconds spent per question.
- Mastery Level:
  - $\ge 85\% \implies \text{EXPERT}$
  - $\ge 70\% \implies \text{ADVANCED}$
  - $\ge 50\% \implies \text{INTERMEDIATE}$
  - $< 50\% \implies \text{BEGINNER}$

---

### Q15: Why use Docker Compose in this project?
**Answer**:
Docker Compose provides containerized, environment-independent deployment for PostgreSQL and Redis with automated volume persistence and schema execution (`docker-entrypoint-initdb.d`), ensuring the exact same database setup runs on any machine without manual installation.

---

### Q16: How is Redis used and how does the fallback work?
**Answer**:
Redis caches subject and topic catalog queries (`/api/subjects`, `/api/subjects/{id}/topics`) to eliminate redundant database reads. To ensure zero presentation risk, our `CacheConfig.java` is architected so that if Redis is offline, Spring Boot seamlessly falls back to an in-memory `ConcurrentMapCacheManager`, guaranteeing that the application never crashes.
