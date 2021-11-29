"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _keplerOutdatedDeck = require("kepler-outdated-deck.gl-core");

var _keplerOutdatedDeck2 = require("kepler-outdated-deck.gl-layers");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class JunctionScatterplotLayer extends _keplerOutdatedDeck.CompositeLayer {
  renderLayers() {
    var _this$props = this.props,
        id = _this$props.id,
        getFillColor = _this$props.getFillColor,
        getStrokeColor = _this$props.getStrokeColor,
        getInnerRadius = _this$props.getInnerRadius,
        updateTriggers = _this$props.updateTriggers; // data needs to be passed explicitly after deck.gl 5.3

    return [// the full circles
    new _keplerOutdatedDeck2.ScatterplotLayer(_objectSpread({}, this.props, {
      id: "".concat(id, "-full"),
      data: this.props.data,
      getColor: getStrokeColor,
      updateTriggers: _objectSpread({}, updateTriggers, {
        getColor: updateTriggers.getStrokeColor
      })
    })), // the inner part
    new _keplerOutdatedDeck2.ScatterplotLayer(_objectSpread({}, this.props, {
      id: "".concat(id, "-inner"),
      data: this.props.data,
      getColor: getFillColor,
      getRadius: getInnerRadius,
      pickable: false,
      updateTriggers: _objectSpread({}, updateTriggers, {
        getColor: updateTriggers.getFillColor,
        getRadius: updateTriggers.getInnerRadius
      })
    }))];
  }

}

exports.default = JunctionScatterplotLayer;

_defineProperty(JunctionScatterplotLayer, "layerName", 'JunctionScatterplotLayer');

