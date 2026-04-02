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
    'https://finance-dashboard-zorvyn.vercel.app',
    'https://finance-dashboard-zorvyn-git-main.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use('/api/auth', auth);
app.use('/api/transactions', transactions);
app.use('/api/dashboard', dashboard);

app.use(errorHandler);

module.exports = app;