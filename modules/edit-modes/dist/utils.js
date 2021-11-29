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

function generatePointsParallelToLinePoints(p1, p2, mapCoords) {
  var lineString = {
    type: 'LineString',
    coordinates: [p1, p2]
  };
  var pt = (0, _helpers.point)(mapCoords);
  var ddistance = (0, _pointToLineDistance.default)(pt, lineString);
  var lineBearing = (0, _bearing.default)(p1, p2); // Check if current point is to the left or right of line
  // Line from A=(x1,y1) to B=(x2,y2) a point P=(x,y)
  // then (x−x1)(y2−y1)−(y−y1)(x2−x1)

  var isPointToLeftOfLine = (mapCoords[0] - p1[0]) * (p2[1] - p1[1]) - (mapCoords[1] - p1[1]) * (p2[0] - p1[0]); // Bearing to draw perpendicular to the line string

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlscy5qcyJdLCJuYW1lcyI6WyJ0b0RlY2tDb2xvciIsImNvbG9yIiwiZGVmYXVsdENvbG9yIiwiQXJyYXkiLCJpc0FycmF5IiwicmVjdXJzaXZlbHlUcmF2ZXJzZU5lc3RlZEFycmF5cyIsImFycmF5IiwicHJlZml4IiwiZm4iLCJpIiwibGVuZ3RoIiwiZ2VuZXJhdGVQb2ludHNQYXJhbGxlbFRvTGluZVBvaW50cyIsInAxIiwicDIiLCJtYXBDb29yZHMiLCJsaW5lU3RyaW5nIiwidHlwZSIsImNvb3JkaW5hdGVzIiwicHQiLCJkZGlzdGFuY2UiLCJsaW5lQmVhcmluZyIsImlzUG9pbnRUb0xlZnRPZkxpbmUiLCJvcnRob2dvbmFsQmVhcmluZyIsInAzIiwicDQiLCJnZW9tZXRyeSIsImRpc3RhbmNlMmQiLCJ4MSIsInkxIiwieDIiLCJ5MiIsImR4IiwiZHkiLCJNYXRoIiwic3FydCIsIm1peCIsImEiLCJiIiwicmF0aW8iLCJuZWFyZXN0UG9pbnRPblByb2plY3RlZExpbmUiLCJsaW5lIiwiaW5Qb2ludCIsInZpZXdwb3J0Iiwid21WaWV3cG9ydCIsIldlYk1lcmNhdG9yVmlld3BvcnQiLCJwcm9qZWN0ZWRDb29yZHMiLCJtYXAiLCJ4IiwieSIsInoiLCJwcm9qZWN0IiwibWluRGlzdGFuY2UiLCJJbmZpbml0eSIsIm1pblBvaW50SW5mbyIsImZvckVhY2giLCJpbmRleCIsIkEiLCJCIiwiQyIsImRpdiIsImRpc3RhbmNlIiwiYWJzIiwieDAiLCJ5MCIsInoxIiwiejIiLCJsaW5lTGVuZ3RoIiwic3RhcnRUb1BvaW50TGVuZ3RoIiwiejAiLCJ1bnByb2plY3QiLCJwcm9wZXJ0aWVzIiwiZGlzdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBTU8sU0FBU0EsV0FBVCxDQUNMQyxLQURLLEVBRzZCO0FBQUEsTUFEbENDLFlBQ2tDLHVFQURlLENBQUMs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QUFBQSxJQUFJLEVBQUVwQixXQUZJO0FBR1ZJLE1BQUFBLEtBQUssRUFBRUEsS0FBSyxHQUFHO0FBSEw7QUFOUCxHQUFQO0FBWUQiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuXG5pbXBvcnQgZGVzdGluYXRpb24gZnJvbSAnQHR1cmYvZGVzdGluYXRpb24nO1xuaW1wb3J0IGJlYXJpbmcgZnJvbSAnQHR1cmYvYmVhcmluZyc7XG5pbXBvcnQgcG9pbnRUb0xpbmVEaXN0YW5jZSBmcm9tICdAdHVyZi9wb2ludC10by1saW5lLWRpc3RhbmNlJztcbmltcG9ydCB7IHBvaW50IH0gZnJvbSAnQHR1cmYvaGVscGVycyc7XG5pbXBvcnQgV2ViTWVyY2F0b3JWaWV3cG9ydCBmcm9tICd2aWV3cG9ydC1tZXJjYXRvci1wcm9qZWN0JztcbmltcG9ydCB0eXBlIHsgVmlld3BvcnQgfSBmcm9tICcuL3R5cGVzLmpzJztcbmltcG9ydCB0eXBlIHsgUG9zaXRpb24sIFBvaW50LCBMaW5lU3RyaW5nLCBGZWF0dXJlT2YsIEZlYXR1cmVXaXRoUHJvcHMgfSBmcm9tICcuL2dlb2pzb24tdHlwZXMuanMnO1xuXG5leHBvcnQgdHlwZSBOZWFyZXN0UG9pbnRUeXBlID0gRmVhdHVyZVdpdGhQcm9wczxQb2ludCwgeyBkaXN0OiBudW1iZXIsIGluZGV4OiBudW1iZXIgfT47XG5cbmV4cG9ydCBmdW5jdGlvbiB0b0RlY2tDb2xvcihcbiAgY29sb3I/OiA/W251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0sXG4gIGRlZmF1bHRDb2xvcjogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbMjU1LCAwLCAwLCAyNTVdXG4pOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShjb2xvcikpIHtcbiAgICByZXR1cm4gZGVmYXVsdENvbG9yO1xuICB9XG4gIHJldHVybiBbY29sb3JbMF0gKiAyNTUsIGNvbG9yWzFdICogMjU1LCBjb2xvclsyXSAqIDI1NSwgY29sb3JbM10gKiAyNTVdO1xufVxuXG4vL1xuLy8gYSBHZW9KU09OIGhlbHBlciBmdW5jdGlvbiB0aGF0IGNhbGxzIHRoZSBwcm92aWRlZCBmdW5jdGlvbiB3aXRoXG4vLyBhbiBhcmd1bWVudCB0aGF0IGlzIHRoZSBtb3N0IGRlZXBseS1uZXN0ZWQgYXJyYXkgaGF2aW5nIGVsZW1lbnRzXG4vLyB0aGF0IGFyZSBhcnJheXMgb2YgcHJpbWl0aXZlcyBhcyBhbiBhcmd1bWVudCwgZS5nLlxuLy9cbi8vIHtcbi8vICAgXCJ0eXBlXCI6IFwiTXVsdGlQb2x5Z29uXCIsXG4vLyAgIFwiY29vcmRpbmF0ZXNcIjogW1xuLy8gICAgICAgW1xuLy8gICAgICAgICAgIFtbMzAsIDIwXSwgWzQ1LCA0MF0sIFsxMCwgNDBdLCBbMzAsIDIwXV1cbi8vICAgICAgIF0sXG4vLyAgICAgICBbXG4vLyAgICAgICAgICAgW1sxNSwgNV0sIFs0MCwgMTBdLCBbMTAsIDIwXSwgWzUsIDEwXSwgWzE1LCA1XV1cbi8vICAgICAgIF1cbi8vICAgXVxuLy8gfVxuLy9cbi8vIHRoZSBmdW5jdGlvbiB3b3VsZCBiZSBjYWxsZWQgb246XG4vL1xuLy8gW1szMCwgMjBdLCBbNDUsIDQwXSwgWzEwLCA0MF0sIFszMCwgMjBdXVxuLy9cbi8vIGFuZFxuLy9cbi8vIFtbMTUsIDVdLCBbNDAsIDEwXSwgWzEwLCAyMF0sIFs1LCAxMF0sIFsxNSwgNV1dXG4vL1xuZXhwb3J0IGZ1bmN0aW9uIHJlY3Vyc2l2ZWx5VHJhdmVyc2VOZXN0ZWRBcnJheXMoXG4gIGFycmF5OiBBcnJheTxhbnk+LFxuICBwcmVmaXg6IEFycmF5PG51bWJlcj4sXG4gIGZuOiBGdW5jdGlvblxuKSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShhcnJheVswXSkpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBmb3IgKGxldCBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHJlY3Vyc2l2ZWx5VHJhdmVyc2VOZXN0ZWRBcnJheXMoYXJyYXlbaV0sIFsuLi5wcmVmaXgsIGldLCBmbikpIHtcbiAgICAgIGZuKGFycmF5LCBwcmVmaXgpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlUG9pbnRzUGFyYWxsZWxUb0xpbmVQb2ludHMoXG4gIHAxOiBQb3NpdGlvbixcbiAgcDI6IFBvc2l0aW9uLFxuICBtYXBDb29yZHM6IFBvc2l0aW9uXG4pOiBQb3NpdGlvbltdIHtcbiAgY29uc3QgbGluZVN0cmluZzogTGluZVN0cmluZyA9IHtcbiAgICB0eXBlOiAnTGluZVN0cmluZycsXG4gICAgY29vcmRpbmF0ZXM6IFtwMSwgcDJdXG4gIH07XG4gIGNvbnN0IHB0ID0gcG9pbnQobWFwQ29vcmRzKTtcbiAgY29uc3QgZGRpc3RhbmNlID0gcG9pbnRUb0xpbmVEaXN0YW5jZShwdCwgbGluZVN0cmluZyk7XG4gIGNvbnN0IGxpbmVCZWFyaW5nID0gYmVhcmluZyhwMSwgcDIpO1xuXG4gIC8vIENoZWNrIGlmIGN1cnJlbnQgcG9pbnQgaXMgdG8gdGhlIGxlZnQgb3IgcmlnaHQgb2YgbGluZVxuICAvLyBMaW5lIGZyb20gQT0oeDEseTEpIHRvIEI9KHgyLHkyKSBhIHBvaW50IFA9KHgseSlcbiAgLy8gdGhlbiAoeOKIkngxKSh5MuKIknkxKeKIkih54oiSeTEpKHgy4oiSeDEpXG4gIGNvbnN0IGlzUG9pbnRUb0xlZnRPZkxpbmUgPVxuICAgIChtYXBDb29yZHNbMF0gLSBwMVswXSkgKiAocDJbMV0gLSBwMVsxXSkgLSAobWFwQ29vcmRzWzFdIC0gcDFbMV0pICogKHAyWzBdIC0gcDFbMF0pO1xuXG4gIC8vIEJlYXJpbmcgdG8gZHJhdyBwZXJwZW5kaWN1bGFyIHRvIHRoZSBsaW5lIHN0cmluZ1xuICBjb25zdCBvcnRob2dvbmFsQmVhcmluZyA9IGlzUG9pbnRUb0xlZnRPZkxpbmUgPCAwID8gbGluZUJlYXJpbmcgLSA5MCA6IGxpbmVCZWFyaW5nIC0gMjcwO1xuXG4gIC8vIEdldCBjb29yZGluYXRlcyBmb3IgdGhlIHBvaW50IHAzIGFuZCBwNCB3aGljaCBhcmUgcGVycGVuZGljdWxhciB0byB0aGUgbGluZVN0cmluZ1xuICAvLyBBZGQgdGhlIGRpc3RhbmNlIGFzIHRoZSBjdXJyZW50IHBvc2l0aW9uIG1vdmVzIGF3YXkgZnJvbSB0aGUgbGluZVN0cmluZ1xuICBjb25zdCBwMyA9IGRlc3RpbmF0aW9uKHAyLCBkZGlzdGFuY2UsIG9ydGhvZ29uYWxCZWFyaW5nKTtcbiAgY29uc3QgcDQgPSBkZXN0aW5hdGlvbihwMSwgZGRpc3RhbmNlLCBvcnRob2dvbmFsQmVhcmluZyk7XG5cbiAgcmV0dXJuIFtwMy5nZW9tZXRyeS5jb29yZGluYXRlcywgcDQuZ2VvbWV0cnkuY29vcmRpbmF0ZXNdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGlzdGFuY2UyZCh4MTogbnVtYmVyLCB5MTogbnVtYmVyLCB4MjogbnVtYmVyLCB5MjogbnVtYmVyKTogbnVtYmVyIHtcbiAgY29uc3QgZHggPSB4MSAtIHgyO1xuICBjb25zdCBkeSA9IHkxIC0geTI7XG4gIHJldHVybiBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWl4KGE6IG51bWJlciwgYjogbnVtYmVyLCByYXRpbzogbnVtYmVyKTogbnVtYmVyIHtcbiAgcmV0dXJuIGIgKiByYXRpbyArIGEgKiAoMSAtIHJhdGlvKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5lYXJlc3RQb2ludE9uUHJvamVjdGVkTGluZShcbiAgbGluZTogRmVhdHVyZU9mPExpbmVTdHJpbmc+LFxuICBpblBvaW50OiBGZWF0dXJlT2Y8UG9pbnQ+LFxuICB2aWV3cG9ydDogVmlld3BvcnRcbik6IE5lYXJlc3RQb2ludFR5cGUge1xuICBjb25zdCB3bVZpZXdwb3J0ID0gbmV3IFdlYk1lcmNhdG9yVmlld3BvcnQodmlld3BvcnQpO1xuICAvLyBQcm9qZWN0IHRoZSBsaW5lIHRvIHZpZXdwb3J0LCB0aGVuIGZpbmQgdGhlIG5lYXJlc3QgcG9pbnRcbiAgY29uc3QgY29vcmRpbmF0ZXM6IEFycmF5PEFycmF5PG51bWJlcj4+ID0gKGxpbmUuZ2VvbWV0cnkuY29vcmRpbmF0ZXM6IGFueSk7XG4gIGNvbnN0IHByb2plY3RlZENvb3JkcyA9IGNvb3JkaW5hdGVzLm1hcCgoW3gsIHksIHogPSAwXSkgPT4gd21WaWV3cG9ydC5wcm9qZWN0KFt4LCB5LCB6XSkpO1xuICBjb25zdCBbeCwgeV0gPSB3bVZpZXdwb3J0LnByb2plY3QoaW5Qb2ludC5nZW9tZXRyeS5jb29yZGluYXRlcyk7XG4gIC8vIGNvbnNvbGUubG9nKCdwcm9qZWN0ZWRDb29yZHMnLCBKU09OLnN0cmluZ2lmeShwcm9qZWN0ZWRDb29yZHMpKTtcblxuICBsZXQgbWluRGlzdGFuY2UgPSBJbmZpbml0eTtcbiAgbGV0IG1pblBvaW50SW5mbyA9IHt9O1xuXG4gIHByb2plY3RlZENvb3Jkcy5mb3JFYWNoKChbeDIsIHkyXSwgaW5kZXgpID0+IHtcbiAgICBpZiAoaW5kZXggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBbeDEsIHkxXSA9IHByb2plY3RlZENvb3Jkc1tpbmRleCAtIDFdO1xuXG4gICAgLy8gbGluZSBmcm9tIHByb2plY3RlZENvb3Jkc1tpbmRleCAtIDFdIHRvIHByb2plY3RlZENvb3Jkc1tpbmRleF1cbiAgICAvLyBjb252ZXJ0IHRvIEF4ICsgQnkgKyBDID0gMFxuICAgIGNvbnN0IEEgPSB5MSAtIHkyO1xuICAgIGNvbnN0IEIgPSB4MiAtIHgxO1xuICAgIGNvbnN0IEMgPSB4MSAqIHkyIC0geDIgKiB5MTtcblxuICAgIC8vIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0Rpc3RhbmNlX2Zyb21fYV9wb2ludF90b19hX2xpbmVcbiAgICBjb25zdCBkaXYgPSBBICogQSArIEIgKiBCO1xuICAgIGNvbnN0IGRpc3RhbmNlID0gTWF0aC5hYnMoQSAqIHggKyBCICogeSArIEMpIC8gTWF0aC5zcXJ0KGRpdik7XG5cbiAgICAvLyBUT0RPOiBDaGVjayBpZiBpbnNpZGUgYm91bmRzXG5cbiAgICBpZiAoZGlzdGFuY2UgPCBtaW5EaXN0YW5jZSkge1xuICAgICAgbWluRGlzdGFuY2UgPSBkaXN0YW5jZTtcbiAgICAgIG1pblBvaW50SW5mbyA9IHtcbiAgICAgICAgaW5kZXgsXG4gICAgICAgIHgwOiAoQiAqIChCICogeCAtIEEgKiB5KSAtIEEgKiBDKSAvIGRpdixcbiAgICAgICAgeTA6IChBICogKC1CICogeCArIEEgKiB5KSAtIEIgKiBDKSAvIGRpdlxuICAgICAgfTtcbiAgICB9XG4gIH0pO1xuXG4gIGNvbnN0IHsgaW5kZXgsIHgwLCB5MCB9ID0gbWluUG9pbnRJbmZvO1xuICBjb25zdCBbeDEsIHkxLCB6MSA9IDBdID0gcHJvamVjdGVkQ29vcmRzW2luZGV4IC0gMV07XG4gIGNvbnN0IFt4MiwgeTIsIHoyID0gMF0gPSBwcm9qZWN0ZWRDb29yZHNbaW5kZXhdO1xuXG4gIC8vIGNhbGN1bGF0ZSB3aGF0IHJhdGlvIG9mIHRoZSBsaW5lIHdlIGFyZSBvbiB0byBmaW5kIHRoZSBwcm9wZXIgelxuICBjb25zdCBsaW5lTGVuZ3RoID0gZGlzdGFuY2UyZCh4MSwgeTEsIHgyLCB5Mik7XG4gIGNvbnN0IHN0YXJ0VG9Qb2ludExlbmd0aCA9IGRpc3RhbmNlMmQoeDEsIHkxLCB4MCwgeTApO1xuICBjb25zdCByYXRpbyA9IHN0YXJ0VG9Qb2ludExlbmd0aCAvIGxpbmVMZW5ndGg7XG4gIGNvbnN0IHowID0gbWl4KHoxLCB6MiwgcmF0aW8pO1xuXG4gIHJldHVybiB7XG4gICAgdHlwZTogJ0ZlYXR1cmUnLFxuICAgIGdlb21ldHJ5OiB7XG4gICAgICB0eXBlOiAnUG9pbnQnLFxuICAgICAgY29vcmRpbmF0ZXM6IHdtVmlld3BvcnQudW5wcm9qZWN0KFt4MCwgeTAsIHowXSlcbiAgICB9LFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgIC8vIFRPRE86IGNhbGN1bGF0ZSB0aGUgZGlzdGFuY2UgaW4gcHJvcGVyIHVuaXRzXG4gICAgICBkaXN0OiBtaW5EaXN0YW5jZSxcbiAgICAgIGluZGV4OiBpbmRleCAtIDFcbiAgICB9XG4gIH07XG59XG4iXX0=