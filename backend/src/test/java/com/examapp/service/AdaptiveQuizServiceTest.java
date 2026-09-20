package com.examapp.service;

import com.examapp.entity.Question;
import com.examapp.entity.Topic;
import com.examapp.repository.QuestionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdaptiveQuizServiceTest {

    @Mock
    private QuestionRepository questionRepository;

    @InjectMocks
    private AdaptiveQuizService adaptiveQuizService;

    private Topic sampleTopic;

    @BeforeEach
    void setUp() {
        sampleTopic = new Topic();
        sampleTopic.setTopicId(1L);
        sampleTopic.setTopicName("SQL & Relational Queries");
    }

    @Test
    @DisplayName("Initial difficulty must start at MEDIUM")
    void testInitialDifficultyStartsAtMedium() {
        String difficulty = adaptiveQuizService.determineTargetDifficulty(0, 0);
        assertEquals("MEDIUM", difficulty, "Baseline initial question must be MEDIUM");
    }

    @Test
    @DisplayName("Rolling accuracy below 50% must adapt to EASY")
    void testLowAccuracyAdaptsToEasy() {
        // 1 correct out of 3 questions = 33.3% (< 50%)
        String difficulty = adaptiveQuizService.determineTargetDifficulty(3, 1);
        assertEquals("EASY", difficulty, "Performance below 50% must trigger EASY tier");
    }

    @Test
    @DisplayName("Rolling accuracy between 50% and 75% must remain MEDIUM")
    void testModerateAccuracyRetainsMedium() {
        // 2 correct out of 3 questions = 66.7% (between 50% and 75%)
        String difficulty = adaptiveQuizService.determineTargetDifficulty(3, 2);
        assertEquals("MEDIUM", difficulty, "Performance between 50% and 75% must retain MEDIUM tier");
    }

    @Test
    @DisplayName("Rolling accuracy above 75% must promote to HARD")
    void testHighAccuracyPromotesToHard() {
        // 4 correct out of 4 questions = 100% (> 75%)
        String difficulty = adaptiveQuizService.determineTargetDifficulty(4, 4);
        assertEquals("HARD", difficulty, "Performance above 75% must promote to HARD tier");
    }

    @Test
    @DisplayName("Already answered questions must be excluded from candidate selection")
    void testAnsweredQuestionsExcluded() {
        List<Long> answeredIds = Arrays.asList(10L, 11L);

        Question q12 = new Question();
        q12.setQuestionId(12L);
        q12.setDifficulty("MEDIUM");

        when(questionRepository.findAvailableByTopicAndDifficulty(eq(1L), eq("MEDIUM"), eq(answeredIds)))
                .thenReturn(Collections.singletonList(q12));

        Optional<Question> result = adaptiveQuizService.selectNextQuestion(1L, answeredIds, "MEDIUM");

        assertTrue(result.isPresent());
        assertEquals(12L, result.get().getQuestionId());
        assertFalse(answeredIds.contains(result.get().getQuestionId()), "Result must not be in excluded IDs");
    }

    @Test
    @DisplayName("Deterministic fallback when target HARD tier is exhausted (falls back to MEDIUM)")
    void testFallbackWhenHardExhausted() {
        List<Long> answeredIds = Collections.singletonList(1L);

        // Primary HARD query returns empty
        when(questionRepository.findAvailableByTopicAndDifficulty(eq(1L), eq("HARD"), anyCollection()))
                .thenReturn(Collections.emptyList());

        // Secondary MEDIUM fallback query returns candidate
        Question mediumFallback = new Question();
        mediumFallback.setQuestionId(2L);
        mediumFallback.setDifficulty("MEDIUM");

        when(questionRepository.findAvailableByTopicAndDifficulty(eq(1L), eq("MEDIUM"), anyCollection()))
                .thenReturn(Collections.singletonList(mediumFallback));

        Optional<Question> result = adaptiveQuizService.selectNextQuestion(1L, answeredIds, "HARD");

        assertTrue(result.isPresent());
        assertEquals("MEDIUM", result.get().getDifficulty(), "Must fallback to MEDIUM when HARD is exhausted");
        assertEquals(2L, result.get().getQuestionId());
    }

    @Test
    @DisplayName("Recommendation calculation reflects accuracy thresholds")
    void testRecommendedDifficultyCalculation() {
        assertEquals("HARD", adaptiveQuizService.calculateNextRecommendedDifficulty(BigDecimal.valueOf(85.00)));
        assertEquals("MEDIUM", adaptiveQuizService.calculateNextRecommendedDifficulty(BigDecimal.valueOf(65.00)));
        assertEquals("EASY", adaptiveQuizService.calculateNextRecommendedDifficulty(BigDecimal.valueOf(40.00)));
    }
}
