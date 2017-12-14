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
  image: String
});

var Campground = mongoose.model('Campground', campgroundSchema);

// DB Add Test
// Campground.create({
//   name: 'Mountain Goat\'s Rest',
//   image: 'https://cdn.pixabay.com/photo/2017/10/28/23/18/indians-2898463_640.jpg'
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

app.get('/campgrounds', function(req, res) {
  // Retrieve all campgrounds from DB
  Campground.find({}, function(error, camps){
    if (error) {
      console.log('There was an error.');
    } else {
      res.render('campground', {campgrounds: camps});
    }
  });
});

app.post('/campgrounds', function(req, res) {
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var newCampground = {name: name, image: image};
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

app.get('/campgrounds/new', function(req, res) {
  res.render('new.ejs');
});

app.listen(3000, function() {
  console.log('Listening on port 3000');
});
