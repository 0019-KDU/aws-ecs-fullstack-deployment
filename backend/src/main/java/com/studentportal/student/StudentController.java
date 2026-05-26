package com.studentportal.student;

import com.studentportal.student.dto.PageResponse;
import com.studentportal.student.dto.StudentRequest;
import com.studentportal.student.dto.StudentResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/api/v1/students")
@RequiredArgsConstructor
@Tag(name = "Students", description = "Operations on student records")
public class StudentController {

    private final StudentService service;

    @GetMapping
    @Operation(summary = "List students (paginated, optional search)")
    public PageResponse<StudentResponse> list(
            @RequestParam(required = false) String search,
            @PageableDefault(size = 20, sort = "lastName", direction = Sort.Direction.ASC) Pageable pageable) {
        Page<StudentResponse> page = service.list(search, pageable);
        return PageResponse.from(page);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a student by id")
    public StudentResponse get(@PathVariable Long id) {
        return service.get(id);
    }

    @PostMapping
    @Operation(summary = "Create a new student")
    public ResponseEntity<StudentResponse> create(@Valid @RequestBody StudentRequest req) {
        StudentResponse created = service.create(req);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.id())
                .toUri();
        return ResponseEntity.created(location).body(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing student")
    public StudentResponse update(@PathVariable Long id, @Valid @RequestBody StudentRequest req) {
        return service.update(id, req);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a student")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
