const express = require('express');
const users = require('../routes/user');
const monitor = require('../routes/monitor');

module.exports = function(app) {
  app.use(express.json());
  app.use('/', users);
  app.use('/check', monitor);
}