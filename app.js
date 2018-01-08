var express = require('express'),
app = express(),
bodyParser = require('body-parser'),
mongoose = require('mongoose'),
passport = require('passport'),
LocalStrategy = require ('passport-local'),
Campground = require('./models/campground'),
Comment = require('./models/comment'),
User = require('./models/user'),
seedDB = require('./seeds');


mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient: true});
mongoose.Promise = global.Promise;
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
seedDB();


// PASSPORT SETUP
app.use(require('express-session')({
  secret: 'Astro is the most beautiful dog on Earth',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


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
      res.render('campgrounds/index', {campgrounds: camps});
    }
  });
});

// NEW ROUTE (show form to create new camp)
app.get('/campgrounds/new', function(req, res) {
  res.render('campgrounds/new');
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
      res.render('campgrounds/show', {campground: retrieveCamp});
    }
  });
});


// =======================
// COMMENTS ROUTES
// =======================

// NEW ROUTE (show form to create new comment)
app.get('/campgrounds/:id/comments/new', function(req, res) {
  // Find campground by id
  Campground.findById(req.params.id, function(err, campground){
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', {campground: campground});
    }
  });
});

// CREATE ROUTE (add new camp to DB)
app.post('/campgrounds/:id/comments', function(req, res){
  // Lookup campground using Id
  Campground.findById(req.params.id, function(err, campground){
    if (err) {
      console.log(err);
      res.redirect('/campgrounds');
    } else {
      // Create new comment
      Comment.create(req.body.comment, function(err, comment){
        if (err) {
          console.log(err);
        } else {
          // Connect new comment to campground
          campground.comments.push(comment);
          campground.save();
          res.redirect('/campgrounds/' + campground._id);
        }
      });
    }
  });
  // Redirect to campground showpage
});


// AUTH ROUTES

app.get('/register', function(req, res){
  res.render('register');
});

app.post('/register', function(req, res){
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
    if (err) {
      console.log(err);
      return res.render('register');
    }
    passport.authenticate('local')(req, res, function(){
      res.redirect('/campgrounds');
    });
  });
});


app.listen(3000, function() {
  console.log('Listening on port 3000');
});
