import ApiService from "../Services/apiServices";

const alumnoService = {
    getAlumnos: async (token) => {
        try {
            const response = await ApiService.get(`students/available-classes`, token);
            return response;
        } catch (err) {
            console.error('Error al obtener actividades:', err);
            throw err;
        }
    },
    getStudentClasses: async (token) => {
        try {
            const response = await ApiService.get(`student/class-information`, token);
            console.log(response);
            return response;
        } catch (err) {
            console.error('Error al obtener clases:', err);
            throw err;
        }
    },
    enrollStudent: async (classId, studentId, token) => {
        try {
            const body = { student_id: studentId };
            const response = await ApiService.post(`classes/${classId}/enroll-student`, body, "application/json", token);
            return response;
        } catch (err) {
            console.error("Error al inscribir al estudiante:", err);
            throw err;
        }
    },    
};

export default alumnoService;
