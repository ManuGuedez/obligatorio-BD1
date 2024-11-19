import React, { useState, useEffect } from 'react';
import Actividad from '../Components/Actividad';
import alumnoService from '../Services/alumnoService'; // Importar el servicio
import './Alumno.css';

const Alumno = () => {
    const [activities, setActivities] = useState([]); // Estado para actividades
    const [isLoading, setIsLoading] = useState(true); // Estado para la carga
    const [error, setError] = useState(null); // Estado para errores

    const [showModal, setShowModal] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [enrolledActivities, setEnrolledActivities] = useState([]);

    useEffect(() => {
        // Obtener actividades del backend
        const fetchActivities = async () => {
            try {
                const token = localStorage.getItem('token'); // Obtener token del almacenamiento
                const response = await alumnoService.getAlumnos(43158769, token); // Llamada al backend
                setActivities(response); // Actualizar actividades
            } catch (err) {
                setError('Error al cargar actividades.'); // Manejo de errores
                console.error(err);
            } finally {
                setIsLoading(false); // Finalizar estado de carga
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
