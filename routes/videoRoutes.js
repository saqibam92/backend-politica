const express = require('express');
const { createVideo } = require('../controllers/videoController');

const router = express.Router();

router.post('/generate', createVideo); // Route to generate video

module.exports = router;
