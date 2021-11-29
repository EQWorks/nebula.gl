"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _keplerOutdatedDeck = require("kepler-outdated-deck.gl-core");

var _keplerOutdatedDeck2 = require("kepler-outdated-deck.gl-layers");

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
      if (coordinateSystem === _keplerOutdatedDeck.COORDINATE_SYSTEM.METER_OFFSETS) {
        var _viewport$metersToLng = viewport.metersToLngLatDelta(xyz),
            _viewport$metersToLng2 = _slicedToArray(_viewport$metersToLng, 2),
            dx = _viewport$metersToLng2[0],
            dy = _viewport$metersToLng2[1];

        var _coordinateOrigin = _slicedToArray(coordinateOrigin, 2),
            x = _coordinateOrigin[0],
            y = _coordinateOrigin[1];

        return viewport.projectFlat([x + dx, dy + y]);
      } else if (coordinateSystem === _keplerOutdatedDeck.COORDINATE_SYSTEM.LNGLAT_OFFSETS) {
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
      }))), this.state.closestPoints && new _keplerOutdatedDeck2.ScatterplotLayer({
        id: "".concat(this.props.id, "-highlight"),
        data: this.state.closestPoints,
        fp64: this.props.fp64
      })];
    }
  }]);

  return PathMarkerLayer;
}(_keplerOutdatedDeck.CompositeLayer);

