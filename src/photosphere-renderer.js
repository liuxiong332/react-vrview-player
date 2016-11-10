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

var Emitter = require('./emitter');
var THREE = require('three');
window.THREE = THREE;
require('three/examples/js/controls/VRControls');
require('three/examples/js/effects/VREffect');
var Util = require('./util');

const XRevertMatrix = new THREE.Matrix4().makeScale(-1, 1, 1);

class PhotosphereRenderer extends Emitter {
  constructor() {
    super();
    this.init();
  }

  init() {
    this.clearVRDisplay();
    var camera = new THREE.PerspectiveCamera(120, window.innerWidth / window.innerHeight, 0.1, 100);
    var cameraDummy = new THREE.Object3D();
    cameraDummy.add(camera);

    // Antialiasing temporarily disabled to improve performance.
    var renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Round down fractional DPR values for better performance.
    renderer.setPixelRatio(Math.max(1, Math.floor(window.devicePixelRatio)));

    var controls = new THREE.VRControls(camera);
    var effect = new THREE.VREffect(renderer);
    effect.setSize(window.innerWidth, window.innerHeight);

    this.onMouseWheel_ = this.onMouseWheel_.bind(this);
    window.addEventListener('wheel', this.onMouseWheel_);

    this.minFocalLength = 3;
    this.maxFocalLength = 36;

    this.camera = camera;
    this.renderer = renderer;
    this.effect = effect;
    this.controls = controls;
    this.initScenes_();
  }

  clearVRDisplay() {
    if (navigator.getVRDisplays) {
      navigator.getVRDisplays().then((displays) => {
        displays.forEach((vrDisplay) => {
          vrDisplay && vrDisplay.resetPose();
        });
      });
    }
  }

  getDOMElement() {
    return this.renderer.domElement;
  }

  requestFullscreen() {
    return requestFullscreen(this.renderer.domElement);
  }

  exitFullscreen() {
    return exitFullscreen(this.renderer.domElement);
  }

  requestPresent() {
    return this.effect.requestPresent();
  }

  exitPresent() {
    return this.effect.exitPresent();
  }

  isPresenting() {
    return this.effect.isPresenting();
  }

  render(timestamp) {
    this.controls.update();
    this.effect.render(this.scene, this.camera);
  }

  setDefaultLookDirection(phi) {
    // Rotate the camera parent to take into account the scene's rotation.
    this.camera.parent.rotation.y = phi;
  }


  /**
   * Sets the photosphere based on the image in the source. Supports stereo and
   * mono photospheres.
   *
   * Emits 'load' and 'error' events.
   */
  setPhotosphere(src) {
    this.src = src;

    // Load texture.
    var loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';
    loader.load(src, this.onTextureLoaded_.bind(this), null, this.onTextureError_.bind(this));
  }

  set360Video(videoElement) {
    // Load the video texture.
    var videoTexture = new THREE.VideoTexture(videoElement);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.format = THREE.RGBFormat;
    videoTexture.generateMipmaps = false;
    videoTexture.needsUpdate = true;

    this.onTextureLoaded_(videoTexture);
  }

  setFocalLengthLimit(min, max) {
    if (min) {
      this.minFocalLength = min;
    }
    if (max) {
      this.maxFocalLength = max;
    }
  }

  initScenes_() {
    this.scene = this.createScene_();
    this.scene.add(this.camera.parent);
  }

  static isMouseEventInElement(event, element) {
    let rect = element.getBoundingClientRect();
    let pageX = event.pageX - window.scrollX;
    let pageY = event.pageY - window.scrollY;
    return pageX > rect.left && pageX < rect.right && pageY > rect.top && pageY < rect.bottom;
  }

  onMouseWheel_(event) {
    if (PhotosphereRenderer.isMouseEventInElement(event, this.renderer.domElement)) {
      let length = this.camera.getFocalLength();
      let delta = length * event.deltaY / 1000;
      length = length - delta;
      length = Math.min(Math.max(length, this.minFocalLength), this.maxFocalLength);
      this.camera.setFocalLength(length);
      event.stopImmediatePropagation();
      event.preventDefault();
    }
  }

  onTextureLoaded_(texture) {
    var sphere = this.createPhotosphere_(texture);
    this.scene.getObjectByName('photo').children = [sphere];
    this.emit('load');
  }

  onTextureError_(error) {
    this.emit('error', 'Unable to load texture from ' + this.src);
  }

  createPhotosphere_(texture) {

    var geometry = new THREE.SphereGeometry(1, 48, 48, 0, Math.PI * 2, 0, Math.PI);
    geometry.applyMatrix(XRevertMatrix);

    var material = new THREE.MeshBasicMaterial({ map: texture });
    // this.distorter.setMap(texture);
    var out = new THREE.Mesh(geometry, material);
    out.renderOrder = -1;
    return out;
  }

  createScene_(opt_params) {
    var scene = new THREE.Scene();
    // Add a light.
    scene.add(new THREE.PointLight(0xFFFFFF));

    // Add a group for the photosphere.
    var photoGroup = new THREE.Object3D();
    photoGroup.name = 'photo';
    scene.add(photoGroup);

    return scene;
  }

  destroy() {
    window.removeEventListener('wheel', this.onMouseWheel_);
  }
}

function requestFullscreen(canvas) {
  var requestFullscreen =
    canvas.requestFullScreen ||
    canvas.webkitRequestFullScreen ||
    canvas.mozRequestFullScreen;
  requestFullscreen.apply(canvas);
}

function exitFullscreen(canvas) {
  var exitFullscreen =
    canvas.exitFullscreen ||
    canvas.mozCancelFullScreen ||
    canvas.webkitExitFullscreen;
  if (exitFullscreen) {
    exitFullscreen.apply(canvas);
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

module.exports = PhotosphereRenderer;
