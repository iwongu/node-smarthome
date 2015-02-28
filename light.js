'use strict';

var pubsub = require('node-pubsub');
var gpio = require('./pi-gpio-promise');

var relay_pin = 7;

function setup() {
  return gpio.close(relay_pin).
    then(function() {
      return gpio.open(relay_pin, 'out');
    }).
    then(function() {
      return gpio.write(relay_pin, 1 /* off */);
    });
}

setup().then(function() {
  pubsub('light/living_room/1').
    on('value', function(data) {
      console.log('light turned ' + (data.value.status ? 'on' : 'off'));
      gpio.write(relay_pin, data.value.status ? 0 : 1);
    });
});
