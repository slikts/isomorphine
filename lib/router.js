'use strict';

var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');


function _applyMethods(model, methods, callback) {
  if (!Array.isArray(methods)) {
    return callback(new TypeError('Methods must be an array'));
  }

  methods.every(function(item) {
    var method = model[item.name];

    if (!method) {
      callback(new Error('Invalid method name'));

      return false;
    }

    if (!Array.isArray(item.args)) {
      callback(new TypeError('Method arguments must be an array'));

      return false;
    }

    item.args = item.args.map(function(arg) {
      return arg === '__fn' ? callback : arg;
    });

    model = model[item.name].apply(model, item.args);

    return true;
  });

}

function Router(models) {
  models = models || mongoose.models;

  var router = express.Router();

  router
    .param('model', function(req, res, next, name) {
      req.model = models[name];

      if (!req.model) {
        return next(new Error('Model not found'));
      }

      next();
    })
    .route('/:model')
    .post(bodyParser.json())
    .post(function(req, res, next) {
      _applyMethods(req.model, req.body, function(err, data) {
        if (err) {
          return next(err);
        }

        res.end(data);
      });
    });

  return router;
}

module.exports = Router;