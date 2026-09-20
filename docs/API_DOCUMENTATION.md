# REST API Specification & Endpoint Documentation

## Base URL
```
http://localhost:8080/api
```

All protected endpoints require the following header:
```http
Authorization: Bearer <jwt_token>
```

---

## 1. Authentication Endpoints (`/api/auth`)

### Register New Student
- **`POST /api/auth/register`**
- **Public**: Yes
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "Password@123"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "token": "eyJhbGciOi...",
    "type": "Bearer",
    "user": {
      "id": 3,
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "STUDENT"
    }
  }
  ```

### Login Student
- **`POST /api/auth/login`**
- **Public**: Yes
- **Request Body**:
  ```json
  {
    "email": "student@examapp.com",
    "password": "Student@123"
  }
  ```
- **Response `200 OK`**: Same schema as Register.

---

## 2. Subjects & Topics (`/api/subjects`)

### Get All Subjects
- **`GET /api/subjects`**
- **Public**: No (Requires JWT)
- **Response `200 OK`**:
  ```json
  [
    {
      "id": 1,
      "name": "Data Structures & Algorithms",
      "description": "Core computer science fundamentals...",
      "icon": "Binary",
      "topicCount": 4
    }
  ]
  ```

### Get Topics for Subject
- **`GET /api/subjects/{subjectId}/topics`**
- **Public**: No (Requires JWT)
- **Response `200 OK`**:
  ```json
  [
    {
      "id": 1,
      "subjectId": 1,
      "subjectName": "Data Structures & Algorithms",
      "name": "Arrays & Strings",
      "description": "Memory layout, contiguous allocation...",
      "questionCount": 3
    }
  ]
  ```

---

## 3. Adaptive Quiz Lifecycle (`/api/quizzes`)

### Start New Adaptive Quiz
- **`POST /api/quizzes/start`**
- **Public**: No (Requires JWT)
- **Request Body**:
  ```json
  {
    "topicId": 1
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "attemptId": 12,
    "topicId": 1,
    "topicName": "Arrays & Strings",
    "questionNumber": 1,
    "firstQuestion": {
      "id": 2,
      "topicId": 1,
      "questionText": "What is the time complexity of searching in an unsorted array of size N?",
      "optionA": "O(1)",
      "optionB": "O(log N)",
      "optionC": "O(N)",
      "optionD": "O(N^2)",
      "difficulty": "MEDIUM",
      "marks": 1
    }
  }
  ```
  *(Notice: `correctAnswer` is NEVER included).*

### Submit Answer (Adaptive Transition)
- **`POST /api/quizzes/{attemptId}/answer`**
- **Public**: No (Requires JWT)
- **Request Body**:
  ```json
  {
    "questionId": 2,
    "selectedAnswer": "C",
    "responseTimeSeconds": 15
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "attemptId": 12,
    "questionId": 2,
    "selectedAnswer": "C",
    "correct": true,
    "correctAnswer": "C",
    "explanation": "Linear search requires checking elements sequentially, yielding O(N).",
    "currentAccuracy": 100.0,
    "nextDifficulty": "HARD",
    "nextQuestion": {
      "id": 3,
      "topicId": 1,
      "questionText": "Which algorithm is optimal for finding the maximum subarray sum in O(N) time?",
      "optionA": "Kadane's Algorithm",
      "optionB": "Floyd's Cycle Algorithm",
      "optionC": "Dijkstra's Algorithm",
      "optionD": "KMP Algorithm",
      "difficulty": "HARD",
      "marks": 1
    },
    "quizFinished": false
  }
  ```

### Finish Quiz
- **`POST /api/quizzes/{attemptId}/finish`**
- **Public**: No (Requires JWT)
- **Response `200 OK`**:
  ```json
  {
    "attemptId": 12,
    "topicId": 1,
    "topicName": "Arrays & Strings",
    "subjectName": "Data Structures & Algorithms",
    "totalQuestions": 3,
    "correctAnswers": 3,
    "score": 3,
    "accuracy": 100.0,
    "timeTakenSeconds": 45,
    "status": "COMPLETED",
    "startedAt": "2026-09-15T12:00:00Z",
    "completedAt": "2026-09-15T12:00:45Z",
    "questions": [
      {
        "questionId": 2,
        "questionText": "...",
        "optionA": "...",
        "optionB": "...",
        "optionC": "...",
        "optionD": "...",
        "selectedAnswer": "C",
        "correctAnswer": "C",
        "isCorrect": true,
        "difficulty": "MEDIUM",
        "explanation": "...",
        "responseTimeSeconds": 15
      }
    ]
  }
  ```

### Get Quiz Result by Attempt ID
- **`GET /api/quizzes/{attemptId}`**
- **Public**: No (Requires JWT; ownership enforced)
- **Response `200 OK`**: Same schema as Finish Quiz.

---

## 4. Performance & Analytics (`/api/performance`)

### Get Current Student Performance Summary
- **`GET /api/performance/me`**
- **Public**: No (Requires JWT)
- **Response `200 OK`**:
  ```json
  {
    "totalQuizzes": 4,
    "totalQuestionsAnswered": 12,
    "totalCorrectAnswers": 10,
    "overallAccuracy": 83.33,
    "masteredTopics": 2,
    "learningTopics": 1,
    "topicPerformances": [
      {
        "topicId": 1,
        "topicName": "Arrays & Strings",
        "subjectName": "Data Structures & Algorithms",
        "totalAttempts": 2,
        "totalQuestions": 6,
        "correctAnswers": 5,
        "accuracy": 83.33,
        "masteryLevel": "MASTERED"
      }
    ],
    "recommendations": [
      {
        "topicId": 2,
        "topicName": "Linked Lists",
        "subjectName": "Data Structures & Algorithms",
        "accuracy": 33.33,
        "masteryLevel": "LEARNING",
        "reason": "Accuracy is 33.3%. Review foundational concepts with an Easy quiz."
      }
    ]
  }
  ```

### Get Student Quiz Attempt History
- **`GET /api/performance/attempts`**
- **Public**: No (Requires JWT)
- **Response `200 OK`**: Array of attempt summary objects.
