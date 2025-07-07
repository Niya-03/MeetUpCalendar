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
            <h2>How it works?</h2>
            <div className="description">
                <p>If you want to open a clean calendar, you start a new session
                    and click and drag on the days that you are available. <br></br>
                    Then copy the session code and send it to your friends so they can share when they are available too! <br></br>
                    Wherever the calendar is green it means all participants are free. Wherever it isn't - they aren't.
                </p>
            </div>
            <div className="button-container" >
                <button onClick={handleCreate}>
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
