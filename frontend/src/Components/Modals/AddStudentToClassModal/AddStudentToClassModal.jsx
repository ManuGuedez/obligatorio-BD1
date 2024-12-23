import React, { useState, useEffect } from "react";
import ApiService from './../../../Services/apiServices';
import classes from  "./AddStudentToClassModal.module.css";

const AddStudentToClassModal = ({ onClose }) => {
  const [studentId, setStudentId] = useState("");
  const [allClasses, setAllClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [message, setMessage] = useState({ text: "", isError: false });
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchClasses = async () => {
      const classesResponse = await ApiService.get("classes", token);
      if (classesResponse.code === 200) {
        const classesDict = classesResponse.data;
        let fetchedClasses = [];
        for (const id in classesDict) {
          const currentClass = { ...classesDict[id], class_id: id };
          fetchedClasses.push(currentClass);
        }
        setAllClasses(fetchedClasses);
      }
    };
    fetchClasses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await ApiService.post(
        `classes/${selectedClass}/enroll-student`,
        { student_id: parseInt(studentId) },
        "application/json",
        token
      );


      if (response.code === 200) {
        setMessage({ text: "Estudiante inscrito exitosamente", isError: false });
        setTimeout(() => {
          onClose();
          setStudentId("");
          setSelectedClass("");
          setMessage({ text: "", isError: false });
        }, 2000);
      } else {
        setMessage({ text: response.message || "Error al inscribir estudiante", isError: true });
      }
    } catch (error) {
      setMessage({ text: error.message || "Error al procesar la solicitud", isError: true });
    }
  };

  return (
    <div className={classes.modalOverlay} onClick={onClose}>
      <div className={classes.modalContainer} onClick={(e) => e.stopPropagation()}>
        <div className={classes.modalHeader}>
          <h2>Inscribir alumno</h2>
        </div>

        {message.text && (
          <div className={`${classes.message} ${message.isError ? classes.error : classes.success}`}>
            {message.text}
          </div>
        )}

        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className={classes.formGroup}>
              <label htmlFor="studentId">ID estudiante:</label>
              <input
                type="number"
                id="studentId"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
              />
            </div>

            <div className={classes.formGroup}>
              <label htmlFor="classSelect">Select Class:</label>
              <select
                id="classSelect"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                required
              >
                <option value="">Select a class</option>
                {allClasses.map((classItem) => (
                  <option key={classItem.class_id} value={classItem.class_id}>
                    {`${classItem.description} (${classItem.start_time} - ${classItem.end_time}) - ${classItem.instructor_first_name} ${classItem.instructor_last_name} `}
                  </option>
                ))}
              </select>
            </div>

            <div className={classes.modalFooter}>
              <button type="button" className={classes.cancelButton} onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className={classes.submitButton}>Agregar Alumno</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStudentToClassModal;
