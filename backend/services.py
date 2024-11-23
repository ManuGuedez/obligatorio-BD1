import mysql.connector as mysql

cnx = mysql.connect(user='root', password='rootpassword', host='127.0.0.1', database='snowSchool') #host.docker.internal #mysql
cursor = cnx.cursor(dictionary=True) # devuelve la info en formato key-value
from mysql.connector.errors import IntegrityError
import algoritmo
from datetime import datetime, time, timedelta, date

def validate_student(student):
    if len(student) != 4:
        raise ValueError("Asegurate de haber ingrsado correctamente los datos")
    
    try:
        ci = student["ci"]
        name = student["first_name"]
        last_name = student["last_name"]
        birth_date = student["birth_date"]
    except KeyError:
        raise ValueError("Asegurate de haber ingrsado las key correspondientes.")

    query = "SELECT students.student_ci FROM students WHERE students.student_ci = %s AND students.first_name = %s AND students.last_name = %s AND students.birth_date = %s"
    cursor.execute(query, (ci, name, last_name, birth_date))
    data = cursor.fetchall()

    if len(data) <= 0:
        return -1 # no hay alumnos con la info que se recibió
    
    data = data[0]
    return data["student_ci"]

'''
Ingresar info de alumno y ver si existe en la tabla de alumnos
'''
def create_student_account(student, email, password):
    response = -2
    
    try:
        response = validate_student(student)
    except ValueError:
        return -1, "Los datos ingresados no son correctos"
    
    if response == -1:
        return -1, "No hay un alumno que cumpla con las especificaciones en la bd, primero debe ser ingresado al sistema por el adminsitrador"
    
    query = "SELECT login.email FROM login WHERE login.person_ci = %s"
    cursor.execute(query, (response, ))
    data = cursor.fetchall()
    if len(data) > 0 :
        message = "Ya hay un alumno ingrsado en el sistema con el mail" + data[0]["email"]
        return -1, message
    
    ci = student["ci"]
    role_id = get_role_id('student')
    query = "INSERT INTO login (email, password, person_ci, role_id) VALUE (%s, %s, %s, %s)"
    cursor.execute(query, (email, password, ci, role_id))
    result = cursor.rowcount
    
    # verificación de que la isnerción fue exitosa
    if result > 0:
        message = 'Usuario creado exitosamente'
        print(message)
    else:
        message = 'No se pudo crear el usuario'
        print(message)

    # confirma los cambios en la base de datos
    cnx.commit()
 
    return result, message

def validate_user(email, password):
    """
        Valdia la existencia del usuario en la base de datos.
    """
    query =  query = "SELECT login.person_ci, login.role_id FROM login WHERE login.email = %s AND login.password = %s AND login.is_deleted = FALSE"
    cursor.execute(query, (email, password))
    data = cursor.fetchall()
    
    if len(data) > 0:
        return data[0]['person_ci'], data[0]['role_id']
    return None, None

def validate_instructor(instructor):
    if len(instructor) != 3:
        raise ValueError("Asegurate de haber ingrsado correctamente los datos")
    
    try:
        ci = instructor["ci"]
        name = instructor["first_name"]
        last_name = instructor["last_name"]
    except KeyError:
        raise ValueError("Asegurate de haber ingrsado las key correspondientes.")

    query = "SELECT instructors.instructor_ci FROM instructors WHERE instructors.instructor_ci = %s AND instructors.first_name = %s AND instructors.last_name = %s AND instructors.is_deleted = FALSE"
    cursor.execute(query, (ci, name, last_name))
    data = cursor.fetchall()

    if len(data) <= 0:
        return -1 # no hay instructores con la info que se recibió
    
    data = data[0]
    return data["instructor_ci"]

def create_instructor_account(instructor, email, password):
    response = -2
    
    try:
        response = validate_instructor(instructor)
    except ValueError:
        return -1, "Los datos ingresados no son correctos"
    
    if response == -1:
        return -1, "No hay un instructor que cumpla con las especificaciones en la bd, primero debe ser ingresado al sistema por el adminsitrador"
    
    query = "SELECT login.email FROM login WHERE login.person_ci = %s AND login.is_deleted = FALSE"
    cursor.execute(query, (response,))
    data = cursor.fetchall()
    if len(data) > 0 :
        message = "Ya hay un instructor ingrsado en el sistema con el mail" + data[0]["email"]
        return -1, message
    
    ci = instructor["ci"]
    role_id = get_role_id('instructor')
    query = "INSERT INTO login (email, password, person_ci, role_id) VALUE (%s, %s, %s, %s)"
    cursor.execute(query, (email, password, ci, role_id))
    result = cursor.rowcount
    
    # verificación de que la isnerción fue exitosa
    if result > 0:
        message = 'Usuario creado exitosamente'
        print(message)
    else:
        message = 'No se pudo crear el usuario'
        print(message)

    # confirma los cambios en la base de datos
    cnx.commit()
 
    return result, message

def get_person_data(person_id):
    query = """
    SELECT person_id, name AS first_name, last_name
    FROM person WHERE person_ci = %s
    AND is_deleted = FALSE
    """
    cursor.execute(query, (person_id,))
    data = cursor.fetchall()
    return data

