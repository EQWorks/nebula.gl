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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL3R3by1jbGljay1wb2x5Z29uLWhhbmRsZXIuanMiXSwibmFtZXMiOlsiVHdvQ2xpY2tQb2x5Z29uSGFuZGxlciIsImV2ZW50IiwidGVudGF0aXZlRmVhdHVyZSIsImdldFRlbnRhdGl2ZUZlYXR1cmUiLCJjbGlja1NlcXVlbmNlIiwiZ2V0Q2xpY2tTZXF1ZW5jZSIsImxlbmd0aCIsImdlb21ldHJ5IiwidHlwZSIsImVkaXRBY3Rpb24iLCJnZXRBZGRGZWF0dXJlT3JCb29sZWFuUG9seWdvbkFjdGlvbiIsInJlc2V0Q2xpY2tTZXF1ZW5jZSIsIl9zZXRUZW50YXRpdmVGZWF0dXJlIiwiTW9kZUhhbmRsZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFHQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBR2FBLHNCOzs7Ozs7Ozs7Ozs7O2dDQUNDQyxLLEVBQWdDO0FBQzFDLDhGQUFrQkEsS0FBbEI7O0FBRUEsVUFBTUMsZ0JBQWdCLEdBQUcsS0FBS0MsbUJBQUwsRUFBekI7QUFDQSxVQUFNQyxhQUFhLEdBQUcsS0FBS0MsZ0JBQUwsRUFBdEI7O0FBRUEsVUFDRUQsYUFBYSxDQUFDRSxNQUFkLEdBQXVCLENBQXZCLElBQ0FKLGdCQURBLElBRUFBLGdCQUFnQixDQUFDSyxRQUFqQixDQUEwQkMsSUFBMUIsS0FBbUMsU0FIckMsRUFJRTtBQUNBLFlBQU1DLFVBQVUsR0FBRyxLQUFLQyxtQ0FBTCxDQUF5Q1IsZ0JBQWdCLENBQUNLLFFBQTFELENBQW5CO0FBQ0EsYUFBS0ksa0JBQUw7O0FBQ0EsYUFBS0Msb0JBQUwsQ0FBMEIsSUFBMUI7O0FBQ0EsZUFBT0gsVUFBUDtBQUNEOztBQUVELGFBQU8sSUFBUDtBQUNEOzs7O0VBbkJ5Q0ksd0IiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuXG5pbXBvcnQgdHlwZSB7IENsaWNrRXZlbnQgfSBmcm9tICcuLi9ldmVudC10eXBlcy5qcyc7XG5pbXBvcnQgeyBNb2RlSGFuZGxlciB9IGZyb20gJy4vbW9kZS1oYW5kbGVyLmpzJztcbmltcG9ydCB0eXBlIHsgRWRpdEFjdGlvbiB9IGZyb20gJy4vbW9kZS1oYW5kbGVyLmpzJztcblxuZXhwb3J0IGNsYXNzIFR3b0NsaWNrUG9seWdvbkhhbmRsZXIgZXh0ZW5kcyBNb2RlSGFuZGxlciB7XG4gIGhhbmRsZUNsaWNrKGV2ZW50OiBDbGlja0V2ZW50KTogP0VkaXRBY3Rpb24ge1xuICAgIHN1cGVyLmhhbmRsZUNsaWNrKGV2ZW50KTtcblxuICAgIGNvbnN0IHRlbnRhdGl2ZUZlYXR1cmUgPSB0aGlzLmdldFRlbnRhdGl2ZUZlYXR1cmUoKTtcbiAgICBjb25zdCBjbGlja1NlcXVlbmNlID0gdGhpcy5nZXRDbGlja1NlcXVlbmNlKCk7XG5cbiAgICBpZiAoXG4gICAgICBjbGlja1NlcXVlbmNlLmxlbmd0aCA+IDEgJiZcbiAgICAgIHRlbnRhdGl2ZUZlYXR1cmUgJiZcbiAgICAgIHRlbnRhdGl2ZUZlYXR1cmUuZ2VvbWV0cnkudHlwZSA9PT0gJ1BvbHlnb24nXG4gICAgKSB7XG4gICAgICBjb25zdCBlZGl0QWN0aW9uID0gdGhpcy5nZXRBZGRGZWF0dXJlT3JCb29sZWFuUG9seWdvbkFjdGlvbih0ZW50YXRpdmVGZWF0dXJlLmdlb21ldHJ5KTtcbiAgICAgIHRoaXMucmVzZXRDbGlja1NlcXVlbmNlKCk7XG4gICAgICB0aGlzLl9zZXRUZW50YXRpdmVGZWF0dXJlKG51bGwpO1xuICAgICAgcmV0dXJuIGVkaXRBY3Rpb247XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cbiJdfQ==