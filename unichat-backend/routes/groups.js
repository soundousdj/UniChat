const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// جلب رسائل مجموعة معينة من MongoDB
router.get('/:groupId/messages', async (req, res) => {
  try {
    const messages = await Message.find({ groupId: req.params.groupId }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

// إرسال رسالة داخل مجموعة
router.post('/:groupId/send', async (req, res) => {
  try {
    const newMessage = new Message({
      sender: req.body.sender,
      groupId: req.params.groupId,
      text: req.body.text
    });
    const savedMsg = await newMessage.save();
    res.status(200).json(savedMsg);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;