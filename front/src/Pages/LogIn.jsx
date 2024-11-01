import React, { useState } from 'react';
import './LogIn.css';

const LogIn = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // aca va la lógica para mandar los datos al backend
        console.log('Datos del inicio de sesión:', formData);
    };

    return (
        <div className="login-container">
            <h2>Inicio de Sesión</h2>
            <form onSubmit={handleSubmit} className="login-form">
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
                </div>
            </form>
            <div className="register-link-container">
                <p>¿No tienes cuenta aún? <a href="http://localhost:5173/Register" className="register-link">Registrarse aquí</a></p>
            </div>
        </div>
    );
};

export default LogIn;
