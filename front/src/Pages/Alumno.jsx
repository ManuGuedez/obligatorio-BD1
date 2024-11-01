import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Alumno.css';

const activities = [
    {
        id: 1,
        name: 'Taller de Programación',
        shortDescription: 'Aprende sobre programación avanzada.',
        schedule: 'Lunes 10:00 - 12:00',
        instructor: 'Prof. Juan Pérez',
        details: 'En este taller, abordaremos temas avanzados de programación, incluyendo algoritmos y estructuras de datos.',
    },
    {
        id: 2,
        name: 'Laboratorio de Redes',
        shortDescription: 'Explora las redes de comunicación.',
        schedule: 'Miércoles 14:00 - 16:00',
        instructor: 'Ing. Ana García',
        details: 'Laboratorio práctico para comprender el funcionamiento de redes de datos y protocolos de comunicación.',
    },
    // Agrega más actividades si deseas
];

const Alumno = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [enrolledActivities, setEnrolledActivities] = useState([]);

    const openModal = (activity) => {
        setSelectedActivity(activity);
        setShowModal(true);
    };

    const closeModal = () => {
        setSelectedActivity(null);
        setShowModal(false);
    };

    const toggleEnrollment = (activityId) => {
        if (enrolledActivities.includes(activityId)) {
            setEnrolledActivities(enrolledActivities.filter(id => id !== activityId));
        } else {
            setEnrolledActivities([...enrolledActivities, activityId]);
        }
    };

    return (
        <div className="alumno-container">
            <h2>Actividades</h2>
            <div className="activities-container">
                {activities.map(activity => (
                    <div key={activity.id} className="activity-card">
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
                        <div className="equipment-switch">
                            <label className="switch">
                                <input type="checkbox" />
                                <span className="slider round"></span>
                            </label>
                            <span className="equipment-label">Tengo equipamiento</span>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && selectedActivity && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close-btn" onClick={closeModal}>&times;</span>
                        <h3>{selectedActivity.name}</h3>
                        <p><strong>Horario:</strong> {selectedActivity.schedule}</p>
                        <p><strong>Instructor:</strong> {selectedActivity.instructor}</p>
                        <p>{selectedActivity.details}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Alumno;
