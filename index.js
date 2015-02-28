'use strict';

var pubsub = require('node-pubsub');
var timer = require('./timer');

require('./detector');
require('./light');
//require('./fakes');

// 1. detector/*
//    data.value = {status: boolean}
// 2. light/*
//    data.value = {status: boolean}
// 3. display/*
//    data.value = {message: string}

pubsub('detector/living_room').
  on('value', function(data) {
    var detected = data.value.status;
    if (detected) {
      // turn on all lights in living room.
      pubsub('light/living_room').visitDescendants(function(node) {
        node.setValue({status: true});
      });
      timer('light_off').stop();
    } else {
      // after 5s.
      timer('light_off').start(function() {
        // turn off all lights in living room.
        pubsub('light/living_room').visitDescendants(function(node) {
          node.setValue({status: false});
        });
      }, 5000);
    }
  });

pubsub('detector/living_room').
  on('value', function(data) {
    pubsub('display/living_room').visitDescendants(function(node) {
      var message = data.value.status ?
          'motion detected in ' + data.event : 'no motion';
      node.setValue({message: message});
    });
  });
