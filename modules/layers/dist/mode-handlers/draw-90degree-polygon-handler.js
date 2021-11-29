"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Draw90DegreePolygonHandler = void 0;

var _destination = _interopRequireDefault(require("@turf/destination"));

var _bearing = _interopRequireDefault(require("@turf/bearing"));

var _lineIntersect = _interopRequireDefault(require("@turf/line-intersect"));

var _distance = _interopRequireDefault(require("@turf/distance"));

var _helpers = require("@turf/helpers");

var _utils = require("../utils");

var _modeHandler = require("./mode-handler.js");

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

// TODO edit-modes: delete handlers once EditMode fully implemented
var Draw90DegreePolygonHandler =
/*#__PURE__*/
function (_ModeHandler) {
  _inherits(Draw90DegreePolygonHandler, _ModeHandler);

  function Draw90DegreePolygonHandler() {
    _classCallCheck(this, Draw90DegreePolygonHandler);

    return _possibleConstructorReturn(this, _getPrototypeOf(Draw90DegreePolygonHandler).apply(this, arguments));
  }

  _createClass(Draw90DegreePolygonHandler, [{
    key: "getEditHandles",
    value: function getEditHandles(picks, groundCoords) {
      var handles = _get(_getPrototypeOf(Draw90DegreePolygonHandler.prototype), "getEditHandles", this).call(this, picks, groundCoords);

      var tentativeFeature = this.getTentativeFeature();

      if (tentativeFeature) {
        handles = handles.concat((0, _modeHandler.getEditHandlesForGeometry)(tentativeFeature.geometry, -1)); // Slice off the handles that are are next to the pointer

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

      var tentativeFeature = this.getTentativeFeature();

      if (tentativeFeature && tentativeFeature.geometry.type === 'Polygon') {
        clickSequence[clickSequence.length - 1] = tentativeFeature.geometry.coordinates[0][clickSequence.length - 1];
      } else if (tentativeFeature && tentativeFeature.geometry.type === 'LineString') {
        clickSequence[clickSequence.length - 1] = tentativeFeature.geometry.coordinates[clickSequence.length - 1];
      }

      var p3;

      if (clickSequence.length === 1) {
        p3 = groundCoords;
      } else {
        var p1 = clickSequence[clickSequence.length - 2];
        var p2 = clickSequence[clickSequence.length - 1];

        var _generatePointsParall = (0, _utils.generatePointsParallelToLinePoints)(p1, p2, groundCoords);

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
    key: "handleClick",
    value: function handleClick(event) {
      _get(_getPrototypeOf(Draw90DegreePolygonHandler.prototype), "handleClick", this).call(this, event);

      var picks = event.picks;
      var tentativeFeature = this.getTentativeFeature();
      var editAction = null;
      var clickedEditHandle = (0, _modeHandler.getPickedEditHandle)(picks);

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

          editAction = this.getAddFeatureOrBooleanPolygonAction(polygonToAdd);
        }
      } // Trigger pointer move right away in order for it to update edit handles (to support double-click)


      var fakePointerMoveEvent = {
        screenCoords: [-1, -1],
        groundCoords: event.groundCoords,
        picks: [],
        isDragging: false,
        pointerDownPicks: null,
        pointerDownScreenCoords: null,
        pointerDownGroundCoords: null,
        sourceEvent: null
      };
      this.handlePointerMove(fakePointerMoveEvent);
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
  }]);

  return Draw90DegreePolygonHandler;
}(_modeHandler.ModeHandler);

exports.Draw90DegreePolygonHandler = Draw90DegreePolygonHandler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL2RyYXctOTBkZWdyZWUtcG9seWdvbi1oYW5kbGVyLmpzIl0sIm5hbWVzIjpbIkRyYXc5MERlZ3JlZVBvbHlnb25IYW5kbGVyIiwicGlja3MiLCJncm91bmRDb29yZHMiLCJoYW5kbGVzIiwidGVudGF0aXZlRmVhdHVyZSIsImdldFRlbnRhdGl2ZUZlYXR1cmUiLCJjb25jYXQiLCJnZW9tZXRyeSIsInR5cGUiLCJzbGljZSIsImNsaWNrU2VxdWVuY2UiLCJnZXRDbGlja1NlcXVlbmNlIiwicmVzdWx0IiwiZWRpdEFjdGlvbiIsImNhbmNlbE1hcFBhbiIsImxlbmd0aCIsImNvb3JkaW5hdGVzIiwicDMiLCJwMSIsInAyIiwiX3NldFRlbnRhdGl2ZUZlYXR1cmUiLCJldmVudCIsImNsaWNrZWRFZGl0SGFuZGxlIiwicG9seWdvbiIsImZlYXR1cmVJbmRleCIsInBvc2l0aW9uSW5kZXhlcyIsInBvbHlnb25Ub0FkZCIsImZpbmFsaXplZENvb3JkaW5hdGVzIiwicmVzZXRDbGlja1NlcXVlbmNlIiwiZ2V0QWRkRmVhdHVyZU9yQm9vbGVhblBvbHlnb25BY3Rpb24iLCJmYWtlUG9pbnRlck1vdmVFdmVudCIsInNjcmVlbkNvb3JkcyIsImlzRHJhZ2dpbmciLCJwb2ludGVyRG93blBpY2tzIiwicG9pbnRlckRvd25TY3JlZW5Db29yZHMiLCJwb2ludGVyRG93bkdyb3VuZENvb3JkcyIsInNvdXJjZUV2ZW50IiwiaGFuZGxlUG9pbnRlck1vdmUiLCJjb29yZHMiLCJwdCIsImdldEludGVybWVkaWF0ZVBvaW50IiwidGMiLCJzcGxpY2UiLCJhbmdsZTEiLCJwNCIsImFuZ2xlMiIsImFuZ2xlcyIsImZpcnN0Iiwic2Vjb25kIiwiZm9yRWFjaCIsImZhY3RvciIsIm5ld0FuZ2xlMSIsInB1c2giLCJuZXdBbmdsZTIiLCJkaXN0YW5jZSIsImluZGV4Rmlyc3QiLCJsaW5lMSIsImluZGV4U2Vjb25kIiwibGluZTIiLCJmYyIsImZl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QSxFQUFaLEVBQWdCcUMsUUFBaEIsRUFBMEJSLE1BQU0sQ0FBQ0UsTUFBUCxDQUFjUyxXQUFkLENBQTFCLEVBQXNEbEQsUUFBdEQsQ0FBK0RTLFdBRnhDLENBQVgsQ0FBZDtBQUlBLGdCQUFNMkMsRUFBRSxHQUFHLDRCQUFjSCxLQUFkLEVBQXFCRSxLQUFyQixDQUFYOztBQUNBLGdCQUFJQyxFQUFFLElBQUlBLEVBQUUsQ0FBQ0MsUUFBSCxDQUFZN0MsTUFBdEIsRUFBOEI7QUFDNUI7QUFDQXdCLGNBQUFBLEVBQUUsR0FBR29CLEVBQUUsQ0FBQ0MsUUFBSCxDQUFZLENBQVosRUFBZXJELFFBQWYsQ0FBd0JTLFdBQTdCO0FBQ0Q7QUFDRixXQVZEO0FBV0QsU0FoQkQ7QUFpQkQ7O0FBQ0QsYUFBT3VCLEVBQVA7QUFDRDs7OztFQWxMNkNzQix3QiIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbmltcG9ydCBkZXN0aW5hdGlvbiBmcm9tICdAdHVyZi9kZXN0aW5hdGlvbic7XG5pbXBvcnQgYmVhcmluZyBmcm9tICdAdHVyZi9iZWFyaW5nJztcbmltcG9ydCBsaW5lSW50ZXJzZWN0IGZyb20gJ0B0dXJmL2xpbmUtaW50ZXJzZWN0JztcbmltcG9ydCB0dXJmRGlzdGFuY2UgZnJvbSAnQHR1cmYvZGlzdGFuY2UnO1xuaW1wb3J0IHsgcG9pbnQsIGxpbmVTdHJpbmcgfSBmcm9tICdAdHVyZi9oZWxwZXJzJztcbmltcG9ydCB0eXBlIHsgUG9seWdvbiwgUG9zaXRpb24gfSBmcm9tICdAbmVidWxhLmdsL2VkaXQtbW9kZXMnO1xuaW1wb3J0IHsgZ2VuZXJhdGVQb2ludHNQYXJhbGxlbFRvTGluZVBvaW50cyB9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCB0eXBlIHsgQ2xpY2tFdmVudCwgUG9pbnRlck1vdmVFdmVudCB9IGZyb20gJy4uL2V2ZW50LXR5cGVzLmpzJztcbmltcG9ydCB0eXBlIHsgRWRpdEFjdGlvbiwgRWRpdEhhbmRsZSB9IGZyb20gJy4vbW9kZS1oYW5kbGVyLmpzJztcbmltcG9ydCB7IE1vZGVIYW5kbGVyLCBnZXRQaWNrZWRFZGl0SGFuZGxlLCBnZXRFZGl0SGFuZGxlc0Zvckdlb21ldHJ5IH0gZnJvbSAnLi9tb2RlLWhhbmRsZXIuanMnO1xuXG4vLyBUT0RPIGVkaXQtbW9kZXM6IGRlbGV0ZSBoYW5kbGVycyBvbmNlIEVkaXRNb2RlIGZ1bGx5IGltcGxlbWVudGVkXG5leHBvcnQgY2xhc3MgRHJhdzkwRGVncmVlUG9seWdvbkhhbmRsZXIgZXh0ZW5kcyBNb2RlSGFuZGxlciB7XG4gIGdldEVkaXRIYW5kbGVzKHBpY2tzPzogQXJyYXk8T2JqZWN0PiwgZ3JvdW5kQ29vcmRzPzogUG9zaXRpb24pOiBFZGl0SGFuZGxlW10ge1xuICAgIGxldCBoYW5kbGVzID0gc3VwZXIuZ2V0RWRpdEhhbmRsZXMocGlja3MsIGdyb3VuZENvb3Jkcyk7XG5cbiAgICBjb25zdCB0ZW50YXRpdmVGZWF0dXJlID0gdGhpcy5nZXRUZW50YXRpdmVGZWF0dXJlKCk7XG4gICAgaWYgKHRlbnRhdGl2ZUZlYXR1cmUpIHtcbiAgICAgIGhhbmRsZXMgPSBoYW5kbGVzLmNvbmNhdChnZXRFZGl0SGFuZGxlc0Zvckdlb21ldHJ5KHRlbnRhdGl2ZUZlYXR1cmUuZ2VvbWV0cnksIC0xKSk7XG4gICAgICAvLyBTbGljZSBvZmYgdGhlIGhhbmRsZXMgdGhhdCBhcmUgYXJlIG5leHQgdG8gdGhlIHBvaW50ZXJcbiAgICAgIGlmICh0ZW50YXRpdmVGZWF0dXJlICYmIHRlbnRhdGl2ZUZlYXR1cmUuZ2VvbWV0cnkudHlwZSA9PT0gJ0xpbmVTdHJpbmcnKSB7XG4gICAgICAgIC8vIFJlbW92ZSB0aGUgbGFzdCBleGlzdGluZyBoYW5kbGVcbiAgICAgICAgaGFuZGxlcyA9IGhhbmRsZXMuc2xpY2UoMCwgLTEpO1xuICAgICAgfSBlbHNlIGlmICh0ZW50YXRpdmVGZWF0dXJlICYmIHRlbnRhdGl2ZUZlYXR1cmUuZ2VvbWV0cnkudHlwZSA9PT0gJ1BvbHlnb24nKSB7XG4gICAgICAgIC8vIFJlbW92ZSB0aGUgbGFzdCBleGlzdGluZyBoYW5kbGVcbiAgICAgICAgaGFuZGxlcyA9IGhhbmRsZXMuc2xpY2UoMCwgLTEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBoYW5kbGVzO1xuICB9XG5cbiAgaGFuZGxlUG9pbnRlck1vdmUoe1xuICAgIGdyb3VuZENvb3Jkc1xuICB9OiBQb2ludGVyTW92ZUV2ZW50KTogeyBlZGl0QWN0aW9uOiA/RWRpdEFjdGlvbiwgY2FuY2VsTWFwUGFuOiBib29sZWFuIH0ge1xuICAgIGNvbnN0IGNsaWNrU2VxdWVuY2UgPSB0aGlzLmdldENsaWNrU2VxdWVuY2UoKTtcbiAgICBjb25zdCByZXN1bHQgPSB7IGVkaXRBY3Rpb246IG51bGwsIGNhbmNlbE1hcFBhbjogZmFsc2UgfTtcblxuICAgIGlmIChjbGlja1NlcXVlbmNlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgLy8gbm90aGluZyB0byBkbyB5ZXRcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgY29uc3QgdGVudGF0aXZlRmVhdHVyZSA9IHRoaXMuZ2V0VGVudGF0aXZlRmVhdHVyZSgpO1xuICAgIGlmICh0ZW50YXRpdmVGZWF0dXJlICYmIHRlbnRhdGl2ZUZlYXR1cmUuZ2VvbWV0cnkudHlwZSA9PT0gJ1BvbHlnb24nKSB7XG4gICAgICBjbGlja1NlcXVlbmNlW2NsaWNrU2VxdWVuY2UubGVuZ3RoIC0gMV0gPVxuICAgICAgICB0ZW50YXRpdmVGZWF0dXJlLmdlb21ldHJ5LmNvb3JkaW5hdGVzWzBdW2NsaWNrU2VxdWVuY2UubGVuZ3RoIC0gMV07XG4gICAgfSBlbHNlIGlmICh0ZW50YXRpdmVGZWF0dXJlICYmIHRlbnRhdGl2ZUZlYXR1cmUuZ2VvbWV0cnkudHlwZSA9PT0gJ0xpbmVTdHJpbmcnKSB7XG4gICAgICBjbGlja1NlcXVlbmNlW2NsaWNrU2VxdWVuY2UubGVuZ3RoIC0gMV0gPVxuICAgICAgICB0ZW50YXRpdmVGZWF0dXJlLmdlb21ldHJ5LmNvb3JkaW5hdGVzW2NsaWNrU2VxdWVuY2UubGVuZ3RoIC0gMV07XG4gICAgfVxuXG4gICAgbGV0IHAzO1xuICAgIGlmIChjbGlja1NlcXVlbmNlLmxlbmd0aCA9PT0gMSkge1xuICAgICAgcDMgPSBncm91bmRDb29yZHM7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHAxID0gY2xpY2tTZXF1ZW5jZVtjbGlja1NlcXVlbmNlLmxlbmd0aCAtIDJdO1xuICAgICAgY29uc3QgcDIgPSBjbGlja1NlcXVlbmNlW2NsaWNrU2VxdWVuY2UubGVuZ3RoIC0gMV07XG4gICAgICBbcDNdID0gZ2VuZXJhdGVQb2ludHNQYXJhbGxlbFRvTGluZVBvaW50cyhwMSwgcDIsIGdyb3VuZENvb3Jkcyk7XG4gICAgfVxuXG4gICAgaWYgKGNsaWNrU2VxdWVuY2UubGVuZ3RoIDwgMykge1xuICAgICAgLy8gRHJhdyBhIExpbmVTdHJpbmcgY29ubmVjdGluZyBhbGwgdGhlIGNsaWNrZWQgcG9pbnRzIHdpdGggdGhlIGhvdmVyZWQgcG9pbnRcbiAgICAgIHRoaXMuX3NldFRlbnRhdGl2ZUZlYXR1cmUoe1xuICAgICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgICAgdHlwZTogJ0xpbmVTdHJpbmcnLFxuICAgICAgICAgIGNvb3JkaW5hdGVzOiBbLi4uY2xpY2tTZXF1ZW5jZSwgcDNdXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBEcmF3IGEgUG9seWdvbiBjb25uZWN0aW5nIGFsbCB0aGUgY2xpY2tlZCBwb2ludHMgd2l0aCB0aGUgaG92ZXJlZCBwb2ludFxuICAgICAgdGhpcy5fc2V0VGVudGF0aXZlRmVhdHVyZSh7XG4gICAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgICAgZ2VvbWV0cnk6IHtcbiAgICAgICAgICB0eXBlOiAnUG9seWdvbicsXG4gICAgICAgICAgY29vcmRpbmF0ZXM6IFtbLi4uY2xpY2tTZXF1ZW5jZSwgcDMsIGNsaWNrU2VxdWVuY2VbMF1dXVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgaGFuZGxlQ2xpY2soZXZlbnQ6IENsaWNrRXZlbnQpOiA/RWRpdEFjdGlvbiB7XG4gICAgc3VwZXIuaGFuZGxlQ2xpY2soZXZlbnQpO1xuXG4gICAgY29uc3QgeyBwaWNrcyB9ID0gZXZlbnQ7XG4gICAgY29uc3QgdGVudGF0aXZlRmVhdHVyZSA9IHRoaXMuZ2V0VGVudGF0aXZlRmVhdHVyZSgpO1xuXG4gICAgbGV0IGVkaXRBY3Rpb246ID9FZGl0QWN0aW9uID0gbnVsbDtcbiAgICBjb25zdCBjbGlja2VkRWRpdEhhbmRsZSA9IGdldFBpY2tlZEVkaXRIYW5kbGUocGlja3MpO1xuXG4gICAgaWYgKHRlbnRhdGl2ZUZlYXR1cmUgJiYgdGVudGF0aXZlRmVhdHVyZS5nZW9tZXRyeS50eXBlID09PSAnUG9seWdvbicpIHtcbiAgICAgIGNvbnN0IHBvbHlnb246IFBvbHlnb24gPSB0ZW50YXRpdmVGZWF0dXJlLmdlb21ldHJ5O1xuXG4gICAgICBpZiAoXG4gICAgICAgIGNsaWNrZWRFZGl0SGFuZGxlICYmXG4gICAgICAgIGNsaWNrZWRFZGl0SGFuZGxlLmZlYXR1cmVJbmRleCA9PT0gLTEgJiZcbiAgICAgICAgKGNsaWNrZWRFZGl0SGFuZGxlLnBvc2l0aW9uSW5kZXhlc1sxXSA9PT0gMCB8fFxuICAgICAgICAgIGNsaWNrZWRFZGl0SGFuZGxlLnBvc2l0aW9uSW5kZXhlc1sxXSA9PT0gcG9seWdvbi5jb29yZGluYXRlc1swXS5sZW5ndGggLSAzKVxuICAgICAgKSB7XG4gICAgICAgIC8vIFRoZXkgY2xpY2tlZCB0aGUgZmlyc3Qgb3IgbGFzdCBwb2ludCAob3IgZG91YmxlLWNsaWNrZWQpLCBzbyBjb21wbGV0ZSB0aGUgcG9seWdvblxuICAgICAgICBjb25zdCBwb2x5Z29uVG9BZGQ6IFBvbHlnb24gPSB7XG4gICAgICAgICAgdHlwZTogJ1BvbHlnb24nLFxuICAgICAgICAgIGNvb3JkaW5hdGVzOiB0aGlzLmZpbmFsaXplZENvb3JkaW5hdGVzKFsuLi5wb2x5Z29uLmNvb3JkaW5hdGVzWzBdXSlcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnJlc2V0Q2xpY2tTZXF1ZW5jZSgpO1xuICAgICAgICB0aGlzLl9zZXRUZW50YXRpdmVGZWF0dXJlKG51bGwpO1xuICAgICAgICBlZGl0QWN0aW9uID0gdGhpcy5nZXRBZGRGZWF0dXJlT3JCb29sZWFuUG9seWdvbkFjdGlvbihwb2x5Z29uVG9BZGQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRyaWdnZXIgcG9pbnRlciBtb3ZlIHJpZ2h0IGF3YXkgaW4gb3JkZXIgZm9yIGl0IHRvIHVwZGF0ZSBlZGl0IGhhbmRsZXMgKHRvIHN1cHBvcnQgZG91YmxlLWNsaWNrKVxuICAgIGNvbnN0IGZha2VQb2ludGVyTW92ZUV2ZW50ID0ge1xuICAgICAgc2NyZWVuQ29vcmRzOiBbLTEsIC0xXSxcbiAgICAgIGdyb3VuZENvb3JkczogZXZlbnQuZ3JvdW5kQ29vcmRzLFxuICAgICAgcGlja3M6IFtdLFxuICAgICAgaXNEcmFnZ2luZzogZmFsc2UsXG4gICAgICBwb2ludGVyRG93blBpY2tzOiBudWxsLFxuICAgICAgcG9pbnRlckRvd25TY3JlZW5Db29yZHM6IG51bGwsXG4gICAgICBwb2ludGVyRG93bkdyb3VuZENvb3JkczogbnVsbCxcbiAgICAgIHNvdXJjZUV2ZW50OiBudWxsXG4gICAgfTtcbiAgICB0aGlzLmhhbmRsZVBvaW50ZXJNb3ZlKGZha2VQb2ludGVyTW92ZUV2ZW50KTtcblxuICAgIHJldHVybiBlZGl0QWN0aW9uO1xuICB9XG5cbiAgZmluYWxpemVkQ29vcmRpbmF0ZXMoY29vcmRzOiBQb3NpdGlvbltdKSB7XG4gICAgLy8gUmVtb3ZlIHRoZSBob3ZlcmVkIHBvc2l0aW9uXG4gICAgbGV0IGNvb3JkaW5hdGVzID0gW1suLi5jb29yZHMuc2xpY2UoMCwgLTIpLCBjb29yZHNbMF1dXTtcbiAgICBsZXQgcHQgPSB0aGlzLmdldEludGVybWVkaWF0ZVBvaW50KFsuLi5jb29yZHNdKTtcbiAgICBpZiAoIXB0KSB7XG4gICAgICAvLyBpZiBpbnRlcm1lZGlhdGUgcG9pbnQgd2l0aCA5MCBkZWdyZWUgbm90IGF2YWlsYWJsZVxuICAgICAgLy8gdHJ5IHJlbW92ZSB0aGUgbGFzdCBjbGlja2VkIHBvaW50IGFuZCBnZXQgdGhlIGludGVybWVkaWF0ZSBwb2ludC5cbiAgICAgIGNvbnN0IHRjID0gWy4uLmNvb3Jkc107XG4gICAgICB0Yy5zcGxpY2UoLTMsIDEpO1xuICAgICAgcHQgPSB0aGlzLmdldEludGVybWVkaWF0ZVBvaW50KFsuLi50Y10pO1xuICAgICAgaWYgKHB0KSB7XG4gICAgICAgIGNvb3JkaW5hdGVzID0gW1suLi5jb29yZHMuc2xpY2UoMCwgLTMpLCBwdCwgY29vcmRzWzBdXV07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvb3JkaW5hdGVzID0gW1suLi5jb29yZHMuc2xpY2UoMCwgLTIpLCBwdCwgY29vcmRzWzBdXV07XG4gICAgfVxuICAgIHJldHVybiBjb29yZGluYXRlcztcbiAgfVxuXG4gIGdldEludGVybWVkaWF0ZVBvaW50KGNvb3JkaW5hdGVzOiBQb3NpdGlvbltdKSB7XG4gICAgbGV0IHB0O1xuICAgIGlmIChjb29yZGluYXRlcy5sZW5ndGggPiA0KSB7XG4gICAgICBjb25zdCBbcDEsIHAyXSA9IFsuLi5jb29yZGluYXRlc107XG4gICAgICBjb25zdCBhbmdsZTEgPSBiZWFyaW5nKHAxLCBwMik7XG4gICAgICBjb25zdCBwMyA9IGNvb3JkaW5hdGVzW2Nvb3JkaW5hdGVzLmxlbmd0aCAtIDNdO1xuICAgICAgY29uc3QgcDQgPSBjb29yZGluYXRlc1tjb29yZGluYXRlcy5sZW5ndGggLSA0XTtcbiAgICAgIGNvbnN0IGFuZ2xlMiA9IGJlYXJpbmcocDMsIHA0KTtcblxuICAgICAgY29uc3QgYW5nbGVzID0geyBmaXJzdDogW10sIHNlY29uZDogW10gfTtcbiAgICAgIC8vIGNhbGN1bGF0ZSAzIHJpZ2h0IGFuZ2xlIHBvaW50cyBmb3IgZmlyc3QgYW5kIGxhc3QgcG9pbnRzIGluIGxpbmVTdHJpbmdcbiAgICAgIFsxLCAyLCAzXS5mb3JFYWNoKGZhY3RvciA9PiB7XG4gICAgICAgIGNvbnN0IG5ld0FuZ2xlMSA9IGFuZ2xlMSArIGZhY3RvciAqIDkwO1xuICAgICAgICAvLyBjb252ZXJ0IGFuZ2xlcyB0byAwIHRvIC0xODAgZm9yIGFudGktY2xvY2sgYW5kIDAgdG8gMTgwIGZvciBjbG9jayB3aXNlXG4gICAgICAgIGFuZ2xlcy5maXJzdC5wdXNoKG5ld0FuZ2xlMSA+IDE4MCA/IG5ld0FuZ2xlMSAtIDM2MCA6IG5ld0FuZ2xlMSk7XG4gICAgICAgIGNvbnN0IG5ld0FuZ2xlMiA9IGFuZ2xlMiArIGZhY3RvciAqIDkwO1xuICAgICAgICBhbmdsZXMuc2Vjb25kLnB1c2gobmV3QW5nbGUyID4gMTgwID8gbmV3QW5nbGUyIC0gMzYwIDogbmV3QW5nbGUyKTtcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBkaXN0YW5jZSA9IHR1cmZEaXN0YW5jZShwb2ludChwMSksIHBvaW50KHAzKSk7XG4gICAgICAvLyBEcmF3IGltYWdpbmFyeSByaWdodCBhbmdsZSBsaW5lcyBmb3IgYm90aCBmaXJzdCBhbmQgbGFzdCBwb2ludHMgaW4gbGluZVN0cmluZ1xuICAgICAgLy8gSWYgdGhlcmUgaXMgaW50ZXJzZWN0aW9uIHBvaW50IGZvciBhbnkgMiBsaW5lcywgd2lsbCBiZSB0aGUgOTAgZGVncmVlIHBvaW50LlxuICAgICAgWzAsIDEsIDJdLmZvckVhY2goaW5kZXhGaXJzdCA9PiB7XG4gICAgICAgIGNvbnN0IGxpbmUxID0gbGluZVN0cmluZyhbXG4gICAgICAgICAgcDEsXG4gICAgICAgICAgZGVzdGluYXRpb24ocDEsIGRpc3RhbmNlLCBhbmdsZXMuZmlyc3RbaW5kZXhGaXJzdF0pLmdlb21ldHJ5LmNvb3JkaW5hdGVzXG4gICAgICAgIF0pO1xuICAgICAgICBbMCwgMSwgMl0uZm9yRWFjaChpbmRleFNlY29uZCA9PiB7XG4gICAgICAgICAgY29uc3QgbGluZTIgPSBsaW5lU3RyaW5nKFtcbiAgICAgICAgICAgIHAzLFxuICAgICAgICAgICAgZGVzdGluYXRpb24ocDMsIGRpc3RhbmNlLCBhbmdsZXMuc2Vjb25kW2luZGV4U2Vjb25kXSkuZ2VvbWV0cnkuY29vcmRpbmF0ZXNcbiAgICAgICAgICBdKTtcbiAgICAgICAgICBjb25zdCBmYyA9IGxpbmVJbnRlcnNlY3QobGluZTEsIGxpbmUyKTtcbiAgICAgICAgICBpZiAoZmMgJiYgZmMuZmVhdHVyZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAvLyBmb3VuZCB0aGUgaW50ZXJzZWN0IHBvaW50XG4gICAgICAgICAgICBwdCA9IGZjLmZlYXR1cmVzWzBdLmdlb21ldHJ5LmNvb3JkaW5hdGVzO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHB0O1xuICB9XG59XG4iXX0=