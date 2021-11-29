"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DrawRectangleUsingThreePointsHandler = void 0;

var _utils = require("../utils");

var _threeClickPolygonHandler = require("./three-click-polygon-handler.js");

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

// TODO edit-modes: delete handlers once EditMode fully implemented
var DrawRectangleUsingThreePointsHandler =
/*#__PURE__*/
function (_ThreeClickPolygonHan) {
  _inherits(DrawRectangleUsingThreePointsHandler, _ThreeClickPolygonHan);

  function DrawRectangleUsingThreePointsHandler() {
    _classCallCheck(this, DrawRectangleUsingThreePointsHandler);

    return _possibleConstructorReturn(this, _getPrototypeOf(DrawRectangleUsingThreePointsHandler).apply(this, arguments));
  }

  _createClass(DrawRectangleUsingThreePointsHandler, [{
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
        var lineString = {
          type: 'LineString',
          coordinates: clickSequence
        };

        var _clickSequence = _slicedToArray(clickSequence, 2),
            p1 = _clickSequence[0],
            p2 = _clickSequence[1];

        var _generatePointsParall = (0, _utils.generatePointsParallelToLinePoints)(p1, p2, groundCoords),
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

  return DrawRectangleUsingThreePointsHandler;
}(_threeClickPolygonHandler.ThreeClickPolygonHandler);

exports.DrawRectangleUsingThreePointsHandler = DrawRectangleUsingThreePointsHandler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL2RyYXctcmVjdGFuZ2xlLXVzaW5nLXRocmVlLXBvaW50cy1oYW5kbGVyLmpzIl0sIm5hbWVzIjpbIkRyYXdSZWN0YW5nbGVVc2luZ1RocmVlUG9pbnRzSGFuZGxlciIsImV2ZW50IiwicmVzdWx0IiwiZWRpdEFjdGlvbiIsImNhbmNlbE1hcFBhbiIsImNsaWNrU2VxdWVuY2UiLCJnZXRDbGlja1NlcXVlbmNlIiwibGVuZ3RoIiwiZ3JvdW5kQ29vcmRzIiwiX3NldFRlbnRhdGl2ZUZlYXR1cmUiLCJ0eXBlIiwiZ2VvbWV0cnkiLCJjb29yZGluYXRlcyIsImxpbmVTdHJpbmciLCJwMSIsInAyIiwicDMiLCJwNCIsIlRocmVlQ2xpY2tQb2x5Z29uSGFuZGxlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUdBOztBQUdBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQTtJQUNhQSxvQzs7Ozs7Ozs7Ozs7OztzQ0FDT0MsSyxFQUE2RTtBQUM3RixVQUFNQyxNQUFNLEdBQUc7QUFBRUMsUUFBQUEsVUFBVSxFQUFFLElBQWQ7QUFBb0JDLFFBQUFBLFlBQVksRUFBRTtBQUFsQyxPQUFmO0FBQ0EsVUFBTUMsYUFBYSxHQUFHLEtBQUtDLGdCQUFMLEVBQXRCOztBQUVBLFVBQUlELGFBQWEsQ0FBQ0UsTUFBZCxLQUF5QixDQUE3QixFQUFnQztBQUM5QjtBQUNBLGVBQU9MLE1BQVA7QUFDRDs7QUFFRCxVQUFNTSxZQUFZLEdBQUdQLEtBQUssQ0FBQ08sWUFBM0I7O0FBRUEsVUFBSUgsYUFBYSxDQUFDRSxNQUFkLEtBQXlCLENBQTdCLEVBQWdDO0FBQzlCLGFBQUtFLG9CQUFMLENBQTBCO0FBQ3hCQyxVQUFBQSxJQUFJLEVBQUUsU0FEa0I7QUFFeEJDLFVBQUFBLFFBQVEsRUFBRTtBQUNSRCxZQUFBQSxJQUFJLEVBQUUsWUFERTtBQUVSRSxZQUFBQSxXQUFXLEVBQUUsQ0FBQ1AsYUFBYSxDQUFDLENBQUQsQ0FBZCxFQUFtQkcsWUFBbkI7QUFGTDtBQUZjLFNBQTFCO0FBT0QsT0FSRCxNQVFPLElBQUlILGFBQWEsQ0FBQ0UsTUFBZCxLQUF5QixDQUE3QixFQUFnQztBQUNyQyxZQUFNTSxVQUFzQixHQUFHO0FBQzdCSCxVQUFBQSxJQUFJLEVBQUUsWUFEdUI7QUFFN0JFLFVBQUFBLFdBQVcsRUFBRVA7QUFGZ0IsU0FBL0I7O0FBRHFDLDRDQUtwQkEsYUFMb0I7QUFBQSxZQUs5QlMsRUFMOEI7QUFBQSxZQUsxQkMsRUFMMEI7O0FBQUEsb0NBTXBCLCtDQUFtQ0QsRUFBbkMsRUFBdUNDLEVBQXZDLEVBQTJDUCxZQUEzQyxDQU5vQjtBQUFBO0FBQUEsWUFNOUJRLEVBTjhCO0FBQUEsWUFNMUJDLEVBTjBCOztBQVFyQyxhQUFLUixvQkFBTCxDQUEwQjtBQUN4QkMsVUFBQUEsSUFBSSxFQUFFLFNBRGtCO0FBRXhCQyxVQUFBQSxRQUFRLEVBQUU7QUFDUkQsWUFBQUEsSUFBSSxFQUFFLFNBREU7QUFFUkUsWUFBQUEsV0FBVyxFQUFFLG9CQUtOQyxVQUFVLENBQUNELFdBTEwsVUFNVEksRUFOUyxFQU9UQyxFQVBTLEVBUVRILEVBUlM7QUFGTDtBQUZjLFNBQTFCO0FBaUJEOztBQUVELGFBQU9aLE1BQVA7QUFDRDs7OztFQWhEdURnQixrRCIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbmltcG9ydCB0eXBlIHsgTGluZVN0cmluZyB9IGZyb20gJ2tlcGxlci1vdXRkYXRlZC1uZWJ1bGEuZ2wtZWRpdC1tb2Rlcyc7XG5pbXBvcnQgeyBnZW5lcmF0ZVBvaW50c1BhcmFsbGVsVG9MaW5lUG9pbnRzIH0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IHR5cGUgeyBQb2ludGVyTW92ZUV2ZW50IH0gZnJvbSAnLi4vZXZlbnQtdHlwZXMuanMnO1xuaW1wb3J0IHR5cGUgeyBFZGl0QWN0aW9uIH0gZnJvbSAnLi9tb2RlLWhhbmRsZXIuanMnO1xuaW1wb3J0IHsgVGhyZWVDbGlja1BvbHlnb25IYW5kbGVyIH0gZnJvbSAnLi90aHJlZS1jbGljay1wb2x5Z29uLWhhbmRsZXIuanMnO1xuXG4vLyBUT0RPIGVkaXQtbW9kZXM6IGRlbGV0ZSBoYW5kbGVycyBvbmNlIEVkaXRNb2RlIGZ1bGx5IGltcGxlbWVudGVkXG5leHBvcnQgY2xhc3MgRHJhd1JlY3RhbmdsZVVzaW5nVGhyZWVQb2ludHNIYW5kbGVyIGV4dGVuZHMgVGhyZWVDbGlja1BvbHlnb25IYW5kbGVyIHtcbiAgaGFuZGxlUG9pbnRlck1vdmUoZXZlbnQ6IFBvaW50ZXJNb3ZlRXZlbnQpOiB7IGVkaXRBY3Rpb246ID9FZGl0QWN0aW9uLCBjYW5jZWxNYXBQYW46IGJvb2xlYW4gfSB7XG4gICAgY29uc3QgcmVzdWx0ID0geyBlZGl0QWN0aW9uOiBudWxsLCBjYW5jZWxNYXBQYW46IGZhbHNlIH07XG4gICAgY29uc3QgY2xpY2tTZXF1ZW5jZSA9IHRoaXMuZ2V0Q2xpY2tTZXF1ZW5jZSgpO1xuXG4gICAgaWYgKGNsaWNrU2VxdWVuY2UubGVuZ3RoID09PSAwKSB7XG4gICAgICAvLyBub3RoaW5nIHRvIGRvIHlldFxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBjb25zdCBncm91bmRDb29yZHMgPSBldmVudC5ncm91bmRDb29yZHM7XG5cbiAgICBpZiAoY2xpY2tTZXF1ZW5jZS5sZW5ndGggPT09IDEpIHtcbiAgICAgIHRoaXMuX3NldFRlbnRhdGl2ZUZlYXR1cmUoe1xuICAgICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgICAgdHlwZTogJ0xpbmVTdHJpbmcnLFxuICAgICAgICAgIGNvb3JkaW5hdGVzOiBbY2xpY2tTZXF1ZW5jZVswXSwgZ3JvdW5kQ29vcmRzXVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKGNsaWNrU2VxdWVuY2UubGVuZ3RoID09PSAyKSB7XG4gICAgICBjb25zdCBsaW5lU3RyaW5nOiBMaW5lU3RyaW5nID0ge1xuICAgICAgICB0eXBlOiAnTGluZVN0cmluZycsXG4gICAgICAgIGNvb3JkaW5hdGVzOiBjbGlja1NlcXVlbmNlXG4gICAgICB9O1xuICAgICAgY29uc3QgW3AxLCBwMl0gPSBjbGlja1NlcXVlbmNlO1xuICAgICAgY29uc3QgW3AzLCBwNF0gPSBnZW5lcmF0ZVBvaW50c1BhcmFsbGVsVG9MaW5lUG9pbnRzKHAxLCBwMiwgZ3JvdW5kQ29vcmRzKTtcblxuICAgICAgdGhpcy5fc2V0VGVudGF0aXZlRmVhdHVyZSh7XG4gICAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgICAgZ2VvbWV0cnk6IHtcbiAgICAgICAgICB0eXBlOiAnUG9seWdvbicsXG4gICAgICAgICAgY29vcmRpbmF0ZXM6IFtcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgLy8gRHJhdyBhIHBvbHlnb24gY29udGFpbmluZyBhbGwgdGhlIHBvaW50cyBvZiB0aGUgTGluZVN0cmluZyxcbiAgICAgICAgICAgICAgLy8gdGhlbiB0aGUgcG9pbnRzIG9ydGhvZ29uYWwgdG8gdGhlIGxpbmVTdHJpbmcsXG4gICAgICAgICAgICAgIC8vIHRoZW4gYmFjayB0byB0aGUgc3RhcnRpbmcgcG9zaXRpb25cbiAgICAgICAgICAgICAgLi4ubGluZVN0cmluZy5jb29yZGluYXRlcyxcbiAgICAgICAgICAgICAgcDMsXG4gICAgICAgICAgICAgIHA0LFxuICAgICAgICAgICAgICBwMVxuICAgICAgICAgICAgXVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuIl19