CREATE DATABASE snowSchool;
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
    person_id INT PRIMARY KEY AUTO_INCREMENT,
    person_ci INT UNIQUE, -- la cédula debe ser única
    name VARCHAR(20) NOT NULL,
    last_name VARCHAR(20) NOT NULL
);

CREATE TABLE equipment (
    equipment_id INT AUTO_INCREMENT PRIMARY KEY,
    activity_id INT,
    description TEXT NOT NULL,
    cost DECIMAL(10, 2) CHECK (cost > 0.0),
    FOREIGN KEY (activity_id) REFERENCES activities(activity_id)
);

CREATE TABLE instructors (
    person_id INT PRIMARY KEY,
    instructor_ci INT,
    first_name VARCHAR(20) NOT NULL,
    last_name VARCHAR(20) NOT NULL,
    CHECK (instructor_ci > 9999999),
    FOREIGN KEY (instructor_ci) REFERENCES person(person_ci),
    FOREIGN KEY (person_id) REFERENCES person(person_id)
);

CREATE TABLE turns (
    turn_id INT AUTO_INCREMENT PRIMARY KEY,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL
);

CREATE TABLE students (
    person_id INT PRIMARY KEY,
    student_ci INT, -- checkeo que el número de la cédula sea válido
    first_name VARCHAR(20) NOT NULL,
    last_name VARCHAR(20) NOT NULL,
    birth_date DATE NOT NULL,
    CHECK ( student_ci > 9999999 ),
    FOREIGN KEY (student_ci) REFERENCES person(person_ci),
    FOREIGN KEY (person_id) REFERENCES person(person_ID)
);

CREATE TABLE login (
    email VARCHAR(50) PRIMARY KEY,
    password VARCHAR(50) NOT NULL,
    person_ci INT,
    role_id INT,
    FOREIGN KEY (role_id) REFERENCES roles(role_id),
    FOREIGN KEY (person_ci) REFERENCES person(person_ci)
);

-- ----------------------------------------------------------------

