const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

dotenv.config();

console.log('Starting server...');
console.log('MONGO_URI exists:', !!process.env.MONGO_URI);
if (process.env.MONGO_URI) {
    console.log('MONGO_URI starts with:', process.env.MONGO_URI.substring(0, 20) + '...');
}

const app = express();

// Middleware
app.use(express.json());

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true
}));

// Security Middleware
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100
});
app.use(limiter);

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/od', require('./routes/odRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/achievements', require('./routes/achievementRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5001;

const ensureAdmin = require('./utils/ensureAdmin');

// Connect to DB and start server
(async () => {
    try {
        await connectDB();

        // Ensure default admin exists
        await ensureAdmin();

        if (require.main === module) {
            app.listen(PORT, () => {
                console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
            });
        }
    } catch (err) {
        console.error('Failed to connect to DB', err);
        process.exit(1);
    }
})();

module.exports = app;
