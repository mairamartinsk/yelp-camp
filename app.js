var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

var campgrounds = [
  {name: 'Salmon Creek', image: 'https://pixabay.com/get/e136b80728f31c22d2524518a33219c8b66ae3d018b2104693f3c771/night-839807_640.jpg'},
  {name: 'Granite Hill', image: 'https://pixabay.com/get/e837b50928f0043ed1584d05fb0938c9bd22ffd41cb0124092f6c279a7/trees-1246045_640.jpg'},
  {name: 'Mountain Goat\'s Rest', image: 'https://pixabay.com/get/eb3db8072cf2023ed1584d05fb0938c9bd22ffd41cb0124092f6c579a7/indians-2898463_640.jpg'},
  {name: 'Salmon Creek', image: 'https://pixabay.com/get/e136b80728f31c22d2524518a33219c8b66ae3d018b2104693f3c771/night-839807_640.jpg'},
  {name: 'Granite Hill', image: 'https://pixabay.com/get/e837b50928f0043ed1584d05fb0938c9bd22ffd41cb0124092f6c279a7/trees-1246045_640.jpg'},
  {name: 'Mountain Goat\'s Rest', image: 'https://pixabay.com/get/eb3db8072cf2023ed1584d05fb0938c9bd22ffd41cb0124092f6c579a7/indians-2898463_640.jpg'},
  {name: 'Salmon Creek', image: 'https://pixabay.com/get/e136b80728f31c22d2524518a33219c8b66ae3d018b2104693f3c771/night-839807_640.jpg'},
  {name: 'Granite Hill', image: 'https://pixabay.com/get/e837b50928f0043ed1584d05fb0938c9bd22ffd41cb0124092f6c279a7/trees-1246045_640.jpg'},
  {name: 'Mountain Goat\'s Rest', image: 'https://pixabay.com/get/eb3db8072cf2023ed1584d05fb0938c9bd22ffd41cb0124092f6c579a7/indians-2898463_640.jpg'}
];

app.get('/', function(req, res) {
  res.render('landing');
});

app.get('/campgrounds', function(req, res) {
  res.render('campground', {campgrounds: campgrounds});
});

app.post('/campgrounds', function(req, res) {
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var newCampground = {name: name, image: image};
  campgrounds.push(newCampground);
  // redirect back to campgrounds page
  res.redirect('/campgrounds');
});

app.get('/campgrounds/new', function(req, res) {
  res.render('new.ejs');
});

app.listen(3000, function() {
  console.log('Listening on port 3000');
});
