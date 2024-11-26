import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ServiceInstructor from "../Services/instructorServices";
import "./Lista.css";

const Lista = ( {classId}) => {
  // const { classId } = useParams(); // Obtener el ID de la clase desde la URL
  const [students, setStudents] = useState([]);
  const token = localStorage.getItem("token"); // Recuperar token del localStorage
  const [error, setError] = useState("");
  const [attendance, setAttendance] = useState([]); // Arreglo para guardar los IDs de los estudiantes que han marcado asistencia

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await ServiceInstructor.getClassesStudents(
          token,
          classId
        );
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

  const handleAttendanceChange = (studentId) => {
    // Alternar la asistencia del estudiante
    setAttendance((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId) // Eliminar si ya está presente
        : [...prev, studentId] // Agregar si no está presente
    );
  };

  const handleSaveAttendance = async () => {
    try {        
      const response = await ServiceInstructor.passAttendanceList(
        token,
        classId,
        attendance
      );
      if (response.code === 200) {
        console.log("Lista de asistencia guardada exitosamente:", response.msg);
        alert("Asistencia guardada exitosamente.");
      } else {
        console.error(
          "Error al guardar la lista de asistencia:",
          response.error
        );
        alert("Error al guardar la lista de asistencia: " + response.error);
      }
    } catch (error) {
      console.error(
        "Ocurrió un error al guardar la lista de asistencia:",
        error
      );
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
            <tr key={student.student_id}>
              <td>{student.first_name}</td>
              <td>{student.last_name}</td>
              <td>
                <input
                  type="checkbox"
                  checked={attendance.includes(student.student_id)}
                  onChange={() =>
                    handleAttendanceChange(student.student_id)
                  }
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
