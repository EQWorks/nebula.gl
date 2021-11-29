"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DrawRectangleHandler = void 0;

var _bboxPolygon = _interopRequireDefault(require("@turf/bbox-polygon"));

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

var DrawRectangleHandler =
/*#__PURE__*/
function (_TwoClickPolygonHandl) {
  _inherits(DrawRectangleHandler, _TwoClickPolygonHandl);

  function DrawRectangleHandler() {
    _classCallCheck(this, DrawRectangleHandler);

    return _possibleConstructorReturn(this, _getPrototypeOf(DrawRectangleHandler).apply(this, arguments));
  }

  _createClass(DrawRectangleHandler, [{
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

      this._setTentativeFeature((0, _bboxPolygon.default)([corner1[0], corner1[1], corner2[0], corner2[1]]));

      return result;
    }
  }]);

  return DrawRectangleHandler;
}(_twoClickPolygonHandler.TwoClickPolygonHandler);

exports.DrawRectangleHandler = DrawRectangleHandler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL2RyYXctcmVjdGFuZ2xlLWhhbmRsZXIuanMiXSwibmFtZXMiOlsiRHJhd1JlY3RhbmdsZUhhbmRsZXIiLCJldmVudCIsInJlc3VsdCIsImVkaXRBY3Rpb24iLCJjYW5jZWxNYXBQYW4iLCJjbGlja1NlcXVlbmNlIiwiZ2V0Q2xpY2tTZXF1ZW5jZSIsImxlbmd0aCIsImNvcm5lcjEiLCJjb3JuZXIyIiwiZ3JvdW5kQ29vcmRzIiwiX3NldFRlbnRhdGl2ZUZlYXR1cmUiLCJUd29DbGlja1BvbHlnb25IYW5kbGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBRUE7O0FBR0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFFYUEsb0I7Ozs7Ozs7Ozs7Ozs7c0NBQ09DLEssRUFBNkU7QUFDN0YsVUFBTUMsTUFBTSxHQUFHO0FBQUVDLFFBQUFBLFVBQVUsRUFBRSxJQUFkO0FBQW9CQyxRQUFBQSxZQUFZLEVBQUU7QUFBbEMsT0FBZjtBQUNBLFVBQU1DLGFBQWEsR0FBRyxLQUFLQyxnQkFBTCxFQUF0Qjs7QUFFQSxVQUFJRCxhQUFhLENBQUNFLE1BQWQsS0FBeUIsQ0FBN0IsRUFBZ0M7QUFDOUI7QUFDQSxlQUFPTCxNQUFQO0FBQ0Q7O0FBRUQsVUFBTU0sT0FBTyxHQUFHSCxhQUFhLENBQUMsQ0FBRCxDQUE3QjtBQUNBLFVBQU1JLE9BQU8sR0FBR1IsS0FBSyxDQUFDUyxZQUF0Qjs7QUFDQSxXQUFLQyxvQkFBTCxDQUEwQiwwQkFBWSxDQUFDSCxPQUFPLENBQUMsQ0FBRCxDQUFSLEVBQWFBLE9BQU8sQ0FBQyxDQUFELENBQXBCLEVBQXlCQyxPQUFPLENBQUMsQ0FBRCxDQUFoQyxFQUFxQ0EsT0FBTyxDQUFDLENBQUQsQ0FBNUMsQ0FBWixDQUExQjs7QUFFQSxhQUFPUCxNQUFQO0FBQ0Q7Ozs7RUFmdUNVLDhDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuaW1wb3J0IGJib3hQb2x5Z29uIGZyb20gJ0B0dXJmL2Jib3gtcG9seWdvbic7XG5pbXBvcnQgdHlwZSB7IFBvaW50ZXJNb3ZlRXZlbnQgfSBmcm9tICcuLi9ldmVudC10eXBlcy5qcyc7XG5pbXBvcnQgdHlwZSB7IEVkaXRBY3Rpb24gfSBmcm9tICcuL21vZGUtaGFuZGxlci5qcyc7XG5pbXBvcnQgeyBUd29DbGlja1BvbHlnb25IYW5kbGVyIH0gZnJvbSAnLi90d28tY2xpY2stcG9seWdvbi1oYW5kbGVyLmpzJztcblxuZXhwb3J0IGNsYXNzIERyYXdSZWN0YW5nbGVIYW5kbGVyIGV4dGVuZHMgVHdvQ2xpY2tQb2x5Z29uSGFuZGxlciB7XG4gIGhhbmRsZVBvaW50ZXJNb3ZlKGV2ZW50OiBQb2ludGVyTW92ZUV2ZW50KTogeyBlZGl0QWN0aW9uOiA/RWRpdEFjdGlvbiwgY2FuY2VsTWFwUGFuOiBib29sZWFuIH0ge1xuICAgIGNvbnN0IHJlc3VsdCA9IHsgZWRpdEFjdGlvbjogbnVsbCwgY2FuY2VsTWFwUGFuOiBmYWxzZSB9O1xuICAgIGNvbnN0IGNsaWNrU2VxdWVuY2UgPSB0aGlzLmdldENsaWNrU2VxdWVuY2UoKTtcblxuICAgIGlmIChjbGlja1NlcXVlbmNlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgLy8gbm90aGluZyB0byBkbyB5ZXRcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgY29uc3QgY29ybmVyMSA9IGNsaWNrU2VxdWVuY2VbMF07XG4gICAgY29uc3QgY29ybmVyMiA9IGV2ZW50Lmdyb3VuZENvb3JkcztcbiAgICB0aGlzLl9zZXRUZW50YXRpdmVGZWF0dXJlKGJib3hQb2x5Z29uKFtjb3JuZXIxWzBdLCBjb3JuZXIxWzFdLCBjb3JuZXIyWzBdLCBjb3JuZXIyWzFdXSkpO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuIl19