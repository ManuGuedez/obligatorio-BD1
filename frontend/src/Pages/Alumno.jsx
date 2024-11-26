import React, { useState } from 'react';
import Actividad from '../Components/Actividad';
import './Alumno.css';
import NavBar from '../Components/NavBar';

const activities = [
    {
        id: 1,
        name: 'Taller de Programación',
        shortDescription: 'Aprende sobre programación avanzada.',
        schedule: 'Lunes 10:00 - 12:00',
        instructor: 'Prof. Juan Pérez',
        details: 'En este taller, abordaremos temas avanzados de programación, incluyendo algoritmos y estructuras de datos.',
        price: 15,
    },
    {
        id: 2,
        name: 'Laboratorio de Redes',
        shortDescription: 'Explora las redes de comunicación.',
        schedule: 'Miércoles 14:00 - 16:00',
        instructor: 'Ing. Ana García',
        details: 'Laboratorio práctico para comprender el funcionamiento de redes de datos y protocolos de comunicación.',
        price: 20,
    },
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

    const handleOverlayClick = (e) => {
        // Cierra el modal solo si se hace clic en la superposición, no en el contenido del modal
        if (e.target.classList.contains('modal-overlay')) {
            closeModal();
        }
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
            <NavBar />
            <div className="actividades-header">
                <h2 className="actividades-title">Actividades</h2>
            </div>
            <div className="activities-container">
                {activities.map(activity => (
                    <Actividad
                        key={activity.id}
                        activity={activity}
                        openModal={openModal}
                        toggleEnrollment={toggleEnrollment}
                        enrolledActivities={enrolledActivities}
                    />
                ))}
            </div>

            {/* Modal de Detalles */}
            {showModal && selectedActivity && (
                <div className="modal-overlay" onClick={handleOverlayClick}>
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