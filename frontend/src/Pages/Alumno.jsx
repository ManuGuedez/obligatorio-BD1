import React, { useState, useEffect } from 'react';
import Actividad from '../Components/Actividad';
import alumnoService from '../Services/alumnoService';
import './Alumno.css';

const Alumno = () => {
    const [activities, setActivities] = useState([]); // Estado para actividades
    const [isLoading, setIsLoading] = useState(true); // Estado para la carga
    const [error, setError] = useState(null); // Estado para errores

    const [showModal, setShowModal] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [enrolledActivities, setEnrolledActivities] = useState([]); // Inscripciones

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await alumnoService.getAlumnos(token);

                if (response && response.code === 200 && Array.isArray(response.data)) {
                    console.log("Actividades recibidas:", response.data);
                    setActivities(response.data);
                } else {
                    console.error("Error: estructura inesperada en los datos", response);
                    setError('El formato de datos no es válido.');
                }
            } catch (err) {
                console.error("Error al cargar actividades:", err);
                setError('Error al cargar actividades.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchActivities();
    }, []);

    const openModal = (activity) => {
        setSelectedActivity(activity);
        setShowModal(true);
    };

    const closeModal = () => {
        setSelectedActivity(null);
        setShowModal(false);
    };

    const handleOverlayClick = (e) => {
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

    if (isLoading) return <p>Cargando actividades...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="alumno-container">
            <div className="actividades-header">
                <h2 className="actividades-title">Actividades</h2>
            </div>
            <div className="activities-container">
                {Array.isArray(activities) && activities.map((activity) => (
                    <Actividad
                        key={activity.class_id} // Usar class_id como key
                        activity={{
                            id: activity.class_id,
                            name: activity.activity_title || activity.activity_description || "Sin descripción", // Mostrar título o descripción
                            shortDescription: activity.activity_description, // Descripción breve
                            schedule: `${activity.start_time} - ${activity.end_time}`, // Horario
                            price: activity.equipment_price || 0 // Precio del equipamiento
                        }}
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
                        <p><strong>Descripción:</strong> {selectedActivity.shortDescription}</p>
                        <p><strong>Horario:</strong> {selectedActivity.schedule}</p>
                        <p><strong>Precio del equipamiento:</strong> ${selectedActivity.price}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Alumno;
