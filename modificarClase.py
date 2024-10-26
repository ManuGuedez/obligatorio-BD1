import mysql.connector as mysql

cnx = mysql.connect(user='root', password='rootpassword', host='127.0.0.1', database='snowSchool')
cursor = cnx.cursor(dictionary=True)

# Función para modificar el turno de una clase
def modificarClases(class_id, new_turn_id):

    query = f"UPDATE classes SET turn_id = {new_turn_id} WHERE class_id = {class_id}"
    
    try:
        cursor.execute(query)
        cnx.commit()  
        if cursor.rowcount > 0:
            return "Turno de la clase modificado exitosamente."
        else:
            return "No se encontró la clase con el ID especificado o el turno ya estaba actualizado."
    except mysql.Error as err:
        return f"Error al modificar la clase: {err}"

# Nueva función para modificar el instructor de una clase
def modificarInstructor(class_id, new_instructor_ci):

    query = f"UPDATE classes SET instructor_ci = {new_instructor_ci} WHERE class_id = {class_id}"
    
    try:
        cursor.execute(query)
        cnx.commit()
        if cursor.rowcount > 0:
            return "Instructor de la clase modificado exitosamente."
        else:
            return "No se encontró la clase con el ID especificado o el instructor ya estaba actualizado."
    except mysql.Error as err:
        return f"Error al modificar el instructor de la clase: {err}"
    
    
    
def modificarAlumnosClase(class_id, student_ci, action):
    
    if action == 'agregar':
        query = f"INSERT INTO student_class (class_id, student_ci) VALUES ({class_id}, {student_ci})"
        try:
            cursor.execute(query)
            cnx.commit()
            return "Alumno agregado a la clase exitosamente."
        except mysql.Error as err:
            return f"Error al agregar el alumno: {err}"
    
    elif action == 'quitar':
        query = f"DELETE FROM student_class WHERE class_id = {class_id} AND student_ci = {student_ci}"
        try:
            cursor.execute(query)
            cnx.commit()
            if cursor.rowcount > 0:
                return "Alumno quitado de la clase exitosamente."
            else:
                return "No se encontró el alumno en la clase especificada."
        except mysql.Error as err:
            return f"Error al quitar el alumno: {err}"
    
    else:
        return "Acción no válida. Use 'agregar' o 'quitar'."


# Menú interactivo
def main():
    print("Bienvenido al sistema de gestión de clases.")
    user_role = input("Por favor, ingresa tu rol (instructor/admin): ").strip().lower()

    # Verificar rol del usuario
    if user_role not in ['instructor', 'admin']:
        print("Rol no válido. Solo los instructores y administradores pueden modificar clases.")
        return

    while True:
        print("\nMenú:")
        print("1. Modificar turno de clase")
        print("2. Modificar instructor de clase")
        print("3. Agregar alumno a clase")
        print("4. Quitar alumno de clase")
        print("5. Salir")
        
        opcion = input("Selecciona una opción: ")
        
        if opcion == '1':
            class_id = int(input("Ingresa el ID de la clase: "))
            new_turn_id = int(input("Ingresa el nuevo ID del turno: "))
            user_role = input("Ingresa tu rol (instructor/admin): ")
            result = modificarClases(class_id, new_turn_id, user_role)
            print(result)

        elif opcion == '2':
            class_id = int(input("Ingresa el ID de la clase: "))
            new_instructor_id = int(input("Ingresa el nuevo ID del instructor: "))
            user_role = input("Ingresa tu rol (instructor/admin): ")
            result = modificarInstructor(class_id, new_instructor_id, user_role)
            print(result)

        elif opcion == '3':
            class_id = int(input("Ingresa el ID de la clase: "))
            student_ci = int(input("Ingresa el CI del alumno: "))
            result = modificarAlumnosClase(class_id, student_ci, 'agregar')
            print(result)

        elif opcion == '4':
            class_id = int(input("Ingresa el ID de la clase: "))
            student_ci = int(input("Ingresa el CI del alumno: "))
            result = modificarAlumnosClase(class_id, student_ci, 'quitar')
            print(result)

        elif opcion == '5':
            break

        else:
            print("Opción no válida. Intenta de nuevo.")


# Ejecutar el menú
# if __name__ == "__main__":
#     # main()
