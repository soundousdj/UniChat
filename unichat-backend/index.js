const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// استيراد الروابط
const authRoutes = require('./routes/auth');
const announcementRoutes = require('./routes/announcements');

// تفعيل الروابط - تأكد من هذه المسارات
app.use('/api/auth', authRoutes);
app.use('/api/announcements', announcementRoutes);

const mongoURI = "mongodb+srv://sositasita0_db_user:unichat@cluster0.gh0muwk.mongodb.net/unichat?retryWrites=true&w=majority";

mongoose.connect(mongoURI)
    .then(() => {
        // الالتزام بـ 0.0.0.0 ضروري ليراه الموبايل
        app.listen(5000, "0.0.0.0", () => console.log("Server running on port 5000 ✅"));
    })
    .catch(err => console.log(err));