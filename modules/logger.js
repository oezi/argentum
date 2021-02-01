const logger_console = require('./logger_console');
const logger_winston = require('./logger_winston');
module.exports = (loglevel = 'info', logpath = null, colorize = null, console2 = true, file = true) => {

  let loglevelId = 3;
  switch (loglevel) {
    case 'error':
      loglevelId = 0;
      break;
    case 'warn':
      loglevelId = 1;
      break;
    case 'debug':
      loglevelId = 3;
      break;
    case 'info':
    default:
      loglevelId = 2;
      break;
  }
console.log('loglevel , logpath , colorize, console2, file');
console.log(loglevel , logpath , colorize, console2, file);
 // debug /tmp null true null
  return {
    error: (...params) => {
      if (console2) {
        logger_console(loglevelId, logpath, colorize, ...params).error(...params);
      }
      if (file) {
        logger_winston(loglevel, logpath);
      }
    },
    warn: (...params) => {
      if (console2) {
        logger_console(loglevelId, logpath, colorize, ...params).warn(...params);
      }
      if (file) {
        logger_winston(loglevel, logpath);
      }
    },
    info: (...params) => {
      if (console2) {
        logger_console(loglevelId, logpath, colorize, ...params).info(...params);
      }
      if (file) {
        logger_winston(loglevel, logpath);
      }
    },
    debug: (...params) => {
      if (console2) {
        logger_console(loglevelId, logpath, colorize, ...params).debug(...params);
      }
      if (file) {
        logger_winston(loglevel, logpath);
      }
    }
  };
};