def get_role(role_id):
    query = f'SELECT roles.role_name FROM roles WHERE roles.role_id = {role_id}'
    cursor.execute(query)
    data = cursor.fetchall()
    
    if len(data) > 0:
        return data[0].get('role_name')
    return None

def get_role_id(role):
    query = f'SELECT roles.role_id FROM roles WHERE role_name = \'{role}\''
    cursor.execute(query)
    data = cursor.fetchall()
    
    if len(data) > 0:
        return data[0]['role_id']
    return -1 

def cast_date(date: datetime.date):
    return date.strftime("%Y-%m-%d")

def cast_time(current_time):
    hours, remainder = divmod(current_time.seconds, 3600)
    minutes, seconds = divmod(remainder, 60)
    new_time = time(hours, minutes, seconds)
    return new_time.strftime('%H:%M:%S')

def get_class_turn(class_id):
    query = 'SELECT turn_id FROM classes WHERE class_id = %s AND classes.is_deleted = FALSE'
    cursor.execute(query, (class_id,))
    data = cursor.fetchall()
    
    if len(data) > 0:
        return int(data[0]['turn_id'])
    return -1 

def get_class_information_for_instructor(class_id):
    query = """
    SELECT activities.description, turns.start_time, turns.end_time, login.email as instructor_email 
    FROM classes 
        JOIN activities ON (classes.activity_id = activities.activity_id) 
        JOIN turns ON (classes.turn_id = turns.turn_id) 
        JOIN login ON (classes.instructor_ci = login.person_ci) 
    WHERE classes.class_id = %s
          AND classes.is_deleted = FALSE 
    """
    
    cursor.execute(query, (class_id,))
    data = cursor.fetchall()
    
    if len(data) > 0:
        return data[0]
    return -1 
    
def modify_class_turn(class_id, new_turn_id):

    query = "UPDATE classes SET turn_id = %s  WHERE class_id = %s AND classes.is_deleted = FALSE"
    
    try:
        cursor.execute(query, (new_turn_id, class_id))
        cnx.commit()  
        if cursor.rowcount > 0:
            return 1, "Turno de la clase modificado exitosamente."
        else:
            return -1, "No se encontró la clase con el ID especificado o el turno ya estaba actualizado."
    except mysql.Error as err:
        return -1, f"Error al modificar la clase: {err}"

def modify_class_instructor(class_id, instructor_ci):
    update = "UPDATE classes SET instructor_ci = %s WHERE class_id = %s AND classes.is_deleted = FALSE"
    
    try:
        cursor.execute(update, (instructor_ci, class_id))
        cnx.commit()  
        if cursor.rowcount > 0:
            # mandar mail al instructor avisando que fue asignado para dar esta clase
            return 1, "Instructor de la clase modificado exitosamente."
        else:
            return -1, "No se encontró la clase con el ID especificado o el instructor ya la estaba dictando."
    except mysql.Error as err:
        return -1, f"Error al modificar la clase: {err}"
    
def get_person_id_with_ci(person_ci):
    query = 'SELECT person.person_id FROM person WHERE person_ci = %s AND person.is_deleted = FALSE'
    cursor.execute(query,(person_ci,))
    data = cursor.fetchall()
    
    if len(data) > 0:
        return data[0]['person_id']
    return -1

def get_days():
    
    query = 'SELECT * FROM days'
    cursor.execute(query)
    data = cursor.fetchall()
    
    result = dict()
    for i in range(len(data)):
        info = data[i]
        day = info['day_name']
        id = info['day_id']
        result[day] = id
        
    return result

def retrieve_instructor_classes_by_turn_and_days(instructor_id, turn_id, days_id, start_date, end_date):
    # qurey = '''
    #     SELECT
    #         c.class_id,
    #         i.first_name,
    #         i.last_name,
    #         c.activity_id,
    #         c.turn_id,
    #         cd.day_id
    #     FROM
    #         classes c
    #     JOIN
    #         instructors i ON i.instructor_ci = c.instructor_ci
    #     JOIN
    #         class_day cd ON cd.class_id = c.class_id
    #     WHERE
    #         i.person_id = %s          
    #         AND c.turn_id = %s  
    #         AND cd.day_id IN 
    # '''
    select = 'SELECT c.class_id, c.activity_id, c.turn_id, cd.day_id FROM classes c '
    joins = 'JOIN instructors i ON i.instructor_ci = c.instructor_ci JOIN class_day cd ON cd.class_id = c.class_id '
    where = 'WHERE i.person_id = %s AND c.turn_id = %s AND (c.start_date <= %s and %s <= c.end_date) AND c.is_deleted = FALSE AND cd.day_id IN '
    
    days = '('+ str(days_id)[1:-1] + ')'
    
    query = select + joins + where + days
    cursor.execute(query, (instructor_id, turn_id, end_date, start_date))
    data = cursor.fetchall()
   
    return data


