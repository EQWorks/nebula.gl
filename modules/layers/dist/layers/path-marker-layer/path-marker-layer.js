"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _keplerOudatedDeck = require("kepler-oudated-deck.gl-core");

var _keplerOudatedDeck2 = require("kepler-oudated-deck.gl-layers");

var _pathOutlineLayer = _interopRequireDefault(require("../path-outline-layer/path-outline-layer"));

var _meshLayer = _interopRequireDefault(require("../mesh-layer/mesh-layer"));

var _arrow2dGeometry = _interopRequireDefault(require("./arrow-2d-geometry"));

var _createPathMarkers = _interopRequireDefault(require("./create-path-markers"));

var _polyline = require("./polyline");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var DISTANCE_FOR_MULTI_ARROWS = 0.1;
var ARROW_HEAD_SIZE = 0.2;
var ARROW_TAIL_WIDTH = 0.05; // const ARROW_CENTER_ADJUST = -0.8;

var DEFAULT_MARKER_LAYER = _meshLayer.default;
var DEFAULT_MARKER_LAYER_PROPS = {
  mesh: new _arrow2dGeometry.default({
    headSize: ARROW_HEAD_SIZE,
    tailWidth: ARROW_TAIL_WIDTH
  })
};
var defaultProps = Object.assign({}, _pathOutlineLayer.default.defaultProps, {
  MarkerLayer: DEFAULT_MARKER_LAYER,
  markerLayerProps: DEFAULT_MARKER_LAYER_PROPS,
  sizeScale: 100,
  fp64: false,
  hightlightIndex: -1,
  highlightPoint: null,
  getPath: function getPath(x) {
    return x.path;
  },
  getColor: function getColor(x) {
    return x.color;
  },
  getMarkerColor: function getMarkerColor(x) {
    return [0, 0, 0, 255];
  },
  getDirection: function getDirection(x) {
    return x.direction;
  },
  getMarkerPercentages: function getMarkerPercentages(object, _ref) {
    var lineLength = _ref.lineLength;
    return lineLength > DISTANCE_FOR_MULTI_ARROWS ? [0.25, 0.5, 0.75] : [0.5];
  }
});

