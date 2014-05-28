var Utils = require('../utils');

exports.invoke = function (args, callback) {
  Utils.exec('ls -la', callback);
};
