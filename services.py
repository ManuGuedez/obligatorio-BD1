import mysql.connector as mysql

cnx = mysql.connect(user='root', password='rootpassword', host='127.0.0.1', database='snowSchool')
cursor = cnx.cursor(dictionary=True) # devuelve la info en formato key-value
import algoritmo
from datetime import datetime, time, timedelta

def validate_student(student):
    """
    Valida la existencia de un estudiante en la base de datos.

    Esta función verifica si un estudiante existe en la base de datos
    utilizando su cédula de identidad y otros datos personales.

    Args: 
        student (dict): Diccionario con la información del estudiante.
                        Debe contener las claves 'ci', 'first_name', 
                        'last_name' y 'birth_date'.

    Returns:
        int: El número de cédula de identidad (ci) del estudiante si existe,
             o -1 si no se encuentra en la base de datos.

    Raises:
        ValueError: Si el diccionario no tiene exactamente 4 elementos 
                    o si faltan claves necesarias ('ci', 'first_name', 
                    'last_name', 'birth_date').
    """

    if len(student) != 4:
        raise ValueError("Asegurate de haber ingrsado correctamente los datos")
    
    try:
        ci = student["ci"]
        name = student["first_name"]
        last_name = student["last_name"]
        birth_date = student["birth_date"]
    except KeyError:
        raise ValueError("Asegurate de haber ingrsado las key correspondientes.")

    query = f"SELECT students.student_ci FROM students WHERE students.student_ci = {ci} AND students.first_name = \'{name}\' AND students.last_name = \'{last_name}\' AND students.birth_date = \'{birth_date}\'"
    cursor.execute(query)
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
    
    query = f"SELECT login.email FROM login WHERE login.person_ci = {response}"
    cursor.execute(query)
    data = cursor.fetchall()
    if len(data) > 0 :
        message = "Ya hay un alumno ingrsado en el sistema con el mail" + data[0]["email"]
        return -1, message
    
    ci = student["ci"]
    role_id = get_role_id('student')
    query = f"INSERT INTO login (email, password, person_ci, role_id) VALUE (\'{email}\', \'{password}\', {ci}, {role_id})"
    cursor.execute(query)
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
    query =  query = f"SELECT login.person_ci, login.role_id FROM login WHERE login.email = \'{email}\' AND login.password = \'{password}\'"
    cursor.execute(query)
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

    query = f"SELECT instructors.instructor_ci FROM instructors WHERE instructors.instructor_ci = {ci} AND instructors.first_name = \'{name}\' AND instructors.last_name = \'{last_name}\'"
    cursor.execute(query)
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
    
    query = f"SELECT login.email FROM login WHERE login.person_ci = {response}"
    cursor.execute(query)
    data = cursor.fetchall()
    if len(data) > 0 :
        message = "Ya hay un instructor ingrsado en el sistema con el mail" + data[0]["email"]
        return -1, message
    
    ci = instructor["ci"]
    role_id = get_role_id('instructor')
    query = f"INSERT INTO login (email, password, person_ci, role_id) VALUE (\'{email}\', \'{password}\', {ci})"
    cursor.execute(query)
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

def get_class_turn(class_id):
    query = 'SELECT turn_id FROM classes WHERE class_id = %s'
    cursor.execute(query, (class_id,))
    data = cursor.fetchall()
    
    if len(data) > 0:
        return int(data[0]['turn_id'])
    return -1 

def get_class_information(class_id):
    query = 'SELECT activities.description, turns.start_time, turns.end_time, login.email as instructor_email FROM classes JOIN activities ON (classes.activity_id = activities.activity_id) JOIN turns ON (classes.turn_id = turns.turn_id) JOIN login ON (classes.instructor_ci = login.person_ci) WHERE classes.class_id = %s'
    cursor.execute(query, (class_id,))
    data = cursor.fetchall()
    
    if len(data) > 0:
        return data[0]
    return -1 
    
def modify_class_turn(class_id, new_turn_id):

    query = f"UPDATE classes SET turn_id = {new_turn_id} WHERE class_id = {class_id}"
    
    try:
        cursor.execute(query)
        cnx.commit()  
        if cursor.rowcount > 0:
            return 1, "Turno de la clase modificado exitosamente."
        else:
            return -1, "No se encontró la clase con el ID especificado o el turno ya estaba actualizado."
    except mysql.Error as err:
        return -1, f"Error al modificar la clase: {err}"
    
