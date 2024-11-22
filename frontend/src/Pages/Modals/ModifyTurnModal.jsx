import React, { useState, useEffect } from 'react';
import ApiService from '../../Services/apiServices';

const ModifyTurnModal = ({ isOpen, onClose }) => {
    const [turns, setTurns] = useState([]);
    const [editingTurn, setEditingTurn] = useState(null);
    const [newStartTime, setNewStartTime] = useState('');
    const [newEndTime, setNewEndTime] = useState('');
    const token = localStorage.getItem('token');

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
    }, [isOpen]);

    const handleEdit = (turnId) => {
        const turn = turns.find(t => t.turn_id === turnId);
        setEditingTurn(turn);
        setNewStartTime(turn.start_time);
        setNewEndTime(turn.end_time);
    };

    const handleSaveChanges = async () => {
        try {
            const updatedFields = {};
            if (newStartTime !== editingTurn.start_time) {
                updatedFields.start_time = newStartTime;
            }
            if (newEndTime !== editingTurn.end_time) {
                updatedFields.end_time = newEndTime;
            }

            const response = await ApiService.patch(
                `turns/${editingTurn.turn_id}/modify-turn`,
                updatedFields,
                token
            );

            if (response.code === 200) {
                const updatedTurns = turns.map(turn =>
                    turn.turn_id === editingTurn.turn_id
                        ? { ...turn, ...updatedFields }
                        : turn
                );
                setTurns(updatedTurns);
                setEditingTurn(null);
            }
        } catch (error) {
            console.error('Error updating turn:', error);
        }
    };



    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h2>Turnos Disponibles</h2>
                </div>
                <div className="modal-content">
                    {editingTurn ? (
                        <div className="edit-form">
                            <h3>Editar Turno {editingTurn.turn_id}</h3>
                            <div>
                                <label>Hora inicio:</label>
                                <input
                                    type="time"
                                    value={newStartTime}
                                    onChange={(e) => setNewStartTime(e.target.value)}
                                />
                            </div>
                            <div>
                                <label>Hora fin:</label>
                                <input
                                    type="time"
                                    value={newEndTime}
                                    onChange={(e) => setNewEndTime(e.target.value)}
                                />
                            </div>
                            <div>
                                <button onClick={handleSaveChanges}>Guardar</button>
                                <button onClick={() => setEditingTurn(null)}>Cancelar</button>
                            </div>
                        </div>
                    ) : (
                        <div className="turns-list">
                            {turns.map((turn) => (
                                <div key={turn.turn_id} className="turn-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0' }}>
                                    <div>
                                        <div>Turno {turn.turn_id}</div>
                                        <div>Hora inicio: {turn.start_time}</div>
                                        <div>Hora fin: {turn.end_time}</div>
                                    </div>
                                    <button
                                        onClick={() => handleEdit(turn.turn_id)}
                                        className="edit-button"
                                        style={{ padding: '5px 10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        Editar
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
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
