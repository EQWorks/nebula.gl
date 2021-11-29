"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DrawEllipseUsingThreePointsMode = void 0;

var _distance = _interopRequireDefault(require("@turf/distance"));

var _ellipse = _interopRequireDefault(require("@turf/ellipse"));

var _bearing = _interopRequireDefault(require("@turf/bearing"));

var _helpers = require("@turf/helpers");

var _geojsonEditMode = require("./geojson-edit-mode.js");

var _threeClickPolygonMode = require("./three-click-polygon-mode.js");

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

var DrawEllipseUsingThreePointsMode =
/*#__PURE__*/
function (_ThreeClickPolygonMod) {
  _inherits(DrawEllipseUsingThreePointsMode, _ThreeClickPolygonMod);

  function DrawEllipseUsingThreePointsMode() {
    _classCallCheck(this, DrawEllipseUsingThreePointsMode);

    return _possibleConstructorReturn(this, _getPrototypeOf(DrawEllipseUsingThreePointsMode).apply(this, arguments));
  }

  _createClass(DrawEllipseUsingThreePointsMode, [{
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

      var mapCoords = event.mapCoords;

      if (clickSequence.length === 1) {
        this._setTentativeFeature({
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [clickSequence[0], mapCoords]
          }
        });
      } else if (clickSequence.length === 2) {
        var _clickSequence = _slicedToArray(clickSequence, 2),
            p1 = _clickSequence[0],
            p2 = _clickSequence[1];

        var centerCoordinates = (0, _geojsonEditMode.getIntermediatePosition)(p1, p2);
        var xSemiAxis = Math.max((0, _distance.default)(centerCoordinates, (0, _helpers.point)(mapCoords)), 0.001);
        var ySemiAxis = Math.max((0, _distance.default)(p1, p2), 0.001) / 2;
        var options = {
          angle: (0, _bearing.default)(p1, p2)
        };

        this._setTentativeFeature((0, _ellipse.default)(centerCoordinates, xSemiAxis, ySemiAxis, options));
      }

      return result;
    }
  }]);

  return DrawEllipseUsingThreePointsMode;
}(_threeClickPolygonMode.ThreeClickPolygonMode);