def modify_students_class(class_id, student_ci, action):
    match action:
        case 'add':
            query = f"INSERT INTO student_class (class_id, student_ci) VALUES ({class_id}, {student_ci})"
            try:
                cursor.execute(query)
                cnx.commit()
                return 1, "Alumno agregado a la clase exitosamente."
            except mysql.Error as err:
                return -1, f"Error al agregar el alumno: {err}"
        case 'delete':    
            query = f"DELETE FROM student_class WHERE class_id = {class_id} AND student_ci = {student_ci}"
            try:
                cursor.execute(query)
                cnx.commit()
                if cursor.rowcount > 0:
                    return 1, "Alumno quitado de la clase exitosamente."
                else:
                    return -1, "No se encontró el alumno en la clase especificada."
            except mysql.Error as err:
                return -1, f"Error al quitar el alumno: {err}"
        case _:
            return -1, "Acción no válida. Use 'add' o 'delete'."
        
def get_instructor_schedules(instructor_id): # quedó obsoleto porque agregamos nuevas tablas
    query = 'SELECT turn_id FROM classes WHERE instructor_ci = %s'
    cursor.execute(query, (instructor_id,))
    data = cursor.fetchall()
    
    turns_ids = {turn["turn_id"] for turn in data} # hago un set con los horarios del instructor
    return turns_ids

def modify_class_instructor(class_id, instructor_ci):
    query = f"UPDATE classes SET instructor_ci = {instructor_ci} WHERE class_id = {class_id}"
    
    try:
        cursor.execute(query)
        cnx.commit()  
        if cursor.rowcount > 0:
            # mandar mail al instructor avisando que fue asignado para dar esta clase
            return 1, "Instructor de la clase modificado exitosamente."
        else:
            return -1, "No se encontró la clase con el ID especificado o el instructor ya la estaba dictando."
    except mysql.Error as err:
        return -1, f"Error al modificar la clase: {err}"
    
def get_person_id_with_ci(person_ci):
    query = 'SELECT person.person_id FROM person WHERE person_ci = %s'
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
    where = 'WHERE i.person_id = %s AND c.turn_id = %s AND (c.start_date <= %s OR c.end_date >= %s) AND cd.day_id IN '
    
    days = '('
    for d in days_id:
        days += str(d) + ', '
    
    days = days[0:len(days) - 2] + ')'
    
    query = select + joins + where + days
    cursor.execute(query, (instructor_id, turn_id, start_date, end_date))
    data = cursor.fetchall()
   
    return data

def query_to_add_class(instructor_id, turn_id, days_ids, start_date, end_date):
    classes = retrieve_instructor_classes_by_turn_and_days(instructor_id, turn_id, days_ids, start_date, end_date)
    
    return classes

def is_instructor_busy(instructor_id, turn_id, days_ids, start_date, end_date):
    classes = retrieve_instructor_classes_by_turn_and_days(instructor_id, turn_id, days_ids, start_date, end_date)

    return len(classes) > 0

def get_person_ci_with_id(person_id):
    query = 'SELECT person.person_ci FROM person WHERE person_id = %s'
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
                
                insert = "INSERT INTO class_session (class_id, class_date, day_id) VALUES " # por defecto se establece como no dictada
                days = get_days()
                values = ""
                for fecha in fechas:
                    id_dia = days.get(fecha[1])
                    values += f"({class_id}, \'{fecha[0]}\', {id_dia}),"
                
                values = values[:-1]
                insert = insert + values
                cursor.execute(insert)
                cnx.commit()
                
                if cursor.rowcount > 0:
                    # mandar mail al instructor avisando que fue asignado para dar esta clase
                    return 1, "Nueva clase creada exitosamente."
                else:
                    delete = "DELETE FROM class_day WHERE class_id = " + str(class_id)
                    cursor.execute(delete)
                    
                    delete = "DELETE FROM classes WHERE class_id = " + str(class_id)
                    cursor.execute(delete)
                    
                    #eliminar clase de classes y de class_day
                    return -1, "Hubo un error creando la clase."
            else:
                delete = "DELETE FROM class_day WHERE class_id = " + str(class_id)
                cursor.execute(delete)
                
                delete = "DELETE FROM classes WHERE class_id = " + str(class_id)
                cursor.execute(delete)
                
                #eliminar clase de classes y de class_day
                return -1, "Hubo un error creando la clase."
            
        else:
            return -1, "Hubo un problema, no fue posible crear la clase."
    except mysql.Error as err:
        delete = "DELETE FROM class_day WHERE class_id = " + str(class_id)
        cursor.execute(delete)
        
        delete = "DELETE FROM classes WHERE class_id = " + str(class_id)
        cursor.execute(delete)
        
        return -1, f"Error al crear la clase: {err}"
    
