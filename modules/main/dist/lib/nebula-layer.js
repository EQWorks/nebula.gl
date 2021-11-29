"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _events = _interopRequireDefault(require("events"));

var _uuid = _interopRequireDefault(require("uuid"));

var _feature = _interopRequireDefault(require("./feature"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class NebulaLayer extends _events.default {
  // flags
  //
  constructor(_ref) {
    var _this;

    var getData = _ref.getData,
        on = _ref.on,
        toNebulaFeature = _ref.toNebulaFeature;
    super();
    _this = this;

    _defineProperty(this, "getData", void 0);

    _defineProperty(this, "toNebulaFeature", void 0);

    _defineProperty(this, "id", void 0);

    _defineProperty(this, "helperLayers", void 0);

    _defineProperty(this, "usesMapEvents", false);

    _defineProperty(this, "enablePicking", false);

    _defineProperty(this, "enableSelection", false);

    this.id = _uuid.default.v4();
    this.getData = getData;
    this.toNebulaFeature = toNebulaFeature;
    this.helperLayers = [];

    if (on) {
      Object.keys(on).forEach(function (key) {
        return _this.on(key, on[key]);
      });
    }
  }

  render(config) {
    return null;
  }

}

exports.default = NebulaLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvbmVidWxhLWxheWVyLmpzIl0sIm5hbWVzIjpbIk5lYnVsYUxheWVyIiwiRXZlbnRFbWl0dGVyIiwiY29uc3RydWN0b3IiLCJnZXREYXRhIiwib24iLCJ0b05lYnVsYUZlYXR1cmUiLCJpZCIsInV1aWQiLCJ2NCIsImhlbHBlckxheWVycyIsIk9iamVjdCIsImtleXMiLCJmb3JFYWNoIiwia2V5IiwicmVuZGVyIiwiY29uZmlnIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQ0E7O0FBQ0E7O0FBRUE7Ozs7OztBQUVlLE1BQU1BLFdBQU4sU0FBMEJDLGVBQTFCLENBQXVDO0FBTXBEO0FBSUE7QUFFQUMsRUFBQUEsV0FBVyxPQUEyQztBQUFBOztBQUFBLFFBQXhDQyxPQUF3QyxRQUF4Q0EsT0FBd0M7QUFBQSxRQUEvQkMsRUFBK0IsUUFBL0JBLEVBQStCO0FBQUEsUUFBM0JDLGVBQTJCLFFBQTNCQSxlQUEyQjtBQUNwRCxXQURvRDtBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBLDJDQUw3QixLQUs2Qjs7QUFBQSwyQ0FKN0IsS0FJNkI7O0FBQUEsNkNBSDNCLEtBRzJCOztBQUVwRCxTQUFLQyxFQUFMLEdBQVVDLGNBQUtDLEVBQUwsRUFBVjtBQUNBLFNBQUtMLE9BQUwsR0FBZUEsT0FBZjtBQUNBLFNBQUtFLGVBQUwsR0FBdUJBLGVBQXZCO0FBQ0EsU0FBS0ksWUFBTCxHQUFvQixFQUFwQjs7QUFFQSxRQUFJTCxFQUFKLEVBQVE7QUFDTk0sTUFBQUEsTUFBTSxDQUFDQyxJQUFQLENBQVlQLEVBQVosRUFBZ0JRLE9BQWhCLENBQXdCLFVBQUFDLEdBQUc7QUFBQSxlQUFJLEtBQUksQ0FBQ1QsRUFBTCxDQUFRUyxHQUFSLEVBQWFULEVBQUUsQ0FBQ1MsR0FBRCxDQUFmLENBQUo7QUFBQSxPQUEzQjtBQUNEO0FBQ0Y7O0FBRURDLEVBQUFBLE1BQU0sQ0FBQ0MsTUFBRCxFQUF3QjtBQUM1QixXQUFPLElBQVA7QUFDRDs7QUExQm1EIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcbmltcG9ydCBFdmVudEVtaXR0ZXIgZnJvbSAnZXZlbnRzJztcbmltcG9ydCB1dWlkIGZyb20gJ3V1aWQnO1xuXG5pbXBvcnQgRmVhdHVyZSBmcm9tICcuL2ZlYXR1cmUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOZWJ1bGFMYXllciBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIGdldERhdGE6ICgpID0+IE9iamVjdFtdO1xuICB0b05lYnVsYUZlYXR1cmU6IChkYXRhOiBPYmplY3QpID0+IEZlYXR1cmU7XG4gIGlkOiBzdHJpbmc7XG4gIGhlbHBlckxheWVyczogT2JqZWN0W107XG5cbiAgLy8gZmxhZ3NcbiAgdXNlc01hcEV2ZW50czogYm9vbGVhbiA9IGZhbHNlO1xuICBlbmFibGVQaWNraW5nOiBib29sZWFuID0gZmFsc2U7XG4gIGVuYWJsZVNlbGVjdGlvbjogYm9vbGVhbiA9IGZhbHNlO1xuICAvL1xuXG4gIGNvbnN0cnVjdG9yKHsgZ2V0RGF0YSwgb24sIHRvTmVidWxhRmVhdHVyZSB9OiBPYmplY3QpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuaWQgPSB1dWlkLnY0KCk7XG4gICAgdGhpcy5nZXREYXRhID0gZ2V0RGF0YTtcbiAgICB0aGlzLnRvTmVidWxhRmVhdHVyZSA9IHRvTmVidWxhRmVhdHVyZTtcbiAgICB0aGlzLmhlbHBlckxheWVycyA9IFtdO1xuXG4gICAgaWYgKG9uKSB7XG4gICAgICBPYmplY3Qua2V5cyhvbikuZm9yRWFjaChrZXkgPT4gdGhpcy5vbihrZXksIG9uW2tleV0pKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoY29uZmlnOiBPYmplY3QpOiBtaXhlZCB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cbiJdfQ==