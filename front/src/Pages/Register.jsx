import React, { useState } from 'react';
import './Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        rol: '', // Agregamos rol como un campo select
        birthday: '', // Nuevo campo para la fecha de nacimiento
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
        e.preventDefault(); // Previene la recarga de la página
        if (formData.name === "" || formData.email === "" || formData.password === "") {
            alert("Fields can't be left empty.");
            return;
        }

        // Simulación de registro (ejemplo)
        console.log("User Registered:", formData);
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
                    <label>Rol:</label>
                    <select
                        name="rol"
                        value={formData.rol}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Seleccione un rol</option>
                        <option value="Instructor">Instructor</option>
                        <option value="Alumno">Alumno</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Fecha de Nacimiento:</label>
                    <input
                        type="date"
                        name="birthday"
                        value={formData.birthday}
                        onChange={handleChange}
                        required
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
