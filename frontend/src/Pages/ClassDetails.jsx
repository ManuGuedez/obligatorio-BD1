import React, { useState, useEffect } from "react";
import NavBar from "../Components/NavBar";
import Lista from "./Lista";
import { useParams, useNavigate } from "react-router-dom";
import ServiceInstructor from "../Services/instructorServices";
import { ClipLoader } from "react-spinners";

export default function ClassDetails() {
  const { classId } = useParams(); // Obtener el ID de la clase desde la URL
  const [classData, setClassData] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getInfo = async () => {
      const token = localStorage.getItem("token");
      setLoading(true);
      const classInfoResponse = await ServiceInstructor.getInfoClasses(
        token,
        classId
      );
      setLoading(false);
      if (classInfoResponse.code === 200) {
        setClassData(classInfoResponse.data);
      } else {
        console.error(
          "Error al obtener la información de la clase:",
          classInfoResponse.data
        );
      }
    };
    getInfo();
  }, []);

  const handleGoBaack = () => {
    navigate(-1);
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <NavBar />
      <button
        style={{ width: "100px", height: "50px" }}
        onClick={handleGoBaack}
      >
        volver
      </button>
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
      <h1>Actividad: {classData?.description}</h1>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Lista classId={classId} />
      </div>
    </div>
  );
}
