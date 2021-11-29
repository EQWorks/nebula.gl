"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SplitPolygonHandler = void 0;

var _booleanPointInPolygon = _interopRequireDefault(require("@turf/boolean-point-in-polygon"));

var _difference = _interopRequireDefault(require("@turf/difference"));

var _buffer = _interopRequireDefault(require("@turf/buffer"));

var _lineIntersect = _interopRequireDefault(require("@turf/line-intersect"));

var _helpers = require("@turf/helpers");

var _bearing = _interopRequireDefault(require("@turf/bearing"));

var _distance = _interopRequireDefault(require("@turf/distance"));

var _destination = _interopRequireDefault(require("@turf/destination"));

var _polygonToLine = _interopRequireDefault(require("@turf/polygon-to-line"));

var _nearestPointOnLine = _interopRequireDefault(require("@turf/nearest-point-on-line"));

var _utils = require("../utils");

var _modeHandler = require("./mode-handler.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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

// TODO edit-modes: delete handlers once EditMode fully implemented
var SplitPolygonHandler =
/*#__PURE__*/
function (_ModeHandler) {
  _inherits(SplitPolygonHandler, _ModeHandler);

  function SplitPolygonHandler() {
    _classCallCheck(this, SplitPolygonHandler);

    return _possibleConstructorReturn(this, _getPrototypeOf(SplitPolygonHandler).apply(this, arguments));
  }

  _createClass(SplitPolygonHandler, [{
    key: "calculateGroundCoords",
    value: function calculateGroundCoords(clickSequence, groundCoords) {
      var modeConfig = this.getModeConfig();

      if (!modeConfig || !modeConfig.lock90Degree || !clickSequence.length) {
        return groundCoords;
      }

      if (clickSequence.length === 1) {
        // if first point is clicked, then find closest polygon point and build ~90deg vector
        var firstPoint = clickSequence[0];
        var selectedGeometry = this.getSelectedGeometry();
        var feature = (0, _polygonToLine.default)(selectedGeometry);
        var lines = feature.type === 'FeatureCollection' ? feature.features : [feature];
        var minDistance = Number.MAX_SAFE_INTEGER;
        var closestPoint = null; // If Multipolygon, then we should find nearest polygon line and stick split to it.

        lines.forEach(function (line) {
          var snapPoint = (0, _nearestPointOnLine.default)(line, firstPoint);
          var distanceFromOrigin = (0, _distance.default)(snapPoint, firstPoint);

          if (minDistance > distanceFromOrigin) {
            minDistance = distanceFromOrigin;
            closestPoint = snapPoint;
          }
        });

        if (closestPoint) {
          // closest point is used as 90degree entry to the polygon
          var lastBearing = (0, _bearing.default)(firstPoint, closestPoint);
          var currentDistance = (0, _distance.default)(firstPoint, groundCoords, {
            units: 'meters'
          });
          return (0, _destination.default)(firstPoint, currentDistance, lastBearing, {
            units: 'meters'
          }).geometry.coordinates;
        }

        return groundCoords;
      } // Allow only 90 degree turns


      var lastPoint = clickSequence[clickSequence.length - 1];

      var _generatePointsParall = (0, _utils.generatePointsParallelToLinePoints)(clickSequence[clickSequence.length - 2], lastPoint, groundCoords),
          _generatePointsParall2 = _slicedToArray(_generatePointsParall, 1),
          approximatePoint = _generatePointsParall2[0]; // align point with current ground


      var nearestPt = (0, _nearestPointOnLine.default)((0, _helpers.lineString)([lastPoint, approximatePoint]), groundCoords).geometry.coordinates;
      return nearestPt;
    }
  }, {
    key: "handleClick",
    value: function handleClick(event) {
      _get(_getPrototypeOf(SplitPolygonHandler.prototype), "handleClick", this).call(this, _objectSpread({}, event, {
        groundCoords: this.calculateGroundCoords(this.getClickSequence(), event.groundCoords)
      }));

      var editAction = null;
      var tentativeFeature = this.getTentativeFeature();
      var selectedGeometry = this.getSelectedGeometry();
      var clickSequence = this.getClickSequence();

      if (!selectedGeometry) {
        // eslint-disable-next-line no-console,no-undef
        console.warn('A polygon must be selected for splitting');

        this._setTentativeFeature(null);

        return editAction;
      }

      var pt = {
        type: 'Point',
        coordinates: clickSequence[clickSequence.length - 1]
      };
      var isPointInPolygon = (0, _booleanPointInPolygon.default)(pt, selectedGeometry);

      if (clickSequence.length > 1 && tentativeFeature && !isPointInPolygon) {
        this.resetClickSequence();
        var isLineInterectingWithPolygon = (0, _lineIntersect.default)(tentativeFeature, selectedGeometry);

        if (isLineInterectingWithPolygon.features.length === 0) {
          this._setTentativeFeature(null);

          return editAction;
        }

        return this.splitPolygon();
      }

      return editAction;
    }
  }, {
    key: "handlePointerMove",
    value: function handlePointerMove(_ref) {
      var groundCoords = _ref.groundCoords;
      var clickSequence = this.getClickSequence();
      var result = {
        editAction: null,
        cancelMapPan: false
      };

      if (clickSequence.length === 0) {
        // nothing to do yet
        return result;
      }

      this._setTentativeFeature({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: _toConsumableArray(clickSequence).concat([this.calculateGroundCoords(clickSequence, groundCoords)])
        }
      });

      return result;
    }
  }, {
    key: "splitPolygon",
    value: function splitPolygon() {
      var selectedGeometry = this.getSelectedGeometry();
      var tentativeFeature = this.getTentativeFeature();
      var featureIndex = this.getSelectedFeatureIndexes()[0];
      var modeConfig = this.getModeConfig() || {}; // Default gap in between the polygon

      var _modeConfig$gap = modeConfig.gap,
          gap = _modeConfig$gap === void 0 ? 0.1 : _modeConfig$gap,
          _modeConfig$units = modeConfig.units,
          units = _modeConfig$units === void 0 ? 'centimeters' : _modeConfig$units;

      if (gap === 0) {
        gap = 0.1;
        units = 'centimeters';
      }

      var buffer = (0, _buffer.default)(tentativeFeature, gap, {
        units: units
      });
      var updatedGeometry = (0, _difference.default)(selectedGeometry, buffer);

      this._setTentativeFeature(null);

      if (!updatedGeometry) {
        // eslint-disable-next-line no-console,no-undef
        console.warn('Canceling edit. Split Polygon erased');
        return null;
      }

      var _updatedGeometry$geom = updatedGeometry.geometry,
          type = _updatedGeometry$geom.type,
          coordinates = _updatedGeometry$geom.coordinates;
      var updatedCoordinates = [];

      if (type === 'Polygon') {
        // Update the coordinates as per Multipolygon
        updatedCoordinates = coordinates.map(function (c) {
          return [c];
        });
      } else {
        // Handle Case when Multipolygon has holes
        updatedCoordinates = coordinates.reduce(function (agg, prev) {
          prev.forEach(function (p) {
            agg.push([p]);
          });
          return agg;
        }, []);
      } // Update the type to Mulitpolygon


      var updatedData = this.getImmutableFeatureCollection().replaceGeometry(featureIndex, {
        type: 'MultiPolygon',
        coordinates: updatedCoordinates
      });
      var editAction = {
        updatedData: updatedData.getObject(),
        editType: 'split',
        featureIndexes: [featureIndex],
        editContext: null
      };
      return editAction;
    }
  }]);

  return SplitPolygonHandler;
}(_modeHandler.ModeHandler);

