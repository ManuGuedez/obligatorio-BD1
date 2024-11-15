import origin_url from "./origin";

const default_url = `${origin_url}/api`;

const ApiService = {
    get: async (resource, token) => {
        const request = {
            headers: {
                "Authorization": `Bearer: ${token}`,
                // Para los GET que no   token, como el login, no pasa nada si mandamos un undefined
            },
        };

        const api_response = await fetch(`${default_url}/${resource}`, request);

        console.log(`POST: ${api_response.status}, ${api_response.statusText}`);

        const response = { code: api_response.status, data: null };

        if (api_response.ok)
            response.data = await api_response.json();

        return response;
    },

    post: async (resource, data, content_type, token) => {
        const request = {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Authorization": `Bearer: ${token}`,
                "Content-Type": `${content_type}`,
            },
        };

        const api_response = await fetch(`${default_url}/${resource}`, request);

        console.log(`POST: ${api_response.status}, ${api_response.statusText}`);

        const response = { code: api_response.status, data: null };

        if (api_response.ok)
            response.data = await api_response.json();

        return response;
    },

    delete: async (resource, token) => {
        const request = {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer: ${token}`,
            },
        };

        const api_response = await fetch(`${default_url}/${resource}`, request);

        console.log(`DELETE: ${api_response.status}, ${api_response.statusText}`);

        const response = { code: api_response.status, data: null };

        if (api_response.ok)
            response.data = await api_response.json();

        return response;
    },
    
    put: async (resource, data, token) => {
        const request = {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
                "Authorization": `Bearer: ${token}`,
                "Content-Type": "application/json",
            },
        };

        const api_response = await fetch(`${default_url}/${resource}`, request);

        console.log(`PUT: ${api_response.status}, ${api_response.statusText}`);

        const response = { code: api_response.status, data: null };

        if (api_response.ok)
            response.data = await api_response.json();

        return response;
    },

};

export default ApiService;
