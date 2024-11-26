/*Functions*/
import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

import './LogIn.css';
/* Services */
import AuthService from "../Services/authService";

const LogIn = () => {
    // Mensaje de error en la tarjeta
    const [err_msg, setErrorMsg] = useState("");
    const [isHidden, setHidden] = useState(true);


    // Para redireccionar
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
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
        e.preventDefault();

        // Validación de campos vacíos
        if (!formData.email || !formData.password) {
            setErrorMsg("Los campos no pueden estar vacíos.");
            setHidden(false);
            return;
        }

        setErrorMsg("");
        setHidden(true);

        try {
            const user = await AuthService.login(formData.email, formData.password);

            if (user.code === 200) {
                localStorage.setItem("token", user.data.access_token); // Guardar el token
                localStorage.setItem("user", JSON.stringify(user.data.user_data)); // Guardar datos del usuario
                console.log("Respuesta del servidor:", user);
                console.log("datos guardados", user.data.user_data)
                // Redirigir según el rol
                if (user.data.user.role_id === 1) {
                    navigate("/alumno");
                } else if (user.data.user.role_id === 2) {
                    navigate("/instructor");
                } else if (user.data.user.role_id === 3) {
                    navigate("/Admin");
                } else {
                    setErrorMsg("Rol no válido. Contacta al administrador.");
                    setHidden(false);
                }
            }
        } catch (error) {
            setErrorMsg("Ocurrió un error durante el inicio de sesión.");
            setHidden(false);
            console.error("Login error:", error);
        }
    };

    return (
        <div className="login-container">
            <h2>Inicio de Sesión</h2>
            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                    <label>Mail:</label>
                    <input
                        type="text"
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
                    <button type="submit" className="register-btn">Iniciar Sesión</button>
                    {!isHidden && <p className="error-message">{err_msg}</p>}
                </div>
            </form>
            <div className="register-link-container">
                <p>¿No tienes cuenta aún? <Link to="/Register" className="register-link">Registrarse aquí</Link></p>
            </div>
        </div>
    );
};

export default LogIn;
