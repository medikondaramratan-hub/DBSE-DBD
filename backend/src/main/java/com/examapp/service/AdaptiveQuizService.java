package com.examapp.service;

import com.examapp.entity.Question;
import com.examapp.repository.QuestionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

/**
 * ============================================================================
 * ADAPTIVE QUIZ ENGINE
 * ============================================================================
 * Core service powering dynamic item-difficulty calibration for college Project Review-3.
 *
 * ALGORITHM SPECIFICATION:
 * ----------------------------------------------------------------------------
 * 1. Initial State:
 *    Every quiz session initializes at the "MEDIUM" baseline tier.
 *
 * 2. Real-Time Difficulty Adjustment:
 *    After each question is answered, the student's rolling accuracy is computed:
 *         Accuracy = (Total Correct Answers / Total Answered Questions) * 100
 *
 *    - Rolling Accuracy < 50.0%:
 *      The engine adapts downward to "EASY" to reinforce foundational concepts.
 *
 *    - Rolling Accuracy 50.0% to 75.0%:
 *      The student demonstrates steady comprehension; difficulty remains "MEDIUM".
 *
 *    - Rolling Accuracy > 75.0%:
 *      The student demonstrates mastery; the engine promotes them to "HARD".
 *
 * 3. Question Exclusion (Zero Duplication Guarantee):
 *    All previously answered question IDs in the current attempt are strictly excluded
 *    so students are never served duplicate questions.
 *
 * 4. Deterministic Fallback Strategy:
 *    If the question bank for the target tier is exhausted, the engine applies a
 *    graceful adjacent-tier fallback:
 *      - Target HARD   -> Fallback to MEDIUM -> then EASY
 *      - Target MEDIUM -> Fallback to EASY   -> then HARD
 *      - Target EASY   -> Fallback to MEDIUM -> then HARD
 * ============================================================================
 */
@Service
public class AdaptiveQuizService {

    private static final Logger log = LoggerFactory.getLogger(AdaptiveQuizService.class);

    private final QuestionRepository questionRepository;

    public AdaptiveQuizService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    /**
     * Computes target difficulty tier based on cumulative attempt performance.
     *
     * @param answeredCount Number of questions answered so far in current attempt
     * @param correctCount  Number of correct responses recorded
     * @return Target difficulty: "EASY", "MEDIUM", or "HARD"
     */
    public String determineTargetDifficulty(int answeredCount, int correctCount) {
        // Step 1: Initial starting point is always MEDIUM baseline
        if (answeredCount == 0) {
            log.debug("No answers recorded yet. Starting at baseline MEDIUM difficulty.");
            return "MEDIUM";
        }

        // Step 2: Compute real-time rolling accuracy percentage
        double accuracy = ((double) correctCount / answeredCount) * 100.0;
        log.debug("Adaptive calculation: answered={}, correct={}, rollingAccuracy={}%",
                answeredCount, correctCount, String.format("%.2f", accuracy));

        // Step 3: Branch according to pedagogical thresholds
        if (accuracy < 50.0) {
            // Low accuracy: guide student to foundational practice
            return "EASY";
        } else if (accuracy <= 75.0) {
            // Balanced accuracy: retain intermediate standard
            return "MEDIUM";
        } else {
            // High accuracy (>75%): challenge student with advanced problems
            return "HARD";
        }
    }

    /**
     * Selects the next unasked question from the database matching the target difficulty.
     * Applies deterministic tier fallbacks if the primary tier has no remaining items.
     *
     * @param topicId              Target curriculum topic ID
     * @param answeredQuestionIds  List of question IDs already presented in this attempt
     * @param targetDifficulty     Calculated target difficulty
     * @return Next adaptive question, or Optional.empty() if entire bank is exhausted
     */
    public Optional<Question> selectNextQuestion(Long topicId,
                                                 Collection<Long> answeredQuestionIds,
                                                 String targetDifficulty) {
        Collection<Long> excluded = (answeredQuestionIds != null && !answeredQuestionIds.isEmpty())
                ? answeredQuestionIds
                : Collections.singletonList(-1L);

        // Build priority sequence for deterministic fallback
        List<String> difficultyPriority = getFallbackPrioritySequence(targetDifficulty);

        for (String difficulty : difficultyPriority) {
            List<Question> candidates = questionRepository.findAvailableByTopicAndDifficulty(
                    topicId,
                    difficulty,
                    excluded
            );

            if (!candidates.isEmpty()) {
                log.info("Selected adaptive question id={} [tier={}] for topicId={} (target was {})",
                        candidates.get(0).getQuestionId(), difficulty, topicId, targetDifficulty);
                return Optional.of(candidates.get(0));
            }
        }

        // Ultimate fallback: check any remaining unasked question in the topic
        List<Question> anyRemaining = questionRepository.findAvailableByTopic(topicId, excluded);
        if (!anyRemaining.isEmpty()) {
            log.warn("All tiered queries exhausted. Serving general fallback question id={}",
                    anyRemaining.get(0).getQuestionId());
            return Optional.of(anyRemaining.get(0));
        }

        log.warn("No available unasked questions remaining for topicId={}", topicId);
        return Optional.empty();
    }

    /**
     * Resolves fallback priority list when questions in target tier are depleted.
     */
    private List<String> getFallbackPrioritySequence(String target) {
        if ("HARD".equalsIgnoreCase(target)) {
            return Arrays.asList("HARD", "MEDIUM", "EASY");
        } else if ("EASY".equalsIgnoreCase(target)) {
            return Arrays.asList("EASY", "MEDIUM", "HARD");
        } else {
            // Default MEDIUM target
            return Arrays.asList("MEDIUM", "EASY", "HARD");
        }
    }

    /**
     * Determines post-quiz recommended progression tier for the student's next practice test.
     */
    public String calculateNextRecommendedDifficulty(BigDecimal accuracy) {
        if (accuracy == null) {
            return "MEDIUM";
        }
        double acc = accuracy.doubleValue();
        if (acc >= 80.0) {
            return "HARD";
        } else if (acc >= 50.0) {
            return "MEDIUM";
        } else {
            return "EASY";
        }
    }
}
