package com.examapp.service;

import com.examapp.dto.SubjectDto;
import com.examapp.dto.TopicDto;
import com.examapp.entity.Subject;
import com.examapp.entity.Topic;
import com.examapp.exception.ResourceNotFoundException;
import com.examapp.repository.QuestionRepository;
import com.examapp.repository.SubjectRepository;
import com.examapp.repository.TopicRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class SubjectService {

    private final SubjectRepository subjectRepository;
    private final TopicRepository topicRepository;
    private final QuestionRepository questionRepository;

    public SubjectService(SubjectRepository subjectRepository,
                          TopicRepository topicRepository,
                          QuestionRepository questionRepository) {
        this.subjectRepository = subjectRepository;
        this.topicRepository = topicRepository;
        this.questionRepository = questionRepository;
    }

    @Cacheable(value = "subjects", unless = "#result == null || #result.isEmpty()")
    public List<SubjectDto> getAllSubjects() {
        return subjectRepository.findAll().stream()
                .map(s -> new SubjectDto(
                        s.getSubjectId(),
                        s.getSubjectName(),
                        s.getDescription(),
                        s.getIcon(),
                        s.getTopics() != null ? s.getTopics().size() : 0
                ))
                .collect(Collectors.toList());
    }

    public SubjectDto getSubjectById(Long subjectId) {
        Subject s = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + subjectId));

        return new SubjectDto(
                s.getSubjectId(),
                s.getSubjectName(),
                s.getDescription(),
                s.getIcon(),
                s.getTopics() != null ? s.getTopics().size() : 0
        );
    }

    @Cacheable(value = "topicsBySubject", key = "#subjectId")
    public List<TopicDto> getTopicsBySubject(Long subjectId) {
        if (!subjectRepository.existsById(subjectId)) {
            throw new ResourceNotFoundException("Subject not found with id: " + subjectId);
        }

        return topicRepository.findBySubject_SubjectId(subjectId).stream()
                .map(t -> {
                    long qCount = questionRepository.countByTopic_TopicId(t.getTopicId());
                    return new TopicDto(
                            t.getTopicId(),
                            t.getSubject().getSubjectId(),
                            t.getSubject().getSubjectName(),
                            t.getTopicName(),
                            t.getDescription(),
                            qCount
                    );
                })
                .collect(Collectors.toList());
    }

    public TopicDto getTopicById(Long topicId) {
        Topic t = topicRepository.findById(topicId)
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found with id: " + topicId));

        long qCount = questionRepository.countByTopic_TopicId(t.getTopicId());
        return new TopicDto(
                t.getTopicId(),
                t.getSubject().getSubjectId(),
                t.getSubject().getSubjectName(),
                t.getTopicName(),
                t.getDescription(),
                qCount
        );
    }
}
