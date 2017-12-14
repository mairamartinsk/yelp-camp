var express = require('express'),
app = express(),
bodyParser = require('body-parser'),
mongoose = require('mongoose');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient: true});
mongoose.Promise = global.Promise;

// SCHEMA SETUP

var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

var Campground = mongoose.model('Campground', campgroundSchema);

// DB Add Test
// Campground.create({
//   name: 'The Goat\'s Rest',
//   image: 'https://cdn.pixabay.com/photo/2017/10/28/23/18/indians-2898463_640.jpg',
//   description: 'The perfect refuge for goats. Sheep are also welcome.'
// }, function(error, camp){
//   if (error) {
//     console.log('There was an error.');
//   } else {
//     console.log('Campground successfully created:');
//     console.log(camp);
//   }
// });

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
  Campground.findById(req.params.id, function(error, retrieveCamp){
    if (error) {
      console.log(error);
    } else {
      // render show template for that campground
      res.render('show', {campground: retrieveCamp});
    }
  });
});

app.listen(3000, function() {
  console.log('Listening on port 3000');
});
