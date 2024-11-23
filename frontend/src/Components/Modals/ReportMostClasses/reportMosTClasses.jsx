import React, { useState, useEffect } from "react";
import "./reportMostClasses.css";
import reportServices from "../../../Services/reportServices"; // Importa el servicio para llamar al endpoint

const MostClassesModal = ({ onClose }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token"); // Obtén el token del almacenamiento local
                const response = await reportServices.getMostClasses(token); // Llama al servicio
                console.log(response)
                if (response && response.data.length > 0) {
                    setData(response.data); // Se asume que la respuesta es una lista de actividades
                } else {
                    setError("No se encontraron datos para el reporte.");
                }
            } catch (err) {
                console.error("Error al obtener el reporte:", err);
                setError("Hubo un error al obtener los datos del reporte.");
            } finally {
                setLoading(false); // Finaliza la carga
            }
        };

        fetchData(); // Llama a la función para obtener datos
    }, []); // Ejecuta el efecto una sola vez

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains("modalOverlay")) {
            onClose();
        }
    };

    return (
        <div className="modalOverlay" onClick={handleOverlayClick}>
            <div className="modalContainer">
                <div className="modalHeader">
                    <h2>Reporte: Turnos con más clases dictadas</h2>
                </div>
                <div className="modalContent">
                    {loading ? (
                        <p>Cargando datos...</p>
                    ) : error ? (
                        <p style={{ color: "red" }}>{error}</p>
                    ) : (
                        data.map((turn, index) => (
                            <div key={index} className="activityItem">
                                <span>{`${turn.start_time} - ${turn.end_time}`}</span>
                                <span>{turn.total_classes} clases</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default MostClassesModal;