exports.SplitPolygonHandler = SplitPolygonHandler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL3NwbGl0LXBvbHlnb24taGFuZGxlci5qcyJdLCJuYW1lcyI6WyJTcGxpdFBvbHlnb25IYW5kbGVyIiwiY2xpY2tTZXF1ZW5jZSIsImdyb3VuZENvb3JkcyIsIm1vZGVDb25maWciLCJnZXRNb2RlQ29uZmlnIiwibG9jazkwRGVncmVlIiwibGVuZ3RoIiwiZmlyc3RQb2ludCIsInNlbGVjdGVkR2VvbWV0cnkiLCJnZXRTZWxlY3RlZEdlb21ldHJ5IiwiZmVhdHVyZSIsImxpbmVzIiwidHlwZSIsImZlYXR1cmVzIiwibWluRGlzdGFuY2UiLCJOdW1iZXIiLCJNQVhfU0FGRV9JTlRFR0VSIiwiY2xvc2VzdFBvaW50IiwiZm9yRWFjaCIsImxpbmUiLCJzbmFwUG9pbnQiLCJkaXN0YW5jZUZyb21PcmlnaW4iLCJsYXN0QmVhcmluZyIsImN1cnJlbnREaXN0YW5jZSIsInVuaXRzIiwiZ2VvbWV0cnkiLCJjb29yZGluYXRlcyIsImxhc3RQb2ludCIsImFwcHJveGltYXRlUG9pbnQiLCJuZWFyZXN0UHQiLCJldmVudCIsImNhbGN1bGF0ZUdyb3VuZENvb3JkcyIsImdldENsaWNrU2VxdWVuY2UiLCJlZGl0QWN0aW9uIiwidGVudGF0aXZlRmVhdHVyZSIsImdldFRlbnRhdGl2ZUZlYXR1cmUiLCJjb25zb2xlIiwid2FybiIsIl9zZXRUZW50YXRpdmVGZWF0dXJlIiwicHQiLCJpc1BvaW50SW5Qb2x5Z29uIiwicmVzZXRDbGlja1NlcXVlbmNlIiwiaXNMaW5lSW50ZXJlY3RpbmdXaXRoUG9seWdvbiIsInNwbGl0UG9seWdvbiIsInJlc3VsdCIsImNhbmNlbE1hcFBhbiIsImZlYXR1cmVJbmRleCIsImdldFNlbGVjdGVkRmVhdHVyZUluZGV4ZXMiLCJnYXAiLCJidWZmZXIiLCJ1cGRhdGVkR2VvbWV0cnkiLCJ1cGRhdGVkQ29vcmRpbmF0ZXMiLCJtYXAiLCJjIiwicmVkdWNlIiwiYWdnIiwicHJldiIsInAiLCJwdXNoIiwidXBkYXRlZERhdGEiLCJnZXRJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbiIsInJlcGxhY2VHZW9tZXRyeSIsImdldE9iamVjdCIsImVkaXRUeXBlIiwiZmVhdHVyZUluZGV4ZXMiLCJlZGl0Q29udGV4dCIsIk1vZGVIYW5kbGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBR0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQTtJQUNhQSxtQjs7Ozs7Ozs7Ozs7OzswQ0FDV0MsYSxFQUFvQkMsWSxFQUFtQjtBQUMzRCxVQUFNQyxVQUFVLEdBQUcsS0FBS0MsYUFBTCxFQUFuQjs7QUFDQSxVQUFJLENBQUNELFVBQUQsSUFBZSxDQUFDQSxVQUFVLENBQUNFLFlBQTNCLElBQTJDLENBQUNKLGFBQWEsQ0FBQ0ssTUFBOUQsRUFBc0U7QUFDcEUsZUFBT0osWUFBUDtBQUNEOztBQUNELFVBQUlELGFBQWEsQ0FBQ0ssTUFBZCxLQUF5QixDQUE3QixFQUFnQztBQUM5QjtBQUNBLFlBQU1DLFVBQVUsR0FBR04sYUFBYSxDQUFDLENBQUQsQ0FBaEM7QUFDQSxZQUFNTyxnQkFBZ0IsR0FBRyxLQUFLQyxtQkFBTCxFQUF6QjtBQUNBLFlBQU1DLE9BQU8sR0FBRyw0QkFBa0JGLGdCQUFsQixDQUFoQjtBQUVBLFlBQU1HLEtBQUssR0FBR0QsT0FBTyxDQUFDRSxJQUFSLEtBQWlCLG1CQUFqQixHQUF1Q0YsT0FBTyxDQUFDRyxRQUEvQyxHQUEwRCxDQUFDSCxPQUFELENBQXhFO0FBQ0EsWUFBSUksV0FBVyxHQUFHQyxNQUFNLENBQUNDLGdCQUF6QjtBQUNBLFlBQUlDLFlBQVksR0FBRyxJQUFuQixDQVI4QixDQVM5Qjs7QUFDQU4sUUFBQUEsS0FBSyxDQUFDTyxPQUFOLENBQWMsVUFBQUMsSUFBSSxFQUFJO0FBQ3BCLGNBQU1DLFNBQVMsR0FBRyxpQ0FBbUJELElBQW5C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QjtBQUtBLFVBQU1sQixVQUFzQixHQUFHO0FBQzdCMEIsUUFBQUEsV0FBVyxFQUFFQSxXQUFXLENBQUNHLFNBQVosRUFEZ0I7QUFFN0JDLFFBQUFBLFFBQVEsRUFBRSxPQUZtQjtBQUc3QkMsUUFBQUEsY0FBYyxFQUFFLENBQUNsQixZQUFELENBSGE7QUFJN0JtQixRQUFBQSxXQUFXLEVBQUU7QUFKZ0IsT0FBL0I7QUFPQSxhQUFPaEMsVUFBUDtBQUNEOzs7O0VBM0pzQ2lDLHdCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuaW1wb3J0IGJvb2xlYW5Qb2ludEluUG9seWdvbiBmcm9tICdAdHVyZi9ib29sZWFuLXBvaW50LWluLXBvbHlnb24nO1xuaW1wb3J0IHR1cmZEaWZmZXJlbmNlIGZyb20gJ0B0dXJmL2RpZmZlcmVuY2UnO1xuaW1wb3J0IHR1cmZCdWZmZXIgZnJvbSAnQHR1cmYvYnVmZmVyJztcbmltcG9ydCBsaW5lSW50ZXJzZWN0IGZyb20gJ0B0dXJmL2xpbmUtaW50ZXJzZWN0JztcbmltcG9ydCB7IGxpbmVTdHJpbmcgfSBmcm9tICdAdHVyZi9oZWxwZXJzJztcbmltcG9ydCB0dXJmQmVhcmluZyBmcm9tICdAdHVyZi9iZWFyaW5nJztcbmltcG9ydCB0dXJmRGlzdGFuY2UgZnJvbSAnQHR1cmYvZGlzdGFuY2UnO1xuaW1wb3J0IHR1cmZEZXN0aW5hdGlvbiBmcm9tICdAdHVyZi9kZXN0aW5hdGlvbic7XG5pbXBvcnQgdHVyZlBvbHlnb25Ub0xpbmUgZnJvbSAnQHR1cmYvcG9seWdvbi10by1saW5lJztcbmltcG9ydCBuZWFyZXN0UG9pbnRPbkxpbmUgZnJvbSAnQHR1cmYvbmVhcmVzdC1wb2ludC1vbi1saW5lJztcbmltcG9ydCB7IGdlbmVyYXRlUG9pbnRzUGFyYWxsZWxUb0xpbmVQb2ludHMgfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQgdHlwZSB7IENsaWNrRXZlbnQsIFBvaW50ZXJNb3ZlRXZlbnQgfSBmcm9tICcuLi9ldmVudC10eXBlcy5qcyc7XG5pbXBvcnQgdHlwZSB7IEVkaXRBY3Rpb24gfSBmcm9tICcuL21vZGUtaGFuZGxlci5qcyc7XG5pbXBvcnQgeyBNb2RlSGFuZGxlciB9IGZyb20gJy4vbW9kZS1oYW5kbGVyLmpzJztcblxuLy8gVE9ETyBlZGl0LW1vZGVzOiBkZWxldGUgaGFuZGxlcnMgb25jZSBFZGl0TW9kZSBmdWxseSBpbXBsZW1lbnRlZFxuZXhwb3J0IGNsYXNzIFNwbGl0UG9seWdvbkhhbmRsZXIgZXh0ZW5kcyBNb2RlSGFuZGxlciB7XG4gIGNhbGN1bGF0ZUdyb3VuZENvb3JkcyhjbGlja1NlcXVlbmNlOiBhbnksIGdyb3VuZENvb3JkczogYW55KSB7XG4gICAgY29uc3QgbW9kZUNvbmZpZyA9IHRoaXMuZ2V0TW9kZUNvbmZpZygpO1xuICAgIGlmICghbW9kZUNvbmZpZyB8fCAhbW9kZUNvbmZpZy5sb2NrOTBEZWdyZWUgfHwgIWNsaWNrU2VxdWVuY2UubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gZ3JvdW5kQ29vcmRzO1xuICAgIH1cbiAgICBpZiAoY2xpY2tTZXF1ZW5jZS5sZW5ndGggPT09IDEpIHtcbiAgICAgIC8vIGlmIGZpcnN0IHBvaW50IGlzIGNsaWNrZWQsIHRoZW4gZmluZCBjbG9zZXN0IHBvbHlnb24gcG9pbnQgYW5kIGJ1aWxkIH45MGRlZyB2ZWN0b3JcbiAgICAgIGNvbnN0IGZpcnN0UG9pbnQgPSBjbGlja1NlcXVlbmNlWzBdO1xuICAgICAgY29uc3Qgc2VsZWN0ZWRHZW9tZXRyeSA9IHRoaXMuZ2V0U2VsZWN0ZWRHZW9tZXRyeSgpO1xuICAgICAgY29uc3QgZmVhdHVyZSA9IHR1cmZQb2x5Z29uVG9MaW5lKHNlbGVjdGVkR2VvbWV0cnkpO1xuXG4gICAgICBjb25zdCBsaW5lcyA9IGZlYXR1cmUudHlwZSA9PT0gJ0ZlYXR1cmVDb2xsZWN0aW9uJyA/IGZlYXR1cmUuZmVhdHVyZXMgOiBbZmVhdHVyZV07XG4gICAgICBsZXQgbWluRGlzdGFuY2UgPSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcbiAgICAgIGxldCBjbG9zZXN0UG9pbnQgPSBudWxsO1xuICAgICAgLy8gSWYgTXVsdGlwb2x5Z29uLCB0aGVuIHdlIHNob3VsZCBmaW5kIG5lYXJlc3QgcG9seWdvbiBsaW5lIGFuZCBzdGljayBzcGxpdCB0byBpdC5cbiAgICAgIGxpbmVzLmZvckVhY2gobGluZSA9PiB7XG4gICAgICAgIGNvbnN0IHNuYXBQb2ludCA9IG5lYXJlc3RQb2ludE9uTGluZShsaW5lLCBmaXJzdFBvaW50KTtcbiAgICAgICAgY29uc3QgZGlzdGFuY2VGcm9tT3JpZ2luID0gdHVyZkRpc3RhbmNlKHNuYXBQb2ludCwgZmlyc3RQb2ludCk7XG4gICAgICAgIGlmIChtaW5EaXN0YW5jZSA+IGRpc3RhbmNlRnJvbU9yaWdpbikge1xuICAgICAgICAgIG1pbkRpc3RhbmNlID0gZGlzdGFuY2VGcm9tT3JpZ2luO1xuICAgICAgICAgIGNsb3Nlc3RQb2ludCA9IHNuYXBQb2ludDtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGlmIChjbG9zZXN0UG9pbnQpIHtcbiAgICAgICAgLy8gY2xvc2VzdCBwb2ludCBpcyB1c2VkIGFzIDkwZGVncmVlIGVudHJ5IHRvIHRoZSBwb2x5Z29uXG4gICAgICAgIGNvbnN0IGxhc3RCZWFyaW5nID0gdHVyZkJlYXJpbmcoZmlyc3RQb2ludCwgY2xvc2VzdFBvaW50KTtcbiAgICAgICAgY29uc3QgY3VycmVudERpc3RhbmNlID0gdHVyZkRpc3RhbmNlKGZpcnN0UG9pbnQsIGdyb3VuZENvb3JkcywgeyB1bml0czogJ21ldGVycycgfSk7XG4gICAgICAgIHJldHVybiB0dXJmRGVzdGluYXRpb24oZmlyc3RQb2ludCwgY3VycmVudERpc3RhbmNlLCBsYXN0QmVhcmluZywge1xuICAgICAgICAgIHVuaXRzOiAnbWV0ZXJzJ1xuICAgICAgICB9KS5nZW9tZXRyeS5jb29yZGluYXRlcztcbiAgICAgIH1cbiAgICAgIHJldHVybiBncm91bmRDb29yZHM7XG4gICAgfVxuICAgIC8vIEFsbG93IG9ubHkgOTAgZGVncmVlIHR1cm5zXG4gICAgY29uc3QgbGFzdFBvaW50ID0gY2xpY2tTZXF1ZW5jZVtjbGlja1NlcXVlbmNlLmxlbmd0aCAtIDFdO1xuICAgIGNvbnN0IFthcHByb3hpbWF0ZVBvaW50XSA9IGdlbmVyYXRlUG9pbnRzUGFyYWxsZWxUb0xpbmVQb2ludHMoXG4gICAgICBjbGlja1NlcXVlbmNlW2NsaWNrU2VxdWVuY2UubGVuZ3RoIC0gMl0sXG4gICAgICBsYXN0UG9pbnQsXG4gICAgICBncm91bmRDb29yZHNcbiAgICApO1xuICAgIC8vIGFsaWduIHBvaW50IHdpdGggY3VycmVudCBncm91bmRcbiAgICBjb25zdCBuZWFyZXN0UHQgPSBuZWFyZXN0UG9pbnRPbkxpbmUobGluZVN0cmluZyhbbGFzdFBvaW50LCBhcHByb3hpbWF0ZVBvaW50XSksIGdyb3VuZENvb3JkcylcbiAgICAgIC5nZW9tZXRyeS5jb29yZGluYXRlcztcbiAgICByZXR1cm4gbmVhcmVzdFB0O1xuICB9XG5cbiAgaGFuZGxlQ2xpY2soZXZlbnQ6IENsaWNrRXZlbnQpOiA/RWRpdEFjdGlvbiB7XG4gICAgc3VwZXIuaGFuZGxlQ2xpY2soe1xuICAgICAgLi4uZXZlbnQsXG4gICAgICBncm91bmRDb29yZHM6IHRoaXMuY2FsY3VsYXRlR3JvdW5kQ29vcmRzKHRoaXMuZ2V0Q2xpY2tTZXF1ZW5jZSgpLCBldmVudC5ncm91bmRDb29yZHMpXG4gICAgfSk7XG4gICAgY29uc3QgZWRpdEFjdGlvbjogP0VkaXRBY3Rpb24gPSBudWxsO1xuICAgIGNvbnN0IHRlbnRhdGl2ZUZlYXR1cmUgPSB0aGlzLmdldFRlbnRhdGl2ZUZlYXR1cmUoKTtcbiAgICBjb25zdCBzZWxlY3RlZEdlb21ldHJ5ID0gdGhpcy5nZXRTZWxlY3RlZEdlb21ldHJ5KCk7XG4gICAgY29uc3QgY2xpY2tTZXF1ZW5jZSA9IHRoaXMuZ2V0Q2xpY2tTZXF1ZW5jZSgpO1xuXG4gICAgaWYgKCFzZWxlY3RlZEdlb21ldHJ5KSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZSxuby11bmRlZlxuICAgICAgY29uc29sZS53YXJuKCdBIHBvbHlnb24gbXVzdCBiZSBzZWxlY3RlZCBmb3Igc3BsaXR0aW5nJyk7XG4gICAgICB0aGlzLl9zZXRUZW50YXRpdmVGZWF0dXJlKG51bGwpO1xuICAgICAgcmV0dXJuIGVkaXRBY3Rpb247XG4gICAgfVxuICAgIGNvbnN0IHB0ID0ge1xuICAgICAgdHlwZTogJ1BvaW50JyxcbiAgICAgIGNvb3JkaW5hdGVzOiBjbGlja1NlcXVlbmNlW2NsaWNrU2VxdWVuY2UubGVuZ3RoIC0gMV1cbiAgICB9O1xuICAgIGNvbnN0IGlzUG9pbnRJblBvbHlnb24gPSBib29sZWFuUG9pbnRJblBvbHlnb24ocHQsIHNlbGVjdGVkR2VvbWV0cnkpO1xuICAgIGlmIChjbGlja1NlcXVlbmNlLmxlbmd0aCA+IDEgJiYgdGVudGF0aXZlRmVhdHVyZSAmJiAhaXNQb2ludEluUG9seWdvbikge1xuICAgICAgdGhpcy5yZXNldENsaWNrU2VxdWVuY2UoKTtcbiAgICAgIGNvbnN0IGlzTGluZUludGVyZWN0aW5nV2l0aFBvbHlnb24gPSBsaW5lSW50ZXJzZWN0KHRlbnRhdGl2ZUZlYXR1cmUsIHNlbGVjdGVkR2VvbWV0cnkpO1xuICAgICAgaWYgKGlzTGluZUludGVyZWN0aW5nV2l0aFBvbHlnb24uZmVhdHVyZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRoaXMuX3NldFRlbnRhdGl2ZUZlYXR1cmUobnVsbCk7XG4gICAgICAgIHJldHVybiBlZGl0QWN0aW9uO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuc3BsaXRQb2x5Z29uKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVkaXRBY3Rpb247XG4gIH1cblxuICBoYW5kbGVQb2ludGVyTW92ZSh7XG4gICAgZ3JvdW5kQ29vcmRzXG4gIH06IFBvaW50ZXJNb3ZlRXZlbnQpOiB7IGVkaXRBY3Rpb246ID9FZGl0QWN0aW9uLCBjYW5jZWxNYXBQYW46IGJvb2xlYW4gfSB7XG4gICAgY29uc3QgY2xpY2tTZXF1ZW5jZSA9IHRoaXMuZ2V0Q2xpY2tTZXF1ZW5jZSgpO1xuICAgIGNvbnN0IHJlc3VsdCA9IHsgZWRpdEFjdGlvbjogbnVsbCwgY2FuY2VsTWFwUGFuOiBmYWxzZSB9O1xuXG4gICAgaWYgKGNsaWNrU2VxdWVuY2UubGVuZ3RoID09PSAwKSB7XG4gICAgICAvLyBub3RoaW5nIHRvIGRvIHlldFxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICB0aGlzLl9zZXRUZW50YXRpdmVGZWF0dXJlKHtcbiAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgIHR5cGU6ICdMaW5lU3RyaW5nJyxcbiAgICAgICAgY29vcmRpbmF0ZXM6IFsuLi5jbGlja1NlcXVlbmNlLCB0aGlzLmNhbGN1bGF0ZUdyb3VuZENvb3JkcyhjbGlja1NlcXVlbmNlLCBncm91bmRDb29yZHMpXVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHNwbGl0UG9seWdvbigpIHtcbiAgICBjb25zdCBzZWxlY3RlZEdlb21ldHJ5ID0gdGhpcy5nZXRTZWxlY3RlZEdlb21ldHJ5KCk7XG4gICAgY29uc3QgdGVudGF0aXZlRmVhdHVyZSA9IHRoaXMuZ2V0VGVudGF0aXZlRmVhdHVyZSgpO1xuICAgIGNvbnN0IGZlYXR1cmVJbmRleCA9IHRoaXMuZ2V0U2VsZWN0ZWRGZWF0dXJlSW5kZXhlcygpWzBdO1xuICAgIGNvbnN0IG1vZGVDb25maWcgPSB0aGlzLmdldE1vZGVDb25maWcoKSB8fCB7fTtcblxuICAgIC8vIERlZmF1bHQgZ2FwIGluIGJldHdlZW4gdGhlIHBvbHlnb25cbiAgICBsZXQgeyBnYXAgPSAwLjEsIHVuaXRzID0gJ2NlbnRpbWV0ZXJzJyB9ID0gbW9kZUNvbmZpZztcbiAgICBpZiAoZ2FwID09PSAwKSB7XG4gICAgICBnYXAgPSAwLjE7XG4gICAgICB1bml0cyA9ICdjZW50aW1ldGVycyc7XG4gICAgfVxuXG4gICAgY29uc3QgYnVmZmVyID0gdHVyZkJ1ZmZlcih0ZW50YXRpdmVGZWF0dXJlLCBnYXAsIHsgdW5pdHMgfSk7XG4gICAgY29uc3QgdXBkYXRlZEdlb21ldHJ5ID0gdHVyZkRpZmZlcmVuY2Uoc2VsZWN0ZWRHZW9tZXRyeSwgYnVmZmVyKTtcbiAgICB0aGlzLl9zZXRUZW50YXRpdmVGZWF0dXJlKG51bGwpO1xuICAgIGlmICghdXBkYXRlZEdlb21ldHJ5KSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZSxuby11bmRlZlxuICAgICAgY29uc29sZS53YXJuKCdDYW5jZWxpbmcgZWRpdC4gU3BsaXQgUG9seWdvbiBlcmFzZWQnKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHsgdHlwZSwgY29vcmRpbmF0ZXMgfSA9IHVwZGF0ZWRHZW9tZXRyeS5nZW9tZXRyeTtcbiAgICBsZXQgdXBkYXRlZENvb3JkaW5hdGVzID0gW107XG4gICAgaWYgKHR5cGUgPT09ICdQb2x5Z29uJykge1xuICAgICAgLy8gVXBkYXRlIHRoZSBjb29yZGluYXRlcyBhcyBwZXIgTXVsdGlwb2x5Z29uXG4gICAgICB1cGRhdGVkQ29vcmRpbmF0ZXMgPSBjb29yZGluYXRlcy5tYXAoYyA9PiBbY10pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBIYW5kbGUgQ2FzZSB3aGVuIE11bHRpcG9seWdvbiBoYXMgaG9sZXNcbiAgICAgIHVwZGF0ZWRDb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzLnJlZHVjZSgoYWdnLCBwcmV2KSA9PiB7XG4gICAgICAgIHByZXYuZm9yRWFjaChwID0+IHtcbiAgICAgICAgICBhZ2cucHVzaChbcF0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGFnZztcbiAgICAgIH0sIFtdKTtcbiAgICB9XG5cbiAgICAvLyBVcGRhdGUgdGhlIHR5cGUgdG8gTXVsaXRwb2x5Z29uXG4gICAgY29uc3QgdXBkYXRlZERhdGEgPSB0aGlzLmdldEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uKCkucmVwbGFjZUdlb21ldHJ5KGZlYXR1cmVJbmRleCwge1xuICAgICAgdHlwZTogJ011bHRpUG9seWdvbicsXG4gICAgICBjb29yZGluYXRlczogdXBkYXRlZENvb3JkaW5hdGVzXG4gICAgfSk7XG5cbiAgICBjb25zdCBlZGl0QWN0aW9uOiBFZGl0QWN0aW9uID0ge1xuICAgICAgdXBkYXRlZERhdGE6IHVwZGF0ZWREYXRhLmdldE9iamVjdCgpLFxuICAgICAgZWRpdFR5cGU6ICdzcGxpdCcsXG4gICAgICBmZWF0dXJlSW5kZXhlczogW2ZlYXR1cmVJbmRleF0sXG4gICAgICBlZGl0Q29udGV4dDogbnVsbFxuICAgIH07XG5cbiAgICByZXR1cm4gZWRpdEFjdGlvbjtcbiAgfVxufVxuIl19