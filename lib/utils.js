// Load modules
var Cp = require('child_process');
var Context = require('./context');

// Declare internals

var internals = {};

exports.exec = function(command, callback) {
  Context.trace('exec: ' + command);
  Cp.exec(command, function (error, stdout, stderr) {
    Context.trace('stdout:' + stdout);
    Context.trace('stderr:' + stderr);
    Context.trace('error: ' + error);
    callback(error, stdout, stderr);
  });
};
