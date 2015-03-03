'use strict';

var home = require('../lib/smarthome');
var gpio = require('pi-gpio-promise');
var timer = require('timer-promise');

/**
 * @param {object|number} opts
 * @constructor
 */
function PIR(path, opts) {
  this.path = path;
  if (typeof opts == 'number') {
    opts = {pin: opts};
  }
  this.pin = opts.pin || 8;
  this.calibrationTime = opts.calibrationTime || 10;
  this.pause = opts.pause || 2000;
  this.interval = opts.interval || 50;
  this.lockNow = true;
  this.lowIn = null;
  this.takeLowTime = false;
};

PIR.prototype.loop = function(value) {
  gpio.read(this.pin).then(function(value) {
    if (value) {
      if (this.lockNow) {
	this.lockNow = false;
	console.log('motion detected');
	home.get(path).setValue({status: true});
      }
      this.takeLowTime = true;
    } else {
      if (this.takeLowTime) {
	this.lowIn = Date.now();
	this.takeLowTime = false;
      }
      if (!this.lockNow && Date.now() - this.lowIn > this.pause) {
	this.lockNow = true;
	console.log('motion ended');
	home.get(path).setValue({status: false});
      }
    }
  }.bind(this));
};

PIR.prototype.setup = function() {
  console.log('calibrating sensor for ' + this.calibrationTime + ' seconds');
  gpio.close(this.pin).
    then(function() {
      return gpio.open(this.pin, 'in');
    }.bind(this), function(err) {
      return gpio.open(this.pin, 'in');  // ignore error on closing.
    }.bind(this)).
    then(function() {
      return timer.start(this.calibrationTime * 1000);
    }.bind(this)).
    then(function() {
      console.log('calibrating done');
      setInterval(loop, this.interval);
    }.bind(this)).
    then(null, function(err) {
      console.log(err);
    });
};

module.exports = function(path, opts) {
  return new PIR(path, opts);
};
