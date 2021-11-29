"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _keplerOutdatedDeck = require("kepler-outdated-deck.gl-layers");

var _constants = _interopRequireDefault(require("@luma.gl/constants"));

var _core = require("@luma.gl/core");

var _outline = _interopRequireDefault(require("../../shaderlib/outline/outline"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

// TODO - this should be built into assembleShaders
function injectShaderCode(_ref) {
  var source = _ref.source,
      _ref$code = _ref.code,
      code = _ref$code === void 0 ? '' : _ref$code;
  var INJECT_CODE = /}[^{}]*$/;
  return source.replace(INJECT_CODE, code.concat('\n}\n'));
}

var VS_CODE = "  outline_setUV(gl_Position);\n  outline_setZLevel(instanceZLevel);\n";
var FS_CODE = "  gl_FragColor = outline_filterColor(gl_FragColor);\n";
var defaultProps = {
  getZLevel: {
    type: 'accessor',
    value: 0
  }
};

var PathOutlineLayer =
/*#__PURE__*/
function (_PathLayer) {
  _inherits(PathOutlineLayer, _PathLayer);

  function PathOutlineLayer() {
    _classCallCheck(this, PathOutlineLayer);

    return _possibleConstructorReturn(this, _getPrototypeOf(PathOutlineLayer).apply(this, arguments));
  }

  _createClass(PathOutlineLayer, [{
    key: "getShaders",
    // Override getShaders to inject the outline module
    value: function getShaders() {
      var shaders = _get(_getPrototypeOf(PathOutlineLayer.prototype), "getShaders", this).call(this);

      return Object.assign({}, shaders, {
        modules: shaders.modules.concat([_outline.default]),
        vs: injectShaderCode({
          source: shaders.vs,
          code: VS_CODE
        }),
        fs: injectShaderCode({
          source: shaders.fs,
          code: FS_CODE
        })
      });
    }
  }, {
    key: "initializeState",
    value: function initializeState(context) {
      _get(_getPrototypeOf(PathOutlineLayer.prototype), "initializeState", this).call(this, context); // Create an outline "shadow" map
      // TODO - we should create a single outlineMap for all layers


      this.setState({
        outlineFramebuffer: new _core.Framebuffer(context.gl),
        dummyTexture: new _core.Texture2D(context.gl)
      }); // Create an attribute manager

      this.state.attributeManager.addInstanced({
        instanceZLevel: {
          size: 1,
          type: _constants.default.UNSIGNED_BYTE,
          update: this.calculateZLevels,
          accessor: 'getZLevel'
        }
      });
    } // Override draw to add render module

  }, {
    key: "draw",
    value: function draw(_ref2) {
      var _ref2$moduleParameter = _ref2.moduleParameters,
          moduleParameters = _ref2$moduleParameter === void 0 ? {} : _ref2$moduleParameter,
          parameters = _ref2.parameters,
          uniforms = _ref2.uniforms,
          context = _ref2.context;
      // Need to calculate same uniforms as base layer
      var _this$props = this.props,
          rounded = _this$props.rounded,
          miterLimit = _this$props.miterLimit,
          widthScale = _this$props.widthScale,
          widthMinPixels = _this$props.widthMinPixels,
          widthMaxPixels = _this$props.widthMaxPixels,
          dashJustified = _this$props.dashJustified;
      uniforms = Object.assign({}, uniforms, {
        jointType: Number(rounded),
        alignMode: Number(dashJustified),
        widthScale: widthScale,
        miterLimit: miterLimit,
        widthMinPixels: widthMinPixels,
        widthMaxPixels: widthMaxPixels
      }); // Render the outline shadowmap (based on segment z orders)

      var _this$state = this.state,
          outlineFramebuffer = _this$state.outlineFramebuffer,
          dummyTexture = _this$state.dummyTexture;
      outlineFramebuffer.resize();
      outlineFramebuffer.clear({
        color: true,
        depth: true
      });
      this.state.model.updateModuleSettings({
        outlineEnabled: true,
        outlineRenderShadowmap: true,
        outlineShadowmap: dummyTexture
      });
      this.state.model.draw({
        uniforms: Object.assign({}, uniforms, {
          jointType: 0,
          widthScale: this.props.widthScale * 1.3
        }),
        parameters: {
          depthTest: false,
          // Biggest value needs to go into buffer
          blendEquation: _constants.default.MAX
        },
        framebuffer: outlineFramebuffer
      }); // Now use the outline shadowmap to render the lines (with outlines)

      this.state.model.updateModuleSettings({
        outlineEnabled: true,
        outlineRenderShadowmap: false,
        outlineShadowmap: outlineFramebuffer
      });
      this.state.model.draw({
        uniforms: Object.assign({}, uniforms, {
          jointType: Number(rounded),
          widthScale: this.props.widthScale
        }),
        parameters: {
          depthTest: false
        }
      });
    }
  }, {
    key: "calculateZLevels",
    value: function calculateZLevels(attribute) {
      var getZLevel = this.props.getZLevel;
      var pathTesselator = this.state.pathTesselator;
      attribute.value = pathTesselator._updateAttribute({
        target: attribute.value,
        size: 1,
        getValue: function getValue(object, index) {
          return [getZLevel(object, index) || 0];
        }
      });
    }
  }]);

  return PathOutlineLayer;
}(_keplerOutdatedDeck.PathLayer);

exports.default = PathOutlineLayer;
PathOutlineLayer.layerName = 'PathOutlineLayer';
PathOutlineLayer.defaultProps = defaultProps;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvcGF0aC1vdXRsaW5lLWxheWVyL3BhdGgtb3V0bGluZS1sYXllci5qcyJdLCJuYW1lcyI6WyJpbmplY3RTaGFkZXJDb2RlIiwic291cmNlIiwiY29kZSIsIklOSkVDVF9DT0RFIiwicmVwbGFjZSIsImNvbmNhdCIsIlZTX0NPREUiLCJGU19DT0RFIiwiZGVmYXVsdFByb3BzIiwiZ2V0WkxldmVsIiwidHlwZSIsInZhbHVlIiwiUGF0aE91dGxpbmVMYXllciIsInNoYWRlcnMiLCJPYmplY3QiLCJhc3NpZ24iLCJtb2R1bGVzIiwib3V0bGluZSIsInZzIiwiZnMiLCJjb250ZXh0Iiwic2V0U3RhdGUiLCJvdXRsaW5lRnJhbWVidWZmZXIiLCJGcmFtZWJ1ZmZlciIsImdsIiwiZHVtbXlUZXh0dXJlIiwiVGV4dHVyZTJEIiwic3RhdGUiLCJhdHRyaWJ1dGVNYW5hZ2VyIiwiYWRkSW5zdGFuY2VkIiwiaW5zdGFuY2VaTGV2ZWwiLCJzaXplIiwiR0wiLCJVTlNJR05FRF9CWVRFIiwidXBkYXRlIiwiY2FsY3VsYXRlWkxldmVscyIsImFjY2Vzc29yIiwibW9kdWxlUGFyYW1ldGVycyIsInBhcmFtZXRlcnMiLCJ1bmlmb3JtcyIsInByb3BzIiwicm91bmRlZCIsIm1pdGVyTGltaXQiLCJ3aWR0aFNjYWxlIiwid2lkdGhNaW5QaXhlbHMiLCJ3aWR0aE1heFBpeGVscyIsImRhc2hKdXN0aWZpZWQiLCJqb2ludFR5cGUiLCJOdW1iZXIiLCJhbGlnbk1vZGUiLCJyZXNpemUiLCJjbGVhciIsImNvbG9yIiwiZGVwdGgiLCJtb2RlbCIsInVwZGF0ZU1vZHVsZVNldHRpbmdzIiwib3V0bGluZUVuYWJsZWQiLCJvdXRsaW5lUmVuZGVyU2hhZG93bWFwIiwib3V0bGluZVNoYWRvd21hcCIsImRyYXciLCJkZXB0aFRlc3QiLCJibGVuZEVxdWF0aW9uIiwiTUFYIiwiZnJhbWVidWZmZXIiLCJhdHRyaWJ1dGUiLCJwYXRoVGVzc2VsYXRvciIsIl91cGRhdGVBdHRyaWJ1dGUiLCJ0YXJnZXQiLCJnZXRWYWx1ZSIsIm9iamVjdCIsImluZGV4IiwiUGF0aExheWVyIiwibGF5ZXJOYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7QUFDQSxTQUFTQSxnQkFBVCxPQUFpRDtBQUFBLE1BQXJCQyxNQUFxQixRQUFyQkEsTUFBcUI7QUFBQSx1QkFBYkMsSUFBYTtBQUFBLE1BQWJBLElBQWEsMEJBQU4sRUFBTTtBQUMvQyxNQUFNQyxXQUFXLEdBQUcsVUFBcEI7QUFDQSxTQUFPRixNQUFNLENBQUNHLE9BQVAsQ0FBZUQsV0FBZixFQUE0QkQsSUFBSSxDQUFDRyxNQUFMLENBQVksT0FBWixDQUE1QixDQUFQO0FBQ0Q7O0FBRUQsSUFBTUMsT0FBTywwRUFBYjtBQUtBLElBQU1DLE9BQU8sMERBQWI7QUFJQSxJQUFNQyxZQUFZLEdBQUc7QUFDbkJDLEVBQUFBLFNBQVMsRUFBRTtBQUFFQyxJQUFBQSxJQUFJLEVBQUUsVUFBUjtBQUFvQkMsSUFBQUEsS0FBSyxFQUFFO0FBQTNCO0FBRFEsQ0FBckI7O0lBSXFCQyxnQjs7Ozs7Ozs7Ozs7OztBQUNuQjtpQ0FDYTtBQUNYLFVBQU1DLE9BQU8sbUZBQWI7O0FBQ0EsYUFBT0MsTUFBTSxDQUFDQyxNQUFQLENBQWMsRUFBZCxFQUFrQkYsT0FBbEIsRUFBMkI7QUFDaENHLFFBQUFBLE9BQU8sRUFBRUgsT0FBTyxDQUFDRyxPQUFSLENBQWdCWCxNQUFoQixDQUF1QixDQUFDWSxnQkFBRCxDQUF2QixDQUR1QjtBQUVoQ0MsUUFBQUEsRUFBRSxFQUFFbEIsZ0JBQWdCLENBQUM7QUFBRUMsVUFBQUEsTUFBTSxFQUFFWSxPQUFPLENBQUNLLEVBQWxCO0FBQXNCaEIsVUFBQUEsSUFBSSxFQUFFSTtBQUE1QixTQUFELENBRlk7QUFHaENhLFFBQUFBLEVBQUUsRUFBRW5CLGdCQUFnQixDQUFDO0FBQUVDLFVBQUFBLE1BQU0sRUFBRVksT0FBTyxD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U0MsS0FBVCxDQUFULElBQTRCLENBQTdCLENBQW5CO0FBQUE7QUFIc0MsT0FBaEMsQ0FBbEI7QUFLRDs7OztFQXZHMkNDLDZCOzs7QUEwRzlDM0QsZ0JBQWdCLENBQUM0RCxTQUFqQixHQUE2QixrQkFBN0I7QUFDQTVELGdCQUFnQixDQUFDSixZQUFqQixHQUFnQ0EsWUFBaEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQYXRoTGF5ZXIgfSBmcm9tICdrZXBsZXItb3V0ZGF0ZWQtZGVjay5nbC1sYXllcnMnO1xuaW1wb3J0IEdMIGZyb20gJ0BsdW1hLmdsL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBGcmFtZWJ1ZmZlciwgVGV4dHVyZTJEIH0gZnJvbSAnQGx1bWEuZ2wvY29yZSc7XG5pbXBvcnQgb3V0bGluZSBmcm9tICcuLi8uLi9zaGFkZXJsaWIvb3V0bGluZS9vdXRsaW5lJztcblxuLy8gVE9ETyAtIHRoaXMgc2hvdWxkIGJlIGJ1aWx0IGludG8gYXNzZW1ibGVTaGFkZXJzXG5mdW5jdGlvbiBpbmplY3RTaGFkZXJDb2RlKHsgc291cmNlLCBjb2RlID0gJycgfSkge1xuICBjb25zdCBJTkpFQ1RfQ09ERSA9IC99W157fV0qJC87XG4gIHJldHVybiBzb3VyY2UucmVwbGFjZShJTkpFQ1RfQ09ERSwgY29kZS5jb25jYXQoJ1xcbn1cXG4nKSk7XG59XG5cbmNvbnN0IFZTX0NPREUgPSBgXFxcbiAgb3V0bGluZV9zZXRVVihnbF9Qb3NpdGlvbik7XG4gIG91dGxpbmVfc2V0WkxldmVsKGluc3RhbmNlWkxldmVsKTtcbmA7XG5cbmNvbnN0IEZTX0NPREUgPSBgXFxcbiAgZ2xfRnJhZ0NvbG9yID0gb3V0bGluZV9maWx0ZXJDb2xvcihnbF9GcmFnQ29sb3IpO1xuYDtcblxuY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICBnZXRaTGV2ZWw6IHsgdHlwZTogJ2FjY2Vzc29yJywgdmFsdWU6IDAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGF0aE91dGxpbmVMYXllciBleHRlbmRzIFBhdGhMYXllciB7XG4gIC8vIE92ZXJyaWRlIGdldFNoYWRlcnMgdG8gaW5qZWN0IHRoZSBvdXRsaW5lIG1vZHVsZVxuICBnZXRTaGFkZXJzKCkge1xuICAgIGNvbnN0IHNoYWRlcnMgPSBzdXBlci5nZXRTaGFkZXJzKCk7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHNoYWRlcnMsIHtcbiAgICAgIG1vZHVsZXM6IHNoYWRlcnMubW9kdWxlcy5jb25jYXQoW291dGxpbmVdKSxcbiAgICAgIHZzOiBpbmplY3RTaGFkZXJDb2RlKHsgc291cmNlOiBzaGFkZXJzLnZzLCBjb2RlOiBWU19DT0RFIH0pLFxuICAgICAgZnM6IGluamVjdFNoYWRlckNvZGUoeyBzb3VyY2U6IHNoYWRlcnMuZnMsIGNvZGU6IEZTX0NPREUgfSlcbiAgICB9KTtcbiAgfVxuXG4gIGluaXRpYWxpemVTdGF0ZShjb250ZXh0KSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZVN0YXRlKGNvbnRleHQpO1xuXG4gICAgLy8gQ3JlYXRlIGFuIG91dGxpbmUgXCJzaGFkb3dcIiBtYXBcbiAgICAvLyBUT0RPIC0gd2Ugc2hvdWxkIGNyZWF0ZSBhIHNpbmdsZSBvdXRsaW5lTWFwIGZvciBhbGwgbGF5ZXJzXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBvdXRsaW5lRnJhbWVidWZmZXI6IG5ldyBGcmFtZWJ1ZmZlcihjb250ZXh0LmdsKSxcbiAgICAgIGR1bW15VGV4dHVyZTogbmV3IFRleHR1cmUyRChjb250ZXh0LmdsKVxuICAgIH0pO1xuXG4gICAgLy8gQ3JlYXRlIGFuIGF0dHJpYnV0ZSBtYW5hZ2VyXG4gICAgdGhpcy5zdGF0ZS5hdHRyaWJ1dGVNYW5hZ2VyLmFkZEluc3RhbmNlZCh7XG4gICAgICBpbnN0YW5jZVpMZXZlbDoge1xuICAgICAgICBzaXplOiAxLFxuICAgICAgICB0eXBlOiBHTC5VTlNJR05FRF9CWVRFLFxuICAgICAgICB1cGRhdGU6IHRoaXMuY2FsY3VsYXRlWkxldmVscyxcbiAgICAgICAgYWNjZXNzb3I6ICdnZXRaTGV2ZWwnXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvLyBPdmVycmlkZSBkcmF3IHRvIGFkZCByZW5kZXIgbW9kdWxlXG4gIGRyYXcoeyBtb2R1bGVQYXJhbWV0ZXJzID0ge30sIHBhcmFtZXRlcnMsIHVuaWZvcm1zLCBjb250ZXh0IH0pIHtcbiAgICAvLyBOZWVkIHRvIGNhbGN1bGF0ZSBzYW1lIHVuaWZvcm1zIGFzIGJhc2UgbGF5ZXJcbiAgICBjb25zdCB7XG4gICAgICByb3VuZGVkLFxuICAgICAgbWl0ZXJMaW1pdCxcbiAgICAgIHdpZHRoU2NhbGUsXG4gICAgICB3aWR0aE1pblBpeGVscyxcbiAgICAgIHdpZHRoTWF4UGl4ZWxzLFxuICAgICAgZGFzaEp1c3RpZmllZFxuICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgdW5pZm9ybXMgPSBPYmplY3QuYXNzaWduKHt9LCB1bmlmb3Jtcywge1xuICAgICAgam9pbnRUeXBlOiBOdW1iZXIocm91bmRlZCksXG4gICAgICBhbGlnbk1vZGU6IE51bWJlcihkYXNoSnVzdGlmaWVkKSxcbiAgICAgIHdpZHRoU2NhbGUsXG4gICAgICBtaXRlckxpbWl0LFxuICAgICAgd2lkdGhNaW5QaXhlbHMsXG4gICAgICB3aWR0aE1heFBpeGVsc1xuICAgIH0pO1xuXG4gICAgLy8gUmVuZGVyIHRoZSBvdXRsaW5lIHNoYWRvd21hcCAoYmFzZWQgb24gc2VnbWVudCB6IG9yZGVycylcbiAgICBjb25zdCB7IG91dGxpbmVGcmFtZWJ1ZmZlciwgZHVtbXlUZXh0dXJlIH0gPSB0aGlzLnN0YXRlO1xuICAgIG91dGxpbmVGcmFtZWJ1ZmZlci5yZXNpemUoKTtcbiAgICBvdXRsaW5lRnJhbWVidWZmZXIuY2xlYXIoeyBjb2xvcjogdHJ1ZSwgZGVwdGg6IHRydWUgfSk7XG5cbiAgICB0aGlzLnN0YXRlLm1vZGVsLnVwZGF0ZU1vZHVsZVNldHRpbmdzKHtcbiAgICAgIG91dGxpbmVFbmFibGVkOiB0cnVlLFxuICAgICAgb3V0bGluZVJlbmRlclNoYWRvd21hcDogdHJ1ZSxcbiAgICAgIG91dGxpbmVTaGFkb3dtYXA6IGR1bW15VGV4dHVyZVxuICAgIH0pO1xuXG4gICAgdGhpcy5zdGF0ZS5tb2RlbC5kcmF3KHtcbiAgICAgIHVuaWZvcm1zOiBPYmplY3QuYXNzaWduKHt9LCB1bmlmb3Jtcywge1xuICAgICAgICBqb2ludFR5cGU6IDAsXG4gICAgICAgIHdpZHRoU2NhbGU6IHRoaXMucHJvcHMud2lkdGhTY2FsZSAqIDEuM1xuICAgICAgfSksXG4gICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgIGRlcHRoVGVzdDogZmFsc2UsXG4gICAgICAgIC8vIEJpZ2dlc3QgdmFsdWUgbmVlZHMgdG8gZ28gaW50byBidWZmZXJcbiAgICAgICAgYmxlbmRFcXVhdGlvbjogR0wuTUFYXG4gICAgICB9LFxuICAgICAgZnJhbWVidWZmZXI6IG91dGxpbmVGcmFtZWJ1ZmZlclxuICAgIH0pO1xuXG4gICAgLy8gTm93IHVzZSB0aGUgb3V0bGluZSBzaGFkb3dtYXAgdG8gcmVuZGVyIHRoZSBsaW5lcyAod2l0aCBvdXRsaW5lcylcbiAgICB0aGlzLnN0YXRlLm1vZGVsLnVwZGF0ZU1vZHVsZVNldHRpbmdzKHtcbiAgICAgIG91dGxpbmVFbmFibGVkOiB0cnVlLFxuICAgICAgb3V0bGluZVJlbmRlclNoYWRvd21hcDogZmFsc2UsXG4gICAgICBvdXRsaW5lU2hhZG93bWFwOiBvdXRsaW5lRnJhbWVidWZmZXJcbiAgICB9KTtcbiAgICB0aGlzLnN0YXRlLm1vZGVsLmRyYXcoe1xuICAgICAgdW5pZm9ybXM6IE9iamVjdC5hc3NpZ24oe30sIHVuaWZvcm1zLCB7XG4gICAgICAgIGpvaW50VHlwZTogTnVtYmVyKHJvdW5kZWQpLFxuICAgICAgICB3aWR0aFNjYWxlOiB0aGlzLnByb3BzLndpZHRoU2NhbGVcbiAgICAgIH0pLFxuICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICBkZXB0aFRlc3Q6IGZhbHNlXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBjYWxjdWxhdGVaTGV2ZWxzKGF0dHJpYnV0ZSkge1xuICAgIGNvbnN0IHsgZ2V0WkxldmVsIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHsgcGF0aFRlc3NlbGF0b3IgfSA9IHRoaXMuc3RhdGU7XG5cbiAgICBhdHRyaWJ1dGUudmFsdWUgPSBwYXRoVGVzc2VsYXRvci5fdXBkYXRlQXR0cmlidXRlKHtcbiAgICAgIHRhcmdldDogYXR0cmlidXRlLnZhbHVlLFxuICAgICAgc2l6ZTogMSxcbiAgICAgIGdldFZhbHVlOiAob2JqZWN0LCBpbmRleCkgPT4gW2dldFpMZXZlbChvYmplY3QsIGluZGV4KSB8fCAwXVxuICAgIH0pO1xuICB9XG59XG5cblBhdGhPdXRsaW5lTGF5ZXIubGF5ZXJOYW1lID0gJ1BhdGhPdXRsaW5lTGF5ZXInO1xuUGF0aE91dGxpbmVMYXllci5kZWZhdWx0UHJvcHMgPSBkZWZhdWx0UHJvcHM7XG4iXX0=