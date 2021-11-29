"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Draw90DegreePolygonMode = void 0;

var _destination = _interopRequireDefault(require("@turf/destination"));

var _bearing = _interopRequireDefault(require("@turf/bearing"));

var _lineIntersect = _interopRequireDefault(require("@turf/line-intersect"));

var _distance = _interopRequireDefault(require("@turf/distance"));

var _helpers = require("@turf/helpers");

var _utils = require("../utils");

var _geojsonEditMode = require("./geojson-edit-mode.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

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

var Draw90DegreePolygonMode =
/*#__PURE__*/
function (_BaseGeoJsonEditMode) {
  _inherits(Draw90DegreePolygonMode, _BaseGeoJsonEditMode);

  function Draw90DegreePolygonMode() {
    _classCallCheck(this, Draw90DegreePolygonMode);

    return _possibleConstructorReturn(this, _getPrototypeOf(Draw90DegreePolygonMode).apply(this, arguments));
  }

  _createClass(Draw90DegreePolygonMode, [{
    key: "getEditHandlesAdapter",
    value: function getEditHandlesAdapter(picks, mapCoords, props) {
      var handles = _get(_getPrototypeOf(Draw90DegreePolygonMode.prototype), "getEditHandlesAdapter", this).call(this, picks, mapCoords, props);

      var tentativeFeature = this.getTentativeFeature();

      if (tentativeFeature) {
        handles = handles.concat((0, _geojsonEditMode.getEditHandlesForGeometry)(tentativeFeature.geometry, -1)); // Slice off the handles that are are next to the pointer

        if (tentativeFeature && tentativeFeature.geometry.type === 'LineString') {
          // Remove the last existing handle
          handles = handles.slice(0, -1);
        } else if (tentativeFeature && tentativeFeature.geometry.type === 'Polygon') {
          // Remove the last existing handle
          handles = handles.slice(0, -1);
        }
      }

      return handles;
    }
  }, {
    key: "handlePointerMoveAdapter",
    value: function handlePointerMoveAdapter(_ref) {
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

      var tentativeFeature = this.getTentativeFeature();

      if (tentativeFeature && tentativeFeature.geometry.type === 'Polygon') {
        clickSequence[clickSequence.length - 1] = tentativeFeature.geometry.coordinates[0][clickSequence.length - 1];
      } else if (tentativeFeature && tentativeFeature.geometry.type === 'LineString') {
        clickSequence[clickSequence.length - 1] = tentativeFeature.geometry.coordinates[clickSequence.length - 1];
      }

      var p3;

      if (clickSequence.length === 1) {
        p3 = mapCoords;
      } else {
        var p1 = clickSequence[clickSequence.length - 2];
        var p2 = clickSequence[clickSequence.length - 1];

        var _generatePointsParall = (0, _utils.generatePointsParallelToLinePoints)(p1, p2, mapCoords);

        var _generatePointsParall2 = _slicedToArray(_generatePointsParall, 1);

        p3 = _generatePointsParall2[0];
      }

      if (clickSequence.length < 3) {
        // Draw a LineString connecting all the clicked points with the hovered point
        this._setTentativeFeature({
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: _toConsumableArray(clickSequence).concat([p3])
          }
        });
      } else {
        // Draw a Polygon connecting all the clicked points with the hovered point
        this._setTentativeFeature({
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [_toConsumableArray(clickSequence).concat([p3, clickSequence[0]])]
          }
        });
      }

      return result;
    }
  }, {
    key: "handleClickAdapter",
    value: function handleClickAdapter(event, props) {
      _get(_getPrototypeOf(Draw90DegreePolygonMode.prototype), "handleClickAdapter", this).call(this, event, props);

      var picks = event.picks;
      var tentativeFeature = this.getTentativeFeature();
      var editAction = null;
      var clickedEditHandle = (0, _geojsonEditMode.getPickedEditHandle)(picks);

      if (tentativeFeature && tentativeFeature.geometry.type === 'Polygon') {
        var polygon = tentativeFeature.geometry;

        if (clickedEditHandle && clickedEditHandle.featureIndex === -1 && (clickedEditHandle.positionIndexes[1] === 0 || clickedEditHandle.positionIndexes[1] === polygon.coordinates[0].length - 3)) {
          // They clicked the first or last point (or double-clicked), so complete the polygon
          var polygonToAdd = {
            type: 'Polygon',
            coordinates: this.finalizedCoordinates(_toConsumableArray(polygon.coordinates[0]))
          };
          this.resetClickSequence();

          this._setTentativeFeature(null);

          editAction = this.getAddFeatureOrBooleanPolygonAction(polygonToAdd, props);
        }
      } // Trigger pointer move right away in order for it to update edit handles (to support double-click)


      var fakePointerMoveEvent = {
        screenCoords: [-1, -1],
        mapCoords: event.mapCoords,
        picks: [],
        isDragging: false,
        pointerDownPicks: null,
        pointerDownScreenCoords: null,
        pointerDownMapCoords: null,
        sourceEvent: null
      };
      this.handlePointerMoveAdapter(fakePointerMoveEvent);
      return editAction;
    }
  }, {
    key: "finalizedCoordinates",
    value: function finalizedCoordinates(coords) {
      // Remove the hovered position
      var coordinates = [_toConsumableArray(coords.slice(0, -2)).concat([coords[0]])];
      var pt = this.getIntermediatePoint(_toConsumableArray(coords));

      if (!pt) {
        // if intermediate point with 90 degree not available
        // try remove the last clicked point and get the intermediate point.
        var tc = _toConsumableArray(coords);

        tc.splice(-3, 1);
        pt = this.getIntermediatePoint(_toConsumableArray(tc));

        if (pt) {
          coordinates = [_toConsumableArray(coords.slice(0, -3)).concat([pt, coords[0]])];
        }
      } else {
        coordinates = [_toConsumableArray(coords.slice(0, -2)).concat([pt, coords[0]])];
      }

      return coordinates;
    }
  }, {
    key: "getIntermediatePoint",
    value: function getIntermediatePoint(coordinates) {
      var pt;

      if (coordinates.length > 4) {
        var _ref2 = _toConsumableArray(coordinates),
            p1 = _ref2[0],
            p2 = _ref2[1];

        var angle1 = (0, _bearing.default)(p1, p2);
        var p3 = coordinates[coordinates.length - 3];
        var p4 = coordinates[coordinates.length - 4];
        var angle2 = (0, _bearing.default)(p3, p4);
        var angles = {
          first: [],
          second: []
        }; // calculate 3 right angle points for first and last points in lineString

        [1, 2, 3].forEach(function (factor) {
          var newAngle1 = angle1 + factor * 90; // convert angles to 0 to -180 for anti-clock and 0 to 180 for clock wise

          angles.first.push(newAngle1 > 180 ? newAngle1 - 360 : newAngle1);
          var newAngle2 = angle2 + factor * 90;
          angles.second.push(newAngle2 > 180 ? newAngle2 - 360 : newAngle2);
        });
        var distance = (0, _distance.default)((0, _helpers.point)(p1), (0, _helpers.point)(p3)); // Draw imaginary right angle lines for both first and last points in lineString
        // If there is intersection point for any 2 lines, will be the 90 degree point.

        [0, 1, 2].forEach(function (indexFirst) {
          var line1 = (0, _helpers.lineString)([p1, (0, _destination.default)(p1, distance, angles.first[indexFirst]).geometry.coordinates]);
          [0, 1, 2].forEach(function (indexSecond) {
            var line2 = (0, _helpers.lineString)([p3, (0, _destination.default)(p3, distance, angles.second[indexSecond]).geometry.coordinates]);
            var fc = (0, _lineIntersect.default)(line1, line2);

            if (fc && fc.features.length) {
              // found the intersect point
              pt = fc.features[0].geometry.coordinates;
            }
          });
        });
      }

      return pt;
    }
  }, {
    key: "getCursorAdapter",
    value: function getCursorAdapter() {
      return 'cell';
    }
  }]);

  return Draw90DegreePolygonMode;
}(_geojsonEditMode.BaseGeoJsonEditMode);

