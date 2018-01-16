const express = require('express');
const router = express.Router({ mergeParams: true });
const Campground = require('../models/campground');
const Comment = require('../models/comment');

// Comments New Route (show form to create new comment)
router.get('/new', isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/new', {
                campground: campground
            });
        }
    });
});

// Comments Create Route (add new comment to DB)
router.post('/', function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});

// Comments Edit Route (show form to edit comment)
router.get('/:comment_id/edit', commentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if (err) {
            res.redirect('back');
        } else {
            res.render('comments/edit', {
                campground_id: req.params.id,
                comment: foundComment
            });
        }
    });
});

// Comments Update Route (update comment on db and redirect)
router.put('/:comment_id', commentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(
        err,
        updatedComment
    ) {
        err
            ? res.redirect('back')
            : res.redirect('/campgrounds/' + req.params.id);
    });
});

// Comments Destroy Route (delete comment and redirect)
router.delete('/:comment_id', commentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(
        err,
        deleteComment
    ) {
        err
            ? res.redirect('back')
            : res.redirect('/campgrounds/' + req.params.id);
    });
});

// Middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

function commentOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err) {
                res.redirect('back');
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect('back');
                }
            }
        });
    } else {
        res.redirect('back');
    }
}

module.exports = router;
