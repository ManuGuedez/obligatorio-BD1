// import AddInstructorModal from './Modals/AddInstructorModal';
// import RemoveInstructorModal from './Modals/RemoveInstructorModal';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddNewInstructor from "../Components/Modals/AddNewInstructor/AddNewInstructor";
import AddStudentToClassModal from "../Components/Modals/AddStudentToClassModal/AddStudentToClassModal";
import ModifyActivityModal from "../Components/Modals/ModifyActivityModal/ModifyActivityModal";
import ModifyClassModal from "../Components/Modals/ModifyClassModal/ModifyClassModal";
import ModifyTurnModal from "../Components/Modals/ModifyTurnModal/ModifyTurnModal";
import ShowActivitiesModal from "../Components/Modals/ShowActivitiesModal/ShowActivitiesModal";
import NavBar from "../Components/NavBar";
import AddActivityModal from "./../Components/Modals/AddActivityModal/AddActivityModal";
import AddClassModal from "./../Components/Modals/AddClassModal/AddClassModal";
import AddStudentModal from "./../Components/Modals/AddStudent/AddStudentModal";
import AddTurnModal from "./../Components/Modals/AddTurnModal/AddTurnModal";
import DeletePersonModal from "./../Components/Modals/DeletePersonModal/DeletePersonModal";
import DeleteTurnModal from "./../Components/Modals/DeleteTurnModal/DeleteTurnModal";
import DeleteClassModal from "./../Components/Modals/DeleteClassModal/DeleteClassModal";
import RemoveStudentClassModal from "./../Components/Modals/RemoveStudentClassModal/RemoveStudentClassModal";
import MostStudentsModal from "../Components/Modals/ReportMostStudents/reportMostStudents";
import MostClassesModal from "../Components/Modals/ReportMostClasses/reportMosTClasses";
import ReportIncome from "../Components/Modals/ReportIncome/reportIncome";
import ModifyInstructorModal from "../Components/Modals/ModifyInstructor/ModifyInstructor";

import "./Admin.css";

