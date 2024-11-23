import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ServiceInstructor from "../Services/instructorServices";
import "./Lista.css";

const Lista = () => {
    const { classId } = useParams(); // Obtener el ID de la clase desde la URL
    const [students, setStudents] = useState([]);
    const token = localStorage.getItem("token"); // Recuperar token del localStorage
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await ServiceInstructor.getClassesStudents(token, classId);
                if (response.code === 200) {
                    setStudents(response.data); // Asigna los estudiantes obtenidos al estado
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

    return (
        <div className="student-list-container">
            <h1>Lista de Estudiantes</h1>
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
                    {students.map((student, index) => (
                        <tr key={student.person_id || index}>
                            <td>{student.first_name}</td>
                            <td>{student.last_name}</td>
                            <td><input type="checkbox" /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Lista;
