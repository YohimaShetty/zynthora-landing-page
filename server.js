const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

// CORS configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST'],
}));

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: '1d', // Cache static assets for 1 day
    etag: true,
}));

// API Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
    });
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, company, message } = req.body;

        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                error: 'Name, email, and message are required',
            });
        }

        // Email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email format',
            });
        }

        // In production, you would send email here
        // For demo purposes, we'll just log it
        console.log('Contact form submission:', {
            name,
            email,
            company: company || 'Not provided',
            message,
            timestamp: new Date().toISOString(),
        });

        // Simulate email sending
        if (process.env.EMAIL_ENABLED === 'true') {
            await sendEmail({ name, email, company, message });
        }

        res.status(200).json({
            success: true,
            message: 'Thank you for contacting us! We will get back to you soon.',
        });
    } catch (error) {
        console.error('Error processing contact form:', error);
        res.status(500).json({
            success: false,
            error: 'An error occurred processing your request',
        });
    }
});

// Analytics endpoint (track page views)
app.post('/api/analytics/pageview', (req, res) => {
    const { page, referrer, userAgent } = req.body;
    
    console.log('Page view tracked:', {
        page: page || '/',
        referrer: referrer || 'direct',
        userAgent: userAgent || 'unknown',
        timestamp: new Date().toISOString(),
        ip: req.ip,
    });

    res.status(200).json({ success: true });
});

// Get visitor statistics (demo endpoint)
app.get('/api/stats', (req, res) => {
    // In production, this would query a database
    const stats = {
        totalVisitors: Math.floor(Math.random() * 10000) + 5000,
        activeUsers: Math.floor(Math.random() * 100) + 10,
        countriesReached: 45,
        projectsCompleted: 127,
    };

    res.status(200).json(stats);
});

// Newsletter subscription endpoint
app.post('/api/subscribe', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            error: 'Email is required',
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            error: 'Invalid email format',
        });
    }

    console.log('Newsletter subscription:', {
        email,
        timestamp: new Date().toISOString(),
    });

    res.status(200).json({
        success: true,
        message: 'Successfully subscribed to newsletter!',
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
    });
});

// 404 handler - serve index.html for client-side routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Email sending function (demo)
async function sendEmail({ name, email, company, message }) {
    // This is a demo function
    // In production, configure with real SMTP settings
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER) {
        console.log('Email not configured. Would send:', { name, email, company, message });
        return;
    }

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT || 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@zynthora.ai',
        to: process.env.EMAIL_TO || 'contact@zynthora.ai',
        subject: `New Contact Form Submission from ${name}`,
        html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Company:</strong> ${company || 'Not provided'}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
        `,
    });
}

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`
╔═══════════════════════════════════════════════╗
║     Zynthora.ai Landing Page Server          ║
║                                              ║
║  Server running on port ${PORT}                ║
║  Environment: ${process.env.NODE_ENV || 'development'}                    ║
║  Access: http://localhost:${PORT}               ║
╚═══════════════════════════════════════════════╝
    `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully...');
    process.exit(0);
});