CREATE TABLE classes (
    class_id INT PRIMARY KEY AUTO_INCREMENT ,
    instructor_ci INT,
    activity_id INT,
    turn_id INT,
    dictated BOOLEAN,
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

-- Equipos para Snowboarding
INSERT INTO equipment (activity_id, description, cost) VALUES
(1, 'Tabla de snowboard', 300.00),
(1, 'Botas de snowboard', 100.00),
(1, 'Casco para snowboard', 50.00),
(1, 'Traje de snowboard', 120.00),
(1, 'Gafas de snowboard', 40.00);

-- Equipos para Skiing
INSERT INTO equipment (activity_id, description, cost) VALUES
(2, 'Esquís', 320.00),
(2, 'Botas de esquí', 120.00),
(2, 'Casco de esquí', 60.00),
(2, 'Traje de esquí', 130.00),
(2, 'Gafas de esquí', 45.00),
(2, 'Bastones de esquí', 30.00);

-- Equipos para Snowmobile
INSERT INTO equipment (activity_id, description, cost) VALUES
(3, 'Motos de nieve', 1000.00),
(3, 'Casco para moto de nieve', 60.00),
(3, 'Traje de moto de nieve', 150.00),
(3, 'Guantes para moto de nieve', 35.00),
(3, 'Botas para moto de nieve', 90.00);

-- INSERT INTO person (person_ci, name, last_name, role_id) VALUES
-- (20000001, 'Lucas', 'Gray', 1),
-- (20000002, 'Olivia', 'Blue', 1),
-- (20000003, 'Noah', 'Black', 1),
-- (20000004, 'Emma', 'Red', 1),
-- (10000001, 'Emily', 'White', 2),
-- (10000002, 'Michael', 'Black', 2),
-- (10000003, 'Sophia', 'Green', 2),
-- (10000004, 'Daniel', 'Brown', 2);

-- INSERT INTO instructors (instructor_ci, first_name, last_name) VALUES
-- (10000001, 'Emily', 'White'),
-- (10000002, 'Michael', 'Black'),
-- (10000003, 'Sophia', 'Green'),
-- (10000004, 'Daniel', 'Brown');

INSERT INTO turns (start_time, end_time) VALUES
('09:00:00', '11:00:00'),
('12:00:00', '14:00:00'),
('16:00:00', '18:00:00');

-- inserción de personas
INSERT INTO person (person_ci, name, last_name) VALUES
(43158769, 'Lucas', 'González'), -- id 1
(41256398, 'Mariana', 'Pérez'), -- id 2
(35478956, 'Juan', 'Sánchez'), -- id 3
(45987654, 'Sofía', 'Herrera'), -- id 4
(43211578, 'Andrés', 'Gutiérrez'), -- id 5
(36752147, 'Laura', 'Torres'), -- id 6
(45612874, 'Martín', 'Ramírez'), -- id 7
(41289654, 'Camila', 'López'), -- id 8 
(40123458, 'Federico', 'Martínez'), -- id 9
(38965412, 'Valentina', 'Castro'), -- 10 
(43987654, 'Alejandro', 'Fernández'),-- 11
(41657890, 'Paula', 'Morales'),-- 12
(44751236, 'Rodrigo', 'Vega'),-- 13
(37865421, 'Gabriela', 'Díaz'),-- 14
(46789012, 'Nicolás', 'Ruiz'), -- 15
(42135687, 'Daniela', 'Benítez'), -- 16
(40987654, 'Santiago', 'Ortiz'), -- 17
(43258790, 'Julia', 'Méndez'), -- 18
(45678901, 'Agustín', 'Figueroa'), -- 19
(41789056, 'Luciana', 'Ríos'); -- 20

-- inserción de estudiantes
INSERT INTO students (person_id, student_ci, first_name, last_name, birth_date) VALUES
(1, 43158769, 'Lucas', 'González', '2003-03-12'),
(2, 41256398, 'Mariana', 'Pérez', '2004-07-25'),
(3, 35478956, 'Juan', 'Sánchez', '2001-11-03'),
(4, 45987654, 'Sofía', 'Herrera', '2005-01-18'),
(7, 45612874, 'Martín', 'Ramírez', '2004-09-17'),
(8, 41289654, 'Camila', 'López', '2005-10-30'),
(9, 40123458, 'Federico', 'Martínez', '2004-04-04'),
(10, 38965412, 'Valentina', 'Castro', '2005-02-15'),
(12, 41657890, 'Paula', 'Morales', '2002-08-03'),
(13, 44751236, 'Rodrigo', 'Vega', '2003-10-21'),
(15, 46789012, 'Nicolás', 'Ruiz', '2004-05-30'),
(16, 42135687, 'Daniela', 'Benítez', '2003-03-14'),
(17, 40987654, 'Santiago', 'Ortiz', '2005-07-07'),
(19, 45678901, 'Agustín', 'Figueroa', '2004-12-01'),
(20, 41789056, 'Luciana', 'Ríos', '2001-06-11');

-- inserción de instructores
INSERT INTO instructors (person_id, instructor_ci, first_name, last_name) VALUES
(5, 43211578, 'Andrés', 'Gutiérrez'),
(6, 36752147, 'Laura', 'Torres'),
(11, 43987654, 'Alejandro', 'Fernández'),
(14, 37865421, 'Gabriela', 'Díaz'),
(18, 43258790, 'Julia', 'Méndez');

SELECT * from classes;

INSERT INTO classes (instructor_ci, activity_id, turn_id) VALUES
(43211578, 1, 1), -- Andrés Gutiérrez, Snowboarding, turno de 09:00 a 11:00
(36752147, 2, 2), -- Laura Torres, Skiing, turno de 12:00 a 14:00
(43987654, 3, 3), -- Alejandro Fernández, Snowmobile, turno de 16:00 a 18:00
(37865421, 1, 2), -- Gabriela Díaz, Snowboarding, turno de 12:00 a 14:00
(43258790, 2, 1); -- Julia Méndez, Skiing, turno de 09:00 a 11:00

INSERT INTO student_class (class_id, student_ci) VALUES
(1, 43158769), -- Lucas en la clase de Andrés Gutiérrez (Snowboarding, 09:00-11:00)
(1, 41256398), -- Mariana en la clase de Andrés Gutiérrez (Snowboarding, 09:00-11:00)
(2, 35478956), -- Juan en la clase de Laura Torres (Skiing, 12:00-14:00)
(2, 45612874), -- Martín en la clase de Laura Torres (Skiing, 12:00-14:00)
(3, 45987654), -- Sofía en la clase de Alejandro Fernández (Snowmobile, 16:00-18:00)
(3, 41289654), -- Camila en la clase de Alejandro Fernández (Snowmobile, 16:00-18:00)
(4, 40123458), -- Federico en la clase de Gabriela Díaz (Snowboarding, 12:00-14:00)
(4, 38965412), -- Valentina en la clase de Gabriela Díaz (Snowboarding, 12:00-14:00)
(5, 44751236), -- Rodrigo en la clase de Julia Méndez (Skiing, 09:00-11:00)
(5, 41657890); -- Paula en la clase de Julia Méndez (Skiing, 09:00-11:00)

-- datos para el loign
INSERT INTO login (email, password, person_ci, role_id) VALUES
('lucas.gonzalez@email.com', 'Pass123!lucas', 43158769, 1),
('mariana.perez@gmail.com', 'MariPerez88$', 41256398, 1),
('juan.sanchez@outlook.com', 'Juan1975!#', 35478956, 1),
('sofia.herrera@email.com', 'S0fiaH18', 45987654, 1),
('andres.gutierrez@yahoo.com', 'And1990@#!', 43211578, 2),
('laura.torres@gmail.com', 'LauraT123', 36752147, 2),
('martin.ramirez@email.com', 'Martin94*Pass', 45612874, 1),
('camila.lopez@outlook.com', 'Camila1989&', 41289654, 1),
('federico.martinez@yahoo.com', 'FedMart!87', 40123458, 1),
('valentina.castro@gmail.com', 'ValeC_8415', 38965412, 1),
('alejandro.fernandez@email.com', 'AleFern91#', 43987654, 2),
('paula.morales@outlook.com', 'Pau1986+Mor', 41657890, 2),
('rodrigo.vega@gmail.com', 'R0dri93!', 44751236, 1),
('gabriela.diaz@yahoo.com', 'G4briD82$', 37865421, 2),
('nicolas.ruiz@email.com', 'NicoRuiz96*', 46789012, 1),
('daniela.benitez@gmail.com', 'D4niBen88@', 42135687, 1),
('santiago.ortiz@outlook.com', 'SantiOrt85#', 40987654, 1),
('julia.mendez@yahoo.com', 'JuliaM90#*', 43258790, 2),
('agustin.figueroa@gmail.com', 'AgusFigu92%', 45678901, 1),
('luciana.rios@email.com', 'LucianaR!87', 41789056, 1);

-- agrega usuario admin al sistema
insert into person (person_ci, name, last_name) value
(111111111, 'admin', 'admin');

insert into login (email, password, person_ci, role_id) value
('ucusnowschool@gmail.com', '@dminSnowSchool', 111111111, 3);

ALTER TABLE classes
ADD COLUMN start_date DATE;

ALTER TABLE classes
ADD COLUMN end_date DATE;

-- nuevas tablas para poder implementar cosas mejores :)
CREATE TABLE days (
    day_id INT PRIMARY KEY AUTO_INCREMENT,
    day_name VARCHAR(20) NOT NULL
);

