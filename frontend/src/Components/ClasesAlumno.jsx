import React, { useState } from "react";
import "./ClasesAlumno.css";
import alumnoService from "../Services/alumnoService";

const ClasesAlumno = ({ clases, setClases }) => {
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [currentClass, setCurrentClass] = useState(null);

  const handleOpenModal = (clase) => {
    setCurrentClass(clase);
    setOpenDetailsModal(true);
  };

  const handleRemoveStudent = async (classId) => {
    try {
      const response = await alumnoService.removeStudentFromClass(classId);
      if (response && response.code === 200) {
        console.log("Dado de baja exitosamente:", response.msg);
        window.location.reload() 

        setClases((prevClases) =>
          prevClases.filter((clase) => clase.class_id !== classId)
        );

        alert("Te has dado de baja exitosamente de la clase.");
      } else {
        alert("No se pudo procesar la baja. Intenta de nuevo.");
      }
    } catch (err) {
      console.error("Error al procesar la baja:", err);
      alert("Hubo un error al procesar la solicitud.");
    } finally {
      setOpenDetailsModal(false); 
    }
  };

  if (!clases || clases.length === 0) {
    return <p>No estás inscrito en ninguna clase.</p>;
  }

  return (
    <div
      style={{
        width: "80%",
        justifyContent: "center",
        alignItems: "center",
        gap: "15px",
        display: "flex",
        padding: 20,
        flexWrap: "wrap",
      }}
    >
      {clases.map((clase) => (
        <div key={clase.class_id} className="clase-card">
          <h4>{clase.name}</h4>
          <p>
            <strong>Descripción:</strong> {clase.description}
          </p>
          <p>
            <strong>Horario:</strong> {clase.start_time} - {clase.end_time}
          </p>
          <button onClick={() => handleOpenModal(clase)}>Ver Detalle</button>
        </div>
      ))}
      {openDetailsModal && (
        <DetailsModal
          clase={currentClass}
          onClose={() => setOpenDetailsModal(false)}
          onRemove={handleRemoveStudent}
        />
      )}
    </div>
  );
};

const DetailsModal = ({ clase, onClose, onRemove }) => {
  const handleRemove = () => onRemove(clase.class_id);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} 
      >
        <h2>Detalles de clase</h2>
        <div className="info">
          <p>
            <strong>Actividad:</strong> {clase.description}
          </p>
        </div>
        <div className="info">
          <p>
            <strong>Modalidad:</strong> {clase.is_group ? "Grupal" : "Individual"}
          </p>
        </div>
        <div className="info">
          <p>
            <strong>Horario:</strong> {clase.start_time} - {clase.end_time}
          </p>
        </div>
        <div className="info">
          <p>
            <strong>Fecha inicio:</strong> {clase.start_date}
          </p>
        </div>
        <div className="info">
          <p>
            <strong>Fecha fin:</strong> {clase.end_date}
          </p>
        </div>
        <div className="info">
          <p>
            <strong>Instructor:</strong> {clase.instructor_first_name} {clase.instructor_last_name}
          </p>
        </div>
        <div className="button-container">
          <button className="modal-button" onClick={onClose}>
            Cerrar
          </button>
          <button className="modal-button" onClick={handleRemove}>
            Darme de baja
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClasesAlumno;
