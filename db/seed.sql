DROP DATABASE IF EXISTS govtech; 

CREATE DATABASE IF NOT EXISTS govtech;

USE govtech;

CREATE TABLE `students` (
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `teachers` (
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `teacher_students` (
  `teacherEmail` varchar(255) NOT NULL,
  `studentEmail` varchar(255) NOT NULL,
  PRIMARY KEY (`teacherEmail`,`studentEmail`),
  KEY `studentEmail` (`studentEmail`),
  CONSTRAINT `teacher_students_ibfk_1` FOREIGN KEY (`teacherEmail`) REFERENCES `teachers` (`email`),
  CONSTRAINT `teacher_students_ibfk_2` FOREIGN KEY (`studentEmail`) REFERENCES `students` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO students (email) VALUES ('commonstudent1@gmail.com');
INSERT INTO students (email) VALUES ('commonstudent2@gmail.com');
INSERT INTO students (email) VALUES ('student_only_under_teacher_ken@gmail.com');

INSERT INTO teachers (email) VALUES ('teacherjoe@example.com');
INSERT INTO teachers (email) VALUES ('teacherken@example.com');
