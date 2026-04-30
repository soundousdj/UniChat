const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');

// جلب كل الإعلانات
router.get('/all', async (req, res) => {
    try {
        const announcements = await Announcement.find().sort({ createdAt: -1 });
        res.json(announcements);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// إضافة إعلان جديد
router.post('/add', async (req, res) => {
    try {
        const newAnn = new Announcement(req.body);
        const saved = await newAnn.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// السطر الأهم: يجب أن يكون هكذا
module.exports = router;