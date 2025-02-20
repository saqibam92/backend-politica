const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const videoRoutes = require('./routes/videoRoutes');
const dbConnect = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
dbConnect()

// API Routes
app.use('/api/videos', videoRoutes);
app.use('/', (req, res) =>{
  res.status(200).send("<h1>Welcome</h1>")
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
