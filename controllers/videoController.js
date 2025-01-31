const axios = require('axios');
const fs = require('fs');
const path = require('path');
const Video = require('../models/videoModel');
require('dotenv').config();

// OpenAI API Key
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Generate Voice-over using OpenAI’s Text-to-Speech API
const generateAudio = async (text) => {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/audio/speech',
            {
                model: "tts-1",
                input: text,
                voice: "alloy"
            },
            {
                headers: {
                    "Authorization": `Bearer ${OPENAI_API_KEY}`,
                    "Content-Type": "application/json"
                },
                responseType: 'arraybuffer'
            }
        );

        // Save audio file locally
        const audioPath = `../uploads/audio_${Date.now()}.mp3`;
        fs.writeFileSync(audioPath, response.data);

        return audioPath;
    } catch (error) {
        console.error('Error generating audio:', error);
        return null;
    }
};

// Generate Video using RunwayML API
const generateVideo = async (text) => {
    try {
        const response = await axios.post(
            'https://api.runwayml.com/v1/text-to-video',
            { prompt: text },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.RUNWAYML_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data.video_url; // Get generated video URL
    } catch (error) {
        console.error('Error generating video:', error);
        return null;
    }
};

// Controller to handle video generation
exports.createVideo = async (req, res) => {
    try {
        const { prompt } = req.body;

        // Generate AI voice-over
        const audioPath = await generateAudio(prompt);
        if (!audioPath) return res.status(500).json({ error: "Audio generation failed" });

        // Generate AI video
        const videoUrl = await generateVideo(prompt);
        if (!videoUrl) return res.status(500).json({ error: "Video generation failed" });

        // Save data in MongoDB
        const newVideo = await Video.create({ prompt, videoUrl, audioUrl: audioPath });

        res.status(201).json({ message: "Video created", video: newVideo });
    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
};
