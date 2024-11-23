import React, { useState } from 'react';
import ApiService from '../../Services/apiServices';
import './AddTurnModal.css';

const AddTurnModal = ({ isOpen, onClose }) => {
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
    

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h2>Add New Turn</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="start_time">Start Time:</label>
                            <input
                                type="time"
                                id="start_time"
                                name="start_time"
                                value={turnData.start_time}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="end_time">End Time:</label>
                            <input
                                type="time"
                                id="end_time"
                                name="end_time"
                                value={turnData.end_time}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="modal-footer">
                            <button type="button" onClick={onClose}>Cancel</button>
                            <button type="submit">Add Turn</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddTurnModal;
