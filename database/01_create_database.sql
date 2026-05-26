-- Run once on your MySQL server to create the schema and an application user.
-- Adjust the password before running in any shared environment.

CREATE DATABASE IF NOT EXISTS student_portal
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'student_portal'@'%' IDENTIFIED BY 'ChangeMe!Local';
GRANT ALL PRIVILEGES ON student_portal.* TO 'student_portal'@'%';
FLUSH PRIVILEGES;
