"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DrawEllipseUsingThreePointsHandler = void 0;

var _distance = _interopRequireDefault(require("@turf/distance"));

var _ellipse = _interopRequireDefault(require("@turf/ellipse"));

var _bearing = _interopRequireDefault(require("@turf/bearing"));

var _helpers = require("@turf/helpers");

var _threeClickPolygonHandler = require("./three-click-polygon-handler.js");

var _modeHandler = require("./mode-handler.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var DrawEllipseUsingThreePointsHandler =
/*#__PURE__*/
function (_ThreeClickPolygonHan) {
  _inherits(DrawEllipseUsingThreePointsHandler, _ThreeClickPolygonHan);

  function DrawEllipseUsingThreePointsHandler() {
    _classCallCheck(this, DrawEllipseUsingThreePointsHandler);

    return _possibleConstructorReturn(this, _getPrototypeOf(DrawEllipseUsingThreePointsHandler).apply(this, arguments));
  }

  _createClass(DrawEllipseUsingThreePointsHandler, [{
    key: "handlePointerMove",
    value: function handlePointerMove(event) {
      var result = {
        editAction: null,
        cancelMapPan: false
      };
      var clickSequence = this.getClickSequence();

      if (clickSequence.length === 0) {
        // nothing to do yet
        return result;
      }

      var groundCoords = event.groundCoords;

      if (clickSequence.length === 1) {
        this._setTentativeFeature({
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [clickSequence[0], groundCoords]
          }
        });
      } else if (clickSequence.length === 2) {
        var _clickSequence = _slicedToArray(clickSequence, 2),
            p1 = _clickSequence[0],
            p2 = _clickSequence[1];

        var centerCoordinates = (0, _modeHandler.getIntermediatePosition)(p1, p2);
        var xSemiAxis = Math.max((0, _distance.default)(centerCoordinates, (0, _helpers.point)(groundCoords)), 0.001);
        var ySemiAxis = Math.max((0, _distance.default)(p1, p2), 0.001) / 2;
        var options = {
          angle: (0, _bearing.default)(p1, p2)
        };

        this._setTentativeFeature((0, _ellipse.default)(centerCoordinates, xSemiAxis, ySemiAxis, options));
      }

      return result;
    }
  }]);

  return DrawEllipseUsingThreePointsHandler;
}(_threeClickPolygonHandler.ThreeClickPolygonHandler);

