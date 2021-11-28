"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _layers = require("@nebula.gl/layers");

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

var JunctionsLayer =
/*#__PURE__*/
function (_NebulaLayer) {
  _inherits(JunctionsLayer, _NebulaLayer);

  function JunctionsLayer(config) {
    var _this;

    _classCallCheck(this, JunctionsLayer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(JunctionsLayer).call(this, config));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "deckCache", void 0);

    _this.deckCache = new _deckCache.default(config.getData, function (data) {
      return config.toNebulaFeature(data);
    });
    _this.enablePicking = true;
    return _this;
  }

  _createClass(JunctionsLayer, [{
    key: "render",
    value: function render(_ref) {
      var nebula = _ref.nebula;
      var defaultColor = [0x0, 0x0, 0x0, 0xff];
      var _this$deckCache = this.deckCache,
          objects = _this$deckCache.objects,
          updateTrigger = _this$deckCache.updateTrigger;
      return new _layers.JunctionScatterplotLayer({
        id: "junctions-".concat(this.id),
        data: objects,
        opacity: 1,
        fp64: false,
        pickable: true,
        getPosition: function getPosition(nf) {
          return nf.geoJson.geometry.coordinates;
        },
        getFillColor: function getFillColor(nf) {
          return (0, _utils.toDeckColor)(nf.style.fillColor) || defaultColor;
        },
        getStrokeColor: function getStrokeColor(nf) {
          return (0, _utils.toDeckColor)(nf.style.outlineColor) || (0, _utils.toDeckColor)(nf.style.fillColor) || defaultColor;
        },
        getRadius: function getRadius(nf) {
          return nf.style.pointRadiusMeters + nf.style.outlineRadiusMeters || 1;
        },
        getInnerRadius: function getInnerRadius(nf) {
          return nf.style.pointRadiusMeters || 0.5;
        },
        parameters: {
          depthTest: false,
          blend: false
        },
        updateTriggers: {
          all: updateTrigger
        },
        nebulaLayer: this
      });
    }
  }]);

  return JunctionsLayer;
}(_nebulaLayer.default);

