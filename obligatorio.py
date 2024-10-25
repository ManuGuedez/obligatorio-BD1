import mysql.connector as mysql
cnx = mysql.connect(user='root', password='rootpassword', host='127.0.0.1', database='snowSchool')
cursor = cnx.cursor(dictionary=True) # devuelve la info en formato kwy-value


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
def create_user(student, email, password):
    response = -2
    
    try:
        response = validate_student(student)
    except ValueError:
        return "Los datos ingresados no son correctos"
    
    if response == -1:
        return "No hay un alumno que cumpla con las especificaciones en la bd"
    
    query = f"SELECT login.email FROM login WHERE login.student_ci = {response}"
    cursor.execute(query)
    data = cursor.fetchall()
    if len(data) > 0 :
        return "Ya hay un alumno ingrsado en el sistema con el mail" + data[0]["email"]
    
    ci = student["ci"]
    query = f"INSERT INTO login (email, password, student_ci) VALUE (\'{email}\', \'{password}\', {ci})"
    cursor.execute(query)
    result = cursor.rowcount
    
    # verificación de que la isnerción fue exitosa
    if result > 0:
        print("Inserción exitosa")
    else:
        print("No se pudo insertar el dato")

    # confirma los cambios en la base de datos
    cnx.commit()
 
    return result

def get_actividades_con_mas_ganancias(n):
    query = f"SELECT "
    cursor.execute(query)
    result = cursor.fetchall()
    
    return 0

print(
create_user({"ci": 500000008, "first_name": "Manuela", "last_name": "Guedez", "birth_date": "2005-01-18"}, "manuela@example.com", "manu1234")
)
