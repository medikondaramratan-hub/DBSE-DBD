package com.examapp.controller;

import com.examapp.dto.*;
import com.examapp.entity.User;
import com.examapp.exception.ResourceNotFoundException;
import com.examapp.repository.UserRepository;
import com.examapp.service.QuizService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    private final QuizService quizService;
    private final UserRepository userRepository;

    public QuizController(QuizService quizService, UserRepository userRepository) {
        this.quizService = quizService;
        this.userRepository = userRepository;
    }

    private Long getAuthenticatedUserId(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
        return user.getUserId();
    }

    @PostMapping("/start")
    public ResponseEntity<QuizStartResponse> startQuiz(
            @Valid @RequestBody QuizStartRequest request,
            Authentication authentication
    ) {
        Long userId = getAuthenticatedUserId(authentication);
        QuizStartResponse response = quizService.startQuiz(userId, request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{attemptId}/next-question")
    public ResponseEntity<QuestionDto> getNextQuestion(
            @PathVariable Long attemptId,
            Authentication authentication
    ) {
        Long userId = getAuthenticatedUserId(authentication);
        QuestionDto question = quizService.getNextQuestion(attemptId, userId);
        return ResponseEntity.ok(question);
    }

    @PostMapping("/{attemptId}/answer")
    public ResponseEntity<AnswerSubmissionResponse> submitAnswer(
            @PathVariable Long attemptId,
            @Valid @RequestBody AnswerSubmissionRequest request,
            Authentication authentication
    ) {
        Long userId = getAuthenticatedUserId(authentication);
        AnswerSubmissionResponse response = quizService.submitAnswer(attemptId, userId, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{attemptId}/finish")
    public ResponseEntity<QuizResultDto> finishQuiz(
            @PathVariable Long attemptId,
            Authentication authentication
    ) {
        Long userId = getAuthenticatedUserId(authentication);
        QuizResultDto result = quizService.finishQuiz(attemptId, userId);
        return ResponseEntity.ok(result);
    }

    @GetMapping(value = {"/{attemptId}", "/{attemptId}/result"})
    public ResponseEntity<QuizResultDto> getQuizResult(
            @PathVariable Long attemptId,
            Authentication authentication
    ) {
        Long userId = getAuthenticatedUserId(authentication);
        QuizResultDto result = quizService.getQuizResult(attemptId, userId);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/history")
    public ResponseEntity<List<QuizAttemptSummaryDto>> getQuizHistory(Authentication authentication) {
        Long userId = getAuthenticatedUserId(authentication);
        List<QuizAttemptSummaryDto> history = quizService.getQuizHistory(userId);
        return ResponseEntity.ok(history);
    }
}
