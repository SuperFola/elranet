'use strict';

const express = require('express');
const docker = require('../docker');

let router = express.Router();

router.get('/', (req, res) => {
    return res.render('dashboard', {
        title: 'Dashboard',
        user: req.session.user,
    });
});

exports.router = router;