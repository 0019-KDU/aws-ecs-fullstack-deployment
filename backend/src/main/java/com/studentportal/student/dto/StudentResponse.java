package com.studentportal.student.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.studentportal.student.Student;

import java.time.Instant;
import java.time.LocalDate;

public record StudentResponse(
        Long id,
        String firstName,
        String lastName,
        String email,
        @JsonFormat(pattern = "yyyy-MM-dd") LocalDate dateOfBirth,
        String enrollmentNumber,
        Instant createdAt,
        Instant updatedAt
) {
    public static StudentResponse from(Student s) {
        return new StudentResponse(
                s.getId(),
                s.getFirstName(),
                s.getLastName(),
                s.getEmail(),
                s.getDateOfBirth(),
                s.getEnrollmentNumber(),
                s.getCreatedAt(),
                s.getUpdatedAt()
        );
    }
}
