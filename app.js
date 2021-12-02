const express = require('express');
const cors = require('cors');
const pino = require('pino-http')();
const cookieParser = require('cookie-parser');

require('dotenv').config();

const movieRoutes = require('./routes/movies');
const authRoutes = require('./routes/auth');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(pino);
app.use(cookieParser());

app.use('/movies', movieRoutes);
app.use('/auth', authRoutes);

module.exports = app;
