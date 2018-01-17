const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middlewareObj = {};

middlewareObj.hasOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCamp) {
            if (err || !foundCamp) {
                req.flash('error', 'Campground not found.');
                res.redirect('back');
            } else {
                if (foundCamp.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error', "You don't have permission to do that.");
                    res.redirect('back');
                }
            }
        });
    } else {
        req.flash('error', 'You need to login first!');
        res.redirect('back');
    }
};

middlewareObj.commentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err || !foundComment) {
                req.flash('error', 'Comment not found.');
                res.redirect('back');
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error', "You don't have permission to do that.");
                    res.redirect('back');
                }
            }
        });
    } else {
        req.flash('error', 'You need to login first!');
        res.redirect('back');
    }
};

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'You need to login first!');
    res.redirect('/login');
};

module.exports = middlewareObj;