def is_instructor_busy(instructor_id, turn_id, days_ids, start_date, end_date):
    classes = retrieve_instructor_classes_by_turn_and_days(instructor_id, turn_id, days_ids, start_date, end_date)

    return len(classes) > 0

def get_person_ci_with_id(person_id):
    query = 'SELECT person.person_ci FROM person WHERE person_id = %s AND person.is_deleted = FALSE'
    cursor.execute(query,(person_id,))
    data = cursor.fetchall()
    
    if len(data) > 0:
        return data[0]['person_ci']
    return -1

def get_activities():
    query = 'SELECT * FROM activities'
    cursor.execute(query)
    data = cursor.fetchall()
    
    result = dict()
    for i in range(len(data)):
        info = data[i]
        day = info['description']
        id = info['activity_id']
        result[day] = id
        
    return result

def add_class(instructor_ci, activity_id, turn_id, start_date, end_date, days_ids, type):
    
    try:
        if type:
            is_group = False
        else:
            is_group = True
            
        insert = 'INSERT INTO classes (instructor_ci, activity_id, turn_id, start_date, end_date, is_group) VALUE (%s, %s, %s, %s, %s, %s)'
        cursor.execute(insert, (instructor_ci, activity_id, turn_id, start_date, end_date, is_group))
        cnx.commit()  
        class_id = -1
        
        # en caso de haber podido agregar la clase a la tabla classes
        if cursor.rowcount > 0:
            
            class_id = cursor.lastrowid # obtiene el id de la clase recién insertada
            insert = "INSERT INTO class_day (class_id, day_id) VALUES "
            values = ""
            for i in days_ids:
                values += f"({str(class_id)}, {str(i)}),"
            
            values = values[:-1]
            
            insert = insert + values
            cursor.execute(insert)
            cnx.commit()
            
            # si se pudo insertar en la tabla class_day
            if cursor.rowcount > 0:
                fechas = algoritmo.generar_calendario(start_date, end_date, days_ids)
                
                insert = "INSERT INTO class_session (class_id, class_date, day_id, dictated) VALUES " # por defecto se establece como no dictada
                days = get_days()
                values = ""
                for fecha in fechas:
                    id_dia = days.get(fecha[1])
                    values += f"({class_id}, \'{fecha[0]}\', {id_dia}, FALSE),"
                
                values = values[:-1]
                insert = insert + values
                cursor.execute(insert)
                cnx.commit()
                
                if cursor.rowcount > 0:
                    # mandar mail al instructor avisando que fue asignado para dar esta clase
                    return 1, "Nueva clase creada exitosamente."
                else:
                    rollback_added_class(class_id)
                    return -1, "Hubo un error creando la clase."
            else:
                rollback_added_class(class_id)
                return -1, "Hubo un error creando la clase."
            
        else:
            return -1, "Hubo un problema, no fue posible crear la clase."
    except mysql.Error as err:
        rollback_added_class(class_id)
        return -1, f"Error al crear la clase: {err}"

# para cuando sale mal la inserción que se despliegue la cadena
def rollback_added_class(class_id):
    delete = "DELETE FROM class_day WHERE class_id = " + str(class_id)
    cursor.execute(delete)
    cnx.commit()
    
    delete = "DELETE FROM classes WHERE class_id = " + str(class_id)
    cursor.execute(delete)
    cnx.commit()

def get_basic_class_info(class_id):
    query = """
    SELECT c.turn_id, cd.day_id, i.person_id as instructor_id, c.start_date, c.end_date
    FROM classes c
    JOIN class_day cd ON c.class_id = cd.class_id
    JOIN instructors i ON c.instructor_ci = i.instructor_ci
        WHERE c.class_id = %s AND c.is_deleted = FALSE
    """
    cursor.execute(query, (class_id,))
    data = cursor.fetchall()

    return data

def get_instructor_schedule(instructor_id, turn_id, days_ids):
    query = """
    SELECT c.class_id
    FROM classes c
    JOIN instructors i ON c.instructor_ci = i.instructor_ci
    JOIN turns t ON c.turn_id = t.turn_id -- para qué???
    JOIN class_day cd ON c.class_id = cd.class_id
    WHERE i.person_id = %s
        AND c.turn_id = %s
        AND c.is_deleted = FALSE
        AND cd.day_id IN
    """
    
    days = ' ('+ str(days_ids)[1:-1] + ')'
    query = query + days
    
    cursor.execute(query, (instructor_id, turn_id))
    data = cursor.fetchall()
    return data # if len(data) > 0, then the instructor is busy 

def can_modify(start_time, end_time, days):
    # si hoy no se dicta la clase se puede modificar
    dia_actual = datetime.now().weekday() + 1 
    if not dia_actual in days:
        return True
    
    # si hoy se dicta, verificar horario
    if isinstance(start_time, timedelta):
        start_time = (datetime.min + start_time).time()
    if isinstance(end_time, timedelta):
        end_time = (datetime.min + end_time).time()
        
    current_time = datetime.now().time()
    
    if start_time <= current_time and end_time >= current_time:
        return False
    else:
        return True
    
