const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

// Root Route
router.get('/', (req, res) => {
    res.render('landing');
});

// =======================
// AUTH ROUTES
// =======================

// Register Route (show signup form)
router.get('/register', (req, res) => {
    res.render('register', { page: 'register' });
});

// Handles signup logic (add new User to DB) and authentication
router.post('/register', function(req, res) {
    const newUser = new User({
        username: req.body.username
    });
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('register');
        }
        passport.authenticate('local')(req, res, function() {
            req.flash('success', 'Welcome to YelpCamp ' + user.username + '!');
            res.redirect('/campgrounds');
        });
    });
});

// Login Route
router.get('/login', (req, res) => {
    res.render('login', { page: 'login' });
});

// Handles login logic and authentication
router.post(
    '/login',
    passport.authenticate('local', {
        successRedirect: '/campgrounds',
        failureRedirect: '/login'
    }),
    function(req, res) {}
);

// Logout Route
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'You are logged out. See you soon!');
    res.redirect('/campgrounds');
});

module.exports = router;
