'use strict';

var request = require('superagent');

function Query(model) {
  return Object.create(Query.prototype)._init(model);
}

Query.prototype = {
  _init: function(model) {
    this._model = model;
    this._commands = model._commands;

    return this;
  },
  exec: function(fn) {
    this._commands.push({
      name: 'exec',
      args: ['__fn']
    });

    request
      .post('http://localhost:' + this._model._port + '/Test')
      .buffer()
      .type('json')
      .accept('json')
      .send(this._commands)
      .end(function(err, res) {
        if (!err && !res.ok) {
          err = new Error(res.status);
        }
        fn(err, res.body);
      });
  }
};

module.exports = function() {
  return Query;
};