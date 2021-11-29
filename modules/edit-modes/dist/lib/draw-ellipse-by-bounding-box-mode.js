"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DrawEllipseByBoundingBoxMode = void 0;

var _bboxPolygon = _interopRequireDefault(require("@turf/bbox-polygon"));

var _distance = _interopRequireDefault(require("@turf/distance"));

var _ellipse = _interopRequireDefault(require("@turf/ellipse"));

var _helpers = require("@turf/helpers");

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

var DrawEllipseByBoundingBoxMode =
/*#__PURE__*/
function (_TwoClickPolygonMode) {
  _inherits(DrawEllipseByBoundingBoxMode, _TwoClickPolygonMode);

  function DrawEllipseByBoundingBoxMode() {
    _classCallCheck(this, DrawEllipseByBoundingBoxMode);

    return _possibleConstructorReturn(this, _getPrototypeOf(DrawEllipseByBoundingBoxMode).apply(this, arguments));
  }

  _createClass(DrawEllipseByBoundingBoxMode, [{
    key: "handlePointerMoveAdapter",
    value: function handlePointerMoveAdapter(event) {
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
      var corner2 = event.mapCoords;
      var minX = Math.min(corner1[0], corner2[0]);
      var minY = Math.min(corner1[1], corner2[1]);
      var maxX = Math.max(corner1[0], corner2[0]);
      var maxY = Math.max(corner1[1], corner2[1]);
      var polygonPoints = (0, _bboxPolygon.default)([minX, minY, maxX, maxY]).geometry.coordinates[0];
      var centerCoordinates = (0, _geojsonEditMode.getIntermediatePosition)(corner1, corner2);
      var xSemiAxis = Math.max((0, _distance.default)((0, _helpers.point)(polygonPoints[0]), (0, _helpers.point)(polygonPoints[1])), 0.001);
      var ySemiAxis = Math.max((0, _distance.default)((0, _helpers.point)(polygonPoints[0]), (0, _helpers.point)(polygonPoints[3])), 0.001);

      this._setTentativeFeature((0, _ellipse.default)(centerCoordinates, xSemiAxis, ySemiAxis));

      return result;
    }
  }]);

  return DrawEllipseByBoundingBoxMode;
}(_twoClickPolygonMode.TwoClickPolygonMode);

