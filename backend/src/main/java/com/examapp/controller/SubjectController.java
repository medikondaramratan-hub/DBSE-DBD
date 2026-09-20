package com.examapp.controller;

import com.examapp.dto.SubjectDto;
import com.examapp.dto.TopicDto;
import com.examapp.service.SubjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class SubjectController {

    private final SubjectService subjectService;

    public SubjectController(SubjectService subjectService) {
        this.subjectService = subjectService;
    }

    @GetMapping("/subjects")
    public ResponseEntity<List<SubjectDto>> getAllSubjects() {
        return ResponseEntity.ok(subjectService.getAllSubjects());
    }

    @GetMapping("/subjects/{subjectId}")
    public ResponseEntity<SubjectDto> getSubjectById(@PathVariable Long subjectId) {
        return ResponseEntity.ok(subjectService.getSubjectById(subjectId));
    }

    @GetMapping("/subjects/{subjectId}/topics")
    public ResponseEntity<List<TopicDto>> getTopicsBySubject(@PathVariable Long subjectId) {
        return ResponseEntity.ok(subjectService.getTopicsBySubject(subjectId));
    }

    @GetMapping("/topics/{topicId}")
    public ResponseEntity<TopicDto> getTopicById(@PathVariable Long topicId) {
        return ResponseEntity.ok(subjectService.getTopicById(topicId));
    }
}
