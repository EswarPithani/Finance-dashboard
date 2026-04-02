const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const auth = require('./routes/authRoutes');
const transactions = require('./routes/transactionRoutes');
const dashboard = require('./routes/dashboardRoutes');

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(helmet());

const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://finance-dashboard-yj5b.vercel.app',
    'https://finance-dashboard-yj5b.vercel.app/',
    'https://finance-dashboard-yj5b-git-main.vercel.app',
    'https://finance-dashboard-yj5b-*.vercel.app'
];

app.use(cors({
    origin: function(origin, callback) {
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - Origin: ${req.headers.origin}`);
    next();
});

app.use('/api/auth', auth);
app.use('/api/transactions', transactions);
app.use('/api/dashboard', dashboard);

app.get('/', (req, res) => {
    res.json({
        message: 'Finance Dashboard API is running',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            transactions: '/api/transactions',
            dashboard: '/api/dashboard'
        }
    });
});

app.use(errorHandler);

module.exports = app;
