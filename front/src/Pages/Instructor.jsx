import React, { useEffect, useState } from 'react';
import './Instructor.css';
import Clases from "./../Components/Clases";
import CalendarioClases from './../Components/CalendarioClases';

const Instructor = () => {
    const [classes, setClasses] = useState([]);

    const calendario = [
        { fecha: '2024-11-05', deporte: 'Snow Ski', horario: '10:00 - 12:00' },
        { fecha: '2024-11-06', deporte: 'Snowboard', horario: '14:00 - 16:00' },
        // Agrega más clases con diferentes fechas
    ];

    useEffect(() => {
        // Simulación de datos de ejemplo

        const exampleClasses = [
            {
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
                <div>
                    <div className="encabezadoInstructor">
                        <p id="inspecciona">Inspecciona tus clases</p>
                        <h1>Bienvenido, Donal Trump</h1>
                    </div>
                    <section className="schedule">
                        <h2>Clases de Hoy</h2>
                        <ul>
                            {classes.map((classData, key) => (
                                <Clases
                                    key={key}
                                    turno={classData.turno}
                                    dictada={classData.dictada}
                                    deporte={classData.deporte}
                                    maxAlumnos={classData.maxAlumnos}
                                    alumnos={classData.cantAlumnos}
                                />
                            ))}
                        </ul>
                    </section>
                </div>

                <CalendarioClases classes={calendario} />
            </div>
        </div>
    );
};

export default Instructor;
