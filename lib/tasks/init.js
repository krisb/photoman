var Context = require('../context');
var Utils = require('../utils');

exports.invoke = function (args, callback) {
  Context.log('log comment', args);
  Context.trace('trace comment', args);
  callback();
};
