import React, { useState, useEffect } from "react";
import ApiService from "../../../Services/apiServices";
import styles from "./ModifyStudent.module.css";

const ModifyStudentModal = ({ onClose }) => {
  const [student, setstudent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({ first_name: "", last_name: "" });
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchstudent = async () => {
      try {
        const response = await ApiService.get("students", token);
        setstudent(response.data);
      } catch (error) {
        console.error("Error fetching student:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchstudent();
  }, []);

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setFormData({
      first_name: student.first_name,
      last_name: student.last_name,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!selectedStudent) return;

    try {
      const response = await ApiService.patch(
        `student/${selectedStudent.student_id}/modify-student`,
        { ...formData, name: formData.first_name },
        token
      );

      if (response.code === 200) {
        setstudent((prev) =>
          prev.map((inst) =>
            inst.student_id === selectedStudent.student_id
              ? { ...inst, ...formData }
              : inst
          )
        );
        setSelectedStudent(null);
      }
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>Modificar Student</h2>
        <div
          style={{
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          {loading ? (
            <p>Cargando...</p>
          ) : (
            <>
              {selectedStudent ? (
                <div className={styles.editForm}>
                  <label>
                    Nombre:
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                    />
                  </label>
                  <label>
                    Apellido:
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                    />
                  </label>
                  <div className={styles.buttonGroup}>
                    <button
                      onClick={() => setSelectedStudent(null)}
                      className={styles.cancelButton}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSave}
                      className={styles.submitButton}
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles.studentList}>
                  {student.map((student) => (
                    <StudentCard
                      key={student.student_id}
                      student={student}
                      handleSelectStudent={handleSelectStudent}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

function StudentCard({ student, handleSelectStudent }) {
  return (
    <div
      className={styles.studentItem}
      onClick={() => handleSelectStudent(student)}
      style={{
        border: "1px solid #ccc",
        padding: "10px",
        margin: "5px",
        cursor: "pointer",
      }}
    >
      {student.first_name} {student.last_name}
    </div>
  );
}

export default ModifyStudentModal;
