const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  title: {type: String, required: true},
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  allDay: { type: Boolean, default: false },
});

const sessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  events: [eventSchema],
  createdAt: { type: Date, default: Date.now, expires: '30d' } 
});

module.exports = mongoose.model('Session', sessionSchema);
