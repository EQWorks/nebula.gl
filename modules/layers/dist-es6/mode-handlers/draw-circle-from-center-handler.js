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

// TODO edit-modes: delete handlers once EditMode fully implemented
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL2RyYXctY2lyY2xlLWZyb20tY2VudGVyLWhhbmRsZXIuanMiXSwibmFtZXMiOlsiRHJhd0NpcmNsZUZyb21DZW50ZXJIYW5kbGVyIiwiZXZlbnQiLCJyZXN1bHQiLCJlZGl0QWN0aW9uIiwiY2FuY2VsTWFwUGFuIiwiY2xpY2tTZXF1ZW5jZSIsImdldENsaWNrU2VxdWVuY2UiLCJsZW5ndGgiLCJtb2RlQ29uZmlnIiwiZ2V0TW9kZUNvbmZpZyIsInN0ZXBzIiwib3B0aW9ucyIsImNvbnNvbGUiLCJ3YXJuIiwiY2VudGVyQ29vcmRpbmF0ZXMiLCJyYWRpdXMiLCJNYXRoIiwibWF4IiwiZ3JvdW5kQ29vcmRzIiwiX3NldFRlbnRhdGl2ZUZlYXR1cmUiLCJUd29DbGlja1BvbHlnb25IYW5kbGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBRUE7O0FBQ0E7O0FBR0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQTtJQUNhQSwyQjs7Ozs7Ozs7Ozs7OztzQ0FDT0MsSyxFQUE2RTtBQUM3RixVQUFNQyxNQUFNLEdBQUc7QUFBRUMsUUFBQUEsVUFBVSxFQUFFLElBQWQ7QUFBb0JDLFFBQUFBLFlBQVksRUFBRTtBQUFsQyxPQUFmO0FBQ0EsVUFBTUMsYUFBYSxHQUFHLEtBQUtDLGdCQUFMLEVBQXRCOztBQUVBLFVBQUlELGFBQWEsQ0FBQ0UsTUFBZCxLQUF5QixDQUE3QixFQUFnQztBQUM5QjtBQUNBLGVBQU9MLE1BQVA7QUFDRDs7QUFFRCxVQUFNTSxVQUFVLEdBQUcsS0FBS0MsYUFBTCxNQUF3QixFQUEzQyxDQVQ2RixDQVU3Rjs7QUFWNkYsOEJBV3RFRCxVQVhzRSxDQVdyRkUsS0FYcUY7QUFBQSxVQVdyRkEsS0FYcUYsa0NBVzdFLEVBWDZFO0FBWTdGLFVBQU1DLE9BQU8sR0FBRztBQUFFRCxRQUFBQSxLQUFLLEVBQUxBO0FBQUYsT0FBaEI7O0FBRUEsVUFBSUEsS0FBSyxHQUFHLENBQVosRUFBZTtBQUNiRSxRQUFBQSxPQUFPLENBQUNDLElBQVIseUNBRGEsQ0FDeUM7O0FBQ3RERixRQUFBQSxPQUFPLENBQUNELEtBQVIsR0FBZ0IsQ0FBaEI7QUFDRDs7QUFFRCxVQUFNSSxpQkFBaUIsR0FBR1QsYUFBYSxDQUFDLENBQUQsQ0FBdkM7QUFDQSxVQUFNVSxNQUFNLEdBQUdDLElBQUksQ0FBQ0MsR0FBTCxDQUFTLHVCQUFTSCxpQkFBVCxFQUE0QmIsS0FBSyxDQUFDaUIsWUFBbEMsQ0FBVCxFQUEwRCxLQUExRCxDQUFmOztBQUNBLFdBQUtDLG9CQUFMLENBQTBCLHFCQUFPTCxpQkFBUCxFQUEwQkMsTUFBMUIsRUFBa0NKLE9BQWxDLENBQTFCOztBQUVBLGFBQU9ULE1BQVA7QUFDRDs7OztFQXpCOENrQiw4QyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbmltcG9ydCBjaXJjbGUgZnJvbSAnQHR1cmYvY2lyY2xlJztcbmltcG9ydCBkaXN0YW5jZSBmcm9tICdAdHVyZi9kaXN0YW5jZSc7XG5pbXBvcnQgdHlwZSB7IFBvaW50ZXJNb3ZlRXZlbnQgfSBmcm9tICcuLi9ldmVudC10eXBlcy5qcyc7XG5pbXBvcnQgdHlwZSB7IEVkaXRBY3Rpb24gfSBmcm9tICcuL21vZGUtaGFuZGxlci5qcyc7XG5pbXBvcnQgeyBUd29DbGlja1BvbHlnb25IYW5kbGVyIH0gZnJvbSAnLi90d28tY2xpY2stcG9seWdvbi1oYW5kbGVyLmpzJztcblxuLy8gVE9ETyBlZGl0LW1vZGVzOiBkZWxldGUgaGFuZGxlcnMgb25jZSBFZGl0TW9kZSBmdWxseSBpbXBsZW1lbnRlZFxuZXhwb3J0IGNsYXNzIERyYXdDaXJjbGVGcm9tQ2VudGVySGFuZGxlciBleHRlbmRzIFR3b0NsaWNrUG9seWdvbkhhbmRsZXIge1xuICBoYW5kbGVQb2ludGVyTW92ZShldmVudDogUG9pbnRlck1vdmVFdmVudCk6IHsgZWRpdEFjdGlvbjogP0VkaXRBY3Rpb24sIGNhbmNlbE1hcFBhbjogYm9vbGVhbiB9IHtcbiAgICBjb25zdCByZXN1bHQgPSB7IGVkaXRBY3Rpb246IG51bGwsIGNhbmNlbE1hcFBhbjogZmFsc2UgfTtcbiAgICBjb25zdCBjbGlja1NlcXVlbmNlID0gdGhpcy5nZXRDbGlja1NlcXVlbmNlKCk7XG5cbiAgICBpZiAoY2xpY2tTZXF1ZW5jZS5sZW5ndGggPT09IDApIHtcbiAgICAgIC8vIG5vdGhpbmcgdG8gZG8geWV0XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGNvbnN0IG1vZGVDb25maWcgPSB0aGlzLmdldE1vZGVDb25maWcoKSB8fCB7fTtcbiAgICAvLyBEZWZhdWx0IHR1cmYgdmFsdWUgZm9yIGNpcmNsZSBpcyA2NFxuICAgIGNvbnN0IHsgc3RlcHMgPSA2NCB9ID0gbW9kZUNvbmZpZztcbiAgICBjb25zdCBvcHRpb25zID0geyBzdGVwcyB9O1xuXG4gICAgaWYgKHN0ZXBzIDwgNCkge1xuICAgICAgY29uc29sZS53YXJuKGBNaW5pbXVtIHN0ZXBzIHRvIGRyYXcgYSBjaXJjbGUgaXMgNCBgKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlLG5vLXVuZGVmXG4gICAgICBvcHRpb25zLnN0ZXBzID0gNDtcbiAgICB9XG5cbiAgICBjb25zdCBjZW50ZXJDb29yZGluYXRlcyA9IGNsaWNrU2VxdWVuY2VbMF07XG4gICAgY29uc3QgcmFkaXVzID0gTWF0aC5tYXgoZGlzdGFuY2UoY2VudGVyQ29vcmRpbmF0ZXMsIGV2ZW50Lmdyb3VuZENvb3JkcyksIDAuMDAxKTtcbiAgICB0aGlzLl9zZXRUZW50YXRpdmVGZWF0dXJlKGNpcmNsZShjZW50ZXJDb29yZGluYXRlcywgcmFkaXVzLCBvcHRpb25zKSk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG4iXX0=