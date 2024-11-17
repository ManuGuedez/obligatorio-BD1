// Admin.js
import React, { useState } from 'react';
import './Admin.css';

const Admin = () => {
    const [instructors, setInstructors] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [activities, setActivities] = useState([]);
    const [students, setStudents] = useState([]);
    const [reports, setReports] = useState({});

    return (
        <div className="admin-dashboard">
            <h1>Panel de Administración</h1>
            <div className="admin-card-container">
                {/* Gestión de Instructores */}
                <div>
                    <div className="admin-card">
                        <h2>Gestión de Instructores</h2>
                        <button>Agregar Instructor</button>
                        <button>Modificar Instructor</button>
                        <button>Eliminar Instructor</button>
                    </div>
                    <div className="admin-subcard">
                        <h3>Instructores</h3>
                        {/* Listado de instructores */}
                    </div>
                </div>

                {/* Gestión de Turnos y Horarios */}
                <div>
                    <div className="admin-card">
                        <h2>Gestión de Turnos y Horarios</h2>
                        <button>Crear Turno</button>
                        <button>Asignar Instructor a Turno</button>
                    </div>
                    <div className="admin-subcard">
                        <h3>Turnos y Horarios</h3>
                        {/* Listado de turnos y horarios */}
                    </div>
                </div>

                {/* Gestión de Actividades */}
                <div>
                    <div className="admin-card">
                        <h2>Gestión de Actividades</h2>
                        <button>Agregar Actividad</button>
                        <button>Eliminar Actividad</button>
                    </div>
                    <div className="admin-subcard">
                        <h3>Actividades</h3>
                        {/* Listado de actividades */}
                    </div>
                </div>

                {/* Gestión de Alumnos */}
                <div>
                    <div className="admin-card">
                        <h2>Gestión de Alumnos</h2>
                        <button>Agregar Alumno</button>
                        <button>Eliminar Alumno</button>
                    </div>
                    <div className="admin-subcard">
                        <h3>Alumnos</h3>
                        {/* Listado de alumnos */}
                    </div>
                </div>

                {/* Reportes */}
                <div>
                    <div className="admin-card">
                        <h2>Reportes</h2>
                        <button>Generar Reportes</button>
                    </div>
                    <div className="admin-subcard">
                        <h3>Reportes</h3>
                        {/* Mostrar reportes generados */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;
