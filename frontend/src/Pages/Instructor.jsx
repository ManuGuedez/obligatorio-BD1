import React, { useEffect, useState } from 'react';
import './Instructor.css';
import Clases from "../Components/Clases";
import CalendarioClases from '../Components/CalendarioClases';
import ServiceInstructor from '../Services/instructorServices';

const Instructor = () => {
    const [classes, setClasses] = useState([]);
    const [instructorName, setInstructorName] = useState("");
    const token = localStorage.getItem("token"); // Recuperar token del localStorage
    const [error, setError] = useState("")
    const user = JSON.parse(localStorage.getItem("user")); // Recuperar datos del usuario del localStorage

    const calendario = [
        { fecha: '2024-11-05', deporte: 'Snow Ski', horario: '10:00 - 12:00' },
        { fecha: '2024-11-06', deporte: 'Snowboard', horario: '14:00 - 16:00' },
        // Agrega más clases con diferentes fechas
    ];

    const actualDate = new Date();
    const todayClasses = classes.filter(
        (classData) =>
            classData.fecha === actualDate.toISOString().split('T')[0]
    );

    useEffect(() => {
        const fetchInstructorData = async () => {
            if (!token || !user) {
                console.error("No token or user found. User must be logged in.");
                setError("Debe iniciar sesión para acceder a esta página.");
                return;
            }

            // Establece el nombre del instructor usando los datos del usuario
            setInstructorName(user.first_name);

            try {
                const response = await ServiceInstructor.getInstructorClasses(token);
                console.log(response)
                if (response.code === 200) {
                    setClasses(response.data); // Asigna las clases obtenidas al estado
                } else {
                    setError(response.data?.error || "Error al obtener las clases.");
                }
            } catch (error) {
                setError("Ocurrió un error al obtener las clases.");
                console.error(error);
            }
        };

        fetchInstructorData();
    }, []);

    return (
        <div className="instructor-dashboard">
            <div className='instructor-dashboard2'>
                <div className='instructor'>
                    <div className="encabezadoInstructor">
                        <p id="inspecciona">Inspecciona tus clases</p>
                        <h1>Bienvenido,  {instructorName}</h1>
                    </div>
                    <section className="schedule">
                        <h2>Clases de Hoy</h2>
                        <div className="classes">
                            {todayClasses.length > 0 ? (
                                <ul>
                                    {todayClasses.map((classData, key) => (
                                        <Clases
                                            key={key}
                                            turno={classData.turno}
                                            dictada={classData.dictada}
                                            deporte={classData.deporte}
                                            maxAlumnos={classData.maxAlumnos}
                                            alumnos={classData.cantAlumnos}
                                            fecha={classData.fecha}
                                        />
                                    ))}
                                </ul>
                            ) : (<p id="noClasses">No hay clases agendadas</p>)}
                        </div>
                    </section>
                </div>

                <CalendarioClases classes={calendario} />
            </div>
        </div>
    );
};

export default Instructor;
