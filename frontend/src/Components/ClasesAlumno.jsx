import React, { useState } from "react";
import "./ClasesAlumno.css";
import alumnoService from "../Services/alumnoService";


const ClasesAlumno = ({ clases, setClases }) => {
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [currentClass, setCurrentClass] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [loadingEquipment, setLoadingEquipment] = useState(false);
  const [equipment, setEquipment] = useState([]);
  const [error, setError] = useState(null);
  const [checked, setChecked] = useState(false)

  const handleOpenModal = async (clase) => {
    setCurrentClass(clase);
    setOpenDetailsModal(true);

    try {
      setLoadingEquipment(true);
      const token = localStorage.getItem("token");
      const response = await alumnoService.getAvailableEquipment(
        clase.class_id,
        token
      );
      setEquipment(response.data);
    } catch (err) {
      console.error("Error al cargar el equipamiento:", err);
      setError("No se pudo cargar el equipamiento. Intenta de nuevo.");
    } finally {
      setLoadingEquipment(false);
    }
  };

  const handleEquipmentChange = (equipmentId) => {
    console.log("Equipo seleccionado:", equipmentId);
    setSelectedEquipment((prevSelected) =>
      prevSelected.includes(equipmentId)
        ? prevSelected.filter((id) => id !== equipmentId) 
        : [...prevSelected, equipmentId] 
    );
  };

  const handleRemoveStudent = async (classId) => {
    try {
      const response = await alumnoService.removeStudentFromClass(classId);
      if (response && response.code === 200) {
        setClases((prevClases) =>
          prevClases.filter((clase) => clase.class_id !== classId)
        );
        alert("Te has dado de baja exitosamente de la clase.");
      } else {
        alert("No se pudo procesar la baja. Intenta de nuevo.");
      }
    } catch (err) {
      console.error("Error al procesar la baja:", err);
      alert("Hubo un error al procesar la solicitud.");
    } finally {
      setOpenDetailsModal(false);
    }
  };

  if (!clases || clases.length === 0) {
    return <p>No estás inscrito en ninguna clase.</p>;
  }

  return (
    <div className="clases-container">
      {clases.map((clase) => (
        <div key={clase.class_id} className="clase-card">
          <h4>{clase.name}</h4>
          <p>
            <strong>Descripción:</strong> {clase.description}
          </p>
          <p>
            <strong>Horario:</strong> {clase.start_time} - {clase.end_time}
          </p>
          <button onClick={() => handleOpenModal(clase)}>Ver Detalle</button>
        </div>
      ))}
      {openDetailsModal && (
        <DetailsModal
          clase={currentClass}
          equipment={equipment}
          selectedEquipment={selectedEquipment}
          onEquipmentChange={handleEquipmentChange}
          onClose={() => setOpenDetailsModal(false)}
          onRemove={handleRemoveStudent}
          error={error}
          loadingEquipment={loadingEquipment}
        />
      )}
    </div>
  );
};

const DetailsModal = ({
  clase,
  equipment,
  selectedEquipment,
  onEquipmentChange,
  onClose,
  onRemove,
  error,
  loadingEquipment,
}) => {
  const handleRemove = () => onRemove(clase.class_id);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Detalles de clase</h2>
        <div className="info">
          <p>
            <strong>Actividad:</strong> {clase.description}
          </p>
        </div>
        <div className="info">
          <p>
            <strong>Modalidad:</strong> {clase.is_group ? "Grupal" : "Individual"}
          </p>
        </div>
        <div className="info">
          <p>
            <strong>Horario:</strong> {clase.start_time} - {clase.end_time}
          </p>
        </div>
        <div className="info">
          <p>
            <strong>Fecha inicio:</strong> {clase.start_date}
          </p>
        </div>
        <div className="info">
          <p>
            <strong>Fecha fin:</strong> {clase.end_date}
          </p>
        </div>
        <div className="info">
          <p>
            <strong>Instructor:</strong> {clase.instructor_first_name} {clase.instructor_last_name}
          </p>
        </div>

        <div className="equipment-section">
          <h3>Equipamiento</h3>
          {loadingEquipment ? (
            <p>Cargando equipamiento disponible...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : equipment.length > 0 ? (
            <ul>
              {equipment.map((item) => (
                <li className="equipment-item">
                  <label>
                    <input 
                      key={item.id}
                      type="checkbox"
                      checked={selectedEquipment.includes(item.equipment_id)} 
                      onChange={() => onEquipmentChange(item.equipment_id)} 
                    />
                    {item.description} - ${item.cost}
                  </label>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay equipamiento disponible para esta clase.</p>
          )}
        </div>

        <div className="button-container">
          <button className="modal-button" onClick={onClose}>
            Cerrar
          </button>
          <button onClick={() => {alumnoService.rentEquipment(selectedEquipment, clase.class_id, localStorage.getItem("token")); onClose();}}>
            Alquilar
          </button>
          <button className="modal-button" onClick={handleRemove}>
            Darme de baja
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClasesAlumno;
