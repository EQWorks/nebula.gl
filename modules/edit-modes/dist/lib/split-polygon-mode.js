"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SplitPolygonMode = void 0;

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

var _utils = require("../utils.js");

var _geojsonEditMode = require("./geojson-edit-mode.js");

var _immutableFeatureCollection = require("./immutable-feature-collection.js");

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

var SplitPolygonMode =
/*#__PURE__*/
function (_BaseGeoJsonEditMode) {
  _inherits(SplitPolygonMode, _BaseGeoJsonEditMode);

  function SplitPolygonMode() {
    _classCallCheck(this, SplitPolygonMode);

    return _possibleConstructorReturn(this, _getPrototypeOf(SplitPolygonMode).apply(this, arguments));
  }

  _createClass(SplitPolygonMode, [{
    key: "calculateMapCoords",
    value: function calculateMapCoords(clickSequence, mapCoords, props) {
      var modeConfig = props.modeConfig;

      if (!modeConfig || !modeConfig.lock90Degree || !clickSequence.length) {
        return mapCoords;
      }

      if (clickSequence.length === 1) {
        // if first point is clicked, then find closest polygon point and build ~90deg vector
        var firstPoint = clickSequence[0];
        var selectedGeometry = this.getSelectedGeometry(props);
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
          var currentDistance = (0, _distance.default)(firstPoint, mapCoords, {
            units: 'meters'
          });
          return (0, _destination.default)(firstPoint, currentDistance, lastBearing, {
            units: 'meters'
          }).geometry.coordinates;
        }

        return mapCoords;
      } // Allow only 90 degree turns


      var lastPoint = clickSequence[clickSequence.length - 1];

      var _generatePointsParall = (0, _utils.generatePointsParallelToLinePoints)(clickSequence[clickSequence.length - 2], lastPoint, mapCoords),
          _generatePointsParall2 = _slicedToArray(_generatePointsParall, 1),
          approximatePoint = _generatePointsParall2[0]; // align point with current ground


      var nearestPt = (0, _nearestPointOnLine.default)((0, _helpers.lineString)([lastPoint, approximatePoint]), mapCoords).geometry.coordinates;
      return nearestPt;
    }
  }, {
    key: "handleClickAdapter",
    value: function handleClickAdapter(event, props) {
      _get(_getPrototypeOf(SplitPolygonMode.prototype), "handleClickAdapter", this).call(this, _objectSpread({}, event, {
        mapCoords: this.calculateMapCoords(this.getClickSequence(), event.mapCoords, props)
      }), props);

      var editAction = null;
      var tentativeFeature = this.getTentativeFeature();
      var selectedGeometry = this.getSelectedGeometry(props);
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

        return this.splitPolygon(props);
      }

      return editAction;
    }
  }, {
    key: "handlePointerMoveAdapter",
    value: function handlePointerMoveAdapter(_ref, props) {
      var mapCoords = _ref.mapCoords;
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
          coordinates: _toConsumableArray(clickSequence).concat([this.calculateMapCoords(clickSequence, mapCoords, props)])
        }
      });

      return result;
    }
  }, {
    key: "splitPolygon",
    value: function splitPolygon(props) {
      var selectedGeometry = this.getSelectedGeometry(props);
      var tentativeFeature = this.getTentativeFeature();
      var featureIndex = props.selectedIndexes[0];
      var modeConfig = props.modeConfig || {}; // Default gap in between the polygon

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


      var updatedData = new _immutableFeatureCollection.ImmutableFeatureCollection(props.data).replaceGeometry(featureIndex, {
        type: 'MultiPolygon',
        coordinates: updatedCoordinates
      });
      var editAction = {
        updatedData: updatedData.getObject(),
        editType: 'split',
        editContext: {
          featureIndexes: [featureIndex]
        }
      };
      return editAction;
    }
  }]);

  return SplitPolygonMode;
}(_geojsonEditMode.BaseGeoJsonEditMode);

