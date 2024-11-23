import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import "./CalendarioClases.css"
import 'react-calendar/dist/Calendar.css';

const CalendarioClases = ({ classes }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Manejar el cambio de fecha en el calendario
    const onDateChange = (date) => {
        setSelectedDate(date);
    };

    // Filtrar clases según la fecha seleccionada
    const classesForSelectedDate = classes.filter(
        (classData) =>
            classData.class_date === selectedDate.toISOString().split('T')[0] // Compara solo la parte 'YYYY-MM-DD'
    );

    return (
        <div>
            <Calendar onChange={onDateChange} value={selectedDate} />
            <div className="class-list">
                <h2>Clases para el {selectedDate.toDateString()}</h2>
                {classesForSelectedDate.length > 0 ? (
                    <ul>
                        {classesForSelectedDate.map((classData, index) => (
                            <li key={index}>
                                <strong>Deporte:</strong> {classData.description} <br />
                                <strong>Desde:</strong> {classData.start_time}<br />
                                <strong>Hasta:</strong> {classData.end_time}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No hay clases agendadas para esta fecha.</p>
                )}
            </div>
        </div>
    );
};

export default CalendarioClases;
