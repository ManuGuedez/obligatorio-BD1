import mysql.connector as mysql

import random
import string
import smtplib, secrets
from datetime import datetime, timedelta
from email.mime.text import MIMEText


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


####### PROBANDO IMPLEMENTACION DE OLVIDE CONTRAESÑA #############################################



def generate_reset_token(email):
    # Verificar si el email existe en la base de datos
    query = f"SELECT email FROM login WHERE email = '{email}'"
    cursor.execute(query)
    user = cursor.fetchone()

    if not user:
        return "El email no está registrado"

    # Generar un token único
    token = secrets.token_urlsafe(32)

    # Establecer un tiempo de expiración (por ejemplo, 1 hora)
    expiration_time = datetime.now() + timedelta(hours=1)

    # Almacenar el token y la expiración en la base de datos
    query = f"UPDATE login SET reset_token = '{token}', token_expiration = '{expiration_time}' WHERE email = '{email}'"
    cursor.execute(query)
    cnx.commit()

    # Enviar el correo con el token
    send_reset_email(email, token)

    return "Se ha enviado un correo con las instrucciones para restablecer su contraseña."


def send_reset_email(email, token):
    # Configurar el correo
    reset_link = f"http://tuservidor.com/reset_password?token={token}"
    subject = "Restablecer contraseña"
    body = f"Haz clic en el siguiente enlace para restablecer tu contraseña: {reset_link}"

    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = "poseagus15@gmail.com"
    msg['To'] = email

    # Enviar el correo
    try:
        with smtplib.SMTP('smtp.gmail.com', 587) as smtp:
            smtp.starttls()
            smtp.login('tu_email@example.com', 'tu_password')
            smtp.send_message(msg)
            print(f"Correo enviado a {email}")
    except Exception as e:
        print(f"No se pudo enviar el correo: {e}")
        
        

def reset_password(token, new_password):
    # Verificar la validez del token
    query = f"SELECT email, token_expiration FROM login WHERE reset_token = '{token}'"
    cursor.execute(query)
    data = cursor.fetchone()

    if not data:
        return "Token inválido"

    # Verificar si el token ha expirado
    if datetime.now() > data['token_expiration']:
        return "El token ha expirado"

    # Actualizar la contraseña en la base de datos
    email = data['email']
    query = f"UPDATE login SET password = '{new_password}', reset_token = NULL, token_expiration = NULL WHERE email = '{email}'"
    cursor.execute(query)
    cnx.commit()

    return "Contraseña restablecida correctamente"

# Ejemplo de uso
print(generate_reset_token('persona1@example.com'))


#########################################################################################################