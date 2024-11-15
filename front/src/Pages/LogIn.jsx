import React, { useState } from 'react';
import './LogIn.css';

const LogIn = () => {
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

    const handleSubmit = (e) => {
        
        if (formData.username == "" || formData.password){
            
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
                        name="mail"
                        value={formData.mail}
                        onChange={handleChange}
                        required
                        placeholder="Ingrese su mail"
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
