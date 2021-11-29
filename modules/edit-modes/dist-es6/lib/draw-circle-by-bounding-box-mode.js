"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DrawCircleByBoundingBoxMode = void 0;

var _circle = _interopRequireDefault(require("@turf/circle"));

var _distance = _interopRequireDefault(require("@turf/distance"));

var _geojsonEditMode = require("./geojson-edit-mode.js");

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

var DrawCircleByBoundingBoxMode =
/*#__PURE__*/
function (_TwoClickPolygonMode) {
  _inherits(DrawCircleByBoundingBoxMode, _TwoClickPolygonMode);

  function DrawCircleByBoundingBoxMode() {
    _classCallCheck(this, DrawCircleByBoundingBoxMode);

    return _possibleConstructorReturn(this, _getPrototypeOf(DrawCircleByBoundingBoxMode).apply(this, arguments));
  }

  _createClass(DrawCircleByBoundingBoxMode, [{
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

      var firstClickedPoint = clickSequence[0];
      var centerCoordinates = (0, _geojsonEditMode.getIntermediatePosition)(firstClickedPoint, event.mapCoords);
      var radius = Math.max((0, _distance.default)(firstClickedPoint, centerCoordinates), 0.001);

      this._setTentativeFeature((0, _circle.default)(centerCoordinates, radius, options));

      return result;
    }
  }]);

  return DrawCircleByBoundingBoxMode;
}(_twoClickPolygonMode.TwoClickPolygonMode);

