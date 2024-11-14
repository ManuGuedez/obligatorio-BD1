from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, get_jwt, jwt_required
import services
from datetime import timedelta
import smtp

app = Flask(__name__)

app.config['JWT_SECRET_KEY'] = 'obligatorio-bd-2024'
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=30) # esto para que el token expire cada 30 min

jwt = JWTManager(app)

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({"msg": "Email y contraseña son requeridos"}), 400
    
    user_ci, role_id = services.validate_user(email, password)
    
    if user_ci and role_id: 
        # se crea un token de acceso JWT
        access_token = create_access_token(identity=user_ci, additional_claims={'role_id': role_id})
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({"msg": "Credenciales incorrectas"}), 401


@app.route('/register', methods=['POST'])
def register_user():
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
        case 'student':
            birth_date = data.get('birth_date') # manejar keyError
            student = {'ci': ci, 'first_name': first_name, 'last_name': last_name, 'birth_date': birth_date }
            result, message = services.create_student_account(student, email, password)
        case _:
            return jsonify({'msg': 'Rol no reconocido'}), 400
    
    if result > 0:
        return jsonify({'msg': message}), 200
    else:
        return jsonify({'msg': message}), 400

    
@app.route('/classes/<id>/students', methods=['PUT'])
@jwt_required()
def modify_class_students(id):
    data = request.get_json()
    user_ci = get_jwt_identity()
    claims = get_jwt() 
    action = data.get('action') 
    
    if not action:
        return jsonify({"msg": "Debe ingresar la acción a realizar"}), 400

    role = services.get_role(claims.get('role_id'))
    
    # agregar opción para administrator
    match role:
        case 'instructor':
            student_ci = data.get('student_ci')
                        
            if not student_ci:
                return jsonify({"msg": "Debe ingresar la ci del estudiante."}), 400
            
            result, message = services.modify_students_class(id, student_ci, action)            
        case 'student': 
            result, message = services.modify_students_class(id, user_ci, action)
        case _:
            return jsonify({"msg": "Rol inadecuado para realizar esta acción"}), 400

    # modificación exitosa
    if result > 0: 
        return jsonify({'msg': message}), 200
    else:
        return jsonify({'msg': message}), 400
    
@app.route('/classes/new-class', methods=['POST'])
@jwt_required()
def create_class():
    
    # primero se verifica que quien intenta crear una clase es el administrador 
    claims = get_jwt()
    role = services.get_role(claims.get("role_id"))
    
    if(role != "admin"):
        return jsonify({'msg': 'Esta acción puede ser realizada únicamente por el administrador'}), 400
    
    # en caso de que sea el adminsitrador
    data = request.get_json()
    instructor_id = data.get('instructor_id')
    instructor_ci = services.get_person_ci_with_id(instructor_id)
    if instructor_ci == -1:
        return jsonify({'msg': 'No es posible identificar el id del instructor ingresado'}), 400
    
    start_date = data.get('start_date')
    end_date = data.get('end_date')
    
    activity = str(data.get('activity')).strip().capitalize() # premier letra en may y resto en min
    activities = services.get_activities()
    activity = activities.get(activity)
    
    if not activity:
        return jsonify({'msg': 'La actividad ingresada no es válida'}), 400        
    
    turn = data.get('turn')
    days = data.get('days') # lista con los días en los que se quiere dictar la clase
    days_ids = services.get_days() # devuelve diccionario con días y sus respectivos ids
    
    # reemplazo los días con los ids
    for i in range(len(days)):
        id = days_ids.get(str(days[i]).lower())
        if id:
            days[i] = id
        else:
             # en caso de que el valor no sea un día válido se pone -1 entonces no altera la query
            return jsonify({'msg': 'Se ingresó un día inválido, deben ser de lunes a viernes.'}), 400

    if services.is_instructor_busy(instructor_id, turn, days, start_date, end_date):
        return jsonify({'msg': 'El instructor ya tiene clases en ese horario'}), 400
    
    result, message = services.add_class(instructor_ci, activity, turn, start_date, end_date, days)
    
    if result > 0: 
        return jsonify({'msg': message}), 200
    else:
        return jsonify({'msg': message}), 400


