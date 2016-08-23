var RenderCreator = require('./main');

class PlayerElement extends HTMLElement {
  get videoElement() {
    return this.player.videoElement;
  }

  get canvas() {
    return this.player.canvas;
  }

  get renderer() {
    return this.player.renderer;
  }

  onError(err) {
    this.dispatchEvent(new ErrorEvent('error', {error: err}));
  }

  attachedCallback() {
    let video = this.getAttribute('video');
    let yaw = this.getAttribute('yaw') || 0;
    this.player = new RenderCreator({
      video, yaw, onError: this.onError.bind(this),
    });
    this.appendChild(this.player.canvas);
    this.player.render();
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (!this.player) {
      return;
    }
    switch(attrName) {
      case 'video': this.player.videoElement.src = newVal; break;
      case 'yaw':
        this.player.renderer.setDefaultLookDirection(newVal);
        break;
    }
  }
}

module.exports = document.registerElement("vrview-player", PlayerElement);
