"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.SELECTION_TYPE = void 0;

var _keplerOutdatedDeck = require("kepler-outdated-deck.gl-core");

var _keplerOutdatedDeck2 = require("kepler-outdated-deck.gl-layers");

var _helpers = require("@turf/helpers");

var _buffer = _interopRequireDefault(require("@turf/buffer"));

var _difference = _interopRequireDefault(require("@turf/difference"));

var _editableGeojsonLayer = _interopRequireDefault(require("./editable-geojson-layer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var SELECTION_TYPE = {
  NONE: null,
  RECTANGLE: 'rectangle',
  POLYGON: 'polygon'
};
exports.SELECTION_TYPE = SELECTION_TYPE;
var defaultProps = {
  selectionType: SELECTION_TYPE.RECTANGLE,
  layerIds: [],
  onSelect: function onSelect() {}
};
var EMPTY_DATA = {
  type: 'FeatureCollection',
  features: []
};
var EXPANSION_KM = 50;
var LAYER_ID_GEOJSON = 'selection-geojson';
var LAYER_ID_BLOCKER = 'selection-blocker';
var PASS_THROUGH_PROPS = ['lineWidthScale', 'lineWidthMinPixels', 'lineWidthMaxPixels', 'lineWidthUnits', 'lineJointRounded', 'lineMiterLimit', 'pointRadiusScale', 'pointRadiusMinPixels', 'pointRadiusMaxPixels', 'lineDashJustified', 'getLineColor', 'getFillColor', 'getRadius', 'getLineWidth', 'getLineDashArray', 'getTentativeLineDashArray', 'getTentativeLineColor', 'getTentativeFillColor', 'getTentativeLineWidth'];

var SelectionLayer =
/*#__PURE__*/
function (_CompositeLayer) {
  _inherits(SelectionLayer, _CompositeLayer);

  function SelectionLayer() {
    _classCallCheck(this, SelectionLayer);

    return _possibleConstructorReturn(this, _getPrototypeOf(SelectionLayer).apply(this, arguments));
  }

  _createClass(SelectionLayer, [{
    key: "_selectRectangleObjects",
    value: function _selectRectangleObjects(coordinates) {
      var _this$props = this.props,
          layerIds = _this$props.layerIds,
          onSelect = _this$props.onSelect;

      var _this$context$viewpor = this.context.viewport.project(coordinates[0][0]),
          _this$context$viewpor2 = _slicedToArray(_this$context$viewpor, 2),
          x1 = _this$context$viewpor2[0],
          y1 = _this$context$viewpor2[1];

      var _this$context$viewpor3 = this.context.viewport.project(coordinates[0][2]),
          _this$context$viewpor4 = _slicedToArray(_this$context$viewpor3, 2),
          x2 = _this$context$viewpor4[0],
          y2 = _this$context$viewpor4[1];

      var pickingInfos = this.context.deck.pickObjects({
        x: Math.min(x1, x2),
        y: Math.min(y1, y2),
        width: Math.abs(x2 - x1),
        height: Math.abs(y2 - y1),
        layerIds: layerIds
      });
      onSelect({
        pickingInfos: pickingInfos
      });
    }
  }, {
    key: "_selectPolygonObjects",
    value: function _selectPolygonObjects(coordinates) {
      var _this = this;

      var _this$props2 = this.props,
          layerIds = _this$props2.layerIds,
          onSelect = _this$props2.onSelect;
      var mousePoints = coordinates[0].map(function (c) {
        return _this.context.viewport.project(c);
      });
      var allX = mousePoints.map(function (mousePoint) {
        return mousePoint[0];
      });
      var allY = mousePoints.map(function (mousePoint) {
        return mousePoint[1];
      });
      var x = Math.min.apply(Math, _toConsumableArray(allX));
      var y = Math.min.apply(Math, _toConsumableArray(allY));
      var maxX = Math.max.apply(Math, _toConsumableArray(allX));
      var maxY = Math.max.apply(Math, _toConsumableArray(allY)); // Use a polygon to hide the outside, because pickObjects()
      // does not support polygons

      var landPointsPoly = (0, _helpers.polygon)(coordinates);
      var bigBuffer = (0, _buffer.default)(landPointsPoly, EXPANSION_KM);
      var bigPolygon;

      try {
        // turfDifference throws an exception if the polygon
        // intersects with itself (TODO: check if true in all versions)
        bigPolygon = (0, _difference.default)(bigBuffer, landPointsPoly);
      } catch (e) {
        // invalid selection polygon
        console.log('turfDifference() error', e); // eslint-disable-line

        return;
      }

      this.setState({
        pendingPolygonSelection: {
          bigPolygon: bigPolygon
        }
      });
      var blockerId = "".concat(this.props.id, "-").concat(LAYER_ID_BLOCKER); // HACK, find a better way

      setTimeout(function () {
        var pickingInfos = _this.context.deck.pickObjects({
          x: x,
          y: y,
          width: maxX - x,
          height: maxY - y,
          layerIds: [blockerId].concat(_toConsumableArray(layerIds))
        });

        onSelect({
          pickingInfos: pickingInfos.filter(function (item) {
            return item.layer.id !== _this.props.id;
          })
        });
      }, 250);
    }
  }, {
    key: "renderLayers",
    value: function renderLayers() {
      var _SELECTION_TYPE$RECTA,
          _this2 = this;

      var pendingPolygonSelection = this.state.pendingPolygonSelection;
      var mode = (_SELECTION_TYPE$RECTA = {}, _defineProperty(_SELECTION_TYPE$RECTA, SELECTION_TYPE.RECTANGLE, 'drawRectangle'), _defineProperty(_SELECTION_TYPE$RECTA, SELECTION_TYPE.POLYGON, 'drawPolygon'), _SELECTION_TYPE$RECTA)[this.props.selectionType] || 'view';
      var inheritedProps = {};
      PASS_THROUGH_PROPS.forEach(function (p) {
        if (_this2.props[p] !== undefined) inheritedProps[p] = _this2.props[p];
      });
      var layers = [new _editableGeojsonLayer.default(this.getSubLayerProps(_objectSpread({
        id: LAYER_ID_GEOJSON,
        pickable: true,
        mode: mode,
        selectedFeatureIndexes: [],
        data: EMPTY_DATA,
        onEdit: function onEdit(_ref) {
          var updatedData = _ref.updatedData,
              editType = _ref.editType;

          if (editType === 'addFeature') {
            var coordinates = updatedData.features[0].geometry.coordinates;

            if (_this2.props.selectionType === SELECTION_TYPE.RECTANGLE) {
              _this2._selectRectangleObjects(coordinates);
            } else if (_this2.props.selectionType === SELECTION_TYPE.POLYGON) {
              _this2._selectPolygonObjects(coordinates);
            }
          }
        }
      }, inheritedProps)))];

      if (pendingPolygonSelection) {
        var bigPolygon = pendingPolygonSelection.bigPolygon;
        layers.push(new _keplerOutdatedDeck2.PolygonLayer(this.getSubLayerProps({
          id: LAYER_ID_BLOCKER,
          pickable: true,
          stroked: false,
          opacity: 1.0,
          data: [bigPolygon],
          getLineColor: function getLineColor(obj) {
            return [0, 0, 0, 1];
          },
          getFillColor: function getFillColor(obj) {
            return [0, 0, 0, 1];
          },
          getPolygon: function getPolygon(o) {
            return o.geometry.coordinates;
          }
        })));
      }

      return layers;
    }
  }, {
    key: "shouldUpdateState",
    value: function shouldUpdateState(_ref2) {
      var _ref2$changeFlags = _ref2.changeFlags,
          stateChanged = _ref2$changeFlags.stateChanged,
          propsOrDataChanged = _ref2$changeFlags.propsOrDataChanged;
      return stateChanged || propsOrDataChanged;
    }
  }]);

  return SelectionLayer;
}(_keplerOutdatedDeck.CompositeLayer);

exports.default = SelectionLayer;
SelectionLayer.layerName = 'SelectionLayer';
SelectionLayer.defaultProps = defaultProps;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sYXllcnMvc2VsZWN0aW9uLWxheWVyLmpzIl0sIm5hbWVzIjpbIlNFTEVDVElPTl9UWVBFIiwiTk9ORSIsIlJFQ1RBTkdMRSIsIlBPTFlHT04iLCJkZWZhdWx0UHJvcHMiLCJzZWxlY3Rpb25UeXBlIiwibGF5ZXJJZHMiLCJvblNlbGVjdCIsIkVNUFRZX0RBVEEiLCJ0eXBlIiwiZmVhdHVyZXMiLCJFWFBBTlNJT05fS00iLCJMQVlFUl9JRF9HRU9KU09OIiwiTEFZRVJfSURfQkxPQ0tFUiIsIlBBU1NfVEhST1VHSF9QUk9QUyIsIlNlbGVjdGlvbkxheWVyIiwiY29vcmRpbmF0ZXMiLCJwcm9wcyIsImNvbnRleHQiLCJ2aWV3cG9ydCIsInByb2plY3QiLCJ4MSIsInkxIiwieDIiLCJ5MiIsInBpY2tpbmdJbmZvcyIsImRlY2siLCJwaWNrT2JqZWN0cyIsIngiLCJNYXRoIiwibWluIiwieSIsIndpZHRoIiwiYWJzIiwiaGVpZ2h0IiwibW91c2VQb2ludHMiLCJtYXAiLCJjIiwiYWxsWCIsIm1vdXNlUG9pbnQiLCJhbGxZIiwibWF4WCIsIm1heCIsIm1heFkiLCJsYW5kUG9pbnRzUG9seSIsImJpZ0J1ZmZlciIsImJpZ1BvbHlnb24iLCJlIiwiY29uc29sZSIsImxvZyIsInNldFN0YXRlIiwicGVuZGluZ1BvbHlnb25TZWxlY3Rpb24iLCJibG9ja2VySWQiLCJpZCIsInNldFRpbWVvdXQiLCJmaWx0ZXIiLCJpdGVtIiwibGF5ZXIiLCJzdGF0ZSIsIm1vZGUiLCJpbmhlcml0ZWRQcm9wcyIsImZvckVhY2giLCJwIiwidW5kZWZpbmVkIiwibGF5ZXJzIiwiRWRpdGFibGVHZW9Kc29uTGF5ZXIiLCJnZXRTdWJMYXllclByb3BzIiwicGlja2FibGUiLCJzZWxlY3RlZEZlYXR1cmVJbmRleGVzIiwiZGF0YSIsIm9uRWRpdCIsInVwZGF0ZWREYXRhIiwiZWRpdFR5cGUiLCJnZW9tZXRyeSIsIl9zZWxlY3RSZWN0YW5nbGVPYmplY3RzIiwiX3NlbGVjdFBvbHlnb25PYmplY3RzIiwicHVzaCIsIlBvbHlnb25MYXllciIsInN0cm9rZWQiLCJvcGFjaXR5IiwiZ2V0TGluZUNvbG9yIiwib2JqIiwiZ2V0RmlsbENvbG9yIiwiZ2V0UG9seWdvbiIsIm8iLCJjaGFuZ2VGbGFncyIsInN0YXRlQ2hhbmdlZCIsInByb3BzT3JEYXRhQ2hhbmdlZCIsIkNvbXBvc2l0ZUxheWVyIiwibGF5ZXJOYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVPLElBQU1BLGNBQWMsR0FBRztBQUM1QkMsRUFBQUEsSUFBSSxFQUFFLElBRHNCO0FBRTVCQyxFQUFBQSxTQUFTLEVBQUUsV0FGaUI7QUFHNUJDLEVBQUFBLE9BQU8sRUFBRTtBQUhtQixDQUF2Qjs7QUFNUCxJQUFNQyxZQUFZLEdBQUc7QUFDbkJDLEVBQUFBLGFBQWEsRUFBRUwsY0FBYyxDQUFDRSxTQURYO0FBRW5CSSxFQUFBQSxRQUFRLEVBQUUsRUFGUztBQUduQkMsRUFBQUEsUUFBUSxFQUFFLG9CQUFNLENBQUU7QUFIQyxDQUFyQjtBQU1BLElBQU1DLFVBQVUsR0FBRztBQUNqQkMsRUFBQUEsSUFBSSxFQUFFLG1CQURXO0FBRWpCQyxFQUFBQSxRQUFRLEVBQUU7QUFGTyxDQUFuQjtBQUtBLElBQU1DLFlBQVksR0FBRyxFQUFyQjtBQUNBLElBQU1DLGdCQUFnQixHQUFHLG1CQUF6QjtBQUNBLElBQU1DLGdCQUFnQixHQUFHLG1CQUF6QjtBQUVBLElBQU1DLGtCQUFrQixHQUFHLENBQ3pCLGdCQUR5QixFQUV6QixvQkFGeUIsRUFHekIsb0JBSHlCLEVBSXpCLGdCQUp5QixFQUt6QixrQkFMeUIsRUFNekIsZ0JBTnlCLEVBT3pCLGtCQVB5QixFQVF6QixzQkFSeUIsRUFTekIsc0JBVHlCLEVBVXpCLG1CQVZ5QixFQVd6QixjQVh5QixFQVl6QixjQVp5QixFQWF6QixXQWJ5QixFQWN6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QUFPRCxZQUFZLElBQUlDLGtCQUF2QjtBQUNEOzs7O0VBakl5Q0Msa0M7OztBQW9JNUN6RSxjQUFjLENBQUMwRSxTQUFmLEdBQTJCLGdCQUEzQjtBQUNBMUUsY0FBYyxDQUFDWCxZQUFmLEdBQThCQSxZQUE5QiIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG4vKiBlc2xpbnQtZW52IGJyb3dzZXIgKi9cbmltcG9ydCB7IENvbXBvc2l0ZUxheWVyIH0gZnJvbSAna2VwbGVyLW91dGRhdGVkLWRlY2suZ2wtY29yZSc7XG5pbXBvcnQgeyBQb2x5Z29uTGF5ZXIgfSBmcm9tICdrZXBsZXItb3V0ZGF0ZWQtZGVjay5nbC1sYXllcnMnO1xuaW1wb3J0IHsgcG9seWdvbiB9IGZyb20gJ0B0dXJmL2hlbHBlcnMnO1xuaW1wb3J0IHR1cmZCdWZmZXIgZnJvbSAnQHR1cmYvYnVmZmVyJztcbmltcG9ydCB0dXJmRGlmZmVyZW5jZSBmcm9tICdAdHVyZi9kaWZmZXJlbmNlJztcblxuaW1wb3J0IEVkaXRhYmxlR2VvSnNvbkxheWVyIGZyb20gJy4vZWRpdGFibGUtZ2VvanNvbi1sYXllcic7XG5cbmV4cG9ydCBjb25zdCBTRUxFQ1RJT05fVFlQRSA9IHtcbiAgTk9ORTogbnVsbCxcbiAgUkVDVEFOR0xFOiAncmVjdGFuZ2xlJyxcbiAgUE9MWUdPTjogJ3BvbHlnb24nXG59O1xuXG5jb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gIHNlbGVjdGlvblR5cGU6IFNFTEVDVElPTl9UWVBFLlJFQ1RBTkdMRSxcbiAgbGF5ZXJJZHM6IFtdLFxuICBvblNlbGVjdDogKCkgPT4ge31cbn07XG5cbmNvbnN0IEVNUFRZX0RBVEEgPSB7XG4gIHR5cGU6ICdGZWF0dXJlQ29sbGVjdGlvbicsXG4gIGZlYXR1cmVzOiBbXVxufTtcblxuY29uc3QgRVhQQU5TSU9OX0tNID0gNTA7XG5jb25zdCBMQVlFUl9JRF9HRU9KU09OID0gJ3NlbGVjdGlvbi1nZW9qc29uJztcbmNvbnN0IExBWUVSX0lEX0JMT0NLRVIgPSAnc2VsZWN0aW9uLWJsb2NrZXInO1xuXG5jb25zdCBQQVNTX1RIUk9VR0hfUFJPUFMgPSBbXG4gICdsaW5lV2lkdGhTY2FsZScsXG4gICdsaW5lV2lkdGhNaW5QaXhlbHMnLFxuICAnbGluZVdpZHRoTWF4UGl4ZWxzJyxcbiAgJ2xpbmVXaWR0aFVuaXRzJyxcbiAgJ2xpbmVKb2ludFJvdW5kZWQnLFxuICAnbGluZU1pdGVyTGltaXQnLFxuICAncG9pbnRSYWRpdXNTY2FsZScsXG4gICdwb2ludFJhZGl1c01pblBpeGVscycsXG4gICdwb2ludFJhZGl1c01heFBpeGVscycsXG4gICdsaW5lRGFzaEp1c3RpZmllZCcsXG4gICdnZXRMaW5lQ29sb3InLFxuICAnZ2V0RmlsbENvbG9yJyxcbiAgJ2dldFJhZGl1cycsXG4gICdnZXRMaW5lV2lkdGgnLFxuICAnZ2V0TGluZURhc2hBcnJheScsXG4gICdnZXRUZW50YXRpdmVMaW5lRGFzaEFycmF5JyxcbiAgJ2dldFRlbnRhdGl2ZUxpbmVDb2xvcicsXG4gICdnZXRUZW50YXRpdmVGaWxsQ29sb3InLFxuICAnZ2V0VGVudGF0aXZlTGluZVdpZHRoJ1xuXTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VsZWN0aW9uTGF5ZXIgZXh0ZW5kcyBDb21wb3NpdGVMYXllciB7XG4gIF9zZWxlY3RSZWN0YW5nbGVPYmplY3RzKGNvb3JkaW5hdGVzOiBhbnkpIHtcbiAgICBjb25zdCB7IGxheWVySWRzLCBvblNlbGVjdCB9ID0gdGhpcy5wcm9wcztcblxuICAgIGNvbnN0IFt4MSwgeTFdID0gdGhpcy5jb250ZXh0LnZpZXdwb3J0LnByb2plY3QoY29vcmRpbmF0ZXNbMF1bMF0pO1xuICAgIGNvbnN0IFt4MiwgeTJdID0gdGhpcy5jb250ZXh0LnZpZXdwb3J0LnByb2plY3QoY29vcmRpbmF0ZXNbMF1bMl0pO1xuXG4gICAgY29uc3QgcGlja2luZ0luZm9zID0gdGhpcy5jb250ZXh0LmRlY2sucGlja09iamVjdHMoe1xuICAgICAgeDogTWF0aC5taW4oeDEsIHgyKSxcbiAgICAgIHk6IE1hdGgubWluKHkxLCB5MiksXG4gICAgICB3aWR0aDogTWF0aC5hYnMoeDIgLSB4MSksXG4gICAgICBoZWlnaHQ6IE1hdGguYWJzKHkyIC0geTEpLFxuICAgICAgbGF5ZXJJZHNcbiAgICB9KTtcblxuICAgIG9uU2VsZWN0KHsgcGlja2luZ0luZm9zIH0pO1xuICB9XG5cbiAgX3NlbGVjdFBvbHlnb25PYmplY3RzKGNvb3JkaW5hdGVzOiBhbnkpIHtcbiAgICBjb25zdCB7IGxheWVySWRzLCBvblNlbGVjdCB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBtb3VzZVBvaW50cyA9IGNvb3JkaW5hdGVzWzBdLm1hcChjID0+IHRoaXMuY29udGV4dC52aWV3cG9ydC5wcm9qZWN0KGMpKTtcblxuICAgIGNvbnN0IGFsbFggPSBtb3VzZVBvaW50cy5tYXAobW91c2VQb2ludCA9PiBtb3VzZVBvaW50WzBdKTtcbiAgICBjb25zdCBhbGxZID0gbW91c2VQb2ludHMubWFwKG1vdXNlUG9pbnQgPT4gbW91c2VQb2ludFsxXSk7XG4gICAgY29uc3QgeCA9IE1hdGgubWluKC4uLmFsbFgpO1xuICAgIGNvbnN0IHkgPSBNYXRoLm1pbiguLi5hbGxZKTtcbiAgICBjb25zdCBtYXhYID0gTWF0aC5tYXgoLi4uYWxsWCk7XG4gICAgY29uc3QgbWF4WSA9IE1hdGgubWF4KC4uLmFsbFkpO1xuXG4gICAgLy8gVXNlIGEgcG9seWdvbiB0byBoaWRlIHRoZSBvdXRzaWRlLCBiZWNhdXNlIHBpY2tPYmplY3RzKClcbiAgICAvLyBkb2VzIG5vdCBzdXBwb3J0IHBvbHlnb25zXG4gICAgY29uc3QgbGFuZFBvaW50c1BvbHkgPSBwb2x5Z29uKGNvb3JkaW5hdGVzKTtcbiAgICBjb25zdCBiaWdCdWZmZXIgPSB0dXJmQnVmZmVyKGxhbmRQb2ludHNQb2x5LCBFWFBBTlNJT05fS00pO1xuICAgIGxldCBiaWdQb2x5Z29uO1xuICAgIHRyeSB7XG4gICAgICAvLyB0dXJmRGlmZmVyZW5jZSB0aHJvd3MgYW4gZXhjZXB0aW9uIGlmIHRoZSBwb2x5Z29uXG4gICAgICAvLyBpbnRlcnNlY3RzIHdpdGggaXRzZWxmIChUT0RPOiBjaGVjayBpZiB0cnVlIGluIGFsbCB2ZXJzaW9ucylcbiAgICAgIGJpZ1BvbHlnb24gPSB0dXJmRGlmZmVyZW5jZShiaWdCdWZmZXIsIGxhbmRQb2ludHNQb2x5KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvLyBpbnZhbGlkIHNlbGVjdGlvbiBwb2x5Z29uXG4gICAgICBjb25zb2xlLmxvZygndHVyZkRpZmZlcmVuY2UoKSBlcnJvcicsIGUpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBwZW5kaW5nUG9seWdvblNlbGVjdGlvbjoge1xuICAgICAgICBiaWdQb2x5Z29uXG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBibG9ja2VySWQgPSBgJHt0aGlzLnByb3BzLmlkfS0ke0xBWUVSX0lEX0JMT0NLRVJ9YDtcblxuICAgIC8vIEhBQ0ssIGZpbmQgYSBiZXR0ZXIgd2F5XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBjb25zdCBwaWNraW5nSW5mb3MgPSB0aGlzLmNvbnRleHQuZGVjay5waWNrT2JqZWN0cyh7XG4gICAgICAgIHgsXG4gICAgICAgIHksXG4gICAgICAgIHdpZHRoOiBtYXhYIC0geCxcbiAgICAgICAgaGVpZ2h0OiBtYXhZIC0geSxcbiAgICAgICAgbGF5ZXJJZHM6IFtibG9ja2VySWQsIC4uLmxheWVySWRzXVxuICAgICAgfSk7XG5cbiAgICAgIG9uU2VsZWN0KHtcbiAgICAgICAgcGlja2luZ0luZm9zOiBwaWNraW5nSW5mb3MuZmlsdGVyKGl0ZW0gPT4gaXRlbS5sYXllci5pZCAhPT0gdGhpcy5wcm9wcy5pZClcbiAgICAgIH0pO1xuICAgIH0sIDI1MCk7XG4gIH1cblxuICByZW5kZXJMYXllcnMoKSB7XG4gICAgY29uc3QgeyBwZW5kaW5nUG9seWdvblNlbGVjdGlvbiB9ID0gdGhpcy5zdGF0ZTtcblxuICAgIGNvbnN0IG1vZGUgPVxuICAgICAge1xuICAgICAgICBbU0VMRUNUSU9OX1RZUEUuUkVDVEFOR0xFXTogJ2RyYXdSZWN0YW5nbGUnLFxuICAgICAgICBbU0VMRUNUSU9OX1RZUEUuUE9MWUdPTl06ICdkcmF3UG9seWdvbidcbiAgICAgIH1bdGhpcy5wcm9wcy5zZWxlY3Rpb25UeXBlXSB8fCAndmlldyc7XG5cbiAgICBjb25zdCBpbmhlcml0ZWRQcm9wcyA9IHt9O1xuICAgIFBBU1NfVEhST1VHSF9QUk9QUy5mb3JFYWNoKHAgPT4ge1xuICAgICAgaWYgKHRoaXMucHJvcHNbcF0gIT09IHVuZGVmaW5lZCkgaW5oZXJpdGVkUHJvcHNbcF0gPSB0aGlzLnByb3BzW3BdO1xuICAgIH0pO1xuXG4gICAgY29uc3QgbGF5ZXJzID0gW1xuICAgICAgbmV3IEVkaXRhYmxlR2VvSnNvbkxheWVyKFxuICAgICAgICB0aGlzLmdldFN1YkxheWVyUHJvcHMoe1xuICAgICAgICAgIGlkOiBMQVlFUl9JRF9HRU9KU09OLFxuICAgICAgICAgIHBpY2thYmxlOiB0cnVlLFxuICAgICAgICAgIG1vZGUsXG4gICAgICAgICAgc2VsZWN0ZWRGZWF0dXJlSW5kZXhlczogW10sXG4gICAgICAgICAgZGF0YTogRU1QVFlfREFUQSxcbiAgICAgICAgICBvbkVkaXQ6ICh7IHVwZGF0ZWREYXRhLCBlZGl0VHlwZSB9KSA9PiB7XG4gICAgICAgICAgICBpZiAoZWRpdFR5cGUgPT09ICdhZGRGZWF0dXJlJykge1xuICAgICAgICAgICAgICBjb25zdCB7IGNvb3JkaW5hdGVzIH0gPSB1cGRhdGVkRGF0YS5mZWF0dXJlc1swXS5nZW9tZXRyeTtcblxuICAgICAgICAgICAgICBpZiAodGhpcy5wcm9wcy5zZWxlY3Rpb25UeXBlID09PSBTRUxFQ1RJT05fVFlQRS5SRUNUQU5HTEUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RSZWN0YW5nbGVPYmplY3RzKGNvb3JkaW5hdGVzKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnByb3BzLnNlbGVjdGlvblR5cGUgPT09IFNFTEVDVElPTl9UWVBFLlBPTFlHT04pIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RQb2x5Z29uT2JqZWN0cyhjb29yZGluYXRlcyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIC4uLmluaGVyaXRlZFByb3BzXG4gICAgICAgIH0pXG4gICAgICApXG4gICAgXTtcblxuICAgIGlmIChwZW5kaW5nUG9seWdvblNlbGVjdGlvbikge1xuICAgICAgY29uc3QgeyBiaWdQb2x5Z29uIH0gPSBwZW5kaW5nUG9seWdvblNlbGVjdGlvbjtcbiAgICAgIGxheWVycy5wdXNoKFxuICAgICAgICBuZXcgUG9seWdvbkxheWVyKFxuICAgICAgICAgIHRoaXMuZ2V0U3ViTGF5ZXJQcm9wcyh7XG4gICAgICAgICAgICBpZDogTEFZRVJfSURfQkxPQ0tFUixcbiAgICAgICAgICAgIHBpY2thYmxlOiB0cnVlLFxuICAgICAgICAgICAgc3Ryb2tlZDogZmFsc2UsXG4gICAgICAgICAgICBvcGFjaXR5OiAxLjAsXG4gICAgICAgICAgICBkYXRhOiBbYmlnUG9seWdvbl0sXG4gICAgICAgICAgICBnZXRMaW5lQ29sb3I6IG9iaiA9PiBbMCwgMCwgMCwgMV0sXG4gICAgICAgICAgICBnZXRGaWxsQ29sb3I6IG9iaiA9PiBbMCwgMCwgMCwgMV0sXG4gICAgICAgICAgICBnZXRQb2x5Z29uOiBvID0+IG8uZ2VvbWV0cnkuY29vcmRpbmF0ZXNcbiAgICAgICAgICB9KVxuICAgICAgICApXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiBsYXllcnM7XG4gIH1cblxuICBzaG91bGRVcGRhdGVTdGF0ZSh7IGNoYW5nZUZsYWdzOiB7IHN0YXRlQ2hhbmdlZCwgcHJvcHNPckRhdGFDaGFuZ2VkIH0gfTogT2JqZWN0KSB7XG4gICAgcmV0dXJuIHN0YXRlQ2hhbmdlZCB8fCBwcm9wc09yRGF0YUNoYW5nZWQ7XG4gIH1cbn1cblxuU2VsZWN0aW9uTGF5ZXIubGF5ZXJOYW1lID0gJ1NlbGVjdGlvbkxheWVyJztcblNlbGVjdGlvbkxheWVyLmRlZmF1bHRQcm9wcyA9IGRlZmF1bHRQcm9wcztcbiJdfQ==