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

const logger = require('./modules/logger');

module.exports = {
  express,
  compression,
  helmet,
  bodyparser,
  pgpromise,
  mssql,
  logger,
  session,
  csrf,
  cors,
  PgSession
};
