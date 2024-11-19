import React, { useState, useEffect } from 'react';
import ApiService from '../../Services/apiServices';
import { useAuth } from '../../Context/AuthContext';

const ModifyTurnModal = ({ isOpen, onClose }) => {
    const [turns, setTurns] = useState([]);
    const { token } = useAuth();

    useEffect(() => {
        const fetchTurns = async () => {
            try {
                const response = await ApiService.get('turns', token);
                if (response.code === 200) {
                    setTurns(response.data);
                }
            } catch (error) {
                console.error('Error fetching turns:', error);
            }
        };

        if (isOpen) {
            fetchTurns();
        }
    }, [isOpen, token]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h2>Turnos Disponibles</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                <div className="modal-content">
                    <div className="turns-list">
                        {turns.map((turn) => (
                            <div key={turn.id} className="turn-item">
                                <span>Turno {turn.id}</span>
                                <span>{turn.start_time} - {turn.end_time}</span>
                            </div>
                        ))}
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

export default ModifyTurnModal;
