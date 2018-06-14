const path = require('path');

const winston = require('winston');

const printf = (info) => {
  const {
    timestamp, level, message, ...args
  } = info;

  const ts = timestamp.replace('T', ' ').replace('Z', ' ');
  return `${ts} [${level}]: ${message} ${Object.keys(args).length ? JSON.stringify(args/* , null, 2 */) : ''}`;
};

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.align(),
  winston.format.printf(printf)
);

const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(printf)
);

module.exports = (loglevel = 'info', logpath = null) => {
  const transports = [
    new winston.transports.Console({
      handleExceptions: true,
      level: loglevel,
      format: consoleFormat
    })
  ];
  if (logpath) {
    transports.push(new winston.transports.File({
      filename: path.resolve(logpath, 'error.log'),
      handleExceptions: true,
      level: 'error',
      format: fileFormat
    }));
    transports.push(new winston.transports.File({
      filename: path.resolve(logpath, 'combined.log'),
      handleExceptions: true,
      level: 'info',
      format: fileFormat
    }));
    transports.push(new winston.transports.File({
      filename: path.resolve(logpath, 'combined.json'),
      handleExceptions: true,
      level: 'info'
    }));
  }

  const logger = winston.createLogger({
    exitOnError: false,
    transports: transports
  });

  const selfCheck = (message, data, rest) => {
    if (rest.length) {
      logger.error('LOGGER: too many parameters', rest);
    }
    if (typeof data !== 'object' && typeof data !== 'undefined') {
      logger.error('LOGGER: wrong type for data', {type: typeof data, data: data});
    }
  };

  return {
    error: (message, data, ...rest) => {
      selfCheck(message, data, rest);
      logger.error(message, data);
    },
    warn: (message, data, ...rest) => {
      selfCheck(message, data, rest);
      logger.warn(message, data);
    },
    info: (message, data, ...rest) => {
      selfCheck(message, data, rest);
      logger.info(message, data);
    },
    debug: (message, data, ...rest) => {
      selfCheck(message, data, rest);
      logger.debug(message, data);
    }
  };
};
