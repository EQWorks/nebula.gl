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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL2RyYXctZWxsaXBzZS1ieS1ib3VuZGluZy1ib3gtaGFuZGxlci5qcyJdLCJuYW1lcyI6WyJEcmF3RWxsaXBzZUJ5Qm91bmRpbmdCb3hIYW5kbGVyIiwiZXZlbnQiLCJyZXN1bHQiLCJlZGl0QWN0aW9uIiwiY2FuY2VsTWFwUGFuIiwiY2xpY2tTZXF1ZW5jZSIsImdldENsaWNrU2VxdWVuY2UiLCJsZW5ndGgiLCJjb3JuZXIxIiwiY29ybmVyMiIsImdyb3VuZENvb3JkcyIsIm1pblgiLCJNYXRoIiwibWluIiwibWluWSIsIm1heFgiLCJtYXgiLCJtYXhZIiwicG9seWdvblBvaW50cyIsImdlb21ldHJ5IiwiY29vcmRpbmF0ZXMiLCJjZW50ZXJDb29yZGluYXRlcyIsInhTZW1pQXhpcyIsInlTZW1pQXhpcyIsIl9zZXRUZW50YXRpdmVGZWF0dXJlIiwiVHdvQ2xpY2tQb2x5Z29uSGFuZGxlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQUdBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBRWFBLCtCOzs7Ozs7Ozs7Ozs7O3NDQUNPQyxLLEVBQTZFO0FBQzdGLFVBQU1DLE1BQU0sR0FBRztBQUFFQyxRQUFBQSxVQUFVLEVBQUUsSUFBZDtBQUFvQkMsUUFBQUEsWUFBWSxFQUFFO0FBQWxDLE9BQWY7QUFDQSxVQUFNQyxhQUFhLEdBQUcsS0FBS0MsZ0JBQUwsRUFBdEI7O0FBRUEsVUFBSUQsYUFBYSxDQUFDRSxNQUFkLEtBQXlCLENBQTdCLEVBQWdDO0FBQzlCO0FBQ0EsZUFBT0wsTUFBUDtBQUNEOztBQUVELFVBQU1NLE9BQU8sR0FBR0gsYUFBYSxDQUFDLENBQUQsQ0FBN0I7QUFDQSxVQUFNSSxPQUFPLEdBQUdSLEtBQUssQ0FBQ1MsWUFBdEI7QUFFQSxVQUFNQyxJQUFJLEdBQUdDLElBQUksQ0FBQ0MsR0FBTCxDQUFTTCxPQUFPLENBQUMsQ0FBRCxDQUFoQixFQUFxQkMsT0FBTyxDQUFDLENBQUQsQ0FBNUIsQ0FBYjtBQUNBLFVBQU1LLElBQUksR0FBR0YsSUFBSSxDQUFDQyxHQUFMLENBQVNMLE9BQU8sQ0FBQyxDQUFELENBQWhCLEVBQXFCQyxPQUFPLENBQUMsQ0FBRCxDQUE1QixDQUFiO0FBQ0EsVUFBTU0sSUFBSSxHQUFHSCxJQUFJLENBQUNJLEdBQUwsQ0FBU1IsT0FBTyxDQUFDLENBQUQsQ0FBaEIsRUFBcUJDLE9BQU8sQ0FBQyxDQUFELENBQTVCLENBQWI7QUFDQSxVQUFNUSxJQUFJLEdBQUdMLElBQUksQ0FBQ0ksR0FBTCxDQUFTUixPQUFPLENBQUMsQ0FBRCxDQUFoQixFQUFxQkMsT0FBTyxDQUFDLENBQUQsQ0FBNUIsQ0FBYjtBQUVBLFVBQU1TLGFBQWEsR0FBRywwQkFBWSxDQUFDUCxJQUFELEVBQU9HLElBQVAsRUFBYUMsSUFBYixFQUFtQkUsSUFBbkIsQ0FBWixFQUFzQ0UsUUFBdEMsQ0FBK0NDLFdBQS9DLENBQTJELENBQTNELENBQXRCO0FBQ0EsVUFBTUMsaUJBQWlCLEdBQUcsMENBQXdCYixPQUF4QixFQUFpQ0MsT0FBakMsQ0FBMUI7QUFFQSxVQUFNYSxTQUFTLEdBQUdWLElBQUksQ0FBQ0ksR0FBTCxDQUFTLHVCQUFTLG9CQUFNRSxhQUFhLENBQUMsQ0FBRCxDQUFuQixDQUFULEVBQWtDLG9CQUFNQSxhQUFhLENBQUMsQ0FBRCxDQUFuQixDQUFsQyxDQUFULEVBQXFFLEtBQXJFLENBQWxCO0FBQ0EsVUFBTUssU0FBUyxHQUFHWCxJQUFJLENBQUNJLEdBQUwsQ0FBUyx1QkFBUyxvQkFBTUUsYUFBYSxDQUFDLENBQUQsQ0FBbkIsQ0FBVCxFQUFrQyxvQkFBTUEsYUFBYSxDQUFDLENBQUQsQ0FBbkIsQ0FBbEMsQ0FBVCxFQUFxRSxLQUFyRSxDQUFsQjs7QUFFQSxXQUFLTSxvQkFBTCxDQUEwQixzQkFBUUgsaUJBQVIsRUFBMkJDLFNBQTNCLEVBQXNDQyxTQUF0QyxDQUExQjs7QUFFQSxhQUFPckIsTUFBUDtBQUNEOzs7O0VBM0JrRHVCLDhDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuaW1wb3J0IGJib3hQb2x5Z29uIGZyb20gJ0B0dXJmL2Jib3gtcG9seWdvbic7XG5pbXBvcnQgZGlzdGFuY2UgZnJvbSAnQHR1cmYvZGlzdGFuY2UnO1xuaW1wb3J0IGVsbGlwc2UgZnJvbSAnQHR1cmYvZWxsaXBzZSc7XG5pbXBvcnQgeyBwb2ludCB9IGZyb20gJ0B0dXJmL2hlbHBlcnMnO1xuaW1wb3J0IHR5cGUgeyBQb2ludGVyTW92ZUV2ZW50IH0gZnJvbSAnLi4vZXZlbnQtdHlwZXMuanMnO1xuaW1wb3J0IHR5cGUgeyBFZGl0QWN0aW9uIH0gZnJvbSAnLi9tb2RlLWhhbmRsZXIuanMnO1xuaW1wb3J0IHsgVHdvQ2xpY2tQb2x5Z29uSGFuZGxlciB9IGZyb20gJy4vdHdvLWNsaWNrLXBvbHlnb24taGFuZGxlci5qcyc7XG5pbXBvcnQgeyBnZXRJbnRlcm1lZGlhdGVQb3NpdGlvbiB9IGZyb20gJy4vbW9kZS1oYW5kbGVyLmpzJztcblxuZXhwb3J0IGNsYXNzIERyYXdFbGxpcHNlQnlCb3VuZGluZ0JveEhhbmRsZXIgZXh0ZW5kcyBUd29DbGlja1BvbHlnb25IYW5kbGVyIHtcbiAgaGFuZGxlUG9pbnRlck1vdmUoZXZlbnQ6IFBvaW50ZXJNb3ZlRXZlbnQpOiB7IGVkaXRBY3Rpb246ID9FZGl0QWN0aW9uLCBjYW5jZWxNYXBQYW46IGJvb2xlYW4gfSB7XG4gICAgY29uc3QgcmVzdWx0ID0geyBlZGl0QWN0aW9uOiBudWxsLCBjYW5jZWxNYXBQYW46IGZhbHNlIH07XG4gICAgY29uc3QgY2xpY2tTZXF1ZW5jZSA9IHRoaXMuZ2V0Q2xpY2tTZXF1ZW5jZSgpO1xuXG4gICAgaWYgKGNsaWNrU2VxdWVuY2UubGVuZ3RoID09PSAwKSB7XG4gICAgICAvLyBub3RoaW5nIHRvIGRvIHlldFxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBjb25zdCBjb3JuZXIxID0gY2xpY2tTZXF1ZW5jZVswXTtcbiAgICBjb25zdCBjb3JuZXIyID0gZXZlbnQuZ3JvdW5kQ29vcmRzO1xuXG4gICAgY29uc3QgbWluWCA9IE1hdGgubWluKGNvcm5lcjFbMF0sIGNvcm5lcjJbMF0pO1xuICAgIGNvbnN0IG1pblkgPSBNYXRoLm1pbihjb3JuZXIxWzFdLCBjb3JuZXIyWzFdKTtcbiAgICBjb25zdCBtYXhYID0gTWF0aC5tYXgoY29ybmVyMVswXSwgY29ybmVyMlswXSk7XG4gICAgY29uc3QgbWF4WSA9IE1hdGgubWF4KGNvcm5lcjFbMV0sIGNvcm5lcjJbMV0pO1xuXG4gICAgY29uc3QgcG9seWdvblBvaW50cyA9IGJib3hQb2x5Z29uKFttaW5YLCBtaW5ZLCBtYXhYLCBtYXhZXSkuZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMF07XG4gICAgY29uc3QgY2VudGVyQ29vcmRpbmF0ZXMgPSBnZXRJbnRlcm1lZGlhdGVQb3NpdGlvbihjb3JuZXIxLCBjb3JuZXIyKTtcblxuICAgIGNvbnN0IHhTZW1pQXhpcyA9IE1hdGgubWF4KGRpc3RhbmNlKHBvaW50KHBvbHlnb25Qb2ludHNbMF0pLCBwb2ludChwb2x5Z29uUG9pbnRzWzFdKSksIDAuMDAxKTtcbiAgICBjb25zdCB5U2VtaUF4aXMgPSBNYXRoLm1heChkaXN0YW5jZShwb2ludChwb2x5Z29uUG9pbnRzWzBdKSwgcG9pbnQocG9seWdvblBvaW50c1szXSkpLCAwLjAwMSk7XG5cbiAgICB0aGlzLl9zZXRUZW50YXRpdmVGZWF0dXJlKGVsbGlwc2UoY2VudGVyQ29vcmRpbmF0ZXMsIHhTZW1pQXhpcywgeVNlbWlBeGlzKSk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG4iXX0=