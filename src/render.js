import ReactDOM from 'react-dom';
import React from 'react';
var PlayerElement = require('./playerElement');
var Creator = require('./main');

ReactDOM.render((
  <vrview-player
    video="http://whilevr-10053076.cos.myqcloud.com/f2118430-651d-11e6-8617-1b9fac22bf1b"
    yaw={90}
  />
), document.getElementById('react-app'));

let creator = new Creator({
  video: 'http://whilevr-10053076.cos.myqcloud.com/f2118430-651d-11e6-8617-1b9fac22bf1b',
  yaw: 90,
  onLoad: function() {
    creator.videoElement.currentTime = creator.videoElement.duration / 2;
    creator.videoElement.addEventListener('playing', function() {
      console.log('playing');
      creator.renderer.effect.setSize(256, 256);
      creator.renderer.render();
      let dataUrl = creator.canvas.toDataURL('image/png');
      let image = document.createElement('img');
      image.src = dataUrl;
      document.body.appendChild(image);
    })
  }
});
