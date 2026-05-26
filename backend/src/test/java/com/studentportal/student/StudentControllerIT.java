package com.studentportal.student;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.studentportal.student.dto.StudentRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class StudentControllerIT {

    @Autowired MockMvc mvc;
    @Autowired ObjectMapper json;

    @Test
    void createAndListStudent() throws Exception {
        StudentRequest req = new StudentRequest(
                "Ada", "Lovelace", "ada@example.com",
                LocalDate.of(1815, 12, 10), "ENR-001");

        mvc.perform(post("/api/v1/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.email").value("ada@example.com"))
                .andExpect(jsonPath("$.enrollmentNumber").value("ENR-001"));

        mvc.perform(get("/api/v1/students"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].firstName").value("Ada"));
    }

    @Test
    void rejectsInvalidEmail() throws Exception {
        StudentRequest bad = new StudentRequest(
                "X", "Y", "not-an-email", null, "ENR-002");
        mvc.perform(post("/api/v1/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json.writeValueAsString(bad)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.email").exists());
    }
}
