import React from 'react';
import Register from './Components/Register';
import './App.css';

const App = () => {
    return (
        <div className="app-container">
            <h1 className="app-title">Gestor UCU</h1>
            <Register />
        </div>
    );
};

export default App;