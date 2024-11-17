import ApiService from "./apiServices";

const AuthService = {
    register: async (username, email, passwd) => {
        const creds = {
            username: username,
            email: email,
            password: passwd,
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