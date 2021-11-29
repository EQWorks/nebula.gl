"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _events = _interopRequireDefault(require("events"));

var _uuid = _interopRequireDefault(require("uuid"));

var _feature = _interopRequireDefault(require("./feature"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var NebulaLayer =
/*#__PURE__*/
function (_EventEmitter) {
  _inherits(NebulaLayer, _EventEmitter);

  // flags
  //
  function NebulaLayer(_ref) {
    var _this;

    var getData = _ref.getData,
        on = _ref.on,
        toNebulaFeature = _ref.toNebulaFeature;

    _classCallCheck(this, NebulaLayer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(NebulaLayer).call(this));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "getData", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "toNebulaFeature", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "id", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "helperLayers", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "usesMapEvents", false);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "enablePicking", false);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "enableSelection", false);

    _this.id = _uuid.default.v4();
    _this.getData = getData;
    _this.toNebulaFeature = toNebulaFeature;
    _this.helperLayers = [];

    if (on) {
      Object.keys(on).forEach(function (key) {
        return _this.on(key, on[key]);
      });
    }

    return _this;
  }

  _createClass(NebulaLayer, [{
    key: "render",
    value: function render(config) {
      return null;
    }
  }]);

  return NebulaLayer;
}(_events.default);

exports.default = NebulaLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvbmVidWxhLWxheWVyLmpzIl0sIm5hbWVzIjpbIk5lYnVsYUxheWVyIiwiZ2V0RGF0YSIsIm9uIiwidG9OZWJ1bGFGZWF0dXJlIiwiaWQiLCJ1dWlkIiwidjQiLCJoZWxwZXJMYXllcnMiLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsImtleSIsImNvbmZpZyIsIkV2ZW50RW1pdHRlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNBOztBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFFcUJBLFc7Ozs7O0FBTW5CO0FBSUE7QUFFQSw2QkFBc0Q7QUFBQTs7QUFBQSxRQUF4Q0MsT0FBd0MsUUFBeENBLE9BQXdDO0FBQUEsUUFBL0JDLEVBQStCLFFBQS9CQSxFQUErQjtBQUFBLFFBQTNCQyxlQUEyQixRQUEzQkEsZUFBMkI7O0FBQUE7O0FBQ3BEOztBQURvRDs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQSw0RkFMN0IsS0FLNkI7O0FBQUEsNEZBSjdCLEtBSTZCOztBQUFBLDhGQUgzQixLQUcyQjs7QUFFcEQsVUFBS0MsRUFBTCxHQUFVQyxjQUFLQyxFQUFMLEVBQVY7QUFDQSxVQUFLTCxPQUFMLEdBQWVBLE9BQWY7QUFDQSxVQUFLRSxlQUFMLEdBQXVCQSxlQUF2QjtBQUNBLFVBQUtJLFlBQUwsR0FBb0IsRUFBcEI7O0FBRUEsUUFBSUwsRUFBSixFQUFRO0FBQ05NLE1BQUFBLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZUCxFQUFaLEVBQWdCUSxPQUFoQixDQUF3QixVQUFBQyxHQUFHO0FBQUEsZUFBSSxNQUFLVCxFQUFMLENBQVFTLEdBQVIsRUFBYVQsRUFBRSxDQUFDUyxHQUFELENBQWYsQ0FBSjtBQUFBLE9BQTNCO0FBQ0Q7O0FBVG1EO0FBVXJEOzs7OzJCQUVNQyxNLEVBQXVCO0FBQzVCLGFBQU8sSUFBUDtBQUNEOzs7O0VBMUJzQ0MsZSIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5pbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJ2V2ZW50cyc7XG5pbXBvcnQgdXVpZCBmcm9tICd1dWlkJztcblxuaW1wb3J0IEZlYXR1cmUgZnJvbSAnLi9mZWF0dXJlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTmVidWxhTGF5ZXIgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICBnZXREYXRhOiAoKSA9PiBPYmplY3RbXTtcbiAgdG9OZWJ1bGFGZWF0dXJlOiAoZGF0YTogT2JqZWN0KSA9PiBGZWF0dXJlO1xuICBpZDogc3RyaW5nO1xuICBoZWxwZXJMYXllcnM6IE9iamVjdFtdO1xuXG4gIC8vIGZsYWdzXG4gIHVzZXNNYXBFdmVudHM6IGJvb2xlYW4gPSBmYWxzZTtcbiAgZW5hYmxlUGlja2luZzogYm9vbGVhbiA9IGZhbHNlO1xuICBlbmFibGVTZWxlY3Rpb246IGJvb2xlYW4gPSBmYWxzZTtcbiAgLy9cblxuICBjb25zdHJ1Y3Rvcih7IGdldERhdGEsIG9uLCB0b05lYnVsYUZlYXR1cmUgfTogT2JqZWN0KSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmlkID0gdXVpZC52NCgpO1xuICAgIHRoaXMuZ2V0RGF0YSA9IGdldERhdGE7XG4gICAgdGhpcy50b05lYnVsYUZlYXR1cmUgPSB0b05lYnVsYUZlYXR1cmU7XG4gICAgdGhpcy5oZWxwZXJMYXllcnMgPSBbXTtcblxuICAgIGlmIChvbikge1xuICAgICAgT2JqZWN0LmtleXMob24pLmZvckVhY2goa2V5ID0+IHRoaXMub24oa2V5LCBvbltrZXldKSk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKGNvbmZpZzogT2JqZWN0KTogbWl4ZWQge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG4iXX0=