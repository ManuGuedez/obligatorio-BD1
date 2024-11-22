    import React from 'react';
    import './ClasesAlumno.css';


    const ClaseAlumno = ({ clases }) => {
        if (!clases || clases.length === 0) {
            return <p>No estás inscrito en ninguna clase.</p>;
        }

        return (
            <div className="clase-alumno-container">
                {clases.map((clase) => (
                    <div key={clase.class_id} className="clase-card">
                        <h4>{clase.name}</h4>
                        <p><strong>Descripción:</strong> {clase.description}</p>
                        <p><strong>Horario:</strong> {clase.schedule}</p>
                    </div>
                ))}
            </div>
        );
    };

    export default ClaseAlumno;
