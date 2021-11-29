"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _keplerOutdatedDeck = require("kepler-outdated-deck.gl-core");

var _keplerOutdatedDeck2 = require("kepler-outdated-deck.gl-layers");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var JunctionScatterplotLayer =
/*#__PURE__*/
function (_CompositeLayer) {
  _inherits(JunctionScatterplotLayer, _CompositeLayer);

  function JunctionScatterplotLayer() {
    _classCallCheck(this, JunctionScatterplotLayer);

    return _possibleConstructorReturn(this, _getPrototypeOf(JunctionScatterplotLayer).apply(this, arguments));
  }

  _createClass(JunctionScatterplotLayer, [{
    key: "renderLayers",
    value: function renderLayers() {
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
  }]);

  return JunctionScatterplotLayer;
  }(_keplerOutdatedDeck.CompositeLayer);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sYXllcnMvanVuY3Rpb24tc2NhdHRlcnBsb3QtbGF5ZXIuanMiXSwibmFtZXMiOlsiSnVuY3Rpb25TY2F0dGVycGxvdExheWVyIiwicHJvcHMiLCJpZCIsImdldEZpbGxDb2xvciIsImdldFN0cm9rZUNvbG9yIiwiZ2V0SW5uZXJSYWRpdXMiLCJ1cGRhdGVUcmlnZ2VycyIsIlNjYXR0ZXJwbG90TGF5ZXIiLCJkYXRhIiwiZ2V0Q29sb3IiLCJnZXRSYWRpdXMiLCJwaWNrYWJsZSIsIkNvbXBvc2l0ZUxheWVyIiwiZGVmYXVsdFByb3BzIiwiZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFFcUJBLHdCOzs7Ozs7Ozs7Ozs7O21DQVNKO0FBQUEsd0JBQ2dFLEtBQUtDLEtBRHJFO0FBQUEsVUFDTEMsRUFESyxlQUNMQSxFQURLO0FBQUEsVUFDREMsWUFEQyxlQUNEQSxZQURDO0FBQUEsVUFDYUMsY0FEYixlQUNhQSxjQURiO0FBQUEsVUFDNkJDLGNBRDdCLGVBQzZCQSxjQUQ3QjtBQUFBLFVBQzZDQyxjQUQ3QyxlQUM2Q0EsY0FEN0MsRUFHYjs7QUFDQSxhQUFPLENBQ0w7QUFDQSxVQUFJQyxvQ0FBSixtQkFDSyxLQUFLTixLQURWO0FBRUVDLFFBQUFBLEVBQUUsWUFBS0EsRUFBTCxVQUZKO0FBR0VNLFFBQUFBLElBQUksRUFBRSxLQUFLUCxLQUFMLENBQVdPLElBSG5CO0FBSUVDLFFBQUFBLFFBQVEsRUFBRUwsY0FKWjtBQUtFRSxRQUFBQSxjQUFjLG9CQUNUQSxjQURTO0FBRVpHLFVBQUFBLFFBQVEsRUFBRUgsY0FBYyxDQUFDRjtBQUZiO0FBTGhCLFNBRkssRUFZTDtBQUNBLFVBQUlHLG9DQUFKLG1CQUNLLEtBQUtOLEtBRFY7QUFFRUMsUUFBQUEsRUFBRSxZQUFLQSxFQUFMLFdBRko7QUFHRU0sUUFBQUEsSUFBSSxFQUFFLEtBQUtQLEtBQUwsQ0FBV08sSUFIbkI7QUFJRUMsUUFBQUEsUUFBUSxFQUFFTixZQUpaO0FBS0VPLFFBQUFBLFNBQVMsRUFBRUwsY0FMYjtBQU1FTSxRQUFBQSxRQUFRLEVBQUUsS0FOWjtBQU9FTCxRQUFBQSxjQUFjLG9CQUNUQSxjQURTO0FBRVpHLFVBQUFBLFFBQVEsRUFBRUgsY0FBYyxDQUFDSCxZQUZiO0FBR1pPLFVBQUFBLFNBQVMsRUFBRUosY0FBYyxDQUFDRDtBQUhkO0FBUGhCLFNBYkssQ0FBUDtBQTJCRDs7OztFQXhDbURPLGlDOzs7O2dCQUFqQ1osd0IsZUFDQSwwQjs7Z0JBREFBLHdCLG9DQUdkTyxxQ0FBaUJNLFk7QUFDcEJWLEVBQUFBLFlBQVksRUFBRSxzQkFBQVcsQ0FBQztBQUFBLFdBQUksQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsRUFBVSxHQUFWLENBQUo7QUFBQSxHO0FBQ2ZWLEVBQUFBLGNBQWMsRUFBRSx3QkFBQVUsQ0FBQztBQUFBLFdBQUksQ0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEdBQVgsRUFBZ0IsR0FBaEIsQ0FBSjtBQUFBLEc7QUFDakJULEVBQUFBLGNBQWMsRUFBRSx3QkFBQVMsQ0FBQztBQUFBLFdBQUksQ0FBSjtBQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcbmltcG9ydCB7IENvbXBvc2l0ZUxheWVyIH0gZnJvbSAna2VwbGVyLW91ZGF0ZWQtZGVjay5nbC1jb3JlJztcbmltcG9ydCB7IFNjYXR0ZXJwbG90TGF5ZXIgfSBmcm9tICdrZXBsZXItb3VkYXRlZC1kZWNrLmdsLWxheWVycyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEp1bmN0aW9uU2NhdHRlcnBsb3RMYXllciBleHRlbmRzIENvbXBvc2l0ZUxheWVyIHtcbiAgc3RhdGljIGxheWVyTmFtZSA9ICdKdW5jdGlvblNjYXR0ZXJwbG90TGF5ZXInO1xuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIC4uLlNjYXR0ZXJwbG90TGF5ZXIuZGVmYXVsdFByb3BzLFxuICAgIGdldEZpbGxDb2xvcjogZCA9PiBbMCwgMCwgMCwgMjU1XSxcbiAgICBnZXRTdHJva2VDb2xvcjogZCA9PiBbMjU1LCAyNTUsIDI1NSwgMjU1XSxcbiAgICBnZXRJbm5lclJhZGl1czogZCA9PiAxXG4gIH07XG5cbiAgcmVuZGVyTGF5ZXJzKCkge1xuICAgIGNvbnN0IHsgaWQsIGdldEZpbGxDb2xvciwgZ2V0U3Ryb2tlQ29sb3IsIGdldElubmVyUmFkaXVzLCB1cGRhdGVUcmlnZ2VycyB9ID0gdGhpcy5wcm9wcztcblxuICAgIC8vIGRhdGEgbmVlZHMgdG8gYmUgcGFzc2VkIGV4cGxpY2l0bHkgYWZ0ZXIgZGVjay5nbCA1LjNcbiAgICByZXR1cm4gW1xuICAgICAgLy8gdGhlIGZ1bGwgY2lyY2xlc1xuICAgICAgbmV3IFNjYXR0ZXJwbG90TGF5ZXIoe1xuICAgICAgICAuLi50aGlzLnByb3BzLFxuICAgICAgICBpZDogYCR7aWR9LWZ1bGxgLFxuICAgICAgICBkYXRhOiB0aGlzLnByb3BzLmRhdGEsXG4gICAgICAgIGdldENvbG9yOiBnZXRTdHJva2VDb2xvcixcbiAgICAgICAgdXBkYXRlVHJpZ2dlcnM6IHtcbiAgICAgICAgICAuLi51cGRhdGVUcmlnZ2VycyxcbiAgICAgICAgICBnZXRDb2xvcjogdXBkYXRlVHJpZ2dlcnMuZ2V0U3Ryb2tlQ29sb3JcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgICAvLyB0aGUgaW5uZXIgcGFydFxuICAgICAgbmV3IFNjYXR0ZXJwbG90TGF5ZXIoe1xuICAgICAgICAuLi50aGlzLnByb3BzLFxuICAgICAgICBpZDogYCR7aWR9LWlubmVyYCxcbiAgICAgICAgZGF0YTogdGhpcy5wcm9wcy5kYXRhLFxuICAgICAgICBnZXRDb2xvcjogZ2V0RmlsbENvbG9yLFxuICAgICAgICBnZXRSYWRpdXM6IGdldElubmVyUmFkaXVzLFxuICAgICAgICBwaWNrYWJsZTogZmFsc2UsXG4gICAgICAgIHVwZGF0ZVRyaWdnZXJzOiB7XG4gICAgICAgICAgLi4udXBkYXRlVHJpZ2dlcnMsXG4gICAgICAgICAgZ2V0Q29sb3I6IHVwZGF0ZVRyaWdnZXJzLmdldEZpbGxDb2xvcixcbiAgICAgICAgICBnZXRSYWRpdXM6IHVwZGF0ZVRyaWdnZXJzLmdldElubmVyUmFkaXVzXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgXTtcbiAgfVxufVxuIl19
