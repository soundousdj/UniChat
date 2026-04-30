const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// إرسال رسالة
router.post('/send', async (req, res) => {
  try {
    const newMessage = new Message(req.body);
    const savedMsg = await newMessage.save();
    res.status(200).json(savedMsg);
  } catch (err) {
    res.status(500).json(err);
  }
});

// جلب الرسائل بين شخصين
router.get('/:senderId/:recipientId', async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.params.senderId, recipient: req.params.recipientId },
        { sender: req.params.recipientId, recipient: req.params.senderId }
      ]
    }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;