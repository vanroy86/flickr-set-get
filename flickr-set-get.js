#!/usr/bin/env node

'use strict';

var cli = require('cli');
var Flickr = require('./lib/Flickr.js');

//TODO use global apikey in user profile directory
cli.parse({
  apiKey:   ['k', 'The flickr api key', 'string', require('./.apikey.js')],
  concurrency:   ['c', 'The number of concurrent requests', 'number', 10]
});

cli.main(function(args, options) {
  var api = new Flickr(options.apiKey, options.concurrency);
  var numPhotos = null;
  var numDownloaded = 0;

  api.on('setInfo', function(info) {
    cli.info('Downloading ' + info.total + ' photos from "' + info.title + '" by ' + info.ownername);
    numPhotos = info.total;
    cli.progress(0);
  });

  api.on('photoDownloaded', function() {
    numDownloaded++;
    cli.progress(numDownloaded / numPhotos);
  });

  api.on('done', function(results) {
    cli.ok('All done.');
  });

  api.getSet(args[0], args[1]);
});

