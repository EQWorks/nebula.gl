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

// TODO edit-modes: delete handlers once EditMode fully implemented
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL2RyYXctcG9pbnQtaGFuZGxlci5qcyJdLCJuYW1lcyI6WyJEcmF3UG9pbnRIYW5kbGVyIiwiZ3JvdW5kQ29vcmRzIiwiZ2VvbWV0cnkiLCJ0eXBlIiwiY29vcmRpbmF0ZXMiLCJnZXRBZGRGZWF0dXJlQWN0aW9uIiwiTW9kZUhhbmRsZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFJQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQTtJQUNhQSxnQjs7Ozs7Ozs7Ozs7OztzQ0FDNEM7QUFBQSxVQUF6Q0MsWUFBeUMsUUFBekNBLFlBQXlDO0FBQ3JELFVBQU1DLFFBQVEsR0FBRztBQUNmQyxRQUFBQSxJQUFJLEVBQUUsT0FEUztBQUVmQyxRQUFBQSxXQUFXLEVBQUVIO0FBRkUsT0FBakI7QUFLQSxhQUFPLEtBQUtJLG1CQUFMLENBQXlCSCxRQUF6QixDQUFQO0FBQ0Q7Ozs7RUFSbUNJLHdCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuaW1wb3J0IHR5cGUgeyBDbGlja0V2ZW50IH0gZnJvbSAnLi4vZXZlbnQtdHlwZXMuanMnO1xuaW1wb3J0IHR5cGUgeyBFZGl0QWN0aW9uIH0gZnJvbSAnLi9tb2RlLWhhbmRsZXIuanMnO1xuaW1wb3J0IHsgTW9kZUhhbmRsZXIgfSBmcm9tICcuL21vZGUtaGFuZGxlci5qcyc7XG5cbi8vIFRPRE8gZWRpdC1tb2RlczogZGVsZXRlIGhhbmRsZXJzIG9uY2UgRWRpdE1vZGUgZnVsbHkgaW1wbGVtZW50ZWRcbmV4cG9ydCBjbGFzcyBEcmF3UG9pbnRIYW5kbGVyIGV4dGVuZHMgTW9kZUhhbmRsZXIge1xuICBoYW5kbGVDbGljayh7IGdyb3VuZENvb3JkcyB9OiBDbGlja0V2ZW50KTogP0VkaXRBY3Rpb24ge1xuICAgIGNvbnN0IGdlb21ldHJ5ID0ge1xuICAgICAgdHlwZTogJ1BvaW50JyxcbiAgICAgIGNvb3JkaW5hdGVzOiBncm91bmRDb29yZHNcbiAgICB9O1xuXG4gICAgcmV0dXJuIHRoaXMuZ2V0QWRkRmVhdHVyZUFjdGlvbihnZW9tZXRyeSk7XG4gIH1cbn1cbiJdfQ==