def get_turn_time(turn_id):
    query = 'SELECT t.start_time, t.end_time FROM turns as t WHERE t.turn_id = %s AND t.is_deleted = FALSE'
    cursor.execute(query,(turn_id,))
    data = cursor.fetchall()
    
    if len(data) > 0:
        return data[0]
    return -1

def add_person(person_ci, name, last_name):
    query = 'SELECT person.person_id, person.is_deleted FROM person WHERE person_ci = %s'
    cursor.execute(query, (person_ci,))
    data = cursor.fetchall()
    
    if len(data) > 0:
        if data[0]['is_deleted'] == 1: # si la persona está eliminada lógicamente
            update = "UPDATE person SET is_deleted = FALSE WHERE person_ci = %s"
            cursor.execute(update, (person_ci,))
            
        return data[0]['person_id']
            
    insert = 'INSERT INTO person (person_ci, name, last_name) VALUE (%s, %s, %s)'
    cursor.execute(insert, (person_ci, name, last_name))
    result = cursor.rowcount
    
    if result > 0:
        return cursor.lastrowid # devuelve id de la persona recién insertada
    return -1

def add_instructor(person_id, instructor_ci, first_name, last_name):
    query = 'SELECT i.instructor_ci, i.is_deleted FROM instructors i WHERE i.instructor_ci = %s'
    cursor.execute(query, (instructor_ci,))
    data = cursor.fetchall()
    
    if len(data) > 0:
        if data[0]['is_deleted'] == 1: # si la persona está eliminada lógicamente
            update = "UPDATE instructors SET is_deleted = FALSE WHERE instructor_ci = %s"
            cursor.execute(update, (instructor_ci,))
            cnx.commit()
            return data[0]['instructor_ci'] 
        return -1, "Ya hay un instructor ingresado con la ci ingresada."
    else:
        insert = "INSERT INTO instructors (person_id, instructor_ci, first_name, last_name) VALUE (%s, %s, %s, %s)"
        cursor.execute(insert, (person_id, instructor_ci, first_name, last_name))
        cnx.commit()
        
    result = cursor.rowcount
    
    if result > 0:
        return 1, "Instructor agregado exitosamente al sistema."    
    return -1, "Hubo un error al ingresar el instrucor al sistema."

def add_student(person_id, student_ci, first_name, last_name, birth_date):
    query = 'SELECT s.student_ci, s.is_deleted FROM students s WHERE s.student_ci = %s'
    cursor.execute(query, (student_ci,))
    data = cursor.fetchall()
    
    if len(data) > 0:
        if data[0]['is_deleted'] == 1: # si la persona está eliminada lógicamente
            update = "UPDATE students SET is_deleted = FALSE WHERE student_ci = %s"
            cursor.execute(update, (student_ci,))
            cnx.commit()
            return data[0]['student_ci'] 
        return -1, "Ya hay un estudiante ingresado con la ci ingresada."
    else:
        insert = "INSERT INTO students (person_id, student_ci, first_name, last_name, birth_date) VALUE (%s, %s, %s, %s, %s)"
        cursor.execute(insert, (person_id, student_ci, first_name, last_name, birth_date))
        cnx.commit()
    result = cursor.rowcount
    
    if result > 0:
        return 1, "Estudiante agregado exitosamente al sistema."    
    return -1, "Hubo un error al ingresar al estudiante en el sistema."



def retrieve_student_classes_by_turn_and_days(student_id, turn_id, days_id, start_date, end_date):        
    query = """
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
            s.person_id = %s
            AND c.turn_id = %s
            AND (c.start_date <= %s and %s <= c.end_date)
            AND c.is_deleted = FALSE
            AND cd.day_id IN 
    """
    
    days = '('+ str(days_id)[1:-1] + ')'
    query = query + days
    
    cursor.execute(query, (student_id, turn_id, end_date, start_date))
    data = cursor.fetchall()
   
    return data

def is_student_busy(student_id, turn_id, days_ids, start_date, end_date):
    classes = retrieve_student_classes_by_turn_and_days(student_id, turn_id, days_ids, start_date, end_date)
    return len(classes) > 0


def enrolled_students_count(class_id):
    query = 'SELECT COUNT(*) AS enrolled_students FROM student_class WHERE class_id = %s AND is_deleted = FALSE'
    cursor.execute(query, (class_id,))
    data = cursor.fetchall()
    
    if len(data) <= 0:
        return data
    return data[0]['enrolled_students']


def add_student_to_class(student_ci, class_id):
    insert = "INSERT INTO student_class (class_id, student_ci) VALUES (%s, %s)"
    try:
        # Ejecución de la consulta con parámetros
        cursor.execute(insert, (class_id, student_ci))
        cnx.commit()
        if cursor.rowcount > 0:
            return 1, "Estudiante agregado a la clase exitosamente."
        else:
            return -1, "Error al agregar al estudiante a la clase."
    except IntegrityError as e:
        if e.errno == 1452: # código de error de fk
            return -1, "No hay un estudiante con el id ingresado"
        elif e.errno == 1062: # código de clave repetida
            return 1, "El alumno ya se encontraba inscripto en la clase."
            
    except mysql.Error as err:
        return -1, f"Error al agregar el estudiante: {err}, student_ci: " + str(student_ci)
    
    
