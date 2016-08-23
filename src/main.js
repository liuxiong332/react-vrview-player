/*
 * Copyright 2015 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Disable distortion provided by the boilerplate because we are doing
// vertex-based distortion.
var WebVRConfig = window.WebVRConfig || {}
WebVRConfig.PREVENT_DISTORTION = true;

// Include relevant polyfills.
require('webvr-polyfill/src/main');

var PhotosphereRenderer = require('./photosphere-renderer');
var Emitter = require('./emitter');
var Util = require('./util');

module.exports = class RenderCreator {
  constructor(options = {}) {
    this.init(options);
  }

  init(options) {
    this.onLoad = options.onLoad;
    this.onError = options.onError;

    if (!Util.isWebGLEnabled()) {
      this.onError && this.onError(new Error('WebGL not supported.'));
      return;
    }

    this.onRenderLoad = this.onRenderLoad.bind(this);
    this.onVideoLoad = this.onVideoLoad.bind(this);
    this.onVideoTap = this.onVideoTap.bind(this);
    this.onVideoError = this.onVideoError.bind(this);

    this.renderer = new PhotosphereRenderer();
    this.canvas = this.renderer.getDOMElement();
    this.renderer.on('error', this.onRenderError.bind(this));

    this.loadScene(options);

    if (options.showStats) {
      showStats();
    }
  }

  loadScene(options) {
    let renderer = this.renderer;
    renderer.setDefaultLookDirection(options.yaw || 0);

    if (options.preview) {
      var onPreviewLoad = () => {
        this.onLoad && this.onLoad();
        renderer.removeListener('load', onPreviewLoad);
        renderer.setPhotosphere(options.image);
      }
      renderer.removeListener('load', this.onRenderLoad);
      renderer.on('load', onPreviewLoad);
      renderer.setPhotosphere(options.preview);
    } else if (options.video) {
      if (Util.isIOS() || Util.isIE11()) {
        // On iOS and IE 11, if an 'image' param is provided, load it instead of
        // showing an error.
        //
        // TODO(smus): Once video textures are supported, remove this fallback.
        this.onError && this.onError(new Error('Video is not supported on this platform (iOS or IE11).'));
      } else {
        // Load the video element.
        let videoElement = document.createElement('video');
        videoElement.src = options.video;
        videoElement.loop = true;
        videoElement.setAttribute('crossorigin', 'anonymous');
        videoElement.addEventListener('canplaythrough', this.onVideoLoad);
        videoElement.addEventListener('error', this.onVideoError);
        this.videoElement = videoElement;
      }
    } else if (options.image) {
      // Otherwise, just render the photosphere.
      renderer.on('load', this.onRenderLoad);
      renderer.setPhotosphere(options.image);
    }
  }

  onVideoLoad(event) {
    let videoElement = event.target;
    this.renderer.set360Video(videoElement);

    // On mobile, tell the user they need to tap to start. Otherwise, autoplay.
    if (!Util.isMobile()) {
      // Hide loading indicator.
      this.onLoad && this.onLoad();
      // Autoplay the video on desktop.
      videoElement.play();
    } else {
      // Tell user to tap to start.
      document.body.addEventListener('touchend', this.onVideoTap);
    }

    // Prevent onVideoLoad from firing multiple times.
    videoElement.removeEventListener('canplaythrough', this.onVideoLoad);
  }

  onVideoTap() {
    videoElement.play();

    // Prevent multiple play() calls on the video element.
    document.body.removeEventListener('touchend', this.onVideoTap);
  }

  onRenderLoad() {
    // Hide loading indicator.
    this.onLoad && this.onLoad();
  }

  onRenderError(message) {
    this.onError && this.onError(new Error('Render: ' + message));
  }

  onVideoError(e) {
    this.onError && this.onError(e.target.error);
  }

  showStats() {
    var Stats = require('./stats');
    var stats = this.stats = new Stats();
    stats.setMode(0); // 0: fps, 1: ms

    // Align bottom-left.
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.bottom = '0px';
    document.body.appendChild(stats.domElement);
  }

  renderWithStats() {
    const loop = (time) => {
      this.stats.begin();
      this.renderer.render(time);
      this.stats.end();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  render() {
    const loop = (time) => {
      this.renderer.render(time);
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }
}
