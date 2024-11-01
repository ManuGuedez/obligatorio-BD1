import React, { useState } from "react";

const Clases = ({ turno, deporte, maxAlumnos, alumnos }) => {
    const [showDetails, setShowDetails] = useState(false);

    const toggleDetails = () => {
        setShowDetails(!showDetails);
    };

    return (
        <div className="class-card">
            <p>{deporte}</p>
            <p>Horario: {turno}</p>
            <p>Cantidad máxima de alumnos: {maxAlumnos}</p>

            <div className="button-container">
                <button onClick={toggleDetails}>
                    {showDetails ? "Ocultar Detalles" : "Ver Detalles"}
                </button>
            </div>
        
            {showDetails && (
                <div className="class-details">
                    <h4>Detalles de la Clase</h4>
                    <p>Deporte: {deporte}</p>
                    <p>Horario: {turno}</p>
                    <p>Alumnos Inscritos:</p>
                    <ul>
                        {Array.isArray(alumnos) && alumnos.map((student, index) => (
                            <li key={index}>{student.name} - {student.email}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Clases;