import React, { useState } from 'react';
import ApiService from '../../Services/apiServices';
import './AddClassModal.css'

const AddClassModal = ({ show, handleClose }) => {
    const [formData, setFormData] = useState({
        instructor_id: '',
        start_date: '',
        end_date: '',
        activity: '',
        turn: '',
        days: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const newClass = {
                instructor_id: parseInt(formData.instructor_id),
                start_date: formData.start_date,
                end_date: formData.end_date,
                activity: formData.activity,
                turn: parseInt(formData.turn),
                days: formData.days.split(',').map(day => day.trim().toLowerCase()),
                type: formData.type || null
            };
    
            const response = await ApiService.post(
                "classes/new-class",
                newClass,
                "application/json",
                localStorage.getItem("token")
            );
    
            if (response.status === 200) {
                handleClose();
                window.location.reload();
            }
        } catch (error) {
            console.error('Error creating class:', error.response?.data?.error || error.message);
        }
    };
    


    return (
        show && (
            <div className='modal-overlay'>
                <div className='modal-container'>
                    <div className='modal-header'>
                        <h2>Agregar Nueva Clase</h2>
                        <button className='close-button' onClick={handleClose}>×</button>
                    </div>
                    <div className='modal-body'>
                        <form onSubmit={handleSubmit}>
                            <div className='form-group'>
                                <label>ID del Instructor:</label>
                                <input
                                    type="text"
                                    name="instructor_id"
                                    value={formData.instructor_id}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className='form-group'>
                                <label>Fecha de Inicio:</label>
                                <input
                                    type="date"
                                    name="start_date"
                                    value={formData.start_date}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className='form-group'>
                                <label>Fecha de Fin:</label>
                                <input
                                    type="date"
                                    name="end_date"
                                    value={formData.end_date}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className='form-group'>
                                <label>Actividad:</label>
                                <select
                                    name="activity"
                                    value={formData.activity}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Seleccione una actividad</option>
                                    <option value="skiing">Ski</option>
                                    <option value="snowboarding">Snowboard</option>
                                </select>
                            </div>
                            <div className='form-group'>
                                <label>Turno:</label>
                                <select
                                    name="turn"
                                    value={formData.turn}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Seleccione un turno</option>
                                    <option value="1">Turno 1</option>
                                    <option value="2">Turno 2</option>
                                    <option value="3">Turno 3</option>
                                </select>
                            </div>

                            <div className='form-group'>
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

                            <div className='modal-footer'>
                                <button type="submit" className='submit-button'>Agregar Clase</button>
                                <button type="button" className='cancel-button' onClick={handleClose}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    );

};



export default AddClassModal