'use strict';

require('dotenv').config();

const sha256 = require('js-sha256');
const logger = require('./logger');

exports.ensureLoggedIn = async (req, res, next) => {
    if (req.session.user === undefined)
        return res.redirect('/');
    next();
};

exports.ensureNotLoggedIn = (req, res, next) => {
    if (req.session.user !== undefined)
        return res.redirect('/');
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
            if (!req.body.username || !req.body.password)
                return res.render('login', { title: 'Login', });
            if (req.body.username === process.env.LOGIN && sha256(req.body.password) === process.env.PASSWORD) {
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