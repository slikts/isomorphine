'use strict';

var should = require('chai').should();
var request = require('supertest');
var express = require('express');

var Router = require('../lib/router');

describe('Router', function() {
  var models = {
    'Test': {
      a: function() {
        return this;
      },
      b: function(x) {
        x(undefined, 'qqq');
        return this;
      }
    }
  };

  var commands = [{
    name: 'a',
    args: []
  }, {
    name: 'b',
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
        .expect('qqq')
        .end(function(err, res) {
          done(err);
        });
    });

  });

});