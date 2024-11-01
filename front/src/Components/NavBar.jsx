import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleLogout = () => {
        console.log("Cerrando sesión...");
        setMenuOpen(false);
        navigate('/LogIn'); // Redirige a la página de inicio de sesión
    };

    return (
        <nav className="navbar">
            <div className="navbar-center">
                <h1 className="app-title">Ucu Snowschool</h1>
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/6/63/UCU.png"
                    alt="Logo UCU"
                    className="ucu-logo"
                />
            </div>
            <div className="menu-icon" onClick={toggleMenu}>
                &#x22EE; {/* Tres puntos verticales */}
            </div>
            {menuOpen && (
                <div className="dropdown-menu">
                    <button onClick={handleLogout} className="logout-btn">Cerrar Sesión</button>
                </div>
            )}
        </nav>
    );
};

export default NavBar;
