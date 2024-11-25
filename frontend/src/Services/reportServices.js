import ApiService from "./apiServices";

const reportServices = {
    getMostStudents: async (token) => {
        try {
            const response = await ApiService.get("/report/most_students", token);
            console.log(response)
            return response; // Devuelve la respuesta del servidor
        } catch (error) {
            console.error("Error obteniendo el reporte de actividad más popular:", error);
            return { error: "No se pudo obtener el reporte de actividad más popular" };
        }
    },

    getMostClasses: async (token) => {
        try {
            const response = await ApiService.get("/report/most_classes", token);
            return response; // Devuelve la respuesta del servidor
        } catch (error) {
            console.error("Error obteniendo el reporte de turno con más clases dictadas:", error);
            return { error: "No se pudo obtener el reporte de turno con más clases dictadas" };
        }
    },

    getHighestIncome: async (token) => {
        try {
            const response = await ApiService.get("/report/income", token);
            return response; // Devuelve la respuesta del servidor
        } catch (error) {
            console.error("Error obteniendo el reporte de actividad con más ingresos:", error);
            return { error: "No se pudo obtener el reporte de actividad con más ingresos" };
        }
    },
};

export default reportServices;
