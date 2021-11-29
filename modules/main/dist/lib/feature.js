"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Feature {
  // geo json coordinates
  constructor(geoJson, style) {
    var original = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var metadata = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    _defineProperty(this, "geoJson", void 0);

    _defineProperty(this, "style", void 0);

    _defineProperty(this, "original", void 0);

    _defineProperty(this, "metadata", void 0);

    this.geoJson = geoJson;
    this.style = style;
    this.original = original;
    this.metadata = metadata;
  }

  getCoords() {
    return this.geoJson.geometry.coordinates;
  }

}

exports.default = Feature;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvZmVhdHVyZS5qcyJdLCJuYW1lcyI6WyJGZWF0dXJlIiwiY29uc3RydWN0b3IiLCJnZW9Kc29uIiwic3R5bGUiLCJvcmlnaW5hbCIsIm1ldGFkYXRhIiwiZ2V0Q29vcmRzIiwiZ2VvbWV0cnkiLCJjb29yZGluYXRlcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBS2UsTUFBTUEsT0FBTixDQUFjO0FBQzNCO0FBTUFDLEVBQUFBLFdBQVcsQ0FDVEMsT0FEUyxFQUVUQyxLQUZTLEVBS1Q7QUFBQSxRQUZBQyxRQUVBLHVFQUZpQixJQUVqQjtBQUFBLFFBREFDLFFBQ0EsdUVBRG1CLEVBQ25COztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUNBLFNBQUtILE9BQUwsR0FBZUEsT0FBZjtBQUNBLFNBQUtDLEtBQUwsR0FBYUEsS0FBYjtBQUNBLFNBQUtDLFFBQUwsR0FBZ0JBLFFBQWhCO0FBQ0EsU0FBS0MsUUFBTCxHQUFnQkEsUUFBaEI7QUFDRDs7QUFFREMsRUFBQUEsU0FBUyxHQUFRO0FBQ2YsV0FBTyxLQUFLSixPQUFMLENBQWFLLFFBQWIsQ0FBc0JDLFdBQTdCO0FBQ0Q7O0FBckIwQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5pbXBvcnQgdHlwZSB7IEZlYXR1cmUgYXMgR2VvSnNvbiwgR2VvbWV0cnkgfSBmcm9tICdnZW9qc29uLXR5cGVzJztcblxuaW1wb3J0IHR5cGUgeyBTdHlsZSB9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmVhdHVyZSB7XG4gIC8vIGdlbyBqc29uIGNvb3JkaW5hdGVzXG4gIGdlb0pzb246IEdlb0pzb248R2VvbWV0cnk+O1xuICBzdHlsZTogU3R5bGU7XG4gIG9yaWdpbmFsOiA/YW55O1xuICBtZXRhZGF0YTogT2JqZWN0O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGdlb0pzb246IEdlb0pzb248R2VvbWV0cnk+LFxuICAgIHN0eWxlOiBTdHlsZSxcbiAgICBvcmlnaW5hbDogP2FueSA9IG51bGwsXG4gICAgbWV0YWRhdGE6IE9iamVjdCA9IHt9XG4gICkge1xuICAgIHRoaXMuZ2VvSnNvbiA9IGdlb0pzb247XG4gICAgdGhpcy5zdHlsZSA9IHN0eWxlO1xuICAgIHRoaXMub3JpZ2luYWwgPSBvcmlnaW5hbDtcbiAgICB0aGlzLm1ldGFkYXRhID0gbWV0YWRhdGE7XG4gIH1cblxuICBnZXRDb29yZHMoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5nZW9Kc29uLmdlb21ldHJ5LmNvb3JkaW5hdGVzO1xuICB9XG59XG4iXX0=