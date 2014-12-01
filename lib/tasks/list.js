var Async = require('async');

var Context = require('../context');
var Manifest = require('../manifest');

var task = {
  name: 'list',
  synopsis: 'list',
  description: 'lists photo metadata. Uses the supplied manifest or scans.',
  options: []
};

task.invoke = function (args, options, callback) {
  Async.waterfall([
    function (callback) {
      Manifest.readOrScan(options, callback);
    },
    function (manifest, callback) {
      Context.log(JSON.stringify(manifest, null, 2));
      callback();
    }
  ], callback);
};

exports = module.exports = task;
