import React, { useState, useEffect } from 'react';
import ApiService from '../../Services/apiServices';
import './ModifyActivityModal.css';

const ModifyActivityModal = ({ isOpen, onClose }) => {
    const [activities, setActivities] = useState([]);
    const [editingActivity, setEditingActivity] = useState(null);
    const [newCost, setNewCost] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await ApiService.get('activities', token);
                if (response.code === 200) {
                    setActivities(response.data);
                }
            } catch (error) {
                console.error('Error fetching activities:', error);
            }
        };

        if (isOpen) {
            fetchActivities();
        }
    }, [isOpen]);

    const handleEdit = (activityId) => {
        const activity = activities.find(a => a.activity_id === activityId);
        setEditingActivity(activity);
        setNewCost(activity.cost);
    };

    const handleSaveChanges = async () => {
        try {
            const updatedFields = {
                cost: newCost
            };

            const response = await ApiService.patch(
                `activities/${editingActivity.activity_id}/modify-cost`,
                updatedFields,
                token
            );

            if (response.code === 200) {
                const updatedActivities = activities.map(activity =>
                    activity.activity_id === editingActivity.activity_id
                        ? { ...activity, ...updatedFields }
                        : activity
                );
                setActivities(updatedActivities);
                setEditingActivity(null);
            }
        } catch (error) {
            console.error('Error updating activity:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h2>Actividades Disponibles</h2>
                </div>
                <div className="modal-content">
                    {editingActivity ? (
                        <div className="edit-form">
                            <h3>Editar Actividad {editingActivity.activity_id}</h3>
                            <div>
                                <label>Costo:</label>
                                <input
                                    type="number"
                                    value={newCost}
                                    onChange={(e) => setNewCost(e.target.value)}
                                />
                            </div>
                            <div>
                                <button onClick={handleSaveChanges}>Guardar</button>
                                <button onClick={() => setEditingActivity(null)}>Cancelar</button>
                            </div>
                        </div>
                    ) : (
                        <div className="activities-list">
                            {activities.map((activity) => (
                                <div key={activity.activity_id} className="activity-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0' }}>
                                    <div>
                                        <div>Actividad {activity.activity_id}</div>
                                        <div>Nombre: {activity.name}</div>
                                        <div>Costo: ${activity.cost}</div>
                                    </div>
                                    <button
                                        onClick={() => handleEdit(activity.activity_id)}
                                        className="edit-button"
                                        style={{ padding: '5px 10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        Editar Costo
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

export default ModifyActivityModal;
