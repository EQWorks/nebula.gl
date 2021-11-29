"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TwoClickPolygonHandler = void 0;

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

// TODO edit-modes: delete handlers once EditMode fully implemented
var TwoClickPolygonHandler =
/*#__PURE__*/
function (_ModeHandler) {
  _inherits(TwoClickPolygonHandler, _ModeHandler);

  function TwoClickPolygonHandler() {
    _classCallCheck(this, TwoClickPolygonHandler);

    return _possibleConstructorReturn(this, _getPrototypeOf(TwoClickPolygonHandler).apply(this, arguments));
  }

  _createClass(TwoClickPolygonHandler, [{
    key: "handleClick",
    value: function handleClick(event) {
      _get(_getPrototypeOf(TwoClickPolygonHandler.prototype), "handleClick", this).call(this, event);

      var tentativeFeature = this.getTentativeFeature();
      var clickSequence = this.getClickSequence();

      if (clickSequence.length > 1 && tentativeFeature && tentativeFeature.geometry.type === 'Polygon') {
        var editAction = this.getAddFeatureOrBooleanPolygonAction(tentativeFeature.geometry);
        this.resetClickSequence();

        this._setTentativeFeature(null);

        return editAction;
      }

      return null;
    }
  }]);

  return TwoClickPolygonHandler;
}(_modeHandler.ModeHandler);

exports.TwoClickPolygonHandler = TwoClickPolygonHandler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL3R3by1jbGljay1wb2x5Z29uLWhhbmRsZXIuanMiXSwibmFtZXMiOlsiVHdvQ2xpY2tQb2x5Z29uSGFuZGxlciIsImV2ZW50IiwidGVudGF0aXZlRmVhdHVyZSIsImdldFRlbnRhdGl2ZUZlYXR1cmUiLCJjbGlja1NlcXVlbmNlIiwiZ2V0Q2xpY2tTZXF1ZW5jZSIsImxlbmd0aCIsImdlb21ldHJ5IiwidHlwZSIsImVkaXRBY3Rpb24iLCJnZXRBZGRGZWF0dXJlT3JCb29sZWFuUG9seWdvbkFjdGlvbiIsInJlc2V0Q2xpY2tTZXF1ZW5jZSIsIl9zZXRUZW50YXRpdmVGZWF0dXJlIiwiTW9kZUhhbmRsZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFHQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBR0E7SUFDYUEsc0I7Ozs7Ozs7Ozs7Ozs7Z0NBQ0NDLEssRUFBZ0M7QUFDMUMsOEZBQWtCQSxLQUFsQjs7QUFFQSxVQUFNQyxnQkFBZ0IsR0FBRyxLQUFLQyxtQkFBTCxFQUF6QjtBQUNBLFVBQU1DLGFBQWEsR0FBRyxLQUFLQyxnQkFBTCxFQUF0Qjs7QUFFQSxVQUNFRCxhQUFhLENBQUNFLE1BQWQsR0FBdUIsQ0FBdkIsSUFDQUosZ0JBREEsSUFFQUEsZ0JBQWdCLENBQUNLLFFBQWpCLENBQTBCQyxJQUExQixLQUFtQyxTQUhyQyxFQUlFO0FBQ0EsWUFBTUMsVUFBVSxHQUFHLEtBQUtDLG1DQUFMLENBQXlDUixnQkFBZ0IsQ0FBQ0ssUUFBMUQsQ0FBbkI7QUFDQSxhQUFLSSxrQkFBTDs7QUFDQSxhQUFLQyxvQkFBTCxDQUEwQixJQUExQjs7QUFDQSxlQUFPSCxVQUFQO0FBQ0Q7O0FBRUQsYUFBTyxJQUFQO0FBQ0Q7Ozs7RUFuQnlDSSx3QiIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbmltcG9ydCB0eXBlIHsgQ2xpY2tFdmVudCB9IGZyb20gJy4uL2V2ZW50LXR5cGVzLmpzJztcbmltcG9ydCB7IE1vZGVIYW5kbGVyIH0gZnJvbSAnLi9tb2RlLWhhbmRsZXIuanMnO1xuaW1wb3J0IHR5cGUgeyBFZGl0QWN0aW9uIH0gZnJvbSAnLi9tb2RlLWhhbmRsZXIuanMnO1xuXG4vLyBUT0RPIGVkaXQtbW9kZXM6IGRlbGV0ZSBoYW5kbGVycyBvbmNlIEVkaXRNb2RlIGZ1bGx5IGltcGxlbWVudGVkXG5leHBvcnQgY2xhc3MgVHdvQ2xpY2tQb2x5Z29uSGFuZGxlciBleHRlbmRzIE1vZGVIYW5kbGVyIHtcbiAgaGFuZGxlQ2xpY2soZXZlbnQ6IENsaWNrRXZlbnQpOiA/RWRpdEFjdGlvbiB7XG4gICAgc3VwZXIuaGFuZGxlQ2xpY2soZXZlbnQpO1xuXG4gICAgY29uc3QgdGVudGF0aXZlRmVhdHVyZSA9IHRoaXMuZ2V0VGVudGF0aXZlRmVhdHVyZSgpO1xuICAgIGNvbnN0IGNsaWNrU2VxdWVuY2UgPSB0aGlzLmdldENsaWNrU2VxdWVuY2UoKTtcblxuICAgIGlmIChcbiAgICAgIGNsaWNrU2VxdWVuY2UubGVuZ3RoID4gMSAmJlxuICAgICAgdGVudGF0aXZlRmVhdHVyZSAmJlxuICAgICAgdGVudGF0aXZlRmVhdHVyZS5nZW9tZXRyeS50eXBlID09PSAnUG9seWdvbidcbiAgICApIHtcbiAgICAgIGNvbnN0IGVkaXRBY3Rpb24gPSB0aGlzLmdldEFkZEZlYXR1cmVPckJvb2xlYW5Qb2x5Z29uQWN0aW9uKHRlbnRhdGl2ZUZlYXR1cmUuZ2VvbWV0cnkpO1xuICAgICAgdGhpcy5yZXNldENsaWNrU2VxdWVuY2UoKTtcbiAgICAgIHRoaXMuX3NldFRlbnRhdGl2ZUZlYXR1cmUobnVsbCk7XG4gICAgICByZXR1cm4gZWRpdEFjdGlvbjtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuIl19