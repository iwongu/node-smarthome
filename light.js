'use strict';

var pubsub = require('node-pubsub');
var gpio = require('pi-gpio-promise');

var relay_pin = 7;

gpio.close(relay_pin).
then(function() {
  return gpio.open(relay_pin, 'out');
}, function(err) {
  return gpio.open(relay_pin, 'out');  // ignore error on closing.
}).
then(function() {
  return gpio.write(relay_pin, 1 /* off */);
}).
then(function() {
  pubsub('light/living_room/1').
    on('value', function(data) {
      console.log('light turned ' + (data.value.status ? 'on' : 'off'));
      gpio.write(relay_pin, data.value.status ? 0 : 1);
    });
}).
then(null, function(err) {
  console.log(err);
});
