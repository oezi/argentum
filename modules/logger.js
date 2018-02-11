const colors = require('colors/safe');

const log = (loglevel, level, ...params) => {
  if (!(loglevel >= 0) || loglevel >= level) {
    let output = console.log;
    let color = (r) => r;
    switch (level) {
      case 0:
        output = console.error;
        color = colors.reset.red.bold;
        break;
      case 1:
        color = colors.reset.yellow.bold;
        break;
      case 2:
        color = colors.reset;
        break;
      case 3:
        color = colors.reset.cyan;
        break;
    }
    params = params.map((p) => typeof p === 'object' ? p : color(p));
    output(color(new Date().toISOString()), ...params);
  }
};

module.exports = (loglevel) => ({
  error: (...params) => {
    log(loglevel, 0, ...params);
  },
  warn: (...params) => {
    log(loglevel, 1, ...params);
  },
  info: (...params) => {
    log(loglevel, 2, ...params);
  },
  debug: (...params) => {
    log(loglevel, 3, ...params);
  }
});
