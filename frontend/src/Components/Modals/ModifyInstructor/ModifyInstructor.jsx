import React, { useState, useEffect } from "react";
import ApiService from "../../../Services/apiServices";
import styles from "./ModifyInstructor.module.css";

const ModifyInstructorModal = ({ onClose }) => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [formData, setFormData] = useState({ first_name: "", last_name: "" });
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await ApiService.get("instructors", token);
        setInstructors(response.data);
      } catch (error) {
        console.error("Error fetching instructors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  const handleSelectInstructor = (instructor) => {
    setSelectedInstructor(instructor);
    setFormData({
      first_name: instructor.first_name,
      last_name: instructor.last_name,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!selectedInstructor) return;

    try {
      const response = await ApiService.patch(
        `instructor/${selectedInstructor.instructor_id}/modify-instructor`,
        {...formData, name: formData.first_name },
        token
      );

      if (response.code === 200) {
        setInstructors((prev) =>
          prev.map((inst) =>
            inst.instructor_id === selectedInstructor.instructor_id
              ? { ...inst, ...formData }
              : inst
          )
        );
        setSelectedInstructor(null);
      }
    } catch (error) {
      console.error("Error updating instructor:", error);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>Modificar Instructor</h2>
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <>
            {selectedInstructor ? (
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
                    onClick={() => setSelectedInstructor(null)}
                    className={styles.cancelButton}
                  >
                    Cancelar
                  </button>
                  <button onClick={handleSave} className={styles.submitButton}>
                    Guardar
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.instructorsList}>
                {instructors.map((instructor) => (
                  <InstructorCard
                    key={instructor.instructor_id}
                    instructor={instructor}
                    handleSelectInstructor={handleSelectInstructor}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

function InstructorCard({ instructor, handleSelectInstructor }) {
  return (
    <div
      className={styles.instructorItem}
      onClick={() => handleSelectInstructor(instructor)}
      style={{
        border: "1px solid #ccc",
        padding: "10px",
        margin: "5px",
        cursor: "pointer",
      }}
    >
      {instructor.first_name} {instructor.last_name}
    </div>
  );
}

export default ModifyInstructorModal;
