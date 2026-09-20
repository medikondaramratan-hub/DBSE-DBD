# Backend Architecture & Technical Explanation

## 1. Architectural Overview
The backend of the **Exam Preparation App With Adaptive Quizzes** is engineered using **Spring Boot 3.3.6** targeting **Java 21**, following the industry-standard multi-tiered enterprise architecture:

```
[ HTTP Clients (React / Postman) ]
               │
               ▼
   [ Security Filter Chain ] ─── (JwtAuthenticationFilter & CustomUserDetailsService)
               │
               ▼
      [ Controller Layer ]   ─── (AuthController, QuizController, SubjectController, PerformanceController)
               │
               ▼
       [ Service Layer ]     ─── (AuthService, AdaptiveQuizService, QuizService, PerformanceService)
               │
               ▼
     [ Repository Layer ]    ─── (Spring Data JPA Repositories)
               │
               ▼
    [ Database / Storage ]   ─── (PostgreSQL 18 & In-Memory / Redis Cache)
```

---

## 2. Core Modules & Key Files

### A. Security & Authentication (`com.examprep.security`)
- **`SecurityConfig.java`**:
  - Configures stateless session management (`SessionCreationPolicy.STATELESS`).
  - Sets up CORS for `http://localhost:5173` with explicit allowed origins, HTTP methods (`GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`), and headers.
  - Implements custom JSON-based `AuthenticationEntryPoint` (401 Unauthorized) and `AccessDeniedHandler` (403 Forbidden).
  - Uses `BCryptPasswordEncoder` (strength 10) for one-way cryptographic password hashing.
  - Secures endpoints using Role-Based Access Control (`STUDENT`, `ADMIN`).
- **`JwtService.java`**:
  - Issues signed HMAC-SHA256 JWT tokens with configurable expiration (default 24 hours).
  - Extracts claims, username, and role from JWT payloads with signature validation and expiry checks.
- **`JwtAuthenticationFilter.java`**:
  - Intercepts incoming requests, extracts the `Authorization: Bearer <token>` header, validates the token against `CustomUserDetailsService`, and establishes authenticated user context in `SecurityContextHolder`.

### B. Adaptive Engine & Quiz Management (`com.examprep.service`)
- **`AdaptiveQuizService.java`**:
  - Implements the real-time difficulty adjustment engine.
  - **Deterministic Policy**:
    - Starts the student at `Difficulty.MEDIUM`.
    - Computes rolling accuracy: $\text{accuracy} = \frac{\text{correctAnswers}}{\text{totalAnswered}} \times 100$.
    - Transition thresholds:
      - $< 50\%$ accuracy $\rightarrow$ Step down to `Difficulty.EASY`
      - $50\% - 75\%$ accuracy $\rightarrow$ Maintain `Difficulty.MEDIUM`
      - $> 75\%$ accuracy $\rightarrow$ Elevate to `Difficulty.HARD`
    - Excludes all questions previously answered in the current session (`answeredQuestionIds`).
    - Implements deterministic adjacent-tier fallback when a target difficulty pool is exhausted.
- **`QuizService.java`**:
  - Manages the full quiz lifecycle: `startQuiz()`, `submitAnswer()`, and `finishQuiz()`.
  - **Security Enforcement**: Enforces attempt ownership (`attempt.getUser().getId().equals(currentUser.getId())`).
  - **Zero Answer Leakage**: Constructs `QuestionDto` devoid of `correctAnswer` or `explanation` during active question queries.
  - Computes final score, time elapsed (`Duration.between(startedAt, completedAt)`), and delegates to `PerformanceService` to update user mastery.
- **`PerformanceService.java`**:
  - Calculates cumulative accuracy per topic and assigns mastery levels:
    - $\ge 80\% \rightarrow \text{MASTERED}$
    - $\ge 50\% \rightarrow \text{PROFICIENT}$
    - $< 50\% \rightarrow \text{LEARNING}$
  - Generates targeted recommendations for topics requiring reinforcement.

### C. Domain Entities & JPA Mappings (`com.examprep.entity`)
- **`User.java`**: Maps to `users` table; stores credentials, role (`Role.STUDENT`), and audit timestamps.
- **`Subject.java` & `Topic.java`**: Maps subjects and topics with `@ManyToOne` / `@OneToMany` relationships.
- **`Question.java`**: Maps questions, options A-D, `correct_answer`, `difficulty` (`Difficulty.EASY`, `MEDIUM`, `HARD`), and marks.
- **`QuizAttempt.java`**: Stores quiz session state, score, accuracy, started/completed timestamps, and status (`Status.IN_PROGRESS`, `COMPLETED`).
- **`StudentAnswer.java`**: Records individual responses with `selected_answer`, `is_correct`, and `response_time_seconds`.
- **`Performance.java`**: Aggregates topic-level performance metrics with unique constraint on `(user_id, topic_id)`.

---

## 3. Exception Handling & Error Standard
The backend utilizes `GlobalExceptionHandler.java` with `@RestControllerAdvice` to produce standard RFC-7807 compliant error payloads:

```json
{
  "timestamp": "2026-09-15T12:00:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Email is already registered",
  "path": "/api/auth/register"
}
```

Handled exceptions:
- `ResourceNotFoundException` $\rightarrow$ 404 Not Found
- `BadRequestException` $\rightarrow$ 400 Bad Request
- `UnauthorizedException` $\rightarrow$ 403 Forbidden
- `BadCredentialsException` $\rightarrow$ 401 Unauthorized
- `MethodArgumentNotValidException` $\rightarrow$ 400 Bad Request with field-level error messages.

---

## 4. Resilience & Fallback Design
- **Cache Resilience**: `CacheConfig.java` utilizes an in-memory `ConcurrentMapCacheManager` to cache subjects and topics without requiring an active Redis instance. If Redis is configured, it smoothly switches without breaking core operations.
- **Restart-Safe Seeding**: `SeedDataLoader.java` verifies database state before inserting records, avoiding duplicate key collisions on application restart.
