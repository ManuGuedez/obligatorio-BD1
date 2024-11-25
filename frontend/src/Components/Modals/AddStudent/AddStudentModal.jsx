import React, { useState } from 'react';
import ApiService from './../../../Services/apiServices';
import classes from './AddStudentModal.module.css';

const AddStudentModal = ({ onClose }) => {
    const [formData, setFormData] = useState({
        ci: '',
        first_name: '',
        last_name: '',
        user_type: 'student',
        birth_date: ''
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
            const response = await ApiService.post(
                'add_user',
                formData,
                'application/json',
                localStorage.getItem("token")
            );

            if (response.code === 200) {
                onClose();
                setFormData({
                    ci: '',
                    first_name: '',
                    last_name: '',
                    user_type: 'student',
                    birth_date: ''
                });
                console.log('Student added successfully');
            }
        } catch (error) {
            console.error('Error adding student:', error);
        }
    };

    return (
        <div className={classes.modalOverlay} onClick={onClose}>
            <div className={classes.modalContent} onClick={e => e.stopPropagation()}>
                <h2>Añadir Estudiante</h2>
                <form onSubmit={handleSubmit}>
                    <div className={classes.formGroup}>
                        <label>CI:</label>
                        <input
                            type="text"
                            name="ci"
                            value={formData.ci}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className={classes.formGroup}>
                        <label>Nombre:</label>
                        <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className={classes.formGroup}>
                        <label>Apellido:</label>
                        <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className={classes.formGroup}>
                        <label>Fecha de Nacimiento:</label>
                        <input
                            type="date"
                            name="birth_date"
                            value={formData.birth_date}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className={classes.modalFooter}>
                        <button type="button" onClick={onClose} className={classes.cancelBtn}>Cancelar</button>
                        <button type="submit" className={classes.submitBtn}>Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStudentModal;
