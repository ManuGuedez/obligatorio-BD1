import ApiService from "./apiServices";

const ServiceInstructor = {
    getAllInstructors: async (token) => {
        try {
            const response = await ApiService.get("/instructor", token);
            return response; // Devuelve la respuesta del servidor
        } catch (error) {
            console.error("Error obteniendo todos los instructores:", error);
            return { error: "No se pudieron obtener los instructores" };
        }
    },
};

export default ServiceInstructor;