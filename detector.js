'use strict';

var pubsub = require('node-pubsub');
var Promise = require('promise');
var gpio = require('./pi-gpio-promise');
var timer = require('./timer');

var pir_pin = 8;
var calibration_time = 10;
var pause = 2000;
var lock_now = true;
var low_in;
var take_low_time;

function setup() {
  console.log('calibrating sensor for ' + calibration_time + ' seconds');
  return gpio.close(pir_pin).
    then(function() {
      return gpio.open(pir_pin, 'in');
    }, function(err) {
      return gpio.open(pir_pin, 'in');  // ignore error.
    }).
    then(function() {
      return timer.start('calibration', calibration_time * 1000);
    });
}

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

setup().then(function() {
  console.log('calibrating done');
  setInterval(loop, 50);
});
