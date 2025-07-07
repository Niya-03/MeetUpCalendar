require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("Mongo error:", err));


const Session = require('./models/Session');

function calculateAvailability(events) {
  const uniqueUsers = [...new Set(events.map(e => e.userName))];
  const totalUsers = uniqueUsers.length;

  const dayMap = {};

  events.forEach(event => {
  const { userName, start, end } = event;

  const startDate = new Date(start) + 1;
  const endDate = new Date(end);

  
  let current = new Date(startDate);
  current.setHours(0, 0, 0, 0);

  const endDay = new Date(endDate);
  endDay.setHours(0, 0, 0, 0); 

  while (current < endDay) {
    current.setDate(current.getDate() + 1);
    const dateStr = current.toISOString().split("T")[0];
    if (!dayMap[dateStr]) dayMap[dateStr] = new Set();
    dayMap[dateStr].add(userName);
    
  }
});

  const result = [];

  for (const [dateStr, usersAvailable] of Object.entries(dayMap)) {
    const percent = (usersAvailable.size / totalUsers) * 100;

    let color = "red";
    if (percent === 100) color = "green";
    else if (percent >= 75) color = "lightgreen";
    else if (percent >= 50) color = "yellow";
    else if (percent >= 25) color = "orange";

    result.push({
      start: `${dateStr}T00:00:00`,
      end: `${dateStr}T23:59:59`,
      color,
      display: "background",
      allDay: true
    });
  }

  return result;
}




app.post('/api/sessions/:sessionId/events', async (req, res) => {
  const { sessionId } = req.params;
  const { userName, title, start, end, allDay } = req.body;

  try {
    let session = await Session.findOne({ sessionId });

    if (!session) {
      session = new Session({ sessionId, events: [] });
    }

    session.events.push({ userName, title, start, end, allDay });
    await session.save();

    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/sessions/:sessionId/events', async (req, res) => {
  try {
    const session = await Session.findOne({ sessionId: req.params.sessionId });
    if (!session) return res.status(404).json({ error: 'Session not found' });

    res.json(session.events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/sessions/:sessionId/availability', async (req, res) => {
  try {
    const session = await Session.findOne({ sessionId: req.params.sessionId });
    if (!session) return res.status(404).json({ error: 'Session not found' });

    const availabilitySlots = calculateAvailability(session.events);

    res.json(availabilitySlots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
