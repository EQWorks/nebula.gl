"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Feature =
/*#__PURE__*/
function () {
  // geo json coordinates
  function Feature(geoJson, style) {
    var original = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var metadata = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    _classCallCheck(this, Feature);

    _defineProperty(this, "geoJson", void 0);

    _defineProperty(this, "style", void 0);

    _defineProperty(this, "original", void 0);

    _defineProperty(this, "metadata", void 0);

    this.geoJson = geoJson;
    this.style = style;
    this.original = original;
    this.metadata = metadata;
  }

  _createClass(Feature, [{
    key: "getCoords",
    value: function getCoords() {
      return this.geoJson.geometry.coordinates;
    }
  }]);

  return Feature;
}();

exports.default = Feature;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvZmVhdHVyZS5qcyJdLCJuYW1lcyI6WyJGZWF0dXJlIiwiZ2VvSnNvbiIsInN0eWxlIiwib3JpZ2luYWwiLCJtZXRhZGF0YSIsImdlb21ldHJ5IiwiY29vcmRpbmF0ZXMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztJQUtxQkEsTzs7O0FBQ25CO0FBTUEsbUJBQ0VDLE9BREYsRUFFRUMsS0FGRixFQUtFO0FBQUEsUUFGQUMsUUFFQSx1RUFGaUIsSUFFakI7QUFBQSxRQURBQyxRQUNBLHVFQURtQixFQUNuQjs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFDQSxTQUFLSCxPQUFMLEdBQWVBLE9BQWY7QUFDQSxTQUFLQyxLQUFMLEdBQWFBLEtBQWI7QUFDQSxTQUFLQyxRQUFMLEdBQWdCQSxRQUFoQjtBQUNBLFNBQUtDLFFBQUwsR0FBZ0JBLFFBQWhCO0FBQ0Q7Ozs7Z0NBRWdCO0FBQ2YsYUFBTyxLQUFLSCxPQUFMLENBQWFJLFFBQWIsQ0FBc0JDLFdBQTdCO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuaW1wb3J0IHR5cGUgeyBGZWF0dXJlIGFzIEdlb0pzb24sIEdlb21ldHJ5IH0gZnJvbSAnZ2VvanNvbi10eXBlcyc7XG5cbmltcG9ydCB0eXBlIHsgU3R5bGUgfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZlYXR1cmUge1xuICAvLyBnZW8ganNvbiBjb29yZGluYXRlc1xuICBnZW9Kc29uOiBHZW9Kc29uPEdlb21ldHJ5PjtcbiAgc3R5bGU6IFN0eWxlO1xuICBvcmlnaW5hbDogP2FueTtcbiAgbWV0YWRhdGE6IE9iamVjdDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBnZW9Kc29uOiBHZW9Kc29uPEdlb21ldHJ5PixcbiAgICBzdHlsZTogU3R5bGUsXG4gICAgb3JpZ2luYWw6ID9hbnkgPSBudWxsLFxuICAgIG1ldGFkYXRhOiBPYmplY3QgPSB7fVxuICApIHtcbiAgICB0aGlzLmdlb0pzb24gPSBnZW9Kc29uO1xuICAgIHRoaXMuc3R5bGUgPSBzdHlsZTtcbiAgICB0aGlzLm9yaWdpbmFsID0gb3JpZ2luYWw7XG4gICAgdGhpcy5tZXRhZGF0YSA9IG1ldGFkYXRhO1xuICB9XG5cbiAgZ2V0Q29vcmRzKCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuZ2VvSnNvbi5nZW9tZXRyeS5jb29yZGluYXRlcztcbiAgfVxufVxuIl19