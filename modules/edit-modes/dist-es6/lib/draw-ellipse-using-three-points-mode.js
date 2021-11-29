"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DrawEllipseUsingThreePointsMode = void 0;

var _distance = _interopRequireDefault(require("@turf/distance"));

var _ellipse = _interopRequireDefault(require("@turf/ellipse"));

var _bearing = _interopRequireDefault(require("@turf/bearing"));

var _helpers = require("@turf/helpers");

var _geojsonEditMode = require("./geojson-edit-mode.js");

var _threeClickPolygonMode = require("./three-click-polygon-mode.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

class DrawEllipseUsingThreePointsMode extends _threeClickPolygonMode.ThreeClickPolygonMode {
  handlePointerMoveAdapter(event) {
    var result = {
      editAction: null,
      cancelMapPan: false
    };
    var clickSequence = this.getClickSequence();

    if (clickSequence.length === 0) {
      // nothing to do yet
      return result;
    }

    var mapCoords = event.mapCoords;

    if (clickSequence.length === 1) {
      this._setTentativeFeature({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [clickSequence[0], mapCoords]
        }
      });
    } else if (clickSequence.length === 2) {
      var _clickSequence = _slicedToArray(clickSequence, 2),
          p1 = _clickSequence[0],
          p2 = _clickSequence[1];

      var centerCoordinates = (0, _geojsonEditMode.getIntermediatePosition)(p1, p2);
      var xSemiAxis = Math.max((0, _distance.default)(centerCoordinates, (0, _helpers.point)(mapCoords)), 0.001);
      var ySemiAxis = Math.max((0, _distance.default)(p1, p2), 0.001) / 2;
      var options = {
        angle: (0, _bearing.default)(p1, p2)
      };

      this._setTentativeFeature((0, _ellipse.default)(centerCoordinates, xSemiAxis, ySemiAxis, options));
    }

    return result;
  }

}

