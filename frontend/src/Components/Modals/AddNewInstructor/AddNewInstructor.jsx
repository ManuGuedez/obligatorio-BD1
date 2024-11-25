import React, { useState } from 'react';
import ApiService from './../../../Services/apiServices';
import classes from './AddNewInstructor.module.css'

const AddNewInstructor = ({ onClose }) => {
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
                ci: formData.ci,
                first_name: formData.first_name,
                last_name: formData.last_name,
                user_type: "instructor"
            };

            const response = await ApiService.post("add_user",
                newInstructor,
                "application/json",
                localStorage.getItem("token")
            );
            
    
            if (response.code === 201) {
                
                onClose();
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
    
    return (
        <div className={classes.modaOverlay} onClick={onClose}>
            <div className={classes.modalContainer} onClick={(e) => e.stopPropagation()}>
                <div className={classes.modalHeader}>
                    <h2>Agregar Nuevo Instructor</h2>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                        <div className={classes.formGroup}>
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
                        <div className={classes.formGroup}>
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
                        <div className={classes.formGroup}>
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
                        <div className={classes.buttonGroup}>
                            <button type="button" className={classes.cancelButton} onClick={onClose}>
                                Cancelar
                            </button>
                            <button type="submit" className={classes.submitButton}>
                                Guardar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddNewInstructor;
