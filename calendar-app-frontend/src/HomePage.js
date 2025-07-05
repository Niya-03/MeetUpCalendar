import React from "react";
import { useNavigate } from "react-router-dom";
import './HomePage.css'

function generateSessionKey() {
    return Math.random().toString(36).substr(2, 6).toUpperCase(); // 6-char code
}

function HomePage() {
    const navigate = useNavigate();

    const handleCreate = () => {
        const sessionKey = generateSessionKey();
        navigate(`/calendar/${sessionKey}`);
    };

    const handleJoin = () => {
        const input = prompt("Enter session key:");
        if (input) {
            navigate(`/calendar/${input.toUpperCase()}`);
        }
    };

    return (
        <div className="home-page">
            <h1>Welcome to Meet Helper!</h1>
            <div className="button-container" >
                <button  onClick={handleCreate}>
                    Create New Session
                </button>
                <button onClick={handleJoin}>
                    Join Existing Session
                </button>
            </div>
        </div>
    );
}

export default HomePage;
