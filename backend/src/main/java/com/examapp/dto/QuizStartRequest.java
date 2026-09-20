package com.examapp.dto;

import jakarta.validation.constraints.NotNull;

public class QuizStartRequest {

    @NotNull(message = "Topic ID is required")
    private Long topicId;

    private Integer totalQuestions = 5;

    public QuizStartRequest() {
    }

    public QuizStartRequest(Long topicId, Integer totalQuestions) {
        this.topicId = topicId;
        this.totalQuestions = totalQuestions != null && totalQuestions > 0 ? totalQuestions : 5;
    }

    public Long getTopicId() {
        return topicId;
    }

    public void setTopicId(Long topicId) {
        this.topicId = topicId;
    }

    public Integer getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(Integer totalQuestions) {
        this.totalQuestions = totalQuestions;
    }
}
