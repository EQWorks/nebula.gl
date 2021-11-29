"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _layers = require("@nebula.gl/layers");

var _constants = require("@luma.gl/constants");

var _style = require("../style");

var _nebulaLayer = _interopRequireDefault(require("../nebula-layer"));

var _utils = require("../utils");

var _deckCache = _interopRequireDefault(require("../deck-renderer/deck-cache"));

var _NEBULA_TO_DECK_DIREC;

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

var SegmentsLayer =
/*#__PURE__*/
function (_NebulaLayer) {
  _inherits(SegmentsLayer, _NebulaLayer);

  function SegmentsLayer(config) {
    var _this;

    _classCallCheck(this, SegmentsLayer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SegmentsLayer).call(this, config));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "deckCache", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "noBlend", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "highlightColor", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "arrowSize", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "rounded", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "dashed", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "markerLayerProps", void 0);

    _this.deckCache = new _deckCache.default(config.getData, function (data) {
      return config.toNebulaFeature(data);
    });
    _this.enableSelection = true;
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
    Object.assign(_assertThisInitialized(_assertThisInitialized(_this)), {
      enablePicking: enablePicking,
      noBlend: noBlend,
      rounded: rounded,
      dashed: dashed,
      markerLayerProps: markerLayerProps
    });
    return _this;
  }

  _createClass(SegmentsLayer, [{
    key: "getMouseOverSegment",
    value: function getMouseOverSegment() {
      // TODO: remove references
      return null;
    }
  }, {
    key: "_calcMarkerPercentages",
    value: function _calcMarkerPercentages(nf) {
      var arrowPercentages = nf.style.arrowPercentages;

      if (arrowPercentages) {
        return arrowPercentages;
      }

      var arrowStyle = nf.style.arrowStyle || _style.DEFAULT_STYLE.arrowStyle;
      if (arrowStyle === _style.ArrowStyles.NONE) return [];
      var arrowCount = Math.min(nf.style.arrowCount || _style.DEFAULT_STYLE.arrowCount, _style.MAX_ARROWS);
      return [[0.5], [0.33, 0.66], [0.25, 0.5, 0.75]][arrowCount - 1];
    }
  }, {
    key: "_getHighlightedObjectIndex",
    value: function _getHighlightedObjectIndex(_ref) {
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
  }, {
    key: "render",
    value: function render(_ref2) {
      var nebula = _ref2.nebula;
      var defaultColor = [0x0, 0x0, 0x0, 0xff];
      var _this$deckCache = this.deckCache,
          objects = _this$deckCache.objects,
          updateTrigger = _this$deckCache.updateTrigger;
      return new _layers.PathMarkerLayer({
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
        markerLayerProps: this.markerLayerProps || _layers.PathMarkerLayer.defaultProps.markerLayerProps,
        nebulaLayer: this
      });
    }
  }]);

  return SegmentsLayer;
}(_nebulaLayer.default);

