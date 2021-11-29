"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ThreeClickPolygonMode = void 0;

var _geojsonEditMode = require("./geojson-edit-mode.js");

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

var ThreeClickPolygonMode =
/*#__PURE__*/
function (_BaseGeoJsonEditMode) {
  _inherits(ThreeClickPolygonMode, _BaseGeoJsonEditMode);

  function ThreeClickPolygonMode() {
    _classCallCheck(this, ThreeClickPolygonMode);

    return _possibleConstructorReturn(this, _getPrototypeOf(ThreeClickPolygonMode).apply(this, arguments));
  }

  _createClass(ThreeClickPolygonMode, [{
    key: "handleClickAdapter",
    value: function handleClickAdapter(event, props) {
      _get(_getPrototypeOf(ThreeClickPolygonMode.prototype), "handleClickAdapter", this).call(this, event, props);

      var tentativeFeature = this.getTentativeFeature();
      var clickSequence = this.getClickSequence();

      if (clickSequence.length > 2 && tentativeFeature && tentativeFeature.geometry.type === 'Polygon') {
        var editAction = this.getAddFeatureOrBooleanPolygonAction(tentativeFeature.geometry, props);
        this.resetClickSequence();

        this._setTentativeFeature(null);

        return editAction;
      }

      return null;
    }
  }, {
    key: "getCursorAdapter",
    value: function getCursorAdapter() {
      return 'cell';
    }
  }]);

  return ThreeClickPolygonMode;
}(_geojsonEditMode.BaseGeoJsonEditMode);

exports.ThreeClickPolygonMode = ThreeClickPolygonMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvdGhyZWUtY2xpY2stcG9seWdvbi1tb2RlLmpzIl0sIm5hbWVzIjpbIlRocmVlQ2xpY2tQb2x5Z29uTW9kZSIsImV2ZW50IiwicHJvcHMiLCJ0ZW50YXRpdmVGZWF0dXJlIiwiZ2V0VGVudGF0aXZlRmVhdHVyZSIsImNsaWNrU2VxdWVuY2UiLCJnZXRDbGlja1NlcXVlbmNlIiwibGVuZ3RoIiwiZ2VvbWV0cnkiLCJ0eXBlIiwiZWRpdEFjdGlvbiIsImdldEFkZEZlYXR1cmVPckJvb2xlYW5Qb2x5Z29uQWN0aW9uIiwicmVzZXRDbGlja1NlcXVlbmNlIiwiX3NldFRlbnRhdGl2ZUZlYXR1cmUiLCJCYXNlR2VvSnNvbkVkaXRNb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBSUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUVhQSxxQjs7Ozs7Ozs7Ozs7Ozt1Q0FDUUMsSyxFQUFtQkMsSyxFQUF5RDtBQUM3RixvR0FBeUJELEtBQXpCLEVBQWdDQyxLQUFoQzs7QUFFQSxVQUFNQyxnQkFBZ0IsR0FBRyxLQUFLQyxtQkFBTCxFQUF6QjtBQUNBLFVBQU1DLGFBQWEsR0FBRyxLQUFLQyxnQkFBTCxFQUF0Qjs7QUFFQSxVQUNFRCxhQUFhLENBQUNFLE1BQWQsR0FBdUIsQ0FBdkIsSUFDQUosZ0JBREEsSUFFQUEsZ0JBQWdCLENBQUNLLFFBQWpCLENBQTBCQyxJQUExQixLQUFtQyxTQUhyQyxFQUlFO0FBQ0EsWUFBTUMsVUFBVSxHQUFHLEtBQUtDLG1DQUFMLENBQXlDUixnQkFBZ0IsQ0FBQ0ssUUFBMUQsRUFBb0VOLEtBQXBFLENBQW5CO0FBQ0EsYUFBS1Usa0JBQUw7O0FBQ0EsYUFBS0Msb0JBQUwsQ0FBMEIsSUFBMUI7O0FBQ0EsZUFBT0gsVUFBUDtBQUNEOztBQUVELGFBQU8sSUFBUDtBQUNEOzs7dUNBRWtCO0FBQ2pCLGFBQU8sTUFBUDtBQUNEOzs7O0VBdkJ3Q0ksb0MiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuXG5pbXBvcnQgdHlwZSB7IENsaWNrRXZlbnQsIE1vZGVQcm9wcyB9IGZyb20gJy4uL3R5cGVzLmpzJztcbmltcG9ydCB0eXBlIHsgRmVhdHVyZUNvbGxlY3Rpb24gfSBmcm9tICcuLi9nZW9qc29uLXR5cGVzLmpzJztcbmltcG9ydCB7IEJhc2VHZW9Kc29uRWRpdE1vZGUsIHR5cGUgR2VvSnNvbkVkaXRBY3Rpb24gfSBmcm9tICcuL2dlb2pzb24tZWRpdC1tb2RlLmpzJztcblxuZXhwb3J0IGNsYXNzIFRocmVlQ2xpY2tQb2x5Z29uTW9kZSBleHRlbmRzIEJhc2VHZW9Kc29uRWRpdE1vZGUge1xuICBoYW5kbGVDbGlja0FkYXB0ZXIoZXZlbnQ6IENsaWNrRXZlbnQsIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KTogP0dlb0pzb25FZGl0QWN0aW9uIHtcbiAgICBzdXBlci5oYW5kbGVDbGlja0FkYXB0ZXIoZXZlbnQsIHByb3BzKTtcblxuICAgIGNvbnN0IHRlbnRhdGl2ZUZlYXR1cmUgPSB0aGlzLmdldFRlbnRhdGl2ZUZlYXR1cmUoKTtcbiAgICBjb25zdCBjbGlja1NlcXVlbmNlID0gdGhpcy5nZXRDbGlja1NlcXVlbmNlKCk7XG5cbiAgICBpZiAoXG4gICAgICBjbGlja1NlcXVlbmNlLmxlbmd0aCA+IDIgJiZcbiAgICAgIHRlbnRhdGl2ZUZlYXR1cmUgJiZcbiAgICAgIHRlbnRhdGl2ZUZlYXR1cmUuZ2VvbWV0cnkudHlwZSA9PT0gJ1BvbHlnb24nXG4gICAgKSB7XG4gICAgICBjb25zdCBlZGl0QWN0aW9uID0gdGhpcy5nZXRBZGRGZWF0dXJlT3JCb29sZWFuUG9seWdvbkFjdGlvbih0ZW50YXRpdmVGZWF0dXJlLmdlb21ldHJ5LCBwcm9wcyk7XG4gICAgICB0aGlzLnJlc2V0Q2xpY2tTZXF1ZW5jZSgpO1xuICAgICAgdGhpcy5fc2V0VGVudGF0aXZlRmVhdHVyZShudWxsKTtcbiAgICAgIHJldHVybiBlZGl0QWN0aW9uO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZ2V0Q3Vyc29yQWRhcHRlcigpIHtcbiAgICByZXR1cm4gJ2NlbGwnO1xuICB9XG59XG4iXX0=