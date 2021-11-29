"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ViewHandler = void 0;

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
var ViewHandler =
/*#__PURE__*/
function (_ModeHandler) {
  _inherits(ViewHandler, _ModeHandler);

  function ViewHandler() {
    _classCallCheck(this, ViewHandler);

    return _possibleConstructorReturn(this, _getPrototypeOf(ViewHandler).apply(this, arguments));
  }

  _createClass(ViewHandler, [{
    key: "getCursor",
    value: function getCursor(_ref) {
      var isDragging = _ref.isDragging;
      return isDragging ? 'grabbing' : 'grab';
    }
  }, {
    key: "getEditHandles",
    value: function getEditHandles(picks, groundCoords) {
      return [];
    }
  }]);

  return ViewHandler;
}(_modeHandler.ModeHandler);

exports.ViewHandler = ViewHandler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL3ZpZXctaGFuZGxlci5qcyJdLCJuYW1lcyI6WyJWaWV3SGFuZGxlciIsImlzRHJhZ2dpbmciLCJwaWNrcyIsImdyb3VuZENvb3JkcyIsIk1vZGVIYW5kbGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBSUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7SUFDYUEsVzs7Ozs7Ozs7Ozs7OztvQ0FDZ0Q7QUFBQSxVQUEvQ0MsVUFBK0MsUUFBL0NBLFVBQStDO0FBQ3pELGFBQU9BLFVBQVUsR0FBRyxVQUFILEdBQWdCLE1BQWpDO0FBQ0Q7OzttQ0FFY0MsSyxFQUF1QkMsWSxFQUF1QztBQUMzRSxhQUFPLEVBQVA7QUFDRDs7OztFQVA4QkMsd0IiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuXG5pbXBvcnQgdHlwZSB7IFBvc2l0aW9uIH0gZnJvbSAna2VwbGVyLW91dGRhdGVkLW5lYnVsYS5nbC1lZGl0LW1vZGVzJztcbmltcG9ydCB0eXBlIHsgRWRpdEhhbmRsZSB9IGZyb20gJy4vbW9kZS1oYW5kbGVyLmpzJztcbmltcG9ydCB7IE1vZGVIYW5kbGVyIH0gZnJvbSAnLi9tb2RlLWhhbmRsZXIuanMnO1xuXG4vLyBUT0RPIGVkaXQtbW9kZXM6IGRlbGV0ZSBoYW5kbGVycyBvbmNlIEVkaXRNb2RlIGZ1bGx5IGltcGxlbWVudGVkXG5leHBvcnQgY2xhc3MgVmlld0hhbmRsZXIgZXh0ZW5kcyBNb2RlSGFuZGxlciB7XG4gIGdldEN1cnNvcih7IGlzRHJhZ2dpbmcgfTogeyBpc0RyYWdnaW5nOiBib29sZWFuIH0pOiBzdHJpbmcge1xuICAgIHJldHVybiBpc0RyYWdnaW5nID8gJ2dyYWJiaW5nJyA6ICdncmFiJztcbiAgfVxuXG4gIGdldEVkaXRIYW5kbGVzKHBpY2tzPzogQXJyYXk8T2JqZWN0PiwgZ3JvdW5kQ29vcmRzPzogUG9zaXRpb24pOiBFZGl0SGFuZGxlW10ge1xuICAgIHJldHVybiBbXTtcbiAgfVxufVxuIl19