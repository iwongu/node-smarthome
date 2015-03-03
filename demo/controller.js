'use strict';

var home = require('..');
var timer = require('timer-promise');

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
