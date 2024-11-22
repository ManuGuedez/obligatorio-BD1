import React, { useEffect, useState } from "react";
import ApiService from "../../../Services/apiServices";
import classes from "./ModifyClassModal.module.css";
import { ClipLoader } from "react-spinners";

const ModifyClassModal = ({ onClose }) => {
  const [allClasses, setAllClasses] = useState([]);
  const [editingClass, setEditingClass] = useState(null);
  const [newInstructor, setNewInstructor] = useState("");
  const [newTurn, setNewTurn] = useState("");
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [turns, setTurns] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const classesResponse = await ApiService.get("classes", token);
        const instructorsResponse = await ApiService.get("instructors", token);
        const turnsResponse = await ApiService.get("turns", token);
        setLoading(false);
        if (classesResponse.code === 200) {
          const classesDict = classesResponse.data;
          let fetchedClasses = [];
          for (const id in classesDict) {
            const currentClass = { ...classesDict[id], class_id: id };
            fetchedClasses.push(currentClass);
          }
          setAllClasses(fetchedClasses);
        }

        if (instructorsResponse.code === 200) {
          console.log(instructorsResponse.data);
          setInstructors(instructorsResponse.data);
        }

        if (turnsResponse.code === 200) {
          setTurns(turnsResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (classToEdit) => {
    setEditingClass(classToEdit);
    setNewInstructor(classToEdit.instructor_ci || "");
    setNewTurn(classToEdit.turn_id || "");
  };

  const handleSaveChanges = async () => {
    try {
      if (!editingClass || !editingClass.class_id) {
        console.log("Current editing class:", editingClass);
        return;
      }

      const updatedFields = {};
      if (newInstructor) updatedFields.instructor_id = parseInt(newInstructor);

      if (newTurn) updatedFields.turn_id = newTurn;

      const response = await ApiService.patch(
        `classes/${editingClass.class_id}/modify-class`,
        updatedFields,
        token
      );

      if (response.code === 200) {
        const updatedClasses = { ...classes };
        updatedClasses[editingClass.class_id] = {
          ...classes[editingClass.class_id],
          ...updatedFields,
        };
        setAllClasses(updatedClasses);
        setEditingClass(null);
      }
    } catch (error) {
      console.log("Error updating class:", error);
    }
  };

  return (
    <div className={classes.modalOverlay} onClick={onClose}>
      <div
        className={classes.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={classes.modalHeader}>
          <h2>Modificar Clases</h2>
        </div>
        <div className={classes.modalContent}>
          <div className={classes.mainContent}>
            {loading && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100px",
                }}
              >
                <ClipLoader color="#3498db" loading={true} size={30} />
              </div>
            )}
            {editingClass ? (
              <div className={classes.editForm}>
                <h3>Editar Clase</h3>
                <div>
                  <label>Seleccione un instructor:</label>
                  <select
                    value={newInstructor}
                    onChange={(e) => setNewInstructor(e.target.value)}
                  >
                    <option value="">
                      Actual: {editingClass.instructor_first_name}{" "}
                      {editingClass.instructor_last_name}
                    </option>
                    {instructors?.map((instructor) => {
                      if (
                        instructor.first_name !==
                          editingClass.instructor_first_name &&
                        instructor.last_name !==
                          editingClass.instructor_last_name
                      ) {
                        return (
                          <option
                            key={instructor.instructor_id}
                            value={instructor.instructor_id}
                          >
                            {`${instructor.first_name} ${instructor.last_name}`}
                          </option>
                        );
                      }
                    })}
                  </select>
                </div>
                <div>
                  <label>Turno:</label>
                  <select
                    value={newTurn}
                    onChange={(e) => setNewTurn(e.target.value)}
                  >
                    <option value="">Seleccione un turno</option>
                    {turns?.map((turn) => (
                      <option key={turn.turn_id} value={turn.turn_id}>
                        {`${turn.start_time} - ${turn.end_time}`}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className={classes.modalFooter}>
                    <button
                      onClick={() => setEditingClass(null)}
                      className={classes.cancelButton}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSaveChanges}
                      className={classes.submitButton}
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className={classes.classesList}>
                  {allClasses.map((classItem, index) => {
                    return (
                      <ClassItem
                        key={index}
                        classItem={classItem}
                        handleEdit={handleEdit}
                      />
                    );
                  })}
                </div>
                <div className="modal-footer">
                  <button className="cancel-button" onClick={onClose}>
                    Cerrar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ClassItem = ({ classItem, handleEdit }) => {
  return (
    <div className={classes.classItem}>
      <div>
        <div className="categorias">
          <strong>ID:</strong> {classItem.class_id}
        </div>
        <div className="categorias">
          <strong>Clase:</strong> {classItem.description}
        </div>
        <div className="categorias">
          <strong>Instructor:</strong>{" "}
          {`${classItem.instructor_first_name} ${classItem.instructor_last_name}`}
        </div>
        <div className="categorias">
          <strong>Turno:</strong>{" "}
          {`${classItem.start_time} - ${classItem.end_time}`}
        </div>
      </div>
      <button
        onClick={() => handleEdit(classItem)}
        className={classes.editButton}
      >
        Editar
      </button>
    </div>
  );
};

export default ModifyClassModal;
