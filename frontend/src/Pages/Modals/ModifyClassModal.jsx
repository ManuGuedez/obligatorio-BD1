import React, { useEffect, useState } from 'react';
import ApiService from '../../Services/apiServices';
import './ModifyClassModal.css';

const ModifyClassModal = ({ isOpen, onClose }) => {
    const [classes, setClasses] = useState([]);
    const [editingClass, setEditingClass] = useState(null);
    const [newInstructor, setInstructor] = useState('');
    const [newTurn, setTurn] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await ApiService.get('classes', token);
                if (response.code === 200) {
                    setClasses(response.data);
                }
            } catch (error) {
                console.error('Error fetching classes:', error);
            }
        };

        if (isOpen) {
            fetchClasses();
        }
    }, [isOpen]);


    const handleEdit = (classId) => {
        const classToEdit = classes.find(c => c.class_id === classId);
        setEditingClass(classToEdit);
        setInstructor(classToEdit.instructor_id);
        setTurn(classToEdit.turn_id);
    };

    const handleSaveChanges = async () => {
        try {
            const updatedFields = {};
            if (newInstructor !== editingClass.instructor_id) {
                updatedFields.instructor_id = newInstructor;
            }
            if (newTurn !== editingClass.turn_id) {
                updatedFields.turn_id = newTurn;
            }
            const response = await ApiService.patch(
                `classes/${editingClass.class_id}/modify-class`,
                updatedFields,
                token
            );

            if (response.code === 200) {
                onClose();

            }

        } catch (error) {
            console.error('Error updating class:', error);
        }

    };

    if (!isOpen) return null;


    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h2>Clases Disponibles</h2>
                </div>
                <div className="modal-content">
                    {editingClass ? (
                        <div className="edit-form">
                            <h3>Editar Clase {editingClass.class_id}</h3>
                            <div>
                                <label>Instructor:</label>
                                <input
                                    type="instrucor"
                                    value={newInstructor}
                                    onChange={(e) => setInstructor(e.target.value)}
                                />
                            </div>

                            <div>
                                <label>Turno:</label>
                                <input
                                    type="turn"
                                    value={newTurn}
                                    onChange={(e) => setTurn(e.target.value)}
                                />
                            </div>
                            <div>
                                <button onClick={handleSaveChanges}>Guardar Cambios</button>
                                <button onClick={() => setEditingClass(null)}>Cancelar</button>
                            </div>
                        </div>

                    ) : (
                        <div className="classes-list">
                            {classes.map((classItem) => (
                                <div key={classItem.class_id} className="class-item">
                                    <div>
                                        <strong>ID:</strong> {classItem.class_id}
                                    </div>
                                    <div>
                                        <strong>Instructor:</strong> {classItem.instructor_id}
                                    </div>
                                    <div>
                                        <strong>Turno:</strong> {classItem.turn_id}
                                    </div>
                                    <button onClick={() => handleEdit(classItem.class_id)}>Editar</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="modal-footer">
                    <button onClick={onClose}>Cerrar</button>
                </div>
            </div>
        </div>

    );

};
export default ModifyClassModal;