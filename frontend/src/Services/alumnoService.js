import ApiService from "../Services/apiServices"

const alumnoService = {
    getAlumnos: async (token) => {
        console.log("Token being sent:", token);
        
        try {
            const response = await ApiService.get(`students/available-classes`, token);
            console.log("Response from API:", response);
            return response;
        } catch (err) {
            console.error('Error al obtener actividades:', err);
            throw err;
        }
    },
};

export default alumnoService;