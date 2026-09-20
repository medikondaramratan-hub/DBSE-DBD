package com.examapp.controller;

import com.examapp.dto.PerformanceSummaryDto;
import com.examapp.dto.RecommendationDto;
import com.examapp.dto.TopicPerformanceDto;
import com.examapp.entity.User;
import com.examapp.exception.ResourceNotFoundException;
import com.examapp.repository.UserRepository;
import com.examapp.service.PerformanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/performance")
public class PerformanceController {

    private final PerformanceService performanceService;
    private final UserRepository userRepository;

    public PerformanceController(PerformanceService performanceService, UserRepository userRepository) {
        this.performanceService = performanceService;
        this.userRepository = userRepository;
    }

    private Long getAuthenticatedUserId(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
        return user.getUserId();
    }

    @GetMapping("/me")
    public ResponseEntity<PerformanceSummaryDto> getMyPerformance(Authentication authentication) {
        Long userId = getAuthenticatedUserId(authentication);
        PerformanceSummaryDto summary = performanceService.getPerformanceSummary(userId);
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/me/topics")
    public ResponseEntity<List<TopicPerformanceDto>> getMyTopicPerformances(Authentication authentication) {
        Long userId = getAuthenticatedUserId(authentication);
        List<TopicPerformanceDto> topics = performanceService.getTopicPerformances(userId);
        return ResponseEntity.ok(topics);
    }

    @GetMapping("/me/recommendations")
    public ResponseEntity<List<RecommendationDto>> getMyRecommendations(Authentication authentication) {
        Long userId = getAuthenticatedUserId(authentication);
        List<RecommendationDto> recommendations = performanceService.getRecommendations(userId);
        return ResponseEntity.ok(recommendations);
    }
}
