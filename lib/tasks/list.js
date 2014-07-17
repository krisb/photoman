var Context = require('../context');
var Manifest = require('../manifest');

exports.invoke = function (args, options, callback) {
  Manifest.scan(options, function (err, manifest) {
    Context.log(JSON.stringify(manifest, null, 2));
    callback(err);
  });
};
