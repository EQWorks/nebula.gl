"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _keplerOutdatedNebula = require("kepler-outdated-nebula.gl-layers");

var _constants = require("@luma.gl/constants");

var _style = require("../style");

var _nebulaLayer = _interopRequireDefault(require("../nebula-layer"));

var _utils = require("../utils");

var _deckCache = _interopRequireDefault(require("../deck-renderer/deck-cache"));

var _NEBULA_TO_DECK_DIREC;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var NEBULA_TO_DECK_DIRECTIONS = (_NEBULA_TO_DECK_DIREC = {}, _defineProperty(_NEBULA_TO_DECK_DIREC, _style.ArrowStyles.NONE, {
  forward: false,
  backward: false
}), _defineProperty(_NEBULA_TO_DECK_DIREC, _style.ArrowStyles.FORWARD, {
  forward: true,
  backward: false
}), _defineProperty(_NEBULA_TO_DECK_DIREC, _style.ArrowStyles.BACKWARD, {
  forward: false,
  backward: true
}), _defineProperty(_NEBULA_TO_DECK_DIREC, _style.ArrowStyles.BOTH, {
  forward: true,
  backward: true
}), _NEBULA_TO_DECK_DIREC);

class SegmentsLayer extends _nebulaLayer.default {
  constructor(config) {
    super(config);

    _defineProperty(this, "deckCache", void 0);

    _defineProperty(this, "noBlend", void 0);

    _defineProperty(this, "highlightColor", void 0);

    _defineProperty(this, "arrowSize", void 0);

    _defineProperty(this, "rounded", void 0);

    _defineProperty(this, "dashed", void 0);

    _defineProperty(this, "markerLayerProps", void 0);

    this.deckCache = new _deckCache.default(config.getData, function (data) {
      return config.toNebulaFeature(data);
    });
    this.enableSelection = true;
    var _config$enablePicking = config.enablePicking,
        enablePicking = _config$enablePicking === void 0 ? true : _config$enablePicking,
        _config$noBlend = config.noBlend,
        noBlend = _config$noBlend === void 0 ? false : _config$noBlend,
        _config$rounded = config.rounded,
        rounded = _config$rounded === void 0 ? true : _config$rounded,
        _config$dashed = config.dashed,
        dashed = _config$dashed === void 0 ? false : _config$dashed,
        _config$markerLayerPr = config.markerLayerProps,
        markerLayerProps = _config$markerLayerPr === void 0 ? null : _config$markerLayerPr;
    Object.assign(this, {
      enablePicking: enablePicking,
      noBlend: noBlend,
      rounded: rounded,
      dashed: dashed,
      markerLayerProps: markerLayerProps
    });
  }

  getMouseOverSegment() {
    // TODO: remove references
    return null;
  }

  _calcMarkerPercentages(nf) {
    var arrowPercentages = nf.style.arrowPercentages;

    if (arrowPercentages) {
      return arrowPercentages;
    }

    var arrowStyle = nf.style.arrowStyle || _style.DEFAULT_STYLE.arrowStyle;
    if (arrowStyle === _style.ArrowStyles.NONE) return [];
    var arrowCount = Math.min(nf.style.arrowCount || _style.DEFAULT_STYLE.arrowCount, _style.MAX_ARROWS);
    return [[0.5], [0.33, 0.66], [0.25, 0.5, 0.75]][arrowCount - 1];
  }

  _getHighlightedObjectIndex(_ref) {
    var nebula = _ref.nebula;
    var deckglMouseOverInfo = nebula.deckglMouseOverInfo;

    if (deckglMouseOverInfo) {
      var originalLayer = deckglMouseOverInfo.originalLayer,
          index = deckglMouseOverInfo.index;

      if (originalLayer === this) {
        return index;
      }
    } // no object


    return -1;
  }

