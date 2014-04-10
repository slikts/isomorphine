'use strict';

var should = require('chai').should();
var request = require('supertest');
var express = require('express');

var Router = require('../lib/router');
var Model = require('../lib/client/model')();

var _data = {
  a: 1,
  b: 2
};

var models = {
  Test: {
    find: function() {
      return this;
    },
    exec: function(x) {
      x(undefined, _data);
      return this;
    }
  }
};

describe('Router', function() {
  var commands = [{
    name: 'find',
    args: []
  }, {
    name: 'exec',
    args: ['__fn']
  }];

  var app = express().use(Router(models));

  describe('POST', function() {

    it('should fail for non-existent models', function(done) {
      request(app)
        .post('/Nonexistent')
        .expect(500)
        .expect(/^Error: Model not found/)
        .end(function(err, res) {
          done(err);
        });
    });

    it('should apply commands', function(done) {
      request(app)
        .post('/Test')
        .send(commands)
        .expect(200)
        .expect(JSON.stringify(_data))
        .end(function(err, res) {
          done(err);
        });
    });
  });
});

describe('client model', function() {
  describe('app', function() {
    var app = express();
    var port = 3999;
    var srv;

    app
      .use(function(req, res, next) {
        res.writeHead(200, {
          'Content-Type': 'application/json'
        });
        next();
      })
      .use(Router(models));

    beforeEach(function() {
      srv = app.listen(port);
    });

    // it('should call the api with commands', function(done) {

    //   Model()
    //     .find({
    //       a: 1
    //     })
    //     .exec(function(err, data) {
    //       done(err);
    //     });

    // });

    it('should call the api with commands', function(done) {

      Model(port)
        .find()
        .exec(function(err, data) {
          if (!err) {
            JSON.stringify(data).should.equal(JSON.stringify(_data));
          }
          done(err);
        });
    });

    afterEach(function() {
      srv.close();
    });
  });
});