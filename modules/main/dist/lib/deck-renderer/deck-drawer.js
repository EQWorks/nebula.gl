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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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

var DeckDrawer =
/*#__PURE__*/
function () {
  function DeckDrawer(nebula) {
    _classCallCheck(this, DeckDrawer);

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

  _createClass(DeckDrawer, [{
    key: "_getLayerIds",
    value: function _getLayerIds() {
      // TODO: sort by mouse priority
      return this.nebula.deckgl.props.layers.filter(function (l) {
        return l && l.props && l.props.nebulaLayer && l.props.nebulaLayer.enableSelection;
      }).map(function (l) {
        return l.id;
      });
    }
  }, {
    key: "_selectFromPickingInfos",
    value: function _selectFromPickingInfos(pickingInfos) {
      var objects = pickingInfos.map(function (_ref) {
        var layer = _ref.layer,
            index = _ref.index,
            object = _ref.object;
        return object.original || layer.props.nebulaLayer.deckCache.originals[index];
      });
      this.nebula.props.onSelection(objects);
    }
  }, {
    key: "_getBoundingBox",
    value: function _getBoundingBox() {
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
  }, {
    key: "_selectRectangleObjects",
    value: function _selectRectangleObjects() {
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
  }, {
    key: "_selectPolygonObjects",
    value: function _selectPolygonObjects() {
      var pickingInfos = this.nebula.deckgl.pickObjects(_objectSpread({}, this._getBoundingBox(), {
        layerIds: [LAYER_ID_PICK].concat(_toConsumableArray(this._getLayerIds()))
      }));

      this._selectFromPickingInfos(pickingInfos.filter(function (item) {
        return item.layer.id !== LAYER_ID_PICK;
      }));
    }
  }, {
    key: "_getMousePosFromEvent",
    value: function _getMousePosFromEvent(event) {
      var offsetX = event.offsetX,
          offsetY = event.offsetY;
      return [offsetX, offsetY];
    }
  }, {
    key: "handleEvent",
    value: function handleEvent(event, lngLat, selectionType) {
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
  }, {
    key: "reset",
    value: function reset() {
      this.landPoints = [];
      this.mousePoints = [];
    }
  }, {
    key: "_makeStartPointHighlight",
    value: function _makeStartPointHighlight(center) {
      var buffer = (0, _buffer.default)((0, _helpers.point)(center), POLYGON_THRESHOLD / 4.0);
      return (0, _bboxPolygon.default)((0, _bbox.default)(buffer)).geometry.coordinates;
    }
  }, {
    key: "render",
    value: function render() {
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
  }]);

  return DeckDrawer;
}();

exports.default = DeckDrawer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvZGVjay1yZW5kZXJlci9kZWNrLWRyYXdlci5qcyJdLCJuYW1lcyI6WyJQT0xZR09OX0xJTkVfQ09MT1IiLCJQT0xZR09OX0ZJTExfQ09MT1IiLCJQT0xZR09OX0xJTkVfV0lEVEgiLCJQT0xZR09OX0RBU0hFUyIsIlBPTFlHT05fVEhSRVNIT0xEIiwiRVhQQU5TSU9OX0tNIiwiTEFZRVJfSURfVklFVyIsIkxBWUVSX0lEX1BJQ0siLCJTRUxFQ1RJT05fVFlQRSIsIk5PTkUiLCJSRUNUQU5HTEUiLCJQT0xZR09OIiwiRGVja0RyYXdlciIsIm5lYnVsYSIsInVzZVBvbHlnb24iLCJsYW5kUG9pbnRzIiwibW91c2VQb2ludHMiLCJkZWNrZ2wiLCJwcm9wcyIsImxheWVycyIsImZpbHRlciIsImwiLCJuZWJ1bGFMYXllciIsImVuYWJsZVNlbGVjdGlvbiIsIm1hcCIsImlkIiwicGlja2luZ0luZm9zIiwib2JqZWN0cyIsImxheWVyIiwiaW5kZXgiLCJvYmplY3QiLCJvcmlnaW5hbCIsImRlY2tDYWNoZSIsIm9yaWdpbmFscyIsIm9uU2VsZWN0aW9uIiwiYWxsWCIsIm1vdXNlUG9pbnQiLCJhbGxZIiwieCIsIk1hdGgiLCJtaW4iLCJ5IiwibWF4WCIsIm1heCIsIm1heFkiLCJ3aWR0aCIsImhlaWdodCIsImxlbmd0aCIsIngxIiwieTEiLCJ4MiIsInkyIiwicGlja09iamVjdHMiLCJhYnMiLCJsYXllcklkcyIsIl9nZXRMYXllcklkcyIsIl9zZWxlY3RGcm9tUGlja2luZ0luZm9zIiwiX2dldEJvdW5kaW5nQm94IiwiaXRlbSIsImV2ZW50Iiwib2Zmc2V0WCIsIm9mZnNldFkiLCJsbmdMYXQiLCJzZWxlY3Rpb25UeXBlIiwidHlwZSIsInN0b3BQcm9wYWdhdGlvbiIsInJlZHJhdyIsImRlYWN0aXZhdGUiLCJ2YWxpZFBvbHlnb24iLCJwdXNoIiwiX2dldE1vdXNlUG9zRnJvbUV2ZW50IiwibSIsIl9zZWxlY3RQb2x5Z29uT2JqZWN0cyIsInJlc2V0IiwiX3NlbGVjdFJlY3RhbmdsZU9iamVjdHMiLCJjZW50ZXIiLCJidWZmZXIiLCJnZW9tZXRyeSIsImNvb3JkaW5hdGVzIiwiZGF0YSIsImRhdGFQaWNrIiwic2VsUG9seWdvbiIsIm1vdXNlUG9zIiwidW5wcm9qZWN0TW91c2VQb3NpdGlvbiIsInBvbHlnb24iLCJsaW5lQ29sb3IiLCJmaWxsQ29sb3IiLCJsYW5kUG9pbnRzUG9seSIsImJpZ0J1ZmZlciIsImJpZ1BvbHlnb24iLCJlIiwiX21ha2VTdGFydFBvaW50SGlnaGxpZ2h0IiwiUG9seWdvbkxheWVyIiwiZnA2NCIsIm9wYWNpdHkiLCJwaWNrYWJsZSIsImxpbmVXaWR0aE1pblBpeGVscyIsImxpbmVXaWR0aE1heFBpeGVscyIsImxpbmVEYXNoSnVzdGlmaWVkIiwiZ2V0TGluZURhc2hBcnJheSIsImdldExpbmVDb2xvciIsIm9iaiIsImdldEZpbGxDb2xvciIsImdldFBvbHlnb24iLCJvIiwic3Ryb2tlZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxrQkFBa0IsR0FBRyxDQUFDLENBQUQsRUFBSSxHQUFKLEVBQVMsQ0FBVCxFQUFZLEdBQVosQ0FBM0I7QUFDQSxJQUFNQyxrQkFBa0IsR0FBRyxDQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsR0FBWCxFQUFnQixFQUFoQixDQUEzQjtBQUNBLElBQU1DLGtCQUFrQixHQUFHLENBQTNCO0FBQ0EsSUFBTUMsY0FBYyxHQUFHLENBQUMsRUFBRCxFQUFLLEVBQUwsQ0FBdkI7QUFDQSxJQUFNQyxpQkFBaUIsR0FBRyxJQUExQjtBQUNBLElBQU1DLFlBQVksR0FBRyxFQUFyQjtBQUNBLElBQU1DLGFBQWEsR0FBRyxnQkFBdEI7QUFDQSxJQUFNQyxhQUFhLEdBQUcsZ0JBQXRCO0FBRU8sSUFBTUMsY0FBYyxHQUFHO0FBQzVCQyxFQUFBQSxJQUFJLEVB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USwrQkFBSixDQUFpQjtBQUNmbkUsUUFBQUEsRUFBRSxFQUFFbEIsYUFEVztBQUVmd0UsUUFBQUEsSUFBSSxFQUFFQyxRQUZTO0FBR2ZvQixRQUFBQSxZQUFZLEVBQUUsc0JBQUFDLEdBQUc7QUFBQSxpQkFBSUEsR0FBRyxDQUFDaEIsU0FBSixJQUFpQixDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLEdBQVYsQ0FBckI7QUFBQSxTQUhGO0FBSWZpQixRQUFBQSxZQUFZLEVBQUUsc0JBQUFELEdBQUc7QUFBQSxpQkFBSUEsR0FBRyxDQUFDZixTQUFKLElBQWlCLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsR0FBVixDQUFyQjtBQUFBLFNBSkY7QUFLZk8sUUFBQUEsSUFBSSxFQUFFLEtBTFM7QUFNZkMsUUFBQUEsT0FBTyxFQUFFLEdBTk07QUFPZlcsUUFBQUEsT0FBTyxFQUFFLEtBUE07QUFRZlYsUUFBQUEsUUFBUSxFQUFFLElBUks7QUFTZlEsUUFBQUEsVUFBVSxFQUFFLG9CQUFBQyxDQUFDO0FBQUEsaUJBQUlBLENBQUMsQ0FBQ3BCLE9BQU47QUFBQTtBQVRFLE9BQWpCLENBZkssQ0FBUDtBQTJCRCIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5pbXBvcnQgeyBQb2x5Z29uTGF5ZXIgfSBmcm9tICdrZXBsZXItb3VkYXRlZC1kZWNrLmdsLWxheWVycyc7XG5pbXBvcnQgeyBwb2ludCwgcG9seWdvbiB9IGZyb20gJ0B0dXJmL2hlbHBlcnMnO1xuaW1wb3J0IHR1cmZCYm94IGZyb20gJ0B0dXJmL2Jib3gnO1xuaW1wb3J0IHR1cmZCYm94UG9seWdvbiBmcm9tICdAdHVyZi9iYm94LXBvbHlnb24nO1xuaW1wb3J0IHR1cmZCdWZmZXIgZnJvbSAnQHR1cmYvYnVmZmVyJztcbmltcG9ydCB0dXJmRGlmZmVyZW5jZSBmcm9tICdAdHVyZi9kaWZmZXJlbmNlJztcbmltcG9ydCB0dXJmRGlzdGFuY2UgZnJvbSAnQHR1cmYvZGlzdGFuY2UnO1xuXG5jb25zdCBQT0xZR09OX0xJTkVfQ09MT1IgPSBbMCwgMjU1LCAwLCAyNTVdO1xuY29uc3QgUE9MWUdPTl9GSUxMX0NPTE9SID0gWzI1NSwgMjU1LCAyNTUsIDkwXTtcbmNvbnN0IFBPTFlHT05fTElORV9XSURUSCA9IDI7XG5jb25zdCBQT0xZR09OX0RBU0hFUyA9IFsyMCwgMjBdO1xuY29uc3QgUE9MWUdPTl9USFJFU0hPTEQgPSAwLjAxO1xuY29uc3QgRVhQQU5TSU9OX0tNID0gMTA7XG5jb25zdCBMQVlFUl9JRF9WSUVXID0gJ0RlY2tEcmF3ZXJWaWV3JztcbmNvbnN0IExBWUVSX0lEX1BJQ0sgPSAnRGVja0RyYXdlclBpY2snO1xuXG5leHBvcnQgY29uc3QgU0VMRUNUSU9OX1RZUEUgPSB7XG4gIE5PTkU6IG51bGwsXG4gIFJFQ1RBTkdMRTogJ3JlY3RhbmdsZScsXG4gIFBPTFlHT046ICdwb2x5Z29uJ1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGVja0RyYXdlciB7XG4gIG5lYnVsYTogT2JqZWN0O1xuICB1c2VQb2x5Z29uOiBib29sZWFuO1xuICB2YWxpZFBvbHlnb246IGJvb2xlYW47XG4gIGxhbmRQb2ludHM6IFtudW1iZXIsIG51bWJlcl1bXTtcbiAgbW91c2VQb2ludHM6IFtudW1iZXIsIG51bWJlcl1bXTtcblxuICBjb25zdHJ1Y3RvcihuZWJ1bGE6IE9iamVjdCkge1xuICAgIHRoaXMubmVidWxhID0gbmVidWxhO1xuICAgIHRoaXMudXNlUG9seWdvbiA9IGZhbHNlO1xuICAgIHRoaXMubGFuZFBvaW50cyA9IFtdO1xuICAgIHRoaXMubW91c2VQb2ludHMgPSBbXTtcbiAgfVxuXG4gIF9nZXRMYXllcklkcygpIHtcbiAgICAvLyBUT0RPOiBzb3J0IGJ5IG1vdXNlIHByaW9yaXR5XG4gICAgcmV0dXJuIHRoaXMubmVidWxhLmRlY2tnbC5wcm9wcy5sYXllcnNcbiAgICAgIC5maWx0ZXIobCA9PiBsICYmIGwucHJvcHMgJiYgbC5wcm9wcy5uZWJ1bGFMYXllciAmJiBsLnByb3BzLm5lYnVsYUxheWVyLmVuYWJsZVNlbGVjdGlvbilcbiAgICAgIC5tYXAobCA9PiBsLmlkKTtcbiAgfVxuXG4gIF9zZWxlY3RGcm9tUGlja2luZ0luZm9zKHBpY2tpbmdJbmZvczogT2JqZWN0W10pIHtcbiAgICBjb25zdCBvYmplY3RzID0gcGlja2luZ0luZm9zLm1hcChcbiAgICAgICh7IGxheWVyLCBpbmRleCwgb2JqZWN0IH0pID0+XG4gICAgICAgIG9iamVjdC5vcmlnaW5hbCB8fCBsYXllci5wcm9wcy5uZWJ1bGFMYXllci5kZWNrQ2FjaGUub3JpZ2luYWxzW2luZGV4XVxuICAgICk7XG4gICAgdGhpcy5uZWJ1bGEucHJvcHMub25TZWxlY3Rpb24ob2JqZWN0cyk7XG4gIH1cblxuICBfZ2V0Qm91bmRpbmdCb3goKTogT2JqZWN0IHtcbiAgICBjb25zdCB7IG1vdXNlUG9pbnRzIH0gPSB0aGlzO1xuICAgIGNvbnN0IGFsbFggPSBtb3VzZVBvaW50cy5tYXAobW91c2VQb2ludCA9PiBtb3VzZVBvaW50WzBdKTtcbiAgICBjb25zdCBhbGxZID0gbW91c2VQb2ludHMubWFwKG1vdXNlUG9pbnQgPT4gbW91c2VQb2ludFsxXSk7XG4gICAgY29uc3QgeCA9IE1hdGgubWluKC4uLmFsbFgpO1xuICAgIGNvbnN0IHkgPSBNYXRoLm1pbiguLi5hbGxZKTtcbiAgICBjb25zdCBtYXhYID0gTWF0aC5tYXgoLi4uYWxsWCk7XG4gICAgY29uc3QgbWF4WSA9IE1hdGgubWF4KC4uLmFsbFkpO1xuXG4gICAgcmV0dXJuIHsgeCwgeSwgd2lkdGg6IG1heFggLSB4LCBoZWlnaHQ6IG1heFkgLSB5IH07XG4gIH1cblxuICBfc2VsZWN0UmVjdGFuZ2xlT2JqZWN0cygpIHtcbiAgICBpZiAodGhpcy5sYW5kUG9pbnRzLmxlbmd0aCAhPT0gMikgcmV0dXJuO1xuXG4gICAgY29uc3QgW3gxLCB5MV0gPSB0aGlzLm1vdXNlUG9pbnRzWzBdO1xuICAgIGNvbnN0IFt4MiwgeTJdID0gdGhpcy5tb3VzZVBvaW50c1sxXTtcbiAgICBjb25zdCBwaWNraW5nSW5mb3MgPSB0aGlzLm5lYnVsYS5kZWNrZ2wucGlja09iamVjdHMoe1xuICAgICAgeDogTWF0aC5taW4oeDEsIHgyKSxcbiAgICAgIHk6IE1hdGgubWluKHkxLCB5MiksXG4gICAgICB3aWR0aDogTWF0aC5hYnMoeDIgLSB4MSksXG4gICAgICBoZWlnaHQ6IE1hdGguYWJzKHkyIC0geTEpLFxuICAgICAgbGF5ZXJJZHM6IHRoaXMuX2dldExheWVySWRzKClcbiAgICB9KTtcblxuICAgIHRoaXMuX3NlbGVjdEZyb21QaWNraW5nSW5mb3MocGlja2luZ0luZm9zKTtcbiAgfVxuXG4gIF9zZWxlY3RQb2x5Z29uT2JqZWN0cygpIHtcbiAgICBjb25zdCBwaWNraW5nSW5mb3MgPSB0aGlzLm5lYnVsYS5kZWNrZ2wucGlja09iamVjdHMoe1xuICAgICAgLi4udGhpcy5fZ2V0Qm91bmRpbmdCb3goKSxcbiAgICAgIGxheWVySWRzOiBbTEFZRVJfSURfUElDSywgLi4udGhpcy5fZ2V0TGF5ZXJJZHMoKV1cbiAgICB9KTtcblxuICAgIHRoaXMuX3NlbGVjdEZyb21QaWNraW5nSW5mb3MocGlja2luZ0luZm9zLmZpbHRlcihpdGVtID0+IGl0ZW0ubGF5ZXIuaWQgIT09IExBWUVSX0lEX1BJQ0spKTtcbiAgfVxuXG4gIF9nZXRNb3VzZVBvc0Zyb21FdmVudChldmVudDogT2JqZWN0KTogW251bWJlciwgbnVtYmVyXSB7XG4gICAgY29uc3QgeyBvZmZzZXRYLCBvZmZzZXRZIH0gPSBldmVudDtcbiAgICByZXR1cm4gW29mZnNldFgsIG9mZnNldFldO1xuICB9XG5cbiAgaGFuZGxlRXZlbnQoXG4gICAgZXZlbnQ6IE9iamVjdCxcbiAgICBsbmdMYXQ6IFtudW1iZXIsIG51bWJlcl0sXG4gICAgc2VsZWN0aW9uVHlwZTogbnVtYmVyXG4gICk6IHsgcmVkcmF3OiBib29sZWFuLCBkZWFjdGl2YXRlOiBib29sZWFuIH0ge1xuICAgIC8vIGNhcHR1cmUgYWxsIGV2ZW50cyAobW91c2UtdXAgaXMgbmVlZGVkIHRvIHByZXZlbnQgdXMgc3R1Y2sgaW4gbW92aW5nIG1hcClcbiAgICBpZiAoZXZlbnQudHlwZSAhPT0gJ21vdXNldXAnKSBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgIHRoaXMudXNlUG9seWdvbiA9IHNlbGVjdGlvblR5cGUgPT09IFNFTEVDVElPTl9UWVBFLlBPTFlHT047XG5cbiAgICBsZXQgcmVkcmF3ID0gZmFsc2U7XG4gICAgbGV0IGRlYWN0aXZhdGUgPSBmYWxzZTtcblxuICAgIGNvbnN0IHsgdXNlUG9seWdvbiwgbGFuZFBvaW50cywgbW91c2VQb2ludHMgfSA9IHRoaXM7XG5cbiAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ21vdXNlZG93bicpIHtcbiAgICAgIGlmICh1c2VQb2x5Z29uICYmIGxhbmRQb2ludHMubGVuZ3RoKSB7XG4gICAgICAgIC8vIGlmIGxhbmRQb2ludHMubGVuZ3RoIGlzIHplcm8gd2Ugd2FudCB0byBpbnNlcnQgdHdvIHBvaW50cyAoc28gd2UgbGV0IGl0IHJ1biB0aGUgZWxzZSlcbiAgICAgICAgLy8gYWxzbyBkb24ndCBpbnNlcnQgaWYgcG9seWdvbiBpcyBpbnZhbGlkXG4gICAgICAgIGlmICh0aGlzLmxhbmRQb2ludHMubGVuZ3RoIDwgMyB8fCB0aGlzLnZhbGlkUG9seWdvbikge1xuICAgICAgICAgIGxhbmRQb2ludHMucHVzaChsbmdMYXQpO1xuICAgICAgICAgIG1vdXNlUG9pbnRzLnB1c2godGhpcy5fZ2V0TW91c2VQb3NGcm9tRXZlbnQoZXZlbnQpKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5sYW5kUG9pbnRzID0gW2xuZ0xhdCwgbG5nTGF0XTtcbiAgICAgICAgY29uc3QgbSA9IHRoaXMuX2dldE1vdXNlUG9zRnJvbUV2ZW50KGV2ZW50KTtcbiAgICAgICAgdGhpcy5tb3VzZVBvaW50cyA9IFttLCBtXTtcbiAgICAgIH1cbiAgICAgIHJlZHJhdyA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChldmVudC50eXBlID09PSAnbW91c2Vtb3ZlJyAmJiBsYW5kUG9pbnRzLmxlbmd0aCkge1xuICAgICAgLy8gdXBkYXRlIGxhc3QgcG9pbnRcbiAgICAgIGxhbmRQb2ludHNbbGFuZFBvaW50cy5sZW5ndGggLSAxXSA9IGxuZ0xhdDtcbiAgICAgIG1vdXNlUG9pbnRzW21vdXNlUG9pbnRzLmxlbmd0aCAtIDFdID0gdGhpcy5fZ2V0TW91c2VQb3NGcm9tRXZlbnQoZXZlbnQpO1xuICAgICAgcmVkcmF3ID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKGV2ZW50LnR5cGUgPT09ICdtb3VzZXVwJykge1xuICAgICAgaWYgKHVzZVBvbHlnb24pIHtcbiAgICAgICAgLy8gY2hlY2sgdG8gc2VlIGlmIGNvbXBsZXRlZFxuICAgICAgICAvLyBUT0RPOiBNYXliZSBkb3VibGUtY2xpY2sgdG8gZmluaXNoP1xuICAgICAgICBpZiAoXG4gICAgICAgICAgbGFuZFBvaW50cy5sZW5ndGggPiA0ICYmXG4gICAgICAgICAgdHVyZkRpc3RhbmNlKGxhbmRQb2ludHNbMF0sIGxhbmRQb2ludHNbbGFuZFBvaW50cy5sZW5ndGggLSAxXSkgPCBQT0xZR09OX1RIUkVTSE9MRCAmJlxuICAgICAgICAgIHRoaXMudmFsaWRQb2x5Z29uXG4gICAgICAgICkge1xuICAgICAgICAgIHRoaXMuX3NlbGVjdFBvbHlnb25PYmplY3RzKCk7XG4gICAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICAgIHJlZHJhdyA9IHRydWU7XG4gICAgICAgICAgZGVhY3RpdmF0ZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3NlbGVjdFJlY3RhbmdsZU9iamVjdHMoKTtcbiAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICByZWRyYXcgPSB0cnVlO1xuICAgICAgICBkZWFjdGl2YXRlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4geyByZWRyYXcsIGRlYWN0aXZhdGUgfTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMubGFuZFBvaW50cyA9IFtdO1xuICAgIHRoaXMubW91c2VQb2ludHMgPSBbXTtcbiAgfVxuXG4gIF9tYWtlU3RhcnRQb2ludEhpZ2hsaWdodChjZW50ZXI6IFtudW1iZXIsIG51bWJlcl0pOiBudW1iZXJbXSB7XG4gICAgY29uc3QgYnVmZmVyID0gdHVyZkJ1ZmZlcihwb2ludChjZW50ZXIpLCBQT0xZR09OX1RIUkVTSE9MRCAvIDQuMCk7XG4gICAgcmV0dXJuIHR1cmZCYm94UG9seWdvbih0dXJmQmJveChidWZmZXIpKS5nZW9tZXRyeS5jb29yZGluYXRlcztcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBkYXRhID0gW107XG4gICAgY29uc3QgZGF0YVBpY2sgPSBbXTtcblxuICAgIGlmICghdGhpcy51c2VQb2x5Z29uICYmIHRoaXMubGFuZFBvaW50cy5sZW5ndGggPT09IDIpIHtcbiAgICAgIC8vIFVzZSBtb3VzZSBwb2ludHMgaW5zdGVhZCBvZiBsYW5kIHBvaW50cyBzbyB3ZSBnZXQgdGhlIHJpZ2h0IHNoYXBlXG4gICAgICAvLyBubyBtYXR0ZXIgd2hhdCBiZWFyaW5nIGlzLlxuICAgICAgY29uc3QgW1t4MSwgeTFdLCBbeDIsIHkyXV0gPSB0aGlzLm1vdXNlUG9pbnRzO1xuICAgICAgY29uc3Qgc2VsUG9seWdvbiA9IFtbeDEsIHkxXSwgW3gxLCB5Ml0sIFt4MiwgeTJdLCBbeDIsIHkxXSwgW3gxLCB5MV1dLm1hcChtb3VzZVBvcyA9PlxuICAgICAgICB0aGlzLm5lYnVsYS51bnByb2plY3RNb3VzZVBvc2l0aW9uKG1vdXNlUG9zKVxuICAgICAgKTtcbiAgICAgIGRhdGEucHVzaCh7XG4gICAgICAgIHBvbHlnb246IHNlbFBvbHlnb24sXG4gICAgICAgIGxpbmVDb2xvcjogUE9MWUdPTl9MSU5FX0NPTE9SLFxuICAgICAgICBmaWxsQ29sb3I6IFBPTFlHT05fRklMTF9DT0xPUlxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnVzZVBvbHlnb24gJiYgdGhpcy5sYW5kUG9pbnRzLmxlbmd0aCkge1xuICAgICAgZGF0YS5wdXNoKHtcbiAgICAgICAgcG9seWdvbjogdGhpcy5sYW5kUG9pbnRzLFxuICAgICAgICBsaW5lQ29sb3I6IFBPTFlHT05fTElORV9DT0xPUixcbiAgICAgICAgZmlsbENvbG9yOiBQT0xZR09OX0ZJTExfQ09MT1JcbiAgICAgIH0pO1xuXG4gICAgICAvLyBIYWNrOiB1c2UgYSBwb2x5Z29uIHRvIGhpZGUgdGhlIG91dHNpZGUsIGJlY2F1c2UgcGlja09iamVjdHMoKVxuICAgICAgLy8gZG9lcyBub3Qgc3VwcG9ydCBwb2x5Z29uc1xuICAgICAgaWYgKHRoaXMubGFuZFBvaW50cy5sZW5ndGggPj0gMykge1xuICAgICAgICBjb25zdCBsYW5kUG9pbnRzUG9seSA9IHBvbHlnb24oW1suLi50aGlzLmxhbmRQb2ludHMsIHRoaXMubGFuZFBvaW50c1swXV1dKTtcbiAgICAgICAgY29uc3QgYmlnQnVmZmVyID0gdHVyZkJ1ZmZlcihwb2ludCh0aGlzLmxhbmRQb2ludHNbMF0pLCBFWFBBTlNJT05fS00pO1xuICAgICAgICBsZXQgYmlnUG9seWdvbjtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyB0dXJmRGlmZmVyZW5jZSB0aHJvd3MgYW4gZXhjZXB0aW9uIGlmIHRoZSBwb2x5Z29uXG4gICAgICAgICAgLy8gaW50ZXJzZWN0cyB3aXRoIGl0c2VsZlxuICAgICAgICAgIGJpZ1BvbHlnb24gPSB0dXJmRGlmZmVyZW5jZShiaWdCdWZmZXIsIGxhbmRQb2ludHNQb2x5KTtcbiAgICAgICAgICBkYXRhUGljay5wdXNoKHtcbiAgICAgICAgICAgIHBvbHlnb246IGJpZ1BvbHlnb24uZ2VvbWV0cnkuY29vcmRpbmF0ZXMsXG4gICAgICAgICAgICBmaWxsQ29sb3I6IFswLCAwLCAwLCAxXVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMudmFsaWRQb2x5Z29uID0gdHJ1ZTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIC8vIGludmFsaWQgc2VsZWN0aW9uIHBvbHlnb25cbiAgICAgICAgICB0aGlzLnZhbGlkUG9seWdvbiA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubGFuZFBvaW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGhpZ2hsaWdodCBzdGFydCBwb2ludFxuICAgICAgZGF0YS5wdXNoKHtcbiAgICAgICAgcG9seWdvbjogdGhpcy5fbWFrZVN0YXJ0UG9pbnRIaWdobGlnaHQodGhpcy5sYW5kUG9pbnRzWzBdKSxcbiAgICAgICAgbGluZUNvbG9yOiBbMCwgMCwgMCwgMF0sXG4gICAgICAgIGZpbGxDb2xvcjogUE9MWUdPTl9MSU5FX0NPTE9SXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBIYWNrIHRvIG1ha2UgdGhlIFBvbHlnb25MYXllcigpIHN0YXkgYWN0aXZlLFxuICAgIC8vIG90aGVyd2lzZSBpdCB0YWtlcyAzIHNlY29uZHMgKCEpIHRvIGluaXQhXG4gICAgLy8gVE9ETzogZml4IHRoaXNcbiAgICBkYXRhLnB1c2goeyBwb2x5Z29uOiBbWzAsIDBdXSB9KTtcbiAgICBkYXRhUGljay5wdXNoKHsgcG9seWdvbjogW1swLCAwXV0gfSk7XG5cbiAgICByZXR1cm4gW1xuICAgICAgbmV3IFBvbHlnb25MYXllcih7XG4gICAgICAgIGlkOiBMQVlFUl9JRF9WSUVXLFxuICAgICAgICBkYXRhLFxuICAgICAgICBmcDY0OiBmYWxzZSxcbiAgICAgICAgb3BhY2l0eTogMS4wLFxuICAgICAgICBwaWNrYWJsZTogZmFsc2UsXG4gICAgICAgIGxpbmVXaWR0aE1pblBpeGVsczogUE9MWUdPTl9MSU5FX1dJRFRILFxuICAgICAgICBsaW5lV2lkdGhNYXhQaXhlbHM6IFBPTFlHT05fTElORV9XSURUSCxcbiAgICAgICAgbGluZURhc2hKdXN0aWZpZWQ6IHRydWUsXG4gICAgICAgIGdldExpbmVEYXNoQXJyYXk6IHggPT4gUE9MWUdPTl9EQVNIRVMsXG4gICAgICAgIGdldExpbmVDb2xvcjogb2JqID0+IG9iai5saW5lQ29sb3IgfHwgWzAsIDAsIDAsIDI1NV0sXG4gICAgICAgIGdldEZpbGxDb2xvcjogb2JqID0+IG9iai5maWxsQ29sb3IgfHwgWzAsIDAsIDAsIDI1NV0sXG4gICAgICAgIGdldFBvbHlnb246IG8gPT4gby5wb2x5Z29uXG4gICAgICB9KSxcbiAgICAgIG5ldyBQb2x5Z29uTGF5ZXIoe1xuICAgICAgICBpZDogTEFZRVJfSURfUElDSyxcbiAgICAgICAgZGF0YTogZGF0YVBpY2ssXG4gICAgICAgIGdldExpbmVDb2xvcjogb2JqID0+IG9iai5saW5lQ29sb3IgfHwgWzAsIDAsIDAsIDI1NV0sXG4gICAgICAgIGdldEZpbGxDb2xvcjogb2JqID0+IG9iai5maWxsQ29sb3IgfHwgWzAsIDAsIDAsIDI1NV0sXG4gICAgICAgIGZwNjQ6IGZhbHNlLFxuICAgICAgICBvcGFjaXR5OiAxLjAsXG4gICAgICAgIHN0cm9rZWQ6IGZhbHNlLFxuICAgICAgICBwaWNrYWJsZTogdHJ1ZSxcbiAgICAgICAgZ2V0UG9seWdvbjogbyA9PiBvLnBvbHlnb25cbiAgICAgIH0pXG4gICAgXTtcbiAgfVxufVxuIl19
