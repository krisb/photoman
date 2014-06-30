// Load modules
var CLS = require('continuation-local-storage');
var Cp = require('child_process');

var namespace = CLS.createNamespace('photoman');

exports.run = function (options, callback) {
  namespace.run(function () {
    namespace.set('options', options);
    callback();
  });
};

exports.log = function () {
  console.log.apply(this, arguments);
};

exports.debug = function () {
  var options = namespace.get('options');
  if (options.verbose || options.trace) {
    console.log.apply(this, arguments);
  }
};

exports.trace = function () {
  var options = namespace.get('options');
  if (options.trace) {
    console.log.apply(this, arguments);
  }
};

exports.exec = function (command, args, callback) {
  var child = Cp.spawn(command, args);
  var stdout = '';
  var stderr = '';
  var error;
  namespace.bindEmitter(child);
  exports.trace('spawn: ', command, args);

  child.stdout.on('data', function (data) {
    stdout += data;
  });

  child.stderr.on('data', function (data) {
    stderr += data;
  });

  child.on('error', function (err) {
    error = err;
  });

  child.on('close', function (code) {
    exports.trace('child process exited with code ' + code);
    exports.trace('stdout:' + stdout);
    exports.trace('stderr:' + stderr);
    exports.trace('error: ' + error);
    callback(error, stdout, stderr);
  });
};
