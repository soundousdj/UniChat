const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
    senderName: String,
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    degree: String,
    speciality: String,
    group: String,
    message: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Announcement || mongoose.model('Announcement', AnnouncementSchema);
