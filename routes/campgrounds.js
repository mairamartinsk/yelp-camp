const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');

// Campground Index Route (show all campgrounds)
router.get('/', function(req, res) {
    Campground.find({}, function(error, camps) {
        if (error) {
            console.log(error);
        } else {
            res.render('campgrounds/index', {
                campgrounds: camps
            });
        }
    });
});

// Campground New Route (show form to create new camp)
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

// Campground Create Route (add new camp to DB)
router.post('/', isLoggedIn, function(req, res) {
    const name = req.body.name;
    const image = req.body.image;
    const desc = req.body.description;
    const author = {
        id: req.user._id,
        username: req.user.username
    };
    const newCampground = {
        name: name,
        image: image,
        description: desc,
        author: author
    };
    Campground.create(newCampground, (error, newCamp) => {
        error ? console.log(error) : res.redirect('/campgrounds');
    });
});

// Campground Show Route (get more info about one campsite)
router.get('/:id', function(req, res) {
    Campground.findById(req.params.id)
        .populate('comments')
        .exec(function(error, retrieveCamp) {
            if (error) {
                console.log(error);
            } else {
                console.log(retrieveCamp);
                res.render('campgrounds/show', {
                    campground: retrieveCamp
                });
            }
        });
});

// Campground Edit Route (show edit form)
router.get('/:id/edit', hasOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCamp) {
        res.render('campgrounds/edit', { campground: foundCamp });
    });
});

// Campground Update Route (update then redirect)
router.put('/:id', hasOwnership, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(
        err,
        updateCamp
    ) {
        err
            ? res.redirect('/campgrounds')
            : res.redirect('/campgrounds/' + req.params.id);
    });
});

// Campground Destroy Route (delete then redirect)
router.delete('/:id', hasOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, (err, deleteCamp) => {
        err ? res.redirect('/campgrounds') : res.redirect('/campgrounds');
    });
});

// Middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

function hasOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCamp) {
            if (err) {
                res.redirect('back');
            } else {
                if (foundCamp.author.id.equals(req.user._id)) {
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
