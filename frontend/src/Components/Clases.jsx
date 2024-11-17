import React, { useState } from "react";
import "./Clases.css"

const Clases = ({ turno, deporte, maxAlumnos, alumnos }) => {
    const toggleDetails = () => {
        setShowDetails(!showDetails);
    };

    const cantAlumnos = alumnos.length

    return (
        <div className="class-card">
            <p>{deporte}</p>
            <p>Horario: {turno}</p>
            <p>Alumnos inscriptos: {cantAlumnos} </p>
            <p>Cantidad máxima de alumnos: {maxAlumnos}</p>

            <div className="button-container">
                <button onClick={toggleDetails}>
                    Ver Detalles
                </button>
            </div>
        </div>
    );
};

export default Clases;