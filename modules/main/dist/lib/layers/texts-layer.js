"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _keplerOutdatedDeck = require("kepler-outdated-deck.gl-layers");

var _nebulaLayer = _interopRequireDefault(require("../nebula-layer"));

var _utils = require("../utils");

var _deckCache = _interopRequireDefault(require("../deck-renderer/deck-cache"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class TextsLayer extends _nebulaLayer.default {
  constructor(config) {
    super(config);

    _defineProperty(this, "deckCache", void 0);

    this.deckCache = new _deckCache.default(config.getData, function (data) {
      return config.toNebulaFeature(data);
    });
  }

  render(_ref) {
    var nebula = _ref.nebula;
    var defaultColor = [0x0, 0x0, 0x0, 0xff];
    var _this$deckCache = this.deckCache,
        objects = _this$deckCache.objects,
        updateTrigger = _this$deckCache.updateTrigger;
    var zoom = nebula.props.viewport.zoom;
    return new _keplerOutdatedDeck.TextLayer({
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

}

exports.default = TextsLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvbGF5ZXJzL3RleHRzLWxheWVyLmpzIl0sIm5hbWVzIjpbIlRleHRzTGF5ZXIiLCJOZWJ1bGFMYXllciIsImNvbnN0cnVjdG9yIiwiY29uZmlnIiwiZGVja0NhY2hlIiwiRGVja0NhY2hlIiwiZ2V0RGF0YSIsImRhdGEiLCJ0b05lYnVsYUZlYXR1cmUiLCJyZW5kZXIiLCJuZWJ1bGEiLCJkZWZhdWx0Q29sb3IiLCJvYmplY3RzIiwidXBkYXRlVHJpZ2dlciIsInpvb20iLCJwcm9wcyIsInZpZXdwb3J0IiwiVGV4dExheWVyIiwiaWQiLCJvcGFjaXR5IiwiZnA2NCIsInBpY2thYmxlIiwiZ2V0VGV4dCIsIm5mIiwic3R5bGUiLCJ0ZXh0IiwiZ2V0UG9zaXRpb24iLCJnZW9Kc29uIiwiZ2VvbWV0cnkiLCJjb29yZGluYXRlcyIsImdldENvbG9yIiwiZmlsbENvbG9yIiwic2l6ZVNjYWxlIiwiTWF0aCIsInBvdyIsInVwZGF0ZVRyaWdnZXJzIiwiYWxsIiwibmVidWxhTGF5ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7Ozs7O0FBRWUsTUFBTUEsVUFBTixTQUF5QkMsb0JBQXpCLENBQXFDO0FBR2xEQyxFQUFBQSxXQUFXLENBQUNDLE1BQUQsRUFBaUI7QUFDMUIsVUFBTUEsTUFBTjs7QUFEMEI7O0FBRTFCLFNBQUtDLFNBQUwsR0FBaUIsSUFBSUMsa0JBQUosQ0FBY0YsTUFBTSxDQUFDRyxPQUFyQixFQUE4QixVQUFBQyxJQUFJO0FBQUEsYUFBSUosTUFBTSxDQUFDSyxlQUFQLENBQXVCRCxJQUF2QixDQUFKO0FBQUEsS0FBbEMsQ0FBakI7QUFDRDs7QUFFREUsRUFBQUEsTUFBTSxPQUFxQjtBQUFBLFFBQWxCQyxNQUFrQixRQUFsQkEsTUFBa0I7QUFDekIsUUFBTUMsWUFBWSxHQUFHLENBQUMsR0FBRCxFQUFNLEdBQU4sRUFBVyxHQUFYLEVBQWdCLElBQWhCLENBQXJCO0FBRHlCLDBCQUVVLEtBQUtQLFNBRmY7QUFBQSxRQUVqQlEsT0FGaUIsbUJBRWpCQSxPQUZpQjtBQUFBLFFBRVJDLGFBRlEsbUJBRVJBLGFBRlE7QUFBQSxRQUlqQkMsSUFKaUIsR0FJUkosTUFBTSxDQUFDSyxLQUFQLENBQWFDLFFBSkwsQ0FJakJGLElBSmlCO0FBTXpCLFdBQU8sSUFBSUcsNkJBQUosQ0FBYztBQUNuQkMsTUFBQUEsRUFBRSxrQkFBVyxLQUFLQSxFQUFoQixDQURpQjtBQUVuQlgsTUFBQUEsSUFBSSxFQUFFSyxPQUZhO0FBR25CTyxNQUFBQSxPQUFPLEVBQUUsQ0FIVTtBQUluQkMsTUFBQUEsSUFBSSxFQUFFLEtBSmE7QUFLbkJDLE1BQUFBLFFBQVEsRUFBRSxLQUxTO0FBT25CQyxNQUFBQSxPQUFPLEVBQUUsaUJBQUFDLEVBQUU7QUFBQSxlQUFJQSxFQUFFLENBQUNDLEtBQUgsQ0FBU0MsSUFBYjtBQUFBLE9BUFE7QUFRbkJDLE1BQUFBLFdBQVcsRUFBRSxxQkFBQUgsRUFBRTtBQUFBLGVBQUlBLEVBQUUsQ0FBQ0ksT0FBSCxDQUFXQyxRQUFYLENBQW9CQyxXQUF4QjtBQUFBLE9BUkk7QUFTbkJDLE1BQUFBLFFBQVEsRUFBRSxrQkFBQVAsRUFBRTtBQUFBLGVBQUksd0JBQVlBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTTyxTQUFyQixLQUFtQ3BCLFlBQXZDO0FBQUEsT0FUTztBQVduQjtBQUNBcUIsTUFBQUEsU0FBUyxFQUFFLElBQUlDLElBQUksQ0FBQ0MsR0FBTCxDQUFTLENBQVQsRUFBWSxLQUFLcEIsSUFBakIsQ0FaSTtBQWNuQnFCLE1BQUFBLGNBQWMsRUFBRTtBQUFFQyxRQUFBQSxHQUFHLEVBQUV2QjtBQUFQLE9BZEc7QUFnQm5Cd0IsTUFBQUEsV0FBVyxFQUFFO0FBaEJNLEtBQWQsQ0FBUDtBQWtCRDs7QUFoQ2lEIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcbmltcG9ydCB7IFRleHRMYXllciB9IGZyb20gJ2tlcGxlci1vdXRkYXRlZC1kZWNrLmdsLWxheWVycyc7XG5cbmltcG9ydCBOZWJ1bGFMYXllciBmcm9tICcuLi9uZWJ1bGEtbGF5ZXInO1xuaW1wb3J0IHsgdG9EZWNrQ29sb3IgfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQgRGVja0NhY2hlIGZyb20gJy4uL2RlY2stcmVuZGVyZXIvZGVjay1jYWNoZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRleHRzTGF5ZXIgZXh0ZW5kcyBOZWJ1bGFMYXllciB7XG4gIGRlY2tDYWNoZTogRGVja0NhY2hlPCosICo+O1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogT2JqZWN0KSB7XG4gICAgc3VwZXIoY29uZmlnKTtcbiAgICB0aGlzLmRlY2tDYWNoZSA9IG5ldyBEZWNrQ2FjaGUoY29uZmlnLmdldERhdGEsIGRhdGEgPT4gY29uZmlnLnRvTmVidWxhRmVhdHVyZShkYXRhKSk7XG4gIH1cblxuICByZW5kZXIoeyBuZWJ1bGEgfTogT2JqZWN0KSB7XG4gICAgY29uc3QgZGVmYXVsdENvbG9yID0gWzB4MCwgMHgwLCAweDAsIDB4ZmZdO1xuICAgIGNvbnN0IHsgb2JqZWN0cywgdXBkYXRlVHJpZ2dlciB9ID0gdGhpcy5kZWNrQ2FjaGU7XG5cbiAgICBjb25zdCB7IHpvb20gfSA9IG5lYnVsYS5wcm9wcy52aWV3cG9ydDtcblxuICAgIHJldHVybiBuZXcgVGV4dExheWVyKHtcbiAgICAgIGlkOiBgdGV4dHMtJHt0aGlzLmlkfWAsXG4gICAgICBkYXRhOiBvYmplY3RzLFxuICAgICAgb3BhY2l0eTogMSxcbiAgICAgIGZwNjQ6IGZhbHNlLFxuICAgICAgcGlja2FibGU6IGZhbHNlLFxuXG4gICAgICBnZXRUZXh0OiBuZiA9PiBuZi5zdHlsZS50ZXh0LFxuICAgICAgZ2V0UG9zaXRpb246IG5mID0+IG5mLmdlb0pzb24uZ2VvbWV0cnkuY29vcmRpbmF0ZXMsXG4gICAgICBnZXRDb2xvcjogbmYgPT4gdG9EZWNrQ29sb3IobmYuc3R5bGUuZmlsbENvbG9yKSB8fCBkZWZhdWx0Q29sb3IsXG5cbiAgICAgIC8vIFRPRE86IGxheWVyIHNob3VsZCBvZmZlciBvcHRpb24gdG8gc2NhbGUgd2l0aCB6b29tXG4gICAgICBzaXplU2NhbGU6IDEgLyBNYXRoLnBvdygyLCAyMCAtIHpvb20pLFxuXG4gICAgICB1cGRhdGVUcmlnZ2VyczogeyBhbGw6IHVwZGF0ZVRyaWdnZXIgfSxcblxuICAgICAgbmVidWxhTGF5ZXI6IHRoaXNcbiAgICB9KTtcbiAgfVxufVxuIl19