import React, { useState } from 'react';
import ApiService from './../../../Services/apiServices';
import classes from './AddTurnModal.module.css';

const AddTurnModal = ({ onClose }) => {
    const [turnData, setTurnData] = useState({
        start_time: '',
        end_time: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTurnData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const newTurn = {
                start_time: turnData.start_time + ':00',
                end_time: turnData.end_time + ':00'
            };
    
            const response = await ApiService.post(
                "turns/add-turn", 
                newTurn,
                "application/json",
                localStorage.getItem("token")
            );


            if (response.code === 201) {
                onClose();
                setTurnData({
                    start_time: '',
                    end_time: ''
                });
            }
        } catch (error) {
            console.error('Error adding turn:', error);
        }
    };
    
    return (
        <div className={classes.modalOverlay} onClick={onClose}>
            <div className={classes.modalContainer} onClick={(e) => e.stopPropagation()}>
                <div className={classes.modalHeader}>
                    <h2>Agregar Nuevo Turno</h2>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                        <div className={classes.formGroup}>
                            <label htmlFor="start_time">Hora inicio:</label>
                            <input
                                type="time"
                                id="start_time"
                                name="start_time"
                                value={turnData.start_time}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className={classes.formGroup}>
                            <label htmlFor="end_time">Hora fin:</label>
                            <input
                                type="time"
                                id="end_time"
                                name="end_time"
                                value={turnData.end_time}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className={classes.modalFooter}>
                            <button type="button" className={classes.cancelButton} onClick={onClose}>Cancelar</button>
                            <button type="submit" className={classes.submitButton}>Agregar Truno</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddTurnModal;
