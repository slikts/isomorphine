'use strict';

var Query = require('./query')();

function Model(_port) {
  return Object.create(Model.prototype)._init(_port);
}

Model.prototype = {
  _init: function(_port) {
    this._port = _port;
    this._commands = [];

    return this;
  },
  find: function(conditions) {
    this._commands.push({
      name: 'find',
      args: [conditions]
    });

    return Query(this);
  }
};

module.exports = function() {
  return Model;
};