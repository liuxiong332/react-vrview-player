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
var SceneInfo = require('./scene-info');

function SceneLoader() {
}
SceneLoader.prototype = new Emitter();

SceneLoader.prototype.loadScene = function(callback) {
  var params = {
    image: null,
    video: "http://whilevr-10053076.cos.myqcloud.com/f2118430-651d-11e6-8617-1b9fac22bf1b",
  };

  var scene = new SceneInfo(params);
  this.emit('load', scene);
};

module.exports = SceneLoader;
