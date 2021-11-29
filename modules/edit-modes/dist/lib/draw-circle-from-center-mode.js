"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DrawCircleFromCenterMode = void 0;

var _circle = _interopRequireDefault(require("@turf/circle"));

var _distance = _interopRequireDefault(require("@turf/distance"));

var _twoClickPolygonMode = require("./two-click-polygon-mode.js");

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

var DrawCircleFromCenterMode =
/*#__PURE__*/
function (_TwoClickPolygonMode) {
  _inherits(DrawCircleFromCenterMode, _TwoClickPolygonMode);

  function DrawCircleFromCenterMode() {
    _classCallCheck(this, DrawCircleFromCenterMode);

    return _possibleConstructorReturn(this, _getPrototypeOf(DrawCircleFromCenterMode).apply(this, arguments));
  }

  _createClass(DrawCircleFromCenterMode, [{
    key: "handlePointerMoveAdapter",
    value: function handlePointerMoveAdapter(event, props) {
      var result = {
        editAction: null,
        cancelMapPan: false
      };
      var clickSequence = this.getClickSequence();

      if (clickSequence.length === 0) {
        // nothing to do yet
        return result;
      }

      var modeConfig = props.modeConfig || {}; // Default turf value for circle is 64

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
      var radius = Math.max((0, _distance.default)(centerCoordinates, event.mapCoords), 0.001);

      this._setTentativeFeature((0, _circle.default)(centerCoordinates, radius, options));

      return result;
    }
  }]);

  return DrawCircleFromCenterMode;
}(_twoClickPolygonMode.TwoClickPolygonMode);

