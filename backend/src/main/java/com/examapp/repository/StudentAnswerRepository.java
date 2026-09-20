package com.examapp.repository;

import com.examapp.entity.StudentAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentAnswerRepository extends JpaRepository<StudentAnswer, Long> {

    List<StudentAnswer> findByAttempt_AttemptIdOrderByAnswerIdAsc(Long attemptId);

    long countByAttempt_AttemptId(Long attemptId);

    long countByAttempt_AttemptIdAndIsCorrect(Long attemptId, Boolean isCorrect);

    @Query("SELECT sa.question.questionId FROM StudentAnswer sa WHERE sa.attempt.attemptId = :attemptId")
    List<Long> findAnsweredQuestionIdsByAttemptId(@Param("attemptId") Long attemptId);
}
