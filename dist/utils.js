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

var _keplerOutdatedDeck = require("kepler-outdated-deck.gl-core");

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
  // Project the line to viewport, then find the nearest point
  var coordinates = line.geometry.coordinates;
  var projectedCoords = coordinates.map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 3),
        x = _ref2[0],
        y = _ref2[1],
        _ref2$ = _ref2[2],
        z = _ref2$ === void 0 ? 0 : _ref2$;

    return viewport.project([x, y, z]);
  });

  var _viewport$project = viewport.project(inPoint.geometry.coordinates),
      _viewport$project2 = _slicedToArray(_viewport$project, 2),
      x = _viewport$project2[0],
      y = _viewport$project2[1];

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
      coordinates: viewport.unproject([x0, y0, z0])
    },
    properties: {
      // TODO: calculate the distance in proper units
      dist: minDistance,
      index: index - 1
    }
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlscy5qcyJdLCJuYW1lcyI6WyJ0b0RlY2tDb2xvciIsImNvbG9yIiwiZGVmYXVsdENvbG9yIiwiQXJyYXkiLCJpc0FycmF5IiwicmVjdXJzaXZlbHlUcmF2ZXJzZU5lc3RlZEFycmF5cyIsImFycmF5IiwicHJlZml4IiwiZm4iLCJpIiwibGVuZ3RoIiwiZ2VuZXJhdGVQb2ludHNQYXJhbGxlbFRvTGluZVBvaW50cyIsInAxIiwicDIiLCJncm91bmRDb29yZHMiLCJsaW5lU3RyaW5nIiwidHlwZSIsImNvb3JkaW5hdGVzIiwicHQiLCJkZGlzdGFuY2UiLCJsaW5lQmVhcmluZyIsImlzUG9pbnRUb0xlZnRPZkxpbmUiLCJvcnRob2dvbmFsQmVhcmluZyIsInAzIiwicDQiLCJnZW9tZXRyeSIsImRpc3RhbmNlMmQiLCJ4MSIsInkxIiwieDIiLCJ5MiIsImR4IiwiZHkiLCJNYXRoIiwic3FydCIsIm1peCIsImEiLCJiIiwicmF0aW8iLCJuZWFyZXN0UG9pbnRPblByb2plY3RlZExpbmUiLCJsaW5lIiwiaW5Qb2ludCIsInZpZXdwb3J0IiwicHJvamVjdGVkQ29vcmRzIiwibWFwIiwieCIsInkiLCJ6IiwicHJvamVjdCIsIm1pbkRpc3RhbmNlIiwiSW5maW5pdHkiLCJtaW5Qb2ludEluZm8iLCJmb3JFYWNoIiwiaW5kZXgiLCJBIiwiQiIsIkMiLCJkaXYiLCJkaXN0YW5jZSIsImFicyIsIngwIiwieTAiLCJ6MSIsInoyIiwibGluZUxlbmd0aCIsInN0YXJ0VG9Qb2ludExlbmd0aCIsInowIiwidW5wcm9qZWN0IiwicHJvcGVydGllcyIsImRpc3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQVFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUlPLFNBQVNBLFdBQVQsQ0FDTEMsS0FESyxFQUc2QjtBQUFBLE1BRGxDQyxZQUNrQyx1RUFEZSxDQUFDLEdBQUQsRUFBTSxDQUFOLEVBQVMsQ0FBVCxFQUFZLEdB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IEBmbG93XG5cbmltcG9ydCBkZXN0aW5hdGlvbiBmcm9tICdAdHVyZi9kZXN0aW5hdGlvbic7XG5pbXBvcnQgYmVhcmluZyBmcm9tICdAdHVyZi9iZWFyaW5nJztcbmltcG9ydCBwb2ludFRvTGluZURpc3RhbmNlIGZyb20gJ0B0dXJmL3BvaW50LXRvLWxpbmUtZGlzdGFuY2UnO1xuaW1wb3J0IHsgcG9pbnQgfSBmcm9tICdAdHVyZi9oZWxwZXJzJztcbmltcG9ydCB0eXBlIHtcbiAgUG9zaXRpb24sXG4gIFBvaW50LFxuICBMaW5lU3RyaW5nLFxuICBGZWF0dXJlT2YsXG4gIEZlYXR1cmVXaXRoUHJvcHNcbn0gZnJvbSAnQG5lYnVsYS5nbC9lZGl0LW1vZGVzJztcbmltcG9ydCB7IFdlYk1lcmNhdG9yVmlld3BvcnQgfSBmcm9tICdrZXBsZXItb3VkYXRlZC1kZWNrLmdsLWNvcmUnO1xuXG5leHBvcnQgdHlwZSBOZWFyZXN0UG9pbnRUeXBlID0gRmVhdHVyZVdpdGhQcm9wczxQb2ludCwgeyBkaXN0OiBudW1iZXIsIGluZGV4OiBudW1iZXIgfT47XG5cbmV4cG9ydCBmdW5jdGlvbiB0b0RlY2tDb2xvcihcbiAgY29sb3I/OiA/W251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0sXG4gIGRlZmF1bHRDb2xvcjogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbMjU1LCAwLCAwLCAyNTVdXG4pOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShjb2xvcikpIHtcbiAgICByZXR1cm4gZGVmYXVsdENvbG9yO1xuICB9XG4gIHJldHVybiBbY29sb3JbMF0gKiAyNTUsIGNvbG9yWzFdICogMjU1LCBjb2xvclsyXSAqIDI1NSwgY29sb3JbM10gKiAyNTVdO1xufVxuXG4vL1xuLy8gYSBHZW9KU09OIGhlbHBlciBmdW5jdGlvbiB0aGF0IGNhbGxzIHRoZSBwcm92aWRlZCBmdW5jdGlvbiB3aXRoXG4vLyBhbiBhcmd1bWVudCB0aGF0IGlzIHRoZSBtb3N0IGRlZXBseS1uZXN0ZWQgYXJyYXkgaGF2aW5nIGVsZW1lbnRzXG4vLyB0aGF0IGFyZSBhcnJheXMgb2YgcHJpbWl0aXZlcyBhcyBhbiBhcmd1bWVudCwgZS5nLlxuLy9cbi8vIHtcbi8vICAgXCJ0eXBlXCI6IFwiTXVsdGlQb2x5Z29uXCIsXG4vLyAgIFwiY29vcmRpbmF0ZXNcIjogW1xuLy8gICAgICAgW1xuLy8gICAgICAgICAgIFtbMzAsIDIwXSwgWzQ1LCA0MF0sIFsxMCwgNDBdLCBbMzAsIDIwXV1cbi8vICAgICAgIF0sXG4vLyAgICAgICBbXG4vLyAgICAgICAgICAgW1sxNSwgNV0sIFs0MCwgMTBdLCBbMTAsIDIwXSwgWzUsIDEwXSwgWzE1LCA1XV1cbi8vICAgICAgIF1cbi8vICAgXVxuLy8gfVxuLy9cbi8vIHRoZSBmdW5jdGlvbiB3b3VsZCBiZSBjYWxsZWQgb246XG4vL1xuLy8gW1szMCwgMjBdLCBbNDUsIDQwXSwgWzEwLCA0MF0sIFszMCwgMjBdXVxuLy9cbi8vIGFuZFxuLy9cbi8vIFtbMTUsIDVdLCBbNDAsIDEwXSwgWzEwLCAyMF0sIFs1LCAxMF0sIFsxNSwgNV1dXG4vL1xuZXhwb3J0IGZ1bmN0aW9uIHJlY3Vyc2l2ZWx5VHJhdmVyc2VOZXN0ZWRBcnJheXMoXG4gIGFycmF5OiBBcnJheTxhbnk+LFxuICBwcmVmaXg6IEFycmF5PG51bWJlcj4sXG4gIGZuOiBGdW5jdGlvblxuKSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShhcnJheVswXSkpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBmb3IgKGxldCBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHJlY3Vyc2l2ZWx5VHJhdmVyc2VOZXN0ZWRBcnJheXMoYXJyYXlbaV0sIFsuLi5wcmVmaXgsIGldLCBmbikpIHtcbiAgICAgIGZuKGFycmF5LCBwcmVmaXgpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlUG9pbnRzUGFyYWxsZWxUb0xpbmVQb2ludHMoXG4gIHAxOiBQb3NpdGlvbixcbiAgcDI6IFBvc2l0aW9uLFxuICBncm91bmRDb29yZHM6IFBvc2l0aW9uXG4pOiBQb3NpdGlvbltdIHtcbiAgY29uc3QgbGluZVN0cmluZzogTGluZVN0cmluZyA9IHtcbiAgICB0eXBlOiAnTGluZVN0cmluZycsXG4gICAgY29vcmRpbmF0ZXM6IFtwMSwgcDJdXG4gIH07XG4gIGNvbnN0IHB0ID0gcG9pbnQoZ3JvdW5kQ29vcmRzKTtcbiAgY29uc3QgZGRpc3RhbmNlID0gcG9pbnRUb0xpbmVEaXN0YW5jZShwdCwgbGluZVN0cmluZyk7XG4gIGNvbnN0IGxpbmVCZWFyaW5nID0gYmVhcmluZyhwMSwgcDIpO1xuXG4gIC8vIENoZWNrIGlmIGN1cnJlbnQgcG9pbnQgaXMgdG8gdGhlIGxlZnQgb3IgcmlnaHQgb2YgbGluZVxuICAvLyBMaW5lIGZyb20gQT0oeDEseTEpIHRvIEI9KHgyLHkyKSBhIHBvaW50IFA9KHgseSlcbiAgLy8gdGhlbiAoeOKIkngxKSh5MuKIknkxKeKIkih54oiSeTEpKHgy4oiSeDEpXG4gIGNvbnN0IGlzUG9pbnRUb0xlZnRPZkxpbmUgPVxuICAgIChncm91bmRDb29yZHNbMF0gLSBwMVswXSkgKiAocDJbMV0gLSBwMVsxXSkgLSAoZ3JvdW5kQ29vcmRzWzFdIC0gcDFbMV0pICogKHAyWzBdIC0gcDFbMF0pO1xuXG4gIC8vIEJlYXJpbmcgdG8gZHJhdyBwZXJwZW5kaWN1bGFyIHRvIHRoZSBsaW5lIHN0cmluZ1xuICBjb25zdCBvcnRob2dvbmFsQmVhcmluZyA9IGlzUG9pbnRUb0xlZnRPZkxpbmUgPCAwID8gbGluZUJlYXJpbmcgLSA5MCA6IGxpbmVCZWFyaW5nIC0gMjcwO1xuXG4gIC8vIEdldCBjb29yZGluYXRlcyBmb3IgdGhlIHBvaW50IHAzIGFuZCBwNCB3aGljaCBhcmUgcGVycGVuZGljdWxhciB0byB0aGUgbGluZVN0cmluZ1xuICAvLyBBZGQgdGhlIGRpc3RhbmNlIGFzIHRoZSBjdXJyZW50IHBvc2l0aW9uIG1vdmVzIGF3YXkgZnJvbSB0aGUgbGluZVN0cmluZ1xuICBjb25zdCBwMyA9IGRlc3RpbmF0aW9uKHAyLCBkZGlzdGFuY2UsIG9ydGhvZ29uYWxCZWFyaW5nKTtcbiAgY29uc3QgcDQgPSBkZXN0aW5hdGlvbihwMSwgZGRpc3RhbmNlLCBvcnRob2dvbmFsQmVhcmluZyk7XG5cbiAgcmV0dXJuIFtwMy5nZW9tZXRyeS5jb29yZGluYXRlcywgcDQuZ2VvbWV0cnkuY29vcmRpbmF0ZXNdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGlzdGFuY2UyZCh4MTogbnVtYmVyLCB5MTogbnVtYmVyLCB4MjogbnVtYmVyLCB5MjogbnVtYmVyKTogbnVtYmVyIHtcbiAgY29uc3QgZHggPSB4MSAtIHgyO1xuICBjb25zdCBkeSA9IHkxIC0geTI7XG4gIHJldHVybiBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWl4KGE6IG51bWJlciwgYjogbnVtYmVyLCByYXRpbzogbnVtYmVyKTogbnVtYmVyIHtcbiAgcmV0dXJuIGIgKiByYXRpbyArIGEgKiAoMSAtIHJhdGlvKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5lYXJlc3RQb2ludE9uUHJvamVjdGVkTGluZShcbiAgbGluZTogRmVhdHVyZU9mPExpbmVTdHJpbmc+LFxuICBpblBvaW50OiBGZWF0dXJlT2Y8UG9pbnQ+LFxuICB2aWV3cG9ydDogV2ViTWVyY2F0b3JWaWV3cG9ydFxuKTogTmVhcmVzdFBvaW50VHlwZSB7XG4gIC8vIFByb2plY3QgdGhlIGxpbmUgdG8gdmlld3BvcnQsIHRoZW4gZmluZCB0aGUgbmVhcmVzdCBwb2ludFxuICBjb25zdCBjb29yZGluYXRlczogQXJyYXk8QXJyYXk8bnVtYmVyPj4gPSAobGluZS5nZW9tZXRyeS5jb29yZGluYXRlczogYW55KTtcbiAgY29uc3QgcHJvamVjdGVkQ29vcmRzID0gY29vcmRpbmF0ZXMubWFwKChbeCwgeSwgeiA9IDBdKSA9PiB2aWV3cG9ydC5wcm9qZWN0KFt4LCB5LCB6XSkpO1xuICBjb25zdCBbeCwgeV0gPSB2aWV3cG9ydC5wcm9qZWN0KGluUG9pbnQuZ2VvbWV0cnkuY29vcmRpbmF0ZXMpO1xuXG4gIGxldCBtaW5EaXN0YW5jZSA9IEluZmluaXR5O1xuICBsZXQgbWluUG9pbnRJbmZvID0ge307XG5cbiAgcHJvamVjdGVkQ29vcmRzLmZvckVhY2goKFt4MiwgeTJdLCBpbmRleCkgPT4ge1xuICAgIGlmIChpbmRleCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IFt4MSwgeTFdID0gcHJvamVjdGVkQ29vcmRzW2luZGV4IC0gMV07XG5cbiAgICAvLyBsaW5lIGZyb20gcHJvamVjdGVkQ29vcmRzW2luZGV4IC0gMV0gdG8gcHJvamVjdGVkQ29vcmRzW2luZGV4XVxuICAgIC8vIGNvbnZlcnQgdG8gQXggKyBCeSArIEMgPSAwXG4gICAgY29uc3QgQSA9IHkxIC0geTI7XG4gICAgY29uc3QgQiA9IHgyIC0geDE7XG4gICAgY29uc3QgQyA9IHgxICogeTIgLSB4MiAqIHkxO1xuXG4gICAgLy8gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvRGlzdGFuY2VfZnJvbV9hX3BvaW50X3RvX2FfbGluZVxuICAgIGNvbnN0IGRpdiA9IEEgKiBBICsgQiAqIEI7XG4gICAgY29uc3QgZGlzdGFuY2UgPSBNYXRoLmFicyhBICogeCArIEIgKiB5ICsgQykgLyBNYXRoLnNxcnQoZGl2KTtcblxuICAgIC8vIFRPRE86IENoZWNrIGlmIGluc2lkZSBib3VuZHNcblxuICAgIGlmIChkaXN0YW5jZSA8IG1pbkRpc3RhbmNlKSB7XG4gICAgICBtaW5EaXN0YW5jZSA9IGRpc3RhbmNlO1xuICAgICAgbWluUG9pbnRJbmZvID0ge1xuICAgICAgICBpbmRleCxcbiAgICAgICAgeDA6IChCICogKEIgKiB4IC0gQSAqIHkpIC0gQSAqIEMpIC8gZGl2LFxuICAgICAgICB5MDogKEEgKiAoLUIgKiB4ICsgQSAqIHkpIC0gQiAqIEMpIC8gZGl2XG4gICAgICB9O1xuICAgIH1cbiAgfSk7XG5cbiAgY29uc3QgeyBpbmRleCwgeDAsIHkwIH0gPSBtaW5Qb2ludEluZm87XG4gIGNvbnN0IFt4MSwgeTEsIHoxID0gMF0gPSBwcm9qZWN0ZWRDb29yZHNbaW5kZXggLSAxXTtcbiAgY29uc3QgW3gyLCB5MiwgejIgPSAwXSA9IHByb2plY3RlZENvb3Jkc1tpbmRleF07XG5cbiAgLy8gY2FsY3VsYXRlIHdoYXQgcmF0aW8gb2YgdGhlIGxpbmUgd2UgYXJlIG9uIHRvIGZpbmQgdGhlIHByb3BlciB6XG4gIGNvbnN0IGxpbmVMZW5ndGggPSBkaXN0YW5jZTJkKHgxLCB5MSwgeDIsIHkyKTtcbiAgY29uc3Qgc3RhcnRUb1BvaW50TGVuZ3RoID0gZGlzdGFuY2UyZCh4MSwgeTEsIHgwLCB5MCk7XG4gIGNvbnN0IHJhdGlvID0gc3RhcnRUb1BvaW50TGVuZ3RoIC8gbGluZUxlbmd0aDtcbiAgY29uc3QgejAgPSBtaXgoejEsIHoyLCByYXRpbyk7XG5cbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgZ2VvbWV0cnk6IHtcbiAgICAgIHR5cGU6ICdQb2ludCcsXG4gICAgICBjb29yZGluYXRlczogdmlld3BvcnQudW5wcm9qZWN0KFt4MCwgeTAsIHowXSlcbiAgICB9LFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgIC8vIFRPRE86IGNhbGN1bGF0ZSB0aGUgZGlzdGFuY2UgaW4gcHJvcGVyIHVuaXRzXG4gICAgICBkaXN0OiBtaW5EaXN0YW5jZSxcbiAgICAgIGluZGV4OiBpbmRleCAtIDFcbiAgICB9XG4gIH07XG59XG4iXX0=
