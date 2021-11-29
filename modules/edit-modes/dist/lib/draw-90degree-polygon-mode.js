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

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

class Draw90DegreePolygonMode extends _geojsonEditMode.BaseGeoJsonEditMode {
  getEditHandlesAdapter(picks, mapCoords, props) {
    var handles = super.getEditHandlesAdapter(picks, mapCoords, props);
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

  handlePointerMoveAdapter(_ref) {
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

  handleClickAdapter(event, props) {
    super.handleClickAdapter(event, props);
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

  finalizedCoordinates(coords) {
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

  getIntermediatePoint(coordinates) {
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

  getCursorAdapter() {
    return 'cell';
  }

}

exports.Draw90DegreePolygonMode = Draw90DegreePolygonMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvZHJhdy05MGRlZ3JlZS1wb2x5Z29uLW1vZGUuanMiXSwibmFtZXMiOlsiRHJhdzkwRGVncmVlUG9seWdvbk1vZGUiLCJCYXNlR2VvSnNvbkVkaXRNb2RlIiwiZ2V0RWRpdEhhbmRsZXNBZGFwdGVyIiwicGlja3MiLCJtYXBDb29yZHMiLCJwcm9wcyIsImhhbmRsZXMiLCJ0ZW50YXRpdmVGZWF0dXJlIiwiZ2V0VGVudGF0aXZlRmVhdHVyZSIsImNvbmNhdCIsImdlb21ldHJ5IiwidHlwZSIsInNsaWNlIiwiaGFuZGxlUG9pbnRlck1vdmVBZGFwdGVyIiwiY2xpY2tTZXF1ZW5jZSIsImdldENsaWNrU2VxdWVuY2UiLCJyZXN1bHQiLCJlZGl0QWN0aW9uIiwiY2FuY2VsTWFwUGFuIiwibGVuZ3RoIiwiY29vcmRpbmF0ZXMiLCJwMyIsInAxIiwicDIiLCJfc2V0VGVudGF0aXZlRmVhdHVyZSIsImhhbmRsZUNsaWNrQWRhcHRlciIsImV2ZW50IiwiY2xpY2tlZEVkaXRIYW5kbGUiLCJwb2x5Z29uIiwiZmVhdHVyZUluZGV4IiwicG9zaXRpb25JbmRleGVzIiwicG9seWdvblRvQWRkIiwiZmluYWxpemVkQ29vcmRpbmF0ZXMiLCJyZXNldENsaWNrU2VxdWVuY2UiLCJnZXRBZGRGZWF0dXJlT3JCb29sZWFuUG9seWdvbkFjdGlvbiIsImZha2VQb2ludGVyTW92ZUV2ZW50Iiwic2NyZWVuQ29vcmRzIiwiaXNEcmFnZ2luZyIsInBvaW50ZXJEb3duUGlja3MiLCJwb2ludGVyRG93blNjcmVlbkNvb3JkcyIsInBvaW50ZXJEb3duTWFwQ29vcmRzIiwic291cmNlRXZlbnQiLCJjb29yZHMiLCJwdCIsImdldEludGVybWVkaWF0ZVBvaW50IiwidGMiLCJzcGxpY2UiLCJhbmdsZTEiLCJwNCIsImFuZ2xlMiIsImFuZ2xlcyIsImZpcnN0Iiwic2Vjb25kIiwiZm9yRWFjaCIsImZhY3RvciIsIm5ld0FuZ2xlMSIsInB1c2giLCJuZXdBbmdsZTIiLCJkaXN0YW5jZSIsImluZGV4Rmlyc3QiLCJsaW5lMSIsImluZGV4U2Vjb25kIiwibGluZTIiLCJmYyIsImZlYXR1cmVzIiwiZ2V0Q3Vyc29yQWRhcHRlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUdBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVFPLE1BQU1BLHVCQUFOLFNBQXNDQyxvQ0FBdEMsQ0FBMEQ7QUFDL0RDLEVBQUFBLHFCQUFxQixDQUNuQkMsS0FEbUIsRUFFbkJDLFNBRm1CLEVBR25CQyxLQUhtQixFQUlMO0FBQ2QsUUFBSUMsT0FBTyxHQUFHLE1BQU1KLHFCQUFOLENBQTRCQyxLQUE1QixFQUFtQ0MsU0FBbkMsRUFBOENDLEtBQTlDLENBQWQ7QUFFQSxRQUFNRSxnQkFBZ0IsR0FBRyxLQUFLQyxtQkFBTCxFQUF6Qjs7QUFDQSxRQUFJRCxnQkFBSixFQUFzQjtBQUNwQkQsTUFBQUEsT0FBTyxHQUFHQSxPQUFPLENBQUNHLE1BQVIsQ0FBZSxnREFBMEJGLGdCQUFnQixDQUFDRyxRQUEzQyxFQUFxRCxDQUFDLENBQXRELENBQWYsQ0FBVixDQURvQixDQUVwQjs7QUFDQSxVQUFJSCxnQkFBZ0IsSUFBSUEsZ0JBQWdCLENBQUNHLFFBQWpCLENBQTBCQyxJQUExQixLQUFtQyxZQUEzRCxFQUF5RTtBQUN2RTtBQUNBTCxRQUFBQSxPQUFPLEdBQUdBLE9BQU8sQ0FBQ00sS0FBUixDQUFjLENBQWQsRUFBaUIsQ0FBQyxDQUFsQixDQUFWO0FBQ0QsT0FIRCxNQUdPLElBQUlMLGdCQUFnQixJQUFJQSxnQkFBZ0IsQ0FBQ0csUUFBakIsQ0FBMEJDLElBQTFCLEtBQW1DLFNBQTNELEVBQXNFO0FBQzNFO0FBQ0FMLFFBQUFBLE9BQU8sR0FBR0EsT0FBTyxDQUFDTSxLQUFSLENBQWMsQ0FBZCxFQUFpQixDQUFDLENBQWxCLENBQVY7QUFDRDtBQUNGOztBQUVELFdBQU9OLE9BQVA7QUFDRDs7QUFFRE8sRUFBQUEsd0JBQXdCLE9BRXdEO0FBQUEsUUFE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QUFHLHlCQUFXLENBQ3ZCdEMsRUFEdUIsRUFFdkIsMEJBQVlBLEVBQVosRUFBZ0JvQyxRQUFoQixFQUEwQlIsTUFBTSxDQUFDQyxLQUFQLENBQWFRLFVBQWIsQ0FBMUIsRUFBb0RqRCxRQUFwRCxDQUE2RFUsV0FGdEMsQ0FBWCxDQUFkO0FBSUEsU0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsRUFBVWlDLE9BQVYsQ0FBa0IsVUFBQVEsV0FBVyxFQUFJO0FBQy9CLGNBQU1DLEtBQUssR0FBRyx5QkFBVyxDQUN2QnpDLEVBRHVCLEVBRXZCLDBCQUFZQSxFQUFaLEVBQWdCcUMsUUFBaEIsRUFBMEJSLE1BQU0sQ0FBQ0UsTUFBUCxDQUFjUyxXQUFkLENBQTFCLEVBQXNEbkQsUUFBdEQsQ0FBK0RVLFdBRnhDLENBQVgsQ0FBZDtBQUlBLGNBQU0yQyxFQUFFLEdBQUcsNEJBQWNILEtBQWQsRUFBcUJFLEtBQXJCLENBQVg7O0FBQ0EsY0FBSUMsRUFBRSxJQUFJQSxFQUFFLENBQUNDLFFBQUgsQ0FBWTdDLE1BQXRCLEVBQThCO0FBQzVCO0FBQ0F3QixZQUFBQSxFQUFFLEdBQUdvQixFQUFFLENBQUNDLFFBQUgsQ0FBWSxDQUFaLEVBQWV0RCxRQUFmLENBQXdCVSxXQUE3QjtBQUNEO0FBQ0YsU0FWRDtBQVdELE9BaEJEO0FBaUJEOztBQUNELFdBQU91QixFQUFQO0FBQ0Q7O0FBRURzQixFQUFBQSxnQkFBZ0IsR0FBRztBQUNqQixXQUFPLE1BQVA7QUFDRDs7QUExTDhEIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuaW1wb3J0IGRlc3RpbmF0aW9uIGZyb20gJ0B0dXJmL2Rlc3RpbmF0aW9uJztcbmltcG9ydCBiZWFyaW5nIGZyb20gJ0B0dXJmL2JlYXJpbmcnO1xuaW1wb3J0IGxpbmVJbnRlcnNlY3QgZnJvbSAnQHR1cmYvbGluZS1pbnRlcnNlY3QnO1xuaW1wb3J0IHR1cmZEaXN0YW5jZSBmcm9tICdAdHVyZi9kaXN0YW5jZSc7XG5pbXBvcnQgeyBwb2ludCwgbGluZVN0cmluZyB9IGZyb20gJ0B0dXJmL2hlbHBlcnMnO1xuaW1wb3J0IHsgZ2VuZXJhdGVQb2ludHNQYXJhbGxlbFRvTGluZVBvaW50cyB9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCB0eXBlIHsgQ2xpY2tFdmVudCwgUG9pbnRlck1vdmVFdmVudCwgTW9kZVByb3BzIH0gZnJvbSAnLi4vdHlwZXMuanMnO1xuaW1wb3J0IHR5cGUgeyBQb2x5Z29uLCBQb3NpdGlvbiwgRmVhdHVyZUNvbGxlY3Rpb24gfSBmcm9tICcuLi9nZW9qc29uLXR5cGVzLmpzJztcbmltcG9ydCB7XG4gIEJhc2VHZW9Kc29uRWRpdE1vZGUsXG4gIGdldFBpY2tlZEVkaXRIYW5kbGUsXG4gIGdldEVkaXRIYW5kbGVzRm9yR2VvbWV0cnksXG4gIHR5cGUgR2VvSnNvbkVkaXRBY3Rpb24sXG4gIHR5cGUgRWRpdEhhbmRsZVxufSBmcm9tICcuL2dlb2pzb24tZWRpdC1tb2RlLmpzJztcblxuZXhwb3J0IGNsYXNzIERyYXc5MERlZ3JlZVBvbHlnb25Nb2RlIGV4dGVuZHMgQmFzZUdlb0pzb25FZGl0TW9kZSB7XG4gIGdldEVkaXRIYW5kbGVzQWRhcHRlcihcbiAgICBwaWNrczogP0FycmF5PE9iamVjdD4sXG4gICAgbWFwQ29vcmRzOiA/UG9zaXRpb24sXG4gICAgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj5cbiAgKTogRWRpdEhhbmRsZVtdIHtcbiAgICBsZXQgaGFuZGxlcyA9IHN1cGVyLmdldEVkaXRIYW5kbGVzQWRhcHRlcihwaWNrcywgbWFwQ29vcmRzLCBwcm9wcyk7XG5cbiAgICBjb25zdCB0ZW50YXRpdmVGZWF0dXJlID0gdGhpcy5nZXRUZW50YXRpdmVGZWF0dXJlKCk7XG4gICAgaWYgKHRlbnRhdGl2ZUZlYXR1cmUpIHtcbiAgICAgIGhhbmRsZXMgPSBoYW5kbGVzLmNvbmNhdChnZXRFZGl0SGFuZGxlc0Zvckdlb21ldHJ5KHRlbnRhdGl2ZUZlYXR1cmUuZ2VvbWV0cnksIC0xKSk7XG4gICAgICAvLyBTbGljZSBvZmYgdGhlIGhhbmRsZXMgdGhhdCBhcmUgYXJlIG5leHQgdG8gdGhlIHBvaW50ZXJcbiAgICAgIGlmICh0ZW50YXRpdmVGZWF0dXJlICYmIHRlbnRhdGl2ZUZlYXR1cmUuZ2VvbWV0cnkudHlwZSA9PT0gJ0xpbmVTdHJpbmcnKSB7XG4gICAgICAgIC8vIFJlbW92ZSB0aGUgbGFzdCBleGlzdGluZyBoYW5kbGVcbiAgICAgICAgaGFuZGxlcyA9IGhhbmRsZXMuc2xpY2UoMCwgLTEpO1xuICAgICAgfSBlbHNlIGlmICh0ZW50YXRpdmVGZWF0dXJlICYmIHRlbnRhdGl2ZUZlYXR1cmUuZ2VvbWV0cnkudHlwZSA9PT0gJ1BvbHlnb24nKSB7XG4gICAgICAgIC8vIFJlbW92ZSB0aGUgbGFzdCBleGlzdGluZyBoYW5kbGVcbiAgICAgICAgaGFuZGxlcyA9IGhhbmRsZXMuc2xpY2UoMCwgLTEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBoYW5kbGVzO1xuICB9XG5cbiAgaGFuZGxlUG9pbnRlck1vdmVBZGFwdGVyKHtcbiAgICBtYXBDb29yZHNcbiAgfTogUG9pbnRlck1vdmVFdmVudCk6IHsgZWRpdEFjdGlvbjogP0dlb0pzb25FZGl0QWN0aW9uLCBjYW5jZWxNYXBQYW46IGJvb2xlYW4gfSB7XG4gICAgY29uc3QgY2xpY2tTZXF1ZW5jZSA9IHRoaXMuZ2V0Q2xpY2tTZXF1ZW5jZSgpO1xuICAgIGNvbnN0IHJlc3VsdCA9IHsgZWRpdEFjdGlvbjogbnVsbCwgY2FuY2VsTWFwUGFuOiBmYWxzZSB9O1xuXG4gICAgaWYgKGNsaWNrU2VxdWVuY2UubGVuZ3RoID09PSAwKSB7XG4gICAgICAvLyBub3RoaW5nIHRvIGRvIHlldFxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBjb25zdCB0ZW50YXRpdmVGZWF0dXJlID0gdGhpcy5nZXRUZW50YXRpdmVGZWF0dXJlKCk7XG4gICAgaWYgKHRlbnRhdGl2ZUZlYXR1cmUgJiYgdGVudGF0aXZlRmVhdHVyZS5nZW9tZXRyeS50eXBlID09PSAnUG9seWdvbicpIHtcbiAgICAgIGNsaWNrU2VxdWVuY2VbY2xpY2tTZXF1ZW5jZS5sZW5ndGggLSAxXSA9XG4gICAgICAgIHRlbnRhdGl2ZUZlYXR1cmUuZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMF1bY2xpY2tTZXF1ZW5jZS5sZW5ndGggLSAxXTtcbiAgICB9IGVsc2UgaWYgKHRlbnRhdGl2ZUZlYXR1cmUgJiYgdGVudGF0aXZlRmVhdHVyZS5nZW9tZXRyeS50eXBlID09PSAnTGluZVN0cmluZycpIHtcbiAgICAgIGNsaWNrU2VxdWVuY2VbY2xpY2tTZXF1ZW5jZS5sZW5ndGggLSAxXSA9XG4gICAgICAgIHRlbnRhdGl2ZUZlYXR1cmUuZ2VvbWV0cnkuY29vcmRpbmF0ZXNbY2xpY2tTZXF1ZW5jZS5sZW5ndGggLSAxXTtcbiAgICB9XG5cbiAgICBsZXQgcDM7XG4gICAgaWYgKGNsaWNrU2VxdWVuY2UubGVuZ3RoID09PSAxKSB7XG4gICAgICBwMyA9IG1hcENvb3JkcztcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgcDEgPSBjbGlja1NlcXVlbmNlW2NsaWNrU2VxdWVuY2UubGVuZ3RoIC0gMl07XG4gICAgICBjb25zdCBwMiA9IGNsaWNrU2VxdWVuY2VbY2xpY2tTZXF1ZW5jZS5sZW5ndGggLSAxXTtcbiAgICAgIFtwM10gPSBnZW5lcmF0ZVBvaW50c1BhcmFsbGVsVG9MaW5lUG9pbnRzKHAxLCBwMiwgbWFwQ29vcmRzKTtcbiAgICB9XG5cbiAgICBpZiAoY2xpY2tTZXF1ZW5jZS5sZW5ndGggPCAzKSB7XG4gICAgICAvLyBEcmF3IGEgTGluZVN0cmluZyBjb25uZWN0aW5nIGFsbCB0aGUgY2xpY2tlZCBwb2ludHMgd2l0aCB0aGUgaG92ZXJlZCBwb2ludFxuICAgICAgdGhpcy5fc2V0VGVudGF0aXZlRmVhdHVyZSh7XG4gICAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgICAgZ2VvbWV0cnk6IHtcbiAgICAgICAgICB0eXBlOiAnTGluZVN0cmluZycsXG4gICAgICAgICAgY29vcmRpbmF0ZXM6IFsuLi5jbGlja1NlcXVlbmNlLCBwM11cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIERyYXcgYSBQb2x5Z29uIGNvbm5lY3RpbmcgYWxsIHRoZSBjbGlja2VkIHBvaW50cyB3aXRoIHRoZSBob3ZlcmVkIHBvaW50XG4gICAgICB0aGlzLl9zZXRUZW50YXRpdmVGZWF0dXJlKHtcbiAgICAgICAgdHlwZTogJ0ZlYXR1cmUnLFxuICAgICAgICBnZW9tZXRyeToge1xuICAgICAgICAgIHR5cGU6ICdQb2x5Z29uJyxcbiAgICAgICAgICBjb29yZGluYXRlczogW1suLi5jbGlja1NlcXVlbmNlLCBwMywgY2xpY2tTZXF1ZW5jZVswXV1dXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBoYW5kbGVDbGlja0FkYXB0ZXIoZXZlbnQ6IENsaWNrRXZlbnQsIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KTogP0dlb0pzb25FZGl0QWN0aW9uIHtcbiAgICBzdXBlci5oYW5kbGVDbGlja0FkYXB0ZXIoZXZlbnQsIHByb3BzKTtcblxuICAgIGNvbnN0IHsgcGlja3MgfSA9IGV2ZW50O1xuICAgIGNvbnN0IHRlbnRhdGl2ZUZlYXR1cmUgPSB0aGlzLmdldFRlbnRhdGl2ZUZlYXR1cmUoKTtcblxuICAgIGxldCBlZGl0QWN0aW9uOiA/R2VvSnNvbkVkaXRBY3Rpb24gPSBudWxsO1xuICAgIGNvbnN0IGNsaWNrZWRFZGl0SGFuZGxlID0gZ2V0UGlja2VkRWRpdEhhbmRsZShwaWNrcyk7XG5cbiAgICBpZiAodGVudGF0aXZlRmVhdHVyZSAmJiB0ZW50YXRpdmVGZWF0dXJlLmdlb21ldHJ5LnR5cGUgPT09ICdQb2x5Z29uJykge1xuICAgICAgY29uc3QgcG9seWdvbjogUG9seWdvbiA9IHRlbnRhdGl2ZUZlYXR1cmUuZ2VvbWV0cnk7XG5cbiAgICAgIGlmIChcbiAgICAgICAgY2xpY2tlZEVkaXRIYW5kbGUgJiZcbiAgICAgICAgY2xpY2tlZEVkaXRIYW5kbGUuZmVhdHVyZUluZGV4ID09PSAtMSAmJlxuICAgICAgICAoY2xpY2tlZEVkaXRIYW5kbGUucG9zaXRpb25JbmRleGVzWzFdID09PSAwIHx8XG4gICAgICAgICAgY2xpY2tlZEVkaXRIYW5kbGUucG9zaXRpb25JbmRleGVzWzFdID09PSBwb2x5Z29uLmNvb3JkaW5hdGVzWzBdLmxlbmd0aCAtIDMpXG4gICAgICApIHtcbiAgICAgICAgLy8gVGhleSBjbGlja2VkIHRoZSBmaXJzdCBvciBsYXN0IHBvaW50IChvciBkb3VibGUtY2xpY2tlZCksIHNvIGNvbXBsZXRlIHRoZSBwb2x5Z29uXG4gICAgICAgIGNvbnN0IHBvbHlnb25Ub0FkZDogUG9seWdvbiA9IHtcbiAgICAgICAgICB0eXBlOiAnUG9seWdvbicsXG4gICAgICAgICAgY29vcmRpbmF0ZXM6IHRoaXMuZmluYWxpemVkQ29vcmRpbmF0ZXMoWy4uLnBvbHlnb24uY29vcmRpbmF0ZXNbMF1dKVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMucmVzZXRDbGlja1NlcXVlbmNlKCk7XG4gICAgICAgIHRoaXMuX3NldFRlbnRhdGl2ZUZlYXR1cmUobnVsbCk7XG4gICAgICAgIGVkaXRBY3Rpb24gPSB0aGlzLmdldEFkZEZlYXR1cmVPckJvb2xlYW5Qb2x5Z29uQWN0aW9uKHBvbHlnb25Ub0FkZCwgcHJvcHMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRyaWdnZXIgcG9pbnRlciBtb3ZlIHJpZ2h0IGF3YXkgaW4gb3JkZXIgZm9yIGl0IHRvIHVwZGF0ZSBlZGl0IGhhbmRsZXMgKHRvIHN1cHBvcnQgZG91YmxlLWNsaWNrKVxuICAgIGNvbnN0IGZha2VQb2ludGVyTW92ZUV2ZW50ID0ge1xuICAgICAgc2NyZWVuQ29vcmRzOiBbLTEsIC0xXSxcbiAgICAgIG1hcENvb3JkczogZXZlbnQubWFwQ29vcmRzLFxuICAgICAgcGlja3M6IFtdLFxuICAgICAgaXNEcmFnZ2luZzogZmFsc2UsXG4gICAgICBwb2ludGVyRG93blBpY2tzOiBudWxsLFxuICAgICAgcG9pbnRlckRvd25TY3JlZW5Db29yZHM6IG51bGwsXG4gICAgICBwb2ludGVyRG93bk1hcENvb3JkczogbnVsbCxcbiAgICAgIHNvdXJjZUV2ZW50OiBudWxsXG4gICAgfTtcbiAgICB0aGlzLmhhbmRsZVBvaW50ZXJNb3ZlQWRhcHRlcihmYWtlUG9pbnRlck1vdmVFdmVudCk7XG5cbiAgICByZXR1cm4gZWRpdEFjdGlvbjtcbiAgfVxuXG4gIGZpbmFsaXplZENvb3JkaW5hdGVzKGNvb3JkczogUG9zaXRpb25bXSkge1xuICAgIC8vIFJlbW92ZSB0aGUgaG92ZXJlZCBwb3NpdGlvblxuICAgIGxldCBjb29yZGluYXRlcyA9IFtbLi4uY29vcmRzLnNsaWNlKDAsIC0yKSwgY29vcmRzWzBdXV07XG4gICAgbGV0IHB0ID0gdGhpcy5nZXRJbnRlcm1lZGlhdGVQb2ludChbLi4uY29vcmRzXSk7XG4gICAgaWYgKCFwdCkge1xuICAgICAgLy8gaWYgaW50ZXJtZWRpYXRlIHBvaW50IHdpdGggOTAgZGVncmVlIG5vdCBhdmFpbGFibGVcbiAgICAgIC8vIHRyeSByZW1vdmUgdGhlIGxhc3QgY2xpY2tlZCBwb2ludCBhbmQgZ2V0IHRoZSBpbnRlcm1lZGlhdGUgcG9pbnQuXG4gICAgICBjb25zdCB0YyA9IFsuLi5jb29yZHNdO1xuICAgICAgdGMuc3BsaWNlKC0zLCAxKTtcbiAgICAgIHB0ID0gdGhpcy5nZXRJbnRlcm1lZGlhdGVQb2ludChbLi4udGNdKTtcbiAgICAgIGlmIChwdCkge1xuICAgICAgICBjb29yZGluYXRlcyA9IFtbLi4uY29vcmRzLnNsaWNlKDAsIC0zKSwgcHQsIGNvb3Jkc1swXV1dO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb29yZGluYXRlcyA9IFtbLi4uY29vcmRzLnNsaWNlKDAsIC0yKSwgcHQsIGNvb3Jkc1swXV1dO1xuICAgIH1cbiAgICByZXR1cm4gY29vcmRpbmF0ZXM7XG4gIH1cblxuICBnZXRJbnRlcm1lZGlhdGVQb2ludChjb29yZGluYXRlczogUG9zaXRpb25bXSkge1xuICAgIGxldCBwdDtcbiAgICBpZiAoY29vcmRpbmF0ZXMubGVuZ3RoID4gNCkge1xuICAgICAgY29uc3QgW3AxLCBwMl0gPSBbLi4uY29vcmRpbmF0ZXNdO1xuICAgICAgY29uc3QgYW5nbGUxID0gYmVhcmluZyhwMSwgcDIpO1xuICAgICAgY29uc3QgcDMgPSBjb29yZGluYXRlc1tjb29yZGluYXRlcy5sZW5ndGggLSAzXTtcbiAgICAgIGNvbnN0IHA0ID0gY29vcmRpbmF0ZXNbY29vcmRpbmF0ZXMubGVuZ3RoIC0gNF07XG4gICAgICBjb25zdCBhbmdsZTIgPSBiZWFyaW5nKHAzLCBwNCk7XG5cbiAgICAgIGNvbnN0IGFuZ2xlcyA9IHsgZmlyc3Q6IFtdLCBzZWNvbmQ6IFtdIH07XG4gICAgICAvLyBjYWxjdWxhdGUgMyByaWdodCBhbmdsZSBwb2ludHMgZm9yIGZpcnN0IGFuZCBsYXN0IHBvaW50cyBpbiBsaW5lU3RyaW5nXG4gICAgICBbMSwgMiwgM10uZm9yRWFjaChmYWN0b3IgPT4ge1xuICAgICAgICBjb25zdCBuZXdBbmdsZTEgPSBhbmdsZTEgKyBmYWN0b3IgKiA5MDtcbiAgICAgICAgLy8gY29udmVydCBhbmdsZXMgdG8gMCB0byAtMTgwIGZvciBhbnRpLWNsb2NrIGFuZCAwIHRvIDE4MCBmb3IgY2xvY2sgd2lzZVxuICAgICAgICBhbmdsZXMuZmlyc3QucHVzaChuZXdBbmdsZTEgPiAxODAgPyBuZXdBbmdsZTEgLSAzNjAgOiBuZXdBbmdsZTEpO1xuICAgICAgICBjb25zdCBuZXdBbmdsZTIgPSBhbmdsZTIgKyBmYWN0b3IgKiA5MDtcbiAgICAgICAgYW5nbGVzLnNlY29uZC5wdXNoKG5ld0FuZ2xlMiA+IDE4MCA/IG5ld0FuZ2xlMiAtIDM2MCA6IG5ld0FuZ2xlMik7XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgZGlzdGFuY2UgPSB0dXJmRGlzdGFuY2UocG9pbnQocDEpLCBwb2ludChwMykpO1xuICAgICAgLy8gRHJhdyBpbWFnaW5hcnkgcmlnaHQgYW5nbGUgbGluZXMgZm9yIGJvdGggZmlyc3QgYW5kIGxhc3QgcG9pbnRzIGluIGxpbmVTdHJpbmdcbiAgICAgIC8vIElmIHRoZXJlIGlzIGludGVyc2VjdGlvbiBwb2ludCBmb3IgYW55IDIgbGluZXMsIHdpbGwgYmUgdGhlIDkwIGRlZ3JlZSBwb2ludC5cbiAgICAgIFswLCAxLCAyXS5mb3JFYWNoKGluZGV4Rmlyc3QgPT4ge1xuICAgICAgICBjb25zdCBsaW5lMSA9IGxpbmVTdHJpbmcoW1xuICAgICAgICAgIHAxLFxuICAgICAgICAgIGRlc3RpbmF0aW9uKHAxLCBkaXN0YW5jZSwgYW5nbGVzLmZpcnN0W2luZGV4Rmlyc3RdKS5nZW9tZXRyeS5jb29yZGluYXRlc1xuICAgICAgICBdKTtcbiAgICAgICAgWzAsIDEsIDJdLmZvckVhY2goaW5kZXhTZWNvbmQgPT4ge1xuICAgICAgICAgIGNvbnN0IGxpbmUyID0gbGluZVN0cmluZyhbXG4gICAgICAgICAgICBwMyxcbiAgICAgICAgICAgIGRlc3RpbmF0aW9uKHAzLCBkaXN0YW5jZSwgYW5nbGVzLnNlY29uZFtpbmRleFNlY29uZF0pLmdlb21ldHJ5LmNvb3JkaW5hdGVzXG4gICAgICAgICAgXSk7XG4gICAgICAgICAgY29uc3QgZmMgPSBsaW5lSW50ZXJzZWN0KGxpbmUxLCBsaW5lMik7XG4gICAgICAgICAgaWYgKGZjICYmIGZjLmZlYXR1cmVzLmxlbmd0aCkge1xuICAgICAgICAgICAgLy8gZm91bmQgdGhlIGludGVyc2VjdCBwb2ludFxuICAgICAgICAgICAgcHQgPSBmYy5mZWF0dXJlc1swXS5nZW9tZXRyeS5jb29yZGluYXRlcztcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBwdDtcbiAgfVxuXG4gIGdldEN1cnNvckFkYXB0ZXIoKSB7XG4gICAgcmV0dXJuICdjZWxsJztcbiAgfVxufVxuIl19