import {
  MOCK_SUBJECTS,
  MOCK_TOPICS,
  MOCK_QUESTIONS,
  MOCK_USER,
  MOCK_PERFORMANCE_SUMMARY,
  MOCK_TOPIC_PERFORMANCES
} from './mockData';

// In-memory state persisted in sessionStorage
const getStorage = (key, fallback) => {
  try {
    const val = sessionStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
};

const setStorage = (key, val) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.warn('Storage error:', e);
  }
};

export const mockService = {
  login: async (email, password) => {
    const user = {
      ...MOCK_USER,
      email: email || MOCK_USER.email,
      name: email.split('@')[0] || MOCK_USER.name
    };
    return { token: 'mock-jwt-token-demo-session', user };
  },

  register: async (name, email, password) => {
    const user = {
      userId: Date.now(),
      name: name || 'Student',
      email: email || 'student@college.edu',
      role: 'STUDENT',
      createdAt: new Date().toISOString()
    };
    return { token: 'mock-jwt-token-demo-session', user };
  },

  getSubjects: async () => {
    return MOCK_SUBJECTS;
  },

  getSubjectById: async (subjectId) => {
    const sub = MOCK_SUBJECTS.find(s => s.subjectId === Number(subjectId));
    return sub || MOCK_SUBJECTS[0];
  },

  getTopicsBySubject: async (subjectId) => {
    return MOCK_TOPICS.filter(t => t.subjectId === Number(subjectId));
  },

  getTopicById: async (topicId) => {
    const topic = MOCK_TOPICS.find(t => t.topicId === Number(topicId));
    return topic || MOCK_TOPICS[0];
  },

  startQuiz: async (topicId) => {
    const topic = MOCK_TOPICS.find(t => t.topicId === Number(topicId)) || MOCK_TOPICS[0];
    const attemptId = Date.now();
    const newAttempt = {
      attemptId,
      topicId: topic.topicId,
      topicName: topic.topicName,
      subjectName: MOCK_SUBJECTS.find(s => s.subjectId === topic.subjectId)?.subjectName || 'Curriculum',
      currentDifficulty: 'MEDIUM',
      answeredQuestionIds: [],
      answers: [],
      score: 0,
      totalQuestions: 5,
      startedAt: new Date().toISOString()
    };
    setStorage(`mock_attempt_${attemptId}`, newAttempt);
    return {
      attemptId,
      topicId: topic.topicId,
      topicName: topic.topicName,
      initialDifficulty: 'MEDIUM',
      maxQuestions: 5
    };
  },

  getNextQuestion: async (attemptId) => {
    const attempt = getStorage(`mock_attempt_${attemptId}`);
    if (!attempt) throw new Error('Attempt not found');

    const answeredCount = attempt.answeredQuestionIds.length;
    if (answeredCount >= attempt.totalQuestions) {
      return null;
    }

    // Adaptive Calculation
    let targetTier = 'MEDIUM';
    if (answeredCount > 0) {
      const correctCount = attempt.answers.filter(a => a.isCorrect).length;
      const accuracy = (correctCount / answeredCount) * 100;
      if (accuracy < 50) {
        targetTier = 'EASY';
      } else if (accuracy <= 75) {
        targetTier = 'MEDIUM';
      } else {
        targetTier = 'HARD';
      }
    }
    attempt.currentDifficulty = targetTier;

    // Filter candidate questions by topic and exclude answered
    let candidates = MOCK_QUESTIONS.filter(q =>
      (q.topicId === attempt.topicId || attempt.topicId === 1) &&
      !attempt.answeredQuestionIds.includes(q.questionId) &&
      q.difficulty === targetTier
    );

    if (candidates.length === 0) {
      // Fallback
      candidates = MOCK_QUESTIONS.filter(q =>
        !attempt.answeredQuestionIds.includes(q.questionId)
      );
    }

    if (candidates.length === 0) {
      candidates = MOCK_QUESTIONS;
    }

    const selected = candidates[0];
    setStorage(`mock_attempt_${attemptId}`, attempt);

    return {
      questionId: selected.questionId,
      questionText: selected.questionText,
      optionA: selected.optionA,
      optionB: selected.optionB,
      optionC: selected.optionC,
      optionD: selected.optionD,
      difficulty: selected.difficulty,
      questionNumber: answeredCount + 1,
      totalQuestions: attempt.totalQuestions
    };
  },

  submitAnswer: async (attemptId, questionId, selectedOption) => {
    const attempt = getStorage(`mock_attempt_${attemptId}`);
    if (!attempt) throw new Error('Attempt not found');

    const question = MOCK_QUESTIONS.find(q => q.questionId === Number(questionId)) || MOCK_QUESTIONS[0];
    const isCorrect = question.correctAnswer.toUpperCase() === selectedOption.toUpperCase();

    attempt.answeredQuestionIds.push(question.questionId);
    attempt.answers.push({
      questionId: question.questionId,
      questionText: question.questionText,
      selectedOption,
      correctAnswer: question.correctAnswer,
      isCorrect,
      difficulty: question.difficulty,
      explanation: question.explanation
    });

    if (isCorrect) {
      attempt.score += question.marks || 1;
    }

    const answeredCount = attempt.answeredQuestionIds.length;
    const correctCount = attempt.answers.filter(a => a.isCorrect).length;
    const rollingAccuracy = Math.round((correctCount / answeredCount) * 100);

    let nextDifficulty = 'MEDIUM';
    if (rollingAccuracy < 50) nextDifficulty = 'EASY';
    else if (rollingAccuracy <= 75) nextDifficulty = 'MEDIUM';
    else nextDifficulty = 'HARD';

    attempt.currentDifficulty = nextDifficulty;
    setStorage(`mock_attempt_${attemptId}`, attempt);

    return {
      isCorrect,
      correctOption: question.correctAnswer,
      explanation: question.explanation,
      currentScore: attempt.score,
      rollingAccuracy,
      nextDifficultyTier: nextDifficulty
    };
  },

  finishQuiz: async (attemptId) => {
    const attempt = getStorage(`mock_attempt_${attemptId}`);
    if (!attempt) throw new Error('Attempt not found');

    const total = attempt.answeredQuestionIds.length || 1;
    const correct = attempt.answers.filter(a => a.isCorrect).length;
    const accuracy = Math.round((correct / total) * 100);

    let recommendedDifficulty = 'MEDIUM';
    if (accuracy >= 80) recommendedDifficulty = 'HARD';
    else if (accuracy < 50) recommendedDifficulty = 'EASY';

    const result = {
      attemptId,
      topicName: attempt.topicName,
      subjectName: attempt.subjectName,
      totalQuestions: total,
      correctAnswers: correct,
      score: attempt.score,
      maxScore: total,
      accuracyPercentage: accuracy,
      grade: accuracy >= 80 ? 'A' : accuracy >= 60 ? 'B' : accuracy >= 40 ? 'C' : 'F',
      passed: accuracy >= 50,
      recommendedDifficulty,
      recommendation: accuracy >= 75
        ? 'Excellent performance! You have demonstrated strong conceptual mastery in this topic.'
        : 'Good effort. Consider reviewing foundational principles before attempting higher difficulty tiers.',
      completedAt: new Date().toISOString(),
      questionReviews: attempt.answers.map((a, i) => ({
        questionNumber: i + 1,
        questionText: a.questionText,
        selectedOption: a.selectedOption,
        correctAnswer: a.correctAnswer,
        isCorrect: a.isCorrect,
        difficulty: a.difficulty,
        explanation: a.explanation
      }))
    };

    setStorage(`mock_result_${attemptId}`, result);
    return result;
  },

  getQuizResult: async (attemptId) => {
    const cached = getStorage(`mock_result_${attemptId}`);
    if (cached) return cached;
    return mockService.finishQuiz(attemptId);
  },

  getPerformance: async () => {
    return MOCK_PERFORMANCE_SUMMARY;
  },

  getTopicPerformances: async () => {
    return MOCK_TOPIC_PERFORMANCES;
  },

  getRecommendations: async () => {
    return [
      {
        topicName: 'Indexing & Query Optimization',
        subjectName: 'Database Management Systems',
        currentAccuracy: 45.0,
        recommendedDifficulty: 'EASY',
        reason: 'Accuracy below 50%. Practice foundational concepts.'
      },
      {
        topicName: 'SQL & Relational Queries',
        subjectName: 'Database Management Systems',
        currentAccuracy: 85.0,
        recommendedDifficulty: 'HARD',
        reason: 'Mastery established. Ready for advanced optimization problems.'
      }
    ];
  }
};
