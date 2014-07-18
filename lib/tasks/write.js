var Async = require('async');
var Chalk = require('chalk');
var Fs = require('graceful-fs');
var Moment = require('moment');

var Context = require('../context');
var Manifest = require('../manifest');

exports.invoke = function (args, options, callback) {
  var manifestFileName = 'photoman_' + Moment.utc().format('YYYYMMDD-HHmmss') + '.json';
  Async.waterfall([
    function (callback) {
      Manifest.scan(options, callback);
    },
    function (manifest, callback) {
      Fs.writeFile(manifestFileName, JSON.stringify(manifest, null, 2), callback);
    },
    function (callback) {
      Context.log(Chalk.bold.blue('Wrote manifest to \'' + manifestFileName + '\''));
      callback();
    }
  ], callback);
};
