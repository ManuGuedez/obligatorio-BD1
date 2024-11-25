import React, { useEffect, useState } from "react";
import Actividad from "../../Components/Actividad";
import ClasesAlumno from "../../Components/ClasesAlumno";
import NavBar from "../../Components/NavBar";
import alumnoService from "../../Services/alumnoService";
import classes from "./Alumno.module.css";

const Alumno = () => {
  const [activities, setActivities] = useState([]);
  const [studentClasses, setStudentClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [enrolledActivities, setEnrolledActivities] = useState([]);

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await alumnoService.getAlumnos(token);
      if (response && response.code === 200 && Array.isArray(response.data)) {
        setActivities(response.data);
      } else {
        setError("El formato de datos de actividades no es válido.");
      }
    } catch (err) {
      console.error("Error al cargar actividades:", err);
      setError("Error al cargar actividades.");
    }
  };

  const fetchStudentClasses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await alumnoService.getStudentClasses(token);
      if (response && response.code === 200 && Array.isArray(response.data)) {
        setStudentClasses(response.data);
      } else {
        setError("No se pudo actualizar las clases del estudiante.");
      }
    } catch (err) {
      console.error("Error al actualizar las clases:", err);
      setError("Error al actualizar las clases.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchActivities(), fetchStudentClasses()]);
      setIsLoading(false);
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
    if (e.target.classList.contains(classes.modalOverlay)) {
      closeModal();
    }
  };

  const toggleEnrollment = async (activityId) => {
    const token = localStorage.getItem("token");
    const studentId = JSON.parse(localStorage.getItem("user"))[0].person_id;

    if (enrolledActivities.includes(activityId)) {
      setEnrolledActivities(
        enrolledActivities.filter((id) => id !== activityId)
      );
    } else {
      try {
        const response = await alumnoService.enrollStudent(
          activityId,
          studentId,
          token
        );
        if (response && response.code === 200) {
          console.log("Inscripción exitosa:", response.msg);
          setEnrolledActivities([...enrolledActivities, activityId]);

          setActivities((prevActivities) =>
            prevActivities.filter((activity) => activity.class_id !== activityId)
          );

          await fetchStudentClasses();
        } else {
          console.error("Error al inscribir:", response.error);
          setError("No se pudo inscribir en la clase. Intente de nuevo.");
        }
      } catch (err) {
        console.error("Error al inscribir:", err);
        setError("Error en la inscripción.");
      }
    }
  };

  if (isLoading) return <p>Cargando actividades y clases...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={classes.alumnoContainer}>
      <NavBar />
      <div className={classes.actividadesHeader}>
        <h2 className={classes.actividadesTitle}>Actividades disponibles</h2>
      </div>
      <div className={classes.activitiesContainer}>
        {Array.isArray(activities) &&
          activities.map((activity) => (
            <Actividad
              key={activity.class_id}
              activity={{
                id: activity.class_id,
                name: activity.description || "Sin descripción",
                shortDescription: activity.description,
                schedule: `${activity.days.join(", ")}: ${activity.start_time} - ${activity.end_time}`,
                price: activity.cost || 0,
              }}
              openModal={openModal}
              toggleEnrollment={toggleEnrollment}
              enrolledActivities={enrolledActivities}
            />
          ))}
      </div>
      <div className={classes.clasesHeader}>
        <h2 className={classes.clasesTitle}>Mis Clases:</h2>
      </div>
      <ClasesAlumno clases={studentClasses} setClases={setStudentClasses} />
      {showModal && selectedActivity && (
        <div className={classes.modalOverlay} onClick={handleOverlayClick}>
          <div className={classes.modalContent}>
            <span className={classes.closeBtn} onClick={closeModal}>
              &times;
            </span>
            <h3>{selectedActivity.name}</h3>
            <p>
              <strong>Descripción:</strong> {selectedActivity.shortDescription}
            </p>
            <p>
              <strong>Horario:</strong> {selectedActivity.schedule}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alumno;
