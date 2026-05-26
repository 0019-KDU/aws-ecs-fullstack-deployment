package com.studentportal.student.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record StudentRequest(
        @NotBlank(message = "First name is required")
        @Size(max = 60, message = "First name must be at most 60 characters")
        String firstName,

        @NotBlank(message = "Last name is required")
        @Size(max = 60, message = "Last name must be at most 60 characters")
        String lastName,

        @NotBlank(message = "Email is required")
        @Email(message = "Email must be a valid address")
        @Size(max = 120, message = "Email must be at most 120 characters")
        String email,

        @Past(message = "Date of birth must be in the past")
        @JsonFormat(pattern = "yyyy-MM-dd")
        LocalDate dateOfBirth,

        @NotBlank(message = "Enrollment number is required")
        @Size(max = 30)
        @Pattern(regexp = "^[A-Za-z0-9-]+$", message = "Enrollment number may contain only letters, digits and dashes")
        String enrollmentNumber
) {
}
