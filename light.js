'use strict';

var pubsub = require('node-pubsub');
var gpio = require('pi-gpio');

var relay_pin = 7;

function setup(callback) {
  gpio.close(relay_pin, function(err) {
    gpio.open(relay_pin, 'out', function(err) {
      gpio.write(relay_pin, 1, function(err) {
	callback();
      });
    });
  });
}

setup(function() {
  pubsub('light/living_room/1').
    on('value', function(data) {
      console.log('light turned ' + (data.value.status ? 'on' : 'off'));
      gpio.write(relay_pin, data.value.status ? 0 : 1, function(err) {
      });
    });
});