exports.DrawCircleByBoundingBoxMode = DrawCircleByBoundingBoxMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvZHJhdy1jaXJjbGUtYnktYm91bmRpbmctYm94LW1vZGUuanMiXSwibmFtZXMiOlsiRHJhd0NpcmNsZUJ5Qm91bmRpbmdCb3hNb2RlIiwiZXZlbnQiLCJwcm9wcyIsInJlc3VsdCIsImVkaXRBY3Rpb24iLCJjYW5jZWxNYXBQYW4iLCJjbGlja1NlcXVlbmNlIiwiZ2V0Q2xpY2tTZXF1ZW5jZSIsImxlbmd0aCIsIm1vZGVDb25maWciLCJzdGVwcyIsIm9wdGlvbnMiLCJjb25zb2xlIiwid2FybiIsImZpcnN0Q2xpY2tlZFBvaW50IiwiY2VudGVyQ29vcmRpbmF0ZXMiLCJtYXBDb29yZHMiLCJyYWRpdXMiLCJNYXRoIiwibWF4IiwiX3NldFRlbnRhdGl2ZUZlYXR1cmUiLCJUd29DbGlja1BvbHlnb25Nb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBRUE7O0FBQ0E7O0FBR0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFFYUEsMkI7Ozs7Ozs7Ozs7Ozs7NkNBRVRDLEssRUFDQUMsSyxFQUMyRDtBQUMzRCxVQUFNQyxNQUFNLEdBQUc7QUFBRUMsUUFBQUEsVUFBVSxFQUFFLElBQWQ7QUFBb0JDLFFBQUFBLFlBQVksRUFBRTtBQUFsQyxPQUFmO0FBQ0EsVUFBTUMsYUFBYSxHQUFHLEtBQUtDLGdCQUFMLEVBQXRCOztBQUVBLFVBQUlELGFBQWEsQ0FBQ0UsTUFBZCxLQUF5QixDQUE3QixFQUFnQztBQUM5QjtBQUNBLGVBQU9MLE1BQVA7QUFDRDs7QUFFRCxVQUFNTSxVQUFVLEdBQUdQLEtBQUssQ0FBQ08sVUFBTixJQUFvQixFQUF2QyxDQVQyRCxDQVUzRDs7QUFWMkQsOEJBV3BDQSxVQVhvQyxDQVduREMsS0FYbUQ7QUFBQSxVQVduREEsS0FYbUQsa0NBVzNDLEVBWDJDO0FBWTNELFVBQU1DLE9BQU8sR0FBRztBQUFFRCxRQUFBQSxLQUFLLEVBQUxBO0FBQUYsT0FBaEI7O0FBRUEsVUFBSUEsS0FBSyxHQUFHLENBQVosRUFBZTtBQUNiRSxRQUFBQSxPQUFPLENBQUNDLElBQVIseUNBRGEsQ0FDeUM7O0FBQ3RERixRQUFBQSxPQUFPLENBQUNELEtBQVIsR0FBZ0IsQ0FBaEI7QUFDRDs7QUFFRCxVQUFNSSxpQkFBaUIsR0FBR1IsYUFBYSxDQUFDLENBQUQsQ0FBdkM7QUFDQSxVQUFNUyxpQkFBaUIsR0FBRyw4Q0FBd0JELGlCQUF4QixFQUEyQ2IsS0FBSyxDQUFDZSxTQUFqRCxDQUExQjtBQUNBLFVBQU1DLE1BQU0sR0FBR0MsSUFBSSxDQUFDQyxHQUFMLENBQVMsdUJBQVNMLGlCQUFULEVBQTRCQyxpQkFBNUIsQ0FBVCxFQUF5RCxLQUF6RCxDQUFmOztBQUNBLFdBQUtLLG9CQUFMLENBQTBCLHFCQUFPTCxpQkFBUCxFQUEwQkUsTUFBMUIsRUFBa0NOLE9BQWxDLENBQTFCOztBQUVBLGFBQU9SLE1BQVA7QUFDRDs7OztFQTdCOENrQix3QyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbmltcG9ydCBjaXJjbGUgZnJvbSAnQHR1cmYvY2lyY2xlJztcbmltcG9ydCBkaXN0YW5jZSBmcm9tICdAdHVyZi9kaXN0YW5jZSc7XG5pbXBvcnQgdHlwZSB7IFBvaW50ZXJNb3ZlRXZlbnQsIE1vZGVQcm9wcyB9IGZyb20gJy4uL3R5cGVzLmpzJztcbmltcG9ydCB0eXBlIHsgRmVhdHVyZUNvbGxlY3Rpb24gfSBmcm9tICcuLi9nZW9qc29uLXR5cGVzLmpzJztcbmltcG9ydCB7IGdldEludGVybWVkaWF0ZVBvc2l0aW9uLCB0eXBlIEdlb0pzb25FZGl0QWN0aW9uIH0gZnJvbSAnLi9nZW9qc29uLWVkaXQtbW9kZS5qcyc7XG5pbXBvcnQgeyBUd29DbGlja1BvbHlnb25Nb2RlIH0gZnJvbSAnLi90d28tY2xpY2stcG9seWdvbi1tb2RlLmpzJztcblxuZXhwb3J0IGNsYXNzIERyYXdDaXJjbGVCeUJvdW5kaW5nQm94TW9kZSBleHRlbmRzIFR3b0NsaWNrUG9seWdvbk1vZGUge1xuICBoYW5kbGVQb2ludGVyTW92ZUFkYXB0ZXIoXG4gICAgZXZlbnQ6IFBvaW50ZXJNb3ZlRXZlbnQsXG4gICAgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj5cbiAgKTogeyBlZGl0QWN0aW9uOiA/R2VvSnNvbkVkaXRBY3Rpb24sIGNhbmNlbE1hcFBhbjogYm9vbGVhbiB9IHtcbiAgICBjb25zdCByZXN1bHQgPSB7IGVkaXRBY3Rpb246IG51bGwsIGNhbmNlbE1hcFBhbjogZmFsc2UgfTtcbiAgICBjb25zdCBjbGlja1NlcXVlbmNlID0gdGhpcy5nZXRDbGlja1NlcXVlbmNlKCk7XG5cbiAgICBpZiAoY2xpY2tTZXF1ZW5jZS5sZW5ndGggPT09IDApIHtcbiAgICAgIC8vIG5vdGhpbmcgdG8gZG8geWV0XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGNvbnN0IG1vZGVDb25maWcgPSBwcm9wcy5tb2RlQ29uZmlnIHx8IHt9O1xuICAgIC8vIERlZmF1bHQgdHVyZiB2YWx1ZSBmb3IgY2lyY2xlIGlzIDY0XG4gICAgY29uc3QgeyBzdGVwcyA9IDY0IH0gPSBtb2RlQ29uZmlnO1xuICAgIGNvbnN0IG9wdGlvbnMgPSB7IHN0ZXBzIH07XG5cbiAgICBpZiAoc3RlcHMgPCA0KSB7XG4gICAgICBjb25zb2xlLndhcm4oYE1pbmltdW0gc3RlcHMgdG8gZHJhdyBhIGNpcmNsZSBpcyA0IGApOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGUsbm8tdW5kZWZcbiAgICAgIG9wdGlvbnMuc3RlcHMgPSA0O1xuICAgIH1cblxuICAgIGNvbnN0IGZpcnN0Q2xpY2tlZFBvaW50ID0gY2xpY2tTZXF1ZW5jZVswXTtcbiAgICBjb25zdCBjZW50ZXJDb29yZGluYXRlcyA9IGdldEludGVybWVkaWF0ZVBvc2l0aW9uKGZpcnN0Q2xpY2tlZFBvaW50LCBldmVudC5tYXBDb29yZHMpO1xuICAgIGNvbnN0IHJhZGl1cyA9IE1hdGgubWF4KGRpc3RhbmNlKGZpcnN0Q2xpY2tlZFBvaW50LCBjZW50ZXJDb29yZGluYXRlcyksIDAuMDAxKTtcbiAgICB0aGlzLl9zZXRUZW50YXRpdmVGZWF0dXJlKGNpcmNsZShjZW50ZXJDb29yZGluYXRlcywgcmFkaXVzLCBvcHRpb25zKSk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG4iXX0=