exports.DrawEllipseByBoundingBoxMode = DrawEllipseByBoundingBoxMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvZHJhdy1lbGxpcHNlLWJ5LWJvdW5kaW5nLWJveC1tb2RlLmpzIl0sIm5hbWVzIjpbIkRyYXdFbGxpcHNlQnlCb3VuZGluZ0JveE1vZGUiLCJldmVudCIsInJlc3VsdCIsImVkaXRBY3Rpb24iLCJjYW5jZWxNYXBQYW4iLCJjbGlja1NlcXVlbmNlIiwiZ2V0Q2xpY2tTZXF1ZW5jZSIsImxlbmd0aCIsImNvcm5lcjEiLCJjb3JuZXIyIiwibWFwQ29vcmRzIiwibWluWCIsIk1hdGgiLCJtaW4iLCJtaW5ZIiwibWF4WCIsIm1heCIsIm1heFkiLCJwb2x5Z29uUG9pbnRzIiwiZ2VvbWV0cnkiLCJjb29yZGluYXRlcyIsImNlbnRlckNvb3JkaW5hdGVzIiwieFNlbWlBeGlzIiwieVNlbWlBeGlzIiwiX3NldFRlbnRhdGl2ZUZlYXR1cmUiLCJUd29DbGlja1BvbHlnb25Nb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFFYUEsNEI7Ozs7Ozs7Ozs7Ozs7NkNBRVRDLEssRUFDMkQ7QUFDM0QsVUFBTUMsTUFBTSxHQUFHO0FBQUVDLFFBQUFBLFVBQVUsRUFBRSxJQUFkO0FBQW9CQyxRQUFBQSxZQUFZLEVBQUU7QUFBbEMsT0FBZjtBQUNBLFVBQU1DLGFBQWEsR0FBRyxLQUFLQyxnQkFBTCxFQUF0Qjs7QUFFQSxVQUFJRCxhQUFhLENBQUNFLE1BQWQsS0FBeUIsQ0FBN0IsRUFBZ0M7QUFDOUI7QUFDQSxlQUFPTCxNQUFQO0FBQ0Q7O0FBRUQsVUFBTU0sT0FBTyxHQUFHSCxhQUFhLENBQUMsQ0FBRCxDQUE3QjtBQUNBLFVBQU1JLE9BQU8sR0FBR1IsS0FBSyxDQUFDUyxTQUF0QjtBQUVBLFVBQU1DLElBQUksR0FBR0MsSUFBSSxDQUFDQyxHQUFMLENBQVNMLE9BQU8sQ0FBQyxDQUFELENBQWhCLEVBQXFCQyxPQUFPLENBQUMsQ0FBRCxDQUE1QixDQUFiO0FBQ0EsVUFBTUssSUFBSSxHQUFHRixJQUFJLENBQUNDLEdBQUwsQ0FBU0wsT0FBTyxDQUFDLENBQUQsQ0FBaEIsRUFBcUJDLE9BQU8sQ0FBQyxDQUFELENBQTVCLENBQWI7QUFDQSxVQUFNTSxJQUFJLEdBQUdILElBQUksQ0FBQ0ksR0FBTCxDQUFTUixPQUFPLENBQUMsQ0FBRCxDQUFoQixFQUFxQkMsT0FBTyxDQUFDLENBQUQsQ0FBNUIsQ0FBYjtBQUNBLFVBQU1RLElBQUksR0FBR0wsSUFBSSxDQUFDSSxHQUFMLENBQVNSLE9BQU8sQ0FBQyxDQUFELENBQWhCLEVBQXFCQyxPQUFPLENBQUMsQ0FBRCxDQUE1QixDQUFiO0FBRUEsVUFBTVMsYUFBYSxHQUFHLDBCQUFZLENBQUNQLElBQUQsRUFBT0csSUFBUCxFQUFhQyxJQUFiLEVBQW1CRSxJQUFuQixDQUFaLEVBQXNDRSxRQUF0QyxDQUErQ0MsV0FBL0MsQ0FBMkQsQ0FBM0QsQ0FBdEI7QUFDQSxVQUFNQyxpQkFBaUIsR0FBRyw4Q0FBd0JiLE9BQXhCLEVBQWlDQyxPQUFqQyxDQUExQjtBQUVBLFVBQU1hLFNBQVMsR0FBR1YsSUFBSSxDQUFDSSxHQUFMLENBQVMsdUJBQVMsb0JBQU1FLGFBQWEsQ0FBQyxDQUFELENBQW5CLENBQVQsRUFBa0Msb0JBQU1BLGFBQWEsQ0FBQyxDQUFELENBQW5CLENBQWxDLENBQVQsRUFBcUUsS0FBckUsQ0FBbEI7QUFDQSxVQUFNSyxTQUFTLEdBQUdYLElBQUksQ0FBQ0ksR0FBTCxDQUFTLHVCQUFTLG9CQUFNRSxhQUFhLENBQUMsQ0FBRCxDQUFuQixDQUFULEVBQWtDLG9CQUFNQSxhQUFhLENBQUMsQ0FBRCxDQUFuQixDQUFsQyxDQUFULEVBQXFFLEtBQXJFLENBQWxCOztBQUVBLFdBQUtNLG9CQUFMLENBQTBCLHNCQUFRSCxpQkFBUixFQUEyQkMsU0FBM0IsRUFBc0NDLFNBQXRDLENBQTFCOztBQUVBLGFBQU9yQixNQUFQO0FBQ0Q7Ozs7RUE3QitDdUIsd0MiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuXG5pbXBvcnQgYmJveFBvbHlnb24gZnJvbSAnQHR1cmYvYmJveC1wb2x5Z29uJztcbmltcG9ydCBkaXN0YW5jZSBmcm9tICdAdHVyZi9kaXN0YW5jZSc7XG5pbXBvcnQgZWxsaXBzZSBmcm9tICdAdHVyZi9lbGxpcHNlJztcbmltcG9ydCB7IHBvaW50IH0gZnJvbSAnQHR1cmYvaGVscGVycyc7XG5pbXBvcnQgdHlwZSB7IFBvaW50ZXJNb3ZlRXZlbnQgfSBmcm9tICcuLi90eXBlcy5qcyc7XG5pbXBvcnQgeyBnZXRJbnRlcm1lZGlhdGVQb3NpdGlvbiwgdHlwZSBHZW9Kc29uRWRpdEFjdGlvbiB9IGZyb20gJy4vZ2VvanNvbi1lZGl0LW1vZGUuanMnO1xuaW1wb3J0IHsgVHdvQ2xpY2tQb2x5Z29uTW9kZSB9IGZyb20gJy4vdHdvLWNsaWNrLXBvbHlnb24tbW9kZS5qcyc7XG5cbmV4cG9ydCBjbGFzcyBEcmF3RWxsaXBzZUJ5Qm91bmRpbmdCb3hNb2RlIGV4dGVuZHMgVHdvQ2xpY2tQb2x5Z29uTW9kZSB7XG4gIGhhbmRsZVBvaW50ZXJNb3ZlQWRhcHRlcihcbiAgICBldmVudDogUG9pbnRlck1vdmVFdmVudFxuICApOiB7IGVkaXRBY3Rpb246ID9HZW9Kc29uRWRpdEFjdGlvbiwgY2FuY2VsTWFwUGFuOiBib29sZWFuIH0ge1xuICAgIGNvbnN0IHJlc3VsdCA9IHsgZWRpdEFjdGlvbjogbnVsbCwgY2FuY2VsTWFwUGFuOiBmYWxzZSB9O1xuICAgIGNvbnN0IGNsaWNrU2VxdWVuY2UgPSB0aGlzLmdldENsaWNrU2VxdWVuY2UoKTtcblxuICAgIGlmIChjbGlja1NlcXVlbmNlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgLy8gbm90aGluZyB0byBkbyB5ZXRcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgY29uc3QgY29ybmVyMSA9IGNsaWNrU2VxdWVuY2VbMF07XG4gICAgY29uc3QgY29ybmVyMiA9IGV2ZW50Lm1hcENvb3JkcztcblxuICAgIGNvbnN0IG1pblggPSBNYXRoLm1pbihjb3JuZXIxWzBdLCBjb3JuZXIyWzBdKTtcbiAgICBjb25zdCBtaW5ZID0gTWF0aC5taW4oY29ybmVyMVsxXSwgY29ybmVyMlsxXSk7XG4gICAgY29uc3QgbWF4WCA9IE1hdGgubWF4KGNvcm5lcjFbMF0sIGNvcm5lcjJbMF0pO1xuICAgIGNvbnN0IG1heFkgPSBNYXRoLm1heChjb3JuZXIxWzFdLCBjb3JuZXIyWzFdKTtcblxuICAgIGNvbnN0IHBvbHlnb25Qb2ludHMgPSBiYm94UG9seWdvbihbbWluWCwgbWluWSwgbWF4WCwgbWF4WV0pLmdlb21ldHJ5LmNvb3JkaW5hdGVzWzBdO1xuICAgIGNvbnN0IGNlbnRlckNvb3JkaW5hdGVzID0gZ2V0SW50ZXJtZWRpYXRlUG9zaXRpb24oY29ybmVyMSwgY29ybmVyMik7XG5cbiAgICBjb25zdCB4U2VtaUF4aXMgPSBNYXRoLm1heChkaXN0YW5jZShwb2ludChwb2x5Z29uUG9pbnRzWzBdKSwgcG9pbnQocG9seWdvblBvaW50c1sxXSkpLCAwLjAwMSk7XG4gICAgY29uc3QgeVNlbWlBeGlzID0gTWF0aC5tYXgoZGlzdGFuY2UocG9pbnQocG9seWdvblBvaW50c1swXSksIHBvaW50KHBvbHlnb25Qb2ludHNbM10pKSwgMC4wMDEpO1xuXG4gICAgdGhpcy5fc2V0VGVudGF0aXZlRmVhdHVyZShlbGxpcHNlKGNlbnRlckNvb3JkaW5hdGVzLCB4U2VtaUF4aXMsIHlTZW1pQXhpcykpO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuIl19