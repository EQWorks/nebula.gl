"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _keplerOudatedDeck = require("kepler-oudated-deck.gl-layers");

var _nebulaLayer = _interopRequireDefault(require("../nebula-layer"));

var _utils = require("../utils");

var _deckCache = _interopRequireDefault(require("../deck-renderer/deck-cache"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var TextsLayer =
/*#__PURE__*/
function (_NebulaLayer) {
  _inherits(TextsLayer, _NebulaLayer);

  function TextsLayer(config) {
    var _this;

    _classCallCheck(this, TextsLayer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TextsLayer).call(this, config));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "deckCache", void 0);

    _this.deckCache = new _deckCache.default(config.getData, function (data) {
      return config.toNebulaFeature(data);
    });
    return _this;
  }

  _createClass(TextsLayer, [{
    key: "render",
    value: function render(_ref) {
      var nebula = _ref.nebula;
      var defaultColor = [0x0, 0x0, 0x0, 0xff];
      var _this$deckCache = this.deckCache,
          objects = _this$deckCache.objects,
          updateTrigger = _this$deckCache.updateTrigger;
      var zoom = nebula.props.viewport.zoom;
      return new _keplerOudatedDeck.TextLayer({
        id: "texts-".concat(this.id),
        data: objects,
        opacity: 1,
        fp64: false,
        pickable: false,
        getText: function getText(nf) {
          return nf.style.text;
        },
        getPosition: function getPosition(nf) {
          return nf.geoJson.geometry.coordinates;
        },
        getColor: function getColor(nf) {
          return (0, _utils.toDeckColor)(nf.style.fillColor) || defaultColor;
        },
        // TODO: layer should offer option to scale with zoom
        sizeScale: 1 / Math.pow(2, 20 - zoom),
        updateTriggers: {
          all: updateTrigger
        },
        nebulaLayer: this
      });
    }
  }]);

  return TextsLayer;
}(_nebulaLayer.default);

