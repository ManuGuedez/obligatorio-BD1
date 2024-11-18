import React, { useState } from 'react';
import ApiService from '../../Services/apiServices';

const RemoveInstructorModal = ({show, handleClose})=> {

    // TANTO ELIMINAR Y MODIFICAR INSTRUCTOR NECESITO OBTENER LA LISTA DE LOS MISMOS

    const [instructors, setInstructors] = useState([]);

    useEffect(() => {
        const fetchInstructors = async () => {
            try {
                const response = await ApiService.get();
                setInstructors(response.data);
            } catch (error) {
                console.error('Error fetching instructors:', error);
            }
        };
        
        if (show) {
            fetchInstructors();
        }
    }, [show]);


}

export default RemoveInstructorModal;