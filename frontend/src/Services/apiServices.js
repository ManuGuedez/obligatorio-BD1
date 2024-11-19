import origin_url from "./origin";

const default_url = `${origin_url}`;
console.log("URL de API:", default_url);
const ApiService = {
    get: async (resource, token) => {
        const request = {
            headers: {
                "Authorization": `Bearer ${token}`,
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
                "Authorization": `Bearer ${token}`,
                "Content-Type": `${content_type}`,
            },
        };
    
        const api_response = await fetch(`${default_url}/${resource}`, request);
        console.log('Request:', request);
        console.log('Request body:', data);
    
        const response = { code: api_response.status, data: null };
        
        // Get the response body regardless of status
        const responseBody = await api_response.json();
        console.log('Response body:', responseBody);
        
        response.data = responseBody;
        return response;
    },
    

    delete: async (resource, token) => {
        const request = {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        };
        console.log('Request payload:', JSON.stringify(newInstructor, null, 2));

        const api_response = await fetch(`${default_url}/${resource}`, request);

        const errorBody = await api_response.json();
        console.log('Error details:', errorBody);


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
                "Authorization": `Bearer ${token}`,
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