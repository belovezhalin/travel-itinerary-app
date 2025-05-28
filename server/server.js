const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const itineraryRoutes = require('./routes/itineraries');
const cookieParser = require('cookie-parser');

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/itineraries', itineraryRoutes);

app.get('/', (req, res) => {
    res.send('The server is working!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`The server is running on the port ${PORT}`);
});
