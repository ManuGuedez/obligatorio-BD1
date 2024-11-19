import React, { useEffect, useState } from 'react';
import './Admin.css';
import AddInstructorModal from './Modals/AddInstructorModal';
import RemoveInstructorModal from './Modals/RemoveInstructorModal';
import AddClassModal from './Modals/AddClassModal';


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

    // Modal para eliminar un instructor
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const handleCloseRemoveModal = () => setShowRemoveModal(false);
    const handleRemoveInstructor = () => {
        setShowRemoveModal(true)
    };

    // Modal para crear una clase 
    const [showAddClass, setShowAddClass] = useState(false);
    const handleCloseAddClassModal = () => setShowAddClass(false);
    const handleAddClass = () => {
        setShowAddClass(true);
    };

    const handleAddSchedule = () => { /* Lógica para agregar turno */ };
    const handleAssignInstructorToSchedule = () => { /* Lógica para asignar instructor a turno */ };
    const handleAddActivity = () => { /* Lógica para agregar actividad */ };
    const handleViewActivities = () => { /* Lógica para eliminar actividad */ };
    const handleAddStudent = () => { /* Lógica para agregar alumno */ };
    const handleRemoveStudent = () => { /* Lógica para eliminar alumno */ };
    const handleModifyTurn = () => { /* Lógica para modificar clase */ };
    const generateReports = () => { /* Lógica para generar reportes */ };

    const handleModifyActivity = () => { /* Lógica para modificar actividad */ };
    const handleEditInstructor = () => { /* Lógica para editar instructor */ };

    return (
        <div className="admin-dashboard">
            <h1>Panel de Administración</h1>
            <div className="admin-card-container">
                {/* Gestión de Instructores */}
                <div className="admin-card">
                    <h2>Gestión de Instructores</h2>
                    <button onClick={handleAddInstructor}>Agregar Instructor</button>
                    <button onClick={handleEditInstructor}>Modificar Instructor</button>
                </div>

                {/* Gestión de Turnos y Horarios */}
                <div className="admin-card">
                    <h2>Gestión de Turnos y Horarios</h2>
                    <button onClick={handleAddSchedule}>Crear Turno</button>
                    <button onClick={handleModifyTurn}>Modificar Turno</button>
                </div>

                {/* Gestión de Actividades */}
                <div className="admin-card">
                    <h2>Gestión de Actividades</h2>
                    <button onClick={handleAddActivity}>Agregar Actividad</button>
                    <button onClick={handleViewActivities}>Ver Actividades</button>
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
                    <button onClick={handleAssignInstructorToSchedule}>Modificar Clase</button>
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

            {/* <RemoveInstructorModal
                show={showRemoveModal}
                handleClose={handleCloseRemoveModal}
            /> */}

            <AddClassModal 
                show={showAddClass}
                handleClose={handleCloseAddClassModal}
            />

        </div>
    );
};

export default Admin;
