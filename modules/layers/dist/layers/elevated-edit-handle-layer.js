"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _keplerOutdatedDeck = require("kepler-outdated-deck.gl-core");

var _keplerOutdatedDeck2 = require("kepler-outdated-deck.gl-layers");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var defaultProps = {};

var ElevatedEditHandleLayer =
/*#__PURE__*/
function (_CompositeLayer) {
  _inherits(ElevatedEditHandleLayer, _CompositeLayer);

  function ElevatedEditHandleLayer() {
    _classCallCheck(this, ElevatedEditHandleLayer);

    return _possibleConstructorReturn(this, _getPrototypeOf(ElevatedEditHandleLayer).apply(this, arguments));
  }

  _createClass(ElevatedEditHandleLayer, [{
    key: "renderLayers",
    value: function renderLayers() {
      var handles = new _keplerOutdatedDeck2.ScatterplotLayer(Object.assign({}, this.props, {
        id: "".concat(this.props.id, "-ScatterplotLayer"),
        data: this.props.data
      }));
      var lines = new _keplerOutdatedDeck2.LineLayer(Object.assign({}, this.props, {
        id: "".concat(this.props.id, "-LineLayer"),
        data: this.props.data,
        pickable: false,
        getSourcePosition: function getSourcePosition(_ref) {
          var position = _ref.position;
          return [position[0], position[1], 0];
        },
        getTargetPosition: function getTargetPosition(_ref2) {
          var position = _ref2.position;
          return [position[0], position[1], position[2] || 0];
        },
        getColor: [150, 150, 150, 200],
        getStrokeWidth: 3
      }));
      return [handles, lines];
    }
  }]);

  return ElevatedEditHandleLayer;
}(_keplerOutdatedDeck.CompositeLayer);

