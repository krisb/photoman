var Context = require('../context');

exports.invoke = function (args, callback) {
  Context.log('log comment', args);
  Context.trace('trace comment', args);
  callback();
};
