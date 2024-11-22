import React, { useState } from "react";
import AddNewInstructor from "../Components/Modals/AddNewInstructor/AddNewInstructor";
import AddStudentToClassModal from "../Components/Modals/AddStudentToClassModal/AddStudentToClassModal";
import ModifyActivityModal from "../Components/Modals/ModifyActivityModal/ModifyActivityModal";
import AddActivityModal from "./../Components/Modals/AddActivityModal/AddActivityModal";
import AddClassModal from "./../Components/Modals/AddClassModal/AddClassModal";
import AddStudentModal from "./../Components/Modals/AddStudent/AddStudentModal";
import AddTurnModal from "./../Components/Modals/AddTurnModal/AddTurnModal";
import "./Admin.css";
import ModifyClassModal from "./Modals/ModifyClassModal";
import ModifyTurnModal from "./Modals/ModifyTurnModal";
import ShowActivitiesModal from "./Modals/ShowActivitiesModal";

const Admin = () => {
  const [reports, setReports] = useState({});
  const [addInstructorIsOpen, setAddInstructorIsOpen] = useState(false);
  const [addActivityIsOpen, setAddActivityIsOpen] = useState(false);
  const [addTrunIsOpen, setAddTurnIsOpen] = useState(false);
  const [addStudentIsOpen, setAddStudentIsOpen] = useState(false);
  const [addClassIsOpen, setAddClassIsOpen] = useState(false);
  const [addStudentToClass, setAddStudentToClass] = useState(false);
  const [showModifyActivity, setShowModifyActivity] = useState(false);

  // // Modal para eliminar un instructor
  // const [showRemoveModal, setShowRemoveModal] = useState(false);
  // const handleCloseRemoveModal = () => setShowRemoveModal(false);
  // const handleRemoveInstructor = () => {
  //     setShowRemoveModal(true)
  // };

  // Modal para modificar un turno
  const [showModifyTurn, setShowModifyTurn] = useState(false);
  const handleCloseModifyTurnModal = () => setShowModifyTurn(false);
  const handleModifyTurn = () => {
    setShowModifyTurn(true);
  };

  // Modal para mostrar actividades
  const [showShowActivities, setShowShowActivities] = useState(false);
  const handleCloseShowActivitiesModal = () => setShowShowActivities(false);
  const handleShowActivities = () => {
    setShowShowActivities(true);
  };

  // Modal para modificar una clase
  const [showModifyClass, setShowModifyClass] = useState(false);
  const handleCloseModifyClassModal = () => setShowModifyClass(false);
  const handleModifyClass = () => {
    setShowModifyClass(true);
  };

  // Modal para agregar un estudiante a una clase
  const [showAddStudentToClass, setShowAddStudentToClass] = useState(false);
  const handleCloseAddStudentToClassModal = () =>
    setShowAddStudentToClass(false);
  const handleAddStudentToClass = () => {
    setShowAddStudentToClass(true);
  };

  const handleRemoveStudent = () => {
    /* Lógica para eliminar alumno */
  };
  const generateReports = () => {
    /* Lógica para generar reportes */
  };
  const handleEditInstructor = () => {
    /* Lógica para editar instructor */
  };

  return (
    <div className="admin-dashboard">
      <h1>Panel de Administración</h1>
      <div className="admin-card-container">
        {/* Gestión de Instructores */}
        <div className="admin-card">
          <h2>Gestión de Instructores</h2>
          <button onClick={() => setAddInstructorIsOpen(true)}>
            Agregar Instructor
          </button>
          <button onClick={handleEditInstructor}>Modificar Instructor</button>{" "}
          {/* EN VEMOS */}
        </div>

        {/* Gestión de Turnos y Horarios */}
        <div className="admin-card">
          <h2>Gestión de Turnos y Horarios</h2>
          <button onClick={() => setAddTurnIsOpen(true)}>Crear Turno</button>
          <button onClick={handleModifyTurn}>Modificar Turno</button>
        </div>

        {/* Gestión de Actividades */}
        <div className="admin-card">
          <h2>Gestión de Actividades</h2>
          <button onClick={() => setAddActivityIsOpen(true)}>
            Agregar Actividad
          </button>
          <button onClick={handleShowActivities}>Ver Actividades</button>
          <button onClick={() => setShowModifyActivity(true)}>Modificar Actividad</button>
        </div>

        {/* Gestión de Alumnos */}
        <div className="admin-card">
          <h2>Gestión de Alumnos</h2>
          <button onClick={() => setAddStudentIsOpen(true)}>
            Agregar Alumno
          </button>
        </div>

        {/* Gestión de Clases*/}
        <div className="admin-card">
          {/* MODIFICAR LOS HANDLERS */}
          <h2>Gestión de Clases</h2>
          <button onClick={() => setAddClassIsOpen(true)}>Crear Clase</button>
          <button onClick={handleModifyClass}>Modificar Clase</button>
          <button onClick={() => setAddStudentToClass(true)}>
            Inscribir alumno
          </button>
          <button onClick={handleRemoveStudent}>Eliminar Alumno</button>
        </div>

        {/* Reportes */}
        <div className="admin-card">
          <h2>Reportes</h2>
          <button onClick={generateReports}>Generar Reportes</button>
          <div className="report-content">
            {reports.mostPopularActivity && (
              <p>Actividad más popular: {reports.mostPopularActivity}</p>
            )}
            {reports.highestIncomeActivity && (
              <p>Actividad con más ingresos: {reports.highestIncomeActivity}</p>
            )}
            {reports.mostClassesSchedule && (
              <p>
                Turno con más clases dictadas: {reports.mostClassesSchedule}
              </p>
            )}
          </div>
        </div>
      </div>

      {addInstructorIsOpen && (
        <AddNewInstructor onClose={() => setAddInstructorIsOpen(false)} />
      )}

      {addClassIsOpen && (
        <AddClassModal onClose={() => setAddClassIsOpen(false)} />
      )}

      {addTrunIsOpen && (
        <AddTurnModal onClose={() => setAddTurnIsOpen(false)} />
      )}

      <ModifyTurnModal
        isOpen={showModifyTurn}
        onClose={() => handleCloseModifyTurnModal(false)}
      />

      {addStudentIsOpen && (
        <AddStudentModal onClose={() => setAddStudentIsOpen(false)} />
      )}

      {addActivityIsOpen && (
        <AddActivityModal onClose={() => setAddActivityIsOpen(false)} />
      )}

      <ShowActivitiesModal
        isOpen={showShowActivities}
        onClose={() => handleCloseShowActivitiesModal(false)}
      />

      {showModifyActivity && (
        <ModifyActivityModal
          onClose={() => setShowModifyActivity(false)}
        />
      )}
      <ModifyClassModal
        isOpen={showModifyClass}
        onClose={() => handleCloseModifyClassModal(false)}
      />

      {addStudentToClass && (
        <AddStudentToClassModal onClose={() => setAddStudentToClass(false)} />
      )}
    </div>
  );
};

export default Admin;
