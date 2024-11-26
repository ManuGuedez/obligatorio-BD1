import React, { useEffect, useState } from "react";
import ApiService from "../../../Services/apiServices";
import classes from "./ModifyClassModal.module.css";

const EditClassForm = ({ classData, onBack, editType }) => {
    const [newInstructor, setNewInstructor] = useState("");
    const [newTurn, setNewTurn] = useState("");
    const [instructors, setInstructors] = useState([]);
    const [turns, setTurns] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (editType === 'instructor') {
                    const instructorsResponse = await ApiService.get("instructors", token);
                    if (instructorsResponse.code === 200) {
                        setInstructors(instructorsResponse.data);
                    }
                } else if (editType === 'turn') {
                    const turnsResponse = await ApiService.get("turns", token);
                    if (turnsResponse.code === 200) {
                        setTurns(turnsResponse.data);
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [editType]);

    const handleSaveChanges = async () => {
        try {
            const updatedFields = {};
            if (editType === 'instructor' && newInstructor) {
                updatedFields.instructor_id = parseInt(newInstructor);
            }
            if (editType === 'turn' && newTurn) {
                updatedFields.turn_id = newTurn;
            }

            const response = await ApiService.patch(
                `classes/${classData.class_id}/modify-class`,
                updatedFields,
                token
            );

            if (response.code === 200) {
                onBack();
            }
        } catch (error) {
            console.log("Error updating class:", error);
        }
    };

    return (
        <div className={classes.editForm}>
            <h3>Editar {editType === 'instructor' ? 'Instructor' : 'Turno'}</h3>

            {editType === 'instructor' && (
                <div>
                    <label>Seleccione un instructor:</label>
                    <select value={newInstructor} onChange={(e) => setNewInstructor(e.target.value)}>
                        <option value="">Actual: {classData.instructor_first_name} {classData.instructor_last_name}</option>
                        {instructors?.map((instructor) => (
                            <option key={instructor.instructor_id} value={instructor.instructor_id}>
                                {`${instructor.first_name} ${instructor.last_name}`}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {editType === 'turn' && (
                <div>
                    <label>Turno:</label>
                    <select value={newTurn} onChange={(e) => setNewTurn(e.target.value)}>
                        <option value="">Actual: {`${classData.start_time} - ${classData.end_time}`}</option>
                        {turns?.map((turn) => (
                            <option key={turn.turn_id} value={turn.turn_id}>
                                {`${turn.start_time} - ${turn.end_time}`}
                            </option>
                        ))}
                    </select>
                </div>
            )}
            <div>
                <div className={classes.modalFooter}>
                    <button onClick={onBack} className={classes.cancelButton}>Cancelar</button>
                    <button onClick={handleSaveChanges} className={classes.submitButton}>Guardar</button>
                </div>

            </div>
        </div>
    );
};

export default EditClassForm;

