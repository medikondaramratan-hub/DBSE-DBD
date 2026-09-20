package com.examapp.service;

import com.examapp.dto.*;
import com.examapp.entity.*;
import com.examapp.exception.BadRequestException;
import com.examapp.exception.ResourceNotFoundException;
import com.examapp.exception.UnauthorizedException;
import com.examapp.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class QuizService {

    private static final Logger log = LoggerFactory.getLogger(QuizService.class);

    private final QuizAttemptRepository attemptRepository;
    private final StudentAnswerRepository answerRepository;
    private final QuestionRepository questionRepository;
    private final TopicRepository topicRepository;
    private final UserRepository userRepository;
    private final AdaptiveQuizService adaptiveQuizService;
    private final PerformanceService performanceService;

    public QuizService(QuizAttemptRepository attemptRepository,
                       StudentAnswerRepository answerRepository,
                       QuestionRepository questionRepository,
                       TopicRepository topicRepository,
                       UserRepository userRepository,
                       AdaptiveQuizService adaptiveQuizService,
                       PerformanceService performanceService) {
        this.attemptRepository = attemptRepository;
        this.answerRepository = answerRepository;
        this.questionRepository = questionRepository;
        this.topicRepository = topicRepository;
        this.userRepository = userRepository;
        this.adaptiveQuizService = adaptiveQuizService;
        this.performanceService = performanceService;
    }

    /**
     * Initiates a new adaptive quiz attempt.
     */
    @Transactional
    public QuizStartResponse startQuiz(Long userId, QuizStartRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Topic topic = topicRepository.findById(request.getTopicId())
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found with id: " + request.getTopicId()));

        int totalQuestions = (request.getTotalQuestions() != null && request.getTotalQuestions() > 0)
                ? request.getTotalQuestions()
                : 5;

        QuizAttempt attempt = new QuizAttempt();
        attempt.setUser(user);
        attempt.setSubject(topic.getSubject());
        attempt.setTopic(topic);
        attempt.setTotalQuestions(totalQuestions);
        attempt.setStartingDifficulty("MEDIUM");
        attempt.setStatus("IN_PROGRESS");
        attempt.setStartedAt(LocalDateTime.now());
        attempt.setScore(BigDecimal.ZERO);
        attempt.setAccuracy(BigDecimal.ZERO);
        attempt.setTimeTaken(0);

        QuizAttempt savedAttempt = attemptRepository.save(attempt);

        // Fetch initial baseline question (MEDIUM)
        Question firstQuestion = adaptiveQuizService.selectNextQuestion(
                topic.getTopicId(),
                Collections.emptyList(),
                "MEDIUM"
        ).orElseThrow(() -> new BadRequestException("No questions available for topic: " + topic.getTopicName()));

        QuestionDto questionDto = new QuestionDto(
                firstQuestion.getQuestionId(),
                firstQuestion.getQuestionText(),
                firstQuestion.getOptionA(),
                firstQuestion.getOptionB(),
                firstQuestion.getOptionC(),
                firstQuestion.getOptionD(),
                firstQuestion.getDifficulty(),
                1,
                totalQuestions
        );

        return new QuizStartResponse(
                savedAttempt.getAttemptId(),
                topic.getSubject().getSubjectId(),
                topic.getSubject().getSubjectName(),
                topic.getTopicId(),
                topic.getTopicName(),
                totalQuestions,
                "MEDIUM",
                questionDto
        );
    }

    /**
     * Retrieves the next question dynamically for an active attempt.
     */
    @Transactional(readOnly = true)
    public QuestionDto getNextQuestion(Long attemptId, Long userId) {
        QuizAttempt attempt = validateAttemptOwnership(attemptId, userId);

        if (!"IN_PROGRESS".equals(attempt.getStatus())) {
            throw new BadRequestException("Quiz attempt is already " + attempt.getStatus());
        }

        List<Long> answeredIds = answerRepository.findAnsweredQuestionIdsByAttemptId(attemptId);
        int answeredCount = answeredIds.size();

        if (answeredCount >= attempt.getTotalQuestions()) {
            throw new BadRequestException("All questions in this quiz attempt have already been answered");
        }

        long correctCount = answerRepository.countByAttempt_AttemptIdAndIsCorrect(attemptId, true);
        String targetDifficulty = adaptiveQuizService.determineTargetDifficulty(answeredCount, (int) correctCount);

        Question nextQuestion = adaptiveQuizService.selectNextQuestion(
                attempt.getTopic().getTopicId(),
                answeredIds,
                targetDifficulty
        ).orElseThrow(() -> new BadRequestException("No further questions available for this topic"));

        return new QuestionDto(
                nextQuestion.getQuestionId(),
                nextQuestion.getQuestionText(),
                nextQuestion.getOptionA(),
                nextQuestion.getOptionB(),
                nextQuestion.getOptionC(),
                nextQuestion.getOptionD(),
                nextQuestion.getDifficulty(),
                answeredCount + 1,
                attempt.getTotalQuestions()
        );
    }

    /**
     * Evaluates a submitted answer, saves the student response, and computes next adaptive question.
     */
    @Transactional
    public AnswerSubmissionResponse submitAnswer(Long attemptId, Long userId, AnswerSubmissionRequest request) {
        QuizAttempt attempt = validateAttemptOwnership(attemptId, userId);

        if (!"IN_PROGRESS".equals(attempt.getStatus())) {
            throw new BadRequestException("Cannot submit answers to a quiz that is " + attempt.getStatus());
        }

        Question question = questionRepository.findById(request.getQuestionId())
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + request.getQuestionId()));

        // Prevent duplicate answers for the same question within the attempt
        List<Long> alreadyAnswered = answerRepository.findAnsweredQuestionIdsByAttemptId(attemptId);
        if (alreadyAnswered.contains(question.getQuestionId())) {
            throw new BadRequestException("Question id=" + question.getQuestionId() + " has already been answered in this attempt");
        }

        boolean isCorrect = question.getCorrectAnswer().equalsIgnoreCase(request.getSelectedAnswer().trim());

        StudentAnswer studentAnswer = new StudentAnswer();
        studentAnswer.setAttempt(attempt);
        studentAnswer.setQuestion(question);
        studentAnswer.setSelectedAnswer(request.getSelectedAnswer().trim().toUpperCase());
        studentAnswer.setIsCorrect(isCorrect);
        studentAnswer.setResponseTime(request.getResponseTime() != null ? request.getResponseTime() : 0);
        studentAnswer.setQuestionDifficulty(question.getDifficulty());
        studentAnswer.setAnsweredAt(LocalDateTime.now());

        StudentAnswer savedAnswer = answerRepository.save(studentAnswer);

        // Update answer count and tracking
        alreadyAnswered.add(question.getQuestionId());
        int answeredCount = alreadyAnswered.size();
        long correctCount = answerRepository.countByAttempt_AttemptIdAndIsCorrect(attemptId, true);

        double rollingAccuracy = answeredCount > 0
                ? ((double) correctCount / answeredCount) * 100.0
                : 0.0;

        String nextDifficulty = adaptiveQuizService.determineTargetDifficulty(answeredCount, (int) correctCount);
        boolean hasMore = answeredCount < attempt.getTotalQuestions();

        QuestionDto nextQuestionDto = null;
        if (hasMore) {
            Optional<Question> nextQ = adaptiveQuizService.selectNextQuestion(
                    attempt.getTopic().getTopicId(),
                    alreadyAnswered,
                    nextDifficulty
            );
            if (nextQ.isPresent()) {
                Question q = nextQ.get();
                nextQuestionDto = new QuestionDto(
                        q.getQuestionId(),
                        q.getQuestionText(),
                        q.getOptionA(),
                        q.getOptionB(),
                        q.getOptionC(),
                        q.getOptionD(),
                        q.getDifficulty(),
                        answeredCount + 1,
                        attempt.getTotalQuestions()
                );
            } else {
                hasMore = false; // No more questions in database
            }
        }

        return new AnswerSubmissionResponse(
                savedAnswer.getAnswerId(),
                question.getQuestionId(),
                savedAnswer.getSelectedAnswer(),
                isCorrect,
                answeredCount,
                attempt.getTotalQuestions(),
                Math.round(rollingAccuracy * 100.0) / 100.0,
                nextDifficulty,
                hasMore,
                nextQuestionDto
        );
    }

    /**
     * Concludes the quiz attempt, aggregates scores, and updates topic performance records.
     */
    @Transactional
    public QuizResultDto finishQuiz(Long attemptId, Long userId) {
        QuizAttempt attempt = validateAttemptOwnership(attemptId, userId);

        if ("IN_PROGRESS".equals(attempt.getStatus())) {
            attempt.setCompletedAt(LocalDateTime.now());

            // Calculate overall duration in seconds from backend timestamps
            long durationSeconds = 0;
            if (attempt.getStartedAt() != null) {
                durationSeconds = Duration.between(attempt.getStartedAt(), attempt.getCompletedAt()).getSeconds();
            }
            attempt.setTimeTaken((int) Math.max(1, durationSeconds));

            List<StudentAnswer> answers = answerRepository.findByAttempt_AttemptIdOrderByAnswerIdAsc(attemptId);
            int total = answers.size();
            int correct = (int) answers.stream().filter(StudentAnswer::getIsCorrect).count();
            int wrong = total - correct;

            BigDecimal accuracy = total > 0
                    ? BigDecimal.valueOf(((double) correct / total) * 100.0).setScale(2, RoundingMode.HALF_UP)
                    : BigDecimal.ZERO;

            // Score = sum of marks for correct questions
            int scoreTotal = answers.stream()
                    .filter(StudentAnswer::getIsCorrect)
                    .mapToInt(a -> a.getQuestion().getMarks() != null ? a.getQuestion().getMarks() : 1)
                    .sum();

            String finalDiff = answers.isEmpty()
                    ? "MEDIUM"
                    : answers.get(answers.size() - 1).getQuestionDifficulty();

            attempt.setTotalQuestions(total);
            attempt.setCorrectAnswers(correct);
            attempt.setWrongAnswers(wrong);
            attempt.setScore(BigDecimal.valueOf(scoreTotal).setScale(2, RoundingMode.HALF_UP));
            attempt.setAccuracy(accuracy);
            attempt.setFinalDifficulty(finalDiff);
            attempt.setStatus("COMPLETED");

            attemptRepository.save(attempt);

            // Update cumulative learning performance for user & topic
            performanceService.updatePerformance(attempt.getUser(), attempt.getTopic(), attempt);
        }

        return getQuizResult(attemptId, userId);
    }

    /**
     * Assembles comprehensive quiz result breakdown for faculty/student review.
     */
    @Transactional(readOnly = true)
    public QuizResultDto getQuizResult(Long attemptId, Long userId) {
        QuizAttempt attempt = validateAttemptOwnership(attemptId, userId);

        List<StudentAnswer> answers = answerRepository.findByAttempt_AttemptIdOrderByAnswerIdAsc(attemptId);

        List<QuestionReviewDto> reviews = answers.stream().map(a -> {
            Question q = a.getQuestion();
            return new QuestionReviewDto(
                    q.getQuestionId(),
                    q.getQuestionText(),
                    q.getOptionA(),
                    q.getOptionB(),
                    q.getOptionC(),
                    q.getOptionD(),
                    a.getSelectedAnswer(),
                    q.getCorrectAnswer(),
                    a.getIsCorrect(),
                    a.getQuestionDifficulty(),
                    q.getExplanation()
            );
        }).collect(Collectors.toList());

        BigDecimal accuracy = attempt.getAccuracy() != null ? attempt.getAccuracy() : BigDecimal.ZERO;

        String performanceLevel;
        if (accuracy.doubleValue() >= 80.0) {
            performanceLevel = "Strong";
        } else if (accuracy.doubleValue() >= 50.0) {
            performanceLevel = "Moderate";
        } else {
            performanceLevel = "Needs Improvement";
        }

        String nextRecommended = adaptiveQuizService.calculateNextRecommendedDifficulty(accuracy);

        int seconds = attempt.getTimeTaken() != null ? attempt.getTimeTaken() : 0;
        int mins = seconds / 60;
        int secs = seconds % 60;
        String formattedTime = String.format("%dm %02ds", mins, secs);

        QuizResultDto result = new QuizResultDto();
        result.setAttemptId(attempt.getAttemptId());
        result.setSubjectId(attempt.getSubject() != null ? attempt.getSubject().getSubjectId() : null);
        result.setSubjectName(attempt.getSubject() != null ? attempt.getSubject().getSubjectName() : "General");
        result.setTopicId(attempt.getTopic() != null ? attempt.getTopic().getTopicId() : null);
        result.setTopicName(attempt.getTopic() != null ? attempt.getTopic().getTopicName() : "General");
        result.setTotalQuestions(attempt.getTotalQuestions() != null ? attempt.getTotalQuestions() : reviews.size());
        result.setCorrectAnswers(attempt.getCorrectAnswers() != null ? attempt.getCorrectAnswers() : 0);
        result.setWrongAnswers(attempt.getWrongAnswers() != null ? attempt.getWrongAnswers() : 0);
        result.setScore(attempt.getScore() != null ? attempt.getScore() : BigDecimal.ZERO);
        result.setAccuracy(accuracy);
        result.setTimeTaken(seconds);
        result.setTimeFormatted(formattedTime);
        result.setStartingDifficulty(attempt.getStartingDifficulty());
        result.setFinalDifficulty(attempt.getFinalDifficulty());
        result.setPerformanceLevel(performanceLevel);
        result.setNextRecommendedDifficulty(nextRecommended);
        result.setStatus(attempt.getStatus());
        result.setStartedAt(attempt.getStartedAt());
        result.setCompletedAt(attempt.getCompletedAt());
        result.setReviews(reviews);

        return result;
    }

    /**
     * Retrieves all quiz attempts completed by the authenticated student.
     */
    @Transactional(readOnly = true)
    public List<QuizAttemptSummaryDto> getQuizHistory(Long userId) {
        return attemptRepository.findByUser_UserIdOrderByStartedAtDesc(userId).stream()
                .map(a -> new QuizAttemptSummaryDto(
                        a.getAttemptId(),
                        a.getSubject() != null ? a.getSubject().getSubjectName() : "General",
                        a.getTopic() != null ? a.getTopic().getTopicName() : "General",
                        a.getTotalQuestions() != null ? a.getTotalQuestions() : 0,
                        a.getCorrectAnswers() != null ? a.getCorrectAnswers() : 0,
                        a.getScore() != null ? a.getScore() : BigDecimal.ZERO,
                        a.getAccuracy() != null ? a.getAccuracy() : BigDecimal.ZERO,
                        a.getTimeTaken() != null ? a.getTimeTaken() : 0,
                        a.getFinalDifficulty() != null ? a.getFinalDifficulty() : "MEDIUM",
                        a.getCompletedAt() != null ? a.getCompletedAt() : a.getStartedAt()
                ))
                .collect(Collectors.toList());
    }

    /**
     * Validates that the requested attempt belongs to the authenticated user.
     * Prevents cross-student data access.
     */
    private QuizAttempt validateAttemptOwnership(Long attemptId, Long userId) {
        QuizAttempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz attempt not found with id: " + attemptId));

        if (!attempt.getUser().getUserId().equals(userId)) {
            log.warn("Unauthorized attempt access: User {} tried accessing attempt {}", userId, attemptId);
            throw new UnauthorizedException("You are not authorized to view or modify this quiz attempt");
        }
        return attempt;
    }
}
