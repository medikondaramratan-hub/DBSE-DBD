package com.examapp.dto;

public class AnswerSubmissionResponse {
    private Long answerId;
    private Long questionId;
    private String selectedAnswer;
    private boolean isCorrect;
    private int currentQuestionNumber;
    private int totalQuestions;
    private double currentAccuracy;
    private String nextDifficulty;
    private boolean hasMoreQuestions;
    private QuestionDto nextQuestion;

    public AnswerSubmissionResponse() {
    }

    public AnswerSubmissionResponse(Long answerId, Long questionId, String selectedAnswer, boolean isCorrect,
                                  int currentQuestionNumber, int totalQuestions, double currentAccuracy,
                                  String nextDifficulty, boolean hasMoreQuestions, QuestionDto nextQuestion) {
        this.answerId = answerId;
        this.questionId = questionId;
        this.selectedAnswer = selectedAnswer;
        this.isCorrect = isCorrect;
        this.currentQuestionNumber = currentQuestionNumber;
        this.totalQuestions = totalQuestions;
        this.currentAccuracy = currentAccuracy;
        this.nextDifficulty = nextDifficulty;
        this.hasMoreQuestions = hasMoreQuestions;
        this.nextQuestion = nextQuestion;
    }

    public Long getAnswerId() {
        return answerId;
    }

    public void setAnswerId(Long answerId) {
        this.answerId = answerId;
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

    public boolean isCorrect() {
        return isCorrect;
    }

    public void setCorrect(boolean correct) {
        isCorrect = correct;
    }

    public int getCurrentQuestionNumber() {
        return currentQuestionNumber;
    }

    public void setCurrentQuestionNumber(int currentQuestionNumber) {
        this.currentQuestionNumber = currentQuestionNumber;
    }

    public int getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(int totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public double getCurrentAccuracy() {
        return currentAccuracy;
    }

    public void setCurrentAccuracy(double currentAccuracy) {
        this.currentAccuracy = currentAccuracy;
    }

    public String getNextDifficulty() {
        return nextDifficulty;
    }

    public void setNextDifficulty(String nextDifficulty) {
        this.nextDifficulty = nextDifficulty;
    }

    public boolean isHasMoreQuestions() {
        return hasMoreQuestions;
    }

    public void setHasMoreQuestions(boolean hasMoreQuestions) {
        this.hasMoreQuestions = hasMoreQuestions;
    }

    public QuestionDto getNextQuestion() {
        return nextQuestion;
    }

    public void setNextQuestion(QuestionDto nextQuestion) {
        this.nextQuestion = nextQuestion;
    }
}
