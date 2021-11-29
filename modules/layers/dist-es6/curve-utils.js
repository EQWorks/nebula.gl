"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateCurveFromControlPoints = generateCurveFromControlPoints;

var _cubicHermiteSpline = _interopRequireDefault(require("cubic-hermite-spline"));

var _distance = _interopRequireDefault(require("@turf/distance"));

var _helpers = require("@turf/helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var INTERPOLATION_INTERVAL = 0.005;
var INTERPOLATION_THRESHOLD = 0.001;

function calculateSingleTangent(p0, p1, d) {
  var x = (p1[0] - p0[0]) / d;
  var y = (p1[1] - p0[1]) / d;
  return [x, y];
}

function generateCurveFromControlPoints(line) {
  // calculate knots
  var knots = [0];
  var prev = null;
  var totalDistance = 0;
  var coords = line.geometry.coordinates;

  for (var i = 0; i < coords.length; i++) {
    var cur = coords[i];

    if (prev !== null) {
      totalDistance += (0, _distance.default)(prev, cur);
      knots.push(totalDistance);
    }

    prev = cur;
  } // calculate tangents


  var tangents = []; // first tangent

  tangents.push(calculateSingleTangent(coords[0], coords[1], knots[1] - knots[0])); // second to before last

  for (var _i = 1; _i < coords.length - 1; _i++) {
    var A = calculateSingleTangent(coords[_i], coords[_i + 1], knots[_i + 1] - knots[_i]);
    var B = calculateSingleTangent(coords[_i - 1], coords[_i], knots[_i] - knots[_i - 1]);
    var x = (A[0] + B[0]) / 2.0;
    var y = (A[1] + B[1]) / 2.0;
    tangents.push([x, y]);
  } // last tangent


  var last = coords.length - 1;
  tangents.push(calculateSingleTangent(coords[last - 1], coords[last], knots[last] - knots[last - 1])); // generate curve

  var result = [];

  for (var _i2 = 0; _i2 < coords.length; _i2++) {
    // add control point
    result.push(coords[_i2]); // add interpolated values

    for (var t = knots[_i2] + INTERPOLATION_INTERVAL; t < knots[_i2 + 1]; t += INTERPOLATION_INTERVAL) {
      if (knots[_i2 + 1] - t > INTERPOLATION_THRESHOLD) {
        // Only add if not too close to a control point (knot = control point)
        result.push((0, _cubicHermiteSpline.default)(t, coords, tangents, knots));
      }
    }
  }

  return (0, _helpers.lineString)(result);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jdXJ2ZS11dGlscy5qcyJdLCJuYW1lcyI6WyJJTlRFUlBPTEFUSU9OX0lOVEVSVkFMIiwiSU5URVJQT0xBVElPTl9USFJFU0hPTEQiLCJjYWxjdWxhdGVTaW5nbGVUYW5nZW50IiwicDAiLCJwMSIsImQiLCJ4IiwieSIsImdlbmVyYXRlQ3VydmVGcm9tQ29udHJvbFBvaW50cyIsImxpbmUiLCJrbm90cyIsInByZXYiLCJ0b3RhbERpc3RhbmNlIiwiY29vcmRzIiwiZ2VvbWV0cnkiLCJjb29yZGluYXRlcyIsImkiLCJsZW5ndGgiLCJjdXIiLCJwdXNoIiwidGFuZ2VudHMiLCJBIiwiQiIsImxhc3QiLCJyZXN1bHQiLCJ0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFJQSxJQUFNQSxzQkFBc0IsR0FBRyxLQUEvQjtBQUNBLElBQU1DLHVCQUF1QixHQUFHLEtBQWhDOztBQUVBLFNBQVNDLHNCQUFULENBQWdDQyxFQUFoQyxFQUFzREMsRUFBdEQsRUFBNEVDLENBQTVFLEVBQWlHO0FBQy9GLE1BQU1DLENBQUMsR0FBRyxDQUFDRixFQUFFLENBQUMsQ0FBRCxDQUFGLEdBQVFELEVBQUUsQ0FBQyxDQUFELENBQVgsSUFBa0JFLENBQTVCO0FBQ0EsTUFBTUUsQ0FBQyxHQUFHLENBQUNILEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUUQsRUFBRSxDQUFDLENBQUQsQ0FBWCxJQUFrQkUsQ0FBNUI7QUFDQSxTQUFPLENBQUNDLENBQUQsRUFBSUMsQ0FBSixDQUFQO0FBQ0Q7O0FBRU0sU0FBU0MsOEJBQVQsQ0FBd0NDLElBQXhDLEVBQWdGO0FBQ3JGO0FBQ0EsTUFBTUMsS0FBSyxHQUFHLENBQUMsQ0FBRCxDQUFkO0FBQ0EsTUFBSUMsSUFBSSxHQUFHLElBQVg7QUFDQSxNQUFJQyxhQUFhLEdBQUcsQ0FBcEI7QUFKcUYsTUFNaEVDLE1BTmdFLEdBTXJESixJQUFJLENBQUNLLFFBTmdELENBTTdFQyxXQU42RTs7QUFRckYsT0FB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VSxLQUFLLENBQUNNLEdBQUMsR0FBRyxDQUFMLENBQUwsR0FBZVMsQ0FBZixHQUFtQnhCLHVCQUF2QixFQUFnRDtBQUM5QztBQUNBdUIsUUFBQUEsTUFBTSxDQUFDTCxJQUFQLENBQVksaUNBQVFNLENBQVIsRUFBV1osTUFBWCxFQUFtQk8sUUFBbkIsRUFBNkJWLEtBQTdCLENBQVo7QUFDRDtBQUNGO0FBQ0Y7O0FBRUQsU0FBTyx5QkFBV2MsTUFBWCxDQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuaW1wb3J0IGhlcm1pdGUgZnJvbSAnY3ViaWMtaGVybWl0ZS1zcGxpbmUnO1xuaW1wb3J0IHR1cmZEaXN0YW5jZSBmcm9tICdAdHVyZi9kaXN0YW5jZSc7XG5pbXBvcnQgeyBsaW5lU3RyaW5nIH0gZnJvbSAnQHR1cmYvaGVscGVycyc7XG5cbmltcG9ydCB0eXBlIHsgRmVhdHVyZSB9IGZyb20gJ2dlb2pzb24tdHlwZXMnO1xuXG5jb25zdCBJTlRFUlBPTEFUSU9OX0lOVEVSVkFMID0gMC4wMDU7XG5jb25zdCBJTlRFUlBPTEFUSU9OX1RIUkVTSE9MRCA9IDAuMDAxO1xuXG5mdW5jdGlvbiBjYWxjdWxhdGVTaW5nbGVUYW5nZW50KHAwOiBbbnVtYmVyLCBudW1iZXJdLCBwMTogW251bWJlciwgbnVtYmVyXSwgZDogbnVtYmVyKTogbnVtYmVyW10ge1xuICBjb25zdCB4ID0gKHAxWzBdIC0gcDBbMF0pIC8gZDtcbiAgY29uc3QgeSA9IChwMVsxXSAtIHAwWzFdKSAvIGQ7XG4gIHJldHVybiBbeCwgeV07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZUN1cnZlRnJvbUNvbnRyb2xQb2ludHMobGluZTogRmVhdHVyZTxPYmplY3Q+KTogRmVhdHVyZTxPYmplY3Q+IHtcbiAgLy8gY2FsY3VsYXRlIGtub3RzXG4gIGNvbnN0IGtub3RzID0gWzBdO1xuICBsZXQgcHJldiA9IG51bGw7XG4gIGxldCB0b3RhbERpc3RhbmNlID0gMDtcblxuICBjb25zdCB7IGNvb3JkaW5hdGVzOiBjb29yZHMgfSA9IGxpbmUuZ2VvbWV0cnk7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb29yZHMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBjdXIgPSBjb29yZHNbaV07XG4gICAgaWYgKHByZXYgIT09IG51bGwpIHtcbiAgICAgIHRvdGFsRGlzdGFuY2UgKz0gdHVyZkRpc3RhbmNlKHByZXYsIGN1cik7XG4gICAgICBrbm90cy5wdXNoKHRvdGFsRGlzdGFuY2UpO1xuICAgIH1cbiAgICBwcmV2ID0gY3VyO1xuICB9XG5cbiAgLy8gY2FsY3VsYXRlIHRhbmdlbnRzXG4gIGNvbnN0IHRhbmdlbnRzID0gW107XG5cbiAgLy8gZmlyc3QgdGFuZ2VudFxuICB0YW5nZW50cy5wdXNoKGNhbGN1bGF0ZVNpbmdsZVRhbmdlbnQoY29vcmRzWzBdLCBjb29yZHNbMV0sIGtub3RzWzFdIC0ga25vdHNbMF0pKTtcblxuICAvLyBzZWNvbmQgdG8gYmVmb3JlIGxhc3RcbiAgZm9yIChsZXQgaSA9IDE7IGkgPCBjb29yZHMubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgY29uc3QgQSA9IGNhbGN1bGF0ZVNpbmdsZVRhbmdlbnQoY29vcmRzW2ldLCBjb29yZHNbaSArIDFdLCBrbm90c1tpICsgMV0gLSBrbm90c1tpXSk7XG4gICAgY29uc3QgQiA9IGNhbGN1bGF0ZVNpbmdsZVRhbmdlbnQoY29vcmRzW2kgLSAxXSwgY29vcmRzW2ldLCBrbm90c1tpXSAtIGtub3RzW2kgLSAxXSk7XG4gICAgY29uc3QgeCA9IChBWzBdICsgQlswXSkgLyAyLjA7XG4gICAgY29uc3QgeSA9IChBWzFdICsgQlsxXSkgLyAyLjA7XG4gICAgdGFuZ2VudHMucHVzaChbeCwgeV0pO1xuICB9XG5cbiAgLy8gbGFzdCB0YW5nZW50XG4gIGNvbnN0IGxhc3QgPSBjb29yZHMubGVuZ3RoIC0gMTtcbiAgdGFuZ2VudHMucHVzaChcbiAgICBjYWxjdWxhdGVTaW5nbGVUYW5nZW50KGNvb3Jkc1tsYXN0IC0gMV0sIGNvb3Jkc1tsYXN0XSwga25vdHNbbGFzdF0gLSBrbm90c1tsYXN0IC0gMV0pXG4gICk7XG5cbiAgLy8gZ2VuZXJhdGUgY3VydmVcbiAgY29uc3QgcmVzdWx0ID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY29vcmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgLy8gYWRkIGNvbnRyb2wgcG9pbnRcbiAgICByZXN1bHQucHVzaChjb29yZHNbaV0pO1xuXG4gICAgLy8gYWRkIGludGVycG9sYXRlZCB2YWx1ZXNcbiAgICBmb3IgKGxldCB0ID0ga25vdHNbaV0gKyBJTlRFUlBPTEFUSU9OX0lOVEVSVkFMOyB0IDwga25vdHNbaSArIDFdOyB0ICs9IElOVEVSUE9MQVRJT05fSU5URVJWQUwpIHtcbiAgICAgIGlmIChrbm90c1tpICsgMV0gLSB0ID4gSU5URVJQT0xBVElPTl9USFJFU0hPTEQpIHtcbiAgICAgICAgLy8gT25seSBhZGQgaWYgbm90IHRvbyBjbG9zZSB0byBhIGNvbnRyb2wgcG9pbnQgKGtub3QgPSBjb250cm9sIHBvaW50KVxuICAgICAgICByZXN1bHQucHVzaChoZXJtaXRlKHQsIGNvb3JkcywgdGFuZ2VudHMsIGtub3RzKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGxpbmVTdHJpbmcocmVzdWx0KTtcbn1cbiJdfQ==