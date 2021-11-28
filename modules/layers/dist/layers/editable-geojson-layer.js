"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _keplerOudatedDeck = require("kepler-oudated-deck.gl-layers");

var _modeHandler = require("../mode-handlers/mode-handler.js");

var _viewHandler = require("../mode-handlers/view-handler.js");

var _modifyHandler = require("../mode-handlers/modify-handler.js");

var _elevationHandler = require("../mode-handlers/elevation-handler.js");

var _snappableHandler = require("../mode-handlers/snappable-handler.js");

var _translateHandler = require("../mode-handlers/translate-handler.js");

var _duplicateHandler = require("../mode-handlers/duplicate-handler");

var _rotateHandler = require("../mode-handlers/rotate-handler.js");

var _scaleHandler = require("../mode-handlers/scale-handler.js");

var _drawPointHandler = require("../mode-handlers/draw-point-handler.js");

var _drawLineStringHandler = require("../mode-handlers/draw-line-string-handler.js");

var _drawPolygonHandler = require("../mode-handlers/draw-polygon-handler.js");

var _draw90degreePolygonHandler = require("../mode-handlers/draw-90degree-polygon-handler.js");

var _drawRectangleHandler = require("../mode-handlers/draw-rectangle-handler.js");

var _splitPolygonHandler = require("../mode-handlers/split-polygon-handler.js");

var _drawRectangleUsingThreePointsHandler = require("../mode-handlers/draw-rectangle-using-three-points-handler.js");

var _drawCircleFromCenterHandler = require("../mode-handlers/draw-circle-from-center-handler.js");

var _drawCircleByBoundingBoxHandler = require("../mode-handlers/draw-circle-by-bounding-box-handler.js");

var _drawEllipseByBoundingBoxHandler = require("../mode-handlers/draw-ellipse-by-bounding-box-handler.js");

var _drawEllipseUsingThreePointsHandler = require("../mode-handlers/draw-ellipse-using-three-points-handler.js");

var _extrudeHandler = require("../mode-handlers/extrude-handler.js");

