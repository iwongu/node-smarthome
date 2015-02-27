'use strict';

var pubsub = require('node-pubsub');
var timer = require('./timer');

pubsub('display/living_room/1').
  on('value', function(data) {
    console.log('display 1 in living room: ' + data.value.message);
  });

pubsub('light/living_room/1').
  on('value', function(data) {
    console.log('light 1 in living room: ' + data.value.status);
  });

pubsub('light/living_room/2').
  on('value', function(data) {
    console.log('light 2 in living room: ' + data.value.status);
  });

// mimic motions.
setTimeout(function() {
  pubsub('detector/living_room/1').setValue({status: true});
}, 2000);

setTimeout(function() {
  pubsub('detector/living_room/1').setValue({status: false});
}, 4000);
