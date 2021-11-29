"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DuplicateHandler = void 0;

var _translateHandler = require("./translate-handler");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var DuplicateHandler =
/*#__PURE__*/
function (_TranslateHandler) {
  _inherits(DuplicateHandler, _TranslateHandler);

  function DuplicateHandler() {
    _classCallCheck(this, DuplicateHandler);

    return _possibleConstructorReturn(this, _getPrototypeOf(DuplicateHandler).apply(this, arguments));
  }

  _createClass(DuplicateHandler, [{
    key: "handleStartDragging",
    value: function handleStartDragging(event) {
      if (!this._isTranslatable) {
        return null;
      }

      this._geometryBeforeTranslate = this.getSelectedFeaturesAsFeatureCollection();
      return this._geometryBeforeTranslate ? this.getAddManyFeaturesAction(this._geometryBeforeTranslate) : null;
    }
  }, {
    key: "getCursor",
    value: function getCursor(_ref) {
      var isDragging = _ref.isDragging;

      if (this._isTranslatable) {
        return 'copy';
      }

      return isDragging ? 'grabbing' : 'grab';
    }
  }]);

  return DuplicateHandler;
}(_translateHandler.TranslateHandler);

exports.DuplicateHandler = DuplicateHandler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL2R1cGxpY2F0ZS1oYW5kbGVyLmpzIl0sIm5hbWVzIjpbIkR1cGxpY2F0ZUhhbmRsZXIiLCJldmVudCIsIl9pc1RyYW5zbGF0YWJsZSIsIl9nZW9tZXRyeUJlZm9yZVRyYW5zbGF0ZSIsImdldFNlbGVjdGVkRmVhdHVyZXNBc0ZlYXR1cmVDb2xsZWN0aW9uIiwiZ2V0QWRkTWFueUZlYXR1cmVzQWN0aW9uIiwiaXNEcmFnZ2luZyIsIlRyYW5zbGF0ZUhhbmRsZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFJQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFFYUEsZ0I7Ozs7Ozs7Ozs7Ozs7d0NBQ1NDLEssRUFBd0M7QUFDMUQsVUFBSSxDQUFDLEtBQUtDLGVBQVYsRUFBMkI7QUFDekIsZUFBTyxJQUFQO0FBQ0Q7O0FBRUQsV0FBS0Msd0JBQUwsR0FBZ0MsS0FBS0Msc0NBQUwsRUFBaEM7QUFFQSxhQUFPLEtBQUtELHdCQUFMLEdBQ0gsS0FBS0Usd0JBQUwsQ0FBOEIsS0FBS0Ysd0JBQW5DLENBREcsR0FFSCxJQUZKO0FBR0Q7OztvQ0FFMEQ7QUFBQSxVQUEvQ0csVUFBK0MsUUFBL0NBLFVBQStDOztBQUN6RCxVQUFJLEtBQUtKLGVBQVQsRUFBMEI7QUFDeEIsZUFBTyxNQUFQO0FBQ0Q7O0FBQ0QsYUFBT0ksVUFBVSxHQUFHLFVBQUgsR0FBZ0IsTUFBakM7QUFDRDs7OztFQWxCbUNDLGtDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuaW1wb3J0IHR5cGUgeyBTdGFydERyYWdnaW5nRXZlbnQgfSBmcm9tICcuLi9ldmVudC10eXBlcy5qcyc7XG5pbXBvcnQgdHlwZSB7IEVkaXRBY3Rpb24gfSBmcm9tICcuL21vZGUtaGFuZGxlci5qcyc7XG5pbXBvcnQgeyBUcmFuc2xhdGVIYW5kbGVyIH0gZnJvbSAnLi90cmFuc2xhdGUtaGFuZGxlcic7XG5cbmV4cG9ydCBjbGFzcyBEdXBsaWNhdGVIYW5kbGVyIGV4dGVuZHMgVHJhbnNsYXRlSGFuZGxlciB7XG4gIGhhbmRsZVN0YXJ0RHJhZ2dpbmcoZXZlbnQ6IFN0YXJ0RHJhZ2dpbmdFdmVudCk6ID9FZGl0QWN0aW9uIHtcbiAgICBpZiAoIXRoaXMuX2lzVHJhbnNsYXRhYmxlKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB0aGlzLl9nZW9tZXRyeUJlZm9yZVRyYW5zbGF0ZSA9IHRoaXMuZ2V0U2VsZWN0ZWRGZWF0dXJlc0FzRmVhdHVyZUNvbGxlY3Rpb24oKTtcblxuICAgIHJldHVybiB0aGlzLl9nZW9tZXRyeUJlZm9yZVRyYW5zbGF0ZVxuICAgICAgPyB0aGlzLmdldEFkZE1hbnlGZWF0dXJlc0FjdGlvbih0aGlzLl9nZW9tZXRyeUJlZm9yZVRyYW5zbGF0ZSlcbiAgICAgIDogbnVsbDtcbiAgfVxuXG4gIGdldEN1cnNvcih7IGlzRHJhZ2dpbmcgfTogeyBpc0RyYWdnaW5nOiBib29sZWFuIH0pOiBzdHJpbmcge1xuICAgIGlmICh0aGlzLl9pc1RyYW5zbGF0YWJsZSkge1xuICAgICAgcmV0dXJuICdjb3B5JztcbiAgICB9XG4gICAgcmV0dXJuIGlzRHJhZ2dpbmcgPyAnZ3JhYmJpbmcnIDogJ2dyYWInO1xuICB9XG59XG4iXX0=