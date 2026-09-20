package com.examapp.dto;

public class TopicDto {
    private Long topicId;
    private Long subjectId;
    private String subjectName;
    private String topicName;
    private String description;
    private long totalQuestions;

    public TopicDto() {
    }

    public TopicDto(Long topicId, Long subjectId, String subjectName, String topicName, String description, long totalQuestions) {
        this.topicId = topicId;
        this.subjectId = subjectId;
        this.subjectName = subjectName;
        this.topicName = topicName;
        this.description = description;
        this.totalQuestions = totalQuestions;
    }

    public Long getTopicId() {
        return topicId;
    }

    public void setTopicId(Long topicId) {
        this.topicId = topicId;
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

    public String getTopicName() {
        return topicName;
    }

    public void setTopicName(String topicName) {
        this.topicName = topicName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public long getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(long totalQuestions) {
        this.totalQuestions = totalQuestions;
    }
}
