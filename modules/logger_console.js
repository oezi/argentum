const colors = require('colors/safe');

const log = (loglevel, level, ...params) => {
  if (!(loglevel >= 0) || loglevel >= level) {
    let output = console.log;
    let color = (r) => r;
    let logname = ':\t';
    switch (level) {
      case 0:
        output = console.error;
        color = colors.reset.red.bold;
        logname = '[error]:\t';
        break;
      case 1:
        output = console.warn;
        color = colors.reset.yellow.bold;
        logname = '[warn]:\t';
        break;
      case 2:
        output = console.info;
        color = colors.reset;
        logname = '[info]:\t';
        break;
      case 3:
        output = console.log;
        color = colors.reset.cyan;
        logname = '[debug]:\t';
        break;
    }
    /* params = params.map((p) => (typeof p === 'object' && !(p instanceof Error)) ? color(JSON.stringify(p, function (key, value) {
      if (value && typeof value === 'object' && !value.toJSON) {
        const replacement = {};
        Object.getOwnPropertyNames(value).forEach(function (key) {
          replacement[key] = value[key];
        });
        return replacement;
      }
      return value;
    }, (level === 0 || level === 3) ? 2 : null)) : color(p)); */
    params = params.map((p) => color(p));
    output(color('[' + new Date().toISOString() + ']'), color(logname), ...params);
  }
};

module.exports = (loglevel = 'info', logpath = null) => {
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
      log(loglevelId, 0, ...params);
    },
    warn: (...params) => {
      log(loglevelId, 1, ...params);
    },
    info: (...params) => {
      log(loglevelId, 2, ...params);
    },
    debug: (...params) => {
      log(loglevelId, 3, ...params);
    }
  };
};
