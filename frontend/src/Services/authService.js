import ApiService from "./apiServices";

const AuthService = {
    register: async (formData) => {
        const creds = {
            rol: formData.rol, // Convertir el rol a minúsculas para coincidir con el backend
            ci: formData.ci,
            first_name: formData.name,
            last_name: formData.lastname,
            email: formData.email,
            password: formData.password,
            birth_date: formData.birthday // Solo requerido para estudiantes

        };

        const registeredUser = await ApiService.post( // Cambiado a 'registeredUser'
            "/register",
            creds,
            "application/json"
        );

        return registeredUser;
    },

    login: async (email, passwd) => {
        const creds = {
            email: email,
            password: passwd,
        };

        const loggedInUser = await ApiService.post( // Cambiado a 'loggedInUser'
            "/login",
            creds,
            "application/json"
        );
        return loggedInUser;
    }
};

export default AuthService;