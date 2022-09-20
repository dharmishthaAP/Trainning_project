CREATE DATABASE employee;

CREATE TABLE employee (
    id SERIAL NOT NULL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    gender VARCHAR(7) NOT NULL,
    email VARCHAR(50),
    last_name VARCHAR(50) NOT NULL,
    contact_no  BIGINT,
    UNIQUE(email, contact_No)
);

CREATE TABLE project (
    id SERIAL NOT NULL PRIMARY KEY,
    project_name VARCHAR(50) NOT NULL,
    start_from DATE NOT NULL,
    client_name VARCHAR(50) NOT NULL
);

CREATE TABLE employee_project_details (
    emp_id SERIAL REFERENCES employee(id) ON UPDATE CASCADE ON DELETE CASCADE,
    project_id SERIAL REFERENCES project(id) ON UPDATE CASCADE ON DELETE CASCADE,
    is_manager boolean DEFAULT FALSE,
    CONSTRAINT employee_project_details_pkey PRIMARY KEY (emp_id, project_id)
); 

