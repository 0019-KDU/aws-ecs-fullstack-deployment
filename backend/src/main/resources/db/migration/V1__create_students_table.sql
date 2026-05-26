CREATE TABLE students (
    id                  BIGINT       NOT NULL AUTO_INCREMENT,
    first_name          VARCHAR(60)  NOT NULL,
    last_name           VARCHAR(60)  NOT NULL,
    email               VARCHAR(120) NOT NULL,
    date_of_birth       DATE         NULL,
    enrollment_number   VARCHAR(30)  NOT NULL,
    created_at          DATETIME(6)  NOT NULL,
    updated_at          DATETIME(6)  NOT NULL,
    version             BIGINT       NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    CONSTRAINT uk_students_email             UNIQUE (email),
    CONSTRAINT uk_students_enrollment_number UNIQUE (enrollment_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_students_last_name ON students (last_name);
