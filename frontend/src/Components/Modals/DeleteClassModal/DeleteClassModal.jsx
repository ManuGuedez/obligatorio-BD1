import React, { useState, useEffect } from 'react';
import ApiService from '../../../Services/apiServices';
import styles from './DeleteClassModal.module.css';

const DeleteClassModal = ({ onClose }) => {
    const [classes, setClasses] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const classesResponse = await ApiService.get("classes", token);
                console.log("Response from API:", classesResponse);
                
                if (classesResponse.code === 200) {
                    const classesDict = classesResponse.data;
                    let fetchedClasses = [];
                    for (const id in classesDict) {
                        const currentClass = { ...classesDict[id], class_id: id };
                        fetchedClasses.push(currentClass);
                    }
                    setClasses(fetchedClasses);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const handleDelete = async (classId) => {
        const response = await ApiService.delete(`classes/${classId}/delete-class`, token);
        console.log(response);
        if (response.code === 200) {
            setClasses(classes.filter(clase => clase.classes_id !== classId));
            setShowSuccess(true);
            setTimeout(() => {
                onClose();
            }, 2000);
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                {showSuccess ? (
                    <div className={styles.successMessage}>
                        ¡Clase eliminada con éxito!
                    </div>
                ) : (
                    <>
                        <h2>Eliminar clases</h2>
                        <div className={styles.gridContainer}>
                            {classes.map((classItem) => (
                                <ClassItem
                                    key={classItem.class_id}
                                    classItem={classItem}
                                    handleDelete={handleDelete}
                                />
                            ))}
                        </div>
                        <button onClick={onClose}>Cerrar</button>
                    </>
                )}
            </div>
        </div>
    );
};

const ClassItem = ({ classItem, handleDelete }) => {
    return (
        <div className={styles.classItem}>
            <span
                className={styles.deleteX}
                onClick={() => handleDelete(classItem.class_id)}
            >
                ×
            </span>
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
        </div>
    );
};


export default DeleteClassModal;
