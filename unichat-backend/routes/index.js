const express = require('express');
const router = express.Router();

// استيراد الروابط الفرعية من نفس المجلد
const authRoutes = require('./auth');
const announcementRoutes = require('./announcements');
const messageRoutes = require('./messages');
const groupRoutes = require('./groups');

// ربط المسارات بالراوتر
router.use('/auth', authRoutes);
router.use('/announcements', announcementRoutes);
router.use('/messages', messageRoutes);
router.use('/groups', groupRoutes);

module.exports = router;