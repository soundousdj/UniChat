const jwt = require('jsonwebtoken');

// للتحقق من أن الشخص مسجل دخول أصلاً
const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: "غير مصرح لك، لا يوجد توكن" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "التوكن غير صالح" });
    }
};

// للتحقق من أن الشخص أستاذ (Teacher)
const teacherOnly = (req, res, next) => {
    if (req.user && req.user.role === 'teacher') {
        next();
    } else {
        res.status(403).json({ message: "هذا القسم مخصص للأساتذة فقط" });
    }
};

module.exports = { protect, teacherOnly };