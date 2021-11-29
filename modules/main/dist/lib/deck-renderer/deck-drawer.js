"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.SELECTION_TYPE = void 0;

var _keplerOutdatedDeck = require("kepler-outdated-deck.gl-layers");

var _helpers = require("@turf/helpers");

var _bbox = _interopRequireDefault(require("@turf/bbox"));

var _bboxPolygon = _interopRequireDefault(require("@turf/bbox-polygon"));

var _buffer = _interopRequireDefault(require("@turf/buffer"));

var _difference = _interopRequireDefault(require("@turf/difference"));

var _distance = _interopRequireDefault(require("@turf/distance"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var POLYGON_LINE_COLOR = [0, 255, 0, 255];
var POLYGON_FILL_COLOR = [255, 255, 255, 90];
var POLYGON_LINE_WIDTH = 2;
var POLYGON_DASHES = [20, 20];
var POLYGON_THRESHOLD = 0.01;
var EXPANSION_KM = 10;
var LAYER_ID_VIEW = 'DeckDrawerView';
var LAYER_ID_PICK = 'DeckDrawerPick';
var SELECTION_TYPE = {
  NONE: null,
  RECTANGLE: 'rectangle',
  POLYGON: 'polygon'
};
exports.SELECTION_TYPE = SELECTION_TYPE;

class DeckDrawer {
  constructor(nebula) {
    _defineProperty(this, "nebula", void 0);

    _defineProperty(this, "usePolygon", void 0);

    _defineProperty(this, "validPolygon", void 0);

    _defineProperty(this, "landPoints", void 0);

    _defineProperty(this, "mousePoints", void 0);

    this.nebula = nebula;
    this.usePolygon = false;
    this.landPoints = [];
    this.mousePoints = [];
  }

  _getLayerIds() {
    // TODO: sort by mouse priority
    return this.nebula.deckgl.props.layers.filter(function (l) {
      return l && l.props && l.props.nebulaLayer && l.props.nebulaLayer.enableSelection;
    }).map(function (l) {
      return l.id;
    });
  }

  _selectFromPickingInfos(pickingInfos) {
    var objects = pickingInfos.map(function (_ref) {
      var layer = _ref.layer,
          index = _ref.index,
          object = _ref.object;
      return object.original || layer.props.nebulaLayer.deckCache.originals[index];
    });
    this.nebula.props.onSelection(objects);
  }

  _getBoundingBox() {
    var mousePoints = this.mousePoints;
    var allX = mousePoints.map(function (mousePoint) {
      return mousePoint[0];
    });
    var allY = mousePoints.map(function (mousePoint) {
      return mousePoint[1];
    });
    var x = Math.min.apply(Math, _toConsumableArray(allX));
    var y = Math.min.apply(Math, _toConsumableArray(allY));
    var maxX = Math.max.apply(Math, _toConsumableArray(allX));
    var maxY = Math.max.apply(Math, _toConsumableArray(allY));
    return {
      x: x,
      y: y,
      width: maxX - x,
      height: maxY - y
    };
  }

  _selectRectangleObjects() {
    if (this.landPoints.length !== 2) return;

    var _this$mousePoints$ = _slicedToArray(this.mousePoints[0], 2),
        x1 = _this$mousePoints$[0],
        y1 = _this$mousePoints$[1];

    var _this$mousePoints$2 = _slicedToArray(this.mousePoints[1], 2),
        x2 = _this$mousePoints$2[0],
        y2 = _this$mousePoints$2[1];

    var pickingInfos = this.nebula.deckgl.pickObjects({
      x: Math.min(x1, x2),
      y: Math.min(y1, y2),
      width: Math.abs(x2 - x1),
      height: Math.abs(y2 - y1),
      layerIds: this._getLayerIds()
    });

    this._selectFromPickingInfos(pickingInfos);
  }

  _selectPolygonObjects() {
    var pickingInfos = this.nebula.deckgl.pickObjects(_objectSpread({}, this._getBoundingBox(), {
      layerIds: [LAYER_ID_PICK].concat(_toConsumableArray(this._getLayerIds()))
    }));

    this._selectFromPickingInfos(pickingInfos.filter(function (item) {
      return item.layer.id !== LAYER_ID_PICK;
    }));
  }

  _getMousePosFromEvent(event) {
    var offsetX = event.offsetX,
        offsetY = event.offsetY;
    return [offsetX, offsetY];
  }

  handleEvent(event, lngLat, selectionType) {
    // capture all events (mouse-up is needed to prevent us stuck in moving map)
    if (event.type !== 'mouseup') event.stopPropagation();
    this.usePolygon = selectionType === SELECTION_TYPE.POLYGON;
    var redraw = false;
    var deactivate = false;
    var usePolygon = this.usePolygon,
        landPoints = this.landPoints,
        mousePoints = this.mousePoints;

    if (event.type === 'mousedown') {
      if (usePolygon && landPoints.length) {
        // if landPoints.length is zero we want to insert two points (so we let it run the else)
        // also don't insert if polygon is invalid
        if (this.landPoints.length < 3 || this.validPolygon) {
          landPoints.push(lngLat);
          mousePoints.push(this._getMousePosFromEvent(event));
        }
      } else {
        this.landPoints = [lngLat, lngLat];

        var m = this._getMousePosFromEvent(event);

        this.mousePoints = [m, m];
      }

      redraw = true;
    } else if (event.type === 'mousemove' && landPoints.length) {
      // update last point
      landPoints[landPoints.length - 1] = lngLat;
      mousePoints[mousePoints.length - 1] = this._getMousePosFromEvent(event);
      redraw = true;
    } else if (event.type === 'mouseup') {
      if (usePolygon) {
        // check to see if completed
        // TODO: Maybe double-click to finish?
        if (landPoints.length > 4 && (0, _distance.default)(landPoints[0], landPoints[landPoints.length - 1]) < POLYGON_THRESHOLD && this.validPolygon) {
          this._selectPolygonObjects();

          this.reset();
          redraw = true;
          deactivate = true;
        }
      } else {
        this._selectRectangleObjects();

        this.reset();
        redraw = true;
        deactivate = true;
      }
    }

    return {
      redraw: redraw,
      deactivate: deactivate
    };
  }

  reset() {
    this.landPoints = [];
    this.mousePoints = [];
  }

  _makeStartPointHighlight(center) {
    var buffer = (0, _buffer.default)((0, _helpers.point)(center), POLYGON_THRESHOLD / 4.0);
    return (0, _bboxPolygon.default)((0, _bbox.default)(buffer)).geometry.coordinates;
  }

  render() {
    var _this = this;

    var data = [];
    var dataPick = [];

    if (!this.usePolygon && this.landPoints.length === 2) {
      // Use mouse points instead of land points so we get the right shape
      // no matter what bearing is.
      var _this$mousePoints = _slicedToArray(this.mousePoints, 2),
          _this$mousePoints$3 = _slicedToArray(_this$mousePoints[0], 2),
          x1 = _this$mousePoints$3[0],
          y1 = _this$mousePoints$3[1],
          _this$mousePoints$4 = _slicedToArray(_this$mousePoints[1], 2),
          x2 = _this$mousePoints$4[0],
          y2 = _this$mousePoints$4[1];

      var selPolygon = [[x1, y1], [x1, y2], [x2, y2], [x2, y1], [x1, y1]].map(function (mousePos) {
        return _this.nebula.unprojectMousePosition(mousePos);
      });
      data.push({
        polygon: selPolygon,
        lineColor: POLYGON_LINE_COLOR,
        fillColor: POLYGON_FILL_COLOR
      });
    } else if (this.usePolygon && this.landPoints.length) {
      data.push({
        polygon: this.landPoints,
        lineColor: POLYGON_LINE_COLOR,
        fillColor: POLYGON_FILL_COLOR
      }); // Hack: use a polygon to hide the outside, because pickObjects()
      // does not support polygons

      if (this.landPoints.length >= 3) {
        var landPointsPoly = (0, _helpers.polygon)([_toConsumableArray(this.landPoints).concat([this.landPoints[0]])]);
        var bigBuffer = (0, _buffer.default)((0, _helpers.point)(this.landPoints[0]), EXPANSION_KM);
        var bigPolygon;

        try {
          // turfDifference throws an exception if the polygon
          // intersects with itself
          bigPolygon = (0, _difference.default)(bigBuffer, landPointsPoly);
          dataPick.push({
            polygon: bigPolygon.geometry.coordinates,
            fillColor: [0, 0, 0, 1]
          });
          this.validPolygon = true;
        } catch (e) {
          // invalid selection polygon
          this.validPolygon = false;
        }
      }
    }

    if (this.landPoints.length) {
      // highlight start point
      data.push({
        polygon: this._makeStartPointHighlight(this.landPoints[0]),
        lineColor: [0, 0, 0, 0],
        fillColor: POLYGON_LINE_COLOR
      });
    } // Hack to make the PolygonLayer() stay active,
    // otherwise it takes 3 seconds (!) to init!
    // TODO: fix this


    data.push({
      polygon: [[0, 0]]
    });
    dataPick.push({
      polygon: [[0, 0]]
    });
    return [new _keplerOutdatedDeck.PolygonLayer({
      id: LAYER_ID_VIEW,
      data: data,
      fp64: false,
      opacity: 1.0,
      pickable: false,
      lineWidthMinPixels: POLYGON_LINE_WIDTH,
      lineWidthMaxPixels: POLYGON_LINE_WIDTH,
      lineDashJustified: true,
      getLineDashArray: function getLineDashArray(x) {
        return POLYGON_DASHES;
      },
      getLineColor: function getLineColor(obj) {
        return obj.lineColor || [0, 0, 0, 255];
      },
      getFillColor: function getFillColor(obj) {
        return obj.fillColor || [0, 0, 0, 255];
      },
      getPolygon: function getPolygon(o) {
        return o.polygon;
      }
    }), new _keplerOutdatedDeck.PolygonLayer({
      id: LAYER_ID_PICK,
      data: dataPick,
      getLineColor: function getLineColor(obj) {
        return obj.lineColor || [0, 0, 0, 255];
      },
      getFillColor: function getFillColor(obj) {
        return obj.fillColor || [0, 0, 0, 255];
      },
      fp64: false,
      opacity: 1.0,
      stroked: false,
      pickable: true,
      getPolygon: function getPolygon(o) {
        return o.polygon;
      }
    })];
  }

}

exports.default = DeckDrawer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvZGVjay1yZW5kZXJlci9kZWNrLWRyYXdlci5qcyJdLCJuYW1lcyI6WyJQT0xZR09OX0xJTkVfQ09MT1IiLCJQT0xZR09OX0ZJTExfQ09MT1IiLCJQT0xZR09OX0xJTkVfV0lEVEgiLCJQT0xZR09OX0RBU0hFUyIsIlBPTFlHT05fVEhSRVNIT0xEIiwiRVhQQU5TSU9OX0tNIiwiTEFZRVJfSURfVklFVyIsIkxBWUVSX0lEX1BJQ0siLCJTRUxFQ1RJT05fVFlQRSIsIk5PTkUiLCJSRUNUQU5HTEUiLCJQT0xZR09OIiwiRGVja0RyYXdlciIsImNvbnN0cnVjdG9yIiwibmVidWxhIiwidXNlUG9seWdvbiIsImxhbmRQb2ludHMiLCJtb3VzZVBvaW50cyIsIl9nZXRMYXllcklkcyIsImRlY2tnbCIsInByb3BzIiwibGF5ZXJzIiwiZmlsdGVyIiwibCIsIm5lYnVsYUxheWVyIiwiZW5hYmxlU2VsZWN0aW9uIiwibWFwIiwiaWQiLCJfc2VsZWN0RnJvbVBpY2tpbmdJbmZvcyIsInBpY2tpbmdJbmZvcyIsIm9iamVjdHMiLCJsYXllciIsImluZGV4Iiwib2JqZWN0Iiwib3JpZ2luYWwiLCJkZWNrQ2FjaGUiLCJvcmlnaW5hbHMiLCJvblNlbGVjdGlvbiIsIl9nZXRCb3VuZGluZ0JveCIsImFsbFgiLCJtb3VzZVBvaW50IiwiYWxsWSIsIngiLCJNYXRoIiwibWluIiwieSIsIm1heFgiLCJtYXgiLCJtYXhZIiwid2lkdGgiLCJoZWlnaHQiLCJfc2VsZWN0UmVjdGFuZ2xlT2JqZWN0cyIsImxlbmd0aCIsIngxIiwieTEiLCJ4MiIsInkyIiwicGlja09iamVjdHMiLCJhYnMiLCJsYXllcklkcyIsIl9zZWxlY3RQb2x5Z29uT2JqZWN0cyIsIml0ZW0iLCJfZ2V0TW91c2VQb3NGcm9tRXZlbnQiLCJldmVudCIsIm9mZnNldFgiLCJvZmZzZXRZIiwiaGFuZGxlRXZlbnQiLCJsbmdMYXQiLCJzZWxlY3Rpb25UeXBlIiwidHlwZSIsInN0b3BQcm9wYWdhdGlvbiIsInJlZHJhdyIsImRlYWN0aXZhdGUiLCJ2YWxpZFBvbHlnb24iLCJwdXNoIiwibSIsInJlc2V0IiwiX21ha2VTdGFydFBvaW50SGlnaGxpZ2h0IiwiY2VudGVyIiwiYnVmZmVyIiwiZ2VvbWV0cnkiLCJjb29yZGluYXRlcyIsInJlbmRlciIsImRhdGEiLCJkYXRhUGljayIsInNlbFBvbHlnb24iLCJtb3VzZVBvcyIsInVucHJvamVjdE1vdXNlUG9zaXRpb24iLCJwb2x5Z29uIiwibGluZUNvbG9yIiwiZmlsbENvbG9yIiwibGFuZFBvaW50c1BvbHkiLCJiaWdCdWZmZXIiLCJiaWdQb2x5Z29uIiwiZSIsIlBvbHlnb25MYXllciIsImZwNjQiLCJvcGFjaXR5IiwicGlja2FibGUiLCJsaW5lV2lkdGhNaW5QaXhlbHMiLCJsaW5lV2lkdGhNYXhQaXhlbHMiLCJsaW5lRGFzaEp1c3RpZmllZCIsImdldExpbmVEYXNoQXJyYXkiLCJnZXRMaW5lQ29sb3IiLCJvYmoiLCJnZXRGaWxsQ29sb3IiLCJnZXRQb2x5Z29uIiwibyIsInN0cm9rZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsa0JBQWtCLEdBQUcsQ0FBQyxDQUFELEVBQUksR0FBSixFQUFTLENBQVQsRUFBWSxHQUFaLENBQTNCO0FBQ0EsSUFBTUMsa0JBQWtCLEdBQUcsQ0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEdBQVgsRUFBZ0IsRUFBaEIsQ0FBM0I7QUFDQSxJQUFNQyxrQkFBa0IsR0FBRyxDQUEzQjtBQUNBLElBQU1DLGNBQWMsR0FBRyxDQUFDLEVBQUQsRUFBSyxFQUFMLENBQXZCO0FBQ0EsSUFBTUMsaUJBQWlCLEdBQUcsSUFBMUI7QUFDQSxJQUFNQyxZQUFZLEdBQUcsRUFBckI7QUFDQSxJQUFNQyxhQUFhLEdBQUcsZ0JBQXRCO0FBQ0EsSUFBTUMsYUFBYSxHQUFHLGdCQUF0QjtBQUVPLElBQU1DLGNBQWMsR0FBRztBQUM1QkMsRUFBQUEsSUFBSSxFQUFFLElBRHNCO0FBRTVCQyxFQUFBQSxTQUFTLEVBQUUsV0FGaUI7QUFHNUJDLEVBQUFBLE9BQU8sRUFBRTtBQUhtQixDQUF2Qjs7O0FBTVEsTUFBTUMsVUFBTixDQUFpQjtBQU85QkMsRUFBQUEsV0FBVyxDQUFDQyxNQUFELEVBQWlCO0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQzFCLFNBQUtBLE1BQUwsR0FBY0EsTUFBZDtBQUNBLFNBQUtDLFVBQUwsR0FBa0IsS0FBbEI7QUFDQSxTQUFLQyxVQUFMLEdBQWtCLEVBQWxCO0FBQ0EsU0FBS0MsV0FBTCxHQUFtQixFQUFuQjtBQUNEOztBQUVEQyxFQUFBQSxZQUFZLEdBQUc7QUFDYjtBQUNBLFdBQU8sS0FBS0osTUFBTCxDQUFZSyxNQUFaLENBQW1CQyxLQUFuQixDQUF5QkMsTUFBekIsQ0FDSkMsTUFESSxDQUNHLFVBQUFDLENBQUM7QUFBQSxhQUFJQSxDQUFDLElBQUlBLENBQUMsQ0FBQ0gsS0FBUCxJQUFnQkcsQ0FBQyxDQUFDSCxLQUFGLENBQVFJLFdBQXhCLElBQXVDRCxDQUFDLENBQUNILEtBQUYsQ0FBUUksV0FBUixDQUFvQkMsZUFBL0Q7QUFBQSxLQURKLEVBRUpDLEdBRkksQ0FFQSxVQUFBSCxDQUFDO0FBQUEsYUFBSUEsQ0FBQyxDQUFDSSxFQUFOO0FBQUEsS0FGRCxDQUFQO0FBR0Q7O0FBRURDLEVBQUFBLHVCQUF1QixDQUFDQyxZQUFELEVBQXlCO0FBQzlDLFFBQU1DLE9BQU8sR0FBR0QsWUFBWSxDQUFDSCxHQUFiLENBQ2Q7QUFBQSxVQUFHSyxLQUFILFFBQUdBLEtBQUg7QUFBQSxVQUFVQyxLQUFWLFFBQVVBLEtBQVY7QUFBQSxVQUFpQkMsTUFBakIsUUFBaUJBLE1BQWpCO0FBQUEsYUFDRUEsTUFBTSxDQUFDQyxRQUFQLElBQW1CSCxLQUFLLENBQUNYLEtBQU4sQ0FBWUksV0FBWixDQUF3QlcsU0FBeEIsQ0FBa0NDLFNBQWxDLENBQTRDSixLQUE1QyxDQURyQjtBQUFBLEtBRGMsQ0FBaEI7QUFJQSxTQUFLbEIsTUFBTCxDQUFZTSxLQUFaLENBQWtCaUIsV0FBbEIsQ0FBOEJQLE9BQTlCO0FBQ0Q7O0FBRURRLEVBQUFBLGVBQWUsR0FBVztBQUFBLFFBQ2hCckIsV0FEZ0IsR0FDQSxJQURBLENBQ2hCQSxXQURnQjtBQUV4QixRQUFNc0IsSUFBSSxHQUFHdEIsV0FBVyxDQUFDUyxHQUFaLENBQWdCLFVBQUFjLFVBQVU7QUFBQSxhQUFJQSxVQUFVLENBQUMsQ0FBRCxDQUFkO0FBQUEsS0FBMUIsQ0FBYjtBQUNBLFFBQU1DLElBQUksR0FBR3hCLFdBQVcsQ0FBQ1MsR0FBWixDQUFnQixVQUFBYyxVQUFVO0FBQUEsYUFBSUEsVUFBVSxDQUFDLENBQUQsQ0FBZDtBQUFBLEtBQTFCLENBQWI7QUFDQSxRQUFNRSxDQUFDLEdBQUdDLElBQUksQ0FBQ0MsR0FBTCxPQUFBRCxJQUFJLHFCQUFRSixJQUFSLEVBQWQ7QUFDQSxRQUFNTSxDQUFDLEdBQUdGLElBQUksQ0FBQ0MsR0FBTCxPQUFBRCxJQUFJLHFCQUFRRixJQUFSLEVBQWQ7QUFDQSxRQUFNSyxJQUFJLEdBQUdILElBQUksQ0FBQ0ksR0FBTCxPQUFBSixJQUFJLHFCQUFRSixJQUFSLEVBQWpCO0FBQ0EsUUFBTVMsSUFBSSxHQUFHTCxJQUFJLENBQUNJLEdBQUwsT0FBQUosSUFBSSxxQkFBUUYsSUFBUixFQUFqQjtBQUVBLFdBQU87QUFBRUMsTUFBQUEsQ0FBQyxFQUFEQSxDQUFGO0FBQUtHLE1BQUFBLENBQUMsRUFBREEsQ0FBTDtBQUFRSSxNQUFBQSxLQUFLLEVBQUVILElBQUksR0FBR0osQ0FBdEI7QUFBeUJRLE1BQUFBLE1BQU0sRUFBRUYsSUFBSSxHQUFHSDtBQUF4QyxLQUFQO0FBQ0Q7O0FBRURNLEVBQUFBLHVCQUF1QixHQUFHO0FBQ3hCLFFBQUksS0FBS25DLFVBQUwsQ0FBZ0JvQyxNQUFoQixLQUEyQixDQUEvQixFQUFrQzs7QUFEViw0Q0FHUCxLQUFLbkMsV0FBTCxDQUFpQixDQUFqQixDQUhPO0FBQUEsUUFHakJvQyxFQUhpQjtBQUFBLFFBR2JDLEVBSGE7O0FBQUEsNkNBSVAsS0FBS3JDLFdBQUwsQ0FBaUIsQ0FBakIsQ0FKTztBQUFBLFFBSWpCc0MsRUFKaUI7QUFBQSxRQUliQyxFQUphOztBQUt4QixRQUFNM0IsWUFBWSxHQUFHLEtBQUtmLE1BQUwsQ0FBWUssTUFBWixDQUFtQnNDLFdBQW5CLENBQStCO0FBQ2xEZixNQUFBQSxDQUFDLEVBQUVDLElBQUksQ0FBQ0MsR0FBTCxDQUFTUyxFQUFULEVBQWFFLEVBQWIsQ0FEK0M7QUFFbERWLE1BQUFBLENBQUMsRUFBRUYsSUFBSSxDQUFDQyxHQUFMLENBQVNVLEVBQVQsRUFBYUUsRUFBYixDQUYrQztBQUdsRFAsTUFBQUEsS0FBSyxFQUFFTixJQUFJLENBQUNlLEdBQUwsQ0FBU0gsRUFBRSxHQUFHRixFQUFkLENBSDJDO0FBSWxESCxNQUFBQSxNQUFNLEVBQUVQLElBQUksQ0FBQ2UsR0FBTCxDQUFTRixFQUFFLEdBQUdGLEVBQWQsQ0FKMEM7QUFLbERLLE1BQUFBLFFBQVEsRUFBRSxLQUFLekMsWUFBTDtBQUx3QyxLQUEvQixDQUFyQjs7QUFRQSxTQUFLVSx1QkFBTCxDQUE2QkMsWUFBN0I7QUFDRDs7QUFFRCtCLEVBQUFBLHFCQUFxQixHQUFHO0FBQ3RCLFFBQU0vQixZQUFZLEdBQUcsS0FBS2YsTUFBTCxDQUFZSyxNQUFaLENBQW1Cc0MsV0FBbkIsbUJBQ2hCLEtBQUtuQixlQUFMLEVBRGdCO0FBRW5CcUIsTUFBQUEsUUFBUSxHQUFHcEQsYUFBSCw0QkFBcUIsS0FBS1csWUFBTCxFQUFyQjtBQUZXLE9BQXJCOztBQUtBLFNBQUtVLHVCQUFMLENBQTZCQyxZQUFZLENBQUNQLE1BQWIsQ0FBb0IsVUFBQXVDLElBQUk7QUFBQSxhQUFJQSxJQUFJLENBQUM5QixLQUFMLENBQVdKLEVBQVgsS0FBa0JwQixhQUF0QjtBQUFBLEtBQXhCLENBQTdCO0FBQ0Q7O0FBRUR1RCxFQUFBQSxxQkFBcUIsQ0FBQ0MsS0FBRCxFQUFrQztBQUFBLFFBQzdDQyxPQUQ2QyxHQUN4QkQsS0FEd0IsQ0FDN0NDLE9BRDZDO0FBQUEsUUFDcENDLE9BRG9DLEdBQ3hCRixLQUR3QixDQUNwQ0UsT0FEb0M7QUFFckQsV0FBTyxDQUFDRCxPQUFELEVBQVVDLE9BQVYsQ0FBUDtBQUNEOztBQUVEQyxFQUFBQSxXQUFXLENBQ1RILEtBRFMsRUFFVEksTUFGUyxFQUdUQyxhQUhTLEVBSWlDO0FBQzFDO0FBQ0EsUUFBSUwsS0FBSyxDQUFDTSxJQUFOLEtBQWUsU0FBbkIsRUFBOEJOLEtBQUssQ0FBQ08sZUFBTjtBQUU5QixTQUFLdkQsVUFBTCxHQUFrQnFELGFBQWEsS0FBSzVELGNBQWMsQ0FBQ0csT0FBbkQ7QUFFQSxRQUFJNEQsTUFBTSxHQUFHLEtBQWI7QUFDQSxRQUFJQyxVQUFVLEdBQUcsS0FBakI7QUFQMEMsUUFTbEN6RCxVQVRrQyxHQVNNLElBVE4sQ0FTbENBLFVBVGtDO0FBQUEsUUFTdEJDLFVBVHNCLEdBU00sSUFUTixDQVN0QkEsVUFUc0I7QUFBQSxRQVNWQyxXQVRVLEdBU00sSUFUTixDQVNWQSxXQVRVOztBQVcxQyxRQUFJOEMsS0FBSyxDQUFDTSxJQUFOLEtBQWUsV0FBbkIsRUFBZ0M7QUFDOUIsVUFBSXRELFVBQVUsSUFBSUMsVUFBVSxDQUFDb0MsTUFBN0IsRUFBcUM7QUFDbkM7QUFDQTtBQUNBLFlBQUksS0FBS3BDLFVBQUwsQ0FBZ0JvQyxNQUFoQixHQUF5QixDQUF6QixJQUE4QixLQUFLcUIsWUFBdkMsRUFBcUQ7QUFDbkR6RCxVQUFBQSxVQUFVLENBQUMwRCxJQUFYLENBQWdCUCxNQUFoQjtBQUNBbEQsVUFBQUEsV0FBVyxDQUFDeUQsSUFBWixDQUFpQixLQUFLWixxQkFBTCxDQUEyQkMsS0FBM0IsQ0FBakI7QUFDRDtBQUNGLE9BUEQsTUFPTztBQUNMLGFBQUsvQyxVQUFMLEdBQWtCLENBQUNtRCxNQUFELEVBQVNBLE1BQVQsQ0FBbEI7O0FBQ0EsWUFBTVEsQ0FBQyxHQUFHLEtBQUtiLHFCQUFMLENBQTJCQyxLQUEzQixDQUFWOztBQUNBLGFBQUs5QyxXQUFMLEdBQW1CLENBQUMwRCxDQUFELEVBQUlBLENBQUosQ0FBbkI7QUFDRDs7QUFDREosTUFBQUEsTUFBTSxHQUFHLElBQVQ7QUFDRCxLQWRELE1BY08sSUFBSVIsS0FBSyxDQUFDTSxJQUFOLEtBQWUsV0FBZixJQUE4QnJELFVBQVUsQ0FBQ29DLE1BQTdDLEVBQXFEO0FBQzFEO0FBQ0FwQyxNQUFBQSxVQUFVLENBQUNBLFVBQVUsQ0FBQ29DLE1BQVgsR0FBb0IsQ0FBckIsQ0FBVixHQUFvQ2UsTUFBcEM7QUFDQWxELE1BQUFBLFdBQVcsQ0FBQ0EsV0FBVyxDQUFDbUMsTUFBWixHQUFxQixDQUF0QixDQUFYLEdBQXNDLEtBQUtVLHFCQUFMLENBQTJCQyxLQUEzQixDQUF0QztBQUNBUSxNQUFBQSxNQUFNLEdBQUcsSUFBVDtBQUNELEtBTE0sTUFLQSxJQUFJUixLQUFLLENBQUNNLElBQU4sS0FBZSxTQUFuQixFQUE4QjtBQUNuQyxVQUFJdEQsVUFBSixFQUFnQjtBQUNkO0FBQ0E7QUFDQSxZQUNFQyxVQUFVLENBQUNvQyxNQUFYLEdBQW9CLENBQXBCLElBQ0EsdUJBQWFwQyxVQUFVLENBQUMsQ0FBRCxDQUF2QixFQUE0QkEsVUFBVSxDQUFDQSxVQUFVLENBQUNvQyxNQUFYLEdBQW9CLENBQXJCLENBQXRDLElBQWlFaEQsaUJBRGpFLElBRUEsS0FBS3FFLFlBSFAsRUFJRTtBQUNBLGVBQUtiLHFCQUFMOztBQUNBLGVBQUtnQixLQUFMO0FBQ0FMLFVBQUFBLE1BQU0sR0FBRyxJQUFUO0FBQ0FDLFVBQUFBLFVBQVUsR0FBRyxJQUFiO0FBQ0Q7QUFDRixPQWJELE1BYU87QUFDTCxhQUFLckIsdUJBQUw7O0FBQ0EsYUFBS3lCLEtBQUw7QUFDQUwsUUFBQUEsTUFBTSxHQUFHLElBQVQ7QUFDQUMsUUFBQUEsVUFBVSxHQUFHLElBQWI7QUFDRDtBQUNGOztBQUVELFdBQU87QUFBRUQsTUFBQUEsTUFBTSxFQUFOQSxNQUFGO0FBQVVDLE1BQUFBLFVBQVUsRUFBVkE7QUFBVixLQUFQO0FBQ0Q7O0FBRURJLEVBQUFBLEtBQUssR0FBRztBQUNOLFNBQUs1RCxVQUFMLEdBQWtCLEVBQWxCO0FBQ0EsU0FBS0MsV0FBTCxHQUFtQixFQUFuQjtBQUNEOztBQUVENEQsRUFBQUEsd0JBQXdCLENBQUNDLE1BQUQsRUFBcUM7QUFDM0QsUUFBTUMsTUFBTSxHQUFHLHFCQUFXLG9CQUFNRCxNQUFOLENBQVgsRUFBMEIxRSxpQkFBaUIsR0FBRyxHQUE5QyxDQUFmO0FBQ0EsV0FBTywwQkFBZ0IsbUJBQVMyRSxNQUFULENBQWhCLEVBQWtDQyxRQUFsQyxDQUEyQ0MsV0FBbEQ7QUFDRDs7QUFFREMsRUFBQUEsTUFBTSxHQUFHO0FBQUE7O0FBQ1AsUUFBTUMsSUFBSSxHQUFHLEVBQWI7QUFDQSxRQUFNQyxRQUFRLEdBQUcsRUFBakI7O0FBRUEsUUFBSSxDQUFDLEtBQUtyRSxVQUFOLElBQW9CLEtBQUtDLFVBQUwsQ0FBZ0JvQyxNQUFoQixLQUEyQixDQUFuRCxFQUFzRDtBQUNwRDtBQUNBO0FBRm9ELDZDQUd2QixLQUFLbkMsV0FIa0I7QUFBQTtBQUFBLFVBRzVDb0MsRUFINEM7QUFBQSxVQUd4Q0MsRUFId0M7QUFBQTtBQUFBLFVBR2xDQyxFQUhrQztBQUFBLFVBRzlCQyxFQUg4Qjs7QUFJcEQsVUFBTTZCLFVBQVUsR0FBRyxDQUFDLENBQUNoQyxFQUFELEVBQUtDLEVBQUwsQ0FBRCxFQUFXLENBQUNELEVBQUQsRUFBS0csRUFBTCxDQUFYLEVBQXFCLENBQUNELEVBQUQsRUFBS0MsRUFBTCxDQUFyQixFQUErQixDQUFDRCxFQUFELEVBQUtELEVBQUwsQ0FBL0IsRUFBeUMsQ0FBQ0QsRUFBRCxFQUFLQyxFQUFMLENBQXpDLEVBQW1ENUIsR0FBbkQsQ0FBdUQsVUFBQTRELFFBQVE7QUFBQSxlQUNoRixLQUFJLENBQUN4RSxNQUFMLENBQVl5RSxzQkFBWixDQUFtQ0QsUUFBbkMsQ0FEZ0Y7QUFBQSxPQUEvRCxDQUFuQjtBQUdBSCxNQUFBQSxJQUFJLENBQUNULElBQUwsQ0FBVTtBQUNSYyxRQUFBQSxPQUFPLEVBQUVILFVBREQ7QUFFUkksUUFBQUEsU0FBUyxFQUFFekYsa0JBRkg7QUFHUjBGLFFBQUFBLFNBQVMsRUFBRXpGO0FBSEgsT0FBVjtBQUtELEtBWkQsTUFZTyxJQUFJLEtBQUtjLFVBQUwsSUFBbUIsS0FBS0MsVUFBTCxDQUFnQm9DLE1BQXZDLEVBQStDO0FBQ3BEK0IsTUFBQUEsSUFBSSxDQUFDVCxJQUFMLENBQVU7QUFDUmMsUUFBQUEsT0FBTyxFQUFFLEtBQUt4RSxVQUROO0FBRVJ5RSxRQUFBQSxTQUFTLEVBQUV6RixrQkFGSDtBQUdSMEYsUUFBQUEsU0FBUyxFQUFFekY7QUFISCxPQUFWLEVBRG9ELENBT3BEO0FBQ0E7O0FBQ0EsVUFBSSxLQUFLZSxVQUFMLENBQWdCb0MsTUFBaEIsSUFBMEIsQ0FBOUIsRUFBaUM7QUFDL0IsWUFBTXVDLGNBQWMsR0FBRyxzQkFBUSxvQkFBSyxLQUFLM0UsVUFBVixVQUFzQixLQUFLQSxVQUFMLENBQWdCLENBQWhCLENBQXRCLEdBQVIsQ0FBdkI7QUFDQSxZQUFNNEUsU0FBUyxHQUFHLHFCQUFXLG9CQUFNLEtBQUs1RSxVQUFMLENBQWdCLENBQWhCLENBQU4sQ0FBWCxFQUFzQ1gsWUFBdEMsQ0FBbEI7QUFDQSxZQUFJd0YsVUFBSjs7QUFDQSxZQUFJO0FBQ0Y7QUFDQTtBQUNBQSxVQUFBQSxVQUFVLEdBQUcseUJBQWVELFNBQWYsRUFBMEJELGNBQTFCLENBQWI7QUFDQVAsVUFBQUEsUUFBUSxDQUFDVixJQUFULENBQWM7QUFDWmMsWUFBQUEsT0FBTyxFQUFFSyxVQUFVLENBQUNiLFFBQVgsQ0FBb0JDLFdBRGpCO0FBRVpTLFlBQUFBLFNBQVMsRUFBRSxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLENBQVY7QUFGQyxXQUFkO0FBSUEsZUFBS2pCLFlBQUwsR0FBb0IsSUFBcEI7QUFDRCxTQVRELENBU0UsT0FBT3FCLENBQVAsRUFBVTtBQUNWO0FBQ0EsZUFBS3JCLFlBQUwsR0FBb0IsS0FBcEI7QUFDRDtBQUNGO0FBQ0Y7O0FBRUQsUUFBSSxLQUFLekQsVUFBTCxDQUFnQm9DLE1BQXBCLEVBQTRCO0FBQzFCO0FBQ0ErQixNQUFBQSxJQUFJLENBQUNULElBQUwsQ0FBVTtBQUNSYyxRQUFBQSxPQUFPLEVBQUUsS0FBS1gsd0JBQUwsQ0FBOEIsS0FBSzdELFVBQUwsQ0FBZ0IsQ0FBaEIsQ0FBOUIsQ0FERDtBQUVSeUUsUUFBQUEsU0FBUyxFQUFFLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsQ0FBVixDQUZIO0FBR1JDLFFBQUFBLFNBQVMsRUFBRTFGO0FBSEgsT0FBVjtBQUtELEtBcERNLENBc0RQO0FBQ0E7QUFDQTs7O0FBQ0FtRixJQUFBQSxJQUFJLENBQUNULElBQUwsQ0FBVTtBQUFFYyxNQUFBQSxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQUQ7QUFBWCxLQUFWO0FBQ0FKLElBQUFBLFFBQVEsQ0FBQ1YsSUFBVCxDQUFjO0FBQUVjLE1BQUFBLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBRDtBQUFYLEtBQWQ7QUFFQSxXQUFPLENBQ0wsSUFBSU8sZ0NBQUosQ0FBaUI7QUFDZnBFLE1BQUFBLEVBQUUsRUFBRXJCLGFBRFc7QUFFZjZFLE1BQUFBLElBQUksRUFBSkEsSUFGZTtBQUdmYSxNQUFBQSxJQUFJLEVBQUUsS0FIUztBQUlmQyxNQUFBQSxPQUFPLEVBQUUsR0FKTTtBQUtmQyxNQUFBQSxRQUFRLEVBQUUsS0FMSztBQU1mQyxNQUFBQSxrQkFBa0IsRUFBRWpHLGtCQU5MO0FBT2ZrRyxNQUFBQSxrQkFBa0IsRUFBRWxHLGtCQVBMO0FBUWZtRyxNQUFBQSxpQkFBaUIsRUFBRSxJQVJKO0FBU2ZDLE1BQUFBLGdCQUFnQixFQUFFLDBCQUFBNUQsQ0FBQztBQUFBLGVBQUl2QyxjQUFKO0FBQUEsT0FUSjtBQVVmb0csTUFBQUEsWUFBWSxFQUFFLHNCQUFBQyxHQUFHO0FBQUEsZUFBSUEsR0FBRyxDQUFDZixTQUFKLElBQWlCLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsR0FBVixDQUFyQjtBQUFBLE9BVkY7QUFXZmdCLE1BQUFBLFlBQVksRUFBRSxzQkFBQUQsR0FBRztBQUFBLGVBQUlBLEdBQUcsQ0FBQ2QsU0FBSixJQUFpQixDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLEdBQVYsQ0FBckI7QUFBQSxPQVhGO0FBWWZnQixNQUFBQSxVQUFVLEVBQUUsb0JBQUFDLENBQUM7QUFBQSxlQUFJQSxDQUFDLENBQUNuQixPQUFOO0FBQUE7QUFaRSxLQUFqQixDQURLLEVBZUwsSUFBSU8sZ0NBQUosQ0FBaUI7QUFDZnBFLE1BQUFBLEVBQUUsRUFBRXBCLGFBRFc7QUFFZjRFLE1BQUFBLElBQUksRUFBRUMsUUFGUztBQUdmbUIsTUFBQUEsWUFBWSxFQUFFLHNCQUFBQyxHQUFHO0FBQUEsZUFBSUEsR0FBRyxDQUFDZixTQUFKLElBQWlCLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsR0FBVixDQUFyQjtBQUFBLE9BSEY7QUFJZmdCLE1BQUFBLFlBQVksRUFBRSxzQkFBQUQsR0FBRztBQUFBLGVBQUlBLEdBQUcsQ0FBQ2QsU0FBSixJQUFpQixDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLEdBQVYsQ0FBckI7QUFBQSxPQUpGO0FBS2ZNLE1BQUFBLElBQUksRUFBRSxLQUxTO0FBTWZDLE1BQUFBLE9BQU8sRUFBRSxHQU5NO0FBT2ZXLE1BQUFBLE9BQU8sRUFBRSxLQVBNO0FBUWZWLE1BQUFBLFFBQVEsRUFBRSxJQVJLO0FBU2ZRLE1BQUFBLFVBQVUsRUFBRSxvQkFBQUMsQ0FBQztBQUFBLGVBQUlBLENBQUMsQ0FBQ25CLE9BQU47QUFBQTtBQVRFLEtBQWpCLENBZkssQ0FBUDtBQTJCRDs7QUFuTzZCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcbmltcG9ydCB7IFBvbHlnb25MYXllciB9IGZyb20gJ2tlcGxlci1vdXRkYXRlZC1kZWNrLmdsLWxheWVycyc7XG5pbXBvcnQgeyBwb2ludCwgcG9seWdvbiB9IGZyb20gJ0B0dXJmL2hlbHBlcnMnO1xuaW1wb3J0IHR1cmZCYm94IGZyb20gJ0B0dXJmL2Jib3gnO1xuaW1wb3J0IHR1cmZCYm94UG9seWdvbiBmcm9tICdAdHVyZi9iYm94LXBvbHlnb24nO1xuaW1wb3J0IHR1cmZCdWZmZXIgZnJvbSAnQHR1cmYvYnVmZmVyJztcbmltcG9ydCB0dXJmRGlmZmVyZW5jZSBmcm9tICdAdHVyZi9kaWZmZXJlbmNlJztcbmltcG9ydCB0dXJmRGlzdGFuY2UgZnJvbSAnQHR1cmYvZGlzdGFuY2UnO1xuXG5jb25zdCBQT0xZR09OX0xJTkVfQ09MT1IgPSBbMCwgMjU1LCAwLCAyNTVdO1xuY29uc3QgUE9MWUdPTl9GSUxMX0NPTE9SID0gWzI1NSwgMjU1LCAyNTUsIDkwXTtcbmNvbnN0IFBPTFlHT05fTElORV9XSURUSCA9IDI7XG5jb25zdCBQT0xZR09OX0RBU0hFUyA9IFsyMCwgMjBdO1xuY29uc3QgUE9MWUdPTl9USFJFU0hPTEQgPSAwLjAxO1xuY29uc3QgRVhQQU5TSU9OX0tNID0gMTA7XG5jb25zdCBMQVlFUl9JRF9WSUVXID0gJ0RlY2tEcmF3ZXJWaWV3JztcbmNvbnN0IExBWUVSX0lEX1BJQ0sgPSAnRGVja0RyYXdlclBpY2snO1xuXG5leHBvcnQgY29uc3QgU0VMRUNUSU9OX1RZUEUgPSB7XG4gIE5PTkU6IG51bGwsXG4gIFJFQ1RBTkdMRTogJ3JlY3RhbmdsZScsXG4gIFBPTFlHT046ICdwb2x5Z29uJ1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGVja0RyYXdlciB7XG4gIG5lYnVsYTogT2JqZWN0O1xuICB1c2VQb2x5Z29uOiBib29sZWFuO1xuICB2YWxpZFBvbHlnb246IGJvb2xlYW47XG4gIGxhbmRQb2ludHM6IFtudW1iZXIsIG51bWJlcl1bXTtcbiAgbW91c2VQb2ludHM6IFtudW1iZXIsIG51bWJlcl1bXTtcblxuICBjb25zdHJ1Y3RvcihuZWJ1bGE6IE9iamVjdCkge1xuICAgIHRoaXMubmVidWxhID0gbmVidWxhO1xuICAgIHRoaXMudXNlUG9seWdvbiA9IGZhbHNlO1xuICAgIHRoaXMubGFuZFBvaW50cyA9IFtdO1xuICAgIHRoaXMubW91c2VQb2ludHMgPSBbXTtcbiAgfVxuXG4gIF9nZXRMYXllcklkcygpIHtcbiAgICAvLyBUT0RPOiBzb3J0IGJ5IG1vdXNlIHByaW9yaXR5XG4gICAgcmV0dXJuIHRoaXMubmVidWxhLmRlY2tnbC5wcm9wcy5sYXllcnNcbiAgICAgIC5maWx0ZXIobCA9PiBsICYmIGwucHJvcHMgJiYgbC5wcm9wcy5uZWJ1bGFMYXllciAmJiBsLnByb3BzLm5lYnVsYUxheWVyLmVuYWJsZVNlbGVjdGlvbilcbiAgICAgIC5tYXAobCA9PiBsLmlkKTtcbiAgfVxuXG4gIF9zZWxlY3RGcm9tUGlja2luZ0luZm9zKHBpY2tpbmdJbmZvczogT2JqZWN0W10pIHtcbiAgICBjb25zdCBvYmplY3RzID0gcGlja2luZ0luZm9zLm1hcChcbiAgICAgICh7IGxheWVyLCBpbmRleCwgb2JqZWN0IH0pID0+XG4gICAgICAgIG9iamVjdC5vcmlnaW5hbCB8fCBsYXllci5wcm9wcy5uZWJ1bGFMYXllci5kZWNrQ2FjaGUub3JpZ2luYWxzW2luZGV4XVxuICAgICk7XG4gICAgdGhpcy5uZWJ1bGEucHJvcHMub25TZWxlY3Rpb24ob2JqZWN0cyk7XG4gIH1cblxuICBfZ2V0Qm91bmRpbmdCb3goKTogT2JqZWN0IHtcbiAgICBjb25zdCB7IG1vdXNlUG9pbnRzIH0gPSB0aGlzO1xuICAgIGNvbnN0IGFsbFggPSBtb3VzZVBvaW50cy5tYXAobW91c2VQb2ludCA9PiBtb3VzZVBvaW50WzBdKTtcbiAgICBjb25zdCBhbGxZID0gbW91c2VQb2ludHMubWFwKG1vdXNlUG9pbnQgPT4gbW91c2VQb2ludFsxXSk7XG4gICAgY29uc3QgeCA9IE1hdGgubWluKC4uLmFsbFgpO1xuICAgIGNvbnN0IHkgPSBNYXRoLm1pbiguLi5hbGxZKTtcbiAgICBjb25zdCBtYXhYID0gTWF0aC5tYXgoLi4uYWxsWCk7XG4gICAgY29uc3QgbWF4WSA9IE1hdGgubWF4KC4uLmFsbFkpO1xuXG4gICAgcmV0dXJuIHsgeCwgeSwgd2lkdGg6IG1heFggLSB4LCBoZWlnaHQ6IG1heFkgLSB5IH07XG4gIH1cblxuICBfc2VsZWN0UmVjdGFuZ2xlT2JqZWN0cygpIHtcbiAgICBpZiAodGhpcy5sYW5kUG9pbnRzLmxlbmd0aCAhPT0gMikgcmV0dXJuO1xuXG4gICAgY29uc3QgW3gxLCB5MV0gPSB0aGlzLm1vdXNlUG9pbnRzWzBdO1xuICAgIGNvbnN0IFt4MiwgeTJdID0gdGhpcy5tb3VzZVBvaW50c1sxXTtcbiAgICBjb25zdCBwaWNraW5nSW5mb3MgPSB0aGlzLm5lYnVsYS5kZWNrZ2wucGlja09iamVjdHMoe1xuICAgICAgeDogTWF0aC5taW4oeDEsIHgyKSxcbiAgICAgIHk6IE1hdGgubWluKHkxLCB5MiksXG4gICAgICB3aWR0aDogTWF0aC5hYnMoeDIgLSB4MSksXG4gICAgICBoZWlnaHQ6IE1hdGguYWJzKHkyIC0geTEpLFxuICAgICAgbGF5ZXJJZHM6IHRoaXMuX2dldExheWVySWRzKClcbiAgICB9KTtcblxuICAgIHRoaXMuX3NlbGVjdEZyb21QaWNraW5nSW5mb3MocGlja2luZ0luZm9zKTtcbiAgfVxuXG4gIF9zZWxlY3RQb2x5Z29uT2JqZWN0cygpIHtcbiAgICBjb25zdCBwaWNraW5nSW5mb3MgPSB0aGlzLm5lYnVsYS5kZWNrZ2wucGlja09iamVjdHMoe1xuICAgICAgLi4udGhpcy5fZ2V0Qm91bmRpbmdCb3goKSxcbiAgICAgIGxheWVySWRzOiBbTEFZRVJfSURfUElDSywgLi4udGhpcy5fZ2V0TGF5ZXJJZHMoKV1cbiAgICB9KTtcblxuICAgIHRoaXMuX3NlbGVjdEZyb21QaWNraW5nSW5mb3MocGlja2luZ0luZm9zLmZpbHRlcihpdGVtID0+IGl0ZW0ubGF5ZXIuaWQgIT09IExBWUVSX0lEX1BJQ0spKTtcbiAgfVxuXG4gIF9nZXRNb3VzZVBvc0Zyb21FdmVudChldmVudDogT2JqZWN0KTogW251bWJlciwgbnVtYmVyXSB7XG4gICAgY29uc3QgeyBvZmZzZXRYLCBvZmZzZXRZIH0gPSBldmVudDtcbiAgICByZXR1cm4gW29mZnNldFgsIG9mZnNldFldO1xuICB9XG5cbiAgaGFuZGxlRXZlbnQoXG4gICAgZXZlbnQ6IE9iamVjdCxcbiAgICBsbmdMYXQ6IFtudW1iZXIsIG51bWJlcl0sXG4gICAgc2VsZWN0aW9uVHlwZTogbnVtYmVyXG4gICk6IHsgcmVkcmF3OiBib29sZWFuLCBkZWFjdGl2YXRlOiBib29sZWFuIH0ge1xuICAgIC8vIGNhcHR1cmUgYWxsIGV2ZW50cyAobW91c2UtdXAgaXMgbmVlZGVkIHRvIHByZXZlbnQgdXMgc3R1Y2sgaW4gbW92aW5nIG1hcClcbiAgICBpZiAoZXZlbnQudHlwZSAhPT0gJ21vdXNldXAnKSBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgIHRoaXMudXNlUG9seWdvbiA9IHNlbGVjdGlvblR5cGUgPT09IFNFTEVDVElPTl9UWVBFLlBPTFlHT047XG5cbiAgICBsZXQgcmVkcmF3ID0gZmFsc2U7XG4gICAgbGV0IGRlYWN0aXZhdGUgPSBmYWxzZTtcblxuICAgIGNvbnN0IHsgdXNlUG9seWdvbiwgbGFuZFBvaW50cywgbW91c2VQb2ludHMgfSA9IHRoaXM7XG5cbiAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ21vdXNlZG93bicpIHtcbiAgICAgIGlmICh1c2VQb2x5Z29uICYmIGxhbmRQb2ludHMubGVuZ3RoKSB7XG4gICAgICAgIC8vIGlmIGxhbmRQb2ludHMubGVuZ3RoIGlzIHplcm8gd2Ugd2FudCB0byBpbnNlcnQgdHdvIHBvaW50cyAoc28gd2UgbGV0IGl0IHJ1biB0aGUgZWxzZSlcbiAgICAgICAgLy8gYWxzbyBkb24ndCBpbnNlcnQgaWYgcG9seWdvbiBpcyBpbnZhbGlkXG4gICAgICAgIGlmICh0aGlzLmxhbmRQb2ludHMubGVuZ3RoIDwgMyB8fCB0aGlzLnZhbGlkUG9seWdvbikge1xuICAgICAgICAgIGxhbmRQb2ludHMucHVzaChsbmdMYXQpO1xuICAgICAgICAgIG1vdXNlUG9pbnRzLnB1c2godGhpcy5fZ2V0TW91c2VQb3NGcm9tRXZlbnQoZXZlbnQpKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5sYW5kUG9pbnRzID0gW2xuZ0xhdCwgbG5nTGF0XTtcbiAgICAgICAgY29uc3QgbSA9IHRoaXMuX2dldE1vdXNlUG9zRnJvbUV2ZW50KGV2ZW50KTtcbiAgICAgICAgdGhpcy5tb3VzZVBvaW50cyA9IFttLCBtXTtcbiAgICAgIH1cbiAgICAgIHJlZHJhdyA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChldmVudC50eXBlID09PSAnbW91c2Vtb3ZlJyAmJiBsYW5kUG9pbnRzLmxlbmd0aCkge1xuICAgICAgLy8gdXBkYXRlIGxhc3QgcG9pbnRcbiAgICAgIGxhbmRQb2ludHNbbGFuZFBvaW50cy5sZW5ndGggLSAxXSA9IGxuZ0xhdDtcbiAgICAgIG1vdXNlUG9pbnRzW21vdXNlUG9pbnRzLmxlbmd0aCAtIDFdID0gdGhpcy5fZ2V0TW91c2VQb3NGcm9tRXZlbnQoZXZlbnQpO1xuICAgICAgcmVkcmF3ID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKGV2ZW50LnR5cGUgPT09ICdtb3VzZXVwJykge1xuICAgICAgaWYgKHVzZVBvbHlnb24pIHtcbiAgICAgICAgLy8gY2hlY2sgdG8gc2VlIGlmIGNvbXBsZXRlZFxuICAgICAgICAvLyBUT0RPOiBNYXliZSBkb3VibGUtY2xpY2sgdG8gZmluaXNoP1xuICAgICAgICBpZiAoXG4gICAgICAgICAgbGFuZFBvaW50cy5sZW5ndGggPiA0ICYmXG4gICAgICAgICAgdHVyZkRpc3RhbmNlKGxhbmRQb2ludHNbMF0sIGxhbmRQb2ludHNbbGFuZFBvaW50cy5sZW5ndGggLSAxXSkgPCBQT0xZR09OX1RIUkVTSE9MRCAmJlxuICAgICAgICAgIHRoaXMudmFsaWRQb2x5Z29uXG4gICAgICAgICkge1xuICAgICAgICAgIHRoaXMuX3NlbGVjdFBvbHlnb25PYmplY3RzKCk7XG4gICAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICAgIHJlZHJhdyA9IHRydWU7XG4gICAgICAgICAgZGVhY3RpdmF0ZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3NlbGVjdFJlY3RhbmdsZU9iamVjdHMoKTtcbiAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICByZWRyYXcgPSB0cnVlO1xuICAgICAgICBkZWFjdGl2YXRlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4geyByZWRyYXcsIGRlYWN0aXZhdGUgfTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMubGFuZFBvaW50cyA9IFtdO1xuICAgIHRoaXMubW91c2VQb2ludHMgPSBbXTtcbiAgfVxuXG4gIF9tYWtlU3RhcnRQb2ludEhpZ2hsaWdodChjZW50ZXI6IFtudW1iZXIsIG51bWJlcl0pOiBudW1iZXJbXSB7XG4gICAgY29uc3QgYnVmZmVyID0gdHVyZkJ1ZmZlcihwb2ludChjZW50ZXIpLCBQT0xZR09OX1RIUkVTSE9MRCAvIDQuMCk7XG4gICAgcmV0dXJuIHR1cmZCYm94UG9seWdvbih0dXJmQmJveChidWZmZXIpKS5nZW9tZXRyeS5jb29yZGluYXRlcztcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBkYXRhID0gW107XG4gICAgY29uc3QgZGF0YVBpY2sgPSBbXTtcblxuICAgIGlmICghdGhpcy51c2VQb2x5Z29uICYmIHRoaXMubGFuZFBvaW50cy5sZW5ndGggPT09IDIpIHtcbiAgICAgIC8vIFVzZSBtb3VzZSBwb2ludHMgaW5zdGVhZCBvZiBsYW5kIHBvaW50cyBzbyB3ZSBnZXQgdGhlIHJpZ2h0IHNoYXBlXG4gICAgICAvLyBubyBtYXR0ZXIgd2hhdCBiZWFyaW5nIGlzLlxuICAgICAgY29uc3QgW1t4MSwgeTFdLCBbeDIsIHkyXV0gPSB0aGlzLm1vdXNlUG9pbnRzO1xuICAgICAgY29uc3Qgc2VsUG9seWdvbiA9IFtbeDEsIHkxXSwgW3gxLCB5Ml0sIFt4MiwgeTJdLCBbeDIsIHkxXSwgW3gxLCB5MV1dLm1hcChtb3VzZVBvcyA9PlxuICAgICAgICB0aGlzLm5lYnVsYS51bnByb2plY3RNb3VzZVBvc2l0aW9uKG1vdXNlUG9zKVxuICAgICAgKTtcbiAgICAgIGRhdGEucHVzaCh7XG4gICAgICAgIHBvbHlnb246IHNlbFBvbHlnb24sXG4gICAgICAgIGxpbmVDb2xvcjogUE9MWUdPTl9MSU5FX0NPTE9SLFxuICAgICAgICBmaWxsQ29sb3I6IFBPTFlHT05fRklMTF9DT0xPUlxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnVzZVBvbHlnb24gJiYgdGhpcy5sYW5kUG9pbnRzLmxlbmd0aCkge1xuICAgICAgZGF0YS5wdXNoKHtcbiAgICAgICAgcG9seWdvbjogdGhpcy5sYW5kUG9pbnRzLFxuICAgICAgICBsaW5lQ29sb3I6IFBPTFlHT05fTElORV9DT0xPUixcbiAgICAgICAgZmlsbENvbG9yOiBQT0xZR09OX0ZJTExfQ09MT1JcbiAgICAgIH0pO1xuXG4gICAgICAvLyBIYWNrOiB1c2UgYSBwb2x5Z29uIHRvIGhpZGUgdGhlIG91dHNpZGUsIGJlY2F1c2UgcGlja09iamVjdHMoKVxuICAgICAgLy8gZG9lcyBub3Qgc3VwcG9ydCBwb2x5Z29uc1xuICAgICAgaWYgKHRoaXMubGFuZFBvaW50cy5sZW5ndGggPj0gMykge1xuICAgICAgICBjb25zdCBsYW5kUG9pbnRzUG9seSA9IHBvbHlnb24oW1suLi50aGlzLmxhbmRQb2ludHMsIHRoaXMubGFuZFBvaW50c1swXV1dKTtcbiAgICAgICAgY29uc3QgYmlnQnVmZmVyID0gdHVyZkJ1ZmZlcihwb2ludCh0aGlzLmxhbmRQb2ludHNbMF0pLCBFWFBBTlNJT05fS00pO1xuICAgICAgICBsZXQgYmlnUG9seWdvbjtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyB0dXJmRGlmZmVyZW5jZSB0aHJvd3MgYW4gZXhjZXB0aW9uIGlmIHRoZSBwb2x5Z29uXG4gICAgICAgICAgLy8gaW50ZXJzZWN0cyB3aXRoIGl0c2VsZlxuICAgICAgICAgIGJpZ1BvbHlnb24gPSB0dXJmRGlmZmVyZW5jZShiaWdCdWZmZXIsIGxhbmRQb2ludHNQb2x5KTtcbiAgICAgICAgICBkYXRhUGljay5wdXNoKHtcbiAgICAgICAgICAgIHBvbHlnb246IGJpZ1BvbHlnb24uZ2VvbWV0cnkuY29vcmRpbmF0ZXMsXG4gICAgICAgICAgICBmaWxsQ29sb3I6IFswLCAwLCAwLCAxXVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMudmFsaWRQb2x5Z29uID0gdHJ1ZTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIC8vIGludmFsaWQgc2VsZWN0aW9uIHBvbHlnb25cbiAgICAgICAgICB0aGlzLnZhbGlkUG9seWdvbiA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubGFuZFBvaW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGhpZ2hsaWdodCBzdGFydCBwb2ludFxuICAgICAgZGF0YS5wdXNoKHtcbiAgICAgICAgcG9seWdvbjogdGhpcy5fbWFrZVN0YXJ0UG9pbnRIaWdobGlnaHQodGhpcy5sYW5kUG9pbnRzWzBdKSxcbiAgICAgICAgbGluZUNvbG9yOiBbMCwgMCwgMCwgMF0sXG4gICAgICAgIGZpbGxDb2xvcjogUE9MWUdPTl9MSU5FX0NPTE9SXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBIYWNrIHRvIG1ha2UgdGhlIFBvbHlnb25MYXllcigpIHN0YXkgYWN0aXZlLFxuICAgIC8vIG90aGVyd2lzZSBpdCB0YWtlcyAzIHNlY29uZHMgKCEpIHRvIGluaXQhXG4gICAgLy8gVE9ETzogZml4IHRoaXNcbiAgICBkYXRhLnB1c2goeyBwb2x5Z29uOiBbWzAsIDBdXSB9KTtcbiAgICBkYXRhUGljay5wdXNoKHsgcG9seWdvbjogW1swLCAwXV0gfSk7XG5cbiAgICByZXR1cm4gW1xuICAgICAgbmV3IFBvbHlnb25MYXllcih7XG4gICAgICAgIGlkOiBMQVlFUl9JRF9WSUVXLFxuICAgICAgICBkYXRhLFxuICAgICAgICBmcDY0OiBmYWxzZSxcbiAgICAgICAgb3BhY2l0eTogMS4wLFxuICAgICAgICBwaWNrYWJsZTogZmFsc2UsXG4gICAgICAgIGxpbmVXaWR0aE1pblBpeGVsczogUE9MWUdPTl9MSU5FX1dJRFRILFxuICAgICAgICBsaW5lV2lkdGhNYXhQaXhlbHM6IFBPTFlHT05fTElORV9XSURUSCxcbiAgICAgICAgbGluZURhc2hKdXN0aWZpZWQ6IHRydWUsXG4gICAgICAgIGdldExpbmVEYXNoQXJyYXk6IHggPT4gUE9MWUdPTl9EQVNIRVMsXG4gICAgICAgIGdldExpbmVDb2xvcjogb2JqID0+IG9iai5saW5lQ29sb3IgfHwgWzAsIDAsIDAsIDI1NV0sXG4gICAgICAgIGdldEZpbGxDb2xvcjogb2JqID0+IG9iai5maWxsQ29sb3IgfHwgWzAsIDAsIDAsIDI1NV0sXG4gICAgICAgIGdldFBvbHlnb246IG8gPT4gby5wb2x5Z29uXG4gICAgICB9KSxcbiAgICAgIG5ldyBQb2x5Z29uTGF5ZXIoe1xuICAgICAgICBpZDogTEFZRVJfSURfUElDSyxcbiAgICAgICAgZGF0YTogZGF0YVBpY2ssXG4gICAgICAgIGdldExpbmVDb2xvcjogb2JqID0+IG9iai5saW5lQ29sb3IgfHwgWzAsIDAsIDAsIDI1NV0sXG4gICAgICAgIGdldEZpbGxDb2xvcjogb2JqID0+IG9iai5maWxsQ29sb3IgfHwgWzAsIDAsIDAsIDI1NV0sXG4gICAgICAgIGZwNjQ6IGZhbHNlLFxuICAgICAgICBvcGFjaXR5OiAxLjAsXG4gICAgICAgIHN0cm9rZWQ6IGZhbHNlLFxuICAgICAgICBwaWNrYWJsZTogdHJ1ZSxcbiAgICAgICAgZ2V0UG9seWdvbjogbyA9PiBvLnBvbHlnb25cbiAgICAgIH0pXG4gICAgXTtcbiAgfVxufVxuIl19