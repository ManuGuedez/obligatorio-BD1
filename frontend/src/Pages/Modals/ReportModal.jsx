import React from 'react';
import './ReportModal.css';

const ReportModal = ({ show, handleClose }) => {
    if (!show) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Reportes Generados</h2>
                <p>Actividad más popular:</p>
                <p>Actividad con más ingresos:</p>
                <p>Turno con más clases dictadas:</p>
                <div className="modal-buttons">
                    <button onClick={handleClose}>Cerrar</button>
                </div>
            </div>
        </div>
    );
};

export default ReportModal;
