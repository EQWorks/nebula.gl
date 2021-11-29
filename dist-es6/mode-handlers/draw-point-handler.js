"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DrawPointHandler = void 0;

var _modeHandler = require("./mode-handler.js");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var DrawPointHandler =
/*#__PURE__*/
function (_ModeHandler) {
  _inherits(DrawPointHandler, _ModeHandler);

  function DrawPointHandler() {
    _classCallCheck(this, DrawPointHandler);

    return _possibleConstructorReturn(this, _getPrototypeOf(DrawPointHandler).apply(this, arguments));
  }

  _createClass(DrawPointHandler, [{
    key: "handleClick",
    value: function handleClick(_ref) {
      var groundCoords = _ref.groundCoords;
      var geometry = {
        type: 'Point',
        coordinates: groundCoords
      };
      return this.getAddFeatureAction(geometry);
    }
  }]);

  return DrawPointHandler;
}(_modeHandler.ModeHandler);

exports.DrawPointHandler = DrawPointHandler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL2RyYXctcG9pbnQtaGFuZGxlci5qcyJdLCJuYW1lcyI6WyJEcmF3UG9pbnRIYW5kbGVyIiwiZ3JvdW5kQ29vcmRzIiwiZ2VvbWV0cnkiLCJ0eXBlIiwiY29vcmRpbmF0ZXMiLCJnZXRBZGRGZWF0dXJlQWN0aW9uIiwiTW9kZUhhbmRsZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFJQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFFYUEsZ0I7Ozs7Ozs7Ozs7Ozs7c0NBQzRDO0FBQUEsVUFBekNDLFlBQXlDLFFBQXpDQSxZQUF5QztBQUNyRCxVQUFNQyxRQUFRLEdBQUc7QUFDZkMsUUFBQUEsSUFBSSxFQUFFLE9BRFM7QUFFZkMsUUFBQUEsV0FBVyxFQUFFSDtBQUZFLE9BQWpCO0FBS0EsYUFBTyxLQUFLSSxtQkFBTCxDQUF5QkgsUUFBekIsQ0FBUDtBQUNEOzs7O0VBUm1DSSx3QiIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbmltcG9ydCB0eXBlIHsgQ2xpY2tFdmVudCB9IGZyb20gJy4uL2V2ZW50LXR5cGVzLmpzJztcbmltcG9ydCB0eXBlIHsgRWRpdEFjdGlvbiB9IGZyb20gJy4vbW9kZS1oYW5kbGVyLmpzJztcbmltcG9ydCB7IE1vZGVIYW5kbGVyIH0gZnJvbSAnLi9tb2RlLWhhbmRsZXIuanMnO1xuXG5leHBvcnQgY2xhc3MgRHJhd1BvaW50SGFuZGxlciBleHRlbmRzIE1vZGVIYW5kbGVyIHtcbiAgaGFuZGxlQ2xpY2soeyBncm91bmRDb29yZHMgfTogQ2xpY2tFdmVudCk6ID9FZGl0QWN0aW9uIHtcbiAgICBjb25zdCBnZW9tZXRyeSA9IHtcbiAgICAgIHR5cGU6ICdQb2ludCcsXG4gICAgICBjb29yZGluYXRlczogZ3JvdW5kQ29vcmRzXG4gICAgfTtcblxuICAgIHJldHVybiB0aGlzLmdldEFkZEZlYXR1cmVBY3Rpb24oZ2VvbWV0cnkpO1xuICB9XG59XG4iXX0=