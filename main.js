'use strict';

require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const auth = require('./src/auth');
const logger = require('./src/logger');

const LoginController = require('./src/controllers/LoginController');
const ApiController = require('./src/controllers/ApiController');
const DashboardController = require('./src/controllers/DashboardController');
const DockerController = require('./src/controllers/DockerController');

const app = express();

// setting up express for cookies
app.use(session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 24 * 3600 * 1000,  // 1 day (ms)
    },
}));

// to read json requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// template engine
app.set('view engine', 'ejs');
app.set('views', process.env.VIEWS_DIR);

app.use('/public', express.static('public'));

// default route
app.get('/', async (req, res) => {
    res.render('login', {
        title: 'Login',
    });
});

// authentification
app.use(LoginController.router);
app.use(auth.ensureLoggedIn);

// from here, every registered route needs the user to be logged in

app.use('/dashboard', DashboardController.router);
app.use('/docker', DockerController.router);
app.use('/api', ApiController.router);

// unhandled exceptions
app.use((err, req, res, next) => {
    logger.error(`Error: ${err.message}`);
    res.status(500).render('error', {
        title: 'An error occured',
        error: err,
    });
});

// route not found
app.use((req, res) => {
    res.status(404).render('notfound', {
        title: 'Error 404',
    });
})

// run the server
app.listen(process.env.PORT, process.env.HOST, () => {
    logger.info(`HTTP server started on ${process.env.HOST}:${process.env.PORT}`);
});