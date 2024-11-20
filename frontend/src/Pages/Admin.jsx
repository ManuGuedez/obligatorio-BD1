import React, { useEffect, useState } from 'react';
import './Admin.css';
import AddInstructorModal from './Modals/AddInstructorModal';
import RemoveInstructorModal from './Modals/RemoveInstructorModal';
import AddClassModal from './Modals/AddClassModal';
import AddTurnModal from './Modals/AddTurnModal';
import ModifyTurnModal from './Modals/ModifyTurnModal';
import AddStudentModal from './Modals/AddStudentModal';
import AddActivityModal from './Modals/AddActivityModal';
import ShowActivitiesModal from './Modals/ShowActivitiesModal';
import ModifyActivityModal from './Modals/ModifyActivityModal';
import ModifyClassModal from './Modals/ModifyClassModal';

const Admin = () => {
    const [instructors, setInstructors] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [activities, setActivities] = useState([]);
    const [students, setStudents] = useState([]);
    const [reports, setReports] = useState({});

    // Modal para añadir instructor
    const [showAddModal, setShowAddModal] = useState(false);
    const handleCloseAddModal = () => setShowAddModal(false);
    const handleAddInstructor = () => {
        setShowAddModal(true);
    };

    // // Modal para eliminar un instructor
    // const [showRemoveModal, setShowRemoveModal] = useState(false);
    // const handleCloseRemoveModal = () => setShowRemoveModal(false);
    // const handleRemoveInstructor = () => {
    //     setShowRemoveModal(true)
    // };

    // Modal para crear una clase 
    const [showAddClass, setShowAddClass] = useState(false);
    const handleCloseAddClassModal = () => setShowAddClass(false);
    const handleAddClass = () => {
        setShowAddClass(true);
    };

    // Modal para crear un turno  
    const [showAddTurn, setShowAddTurn] = useState(false);
    const handleCloseAddTurnModal = () => setShowAddTurn(false);
    const handleAddTurn = () => {
        setShowAddTurn(true);
    };

    // Modal para modificar un turno
    const [showModifyTurn, setShowModifyTurn] = useState(false);
    const handleCloseModifyTurnModal = () => setShowModifyTurn(false);
    const handleModifyTurn = () => {
        setShowModifyTurn(true);
    };

    // Modal para crear un estudiante
    const [showAddStudent, setShowAddStudent] = useState(false);
    const handleCloseAddStudentModal = () => setShowAddStudent(false);
    const handleAddStudent = () => {
        setShowAddStudent(true);
    };

    // Modal para crear una actividad
    const [showAddActivity, setShowAddActivity] = useState(false);
    const handleCloseAddActivityModal = () => setShowAddActivity(false);
    const handleAddActivity = () => {
        setShowAddActivity(true);
    };

    // Modal para mostrar actividades
    const [showShowActivities, setShowShowActivities] = useState(false);
    const handleCloseShowActivitiesModal = () => setShowShowActivities(false);
    const handleShowActivities = () => {
        setShowShowActivities(true);
    };

    // Modal para modificar una actividad
    const [showModifyActivity, setShowModifyActivity] = useState(false);
    const handleCloseModifyActivityModal = () => setShowModifyActivity(false);
    const handleModifyActivity = () => {
        setShowModifyActivity(true);
    };

    const [showModifyClass, setShowModifyClass] = useState(false);
    const handleCloseModifyClassModal = () => setShowModifyClass(false);
    const handleModifyClass = () => {
        setShowModifyClass(true);
    };


    const handleAddSchedule = () => { /* Lógica para agregar turno */ };
    const handleAssignInstructorToSchedule = () => { /* Lógica para asignar instructor a turno */ };
    const handleRemoveStudent = () => { /* Lógica para eliminar alumno */ };
    const generateReports = () => { /* Lógica para generar reportes */ };
    const handleEditInstructor = () => { /* Lógica para editar instructor */ };

    return (
        <div className="admin-dashboard">
            <h1>Panel de Administración</h1>
            <div className="admin-card-container">
                {/* Gestión de Instructores */}
                <div className="admin-card">
                    <h2>Gestión de Instructores</h2>
                    <button onClick={handleAddInstructor}>Agregar Instructor</button>
                    <button onClick={handleEditInstructor}>Modificar Instructor</button> {/* EN VEMOS */}
                </div>

                {/* Gestión de Turnos y Horarios */}
                <div className="admin-card">
                    <h2>Gestión de Turnos y Horarios</h2>
                    <button onClick={handleAddTurn}>Crear Turno</button>
                    <button onClick={handleModifyTurn}>Modificar Turno</button>
                </div>

                {/* Gestión de Actividades */}
                <div className="admin-card">
                    <h2>Gestión de Actividades</h2>
                    <button onClick={handleAddActivity}>Agregar Actividad</button>
                    <button onClick={handleShowActivities}>Ver Actividades</button>
                    <button onClick={handleModifyActivity}>Modificar Actividad</button>
                </div>

                {/* Gestión de Alumnos */}
                <div className="admin-card">
                    <h2>Gestión de Alumnos</h2>
                    <button onClick={handleAddStudent}>Agregar Alumno</button>
                </div>

                {/* Gestión de Clases*/}
                <div className="admin-card">

                    {/* MODIFICAR LOS HANDLERS */}
                    <h2>Gestión de Clases</h2>
                    <button onClick={handleAddClass}>Crear Clase</button>
                    <button onClick={handleModifyClass}>Modificar Clase</button>
                    <button onClick={handleModifyTurn}>Añadir alumno</button>
                    <button onClick={handleRemoveStudent}>Eliminar Alumno</button>
                </div>

                {/* Reportes */}
                <div className="admin-card">
                    <h2>Reportes</h2>
                    <button onClick={generateReports}>Generar Reportes</button>
                    <div className="report-content">
                        {reports.mostPopularActivity && <p>Actividad más popular: {reports.mostPopularActivity}</p>}
                        {reports.highestIncomeActivity && <p>Actividad con más ingresos: {reports.highestIncomeActivity}</p>}
                        {reports.mostClassesSchedule && <p>Turno con más clases dictadas: {reports.mostClassesSchedule}</p>}
                    </div>
                </div>
            </div>

            <AddInstructorModal
                show={showAddModal}
                handleClose={handleCloseAddModal}
            />

            <AddClassModal
                show={showAddClass}
                handleClose={handleCloseAddClassModal}
            />


            <AddTurnModal
                isOpen={showAddTurn}
                onClose={() => handleCloseAddTurnModal(false)}
            />

            <ModifyTurnModal
                isOpen={showModifyTurn}
                onClose={() => handleCloseModifyTurnModal(false)}
            />

            <AddStudentModal
                isOpen={showAddStudent}
                onClose={() => handleCloseAddStudentModal(false)}
            />

            <AddActivityModal
                isOpen={showAddActivity}
                onClose={() => handleCloseAddActivityModal(false)}
            />

            <ShowActivitiesModal
                isOpen={showShowActivities}
                onClose={() => handleCloseShowActivitiesModal(false)}
            />
            <ModifyActivityModal
                isOpen={showModifyActivity}
                onClose={() => handleCloseModifyActivityModal(false)}
            />

            <ModifyClassModal
                isOpen={showModifyClass}
                onClose={() => handleCloseModifyClassModal(false)}
            />


        </div>
    );
};

export default Admin;
