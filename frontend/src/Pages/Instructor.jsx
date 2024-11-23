import React, { useEffect, useState } from 'react';
import './Instructor.css';
import Clases from "../Components/Clases";
import CalendarioClases from '../Components/CalendarioClases';
import ServiceInstructor from '../Services/instructorServices';

const Instructor = () => {
    const [classes, setClasses] = useState([]);
    const [infoTodayClasses, setInfoTodayClasses] = useState([]);
    const [error, setError] = useState("");
    /*Traemos datos usuario localStorage*/
    const token = localStorage.getItem("token"); // Recuperar token del localStorage
    const user = JSON.parse(localStorage.getItem("user")); // Recuperar datos del usuario del localStorage
    const [instructorName, setInstructorName] = useState("");

    /*Para actualizar el nombre del instructor*/
    useEffect(() => {
        if (user?.[0]?.first_name) {
            setInstructorName(user[0].first_name);
        } else {
            console.error("No se pudo encontrar el nombre del instructor en los datos del usuario.");
            setInstructorName("Instructor");
        }
    }, [user]);

    //Para cargar las clases del instructor
    useEffect(() => {

        const fetchInstructorData = async () => {
            if (!token || !user) {
                console.error("No token or user found. User must be logged in.");
                setError("Debe iniciar sesión para acceder a esta página.");
                return;
            }

            try {
                const response = await ServiceInstructor.getInstructorClasses(token);
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

    //para cargar las clases de hoy del instructor
    useEffect(() => {
        const fetchTodayClassesInfo = async () => {
            const actualDate = '2024-11-22' //new Date().toISOString().split('T')[0]; // Fecha actual en formato 'YYYY-MM-DD'
            
            const todayClasses = classes.filter(
                (classData) => classData.class_date === actualDate
            );

            const detailedClasses = [];
            for (const classData of todayClasses) {
                try {
                    const classInfoResponse = await ServiceInstructor.getInfoClasses(token, classData.class_id);
                    const studentsResponse = await ServiceInstructor.getClassesStudents(token, classData.class_id);

                    if (classInfoResponse.code === 200) {
                        const studentCount = studentsResponse?.data?.length || 0; // Contar estudiantes
                        detailedClasses.push({
                            ...classData,
                            ...classInfoResponse.data,
                            students: studentsResponse?.data || [], // Agregar lista de estudiantes
                            studentCount, // Agregar la cantidad de estudiantes
                        });
                    }
                } catch (error) {
                    console.error(`Error fetching details for class ${classData.class_id}:`, error);
                }
            }

            setInfoTodayClasses(detailedClasses);
            console.log(detailedClasses);
        };

        if (classes.length > 0) {
            fetchTodayClassesInfo();
        }
    }, [classes, token]);


    return (
        <div className="instructor-dashboard">
            <div className='instructor-dashboard2'>
                <div className='instructor'>
                    <div className="encabezadoInstructor">
                        <p id="inspecciona">Inspecciona tus clases</p>
                        <h1>Bienvenido, {instructorName}</h1>
                    </div>
                    <section className="schedule">
                        <h2>Clases de Hoy</h2>
                        <div className="classes">
                            {infoTodayClasses.length > 0 ? (
                                <ul>
                                    {infoTodayClasses.map((classData, key) => (
                                        <Clases
                                            key={key}
                                            description={classData.description}
                                            start_time={classData.start_time}
                                            end_time={classData.end_time}
                                            class_id={classData.class_id}
                                            studentCount={classData.studentCount} // Pasar la cantidad de estudiantes
                                        />
                                    ))}
                                </ul>
                            ) : (
                                <p id="noClasses">No hay clases agendadas</p>
                            )}
                        </div>

                    </section>
                </div>

                <CalendarioClases classes={classes} />
            </div>
        </div>
    );
};

export default Instructor;
