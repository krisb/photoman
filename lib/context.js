// Load modules
var CLS = require('continuation-local-storage');
var Cp = require('child_process');

var namespace = CLS.createNamespace('photoman');

exports.run = function(options, env, callback) {
  namespace.run(function () {
    namespace.set('env', env);
    namespace.set('options', options);
    callback();
  });
};

exports.log = function() {
  console.log.apply(this, arguments);
};

exports.debug = function() {
  var options = namespace.get('options');
  if (options.verbose || options.trace) {
    console.log.apply(this, arguments);
  }
};

exports.trace = function() {
  var options = namespace.get('options');
  if (options.trace) {
    console.log.apply(this, arguments);
  }
};

exports.exec = function(command, callback) {
  exports.trace('exec: ' + command);
  var child = Cp.exec(command, function (error, stdout, stderr) {
    exports.trace('stdout:' + stdout);
    exports.trace('stderr:' + stderr);
    exports.trace('error: ' + error);
    callback(error, stdout, stderr);
  });
  namespace.bindEmitter(child);
};