exports.SplitPolygonMode = SplitPolygonMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvc3BsaXQtcG9seWdvbi1tb2RlLmpzIl0sIm5hbWVzIjpbIlNwbGl0UG9seWdvbk1vZGUiLCJjbGlja1NlcXVlbmNlIiwibWFwQ29vcmRzIiwicHJvcHMiLCJtb2RlQ29uZmlnIiwibG9jazkwRGVncmVlIiwibGVuZ3RoIiwiZmlyc3RQb2ludCIsInNlbGVjdGVkR2VvbWV0cnkiLCJnZXRTZWxlY3RlZEdlb21ldHJ5IiwiZmVhdHVyZSIsImxpbmVzIiwidHlwZSIsImZlYXR1cmVzIiwibWluRGlzdGFuY2UiLCJOdW1iZXIiLCJNQVhfU0FGRV9JTlRFR0VSIiwiY2xvc2VzdFBvaW50IiwiZm9yRWFjaCIsImxpbmUiLCJzbmFwUG9pbnQiLCJkaXN0YW5jZUZyb21PcmlnaW4iLCJsYXN0QmVhcmluZyIsImN1cnJlbnREaXN0YW5jZSIsInVuaXRzIiwiZ2VvbWV0cnkiLCJjb29yZGluYXRlcyIsImxhc3RQb2ludCIsImFwcHJveGltYXRlUG9pbnQiLCJuZWFyZXN0UHQiLCJldmVudCIsImNhbGN1bGF0ZU1hcENvb3JkcyIsImdldENsaWNrU2VxdWVuY2UiLCJlZGl0QWN0aW9uIiwidGVudGF0aXZlRmVhdHVyZSIsImdldFRlbnRhdGl2ZUZlYXR1cmUiLCJjb25zb2xlIiwid2FybiIsIl9zZXRUZW50YXRpdmVGZWF0dXJlIiwicHQiLCJpc1BvaW50SW5Qb2x5Z29uIiwicmVzZXRDbGlja1NlcXVlbmNlIiwiaXNMaW5lSW50ZXJlY3RpbmdXaXRoUG9seWdvbiIsInNwbGl0UG9seWdvbiIsInJlc3VsdCIsImNhbmNlbE1hcFBhbiIsImZlYXR1cmVJbmRleCIsInNlbGVjdGVkSW5kZXhlcyIsImdhcCIsImJ1ZmZlciIsInVwZGF0ZWRHZW9tZXRyeSIsInVwZGF0ZWRDb29yZGluYXRlcyIsIm1hcCIsImMiLCJyZWR1Y2UiLCJhZ2ciLCJwcmV2IiwicCIsInB1c2giLCJ1cGRhdGVkRGF0YSIsIkltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uIiwiZGF0YSIsInJlcGxhY2VHZW9tZXRyeSIsImdldE9iamVjdCIsImVkaXRUeXBlIiwiZWRpdENvbnRleHQiLCJmZWF0dXJlSW5kZXhlcyIsIkJhc2VHZW9Kc29uRWRpdE1vZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFHQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUVhQSxnQjs7Ozs7Ozs7Ozs7Ozt1Q0FDUUMsYSxFQUFvQkMsUyxFQUFnQkMsSyxFQUFxQztBQUMxRixVQUFNQyxVQUFVLEdBQUdELEtBQUssQ0FBQ0MsVUFBekI7O0FBQ0EsVUFBSSxDQUFDQSxVQUFELElBQWUsQ0FBQ0EsVUFBVSxDQUFDQyxZQUEzQixJQUEyQyxDQUFDSixhQUFhLENBQUNLLE1BQTlELEVBQXNFO0FBQ3BFLGVBQU9KLFNBQVA7QUFDRDs7QUFDRCxVQUFJRCxhQUFhLENBQUNLLE1BQWQsS0FBeUIsQ0FBN0IsRUFBZ0M7QUFDOUI7QUFDQSxZQUFNQyxVQUFVLEdBQUdOLGFBQWEsQ0FBQyxDQUFELENBQWhDO0FBQ0EsWUFBTU8sZ0JBQWdCLEdBQUcsS0FBS0MsbUJBQUwsQ0FBeUJOLEtBQXpCLENBQXpCO0FBQ0EsWUFBTU8sT0FBTyxHQUFHLDRCQUFrQkYsZ0JBQWxCLENBQWhCO0FBRUEsWUFBTUcsS0FBSyxHQUFHRCxPQUFPLENBQUNFLElBQVIsS0FBaUIsbUJBQWpCLEdBQXVDRixPQUFPLENBQUNHLFFBQS9DLEdBQTBELENBQUNILE9BQUQsQ0FBeEU7QUFDQSxZQUFJSSxXQUFXLEdBQUdDLE1BQU0sQ0FBQ0MsZ0JBQXpCO0FBQ0EsWUFBSUMsWUFBWSxHQUFHLElBQW5CLENBUjhCLENBUzlCOztBQUNBTixRQUFBQSxLQUFLLENBQUNPLE9BQU4sQ0FBYyxVQUFBQyxJQUFJLEVBQUk7QUFDcEIsY0FBTUMsU0FBUyxHQUFHLGlDQUFtQkQsSUFBbkIsRUFB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Ozs7QUFDQSxVQUFNSSxXQUFXLEdBQUcsSUFBSUMsc0RBQUosQ0FBK0J6RCxLQUFLLENBQUMwRCxJQUFyQyxFQUEyQ0MsZUFBM0MsQ0FBMkRoQixZQUEzRCxFQUF5RTtBQUMzRmxDLFFBQUFBLElBQUksRUFBRSxjQURxRjtBQUUzRmMsUUFBQUEsV0FBVyxFQUFFeUI7QUFGOEUsT0FBekUsQ0FBcEI7QUFLQSxVQUFNbEIsVUFBNkIsR0FBRztBQUNwQzBCLFFBQUFBLFdBQVcsRUFBRUEsV0FBVyxDQUFDSSxTQUFaLEVBRHVCO0FBRXBDQyxRQUFBQSxRQUFRLEVBQUUsT0FGMEI7QUFHcENDLFFBQUFBLFdBQVcsRUFBRTtBQUNYQyxVQUFBQSxjQUFjLEVBQUUsQ0FBQ3BCLFlBQUQ7QUFETDtBQUh1QixPQUF0QztBQVFBLGFBQU9iLFVBQVA7QUFDRDs7OztFQWhLbUNrQyxvQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbmltcG9ydCBib29sZWFuUG9pbnRJblBvbHlnb24gZnJvbSAnQHR1cmYvYm9vbGVhbi1wb2ludC1pbi1wb2x5Z29uJztcbmltcG9ydCB0dXJmRGlmZmVyZW5jZSBmcm9tICdAdHVyZi9kaWZmZXJlbmNlJztcbmltcG9ydCB0dXJmQnVmZmVyIGZyb20gJ0B0dXJmL2J1ZmZlcic7XG5pbXBvcnQgbGluZUludGVyc2VjdCBmcm9tICdAdHVyZi9saW5lLWludGVyc2VjdCc7XG5pbXBvcnQgeyBsaW5lU3RyaW5nIH0gZnJvbSAnQHR1cmYvaGVscGVycyc7XG5pbXBvcnQgdHVyZkJlYXJpbmcgZnJvbSAnQHR1cmYvYmVhcmluZyc7XG5pbXBvcnQgdHVyZkRpc3RhbmNlIGZyb20gJ0B0dXJmL2Rpc3RhbmNlJztcbmltcG9ydCB0dXJmRGVzdGluYXRpb24gZnJvbSAnQHR1cmYvZGVzdGluYXRpb24nO1xuaW1wb3J0IHR1cmZQb2x5Z29uVG9MaW5lIGZyb20gJ0B0dXJmL3BvbHlnb24tdG8tbGluZSc7XG5pbXBvcnQgbmVhcmVzdFBvaW50T25MaW5lIGZyb20gJ0B0dXJmL25lYXJlc3QtcG9pbnQtb24tbGluZSc7XG5pbXBvcnQgeyBnZW5lcmF0ZVBvaW50c1BhcmFsbGVsVG9MaW5lUG9pbnRzIH0gZnJvbSAnLi4vdXRpbHMuanMnO1xuaW1wb3J0IHR5cGUgeyBGZWF0dXJlQ29sbGVjdGlvbiB9IGZyb20gJy4uL2dlb2pzb24tdHlwZXMuanMnO1xuaW1wb3J0IHR5cGUgeyBDbGlja0V2ZW50LCBQb2ludGVyTW92ZUV2ZW50LCBNb2RlUHJvcHMgfSBmcm9tICcuLi90eXBlcy5qcyc7XG5pbXBvcnQgeyBCYXNlR2VvSnNvbkVkaXRNb2RlLCB0eXBlIEdlb0pzb25FZGl0QWN0aW9uIH0gZnJvbSAnLi9nZW9qc29uLWVkaXQtbW9kZS5qcyc7XG5pbXBvcnQgeyBJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbiB9IGZyb20gJy4vaW1tdXRhYmxlLWZlYXR1cmUtY29sbGVjdGlvbi5qcyc7XG5cbmV4cG9ydCBjbGFzcyBTcGxpdFBvbHlnb25Nb2RlIGV4dGVuZHMgQmFzZUdlb0pzb25FZGl0TW9kZSB7XG4gIGNhbGN1bGF0ZU1hcENvb3JkcyhjbGlja1NlcXVlbmNlOiBhbnksIG1hcENvb3JkczogYW55LCBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPikge1xuICAgIGNvbnN0IG1vZGVDb25maWcgPSBwcm9wcy5tb2RlQ29uZmlnO1xuICAgIGlmICghbW9kZUNvbmZpZyB8fCAhbW9kZUNvbmZpZy5sb2NrOTBEZWdyZWUgfHwgIWNsaWNrU2VxdWVuY2UubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gbWFwQ29vcmRzO1xuICAgIH1cbiAgICBpZiAoY2xpY2tTZXF1ZW5jZS5sZW5ndGggPT09IDEpIHtcbiAgICAgIC8vIGlmIGZpcnN0IHBvaW50IGlzIGNsaWNrZWQsIHRoZW4gZmluZCBjbG9zZXN0IHBvbHlnb24gcG9pbnQgYW5kIGJ1aWxkIH45MGRlZyB2ZWN0b3JcbiAgICAgIGNvbnN0IGZpcnN0UG9pbnQgPSBjbGlja1NlcXVlbmNlWzBdO1xuICAgICAgY29uc3Qgc2VsZWN0ZWRHZW9tZXRyeSA9IHRoaXMuZ2V0U2VsZWN0ZWRHZW9tZXRyeShwcm9wcyk7XG4gICAgICBjb25zdCBmZWF0dXJlID0gdHVyZlBvbHlnb25Ub0xpbmUoc2VsZWN0ZWRHZW9tZXRyeSk7XG5cbiAgICAgIGNvbnN0IGxpbmVzID0gZmVhdHVyZS50eXBlID09PSAnRmVhdHVyZUNvbGxlY3Rpb24nID8gZmVhdHVyZS5mZWF0dXJlcyA6IFtmZWF0dXJlXTtcbiAgICAgIGxldCBtaW5EaXN0YW5jZSA9IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xuICAgICAgbGV0IGNsb3Nlc3RQb2ludCA9IG51bGw7XG4gICAgICAvLyBJZiBNdWx0aXBvbHlnb24sIHRoZW4gd2Ugc2hvdWxkIGZpbmQgbmVhcmVzdCBwb2x5Z29uIGxpbmUgYW5kIHN0aWNrIHNwbGl0IHRvIGl0LlxuICAgICAgbGluZXMuZm9yRWFjaChsaW5lID0+IHtcbiAgICAgICAgY29uc3Qgc25hcFBvaW50ID0gbmVhcmVzdFBvaW50T25MaW5lKGxpbmUsIGZpcnN0UG9pbnQpO1xuICAgICAgICBjb25zdCBkaXN0YW5jZUZyb21PcmlnaW4gPSB0dXJmRGlzdGFuY2Uoc25hcFBvaW50LCBmaXJzdFBvaW50KTtcbiAgICAgICAgaWYgKG1pbkRpc3RhbmNlID4gZGlzdGFuY2VGcm9tT3JpZ2luKSB7XG4gICAgICAgICAgbWluRGlzdGFuY2UgPSBkaXN0YW5jZUZyb21PcmlnaW47XG4gICAgICAgICAgY2xvc2VzdFBvaW50ID0gc25hcFBvaW50O1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgaWYgKGNsb3Nlc3RQb2ludCkge1xuICAgICAgICAvLyBjbG9zZXN0IHBvaW50IGlzIHVzZWQgYXMgOTBkZWdyZWUgZW50cnkgdG8gdGhlIHBvbHlnb25cbiAgICAgICAgY29uc3QgbGFzdEJlYXJpbmcgPSB0dXJmQmVhcmluZyhmaXJzdFBvaW50LCBjbG9zZXN0UG9pbnQpO1xuICAgICAgICBjb25zdCBjdXJyZW50RGlzdGFuY2UgPSB0dXJmRGlzdGFuY2UoZmlyc3RQb2ludCwgbWFwQ29vcmRzLCB7IHVuaXRzOiAnbWV0ZXJzJyB9KTtcbiAgICAgICAgcmV0dXJuIHR1cmZEZXN0aW5hdGlvbihmaXJzdFBvaW50LCBjdXJyZW50RGlzdGFuY2UsIGxhc3RCZWFyaW5nLCB7XG4gICAgICAgICAgdW5pdHM6ICdtZXRlcnMnXG4gICAgICAgIH0pLmdlb21ldHJ5LmNvb3JkaW5hdGVzO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG1hcENvb3JkcztcbiAgICB9XG4gICAgLy8gQWxsb3cgb25seSA5MCBkZWdyZWUgdHVybnNcbiAgICBjb25zdCBsYXN0UG9pbnQgPSBjbGlja1NlcXVlbmNlW2NsaWNrU2VxdWVuY2UubGVuZ3RoIC0gMV07XG4gICAgY29uc3QgW2FwcHJveGltYXRlUG9pbnRdID0gZ2VuZXJhdGVQb2ludHNQYXJhbGxlbFRvTGluZVBvaW50cyhcbiAgICAgIGNsaWNrU2VxdWVuY2VbY2xpY2tTZXF1ZW5jZS5sZW5ndGggLSAyXSxcbiAgICAgIGxhc3RQb2ludCxcbiAgICAgIG1hcENvb3Jkc1xuICAgICk7XG4gICAgLy8gYWxpZ24gcG9pbnQgd2l0aCBjdXJyZW50IGdyb3VuZFxuICAgIGNvbnN0IG5lYXJlc3RQdCA9IG5lYXJlc3RQb2ludE9uTGluZShsaW5lU3RyaW5nKFtsYXN0UG9pbnQsIGFwcHJveGltYXRlUG9pbnRdKSwgbWFwQ29vcmRzKVxuICAgICAgLmdlb21ldHJ5LmNvb3JkaW5hdGVzO1xuICAgIHJldHVybiBuZWFyZXN0UHQ7XG4gIH1cblxuICBoYW5kbGVDbGlja0FkYXB0ZXIoZXZlbnQ6IENsaWNrRXZlbnQsIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KTogP0dlb0pzb25FZGl0QWN0aW9uIHtcbiAgICBzdXBlci5oYW5kbGVDbGlja0FkYXB0ZXIoXG4gICAgICB7XG4gICAgICAgIC4uLmV2ZW50LFxuICAgICAgICBtYXBDb29yZHM6IHRoaXMuY2FsY3VsYXRlTWFwQ29vcmRzKHRoaXMuZ2V0Q2xpY2tTZXF1ZW5jZSgpLCBldmVudC5tYXBDb29yZHMsIHByb3BzKVxuICAgICAgfSxcbiAgICAgIHByb3BzXG4gICAgKTtcbiAgICBjb25zdCBlZGl0QWN0aW9uOiA/R2VvSnNvbkVkaXRBY3Rpb24gPSBudWxsO1xuICAgIGNvbnN0IHRlbnRhdGl2ZUZlYXR1cmUgPSB0aGlzLmdldFRlbnRhdGl2ZUZlYXR1cmUoKTtcbiAgICBjb25zdCBzZWxlY3RlZEdlb21ldHJ5ID0gdGhpcy5nZXRTZWxlY3RlZEdlb21ldHJ5KHByb3BzKTtcbiAgICBjb25zdCBjbGlja1NlcXVlbmNlID0gdGhpcy5nZXRDbGlja1NlcXVlbmNlKCk7XG5cbiAgICBpZiAoIXNlbGVjdGVkR2VvbWV0cnkpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlLG5vLXVuZGVmXG4gICAgICBjb25zb2xlLndhcm4oJ0EgcG9seWdvbiBtdXN0IGJlIHNlbGVjdGVkIGZvciBzcGxpdHRpbmcnKTtcbiAgICAgIHRoaXMuX3NldFRlbnRhdGl2ZUZlYXR1cmUobnVsbCk7XG4gICAgICByZXR1cm4gZWRpdEFjdGlvbjtcbiAgICB9XG4gICAgY29uc3QgcHQgPSB7XG4gICAgICB0eXBlOiAnUG9pbnQnLFxuICAgICAgY29vcmRpbmF0ZXM6IGNsaWNrU2VxdWVuY2VbY2xpY2tTZXF1ZW5jZS5sZW5ndGggLSAxXVxuICAgIH07XG4gICAgY29uc3QgaXNQb2ludEluUG9seWdvbiA9IGJvb2xlYW5Qb2ludEluUG9seWdvbihwdCwgc2VsZWN0ZWRHZW9tZXRyeSk7XG4gICAgaWYgKGNsaWNrU2VxdWVuY2UubGVuZ3RoID4gMSAmJiB0ZW50YXRpdmVGZWF0dXJlICYmICFpc1BvaW50SW5Qb2x5Z29uKSB7XG4gICAgICB0aGlzLnJlc2V0Q2xpY2tTZXF1ZW5jZSgpO1xuICAgICAgY29uc3QgaXNMaW5lSW50ZXJlY3RpbmdXaXRoUG9seWdvbiA9IGxpbmVJbnRlcnNlY3QodGVudGF0aXZlRmVhdHVyZSwgc2VsZWN0ZWRHZW9tZXRyeSk7XG4gICAgICBpZiAoaXNMaW5lSW50ZXJlY3RpbmdXaXRoUG9seWdvbi5mZWF0dXJlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdGhpcy5fc2V0VGVudGF0aXZlRmVhdHVyZShudWxsKTtcbiAgICAgICAgcmV0dXJuIGVkaXRBY3Rpb247XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5zcGxpdFBvbHlnb24ocHJvcHMpO1xuICAgIH1cblxuICAgIHJldHVybiBlZGl0QWN0aW9uO1xuICB9XG5cbiAgaGFuZGxlUG9pbnRlck1vdmVBZGFwdGVyKFxuICAgIHsgbWFwQ29vcmRzIH06IFBvaW50ZXJNb3ZlRXZlbnQsXG4gICAgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj5cbiAgKTogeyBlZGl0QWN0aW9uOiA/R2VvSnNvbkVkaXRBY3Rpb24sIGNhbmNlbE1hcFBhbjogYm9vbGVhbiB9IHtcbiAgICBjb25zdCBjbGlja1NlcXVlbmNlID0gdGhpcy5nZXRDbGlja1NlcXVlbmNlKCk7XG4gICAgY29uc3QgcmVzdWx0ID0geyBlZGl0QWN0aW9uOiBudWxsLCBjYW5jZWxNYXBQYW46IGZhbHNlIH07XG5cbiAgICBpZiAoY2xpY2tTZXF1ZW5jZS5sZW5ndGggPT09IDApIHtcbiAgICAgIC8vIG5vdGhpbmcgdG8gZG8geWV0XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHRoaXMuX3NldFRlbnRhdGl2ZUZlYXR1cmUoe1xuICAgICAgdHlwZTogJ0ZlYXR1cmUnLFxuICAgICAgZ2VvbWV0cnk6IHtcbiAgICAgICAgdHlwZTogJ0xpbmVTdHJpbmcnLFxuICAgICAgICBjb29yZGluYXRlczogWy4uLmNsaWNrU2VxdWVuY2UsIHRoaXMuY2FsY3VsYXRlTWFwQ29vcmRzKGNsaWNrU2VxdWVuY2UsIG1hcENvb3JkcywgcHJvcHMpXVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHNwbGl0UG9seWdvbihwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPikge1xuICAgIGNvbnN0IHNlbGVjdGVkR2VvbWV0cnkgPSB0aGlzLmdldFNlbGVjdGVkR2VvbWV0cnkocHJvcHMpO1xuICAgIGNvbnN0IHRlbnRhdGl2ZUZlYXR1cmUgPSB0aGlzLmdldFRlbnRhdGl2ZUZlYXR1cmUoKTtcbiAgICBjb25zdCBmZWF0dXJlSW5kZXggPSBwcm9wcy5zZWxlY3RlZEluZGV4ZXNbMF07XG4gICAgY29uc3QgbW9kZUNvbmZpZyA9IHByb3BzLm1vZGVDb25maWcgfHwge307XG5cbiAgICAvLyBEZWZhdWx0IGdhcCBpbiBiZXR3ZWVuIHRoZSBwb2x5Z29uXG4gICAgbGV0IHsgZ2FwID0gMC4xLCB1bml0cyA9ICdjZW50aW1ldGVycycgfSA9IG1vZGVDb25maWc7XG4gICAgaWYgKGdhcCA9PT0gMCkge1xuICAgICAgZ2FwID0gMC4xO1xuICAgICAgdW5pdHMgPSAnY2VudGltZXRlcnMnO1xuICAgIH1cblxuICAgIGNvbnN0IGJ1ZmZlciA9IHR1cmZCdWZmZXIodGVudGF0aXZlRmVhdHVyZSwgZ2FwLCB7IHVuaXRzIH0pO1xuICAgIGNvbnN0IHVwZGF0ZWRHZW9tZXRyeSA9IHR1cmZEaWZmZXJlbmNlKHNlbGVjdGVkR2VvbWV0cnksIGJ1ZmZlcik7XG4gICAgdGhpcy5fc2V0VGVudGF0aXZlRmVhdHVyZShudWxsKTtcbiAgICBpZiAoIXVwZGF0ZWRHZW9tZXRyeSkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGUsbm8tdW5kZWZcbiAgICAgIGNvbnNvbGUud2FybignQ2FuY2VsaW5nIGVkaXQuIFNwbGl0IFBvbHlnb24gZXJhc2VkJyk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCB7IHR5cGUsIGNvb3JkaW5hdGVzIH0gPSB1cGRhdGVkR2VvbWV0cnkuZ2VvbWV0cnk7XG4gICAgbGV0IHVwZGF0ZWRDb29yZGluYXRlcyA9IFtdO1xuICAgIGlmICh0eXBlID09PSAnUG9seWdvbicpIHtcbiAgICAgIC8vIFVwZGF0ZSB0aGUgY29vcmRpbmF0ZXMgYXMgcGVyIE11bHRpcG9seWdvblxuICAgICAgdXBkYXRlZENvb3JkaW5hdGVzID0gY29vcmRpbmF0ZXMubWFwKGMgPT4gW2NdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSGFuZGxlIENhc2Ugd2hlbiBNdWx0aXBvbHlnb24gaGFzIGhvbGVzXG4gICAgICB1cGRhdGVkQ29vcmRpbmF0ZXMgPSBjb29yZGluYXRlcy5yZWR1Y2UoKGFnZywgcHJldikgPT4ge1xuICAgICAgICBwcmV2LmZvckVhY2gocCA9PiB7XG4gICAgICAgICAgYWdnLnB1c2goW3BdKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBhZ2c7XG4gICAgICB9LCBbXSk7XG4gICAgfVxuXG4gICAgLy8gVXBkYXRlIHRoZSB0eXBlIHRvIE11bGl0cG9seWdvblxuICAgIGNvbnN0IHVwZGF0ZWREYXRhID0gbmV3IEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uKHByb3BzLmRhdGEpLnJlcGxhY2VHZW9tZXRyeShmZWF0dXJlSW5kZXgsIHtcbiAgICAgIHR5cGU6ICdNdWx0aVBvbHlnb24nLFxuICAgICAgY29vcmRpbmF0ZXM6IHVwZGF0ZWRDb29yZGluYXRlc1xuICAgIH0pO1xuXG4gICAgY29uc3QgZWRpdEFjdGlvbjogR2VvSnNvbkVkaXRBY3Rpb24gPSB7XG4gICAgICB1cGRhdGVkRGF0YTogdXBkYXRlZERhdGEuZ2V0T2JqZWN0KCksXG4gICAgICBlZGl0VHlwZTogJ3NwbGl0JyxcbiAgICAgIGVkaXRDb250ZXh0OiB7XG4gICAgICAgIGZlYXR1cmVJbmRleGVzOiBbZmVhdHVyZUluZGV4XVxuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gZWRpdEFjdGlvbjtcbiAgfVxufVxuIl19