@app.route('/classes/<int:id>/modify-class', methods=['PATCH']) 
@jwt_required()
def modify_class(id):
    # primero se verifica que quien intenta crear una clase es el administrador 
    claims = get_jwt()
    role = services.get_role(claims.get("role_id"))
    
    if(role != "admin"):
        return jsonify({'msg': 'Esta acción puede ser realizada únicamente por el administrador.'}), 400
    
    data = request.get_json()
    turn_id = data.get('turn_id')
    instructor_id = data.get('instructor_id')          
        
    instructor_ci = services.get_person_ci_with_id(instructor_id)
    if instructor_ci == -1:
        return jsonify({'msg': 'No es posible identificar el id del instructor ingresado'}), 400            
    
    class_info = services.get_basic_class_info(id)
    
    if len(class_info) <= 0:
        return jsonify({'msg': 'El id de la clase ingresada no se encuentra en la base de datos.'}), 400
    
    # class_info = class_info[0]
    days = [int(data["day_id"]) for data in class_info]
    turn_time = services.get_turn_time(class_info[0]["turn_id"])
    
    if not services.can_modify(turn_time["start_time"], turn_time["end_time"], days):
        return jsonify({'msg': 'No es posible modificar la clase dado que se encuentra en curso.'}), 400
    
    if not turn_id and not instructor_id:
        return jsonify({'msg': 'Es necesario ingresar turno a modificar o instructor'}), 400  
        
    current_class_instructor = class_info[0]['instructor_id']
    
    # si lo que se intenta modificar es el turno de la clase
    if turn_id and instructor_id == int(current_class_instructor):
        if turn_id == class_info[0]["turn_id"]:
            return jsonify({'msg': 'La clase ya se encunetra en el turno y instructor especificados.'}), 400
            
        instructor_schedule = services.get_instructor_schedule(instructor_id, turn_id, days) # falta pasarle parametros, para eso pasar los days que devuelve la info de la clase pasarlos a una única lista y mandarlo como parámentros.
        if len(instructor_schedule) > 0:
            return jsonify({'msg': 'No es posible modificar el turno de la clase porque el instructor se encuentra ocupado en ese horario.'}), 400
        is_instructor_modified = False
        result, message = services.modify_class_turn(id, turn_id)
    # si lo que se quiere modificar es el instructor
    elif instructor_id != current_class_instructor and (not turn_id or turn_id == class_info[0]["turn_id"]):
        instructor_schedule = services.get_instructor_schedule(instructor_id, class_info[0]["turn_id"], days)
        if len(instructor_schedule) > 0:
            return jsonify({'msg': 'No es posible modificar el instructor dado que tiene ya tiene otra clase en el horario de esta clase.'}), 400
        is_instructor_modified = True
        result, message = services.modify_class_instructor(id, instructor_ci)
    elif turn_id and instructor_id != int(current_class_instructor):
        return jsonify({'msg': 'No se pueden modificar turno e instructor de manera simultánea.'}), 400
        
    if result > 0: 
        if is_instructor_modified:
            class_information = services.get_class_information(id)
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
        return jsonify({'msg': message}), 400


@app.route('/add_user', methods=['POST']) 
@jwt_required()
def add_user():
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
        return jsonify({'msg': 'Esta acción puede ser realizada únicamente por el administrador.'}), 400
    
    data = request.get_json()
    ci = data.get('ci')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    user_type = data.get('user_type')
    
    if not ci or not first_name or not last_name or not user_type:
        return jsonify({'msg': 'Faltan datos obligatorios'}), 400
    
    match user_type:
        case 'instructor':
            person_id = services.add_person(ci, first_name, last_name) 
            
            if person_id <= 0:
                return jsonify({'msg': 'Hubo un problema al ingresar la persona en el sistema.'}), 400
            
            result, message = services.add_instructor(person_id, ci, first_name, last_name)
            
        case 'student' | 'estudiante':
            birth_date = data.get('birth_date')
            
            if not birth_date:
                return jsonify({'msg': 'Falta especificar fecha de nacimiento del estudiante.'}), 400

            person_id = services.add_person(ci, first_name, last_name) 
            
            if person_id <= 0:
                return jsonify({'msg': 'Hubo un problema al ingresar la persona en el sistema.'}), 400
            
            result, message = services.add_student(person_id, ci, first_name, last_name, birth_date)

        case _:
            return jsonify({'msg': 'El tipo de usuario especificado no es adecuado, ingrese instructor o estudiante.'}), 400
    
    if result > 0: 
        return jsonify({'msg': message}), 200
    else:
        return jsonify({'msg': message}), 400
    
    
if __name__ == '__main__':
    app.run(debug=True)

