'use strict';

var home = require('./lib/smarthome');
var gpio = require('pi-gpio-promise');

/**
 * @param {object|number} opts
 * @constructor
 */
function PIN(path, opts) {
  this.path = path;
  if (typeof opts == 'number') {
    opts = {pin: opts};
  }
  this.pin = opts.pin || 7;
  this.reverseStatus = opts.reverseStatus || false;
};

PIN.prototype.setup = function() {
  gpio.close(this.pin).
    then(function() {
      return gpio.open(this.pin, 'out');
    }.bind(this), function(err) {
      return gpio.open(this.pin, 'out');  // ignore error on closing.
    },bind(this)).
    then(function() {
      return gpio.write(this.pin, this.reverseStatus ? 1 : 0 /* off */);
    }.bind(this)).
    then(function() {
      home.get(this.path).on('value', function(data) {
        var status = data.value.status;
        console.log('light turned ' + status ? 'on' : 'off');
        gpio.write(this.pin, this.reverseStatus ? !status : status);
      });
    }.bind(this)).
    then(null, function(err) {
      console.log(err);
    });
};

module.exports = function(path, opts) {
  return new PIN(path, opts);
};

