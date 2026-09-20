package com.examapp;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:postgresql://localhost:5432/exam_prep_db",
    "spring.datasource.username=postgres",
    "spring.datasource.password=postgres"
})
class ExamPrepApplicationTests {

    @Test
    void contextLoads() {
    }
}
