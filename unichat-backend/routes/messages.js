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

// 1. إرسال رسالة فردية (حفظ في MongoDB)
router.post('/send', async (req, res) => {
  try {
    const newMessage = new Message({
      sender: req.body.sender,
      recipient: req.body.recipient,
      text: req.body.text
    });
    const savedMsg = await newMessage.save();
    res.status(200).json(savedMsg);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 2. جلب تاريخ المحادثة بين شخصين (للعرض الدائم)
router.get('/:userId/:recipientId', async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.params.userId, recipient: req.params.recipientId },
        { sender: req.params.recipientId, recipient: req.params.userId }
      ]
    }).sort({ createdAt: 1 }); // ترتيب من الأقدم للأحدث
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
