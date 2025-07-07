import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useParams } from "react-router-dom";
import './CalendarPage.css';
import "@fullcalendar/common/main.min.css";
import "@fullcalendar/daygrid";

function CalendarPage() {
    const { sessionId } = useParams();
    const [events, setEvents] = useState([]);
    const [userName, setUserName] = useState("");
    const [backgroundEvents, setBackgroundEvents] = useState([]);

    useEffect(() => {
        async function fetchBackgrounds() {
            try {
                const response = await fetch(`http://localhost:5000/api/sessions/${sessionId}/availability`);
                const data = await response.json();
                console.log(data);

                setBackgroundEvents(data);
            } catch (error) {
                console.error("Failed to load availability data:", error);
            }
        }

        if (sessionId) {
            fetchBackgrounds();
        }
    }, [sessionId]);


    useEffect(() => {
        const name = prompt("Please enter your name:");
        if (name) {
            setUserName(name);
        }

        fetch(`http://localhost:5000/api/sessions/${sessionId}/events`)
            .then(res => res.json())
            .then(data => setEvents(data))
            .catch(err => console.error('Error loading events:', err));
    }, [sessionId]);

    const handleSelect = (selectInfo) => {
        let title = userName;
        let calendarApi = selectInfo.view.calendar;

        calendarApi.unselect();

        const newEvent = {
            userName,
            title,
            start: selectInfo.startStr,
            end: selectInfo.endStr,
            allDay: selectInfo.allDay,
        };


        setEvents(prev => Array.isArray(prev) ? [...prev, newEvent] : [newEvent]);


        fetch(`http://localhost:5000/api/sessions/${sessionId}/events`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newEvent),
        }).catch(err => {
            console.error('Failed to save event', err);

        });
    };

    const handleDateClick = (selectInfo) => {
        if (!userName) return;

        const date = selectInfo.startStr;

        const startTime = prompt("Start time (24h format, e.g. 13:00):");
        const endTime = prompt("End time (24h format, e.g. 15:00):");

        if (!startTime || !endTime) return;

        const startDateTime = `${date}T${startTime}:00`;
        const endDateTime = `${date}T${endTime}:00`;

        setEvents((prev) => [
            ...prev,
            {
                id: String(Date.now()),
                title: `${userName} (${startTime} - ${endTime})`,
                start: startDateTime,
                end: endDateTime,
                allDay: false,
                extendedProps: {
                    user: userName,
                },
            },
        ]);
    };

    console.log("events:", events);
    console.log("backgroundEvents:", backgroundEvents);

    let allEvents = [];

    if (events.length > 0) {
        for (const element of events) {
            allEvents.push(element);
        }
    }


    if (backgroundEvents.length > 0) {
        for (const element of backgroundEvents) {
            allEvents.push(element);
        }
    }


    console.log(allEvents)

    return (
        <div className="calendar-page">
            <h1>My Availability</h1>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <div style={{ width: "60%", maxWidth: "1200px" }}>
                    <div className="calendar-wrapper">
                        <FullCalendar
                            plugins={[dayGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            selectable={true}
                            select={handleSelect}
                            dateClick={handleDateClick}
                            events={allEvents}
                            allDaySlot={false}
                            height={600}
                            firstDay={1}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CalendarPage;
