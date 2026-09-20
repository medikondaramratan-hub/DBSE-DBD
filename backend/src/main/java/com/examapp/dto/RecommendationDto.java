package com.examapp.dto;

import java.math.BigDecimal;

public class RecommendationDto {
    private Long topicId;
    private String topicName;
    private String subjectName;
    private BigDecimal accuracy;
    private String currentLevel;
    private String message;
    private String priority; // HIGH, MEDIUM, LOW

    public RecommendationDto() {
    }

    public RecommendationDto(Long topicId, String topicName, String subjectName, BigDecimal accuracy,
                             String currentLevel, String message, String priority) {
        this.topicId = topicId;
        this.topicName = topicName;
        this.subjectName = subjectName;
        this.accuracy = accuracy;
        this.currentLevel = currentLevel;
        this.message = message;
        this.priority = priority;
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

    public BigDecimal getAccuracy() {
        return accuracy;
    }

    public void setAccuracy(BigDecimal accuracy) {
        this.accuracy = accuracy;
    }

    public String getCurrentLevel() {
        return currentLevel;
    }

    public void setCurrentLevel(String currentLevel) {
        this.currentLevel = currentLevel;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }
}