exports.default = SegmentsLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvbGF5ZXJzL3NlZ21lbnRzLWxheWVyLmpzIl0sIm5hbWVzIjpbIk5FQlVMQV9UT19ERUNLX0RJUkVDVElPTlMiLCJBcnJvd1N0eWxlcyIsIk5PTkUiLCJmb3J3YXJkIiwiYmFja3dhcmQiLCJGT1JXQVJEIiwiQkFDS1dBUkQiLCJCT1RIIiwiU2VnbWVudHNMYXllciIsImNvbmZpZyIsImRlY2tDYWNoZSIsIkRlY2tDYWNoZSIsImdldERhdGEiLCJkYXRhIiwidG9OZWJ1bGFGZWF0dXJlIiwiZW5hYmxlU2VsZWN0aW9uIiwiZW5hYmxlUGlja2luZyIsIm5vQmxlbmQiLCJyb3VuZGVkIiwiZGFzaGVkIiwibWFya2VyTGF5ZXJQcm9wcyIsIk9iamVjdCIsImFzc2lnbiIsIm5mIiwiYXJyb3dQZXJjZW50YWdlcyIsInN0eWxlIiwiYXJyb3dTdHlsZSIsIkRFRkFVTFRfU1RZTEUiLCJhcnJvd0NvdW50IiwiTWF0aCIsIm1pbiIsIk1BWF9BUlJPV1MiLCJuZWJ1bGEiLCJkZWNrZ2xNb3VzZU92ZXJJbmZvIiwib3JpZ2luYWxMYXllciIsImluZGV4IiwiZGVmYXVsdENvbG9yIiwib2JqZWN0cyIsInVwZGF0ZVRyaWdnZXIiLCJQYXRoTWFya2VyTGF5ZXIiLCJpZCIsIm9wYWNpdHkiLCJmcDY0IiwicGlja2FibGUiLCJzaXplU2NhbGUiLCJhcnJvd1NpemUiLCJwYXJhbWV0ZXJzIiwiZGVwdGhUZXN0IiwiYmxlbmQiLCJibGVuZEVxdWF0aW9uIiwiTUFYIiwiZ2V0UGF0aCIsImdlb0pzb24iLCJnZW9tZXRyeSIsImNvb3JkaW5hdGVzIiwiZ2V0Q29sb3IiLCJsaW5lQ29sb3IiLCJnZXRXaWR0aCIsImxpbmVXaWR0aE1ldGVycyIsImdldFpMZXZlbCIsInpMZXZlbCIsImdldERpcmVjdGlvbiIsImdldE1hcmtlckNvbG9yIiwiYXJyb3dDb2xvciIsImdldE1hcmtlclBlcmNlbnRhZ2VzIiwiX2NhbGNNYXJrZXJQZXJjZW50YWdlcyIsInVwZGF0ZVRyaWdnZXJzIiwiYWxsIiwiaGlnaGxpZ2h0ZWRPYmplY3RJbmRleCIsIl9nZXRIaWdobGlnaHRlZE9iamVjdEluZGV4IiwiaGlnaGxpZ2h0Q29sb3IiLCJkYXNoSnVzdGlmaWVkIiwiZ2V0RGFzaEFycmF5IiwiZGFzaEFycmF5IiwiZGVmYXVsdFByb3BzIiwibmVidWxhTGF5ZXIiLCJOZWJ1bGFMYXllciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLHlCQUF5Qix1RUFDNUJDLG1CQUFZQyxJQURnQixFQUNUO0FBQUVDLEVBQUFBLE9BQU8sRUFBRSxLQUFYO0FBQWtCQyxFQUFBQSxRQUFRLEVBQUU7QUFBNUIsQ0FEUywwQ0FFNUJILG1CQUFZSSxPQUZnQixFQUVOO0FBQUVGLEVBQUFBLE9BQU8sRUFBRSxJQUFYO0FBQWlCQyxFQUFBQSxRQUFRLEVBQUU7QUFBM0IsQ0FGTSwwQ0FHNUJILG1CQUFZSyxRQUhnQixFQUdMO0FBQUVILEVBQUFBLE9BQU8sRUFBRSxLQUFYO0FBQWtCQyxFQUFBQSxRQUFRLEVBQUU7QUFBNUIsQ0FISywwQ0FJNUJILG1CQUFZTSxJQUpnQixFQUlUO0FBQUVKLEVBQUFBLE9BQU8sRUFBRSxJQUFYO0FBQWlCQyxFQUFBQSxRQUFRLEVBQUU7QUFBM0IsQ0FKUyx5QkFBL0I7O0lBT3FCSSxhOzs7OztBQVNuQix5QkFBWUMsTUFBWixFQUE0QjtBQUFBOztBQUFBOztBQUMxQix1RkFBTUEsTUFBTjs7QUFEMEI7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBRTFCLFVBQUtDLFNBQUwsR0FBaUIsSUFBSUMsa0JBQUosQ0FBY0YsTUFBTSxDQUFDRyxPQUFyQixFQUE4QixVQUFBQyxJQUFJO0FBQUEsYUFBSUosTUFBTSxDQUFDSyxlQUFQLENBQXVCRCxJQUF2QixDQUFKO0FBQUEsS0FBbEMsQ0FBakI7QUFDQSxVQUFLRSxlQUFMLEdBQXVC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Z0M7QUFBRXJDLFVBQUFBLE1BQU0sRUFBTkE7QUFBRixTQUFoQyxDQXRCQztBQXVCekJzQyxRQUFBQSxjQUFjLEVBQUUsd0JBQVksS0FBS0EsY0FBakIsQ0F2QlM7QUF5QnpCQyxRQUFBQSxhQUFhLEVBQUUsS0FBS3BELE1BekJLO0FBMEJ6QnFELFFBQUFBLFlBQVksRUFBRSxLQUFLckQsTUFBTCxHQUFjLFVBQUFJLEVBQUU7QUFBQSxpQkFBSUEsRUFBRSxDQUFDRSxLQUFILENBQVNnRCxTQUFiO0FBQUEsU0FBaEIsR0FBeUMsSUExQjlCO0FBMkJ6QnJELFFBQUFBLGdCQUFnQixFQUNkLEtBQUtBLGdCQUFMLElBQTBCbUIsdUJBQUQsQ0FBMEJtQyxZQUExQixDQUF1Q3RELGdCQTVCekM7QUE4QnpCdUQsUUFBQUEsV0FBVyxFQUFFO0FBOUJZLE9BQXBCLENBQVA7QUFnQ0Q7Ozs7RUExRndDQyxvQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5pbXBvcnQgeyBQYXRoTWFya2VyTGF5ZXIgfSBmcm9tICdAbmVidWxhLmdsL2xheWVycyc7XG5pbXBvcnQgeyBNQVggfSBmcm9tICdAbHVtYS5nbC9jb25zdGFudHMnO1xuXG5pbXBvcnQgeyBBcnJvd1N0eWxlcywgREVGQVVMVF9TVFlMRSwgTUFYX0FSUk9XUyB9IGZyb20gJy4uL3N0eWxlJztcbmltcG9ydCBOZWJ1bGFMYXllciBmcm9tICcuLi9uZWJ1bGEtbGF5ZXInO1xuaW1wb3J0IHsgdG9EZWNrQ29sb3IgfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQgRGVja0NhY2hlIGZyb20gJy4uL2RlY2stcmVuZGVyZXIvZGVjay1jYWNoZSc7XG5cbmNvbnN0IE5FQlVMQV9UT19ERUNLX0RJUkVDVElPTlMgPSB7XG4gIFtBcnJvd1N0eWxlcy5OT05FXTogeyBmb3J3YXJkOiBmYWxzZSwgYmFja3dhcmQ6IGZhbHNlIH0sXG4gIFtBcnJvd1N0eWxlcy5GT1JXQVJEXTogeyBmb3J3YXJkOiB0cnVlLCBiYWNrd2FyZDogZmFsc2UgfSxcbiAgW0Fycm93U3R5bGVzLkJBQ0tXQVJEXTogeyBmb3J3YXJkOiBmYWxzZSwgYmFja3dhcmQ6IHRydWUgfSxcbiAgW0Fycm93U3R5bGVzLkJPVEhdOiB7IGZvcndhcmQ6IHRydWUsIGJhY2t3YXJkOiB0cnVlIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlZ21lbnRzTGF5ZXIgZXh0ZW5kcyBOZWJ1bGFMYXllciB7XG4gIGRlY2tDYWNoZTogRGVja0NhY2hlPCosICo+O1xuICBub0JsZW5kOiBib29sZWFuO1xuICBoaWdobGlnaHRDb2xvcjogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl07XG4gIGFycm93U2l6ZTogbnVtYmVyO1xuICByb3VuZGVkOiBib29sZWFuO1xuICBkYXNoZWQ6IGJvb2xlYW47XG4gIG1hcmtlckxheWVyUHJvcHM6ID9PYmplY3Q7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBPYmplY3QpIHtcbiAgICBzdXBlcihjb25maWcpO1xuICAgIHRoaXMuZGVja0NhY2hlID0gbmV3IERlY2tDYWNoZShjb25maWcuZ2V0RGF0YSwgZGF0YSA9PiBjb25maWcudG9OZWJ1bGFGZWF0dXJlKGRhdGEpKTtcbiAgICB0aGlzLmVuYWJsZVNlbGVjdGlvbiA9IHRydWU7XG4gICAgY29uc3Qge1xuICAgICAgZW5hYmxlUGlja2luZyA9IHRydWUsXG4gICAgICBub0JsZW5kID0gZmFsc2UsXG4gICAgICByb3VuZGVkID0gdHJ1ZSxcbiAgICAgIGRhc2hlZCA9IGZhbHNlLFxuICAgICAgbWFya2VyTGF5ZXJQcm9wcyA9IG51bGxcbiAgICB9ID0gY29uZmlnO1xuICAgIE9iamVjdC5hc3NpZ24odGhpcywgeyBlbmFibGVQaWNraW5nLCBub0JsZW5kLCByb3VuZGVkLCBkYXNoZWQsIG1hcmtlckxheWVyUHJvcHMgfSk7XG4gIH1cblxuICBnZXRNb3VzZU92ZXJTZWdtZW50KCk6IGFueSB7XG4gICAgLy8gVE9ETzogcmVtb3ZlIHJlZmVyZW5jZXNcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIF9jYWxjTWFya2VyUGVyY2VudGFnZXMobmY6IE9iamVjdCk6IG51bWJlcltdIHtcbiAgICBjb25zdCB7IGFycm93UGVyY2VudGFnZXMgfSA9IG5mLnN0eWxlO1xuICAgIGlmIChhcnJvd1BlcmNlbnRhZ2VzKSB7XG4gICAgICByZXR1cm4gYXJyb3dQZXJjZW50YWdlcztcbiAgICB9XG5cbiAgICBjb25zdCBhcnJvd1N0eWxlID0gbmYuc3R5bGUuYXJyb3dTdHlsZSB8fCBERUZBVUxUX1NUWUxFLmFycm93U3R5bGU7XG4gICAgaWYgKGFycm93U3R5bGUgPT09IEFycm93U3R5bGVzLk5PTkUpIHJldHVybiBbXTtcblxuICAgIGNvbnN0IGFycm93Q291bnQgPSBNYXRoLm1pbihuZi5zdHlsZS5hcnJvd0NvdW50IHx8IERFRkFVTFRfU1RZTEUuYXJyb3dDb3VudCwgTUFYX0FSUk9XUyk7XG4gICAgcmV0dXJuIFtbMC41XSwgWzAuMzMsIDAuNjZdLCBbMC4yNSwgMC41LCAwLjc1XV1bYXJyb3dDb3VudCAtIDFdO1xuICB9XG5cbiAgX2dldEhpZ2hsaWdodGVkT2JqZWN0SW5kZXgoeyBuZWJ1bGEgfTogT2JqZWN0KTogbnVtYmVyIHtcbiAgICBjb25zdCB7IGRlY2tnbE1vdXNlT3ZlckluZm8gfSA9IG5lYnVsYTtcbiAgICBpZiAoZGVja2dsTW91c2VPdmVySW5mbykge1xuICAgICAgY29uc3QgeyBvcmlnaW5hbExheWVyLCBpbmRleCB9ID0gZGVja2dsTW91c2VPdmVySW5mbztcbiAgICAgIGlmIChvcmlnaW5hbExheWVyID09PSB0aGlzKSB7XG4gICAgICAgIHJldHVybiBpbmRleDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBubyBvYmplY3RcbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICByZW5kZXIoeyBuZWJ1bGEgfTogT2JqZWN0KSB7XG4gICAgY29uc3QgZGVmYXVsdENvbG9yID0gWzB4MCwgMHgwLCAweDAsIDB4ZmZdO1xuICAgIGNvbnN0IHsgb2JqZWN0cywgdXBkYXRlVHJpZ2dlciB9ID0gdGhpcy5kZWNrQ2FjaGU7XG5cbiAgICByZXR1cm4gbmV3IFBhdGhNYXJrZXJMYXllcih7XG4gICAgICBpZDogYHNlZ21lbnRzLSR7dGhpcy5pZH1gLFxuICAgICAgZGF0YTogb2JqZWN0cyxcbiAgICAgIG9wYWNpdHk6IDEsXG4gICAgICBmcDY0OiBmYWxzZSxcbiAgICAgIHJvdW5kZWQ6IHRoaXMucm91bmRlZCxcbiAgICAgIHBpY2thYmxlOiB0cnVlLFxuICAgICAgc2l6ZVNjYWxlOiB0aGlzLmFycm93U2l6ZSB8fCA2LFxuICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICBkZXB0aFRlc3Q6IGZhbHNlLFxuICAgICAgICBibGVuZDogIXRoaXMubm9CbGVuZCxcbiAgICAgICAgYmxlbmRFcXVhdGlvbjogTUFYXG4gICAgICB9LFxuICAgICAgZ2V0UGF0aDogbmYgPT4gbmYuZ2VvSnNvbi5nZW9tZXRyeS5jb29yZGluYXRlcyxcbiAgICAgIGdldENvbG9yOiBuZiA9PiB0b0RlY2tDb2xvcihuZi5zdHlsZS5saW5lQ29sb3IsIGRlZmF1bHRDb2xvciksXG4gICAgICBnZXRXaWR0aDogbmYgPT4gbmYuc3R5bGUubGluZVdpZHRoTWV0ZXJzIHx8IDEsXG4gICAgICBnZXRaTGV2ZWw6IG5mID0+IG5mLnN0eWxlLnpMZXZlbCAqIDI1NSxcbiAgICAgIGdldERpcmVjdGlvbjogbmYgPT4gTkVCVUxBX1RPX0RFQ0tfRElSRUNUSU9OU1tuZi5zdHlsZS5hcnJvd1N0eWxlXSxcbiAgICAgIGdldE1hcmtlckNvbG9yOiBuZiA9PiB0b0RlY2tDb2xvcihuZi5zdHlsZS5hcnJvd0NvbG9yLCBkZWZhdWx0Q29sb3IpLFxuICAgICAgZ2V0TWFya2VyUGVyY2VudGFnZXM6IHRoaXMuX2NhbGNNYXJrZXJQZXJjZW50YWdlcyxcbiAgICAgIHVwZGF0ZVRyaWdnZXJzOiB7IGFsbDogdXBkYXRlVHJpZ2dlciB9LFxuXG4gICAgICBoaWdobGlnaHRlZE9iamVjdEluZGV4OiB0aGlzLl9nZXRIaWdobGlnaHRlZE9iamVjdEluZGV4KHsgbmVidWxhIH0pLFxuICAgICAgaGlnaGxpZ2h0Q29sb3I6IHRvRGVja0NvbG9yKHRoaXMuaGlnaGxpZ2h0Q29sb3IpLFxuXG4gICAgICBkYXNoSnVzdGlmaWVkOiB0aGlzLmRhc2hlZCxcbiAgICAgIGdldERhc2hBcnJheTogdGhpcy5kYXNoZWQgPyBuZiA9PiBuZi5zdHlsZS5kYXNoQXJyYXkgOiBudWxsLFxuICAgICAgbWFya2VyTGF5ZXJQcm9wczpcbiAgICAgICAgdGhpcy5tYXJrZXJMYXllclByb3BzIHx8IChQYXRoTWFya2VyTGF5ZXI6IE9iamVjdCkuZGVmYXVsdFByb3BzLm1hcmtlckxheWVyUHJvcHMsXG5cbiAgICAgIG5lYnVsYUxheWVyOiB0aGlzXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==