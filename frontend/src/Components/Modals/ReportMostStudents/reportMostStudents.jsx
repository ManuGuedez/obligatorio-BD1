import React, { useState, useEffect } from "react";
import reportServices from "../../../Services/reportServices"
import "./MostStudentsModal.css"; // Asegúrate de crear un archivo CSS para estilos adicionales

const MostStudentsModal = ({ onClose }) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await reportServices.getMostStudents(token);
                console.log(response.data)
                if (response && response.data.length > 0) {
                    setData(response.data); // Se asume que la respuesta es una lista de actividades
                } else {
                    setError("No se encontraron datos para el reporte.");
                }
            } catch (err) {
                setError("Error al cargar el reporte.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleOverlayClick = (e) => {
        // Si el usuario hace clic fuera del modalContainer, se cierra el modal
        if (e.target.classList.contains("modalOverlay")) {
            onClose();
        }
    };

    return (
        <div className="modalOverlay" onClick={handleOverlayClick}>
            <div className="modalContainer">
                <div className="modalHeader">
                    <h2>Reporte: Actividades con más estudiantes</h2>
                </div>
                <div className="modalContent">
                    {data && data.length > 0 ? (
                        data.map((item, index) => (
                            <div key={index} className="activityItem">
                                <span>{item.activity}</span>
                                <span>{item.student_count} estudiantes</span>
                            </div>
                        ))
                    ) : (
                        <p>No se encontraron datos para el reporte.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MostStudentsModal;
