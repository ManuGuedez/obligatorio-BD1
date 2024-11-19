import ApiService from "../Services/apiServices"

const alumnoService = {
    getAlumnos: async (ci, token) => {
        console.log("Token being sent:", token);
        console.log("CI being sent:", ci);
        
        try {
            const response = await ApiService.get(`students/${ci}/available-classes`, token);
            return response;
        } catch (err) {
            console.error('Error al obtener actividades:', err);
            throw err;
        }
    },
};

export default alumnoService;
