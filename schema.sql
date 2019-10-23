CREATE DATABASE EMPLOYEETRACKER_DB;

USE EMPLOYEETRACKER_DB;

CREATE TABLE DEPARTMENT(
ID INT AUTO_INCREMENT PRIMARY KEY,
NAME VARCHAR(30)
);

CREATE TABLE ROLE(
ID INT AUTO_INCREMENT PRIMARY KEY,
TITLE VARCHAR(30),
SALARY DECIMAL (12,2),
DEPARTMENT_ID INT 
);

CREATE TABLE EMPLOYEE(
ID INT AUTO_INCREMENT PRIMARY KEY,
FIRST_NAME VARCHAR(30),
LAST_NAME VARCHAR(30),
ROLE_ID INT,
MANAGER_ID INT
)