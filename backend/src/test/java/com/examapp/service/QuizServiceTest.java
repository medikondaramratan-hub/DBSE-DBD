package com.examapp.service;

import com.examapp.dto.*;
import com.examapp.entity.*;
import com.examapp.exception.UnauthorizedException;
import com.examapp.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class QuizServiceTest {

    @Mock
    private QuizAttemptRepository attemptRepository;
    @Mock
    private StudentAnswerRepository answerRepository;
    @Mock
    private QuestionRepository questionRepository;
    @Mock
    private TopicRepository topicRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private PerformanceService performanceService;

    private AdaptiveQuizService adaptiveQuizService;
    private QuizService quizService;

    private User sampleUser;
    private Subject sampleSubject;
    private Topic sampleTopic;
    private Question sampleQuestion;

    @BeforeEach
    void setUp() {
        adaptiveQuizService = new AdaptiveQuizService(questionRepository);
        quizService = new QuizService(
                attemptRepository,
                answerRepository,
                questionRepository,
                topicRepository,
                userRepository,
                adaptiveQuizService,
                performanceService
        );

        sampleUser = new User();
        sampleUser.setUserId(1L);
        sampleUser.setEmail("student@examapp.com");
        sampleUser.setName("Chandrakanth");

        sampleSubject = new Subject();
        sampleSubject.setSubjectId(1L);
        sampleSubject.setSubjectName("Database Management Systems");

        sampleTopic = new Topic();
        sampleTopic.setTopicId(1L);
        sampleTopic.setTopicName("SQL & Relational Queries");
        sampleTopic.setSubject(sampleSubject);

        sampleQuestion = new Question();
        sampleQuestion.setQuestionId(101L);
        sampleQuestion.setQuestionText("What is an INNER JOIN?");
        sampleQuestion.setOptionA("All left");
        sampleQuestion.setOptionB("Only matches");
        sampleQuestion.setOptionC("All right");
        sampleQuestion.setOptionD("Cross product");
        sampleQuestion.setCorrectAnswer("B");
        sampleQuestion.setDifficulty("MEDIUM");
        sampleQuestion.setMarks(1);
    }

    @Test
    @DisplayName("Starting quiz initializes attempt and returns first question without revealing answer")
    void testStartQuizSuccessful() {
        QuizStartRequest request = new QuizStartRequest(1L, 5);

        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(topicRepository.findById(1L)).thenReturn(Optional.of(sampleTopic));
        when(attemptRepository.save(any(QuizAttempt.class))).thenAnswer(invocation -> {
            QuizAttempt a = invocation.getArgument(0);
            a.setAttemptId(10L);
            return a;
        });
        when(questionRepository.findAvailableByTopicAndDifficulty(eq(1L), eq("MEDIUM"), anyCollection()))
                .thenReturn(Collections.singletonList(sampleQuestion));

        QuizStartResponse response = quizService.startQuiz(1L, request);

        assertNotNull(response);
        assertEquals(10L, response.getAttemptId());
        assertEquals("MEDIUM", response.getStartingDifficulty());
        assertEquals(101L, response.getFirstQuestion().getQuestionId());
        assertEquals("MEDIUM", response.getFirstQuestion().getDifficulty());
    }

    @Test
    @DisplayName("Attempt ownership validation blocks unauthorized student access")
    void testUnauthorizedAttemptAccessThrowsException() {
        QuizAttempt attempt = new QuizAttempt();
        attempt.setAttemptId(99L);
        attempt.setUser(sampleUser); // owned by user 1

        when(attemptRepository.findById(99L)).thenReturn(Optional.of(attempt));

        assertThrows(UnauthorizedException.class, () -> {
            quizService.getNextQuestion(99L, 2L); // User 2 attempts access
        });
    }

    @Test
    @DisplayName("Submitting an answer records response and returns evaluation")
    void testSubmitAnswerEvaluation() {
        QuizAttempt attempt = new QuizAttempt();
        attempt.setAttemptId(10L);
        attempt.setUser(sampleUser);
        attempt.setTopic(sampleTopic);
        attempt.setStatus("IN_PROGRESS");
        attempt.setTotalQuestions(5);

        when(attemptRepository.findById(10L)).thenReturn(Optional.of(attempt));
        when(questionRepository.findById(101L)).thenReturn(Optional.of(sampleQuestion));
        when(answerRepository.findAnsweredQuestionIdsByAttemptId(10L)).thenReturn(new ArrayList<>());
        when(answerRepository.save(any(StudentAnswer.class))).thenAnswer(invocation -> {
            StudentAnswer sa = invocation.getArgument(0);
            sa.setAnswerId(501L);
            return sa;
        });
        when(answerRepository.countByAttempt_AttemptIdAndIsCorrect(eq(10L), eq(true))).thenReturn(1L);

        // Next question candidate in target tier
        Question q2 = new Question();
        q2.setQuestionId(102L);
        q2.setQuestionText("Next question");
        q2.setOptionA("A");
        q2.setOptionB("B");
        q2.setOptionC("C");
        q2.setOptionD("D");
        q2.setDifficulty("MEDIUM");

        when(questionRepository.findAvailableByTopicAndDifficulty(anyLong(), anyString(), anyCollection()))
                .thenReturn(Collections.singletonList(q2));

        AnswerSubmissionRequest req = new AnswerSubmissionRequest(101L, "B", 25);
        AnswerSubmissionResponse resp = quizService.submitAnswer(10L, 1L, req);

        assertNotNull(resp);
        assertTrue(resp.isCorrect(), "Answer 'B' matches correct answer 'B'");
        assertEquals(1, resp.getCurrentQuestionNumber());
        assertEquals(100.0, resp.getCurrentAccuracy());
    }

    @Test
    @DisplayName("Finishing quiz completes attempt and updates status")
    void testFinishQuiz() {
        QuizAttempt attempt = new QuizAttempt();
        attempt.setAttemptId(10L);
        attempt.setUser(sampleUser);
        attempt.setTopic(sampleTopic);
        attempt.setSubject(sampleSubject);
        attempt.setStatus("IN_PROGRESS");
        attempt.setTotalQuestions(5);
        attempt.setStartedAt(LocalDateTime.now().minusMinutes(3));

        StudentAnswer a1 = new StudentAnswer();
        a1.setQuestion(sampleQuestion);
        a1.setIsCorrect(true);
        a1.setSelectedAnswer("B");
        a1.setQuestionDifficulty("MEDIUM");

        when(attemptRepository.findById(10L)).thenReturn(Optional.of(attempt));
        when(answerRepository.findByAttempt_AttemptIdOrderByAnswerIdAsc(10L)).thenReturn(Collections.singletonList(a1));

        QuizResultDto result = quizService.finishQuiz(10L, 1L);

        assertNotNull(result);
        assertEquals("COMPLETED", attempt.getStatus());
        assertEquals(1, result.getCorrectAnswers());
        assertEquals(BigDecimal.valueOf(100.00).setScale(2), result.getAccuracy());
        verify(performanceService, times(1)).updatePerformance(any(), any(), any());
    }
}
