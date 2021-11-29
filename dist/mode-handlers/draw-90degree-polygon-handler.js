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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL2RyYXctOTBkZWdyZWUtcG9seWdvbi1oYW5kbGVyLmpzIl0sIm5hbWVzIjpbIkRyYXc5MERlZ3JlZVBvbHlnb25IYW5kbGVyIiwicGlja3MiLCJncm91bmRDb29yZHMiLCJoYW5kbGVzIiwidGVudGF0aXZlRmVhdHVyZSIsImdldFRlbnRhdGl2ZUZlYXR1cmUiLCJjb25jYXQiLCJnZW9tZXRyeSIsInR5cGUiLCJzbGljZSIsImNsaWNrU2VxdWVuY2UiLCJnZXRDbGlja1NlcXVlbmNlIiwicmVzdWx0IiwiZWRpdEFjdGlvbiIsImNhbmNlbE1hcFBhbiIsImxlbmd0aCIsImNvb3JkaW5hdGVzIiwicDMiLCJwMSIsInAyIiwiX3NldFRlbnRhdGl2ZUZlYXR1cmUiLCJldmVudCIsImNsaWNrZWRFZGl0SGFuZGxlIiwicG9seWdvbiIsImZlYXR1cmVJbmRleCIsInBvc2l0aW9uSW5kZXhlcyIsInBvbHlnb25Ub0FkZCIsImZpbmFsaXplZENvb3JkaW5hdGVzIiwicmVzZXRDbGlja1NlcXVlbmNlIiwiZ2V0QWRkRmVhdHVyZU9yQm9vbGVhblBvbHlnb25BY3Rpb24iLCJmYWtlUG9pbnRlck1vdmVFdmVudCIsInNjcmVlbkNvb3JkcyIsImlzRHJhZ2dpbmciLCJwb2ludGVyRG93blBpY2tzIiwicG9pbnRlckRvd25TY3JlZW5Db29yZHMiLCJwb2ludGVyRG93bkdyb3VuZENvb3JkcyIsInNvdXJjZUV2ZW50IiwiaGFuZGxlUG9pbnRlck1vdmUiLCJjb29yZHMiLCJwdCIsImdldEludGVybWVkaWF0ZVBvaW50IiwidGMiLCJzcGxpY2UiLCJhbmdsZTEiLCJwNCIsImFuZ2xlMiIsImFuZ2xlcyIsImZpcnN0Iiwic2Vjb25kIiwiZm9yRWFjaCIsImZhY3RvciIsIm5ld0FuZ2xlMSIsInB1c2giLCJuZXdBbmdsZTIiLCJkaXN0YW5jZSIsImluZGV4Rmlyc3QiLCJsaW5lMSIsImluZGV4U2Vjb25kIiwibGluZTIiLCJmYyIsImZl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WixFQUFnQnFDLFFBQWhCLEVBQTBCUixNQUFNLENBQUNFLE1BQVAsQ0FBY1MsV0FBZCxDQUExQixFQUFzRGxELFFBQXRELENBQStEUyxXQUZ4QyxDQUFYLENBQWQ7QUFJQSxnQkFBTTJDLEVBQUUsR0FBRyw0QkFBY0gsS0FBZCxFQUFxQkUsS0FBckIsQ0FBWDs7QUFDQSxnQkFBSUMsRUFBRSxJQUFJQSxFQUFFLENBQUNDLFFBQUgsQ0FBWTdDLE1BQXRCLEVBQThCO0FBQzVCO0FBQ0F3QixjQUFBQSxFQUFFLEdBQUdvQixFQUFFLENBQUNDLFFBQUgsQ0FBWSxDQUFaLEVBQWVyRCxRQUFmLENBQXdCUyxXQUE3QjtBQUNEO0FBQ0YsV0FWRDtBQVdELFNBaEJEO0FBaUJEOztBQUNELGFBQU91QixFQUFQO0FBQ0Q7Ozs7RUFsTDZDc0Isd0IiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuXG5pbXBvcnQgZGVzdGluYXRpb24gZnJvbSAnQHR1cmYvZGVzdGluYXRpb24nO1xuaW1wb3J0IGJlYXJpbmcgZnJvbSAnQHR1cmYvYmVhcmluZyc7XG5pbXBvcnQgbGluZUludGVyc2VjdCBmcm9tICdAdHVyZi9saW5lLWludGVyc2VjdCc7XG5pbXBvcnQgdHVyZkRpc3RhbmNlIGZyb20gJ0B0dXJmL2Rpc3RhbmNlJztcbmltcG9ydCB7IHBvaW50LCBsaW5lU3RyaW5nIH0gZnJvbSAnQHR1cmYvaGVscGVycyc7XG5pbXBvcnQgdHlwZSB7IFBvbHlnb24sIFBvc2l0aW9uIH0gZnJvbSAnQG5lYnVsYS5nbC9lZGl0LW1vZGVzJztcbmltcG9ydCB7IGdlbmVyYXRlUG9pbnRzUGFyYWxsZWxUb0xpbmVQb2ludHMgfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQgdHlwZSB7IENsaWNrRXZlbnQsIFBvaW50ZXJNb3ZlRXZlbnQgfSBmcm9tICcuLi9ldmVudC10eXBlcy5qcyc7XG5pbXBvcnQgdHlwZSB7IEVkaXRBY3Rpb24sIEVkaXRIYW5kbGUgfSBmcm9tICcuL21vZGUtaGFuZGxlci5qcyc7XG5pbXBvcnQgeyBNb2RlSGFuZGxlciwgZ2V0UGlja2VkRWRpdEhhbmRsZSwgZ2V0RWRpdEhhbmRsZXNGb3JHZW9tZXRyeSB9IGZyb20gJy4vbW9kZS1oYW5kbGVyLmpzJztcblxuZXhwb3J0IGNsYXNzIERyYXc5MERlZ3JlZVBvbHlnb25IYW5kbGVyIGV4dGVuZHMgTW9kZUhhbmRsZXIge1xuICBnZXRFZGl0SGFuZGxlcyhwaWNrcz86IEFycmF5PE9iamVjdD4sIGdyb3VuZENvb3Jkcz86IFBvc2l0aW9uKTogRWRpdEhhbmRsZVtdIHtcbiAgICBsZXQgaGFuZGxlcyA9IHN1cGVyLmdldEVkaXRIYW5kbGVzKHBpY2tzLCBncm91bmRDb29yZHMpO1xuXG4gICAgY29uc3QgdGVudGF0aXZlRmVhdHVyZSA9IHRoaXMuZ2V0VGVudGF0aXZlRmVhdHVyZSgpO1xuICAgIGlmICh0ZW50YXRpdmVGZWF0dXJlKSB7XG4gICAgICBoYW5kbGVzID0gaGFuZGxlcy5jb25jYXQoZ2V0RWRpdEhhbmRsZXNGb3JHZW9tZXRyeSh0ZW50YXRpdmVGZWF0dXJlLmdlb21ldHJ5LCAtMSkpO1xuICAgICAgLy8gU2xpY2Ugb2ZmIHRoZSBoYW5kbGVzIHRoYXQgYXJlIGFyZSBuZXh0IHRvIHRoZSBwb2ludGVyXG4gICAgICBpZiAodGVudGF0aXZlRmVhdHVyZSAmJiB0ZW50YXRpdmVGZWF0dXJlLmdlb21ldHJ5LnR5cGUgPT09ICdMaW5lU3RyaW5nJykge1xuICAgICAgICAvLyBSZW1vdmUgdGhlIGxhc3QgZXhpc3RpbmcgaGFuZGxlXG4gICAgICAgIGhhbmRsZXMgPSBoYW5kbGVzLnNsaWNlKDAsIC0xKTtcbiAgICAgIH0gZWxzZSBpZiAodGVudGF0aXZlRmVhdHVyZSAmJiB0ZW50YXRpdmVGZWF0dXJlLmdlb21ldHJ5LnR5cGUgPT09ICdQb2x5Z29uJykge1xuICAgICAgICAvLyBSZW1vdmUgdGhlIGxhc3QgZXhpc3RpbmcgaGFuZGxlXG4gICAgICAgIGhhbmRsZXMgPSBoYW5kbGVzLnNsaWNlKDAsIC0xKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gaGFuZGxlcztcbiAgfVxuXG4gIGhhbmRsZVBvaW50ZXJNb3ZlKHtcbiAgICBncm91bmRDb29yZHNcbiAgfTogUG9pbnRlck1vdmVFdmVudCk6IHsgZWRpdEFjdGlvbjogP0VkaXRBY3Rpb24sIGNhbmNlbE1hcFBhbjogYm9vbGVhbiB9IHtcbiAgICBjb25zdCBjbGlja1NlcXVlbmNlID0gdGhpcy5nZXRDbGlja1NlcXVlbmNlKCk7XG4gICAgY29uc3QgcmVzdWx0ID0geyBlZGl0QWN0aW9uOiBudWxsLCBjYW5jZWxNYXBQYW46IGZhbHNlIH07XG5cbiAgICBpZiAoY2xpY2tTZXF1ZW5jZS5sZW5ndGggPT09IDApIHtcbiAgICAgIC8vIG5vdGhpbmcgdG8gZG8geWV0XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGNvbnN0IHRlbnRhdGl2ZUZlYXR1cmUgPSB0aGlzLmdldFRlbnRhdGl2ZUZlYXR1cmUoKTtcbiAgICBpZiAodGVudGF0aXZlRmVhdHVyZSAmJiB0ZW50YXRpdmVGZWF0dXJlLmdlb21ldHJ5LnR5cGUgPT09ICdQb2x5Z29uJykge1xuICAgICAgY2xpY2tTZXF1ZW5jZVtjbGlja1NlcXVlbmNlLmxlbmd0aCAtIDFdID1cbiAgICAgICAgdGVudGF0aXZlRmVhdHVyZS5nZW9tZXRyeS5jb29yZGluYXRlc1swXVtjbGlja1NlcXVlbmNlLmxlbmd0aCAtIDFdO1xuICAgIH0gZWxzZSBpZiAodGVudGF0aXZlRmVhdHVyZSAmJiB0ZW50YXRpdmVGZWF0dXJlLmdlb21ldHJ5LnR5cGUgPT09ICdMaW5lU3RyaW5nJykge1xuICAgICAgY2xpY2tTZXF1ZW5jZVtjbGlja1NlcXVlbmNlLmxlbmd0aCAtIDFdID1cbiAgICAgICAgdGVudGF0aXZlRmVhdHVyZS5nZW9tZXRyeS5jb29yZGluYXRlc1tjbGlja1NlcXVlbmNlLmxlbmd0aCAtIDFdO1xuICAgIH1cblxuICAgIGxldCBwMztcbiAgICBpZiAoY2xpY2tTZXF1ZW5jZS5sZW5ndGggPT09IDEpIHtcbiAgICAgIHAzID0gZ3JvdW5kQ29vcmRzO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBwMSA9IGNsaWNrU2VxdWVuY2VbY2xpY2tTZXF1ZW5jZS5sZW5ndGggLSAyXTtcbiAgICAgIGNvbnN0IHAyID0gY2xpY2tTZXF1ZW5jZVtjbGlja1NlcXVlbmNlLmxlbmd0aCAtIDFdO1xuICAgICAgW3AzXSA9IGdlbmVyYXRlUG9pbnRzUGFyYWxsZWxUb0xpbmVQb2ludHMocDEsIHAyLCBncm91bmRDb29yZHMpO1xuICAgIH1cblxuICAgIGlmIChjbGlja1NlcXVlbmNlLmxlbmd0aCA8IDMpIHtcbiAgICAgIC8vIERyYXcgYSBMaW5lU3RyaW5nIGNvbm5lY3RpbmcgYWxsIHRoZSBjbGlja2VkIHBvaW50cyB3aXRoIHRoZSBob3ZlcmVkIHBvaW50XG4gICAgICB0aGlzLl9zZXRUZW50YXRpdmVGZWF0dXJlKHtcbiAgICAgICAgdHlwZTogJ0ZlYXR1cmUnLFxuICAgICAgICBnZW9tZXRyeToge1xuICAgICAgICAgIHR5cGU6ICdMaW5lU3RyaW5nJyxcbiAgICAgICAgICBjb29yZGluYXRlczogWy4uLmNsaWNrU2VxdWVuY2UsIHAzXVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRHJhdyBhIFBvbHlnb24gY29ubmVjdGluZyBhbGwgdGhlIGNsaWNrZWQgcG9pbnRzIHdpdGggdGhlIGhvdmVyZWQgcG9pbnRcbiAgICAgIHRoaXMuX3NldFRlbnRhdGl2ZUZlYXR1cmUoe1xuICAgICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgICAgdHlwZTogJ1BvbHlnb24nLFxuICAgICAgICAgIGNvb3JkaW5hdGVzOiBbWy4uLmNsaWNrU2VxdWVuY2UsIHAzLCBjbGlja1NlcXVlbmNlWzBdXV1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGhhbmRsZUNsaWNrKGV2ZW50OiBDbGlja0V2ZW50KTogP0VkaXRBY3Rpb24ge1xuICAgIHN1cGVyLmhhbmRsZUNsaWNrKGV2ZW50KTtcblxuICAgIGNvbnN0IHsgcGlja3MgfSA9IGV2ZW50O1xuICAgIGNvbnN0IHRlbnRhdGl2ZUZlYXR1cmUgPSB0aGlzLmdldFRlbnRhdGl2ZUZlYXR1cmUoKTtcblxuICAgIGxldCBlZGl0QWN0aW9uOiA/RWRpdEFjdGlvbiA9IG51bGw7XG4gICAgY29uc3QgY2xpY2tlZEVkaXRIYW5kbGUgPSBnZXRQaWNrZWRFZGl0SGFuZGxlKHBpY2tzKTtcblxuICAgIGlmICh0ZW50YXRpdmVGZWF0dXJlICYmIHRlbnRhdGl2ZUZlYXR1cmUuZ2VvbWV0cnkudHlwZSA9PT0gJ1BvbHlnb24nKSB7XG4gICAgICBjb25zdCBwb2x5Z29uOiBQb2x5Z29uID0gdGVudGF0aXZlRmVhdHVyZS5nZW9tZXRyeTtcblxuICAgICAgaWYgKFxuICAgICAgICBjbGlja2VkRWRpdEhhbmRsZSAmJlxuICAgICAgICBjbGlja2VkRWRpdEhhbmRsZS5mZWF0dXJlSW5kZXggPT09IC0xICYmXG4gICAgICAgIChjbGlja2VkRWRpdEhhbmRsZS5wb3NpdGlvbkluZGV4ZXNbMV0gPT09IDAgfHxcbiAgICAgICAgICBjbGlja2VkRWRpdEhhbmRsZS5wb3NpdGlvbkluZGV4ZXNbMV0gPT09IHBvbHlnb24uY29vcmRpbmF0ZXNbMF0ubGVuZ3RoIC0gMylcbiAgICAgICkge1xuICAgICAgICAvLyBUaGV5IGNsaWNrZWQgdGhlIGZpcnN0IG9yIGxhc3QgcG9pbnQgKG9yIGRvdWJsZS1jbGlja2VkKSwgc28gY29tcGxldGUgdGhlIHBvbHlnb25cbiAgICAgICAgY29uc3QgcG9seWdvblRvQWRkOiBQb2x5Z29uID0ge1xuICAgICAgICAgIHR5cGU6ICdQb2x5Z29uJyxcbiAgICAgICAgICBjb29yZGluYXRlczogdGhpcy5maW5hbGl6ZWRDb29yZGluYXRlcyhbLi4ucG9seWdvbi5jb29yZGluYXRlc1swXV0pXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5yZXNldENsaWNrU2VxdWVuY2UoKTtcbiAgICAgICAgdGhpcy5fc2V0VGVudGF0aXZlRmVhdHVyZShudWxsKTtcbiAgICAgICAgZWRpdEFjdGlvbiA9IHRoaXMuZ2V0QWRkRmVhdHVyZU9yQm9vbGVhblBvbHlnb25BY3Rpb24ocG9seWdvblRvQWRkKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUcmlnZ2VyIHBvaW50ZXIgbW92ZSByaWdodCBhd2F5IGluIG9yZGVyIGZvciBpdCB0byB1cGRhdGUgZWRpdCBoYW5kbGVzICh0byBzdXBwb3J0IGRvdWJsZS1jbGljaylcbiAgICBjb25zdCBmYWtlUG9pbnRlck1vdmVFdmVudCA9IHtcbiAgICAgIHNjcmVlbkNvb3JkczogWy0xLCAtMV0sXG4gICAgICBncm91bmRDb29yZHM6IGV2ZW50Lmdyb3VuZENvb3JkcyxcbiAgICAgIHBpY2tzOiBbXSxcbiAgICAgIGlzRHJhZ2dpbmc6IGZhbHNlLFxuICAgICAgcG9pbnRlckRvd25QaWNrczogbnVsbCxcbiAgICAgIHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzOiBudWxsLFxuICAgICAgcG9pbnRlckRvd25Hcm91bmRDb29yZHM6IG51bGwsXG4gICAgICBzb3VyY2VFdmVudDogbnVsbFxuICAgIH07XG4gICAgdGhpcy5oYW5kbGVQb2ludGVyTW92ZShmYWtlUG9pbnRlck1vdmVFdmVudCk7XG5cbiAgICByZXR1cm4gZWRpdEFjdGlvbjtcbiAgfVxuXG4gIGZpbmFsaXplZENvb3JkaW5hdGVzKGNvb3JkczogUG9zaXRpb25bXSkge1xuICAgIC8vIFJlbW92ZSB0aGUgaG92ZXJlZCBwb3NpdGlvblxuICAgIGxldCBjb29yZGluYXRlcyA9IFtbLi4uY29vcmRzLnNsaWNlKDAsIC0yKSwgY29vcmRzWzBdXV07XG4gICAgbGV0IHB0ID0gdGhpcy5nZXRJbnRlcm1lZGlhdGVQb2ludChbLi4uY29vcmRzXSk7XG4gICAgaWYgKCFwdCkge1xuICAgICAgLy8gaWYgaW50ZXJtZWRpYXRlIHBvaW50IHdpdGggOTAgZGVncmVlIG5vdCBhdmFpbGFibGVcbiAgICAgIC8vIHRyeSByZW1vdmUgdGhlIGxhc3QgY2xpY2tlZCBwb2ludCBhbmQgZ2V0IHRoZSBpbnRlcm1lZGlhdGUgcG9pbnQuXG4gICAgICBjb25zdCB0YyA9IFsuLi5jb29yZHNdO1xuICAgICAgdGMuc3BsaWNlKC0zLCAxKTtcbiAgICAgIHB0ID0gdGhpcy5nZXRJbnRlcm1lZGlhdGVQb2ludChbLi4udGNdKTtcbiAgICAgIGlmIChwdCkge1xuICAgICAgICBjb29yZGluYXRlcyA9IFtbLi4uY29vcmRzLnNsaWNlKDAsIC0zKSwgcHQsIGNvb3Jkc1swXV1dO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb29yZGluYXRlcyA9IFtbLi4uY29vcmRzLnNsaWNlKDAsIC0yKSwgcHQsIGNvb3Jkc1swXV1dO1xuICAgIH1cbiAgICByZXR1cm4gY29vcmRpbmF0ZXM7XG4gIH1cblxuICBnZXRJbnRlcm1lZGlhdGVQb2ludChjb29yZGluYXRlczogUG9zaXRpb25bXSkge1xuICAgIGxldCBwdDtcbiAgICBpZiAoY29vcmRpbmF0ZXMubGVuZ3RoID4gNCkge1xuICAgICAgY29uc3QgW3AxLCBwMl0gPSBbLi4uY29vcmRpbmF0ZXNdO1xuICAgICAgY29uc3QgYW5nbGUxID0gYmVhcmluZyhwMSwgcDIpO1xuICAgICAgY29uc3QgcDMgPSBjb29yZGluYXRlc1tjb29yZGluYXRlcy5sZW5ndGggLSAzXTtcbiAgICAgIGNvbnN0IHA0ID0gY29vcmRpbmF0ZXNbY29vcmRpbmF0ZXMubGVuZ3RoIC0gNF07XG4gICAgICBjb25zdCBhbmdsZTIgPSBiZWFyaW5nKHAzLCBwNCk7XG5cbiAgICAgIGNvbnN0IGFuZ2xlcyA9IHsgZmlyc3Q6IFtdLCBzZWNvbmQ6IFtdIH07XG4gICAgICAvLyBjYWxjdWxhdGUgMyByaWdodCBhbmdsZSBwb2ludHMgZm9yIGZpcnN0IGFuZCBsYXN0IHBvaW50cyBpbiBsaW5lU3RyaW5nXG4gICAgICBbMSwgMiwgM10uZm9yRWFjaChmYWN0b3IgPT4ge1xuICAgICAgICBjb25zdCBuZXdBbmdsZTEgPSBhbmdsZTEgKyBmYWN0b3IgKiA5MDtcbiAgICAgICAgLy8gY29udmVydCBhbmdsZXMgdG8gMCB0byAtMTgwIGZvciBhbnRpLWNsb2NrIGFuZCAwIHRvIDE4MCBmb3IgY2xvY2sgd2lzZVxuICAgICAgICBhbmdsZXMuZmlyc3QucHVzaChuZXdBbmdsZTEgPiAxODAgPyBuZXdBbmdsZTEgLSAzNjAgOiBuZXdBbmdsZTEpO1xuICAgICAgICBjb25zdCBuZXdBbmdsZTIgPSBhbmdsZTIgKyBmYWN0b3IgKiA5MDtcbiAgICAgICAgYW5nbGVzLnNlY29uZC5wdXNoKG5ld0FuZ2xlMiA+IDE4MCA/IG5ld0FuZ2xlMiAtIDM2MCA6IG5ld0FuZ2xlMik7XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgZGlzdGFuY2UgPSB0dXJmRGlzdGFuY2UocG9pbnQocDEpLCBwb2ludChwMykpO1xuICAgICAgLy8gRHJhdyBpbWFnaW5hcnkgcmlnaHQgYW5nbGUgbGluZXMgZm9yIGJvdGggZmlyc3QgYW5kIGxhc3QgcG9pbnRzIGluIGxpbmVTdHJpbmdcbiAgICAgIC8vIElmIHRoZXJlIGlzIGludGVyc2VjdGlvbiBwb2ludCBmb3IgYW55IDIgbGluZXMsIHdpbGwgYmUgdGhlIDkwIGRlZ3JlZSBwb2ludC5cbiAgICAgIFswLCAxLCAyXS5mb3JFYWNoKGluZGV4Rmlyc3QgPT4ge1xuICAgICAgICBjb25zdCBsaW5lMSA9IGxpbmVTdHJpbmcoW1xuICAgICAgICAgIHAxLFxuICAgICAgICAgIGRlc3RpbmF0aW9uKHAxLCBkaXN0YW5jZSwgYW5nbGVzLmZpcnN0W2luZGV4Rmlyc3RdKS5nZW9tZXRyeS5jb29yZGluYXRlc1xuICAgICAgICBdKTtcbiAgICAgICAgWzAsIDEsIDJdLmZvckVhY2goaW5kZXhTZWNvbmQgPT4ge1xuICAgICAgICAgIGNvbnN0IGxpbmUyID0gbGluZVN0cmluZyhbXG4gICAgICAgICAgICBwMyxcbiAgICAgICAgICAgIGRlc3RpbmF0aW9uKHAzLCBkaXN0YW5jZSwgYW5nbGVzLnNlY29uZFtpbmRleFNlY29uZF0pLmdlb21ldHJ5LmNvb3JkaW5hdGVzXG4gICAgICAgICAgXSk7XG4gICAgICAgICAgY29uc3QgZmMgPSBsaW5lSW50ZXJzZWN0KGxpbmUxLCBsaW5lMik7XG4gICAgICAgICAgaWYgKGZjICYmIGZjLmZlYXR1cmVzLmxlbmd0aCkge1xuICAgICAgICAgICAgLy8gZm91bmQgdGhlIGludGVyc2VjdCBwb2ludFxuICAgICAgICAgICAgcHQgPSBmYy5mZWF0dXJlc1swXS5nZW9tZXRyeS5jb29yZGluYXRlcztcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBwdDtcbiAgfVxufVxuIl19