"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DuplicateMode = void 0;

var _translateMode = require("./translate-mode.js");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var DuplicateMode =
/*#__PURE__*/
function (_TranslateMode) {
  _inherits(DuplicateMode, _TranslateMode);

  function DuplicateMode() {
    _classCallCheck(this, DuplicateMode);

    return _possibleConstructorReturn(this, _getPrototypeOf(DuplicateMode).apply(this, arguments));
  }

  _createClass(DuplicateMode, [{
    key: "handleStartDraggingAdapter",
    value: function handleStartDraggingAdapter(event, props) {
      if (!this._isTranslatable) {
        return null;
      }

      this._geometryBeforeTranslate = this.getSelectedFeaturesAsFeatureCollection(props);
      return this._geometryBeforeTranslate ? this.getAddManyFeaturesAction(this._geometryBeforeTranslate, props.data) : null;
    }
  }, {
    key: "getCursorAdapter",
    value: function getCursorAdapter() {
      if (this._isTranslatable) {
        return 'copy';
      }

      return null;
    }
  }]);

  return DuplicateMode;
}(_translateMode.TranslateMode);

exports.DuplicateMode = DuplicateMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvZHVwbGljYXRlLW1vZGUuanMiXSwibmFtZXMiOlsiRHVwbGljYXRlTW9kZSIsImV2ZW50IiwicHJvcHMiLCJfaXNUcmFuc2xhdGFibGUiLCJfZ2VvbWV0cnlCZWZvcmVUcmFuc2xhdGUiLCJnZXRTZWxlY3RlZEZlYXR1cmVzQXNGZWF0dXJlQ29sbGVjdGlvbiIsImdldEFkZE1hbnlGZWF0dXJlc0FjdGlvbiIsImRhdGEiLCJUcmFuc2xhdGVNb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBS0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBRWFBLGE7Ozs7Ozs7Ozs7Ozs7K0NBRVRDLEssRUFDQUMsSyxFQUNvQjtBQUNwQixVQUFJLENBQUMsS0FBS0MsZUFBVixFQUEyQjtBQUN6QixlQUFPLElBQVA7QUFDRDs7QUFFRCxXQUFLQyx3QkFBTCxHQUFnQyxLQUFLQyxzQ0FBTCxDQUE0Q0gsS0FBNUMsQ0FBaEM7QUFFQSxhQUFPLEtBQUtFLHdCQUFMLEdBQ0gsS0FBS0Usd0JBQUwsQ0FBOEIsS0FBS0Ysd0JBQW5DLEVBQTZERixLQUFLLENBQUNLLElBQW5FLENBREcsR0FFSCxJQUZKO0FBR0Q7Ozt1Q0FFMkI7QUFDMUIsVUFBSSxLQUFLSixlQUFULEVBQTBCO0FBQ3hCLGVBQU8sTUFBUDtBQUNEOztBQUNELGFBQU8sSUFBUDtBQUNEOzs7O0VBckJnQ0ssNEIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuXG5pbXBvcnQgdHlwZSB7IFN0YXJ0RHJhZ2dpbmdFdmVudCwgTW9kZVByb3BzIH0gZnJvbSAnLi4vdHlwZXMuanMnO1xuaW1wb3J0IHR5cGUgeyBGZWF0dXJlQ29sbGVjdGlvbiB9IGZyb20gJy4uL2dlb2pzb24tdHlwZXMuanMnO1xuaW1wb3J0IHR5cGUgeyBHZW9Kc29uRWRpdEFjdGlvbiB9IGZyb20gJy4vZ2VvanNvbi1lZGl0LW1vZGUuanMnO1xuaW1wb3J0IHsgVHJhbnNsYXRlTW9kZSB9IGZyb20gJy4vdHJhbnNsYXRlLW1vZGUuanMnO1xuXG5leHBvcnQgY2xhc3MgRHVwbGljYXRlTW9kZSBleHRlbmRzIFRyYW5zbGF0ZU1vZGUge1xuICBoYW5kbGVTdGFydERyYWdnaW5nQWRhcHRlcihcbiAgICBldmVudDogU3RhcnREcmFnZ2luZ0V2ZW50LFxuICAgIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+XG4gICk6ID9HZW9Kc29uRWRpdEFjdGlvbiB7XG4gICAgaWYgKCF0aGlzLl9pc1RyYW5zbGF0YWJsZSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgdGhpcy5fZ2VvbWV0cnlCZWZvcmVUcmFuc2xhdGUgPSB0aGlzLmdldFNlbGVjdGVkRmVhdHVyZXNBc0ZlYXR1cmVDb2xsZWN0aW9uKHByb3BzKTtcblxuICAgIHJldHVybiB0aGlzLl9nZW9tZXRyeUJlZm9yZVRyYW5zbGF0ZVxuICAgICAgPyB0aGlzLmdldEFkZE1hbnlGZWF0dXJlc0FjdGlvbih0aGlzLl9nZW9tZXRyeUJlZm9yZVRyYW5zbGF0ZSwgcHJvcHMuZGF0YSlcbiAgICAgIDogbnVsbDtcbiAgfVxuXG4gIGdldEN1cnNvckFkYXB0ZXIoKTogP3N0cmluZyB7XG4gICAgaWYgKHRoaXMuX2lzVHJhbnNsYXRhYmxlKSB7XG4gICAgICByZXR1cm4gJ2NvcHknO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuIl19