"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _keplerOutdatedDeck = require("kepler-outdated-deck.gl-core");

var _keplerOutdatedLuma = _interopRequireDefault(require("kepler-outdated-luma.gl-constants"));

var _keplerOutdatedLuma2 = require("kepler-outdated-luma.gl-core");

var _meshLayerVertex = _interopRequireDefault(require("./mesh-layer-vertex.glsl"));

var _meshLayerFragment = _interopRequireDefault(require("./mesh-layer-fragment.glsl"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Note: This file will either be moved back to deck.gl or reformatted to web-monorepo standards
// Disabling lint temporarily to facilitate copying code in and out of this repo

/* eslint-disable */
// Copyright (c) 2015 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
var fp64LowPart = _keplerOutdatedLuma2.fp64.fp64LowPart;
var RADIAN_PER_DEGREE = Math.PI / 180; // Replacement for the external assert method to reduce bundle size

function assert(condition, message) {
  if (!condition) {
    throw new Error("deck.gl: ".concat(message));
  }
}
/*
 * Load image data into luma.gl Texture2D objects
 * @param {WebGLContext} gl
 * @param {String|Texture2D|HTMLImageElement|Uint8ClampedArray} src - source of image data
 *   can be url string, Texture2D object, HTMLImageElement or pixel array
 * @returns {Promise} resolves to an object with name -> texture mapping
 */


function getTexture(gl, src, opts) {
  if (typeof src === 'string') {
    // Url, load the image
    return (0, _keplerOutdatedLuma2.loadTextures)(gl, Object.assign({
      urls: [src]
    }, opts)).then(function (textures) {
      return textures[0];
    }).catch(function (error) {
      throw new Error("Could not load texture from ".concat(src, ": ").concat(error));
    });
  }

  return new Promise(function (resolve) {
    return resolve(getTextureFromData(gl, src, opts));
  });
}
/*
 * Convert image data into texture
 * @returns {Texture2D} texture
 */


function getTextureFromData(gl, data, opts) {
  if (data instanceof _keplerOutdatedLuma2.Texture2D) {
    return data;
  }

  return new _keplerOutdatedLuma2.Texture2D(gl, Object.assign({
    data: data
  }, opts));
}

function validateGeometryAttributes(attributes) {
  assert(attributes.positions && attributes.normals && attributes.texCoords);
}
/*
 * Convert mesh data into geometry
 * @returns {Geometry} geometry
 */


function getGeometry(data) {
  if (data instanceof _keplerOutdatedLuma2.Geometry) {
    validateGeometryAttributes(data.attributes);
    return data;
  } else if (data.positions) {
    validateGeometryAttributes(data);
    return new _keplerOutdatedLuma2.Geometry({
      attributes: data
    });
  }

  throw Error('Invalid mesh');
}

var DEFAULT_COLOR = [0, 0, 0, 255];
var defaultProps = {
  mesh: null,
  texture: null,
  sizeScale: {
    type: 'number',
    value: 1,
    min: 0
  },
  // TODO - parameters should be merged, not completely overridden
  parameters: {
    depthTest: true,
    depthFunc: _keplerOutdatedLuma.default.LEQUAL
  },
  fp64: false,
  // Optional settings for 'lighting' shader module
  lightSettings: {},
  getPosition: {
    type: 'accessor',
    value: function value(x) {
      return x.position;
    }
  },
  getColor: {
    type: 'accessor',
    value: DEFAULT_COLOR
  },
  // yaw, pitch and roll are in degrees
  // https://en.wikipedia.org/wiki/Euler_angles
  getYaw: {
    type: 'accessor',
    value: function value(x) {
      return x.yaw || x.angle || 0;
    }
  },
  getPitch: {
    type: 'accessor',
    value: function value(x) {
      return x.pitch || 0;
    }
  },
  getRoll: {
    type: 'accessor',
    value: function value(x) {
      return x.roll || 0;
    }
  }
};

class MeshLayer extends _keplerOutdatedDeck.Layer {
  getShaders() {
    var projectModule = this.use64bitProjection() ? 'project64' : 'project32';
    return {
      vs: _meshLayerVertex.default,
      fs: _meshLayerFragment.default,
      modules: [projectModule, 'lighting', 'picking']
    };
  }

  initializeState() {
    var attributeManager = this.getAttributeManager();
    attributeManager.addInstanced({
      instancePositions: {
        size: 3,
        accessor: 'getPosition'
      },
      instancePositions64xy: {
        size: 2,
        accessor: 'getPosition',
        update: this.calculateInstancePositions64xyLow
      },
      instanceRotations: {
        size: 3,
        accessor: ['getYaw', 'getPitch', 'getRoll'],
        update: this.calculateInstanceRotations
      },
      instanceColors: {
        size: 4,
        accessor: 'getColor',
        defaultValue: [0, 0, 0, 255]
      }
    });
    this.setState({
      // Avoid luma.gl's missing uniform warning
      // TODO - add feature to luma.gl to specify ignored uniforms?
      emptyTexture: new _keplerOutdatedLuma2.Texture2D(this.context.gl, {
        data: new Uint8Array(4),
        width: 1,
        height: 1
      })
    });
  }

  updateState(_ref) {
    var props = _ref.props,
        oldProps = _ref.oldProps,
        changeFlags = _ref.changeFlags;
    var attributeManager = this.getAttributeManager(); // super.updateState({props, oldProps, changeFlags});

    if (changeFlags.dataChanged) {
      attributeManager.invalidateAll();
    }

    this._updateFP64(props, oldProps);

    if (props.texture !== oldProps.texture) {
      this.setTexture(props.texture);
    }
  }

  _updateFP64(props, oldProps) {
    if (props.fp64 !== oldProps.fp64) {
      if (this.state.model) {
        this.state.model.delete();
      }

      this.setState({
        model: this.getModel(this.context.gl)
      });
      this.setTexture(this.state.texture);
      var attributeManager = this.getAttributeManager();
      attributeManager.invalidateAll();
    }
  }

  draw(_ref2) {
    var uniforms = _ref2.uniforms;
    var sizeScale = this.props.sizeScale;
    this.state.model.render(Object.assign({}, uniforms, {
      sizeScale: sizeScale
    }));
  }

  getModel(gl) {
    return new _keplerOutdatedLuma2.Model(gl, Object.assign({}, this.getShaders(), {
      id: this.props.id,
      geometry: getGeometry(this.props.mesh),
      isInstanced: true,
      shaderCache: this.context.shaderCache
    }));
  }

  setTexture(src) {
    var _this = this;

    var gl = this.context.gl;
    var _this$state = this.state,
        model = _this$state.model,
        emptyTexture = _this$state.emptyTexture;

    if (src) {
      getTexture(gl, src).then(function (texture) {
        model.setUniforms({
          sampler: texture,
          hasTexture: 1
        });

        _this.setState({
          texture: texture
        });
      });
    } else {
      // reset
      this.state.model.setUniforms({
        sampler: emptyTexture,
        hasTexture: 0
      });
      this.setState({
        texture: null
      });
    }
  }

  calculateInstancePositions64xyLow(attribute) {
    var isFP64 = this.use64bitPositions();
    attribute.constant = !isFP64;

    if (!isFP64) {
      attribute.value = new Float32Array(2);
      return;
    }

    var _this$props = this.props,
        data = _this$props.data,
        getPosition = _this$props.getPosition;
    var value = attribute.value;
    var i = 0;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var point = _step.value;
        var position = getPosition(point);
        value[i++] = fp64LowPart(position[0]);
        value[i++] = fp64LowPart(position[1]);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  } // yaw(z), pitch(y) and roll(x) in radians


  calculateInstanceRotations(attribute) {
    var _this$props2 = this.props,
        data = _this$props2.data,
        getYaw = _this$props2.getYaw,
        getPitch = _this$props2.getPitch,
        getRoll = _this$props2.getRoll;
    var value = attribute.value,
        size = attribute.size;
    var i = 0;
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = data[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var point = _step2.value;
        value[i++] = getRoll(point) * RADIAN_PER_DEGREE;
        value[i++] = getPitch(point) * RADIAN_PER_DEGREE;
        value[i++] = getYaw(point) * RADIAN_PER_DEGREE;
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  }

}

exports.default = MeshLayer;
MeshLayer.layerName = 'MeshLayer';
MeshLayer.defaultProps = defaultProps;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvbWVzaC1sYXllci9tZXNoLWxheWVyLmpzIl0sIm5hbWVzIjpbImZwNjRMb3dQYXJ0IiwiZnA2NCIsIlJBRElBTl9QRVJfREVHUkVFIiwiTWF0aCIsIlBJIiwiYXNzZXJ0IiwiY29uZGl0aW9uIiwibWVzc2FnZSIsIkVycm9yIiwiZ2V0VGV4dHVyZSIsImdsIiwic3JjIiwib3B0cyIsIk9iamVjdCIsImFzc2lnbiIsInVybHMiLCJ0aGVuIiwidGV4dHVyZXMiLCJjYXRjaCIsImVycm9yIiwiUHJvbWlzZSIsInJlc29sdmUiLCJnZXRUZXh0dXJlRnJvbURhdGEiLCJkYXRhIiwiVGV4dHVyZTJEIiwidmFsaWRhdGVHZW9tZXRyeUF0dHJpYnV0ZXMiLCJhdHRyaWJ1dGVzIiwicG9zaXRpb25zIiwibm9ybWFscyIsInRleENvb3JkcyIsImdldEdlb21ldHJ5IiwiR2VvbWV0cnkiLCJERUZBVUxUX0NPTE9SIiwiZGVmYXVsdFByb3BzIiwibWVzaCIsInRleHR1cmUiLCJzaXplU2NhbGUiLCJ0eXBlIiwidmFsdWUiLCJtaW4iLCJwYXJhbWV0ZXJzIiwiZGVwdGhUZXN0IiwiZGVwdGhGdW5jIiwiR0wiLCJMRVFVQUwiLCJsaWdodFNldHRpbmdzIiwiZ2V0UG9zaXRpb24iLCJ4IiwicG9zaXRpb24iLCJnZXRDb2xvciIsImdldFlhdyIsInlhdyIsImFuZ2xlIiwiZ2V0UGl0Y2giLCJwaXRjaCIsImdldFJvbGwiLCJyb2xsIiwiTWVzaExheWVyIiwiTGF5ZXIiLCJnZXRTaGFkZXJzIiwicHJvamVjdE1vZHVsZSIsInVzZTY0Yml0UHJvamVjdGlvbiIsInZzIiwiZnMiLCJtb2R1bGVzIiwiaW5pdGlhbGl6ZVN0YXRlIiwiYXR0cmlidXRlTWFuYWdlciIsImdldEF0dHJpYnV0ZU1hbmFnZXIiLCJhZGRJbnN0YW5jZWQiLCJpbnN0YW5jZVBvc2l0aW9ucyIsInNpemUiLCJhY2Nlc3NvciIsImluc3RhbmNlUG9zaXRpb25zNjR4eSIsInVwZGF0ZSIsImNhbGN1bGF0ZUluc3RhbmNlUG9zaXRpb25zNjR4eUxvdyIsImluc3RhbmNlUm90YXRpb25zIiwiY2FsY3VsYXRlSW5zdGFuY2VSb3RhdGlvbnMiLCJpbnN0YW5jZUNvbG9ycyIsImRlZmF1bHRWYWx1ZSIsInNldFN0YXRlIiwiZW1wdHlUZXh0dXJlIiwiY29udGV4dCIsIlVpbnQ4QXJyYXkiLCJ3aWR0aCIsImhlaWdodCIsInVwZGF0ZVN0YXRlIiwicHJvcHMiLCJvbGRQcm9wcyIsImNoYW5nZUZsYWdzIiwiZGF0YUNoYW5nZWQiLCJpbnZhbGlkYXRlQWxsIiwiX3VwZGF0ZUZQNjQiLCJzZXRUZXh0dXJlIiwic3RhdGUiLCJtb2RlbCIsImRlbGV0ZSIsImdldE1vZGVsIiwiZHJhdyIsInVuaWZvcm1zIiwicmVuZGVyIiwiTW9kZWwiLCJpZCIsImdlb21ldHJ5IiwiaXNJbnN0YW5jZWQiLCJzaGFkZXJDYWNoZSIsInNldFVuaWZvcm1zIiwic2FtcGxlciIsImhhc1RleHR1cmUiLCJhdHRyaWJ1dGUiLCJpc0ZQNjQiLCJ1c2U2NGJpdFBvc2l0aW9ucyIsImNvbnN0YW50IiwiRmxvYXQzMkFycmF5IiwiaSIsInBvaW50IiwibGF5ZXJOYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBd0JBOztBQUNBOztBQUNBOztBQUdBOztBQUNBOzs7O0FBOUJBO0FBQ0E7O0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtJQUtRQSxXLEdBQWdCQyx5QixDQUFoQkQsVztBQUtSLElBQU1FLGlCQUFpQixHQUFHQyxJQUFJLENBQUNDLEVBQUwsR0FBVSxHQUFwQyxDLENBRUE7O0FBQ0EsU0FBU0MsTUFBVCxDQUFnQkMsU0FBaEIsRUFBMkJDLE9BQTNCLEVBQW9DO0FBQ2xDLE1BQUksQ0FBQ0QsU0FBTCxFQUFnQjtBQUNkLFVBQU0sSUFBSUUsS0FBSixvQkFBc0JELE9BQXRCLEVB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QixDQUFDZ0MsU0FBRCxFQUFZO0FBQUEsdUJBQ1EsS0FBS3RCLEtBRGI7QUFBQSxRQUM1Qi9ELElBRDRCLGdCQUM1QkEsSUFENEI7QUFBQSxRQUN0QjJCLE1BRHNCLGdCQUN0QkEsTUFEc0I7QUFBQSxRQUNkRyxRQURjLGdCQUNkQSxRQURjO0FBQUEsUUFDSkUsT0FESSxnQkFDSkEsT0FESTtBQUFBLFFBRTVCakIsS0FGNEIsR0FFWnNFLFNBRlksQ0FFNUJ0RSxLQUY0QjtBQUFBLFFBRXJCZ0MsSUFGcUIsR0FFWnNDLFNBRlksQ0FFckJ0QyxJQUZxQjtBQUdwQyxRQUFJMkMsQ0FBQyxHQUFHLENBQVI7QUFIb0M7QUFBQTtBQUFBOztBQUFBO0FBSXBDLDRCQUFvQjFGLElBQXBCLG1JQUEwQjtBQUFBLFlBQWYyRixLQUFlO0FBQ3hCNUUsUUFBQUEsS0FBSyxDQUFDMkUsQ0FBQyxFQUFGLENBQUwsR0FBYTFELE9BQU8sQ0FBQzJELEtBQUQsQ0FBUCxHQUFpQmhILGlCQUE5QjtBQUNBb0MsUUFBQUEsS0FBSyxDQUFDMkUsQ0FBQyxFQUFGLENBQUwsR0FBYTVELFFBQVEsQ0FBQzZELEtBQUQsQ0FBUixHQUFrQmhILGlCQUEvQjtBQUNBb0MsUUFBQUEsS0FBSyxDQUFDMkUsQ0FBQyxFQUFGLENBQUwsR0FBYS9ELE1BQU0sQ0FBQ2dFLEtBQUQsQ0FBTixHQUFnQmhILGlCQUE3QjtBQUNEO0FBUm1DO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFTckM7O0FBMUkwQzs7O0FBNkk3Q3VELFNBQVMsQ0FBQzBELFNBQVYsR0FBc0IsV0FBdEI7QUFDQTFELFNBQVMsQ0FBQ3hCLFlBQVYsR0FBeUJBLFlBQXpCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gTm90ZTogVGhpcyBmaWxlIHdpbGwgZWl0aGVyIGJlIG1vdmVkIGJhY2sgdG8gZGVjay5nbCBvciByZWZvcm1hdHRlZCB0byB3ZWItbW9ub3JlcG8gc3RhbmRhcmRzXG4vLyBEaXNhYmxpbmcgbGludCB0ZW1wb3JhcmlseSB0byBmYWNpbGl0YXRlIGNvcHlpbmcgY29kZSBpbiBhbmQgb3V0IG9mIHRoaXMgcmVwb1xuLyogZXNsaW50LWRpc2FibGUgKi9cblxuLy8gQ29weXJpZ2h0IChjKSAyMDE1IFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IHsgTGF5ZXIsIENPT1JESU5BVEVfU1lTVEVNIH0gZnJvbSAna2VwbGVyLW91dGRhdGVkLWRlY2suZ2wtY29yZSc7XG5pbXBvcnQgR0wgZnJvbSAna2VwbGVyLW91dGRhdGVkLWx1bWEuZ2wtY29uc3RhbnRzJztcbmltcG9ydCB7IE1vZGVsLCBHZW9tZXRyeSwgbG9hZFRleHR1cmVzLCBUZXh0dXJlMkQsIGZwNjQgfSBmcm9tICdrZXBsZXItb3V0ZGF0ZWQtbHVtYS5nbC1jb3JlJztcbmNvbnN0IHsgZnA2NExvd1BhcnQgfSA9IGZwNjQ7XG5cbmltcG9ydCB2cyBmcm9tICcuL21lc2gtbGF5ZXItdmVydGV4Lmdsc2wnO1xuaW1wb3J0IGZzIGZyb20gJy4vbWVzaC1sYXllci1mcmFnbWVudC5nbHNsJztcblxuY29uc3QgUkFESUFOX1BFUl9ERUdSRUUgPSBNYXRoLlBJIC8gMTgwO1xuXG4vLyBSZXBsYWNlbWVudCBmb3IgdGhlIGV4dGVybmFsIGFzc2VydCBtZXRob2QgdG8gcmVkdWNlIGJ1bmRsZSBzaXplXG5mdW5jdGlvbiBhc3NlcnQoY29uZGl0aW9uLCBtZXNzYWdlKSB7XG4gIGlmICghY29uZGl0aW9uKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBkZWNrLmdsOiAke21lc3NhZ2V9YCk7XG4gIH1cbn1cblxuLypcbiAqIExvYWQgaW1hZ2UgZGF0YSBpbnRvIGx1bWEuZ2wgVGV4dHVyZTJEIG9iamVjdHNcbiAqIEBwYXJhbSB7V2ViR0xDb250ZXh0fSBnbFxuICogQHBhcmFtIHtTdHJpbmd8VGV4dHVyZTJEfEhUTUxJbWFnZUVsZW1lbnR8VWludDhDbGFtcGVkQXJyYXl9IHNyYyAtIHNvdXJjZSBvZiBpbWFnZSBkYXRhXG4gKiAgIGNhbiBiZSB1cmwgc3RyaW5nLCBUZXh0dXJlMkQgb2JqZWN0LCBIVE1MSW1hZ2VFbGVtZW50IG9yIHBpeGVsIGFycmF5XG4gKiBAcmV0dXJucyB7UHJvbWlzZX0gcmVzb2x2ZXMgdG8gYW4gb2JqZWN0IHdpdGggbmFtZSAtPiB0ZXh0dXJlIG1hcHBpbmdcbiAqL1xuZnVuY3Rpb24gZ2V0VGV4dHVyZShnbCwgc3JjLCBvcHRzKSB7XG4gIGlmICh0eXBlb2Ygc3JjID09PSAnc3RyaW5nJykge1xuICAgIC8vIFVybCwgbG9hZCB0aGUgaW1hZ2VcbiAgICByZXR1cm4gbG9hZFRleHR1cmVzKGdsLCBPYmplY3QuYXNzaWduKHsgdXJsczogW3NyY10gfSwgb3B0cykpXG4gICAgICAudGhlbih0ZXh0dXJlcyA9PiB0ZXh0dXJlc1swXSlcbiAgICAgIC5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGxvYWQgdGV4dHVyZSBmcm9tICR7c3JjfTogJHtlcnJvcn1gKTtcbiAgICAgIH0pO1xuICB9XG4gIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHJlc29sdmUoZ2V0VGV4dHVyZUZyb21EYXRhKGdsLCBzcmMsIG9wdHMpKSk7XG59XG5cbi8qXG4gKiBDb252ZXJ0IGltYWdlIGRhdGEgaW50byB0ZXh0dXJlXG4gKiBAcmV0dXJucyB7VGV4dHVyZTJEfSB0ZXh0dXJlXG4gKi9cbmZ1bmN0aW9uIGdldFRleHR1cmVGcm9tRGF0YShnbCwgZGF0YSwgb3B0cykge1xuICBpZiAoZGF0YSBpbnN0YW5jZW9mIFRleHR1cmUyRCkge1xuICAgIHJldHVybiBkYXRhO1xuICB9XG4gIHJldHVybiBuZXcgVGV4dHVyZTJEKGdsLCBPYmplY3QuYXNzaWduKHsgZGF0YSB9LCBvcHRzKSk7XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlR2VvbWV0cnlBdHRyaWJ1dGVzKGF0dHJpYnV0ZXMpIHtcbiAgYXNzZXJ0KGF0dHJpYnV0ZXMucG9zaXRpb25zICYmIGF0dHJpYnV0ZXMubm9ybWFscyAmJiBhdHRyaWJ1dGVzLnRleENvb3Jkcyk7XG59XG5cbi8qXG4gKiBDb252ZXJ0IG1lc2ggZGF0YSBpbnRvIGdlb21ldHJ5XG4gKiBAcmV0dXJucyB7R2VvbWV0cnl9IGdlb21ldHJ5XG4gKi9cbmZ1bmN0aW9uIGdldEdlb21ldHJ5KGRhdGEpIHtcbiAgaWYgKGRhdGEgaW5zdGFuY2VvZiBHZW9tZXRyeSkge1xuICAgIHZhbGlkYXRlR2VvbWV0cnlBdHRyaWJ1dGVzKGRhdGEuYXR0cmlidXRlcyk7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH0gZWxzZSBpZiAoZGF0YS5wb3NpdGlvbnMpIHtcbiAgICB2YWxpZGF0ZUdlb21ldHJ5QXR0cmlidXRlcyhkYXRhKTtcbiAgICByZXR1cm4gbmV3IEdlb21ldHJ5KHtcbiAgICAgIGF0dHJpYnV0ZXM6IGRhdGFcbiAgICB9KTtcbiAgfVxuICB0aHJvdyBFcnJvcignSW52YWxpZCBtZXNoJyk7XG59XG5cbmNvbnN0IERFRkFVTFRfQ09MT1IgPSBbMCwgMCwgMCwgMjU1XTtcbmNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgbWVzaDogbnVsbCxcbiAgdGV4dHVyZTogbnVsbCxcbiAgc2l6ZVNjYWxlOiB7IHR5cGU6ICdudW1iZXInLCB2YWx1ZTogMSwgbWluOiAwIH0sXG5cbiAgLy8gVE9ETyAtIHBhcmFtZXRlcnMgc2hvdWxkIGJlIG1lcmdlZCwgbm90IGNvbXBsZXRlbHkgb3ZlcnJpZGRlblxuICBwYXJhbWV0ZXJzOiB7XG4gICAgZGVwdGhUZXN0OiB0cnVlLFxuICAgIGRlcHRoRnVuYzogR0wuTEVRVUFMXG4gIH0sXG4gIGZwNjQ6IGZhbHNlLFxuICAvLyBPcHRpb25hbCBzZXR0aW5ncyBmb3IgJ2xpZ2h0aW5nJyBzaGFkZXIgbW9kdWxlXG4gIGxpZ2h0U2V0dGluZ3M6IHt9LFxuXG4gIGdldFBvc2l0aW9uOiB7IHR5cGU6ICdhY2Nlc3NvcicsIHZhbHVlOiB4ID0+IHgucG9zaXRpb24gfSxcbiAgZ2V0Q29sb3I6IHsgdHlwZTogJ2FjY2Vzc29yJywgdmFsdWU6IERFRkFVTFRfQ09MT1IgfSxcblxuICAvLyB5YXcsIHBpdGNoIGFuZCByb2xsIGFyZSBpbiBkZWdyZWVzXG4gIC8vIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0V1bGVyX2FuZ2xlc1xuICBnZXRZYXc6IHsgdHlwZTogJ2FjY2Vzc29yJywgdmFsdWU6IHggPT4geC55YXcgfHwgeC5hbmdsZSB8fCAwIH0sXG4gIGdldFBpdGNoOiB7IHR5cGU6ICdhY2Nlc3NvcicsIHZhbHVlOiB4ID0+IHgucGl0Y2ggfHwgMCB9LFxuICBnZXRSb2xsOiB7IHR5cGU6ICdhY2Nlc3NvcicsIHZhbHVlOiB4ID0+IHgucm9sbCB8fCAwIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1lc2hMYXllciBleHRlbmRzIExheWVyIHtcbiAgZ2V0U2hhZGVycygpIHtcbiAgICBjb25zdCBwcm9qZWN0TW9kdWxlID0gdGhpcy51c2U2NGJpdFByb2plY3Rpb24oKSA/ICdwcm9qZWN0NjQnIDogJ3Byb2plY3QzMic7XG4gICAgcmV0dXJuIHsgdnMsIGZzLCBtb2R1bGVzOiBbcHJvamVjdE1vZHVsZSwgJ2xpZ2h0aW5nJywgJ3BpY2tpbmcnXSB9O1xuICB9XG5cbiAgaW5pdGlhbGl6ZVN0YXRlKCkge1xuICAgIGNvbnN0IGF0dHJpYnV0ZU1hbmFnZXIgPSB0aGlzLmdldEF0dHJpYnV0ZU1hbmFnZXIoKTtcbiAgICBhdHRyaWJ1dGVNYW5hZ2VyLmFkZEluc3RhbmNlZCh7XG4gICAgICBpbnN0YW5jZVBvc2l0aW9uczoge1xuICAgICAgICBzaXplOiAzLFxuICAgICAgICBhY2Nlc3NvcjogJ2dldFBvc2l0aW9uJ1xuICAgICAgfSxcbiAgICAgIGluc3RhbmNlUG9zaXRpb25zNjR4eToge1xuICAgICAgICBzaXplOiAyLFxuICAgICAgICBhY2Nlc3NvcjogJ2dldFBvc2l0aW9uJyxcbiAgICAgICAgdXBkYXRlOiB0aGlzLmNhbGN1bGF0ZUluc3RhbmNlUG9zaXRpb25zNjR4eUxvd1xuICAgICAgfSxcbiAgICAgIGluc3RhbmNlUm90YXRpb25zOiB7XG4gICAgICAgIHNpemU6IDMsXG4gICAgICAgIGFjY2Vzc29yOiBbJ2dldFlhdycsICdnZXRQaXRjaCcsICdnZXRSb2xsJ10sXG4gICAgICAgIHVwZGF0ZTogdGhpcy5jYWxjdWxhdGVJbnN0YW5jZVJvdGF0aW9uc1xuICAgICAgfSxcbiAgICAgIGluc3RhbmNlQ29sb3JzOiB7XG4gICAgICAgIHNpemU6IDQsXG4gICAgICAgIGFjY2Vzc29yOiAnZ2V0Q29sb3InLFxuICAgICAgICBkZWZhdWx0VmFsdWU6IFswLCAwLCAwLCAyNTVdXG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIC8vIEF2b2lkIGx1bWEuZ2wncyBtaXNzaW5nIHVuaWZvcm0gd2FybmluZ1xuICAgICAgLy8gVE9ETyAtIGFkZCBmZWF0dXJlIHRvIGx1bWEuZ2wgdG8gc3BlY2lmeSBpZ25vcmVkIHVuaWZvcm1zP1xuICAgICAgZW1wdHlUZXh0dXJlOiBuZXcgVGV4dHVyZTJEKHRoaXMuY29udGV4dC5nbCwge1xuICAgICAgICBkYXRhOiBuZXcgVWludDhBcnJheSg0KSxcbiAgICAgICAgd2lkdGg6IDEsXG4gICAgICAgIGhlaWdodDogMVxuICAgICAgfSlcbiAgICB9KTtcbiAgfVxuXG4gIHVwZGF0ZVN0YXRlKHsgcHJvcHMsIG9sZFByb3BzLCBjaGFuZ2VGbGFncyB9KSB7XG4gICAgY29uc3QgYXR0cmlidXRlTWFuYWdlciA9IHRoaXMuZ2V0QXR0cmlidXRlTWFuYWdlcigpO1xuXG4gICAgLy8gc3VwZXIudXBkYXRlU3RhdGUoe3Byb3BzLCBvbGRQcm9wcywgY2hhbmdlRmxhZ3N9KTtcbiAgICBpZiAoY2hhbmdlRmxhZ3MuZGF0YUNoYW5nZWQpIHtcbiAgICAgIGF0dHJpYnV0ZU1hbmFnZXIuaW52YWxpZGF0ZUFsbCgpO1xuICAgIH1cblxuICAgIHRoaXMuX3VwZGF0ZUZQNjQocHJvcHMsIG9sZFByb3BzKTtcblxuICAgIGlmIChwcm9wcy50ZXh0dXJlICE9PSBvbGRQcm9wcy50ZXh0dXJlKSB7XG4gICAgICB0aGlzLnNldFRleHR1cmUocHJvcHMudGV4dHVyZSk7XG4gICAgfVxuICB9XG5cbiAgX3VwZGF0ZUZQNjQocHJvcHMsIG9sZFByb3BzKSB7XG4gICAgaWYgKHByb3BzLmZwNjQgIT09IG9sZFByb3BzLmZwNjQpIHtcbiAgICAgIGlmICh0aGlzLnN0YXRlLm1vZGVsKSB7XG4gICAgICAgIHRoaXMuc3RhdGUubW9kZWwuZGVsZXRlKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBtb2RlbDogdGhpcy5nZXRNb2RlbCh0aGlzLmNvbnRleHQuZ2wpIH0pO1xuXG4gICAgICB0aGlzLnNldFRleHR1cmUodGhpcy5zdGF0ZS50ZXh0dXJlKTtcblxuICAgICAgY29uc3QgYXR0cmlidXRlTWFuYWdlciA9IHRoaXMuZ2V0QXR0cmlidXRlTWFuYWdlcigpO1xuICAgICAgYXR0cmlidXRlTWFuYWdlci5pbnZhbGlkYXRlQWxsKCk7XG4gICAgfVxuICB9XG5cbiAgZHJhdyh7IHVuaWZvcm1zIH0pIHtcbiAgICBjb25zdCB7IHNpemVTY2FsZSB9ID0gdGhpcy5wcm9wcztcblxuICAgIHRoaXMuc3RhdGUubW9kZWwucmVuZGVyKFxuICAgICAgT2JqZWN0LmFzc2lnbih7fSwgdW5pZm9ybXMsIHtcbiAgICAgICAgc2l6ZVNjYWxlXG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICBnZXRNb2RlbChnbCkge1xuICAgIHJldHVybiBuZXcgTW9kZWwoXG4gICAgICBnbCxcbiAgICAgIE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZ2V0U2hhZGVycygpLCB7XG4gICAgICAgIGlkOiB0aGlzLnByb3BzLmlkLFxuICAgICAgICBnZW9tZXRyeTogZ2V0R2VvbWV0cnkodGhpcy5wcm9wcy5tZXNoKSxcbiAgICAgICAgaXNJbnN0YW5jZWQ6IHRydWUsXG4gICAgICAgIHNoYWRlckNhY2hlOiB0aGlzLmNvbnRleHQuc2hhZGVyQ2FjaGVcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIHNldFRleHR1cmUoc3JjKSB7XG4gICAgY29uc3QgeyBnbCB9ID0gdGhpcy5jb250ZXh0O1xuICAgIGNvbnN0IHsgbW9kZWwsIGVtcHR5VGV4dHVyZSB9ID0gdGhpcy5zdGF0ZTtcblxuICAgIGlmIChzcmMpIHtcbiAgICAgIGdldFRleHR1cmUoZ2wsIHNyYykudGhlbih0ZXh0dXJlID0+IHtcbiAgICAgICAgbW9kZWwuc2V0VW5pZm9ybXMoeyBzYW1wbGVyOiB0ZXh0dXJlLCBoYXNUZXh0dXJlOiAxIH0pO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHsgdGV4dHVyZSB9KTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyByZXNldFxuICAgICAgdGhpcy5zdGF0ZS5tb2RlbC5zZXRVbmlmb3Jtcyh7IHNhbXBsZXI6IGVtcHR5VGV4dHVyZSwgaGFzVGV4dHVyZTogMCB9KTtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyB0ZXh0dXJlOiBudWxsIH0pO1xuICAgIH1cbiAgfVxuXG4gIGNhbGN1bGF0ZUluc3RhbmNlUG9zaXRpb25zNjR4eUxvdyhhdHRyaWJ1dGUpIHtcbiAgICBjb25zdCBpc0ZQNjQgPSB0aGlzLnVzZTY0Yml0UG9zaXRpb25zKCk7XG4gICAgYXR0cmlidXRlLmNvbnN0YW50ID0gIWlzRlA2NDtcblxuICAgIGlmICghaXNGUDY0KSB7XG4gICAgICBhdHRyaWJ1dGUudmFsdWUgPSBuZXcgRmxvYXQzMkFycmF5KDIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHsgZGF0YSwgZ2V0UG9zaXRpb24gfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgeyB2YWx1ZSB9ID0gYXR0cmlidXRlO1xuICAgIGxldCBpID0gMDtcbiAgICBmb3IgKGNvbnN0IHBvaW50IG9mIGRhdGEpIHtcbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gZ2V0UG9zaXRpb24ocG9pbnQpO1xuICAgICAgdmFsdWVbaSsrXSA9IGZwNjRMb3dQYXJ0KHBvc2l0aW9uWzBdKTtcbiAgICAgIHZhbHVlW2krK10gPSBmcDY0TG93UGFydChwb3NpdGlvblsxXSk7XG4gICAgfVxuICB9XG5cbiAgLy8geWF3KHopLCBwaXRjaCh5KSBhbmQgcm9sbCh4KSBpbiByYWRpYW5zXG4gIGNhbGN1bGF0ZUluc3RhbmNlUm90YXRpb25zKGF0dHJpYnV0ZSkge1xuICAgIGNvbnN0IHsgZGF0YSwgZ2V0WWF3LCBnZXRQaXRjaCwgZ2V0Um9sbCB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB7IHZhbHVlLCBzaXplIH0gPSBhdHRyaWJ1dGU7XG4gICAgbGV0IGkgPSAwO1xuICAgIGZvciAoY29uc3QgcG9pbnQgb2YgZGF0YSkge1xuICAgICAgdmFsdWVbaSsrXSA9IGdldFJvbGwocG9pbnQpICogUkFESUFOX1BFUl9ERUdSRUU7XG4gICAgICB2YWx1ZVtpKytdID0gZ2V0UGl0Y2gocG9pbnQpICogUkFESUFOX1BFUl9ERUdSRUU7XG4gICAgICB2YWx1ZVtpKytdID0gZ2V0WWF3KHBvaW50KSAqIFJBRElBTl9QRVJfREVHUkVFO1xuICAgIH1cbiAgfVxufVxuXG5NZXNoTGF5ZXIubGF5ZXJOYW1lID0gJ01lc2hMYXllcic7XG5NZXNoTGF5ZXIuZGVmYXVsdFByb3BzID0gZGVmYXVsdFByb3BzO1xuIl19