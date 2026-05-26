package com.studentportal.student;

import com.studentportal.common.exception.DuplicateResourceException;
import com.studentportal.common.exception.ResourceNotFoundException;
import com.studentportal.student.dto.StudentRequest;
import com.studentportal.student.dto.StudentResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StudentService {

    private final StudentRepository repository;

    public Page<StudentResponse> list(String search, Pageable pageable) {
        Page<Student> page = StringUtils.hasText(search)
                ? repository.findByLastNameContainingIgnoreCaseOrFirstNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                        search, search, search, pageable)
                : repository.findAll(pageable);
        return page.map(StudentResponse::from);
    }

    public StudentResponse get(Long id) {
        return StudentResponse.from(findOrThrow(id));
    }

    @Transactional
    public StudentResponse create(StudentRequest req) {
        if (repository.existsByEmailIgnoreCase(req.email())) {
            throw new DuplicateResourceException("A student with email '" + req.email() + "' already exists.");
        }
        if (repository.existsByEnrollmentNumberIgnoreCase(req.enrollmentNumber())) {
            throw new DuplicateResourceException(
                    "A student with enrollment number '" + req.enrollmentNumber() + "' already exists.");
        }

        Student student = Student.builder()
                .firstName(req.firstName().trim())
                .lastName(req.lastName().trim())
                .email(req.email().trim().toLowerCase())
                .dateOfBirth(req.dateOfBirth())
                .enrollmentNumber(req.enrollmentNumber().trim().toUpperCase())
                .build();

        return StudentResponse.from(repository.save(student));
    }

    @Transactional
    public StudentResponse update(Long id, StudentRequest req) {
        Student student = findOrThrow(id);

        String newEmail = req.email().trim().toLowerCase();
        if (!student.getEmail().equalsIgnoreCase(newEmail)
                && repository.existsByEmailIgnoreCase(newEmail)) {
            throw new DuplicateResourceException("A student with email '" + newEmail + "' already exists.");
        }

        String newEnrollment = req.enrollmentNumber().trim().toUpperCase();
        if (!student.getEnrollmentNumber().equalsIgnoreCase(newEnrollment)
                && repository.existsByEnrollmentNumberIgnoreCase(newEnrollment)) {
            throw new DuplicateResourceException(
                    "A student with enrollment number '" + newEnrollment + "' already exists.");
        }

        student.setFirstName(req.firstName().trim());
        student.setLastName(req.lastName().trim());
        student.setEmail(newEmail);
        student.setDateOfBirth(req.dateOfBirth());
        student.setEnrollmentNumber(newEnrollment);

        return StudentResponse.from(student);
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Student with id " + id + " not found.");
        }
        repository.deleteById(id);
    }

    private Student findOrThrow(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student with id " + id + " not found."));
    }
}
