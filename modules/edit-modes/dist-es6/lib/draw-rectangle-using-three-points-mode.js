"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DrawRectangleUsingThreePointsMode = void 0;

var _utils = require("../utils");

var _threeClickPolygonMode = require("./three-click-polygon-mode.js");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

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

var DrawRectangleUsingThreePointsMode =
/*#__PURE__*/
function (_ThreeClickPolygonMod) {
  _inherits(DrawRectangleUsingThreePointsMode, _ThreeClickPolygonMod);

  function DrawRectangleUsingThreePointsMode() {
    _classCallCheck(this, DrawRectangleUsingThreePointsMode);

    return _possibleConstructorReturn(this, _getPrototypeOf(DrawRectangleUsingThreePointsMode).apply(this, arguments));
  }

  _createClass(DrawRectangleUsingThreePointsMode, [{
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
        var lineString = {
          type: 'LineString',
          coordinates: clickSequence
        };

        var _clickSequence = _slicedToArray(clickSequence, 2),
            p1 = _clickSequence[0],
            p2 = _clickSequence[1];

        var _generatePointsParall = (0, _utils.generatePointsParallelToLinePoints)(p1, p2, mapCoords),
            _generatePointsParall2 = _slicedToArray(_generatePointsParall, 2),
            p3 = _generatePointsParall2[0],
            p4 = _generatePointsParall2[1];

        this._setTentativeFeature({
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [_toConsumableArray(lineString.coordinates).concat([p3, p4, p1])]
          }
        });
      }

      return result;
    }
  }]);

  return DrawRectangleUsingThreePointsMode;
}(_threeClickPolygonMode.ThreeClickPolygonMode);

