import React, { useState } from "react";
import "./Actividad.css";
import alumnoService from "../Services/alumnoService";

const Actividad = ({ activity, openModal, toggleEnrollment, enrolledActivities }) => {
    const [hasEquipment, setHasEquipment] = useState(false);
    const [equipment, setEquipment] = useState([]);
    const [selectedEquipment, setSelectedEquipment] = useState([]); 
    const [loadingEquipment, setLoadingEquipment] = useState(false);
    const [error, setError] = useState(null);

    const handleEquipmentToggle = async () => {
        setHasEquipment(!hasEquipment);

        if (!hasEquipment) {
            try {
                setLoadingEquipment(true);
                const token = localStorage.getItem("token");
                const response = await alumnoService.getAvailableEquipment(activity.id, token);
                setEquipment(response.data);
            } catch (err) {
                console.error("Error al cargar el equipamiento:", err);
                setError("No se pudo cargar el equipamiento. Intenta de nuevo.");
            } finally {
                setLoadingEquipment(false);
            }
        } else {
            setEquipment([]);
            setSelectedEquipment([]);
            setError(null);
        }
    };

    const handleEquipmentChange = (equipmentId) => {
        setSelectedEquipment((prevSelected) =>
            prevSelected.includes(equipmentId)
                ? prevSelected.filter((id) => id !== equipmentId)
                : [...prevSelected, equipmentId]
        );
    };

    return (
        <div className="activity-card">
            <h3>{activity.name}</h3>
            <p>
                <strong>Horario:</strong> {activity.schedule}
            </p>

            <button className="details-btn" onClick={() => openModal(activity)}>
                Ver Detalles
            </button>

            <button
                className={`enroll-btn ${enrolledActivities.includes(activity.id) ? "enrolled" : ""}`}
                onClick={() => toggleEnrollment(activity.id)}
                disabled={enrolledActivities.includes(activity.id)}
            >
                {enrolledActivities.includes(activity.id) ? "Darme de baja" : "Inscribirme"}
            </button>

            <div className="equipment-switch">
                <span className="equipment-label">Necesito equipamiento</span>
                <label className="switch">
                    <input
                        type="checkbox"
                        checked={hasEquipment}
                        onChange={handleEquipmentToggle}
                    />
                    <span className="slider"></span>
                </label>
            </div>

            {hasEquipment && (
                <div className="equipment-list">
                    {loadingEquipment ? (
                        <p>Cargando equipamiento disponible...</p>
                    ) : error ? (
                        <p className="error">{error}</p>
                    ) : equipment.length > 0 ? (
                        <ul>
                            {equipment.map((item) => (
                                <li key={item.id} className="equipment-item">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={selectedEquipment.includes(item.id)}
                                            onChange={() => handleEquipmentChange(item.id)}
                                        />
                                        {item.description} - ${item.cost}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No hay equipamiento disponible para esta actividad.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Actividad;