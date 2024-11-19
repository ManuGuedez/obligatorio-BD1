from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, get_jwt, jwt_required
import services
from datetime import timedelta
import smtp
from flask_cors import CORS

app = Flask(__name__)

# Configura CORS para todo el servidor
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})



app.config['JWT_SECRET_KEY'] = 'obligatorio-bd-2024'
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=30) # esto para que el token expire cada 30 min

jwt = JWTManager(app)

@app.after_request
def after_request(response):
    # Añadir CORS globalmente a todas las respuestas
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:5173'  # Asegúrate de usar tu dominio
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS, PUT, PATCH'  # Permitir métodos necesarios
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'  # Permitir cabeceras necesarias
    return response


@app.route('/login', methods=['POST'])
def login():
    '''
    cuerpo requerido:
        - email
        - password
    '''
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({"error": "Email y contraseña son requeridos"}), 400
    
    user_ci, role_id = services.validate_user(email, password)
    
    if user_ci and role_id: 
        person_data = services.get_person_data(user_ci)
        # se crea un token de acceso JWT
        access_token = create_access_token(identity=str(user_ci), additional_claims={'role_id': role_id})

        #access_token = create_access_token(identity=user_ci, additional_claims={'role_id': role_id})

        user_details = {
            "id": user_ci,
            "role_id": role_id,
            "email": email
        }
        
        return jsonify({
            "access_token": access_token,
            "user": user_details,
            "user_data": person_data
        }), 200
        
        

    else:
        return jsonify({"error": "Credenciales incorrectas"}), 401


@app.route('/register', methods=['POST'])
def register_user():
    '''
    cuerpo requerido:
        - rol con el que se va a registrar la persona
        - ci
        - first_name
        - last_name
        - email
        - password
    '''
    data = request.get_json()
    rol = data.get('rol')
    ci = data.get('ci')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    email = data.get('email')
    password = data.get('password')

    match (rol):
        case 'instructor':
            instructor = {'ci': ci, 'first_name': first_name, 'last_name': last_name}
            result, message = services.create_instructor_account(instructor, email, password)
        case 'student' | 'estudiante':
            birth_date = data.get('birth_date') # manejar keyError
            student = {'ci': ci, 'first_name': first_name, 'last_name': last_name, 'birth_date': birth_date }
            result, message = services.create_student_account(student, email, password)
        case _:
            return jsonify({'error': 'Rol no reconocido'}), 400
    
    if result > 0:
        return jsonify({'msg': message}), 200
    else:
        return jsonify({'error': message}), 400
    
@app.route('/classes/new-class', methods=['POST'])
@jwt_required()
def create_class():
    '''
        cuerpo requerido:
            - instructor_id
            - start_date (formato Y-M-D)
            - end_date (formato Y-M-D)
            - activity
            - turn (1, 2, 3)
            - days ('lunes', 'martes', ...)
            # type: individual (opcional)
    '''
    
    # primero se verifica que quien intenta crear una clase es el administrador 
    claims = get_jwt()
    role = services.get_role(claims.get("role_id"))
    
    if(role != "admin"):
        return jsonify({'error': 'Esta acción puede ser realizada únicamente por el administrador'}), 400
    
    # en caso de que sea el adminsitrador
    data = request.get_json()
    instructor_id = data.get('instructor_id')
    instructor_ci = services.get_person_ci_with_id(instructor_id)
    if instructor_ci == -1:
        return jsonify({'error': 'No es posible identificar el id del instructor ingresado'}), 400
    
    start_date = data.get('start_date')
    end_date = data.get('end_date')
    
    activity = str(data.get('activity')).strip().capitalize() # premier letra en may y resto en min
    activities = services.get_activities()
    activity = activities.get(activity)
    if not activity:
        return jsonify({'error': 'La actividad ingresada no es válida'}), 400        
    
    turn = data.get('turn')
    days = data.get('days') 

    days_ids = services.get_days()
 # devuelve diccionario con días y sus respectivos ids

    # reemplazo los días con los ids
    for i in range(len(days)):
        id = days_ids.get(str(days[i]).lower())
        if id:
            days[i] = id
        else:
             # en caso de que el valor no sea un día válido se pone -1 entonces no altera la query
            return jsonify({'error': 'Se ingresó un día inválido, deben ser de lunes a viernes.'}), 400

    if services.is_instructor_busy(instructor_id, turn, days, start_date, end_date):
        return jsonify({'error': 'El instructor ya tiene clases en ese horario'}), 400
    
    type = data.get('type')
    if type != None and type != 'individual':
        return jsonify({'error': 'El tipo de la clase no es adecuado, debe ser individual o por defecto es grupal'}), 400
        
    result, message = services.add_class(instructor_ci, activity, turn, start_date, end_date, days, type)
    
    if result > 0: 
        return jsonify({'msg': message}), 200
    else:
        return jsonify({'error': message}), 400


