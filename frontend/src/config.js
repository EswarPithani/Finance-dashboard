// API Configuration
const config = {
    apiUrl: process.env.NODE_ENV === 'production' 
        ? (process.env.REACT_APP_API_URL || 'https://finance-dashboard-api.onrender.com')
        : 'http://localhost:5000',
};

export default config;
