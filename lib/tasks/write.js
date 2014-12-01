var Async = require('async');
var Moment = require('moment');

var Manifest = require('../manifest');

var task = {
  name: 'write',
  synopsis: 'write',
  description: 'scans the filesystem and writes a manifest',
  options: []
};

exports.invoke = function (args, options, callback) {
  var manifestFileName = 'photoman_' + Moment.utc().format('YYYYMMDD-HHmmss') + '.json';
  options.manifest = options.manifest || manifestFileName;
  Async.waterfall([
    function (callback) {
      Manifest.scan(options, callback);
    },
    function (manifest, callback) {
      Manifest.write(manifest, options, callback);
    }
  ], callback);
};

exports = module.exports = task;
