package com.examapp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public class AnswerSubmissionRequest {

    @NotNull(message = "Question ID is required")
    private Long questionId;

    @NotBlank(message = "Selected answer is required")
    @Pattern(regexp = "^[A-D]$", message = "Selected answer must be A, B, C, or D")
    private String selectedAnswer;

    private Integer responseTime = 0; // seconds

    public AnswerSubmissionRequest() {
    }

    public AnswerSubmissionRequest(Long questionId, String selectedAnswer, Integer responseTime) {
        this.questionId = questionId;
        this.selectedAnswer = selectedAnswer;
        this.responseTime = responseTime != null ? responseTime : 0;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public String getSelectedAnswer() {
        return selectedAnswer;
    }

    public void setSelectedAnswer(String selectedAnswer) {
        this.selectedAnswer = selectedAnswer;
    }

    public Integer getResponseTime() {
        return responseTime;
    }

    public void setResponseTime(Integer responseTime) {
        this.responseTime = responseTime;
    }
}
