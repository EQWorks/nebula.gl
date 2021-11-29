"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DrawCircleByBoundingBoxHandler = void 0;

var _circle = _interopRequireDefault(require("@turf/circle"));

var _distance = _interopRequireDefault(require("@turf/distance"));

var _twoClickPolygonHandler = require("./two-click-polygon-handler.js");

var _modeHandler = require("./mode-handler.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var DrawCircleByBoundingBoxHandler =
/*#__PURE__*/
function (_TwoClickPolygonHandl) {
  _inherits(DrawCircleByBoundingBoxHandler, _TwoClickPolygonHandl);

  function DrawCircleByBoundingBoxHandler() {
    _classCallCheck(this, DrawCircleByBoundingBoxHandler);

    return _possibleConstructorReturn(this, _getPrototypeOf(DrawCircleByBoundingBoxHandler).apply(this, arguments));
  }

  _createClass(DrawCircleByBoundingBoxHandler, [{
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

      var modeConfig = this.getModeConfig() || {}; // Default turf value for circle is 64

      var _modeConfig$steps = modeConfig.steps,
          steps = _modeConfig$steps === void 0 ? 64 : _modeConfig$steps;
      var options = {
        steps: steps
      };

      if (steps < 4) {
        console.warn("Minimum steps to draw a circle is 4 "); // eslint-disable-line no-console,no-undef

        options.steps = 4;
      }

      var firstClickedPoint = clickSequence[0];
      var centerCoordinates = (0, _modeHandler.getIntermediatePosition)(firstClickedPoint, event.groundCoords);
      var radius = Math.max((0, _distance.default)(firstClickedPoint, centerCoordinates), 0.001);

      this._setTentativeFeature((0, _circle.default)(centerCoordinates, radius, options));

      return result;
    }
  }]);

  return DrawCircleByBoundingBoxHandler;
}(_twoClickPolygonHandler.TwoClickPolygonHandler);

