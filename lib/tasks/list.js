var Async = require('async');

var Context = require('../context');
var Manifest = require('../manifest');

exports.invoke = function (args, options, callback) {
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
