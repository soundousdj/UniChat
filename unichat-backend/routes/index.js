// أضف هذه الأسطر مع الـ imports الأخرى
const messageRoutes = require('./messages');
const groupRoutes = require('./groups');

// أضف هذه الأسطر مع الـ app.use الأخرى (أو حسب نظام الـ router عندك)
router.use('/messages', messageRoutes);
router.use('/groups', groupRoutes);