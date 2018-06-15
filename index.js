const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const bodyparser = require('body-parser');
const pgpromise = require('pg-promise');
const mssql = require('mssql');
const session = require('express-session');
const csrf = require('csurf');
const cors = require('cors');
const PgSession = require('connect-pg-simple')(session);

const soap = require('./modules/soap');
const logger = require('./modules/logger');

const defaults = {
  port: 80,
  staticFiles: ['./dist'],
  compression: true,
  log: {
    level: 'info',
    path: null
  },
  soap: {
    wsdl: null,
    options: null
  }
};
const argentum = async (settings = {}) => {
  const conf = {...defaults, ...settings};
  if (settings.log) {
    conf.log = {...defaults.log, ...settings.log};
  }
  if (settings.soap) {
    conf.soap = {...defaults.soap, ...settings.soap};
  }

  const app = {conf};

  // logger
  app.log = argentum.logger(conf.log.level || 'info', conf.log.path || null);

  // soap
  if (conf.soap.wsdl) {
    app.soap = (await soap(conf.soap.wsdl || '', conf.soap.options || {}))();
  }

  // express
  if (conf.port) {
    app.express = express();
    app.express.disable('x-powered-by');
    app.express.disable('etag');
    app.express.use(helmet());
    app.express.use(argentum.bodyparser.json());
    app.express.use(argentum.bodyparser.urlencoded({
      extended: true
    }));

    if (conf.staticFiles) {
      if (conf.staticFiles.length) {
        conf.staticFiles.forEach((path) => {
          app.express.use(express.static(path));
        });
      } else {
        app.express.use(express.static(conf.staticFiles));
      }
    }

    if (conf.compression) {
      app.express.use(compression());
    }

    app.express.listen(conf.port);
  }

  return app;
};
argentum.express = express;
argentum.compression = compression;
argentum.helmet = helmet;
argentum.bodyparser = bodyparser;
argentum.pgpromise = pgpromise;
argentum.mssql = mssql;
argentum.logger = logger;
argentum.soap = soap;
argentum.session = session;
argentum.csrf = csrf;
argentum.cors = cors;
argentum.PgSession = PgSession;

module.exports = argentum;
