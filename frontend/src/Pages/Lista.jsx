import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ServiceInstructor from "../Services/instructorServices";
import "./Lista.css";

const Lista = () => {
    const { classId } = useParams(); // Obtener el ID de la clase desde la URL
    const [students, setStudents] = useState([]);
    const token = localStorage.getItem("token"); // Recuperar token del localStorage
    const [error, setError] = useState("");
    const [attendance, setAttendance] = useState({}); // Objeto para guardar el estado de las checkboxes

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await ServiceInstructor.getClassesStudents(token, classId);
                if (response.code === 200) {
                    setStudents(response.data); // Asigna los estudiantes obtenidos al estado
                    // Inicializar el estado de asistencia
                    const initialAttendance = response.data.reduce((acc, student) => {
                        acc[student.person_id] = false; // Todos empiezan como no asistidos
                        return acc;
                    }, {});
                    setAttendance(initialAttendance);
                } else {
                    setError(response.data?.error || "Error al obtener los estudiantes.");
                }
            } catch (error) {
                setError("Ocurrió un error al obtener los estudiantes.");
                console.error(error);
            }
        };

        fetchStudents();
    }, [classId, token]);

    const handleAttendanceChange = (personId) => {
        // Alternar el estado de asistencia para el ID específico
        setAttendance((prevAttendance) => ({
            ...prevAttendance,
            [personId]: !prevAttendance[personId],
        }));
    };

    const handleSaveAttendance = async () => {
        const attendedStudents = Object.keys(attendance).filter(
            (personId) => attendance[personId]
        );

        try {
            const response = await ServiceInstructor.passAttendanceList(token, classId, attendedStudents);
            if (response.code === 200) {
                console.log("Lista de asistencia guardada exitosamente:", response.msg);
                alert("Asistencia guardada exitosamente.");
            } else {
                console.error("Error al guardar la lista de asistencia:", response.error);
                alert("Error al guardar la lista de asistencia: " + response.error);
            }
        } catch (error) {
            console.error("Ocurrió un error al guardar la lista de asistencia:", error);
            alert("Ocurrió un error al guardar la lista de asistencia.");
        }
    };

    return (
        <div className="student-list-container">
            <div className="list-header">
                <h1>Lista de Estudiantes</h1>
                <button className="save-button" onClick={handleSaveAttendance}>
                    Guardar Lista
                </button>
            </div>
            {error && <p className="error">{error}</p>}
            <table className="student-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Asistencia</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                        <tr key={student.person_id}> {/* Usar student.person_id como key */}
                            <td>{student.first_name}</td>
                            <td>{student.last_name}</td>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={attendance[student.person_id] || false}
                                    onChange={() => handleAttendanceChange(student.person_id)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Lista;
