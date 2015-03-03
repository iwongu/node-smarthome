'use strict'

var Node = require('./node');

function NodeRef(node) {
  this.node = node;
};

NodeRef.get = function(node) {
  return new NodeRef(node);
};

NodeRef.prototype.on = function(event, listener) {
  this.node.on(event, listener);
  return this;
};

NodeRef.prototype.setValue = function(value) {
  this.node.setValue(value);
};

NodeRef.prototype.visitLeaves = function(callback) {
  this.node.visitLeaves(function(node) {
    callback(NodeRef.get(node));
  });
};

function SmartHome() {
  this.root = new Node();
  this.types = {};
};

SmartHome.prototype.deftype = function(type, info) {
  this.types[type] = info;
};

SmartHome.prototype.define = function() {
  var paths = arguments;
  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    var type = path.split('/')[0];
    if (type in this.types) {
      this.root.get(path, true);
    } else {
      console.warn(type + ' already defined.');
    }
  }
};

SmartHome.prototype.get = function(path) {
  return NodeRef.get(this.root.get(path));
};

module.exports = new SmartHome();