INSERT INTO days (day_name) VALUES 
('lunes'),
('martes'),
('miercoles'),
('jueves'),
('viernes'); -- agregar sábado y domingo??

CREATE TABLE class_day (
    class_id INT,
    day_id INT,
    PRIMARY KEY (class_id, day_id),
    FOREIGN KEY (class_id) REFERENCES classes(class_id),
    FOREIGN KEY (day_id) REFERENCES  days(day_id)
);

CREATE TABLE class_session (
    id_class_session INT PRIMARY KEY AUTO_INCREMENT,
    class_id INT,
    class_date DATE,
    day_id INT,
    dictated BOOLEAN DEFAULT false,
    FOREIGN KEY (class_id) REFERENCES classes(class_id),
    FOREIGN KEY (day_id) REFERENCES days(day_id)
);

CREATE TABLE class_attendance (
    id_class_session INT,
    student_id INT,
    attended BOOLEAN,
    PRIMARY KEY (id_class_session, student_id),
    FOREIGN KEY (id_class_session) REFERENCES class_session(id_class_session),
    FOREIGN KEY (student_id) REFERENCES students(person_id)
);

-- se ponen las clases creadas anteriormente con las fechas del semestre
UPDATE classes SET start_date = '2024-11-11', end_date = '2024-11-30';

CREATE TABLE equipment_rental (
    class_id INT,
    person_id INT,
    equipment_id INT,
    FOREIGN KEY (class_id) REFERENCES classes(class_id),
    FOREIGN KEY  (person_id) REFERENCES students(person_id),
    FOREIGN KEY (equipment_id) REFERENCES equipment(equipment_id),
    PRIMARY KEY (class_id, person_id, equipment_id)
);

-- algunas restricciones
ALTER TABLE classes
MODIFY COLUMN start_date DATE NOT NULL;
    