exports.default = JunctionsLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvbGF5ZXJzL2p1bmN0aW9ucy1sYXllci5qcyJdLCJuYW1lcyI6WyJKdW5jdGlvbnNMYXllciIsImNvbmZpZyIsImRlY2tDYWNoZSIsIkRlY2tDYWNoZSIsImdldERhdGEiLCJkYXRhIiwidG9OZWJ1bGFGZWF0dXJlIiwiZW5hYmxlUGlja2luZyIsIm5lYnVsYSIsImRlZmF1bHRDb2xvciIsIm9iamVjdHMiLCJ1cGRhdGVUcmlnZ2VyIiwiSnVuY3Rpb25TY2F0dGVycGxvdExheWVyIiwiaWQiLCJvcGFjaXR5IiwiZnA2NCIsInBpY2thYmxlIiwiZ2V0UG9zaXRpb24iLCJuZiIsImdlb0pzb24iLCJnZW9tZXRyeSIsImNvb3JkaW5hdGVzIiwiZ2V0RmlsbENvbG9yIiwic3R5bGUiLCJmaWxsQ29sb3IiLCJnZXRTdHJva2VDb2xvciIsIm91dGxpbmVDb2xvciIsImdldFJhZGl1cyIsInBvaW50UmFkaXVzTWV0ZXJzIiwib3V0bGluZVJhZGl1c01ldGVycyIsImdldElubmVyUmFkaXVzIiwicGFyYW1ldGVycyIsImRlcHRoVGVzdCIsImJsZW5kIiwidXBkYXRlVHJpZ2dlcnMiLCJhbGwiLCJuZWJ1bGFMYXllciIsIk5lYnVsYUxheWVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUVxQkEsYzs7Ozs7QUFHbkIsMEJBQVlDLE1BQVosRUFBNEI7QUFBQTs7QUFBQTs7QUFDMUIsd0ZBQU1BLE1BQU47O0FBRDBCOztBQUUxQixVQUFLQyxTQUFMLEdBQWlCLElBQUlDLGtCQUFKLENBQWNGLE1BQU0sQ0FBQ0csT0FBckIsRUFBOEIsVUFBQUMsSUFBSTtBQUFBLGFBQUlKLE1BQU0sQ0FBQ0ssZUFBUCxDQUF1QkQsSUFBdkIsQ0FBSjtBQUFBLEtBQWxDLENBQWpCO0FBQ0EsVUFBS0UsYUFBTCxHQUFxQixJQUFyQjtBQUgwQjtBQUkzQjs7OztpQ0FFMEI7QUFBQSxVQUFsQkMsTUFBa0IsUUFBbEJBLE1BQWtCO0FBQ3pCLFVBQU1DLFlBQVksR0FBRyxDQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsR0FBWCxFQUFnQixJQUFoQixDQUFyQjtBQUR5Qiw0QkFFVSxLQUFLUCxTQUZmO0FBQUEsVUFFakJRLE9BRmlCLG1CQUVqQkEsT0FGaUI7QUFBQSxVQUVSQyxhQUZRLG1CQUVSQSxhQUZRO0FBSXpCLGFBQU8sSUFBSUMsZ0NBQUosQ0FBNkI7QUFDbENDLFFBQUFBLEVBQUUsc0JBQWUsS0FBS0EsRUFBcEIsQ0FEZ0M7QUFFbENSLFFBQUFBLElBQUksRUFBRUssT0FGNEI7QUFHbENJLFFBQUFBLE9BQU8sRUFBRSxDQUh5QjtBQUlsQ0MsUUFBQUEsSUFBSSxFQUFFLEtBSjRCO0FBS2xDQyxRQUFBQSxRQUFRLEVBQUUsSUFMd0I7QUFNbENDLFFBQUFBLFdBQVcsRUFBRSxxQkFBQUMsRUFBRTtBQUFBLGlCQUFJQSxFQUFFLENBQUNDLE9BQUgsQ0FBV0MsUUFBWCxDQUFvQkMsV0FBeEI7QUFBQSxTQU5tQjtBQU9sQ0MsUUFBQUEsWUFBWSxFQUFFLHNCQUFBSixFQUFFO0FBQUEsaUJBQUksd0JBQVlBLEVBQUUsQ0FBQ0ssS0FBSCxDQUFTQyxTQUFyQixLQUFtQ2YsWUFBdkM7QUFBQSxTQVBrQjtBQVFsQ2dCLFFBQUFBLGNBQWMsRUFBRSx3QkFBQVAsRUFBRTtBQUFBLGlCQUNoQix3QkFBWUEsRUFBRSxDQUFDSyxLQUFILENBQVNHLFlBQXJCLEtBQXNDLHdCQUFZUixFQUFFLENBQUNLLEtBQUgsQ0FBU0MsU0FBckIsQ0FBdEMsSUFBeUVmLFlBRHpEO0FBQUEsU0FSZ0I7QUFVbENrQixRQUFBQSxTQUFTLEVBQUUsbUJBQUFULEVBQUU7QUFBQSxpQkFBSUEsRUFBRSxDQUFDSyxLQUFILENBQVNLLGlCQUFULEdBQTZCVixFQUFFLENBQUNLLEtBQUgsQ0FBU00sbUJBQXRDLElBQTZELENBQWpFO0FBQUEsU0FWcUI7QUFXbENDLFFBQUFBLGNBQWMsRUFBRSx3QkFBQVosRUFBRTtBQUFBLGlCQUFJQSxFQUFFLENBQUNLLEtBQUgsQ0FBU0ssaUJBQVQsSUFBOEIsR0FBbEM7QUFBQSxTQVhnQjtBQVlsQ0csUUFBQUEsVUFBVSxFQUFFO0FBQ1ZDLFVBQUFBLFNBQVMsRUFBRSxLQUREO0FBRVZDLFVBQUFBLEtBQUssRUFBRTtBQUZHLFNBWnNCO0FBaUJsQ0MsUUFBQUEsY0FBYyxFQUFFO0FBQUVDLFVBQUFBLEdBQUcsRUFBRXhCO0FBQVAsU0FqQmtCO0FBbUJsQ3lCLFFBQUFBLFdBQVcsRUFBRTtBQW5CcUIsT0FBN0IsQ0FBUDtBQXFCRDs7OztFQWxDeUNDLG9CIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcbmltcG9ydCB7IEp1bmN0aW9uU2NhdHRlcnBsb3RMYXllciB9IGZyb20gJ0BuZWJ1bGEuZ2wvbGF5ZXJzJztcbmltcG9ydCBOZWJ1bGFMYXllciBmcm9tICcuLi9uZWJ1bGEtbGF5ZXInO1xuaW1wb3J0IHsgdG9EZWNrQ29sb3IgfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQgRGVja0NhY2hlIGZyb20gJy4uL2RlY2stcmVuZGVyZXIvZGVjay1jYWNoZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEp1bmN0aW9uc0xheWVyIGV4dGVuZHMgTmVidWxhTGF5ZXIge1xuICBkZWNrQ2FjaGU6IERlY2tDYWNoZTwqLCAqPjtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IE9iamVjdCkge1xuICAgIHN1cGVyKGNvbmZpZyk7XG4gICAgdGhpcy5kZWNrQ2FjaGUgPSBuZXcgRGVja0NhY2hlKGNvbmZpZy5nZXREYXRhLCBkYXRhID0+IGNvbmZpZy50b05lYnVsYUZlYXR1cmUoZGF0YSkpO1xuICAgIHRoaXMuZW5hYmxlUGlja2luZyA9IHRydWU7XG4gIH1cblxuICByZW5kZXIoeyBuZWJ1bGEgfTogT2JqZWN0KSB7XG4gICAgY29uc3QgZGVmYXVsdENvbG9yID0gWzB4MCwgMHgwLCAweDAsIDB4ZmZdO1xuICAgIGNvbnN0IHsgb2JqZWN0cywgdXBkYXRlVHJpZ2dlciB9ID0gdGhpcy5kZWNrQ2FjaGU7XG5cbiAgICByZXR1cm4gbmV3IEp1bmN0aW9uU2NhdHRlcnBsb3RMYXllcih7XG4gICAgICBpZDogYGp1bmN0aW9ucy0ke3RoaXMuaWR9YCxcbiAgICAgIGRhdGE6IG9iamVjdHMsXG4gICAgICBvcGFjaXR5OiAxLFxuICAgICAgZnA2NDogZmFsc2UsXG4gICAgICBwaWNrYWJsZTogdHJ1ZSxcbiAgICAgIGdldFBvc2l0aW9uOiBuZiA9PiBuZi5nZW9Kc29uLmdlb21ldHJ5LmNvb3JkaW5hdGVzLFxuICAgICAgZ2V0RmlsbENvbG9yOiBuZiA9PiB0b0RlY2tDb2xvcihuZi5zdHlsZS5maWxsQ29sb3IpIHx8IGRlZmF1bHRDb2xvcixcbiAgICAgIGdldFN0cm9rZUNvbG9yOiBuZiA9PlxuICAgICAgICB0b0RlY2tDb2xvcihuZi5zdHlsZS5vdXRsaW5lQ29sb3IpIHx8IHRvRGVja0NvbG9yKG5mLnN0eWxlLmZpbGxDb2xvcikgfHwgZGVmYXVsdENvbG9yLFxuICAgICAgZ2V0UmFkaXVzOiBuZiA9PiBuZi5zdHlsZS5wb2ludFJhZGl1c01ldGVycyArIG5mLnN0eWxlLm91dGxpbmVSYWRpdXNNZXRlcnMgfHwgMSxcbiAgICAgIGdldElubmVyUmFkaXVzOiBuZiA9PiBuZi5zdHlsZS5wb2ludFJhZGl1c01ldGVycyB8fCAwLjUsXG4gICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgIGRlcHRoVGVzdDogZmFsc2UsXG4gICAgICAgIGJsZW5kOiBmYWxzZVxuICAgICAgfSxcblxuICAgICAgdXBkYXRlVHJpZ2dlcnM6IHsgYWxsOiB1cGRhdGVUcmlnZ2VyIH0sXG5cbiAgICAgIG5lYnVsYUxheWVyOiB0aGlzXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==