import React, { useState } from 'react';
import './Admin.css';
import AddInstructorModal from './Modals/AddInstructorModal';
import AddClassModal from './Modals/AddClassModal';
import ReportModal from './Modals/ReportModal';

const Admin = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showAddClass, setShowAddClass] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);

    const handleCloseAddModal = () => setShowAddModal(false);
    const handleAddInstructor = () => setShowAddModal(true);

    const handleCloseAddClassModal = () => setShowAddClass(false);
    const handleAddClass = () => setShowAddClass(true);

    const handleGenerateReports = () => setShowReportModal(true);
    const handleCloseReportModal = () => setShowReportModal(false);

    const handleAddSchedule = () => { /* Lógica para agregar turno */ };
    const handleAssignInstructorToSchedule = () => { /* Lógica para asignar instructor a turno */ };
    const handleAddActivity = () => { /* Lógica para agregar actividad */ };
    const handleViewActivities = () => { /* Lógica para eliminar actividad */ };
    const handleAddStudent = () => { /* Lógica para agregar alumno */ };
    const handleRemoveStudent = () => { /* Lógica para eliminar alumno */ };
    const handleModifyTurn = () => { /* Lógica para modificar clase */ };
    const handleModifyActivity = () => { /* Lógica para modificar actividad */ };
    const handleEditInstructor = () => { /* Lógica para editar instructor */ };

    return (
        <div className="admin-dashboard">
            <h1 className="admin-title">Panel de Administración</h1>
            <div className="admin-card-container">
                {/* Gestión de Instructores */}
                <div className="admin-card">
                    <h2>Instructores</h2>
                    <button onClick={handleAddInstructor}>Agregar Instructor</button>
                    <button onClick={handleEditInstructor}>Modificar Instructor</button>
                </div>

                {/* Gestión de Turnos y Horarios */}
                <div className="admin-card">
                    <h2>Turnos y Horarios</h2>
                    <button onClick={handleAddSchedule}>Crear Turno</button>
                    <button onClick={handleModifyTurn}>Modificar Turno</button>
                </div>

                {/* Gestión de Actividades */}
                <div className="admin-card">
                    <h2>Actividades</h2>
                    <button onClick={handleAddActivity}>Agregar Actividad</button>
                    <button onClick={handleViewActivities}>Ver Actividades</button>
                    <button onClick={handleModifyActivity}>Modificar Actividad</button>
                </div>

                {/* Gestión de Alumnos */}
                <div className="admin-card">
                    <h2>Alumnos</h2>
                    <button onClick={handleAddStudent}>Agregar Alumno</button>
                </div>

                {/* Gestión de Clases */}
                <div className="admin-card">
                    <h2>Clases</h2>
                    <button onClick={handleAddClass}>Crear Clase</button>
                    <button onClick={handleAssignInstructorToSchedule}>Modificar Clase</button>
                    <button onClick={handleModifyTurn}>Añadir alumno</button>
                    <button onClick={handleRemoveStudent}>Eliminar Alumno</button>
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

            <ReportModal
                show={showReportModal}
                handleClose={handleCloseReportModal}
            />

            {/* Botón de Generar Reportes */}
            <button className="generate-reports-button" onClick={handleGenerateReports}>
                Generar Reportes
            </button>
        </div>
    );
};

export default Admin;