exports.default = PathMarkerLayer;
PathMarkerLayer.layerName = 'PathMarkerLayer';
PathMarkerLayer.defaultProps = defaultProps;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvcGF0aC1tYXJrZXItbGF5ZXIvcGF0aC1tYXJrZXItbGF5ZXIuanMiXSwibmFtZXMiOlsiRElTVEFOQ0VfRk9SX01VTFRJX0FSUk9XUyIsIkFSUk9XX0hFQURfU0laRSIsIkFSUk9XX1RBSUxfV0lEVEgiLCJERUZBVUxUX01BUktFUl9MQVlFUiIsIk1lc2hMYXllciIsIkRFRkFVTFRfTUFSS0VSX0xBWUVSX1BST1BTIiwibWVzaCIsIkFycm93MkRHZW9tZXRyeSIsImhlYWRTaXplIiwidGFpbFdpZHRoIiwiZGVmYXVsdFByb3BzIiwiT2JqZWN0IiwiYXNzaWduIiwiUGF0aE91dGxpbmVMYXllciIsIk1hcmtlckxheWVyIiwibWFya2VyTGF5ZXJQcm9wcyIsInNpemVTY2FsZSIsImZwNjQiLCJoaWdodGxpZ2h0SW5kZXgiLCJoaWdobGlnaHRQb2ludCIsImdldFBhdGgiLCJ4IiwicGF0aCIsImdldENvbG9yIiwiY29sb3IiLCJnZXRNYXJrZXJDb2xvciIsImdldERpcmVjdGlvbiIsImRpcmVjdGlvbiIsImdldE1hcmtlclBlcmNlbnRhZ2VzIiwib2JqZWN0IiwibGluZUxlbmd0aCIsIlBhdGhNYXJrZXJMYXllciIsInN0YXRlIiwibWFya2VycyIsImNsb3Nlc3RQb2ludCIsInh5eiIsInZpZXdwb3J0IiwiY29vcmRpbmF0ZVN5c3RlbSIsImNvb3JkaW5hdGVPcmlnaW4iLCJDT09SRElOQVRFX1NZU1RFTSIsIk1FVEVSX09GRlNFVFMiLCJtZXRlcnNUb0xuZ0xhdERlbHRhIiwiZHgiLCJkeSIsInkiLCJwcm9qZWN0RmxhdCIsIkxOR0xBVF9PRkZTRVRTIiwicHJvcHMiLCJvbGRQcm9wcyIsImNoYW5nZUZsYWdzIiwiZGF0YUNoYW5nZWQiLCJ1cGRhdGVUcmlnZ2Vyc0NoYW5nZWQiLCJkYXRhIiwiY29udGV4dCIsIm8iLCJfcmVjYWxjdWxhdGVDbG9zZXN0UG9pbnQiLCJwcm9wc0NoYW5nZWQiLCJwb2ludCIsImhpZ2hsaWdodEluZGV4IiwicG9pbnRzIiwicCIsImNsb3Nlc3RQb2ludHMiLCJwb3NpdGlvbiIsImluZm8iLCJnZXRTdWJMYXllclByb3BzIiwiaWQiLCJwaWNrYWJsZSIsInBhcmFtZXRlcnMiLCJibGVuZCIsImRlcHRoVGVzdCIsIlNjYXR0ZXJwbG90TGF5ZXIiLCJDb21wb3NpdGVMYXllciIsImxheWVyTmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSx5QkFBeUIsR0FBRyxHQUFsQztBQUNBLElBQU1DLGVBQWUsR0FBRyxHQUF4QjtBQUNBLElBQU1DLGdCQUFnQixHQUFHLElBQXpCLEMsQ0FDQTs7QUFFQSxJQUFNQyxvQkFBb0IsR0FBR0Msa0JBQTdCO0FBRUEsSUFBTUMsMEJBQTBCLEdBQUc7QUFDakNDLEVBQUFBLElBQUksRUFBRSxJQUFJQyx3QkFBSixDQUFvQjtBQUFFQyxJQUFBQSxRQUFRLEVBQUVQLGVBQVo7QUFBNkJRLElBQUFBLFNBQVMsRUFBRVA7QUFBeEMsR0FBcEI7QUFEMkIsQ0FBbkM7QUFJQSxJQUFNUSxZQUFZLEdBQUdDLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLEVBQWQsRUFBa0JDLDBCQUFpQkgsWUFBbkMsRUFBaUQ7QUFDcEVJLEVBQUFBLFdBQVcsRUFBRVgsb0JBRHVEO0FBRXBFWSxFQUFBQSxnQkFBZ0IsRUFBRVYsMEJBRmtEO0FBSXBFVyxFQUFBQSxTQUFTLEVBQUUsR0FKeUQ7QUFLcEVDLEVBQUFBLElBQUksRUFBRSxLQUw4RDtBQU9wRUMsRUFBQUEsZUFBZSxFQUFFLENBQUMsQ0FQa0Q7QUFRcEVDLEVBQUFBLGNBQWMsRUFBRSxJQVJvRDtBQVVwRUMsRUFBQUEsT0FBTyxFQUFFLGlCQUFBQyxDQUFDO0FBQUEsV0FBSUEsQ0FBQyxDQUFDQyxJQUFOO0FBQUEsR0FWMEQ7QUFXcEVDLEVBQUFBLFFBQVEsRUFBRSxrQkFBQUYsQ0FBQztBQUFBLFdB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RixDQVRLLEVBd0JMLEtBQUtyQyxLQUFMLENBQVc2QixhQUFYLElBQ0UsSUFBSVMscUNBQUosQ0FBcUI7QUFDbkJMLFFBQUFBLEVBQUUsWUFBSyxLQUFLbEIsS0FBTCxDQUFXa0IsRUFBaEIsZUFEaUI7QUFFbkJiLFFBQUFBLElBQUksRUFBRSxLQUFLcEIsS0FBTCxDQUFXNkIsYUFGRTtBQUduQjVDLFFBQUFBLElBQUksRUFBRSxLQUFLOEIsS0FBTCxDQUFXOUI7QUFIRSxPQUFyQixDQXpCRyxDQUFQO0FBK0JEOzs7O0VBNUcwQ3NELGtDOzs7QUErRzdDeEMsZUFBZSxDQUFDeUMsU0FBaEIsR0FBNEIsaUJBQTVCO0FBQ0F6QyxlQUFlLENBQUNyQixZQUFoQixHQUErQkEsWUFBL0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb3NpdGVMYXllciwgQ09PUkRJTkFURV9TWVNURU0gfSBmcm9tICdrZXBsZXItb3V0ZGF0ZWQtZGVjay5nbC1jb3JlJztcbmltcG9ydCB7IFNjYXR0ZXJwbG90TGF5ZXIgfSBmcm9tICdrZXBsZXItb3V0ZGF0ZWQtZGVjay5nbC1sYXllcnMnO1xuaW1wb3J0IFBhdGhPdXRsaW5lTGF5ZXIgZnJvbSAnLi4vcGF0aC1vdXRsaW5lLWxheWVyL3BhdGgtb3V0bGluZS1sYXllcic7XG5pbXBvcnQgTWVzaExheWVyIGZyb20gJy4uL21lc2gtbGF5ZXIvbWVzaC1sYXllcic7XG5pbXBvcnQgQXJyb3cyREdlb21ldHJ5IGZyb20gJy4vYXJyb3ctMmQtZ2VvbWV0cnknO1xuXG5pbXBvcnQgY3JlYXRlUGF0aE1hcmtlcnMgZnJvbSAnLi9jcmVhdGUtcGF0aC1tYXJrZXJzJztcbmltcG9ydCB7IGdldENsb3Nlc3RQb2ludE9uUG9seWxpbmUgfSBmcm9tICcuL3BvbHlsaW5lJztcblxuY29uc3QgRElTVEFOQ0VfRk9SX01VTFRJX0FSUk9XUyA9IDAuMTtcbmNvbnN0IEFSUk9XX0hFQURfU0laRSA9IDAuMjtcbmNvbnN0IEFSUk9XX1RBSUxfV0lEVEggPSAwLjA1O1xuLy8gY29uc3QgQVJST1dfQ0VOVEVSX0FESlVTVCA9IC0wLjg7XG5cbmNvbnN0IERFRkFVTFRfTUFSS0VSX0xBWUVSID0gTWVzaExheWVyO1xuXG5jb25zdCBERUZBVUxUX01BUktFUl9MQVlFUl9QUk9QUyA9IHtcbiAgbWVzaDogbmV3IEFycm93MkRHZW9tZXRyeSh7IGhlYWRTaXplOiBBUlJPV19IRUFEX1NJWkUsIHRhaWxXaWR0aDogQVJST1dfVEFJTF9XSURUSCB9KVxufTtcblxuY29uc3QgZGVmYXVsdFByb3BzID0gT2JqZWN0LmFzc2lnbih7fSwgUGF0aE91dGxpbmVMYXllci5kZWZhdWx0UHJvcHMsIHtcbiAgTWFya2VyTGF5ZXI6IERFRkFVTFRfTUFSS0VSX0xBWUVSLFxuICBtYXJrZXJMYXllclByb3BzOiBERUZBVUxUX01BUktFUl9MQVlFUl9QUk9QUyxcblxuICBzaXplU2NhbGU6IDEwMCxcbiAgZnA2NDogZmFsc2UsXG5cbiAgaGlnaHRsaWdodEluZGV4OiAtMSxcbiAgaGlnaGxpZ2h0UG9pbnQ6IG51bGwsXG5cbiAgZ2V0UGF0aDogeCA9PiB4LnBhdGgsXG4gIGdldENvbG9yOiB4ID0+IHguY29sb3IsXG4gIGdldE1hcmtlckNvbG9yOiB4ID0+IFswLCAwLCAwLCAyNTVdLFxuICBnZXREaXJlY3Rpb246IHggPT4geC5kaXJlY3Rpb24sXG4gIGdldE1hcmtlclBlcmNlbnRhZ2VzOiAob2JqZWN0LCB7IGxpbmVMZW5ndGggfSkgPT5cbiAgICBsaW5lTGVuZ3RoID4gRElTVEFOQ0VfRk9SX01VTFRJX0FSUk9XUyA/IFswLjI1LCAwLjUsIDAuNzVdIDogWzAuNV1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYXRoTWFya2VyTGF5ZXIgZXh0ZW5kcyBDb21wb3NpdGVMYXllciB7XG4gIGluaXRpYWxpemVTdGF0ZSgpIHtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgbWFya2VyczogW10sXG4gICAgICBtZXNoOiBuZXcgQXJyb3cyREdlb21ldHJ5KHsgaGVhZFNpemU6IEFSUk9XX0hFQURfU0laRSwgdGFpbFdpZHRoOiBBUlJPV19UQUlMX1dJRFRIIH0pLFxuICAgICAgY2xvc2VzdFBvaW50OiBudWxsXG4gICAgfTtcbiAgfVxuXG4gIHByb2plY3RGbGF0KHh5eiwgdmlld3BvcnQsIGNvb3JkaW5hdGVTeXN0ZW0sIGNvb3JkaW5hdGVPcmlnaW4pIHtcbiAgICBpZiAoY29vcmRpbmF0ZVN5c3RlbSA9PT0gQ09PUkRJTkFURV9TWVNURU0uTUVURVJfT0ZGU0VUUykge1xuICAgICAgY29uc3QgW2R4LCBkeV0gPSB2aWV3cG9ydC5tZXRlcnNUb0xuZ0xhdERlbHRhKHh5eik7XG4gICAgICBjb25zdCBbeCwgeV0gPSBjb29yZGluYXRlT3JpZ2luO1xuICAgICAgcmV0dXJuIHZpZXdwb3J0LnByb2plY3RGbGF0KFt4ICsgZHgsIGR5ICsgeV0pO1xuICAgIH0gZWxzZSBpZiAoY29vcmRpbmF0ZVN5c3RlbSA9PT0gQ09PUkRJTkFURV9TWVNURU0uTE5HTEFUX09GRlNFVFMpIHtcbiAgICAgIGNvbnN0IFtkeCwgZHldID0geHl6O1xuICAgICAgY29uc3QgW3gsIHldID0gY29vcmRpbmF0ZU9yaWdpbjtcbiAgICAgIHJldHVybiB2aWV3cG9ydC5wcm9qZWN0RmxhdChbeCArIGR4LCBkeSArIHldKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmlld3BvcnQucHJvamVjdEZsYXQoeHl6KTtcbiAgfVxuXG4gIHVwZGF0ZVN0YXRlKHsgcHJvcHMsIG9sZFByb3BzLCBjaGFuZ2VGbGFncyB9KSB7XG4gICAgaWYgKGNoYW5nZUZsYWdzLmRhdGFDaGFuZ2VkIHx8IGNoYW5nZUZsYWdzLnVwZGF0ZVRyaWdnZXJzQ2hhbmdlZCkge1xuICAgICAgY29uc3Qge1xuICAgICAgICBkYXRhLFxuICAgICAgICBnZXRQYXRoLFxuICAgICAgICBnZXREaXJlY3Rpb24sXG4gICAgICAgIGdldE1hcmtlckNvbG9yLFxuICAgICAgICBnZXRNYXJrZXJQZXJjZW50YWdlcyxcbiAgICAgICAgY29vcmRpbmF0ZVN5c3RlbSxcbiAgICAgICAgY29vcmRpbmF0ZU9yaWdpblxuICAgICAgfSA9IHRoaXMucHJvcHM7XG4gICAgICBjb25zdCB7IHZpZXdwb3J0IH0gPSB0aGlzLmNvbnRleHQ7XG4gICAgICBjb25zdCBwcm9qZWN0RmxhdCA9IG8gPT4gdGhpcy5wcm9qZWN0RmxhdChvLCB2aWV3cG9ydCwgY29vcmRpbmF0ZVN5c3RlbSwgY29vcmRpbmF0ZU9yaWdpbik7XG4gICAgICB0aGlzLnN0YXRlLm1hcmtlcnMgPSBjcmVhdGVQYXRoTWFya2Vycyh7XG4gICAgICAgIGRhdGEsXG4gICAgICAgIGdldFBhdGgsXG4gICAgICAgIGdldERpcmVjdGlvbixcbiAgICAgICAgZ2V0Q29sb3I6IGdldE1hcmtlckNvbG9yLFxuICAgICAgICBnZXRNYXJrZXJQZXJjZW50YWdlcyxcbiAgICAgICAgcHJvamVjdEZsYXRcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fcmVjYWxjdWxhdGVDbG9zZXN0UG9pbnQoKTtcbiAgICB9XG4gICAgaWYgKGNoYW5nZUZsYWdzLnByb3BzQ2hhbmdlZCkge1xuICAgICAgaWYgKHByb3BzLnBvaW50ICE9PSBvbGRQcm9wcy5wb2ludCkge1xuICAgICAgICB0aGlzLl9yZWNhbGN1bGF0ZUNsb3Nlc3RQb2ludCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIF9yZWNhbGN1bGF0ZUNsb3Nlc3RQb2ludCgpIHtcbiAgICBjb25zdCB7IGhpZ2hsaWdodFBvaW50LCBoaWdobGlnaHRJbmRleCB9ID0gdGhpcy5wcm9wcztcbiAgICBpZiAoaGlnaGxpZ2h0UG9pbnQgJiYgaGlnaGxpZ2h0SW5kZXggPj0gMCkge1xuICAgICAgY29uc3Qgb2JqZWN0ID0gdGhpcy5wcm9wcy5kYXRhW2hpZ2hsaWdodEluZGV4XTtcbiAgICAgIGNvbnN0IHBvaW50cyA9IHRoaXMucHJvcHMuZ2V0UGF0aChvYmplY3QpO1xuICAgICAgY29uc3QgeyBwb2ludCB9ID0gZ2V0Q2xvc2VzdFBvaW50T25Qb2x5bGluZSh7IHBvaW50cywgcDogaGlnaGxpZ2h0UG9pbnQgfSk7XG4gICAgICB0aGlzLnN0YXRlLmNsb3Nlc3RQb2ludHMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICBwb3NpdGlvbjogcG9pbnRcbiAgICAgICAgfVxuICAgICAgXTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zdGF0ZS5jbG9zZXN0UG9pbnRzID0gW107XG4gICAgfVxuICB9XG5cbiAgZ2V0UGlja2luZ0luZm8oeyBpbmZvIH0pIHtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihpbmZvLCB7XG4gICAgICAvLyBvdmVycmlkZSBvYmplY3Qgd2l0aCBwaWNrZWQgZmVhdHVyZVxuICAgICAgb2JqZWN0OiAoaW5mby5vYmplY3QgJiYgaW5mby5vYmplY3QucGF0aCkgfHwgaW5mby5vYmplY3RcbiAgICB9KTtcbiAgfVxuXG4gIHJlbmRlckxheWVycygpIHtcbiAgICByZXR1cm4gW1xuICAgICAgbmV3IFBhdGhPdXRsaW5lTGF5ZXIoXG4gICAgICAgIHRoaXMucHJvcHMsXG4gICAgICAgIHRoaXMuZ2V0U3ViTGF5ZXJQcm9wcyh7XG4gICAgICAgICAgaWQ6ICdwYXRocycsXG4gICAgICAgICAgLy8gTm90ZTogZGF0YSBoYXMgdG8gYmUgcGFzc2VkIGV4cGxpY2l0bHkgbGlrZSB0aGlzIHRvIGF2b2lkIGJlaW5nIGVtcHR5XG4gICAgICAgICAgZGF0YTogdGhpcy5wcm9wcy5kYXRhXG4gICAgICAgIH0pXG4gICAgICApLFxuICAgICAgbmV3IHRoaXMucHJvcHMuTWFya2VyTGF5ZXIoXG4gICAgICAgIHRoaXMuZ2V0U3ViTGF5ZXJQcm9wcyhcbiAgICAgICAgICBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnByb3BzLm1hcmtlckxheWVyUHJvcHMsIHtcbiAgICAgICAgICAgIGlkOiAnbWFya2VycycsXG4gICAgICAgICAgICBkYXRhOiB0aGlzLnN0YXRlLm1hcmtlcnMsXG4gICAgICAgICAgICBzaXplU2NhbGU6IHRoaXMucHJvcHMuc2l6ZVNjYWxlLFxuICAgICAgICAgICAgZnA2NDogdGhpcy5wcm9wcy5mcDY0LFxuICAgICAgICAgICAgcGlja2FibGU6IGZhbHNlLFxuICAgICAgICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICAgICAgICBibGVuZDogZmFsc2UsXG4gICAgICAgICAgICAgIGRlcHRoVGVzdDogZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICApXG4gICAgICApLFxuICAgICAgdGhpcy5zdGF0ZS5jbG9zZXN0UG9pbnRzICYmXG4gICAgICAgIG5ldyBTY2F0dGVycGxvdExheWVyKHtcbiAgICAgICAgICBpZDogYCR7dGhpcy5wcm9wcy5pZH0taGlnaGxpZ2h0YCxcbiAgICAgICAgICBkYXRhOiB0aGlzLnN0YXRlLmNsb3Nlc3RQb2ludHMsXG4gICAgICAgICAgZnA2NDogdGhpcy5wcm9wcy5mcDY0XG4gICAgICAgIH0pXG4gICAgXTtcbiAgfVxufVxuXG5QYXRoTWFya2VyTGF5ZXIubGF5ZXJOYW1lID0gJ1BhdGhNYXJrZXJMYXllcic7XG5QYXRoTWFya2VyTGF5ZXIuZGVmYXVsdFByb3BzID0gZGVmYXVsdFByb3BzO1xuIl19