from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, create_access_token
import obligatorio

app = Flask(__name__)

app.config['JWT_SECRET_KEY'] = 'obligatorio-bd-2024'  # Cambia esto por una clave secreta real
jwt = JWTManager(app)

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({"msg": "Email y contraseña son requeridos"}), 400
    
    user_ci = obligatorio.validate_user(email, password)
    
    if user_ci: 
        # se crea un token de acceso JWT
        access_token = create_access_token(identity=user_ci)
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
            result, message = obligatorio.create_instructor_account(instructor, email, password)
        case 'student':
            birth_date = data.get('birth_date') # manejar keyError
            student = {'ci': ci, 'first_name': first_name, 'last_name': last_name, 'birth_date': birth_date }
            result, message = obligatorio.create_student_account(student, email, password)
        case _:
            return jsonify({'msg': 'Rol no reconocido'}), 400
    
    if result > 0:
        return jsonify({'msg': message}), 200
    else:
        return jsonify({'msg': message}), 400
    

if __name__ == '__main__':
    app.run(debug=True)

