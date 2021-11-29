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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sYXllcnMvZWxldmF0ZWQtZWRpdC1oYW5kbGUtbGF5ZXIuanMiXSwibmFtZXMiOlsiZGVmYXVsdFByb3BzIiwiRWxldmF0ZWRFZGl0SGFuZGxlTGF5ZXIiLCJoYW5kbGVzIiwiU2NhdHRlcnBsb3RMYXllciIsIk9iamVjdCIsImFzc2lnbiIsInByb3BzIiwiaWQiLCJkYXRhIiwibGluZXMiLCJMaW5lTGF5ZXIiLCJwaWNrYWJsZSIsImdldFNvdXJjZVBvc2l0aW9uIiwicG9zaXRpb24iLCJnZXRUYXJnZXRQb3NpdGlvbiIsImdldENvbG9yIiwiZ2V0U3Ryb2tlV2lkdGgiLCJDb21wb3NpdGVMYXllciIsImxheWVyTmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUdBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLFlBQVksR0FBRyxFQUFyQjs7SUFFcUJDLHVCOzs7Ozs7Ozs7Ozs7O21DQUNKO0FBQ2IsVUFBTUMsT0FBTyxHQUFHLElBQUlDLG9DQUFKLENBQ2RDLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLEVBQWQsRUFBa0IsS0FBS0MsS0FBdkIsRUFBOEI7QUFDNUJDLFFBQUFBLEVBQUUsWUFBSyxLQUFLRCxLQUFMLENBQVdDLEVBQWhCLHNCQUQwQjtBQUU1QkMsUUFBQUEsSUFBSSxFQUFFLEtBQUtGLEtBQUwsQ0FBV0U7QUFGVyxPQUE5QixDQURjLENBQWhCO0FBT0EsVUFBTUMsS0FBSyxHQUFHLElBQUlDLDZCQUFKLENBQ1pOLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLEVBQWQsRUFBa0IsS0FBS0MsS0FBdkIsRUFBOEI7QUFDNUJDLFFBQUFBLEVBQUUsWUFBSyxLQUFLRCxLQUFMLENBQVdDLEVBQWhCLGVBRDBCO0FBRTVCQyxRQUFBQSxJQUFJLEVBQUUsS0FBS0YsS0FBTCxDQUFXRSxJQUZXO0FBRzVCRyxRQUFBQSxRQUFRLEVBQUUsS0FIa0I7QUFJNUJDLFFBQUFBLGlCQUFpQixFQUFFO0FBQUEsY0FBR0MsUUFBSCxRQUFHQSxRQUFIO0FBQUEsaUJBQWtCLENBQUNBLFFBQVEsQ0FBQyxDQUFELENBQVQsRUFBY0EsUUFBUSxDQUFDLENBQUQsQ0FBdEIsRUFBMkIsQ0FBM0IsQ0FBbEI7QUFBQSxTQUpTO0FBSzVCQyxRQUFBQSxpQkFBaUIsRUFBRTtBQUFBLGNBQUdELFFBQUgsU0FBR0EsUUFBSDtBQUFBLGlCQUFrQixDQUFDQSxRQUFRLENBQUMsQ0FBRCxDQUFULEVBQWNBLFFBQVEsQ0FBQyxDQUFELENBQXRCLEVBQTJCQSxRQUFRLENBQUMsQ0FBRCxDQUFSLElBQWUsQ0FBMUMsQ0FBbEI7QUFBQSxTQUxTO0FBTTVCRSxRQUFBQSxRQUFRLEVBQUUsQ0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEdBQVgsRUFBZ0IsR0FBaEIsQ0FOa0I7QUFPNUJDLFFBQUFBLGNBQWMsRUFBRTtBQVBZLE9BQTlCLENBRFksQ0FBZDtBQVlBLGFBQU8sQ0FBQ2QsT0FBRCxFQUFVTyxLQUFWLENBQVA7QUFDRDs7OztFQXRCa0RRLGlDOzs7QUF5QnJEaEIsdUJBQXVCLENBQUNpQixTQUF4QixHQUFvQyx5QkFBcEM7QUFDQWpCLHVCQUF1QixDQUFDRCxZQUF4QixHQUF1Q0EsWUFBdkMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuLyogZXNsaW50LWVudiBicm93c2VyICovXG5cbmltcG9ydCB7IENvbXBvc2l0ZUxheWVyIH0gZnJvbSAna2VwbGVyLW91ZGF0ZWQtZGVjay5nbC1jb3JlJztcbmltcG9ydCB7IFNjYXR0ZXJwbG90TGF5ZXIsIExpbmVMYXllciB9IGZyb20gJ2tlcGxlci1vdWRhdGVkLWRlY2suZ2wtbGF5ZXJzJztcblxuY29uc3QgZGVmYXVsdFByb3BzID0ge307XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVsZXZhdGVkRWRpdEhhbmRsZUxheWVyIGV4dGVuZHMgQ29tcG9zaXRlTGF5ZXIge1xuICByZW5kZXJMYXllcnMoKSB7XG4gICAgY29uc3QgaGFuZGxlcyA9IG5ldyBTY2F0dGVycGxvdExheWVyKFxuICAgICAgT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5wcm9wcywge1xuICAgICAgICBpZDogYCR7dGhpcy5wcm9wcy5pZH0tU2NhdHRlcnBsb3RMYXllcmAsXG4gICAgICAgIGRhdGE6IHRoaXMucHJvcHMuZGF0YVxuICAgICAgfSlcbiAgICApO1xuXG4gICAgY29uc3QgbGluZXMgPSBuZXcgTGluZUxheWVyKFxuICAgICAgT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5wcm9wcywge1xuICAgICAgICBpZDogYCR7dGhpcy5wcm9wcy5pZH0tTGluZUxheWVyYCxcbiAgICAgICAgZGF0YTogdGhpcy5wcm9wcy5kYXRhLFxuICAgICAgICBwaWNrYWJsZTogZmFsc2UsXG4gICAgICAgIGdldFNvdXJjZVBvc2l0aW9uOiAoeyBwb3NpdGlvbiB9KSA9PiBbcG9zaXRpb25bMF0sIHBvc2l0aW9uWzFdLCAwXSxcbiAgICAgICAgZ2V0VGFyZ2V0UG9zaXRpb246ICh7IHBvc2l0aW9uIH0pID0+IFtwb3NpdGlvblswXSwgcG9zaXRpb25bMV0sIHBvc2l0aW9uWzJdIHx8IDBdLFxuICAgICAgICBnZXRDb2xvcjogWzE1MCwgMTUwLCAxNTAsIDIwMF0sXG4gICAgICAgIGdldFN0cm9rZVdpZHRoOiAzXG4gICAgICB9KVxuICAgICk7XG5cbiAgICByZXR1cm4gW2hhbmRsZXMsIGxpbmVzXTtcbiAgfVxufVxuXG5FbGV2YXRlZEVkaXRIYW5kbGVMYXllci5sYXllck5hbWUgPSAnRWxldmF0ZWRFZGl0SGFuZGxlTGF5ZXInO1xuRWxldmF0ZWRFZGl0SGFuZGxlTGF5ZXIuZGVmYXVsdFByb3BzID0gZGVmYXVsdFByb3BzO1xuIl19
