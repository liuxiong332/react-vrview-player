import React from 'react';
import {match} from 'react-router';
import Html from './Html';
import {renderToStaticMarkup} from 'react-dom-stream/server';
import fs from 'fs';
import {join, basename} from 'path';
import promisify from 'es6-promisify';

function renderApp(res, assets, renderProps) {
  const htmlStream = renderToStaticMarkup(<Html
    title="Title"
    assets={assets}
    renderProps={renderProps}
  />);
  res.write('<!DOCTYPE html>');
  htmlStream.pipe(res, {end: false});
  htmlStream.on('end', () => res.end());
}

export default async function createSSR(req, res) {
  if (__DEV__) {
    // just send a cheap html doc + stringified store
    renderApp(res);
  } else {
    const routeCreator = require('../universal/router').default;
    const assets = require('../../dist/webpack-assets.json');
    match({routes: routeCreator(), location: req.url}, (error, redirectLocation, renderProps) => {
      if (error) {
        res.status(500).send(error.message);
      } else if (redirectLocation) {
        res.redirect(redirectLocation.pathname + redirectLocation.search);
      } else if (renderProps) {
        renderApp(res, assets, renderProps);
      } else {
        res.status(404).send('Not found');
      }
    });
  }
}
