package com.examapp.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class QuizResultDto {
    private Long attemptId;
    private Long subjectId;
    private String subjectName;
    private Long topicId;
    private String topicName;
    private int totalQuestions;
    private int correctAnswers;
    private int wrongAnswers;
    private BigDecimal score;
    private BigDecimal accuracy;
    private int timeTaken; // in seconds
    private String timeFormatted; // e.g. "2m 45s"
    private String startingDifficulty;
    private String finalDifficulty;
    private String performanceLevel; // "Strong", "Moderate", "Needs Improvement"
    private String nextRecommendedDifficulty;
    private String status;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private List<QuestionReviewDto> reviews;

    public QuizResultDto() {
    }

    public Long getAttemptId() {
        return attemptId;
    }

    public void setAttemptId(Long attemptId) {
        this.attemptId = attemptId;
    }

    public Long getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(Long subjectId) {
        this.subjectId = subjectId;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public Long getTopicId() {
        return topicId;
    }

    public void setTopicId(Long topicId) {
        this.topicId = topicId;
    }

    public String getTopicName() {
        return topicName;
    }

    public void setTopicName(String topicName) {
        this.topicName = topicName;
    }

    public int getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(int totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public int getCorrectAnswers() {
        return correctAnswers;
    }

    public void setCorrectAnswers(int correctAnswers) {
        this.correctAnswers = correctAnswers;
    }

    public int getWrongAnswers() {
        return wrongAnswers;
    }

    public void setWrongAnswers(int wrongAnswers) {
        this.wrongAnswers = wrongAnswers;
    }

    public BigDecimal getScore() {
        return score;
    }

    public void setScore(BigDecimal score) {
        this.score = score;
    }

    public BigDecimal getAccuracy() {
        return accuracy;
    }

    public void setAccuracy(BigDecimal accuracy) {
        this.accuracy = accuracy;
    }

    public int getTimeTaken() {
        return timeTaken;
    }

    public void setTimeTaken(int timeTaken) {
        this.timeTaken = timeTaken;
    }

    public String getTimeFormatted() {
        return timeFormatted;
    }

    public void setTimeFormatted(String timeFormatted) {
        this.timeFormatted = timeFormatted;
    }

    public String getStartingDifficulty() {
        return startingDifficulty;
    }

    public void setStartingDifficulty(String startingDifficulty) {
        this.startingDifficulty = startingDifficulty;
    }

    public String getFinalDifficulty() {
        return finalDifficulty;
    }

    public void setFinalDifficulty(String finalDifficulty) {
        this.finalDifficulty = finalDifficulty;
    }

    public String getPerformanceLevel() {
        return performanceLevel;
    }

    public void setPerformanceLevel(String performanceLevel) {
        this.performanceLevel = performanceLevel;
    }

    public String getNextRecommendedDifficulty() {
        return nextRecommendedDifficulty;
    }

    public void setNextRecommendedDifficulty(String nextRecommendedDifficulty) {
        this.nextRecommendedDifficulty = nextRecommendedDifficulty;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public List<QuestionReviewDto> getReviews() {
        return reviews;
    }

    public void setReviews(List<QuestionReviewDto> reviews) {
        this.reviews = reviews;
    }
}