  render(_ref2) {
    var nebula = _ref2.nebula;
    var defaultColor = [0x0, 0x0, 0x0, 0xff];
    var _this$deckCache = this.deckCache,
        objects = _this$deckCache.objects,
        updateTrigger = _this$deckCache.updateTrigger;
    return new _keplerOutdatedNebula.PathMarkerLayer({
      id: "segments-".concat(this.id),
      data: objects,
      opacity: 1,
      fp64: false,
      rounded: this.rounded,
      pickable: true,
      sizeScale: this.arrowSize || 6,
      parameters: {
        depthTest: false,
        blend: !this.noBlend,
        blendEquation: _constants.MAX
      },
      getPath: function getPath(nf) {
        return nf.geoJson.geometry.coordinates;
      },
      getColor: function getColor(nf) {
        return (0, _utils.toDeckColor)(nf.style.lineColor, defaultColor);
      },
      getWidth: function getWidth(nf) {
        return nf.style.lineWidthMeters || 1;
      },
      getZLevel: function getZLevel(nf) {
        return nf.style.zLevel * 255;
      },
      getDirection: function getDirection(nf) {
        return NEBULA_TO_DECK_DIRECTIONS[nf.style.arrowStyle];
      },
      getMarkerColor: function getMarkerColor(nf) {
        return (0, _utils.toDeckColor)(nf.style.arrowColor, defaultColor);
      },
      getMarkerPercentages: this._calcMarkerPercentages,
      updateTriggers: {
        all: updateTrigger
      },
      highlightedObjectIndex: this._getHighlightedObjectIndex({
        nebula: nebula
      }),
      highlightColor: (0, _utils.toDeckColor)(this.highlightColor),
      dashJustified: this.dashed,
      getDashArray: this.dashed ? function (nf) {
        return nf.style.dashArray;
      } : null,
      markerLayerProps: this.markerLayerProps || _keplerOutdatedNebula.PathMarkerLayer.defaultProps.markerLayerProps,
      nebulaLayer: this
    });
  }

}

