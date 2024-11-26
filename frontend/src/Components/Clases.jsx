import React from "react";
import { useNavigate } from "react-router-dom";
import "./Clases.css";

const Clases = ({ start_time, end_time, description, class_id, studentCount }) => {
    const navigate = useNavigate();

    const handleDetailsClick = () => {
        navigate(`/class/${class_id}`);
    };

    return (
        <div className="class-card">
            <h3 className="class-title">{description}</h3>
            <p>Horario: {start_time} - {end_time}</p>
            <p>Cantidad de Alumnos: {studentCount}</p> {/* Mostrar cantidad de alumnos */}
            <div className="button-container">
                <button onClick={handleDetailsClick}>
                    Ver Detalles
                </button>
            </div>
        </div>
    );
};

export default Clases;
