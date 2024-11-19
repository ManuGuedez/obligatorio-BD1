import ApiService from "./apiServices";

const ServiceInstructor = {
    getInstructorClasses: async (token) => {
        try {
            const response = await ApiService.get("/instructor/class-information", token);
            return response; // Devuelve la respuesta del servidor
        } catch (error) {
            console.error("Error obteniendo todos los instructores:", error);
            return { error: "No se pudieron obtener los instructores" };
        }
    },
};

export default ServiceInstructor;