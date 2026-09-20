package com.examapp.dto;

import java.math.BigDecimal;
import java.util.List;

public class PerformanceSummaryDto {
    private int totalQuizzesAttempted;
    private BigDecimal averageAccuracy;
    private int totalQuestionsAnswered;
    private String currentLearningLevel;
    private String strongestSubject;
    private String weakestSubject;
    private List<TopicPerformanceDto> strongTopics;
    private List<TopicPerformanceDto> weakTopics;
    private List<RecommendationDto> recommendations;
    private List<QuizAttemptSummaryDto> recentAttempts;

    public PerformanceSummaryDto() {
    }

    public int getTotalQuizzesAttempted() {
        return totalQuizzesAttempted;
    }

    public void setTotalQuizzesAttempted(int totalQuizzesAttempted) {
        this.totalQuizzesAttempted = totalQuizzesAttempted;
    }

    public BigDecimal getAverageAccuracy() {
        return averageAccuracy;
    }

    public void setAverageAccuracy(BigDecimal averageAccuracy) {
        this.averageAccuracy = averageAccuracy;
    }

    public int getTotalQuestionsAnswered() {
        return totalQuestionsAnswered;
    }

    public void setTotalQuestionsAnswered(int totalQuestionsAnswered) {
        this.totalQuestionsAnswered = totalQuestionsAnswered;
    }

    public String getCurrentLearningLevel() {
        return currentLearningLevel;
    }

    public void setCurrentLearningLevel(String currentLearningLevel) {
        this.currentLearningLevel = currentLearningLevel;
    }

    public String getStrongestSubject() {
        return strongestSubject;
    }

    public void setStrongestSubject(String strongestSubject) {
        this.strongestSubject = strongestSubject;
    }

    public String getWeakestSubject() {
        return weakestSubject;
    }

    public void setWeakestSubject(String weakestSubject) {
        this.weakestSubject = weakestSubject;
    }

    public List<TopicPerformanceDto> getStrongTopics() {
        return strongTopics;
    }

    public void setStrongTopics(List<TopicPerformanceDto> strongTopics) {
        this.strongTopics = strongTopics;
    }

    public List<TopicPerformanceDto> getWeakTopics() {
        return weakTopics;
    }

    public void setWeakTopics(List<TopicPerformanceDto> weakTopics) {
        this.weakTopics = weakTopics;
    }

    public List<RecommendationDto> getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(List<RecommendationDto> recommendations) {
        this.recommendations = recommendations;
    }

    public List<QuizAttemptSummaryDto> getRecentAttempts() {
        return recentAttempts;
    }

    public void setRecentAttempts(List<QuizAttemptSummaryDto> recentAttempts) {
        this.recentAttempts = recentAttempts;
    }
}
