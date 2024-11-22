import React, { useState } from 'react';
import './Actividad.css';

const Actividad = ({ activity, openModal, toggleEnrollment, enrolledActivities }) => {
    const [hasEquipment, setHasEquipment] = useState(false);

    const handleEquipmentToggle = () => {
        setHasEquipment(!hasEquipment);
    };

    return (
        <div className="activity-card">
            <h3>{activity.name}</h3>
            <p><strong>Horario:</strong> {activity.schedule}</p>

            <button className="details-btn" onClick={() => openModal(activity)}>Ver Detalles</button>
            <button
                className={`enroll-btn ${enrolledActivities.includes(activity.id) ? 'enrolled' : ''}`}
                onClick={() => toggleEnrollment(activity.id)}
            >
                {enrolledActivities.includes(activity.id) ? 'Darme de baja' : 'Inscribirme'}
            </button>

            {/* Switch con texto a la izquierda */}
            <div className="equipment-switch">
                <span className="equipment-label">Necesito equipamiento</span>
                <label className="switch">
                    <input
                        type="checkbox"
                        checked={hasEquipment}
                        onChange={handleEquipmentToggle}
                    />
                    <span className="slider"></span>
                </label>
            </div>

            {/* Mostrar mensaje de alquiler de equipamiento si el switch está activado */}
            {hasEquipment && (
                <p className="equipment-rental-text">
                    Alquiler del equipamiento: ${activity.price}
                </p>
            )}
        </div>
    );
};

export default Actividad;
