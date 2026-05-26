package com.studentportal.student;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    boolean existsByEmailIgnoreCase(String email);

    boolean existsByEnrollmentNumberIgnoreCase(String enrollmentNumber);

    Page<Student> findByLastNameContainingIgnoreCaseOrFirstNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String lastName, String firstName, String email, Pageable pageable);
}
