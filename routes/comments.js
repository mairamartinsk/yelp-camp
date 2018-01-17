const express = require('express');
const router = express.Router({ mergeParams: true });
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware');

// Comments New Route (show form to create new comment)
router.get('/new', middleware.isLoggedIn, function(req, res) {
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
router.get('/:comment_id/edit', middleware.commentOwnership, function(
    req,
    res
) {
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
router.put('/:comment_id', middleware.commentOwnership, function(req, res) {
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
router.delete('/:comment_id', middleware.commentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(
        err,
        deleteComment
    ) {
        err
            ? res.redirect('back')
            : res.redirect('/campgrounds/' + req.params.id);
    });
});

module.exports = router;
