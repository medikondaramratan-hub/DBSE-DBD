package com.examapp.repository;

import com.examapp.entity.Performance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PerformanceRepository extends JpaRepository<Performance, Long> {

    List<Performance> findByUser_UserId(Long userId);

    Optional<Performance> findByUser_UserIdAndTopic_TopicId(Long userId, Long topicId);

    List<Performance> findByUser_UserIdOrderByAccuracyAsc(Long userId);

    List<Performance> findByUser_UserIdOrderByAccuracyDesc(Long userId);
}
