'use strict';

var home = require('..');
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
  'motion/sunnyvale/living-room/1'
);

require('./controller');

require('./pir')('motion/sunnyvale/living-room/1', {pin: 8}).run();
require('./out')('light/sunnyvale/living-room/1', {pin: 7}).run();
