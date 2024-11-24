import React, { useState, useEffect } from 'react';
import ApiService from '../../../Services/apiServices';
import styles from './RemoveStudentClassModal.module.css';

const StudentClassesModal = ({ onClose, studentId }) => {
    const [classes, setClasses] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        console.log('Student ID:', studentId);

        if (studentId) {
            ApiService.get(`student/${studentId}/class-information`, token)
                .then(response => {
                    console.log('API Response:', response);
                    setClasses(response.data);
                })
                .catch(error => {
                    console.log('Error details:', error);
                    setClasses([]);
                });
        }
    }, [studentId]);

    const handleDeleteClass = (classId) => {
        const requestBody = {
            student_id: studentId
        };
        
        ApiService.delete(`classes/${classId}/remove-student`, token, requestBody)
            .then(() => {
                setClasses(classes.filter(c => c.id !== classId));
                alert('Clase eliminada con éxito');
                onClose(); // Cierra el modal después del borrado exitoso
            })
            .catch(error => {
                console.log('Error deleting class:', error);
                alert('Error al eliminar la clase');
            });
    };
    




    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2>Student Classes</h2>
                    <span className={styles.closeButton} onClick={onClose}>&times;</span>
                </div>
                <div className={styles.modalBody}>
                    <div className={styles.gridContainer}>
                        {classes.map(classItem => (
                            <div key={classItem.class_id} className={styles.gridItem}>
                                <span
                                    className={styles.deleteButton}
                                    onClick={() => handleDeleteClass(classItem.class_id)}
                                >
                                    ✕
                                </span>
                                <h3>{classItem.name}</h3>
                                <p>{classItem.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const RemoveStudentClassModal = ({ onClose }) => {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showClassesModal, setShowClassesModal] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        ApiService.get('students', token)
            .then(response => {
                setStudents(response.data || []);
            })
            .catch(error => {
                console.error('Error:', error);
                setStudents([]);
            });
    }, []);


    return (
        <>
            <div className={styles.modalOverlay}>
                <div className={styles.modalContent}>
                    <div className={styles.modalHeader}>
                        <h2>Lista de Estudiantes</h2>
                        <span className={styles.closeButton} onClick={onClose}>&times;</span>
                    </div>
                    <div className={styles.modalBody}>
                        <div className={styles.gridContainer}>
                            {students.map(student => (
                                <div key={student.student_id} className={styles.gridItem}>
                                    <h3>{student.first_name} {student.last_name} </h3>
                                    <p>ID: {student.student_id}</p>
                                    <button
                                        className={styles.classesButton}
                                        onClick={() => {
                                            setSelectedStudent(student);
                                            setShowClassesModal(true);
                                        }}
                                    >
                                        Classes
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {showClassesModal && (
                <StudentClassesModal
                    onClose={() => setShowClassesModal(false)}
                    studentId={selectedStudent?.student_id}
                />
            )}
        </>
    );
};

export default RemoveStudentClassModal;
