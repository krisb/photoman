var Context = require('../context');
var Glob = require('glob');
var Async = require('async');
var Crypto = require('crypto');
var Fs = require('fs');

var sha1hex = function (filename, callback) {
  var shasum = Crypto.createHash('sha1');

  var s = Fs.ReadStream(filename);

  Fs.stat(filename, function (err, stats) {
    shasum.update('blob ' + stats.size + '\0');

    s.on('data', function(d) {
      shasum.update(d);
    });

    s.on('end', function() {
      var d = shasum.digest('hex');
      callback(err, d);
    });
  });

};

exports.invoke = function (args, callback) {
  var manifest = {};

  Glob("**/*.{jpg,jpeg}", { nocase: true }, function (err, files) {
    Async.each(files, function (file, callback) {
      sha1hex(file, function(err, hash) {
        manifest[hash] = manifest[hash] || [];
        manifest[hash].push(file);
        callback(err);
      });
    }, function(err) {
      Context.log(JSON.stringify(manifest, null, 2));
      callback(err);
    });
  });

};