_defineProperty(JunctionScatterplotLayer, "defaultProps", _objectSpread({}, _keplerOutdatedDeck2.ScatterplotLayer.defaultProps, {
  getFillColor: function getFillColor(d) {
    return [0, 0, 0, 255];
  },
  getStrokeColor: function getStrokeColor(d) {
    return [255, 255, 255, 255];
  },
  getInnerRadius: function getInnerRadius(d) {
    return 1;
  }
}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sYXllcnMvanVuY3Rpb24tc2NhdHRlcnBsb3QtbGF5ZXIuanMiXSwibmFtZXMiOlsiSnVuY3Rpb25TY2F0dGVycGxvdExheWVyIiwiQ29tcG9zaXRlTGF5ZXIiLCJyZW5kZXJMYXllcnMiLCJwcm9wcyIsImlkIiwiZ2V0RmlsbENvbG9yIiwiZ2V0U3Ryb2tlQ29sb3IiLCJnZXRJbm5lclJhZGl1cyIsInVwZGF0ZVRyaWdnZXJzIiwiU2NhdHRlcnBsb3RMYXllciIsImRhdGEiLCJnZXRDb2xvciIsImdldFJhZGl1cyIsInBpY2thYmxlIiwiZGVmYXVsdFByb3BzIiwiZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNBOztBQUNBOzs7Ozs7QUFFZSxNQUFNQSx3QkFBTixTQUF1Q0Msa0NBQXZDLENBQXNEO0FBU25FQyxFQUFBQSxZQUFZLEdBQUc7QUFBQSxzQkFDZ0UsS0FBS0MsS0FEckU7QUFBQSxRQUNMQyxFQURLLGVBQ0xBLEVBREs7QUFBQSxRQUNEQyxZQURDLGVBQ0RBLFlBREM7QUFBQSxRQUNhQyxjQURiLGVBQ2FBLGNBRGI7QUFBQSxRQUM2QkMsY0FEN0IsZUFDNkJBLGNBRDdCO0FBQUEsUUFDNkNDLGNBRDdDLGVBQzZDQSxjQUQ3QyxFQUdiOztBQUNBLFdBQU8sQ0FDTDtBQUNBLFFBQUlDLHFDQUFKLG1CQUNLLEtBQUtOLEtBRFY7QUFFRUMsTUFBQUEsRUFBRSxZQUFLQSxFQUFMLFVBRko7QUFHRU0sTUFBQUEsSUFBSSxFQUFFLEtBQUtQLEtBQUwsQ0FBV08sSUFIbkI7QUFJRUMsTUFBQUEsUUFBUSxFQUFFTCxjQUpaO0FBS0VFLE1BQUFBLGNBQWMsb0JBQ1RBLGNBRFM7QUFFWkcsUUFBQUEsUUFBUSxFQUFFSCxjQUFjLENBQUNGO0FBRmI7QUFMaEIsT0FGSyxFQVlMO0FBQ0EsUUFBSUcscUNBQUosbUJBQ0ssS0FBS04sS0FEVjtBQUVFQyxNQUFBQSxFQUFFLFlBQUtBLEVBQUwsV0FGSjtBQUdFTSxNQUFBQSxJQUFJLEVBQUUsS0FBS1AsS0FBTCxDQUFXTyxJQUhuQjtBQUlFQyxNQUFBQSxRQUFRLEVBQUVOLFlBSlo7QUFLRU8sTUFBQUEsU0FBUyxFQUFFTCxjQUxiO0FBTUVNLE1BQUFBLFFBQVEsRUFBRSxLQU5aO0FBT0VMLE1BQUFBLGNBQWMsb0JBQ1RBLGNBRFM7QUFFWkcsUUFBQUEsUUFBUSxFQUFFSCxjQUFjLENBQUNILFlBRmI7QUFHWk8sUUFBQUEsU0FBUyxFQUFFSixjQUFjLENBQUNEO0FBSGQ7QUFQaEIsT0FiSyxDQUFQO0FBMkJEOztBQXhDa0U7Ozs7Z0JBQWhEUCx3QixlQUNBLDBCOztnQkFEQUEsd0Isb0NBR2RTLHNDQUFpQkssWTtBQUNwQlQsRUFBQUEsWUFBWSxFQUFFLHNCQUFBVSxDQUFDO0FBQUEsV0FBSSxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLEdBQVYsQ0FBSjtBQUFBLEc7QUFDZlQsRUFBQUEsY0FBYyxFQUFFLHdCQUFBUyxDQUFDO0FBQUEsV0FBSSxDQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsR0FBWCxFQUFnQixHQUFoQixDQUFKO0FBQUEsRztBQUNqQlIsRUFBQUEsY0FBYyxFQUFFLHdCQUFBUSxDQUFDO0FBQUEsV0FBSSxDQUFKO0FBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuaW1wb3J0IHsgQ29tcG9zaXRlTGF5ZXIgfSBmcm9tICdrZXBsZXItb3V0ZGF0ZWQtZGVjay5nbC1jb3JlJztcbmltcG9ydCB7IFNjYXR0ZXJwbG90TGF5ZXIgfSBmcm9tICdrZXBsZXItb3V0ZGF0ZWQtZGVjay5nbC1sYXllcnMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBKdW5jdGlvblNjYXR0ZXJwbG90TGF5ZXIgZXh0ZW5kcyBDb21wb3NpdGVMYXllciB7XG4gIHN0YXRpYyBsYXllck5hbWUgPSAnSnVuY3Rpb25TY2F0dGVycGxvdExheWVyJztcbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICAuLi5TY2F0dGVycGxvdExheWVyLmRlZmF1bHRQcm9wcyxcbiAgICBnZXRGaWxsQ29sb3I6IGQgPT4gWzAsIDAsIDAsIDI1NV0sXG4gICAgZ2V0U3Ryb2tlQ29sb3I6IGQgPT4gWzI1NSwgMjU1LCAyNTUsIDI1NV0sXG4gICAgZ2V0SW5uZXJSYWRpdXM6IGQgPT4gMVxuICB9O1xuXG4gIHJlbmRlckxheWVycygpIHtcbiAgICBjb25zdCB7IGlkLCBnZXRGaWxsQ29sb3IsIGdldFN0cm9rZUNvbG9yLCBnZXRJbm5lclJhZGl1cywgdXBkYXRlVHJpZ2dlcnMgfSA9IHRoaXMucHJvcHM7XG5cbiAgICAvLyBkYXRhIG5lZWRzIHRvIGJlIHBhc3NlZCBleHBsaWNpdGx5IGFmdGVyIGRlY2suZ2wgNS4zXG4gICAgcmV0dXJuIFtcbiAgICAgIC8vIHRoZSBmdWxsIGNpcmNsZXNcbiAgICAgIG5ldyBTY2F0dGVycGxvdExheWVyKHtcbiAgICAgICAgLi4udGhpcy5wcm9wcyxcbiAgICAgICAgaWQ6IGAke2lkfS1mdWxsYCxcbiAgICAgICAgZGF0YTogdGhpcy5wcm9wcy5kYXRhLFxuICAgICAgICBnZXRDb2xvcjogZ2V0U3Ryb2tlQ29sb3IsXG4gICAgICAgIHVwZGF0ZVRyaWdnZXJzOiB7XG4gICAgICAgICAgLi4udXBkYXRlVHJpZ2dlcnMsXG4gICAgICAgICAgZ2V0Q29sb3I6IHVwZGF0ZVRyaWdnZXJzLmdldFN0cm9rZUNvbG9yXG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAgLy8gdGhlIGlubmVyIHBhcnRcbiAgICAgIG5ldyBTY2F0dGVycGxvdExheWVyKHtcbiAgICAgICAgLi4udGhpcy5wcm9wcyxcbiAgICAgICAgaWQ6IGAke2lkfS1pbm5lcmAsXG4gICAgICAgIGRhdGE6IHRoaXMucHJvcHMuZGF0YSxcbiAgICAgICAgZ2V0Q29sb3I6IGdldEZpbGxDb2xvcixcbiAgICAgICAgZ2V0UmFkaXVzOiBnZXRJbm5lclJhZGl1cyxcbiAgICAgICAgcGlja2FibGU6IGZhbHNlLFxuICAgICAgICB1cGRhdGVUcmlnZ2Vyczoge1xuICAgICAgICAgIC4uLnVwZGF0ZVRyaWdnZXJzLFxuICAgICAgICAgIGdldENvbG9yOiB1cGRhdGVUcmlnZ2Vycy5nZXRGaWxsQ29sb3IsXG4gICAgICAgICAgZ2V0UmFkaXVzOiB1cGRhdGVUcmlnZ2Vycy5nZXRJbm5lclJhZGl1c1xuICAgICAgICB9XG4gICAgICB9KVxuICAgIF07XG4gIH1cbn1cbiJdfQ==