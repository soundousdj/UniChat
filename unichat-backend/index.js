const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());


// --- استيراد الروابط مهم جداً ---
const authRoutes = require('./routes/auth');
const announcementRoutes = require('./routes/announcements');

// --- تفعيل الروابط ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/announcements', require('./routes/announcements'));

mongoose.connect("mongodb+srv://sositasita0_db_user:unichat@cluster0.gh0muwk.mongodb.net/unichat?retryWrites=true&w=majority")
    .then(() => {
        app.listen(5000, "0.0.0.0", () => console.log("Server running on port 5000 ✅"));
    })
    .catch(err => console.log(err));

    