import React, { useState } from 'react';
import ApiService from '../Services/apiServices';
import './AddInstructorModal.css';


const AddInstructorModal = ({ show, handleClose, onInstructorAdded }) => {
    const [formData, setFormData] = useState({
        ci: '',
        first_name: '',
        last_name: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newInstructor = {
                ci: parseInt(formData.ci),
                first_name: formData.first_name,
                last_name: formData.last_name,
                user_type: "instructor"
            };
    
            const response = await ApiService.post(
                "add_user",
                newInstructor,
                "application/json",
                localStorage.getItem("token")
            );
    
            if (response.code === 201) {
                onInstructorAdded();
                handleClose();
                setFormData({
                    ci: '',
                    first_name: '',
                    last_name: ''
                });
            }
        } catch (error) {
            console.error('Error al agregar instructor:', error);
        }
    };
    


    // Solo renderiza el modal si `show` es true
    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h2>Agregar Nuevo Instructor</h2>
                    <button className="close-button" onClick={handleClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="ci">CI</label>
                            <input
                                type="number"
                                id="ci"
                                name="ci"
                                value={formData.ci}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="first_name">Nombre</label>
                            <input
                                type="text"
                                id="first_name"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="last_name">Apellido</label>
                            <input
                                type="text"
                                id="last_name"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="button-group">
                            <button type="button" className="cancel-button" onClick={handleClose}>
                                Cancelar
                            </button>
                            <button type="submit" className="submit-button">
                                Guardar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddInstructorModal;
