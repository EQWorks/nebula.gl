"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DrawCircleFromCenterHandler = void 0;

var _circle = _interopRequireDefault(require("@turf/circle"));

var _distance = _interopRequireDefault(require("@turf/distance"));

var _twoClickPolygonHandler = require("./two-click-polygon-handler.js");

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

var DrawCircleFromCenterHandler =
/*#__PURE__*/
function (_TwoClickPolygonHandl) {
  _inherits(DrawCircleFromCenterHandler, _TwoClickPolygonHandl);

  function DrawCircleFromCenterHandler() {
    _classCallCheck(this, DrawCircleFromCenterHandler);

    return _possibleConstructorReturn(this, _getPrototypeOf(DrawCircleFromCenterHandler).apply(this, arguments));
  }

  _createClass(DrawCircleFromCenterHandler, [{
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

      var centerCoordinates = clickSequence[0];
      var radius = Math.max((0, _distance.default)(centerCoordinates, event.groundCoords), 0.001);

      this._setTentativeFeature((0, _circle.default)(centerCoordinates, radius, options));

      return result;
    }
  }]);

  return DrawCircleFromCenterHandler;
}(_twoClickPolygonHandler.TwoClickPolygonHandler);

exports.DrawCircleFromCenterHandler = DrawCircleFromCenterHandler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL2RyYXctY2lyY2xlLWZyb20tY2VudGVyLWhhbmRsZXIuanMiXSwibmFtZXMiOlsiRHJhd0NpcmNsZUZyb21DZW50ZXJIYW5kbGVyIiwiZXZlbnQiLCJyZXN1bHQiLCJlZGl0QWN0aW9uIiwiY2FuY2VsTWFwUGFuIiwiY2xpY2tTZXF1ZW5jZSIsImdldENsaWNrU2VxdWVuY2UiLCJsZW5ndGgiLCJtb2RlQ29uZmlnIiwiZ2V0TW9kZUNvbmZpZyIsInN0ZXBzIiwib3B0aW9ucyIsImNvbnNvbGUiLCJ3YXJuIiwiY2VudGVyQ29vcmRpbmF0ZXMiLCJyYWRpdXMiLCJNYXRoIiwibWF4IiwiZ3JvdW5kQ29vcmRzIiwiX3NldFRlbnRhdGl2ZUZlYXR1cmUiLCJUd29DbGlja1BvbHlnb25IYW5kbGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBRUE7O0FBQ0E7O0FBR0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFFYUEsMkI7Ozs7Ozs7Ozs7Ozs7c0NBQ09DLEssRUFBNkU7QUFDN0YsVUFBTUMsTUFBTSxHQUFHO0FBQUVDLFFBQUFBLFVBQVUsRUFBRSxJQUFkO0FBQW9CQyxRQUFBQSxZQUFZLEVBQUU7QUFBbEMsT0FBZjtBQUNBLFVBQU1DLGFBQWEsR0FBRyxLQUFLQyxnQkFBTCxFQUF0Qjs7QUFFQSxVQUFJRCxhQUFhLENBQUNFLE1BQWQsS0FBeUIsQ0FBN0IsRUFBZ0M7QUFDOUI7QUFDQSxlQUFPTCxNQUFQO0FBQ0Q7O0FBRUQsVUFBTU0sVUFBVSxHQUFHLEtBQUtDLGFBQUwsTUFBd0IsRUFBM0MsQ0FUNkYsQ0FVN0Y7O0FBVjZGLDhCQVd0RUQsVUFYc0UsQ0FXckZFLEtBWHFGO0FBQUEsVUFXckZBLEtBWHFGLGtDQVc3RSxFQVg2RTtBQVk3RixVQUFNQyxPQUFPLEdBQUc7QUFBRUQsUUFBQUEsS0FBSyxFQUFMQTtBQUFGLE9BQWhCOztBQUVBLFVBQUlBLEtBQUssR0FBRyxDQUFaLEVBQWU7QUFDYkUsUUFBQUEsT0FBTyxDQUFDQyxJQUFSLHlDQURhLENBQ3lDOztBQUN0REYsUUFBQUEsT0FBTyxDQUFDRCxLQUFSLEdBQWdCLENBQWhCO0FBQ0Q7O0FBRUQsVUFBTUksaUJBQWlCLEdBQUdULGFBQWEsQ0FBQyxDQUFELENBQXZDO0FBQ0EsVUFBTVUsTUFBTSxHQUFHQyxJQUFJLENBQUNDLEdBQUwsQ0FBUyx1QkFBU0gsaUJBQVQsRUFBNEJiLEtBQUssQ0FBQ2lCLFlBQWxDLENBQVQsRUFBMEQsS0FBMUQsQ0FBZjs7QUFDQSxXQUFLQyxvQkFBTCxDQUEwQixxQkFBT0wsaUJBQVAsRUFBMEJDLE1BQTFCLEVBQWtDSixPQUFsQyxDQUExQjs7QUFFQSxhQUFPVCxNQUFQO0FBQ0Q7Ozs7RUF6QjhDa0IsOEMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuXG5pbXBvcnQgY2lyY2xlIGZyb20gJ0B0dXJmL2NpcmNsZSc7XG5pbXBvcnQgZGlzdGFuY2UgZnJvbSAnQHR1cmYvZGlzdGFuY2UnO1xuaW1wb3J0IHR5cGUgeyBQb2ludGVyTW92ZUV2ZW50IH0gZnJvbSAnLi4vZXZlbnQtdHlwZXMuanMnO1xuaW1wb3J0IHR5cGUgeyBFZGl0QWN0aW9uIH0gZnJvbSAnLi9tb2RlLWhhbmRsZXIuanMnO1xuaW1wb3J0IHsgVHdvQ2xpY2tQb2x5Z29uSGFuZGxlciB9IGZyb20gJy4vdHdvLWNsaWNrLXBvbHlnb24taGFuZGxlci5qcyc7XG5cbmV4cG9ydCBjbGFzcyBEcmF3Q2lyY2xlRnJvbUNlbnRlckhhbmRsZXIgZXh0ZW5kcyBUd29DbGlja1BvbHlnb25IYW5kbGVyIHtcbiAgaGFuZGxlUG9pbnRlck1vdmUoZXZlbnQ6IFBvaW50ZXJNb3ZlRXZlbnQpOiB7IGVkaXRBY3Rpb246ID9FZGl0QWN0aW9uLCBjYW5jZWxNYXBQYW46IGJvb2xlYW4gfSB7XG4gICAgY29uc3QgcmVzdWx0ID0geyBlZGl0QWN0aW9uOiBudWxsLCBjYW5jZWxNYXBQYW46IGZhbHNlIH07XG4gICAgY29uc3QgY2xpY2tTZXF1ZW5jZSA9IHRoaXMuZ2V0Q2xpY2tTZXF1ZW5jZSgpO1xuXG4gICAgaWYgKGNsaWNrU2VxdWVuY2UubGVuZ3RoID09PSAwKSB7XG4gICAgICAvLyBub3RoaW5nIHRvIGRvIHlldFxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBjb25zdCBtb2RlQ29uZmlnID0gdGhpcy5nZXRNb2RlQ29uZmlnKCkgfHwge307XG4gICAgLy8gRGVmYXVsdCB0dXJmIHZhbHVlIGZvciBjaXJjbGUgaXMgNjRcbiAgICBjb25zdCB7IHN0ZXBzID0gNjQgfSA9IG1vZGVDb25maWc7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHsgc3RlcHMgfTtcblxuICAgIGlmIChzdGVwcyA8IDQpIHtcbiAgICAgIGNvbnNvbGUud2FybihgTWluaW11bSBzdGVwcyB0byBkcmF3IGEgY2lyY2xlIGlzIDQgYCk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZSxuby11bmRlZlxuICAgICAgb3B0aW9ucy5zdGVwcyA9IDQ7XG4gICAgfVxuXG4gICAgY29uc3QgY2VudGVyQ29vcmRpbmF0ZXMgPSBjbGlja1NlcXVlbmNlWzBdO1xuICAgIGNvbnN0IHJhZGl1cyA9IE1hdGgubWF4KGRpc3RhbmNlKGNlbnRlckNvb3JkaW5hdGVzLCBldmVudC5ncm91bmRDb29yZHMpLCAwLjAwMSk7XG4gICAgdGhpcy5fc2V0VGVudGF0aXZlRmVhdHVyZShjaXJjbGUoY2VudGVyQ29vcmRpbmF0ZXMsIHJhZGl1cywgb3B0aW9ucykpO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuIl19