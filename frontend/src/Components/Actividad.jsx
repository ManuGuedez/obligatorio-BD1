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
                disabled={enrolledActivities.includes(activity.id)} // deshabilitar si ya está inscrito
            >
                {enrolledActivities.includes(activity.id) ? 'Darme de baja' : 'Inscribirme'}
            </button>


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

            {hasEquipment && (
                <p className="equipment-rental-text">
                    Alquiler del equipamiento: ${activity.price}
                </p>
            )}
        </div>
    );
};

export default Actividad;
