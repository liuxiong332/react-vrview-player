import ReactDOM from 'react-dom';
import React from 'react';
var RenderCreator = require('./main');

ReactDOM.render(<div>Hello world</div>, document.getElementById('react-app'));
let creator = new RenderCreator({
  video: "http://whilevr-10053076.cos.myqcloud.com/f2118430-651d-11e6-8617-1b9fac22bf1b",
  yaw: 90,
  onError(err) {
    console.error(err);
  }
});
document.body.appendChild(creator.canvas);
creator.render();
