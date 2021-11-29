"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DrawPointMode = void 0;

var _geojsonEditMode = require("./geojson-edit-mode.js");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var DrawPointMode =
/*#__PURE__*/
function (_BaseGeoJsonEditMode) {
  _inherits(DrawPointMode, _BaseGeoJsonEditMode);

  function DrawPointMode() {
    _classCallCheck(this, DrawPointMode);

    return _possibleConstructorReturn(this, _getPrototypeOf(DrawPointMode).apply(this, arguments));
  }

  _createClass(DrawPointMode, [{
    key: "handleClickAdapter",
    value: function handleClickAdapter(_ref, props) {
      var mapCoords = _ref.mapCoords;
      var geometry = {
        type: 'Point',
        coordinates: mapCoords
      };
      return this.getAddFeatureAction(geometry, props.data);
    }
  }, {
    key: "getCursorAdapter",
    value: function getCursorAdapter() {
      return 'cell';
    }
  }]);

  return DrawPointMode;
}(_geojsonEditMode.BaseGeoJsonEditMode);

exports.DrawPointMode = DrawPointMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvZHJhdy1wb2ludC1tb2RlLmpzIl0sIm5hbWVzIjpbIkRyYXdQb2ludE1vZGUiLCJwcm9wcyIsIm1hcENvb3JkcyIsImdlb21ldHJ5IiwidHlwZSIsImNvb3JkaW5hdGVzIiwiZ2V0QWRkRmVhdHVyZUFjdGlvbiIsImRhdGEiLCJCYXNlR2VvSnNvbkVkaXRNb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBSUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBRWFBLGE7Ozs7Ozs7Ozs7Ozs7NkNBR1RDLEssRUFDb0I7QUFBQSxVQUZsQkMsU0FFa0IsUUFGbEJBLFNBRWtCO0FBQ3BCLFVBQU1DLFFBQVEsR0FBRztBQUNmQyxRQUFBQSxJQUFJLEVBQUUsT0FEUztBQUVmQyxRQUFBQSxXQUFXLEVBQUVIO0FBRkUsT0FBakI7QUFLQSxhQUFPLEtBQUtJLG1CQUFMLENBQXlCSCxRQUF6QixFQUFtQ0YsS0FBSyxDQUFDTSxJQUF6QyxDQUFQO0FBQ0Q7Ozt1Q0FFa0I7QUFDakIsYUFBTyxNQUFQO0FBQ0Q7Ozs7RUFmZ0NDLG9DIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuaW1wb3J0IHR5cGUgeyBDbGlja0V2ZW50LCBNb2RlUHJvcHMgfSBmcm9tICcuLi90eXBlcy5qcyc7XG5pbXBvcnQgdHlwZSB7IEZlYXR1cmVDb2xsZWN0aW9uIH0gZnJvbSAnLi4vZ2VvanNvbi10eXBlcy5qcyc7XG5pbXBvcnQgeyBCYXNlR2VvSnNvbkVkaXRNb2RlLCB0eXBlIEdlb0pzb25FZGl0QWN0aW9uIH0gZnJvbSAnLi9nZW9qc29uLWVkaXQtbW9kZS5qcyc7XG5cbmV4cG9ydCBjbGFzcyBEcmF3UG9pbnRNb2RlIGV4dGVuZHMgQmFzZUdlb0pzb25FZGl0TW9kZSB7XG4gIGhhbmRsZUNsaWNrQWRhcHRlcihcbiAgICB7IG1hcENvb3JkcyB9OiBDbGlja0V2ZW50LFxuICAgIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+XG4gICk6ID9HZW9Kc29uRWRpdEFjdGlvbiB7XG4gICAgY29uc3QgZ2VvbWV0cnkgPSB7XG4gICAgICB0eXBlOiAnUG9pbnQnLFxuICAgICAgY29vcmRpbmF0ZXM6IG1hcENvb3Jkc1xuICAgIH07XG5cbiAgICByZXR1cm4gdGhpcy5nZXRBZGRGZWF0dXJlQWN0aW9uKGdlb21ldHJ5LCBwcm9wcy5kYXRhKTtcbiAgfVxuXG4gIGdldEN1cnNvckFkYXB0ZXIoKSB7XG4gICAgcmV0dXJuICdjZWxsJztcbiAgfVxufVxuIl19