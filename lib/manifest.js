var Crypto = require('crypto');
var Path = require('path');

var _ = require('lodash');
var Async = require('async');
var ExifImage = require('exif').ExifImage;
var Fs = require('graceful-fs');
var Glob = require('glob');
var Moment = require('moment');

var Context = require('./context');

var sha1hex = function (filename, callback) {
  var shasum = Crypto.createHash('sha1');

  var s = Fs.ReadStream(filename);

  Fs.stat(filename, function (err, stats) {
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

exports.scan = function (options, callback) {
  var manifest = {};
  Glob('**/*.{jpg,jpeg}', { nocase: true }, function (err, files) {
    _.each(files, function (file) {
      manifest[file] = {};
      manifest[file].file = file;
      manifest[file].renameMatch = _.any(options.renameFileRegexs, function (regex) { return regex.test(file); });
      manifest[file].ext = '.jpg';
    });
    Async.each(files, function (file, callback) {
      Async.parallel([
          function (callback) {
            sha1hex(file, function (err, hash) {
              manifest[file].hash = hash;
              callback(err);
            });
          },
          function (callback) {
            new ExifImage({ image: file }, function (err, exifData) {
              if (err) {
                Context.debug('exif error for \'' + file + '\': ' + err.message);
              } else {
                manifest[file].timestamp = Moment.utc(exifData.exif.DateTimeOriginal, 'YYYY:MM:DD HH:mm:ss');
                manifest[file].renameFile = Path.join(manifest[file].timestamp.format('YYYY-MM-DD'),
                    manifest[file].timestamp.format('YYYYMMDD-HHmmss') + manifest[file].ext);
              }
              callback();
            });
          }
      ], callback);
    }, function (err) {
      callback(err, manifest);
    });
  });

};
