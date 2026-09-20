package com.examapp.repository;

import com.examapp.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    List<Question> findByTopic_TopicId(Long topicId);

    List<Question> findByTopic_TopicIdAndDifficulty(Long topicId, String difficulty);

    @Query("SELECT q FROM Question q WHERE q.topic.topicId = :topicId AND q.difficulty = :difficulty AND q.questionId NOT IN :excludedIds")
    List<Question> findAvailableByTopicAndDifficulty(
            @Param("topicId") Long topicId,
            @Param("difficulty") String difficulty,
            @Param("excludedIds") Collection<Long> excludedIds
    );

    @Query("SELECT q FROM Question q WHERE q.topic.topicId = :topicId AND q.questionId NOT IN :excludedIds")
    List<Question> findAvailableByTopic(
            @Param("topicId") Long topicId,
            @Param("excludedIds") Collection<Long> excludedIds
    );

    long countByTopic_TopicId(Long topicId);
}