@app.route('/classes/<int:id>/modify-class', methods=['PATCH']) 
@jwt_required()
def modify_class(id):
    '''
    cuerpo requerido:
        - turn_id: (id del turno que se desea actualizar)
        - instructor_id: (id del instructor que se desea actualizar)
        
    ¡¡¡ el endpoint no soporta actualizaciones simultáneas (turno e instructor) !!! 
        --> hacer uno primero y luego otro en caso de querer modificar ambos
    '''
    # primero se verifica que quien intenta crear una clase es el administrador 
    claims = get_jwt()
    role = services.get_role(claims.get("role_id"))
    
    if(role != "admin"):
        return jsonify({'error': 'Esta acción puede ser realizada únicamente por el administrador.'}), 400
    
    data = request.get_json()
    turn_id = data.get('turn_id')
    instructor_id = data.get('instructor_id')          
        
    instructor_ci = services.get_person_ci_with_id(instructor_id)
    if instructor_ci == -1:
        return jsonify({'error': 'No es posible identificar el id del instructor ingresado'}), 400            
    
    class_info = services.get_basic_class_info(id)
    
    if len(class_info) <= 0:
        return jsonify({'error': 'El id de la clase ingresada no se encuentra en la base de datos.'}), 400
    
    # class_info = class_info[0]
    days = [int(data["day_id"]) for data in class_info]
    turn_time = services.get_turn_time(class_info[0]["turn_id"])
    
    if not services.can_modify(turn_time["start_time"], turn_time["end_time"], days):
        return jsonify({'error': 'No es posible modificar la clase dado que se encuentra en curso.'}), 400
    
    if not turn_id and not instructor_id:
        return jsonify({'error': 'Es necesario ingresar turno a modificar o instructor'}), 400  
        
    current_class_instructor = class_info[0]['instructor_id']
    
    # si lo que se intenta modificar es el turno de la clase
    if turn_id and instructor_id == int(current_class_instructor):
        if turn_id == class_info[0]["turn_id"]:
            return jsonify({'error': 'La clase ya se encunetra en el turno y instructor especificados.'}), 400
            
        instructor_schedule = services.get_instructor_schedule(instructor_id, turn_id, days)
        if len(instructor_schedule) > 0:
            return jsonify({'error': 'No es posible modificar el turno de la clase porque el instructor se encuentra ocupado en ese horario.'}), 400
        is_instructor_modified = False
        result, message = services.modify_class_turn(id, turn_id)
    # si lo que se quiere modificar es el instructor
    elif instructor_id != current_class_instructor and (not turn_id or turn_id == class_info[0]["turn_id"]):
        instructor_schedule = services.get_instructor_schedule(instructor_id, class_info[0]["turn_id"], days)
        if len(instructor_schedule) > 0:
            return jsonify({'error': 'No es posible modificar el instructor dado que tiene ya tiene otra clase en el horario de esta clase.'}), 400
        is_instructor_modified = True
        result, message = services.modify_class_instructor(id, instructor_ci)
    elif turn_id and instructor_id != int(current_class_instructor):
        return jsonify({'error': 'No se pueden modificar turno e instructor de manera simultánea.'}), 400
        
    if result > 0: 
        if is_instructor_modified:
            class_information = services.get_class_information_for_instructor(id)
            description = class_information["description"]
            start_time = class_information["start_time"]
            end_time = class_information["end_time"]
            
            # estoy sacando el email del login, deberíamos tenerlo guardado en instructor o persona
            email = class_information["instructor_email"] 
            
            subject = "Nueva clase para dictar como instructor"
            content = f"Has sido asingado para dictar {description} desde {start_time} hasta {end_time}" # agergar info de los días
            
            smtp.send_email("manuelaguedez18@gmail.com", subject, email + ": " + content) # para testear que el mensaje llega correctamente
            smtp.send_email(email, subject, content)
        return jsonify({'msg': message}), 200
    else:
        return jsonify({'error': message}), 400


