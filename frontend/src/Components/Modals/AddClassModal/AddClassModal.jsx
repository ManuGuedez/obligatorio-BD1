import React, { useEffect, useState } from "react";
import ApiService from "../../../Services/apiServices";
import classes from "./AddClassModal.module.css";

const AddClassModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    instructor_id: "",
    start_date: "",
    end_date: "",
    activity: "",
    turn: "",
    days: "",
  });

  const [turns, setTurns] = useState([]);
  const [ativities, setAtivities] = useState([]);

  useEffect(() => {
    const getInfo = async () => {
      const turnsData = await ApiService.get(
        "turns",
        localStorage.getItem("token")
      );

      setTurns(turnsData.data);
      const activitiesData = await ApiService.get(
        "activities",
        localStorage.getItem("token")
      );

      setAtivities(activitiesData.data);
    };
    getInfo();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newClass = {
        instructor_id: parseInt(formData.instructor_id),
        start_date: new Date(formData.start_date).toISOString().split("T")[0],
        end_date: new Date(formData.end_date).toISOString().split("T")[0],
        activity: formData.activity,
        turn: parseInt(formData.turn),
        days: formData.days.split(",").map((day) => day.trim().toLowerCase()),
        type: formData.type || null,
      };

      const response = await ApiService.post(
        "classes/new-class",
        newClass,
        "application/json",
        localStorage.getItem("token")
      );

      if (response.status === 200) {
        onClose();
        window.location.reload();
      }
    } catch (error) {
      console.error(
        "Error creating class:",
        error.response?.data?.error || error.message
      );
    }
  };

  return (
    <div className={classes.modalOverlay} onClick={onClose}>
      <div
        className={classes.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={classes.modalHeader}>
          <h2>Agregar Nueva Clase</h2>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className={classes.formGroup}>
              <label>ID del Instructor:</label>
              <input
                type="text"
                name="instructor_id"
                value={formData.instructor_id}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={classes.formGroup}>
              <label>Fecha de Inicio:</label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={classes.formGroup}>
              <label>Fecha de Fin:</label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={classes.formGroup}>
              <label>Actividad:</label>
              <select
                name="activity"
                value={formData.activity}
                onChange={handleInputChange}
                required
              >
                {ativities?.map((activity, index) => {
                  return (
                    <option key={index} value={activity.description}>
                      {activity.description}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className={classes.formGroup}>
              <label>Turno:</label>
              <select
                name="turn"
                value={formData.turn}
                onChange={handleInputChange}
                required
              >
                {turns?.map((current_turn, index) => {
                  return (
                    <option
                      key={index}
                      value={current_turn.turn_id}
                    >{`${current_turn.start_time} - ${current_turn.end_time}`}</option>
                  );
                })}
              </select>
            </div>

            <div className={classes.formGroup}>
              <label>Días (separados por coma):</label>
              <input
                type="text"
                name="days"
                value={formData.days}
                onChange={handleInputChange}
                placeholder="lunes,martes,miercoles"
                required
              />
            </div>

            <div className={classes.modalFooter}>
              <button
                type="button"
                className={classes.cancelButton}
                onClick={onClose}
              >
                Cancelar
              </button>
              <button type="submit" className={classes.submitButton}>
                Agregar Clase
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddClassModal;
