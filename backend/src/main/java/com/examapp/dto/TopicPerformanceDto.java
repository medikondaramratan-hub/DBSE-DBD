package com.examapp.dto;

import java.math.BigDecimal;

public class TopicPerformanceDto {
    private Long topicId;
    private String topicName;
    private String subjectName;
    private int totalAttempts;
    private int totalQuestions;
    private int correctAnswers;
    private int wrongAnswers;
    private BigDecimal accuracy;
    private BigDecimal averageResponseTime;
    private String currentLevel; // BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
    private String status; // "Needs Practice", "Improving", "Strong"

    public TopicPerformanceDto() {
    }

    public TopicPerformanceDto(Long topicId, String topicName, String subjectName, int totalAttempts,
                               int totalQuestions, int correctAnswers, int wrongAnswers, BigDecimal accuracy,
                               BigDecimal averageResponseTime, String currentLevel, String status) {
        this.topicId = topicId;
        this.topicName = topicName;
        this.subjectName = subjectName;
        this.totalAttempts = totalAttempts;
        this.totalQuestions = totalQuestions;
        this.correctAnswers = correctAnswers;
        this.wrongAnswers = wrongAnswers;
        this.accuracy = accuracy;
        this.averageResponseTime = averageResponseTime;
        this.currentLevel = currentLevel;
        this.status = status;
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

    public String getSubjectName() {
        return subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public int getTotalAttempts() {
        return totalAttempts;
    }

    public void setTotalAttempts(int totalAttempts) {
        this.totalAttempts = totalAttempts;
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

    public BigDecimal getAccuracy() {
        return accuracy;
    }

    public void setAccuracy(BigDecimal accuracy) {
        this.accuracy = accuracy;
    }

    public BigDecimal getAverageResponseTime() {
        return averageResponseTime;
    }

    public void setAverageResponseTime(BigDecimal averageResponseTime) {
        this.averageResponseTime = averageResponseTime;
    }

    public String getCurrentLevel() {
        return currentLevel;
    }

    public void setCurrentLevel(String currentLevel) {
        this.currentLevel = currentLevel;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