@app.route('/add_user', methods=['POST']) 
@jwt_required()
def add_user():
    data = request.get_json()

    '''
    Cuerpo requerido:
    {
        ci
        first_name
        last_name
        user_type (instructor / estudiante)
        fecha de nacimiento (si es estudiante)
    }
    '''
    # primero se verifica que quien intenta crear una clase es el administrador 
    claims = get_jwt()
    role = services.get_role(claims.get("role_id"))
    
    if(role != "admin"):
        return jsonify({'error': 'Esta acción puede ser realizada únicamente por el administrador.'}), 400
    
    data = request.get_json()
    ci = data.get('ci')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    user_type = data.get('user_type')
    
    if not ci or not first_name or not last_name or not user_type:
        print("Datos recibidos:", data)  # Agregar log para depurar
        return jsonify({'error': 'Faltan datos obligatorios'}), 400

    
    person_id = services.add_person(ci, first_name, last_name) 
    
    if person_id <= 0:
        return jsonify({'error': 'Hubo un problema al ingresar la persona en el sistema.'}), 400
    
    match user_type:
        case 'instructor':
            result, message = services.add_instructor(person_id, ci, first_name, last_name)
            
        case 'student' | 'estudiante':
            birth_date = data.get('birth_date')
            if not birth_date:
                return jsonify({'error': 'Falta especificar fecha de nacimiento del estudiante.'}), 400
            result, message = services.add_student(person_id, ci, first_name, last_name, birth_date)

        case _:
            return jsonify({'error': 'El tipo de usuario especificado no es adecuado, ingrese instructor o estudiante.'}), 400
    
    if result > 0: 
        return jsonify({'msg': message}), 200
    else:
        return jsonify({'error': message}), 400
    

@app.route('/classes/<int:id>/enroll-student', methods=['POST'])
@jwt_required()
def enroll_student(id):
    '''
    cuerpo requerido:
        - student_id: id del alumno a inscribir
    '''
    claims = get_jwt()
    role = services.get_role(claims.get("role_id")) 
    data = request.get_json()
    student_id = data.get("student_id")
    
    if not student_id:
        return jsonify({"error": "Faltan datos requeridos en el cuerpo de la solicitud."}), 400   
    
    user_ci = int(get_jwt_identity())
    student_ci = services.get_person_ci_with_id(student_id) 
    
    if role == 'instructor':
        if not services.is_instructor_responsible(id, user_ci):
            return jsonify({"error": "Debes ser el instructor de la clase para agregar alumnos."}), 400   
    elif role == 'student':
        if user_ci != student_ci:
            return jsonify({"error": "Un alumno no puede inscribir a otro"}), 400   
            
    class_info = services.get_basic_class_info(id) 
    if len(class_info) <= 0:
        return jsonify({"error": "Clase no encontrada"}), 400
    
    enrolled_students_count = services.enrolled_students_count(id)
    
    if enrolled_students_count >= 10:
        return jsonify({"error": "La clase ya está llena."}), 400

    days_ids = services.get_days_from_class(class_info)
    if services.is_student_busy(student_id, class_info[0]['turn_id'], days_ids, class_info[0]['start_date'], class_info[0]['end_date']):
        return jsonify({"error": "El alumno ya está ocupado en el turno y los días seleccionados."}), 400    
            
    result, new_enrollment = services.add_student_to_class(student_ci, id)

    if result > 0: 
        return jsonify({'msg': new_enrollment}), 200
    else:
        return jsonify({'error': new_enrollment}), 400
    
    
