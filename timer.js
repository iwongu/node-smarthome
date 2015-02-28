'use strict';

var Promise = require('promise');

var names = {};

var timer = {};
timer.start = function(name, delay) {
  timer.stop(name);
  return new Promise(function(resolve, reject) {
    names[name] = setTimeout(function() {
      if (names[name]) {
        resolve(name);
        delete names[name];
      } else {
        reject();  // cleared
      }
    }, delay);
  });
};

timer.stop = function(name) {
  if (names[name]) {
    clearTimeout(names[name]);
    delete names[name];
  }
};

module.exports = timer;