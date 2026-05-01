const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// استيراد الراوتر المركزي (تأكد من صحة المسار)
const allRoutes = require('./routes/index');

// تفعيل كل الروابط تحت /api
app.use('/api', allRoutes);

const mongoURI = "mongodb+srv://sositasita0_db_user:unichat@cluster0.gh0muwk.mongodb.net/unichat?retryWrites=true&w=majority";

mongoose.connect(mongoURI)
    .then(() => {
        // تشغيل السيرفر على 0.0.0.0 ليراه الهاتف
        app.listen(5000, "0.0.0.0", () => console.log("Server running..."));
    })
    .catch(err => console.log("❌ MongoDB Connection Error:", err));