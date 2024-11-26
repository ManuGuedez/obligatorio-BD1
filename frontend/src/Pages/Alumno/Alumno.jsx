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
  const [onDeletedClass, setOnDeletedClass] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [enrolledActivities, setEnrolledActivities] = useState([]);

  useEffect(() => {
    setOnDeletedClass(false);
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const activitiesResponse = await alumnoService.getAlumnos(token);
        if (
          activitiesResponse &&
          activitiesResponse.code === 200 &&
          Array.isArray(activitiesResponse.data)
        ) {
          console.log("Actividades recibidas:", activitiesResponse.data);
          setActivities(activitiesResponse.data);
        } else {
          console.error(
            "Error: estructura inesperada en los datos de actividades",
            activitiesResponse
          );
          setError("El formato de datos de actividades no es válido.");
        }

        const studentClassesResponse = await alumnoService.getStudentClasses(
          token
        );
        if (
          studentClassesResponse &&
          studentClassesResponse.code === 200 &&
          Array.isArray(studentClassesResponse.data)
        ) {
          console.log(
            "Clases del estudiante recibidas:",
            studentClassesResponse.data
          );
          setStudentClasses(studentClassesResponse.data);
        } else {
          console.error(
            "Error: estructura inesperada en los datos de clases",
            studentClassesResponse
          );
          setError("El formato de datos de clases no es válido.");
        }
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError("Error al cargar datos.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {console.log(onDeletedClass)}, [onDeletedClass]);

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
        console.log({ activityId, studentId, token });
        const response = await alumnoService.enrollStudent(
          activityId,
          studentId,
          token
        );
        if (response && response.code === 200) {
          console.log("Inscripción exitosa:", response.msg);
          setEnrolledActivities([...enrolledActivities, activityId]);
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
                schedule: `${activity.days.join(", ")}: ${
                  activity.start_time
                } - ${activity.end_time}`,
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
      <ClasesAlumno clases={studentClasses} />
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