def remove_student_from_class(class_id, student_ci):
    delete = "DELETE FROM student_class WHERE class_id = %s AND student_ci = %s"

    try:
        cursor.execute(delete, (class_id, student_ci))
        cnx.commit()

        if cursor.rowcount > 0:
            return 1, "Estudiante eliminado de la clase exitosamente."
        elif cursor.rowcount == 0:
            return 1, "El estudiante no se encontraba inscripto en la clase."
        else:
            return -1, "Error al eliminar al estudiante de la clase."

    except mysql.Error as err:
        return -1, f"Error al eliminar el estudiante: {err}"
    


def get_available_classes(student_ci):
    query = """
        SELECT DISTINCT c.class_id, d.day_name, t.start_time, t.end_time
        FROM classes c
        JOIN class_day cd ON c.class_id = cd.class_id
        JOIN days d ON cd.day_id = d.day_id
        JOIN turns t ON c.turn_id = t.turn_id
        LEFT JOIN student_class sc ON c.class_id = sc.class_id
        WHERE ((c.is_group = TRUE
            AND (SELECT COUNT(*) FROM student_class WHERE class_id = c.class_id) < 10)
            OR (c.is_group = FALSE 
            AND (SELECT COUNT(*) FROM student_class WHERE class_id = c.class_id) < 1))
            AND c.is_deleted = FALSE
            AND c.class_id NOT IN (
                SELECT class_id 
                FROM student_class 
                WHERE student_ci = %s
            )
            AND NOT EXISTS (
                SELECT 1 
                FROM student_class sc2
                JOIN classes c2 ON sc2.class_id = c2.class_id
                JOIN class_day cd2 ON c2.class_id = cd2.class_id
                JOIN days d2 ON cd2.day_id = d2.day_id
                JOIN turns t2 ON c2.turn_id = t2.turn_id
                WHERE sc2.student_ci = %s
                AND c.turn_id = c2.turn_id
                AND d.day_id = d2.day_id
                AND c.start_date <= c2.end_date
                AND c2.start_date <= c.end_date
            );
    """
    cursor.execute(query, (student_ci, student_ci))
    data = cursor.fetchall()
    classes = dict()
    
    for current_class in data:
        current_class['start_time'] = cast_time(current_class['start_time'])
        current_class['end_time'] = cast_time(current_class['end_time'])
        
        class_id = current_class['class_id']
        day_name = current_class['day_name']

        if not classes.get(class_id):
            end_time = current_class['end_time']
            start_time = current_class['start_time']
            classes[class_id] = {'class_id': class_id, 'days': [day_name], 'start_time': start_time, 'end_time': end_time}
        else:
            c = classes.get(class_id)
            days = c.get("days")
            days.append(day_name)

    
    return list(classes.values())



def get_rentable_equipment(class_id):
    query = """
    SELECT DISTINCT e.description, e.cost, e.equipment_id
    FROM classes c
    JOIN equipment e ON c.activity_id = e.activity_id
    WHERE c.class_id = %s
    AND c.is_deleted = FALSE
    """
    cursor.execute(query, (class_id, ))
    data = cursor.fetchall()
    
    return data


def rent_equipment(class_id, student_id, equipment_id):
    rentable_equipment = get_rentable_equipment(class_id)
    rentable_equipment = [equipment['equipment_id'] for equipment in rentable_equipment]
    
    for e in equipment_id:
        if not e in rentable_equipment:
            return -1, "El equipo rentado debe ser de la actividad correspondiente a la clase."
            
    
    insert = "INSERT INTO equipment_rental (class_id, person_id, equipment_id) VALUE (%s, %s, %s) "
    for id in equipment_id:
        try:
            cursor.execute(insert, (class_id, student_id, id))
            cnx.commit()
            result = cursor.rowcount
            
            if result <= 0:
                return -1, "Algo salió mal rentando equipamiento."    
        except IntegrityError: # en caso de que ya esté rentado el equipamiento
            continue
    
    return 1, "Equipos rentados exitosamente"
    
    
def is_student_enrolled(student_ci, class_id):
    query = """
    SELECT sc.student_ci
    FROM student_class sc
    WHERE sc.student_ci = %s AND sc.class_id = %s AND sc.is_deleted = FALSE
    """
    cursor.execute(query, (student_ci, class_id))
    data = cursor.fetchall()
    
    return len(data) > 0

def get_extended_class_info(class_id):
    query = """
    SELECT activities.description, turns.start_time, turns.end_time,
            c.start_date, c.end_date, c.is_group, i.first_name as instructor_first_name, 
            i.last_name as instructor_last_name
    FROM classes c
        JOIN activities ON (c.activity_id = activities.activity_id)
        JOIN turns ON (c.turn_id = turns.turn_id)
        JOIN instructors i on (c.instructor_ci = i.instructor_ci)
    WHERE c.class_id = %s AND c.is_deleted = FALSE
    """
    cursor.execute(query, (class_id, ))
    data = cursor.fetchall()
    
    if len(data) <= 0:
        return -1, "No hay una clase activa con el id especificado."
    
    current_class = data[0]
    current_class['start_time'] = cast_time(current_class['start_time'])
    current_class['end_time'] = cast_time(current_class['end_time'])
    
    current_class["start_date"] = cast_date(current_class["start_date"])
    current_class["end_date"] = cast_date(current_class["end_date"])
    current_class['is_group'] = current_class['is_group'] == 1
    
    return 1, data