exports.DrawCircleFromCenterMode = DrawCircleFromCenterMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvZHJhdy1jaXJjbGUtZnJvbS1jZW50ZXItbW9kZS5qcyJdLCJuYW1lcyI6WyJEcmF3Q2lyY2xlRnJvbUNlbnRlck1vZGUiLCJldmVudCIsInByb3BzIiwicmVzdWx0IiwiZWRpdEFjdGlvbiIsImNhbmNlbE1hcFBhbiIsImNsaWNrU2VxdWVuY2UiLCJnZXRDbGlja1NlcXVlbmNlIiwibGVuZ3RoIiwibW9kZUNvbmZpZyIsInN0ZXBzIiwib3B0aW9ucyIsImNvbnNvbGUiLCJ3YXJuIiwiY2VudGVyQ29vcmRpbmF0ZXMiLCJyYWRpdXMiLCJNYXRoIiwibWF4IiwibWFwQ29vcmRzIiwiX3NldFRlbnRhdGl2ZUZlYXR1cmUiLCJUd29DbGlja1BvbHlnb25Nb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBRUE7O0FBQ0E7O0FBSUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFFYUEsd0I7Ozs7Ozs7Ozs7Ozs7NkNBRVRDLEssRUFDQUMsSyxFQUMyRDtBQUMzRCxVQUFNQyxNQUFNLEdBQUc7QUFBRUMsUUFBQUEsVUFBVSxFQUFFLElBQWQ7QUFBb0JDLFFBQUFBLFlBQVksRUFBRTtBQUFsQyxPQUFmO0FBQ0EsVUFBTUMsYUFBYSxHQUFHLEtBQUtDLGdCQUFMLEVBQXRCOztBQUVBLFVBQUlELGFBQWEsQ0FBQ0UsTUFBZCxLQUF5QixDQUE3QixFQUFnQztBQUM5QjtBQUNBLGVBQU9MLE1BQVA7QUFDRDs7QUFFRCxVQUFNTSxVQUFVLEdBQUdQLEtBQUssQ0FBQ08sVUFBTixJQUFvQixFQUF2QyxDQVQyRCxDQVUzRDs7QUFWMkQsOEJBV3BDQSxVQVhvQyxDQVduREMsS0FYbUQ7QUFBQSxVQVduREEsS0FYbUQsa0NBVzNDLEVBWDJDO0FBWTNELFVBQU1DLE9BQU8sR0FBRztBQUFFRCxRQUFBQSxLQUFLLEVBQUxBO0FBQUYsT0FBaEI7O0FBRUEsVUFBSUEsS0FBSyxHQUFHLENBQVosRUFBZTtBQUNiRSxRQUFBQSxPQUFPLENBQUNDLElBQVIseUNBRGEsQ0FDeUM7O0FBQ3RERixRQUFBQSxPQUFPLENBQUNELEtBQVIsR0FBZ0IsQ0FBaEI7QUFDRDs7QUFFRCxVQUFNSSxpQkFBaUIsR0FBR1IsYUFBYSxDQUFDLENBQUQsQ0FBdkM7QUFDQSxVQUFNUyxNQUFNLEdBQUdDLElBQUksQ0FBQ0MsR0FBTCxDQUFTLHVCQUFTSCxpQkFBVCxFQUE0QmIsS0FBSyxDQUFDaUIsU0FBbEMsQ0FBVCxFQUF1RCxLQUF2RCxDQUFmOztBQUNBLFdBQUtDLG9CQUFMLENBQTBCLHFCQUFPTCxpQkFBUCxFQUEwQkMsTUFBMUIsRUFBa0NKLE9BQWxDLENBQTFCOztBQUVBLGFBQU9SLE1BQVA7QUFDRDs7OztFQTVCMkNpQix3QyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbmltcG9ydCBjaXJjbGUgZnJvbSAnQHR1cmYvY2lyY2xlJztcbmltcG9ydCBkaXN0YW5jZSBmcm9tICdAdHVyZi9kaXN0YW5jZSc7XG5pbXBvcnQgdHlwZSB7IFBvaW50ZXJNb3ZlRXZlbnQsIE1vZGVQcm9wcyB9IGZyb20gJy4uL3R5cGVzLmpzJztcbmltcG9ydCB7IHR5cGUgRmVhdHVyZUNvbGxlY3Rpb24gfSBmcm9tICcuLi9nZW9qc29uLXR5cGVzLmpzJztcbmltcG9ydCB7IHR5cGUgR2VvSnNvbkVkaXRBY3Rpb24gfSBmcm9tICcuL2dlb2pzb24tZWRpdC1tb2RlLmpzJztcbmltcG9ydCB7IFR3b0NsaWNrUG9seWdvbk1vZGUgfSBmcm9tICcuL3R3by1jbGljay1wb2x5Z29uLW1vZGUuanMnO1xuXG5leHBvcnQgY2xhc3MgRHJhd0NpcmNsZUZyb21DZW50ZXJNb2RlIGV4dGVuZHMgVHdvQ2xpY2tQb2x5Z29uTW9kZSB7XG4gIGhhbmRsZVBvaW50ZXJNb3ZlQWRhcHRlcihcbiAgICBldmVudDogUG9pbnRlck1vdmVFdmVudCxcbiAgICBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPlxuICApOiB7IGVkaXRBY3Rpb246ID9HZW9Kc29uRWRpdEFjdGlvbiwgY2FuY2VsTWFwUGFuOiBib29sZWFuIH0ge1xuICAgIGNvbnN0IHJlc3VsdCA9IHsgZWRpdEFjdGlvbjogbnVsbCwgY2FuY2VsTWFwUGFuOiBmYWxzZSB9O1xuICAgIGNvbnN0IGNsaWNrU2VxdWVuY2UgPSB0aGlzLmdldENsaWNrU2VxdWVuY2UoKTtcblxuICAgIGlmIChjbGlja1NlcXVlbmNlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgLy8gbm90aGluZyB0byBkbyB5ZXRcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgY29uc3QgbW9kZUNvbmZpZyA9IHByb3BzLm1vZGVDb25maWcgfHwge307XG4gICAgLy8gRGVmYXVsdCB0dXJmIHZhbHVlIGZvciBjaXJjbGUgaXMgNjRcbiAgICBjb25zdCB7IHN0ZXBzID0gNjQgfSA9IG1vZGVDb25maWc7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHsgc3RlcHMgfTtcblxuICAgIGlmIChzdGVwcyA8IDQpIHtcbiAgICAgIGNvbnNvbGUud2FybihgTWluaW11bSBzdGVwcyB0byBkcmF3IGEgY2lyY2xlIGlzIDQgYCk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZSxuby11bmRlZlxuICAgICAgb3B0aW9ucy5zdGVwcyA9IDQ7XG4gICAgfVxuXG4gICAgY29uc3QgY2VudGVyQ29vcmRpbmF0ZXMgPSBjbGlja1NlcXVlbmNlWzBdO1xuICAgIGNvbnN0IHJhZGl1cyA9IE1hdGgubWF4KGRpc3RhbmNlKGNlbnRlckNvb3JkaW5hdGVzLCBldmVudC5tYXBDb29yZHMpLCAwLjAwMSk7XG4gICAgdGhpcy5fc2V0VGVudGF0aXZlRmVhdHVyZShjaXJjbGUoY2VudGVyQ29vcmRpbmF0ZXMsIHJhZGl1cywgb3B0aW9ucykpO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuIl19