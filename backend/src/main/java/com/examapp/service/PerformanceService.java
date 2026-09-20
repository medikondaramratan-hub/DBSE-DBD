package com.examapp.service;

import com.examapp.dto.*;
import com.examapp.entity.Performance;
import com.examapp.entity.QuizAttempt;
import com.examapp.entity.Topic;
import com.examapp.entity.User;
import com.examapp.repository.PerformanceRepository;
import com.examapp.repository.QuizAttemptRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PerformanceService {

    private final PerformanceRepository performanceRepository;
    private final QuizAttemptRepository attemptRepository;

    public PerformanceService(PerformanceRepository performanceRepository,
                              QuizAttemptRepository attemptRepository) {
        this.performanceRepository = performanceRepository;
        this.attemptRepository = attemptRepository;
    }

    /**
     * Updates cumulative topic performance and calculates adaptive mastery tier.
     */
    @Transactional
    public void updatePerformance(User user, Topic topic, QuizAttempt attempt) {
        if (topic == null || user == null) {
            return;
        }

        Performance performance = performanceRepository
                .findByUser_UserIdAndTopic_TopicId(user.getUserId(), topic.getTopicId())
                .orElseGet(() -> new Performance(user, topic));

        int newTotalAttempts = (performance.getTotalAttempts() != null ? performance.getTotalAttempts() : 0) + 1;
        int newTotalQuestions = (performance.getTotalQuestions() != null ? performance.getTotalQuestions() : 0)
                + (attempt.getTotalQuestions() != null ? attempt.getTotalQuestions() : 0);
        int newCorrectAnswers = (performance.getCorrectAnswers() != null ? performance.getCorrectAnswers() : 0)
                + (attempt.getCorrectAnswers() != null ? attempt.getCorrectAnswers() : 0);
        int newWrongAnswers = (performance.getWrongAnswers() != null ? performance.getWrongAnswers() : 0)
                + (attempt.getWrongAnswers() != null ? attempt.getWrongAnswers() : 0);

        BigDecimal newAccuracy = newTotalQuestions > 0
                ? BigDecimal.valueOf(((double) newCorrectAnswers / newTotalQuestions) * 100.0).setScale(2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        // Cumulative average response time calculation
        double currentAvgTime = performance.getAverageResponseTime() != null ? performance.getAverageResponseTime().doubleValue() : 0.0;
        double attemptAvgTime = attempt.getTotalQuestions() != null && attempt.getTotalQuestions() > 0 && attempt.getTimeTaken() != null
                ? (double) attempt.getTimeTaken() / attempt.getTotalQuestions()
                : 30.0;
        double updatedAvgTime = currentAvgTime > 0 ? (currentAvgTime + attemptAvgTime) / 2.0 : attemptAvgTime;

        // Classify learning mastery level
        String level;
        double acc = newAccuracy.doubleValue();
        if (acc >= 85.0) {
            level = "EXPERT";
        } else if (acc >= 70.0) {
            level = "ADVANCED";
        } else if (acc >= 50.0) {
            level = "INTERMEDIATE";
        } else {
            level = "BEGINNER";
        }

        performance.setTotalAttempts(newTotalAttempts);
        performance.setTotalQuestions(newTotalQuestions);
        performance.setCorrectAnswers(newCorrectAnswers);
        performance.setWrongAnswers(newWrongAnswers);
        performance.setAccuracy(newAccuracy);
        performance.setAverageResponseTime(BigDecimal.valueOf(updatedAvgTime).setScale(2, RoundingMode.HALF_UP));
        performance.setCurrentLevel(level);
        performance.setLastAttemptedAt(LocalDateTime.now());

        performanceRepository.save(performance);
    }

    /**
     * Builds comprehensive dashboard statistics and learning trend metrics.
     */
    @Transactional(readOnly = true)
    public PerformanceSummaryDto getPerformanceSummary(Long userId) {
        List<QuizAttempt> attempts = attemptRepository.findByUser_UserIdOrderByStartedAtDesc(userId);
        List<Performance> perfs = performanceRepository.findByUser_UserId(userId);

        int totalAttempts = attempts.size();
        int totalQuestions = attempts.stream()
                .mapToInt(a -> a.getTotalQuestions() != null ? a.getTotalQuestions() : 0)
                .sum();

        double avgAccVal = attempts.isEmpty()
                ? 0.0
                : attempts.stream()
                .mapToDouble(a -> a.getAccuracy() != null ? a.getAccuracy().doubleValue() : 0.0)
                .average()
                .orElse(0.0);
        BigDecimal averageAccuracy = BigDecimal.valueOf(avgAccVal).setScale(2, RoundingMode.HALF_UP);

        String overallLevel;
        if (avgAccVal >= 85.0) {
            overallLevel = "EXPERT";
        } else if (avgAccVal >= 70.0) {
            overallLevel = "ADVANCED";
        } else if (avgAccVal >= 50.0) {
            overallLevel = "INTERMEDIATE";
        } else if (totalAttempts > 0) {
            overallLevel = "BEGINNER";
        } else {
            overallLevel = "NOT_STARTED";
        }

        List<TopicPerformanceDto> topicDtos = perfs.stream()
                .map(this::mapToTopicPerformanceDto)
                .collect(Collectors.toList());

        List<TopicPerformanceDto> strongTopics = topicDtos.stream()
                .filter(t -> t.getAccuracy().doubleValue() >= 80.0)
                .collect(Collectors.toList());

        List<TopicPerformanceDto> weakTopics = topicDtos.stream()
                .filter(t -> t.getAccuracy().doubleValue() < 60.0)
                .collect(Collectors.toList());

        // Compute Strongest and Weakest Subjects
        Map<String, List<Performance>> subjectGroups = perfs.stream()
                .filter(p -> p.getTopic() != null && p.getTopic().getSubject() != null)
                .collect(Collectors.groupingBy(p -> p.getTopic().getSubject().getSubjectName()));

        String strongestSubject = "None Yet";
        String weakestSubject = "None Yet";
        double highestSubAcc = -1.0;
        double lowestSubAcc = 101.0;

        for (Map.Entry<String, List<Performance>> entry : subjectGroups.entrySet()) {
            double subAvg = entry.getValue().stream()
                    .mapToDouble(p -> p.getAccuracy() != null ? p.getAccuracy().doubleValue() : 0.0)
                    .average()
                    .orElse(0.0);
            if (subAvg > highestSubAcc) {
                highestSubAcc = subAvg;
                strongestSubject = entry.getKey();
            }
            if (subAvg < lowestSubAcc) {
                lowestSubAcc = subAvg;
                weakestSubject = entry.getKey();
            }
        }

        List<RecommendationDto> recommendations = generateRecommendations(perfs);

        List<QuizAttemptSummaryDto> recentAttempts = attempts.stream()
                .limit(5)
                .map(a -> new QuizAttemptSummaryDto(
                        a.getAttemptId(),
                        a.getSubject() != null ? a.getSubject().getSubjectName() : "General",
                        a.getTopic() != null ? a.getTopic().getTopicName() : "General",
                        a.getTotalQuestions() != null ? a.getTotalQuestions() : 0,
                        a.getCorrectAnswers() != null ? a.getCorrectAnswers() : 0,
                        a.getScore() != null ? a.getScore() : BigDecimal.ZERO,
                        a.getAccuracy() != null ? a.getAccuracy() : BigDecimal.ZERO,
                        a.getTimeTaken() != null ? a.getTimeTaken() : 0,
                        a.getFinalDifficulty() != null ? a.getFinalDifficulty() : "MEDIUM",
                        a.getCompletedAt() != null ? a.getCompletedAt() : a.getStartedAt()
                ))
                .collect(Collectors.toList());

        PerformanceSummaryDto summary = new PerformanceSummaryDto();
        summary.setTotalQuizzesAttempted(totalAttempts);
        summary.setAverageAccuracy(averageAccuracy);
        summary.setTotalQuestionsAnswered(totalQuestions);
        summary.setCurrentLearningLevel(overallLevel);
        summary.setStrongestSubject(strongestSubject);
        summary.setWeakestSubject(weakestSubject);
        summary.setStrongTopics(strongTopics);
        summary.setWeakTopics(weakTopics);
        summary.setRecommendations(recommendations);
        summary.setRecentAttempts(recentAttempts);

        return summary;
    }

    @Transactional(readOnly = true)
    public List<TopicPerformanceDto> getTopicPerformances(Long userId) {
        return performanceRepository.findByUser_UserIdOrderByAccuracyDesc(userId).stream()
                .map(this::mapToTopicPerformanceDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RecommendationDto> getRecommendations(Long userId) {
        List<Performance> perfs = performanceRepository.findByUser_UserId(userId);
        return generateRecommendations(perfs);
    }

    private List<RecommendationDto> generateRecommendations(List<Performance> perfs) {
        List<RecommendationDto> list = new ArrayList<>();

        for (Performance p : perfs) {
            double acc = p.getAccuracy() != null ? p.getAccuracy().doubleValue() : 0.0;
            String topicName = p.getTopic() != null ? p.getTopic().getTopicName() : "Topic";
            String subName = p.getTopic() != null && p.getTopic().getSubject() != null
                    ? p.getTopic().getSubject().getSubjectName()
                    : "Subject";

            if (acc < 60.0) {
                list.add(new RecommendationDto(
                        p.getTopic().getTopicId(),
                        topicName,
                        subName,
                        p.getAccuracy(),
                        p.getCurrentLevel(),
                        "Practice " + topicName + " — your accuracy is currently " + String.format("%.0f", acc) + "%. Recommended tier: EASY to reinforce fundamentals.",
                        "HIGH"
                ));
            } else if (acc <= 80.0) {
                list.add(new RecommendationDto(
                        p.getTopic().getTopicId(),
                        topicName,
                        subName,
                        p.getAccuracy(),
                        p.getCurrentLevel(),
                        "Strengthen " + topicName + " — steady performance at " + String.format("%.0f", acc) + "%. Recommended tier: MEDIUM questions.",
                        "MEDIUM"
                ));
            }
        }

        // If student is performing well across everything, suggest advancing
        if (list.isEmpty() && !perfs.isEmpty()) {
            Performance top = perfs.get(0);
            list.add(new RecommendationDto(
                    top.getTopic().getTopicId(),
                    top.getTopic().getTopicName(),
                    top.getTopic().getSubject().getSubjectName(),
                    top.getAccuracy(),
                    top.getCurrentLevel(),
                    "Excellent progress! Challenge yourself with HARD questions in " + top.getTopic().getTopicName() + ".",
                    "LOW"
            ));
        }

        return list;
    }

    private TopicPerformanceDto mapToTopicPerformanceDto(Performance p) {
        double acc = p.getAccuracy() != null ? p.getAccuracy().doubleValue() : 0.0;
        String status;
        if (acc >= 80.0) {
            status = "Strong";
        } else if (acc >= 60.0) {
            status = "Improving";
        } else {
            status = "Needs Practice";
        }

        return new TopicPerformanceDto(
                p.getTopic().getTopicId(),
                p.getTopic().getTopicName(),
                p.getTopic().getSubject() != null ? p.getTopic().getSubject().getSubjectName() : "General",
                p.getTotalAttempts() != null ? p.getTotalAttempts() : 0,
                p.getTotalQuestions() != null ? p.getTotalQuestions() : 0,
                p.getCorrectAnswers() != null ? p.getCorrectAnswers() : 0,
                p.getWrongAnswers() != null ? p.getWrongAnswers() : 0,
                p.getAccuracy() != null ? p.getAccuracy() : BigDecimal.ZERO,
                p.getAverageResponseTime() != null ? p.getAverageResponseTime() : BigDecimal.ZERO,
                p.getCurrentLevel() != null ? p.getCurrentLevel() : "BEGINNER",
                status
        );
    }
}
