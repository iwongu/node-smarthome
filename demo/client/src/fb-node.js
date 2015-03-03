'use strict';

function NodeRef(node) {
  this.node = node;
  this.ref = this._firebase(this.path());
  this.controller_id = '5678';
};

NodeRef.get = function(node) {
  return new NodeRef(node);
};

NodeRef.prototype._firebase = function(path) {
  return new Firebase('https://raspberry-pi.firebaseio.com/' + path);
};

NodeRef.prototype._extend = function(value) {
  return $.extend({}, value, {
    _meta_: {
      controller_id: this.controller_id
    }
  });
};

NodeRef.prototype._emit = function(node, snapshot, callback) {
  if (!node.hasChildren()) {
    var value = snapshot.val();
    callback({path: node.path(), value: value});
    return;
  }
  snapshot.forEach(function(childSnapshot) {
    var childNode = node.getChild(childSnapshot.key());
    this._emit(childNode, childSnapshot, callback);
  }.bind(this));
};

// it's supporting only 'value' event.
NodeRef.prototype.on = function(event, callback) {
  this.ref.on('value', function(snapshot) {
    this._emit(this.node, snapshot, callback);
  }.bind(this));
  return this;
};

NodeRef.prototype.setValue = function(value) {
  if (this.node.hasChildren()) {
    throw 'Value can be set only in leaves.';
  }
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