exports.DrawCircleByBoundingBoxHandler = DrawCircleByBoundingBoxHandler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL2RyYXctY2lyY2xlLWJ5LWJvdW5kaW5nLWJveC1oYW5kbGVyLmpzIl0sIm5hbWVzIjpbIkRyYXdDaXJjbGVCeUJvdW5kaW5nQm94SGFuZGxlciIsImV2ZW50IiwicmVzdWx0IiwiZWRpdEFjdGlvbiIsImNhbmNlbE1hcFBhbiIsImNsaWNrU2VxdWVuY2UiLCJnZXRDbGlja1NlcXVlbmNlIiwibGVuZ3RoIiwibW9kZUNvbmZpZyIsImdldE1vZGVDb25maWciLCJzdGVwcyIsIm9wdGlvbnMiLCJjb25zb2xlIiwid2FybiIsImZpcnN0Q2xpY2tlZFBvaW50IiwiY2VudGVyQ29vcmRpbmF0ZXMiLCJncm91bmRDb29yZHMiLCJyYWRpdXMiLCJNYXRoIiwibWF4IiwiX3NldFRlbnRhdGl2ZUZlYXR1cmUiLCJUd29DbGlja1BvbHlnb25IYW5kbGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBRUE7O0FBQ0E7O0FBR0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFFYUEsOEI7Ozs7Ozs7Ozs7Ozs7c0NBQ09DLEssRUFBNkU7QUFDN0YsVUFBTUMsTUFBTSxHQUFHO0FBQUVDLFFBQUFBLFVBQVUsRUFBRSxJQUFkO0FBQW9CQyxRQUFBQSxZQUFZLEVBQUU7QUFBbEMsT0FBZjtBQUNBLFVBQU1DLGFBQWEsR0FBRyxLQUFLQyxnQkFBTCxFQUF0Qjs7QUFFQSxVQUFJRCxhQUFhLENBQUNFLE1BQWQsS0FBeUIsQ0FBN0IsRUFBZ0M7QUFDOUI7QUFDQSxlQUFPTCxNQUFQO0FBQ0Q7O0FBRUQsVUFBTU0sVUFBVSxHQUFHLEtBQUtDLGFBQUwsTUFBd0IsRUFBM0MsQ0FUNkYsQ0FVN0Y7O0FBVjZGLDhCQVd0RUQsVUFYc0UsQ0FXckZFLEtBWHFGO0FBQUEsVUFXckZBLEtBWHFGLGtDQVc3RSxFQVg2RTtBQVk3RixVQUFNQyxPQUFPLEdBQUc7QUFBRUQsUUFBQUEsS0FBSyxFQUFMQTtBQUFGLE9BQWhCOztBQUVBLFVBQUlBLEtBQUssR0FBRyxDQUFaLEVBQWU7QUFDYkUsUUFBQUEsT0FBTyxDQUFDQyxJQUFSLHlDQURhLENBQ3lDOztBQUN0REYsUUFBQUEsT0FBTyxDQUFDRCxLQUFSLEdBQWdCLENBQWhCO0FBQ0Q7O0FBRUQsVUFBTUksaUJBQWlCLEdBQUdULGFBQWEsQ0FBQyxDQUFELENBQXZDO0FBQ0EsVUFBTVUsaUJBQWlCLEdBQUcsMENBQXdCRCxpQkFBeEIsRUFBMkNiLEtBQUssQ0FBQ2UsWUFBakQsQ0FBMUI7QUFDQSxVQUFNQyxNQUFNLEdBQUdDLElBQUksQ0FBQ0MsR0FBTCxDQUFTLHVCQUFTTCxpQkFBVCxFQUE0QkMsaUJBQTVCLENBQVQsRUFBeUQsS0FBekQsQ0FBZjs7QUFDQSxXQUFLSyxvQkFBTCxDQUEwQixxQkFBT0wsaUJBQVAsRUFBMEJFLE1BQTFCLEVBQWtDTixPQUFsQyxDQUExQjs7QUFFQSxhQUFPVCxNQUFQO0FBQ0Q7Ozs7RUExQmlEbUIsOEMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuXG5pbXBvcnQgY2lyY2xlIGZyb20gJ0B0dXJmL2NpcmNsZSc7XG5pbXBvcnQgZGlzdGFuY2UgZnJvbSAnQHR1cmYvZGlzdGFuY2UnO1xuaW1wb3J0IHR5cGUgeyBQb2ludGVyTW92ZUV2ZW50IH0gZnJvbSAnLi4vZXZlbnQtdHlwZXMuanMnO1xuaW1wb3J0IHR5cGUgeyBFZGl0QWN0aW9uIH0gZnJvbSAnLi9tb2RlLWhhbmRsZXIuanMnO1xuaW1wb3J0IHsgVHdvQ2xpY2tQb2x5Z29uSGFuZGxlciB9IGZyb20gJy4vdHdvLWNsaWNrLXBvbHlnb24taGFuZGxlci5qcyc7XG5pbXBvcnQgeyBnZXRJbnRlcm1lZGlhdGVQb3NpdGlvbiB9IGZyb20gJy4vbW9kZS1oYW5kbGVyLmpzJztcblxuZXhwb3J0IGNsYXNzIERyYXdDaXJjbGVCeUJvdW5kaW5nQm94SGFuZGxlciBleHRlbmRzIFR3b0NsaWNrUG9seWdvbkhhbmRsZXIge1xuICBoYW5kbGVQb2ludGVyTW92ZShldmVudDogUG9pbnRlck1vdmVFdmVudCk6IHsgZWRpdEFjdGlvbjogP0VkaXRBY3Rpb24sIGNhbmNlbE1hcFBhbjogYm9vbGVhbiB9IHtcbiAgICBjb25zdCByZXN1bHQgPSB7IGVkaXRBY3Rpb246IG51bGwsIGNhbmNlbE1hcFBhbjogZmFsc2UgfTtcbiAgICBjb25zdCBjbGlja1NlcXVlbmNlID0gdGhpcy5nZXRDbGlja1NlcXVlbmNlKCk7XG5cbiAgICBpZiAoY2xpY2tTZXF1ZW5jZS5sZW5ndGggPT09IDApIHtcbiAgICAgIC8vIG5vdGhpbmcgdG8gZG8geWV0XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGNvbnN0IG1vZGVDb25maWcgPSB0aGlzLmdldE1vZGVDb25maWcoKSB8fCB7fTtcbiAgICAvLyBEZWZhdWx0IHR1cmYgdmFsdWUgZm9yIGNpcmNsZSBpcyA2NFxuICAgIGNvbnN0IHsgc3RlcHMgPSA2NCB9ID0gbW9kZUNvbmZpZztcbiAgICBjb25zdCBvcHRpb25zID0geyBzdGVwcyB9O1xuXG4gICAgaWYgKHN0ZXBzIDwgNCkge1xuICAgICAgY29uc29sZS53YXJuKGBNaW5pbXVtIHN0ZXBzIHRvIGRyYXcgYSBjaXJjbGUgaXMgNCBgKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlLG5vLXVuZGVmXG4gICAgICBvcHRpb25zLnN0ZXBzID0gNDtcbiAgICB9XG5cbiAgICBjb25zdCBmaXJzdENsaWNrZWRQb2ludCA9IGNsaWNrU2VxdWVuY2VbMF07XG4gICAgY29uc3QgY2VudGVyQ29vcmRpbmF0ZXMgPSBnZXRJbnRlcm1lZGlhdGVQb3NpdGlvbihmaXJzdENsaWNrZWRQb2ludCwgZXZlbnQuZ3JvdW5kQ29vcmRzKTtcbiAgICBjb25zdCByYWRpdXMgPSBNYXRoLm1heChkaXN0YW5jZShmaXJzdENsaWNrZWRQb2ludCwgY2VudGVyQ29vcmRpbmF0ZXMpLCAwLjAwMSk7XG4gICAgdGhpcy5fc2V0VGVudGF0aXZlRmVhdHVyZShjaXJjbGUoY2VudGVyQ29vcmRpbmF0ZXMsIHJhZGl1cywgb3B0aW9ucykpO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuIl19