"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getClosestPointOnLine = getClosestPointOnLine;
exports.getClosestPointOnPolyline = getClosestPointOnPolyline;

var _math = require("math.gl");

// Return the closest point on a line segment
function getClosestPointOnLine(_ref) {
  var p = _ref.p,
      p1 = _ref.p1,
      p2 = _ref.p2,
      _ref$clampToLine = _ref.clampToLine,
      clampToLine = _ref$clampToLine === void 0 ? true : _ref$clampToLine;
  var lineVector = new _math.Vector3(p2).subtract(p1);
  var pointVector = new _math.Vector3(p).subtract(p1);
  var dotProduct = lineVector.dot(pointVector);

  if (clampToLine) {
    dotProduct = (0, _math.clamp)(dotProduct, 0, 1);
  }

  return lineVector.lerp(dotProduct);
} // Return the closest point on a line segment


function getClosestPointOnPolyline(_ref2) {
  var p = _ref2.p,
      points = _ref2.points;
  p = new _math.Vector3(p);
  var pClosest = null;
  var distanceSquared = Infinity;
  var index = -1;

  for (var i = 0; i < points.length - 1; ++i) {
    var p1 = points[i];
    var p2 = points[i + 1];
    var pClosestOnLine = getClosestPointOnLine({
      p: p,
      p1: p1,
      p2: p2
    });
    var distanceToLineSquared = p.distanceSquared(pClosestOnLine);

    if (distanceToLineSquared < distanceSquared) {
      distanceSquared = distanceToLineSquared;
      pClosest = pClosestOnLine;
      index = i;
    }
  }

  return {
    point: pClosest,
    index: index,
    p1: points[index],
    p2: points[index + 1],
    distanceSquared: distanceSquared,
    distance: Math.sqrt(distanceSquared)
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvcGF0aC1tYXJrZXItbGF5ZXIvcG9seWxpbmUuanMiXSwibmFtZXMiOlsiZ2V0Q2xvc2VzdFBvaW50T25MaW5lIiwicCIsInAxIiwicDIiLCJjbGFtcFRvTGluZSIsImxpbmVWZWN0b3IiLCJWZWN0b3IzIiwic3VidHJhY3QiLCJwb2ludFZlY3RvciIsImRvdFByb2R1Y3QiLCJkb3QiLCJsZXJwIiwiZ2V0Q2xvc2VzdFBvaW50T25Qb2x5bGluZSIsInBvaW50cyIsInBDbG9zZXN0IiwiZGlzdGFuY2VTcXVhcmVkIiwiSW5maW5pdHkiLCJpbmRleCIsImkiLCJsZW5ndGgiLCJwQ2xvc2VzdE9uTGluZSIsImRpc3RhbmNlVG9MaW5lU3F1YXJlZCIsInBvaW50IiwiZGlzdGFuY2UiLCJNYXRoIiwic3FydCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7QUFFQTtBQUNPLFNBQVNBLHFCQUFULE9BQWtFO0FBQUEsTUFBakNDLENBQWlDLFFBQWpDQSxDQUFpQztBQUFBLE1BQTlCQyxFQUE4QixRQUE5QkEsRUFBOEI7QUFBQSxNQUExQkMsRUFBMEIsUUFBMUJBLEVBQTBCO0FBQUEsOEJBQXRCQyxXQUFzQjtBQUFBLE1BQXRCQSxXQUFzQixpQ0FBUixJQUFRO0FBQ3ZFLE1BQU1DLFVBQVUsR0FBRyxJQUFJQyxhQUFKLENBQVlILEVBQVosRUFBZ0JJLFFBQWhCLENBQXlCTCxFQUF6QixDQUFuQjtBQUNBLE1BQU1NLFdBQVcsR0FBRyxJQUFJRixhQUFKLENBQVlMLENBQVosRUFBZU0sUUFBZixDQUF3QkwsRUFBeEIsQ0FBcEI7QUFDQSxNQUFJTyxVQUFVLEdBQUdKLFVBQVUsQ0FBQ0ssR0FBWCxDQUFlRixXQUFmLENBQWpCOztBQUNBLE1BQUlKLFdBQUosRUFBaUI7QUFDZkssSUFBQUEsVUFBVSxHQUFHLGlCQUFNQSxVQUFOLEVBQWtCLENBQWxCLEVBQXFCLENBQXJCLENBQWI7QUFDRDs7QUFDRCxTQUFPSixVQUFVLENBQUNNLElBQVgsQ0FBZ0JGLFVBQWhCLENBQVA7QUFDRCxDLENBRUQ7OztBQUNPLFNBQVNHLHlCQUFULFFBQWtEO0FBQUEsTUFBYlgsQ0FBYSxTQUFiQSxDQUFhO0FBQUEsTUFBVlksTUFBVSxTQUFWQSxNQUFVO0FBQ3ZEWixFQUFBQSxDQUFDLEdBQUcsSUFBSUssYUFBSixDQUFZTCxDQUFaLENBQUo7QUFDQSxNQUFJYSxRQUFRLEdBQUcsSUFBZjtBQUNBLE1BQUlDLGVBQWUsR0FBR0MsUUFBdEI7QUFDQSxNQUFJQyxLQUFLLEdBQUcsQ0FBQyxDQUFiOztBQUNBLE9BQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0wsTUFBTSxDQUFDTSxNQUFQLEdBQWdCLENBQXBDLEVBQXVDLEVBQUVELENBQXpDLEVBQTRDO0FBQzFDLFFBQU1oQixFQUFFLEdBQUdXLE1BQU0sQ0FBQ0ssQ0FBRCxDQUFqQjtBQUNBLFFBQU1mLEVBQUUsR0FBR1UsTUFBTSxDQUFDSyxDQUFDLEdBQUcsQ0FBTCxDQUFqQjtBQUNBLFFBQU1FLGNBQWMsR0FBR3BCLHFCQUFxQixDQUFDO0FBQUVDLE1BQUFBLENBQUMsRUFBREEsQ0FBRjtBQUFLQyxNQUFBQSxFQUFFLEVBQUZBLEVBQUw7QUFBU0MsTUFBQUEsRUFBRSxFQUFGQTtBQUFULEtBQUQsQ0FBNUM7QUFDQSxRQUFNa0IscUJBQXFCLEdBQUdwQixDQUFDLENBQUNjLGVBQUYsQ0FBa0JLLGNBQWxCLENBQTlCOztBQUNBLFFBQUlDLHFCQUFxQixHQUFHTixlQUE1QixFQUE2QztBQUMzQ0EsTUFBQUEsZUFBZSxHQUFHTSxxQkFBbEI7QUFDQVAsTUFBQUEsUUFBUSxHQUFHTSxjQUFYO0FBQ0FILE1BQUFBLEtBQUssR0FBR0MsQ0FBUjtBQUNEO0FBQ0Y7O0FBQ0QsU0FBTztBQUNMSSxJQUFBQSxLQUFLLEVBQUVSLFFBREY7QUFFTEcsSUFBQUEsS0FBSyxFQUFMQSxLQUZLO0FBR0xmLElBQUFBLEVBQUUsRUFBRVcsTUFBTSxDQUFDSSxLQUFELENBSEw7QUFJTGQsSUFBQUEsRUFBRSxFQUFFVSxNQUFNLENBQUNJLEtBQUssR0FBRyxDQUFULENBSkw7QUFLTEYsSUFBQUEsZUFBZSxFQUFmQSxlQUxLO0FBTUxRLElBQUFBLFFBQVEsRUFBRUMsSUFBSSxDQUFDQyxJQUFMLENBQVVWLGVBQVY7QUFOTCxHQUFQO0FBUUQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBWZWN0b3IzLCBjbGFtcCB9IGZyb20gJ21hdGguZ2wnO1xuXG4vLyBSZXR1cm4gdGhlIGNsb3Nlc3QgcG9pbnQgb24gYSBsaW5lIHNlZ21lbnRcbmV4cG9ydCBmdW5jdGlvbiBnZXRDbG9zZXN0UG9pbnRPbkxpbmUoeyBwLCBwMSwgcDIsIGNsYW1wVG9MaW5lID0gdHJ1ZSB9KSB7XG4gIGNvbnN0IGxpbmVWZWN0b3IgPSBuZXcgVmVjdG9yMyhwMikuc3VidHJhY3QocDEpO1xuICBjb25zdCBwb2ludFZlY3RvciA9IG5ldyBWZWN0b3IzKHApLnN1YnRyYWN0KHAxKTtcbiAgbGV0IGRvdFByb2R1Y3QgPSBsaW5lVmVjdG9yLmRvdChwb2ludFZlY3Rvcik7XG4gIGlmIChjbGFtcFRvTGluZSkge1xuICAgIGRvdFByb2R1Y3QgPSBjbGFtcChkb3RQcm9kdWN0LCAwLCAxKTtcbiAgfVxuICByZXR1cm4gbGluZVZlY3Rvci5sZXJwKGRvdFByb2R1Y3QpO1xufVxuXG4vLyBSZXR1cm4gdGhlIGNsb3Nlc3QgcG9pbnQgb24gYSBsaW5lIHNlZ21lbnRcbmV4cG9ydCBmdW5jdGlvbiBnZXRDbG9zZXN0UG9pbnRPblBvbHlsaW5lKHsgcCwgcG9pbnRzIH0pIHtcbiAgcCA9IG5ldyBWZWN0b3IzKHApO1xuICBsZXQgcENsb3Nlc3QgPSBudWxsO1xuICBsZXQgZGlzdGFuY2VTcXVhcmVkID0gSW5maW5pdHk7XG4gIGxldCBpbmRleCA9IC0xO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHBvaW50cy5sZW5ndGggLSAxOyArK2kpIHtcbiAgICBjb25zdCBwMSA9IHBvaW50c1tpXTtcbiAgICBjb25zdCBwMiA9IHBvaW50c1tpICsgMV07XG4gICAgY29uc3QgcENsb3Nlc3RPbkxpbmUgPSBnZXRDbG9zZXN0UG9pbnRPbkxpbmUoeyBwLCBwMSwgcDIgfSk7XG4gICAgY29uc3QgZGlzdGFuY2VUb0xpbmVTcXVhcmVkID0gcC5kaXN0YW5jZVNxdWFyZWQocENsb3Nlc3RPbkxpbmUpO1xuICAgIGlmIChkaXN0YW5jZVRvTGluZVNxdWFyZWQgPCBkaXN0YW5jZVNxdWFyZWQpIHtcbiAgICAgIGRpc3RhbmNlU3F1YXJlZCA9IGRpc3RhbmNlVG9MaW5lU3F1YXJlZDtcbiAgICAgIHBDbG9zZXN0ID0gcENsb3Nlc3RPbkxpbmU7XG4gICAgICBpbmRleCA9IGk7XG4gICAgfVxuICB9XG4gIHJldHVybiB7XG4gICAgcG9pbnQ6IHBDbG9zZXN0LFxuICAgIGluZGV4LFxuICAgIHAxOiBwb2ludHNbaW5kZXhdLFxuICAgIHAyOiBwb2ludHNbaW5kZXggKyAxXSxcbiAgICBkaXN0YW5jZVNxdWFyZWQsXG4gICAgZGlzdGFuY2U6IE1hdGguc3FydChkaXN0YW5jZVNxdWFyZWQpXG4gIH07XG59XG4iXX0=