ALTER TABLE classes
MODIFY COLUMN end_date DATE NOT NULL;

ALTER TABLE classes
ADD CONSTRAINT chk_dates CHECK (start_date < end_date);

-- Clase 1: Snowboarding, Andrés Gutiérrez, turno 09:00 a 11:00
INSERT INTO class_day (class_id, day_id) VALUES (1, 1); -- Lunes
INSERT INTO class_day (class_id, day_id) VALUES (1, 3); -- Miércoles

-- Clase 2: Skiing, Laura Torres, turno 12:00 a 14:00
INSERT INTO class_day (class_id, day_id) VALUES (2, 2); -- Martes
INSERT INTO class_day (class_id, day_id) VALUES (2, 4); -- Jueves

-- Clase 3: Snowmobile, Alejandro Fernández, turno 16:00 a 18:00
INSERT INTO class_day (class_id, day_id) VALUES (3, 1); -- Lunes
INSERT INTO class_day (class_id, day_id) VALUES (3, 5); -- Viernes

-- Clase 4: Snowboarding, Gabriela Díaz, turno 12:00 a 14:00
INSERT INTO class_day (class_id, day_id) VALUES (4, 2); -- Martes
INSERT INTO class_day (class_id, day_id) VALUES (4, 4); -- Jueves

-- Clase 5: Skiing, Instructor 43258790, turno 09:00 a 11:00
INSERT INTO class_day (class_id, day_id) VALUES (5, 3); -- Miércoles
INSERT INTO class_day (class_id, day_id) VALUES (5, 5); -- Viernes

ALTER TABLE classes
ADD COLUMN is_group BOOLEAN DEFAULT TRUE;

-- dado un instructor obtiene las clases que tiene en los días especificados en el turno especificado
SELECT
    c.class_id,
    i.first_name,
    i.last_name,
    c.activity_id,
    c.turn_id,
    cd.day_id
FROM
    classes c
JOIN
    instructors i ON i.instructor_ci = c.instructor_ci
JOIN
    class_day cd ON cd.class_id = c.class_id
WHERE
    i.person_id = 5           -- id del instructor a buscar
    AND c.turn_id = 1         -- id del turno a buscar
    AND  (c.start_date <= '2024-12-11'
    OR c.end_date >= '2024-11-11')
    AND cd.day_id IN (1, 3)    -- lista de ids de los días específicos
ORDER BY
    cd.day_id, c.turn_id;

-- get id with ci
SELECT person.person_id FROM person WHERE person_ci = 43158769;

SELECT * FROM activities;

SELECT c.turn_id, cd.day_id, i.person_id as instructor_id
FROM classes c
JOIN class_day cd ON c.class_id = cd.class_id
JOIN instructors i ON c.instructor_ci = i.instructor_ci
WHERE c.class_id = 1;

-- corroboración para saber si el instructor está
SELECT c.class_id
FROM classes c
JOIN instructors i ON c.instructor_ci = i.instructor_ci
JOIN turns t ON c.turn_id = t.turn_id -- para qué???
JOIN class_day cd ON c.class_id = cd.class_id
WHERE c.class_id = 1
    AND i.person_id = 5
    AND c.turn_id = 1
    AND cd.day_id IN (1, 3);


SELECT s.student_ci FROM students s WHERE s.person_id = 19;


SELECT DISTINCT c.class_id, d.day_name, t.start_time, t.end_time
FROM classes c
JOIN class_day cd ON c.class_id = cd.class_id
JOIN days d ON cd.day_id = d.day_id
JOIN turns t ON c.turn_id = t.turn_id
LEFT JOIN student_class sc ON c.class_id = sc.class_id
WHERE c.is_group = TRUE
    AND (SELECT COUNT(*) FROM student_class WHERE class_id = c.class_id) < 10
    AND c.is_deleted = FALSE
    AND c.class_id NOT IN (
        SELECT class_id
        FROM student_class
        WHERE student_ci = 500000005
    )
    AND NOT EXISTS (
        SELECT 1
        FROM student_class sc2
        JOIN classes c2 ON sc2.class_id = c2.class_id
        JOIN class_day cd2 ON c2.class_id = cd2.class_id
        JOIN days d2 ON cd2.day_id = d2.day_id
        JOIN turns t2 ON c2.turn_id = t2.turn_id
        WHERE sc2.student_ci = 500000005
        AND c.turn_id = c2.turn_id
        AND d.day_id = d2.day_id
        AND c.start_date <= c2.end_date
        AND c2.end_date <= c.start_date
    );

