import React, { useEffect, useState } from "react";
import ApiService from "../../../Services/apiServices";
import classes from "./ModifyTurnModal.module.css";
import { ClipLoader } from "react-spinners";

const ModifyTurnModal = ({ onClose }) => {
  const [turns, setTurns] = useState([]);
  const [editingTurn, setEditingTurn] = useState(null);
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTurns = async () => {
      try {
        setLoading(true);
        const response = await ApiService.get("turns", token);
        setLoading(false);
        if (response.code === 200) {
          setTurns(response.data);
        }
      } catch (error) {
        console.error("Error fetching turns:", error);
      }
    };

    fetchTurns();
  }, []);

  const handleEdit = (turnId) => {
    const turn = turns.find((t) => t.turn_id === turnId);
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
        const updatedTurns = turns.map((turn) =>
          turn.turn_id === editingTurn.turn_id
            ? { ...turn, ...updatedFields }
            : turn
        );
        setTurns(updatedTurns);
        setEditingTurn(null);
      }
    } catch (error) {
      console.error("Error updating turn:", error);
    }
  };

  return (
    <div className={classes.modalOverlay} onClick={onClose}>
      <div
        className={classes.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={classes.modalHeader}>
          <h2>Turnos Disponibles</h2>
        </div>
        <div className={classes.modalContent}>
          {loading && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100px",
              }}
            >
              <ClipLoader color="#3498db" loading={true} size={30} />
            </div>
          )}
          {editingTurn ? (
            <div className={classes.editForm}>
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
                <div className={classes.modalFooter}>
                  <button
                    className={classes.submitButton}
                    onClick={handleSaveChanges}
                  >
                    Guardar
                  </button>
                  <button
                    className={classes.cancelButton}
                    onClick={() => setEditingTurn(null)}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className={classes.turnList}>
                {turns.map((turn) => {
                  return (
                    <TurnItem
                      key={turn.turn_id}
                      turnItem={turn}
                      handleEdit={handleEdit}
                    />
                  );
                })}
              </div>
              <div className={classes.modalFooter}>
                <button onClick={onClose}>Cerrar</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const TurnItem = ({ turnItem, handleEdit }) => {
  return (
    <div
      className={classes.turnItem}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        margin: "10px 0",
      }}
    >
      <div>
        <div>Turno {turnItem.turn_id}</div>
        <div>Hora inicio: {turnItem.start_time}</div>
        <div>Hora fin: {turnItem.end_time}</div>
      </div>
      <button
        onClick={() => handleEdit(turnItem.turn_id)}
        className={classes.editButton}
        style={{
          padding: "5px 10px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Editar
      </button>
    </div>
  );
};

export default ModifyTurnModal;
