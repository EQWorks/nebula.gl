"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _keplerOutdatedDeck = require("kepler-outdated-deck.gl-layers");

var _editModes = require("@nebula.gl/edit-modes");

var _editableLayerEditModePoc = _interopRequireDefault(require("./editable-layer-edit-mode-poc.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
var DEFAULT_EDIT_MODE = new _editModes.ViewMode();

function getEditHandleColor(handle) {
  switch (handle.sourceFeature.feature.properties.editHandleType) {
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
  switch (handle.sourceFeature.feature.properties.editHandleType) {
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
    return handle.sourceFeature.feature.properties.editHandleType;
  },
  getEditHandleIconSize: 10,
  getEditHandleIconColor: getEditHandleColor,
  getEditHandleIconAngle: 0,
  // misc
  billboard: true,
  // Mode handlers
  modeHandlers: {
    view: new _editModes.ViewMode(),
    // Alter modes
    modify: new _editModes.ModifyMode(),
    translate: new _editModes.SnappableMode(new _editModes.TranslateMode()),
    scale: new _editModes.ScaleMode(),
    rotate: new _editModes.RotateMode(),
    duplicate: new _editModes.DuplicateMode(),
    split: new _editModes.SplitPolygonMode(),
    extrude: new _editModes.ExtrudeMode(),
    elevation: new _editModes.ElevationMode(),
    // Draw modes
    drawPoint: new _editModes.DrawPointMode(),
    drawLineString: new _editModes.DrawLineStringMode(),
    drawPolygon: new _editModes.DrawPolygonMode(),
    drawRectangle: new _editModes.DrawRectangleMode(),
    drawCircleFromCenter: new _editModes.DrawCircleFromCenterMode(),
    drawCircleByBoundingBox: new _editModes.DrawCircleByBoundingBoxMode(),
    drawEllipseByBoundingBox: new _editModes.DrawEllipseByBoundingBoxMode(),
    drawRectangleUsing3Points: new _editModes.DrawRectangleUsingThreePointsMode(),
    drawEllipseUsing3Points: new _editModes.DrawEllipseUsingThreePointsMode(),
    draw90DegreePolygon: new _editModes.Draw90DegreePolygonMode()
  }
};

// type State = {
//   modeHandler: EditableFeatureCollection,
//   tentativeFeature: ?Feature,
//   editHandles: any[],
//   selectedFeatures: Feature[]
// };
var EditableGeoJsonLayerEditModePoc =
/*#__PURE__*/
function (_EditableLayer) {
  _inherits(EditableGeoJsonLayerEditModePoc, _EditableLayer);

  function EditableGeoJsonLayerEditModePoc() {
    _classCallCheck(this, EditableGeoJsonLayerEditModePoc);

    return _possibleConstructorReturn(this, _getPrototypeOf(EditableGeoJsonLayerEditModePoc).apply(this, arguments));
  }

  _createClass(EditableGeoJsonLayerEditModePoc, [{
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
      var layers = [new _keplerOutdatedDeck.GeoJsonLayer(subLayerProps)];
      layers = layers.concat(this.createGuidesLayers());
      return layers;
    }
  }, {
    key: "initializeState",
    value: function initializeState() {
      _get(_getPrototypeOf(EditableGeoJsonLayerEditModePoc.prototype), "initializeState", this).call(this);

      this.setState({
        selectedFeatures: [],
        editHandles: []
      });
    } // TODO: is this the best way to properly update state from an outside event handler?

  }, {
    key: "shouldUpdateState",
    value: function shouldUpdateState(opts) {
      // console.log(
      //   'shouldUpdateState',
      //   opts.changeFlags.propsOrDataChanged,
      //   opts.changeFlags.stateChanged
      // );
      return _get(_getPrototypeOf(EditableGeoJsonLayerEditModePoc.prototype), "shouldUpdateState", this).call(this, opts) || opts.changeFlags.stateChanged;
    }
  }, {
    key: "updateState",
    value: function updateState(_ref) {
      var props = _ref.props,
          oldProps = _ref.oldProps,
          changeFlags = _ref.changeFlags;

      _get(_getPrototypeOf(EditableGeoJsonLayerEditModePoc.prototype), "updateState", this).call(this, {
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

            modeHandler = DEFAULT_EDIT_MODE;
          }

          if (modeHandler !== this.state.modeHandler) {
            this.setState({
              modeHandler: modeHandler,
              cursor: null
            });
          }
        }
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
    key: "getModeProps",
    value: function getModeProps(props) {
      var _this = this;

      return {
        modeConfig: props.modeConfig,
        data: props.data,
        selectedIndexes: props.selectedFeatureIndexes,
        lastPointerMoveEvent: this.state.lastPointerMoveEvent,
        cursor: this.state.cursor,
        onEdit: function onEdit(editAction) {
          props.onEdit(editAction);
        },
        onUpdateCursor: function onUpdateCursor(cursor) {
          _this.setState({
            cursor: cursor
          });
        }
      };
    }
  }, {
    key: "selectionAwareAccessor",
    value: function selectionAwareAccessor(accessor) {
      var _this2 = this;

      if (typeof accessor !== 'function') {
        return accessor;
      }

      return function (feature) {
        return accessor(feature, _this2.isFeatureSelected(feature), _this2.props.mode);
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
    value: function getPickingInfo(_ref2) {
      var info = _ref2.info,
          sourceLayer = _ref2.sourceLayer;

      if (sourceLayer.id.endsWith('guides')) {
        // If user is picking an editing handle, add additional data to the info
        info.isGuide = true;
      }

      return info;
    }
  }, {
    key: "createGuidesLayers",
    value: function createGuidesLayers() {
      var mode = this.props.modeHandlers[this.props.mode] || DEFAULT_EDIT_MODE;
      var guides = mode.getGuides(this.getModeProps(this.props));

      if (!guides || !guides.features.length) {
        return [];
      }

      var pointLayerProps;

      if (this.props.editHandleType === 'icon') {
        pointLayerProps = {
          type: _keplerOutdatedDeck.IconLayer,
          iconAtlas: this.props.editHandleIconAtlas,
          iconMapping: this.props.editHandleIconMapping,
          sizeScale: this.props.editHandleIconSizeScale,
          getIcon: this.props.getEditHandleIcon,
          getSize: this.props.getEditHandleIconSize,
          getColor: this.props.getEditHandleIconColor,
          getAngle: this.props.getEditHandleIconAngle
        };
      } else {
        pointLayerProps = {
          type: _keplerOutdatedDeck.ScatterplotLayer,
          radiusScale: this.props.editHandlePointRadiusScale,
          stroked: this.props.editHandlePointOutline,
          getLineWidth: this.props.editHandlePointStrokeWidth,
          radiusMinPixels: this.props.editHandlePointRadiusMinPixels,
          radiusMaxPixels: this.props.editHandlePointRadiusMaxPixels,
          getRadius: this.props.getEditHandlePointRadius,
          getFillColor: this.props.getEditHandlePointColor,
          getlineColor: this.props.getEditHandlePointColor
        };
      }

      var layer = new _keplerOutdatedDeck.GeoJsonLayer(this.getSubLayerProps({
        id: "guides",
        data: guides,
        fp64: this.props.fp64,
        _subLayerProps: {
          points: pointLayerProps
        },
        lineWidthScale: this.props.lineWidthScale,
        lineWidthMinPixels: this.props.lineWidthMinPixels,
        lineWidthMaxPixels: this.props.lineWidthMaxPixels,
        lineWidthUnits: this.props.lineWidthUnits,
        lineJointRounded: this.props.lineJointRounded,
        lineMiterLimit: this.props.lineMiterLimit,
        getLineColor: this.props.getTentativeLineColor,
        getLineWidth: this.props.getTentativeLineWidth,
        getFillColor: this.props.getTentativeFillColor,
        getLineDashArray: this.props.getTentativeLineDashArray
      }));
      return [layer];
    }
  }, {
    key: "onLayerClick",
    value: function onLayerClick(event) {
      this.getActiveModeHandler().handleClick(event, this.getModeProps(this.props));
    }
  }, {
    key: "onStartDragging",
    value: function onStartDragging(event) {
      this.getActiveModeHandler().handleStartDragging(event, this.getModeProps(this.props));
    }
  }, {
    key: "onStopDragging",
    value: function onStopDragging(event) {
      this.getActiveModeHandler().handleStopDragging(event, this.getModeProps(this.props));
    }
  }, {
    key: "onPointerMove",
    value: function onPointerMove(event) {
      this.setState({
        lastPointerMoveEvent: event
      });
      this.getActiveModeHandler().handlePointerMove(event, this.getModeProps(this.props));
    }
  }, {
    key: "getCursor",
    value: function getCursor(_ref3) {
      var isDragging = _ref3.isDragging;
      var cursor = this.state.cursor;

      if (!cursor) {
        cursor = isDragging ? 'grabbing' : 'grab';
      }

      return cursor;
    }
  }, {
    key: "getActiveModeHandler",
    value: function getActiveModeHandler() {
      return this.state.modeHandler;
    }
  }]);

  return EditableGeoJsonLayerEditModePoc;
}(_editableLayerEditModePoc.default);

exports.default = EditableGeoJsonLayerEditModePoc;
EditableGeoJsonLayerEditModePoc.layerName = 'EditableGeoJsonLayerEditModePoc';
EditableGeoJsonLayerEditModePoc.defaultProps = defaultProps;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sYXllcnMvZWRpdGFibGUtZ2VvanNvbi1sYXllci1lZGl0LW1vZGUtcG9jLmpzIl0sIm5hbWVzIjpbIkRFRkFVTFRfTElORV9DT0xPUiIsIkRFRkFVTFRfRklMTF9DT0xPUiIsIkRFRkFVTFRfU0VMRUNURURfTElORV9DT0xPUiIsIkRFRkFVTFRfU0VMRUNURURfRklMTF9DT0xPUiIsIkRFRkFVTFRfRURJVElOR19FWElTVElOR19QT0lOVF9DT0xPUiIsIkRFRkFVTFRfRURJVElOR19JTlRFUk1FRElBVEVfUE9JTlRfQ09MT1IiLCJERUZBVUxUX0VESVRJTkdfU05BUF9QT0lOVF9DT0xPUiIsIkRFRkFVTFRfRURJVElOR19FWElTVElOR19QT0lOVF9SQURJVVMiLCJERUZBVUxUX0VESVRJTkdfSU5URVJNRURJQVRFX1BPSU5UX1JBRElVUyIsIkRFRkFVTFRfRURJVElOR19TTkFQX1BPSU5UX1JBRElVUyIsIkRFRkFVTFRfRURJVF9NT0RFIiwiVmlld01vZGUiLCJnZXRFZGl0SGFuZGxlQ29sb3IiLCJoYW5kbGUiLCJzb3VyY2VGZWF0dXJlIiwiZmVhdHVyZSIsInByb3BlcnRpZXMiLCJlZGl0SGFuZGxlVHlwZSIsImdldEVkaXRIYW5kbGVSYWRpdXMiLCJkZWZhdWx0UHJvcHMiLCJtb2RlIiwib25FZGl0IiwicGlja2FibGUiLCJwaWNraW5nUmFkaXVzIiwicGlja2luZ0RlcHRoIiwiZnA2NCIsImZpbGxlZCIsInN0cm9rZWQiLCJsaW5lV2lkdGhTY2FsZSIsImxpbmVXaWR0aE1pblBpeGVscyIsImxpbmVXaWR0aE1heFBpeGVscyIsIk51bWJlciIsIk1BWF9TQUZFX0lOVEVHRVIiLCJsaW5lV2lkdGhVbml0cyIsImxpbmVKb2ludFJvdW5kZWQiLCJsaW5lTWl0ZXJMaW1pdCIsInBvaW50UmFkaXVzU2NhbGUiLCJwb2ludFJhZGl1c01pblBpeGVscyIsInBvaW50UmFkaXVzTWF4UGl4ZWxzIiwibGluZURhc2hKdXN0aWZpZWQiLCJnZXRMaW5lQ29sb3IiLCJpc1NlbGVjdGVkIiwiZ2V0RmlsbENvbG9yIiwiZ2V0UmFkaXVzIiwiZiIsInJhZGl1cyIsInNpemUiLCJnZXRMaW5lV2lkdGgiLCJsaW5lV2lkdGgiLCJnZXRMaW5lRGFzaEFycmF5IiwiZ2V0VGVudGF0aXZlTGluZURhc2hBcnJheSIsImdldFRlbnRhdGl2ZUxpbmVDb2xvciIsImdldFRlbnRhdGl2ZUZpbGxDb2xvciIsImdldFRlbnRhdGl2ZUxpbmVXaWR0aCIsImVkaXRIYW5kbGVQb2ludFJhZGl1c1NjYWxlIiwiZWRpdEhhbmRsZVBvaW50T3V0bGluZSIsImVkaXRIYW5kbGVQb2ludFN0cm9rZVdpZHRoIiwiZWRpdEhhbmRsZVBvaW50UmFkaXVzTWluUGl4ZWxzIiwiZWRpdEhhbmRsZVBvaW50UmFkaXVzTWF4UGl4ZWxzIiwiZ2V0RWRpdEhhbmRsZVBvaW50Q29sb3IiLCJnZXRFZGl0SGFuZGxlUG9pbnRSYWRpdXMiLCJlZGl0SGFuZGxlSWNvbkF0bGFzIiwiZWRpdEhhbmRsZUljb25NYXBwaW5nIiwiZWRpdEhhbmRsZUljb25TaXplU2NhbGUiLCJnZXRFZGl0SGFuZGxlSWNvbiIsImdldEVkaXRIYW5kbGVJY29uU2l6ZSIsImdldEVkaXRIYW5kbGVJY29uQ29sb3IiLCJnZXRFZGl0SGFuZGxlSWNvbkFuZ2xlIiwiYmlsbGJvYXJkIiwibW9kZUhhbmRsZXJzIiwidmlldyIsIm1vZGlmeSIsIk1vZGlmeU1vZGUiLCJ0cmFuc2xhdGUiLCJTbmFwcGFibGVNb2RlIiwiVHJhbnNsYXRlTW9kZSIsInNjYWxlIiwiU2NhbGVNb2RlIiwicm90YXRlIiwiUm90YXRlTW9kZSIsImR1cGxpY2F0ZSIsIkR1cGxpY2F0ZU1vZGUiLCJzcGxpdCIsIlNwbGl0UG9seWdvbk1vZGUiLCJleHRydWRlIiwiRXh0cnVkZU1vZGUiLCJlbGV2YXRpb24iLCJFbGV2YXRpb25Nb2RlIiwiZHJhd1BvaW50IiwiRHJhd1BvaW50TW9kZSIsImRyYXdMaW5lU3RyaW5nIiwiRHJhd0xpbmVTdHJpbmdNb2RlIiwiZHJhd1BvbHlnb24iLCJEcmF3UG9seWdvbk1vZGUiLCJkcmF3UmVjdGFuZ2xlIiwiRHJhd1JlY3RhbmdsZU1vZGUiLCJkcmF3Q2lyY2xlRnJvbUNlbnRlciIsIkRyYXdDaXJjbGVGcm9tQ2VudGVyTW9kZSIsImRyYXdDaXJjbGVCeUJvdW5kaW5nQm94IiwiRHJhd0NpcmNsZUJ5Qm91bmRpbmdCb3hNb2RlIiwiZHJhd0VsbGlwc2VCeUJvdW5kaW5nQm94IiwiRHJhd0VsbGlwc2VCeUJvdW5kaW5nQm94TW9kZSIsImRyYXdSZWN0YW5nbGVVc2luZzNQb2ludHMiLCJEcmF3UmVjdGFuZ2xlVXNpbmdUaHJlZVBvaW50c01vZGUiLCJkcmF3RWxsaXBzZVVzaW5nM1BvaW50cyIsIkRyYXdFbGxpcHNlVXNpbmdUaHJlZVBvaW50c01vZGUiLCJkcmF3OTBEZWdyZWVQb2x5Z29uIiwiRHJhdzkwRGVncmVlUG9seWdvbk1vZGUiLCJFZGl0YWJsZUdlb0pzb25MYXllckVkaXRNb2RlUG9jIiwic3ViTGF5ZXJQcm9wcyIsImdldFN1YkxheWVyUHJvcHMiLCJpZCIsImRhdGEiLCJwcm9wcyIsInNlbGVjdGlvbkF3YXJlQWNjZXNzb3IiLCJfc3ViTGF5ZXJQcm9wcyIsInVwZGF0ZVRyaWdnZXJzIiwic2VsZWN0ZWRGZWF0dXJlSW5kZXhlcyIsImxheWVycyIsIkdlb0pzb25MYXllciIsImNvbmNhdCIsImNyZWF0ZUd1aWRlc0xheWVycyIsInNldFN0YXRlIiwic2VsZWN0ZWRGZWF0dXJlcyIsImVkaXRIYW5kbGVzIiwib3B0cyIsImNoYW5nZUZsYWdzIiwic3RhdGVDaGFuZ2VkIiwib2xkUHJvcHMiLCJtb2RlSGFuZGxlciIsInN0YXRlIiwicHJvcHNPckRhdGFDaGFuZ2VkIiwiY29uc29sZSIsIndhcm4iLCJjdXJzb3IiLCJBcnJheSIsImlzQXJyYXkiLCJtYXAiLCJlbGVtIiwiZmVhdHVyZXMiLCJtb2RlQ29uZmlnIiwic2VsZWN0ZWRJbmRleGVzIiwibGFzdFBvaW50ZXJNb3ZlRXZlbnQiLCJlZGl0QWN0aW9uIiwib25VcGRhdGVDdXJzb3IiLCJhY2Nlc3NvciIsImlzRmVhdHVyZVNlbGVjdGVkIiwibGVuZ3RoIiwiZmVhdHVyZUluZGV4IiwiaW5kZXhPZiIsImluY2x1ZGVzIiwiaW5mbyIsInNvdXJjZUxheWVyIiwiZW5kc1dpdGgiLCJpc0d1aWRlIiwiZ3VpZGVzIiwiZ2V0R3VpZGVzIiwiZ2V0TW9kZVByb3BzIiwicG9pbnRMYXllclByb3BzIiwidHlwZSIsIkljb25MYXllciIsImljb25BdGxhcyIsImljb25NYXBwaW5nIiwic2l6ZVNjYWxlIiwiZ2V0SWNvbiIsImdldFNpemUiLCJnZXRDb2xvciIsImdldEFuZ2xlIiwiU2NhdHRlcnBsb3RMYXllciIsInJhZGl1c1NjYWxlIiwicmFkaXVzTWluUGl4ZWxzIiwicmFkaXVzTWF4UGl4ZWxzIiwiZ2V0bGluZUNvbG9yIiwibGF5ZXIiLCJwb2ludHMiLCJldmVudCIsImdldEFjdGl2ZU1vZGVIYW5kbGVyIiwiaGFuZGxlQ2xpY2siLCJoYW5kbGVTdGFydERyYWdnaW5nIiwiaGFuZGxlU3RvcERyYWdnaW5nIiwiaGFuZGxlUG9pbnRlck1vdmUiLCJpc0RyYWdnaW5nIiwiRWRpdGFibGVMYXllciIsImxheWVyTmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUdBOztBQUVBOztBQWdDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxrQkFBa0IsR0FBRyxDQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsR0FBWCxFQUFnQixJQUFoQixDQUEzQjtBQUNBLElBQU1DLGtCQUFrQixHQUFHLENBQUMsR0FBRCxFQUFNLEdBQU4sRUFBVyxHQUFYLEVBQWdCLElBQWhCLENBQTNCO0FBQ0EsSUFBTUMsMkJBQTJCLEdBQUcsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FBcEM7QUFDQSxJQUFNQywyQkFBMkIsR0FBRyxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixDQUFwQztBQUNBLElBQU1DLG9DQUFv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QUFLbEIsWUFBTCxDQUFrQixLQUFLNUMsS0FBdkIsQ0FBdEQ7QUFDRDs7O2tDQUVhOEQsSyxFQUF5QjtBQUNyQyxXQUFLckQsUUFBTCxDQUFjO0FBQUVvQixRQUFBQSxvQkFBb0IsRUFBRWlDO0FBQXhCLE9BQWQ7QUFDQSxXQUFLQyxvQkFBTCxHQUE0QkksaUJBQTVCLENBQThDTCxLQUE5QyxFQUFxRCxLQUFLbEIsWUFBTCxDQUFrQixLQUFLNUMsS0FBdkIsQ0FBckQ7QUFDRDs7O3FDQUVrRDtBQUFBLFVBQXZDb0UsVUFBdUMsU0FBdkNBLFVBQXVDO0FBQUEsVUFDM0MvQyxNQUQyQyxHQUNoQyxLQUFLSixLQUQyQixDQUMzQ0ksTUFEMkM7O0FBRWpELFVBQUksQ0FBQ0EsTUFBTCxFQUFhO0FBQ1hBLFFBQUFBLE1BQU0sR0FBRytDLFVBQVUsR0FBRyxVQUFILEdBQWdCLE1BQW5DO0FBQ0Q7O0FBQ0QsYUFBTy9DLE1BQVA7QUFDRDs7OzJDQUV1QztBQUN0QyxhQUFPLEtBQUtKLEtBQUwsQ0FBV0QsV0FBbEI7QUFDRDs7OztFQS9PMERxRCxpQzs7O0FBa1A3RDFFLCtCQUErQixDQUFDMkUsU0FBaEMsR0FBNEMsaUNBQTVDO0FBQ0EzRSwrQkFBK0IsQ0FBQ3pGLFlBQWhDLEdBQStDQSxZQUEvQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG4vKiBlc2xpbnQtZW52IGJyb3dzZXIgKi9cblxuaW1wb3J0IHsgR2VvSnNvbkxheWVyLCBTY2F0dGVycGxvdExheWVyLCBJY29uTGF5ZXIgfSBmcm9tICdrZXBsZXItb3V0ZGF0ZWQtZGVjay5nbC1sYXllcnMnO1xuXG5pbXBvcnQge1xuICBWaWV3TW9kZSxcbiAgTW9kaWZ5TW9kZSxcbiAgVHJhbnNsYXRlTW9kZSxcbiAgU2NhbGVNb2RlLFxuICBSb3RhdGVNb2RlLFxuICBEdXBsaWNhdGVNb2RlLFxuICBTcGxpdFBvbHlnb25Nb2RlLFxuICBFeHRydWRlTW9kZSxcbiAgRWxldmF0aW9uTW9kZSxcbiAgRHJhd1BvaW50TW9kZSxcbiAgRHJhd0xpbmVTdHJpbmdNb2RlLFxuICBEcmF3UG9seWdvbk1vZGUsXG4gIERyYXdSZWN0YW5nbGVNb2RlLFxuICBEcmF3Q2lyY2xlRnJvbUNlbnRlck1vZGUsXG4gIERyYXdDaXJjbGVCeUJvdW5kaW5nQm94TW9kZSxcbiAgRHJhd0VsbGlwc2VCeUJvdW5kaW5nQm94TW9kZSxcbiAgRHJhd1JlY3RhbmdsZVVzaW5nVGhyZWVQb2ludHNNb2RlLFxuICBEcmF3RWxsaXBzZVVzaW5nVGhyZWVQb2ludHNNb2RlLFxuICBEcmF3OTBEZWdyZWVQb2x5Z29uTW9kZSxcbiAgU25hcHBhYmxlTW9kZVxufSBmcm9tICdAbmVidWxhLmdsL2VkaXQtbW9kZXMnO1xuXG5pbXBvcnQgdHlwZSB7XG4gIEVkaXRBY3Rpb24sXG4gIENsaWNrRXZlbnQsXG4gIFN0YXJ0RHJhZ2dpbmdFdmVudCxcbiAgU3RvcERyYWdnaW5nRXZlbnQsXG4gIFBvaW50ZXJNb3ZlRXZlbnQsXG4gIEdlb0pzb25FZGl0TW9kZSxcbiAgRmVhdHVyZUNvbGxlY3Rpb25cbn0gZnJvbSAnQG5lYnVsYS5nbC9lZGl0LW1vZGVzJztcbmltcG9ydCBFZGl0YWJsZUxheWVyIGZyb20gJy4vZWRpdGFibGUtbGF5ZXItZWRpdC1tb2RlLXBvYy5qcyc7XG5cbmNvbnN0IERFRkFVTFRfTElORV9DT0xPUiA9IFsweDAsIDB4MCwgMHgwLCAweGZmXTtcbmNvbnN0IERFRkFVTFRfRklMTF9DT0xPUiA9IFsweDAsIDB4MCwgMHgwLCAweDkwXTtcbmNvbnN0IERFRkFVTFRfU0VMRUNURURfTElORV9DT0xPUiA9IFsweDkwLCAweDkwLCAweDkwLCAweGZmXTtcbmNvbnN0IERFRkFVTFRfU0VMRUNURURfRklMTF9DT0xPUiA9IFsweDkwLCAweDkwLCAweDkwLCAweDkwXTtcbmNvbnN0IERFRkFVTFRfRURJVElOR19FWElTVElOR19QT0lOVF9DT0xPUiA9IFsweGMwLCAweDAsIDB4MCwgMHhmZl07XG5jb25zdCBERUZBVUxUX0VESVRJTkdfSU5URVJNRURJQVRFX1BPSU5UX0NPTE9SID0gWzB4MCwgMHgwLCAweDAsIDB4ODBdO1xuY29uc3QgREVGQVVMVF9FRElUSU5HX1NOQVBfUE9JTlRfQ09MT1IgPSBbMHg3YywgMHgwMCwgMHhjMCwgMHhmZl07XG5jb25zdCBERUZBVUxUX0VESVRJTkdfRVhJU1RJTkdfUE9JTlRfUkFESVVTID0gNTtcbmNvbnN0IERFRkFVTFRfRURJVElOR19JTlRFUk1FRElBVEVfUE9JTlRfUkFESVVTID0gMztcbmNvbnN0IERFRkFVTFRfRURJVElOR19TTkFQX1BPSU5UX1JBRElVUyA9IDc7XG5cbmNvbnN0IERFRkFVTFRfRURJVF9NT0RFID0gbmV3IFZpZXdNb2RlKCk7XG5cbmZ1bmN0aW9uIGdldEVkaXRIYW5kbGVDb2xvcihoYW5kbGUpIHtcbiAgc3dpdGNoIChoYW5kbGUuc291cmNlRmVhdHVyZS5mZWF0dXJlLnByb3BlcnRpZXMuZWRpdEhhbmRsZVR5cGUpIHtcbiAgICBjYXNlICdleGlzdGluZyc6XG4gICAgICByZXR1cm4gREVGQVVMVF9FRElUSU5HX0VYSVNUSU5HX1BPSU5UX0NPTE9SO1xuICAgIGNhc2UgJ3NuYXAnOlxuICAgICAgcmV0dXJuIERFRkFVTFRfRURJVElOR19TTkFQX1BPSU5UX0NPTE9SO1xuICAgIGNhc2UgJ2ludGVybWVkaWF0ZSc6XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBERUZBVUxUX0VESVRJTkdfSU5URVJNRURJQVRFX1BPSU5UX0NPTE9SO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldEVkaXRIYW5kbGVSYWRpdXMoaGFuZGxlKSB7XG4gIHN3aXRjaCAoaGFuZGxlLnNvdXJjZUZlYXR1cmUuZmVhdHVyZS5wcm9wZXJ0aWVzLmVkaXRIYW5kbGVUeXBlKSB7XG4gICAgY2FzZSAnZXhpc3RpbmcnOlxuICAgICAgcmV0dXJuIERFRkFVTFRfRURJVElOR19FWElTVElOR19QT0lOVF9SQURJVVM7XG4gICAgY2FzZSAnc25hcCc6XG4gICAgICByZXR1cm4gREVGQVVMVF9FRElUSU5HX1NOQVBfUE9JTlRfUkFESVVTO1xuICAgIGNhc2UgJ2ludGVybWVkaWF0ZSc6XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBERUZBVUxUX0VESVRJTkdfSU5URVJNRURJQVRFX1BPSU5UX1JBRElVUztcbiAgfVxufVxuXG5jb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gIG1vZGU6ICdtb2RpZnknLFxuXG4gIC8vIEVkaXQgYW5kIGludGVyYWN0aW9uIGV2ZW50c1xuICBvbkVkaXQ6ICgpID0+IHt9LFxuXG4gIHBpY2thYmxlOiB0cnVlLFxuICBwaWNraW5nUmFkaXVzOiAxMCxcbiAgcGlja2luZ0RlcHRoOiA1LFxuICBmcDY0OiBmYWxzZSxcbiAgZmlsbGVkOiB0cnVlLFxuICBzdHJva2VkOiB0cnVlLFxuICBsaW5lV2lkdGhTY2FsZTogMSxcbiAgbGluZVdpZHRoTWluUGl4ZWxzOiAxLFxuICBsaW5lV2lkdGhNYXhQaXhlbHM6IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSLFxuICBsaW5lV2lkdGhVbml0czogJ21ldGVycycsXG4gIGxpbmVKb2ludFJvdW5kZWQ6IGZhbHNlLFxuICBsaW5lTWl0ZXJMaW1pdDogNCxcbiAgcG9pbnRSYWRpdXNTY2FsZTogMSxcbiAgcG9pbnRSYWRpdXNNaW5QaXhlbHM6IDIsXG4gIHBvaW50UmFkaXVzTWF4UGl4ZWxzOiBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUixcbiAgbGluZURhc2hKdXN0aWZpZWQ6IGZhbHNlLFxuICBnZXRMaW5lQ29sb3I6IChmZWF0dXJlLCBpc1NlbGVjdGVkLCBtb2RlKSA9PlxuICAgIGlzU2VsZWN0ZWQgPyBERUZBVUxUX1NFTEVDVEVEX0xJTkVfQ09MT1IgOiBERUZBVUxUX0xJTkVfQ09MT1IsXG4gIGdldEZpbGxDb2xvcjogKGZlYXR1cmUsIGlzU2VsZWN0ZWQsIG1vZGUpID0+XG4gICAgaXNTZWxlY3RlZCA/IERFRkFVTFRfU0VMRUNURURfRklMTF9DT0xPUiA6IERFRkFVTFRfRklMTF9DT0xPUixcbiAgZ2V0UmFkaXVzOiBmID0+XG4gICAgKGYgJiYgZi5wcm9wZXJ0aWVzICYmIGYucHJvcGVydGllcy5yYWRpdXMpIHx8IChmICYmIGYucHJvcGVydGllcyAmJiBmLnByb3BlcnRpZXMuc2l6ZSkgfHwgMSxcbiAgZ2V0TGluZVdpZHRoOiBmID0+IChmICYmIGYucHJvcGVydGllcyAmJiBmLnByb3BlcnRpZXMubGluZVdpZHRoKSB8fCAxLFxuICBnZXRMaW5lRGFzaEFycmF5OiAoZmVhdHVyZSwgaXNTZWxlY3RlZCwgbW9kZSkgPT5cbiAgICBpc1NlbGVjdGVkICYmIG1vZGUgIT09ICd2aWV3JyA/IFs3LCA0XSA6IFswLCAwXSxcblxuICAvLyBUZW50YXRpdmUgZmVhdHVyZSByZW5kZXJpbmdcbiAgZ2V0VGVudGF0aXZlTGluZURhc2hBcnJheTogKGYsIG1vZGUpID0+IFs3LCA0XSxcbiAgZ2V0VGVudGF0aXZlTGluZUNvbG9yOiAoZiwgbW9kZSkgPT4gREVGQVVMVF9TRUxFQ1RFRF9MSU5FX0NPTE9SLFxuICBnZXRUZW50YXRpdmVGaWxsQ29sb3I6IChmLCBtb2RlKSA9PiBERUZBVUxUX1NFTEVDVEVEX0ZJTExfQ09MT1IsXG4gIGdldFRlbnRhdGl2ZUxpbmVXaWR0aDogKGYsIG1vZGUpID0+IChmICYmIGYucHJvcGVydGllcyAmJiBmLnByb3BlcnRpZXMubGluZVdpZHRoKSB8fCAxLFxuXG4gIGVkaXRIYW5kbGVUeXBlOiAncG9pbnQnLFxuXG4gIC8vIHBvaW50IGhhbmRsZXNcbiAgZWRpdEhhbmRsZVBvaW50UmFkaXVzU2NhbGU6IDEsXG4gIGVkaXRIYW5kbGVQb2ludE91dGxpbmU6IGZhbHNlLFxuICBlZGl0SGFuZGxlUG9pbnRTdHJva2VXaWR0aDogMSxcbiAgZWRpdEhhbmRsZVBvaW50UmFkaXVzTWluUGl4ZWxzOiA0LFxuICBlZGl0SGFuZGxlUG9pbnRSYWRpdXNNYXhQaXhlbHM6IDgsXG4gIGdldEVkaXRIYW5kbGVQb2ludENvbG9yOiBnZXRFZGl0SGFuZGxlQ29sb3IsXG4gIGdldEVkaXRIYW5kbGVQb2ludFJhZGl1czogZ2V0RWRpdEhhbmRsZVJhZGl1cyxcblxuICAvLyBpY29uIGhhbmRsZXNcbiAgZWRpdEhhbmRsZUljb25BdGxhczogbnVsbCxcbiAgZWRpdEhhbmRsZUljb25NYXBwaW5nOiBudWxsLFxuICBlZGl0SGFuZGxlSWNvblNpemVTY2FsZTogMSxcbiAgZ2V0RWRpdEhhbmRsZUljb246IGhhbmRsZSA9PiBoYW5kbGUuc291cmNlRmVhdHVyZS5mZWF0dXJlLnByb3BlcnRpZXMuZWRpdEhhbmRsZVR5cGUsXG4gIGdldEVkaXRIYW5kbGVJY29uU2l6ZTogMTAsXG4gIGdldEVkaXRIYW5kbGVJY29uQ29sb3I6IGdldEVkaXRIYW5kbGVDb2xvcixcbiAgZ2V0RWRpdEhhbmRsZUljb25BbmdsZTogMCxcblxuICAvLyBtaXNjXG4gIGJpbGxib2FyZDogdHJ1ZSxcblxuICAvLyBNb2RlIGhhbmRsZXJzXG4gIG1vZGVIYW5kbGVyczoge1xuICAgIHZpZXc6IG5ldyBWaWV3TW9kZSgpLFxuXG4gICAgLy8gQWx0ZXIgbW9kZXNcbiAgICBtb2RpZnk6IG5ldyBNb2RpZnlNb2RlKCksXG4gICAgdHJhbnNsYXRlOiBuZXcgU25hcHBhYmxlTW9kZShuZXcgVHJhbnNsYXRlTW9kZSgpKSxcbiAgICBzY2FsZTogbmV3IFNjYWxlTW9kZSgpLFxuICAgIHJvdGF0ZTogbmV3IFJvdGF0ZU1vZGUoKSxcbiAgICBkdXBsaWNhdGU6IG5ldyBEdXBsaWNhdGVNb2RlKCksXG4gICAgc3BsaXQ6IG5ldyBTcGxpdFBvbHlnb25Nb2RlKCksXG4gICAgZXh0cnVkZTogbmV3IEV4dHJ1ZGVNb2RlKCksXG4gICAgZWxldmF0aW9uOiBuZXcgRWxldmF0aW9uTW9kZSgpLFxuXG4gICAgLy8gRHJhdyBtb2Rlc1xuICAgIGRyYXdQb2ludDogbmV3IERyYXdQb2ludE1vZGUoKSxcbiAgICBkcmF3TGluZVN0cmluZzogbmV3IERyYXdMaW5lU3RyaW5nTW9kZSgpLFxuICAgIGRyYXdQb2x5Z29uOiBuZXcgRHJhd1BvbHlnb25Nb2RlKCksXG4gICAgZHJhd1JlY3RhbmdsZTogbmV3IERyYXdSZWN0YW5nbGVNb2RlKCksXG4gICAgZHJhd0NpcmNsZUZyb21DZW50ZXI6IG5ldyBEcmF3Q2lyY2xlRnJvbUNlbnRlck1vZGUoKSxcbiAgICBkcmF3Q2lyY2xlQnlCb3VuZGluZ0JveDogbmV3IERyYXdDaXJjbGVCeUJvdW5kaW5nQm94TW9kZSgpLFxuICAgIGRyYXdFbGxpcHNlQnlCb3VuZGluZ0JveDogbmV3IERyYXdFbGxpcHNlQnlCb3VuZGluZ0JveE1vZGUoKSxcbiAgICBkcmF3UmVjdGFuZ2xlVXNpbmczUG9pbnRzOiBuZXcgRHJhd1JlY3RhbmdsZVVzaW5nVGhyZWVQb2ludHNNb2RlKCksXG4gICAgZHJhd0VsbGlwc2VVc2luZzNQb2ludHM6IG5ldyBEcmF3RWxsaXBzZVVzaW5nVGhyZWVQb2ludHNNb2RlKCksXG4gICAgZHJhdzkwRGVncmVlUG9seWdvbjogbmV3IERyYXc5MERlZ3JlZVBvbHlnb25Nb2RlKClcbiAgfVxufTtcblxudHlwZSBQcm9wcyA9IHtcbiAgbW9kZTogc3RyaW5nLFxuICBtb2RlSGFuZGxlcnM6IHsgW21vZGU6IHN0cmluZ106IEdlb0pzb25FZGl0TW9kZSB9LFxuICBvbkVkaXQ6IChFZGl0QWN0aW9uPEZlYXR1cmVDb2xsZWN0aW9uPikgPT4gdm9pZCxcbiAgLy8gVE9ETzogdHlwZSB0aGUgcmVzdFxuICBbc3RyaW5nXTogYW55XG59O1xuXG4vLyB0eXBlIFN0YXRlID0ge1xuLy8gICBtb2RlSGFuZGxlcjogRWRpdGFibGVGZWF0dXJlQ29sbGVjdGlvbixcbi8vICAgdGVudGF0aXZlRmVhdHVyZTogP0ZlYXR1cmUsXG4vLyAgIGVkaXRIYW5kbGVzOiBhbnlbXSxcbi8vICAgc2VsZWN0ZWRGZWF0dXJlczogRmVhdHVyZVtdXG4vLyB9O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFZGl0YWJsZUdlb0pzb25MYXllckVkaXRNb2RlUG9jIGV4dGVuZHMgRWRpdGFibGVMYXllciB7XG4gIC8vIHN0YXRlOiBTdGF0ZTtcbiAgLy8gcHJvcHM6IFByb3BzO1xuICAvLyBzZXRTdGF0ZTogKCRTaGFwZTxTdGF0ZT4pID0+IHZvaWQ7XG5cbiAgcmVuZGVyTGF5ZXJzKCkge1xuICAgIGNvbnN0IHN1YkxheWVyUHJvcHMgPSB0aGlzLmdldFN1YkxheWVyUHJvcHMoe1xuICAgICAgaWQ6ICdnZW9qc29uJyxcblxuICAgICAgLy8gUHJveHkgbW9zdCBHZW9Kc29uTGF5ZXIgcHJvcHMgYXMtaXNcbiAgICAgIGRhdGE6IHRoaXMucHJvcHMuZGF0YSxcbiAgICAgIGZwNjQ6IHRoaXMucHJvcHMuZnA2NCxcbiAgICAgIGZpbGxlZDogdGhpcy5wcm9wcy5maWxsZWQsXG4gICAgICBzdHJva2VkOiB0aGlzLnByb3BzLnN0cm9rZWQsXG4gICAgICBsaW5lV2lkdGhTY2FsZTogdGhpcy5wcm9wcy5saW5lV2lkdGhTY2FsZSxcbiAgICAgIGxpbmVXaWR0aE1pblBpeGVsczogdGhpcy5wcm9wcy5saW5lV2lkdGhNaW5QaXhlbHMsXG4gICAgICBsaW5lV2lkdGhNYXhQaXhlbHM6IHRoaXMucHJvcHMubGluZVdpZHRoTWF4UGl4ZWxzLFxuICAgICAgbGluZVdpZHRoVW5pdHM6IHRoaXMucHJvcHMubGluZVdpZHRoVW5pdHMsXG4gICAgICBsaW5lSm9pbnRSb3VuZGVkOiB0aGlzLnByb3BzLmxpbmVKb2ludFJvdW5kZWQsXG4gICAgICBsaW5lTWl0ZXJMaW1pdDogdGhpcy5wcm9wcy5saW5lTWl0ZXJMaW1pdCxcbiAgICAgIHBvaW50UmFkaXVzU2NhbGU6IHRoaXMucHJvcHMucG9pbnRSYWRpdXNTY2FsZSxcbiAgICAgIHBvaW50UmFkaXVzTWluUGl4ZWxzOiB0aGlzLnByb3BzLnBvaW50UmFkaXVzTWluUGl4ZWxzLFxuICAgICAgcG9pbnRSYWRpdXNNYXhQaXhlbHM6IHRoaXMucHJvcHMucG9pbnRSYWRpdXNNYXhQaXhlbHMsXG4gICAgICBsaW5lRGFzaEp1c3RpZmllZDogdGhpcy5wcm9wcy5saW5lRGFzaEp1c3RpZmllZCxcbiAgICAgIGdldExpbmVDb2xvcjogdGhpcy5zZWxlY3Rpb25Bd2FyZUFjY2Vzc29yKHRoaXMucHJvcHMuZ2V0TGluZUNvbG9yKSxcbiAgICAgIGdldEZpbGxDb2xvcjogdGhpcy5zZWxlY3Rpb25Bd2FyZUFjY2Vzc29yKHRoaXMucHJvcHMuZ2V0RmlsbENvbG9yKSxcbiAgICAgIGdldFJhZGl1czogdGhpcy5zZWxlY3Rpb25Bd2FyZUFjY2Vzc29yKHRoaXMucHJvcHMuZ2V0UmFkaXVzKSxcbiAgICAgIGdldExpbmVXaWR0aDogdGhpcy5zZWxlY3Rpb25Bd2FyZUFjY2Vzc29yKHRoaXMucHJvcHMuZ2V0TGluZVdpZHRoKSxcbiAgICAgIGdldExpbmVEYXNoQXJyYXk6IHRoaXMuc2VsZWN0aW9uQXdhcmVBY2Nlc3Nvcih0aGlzLnByb3BzLmdldExpbmVEYXNoQXJyYXkpLFxuXG4gICAgICBfc3ViTGF5ZXJQcm9wczoge1xuICAgICAgICAnbGluZS1zdHJpbmdzJzoge1xuICAgICAgICAgIGJpbGxib2FyZDogdGhpcy5wcm9wcy5iaWxsYm9hcmRcbiAgICAgICAgfSxcbiAgICAgICAgJ3BvbHlnb25zLXN0cm9rZSc6IHtcbiAgICAgICAgICBiaWxsYm9hcmQ6IHRoaXMucHJvcHMuYmlsbGJvYXJkXG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIHVwZGF0ZVRyaWdnZXJzOiB7XG4gICAgICAgIGdldExpbmVDb2xvcjogW3RoaXMucHJvcHMuc2VsZWN0ZWRGZWF0dXJlSW5kZXhlcywgdGhpcy5wcm9wcy5tb2RlXSxcbiAgICAgICAgZ2V0RmlsbENvbG9yOiBbdGhpcy5wcm9wcy5zZWxlY3RlZEZlYXR1cmVJbmRleGVzLCB0aGlzLnByb3BzLm1vZGVdLFxuICAgICAgICBnZXRSYWRpdXM6IFt0aGlzLnByb3BzLnNlbGVjdGVkRmVhdHVyZUluZGV4ZXMsIHRoaXMucHJvcHMubW9kZV0sXG4gICAgICAgIGdldExpbmVXaWR0aDogW3RoaXMucHJvcHMuc2VsZWN0ZWRGZWF0dXJlSW5kZXhlcywgdGhpcy5wcm9wcy5tb2RlXSxcbiAgICAgICAgZ2V0TGluZURhc2hBcnJheTogW3RoaXMucHJvcHMuc2VsZWN0ZWRGZWF0dXJlSW5kZXhlcywgdGhpcy5wcm9wcy5tb2RlXVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgbGV0IGxheWVyczogYW55ID0gW25ldyBHZW9Kc29uTGF5ZXIoc3ViTGF5ZXJQcm9wcyldO1xuXG4gICAgbGF5ZXJzID0gbGF5ZXJzLmNvbmNhdCh0aGlzLmNyZWF0ZUd1aWRlc0xheWVycygpKTtcblxuICAgIHJldHVybiBsYXllcnM7XG4gIH1cblxuICBpbml0aWFsaXplU3RhdGUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZVN0YXRlKCk7XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHNlbGVjdGVkRmVhdHVyZXM6IFtdLFxuICAgICAgZWRpdEhhbmRsZXM6IFtdXG4gICAgfSk7XG4gIH1cblxuICAvLyBUT0RPOiBpcyB0aGlzIHRoZSBiZXN0IHdheSB0byBwcm9wZXJseSB1cGRhdGUgc3RhdGUgZnJvbSBhbiBvdXRzaWRlIGV2ZW50IGhhbmRsZXI/XG4gIHNob3VsZFVwZGF0ZVN0YXRlKG9wdHM6IGFueSkge1xuICAgIC8vIGNvbnNvbGUubG9nKFxuICAgIC8vICAgJ3Nob3VsZFVwZGF0ZVN0YXRlJyxcbiAgICAvLyAgIG9wdHMuY2hhbmdlRmxhZ3MucHJvcHNPckRhdGFDaGFuZ2VkLFxuICAgIC8vICAgb3B0cy5jaGFuZ2VGbGFncy5zdGF0ZUNoYW5nZWRcbiAgICAvLyApO1xuICAgIHJldHVybiBzdXBlci5zaG91bGRVcGRhdGVTdGF0ZShvcHRzKSB8fCBvcHRzLmNoYW5nZUZsYWdzLnN0YXRlQ2hhbmdlZDtcbiAgfVxuXG4gIHVwZGF0ZVN0YXRlKHtcbiAgICBwcm9wcyxcbiAgICBvbGRQcm9wcyxcbiAgICBjaGFuZ2VGbGFnc1xuICB9OiB7XG4gICAgcHJvcHM6IFByb3BzLFxuICAgIG9sZFByb3BzOiBQcm9wcyxcbiAgICBjaGFuZ2VGbGFnczogYW55XG4gIH0pIHtcbiAgICBzdXBlci51cGRhdGVTdGF0ZSh7IHByb3BzLCBjaGFuZ2VGbGFncyB9KTtcblxuICAgIGxldCBtb2RlSGFuZGxlcjogR2VvSnNvbkVkaXRNb2RlID0gdGhpcy5zdGF0ZS5tb2RlSGFuZGxlcjtcbiAgICBpZiAoY2hhbmdlRmxhZ3MucHJvcHNPckRhdGFDaGFuZ2VkKSB7XG4gICAgICBpZiAocHJvcHMubW9kZUhhbmRsZXJzICE9PSBvbGRQcm9wcy5tb2RlSGFuZGxlcnMgfHwgcHJvcHMubW9kZSAhPT0gb2xkUHJvcHMubW9kZSkge1xuICAgICAgICBtb2RlSGFuZGxlciA9IHByb3BzLm1vZGVIYW5kbGVyc1twcm9wcy5tb2RlXTtcblxuICAgICAgICBpZiAoIW1vZGVIYW5kbGVyKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKGBObyBoYW5kbGVyIGNvbmZpZ3VyZWQgZm9yIG1vZGUgJHtwcm9wcy5tb2RlfWApOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGUsbm8tdW5kZWZcbiAgICAgICAgICAvLyBVc2UgZGVmYXVsdCBtb2RlIGhhbmRsZXJcbiAgICAgICAgICBtb2RlSGFuZGxlciA9IERFRkFVTFRfRURJVF9NT0RFO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1vZGVIYW5kbGVyICE9PSB0aGlzLnN0YXRlLm1vZGVIYW5kbGVyKSB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IG1vZGVIYW5kbGVyLCBjdXJzb3I6IG51bGwgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgc2VsZWN0ZWRGZWF0dXJlcyA9IFtdO1xuICAgIGlmIChBcnJheS5pc0FycmF5KHByb3BzLnNlbGVjdGVkRmVhdHVyZUluZGV4ZXMpKSB7XG4gICAgICAvLyBUT0RPOiBuZWVkcyBpbXByb3ZlZCB0ZXN0aW5nLCBpLmUuIGNoZWNraW5nIGZvciBkdXBsaWNhdGVzLCBOYU5zLCBvdXQgb2YgcmFuZ2UgbnVtYmVycywgLi4uXG4gICAgICBzZWxlY3RlZEZlYXR1cmVzID0gcHJvcHMuc2VsZWN0ZWRGZWF0dXJlSW5kZXhlcy5tYXAoZWxlbSA9PiBwcm9wcy5kYXRhLmZlYXR1cmVzW2VsZW1dKTtcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHsgc2VsZWN0ZWRGZWF0dXJlcyB9KTtcbiAgfVxuXG4gIGdldE1vZGVQcm9wcyhwcm9wczogUHJvcHMpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbW9kZUNvbmZpZzogcHJvcHMubW9kZUNvbmZpZyxcbiAgICAgIGRhdGE6IHByb3BzLmRhdGEsXG4gICAgICBzZWxlY3RlZEluZGV4ZXM6IHByb3BzLnNlbGVjdGVkRmVhdHVyZUluZGV4ZXMsXG4gICAgICBsYXN0UG9pbnRlck1vdmVFdmVudDogdGhpcy5zdGF0ZS5sYXN0UG9pbnRlck1vdmVFdmVudCxcbiAgICAgIGN1cnNvcjogdGhpcy5zdGF0ZS5jdXJzb3IsXG4gICAgICBvbkVkaXQ6IChlZGl0QWN0aW9uOiBFZGl0QWN0aW9uPEZlYXR1cmVDb2xsZWN0aW9uPikgPT4ge1xuICAgICAgICBwcm9wcy5vbkVkaXQoZWRpdEFjdGlvbik7XG4gICAgICB9LFxuICAgICAgb25VcGRhdGVDdXJzb3I6IChjdXJzb3I6ID9zdHJpbmcpID0+IHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGN1cnNvciB9KTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgc2VsZWN0aW9uQXdhcmVBY2Nlc3NvcihhY2Nlc3NvcjogYW55KSB7XG4gICAgaWYgKHR5cGVvZiBhY2Nlc3NvciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIGFjY2Vzc29yO1xuICAgIH1cbiAgICByZXR1cm4gKGZlYXR1cmU6IE9iamVjdCkgPT4gYWNjZXNzb3IoZmVhdHVyZSwgdGhpcy5pc0ZlYXR1cmVTZWxlY3RlZChmZWF0dXJlKSwgdGhpcy5wcm9wcy5tb2RlKTtcbiAgfVxuXG4gIGlzRmVhdHVyZVNlbGVjdGVkKGZlYXR1cmU6IE9iamVjdCkge1xuICAgIGlmICghdGhpcy5wcm9wcy5kYXRhIHx8ICF0aGlzLnByb3BzLnNlbGVjdGVkRmVhdHVyZUluZGV4ZXMpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLnByb3BzLnNlbGVjdGVkRmVhdHVyZUluZGV4ZXMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNvbnN0IGZlYXR1cmVJbmRleCA9IHRoaXMucHJvcHMuZGF0YS5mZWF0dXJlcy5pbmRleE9mKGZlYXR1cmUpO1xuICAgIHJldHVybiB0aGlzLnByb3BzLnNlbGVjdGVkRmVhdHVyZUluZGV4ZXMuaW5jbHVkZXMoZmVhdHVyZUluZGV4KTtcbiAgfVxuXG4gIGdldFBpY2tpbmdJbmZvKHsgaW5mbywgc291cmNlTGF5ZXIgfTogT2JqZWN0KSB7XG4gICAgaWYgKHNvdXJjZUxheWVyLmlkLmVuZHNXaXRoKCdndWlkZXMnKSkge1xuICAgICAgLy8gSWYgdXNlciBpcyBwaWNraW5nIGFuIGVkaXRpbmcgaGFuZGxlLCBhZGQgYWRkaXRpb25hbCBkYXRhIHRvIHRoZSBpbmZvXG4gICAgICBpbmZvLmlzR3VpZGUgPSB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBpbmZvO1xuICB9XG5cbiAgY3JlYXRlR3VpZGVzTGF5ZXJzKCkge1xuICAgIGNvbnN0IG1vZGUgPSB0aGlzLnByb3BzLm1vZGVIYW5kbGVyc1t0aGlzLnByb3BzLm1vZGVdIHx8IERFRkFVTFRfRURJVF9NT0RFO1xuICAgIGNvbnN0IGd1aWRlczogRmVhdHVyZUNvbGxlY3Rpb24gPSBtb2RlLmdldEd1aWRlcyh0aGlzLmdldE1vZGVQcm9wcyh0aGlzLnByb3BzKSk7XG5cbiAgICBpZiAoIWd1aWRlcyB8fCAhZ3VpZGVzLmZlYXR1cmVzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGxldCBwb2ludExheWVyUHJvcHM7XG4gICAgaWYgKHRoaXMucHJvcHMuZWRpdEhhbmRsZVR5cGUgPT09ICdpY29uJykge1xuICAgICAgcG9pbnRMYXllclByb3BzID0ge1xuICAgICAgICB0eXBlOiBJY29uTGF5ZXIsXG4gICAgICAgIGljb25BdGxhczogdGhpcy5wcm9wcy5lZGl0SGFuZGxlSWNvbkF0bGFzLFxuICAgICAgICBpY29uTWFwcGluZzogdGhpcy5wcm9wcy5lZGl0SGFuZGxlSWNvbk1hcHBpbmcsXG4gICAgICAgIHNpemVTY2FsZTogdGhpcy5wcm9wcy5lZGl0SGFuZGxlSWNvblNpemVTY2FsZSxcbiAgICAgICAgZ2V0SWNvbjogdGhpcy5wcm9wcy5nZXRFZGl0SGFuZGxlSWNvbixcbiAgICAgICAgZ2V0U2l6ZTogdGhpcy5wcm9wcy5nZXRFZGl0SGFuZGxlSWNvblNpemUsXG4gICAgICAgIGdldENvbG9yOiB0aGlzLnByb3BzLmdldEVkaXRIYW5kbGVJY29uQ29sb3IsXG4gICAgICAgIGdldEFuZ2xlOiB0aGlzLnByb3BzLmdldEVkaXRIYW5kbGVJY29uQW5nbGVcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHBvaW50TGF5ZXJQcm9wcyA9IHtcbiAgICAgICAgdHlwZTogU2NhdHRlcnBsb3RMYXllcixcbiAgICAgICAgcmFkaXVzU2NhbGU6IHRoaXMucHJvcHMuZWRpdEhhbmRsZVBvaW50UmFkaXVzU2NhbGUsXG4gICAgICAgIHN0cm9rZWQ6IHRoaXMucHJvcHMuZWRpdEhhbmRsZVBvaW50T3V0bGluZSxcbiAgICAgICAgZ2V0TGluZVdpZHRoOiB0aGlzLnByb3BzLmVkaXRIYW5kbGVQb2ludFN0cm9rZVdpZHRoLFxuICAgICAgICByYWRpdXNNaW5QaXhlbHM6IHRoaXMucHJvcHMuZWRpdEhhbmRsZVBvaW50UmFkaXVzTWluUGl4ZWxzLFxuICAgICAgICByYWRpdXNNYXhQaXhlbHM6IHRoaXMucHJvcHMuZWRpdEhhbmRsZVBvaW50UmFkaXVzTWF4UGl4ZWxzLFxuICAgICAgICBnZXRSYWRpdXM6IHRoaXMucHJvcHMuZ2V0RWRpdEhhbmRsZVBvaW50UmFkaXVzLFxuICAgICAgICBnZXRGaWxsQ29sb3I6IHRoaXMucHJvcHMuZ2V0RWRpdEhhbmRsZVBvaW50Q29sb3IsXG4gICAgICAgIGdldGxpbmVDb2xvcjogdGhpcy5wcm9wcy5nZXRFZGl0SGFuZGxlUG9pbnRDb2xvclxuICAgICAgfTtcbiAgICB9XG5cbiAgICBjb25zdCBsYXllciA9IG5ldyBHZW9Kc29uTGF5ZXIoXG4gICAgICB0aGlzLmdldFN1YkxheWVyUHJvcHMoe1xuICAgICAgICBpZDogYGd1aWRlc2AsXG4gICAgICAgIGRhdGE6IGd1aWRlcyxcbiAgICAgICAgZnA2NDogdGhpcy5wcm9wcy5mcDY0LFxuICAgICAgICBfc3ViTGF5ZXJQcm9wczoge1xuICAgICAgICAgIHBvaW50czogcG9pbnRMYXllclByb3BzXG4gICAgICAgIH0sXG4gICAgICAgIGxpbmVXaWR0aFNjYWxlOiB0aGlzLnByb3BzLmxpbmVXaWR0aFNjYWxlLFxuICAgICAgICBsaW5lV2lkdGhNaW5QaXhlbHM6IHRoaXMucHJvcHMubGluZVdpZHRoTWluUGl4ZWxzLFxuICAgICAgICBsaW5lV2lkdGhNYXhQaXhlbHM6IHRoaXMucHJvcHMubGluZVdpZHRoTWF4UGl4ZWxzLFxuICAgICAgICBsaW5lV2lkdGhVbml0czogdGhpcy5wcm9wcy5saW5lV2lkdGhVbml0cyxcbiAgICAgICAgbGluZUpvaW50Um91bmRlZDogdGhpcy5wcm9wcy5saW5lSm9pbnRSb3VuZGVkLFxuICAgICAgICBsaW5lTWl0ZXJMaW1pdDogdGhpcy5wcm9wcy5saW5lTWl0ZXJMaW1pdCxcbiAgICAgICAgZ2V0TGluZUNvbG9yOiB0aGlzLnByb3BzLmdldFRlbnRhdGl2ZUxpbmVDb2xvcixcbiAgICAgICAgZ2V0TGluZVdpZHRoOiB0aGlzLnByb3BzLmdldFRlbnRhdGl2ZUxpbmVXaWR0aCxcbiAgICAgICAgZ2V0RmlsbENvbG9yOiB0aGlzLnByb3BzLmdldFRlbnRhdGl2ZUZpbGxDb2xvcixcbiAgICAgICAgZ2V0TGluZURhc2hBcnJheTogdGhpcy5wcm9wcy5nZXRUZW50YXRpdmVMaW5lRGFzaEFycmF5XG4gICAgICB9KVxuICAgICk7XG5cbiAgICByZXR1cm4gW2xheWVyXTtcbiAgfVxuXG4gIG9uTGF5ZXJDbGljayhldmVudDogQ2xpY2tFdmVudCkge1xuICAgIHRoaXMuZ2V0QWN0aXZlTW9kZUhhbmRsZXIoKS5oYW5kbGVDbGljayhldmVudCwgdGhpcy5nZXRNb2RlUHJvcHModGhpcy5wcm9wcykpO1xuICB9XG5cbiAgb25TdGFydERyYWdnaW5nKGV2ZW50OiBTdGFydERyYWdnaW5nRXZlbnQpIHtcbiAgICB0aGlzLmdldEFjdGl2ZU1vZGVIYW5kbGVyKCkuaGFuZGxlU3RhcnREcmFnZ2luZyhldmVudCwgdGhpcy5nZXRNb2RlUHJvcHModGhpcy5wcm9wcykpO1xuICB9XG5cbiAgb25TdG9wRHJhZ2dpbmcoZXZlbnQ6IFN0b3BEcmFnZ2luZ0V2ZW50KSB7XG4gICAgdGhpcy5nZXRBY3RpdmVNb2RlSGFuZGxlcigpLmhhbmRsZVN0b3BEcmFnZ2luZyhldmVudCwgdGhpcy5nZXRNb2RlUHJvcHModGhpcy5wcm9wcykpO1xuICB9XG5cbiAgb25Qb2ludGVyTW92ZShldmVudDogUG9pbnRlck1vdmVFdmVudCkge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBsYXN0UG9pbnRlck1vdmVFdmVudDogZXZlbnQgfSk7XG4gICAgdGhpcy5nZXRBY3RpdmVNb2RlSGFuZGxlcigpLmhhbmRsZVBvaW50ZXJNb3ZlKGV2ZW50LCB0aGlzLmdldE1vZGVQcm9wcyh0aGlzLnByb3BzKSk7XG4gIH1cblxuICBnZXRDdXJzb3IoeyBpc0RyYWdnaW5nIH06IHsgaXNEcmFnZ2luZzogYm9vbGVhbiB9KSB7XG4gICAgbGV0IHsgY3Vyc29yIH0gPSB0aGlzLnN0YXRlO1xuICAgIGlmICghY3Vyc29yKSB7XG4gICAgICBjdXJzb3IgPSBpc0RyYWdnaW5nID8gJ2dyYWJiaW5nJyA6ICdncmFiJztcbiAgICB9XG4gICAgcmV0dXJuIGN1cnNvcjtcbiAgfVxuXG4gIGdldEFjdGl2ZU1vZGVIYW5kbGVyKCk6IEdlb0pzb25FZGl0TW9kZSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUubW9kZUhhbmRsZXI7XG4gIH1cbn1cblxuRWRpdGFibGVHZW9Kc29uTGF5ZXJFZGl0TW9kZVBvYy5sYXllck5hbWUgPSAnRWRpdGFibGVHZW9Kc29uTGF5ZXJFZGl0TW9kZVBvYyc7XG5FZGl0YWJsZUdlb0pzb25MYXllckVkaXRNb2RlUG9jLmRlZmF1bHRQcm9wcyA9IGRlZmF1bHRQcm9wcztcbiJdfQ==