SELECT DISTINCT e.description, e.cost
FROM classes c
JOIN equipment e ON c.activity_id = e.activity_id
WHERE c.activity_id = (
    select c2.activity_id
    FROM classes c2
    WHERE c2.class_id = 1
    );

SELECT er.class_id
FROM equipment_rental er
WHERE er.class_id = 1
    AND er.equipment_id IN (1, 3)
    AND er.person_id = 1;

SELECT sc.student_ci
FROM student_class sc
WHERE sc.student_ci = 43158769 AND sc.class_id = 1;


SELECT activities.description, turns.start_time, turns.end_time,
       c.start_date, c.end_date, c.is_group, i.first_name as instructor_first_name, i.last_name as instructor_last_name
FROM classes c
    JOIN activities ON (c.activity_id = activities.activity_id)
    JOIN turns ON (c.turn_id = turns.turn_id)
    JOIN instructors i on (c.instructor_ci = i.instructor_ci)
WHERE c.class_id = 1;

SELECT classes.instructor_ci
FROM classes
WHERE class_id =1
AND instructor_ci = 43211578;

-- lista de inscriptos dada una clase
SELECT s.person_id as student_id, s.first_name, s.last_name
FROM students s
JOIN student_class sc ON s.student_ci = sc.student_ci
WHERE sc.class_id = 13;

SELECT cs.id_class_session
FROM class_session cs
WHERE cs.class_id = 13
AND cs.class_date = '2024-11-15';

update classes set classes.end_date = '2024-11-14' WHERE class_id = 5;

SELECT c.class_id, c.start_date, c.end_date, a.description, t.start_time, t.end_time, cs.class_date
FROM classes c
JOIN turns t on c.turn_id = t.turn_id
JOIN activities a on a.activity_id = c.activity_id
JOIN instructors i on i.instructor_ci = c.instructor_ci
JOIN class_session cs on c.class_id = cs.class_id
WHERE i.instructor_ci = 43258790;

-- alumno ocupado en estas fechas con estos horarios
 SELECT
    c.class_id,
    s.first_name,
    s.last_name,
    c.activity_id,
    c.turn_id,
    cd.day_id
FROM
    classes c
JOIN
    student_class sc on sc.class_id = c.class_id
JOIN students s on sc.student_ci = s.student_ci
JOIN
    class_day cd ON cd.class_id = c.class_id
WHERE
    s.person_id = 23
    AND c.turn_id = 1
    AND cd.day_id IN (1, 2, 3)
    AND (c.start_date <= '2024-12-20' AND '2024-12-02' <= c.end_date );
    --                  fecha inicio                fecha fin


-- tablas con datos eliminables directamente

ALTER TABLE person
ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE;

ALTER TABLE instructors
ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE;

ALTER TABLE students
ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE;

ALTER TABLE turns
ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE;

-- tablas que por cascade deberían eliminar datos

ALTER TABLE class_day
ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE;

ALTER TABLE class_session
ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE;

ALTER TABLE login
ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE;

ALTER TABLE student_class
ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE;

ALTER TABLE classes
ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE;

-- Creación de usuario para realizar unicamente operaciones de CRUD desde la app
CREATE USER 'app_user'@'%' IDENTIFIED BY 'obligatorio_bd1';

-- Se otorgan permisos de CRUD sobre todas las tablas de la bd del proyecto
GRANT SELECT, INSERT, UPDATE, DELETE ON snowSchool.* TO 'app_user'@'%';
FLUSH PRIVILEGES;

SHOW GRANTS FOR 'app_user'@'%';


-- Creación de usuario para realizar unicamente operaciones de CRUD desde la app
CREATE USER 'app_user'@'%' IDENTIFIED BY 'obligatorio_bd1';

-- Se otorgan permisos de CRUD sobre todas las tablas de la bd del proyecto
GRANT SELECT, INSERT, UPDATE, DELETE ON snowSchool.* TO 'app_user'@'%';
FLUSH PRIVILEGES;

SHOW GRANTS FOR 'app_user'@'%';


SELECT person.person_ci FROM person WHERE person_id = 7 AND person.is_deleted = FALSE

UPDATE person SET is_deleted = FALSE WHERE person_ci = 56542342

    SELECT r.role_name
    FROM roles r
    JOIN login l on r.role_id = l.role_id
    where l.person_ci = 56542342 -- AND l.is_deleted = FALSE