def is_instructor_responsible(class_id, instructor_ci):
    query = """
    SELECT classes.instructor_ci
    FROM classes
    WHERE class_id = %s
    AND instructor_ci = %s
    AND classes.is_deleted = FALSE
    """
    cursor.execute(query, (class_id, instructor_ci))
    data = cursor.fetchall()
    
    return len(data) > 0

def get_enrolled_students(class_id):
    query = """
    SELECT s.person_id as student_id, s.first_name, s.last_name
    FROM students s
    JOIN student_class sc ON s.student_ci = sc.student_ci
    WHERE sc.class_id = %s
    AND sc.is_deleted = FALSE
    """
    cursor.execute(query, (class_id, ))
    data = cursor.fetchall()
    return data

def get_id_class_session(class_id, date):
    query = """
    SELECT cs.id_class_session
    FROM class_session cs
    WHERE cs.class_id = %s
    AND cs.class_date = %s
    AND cs.is_deleted = FALSE
    """
    cursor.execute(query, (class_id, date))
    data = cursor.fetchall()
    if len(data) <= 0:
        return -1 # hoy no hay esta clase!!!
    return data[0]['id_class_session']
    
def clase_dictada(id_class_session):
    update = 'UPDATE class_session SET dictated = %s WHERE id_class_session = %s AND cs.is_deleted = FALSE'
    cursor.execute(update, (True, id_class_session, ))
    cnx.commit() 
    return cursor.rowcount >= 0

def marcar_asistencia(id_class_session, student_id):
    update = 'UPDATE class_attendance SET attended = %s WHERE id_class_session = %s AND student_id = %s'
    cursor.execute(update, (True, id_class_session, student_id))
    cnx.commit() 
    return cursor.rowcount >= 0

def roll_call(class_id, students_present):
    hoy = date.today()
    fecha_formateada = hoy.strftime('%Y-%m-%d')
    id_class_session = get_id_class_session(class_id, fecha_formateada)
    
    if id_class_session < 0:
        return -1, "Hoy no se dicta esta clase, por lo que no se puede pasar lista."
    
    students = get_enrolled_students(class_id)
    
    insert = "INSERT INTO class_attendance (id_class_session, student_id, attended) VALUES (%s, %s, %s)"
    for i in range(len(students)):
        try: 
            id = students[i]["student_id"]
            cursor.execute(insert, (id_class_session, id, False))
            cnx.commit()  
            if cursor.rowcount <= 0:
                return -1, "Algo salió mal insertando los datos."
        except IntegrityError: # en caso de querer "actualizar" la lista pasada
            update = 'UPDATE class_attendance SET attended = %s WHERE id_class_session = %s AND student_id = %s'
            cursor.execute(update, (False, id_class_session, id))
            if cursor.rowcount < 0:
                return -1, "Algo salió mal modificando los datos."
            cnx.commit()  
    
    for student_id in students_present:
        if not marcar_asistencia(id_class_session, student_id):
            return -1, f"Algo salió mal al marcar la asistencia. {student_id}"
    
    if clase_dictada(id_class_session):
        return 1, "Lista guardada correctamente."
    return -1, "Algo salió mal al dictar la clase."
    

def get_class_calendar(instructor_ci):
    query = """
    SELECT c.class_id, a.description, t.start_time, t.end_time, cs.class_date
    FROM classes c
    JOIN turns t on c.turn_id = t.turn_id
    JOIN activities a on a.activity_id = c.activity_id
    JOIN instructors i on i.instructor_ci = c.instructor_ci
    JOIN class_session cs on c.class_id = cs.class_id
    WHERE i.instructor_ci = %s AND c.is_deleted = FALSE
    """
    cursor.execute(query, (instructor_ci, ))
    data = cursor.fetchall()
    
    for current_data in data:
        current_data['start_time'] = cast_time(current_data['start_time'])
        current_data['end_time'] = cast_time(current_data['end_time'])
        current_data['class_date'] = cast_date(current_data['class_date'])
    return data

def get_days_from_class(class_info):
    days = []
    for current_class in class_info:
        days.append(current_class['day_id'])
    return days

def get_class_data_from_an_instructor(instructor_ci):
    query = 'SELECT class_id FROM classes WHERE instructor_ci = %s AND is_deleted = FALSE'
    cursor.execute(query, (instructor_ci,))
    data = cursor.fetchall()  
    print(data)
    
    if len(data) < 0:
        return -1, "Hubo un error al obtener las clases del instructor."
    elif len(data) == 0:
        return 0, "El instructor no tiene clases asignadas."
    else:
        classes = dict()
        for current_data in data:
            id = current_data['class_id']
            classes[id] = get_extended_class_info(id)[0]
        return 1, classes
    
