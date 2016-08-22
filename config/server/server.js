import serverRender from './serverRender';

var express = require('express');
var path = require('path');

var app = null;
if (__DEV__) {
  app = require('./webpackServer');
}
app = app || express();

app.use('/static', express.static('dist'));
app.use('/images', express.static('assets/images'));
app.use('/', serverRender);

app.listen(8080, function() {
  console.log('Server listen on localhost:8080/');
});
