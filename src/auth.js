'use strict';

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