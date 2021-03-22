const logger_console = require('./logger_console');
const logger_winston = require('./logger_winston');
module.exports = (loglevel = 'debug', logpath = null, colorize = null, consoleLog = true, file = false) => {

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

  return {
    error: (...params) => {
      if (consoleLog) {
        logger_console(loglevelId, logpath, colorize, ...params).error(...params);
      }
      if (file) {
        logger_winston(loglevel, logpath).error(...params);
      }
    },
    warn: (...params) => {
      if (consoleLog) {
        logger_console(loglevelId, logpath, colorize, ...params).warn(...params);
      }
      if (file) {
        logger_winston(loglevel, logpath).warn(...params);
      }
    },
    info: (...params) => {
      if (consoleLog) {
        logger_console(loglevelId, logpath, colorize, ...params).info(...params);
      }
      if (file) {
        logger_winston(loglevel, logpath).info(...params);
      }
    },
    debug: (...params) => {
      if (consoleLog) {
        logger_console(loglevelId, logpath, colorize, ...params).debug(...params);
      }
      if (file) {
        logger_winston(loglevel, logpath).debug(...params);
      }
    }
  };
};

