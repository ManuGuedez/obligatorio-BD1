import React, { useState } from 'react';
import ApiService from './../../../Services/apiServices';
import classes from './AddActivityModal.module.css';

const AddActivityModal = ({ onClose }) => {
    const [formData, setFormData] = useState({
        description: '',
        cost: ''
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
        const dataToSend = {
            description: formData.description,
            cost: parseFloat(formData.cost)
        };
        
        try {
            const response = await ApiService.post(
                'activities/add-activity',
                dataToSend,
                'application/json',
                localStorage.getItem("token")
            );
    
            if (response.code === 200) {
                onClose();
                console.log("Se agrego");
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    return (
        <div className={classes.modalOverlay} onClick={onClose}>
            <div className={classes.modalContent} onClick={(e) => e.stopPropagation()}>
                <h2>Añadir Nueva Actividad</h2>
                <form onSubmit={handleSubmit}>
                    <div className={classes.formGroup}>
                        <label>Nombre de la Actividad:</label>
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className={classes.formGroup}>
                        <label>Costo:</label>
                        <input
                            type="number"
                            name="cost"
                            value={formData.cost}
                            onChange={handleInputChange}
                            required
                            min="0"
                            step="0.01"
                        />
                    </div>
                    <div className={classes.modalButtons}>
                        <button type="button" onClick={onClose} className={classes.cancelBtn}>Cancelar</button>
                        <button type="submit" className={classes.submitBtn}>Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddActivityModal;
