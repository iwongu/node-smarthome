'use strict';

var gpio = require('pi-gpio');
var Promise = require('promise');

module.exports = {
  open: function(pinNumber, options) {
    return new Promise(function(resolve, reject) {
      gpio.open(pinNumber, options, function(err) {
	if (err) reject(err);
	else resolve();
      });
    });
  },
  setDirection: function(pinNumber, direction) {
    return new Promise(function(resolve, reject) {
      gpio.setDirection(pinNumber, direction, function(err) {
	if (err) reject(err);
	else resolve();
      });
    });
  },
  getDirection: function(pinNumber) {
    return new Promise(function(resolve, reject) {
      gpio.getDirection(pinNumber, function(err, value) {
	if (err) reject(err);
	else resolve(value);
      });
    });
  },
  close: function(pinNumber, callback) {
    return new Promise(function(resolve, reject) {
      gpio.close(pinNumber, function(err) {
	if (err) reject(err);
	else resolve();
      });
    });
  },
  read: function(pinNumber, callback) {
    return new Promise(function(resolve, reject) {
      gpio.read(pinNumber, function(err, value) {
	if (err) reject(err);
	else resolve(value);
      });
    });
  },
  write: function(pinNumber, value, callback) {
    return new Promise(function(resolve, reject) {
      gpio.write(pinNumber, value, function(err) {
	if (err) reject(err);
	else resolve();
      });
    });
  }
};
