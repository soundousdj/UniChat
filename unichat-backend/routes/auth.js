const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { verifyToken } = require('../middleware/auth'); // هذا السطر هو الحل!

// تسجيل مستخدم جديد
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // التحقق من وجود المستخدم مسبقاً
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ error: "User already exists" });

        // تشفير كلمة السر
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: role || 'student' // إذا لم يُحدد، يكون طالباً
        });

        await newUser.save();
        res.status(201).json({ message: "Account created successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// تسجيل الدخول
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // البحث عن المستخدم
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid email or password" });

        // مقارنة كلمة السر المشفرة
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

        // إنشاء التوكن
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET || 'secret_key'
        );
        
        // إرسال البيانات للموبايل
        res.json({ 
            token, 
            role: user.role, 
            username: user.username,
            email: user.email 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// 1. جلب بيانات البروفايل للمستخدم الحالي
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. جلب جميع المستخدمين (لظهورهم في Contacts و Home)
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

module.exports = mongoose.model('Announcement', AnnouncementSchema);

module.exports = router;