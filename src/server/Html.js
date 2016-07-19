/* eslint react/no-danger:0 */
import React, {Component, PropTypes} from 'react';
import {RouterContext} from 'react-router';
import {renderToString} from 'react-dom-stream/server';

// Injects the server rendered state and app into a basic html template
export default class Html extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    assets: PropTypes.object,
    renderProps: PropTypes.object,
  }

  render() {
    const PROD = !__DEV__;
    const {title, assets, renderProps} = this.props;
    const {main} = assets || {};
    const root = PROD && renderToString(<RouterContext {...renderProps}/>);
    return (
      <html>
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="shortcut icon" type="image/x-icon" href="/images/test.ico" media="screen" />
          <meta charSet="utf-8"/>
          {PROD && <link rel="stylesheet" href={main.css} type="text/css"/>}
          <title>{title}</title>
        </head>
        <body>
          {PROD ? <div id="react-app" dangerouslySetInnerHTML={{__html: root}}></div> : <div id="react-app"/>}
          <script src={PROD ? main.js : '/static/bundle.js'}/>
        </body>
      </html>
    );
  }
}
