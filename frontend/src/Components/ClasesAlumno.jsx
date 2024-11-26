import React, { useState } from "react";
import "./ClasesAlumno.css";
import alumnoService from "../Services/alumnoService";

const ClaseAlumno = ({ clases }) => {
  if (!clases || clases.length === 0) {
    return <p>No estás inscrito en ninguna clase.</p>;
  }
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [currentClass, setCurrentClass] = useState(null);
  const handleOpenModal = (clase) => {
    setCurrentClass(clase);
    setOpenDetailsModal(true);
  };

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
        />
      )}
    </div>
  );
};

const DetailsModal = ({ clase, onClose }) => {
  console.log(clase);

  const handleRemoveStudent = async () => {
    await alumnoService.removeStudentFromClass(clase.class_id);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ gap: "200px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Detalles de clase</h2>
        <div className="info">
          <p>
            <strong>Actividad: </strong>
            {clase.description}
          </p>
        </div>
        <div className="info">
          <p>
            <strong>Modalidad: </strong>
            {clase.is_group ? "grupal" : "individual"}
          </p>
        </div>
        <div className="info">
          <p>
            <strong>Fecha inicio: </strong>
            {clase.start_date}
          </p>
        </div>
        <div className="info">
          <p>
            <strong>Fecha Fin: </strong>
            {clase.end_date}
          </p>
        </div>
        <div className="info">
          <p>
            <strong>Horario: </strong>
            {clase.start_time} - {clase.end_time}
          </p>
        </div>
        <div className="info">
          <p>
            <strong>Instructor responsable: </strong>
            {clase.instructor_first_name} {clase.instructor_last_name}
          </p>
        </div>
        <div className="button-container">
          <button className="modal-button" onClick={onClose}>
            Cerrar
          </button>
          <button className="modal-button" onClick={handleRemoveStudent}>Darme de baja</button>
        </div>
      </div>
    </div>
  );
};

export default ClaseAlumno;
