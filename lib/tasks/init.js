var Fs = require('fs');
var Os = require('os');

var Chalk = require('chalk');

var Context = require('../context');

exports.invoke = function (args, callback) {
  var fileName = '.photomanrc';
  if (Fs.existsSync(fileName)) {
    Context.log(Chalk.bold.blue('Found \'' + fileName + '\' at \'' + process.cwd() + '\' - skipping'));
  } else {
    Context.log(Chalk.green('Initialised \'' + fileName + '\' in \'' + process.cwd() + '\''));
    Fs.writeFileSync(fileName, JSON.stringify(this, null, 2) + Os.EOL);
  }
  callback();
};
