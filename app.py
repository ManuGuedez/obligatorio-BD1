from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, get_jwt, jwt_required
import services
from datetime import timedelta
import smtp

app = Flask(__name__)

app.config['JWT_SECRET_KEY'] = 'obligatorio-bd-2024'
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=15) # esto para que el token expire cada 15 min

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

    
@app.route('/classes/<id>/turn', methods=['PUT'])
@jwt_required()
def modify_class_turn(id):
    data = request.get_json()
    claims = get_jwt()
    turn = data.get('turn') 
    
    role = services.get_role(claims.get('role_id'))
    
    if role != "instructor" or not role:
        return jsonify({"msg": "Permiso denegado: solo los instructores pueden modificar clases"}), 403
    
    result, message = services.modify_class_turn(id, turn) # asumiendo que me llega el id del turno
    
    # modificación exitosa
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
    

@app.route('/classes/<id>/instructor', methods=['PATCH'])
@jwt_required()
def get_instructor_schedules(id): # id de la clase
    data = request.get_json()
    instructor_ci = data.get("instructor_ci") # ci del instructor al que le quiero asignar la clase
    claims = get_jwt()
    role = services.get_role(claims.get("role_id"))
    
    if(role != "admin"):
        return jsonify({'msg': 'Esta acción puede ser realizada únicamente por el administrador'}), 400
    
    turn_id = services.get_class_turn(id) 
    instructor_schedules = services.get_instructor_schedules(instructor_ci) # set con los horarios ocupados del instructor
    
    if instructor_schedules.__contains__(turn_id):
        return jsonify({'msg': 'El instructor ya tiene una clase agendada en ese horario'}), 409 # conflict
    
    result, message = services.modify_class_instructor(id, instructor_ci)    
    if result > 0: 
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


if __name__ == '__main__':
    app.run(debug=True)

