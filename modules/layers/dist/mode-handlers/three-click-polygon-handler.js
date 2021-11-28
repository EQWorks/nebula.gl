"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ThreeClickPolygonHandler = void 0;

var _modeHandler = require("./mode-handler.js");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ThreeClickPolygonHandler =
/*#__PURE__*/
function (_ModeHandler) {
  _inherits(ThreeClickPolygonHandler, _ModeHandler);

  function ThreeClickPolygonHandler() {
    _classCallCheck(this, ThreeClickPolygonHandler);

    return _possibleConstructorReturn(this, _getPrototypeOf(ThreeClickPolygonHandler).apply(this, arguments));
  }

  _createClass(ThreeClickPolygonHandler, [{
    key: "handleClick",
    value: function handleClick(event) {
      _get(_getPrototypeOf(ThreeClickPolygonHandler.prototype), "handleClick", this).call(this, event);

      var tentativeFeature = this.getTentativeFeature();
      var clickSequence = this.getClickSequence();

      if (clickSequence.length > 2 && tentativeFeature && tentativeFeature.geometry.type === 'Polygon') {
        var editAction = this.getAddFeatureOrBooleanPolygonAction(tentativeFeature.geometry);
        this.resetClickSequence();

        this._setTentativeFeature(null);

        return editAction;
      }

      return null;
    }
  }]);

  return ThreeClickPolygonHandler;
}(_modeHandler.ModeHandler);

exports.ThreeClickPolygonHandler = ThreeClickPolygonHandler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL3RocmVlLWNsaWNrLXBvbHlnb24taGFuZGxlci5qcyJdLCJuYW1lcyI6WyJUaHJlZUNsaWNrUG9seWdvbkhhbmRsZXIiLCJldmVudCIsInRlbnRhdGl2ZUZlYXR1cmUiLCJnZXRUZW50YXRpdmVGZWF0dXJlIiwiY2xpY2tTZXF1ZW5jZSIsImdldENsaWNrU2VxdWVuY2UiLCJsZW5ndGgiLCJnZW9tZXRyeSIsInR5cGUiLCJlZGl0QWN0aW9uIiwiZ2V0QWRkRmVhdHVyZU9yQm9vbGVhblBvbHlnb25BY3Rpb24iLCJyZXNldENsaWNrU2VxdWVuY2UiLCJfc2V0VGVudGF0aXZlRmVhdHVyZSIsIk1vZGVIYW5kbGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBR0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUdhQSx3Qjs7Ozs7Ozs7Ozs7OztnQ0FDQ0MsSyxFQUFnQztBQUMxQyxnR0FBa0JBLEtBQWxCOztBQUVBLFVBQU1DLGdCQUFnQixHQUFHLEtBQUtDLG1CQUFMLEVBQXpCO0FBQ0EsVUFBTUMsYUFBYSxHQUFHLEtBQUtDLGdCQUFMLEVBQXRCOztBQUVBLFVBQ0VELGFBQWEsQ0FBQ0UsTUFBZCxHQUF1QixDQUF2QixJQUNBSixnQkFEQSxJQUVBQSxnQkFBZ0IsQ0FBQ0ssUUFBakIsQ0FBMEJDLElBQTFCLEtBQW1DLFNBSHJDLEVBSUU7QUFDQSxZQUFNQyxVQUFVLEdBQUcsS0FBS0MsbUNBQUwsQ0FBeUNSLGdCQUFnQixDQUFDSyxRQUExRCxDQUFuQjtBQUNBLGFBQUtJLGtCQUFMOztBQUNBLGFBQUtDLG9CQUFMLENBQTBCLElBQTFCOztBQUNBLGVBQU9ILFVBQVA7QUFDRDs7QUFFRCxhQUFPLElBQVA7QUFDRDs7OztFQW5CMkNJLHdCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuaW1wb3J0IHR5cGUgeyBDbGlja0V2ZW50IH0gZnJvbSAnLi4vZXZlbnQtdHlwZXMuanMnO1xuaW1wb3J0IHsgTW9kZUhhbmRsZXIgfSBmcm9tICcuL21vZGUtaGFuZGxlci5qcyc7XG5pbXBvcnQgdHlwZSB7IEVkaXRBY3Rpb24gfSBmcm9tICcuL21vZGUtaGFuZGxlci5qcyc7XG5cbmV4cG9ydCBjbGFzcyBUaHJlZUNsaWNrUG9seWdvbkhhbmRsZXIgZXh0ZW5kcyBNb2RlSGFuZGxlciB7XG4gIGhhbmRsZUNsaWNrKGV2ZW50OiBDbGlja0V2ZW50KTogP0VkaXRBY3Rpb24ge1xuICAgIHN1cGVyLmhhbmRsZUNsaWNrKGV2ZW50KTtcblxuICAgIGNvbnN0IHRlbnRhdGl2ZUZlYXR1cmUgPSB0aGlzLmdldFRlbnRhdGl2ZUZlYXR1cmUoKTtcbiAgICBjb25zdCBjbGlja1NlcXVlbmNlID0gdGhpcy5nZXRDbGlja1NlcXVlbmNlKCk7XG5cbiAgICBpZiAoXG4gICAgICBjbGlja1NlcXVlbmNlLmxlbmd0aCA+IDIgJiZcbiAgICAgIHRlbnRhdGl2ZUZlYXR1cmUgJiZcbiAgICAgIHRlbnRhdGl2ZUZlYXR1cmUuZ2VvbWV0cnkudHlwZSA9PT0gJ1BvbHlnb24nXG4gICAgKSB7XG4gICAgICBjb25zdCBlZGl0QWN0aW9uID0gdGhpcy5nZXRBZGRGZWF0dXJlT3JCb29sZWFuUG9seWdvbkFjdGlvbih0ZW50YXRpdmVGZWF0dXJlLmdlb21ldHJ5KTtcbiAgICAgIHRoaXMucmVzZXRDbGlja1NlcXVlbmNlKCk7XG4gICAgICB0aGlzLl9zZXRUZW50YXRpdmVGZWF0dXJlKG51bGwpO1xuICAgICAgcmV0dXJuIGVkaXRBY3Rpb247XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cbiJdfQ==