'use strict';

function Timer() {
  this.timeout = undefined;
};

Timer.prototype.start = function(callback, delay) {
  this.stop();
  this.timeout = setTimeout(callback, delay);
};

Timer.prototype.stop = function() {
  if (this.timeout) {
    clearTimeout(this.timeout);
    this.timeout = undefined;
  }
};

var timers = {};

module.exports = function(name) {
  if (!name) {
    return new Timer();
  }
  if (name in timers) {
    return timers[name];
  }
  timers[name] = new Timer();
  return timers[name];
};
