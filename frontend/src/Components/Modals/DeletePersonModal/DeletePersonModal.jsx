import React, { useState, useEffect } from 'react';
import ApiService from "../../../Services/apiServices";
import styles from './DeletePersonModal.module.css';


const DeletePersonModal = ({ onClose, personType }) => {
    const [persons, setPersons] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchPersons = async () => {
            try {
                const endpoint = personType === 'instructor' ? 'instructors' : 'students';
                const response = await ApiService.get(endpoint, token);
                setPersons(response.data);
            } catch (error) {
                console.error(`Error fetching ${personType}s:`, error);
            } finally {
                setLoading(false);
            }
        };

        fetchPersons();
    }, [personType]);

    const handleDelete = async (personId) => {
        try {
            const response = await ApiService.delete(`person/${personId}/delete-person`, token);
            
            if (response.code === 200) {
                setPersons(persons.filter(person => 
                    personType === 'instructor' ? 
                    person.instructor_id !== personId : 
                    person.student_id !== personId
                ));
            }
        } catch (error) {
            console.error('Error deleting person:', error);
        }
    };
    

    const midPoint = Math.ceil(persons.length / 2);
    const leftColumn = persons.slice(0, midPoint);
    const rightColumn = persons.slice(midPoint);

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>Eliminar {personType === 'instructor' ? 'Instructor' : 'Estudiante'}</h2>
                {loading ? (
                    <p>Cargando...</p>
                ) : (
                    <div className={styles.personsList}>
                        <div className={styles.column}>
                            {leftColumn.map((person, index) => (
                                <div key={`left-${person.person_ci}-${index}`} className={styles.personItem}>
                                    <span>{person.name} {person.first_name} {person.last_name}</span>
                                    <span
                                        className={styles.deleteButton}
                                        onClick={() => handleDelete(personType === 'instructor' ? person.instructor_id : person.student_id)}
                                    >
                                        ✕
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className={styles.column}>
                            {rightColumn.map((person, index) => (
                                <div key={`right-${person.person_ci}-${index}`} className={styles.personItem}>
                                    <span>{person.name} {person.first_name} {person.last_name}</span>
                                    <span
                                        className={styles.deleteButton}
                                        onClick={() => handleDelete(personType === 'instructor' ? person.instructor_id : person.student_id)}
                                    >
                                        ✕
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                )}
                <button onClick={onClose}>Cerrar</button>
            </div>
        </div>
    );
};

export default DeletePersonModal;
