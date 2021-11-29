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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvZGVjay1yZW5kZXJlci9kZWNrLWRyYXdlci5qcyJdLCJuYW1lcyI6WyJQT0xZR09OX0xJTkVfQ09MT1IiLCJQT0xZR09OX0ZJTExfQ09MT1IiLCJQT0xZR09OX0xJTkVfV0lEVEgiLCJQT0xZR09OX0RBU0hFUyIsIlBPTFlHT05fVEhSRVNIT0xEIiwiRVhQQU5TSU9OX0tNIiwiTEFZRVJfSURfVklFVyIsIkxBWUVSX0lEX1BJQ0siLCJTRUxFQ1RJT05fVFlQRSIsIk5PTkUiLCJSRUNUQU5HTEUiLCJQT0xZR09OIiwiRGVja0RyYXdlciIsIm5lYnVsYSIsInVzZVBvbHlnb24iLCJsYW5kUG9pbnRzIiwibW91c2VQb2ludHMiLCJkZWNrZ2wiLCJwcm9wcyIsImxheWVycyIsImZpbHRlciIsImwiLCJuZWJ1bGFMYXllciIsImVuYWJsZVNlbGVjdGlvbiIsIm1hcCIsImlkIiwicGlja2luZ0luZm9zIiwib2JqZWN0cyIsImxheWVyIiwiaW5kZXgiLCJvYmplY3QiLCJvcmlnaW5hbCIsImRlY2tDYWNoZSIsIm9yaWdpbmFscyIsIm9uU2VsZWN0aW9uIiwiYWxsWCIsIm1vdXNlUG9pbnQiLCJhbGxZIiwieCIsIk1hdGgiLCJtaW4iLCJ5IiwibWF4WCIsIm1heCIsIm1heFkiLCJ3aWR0aCIsImhlaWdodCIsImxlbmd0aCIsIngxIiwieTEiLCJ4MiIsInkyIiwicGlja09iamVjdHMiLCJhYnMiLCJsYXllcklkcyIsIl9nZXRMYXllcklkcyIsIl9zZWxlY3RGcm9tUGlja2luZ0luZm9zIiwiX2dldEJvdW5kaW5nQm94IiwiaXRlbSIsImV2ZW50Iiwib2Zmc2V0WCIsIm9mZnNldFkiLCJsbmdMYXQiLCJzZWxlY3Rpb25UeXBlIiwidHlwZSIsInN0b3BQcm9wYWdhdGlvbiIsInJlZHJhdyIsImRlYWN0aXZhdGUiLCJ2YWxpZFBvbHlnb24iLCJwdXNoIiwiX2dldE1vdXNlUG9zRnJvbUV2ZW50IiwibSIsIl9zZWxlY3RQb2x5Z29uT2JqZWN0cyIsInJlc2V0IiwiX3NlbGVjdFJlY3RhbmdsZU9iamVjdHMiLCJjZW50ZXIiLCJidWZmZXIiLCJnZW9tZXRyeSIsImNvb3JkaW5hdGVzIiwiZGF0YSIsImRhdGFQaWNrIiwic2VsUG9seWdvbiIsIm1vdXNlUG9zIiwidW5wcm9qZWN0TW91c2VQb3NpdGlvbiIsInBvbHlnb24iLCJsaW5lQ29sb3IiLCJmaWxsQ29sb3IiLCJsYW5kUG9pbnRzUG9seSIsImJpZ0J1ZmZlciIsImJpZ1BvbHlnb24iLCJlIiwiX21ha2VTdGFydFBvaW50SGlnaGxpZ2h0IiwiUG9seWdvbkxheWVyIiwiZnA2NCIsIm9wYWNpdHkiLCJwaWNrYWJsZSIsImxpbmVXaWR0aE1pblBpeGVscyIsImxpbmVXaWR0aE1heFBpeGVscyIsImxpbmVEYXNoSnVzdGlmaWVkIiwiZ2V0TGluZURhc2hBcnJheSIsImdldExpbmVDb2xvciIsIm9iaiIsImdldEZpbGxDb2xvciIsImdldFBvbHlnb24iLCJvIiwic3Ryb2tlZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxrQkFBa0IsR0FBRyxDQUFDLENBQUQsRUFBSSxHQUFKLEVBQVMsQ0FBVCxFQUFZLEdBQVosQ0FBM0I7QUFDQSxJQUFNQyxrQkFBa0IsR0FBRyxDQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsR0FBWCxFQUFnQixFQUFoQixDQUEzQjtBQUNBLElBQU1DLGtCQUFrQixHQUFHLENBQTNCO0FBQ0EsSUFBTUMsY0FBYyxHQUFHLENBQUMsRUFBRCxFQUFLLEVBQUwsQ0FBdkI7QUFDQSxJQUFNQyxpQkFBaUIsR0FBRyxJQUExQjtBQUNBLElBQU1DLFlBQVksR0FBRyxFQUFyQjtBQUNBLElBQU1DLGFBQWEsR0FBRyxnQkFBdEI7QUFDQSxJQUFNQyxhQUFhLEdBQUcsZ0JBQXRCO0FBRU8sSUFBTUMsY0FBYyxHQUFHO0FBQzVCQyxFQUFBQSxJQUFJLEVBQUUsSUFEc0I7QUFFNUJDLEVBQUFBLFNBQVMsRUFBRSxXQUZpQjtBQUc1QkMsRUFBQUEsT0FBTyxFQUFFO0FBSG1CLENBQXZCOzs7SUFNY0MsVTs7O0FBT25CLHNCQUFZQyxNQUFaLEVBQTRCO0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQzFCLFNBQUtBLE1BQUwsR0FBY0EsTUFBZDtBQUNBLFNBQUtDLFVBQUwsR0FBa0IsS0FBbEI7QUFDQSxTQUFLQyxVQUFMLEdBQWtCLEVBQWxCO0FBQ0EsU0FBS0MsV0FBTCxHQUFtQixFQUFuQjtBQUNEOzs7O21DQUVjO0FBQ2I7QUFDQSxhQUFPLEtBQUtILE1BQUwsQ0FBWUksTUFBWixDQUFtQkMsS0FBbkIsQ0FBeUJDLE1BQXpCLENBQ0pDLE1BREksQ0FDRyxVQUFBQyxDQUFDO0FBQUEsZUFBSUEsQ0FBQyxJQUFJQSxDQUFDLENBQUNILEtBQVAsSUFBZ0JHLENBQUMsQ0FBQ0gsS0FBRixDQUFRSSxXQUF4QixJQUF1Q0QsQ0FBQyxDQUFDSCxLQUFGLENBQVFJLFdBQVIsQ0FBb0JDLGVBQS9EO0FBQUEsT0FESixFQUVKQyxHQUZJLENBRUEsVUFBQUgsQ0FBQztBQUFBLGVBQUlBLENBQUMsQ0FBQ0ksRUFBTjtBQUFBLE9BRkQsQ0FBUDtBQUdEOzs7NENBRXVCQyxZLEVBQXdCO0FBQzlDLFVBQU1DLE9BQU8sR0FBR0QsWUFBWSxDQUFDRixHQUFiLENBQ2Q7QUFBQSxZQUFHSSxLQUFILFFBQUdBLEtBQUg7QUFBQSxZQUFVQyxLQUFWLFFBQVVBLEtBQVY7QUFBQSxZQUFpQkMsTUFBakIsUUFBaUJBLE1BQWpCO0FBQUEsZUFDRUEsTUFBTSxDQUFDQyxRQUFQLElBQW1CSCxLQUFLLENBQUNWLEtBQU4sQ0FBWUksV0FBWixDQUF3QlUsU0FBeEIsQ0FBa0NDLFNBQWxDLENBQTRDSixLQUE1QyxDQURyQjtBQUFBLE9BRGMsQ0FBaEI7QUFJQSxXQUFLaEIsTUFBTCxDQUFZSyxLQUFaLENBQWtCZ0IsV0FBbEIsQ0FBOEJQLE9BQTlCO0FBQ0Q7OztzQ0FFeUI7QUFBQSxVQUNoQlgsV0FEZ0IsR0FDQSxJQURBLENBQ2hCQSxXQURnQjtBQUV4QixVQUFNbUIsSUFBSSxHQUFHbkIsV0FBVyxDQUFDUSxHQUFaLENBQWdCLFVBQUFZLFVBQVU7QUFBQSxlQUFJQSxVQUFVLENBQUMsQ0FBRCxDQUFkO0FBQUEsT0FBMUIsQ0FBYjtBQUNBLFVBQU1DLElBQUksR0FBR3JCLFdBQVcsQ0FBQ1EsR0FBWixDQUFnQixVQUFBWSxVQUFVO0FBQUEsZUFBSUEsVUFBVSxDQUFDLENBQUQsQ0FBZDtBQUFBLE9BQTFCLENBQWI7QUFDQSxVQUFNRSxDQUFDLEdBQUdDLElBQUksQ0FBQ0MsR0FBTCxPQUFBRCxJQUFJLHFCQUFRSixJQUFSLEVBQWQ7QUFDQSxVQUFNTSxDQUFDLEdBQUdGLElBQUksQ0FBQ0MsR0FBTCxPQUFBRCxJQUFJLHFCQUFRRixJQUFSLEVBQWQ7QUFDQSxVQUFNSyxJQUFJLEdBQUdILElBQUksQ0FBQ0ksR0FBTCxPQUFBSixJQUFJLHFCQUFRSixJQUFSLEVBQWpCO0FBQ0EsVUFBTVMsSUFBSSxHQUFHTCxJQUFJLENBQUNJLEdBQUwsT0FBQUosSUFBSSxxQkFBUUYsSUFBUixFQUFqQjtBQUVBLGFBQU87QUFBRUMsUUFBQUEsQ0FBQyxFQUFEQSxDQUFGO0FBQUtHLFFBQUFBLENBQUMsRUFBREEsQ0FBTDtBQUFRSSxRQUFBQSxLQUFLLEVBQUVILElBQUksR0FBR0osQ0FBdEI7QUFBeUJRLFFBQUFBLE1BQU0sRUFBRUYsSUFBSSxHQUFHSDtBQUF4QyxPQUFQO0FBQ0Q7Ozs4Q0FFeUI7QUFDeEIsVUFBSSxLQUFLMUIsVUFBTCxDQUFnQmdDLE1BQWhCLEtBQTJCLENBQS9CLEVBQWtDOztBQURWLDhDQUdQLEtBQUsvQixXQUFMLENBQWlCLENBQWpCLENBSE87QUFBQSxVQUdqQmdDLEVBSGlCO0FBQUEsVUFHYkMsRUFIYTs7QUFBQSwrQ0FJUCxLQUFLakMsV0FBTCxDQUFpQixDQUFqQixDQUpPO0FBQUEsVUFJakJrQyxFQUppQjtBQUFBLFVBSWJDLEVBSmE7O0FBS3hCLFVBQU16QixZQUFZLEdBQUcsS0FBS2IsTUFBTCxDQUFZSSxNQUFaLENBQW1CbUMsV0FBbkIsQ0FBK0I7QUFDbERkLFFBQUFBLENBQUMsRUFBRUMsSUFBSSxDQUFDQyxHQUFMLENBQVNRLEVBQVQsRUFBYUUsRUFBYixDQUQrQztBQUVsRFQsUUFBQUEsQ0FBQyxFQUFFRixJQUFJLENBQUNDLEdBQUwsQ0FBU1MsRUFBVCxFQUFhRSxFQUFiLENBRitDO0FBR2xETixRQUFBQSxLQUFLLEVBQUVOLElBQUksQ0FBQ2MsR0FBTCxDQUFTSCxFQUFFLEdBQUdGLEVBQWQsQ0FIMkM7QUFJbERGLFFBQUFBLE1BQU0sRUFBRVAsSUFBSSxDQUFDYyxHQUFMLENBQVNGLEVBQUUsR0FBR0YsRUFBZCxDQUowQztBQUtsREssUUFBQUEsUUFBUSxFQUFFLEtBQUtDLFlBQUw7QUFMd0MsT0FBL0IsQ0FBckI7O0FBUUEsV0FBS0MsdUJBQUwsQ0FBNkI5QixZQUE3QjtBQUNEOzs7NENBRXVCO0FBQ3RCLFVBQU1BLFlBQVksR0FBRyxLQUFLYixNQUFMLENBQVlJLE1BQVosQ0FBbUJtQyxXQUFuQixtQkFDaEIsS0FBS0ssZUFBTCxFQURnQjtBQUVuQkgsUUFBQUEsUUFBUSxHQUFHL0MsYUFBSCw0QkFBcUIsS0FBS2dELFlBQUwsRUFBckI7QUFGVyxTQUFyQjs7QUFLQSxXQUFLQyx1QkFBTCxDQUE2QjlCLFlBQVksQ0FBQ04sTUFBYixDQUFvQixVQUFBc0MsSUFBSTtBQUFBLGVBQUlBLElBQUksQ0FBQzlCLEtBQUwsQ0FBV0gsRUFBWCxLQUFrQmxCLGFBQXRCO0FBQUEsT0FBeEIsQ0FBN0I7QUFDRDs7OzBDQUVxQm9ELEssRUFBaUM7QUFBQSxVQUM3Q0MsT0FENkMsR0FDeEJELEtBRHdCLENBQzdDQyxPQUQ2QztBQUFBLFVBQ3BDQyxPQURvQyxHQUN4QkYsS0FEd0IsQ0FDcENFLE9BRG9DO0FBRXJELGFBQU8sQ0FBQ0QsT0FBRCxFQUFVQyxPQUFWLENBQVA7QUFDRDs7O2dDQUdDRixLLEVBQ0FHLE0sRUFDQUMsYSxFQUMwQztBQUMxQztBQUNBLFVBQUlKLEtBQUssQ0FBQ0ssSUFBTixLQUFlLFNBQW5CLEVBQThCTCxLQUFLLENBQUNNLGVBQU47QUFFOUIsV0FBS25ELFVBQUwsR0FBa0JpRCxhQUFhLEtBQUt2RCxjQUFjLENBQUNHLE9BQW5EO0FBRUEsVUFBSXVELE1BQU0sR0FBRyxLQUFiO0FBQ0EsVUFBSUMsVUFBVSxHQUFHLEtBQWpCO0FBUDBDLFVBU2xDckQsVUFUa0MsR0FTTSxJQVROLENBU2xDQSxVQVRrQztBQUFBLFVBU3RCQyxVQVRzQixHQVNNLElBVE4sQ0FTdEJBLFVBVHNCO0FBQUEsVUFTVkMsV0FUVSxHQVNNLElBVE4sQ0FTVkEsV0FUVTs7QUFXMUMsVUFBSTJDLEtBQUssQ0FBQ0ssSUFBTixLQUFlLFdBQW5CLEVBQWdDO0FBQzlCLFlBQUlsRCxVQUFVLElBQUlDLFVBQVUsQ0FBQ2dDLE1BQTdCLEVBQXFDO0FBQ25DO0FBQ0E7QUFDQSxjQUFJLEtBQUtoQyxVQUFMLENBQWdCZ0MsTUFBaEIsR0FBeUIsQ0FBekIsSUFBOEIsS0FBS3FCLFlBQXZDLEVBQXFEO0FBQ25EckQsWUFBQUEsVUFBVSxDQUFDc0QsSUFBWCxDQUFnQlAsTUFBaEI7QUFDQTlDLFlBQUFBLFdBQVcsQ0FBQ3FELElBQVosQ0FBaUIsS0FBS0MscUJBQUwsQ0FBMkJYLEtBQTNCLENBQWpCO0FBQ0Q7QUFDRixTQVBELE1BT087QUFDTCxlQUFLNUMsVUFBTCxHQUFrQixDQUFDK0MsTUFBRCxFQUFTQSxNQUFULENBQWxCOztBQUNBLGNBQU1TLENBQUMsR0FBRyxLQUFLRCxxQkFBTCxDQUEyQlgsS0FBM0IsQ0FBVjs7QUFDQSxlQUFLM0MsV0FBTCxHQUFtQixDQUFDdUQsQ0FBRCxFQUFJQSxDQUFKLENBQW5CO0FBQ0Q7O0FBQ0RMLFFBQUFBLE1BQU0sR0FBRyxJQUFUO0FBQ0QsT0FkRCxNQWNPLElBQUlQLEtBQUssQ0FBQ0ssSUFBTixLQUFlLFdBQWYsSUFBOEJqRCxVQUFVLENBQUNnQyxNQUE3QyxFQUFxRDtBQUMxRDtBQUNBaEMsUUFBQUEsVUFBVSxDQUFDQSxVQUFVLENBQUNnQyxNQUFYLEdBQW9CLENBQXJCLENBQVYsR0FBb0NlLE1BQXBDO0FBQ0E5QyxRQUFBQSxXQUFXLENBQUNBLFdBQVcsQ0FBQytCLE1BQVosR0FBcUIsQ0FBdEIsQ0FBWCxHQUFzQyxLQUFLdUIscUJBQUwsQ0FBMkJYLEtBQTNCLENBQXRDO0FBQ0FPLFFBQUFBLE1BQU0sR0FBRyxJQUFUO0FBQ0QsT0FMTSxNQUtBLElBQUlQLEtBQUssQ0FBQ0ssSUFBTixLQUFlLFNBQW5CLEVBQThCO0FBQ25DLFlBQUlsRCxVQUFKLEVBQWdCO0FBQ2Q7QUFDQTtBQUNBLGNBQ0VDLFVBQVUsQ0FBQ2dDLE1BQVgsR0FBb0IsQ0FBcEIsSUFDQSx1QkFBYWhDLFVBQVUsQ0FBQyxDQUFELENBQXZCLEVBQTRCQSxVQUFVLENBQUNBLFVBQVUsQ0FBQ2dDLE1BQVgsR0FBb0IsQ0FBckIsQ0FBdEMsSUFBaUUzQyxpQkFEakUsSUFFQSxLQUFLZ0UsWUFIUCxFQUlFO0FBQ0EsaUJBQUtJLHFCQUFMOztBQUNBLGlCQUFLQyxLQUFMO0FBQ0FQLFlBQUFBLE1BQU0sR0FBRyxJQUFUO0FBQ0FDLFlBQUFBLFVBQVUsR0FBRyxJQUFiO0FBQ0Q7QUFDRixTQWJELE1BYU87QUFDTCxlQUFLTyx1QkFBTDs7QUFDQSxlQUFLRCxLQUFMO0FBQ0FQLFVBQUFBLE1BQU0sR0FBRyxJQUFUO0FBQ0FDLFVBQUFBLFVBQVUsR0FBRyxJQUFiO0FBQ0Q7QUFDRjs7QUFFRCxhQUFPO0FBQUVELFFBQUFBLE1BQU0sRUFBTkEsTUFBRjtBQUFVQyxRQUFBQSxVQUFVLEVBQVZBO0FBQVYsT0FBUDtBQUNEOzs7NEJBRU87QUFDTixXQUFLcEQsVUFBTCxHQUFrQixFQUFsQjtBQUNBLFdBQUtDLFdBQUwsR0FBbUIsRUFBbkI7QUFDRDs7OzZDQUV3QjJELE0sRUFBb0M7QUFDM0QsVUFBTUMsTUFBTSxHQUFHLHFCQUFXLG9CQUFNRCxNQUFOLENBQVgsRUFBMEJ2RSxpQkFBaUIsR0FBRyxHQUE5QyxDQUFmO0FBQ0EsYUFBTywwQkFBZ0IsbUJBQVN3RSxNQUFULENBQWhCLEVBQWtDQyxRQUFsQyxDQUEyQ0MsV0FBbEQ7QUFDRDs7OzZCQUVRO0FBQUE7O0FBQ1AsVUFBTUMsSUFBSSxHQUFHLEVBQWI7QUFDQSxVQUFNQyxRQUFRLEdBQUcsRUFBakI7O0FBRUEsVUFBSSxDQUFDLEtBQUtsRSxVQUFOLElBQW9CLEtBQUtDLFVBQUwsQ0FBZ0JnQyxNQUFoQixLQUEyQixDQUFuRCxFQUFzRDtBQUNwRDtBQUNBO0FBRm9ELCtDQUd2QixLQUFLL0IsV0FIa0I7QUFBQTtBQUFBLFlBRzVDZ0MsRUFINEM7QUFBQSxZQUd4Q0MsRUFId0M7QUFBQTtBQUFBLFlBR2xDQyxFQUhrQztBQUFBLFlBRzlCQyxFQUg4Qjs7QUFJcEQsWUFBTThCLFVBQVUsR0FBRyxDQUFDLENBQUNqQyxFQUFELEVBQUtDLEVBQUwsQ0FBRCxFQUFXLENBQUNELEVBQUQsRUFBS0csRUFBTCxDQUFYLEVBQXFCLENBQUNELEVBQUQsRUFBS0MsRUFBTCxDQUFyQixFQUErQixDQUFDRCxFQUFELEVBQUtELEVBQUwsQ0FBL0IsRUFBeUMsQ0FBQ0QsRUFBRCxFQUFLQyxFQUFMLENBQXpDLEVBQW1EekIsR0FBbkQsQ0FBdUQsVUFBQTBELFFBQVE7QUFBQSxpQkFDaEYsS0FBSSxDQUFDckUsTUFBTCxDQUFZc0Usc0JBQVosQ0FBbUNELFFBQW5DLENBRGdGO0FBQUEsU0FBL0QsQ0FBbkI7QUFHQUgsUUFBQUEsSUFBSSxDQUFDVixJQUFMLENBQVU7QUFDUmUsVUFBQUEsT0FBTyxFQUFFSCxVQUREO0FBRVJJLFVBQUFBLFNBQVMsRUFBRXJGLGtCQUZIO0FBR1JzRixVQUFBQSxTQUFTLEVBQUVyRjtBQUhILFNBQVY7QUFLRCxPQVpELE1BWU8sSUFBSSxLQUFLYSxVQUFMLElBQW1CLEtBQUtDLFVBQUwsQ0FBZ0JnQyxNQUF2QyxFQUErQztBQUNwRGdDLFFBQUFBLElBQUksQ0FBQ1YsSUFBTCxDQUFVO0FBQ1JlLFVBQUFBLE9BQU8sRUFBRSxLQUFLckUsVUFETjtBQUVSc0UsVUFBQUEsU0FBUyxFQUFFckYsa0JBRkg7QUFHUnNGLFVBQUFBLFNBQVMsRUFBRXJGO0FBSEgsU0FBVixFQURvRCxDQU9wRDtBQUNBOztBQUNBLFlBQUksS0FBS2MsVUFBTCxDQUFnQmdDLE1BQWhCLElBQTBCLENBQTlCLEVBQWlDO0FBQy9CLGNBQU13QyxjQUFjLEdBQUcsc0JBQVEsb0JBQUssS0FBS3hFLFVBQVYsVUFBc0IsS0FBS0EsVUFBTCxDQUFnQixDQUFoQixDQUF0QixHQUFSLENBQXZCO0FBQ0EsY0FBTXlFLFNBQVMsR0FBRyxxQkFBVyxvQkFBTSxLQUFLekUsVUFBTCxDQUFnQixDQUFoQixDQUFOLENBQVgsRUFBc0NWLFlBQXRDLENBQWxCO0FBQ0EsY0FBSW9GLFVBQUo7O0FBQ0EsY0FBSTtBQUNGO0FBQ0E7QUFDQUEsWUFBQUEsVUFBVSxHQUFHLHlCQUFlRCxTQUFmLEVBQTBCRCxjQUExQixDQUFiO0FBQ0FQLFlBQUFBLFFBQVEsQ0FBQ1gsSUFBVCxDQUFjO0FBQ1plLGNBQUFBLE9BQU8sRUFBRUssVUFBVSxDQUFDWixRQUFYLENBQW9CQyxXQURqQjtBQUVaUSxjQUFBQSxTQUFTLEVBQUUsQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsRUFBVSxDQUFWO0FBRkMsYUFBZDtBQUlBLGlCQUFLbEIsWUFBTCxHQUFvQixJQUFwQjtBQUNELFdBVEQsQ0FTRSxPQUFPc0IsQ0FBUCxFQUFVO0FBQ1Y7QUFDQSxpQkFBS3RCLFlBQUwsR0FBb0IsS0FBcEI7QUFDRDtBQUNGO0FBQ0Y7O0FBRUQsVUFBSSxLQUFLckQsVUFBTCxDQUFnQmdDLE1BQXBCLEVBQTRCO0FBQzFCO0FBQ0FnQyxRQUFBQSxJQUFJLENBQUNWLElBQUwsQ0FBVTtBQUNSZSxVQUFBQSxPQUFPLEVBQUUsS0FBS08sd0JBQUwsQ0FBOEIsS0FBSzVFLFVBQUwsQ0FBZ0IsQ0FBaEIsQ0FBOUIsQ0FERDtBQUVSc0UsVUFBQUEsU0FBUyxFQUFFLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsQ0FBVixDQUZIO0FBR1JDLFVBQUFBLFNBQVMsRUFBRXRGO0FBSEgsU0FBVjtBQUtELE9BcERNLENBc0RQO0FBQ0E7QUFDQTs7O0FBQ0ErRSxNQUFBQSxJQUFJLENBQUNWLElBQUwsQ0FBVTtBQUFFZSxRQUFBQSxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQUQ7QUFBWCxPQUFWO0FBQ0FKLE1BQUFBLFFBQVEsQ0FBQ1gsSUFBVCxDQUFjO0FBQUVlLFFBQUFBLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBRDtBQUFYLE9BQWQ7QUFFQSxhQUFPLENBQ0wsSUFBSVEsZ0NBQUosQ0FBaUI7QUFDZm5FLFFBQUFBLEVBQUUsRUFBRW5CLGFBRFc7QUFFZnlFLFFBQUFBLElBQUksRUFBSkEsSUFGZTtBQUdmYyxRQUFBQSxJQUFJLEVBQUUsS0FIUztBQUlmQyxRQUFBQSxPQUFPLEVBQUUsR0FKTTtBQUtmQyxRQUFBQSxRQUFRLEVBQUUsS0FMSztBQU1mQyxRQUFBQSxrQkFBa0IsRUFBRTlGLGtCQU5MO0FBT2YrRixRQUFBQSxrQkFBa0IsRUFBRS9GLGtCQVBMO0FBUWZnRyxRQUFBQSxpQkFBaUIsRUFBRSxJQVJKO0FBU2ZDLFFBQUFBLGdCQUFnQixFQUFFLDBCQUFBN0QsQ0FBQztBQUFBLGlCQUFJbkMsY0FBSjtBQUFBLFNBVEo7QUFVZmlHLFFBQUFBLFlBQVksRUFBRSxzQkFBQUMsR0FBRztBQUFBLGlCQUFJQSxHQUFHLENBQUNoQixTQUFKLElBQWlCLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsR0FBVixDQUFyQjtBQUFBLFNBVkY7QUFXZmlCLFFBQUFBLFlBQVksRUFBRSxzQkFBQUQsR0FBRztBQUFBLGlCQUFJQSxHQUFHLENBQUNmLFNBQUosSUFBaUIsQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsRUFBVSxHQUFWLENBQXJCO0FBQUEsU0FYRjtBQVlmaUIsUUFBQUEsVUFBVSxFQUFFLG9CQUFBQyxDQUFDO0FBQUEsaUJBQUlBLENBQUMsQ0FBQ3BCLE9BQU47QUFBQTtBQVpFLE9BQWpCLENBREssRUFlTCxJQUFJUSxnQ0FBSixDQUFpQjtBQUNmbkUsUUFBQUEsRUFBRSxFQUFFbEIsYUFEVztBQUVmd0UsUUFBQUEsSUFBSSxFQUFFQyxRQUZTO0FBR2ZvQixRQUFBQSxZQUFZLEVBQUUsc0JBQUFDLEdBQUc7QUFBQSxpQkFBSUEsR0FBRyxDQUFDaEIsU0FBSixJQUFpQixDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLEdBQVYsQ0FBckI7QUFBQSxTQUhGO0FBSWZpQixRQUFBQSxZQUFZLEVBQUUsc0JBQUFELEdBQUc7QUFBQSxpQkFBSUEsR0FBRyxDQUFDZixTQUFKLElBQWlCLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsR0FBVixDQUFyQjtBQUFBLFNBSkY7QUFLZk8sUUFBQUEsSUFBSSxFQUFFLEtBTFM7QUFNZkMsUUFBQUEsT0FBTyxFQUFFLEdBTk07QUFPZlcsUUFBQUEsT0FBTyxFQUFFLEtBUE07QUFRZlYsUUFBQUEsUUFBUSxFQUFFLElBUks7QUFTZlEsUUFBQUEsVUFBVSxFQUFFLG9CQUFBQyxDQUFDO0FBQUEsaUJBQUlBLENBQUMsQ0FBQ3BCLE9BQU47QUFBQTtBQVRFLE9BQWpCLENBZkssQ0FBUDtBQTJCRCIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5pbXBvcnQgeyBQb2x5Z29uTGF5ZXIgfSBmcm9tICdrZXBsZXItb3V0ZGF0ZWQtZGVjay5nbC1sYXllcnMnO1xuaW1wb3J0IHsgcG9pbnQsIHBvbHlnb24gfSBmcm9tICdAdHVyZi9oZWxwZXJzJztcbmltcG9ydCB0dXJmQmJveCBmcm9tICdAdHVyZi9iYm94JztcbmltcG9ydCB0dXJmQmJveFBvbHlnb24gZnJvbSAnQHR1cmYvYmJveC1wb2x5Z29uJztcbmltcG9ydCB0dXJmQnVmZmVyIGZyb20gJ0B0dXJmL2J1ZmZlcic7XG5pbXBvcnQgdHVyZkRpZmZlcmVuY2UgZnJvbSAnQHR1cmYvZGlmZmVyZW5jZSc7XG5pbXBvcnQgdHVyZkRpc3RhbmNlIGZyb20gJ0B0dXJmL2Rpc3RhbmNlJztcblxuY29uc3QgUE9MWUdPTl9MSU5FX0NPTE9SID0gWzAsIDI1NSwgMCwgMjU1XTtcbmNvbnN0IFBPTFlHT05fRklMTF9DT0xPUiA9IFsyNTUsIDI1NSwgMjU1LCA5MF07XG5jb25zdCBQT0xZR09OX0xJTkVfV0lEVEggPSAyO1xuY29uc3QgUE9MWUdPTl9EQVNIRVMgPSBbMjAsIDIwXTtcbmNvbnN0IFBPTFlHT05fVEhSRVNIT0xEID0gMC4wMTtcbmNvbnN0IEVYUEFOU0lPTl9LTSA9IDEwO1xuY29uc3QgTEFZRVJfSURfVklFVyA9ICdEZWNrRHJhd2VyVmlldyc7XG5jb25zdCBMQVlFUl9JRF9QSUNLID0gJ0RlY2tEcmF3ZXJQaWNrJztcblxuZXhwb3J0IGNvbnN0IFNFTEVDVElPTl9UWVBFID0ge1xuICBOT05FOiBudWxsLFxuICBSRUNUQU5HTEU6ICdyZWN0YW5nbGUnLFxuICBQT0xZR09OOiAncG9seWdvbidcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERlY2tEcmF3ZXIge1xuICBuZWJ1bGE6IE9iamVjdDtcbiAgdXNlUG9seWdvbjogYm9vbGVhbjtcbiAgdmFsaWRQb2x5Z29uOiBib29sZWFuO1xuICBsYW5kUG9pbnRzOiBbbnVtYmVyLCBudW1iZXJdW107XG4gIG1vdXNlUG9pbnRzOiBbbnVtYmVyLCBudW1iZXJdW107XG5cbiAgY29uc3RydWN0b3IobmVidWxhOiBPYmplY3QpIHtcbiAgICB0aGlzLm5lYnVsYSA9IG5lYnVsYTtcbiAgICB0aGlzLnVzZVBvbHlnb24gPSBmYWxzZTtcbiAgICB0aGlzLmxhbmRQb2ludHMgPSBbXTtcbiAgICB0aGlzLm1vdXNlUG9pbnRzID0gW107XG4gIH1cblxuICBfZ2V0TGF5ZXJJZHMoKSB7XG4gICAgLy8gVE9ETzogc29ydCBieSBtb3VzZSBwcmlvcml0eVxuICAgIHJldHVybiB0aGlzLm5lYnVsYS5kZWNrZ2wucHJvcHMubGF5ZXJzXG4gICAgICAuZmlsdGVyKGwgPT4gbCAmJiBsLnByb3BzICYmIGwucHJvcHMubmVidWxhTGF5ZXIgJiYgbC5wcm9wcy5uZWJ1bGFMYXllci5lbmFibGVTZWxlY3Rpb24pXG4gICAgICAubWFwKGwgPT4gbC5pZCk7XG4gIH1cblxuICBfc2VsZWN0RnJvbVBpY2tpbmdJbmZvcyhwaWNraW5nSW5mb3M6IE9iamVjdFtdKSB7XG4gICAgY29uc3Qgb2JqZWN0cyA9IHBpY2tpbmdJbmZvcy5tYXAoXG4gICAgICAoeyBsYXllciwgaW5kZXgsIG9iamVjdCB9KSA9PlxuICAgICAgICBvYmplY3Qub3JpZ2luYWwgfHwgbGF5ZXIucHJvcHMubmVidWxhTGF5ZXIuZGVja0NhY2hlLm9yaWdpbmFsc1tpbmRleF1cbiAgICApO1xuICAgIHRoaXMubmVidWxhLnByb3BzLm9uU2VsZWN0aW9uKG9iamVjdHMpO1xuICB9XG5cbiAgX2dldEJvdW5kaW5nQm94KCk6IE9iamVjdCB7XG4gICAgY29uc3QgeyBtb3VzZVBvaW50cyB9ID0gdGhpcztcbiAgICBjb25zdCBhbGxYID0gbW91c2VQb2ludHMubWFwKG1vdXNlUG9pbnQgPT4gbW91c2VQb2ludFswXSk7XG4gICAgY29uc3QgYWxsWSA9IG1vdXNlUG9pbnRzLm1hcChtb3VzZVBvaW50ID0+IG1vdXNlUG9pbnRbMV0pO1xuICAgIGNvbnN0IHggPSBNYXRoLm1pbiguLi5hbGxYKTtcbiAgICBjb25zdCB5ID0gTWF0aC5taW4oLi4uYWxsWSk7XG4gICAgY29uc3QgbWF4WCA9IE1hdGgubWF4KC4uLmFsbFgpO1xuICAgIGNvbnN0IG1heFkgPSBNYXRoLm1heCguLi5hbGxZKTtcblxuICAgIHJldHVybiB7IHgsIHksIHdpZHRoOiBtYXhYIC0geCwgaGVpZ2h0OiBtYXhZIC0geSB9O1xuICB9XG5cbiAgX3NlbGVjdFJlY3RhbmdsZU9iamVjdHMoKSB7XG4gICAgaWYgKHRoaXMubGFuZFBvaW50cy5sZW5ndGggIT09IDIpIHJldHVybjtcblxuICAgIGNvbnN0IFt4MSwgeTFdID0gdGhpcy5tb3VzZVBvaW50c1swXTtcbiAgICBjb25zdCBbeDIsIHkyXSA9IHRoaXMubW91c2VQb2ludHNbMV07XG4gICAgY29uc3QgcGlja2luZ0luZm9zID0gdGhpcy5uZWJ1bGEuZGVja2dsLnBpY2tPYmplY3RzKHtcbiAgICAgIHg6IE1hdGgubWluKHgxLCB4MiksXG4gICAgICB5OiBNYXRoLm1pbih5MSwgeTIpLFxuICAgICAgd2lkdGg6IE1hdGguYWJzKHgyIC0geDEpLFxuICAgICAgaGVpZ2h0OiBNYXRoLmFicyh5MiAtIHkxKSxcbiAgICAgIGxheWVySWRzOiB0aGlzLl9nZXRMYXllcklkcygpXG4gICAgfSk7XG5cbiAgICB0aGlzLl9zZWxlY3RGcm9tUGlja2luZ0luZm9zKHBpY2tpbmdJbmZvcyk7XG4gIH1cblxuICBfc2VsZWN0UG9seWdvbk9iamVjdHMoKSB7XG4gICAgY29uc3QgcGlja2luZ0luZm9zID0gdGhpcy5uZWJ1bGEuZGVja2dsLnBpY2tPYmplY3RzKHtcbiAgICAgIC4uLnRoaXMuX2dldEJvdW5kaW5nQm94KCksXG4gICAgICBsYXllcklkczogW0xBWUVSX0lEX1BJQ0ssIC4uLnRoaXMuX2dldExheWVySWRzKCldXG4gICAgfSk7XG5cbiAgICB0aGlzLl9zZWxlY3RGcm9tUGlja2luZ0luZm9zKHBpY2tpbmdJbmZvcy5maWx0ZXIoaXRlbSA9PiBpdGVtLmxheWVyLmlkICE9PSBMQVlFUl9JRF9QSUNLKSk7XG4gIH1cblxuICBfZ2V0TW91c2VQb3NGcm9tRXZlbnQoZXZlbnQ6IE9iamVjdCk6IFtudW1iZXIsIG51bWJlcl0ge1xuICAgIGNvbnN0IHsgb2Zmc2V0WCwgb2Zmc2V0WSB9ID0gZXZlbnQ7XG4gICAgcmV0dXJuIFtvZmZzZXRYLCBvZmZzZXRZXTtcbiAgfVxuXG4gIGhhbmRsZUV2ZW50KFxuICAgIGV2ZW50OiBPYmplY3QsXG4gICAgbG5nTGF0OiBbbnVtYmVyLCBudW1iZXJdLFxuICAgIHNlbGVjdGlvblR5cGU6IG51bWJlclxuICApOiB7IHJlZHJhdzogYm9vbGVhbiwgZGVhY3RpdmF0ZTogYm9vbGVhbiB9IHtcbiAgICAvLyBjYXB0dXJlIGFsbCBldmVudHMgKG1vdXNlLXVwIGlzIG5lZWRlZCB0byBwcmV2ZW50IHVzIHN0dWNrIGluIG1vdmluZyBtYXApXG4gICAgaWYgKGV2ZW50LnR5cGUgIT09ICdtb3VzZXVwJykgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICB0aGlzLnVzZVBvbHlnb24gPSBzZWxlY3Rpb25UeXBlID09PSBTRUxFQ1RJT05fVFlQRS5QT0xZR09OO1xuXG4gICAgbGV0IHJlZHJhdyA9IGZhbHNlO1xuICAgIGxldCBkZWFjdGl2YXRlID0gZmFsc2U7XG5cbiAgICBjb25zdCB7IHVzZVBvbHlnb24sIGxhbmRQb2ludHMsIG1vdXNlUG9pbnRzIH0gPSB0aGlzO1xuXG4gICAgaWYgKGV2ZW50LnR5cGUgPT09ICdtb3VzZWRvd24nKSB7XG4gICAgICBpZiAodXNlUG9seWdvbiAmJiBsYW5kUG9pbnRzLmxlbmd0aCkge1xuICAgICAgICAvLyBpZiBsYW5kUG9pbnRzLmxlbmd0aCBpcyB6ZXJvIHdlIHdhbnQgdG8gaW5zZXJ0IHR3byBwb2ludHMgKHNvIHdlIGxldCBpdCBydW4gdGhlIGVsc2UpXG4gICAgICAgIC8vIGFsc28gZG9uJ3QgaW5zZXJ0IGlmIHBvbHlnb24gaXMgaW52YWxpZFxuICAgICAgICBpZiAodGhpcy5sYW5kUG9pbnRzLmxlbmd0aCA8IDMgfHwgdGhpcy52YWxpZFBvbHlnb24pIHtcbiAgICAgICAgICBsYW5kUG9pbnRzLnB1c2gobG5nTGF0KTtcbiAgICAgICAgICBtb3VzZVBvaW50cy5wdXNoKHRoaXMuX2dldE1vdXNlUG9zRnJvbUV2ZW50KGV2ZW50KSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubGFuZFBvaW50cyA9IFtsbmdMYXQsIGxuZ0xhdF07XG4gICAgICAgIGNvbnN0IG0gPSB0aGlzLl9nZXRNb3VzZVBvc0Zyb21FdmVudChldmVudCk7XG4gICAgICAgIHRoaXMubW91c2VQb2ludHMgPSBbbSwgbV07XG4gICAgICB9XG4gICAgICByZWRyYXcgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAoZXZlbnQudHlwZSA9PT0gJ21vdXNlbW92ZScgJiYgbGFuZFBvaW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIHVwZGF0ZSBsYXN0IHBvaW50XG4gICAgICBsYW5kUG9pbnRzW2xhbmRQb2ludHMubGVuZ3RoIC0gMV0gPSBsbmdMYXQ7XG4gICAgICBtb3VzZVBvaW50c1ttb3VzZVBvaW50cy5sZW5ndGggLSAxXSA9IHRoaXMuX2dldE1vdXNlUG9zRnJvbUV2ZW50KGV2ZW50KTtcbiAgICAgIHJlZHJhdyA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChldmVudC50eXBlID09PSAnbW91c2V1cCcpIHtcbiAgICAgIGlmICh1c2VQb2x5Z29uKSB7XG4gICAgICAgIC8vIGNoZWNrIHRvIHNlZSBpZiBjb21wbGV0ZWRcbiAgICAgICAgLy8gVE9ETzogTWF5YmUgZG91YmxlLWNsaWNrIHRvIGZpbmlzaD9cbiAgICAgICAgaWYgKFxuICAgICAgICAgIGxhbmRQb2ludHMubGVuZ3RoID4gNCAmJlxuICAgICAgICAgIHR1cmZEaXN0YW5jZShsYW5kUG9pbnRzWzBdLCBsYW5kUG9pbnRzW2xhbmRQb2ludHMubGVuZ3RoIC0gMV0pIDwgUE9MWUdPTl9USFJFU0hPTEQgJiZcbiAgICAgICAgICB0aGlzLnZhbGlkUG9seWdvblxuICAgICAgICApIHtcbiAgICAgICAgICB0aGlzLl9zZWxlY3RQb2x5Z29uT2JqZWN0cygpO1xuICAgICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgICByZWRyYXcgPSB0cnVlO1xuICAgICAgICAgIGRlYWN0aXZhdGUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9zZWxlY3RSZWN0YW5nbGVPYmplY3RzKCk7XG4gICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgcmVkcmF3ID0gdHJ1ZTtcbiAgICAgICAgZGVhY3RpdmF0ZSA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgcmVkcmF3LCBkZWFjdGl2YXRlIH07XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLmxhbmRQb2ludHMgPSBbXTtcbiAgICB0aGlzLm1vdXNlUG9pbnRzID0gW107XG4gIH1cblxuICBfbWFrZVN0YXJ0UG9pbnRIaWdobGlnaHQoY2VudGVyOiBbbnVtYmVyLCBudW1iZXJdKTogbnVtYmVyW10ge1xuICAgIGNvbnN0IGJ1ZmZlciA9IHR1cmZCdWZmZXIocG9pbnQoY2VudGVyKSwgUE9MWUdPTl9USFJFU0hPTEQgLyA0LjApO1xuICAgIHJldHVybiB0dXJmQmJveFBvbHlnb24odHVyZkJib3goYnVmZmVyKSkuZ2VvbWV0cnkuY29vcmRpbmF0ZXM7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgZGF0YSA9IFtdO1xuICAgIGNvbnN0IGRhdGFQaWNrID0gW107XG5cbiAgICBpZiAoIXRoaXMudXNlUG9seWdvbiAmJiB0aGlzLmxhbmRQb2ludHMubGVuZ3RoID09PSAyKSB7XG4gICAgICAvLyBVc2UgbW91c2UgcG9pbnRzIGluc3RlYWQgb2YgbGFuZCBwb2ludHMgc28gd2UgZ2V0IHRoZSByaWdodCBzaGFwZVxuICAgICAgLy8gbm8gbWF0dGVyIHdoYXQgYmVhcmluZyBpcy5cbiAgICAgIGNvbnN0IFtbeDEsIHkxXSwgW3gyLCB5Ml1dID0gdGhpcy5tb3VzZVBvaW50cztcbiAgICAgIGNvbnN0IHNlbFBvbHlnb24gPSBbW3gxLCB5MV0sIFt4MSwgeTJdLCBbeDIsIHkyXSwgW3gyLCB5MV0sIFt4MSwgeTFdXS5tYXAobW91c2VQb3MgPT5cbiAgICAgICAgdGhpcy5uZWJ1bGEudW5wcm9qZWN0TW91c2VQb3NpdGlvbihtb3VzZVBvcylcbiAgICAgICk7XG4gICAgICBkYXRhLnB1c2goe1xuICAgICAgICBwb2x5Z29uOiBzZWxQb2x5Z29uLFxuICAgICAgICBsaW5lQ29sb3I6IFBPTFlHT05fTElORV9DT0xPUixcbiAgICAgICAgZmlsbENvbG9yOiBQT0xZR09OX0ZJTExfQ09MT1JcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAodGhpcy51c2VQb2x5Z29uICYmIHRoaXMubGFuZFBvaW50cy5sZW5ndGgpIHtcbiAgICAgIGRhdGEucHVzaCh7XG4gICAgICAgIHBvbHlnb246IHRoaXMubGFuZFBvaW50cyxcbiAgICAgICAgbGluZUNvbG9yOiBQT0xZR09OX0xJTkVfQ09MT1IsXG4gICAgICAgIGZpbGxDb2xvcjogUE9MWUdPTl9GSUxMX0NPTE9SXG4gICAgICB9KTtcblxuICAgICAgLy8gSGFjazogdXNlIGEgcG9seWdvbiB0byBoaWRlIHRoZSBvdXRzaWRlLCBiZWNhdXNlIHBpY2tPYmplY3RzKClcbiAgICAgIC8vIGRvZXMgbm90IHN1cHBvcnQgcG9seWdvbnNcbiAgICAgIGlmICh0aGlzLmxhbmRQb2ludHMubGVuZ3RoID49IDMpIHtcbiAgICAgICAgY29uc3QgbGFuZFBvaW50c1BvbHkgPSBwb2x5Z29uKFtbLi4udGhpcy5sYW5kUG9pbnRzLCB0aGlzLmxhbmRQb2ludHNbMF1dXSk7XG4gICAgICAgIGNvbnN0IGJpZ0J1ZmZlciA9IHR1cmZCdWZmZXIocG9pbnQodGhpcy5sYW5kUG9pbnRzWzBdKSwgRVhQQU5TSU9OX0tNKTtcbiAgICAgICAgbGV0IGJpZ1BvbHlnb247XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgLy8gdHVyZkRpZmZlcmVuY2UgdGhyb3dzIGFuIGV4Y2VwdGlvbiBpZiB0aGUgcG9seWdvblxuICAgICAgICAgIC8vIGludGVyc2VjdHMgd2l0aCBpdHNlbGZcbiAgICAgICAgICBiaWdQb2x5Z29uID0gdHVyZkRpZmZlcmVuY2UoYmlnQnVmZmVyLCBsYW5kUG9pbnRzUG9seSk7XG4gICAgICAgICAgZGF0YVBpY2sucHVzaCh7XG4gICAgICAgICAgICBwb2x5Z29uOiBiaWdQb2x5Z29uLmdlb21ldHJ5LmNvb3JkaW5hdGVzLFxuICAgICAgICAgICAgZmlsbENvbG9yOiBbMCwgMCwgMCwgMV1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0aGlzLnZhbGlkUG9seWdvbiA9IHRydWU7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAvLyBpbnZhbGlkIHNlbGVjdGlvbiBwb2x5Z29uXG4gICAgICAgICAgdGhpcy52YWxpZFBvbHlnb24gPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLmxhbmRQb2ludHMubGVuZ3RoKSB7XG4gICAgICAvLyBoaWdobGlnaHQgc3RhcnQgcG9pbnRcbiAgICAgIGRhdGEucHVzaCh7XG4gICAgICAgIHBvbHlnb246IHRoaXMuX21ha2VTdGFydFBvaW50SGlnaGxpZ2h0KHRoaXMubGFuZFBvaW50c1swXSksXG4gICAgICAgIGxpbmVDb2xvcjogWzAsIDAsIDAsIDBdLFxuICAgICAgICBmaWxsQ29sb3I6IFBPTFlHT05fTElORV9DT0xPUlxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gSGFjayB0byBtYWtlIHRoZSBQb2x5Z29uTGF5ZXIoKSBzdGF5IGFjdGl2ZSxcbiAgICAvLyBvdGhlcndpc2UgaXQgdGFrZXMgMyBzZWNvbmRzICghKSB0byBpbml0IVxuICAgIC8vIFRPRE86IGZpeCB0aGlzXG4gICAgZGF0YS5wdXNoKHsgcG9seWdvbjogW1swLCAwXV0gfSk7XG4gICAgZGF0YVBpY2sucHVzaCh7IHBvbHlnb246IFtbMCwgMF1dIH0pO1xuXG4gICAgcmV0dXJuIFtcbiAgICAgIG5ldyBQb2x5Z29uTGF5ZXIoe1xuICAgICAgICBpZDogTEFZRVJfSURfVklFVyxcbiAgICAgICAgZGF0YSxcbiAgICAgICAgZnA2NDogZmFsc2UsXG4gICAgICAgIG9wYWNpdHk6IDEuMCxcbiAgICAgICAgcGlja2FibGU6IGZhbHNlLFxuICAgICAgICBsaW5lV2lkdGhNaW5QaXhlbHM6IFBPTFlHT05fTElORV9XSURUSCxcbiAgICAgICAgbGluZVdpZHRoTWF4UGl4ZWxzOiBQT0xZR09OX0xJTkVfV0lEVEgsXG4gICAgICAgIGxpbmVEYXNoSnVzdGlmaWVkOiB0cnVlLFxuICAgICAgICBnZXRMaW5lRGFzaEFycmF5OiB4ID0+IFBPTFlHT05fREFTSEVTLFxuICAgICAgICBnZXRMaW5lQ29sb3I6IG9iaiA9PiBvYmoubGluZUNvbG9yIHx8IFswLCAwLCAwLCAyNTVdLFxuICAgICAgICBnZXRGaWxsQ29sb3I6IG9iaiA9PiBvYmouZmlsbENvbG9yIHx8IFswLCAwLCAwLCAyNTVdLFxuICAgICAgICBnZXRQb2x5Z29uOiBvID0+IG8ucG9seWdvblxuICAgICAgfSksXG4gICAgICBuZXcgUG9seWdvbkxheWVyKHtcbiAgICAgICAgaWQ6IExBWUVSX0lEX1BJQ0ssXG4gICAgICAgIGRhdGE6IGRhdGFQaWNrLFxuICAgICAgICBnZXRMaW5lQ29sb3I6IG9iaiA9PiBvYmoubGluZUNvbG9yIHx8IFswLCAwLCAwLCAyNTVdLFxuICAgICAgICBnZXRGaWxsQ29sb3I6IG9iaiA9PiBvYmouZmlsbENvbG9yIHx8IFswLCAwLCAwLCAyNTVdLFxuICAgICAgICBmcDY0OiBmYWxzZSxcbiAgICAgICAgb3BhY2l0eTogMS4wLFxuICAgICAgICBzdHJva2VkOiBmYWxzZSxcbiAgICAgICAgcGlja2FibGU6IHRydWUsXG4gICAgICAgIGdldFBvbHlnb246IG8gPT4gby5wb2x5Z29uXG4gICAgICB9KVxuICAgIF07XG4gIH1cbn1cbiJdfQ==