var PathMarkerLayer =
/*#__PURE__*/
function (_CompositeLayer) {
  _inherits(PathMarkerLayer, _CompositeLayer);

  function PathMarkerLayer() {
    _classCallCheck(this, PathMarkerLayer);

    return _possibleConstructorReturn(this, _getPrototypeOf(PathMarkerLayer).apply(this, arguments));
  }

  _createClass(PathMarkerLayer, [{
    key: "initializeState",
    value: function initializeState() {
      this.state = {
        markers: [],
        mesh: new _arrow2dGeometry.default({
          headSize: ARROW_HEAD_SIZE,
          tailWidth: ARROW_TAIL_WIDTH
        }),
        closestPoint: null
      };
    }
  }, {
    key: "projectFlat",
    value: function projectFlat(xyz, viewport, coordinateSystem, coordinateOrigin) {
      if (coordinateSystem === _keplerOudatedDeck.COORDINATE_SYSTEM.METER_OFFSETS) {
        var _viewport$metersToLng = viewport.metersToLngLatDelta(xyz),
            _viewport$metersToLng2 = _slicedToArray(_viewport$metersToLng, 2),
            dx = _viewport$metersToLng2[0],
            dy = _viewport$metersToLng2[1];

        var _coordinateOrigin = _slicedToArray(coordinateOrigin, 2),
            x = _coordinateOrigin[0],
            y = _coordinateOrigin[1];

        return viewport.projectFlat([x + dx, dy + y]);
      } else if (coordinateSystem === _keplerOudatedDeck.COORDINATE_SYSTEM.LNGLAT_OFFSETS) {
        var _xyz = _slicedToArray(xyz, 2),
            _dx = _xyz[0],
            _dy = _xyz[1];

        var _coordinateOrigin2 = _slicedToArray(coordinateOrigin, 2),
            _x = _coordinateOrigin2[0],
            _y = _coordinateOrigin2[1];

        return viewport.projectFlat([_x + _dx, _dy + _y]);
      }

      return viewport.projectFlat(xyz);
    }
  }, {
    key: "updateState",
    value: function updateState(_ref2) {
      var _this = this;

      var props = _ref2.props,
          oldProps = _ref2.oldProps,
          changeFlags = _ref2.changeFlags;

      if (changeFlags.dataChanged || changeFlags.updateTriggersChanged) {
        var _this$props = this.props,
            data = _this$props.data,
            getPath = _this$props.getPath,
            getDirection = _this$props.getDirection,
            getMarkerColor = _this$props.getMarkerColor,
            getMarkerPercentages = _this$props.getMarkerPercentages,
            coordinateSystem = _this$props.coordinateSystem,
            coordinateOrigin = _this$props.coordinateOrigin;
        var viewport = this.context.viewport;

        var projectFlat = function projectFlat(o) {
          return _this.projectFlat(o, viewport, coordinateSystem, coordinateOrigin);
        };

        this.state.markers = (0, _createPathMarkers.default)({
          data: data,
          getPath: getPath,
          getDirection: getDirection,
          getColor: getMarkerColor,
          getMarkerPercentages: getMarkerPercentages,
          projectFlat: projectFlat
        });

        this._recalculateClosestPoint();
      }

      if (changeFlags.propsChanged) {
        if (props.point !== oldProps.point) {
          this._recalculateClosestPoint();
        }
      }
    }
  }, {
    key: "_recalculateClosestPoint",
    value: function _recalculateClosestPoint() {
      var _this$props2 = this.props,
          highlightPoint = _this$props2.highlightPoint,
          highlightIndex = _this$props2.highlightIndex;

      if (highlightPoint && highlightIndex >= 0) {
        var object = this.props.data[highlightIndex];
        var points = this.props.getPath(object);

        var _getClosestPointOnPol = (0, _polyline.getClosestPointOnPolyline)({
          points: points,
          p: highlightPoint
        }),
            point = _getClosestPointOnPol.point;

        this.state.closestPoints = [{
          position: point
        }];
      } else {
        this.state.closestPoints = [];
      }
    }
  }, {
    key: "getPickingInfo",
    value: function getPickingInfo(_ref3) {
      var info = _ref3.info;
      return Object.assign(info, {
        // override object with picked feature
        object: info.object && info.object.path || info.object
      });
    }
  }, {
    key: "renderLayers",
    value: function renderLayers() {
      return [new _pathOutlineLayer.default(this.props, this.getSubLayerProps({
        id: 'paths',
        // Note: data has to be passed explicitly like this to avoid being empty
        data: this.props.data
      })), new this.props.MarkerLayer(this.getSubLayerProps(Object.assign({}, this.props.markerLayerProps, {
        id: 'markers',
        data: this.state.markers,
        sizeScale: this.props.sizeScale,
        fp64: this.props.fp64,
        pickable: false,
        parameters: {
          blend: false,
          depthTest: false
        }
      }))), this.state.closestPoints && new _keplerOudatedDeck2.ScatterplotLayer({
        id: "".concat(this.props.id, "-highlight"),
        data: this.state.closestPoints,
        fp64: this.props.fp64
      })];
    }
  }]);

  return PathMarkerLayer;
}(_keplerOudatedDeck.CompositeLayer);

