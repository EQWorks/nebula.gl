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

// TODO edit-modes: delete handlers once EditMode fully implemented
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL2RyYXctZWxsaXBzZS11c2luZy10aHJlZS1wb2ludHMtaGFuZGxlci5qcyJdLCJuYW1lcyI6WyJEcmF3RWxsaXBzZVVzaW5nVGhyZWVQb2ludHNIYW5kbGVyIiwiZXZlbnQiLCJyZXN1bHQiLCJlZGl0QWN0aW9uIiwiY2FuY2VsTWFwUGFuIiwiY2xpY2tTZXF1ZW5jZSIsImdldENsaWNrU2VxdWVuY2UiLCJsZW5ndGgiLCJncm91bmRDb29yZHMiLCJfc2V0VGVudGF0aXZlRmVhdHVyZSIsInR5cGUiLCJnZW9tZXRyeSIsImNvb3JkaW5hdGVzIiwicDEiLCJwMiIsImNlbnRlckNvb3JkaW5hdGVzIiwieFNlbWlBeGlzIiwiTWF0aCIsIm1heCIsInlTZW1pQXhpcyIsIm9wdGlvbnMiLCJhbmdsZSIsIlRocmVlQ2xpY2tQb2x5Z29uSGFuZGxlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQUdBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQTtJQUNhQSxrQzs7Ozs7Ozs7Ozs7OztzQ0FDT0MsSyxFQUE2RTtBQUM3RixVQUFNQyxNQUFNLEdBQUc7QUFBRUMsUUFBQUEsVUFBVSxFQUFFLElBQWQ7QUFBb0JDLFFBQUFBLFlBQVksRUFBRTtBQUFsQyxPQUFmO0FBQ0EsVUFBTUMsYUFBYSxHQUFHLEtBQUtDLGdCQUFMLEVBQXRCOztBQUVBLFVBQUlELGFBQWEsQ0FBQ0UsTUFBZCxLQUF5QixDQUE3QixFQUFnQztBQUM5QjtBQUNBLGVBQU9MLE1BQVA7QUFDRDs7QUFFRCxVQUFNTSxZQUFZLEdBQUdQLEtBQUssQ0FBQ08sWUFBM0I7O0FBRUEsVUFBSUgsYUFBYSxDQUFDRSxNQUFkLEtBQXlCLENBQTdCLEVBQWdDO0FBQzlCLGFBQUtFLG9CQUFMLENBQTBCO0FBQ3hCQyxVQUFBQSxJQUFJLEVBQUUsU0FEa0I7QUFFeEJDLFVBQUFBLFFBQVEsRUFBRTtBQUNSRCxZQUFBQSxJQUFJLEVBQUUsWUFERTtBQUVSRSxZQUFBQSxXQUFXLEVBQUUsQ0FBQ1AsYUFBYSxDQUFDLENBQUQsQ0FBZCxFQUFtQkcsWUFBbkI7QUFGTDtBQUZjLFNBQTFCO0FBT0QsT0FSRCxNQVFPLElBQUlILGFBQWEsQ0FBQ0UsTUFBZCxLQUF5QixDQUE3QixFQUFnQztBQUFBLDRDQUNwQkYsYUFEb0I7QUFBQSxZQUM5QlEsRUFEOEI7QUFBQSxZQUMxQkMsRUFEMEI7O0FBR3JDLFlBQU1DLGlCQUFpQixHQUFHLDBDQUF3QkYsRUFBeEIsRUFBNEJDLEVBQTVCLENBQTFCO0FBQ0EsWUFBTUUsU0FBUyxHQUFHQyxJQUFJLENBQUNDLEdBQUwsQ0FBUyx1QkFBU0gsaUJBQVQsRUFBNEIsb0JBQU1QLFlBQU4sQ0FBNUIsQ0FBVCxFQUEyRCxLQUEzRCxDQUFsQjtBQUNBLFlBQU1XLFNBQVMsR0FBR0YsSUFBSSxDQUFDQyxHQUFMLENBQVMsdUJBQVNMLEVBQVQsRUFBYUMsRUFBYixDQUFULEVBQTJCLEtBQTNCLElBQW9DLENBQXREO0FBQ0EsWUFBTU0sT0FBTyxHQUFHO0FBQUVDLFVBQUFBLEtBQUssRUFBRSxzQkFBUVIsRUFBUixFQUFZQyxFQUFaO0FBQVQsU0FBaEI7O0FBRUEsYUFBS0wsb0JBQUwsQ0FBMEIsc0JBQVFNLGlCQUFSLEVBQTJCQyxTQUEzQixFQUFzQ0csU0FBdEMsRUFBaURDLE9BQWpELENBQTFCO0FBQ0Q7O0FBRUQsYUFBT2xCLE1BQVA7QUFDRDs7OztFQWhDcURvQixrRCIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbmltcG9ydCBkaXN0YW5jZSBmcm9tICdAdHVyZi9kaXN0YW5jZSc7XG5pbXBvcnQgZWxsaXBzZSBmcm9tICdAdHVyZi9lbGxpcHNlJztcbmltcG9ydCBiZWFyaW5nIGZyb20gJ0B0dXJmL2JlYXJpbmcnO1xuaW1wb3J0IHsgcG9pbnQgfSBmcm9tICdAdHVyZi9oZWxwZXJzJztcbmltcG9ydCB0eXBlIHsgUG9pbnRlck1vdmVFdmVudCB9IGZyb20gJy4uL2V2ZW50LXR5cGVzLmpzJztcbmltcG9ydCB0eXBlIHsgRWRpdEFjdGlvbiB9IGZyb20gJy4vbW9kZS1oYW5kbGVyLmpzJztcbmltcG9ydCB7IFRocmVlQ2xpY2tQb2x5Z29uSGFuZGxlciB9IGZyb20gJy4vdGhyZWUtY2xpY2stcG9seWdvbi1oYW5kbGVyLmpzJztcbmltcG9ydCB7IGdldEludGVybWVkaWF0ZVBvc2l0aW9uIH0gZnJvbSAnLi9tb2RlLWhhbmRsZXIuanMnO1xuXG4vLyBUT0RPIGVkaXQtbW9kZXM6IGRlbGV0ZSBoYW5kbGVycyBvbmNlIEVkaXRNb2RlIGZ1bGx5IGltcGxlbWVudGVkXG5leHBvcnQgY2xhc3MgRHJhd0VsbGlwc2VVc2luZ1RocmVlUG9pbnRzSGFuZGxlciBleHRlbmRzIFRocmVlQ2xpY2tQb2x5Z29uSGFuZGxlciB7XG4gIGhhbmRsZVBvaW50ZXJNb3ZlKGV2ZW50OiBQb2ludGVyTW92ZUV2ZW50KTogeyBlZGl0QWN0aW9uOiA/RWRpdEFjdGlvbiwgY2FuY2VsTWFwUGFuOiBib29sZWFuIH0ge1xuICAgIGNvbnN0IHJlc3VsdCA9IHsgZWRpdEFjdGlvbjogbnVsbCwgY2FuY2VsTWFwUGFuOiBmYWxzZSB9O1xuICAgIGNvbnN0IGNsaWNrU2VxdWVuY2UgPSB0aGlzLmdldENsaWNrU2VxdWVuY2UoKTtcblxuICAgIGlmIChjbGlja1NlcXVlbmNlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgLy8gbm90aGluZyB0byBkbyB5ZXRcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgY29uc3QgZ3JvdW5kQ29vcmRzID0gZXZlbnQuZ3JvdW5kQ29vcmRzO1xuXG4gICAgaWYgKGNsaWNrU2VxdWVuY2UubGVuZ3RoID09PSAxKSB7XG4gICAgICB0aGlzLl9zZXRUZW50YXRpdmVGZWF0dXJlKHtcbiAgICAgICAgdHlwZTogJ0ZlYXR1cmUnLFxuICAgICAgICBnZW9tZXRyeToge1xuICAgICAgICAgIHR5cGU6ICdMaW5lU3RyaW5nJyxcbiAgICAgICAgICBjb29yZGluYXRlczogW2NsaWNrU2VxdWVuY2VbMF0sIGdyb3VuZENvb3Jkc11cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChjbGlja1NlcXVlbmNlLmxlbmd0aCA9PT0gMikge1xuICAgICAgY29uc3QgW3AxLCBwMl0gPSBjbGlja1NlcXVlbmNlO1xuXG4gICAgICBjb25zdCBjZW50ZXJDb29yZGluYXRlcyA9IGdldEludGVybWVkaWF0ZVBvc2l0aW9uKHAxLCBwMik7XG4gICAgICBjb25zdCB4U2VtaUF4aXMgPSBNYXRoLm1heChkaXN0YW5jZShjZW50ZXJDb29yZGluYXRlcywgcG9pbnQoZ3JvdW5kQ29vcmRzKSksIDAuMDAxKTtcbiAgICAgIGNvbnN0IHlTZW1pQXhpcyA9IE1hdGgubWF4KGRpc3RhbmNlKHAxLCBwMiksIDAuMDAxKSAvIDI7XG4gICAgICBjb25zdCBvcHRpb25zID0geyBhbmdsZTogYmVhcmluZyhwMSwgcDIpIH07XG5cbiAgICAgIHRoaXMuX3NldFRlbnRhdGl2ZUZlYXR1cmUoZWxsaXBzZShjZW50ZXJDb29yZGluYXRlcywgeFNlbWlBeGlzLCB5U2VtaUF4aXMsIG9wdGlvbnMpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG4iXX0=