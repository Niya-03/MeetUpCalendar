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

app.post('/api/sessions/:sessionId/events', async (req, res) => {
  const { sessionId } = req.params;
  const { userName, start, end, allDay } = req.body;

  try {
    let session = await Session.findOne({ sessionId });

    if (!session) {
      session = new Session({ sessionId, events: [] });
    }

    session.events.push({ userName, start, end, allDay });
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


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
