import React, { useEffect, useState } from 'react';
import './Instructor.css';
import Clases from "../Components/Clases";
import CalendarioClases from '../Components/CalendarioClases';

const Instructor = () => {
    const [classes, setClasses] = useState([]);
    const [instructorName, setInstructorName] = useState("");

    const actualDate = new Date();
    console.log(actualDate.toDateString())
    const todayClasses = classes.filter(
        (classData) =>
            classData.fecha === actualDate.toISOString().split('T')[0]
    );
    const calendario = [
        { fecha: '2024-11-05', deporte: 'Snow Ski', horario: '10:00 - 12:00' },
        { fecha: '2024-11-06', deporte: 'Snowboard', horario: '14:00 - 16:00' },
        // Agrega más clases con diferentes fechas
    ];

    useEffect(() => {
        // Simulación de datos de ejemplo
        const storedUser = localStorage.getItem("user");
        const user = JSON.parse(storedUser); // Parsear el JSON
        const email = user.email
        const nameFromEmail = email.split('.')[0]; // Toma la parte antes del primer '.'
        setInstructorName(nameFromEmail);
        const exampleClasses = [
            {   
                fecha: '2024-11-14',
                turno: "Lunes 10:00 - 12:00",
                dictada: "Sí",
                deporte: "Snow Ski",
                maxAlumnos: "15",
                cantAlumnos: [
                    { name: "Juan Pérez", email: "juan@example.com" },
                    { name: "Ana López", email: "ana@example.com" }
                ]
            },
            {
                fecha: '2024-11-14',
                turno: "Martes 14:00 - 16:00",
                dictada: "No",
                deporte: "Snowboard",
                maxAlumnos: "10",
                cantAlumnos: [
                    { name: "Carlos Gómez", email: "carlos@example.com" },
                    { name: "Luisa Fernanda", email: "luisa@example.com" }
                ]
            },
            {
                fecha: '2024-11-14',
                turno: "Martes 14:00 - 16:00",
                dictada: "No",
                deporte: "Snowboard",
                maxAlumnos: "10",
                cantAlumnos: [
                    { name: "Carlos Gómez", email: "carlos@example.com" },
                    { name: "Luisa Fernanda", email: "luisa@example.com" }
                ]
            },
            {
                fecha: '2024-11-14',
                turno: "Martes 14:00 - 16:00",
                dictada: "No",
                deporte: "Snowboard",
                maxAlumnos: "10",
                cantAlumnos: [
                    { name: "Carlos Gómez", email: "carlos@example.com" },
                    { name: "Luisa Fernanda", email: "luisa@example.com" }
                ]
            }
        ];

        setClasses(exampleClasses);
    }, []);

    

    return (
        <div className="instructor-dashboard">
            <div className='instructor-dashboard2'>
                <div className='instructor'>
                    <div className="encabezadoInstructor">
                        <p id="inspecciona">Inspecciona tus clases</p>
                        <h1>Bienvenido, {instructorName} </h1>
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
