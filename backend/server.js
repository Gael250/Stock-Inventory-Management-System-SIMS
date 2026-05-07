const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
const db = require('./config/db');

dotenv.config();

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 3600000
    }
}));

const userRoute = require('./routes/userRoute');
const productRoute = require('./routes/productRoute');
const stockRoute = require('./routes/stockRoute');

app.use('/api/users', userRoute);
app.use('/api/spare-parts', productRoute);
app.use('/api/stock', stockRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Visit: http://localhost:${PORT}`);
});
