import ReactDOM from 'react-dom';
import React from 'react';
var PlayerElement = require('./playerElement');

ReactDOM.render((
  <vrview-player
    video="http://whilevr-10053076.cos.myqcloud.com/f2118430-651d-11e6-8617-1b9fac22bf1b"
    yaw={90}
  />
), document.getElementById('react-app'));