def add_activity(description, cost):
    insert = 'INSERT INTO activities (description, cost) VALUES (%s, %s)'
    cursor.execute(insert, (description, cost))
    
    cnx.commit()  
    if cursor.rowcount > 0:
        return 1, "Nueva actividad agregada exitosamente"
    else:
        return -1, "No Fue posible agregar la nueva actividad"
    
def get_all_activities():
    query = 'SELECT * FROM activities'
    cursor.execute(query)
    activities = cursor.fetchall()
    
    return activities

def modify_activity_cost(activity_id, cost):
    update = 'UPDATE activities SET cost = %s WHERE activity_id = %s'
    cursor.execute(update, (cost, activity_id))
    cnx.commit() 
    
    if cursor.rowcount > 0 :
        return 1, 'Costo de la actividad modificado correctamente.'
    elif cursor.rowcount == 0:
        return 1, 'La actividad ya tenía ese costo previamente.'
    else:
        return -1, 'Hubo un error al modificar la actividad.'
    
def add_turn(start_time, end_time):
    turn_id = get_turn_id(start_time, end_time)
    if len(turn_id) > 0: # se verifica que no se vaya a duplicar el turno
        return -1, 'Ya hay un turno en ese horario, tiene el siguiente id: ' + str(turn_id[0])
    
    insert = 'INSERT INTO turns (start_time, end_time) VALUES (%s, %s)'
    cursor.execute(insert, (start_time, end_time))
    cnx.commit()

    if cursor.rowcount > 0:
        return 1, "Nuevo turno agregado exitosamente."
    else:
        return -1, "No Fue posible agregar el nuevo turno."
    
def get_all_turns():
    query = 'SELECT * FROM turns WHERE is_deleted = FALSE'
    cursor.execute(query)
    turns = cursor.fetchall()
    for turn in turns:
        turn['start_time'] = cast_time(turn['start_time'])
        turn['end_time'] = cast_time(turn['end_time'])
    return turns

def get_turn_id(start_time, end_time):
    query = 'SELECT turn_id FROM turns WHERE start_time = %s AND end_time = %s'
    cursor.execute(query, (start_time, end_time))    
    return cursor.fetchall()
        
def get_all_instructors():
    query = 'SELECT person_id AS instructor_id, first_name, last_name FROM instructors'
    cursor.execute(query)
    instructors = cursor.fetchall()
    
    return instructors

def get_all_students():
    query = 'SELECT person_id AS student_id, first_name, last_name FROM students'
    cursor.execute(query)
    students = cursor.fetchall()
    
    return students

def modify_start_time(turn_id, start_time):
    turn_time = get_turn_time(turn_id)
    if turn_time == -1:
        return -1, "No hay un turno con el id especificado."
    
    old_start_turn = cast_time(turn_time['start_time'])
    end_time = cast_time(turn_time['end_time'])
    
    if old_start_turn == start_time:
        return -1, "El turno ya tenía ese horario de inicio."
    elif end_time <= start_time:
        return -1, "El horario de inicio debe ser anterior a " + str(end_time)
    elif len(get_turn_id(start_time, end_time)) > 0: # en caso de que ya haya otro turno con los horarios especificados
        return -1, f"Ya hay un turno con el horario {start_time} - {end_time}."
    else:
        update = 'UPDATE turns SET start_time = %s WHERE turn_id = %s'
        cursor.execute(update, (start_time, turn_id ))
        cnx.commit() 
        if cursor.rowcount > 0:
            return 1, "Turno modificado exitosamente."
        else:
            return -1, "Hubo un error al modificar el turno."
        
def modify_end_time(turn_id, end_time):
    turn_time = get_turn_time(turn_id)
    if turn_time == -1:
        return -1, "No hay un turno con el id especificado."
    
    start_time = cast_time(turn_time['start_time'])
    old_end_time = cast_time(turn_time['end_time'])
    
    if old_end_time == end_time:
        return -1, "El turno ya tenía ese horario de fin."
    elif end_time <= start_time:
        return -1, "El horario de fin debe ser posterior a " + str(start_time)
    elif len(get_turn_id(start_time, end_time)) > 0: # en caso de que ya haya otro turno con los horarios especificados
        return -1, f"Ya hay un turno con el horario {start_time} - {end_time}."
    else:
        update = 'UPDATE turns SET end_time = %s WHERE turn_id = %s'
        cursor.execute(update, (end_time, turn_id ))
        cnx.commit() 
        if cursor.rowcount > 0:
            return 1, "Turno modificado exitosamente."
        else:
            return -1, "Hubo un error al modificar el turno."
        
def get_student_classes(student_ci):
    query = """
    SELECT c.class_id
    FROM classes c
    JOIN student_class sc ON c.class_id = sc.class_id
    WHERE sc.student_ci = %s
    """
    cursor.execute(query, (student_ci, ))
    classes = cursor.fetchall()
    result = []
    
    for current_class in classes:
        id = current_class['class_id']
        result.append(get_extended_class_info(id)[0])
    
    return result