def get_basic_class_info(class_id):
    query = """
    SELECT c.turn_id, cd.day_id, i.person_id as instructor_id
    FROM classes c
    JOIN class_day cd ON c.class_id = cd.class_id
    JOIN instructors i ON c.instructor_ci = i.instructor_ci
        WHERE c.class_id = %s
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
    query = 'SELECT t.start_time, t.end_time FROM turns as t WHERE t.turn_id = %s'
    cursor.execute(query,(turn_id,))
    data = cursor.fetchall()
    
    if len(data) > 0:
        return data[0]
    return -1

def add_person(person_ci, name, last_name):
    query = 'SELECT person.person_id FROM person WHERE person_ci = %s'
    cursor.execute(query, (person_ci,))
    data = cursor.fetchall()
    
    if len(data) > 0:
        return data[0]['person_id']
    
    insert = 'INSERT INTO person (person_ci, name, last_name) VALUE (%s, %s, %s)'
    cursor.execute(insert, (person_ci, name, last_name))
    result = cursor.rowcount
    
    if result > 0:
        return cursor.lastrowid # devuelve id de la persona recién insertada
    return -1

def add_instructor(person_id, instructor_ci, first_name, last_name):
    query = 'SELECT i.instructor_ci FROM instructors i WHERE i.instructor_ci = %s'
    cursor.execute(query, (instructor_ci,))
    data = cursor.fetchall()
    
    if len(data) > 0:
        return -1, "Ya hay un instructor ingresado con la ci ingresada."
    
    insert = "INSERT INTO instructors (person_id, instructor_ci, first_name, last_name) VALUE (%s, %s, %s, %s)"
    cursor.execute(insert, (person_id, instructor_ci, first_name, last_name))
    cnx.commit()
    result = cursor.rowcount
    
    if result > 0:
        return 1, "Instructor agregado exitosamente al sistema."    
    return -1, "Hubo un error al ingresar el instrucor al sistema."

def add_student(person_id, student_ci, first_name, last_name, birth_date):
    query = 'SELECT s.student_ci FROM students s WHERE s.student_ci = %s'
    cursor.execute(query, (student_ci,))
    data = cursor.fetchall()
    
    if len(data) > 0:
        return -1, "Ya hay un estudiante ingresado con la ci especificada."
    
    insert = "INSERT INTO students (person_id, student_ci, first_name, last_name, birth_date) VALUE (%s, %s, %s, %s, %s)"
    cursor.execute(insert, (person_id, student_ci, first_name, last_name, birth_date))
    cnx.commit()
    result = cursor.rowcount
    
    if result > 0:
        return 1, "Estudiante agregado exitosamente al sistema."    
    return -1, "Hubo un error al ingresar al estudiante en el sistema."



def retrieve_student_classes_by_turn_and_days(student_id, turn_id, days_id, start_date, end_date):
    select = '''
        SELECT 
            c.class_id, 
            c.activity_id, 
            c.turn_id, 
            cd.day_id 
        FROM classes c
    '''
    joins = '''
        JOIN student_class sc ON sc.class_id = c.class_id
        JOIN students s ON s.student_ci = sc.student_ci
        JOIN class_day cd ON cd.class_id = c.class_id
    '''
    where = '''
        WHERE s.person_id = %s 
        AND c.turn_id = %s 
        AND (c.start_date <= %s OR c.end_date >= %s)
        AND cd.day_id IN 
    '''
    
    days = '('
    for d in days_id:
        days += str(d) + ', '
    days = days[0:len(days) - 2] + ')'
    
    query = select + joins + where + days
    cursor.execute(query, (student_id, turn_id, start_date, end_date))
    data = cursor.fetchall()
   
    return data

def is_student_busy(student_id, turn_id, days_ids, start_date, end_date):

    classes = retrieve_student_classes_by_turn_and_days(student_id, turn_id, days_ids, start_date, end_date)
    return len(classes) > 0


def enrolled_students_count(class_id):
    query = 'SELECT COUNT(*) AS enrolled_students FROM student_class WHERE class_id = %s'
    cursor.execute(query, (class_id,))
    data = cursor.fetchall()
    return data[0]['enrolled_students']


def add_student_to_class(class_id, student_ci):
    query_insert = f"INSERT INTO student_class (class_id, student_ci) VALUES ({class_id}, {student_ci})"
    try:
        cursor.execute(query_insert)
        cnx.commit()
        if cursor.rowcount > 0:
            return 1, "Estudiante agregado a la clase exitosamente."
        else:
            return -1, "Error al agregar al estudiante a la clase."
    except mysql.Error as err:
        return -1, f"Error al agregar el estudiante: {err}"