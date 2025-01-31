const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    prompt: { type: String, required: true },
    videoUrl: { type: String, required: true },
    audioUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Video', videoSchema);
