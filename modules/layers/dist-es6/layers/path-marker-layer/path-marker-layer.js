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

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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

class PathMarkerLayer extends _keplerOutdatedDeck.CompositeLayer {
  initializeState() {
    this.state = {
      markers: [],
      mesh: new _arrow2dGeometry.default({
        headSize: ARROW_HEAD_SIZE,
        tailWidth: ARROW_TAIL_WIDTH
      }),
      closestPoint: null
    };
  }

  projectFlat(xyz, viewport, coordinateSystem, coordinateOrigin) {
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

  updateState(_ref2) {
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

  _recalculateClosestPoint() {
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

  getPickingInfo(_ref3) {
    var info = _ref3.info;
    return Object.assign(info, {
      // override object with picked feature
      object: info.object && info.object.path || info.object
    });
  }

  renderLayers() {
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

}

exports.default = PathMarkerLayer;
PathMarkerLayer.layerName = 'PathMarkerLayer';
PathMarkerLayer.defaultProps = defaultProps;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvcGF0aC1tYXJrZXItbGF5ZXIvcGF0aC1tYXJrZXItbGF5ZXIuanMiXSwibmFtZXMiOlsiRElTVEFOQ0VfRk9SX01VTFRJX0FSUk9XUyIsIkFSUk9XX0hFQURfU0laRSIsIkFSUk9XX1RBSUxfV0lEVEgiLCJERUZBVUxUX01BUktFUl9MQVlFUiIsIk1lc2hMYXllciIsIkRFRkFVTFRfTUFSS0VSX0xBWUVSX1BST1BTIiwibWVzaCIsIkFycm93MkRHZW9tZXRyeSIsImhlYWRTaXplIiwidGFpbFdpZHRoIiwiZGVmYXVsdFByb3BzIiwiT2JqZWN0IiwiYXNzaWduIiwiUGF0aE91dGxpbmVMYXllciIsIk1hcmtlckxheWVyIiwibWFya2VyTGF5ZXJQcm9wcyIsInNpemVTY2FsZSIsImZwNjQiLCJoaWdodGxpZ2h0SW5kZXgiLCJoaWdobGlnaHRQb2ludCIsImdldFBhdGgiLCJ4IiwicGF0aCIsImdldENvbG9yIiwiY29sb3IiLCJnZXRNYXJrZXJDb2xvciIsImdldERpcmVjdGlvbiIsImRpcmVjdGlvbiIsImdldE1hcmtlclBlcmNlbnRhZ2VzIiwib2JqZWN0IiwibGluZUxlbmd0aCIsIlBhdGhNYXJrZXJMYXllciIsIkNvbXBvc2l0ZUxheWVyIiwiaW5pdGlhbGl6ZVN0YXRlIiwic3RhdGUiLCJtYXJrZXJzIiwiY2xvc2VzdFBvaW50IiwicHJvamVjdEZsYXQiLCJ4eXoiLCJ2aWV3cG9ydCIsImNvb3JkaW5hdGVTeXN0ZW0iLCJjb29yZGluYXRlT3JpZ2luIiwiQ09PUkRJTkFURV9TWVNURU0iLCJNRVRFUl9PRkZTRVRTIiwibWV0ZXJzVG9MbmdMYXREZWx0YSIsImR4IiwiZHkiLCJ5IiwiTE5HTEFUX09GRlNFVFMiLCJ1cGRhdGVTdGF0ZSIsInByb3BzIiwib2xkUHJvcHMiLCJjaGFuZ2VGbGFncyIsImRhdGFDaGFuZ2VkIiwidXBkYXRlVHJpZ2dlcnNDaGFuZ2VkIiwiZGF0YSIsImNvbnRleHQiLCJvIiwiX3JlY2FsY3VsYXRlQ2xvc2VzdFBvaW50IiwicHJvcHNDaGFuZ2VkIiwicG9pbnQiLCJoaWdobGlnaHRJbmRleCIsInBvaW50cyIsInAiLCJjbG9zZXN0UG9pbnRzIiwicG9zaXRpb24iLCJnZXRQaWNraW5nSW5mbyIsImluZm8iLCJyZW5kZXJMYXllcnMiLCJnZXRTdWJMYXllclByb3BzIiwiaWQiLCJwaWNrYWJsZSIsInBhcmFtZXRlcnMiLCJibGVuZCIsImRlcHRoVGVzdCIsIlNjYXR0ZXJwbG90TGF5ZXIiLCJsYXllck5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEseUJBQXlCLEdBQUcsR0FBbEM7QUFDQSxJQUFNQyxlQUFlLEdBQUcsR0FBeEI7QUFDQSxJQUFNQyxnQkFBZ0IsR0FBRyxJQUF6QixDLENBQ0E7O0FBRUEsSUFBTUMsb0JBQW9CLEdBQUdDLGtCQUE3QjtBQUVBLElBQU1DLDBCQUEwQixHQUFHO0FBQ2pDQyxFQUFBQSxJQUFJLEVBQUUsSUFBSUMsd0JBQUosQ0FBb0I7QUFBRUMsSUFBQUEsUUFBUSxFQUFFUCxlQUFaO0FBQTZCUSxJQUFBQSxTQUFTLEVBQUVQO0FBQXhDLEdBQXBCO0FBRDJCLENBQW5DO0FBSUEsSUFBTVEsWUFBWSxHQUFHQyxNQUFNLENBQUNDLE1BQVAsQ0FBYyxFQUFkLEVBQWtCQywwQkFBaUJILFlBQW5DLEVBQWlEO0FBQ3BFSSxFQUFBQSxXQUFXLEVBQUVYLG9CQUR1RDtBQUVwRVksRUFBQUEsZ0JBQWdCLEVBQUVWLDBCQUZrRDtBQUlwRVcsRUFBQUEsU0FBUyxFQUFFLEdBSnlEO0FBS3BFQyxFQUFBQSxJQUFJLEVBQUUsS0FMOEQ7QUFPcEVDLEVBQUFBLGVBQWUsRUFBRSxDQUFDLENBUGtEO0FBUXBFQyxFQUFBQSxjQUFjLEVBQUUsSUFSb0Q7QUFVcEVDLEVBQUFBLE9BQU8sRUFBRSxpQkFBQUMsQ0FBQztBQUFBLFdBQUlBLENBQUMsQ0FBQ0MsSUFBTjtBQUFBLEdBVjBEO0FBV3BFQyxFQUFBQSxRQUFRLEVBQUUsa0JBQUFGLENBQUM7QUFBQSxXQUFJQSxDQUFDLENBQUNHLEtBQU47QUFBQSxHQVh5RDtBQVlwRUMsRUFBQUEsY0FBYyxFQUFFLHdCQUFBSixDQUFDO0FBQUEsV0FBSSxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLEdBQVYsQ0FBSjtBQUFBLEdBWm1EO0FBYXBFSyxFQUFBQSxZQUFZLEVBQUUsc0JBQUFMLENBQUM7QUFBQSxXQUFJQSxDQUFDLENBQUNNLFNBQU47QUFBQSxHQWJxRDtBQWNwRUMsRUFBQUEsb0JBQW9CLEVBQUUsOEJBQUNDLE1BQUQ7QUFBQSxRQUFXQyxVQUFYLFFBQVdBLFVBQVg7QUFBQSxXQUNwQkEsVUFBVSxHQUFHOUIseUJBQWIsR0FBeUMsQ0FBQyxJQUFELEVBQU8sR0FBUCxFQUFZLElBQVosQ0FBekMsR0FBNkQsQ0FBQyxHQUFELENBRHpDO0FBQUE7QUFkOEMsQ0FBakQsQ0FBckI7O0FBa0JlLE1BQU0rQixlQUFOLFNBQThCQyxrQ0FBOUIsQ0FBNkM7QUFDMURDLEVBQUFBLGVBQWUsR0FBRztBQUNoQixTQUFLQyxLQUFMLEdBQWE7QUFDWEMsTUFBQUEsT0FBTyxFQUFFLEVBREU7QUFFWDdCLE1BQUFBLElBQUksRUFBRSxJQUFJQyx3QkFBSixDQUFvQjtBQUFFQyxRQUFBQSxRQUFRLEVBQUVQLGVBQVo7QUFBNkJRLFFBQUFBLFNBQVMsRUFBRVA7QUFBeEMsT0FBcEIsQ0FGSztBQUdYa0MsTUFBQUEsWUFBWSxFQUFFO0FBSEgsS0FBYjtBQUtEOztBQUVEQyxFQUFBQSxXQUFXLENBQUNDLEdBQUQsRUFBTUMsUUFBTixFQUFnQkMsZ0JBQWhCLEVBQWtDQyxnQkFBbEMsRUFBb0Q7QUFDN0QsUUFBSUQsZ0JBQWdCLEtBQUtFLHNDQUFrQkMsYUFBM0MsRUFBMEQ7QUFBQSxrQ0FDdkNKLFFBQVEsQ0FBQ0ssbUJBQVQsQ0FBNkJOLEdBQTdCLENBRHVDO0FBQUE7QUFBQSxVQUNqRE8sRUFEaUQ7QUFBQSxVQUM3Q0MsRUFENkM7O0FBQUEsNkNBRXpDTCxnQkFGeUM7QUFBQSxVQUVqRHBCLENBRmlEO0FBQUEsVUFFOUMwQixDQUY4Qzs7QUFHeEQsYUFBT1IsUUFBUSxDQUFDRixXQUFULENBQXFCLENBQUNoQixDQUFDLEdBQUd3QixFQUFMLEVBQVNDLEVBQUUsR0FBR0MsQ0FBZCxDQUFyQixDQUFQO0FBQ0QsS0FKRCxNQUlPLElBQUlQLGdCQUFnQixLQUFLRSxzQ0FBa0JNLGNBQTNDLEVBQTJEO0FBQUEsZ0NBQy9DVixHQUQrQztBQUFBLFVBQ3pETyxHQUR5RDtBQUFBLFVBQ3JEQyxHQURxRDs7QUFBQSw4Q0FFakRMLGdCQUZpRDtBQUFBLFVBRXpEcEIsRUFGeUQ7QUFBQSxVQUV0RDBCLEVBRnNEOztBQUdoRSxhQUFPUixRQUFRLENBQUNGLFdBQVQsQ0FBcUIsQ0FBQ2hCLEVBQUMsR0FBR3dCLEdBQUwsRUFBU0MsR0FBRSxHQUFHQyxFQUFkLENBQXJCLENBQVA7QUFDRDs7QUFFRCxXQUFPUixRQUFRLENBQUNGLFdBQVQsQ0FBcUJDLEdBQXJCLENBQVA7QUFDRDs7QUFFRFcsRUFBQUEsV0FBVyxRQUFtQztBQUFBOztBQUFBLFFBQWhDQyxLQUFnQyxTQUFoQ0EsS0FBZ0M7QUFBQSxRQUF6QkMsUUFBeUIsU0FBekJBLFFBQXlCO0FBQUEsUUFBZkMsV0FBZSxTQUFmQSxXQUFlOztBQUM1QyxRQUFJQSxXQUFXLENBQUNDLFdBQVosSUFBMkJELFdBQVcsQ0FBQ0UscUJBQTNDLEVBQWtFO0FBQUEsd0JBUzVELEtBQUtKLEtBVHVEO0FBQUEsVUFFOURLLElBRjhELGVBRTlEQSxJQUY4RDtBQUFBLFVBRzlEbkMsT0FIOEQsZUFHOURBLE9BSDhEO0FBQUEsVUFJOURNLFlBSjhELGVBSTlEQSxZQUo4RDtBQUFBLFVBSzlERCxjQUw4RCxlQUs5REEsY0FMOEQ7QUFBQSxVQU05REcsb0JBTjhELGVBTTlEQSxvQkFOOEQ7QUFBQSxVQU85RFksZ0JBUDhELGVBTzlEQSxnQkFQOEQ7QUFBQSxVQVE5REMsZ0JBUjhELGVBUTlEQSxnQkFSOEQ7QUFBQSxVQVV4REYsUUFWd0QsR0FVM0MsS0FBS2lCLE9BVnNDLENBVXhEakIsUUFWd0Q7O0FBV2hFLFVBQU1GLFdBQVcsR0FBRyxTQUFkQSxXQUFjLENBQUFvQixDQUFDO0FBQUEsZUFBSSxLQUFJLENBQUNwQixXQUFMLENBQWlCb0IsQ0FBakIsRUFBb0JsQixRQUFwQixFQUE4QkMsZ0JBQTlCLEVBQWdEQyxnQkFBaEQsQ0FBSjtBQUFBLE9BQXJCOztBQUNBLFdBQUtQLEtBQUwsQ0FBV0MsT0FBWCxHQUFxQixnQ0FBa0I7QUFDckNvQixRQUFBQSxJQUFJLEVBQUpBLElBRHFDO0FBRXJDbkMsUUFBQUEsT0FBTyxFQUFQQSxPQUZxQztBQUdyQ00sUUFBQUEsWUFBWSxFQUFaQSxZQUhxQztBQUlyQ0gsUUFBQUEsUUFBUSxFQUFFRSxjQUoyQjtBQUtyQ0csUUFBQUEsb0JBQW9CLEVBQXBCQSxvQkFMcUM7QUFNckNTLFFBQUFBLFdBQVcsRUFBWEE7QUFOcUMsT0FBbEIsQ0FBckI7O0FBUUEsV0FBS3FCLHdCQUFMO0FBQ0Q7O0FBQ0QsUUFBSU4sV0FBVyxDQUFDTyxZQUFoQixFQUE4QjtBQUM1QixVQUFJVCxLQUFLLENBQUNVLEtBQU4sS0FBZ0JULFFBQVEsQ0FBQ1MsS0FBN0IsRUFBb0M7QUFDbEMsYUFBS0Ysd0JBQUw7QUFDRDtBQUNGO0FBQ0Y7O0FBRURBLEVBQUFBLHdCQUF3QixHQUFHO0FBQUEsdUJBQ2tCLEtBQUtSLEtBRHZCO0FBQUEsUUFDakIvQixjQURpQixnQkFDakJBLGNBRGlCO0FBQUEsUUFDRDBDLGNBREMsZ0JBQ0RBLGNBREM7O0FBRXpCLFFBQUkxQyxjQUFjLElBQUkwQyxjQUFjLElBQUksQ0FBeEMsRUFBMkM7QUFDekMsVUFBTWhDLE1BQU0sR0FBRyxLQUFLcUIsS0FBTCxDQUFXSyxJQUFYLENBQWdCTSxjQUFoQixDQUFmO0FBQ0EsVUFBTUMsTUFBTSxHQUFHLEtBQUtaLEtBQUwsQ0FBVzlCLE9BQVgsQ0FBbUJTLE1BQW5CLENBQWY7O0FBRnlDLGtDQUd2Qix5Q0FBMEI7QUFBRWlDLFFBQUFBLE1BQU0sRUFBTkEsTUFBRjtBQUFVQyxRQUFBQSxDQUFDLEVBQUU1QztBQUFiLE9BQTFCLENBSHVCO0FBQUEsVUFHakN5QyxLQUhpQyx5QkFHakNBLEtBSGlDOztBQUl6QyxXQUFLMUIsS0FBTCxDQUFXOEIsYUFBWCxHQUEyQixDQUN6QjtBQUNFQyxRQUFBQSxRQUFRLEVBQUVMO0FBRFosT0FEeUIsQ0FBM0I7QUFLRCxLQVRELE1BU087QUFDTCxXQUFLMUIsS0FBTCxDQUFXOEIsYUFBWCxHQUEyQixFQUEzQjtBQUNEO0FBQ0Y7O0FBRURFLEVBQUFBLGNBQWMsUUFBVztBQUFBLFFBQVJDLElBQVEsU0FBUkEsSUFBUTtBQUN2QixXQUFPeEQsTUFBTSxDQUFDQyxNQUFQLENBQWN1RCxJQUFkLEVBQW9CO0FBQ3pCO0FBQ0F0QyxNQUFBQSxNQUFNLEVBQUdzQyxJQUFJLENBQUN0QyxNQUFMLElBQWVzQyxJQUFJLENBQUN0QyxNQUFMLENBQVlQLElBQTVCLElBQXFDNkMsSUFBSSxDQUFDdEM7QUFGekIsS0FBcEIsQ0FBUDtBQUlEOztBQUVEdUMsRUFBQUEsWUFBWSxHQUFHO0FBQ2IsV0FBTyxDQUNMLElBQUl2RCx5QkFBSixDQUNFLEtBQUtxQyxLQURQLEVBRUUsS0FBS21CLGdCQUFMLENBQXNCO0FBQ3BCQyxNQUFBQSxFQUFFLEVBQUUsT0FEZ0I7QUFFcEI7QUFDQWYsTUFBQUEsSUFBSSxFQUFFLEtBQUtMLEtBQUwsQ0FBV0s7QUFIRyxLQUF0QixDQUZGLENBREssRUFTTCxJQUFJLEtBQUtMLEtBQUwsQ0FBV3BDLFdBQWYsQ0FDRSxLQUFLdUQsZ0JBQUwsQ0FDRTFELE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLEVBQWQsRUFBa0IsS0FBS3NDLEtBQUwsQ0FBV25DLGdCQUE3QixFQUErQztBQUM3Q3VELE1BQUFBLEVBQUUsRUFBRSxTQUR5QztBQUU3Q2YsTUFBQUEsSUFBSSxFQUFFLEtBQUtyQixLQUFMLENBQVdDLE9BRjRCO0FBRzdDbkIsTUFBQUEsU0FBUyxFQUFFLEtBQUtrQyxLQUFMLENBQVdsQyxTQUh1QjtBQUk3Q0MsTUFBQUEsSUFBSSxFQUFFLEtBQUtpQyxLQUFMLENBQVdqQyxJQUo0QjtBQUs3Q3NELE1BQUFBLFFBQVEsRUFBRSxLQUxtQztBQU03Q0MsTUFBQUEsVUFBVSxFQUFFO0FBQ1ZDLFFBQUFBLEtBQUssRUFBRSxLQURHO0FBRVZDLFFBQUFBLFNBQVMsRUFBRTtBQUZEO0FBTmlDLEtBQS9DLENBREYsQ0FERixDQVRLLEVBd0JMLEtBQUt4QyxLQUFMLENBQVc4QixhQUFYLElBQ0UsSUFBSVcscUNBQUosQ0FBcUI7QUFDbkJMLE1BQUFBLEVBQUUsWUFBSyxLQUFLcEIsS0FBTCxDQUFXb0IsRUFBaEIsZUFEaUI7QUFFbkJmLE1BQUFBLElBQUksRUFBRSxLQUFLckIsS0FBTCxDQUFXOEIsYUFGRTtBQUduQi9DLE1BQUFBLElBQUksRUFBRSxLQUFLaUMsS0FBTCxDQUFXakM7QUFIRSxLQUFyQixDQXpCRyxDQUFQO0FBK0JEOztBQTVHeUQ7OztBQStHNURjLGVBQWUsQ0FBQzZDLFNBQWhCLEdBQTRCLGlCQUE1QjtBQUNBN0MsZUFBZSxDQUFDckIsWUFBaEIsR0FBK0JBLFlBQS9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9zaXRlTGF5ZXIsIENPT1JESU5BVEVfU1lTVEVNIH0gZnJvbSAna2VwbGVyLW91dGRhdGVkLWRlY2suZ2wtY29yZSc7XG5pbXBvcnQgeyBTY2F0dGVycGxvdExheWVyIH0gZnJvbSAna2VwbGVyLW91dGRhdGVkLWRlY2suZ2wtbGF5ZXJzJztcbmltcG9ydCBQYXRoT3V0bGluZUxheWVyIGZyb20gJy4uL3BhdGgtb3V0bGluZS1sYXllci9wYXRoLW91dGxpbmUtbGF5ZXInO1xuaW1wb3J0IE1lc2hMYXllciBmcm9tICcuLi9tZXNoLWxheWVyL21lc2gtbGF5ZXInO1xuaW1wb3J0IEFycm93MkRHZW9tZXRyeSBmcm9tICcuL2Fycm93LTJkLWdlb21ldHJ5JztcblxuaW1wb3J0IGNyZWF0ZVBhdGhNYXJrZXJzIGZyb20gJy4vY3JlYXRlLXBhdGgtbWFya2Vycyc7XG5pbXBvcnQgeyBnZXRDbG9zZXN0UG9pbnRPblBvbHlsaW5lIH0gZnJvbSAnLi9wb2x5bGluZSc7XG5cbmNvbnN0IERJU1RBTkNFX0ZPUl9NVUxUSV9BUlJPV1MgPSAwLjE7XG5jb25zdCBBUlJPV19IRUFEX1NJWkUgPSAwLjI7XG5jb25zdCBBUlJPV19UQUlMX1dJRFRIID0gMC4wNTtcbi8vIGNvbnN0IEFSUk9XX0NFTlRFUl9BREpVU1QgPSAtMC44O1xuXG5jb25zdCBERUZBVUxUX01BUktFUl9MQVlFUiA9IE1lc2hMYXllcjtcblxuY29uc3QgREVGQVVMVF9NQVJLRVJfTEFZRVJfUFJPUFMgPSB7XG4gIG1lc2g6IG5ldyBBcnJvdzJER2VvbWV0cnkoeyBoZWFkU2l6ZTogQVJST1dfSEVBRF9TSVpFLCB0YWlsV2lkdGg6IEFSUk9XX1RBSUxfV0lEVEggfSlcbn07XG5cbmNvbnN0IGRlZmF1bHRQcm9wcyA9IE9iamVjdC5hc3NpZ24oe30sIFBhdGhPdXRsaW5lTGF5ZXIuZGVmYXVsdFByb3BzLCB7XG4gIE1hcmtlckxheWVyOiBERUZBVUxUX01BUktFUl9MQVlFUixcbiAgbWFya2VyTGF5ZXJQcm9wczogREVGQVVMVF9NQVJLRVJfTEFZRVJfUFJPUFMsXG5cbiAgc2l6ZVNjYWxlOiAxMDAsXG4gIGZwNjQ6IGZhbHNlLFxuXG4gIGhpZ2h0bGlnaHRJbmRleDogLTEsXG4gIGhpZ2hsaWdodFBvaW50OiBudWxsLFxuXG4gIGdldFBhdGg6IHggPT4geC5wYXRoLFxuICBnZXRDb2xvcjogeCA9PiB4LmNvbG9yLFxuICBnZXRNYXJrZXJDb2xvcjogeCA9PiBbMCwgMCwgMCwgMjU1XSxcbiAgZ2V0RGlyZWN0aW9uOiB4ID0+IHguZGlyZWN0aW9uLFxuICBnZXRNYXJrZXJQZXJjZW50YWdlczogKG9iamVjdCwgeyBsaW5lTGVuZ3RoIH0pID0+XG4gICAgbGluZUxlbmd0aCA+IERJU1RBTkNFX0ZPUl9NVUxUSV9BUlJPV1MgPyBbMC4yNSwgMC41LCAwLjc1XSA6IFswLjVdXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGF0aE1hcmtlckxheWVyIGV4dGVuZHMgQ29tcG9zaXRlTGF5ZXIge1xuICBpbml0aWFsaXplU3RhdGUoKSB7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIG1hcmtlcnM6IFtdLFxuICAgICAgbWVzaDogbmV3IEFycm93MkRHZW9tZXRyeSh7IGhlYWRTaXplOiBBUlJPV19IRUFEX1NJWkUsIHRhaWxXaWR0aDogQVJST1dfVEFJTF9XSURUSCB9KSxcbiAgICAgIGNsb3Nlc3RQb2ludDogbnVsbFxuICAgIH07XG4gIH1cblxuICBwcm9qZWN0RmxhdCh4eXosIHZpZXdwb3J0LCBjb29yZGluYXRlU3lzdGVtLCBjb29yZGluYXRlT3JpZ2luKSB7XG4gICAgaWYgKGNvb3JkaW5hdGVTeXN0ZW0gPT09IENPT1JESU5BVEVfU1lTVEVNLk1FVEVSX09GRlNFVFMpIHtcbiAgICAgIGNvbnN0IFtkeCwgZHldID0gdmlld3BvcnQubWV0ZXJzVG9MbmdMYXREZWx0YSh4eXopO1xuICAgICAgY29uc3QgW3gsIHldID0gY29vcmRpbmF0ZU9yaWdpbjtcbiAgICAgIHJldHVybiB2aWV3cG9ydC5wcm9qZWN0RmxhdChbeCArIGR4LCBkeSArIHldKTtcbiAgICB9IGVsc2UgaWYgKGNvb3JkaW5hdGVTeXN0ZW0gPT09IENPT1JESU5BVEVfU1lTVEVNLkxOR0xBVF9PRkZTRVRTKSB7XG4gICAgICBjb25zdCBbZHgsIGR5XSA9IHh5ejtcbiAgICAgIGNvbnN0IFt4LCB5XSA9IGNvb3JkaW5hdGVPcmlnaW47XG4gICAgICByZXR1cm4gdmlld3BvcnQucHJvamVjdEZsYXQoW3ggKyBkeCwgZHkgKyB5XSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZpZXdwb3J0LnByb2plY3RGbGF0KHh5eik7XG4gIH1cblxuICB1cGRhdGVTdGF0ZSh7IHByb3BzLCBvbGRQcm9wcywgY2hhbmdlRmxhZ3MgfSkge1xuICAgIGlmIChjaGFuZ2VGbGFncy5kYXRhQ2hhbmdlZCB8fCBjaGFuZ2VGbGFncy51cGRhdGVUcmlnZ2Vyc0NoYW5nZWQpIHtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgZGF0YSxcbiAgICAgICAgZ2V0UGF0aCxcbiAgICAgICAgZ2V0RGlyZWN0aW9uLFxuICAgICAgICBnZXRNYXJrZXJDb2xvcixcbiAgICAgICAgZ2V0TWFya2VyUGVyY2VudGFnZXMsXG4gICAgICAgIGNvb3JkaW5hdGVTeXN0ZW0sXG4gICAgICAgIGNvb3JkaW5hdGVPcmlnaW5cbiAgICAgIH0gPSB0aGlzLnByb3BzO1xuICAgICAgY29uc3QgeyB2aWV3cG9ydCB9ID0gdGhpcy5jb250ZXh0O1xuICAgICAgY29uc3QgcHJvamVjdEZsYXQgPSBvID0+IHRoaXMucHJvamVjdEZsYXQobywgdmlld3BvcnQsIGNvb3JkaW5hdGVTeXN0ZW0sIGNvb3JkaW5hdGVPcmlnaW4pO1xuICAgICAgdGhpcy5zdGF0ZS5tYXJrZXJzID0gY3JlYXRlUGF0aE1hcmtlcnMoe1xuICAgICAgICBkYXRhLFxuICAgICAgICBnZXRQYXRoLFxuICAgICAgICBnZXREaXJlY3Rpb24sXG4gICAgICAgIGdldENvbG9yOiBnZXRNYXJrZXJDb2xvcixcbiAgICAgICAgZ2V0TWFya2VyUGVyY2VudGFnZXMsXG4gICAgICAgIHByb2plY3RGbGF0XG4gICAgICB9KTtcbiAgICAgIHRoaXMuX3JlY2FsY3VsYXRlQ2xvc2VzdFBvaW50KCk7XG4gICAgfVxuICAgIGlmIChjaGFuZ2VGbGFncy5wcm9wc0NoYW5nZWQpIHtcbiAgICAgIGlmIChwcm9wcy5wb2ludCAhPT0gb2xkUHJvcHMucG9pbnQpIHtcbiAgICAgICAgdGhpcy5fcmVjYWxjdWxhdGVDbG9zZXN0UG9pbnQoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfcmVjYWxjdWxhdGVDbG9zZXN0UG9pbnQoKSB7XG4gICAgY29uc3QgeyBoaWdobGlnaHRQb2ludCwgaGlnaGxpZ2h0SW5kZXggfSA9IHRoaXMucHJvcHM7XG4gICAgaWYgKGhpZ2hsaWdodFBvaW50ICYmIGhpZ2hsaWdodEluZGV4ID49IDApIHtcbiAgICAgIGNvbnN0IG9iamVjdCA9IHRoaXMucHJvcHMuZGF0YVtoaWdobGlnaHRJbmRleF07XG4gICAgICBjb25zdCBwb2ludHMgPSB0aGlzLnByb3BzLmdldFBhdGgob2JqZWN0KTtcbiAgICAgIGNvbnN0IHsgcG9pbnQgfSA9IGdldENsb3Nlc3RQb2ludE9uUG9seWxpbmUoeyBwb2ludHMsIHA6IGhpZ2hsaWdodFBvaW50IH0pO1xuICAgICAgdGhpcy5zdGF0ZS5jbG9zZXN0UG9pbnRzID0gW1xuICAgICAgICB7XG4gICAgICAgICAgcG9zaXRpb246IHBvaW50XG4gICAgICAgIH1cbiAgICAgIF07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc3RhdGUuY2xvc2VzdFBvaW50cyA9IFtdO1xuICAgIH1cbiAgfVxuXG4gIGdldFBpY2tpbmdJbmZvKHsgaW5mbyB9KSB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oaW5mbywge1xuICAgICAgLy8gb3ZlcnJpZGUgb2JqZWN0IHdpdGggcGlja2VkIGZlYXR1cmVcbiAgICAgIG9iamVjdDogKGluZm8ub2JqZWN0ICYmIGluZm8ub2JqZWN0LnBhdGgpIHx8IGluZm8ub2JqZWN0XG4gICAgfSk7XG4gIH1cblxuICByZW5kZXJMYXllcnMoKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIG5ldyBQYXRoT3V0bGluZUxheWVyKFxuICAgICAgICB0aGlzLnByb3BzLFxuICAgICAgICB0aGlzLmdldFN1YkxheWVyUHJvcHMoe1xuICAgICAgICAgIGlkOiAncGF0aHMnLFxuICAgICAgICAgIC8vIE5vdGU6IGRhdGEgaGFzIHRvIGJlIHBhc3NlZCBleHBsaWNpdGx5IGxpa2UgdGhpcyB0byBhdm9pZCBiZWluZyBlbXB0eVxuICAgICAgICAgIGRhdGE6IHRoaXMucHJvcHMuZGF0YVxuICAgICAgICB9KVxuICAgICAgKSxcbiAgICAgIG5ldyB0aGlzLnByb3BzLk1hcmtlckxheWVyKFxuICAgICAgICB0aGlzLmdldFN1YkxheWVyUHJvcHMoXG4gICAgICAgICAgT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5wcm9wcy5tYXJrZXJMYXllclByb3BzLCB7XG4gICAgICAgICAgICBpZDogJ21hcmtlcnMnLFxuICAgICAgICAgICAgZGF0YTogdGhpcy5zdGF0ZS5tYXJrZXJzLFxuICAgICAgICAgICAgc2l6ZVNjYWxlOiB0aGlzLnByb3BzLnNpemVTY2FsZSxcbiAgICAgICAgICAgIGZwNjQ6IHRoaXMucHJvcHMuZnA2NCxcbiAgICAgICAgICAgIHBpY2thYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgICAgYmxlbmQ6IGZhbHNlLFxuICAgICAgICAgICAgICBkZXB0aFRlc3Q6IGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgKVxuICAgICAgKSxcbiAgICAgIHRoaXMuc3RhdGUuY2xvc2VzdFBvaW50cyAmJlxuICAgICAgICBuZXcgU2NhdHRlcnBsb3RMYXllcih7XG4gICAgICAgICAgaWQ6IGAke3RoaXMucHJvcHMuaWR9LWhpZ2hsaWdodGAsXG4gICAgICAgICAgZGF0YTogdGhpcy5zdGF0ZS5jbG9zZXN0UG9pbnRzLFxuICAgICAgICAgIGZwNjQ6IHRoaXMucHJvcHMuZnA2NFxuICAgICAgICB9KVxuICAgIF07XG4gIH1cbn1cblxuUGF0aE1hcmtlckxheWVyLmxheWVyTmFtZSA9ICdQYXRoTWFya2VyTGF5ZXInO1xuUGF0aE1hcmtlckxheWVyLmRlZmF1bHRQcm9wcyA9IGRlZmF1bHRQcm9wcztcbiJdfQ==