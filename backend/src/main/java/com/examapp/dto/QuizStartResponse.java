package com.examapp.dto;

public class QuizStartResponse {
    private Long attemptId;
    private Long subjectId;
    private String subjectName;
    private Long topicId;
    private String topicName;
    private int totalQuestions;
    private String startingDifficulty;
    private QuestionDto firstQuestion;

    public QuizStartResponse() {
    }

    public QuizStartResponse(Long attemptId, Long subjectId, String subjectName, Long topicId,
                             String topicName, int totalQuestions, String startingDifficulty, QuestionDto firstQuestion) {
        this.attemptId = attemptId;
        this.subjectId = subjectId;
        this.subjectName = subjectName;
        this.topicId = topicId;
        this.topicName = topicName;
        this.totalQuestions = totalQuestions;
        this.startingDifficulty = startingDifficulty;
        this.firstQuestion = firstQuestion;
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

    public String getStartingDifficulty() {
        return startingDifficulty;
    }

    public void setStartingDifficulty(String startingDifficulty) {
        this.startingDifficulty = startingDifficulty;
    }

    public QuestionDto getFirstQuestion() {
        return firstQuestion;
    }

    public void setFirstQuestion(QuestionDto firstQuestion) {
        this.firstQuestion = firstQuestion;
    }
}
