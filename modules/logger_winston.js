const path = require('path');

const winston = require('winston');

const rotateFile= require('winston-daily-rotate-file');

const printf = (info) => {
  const {
    timestamp, level, message, ...args
  } = info;

  const ts = timestamp.replace('T', ' ').replace('Z', ' ');
  return `${ts} [${level}]: ${message} ${Object.keys(args).length ? JSON.stringify(args/* , null, 2 */) : ''}`;
};


const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(printf)
);

module.exports = (loglevel = 'info', logpath = null) => {
  const transports = [];
  if (logpath) {
    transports.push(new rotateFile({
      filename: path.resolve(logpath, 'error.log'),
      handleExceptions: true,
      level: 'error',
      dirname: logpath,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: false, /* true - gezippte archive koennen nicht autom. geloescht werden; derzeit offener bug */
      /* https://github.com/winstonjs/winston-daily-rotate-file/issues/125 */
      maxSize: '10m',
      maxFiles: 5
    }));
    transports.push(new rotateFile({
      filename: path.resolve(logpath, 'combined.log'),
      handleExceptions: true,
      level: 'info',
      format: fileFormat,
      dirname: logpath,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: false, /* true - gezippte archive koennen nicht autom. geloescht werden; derzeit offener bug */
      /* https://github.com/winstonjs/winston-daily-rotate-file/issues/125 */
      maxSize: '10m',
      maxFiles: 5
    }));
    //Die json habe ich wieder auskommentiert, falls jemand die will kann er Sie einkommentieren
    // transports.push(new winston.transports.File({
    //   filename: path.resolve(logpath, 'combined.json'),
    //   handleExceptions: true,
    //   level: 'info'
    // }));
  }

  const logger = winston.createLogger({
    exitOnError: false,
    transports: transports
  });

  const selfCheck = (message, data, rest) => {
    if (rest.length && rest["0"]) {
      logger.error('LOGGER: too many parameters', rest);
    }
    if (typeof data !== 'object' && typeof data !== 'undefined') {
      logger.error('LOGGER: wrong type for data', {type: typeof data, data: data});
    }
  };

  const log = (loglevel, level, colorize = true, message=null, data=null) => {

    //level -> log art des eintrag
    //loglevel -> allgemeine einstellung
    if (!(loglevel >= 0) || loglevel >= level) {
      switch (level) {
        case 0:
          selfCheck(message, data, []);
          logger.error(message, data);
          break;
        case 1:
          selfCheck(message, data, []);
          logger.warn(message, data);
          break;
        case 2:
          selfCheck(message, data, []);
          logger.info(message, data);
          break;
        case 3:
          selfCheck(message, data, []);
          logger.debug(message, data);
          break;
      }
    }else{
      console.log('Ausgabe wird nicht getätigt weil');
      console.log( loglevel +' >= '+level);
    }
  };

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
      log(loglevelId, 0, null, ...params);
    },
    warn: (...params) => {
      log(loglevelId, 1, null, ...params);
    },
    info: (...params) => {
      log(loglevelId, 2, null, ...params);
    },
    debug: (...params) => {
      log(loglevelId, 3, null, ...params);
    }
  };
};