exports.default = SegmentsLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvbGF5ZXJzL3NlZ21lbnRzLWxheWVyLmpzIl0sIm5hbWVzIjpbIk5FQlVMQV9UT19ERUNLX0RJUkVDVElPTlMiLCJBcnJvd1N0eWxlcyIsIk5PTkUiLCJmb3J3YXJkIiwiYmFja3dhcmQiLCJGT1JXQVJEIiwiQkFDS1dBUkQiLCJCT1RIIiwiU2VnbWVudHNMYXllciIsIk5lYnVsYUxheWVyIiwiY29uc3RydWN0b3IiLCJjb25maWciLCJkZWNrQ2FjaGUiLCJEZWNrQ2FjaGUiLCJnZXREYXRhIiwiZGF0YSIsInRvTmVidWxhRmVhdHVyZSIsImVuYWJsZVNlbGVjdGlvbiIsImVuYWJsZVBpY2tpbmciLCJub0JsZW5kIiwicm91bmRlZCIsImRhc2hlZCIsIm1hcmtlckxheWVyUHJvcHMiLCJPYmplY3QiLCJhc3NpZ24iLCJnZXRNb3VzZU92ZXJTZWdtZW50IiwiX2NhbGNNYXJrZXJQZXJjZW50YWdlcyIsIm5mIiwiYXJyb3dQZXJjZW50YWdlcyIsInN0eWxlIiwiYXJyb3dTdHlsZSIsIkRFRkFVTFRfU1RZTEUiLCJhcnJvd0NvdW50IiwiTWF0aCIsIm1pbiIsIk1BWF9BUlJPV1MiLCJfZ2V0SGlnaGxpZ2h0ZWRPYmplY3RJbmRleCIsIm5lYnVsYSIsImRlY2tnbE1vdXNlT3ZlckluZm8iLCJvcmlnaW5hbExheWVyIiwiaW5kZXgiLCJyZW5kZXIiLCJkZWZhdWx0Q29sb3IiLCJvYmplY3RzIiwidXBkYXRlVHJpZ2dlciIsIlBhdGhNYXJrZXJMYXllciIsImlkIiwib3BhY2l0eSIsImZwNjQiLCJwaWNrYWJsZSIsInNpemVTY2FsZSIsImFycm93U2l6ZSIsInBhcmFtZXRlcnMiLCJkZXB0aFRlc3QiLCJibGVuZCIsImJsZW5kRXF1YXRpb24iLCJNQVgiLCJnZXRQYXRoIiwiZ2VvSnNvbiIsImdlb21ldHJ5IiwiY29vcmRpbmF0ZXMiLCJnZXRDb2xvciIsImxpbmVDb2xvciIsImdldFdpZHRoIiwibGluZVdpZHRoTWV0ZXJzIiwiZ2V0WkxldmVsIiwiekxldmVsIiwiZ2V0RGlyZWN0aW9uIiwiZ2V0TWFya2VyQ29sb3IiLCJhcnJvd0NvbG9yIiwiZ2V0TWFya2VyUGVyY2VudGFnZXMiLCJ1cGRhdGVUcmlnZ2VycyIsImFsbCIsImhpZ2hsaWdodGVkT2JqZWN0SW5kZXgiLCJoaWdobGlnaHRDb2xvciIsImRhc2hKdXN0aWZpZWQiLCJnZXREYXNoQXJyYXkiLCJkYXNoQXJyYXkiLCJkZWZhdWx0UHJvcHMiLCJuZWJ1bGFMYXllciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7OztBQUVBLElBQU1BLHlCQUF5Qix1RUFDNUJDLG1CQUFZQyxJQURnQixFQUNUO0FBQUVDLEVBQUFBLE9BQU8sRUFBRSxLQUFYO0FBQWtCQyxFQUFBQSxRQUFRLEVBQUU7QUFBNUIsQ0FEUywwQ0FFNUJILG1CQUFZSSxPQUZnQixFQUVOO0FBQUVGLEVBQUFBLE9BQU8sRUFBRSxJQUFYO0FBQWlCQyxFQUFBQSxRQUFRLEVBQUU7QUFBM0IsQ0FGTSwwQ0FHNUJILG1CQUFZSyxRQUhnQixFQUdMO0FBQUVILEVBQUFBLE9BQU8sRUFBRSxLQUFYO0FBQWtCQyxFQUFBQSxRQUFRLEVBQUU7QUFBNUIsQ0FISywwQ0FJNUJILG1CQUFZTSxJQUpnQixFQUlUO0FBQUVKLEVBQUFBLE9BQU8sRUFBRSxJQUFYO0FBQWlCQyxFQUFBQSxRQUFRLEVBQUU7QUFBM0IsQ0FKUyx5QkFBL0I7O0FBT2UsTUFBTUksYUFBTixTQUE0QkMsb0JBQTVCLENBQXdDO0FBU3JEQyxFQUFBQSxXQUFXLENBQUNDLE1BQUQsRUFBaUI7QUFDMUIsVUFBTUEsTUFBTjs7QUFEMEI7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBRTFCLFNBQUtDLFNBQUwsR0FBaUIsSUFBSUMsa0JBQUosQ0FBY0YsTUFBTSxDQUFDRyxPQUFyQixFQUE4QixVQUFBQyxJQUFJO0FBQUEsYUFBSUosTUFBTSxDQUFDSyxlQUFQLENBQXVCRCxJ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QyxzQkFuQkY7QUFvQnpCNkMsTUFBQUEsY0FBYyxFQUFFO0FBQUVDLFFBQUFBLEdBQUcsRUFBRTVCO0FBQVAsT0FwQlM7QUFzQnpCNkIsTUFBQUEsc0JBQXNCLEVBQUUsS0FBS3JDLDBCQUFMLENBQWdDO0FBQUVDLFFBQUFBLE1BQU0sRUFBTkE7QUFBRixPQUFoQyxDQXRCQztBQXVCekJxQyxNQUFBQSxjQUFjLEVBQUUsd0JBQVksS0FBS0EsY0FBakIsQ0F2QlM7QUF5QnpCQyxNQUFBQSxhQUFhLEVBQUUsS0FBS3RELE1BekJLO0FBMEJ6QnVELE1BQUFBLFlBQVksRUFBRSxLQUFLdkQsTUFBTCxHQUFjLFVBQUFNLEVBQUU7QUFBQSxlQUFJQSxFQUFFLENBQUNFLEtBQUgsQ0FBU2dELFNBQWI7QUFBQSxPQUFoQixHQUF5QyxJQTFCOUI7QUEyQnpCdkQsTUFBQUEsZ0JBQWdCLEVBQ2QsS0FBS0EsZ0JBQUwsSUFBMEJ1QixxQ0FBRCxDQUEwQmlDLFlBQTFCLENBQXVDeEQsZ0JBNUJ6QztBQThCekJ5RCxNQUFBQSxXQUFXLEVBQUU7QUE5QlksS0FBcEIsQ0FBUDtBQWdDRDs7QUExRm9EIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcbmltcG9ydCB7IFBhdGhNYXJrZXJMYXllciB9IGZyb20gJ2tlcGxlci1vdXRkYXRlZC1uZWJ1bGEuZ2wtbGF5ZXJzJztcbmltcG9ydCB7IE1BWCB9IGZyb20gJ0BsdW1hLmdsL2NvbnN0YW50cyc7XG5cbmltcG9ydCB7IEFycm93U3R5bGVzLCBERUZBVUxUX1NUWUxFLCBNQVhfQVJST1dTIH0gZnJvbSAnLi4vc3R5bGUnO1xuaW1wb3J0IE5lYnVsYUxheWVyIGZyb20gJy4uL25lYnVsYS1sYXllcic7XG5pbXBvcnQgeyB0b0RlY2tDb2xvciB9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCBEZWNrQ2FjaGUgZnJvbSAnLi4vZGVjay1yZW5kZXJlci9kZWNrLWNhY2hlJztcblxuY29uc3QgTkVCVUxBX1RPX0RFQ0tfRElSRUNUSU9OUyA9IHtcbiAgW0Fycm93U3R5bGVzLk5PTkVdOiB7IGZvcndhcmQ6IGZhbHNlLCBiYWNrd2FyZDogZmFsc2UgfSxcbiAgW0Fycm93U3R5bGVzLkZPUldBUkRdOiB7IGZvcndhcmQ6IHRydWUsIGJhY2t3YXJkOiBmYWxzZSB9LFxuICBbQXJyb3dTdHlsZXMuQkFDS1dBUkRdOiB7IGZvcndhcmQ6IGZhbHNlLCBiYWNrd2FyZDogdHJ1ZSB9LFxuICBbQXJyb3dTdHlsZXMuQk9USF06IHsgZm9yd2FyZDogdHJ1ZSwgYmFja3dhcmQ6IHRydWUgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VnbWVudHNMYXllciBleHRlbmRzIE5lYnVsYUxheWVyIHtcbiAgZGVja0NhY2hlOiBEZWNrQ2FjaGU8KiwgKj47XG4gIG5vQmxlbmQ6IGJvb2xlYW47XG4gIGhpZ2hsaWdodENvbG9yOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXTtcbiAgYXJyb3dTaXplOiBudW1iZXI7XG4gIHJvdW5kZWQ6IGJvb2xlYW47XG4gIGRhc2hlZDogYm9vbGVhbjtcbiAgbWFya2VyTGF5ZXJQcm9wczogP09iamVjdDtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IE9iamVjdCkge1xuICAgIHN1cGVyKGNvbmZpZyk7XG4gICAgdGhpcy5kZWNrQ2FjaGUgPSBuZXcgRGVja0NhY2hlKGNvbmZpZy5nZXREYXRhLCBkYXRhID0+IGNvbmZpZy50b05lYnVsYUZlYXR1cmUoZGF0YSkpO1xuICAgIHRoaXMuZW5hYmxlU2VsZWN0aW9uID0gdHJ1ZTtcbiAgICBjb25zdCB7XG4gICAgICBlbmFibGVQaWNraW5nID0gdHJ1ZSxcbiAgICAgIG5vQmxlbmQgPSBmYWxzZSxcbiAgICAgIHJvdW5kZWQgPSB0cnVlLFxuICAgICAgZGFzaGVkID0gZmFsc2UsXG4gICAgICBtYXJrZXJMYXllclByb3BzID0gbnVsbFxuICAgIH0gPSBjb25maWc7XG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCB7IGVuYWJsZVBpY2tpbmcsIG5vQmxlbmQsIHJvdW5kZWQsIGRhc2hlZCwgbWFya2VyTGF5ZXJQcm9wcyB9KTtcbiAgfVxuXG4gIGdldE1vdXNlT3ZlclNlZ21lbnQoKTogYW55IHtcbiAgICAvLyBUT0RPOiByZW1vdmUgcmVmZXJlbmNlc1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgX2NhbGNNYXJrZXJQZXJjZW50YWdlcyhuZjogT2JqZWN0KTogbnVtYmVyW10ge1xuICAgIGNvbnN0IHsgYXJyb3dQZXJjZW50YWdlcyB9ID0gbmYuc3R5bGU7XG4gICAgaWYgKGFycm93UGVyY2VudGFnZXMpIHtcbiAgICAgIHJldHVybiBhcnJvd1BlcmNlbnRhZ2VzO1xuICAgIH1cblxuICAgIGNvbnN0IGFycm93U3R5bGUgPSBuZi5zdHlsZS5hcnJvd1N0eWxlIHx8IERFRkFVTFRfU1RZTEUuYXJyb3dTdHlsZTtcbiAgICBpZiAoYXJyb3dTdHlsZSA9PT0gQXJyb3dTdHlsZXMuTk9ORSkgcmV0dXJuIFtdO1xuXG4gICAgY29uc3QgYXJyb3dDb3VudCA9IE1hdGgubWluKG5mLnN0eWxlLmFycm93Q291bnQgfHwgREVGQVVMVF9TVFlMRS5hcnJvd0NvdW50LCBNQVhfQVJST1dTKTtcbiAgICByZXR1cm4gW1swLjVdLCBbMC4zMywgMC42Nl0sIFswLjI1LCAwLjUsIDAuNzVdXVthcnJvd0NvdW50IC0gMV07XG4gIH1cblxuICBfZ2V0SGlnaGxpZ2h0ZWRPYmplY3RJbmRleCh7IG5lYnVsYSB9OiBPYmplY3QpOiBudW1iZXIge1xuICAgIGNvbnN0IHsgZGVja2dsTW91c2VPdmVySW5mbyB9ID0gbmVidWxhO1xuICAgIGlmIChkZWNrZ2xNb3VzZU92ZXJJbmZvKSB7XG4gICAgICBjb25zdCB7IG9yaWdpbmFsTGF5ZXIsIGluZGV4IH0gPSBkZWNrZ2xNb3VzZU92ZXJJbmZvO1xuICAgICAgaWYgKG9yaWdpbmFsTGF5ZXIgPT09IHRoaXMpIHtcbiAgICAgICAgcmV0dXJuIGluZGV4O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIG5vIG9iamVjdFxuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIHJlbmRlcih7IG5lYnVsYSB9OiBPYmplY3QpIHtcbiAgICBjb25zdCBkZWZhdWx0Q29sb3IgPSBbMHgwLCAweDAsIDB4MCwgMHhmZl07XG4gICAgY29uc3QgeyBvYmplY3RzLCB1cGRhdGVUcmlnZ2VyIH0gPSB0aGlzLmRlY2tDYWNoZTtcblxuICAgIHJldHVybiBuZXcgUGF0aE1hcmtlckxheWVyKHtcbiAgICAgIGlkOiBgc2VnbWVudHMtJHt0aGlzLmlkfWAsXG4gICAgICBkYXRhOiBvYmplY3RzLFxuICAgICAgb3BhY2l0eTogMSxcbiAgICAgIGZwNjQ6IGZhbHNlLFxuICAgICAgcm91bmRlZDogdGhpcy5yb3VuZGVkLFxuICAgICAgcGlja2FibGU6IHRydWUsXG4gICAgICBzaXplU2NhbGU6IHRoaXMuYXJyb3dTaXplIHx8IDYsXG4gICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgIGRlcHRoVGVzdDogZmFsc2UsXG4gICAgICAgIGJsZW5kOiAhdGhpcy5ub0JsZW5kLFxuICAgICAgICBibGVuZEVxdWF0aW9uOiBNQVhcbiAgICAgIH0sXG4gICAgICBnZXRQYXRoOiBuZiA9PiBuZi5nZW9Kc29uLmdlb21ldHJ5LmNvb3JkaW5hdGVzLFxuICAgICAgZ2V0Q29sb3I6IG5mID0+IHRvRGVja0NvbG9yKG5mLnN0eWxlLmxpbmVDb2xvciwgZGVmYXVsdENvbG9yKSxcbiAgICAgIGdldFdpZHRoOiBuZiA9PiBuZi5zdHlsZS5saW5lV2lkdGhNZXRlcnMgfHwgMSxcbiAgICAgIGdldFpMZXZlbDogbmYgPT4gbmYuc3R5bGUuekxldmVsICogMjU1LFxuICAgICAgZ2V0RGlyZWN0aW9uOiBuZiA9PiBORUJVTEFfVE9fREVDS19ESVJFQ1RJT05TW25mLnN0eWxlLmFycm93U3R5bGVdLFxuICAgICAgZ2V0TWFya2VyQ29sb3I6IG5mID0+IHRvRGVja0NvbG9yKG5mLnN0eWxlLmFycm93Q29sb3IsIGRlZmF1bHRDb2xvciksXG4gICAgICBnZXRNYXJrZXJQZXJjZW50YWdlczogdGhpcy5fY2FsY01hcmtlclBlcmNlbnRhZ2VzLFxuICAgICAgdXBkYXRlVHJpZ2dlcnM6IHsgYWxsOiB1cGRhdGVUcmlnZ2VyIH0sXG5cbiAgICAgIGhpZ2hsaWdodGVkT2JqZWN0SW5kZXg6IHRoaXMuX2dldEhpZ2hsaWdodGVkT2JqZWN0SW5kZXgoeyBuZWJ1bGEgfSksXG4gICAgICBoaWdobGlnaHRDb2xvcjogdG9EZWNrQ29sb3IodGhpcy5oaWdobGlnaHRDb2xvciksXG5cbiAgICAgIGRhc2hKdXN0aWZpZWQ6IHRoaXMuZGFzaGVkLFxuICAgICAgZ2V0RGFzaEFycmF5OiB0aGlzLmRhc2hlZCA/IG5mID0+IG5mLnN0eWxlLmRhc2hBcnJheSA6IG51bGwsXG4gICAgICBtYXJrZXJMYXllclByb3BzOlxuICAgICAgICB0aGlzLm1hcmtlckxheWVyUHJvcHMgfHwgKFBhdGhNYXJrZXJMYXllcjogT2JqZWN0KS5kZWZhdWx0UHJvcHMubWFya2VyTGF5ZXJQcm9wcyxcblxuICAgICAgbmVidWxhTGF5ZXI6IHRoaXNcbiAgICB9KTtcbiAgfVxufVxuIl19