exports.DrawRectangleUsingThreePointsMode = DrawRectangleUsingThreePointsMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvZHJhdy1yZWN0YW5nbGUtdXNpbmctdGhyZWUtcG9pbnRzLW1vZGUuanMiXSwibmFtZXMiOlsiRHJhd1JlY3RhbmdsZVVzaW5nVGhyZWVQb2ludHNNb2RlIiwiZXZlbnQiLCJyZXN1bHQiLCJlZGl0QWN0aW9uIiwiY2FuY2VsTWFwUGFuIiwiY2xpY2tTZXF1ZW5jZSIsImdldENsaWNrU2VxdWVuY2UiLCJsZW5ndGgiLCJtYXBDb29yZHMiLCJfc2V0VGVudGF0aXZlRmVhdHVyZSIsInR5cGUiLCJnZW9tZXRyeSIsImNvb3JkaW5hdGVzIiwibGluZVN0cmluZyIsInAxIiwicDIiLCJwMyIsInA0IiwiVGhyZWVDbGlja1BvbHlnb25Nb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBRUE7O0FBSUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUVhQSxpQzs7Ozs7Ozs7Ozs7Ozs2Q0FFVEMsSyxFQUMyRDtBQUMzRCxVQUFNQyxNQUFNLEdBQUc7QUFBRUMsUUFBQUEsVUFBVSxFQUFFLElBQWQ7QUFBb0JDLFFBQUFBLFlBQVksRUFBRTtBQUFsQyxPQUFmO0FBQ0EsVUFBTUMsYUFBYSxHQUFHLEtBQUtDLGdCQUFMLEVBQXRCOztBQUVBLFVBQUlELGFBQWEsQ0FBQ0UsTUFBZCxLQUF5QixDQUE3QixFQUFnQztBQUM5QjtBQUNBLGVBQU9MLE1BQVA7QUFDRDs7QUFFRCxVQUFNTSxTQUFTLEdBQUdQLEtBQUssQ0FBQ08sU0FBeEI7O0FBRUEsVUFBSUgsYUFBYSxDQUFDRSxNQUFkLEtBQXlCLENBQTdCLEVBQWdDO0FBQzlCLGFBQUtFLG9CQUFMLENBQTBCO0FBQ3hCQyxVQUFBQSxJQUFJLEVBQUUsU0FEa0I7QUFFeEJDLFVBQUFBLFFBQVEsRUFBRTtBQUNSRCxZQUFBQSxJQUFJLEVBQUUsWUFERTtBQUVSRSxZQUFBQSxXQUFXLEVBQUUsQ0FBQ1AsYUFBYSxDQUFDLENBQUQsQ0FBZCxFQUFtQkcsU0FBbkI7QUFGTDtBQUZjLFNBQTFCO0FBT0QsT0FSRCxNQVFPLElBQUlILGFBQWEsQ0FBQ0UsTUFBZCxLQUF5QixDQUE3QixFQUFnQztBQUNyQyxZQUFNTSxVQUFzQixHQUFHO0FBQzdCSCxVQUFBQSxJQUFJLEVBQUUsWUFEdUI7QUFFN0JFLFVBQUFBLFdBQVcsRUFBRVA7QUFGZ0IsU0FBL0I7O0FBRHFDLDRDQUtwQkEsYUFMb0I7QUFBQSxZQUs5QlMsRUFMOEI7QUFBQSxZQUsxQkMsRUFMMEI7O0FBQUEsb0NBTXBCLCtDQUFtQ0QsRUFBbkMsRUFBdUNDLEVBQXZDLEVBQTJDUCxTQUEzQyxDQU5vQjtBQUFBO0FBQUEsWUFNOUJRLEVBTjhCO0FBQUEsWUFNMUJDLEVBTjBCOztBQVFyQyxhQUFLUixvQkFBTCxDQUEwQjtBQUN4QkMsVUFBQUEsSUFBSSxFQUFFLFNBRGtCO0FBRXhCQyxVQUFBQSxRQUFRLEVBQUU7QUFDUkQsWUFBQUEsSUFBSSxFQUFFLFNBREU7QUFFUkUsWUFBQUEsV0FBVyxFQUFFLG9CQUtOQyxVQUFVLENBQUNELFdBTEwsVUFNVEksRUFOUyxFQU9UQyxFQVBTLEVBUVRILEVBUlM7QUFGTDtBQUZjLFNBQTFCO0FBaUJEOztBQUVELGFBQU9aLE1BQVA7QUFDRDs7OztFQWxEb0RnQiw0QyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbmltcG9ydCB7IGdlbmVyYXRlUG9pbnRzUGFyYWxsZWxUb0xpbmVQb2ludHMgfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQgdHlwZSB7IExpbmVTdHJpbmcgfSBmcm9tICcuLi9nZW9qc29uLXR5cGVzLmpzJztcbmltcG9ydCB0eXBlIHsgUG9pbnRlck1vdmVFdmVudCB9IGZyb20gJy4uL3R5cGVzLmpzJztcbmltcG9ydCB7IHR5cGUgR2VvSnNvbkVkaXRBY3Rpb24gfSBmcm9tICcuL2dlb2pzb24tZWRpdC1tb2RlLmpzJztcbmltcG9ydCB7IFRocmVlQ2xpY2tQb2x5Z29uTW9kZSB9IGZyb20gJy4vdGhyZWUtY2xpY2stcG9seWdvbi1tb2RlLmpzJztcblxuZXhwb3J0IGNsYXNzIERyYXdSZWN0YW5nbGVVc2luZ1RocmVlUG9pbnRzTW9kZSBleHRlbmRzIFRocmVlQ2xpY2tQb2x5Z29uTW9kZSB7XG4gIGhhbmRsZVBvaW50ZXJNb3ZlQWRhcHRlcihcbiAgICBldmVudDogUG9pbnRlck1vdmVFdmVudFxuICApOiB7IGVkaXRBY3Rpb246ID9HZW9Kc29uRWRpdEFjdGlvbiwgY2FuY2VsTWFwUGFuOiBib29sZWFuIH0ge1xuICAgIGNvbnN0IHJlc3VsdCA9IHsgZWRpdEFjdGlvbjogbnVsbCwgY2FuY2VsTWFwUGFuOiBmYWxzZSB9O1xuICAgIGNvbnN0IGNsaWNrU2VxdWVuY2UgPSB0aGlzLmdldENsaWNrU2VxdWVuY2UoKTtcblxuICAgIGlmIChjbGlja1NlcXVlbmNlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgLy8gbm90aGluZyB0byBkbyB5ZXRcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgY29uc3QgbWFwQ29vcmRzID0gZXZlbnQubWFwQ29vcmRzO1xuXG4gICAgaWYgKGNsaWNrU2VxdWVuY2UubGVuZ3RoID09PSAxKSB7XG4gICAgICB0aGlzLl9zZXRUZW50YXRpdmVGZWF0dXJlKHtcbiAgICAgICAgdHlwZTogJ0ZlYXR1cmUnLFxuICAgICAgICBnZW9tZXRyeToge1xuICAgICAgICAgIHR5cGU6ICdMaW5lU3RyaW5nJyxcbiAgICAgICAgICBjb29yZGluYXRlczogW2NsaWNrU2VxdWVuY2VbMF0sIG1hcENvb3Jkc11cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChjbGlja1NlcXVlbmNlLmxlbmd0aCA9PT0gMikge1xuICAgICAgY29uc3QgbGluZVN0cmluZzogTGluZVN0cmluZyA9IHtcbiAgICAgICAgdHlwZTogJ0xpbmVTdHJpbmcnLFxuICAgICAgICBjb29yZGluYXRlczogY2xpY2tTZXF1ZW5jZVxuICAgICAgfTtcbiAgICAgIGNvbnN0IFtwMSwgcDJdID0gY2xpY2tTZXF1ZW5jZTtcbiAgICAgIGNvbnN0IFtwMywgcDRdID0gZ2VuZXJhdGVQb2ludHNQYXJhbGxlbFRvTGluZVBvaW50cyhwMSwgcDIsIG1hcENvb3Jkcyk7XG5cbiAgICAgIHRoaXMuX3NldFRlbnRhdGl2ZUZlYXR1cmUoe1xuICAgICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgICAgdHlwZTogJ1BvbHlnb24nLFxuICAgICAgICAgIGNvb3JkaW5hdGVzOiBbXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgIC8vIERyYXcgYSBwb2x5Z29uIGNvbnRhaW5pbmcgYWxsIHRoZSBwb2ludHMgb2YgdGhlIExpbmVTdHJpbmcsXG4gICAgICAgICAgICAgIC8vIHRoZW4gdGhlIHBvaW50cyBvcnRob2dvbmFsIHRvIHRoZSBsaW5lU3RyaW5nLFxuICAgICAgICAgICAgICAvLyB0aGVuIGJhY2sgdG8gdGhlIHN0YXJ0aW5nIHBvc2l0aW9uXG4gICAgICAgICAgICAgIC4uLmxpbmVTdHJpbmcuY29vcmRpbmF0ZXMsXG4gICAgICAgICAgICAgIHAzLFxuICAgICAgICAgICAgICBwNCxcbiAgICAgICAgICAgICAgcDFcbiAgICAgICAgICAgIF1cbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cbiJdfQ==