const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    date: { type: String, required: true }
});

// scheduleSchema.pre('save', function (next) {
//     if (this.date < new Date()) {
//         this.remove();
//     } else {
//         next();
//     }
// });

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;