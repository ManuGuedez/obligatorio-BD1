import React, { useState, useEffect } from 'react';
import ApiService from '../../Services/apiServices';
import './ShowActivitiesModal.css';

const ShowActivitiesModal = ({ isOpen, onClose }) => {
    const [activities, setActivities] = useState([]);
    const token = localStorage.getItem('token');


    useEffect(() => {
        const fetchTurns = async () => {
            try {
                const response = await ApiService.get('activities', token);
                if (response.code === 200) {
                    setActivities(response.data);
                }
            } catch (error) {
                console.error('Error fetching turns:', error);
            }
        };

        if (isOpen) {
            fetchTurns();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Activities</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                
                <div className="modal-body">
                    {activities.map((activity) => (
                        <div key={activity.id} className="activity-card">
                            <div className="activity-header">
                                <h3>{activity.name}</h3>
                            </div>
                            <div className="activity-details">
                                <p>{activity.description}</p>
                                <p>Status: {activity.cost}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ShowActivitiesModal;
