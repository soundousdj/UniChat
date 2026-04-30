const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = decoded; // يحتوي على id و role
        next();
    } catch (e) {
        res.status(400).json({ msg: "Token is not valid" });
    }
};

const teacherOnly = (req, res, next) => {
    if (req.user.role !== 'teacher') {
        return res.status(403).json({ msg: "Access denied. Teachers only." });
    }
    next();
};

module.exports = { protect, teacherOnly };