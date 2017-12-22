var express = require('express'),
app = express(),
bodyParser = require('body-parser'),
mongoose = require('mongoose'),
Campground = require('./models/campground'),
Comment = require('./models/comment'),
seedDB = require('./seeds');


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient: true});
mongoose.Promise = global.Promise;
seedDB();


app.get('/', function(req, res) {
  res.render('landing');
});

// INDEX ROUTE (show all campgrounds)
app.get('/campgrounds', function(req, res) {
  // Retrieve all campgrounds from DB
  Campground.find({}, function(error, camps){
    if (error) {
      console.log('There was an error.');
    } else {
      res.render('index', {campgrounds: camps});
    }
  });
});

// NEW ROUTE (show form to create new camp)
app.get('/campgrounds/new', function(req, res) {
  res.render('new');
});

// CREATE ROUTE (add new camp to DB)
app.post('/campgrounds', function(req, res) {
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var newCampground = {name: name, image: image, description: desc};
  // Create a new campground and save to DB
  Campground.create(newCampground, function(error, newCamp){
    if (error) {
      console.log(error);
    } else {
      // redirect back to campgrounds page
      res.redirect('/campgrounds');
    }
  });
});

// SHOW ROUTE (get more info about one campsite)
app.get('/campgrounds/:id', function(req, res){
  // find the campground with provided ID
  Campground.findById(req.params.id).populate('comments').exec(function(error, retrieveCamp){
    if (error) {
      console.log(error);
    } else {
      console.log(retrieveCamp);
      // render show template for that campground
      res.render('show', {campground: retrieveCamp});
    }
  });
});

app.listen(3000, function() {
  console.log('Listening on port 3000');
});
