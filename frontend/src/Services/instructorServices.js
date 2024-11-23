import ApiService from "./apiServices";

const ServiceInstructor = {
    getInstructorClasses: async (token) => {
        try {
            const response = await ApiService.get("/instructor/class-calendar", token);

            return response; // Devuelve la respuesta del servidor
        } catch (error) {
            console.error("Error obteniendo todos los instructores:", error);
            return { error: "No se pudieron obtener los instructores" };
        }
    },

    getInfoClasses: async (token, id) => {
        try {
            const response = await ApiService.get(`/classes/${id}/infromation`, token)
            console.log(response)
            return response;
        } catch (error) {
            console.error("Error obteniendo la informacion de la clase:", error);
            return { error: "No se pudo obtener la informacion de la clase" };
        }
    },

    getClassesStudents: async (token, classId) => {
        try {
            if (!classId) {
                throw new Error("El class_id no está definido.");
            }
            const response = await ApiService.get(`/classes/${classId}/enrolled-students`, token);
            return response;
        } catch (error) {
            console.error("Error obteniendo la lista de la clase:", error);
            return { error: "No se pudo obtener la lista de la clase" };
        }
    },
    
    passAttendanceList: async (token, classId, studentsPresent) => {
        try {
            if (!classId || !studentsPresent) {
                throw new Error("El ID de la clase o la lista de asistencia no están definidos.");
            }

            const response = await ApiService.post(
                `/classes/${classId}/roll-call`, // Endpoint del backend
                { students_present: studentsPresent }, // Formato requerido por el backend
                "application/json",
                token
            );

            return response; // Devuelve la respuesta del servidor
        } catch (error) {
            console.error("Error pasando la lista de asistencia:", error);
            return { error: "No se pudo pasar la lista de asistencia" };
        }
    }
    
};

export default ServiceInstructor;