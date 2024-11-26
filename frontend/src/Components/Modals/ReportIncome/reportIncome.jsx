import React, { useState, useEffect } from "react";
import "./reportIncome.css";
import reportServices from "../../../Services/reportServices"; // Importa el servicio para llamar al endpoint

const ReportIncome = ({ onClose }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token"); // Obtén el token del almacenamiento local
                const response = await reportServices.getHighestIncome(token); // Llama al servicio
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
                    <h2>Reporte: Actividad con más ingresos</h2>
                </div>
                <div className="modalContent">
                    {loading ? (
                        <p>Cargando datos...</p>
                    ) : error ? (
                        <p style={{ color: "red" }}>{error}</p>
                    ) : (
                        data.map((activity, index) => (
                            <div key={index} className="activityItem">
                                <span>{`${activity.activity}:`}</span>
                                <span>{`$${activity.total_income} ingresos`}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportIncome;
