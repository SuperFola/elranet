'use strict';

require('dotenv').config();

const sha256 = require('js-sha256');
const logger = require('./logger');

exports.ensureLoggedIn = async (req, res, next) => {
    logger.info(`ensureloggedin req.session: ${JSON.stringify(req.session)}`);
    if (req.session.user === undefined)
        res.redirect('/');
    next();
};

exports.ensureNotLoggedIn = (req, res, next) => {
    logger.info(`ensurenotloggedin req.session: ${JSON.stringify(req.session)}`);
    if (req.session.user !== undefined)
        res.redirect('/');
    next();
};

exports.run = app => {
    app.get('/login',
        exports.ensureNotLoggedIn,
        (req, res) => {
            res.render('login', {
                title: 'Login',
            });
        }
    );

    app.post('/login',
        exports.ensureNotLoggedIn,
        (req, res, next) => {
            logger.info(`${req.body.username} - ${req.body.password}`);
            logger.info(req.body.username);
            logger.info(process.env.LOGIN);
            logger.info(`${req.body.username === process.env.LOGIN} ${sha256(req.body.password) === process.env.PASSWORD}`);

            if (!req.body.username || !req.body.password)
                return res.render('login', { title: 'Login', });
            if (req.body.username === process.env.LOGIN && sha256(req.body.password) === process.env.PASSWORD) {
                logger.info('ok!');
                req.session.user = req.body.username;
                return res.redirect('/dashboard');
            }
            else
                return res.render('login', { title: 'Login', });
        });

    app.get('/logout',
        exports.ensureLoggedIn,
        (req, res) => {
            req.session = undefined;
            logger.info(`${username} logged out`);
            res.redirect('/');
        });
};