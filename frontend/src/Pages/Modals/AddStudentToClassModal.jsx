import React, { useState, useEffect } from 'react';
import ApiService from '../../Services/apiServices';
import './AddStudentToClassModal.css';

const AddStudentToClassModal = ({ isOpen, onClose }) => {
    console.log("ENTRE");
    const [studentId, setStudentId] = useState('');
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const token = localStorage.getItem('token');
    
    useEffect(() => {
        const fetchClasses = async () => {
            const classesResponse = await ApiService.get('class-information', token);
            console.log("ACA!! ",classesResponse);
            if (classesResponse.code === 200) {
                setClasses(classesResponse.data);
            }
        };
        fetchClasses();
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await ApiService.post(
            `classes/${selectedClass}/enroll-student`,
            { student_id: parseInt(studentId) },
            'application/json',
            token
        );

        if (response.code === 200) {
            onClose();
            setStudentId('');
            setSelectedClass('');
        }
    };
    if (!isOpen) return null;


    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Add Student to Class</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                
                <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="studentId">Student ID:</label>
                            <input
                                type="number"
                                id="studentId"
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="classSelect">Select Class:</label>
                            <select 
                                id="classSelect"
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                required
                            >
                                <option value="">Select a class</option>
                                {classes.map((classItem) => (
                                    <option key={classItem.class_id} value={classItem.class_id}>
                                        {classItem.description} - {classItem.instructor_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="modal-footer">
                            <button type="button" onClick={onClose}>Cancel</button>
                            <button type="submit">Add Student</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddStudentToClassModal;