exports.default = PathMarkerLayer;
PathMarkerLayer.layerName = 'PathMarkerLayer';
PathMarkerLayer.defaultProps = defaultProps;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvcGF0aC1tYXJrZXItbGF5ZXIvcGF0aC1tYXJrZXItbGF5ZXIuanMiXSwibmFtZXMiOlsiRElTVEFOQ0VfRk9SX01VTFRJX0FSUk9XUyIsIkFSUk9XX0hFQURfU0laRSIsIkFSUk9XX1RBSUxfV0lEVEgiLCJERUZBVUxUX01BUktFUl9MQVlFUiIsIk1lc2hMYXllciIsIkRFRkFVTFRfTUFSS0VSX0xBWUVSX1BST1BTIiwibWVzaCIsIkFycm93MkRHZW9tZXRyeSIsImhlYWRTaXplIiwidGFpbFdpZHRoIiwiZGVmYXVsdFByb3BzIiwiT2JqZWN0IiwiYXNzaWduIiwiUGF0aE91dGxpbmVMYXllciIsIk1hcmtlckxheWVyIiwibWFya2VyTGF5ZXJQcm9wcyIsInNpemVTY2FsZSIsImZwNjQiLCJoaWdodGxpZ2h0SW5kZXgiLCJoaWdobGlnaHRQb2ludCIsImdldFBhdGgiLCJ4IiwicGF0aCIsImdldENvbG9yIiwiY29sb3IiLCJnZXRNYXJrZXJDb2xvciIsImdldERpcmVjdGlvbiIsImRpcmVjdGlvbiIsImdldE1hcmtlclBlcmNlbnRhZ2VzIiwib2JqZWN0IiwibGluZUxlbmd0aCIsIlBhdGhNYXJrZXJMYXllciIsInN0YXRlIiwibWFya2VycyIsImNsb3Nlc3RQb2ludCIsInh5eiIsInZpZXdwb3J0IiwiY29vcmRpbmF0ZVN5c3RlbSIsImNvb3JkaW5hdGVPcmlnaW4iLCJDT09SRElOQVRFX1NZU1RFTSIsIk1FVEVSX09GRlNFVFMiLCJtZXRlcnNUb0xuZ0xhdERlbHRhIiwiZHgiLCJkeSIsInkiLCJwcm9qZWN0RmxhdCIsIkxOR0xBVF9PRkZTRVRTIiwicHJvcHMiLCJvbGRQcm9wcyIsImNoYW5nZUZsYWdzIiwiZGF0YUNoYW5nZWQiLCJ1cGRhdGVUcmlnZ2Vyc0NoYW5nZWQiLCJkYXRhIiwiY29udGV4dCIsIm8iLCJfcmVjYWxjdWxhdGVDbG9zZXN0UG9pbnQiLCJwcm9wc0NoYW5nZWQiLCJwb2ludCIsImhpZ2hsaWdodEluZGV4IiwicG9pbnRzIiwicCIsImNsb3Nlc3RQb2ludHMiLCJwb3NpdGlvbiIsImluZm8iLCJnZXRTdWJMYXllclByb3BzIiwiaWQiLCJwaWNrYWJsZSIsInBhcmFtZXRlcnMiLCJibGVuZCIsImRlcHRoVGVzdCIsIlNjYXR0ZXJwbG90TGF5ZXIiLCJDb21wb3NpdGVMYXllciIsImxheWVyTmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSx5QkFBeUIsR0FBRyxHQUFsQztBQUNBLElBQU1DLGVBQWUsR0FBRyxHQUF4QjtBQUNBLElBQU1DLGdCQUFnQixHQUFHLElBQXpCLEMsQ0FDQTs7QUFFQSxJQUFNQyxvQkFBb0IsR0FBR0Msa0JBQTdCO0FBRUEsSUFBTUMsMEJBQTBCLEdBQUc7QUFDakNDLEVBQUFBLElBQUksRUFBRSxJQUFJQyx3QkFBSixDQUFvQjtBQUFFQyxJQUFBQSxRQUFRLEVBQUVQLGVBQVo7QUFBNkJRLElBQUFBLFNBQVMsRUFBRVA7QUFBeEMsR0FBcEI7QUFEMkIsQ0FBbkM7QUFJQSxJQUFNUSxZQUFZLEdBQUdDLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLEVBQWQsRUFBa0JDLDBCQUFpQkgsWUFBbkMsRUFBaUQ7QUFDcEVJLEVBQUFBLFdBQVcsRUFBRVgsb0JBRHVEO0FBRXBFWSxFQUFBQSxnQkFBZ0IsRUFBRVYsMEJBRmtEO0FBSXBFVyxFQUFBQSxTQUFTLEVBQUUsR0FKeUQ7QUFLcEVDLEVBQUFBLElBQUksRUFBRSxLQUw4RDtBQU9wRUMsRUFBQUEsZUFBZSxFQUFFLENBQUMsQ0FQa0Q7QUFRcEVDLEVBQUFBLGNBQWMsRUFBRSxJQVJvRDtBQVVwRUMsRUFBQUEsT0FBTyxFQUFFLGlCQUFBQyxDQUFDO0FBQUEsV0FBSUEsQ0FBQyxDQUFDQyxJQUFOO0FBQUEsR0FWMEQ7QUFXcEVDLEVBQUFBLFFBQVEsRUFBRSxrQkFBQUYsQ0FBQztBQUFBLFdB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RixDQVRLLEVBd0JMLEtBQUtyQyxLQUFMLENBQVc2QixhQUFYLElBQ0UsSUFBSVMsb0NBQUosQ0FBcUI7QUFDbkJMLFFBQUFBLEVBQUUsWUFBSyxLQUFLbEIsS0FBTCxDQUFXa0IsRUFBaEIsZUFEaUI7QUFFbkJiLFFBQUFBLElBQUksRUFBRSxLQUFLcEIsS0FBTCxDQUFXNkIsYUFGRTtBQUduQjVDLFFBQUFBLElBQUksRUFBRSxLQUFLOEIsS0FBTCxDQUFXOUI7QUFIRSxPQUFyQixDQXpCRyxDQUFQO0FBK0JEOzs7O0VBNUcwQ3NELGlDOzs7QUErRzdDeEMsZUFBZSxDQUFDeUMsU0FBaEIsR0FBNEIsaUJBQTVCO0FBQ0F6QyxlQUFlLENBQUNyQixZQUFoQixHQUErQkEsWUFBL0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb3NpdGVMYXllciwgQ09PUkRJTkFURV9TWVNURU0gfSBmcm9tICdrZXBsZXItb3VkYXRlZC1kZWNrLmdsLWNvcmUnO1xuaW1wb3J0IHsgU2NhdHRlcnBsb3RMYXllciB9IGZyb20gJ2tlcGxlci1vdWRhdGVkLWRlY2suZ2wtbGF5ZXJzJztcbmltcG9ydCBQYXRoT3V0bGluZUxheWVyIGZyb20gJy4uL3BhdGgtb3V0bGluZS1sYXllci9wYXRoLW91dGxpbmUtbGF5ZXInO1xuaW1wb3J0IE1lc2hMYXllciBmcm9tICcuLi9tZXNoLWxheWVyL21lc2gtbGF5ZXInO1xuaW1wb3J0IEFycm93MkRHZW9tZXRyeSBmcm9tICcuL2Fycm93LTJkLWdlb21ldHJ5JztcblxuaW1wb3J0IGNyZWF0ZVBhdGhNYXJrZXJzIGZyb20gJy4vY3JlYXRlLXBhdGgtbWFya2Vycyc7XG5pbXBvcnQgeyBnZXRDbG9zZXN0UG9pbnRPblBvbHlsaW5lIH0gZnJvbSAnLi9wb2x5bGluZSc7XG5cbmNvbnN0IERJU1RBTkNFX0ZPUl9NVUxUSV9BUlJPV1MgPSAwLjE7XG5jb25zdCBBUlJPV19IRUFEX1NJWkUgPSAwLjI7XG5jb25zdCBBUlJPV19UQUlMX1dJRFRIID0gMC4wNTtcbi8vIGNvbnN0IEFSUk9XX0NFTlRFUl9BREpVU1QgPSAtMC44O1xuXG5jb25zdCBERUZBVUxUX01BUktFUl9MQVlFUiA9IE1lc2hMYXllcjtcblxuY29uc3QgREVGQVVMVF9NQVJLRVJfTEFZRVJfUFJPUFMgPSB7XG4gIG1lc2g6IG5ldyBBcnJvdzJER2VvbWV0cnkoeyBoZWFkU2l6ZTogQVJST1dfSEVBRF9TSVpFLCB0YWlsV2lkdGg6IEFSUk9XX1RBSUxfV0lEVEggfSlcbn07XG5cbmNvbnN0IGRlZmF1bHRQcm9wcyA9IE9iamVjdC5hc3NpZ24oe30sIFBhdGhPdXRsaW5lTGF5ZXIuZGVmYXVsdFByb3BzLCB7XG4gIE1hcmtlckxheWVyOiBERUZBVUxUX01BUktFUl9MQVlFUixcbiAgbWFya2VyTGF5ZXJQcm9wczogREVGQVVMVF9NQVJLRVJfTEFZRVJfUFJPUFMsXG5cbiAgc2l6ZVNjYWxlOiAxMDAsXG4gIGZwNjQ6IGZhbHNlLFxuXG4gIGhpZ2h0bGlnaHRJbmRleDogLTEsXG4gIGhpZ2hsaWdodFBvaW50OiBudWxsLFxuXG4gIGdldFBhdGg6IHggPT4geC5wYXRoLFxuICBnZXRDb2xvcjogeCA9PiB4LmNvbG9yLFxuICBnZXRNYXJrZXJDb2xvcjogeCA9PiBbMCwgMCwgMCwgMjU1XSxcbiAgZ2V0RGlyZWN0aW9uOiB4ID0+IHguZGlyZWN0aW9uLFxuICBnZXRNYXJrZXJQZXJjZW50YWdlczogKG9iamVjdCwgeyBsaW5lTGVuZ3RoIH0pID0+XG4gICAgbGluZUxlbmd0aCA+IERJU1RBTkNFX0ZPUl9NVUxUSV9BUlJPV1MgPyBbMC4yNSwgMC41LCAwLjc1XSA6IFswLjVdXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGF0aE1hcmtlckxheWVyIGV4dGVuZHMgQ29tcG9zaXRlTGF5ZXIge1xuICBpbml0aWFsaXplU3RhdGUoKSB7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIG1hcmtlcnM6IFtdLFxuICAgICAgbWVzaDogbmV3IEFycm93MkRHZW9tZXRyeSh7IGhlYWRTaXplOiBBUlJPV19IRUFEX1NJWkUsIHRhaWxXaWR0aDogQVJST1dfVEFJTF9XSURUSCB9KSxcbiAgICAgIGNsb3Nlc3RQb2ludDogbnVsbFxuICAgIH07XG4gIH1cblxuICBwcm9qZWN0RmxhdCh4eXosIHZpZXdwb3J0LCBjb29yZGluYXRlU3lzdGVtLCBjb29yZGluYXRlT3JpZ2luKSB7XG4gICAgaWYgKGNvb3JkaW5hdGVTeXN0ZW0gPT09IENPT1JESU5BVEVfU1lTVEVNLk1FVEVSX09GRlNFVFMpIHtcbiAgICAgIGNvbnN0IFtkeCwgZHldID0gdmlld3BvcnQubWV0ZXJzVG9MbmdMYXREZWx0YSh4eXopO1xuICAgICAgY29uc3QgW3gsIHldID0gY29vcmRpbmF0ZU9yaWdpbjtcbiAgICAgIHJldHVybiB2aWV3cG9ydC5wcm9qZWN0RmxhdChbeCArIGR4LCBkeSArIHldKTtcbiAgICB9IGVsc2UgaWYgKGNvb3JkaW5hdGVTeXN0ZW0gPT09IENPT1JESU5BVEVfU1lTVEVNLkxOR0xBVF9PRkZTRVRTKSB7XG4gICAgICBjb25zdCBbZHgsIGR5XSA9IHh5ejtcbiAgICAgIGNvbnN0IFt4LCB5XSA9IGNvb3JkaW5hdGVPcmlnaW47XG4gICAgICByZXR1cm4gdmlld3BvcnQucHJvamVjdEZsYXQoW3ggKyBkeCwgZHkgKyB5XSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZpZXdwb3J0LnByb2plY3RGbGF0KHh5eik7XG4gIH1cblxuICB1cGRhdGVTdGF0ZSh7IHByb3BzLCBvbGRQcm9wcywgY2hhbmdlRmxhZ3MgfSkge1xuICAgIGlmIChjaGFuZ2VGbGFncy5kYXRhQ2hhbmdlZCB8fCBjaGFuZ2VGbGFncy51cGRhdGVUcmlnZ2Vyc0NoYW5nZWQpIHtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgZGF0YSxcbiAgICAgICAgZ2V0UGF0aCxcbiAgICAgICAgZ2V0RGlyZWN0aW9uLFxuICAgICAgICBnZXRNYXJrZXJDb2xvcixcbiAgICAgICAgZ2V0TWFya2VyUGVyY2VudGFnZXMsXG4gICAgICAgIGNvb3JkaW5hdGVTeXN0ZW0sXG4gICAgICAgIGNvb3JkaW5hdGVPcmlnaW5cbiAgICAgIH0gPSB0aGlzLnByb3BzO1xuICAgICAgY29uc3QgeyB2aWV3cG9ydCB9ID0gdGhpcy5jb250ZXh0O1xuICAgICAgY29uc3QgcHJvamVjdEZsYXQgPSBvID0+IHRoaXMucHJvamVjdEZsYXQobywgdmlld3BvcnQsIGNvb3JkaW5hdGVTeXN0ZW0sIGNvb3JkaW5hdGVPcmlnaW4pO1xuICAgICAgdGhpcy5zdGF0ZS5tYXJrZXJzID0gY3JlYXRlUGF0aE1hcmtlcnMoe1xuICAgICAgICBkYXRhLFxuICAgICAgICBnZXRQYXRoLFxuICAgICAgICBnZXREaXJlY3Rpb24sXG4gICAgICAgIGdldENvbG9yOiBnZXRNYXJrZXJDb2xvcixcbiAgICAgICAgZ2V0TWFya2VyUGVyY2VudGFnZXMsXG4gICAgICAgIHByb2plY3RGbGF0XG4gICAgICB9KTtcbiAgICAgIHRoaXMuX3JlY2FsY3VsYXRlQ2xvc2VzdFBvaW50KCk7XG4gICAgfVxuICAgIGlmIChjaGFuZ2VGbGFncy5wcm9wc0NoYW5nZWQpIHtcbiAgICAgIGlmIChwcm9wcy5wb2ludCAhPT0gb2xkUHJvcHMucG9pbnQpIHtcbiAgICAgICAgdGhpcy5fcmVjYWxjdWxhdGVDbG9zZXN0UG9pbnQoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfcmVjYWxjdWxhdGVDbG9zZXN0UG9pbnQoKSB7XG4gICAgY29uc3QgeyBoaWdobGlnaHRQb2ludCwgaGlnaGxpZ2h0SW5kZXggfSA9IHRoaXMucHJvcHM7XG4gICAgaWYgKGhpZ2hsaWdodFBvaW50ICYmIGhpZ2hsaWdodEluZGV4ID49IDApIHtcbiAgICAgIGNvbnN0IG9iamVjdCA9IHRoaXMucHJvcHMuZGF0YVtoaWdobGlnaHRJbmRleF07XG4gICAgICBjb25zdCBwb2ludHMgPSB0aGlzLnByb3BzLmdldFBhdGgob2JqZWN0KTtcbiAgICAgIGNvbnN0IHsgcG9pbnQgfSA9IGdldENsb3Nlc3RQb2ludE9uUG9seWxpbmUoeyBwb2ludHMsIHA6IGhpZ2hsaWdodFBvaW50IH0pO1xuICAgICAgdGhpcy5zdGF0ZS5jbG9zZXN0UG9pbnRzID0gW1xuICAgICAgICB7XG4gICAgICAgICAgcG9zaXRpb246IHBvaW50XG4gICAgICAgIH1cbiAgICAgIF07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc3RhdGUuY2xvc2VzdFBvaW50cyA9IFtdO1xuICAgIH1cbiAgfVxuXG4gIGdldFBpY2tpbmdJbmZvKHsgaW5mbyB9KSB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oaW5mbywge1xuICAgICAgLy8gb3ZlcnJpZGUgb2JqZWN0IHdpdGggcGlja2VkIGZlYXR1cmVcbiAgICAgIG9iamVjdDogKGluZm8ub2JqZWN0ICYmIGluZm8ub2JqZWN0LnBhdGgpIHx8IGluZm8ub2JqZWN0XG4gICAgfSk7XG4gIH1cblxuICByZW5kZXJMYXllcnMoKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIG5ldyBQYXRoT3V0bGluZUxheWVyKFxuICAgICAgICB0aGlzLnByb3BzLFxuICAgICAgICB0aGlzLmdldFN1YkxheWVyUHJvcHMoe1xuICAgICAgICAgIGlkOiAncGF0aHMnLFxuICAgICAgICAgIC8vIE5vdGU6IGRhdGEgaGFzIHRvIGJlIHBhc3NlZCBleHBsaWNpdGx5IGxpa2UgdGhpcyB0byBhdm9pZCBiZWluZyBlbXB0eVxuICAgICAgICAgIGRhdGE6IHRoaXMucHJvcHMuZGF0YVxuICAgICAgICB9KVxuICAgICAgKSxcbiAgICAgIG5ldyB0aGlzLnByb3BzLk1hcmtlckxheWVyKFxuICAgICAgICB0aGlzLmdldFN1YkxheWVyUHJvcHMoXG4gICAgICAgICAgT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5wcm9wcy5tYXJrZXJMYXllclByb3BzLCB7XG4gICAgICAgICAgICBpZDogJ21hcmtlcnMnLFxuICAgICAgICAgICAgZGF0YTogdGhpcy5zdGF0ZS5tYXJrZXJzLFxuICAgICAgICAgICAgc2l6ZVNjYWxlOiB0aGlzLnByb3BzLnNpemVTY2FsZSxcbiAgICAgICAgICAgIGZwNjQ6IHRoaXMucHJvcHMuZnA2NCxcbiAgICAgICAgICAgIHBpY2thYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgICAgYmxlbmQ6IGZhbHNlLFxuICAgICAgICAgICAgICBkZXB0aFRlc3Q6IGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgKVxuICAgICAgKSxcbiAgICAgIHRoaXMuc3RhdGUuY2xvc2VzdFBvaW50cyAmJlxuICAgICAgICBuZXcgU2NhdHRlcnBsb3RMYXllcih7XG4gICAgICAgICAgaWQ6IGAke3RoaXMucHJvcHMuaWR9LWhpZ2hsaWdodGAsXG4gICAgICAgICAgZGF0YTogdGhpcy5zdGF0ZS5jbG9zZXN0UG9pbnRzLFxuICAgICAgICAgIGZwNjQ6IHRoaXMucHJvcHMuZnA2NFxuICAgICAgICB9KVxuICAgIF07XG4gIH1cbn1cblxuUGF0aE1hcmtlckxheWVyLmxheWVyTmFtZSA9ICdQYXRoTWFya2VyTGF5ZXInO1xuUGF0aE1hcmtlckxheWVyLmRlZmF1bHRQcm9wcyA9IGRlZmF1bHRQcm9wcztcbiJdfQ==