const Admin = () => {
  const navigate = useNavigate();
  const [addInstructorIsOpen, setAddInstructorIsOpen] = useState(false);
  const [addActivityIsOpen, setAddActivityIsOpen] = useState(false);
  const [addTrunIsOpen, setAddTurnIsOpen] = useState(false);
  const [addStudentIsOpen, setAddStudentIsOpen] = useState(false);
  const [addClassIsOpen, setAddClassIsOpen] = useState(false);
  const [addStudentToClass, setAddStudentToClass] = useState(false);
  const [showModifyActivity, setShowModifyActivity] = useState(false);
  const [deletePersonIsOpen, setDeletePersonIsOpen] = useState(false);
  const [deleteStudentIsOpen, setDeleteStudentIsOpen] = useState(false);
  const [deleteTurnIsOpen, setDeleteTurnIsOpen] = useState(false);
  const [deleteClassIsOpen, setDeleteClassIsOpen] = useState(false);
  const [removeStudentClassIsOpen, setRemoveStudentClassIsOpen] =
    useState(false);
  const [showMostStudentsModal, setShowMostStudentsModal] = useState(false);
  const [showMostClassesModal, setShowMostClassesModal] = useState(false);
  const [showReportIncomeModal, setShowReportIncomeModal] = useState(false);
  const [showModifyInstructor, setShowModifyInstructor] = useState(false);
  // // Modal para eliminar un instructor
  // const [showRemoveModal, setShowRemoveModal] = useState(false);
  // const handleCloseRemoveModal = () => setShowRemoveModal(false);
  // const handleRemoveInstructor = () => {
  //     setShowRemoveModal(true)
  // };

  // Modal para modificar un turno

  const [showModifyTurn, setShowModifyTurn] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/Login");
    }
  }, []);

  // Modal para mostrar actividades
  const [showActivities, setShowActivities] = useState(false);

  // Modal para modificar una clase
  const [showModifyClass, setShowModifyClass] = useState(false);

  const generateReports = () => {
    /* Lógica para generar reportes */
  };
  const handleRemoveStudent = () => {
    /* Lógica para eliminar alumno */
  };

  const handleEditInstructor = () => {
    /* Lógica para editar instructor */
  };

  return (
    <div className="admin-dashboard">
      <NavBar />
      <h1>Panel de Administración</h1>
      <div className="admin-card-container">
        {/* Gestión de Instructores */}
        <div className="admin-card">
          <h2>Gestión de Instructores</h2>
          <div>
            <button onClick={() => setAddInstructorIsOpen(true)}>
              Agregar Instructor
            </button>
            <button onClick={() => setShowModifyInstructor(true)}>Modificar Instructor</button>{" "}
            <button onClick={() => setDeletePersonIsOpen(true)}>
              Eliminar Instructor
            </button>
          </div>
        </div>

        {/* Gestión de Turnos y Horarios */}
        <div className="admin-card">
          <h2>Gestión de Turnos y Horarios</h2>
          <div>
            <button onClick={() => setAddTurnIsOpen(true)}>Crear Turno</button>
            <button onClick={() => setDeleteTurnIsOpen(true)}>
              Eliminar Turno
            </button>

            <button onClick={() => setShowModifyTurn(true)}>
              Modificar Turno
            </button>
          </div>
        </div>

        {/* Gestión de Actividades */}
        <div className="admin-card">
          <h2>Gestión de Actividades</h2>
          <div>
            <button onClick={() => setAddActivityIsOpen(true)}>
              Agregar Actividad
            </button>
            <button onClick={() => setShowActivities(true)}>
              Ver Actividades
            </button>
            <button onClick={() => setShowModifyActivity(true)}>
              Modificar Actividad
            </button>
          </div>
        </div>

        {/* Gestión de Alumnos */}
        <div className="admin-card">
          <h2>Gestión de Alumnos</h2>
          <div>
            <button onClick={() => setAddStudentIsOpen(true)}>
              Agregar Alumno
            </button>
            <button onClick={() => setDeleteStudentIsOpen(true)}>
              Eliminar Estudiante
            </button>
          </div>
        </div>

        {/* Gestión de Clases*/}
        <div className="admin-card">
          {/* MODIFICAR LOS HANDLERS */}
          <h2>Gestión de Clases</h2>
          <div>
            <button onClick={() => setAddClassIsOpen(true)}>Crear Clase</button>
            <button onClick={() => setDeleteClassIsOpen(true)}>
              Eliminar Clase
            </button>
            <button onClick={() => setShowModifyClass(true)}>
              Modificar Clase
            </button>
            <button onClick={() => setAddStudentToClass(true)}>
              Inscribir alumno
            </button>
            <button onClick={() => setRemoveStudentClassIsOpen(true)}>
              Eliminar Alumno
            </button>
          </div>
        </div>

        {/* Reportes */}
        <div className="admin-card">
          <h2>Reportes</h2>
          {/* <button onClick={generateReports}>Generar Reportes</button>
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
                    </div> */}
          <div>
            {/* Botón para generar el reporte de actividad más popular */}
            <button onClick={() => setShowMostStudentsModal(true)}>
              Actividades con más estudiantes
            </button>
            {/* Botón para generar el reporte de actividad con más ingresos */}
            <button onClick={() => setShowMostClassesModal(true)}>
              Turno con más clases dictadas
            </button>

            {/* Botón para generar el reporte del turno con más clases */}
            <button onClick={() => setShowReportIncomeModal(true)}>
              Actividad con más ingresos
            </button>
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

        {showModifyTurn && (
          <ModifyTurnModal onClose={() => setShowModifyTurn(false)} />
        )}

        {addStudentIsOpen && (
          <AddStudentModal onClose={() => setAddStudentIsOpen(false)} />
        )}

        {addActivityIsOpen && (
          <AddActivityModal onClose={() => setAddActivityIsOpen(false)} />
        )}

        {showActivities && (
          <ShowActivitiesModal onClose={() => setShowActivities(false)} />
        )}

        {showModifyActivity && (
          <ModifyActivityModal onClose={() => setShowModifyActivity(false)} />
        )}

        {showModifyClass && (
          <ModifyClassModal onClose={() => setShowModifyClass(false)} />
        )}

        {addStudentToClass && (
          <AddStudentToClassModal onClose={() => setAddStudentToClass(false)} />
        )}

        {deletePersonIsOpen && (
          <DeletePersonModal
            onClose={() => setDeletePersonIsOpen(false)}
            personType="instructor"
          />
        )}

        {deleteStudentIsOpen && (
          <DeletePersonModal
            onClose={() => setDeleteStudentIsOpen(false)}
            personType="student"
          />
        )}

        {deleteTurnIsOpen && (
          <DeleteTurnModal onClose={() => setDeleteTurnIsOpen(false)} />
        )}

        {deleteClassIsOpen && (
          <DeleteClassModal onClose={() => setDeleteClassIsOpen(false)} />
        )}

        {removeStudentClassIsOpen && (
          <RemoveStudentClassModal
            onClose={() => setRemoveStudentClassIsOpen(false)}
          />
        )}
      </div>

      {showReportIncomeModal && (
        <ReportIncome onClose={() => setShowReportIncomeModal(false)} />
      )}

      {showMostClassesModal && (
        <MostClassesModal onClose={() => setShowMostClassesModal(false)} />
      )}

      {showMostStudentsModal && (
        <MostStudentsModal onClose={() => setShowMostStudentsModal(false)} />
      )}

      {addInstructorIsOpen && (
        <AddNewInstructor onClose={() => setAddInstructorIsOpen(false)} />
      )}

      {addClassIsOpen && (
        <AddClassModal onClose={() => setAddClassIsOpen(false)} />
      )}

      {addTrunIsOpen && (
        <AddTurnModal onClose={() => setAddTurnIsOpen(false)} />
      )}

      {showModifyTurn && (
        <ModifyTurnModal onClose={() => setShowModifyTurn(false)} />
      )}

      {addStudentIsOpen && (
        <AddStudentModal onClose={() => setAddStudentIsOpen(false)} />
      )}

      {addActivityIsOpen && (
        <AddActivityModal onClose={() => setAddActivityIsOpen(false)} />
      )}

      {showActivities && (
        <ShowActivitiesModal onClose={() => setShowActivities(false)} />
      )}

      {showModifyActivity && (
        <ModifyActivityModal onClose={() => setShowModifyActivity(false)} />
      )}

      {showModifyClass && (
        <ModifyClassModal onClose={() => setShowModifyClass(false)} />
      )}

      {addStudentToClass && (
        <AddStudentToClassModal onClose={() => setAddStudentToClass(false)} />
      )}

      {deletePersonIsOpen && (
        <DeletePersonModal
          onClose={() => setDeletePersonIsOpen(false)}
          personType="instructor"
        />
      )}

      {deleteStudentIsOpen && (
        <DeletePersonModal
          onClose={() => setDeleteStudentIsOpen(false)}
          personType="student"
        />
      )}

      {deleteTurnIsOpen && (
        <DeleteTurnModal onClose={() => setDeleteTurnIsOpen(false)} />
      )}

      {deleteClassIsOpen && (
        <DeleteClassModal onClose={() => setDeleteClassIsOpen(false)} />
      )}

      {removeStudentClassIsOpen && (
        <RemoveStudentClassModal
          onClose={() => setRemoveStudentClassIsOpen(false)}
        />
      )}

      {showModifyInstructor && (
        <ModifyInstructorModal onClose={() => setShowModifyInstructor(false)} />
      )}
    </div>
  );
};

export default Admin;
