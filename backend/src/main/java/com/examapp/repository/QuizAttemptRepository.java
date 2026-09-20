package com.examapp.repository;

import com.examapp.entity.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    List<QuizAttempt> findByUser_UserIdOrderByStartedAtDesc(Long userId);
    Optional<QuizAttempt> findByAttemptIdAndUser_UserId(Long attemptId, Long userId);
    long countByUser_UserIdAndStatus(Long userId, String status);
}
