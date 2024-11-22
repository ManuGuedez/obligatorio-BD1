import React, { useState, useEffect } from 'react';
import ApiService from '../../Services/apiServices';
import './ModifyClassModal.css';

const ModifyClassModal = ({ isOpen, onClose }) => {
    const [classes, setClasses] = useState([]);
    const [editingClass, setEditingClass] = useState(null);
    const [newInstructor, setNewInstructor] = useState('');
    const [newTurn, setNewTurn] = useState('');
    const [instructors, setInstructors] = useState([]);
    const [turns, setTurns] = useState([]);

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const classesResponse = await ApiService.get('class-information', token);
                const instructorsResponse = await ApiService.get('instructors', token);
                const turnsResponse = await ApiService.get('turns', token);

                if (classesResponse.code === 200) {
                    const classesArray = Object.values(classesResponse.data);
                    setClasses(classesArray);
                }

                if (instructorsResponse.code === 200) {
                    setInstructors(instructorsResponse.data);
                }

                if (turnsResponse.code === 200) {
                    setTurns(turnsResponse.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (isOpen) {
            fetchData();
        }
    }, [isOpen]);

    const handleEdit = (classId) => {
        const classToEdit = {
            ...classes[classId],
            class_id: classId  // Explicitly include the class_id
        };
        setEditingClass(classToEdit);
        setNewInstructor(classToEdit.instructor_ci || '');
        setNewTurn(classToEdit.turn_id || '');
    };
    
    
    const handleSaveChanges = async () => {
        try {
            if (!editingClass || !editingClass.class_id) {
                console.log('Current editing class:', editingClass);
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

            console.log('Response from API:', response);
    
            if (response.code === 200) {
                const updatedClasses = {...classes};
                updatedClasses[editingClass.class_id] = {
                    ...classes[editingClass.class_id],
                    ...updatedFields
                };
                setClasses(updatedClasses);
                setEditingClass(null);
            }
        } catch (error) {
            console.log('Error updating class:', error);
        }
    };
    

    return (
        <div className="modal-overlay" style={{ display: isOpen ? 'block' : 'none' }}>
            <div className="modal-container">
                <div className="modal-header">
                    <h2>Modificar Clases</h2>
                </div>
                <div className="modal-content">
                    <div className="main-content">
                        {editingClass ? (
                            <div className="edit-form">
                                <h3>Editar Clase {editingClass.class_id}</h3>
                                <div>
                                    <label>Instructor:</label>
                                    <select
                                        value={newInstructor}
                                        onChange={(e) => setNewInstructor(e.target.value)}
                                    >
                                        <option value="">Seleccione un instructor</option>
                                        {instructors.map((instructor) => (
                                            <option key={instructor.instructor_id} value={instructor.instructor_id}>
                                                {`${instructor.first_name} ${instructor.last_name}`}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label>Turno:</label>
                                    <select
                                        value={newTurn}
                                        onChange={(e) => setNewTurn(e.target.value)}
                                    >
                                        <option value="">Seleccione un turno</option>
                                        {turns.map((turn) => (
                                            <option key={turn.turn_id} value={turn.turn_id}>
                                                {`${turn.start_time} - ${turn.end_time}`}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-buttons">
                                    <button onClick={handleSaveChanges}>Guardar</button>
                                    <button onClick={() => setEditingClass(null)}>Cancelar</button>
                                </div>
                            </div>
                        ) : (
                            <div className="classes-list">
                                {Object.entries(classes).map(([classId, classItem]) => (
                                    <div key={classId} className="class-item">
                                        <div>
                                            <div className="categorias"><strong>ID:</strong> {classId}</div>
                                            <div className="categorias"><strong>Clase:</strong> {classItem.description}</div>
                                            <div className="categorias"><strong>Instructor:</strong> {`${classItem.instructor_first_name} ${classItem.instructor_last_name}`}</div>
                                            <div className="categorias"><strong>Turno:</strong> {`${classItem.start_time} - ${classItem.end_time}`}</div>
                                        </div>
                                        <button
                                            onClick={() => handleEdit(classId)}
                                            className="edit-button"
                                        >
                                            Editar
                                        </button>
                                    </div>
                                ))}
                            </div>

                        )}
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="cancel-button" onClick={onClose}>
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModifyClassModal;
