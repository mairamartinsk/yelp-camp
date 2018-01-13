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
router.get('/new', (req, res) => {
    res.render('campgrounds/new');
});

// Campground Create Route (add new camp to DB)
router.post('/', function(req, res) {
    const name = req.body.name;
    const image = req.body.image;
    const desc = req.body.description;
    const newCampground = {
        name: name,
        image: image,
        description: desc
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

module.exports = router;
