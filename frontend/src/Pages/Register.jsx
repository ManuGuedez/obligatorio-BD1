import React, { useState } from 'react';
import './Register.css';
import { Link, useNavigate } from "react-router-dom";
/* Services */
import AuthService from "../Services/authService"

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        lastname: "",
        rol: "", // Agregamos rol como un campo select
        birthday: "", // Nuevo campo para la fecha de nacimiento
        ci: "",
        email: "",
        password: "",
    });

    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const roleMapping = {
        Instructor: "instructor",
        Alumno: "student",
    };

    const dataToSend = {
        ...formData,
        rol: roleMapping[formData.rol], // Cambia 'Instructor' → 1, 'Alumno' → 2
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Previene la recarga de la página
        if (!formData.name || !formData.lastname || !formData.rol || !formData.email || !formData.password || !formData.ci) {
            setErrorMessage("Todos los campos son obligatorios.");
            setSuccessMessage("");
            return;
        }

        // Simulación de registro (ejemplo)
        try {
            const response = await AuthService.register(dataToSend);
            if (response.code === 200) {
                setSuccessMessage("Registro exitoso. Ahora puedes iniciar sesión.");
                setErrorMessage("");
                navigate("/login");
            } else {
                setErrorMessage(response.data?.error || "Error al registrar el usuario.");
                setSuccessMessage("");
            }
        } catch (error) {
            setErrorMessage("Ocurrió un error durante el registro.");
            setSuccessMessage("");
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
