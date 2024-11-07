import mysql.connector as mysql

cnx = mysql.connect(user='root', password='rootpassword', host='127.0.0.1', database='snowSchool')
cursor = cnx.cursor(dictionary=True) # devuelve la info en formato key-value


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

# print(
# create_student_account({"ci": 500000008, "first_name": "Manuela", "last_name": "Guedez", "birth_date": "2005-01-18"}, "manuela@example.com", "manu1234")
# )

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

def modify_class(class_id, new_turn_id):

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
        
def get_instructor_schedules(instructor_id):
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