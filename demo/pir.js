'use strict';

var home = require('..');
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
	console.log(this.path + ' motion detected');
	home.get(this.path).setValue({status: true});
      }
      this.takeLowTime = true;
    } else {
      if (this.takeLowTime) {
	this.lowIn = Date.now();
	this.takeLowTime = false;
      }
      if (!this.lockNow && Date.now() - this.lowIn > this.pause) {
	this.lockNow = true;
	console.log(this.path + ' motion ended');
	home.get(this.path).setValue({status: false});
      }
    }
  }.bind(this));
};

PIR.prototype.run = function() {
  var thiz = this;
  console.log('calibrating sensor for ' + this.calibrationTime + ' seconds');
  gpio.close(this.pin).
    then(function() {
      return gpio.open(thiz.pin, 'in');
    }, function(err) {
      return gpio.open(thiz.pin, 'in');  // ignore error on closing.
    }).
    then(function() {
      return timer.start(thiz.calibrationTime * 1000);
    }).
    then(function() {
      console.log('calibrating done');
      setInterval(function() {thiz.loop()}.bind(thiz), thiz.interval);
    }).
    then(null, function(err) {
      console.log(err);
    });
};

module.exports = function(path, opts) {
  return new PIR(path, opts);
};