exports.DrawEllipseUsingThreePointsMode = DrawEllipseUsingThreePointsMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvZHJhdy1lbGxpcHNlLXVzaW5nLXRocmVlLXBvaW50cy1tb2RlLmpzIl0sIm5hbWVzIjpbIkRyYXdFbGxpcHNlVXNpbmdUaHJlZVBvaW50c01vZGUiLCJUaHJlZUNsaWNrUG9seWdvbk1vZGUiLCJoYW5kbGVQb2ludGVyTW92ZUFkYXB0ZXIiLCJldmVudCIsInJlc3VsdCIsImVkaXRBY3Rpb24iLCJjYW5jZWxNYXBQYW4iLCJjbGlja1NlcXVlbmNlIiwiZ2V0Q2xpY2tTZXF1ZW5jZSIsImxlbmd0aCIsIm1hcENvb3JkcyIsIl9zZXRUZW50YXRpdmVGZWF0dXJlIiwidHlwZSIsImdlb21ldHJ5IiwiY29vcmRpbmF0ZXMiLCJwMSIsInAyIiwiY2VudGVyQ29vcmRpbmF0ZXMiLCJ4U2VtaUF4aXMiLCJNYXRoIiwibWF4IiwieVNlbWlBeGlzIiwib3B0aW9ucyIsImFuZ2xlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVPLE1BQU1BLCtCQUFOLFNBQThDQyw0Q0FBOUMsQ0FBb0U7QUFDekVDLEVBQUFBLHdCQUF3QixDQUN0QkMsS0FEc0IsRUFFcUM7QUFDM0QsUUFBTUMsTUFBTSxHQUFHO0FBQUVDLE1BQUFBLFVBQVUsRUFBRSxJQUFkO0FBQW9CQyxNQUFBQSxZQUFZLEVBQUU7QUFBbEMsS0FBZjtBQUNBLFFBQU1DLGFBQWEsR0FBRyxLQUFLQyxnQkFBTCxFQUF0Qjs7QUFFQSxRQUFJRCxhQUFhLENBQUNFLE1BQWQsS0FBeUIsQ0FBN0IsRUFBZ0M7QUFDOUI7QUFDQSxhQUFPTCxNQUFQO0FBQ0Q7O0FBRUQsUUFBTU0sU0FBUyxHQUFHUCxLQUFLLENBQUNPLFNBQXhCOztBQUVBLFFBQUlILGFBQWEsQ0FBQ0UsTUFBZCxLQUF5QixDQUE3QixFQUFnQztBQUM5QixXQUFLRSxvQkFBTCxDQUEwQjtBQUN4QkMsUUFBQUEsSUFBSSxFQUFFLFNBRGtCO0FBRXhCQyxRQUFBQSxRQUFRLEVBQUU7QUFDUkQsVUFBQUEsSUFBSSxFQUFFLFlBREU7QUFFUkUsVUFBQUEsV0FBVyxFQUFFLENBQUNQLGFBQWEsQ0FBQyxDQUFELENBQWQsRUFBbUJHLFNBQW5CO0FBRkw7QUFGYyxPQUExQjtBQU9ELEtBUkQsTUFRTyxJQUFJSCxhQUFhLENBQUNFLE1BQWQsS0FBeUIsQ0FBN0IsRUFBZ0M7QUFBQSwwQ0FDcEJGLGFBRG9CO0FBQUEsVUFDOUJRLEVBRDhCO0FBQUEsVUFDMUJDLEVBRDBCOztBQUdyQyxVQUFNQyxpQkFBaUIsR0FBRyw4Q0FBd0JGLEVBQXhCLEVBQTRCQyxFQUE1QixDQUExQjtBQUNBLFVBQU1FLFNBQVMsR0FBR0MsSUFBSSxDQUFDQyxHQUFMLENBQVMsdUJBQVNILGlCQUFULEVBQTRCLG9CQUFNUCxTQUFOLENBQTVCLENBQVQsRUFBd0QsS0FBeEQsQ0FBbEI7QUFDQSxVQUFNVyxTQUFTLEdBQUdGLElBQUksQ0FBQ0MsR0FBTCxDQUFTLHVCQUFTTCxFQUFULEVBQWFDLEVBQWIsQ0FBVCxFQUEyQixLQUEzQixJQUFvQyxDQUF0RDtBQUNBLFVBQU1NLE9BQU8sR0FBRztBQUFFQyxRQUFBQSxLQUFLLEVBQUUsc0JBQVFSLEVBQVIsRUFBWUMsRUFBWjtBQUFULE9BQWhCOztBQUVBLFdBQUtMLG9CQUFMLENBQTBCLHNCQUFRTSxpQkFBUixFQUEyQkMsU0FBM0IsRUFBc0NHLFNBQXRDLEVBQWlEQyxPQUFqRCxDQUExQjtBQUNEOztBQUVELFdBQU9sQixNQUFQO0FBQ0Q7O0FBbEN3RSIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbmltcG9ydCBkaXN0YW5jZSBmcm9tICdAdHVyZi9kaXN0YW5jZSc7XG5pbXBvcnQgZWxsaXBzZSBmcm9tICdAdHVyZi9lbGxpcHNlJztcbmltcG9ydCBiZWFyaW5nIGZyb20gJ0B0dXJmL2JlYXJpbmcnO1xuaW1wb3J0IHsgcG9pbnQgfSBmcm9tICdAdHVyZi9oZWxwZXJzJztcbmltcG9ydCB0eXBlIHsgUG9pbnRlck1vdmVFdmVudCB9IGZyb20gJy4uL3R5cGVzLmpzJztcbmltcG9ydCB7IGdldEludGVybWVkaWF0ZVBvc2l0aW9uLCB0eXBlIEdlb0pzb25FZGl0QWN0aW9uIH0gZnJvbSAnLi9nZW9qc29uLWVkaXQtbW9kZS5qcyc7XG5pbXBvcnQgeyBUaHJlZUNsaWNrUG9seWdvbk1vZGUgfSBmcm9tICcuL3RocmVlLWNsaWNrLXBvbHlnb24tbW9kZS5qcyc7XG5cbmV4cG9ydCBjbGFzcyBEcmF3RWxsaXBzZVVzaW5nVGhyZWVQb2ludHNNb2RlIGV4dGVuZHMgVGhyZWVDbGlja1BvbHlnb25Nb2RlIHtcbiAgaGFuZGxlUG9pbnRlck1vdmVBZGFwdGVyKFxuICAgIGV2ZW50OiBQb2ludGVyTW92ZUV2ZW50XG4gICk6IHsgZWRpdEFjdGlvbjogP0dlb0pzb25FZGl0QWN0aW9uLCBjYW5jZWxNYXBQYW46IGJvb2xlYW4gfSB7XG4gICAgY29uc3QgcmVzdWx0ID0geyBlZGl0QWN0aW9uOiBudWxsLCBjYW5jZWxNYXBQYW46IGZhbHNlIH07XG4gICAgY29uc3QgY2xpY2tTZXF1ZW5jZSA9IHRoaXMuZ2V0Q2xpY2tTZXF1ZW5jZSgpO1xuXG4gICAgaWYgKGNsaWNrU2VxdWVuY2UubGVuZ3RoID09PSAwKSB7XG4gICAgICAvLyBub3RoaW5nIHRvIGRvIHlldFxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBjb25zdCBtYXBDb29yZHMgPSBldmVudC5tYXBDb29yZHM7XG5cbiAgICBpZiAoY2xpY2tTZXF1ZW5jZS5sZW5ndGggPT09IDEpIHtcbiAgICAgIHRoaXMuX3NldFRlbnRhdGl2ZUZlYXR1cmUoe1xuICAgICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgICAgdHlwZTogJ0xpbmVTdHJpbmcnLFxuICAgICAgICAgIGNvb3JkaW5hdGVzOiBbY2xpY2tTZXF1ZW5jZVswXSwgbWFwQ29vcmRzXVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKGNsaWNrU2VxdWVuY2UubGVuZ3RoID09PSAyKSB7XG4gICAgICBjb25zdCBbcDEsIHAyXSA9IGNsaWNrU2VxdWVuY2U7XG5cbiAgICAgIGNvbnN0IGNlbnRlckNvb3JkaW5hdGVzID0gZ2V0SW50ZXJtZWRpYXRlUG9zaXRpb24ocDEsIHAyKTtcbiAgICAgIGNvbnN0IHhTZW1pQXhpcyA9IE1hdGgubWF4KGRpc3RhbmNlKGNlbnRlckNvb3JkaW5hdGVzLCBwb2ludChtYXBDb29yZHMpKSwgMC4wMDEpO1xuICAgICAgY29uc3QgeVNlbWlBeGlzID0gTWF0aC5tYXgoZGlzdGFuY2UocDEsIHAyKSwgMC4wMDEpIC8gMjtcbiAgICAgIGNvbnN0IG9wdGlvbnMgPSB7IGFuZ2xlOiBiZWFyaW5nKHAxLCBwMikgfTtcblxuICAgICAgdGhpcy5fc2V0VGVudGF0aXZlRmVhdHVyZShlbGxpcHNlKGNlbnRlckNvb3JkaW5hdGVzLCB4U2VtaUF4aXMsIHlTZW1pQXhpcywgb3B0aW9ucykpO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cbiJdfQ==