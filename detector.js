'use strict';

var pubsub = require('node-pubsub');
var gpio = require('pi-gpio');

var pir_pin = 8;
var calibration_time = 10;
var pause = 2000;
var lock_now = true;
var low_in;
var take_low_time;

function setup(callback) {
    pubsub('detector/living_room/1').setValue({status: false});
    gpio.close(pir_pin, function(err) {
	console.log('calibrating sensor for ' + calibration_time + ' seconds');
	gpio.open(pir_pin, 'in', function(err) {
	    setTimeout(callback, calibration_time * 1000);
	});
    });
}

function loop(value) {
    gpio.read(pir_pin, function(err, value) {
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

setup(function() {
    console.log('calibrating done');
    setInterval(loop, 50);
});

