import React, { useState, useEffect } from 'react';
import ApiService from '../../../Services/apiServices';
import styles from './DeleteTurnModal.module.css';

const DeleteTurnModal = ({ onClose }) => {
    const [turns, setTurns] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchTurns = async () => {
            const response = await ApiService.get('turns', token);
            if (response.code === 200) {
                setTurns(response.data);
            }
        };
        fetchTurns();
    }, [token]);

    const handleDelete = async (turnId) => {
        const response = await ApiService.delete(`turns/${turnId}/delete-turn`, token);
        if (response.code === 200) {
            setTurns(turns.filter(turn => turn.turn_id !== turnId));
            setShowSuccess(true);
            setTimeout(() => {
                onClose();
            }, 2000);
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                {showSuccess ? (
                    <div className={styles.successMessage}>
                        ¡Turno eliminado con éxito!
                    </div>
                ) : (
                    <>
                        <h2>Eliminar Turnos</h2>
                        <div className={styles.gridContainer}>
                            {turns.map((turn) => (
                                <div key={turn.turn_id} className={styles.turnItem}>
                                    <span 
                                        className={styles.deleteX}
                                        onClick={() => handleDelete(turn.turn_id)}
                                    >
                                        ×
                                    </span>
                                    <span>{turn.start_time} - {turn.end_time}</span>
                                </div>
                            ))}
                        </div>
                        <button onClick={onClose}>Cerrar</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default DeleteTurnModal;
