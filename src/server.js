/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import 'babel-polyfill';
import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import ReactDOM from 'react-dom/server';
import { match } from 'universal-router';
import PrettyError from 'pretty-error';
import models from './data/models';
import routes from './routes';
import assets from './assets';
import { port, analytics, showLog } from './config';
import configureStore from './store/configureStore';
import { setRuntimeVariable } from './actions/runtime';

import regData from './api/controllers/RegistrationData';
import statCtrl from './api/controllers/stat';
import acceptorsCtrl from './api/controllers/acceptors';
import wxeAuthCtrl from './api/controllers/wxe-auth';
import profileCtrl from './api/controllers/profiles';
import zxjApplyCtrl from './api/controllers/zxj-apply';
const app = express();

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser('jkef.nagu.cc cookie key'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
if (showLog) {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}
/*
注册API
 */
app.use('/api/fundinfo', regData);
app.use('/api/stat', statCtrl);
app.use('/api/acceptors', acceptorsCtrl);
app.use('/api/fundinfo', regData);
require('./api/controllers/worker');
app.use('/api/wxe-auth', wxeAuthCtrl);
app.use('/api/profiles', profileCtrl);
app.use('/api/zxj-apply', zxjApplyCtrl);

//
// Register API middleware
// -----------------------------------------------------------------------------

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
app.get('*', async (req, res, next) => {
  try {
    let css = [];
    let statusCode = 200;
    const template = require('./views/index.jade');
    const data = { title: '', description: '', css: '', body: '', entry: assets.main.js };

    if (process.env.NODE_ENV === 'production') {
      data.trackingId = analytics.google.trackingId;
    }

    const store = configureStore({});

    store.dispatch(setRuntimeVariable({
      name: 'initialNow',
      value: Date.now(),
    }));

    await match(routes, {
      path: req.path,
      query: req.query,
      context: {
        store,
        insertCss: styles => css.push(styles._getCss()),
        setTitle: value => (data.title = value),
        setMeta: (key, value) => (data[key] = value),
      },
      render(component, status = 200) {
        css = [];
        statusCode = status;
        data.state = JSON.stringify(store.getState());
        data.body = ReactDOM.renderToString(component);
        data.css = css.join('');
        return true;
      },
    });

    res.status(statusCode);
    res.send(template(data));
  } catch (err) {
    next(err);
  }
});

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.log(pe.render(err)); // eslint-disable-line no-console
  const template = require('./views/error.jade');
  const statusCode = err.status || 500;
  res.status(statusCode);
  res.send(template({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '' : err.stack,
  }));
});

//
// Launch the server
// -----------------------------------------------------------------------------
/* eslint-disable no-console */
models.sync().catch(err => console.error(err.stack)).then(() => {
  app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}/`);
  });
});
/* eslint-enable no-console */
