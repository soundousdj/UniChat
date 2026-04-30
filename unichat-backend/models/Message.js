const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // للمحادثات الفردية
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' }, // للمجموعات
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', MessageSchema); // تأكد من كلمة module.exports