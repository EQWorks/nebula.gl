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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvbWVzaC1sYXllci9tZXNoLWxheWVyLmpzIl0sIm5hbWVzIjpbImZwNjRMb3dQYXJ0IiwiZnA2NCIsIlJBRElBTl9QRVJfREVHUkVFIiwiTWF0aCIsIlBJIiwiYXNzZXJ0IiwiY29uZGl0aW9uIiwibWVzc2FnZSIsIkVycm9yIiwiZ2V0VGV4dHVyZSIsImdsIiwic3JjIiwib3B0cyIsIk9iamVjdCIsImFzc2lnbiIsInVybHMiLCJ0aGVuIiwidGV4dHVyZXMiLCJjYXRjaCIsImVycm9yIiwiUHJvbWlzZSIsInJlc29sdmUiLCJnZXRUZXh0dXJlRnJvbURhdGEiLCJkYXRhIiwiVGV4dHVyZTJEIiwidmFsaWRhdGVHZW9tZXRyeUF0dHJpYnV0ZXMiLCJhdHRyaWJ1dGVzIiwicG9zaXRpb25zIiwibm9ybWFscyIsInRleENvb3JkcyIsImdldEdlb21ldHJ5IiwiR2VvbWV0cnkiLCJERUZBVUxUX0NPTE9SIiwiZGVmYXVsdFByb3BzIiwibWVzaCIsInRleHR1cmUiLCJzaXplU2NhbGUiLCJ0eXBlIiwidmFsdWUiLCJtaW4iLCJwYXJhbWV0ZXJzIiwiZGVwdGhUZXN0IiwiZGVwdGhGdW5jIiwiR0wiLCJMRVFVQUwiLCJsaWdodFNldHRpbmdzIiwiZ2V0UG9zaXRpb24iLCJ4IiwicG9zaXRpb24iLCJnZXRDb2xvciIsImdldFlhdyIsInlhdyIsImFuZ2xlIiwiZ2V0UGl0Y2giLCJwaXRjaCIsImdldFJvbGwiLCJyb2xsIiwiTWVzaExheWVyIiwicHJvamVjdE1vZHVsZSIsInVzZTY0Yml0UHJvamVjdGlvbiIsInZzIiwiZnMiLCJtb2R1bGVzIiwiYXR0cmlidXRlTWFuYWdlciIsImdldEF0dHJpYnV0ZU1hbmFnZXIiLCJhZGRJbnN0YW5jZWQiLCJpbnN0YW5jZVBvc2l0aW9ucyIsInNpemUiLCJhY2Nlc3NvciIsImluc3RhbmNlUG9zaXRpb25zNjR4eSIsInVwZGF0ZSIsImNhbGN1bGF0ZUluc3RhbmNlUG9zaXRpb25zNjR4eUxvdyIsImluc3RhbmNlUm90YXRpb25zIiwiY2FsY3VsYXRlSW5zdGFuY2VSb3RhdGlvbnMiLCJpbnN0YW5jZUNvbG9ycyIsImRlZmF1bHRWYWx1ZSIsInNldFN0YXRlIiwiZW1wdHlUZXh0dXJlIiwiY29udGV4dCIsIlVpbnQ4QXJyYXkiLCJ3aWR0aCIsImhlaWdodCIsInByb3BzIiwib2xkUHJvcHMiLCJjaGFuZ2VGbGFncyIsImRhdGFDaGFuZ2VkIiwiaW52YWxpZGF0ZUFsbCIsIl91cGRhdGVGUDY0Iiwic2V0VGV4dHVyZSIsInN0YXRlIiwibW9kZWwiLCJkZWxldGUiLCJnZXRNb2RlbCIsInVuaWZvcm1zIiwicmVuZGVyIiwiTW9kZWwiLCJnZXRTaGFkZXJzIiwiaWQiLCJnZW9tZXRyeSIsImlzSW5zdGFuY2VkIiwic2hhZGVyQ2FjaGUiLCJzZXRVbmlmb3JtcyIsInNhbXBsZXIiLCJoYXNUZXh0dXJlIiwiYXR0cmlidXRlIiwiaXNGUDY0IiwidXNlNjRiaXRQb3NpdGlvbnMiLCJjb25zdGFudCIsIkZsb2F0MzJBcnJheSIsImkiLCJwb2ludCIsIkxheWVyIiwibGF5ZXJOYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBd0JBOztBQUNBOztBQUNBOztBQUdBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBSFFBLFcsR0FBZ0JDLFUsQ0FBaEJELFc7QUFLUixJQUFNRSxpQkFBaUIsR0FBR0MsSUFBSSxDQUFDQyxFQUFMLEdBQVUsR0FBcEMsQyxDQUVBOztBQUNBLFNBQVNDLE1BQVQsQ0FBZ0JDLFNBQWhCLEVBQTJCQyxPQUEzQixFQUFvQztBQUNsQyxNQUFJLENBQUNELFNBQUwsRUFBZ0I7QUFDZCxVQUFNLElBQUlFLEtBQUosb0JBQXNCRCxPQUF0QixFQUFOO0FBQ0Q7QUFDRjtBQUVEOzs7Ozs7Ozs7QUFPQSxTQUFTRSxVQUFULENBQW9CQyxFQUFwQixFQUF3QkMsR0FBeEIsRUFBNkJDLElBQTdCLEVBQW1DO0FBQ2pDLE1BQUksT0FBT0QsR0FBUCxLQUFlLFFBQW5CLEVBQTZCO0FBQzNCO0FB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QixtSUFBMEI7QUFBQSxjQUFmdUYsS0FBZTtBQUN4QnhFLFVBQUFBLEtBQUssQ0FBQ3VFLENBQUMsRUFBRixDQUFMLEdBQWF0RCxPQUFPLENBQUN1RCxLQUFELENBQVAsR0FBaUI1RyxpQkFBOUI7QUFDQW9DLFVBQUFBLEtBQUssQ0FBQ3VFLENBQUMsRUFBRixDQUFMLEdBQWF4RCxRQUFRLENBQUN5RCxLQUFELENBQVIsR0FBa0I1RyxpQkFBL0I7QUFDQW9DLFVBQUFBLEtBQUssQ0FBQ3VFLENBQUMsRUFBRixDQUFMLEdBQWEzRCxNQUFNLENBQUM0RCxLQUFELENBQU4sR0FBZ0I1RyxpQkFBN0I7QUFDRDtBQVJtQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBU3JDOzs7O0VBMUlvQzZHLHlCOzs7QUE2SXZDdEQsU0FBUyxDQUFDdUQsU0FBVixHQUFzQixXQUF0QjtBQUNBdkQsU0FBUyxDQUFDeEIsWUFBVixHQUF5QkEsWUFBekIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBOb3RlOiBUaGlzIGZpbGUgd2lsbCBlaXRoZXIgYmUgbW92ZWQgYmFjayB0byBkZWNrLmdsIG9yIHJlZm9ybWF0dGVkIHRvIHdlYi1tb25vcmVwbyBzdGFuZGFyZHNcbi8vIERpc2FibGluZyBsaW50IHRlbXBvcmFyaWx5IHRvIGZhY2lsaXRhdGUgY29weWluZyBjb2RlIGluIGFuZCBvdXQgb2YgdGhpcyByZXBvXG4vKiBlc2xpbnQtZGlzYWJsZSAqL1xuXG4vLyBDb3B5cmlnaHQgKGMpIDIwMTUgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgeyBMYXllciwgQ09PUkRJTkFURV9TWVNURU0gfSBmcm9tICdrZXBsZXItb3V0ZGF0ZWQtZGVjay5nbC1jb3JlJztcbmltcG9ydCBHTCBmcm9tICdAbHVtYS5nbC9jb25zdGFudHMnO1xuaW1wb3J0IHsgTW9kZWwsIEdlb21ldHJ5LCBsb2FkVGV4dHVyZXMsIFRleHR1cmUyRCwgZnA2NCB9IGZyb20gJ0BsdW1hLmdsL2NvcmUnO1xuY29uc3QgeyBmcDY0TG93UGFydCB9ID0gZnA2NDtcblxuaW1wb3J0IHZzIGZyb20gJy4vbWVzaC1sYXllci12ZXJ0ZXguZ2xzbCc7XG5pbXBvcnQgZnMgZnJvbSAnLi9tZXNoLWxheWVyLWZyYWdtZW50Lmdsc2wnO1xuXG5jb25zdCBSQURJQU5fUEVSX0RFR1JFRSA9IE1hdGguUEkgLyAxODA7XG5cbi8vIFJlcGxhY2VtZW50IGZvciB0aGUgZXh0ZXJuYWwgYXNzZXJ0IG1ldGhvZCB0byByZWR1Y2UgYnVuZGxlIHNpemVcbmZ1bmN0aW9uIGFzc2VydChjb25kaXRpb24sIG1lc3NhZ2UpIHtcbiAgaWYgKCFjb25kaXRpb24pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYGRlY2suZ2w6ICR7bWVzc2FnZX1gKTtcbiAgfVxufVxuXG4vKlxuICogTG9hZCBpbWFnZSBkYXRhIGludG8gbHVtYS5nbCBUZXh0dXJlMkQgb2JqZWN0c1xuICogQHBhcmFtIHtXZWJHTENvbnRleHR9IGdsXG4gKiBAcGFyYW0ge1N0cmluZ3xUZXh0dXJlMkR8SFRNTEltYWdlRWxlbWVudHxVaW50OENsYW1wZWRBcnJheX0gc3JjIC0gc291cmNlIG9mIGltYWdlIGRhdGFcbiAqICAgY2FuIGJlIHVybCBzdHJpbmcsIFRleHR1cmUyRCBvYmplY3QsIEhUTUxJbWFnZUVsZW1lbnQgb3IgcGl4ZWwgYXJyYXlcbiAqIEByZXR1cm5zIHtQcm9taXNlfSByZXNvbHZlcyB0byBhbiBvYmplY3Qgd2l0aCBuYW1lIC0+IHRleHR1cmUgbWFwcGluZ1xuICovXG5mdW5jdGlvbiBnZXRUZXh0dXJlKGdsLCBzcmMsIG9wdHMpIHtcbiAgaWYgKHR5cGVvZiBzcmMgPT09ICdzdHJpbmcnKSB7XG4gICAgLy8gVXJsLCBsb2FkIHRoZSBpbWFnZVxuICAgIHJldHVybiBsb2FkVGV4dHVyZXMoZ2wsIE9iamVjdC5hc3NpZ24oeyB1cmxzOiBbc3JjXSB9LCBvcHRzKSlcbiAgICAgIC50aGVuKHRleHR1cmVzID0+IHRleHR1cmVzWzBdKVxuICAgICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgbG9hZCB0ZXh0dXJlIGZyb20gJHtzcmN9OiAke2Vycm9yfWApO1xuICAgICAgfSk7XG4gIH1cbiAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gcmVzb2x2ZShnZXRUZXh0dXJlRnJvbURhdGEoZ2wsIHNyYywgb3B0cykpKTtcbn1cblxuLypcbiAqIENvbnZlcnQgaW1hZ2UgZGF0YSBpbnRvIHRleHR1cmVcbiAqIEByZXR1cm5zIHtUZXh0dXJlMkR9IHRleHR1cmVcbiAqL1xuZnVuY3Rpb24gZ2V0VGV4dHVyZUZyb21EYXRhKGdsLCBkYXRhLCBvcHRzKSB7XG4gIGlmIChkYXRhIGluc3RhbmNlb2YgVGV4dHVyZTJEKSB7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cbiAgcmV0dXJuIG5ldyBUZXh0dXJlMkQoZ2wsIE9iamVjdC5hc3NpZ24oeyBkYXRhIH0sIG9wdHMpKTtcbn1cblxuZnVuY3Rpb24gdmFsaWRhdGVHZW9tZXRyeUF0dHJpYnV0ZXMoYXR0cmlidXRlcykge1xuICBhc3NlcnQoYXR0cmlidXRlcy5wb3NpdGlvbnMgJiYgYXR0cmlidXRlcy5ub3JtYWxzICYmIGF0dHJpYnV0ZXMudGV4Q29vcmRzKTtcbn1cblxuLypcbiAqIENvbnZlcnQgbWVzaCBkYXRhIGludG8gZ2VvbWV0cnlcbiAqIEByZXR1cm5zIHtHZW9tZXRyeX0gZ2VvbWV0cnlcbiAqL1xuZnVuY3Rpb24gZ2V0R2VvbWV0cnkoZGF0YSkge1xuICBpZiAoZGF0YSBpbnN0YW5jZW9mIEdlb21ldHJ5KSB7XG4gICAgdmFsaWRhdGVHZW9tZXRyeUF0dHJpYnV0ZXMoZGF0YS5hdHRyaWJ1dGVzKTtcbiAgICByZXR1cm4gZGF0YTtcbiAgfSBlbHNlIGlmIChkYXRhLnBvc2l0aW9ucykge1xuICAgIHZhbGlkYXRlR2VvbWV0cnlBdHRyaWJ1dGVzKGRhdGEpO1xuICAgIHJldHVybiBuZXcgR2VvbWV0cnkoe1xuICAgICAgYXR0cmlidXRlczogZGF0YVxuICAgIH0pO1xuICB9XG4gIHRocm93IEVycm9yKCdJbnZhbGlkIG1lc2gnKTtcbn1cblxuY29uc3QgREVGQVVMVF9DT0xPUiA9IFswLCAwLCAwLCAyNTVdO1xuY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICBtZXNoOiBudWxsLFxuICB0ZXh0dXJlOiBudWxsLFxuICBzaXplU2NhbGU6IHsgdHlwZTogJ251bWJlcicsIHZhbHVlOiAxLCBtaW46IDAgfSxcblxuICAvLyBUT0RPIC0gcGFyYW1ldGVycyBzaG91bGQgYmUgbWVyZ2VkLCBub3QgY29tcGxldGVseSBvdmVycmlkZGVuXG4gIHBhcmFtZXRlcnM6IHtcbiAgICBkZXB0aFRlc3Q6IHRydWUsXG4gICAgZGVwdGhGdW5jOiBHTC5MRVFVQUxcbiAgfSxcbiAgZnA2NDogZmFsc2UsXG4gIC8vIE9wdGlvbmFsIHNldHRpbmdzIGZvciAnbGlnaHRpbmcnIHNoYWRlciBtb2R1bGVcbiAgbGlnaHRTZXR0aW5nczoge30sXG5cbiAgZ2V0UG9zaXRpb246IHsgdHlwZTogJ2FjY2Vzc29yJywgdmFsdWU6IHggPT4geC5wb3NpdGlvbiB9LFxuICBnZXRDb2xvcjogeyB0eXBlOiAnYWNjZXNzb3InLCB2YWx1ZTogREVGQVVMVF9DT0xPUiB9LFxuXG4gIC8vIHlhdywgcGl0Y2ggYW5kIHJvbGwgYXJlIGluIGRlZ3JlZXNcbiAgLy8gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvRXVsZXJfYW5nbGVzXG4gIGdldFlhdzogeyB0eXBlOiAnYWNjZXNzb3InLCB2YWx1ZTogeCA9PiB4LnlhdyB8fCB4LmFuZ2xlIHx8IDAgfSxcbiAgZ2V0UGl0Y2g6IHsgdHlwZTogJ2FjY2Vzc29yJywgdmFsdWU6IHggPT4geC5waXRjaCB8fCAwIH0sXG4gIGdldFJvbGw6IHsgdHlwZTogJ2FjY2Vzc29yJywgdmFsdWU6IHggPT4geC5yb2xsIHx8IDAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWVzaExheWVyIGV4dGVuZHMgTGF5ZXIge1xuICBnZXRTaGFkZXJzKCkge1xuICAgIGNvbnN0IHByb2plY3RNb2R1bGUgPSB0aGlzLnVzZTY0Yml0UHJvamVjdGlvbigpID8gJ3Byb2plY3Q2NCcgOiAncHJvamVjdDMyJztcbiAgICByZXR1cm4geyB2cywgZnMsIG1vZHVsZXM6IFtwcm9qZWN0TW9kdWxlLCAnbGlnaHRpbmcnLCAncGlja2luZyddIH07XG4gIH1cblxuICBpbml0aWFsaXplU3RhdGUoKSB7XG4gICAgY29uc3QgYXR0cmlidXRlTWFuYWdlciA9IHRoaXMuZ2V0QXR0cmlidXRlTWFuYWdlcigpO1xuICAgIGF0dHJpYnV0ZU1hbmFnZXIuYWRkSW5zdGFuY2VkKHtcbiAgICAgIGluc3RhbmNlUG9zaXRpb25zOiB7XG4gICAgICAgIHNpemU6IDMsXG4gICAgICAgIGFjY2Vzc29yOiAnZ2V0UG9zaXRpb24nXG4gICAgICB9LFxuICAgICAgaW5zdGFuY2VQb3NpdGlvbnM2NHh5OiB7XG4gICAgICAgIHNpemU6IDIsXG4gICAgICAgIGFjY2Vzc29yOiAnZ2V0UG9zaXRpb24nLFxuICAgICAgICB1cGRhdGU6IHRoaXMuY2FsY3VsYXRlSW5zdGFuY2VQb3NpdGlvbnM2NHh5TG93XG4gICAgICB9LFxuICAgICAgaW5zdGFuY2VSb3RhdGlvbnM6IHtcbiAgICAgICAgc2l6ZTogMyxcbiAgICAgICAgYWNjZXNzb3I6IFsnZ2V0WWF3JywgJ2dldFBpdGNoJywgJ2dldFJvbGwnXSxcbiAgICAgICAgdXBkYXRlOiB0aGlzLmNhbGN1bGF0ZUluc3RhbmNlUm90YXRpb25zXG4gICAgICB9LFxuICAgICAgaW5zdGFuY2VDb2xvcnM6IHtcbiAgICAgICAgc2l6ZTogNCxcbiAgICAgICAgYWNjZXNzb3I6ICdnZXRDb2xvcicsXG4gICAgICAgIGRlZmF1bHRWYWx1ZTogWzAsIDAsIDAsIDI1NV1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgLy8gQXZvaWQgbHVtYS5nbCdzIG1pc3NpbmcgdW5pZm9ybSB3YXJuaW5nXG4gICAgICAvLyBUT0RPIC0gYWRkIGZlYXR1cmUgdG8gbHVtYS5nbCB0byBzcGVjaWZ5IGlnbm9yZWQgdW5pZm9ybXM/XG4gICAgICBlbXB0eVRleHR1cmU6IG5ldyBUZXh0dXJlMkQodGhpcy5jb250ZXh0LmdsLCB7XG4gICAgICAgIGRhdGE6IG5ldyBVaW50OEFycmF5KDQpLFxuICAgICAgICB3aWR0aDogMSxcbiAgICAgICAgaGVpZ2h0OiAxXG4gICAgICB9KVxuICAgIH0pO1xuICB9XG5cbiAgdXBkYXRlU3RhdGUoeyBwcm9wcywgb2xkUHJvcHMsIGNoYW5nZUZsYWdzIH0pIHtcbiAgICBjb25zdCBhdHRyaWJ1dGVNYW5hZ2VyID0gdGhpcy5nZXRBdHRyaWJ1dGVNYW5hZ2VyKCk7XG5cbiAgICAvLyBzdXBlci51cGRhdGVTdGF0ZSh7cHJvcHMsIG9sZFByb3BzLCBjaGFuZ2VGbGFnc30pO1xuICAgIGlmIChjaGFuZ2VGbGFncy5kYXRhQ2hhbmdlZCkge1xuICAgICAgYXR0cmlidXRlTWFuYWdlci5pbnZhbGlkYXRlQWxsKCk7XG4gICAgfVxuXG4gICAgdGhpcy5fdXBkYXRlRlA2NChwcm9wcywgb2xkUHJvcHMpO1xuXG4gICAgaWYgKHByb3BzLnRleHR1cmUgIT09IG9sZFByb3BzLnRleHR1cmUpIHtcbiAgICAgIHRoaXMuc2V0VGV4dHVyZShwcm9wcy50ZXh0dXJlKTtcbiAgICB9XG4gIH1cblxuICBfdXBkYXRlRlA2NChwcm9wcywgb2xkUHJvcHMpIHtcbiAgICBpZiAocHJvcHMuZnA2NCAhPT0gb2xkUHJvcHMuZnA2NCkge1xuICAgICAgaWYgKHRoaXMuc3RhdGUubW9kZWwpIHtcbiAgICAgICAgdGhpcy5zdGF0ZS5tb2RlbC5kZWxldGUoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZXRTdGF0ZSh7IG1vZGVsOiB0aGlzLmdldE1vZGVsKHRoaXMuY29udGV4dC5nbCkgfSk7XG5cbiAgICAgIHRoaXMuc2V0VGV4dHVyZSh0aGlzLnN0YXRlLnRleHR1cmUpO1xuXG4gICAgICBjb25zdCBhdHRyaWJ1dGVNYW5hZ2VyID0gdGhpcy5nZXRBdHRyaWJ1dGVNYW5hZ2VyKCk7XG4gICAgICBhdHRyaWJ1dGVNYW5hZ2VyLmludmFsaWRhdGVBbGwoKTtcbiAgICB9XG4gIH1cblxuICBkcmF3KHsgdW5pZm9ybXMgfSkge1xuICAgIGNvbnN0IHsgc2l6ZVNjYWxlIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgdGhpcy5zdGF0ZS5tb2RlbC5yZW5kZXIoXG4gICAgICBPYmplY3QuYXNzaWduKHt9LCB1bmlmb3Jtcywge1xuICAgICAgICBzaXplU2NhbGVcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIGdldE1vZGVsKGdsKSB7XG4gICAgcmV0dXJuIG5ldyBNb2RlbChcbiAgICAgIGdsLFxuICAgICAgT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5nZXRTaGFkZXJzKCksIHtcbiAgICAgICAgaWQ6IHRoaXMucHJvcHMuaWQsXG4gICAgICAgIGdlb21ldHJ5OiBnZXRHZW9tZXRyeSh0aGlzLnByb3BzLm1lc2gpLFxuICAgICAgICBpc0luc3RhbmNlZDogdHJ1ZSxcbiAgICAgICAgc2hhZGVyQ2FjaGU6IHRoaXMuY29udGV4dC5zaGFkZXJDYWNoZVxuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgc2V0VGV4dHVyZShzcmMpIHtcbiAgICBjb25zdCB7IGdsIH0gPSB0aGlzLmNvbnRleHQ7XG4gICAgY29uc3QgeyBtb2RlbCwgZW1wdHlUZXh0dXJlIH0gPSB0aGlzLnN0YXRlO1xuXG4gICAgaWYgKHNyYykge1xuICAgICAgZ2V0VGV4dHVyZShnbCwgc3JjKS50aGVuKHRleHR1cmUgPT4ge1xuICAgICAgICBtb2RlbC5zZXRVbmlmb3Jtcyh7IHNhbXBsZXI6IHRleHR1cmUsIGhhc1RleHR1cmU6IDEgfSk7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyB0ZXh0dXJlIH0pO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHJlc2V0XG4gICAgICB0aGlzLnN0YXRlLm1vZGVsLnNldFVuaWZvcm1zKHsgc2FtcGxlcjogZW1wdHlUZXh0dXJlLCBoYXNUZXh0dXJlOiAwIH0pO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IHRleHR1cmU6IG51bGwgfSk7XG4gICAgfVxuICB9XG5cbiAgY2FsY3VsYXRlSW5zdGFuY2VQb3NpdGlvbnM2NHh5TG93KGF0dHJpYnV0ZSkge1xuICAgIGNvbnN0IGlzRlA2NCA9IHRoaXMudXNlNjRiaXRQb3NpdGlvbnMoKTtcbiAgICBhdHRyaWJ1dGUuY29uc3RhbnQgPSAhaXNGUDY0O1xuXG4gICAgaWYgKCFpc0ZQNjQpIHtcbiAgICAgIGF0dHJpYnV0ZS52YWx1ZSA9IG5ldyBGbG9hdDMyQXJyYXkoMik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgeyBkYXRhLCBnZXRQb3NpdGlvbiB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB7IHZhbHVlIH0gPSBhdHRyaWJ1dGU7XG4gICAgbGV0IGkgPSAwO1xuICAgIGZvciAoY29uc3QgcG9pbnQgb2YgZGF0YSkge1xuICAgICAgY29uc3QgcG9zaXRpb24gPSBnZXRQb3NpdGlvbihwb2ludCk7XG4gICAgICB2YWx1ZVtpKytdID0gZnA2NExvd1BhcnQocG9zaXRpb25bMF0pO1xuICAgICAgdmFsdWVbaSsrXSA9IGZwNjRMb3dQYXJ0KHBvc2l0aW9uWzFdKTtcbiAgICB9XG4gIH1cblxuICAvLyB5YXcoeiksIHBpdGNoKHkpIGFuZCByb2xsKHgpIGluIHJhZGlhbnNcbiAgY2FsY3VsYXRlSW5zdGFuY2VSb3RhdGlvbnMoYXR0cmlidXRlKSB7XG4gICAgY29uc3QgeyBkYXRhLCBnZXRZYXcsIGdldFBpdGNoLCBnZXRSb2xsIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHsgdmFsdWUsIHNpemUgfSA9IGF0dHJpYnV0ZTtcbiAgICBsZXQgaSA9IDA7XG4gICAgZm9yIChjb25zdCBwb2ludCBvZiBkYXRhKSB7XG4gICAgICB2YWx1ZVtpKytdID0gZ2V0Um9sbChwb2ludCkgKiBSQURJQU5fUEVSX0RFR1JFRTtcbiAgICAgIHZhbHVlW2krK10gPSBnZXRQaXRjaChwb2ludCkgKiBSQURJQU5fUEVSX0RFR1JFRTtcbiAgICAgIHZhbHVlW2krK10gPSBnZXRZYXcocG9pbnQpICogUkFESUFOX1BFUl9ERUdSRUU7XG4gICAgfVxuICB9XG59XG5cbk1lc2hMYXllci5sYXllck5hbWUgPSAnTWVzaExheWVyJztcbk1lc2hMYXllci5kZWZhdWx0UHJvcHMgPSBkZWZhdWx0UHJvcHM7XG4iXX0=