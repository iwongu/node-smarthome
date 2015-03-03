'use strict';

var home = require('..');
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
  this.reverseStatus = opts.reverseStatus || true;
};

PIN.prototype.run = function() {
  var thiz = this;
  gpio.close(this.pin).
    then(function() {
      return gpio.open(thiz.pin, 'out');
    }, function(err) {
      return gpio.open(thiz.pin, 'out');  // ignore error on closing.
    }).
    then(function() {
      return gpio.write(thiz.pin, thiz.reverseStatus ? 1 : 0 /* off */);
    }).
    then(function() {
      home.get(thiz.path).on('value', function(data) {
        var status = data.value.status;
        console.log(thiz.path + ' turned ' + (status ? 'on' : 'off'));
        gpio.write(thiz.pin, thiz.reverseStatus ? !status : status);
      });
    }).
    then(null, function(err) {
      console.log(err);
    });
};

module.exports = function(path, opts) {
  return new PIN(path, opts);
};

