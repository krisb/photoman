var _ = require('lodash');
var Async = require('async');
var Chalk = require('chalk');
var Crypto = require('crypto');
var ExifImage = require('exif').ExifImage;
var Fs = require('graceful-fs');
var Glob = require('glob');
var Moment = require('moment');
var Path = require('path');

var Context = require('./context');

var sha1hex = function (fileName, callback) {
  var shasum = Crypto.createHash('sha1');

  var s = Fs.ReadStream(fileName);

  Fs.stat(fileName, function (err, stats) {
    shasum.update('blob ' + stats.size + '\0');

    s.on('data', function (d) {
      shasum.update(d);
    });

    s.on('end', function () {
      var d = shasum.digest('hex');
      callback(err, d);
    });
  });
};

var analyseHashes = function (manifest) {
  var hashes = manifest.hashes = {};
  _.forOwn(manifest.files, function (data) {
    hashes[data.hash] = hashes[data.hash] || [];
    hashes[data.hash].push(data.fileName);
  });
};

var populateRenames = function (manifest, options) {
  var renames = {};
  _.forOwn(manifest.files, function (data) {
    if (data.timestamp) {
      data.rename = {};
      data.rename.match = _.any(options.renameFileRegexs, function (regex) { return regex.test(data.fileName); });
      data.rename.fileName = Path.join(data.timestamp.format('YYYY-MM-DD'),
          data.timestamp.format('YYYYMMDD-HHmmss')) + '.jpg';
      renames[data.rename.fileName] = renames[data.rename.fileName] || [];
      renames[data.rename.fileName].push(data.fileName);
    }
  });
};

exports.read = function (options, callback) {
  Context.debug('Reading manifest from \'' + options.manifest + '\'');
  Async.waterfall([
    function (callback) {
      Fs.readFile(options.manifest, 'utf8', callback);
    },
    function (data, callback) {
      var manifest = JSON.parse(data);
      callback(null, manifest);
    }
  ], callback);
};

exports.scan = function (options, callback) {
  var manifest = {};
  manifest.files = {};
  Glob('**/*.{jpg,jpeg}', { nocase: true }, function (err, fileNames) {
    _.each(fileNames, function (fileName) {
      manifest.files[fileName] = {};
      manifest.files[fileName].fileName = fileName;
    });
    Async.each(fileNames, function (fileName, callback) {
      Async.parallel([
          function (callback) {
            sha1hex(fileName, function (err, hash) {
              manifest.files[fileName].hash = hash;
              callback(err);
            });
          },
          function (callback) {
            new ExifImage({ image: fileName }, function (err, exifData) {
              if (err) {
                Context.debug('exif error for \'' + fileName + '\': ' + err.message);
              } else {
                manifest.files[fileName].timestamp = Moment.utc(exifData.exif.DateTimeOriginal, 'YYYY:MM:DD HH:mm:ss');
              }
              callback();
            });
          }
      ], callback);
    }, function (err) {
      populateRenames(manifest, options);
      analyseHashes(manifest, options);
      callback(err, manifest);
    });
  });
};

exports.readOrScan = function (options, callback) {
  if (options.manifest) {
    exports.read(options, callback);
  } else {
    exports.scan(options, callback);
  }
};

exports.write = function (manifest, options, callback) {
  Context.log(Chalk.bold.blue('Writing manifest to \'' + options.manifest + '\''));
  Fs.writeFile(options.manifest, JSON.stringify(manifest, null, 2), callback);
};
