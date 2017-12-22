var mongoose = require('mongoose');
var Campground = require('./models/campground');
var Comment = require('./models/comment');

var data = [
  {
    name: 'Cloud\' Rest',
    image: 'https://farm4.staticflickr.com/3273/2602356334_20fbb23543.jpg',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  },
  {
    name: 'Desert Mesa',
    image: 'https://farm2.staticflickr.com/1424/1430198323_c26451b047.jpg',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  },
  {
    name: 'Canyon Floor',
    image: 'https://farm9.staticflickr.com/8422/7842069486_c61e4c6025.jpg',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  }
]

function seedDB(){
  // Remove all campgrounds
  Campground.remove({}, function(error){
    if (error) {
      console.log(error);
    } else {
      console.log('removed campgrounds');

      // After removal, add a few campgrounds
      data.forEach(function(seed){
        Campground.create(seed, function(error, campground){
          if (error) {
            console.log(error);
          } else {
            console.log('Added a Campground');

            // For each campground created, add a few comments
            Comment.create(
              {
                text: 'This place is great, but I wish there was internet.',
                author: 'Homer'
              }, function(error, comment){
                if (error) {
                  console.log(error);
                } else {
                  campground.comments.push(comment);
                  campground.save();
                  console.log('Created new comment!');
                }
              });
          }
        });
      });
    }
  });
}

module.exports = seedDB;