def get_class_data():
    query = 'SELECT * FROM classes'
    cursor.execute(query)
    data = cursor.fetchall()  
    
    if len(data) <= 0:
        return -1, "Hubo un error al obtener las clases."
    else:
        classes = dict()
        for current_data in data:
            id = current_data['class_id']
            classes[id] = get_extended_class_info(id)[0]
        return 1, classes

def delete_student_class_by_class(class_id):
    update = 'UPDATE student_class SET is_deleted = TRUE WHERE class_id = %s'
    cursor.execute(update, (class_id,))
    cnx.commit()

    if cursor.rowcount < 1:
        return -1, "Hubo un error al eliminar las inscripciones de estudiantes."

def delete_class_session(class_id):
    update = 'UPDATE class_session SET is_deleted = TRUE WHERE class_id = %s AND dictated = FALSE'
    cursor.execute(update, (class_id,))
    cnx.commit()

    if cursor.rowcount < 1:
        return -1, "Hubo un error al eliminar las sesiones de clase."
   
def delete_class(class_id):
    delete_student_class_by_class(class_id)
    
    delete_class_session(class_id)
    
    update = 'UPDATE classes SET is_deleted = TRUE WHERE class_id = %s'
    cursor.execute(update, (class_id,))
    cnx.commit()

    if cursor.rowcount < 1:
        return -1, "Hubo un error al eliminar la clase."

    return 1, "Clase eliminada exitosamente."

def delete_class_by_turn(turn_id):
    select = 'SELECT class_id FROM classes WHERE turn_id = %s AND is_deleted = FALSE'
    cursor.execute(select, (turn_id,))
    classes = cursor.fetchall()

    for cls in classes:
        delete_class(cls['class_id'])

def delete_turn(turn_id):
    delete_class_by_turn(turn_id)
    
    update = 'UPDATE turns SET is_deleted = TRUE WHERE turn_id = %s'
    cursor.execute(update, (turn_id,))
    cnx.commit()

    if cursor.rowcount < 1:
        return -1, "Hubo un error al eliminar el turno."

    return 1, "Turno eliminado exitosamente."

def delete_login(person_ci):
    update = 'UPDATE login SET is_deleted = TRUE WHERE person_ci = %s'
    cursor.execute(update, (person_ci, ))
    cnx.commit()
    
    if cursor.rowcount < 0:
        return -1, "Hubo un error al eliminar la persona."
    
def get_rol_by_ci(person_ci):
    query = """
    SELECT r.role_name
    FROM roles r
    JOIN login l on r.role_id = l.role_id
    where person_ci = %s AND l.is_deleted = FALSE
    """
    cursor.execute(query, (person_ci, ))
    data = cursor.fetchall()
    
    if len(data) > 0:
        return data[0]
    return -1    
    
####################################################################################################

def delete_student_classes(student_ci):
    update = 'UPDATE student_class SET is_deleted = TRUE WHERE student_ci = %s'
    cursor.execute(update, (student_ci,))
    cnx.commit()
    
    if cursor.rowcount < 0:
        return -1, "Hubo un error al eliminar las inscripciones del estudiante."
    
    return 1, "Inscripciones del estudiante eliminadas correctamente."

def delete_student(student_ci):
    delete_student_classes(student_ci)
    
    delete_login(student_ci)
    
    update = 'UPDATE students SET is_deleted = TRUE WHERE student_ci = %s'
    cursor.execute(update, (student_ci,))
    cnx.commit()

    if cursor.rowcount < 0:
        return -1, "Hubo un error al eliminar el estudiante."
    
    return 1, "Estudiante eliminado correctamente."

def delete_classes_by_instructor(instructor_ci):
    update = 'UPDATE classes SET is_deleted = TRUE WHERE instructor_ci = %s'
    cursor.execute(update, (instructor_ci,))
    cnx.commit()
    
    if cursor.rowcount < 0:
        return -1, "Hubo un error al eliminar las clases asociadas al instructor."
    
    return 1, "Clases del instructor eliminadas correctamente."

def delete_instructor(instructor_ci):
    delete_classes_by_instructor(instructor_ci)
    
    delete_login(instructor_ci)
    
    update = 'UPDATE instructors SET is_deleted = TRUE WHERE instructor_ci = %s'
    cursor.execute(update, (instructor_ci,))
    cnx.commit()

    if cursor.rowcount < 0:
        return -1, "Hubo un error al eliminar el instructor."
    
    return 1, "Instructor eliminado correctamente."

def delete_person(person_ci):
    update = 'UPDATE person SET is_deleted = TRUE WHERE person_ci = %s'
    cursor.execute(update, (person_ci, ))
    cnx.commit()
    
    if cursor.rowcount < 0:
        return -1, "Hubo un error al eliminar la persona."
    
    delete_login(person_ci)
    rol = get_rol_by_ci(person_ci)
    
    match rol:
        case 'instructor':
            delete_instructor(person_ci)
        case 'student':
            delete_student(person_ci)
