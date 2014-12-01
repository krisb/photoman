var Chalk = require('chalk');
var Fs = require('graceful-fs');
var Os = require('os');
var Path = require('path');

var Context = require('../context');

var task = {
  name: 'init',
  synopsis: 'init [dir]',
  description: 'creates .photomanrc in supplied directory or user.home if not supplied',
  options: []
};

var getUserHome = function () {
  return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
};

task.invoke = function (args, options, callback) {
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

exports = module.exports = task;