exports.default = ElevatedEditHandleLayer;
ElevatedEditHandleLayer.layerName = 'ElevatedEditHandleLayer';
ElevatedEditHandleLayer.defaultProps = defaultProps;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sYXllcnMvZWxldmF0ZWQtZWRpdC1oYW5kbGUtbGF5ZXIuanMiXSwibmFtZXMiOlsiZGVmYXVsdFByb3BzIiwiRWxldmF0ZWRFZGl0SGFuZGxlTGF5ZXIiLCJoYW5kbGVzIiwiU2NhdHRlcnBsb3RMYXllciIsIk9iamVjdCIsImFzc2lnbiIsInByb3BzIiwiaWQiLCJkYXRhIiwibGluZXMiLCJMaW5lTGF5ZXIiLCJwaWNrYWJsZSIsImdldFNvdXJjZVBvc2l0aW9uIiwicG9zaXRpb24iLCJnZXRUYXJnZXRQb3NpdGlvbiIsImdldENvbG9yIiwiZ2V0U3Ryb2tlV2lkdGgiLCJDb21wb3NpdGVMYXllciIsImxheWVyTmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUdBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLFlBQVksR0FBRyxFQUFyQjs7SUFFcUJDLHVCOzs7Ozs7Ozs7Ozs7O21DQUNKO0FBQ2IsVUFBTUMsT0FBTyxHQUFHLElBQUlDLHFDQUFKLENBQ2RDLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLEVBQWQsRUFBa0IsS0FBS0MsS0FBdkIsRUFBOEI7QUFDNUJDLFFBQUFBLEVBQUUsWUFBSyxLQUFLRCxLQUFMLENBQVdDLEVBQWhCLHNCQUQwQjtBQUU1QkMsUUFBQUEsSUFBSSxFQUFFLEtBQUtGLEtBQUwsQ0FBV0U7QUFGVyxPQUE5QixDQURjLENBQWhCO0FBT0EsVUFBTUMsS0FBSyxHQUFHLElBQUlDLDhCQUFKLENBQ1pOLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLEVBQWQsRUFBa0IsS0FBS0MsS0FBdkIsRUFBOEI7QUFDNUJDLFFBQUFBLEVBQUUsWUFBSyxLQUFLRCxLQUFMLENBQVdDLEVBQWhCLGVBRDBCO0FBRTVCQyxRQUFBQSxJQUFJLEVBQUUsS0FBS0YsS0FBTCxDQUFXRSxJQUZXO0FBRzVCRyxRQUFBQSxRQUFRLEVBQUUsS0FIa0I7QUFJNUJDLFFBQUFBLGlCQUFpQixFQUFFO0FBQUEsY0FBR0MsUUFBSCxRQUFHQSxRQUFIO0FBQUEsaUJBQWtCLENBQUNBLFFBQVEsQ0FBQyxDQUFELENBQVQsRUFBY0EsUUFBUSxDQUFDLENBQUQsQ0FBdEIsRUFBMkIsQ0FBM0IsQ0FBbEI7QUFBQSxTQUpTO0FBSzVCQyxRQUFBQSxpQkFBaUIsRUFBRTtBQUFBLGNBQUdELFFBQUgsU0FBR0EsUUFBSDtBQUFBLGlCQUFrQixDQUFDQSxRQUFRLENBQUMsQ0FBRCxDQUFULEVBQWNBLFFBQVEsQ0FBQyxDQUFELENBQXRCLEVBQTJCQSxRQUFRLENBQUMsQ0FBRCxDQUFSLElBQWUsQ0FBMUMsQ0FBbEI7QUFBQSxTQUxTO0FBTTVCRSxRQUFBQSxRQUFRLEVBQUUsQ0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEdBQVgsRUFBZ0IsR0FBaEIsQ0FOa0I7QUFPNUJDLFFBQUFBLGNBQWMsRUFBRTtBQVBZLE9BQTlCLENBRFksQ0FBZDtBQVlBLGFBQU8sQ0FBQ2QsT0FBRCxFQUFVTyxLQUFWLENBQVA7QUFDRDs7OztFQXRCa0RRLGtDOzs7QUF5QnJEaEIsdUJBQXVCLENBQUNpQixTQUF4QixHQUFvQyx5QkFBcEM7QUFDQWpCLHVCQUF1QixDQUFDRCxZQUF4QixHQUF1Q0EsWUFBdkMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuLyogZXNsaW50LWVudiBicm93c2VyICovXG5cbmltcG9ydCB7IENvbXBvc2l0ZUxheWVyIH0gZnJvbSAna2VwbGVyLW91dGRhdGVkLWRlY2suZ2wtY29yZSc7XG5pbXBvcnQgeyBTY2F0dGVycGxvdExheWVyLCBMaW5lTGF5ZXIgfSBmcm9tICdrZXBsZXItb3V0ZGF0ZWQtZGVjay5nbC1sYXllcnMnO1xuXG5jb25zdCBkZWZhdWx0UHJvcHMgPSB7fTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWxldmF0ZWRFZGl0SGFuZGxlTGF5ZXIgZXh0ZW5kcyBDb21wb3NpdGVMYXllciB7XG4gIHJlbmRlckxheWVycygpIHtcbiAgICBjb25zdCBoYW5kbGVzID0gbmV3IFNjYXR0ZXJwbG90TGF5ZXIoXG4gICAgICBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnByb3BzLCB7XG4gICAgICAgIGlkOiBgJHt0aGlzLnByb3BzLmlkfS1TY2F0dGVycGxvdExheWVyYCxcbiAgICAgICAgZGF0YTogdGhpcy5wcm9wcy5kYXRhXG4gICAgICB9KVxuICAgICk7XG5cbiAgICBjb25zdCBsaW5lcyA9IG5ldyBMaW5lTGF5ZXIoXG4gICAgICBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnByb3BzLCB7XG4gICAgICAgIGlkOiBgJHt0aGlzLnByb3BzLmlkfS1MaW5lTGF5ZXJgLFxuICAgICAgICBkYXRhOiB0aGlzLnByb3BzLmRhdGEsXG4gICAgICAgIHBpY2thYmxlOiBmYWxzZSxcbiAgICAgICAgZ2V0U291cmNlUG9zaXRpb246ICh7IHBvc2l0aW9uIH0pID0+IFtwb3NpdGlvblswXSwgcG9zaXRpb25bMV0sIDBdLFxuICAgICAgICBnZXRUYXJnZXRQb3NpdGlvbjogKHsgcG9zaXRpb24gfSkgPT4gW3Bvc2l0aW9uWzBdLCBwb3NpdGlvblsxXSwgcG9zaXRpb25bMl0gfHwgMF0sXG4gICAgICAgIGdldENvbG9yOiBbMTUwLCAxNTAsIDE1MCwgMjAwXSxcbiAgICAgICAgZ2V0U3Ryb2tlV2lkdGg6IDNcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIHJldHVybiBbaGFuZGxlcywgbGluZXNdO1xuICB9XG59XG5cbkVsZXZhdGVkRWRpdEhhbmRsZUxheWVyLmxheWVyTmFtZSA9ICdFbGV2YXRlZEVkaXRIYW5kbGVMYXllcic7XG5FbGV2YXRlZEVkaXRIYW5kbGVMYXllci5kZWZhdWx0UHJvcHMgPSBkZWZhdWx0UHJvcHM7XG4iXX0=