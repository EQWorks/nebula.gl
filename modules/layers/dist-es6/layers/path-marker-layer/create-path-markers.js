"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createPathMarkers;

var _math = require("math.gl");

function getLineLength(vPoints) {
  // calculate total length
  var lineLength = 0;

  for (var i = 0; i < vPoints.length - 1; i++) {
    lineLength += vPoints[i].distance(vPoints[i + 1]);
  }

  return lineLength;
}

var DEFAULT_COLOR = [0, 0, 0, 255];
var DEFAULT_DIRECTION = {
  forward: true,
  backward: false
};

function createPathMarkers(_ref) {
  var data = _ref.data,
      _ref$getPath = _ref.getPath,
      getPath = _ref$getPath === void 0 ? function (x) {
    return x.path;
  } : _ref$getPath,
      _ref$getDirection = _ref.getDirection,
      getDirection = _ref$getDirection === void 0 ? function (x) {
    return x.direction;
  } : _ref$getDirection,
      _ref$getColor = _ref.getColor,
      getColor = _ref$getColor === void 0 ? function (x) {
    return DEFAULT_COLOR;
  } : _ref$getColor,
      _ref$getMarkerPercent = _ref.getMarkerPercentages,
      getMarkerPercentages = _ref$getMarkerPercent === void 0 ? function (x) {
    return [0.5];
  } : _ref$getMarkerPercent,
      projectFlat = _ref.projectFlat;
  var markers = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var object = _step.value;
      var path = getPath(object);
      var direction = getDirection(object) || DEFAULT_DIRECTION;
      var color = getColor(object);
      var vPoints = path.map(function (p) {
        return new _math.Vector2(p);
      });
      var vPointsReverse = vPoints.slice(0).reverse(); // calculate total length

      var lineLength = getLineLength(vPoints); // Ask for where to put markers

      var percentages = getMarkerPercentages(object, {
        lineLength: lineLength
      }); // Create the markers

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = percentages[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var percentage = _step2.value;

          if (direction.forward) {
            var marker = createMarkerAlongPath({
              path: vPoints,
              percentage: percentage,
              lineLength: lineLength,
              color: color,
              object: object,
              projectFlat: projectFlat
            });
            markers.push(marker);
          }

          if (direction.backward) {
            var _marker = createMarkerAlongPath({
              path: vPointsReverse,
              percentage: percentage,
              lineLength: lineLength,
              color: color,
              object: object,
              projectFlat: projectFlat
            });

            markers.push(_marker);
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return markers;
}

function createMarkerAlongPath(_ref2) {
  var path = _ref2.path,
      percentage = _ref2.percentage,
      lineLength = _ref2.lineLength,
      color = _ref2.color,
      object = _ref2.object,
      projectFlat = _ref2.projectFlat;
  var distanceAlong = lineLength * percentage;
  var currentDistance = 0;
  var previousDistance = 0;
  var i = 0;

  for (i = 0; i < path.length - 1; i++) {
    currentDistance += path[i].distance(path[i + 1]);

    if (currentDistance > distanceAlong) {
      break;
    }

    previousDistance = currentDistance;
  }

  var vDirection = path[i + 1].clone().subtract(path[i]).normalize();
  var along = distanceAlong - previousDistance;
  var vCenter = vDirection.clone().multiply(new _math.Vector2(along, along)).add(path[i]);
  var vDirection2 = new _math.Vector2(projectFlat(path[i + 1])).subtract(projectFlat(path[i]));
  var angle = -vDirection2.verticalAngle() * 180 / Math.PI;
  return {
    position: [vCenter.x, vCenter.y, 0],
    angle: angle,
    color: color,
    object: object
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvcGF0aC1tYXJrZXItbGF5ZXIvY3JlYXRlLXBhdGgtbWFya2Vycy5qcyJdLCJuYW1lcyI6WyJnZXRMaW5lTGVuZ3RoIiwidlBvaW50cyIsImxpbmVMZW5ndGgiLCJpIiwibGVuZ3RoIiwiZGlzdGFuY2UiLCJERUZBVUxUX0NPTE9SIiwiREVGQVVMVF9ESVJFQ1RJT04iLCJmb3J3YXJkIiwiYmFja3dhcmQiLCJjcmVhdGVQYXRoTWFya2VycyIsImRhdGEiLCJnZXRQYXRoIiwieCIsInBhdGgiLCJnZXREaXJlY3Rpb24iLCJkaXJlY3Rpb24iLCJnZXRDb2xvciIsImdldE1hcmtlclBlcmNlbnRhZ2VzIiwicHJvamVjdEZsYXQiLCJtYXJrZXJzIiwib2JqZWN0IiwiY29sb3IiLCJtYXAiLCJwIiwiVmVjdG9yMiIsInZQb2ludHNSZXZlcnNlIiwic2xpY2UiLCJyZXZlcnNlIiwicGVyY2VudGFnZXMiLCJwZXJjZW50YWdlIiwibWFya2VyIiwiY3JlYXRlTWFya2VyQWxvbmdQYXRoIiwicHVzaCIsImRpc3RhbmNlQWxvbmciLCJjdXJyZW50RGlzdGFuY2UiLCJwcmV2aW91c0Rpc3RhbmNlIiwidkRpcmVjdGlvbiIsImNsb25lIiwic3VidHJhY3QiLCJub3JtYWxpemUiLCJhbG9uZyIsInZDZW50ZXIiLCJtdWx0aXBseSIsImFkZCIsInZEaXJlY3Rpb24yIiwiYW5nbGUiLCJ2ZXJ0aWNhbEFuZ2xlIiwiTWF0aCIsIlBJIiwicG9zaXRpb24iLCJ5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBRUEsU0FBU0EsYUFBVCxDQUF1QkMsT0FBdkIsRUFBZ0M7QUFDOUI7QUFDQSxNQUFJQyxVQUFVLEdBQUcsQ0FBakI7O0FBQ0EsT0FBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHRixPQUFPLENBQUNHLE1BQVIsR0FBaUIsQ0FBckMsRUFBd0NELENBQUMsRUFBekMsRUFBNkM7QUFDM0NELElBQUFBLFVBQVUs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QUNuQztBQUNEOztBQUNERSxJQUFBQSxnQkFBZ0IsR0FBR0QsZUFBbkI7QUFDRDs7QUFFRCxNQUFNRSxVQUFVLEdBQUd2QixJQUFJLENBQUNYLENBQUMsR0FBRyxDQUFMLENBQUosQ0FDaEJtQyxLQURnQixHQUVoQkMsUUFGZ0IsQ0FFUHpCLElBQUksQ0FBQ1gsQ0FBRCxDQUZHLEVBR2hCcUMsU0FIZ0IsRUFBbkI7QUFJQSxNQUFNQyxLQUFLLEdBQUdQLGFBQWEsR0FBR0UsZ0JBQTlCO0FBQ0EsTUFBTU0sT0FBTyxHQUFHTCxVQUFVLENBQ3ZCQyxLQURhLEdBRWJLLFFBRmEsQ0FFSixJQUFJbEIsYUFBSixDQUFZZ0IsS0FBWixFQUFtQkEsS0FBbkIsQ0FGSSxFQUdiRyxHQUhhLENBR1Q5QixJQUFJLENBQUNYLENBQUQsQ0FISyxDQUFoQjtBQUtBLE1BQU0wQyxXQUFXLEdBQUcsSUFBSXBCLGFBQUosQ0FBWU4sV0FBVyxDQUFDTCxJQUFJLENBQUNYLENBQUMsR0FBRyxDQUFMLENBQUwsQ0FBdkIsRUFBc0NvQyxRQUF0QyxDQUErQ3BCLFdBQVcsQ0FBQ0wsSUFBSSxDQUFDWCxDQUFELENBQUwsQ0FBMUQsQ0FBcEI7QUFDQSxNQUFNMkMsS0FBSyxHQUFJLENBQUNELFdBQVcsQ0FBQ0UsYUFBWixFQUFELEdBQStCLEdBQWhDLEdBQXVDQyxJQUFJLENBQUNDLEVBQTFEO0FBRUEsU0FBTztBQUFFQyxJQUFBQSxRQUFRLEVBQUUsQ0FBQ1IsT0FBTyxDQUFDN0IsQ0FBVCxFQUFZNkIsT0FBTyxDQUFDUyxDQUFwQixFQUF1QixDQUF2QixDQUFaO0FBQXVDTCxJQUFBQSxLQUFLLEVBQUxBLEtBQXZDO0FBQThDeEIsSUFBQUEsS0FBSyxFQUFMQSxLQUE5QztBQUFxREQsSUFBQUEsTUFBTSxFQUFOQTtBQUFyRCxHQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSAnbWF0aC5nbCc7XG5cbmZ1bmN0aW9uIGdldExpbmVMZW5ndGgodlBvaW50cykge1xuICAvLyBjYWxjdWxhdGUgdG90YWwgbGVuZ3RoXG4gIGxldCBsaW5lTGVuZ3RoID0gMDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB2UG9pbnRzLmxlbmd0aCAtIDE7IGkrKykge1xuICAgIGxpbmVMZW5ndGggKz0gdlBvaW50c1tpXS5kaXN0YW5jZSh2UG9pbnRzW2kgKyAxXSk7XG4gIH1cbiAgcmV0dXJuIGxpbmVMZW5ndGg7XG59XG5cbmNvbnN0IERFRkFVTFRfQ09MT1IgPSBbMCwgMCwgMCwgMjU1XTtcbmNvbnN0IERFRkFVTFRfRElSRUNUSU9OID0geyBmb3J3YXJkOiB0cnVlLCBiYWNrd2FyZDogZmFsc2UgfTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlUGF0aE1hcmtlcnMoe1xuICBkYXRhLFxuICBnZXRQYXRoID0geCA9PiB4LnBhdGgsXG4gIGdldERpcmVjdGlvbiA9IHggPT4geC5kaXJlY3Rpb24sXG4gIGdldENvbG9yID0geCA9PiBERUZBVUxUX0NPTE9SLFxuICBnZXRNYXJrZXJQZXJjZW50YWdlcyA9IHggPT4gWzAuNV0sXG4gIHByb2plY3RGbGF0XG59KSB7XG4gIGNvbnN0IG1hcmtlcnMgPSBbXTtcblxuICBmb3IgKGNvbnN0IG9iamVjdCBvZiBkYXRhKSB7XG4gICAgY29uc3QgcGF0aCA9IGdldFBhdGgob2JqZWN0KTtcbiAgICBjb25zdCBkaXJlY3Rpb24gPSBnZXREaXJlY3Rpb24ob2JqZWN0KSB8fCBERUZBVUxUX0RJUkVDVElPTjtcbiAgICBjb25zdCBjb2xvciA9IGdldENvbG9yKG9iamVjdCk7XG5cbiAgICBjb25zdCB2UG9pbnRzID0gcGF0aC5tYXAocCA9PiBuZXcgVmVjdG9yMihwKSk7XG4gICAgY29uc3QgdlBvaW50c1JldmVyc2UgPSB2UG9pbnRzLnNsaWNlKDApLnJldmVyc2UoKTtcblxuICAgIC8vIGNhbGN1bGF0ZSB0b3RhbCBsZW5ndGhcbiAgICBjb25zdCBsaW5lTGVuZ3RoID0gZ2V0TGluZUxlbmd0aCh2UG9pbnRzKTtcblxuICAgIC8vIEFzayBmb3Igd2hlcmUgdG8gcHV0IG1hcmtlcnNcbiAgICBjb25zdCBwZXJjZW50YWdlcyA9IGdldE1hcmtlclBlcmNlbnRhZ2VzKG9iamVjdCwgeyBsaW5lTGVuZ3RoIH0pO1xuXG4gICAgLy8gQ3JlYXRlIHRoZSBtYXJrZXJzXG4gICAgZm9yIChjb25zdCBwZXJjZW50YWdlIG9mIHBlcmNlbnRhZ2VzKSB7XG4gICAgICBpZiAoZGlyZWN0aW9uLmZvcndhcmQpIHtcbiAgICAgICAgY29uc3QgbWFya2VyID0gY3JlYXRlTWFya2VyQWxvbmdQYXRoKHtcbiAgICAgICAgICBwYXRoOiB2UG9pbnRzLFxuICAgICAgICAgIHBlcmNlbnRhZ2UsXG4gICAgICAgICAgbGluZUxlbmd0aCxcbiAgICAgICAgICBjb2xvcixcbiAgICAgICAgICBvYmplY3QsXG4gICAgICAgICAgcHJvamVjdEZsYXRcbiAgICAgICAgfSk7XG4gICAgICAgIG1hcmtlcnMucHVzaChtYXJrZXIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZGlyZWN0aW9uLmJhY2t3YXJkKSB7XG4gICAgICAgIGNvbnN0IG1hcmtlciA9IGNyZWF0ZU1hcmtlckFsb25nUGF0aCh7XG4gICAgICAgICAgcGF0aDogdlBvaW50c1JldmVyc2UsXG4gICAgICAgICAgcGVyY2VudGFnZSxcbiAgICAgICAgICBsaW5lTGVuZ3RoLFxuICAgICAgICAgIGNvbG9yLFxuICAgICAgICAgIG9iamVjdCxcbiAgICAgICAgICBwcm9qZWN0RmxhdFxuICAgICAgICB9KTtcbiAgICAgICAgbWFya2Vycy5wdXNoKG1hcmtlcik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG1hcmtlcnM7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZU1hcmtlckFsb25nUGF0aCh7IHBhdGgsIHBlcmNlbnRhZ2UsIGxpbmVMZW5ndGgsIGNvbG9yLCBvYmplY3QsIHByb2plY3RGbGF0IH0pIHtcbiAgY29uc3QgZGlzdGFuY2VBbG9uZyA9IGxpbmVMZW5ndGggKiBwZXJjZW50YWdlO1xuICBsZXQgY3VycmVudERpc3RhbmNlID0gMDtcbiAgbGV0IHByZXZpb3VzRGlzdGFuY2UgPSAwO1xuICBsZXQgaSA9IDA7XG4gIGZvciAoaSA9IDA7IGkgPCBwYXRoLmxlbmd0aCAtIDE7IGkrKykge1xuICAgIGN1cnJlbnREaXN0YW5jZSArPSBwYXRoW2ldLmRpc3RhbmNlKHBhdGhbaSArIDFdKTtcbiAgICBpZiAoY3VycmVudERpc3RhbmNlID4gZGlzdGFuY2VBbG9uZykge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHByZXZpb3VzRGlzdGFuY2UgPSBjdXJyZW50RGlzdGFuY2U7XG4gIH1cblxuICBjb25zdCB2RGlyZWN0aW9uID0gcGF0aFtpICsgMV1cbiAgICAuY2xvbmUoKVxuICAgIC5zdWJ0cmFjdChwYXRoW2ldKVxuICAgIC5ub3JtYWxpemUoKTtcbiAgY29uc3QgYWxvbmcgPSBkaXN0YW5jZUFsb25nIC0gcHJldmlvdXNEaXN0YW5jZTtcbiAgY29uc3QgdkNlbnRlciA9IHZEaXJlY3Rpb25cbiAgICAuY2xvbmUoKVxuICAgIC5tdWx0aXBseShuZXcgVmVjdG9yMihhbG9uZywgYWxvbmcpKVxuICAgIC5hZGQocGF0aFtpXSk7XG5cbiAgY29uc3QgdkRpcmVjdGlvbjIgPSBuZXcgVmVjdG9yMihwcm9qZWN0RmxhdChwYXRoW2kgKyAxXSkpLnN1YnRyYWN0KHByb2plY3RGbGF0KHBhdGhbaV0pKTtcbiAgY29uc3QgYW5nbGUgPSAoLXZEaXJlY3Rpb24yLnZlcnRpY2FsQW5nbGUoKSAqIDE4MCkgLyBNYXRoLlBJO1xuXG4gIHJldHVybiB7IHBvc2l0aW9uOiBbdkNlbnRlci54LCB2Q2VudGVyLnksIDBdLCBhbmdsZSwgY29sb3IsIG9iamVjdCB9O1xufVxuIl19