exports.DrawEllipseUsingThreePointsHandler = DrawEllipseUsingThreePointsHandler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL2RyYXctZWxsaXBzZS11c2luZy10aHJlZS1wb2ludHMtaGFuZGxlci5qcyJdLCJuYW1lcyI6WyJEcmF3RWxsaXBzZVVzaW5nVGhyZWVQb2ludHNIYW5kbGVyIiwiZXZlbnQiLCJyZXN1bHQiLCJlZGl0QWN0aW9uIiwiY2FuY2VsTWFwUGFuIiwiY2xpY2tTZXF1ZW5jZSIsImdldENsaWNrU2VxdWVuY2UiLCJsZW5ndGgiLCJncm91bmRDb29yZHMiLCJfc2V0VGVudGF0aXZlRmVhdHVyZSIsInR5cGUiLCJnZW9tZXRyeSIsImNvb3JkaW5hdGVzIiwicDEiLCJwMiIsImNlbnRlckNvb3JkaW5hdGVzIiwieFNlbWlBeGlzIiwiTWF0aCIsIm1heCIsInlTZW1pQXhpcyIsIm9wdGlvbnMiLCJhbmdsZSIsIlRocmVlQ2xpY2tQb2x5Z29uSGFuZGxlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQUdBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFFYUEsa0M7Ozs7Ozs7Ozs7Ozs7c0NBQ09DLEssRUFBNkU7QUFDN0YsVUFBTUMsTUFBTSxHQUFHO0FBQUVDLFFBQUFBLFVBQVUsRUFBRSxJQUFkO0FBQW9CQyxRQUFBQSxZQUFZLEVBQUU7QUFBbEMsT0FBZjtBQUNBLFVBQU1DLGFBQWEsR0FBRyxLQUFLQyxnQkFBTCxFQUF0Qjs7QUFFQSxVQUFJRCxhQUFhLENBQUNFLE1BQWQsS0FBeUIsQ0FBN0IsRUFBZ0M7QUFDOUI7QUFDQSxlQUFPTCxNQUFQO0FBQ0Q7O0FBRUQsVUFBTU0sWUFBWSxHQUFHUCxLQUFLLENBQUNPLFlBQTNCOztBQUVBLFVBQUlILGFBQWEsQ0FBQ0UsTUFBZCxLQUF5QixDQUE3QixFQUFnQztBQUM5QixhQUFLRSxvQkFBTCxDQUEwQjtBQUN4QkMsVUFBQUEsSUFBSSxFQUFFLFNBRGtCO0FBRXhCQyxVQUFBQSxRQUFRLEVBQUU7QUFDUkQsWUFBQUEsSUFBSSxFQUFFLFlBREU7QUFFUkUsWUFBQUEsV0FBVyxFQUFFLENBQUNQLGFBQWEsQ0FBQyxDQUFELENBQWQsRUFBbUJHLFlBQW5CO0FBRkw7QUFGYyxTQUExQjtBQU9ELE9BUkQsTUFRTyxJQUFJSCxhQUFhLENBQUNFLE1BQWQsS0FBeUIsQ0FBN0IsRUFBZ0M7QUFBQSw0Q0FDcEJGLGFBRG9CO0FBQUEsWUFDOUJRLEVBRDhCO0FBQUEsWUFDMUJDLEVBRDBCOztBQUdyQyxZQUFNQyxpQkFBaUIsR0FBRywwQ0FBd0JGLEVBQXhCLEVBQTRCQyxFQUE1QixDQUExQjtBQUNBLFlBQU1FLFNBQVMsR0FBR0MsSUFBSSxDQUFDQyxHQUFMLENBQVMsdUJBQVNILGlCQUFULEVBQTRCLG9CQUFNUCxZQUFOLENBQTVCLENBQVQsRUFBMkQsS0FBM0QsQ0FBbEI7QUFDQSxZQUFNVyxTQUFTLEdBQUdGLElBQUksQ0FBQ0MsR0FBTCxDQUFTLHVCQUFTTCxFQUFULEVBQWFDLEVBQWIsQ0FBVCxFQUEyQixLQUEzQixJQUFvQyxDQUF0RDtBQUNBLFlBQU1NLE9BQU8sR0FBRztBQUFFQyxVQUFBQSxLQUFLLEVBQUUsc0JBQVFSLEVBQVIsRUFBWUMsRUFBWjtBQUFULFNBQWhCOztBQUVBLGFBQUtMLG9CQUFMLENBQTBCLHNCQUFRTSxpQkFBUixFQUEyQkMsU0FBM0IsRUFBc0NHLFNBQXRDLEVBQWlEQyxPQUFqRCxDQUExQjtBQUNEOztBQUVELGFBQU9sQixNQUFQO0FBQ0Q7Ozs7RUFoQ3FEb0Isa0QiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuXG5pbXBvcnQgZGlzdGFuY2UgZnJvbSAnQHR1cmYvZGlzdGFuY2UnO1xuaW1wb3J0IGVsbGlwc2UgZnJvbSAnQHR1cmYvZWxsaXBzZSc7XG5pbXBvcnQgYmVhcmluZyBmcm9tICdAdHVyZi9iZWFyaW5nJztcbmltcG9ydCB7IHBvaW50IH0gZnJvbSAnQHR1cmYvaGVscGVycyc7XG5pbXBvcnQgdHlwZSB7IFBvaW50ZXJNb3ZlRXZlbnQgfSBmcm9tICcuLi9ldmVudC10eXBlcy5qcyc7XG5pbXBvcnQgdHlwZSB7IEVkaXRBY3Rpb24gfSBmcm9tICcuL21vZGUtaGFuZGxlci5qcyc7XG5pbXBvcnQgeyBUaHJlZUNsaWNrUG9seWdvbkhhbmRsZXIgfSBmcm9tICcuL3RocmVlLWNsaWNrLXBvbHlnb24taGFuZGxlci5qcyc7XG5pbXBvcnQgeyBnZXRJbnRlcm1lZGlhdGVQb3NpdGlvbiB9IGZyb20gJy4vbW9kZS1oYW5kbGVyLmpzJztcblxuZXhwb3J0IGNsYXNzIERyYXdFbGxpcHNlVXNpbmdUaHJlZVBvaW50c0hhbmRsZXIgZXh0ZW5kcyBUaHJlZUNsaWNrUG9seWdvbkhhbmRsZXIge1xuICBoYW5kbGVQb2ludGVyTW92ZShldmVudDogUG9pbnRlck1vdmVFdmVudCk6IHsgZWRpdEFjdGlvbjogP0VkaXRBY3Rpb24sIGNhbmNlbE1hcFBhbjogYm9vbGVhbiB9IHtcbiAgICBjb25zdCByZXN1bHQgPSB7IGVkaXRBY3Rpb246IG51bGwsIGNhbmNlbE1hcFBhbjogZmFsc2UgfTtcbiAgICBjb25zdCBjbGlja1NlcXVlbmNlID0gdGhpcy5nZXRDbGlja1NlcXVlbmNlKCk7XG5cbiAgICBpZiAoY2xpY2tTZXF1ZW5jZS5sZW5ndGggPT09IDApIHtcbiAgICAgIC8vIG5vdGhpbmcgdG8gZG8geWV0XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGNvbnN0IGdyb3VuZENvb3JkcyA9IGV2ZW50Lmdyb3VuZENvb3JkcztcblxuICAgIGlmIChjbGlja1NlcXVlbmNlLmxlbmd0aCA9PT0gMSkge1xuICAgICAgdGhpcy5fc2V0VGVudGF0aXZlRmVhdHVyZSh7XG4gICAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgICAgZ2VvbWV0cnk6IHtcbiAgICAgICAgICB0eXBlOiAnTGluZVN0cmluZycsXG4gICAgICAgICAgY29vcmRpbmF0ZXM6IFtjbGlja1NlcXVlbmNlWzBdLCBncm91bmRDb29yZHNdXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoY2xpY2tTZXF1ZW5jZS5sZW5ndGggPT09IDIpIHtcbiAgICAgIGNvbnN0IFtwMSwgcDJdID0gY2xpY2tTZXF1ZW5jZTtcblxuICAgICAgY29uc3QgY2VudGVyQ29vcmRpbmF0ZXMgPSBnZXRJbnRlcm1lZGlhdGVQb3NpdGlvbihwMSwgcDIpO1xuICAgICAgY29uc3QgeFNlbWlBeGlzID0gTWF0aC5tYXgoZGlzdGFuY2UoY2VudGVyQ29vcmRpbmF0ZXMsIHBvaW50KGdyb3VuZENvb3JkcykpLCAwLjAwMSk7XG4gICAgICBjb25zdCB5U2VtaUF4aXMgPSBNYXRoLm1heChkaXN0YW5jZShwMSwgcDIpLCAwLjAwMSkgLyAyO1xuICAgICAgY29uc3Qgb3B0aW9ucyA9IHsgYW5nbGU6IGJlYXJpbmcocDEsIHAyKSB9O1xuXG4gICAgICB0aGlzLl9zZXRUZW50YXRpdmVGZWF0dXJlKGVsbGlwc2UoY2VudGVyQ29vcmRpbmF0ZXMsIHhTZW1pQXhpcywgeVNlbWlBeGlzLCBvcHRpb25zKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuIl19