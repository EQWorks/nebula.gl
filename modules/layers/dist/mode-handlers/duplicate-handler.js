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

// TODO edit-modes: delete handlers once EditMode fully implemented
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL2R1cGxpY2F0ZS1oYW5kbGVyLmpzIl0sIm5hbWVzIjpbIkR1cGxpY2F0ZUhhbmRsZXIiLCJldmVudCIsIl9pc1RyYW5zbGF0YWJsZSIsIl9nZW9tZXRyeUJlZm9yZVRyYW5zbGF0ZSIsImdldFNlbGVjdGVkRmVhdHVyZXNBc0ZlYXR1cmVDb2xsZWN0aW9uIiwiZ2V0QWRkTWFueUZlYXR1cmVzQWN0aW9uIiwiaXNEcmFnZ2luZyIsIlRyYW5zbGF0ZUhhbmRsZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFJQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQTtJQUNhQSxnQjs7Ozs7Ozs7Ozs7Ozt3Q0FDU0MsSyxFQUF3QztBQUMxRCxVQUFJLENBQUMsS0FBS0MsZUFBVixFQUEyQjtBQUN6QixlQUFPLElBQVA7QUFDRDs7QUFFRCxXQUFLQyx3QkFBTCxHQUFnQyxLQUFLQyxzQ0FBTCxFQUFoQztBQUVBLGFBQU8sS0FBS0Qsd0JBQUwsR0FDSCxLQUFLRSx3QkFBTCxDQUE4QixLQUFLRix3QkFBbkMsQ0FERyxHQUVILElBRko7QUFHRDs7O29DQUUwRDtBQUFBLFVBQS9DRyxVQUErQyxRQUEvQ0EsVUFBK0M7O0FBQ3pELFVBQUksS0FBS0osZUFBVCxFQUEwQjtBQUN4QixlQUFPLE1BQVA7QUFDRDs7QUFDRCxhQUFPSSxVQUFVLEdBQUcsVUFBSCxHQUFnQixNQUFqQztBQUNEOzs7O0VBbEJtQ0Msa0MiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuXG5pbXBvcnQgdHlwZSB7IFN0YXJ0RHJhZ2dpbmdFdmVudCB9IGZyb20gJy4uL2V2ZW50LXR5cGVzLmpzJztcbmltcG9ydCB0eXBlIHsgRWRpdEFjdGlvbiB9IGZyb20gJy4vbW9kZS1oYW5kbGVyLmpzJztcbmltcG9ydCB7IFRyYW5zbGF0ZUhhbmRsZXIgfSBmcm9tICcuL3RyYW5zbGF0ZS1oYW5kbGVyJztcblxuLy8gVE9ETyBlZGl0LW1vZGVzOiBkZWxldGUgaGFuZGxlcnMgb25jZSBFZGl0TW9kZSBmdWxseSBpbXBsZW1lbnRlZFxuZXhwb3J0IGNsYXNzIER1cGxpY2F0ZUhhbmRsZXIgZXh0ZW5kcyBUcmFuc2xhdGVIYW5kbGVyIHtcbiAgaGFuZGxlU3RhcnREcmFnZ2luZyhldmVudDogU3RhcnREcmFnZ2luZ0V2ZW50KTogP0VkaXRBY3Rpb24ge1xuICAgIGlmICghdGhpcy5faXNUcmFuc2xhdGFibGUpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHRoaXMuX2dlb21ldHJ5QmVmb3JlVHJhbnNsYXRlID0gdGhpcy5nZXRTZWxlY3RlZEZlYXR1cmVzQXNGZWF0dXJlQ29sbGVjdGlvbigpO1xuXG4gICAgcmV0dXJuIHRoaXMuX2dlb21ldHJ5QmVmb3JlVHJhbnNsYXRlXG4gICAgICA/IHRoaXMuZ2V0QWRkTWFueUZlYXR1cmVzQWN0aW9uKHRoaXMuX2dlb21ldHJ5QmVmb3JlVHJhbnNsYXRlKVxuICAgICAgOiBudWxsO1xuICB9XG5cbiAgZ2V0Q3Vyc29yKHsgaXNEcmFnZ2luZyB9OiB7IGlzRHJhZ2dpbmc6IGJvb2xlYW4gfSk6IHN0cmluZyB7XG4gICAgaWYgKHRoaXMuX2lzVHJhbnNsYXRhYmxlKSB7XG4gICAgICByZXR1cm4gJ2NvcHknO1xuICAgIH1cbiAgICByZXR1cm4gaXNEcmFnZ2luZyA/ICdncmFiYmluZycgOiAnZ3JhYic7XG4gIH1cbn1cbiJdfQ==