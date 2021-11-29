"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _keplerOutdatedDeck = require("kepler-outdated-deck.gl-core");

var _constants = _interopRequireDefault(require("@luma.gl/constants"));

var _core = require("@luma.gl/core");

var _meshLayerVertex = _interopRequireDefault(require("./mesh-layer-vertex.glsl"));

var _meshLayerFragment = _interopRequireDefault(require("./mesh-layer-fragment.glsl"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var fp64LowPart = _core.fp64.fp64LowPart;
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
    return (0, _core.loadTextures)(gl, Object.assign({
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
  if (data instanceof _core.Texture2D) {
    return data;
  }

  return new _core.Texture2D(gl, Object.assign({
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
  if (data instanceof _core.Geometry) {
    validateGeometryAttributes(data.attributes);
    return data;
  } else if (data.positions) {
    validateGeometryAttributes(data);
    return new _core.Geometry({
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
    depthFunc: _constants.default.LEQUAL
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

var MeshLayer =
/*#__PURE__*/
function (_Layer) {
  _inherits(MeshLayer, _Layer);

  function MeshLayer() {
    _classCallCheck(this, MeshLayer);

    return _possibleConstructorReturn(this, _getPrototypeOf(MeshLayer).apply(this, arguments));
  }

  _createClass(MeshLayer, [{
    key: "getShaders",
    value: function getShaders() {
      var projectModule = this.use64bitProjection() ? 'project64' : 'project32';
      return {
        vs: _meshLayerVertex.default,
        fs: _meshLayerFragment.default,
        modules: [projectModule, 'lighting', 'picking']
      };
    }
  }, {
    key: "initializeState",
    value: function initializeState() {
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
        emptyTexture: new _core.Texture2D(this.context.gl, {
          data: new Uint8Array(4),
          width: 1,
          height: 1
        })
      });
    }
  }, {
    key: "updateState",
    value: function updateState(_ref) {
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
  }, {
    key: "_updateFP64",
    value: function _updateFP64(props, oldProps) {
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
  }, {
    key: "draw",
    value: function draw(_ref2) {
      var uniforms = _ref2.uniforms;
      var sizeScale = this.props.sizeScale;
      this.state.model.render(Object.assign({}, uniforms, {
        sizeScale: sizeScale
      }));
    }
  }, {
    key: "getModel",
    value: function getModel(gl) {
      return new _core.Model(gl, Object.assign({}, this.getShaders(), {
        id: this.props.id,
        geometry: getGeometry(this.props.mesh),
        isInstanced: true,
        shaderCache: this.context.shaderCache
      }));
    }
  }, {
    key: "setTexture",
    value: function setTexture(src) {
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
  }, {
    key: "calculateInstancePositions64xyLow",
    value: function calculateInstancePositions64xyLow(attribute) {
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

  }, {
    key: "calculateInstanceRotations",
    value: function calculateInstanceRotations(attribute) {
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
  }]);

  return MeshLayer;
  }(_keplerOutdatedDeck.Layer);

exports.default = MeshLayer;
MeshLayer.layerName = 'MeshLayer';
MeshLayer.defaultProps = defaultProps;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvbWVzaC1sYXllci9tZXNoLWxheWVyLmpzIl0sIm5hbWVzIjpbImZwNjRMb3dQYXJ0IiwiZnA2NCIsIlJBRElBTl9QRVJfREVHUkVFIiwiTWF0aCIsIlBJIiwiYXNzZXJ0IiwiY29uZGl0aW9uIiwibWVzc2FnZSIsIkVycm9yIiwiZ2V0VGV4dHVyZSIsImdsIiwic3JjIiwib3B0cyIsIk9iamVjdCIsImFzc2lnbiIsInVybHMiLCJ0aGVuIiwidGV4dHVyZXMiLCJjYXRjaCIsImVycm9yIiwiUHJvbWlzZSIsInJlc29sdmUiLCJnZXRUZXh0dXJlRnJvbURhdGEiLCJkYXRhIiwiVGV4dHVyZTJEIiwidmFsaWRhdGVHZW9tZXRyeUF0dHJpYnV0ZXMiLCJhdHRyaWJ1dGVzIiwicG9zaXRpb25zIiwibm9ybWFscyIsInRleENvb3JkcyIsImdldEdlb21ldHJ5IiwiR2VvbWV0cnkiLCJERUZBVUxUX0NPTE9SIiwiZGVmYXVsdFByb3BzIiwibWVzaCIsInRleHR1cmUiLCJzaXplU2NhbGUiLCJ0eXBlIiwidmFsdWUiLCJtaW4iLCJwYXJhbWV0ZXJzIiwiZGVwdGhUZXN0IiwiZGVwdGhGdW5jIiwiR0wiLCJMRVFVQUwiLCJsaWdodFNldHRpbmdzIiwiZ2V0UG9zaXRpb24iLCJ4IiwicG9zaXRpb24iLCJnZXRDb2xvciIsImdldFlhdyIsInlhdyIsImFuZ2xlIiwiZ2V0UGl0Y2giLCJwaXRjaCIsImdldFJvbGwiLCJyb2xsIiwiTWVzaExheWVyIiwicHJvamVjdE1vZHVsZSIsInVzZTY0Yml0UHJvamVjdGlvbiIsInZzIiwiZnMiLCJtb2R1bGVzIiwiYXR0cmlidXRlTWFuYWdlciIsImdldEF0dHJpYnV0ZU1hbmFnZXIiLCJhZGRJbnN0YW5jZWQiLCJpbnN0YW5jZVBvc2l0aW9ucyIsInNpemUiLCJhY2Nlc3NvciIsImluc3RhbmNlUG9zaXRpb25zNjR4eSIsInVwZGF0ZSIsImNhbGN1bGF0ZUluc3RhbmNlUG9zaXRpb25zNjR4eUxvdyIsImluc3RhbmNlUm90YXRpb25zIiwiY2FsY3VsYXRlSW5zdGFuY2VSb3RhdGlvbnMiLCJpbnN0YW5jZUNvbG9ycyIsImRlZmF1bHRWYWx1ZSIsInNldFN0YXRlIiwiZW1wdHlUZXh0dXJlIiwiY29udGV4dCIsIlVpbnQ4QXJyYXkiLCJ3aWR0aCIsImhlaWdodCIsInByb3BzIiwib2xkUHJvcHMiLCJjaGFuZ2VGbGFncyIsImRhdGFDaGFuZ2VkIiwiaW52YWxpZGF0ZUFsbCIsIl91cGRhdGVGUDY0Iiwic2V0VGV4dHVyZSIsInN0YXRlIiwibW9kZWwiLCJkZWxldGUiLCJnZXRNb2RlbCIsInVuaWZvcm1zIiwicmVuZGVyIiwiTW9kZWwiLCJnZXRTaGFkZXJzIiwiaWQiLCJnZW9tZXRyeSIsImlzSW5zdGFuY2VkIiwic2hhZGVyQ2FjaGUiLCJzZXRVbmlmb3JtcyIsInNhbXBsZXIiLCJoYXNUZXh0dXJlIiwiYXR0cmlidXRlIiwiaXNGUDY0IiwidXNlNjRiaXRQb3NpdGlvbnMiLCJjb25zdGFudCIsIkZsb2F0MzJBcnJheSIsImkiLCJwb2ludCIsIkxheWVyIiwibGF5ZXJOYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBd0JBOztBQUNBOztBQUNBOztBQUdBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBSFFBLFcsR0FBZ0JDLFUsQ0FBaEJELFc7QUFLUixJQUFNRSxpQkFBaUIsR0FBR0MsSUFBSSxDQUFDQyxFQUFMLEdBQVUsR0FBcEMsQyxDQUVBOztBQUNBLFNBQVNDLE1BQVQsQ0FBZ0JDLFNBQWhCLEVBQTJCQyxPQUEzQixFQUFvQztBQUNsQyxNQUFJLENBQUNELFNBQUwsRUFBZ0I7QUFDZCxVQUFNLElBQUlFLEtBQUosb0JBQXNCRCxPQUF0QixFQUFOO0FBQ0Q7QUFDRjtBQUVEOzs7Ozs7Ozs7QUFPQSxTQUFTRSxVQUFULENBQW9CQyxFQUFwQixFQUF3QkMsR0FBeEIsRUFBNkJDLElBQTdCLEVBQW1DO0FBQ2pDLE1BQUksT0FBT0QsR0FBUCxLQUFlLFFBQW5CLEVBQTZCO0FBQzNCO0FB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QixtSUFBMEI7QUFBQSxjQUFmdUYsS0FBZTtBQUN4QnhFLFVBQUFBLEtBQUssQ0FBQ3VFLENBQUMsRUFBRixDQUFMLEdBQWF0RCxPQUFPLENBQUN1RCxLQUFELENBQVAsR0FBaUI1RyxpQkFBOUI7QUFDQW9DLFVBQUFBLEtBQUssQ0FBQ3VFLENBQUMsRUFBRixDQUFMLEdBQWF4RCxRQUFRLENBQUN5RCxLQUFELENBQVIsR0FBa0I1RyxpQkFBL0I7QUFDQW9DLFVBQUFBLEtBQUssQ0FBQ3VFLENBQUMsRUFBRixDQUFMLEdBQWEzRCxNQUFNLENBQUM0RCxLQUFELENBQU4sR0FBZ0I1RyxpQkFBN0I7QUFDRDtBQVJtQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBU3JDOzs7O0VBMUlvQzZHLHdCOzs7QUE2SXZDdEQsU0FBUyxDQUFDdUQsU0FBVixHQUFzQixXQUF0QjtBQUNBdkQsU0FBUyxDQUFDeEIsWUFBVixHQUF5QkEsWUFBekIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBOb3RlOiBUaGlzIGZpbGUgd2lsbCBlaXRoZXIgYmUgbW92ZWQgYmFjayB0byBkZWNrLmdsIG9yIHJlZm9ybWF0dGVkIHRvIHdlYi1tb25vcmVwbyBzdGFuZGFyZHNcbi8vIERpc2FibGluZyBsaW50IHRlbXBvcmFyaWx5IHRvIGZhY2lsaXRhdGUgY29weWluZyBjb2RlIGluIGFuZCBvdXQgb2YgdGhpcyByZXBvXG4vKiBlc2xpbnQtZGlzYWJsZSAqL1xuXG4vLyBDb3B5cmlnaHQgKGMpIDIwMTUgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgeyBMYXllciwgQ09PUkRJTkFURV9TWVNURU0gfSBmcm9tICdrZXBsZXItb3VkYXRlZC1kZWNrLmdsLWNvcmUnO1xuaW1wb3J0IEdMIGZyb20gJ0BsdW1hLmdsL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBNb2RlbCwgR2VvbWV0cnksIGxvYWRUZXh0dXJlcywgVGV4dHVyZTJELCBmcDY0IH0gZnJvbSAnQGx1bWEuZ2wvY29yZSc7XG5jb25zdCB7IGZwNjRMb3dQYXJ0IH0gPSBmcDY0O1xuXG5pbXBvcnQgdnMgZnJvbSAnLi9tZXNoLWxheWVyLXZlcnRleC5nbHNsJztcbmltcG9ydCBmcyBmcm9tICcuL21lc2gtbGF5ZXItZnJhZ21lbnQuZ2xzbCc7XG5cbmNvbnN0IFJBRElBTl9QRVJfREVHUkVFID0gTWF0aC5QSSAvIDE4MDtcblxuLy8gUmVwbGFjZW1lbnQgZm9yIHRoZSBleHRlcm5hbCBhc3NlcnQgbWV0aG9kIHRvIHJlZHVjZSBidW5kbGUgc2l6ZVxuZnVuY3Rpb24gYXNzZXJ0KGNvbmRpdGlvbiwgbWVzc2FnZSkge1xuICBpZiAoIWNvbmRpdGlvbikge1xuICAgIHRocm93IG5ldyBFcnJvcihgZGVjay5nbDogJHttZXNzYWdlfWApO1xuICB9XG59XG5cbi8qXG4gKiBMb2FkIGltYWdlIGRhdGEgaW50byBsdW1hLmdsIFRleHR1cmUyRCBvYmplY3RzXG4gKiBAcGFyYW0ge1dlYkdMQ29udGV4dH0gZ2xcbiAqIEBwYXJhbSB7U3RyaW5nfFRleHR1cmUyRHxIVE1MSW1hZ2VFbGVtZW50fFVpbnQ4Q2xhbXBlZEFycmF5fSBzcmMgLSBzb3VyY2Ugb2YgaW1hZ2UgZGF0YVxuICogICBjYW4gYmUgdXJsIHN0cmluZywgVGV4dHVyZTJEIG9iamVjdCwgSFRNTEltYWdlRWxlbWVudCBvciBwaXhlbCBhcnJheVxuICogQHJldHVybnMge1Byb21pc2V9IHJlc29sdmVzIHRvIGFuIG9iamVjdCB3aXRoIG5hbWUgLT4gdGV4dHVyZSBtYXBwaW5nXG4gKi9cbmZ1bmN0aW9uIGdldFRleHR1cmUoZ2wsIHNyYywgb3B0cykge1xuICBpZiAodHlwZW9mIHNyYyA9PT0gJ3N0cmluZycpIHtcbiAgICAvLyBVcmwsIGxvYWQgdGhlIGltYWdlXG4gICAgcmV0dXJuIGxvYWRUZXh0dXJlcyhnbCwgT2JqZWN0LmFzc2lnbih7IHVybHM6IFtzcmNdIH0sIG9wdHMpKVxuICAgICAgLnRoZW4odGV4dHVyZXMgPT4gdGV4dHVyZXNbMF0pXG4gICAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBsb2FkIHRleHR1cmUgZnJvbSAke3NyY306ICR7ZXJyb3J9YCk7XG4gICAgICB9KTtcbiAgfVxuICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiByZXNvbHZlKGdldFRleHR1cmVGcm9tRGF0YShnbCwgc3JjLCBvcHRzKSkpO1xufVxuXG4vKlxuICogQ29udmVydCBpbWFnZSBkYXRhIGludG8gdGV4dHVyZVxuICogQHJldHVybnMge1RleHR1cmUyRH0gdGV4dHVyZVxuICovXG5mdW5jdGlvbiBnZXRUZXh0dXJlRnJvbURhdGEoZ2wsIGRhdGEsIG9wdHMpIHtcbiAgaWYgKGRhdGEgaW5zdGFuY2VvZiBUZXh0dXJlMkQpIHtcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuICByZXR1cm4gbmV3IFRleHR1cmUyRChnbCwgT2JqZWN0LmFzc2lnbih7IGRhdGEgfSwgb3B0cykpO1xufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZUdlb21ldHJ5QXR0cmlidXRlcyhhdHRyaWJ1dGVzKSB7XG4gIGFzc2VydChhdHRyaWJ1dGVzLnBvc2l0aW9ucyAmJiBhdHRyaWJ1dGVzLm5vcm1hbHMgJiYgYXR0cmlidXRlcy50ZXhDb29yZHMpO1xufVxuXG4vKlxuICogQ29udmVydCBtZXNoIGRhdGEgaW50byBnZW9tZXRyeVxuICogQHJldHVybnMge0dlb21ldHJ5fSBnZW9tZXRyeVxuICovXG5mdW5jdGlvbiBnZXRHZW9tZXRyeShkYXRhKSB7XG4gIGlmIChkYXRhIGluc3RhbmNlb2YgR2VvbWV0cnkpIHtcbiAgICB2YWxpZGF0ZUdlb21ldHJ5QXR0cmlidXRlcyhkYXRhLmF0dHJpYnV0ZXMpO1xuICAgIHJldHVybiBkYXRhO1xuICB9IGVsc2UgaWYgKGRhdGEucG9zaXRpb25zKSB7XG4gICAgdmFsaWRhdGVHZW9tZXRyeUF0dHJpYnV0ZXMoZGF0YSk7XG4gICAgcmV0dXJuIG5ldyBHZW9tZXRyeSh7XG4gICAgICBhdHRyaWJ1dGVzOiBkYXRhXG4gICAgfSk7XG4gIH1cbiAgdGhyb3cgRXJyb3IoJ0ludmFsaWQgbWVzaCcpO1xufVxuXG5jb25zdCBERUZBVUxUX0NPTE9SID0gWzAsIDAsIDAsIDI1NV07XG5jb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gIG1lc2g6IG51bGwsXG4gIHRleHR1cmU6IG51bGwsXG4gIHNpemVTY2FsZTogeyB0eXBlOiAnbnVtYmVyJywgdmFsdWU6IDEsIG1pbjogMCB9LFxuXG4gIC8vIFRPRE8gLSBwYXJhbWV0ZXJzIHNob3VsZCBiZSBtZXJnZWQsIG5vdCBjb21wbGV0ZWx5IG92ZXJyaWRkZW5cbiAgcGFyYW1ldGVyczoge1xuICAgIGRlcHRoVGVzdDogdHJ1ZSxcbiAgICBkZXB0aEZ1bmM6IEdMLkxFUVVBTFxuICB9LFxuICBmcDY0OiBmYWxzZSxcbiAgLy8gT3B0aW9uYWwgc2V0dGluZ3MgZm9yICdsaWdodGluZycgc2hhZGVyIG1vZHVsZVxuICBsaWdodFNldHRpbmdzOiB7fSxcblxuICBnZXRQb3NpdGlvbjogeyB0eXBlOiAnYWNjZXNzb3InLCB2YWx1ZTogeCA9PiB4LnBvc2l0aW9uIH0sXG4gIGdldENvbG9yOiB7IHR5cGU6ICdhY2Nlc3NvcicsIHZhbHVlOiBERUZBVUxUX0NPTE9SIH0sXG5cbiAgLy8geWF3LCBwaXRjaCBhbmQgcm9sbCBhcmUgaW4gZGVncmVlc1xuICAvLyBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9FdWxlcl9hbmdsZXNcbiAgZ2V0WWF3OiB7IHR5cGU6ICdhY2Nlc3NvcicsIHZhbHVlOiB4ID0+IHgueWF3IHx8IHguYW5nbGUgfHwgMCB9LFxuICBnZXRQaXRjaDogeyB0eXBlOiAnYWNjZXNzb3InLCB2YWx1ZTogeCA9PiB4LnBpdGNoIHx8IDAgfSxcbiAgZ2V0Um9sbDogeyB0eXBlOiAnYWNjZXNzb3InLCB2YWx1ZTogeCA9PiB4LnJvbGwgfHwgMCB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNZXNoTGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIGdldFNoYWRlcnMoKSB7XG4gICAgY29uc3QgcHJvamVjdE1vZHVsZSA9IHRoaXMudXNlNjRiaXRQcm9qZWN0aW9uKCkgPyAncHJvamVjdDY0JyA6ICdwcm9qZWN0MzInO1xuICAgIHJldHVybiB7IHZzLCBmcywgbW9kdWxlczogW3Byb2plY3RNb2R1bGUsICdsaWdodGluZycsICdwaWNraW5nJ10gfTtcbiAgfVxuXG4gIGluaXRpYWxpemVTdGF0ZSgpIHtcbiAgICBjb25zdCBhdHRyaWJ1dGVNYW5hZ2VyID0gdGhpcy5nZXRBdHRyaWJ1dGVNYW5hZ2VyKCk7XG4gICAgYXR0cmlidXRlTWFuYWdlci5hZGRJbnN0YW5jZWQoe1xuICAgICAgaW5zdGFuY2VQb3NpdGlvbnM6IHtcbiAgICAgICAgc2l6ZTogMyxcbiAgICAgICAgYWNjZXNzb3I6ICdnZXRQb3NpdGlvbidcbiAgICAgIH0sXG4gICAgICBpbnN0YW5jZVBvc2l0aW9uczY0eHk6IHtcbiAgICAgICAgc2l6ZTogMixcbiAgICAgICAgYWNjZXNzb3I6ICdnZXRQb3NpdGlvbicsXG4gICAgICAgIHVwZGF0ZTogdGhpcy5jYWxjdWxhdGVJbnN0YW5jZVBvc2l0aW9uczY0eHlMb3dcbiAgICAgIH0sXG4gICAgICBpbnN0YW5jZVJvdGF0aW9uczoge1xuICAgICAgICBzaXplOiAzLFxuICAgICAgICBhY2Nlc3NvcjogWydnZXRZYXcnLCAnZ2V0UGl0Y2gnLCAnZ2V0Um9sbCddLFxuICAgICAgICB1cGRhdGU6IHRoaXMuY2FsY3VsYXRlSW5zdGFuY2VSb3RhdGlvbnNcbiAgICAgIH0sXG4gICAgICBpbnN0YW5jZUNvbG9yczoge1xuICAgICAgICBzaXplOiA0LFxuICAgICAgICBhY2Nlc3NvcjogJ2dldENvbG9yJyxcbiAgICAgICAgZGVmYXVsdFZhbHVlOiBbMCwgMCwgMCwgMjU1XVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAvLyBBdm9pZCBsdW1hLmdsJ3MgbWlzc2luZyB1bmlmb3JtIHdhcm5pbmdcbiAgICAgIC8vIFRPRE8gLSBhZGQgZmVhdHVyZSB0byBsdW1hLmdsIHRvIHNwZWNpZnkgaWdub3JlZCB1bmlmb3Jtcz9cbiAgICAgIGVtcHR5VGV4dHVyZTogbmV3IFRleHR1cmUyRCh0aGlzLmNvbnRleHQuZ2wsIHtcbiAgICAgICAgZGF0YTogbmV3IFVpbnQ4QXJyYXkoNCksXG4gICAgICAgIHdpZHRoOiAxLFxuICAgICAgICBoZWlnaHQ6IDFcbiAgICAgIH0pXG4gICAgfSk7XG4gIH1cblxuICB1cGRhdGVTdGF0ZSh7IHByb3BzLCBvbGRQcm9wcywgY2hhbmdlRmxhZ3MgfSkge1xuICAgIGNvbnN0IGF0dHJpYnV0ZU1hbmFnZXIgPSB0aGlzLmdldEF0dHJpYnV0ZU1hbmFnZXIoKTtcblxuICAgIC8vIHN1cGVyLnVwZGF0ZVN0YXRlKHtwcm9wcywgb2xkUHJvcHMsIGNoYW5nZUZsYWdzfSk7XG4gICAgaWYgKGNoYW5nZUZsYWdzLmRhdGFDaGFuZ2VkKSB7XG4gICAgICBhdHRyaWJ1dGVNYW5hZ2VyLmludmFsaWRhdGVBbGwoKTtcbiAgICB9XG5cbiAgICB0aGlzLl91cGRhdGVGUDY0KHByb3BzLCBvbGRQcm9wcyk7XG5cbiAgICBpZiAocHJvcHMudGV4dHVyZSAhPT0gb2xkUHJvcHMudGV4dHVyZSkge1xuICAgICAgdGhpcy5zZXRUZXh0dXJlKHByb3BzLnRleHR1cmUpO1xuICAgIH1cbiAgfVxuXG4gIF91cGRhdGVGUDY0KHByb3BzLCBvbGRQcm9wcykge1xuICAgIGlmIChwcm9wcy5mcDY0ICE9PSBvbGRQcm9wcy5mcDY0KSB7XG4gICAgICBpZiAodGhpcy5zdGF0ZS5tb2RlbCkge1xuICAgICAgICB0aGlzLnN0YXRlLm1vZGVsLmRlbGV0ZSgpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnNldFN0YXRlKHsgbW9kZWw6IHRoaXMuZ2V0TW9kZWwodGhpcy5jb250ZXh0LmdsKSB9KTtcblxuICAgICAgdGhpcy5zZXRUZXh0dXJlKHRoaXMuc3RhdGUudGV4dHVyZSk7XG5cbiAgICAgIGNvbnN0IGF0dHJpYnV0ZU1hbmFnZXIgPSB0aGlzLmdldEF0dHJpYnV0ZU1hbmFnZXIoKTtcbiAgICAgIGF0dHJpYnV0ZU1hbmFnZXIuaW52YWxpZGF0ZUFsbCgpO1xuICAgIH1cbiAgfVxuXG4gIGRyYXcoeyB1bmlmb3JtcyB9KSB7XG4gICAgY29uc3QgeyBzaXplU2NhbGUgfSA9IHRoaXMucHJvcHM7XG5cbiAgICB0aGlzLnN0YXRlLm1vZGVsLnJlbmRlcihcbiAgICAgIE9iamVjdC5hc3NpZ24oe30sIHVuaWZvcm1zLCB7XG4gICAgICAgIHNpemVTY2FsZVxuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgZ2V0TW9kZWwoZ2wpIHtcbiAgICByZXR1cm4gbmV3IE1vZGVsKFxuICAgICAgZ2wsXG4gICAgICBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmdldFNoYWRlcnMoKSwge1xuICAgICAgICBpZDogdGhpcy5wcm9wcy5pZCxcbiAgICAgICAgZ2VvbWV0cnk6IGdldEdlb21ldHJ5KHRoaXMucHJvcHMubWVzaCksXG4gICAgICAgIGlzSW5zdGFuY2VkOiB0cnVlLFxuICAgICAgICBzaGFkZXJDYWNoZTogdGhpcy5jb250ZXh0LnNoYWRlckNhY2hlXG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICBzZXRUZXh0dXJlKHNyYykge1xuICAgIGNvbnN0IHsgZ2wgfSA9IHRoaXMuY29udGV4dDtcbiAgICBjb25zdCB7IG1vZGVsLCBlbXB0eVRleHR1cmUgfSA9IHRoaXMuc3RhdGU7XG5cbiAgICBpZiAoc3JjKSB7XG4gICAgICBnZXRUZXh0dXJlKGdsLCBzcmMpLnRoZW4odGV4dHVyZSA9PiB7XG4gICAgICAgIG1vZGVsLnNldFVuaWZvcm1zKHsgc2FtcGxlcjogdGV4dHVyZSwgaGFzVGV4dHVyZTogMSB9KTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHRleHR1cmUgfSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gcmVzZXRcbiAgICAgIHRoaXMuc3RhdGUubW9kZWwuc2V0VW5pZm9ybXMoeyBzYW1wbGVyOiBlbXB0eVRleHR1cmUsIGhhc1RleHR1cmU6IDAgfSk7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgdGV4dHVyZTogbnVsbCB9KTtcbiAgICB9XG4gIH1cblxuICBjYWxjdWxhdGVJbnN0YW5jZVBvc2l0aW9uczY0eHlMb3coYXR0cmlidXRlKSB7XG4gICAgY29uc3QgaXNGUDY0ID0gdGhpcy51c2U2NGJpdFBvc2l0aW9ucygpO1xuICAgIGF0dHJpYnV0ZS5jb25zdGFudCA9ICFpc0ZQNjQ7XG5cbiAgICBpZiAoIWlzRlA2NCkge1xuICAgICAgYXR0cmlidXRlLnZhbHVlID0gbmV3IEZsb2F0MzJBcnJheSgyKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB7IGRhdGEsIGdldFBvc2l0aW9uIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHsgdmFsdWUgfSA9IGF0dHJpYnV0ZTtcbiAgICBsZXQgaSA9IDA7XG4gICAgZm9yIChjb25zdCBwb2ludCBvZiBkYXRhKSB7XG4gICAgICBjb25zdCBwb3NpdGlvbiA9IGdldFBvc2l0aW9uKHBvaW50KTtcbiAgICAgIHZhbHVlW2krK10gPSBmcDY0TG93UGFydChwb3NpdGlvblswXSk7XG4gICAgICB2YWx1ZVtpKytdID0gZnA2NExvd1BhcnQocG9zaXRpb25bMV0pO1xuICAgIH1cbiAgfVxuXG4gIC8vIHlhdyh6KSwgcGl0Y2goeSkgYW5kIHJvbGwoeCkgaW4gcmFkaWFuc1xuICBjYWxjdWxhdGVJbnN0YW5jZVJvdGF0aW9ucyhhdHRyaWJ1dGUpIHtcbiAgICBjb25zdCB7IGRhdGEsIGdldFlhdywgZ2V0UGl0Y2gsIGdldFJvbGwgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgeyB2YWx1ZSwgc2l6ZSB9ID0gYXR0cmlidXRlO1xuICAgIGxldCBpID0gMDtcbiAgICBmb3IgKGNvbnN0IHBvaW50IG9mIGRhdGEpIHtcbiAgICAgIHZhbHVlW2krK10gPSBnZXRSb2xsKHBvaW50KSAqIFJBRElBTl9QRVJfREVHUkVFO1xuICAgICAgdmFsdWVbaSsrXSA9IGdldFBpdGNoKHBvaW50KSAqIFJBRElBTl9QRVJfREVHUkVFO1xuICAgICAgdmFsdWVbaSsrXSA9IGdldFlhdyhwb2ludCkgKiBSQURJQU5fUEVSX0RFR1JFRTtcbiAgICB9XG4gIH1cbn1cblxuTWVzaExheWVyLmxheWVyTmFtZSA9ICdNZXNoTGF5ZXInO1xuTWVzaExheWVyLmRlZmF1bHRQcm9wcyA9IGRlZmF1bHRQcm9wcztcbiJdfQ==
