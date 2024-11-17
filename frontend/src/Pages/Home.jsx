//la idea es que al acceder al home (pagina principal) se verifique si el usuario inició sesión, si no lo hizo se le redirige a la pagina login
//para eso hay que ver un poco la lógica cuando lo tengamos conectado todo con el backend, esto es solo un borrador.

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // verifica si el usuario ha iniciado sesión
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        
        if (!isAuthenticated) {
            // si no está autenticado, redirige al login
            navigate('/LogIn');
        }
    }, [navigate]);

    return (
        <div className="home-container">
            <h1>Bienvenido a Gestor UCU</h1>
            <p>Esta es la página principal, visible solo si has iniciado sesión.</p>
        </div>
    );
};

export default Home;
