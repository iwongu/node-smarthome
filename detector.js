'use strict';

var pubsub = require('hierarchical-pubsub');
var gpio = require('pi-gpio-promise');
var timer = require('timer-promise');

var pir_pin = 8;
var calibration_time = 10;
var pause = 2000;
var lock_now = true;
var low_in;
var take_low_time;

function loop(value) {
  gpio.read(pir_pin).then(function(value) {
    if (value) {
      if (lock_now) {
	lock_now = false;
	console.log('motion detected');
	pubsub('detector/living_room/1').setValue({status: true});
      }
      take_low_time = true;
    } else {
      if (take_low_time) {
	low_in = Date.now();
	take_low_time = false;
      }
      if (!lock_now && Date.now() - low_in > pause) {
	lock_now = true;
	console.log('motion ended');
	pubsub('detector/living_room/1').setValue({status: false});
      }
    }
  });
}


console.log('calibrating sensor for ' + calibration_time + ' seconds');

gpio.close(pir_pin).
  then(function() {
    return gpio.open(pir_pin, 'in');
  }, function(err) {
    return gpio.open(pir_pin, 'in');  // ignore error on closing.
  }).
  then(function() {
    return timer.start('calibration', calibration_time * 1000);
  }).
  then(function() {
    console.log('calibrating done');
    setInterval(loop, 50);
  }).
  then(null, function(err) {
    console.log(err);
  });
