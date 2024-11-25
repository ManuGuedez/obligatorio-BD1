import React, { useEffect, useState } from "react";
import ApiService from "../../../Services/apiServices";
import classes from "./ModifyClassModal.module.css";
import { ClipLoader } from "react-spinners";
import EditClassForm from "./EditClassForm";

const ModifyClassModal = ({ onClose }) => {
  const [allClasses, setAllClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [editingType, setEditingType] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const classesResponse = await ApiService.get("classes", token);
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
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (classToEdit, type) => {
    setSelectedClass(classToEdit);
    setEditingType(type);
  };

  return (
    <div className={classes.modalOverlay} onClick={onClose}>
      <div className={classes.modalContainer} onClick={(e) => e.stopPropagation()}>
        <div className={classes.modalHeader}>
          <h2>Modificar Clases</h2>
        </div>
        <div className={classes.modalContent}>
          <div className={classes.mainContent}>
            {loading && (
              <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100px",
              }}>
                <ClipLoader color="#3498db" loading={true} size={30} />
              </div>
            )}
            {selectedClass ? (
              <EditClassForm 
              classData={selectedClass} 
              onBack={() => setSelectedClass(null)}
              editType={editingType} // 'instructor' or 'turn'
            />
            
            ) : (
              <>
                <div className={classes.classesList}>
                  {allClasses.map((classItem, index) => (
                    <ClassItem
                      key={index}
                      classItem={classItem}
                      handleEdit={handleEdit}
                    />
                  ))}
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
          <strong>Actividad:</strong> {classItem.description}
        </div>
        <div className="categorias">
          <strong>Instructor:</strong> {`${classItem.instructor_first_name} ${classItem.instructor_last_name}`}
        </div>
        <div className="categorias">
          <strong>Turno:</strong> {`${classItem.start_time} - ${classItem.end_time}`}
        </div>
      </div>
      <div className={classes.buttonContainer}>
        <button 
          onClick={() => handleEdit(classItem, 'instructor')} 
          className={classes.editButton}
        >
          Editar Instructor
        </button>
        <button 
          onClick={() => handleEdit(classItem, 'turn')} 
          className={classes.editButton}
        >
          Editar Turno
        </button>
      </div>
    </div>
  );
};


export default ModifyClassModal;
