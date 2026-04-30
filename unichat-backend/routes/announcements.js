const router = require('express').Router();
const Announcement = require('../models/Announcement');

// حفظ إعلان جديد
router.post('/add', async (req, res) => {
    try {
        const newAnn = new Announcement(req.body);
        await newAnn.save();
        res.status(201).json(newAnn);
    } catch (err) {
        res.status(500).json(err);
    }
});

// جلب جميع الإعلانات
router.get('/all', async (req, res) => {
    try {
        const ann = await Announcement.find().sort({ createdAt: -1 });
        res.json(ann);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;