@app.route('/classes/<int:id>/remove-student', methods=['DELETE'])
@jwt_required()   
def remove_student_from_class(id):
    '''
    cuerpo requerido:
        - student_id: id del alumno a inscribir
    '''
    data = request.get_json()
    student_id = data.get('student_id')
    
    if not student_id:
        return jsonify({"error": "Faltan datos requeridos en el cuerpo de la solicitud."}), 400   
    
    claims = get_jwt()
    role = services.get_role(claims.get("role_id")) 
    
    user_ci = int(get_jwt_identity())
    student_ci = services.get_person_ci_with_id(student_id) 
    
    if role == 'instructor':
        if not services.is_instructor_responsible(id, user_ci):
            return jsonify({"error": "Debes ser el instructor de la clase para eliminar alumnos."}), 400   
    elif role == 'student':
        if user_ci != student_ci:
            return jsonify({"error": "Un alumno no puede eliminar de una clase a otro"}), 400 
        
    result, message = services.remove_student_from_class(id, student_ci)

    if result > 0:
        return jsonify({'msg': message}), 200
    else:
        return jsonify({'error': message}), 400


@app.route('/students/available-classes', methods=['GET']) 
@jwt_required()
def get_available_classes(): # pensado para que lo use el estudiante
    user_ci = int(get_jwt_identity())
    classes = services.get_available_classes(user_ci)
    
    return jsonify(classes), 200
    

@app.route('/classes/<int:id>/equipment-available', methods=['GET']) 
@jwt_required()
def get_available_equipment(id):
    rentable_equipment = services.get_rentable_equipment(id)
    return jsonify(rentable_equipment), 200
    

@app.route('/classes/<int:id>/rental-equipment', methods=['POST']) 
@jwt_required()
def get_equipment_rental(id):
    '''
    cuerpo requerido
        - equipment_id: [lista de ids del equipamiento a rentar]
    '''
    claims = get_jwt()
    role = services.get_role(claims.get("role_id"))
    
    if(role != "student"):
        return jsonify({'error': 'Solo los alumnos pueden rentar equipamiento.'}), 400
    
    user_ci = int(get_jwt_identity())
    
    if not services.is_student_enrolled(user_ci, id):
        return jsonify({'error': 'Para poder rentar equipo para esta clase debes estar inscripto primero.'}), 400
        
    data = request.get_json() # ids de las los equipos a rentar 
    lista_ids_equipamiento = data.get('equipment_id')
    
    if not lista_ids_equipamiento:
        return jsonify({'error': 'Es necesario ingresar los ids de los equipamientos a rentar.'}), 400
    
    student_id = services.get_person_id_with_ci(user_ci)
    
    result, message = services.rent_equipment(id, student_id, lista_ids_equipamiento)
    
    if result > 0: 
        return jsonify({'msg': message}), 200
    else:
        return jsonify({'error': message}), 400
    

@app.route('/classes/<int:id>/infromation', methods=['GET']) 
@jwt_required()
def get_class_information(id):
    '''
    este endpoint no requiere un body
    '''
    claims = get_jwt()
    role = services.get_role(claims.get("role_id"))
    user_ci = int(get_jwt_identity() )   
    class_information = services.get_extended_class_info(id)
    
    match role:
        case 'admin':
            return jsonify(class_information), 200
        case 'instructor':
            if not services.is_instructor_responsible(id, user_ci):
                return jsonify({'error': 'Debe ser instructor responsable de la clase para acceder a la información'}), 400   
            
        case 'student':
            if not services.is_student_enrolled(user_ci, id):
                return jsonify({'error': 'Debe estar inscripto a la clase para poder acceder a la información.'}), 400
        case _:
            return jsonify({'error': 'Rol no identificado'}), 400
            
    return jsonify(class_information), 200
    
    
