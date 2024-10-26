
USE snowSchool;

CREATE TABLE activities (
    activity_id INT AUTO_INCREMENT PRIMARY KEY,
    description TEXT NOT NULL,
    cost DECIMAL(10, 2) CHECK (cost > 0.0)
);


CREATE TABLE roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(20) NOT NULL
);


CREATE TABLE person (
    person_ci INT,
    name VARCHAR(20) NOT NULL,
    last_name VARCHAR(20) NOT NULL,
    role_id INT,
    CHECK (person_ci > 9999999),
    PRIMARY KEY (person_ci, role_id),
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
);


CREATE TABLE equipment (
    equipment_id INT AUTO_INCREMENT PRIMARY KEY,
    activity_id INT,
    description TEXT NOT NULL,
    cost DECIMAL(10, 2) CHECK (cost > 0.0),
    FOREIGN KEY (activity_id) REFERENCES activities(activity_id)
);

CREATE TABLE instructors (
    instructor_ci INT PRIMARY KEY,
    first_name VARCHAR(20) NOT NULL,
    last_name VARCHAR(20) NOT NULL,
    CHECK (instructor_ci > 9999999),
    FOREIGN KEY (instructor_ci) REFERENCES person(person_ci)
);


CREATE TABLE turns (
    turn_id INT AUTO_INCREMENT PRIMARY KEY,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL
);

CREATE TABLE students (
    student_ci INT PRIMARY KEY, -- checkeo que el número de la cédula sea válido
    first_name VARCHAR(20) NOT NULL,
    last_name VARCHAR(20) NOT NULL,
    birth_date DATE NOT NULL,
    CHECK ( student_ci > 9999999 ),
    FOREIGN KEY (student_ci) REFERENCES person(person_ci)
);

CREATE TABLE login (
    email VARCHAR(50) PRIMARY KEY,
    password VARCHAR(50) NOT NULL,
    person_ci INT,
    FOREIGN KEY (person_ci) REFERENCES person(person_ci)
);

-- ----------------------------------------------------------------

CREATE TABLE classes (
    class_id INT AUTO_INCREMENT PRIMARY KEY,
    instructor_ci INT,
    activity_id INT,
    turn_id INT,
    is_held BOOLEAN NOT NULL,
    FOREIGN KEY (instructor_ci) REFERENCES instructors(instructor_ci),
    FOREIGN KEY (activity_id) REFERENCES activities(activity_id),
    FOREIGN KEY (turn_id) REFERENCES turns(turn_id)
);

CREATE TABLE student_class (
    class_id INT,
    student_ci INT,
    equipment_id INT,
    PRIMARY KEY (class_id, student_ci),
    FOREIGN KEY (class_id) REFERENCES classes(class_id),
    FOREIGN KEY (student_ci) REFERENCES students(student_ci),
    FOREIGN KEY (equipment_id) REFERENCES equipment(equipment_id)
);


INSERT INTO roles (role_name) VALUES
('student'),
('instructor'),
('admin');

-- primeras inserciones para ir probando las cosas

INSERT INTO activities (description, cost) VALUES
('Snowboarding', 1500.00), -- id: 1
('Skiing', 1600.00), -- id: 2
('Snowmobile', 1800.00); -- id: 3

INSERT INTO equipment (activity_id, description, cost) VALUES
(1, 'Snowboard', 350.00),
(2, 'Ski set', 450.00),
(2, 'Ski set', 450.00),
(3, 'Snowmobile helmet', 300.00);

INSERT INTO person (person_ci, name, last_name, role_id) VALUES
(20000001, 'Lucas', 'Gray', 1),
(20000002, 'Olivia', 'Blue', 1),
(20000003, 'Noah', 'Black', 1),
(20000004, 'Emma', 'Red', 1),
(10000001, 'Emily', 'White', 2),
(10000002, 'Michael', 'Black', 2),
(10000003, 'Sophia', 'Green', 2),
(10000004, 'Daniel', 'Brown', 2);

INSERT INTO instructors (instructor_ci, first_name, last_name) VALUES
(10000001, 'Emily', 'White'),
(10000002, 'Michael', 'Black'),
(10000003, 'Sophia', 'Green'),
(10000004, 'Daniel', 'Brown');

INSERT INTO turns (start_time, end_time) VALUES
('09:00:00', '11:00:00'),
('12:00:00', '14:00:00'),
('16:00:00', '18:00:00');

INSERT INTO students (student_ci, first_name, last_name, birth_date) VALUES
(20000001, 'Lucas', 'Gray', '2005-05-15'),
(20000002, 'Olivia', 'Blue', '2003-08-22'),
(20000003, 'Noah', 'Black', '2006-01-12'),
(20000004, 'Emma', 'Red', '2004-12-30');

INSERT INTO classes (instructor_ci, activity_id, turn_id, is_held) VALUES
(10000001, 1, 1, TRUE),
(10000002, 2, 2, FALSE),
(10000003, 3, 3, TRUE),
(10000004, 2, 3, FALSE);

INSERT INTO student_class (class_id, student_ci, equipment_id) VALUES
(1, 20000001, 1),  -- Lucas Gray takes snowboarding class and rents a snowboard
(2, 20000002, 2),  -- Olivia Blue takes skiing class and rents ski set
(3, 20000003, 4),  -- Noah Black takes snowmobile class and rents helmet
(2, 20000004, 3);  -- Emma Red takes skiing class and rents ski set

insert into person (person_ci, name, last_name, role_id) value
(500000008, 'Manuela', 'Guedez', 1);

insert into person (person_ci, name, last_name, role_id) value
(500000005, 'nombrePrueba', 'apellidoPrueba', 1);

insert into students (student_ci, first_name, last_name, birth_date) value
(500000008,'Manuela', 'Guedez', '2005-01-18');

insert into students (student_ci, first_name, last_name, birth_date) value
(500000005,'nombrePrueba', 'apellidoPrueba', '2000-01-01');

INSERT INTO login (email, password, person_ci) VALUES
('persona1@example.com', 'persona1', 20000001),
('persona2@example.com', 'persona2', 20000002),
('persona3@example.com', 'persona3', 20000003),
('persona4@example.com', 'persona4', 20000004);

SELECT login.person_ci FROM login WHERE login.email = 'manuela@example.com' AND login.password = 'manu1234'

ALTER TABLE login
ADD role_id INT;

ALTER TABLE login
ADD CONSTRAINT fk_role
FOREIGN KEY (role_id) REFERENCES roles(role_id);

UPDATE login
SET role_id = 1;  -- Reemplaza '1' por el ID del rol 'student' si es diferente


-- (10000001, 'Emily', 'White'), agrego instructor para pruebas en el be de python
insert into login (email, password, person_ci, role_id) values
('emily.white@example.com', 'emily1234', 10000001, 2);
