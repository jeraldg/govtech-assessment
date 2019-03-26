DROP DATABASE IF EXISTS govtech_assessment; 

CREATE DATABASE IF NOT EXISTS govtech_assessment;

USE govtech_assessment;

CREATE TABLE `students` (
  `email` varchar(255) NOT NULL,
  `suspended` boolean DEFAULT false,
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
