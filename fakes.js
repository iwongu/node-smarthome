'use strict';

var home = require('./lib/smarthome');
var timer = require('timer-promise');

home.get('light/sunnyvale/living-room/1').on('value', function(data) {
  console.log('light 1 in living room: ' + data.value.status);
});

home.get('light/sunnyvale/living-room/2').on('value', function(data) {
  console.log('light 2 in living room: ' + data.value.status);
});

// mimic motions.
timer.start(2000).
  then(function() {
    home.get('motion/sunnyvale/living-room/1').setValue({status: true});
    return timer.start(2000);
  }).
  then(function() {
    home.get('motion/sunnyvale/living-room/1').setValue({status: false});
  }).
  then(null, function(err) {
    console.log(err);
  });
