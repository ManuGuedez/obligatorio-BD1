import React, { useEffect, useState } from "react";
import ApiService from "../../../Services/apiServices";
import classes from "./ModifyActivityModal.module.css";
import { ClipLoader } from "react-spinners";

const ModifyActivityModal = ({ onClose }) => {
  const [activities, setActivities] = useState([]);
  const [editingActivity, setEditingActivity] = useState(null);
  const [newCost, setNewCost] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const response = await ApiService.get("activities", token);
        setLoading(false);
        if (response.code === 200) {
          setActivities(response.data);
          console.log(response.data);
        }
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };
    fetchActivities();
  }, []);

  const handleEdit = (activityId) => {
    const activity = activities.find((a) => a.activity_id === activityId);
    setEditingActivity(activity);
    setNewCost(activity.cost);
  };

  const handleSaveChanges = async () => {
    try {
      const updatedFields = {
        cost: newCost,
      };

      const response = await ApiService.patch(
        `activities/${editingActivity.activity_id}/modify-cost`,
        updatedFields,
        token
      );

      if (response.code === 200) {
        const updatedActivities = activities.map((activity) =>
          activity.activity_id === editingActivity.activity_id
            ? { ...activity, ...updatedFields }
            : activity
        );
        setActivities(updatedActivities);
        setEditingActivity(null);
      }
    } catch (error) {
      console.error("Error updating activity:", error);
    }
  };

  return (
    <div className={classes.modalOverlay} onClick={onClose}>
      <div
        className={classes.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={classes.modalContent}>
          {editingActivity ? (
            <div className={classes.editForm}>
              <h3>Editar {editingActivity.description}</h3>
              <div>
                <label>
                  <b>Costo:</b>
                </label>
                <input
                  type="number"
                  value={newCost}
                  onChange={(e) => setNewCost(e.target.value)}
                />
              </div>
              <div className={classes.modalFooter}>
                <button onClick={() => setEditingActivity(null)} className={classes.cancelButton}>
                  Cancelar
                </button>
                <button onClick={handleSaveChanges} className={classes.submitButton}>Guardar</button>
              </div>
            </div>
          ) : (
            <>
              <div className={classes.modalHeader}>
                <h2>Actividades Disponibles</h2>
              </div>
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
              <div className="activities-list">
                {activities.map((activity) => (
                  <div
                    key={activity.activity_id}
                    className={classes.activityItem}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      margin: "10px 0",
                    }}
                  >
                    <div>
                      <div>
                        <b>Nombre: </b>
                        {activity.description}
                      </div>
                      <div>
                        <b>Costo:</b> ${activity.cost}
                      </div>
                    </div>
                    <button
                      onClick={() => handleEdit(activity.activity_id)}
                      className={classes.editButton}
                    >
                      Editar Costo
                    </button>
                  </div>
                ))}
                <div className={classes.modalFooter}>
                  <button className={classes.cancelButton} onClick={onClose}>
                    Cerrar
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModifyActivityModal;
