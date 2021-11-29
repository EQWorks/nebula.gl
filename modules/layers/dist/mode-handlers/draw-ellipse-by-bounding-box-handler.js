"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DrawEllipseByBoundingBoxHandler = void 0;

var _bboxPolygon = _interopRequireDefault(require("@turf/bbox-polygon"));

var _distance = _interopRequireDefault(require("@turf/distance"));

var _ellipse = _interopRequireDefault(require("@turf/ellipse"));

var _helpers = require("@turf/helpers");

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

// TODO edit-modes: delete handlers once EditMode fully implemented
var DrawEllipseByBoundingBoxHandler =
/*#__PURE__*/
function (_TwoClickPolygonHandl) {
  _inherits(DrawEllipseByBoundingBoxHandler, _TwoClickPolygonHandl);

  function DrawEllipseByBoundingBoxHandler() {
    _classCallCheck(this, DrawEllipseByBoundingBoxHandler);

    return _possibleConstructorReturn(this, _getPrototypeOf(DrawEllipseByBoundingBoxHandler).apply(this, arguments));
  }

  _createClass(DrawEllipseByBoundingBoxHandler, [{
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

      var corner1 = clickSequence[0];
      var corner2 = event.groundCoords;
      var minX = Math.min(corner1[0], corner2[0]);
      var minY = Math.min(corner1[1], corner2[1]);
      var maxX = Math.max(corner1[0], corner2[0]);
      var maxY = Math.max(corner1[1], corner2[1]);
      var polygonPoints = (0, _bboxPolygon.default)([minX, minY, maxX, maxY]).geometry.coordinates[0];
      var centerCoordinates = (0, _modeHandler.getIntermediatePosition)(corner1, corner2);
      var xSemiAxis = Math.max((0, _distance.default)((0, _helpers.point)(polygonPoints[0]), (0, _helpers.point)(polygonPoints[1])), 0.001);
      var ySemiAxis = Math.max((0, _distance.default)((0, _helpers.point)(polygonPoints[0]), (0, _helpers.point)(polygonPoints[3])), 0.001);

      this._setTentativeFeature((0, _ellipse.default)(centerCoordinates, xSemiAxis, ySemiAxis));

      return result;
    }
  }]);

  return DrawEllipseByBoundingBoxHandler;
}(_twoClickPolygonHandler.TwoClickPolygonHandler);