var _editableLayer = _interopRequireDefault(require("./editable-layer.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var DEFAULT_LINE_COLOR = [0x0, 0x0, 0x0, 0xff];
var DEFAULT_FILL_COLOR = [0x0, 0x0, 0x0, 0x90];
var DEFAULT_SELECTED_LINE_COLOR = [0x90, 0x90, 0x90, 0xff];
var DEFAULT_SELECTED_FILL_COLOR = [0x90, 0x90, 0x90, 0x90];
var DEFAULT_EDITING_EXISTING_POINT_COLOR = [0xc0, 0x0, 0x0, 0xff];
var DEFAULT_EDITING_INTERMEDIATE_POINT_COLOR = [0x0, 0x0, 0x0, 0x80];
var DEFAULT_EDITING_SNAP_POINT_COLOR = [0x7c, 0x00, 0xc0, 0xff];
var DEFAULT_EDITING_EXISTING_POINT_RADIUS = 5;
var DEFAULT_EDITING_INTERMEDIATE_POINT_RADIUS = 3;
var DEFAULT_EDITING_SNAP_POINT_RADIUS = 7;

function getEditHandleColor(handle) {
  switch (handle.type) {
    case 'existing':
      return DEFAULT_EDITING_EXISTING_POINT_COLOR;

    case 'snap':
      return DEFAULT_EDITING_SNAP_POINT_COLOR;

    case 'intermediate':
    default:
      return DEFAULT_EDITING_INTERMEDIATE_POINT_COLOR;
  }
}

function getEditHandleRadius(handle) {
  switch (handle.type) {
    case 'existing':
      return DEFAULT_EDITING_EXISTING_POINT_RADIUS;

    case 'snap':
      return DEFAULT_EDITING_SNAP_POINT_RADIUS;

    case 'intermediate':
    default:
      return DEFAULT_EDITING_INTERMEDIATE_POINT_RADIUS;
  }
}

var defaultProps = {
  mode: 'modify',
  // Edit and interaction events
  onEdit: function onEdit() {},
  pickable: true,
  pickingRadius: 10,
  pickingDepth: 5,
  fp64: false,
  filled: true,
  stroked: true,
  lineWidthScale: 1,
  lineWidthMinPixels: 1,
  lineWidthMaxPixels: Number.MAX_SAFE_INTEGER,
  lineWidthUnits: 'meters',
  lineJointRounded: false,
  lineMiterLimit: 4,
  pointRadiusScale: 1,
  pointRadiusMinPixels: 2,
  pointRadiusMaxPixels: Number.MAX_SAFE_INTEGER,
  lineDashJustified: false,
  getLineColor: function getLineColor(feature, isSelected, mode) {
    return isSelected ? DEFAULT_SELECTED_LINE_COLOR : DEFAULT_LINE_COLOR;
  },
  getFillColor: function getFillColor(feature, isSelected, mode) {
    return isSelected ? DEFAULT_SELECTED_FILL_COLOR : DEFAULT_FILL_COLOR;
  },
  getRadius: function getRadius(f) {
    return f && f.properties && f.properties.radius || f && f.properties && f.properties.size || 1;
  },
  getLineWidth: function getLineWidth(f) {
    return f && f.properties && f.properties.lineWidth || 1;
  },
  getLineDashArray: function getLineDashArray(feature, isSelected, mode) {
    return isSelected && mode !== 'view' ? [7, 4] : [0, 0];
  },
  // Tentative feature rendering
  getTentativeLineDashArray: function getTentativeLineDashArray(f, mode) {
    return [7, 4];
  },
  getTentativeLineColor: function getTentativeLineColor(f, mode) {
    return DEFAULT_SELECTED_LINE_COLOR;
  },
  getTentativeFillColor: function getTentativeFillColor(f, mode) {
    return DEFAULT_SELECTED_FILL_COLOR;
  },
  getTentativeLineWidth: function getTentativeLineWidth(f, mode) {
    return f && f.properties && f.properties.lineWidth || 1;
  },
  editHandleType: 'point',
  editHandleParameters: {},
  editHandleLayerProps: {},
  // point handles
  editHandlePointRadiusScale: 1,
  editHandlePointOutline: false,
  editHandlePointStrokeWidth: 1,
  editHandlePointRadiusMinPixels: 4,
  editHandlePointRadiusMaxPixels: 8,
  getEditHandlePointColor: getEditHandleColor,
  getEditHandlePointRadius: getEditHandleRadius,
  // icon handles
  editHandleIconAtlas: null,
  editHandleIconMapping: null,
  editHandleIconSizeScale: 1,
  getEditHandleIcon: function getEditHandleIcon(handle) {
    return handle.type;
  },
  getEditHandleIconSize: 10,
  getEditHandleIconColor: getEditHandleColor,
  getEditHandleIconAngle: 0,
  // misc
  billboard: true,
  // Mode handlers
  modeHandlers: {
    view: new _viewHandler.ViewHandler(),
    modify: new _modifyHandler.ModifyHandler(),
    elevation: new _elevationHandler.ElevationHandler(),
    extrude: new _extrudeHandler.ExtrudeHandler(),
    rotate: new _rotateHandler.RotateHandler(),
    translate: new _snappableHandler.SnappableHandler(new _translateHandler.TranslateHandler()),
    duplicate: new _duplicateHandler.DuplicateHandler(),
    scale: new _scaleHandler.ScaleHandler(),
    drawPoint: new _drawPointHandler.DrawPointHandler(),
    drawLineString: new _drawLineStringHandler.DrawLineStringHandler(),
    drawPolygon: new _drawPolygonHandler.DrawPolygonHandler(),
    draw90DegreePolygon: new _draw90degreePolygonHandler.Draw90DegreePolygonHandler(),
    split: new _splitPolygonHandler.SplitPolygonHandler(),
    drawRectangle: new _drawRectangleHandler.DrawRectangleHandler(),
    drawRectangleUsing3Points: new _drawRectangleUsingThreePointsHandler.DrawRectangleUsingThreePointsHandler(),
    drawCircleFromCenter: new _drawCircleFromCenterHandler.DrawCircleFromCenterHandler(),
    drawCircleByBoundingBox: new _drawCircleByBoundingBoxHandler.DrawCircleByBoundingBoxHandler(),
    drawEllipseByBoundingBox: new _drawEllipseByBoundingBoxHandler.DrawEllipseByBoundingBoxHandler(),
    drawEllipseUsing3Points: new _drawEllipseUsingThreePointsHandler.DrawEllipseUsingThreePointsHandler()
  }
};

// type State = {
//   modeHandler: EditableFeatureCollection,
//   tentativeFeature: ?Feature,
//   editHandles: any[],
//   selectedFeatures: Feature[]
// };
var EditableGeoJsonLayer =
/*#__PURE__*/
function (_EditableLayer) {
  _inherits(EditableGeoJsonLayer, _EditableLayer);

  function EditableGeoJsonLayer() {
    _classCallCheck(this, EditableGeoJsonLayer);

    return _possibleConstructorReturn(this, _getPrototypeOf(EditableGeoJsonLayer).apply(this, arguments));
  }

  _createClass(EditableGeoJsonLayer, [{
    key: "renderLayers",
    // state: State;
    // props: Props;
    // setState: ($Shape<State>) => void;
    value: function renderLayers() {
      var subLayerProps = this.getSubLayerProps({
        id: 'geojson',
        // Proxy most GeoJsonLayer props as-is
        data: this.props.data,
        fp64: this.props.fp64,
        filled: this.props.filled,
        stroked: this.props.stroked,
        lineWidthScale: this.props.lineWidthScale,
        lineWidthMinPixels: this.props.lineWidthMinPixels,
        lineWidthMaxPixels: this.props.lineWidthMaxPixels,
        lineWidthUnits: this.props.lineWidthUnits,
        lineJointRounded: this.props.lineJointRounded,
        lineMiterLimit: this.props.lineMiterLimit,
        pointRadiusScale: this.props.pointRadiusScale,
        pointRadiusMinPixels: this.props.pointRadiusMinPixels,
        pointRadiusMaxPixels: this.props.pointRadiusMaxPixels,
        lineDashJustified: this.props.lineDashJustified,
        getLineColor: this.selectionAwareAccessor(this.props.getLineColor),
        getFillColor: this.selectionAwareAccessor(this.props.getFillColor),
        getRadius: this.selectionAwareAccessor(this.props.getRadius),
        getLineWidth: this.selectionAwareAccessor(this.props.getLineWidth),
        getLineDashArray: this.selectionAwareAccessor(this.props.getLineDashArray),
        _subLayerProps: {
          'line-strings': {
            billboard: this.props.billboard
          },
          'polygons-stroke': {
            billboard: this.props.billboard
          }
        },
        updateTriggers: {
          getLineColor: [this.props.selectedFeatureIndexes, this.props.mode],
          getFillColor: [this.props.selectedFeatureIndexes, this.props.mode],
          getRadius: [this.props.selectedFeatureIndexes, this.props.mode],
          getLineWidth: [this.props.selectedFeatureIndexes, this.props.mode],
          getLineDashArray: [this.props.selectedFeatureIndexes, this.props.mode]
        }
      });
      var layers = [new _keplerOudatedDeck.GeoJsonLayer(subLayerProps)];
      layers = layers.concat(this.createTentativeLayers());
      layers = layers.concat(this.createEditHandleLayers());
      return layers;
    }
  }, {
    key: "initializeState",
    value: function initializeState() {
      _get(_getPrototypeOf(EditableGeoJsonLayer.prototype), "initializeState", this).call(this);

      this.setState({
        selectedFeatures: [],
        editHandles: []
      });
    } // TODO: figure out how to properly update state from an outside event handler

  }, {
    key: "shouldUpdateState",
    value: function shouldUpdateState(_ref) {
      var props = _ref.props,
          oldProps = _ref.oldProps,
          context = _ref.context,
          oldContext = _ref.oldContext,
          changeFlags = _ref.changeFlags;

      if (changeFlags.stateChanged) {
        return true;
      }

      return true;
    }
  }, {
    key: "updateState",
    value: function updateState(_ref2) {
      var props = _ref2.props,
          oldProps = _ref2.oldProps,
          changeFlags = _ref2.changeFlags;

      _get(_getPrototypeOf(EditableGeoJsonLayer.prototype), "updateState", this).call(this, {
        props: props,
        changeFlags: changeFlags
      });

      var modeHandler = this.state.modeHandler;

      if (changeFlags.propsOrDataChanged) {
        if (props.modeHandlers !== oldProps.modeHandlers || props.mode !== oldProps.mode) {
          modeHandler = props.modeHandlers[props.mode];

          if (!modeHandler) {
            console.warn("No handler configured for mode ".concat(props.mode)); // eslint-disable-line no-console,no-undef
            // Use default mode handler

            modeHandler = new _modeHandler.ModeHandler();
          }

          if (modeHandler !== this.state.modeHandler) {
            this.setState({
              modeHandler: modeHandler
            });
          }

          modeHandler.setFeatureCollection(props.data);
        } else if (changeFlags.dataChanged) {
          modeHandler.setFeatureCollection(props.data);
        }

        modeHandler.setModeConfig(props.modeConfig);
        modeHandler.setSelectedFeatureIndexes(props.selectedFeatureIndexes);
        this.updateTentativeFeature();
        this.updateEditHandles();
      }

      var selectedFeatures = [];

      if (Array.isArray(props.selectedFeatureIndexes)) {
        // TODO: needs improved testing, i.e. checking for duplicates, NaNs, out of range numbers, ...
        selectedFeatures = props.selectedFeatureIndexes.map(function (elem) {
          return props.data.features[elem];
        });
      }

      this.setState({
        selectedFeatures: selectedFeatures
      });
    }
  }, {
    key: "selectionAwareAccessor",
    value: function selectionAwareAccessor(accessor) {
      var _this = this;

      if (typeof accessor !== 'function') {
        return accessor;
      }

      return function (feature) {
        return accessor(feature, _this.isFeatureSelected(feature), _this.props.mode);
      };
    }
  }, {
    key: "isFeatureSelected",
    value: function isFeatureSelected(feature) {
      if (!this.props.data || !this.props.selectedFeatureIndexes) {
        return false;
      }

      if (!this.props.selectedFeatureIndexes.length) {
        return false;
      }

      var featureIndex = this.props.data.features.indexOf(feature);
      return this.props.selectedFeatureIndexes.includes(featureIndex);
    }
  }, {
    key: "getPickingInfo",
    value: function getPickingInfo(_ref3) {
      var info = _ref3.info,
          sourceLayer = _ref3.sourceLayer;

      if (sourceLayer.id.endsWith('editHandles')) {
        // If user is picking an editing handle, add additional data to the info
        info.isEditingHandle = true;
      }

      return info;
    }
  }, {
    key: "createEditHandleLayers",
    value: function createEditHandleLayers() {
      if (!this.state.editHandles.length) {
        return [];
      }

      var sharedProps = _objectSpread({
        id: 'editHandles',
        data: this.state.editHandles,
        fp64: this.props.fp64,
        parameters: this.props.editHandleParameters
      }, this.props.editHandleLayerProps);

      var layer;

      switch (this.props.editHandleType) {
        case 'icon':
          var EditHandleIconLayer = this.getSubLayerClass('editHandles', _keplerOudatedDeck.IconLayer);
          layer = new EditHandleIconLayer(this.getSubLayerProps(_objectSpread({}, sharedProps, {
            iconAtlas: this.props.editHandleIconAtlas,
            iconMapping: this.props.editHandleIconMapping,
            sizeScale: this.props.editHandleIconSizeScale,
            getIcon: this.props.getEditHandleIcon,
            getSize: this.props.getEditHandleIconSize,
            getColor: this.props.getEditHandleIconColor,
            getAngle: this.props.getEditHandleIconAngle,
            getPosition: function getPosition(d) {
              return d.position;
            }
          })));
          break;

        case 'point':
        default:
          var EditHandlePointLayer = this.getSubLayerClass('editHandles', _keplerOudatedDeck.ScatterplotLayer);
          layer = new EditHandlePointLayer(this.getSubLayerProps(_objectSpread({}, sharedProps, {
            // Proxy editing point props
            radiusScale: this.props.editHandlePointRadiusScale,
            outline: this.props.editHandlePointOutline,
            strokeWidth: this.props.editHandlePointStrokeWidth,
            radiusMinPixels: this.props.editHandlePointRadiusMinPixels,
            radiusMaxPixels: this.props.editHandlePointRadiusMaxPixels,
            getRadius: this.props.getEditHandlePointRadius,
            getColor: this.props.getEditHandlePointColor
          })));
          break;
      }

      return [layer];
    }
  }, {
    key: "createTentativeLayers",
    value: function createTentativeLayers() {
      var _this2 = this;

      if (!this.state.tentativeFeature) {
        return [];
      }

      var layer = new _keplerOudatedDeck.GeoJsonLayer(this.getSubLayerProps({
        id: 'tentative',
        data: this.state.tentativeFeature,
        fp64: this.props.fp64,
        pickable: false,
        stroked: true,
        autoHighlight: false,
        lineWidthScale: this.props.lineWidthScale,
        lineWidthMinPixels: this.props.lineWidthMinPixels,
        lineWidthMaxPixels: this.props.lineWidthMaxPixels,
        lineWidthUnits: this.props.lineWidthUnits,
        lineJointRounded: this.props.lineJointRounded,
        lineMiterLimit: this.props.lineMiterLimit,
        pointRadiusScale: this.props.editHandlePointRadiusScale,
        outline: this.props.editHandlePointOutline,
        strokeWidth: this.props.editHandlePointStrokeWidth,
        pointRadiusMinPixels: this.props.editHandlePointRadiusMinPixels,
        pointRadiusMaxPixels: this.props.editHandlePointRadiusMaxPixels,
        getRadius: this.props.getEditHandlePointRadius,
        getLineColor: function getLineColor(feature) {
          return _this2.props.getTentativeLineColor(feature, _this2.props.mode);
        },
        getLineWidth: function getLineWidth(feature) {
          return _this2.props.getTentativeLineWidth(feature, _this2.props.mode);
        },
        getFillColor: function getFillColor(feature) {
          return _this2.props.getTentativeFillColor(feature, _this2.props.mode);
        },
        getLineDashArray: function getLineDashArray(feature) {
          return _this2.props.getTentativeLineDashArray(feature, _this2.state.selectedFeatures[0], _this2.props.mode);
        }
      }));
      return [layer];
    }
  }, {
    key: "updateTentativeFeature",
    value: function updateTentativeFeature() {
      var tentativeFeature = this.state.modeHandler.getTentativeFeature();

      if (tentativeFeature !== this.state.tentativeFeature) {
        this.setState({
          tentativeFeature: tentativeFeature
        });
        this.setLayerNeedsUpdate();
      }
    }
  }, {
    key: "updateEditHandles",
    value: function updateEditHandles(picks, groundCoords) {
      var editHandles = this.state.modeHandler.getEditHandles(picks, groundCoords);

      if (editHandles !== this.state.editHandles) {
        this.setState({
          editHandles: editHandles
        });
        this.setLayerNeedsUpdate();
      }
    }
  }, {
    key: "onLayerClick",
    value: function onLayerClick(event) {
      var editAction = this.state.modeHandler.handleClick(event);
      this.updateTentativeFeature();
      this.updateEditHandles();

      if (editAction) {
        this.props.onEdit(editAction);
      }
    }
  }, {
    key: "onStartDragging",
    value: function onStartDragging(event) {
      var editAction = this.state.modeHandler.handleStartDragging(event);
      this.updateTentativeFeature();
      this.updateEditHandles();

      if (editAction) {
        this.props.onEdit(editAction);
      }
    }
  }, {
    key: "onStopDragging",
    value: function onStopDragging(event) {
      var editAction = this.state.modeHandler.handleStopDragging(event);
      this.updateTentativeFeature();
      this.updateEditHandles();

      if (editAction) {
        this.props.onEdit(editAction);
      }
    }
  }, {
    key: "onPointerMove",
    value: function onPointerMove(event) {
      var groundCoords = event.groundCoords,
          picks = event.picks,
          sourceEvent = event.sourceEvent;

      var _this$state$modeHandl = this.state.modeHandler.handlePointerMove(event),
          editAction = _this$state$modeHandl.editAction,
          cancelMapPan = _this$state$modeHandl.cancelMapPan;

      this.updateTentativeFeature();
      this.updateEditHandles(picks, groundCoords);

      if (cancelMapPan) {
        // TODO: find a less hacky way to prevent map panning
        // Stop propagation to prevent map panning while dragging an edit handle
        sourceEvent.stopPropagation();
      }

      if (editAction) {
        this.props.onEdit(editAction);
      }
    }
  }, {
    key: "getCursor",
    value: function getCursor(_ref4) {
      var isDragging = _ref4.isDragging;
      return this.state.modeHandler.getCursor({
        isDragging: isDragging
      });
    }
  }]);

  return EditableGeoJsonLayer;
}(_editableLayer.default);

exports.default = EditableGeoJsonLayer;
EditableGeoJsonLayer.layerName = 'EditableGeoJsonLayer';
EditableGeoJsonLayer.defaultProps = defaultProps;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sYXllcnMvZWRpdGFibGUtZ2VvanNvbi1sYXllci5qcyJdLCJuYW1lcyI6WyJERUZBVUxUX0xJTkVfQ09MT1IiLCJERUZBVUxUX0ZJTExfQ09MT1IiLCJERUZBVUxUX1NFTEVDVEVEX0xJTkVfQ09MT1IiLCJERUZBVUxUX1NFTEVDVEVEX0ZJTExfQ09MT1IiLCJERUZBVUxUX0VESVRJTkdfRVhJU1RJTkdfUE9JTlRfQ09MT1IiLCJERUZBVUxUX0VESVRJTkdfSU5URVJNRURJQVRFX1BPSU5UX0NPTE9SIiwiREVGQVVMVF9FRElUSU5HX1NOQVBfUE9JTlRfQ09MT1IiLCJERUZBVUxUX0VESVRJTkdfRVhJU1RJTkdfUE9JTlRfUkFESVVTIiwiREVGQVVMVF9FRElUSU5HX0lOVEVSTUVESUFURV9QT0lOVF9SQURJVVMiLCJERUZBVUxUX0VESVRJTkdfU05BUF9QT0lOVF9SQURJVVMiLCJnZXRFZGl0SGFuZGxlQ29sb3IiLCJoYW5kbGUiLCJ0eXBlIiwiZ2V0RWRpdEhhbmRsZVJhZGl1cyIsImRlZmF1bHRQcm9wcyIsIm1vZGUiLCJvbkVkaXQiLCJwaWNrYWJsZSIsInBpY2tpbmdSYWRpdXMiLCJwaWNraW5nRGVwdGgiLCJmcDY0IiwiZmlsbGVkIiwic3Ryb2tlZCIsImxpbmVXaWR0aFNjYWxlIiwibGluZVdpZHRoTWluUGl4ZWxzIiwibGluZVdpZHRoTWF4UGl4ZWxzIiwiTnVtYmVyIiwiTUFYX1NBRkVfSU5URUdFUiIsImxpbmVXaWR0aFVuaXRzIiwibGluZUpvaW50Um91bmRlZCIsImxpbmVNaXRlckxpbWl0IiwicG9pbnRSYWRpdXNTY2FsZSIsInBvaW50UmFkaXVzTWluUGl4ZWxzIiwicG9pbnRSYWRpdXNNYXhQaXhlbHMiLCJsaW5lRGFzaEp1c3RpZmllZCIsImdldExpbmVDb2xvciIsImZlYXR1cmUiLCJpc1NlbGVjdGVkIiwiZ2V0RmlsbENvbG9yIiwiZ2V0UmFkaXVzIiwiZiIsInByb3BlcnRpZXMiLCJyYWRpdXMiLCJzaXplIiwiZ2V0TGluZVdpZHRoIiwibGluZVdpZHRoIiwiZ2V0TGluZURhc2hBcnJheSIsImdldFRlbnRhdGl2ZUxpbmVEYXNoQXJyYXkiLCJnZXRUZW50YXRpdmVMaW5lQ29sb3IiLCJnZXRUZW50YXRpdmVGaWxsQ29sb3IiLCJnZXRUZW50YXRpdmVMaW5lV2lkdGgiLCJlZGl0SGFuZGxlVHlwZSIsImVkaXRIYW5kbGVQYXJhbWV0ZXJzIiwiZWRpdEhhbmRsZUxheWVyUHJvcHMiLCJlZGl0SGFuZGxlUG9pbnRSYWRpdXNTY2FsZSIsImVkaXRIYW5kbGVQb2ludE91dGxpbmUiLCJlZGl0SGFuZGxlUG9pbnRTdHJva2VXaWR0aCIsImVkaXRIYW5kbGVQb2ludFJhZGl1c01pblBpeGVscyIsImVkaXRIYW5kbGVQb2ludFJhZGl1c01heFBpeGVscyIsImdldEVkaXRIYW5kbGVQb2ludENvbG9yIiwiZ2V0RWRpdEhhbmRsZVBvaW50UmFkaXVzIiwiZWRpdEhhbmRsZUljb25BdGxhcyIsImVkaXRIYW5kbGVJY29uTWFwcGluZyIsImVkaXRIYW5kbGVJY29uU2l6ZVNjYWxlIiwiZ2V0RWRpdEhhbmRsZUljb24iLCJnZXRFZGl0SGFuZGxlSWNvblNpemUiLCJnZXRFZGl0SGFuZGxlSWNvbkNvbG9yIiwiZ2V0RWRpdEhhbmRsZUljb25BbmdsZSIsImJpbGxib2FyZCIsIm1vZGVIYW5kbGVycyIsInZpZXciLCJWaWV3SGFuZGxlciIsIm1vZGlmeSIsIk1vZGlmeUhhbmRsZXIiLCJlbGV2YXRpb24iLCJFbGV2YXRpb25IYW5kbGVyIiwiZXh0cnVkZSIsIkV4dHJ1ZGVIYW5kbGVyIiwicm90YXRlIiwiUm90YXRlSGFuZGxlciIsInRyYW5zbGF0ZSIsIlNuYXBwYWJsZUhhbmRsZXIiLCJUcmFuc2xhdGVIYW5kbGVyIiwiZHVwbGljYXRlIiwiRHVwbGljYXRlSGFuZGxlciIsInNjYWxlIiwiU2NhbGVIYW5kbGVyIiwiZHJhd1BvaW50IiwiRHJhd1BvaW50SGFuZGxlciIsImRyYXdMaW5lU3RyaW5nIiwiRHJhd0xpbmVTdHJpbmdIYW5kbGVyIiwiZHJhd1BvbHlnb24iLCJEcmF3UG9seWdvbkhhbmRsZXIiLCJkcmF3OTBEZWdyZWVQb2x5Z29uIiwiRHJhdzkwRGVncmVlUG9seWdvbkhhbmRsZXIiLCJzcGxpdCIsIlNwbGl0UG9seWdvbkhhbmRsZXIiLCJkcmF3UmVjdGFuZ2xlIiwiRHJhd1JlY3RhbmdsZUhhbmRsZXIiLCJkcmF3UmVjdGFuZ2xlVXNpbmczUG9pbnRzIiwiRHJhd1JlY3RhbmdsZVVzaW5nVGhyZWVQb2ludHNIYW5kbGVyIiwiZHJhd0NpcmNsZUZyb21DZW50ZXIiLCJEcmF3Q2lyY2xlRnJvbUNlbnRlckhhbmRsZXIiLCJkcmF3Q2lyY2xlQnlCb3VuZGluZ0JveCIsIkRyYXdDaXJjbGVCeUJvdW5kaW5nQm94SGFuZGxlciIsImRyYXdFbGxpcHNlQnlCb3VuZGluZ0JveCIsIkRyYXdFbGxpcHNlQnlCb3VuZGluZ0JveEhhbmRsZXIiLCJkcmF3RWxsaXBzZVVzaW5nM1BvaW50cyIsIkRyYXdFbGxpcHNlVXNpbmdUaHJlZVBvaW50c0hhbmRsZXIiLCJFZGl0YWJsZUdlb0pzb25MYXllciIsInN1YkxheWVyUHJvcHMiLCJnZXRTdWJMYXllclByb3BzIiwiaWQiLCJkYXRhIiwicHJvcHMiLCJzZWxlY3Rpb25Bd2FyZUFjY2Vzc29yIiwiX3N1YkxheWVyUHJvcHMiLCJ1cGRhdGVUcmlnZ2VycyIsInNlbGVjdGVkRmVhdHVyZUluZGV4ZXMiLCJsYXllcnMiLCJHZW9Kc29uTGF5ZXIiLCJjb25jYXQiLCJjcmVhdGVUZW50YXRpdmVMYXllcnMiLCJjcmVhdGVFZGl0SGFuZGxlTGF5ZXJzIiwic2V0U3RhdGUiLCJzZWxlY3RlZEZlYXR1cmVzIiwiZWRpdEhhbmRsZXMiLCJvbGRQcm9wcyIsImNvbnRleHQiLCJvbGRDb250ZXh0IiwiY2hhbmdlRmxhZ3MiLCJzdGF0ZUNoYW5nZWQiLCJtb2RlSGFuZGxlciIsInN0YXRlIiwicHJvcHNPckRhdGFDaGFuZ2VkIiwiY29uc29sZSIsIndhcm4iLCJNb2RlSGFuZGxlciIsInNldEZlYXR1cmVDb2xsZWN0aW9uIiwiZGF0YUNoYW5nZWQiLCJzZXRNb2RlQ29uZmlnIiwibW9kZUNvbmZpZyIsInNldFNlbGVjdGVkRmVhdHVyZUluZGV4ZXMiLCJ1cGRhdGVUZW50YXRpdmVGZWF0dXJlIiwidXBkYXRlRWRpdEhhbmRsZXMiLCJBcnJheSIsImlzQXJyYXkiLCJtYXAiLCJlbGVtIiwiZmVhdHVyZXMiLCJhY2Nlc3NvciIsImlzRmVhdHVyZVNlbGVjdGVkIiwibGVuZ3RoIiwiZmVhdHVyZUluZGV4IiwiaW5kZXhPZiIsImluY2x1ZGVzIiwiaW5mbyIsInNvdXJjZUxheWVyIiwiZW5kc1dpdGgiLCJpc0VkaXRpbmdIYW5kbGUiLCJzaGFyZWRQcm9wcyIsInBhcmFtZXRlcnMiLCJsYXllciIsIkVkaXRIYW5kbGVJY29uTGF5ZXIiLCJnZXRTdWJMYXllckNsYXNzIiwiSWNvbkxheWVyIiwiaWNvbkF0bGFzIiwiaWNvbk1hcHBpbmciLCJzaXplU2NhbGUiLCJnZXRJY29uIiwiZ2V0U2l6ZSIsImdldENvbG9yIiwiZ2V0QW5nbGUiLCJnZXRQb3NpdGlvbiIsImQiLCJwb3NpdGlvbiIsIkVkaXRIYW5kbGVQb2ludExheWVyIiwiU2NhdHRlcnBsb3RMYXllciIsInJhZGl1c1NjYWxlIiwib3V0bGluZSIsInN0cm9rZVdpZHRoIiwicmFkaXVzTWluUGl4ZWxzIiwicmFkaXVzTWF4UGl4ZWxzIiwidGVudGF0aXZlRmVhdHVyZSIsImF1dG9IaWdobGlnaHQiLCJnZXRUZW50YXRpdmVGZWF0dXJlIiwic2V0TGF5ZXJOZWVkc1VwZGF0ZSIsInBpY2tzIiwiZ3JvdW5kQ29vcmRzIiwiZ2V0RWRpdEhhbmRsZXMiLCJldmVudCIsImVkaXRBY3Rpb24iLCJoYW5kbGVDbGljayIsImhhbmRsZVN0YXJ0RHJhZ2dpbmciLCJoYW5kbGVTdG9wRHJhZ2dpbmciLCJzb3VyY2VFdmVudCIsImhhbmRsZVBvaW50ZXJNb3ZlIiwiY2FuY2VsTWFwUGFuIiwic3RvcFByb3BhZ2F0aW9uIiwiaXNEcmFnZ2luZyIsImdldEN1cnNvciIsIkVkaXRhYmxlTGF5ZXIiLCJsYXllck5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFHQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFTQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsa0JBQWtCLEdBQUcsQ0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEdBQVgsRUFBZ0IsSUFBaEIsQ0FBM0I7QUFDQSxJQUFNQyxrQkFBa0IsR0FBRyxDQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsR0FBWCxFQUFnQixJQUFoQixDQUEzQjtBQUNBLElBQU1DLDJCQUEyQixHQUFHLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLENBQXBDO0FBQ0EsSUFBTUMsMkJBQTJCLEdBQUcsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FBcEM7QUFDQSxJQUFNQyxvQ0FBb0MsR0FBRyxDQUFDLElBQUQsRUFBTyxHQUFQLEVBQVksR0FBWixFQUFpQixJQUFqQixDQUE3QztBQUNBLElBQU1DLHdDQUF3QyxHQUFHLENBQUMsR0FBRCxFQUFNLEdBQU4sRUFBVyxHQUFYLEVBQWdCLElBQWhCLENBQWpEO0FBQ0EsSUFBTUMsZ0NBQWdDLEdBQUcsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FBekM7QUFDQSxJQUFNQyxxQ0FBcUMsR0FBRyxDQUE5QztBQUNBLElBQU1DLHlDQUF5QyxHQUFHLENBQWxEO0FBQ0EsSUFBTUMsaUNBQWlDLEdBQUcsQ0FBMUM7O0FBRUEsU0FBU0Msa0JBQVQsQ0FBNEJDLE1BQTVCLEVBQW9DO0FBQ2xDLFVBQVFBLE1BQU0sQ0FBQ0MsSUFBZjtBQUNFLFNBQUssVUFBTDtBQUNFLGFBQU9SLG9DQUFQOztBQUNGLFNBQUssTUFBTDtBQUNFLGFBQU9FLGdDQUFQOztBQUNGLFNBQUssY0FBTDtBQUNBO0FBQ0UsYUFBT0Qsd0NBQVA7QUFQSjtBQVNEOztBQUVELFNBQVNRLG1CQUFULENBQTZCRixNQUE3QixFQUFxQztBQUNuQyxVQUFRQSxNQUFNLENBQUNDLElBQWY7QUFDRSxTQUFLLFVBQUw7QUFDRSxhQUFPTCxxQ0FBUDs7QUFDRixTQUFLLE1BQUw7QUFDRSxhQUFPRSxpQ0FBUDs7QUFDRixTQUFLLGNBQUw7QUFDQTtBQUNFLGFBQU9ELHlDQUFQO0FBUEo7QUFTRDs7QUFFRCxJQUFNTSxZQUFZLEdBQUc7QUFDbkJDLEVBQUFBLElBQUksRUFBRSxRQURhO0FBR25CO0FBQ0FDLEVBQUFBLE1BQU0sRUFBRSxrQkFBTSxDQUFFLENBSkc7QUFNbkJDLEVBQUFBLFFBQVEsRUFBRSxJQU5TO0FBT25CQyxFQUFBQSxhQUFhLEVBQUUsRUFQSTtBQVFuQkMsRUFBQUEsWUFBWSxFQUFFLENBUks7QUFTbkJDLEVBQUFBLElBQUksRUFBRSxLQVRhO0FBVW5CQyxFQUFBQSxNQUFNLEVBQUUsSUFWVztBQVduQkMsRUFBQUEsT0FBTyxFQUFFLElBWFU7QUFZbkJDLEVBQUFBLGNBQWMsRUFBRSxDQVpHO0FBYW5CQyxFQUFBQSxrQkFBa0IsRUFBRSxDQWJEO0FBY25CQyxFQUFBQSxrQkFBa0IsRUFBRUMsTUFBTSxDQUFDQyxnQkFkUjtBQWVuQkMsRUFBQUEsY0FBYyxFQUFFLFFBZkc7QUFnQm5CQyxFQUFBQSxnQkFBZ0IsRUFBRSxLQWhCQztBQWlCbkJDLEVBQUFBLGNBQWMsRUFBRSxDQWpCRztBQWtCbkJDLEVBQUFBLGdCQUFnQixFQUFFLENBbEJDO0FBbUJuQkMsRUFBQUEsb0JBQW9CLEVBQUUsQ0FuQkg7QUFvQm5CQyxFQUFBQSxvQkFBb0IsRUFBRVAsTUFBTSxDQUFDQyxnQkFwQlY7QUFxQm5CTyxFQUFBQSxpQkFBaUIsRUFBRSxLQXJCQTtBQXNCbkJDLEVBQUFBLFlBQVksRUFBRSxzQkFBQ0MsT0FBRCxFQUFVQyxVQUFWLEVBQXNCdEIsSUFBdEI7QUFBQSxXQUNac0IsVUFBVSxHQUFHbkMsMkJBQUgsR0FBaUNGLGtCQUQvQjtBQUFBLEdBdEJLO0FBd0JuQnNDLEVBQUFBLFlBQVksRUFBRSxzQkFBQ0YsT0FBRCxFQUFVQyxVQUFWLEVBQXNCdEIsSUFBdEI7QUFBQSxXQUNac0IsVUFBVSxHQUFHbEMsMkJBQUgsR0FBaUNGLGtCQUQvQjtBQUFBLEdBeEJLO0FBMEJuQnNDLEVBQUFBLFNBQVMsRUFBRSxtQkFBQUMsQ0FBQztBQUFBLFdBQ1RBLENBQUMsSUFBSUEsQ0FBQyxDQUFDQyxVQUFQLElBQXFCRCxDQUFDLENBQUNDLFVBQUYsQ0FBYUMsTUFBbkMsSUFBK0NGLENBQUMsSUFBSUEsQ0FBQyxDQUFDQyxVQUFQLElBQXFCRCxDQUFDLENBQUNDLFVBQUYsQ0FBYUUsSUFBakYsSUFBMEYsQ0FEaEY7QUFBQSxHQTFCTztBQTRCbkJDLEVBQUFBLFlBQVksRUFBRSxzQkFBQUosQ0FBQztBQUFBLFdBQUtBLENBQUMsSUFBSUEsQ0FBQyxDQUFDQyxVQUFQLElBQXFCRCxDQUFDLENBQUNDLFVBQUYsQ0FBYUksU0FBbkMsSUFBaUQsQ0FBckQ7QUFBQSxHQTVCSTtBQTZCbkJDLEVBQUFBLGdCQUFnQixFQUFFLDBCQUFDVixPQUFELEVBQVVDLFVBQVYsRUFBc0J0QixJQUF0QjtBQUFBLFdBQ2hCc0IsVUFBVSxJQUFJdEIsSUFBSSxLQUFLLE1BQXZCLEdBQWdDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBaEMsR0FBeUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUR6QjtBQUFBLEdBN0JDO0FBZ0NuQjtBQUNBZ0MsRUFBQUEseUJBQXlCLEVBQUUsbUNBQUNQLENBQUQsRUFBSXpCLElBQUo7QUFBQSxXQUFhLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBYjtBQUFBLEdBakNSO0FBa0NuQmlDLEVBQUFBLHFCQUFxQixFQUFFLCtCQUFDUixDQUFELEVBQUl6QixJQUFKO0FBQUEsV0FBYWIsMkJBQWI7QUFBQSxHQWxDSjtBQW1DbkIrQyxFQUFBQSxxQkFBcUIsRUFBRSwrQkFBQ1QsQ0FBRCxFQUFJekIsSUFBSjtBQUFBLFdBQWFaLDJCQUFiO0FBQUEsR0FuQ0o7QUFvQ25CK0MsRUFBQUEscUJBQXFCLEVBQUUsK0JBQUNWLENBQUQsRUFBSXpCLElBQUo7QUFBQSxXQUFjeUIsQ0FBQyxJQUFJQSxDQUFDLENBQUNDLFVBQVAsSUFBcUJELENBQUMsQ0FBQ0MsVUFBRixDQUFhSSxTQUFuQyxJQUFpRCxDQUE5RDtBQUFBLEdBcENKO0FBc0NuQk0sRUFBQUEsY0FBYyxFQUFFLE9BdENHO0FBdUNuQkMsRUFBQUEsb0JBQW9CLEVBQUUsRUF2Q0g7QUF3Q25CQyxFQUFBQSxvQkFBb0IsRUFBRSxFQXhDSDtBQTBDbkI7QUFDQUMsRUFBQUEsMEJBQTBCLEVBQUUsQ0EzQ1Q7QUE0Q25CQyxFQUFBQSxzQkFBc0IsRUFBRSxLQTVDTDtBQTZDbkJDLEVBQUFBLDBCQUEwQixFQUFFLENBN0NUO0FBOENuQkMsRUFBQUEsOEJBQThCLEVBQUUsQ0E5Q2I7QUErQ25CQyxFQUFBQSw4QkFBOEIsRUFBRSxDQS9DYjtBQWdEbkJDLEVBQUFBLHVCQUF1QixFQUFFakQsa0JBaEROO0FBaURuQmtELEVBQUFBLHdCQUF3QixFQUFFL0MsbUJBakRQO0FBbURuQjtBQUNBZ0QsRUFBQUEsbUJBQW1CLEVBQUUsSUFwREY7QUFxRG5CQyxFQUFBQSxxQkFBcUIsRUFBRSxJQXJESjtBQXNEbkJDLEVBQUFBLHVCQUF1QixFQUFFLENBdEROO0FBdURuQkMsRUFBQUEsaUJBQWlCLEVBQUUsMkJBQUFyRCxNQUFNO0FBQUEsV0FBSUEsTUFBTSxDQUFDQyxJQUFYO0FBQUEsR0F2RE47QUF3RG5CcUQsRUFBQUEscUJBQXFCLEVBQUUsRUF4REo7QUF5RG5CQyxFQUFBQSxzQkFBc0IsRUFBRXhELGtCQXpETDtBQTBEbkJ5RCxFQUFBQSxzQkFBc0IsRUFBRSxDQTFETDtBQTREbkI7QUFDQUMsRUFBQUEsU0FBUyxFQUFFLElBN0RRO0FBK0RuQjtBQUNBQyxFQUFBQSxZQUFZLEVBQUU7QUFDWkMsSUFBQUEsSUFBSSxFQUFFLElBQUlDLHdCQUFKLEVBRE07QUFFWkMsSUFBQUEsTUFBTSxFQUFFLElBQUlDLDRCQUFKLEVBRkk7QUFHWkMsSUFBQUEsU0FBUyxFQUFFLElBQUlDLGtDQUFKLEVBSEM7QUFJWkMsSUFBQUEsT0FBTyxFQUFFLElBQUlDLDhCQUFKLEVBSkc7QUFLWkMsSUFBQUEsTUFBTSxFQUFFLElBQUlDLDRCQUFKLEVBTEk7QUFNWkMsSUFBQUEsU0FBUyxFQUFFLElBQUlDLGtDQUFKLENBQXFCLElBQUlDLGtDQUFKLEVBQXJCLENBTkM7QUFPWkMsSUFBQUEsU0FBUyxFQUFFLElBQUlDLGtDQUFKLEVBUEM7QUFRWkMsSUFBQUEsS0FBSyxFQUFFLElBQUlDLDBCQUFKLEVBUks7QUFTWkMsSUFBQUEsU0FBUyxFQUFFLElBQUlDLGtDQUFKLEVBVEM7QUFVWkMsSUFBQUEsY0FBYyxFQUFFLElBQUlDLDRDQUFKLEVBVko7QUFXWkMsSUFBQUEsV0FBVyxFQUFFLElBQUlDLHNDQUFKLEVBWEQ7QUFZWkMsSUFBQUEsbUJBQW1CLEVBQUUsSUFBSUMsc0RBQUosRUFaVDtBQWFaQyxJQUFBQSxLQUFLLEVBQUUsSUFBSUMsd0NBQUosRUFiSztBQWNaQyxJQUFBQSxhQUFhLEVBQUUsSUFBSUMsMENBQUosRUFkSDtBQWVaQyxJQUFBQSx5QkFBeUIsRUFBRSxJQUFJQywwRUFBSixFQWZmO0FBZ0JaQyxJQUFBQSxvQkFBb0IsRUFBRSxJQUFJQyx3REFBSixFQWhCVjtBQWlCWkMsSUFBQUEsdUJBQXVCLEVBQUUsSUFBSUMsOERBQUosRUFqQmI7QUFrQlpDLElBQUFBLHdCQUF3QixFQUFFLElBQUlDLGdFQUFKLEVBbEJkO0FBbUJaQyxJQUFBQSx1QkFBdUIsRUFBRSxJQUFJQyxzRUFBSjtBQW5CYjtBQWhFSyxDQUFyQjs7QUErRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0lBRXFCQyxvQjs7Ozs7Ozs7Ozs7OztBQUNuQjtBQUNBO0FBQ0E7bUNBRWU7QUFDYixVQUFNQyxhQUFhLEdBQUcsS0FBS0MsZ0JBQUwsQ0FBc0I7QUFDMUNDLFFBQUFBLEVBQUUsRUFBRSxTQURzQztBQUcxQztBQUNBQyxRQUFBQSxJQUFJLEVBQUUsS0FBS0MsS0FBTCxDQUFXRCxJQUp5QjtBQUsxQzdGLFFBQUFBLElBQUksRUFBRSxLQUFLOEYsS0FBTCxDQUFXOUYsSUFMeUI7QUFNMUNDLFFBQUFBLE1BQU0sRUFBRSxLQUFLNkYsS0FBTCxDQUFXN0YsTUFOdUI7QUFPMUNDLFFBQUFBLE9BQU8sRUFBRSxLQUFLNEYsS0FBTCxDQUFXNUYsT0FQc0I7QUFRMUNDLFFBQUFBLGNBQWMsRUFBRSxLQUFLMkYsS0FBTCxDQUFXM0YsY0FSZTtBQVMxQ0MsUUFBQUEsa0JBQWtCLEVBQUUsS0FBSzBGLEtBQUwsQ0FBVzFGLGtCQVRXO0FBVTFDQyxRQUFBQSxrQkFBa0IsRUFBRSxLQUFLeUYsS0FBTCxDQUFXekYsa0JBVlc7QUFXMUNHLFFBQUFBLGNBQWMsRUFBRSxLQUFLc0YsS0FBTCxDQUFXdEYsY0FYZTtBQVkxQ0MsUUFBQUEsZ0JBQWdCLEVBQUUsS0FBS3FGLEtBQUwsQ0FBV3JGLGdCQVphO0FBYTFDQyxRQUFBQSxjQUFjLEVBQUUsS0FBS29GLEtBQUwsQ0FBV3BGLGNBYmU7QUFjMUNDLFFBQUFBLGdCQUFnQixFQUFFLEtBQUttRixLQUFMLENBQVduRixnQkFkYTtBQWUxQ0MsUUFBQUEsb0JBQW9CLEVBQUUsS0FBS2tGLEtBQUwsQ0FBV2xGLG9CQWZTO0FBZ0IxQ0MsUUFBQUEsb0JBQW9CLEVBQUUsS0FBS2lGLEtBQUwsQ0FBV2pGLG9CQWhCUztBQWlCMUNDLFFBQUFBLGlCQUFpQixFQUFFLEtBQUtnRixLQUFMLENBQVdoRixpQkFqQlk7QUFrQjFDQyxRQUFBQSxZQUFZLEVBQUUsS0FBS2dGLHNCQUFMLENBQTRCLEtBQUtELEtBQUwsQ0FBVy9FLFlBQXZDLENBbEI0QjtBQW1CMUNHLFFBQUFBLFlBQVksRUFBRSxLQUFLNkUsc0JBQUwsQ0FBNEIsS0FBS0QsS0FBTCxDQUFXNUUsWUFBdkMsQ0FuQjRCO0FBb0IxQ0MsUUFBQUEsU0FBUyxFQUFFLEtBQUs0RSxzQkFBTCxDQUE0QixLQUFLRCxLQUFMLENBQVczRSxTQUF2QyxDQXBCK0I7QUFxQjFDSyxRQUFBQSxZQUFZLEVBQUUsS0FBS3VFLHNCQUFMLENBQTRCLEtBQUtELEtBQUwsQ0FBV3RFLFlBQXZDLENBckI0QjtBQXNCMUNFLFFBQUFBLGdCQUFnQixFQUFFLEtBQUtxRSxzQkFBTCxDQUE0QixLQUFLRCxLQUFMLENBQVdwRSxnQkFBdkMsQ0F0QndCO0FBd0IxQ3NFLFFBQUFBLGNBQWMsRUFBRTtBQUNkLDBCQUFnQjtBQUNkaEQsWUFBQUEsU0FBUyxFQUFFLEtBQUs4QyxLQUFMLENBQVc5QztBQURSLFdBREY7QUFJZCw2QkFBbUI7QUFDakJBLFlBQUFBLFNBQVMsRUFBRSxLQUFLOEMsS0FBTCxDQUFXOUM7QUFETDtBQUpMLFNBeEIwQjtBQWlDMUNpRCxRQUFBQSxjQUFjLEVBQUU7QUFDZGxGLFVBQUFBLFlBQVksRUFBRSxDQUFDLEtBQUsrRSxLQUFMLENBQVdJLHNCQUFaLEVBQW9DLEtBQUtKLEtBQUwsQ0FBV25HLElBQS9DLENBREE7QUFFZHVCLFVBQUFBLFlBQVksRUFBRSxDQUFDLEtBQUs0RSxLQUFMLENBQVdJLHNCQUFaLEVBQW9DLEtBQUtKLEtBQUwsQ0FBV25HLElBQS9DLENBRkE7QUFHZHdCLFVBQUFBLFNBQVMsRUFBRSxDQUFDLEtBQUsyRSxLQUFMLENBQVdJLHNCQUFaLEVBQW9DLEtBQUtKLEtBQUwsQ0FBV25HLElBQS9DLENBSEc7QUFJZDZCLFVBQUFBLFlBQVksRUFBRSxDQUFDLEtBQUtzRSxLQUFMLENBQVdJLHNCQUFaLEVBQW9DLEtBQUtKLEtBQUwsQ0FBV25HLElBQS9DLENBSkE7QUFLZCtCLFVBQUFBLGdCQUFnQixFQUFFLENBQUMsS0FBS29FLEtBQUwsQ0FBV0ksc0JBQVosRUFBb0MsS0FBS0osS0FBTCxDQUFXbkcsSUFBL0M7QUFMSjtBQWpDMEIsT0FBdEIsQ0FBdEI7QUEwQ0EsVUFBSXdHLE1BQVcsR0FBRyxDQUFDLElBQUlDLCtCQUFKLENBQWlCVixhQUFqQixDQUFELENBQWxCO0FBRUFTLE1BQUFBLE1BQU0sR0FBR0EsTUFBTSxDQUFDRSxNQUFQLENBQWMsS0FBS0MscUJBQUwsRUFBZCxDQUFUO0FBQ0FILE1BQUFBLE1BQU0sR0FBR0EsTUFBTSxDQUFDRSxNQUFQLENBQWMsS0FBS0Usc0JBQUwsRUFBZCxDQUFUO0FBRUEsYUFBT0osTUFBUDtBQUNEOzs7c0NBRWlCO0FBQ2hCOztBQUVBLFdBQUtLLFFBQUwsQ0FBYztBQUNaQyxRQUFBQSxnQkFBZ0IsRUFBRSxFQUROO0FBRVpDLFFBQUFBLFdBQVcsRUFBRTtBQUZELE9BQWQ7QUFJRCxLLENBRUQ7Ozs7NENBQ2lGO0FBQUEsVUFBN0RaLEtBQTZELFFBQTdEQSxLQUE2RDtBQUFBLFVBQXREYSxRQUFzRCxRQUF0REEsUUFBc0Q7QUFBQSxVQUE1Q0MsT0FBNEMsUUFBNUNBLE9BQTRDO0FBQUEsVUFBbkNDLFVBQW1DLFFBQW5DQSxVQUFtQztBQUFBLFVBQXZCQyxXQUF1QixRQUF2QkEsV0FBdUI7O0FBQy9FLFVBQUlBLFdBQVcsQ0FBQ0MsWUFBaEIsRUFBOEI7QUFDNUIsZUFBTyxJQUFQO0FBQ0Q7O0FBQ0QsYUFBTyxJQUFQO0FBQ0Q7Ozt1Q0FVRTtBQUFBLFVBUERqQixLQU9DLFNBUERBLEtBT0M7QUFBQSxVQU5EYSxRQU1DLFNBTkRBLFFBTUM7QUFBQSxVQUxERyxXQUtDLFNBTERBLFdBS0M7O0FBQ0QsNEZBQWtCO0FBQUVoQixRQUFBQSxLQUFLLEVBQUxBLEtBQUY7QUFBU2dCLFFBQUFBLFdBQVcsRUFBWEE7QUFBVCxPQUFsQjs7QUFFQSxVQUFJRSxXQUF3QixHQUFHLEtBQUtDLEtBQUwsQ0FBV0QsV0FBMUM7O0FBQ0EsVUFBSUYsV0FBVyxDQUFDSSxrQkFBaEIsRUFBb0M7QUFDbEMsWUFBSXBCLEtBQUssQ0FBQzdDLFlBQU4sS0FBdUIwRCxRQUFRLENBQUMxRCxZQUFoQyxJQUFnRDZDLEtBQUssQ0FBQ25HLElBQU4sS0FBZWdILFFBQVEsQ0FBQ2hILElBQTVFLEVBQWtGO0FBQ2hGcUgsVUFBQUEsV0FBVyxHQUFHbEIsS0FBSyxDQUFDN0MsWUFBTixDQUFtQjZDLEtBQUssQ0FBQ25HLElBQXpCLENBQWQ7O0FBRUEsY0FBSSxDQUFDcUgsV0FBTCxFQUFrQjtBQUNoQkcsWUFBQUEsT0FBTyxDQUFDQyxJQUFSLDBDQUErQ3RCLEtBQUssQ0FBQ25HLElBQXJELEdBRGdCLENBQzhDO0FBQzlEOztBQUNBcUgsWUFBQUEsV0FBVyxHQUFHLElBQUlLLHdCQUFKLEVBQWQ7QUFDRDs7QUFFRCxjQUFJTCxXQUFXLEtBQUssS0FBS0MsS0FBTCxDQUFXRCxXQUEvQixFQUE0QztBQUMxQyxpQkFBS1IsUUFBTCxDQUFjO0FBQUVRLGNBQUFBLFdBQVcsRUFBWEE7QUFBRixhQUFkO0FBQ0Q7O0FBRURBLFVBQUFBLFdBQVcsQ0FBQ00sb0JBQVosQ0FBaUN4QixLQUFLLENBQUNELElBQXZDO0FBQ0QsU0FkRCxNQWNPLElBQUlpQixXQUFXLENBQUNTLFdBQWhCLEVBQTZCO0FBQ2xDUCxVQUFBQSxXQUFXLENBQUNNLG9CQUFaLENBQWlDeEIsS0FBSyxDQUFDRCxJQUF2QztBQUNEOztBQUVEbUIsUUFBQUEsV0FBVyxDQUFDUSxhQUFaLENBQTBCMUIsS0FBSyxDQUFDMkIsVUFBaEM7QUFDQVQsUUFBQUEsV0FBVyxDQUFDVSx5QkFBWixDQUFzQzVCLEtBQUssQ0FBQ0ksc0JBQTVDO0FBQ0EsYUFBS3lCLHNCQUFMO0FBQ0EsYUFBS0MsaUJBQUw7QUFDRDs7QUFFRCxVQUFJbkIsZ0JBQWdCLEdBQUcsRUFBdkI7O0FBQ0EsVUFBSW9CLEtBQUssQ0FBQ0MsT0FBTixDQUFjaEMsS0FBSyxDQUFDSSxzQkFBcEIsQ0FBSixFQUFpRDtBQUMvQztBQUNBTyxRQUFBQSxnQkFBZ0IsR0FBR1gsS0FBSyxDQUFDSSxzQkFBTixDQUE2QjZCLEdBQTdCLENBQWlDLFVBQUFDLElBQUk7QUFBQSxpQkFBSWxDLEtBQUssQ0FBQ0QsSUFBTixDQUFXb0MsUUFBWCxDQUFvQkQsSUFBcEIsQ0FBSjtBQUFBLFNBQXJDLENBQW5CO0FBQ0Q7O0FBRUQsV0FBS3hCLFFBQUwsQ0FBYztBQUFFQyxRQUFBQSxnQkFBZ0IsRUFBaEJBO0FBQUYsT0FBZDtBQUNEOzs7MkNBRXNCeUIsUSxFQUFlO0FBQUE7O0FBQ3BDLFVBQUksT0FBT0EsUUFBUCxLQUFvQixVQUF4QixFQUFvQztBQUNsQyxlQUFPQSxRQUFQO0FBQ0Q7O0FBQ0QsYUFBTyxVQUFDbEgsT0FBRDtBQUFBLGVBQXFCa0gsUUFBUSxDQUFDbEgsT0FBRCxFQUFVLEtBQUksQ0FBQ21ILGlCQUFMLENBQXVCbkgsT0FBdkIsQ0FBVixFQUEyQyxLQUFJLENBQUM4RSxLQUFMLENBQVduRyxJQUF0RCxDQUE3QjtBQUFBLE9BQVA7QUFDRDs7O3NDQUVpQnFCLE8sRUFBaUI7QUFDakMsVUFBSSxDQUFDLEtBQUs4RSxLQUFMLENBQVdELElBQVosSUFBb0IsQ0FBQyxLQUFLQyxLQUFMLENBQVdJLHNCQUFwQyxFQUE0RDtBQUMxRCxlQUFPLEtBQVA7QUFDRDs7QUFDRCxVQUFJLENBQUMsS0FBS0osS0FBTCxDQUFXSSxzQkFBWCxDQUFrQ2tDLE1BQXZDLEVBQStDO0FBQzdDLGVBQU8sS0FBUDtBQUNEOztBQUNELFVBQU1DLFlBQVksR0FBRyxLQUFLdkMsS0FBTCxDQUFXRCxJQUFYLENBQWdCb0MsUUFBaEIsQ0FBeUJLLE9BQXpCLENBQWlDdEgsT0FBakMsQ0FBckI7QUFDQSxhQUFPLEtBQUs4RSxLQUFMLENBQVdJLHNCQUFYLENBQWtDcUMsUUFBbEMsQ0FBMkNGLFlBQTNDLENBQVA7QUFDRDs7OzBDQUU2QztBQUFBLFVBQTdCRyxJQUE2QixTQUE3QkEsSUFBNkI7QUFBQSxVQUF2QkMsV0FBdUIsU0FBdkJBLFdBQXVCOztBQUM1QyxVQUFJQSxXQUFXLENBQUM3QyxFQUFaLENBQWU4QyxRQUFmLENBQXdCLGFBQXhCLENBQUosRUFBNEM7QUFDMUM7QUFDQUYsUUFBQUEsSUFBSSxDQUFDRyxlQUFMLEdBQXVCLElBQXZCO0FBQ0Q7O0FBRUQsYUFBT0gsSUFBUDtBQUNEOzs7NkNBRXdCO0FBQ3ZCLFVBQUksQ0FBQyxLQUFLdkIsS0FBTCxDQUFXUCxXQUFYLENBQXVCMEIsTUFBNUIsRUFBb0M7QUFDbEMsZUFBTyxFQUFQO0FBQ0Q7O0FBRUQsVUFBTVEsV0FBVztBQUNmaEQsUUFBQUEsRUFBRSxFQUFFLGFBRFc7QUFFZkMsUUFBQUEsSUFBSSxFQUFFLEtBQUtvQixLQUFMLENBQVdQLFdBRkY7QUFHZjFHLFFBQUFBLElBQUksRUFBRSxLQUFLOEYsS0FBTCxDQUFXOUYsSUFIRjtBQUtmNkksUUFBQUEsVUFBVSxFQUFFLEtBQUsvQyxLQUFMLENBQVc5RDtBQUxSLFNBTVosS0FBSzhELEtBQUwsQ0FBVzdELG9CQU5DLENBQWpCOztBQVNBLFVBQUk2RyxLQUFKOztBQUVBLGNBQVEsS0FBS2hELEtBQUwsQ0FBVy9ELGNBQW5CO0FBQ0UsYUFBSyxNQUFMO0FBQ0UsY0FBTWdILG1CQUFtQixHQUFHLEtBQUtDLGdCQUFMLENBQXNCLGFBQXRCLEVBQXFDQyw0QkFBckMsQ0FBNUI7QUFFQUgsVUFBQUEsS0FBSyxHQUFHLElBQUlDLG1CQUFKLENBQ04sS0FBS3BELGdCQUFMLG1CQUNLaUQsV0FETDtBQUVFTSxZQUFBQSxTQUFTLEVBQUUsS0FBS3BELEtBQUwsQ0FBV3JELG1CQUZ4QjtBQUdFMEcsWUFBQUEsV0FBVyxFQUFFLEtBQUtyRCxLQUFMLENBQVdwRCxxQkFIMUI7QUFJRTBHLFlBQUFBLFNBQVMsRUFBRSxLQUFLdEQsS0FBTCxDQUFXbkQsdUJBSnhCO0FBS0UwRyxZQUFBQSxPQUFPLEVBQUUsS0FBS3ZELEtBQUwsQ0FBV2xELGlCQUx0QjtBQU1FMEcsWUFBQUEsT0FBTyxFQUFFLEtBQUt4RCxLQUFMLENBQVdqRCxxQkFOdEI7QUFPRTBHLFlBQUFBLFFBQVEsRUFBRSxLQUFLekQsS0FBTCxDQUFXaEQsc0JBUHZCO0FBUUUwRyxZQUFBQSxRQUFRLEVBQUUsS0FBSzFELEtBQUwsQ0FBVy9DLHNCQVJ2QjtBQVVFMEcsWUFBQUEsV0FBVyxFQUFFLHFCQUFBQyxDQUFDO0FBQUEscUJBQUlBLENBQUMsQ0FBQ0MsUUFBTjtBQUFBO0FBVmhCLGFBRE0sQ0FBUjtBQWNBOztBQUVGLGFBQUssT0FBTDtBQUNBO0FBQ0UsY0FBTUMsb0JBQW9CLEdBQUcsS0FBS1osZ0JBQUwsQ0FBc0IsYUFBdEIsRUFBcUNhLG1DQUFyQyxDQUE3QjtBQUVBZixVQUFBQSxLQUFLLEdBQUcsSUFBSWMsb0JBQUosQ0FDTixLQUFLakUsZ0JBQUwsbUJBQ0tpRCxXQURMO0FBR0U7QUFDQWtCLFlBQUFBLFdBQVcsRUFBRSxLQUFLaEUsS0FBTCxDQUFXNUQsMEJBSjFCO0FBS0U2SCxZQUFBQSxPQUFPLEVBQUUsS0FBS2pFLEtBQUwsQ0FBVzNELHNCQUx0QjtBQU1FNkgsWUFBQUEsV0FBVyxFQUFFLEtBQUtsRSxLQUFMLENBQVcxRCwwQkFOMUI7QUFPRTZILFlBQUFBLGVBQWUsRUFBRSxLQUFLbkUsS0FBTCxDQUFXekQsOEJBUDlCO0FBUUU2SCxZQUFBQSxlQUFlLEVBQUUsS0FBS3BFLEtBQUwsQ0FBV3hELDhCQVI5QjtBQVNFbkIsWUFBQUEsU0FBUyxFQUFFLEtBQUsyRSxLQUFMLENBQVd0RCx3QkFUeEI7QUFVRStHLFlBQUFBLFFBQVEsRUFBRSxLQUFLekQsS0FBTCxDQUFXdkQ7QUFWdkIsYUFETSxDQUFSO0FBY0E7QUF0Q0o7O0FBeUNBLGFBQU8sQ0FBQ3VHLEtBQUQsQ0FBUDtBQUNEOzs7NENBRXVCO0FBQUE7O0FBQ3RCLFVBQUksQ0FBQyxLQUFLN0IsS0FBTCxDQUFXa0QsZ0JBQWhCLEVBQWtDO0FBQ2hDLGVBQU8sRUFBUDtBQUNEOztBQUVELFVBQU1yQixLQUFLLEdBQUcsSUFBSTFDLCtCQUFKLENBQ1osS0FBS1QsZ0JBQUwsQ0FBc0I7QUFDcEJDLFFBQUFBLEVBQUUsRUFBRSxXQURnQjtBQUVwQkMsUUFBQUEsSUFBSSxFQUFFLEtBQUtvQixLQUFMLENBQVdrRCxnQkFGRztBQUdwQm5LLFFBQUFBLElBQUksRUFBRSxLQUFLOEYsS0FBTCxDQUFXOUYsSUFIRztBQUlwQkgsUUFBQUEsUUFBUSxFQUFFLEtBSlU7QUFLcEJLLFFBQUFBLE9BQU8sRUFBRSxJQUxXO0FBTXBCa0ssUUFBQUEsYUFBYSxFQUFFLEtBTks7QUFPcEJqSyxRQUFBQSxjQUFjLEVBQUUsS0FBSzJGLEtBQUwsQ0FBVzNGLGNBUFA7QUFRcEJDLFFBQUFBLGtCQUFrQixFQUFFLEtBQUswRixLQUFMLENBQVcxRixrQkFSWDtBQVNwQkMsUUFBQUEsa0JBQWtCLEVBQUUsS0FBS3lGLEtBQUwsQ0FBV3pGLGtCQVRYO0FBVXBCRyxRQUFBQSxjQUFjLEVBQUUsS0FBS3NGLEtBQUwsQ0FBV3RGLGNBVlA7QUFXcEJDLFFBQUFBLGdCQUFnQixFQUFFLEtBQUtxRixLQUFMLENBQVdyRixnQkFYVDtBQVlwQkMsUUFBQUEsY0FBYyxFQUFFLEtBQUtvRixLQUFMLENBQVdwRixjQVpQO0FBYXBCQyxRQUFBQSxnQkFBZ0IsRUFBRSxLQUFLbUYsS0FBTCxDQUFXNUQsMEJBYlQ7QUFjcEI2SCxRQUFBQSxPQUFPLEVBQUUsS0FBS2pFLEtBQUwsQ0FBVzNELHNCQWRBO0FBZXBCNkgsUUFBQUEsV0FBVyxFQUFFLEtBQUtsRSxLQUFMLENBQVcxRCwwQkFmSjtBQWdCcEJ4QixRQUFBQSxvQkFBb0IsRUFBRSxLQUFLa0YsS0FBTCxDQUFXekQsOEJBaEJiO0FBaUJwQnhCLFFBQUFBLG9CQUFvQixFQUFFLEtBQUtpRixLQUFMLENBQVd4RCw4QkFqQmI7QUFrQnBCbkIsUUFBQUEsU0FBUyxFQUFFLEtBQUsyRSxLQUFMLENBQVd0RCx3QkFsQkY7QUFtQnBCekIsUUFBQUEsWUFBWSxFQUFFLHNCQUFBQyxPQUFPO0FBQUEsaUJBQUksTUFBSSxDQUFDOEUsS0FBTCxDQUFXbEUscUJBQVgsQ0FBaUNaLE9BQWpDLEVBQTBDLE1BQUksQ0FBQzhFLEtBQUwsQ0FBV25HLElBQXJELENBQUo7QUFBQSxTQW5CRDtBQW9CcEI2QixRQUFBQSxZQUFZLEVBQUUsc0JBQUFSLE9BQU87QUFBQSxpQkFBSSxNQUFJLENBQUM4RSxLQUFMLENBQVdoRSxxQkFBWCxDQUFpQ2QsT0FBakMsRUFBMEMsTUFBSSxDQUFDOEUsS0FBTCxDQUFXbkcsSUFBckQsQ0FBSjtBQUFBLFNBcEJEO0FBcUJwQnVCLFFBQUFBLFlBQVksRUFBRSxzQkFBQUYsT0FBTztBQUFBLGlCQUFJLE1BQUksQ0FBQzhFLEtBQUwsQ0FBV2pFLHFCQUFYLENBQWlDYixPQUFqQyxFQUEwQyxNQUFJLENBQUM4RSxLQUFMLENBQVduRyxJQUFyRCxDQUFKO0FBQUEsU0FyQkQ7QUFzQnBCK0IsUUFBQUEsZ0JBQWdCLEVBQUUsMEJBQUFWLE9BQU87QUFBQSxpQkFDdkIsTUFBSSxDQUFDOEUsS0FBTCxDQUFXbkUseUJBQVgsQ0FDRVgsT0FERixFQUVFLE1BQUksQ0FBQ2lHLEtBQUwsQ0FBV1IsZ0JBQVgsQ0FBNEIsQ0FBNUIsQ0FGRixFQUdFLE1BQUksQ0FBQ1gsS0FBTCxDQUFXbkcsSUFIYixDQUR1QjtBQUFBO0FBdEJMLE9BQXRCLENBRFksQ0FBZDtBQWdDQSxhQUFPLENBQUNtSixLQUFELENBQVA7QUFDRDs7OzZDQUV3QjtBQUN2QixVQUFNcUIsZ0JBQWdCLEdBQUcsS0FBS2xELEtBQUwsQ0FBV0QsV0FBWCxDQUF1QnFELG1CQUF2QixFQUF6Qjs7QUFDQSxVQUFJRixnQkFBZ0IsS0FBSyxLQUFLbEQsS0FBTCxDQUFXa0QsZ0JBQXBDLEVBQXNEO0FBQ3BELGFBQUszRCxRQUFMLENBQWM7QUFBRTJELFVBQUFBLGdCQUFnQixFQUFoQkE7QUFBRixTQUFkO0FBQ0EsYUFBS0csbUJBQUw7QUFDRDtBQUNGOzs7c0NBRWlCQyxLLEVBQXVCQyxZLEVBQXlCO0FBQ2hFLFVBQU05RCxXQUFXLEdBQUcsS0FBS08sS0FBTCxDQUFXRCxXQUFYLENBQXVCeUQsY0FBdkIsQ0FBc0NGLEtBQXRDLEVBQTZDQyxZQUE3QyxDQUFwQjs7QUFDQSxVQUFJOUQsV0FBVyxLQUFLLEtBQUtPLEtBQUwsQ0FBV1AsV0FBL0IsRUFBNEM7QUFDMUMsYUFBS0YsUUFBTCxDQUFjO0FBQUVFLFVBQUFBLFdBQVcsRUFBWEE7QUFBRixTQUFkO0FBQ0EsYUFBSzRELG1CQUFMO0FBQ0Q7QUFDRjs7O2lDQUVZSSxLLEVBQW1CO0FBQzlCLFVBQU1DLFVBQVUsR0FBRyxLQUFLMUQsS0FBTCxDQUFXRCxXQUFYLENBQXVCNEQsV0FBdkIsQ0FBbUNGLEtBQW5DLENBQW5CO0FBQ0EsV0FBSy9DLHNCQUFMO0FBQ0EsV0FBS0MsaUJBQUw7O0FBRUEsVUFBSStDLFVBQUosRUFBZ0I7QUFDZCxhQUFLN0UsS0FBTCxDQUFXbEcsTUFBWCxDQUFrQitLLFVBQWxCO0FBQ0Q7QUFDRjs7O29DQUVlRCxLLEVBQTJCO0FBQ3pDLFVBQU1DLFVBQVUsR0FBRyxLQUFLMUQsS0FBTCxDQUFXRCxXQUFYLENBQXVCNkQsbUJBQXZCLENBQTJDSCxLQUEzQyxDQUFuQjtBQUNBLFdBQUsvQyxzQkFBTDtBQUNBLFdBQUtDLGlCQUFMOztBQUVBLFVBQUkrQyxVQUFKLEVBQWdCO0FBQ2QsYUFBSzdFLEtBQUwsQ0FBV2xHLE1BQVgsQ0FBa0IrSyxVQUFsQjtBQUNEO0FBQ0Y7OzttQ0FFY0QsSyxFQUEwQjtBQUN2QyxVQUFNQyxVQUFVLEdBQUcsS0FBSzFELEtBQUwsQ0FBV0QsV0FBWCxDQUF1QjhELGtCQUF2QixDQUEwQ0osS0FBMUMsQ0FBbkI7QUFDQSxXQUFLL0Msc0JBQUw7QUFDQSxXQUFLQyxpQkFBTDs7QUFFQSxVQUFJK0MsVUFBSixFQUFnQjtBQUNkLGFBQUs3RSxLQUFMLENBQVdsRyxNQUFYLENBQWtCK0ssVUFBbEI7QUFDRDtBQUNGOzs7a0NBRWFELEssRUFBeUI7QUFBQSxVQUM3QkYsWUFENkIsR0FDUUUsS0FEUixDQUM3QkYsWUFENkI7QUFBQSxVQUNmRCxLQURlLEdBQ1FHLEtBRFIsQ0FDZkgsS0FEZTtBQUFBLFVBQ1JRLFdBRFEsR0FDUUwsS0FEUixDQUNSSyxXQURROztBQUFBLGtDQUdBLEtBQUs5RCxLQUFMLENBQVdELFdBQVgsQ0FBdUJnRSxpQkFBdkIsQ0FBeUNOLEtBQXpDLENBSEE7QUFBQSxVQUc3QkMsVUFINkIseUJBRzdCQSxVQUg2QjtBQUFBLFVBR2pCTSxZQUhpQix5QkFHakJBLFlBSGlCOztBQUlyQyxXQUFLdEQsc0JBQUw7QUFDQSxXQUFLQyxpQkFBTCxDQUF1QjJDLEtBQXZCLEVBQThCQyxZQUE5Qjs7QUFFQSxVQUFJUyxZQUFKLEVBQWtCO0FBQ2hCO0FBQ0E7QUFDQUYsUUFBQUEsV0FBVyxDQUFDRyxlQUFaO0FBQ0Q7O0FBRUQsVUFBSVAsVUFBSixFQUFnQjtBQUNkLGFBQUs3RSxLQUFMLENBQVdsRyxNQUFYLENBQWtCK0ssVUFBbEI7QUFDRDtBQUNGOzs7cUNBRWtEO0FBQUEsVUFBdkNRLFVBQXVDLFNBQXZDQSxVQUF1QztBQUNqRCxhQUFPLEtBQUtsRSxLQUFMLENBQVdELFdBQVgsQ0FBdUJvRSxTQUF2QixDQUFpQztBQUFFRCxRQUFBQSxVQUFVLEVBQVZBO0FBQUYsT0FBakMsQ0FBUDtBQUNEOzs7O0VBeFQrQ0Usc0I7OztBQTJUbEQ1RixvQkFBb0IsQ0FBQzZGLFNBQXJCLEdBQWlDLHNCQUFqQztBQUNBN0Ysb0JBQW9CLENBQUMvRixZQUFyQixHQUFvQ0EsWUFBcEMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuLyogZXNsaW50LWVudiBicm93c2VyICovXG5cbmltcG9ydCB7IEdlb0pzb25MYXllciwgU2NhdHRlcnBsb3RMYXllciwgSWNvbkxheWVyIH0gZnJvbSAna2VwbGVyLW91ZGF0ZWQtZGVjay5nbC1sYXllcnMnO1xuaW1wb3J0IHsgdHlwZSBQb3NpdGlvbiB9IGZyb20gJ0BuZWJ1bGEuZ2wvZWRpdC1tb2Rlcyc7XG5pbXBvcnQgeyBNb2RlSGFuZGxlciB9IGZyb20gJy4uL21vZGUtaGFuZGxlcnMvbW9kZS1oYW5kbGVyLmpzJztcbmltcG9ydCB7IFZpZXdIYW5kbGVyIH0gZnJvbSAnLi4vbW9kZS1oYW5kbGVycy92aWV3LWhhbmRsZXIuanMnO1xuaW1wb3J0IHsgTW9kaWZ5SGFuZGxlciB9IGZyb20gJy4uL21vZGUtaGFuZGxlcnMvbW9kaWZ5LWhhbmRsZXIuanMnO1xuaW1wb3J0IHsgRWxldmF0aW9uSGFuZGxlciB9IGZyb20gJy4uL21vZGUtaGFuZGxlcnMvZWxldmF0aW9uLWhhbmRsZXIuanMnO1xuaW1wb3J0IHsgU25hcHBhYmxlSGFuZGxlciB9IGZyb20gJy4uL21vZGUtaGFuZGxlcnMvc25hcHBhYmxlLWhhbmRsZXIuanMnO1xuaW1wb3J0IHsgVHJhbnNsYXRlSGFuZGxlciB9IGZyb20gJy4uL21vZGUtaGFuZGxlcnMvdHJhbnNsYXRlLWhhbmRsZXIuanMnO1xuaW1wb3J0IHsgRHVwbGljYXRlSGFuZGxlciB9IGZyb20gJy4uL21vZGUtaGFuZGxlcnMvZHVwbGljYXRlLWhhbmRsZXInO1xuaW1wb3J0IHsgUm90YXRlSGFuZGxlciB9IGZyb20gJy4uL21vZGUtaGFuZGxlcnMvcm90YXRlLWhhbmRsZXIuanMnO1xuaW1wb3J0IHsgU2NhbGVIYW5kbGVyIH0gZnJvbSAnLi4vbW9kZS1oYW5kbGVycy9zY2FsZS1oYW5kbGVyLmpzJztcbmltcG9ydCB7IERyYXdQb2ludEhhbmRsZXIgfSBmcm9tICcuLi9tb2RlLWhhbmRsZXJzL2RyYXctcG9pbnQtaGFuZGxlci5qcyc7XG5pbXBvcnQgeyBEcmF3TGluZVN0cmluZ0hhbmRsZXIgfSBmcm9tICcuLi9tb2RlLWhhbmRsZXJzL2RyYXctbGluZS1zdHJpbmctaGFuZGxlci5qcyc7XG5pbXBvcnQgeyBEcmF3UG9seWdvbkhhbmRsZXIgfSBmcm9tICcuLi9tb2RlLWhhbmRsZXJzL2RyYXctcG9seWdvbi1oYW5kbGVyLmpzJztcbmltcG9ydCB7IERyYXc5MERlZ3JlZVBvbHlnb25IYW5kbGVyIH0gZnJvbSAnLi4vbW9kZS1oYW5kbGVycy9kcmF3LTkwZGVncmVlLXBvbHlnb24taGFuZGxlci5qcyc7XG5pbXBvcnQgeyBEcmF3UmVjdGFuZ2xlSGFuZGxlciB9IGZyb20gJy4uL21vZGUtaGFuZGxlcnMvZHJhdy1yZWN0YW5nbGUtaGFuZGxlci5qcyc7XG5pbXBvcnQgeyBTcGxpdFBvbHlnb25IYW5kbGVyIH0gZnJvbSAnLi4vbW9kZS1oYW5kbGVycy9zcGxpdC1wb2x5Z29uLWhhbmRsZXIuanMnO1xuaW1wb3J0IHsgRHJhd1JlY3RhbmdsZVVzaW5nVGhyZWVQb2ludHNIYW5kbGVyIH0gZnJvbSAnLi4vbW9kZS1oYW5kbGVycy9kcmF3LXJlY3RhbmdsZS11c2luZy10aHJlZS1wb2ludHMtaGFuZGxlci5qcyc7XG5pbXBvcnQgeyBEcmF3Q2lyY2xlRnJvbUNlbnRlckhhbmRsZXIgfSBmcm9tICcuLi9tb2RlLWhhbmRsZXJzL2RyYXctY2lyY2xlLWZyb20tY2VudGVyLWhhbmRsZXIuanMnO1xuaW1wb3J0IHsgRHJhd0NpcmNsZUJ5Qm91bmRpbmdCb3hIYW5kbGVyIH0gZnJvbSAnLi4vbW9kZS1oYW5kbGVycy9kcmF3LWNpcmNsZS1ieS1ib3VuZGluZy1ib3gtaGFuZGxlci5qcyc7XG5pbXBvcnQgeyBEcmF3RWxsaXBzZUJ5Qm91bmRpbmdCb3hIYW5kbGVyIH0gZnJvbSAnLi4vbW9kZS1oYW5kbGVycy9kcmF3LWVsbGlwc2UtYnktYm91bmRpbmctYm94LWhhbmRsZXIuanMnO1xuaW1wb3J0IHsgRHJhd0VsbGlwc2VVc2luZ1RocmVlUG9pbnRzSGFuZGxlciB9IGZyb20gJy4uL21vZGUtaGFuZGxlcnMvZHJhdy1lbGxpcHNlLXVzaW5nLXRocmVlLXBvaW50cy1oYW5kbGVyLmpzJztcblxuaW1wb3J0IHR5cGUgeyBFZGl0QWN0aW9uIH0gZnJvbSAnLi4vbW9kZS1oYW5kbGVycy9tb2RlLWhhbmRsZXIuanMnO1xuaW1wb3J0IHR5cGUge1xuICBDbGlja0V2ZW50LFxuICBTdGFydERyYWdnaW5nRXZlbnQsXG4gIFN0b3BEcmFnZ2luZ0V2ZW50LFxuICBQb2ludGVyTW92ZUV2ZW50XG59IGZyb20gJy4uL2V2ZW50LXR5cGVzLmpzJztcbmltcG9ydCB7IEV4dHJ1ZGVIYW5kbGVyIH0gZnJvbSAnLi4vbW9kZS1oYW5kbGVycy9leHRydWRlLWhhbmRsZXIuanMnO1xuaW1wb3J0IEVkaXRhYmxlTGF5ZXIgZnJvbSAnLi9lZGl0YWJsZS1sYXllci5qcyc7XG5cbmNvbnN0IERFRkFVTFRfTElORV9DT0xPUiA9IFsweDAsIDB4MCwgMHgwLCAweGZmXTtcbmNvbnN0IERFRkFVTFRfRklMTF9DT0xPUiA9IFsweDAsIDB4MCwgMHgwLCAweDkwXTtcbmNvbnN0IERFRkFVTFRfU0VMRUNURURfTElORV9DT0xPUiA9IFsweDkwLCAweDkwLCAweDkwLCAweGZmXTtcbmNvbnN0IERFRkFVTFRfU0VMRUNURURfRklMTF9DT0xPUiA9IFsweDkwLCAweDkwLCAweDkwLCAweDkwXTtcbmNvbnN0IERFRkFVTFRfRURJVElOR19FWElTVElOR19QT0lOVF9DT0xPUiA9IFsweGMwLCAweDAsIDB4MCwgMHhmZl07XG5jb25zdCBERUZBVUxUX0VESVRJTkdfSU5URVJNRURJQVRFX1BPSU5UX0NPTE9SID0gWzB4MCwgMHgwLCAweDAsIDB4ODBdO1xuY29uc3QgREVGQVVMVF9FRElUSU5HX1NOQVBfUE9JTlRfQ09MT1IgPSBbMHg3YywgMHgwMCwgMHhjMCwgMHhmZl07XG5jb25zdCBERUZBVUxUX0VESVRJTkdfRVhJU1RJTkdfUE9JTlRfUkFESVVTID0gNTtcbmNvbnN0IERFRkFVTFRfRURJVElOR19JTlRFUk1FRElBVEVfUE9JTlRfUkFESVVTID0gMztcbmNvbnN0IERFRkFVTFRfRURJVElOR19TTkFQX1BPSU5UX1JBRElVUyA9IDc7XG5cbmZ1bmN0aW9uIGdldEVkaXRIYW5kbGVDb2xvcihoYW5kbGUpIHtcbiAgc3dpdGNoIChoYW5kbGUudHlwZSkge1xuICAgIGNhc2UgJ2V4aXN0aW5nJzpcbiAgICAgIHJldHVybiBERUZBVUxUX0VESVRJTkdfRVhJU1RJTkdfUE9JTlRfQ09MT1I7XG4gICAgY2FzZSAnc25hcCc6XG4gICAgICByZXR1cm4gREVGQVVMVF9FRElUSU5HX1NOQVBfUE9JTlRfQ09MT1I7XG4gICAgY2FzZSAnaW50ZXJtZWRpYXRlJzpcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIERFRkFVTFRfRURJVElOR19JTlRFUk1FRElBVEVfUE9JTlRfQ09MT1I7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0RWRpdEhhbmRsZVJhZGl1cyhoYW5kbGUpIHtcbiAgc3dpdGNoIChoYW5kbGUudHlwZSkge1xuICAgIGNhc2UgJ2V4aXN0aW5nJzpcbiAgICAgIHJldHVybiBERUZBVUxUX0VESVRJTkdfRVhJU1RJTkdfUE9JTlRfUkFESVVTO1xuICAgIGNhc2UgJ3NuYXAnOlxuICAgICAgcmV0dXJuIERFRkFVTFRfRURJVElOR19TTkFQX1BPSU5UX1JBRElVUztcbiAgICBjYXNlICdpbnRlcm1lZGlhdGUnOlxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gREVGQVVMVF9FRElUSU5HX0lOVEVSTUVESUFURV9QT0lOVF9SQURJVVM7XG4gIH1cbn1cblxuY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICBtb2RlOiAnbW9kaWZ5JyxcblxuICAvLyBFZGl0IGFuZCBpbnRlcmFjdGlvbiBldmVudHNcbiAgb25FZGl0OiAoKSA9PiB7fSxcblxuICBwaWNrYWJsZTogdHJ1ZSxcbiAgcGlja2luZ1JhZGl1czogMTAsXG4gIHBpY2tpbmdEZXB0aDogNSxcbiAgZnA2NDogZmFsc2UsXG4gIGZpbGxlZDogdHJ1ZSxcbiAgc3Ryb2tlZDogdHJ1ZSxcbiAgbGluZVdpZHRoU2NhbGU6IDEsXG4gIGxpbmVXaWR0aE1pblBpeGVsczogMSxcbiAgbGluZVdpZHRoTWF4UGl4ZWxzOiBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUixcbiAgbGluZVdpZHRoVW5pdHM6ICdtZXRlcnMnLFxuICBsaW5lSm9pbnRSb3VuZGVkOiBmYWxzZSxcbiAgbGluZU1pdGVyTGltaXQ6IDQsXG4gIHBvaW50UmFkaXVzU2NhbGU6IDEsXG4gIHBvaW50UmFkaXVzTWluUGl4ZWxzOiAyLFxuICBwb2ludFJhZGl1c01heFBpeGVsczogTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVIsXG4gIGxpbmVEYXNoSnVzdGlmaWVkOiBmYWxzZSxcbiAgZ2V0TGluZUNvbG9yOiAoZmVhdHVyZSwgaXNTZWxlY3RlZCwgbW9kZSkgPT5cbiAgICBpc1NlbGVjdGVkID8gREVGQVVMVF9TRUxFQ1RFRF9MSU5FX0NPTE9SIDogREVGQVVMVF9MSU5FX0NPTE9SLFxuICBnZXRGaWxsQ29sb3I6IChmZWF0dXJlLCBpc1NlbGVjdGVkLCBtb2RlKSA9PlxuICAgIGlzU2VsZWN0ZWQgPyBERUZBVUxUX1NFTEVDVEVEX0ZJTExfQ09MT1IgOiBERUZBVUxUX0ZJTExfQ09MT1IsXG4gIGdldFJhZGl1czogZiA9PlxuICAgIChmICYmIGYucHJvcGVydGllcyAmJiBmLnByb3BlcnRpZXMucmFkaXVzKSB8fCAoZiAmJiBmLnByb3BlcnRpZXMgJiYgZi5wcm9wZXJ0aWVzLnNpemUpIHx8IDEsXG4gIGdldExpbmVXaWR0aDogZiA9PiAoZiAmJiBmLnByb3BlcnRpZXMgJiYgZi5wcm9wZXJ0aWVzLmxpbmVXaWR0aCkgfHwgMSxcbiAgZ2V0TGluZURhc2hBcnJheTogKGZlYXR1cmUsIGlzU2VsZWN0ZWQsIG1vZGUpID0+XG4gICAgaXNTZWxlY3RlZCAmJiBtb2RlICE9PSAndmlldycgPyBbNywgNF0gOiBbMCwgMF0sXG5cbiAgLy8gVGVudGF0aXZlIGZlYXR1cmUgcmVuZGVyaW5nXG4gIGdldFRlbnRhdGl2ZUxpbmVEYXNoQXJyYXk6IChmLCBtb2RlKSA9PiBbNywgNF0sXG4gIGdldFRlbnRhdGl2ZUxpbmVDb2xvcjogKGYsIG1vZGUpID0+IERFRkFVTFRfU0VMRUNURURfTElORV9DT0xPUixcbiAgZ2V0VGVudGF0aXZlRmlsbENvbG9yOiAoZiwgbW9kZSkgPT4gREVGQVVMVF9TRUxFQ1RFRF9GSUxMX0NPTE9SLFxuICBnZXRUZW50YXRpdmVMaW5lV2lkdGg6IChmLCBtb2RlKSA9PiAoZiAmJiBmLnByb3BlcnRpZXMgJiYgZi5wcm9wZXJ0aWVzLmxpbmVXaWR0aCkgfHwgMSxcblxuICBlZGl0SGFuZGxlVHlwZTogJ3BvaW50JyxcbiAgZWRpdEhhbmRsZVBhcmFtZXRlcnM6IHt9LFxuICBlZGl0SGFuZGxlTGF5ZXJQcm9wczoge30sXG5cbiAgLy8gcG9pbnQgaGFuZGxlc1xuICBlZGl0SGFuZGxlUG9pbnRSYWRpdXNTY2FsZTogMSxcbiAgZWRpdEhhbmRsZVBvaW50T3V0bGluZTogZmFsc2UsXG4gIGVkaXRIYW5kbGVQb2ludFN0cm9rZVdpZHRoOiAxLFxuICBlZGl0SGFuZGxlUG9pbnRSYWRpdXNNaW5QaXhlbHM6IDQsXG4gIGVkaXRIYW5kbGVQb2ludFJhZGl1c01heFBpeGVsczogOCxcbiAgZ2V0RWRpdEhhbmRsZVBvaW50Q29sb3I6IGdldEVkaXRIYW5kbGVDb2xvcixcbiAgZ2V0RWRpdEhhbmRsZVBvaW50UmFkaXVzOiBnZXRFZGl0SGFuZGxlUmFkaXVzLFxuXG4gIC8vIGljb24gaGFuZGxlc1xuICBlZGl0SGFuZGxlSWNvbkF0bGFzOiBudWxsLFxuICBlZGl0SGFuZGxlSWNvbk1hcHBpbmc6IG51bGwsXG4gIGVkaXRIYW5kbGVJY29uU2l6ZVNjYWxlOiAxLFxuICBnZXRFZGl0SGFuZGxlSWNvbjogaGFuZGxlID0+IGhhbmRsZS50eXBlLFxuICBnZXRFZGl0SGFuZGxlSWNvblNpemU6IDEwLFxuICBnZXRFZGl0SGFuZGxlSWNvbkNvbG9yOiBnZXRFZGl0SGFuZGxlQ29sb3IsXG4gIGdldEVkaXRIYW5kbGVJY29uQW5nbGU6IDAsXG5cbiAgLy8gbWlzY1xuICBiaWxsYm9hcmQ6IHRydWUsXG5cbiAgLy8gTW9kZSBoYW5kbGVyc1xuICBtb2RlSGFuZGxlcnM6IHtcbiAgICB2aWV3OiBuZXcgVmlld0hhbmRsZXIoKSxcbiAgICBtb2RpZnk6IG5ldyBNb2RpZnlIYW5kbGVyKCksXG4gICAgZWxldmF0aW9uOiBuZXcgRWxldmF0aW9uSGFuZGxlcigpLFxuICAgIGV4dHJ1ZGU6IG5ldyBFeHRydWRlSGFuZGxlcigpLFxuICAgIHJvdGF0ZTogbmV3IFJvdGF0ZUhhbmRsZXIoKSxcbiAgICB0cmFuc2xhdGU6IG5ldyBTbmFwcGFibGVIYW5kbGVyKG5ldyBUcmFuc2xhdGVIYW5kbGVyKCkpLFxuICAgIGR1cGxpY2F0ZTogbmV3IER1cGxpY2F0ZUhhbmRsZXIoKSxcbiAgICBzY2FsZTogbmV3IFNjYWxlSGFuZGxlcigpLFxuICAgIGRyYXdQb2ludDogbmV3IERyYXdQb2ludEhhbmRsZXIoKSxcbiAgICBkcmF3TGluZVN0cmluZzogbmV3IERyYXdMaW5lU3RyaW5nSGFuZGxlcigpLFxuICAgIGRyYXdQb2x5Z29uOiBuZXcgRHJhd1BvbHlnb25IYW5kbGVyKCksXG4gICAgZHJhdzkwRGVncmVlUG9seWdvbjogbmV3IERyYXc5MERlZ3JlZVBvbHlnb25IYW5kbGVyKCksXG4gICAgc3BsaXQ6IG5ldyBTcGxpdFBvbHlnb25IYW5kbGVyKCksXG4gICAgZHJhd1JlY3RhbmdsZTogbmV3IERyYXdSZWN0YW5nbGVIYW5kbGVyKCksXG4gICAgZHJhd1JlY3RhbmdsZVVzaW5nM1BvaW50czogbmV3IERyYXdSZWN0YW5nbGVVc2luZ1RocmVlUG9pbnRzSGFuZGxlcigpLFxuICAgIGRyYXdDaXJjbGVGcm9tQ2VudGVyOiBuZXcgRHJhd0NpcmNsZUZyb21DZW50ZXJIYW5kbGVyKCksXG4gICAgZHJhd0NpcmNsZUJ5Qm91bmRpbmdCb3g6IG5ldyBEcmF3Q2lyY2xlQnlCb3VuZGluZ0JveEhhbmRsZXIoKSxcbiAgICBkcmF3RWxsaXBzZUJ5Qm91bmRpbmdCb3g6IG5ldyBEcmF3RWxsaXBzZUJ5Qm91bmRpbmdCb3hIYW5kbGVyKCksXG4gICAgZHJhd0VsbGlwc2VVc2luZzNQb2ludHM6IG5ldyBEcmF3RWxsaXBzZVVzaW5nVGhyZWVQb2ludHNIYW5kbGVyKClcbiAgfVxufTtcblxudHlwZSBQcm9wcyA9IHtcbiAgbW9kZTogc3RyaW5nLFxuICBtb2RlSGFuZGxlcnM6IHsgW21vZGU6IHN0cmluZ106IE1vZGVIYW5kbGVyIH0sXG4gIG9uRWRpdDogRWRpdEFjdGlvbiA9PiB2b2lkLFxuICAvLyBUT0RPOiB0eXBlIHRoZSByZXN0XG4gIFtzdHJpbmddOiBhbnlcbn07XG5cbi8vIHR5cGUgU3RhdGUgPSB7XG4vLyAgIG1vZGVIYW5kbGVyOiBFZGl0YWJsZUZlYXR1cmVDb2xsZWN0aW9uLFxuLy8gICB0ZW50YXRpdmVGZWF0dXJlOiA/RmVhdHVyZSxcbi8vICAgZWRpdEhhbmRsZXM6IGFueVtdLFxuLy8gICBzZWxlY3RlZEZlYXR1cmVzOiBGZWF0dXJlW11cbi8vIH07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVkaXRhYmxlR2VvSnNvbkxheWVyIGV4dGVuZHMgRWRpdGFibGVMYXllciB7XG4gIC8vIHN0YXRlOiBTdGF0ZTtcbiAgLy8gcHJvcHM6IFByb3BzO1xuICAvLyBzZXRTdGF0ZTogKCRTaGFwZTxTdGF0ZT4pID0+IHZvaWQ7XG5cbiAgcmVuZGVyTGF5ZXJzKCkge1xuICAgIGNvbnN0IHN1YkxheWVyUHJvcHMgPSB0aGlzLmdldFN1YkxheWVyUHJvcHMoe1xuICAgICAgaWQ6ICdnZW9qc29uJyxcblxuICAgICAgLy8gUHJveHkgbW9zdCBHZW9Kc29uTGF5ZXIgcHJvcHMgYXMtaXNcbiAgICAgIGRhdGE6IHRoaXMucHJvcHMuZGF0YSxcbiAgICAgIGZwNjQ6IHRoaXMucHJvcHMuZnA2NCxcbiAgICAgIGZpbGxlZDogdGhpcy5wcm9wcy5maWxsZWQsXG4gICAgICBzdHJva2VkOiB0aGlzLnByb3BzLnN0cm9rZWQsXG4gICAgICBsaW5lV2lkdGhTY2FsZTogdGhpcy5wcm9wcy5saW5lV2lkdGhTY2FsZSxcbiAgICAgIGxpbmVXaWR0aE1pblBpeGVsczogdGhpcy5wcm9wcy5saW5lV2lkdGhNaW5QaXhlbHMsXG4gICAgICBsaW5lV2lkdGhNYXhQaXhlbHM6IHRoaXMucHJvcHMubGluZVdpZHRoTWF4UGl4ZWxzLFxuICAgICAgbGluZVdpZHRoVW5pdHM6IHRoaXMucHJvcHMubGluZVdpZHRoVW5pdHMsXG4gICAgICBsaW5lSm9pbnRSb3VuZGVkOiB0aGlzLnByb3BzLmxpbmVKb2ludFJvdW5kZWQsXG4gICAgICBsaW5lTWl0ZXJMaW1pdDogdGhpcy5wcm9wcy5saW5lTWl0ZXJMaW1pdCxcbiAgICAgIHBvaW50UmFkaXVzU2NhbGU6IHRoaXMucHJvcHMucG9pbnRSYWRpdXNTY2FsZSxcbiAgICAgIHBvaW50UmFkaXVzTWluUGl4ZWxzOiB0aGlzLnByb3BzLnBvaW50UmFkaXVzTWluUGl4ZWxzLFxuICAgICAgcG9pbnRSYWRpdXNNYXhQaXhlbHM6IHRoaXMucHJvcHMucG9pbnRSYWRpdXNNYXhQaXhlbHMsXG4gICAgICBsaW5lRGFzaEp1c3RpZmllZDogdGhpcy5wcm9wcy5saW5lRGFzaEp1c3RpZmllZCxcbiAgICAgIGdldExpbmVDb2xvcjogdGhpcy5zZWxlY3Rpb25Bd2FyZUFjY2Vzc29yKHRoaXMucHJvcHMuZ2V0TGluZUNvbG9yKSxcbiAgICAgIGdldEZpbGxDb2xvcjogdGhpcy5zZWxlY3Rpb25Bd2FyZUFjY2Vzc29yKHRoaXMucHJvcHMuZ2V0RmlsbENvbG9yKSxcbiAgICAgIGdldFJhZGl1czogdGhpcy5zZWxlY3Rpb25Bd2FyZUFjY2Vzc29yKHRoaXMucHJvcHMuZ2V0UmFkaXVzKSxcbiAgICAgIGdldExpbmVXaWR0aDogdGhpcy5zZWxlY3Rpb25Bd2FyZUFjY2Vzc29yKHRoaXMucHJvcHMuZ2V0TGluZVdpZHRoKSxcbiAgICAgIGdldExpbmVEYXNoQXJyYXk6IHRoaXMuc2VsZWN0aW9uQXdhcmVBY2Nlc3Nvcih0aGlzLnByb3BzLmdldExpbmVEYXNoQXJyYXkpLFxuXG4gICAgICBfc3ViTGF5ZXJQcm9wczoge1xuICAgICAgICAnbGluZS1zdHJpbmdzJzoge1xuICAgICAgICAgIGJpbGxib2FyZDogdGhpcy5wcm9wcy5iaWxsYm9hcmRcbiAgICAgICAgfSxcbiAgICAgICAgJ3BvbHlnb25zLXN0cm9rZSc6IHtcbiAgICAgICAgICBiaWxsYm9hcmQ6IHRoaXMucHJvcHMuYmlsbGJvYXJkXG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIHVwZGF0ZVRyaWdnZXJzOiB7XG4gICAgICAgIGdldExpbmVDb2xvcjogW3RoaXMucHJvcHMuc2VsZWN0ZWRGZWF0dXJlSW5kZXhlcywgdGhpcy5wcm9wcy5tb2RlXSxcbiAgICAgICAgZ2V0RmlsbENvbG9yOiBbdGhpcy5wcm9wcy5zZWxlY3RlZEZlYXR1cmVJbmRleGVzLCB0aGlzLnByb3BzLm1vZGVdLFxuICAgICAgICBnZXRSYWRpdXM6IFt0aGlzLnByb3BzLnNlbGVjdGVkRmVhdHVyZUluZGV4ZXMsIHRoaXMucHJvcHMubW9kZV0sXG4gICAgICAgIGdldExpbmVXaWR0aDogW3RoaXMucHJvcHMuc2VsZWN0ZWRGZWF0dXJlSW5kZXhlcywgdGhpcy5wcm9wcy5tb2RlXSxcbiAgICAgICAgZ2V0TGluZURhc2hBcnJheTogW3RoaXMucHJvcHMuc2VsZWN0ZWRGZWF0dXJlSW5kZXhlcywgdGhpcy5wcm9wcy5tb2RlXVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgbGV0IGxheWVyczogYW55ID0gW25ldyBHZW9Kc29uTGF5ZXIoc3ViTGF5ZXJQcm9wcyldO1xuXG4gICAgbGF5ZXJzID0gbGF5ZXJzLmNvbmNhdCh0aGlzLmNyZWF0ZVRlbnRhdGl2ZUxheWVycygpKTtcbiAgICBsYXllcnMgPSBsYXllcnMuY29uY2F0KHRoaXMuY3JlYXRlRWRpdEhhbmRsZUxheWVycygpKTtcblxuICAgIHJldHVybiBsYXllcnM7XG4gIH1cblxuICBpbml0aWFsaXplU3RhdGUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZVN0YXRlKCk7XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHNlbGVjdGVkRmVhdHVyZXM6IFtdLFxuICAgICAgZWRpdEhhbmRsZXM6IFtdXG4gICAgfSk7XG4gIH1cblxuICAvLyBUT0RPOiBmaWd1cmUgb3V0IGhvdyB0byBwcm9wZXJseSB1cGRhdGUgc3RhdGUgZnJvbSBhbiBvdXRzaWRlIGV2ZW50IGhhbmRsZXJcbiAgc2hvdWxkVXBkYXRlU3RhdGUoeyBwcm9wcywgb2xkUHJvcHMsIGNvbnRleHQsIG9sZENvbnRleHQsIGNoYW5nZUZsYWdzIH06IE9iamVjdCkge1xuICAgIGlmIChjaGFuZ2VGbGFncy5zdGF0ZUNoYW5nZWQpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHVwZGF0ZVN0YXRlKHtcbiAgICBwcm9wcyxcbiAgICBvbGRQcm9wcyxcbiAgICBjaGFuZ2VGbGFnc1xuICB9OiB7XG4gICAgcHJvcHM6IFByb3BzLFxuICAgIG9sZFByb3BzOiBQcm9wcyxcbiAgICBjaGFuZ2VGbGFnczogYW55XG4gIH0pIHtcbiAgICBzdXBlci51cGRhdGVTdGF0ZSh7IHByb3BzLCBjaGFuZ2VGbGFncyB9KTtcblxuICAgIGxldCBtb2RlSGFuZGxlcjogTW9kZUhhbmRsZXIgPSB0aGlzLnN0YXRlLm1vZGVIYW5kbGVyO1xuICAgIGlmIChjaGFuZ2VGbGFncy5wcm9wc09yRGF0YUNoYW5nZWQpIHtcbiAgICAgIGlmIChwcm9wcy5tb2RlSGFuZGxlcnMgIT09IG9sZFByb3BzLm1vZGVIYW5kbGVycyB8fCBwcm9wcy5tb2RlICE9PSBvbGRQcm9wcy5tb2RlKSB7XG4gICAgICAgIG1vZGVIYW5kbGVyID0gcHJvcHMubW9kZUhhbmRsZXJzW3Byb3BzLm1vZGVdO1xuXG4gICAgICAgIGlmICghbW9kZUhhbmRsZXIpIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oYE5vIGhhbmRsZXIgY29uZmlndXJlZCBmb3IgbW9kZSAke3Byb3BzLm1vZGV9YCk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZSxuby11bmRlZlxuICAgICAgICAgIC8vIFVzZSBkZWZhdWx0IG1vZGUgaGFuZGxlclxuICAgICAgICAgIG1vZGVIYW5kbGVyID0gbmV3IE1vZGVIYW5kbGVyKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobW9kZUhhbmRsZXIgIT09IHRoaXMuc3RhdGUubW9kZUhhbmRsZXIpIHtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgbW9kZUhhbmRsZXIgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBtb2RlSGFuZGxlci5zZXRGZWF0dXJlQ29sbGVjdGlvbihwcm9wcy5kYXRhKTtcbiAgICAgIH0gZWxzZSBpZiAoY2hhbmdlRmxhZ3MuZGF0YUNoYW5nZWQpIHtcbiAgICAgICAgbW9kZUhhbmRsZXIuc2V0RmVhdHVyZUNvbGxlY3Rpb24ocHJvcHMuZGF0YSk7XG4gICAgICB9XG5cbiAgICAgIG1vZGVIYW5kbGVyLnNldE1vZGVDb25maWcocHJvcHMubW9kZUNvbmZpZyk7XG4gICAgICBtb2RlSGFuZGxlci5zZXRTZWxlY3RlZEZlYXR1cmVJbmRleGVzKHByb3BzLnNlbGVjdGVkRmVhdHVyZUluZGV4ZXMpO1xuICAgICAgdGhpcy51cGRhdGVUZW50YXRpdmVGZWF0dXJlKCk7XG4gICAgICB0aGlzLnVwZGF0ZUVkaXRIYW5kbGVzKCk7XG4gICAgfVxuXG4gICAgbGV0IHNlbGVjdGVkRmVhdHVyZXMgPSBbXTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShwcm9wcy5zZWxlY3RlZEZlYXR1cmVJbmRleGVzKSkge1xuICAgICAgLy8gVE9ETzogbmVlZHMgaW1wcm92ZWQgdGVzdGluZywgaS5lLiBjaGVja2luZyBmb3IgZHVwbGljYXRlcywgTmFOcywgb3V0IG9mIHJhbmdlIG51bWJlcnMsIC4uLlxuICAgICAgc2VsZWN0ZWRGZWF0dXJlcyA9IHByb3BzLnNlbGVjdGVkRmVhdHVyZUluZGV4ZXMubWFwKGVsZW0gPT4gcHJvcHMuZGF0YS5mZWF0dXJlc1tlbGVtXSk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7IHNlbGVjdGVkRmVhdHVyZXMgfSk7XG4gIH1cblxuICBzZWxlY3Rpb25Bd2FyZUFjY2Vzc29yKGFjY2Vzc29yOiBhbnkpIHtcbiAgICBpZiAodHlwZW9mIGFjY2Vzc29yICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gYWNjZXNzb3I7XG4gICAgfVxuICAgIHJldHVybiAoZmVhdHVyZTogT2JqZWN0KSA9PiBhY2Nlc3NvcihmZWF0dXJlLCB0aGlzLmlzRmVhdHVyZVNlbGVjdGVkKGZlYXR1cmUpLCB0aGlzLnByb3BzLm1vZGUpO1xuICB9XG5cbiAgaXNGZWF0dXJlU2VsZWN0ZWQoZmVhdHVyZTogT2JqZWN0KSB7XG4gICAgaWYgKCF0aGlzLnByb3BzLmRhdGEgfHwgIXRoaXMucHJvcHMuc2VsZWN0ZWRGZWF0dXJlSW5kZXhlcykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoIXRoaXMucHJvcHMuc2VsZWN0ZWRGZWF0dXJlSW5kZXhlcy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY29uc3QgZmVhdHVyZUluZGV4ID0gdGhpcy5wcm9wcy5kYXRhLmZlYXR1cmVzLmluZGV4T2YoZmVhdHVyZSk7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMuc2VsZWN0ZWRGZWF0dXJlSW5kZXhlcy5pbmNsdWRlcyhmZWF0dXJlSW5kZXgpO1xuICB9XG5cbiAgZ2V0UGlja2luZ0luZm8oeyBpbmZvLCBzb3VyY2VMYXllciB9OiBPYmplY3QpIHtcbiAgICBpZiAoc291cmNlTGF5ZXIuaWQuZW5kc1dpdGgoJ2VkaXRIYW5kbGVzJykpIHtcbiAgICAgIC8vIElmIHVzZXIgaXMgcGlja2luZyBhbiBlZGl0aW5nIGhhbmRsZSwgYWRkIGFkZGl0aW9uYWwgZGF0YSB0byB0aGUgaW5mb1xuICAgICAgaW5mby5pc0VkaXRpbmdIYW5kbGUgPSB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBpbmZvO1xuICB9XG5cbiAgY3JlYXRlRWRpdEhhbmRsZUxheWVycygpIHtcbiAgICBpZiAoIXRoaXMuc3RhdGUuZWRpdEhhbmRsZXMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgY29uc3Qgc2hhcmVkUHJvcHMgPSB7XG4gICAgICBpZDogJ2VkaXRIYW5kbGVzJyxcbiAgICAgIGRhdGE6IHRoaXMuc3RhdGUuZWRpdEhhbmRsZXMsXG4gICAgICBmcDY0OiB0aGlzLnByb3BzLmZwNjQsXG5cbiAgICAgIHBhcmFtZXRlcnM6IHRoaXMucHJvcHMuZWRpdEhhbmRsZVBhcmFtZXRlcnMsXG4gICAgICAuLi50aGlzLnByb3BzLmVkaXRIYW5kbGVMYXllclByb3BzXG4gICAgfTtcblxuICAgIGxldCBsYXllcjtcblxuICAgIHN3aXRjaCAodGhpcy5wcm9wcy5lZGl0SGFuZGxlVHlwZSkge1xuICAgICAgY2FzZSAnaWNvbic6XG4gICAgICAgIGNvbnN0IEVkaXRIYW5kbGVJY29uTGF5ZXIgPSB0aGlzLmdldFN1YkxheWVyQ2xhc3MoJ2VkaXRIYW5kbGVzJywgSWNvbkxheWVyKTtcblxuICAgICAgICBsYXllciA9IG5ldyBFZGl0SGFuZGxlSWNvbkxheWVyKFxuICAgICAgICAgIHRoaXMuZ2V0U3ViTGF5ZXJQcm9wcyh7XG4gICAgICAgICAgICAuLi5zaGFyZWRQcm9wcyxcbiAgICAgICAgICAgIGljb25BdGxhczogdGhpcy5wcm9wcy5lZGl0SGFuZGxlSWNvbkF0bGFzLFxuICAgICAgICAgICAgaWNvbk1hcHBpbmc6IHRoaXMucHJvcHMuZWRpdEhhbmRsZUljb25NYXBwaW5nLFxuICAgICAgICAgICAgc2l6ZVNjYWxlOiB0aGlzLnByb3BzLmVkaXRIYW5kbGVJY29uU2l6ZVNjYWxlLFxuICAgICAgICAgICAgZ2V0SWNvbjogdGhpcy5wcm9wcy5nZXRFZGl0SGFuZGxlSWNvbixcbiAgICAgICAgICAgIGdldFNpemU6IHRoaXMucHJvcHMuZ2V0RWRpdEhhbmRsZUljb25TaXplLFxuICAgICAgICAgICAgZ2V0Q29sb3I6IHRoaXMucHJvcHMuZ2V0RWRpdEhhbmRsZUljb25Db2xvcixcbiAgICAgICAgICAgIGdldEFuZ2xlOiB0aGlzLnByb3BzLmdldEVkaXRIYW5kbGVJY29uQW5nbGUsXG5cbiAgICAgICAgICAgIGdldFBvc2l0aW9uOiBkID0+IGQucG9zaXRpb25cbiAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAncG9pbnQnOlxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgY29uc3QgRWRpdEhhbmRsZVBvaW50TGF5ZXIgPSB0aGlzLmdldFN1YkxheWVyQ2xhc3MoJ2VkaXRIYW5kbGVzJywgU2NhdHRlcnBsb3RMYXllcik7XG5cbiAgICAgICAgbGF5ZXIgPSBuZXcgRWRpdEhhbmRsZVBvaW50TGF5ZXIoXG4gICAgICAgICAgdGhpcy5nZXRTdWJMYXllclByb3BzKHtcbiAgICAgICAgICAgIC4uLnNoYXJlZFByb3BzLFxuXG4gICAgICAgICAgICAvLyBQcm94eSBlZGl0aW5nIHBvaW50IHByb3BzXG4gICAgICAgICAgICByYWRpdXNTY2FsZTogdGhpcy5wcm9wcy5lZGl0SGFuZGxlUG9pbnRSYWRpdXNTY2FsZSxcbiAgICAgICAgICAgIG91dGxpbmU6IHRoaXMucHJvcHMuZWRpdEhhbmRsZVBvaW50T3V0bGluZSxcbiAgICAgICAgICAgIHN0cm9rZVdpZHRoOiB0aGlzLnByb3BzLmVkaXRIYW5kbGVQb2ludFN0cm9rZVdpZHRoLFxuICAgICAgICAgICAgcmFkaXVzTWluUGl4ZWxzOiB0aGlzLnByb3BzLmVkaXRIYW5kbGVQb2ludFJhZGl1c01pblBpeGVscyxcbiAgICAgICAgICAgIHJhZGl1c01heFBpeGVsczogdGhpcy5wcm9wcy5lZGl0SGFuZGxlUG9pbnRSYWRpdXNNYXhQaXhlbHMsXG4gICAgICAgICAgICBnZXRSYWRpdXM6IHRoaXMucHJvcHMuZ2V0RWRpdEhhbmRsZVBvaW50UmFkaXVzLFxuICAgICAgICAgICAgZ2V0Q29sb3I6IHRoaXMucHJvcHMuZ2V0RWRpdEhhbmRsZVBvaW50Q29sb3JcbiAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICByZXR1cm4gW2xheWVyXTtcbiAgfVxuXG4gIGNyZWF0ZVRlbnRhdGl2ZUxheWVycygpIHtcbiAgICBpZiAoIXRoaXMuc3RhdGUudGVudGF0aXZlRmVhdHVyZSkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGNvbnN0IGxheWVyID0gbmV3IEdlb0pzb25MYXllcihcbiAgICAgIHRoaXMuZ2V0U3ViTGF5ZXJQcm9wcyh7XG4gICAgICAgIGlkOiAndGVudGF0aXZlJyxcbiAgICAgICAgZGF0YTogdGhpcy5zdGF0ZS50ZW50YXRpdmVGZWF0dXJlLFxuICAgICAgICBmcDY0OiB0aGlzLnByb3BzLmZwNjQsXG4gICAgICAgIHBpY2thYmxlOiBmYWxzZSxcbiAgICAgICAgc3Ryb2tlZDogdHJ1ZSxcbiAgICAgICAgYXV0b0hpZ2hsaWdodDogZmFsc2UsXG4gICAgICAgIGxpbmVXaWR0aFNjYWxlOiB0aGlzLnByb3BzLmxpbmVXaWR0aFNjYWxlLFxuICAgICAgICBsaW5lV2lkdGhNaW5QaXhlbHM6IHRoaXMucHJvcHMubGluZVdpZHRoTWluUGl4ZWxzLFxuICAgICAgICBsaW5lV2lkdGhNYXhQaXhlbHM6IHRoaXMucHJvcHMubGluZVdpZHRoTWF4UGl4ZWxzLFxuICAgICAgICBsaW5lV2lkdGhVbml0czogdGhpcy5wcm9wcy5saW5lV2lkdGhVbml0cyxcbiAgICAgICAgbGluZUpvaW50Um91bmRlZDogdGhpcy5wcm9wcy5saW5lSm9pbnRSb3VuZGVkLFxuICAgICAgICBsaW5lTWl0ZXJMaW1pdDogdGhpcy5wcm9wcy5saW5lTWl0ZXJMaW1pdCxcbiAgICAgICAgcG9pbnRSYWRpdXNTY2FsZTogdGhpcy5wcm9wcy5lZGl0SGFuZGxlUG9pbnRSYWRpdXNTY2FsZSxcbiAgICAgICAgb3V0bGluZTogdGhpcy5wcm9wcy5lZGl0SGFuZGxlUG9pbnRPdXRsaW5lLFxuICAgICAgICBzdHJva2VXaWR0aDogdGhpcy5wcm9wcy5lZGl0SGFuZGxlUG9pbnRTdHJva2VXaWR0aCxcbiAgICAgICAgcG9pbnRSYWRpdXNNaW5QaXhlbHM6IHRoaXMucHJvcHMuZWRpdEhhbmRsZVBvaW50UmFkaXVzTWluUGl4ZWxzLFxuICAgICAgICBwb2ludFJhZGl1c01heFBpeGVsczogdGhpcy5wcm9wcy5lZGl0SGFuZGxlUG9pbnRSYWRpdXNNYXhQaXhlbHMsXG4gICAgICAgIGdldFJhZGl1czogdGhpcy5wcm9wcy5nZXRFZGl0SGFuZGxlUG9pbnRSYWRpdXMsXG4gICAgICAgIGdldExpbmVDb2xvcjogZmVhdHVyZSA9PiB0aGlzLnByb3BzLmdldFRlbnRhdGl2ZUxpbmVDb2xvcihmZWF0dXJlLCB0aGlzLnByb3BzLm1vZGUpLFxuICAgICAgICBnZXRMaW5lV2lkdGg6IGZlYXR1cmUgPT4gdGhpcy5wcm9wcy5nZXRUZW50YXRpdmVMaW5lV2lkdGgoZmVhdHVyZSwgdGhpcy5wcm9wcy5tb2RlKSxcbiAgICAgICAgZ2V0RmlsbENvbG9yOiBmZWF0dXJlID0+IHRoaXMucHJvcHMuZ2V0VGVudGF0aXZlRmlsbENvbG9yKGZlYXR1cmUsIHRoaXMucHJvcHMubW9kZSksXG4gICAgICAgIGdldExpbmVEYXNoQXJyYXk6IGZlYXR1cmUgPT5cbiAgICAgICAgICB0aGlzLnByb3BzLmdldFRlbnRhdGl2ZUxpbmVEYXNoQXJyYXkoXG4gICAgICAgICAgICBmZWF0dXJlLFxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5zZWxlY3RlZEZlYXR1cmVzWzBdLFxuICAgICAgICAgICAgdGhpcy5wcm9wcy5tb2RlXG4gICAgICAgICAgKVxuICAgICAgfSlcbiAgICApO1xuXG4gICAgcmV0dXJuIFtsYXllcl07XG4gIH1cblxuICB1cGRhdGVUZW50YXRpdmVGZWF0dXJlKCkge1xuICAgIGNvbnN0IHRlbnRhdGl2ZUZlYXR1cmUgPSB0aGlzLnN0YXRlLm1vZGVIYW5kbGVyLmdldFRlbnRhdGl2ZUZlYXR1cmUoKTtcbiAgICBpZiAodGVudGF0aXZlRmVhdHVyZSAhPT0gdGhpcy5zdGF0ZS50ZW50YXRpdmVGZWF0dXJlKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgdGVudGF0aXZlRmVhdHVyZSB9KTtcbiAgICAgIHRoaXMuc2V0TGF5ZXJOZWVkc1VwZGF0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZUVkaXRIYW5kbGVzKHBpY2tzPzogQXJyYXk8T2JqZWN0PiwgZ3JvdW5kQ29vcmRzPzogUG9zaXRpb24pIHtcbiAgICBjb25zdCBlZGl0SGFuZGxlcyA9IHRoaXMuc3RhdGUubW9kZUhhbmRsZXIuZ2V0RWRpdEhhbmRsZXMocGlja3MsIGdyb3VuZENvb3Jkcyk7XG4gICAgaWYgKGVkaXRIYW5kbGVzICE9PSB0aGlzLnN0YXRlLmVkaXRIYW5kbGVzKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgZWRpdEhhbmRsZXMgfSk7XG4gICAgICB0aGlzLnNldExheWVyTmVlZHNVcGRhdGUoKTtcbiAgICB9XG4gIH1cblxuICBvbkxheWVyQ2xpY2soZXZlbnQ6IENsaWNrRXZlbnQpIHtcbiAgICBjb25zdCBlZGl0QWN0aW9uID0gdGhpcy5zdGF0ZS5tb2RlSGFuZGxlci5oYW5kbGVDbGljayhldmVudCk7XG4gICAgdGhpcy51cGRhdGVUZW50YXRpdmVGZWF0dXJlKCk7XG4gICAgdGhpcy51cGRhdGVFZGl0SGFuZGxlcygpO1xuXG4gICAgaWYgKGVkaXRBY3Rpb24pIHtcbiAgICAgIHRoaXMucHJvcHMub25FZGl0KGVkaXRBY3Rpb24pO1xuICAgIH1cbiAgfVxuXG4gIG9uU3RhcnREcmFnZ2luZyhldmVudDogU3RhcnREcmFnZ2luZ0V2ZW50KSB7XG4gICAgY29uc3QgZWRpdEFjdGlvbiA9IHRoaXMuc3RhdGUubW9kZUhhbmRsZXIuaGFuZGxlU3RhcnREcmFnZ2luZyhldmVudCk7XG4gICAgdGhpcy51cGRhdGVUZW50YXRpdmVGZWF0dXJlKCk7XG4gICAgdGhpcy51cGRhdGVFZGl0SGFuZGxlcygpO1xuXG4gICAgaWYgKGVkaXRBY3Rpb24pIHtcbiAgICAgIHRoaXMucHJvcHMub25FZGl0KGVkaXRBY3Rpb24pO1xuICAgIH1cbiAgfVxuXG4gIG9uU3RvcERyYWdnaW5nKGV2ZW50OiBTdG9wRHJhZ2dpbmdFdmVudCkge1xuICAgIGNvbnN0IGVkaXRBY3Rpb24gPSB0aGlzLnN0YXRlLm1vZGVIYW5kbGVyLmhhbmRsZVN0b3BEcmFnZ2luZyhldmVudCk7XG4gICAgdGhpcy51cGRhdGVUZW50YXRpdmVGZWF0dXJlKCk7XG4gICAgdGhpcy51cGRhdGVFZGl0SGFuZGxlcygpO1xuXG4gICAgaWYgKGVkaXRBY3Rpb24pIHtcbiAgICAgIHRoaXMucHJvcHMub25FZGl0KGVkaXRBY3Rpb24pO1xuICAgIH1cbiAgfVxuXG4gIG9uUG9pbnRlck1vdmUoZXZlbnQ6IFBvaW50ZXJNb3ZlRXZlbnQpIHtcbiAgICBjb25zdCB7IGdyb3VuZENvb3JkcywgcGlja3MsIHNvdXJjZUV2ZW50IH0gPSBldmVudDtcblxuICAgIGNvbnN0IHsgZWRpdEFjdGlvbiwgY2FuY2VsTWFwUGFuIH0gPSB0aGlzLnN0YXRlLm1vZGVIYW5kbGVyLmhhbmRsZVBvaW50ZXJNb3ZlKGV2ZW50KTtcbiAgICB0aGlzLnVwZGF0ZVRlbnRhdGl2ZUZlYXR1cmUoKTtcbiAgICB0aGlzLnVwZGF0ZUVkaXRIYW5kbGVzKHBpY2tzLCBncm91bmRDb29yZHMpO1xuXG4gICAgaWYgKGNhbmNlbE1hcFBhbikge1xuICAgICAgLy8gVE9ETzogZmluZCBhIGxlc3MgaGFja3kgd2F5IHRvIHByZXZlbnQgbWFwIHBhbm5pbmdcbiAgICAgIC8vIFN0b3AgcHJvcGFnYXRpb24gdG8gcHJldmVudCBtYXAgcGFubmluZyB3aGlsZSBkcmFnZ2luZyBhbiBlZGl0IGhhbmRsZVxuICAgICAgc291cmNlRXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfVxuXG4gICAgaWYgKGVkaXRBY3Rpb24pIHtcbiAgICAgIHRoaXMucHJvcHMub25FZGl0KGVkaXRBY3Rpb24pO1xuICAgIH1cbiAgfVxuXG4gIGdldEN1cnNvcih7IGlzRHJhZ2dpbmcgfTogeyBpc0RyYWdnaW5nOiBib29sZWFuIH0pIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5tb2RlSGFuZGxlci5nZXRDdXJzb3IoeyBpc0RyYWdnaW5nIH0pO1xuICB9XG59XG5cbkVkaXRhYmxlR2VvSnNvbkxheWVyLmxheWVyTmFtZSA9ICdFZGl0YWJsZUdlb0pzb25MYXllcic7XG5FZGl0YWJsZUdlb0pzb25MYXllci5kZWZhdWx0UHJvcHMgPSBkZWZhdWx0UHJvcHM7XG4iXX0=