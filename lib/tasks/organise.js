var _ = require('lodash');
var Async = require('async');
var Chalk = require('chalk');
var Fs = require('graceful-fs');
var Mkdirp = require('mkdirp');
var Path = require('path');

var Context = require('../context');
var Manifest = require('../manifest');

exports.invoke = function (args, options, callback) {
  Async.waterfall([
    function (callback) {
      Manifest.readOrScan(options, callback);
    },
    function (manifest, callback) {
      _.forOwn(manifest.files, function (data) {
        if (data.rename.match) {
          if (data.fileName === data.rename.fileName) {
            Context.log(Chalk.bold.blue('File already in desired location \'' + data.fileName + '\''));
          } else {
            Context.log(Chalk.green('Moving \'' + data.fileName + '\' to \'' + data.rename.fileName + '\''));
            Mkdirp.sync(Path.dirname(data.rename.fileName));
            Fs.renameSync(data.fileName, data.rename.fileName);
          }
        }
      });
      callback();
    }
  ], callback);
};
