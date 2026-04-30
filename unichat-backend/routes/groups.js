const express = require('express');
const router = express.Router();
const Group = require('../models/Group');

router.get('/all', async (req, res) => {
  try {
    const groups = await Group.find();
    res.status(200).json(groups);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;