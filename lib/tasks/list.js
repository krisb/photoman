var Context = require('../context');

exports.invoke = function (args, callback) {
  Context.exec('ls', ['-la', '/Volumes'], function() {
    console.log('hello');
  });
};
