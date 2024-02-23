const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const userRoutes = require('./routes/userRoutes');

const salt = 10;

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ["POST", "GET"],
    credentials: true
}));
app.use(cookieParser());

app.use('/user', userRoutes);

app.listen(3001, () => {
    console.log("Server running on port 3001");
});
