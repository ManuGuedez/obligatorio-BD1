import React, { useState } from 'react';
import './Register.css';

/* Services */
import AuthService from "../Services/authService"

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        username: '',
        ci: '',
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        if (formData.username === "" || formData.email === "" || formData.passwd === "") {
            setErrorMsg("Fields can't be left empty.");
            setHidden(false);
            return;
        }

        setErrorMsg("");
        setHidden(true);

        const user = await AuthService.register(username, email, passwd);

        if (user.code === 400) { // El usuario existe
            setErrorMsg("User already exists.");
            setHidden(false);
        } else {
            setHidden(true);
            navigate("/login");
        }
    };

    return (
        <div className="register-container">
            <h2>Registro</h2>
            <form onSubmit={handleSubmit} className="register-form">
                <div className="form-group">
                    <label>Nombre:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Ingrese su Nombre"
                    />
                </div>
                <div className="form-group">
                    <label>Apellido:</label>
                    <input
                        type="text"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleChange}
                        required
                        placeholder="Ingrese su Apellido"
                    />
                </div>
                <div className="form-group">
                    <label>Usuario:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        placeholder="Ingrese su usuario"
                    />
                </div>
                <div className="form-group">
                    <label>Cédula:</label>
                    <input
                        type="text"
                        name="ci"
                        value={formData.ci}
                        onChange={handleChange}
                        required
                        placeholder="Ingrese su Cédula"
                    />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Ingrese su email"
                    />
                </div>
                <div className="form-group">
                    <label>Contraseña:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Ingrese su contraseña"
                    />
                </div>
                <div className="register-btn-container">
                    <button type="submit" className="register-btn">Registrar</button>
                </div>
            </form>
        </div>
    );
};

export default Register;
