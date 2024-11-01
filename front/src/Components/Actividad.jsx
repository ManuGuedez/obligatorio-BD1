import React from 'react';

const Actividad = ({ activity, openModal, toggleEnrollment, enrolledActivities }) => {
    return (
        <div className="activity-card">
            <h3>{activity.name}</h3>
            <p>{activity.shortDescription}</p>
            <p><strong>Horario:</strong> {activity.schedule}</p>
            <button onClick={() => openModal(activity)} className="details-btn">Ver Detalles</button>
            <button
                onClick={() => toggleEnrollment(activity.id)}
                className={`enroll-btn ${enrolledActivities.includes(activity.id) ? 'enrolled' : ''}`}
            >
                {enrolledActivities.includes(activity.id) ? 'Darme de baja' : 'Inscribirme'}
            </button>
        </div>
    );
};

export default Actividad;
