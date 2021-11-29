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

class SplitPolygonMode extends _geojsonEditMode.BaseGeoJsonEditMode {
  calculateMapCoords(clickSequence, mapCoords, props) {
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

  handleClickAdapter(event, props) {
    super.handleClickAdapter(_objectSpread({}, event, {
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

  handlePointerMoveAdapter(_ref, props) {
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

  splitPolygon(props) {
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

}

exports.SplitPolygonMode = SplitPolygonMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvc3BsaXQtcG9seWdvbi1tb2RlLmpzIl0sIm5hbWVzIjpbIlNwbGl0UG9seWdvbk1vZGUiLCJCYXNlR2VvSnNvbkVkaXRNb2RlIiwiY2FsY3VsYXRlTWFwQ29vcmRzIiwiY2xpY2tTZXF1ZW5jZSIsIm1hcENvb3JkcyIsInByb3BzIiwibW9kZUNvbmZpZyIsImxvY2s5MERlZ3JlZSIsImxlbmd0aCIsImZpcnN0UG9pbnQiLCJzZWxlY3RlZEdlb21ldHJ5IiwiZ2V0U2VsZWN0ZWRHZW9tZXRyeSIsImZlYXR1cmUiLCJsaW5lcyIsInR5cGUiLCJmZWF0dXJlcyIsIm1pbkRpc3RhbmNlIiwiTnVtYmVyIiwiTUFYX1NBRkVfSU5URUdFUiIsImNsb3Nlc3RQb2ludCIsImZvckVhY2giLCJsaW5lIiwic25hcFBvaW50IiwiZGlzdGFuY2VGcm9tT3JpZ2luIiwibGFzdEJlYXJpbmciLCJjdXJyZW50RGlzdGFuY2UiLCJ1bml0cyIsImdlb21ldHJ5IiwiY29vcmRpbmF0ZXMiLCJsYXN0UG9pbnQiLCJhcHByb3hpbWF0ZVBvaW50IiwibmVhcmVzdFB0IiwiaGFuZGxlQ2xpY2tBZGFwdGVyIiwiZXZlbnQiLCJnZXRDbGlja1NlcXVlbmNlIiwiZWRpdEFjdGlvbiIsInRlbnRhdGl2ZUZlYXR1cmUiLCJnZXRUZW50YXRpdmVGZWF0dXJlIiwiY29uc29sZSIsIndhcm4iLCJfc2V0VGVudGF0aXZlRmVhdHVyZSIsInB0IiwiaXNQb2ludEluUG9seWdvbiIsInJlc2V0Q2xpY2tTZXF1ZW5jZSIsImlzTGluZUludGVyZWN0aW5nV2l0aFBvbHlnb24iLCJzcGxpdFBvbHlnb24iLCJoYW5kbGVQb2ludGVyTW92ZUFkYXB0ZXIiLCJyZXN1bHQiLCJjYW5jZWxNYXBQYW4iLCJmZWF0dXJlSW5kZXgiLCJzZWxlY3RlZEluZGV4ZXMiLCJnYXAiLCJidWZmZXIiLCJ1cGRhdGVkR2VvbWV0cnkiLCJ1cGRhdGVkQ29vcmRpbmF0ZXMiLCJtYXAiLCJjIiwicmVkdWNlIiwiYWdnIiwicHJldiIsInAiLCJwdXNoIiwidXBkYXRlZERhdGEiLCJJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbiIsImRhdGEiLCJyZXBsYWNlR2VvbWV0cnkiLCJnZXRPYmplY3QiLCJlZGl0VHlwZSIsImVkaXRDb250ZXh0IiwiZmVhdHVyZUluZGV4ZXMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFHQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRU8sTUFBTUEsZ0JBQU4sU0FBK0JDLG9DQUEvQixDQUFtRDtBQUN4REMsRUFBQUEsa0JBQWtCLENBQUNDLGFBQUQsRUFBcUJDLFNBQXJCLEVBQXFDQyxLQUFyQyxFQUEwRTtBQUMxRixRQUFNQyxVQUFVLEdBQUdELEtBQUssQ0FBQ0MsVUFBekI7O0FBQ0EsUUFBSSxDQUFDQSxVQUFELElBQWUsQ0FBQ0EsVUFBVSxDQUFDQyxZQUEzQixJQUEyQyxDQUFDSixhQUFhLENBQUNLLE1BQTlELEVBQXNFO0FBQ3BFLGFBQU9KLFNBQVA7QUFDRDs7QUFDRCxRQUFJRCxhQUFhLENBQUNLLE1BQWQsS0FBeUIsQ0FBN0IsRUFBZ0M7QUFDOUI7QUFDQSxVQUFNQyxVQUFVLEdBQUdOLGFBQWEsQ0FBQyxDQUFELENBQWhDO0FBQ0EsVUFBTU8sZ0JBQWdCLEdBQUcsS0FBS0MsbUJBQUwsQ0FBeUJOLEtBQXpCLENBQXpCO0FBQ0EsVUFBTU8sT0FBTyxHQUFHLDRCQUFrQkYsZ0JBQWxCLENBQWhCO0FBRUEsVUFBTUcsS0FBSyxHQUFHRCxPQUFPLENBQUNFLElBQVIsS0FBaUIsbUJBQWpCLEdBQXVDRixPQUFPLENBQUNHLFFBQS9DLEdBQTBELENBQUNILE9BQUQsQ0FBeEU7QUFDQSxVQUFJSSxXQUFXLEdBQUdDLE1BQU0sQ0FBQ0MsZ0JBQXpCO0FBQ0EsVUFBSUMsWUFBWSxHQUFHLElBQW5CLENBUjhCLENBUzlCOztBQUNBTixNQUFBQSxLQUFL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LFVBQUF3QyxDQUFDLEVBQUk7QUFDaEJGLFVBQUFBLEdBQUcsQ0FBQ0csSUFBSixDQUFTLENBQUNELENBQUQsQ0FBVDtBQUNELFNBRkQ7QUFHQSxlQUFPRixHQUFQO0FBQ0QsT0FMb0IsRUFLbEIsRUFMa0IsQ0FBckI7QUFNRCxLQW5DK0MsQ0FxQ2hEOzs7QUFDQSxRQUFNSSxXQUFXLEdBQUcsSUFBSUMsc0RBQUosQ0FBK0IxRCxLQUFLLENBQUMyRCxJQUFyQyxFQUEyQ0MsZUFBM0MsQ0FBMkRoQixZQUEzRCxFQUF5RTtBQUMzRm5DLE1BQUFBLElBQUksRUFBRSxjQURxRjtBQUUzRmMsTUFBQUEsV0FBVyxFQUFFMEI7QUFGOEUsS0FBekUsQ0FBcEI7QUFLQSxRQUFNbkIsVUFBNkIsR0FBRztBQUNwQzJCLE1BQUFBLFdBQVcsRUFBRUEsV0FBVyxDQUFDSSxTQUFaLEVBRHVCO0FBRXBDQyxNQUFBQSxRQUFRLEVBQUUsT0FGMEI7QUFHcENDLE1BQUFBLFdBQVcsRUFBRTtBQUNYQyxRQUFBQSxjQUFjLEVBQUUsQ0FBQ3BCLFlBQUQ7QUFETDtBQUh1QixLQUF0QztBQVFBLFdBQU9kLFVBQVA7QUFDRDs7QUFoS3VEIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuaW1wb3J0IGJvb2xlYW5Qb2ludEluUG9seWdvbiBmcm9tICdAdHVyZi9ib29sZWFuLXBvaW50LWluLXBvbHlnb24nO1xuaW1wb3J0IHR1cmZEaWZmZXJlbmNlIGZyb20gJ0B0dXJmL2RpZmZlcmVuY2UnO1xuaW1wb3J0IHR1cmZCdWZmZXIgZnJvbSAnQHR1cmYvYnVmZmVyJztcbmltcG9ydCBsaW5lSW50ZXJzZWN0IGZyb20gJ0B0dXJmL2xpbmUtaW50ZXJzZWN0JztcbmltcG9ydCB7IGxpbmVTdHJpbmcgfSBmcm9tICdAdHVyZi9oZWxwZXJzJztcbmltcG9ydCB0dXJmQmVhcmluZyBmcm9tICdAdHVyZi9iZWFyaW5nJztcbmltcG9ydCB0dXJmRGlzdGFuY2UgZnJvbSAnQHR1cmYvZGlzdGFuY2UnO1xuaW1wb3J0IHR1cmZEZXN0aW5hdGlvbiBmcm9tICdAdHVyZi9kZXN0aW5hdGlvbic7XG5pbXBvcnQgdHVyZlBvbHlnb25Ub0xpbmUgZnJvbSAnQHR1cmYvcG9seWdvbi10by1saW5lJztcbmltcG9ydCBuZWFyZXN0UG9pbnRPbkxpbmUgZnJvbSAnQHR1cmYvbmVhcmVzdC1wb2ludC1vbi1saW5lJztcbmltcG9ydCB7IGdlbmVyYXRlUG9pbnRzUGFyYWxsZWxUb0xpbmVQb2ludHMgfSBmcm9tICcuLi91dGlscy5qcyc7XG5pbXBvcnQgdHlwZSB7IEZlYXR1cmVDb2xsZWN0aW9uIH0gZnJvbSAnLi4vZ2VvanNvbi10eXBlcy5qcyc7XG5pbXBvcnQgdHlwZSB7IENsaWNrRXZlbnQsIFBvaW50ZXJNb3ZlRXZlbnQsIE1vZGVQcm9wcyB9IGZyb20gJy4uL3R5cGVzLmpzJztcbmltcG9ydCB7IEJhc2VHZW9Kc29uRWRpdE1vZGUsIHR5cGUgR2VvSnNvbkVkaXRBY3Rpb24gfSBmcm9tICcuL2dlb2pzb24tZWRpdC1tb2RlLmpzJztcbmltcG9ydCB7IEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uIH0gZnJvbSAnLi9pbW11dGFibGUtZmVhdHVyZS1jb2xsZWN0aW9uLmpzJztcblxuZXhwb3J0IGNsYXNzIFNwbGl0UG9seWdvbk1vZGUgZXh0ZW5kcyBCYXNlR2VvSnNvbkVkaXRNb2RlIHtcbiAgY2FsY3VsYXRlTWFwQ29vcmRzKGNsaWNrU2VxdWVuY2U6IGFueSwgbWFwQ29vcmRzOiBhbnksIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KSB7XG4gICAgY29uc3QgbW9kZUNvbmZpZyA9IHByb3BzLm1vZGVDb25maWc7XG4gICAgaWYgKCFtb2RlQ29uZmlnIHx8ICFtb2RlQ29uZmlnLmxvY2s5MERlZ3JlZSB8fCAhY2xpY2tTZXF1ZW5jZS5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBtYXBDb29yZHM7XG4gICAgfVxuICAgIGlmIChjbGlja1NlcXVlbmNlLmxlbmd0aCA9PT0gMSkge1xuICAgICAgLy8gaWYgZmlyc3QgcG9pbnQgaXMgY2xpY2tlZCwgdGhlbiBmaW5kIGNsb3Nlc3QgcG9seWdvbiBwb2ludCBhbmQgYnVpbGQgfjkwZGVnIHZlY3RvclxuICAgICAgY29uc3QgZmlyc3RQb2ludCA9IGNsaWNrU2VxdWVuY2VbMF07XG4gICAgICBjb25zdCBzZWxlY3RlZEdlb21ldHJ5ID0gdGhpcy5nZXRTZWxlY3RlZEdlb21ldHJ5KHByb3BzKTtcbiAgICAgIGNvbnN0IGZlYXR1cmUgPSB0dXJmUG9seWdvblRvTGluZShzZWxlY3RlZEdlb21ldHJ5KTtcblxuICAgICAgY29uc3QgbGluZXMgPSBmZWF0dXJlLnR5cGUgPT09ICdGZWF0dXJlQ29sbGVjdGlvbicgPyBmZWF0dXJlLmZlYXR1cmVzIDogW2ZlYXR1cmVdO1xuICAgICAgbGV0IG1pbkRpc3RhbmNlID0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XG4gICAgICBsZXQgY2xvc2VzdFBvaW50ID0gbnVsbDtcbiAgICAgIC8vIElmIE11bHRpcG9seWdvbiwgdGhlbiB3ZSBzaG91bGQgZmluZCBuZWFyZXN0IHBvbHlnb24gbGluZSBhbmQgc3RpY2sgc3BsaXQgdG8gaXQuXG4gICAgICBsaW5lcy5mb3JFYWNoKGxpbmUgPT4ge1xuICAgICAgICBjb25zdCBzbmFwUG9pbnQgPSBuZWFyZXN0UG9pbnRPbkxpbmUobGluZSwgZmlyc3RQb2ludCk7XG4gICAgICAgIGNvbnN0IGRpc3RhbmNlRnJvbU9yaWdpbiA9IHR1cmZEaXN0YW5jZShzbmFwUG9pbnQsIGZpcnN0UG9pbnQpO1xuICAgICAgICBpZiAobWluRGlzdGFuY2UgPiBkaXN0YW5jZUZyb21PcmlnaW4pIHtcbiAgICAgICAgICBtaW5EaXN0YW5jZSA9IGRpc3RhbmNlRnJvbU9yaWdpbjtcbiAgICAgICAgICBjbG9zZXN0UG9pbnQgPSBzbmFwUG9pbnQ7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBpZiAoY2xvc2VzdFBvaW50KSB7XG4gICAgICAgIC8vIGNsb3Nlc3QgcG9pbnQgaXMgdXNlZCBhcyA5MGRlZ3JlZSBlbnRyeSB0byB0aGUgcG9seWdvblxuICAgICAgICBjb25zdCBsYXN0QmVhcmluZyA9IHR1cmZCZWFyaW5nKGZpcnN0UG9pbnQsIGNsb3Nlc3RQb2ludCk7XG4gICAgICAgIGNvbnN0IGN1cnJlbnREaXN0YW5jZSA9IHR1cmZEaXN0YW5jZShmaXJzdFBvaW50LCBtYXBDb29yZHMsIHsgdW5pdHM6ICdtZXRlcnMnIH0pO1xuICAgICAgICByZXR1cm4gdHVyZkRlc3RpbmF0aW9uKGZpcnN0UG9pbnQsIGN1cnJlbnREaXN0YW5jZSwgbGFzdEJlYXJpbmcsIHtcbiAgICAgICAgICB1bml0czogJ21ldGVycydcbiAgICAgICAgfSkuZ2VvbWV0cnkuY29vcmRpbmF0ZXM7XG4gICAgICB9XG4gICAgICByZXR1cm4gbWFwQ29vcmRzO1xuICAgIH1cbiAgICAvLyBBbGxvdyBvbmx5IDkwIGRlZ3JlZSB0dXJuc1xuICAgIGNvbnN0IGxhc3RQb2ludCA9IGNsaWNrU2VxdWVuY2VbY2xpY2tTZXF1ZW5jZS5sZW5ndGggLSAxXTtcbiAgICBjb25zdCBbYXBwcm94aW1hdGVQb2ludF0gPSBnZW5lcmF0ZVBvaW50c1BhcmFsbGVsVG9MaW5lUG9pbnRzKFxuICAgICAgY2xpY2tTZXF1ZW5jZVtjbGlja1NlcXVlbmNlLmxlbmd0aCAtIDJdLFxuICAgICAgbGFzdFBvaW50LFxuICAgICAgbWFwQ29vcmRzXG4gICAgKTtcbiAgICAvLyBhbGlnbiBwb2ludCB3aXRoIGN1cnJlbnQgZ3JvdW5kXG4gICAgY29uc3QgbmVhcmVzdFB0ID0gbmVhcmVzdFBvaW50T25MaW5lKGxpbmVTdHJpbmcoW2xhc3RQb2ludCwgYXBwcm94aW1hdGVQb2ludF0pLCBtYXBDb29yZHMpXG4gICAgICAuZ2VvbWV0cnkuY29vcmRpbmF0ZXM7XG4gICAgcmV0dXJuIG5lYXJlc3RQdDtcbiAgfVxuXG4gIGhhbmRsZUNsaWNrQWRhcHRlcihldmVudDogQ2xpY2tFdmVudCwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pOiA/R2VvSnNvbkVkaXRBY3Rpb24ge1xuICAgIHN1cGVyLmhhbmRsZUNsaWNrQWRhcHRlcihcbiAgICAgIHtcbiAgICAgICAgLi4uZXZlbnQsXG4gICAgICAgIG1hcENvb3JkczogdGhpcy5jYWxjdWxhdGVNYXBDb29yZHModGhpcy5nZXRDbGlja1NlcXVlbmNlKCksIGV2ZW50Lm1hcENvb3JkcywgcHJvcHMpXG4gICAgICB9LFxuICAgICAgcHJvcHNcbiAgICApO1xuICAgIGNvbnN0IGVkaXRBY3Rpb246ID9HZW9Kc29uRWRpdEFjdGlvbiA9IG51bGw7XG4gICAgY29uc3QgdGVudGF0aXZlRmVhdHVyZSA9IHRoaXMuZ2V0VGVudGF0aXZlRmVhdHVyZSgpO1xuICAgIGNvbnN0IHNlbGVjdGVkR2VvbWV0cnkgPSB0aGlzLmdldFNlbGVjdGVkR2VvbWV0cnkocHJvcHMpO1xuICAgIGNvbnN0IGNsaWNrU2VxdWVuY2UgPSB0aGlzLmdldENsaWNrU2VxdWVuY2UoKTtcblxuICAgIGlmICghc2VsZWN0ZWRHZW9tZXRyeSkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGUsbm8tdW5kZWZcbiAgICAgIGNvbnNvbGUud2FybignQSBwb2x5Z29uIG11c3QgYmUgc2VsZWN0ZWQgZm9yIHNwbGl0dGluZycpO1xuICAgICAgdGhpcy5fc2V0VGVudGF0aXZlRmVhdHVyZShudWxsKTtcbiAgICAgIHJldHVybiBlZGl0QWN0aW9uO1xuICAgIH1cbiAgICBjb25zdCBwdCA9IHtcbiAgICAgIHR5cGU6ICdQb2ludCcsXG4gICAgICBjb29yZGluYXRlczogY2xpY2tTZXF1ZW5jZVtjbGlja1NlcXVlbmNlLmxlbmd0aCAtIDFdXG4gICAgfTtcbiAgICBjb25zdCBpc1BvaW50SW5Qb2x5Z29uID0gYm9vbGVhblBvaW50SW5Qb2x5Z29uKHB0LCBzZWxlY3RlZEdlb21ldHJ5KTtcbiAgICBpZiAoY2xpY2tTZXF1ZW5jZS5sZW5ndGggPiAxICYmIHRlbnRhdGl2ZUZlYXR1cmUgJiYgIWlzUG9pbnRJblBvbHlnb24pIHtcbiAgICAgIHRoaXMucmVzZXRDbGlja1NlcXVlbmNlKCk7XG4gICAgICBjb25zdCBpc0xpbmVJbnRlcmVjdGluZ1dpdGhQb2x5Z29uID0gbGluZUludGVyc2VjdCh0ZW50YXRpdmVGZWF0dXJlLCBzZWxlY3RlZEdlb21ldHJ5KTtcbiAgICAgIGlmIChpc0xpbmVJbnRlcmVjdGluZ1dpdGhQb2x5Z29uLmZlYXR1cmVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aGlzLl9zZXRUZW50YXRpdmVGZWF0dXJlKG51bGwpO1xuICAgICAgICByZXR1cm4gZWRpdEFjdGlvbjtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLnNwbGl0UG9seWdvbihwcm9wcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVkaXRBY3Rpb247XG4gIH1cblxuICBoYW5kbGVQb2ludGVyTW92ZUFkYXB0ZXIoXG4gICAgeyBtYXBDb29yZHMgfTogUG9pbnRlck1vdmVFdmVudCxcbiAgICBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPlxuICApOiB7IGVkaXRBY3Rpb246ID9HZW9Kc29uRWRpdEFjdGlvbiwgY2FuY2VsTWFwUGFuOiBib29sZWFuIH0ge1xuICAgIGNvbnN0IGNsaWNrU2VxdWVuY2UgPSB0aGlzLmdldENsaWNrU2VxdWVuY2UoKTtcbiAgICBjb25zdCByZXN1bHQgPSB7IGVkaXRBY3Rpb246IG51bGwsIGNhbmNlbE1hcFBhbjogZmFsc2UgfTtcblxuICAgIGlmIChjbGlja1NlcXVlbmNlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgLy8gbm90aGluZyB0byBkbyB5ZXRcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgdGhpcy5fc2V0VGVudGF0aXZlRmVhdHVyZSh7XG4gICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICBnZW9tZXRyeToge1xuICAgICAgICB0eXBlOiAnTGluZVN0cmluZycsXG4gICAgICAgIGNvb3JkaW5hdGVzOiBbLi4uY2xpY2tTZXF1ZW5jZSwgdGhpcy5jYWxjdWxhdGVNYXBDb29yZHMoY2xpY2tTZXF1ZW5jZSwgbWFwQ29vcmRzLCBwcm9wcyldXG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgc3BsaXRQb2x5Z29uKHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KSB7XG4gICAgY29uc3Qgc2VsZWN0ZWRHZW9tZXRyeSA9IHRoaXMuZ2V0U2VsZWN0ZWRHZW9tZXRyeShwcm9wcyk7XG4gICAgY29uc3QgdGVudGF0aXZlRmVhdHVyZSA9IHRoaXMuZ2V0VGVudGF0aXZlRmVhdHVyZSgpO1xuICAgIGNvbnN0IGZlYXR1cmVJbmRleCA9IHByb3BzLnNlbGVjdGVkSW5kZXhlc1swXTtcbiAgICBjb25zdCBtb2RlQ29uZmlnID0gcHJvcHMubW9kZUNvbmZpZyB8fCB7fTtcblxuICAgIC8vIERlZmF1bHQgZ2FwIGluIGJldHdlZW4gdGhlIHBvbHlnb25cbiAgICBsZXQgeyBnYXAgPSAwLjEsIHVuaXRzID0gJ2NlbnRpbWV0ZXJzJyB9ID0gbW9kZUNvbmZpZztcbiAgICBpZiAoZ2FwID09PSAwKSB7XG4gICAgICBnYXAgPSAwLjE7XG4gICAgICB1bml0cyA9ICdjZW50aW1ldGVycyc7XG4gICAgfVxuXG4gICAgY29uc3QgYnVmZmVyID0gdHVyZkJ1ZmZlcih0ZW50YXRpdmVGZWF0dXJlLCBnYXAsIHsgdW5pdHMgfSk7XG4gICAgY29uc3QgdXBkYXRlZEdlb21ldHJ5ID0gdHVyZkRpZmZlcmVuY2Uoc2VsZWN0ZWRHZW9tZXRyeSwgYnVmZmVyKTtcbiAgICB0aGlzLl9zZXRUZW50YXRpdmVGZWF0dXJlKG51bGwpO1xuICAgIGlmICghdXBkYXRlZEdlb21ldHJ5KSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZSxuby11bmRlZlxuICAgICAgY29uc29sZS53YXJuKCdDYW5jZWxpbmcgZWRpdC4gU3BsaXQgUG9seWdvbiBlcmFzZWQnKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHsgdHlwZSwgY29vcmRpbmF0ZXMgfSA9IHVwZGF0ZWRHZW9tZXRyeS5nZW9tZXRyeTtcbiAgICBsZXQgdXBkYXRlZENvb3JkaW5hdGVzID0gW107XG4gICAgaWYgKHR5cGUgPT09ICdQb2x5Z29uJykge1xuICAgICAgLy8gVXBkYXRlIHRoZSBjb29yZGluYXRlcyBhcyBwZXIgTXVsdGlwb2x5Z29uXG4gICAgICB1cGRhdGVkQ29vcmRpbmF0ZXMgPSBjb29yZGluYXRlcy5tYXAoYyA9PiBbY10pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBIYW5kbGUgQ2FzZSB3aGVuIE11bHRpcG9seWdvbiBoYXMgaG9sZXNcbiAgICAgIHVwZGF0ZWRDb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzLnJlZHVjZSgoYWdnLCBwcmV2KSA9PiB7XG4gICAgICAgIHByZXYuZm9yRWFjaChwID0+IHtcbiAgICAgICAgICBhZ2cucHVzaChbcF0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGFnZztcbiAgICAgIH0sIFtdKTtcbiAgICB9XG5cbiAgICAvLyBVcGRhdGUgdGhlIHR5cGUgdG8gTXVsaXRwb2x5Z29uXG4gICAgY29uc3QgdXBkYXRlZERhdGEgPSBuZXcgSW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24ocHJvcHMuZGF0YSkucmVwbGFjZUdlb21ldHJ5KGZlYXR1cmVJbmRleCwge1xuICAgICAgdHlwZTogJ011bHRpUG9seWdvbicsXG4gICAgICBjb29yZGluYXRlczogdXBkYXRlZENvb3JkaW5hdGVzXG4gICAgfSk7XG5cbiAgICBjb25zdCBlZGl0QWN0aW9uOiBHZW9Kc29uRWRpdEFjdGlvbiA9IHtcbiAgICAgIHVwZGF0ZWREYXRhOiB1cGRhdGVkRGF0YS5nZXRPYmplY3QoKSxcbiAgICAgIGVkaXRUeXBlOiAnc3BsaXQnLFxuICAgICAgZWRpdENvbnRleHQ6IHtcbiAgICAgICAgZmVhdHVyZUluZGV4ZXM6IFtmZWF0dXJlSW5kZXhdXG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBlZGl0QWN0aW9uO1xuICB9XG59XG4iXX0=