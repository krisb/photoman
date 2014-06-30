var Fs = require('fs');
var Os = require('os');
var Path = require('path');

var Chalk = require('chalk');

var Context = require('../context');

var getUserHome = function () {
  return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
};

exports.invoke = function (args, options, callback) {
  var path = args[0] || getUserHome();
  var fileName = Path.join(path, '.photomanrc');
  if (Fs.existsSync(fileName)) {
    Context.log(Chalk.bold.blue('Found .photomanrc at \'' + path + '\' - skipping'));
  } else {
    Context.log(Chalk.green('Initialised .photomanrc in \'' + path + '\''));
    Fs.writeFileSync(fileName, JSON.stringify(this, null, 2) + Os.EOL);
  }
  callback();
};
