'use strict';

var home = require('./lib/smarthome');
var pir = require('./adapters/pi_pir');
var outpin = require('./adapters/pi_outpin');
var timer = require('timer-promise');

home.deftype(
  'light', {
    value: {
      status: 'boolean'
    }
  });
home.deftype(
  'motion', {
    value: {
      status: 'boolean'
    }
  });

home.define(
  'light/sunnyvale/living-room/1',
  'light/sunnyvale/living-room/2',
  'motion/sunnyvale/living-room/1'
);

//require('./fakes');
pir('motion/sunnyvale/living-room/1', {pin: 8}).setup();
outpin('light/sunnyvale/living-room/1', {pin: 7, reverseStatus: true}).setup();

home.get('motion/sunnyvale/living-room').on('value', function(data) {
  if (data.value.status) {
    timer.stop('light-off');
    home.get('light/sunnyvale/living-room').visitLeaves(function(node) {
      node.setValue({status: true});
    });
  } else {
    timer.start('light-off', 2000).then(function() {
      home.get('light/sunnyvale/living-room').visitLeaves(function(node) {
        node.setValue({status: false});
      });
    });
  }
});