exports.Draw90DegreePolygonMode = Draw90DegreePolygonMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvZHJhdy05MGRlZ3JlZS1wb2x5Z29uLW1vZGUuanMiXSwibmFtZXMiOlsiRHJhdzkwRGVncmVlUG9seWdvbk1vZGUiLCJwaWNrcyIsIm1hcENvb3JkcyIsInByb3BzIiwiaGFuZGxlcyIsInRlbnRhdGl2ZUZlYXR1cmUiLCJnZXRUZW50YXRpdmVGZWF0dXJlIiwiY29uY2F0IiwiZ2VvbWV0cnkiLCJ0eXBlIiwic2xpY2UiLCJjbGlja1NlcXVlbmNlIiwiZ2V0Q2xpY2tTZXF1ZW5jZSIsInJlc3VsdCIsImVkaXRBY3Rpb24iLCJjYW5jZWxNYXBQYW4iLCJsZW5ndGgiLCJjb29yZGluYXRlcyIsInAzIiwicDEiLCJwMiIsIl9zZXRUZW50YXRpdmVGZWF0dXJlIiwiZXZlbnQiLCJjbGlja2VkRWRpdEhhbmRsZSIsInBvbHlnb24iLCJmZWF0dXJlSW5kZXgiLCJwb3NpdGlvbkluZGV4ZXMiLCJwb2x5Z29uVG9BZGQiLCJmaW5hbGl6ZWRDb29yZGluYXRlcyIsInJlc2V0Q2xpY2tTZXF1ZW5jZSIsImdldEFkZEZlYXR1cmVPckJvb2xlYW5Qb2x5Z29uQWN0aW9uIiwiZmFrZVBvaW50ZXJNb3ZlRXZlbnQiLCJzY3JlZW5Db29yZHMiLCJpc0RyYWdnaW5nIiwicG9pbnRlckRvd25QaWNrcyIsInBvaW50ZXJEb3duU2NyZWVuQ29vcmRzIiwicG9pbnRlckRvd25NYXBDb29yZHMiLCJzb3VyY2VFdmVudCIsImhhbmRsZVBvaW50ZXJNb3ZlQWRhcHRlciIsImNvb3JkcyIsInB0IiwiZ2V0SW50ZXJtZWRpYXRlUG9pbnQiLCJ0YyIsInNwbGljZSIsImFuZ2xlMSIsInA0IiwiYW5nbGUyIiwiYW5nbGVzIiwiZmlyc3QiLCJzZWNvbmQiLCJmb3JFYWNoIiwiZmFjdG9yIiwibmV3QW5nbGUxIiwicHVzaCIsIm5ld0FuZ2xlMiIsImRpc3RhbmNlIiwiaW5kZXhGaXJzdCIsImxpbmUxIiwiaW5kZXhTZWNvbmQiLCJsaW5lMiIsImZjIiwiZmVhdHVyZXMi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STtBQUMvQixnQkFBTUMsS0FBSyxHQUFHLHlCQUFXLENBQ3ZCekMsRUFEdUIsRUFFdkIsMEJBQVlBLEVBQVosRUFBZ0JxQyxRQUFoQixFQUEwQlIsTUFBTSxDQUFDRSxNQUFQLENBQWNTLFdBQWQsQ0FBMUIsRUFBc0RsRCxRQUF0RCxDQUErRFMsV0FGeEMsQ0FBWCxDQUFkO0FBSUEsZ0JBQU0yQyxFQUFFLEdBQUcsNEJBQWNILEtBQWQsRUFBcUJFLEtBQXJCLENBQVg7O0FBQ0EsZ0JBQUlDLEVBQUUsSUFBSUEsRUFBRSxDQUFDQyxRQUFILENBQVk3QyxNQUF0QixFQUE4QjtBQUM1QjtBQUNBd0IsY0FBQUEsRUFBRSxHQUFHb0IsRUFBRSxDQUFDQyxRQUFILENBQVksQ0FBWixFQUFlckQsUUFBZixDQUF3QlMsV0FBN0I7QUFDRDtBQUNGLFdBVkQ7QUFXRCxTQWhCRDtBQWlCRDs7QUFDRCxhQUFPdUIsRUFBUDtBQUNEOzs7dUNBRWtCO0FBQ2pCLGFBQU8sTUFBUDtBQUNEOzs7O0VBMUwwQ3NCLG9DIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuaW1wb3J0IGRlc3RpbmF0aW9uIGZyb20gJ0B0dXJmL2Rlc3RpbmF0aW9uJztcbmltcG9ydCBiZWFyaW5nIGZyb20gJ0B0dXJmL2JlYXJpbmcnO1xuaW1wb3J0IGxpbmVJbnRlcnNlY3QgZnJvbSAnQHR1cmYvbGluZS1pbnRlcnNlY3QnO1xuaW1wb3J0IHR1cmZEaXN0YW5jZSBmcm9tICdAdHVyZi9kaXN0YW5jZSc7XG5pbXBvcnQgeyBwb2ludCwgbGluZVN0cmluZyB9IGZyb20gJ0B0dXJmL2hlbHBlcnMnO1xuaW1wb3J0IHsgZ2VuZXJhdGVQb2ludHNQYXJhbGxlbFRvTGluZVBvaW50cyB9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCB0eXBlIHsgQ2xpY2tFdmVudCwgUG9pbnRlck1vdmVFdmVudCwgTW9kZVByb3BzIH0gZnJvbSAnLi4vdHlwZXMuanMnO1xuaW1wb3J0IHR5cGUgeyBQb2x5Z29uLCBQb3NpdGlvbiwgRmVhdHVyZUNvbGxlY3Rpb24gfSBmcm9tICcuLi9nZW9qc29uLXR5cGVzLmpzJztcbmltcG9ydCB7XG4gIEJhc2VHZW9Kc29uRWRpdE1vZGUsXG4gIGdldFBpY2tlZEVkaXRIYW5kbGUsXG4gIGdldEVkaXRIYW5kbGVzRm9yR2VvbWV0cnksXG4gIHR5cGUgR2VvSnNvbkVkaXRBY3Rpb24sXG4gIHR5cGUgRWRpdEhhbmRsZVxufSBmcm9tICcuL2dlb2pzb24tZWRpdC1tb2RlLmpzJztcblxuZXhwb3J0IGNsYXNzIERyYXc5MERlZ3JlZVBvbHlnb25Nb2RlIGV4dGVuZHMgQmFzZUdlb0pzb25FZGl0TW9kZSB7XG4gIGdldEVkaXRIYW5kbGVzQWRhcHRlcihcbiAgICBwaWNrczogP0FycmF5PE9iamVjdD4sXG4gICAgbWFwQ29vcmRzOiA/UG9zaXRpb24sXG4gICAgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj5cbiAgKTogRWRpdEhhbmRsZVtdIHtcbiAgICBsZXQgaGFuZGxlcyA9IHN1cGVyLmdldEVkaXRIYW5kbGVzQWRhcHRlcihwaWNrcywgbWFwQ29vcmRzLCBwcm9wcyk7XG5cbiAgICBjb25zdCB0ZW50YXRpdmVGZWF0dXJlID0gdGhpcy5nZXRUZW50YXRpdmVGZWF0dXJlKCk7XG4gICAgaWYgKHRlbnRhdGl2ZUZlYXR1cmUpIHtcbiAgICAgIGhhbmRsZXMgPSBoYW5kbGVzLmNvbmNhdChnZXRFZGl0SGFuZGxlc0Zvckdlb21ldHJ5KHRlbnRhdGl2ZUZlYXR1cmUuZ2VvbWV0cnksIC0xKSk7XG4gICAgICAvLyBTbGljZSBvZmYgdGhlIGhhbmRsZXMgdGhhdCBhcmUgYXJlIG5leHQgdG8gdGhlIHBvaW50ZXJcbiAgICAgIGlmICh0ZW50YXRpdmVGZWF0dXJlICYmIHRlbnRhdGl2ZUZlYXR1cmUuZ2VvbWV0cnkudHlwZSA9PT0gJ0xpbmVTdHJpbmcnKSB7XG4gICAgICAgIC8vIFJlbW92ZSB0aGUgbGFzdCBleGlzdGluZyBoYW5kbGVcbiAgICAgICAgaGFuZGxlcyA9IGhhbmRsZXMuc2xpY2UoMCwgLTEpO1xuICAgICAgfSBlbHNlIGlmICh0ZW50YXRpdmVGZWF0dXJlICYmIHRlbnRhdGl2ZUZlYXR1cmUuZ2VvbWV0cnkudHlwZSA9PT0gJ1BvbHlnb24nKSB7XG4gICAgICAgIC8vIFJlbW92ZSB0aGUgbGFzdCBleGlzdGluZyBoYW5kbGVcbiAgICAgICAgaGFuZGxlcyA9IGhhbmRsZXMuc2xpY2UoMCwgLTEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBoYW5kbGVzO1xuICB9XG5cbiAgaGFuZGxlUG9pbnRlck1vdmVBZGFwdGVyKHtcbiAgICBtYXBDb29yZHNcbiAgfTogUG9pbnRlck1vdmVFdmVudCk6IHsgZWRpdEFjdGlvbjogP0dlb0pzb25FZGl0QWN0aW9uLCBjYW5jZWxNYXBQYW46IGJvb2xlYW4gfSB7XG4gICAgY29uc3QgY2xpY2tTZXF1ZW5jZSA9IHRoaXMuZ2V0Q2xpY2tTZXF1ZW5jZSgpO1xuICAgIGNvbnN0IHJlc3VsdCA9IHsgZWRpdEFjdGlvbjogbnVsbCwgY2FuY2VsTWFwUGFuOiBmYWxzZSB9O1xuXG4gICAgaWYgKGNsaWNrU2VxdWVuY2UubGVuZ3RoID09PSAwKSB7XG4gICAgICAvLyBub3RoaW5nIHRvIGRvIHlldFxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBjb25zdCB0ZW50YXRpdmVGZWF0dXJlID0gdGhpcy5nZXRUZW50YXRpdmVGZWF0dXJlKCk7XG4gICAgaWYgKHRlbnRhdGl2ZUZlYXR1cmUgJiYgdGVudGF0aXZlRmVhdHVyZS5nZW9tZXRyeS50eXBlID09PSAnUG9seWdvbicpIHtcbiAgICAgIGNsaWNrU2VxdWVuY2VbY2xpY2tTZXF1ZW5jZS5sZW5ndGggLSAxXSA9XG4gICAgICAgIHRlbnRhdGl2ZUZlYXR1cmUuZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMF1bY2xpY2tTZXF1ZW5jZS5sZW5ndGggLSAxXTtcbiAgICB9IGVsc2UgaWYgKHRlbnRhdGl2ZUZlYXR1cmUgJiYgdGVudGF0aXZlRmVhdHVyZS5nZW9tZXRyeS50eXBlID09PSAnTGluZVN0cmluZycpIHtcbiAgICAgIGNsaWNrU2VxdWVuY2VbY2xpY2tTZXF1ZW5jZS5sZW5ndGggLSAxXSA9XG4gICAgICAgIHRlbnRhdGl2ZUZlYXR1cmUuZ2VvbWV0cnkuY29vcmRpbmF0ZXNbY2xpY2tTZXF1ZW5jZS5sZW5ndGggLSAxXTtcbiAgICB9XG5cbiAgICBsZXQgcDM7XG4gICAgaWYgKGNsaWNrU2VxdWVuY2UubGVuZ3RoID09PSAxKSB7XG4gICAgICBwMyA9IG1hcENvb3JkcztcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgcDEgPSBjbGlja1NlcXVlbmNlW2NsaWNrU2VxdWVuY2UubGVuZ3RoIC0gMl07XG4gICAgICBjb25zdCBwMiA9IGNsaWNrU2VxdWVuY2VbY2xpY2tTZXF1ZW5jZS5sZW5ndGggLSAxXTtcbiAgICAgIFtwM10gPSBnZW5lcmF0ZVBvaW50c1BhcmFsbGVsVG9MaW5lUG9pbnRzKHAxLCBwMiwgbWFwQ29vcmRzKTtcbiAgICB9XG5cbiAgICBpZiAoY2xpY2tTZXF1ZW5jZS5sZW5ndGggPCAzKSB7XG4gICAgICAvLyBEcmF3IGEgTGluZVN0cmluZyBjb25uZWN0aW5nIGFsbCB0aGUgY2xpY2tlZCBwb2ludHMgd2l0aCB0aGUgaG92ZXJlZCBwb2ludFxuICAgICAgdGhpcy5fc2V0VGVudGF0aXZlRmVhdHVyZSh7XG4gICAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgICAgZ2VvbWV0cnk6IHtcbiAgICAgICAgICB0eXBlOiAnTGluZVN0cmluZycsXG4gICAgICAgICAgY29vcmRpbmF0ZXM6IFsuLi5jbGlja1NlcXVlbmNlLCBwM11cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIERyYXcgYSBQb2x5Z29uIGNvbm5lY3RpbmcgYWxsIHRoZSBjbGlja2VkIHBvaW50cyB3aXRoIHRoZSBob3ZlcmVkIHBvaW50XG4gICAgICB0aGlzLl9zZXRUZW50YXRpdmVGZWF0dXJlKHtcbiAgICAgICAgdHlwZTogJ0ZlYXR1cmUnLFxuICAgICAgICBnZW9tZXRyeToge1xuICAgICAgICAgIHR5cGU6ICdQb2x5Z29uJyxcbiAgICAgICAgICBjb29yZGluYXRlczogW1suLi5jbGlja1NlcXVlbmNlLCBwMywgY2xpY2tTZXF1ZW5jZVswXV1dXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBoYW5kbGVDbGlja0FkYXB0ZXIoZXZlbnQ6IENsaWNrRXZlbnQsIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KTogP0dlb0pzb25FZGl0QWN0aW9uIHtcbiAgICBzdXBlci5oYW5kbGVDbGlja0FkYXB0ZXIoZXZlbnQsIHByb3BzKTtcblxuICAgIGNvbnN0IHsgcGlja3MgfSA9IGV2ZW50O1xuICAgIGNvbnN0IHRlbnRhdGl2ZUZlYXR1cmUgPSB0aGlzLmdldFRlbnRhdGl2ZUZlYXR1cmUoKTtcblxuICAgIGxldCBlZGl0QWN0aW9uOiA/R2VvSnNvbkVkaXRBY3Rpb24gPSBudWxsO1xuICAgIGNvbnN0IGNsaWNrZWRFZGl0SGFuZGxlID0gZ2V0UGlja2VkRWRpdEhhbmRsZShwaWNrcyk7XG5cbiAgICBpZiAodGVudGF0aXZlRmVhdHVyZSAmJiB0ZW50YXRpdmVGZWF0dXJlLmdlb21ldHJ5LnR5cGUgPT09ICdQb2x5Z29uJykge1xuICAgICAgY29uc3QgcG9seWdvbjogUG9seWdvbiA9IHRlbnRhdGl2ZUZlYXR1cmUuZ2VvbWV0cnk7XG5cbiAgICAgIGlmIChcbiAgICAgICAgY2xpY2tlZEVkaXRIYW5kbGUgJiZcbiAgICAgICAgY2xpY2tlZEVkaXRIYW5kbGUuZmVhdHVyZUluZGV4ID09PSAtMSAmJlxuICAgICAgICAoY2xpY2tlZEVkaXRIYW5kbGUucG9zaXRpb25JbmRleGVzWzFdID09PSAwIHx8XG4gICAgICAgICAgY2xpY2tlZEVkaXRIYW5kbGUucG9zaXRpb25JbmRleGVzWzFdID09PSBwb2x5Z29uLmNvb3JkaW5hdGVzWzBdLmxlbmd0aCAtIDMpXG4gICAgICApIHtcbiAgICAgICAgLy8gVGhleSBjbGlja2VkIHRoZSBmaXJzdCBvciBsYXN0IHBvaW50IChvciBkb3VibGUtY2xpY2tlZCksIHNvIGNvbXBsZXRlIHRoZSBwb2x5Z29uXG4gICAgICAgIGNvbnN0IHBvbHlnb25Ub0FkZDogUG9seWdvbiA9IHtcbiAgICAgICAgICB0eXBlOiAnUG9seWdvbicsXG4gICAgICAgICAgY29vcmRpbmF0ZXM6IHRoaXMuZmluYWxpemVkQ29vcmRpbmF0ZXMoWy4uLnBvbHlnb24uY29vcmRpbmF0ZXNbMF1dKVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMucmVzZXRDbGlja1NlcXVlbmNlKCk7XG4gICAgICAgIHRoaXMuX3NldFRlbnRhdGl2ZUZlYXR1cmUobnVsbCk7XG4gICAgICAgIGVkaXRBY3Rpb24gPSB0aGlzLmdldEFkZEZlYXR1cmVPckJvb2xlYW5Qb2x5Z29uQWN0aW9uKHBvbHlnb25Ub0FkZCwgcHJvcHMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRyaWdnZXIgcG9pbnRlciBtb3ZlIHJpZ2h0IGF3YXkgaW4gb3JkZXIgZm9yIGl0IHRvIHVwZGF0ZSBlZGl0IGhhbmRsZXMgKHRvIHN1cHBvcnQgZG91YmxlLWNsaWNrKVxuICAgIGNvbnN0IGZha2VQb2ludGVyTW92ZUV2ZW50ID0ge1xuICAgICAgc2NyZWVuQ29vcmRzOiBbLTEsIC0xXSxcbiAgICAgIG1hcENvb3JkczogZXZlbnQubWFwQ29vcmRzLFxuICAgICAgcGlja3M6IFtdLFxuICAgICAgaXNEcmFnZ2luZzogZmFsc2UsXG4gICAgICBwb2ludGVyRG93blBpY2tzOiBudWxsLFxuICAgICAgcG9pbnRlckRvd25TY3JlZW5Db29yZHM6IG51bGwsXG4gICAgICBwb2ludGVyRG93bk1hcENvb3JkczogbnVsbCxcbiAgICAgIHNvdXJjZUV2ZW50OiBudWxsXG4gICAgfTtcbiAgICB0aGlzLmhhbmRsZVBvaW50ZXJNb3ZlQWRhcHRlcihmYWtlUG9pbnRlck1vdmVFdmVudCk7XG5cbiAgICByZXR1cm4gZWRpdEFjdGlvbjtcbiAgfVxuXG4gIGZpbmFsaXplZENvb3JkaW5hdGVzKGNvb3JkczogUG9zaXRpb25bXSkge1xuICAgIC8vIFJlbW92ZSB0aGUgaG92ZXJlZCBwb3NpdGlvblxuICAgIGxldCBjb29yZGluYXRlcyA9IFtbLi4uY29vcmRzLnNsaWNlKDAsIC0yKSwgY29vcmRzWzBdXV07XG4gICAgbGV0IHB0ID0gdGhpcy5nZXRJbnRlcm1lZGlhdGVQb2ludChbLi4uY29vcmRzXSk7XG4gICAgaWYgKCFwdCkge1xuICAgICAgLy8gaWYgaW50ZXJtZWRpYXRlIHBvaW50IHdpdGggOTAgZGVncmVlIG5vdCBhdmFpbGFibGVcbiAgICAgIC8vIHRyeSByZW1vdmUgdGhlIGxhc3QgY2xpY2tlZCBwb2ludCBhbmQgZ2V0IHRoZSBpbnRlcm1lZGlhdGUgcG9pbnQuXG4gICAgICBjb25zdCB0YyA9IFsuLi5jb29yZHNdO1xuICAgICAgdGMuc3BsaWNlKC0zLCAxKTtcbiAgICAgIHB0ID0gdGhpcy5nZXRJbnRlcm1lZGlhdGVQb2ludChbLi4udGNdKTtcbiAgICAgIGlmIChwdCkge1xuICAgICAgICBjb29yZGluYXRlcyA9IFtbLi4uY29vcmRzLnNsaWNlKDAsIC0zKSwgcHQsIGNvb3Jkc1swXV1dO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb29yZGluYXRlcyA9IFtbLi4uY29vcmRzLnNsaWNlKDAsIC0yKSwgcHQsIGNvb3Jkc1swXV1dO1xuICAgIH1cbiAgICByZXR1cm4gY29vcmRpbmF0ZXM7XG4gIH1cblxuICBnZXRJbnRlcm1lZGlhdGVQb2ludChjb29yZGluYXRlczogUG9zaXRpb25bXSkge1xuICAgIGxldCBwdDtcbiAgICBpZiAoY29vcmRpbmF0ZXMubGVuZ3RoID4gNCkge1xuICAgICAgY29uc3QgW3AxLCBwMl0gPSBbLi4uY29vcmRpbmF0ZXNdO1xuICAgICAgY29uc3QgYW5nbGUxID0gYmVhcmluZyhwMSwgcDIpO1xuICAgICAgY29uc3QgcDMgPSBjb29yZGluYXRlc1tjb29yZGluYXRlcy5sZW5ndGggLSAzXTtcbiAgICAgIGNvbnN0IHA0ID0gY29vcmRpbmF0ZXNbY29vcmRpbmF0ZXMubGVuZ3RoIC0gNF07XG4gICAgICBjb25zdCBhbmdsZTIgPSBiZWFyaW5nKHAzLCBwNCk7XG5cbiAgICAgIGNvbnN0IGFuZ2xlcyA9IHsgZmlyc3Q6IFtdLCBzZWNvbmQ6IFtdIH07XG4gICAgICAvLyBjYWxjdWxhdGUgMyByaWdodCBhbmdsZSBwb2ludHMgZm9yIGZpcnN0IGFuZCBsYXN0IHBvaW50cyBpbiBsaW5lU3RyaW5nXG4gICAgICBbMSwgMiwgM10uZm9yRWFjaChmYWN0b3IgPT4ge1xuICAgICAgICBjb25zdCBuZXdBbmdsZTEgPSBhbmdsZTEgKyBmYWN0b3IgKiA5MDtcbiAgICAgICAgLy8gY29udmVydCBhbmdsZXMgdG8gMCB0byAtMTgwIGZvciBhbnRpLWNsb2NrIGFuZCAwIHRvIDE4MCBmb3IgY2xvY2sgd2lzZVxuICAgICAgICBhbmdsZXMuZmlyc3QucHVzaChuZXdBbmdsZTEgPiAxODAgPyBuZXdBbmdsZTEgLSAzNjAgOiBuZXdBbmdsZTEpO1xuICAgICAgICBjb25zdCBuZXdBbmdsZTIgPSBhbmdsZTIgKyBmYWN0b3IgKiA5MDtcbiAgICAgICAgYW5nbGVzLnNlY29uZC5wdXNoKG5ld0FuZ2xlMiA+IDE4MCA/IG5ld0FuZ2xlMiAtIDM2MCA6IG5ld0FuZ2xlMik7XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgZGlzdGFuY2UgPSB0dXJmRGlzdGFuY2UocG9pbnQocDEpLCBwb2ludChwMykpO1xuICAgICAgLy8gRHJhdyBpbWFnaW5hcnkgcmlnaHQgYW5nbGUgbGluZXMgZm9yIGJvdGggZmlyc3QgYW5kIGxhc3QgcG9pbnRzIGluIGxpbmVTdHJpbmdcbiAgICAgIC8vIElmIHRoZXJlIGlzIGludGVyc2VjdGlvbiBwb2ludCBmb3IgYW55IDIgbGluZXMsIHdpbGwgYmUgdGhlIDkwIGRlZ3JlZSBwb2ludC5cbiAgICAgIFswLCAxLCAyXS5mb3JFYWNoKGluZGV4Rmlyc3QgPT4ge1xuICAgICAgICBjb25zdCBsaW5lMSA9IGxpbmVTdHJpbmcoW1xuICAgICAgICAgIHAxLFxuICAgICAgICAgIGRlc3RpbmF0aW9uKHAxLCBkaXN0YW5jZSwgYW5nbGVzLmZpcnN0W2luZGV4Rmlyc3RdKS5nZW9tZXRyeS5jb29yZGluYXRlc1xuICAgICAgICBdKTtcbiAgICAgICAgWzAsIDEsIDJdLmZvckVhY2goaW5kZXhTZWNvbmQgPT4ge1xuICAgICAgICAgIGNvbnN0IGxpbmUyID0gbGluZVN0cmluZyhbXG4gICAgICAgICAgICBwMyxcbiAgICAgICAgICAgIGRlc3RpbmF0aW9uKHAzLCBkaXN0YW5jZSwgYW5nbGVzLnNlY29uZFtpbmRleFNlY29uZF0pLmdlb21ldHJ5LmNvb3JkaW5hdGVzXG4gICAgICAgICAgXSk7XG4gICAgICAgICAgY29uc3QgZmMgPSBsaW5lSW50ZXJzZWN0KGxpbmUxLCBsaW5lMik7XG4gICAgICAgICAgaWYgKGZjICYmIGZjLmZlYXR1cmVzLmxlbmd0aCkge1xuICAgICAgICAgICAgLy8gZm91bmQgdGhlIGludGVyc2VjdCBwb2ludFxuICAgICAgICAgICAgcHQgPSBmYy5mZWF0dXJlc1swXS5nZW9tZXRyeS5jb29yZGluYXRlcztcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBwdDtcbiAgfVxuXG4gIGdldEN1cnNvckFkYXB0ZXIoKSB7XG4gICAgcmV0dXJuICdjZWxsJztcbiAgfVxufVxuIl19