exports.DrawEllipseByBoundingBoxHandler = DrawEllipseByBoundingBoxHandler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL2RyYXctZWxsaXBzZS1ieS1ib3VuZGluZy1ib3gtaGFuZGxlci5qcyJdLCJuYW1lcyI6WyJEcmF3RWxsaXBzZUJ5Qm91bmRpbmdCb3hIYW5kbGVyIiwiZXZlbnQiLCJyZXN1bHQiLCJlZGl0QWN0aW9uIiwiY2FuY2VsTWFwUGFuIiwiY2xpY2tTZXF1ZW5jZSIsImdldENsaWNrU2VxdWVuY2UiLCJsZW5ndGgiLCJjb3JuZXIxIiwiY29ybmVyMiIsImdyb3VuZENvb3JkcyIsIm1pblgiLCJNYXRoIiwibWluIiwibWluWSIsIm1heFgiLCJtYXgiLCJtYXhZIiwicG9seWdvblBvaW50cyIsImdlb21ldHJ5IiwiY29vcmRpbmF0ZXMiLCJjZW50ZXJDb29yZGluYXRlcyIsInhTZW1pQXhpcyIsInlTZW1pQXhpcyIsIl9zZXRUZW50YXRpdmVGZWF0dXJlIiwiVHdvQ2xpY2tQb2x5Z29uSGFuZGxlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQUdBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7SUFDYUEsK0I7Ozs7Ozs7Ozs7Ozs7c0NBQ09DLEssRUFBNkU7QUFDN0YsVUFBTUMsTUFBTSxHQUFHO0FBQUVDLFFBQUFBLFVBQVUsRUFBRSxJQUFkO0FBQW9CQyxRQUFBQSxZQUFZLEVBQUU7QUFBbEMsT0FBZjtBQUNBLFVBQU1DLGFBQWEsR0FBRyxLQUFLQyxnQkFBTCxFQUF0Qjs7QUFFQSxVQUFJRCxhQUFhLENBQUNFLE1BQWQsS0FBeUIsQ0FBN0IsRUFBZ0M7QUFDOUI7QUFDQSxlQUFPTCxNQUFQO0FBQ0Q7O0FBRUQsVUFBTU0sT0FBTyxHQUFHSCxhQUFhLENBQUMsQ0FBRCxDQUE3QjtBQUNBLFVBQU1JLE9BQU8sR0FBR1IsS0FBSyxDQUFDUyxZQUF0QjtBQUVBLFVBQU1DLElBQUksR0FBR0MsSUFBSSxDQUFDQyxHQUFMLENBQVNMLE9BQU8sQ0FBQyxDQUFELENBQWhCLEVBQXFCQyxPQUFPLENBQUMsQ0FBRCxDQUE1QixDQUFiO0FBQ0EsVUFBTUssSUFBSSxHQUFHRixJQUFJLENBQUNDLEdBQUwsQ0FBU0wsT0FBTyxDQUFDLENBQUQsQ0FBaEIsRUFBcUJDLE9BQU8sQ0FBQyxDQUFELENBQTVCLENBQWI7QUFDQSxVQUFNTSxJQUFJLEdBQUdILElBQUksQ0FBQ0ksR0FBTCxDQUFTUixPQUFPLENBQUMsQ0FBRCxDQUFoQixFQUFxQkMsT0FBTyxDQUFDLENBQUQsQ0FBNUIsQ0FBYjtBQUNBLFVBQU1RLElBQUksR0FBR0wsSUFBSSxDQUFDSSxHQUFMLENBQVNSLE9BQU8sQ0FBQyxDQUFELENBQWhCLEVBQXFCQyxPQUFPLENBQUMsQ0FBRCxDQUE1QixDQUFiO0FBRUEsVUFBTVMsYUFBYSxHQUFHLDBCQUFZLENBQUNQLElBQUQsRUFBT0csSUFBUCxFQUFhQyxJQUFiLEVBQW1CRSxJQUFuQixDQUFaLEVBQXNDRSxRQUF0QyxDQUErQ0MsV0FBL0MsQ0FBMkQsQ0FBM0QsQ0FBdEI7QUFDQSxVQUFNQyxpQkFBaUIsR0FBRywwQ0FBd0JiLE9BQXhCLEVBQWlDQyxPQUFqQyxDQUExQjtBQUVBLFVBQU1hLFNBQVMsR0FBR1YsSUFBSSxDQUFDSSxHQUFMLENBQVMsdUJBQVMsb0JBQU1FLGFBQWEsQ0FBQyxDQUFELENBQW5CLENBQVQsRUFBa0Msb0JBQU1BLGFBQWEsQ0FBQyxDQUFELENBQW5CLENBQWxDLENBQVQsRUFBcUUsS0FBckUsQ0FBbEI7QUFDQSxVQUFNSyxTQUFTLEdBQUdYLElBQUksQ0FBQ0ksR0FBTCxDQUFTLHVCQUFTLG9CQUFNRSxhQUFhLENBQUMsQ0FBRCxDQUFuQixDQUFULEVBQWtDLG9CQUFNQSxhQUFhLENBQUMsQ0FBRCxDQUFuQixDQUFsQyxDQUFULEVBQXFFLEtBQXJFLENBQWxCOztBQUVBLFdBQUtNLG9CQUFMLENBQTBCLHNCQUFRSCxpQkFBUixFQUEyQkMsU0FBM0IsRUFBc0NDLFNBQXRDLENBQTFCOztBQUVBLGFBQU9yQixNQUFQO0FBQ0Q7Ozs7RUEzQmtEdUIsOEMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuXG5pbXBvcnQgYmJveFBvbHlnb24gZnJvbSAnQHR1cmYvYmJveC1wb2x5Z29uJztcbmltcG9ydCBkaXN0YW5jZSBmcm9tICdAdHVyZi9kaXN0YW5jZSc7XG5pbXBvcnQgZWxsaXBzZSBmcm9tICdAdHVyZi9lbGxpcHNlJztcbmltcG9ydCB7IHBvaW50IH0gZnJvbSAnQHR1cmYvaGVscGVycyc7XG5pbXBvcnQgdHlwZSB7IFBvaW50ZXJNb3ZlRXZlbnQgfSBmcm9tICcuLi9ldmVudC10eXBlcy5qcyc7XG5pbXBvcnQgdHlwZSB7IEVkaXRBY3Rpb24gfSBmcm9tICcuL21vZGUtaGFuZGxlci5qcyc7XG5pbXBvcnQgeyBUd29DbGlja1BvbHlnb25IYW5kbGVyIH0gZnJvbSAnLi90d28tY2xpY2stcG9seWdvbi1oYW5kbGVyLmpzJztcbmltcG9ydCB7IGdldEludGVybWVkaWF0ZVBvc2l0aW9uIH0gZnJvbSAnLi9tb2RlLWhhbmRsZXIuanMnO1xuXG4vLyBUT0RPIGVkaXQtbW9kZXM6IGRlbGV0ZSBoYW5kbGVycyBvbmNlIEVkaXRNb2RlIGZ1bGx5IGltcGxlbWVudGVkXG5leHBvcnQgY2xhc3MgRHJhd0VsbGlwc2VCeUJvdW5kaW5nQm94SGFuZGxlciBleHRlbmRzIFR3b0NsaWNrUG9seWdvbkhhbmRsZXIge1xuICBoYW5kbGVQb2ludGVyTW92ZShldmVudDogUG9pbnRlck1vdmVFdmVudCk6IHsgZWRpdEFjdGlvbjogP0VkaXRBY3Rpb24sIGNhbmNlbE1hcFBhbjogYm9vbGVhbiB9IHtcbiAgICBjb25zdCByZXN1bHQgPSB7IGVkaXRBY3Rpb246IG51bGwsIGNhbmNlbE1hcFBhbjogZmFsc2UgfTtcbiAgICBjb25zdCBjbGlja1NlcXVlbmNlID0gdGhpcy5nZXRDbGlja1NlcXVlbmNlKCk7XG5cbiAgICBpZiAoY2xpY2tTZXF1ZW5jZS5sZW5ndGggPT09IDApIHtcbiAgICAgIC8vIG5vdGhpbmcgdG8gZG8geWV0XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGNvbnN0IGNvcm5lcjEgPSBjbGlja1NlcXVlbmNlWzBdO1xuICAgIGNvbnN0IGNvcm5lcjIgPSBldmVudC5ncm91bmRDb29yZHM7XG5cbiAgICBjb25zdCBtaW5YID0gTWF0aC5taW4oY29ybmVyMVswXSwgY29ybmVyMlswXSk7XG4gICAgY29uc3QgbWluWSA9IE1hdGgubWluKGNvcm5lcjFbMV0sIGNvcm5lcjJbMV0pO1xuICAgIGNvbnN0IG1heFggPSBNYXRoLm1heChjb3JuZXIxWzBdLCBjb3JuZXIyWzBdKTtcbiAgICBjb25zdCBtYXhZID0gTWF0aC5tYXgoY29ybmVyMVsxXSwgY29ybmVyMlsxXSk7XG5cbiAgICBjb25zdCBwb2x5Z29uUG9pbnRzID0gYmJveFBvbHlnb24oW21pblgsIG1pblksIG1heFgsIG1heFldKS5nZW9tZXRyeS5jb29yZGluYXRlc1swXTtcbiAgICBjb25zdCBjZW50ZXJDb29yZGluYXRlcyA9IGdldEludGVybWVkaWF0ZVBvc2l0aW9uKGNvcm5lcjEsIGNvcm5lcjIpO1xuXG4gICAgY29uc3QgeFNlbWlBeGlzID0gTWF0aC5tYXgoZGlzdGFuY2UocG9pbnQocG9seWdvblBvaW50c1swXSksIHBvaW50KHBvbHlnb25Qb2ludHNbMV0pKSwgMC4wMDEpO1xuICAgIGNvbnN0IHlTZW1pQXhpcyA9IE1hdGgubWF4KGRpc3RhbmNlKHBvaW50KHBvbHlnb25Qb2ludHNbMF0pLCBwb2ludChwb2x5Z29uUG9pbnRzWzNdKSksIDAuMDAxKTtcblxuICAgIHRoaXMuX3NldFRlbnRhdGl2ZUZlYXR1cmUoZWxsaXBzZShjZW50ZXJDb29yZGluYXRlcywgeFNlbWlBeGlzLCB5U2VtaUF4aXMpKTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cbiJdfQ==