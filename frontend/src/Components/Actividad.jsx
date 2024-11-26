import React from "react";
import "./Actividad.css";

const Actividad = ({ activity, openModal, toggleEnrollment, enrolledActivities }) => {
    return (
        <div className="activity-card">
            <h3>{activity.name}</h3>
            <p>
                <strong>Horario:</strong> {activity.schedule}
            </p>
            <button className="details-btn" onClick={() => openModal(activity)}>
                Ver Detalles
            </button>
            <button
                className={`enroll-btn ${enrolledActivities.includes(activity.id) ? "enrolled" : ""}`}
                onClick={() => toggleEnrollment(activity.id)}
                disabled={enrolledActivities.includes(activity.id)}
            >
                {enrolledActivities.includes(activity.id) ? "Darme de baja" : "Inscribirme"}
            </button>
        </div>
    );
};

export default Actividad;
