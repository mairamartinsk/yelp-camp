const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const middleware = require('../middleware');

// Campground Index Route (show all campgrounds)
router.get('/', function(req, res) {
    Campground.find({}, function(error, camps) {
        if (error) {
            console.log(error);
        } else {
            res.render('campgrounds/index', {
                campgrounds: camps,
                page: 'campgrounds'
            });
        }
    });
});

// Campground New Route (show form to create new camp)
router.get('/new', middleware.isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

// Campground Create Route (add new camp to DB)
router.post('/', middleware.isLoggedIn, function(req, res) {
    const name = req.body.name;
    const price = req.body.price;
    const image = req.body.image;
    const desc = req.body.description;
    const author = {
        id: req.user._id,
        username: req.user.username
    };
    const newCampground = {
        name: name,
        price: price,
        image: image,
        description: desc,
        author: author
    };
    Campground.create(newCampground, (error, newCamp) => {
        if (error) {
            console.log(error);
        } else {
            req.flash('success', 'Campground successfully created!');
            res.redirect('/campgrounds');
        }
    });
});

// Campground Show Route (get more info about one campsite)
router.get('/:id', function(req, res) {
    Campground.findById(req.params.id)
        .populate('comments')
        .exec(function(error, retrieveCamp) {
            if (error || !retrieveCamp) {
                req.flash('error', 'Campground not found.');
                res.redirect('back');
            } else {
                console.log(retrieveCamp);
                res.render('campgrounds/show', {
                    campground: retrieveCamp
                });
            }
        });
});

// Campground Edit Route (show edit form)
router.get('/:id/edit', middleware.hasOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCamp) {
        res.render('campgrounds/edit', { campground: foundCamp });
    });
});

// Campground Update Route (update then redirect)
router.put('/:id', middleware.hasOwnership, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(
        err,
        updateCamp
    ) {
        if (err) {
            req.flash('error', 'Something went wrong. Please try again!');
            res.redirect('/campgrounds');
        } else {
            req.flash('success', 'Campground successfully updated!');
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

// Campground Destroy Route (delete then redirect)
router.delete('/:id', middleware.hasOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, (err, deleteCamp) => {
        if (err) {
            req.flash('error', 'Something went wrong.');
            res.redirect('/campgrounds');
        } else {
            req.flash('success', 'Campground successfully deleted.');
            res.redirect('/campgrounds');
        }
    });
});

module.exports = router;
