import React from 'react';
import Html from './Html';
import {renderToStaticMarkup} from 'react-dom-stream/server';
import fs from 'fs';
import {join, basename} from 'path';
import promisify from 'es6-promisify';

function renderApp(res, assets, component) {
  const htmlStream = renderToStaticMarkup(<Html
    title="Title"
    assets={assets}
    component={component}
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
    const component = require('../../src/index').default;
    const assets = require('../../dist/webpack-assets.json');
    renderApp(res, assets, component);
  }
}
