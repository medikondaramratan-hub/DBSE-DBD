package com.examapp.dto;

public class SubjectDto {
    private Long subjectId;
    private String subjectName;
    private String description;
    private String icon;
    private int topicCount;

    public SubjectDto() {
    }

    public SubjectDto(Long subjectId, String subjectName, String description, String icon, int topicCount) {
        this.subjectId = subjectId;
        this.subjectName = subjectName;
        this.description = description;
        this.icon = icon;
        this.topicCount = topicCount;
    }

    public Long getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(Long subjectId) {
        this.subjectId = subjectId;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public int getTopicCount() {
        return topicCount;
    }

    public void setTopicCount(int topicCount) {
        this.topicCount = topicCount;
    }
}
