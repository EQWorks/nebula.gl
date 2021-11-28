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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL3NwbGl0LXBvbHlnb24taGFuZGxlci5qcyJdLCJuYW1lcyI6WyJTcGxpdFBvbHlnb25IYW5kbGVyIiwiY2xpY2tTZXF1ZW5jZSIsImdyb3VuZENvb3JkcyIsIm1vZGVDb25maWciLCJnZXRNb2RlQ29uZmlnIiwibG9jazkwRGVncmVlIiwibGVuZ3RoIiwiZmlyc3RQb2ludCIsInNlbGVjdGVkR2VvbWV0cnkiLCJnZXRTZWxlY3RlZEdlb21ldHJ5IiwiZmVhdHVyZSIsImxpbmVzIiwidHlwZSIsImZlYXR1cmVzIiwibWluRGlzdGFuY2UiLCJOdW1iZXIiLCJNQVhfU0FGRV9JTlRFR0VSIiwiY2xvc2VzdFBvaW50IiwiZm9yRWFjaCIsImxpbmUiLCJzbmFwUG9pbnQiLCJkaXN0YW5jZUZyb21PcmlnaW4iLCJsYXN0QmVhcmluZyIsImN1cnJlbnREaXN0YW5jZSIsInVuaXRzIiwiZ2VvbWV0cnkiLCJjb29yZGluYXRlcyIsImxhc3RQb2ludCIsImFwcHJveGltYXRlUG9pbnQiLCJuZWFyZXN0UHQiLCJldmVudCIsImNhbGN1bGF0ZUdyb3VuZENvb3JkcyIsImdldENsaWNrU2VxdWVuY2UiLCJlZGl0QWN0aW9uIiwidGVudGF0aXZlRmVhdHVyZSIsImdldFRlbnRhdGl2ZUZlYXR1cmUiLCJjb25zb2xlIiwid2FybiIsIl9zZXRUZW50YXRpdmVGZWF0dXJlIiwicHQiLCJpc1BvaW50SW5Qb2x5Z29uIiwicmVzZXRDbGlja1NlcXVlbmNlIiwiaXNMaW5lSW50ZXJlY3RpbmdXaXRoUG9seWdvbiIsInNwbGl0UG9seWdvbiIsInJlc3VsdCIsImNhbmNlbE1hcFBhbiIsImZlYXR1cmVJbmRleCIsImdldFNlbGVjdGVkRmVhdHVyZUluZGV4ZXMiLCJnYXAiLCJidWZmZXIiLCJ1cGRhdGVkR2VvbWV0cnkiLCJ1cGRhdGVkQ29vcmRpbmF0ZXMiLCJtYXAiLCJjIiwicmVkdWNlIiwiYWdnIiwicHJldiIsInAiLCJwdXNoIiwidXBkYXRlZERhdGEiLCJnZXRJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbiIsInJlcGxhY2VHZW9tZXRyeSIsImdldE9iamVjdCIsImVkaXRUeXBlIiwiZmVhdHVyZUluZGV4ZXMiLCJlZGl0Q29udGV4dCIsIk1vZGVIYW5kbGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBR0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFFYUEsbUI7Ozs7Ozs7Ozs7Ozs7MENBQ1dDLGEsRUFBb0JDLFksRUFBbUI7QUFDM0QsVUFBTUMsVUFBVSxHQUFHLEtBQUtDLGFBQUwsRUFBbkI7O0FBQ0EsVUFBSSxDQUFDRCxVQUFELElBQWUsQ0FBQ0EsVUFBVSxDQUFDRSxZQUEzQixJQUEyQyxDQUFDSixhQUFhLENBQUNLLE1BQTlELEVBQXNFO0FBQ3BFLGVBQU9KLFlBQVA7QUFDRDs7QUFDRCxVQUFJRCxhQUFhLENBQUNLLE1BQWQsS0FBeUIsQ0FBN0IsRUFBZ0M7QUFDOUI7QUFDQSxZQUFNQyxVQUFVLEdBQUdOLGFBQWEsQ0FBQyxDQUFELENBQWhDO0FBQ0EsWUFBTU8sZ0JBQWdCLEdBQUcsS0FBS0MsbUJBQUwsRUFBekI7QUFDQSxZQUFNQyxPQUFPLEdBQUcsNEJBQWtCRixnQkFBbEIsQ0FBaEI7QUFFQSxZQUFNRyxLQUFLLEdBQUdELE9BQU8sQ0FBQ0UsSUFBUixLQUFpQixtQkFBakIsR0FBdUNGLE9BQU8sQ0FBQ0csUUFBL0MsR0FBMEQsQ0FBQ0gsT0FBRCxDQUF4RTtBQUNBLFlBQUlJLFdBQVcsR0FBR0MsTUFBTSxDQUFDQyxnQkFBekI7QUFDQSxZQUFJQyxZQUFZLEdBQUcsSUFBbkIsQ0FSOEIsQ0FTOUI7O0FBQ0FOLFFBQUFBLEtBQUssQ0FBQ08sT0FBTixDQUFjLFVBQUFDLElBQUksRUFBSTtBQUNwQixjQUFNQyxTQUFTLEdBQUcsaUNBQW1CRCxJQUFuQixFQUF5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QSxVQUFNbEIsVUFBc0IsR0FBRztBQUM3QjBCLFFBQUFBLFdBQVcsRUFBRUEsV0FBVyxDQUFDRyxTQUFaLEVBRGdCO0FBRTdCQyxRQUFBQSxRQUFRLEVBQUUsT0FGbUI7QUFHN0JDLFFBQUFBLGNBQWMsRUFBRSxDQUFDbEIsWUFBRCxDQUhhO0FBSTdCbUIsUUFBQUEsV0FBVyxFQUFFO0FBSmdCLE9BQS9CO0FBT0EsYUFBT2hDLFVBQVA7QUFDRDs7OztFQTNKc0NpQyx3QiIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbmltcG9ydCBib29sZWFuUG9pbnRJblBvbHlnb24gZnJvbSAnQHR1cmYvYm9vbGVhbi1wb2ludC1pbi1wb2x5Z29uJztcbmltcG9ydCB0dXJmRGlmZmVyZW5jZSBmcm9tICdAdHVyZi9kaWZmZXJlbmNlJztcbmltcG9ydCB0dXJmQnVmZmVyIGZyb20gJ0B0dXJmL2J1ZmZlcic7XG5pbXBvcnQgbGluZUludGVyc2VjdCBmcm9tICdAdHVyZi9saW5lLWludGVyc2VjdCc7XG5pbXBvcnQgeyBsaW5lU3RyaW5nIH0gZnJvbSAnQHR1cmYvaGVscGVycyc7XG5pbXBvcnQgdHVyZkJlYXJpbmcgZnJvbSAnQHR1cmYvYmVhcmluZyc7XG5pbXBvcnQgdHVyZkRpc3RhbmNlIGZyb20gJ0B0dXJmL2Rpc3RhbmNlJztcbmltcG9ydCB0dXJmRGVzdGluYXRpb24gZnJvbSAnQHR1cmYvZGVzdGluYXRpb24nO1xuaW1wb3J0IHR1cmZQb2x5Z29uVG9MaW5lIGZyb20gJ0B0dXJmL3BvbHlnb24tdG8tbGluZSc7XG5pbXBvcnQgbmVhcmVzdFBvaW50T25MaW5lIGZyb20gJ0B0dXJmL25lYXJlc3QtcG9pbnQtb24tbGluZSc7XG5pbXBvcnQgeyBnZW5lcmF0ZVBvaW50c1BhcmFsbGVsVG9MaW5lUG9pbnRzIH0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IHR5cGUgeyBDbGlja0V2ZW50LCBQb2ludGVyTW92ZUV2ZW50IH0gZnJvbSAnLi4vZXZlbnQtdHlwZXMuanMnO1xuaW1wb3J0IHR5cGUgeyBFZGl0QWN0aW9uIH0gZnJvbSAnLi9tb2RlLWhhbmRsZXIuanMnO1xuaW1wb3J0IHsgTW9kZUhhbmRsZXIgfSBmcm9tICcuL21vZGUtaGFuZGxlci5qcyc7XG5cbmV4cG9ydCBjbGFzcyBTcGxpdFBvbHlnb25IYW5kbGVyIGV4dGVuZHMgTW9kZUhhbmRsZXIge1xuICBjYWxjdWxhdGVHcm91bmRDb29yZHMoY2xpY2tTZXF1ZW5jZTogYW55LCBncm91bmRDb29yZHM6IGFueSkge1xuICAgIGNvbnN0IG1vZGVDb25maWcgPSB0aGlzLmdldE1vZGVDb25maWcoKTtcbiAgICBpZiAoIW1vZGVDb25maWcgfHwgIW1vZGVDb25maWcubG9jazkwRGVncmVlIHx8ICFjbGlja1NlcXVlbmNlLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIGdyb3VuZENvb3JkcztcbiAgICB9XG4gICAgaWYgKGNsaWNrU2VxdWVuY2UubGVuZ3RoID09PSAxKSB7XG4gICAgICAvLyBpZiBmaXJzdCBwb2ludCBpcyBjbGlja2VkLCB0aGVuIGZpbmQgY2xvc2VzdCBwb2x5Z29uIHBvaW50IGFuZCBidWlsZCB+OTBkZWcgdmVjdG9yXG4gICAgICBjb25zdCBmaXJzdFBvaW50ID0gY2xpY2tTZXF1ZW5jZVswXTtcbiAgICAgIGNvbnN0IHNlbGVjdGVkR2VvbWV0cnkgPSB0aGlzLmdldFNlbGVjdGVkR2VvbWV0cnkoKTtcbiAgICAgIGNvbnN0IGZlYXR1cmUgPSB0dXJmUG9seWdvblRvTGluZShzZWxlY3RlZEdlb21ldHJ5KTtcblxuICAgICAgY29uc3QgbGluZXMgPSBmZWF0dXJlLnR5cGUgPT09ICdGZWF0dXJlQ29sbGVjdGlvbicgPyBmZWF0dXJlLmZlYXR1cmVzIDogW2ZlYXR1cmVdO1xuICAgICAgbGV0IG1pbkRpc3RhbmNlID0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XG4gICAgICBsZXQgY2xvc2VzdFBvaW50ID0gbnVsbDtcbiAgICAgIC8vIElmIE11bHRpcG9seWdvbiwgdGhlbiB3ZSBzaG91bGQgZmluZCBuZWFyZXN0IHBvbHlnb24gbGluZSBhbmQgc3RpY2sgc3BsaXQgdG8gaXQuXG4gICAgICBsaW5lcy5mb3JFYWNoKGxpbmUgPT4ge1xuICAgICAgICBjb25zdCBzbmFwUG9pbnQgPSBuZWFyZXN0UG9pbnRPbkxpbmUobGluZSwgZmlyc3RQb2ludCk7XG4gICAgICAgIGNvbnN0IGRpc3RhbmNlRnJvbU9yaWdpbiA9IHR1cmZEaXN0YW5jZShzbmFwUG9pbnQsIGZpcnN0UG9pbnQpO1xuICAgICAgICBpZiAobWluRGlzdGFuY2UgPiBkaXN0YW5jZUZyb21PcmlnaW4pIHtcbiAgICAgICAgICBtaW5EaXN0YW5jZSA9IGRpc3RhbmNlRnJvbU9yaWdpbjtcbiAgICAgICAgICBjbG9zZXN0UG9pbnQgPSBzbmFwUG9pbnQ7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBpZiAoY2xvc2VzdFBvaW50KSB7XG4gICAgICAgIC8vIGNsb3Nlc3QgcG9pbnQgaXMgdXNlZCBhcyA5MGRlZ3JlZSBlbnRyeSB0byB0aGUgcG9seWdvblxuICAgICAgICBjb25zdCBsYXN0QmVhcmluZyA9IHR1cmZCZWFyaW5nKGZpcnN0UG9pbnQsIGNsb3Nlc3RQb2ludCk7XG4gICAgICAgIGNvbnN0IGN1cnJlbnREaXN0YW5jZSA9IHR1cmZEaXN0YW5jZShmaXJzdFBvaW50LCBncm91bmRDb29yZHMsIHsgdW5pdHM6ICdtZXRlcnMnIH0pO1xuICAgICAgICByZXR1cm4gdHVyZkRlc3RpbmF0aW9uKGZpcnN0UG9pbnQsIGN1cnJlbnREaXN0YW5jZSwgbGFzdEJlYXJpbmcsIHtcbiAgICAgICAgICB1bml0czogJ21ldGVycydcbiAgICAgICAgfSkuZ2VvbWV0cnkuY29vcmRpbmF0ZXM7XG4gICAgICB9XG4gICAgICByZXR1cm4gZ3JvdW5kQ29vcmRzO1xuICAgIH1cbiAgICAvLyBBbGxvdyBvbmx5IDkwIGRlZ3JlZSB0dXJuc1xuICAgIGNvbnN0IGxhc3RQb2ludCA9IGNsaWNrU2VxdWVuY2VbY2xpY2tTZXF1ZW5jZS5sZW5ndGggLSAxXTtcbiAgICBjb25zdCBbYXBwcm94aW1hdGVQb2ludF0gPSBnZW5lcmF0ZVBvaW50c1BhcmFsbGVsVG9MaW5lUG9pbnRzKFxuICAgICAgY2xpY2tTZXF1ZW5jZVtjbGlja1NlcXVlbmNlLmxlbmd0aCAtIDJdLFxuICAgICAgbGFzdFBvaW50LFxuICAgICAgZ3JvdW5kQ29vcmRzXG4gICAgKTtcbiAgICAvLyBhbGlnbiBwb2ludCB3aXRoIGN1cnJlbnQgZ3JvdW5kXG4gICAgY29uc3QgbmVhcmVzdFB0ID0gbmVhcmVzdFBvaW50T25MaW5lKGxpbmVTdHJpbmcoW2xhc3RQb2ludCwgYXBwcm94aW1hdGVQb2ludF0pLCBncm91bmRDb29yZHMpXG4gICAgICAuZ2VvbWV0cnkuY29vcmRpbmF0ZXM7XG4gICAgcmV0dXJuIG5lYXJlc3RQdDtcbiAgfVxuXG4gIGhhbmRsZUNsaWNrKGV2ZW50OiBDbGlja0V2ZW50KTogP0VkaXRBY3Rpb24ge1xuICAgIHN1cGVyLmhhbmRsZUNsaWNrKHtcbiAgICAgIC4uLmV2ZW50LFxuICAgICAgZ3JvdW5kQ29vcmRzOiB0aGlzLmNhbGN1bGF0ZUdyb3VuZENvb3Jkcyh0aGlzLmdldENsaWNrU2VxdWVuY2UoKSwgZXZlbnQuZ3JvdW5kQ29vcmRzKVxuICAgIH0pO1xuICAgIGNvbnN0IGVkaXRBY3Rpb246ID9FZGl0QWN0aW9uID0gbnVsbDtcbiAgICBjb25zdCB0ZW50YXRpdmVGZWF0dXJlID0gdGhpcy5nZXRUZW50YXRpdmVGZWF0dXJlKCk7XG4gICAgY29uc3Qgc2VsZWN0ZWRHZW9tZXRyeSA9IHRoaXMuZ2V0U2VsZWN0ZWRHZW9tZXRyeSgpO1xuICAgIGNvbnN0IGNsaWNrU2VxdWVuY2UgPSB0aGlzLmdldENsaWNrU2VxdWVuY2UoKTtcblxuICAgIGlmICghc2VsZWN0ZWRHZW9tZXRyeSkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGUsbm8tdW5kZWZcbiAgICAgIGNvbnNvbGUud2FybignQSBwb2x5Z29uIG11c3QgYmUgc2VsZWN0ZWQgZm9yIHNwbGl0dGluZycpO1xuICAgICAgdGhpcy5fc2V0VGVudGF0aXZlRmVhdHVyZShudWxsKTtcbiAgICAgIHJldHVybiBlZGl0QWN0aW9uO1xuICAgIH1cbiAgICBjb25zdCBwdCA9IHtcbiAgICAgIHR5cGU6ICdQb2ludCcsXG4gICAgICBjb29yZGluYXRlczogY2xpY2tTZXF1ZW5jZVtjbGlja1NlcXVlbmNlLmxlbmd0aCAtIDFdXG4gICAgfTtcbiAgICBjb25zdCBpc1BvaW50SW5Qb2x5Z29uID0gYm9vbGVhblBvaW50SW5Qb2x5Z29uKHB0LCBzZWxlY3RlZEdlb21ldHJ5KTtcbiAgICBpZiAoY2xpY2tTZXF1ZW5jZS5sZW5ndGggPiAxICYmIHRlbnRhdGl2ZUZlYXR1cmUgJiYgIWlzUG9pbnRJblBvbHlnb24pIHtcbiAgICAgIHRoaXMucmVzZXRDbGlja1NlcXVlbmNlKCk7XG4gICAgICBjb25zdCBpc0xpbmVJbnRlcmVjdGluZ1dpdGhQb2x5Z29uID0gbGluZUludGVyc2VjdCh0ZW50YXRpdmVGZWF0dXJlLCBzZWxlY3RlZEdlb21ldHJ5KTtcbiAgICAgIGlmIChpc0xpbmVJbnRlcmVjdGluZ1dpdGhQb2x5Z29uLmZlYXR1cmVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aGlzLl9zZXRUZW50YXRpdmVGZWF0dXJlKG51bGwpO1xuICAgICAgICByZXR1cm4gZWRpdEFjdGlvbjtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLnNwbGl0UG9seWdvbigpO1xuICAgIH1cblxuICAgIHJldHVybiBlZGl0QWN0aW9uO1xuICB9XG5cbiAgaGFuZGxlUG9pbnRlck1vdmUoe1xuICAgIGdyb3VuZENvb3Jkc1xuICB9OiBQb2ludGVyTW92ZUV2ZW50KTogeyBlZGl0QWN0aW9uOiA/RWRpdEFjdGlvbiwgY2FuY2VsTWFwUGFuOiBib29sZWFuIH0ge1xuICAgIGNvbnN0IGNsaWNrU2VxdWVuY2UgPSB0aGlzLmdldENsaWNrU2VxdWVuY2UoKTtcbiAgICBjb25zdCByZXN1bHQgPSB7IGVkaXRBY3Rpb246IG51bGwsIGNhbmNlbE1hcFBhbjogZmFsc2UgfTtcblxuICAgIGlmIChjbGlja1NlcXVlbmNlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgLy8gbm90aGluZyB0byBkbyB5ZXRcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgdGhpcy5fc2V0VGVudGF0aXZlRmVhdHVyZSh7XG4gICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICBnZW9tZXRyeToge1xuICAgICAgICB0eXBlOiAnTGluZVN0cmluZycsXG4gICAgICAgIGNvb3JkaW5hdGVzOiBbLi4uY2xpY2tTZXF1ZW5jZSwgdGhpcy5jYWxjdWxhdGVHcm91bmRDb29yZHMoY2xpY2tTZXF1ZW5jZSwgZ3JvdW5kQ29vcmRzKV1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBzcGxpdFBvbHlnb24oKSB7XG4gICAgY29uc3Qgc2VsZWN0ZWRHZW9tZXRyeSA9IHRoaXMuZ2V0U2VsZWN0ZWRHZW9tZXRyeSgpO1xuICAgIGNvbnN0IHRlbnRhdGl2ZUZlYXR1cmUgPSB0aGlzLmdldFRlbnRhdGl2ZUZlYXR1cmUoKTtcbiAgICBjb25zdCBmZWF0dXJlSW5kZXggPSB0aGlzLmdldFNlbGVjdGVkRmVhdHVyZUluZGV4ZXMoKVswXTtcbiAgICBjb25zdCBtb2RlQ29uZmlnID0gdGhpcy5nZXRNb2RlQ29uZmlnKCkgfHwge307XG5cbiAgICAvLyBEZWZhdWx0IGdhcCBpbiBiZXR3ZWVuIHRoZSBwb2x5Z29uXG4gICAgbGV0IHsgZ2FwID0gMC4xLCB1bml0cyA9ICdjZW50aW1ldGVycycgfSA9IG1vZGVDb25maWc7XG4gICAgaWYgKGdhcCA9PT0gMCkge1xuICAgICAgZ2FwID0gMC4xO1xuICAgICAgdW5pdHMgPSAnY2VudGltZXRlcnMnO1xuICAgIH1cblxuICAgIGNvbnN0IGJ1ZmZlciA9IHR1cmZCdWZmZXIodGVudGF0aXZlRmVhdHVyZSwgZ2FwLCB7IHVuaXRzIH0pO1xuICAgIGNvbnN0IHVwZGF0ZWRHZW9tZXRyeSA9IHR1cmZEaWZmZXJlbmNlKHNlbGVjdGVkR2VvbWV0cnksIGJ1ZmZlcik7XG4gICAgdGhpcy5fc2V0VGVudGF0aXZlRmVhdHVyZShudWxsKTtcbiAgICBpZiAoIXVwZGF0ZWRHZW9tZXRyeSkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGUsbm8tdW5kZWZcbiAgICAgIGNvbnNvbGUud2FybignQ2FuY2VsaW5nIGVkaXQuIFNwbGl0IFBvbHlnb24gZXJhc2VkJyk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCB7IHR5cGUsIGNvb3JkaW5hdGVzIH0gPSB1cGRhdGVkR2VvbWV0cnkuZ2VvbWV0cnk7XG4gICAgbGV0IHVwZGF0ZWRDb29yZGluYXRlcyA9IFtdO1xuICAgIGlmICh0eXBlID09PSAnUG9seWdvbicpIHtcbiAgICAgIC8vIFVwZGF0ZSB0aGUgY29vcmRpbmF0ZXMgYXMgcGVyIE11bHRpcG9seWdvblxuICAgICAgdXBkYXRlZENvb3JkaW5hdGVzID0gY29vcmRpbmF0ZXMubWFwKGMgPT4gW2NdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSGFuZGxlIENhc2Ugd2hlbiBNdWx0aXBvbHlnb24gaGFzIGhvbGVzXG4gICAgICB1cGRhdGVkQ29vcmRpbmF0ZXMgPSBjb29yZGluYXRlcy5yZWR1Y2UoKGFnZywgcHJldikgPT4ge1xuICAgICAgICBwcmV2LmZvckVhY2gocCA9PiB7XG4gICAgICAgICAgYWdnLnB1c2goW3BdKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBhZ2c7XG4gICAgICB9LCBbXSk7XG4gICAgfVxuXG4gICAgLy8gVXBkYXRlIHRoZSB0eXBlIHRvIE11bGl0cG9seWdvblxuICAgIGNvbnN0IHVwZGF0ZWREYXRhID0gdGhpcy5nZXRJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbigpLnJlcGxhY2VHZW9tZXRyeShmZWF0dXJlSW5kZXgsIHtcbiAgICAgIHR5cGU6ICdNdWx0aVBvbHlnb24nLFxuICAgICAgY29vcmRpbmF0ZXM6IHVwZGF0ZWRDb29yZGluYXRlc1xuICAgIH0pO1xuXG4gICAgY29uc3QgZWRpdEFjdGlvbjogRWRpdEFjdGlvbiA9IHtcbiAgICAgIHVwZGF0ZWREYXRhOiB1cGRhdGVkRGF0YS5nZXRPYmplY3QoKSxcbiAgICAgIGVkaXRUeXBlOiAnc3BsaXQnLFxuICAgICAgZmVhdHVyZUluZGV4ZXM6IFtmZWF0dXJlSW5kZXhdLFxuICAgICAgZWRpdENvbnRleHQ6IG51bGxcbiAgICB9O1xuXG4gICAgcmV0dXJuIGVkaXRBY3Rpb247XG4gIH1cbn1cbiJdfQ==