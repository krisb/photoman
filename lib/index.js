// Load modules
var Tasks = require('./tasks');
var Context = require('./context');

exports.execute = function(args, options, env) {
  Context.run(options, env, function() {
    var task = Tasks[args.shift()];
    task.invoke(args, function() {});
  });
};
