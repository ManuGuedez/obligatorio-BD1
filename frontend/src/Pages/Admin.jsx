import React, { useEffect, useState } from 'react';
import './Admin.css';

const Admin = () => {
    const [instructors, setInstructors] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [activities, setActivities] = useState([]);
    const [students, setStudents] = useState([]);
    const [reports, setReports] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false); // Controla la visibilidad del modal
    const [newInstructor, setNewInstructor] = useState({ name: '', email: '' }); // Almacena los datos del nuevo instructor

    const handleAddInstructor = () => {
        setIsModalOpen(true); // Abre el modal al hacer clic en "Agregar Instructor"
    };

    const handleSaveInstructor = () => {
        setInstructors([...instructors, newInstructor]); // Agrega el nuevo instructor a la lista
        setNewInstructor({ name: '', email: '' }); // Reinicia el formulario
        setIsModalOpen(false); // Cierra el modal
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewInstructor((prev) => ({ ...prev, [name]: value })); // Actualiza los datos del instructor
    };

    const handleCloseModal = () => {
        setIsModalOpen(false); // Cierra el modal sin guardar
        setNewInstructor({ name: '', email: '' }); // Reinicia el formulario si se cierra el modal
    };

    const handleRemoveInstructor = (id) => { /* Lógica para eliminar instructor */

    };


    useEffect(() => {
        fetchInstructors(); 
    }, []);


    const fetchInstructors = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/instructors');
            const data = await response.json();
            setInstructors(data);
        }
        catch (error) {
            console.error('Error al obtener los instructores:', error);
        }
    }


    // const handleEditInstructor = (id) => { /* Lógica para editar instructor */
    //     const response = await fetch(`http://localhost:5000/api/instructors/${id}`, {

    //     }


    // };



    const handleAddSchedule = () => { /* Lógica para agregar turno */ };
    const handleAssignInstructorToSchedule = () => { /* Lógica para asignar instructor a turno */ };
    const handleAddActivity = () => { /* Lógica para agregar actividad */ };
    const handleRemoveActivity = (id) => { /* Lógica para eliminar actividad */ };
    const handleAddStudent = () => { /* Lógica para agregar alumno */ };
    const handleRemoveStudent = (id) => { /* Lógica para eliminar alumno */ };
    const generateReports = () => { /* Lógica para generar reportes */ };

    return (
        <div className="admin-dashboard">
            <h1>Panel de Administración</h1>
            <div className="admin-card-container">
                {/* Gestión de Instructores */}
                <div className="admin-card">
                    <h2>Gestión de Instructores</h2>
                    <button onClick={handleAddInstructor}>Agregar Instructor</button>
                    <button onClick={() => handleEditInstructor(1)}>Modificar Instructor</button>
                    <button onClick={() => handleRemoveInstructor(1)}>Eliminar Instructor</button>
                </div>

                {/* Gestión de Turnos y Horarios */}
                <div className="admin-card">
                    <h2>Gestión de Turnos y Horarios</h2>
                    <button onClick={handleAddSchedule}>Crear Turno</button>
                    <button onClick={handleAssignInstructorToSchedule}>Asignar Instructor a Turno</button>
                </div>

                {/* Gestión de Actividades */}
                <div className="admin-card">
                    <h2>Gestión de Actividades</h2>
                    <button onClick={handleAddActivity}>Agregar Actividad</button>
                    <button onClick={() => handleRemoveActivity(1)}>Eliminar Actividad</button>
                </div>

                {/* Gestión de Alumnos */}
                <div className="admin-card">
                    <h2>Gestión de Alumnos</h2>
                    <button onClick={handleAddStudent}>Agregar Alumno</button>
                    <button onClick={() => handleRemoveStudent(1)}>Eliminar Alumno</button>
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

            {/* Modal para agregar instructor */}
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Nuevo Instructor</h2>
                        <div className="form-group">
                            <label>Nombre:</label>
                            <input
                                type="text"
                                name="name"
                                value={newInstructor.name}
                                onChange={handleChange}
                                placeholder="Ingrese el nombre"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={newInstructor.email}
                                onChange={handleChange}
                                placeholder="Ingrese el email"
                                required
                            />
                        </div>
                        <div className="modal-buttons">
                            <button onClick={handleSaveInstructor}>Guardar</button>
                            <button onClick={handleCloseModal}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
