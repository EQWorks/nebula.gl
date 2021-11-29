"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _keplerOutdatedNebula = require("kepler-outdated-nebula.gl-layers");

var _nebulaLayer = _interopRequireDefault(require("../nebula-layer"));

var _utils = require("../utils");

var _deckCache = _interopRequireDefault(require("../deck-renderer/deck-cache"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class JunctionsLayer extends _nebulaLayer.default {
  constructor(config) {
    super(config);

    _defineProperty(this, "deckCache", void 0);

    this.deckCache = new _deckCache.default(config.getData, function (data) {
      return config.toNebulaFeature(data);
    });
    this.enablePicking = true;
  }

  render(_ref) {
    var nebula = _ref.nebula;
    var defaultColor = [0x0, 0x0, 0x0, 0xff];
    var _this$deckCache = this.deckCache,
        objects = _this$deckCache.objects,
        updateTrigger = _this$deckCache.updateTrigger;
    return new _keplerOutdatedNebula.JunctionScatterplotLayer({
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

}

exports.default = JunctionsLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvbGF5ZXJzL2p1bmN0aW9ucy1sYXllci5qcyJdLCJuYW1lcyI6WyJKdW5jdGlvbnNMYXllciIsIk5lYnVsYUxheWVyIiwiY29uc3RydWN0b3IiLCJjb25maWciLCJkZWNrQ2FjaGUiLCJEZWNrQ2FjaGUiLCJnZXREYXRhIiwiZGF0YSIsInRvTmVidWxhRmVhdHVyZSIsImVuYWJsZVBpY2tpbmciLCJyZW5kZXIiLCJuZWJ1bGEiLCJkZWZhdWx0Q29sb3IiLCJvYmplY3RzIiwidXBkYXRlVHJpZ2dlciIsIkp1bmN0aW9uU2NhdHRlcnBsb3RMYXllciIsImlkIiwib3BhY2l0eSIsImZwNjQiLCJwaWNrYWJsZSIsImdldFBvc2l0aW9uIiwibmYiLCJnZW9Kc29uIiwiZ2VvbWV0cnkiLCJjb29yZGluYXRlcyIsImdldEZpbGxDb2xvciIsInN0eWxlIiwiZmlsbENvbG9yIiwiZ2V0U3Ryb2tlQ29sb3IiLCJvdXRsaW5lQ29sb3IiLCJnZXRSYWRpdXMiLCJwb2ludFJhZGl1c01ldGVycyIsIm91dGxpbmVSYWRpdXNNZXRlcnMiLCJnZXRJbm5lclJhZGl1cyIsInBhcmFtZXRlcnMiLCJkZXB0aFRlc3QiLCJibGVuZCIsInVwZGF0ZVRyaWdnZXJzIiwiYWxsIiwibmVidWxhTGF5ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7O0FBRWUsTUFBTUEsY0FBTixTQUE2QkMsb0JBQTdCLENBQXlDO0FBR3REQyxFQUFBQSxXQUFXLENBQUNDLE1BQUQsRUFBaUI7QUFDMUIsVUFBTUEsTUFBTjs7QUFEMEI7O0FBRTFCLFNBQUtDLFNBQUwsR0FBaUIsSUFBSUMsa0JBQUosQ0FBY0YsTUFBTSxDQUFDRyxPQUFyQixFQUE4QixVQUFBQyxJQUFJO0FBQUEsYUFBSUosTUFBTSxDQUFDSyxlQUFQLENBQXVCRCxJQUF2QixDQUFKO0FBQUEsS0FBbEMsQ0FBakI7QUFDQSxTQUFLRSxhQUFMLEdBQXFCLElBQXJCO0FBQ0Q7O0FBRURDLEVBQUFBLE1BQU0sT0FBcUI7QUFBQSxRQUFsQkMsTUFBa0IsUUFBbEJBLE1BQWtCO0FBQ3pCLFFBQU1DLFlBQVksR0FBRyxDQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsR0FBWCxFQUFnQixJQUFoQixDQUFyQjtBQUR5QiwwQkFFVSxLQUFLUixTQUZmO0FBQUEsUUFFakJTLE9BRmlCLG1CQUVqQkEsT0FGaUI7QUFBQSxRQUVSQyxhQUZRLG1CQUVSQSxhQUZRO0FBSXpCLFdBQU8sSUFBSUMsOENBQUosQ0FBNkI7QUFDbENDLE1BQUFBLEVBQUUsc0JBQWUsS0FBS0EsRUFBcEIsQ0FEZ0M7QUFFbENULE1BQUFBLElBQUksRUFBRU0sT0FGNEI7QUFHbENJLE1BQUFBLE9BQU8sRUFBRSxDQUh5QjtBQUlsQ0MsTUFBQUEsSUFBSSxFQUFFLEtBSjRCO0FBS2xDQyxNQUFBQSxRQUFRLEVBQUUsSUFMd0I7QUFNbENDLE1BQUFBLFdBQVcsRUFBRSxxQkFBQUMsRUFBRTtBQUFBLGVBQUlBLEVBQUUsQ0FBQ0MsT0FBSCxDQUFXQyxRQUFYLENBQW9CQyxXQUF4QjtBQUFBLE9BTm1CO0FBT2xDQyxNQUFBQSxZQUFZLEVBQUUsc0JBQUFKLEVBQUU7QUFBQSxlQUFJLHdCQUFZQSxFQUFFLENBQUNLLEtBQUgsQ0FBU0MsU0FBckIsS0FBbUNmLFlBQXZDO0FBQUEsT0FQa0I7QUFRbENnQixNQUFBQSxjQUFjLEVBQUUsd0JBQUFQLEVBQUU7QUFBQSxlQUNoQix3QkFBWUEsRUFBRSxDQUFDSyxLQUFILENBQVNHLFlBQXJCLEtBQXNDLHdCQUFZUixFQUFFLENBQUNLLEtBQUgsQ0FBU0MsU0FBckIsQ0FBdEMsSUFBeUVmLFlBRHpEO0FBQUEsT0FSZ0I7QUFVbENrQixNQUFBQSxTQUFTLEVBQUUsbUJBQUFULEVBQUU7QUFBQSxlQUFJQSxFQUFFLENBQUNLLEtBQUgsQ0FBU0ssaUJBQVQsR0FBNkJWLEVBQUUsQ0FBQ0ssS0FBSCxDQUFTTSxtQkFBdEMsSUFBNkQsQ0FBakU7QUFBQSxPQVZxQjtBQVdsQ0MsTUFBQUEsY0FBYyxFQUFFLHdCQUFBWixFQUFFO0FBQUEsZUFBSUEsRUFBRSxDQUFDSyxLQUFILENBQVNLLGlCQUFULElBQThCLEdBQWxDO0FBQUEsT0FYZ0I7QUFZbENHLE1BQUFBLFVBQVUsRUFBRTtBQUNWQyxRQUFBQSxTQUFTLEVBQUUsS0FERDtBQUVWQyxRQUFBQSxLQUFLLEVBQUU7QUFGRyxPQVpzQjtBQWlCbENDLE1BQUFBLGNBQWMsRUFBRTtBQUFFQyxRQUFBQSxHQUFHLEVBQUV4QjtBQUFQLE9BakJrQjtBQW1CbEN5QixNQUFBQSxXQUFXLEVBQUU7QUFuQnFCLEtBQTdCLENBQVA7QUFxQkQ7O0FBbENxRCIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5pbXBvcnQgeyBKdW5jdGlvblNjYXR0ZXJwbG90TGF5ZXIgfSBmcm9tICdrZXBsZXItb3V0ZGF0ZWQtbmVidWxhLmdsLWxheWVycyc7XG5pbXBvcnQgTmVidWxhTGF5ZXIgZnJvbSAnLi4vbmVidWxhLWxheWVyJztcbmltcG9ydCB7IHRvRGVja0NvbG9yIH0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IERlY2tDYWNoZSBmcm9tICcuLi9kZWNrLXJlbmRlcmVyL2RlY2stY2FjaGUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBKdW5jdGlvbnNMYXllciBleHRlbmRzIE5lYnVsYUxheWVyIHtcbiAgZGVja0NhY2hlOiBEZWNrQ2FjaGU8KiwgKj47XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBPYmplY3QpIHtcbiAgICBzdXBlcihjb25maWcpO1xuICAgIHRoaXMuZGVja0NhY2hlID0gbmV3IERlY2tDYWNoZShjb25maWcuZ2V0RGF0YSwgZGF0YSA9PiBjb25maWcudG9OZWJ1bGFGZWF0dXJlKGRhdGEpKTtcbiAgICB0aGlzLmVuYWJsZVBpY2tpbmcgPSB0cnVlO1xuICB9XG5cbiAgcmVuZGVyKHsgbmVidWxhIH06IE9iamVjdCkge1xuICAgIGNvbnN0IGRlZmF1bHRDb2xvciA9IFsweDAsIDB4MCwgMHgwLCAweGZmXTtcbiAgICBjb25zdCB7IG9iamVjdHMsIHVwZGF0ZVRyaWdnZXIgfSA9IHRoaXMuZGVja0NhY2hlO1xuXG4gICAgcmV0dXJuIG5ldyBKdW5jdGlvblNjYXR0ZXJwbG90TGF5ZXIoe1xuICAgICAgaWQ6IGBqdW5jdGlvbnMtJHt0aGlzLmlkfWAsXG4gICAgICBkYXRhOiBvYmplY3RzLFxuICAgICAgb3BhY2l0eTogMSxcbiAgICAgIGZwNjQ6IGZhbHNlLFxuICAgICAgcGlja2FibGU6IHRydWUsXG4gICAgICBnZXRQb3NpdGlvbjogbmYgPT4gbmYuZ2VvSnNvbi5nZW9tZXRyeS5jb29yZGluYXRlcyxcbiAgICAgIGdldEZpbGxDb2xvcjogbmYgPT4gdG9EZWNrQ29sb3IobmYuc3R5bGUuZmlsbENvbG9yKSB8fCBkZWZhdWx0Q29sb3IsXG4gICAgICBnZXRTdHJva2VDb2xvcjogbmYgPT5cbiAgICAgICAgdG9EZWNrQ29sb3IobmYuc3R5bGUub3V0bGluZUNvbG9yKSB8fCB0b0RlY2tDb2xvcihuZi5zdHlsZS5maWxsQ29sb3IpIHx8IGRlZmF1bHRDb2xvcixcbiAgICAgIGdldFJhZGl1czogbmYgPT4gbmYuc3R5bGUucG9pbnRSYWRpdXNNZXRlcnMgKyBuZi5zdHlsZS5vdXRsaW5lUmFkaXVzTWV0ZXJzIHx8IDEsXG4gICAgICBnZXRJbm5lclJhZGl1czogbmYgPT4gbmYuc3R5bGUucG9pbnRSYWRpdXNNZXRlcnMgfHwgMC41LFxuICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICBkZXB0aFRlc3Q6IGZhbHNlLFxuICAgICAgICBibGVuZDogZmFsc2VcbiAgICAgIH0sXG5cbiAgICAgIHVwZGF0ZVRyaWdnZXJzOiB7IGFsbDogdXBkYXRlVHJpZ2dlciB9LFxuXG4gICAgICBuZWJ1bGFMYXllcjogdGhpc1xuICAgIH0pO1xuICB9XG59XG4iXX0=