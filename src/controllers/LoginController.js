'use strict';

require('dotenv').config();

const express = require('express');
const auth = require('../auth');

const sha256 = require('js-sha256');

let router = express.Router();

// login page
router.get('/login',
    auth.ensureNotLoggedIn,
    (req, res) => {
        res.render('login', {
            title: 'Login',
        });
    }
);

// login page - validating input
router.post('/login',
    auth.ensureNotLoggedIn,
    (req, res, next) => {
        // if the data we're not sent
        if (!req.body.username || !req.body.password)
            return res.render('login', { title: 'Login', failed: true, });
        // if it's correct, go to dashboard
        if (req.body.username === process.env.LOGIN && sha256(req.body.password) === process.env.PASSWORD) {
            req.session.user = req.body.username;
            return res.redirect('/dashboard');
        }
        // login failed
        else
            return res.render('login', { title: 'Login', failed: true, });
    });

// logout page
router.get('/logout',
    auth.ensureLoggedIn,
    (req, res) => {
        req.session = undefined;
        res.redirect('/');
    });

exports.router = router;