@app.route('/classes/<int:id>/enrolled-students', methods=['GET']) 
@jwt_required()
def get_enrolled_students(id):
    claims = get_jwt()
    role = services.get_role(claims.get("role_id"))
    
    if(role != "instructor" and role != 'admin'): # si es estudiante o no reconocido
        return jsonify({'error': 'No tienes permiso de acceder a lista de inscriptos.'}), 400 
    
    user_ci = int(get_jwt_identity())
    enrolled_students = services.get_enrolled_students(id)
    
    if role == 'instructor':
        if not services.is_instructor_responsible(id, user_ci):
                return jsonify({'error': 'Debes ser el instructor responsable para acceder a la lista de inscriptos'}), 400
    
    return jsonify(enrolled_students), 200
        
            
@app.route('/classes/<int:id>/roll-call', methods=['POST']) 
@jwt_required()
def roll_call(id):
    '''
    cuerpo requerido:
        - students_present: [lista con los ids de los estudiantes que fueron parte]
    '''
    claims = get_jwt()
    role = services.get_role(claims.get("role_id"))
    
    if(role != "instructor"):
        return jsonify({'error': 'Debes ser instructor para pasar la lista.'}), 400
    
    user_ci = int(get_jwt_identity())
    
    if not services.is_instructor_responsible(id, user_ci):
        return jsonify({'error': 'Debes ser el instructor responsable para pasar la lista'}), 400
    
    data = request.get_json() 
    students_present = data.get('students_present')
    
    result, message = services.roll_call(id, students_present)
    
    if result > 0: 
        return jsonify({'msg': message}), 200
    else:
        return jsonify({'error': message}), 400
    

@app.route('/instructor/class-calendar', methods=['GET']) 
@jwt_required()
def get_class_calendar():
    claims = get_jwt()
    role = services.get_role(claims.get("role_id"))
    
    if(role != "instructor"):
        return jsonify({'error': 'Debes ser instructor para poder acceder al calendario.'}), 400
    
    user_ci = int(get_jwt_identity())
    instructor_calendar = services.get_class_calendar(user_ci)
    
    return jsonify(instructor_calendar), 200
    
@app.route('/instructor/class-information', methods=['GET']) 
@jwt_required()
def get_instructor_classes():
    claims = get_jwt()
    role = services.get_role(claims.get("role_id"))
    
    if(role != "instructor"):
        return jsonify({'error': 'Debes ser instructor para poder acceder a las clases.'}), 400
    
    user_ci = get_jwt_identity()
    result, data = services.get_class_data_from_an_instructor(user_ci)
    
    if result > 0:
        return jsonify(data), 200
    elif result == 0:
        return  jsonify({'msg': data}), 200
    else:
        return jsonify({'error': data}), 400
    
"""
@app.route('/instructor/class-information', methods=['GET']) 
@jwt_required()
def get_instructor_classes():
    '''
    dado un instructor (que inició sesión) se devuelven todas las clases de las que es responsable 
    '''
    claims = get_jwt()
    role = services.get_role(claims.get("role_id"))
    
    if(role != "instructor"):
        return jsonify({'error': 'Debes ser instructor para poder acceder a las clases.'}), 400
    
    user_ci = int(get_jwt_identity())
    result, data = services.get_class_data_from_an_instructor(user_ci)
    
    if result > 0:
        return jsonify(data), 200
    elif result == 0:
        return  jsonify({'msg': data}), 200
    else:
        return jsonify({'error': data}), 400
    
"""
@app.route('/activities/add-activity', methods=['POST']) 
@jwt_required()
def add_activity():
    '''
    cuerpo requerido:
        - description: nombre de la neuva actividad
        - cost: costo de la actividad
    '''
    
    claims = get_jwt()
    role = services.get_role(claims.get("role_id"))
    
    if(role != "admin"):
        return jsonify({'error': 'Esta acción puede ser realizada únicamente por el administrador.'}), 400
        
    data = request.get_json()
    description = data.get('description')
    cost = data.get('cost')
    
    if not description or not cost:
        return jsonify({'error': 'Faltan datos requeridos'}), 400
        
    result, message = services.add_activity(description, cost)
    if result > 0: 
        return jsonify({'msg': message}), 200
    else:
        return jsonify({'error': message}), 400    
    

