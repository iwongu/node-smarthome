'use strict';

var Firebase = require('firebase');
var extend = require('extend');

function NodeRef(node) {
  this.node = node;
  this.ref = this._firebase(this.path());
  this.controller_id = '1234';
};

NodeRef.get = function(node) {
  return new NodeRef(node);
};

NodeRef.prototype._firebase = function(path) {
  return new Firebase('https://raspberry-pi.firebaseio.com/' + path);
};

NodeRef.prototype._extend = function(value) {
  return extend({}, value, {
    _meta_: {
      controller_id: this.controller_id
    }
  });
};

NodeRef.prototype._emit = function(node, snapshot) {
  if (!node.hasChildren()) {
    var value = snapshot.val();
    if (value._meta_ && value._meta_.controller_id == this.controller_id) {
      return;
    }
    node.setValue(value);
    return;
  }
  snapshot.forEach(function(childSnapshot) {
    var childNode = node.getChild(childSnapshot.key());
    this._emit(childNode, childSnapshot);
  }.bind(this));
};

// it's supporting only 'value' event.
NodeRef.prototype.on = function(event, callback) {
  this.node.on(event, function(data) {
    callback(data);
    if (!data.value._meta_) {
      // it should fire in data.path instead of this.path().
      this._firebase(data.path).set(this._extend(data.value));
    }
  }.bind(this));
  this.ref.on('value', function(snapshot) {
    this._emit(this.node, snapshot);
  }.bind(this));
  return this;
};

NodeRef.prototype.setValue = function(value) {
  this.node.setValue(value);
  this.ref.set(this._extend(value));
};

NodeRef.prototype.visitLeaves = function(callback) {
  this.node.visitLeaves(function(node) {
    callback(NodeRef.get(node));
  });
};

NodeRef.prototype.path = function() {
  return this.node.path();
};

module.exports = NodeRef;
