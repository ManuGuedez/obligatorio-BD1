import React, { useEffect, useState } from "react";
import ApiService from "../../../Services/apiServices";
import { ClipLoader } from "react-spinners";
import classes from "./ShowActivitiesModal.module.css";

const ShowActivitiesModal = ({ onClose }) => {
  const [activities, setActivities] = useState([]);
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTurns = async () => {
      try {
        setLoading(true);
        const response = await ApiService.get("activities", token);
        setLoading(false);
        if (response.code === 200) {
          setActivities(response.data);
        }
      } catch (error) {
        console.error("Error fetching turns:", error);
      }
    };

    fetchTurns();
  }, []);

  return (
    <div className={classes.modalOverlay} onClick={onClose}>
      <div
        className={classes.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={classes.modalHeader}>
          <h2>Actividades</h2>
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
        <div className={classes.activitiesContainer}>
          {activities.map((activity, index) => {
            return <ActivityCard key={index} activity={activity} />;
          })}
        </div>
      </div>
    </div>
  );
};

const ActivityCard = ({ activity }) => {
  return (
    <div className={classes.activityCard}>
      <p>
        <b>{activity.description}</b>
      </p>
      <p>Costo: ${activity.cost}</p>
    </div>
  );
};

export default ShowActivitiesModal;
