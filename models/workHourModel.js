const mongoose = require('mongoose');

const workHourSchema = new mongoose.Schema({
  scheduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Schedule', required: true },
  availSlot: { type: String, required: true },
  isAvail: { type: Boolean, default: true }
});

const WorkHour = mongoose.model('WorkHour', workHourSchema);

module.exports = WorkHour;