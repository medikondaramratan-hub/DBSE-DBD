package com.examapp.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class QuizAttemptSummaryDto {
    private Long attemptId;
    private String subjectName;
    private String topicName;
    private int totalQuestions;
    private int correctAnswers;
    private BigDecimal score;
    private BigDecimal accuracy;
    private int timeTaken;
    private String finalDifficulty;
    private LocalDateTime completedAt;

    public QuizAttemptSummaryDto() {
    }

    public QuizAttemptSummaryDto(Long attemptId, String subjectName, String topicName, int totalQuestions,
                                int correctAnswers, BigDecimal score, BigDecimal accuracy, int timeTaken,
                                String finalDifficulty, LocalDateTime completedAt) {
        this.attemptId = attemptId;
        this.subjectName = subjectName;
        this.topicName = topicName;
        this.totalQuestions = totalQuestions;
        this.correctAnswers = correctAnswers;
        this.score = score;
        this.accuracy = accuracy;
        this.timeTaken = timeTaken;
        this.finalDifficulty = finalDifficulty;
        this.completedAt = completedAt;
    }

    public Long getAttemptId() {
        return attemptId;
    }

    public void setAttemptId(Long attemptId) {
        this.attemptId = attemptId;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
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

    public String getFinalDifficulty() {
        return finalDifficulty;
    }

    public void setFinalDifficulty(String finalDifficulty) {
        this.finalDifficulty = finalDifficulty;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}
