"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toDeckColor = toDeckColor;
exports.recursivelyTraverseNestedArrays = recursivelyTraverseNestedArrays;
exports.generatePointsParallelToLinePoints = generatePointsParallelToLinePoints;
exports.distance2d = distance2d;
exports.mix = mix;
exports.nearestPointOnProjectedLine = nearestPointOnProjectedLine;

var _destination = _interopRequireDefault(require("@turf/destination"));

var _bearing = _interopRequireDefault(require("@turf/bearing"));

var _pointToLineDistance = _interopRequireDefault(require("@turf/point-to-line-distance"));

var _helpers = require("@turf/helpers");

var _viewportMercatorProject = _interopRequireDefault(require("viewport-mercator-project"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function toDeckColor(color) {
  var defaultColor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [255, 0, 0, 255];

  if (!Array.isArray(color)) {
    return defaultColor;
  }

  return [color[0] * 255, color[1] * 255, color[2] * 255, color[3] * 255];
} //
// a GeoJSON helper function that calls the provided function with
// an argument that is the most deeply-nested array having elements
// that are arrays of primitives as an argument, e.g.
//
// {
//   "type": "MultiPolygon",
//   "coordinates": [
//       [
//           [[30, 20], [45, 40], [10, 40], [30, 20]]
//       ],
//       [
//           [[15, 5], [40, 10], [10, 20], [5, 10], [15, 5]]
//       ]
//   ]
// }
//
// the function would be called on:
//
// [[30, 20], [45, 40], [10, 40], [30, 20]]
//
// and
//
// [[15, 5], [40, 10], [10, 20], [5, 10], [15, 5]]
//


function recursivelyTraverseNestedArrays(array, prefix, fn) {
  if (!Array.isArray(array[0])) {
    return true;
  }

  for (var i = 0; i < array.length; i++) {
    if (recursivelyTraverseNestedArrays(array[i], _toConsumableArray(prefix).concat([i]), fn)) {
      fn(array, prefix);
      break;
    }
  }

  return false;
}

function generatePointsParallelToLinePoints(p1, p2, groundCoords) {
  var lineString = {
    type: 'LineString',
    coordinates: [p1, p2]
  };
  var pt = (0, _helpers.point)(groundCoords);
  var ddistance = (0, _pointToLineDistance.default)(pt, lineString);
  var lineBearing = (0, _bearing.default)(p1, p2); // Check if current point is to the left or right of line
  // Line from A=(x1,y1) to B=(x2,y2) a point P=(x,y)
  // then (x−x1)(y2−y1)−(y−y1)(x2−x1)

  var isPointToLeftOfLine = (groundCoords[0] - p1[0]) * (p2[1] - p1[1]) - (groundCoords[1] - p1[1]) * (p2[0] - p1[0]); // Bearing to draw perpendicular to the line string

  var orthogonalBearing = isPointToLeftOfLine < 0 ? lineBearing - 90 : lineBearing - 270; // Get coordinates for the point p3 and p4 which are perpendicular to the lineString
  // Add the distance as the current position moves away from the lineString

  var p3 = (0, _destination.default)(p2, ddistance, orthogonalBearing);
  var p4 = (0, _destination.default)(p1, ddistance, orthogonalBearing);
  return [p3.geometry.coordinates, p4.geometry.coordinates];
}

function distance2d(x1, y1, x2, y2) {
  var dx = x1 - x2;
  var dy = y1 - y2;
  return Math.sqrt(dx * dx + dy * dy);
}

function mix(a, b, ratio) {
  return b * ratio + a * (1 - ratio);
}

function nearestPointOnProjectedLine(line, inPoint, viewport) {
  var wmViewport = new _viewportMercatorProject.default(viewport); // Project the line to viewport, then find the nearest point

  var coordinates = line.geometry.coordinates;
  var projectedCoords = coordinates.map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 3),
        x = _ref2[0],
        y = _ref2[1],
        _ref2$ = _ref2[2],
        z = _ref2$ === void 0 ? 0 : _ref2$;

    return wmViewport.project([x, y, z]);
  });

  var _wmViewport$project = wmViewport.project(inPoint.geometry.coordinates),
      _wmViewport$project2 = _slicedToArray(_wmViewport$project, 2),
      x = _wmViewport$project2[0],
      y = _wmViewport$project2[1]; // console.log('projectedCoords', JSON.stringify(projectedCoords));


  var minDistance = Infinity;
  var minPointInfo = {};
  projectedCoords.forEach(function (_ref3, index) {
    var _ref4 = _slicedToArray(_ref3, 2),
        x2 = _ref4[0],
        y2 = _ref4[1];

    if (index === 0) {
      return;
    }

    var _projectedCoords = _slicedToArray(projectedCoords[index - 1], 2),
        x1 = _projectedCoords[0],
        y1 = _projectedCoords[1]; // line from projectedCoords[index - 1] to projectedCoords[index]
    // convert to Ax + By + C = 0


    var A = y1 - y2;
    var B = x2 - x1;
    var C = x1 * y2 - x2 * y1; // https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line

    var div = A * A + B * B;
    var distance = Math.abs(A * x + B * y + C) / Math.sqrt(div); // TODO: Check if inside bounds

    if (distance < minDistance) {
      minDistance = distance;
      minPointInfo = {
        index: index,
        x0: (B * (B * x - A * y) - A * C) / div,
        y0: (A * (-B * x + A * y) - B * C) / div
      };
    }
  });
  var _minPointInfo = minPointInfo,
      index = _minPointInfo.index,
      x0 = _minPointInfo.x0,
      y0 = _minPointInfo.y0;

  var _projectedCoords2 = _slicedToArray(projectedCoords[index - 1], 3),
      x1 = _projectedCoords2[0],
      y1 = _projectedCoords2[1],
      _projectedCoords2$ = _projectedCoords2[2],
      z1 = _projectedCoords2$ === void 0 ? 0 : _projectedCoords2$;

  var _projectedCoords$inde = _slicedToArray(projectedCoords[index], 3),
      x2 = _projectedCoords$inde[0],
      y2 = _projectedCoords$inde[1],
      _projectedCoords$inde2 = _projectedCoords$inde[2],
      z2 = _projectedCoords$inde2 === void 0 ? 0 : _projectedCoords$inde2; // calculate what ratio of the line we are on to find the proper z


  var lineLength = distance2d(x1, y1, x2, y2);
  var startToPointLength = distance2d(x1, y1, x0, y0);
  var ratio = startToPointLength / lineLength;
  var z0 = mix(z1, z2, ratio);
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: wmViewport.unproject([x0, y0, z0])
    },
    properties: {
      // TODO: calculate the distance in proper units
      dist: minDistance,
      index: index - 1
    }
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlscy5qcyJdLCJuYW1lcyI6WyJ0b0RlY2tDb2xvciIsImNvbG9yIiwiZGVmYXVsdENvbG9yIiwiQXJyYXkiLCJpc0FycmF5IiwicmVjdXJzaXZlbHlUcmF2ZXJzZU5lc3RlZEFycmF5cyIsImFycmF5IiwicHJlZml4IiwiZm4iLCJpIiwibGVuZ3RoIiwiZ2VuZXJhdGVQb2ludHNQYXJhbGxlbFRvTGluZVBvaW50cyIsInAxIiwicDIiLCJncm91bmRDb29yZHMiLCJsaW5lU3RyaW5nIiwidHlwZSIsImNvb3JkaW5hdGVzIiwicHQiLCJkZGlzdGFuY2UiLCJsaW5lQmVhcmluZyIsImlzUG9pbnRUb0xlZnRPZkxpbmUiLCJvcnRob2dvbmFsQmVhcmluZyIsInAzIiwicDQiLCJnZW9tZXRyeSIsImRpc3RhbmNlMmQiLCJ4MSIsInkxIiwieDIiLCJ5MiIsImR4IiwiZHkiLCJNYXRoIiwic3FydCIsIm1peCIsImEiLCJiIiwicmF0aW8iLCJuZWFyZXN0UG9pbnRPblByb2plY3RlZExpbmUiLCJsaW5lIiwiaW5Qb2ludCIsInZpZXdwb3J0Iiwid21WaWV3cG9ydCIsIldlYk1lcmNhdG9yVmlld3BvcnQiLCJwcm9qZWN0ZWRDb29yZHMiLCJtYXAiLCJ4IiwieSIsInoiLCJwcm9qZWN0IiwibWluRGlzdGFuY2UiLCJJbmZpbml0eSIsIm1pblBvaW50SW5mbyIsImZvckVhY2giLCJpbmRleCIsIkEiLCJCIiwiQyIsImRpdiIsImRpc3RhbmNlIiwiYWJzIiwieDAiLCJ5MCIsInoxIiwiejIiLCJsaW5lTGVuZ3RoIiwic3RhcnRUb1BvaW50TGVuZ3RoIiwiejAiLCJ1bnByb2plY3QiLCJwcm9wZXJ0aWVzIiwiZGlzdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBU0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBTU8sU0FBU0EsV0FBVCxDQUNMQyxLQURLLEVBRzZCO0FBQUEsTUFEbENDLFlBQ2tDLHVFQURlLENB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Q0FDLE1BQUFBLElBQUksRUFBRXBCLFdBRkk7QUFHVkksTUFBQUEsS0FBSyxFQUFFQSxLQUFLLEdBQUc7QUFITDtBQU5QLEdBQVA7QUFZRCIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbmltcG9ydCBkZXN0aW5hdGlvbiBmcm9tICdAdHVyZi9kZXN0aW5hdGlvbic7XG5pbXBvcnQgYmVhcmluZyBmcm9tICdAdHVyZi9iZWFyaW5nJztcbmltcG9ydCBwb2ludFRvTGluZURpc3RhbmNlIGZyb20gJ0B0dXJmL3BvaW50LXRvLWxpbmUtZGlzdGFuY2UnO1xuaW1wb3J0IHsgcG9pbnQgfSBmcm9tICdAdHVyZi9oZWxwZXJzJztcbmltcG9ydCB0eXBlIHtcbiAgUG9zaXRpb24sXG4gIFBvaW50LFxuICBMaW5lU3RyaW5nLFxuICBGZWF0dXJlT2YsXG4gIEZlYXR1cmVXaXRoUHJvcHMsXG4gIFZpZXdwb3J0XG59IGZyb20gJ2tlcGxlci1vdXRkYXRlZC1uZWJ1bGEuZ2wtZWRpdC1tb2Rlcyc7XG5pbXBvcnQgV2ViTWVyY2F0b3JWaWV3cG9ydCBmcm9tICd2aWV3cG9ydC1tZXJjYXRvci1wcm9qZWN0JztcblxuLy8gVE9ETyBlZGl0LW1vZGVzOiBkZWxldGUgYW5kIHVzZSBlZGl0LW1vZGVzL3V0aWxzIGluc3RlYWRcblxuZXhwb3J0IHR5cGUgTmVhcmVzdFBvaW50VHlwZSA9IEZlYXR1cmVXaXRoUHJvcHM8UG9pbnQsIHsgZGlzdDogbnVtYmVyLCBpbmRleDogbnVtYmVyIH0+O1xuXG5leHBvcnQgZnVuY3Rpb24gdG9EZWNrQ29sb3IoXG4gIGNvbG9yPzogP1tudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdLFxuICBkZWZhdWx0Q29sb3I6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdID0gWzI1NSwgMCwgMCwgMjU1XVxuKTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0ge1xuICBpZiAoIUFycmF5LmlzQXJyYXkoY29sb3IpKSB7XG4gICAgcmV0dXJuIGRlZmF1bHRDb2xvcjtcbiAgfVxuICByZXR1cm4gW2NvbG9yWzBdICogMjU1LCBjb2xvclsxXSAqIDI1NSwgY29sb3JbMl0gKiAyNTUsIGNvbG9yWzNdICogMjU1XTtcbn1cblxuLy9cbi8vIGEgR2VvSlNPTiBoZWxwZXIgZnVuY3Rpb24gdGhhdCBjYWxscyB0aGUgcHJvdmlkZWQgZnVuY3Rpb24gd2l0aFxuLy8gYW4gYXJndW1lbnQgdGhhdCBpcyB0aGUgbW9zdCBkZWVwbHktbmVzdGVkIGFycmF5IGhhdmluZyBlbGVtZW50c1xuLy8gdGhhdCBhcmUgYXJyYXlzIG9mIHByaW1pdGl2ZXMgYXMgYW4gYXJndW1lbnQsIGUuZy5cbi8vXG4vLyB7XG4vLyAgIFwidHlwZVwiOiBcIk11bHRpUG9seWdvblwiLFxuLy8gICBcImNvb3JkaW5hdGVzXCI6IFtcbi8vICAgICAgIFtcbi8vICAgICAgICAgICBbWzMwLCAyMF0sIFs0NSwgNDBdLCBbMTAsIDQwXSwgWzMwLCAyMF1dXG4vLyAgICAgICBdLFxuLy8gICAgICAgW1xuLy8gICAgICAgICAgIFtbMTUsIDVdLCBbNDAsIDEwXSwgWzEwLCAyMF0sIFs1LCAxMF0sIFsxNSwgNV1dXG4vLyAgICAgICBdXG4vLyAgIF1cbi8vIH1cbi8vXG4vLyB0aGUgZnVuY3Rpb24gd291bGQgYmUgY2FsbGVkIG9uOlxuLy9cbi8vIFtbMzAsIDIwXSwgWzQ1LCA0MF0sIFsxMCwgNDBdLCBbMzAsIDIwXV1cbi8vXG4vLyBhbmRcbi8vXG4vLyBbWzE1LCA1XSwgWzQwLCAxMF0sIFsxMCwgMjBdLCBbNSwgMTBdLCBbMTUsIDVdXVxuLy9cbmV4cG9ydCBmdW5jdGlvbiByZWN1cnNpdmVseVRyYXZlcnNlTmVzdGVkQXJyYXlzKFxuICBhcnJheTogQXJyYXk8YW55PixcbiAgcHJlZml4OiBBcnJheTxudW1iZXI+LFxuICBmbjogRnVuY3Rpb25cbikge1xuICBpZiAoIUFycmF5LmlzQXJyYXkoYXJyYXlbMF0pKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChyZWN1cnNpdmVseVRyYXZlcnNlTmVzdGVkQXJyYXlzKGFycmF5W2ldLCBbLi4ucHJlZml4LCBpXSwgZm4pKSB7XG4gICAgICBmbihhcnJheSwgcHJlZml4KTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZVBvaW50c1BhcmFsbGVsVG9MaW5lUG9pbnRzKFxuICBwMTogUG9zaXRpb24sXG4gIHAyOiBQb3NpdGlvbixcbiAgZ3JvdW5kQ29vcmRzOiBQb3NpdGlvblxuKTogUG9zaXRpb25bXSB7XG4gIGNvbnN0IGxpbmVTdHJpbmc6IExpbmVTdHJpbmcgPSB7XG4gICAgdHlwZTogJ0xpbmVTdHJpbmcnLFxuICAgIGNvb3JkaW5hdGVzOiBbcDEsIHAyXVxuICB9O1xuICBjb25zdCBwdCA9IHBvaW50KGdyb3VuZENvb3Jkcyk7XG4gIGNvbnN0IGRkaXN0YW5jZSA9IHBvaW50VG9MaW5lRGlzdGFuY2UocHQsIGxpbmVTdHJpbmcpO1xuICBjb25zdCBsaW5lQmVhcmluZyA9IGJlYXJpbmcocDEsIHAyKTtcblxuICAvLyBDaGVjayBpZiBjdXJyZW50IHBvaW50IGlzIHRvIHRoZSBsZWZ0IG9yIHJpZ2h0IG9mIGxpbmVcbiAgLy8gTGluZSBmcm9tIEE9KHgxLHkxKSB0byBCPSh4Mix5MikgYSBwb2ludCBQPSh4LHkpXG4gIC8vIHRoZW4gKHjiiJJ4MSkoeTLiiJJ5MSniiJIoeeKIknkxKSh4MuKIkngxKVxuICBjb25zdCBpc1BvaW50VG9MZWZ0T2ZMaW5lID1cbiAgICAoZ3JvdW5kQ29vcmRzWzBdIC0gcDFbMF0pICogKHAyWzFdIC0gcDFbMV0pIC0gKGdyb3VuZENvb3Jkc1sxXSAtIHAxWzFdKSAqIChwMlswXSAtIHAxWzBdKTtcblxuICAvLyBCZWFyaW5nIHRvIGRyYXcgcGVycGVuZGljdWxhciB0byB0aGUgbGluZSBzdHJpbmdcbiAgY29uc3Qgb3J0aG9nb25hbEJlYXJpbmcgPSBpc1BvaW50VG9MZWZ0T2ZMaW5lIDwgMCA/IGxpbmVCZWFyaW5nIC0gOTAgOiBsaW5lQmVhcmluZyAtIDI3MDtcblxuICAvLyBHZXQgY29vcmRpbmF0ZXMgZm9yIHRoZSBwb2ludCBwMyBhbmQgcDQgd2hpY2ggYXJlIHBlcnBlbmRpY3VsYXIgdG8gdGhlIGxpbmVTdHJpbmdcbiAgLy8gQWRkIHRoZSBkaXN0YW5jZSBhcyB0aGUgY3VycmVudCBwb3NpdGlvbiBtb3ZlcyBhd2F5IGZyb20gdGhlIGxpbmVTdHJpbmdcbiAgY29uc3QgcDMgPSBkZXN0aW5hdGlvbihwMiwgZGRpc3RhbmNlLCBvcnRob2dvbmFsQmVhcmluZyk7XG4gIGNvbnN0IHA0ID0gZGVzdGluYXRpb24ocDEsIGRkaXN0YW5jZSwgb3J0aG9nb25hbEJlYXJpbmcpO1xuXG4gIHJldHVybiBbcDMuZ2VvbWV0cnkuY29vcmRpbmF0ZXMsIHA0Lmdlb21ldHJ5LmNvb3JkaW5hdGVzXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRpc3RhbmNlMmQoeDE6IG51bWJlciwgeTE6IG51bWJlciwgeDI6IG51bWJlciwgeTI6IG51bWJlcik6IG51bWJlciB7XG4gIGNvbnN0IGR4ID0geDEgLSB4MjtcbiAgY29uc3QgZHkgPSB5MSAtIHkyO1xuICByZXR1cm4gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1peChhOiBudW1iZXIsIGI6IG51bWJlciwgcmF0aW86IG51bWJlcik6IG51bWJlciB7XG4gIHJldHVybiBiICogcmF0aW8gKyBhICogKDEgLSByYXRpbyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBuZWFyZXN0UG9pbnRPblByb2plY3RlZExpbmUoXG4gIGxpbmU6IEZlYXR1cmVPZjxMaW5lU3RyaW5nPixcbiAgaW5Qb2ludDogRmVhdHVyZU9mPFBvaW50PixcbiAgdmlld3BvcnQ6IFZpZXdwb3J0XG4pOiBOZWFyZXN0UG9pbnRUeXBlIHtcbiAgY29uc3Qgd21WaWV3cG9ydCA9IG5ldyBXZWJNZXJjYXRvclZpZXdwb3J0KHZpZXdwb3J0KTtcbiAgLy8gUHJvamVjdCB0aGUgbGluZSB0byB2aWV3cG9ydCwgdGhlbiBmaW5kIHRoZSBuZWFyZXN0IHBvaW50XG4gIGNvbnN0IGNvb3JkaW5hdGVzOiBBcnJheTxBcnJheTxudW1iZXI+PiA9IChsaW5lLmdlb21ldHJ5LmNvb3JkaW5hdGVzOiBhbnkpO1xuICBjb25zdCBwcm9qZWN0ZWRDb29yZHMgPSBjb29yZGluYXRlcy5tYXAoKFt4LCB5LCB6ID0gMF0pID0+IHdtVmlld3BvcnQucHJvamVjdChbeCwgeSwgel0pKTtcbiAgY29uc3QgW3gsIHldID0gd21WaWV3cG9ydC5wcm9qZWN0KGluUG9pbnQuZ2VvbWV0cnkuY29vcmRpbmF0ZXMpO1xuICAvLyBjb25zb2xlLmxvZygncHJvamVjdGVkQ29vcmRzJywgSlNPTi5zdHJpbmdpZnkocHJvamVjdGVkQ29vcmRzKSk7XG5cbiAgbGV0IG1pbkRpc3RhbmNlID0gSW5maW5pdHk7XG4gIGxldCBtaW5Qb2ludEluZm8gPSB7fTtcblxuICBwcm9qZWN0ZWRDb29yZHMuZm9yRWFjaCgoW3gyLCB5Ml0sIGluZGV4KSA9PiB7XG4gICAgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgW3gxLCB5MV0gPSBwcm9qZWN0ZWRDb29yZHNbaW5kZXggLSAxXTtcblxuICAgIC8vIGxpbmUgZnJvbSBwcm9qZWN0ZWRDb29yZHNbaW5kZXggLSAxXSB0byBwcm9qZWN0ZWRDb29yZHNbaW5kZXhdXG4gICAgLy8gY29udmVydCB0byBBeCArIEJ5ICsgQyA9IDBcbiAgICBjb25zdCBBID0geTEgLSB5MjtcbiAgICBjb25zdCBCID0geDIgLSB4MTtcbiAgICBjb25zdCBDID0geDEgKiB5MiAtIHgyICogeTE7XG5cbiAgICAvLyBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9EaXN0YW5jZV9mcm9tX2FfcG9pbnRfdG9fYV9saW5lXG4gICAgY29uc3QgZGl2ID0gQSAqIEEgKyBCICogQjtcbiAgICBjb25zdCBkaXN0YW5jZSA9IE1hdGguYWJzKEEgKiB4ICsgQiAqIHkgKyBDKSAvIE1hdGguc3FydChkaXYpO1xuXG4gICAgLy8gVE9ETzogQ2hlY2sgaWYgaW5zaWRlIGJvdW5kc1xuXG4gICAgaWYgKGRpc3RhbmNlIDwgbWluRGlzdGFuY2UpIHtcbiAgICAgIG1pbkRpc3RhbmNlID0gZGlzdGFuY2U7XG4gICAgICBtaW5Qb2ludEluZm8gPSB7XG4gICAgICAgIGluZGV4LFxuICAgICAgICB4MDogKEIgKiAoQiAqIHggLSBBICogeSkgLSBBICogQykgLyBkaXYsXG4gICAgICAgIHkwOiAoQSAqICgtQiAqIHggKyBBICogeSkgLSBCICogQykgLyBkaXZcbiAgICAgIH07XG4gICAgfVxuICB9KTtcblxuICBjb25zdCB7IGluZGV4LCB4MCwgeTAgfSA9IG1pblBvaW50SW5mbztcbiAgY29uc3QgW3gxLCB5MSwgejEgPSAwXSA9IHByb2plY3RlZENvb3Jkc1tpbmRleCAtIDFdO1xuICBjb25zdCBbeDIsIHkyLCB6MiA9IDBdID0gcHJvamVjdGVkQ29vcmRzW2luZGV4XTtcblxuICAvLyBjYWxjdWxhdGUgd2hhdCByYXRpbyBvZiB0aGUgbGluZSB3ZSBhcmUgb24gdG8gZmluZCB0aGUgcHJvcGVyIHpcbiAgY29uc3QgbGluZUxlbmd0aCA9IGRpc3RhbmNlMmQoeDEsIHkxLCB4MiwgeTIpO1xuICBjb25zdCBzdGFydFRvUG9pbnRMZW5ndGggPSBkaXN0YW5jZTJkKHgxLCB5MSwgeDAsIHkwKTtcbiAgY29uc3QgcmF0aW8gPSBzdGFydFRvUG9pbnRMZW5ndGggLyBsaW5lTGVuZ3RoO1xuICBjb25zdCB6MCA9IG1peCh6MSwgejIsIHJhdGlvKTtcblxuICByZXR1cm4ge1xuICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICBnZW9tZXRyeToge1xuICAgICAgdHlwZTogJ1BvaW50JyxcbiAgICAgIGNvb3JkaW5hdGVzOiB3bVZpZXdwb3J0LnVucHJvamVjdChbeDAsIHkwLCB6MF0pXG4gICAgfSxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAvLyBUT0RPOiBjYWxjdWxhdGUgdGhlIGRpc3RhbmNlIGluIHByb3BlciB1bml0c1xuICAgICAgZGlzdDogbWluRGlzdGFuY2UsXG4gICAgICBpbmRleDogaW5kZXggLSAxXG4gICAgfVxuICB9O1xufVxuIl19