exports.DrawEllipseUsingThreePointsMode = DrawEllipseUsingThreePointsMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvZHJhdy1lbGxpcHNlLXVzaW5nLXRocmVlLXBvaW50cy1tb2RlLmpzIl0sIm5hbWVzIjpbIkRyYXdFbGxpcHNlVXNpbmdUaHJlZVBvaW50c01vZGUiLCJldmVudCIsInJlc3VsdCIsImVkaXRBY3Rpb24iLCJjYW5jZWxNYXBQYW4iLCJjbGlja1NlcXVlbmNlIiwiZ2V0Q2xpY2tTZXF1ZW5jZSIsImxlbmd0aCIsIm1hcENvb3JkcyIsIl9zZXRUZW50YXRpdmVGZWF0dXJlIiwidHlwZSIsImdlb21ldHJ5IiwiY29vcmRpbmF0ZXMiLCJwMSIsInAyIiwiY2VudGVyQ29vcmRpbmF0ZXMiLCJ4U2VtaUF4aXMiLCJNYXRoIiwibWF4IiwieVNlbWlBeGlzIiwib3B0aW9ucyIsImFuZ2xlIiwiVGhyZWVDbGlja1BvbHlnb25Nb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUVhQSwrQjs7Ozs7Ozs7Ozs7Ozs2Q0FFVEMsSyxFQUMyRDtBQUMzRCxVQUFNQyxNQUFNLEdBQUc7QUFBRUMsUUFBQUEsVUFBVSxFQUFFLElBQWQ7QUFBb0JDLFFBQUFBLFlBQVksRUFBRTtBQUFsQyxPQUFmO0FBQ0EsVUFBTUMsYUFBYSxHQUFHLEtBQUtDLGdCQUFMLEVBQXRCOztBQUVBLFVBQUlELGFBQWEsQ0FBQ0UsTUFBZCxLQUF5QixDQUE3QixFQUFnQztBQUM5QjtBQUNBLGVBQU9MLE1BQVA7QUFDRDs7QUFFRCxVQUFNTSxTQUFTLEdBQUdQLEtBQUssQ0FBQ08sU0FBeEI7O0FBRUEsVUFBSUgsYUFBYSxDQUFDRSxNQUFkLEtBQXlCLENBQTdCLEVBQWdDO0FBQzlCLGFBQUtFLG9CQUFMLENBQTBCO0FBQ3hCQyxVQUFBQSxJQUFJLEVBQUUsU0FEa0I7QUFFeEJDLFVBQUFBLFFBQVEsRUFBRTtBQUNSRCxZQUFBQSxJQUFJLEVBQUUsWUFERTtBQUVSRSxZQUFBQSxXQUFXLEVBQUUsQ0FBQ1AsYUFBYSxDQUFDLENBQUQsQ0FBZCxFQUFtQkcsU0FBbkI7QUFGTDtBQUZjLFNBQTFCO0FBT0QsT0FSRCxNQVFPLElBQUlILGFBQWEsQ0FBQ0UsTUFBZCxLQUF5QixDQUE3QixFQUFnQztBQUFBLDRDQUNwQkYsYUFEb0I7QUFBQSxZQUM5QlEsRUFEOEI7QUFBQSxZQUMxQkMsRUFEMEI7O0FBR3JDLFlBQU1DLGlCQUFpQixHQUFHLDhDQUF3QkYsRUFBeEIsRUFBNEJDLEVBQTVCLENBQTFCO0FBQ0EsWUFBTUUsU0FBUyxHQUFHQyxJQUFJLENBQUNDLEdBQUwsQ0FBUyx1QkFBU0gsaUJBQVQsRUFBNEIsb0JBQU1QLFNBQU4sQ0FBNUIsQ0FBVCxFQUF3RCxLQUF4RCxDQUFsQjtBQUNBLFlBQU1XLFNBQVMsR0FBR0YsSUFBSSxDQUFDQyxHQUFMLENBQVMsdUJBQVNMLEVBQVQsRUFBYUMsRUFBYixDQUFULEVBQTJCLEtBQTNCLElBQW9DLENBQXREO0FBQ0EsWUFBTU0sT0FBTyxHQUFHO0FBQUVDLFVBQUFBLEtBQUssRUFBRSxzQkFBUVIsRUFBUixFQUFZQyxFQUFaO0FBQVQsU0FBaEI7O0FBRUEsYUFBS0wsb0JBQUwsQ0FBMEIsc0JBQVFNLGlCQUFSLEVBQTJCQyxTQUEzQixFQUFzQ0csU0FBdEMsRUFBaURDLE9BQWpELENBQTFCO0FBQ0Q7O0FBRUQsYUFBT2xCLE1BQVA7QUFDRDs7OztFQWxDa0RvQiw0QyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbmltcG9ydCBkaXN0YW5jZSBmcm9tICdAdHVyZi9kaXN0YW5jZSc7XG5pbXBvcnQgZWxsaXBzZSBmcm9tICdAdHVyZi9lbGxpcHNlJztcbmltcG9ydCBiZWFyaW5nIGZyb20gJ0B0dXJmL2JlYXJpbmcnO1xuaW1wb3J0IHsgcG9pbnQgfSBmcm9tICdAdHVyZi9oZWxwZXJzJztcbmltcG9ydCB0eXBlIHsgUG9pbnRlck1vdmVFdmVudCB9IGZyb20gJy4uL3R5cGVzLmpzJztcbmltcG9ydCB7IGdldEludGVybWVkaWF0ZVBvc2l0aW9uLCB0eXBlIEdlb0pzb25FZGl0QWN0aW9uIH0gZnJvbSAnLi9nZW9qc29uLWVkaXQtbW9kZS5qcyc7XG5pbXBvcnQgeyBUaHJlZUNsaWNrUG9seWdvbk1vZGUgfSBmcm9tICcuL3RocmVlLWNsaWNrLXBvbHlnb24tbW9kZS5qcyc7XG5cbmV4cG9ydCBjbGFzcyBEcmF3RWxsaXBzZVVzaW5nVGhyZWVQb2ludHNNb2RlIGV4dGVuZHMgVGhyZWVDbGlja1BvbHlnb25Nb2RlIHtcbiAgaGFuZGxlUG9pbnRlck1vdmVBZGFwdGVyKFxuICAgIGV2ZW50OiBQb2ludGVyTW92ZUV2ZW50XG4gICk6IHsgZWRpdEFjdGlvbjogP0dlb0pzb25FZGl0QWN0aW9uLCBjYW5jZWxNYXBQYW46IGJvb2xlYW4gfSB7XG4gICAgY29uc3QgcmVzdWx0ID0geyBlZGl0QWN0aW9uOiBudWxsLCBjYW5jZWxNYXBQYW46IGZhbHNlIH07XG4gICAgY29uc3QgY2xpY2tTZXF1ZW5jZSA9IHRoaXMuZ2V0Q2xpY2tTZXF1ZW5jZSgpO1xuXG4gICAgaWYgKGNsaWNrU2VxdWVuY2UubGVuZ3RoID09PSAwKSB7XG4gICAgICAvLyBub3RoaW5nIHRvIGRvIHlldFxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBjb25zdCBtYXBDb29yZHMgPSBldmVudC5tYXBDb29yZHM7XG5cbiAgICBpZiAoY2xpY2tTZXF1ZW5jZS5sZW5ndGggPT09IDEpIHtcbiAgICAgIHRoaXMuX3NldFRlbnRhdGl2ZUZlYXR1cmUoe1xuICAgICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgICAgdHlwZTogJ0xpbmVTdHJpbmcnLFxuICAgICAgICAgIGNvb3JkaW5hdGVzOiBbY2xpY2tTZXF1ZW5jZVswXSwgbWFwQ29vcmRzXVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKGNsaWNrU2VxdWVuY2UubGVuZ3RoID09PSAyKSB7XG4gICAgICBjb25zdCBbcDEsIHAyXSA9IGNsaWNrU2VxdWVuY2U7XG5cbiAgICAgIGNvbnN0IGNlbnRlckNvb3JkaW5hdGVzID0gZ2V0SW50ZXJtZWRpYXRlUG9zaXRpb24ocDEsIHAyKTtcbiAgICAgIGNvbnN0IHhTZW1pQXhpcyA9IE1hdGgubWF4KGRpc3RhbmNlKGNlbnRlckNvb3JkaW5hdGVzLCBwb2ludChtYXBDb29yZHMpKSwgMC4wMDEpO1xuICAgICAgY29uc3QgeVNlbWlBeGlzID0gTWF0aC5tYXgoZGlzdGFuY2UocDEsIHAyKSwgMC4wMDEpIC8gMjtcbiAgICAgIGNvbnN0IG9wdGlvbnMgPSB7IGFuZ2xlOiBiZWFyaW5nKHAxLCBwMikgfTtcblxuICAgICAgdGhpcy5fc2V0VGVudGF0aXZlRmVhdHVyZShlbGxpcHNlKGNlbnRlckNvb3JkaW5hdGVzLCB4U2VtaUF4aXMsIHlTZW1pQXhpcywgb3B0aW9ucykpO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cbiJdfQ==