@app.route('/activities', methods=['GET']) 
@jwt_required()
def get_all_activities(): 
    '''
    devuelve todas las actividades
    '''   
    claims = get_jwt()
    role = services.get_role(claims.get("role_id"))
    
    if(role != "admin"):
        return jsonify({'error': 'Esta acción puede ser realizada únicamente por el administrador.'}), 400

    all_activities = services.get_all_activities()
    
    return jsonify(all_activities), 200
    

@app.route('/activities/<int:id>/modify-cost', methods=['PATCH']) 
@jwt_required()
def modify_cost(id):    
    '''
    cuerpo requerido:
        - cost: nuevo costo de la acitvidad
    '''
    claims = get_jwt()
    role = services.get_role(claims.get("role_id"))
    
    if(role != "admin"):
        return jsonify({'error': 'Esta acción puede ser realizada únicamente por el administrador.'}), 400
    
    data = request.get_json()
    cost = data.get('cost')
    
    if not cost:
        return jsonify({'error': 'Faltan datos requeridos.'}), 400
        
    result, message = services.modify_activity_cost(id, cost)
    
    if result >= 0:
        return  jsonify({'msg': message}), 200
    else:
        return jsonify({'error': message}), 400
    
    
@app.route('/turns/add-turn', methods=['POST']) 
@jwt_required()
def add_turn():
    '''
    cuerpo requerido:
        - start_time: ej. '09:00:00'
        - end_time
    '''
    
    claims = get_jwt()
    role = services.get_role(claims.get("role_id"))
    
    if(role != "admin"):
        return jsonify({'error': 'Esta acción puede ser realizada únicamente por el administrador.'}), 400
        
    data = request.get_json()
    description = data.get('start_time')
    cost = data.get('end_time')
    
    if not description or not cost:
        return jsonify({'error': 'Faltan datos requeridos'}), 400
        
    result, message = services.add_activity(description, cost)
    if result > 0: 
        return jsonify({'msg': message}), 200
    else:
        return jsonify({'error': message}), 400  
    
    
@app.route('/turns', methods=['GET']) 
@jwt_required()
def get_turn():    
    '''
    devuelve todos los turnos disponibles
    '''
    claims = get_jwt()
    role = services.get_role(claims.get("role_id"))
    
    if(role != "admin"):
        return jsonify({'error': 'Esta acción puede ser realizada únicamente por el administrador.'}), 400
    
    turns = services.get_all_turns()
    
    return jsonify(turns)


@app.route('/student/class-information', methods=['GET']) 
@jwt_required()
def get_student_classes(): 
    '''
    dado un estudiante (que inició sesión) se devuelven todas las clases de las que es responsable 
    '''
    claims = get_jwt()
    role = services.get_role(claims.get("role_id"))
    
    if(role != "student"):
        return jsonify({'error': 'Debes ser estudiante para poder acceder a las clases.'}), 400
    
    user_ci = int(get_jwt_identity())
    result, data = -1, 'aún no implementado' # services.get_class_data_from_an_instructor(user_ci)
    
    if result > 0:
        return jsonify(data), 200
    elif result == 0:
        return  jsonify({'msg': data}), 200
    else:
        return jsonify({'error': data}), 400
    

@app.route('/instructors', methods=['GET']) 
@jwt_required()
def get_all_instructors(): 
    '''
    devuelve todos los instructores 
    '''   
    claims = get_jwt()
    role = services.get_role(claims.get("role_id"))
    
    if(role != "admin"):
        return jsonify({'error': 'Esta acción puede ser realizada únicamente por el administrador.'}), 400

    all_instructors = services.get_all_instructors()
    
    return jsonify(all_instructors), 200    


@app.route('/students', methods=['GET']) 
@jwt_required()
def get_all_students(): 
    '''
    devuelve todos los estudiantes
    '''   
    claims = get_jwt()
    role = services.get_role(claims.get("role_id"))
    
    if(role != "admin"):
        return jsonify({'error': 'Esta acción puede ser realizada únicamente por el administrador.'}), 400

    all_students = services.get_all_students()
    
    return jsonify(all_students), 200   

  
if __name__ == '__main__':
    app.run(debug=True)

