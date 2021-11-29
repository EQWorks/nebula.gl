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

class SelectionLayer extends _keplerOutdatedDeck.CompositeLayer {
  _selectRectangleObjects(coordinates) {
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

  _selectPolygonObjects(coordinates) {
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

  renderLayers() {
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

  shouldUpdateState(_ref2) {
    var _ref2$changeFlags = _ref2.changeFlags,
        stateChanged = _ref2$changeFlags.stateChanged,
        propsOrDataChanged = _ref2$changeFlags.propsOrDataChanged;
    return stateChanged || propsOrDataChanged;
  }

}

exports.default = SelectionLayer;
SelectionLayer.layerName = 'SelectionLayer';
SelectionLayer.defaultProps = defaultProps;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sYXllcnMvc2VsZWN0aW9uLWxheWVyLmpzIl0sIm5hbWVzIjpbIlNFTEVDVElPTl9UWVBFIiwiTk9ORSIsIlJFQ1RBTkdMRSIsIlBPTFlHT04iLCJkZWZhdWx0UHJvcHMiLCJzZWxlY3Rpb25UeXBlIiwibGF5ZXJJZHMiLCJvblNlbGVjdCIsIkVNUFRZX0RBVEEiLCJ0eXBlIiwiZmVhdHVyZXMiLCJFWFBBTlNJT05fS00iLCJMQVlFUl9JRF9HRU9KU09OIiwiTEFZRVJfSURfQkxPQ0tFUiIsIlBBU1NfVEhST1VHSF9QUk9QUyIsIlNlbGVjdGlvbkxheWVyIiwiQ29tcG9zaXRlTGF5ZXIiLCJfc2VsZWN0UmVjdGFuZ2xlT2JqZWN0cyIsImNvb3JkaW5hdGVzIiwicHJvcHMiLCJjb250ZXh0Iiwidmlld3BvcnQiLCJwcm9qZWN0IiwieDEiLCJ5MSIsIngyIiwieTIiLCJwaWNraW5nSW5mb3MiLCJkZWNrIiwicGlja09iamVjdHMiLCJ4IiwiTWF0aCIsIm1pbiIsInkiLCJ3aWR0aCIsImFicyIsImhlaWdodCIsIl9zZWxlY3RQb2x5Z29uT2JqZWN0cyIsIm1vdXNlUG9pbnRzIiwibWFwIiwiYyIsImFsbFgiLCJtb3VzZVBvaW50IiwiYWxsWSIsIm1heFgiLCJtYXgiLCJtYXhZIiwibGFuZFBvaW50c1BvbHkiLCJiaWdCdWZmZXIiLCJiaWdQb2x5Z29uIiwiZSIsImNvbnNvbGUiLCJsb2ciLCJzZXRTdGF0ZSIsInBlbmRpbmdQb2x5Z29uU2VsZWN0aW9uIiwiYmxvY2tlcklkIiwiaWQiLCJzZXRUaW1lb3V0IiwiZmlsdGVyIiwiaXRlbSIsImxheWVyIiwicmVuZGVyTGF5ZXJzIiwic3RhdGUiLCJtb2RlIiwiaW5oZXJpdGVkUHJvcHMiLCJmb3JFYWNoIiwicCIsInVuZGVmaW5lZCIsImxheWVycyIsIkVkaXRhYmxlR2VvSnNvbkxheWVyIiwiZ2V0U3ViTGF5ZXJQcm9wcyIsInBpY2thYmxlIiwic2VsZWN0ZWRGZWF0dXJlSW5kZXhlcyIsImRhdGEiLCJvbkVkaXQiLCJ1cGRhdGVkRGF0YSIsImVkaXRUeXBlIiwiZ2VvbWV0cnkiLCJwdXNoIiwiUG9seWdvbkxheWVyIiwic3Ryb2tlZCIsIm9wYWNpdHkiLCJnZXRMaW5lQ29sb3IiLCJvYmoiLCJnZXRGaWxsQ29sb3IiLCJnZXRQb2x5Z29uIiwibyIsInNob3VsZFVwZGF0ZVN0YXRlIiwiY2hhbmdlRmxhZ3MiLCJzdGF0ZUNoYW5nZWQiLCJwcm9wc09yRGF0YUNoYW5nZWQiLCJsYXllck5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRU8sSUFBTUEsY0FBYyxHQUFHO0FBQzVCQyxFQUFBQSxJQUFJLEVBQUUsSUFEc0I7QUFFNUJDLEVBQUFBLFNBQVMsRUFBRSxXQUZpQjtBQUc1QkMsRUFBQUEsT0FBTyxFQUFFO0FBSG1CLENBQXZCOztBQU1QLElBQU1DLFlBQVksR0FBRztBQUNuQkMsRUFBQUEsYUFBYSxFQUFFTCxjQUFjLENBQUNFLFNBRFg7QUFFbkJJLEVBQUFBLFFBQVEsRUFBRSxFQUZTO0FBR25CQyxFQUFBQSxRQUFRLEVBQUUsb0JBQU0sQ0FBRTtBQUhDLENBQXJCO0FBTUEsSUFBTUMsVUFBVSxHQUFHO0FBQ2pCQyxFQUFBQSxJQUFJLEVBQUUsbUJBRFc7QUFFakJDLEVBQUFBLFFBQVEsRUFBRTtBQUZPLENBQW5CO0FBS0EsSUFBTUMsWUFBWSxHQUFHLEVBQXJCO0FBQ0EsSUFBTUMsZ0JBQWdCLEdBQUcsbUJBQXpCO0FBQ0EsSUFBTUMsZ0JBQWdCLEdBQUcsbUJBQXpCO0FBRUEsSUFBTUMsa0JBQWtCLEdBQUcsQ0FDekIsZ0JBRHlCLEVBRXpCLG9CQUZ5QixFQUd6QixvQkFIeUIsRUFJekIsZ0JBSnlCLEVBS3pCLGtCQUx5QixFQU16QixnQkFOeUIsRUFPekIsa0JBUHlCLEVBUXpCLHNCQVJ5QixFQVN6QixzQkFUeUIsRUFVekIsbUJBVnlCLEVBV3pCLGNBWHlCLEVBWXpCLGNBWnlC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QUFpQixRQUFnRTtBQUFBLGtDQUE3REMsV0FBNkQ7QUFBQSxRQUE5Q0MsWUFBOEMscUJBQTlDQSxZQUE4QztBQUFBLFFBQWhDQyxrQkFBZ0MscUJBQWhDQSxrQkFBZ0M7QUFDL0UsV0FBT0QsWUFBWSxJQUFJQyxrQkFBdkI7QUFDRDs7QUFqSXdEOzs7QUFvSTNEM0UsY0FBYyxDQUFDNEUsU0FBZixHQUEyQixnQkFBM0I7QUFDQTVFLGNBQWMsQ0FBQ1gsWUFBZixHQUE4QkEsWUFBOUIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuLyogZXNsaW50LWVudiBicm93c2VyICovXG5pbXBvcnQgeyBDb21wb3NpdGVMYXllciB9IGZyb20gJ2tlcGxlci1vdXRkYXRlZC1kZWNrLmdsLWNvcmUnO1xuaW1wb3J0IHsgUG9seWdvbkxheWVyIH0gZnJvbSAna2VwbGVyLW91dGRhdGVkLWRlY2suZ2wtbGF5ZXJzJztcbmltcG9ydCB7IHBvbHlnb24gfSBmcm9tICdAdHVyZi9oZWxwZXJzJztcbmltcG9ydCB0dXJmQnVmZmVyIGZyb20gJ0B0dXJmL2J1ZmZlcic7XG5pbXBvcnQgdHVyZkRpZmZlcmVuY2UgZnJvbSAnQHR1cmYvZGlmZmVyZW5jZSc7XG5cbmltcG9ydCBFZGl0YWJsZUdlb0pzb25MYXllciBmcm9tICcuL2VkaXRhYmxlLWdlb2pzb24tbGF5ZXInO1xuXG5leHBvcnQgY29uc3QgU0VMRUNUSU9OX1RZUEUgPSB7XG4gIE5PTkU6IG51bGwsXG4gIFJFQ1RBTkdMRTogJ3JlY3RhbmdsZScsXG4gIFBPTFlHT046ICdwb2x5Z29uJ1xufTtcblxuY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICBzZWxlY3Rpb25UeXBlOiBTRUxFQ1RJT05fVFlQRS5SRUNUQU5HTEUsXG4gIGxheWVySWRzOiBbXSxcbiAgb25TZWxlY3Q6ICgpID0+IHt9XG59O1xuXG5jb25zdCBFTVBUWV9EQVRBID0ge1xuICB0eXBlOiAnRmVhdHVyZUNvbGxlY3Rpb24nLFxuICBmZWF0dXJlczogW11cbn07XG5cbmNvbnN0IEVYUEFOU0lPTl9LTSA9IDUwO1xuY29uc3QgTEFZRVJfSURfR0VPSlNPTiA9ICdzZWxlY3Rpb24tZ2VvanNvbic7XG5jb25zdCBMQVlFUl9JRF9CTE9DS0VSID0gJ3NlbGVjdGlvbi1ibG9ja2VyJztcblxuY29uc3QgUEFTU19USFJPVUdIX1BST1BTID0gW1xuICAnbGluZVdpZHRoU2NhbGUnLFxuICAnbGluZVdpZHRoTWluUGl4ZWxzJyxcbiAgJ2xpbmVXaWR0aE1heFBpeGVscycsXG4gICdsaW5lV2lkdGhVbml0cycsXG4gICdsaW5lSm9pbnRSb3VuZGVkJyxcbiAgJ2xpbmVNaXRlckxpbWl0JyxcbiAgJ3BvaW50UmFkaXVzU2NhbGUnLFxuICAncG9pbnRSYWRpdXNNaW5QaXhlbHMnLFxuICAncG9pbnRSYWRpdXNNYXhQaXhlbHMnLFxuICAnbGluZURhc2hKdXN0aWZpZWQnLFxuICAnZ2V0TGluZUNvbG9yJyxcbiAgJ2dldEZpbGxDb2xvcicsXG4gICdnZXRSYWRpdXMnLFxuICAnZ2V0TGluZVdpZHRoJyxcbiAgJ2dldExpbmVEYXNoQXJyYXknLFxuICAnZ2V0VGVudGF0aXZlTGluZURhc2hBcnJheScsXG4gICdnZXRUZW50YXRpdmVMaW5lQ29sb3InLFxuICAnZ2V0VGVudGF0aXZlRmlsbENvbG9yJyxcbiAgJ2dldFRlbnRhdGl2ZUxpbmVXaWR0aCdcbl07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlbGVjdGlvbkxheWVyIGV4dGVuZHMgQ29tcG9zaXRlTGF5ZXIge1xuICBfc2VsZWN0UmVjdGFuZ2xlT2JqZWN0cyhjb29yZGluYXRlczogYW55KSB7XG4gICAgY29uc3QgeyBsYXllcklkcywgb25TZWxlY3QgfSA9IHRoaXMucHJvcHM7XG5cbiAgICBjb25zdCBbeDEsIHkxXSA9IHRoaXMuY29udGV4dC52aWV3cG9ydC5wcm9qZWN0KGNvb3JkaW5hdGVzWzBdWzBdKTtcbiAgICBjb25zdCBbeDIsIHkyXSA9IHRoaXMuY29udGV4dC52aWV3cG9ydC5wcm9qZWN0KGNvb3JkaW5hdGVzWzBdWzJdKTtcblxuICAgIGNvbnN0IHBpY2tpbmdJbmZvcyA9IHRoaXMuY29udGV4dC5kZWNrLnBpY2tPYmplY3RzKHtcbiAgICAgIHg6IE1hdGgubWluKHgxLCB4MiksXG4gICAgICB5OiBNYXRoLm1pbih5MSwgeTIpLFxuICAgICAgd2lkdGg6IE1hdGguYWJzKHgyIC0geDEpLFxuICAgICAgaGVpZ2h0OiBNYXRoLmFicyh5MiAtIHkxKSxcbiAgICAgIGxheWVySWRzXG4gICAgfSk7XG5cbiAgICBvblNlbGVjdCh7IHBpY2tpbmdJbmZvcyB9KTtcbiAgfVxuXG4gIF9zZWxlY3RQb2x5Z29uT2JqZWN0cyhjb29yZGluYXRlczogYW55KSB7XG4gICAgY29uc3QgeyBsYXllcklkcywgb25TZWxlY3QgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgbW91c2VQb2ludHMgPSBjb29yZGluYXRlc1swXS5tYXAoYyA9PiB0aGlzLmNvbnRleHQudmlld3BvcnQucHJvamVjdChjKSk7XG5cbiAgICBjb25zdCBhbGxYID0gbW91c2VQb2ludHMubWFwKG1vdXNlUG9pbnQgPT4gbW91c2VQb2ludFswXSk7XG4gICAgY29uc3QgYWxsWSA9IG1vdXNlUG9pbnRzLm1hcChtb3VzZVBvaW50ID0+IG1vdXNlUG9pbnRbMV0pO1xuICAgIGNvbnN0IHggPSBNYXRoLm1pbiguLi5hbGxYKTtcbiAgICBjb25zdCB5ID0gTWF0aC5taW4oLi4uYWxsWSk7XG4gICAgY29uc3QgbWF4WCA9IE1hdGgubWF4KC4uLmFsbFgpO1xuICAgIGNvbnN0IG1heFkgPSBNYXRoLm1heCguLi5hbGxZKTtcblxuICAgIC8vIFVzZSBhIHBvbHlnb24gdG8gaGlkZSB0aGUgb3V0c2lkZSwgYmVjYXVzZSBwaWNrT2JqZWN0cygpXG4gICAgLy8gZG9lcyBub3Qgc3VwcG9ydCBwb2x5Z29uc1xuICAgIGNvbnN0IGxhbmRQb2ludHNQb2x5ID0gcG9seWdvbihjb29yZGluYXRlcyk7XG4gICAgY29uc3QgYmlnQnVmZmVyID0gdHVyZkJ1ZmZlcihsYW5kUG9pbnRzUG9seSwgRVhQQU5TSU9OX0tNKTtcbiAgICBsZXQgYmlnUG9seWdvbjtcbiAgICB0cnkge1xuICAgICAgLy8gdHVyZkRpZmZlcmVuY2UgdGhyb3dzIGFuIGV4Y2VwdGlvbiBpZiB0aGUgcG9seWdvblxuICAgICAgLy8gaW50ZXJzZWN0cyB3aXRoIGl0c2VsZiAoVE9ETzogY2hlY2sgaWYgdHJ1ZSBpbiBhbGwgdmVyc2lvbnMpXG4gICAgICBiaWdQb2x5Z29uID0gdHVyZkRpZmZlcmVuY2UoYmlnQnVmZmVyLCBsYW5kUG9pbnRzUG9seSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy8gaW52YWxpZCBzZWxlY3Rpb24gcG9seWdvblxuICAgICAgY29uc29sZS5sb2coJ3R1cmZEaWZmZXJlbmNlKCkgZXJyb3InLCBlKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcGVuZGluZ1BvbHlnb25TZWxlY3Rpb246IHtcbiAgICAgICAgYmlnUG9seWdvblxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgYmxvY2tlcklkID0gYCR7dGhpcy5wcm9wcy5pZH0tJHtMQVlFUl9JRF9CTE9DS0VSfWA7XG5cbiAgICAvLyBIQUNLLCBmaW5kIGEgYmV0dGVyIHdheVxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgY29uc3QgcGlja2luZ0luZm9zID0gdGhpcy5jb250ZXh0LmRlY2sucGlja09iamVjdHMoe1xuICAgICAgICB4LFxuICAgICAgICB5LFxuICAgICAgICB3aWR0aDogbWF4WCAtIHgsXG4gICAgICAgIGhlaWdodDogbWF4WSAtIHksXG4gICAgICAgIGxheWVySWRzOiBbYmxvY2tlcklkLCAuLi5sYXllcklkc11cbiAgICAgIH0pO1xuXG4gICAgICBvblNlbGVjdCh7XG4gICAgICAgIHBpY2tpbmdJbmZvczogcGlja2luZ0luZm9zLmZpbHRlcihpdGVtID0+IGl0ZW0ubGF5ZXIuaWQgIT09IHRoaXMucHJvcHMuaWQpXG4gICAgICB9KTtcbiAgICB9LCAyNTApO1xuICB9XG5cbiAgcmVuZGVyTGF5ZXJzKCkge1xuICAgIGNvbnN0IHsgcGVuZGluZ1BvbHlnb25TZWxlY3Rpb24gfSA9IHRoaXMuc3RhdGU7XG5cbiAgICBjb25zdCBtb2RlID1cbiAgICAgIHtcbiAgICAgICAgW1NFTEVDVElPTl9UWVBFLlJFQ1RBTkdMRV06ICdkcmF3UmVjdGFuZ2xlJyxcbiAgICAgICAgW1NFTEVDVElPTl9UWVBFLlBPTFlHT05dOiAnZHJhd1BvbHlnb24nXG4gICAgICB9W3RoaXMucHJvcHMuc2VsZWN0aW9uVHlwZV0gfHwgJ3ZpZXcnO1xuXG4gICAgY29uc3QgaW5oZXJpdGVkUHJvcHMgPSB7fTtcbiAgICBQQVNTX1RIUk9VR0hfUFJPUFMuZm9yRWFjaChwID0+IHtcbiAgICAgIGlmICh0aGlzLnByb3BzW3BdICE9PSB1bmRlZmluZWQpIGluaGVyaXRlZFByb3BzW3BdID0gdGhpcy5wcm9wc1twXTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGxheWVycyA9IFtcbiAgICAgIG5ldyBFZGl0YWJsZUdlb0pzb25MYXllcihcbiAgICAgICAgdGhpcy5nZXRTdWJMYXllclByb3BzKHtcbiAgICAgICAgICBpZDogTEFZRVJfSURfR0VPSlNPTixcbiAgICAgICAgICBwaWNrYWJsZTogdHJ1ZSxcbiAgICAgICAgICBtb2RlLFxuICAgICAgICAgIHNlbGVjdGVkRmVhdHVyZUluZGV4ZXM6IFtdLFxuICAgICAgICAgIGRhdGE6IEVNUFRZX0RBVEEsXG4gICAgICAgICAgb25FZGl0OiAoeyB1cGRhdGVkRGF0YSwgZWRpdFR5cGUgfSkgPT4ge1xuICAgICAgICAgICAgaWYgKGVkaXRUeXBlID09PSAnYWRkRmVhdHVyZScpIHtcbiAgICAgICAgICAgICAgY29uc3QgeyBjb29yZGluYXRlcyB9ID0gdXBkYXRlZERhdGEuZmVhdHVyZXNbMF0uZ2VvbWV0cnk7XG5cbiAgICAgICAgICAgICAgaWYgKHRoaXMucHJvcHMuc2VsZWN0aW9uVHlwZSA9PT0gU0VMRUNUSU9OX1RZUEUuUkVDVEFOR0xFKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0UmVjdGFuZ2xlT2JqZWN0cyhjb29yZGluYXRlcyk7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5wcm9wcy5zZWxlY3Rpb25UeXBlID09PSBTRUxFQ1RJT05fVFlQRS5QT0xZR09OKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0UG9seWdvbk9iamVjdHMoY29vcmRpbmF0ZXMpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICAuLi5pbmhlcml0ZWRQcm9wc1xuICAgICAgICB9KVxuICAgICAgKVxuICAgIF07XG5cbiAgICBpZiAocGVuZGluZ1BvbHlnb25TZWxlY3Rpb24pIHtcbiAgICAgIGNvbnN0IHsgYmlnUG9seWdvbiB9ID0gcGVuZGluZ1BvbHlnb25TZWxlY3Rpb247XG4gICAgICBsYXllcnMucHVzaChcbiAgICAgICAgbmV3IFBvbHlnb25MYXllcihcbiAgICAgICAgICB0aGlzLmdldFN1YkxheWVyUHJvcHMoe1xuICAgICAgICAgICAgaWQ6IExBWUVSX0lEX0JMT0NLRVIsXG4gICAgICAgICAgICBwaWNrYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIHN0cm9rZWQ6IGZhbHNlLFxuICAgICAgICAgICAgb3BhY2l0eTogMS4wLFxuICAgICAgICAgICAgZGF0YTogW2JpZ1BvbHlnb25dLFxuICAgICAgICAgICAgZ2V0TGluZUNvbG9yOiBvYmogPT4gWzAsIDAsIDAsIDFdLFxuICAgICAgICAgICAgZ2V0RmlsbENvbG9yOiBvYmogPT4gWzAsIDAsIDAsIDFdLFxuICAgICAgICAgICAgZ2V0UG9seWdvbjogbyA9PiBvLmdlb21ldHJ5LmNvb3JkaW5hdGVzXG4gICAgICAgICAgfSlcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbGF5ZXJzO1xuICB9XG5cbiAgc2hvdWxkVXBkYXRlU3RhdGUoeyBjaGFuZ2VGbGFnczogeyBzdGF0ZUNoYW5nZWQsIHByb3BzT3JEYXRhQ2hhbmdlZCB9IH06IE9iamVjdCkge1xuICAgIHJldHVybiBzdGF0ZUNoYW5nZWQgfHwgcHJvcHNPckRhdGFDaGFuZ2VkO1xuICB9XG59XG5cblNlbGVjdGlvbkxheWVyLmxheWVyTmFtZSA9ICdTZWxlY3Rpb25MYXllcic7XG5TZWxlY3Rpb25MYXllci5kZWZhdWx0UHJvcHMgPSBkZWZhdWx0UHJvcHM7XG4iXX0=