import ApiService from "./apiServices";

const authService = {
    register: async (user, email, passwd) => {
        const creds = {
            username: username,
            email: email,
            password: passwd,
        };

        const user = await ApiService.post(
            "auth/register",
            creds,
            "application/json"
        );
        return user;
    },

    login: async (email, passwd) => {
        const creds = {
            email: email,
            password: passwd,
        };

        const user = await ApiService.post(
            "auth/login",
            creds, 
            "application/json"
        );

        return user;
    }
}