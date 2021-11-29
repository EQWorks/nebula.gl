"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _keplerOutdatedDeck = require("kepler-outdated-deck.gl-layers");

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

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
class EditableGeoJsonLayer extends _editableLayer.default {
  // state: State;
  // props: Props;
  // setState: ($Shape<State>) => void;
  renderLayers() {
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
    var layers = [new _keplerOutdatedDeck.GeoJsonLayer(subLayerProps)];
    layers = layers.concat(this.createTentativeLayers());
    layers = layers.concat(this.createEditHandleLayers());
    return layers;
  }

  initializeState() {
    super.initializeState();
    this.setState({
      selectedFeatures: [],
      editHandles: []
    });
  } // TODO: figure out how to properly update state from an outside event handler


  shouldUpdateState(_ref) {
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

  updateState(_ref2) {
    var props = _ref2.props,
        oldProps = _ref2.oldProps,
        changeFlags = _ref2.changeFlags;
    super.updateState({
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

  selectionAwareAccessor(accessor) {
    var _this = this;

    if (typeof accessor !== 'function') {
      return accessor;
    }

    return function (feature) {
      return accessor(feature, _this.isFeatureSelected(feature), _this.props.mode);
    };
  }

  isFeatureSelected(feature) {
    if (!this.props.data || !this.props.selectedFeatureIndexes) {
      return false;
    }

    if (!this.props.selectedFeatureIndexes.length) {
      return false;
    }

    var featureIndex = this.props.data.features.indexOf(feature);
    return this.props.selectedFeatureIndexes.includes(featureIndex);
  }

  getPickingInfo(_ref3) {
    var info = _ref3.info,
        sourceLayer = _ref3.sourceLayer;

    if (sourceLayer.id.endsWith('editHandles')) {
      // If user is picking an editing handle, add additional data to the info
      info.isEditingHandle = true;
    }

    return info;
  }

  createEditHandleLayers() {
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
        var EditHandleIconLayer = this.getSubLayerClass('editHandles', _keplerOutdatedDeck.IconLayer);
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
        var EditHandlePointLayer = this.getSubLayerClass('editHandles', _keplerOutdatedDeck.ScatterplotLayer);
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

  createTentativeLayers() {
    var _this2 = this;

    if (!this.state.tentativeFeature) {
      return [];
    }

    var layer = new _keplerOutdatedDeck.GeoJsonLayer(this.getSubLayerProps({
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

  updateTentativeFeature() {
    var tentativeFeature = this.state.modeHandler.getTentativeFeature();

    if (tentativeFeature !== this.state.tentativeFeature) {
      this.setState({
        tentativeFeature: tentativeFeature
      });
      this.setLayerNeedsUpdate();
    }
  }

  updateEditHandles(picks, groundCoords) {
    var editHandles = this.state.modeHandler.getEditHandles(picks, groundCoords);

    if (editHandles !== this.state.editHandles) {
      this.setState({
        editHandles: editHandles
      });
      this.setLayerNeedsUpdate();
    }
  }

  onLayerClick(event) {
    var editAction = this.state.modeHandler.handleClick(event);
    this.updateTentativeFeature();
    this.updateEditHandles();

    if (editAction) {
      this.props.onEdit(editAction);
    }
  }

  onStartDragging(event) {
    var editAction = this.state.modeHandler.handleStartDragging(event);
    this.updateTentativeFeature();
    this.updateEditHandles();

    if (editAction) {
      this.props.onEdit(editAction);
    }
  }

  onStopDragging(event) {
    var editAction = this.state.modeHandler.handleStopDragging(event);
    this.updateTentativeFeature();
    this.updateEditHandles();

    if (editAction) {
      this.props.onEdit(editAction);
    }
  }

  onPointerMove(event) {
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

  getCursor(_ref4) {
    var isDragging = _ref4.isDragging;
    return this.state.modeHandler.getCursor({
      isDragging: isDragging
    });
  }

}

exports.default = EditableGeoJsonLayer;
EditableGeoJsonLayer.layerName = 'EditableGeoJsonLayer';
EditableGeoJsonLayer.defaultProps = defaultProps;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sYXllcnMvZWRpdGFibGUtZ2VvanNvbi1sYXllci5qcyJdLCJuYW1lcyI6WyJERUZBVUxUX0xJTkVfQ09MT1IiLCJERUZBVUxUX0ZJTExfQ09MT1IiLCJERUZBVUxUX1NFTEVDVEVEX0xJTkVfQ09MT1IiLCJERUZBVUxUX1NFTEVDVEVEX0ZJTExfQ09MT1IiLCJERUZBVUxUX0VESVRJTkdfRVhJU1RJTkdfUE9JTlRfQ09MT1IiLCJERUZBVUxUX0VESVRJTkdfSU5URVJNRURJQVRFX1BPSU5UX0NPTE9SIiwiREVGQVVMVF9FRElUSU5HX1NOQVBfUE9JTlRfQ09MT1IiLCJERUZBVUxUX0VESVRJTkdfRVhJU1RJTkdfUE9JTlRfUkFESVVTIiwiREVGQVVMVF9FRElUSU5HX0lOVEVSTUVESUFURV9QT0lOVF9SQURJVVMiLCJERUZBVUxUX0VESVRJTkdfU05BUF9QT0lOVF9SQURJVVMiLCJnZXRFZGl0SGFuZGxlQ29sb3IiLCJoYW5kbGUiLCJ0eXBlIiwiZ2V0RWRpdEhhbmRsZVJhZGl1cyIsImRlZmF1bHRQcm9wcyIsIm1vZGUiLCJvbkVkaXQiLCJwaWNrYWJsZSIsInBpY2tpbmdSYWRpdXMiLCJwaWNraW5nRGVwdGgiLCJmcDY0IiwiZmlsbGVkIiwic3Ryb2tlZCIsImxpbmVXaWR0aFNjYWxlIiwibGluZVdpZHRoTWluUGl4ZWxzIiwibGluZVdpZHRoTWF4UGl4ZWxzIiwiTnVtYmVyIiwiTUFYX1NBRkVfSU5URUdFUiIsImxpbmVXaWR0aFVuaXRzIiwibGluZUpvaW50Um91bmRlZCIsImxpbmVNaXRlckxpbWl0IiwicG9pbnRSYWRpdXNTY2FsZSIsInBvaW50UmFkaXVzTWluUGl4ZWxzIiwicG9pbnRSYWRpdXNNYXhQaXhlbHMiLCJsaW5lRGFzaEp1c3RpZmllZCIsImdldExpbmVDb2xvciIsImZlYXR1cmUiLCJpc1NlbGVjdGVkIiwiZ2V0RmlsbENvbG9yIiwiZ2V0UmFkaXVzIiwiZiIsInByb3BlcnRpZXMiLCJyYWRpdXMiLCJzaXplIiwiZ2V0TGluZVdpZHRoIiwibGluZVdpZHRoIiwiZ2V0TGluZURhc2hBcnJheSIsImdldFRlbnRhdGl2ZUxpbmVEYXNoQXJyYXkiLCJnZXRUZW50YXRpdmVMaW5lQ29sb3IiLCJnZXRUZW50YXRpdmVGaWxsQ29sb3IiLCJnZXRUZW50YXRpdmVMaW5lV2lkdGgiLCJlZGl0SGFuZGxlVHlwZSIsImVkaXRIYW5kbGVQYXJhbWV0ZXJzIiwiZWRpdEhhbmRsZUxheWVyUHJvcHMiLCJlZGl0SGFuZGxlUG9pbnRSYWRpdXNTY2FsZSIsImVkaXRIYW5kbGVQb2ludE91dGxpbmUiLCJlZGl0SGFuZGxlUG9pbnRTdHJva2VXaWR0aCIsImVkaXRIYW5kbGVQb2ludFJhZGl1c01pblBpeGVscyIsImVkaXRIYW5kbGVQb2ludFJhZGl1c01heFBpeGVscyIsImdldEVkaXRIYW5kbGVQb2ludENvbG9yIiwiZ2V0RWRpdEhhbmRsZVBvaW50UmFkaXVzIiwiZWRpdEhhbmRsZUljb25BdGxhcyIsImVkaXRIYW5kbGVJY29uTWFwcGluZyIsImVkaXRIYW5kbGVJY29uU2l6ZVNjYWxlIiwiZ2V0RWRpdEhhbmRsZUljb24iLCJnZXRFZGl0SGFuZGxlSWNvblNpemUiLCJnZXRFZGl0SGFuZGxlSWNvbkNvbG9yIiwiZ2V0RWRpdEhhbmRsZUljb25BbmdsZSIsImJpbGxib2FyZCIsIm1vZGVIYW5kbGVycyIsInZpZXciLCJWaWV3SGFuZGxlciIsIm1vZGlmeSIsIk1vZGlmeUhhbmRsZXIiLCJlbGV2YXRpb24iLCJFbGV2YXRpb25IYW5kbGVyIiwiZXh0cnVkZSIsIkV4dHJ1ZGVIYW5kbGVyIiwicm90YXRlIiwiUm90YXRlSGFuZGxlciIsInRyYW5zbGF0ZSIsIlNuYXBwYWJsZUhhbmRsZXIiLCJUcmFuc2xhdGVIYW5kbGVyIiwiZHVwbGljYXRlIiwiRHVwbGljYXRlSGFuZGxlciIsInNjYWxlIiwiU2NhbGVIYW5kbGVyIiwiZHJhd1BvaW50IiwiRHJhd1BvaW50SGFuZGxlciIsImRyYXdMaW5lU3RyaW5nIiwiRHJhd0xpbmVTdHJpbmdIYW5kbGVyIiwiZHJhd1BvbHlnb24iLCJEcmF3UG9seWdvbkhhbmRsZXIiLCJkcmF3OTBEZWdyZWVQb2x5Z29uIiwiRHJhdzkwRGVncmVlUG9seWdvbkhhbmRsZXIiLCJzcGxpdCIsIlNwbGl0UG9seWdvbkhhbmRsZXIiLCJkcmF3UmVjdGFuZ2xlIiwiRHJhd1JlY3RhbmdsZUhhbmRsZXIiLCJkcmF3UmVjdGFuZ2xlVXNpbmczUG9pbnRzIiwiRHJhd1JlY3RhbmdsZVVzaW5nVGhyZWVQb2ludHNIYW5kbGVyIiwiZHJhd0NpcmNsZUZyb21DZW50ZXIiLCJEcmF3Q2lyY2xlRnJvbUNlbnRlckhhbmRsZXIiLCJkcmF3Q2lyY2xlQnlCb3VuZGluZ0JveCIsIkRyYXdDaXJjbGVCeUJvdW5kaW5nQm94SGFuZGxlciIsImRyYXdFbGxpcHNlQnlCb3VuZGluZ0JveCIsIkRyYXdFbGxpcHNlQnlCb3VuZGluZ0JveEhhbmRsZXIiLCJkcmF3RWxsaXBzZVVzaW5nM1BvaW50cyIsIkRyYXdFbGxpcHNlVXNpbmdUaHJlZVBvaW50c0hhbmRsZXIiLCJFZGl0YWJsZUdlb0pzb25MYXllciIsIkVkaXRhYmxlTGF5ZXIiLCJyZW5kZXJMYXllcnMiLCJzdWJMYXllclByb3BzIiwiZ2V0U3ViTGF5ZXJQcm9wcyIsImlkIiwiZGF0YSIsInByb3BzIiwic2VsZWN0aW9uQXdhcmVBY2Nlc3NvciIsIl9zdWJMYXllclByb3BzIiwidXBkYXRlVHJpZ2dlcnMiLCJzZWxlY3RlZEZlYXR1cmVJbmRleGVzIiwibGF5ZXJzIiwiR2VvSnNvbkxheWVyIiwiY29uY2F0IiwiY3JlYXRlVGVudGF0aXZlTGF5ZXJzIiwiY3JlYXRlRWRpdEhhbmRsZUxheWVycyIsImluaXRpYWxpemVTdGF0ZSIsInNldFN0YXRlIiwic2VsZWN0ZWRGZWF0dXJlcyIsImVkaXRIYW5kbGVzIiwic2hvdWxkVXBkYXRlU3RhdGUiLCJvbGRQcm9wcyIsImNvbnRleHQiLCJvbGRDb250ZXh0IiwiY2hhbmdlRmxhZ3MiLCJzdGF0ZUNoYW5nZWQiLCJ1cGRhdGVTdGF0ZSIsIm1vZGVIYW5kbGVyIiwic3RhdGUiLCJwcm9wc09yRGF0YUNoYW5nZWQiLCJjb25zb2xlIiwid2FybiIsIk1vZGVIYW5kbGVyIiwic2V0RmVhdHVyZUNvbGxlY3Rpb24iLCJkYXRhQ2hhbmdlZCIsInNldE1vZGVDb25maWciLCJtb2RlQ29uZmlnIiwic2V0U2VsZWN0ZWRGZWF0dXJlSW5kZXhlcyIsInVwZGF0ZVRlbnRhdGl2ZUZlYXR1cmUiLCJ1cGRhdGVFZGl0SGFuZGxlcyIsIkFycmF5IiwiaXNBcnJheSIsIm1hcCIsImVsZW0iLCJmZWF0dXJlcyIsImFjY2Vzc29yIiwiaXNGZWF0dXJlU2VsZWN0ZWQiLCJsZW5ndGgiLCJmZWF0dXJlSW5kZXgiLCJpbmRleE9mIiwiaW5jbHVkZXMiLCJnZXRQaWNraW5nSW5mbyIsImluZm8iLCJzb3VyY2VMYXllciIsImVuZHNXaXRoIiwiaXNFZGl0aW5nSGFuZGxlIiwic2hhcmVkUHJvcHMiLCJwYXJhbWV0ZXJzIiwibGF5ZXIiLCJFZGl0SGFuZGxlSWNvbkxheWVyIiwiZ2V0U3ViTGF5ZXJDbGFzcyIsIkljb25MYXllciIsImljb25BdGxhcyIsImljb25NYXBwaW5nIiwic2l6ZVNjYWxlIiwiZ2V0SWNvbiIsImdldFNpemUiLCJnZXRDb2xvciIsImdldEFuZ2xlIiwiZ2V0UG9zaXRpb24iLCJkIiwicG9zaXRpb24iLCJFZGl0SGFuZGxlUG9pbnRMYXllciIsIlNjYXR0ZXJwbG90TGF5ZXIiLCJyYWRpdXNTY2FsZSIsIm91dGxpbmUiLCJzdHJva2VXaWR0aCIsInJhZGl1c01pblBpeGVscyIsInJhZGl1c01heFBpeGVscyIsInRlbnRhdGl2ZUZlYXR1cmUiLCJhdXRvSGlnaGxpZ2h0IiwiZ2V0VGVudGF0aXZlRmVhdHVyZSIsInNldExheWVyTmVlZHNVcGRhdGUiLCJwaWNrcyIsImdyb3VuZENvb3JkcyIsImdldEVkaXRIYW5kbGVzIiwib25MYXllckNsaWNrIiwiZXZlbnQiLCJlZGl0QWN0aW9uIiwiaGFuZGxlQ2xpY2siLCJvblN0YXJ0RHJhZ2dpbmciLCJoYW5kbGVTdGFydERyYWdnaW5nIiwib25TdG9wRHJhZ2dpbmciLCJoYW5kbGVTdG9wRHJhZ2dpbmciLCJvblBvaW50ZXJNb3ZlIiwic291cmNlRXZlbnQiLCJoYW5kbGVQb2ludGVyTW92ZSIsImNhbmNlbE1hcFBhbiIsInN0b3BQcm9wYWdhdGlvbiIsImdldEN1cnNvciIsImlzRHJhZ2dpbmciLCJsYXllck5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFLQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFTQTs7QUFDQTs7Ozs7Ozs7QUFFQSxJQUFNQSxrQkFBa0IsR0FBRyxDQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsR0FBWCxFQUFnQixJQUFoQixDQUEzQjtBQUNBLElBQU1DLGtCQUFrQixHQUFHLENBQUMsR0FBRCxFQUFNLEdBQU4sRUFBVyxHQUFYLEVBQWdCLElBQWhCLENBQTNCO0FBQ0EsSUFBTUMsMkJBQTJCLEdBQUcsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FBcEM7QUFDQSxJQUFNQywyQkFBMkIsR0FBRyxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixDQUFwQztBQUNBLElBQU1DLG9DQUFvQyxHQUFHLENBQUMsSUFBRCxFQUFPLEdBQVAsRUFBWSxHQUFaLEVBQWlCLElBQWpCLENBQTdDO0FBQ0EsSUFBTUMsd0NBQXdDLEdBQUcsQ0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEdBQVgsRUFBZ0IsSUFBaEIsQ0FBakQ7QUFDQSxJQUFNQyxnQ0FBZ0MsR0FBRyxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixDQUF6QztBQUNBLElBQU1DLHFDQUFxQyxHQUFHLENBQTlDO0FBQ0EsSUFBTUMseUNBQXlDLEdBQUcsQ0FBbEQ7QUFD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Q2QsV0FBS2xGLEtBQUwsQ0FBV3BHLE1BQVgsQ0FBa0JzTCxVQUFsQjtBQUNEO0FBQ0Y7O0FBRURNLEVBQUFBLGFBQWEsQ0FBQ1AsS0FBRCxFQUEwQjtBQUFBLFFBQzdCSCxZQUQ2QixHQUNRRyxLQURSLENBQzdCSCxZQUQ2QjtBQUFBLFFBQ2ZELEtBRGUsR0FDUUksS0FEUixDQUNmSixLQURlO0FBQUEsUUFDUlksV0FEUSxHQUNRUixLQURSLENBQ1JRLFdBRFE7O0FBQUEsZ0NBR0EsS0FBS25FLEtBQUwsQ0FBV0QsV0FBWCxDQUF1QnFFLGlCQUF2QixDQUF5Q1QsS0FBekMsQ0FIQTtBQUFBLFFBRzdCQyxVQUg2Qix5QkFHN0JBLFVBSDZCO0FBQUEsUUFHakJTLFlBSGlCLHlCQUdqQkEsWUFIaUI7O0FBSXJDLFNBQUszRCxzQkFBTDtBQUNBLFNBQUtDLGlCQUFMLENBQXVCNEMsS0FBdkIsRUFBOEJDLFlBQTlCOztBQUVBLFFBQUlhLFlBQUosRUFBa0I7QUFDaEI7QUFDQTtBQUNBRixNQUFBQSxXQUFXLENBQUNHLGVBQVo7QUFDRDs7QUFFRCxRQUFJVixVQUFKLEVBQWdCO0FBQ2QsV0FBS2xGLEtBQUwsQ0FBV3BHLE1BQVgsQ0FBa0JzTCxVQUFsQjtBQUNEO0FBQ0Y7O0FBRURXLEVBQUFBLFNBQVMsUUFBMEM7QUFBQSxRQUF2Q0MsVUFBdUMsU0FBdkNBLFVBQXVDO0FBQ2pELFdBQU8sS0FBS3hFLEtBQUwsQ0FBV0QsV0FBWCxDQUF1QndFLFNBQXZCLENBQWlDO0FBQUVDLE1BQUFBLFVBQVUsRUFBVkE7QUFBRixLQUFqQyxDQUFQO0FBQ0Q7O0FBeFQ2RDs7O0FBMlRoRXJHLG9CQUFvQixDQUFDc0csU0FBckIsR0FBaUMsc0JBQWpDO0FBQ0F0RyxvQkFBb0IsQ0FBQy9GLFlBQXJCLEdBQW9DQSxZQUFwQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG4vKiBlc2xpbnQtZW52IGJyb3dzZXIgKi9cblxuLy8gVE9ETyBlZGl0LW1vZGVzOiBjb25zb2xpZGF0ZSBFZGl0YWJsZUdlb0pzb25MYXllciBhbmQgRWRpdGFibGVHZW9Kc29uTGF5ZXJFZGl0TW9kZVBvY1xuXG5pbXBvcnQgeyBHZW9Kc29uTGF5ZXIsIFNjYXR0ZXJwbG90TGF5ZXIsIEljb25MYXllciB9IGZyb20gJ2tlcGxlci1vdXRkYXRlZC1kZWNrLmdsLWxheWVycyc7XG5pbXBvcnQgeyB0eXBlIFBvc2l0aW9uIH0gZnJvbSAna2VwbGVyLW91dGRhdGVkLW5lYnVsYS5nbC1lZGl0LW1vZGVzJztcbmltcG9ydCB7IE1vZGVIYW5kbGVyIH0gZnJvbSAnLi4vbW9kZS1oYW5kbGVycy9tb2RlLWhhbmRsZXIuanMnO1xuaW1wb3J0IHsgVmlld0hhbmRsZXIgfSBmcm9tICcuLi9tb2RlLWhhbmRsZXJzL3ZpZXctaGFuZGxlci5qcyc7XG5pbXBvcnQgeyBNb2RpZnlIYW5kbGVyIH0gZnJvbSAnLi4vbW9kZS1oYW5kbGVycy9tb2RpZnktaGFuZGxlci5qcyc7XG5pbXBvcnQgeyBFbGV2YXRpb25IYW5kbGVyIH0gZnJvbSAnLi4vbW9kZS1oYW5kbGVycy9lbGV2YXRpb24taGFuZGxlci5qcyc7XG5pbXBvcnQgeyBTbmFwcGFibGVIYW5kbGVyIH0gZnJvbSAnLi4vbW9kZS1oYW5kbGVycy9zbmFwcGFibGUtaGFuZGxlci5qcyc7XG5pbXBvcnQgeyBUcmFuc2xhdGVIYW5kbGVyIH0gZnJvbSAnLi4vbW9kZS1oYW5kbGVycy90cmFuc2xhdGUtaGFuZGxlci5qcyc7XG5pbXBvcnQgeyBEdXBsaWNhdGVIYW5kbGVyIH0gZnJvbSAnLi4vbW9kZS1oYW5kbGVycy9kdXBsaWNhdGUtaGFuZGxlcic7XG5pbXBvcnQgeyBSb3RhdGVIYW5kbGVyIH0gZnJvbSAnLi4vbW9kZS1oYW5kbGVycy9yb3RhdGUtaGFuZGxlci5qcyc7XG5pbXBvcnQgeyBTY2FsZUhhbmRsZXIgfSBmcm9tICcuLi9tb2RlLWhhbmRsZXJzL3NjYWxlLWhhbmRsZXIuanMnO1xuaW1wb3J0IHsgRHJhd1BvaW50SGFuZGxlciB9IGZyb20gJy4uL21vZGUtaGFuZGxlcnMvZHJhdy1wb2ludC1oYW5kbGVyLmpzJztcbmltcG9ydCB7IERyYXdMaW5lU3RyaW5nSGFuZGxlciB9IGZyb20gJy4uL21vZGUtaGFuZGxlcnMvZHJhdy1saW5lLXN0cmluZy1oYW5kbGVyLmpzJztcbmltcG9ydCB7IERyYXdQb2x5Z29uSGFuZGxlciB9IGZyb20gJy4uL21vZGUtaGFuZGxlcnMvZHJhdy1wb2x5Z29uLWhhbmRsZXIuanMnO1xuaW1wb3J0IHsgRHJhdzkwRGVncmVlUG9seWdvbkhhbmRsZXIgfSBmcm9tICcuLi9tb2RlLWhhbmRsZXJzL2RyYXctOTBkZWdyZWUtcG9seWdvbi1oYW5kbGVyLmpzJztcbmltcG9ydCB7IERyYXdSZWN0YW5nbGVIYW5kbGVyIH0gZnJvbSAnLi4vbW9kZS1oYW5kbGVycy9kcmF3LXJlY3RhbmdsZS1oYW5kbGVyLmpzJztcbmltcG9ydCB7IFNwbGl0UG9seWdvbkhhbmRsZXIgfSBmcm9tICcuLi9tb2RlLWhhbmRsZXJzL3NwbGl0LXBvbHlnb24taGFuZGxlci5qcyc7XG5pbXBvcnQgeyBEcmF3UmVjdGFuZ2xlVXNpbmdUaHJlZVBvaW50c0hhbmRsZXIgfSBmcm9tICcuLi9tb2RlLWhhbmRsZXJzL2RyYXctcmVjdGFuZ2xlLXVzaW5nLXRocmVlLXBvaW50cy1oYW5kbGVyLmpzJztcbmltcG9ydCB7IERyYXdDaXJjbGVGcm9tQ2VudGVySGFuZGxlciB9IGZyb20gJy4uL21vZGUtaGFuZGxlcnMvZHJhdy1jaXJjbGUtZnJvbS1jZW50ZXItaGFuZGxlci5qcyc7XG5pbXBvcnQgeyBEcmF3Q2lyY2xlQnlCb3VuZGluZ0JveEhhbmRsZXIgfSBmcm9tICcuLi9tb2RlLWhhbmRsZXJzL2RyYXctY2lyY2xlLWJ5LWJvdW5kaW5nLWJveC1oYW5kbGVyLmpzJztcbmltcG9ydCB7IERyYXdFbGxpcHNlQnlCb3VuZGluZ0JveEhhbmRsZXIgfSBmcm9tICcuLi9tb2RlLWhhbmRsZXJzL2RyYXctZWxsaXBzZS1ieS1ib3VuZGluZy1ib3gtaGFuZGxlci5qcyc7XG5pbXBvcnQgeyBEcmF3RWxsaXBzZVVzaW5nVGhyZWVQb2ludHNIYW5kbGVyIH0gZnJvbSAnLi4vbW9kZS1oYW5kbGVycy9kcmF3LWVsbGlwc2UtdXNpbmctdGhyZWUtcG9pbnRzLWhhbmRsZXIuanMnO1xuXG5pbXBvcnQgdHlwZSB7IEVkaXRBY3Rpb24gfSBmcm9tICcuLi9tb2RlLWhhbmRsZXJzL21vZGUtaGFuZGxlci5qcyc7XG5pbXBvcnQgdHlwZSB7XG4gIENsaWNrRXZlbnQsXG4gIFN0YXJ0RHJhZ2dpbmdFdmVudCxcbiAgU3RvcERyYWdnaW5nRXZlbnQsXG4gIFBvaW50ZXJNb3ZlRXZlbnRcbn0gZnJvbSAnLi4vZXZlbnQtdHlwZXMuanMnO1xuaW1wb3J0IHsgRXh0cnVkZUhhbmRsZXIgfSBmcm9tICcuLi9tb2RlLWhhbmRsZXJzL2V4dHJ1ZGUtaGFuZGxlci5qcyc7XG5pbXBvcnQgRWRpdGFibGVMYXllciBmcm9tICcuL2VkaXRhYmxlLWxheWVyLmpzJztcblxuY29uc3QgREVGQVVMVF9MSU5FX0NPTE9SID0gWzB4MCwgMHgwLCAweDAsIDB4ZmZdO1xuY29uc3QgREVGQVVMVF9GSUxMX0NPTE9SID0gWzB4MCwgMHgwLCAweDAsIDB4OTBdO1xuY29uc3QgREVGQVVMVF9TRUxFQ1RFRF9MSU5FX0NPTE9SID0gWzB4OTAsIDB4OTAsIDB4OTAsIDB4ZmZdO1xuY29uc3QgREVGQVVMVF9TRUxFQ1RFRF9GSUxMX0NPTE9SID0gWzB4OTAsIDB4OTAsIDB4OTAsIDB4OTBdO1xuY29uc3QgREVGQVVMVF9FRElUSU5HX0VYSVNUSU5HX1BPSU5UX0NPTE9SID0gWzB4YzAsIDB4MCwgMHgwLCAweGZmXTtcbmNvbnN0IERFRkFVTFRfRURJVElOR19JTlRFUk1FRElBVEVfUE9JTlRfQ09MT1IgPSBbMHgwLCAweDAsIDB4MCwgMHg4MF07XG5jb25zdCBERUZBVUxUX0VESVRJTkdfU05BUF9QT0lOVF9DT0xPUiA9IFsweDdjLCAweDAwLCAweGMwLCAweGZmXTtcbmNvbnN0IERFRkFVTFRfRURJVElOR19FWElTVElOR19QT0lOVF9SQURJVVMgPSA1O1xuY29uc3QgREVGQVVMVF9FRElUSU5HX0lOVEVSTUVESUFURV9QT0lOVF9SQURJVVMgPSAzO1xuY29uc3QgREVGQVVMVF9FRElUSU5HX1NOQVBfUE9JTlRfUkFESVVTID0gNztcblxuZnVuY3Rpb24gZ2V0RWRpdEhhbmRsZUNvbG9yKGhhbmRsZSkge1xuICBzd2l0Y2ggKGhhbmRsZS50eXBlKSB7XG4gICAgY2FzZSAnZXhpc3RpbmcnOlxuICAgICAgcmV0dXJuIERFRkFVTFRfRURJVElOR19FWElTVElOR19QT0lOVF9DT0xPUjtcbiAgICBjYXNlICdzbmFwJzpcbiAgICAgIHJldHVybiBERUZBVUxUX0VESVRJTkdfU05BUF9QT0lOVF9DT0xPUjtcbiAgICBjYXNlICdpbnRlcm1lZGlhdGUnOlxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gREVGQVVMVF9FRElUSU5HX0lOVEVSTUVESUFURV9QT0lOVF9DT0xPUjtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRFZGl0SGFuZGxlUmFkaXVzKGhhbmRsZSkge1xuICBzd2l0Y2ggKGhhbmRsZS50eXBlKSB7XG4gICAgY2FzZSAnZXhpc3RpbmcnOlxuICAgICAgcmV0dXJuIERFRkFVTFRfRURJVElOR19FWElTVElOR19QT0lOVF9SQURJVVM7XG4gICAgY2FzZSAnc25hcCc6XG4gICAgICByZXR1cm4gREVGQVVMVF9FRElUSU5HX1NOQVBfUE9JTlRfUkFESVVTO1xuICAgIGNhc2UgJ2ludGVybWVkaWF0ZSc6XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBERUZBVUxUX0VESVRJTkdfSU5URVJNRURJQVRFX1BPSU5UX1JBRElVUztcbiAgfVxufVxuXG5jb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gIG1vZGU6ICdtb2RpZnknLFxuXG4gIC8vIEVkaXQgYW5kIGludGVyYWN0aW9uIGV2ZW50c1xuICBvbkVkaXQ6ICgpID0+IHt9LFxuXG4gIHBpY2thYmxlOiB0cnVlLFxuICBwaWNraW5nUmFkaXVzOiAxMCxcbiAgcGlja2luZ0RlcHRoOiA1LFxuICBmcDY0OiBmYWxzZSxcbiAgZmlsbGVkOiB0cnVlLFxuICBzdHJva2VkOiB0cnVlLFxuICBsaW5lV2lkdGhTY2FsZTogMSxcbiAgbGluZVdpZHRoTWluUGl4ZWxzOiAxLFxuICBsaW5lV2lkdGhNYXhQaXhlbHM6IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSLFxuICBsaW5lV2lkdGhVbml0czogJ21ldGVycycsXG4gIGxpbmVKb2ludFJvdW5kZWQ6IGZhbHNlLFxuICBsaW5lTWl0ZXJMaW1pdDogNCxcbiAgcG9pbnRSYWRpdXNTY2FsZTogMSxcbiAgcG9pbnRSYWRpdXNNaW5QaXhlbHM6IDIsXG4gIHBvaW50UmFkaXVzTWF4UGl4ZWxzOiBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUixcbiAgbGluZURhc2hKdXN0aWZpZWQ6IGZhbHNlLFxuICBnZXRMaW5lQ29sb3I6IChmZWF0dXJlLCBpc1NlbGVjdGVkLCBtb2RlKSA9PlxuICAgIGlzU2VsZWN0ZWQgPyBERUZBVUxUX1NFTEVDVEVEX0xJTkVfQ09MT1IgOiBERUZBVUxUX0xJTkVfQ09MT1IsXG4gIGdldEZpbGxDb2xvcjogKGZlYXR1cmUsIGlzU2VsZWN0ZWQsIG1vZGUpID0+XG4gICAgaXNTZWxlY3RlZCA/IERFRkFVTFRfU0VMRUNURURfRklMTF9DT0xPUiA6IERFRkFVTFRfRklMTF9DT0xPUixcbiAgZ2V0UmFkaXVzOiBmID0+XG4gICAgKGYgJiYgZi5wcm9wZXJ0aWVzICYmIGYucHJvcGVydGllcy5yYWRpdXMpIHx8IChmICYmIGYucHJvcGVydGllcyAmJiBmLnByb3BlcnRpZXMuc2l6ZSkgfHwgMSxcbiAgZ2V0TGluZVdpZHRoOiBmID0+IChmICYmIGYucHJvcGVydGllcyAmJiBmLnByb3BlcnRpZXMubGluZVdpZHRoKSB8fCAxLFxuICBnZXRMaW5lRGFzaEFycmF5OiAoZmVhdHVyZSwgaXNTZWxlY3RlZCwgbW9kZSkgPT5cbiAgICBpc1NlbGVjdGVkICYmIG1vZGUgIT09ICd2aWV3JyA/IFs3LCA0XSA6IFswLCAwXSxcblxuICAvLyBUZW50YXRpdmUgZmVhdHVyZSByZW5kZXJpbmdcbiAgZ2V0VGVudGF0aXZlTGluZURhc2hBcnJheTogKGYsIG1vZGUpID0+IFs3LCA0XSxcbiAgZ2V0VGVudGF0aXZlTGluZUNvbG9yOiAoZiwgbW9kZSkgPT4gREVGQVVMVF9TRUxFQ1RFRF9MSU5FX0NPTE9SLFxuICBnZXRUZW50YXRpdmVGaWxsQ29sb3I6IChmLCBtb2RlKSA9PiBERUZBVUxUX1NFTEVDVEVEX0ZJTExfQ09MT1IsXG4gIGdldFRlbnRhdGl2ZUxpbmVXaWR0aDogKGYsIG1vZGUpID0+IChmICYmIGYucHJvcGVydGllcyAmJiBmLnByb3BlcnRpZXMubGluZVdpZHRoKSB8fCAxLFxuXG4gIGVkaXRIYW5kbGVUeXBlOiAncG9pbnQnLFxuICBlZGl0SGFuZGxlUGFyYW1ldGVyczoge30sXG4gIGVkaXRIYW5kbGVMYXllclByb3BzOiB7fSxcblxuICAvLyBwb2ludCBoYW5kbGVzXG4gIGVkaXRIYW5kbGVQb2ludFJhZGl1c1NjYWxlOiAxLFxuICBlZGl0SGFuZGxlUG9pbnRPdXRsaW5lOiBmYWxzZSxcbiAgZWRpdEhhbmRsZVBvaW50U3Ryb2tlV2lkdGg6IDEsXG4gIGVkaXRIYW5kbGVQb2ludFJhZGl1c01pblBpeGVsczogNCxcbiAgZWRpdEhhbmRsZVBvaW50UmFkaXVzTWF4UGl4ZWxzOiA4LFxuICBnZXRFZGl0SGFuZGxlUG9pbnRDb2xvcjogZ2V0RWRpdEhhbmRsZUNvbG9yLFxuICBnZXRFZGl0SGFuZGxlUG9pbnRSYWRpdXM6IGdldEVkaXRIYW5kbGVSYWRpdXMsXG5cbiAgLy8gaWNvbiBoYW5kbGVzXG4gIGVkaXRIYW5kbGVJY29uQXRsYXM6IG51bGwsXG4gIGVkaXRIYW5kbGVJY29uTWFwcGluZzogbnVsbCxcbiAgZWRpdEhhbmRsZUljb25TaXplU2NhbGU6IDEsXG4gIGdldEVkaXRIYW5kbGVJY29uOiBoYW5kbGUgPT4gaGFuZGxlLnR5cGUsXG4gIGdldEVkaXRIYW5kbGVJY29uU2l6ZTogMTAsXG4gIGdldEVkaXRIYW5kbGVJY29uQ29sb3I6IGdldEVkaXRIYW5kbGVDb2xvcixcbiAgZ2V0RWRpdEhhbmRsZUljb25BbmdsZTogMCxcblxuICAvLyBtaXNjXG4gIGJpbGxib2FyZDogdHJ1ZSxcblxuICAvLyBNb2RlIGhhbmRsZXJzXG4gIG1vZGVIYW5kbGVyczoge1xuICAgIHZpZXc6IG5ldyBWaWV3SGFuZGxlcigpLFxuICAgIG1vZGlmeTogbmV3IE1vZGlmeUhhbmRsZXIoKSxcbiAgICBlbGV2YXRpb246IG5ldyBFbGV2YXRpb25IYW5kbGVyKCksXG4gICAgZXh0cnVkZTogbmV3IEV4dHJ1ZGVIYW5kbGVyKCksXG4gICAgcm90YXRlOiBuZXcgUm90YXRlSGFuZGxlcigpLFxuICAgIHRyYW5zbGF0ZTogbmV3IFNuYXBwYWJsZUhhbmRsZXIobmV3IFRyYW5zbGF0ZUhhbmRsZXIoKSksXG4gICAgZHVwbGljYXRlOiBuZXcgRHVwbGljYXRlSGFuZGxlcigpLFxuICAgIHNjYWxlOiBuZXcgU2NhbGVIYW5kbGVyKCksXG4gICAgZHJhd1BvaW50OiBuZXcgRHJhd1BvaW50SGFuZGxlcigpLFxuICAgIGRyYXdMaW5lU3RyaW5nOiBuZXcgRHJhd0xpbmVTdHJpbmdIYW5kbGVyKCksXG4gICAgZHJhd1BvbHlnb246IG5ldyBEcmF3UG9seWdvbkhhbmRsZXIoKSxcbiAgICBkcmF3OTBEZWdyZWVQb2x5Z29uOiBuZXcgRHJhdzkwRGVncmVlUG9seWdvbkhhbmRsZXIoKSxcbiAgICBzcGxpdDogbmV3IFNwbGl0UG9seWdvbkhhbmRsZXIoKSxcbiAgICBkcmF3UmVjdGFuZ2xlOiBuZXcgRHJhd1JlY3RhbmdsZUhhbmRsZXIoKSxcbiAgICBkcmF3UmVjdGFuZ2xlVXNpbmczUG9pbnRzOiBuZXcgRHJhd1JlY3RhbmdsZVVzaW5nVGhyZWVQb2ludHNIYW5kbGVyKCksXG4gICAgZHJhd0NpcmNsZUZyb21DZW50ZXI6IG5ldyBEcmF3Q2lyY2xlRnJvbUNlbnRlckhhbmRsZXIoKSxcbiAgICBkcmF3Q2lyY2xlQnlCb3VuZGluZ0JveDogbmV3IERyYXdDaXJjbGVCeUJvdW5kaW5nQm94SGFuZGxlcigpLFxuICAgIGRyYXdFbGxpcHNlQnlCb3VuZGluZ0JveDogbmV3IERyYXdFbGxpcHNlQnlCb3VuZGluZ0JveEhhbmRsZXIoKSxcbiAgICBkcmF3RWxsaXBzZVVzaW5nM1BvaW50czogbmV3IERyYXdFbGxpcHNlVXNpbmdUaHJlZVBvaW50c0hhbmRsZXIoKVxuICB9XG59O1xuXG50eXBlIFByb3BzID0ge1xuICBtb2RlOiBzdHJpbmcsXG4gIG1vZGVIYW5kbGVyczogeyBbbW9kZTogc3RyaW5nXTogTW9kZUhhbmRsZXIgfSxcbiAgb25FZGl0OiBFZGl0QWN0aW9uID0+IHZvaWQsXG4gIC8vIFRPRE86IHR5cGUgdGhlIHJlc3RcbiAgW3N0cmluZ106IGFueVxufTtcblxuLy8gdHlwZSBTdGF0ZSA9IHtcbi8vICAgbW9kZUhhbmRsZXI6IEVkaXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24sXG4vLyAgIHRlbnRhdGl2ZUZlYXR1cmU6ID9GZWF0dXJlLFxuLy8gICBlZGl0SGFuZGxlczogYW55W10sXG4vLyAgIHNlbGVjdGVkRmVhdHVyZXM6IEZlYXR1cmVbXVxuLy8gfTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWRpdGFibGVHZW9Kc29uTGF5ZXIgZXh0ZW5kcyBFZGl0YWJsZUxheWVyIHtcbiAgLy8gc3RhdGU6IFN0YXRlO1xuICAvLyBwcm9wczogUHJvcHM7XG4gIC8vIHNldFN0YXRlOiAoJFNoYXBlPFN0YXRlPikgPT4gdm9pZDtcblxuICByZW5kZXJMYXllcnMoKSB7XG4gICAgY29uc3Qgc3ViTGF5ZXJQcm9wcyA9IHRoaXMuZ2V0U3ViTGF5ZXJQcm9wcyh7XG4gICAgICBpZDogJ2dlb2pzb24nLFxuXG4gICAgICAvLyBQcm94eSBtb3N0IEdlb0pzb25MYXllciBwcm9wcyBhcy1pc1xuICAgICAgZGF0YTogdGhpcy5wcm9wcy5kYXRhLFxuICAgICAgZnA2NDogdGhpcy5wcm9wcy5mcDY0LFxuICAgICAgZmlsbGVkOiB0aGlzLnByb3BzLmZpbGxlZCxcbiAgICAgIHN0cm9rZWQ6IHRoaXMucHJvcHMuc3Ryb2tlZCxcbiAgICAgIGxpbmVXaWR0aFNjYWxlOiB0aGlzLnByb3BzLmxpbmVXaWR0aFNjYWxlLFxuICAgICAgbGluZVdpZHRoTWluUGl4ZWxzOiB0aGlzLnByb3BzLmxpbmVXaWR0aE1pblBpeGVscyxcbiAgICAgIGxpbmVXaWR0aE1heFBpeGVsczogdGhpcy5wcm9wcy5saW5lV2lkdGhNYXhQaXhlbHMsXG4gICAgICBsaW5lV2lkdGhVbml0czogdGhpcy5wcm9wcy5saW5lV2lkdGhVbml0cyxcbiAgICAgIGxpbmVKb2ludFJvdW5kZWQ6IHRoaXMucHJvcHMubGluZUpvaW50Um91bmRlZCxcbiAgICAgIGxpbmVNaXRlckxpbWl0OiB0aGlzLnByb3BzLmxpbmVNaXRlckxpbWl0LFxuICAgICAgcG9pbnRSYWRpdXNTY2FsZTogdGhpcy5wcm9wcy5wb2ludFJhZGl1c1NjYWxlLFxuICAgICAgcG9pbnRSYWRpdXNNaW5QaXhlbHM6IHRoaXMucHJvcHMucG9pbnRSYWRpdXNNaW5QaXhlbHMsXG4gICAgICBwb2ludFJhZGl1c01heFBpeGVsczogdGhpcy5wcm9wcy5wb2ludFJhZGl1c01heFBpeGVscyxcbiAgICAgIGxpbmVEYXNoSnVzdGlmaWVkOiB0aGlzLnByb3BzLmxpbmVEYXNoSnVzdGlmaWVkLFxuICAgICAgZ2V0TGluZUNvbG9yOiB0aGlzLnNlbGVjdGlvbkF3YXJlQWNjZXNzb3IodGhpcy5wcm9wcy5nZXRMaW5lQ29sb3IpLFxuICAgICAgZ2V0RmlsbENvbG9yOiB0aGlzLnNlbGVjdGlvbkF3YXJlQWNjZXNzb3IodGhpcy5wcm9wcy5nZXRGaWxsQ29sb3IpLFxuICAgICAgZ2V0UmFkaXVzOiB0aGlzLnNlbGVjdGlvbkF3YXJlQWNjZXNzb3IodGhpcy5wcm9wcy5nZXRSYWRpdXMpLFxuICAgICAgZ2V0TGluZVdpZHRoOiB0aGlzLnNlbGVjdGlvbkF3YXJlQWNjZXNzb3IodGhpcy5wcm9wcy5nZXRMaW5lV2lkdGgpLFxuICAgICAgZ2V0TGluZURhc2hBcnJheTogdGhpcy5zZWxlY3Rpb25Bd2FyZUFjY2Vzc29yKHRoaXMucHJvcHMuZ2V0TGluZURhc2hBcnJheSksXG5cbiAgICAgIF9zdWJMYXllclByb3BzOiB7XG4gICAgICAgICdsaW5lLXN0cmluZ3MnOiB7XG4gICAgICAgICAgYmlsbGJvYXJkOiB0aGlzLnByb3BzLmJpbGxib2FyZFxuICAgICAgICB9LFxuICAgICAgICAncG9seWdvbnMtc3Ryb2tlJzoge1xuICAgICAgICAgIGJpbGxib2FyZDogdGhpcy5wcm9wcy5iaWxsYm9hcmRcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgdXBkYXRlVHJpZ2dlcnM6IHtcbiAgICAgICAgZ2V0TGluZUNvbG9yOiBbdGhpcy5wcm9wcy5zZWxlY3RlZEZlYXR1cmVJbmRleGVzLCB0aGlzLnByb3BzLm1vZGVdLFxuICAgICAgICBnZXRGaWxsQ29sb3I6IFt0aGlzLnByb3BzLnNlbGVjdGVkRmVhdHVyZUluZGV4ZXMsIHRoaXMucHJvcHMubW9kZV0sXG4gICAgICAgIGdldFJhZGl1czogW3RoaXMucHJvcHMuc2VsZWN0ZWRGZWF0dXJlSW5kZXhlcywgdGhpcy5wcm9wcy5tb2RlXSxcbiAgICAgICAgZ2V0TGluZVdpZHRoOiBbdGhpcy5wcm9wcy5zZWxlY3RlZEZlYXR1cmVJbmRleGVzLCB0aGlzLnByb3BzLm1vZGVdLFxuICAgICAgICBnZXRMaW5lRGFzaEFycmF5OiBbdGhpcy5wcm9wcy5zZWxlY3RlZEZlYXR1cmVJbmRleGVzLCB0aGlzLnByb3BzLm1vZGVdXG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBsZXQgbGF5ZXJzOiBhbnkgPSBbbmV3IEdlb0pzb25MYXllcihzdWJMYXllclByb3BzKV07XG5cbiAgICBsYXllcnMgPSBsYXllcnMuY29uY2F0KHRoaXMuY3JlYXRlVGVudGF0aXZlTGF5ZXJzKCkpO1xuICAgIGxheWVycyA9IGxheWVycy5jb25jYXQodGhpcy5jcmVhdGVFZGl0SGFuZGxlTGF5ZXJzKCkpO1xuXG4gICAgcmV0dXJuIGxheWVycztcbiAgfVxuXG4gIGluaXRpYWxpemVTdGF0ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplU3RhdGUoKTtcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgc2VsZWN0ZWRGZWF0dXJlczogW10sXG4gICAgICBlZGl0SGFuZGxlczogW11cbiAgICB9KTtcbiAgfVxuXG4gIC8vIFRPRE86IGZpZ3VyZSBvdXQgaG93IHRvIHByb3Blcmx5IHVwZGF0ZSBzdGF0ZSBmcm9tIGFuIG91dHNpZGUgZXZlbnQgaGFuZGxlclxuICBzaG91bGRVcGRhdGVTdGF0ZSh7IHByb3BzLCBvbGRQcm9wcywgY29udGV4dCwgb2xkQ29udGV4dCwgY2hhbmdlRmxhZ3MgfTogT2JqZWN0KSB7XG4gICAgaWYgKGNoYW5nZUZsYWdzLnN0YXRlQ2hhbmdlZCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgdXBkYXRlU3RhdGUoe1xuICAgIHByb3BzLFxuICAgIG9sZFByb3BzLFxuICAgIGNoYW5nZUZsYWdzXG4gIH06IHtcbiAgICBwcm9wczogUHJvcHMsXG4gICAgb2xkUHJvcHM6IFByb3BzLFxuICAgIGNoYW5nZUZsYWdzOiBhbnlcbiAgfSkge1xuICAgIHN1cGVyLnVwZGF0ZVN0YXRlKHsgcHJvcHMsIGNoYW5nZUZsYWdzIH0pO1xuXG4gICAgbGV0IG1vZGVIYW5kbGVyOiBNb2RlSGFuZGxlciA9IHRoaXMuc3RhdGUubW9kZUhhbmRsZXI7XG4gICAgaWYgKGNoYW5nZUZsYWdzLnByb3BzT3JEYXRhQ2hhbmdlZCkge1xuICAgICAgaWYgKHByb3BzLm1vZGVIYW5kbGVycyAhPT0gb2xkUHJvcHMubW9kZUhhbmRsZXJzIHx8IHByb3BzLm1vZGUgIT09IG9sZFByb3BzLm1vZGUpIHtcbiAgICAgICAgbW9kZUhhbmRsZXIgPSBwcm9wcy5tb2RlSGFuZGxlcnNbcHJvcHMubW9kZV07XG5cbiAgICAgICAgaWYgKCFtb2RlSGFuZGxlcikge1xuICAgICAgICAgIGNvbnNvbGUud2FybihgTm8gaGFuZGxlciBjb25maWd1cmVkIGZvciBtb2RlICR7cHJvcHMubW9kZX1gKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlLG5vLXVuZGVmXG4gICAgICAgICAgLy8gVXNlIGRlZmF1bHQgbW9kZSBoYW5kbGVyXG4gICAgICAgICAgbW9kZUhhbmRsZXIgPSBuZXcgTW9kZUhhbmRsZXIoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtb2RlSGFuZGxlciAhPT0gdGhpcy5zdGF0ZS5tb2RlSGFuZGxlcikge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBtb2RlSGFuZGxlciB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIG1vZGVIYW5kbGVyLnNldEZlYXR1cmVDb2xsZWN0aW9uKHByb3BzLmRhdGEpO1xuICAgICAgfSBlbHNlIGlmIChjaGFuZ2VGbGFncy5kYXRhQ2hhbmdlZCkge1xuICAgICAgICBtb2RlSGFuZGxlci5zZXRGZWF0dXJlQ29sbGVjdGlvbihwcm9wcy5kYXRhKTtcbiAgICAgIH1cblxuICAgICAgbW9kZUhhbmRsZXIuc2V0TW9kZUNvbmZpZyhwcm9wcy5tb2RlQ29uZmlnKTtcbiAgICAgIG1vZGVIYW5kbGVyLnNldFNlbGVjdGVkRmVhdHVyZUluZGV4ZXMocHJvcHMuc2VsZWN0ZWRGZWF0dXJlSW5kZXhlcyk7XG4gICAgICB0aGlzLnVwZGF0ZVRlbnRhdGl2ZUZlYXR1cmUoKTtcbiAgICAgIHRoaXMudXBkYXRlRWRpdEhhbmRsZXMoKTtcbiAgICB9XG5cbiAgICBsZXQgc2VsZWN0ZWRGZWF0dXJlcyA9IFtdO1xuICAgIGlmIChBcnJheS5pc0FycmF5KHByb3BzLnNlbGVjdGVkRmVhdHVyZUluZGV4ZXMpKSB7XG4gICAgICAvLyBUT0RPOiBuZWVkcyBpbXByb3ZlZCB0ZXN0aW5nLCBpLmUuIGNoZWNraW5nIGZvciBkdXBsaWNhdGVzLCBOYU5zLCBvdXQgb2YgcmFuZ2UgbnVtYmVycywgLi4uXG4gICAgICBzZWxlY3RlZEZlYXR1cmVzID0gcHJvcHMuc2VsZWN0ZWRGZWF0dXJlSW5kZXhlcy5tYXAoZWxlbSA9PiBwcm9wcy5kYXRhLmZlYXR1cmVzW2VsZW1dKTtcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHsgc2VsZWN0ZWRGZWF0dXJlcyB9KTtcbiAgfVxuXG4gIHNlbGVjdGlvbkF3YXJlQWNjZXNzb3IoYWNjZXNzb3I6IGFueSkge1xuICAgIGlmICh0eXBlb2YgYWNjZXNzb3IgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBhY2Nlc3NvcjtcbiAgICB9XG4gICAgcmV0dXJuIChmZWF0dXJlOiBPYmplY3QpID0+IGFjY2Vzc29yKGZlYXR1cmUsIHRoaXMuaXNGZWF0dXJlU2VsZWN0ZWQoZmVhdHVyZSksIHRoaXMucHJvcHMubW9kZSk7XG4gIH1cblxuICBpc0ZlYXR1cmVTZWxlY3RlZChmZWF0dXJlOiBPYmplY3QpIHtcbiAgICBpZiAoIXRoaXMucHJvcHMuZGF0YSB8fCAhdGhpcy5wcm9wcy5zZWxlY3RlZEZlYXR1cmVJbmRleGVzKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICghdGhpcy5wcm9wcy5zZWxlY3RlZEZlYXR1cmVJbmRleGVzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCBmZWF0dXJlSW5kZXggPSB0aGlzLnByb3BzLmRhdGEuZmVhdHVyZXMuaW5kZXhPZihmZWF0dXJlKTtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5zZWxlY3RlZEZlYXR1cmVJbmRleGVzLmluY2x1ZGVzKGZlYXR1cmVJbmRleCk7XG4gIH1cblxuICBnZXRQaWNraW5nSW5mbyh7IGluZm8sIHNvdXJjZUxheWVyIH06IE9iamVjdCkge1xuICAgIGlmIChzb3VyY2VMYXllci5pZC5lbmRzV2l0aCgnZWRpdEhhbmRsZXMnKSkge1xuICAgICAgLy8gSWYgdXNlciBpcyBwaWNraW5nIGFuIGVkaXRpbmcgaGFuZGxlLCBhZGQgYWRkaXRpb25hbCBkYXRhIHRvIHRoZSBpbmZvXG4gICAgICBpbmZvLmlzRWRpdGluZ0hhbmRsZSA9IHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGluZm87XG4gIH1cblxuICBjcmVhdGVFZGl0SGFuZGxlTGF5ZXJzKCkge1xuICAgIGlmICghdGhpcy5zdGF0ZS5lZGl0SGFuZGxlcy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBjb25zdCBzaGFyZWRQcm9wcyA9IHtcbiAgICAgIGlkOiAnZWRpdEhhbmRsZXMnLFxuICAgICAgZGF0YTogdGhpcy5zdGF0ZS5lZGl0SGFuZGxlcyxcbiAgICAgIGZwNjQ6IHRoaXMucHJvcHMuZnA2NCxcblxuICAgICAgcGFyYW1ldGVyczogdGhpcy5wcm9wcy5lZGl0SGFuZGxlUGFyYW1ldGVycyxcbiAgICAgIC4uLnRoaXMucHJvcHMuZWRpdEhhbmRsZUxheWVyUHJvcHNcbiAgICB9O1xuXG4gICAgbGV0IGxheWVyO1xuXG4gICAgc3dpdGNoICh0aGlzLnByb3BzLmVkaXRIYW5kbGVUeXBlKSB7XG4gICAgICBjYXNlICdpY29uJzpcbiAgICAgICAgY29uc3QgRWRpdEhhbmRsZUljb25MYXllciA9IHRoaXMuZ2V0U3ViTGF5ZXJDbGFzcygnZWRpdEhhbmRsZXMnLCBJY29uTGF5ZXIpO1xuXG4gICAgICAgIGxheWVyID0gbmV3IEVkaXRIYW5kbGVJY29uTGF5ZXIoXG4gICAgICAgICAgdGhpcy5nZXRTdWJMYXllclByb3BzKHtcbiAgICAgICAgICAgIC4uLnNoYXJlZFByb3BzLFxuICAgICAgICAgICAgaWNvbkF0bGFzOiB0aGlzLnByb3BzLmVkaXRIYW5kbGVJY29uQXRsYXMsXG4gICAgICAgICAgICBpY29uTWFwcGluZzogdGhpcy5wcm9wcy5lZGl0SGFuZGxlSWNvbk1hcHBpbmcsXG4gICAgICAgICAgICBzaXplU2NhbGU6IHRoaXMucHJvcHMuZWRpdEhhbmRsZUljb25TaXplU2NhbGUsXG4gICAgICAgICAgICBnZXRJY29uOiB0aGlzLnByb3BzLmdldEVkaXRIYW5kbGVJY29uLFxuICAgICAgICAgICAgZ2V0U2l6ZTogdGhpcy5wcm9wcy5nZXRFZGl0SGFuZGxlSWNvblNpemUsXG4gICAgICAgICAgICBnZXRDb2xvcjogdGhpcy5wcm9wcy5nZXRFZGl0SGFuZGxlSWNvbkNvbG9yLFxuICAgICAgICAgICAgZ2V0QW5nbGU6IHRoaXMucHJvcHMuZ2V0RWRpdEhhbmRsZUljb25BbmdsZSxcblxuICAgICAgICAgICAgZ2V0UG9zaXRpb246IGQgPT4gZC5wb3NpdGlvblxuICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdwb2ludCc6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBjb25zdCBFZGl0SGFuZGxlUG9pbnRMYXllciA9IHRoaXMuZ2V0U3ViTGF5ZXJDbGFzcygnZWRpdEhhbmRsZXMnLCBTY2F0dGVycGxvdExheWVyKTtcblxuICAgICAgICBsYXllciA9IG5ldyBFZGl0SGFuZGxlUG9pbnRMYXllcihcbiAgICAgICAgICB0aGlzLmdldFN1YkxheWVyUHJvcHMoe1xuICAgICAgICAgICAgLi4uc2hhcmVkUHJvcHMsXG5cbiAgICAgICAgICAgIC8vIFByb3h5IGVkaXRpbmcgcG9pbnQgcHJvcHNcbiAgICAgICAgICAgIHJhZGl1c1NjYWxlOiB0aGlzLnByb3BzLmVkaXRIYW5kbGVQb2ludFJhZGl1c1NjYWxlLFxuICAgICAgICAgICAgb3V0bGluZTogdGhpcy5wcm9wcy5lZGl0SGFuZGxlUG9pbnRPdXRsaW5lLFxuICAgICAgICAgICAgc3Ryb2tlV2lkdGg6IHRoaXMucHJvcHMuZWRpdEhhbmRsZVBvaW50U3Ryb2tlV2lkdGgsXG4gICAgICAgICAgICByYWRpdXNNaW5QaXhlbHM6IHRoaXMucHJvcHMuZWRpdEhhbmRsZVBvaW50UmFkaXVzTWluUGl4ZWxzLFxuICAgICAgICAgICAgcmFkaXVzTWF4UGl4ZWxzOiB0aGlzLnByb3BzLmVkaXRIYW5kbGVQb2ludFJhZGl1c01heFBpeGVscyxcbiAgICAgICAgICAgIGdldFJhZGl1czogdGhpcy5wcm9wcy5nZXRFZGl0SGFuZGxlUG9pbnRSYWRpdXMsXG4gICAgICAgICAgICBnZXRDb2xvcjogdGhpcy5wcm9wcy5nZXRFZGl0SGFuZGxlUG9pbnRDb2xvclxuICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiBbbGF5ZXJdO1xuICB9XG5cbiAgY3JlYXRlVGVudGF0aXZlTGF5ZXJzKCkge1xuICAgIGlmICghdGhpcy5zdGF0ZS50ZW50YXRpdmVGZWF0dXJlKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgY29uc3QgbGF5ZXIgPSBuZXcgR2VvSnNvbkxheWVyKFxuICAgICAgdGhpcy5nZXRTdWJMYXllclByb3BzKHtcbiAgICAgICAgaWQ6ICd0ZW50YXRpdmUnLFxuICAgICAgICBkYXRhOiB0aGlzLnN0YXRlLnRlbnRhdGl2ZUZlYXR1cmUsXG4gICAgICAgIGZwNjQ6IHRoaXMucHJvcHMuZnA2NCxcbiAgICAgICAgcGlja2FibGU6IGZhbHNlLFxuICAgICAgICBzdHJva2VkOiB0cnVlLFxuICAgICAgICBhdXRvSGlnaGxpZ2h0OiBmYWxzZSxcbiAgICAgICAgbGluZVdpZHRoU2NhbGU6IHRoaXMucHJvcHMubGluZVdpZHRoU2NhbGUsXG4gICAgICAgIGxpbmVXaWR0aE1pblBpeGVsczogdGhpcy5wcm9wcy5saW5lV2lkdGhNaW5QaXhlbHMsXG4gICAgICAgIGxpbmVXaWR0aE1heFBpeGVsczogdGhpcy5wcm9wcy5saW5lV2lkdGhNYXhQaXhlbHMsXG4gICAgICAgIGxpbmVXaWR0aFVuaXRzOiB0aGlzLnByb3BzLmxpbmVXaWR0aFVuaXRzLFxuICAgICAgICBsaW5lSm9pbnRSb3VuZGVkOiB0aGlzLnByb3BzLmxpbmVKb2ludFJvdW5kZWQsXG4gICAgICAgIGxpbmVNaXRlckxpbWl0OiB0aGlzLnByb3BzLmxpbmVNaXRlckxpbWl0LFxuICAgICAgICBwb2ludFJhZGl1c1NjYWxlOiB0aGlzLnByb3BzLmVkaXRIYW5kbGVQb2ludFJhZGl1c1NjYWxlLFxuICAgICAgICBvdXRsaW5lOiB0aGlzLnByb3BzLmVkaXRIYW5kbGVQb2ludE91dGxpbmUsXG4gICAgICAgIHN0cm9rZVdpZHRoOiB0aGlzLnByb3BzLmVkaXRIYW5kbGVQb2ludFN0cm9rZVdpZHRoLFxuICAgICAgICBwb2ludFJhZGl1c01pblBpeGVsczogdGhpcy5wcm9wcy5lZGl0SGFuZGxlUG9pbnRSYWRpdXNNaW5QaXhlbHMsXG4gICAgICAgIHBvaW50UmFkaXVzTWF4UGl4ZWxzOiB0aGlzLnByb3BzLmVkaXRIYW5kbGVQb2ludFJhZGl1c01heFBpeGVscyxcbiAgICAgICAgZ2V0UmFkaXVzOiB0aGlzLnByb3BzLmdldEVkaXRIYW5kbGVQb2ludFJhZGl1cyxcbiAgICAgICAgZ2V0TGluZUNvbG9yOiBmZWF0dXJlID0+IHRoaXMucHJvcHMuZ2V0VGVudGF0aXZlTGluZUNvbG9yKGZlYXR1cmUsIHRoaXMucHJvcHMubW9kZSksXG4gICAgICAgIGdldExpbmVXaWR0aDogZmVhdHVyZSA9PiB0aGlzLnByb3BzLmdldFRlbnRhdGl2ZUxpbmVXaWR0aChmZWF0dXJlLCB0aGlzLnByb3BzLm1vZGUpLFxuICAgICAgICBnZXRGaWxsQ29sb3I6IGZlYXR1cmUgPT4gdGhpcy5wcm9wcy5nZXRUZW50YXRpdmVGaWxsQ29sb3IoZmVhdHVyZSwgdGhpcy5wcm9wcy5tb2RlKSxcbiAgICAgICAgZ2V0TGluZURhc2hBcnJheTogZmVhdHVyZSA9PlxuICAgICAgICAgIHRoaXMucHJvcHMuZ2V0VGVudGF0aXZlTGluZURhc2hBcnJheShcbiAgICAgICAgICAgIGZlYXR1cmUsXG4gICAgICAgICAgICB0aGlzLnN0YXRlLnNlbGVjdGVkRmVhdHVyZXNbMF0sXG4gICAgICAgICAgICB0aGlzLnByb3BzLm1vZGVcbiAgICAgICAgICApXG4gICAgICB9KVxuICAgICk7XG5cbiAgICByZXR1cm4gW2xheWVyXTtcbiAgfVxuXG4gIHVwZGF0ZVRlbnRhdGl2ZUZlYXR1cmUoKSB7XG4gICAgY29uc3QgdGVudGF0aXZlRmVhdHVyZSA9IHRoaXMuc3RhdGUubW9kZUhhbmRsZXIuZ2V0VGVudGF0aXZlRmVhdHVyZSgpO1xuICAgIGlmICh0ZW50YXRpdmVGZWF0dXJlICE9PSB0aGlzLnN0YXRlLnRlbnRhdGl2ZUZlYXR1cmUpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyB0ZW50YXRpdmVGZWF0dXJlIH0pO1xuICAgICAgdGhpcy5zZXRMYXllck5lZWRzVXBkYXRlKCk7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlRWRpdEhhbmRsZXMocGlja3M/OiBBcnJheTxPYmplY3Q+LCBncm91bmRDb29yZHM/OiBQb3NpdGlvbikge1xuICAgIGNvbnN0IGVkaXRIYW5kbGVzID0gdGhpcy5zdGF0ZS5tb2RlSGFuZGxlci5nZXRFZGl0SGFuZGxlcyhwaWNrcywgZ3JvdW5kQ29vcmRzKTtcbiAgICBpZiAoZWRpdEhhbmRsZXMgIT09IHRoaXMuc3RhdGUuZWRpdEhhbmRsZXMpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBlZGl0SGFuZGxlcyB9KTtcbiAgICAgIHRoaXMuc2V0TGF5ZXJOZWVkc1VwZGF0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIG9uTGF5ZXJDbGljayhldmVudDogQ2xpY2tFdmVudCkge1xuICAgIGNvbnN0IGVkaXRBY3Rpb24gPSB0aGlzLnN0YXRlLm1vZGVIYW5kbGVyLmhhbmRsZUNsaWNrKGV2ZW50KTtcbiAgICB0aGlzLnVwZGF0ZVRlbnRhdGl2ZUZlYXR1cmUoKTtcbiAgICB0aGlzLnVwZGF0ZUVkaXRIYW5kbGVzKCk7XG5cbiAgICBpZiAoZWRpdEFjdGlvbikge1xuICAgICAgdGhpcy5wcm9wcy5vbkVkaXQoZWRpdEFjdGlvbik7XG4gICAgfVxuICB9XG5cbiAgb25TdGFydERyYWdnaW5nKGV2ZW50OiBTdGFydERyYWdnaW5nRXZlbnQpIHtcbiAgICBjb25zdCBlZGl0QWN0aW9uID0gdGhpcy5zdGF0ZS5tb2RlSGFuZGxlci5oYW5kbGVTdGFydERyYWdnaW5nKGV2ZW50KTtcbiAgICB0aGlzLnVwZGF0ZVRlbnRhdGl2ZUZlYXR1cmUoKTtcbiAgICB0aGlzLnVwZGF0ZUVkaXRIYW5kbGVzKCk7XG5cbiAgICBpZiAoZWRpdEFjdGlvbikge1xuICAgICAgdGhpcy5wcm9wcy5vbkVkaXQoZWRpdEFjdGlvbik7XG4gICAgfVxuICB9XG5cbiAgb25TdG9wRHJhZ2dpbmcoZXZlbnQ6IFN0b3BEcmFnZ2luZ0V2ZW50KSB7XG4gICAgY29uc3QgZWRpdEFjdGlvbiA9IHRoaXMuc3RhdGUubW9kZUhhbmRsZXIuaGFuZGxlU3RvcERyYWdnaW5nKGV2ZW50KTtcbiAgICB0aGlzLnVwZGF0ZVRlbnRhdGl2ZUZlYXR1cmUoKTtcbiAgICB0aGlzLnVwZGF0ZUVkaXRIYW5kbGVzKCk7XG5cbiAgICBpZiAoZWRpdEFjdGlvbikge1xuICAgICAgdGhpcy5wcm9wcy5vbkVkaXQoZWRpdEFjdGlvbik7XG4gICAgfVxuICB9XG5cbiAgb25Qb2ludGVyTW92ZShldmVudDogUG9pbnRlck1vdmVFdmVudCkge1xuICAgIGNvbnN0IHsgZ3JvdW5kQ29vcmRzLCBwaWNrcywgc291cmNlRXZlbnQgfSA9IGV2ZW50O1xuXG4gICAgY29uc3QgeyBlZGl0QWN0aW9uLCBjYW5jZWxNYXBQYW4gfSA9IHRoaXMuc3RhdGUubW9kZUhhbmRsZXIuaGFuZGxlUG9pbnRlck1vdmUoZXZlbnQpO1xuICAgIHRoaXMudXBkYXRlVGVudGF0aXZlRmVhdHVyZSgpO1xuICAgIHRoaXMudXBkYXRlRWRpdEhhbmRsZXMocGlja3MsIGdyb3VuZENvb3Jkcyk7XG5cbiAgICBpZiAoY2FuY2VsTWFwUGFuKSB7XG4gICAgICAvLyBUT0RPOiBmaW5kIGEgbGVzcyBoYWNreSB3YXkgdG8gcHJldmVudCBtYXAgcGFubmluZ1xuICAgICAgLy8gU3RvcCBwcm9wYWdhdGlvbiB0byBwcmV2ZW50IG1hcCBwYW5uaW5nIHdoaWxlIGRyYWdnaW5nIGFuIGVkaXQgaGFuZGxlXG4gICAgICBzb3VyY2VFdmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG5cbiAgICBpZiAoZWRpdEFjdGlvbikge1xuICAgICAgdGhpcy5wcm9wcy5vbkVkaXQoZWRpdEFjdGlvbik7XG4gICAgfVxuICB9XG5cbiAgZ2V0Q3Vyc29yKHsgaXNEcmFnZ2luZyB9OiB7IGlzRHJhZ2dpbmc6IGJvb2xlYW4gfSkge1xuICAgIHJldHVybiB0aGlzLnN0YXRlLm1vZGVIYW5kbGVyLmdldEN1cnNvcih7IGlzRHJhZ2dpbmcgfSk7XG4gIH1cbn1cblxuRWRpdGFibGVHZW9Kc29uTGF5ZXIubGF5ZXJOYW1lID0gJ0VkaXRhYmxlR2VvSnNvbkxheWVyJztcbkVkaXRhYmxlR2VvSnNvbkxheWVyLmRlZmF1bHRQcm9wcyA9IGRlZmF1bHRQcm9wcztcbiJdfQ==