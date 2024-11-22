import React, { useState, useEffect } from "react";
import ApiService from './../../../Services/apiServices';
import classes from  "./AddStudentToClassModal.module.css";

const AddStudentToClassModal = ({ onClose }) => {
  const [studentId, setStudentId] = useState("");
  const [allClasses, setAllClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchClasses = async () => {
      const classesResponse = await ApiService.get("classes", token);
      console.log("ACA!! ", classesResponse);
      if (classesResponse.code === 200) {
        const classesDict = classesResponse.data;
        let fetchedClasses = [];
        for (const id in classesDict) {
          const currentClass = { ...classesDict[id], class_id: id };
          console.log("current-class:", currentClass);
          fetchedClasses.push(currentClass);
        }
        console.log("classes: ", fetchClasses);
        setAllClasses(fetchedClasses);
      }
    };
    fetchClasses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await ApiService.post(
      `classes/${selectedClass}/enroll-student`,
      { student_id: parseInt(studentId) },
      "application/json",
      token
    );

    if (response.code === 200) {
      onClose();
      setStudentId("");
      setSelectedClass("");
    }
  };

  return (
    <div className={classes.modalOverlay} onClick={onClose}>
      <div className={classes.modalContainer} onClick={(e) => e.stopPropagation()}>
        <div className={classes.modalHeader}>
          <h2>Add Student to Class</h2>
          <button className={classes.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className={classes.formGroup}>
              <label htmlFor="studentId">Student ID:</label>
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
                {allClasses.map((classItem ) => (
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
