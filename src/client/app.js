import ReactDOM from 'react-dom';
import React from 'react';
import { Router, browserHistory } from 'react-router'

import routes from '../universal/router';
import "../../assets/style.scss";

ReactDOM.render(<Router routes={routes()} history={browserHistory}/>,
  document.getElementById('react-app'));
