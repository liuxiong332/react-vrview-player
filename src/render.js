import ReactDOM from 'react-dom';
import React from 'react';
var RenderCreator = require('./main');

ReactDOM.render(<div>Hello world</div>, document.getElementById('react-app'));
let creator = new RenderCreator({
  video: "http://whilevr-10053076.cos.myqcloud.com/f2118430-651d-11e6-8617-1b9fac22bf1b",
  yaw: 90,
});
creator.on('error', (err) => {
  console.log(err);
});
creator.on('load', () => {
  console.log('load');
});
document.body.appendChild(creator.renderer.getDOMElement());
creator.render();
