import React, { useState, useEffect } from 'react';
import Actividad from '../Components/Actividad';
import ClasesAlumno from '../Components/ClasesAlumno'; 
import alumnoService from '../Services/alumnoService';
import './Alumno.css';

const Alumno = () => {
    const [activities, setActivities] = useState([]); 
    const [studentClasses, setStudentClasses] = useState([]); 
    const [isLoading, setIsLoading] = useState(true); 
    const [error, setError] = useState(null); 

    const [showModal, setShowModal] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [enrolledActivities, setEnrolledActivities] = useState([]); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');

                // lo uso para cargar actividades disponibles
                const activitiesResponse = await alumnoService.getAlumnos(token);
                if (activitiesResponse && activitiesResponse.code === 200 && Array.isArray(activitiesResponse.data)) {
                    console.log("Actividades recibidas:", activitiesResponse.data);
                    setActivities(activitiesResponse.data);
                } else {
                    console.error("Error: estructura inesperada en los datos de actividades", activitiesResponse);
                    setError('El formato de datos de actividades no es válido.');
                }

                // Cargar clases del estudiante
                const studentClassesResponse = await alumnoService.getStudentClasses(token);
                if (studentClassesResponse && studentClassesResponse.code === 200 && Array.isArray(studentClassesResponse.data)) {
                    console.log("Clases del estudiante recibidas:", studentClassesResponse.data);
                    setStudentClasses(studentClassesResponse.data);
                } else {
                    console.error("Error: estructura inesperada en los datos de clases", studentClassesResponse);
                    setError('El formato de datos de clases no es válido.');
                }
            } catch (err) {
                console.error("Error al cargar datos:", err);
                setError('Error al cargar datos.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
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

    const toggleEnrollment = async (activityId) => {
        
        const token = localStorage.getItem('token');
        const studentId = JSON.parse(atob(token.split('.')[1])).sub;
    
        if (enrolledActivities.includes(activityId)) {
            setEnrolledActivities(enrolledActivities.filter(id => id !== activityId));
        } else {
            try {
                console.log({activityId, studentId,    token});
                const response = await alumnoService.enrollStudent(activityId, studentId, token);
                if (response && response.code === 200) {
                    console.log('Inscripción exitosa:', response.msg);
                    setEnrolledActivities([...enrolledActivities, activityId]);
                } else {
                    console.error('Error al inscribir:', response.error);
                    setError('No se pudo inscribir en la clase. Intente de nuevo.');
                }
            } catch (err) {
                console.error('Error al inscribir:', err);
                setError('Error en la inscripción.');
            }
        }
    };
    

    if (isLoading) return <p>Cargando actividades y clases...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="alumno-container">
            <div className="actividades-header">
                <h2 className="actividades-title">Actividades disponibles</h2>
            </div>
            <div className="activities-container">
                {Array.isArray(activities) && activities.map((activity) => (
                    <Actividad
                        key={activity.class_id} // uso class_id como key
                        activity={{
                            id: activity.class_id,
                            name: activity.description || "Sin descripción", 
                            shortDescription: activity.description, 
                            schedule: `${activity.days.join(", ")}: ${activity.start_time} - ${activity.end_time}`, 
                            price: activity.cost || 0 
                        }}
                        openModal={openModal}
                        toggleEnrollment={toggleEnrollment}
                        enrolledActivities={enrolledActivities}
                    />
                ))}
            </div>

            <div className="clases-header">
                <h2 className="clases-title">Mis Clases:</h2>
            </div>
            <ClasesAlumno clases={studentClasses} /> {/* agregar las clases del estudiante */}

            {showModal && selectedActivity && (
                <div className="modal-overlay" onClick={handleOverlayClick}>
                    <div className="modal-content">
                        <span className="close-btn" onClick={closeModal}>&times;</span>
                        <h3>{selectedActivity.name}</h3>
                        <p><strong>Descripción:</strong> {selectedActivity.shortDescription}</p>
                        <p><strong>Horario:</strong> {selectedActivity.schedule}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Alumno;