exports.default = TextsLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvbGF5ZXJzL3RleHRzLWxheWVyLmpzIl0sIm5hbWVzIjpbIlRleHRzTGF5ZXIiLCJjb25maWciLCJkZWNrQ2FjaGUiLCJEZWNrQ2FjaGUiLCJnZXREYXRhIiwiZGF0YSIsInRvTmVidWxhRmVhdHVyZSIsIm5lYnVsYSIsImRlZmF1bHRDb2xvciIsIm9iamVjdHMiLCJ1cGRhdGVUcmlnZ2VyIiwiem9vbSIsInByb3BzIiwidmlld3BvcnQiLCJUZXh0TGF5ZXIiLCJpZCIsIm9wYWNpdHkiLCJmcDY0IiwicGlja2FibGUiLCJnZXRUZXh0IiwibmYiLCJzdHlsZSIsInRleHQiLCJnZXRQb3NpdGlvbiIsImdlb0pzb24iLCJnZW9tZXRyeSIsImNvb3JkaW5hdGVzIiwiZ2V0Q29sb3IiLCJmaWxsQ29sb3IiLCJzaXplU2NhbGUiLCJNYXRoIiwicG93IiwidXBkYXRlVHJpZ2dlcnMiLCJhbGwiLCJuZWJ1bGFMYXllciIsIk5lYnVsYUxheWVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUVxQkEsVTs7Ozs7QUFHbkIsc0JBQVlDLE1BQVosRUFBNEI7QUFBQTs7QUFBQTs7QUFDMUIsb0ZBQU1BLE1BQU47O0FBRDBCOztBQUUxQixVQUFLQyxTQUFMLEdBQWlCLElBQUlDLGtCQUFKLENBQWNGLE1BQU0sQ0FBQ0csT0FBckIsRUFBOEIsVUFBQUMsSUFBSTtBQUFBLGFBQUlKLE1BQU0sQ0FBQ0ssZUFBUCxDQUF1QkQsSUFBdkIsQ0FBSjtBQUFBLEtBQWxDLENBQWpCO0FBRjBCO0FBRzNCOzs7O2lDQUUwQjtBQUFBLFVBQWxCRSxNQUFrQixRQUFsQkEsTUFBa0I7QUFDekIsVUFBTUMsWUFBWSxHQUFHLENBQUMsR0FBRCxFQUFNLEdBQU4sRUFBVyxHQUFYLEVBQWdCLElBQWhCLENBQXJCO0FBRHlCLDRCQUVVLEtBQUtOLFNBRmY7QUFBQSxVQUVqQk8sT0FGaUIsbUJBRWpCQSxPQUZpQjtBQUFBLFVBRVJDLGFBRlEsbUJBRVJBLGFBRlE7QUFBQSxVQUlqQkMsSUFKaUIsR0FJUkosTUFBTSxDQUFDSyxLQUFQLENBQWFDLFFBSkwsQ0FJakJGLElBSmlCO0FBTXpCLGFBQU8sSUFBSUcsNEJBQUosQ0FBYztBQUNuQkMsUUFBQUEsRUFBRSxrQkFBVyxLQUFLQSxFQUFoQixDQURpQjtBQUVuQlYsUUFBQUEsSUFBSSxFQUFFSSxPQUZhO0FBR25CTyxRQUFBQSxPQUFPLEVBQUUsQ0FIVTtBQUluQkMsUUFBQUEsSUFBSSxFQUFFLEtBSmE7QUFLbkJDLFFBQUFBLFFBQVEsRUFBRSxLQUxTO0FBT25CQyxRQUFBQSxPQUFPLEVBQUUsaUJBQUFDLEVBQUU7QUFBQSxpQkFBSUEsRUFBRSxDQUFDQyxLQUFILENBQVNDLElBQWI7QUFBQSxTQVBRO0FBUW5CQyxRQUFBQSxXQUFXLEVBQUUscUJBQUFILEVBQUU7QUFBQSxpQkFBSUEsRUFBRSxDQUFDSSxPQUFILENBQVdDLFFBQVgsQ0FBb0JDLFdBQXhCO0FBQUEsU0FSSTtBQVNuQkMsUUFBQUEsUUFBUSxFQUFFLGtCQUFBUCxFQUFFO0FBQUEsaUJBQUksd0JBQVlBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTTyxTQUFyQixLQUFtQ3BCLFlBQXZDO0FBQUEsU0FUTztBQVduQjtBQUNBcUIsUUFBQUEsU0FBUyxFQUFFLElBQUlDLElBQUksQ0FBQ0MsR0FBTCxDQUFTLENBQVQsRUFBWSxLQUFLcEIsSUFBakIsQ0FaSTtBQWNuQnFCLFFBQUFBLGNBQWMsRUFBRTtBQUFFQyxVQUFBQSxHQUFHLEVBQUV2QjtBQUFQLFNBZEc7QUFnQm5Cd0IsUUFBQUEsV0FBVyxFQUFFO0FBaEJNLE9BQWQsQ0FBUDtBQWtCRDs7OztFQWhDcUNDLG9CIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcbmltcG9ydCB7IFRleHRMYXllciB9IGZyb20gJ2tlcGxlci1vdWRhdGVkLWRlY2suZ2wtbGF5ZXJzJztcblxuaW1wb3J0IE5lYnVsYUxheWVyIGZyb20gJy4uL25lYnVsYS1sYXllcic7XG5pbXBvcnQgeyB0b0RlY2tDb2xvciB9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCBEZWNrQ2FjaGUgZnJvbSAnLi4vZGVjay1yZW5kZXJlci9kZWNrLWNhY2hlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGV4dHNMYXllciBleHRlbmRzIE5lYnVsYUxheWVyIHtcbiAgZGVja0NhY2hlOiBEZWNrQ2FjaGU8KiwgKj47XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBPYmplY3QpIHtcbiAgICBzdXBlcihjb25maWcpO1xuICAgIHRoaXMuZGVja0NhY2hlID0gbmV3IERlY2tDYWNoZShjb25maWcuZ2V0RGF0YSwgZGF0YSA9PiBjb25maWcudG9OZWJ1bGFGZWF0dXJlKGRhdGEpKTtcbiAgfVxuXG4gIHJlbmRlcih7IG5lYnVsYSB9OiBPYmplY3QpIHtcbiAgICBjb25zdCBkZWZhdWx0Q29sb3IgPSBbMHgwLCAweDAsIDB4MCwgMHhmZl07XG4gICAgY29uc3QgeyBvYmplY3RzLCB1cGRhdGVUcmlnZ2VyIH0gPSB0aGlzLmRlY2tDYWNoZTtcblxuICAgIGNvbnN0IHsgem9vbSB9ID0gbmVidWxhLnByb3BzLnZpZXdwb3J0O1xuXG4gICAgcmV0dXJuIG5ldyBUZXh0TGF5ZXIoe1xuICAgICAgaWQ6IGB0ZXh0cy0ke3RoaXMuaWR9YCxcbiAgICAgIGRhdGE6IG9iamVjdHMsXG4gICAgICBvcGFjaXR5OiAxLFxuICAgICAgZnA2NDogZmFsc2UsXG4gICAgICBwaWNrYWJsZTogZmFsc2UsXG5cbiAgICAgIGdldFRleHQ6IG5mID0+IG5mLnN0eWxlLnRleHQsXG4gICAgICBnZXRQb3NpdGlvbjogbmYgPT4gbmYuZ2VvSnNvbi5nZW9tZXRyeS5jb29yZGluYXRlcyxcbiAgICAgIGdldENvbG9yOiBuZiA9PiB0b0RlY2tDb2xvcihuZi5zdHlsZS5maWxsQ29sb3IpIHx8IGRlZmF1bHRDb2xvcixcblxuICAgICAgLy8gVE9ETzogbGF5ZXIgc2hvdWxkIG9mZmVyIG9wdGlvbiB0byBzY2FsZSB3aXRoIHpvb21cbiAgICAgIHNpemVTY2FsZTogMSAvIE1hdGgucG93KDIsIDIwIC0gem9vbSksXG5cbiAgICAgIHVwZGF0ZVRyaWdnZXJzOiB7IGFsbDogdXBkYXRlVHJpZ2dlciB9LFxuXG4gICAgICBuZWJ1bGFMYXllcjogdGhpc1xuICAgIH0pO1xuICB9XG59XG4iXX0=