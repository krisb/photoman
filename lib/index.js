var Tasks = require('./tasks');
var Context = require('./context');

exports.execute = function (args, options) {
  Context.run(options, function () {
    var task = Tasks[args.shift()];
    task.invoke(args, options, function (err) {
      if (err) {
        Context.log('error: ', err.message, err);
      }
    });
  });
};
