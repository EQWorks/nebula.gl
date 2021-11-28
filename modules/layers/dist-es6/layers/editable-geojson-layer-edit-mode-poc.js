"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _keplerOudatedDeck = require("kepler-oudated-deck.gl-layers");

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
  // Mode handlers
  modeHandlers: {
    view: new _editModes.ViewMode(),
    drawPolygon: new _editModes.DrawPolygonMode()
  }
};

// type State = {
//   modeHandler: EditableFeatureCollection,
//   tentativeFeature: ?Feature,
//   editHandles: any[],
//   selectedFeatures: Feature[]
// };
// eslint-disable-next-line camelcase
var EditableGeoJsonLayer_EDIT_MODE_POC =
/*#__PURE__*/
function (_EditableLayer) {
  _inherits(EditableGeoJsonLayer_EDIT_MODE_POC, _EditableLayer);

  function EditableGeoJsonLayer_EDIT_MODE_POC() {
    _classCallCheck(this, EditableGeoJsonLayer_EDIT_MODE_POC);

    return _possibleConstructorReturn(this, _getPrototypeOf(EditableGeoJsonLayer_EDIT_MODE_POC).apply(this, arguments));
  }

  _createClass(EditableGeoJsonLayer_EDIT_MODE_POC, [{
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
        updateTriggers: {
          getLineColor: [this.props.selectedFeatureIndexes, this.props.mode],
          getFillColor: [this.props.selectedFeatureIndexes, this.props.mode],
          getRadius: [this.props.selectedFeatureIndexes, this.props.mode],
          getLineWidth: [this.props.selectedFeatureIndexes, this.props.mode],
          getLineDashArray: [this.props.selectedFeatureIndexes, this.props.mode]
        }
      });
      var layers = [new _keplerOudatedDeck.GeoJsonLayer(subLayerProps)];
      layers = layers.concat(this.createGuidesLayers());
      return layers;
    }
  }, {
    key: "initializeState",
    value: function initializeState() {
      _get(_getPrototypeOf(EditableGeoJsonLayer_EDIT_MODE_POC.prototype), "initializeState", this).call(this);

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
      return _get(_getPrototypeOf(EditableGeoJsonLayer_EDIT_MODE_POC.prototype), "shouldUpdateState", this).call(this, opts) || opts.changeFlags.stateChanged;
    }
  }, {
    key: "updateState",
    value: function updateState(_ref) {
      var props = _ref.props,
          oldProps = _ref.oldProps,
          changeFlags = _ref.changeFlags;

      _get(_getPrototypeOf(EditableGeoJsonLayer_EDIT_MODE_POC.prototype), "updateState", this).call(this, {
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

      if (sourceLayer.id.endsWith('-edit-handles')) {
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
          type: _keplerOudatedDeck.IconLayer,
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
          type: _keplerOudatedDeck.ScatterplotLayer,
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

      var layer = new _keplerOudatedDeck.GeoJsonLayer(this.getSubLayerProps({
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

  return EditableGeoJsonLayer_EDIT_MODE_POC;
}(_editableLayerEditModePoc.default); // eslint-disable-next-line camelcase


exports.default = EditableGeoJsonLayer_EDIT_MODE_POC;
EditableGeoJsonLayer_EDIT_MODE_POC.layerName = 'EditableGeoJsonLayer_EDIT_MODE_POC'; // eslint-disable-next-line camelcase

EditableGeoJsonLayer_EDIT_MODE_POC.defaultProps = defaultProps;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sYXllcnMvZWRpdGFibGUtZ2VvanNvbi1sYXllci1lZGl0LW1vZGUtcG9jLmpzIl0sIm5hbWVzIjpbIkRFRkFVTFRfTElORV9DT0xPUiIsIkRFRkFVTFRfRklMTF9DT0xPUiIsIkRFRkFVTFRfU0VMRUNURURfTElORV9DT0xPUiIsIkRFRkFVTFRfU0VMRUNURURfRklMTF9DT0xPUiIsIkRFRkFVTFRfRURJVElOR19FWElTVElOR19QT0lOVF9DT0xPUiIsIkRFRkFVTFRfRURJVElOR19JTlRFUk1FRElBVEVfUE9JTlRfQ09MT1IiLCJERUZBVUxUX0VESVRJTkdfU05BUF9QT0lOVF9DT0xPUiIsIkRFRkFVTFRfRURJVElOR19FWElTVElOR19QT0lOVF9SQURJVVMiLCJERUZBVUxUX0VESVRJTkdfSU5URVJNRURJQVRFX1BPSU5UX1JBRElVUyIsIkRFRkFVTFRfRURJVElOR19TTkFQX1BPSU5UX1JBRElVUyIsIkRFRkFVTFRfRURJVF9NT0RFIiwiVmlld01vZGUiLCJnZXRFZGl0SGFuZGxlQ29sb3IiLCJoYW5kbGUiLCJzb3VyY2VGZWF0dXJlIiwiZmVhdHVyZSIsInByb3BlcnRpZXMiLCJlZGl0SGFuZGxlVHlwZSIsImdldEVkaXRIYW5kbGVSYWRpdXMiLCJkZWZhdWx0UHJvcHMiLCJtb2RlIiwib25FZGl0IiwicGlja2FibGUiLCJwaWNraW5nUmFkaXVzIiwiZnA2NCIsImZpbGxlZCIsInN0cm9rZWQiLCJsaW5lV2lkdGhTY2FsZSIsImxpbmVXaWR0aE1pblBpeGVscyIsImxpbmVXaWR0aE1heFBpeGVscyIsIk51bWJlciIsIk1BWF9TQUZFX0lOVEVHRVIiLCJsaW5lV2lkdGhVbml0cyIsImxpbmVKb2ludFJvdW5kZWQiLCJsaW5lTWl0ZXJMaW1pdCIsInBvaW50UmFkaXVzU2NhbGUiLCJwb2ludFJhZGl1c01pblBpeGVscyIsInBvaW50UmFkaXVzTWF4UGl4ZWxzIiwibGluZURhc2hKdXN0aWZpZWQiLCJnZXRMaW5lQ29sb3IiLCJpc1NlbGVjdGVkIiwiZ2V0RmlsbENvbG9yIiwiZ2V0UmFkaXVzIiwiZiIsInJhZGl1cyIsInNpemUiLCJnZXRMaW5lV2lkdGgiLCJsaW5lV2lkdGgiLCJnZXRMaW5lRGFzaEFycmF5IiwiZ2V0VGVudGF0aXZlTGluZURhc2hBcnJheSIsImdldFRlbnRhdGl2ZUxpbmVDb2xvciIsImdldFRlbnRhdGl2ZUZpbGxDb2xvciIsImdldFRlbnRhdGl2ZUxpbmVXaWR0aCIsImVkaXRIYW5kbGVQb2ludFJhZGl1c1NjYWxlIiwiZWRpdEhhbmRsZVBvaW50T3V0bGluZSIsImVkaXRIYW5kbGVQb2ludFN0cm9rZVdpZHRoIiwiZWRpdEhhbmRsZVBvaW50UmFkaXVzTWluUGl4ZWxzIiwiZWRpdEhhbmRsZVBvaW50UmFkaXVzTWF4UGl4ZWxzIiwiZ2V0RWRpdEhhbmRsZVBvaW50Q29sb3IiLCJnZXRFZGl0SGFuZGxlUG9pbnRSYWRpdXMiLCJlZGl0SGFuZGxlSWNvbkF0bGFzIiwiZWRpdEhhbmRsZUljb25NYXBwaW5nIiwiZWRpdEhhbmRsZUljb25TaXplU2NhbGUiLCJnZXRFZGl0SGFuZGxlSWNvbiIsImdldEVkaXRIYW5kbGVJY29uU2l6ZSIsImdldEVkaXRIYW5kbGVJY29uQ29sb3IiLCJnZXRFZGl0SGFuZGxlSWNvbkFuZ2xlIiwibW9kZUhhbmRsZXJzIiwidmlldyIsImRyYXdQb2x5Z29uIiwiRHJhd1BvbHlnb25Nb2RlIiwiRWRpdGFibGVHZW9Kc29uTGF5ZXJfRURJVF9NT0RFX1BPQyIsInN1YkxheWVyUHJvcHMiLCJnZXRTdWJMYXllclByb3BzIiwiaWQiLCJkYXRhIiwicHJvcHMiLCJzZWxlY3Rpb25Bd2FyZUFjY2Vzc29yIiwidXBkYXRlVHJpZ2dlcnMiLCJzZWxlY3RlZEZlYXR1cmVJbmRleGVzIiwibGF5ZXJzIiwiR2VvSnNvbkxheWVyIiwiY29uY2F0IiwiY3JlYXRlR3VpZGVzTGF5ZXJzIiwic2V0U3RhdGUiLCJzZWxlY3RlZEZlYXR1cmVzIiwiZWRpdEhhbmRsZXMiLCJvcHRzIiwiY2hhbmdlRmxhZ3MiLCJzdGF0ZUNoYW5nZWQiLCJvbGRQcm9wcyIsIm1vZGVIYW5kbGVyIiwic3RhdGUiLCJwcm9wc09yRGF0YUNoYW5nZWQiLCJjb25zb2xlIiwid2FybiIsImN1cnNvciIsIkFycmF5IiwiaXNBcnJheSIsIm1hcCIsImVsZW0iLCJmZWF0dXJlcyIsIm1vZGVDb25maWciLCJzZWxlY3RlZEluZGV4ZXMiLCJsYXN0UG9pbnRlck1vdmVFdmVudCIsImVkaXRBY3Rpb24iLCJvblVwZGF0ZUN1cnNvciIsImFjY2Vzc29yIiwiaXNGZWF0dXJlU2VsZWN0ZWQiLCJsZW5ndGgiLCJmZWF0dXJlSW5kZXgiLCJpbmRleE9mIiwiaW5jbHVkZXMiLCJpbmZvIiwic291cmNlTGF5ZXIiLCJlbmRzV2l0aCIsImlzR3VpZGUiLCJndWlkZXMiLCJnZXRHdWlkZXMiLCJnZXRNb2RlUHJvcHMiLCJwb2ludExheWVyUHJvcHMiLCJ0eXBlIiwiSWNvbkxheWVyIiwiaWNvbkF0bGFzIiwiaWNvbk1hcHBpbmciLCJzaXplU2NhbGUiLCJnZXRJY29uIiwiZ2V0U2l6ZSIsImdldENvbG9yIiwiZ2V0QW5nbGUiLCJTY2F0dGVycGxvdExheWVyIiwicmFkaXVzU2NhbGUiLCJyYWRpdXNNaW5QaXhlbHMiLCJyYWRpdXNNYXhQaXhlbHMiLCJnZXRsaW5lQ29sb3IiLCJsYXllciIsIl9zdWJMYXllclByb3BzIiwicG9pbnRzIiwiZXZlbnQiLCJnZXRBY3RpdmVNb2RlSGFuZGxlciIsImhhbmRsZUNsaWNrIiwiaGFuZGxlU3RhcnREcmFnZ2luZyIsImhhbmRsZVN0b3BEcmFnZ2luZyIsImhhbmRsZVBvaW50ZXJNb3ZlIiwiaXNEcmFnZ2luZyIsIkVkaXRhYmxlTGF5ZXIiLCJsYXllck5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFHQTs7QUFFQTs7QUFXQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxrQkFBa0IsR0FBRyxDQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsR0FBWCxFQUFnQixJQUFoQixDQUEzQjtBQUNBLElB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QUFDekMsV0FBS0Msb0JBQUwsR0FBNEJFLG1CQUE1QixDQUFnREgsS0FBaEQsRUFBdUQsS0FBS25CLFlBQUwsQ0FBa0IsS0FBSzNDLEtBQXZCLENBQXZEO0FBQ0Q7OzttQ0FFYzhELEssRUFBMEI7QUFDdkMsV0FBS0Msb0JBQUwsR0FBNEJHLGtCQUE1QixDQUErQ0osS0FBL0MsRUFBc0QsS0FBS25CLFlBQUwsQ0FBa0IsS0FBSzNDLEtBQXZCLENBQXREO0FBQ0Q7OztrQ0FFYThELEssRUFBeUI7QUFDckMsV0FBS3RELFFBQUwsQ0FBYztBQUFFb0IsUUFBQUEsb0JBQW9CLEVBQUVrQztBQUF4QixPQUFkO0FBQ0EsV0FBS0Msb0JBQUwsR0FBNEJJLGlCQUE1QixDQUE4Q0wsS0FBOUMsRUFBcUQsS0FBS25CLFlBQUwsQ0FBa0IsS0FBSzNDLEtBQXZCLENBQXJEO0FBQ0Q7OztxQ0FFa0Q7QUFBQSxVQUF2Q29FLFVBQXVDLFNBQXZDQSxVQUF1QztBQUFBLFVBQzNDaEQsTUFEMkMsR0FDaEMsS0FBS0osS0FEMkIsQ0FDM0NJLE1BRDJDOztBQUVqRCxVQUFJLENBQUNBLE1BQUwsRUFBYTtBQUNYQSxRQUFBQSxNQUFNLEdBQUdnRCxVQUFVLEdBQUcsVUFBSCxHQUFnQixNQUFuQztBQUNEOztBQUNELGFBQU9oRCxNQUFQO0FBQ0Q7OzsyQ0FFdUM7QUFDdEMsYUFBTyxLQUFLSixLQUFMLENBQVdELFdBQWxCO0FBQ0Q7Ozs7RUF0TzZEc0QsaUMsR0F5T2hFOzs7O0FBQ0ExRSxrQ0FBa0MsQ0FBQzJFLFNBQW5DLEdBQStDLG9DQUEvQyxDLENBQ0E7O0FBQ0EzRSxrQ0FBa0MsQ0FBQ3BELFlBQW5DLEdBQWtEQSxZQUFsRCIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG4vKiBlc2xpbnQtZW52IGJyb3dzZXIgKi9cblxuaW1wb3J0IHsgR2VvSnNvbkxheWVyLCBTY2F0dGVycGxvdExheWVyLCBJY29uTGF5ZXIgfSBmcm9tICdrZXBsZXItb3VkYXRlZC1kZWNrLmdsLWxheWVycyc7XG5cbmltcG9ydCB7IFZpZXdNb2RlLCBEcmF3UG9seWdvbk1vZGUgfSBmcm9tICdAbmVidWxhLmdsL2VkaXQtbW9kZXMnO1xuXG5pbXBvcnQgdHlwZSB7XG4gIEVkaXRBY3Rpb24sXG4gIENsaWNrRXZlbnQsXG4gIFN0YXJ0RHJhZ2dpbmdFdmVudCxcbiAgU3RvcERyYWdnaW5nRXZlbnQsXG4gIFBvaW50ZXJNb3ZlRXZlbnQsXG4gIEdlb0pzb25FZGl0TW9kZSxcbiAgRmVhdHVyZUNvbGxlY3Rpb25cbn0gZnJvbSAnQG5lYnVsYS5nbC9lZGl0LW1vZGVzJztcbmltcG9ydCBFZGl0YWJsZUxheWVyIGZyb20gJy4vZWRpdGFibGUtbGF5ZXItZWRpdC1tb2RlLXBvYy5qcyc7XG5cbmNvbnN0IERFRkFVTFRfTElORV9DT0xPUiA9IFsweDAsIDB4MCwgMHgwLCAweGZmXTtcbmNvbnN0IERFRkFVTFRfRklMTF9DT0xPUiA9IFsweDAsIDB4MCwgMHgwLCAweDkwXTtcbmNvbnN0IERFRkFVTFRfU0VMRUNURURfTElORV9DT0xPUiA9IFsweDkwLCAweDkwLCAweDkwLCAweGZmXTtcbmNvbnN0IERFRkFVTFRfU0VMRUNURURfRklMTF9DT0xPUiA9IFsweDkwLCAweDkwLCAweDkwLCAweDkwXTtcbmNvbnN0IERFRkFVTFRfRURJVElOR19FWElTVElOR19QT0lOVF9DT0xPUiA9IFsweGMwLCAweDAsIDB4MCwgMHhmZl07XG5jb25zdCBERUZBVUxUX0VESVRJTkdfSU5URVJNRURJQVRFX1BPSU5UX0NPTE9SID0gWzB4MCwgMHgwLCAweDAsIDB4ODBdO1xuY29uc3QgREVGQVVMVF9FRElUSU5HX1NOQVBfUE9JTlRfQ09MT1IgPSBbMHg3YywgMHgwMCwgMHhjMCwgMHhmZl07XG5jb25zdCBERUZBVUxUX0VESVRJTkdfRVhJU1RJTkdfUE9JTlRfUkFESVVTID0gNTtcbmNvbnN0IERFRkFVTFRfRURJVElOR19JTlRFUk1FRElBVEVfUE9JTlRfUkFESVVTID0gMztcbmNvbnN0IERFRkFVTFRfRURJVElOR19TTkFQX1BPSU5UX1JBRElVUyA9IDc7XG5cbmNvbnN0IERFRkFVTFRfRURJVF9NT0RFID0gbmV3IFZpZXdNb2RlKCk7XG5cbmZ1bmN0aW9uIGdldEVkaXRIYW5kbGVDb2xvcihoYW5kbGUpIHtcbiAgc3dpdGNoIChoYW5kbGUuc291cmNlRmVhdHVyZS5mZWF0dXJlLnByb3BlcnRpZXMuZWRpdEhhbmRsZVR5cGUpIHtcbiAgICBjYXNlICdleGlzdGluZyc6XG4gICAgICByZXR1cm4gREVGQVVMVF9FRElUSU5HX0VYSVNUSU5HX1BPSU5UX0NPTE9SO1xuICAgIGNhc2UgJ3NuYXAnOlxuICAgICAgcmV0dXJuIERFRkFVTFRfRURJVElOR19TTkFQX1BPSU5UX0NPTE9SO1xuICAgIGNhc2UgJ2ludGVybWVkaWF0ZSc6XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBERUZBVUxUX0VESVRJTkdfSU5URVJNRURJQVRFX1BPSU5UX0NPTE9SO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldEVkaXRIYW5kbGVSYWRpdXMoaGFuZGxlKSB7XG4gIHN3aXRjaCAoaGFuZGxlLnNvdXJjZUZlYXR1cmUuZmVhdHVyZS5wcm9wZXJ0aWVzLmVkaXRIYW5kbGVUeXBlKSB7XG4gICAgY2FzZSAnZXhpc3RpbmcnOlxuICAgICAgcmV0dXJuIERFRkFVTFRfRURJVElOR19FWElTVElOR19QT0lOVF9SQURJVVM7XG4gICAgY2FzZSAnc25hcCc6XG4gICAgICByZXR1cm4gREVGQVVMVF9FRElUSU5HX1NOQVBfUE9JTlRfUkFESVVTO1xuICAgIGNhc2UgJ2ludGVybWVkaWF0ZSc6XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBERUZBVUxUX0VESVRJTkdfSU5URVJNRURJQVRFX1BPSU5UX1JBRElVUztcbiAgfVxufVxuXG5jb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gIG1vZGU6ICdtb2RpZnknLFxuXG4gIC8vIEVkaXQgYW5kIGludGVyYWN0aW9uIGV2ZW50c1xuICBvbkVkaXQ6ICgpID0+IHt9LFxuXG4gIHBpY2thYmxlOiB0cnVlLFxuICBwaWNraW5nUmFkaXVzOiAxMCxcbiAgZnA2NDogZmFsc2UsXG4gIGZpbGxlZDogdHJ1ZSxcbiAgc3Ryb2tlZDogdHJ1ZSxcbiAgbGluZVdpZHRoU2NhbGU6IDEsXG4gIGxpbmVXaWR0aE1pblBpeGVsczogMSxcbiAgbGluZVdpZHRoTWF4UGl4ZWxzOiBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUixcbiAgbGluZVdpZHRoVW5pdHM6ICdtZXRlcnMnLFxuICBsaW5lSm9pbnRSb3VuZGVkOiBmYWxzZSxcbiAgbGluZU1pdGVyTGltaXQ6IDQsXG4gIHBvaW50UmFkaXVzU2NhbGU6IDEsXG4gIHBvaW50UmFkaXVzTWluUGl4ZWxzOiAyLFxuICBwb2ludFJhZGl1c01heFBpeGVsczogTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVIsXG4gIGxpbmVEYXNoSnVzdGlmaWVkOiBmYWxzZSxcbiAgZ2V0TGluZUNvbG9yOiAoZmVhdHVyZSwgaXNTZWxlY3RlZCwgbW9kZSkgPT5cbiAgICBpc1NlbGVjdGVkID8gREVGQVVMVF9TRUxFQ1RFRF9MSU5FX0NPTE9SIDogREVGQVVMVF9MSU5FX0NPTE9SLFxuICBnZXRGaWxsQ29sb3I6IChmZWF0dXJlLCBpc1NlbGVjdGVkLCBtb2RlKSA9PlxuICAgIGlzU2VsZWN0ZWQgPyBERUZBVUxUX1NFTEVDVEVEX0ZJTExfQ09MT1IgOiBERUZBVUxUX0ZJTExfQ09MT1IsXG4gIGdldFJhZGl1czogZiA9PlxuICAgIChmICYmIGYucHJvcGVydGllcyAmJiBmLnByb3BlcnRpZXMucmFkaXVzKSB8fCAoZiAmJiBmLnByb3BlcnRpZXMgJiYgZi5wcm9wZXJ0aWVzLnNpemUpIHx8IDEsXG4gIGdldExpbmVXaWR0aDogZiA9PiAoZiAmJiBmLnByb3BlcnRpZXMgJiYgZi5wcm9wZXJ0aWVzLmxpbmVXaWR0aCkgfHwgMSxcbiAgZ2V0TGluZURhc2hBcnJheTogKGZlYXR1cmUsIGlzU2VsZWN0ZWQsIG1vZGUpID0+XG4gICAgaXNTZWxlY3RlZCAmJiBtb2RlICE9PSAndmlldycgPyBbNywgNF0gOiBbMCwgMF0sXG5cbiAgLy8gVGVudGF0aXZlIGZlYXR1cmUgcmVuZGVyaW5nXG4gIGdldFRlbnRhdGl2ZUxpbmVEYXNoQXJyYXk6IChmLCBtb2RlKSA9PiBbNywgNF0sXG4gIGdldFRlbnRhdGl2ZUxpbmVDb2xvcjogKGYsIG1vZGUpID0+IERFRkFVTFRfU0VMRUNURURfTElORV9DT0xPUixcbiAgZ2V0VGVudGF0aXZlRmlsbENvbG9yOiAoZiwgbW9kZSkgPT4gREVGQVVMVF9TRUxFQ1RFRF9GSUxMX0NPTE9SLFxuICBnZXRUZW50YXRpdmVMaW5lV2lkdGg6IChmLCBtb2RlKSA9PiAoZiAmJiBmLnByb3BlcnRpZXMgJiYgZi5wcm9wZXJ0aWVzLmxpbmVXaWR0aCkgfHwgMSxcblxuICBlZGl0SGFuZGxlVHlwZTogJ3BvaW50JyxcblxuICAvLyBwb2ludCBoYW5kbGVzXG4gIGVkaXRIYW5kbGVQb2ludFJhZGl1c1NjYWxlOiAxLFxuICBlZGl0SGFuZGxlUG9pbnRPdXRsaW5lOiBmYWxzZSxcbiAgZWRpdEhhbmRsZVBvaW50U3Ryb2tlV2lkdGg6IDEsXG4gIGVkaXRIYW5kbGVQb2ludFJhZGl1c01pblBpeGVsczogNCxcbiAgZWRpdEhhbmRsZVBvaW50UmFkaXVzTWF4UGl4ZWxzOiA4LFxuICBnZXRFZGl0SGFuZGxlUG9pbnRDb2xvcjogZ2V0RWRpdEhhbmRsZUNvbG9yLFxuICBnZXRFZGl0SGFuZGxlUG9pbnRSYWRpdXM6IGdldEVkaXRIYW5kbGVSYWRpdXMsXG5cbiAgLy8gaWNvbiBoYW5kbGVzXG4gIGVkaXRIYW5kbGVJY29uQXRsYXM6IG51bGwsXG4gIGVkaXRIYW5kbGVJY29uTWFwcGluZzogbnVsbCxcbiAgZWRpdEhhbmRsZUljb25TaXplU2NhbGU6IDEsXG4gIGdldEVkaXRIYW5kbGVJY29uOiBoYW5kbGUgPT4gaGFuZGxlLnNvdXJjZUZlYXR1cmUuZmVhdHVyZS5wcm9wZXJ0aWVzLmVkaXRIYW5kbGVUeXBlLFxuICBnZXRFZGl0SGFuZGxlSWNvblNpemU6IDEwLFxuICBnZXRFZGl0SGFuZGxlSWNvbkNvbG9yOiBnZXRFZGl0SGFuZGxlQ29sb3IsXG4gIGdldEVkaXRIYW5kbGVJY29uQW5nbGU6IDAsXG5cbiAgLy8gTW9kZSBoYW5kbGVyc1xuICBtb2RlSGFuZGxlcnM6IHtcbiAgICB2aWV3OiBuZXcgVmlld01vZGUoKSxcbiAgICBkcmF3UG9seWdvbjogbmV3IERyYXdQb2x5Z29uTW9kZSgpXG4gIH1cbn07XG5cbnR5cGUgUHJvcHMgPSB7XG4gIG1vZGU6IHN0cmluZyxcbiAgbW9kZUhhbmRsZXJzOiB7IFttb2RlOiBzdHJpbmddOiBHZW9Kc29uRWRpdE1vZGUgfSxcbiAgb25FZGl0OiAoRWRpdEFjdGlvbjxGZWF0dXJlQ29sbGVjdGlvbj4pID0+IHZvaWQsXG4gIC8vIFRPRE86IHR5cGUgdGhlIHJlc3RcbiAgW3N0cmluZ106IGFueVxufTtcblxuLy8gdHlwZSBTdGF0ZSA9IHtcbi8vICAgbW9kZUhhbmRsZXI6IEVkaXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24sXG4vLyAgIHRlbnRhdGl2ZUZlYXR1cmU6ID9GZWF0dXJlLFxuLy8gICBlZGl0SGFuZGxlczogYW55W10sXG4vLyAgIHNlbGVjdGVkRmVhdHVyZXM6IEZlYXR1cmVbXVxuLy8gfTtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNhbWVsY2FzZVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWRpdGFibGVHZW9Kc29uTGF5ZXJfRURJVF9NT0RFX1BPQyBleHRlbmRzIEVkaXRhYmxlTGF5ZXIge1xuICAvLyBzdGF0ZTogU3RhdGU7XG4gIC8vIHByb3BzOiBQcm9wcztcbiAgLy8gc2V0U3RhdGU6ICgkU2hhcGU8U3RhdGU+KSA9PiB2b2lkO1xuXG4gIHJlbmRlckxheWVycygpIHtcbiAgICBjb25zdCBzdWJMYXllclByb3BzID0gdGhpcy5nZXRTdWJMYXllclByb3BzKHtcbiAgICAgIGlkOiAnZ2VvanNvbicsXG5cbiAgICAgIC8vIFByb3h5IG1vc3QgR2VvSnNvbkxheWVyIHByb3BzIGFzLWlzXG4gICAgICBkYXRhOiB0aGlzLnByb3BzLmRhdGEsXG4gICAgICBmcDY0OiB0aGlzLnByb3BzLmZwNjQsXG4gICAgICBmaWxsZWQ6IHRoaXMucHJvcHMuZmlsbGVkLFxuICAgICAgc3Ryb2tlZDogdGhpcy5wcm9wcy5zdHJva2VkLFxuICAgICAgbGluZVdpZHRoU2NhbGU6IHRoaXMucHJvcHMubGluZVdpZHRoU2NhbGUsXG4gICAgICBsaW5lV2lkdGhNaW5QaXhlbHM6IHRoaXMucHJvcHMubGluZVdpZHRoTWluUGl4ZWxzLFxuICAgICAgbGluZVdpZHRoTWF4UGl4ZWxzOiB0aGlzLnByb3BzLmxpbmVXaWR0aE1heFBpeGVscyxcbiAgICAgIGxpbmVXaWR0aFVuaXRzOiB0aGlzLnByb3BzLmxpbmVXaWR0aFVuaXRzLFxuICAgICAgbGluZUpvaW50Um91bmRlZDogdGhpcy5wcm9wcy5saW5lSm9pbnRSb3VuZGVkLFxuICAgICAgbGluZU1pdGVyTGltaXQ6IHRoaXMucHJvcHMubGluZU1pdGVyTGltaXQsXG4gICAgICBwb2ludFJhZGl1c1NjYWxlOiB0aGlzLnByb3BzLnBvaW50UmFkaXVzU2NhbGUsXG4gICAgICBwb2ludFJhZGl1c01pblBpeGVsczogdGhpcy5wcm9wcy5wb2ludFJhZGl1c01pblBpeGVscyxcbiAgICAgIHBvaW50UmFkaXVzTWF4UGl4ZWxzOiB0aGlzLnByb3BzLnBvaW50UmFkaXVzTWF4UGl4ZWxzLFxuICAgICAgbGluZURhc2hKdXN0aWZpZWQ6IHRoaXMucHJvcHMubGluZURhc2hKdXN0aWZpZWQsXG4gICAgICBnZXRMaW5lQ29sb3I6IHRoaXMuc2VsZWN0aW9uQXdhcmVBY2Nlc3Nvcih0aGlzLnByb3BzLmdldExpbmVDb2xvciksXG4gICAgICBnZXRGaWxsQ29sb3I6IHRoaXMuc2VsZWN0aW9uQXdhcmVBY2Nlc3Nvcih0aGlzLnByb3BzLmdldEZpbGxDb2xvciksXG4gICAgICBnZXRSYWRpdXM6IHRoaXMuc2VsZWN0aW9uQXdhcmVBY2Nlc3Nvcih0aGlzLnByb3BzLmdldFJhZGl1cyksXG4gICAgICBnZXRMaW5lV2lkdGg6IHRoaXMuc2VsZWN0aW9uQXdhcmVBY2Nlc3Nvcih0aGlzLnByb3BzLmdldExpbmVXaWR0aCksXG4gICAgICBnZXRMaW5lRGFzaEFycmF5OiB0aGlzLnNlbGVjdGlvbkF3YXJlQWNjZXNzb3IodGhpcy5wcm9wcy5nZXRMaW5lRGFzaEFycmF5KSxcblxuICAgICAgdXBkYXRlVHJpZ2dlcnM6IHtcbiAgICAgICAgZ2V0TGluZUNvbG9yOiBbdGhpcy5wcm9wcy5zZWxlY3RlZEZlYXR1cmVJbmRleGVzLCB0aGlzLnByb3BzLm1vZGVdLFxuICAgICAgICBnZXRGaWxsQ29sb3I6IFt0aGlzLnByb3BzLnNlbGVjdGVkRmVhdHVyZUluZGV4ZXMsIHRoaXMucHJvcHMubW9kZV0sXG4gICAgICAgIGdldFJhZGl1czogW3RoaXMucHJvcHMuc2VsZWN0ZWRGZWF0dXJlSW5kZXhlcywgdGhpcy5wcm9wcy5tb2RlXSxcbiAgICAgICAgZ2V0TGluZVdpZHRoOiBbdGhpcy5wcm9wcy5zZWxlY3RlZEZlYXR1cmVJbmRleGVzLCB0aGlzLnByb3BzLm1vZGVdLFxuICAgICAgICBnZXRMaW5lRGFzaEFycmF5OiBbdGhpcy5wcm9wcy5zZWxlY3RlZEZlYXR1cmVJbmRleGVzLCB0aGlzLnByb3BzLm1vZGVdXG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBsZXQgbGF5ZXJzOiBhbnkgPSBbbmV3IEdlb0pzb25MYXllcihzdWJMYXllclByb3BzKV07XG5cbiAgICBsYXllcnMgPSBsYXllcnMuY29uY2F0KHRoaXMuY3JlYXRlR3VpZGVzTGF5ZXJzKCkpO1xuXG4gICAgcmV0dXJuIGxheWVycztcbiAgfVxuXG4gIGluaXRpYWxpemVTdGF0ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplU3RhdGUoKTtcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgc2VsZWN0ZWRGZWF0dXJlczogW10sXG4gICAgICBlZGl0SGFuZGxlczogW11cbiAgICB9KTtcbiAgfVxuXG4gIC8vIFRPRE86IGlzIHRoaXMgdGhlIGJlc3Qgd2F5IHRvIHByb3Blcmx5IHVwZGF0ZSBzdGF0ZSBmcm9tIGFuIG91dHNpZGUgZXZlbnQgaGFuZGxlcj9cbiAgc2hvdWxkVXBkYXRlU3RhdGUob3B0czogYW55KSB7XG4gICAgLy8gY29uc29sZS5sb2coXG4gICAgLy8gICAnc2hvdWxkVXBkYXRlU3RhdGUnLFxuICAgIC8vICAgb3B0cy5jaGFuZ2VGbGFncy5wcm9wc09yRGF0YUNoYW5nZWQsXG4gICAgLy8gICBvcHRzLmNoYW5nZUZsYWdzLnN0YXRlQ2hhbmdlZFxuICAgIC8vICk7XG4gICAgcmV0dXJuIHN1cGVyLnNob3VsZFVwZGF0ZVN0YXRlKG9wdHMpIHx8IG9wdHMuY2hhbmdlRmxhZ3Muc3RhdGVDaGFuZ2VkO1xuICB9XG5cbiAgdXBkYXRlU3RhdGUoe1xuICAgIHByb3BzLFxuICAgIG9sZFByb3BzLFxuICAgIGNoYW5nZUZsYWdzXG4gIH06IHtcbiAgICBwcm9wczogUHJvcHMsXG4gICAgb2xkUHJvcHM6IFByb3BzLFxuICAgIGNoYW5nZUZsYWdzOiBhbnlcbiAgfSkge1xuICAgIHN1cGVyLnVwZGF0ZVN0YXRlKHsgcHJvcHMsIGNoYW5nZUZsYWdzIH0pO1xuXG4gICAgbGV0IG1vZGVIYW5kbGVyOiBHZW9Kc29uRWRpdE1vZGUgPSB0aGlzLnN0YXRlLm1vZGVIYW5kbGVyO1xuICAgIGlmIChjaGFuZ2VGbGFncy5wcm9wc09yRGF0YUNoYW5nZWQpIHtcbiAgICAgIGlmIChwcm9wcy5tb2RlSGFuZGxlcnMgIT09IG9sZFByb3BzLm1vZGVIYW5kbGVycyB8fCBwcm9wcy5tb2RlICE9PSBvbGRQcm9wcy5tb2RlKSB7XG4gICAgICAgIG1vZGVIYW5kbGVyID0gcHJvcHMubW9kZUhhbmRsZXJzW3Byb3BzLm1vZGVdO1xuXG4gICAgICAgIGlmICghbW9kZUhhbmRsZXIpIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oYE5vIGhhbmRsZXIgY29uZmlndXJlZCBmb3IgbW9kZSAke3Byb3BzLm1vZGV9YCk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZSxuby11bmRlZlxuICAgICAgICAgIC8vIFVzZSBkZWZhdWx0IG1vZGUgaGFuZGxlclxuICAgICAgICAgIG1vZGVIYW5kbGVyID0gREVGQVVMVF9FRElUX01PREU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobW9kZUhhbmRsZXIgIT09IHRoaXMuc3RhdGUubW9kZUhhbmRsZXIpIHtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgbW9kZUhhbmRsZXIsIGN1cnNvcjogbnVsbCB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGxldCBzZWxlY3RlZEZlYXR1cmVzID0gW107XG4gICAgaWYgKEFycmF5LmlzQXJyYXkocHJvcHMuc2VsZWN0ZWRGZWF0dXJlSW5kZXhlcykpIHtcbiAgICAgIC8vIFRPRE86IG5lZWRzIGltcHJvdmVkIHRlc3RpbmcsIGkuZS4gY2hlY2tpbmcgZm9yIGR1cGxpY2F0ZXMsIE5hTnMsIG91dCBvZiByYW5nZSBudW1iZXJzLCAuLi5cbiAgICAgIHNlbGVjdGVkRmVhdHVyZXMgPSBwcm9wcy5zZWxlY3RlZEZlYXR1cmVJbmRleGVzLm1hcChlbGVtID0+IHByb3BzLmRhdGEuZmVhdHVyZXNbZWxlbV0pO1xuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoeyBzZWxlY3RlZEZlYXR1cmVzIH0pO1xuICB9XG5cbiAgZ2V0TW9kZVByb3BzKHByb3BzOiBQcm9wcykge1xuICAgIHJldHVybiB7XG4gICAgICBtb2RlQ29uZmlnOiBwcm9wcy5tb2RlQ29uZmlnLFxuICAgICAgZGF0YTogcHJvcHMuZGF0YSxcbiAgICAgIHNlbGVjdGVkSW5kZXhlczogcHJvcHMuc2VsZWN0ZWRGZWF0dXJlSW5kZXhlcyxcbiAgICAgIGxhc3RQb2ludGVyTW92ZUV2ZW50OiB0aGlzLnN0YXRlLmxhc3RQb2ludGVyTW92ZUV2ZW50LFxuICAgICAgY3Vyc29yOiB0aGlzLnN0YXRlLmN1cnNvcixcbiAgICAgIG9uRWRpdDogKGVkaXRBY3Rpb246IEVkaXRBY3Rpb248RmVhdHVyZUNvbGxlY3Rpb24+KSA9PiB7XG4gICAgICAgIHByb3BzLm9uRWRpdChlZGl0QWN0aW9uKTtcbiAgICAgIH0sXG4gICAgICBvblVwZGF0ZUN1cnNvcjogKGN1cnNvcjogP3N0cmluZykgPT4ge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHsgY3Vyc29yIH0pO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBzZWxlY3Rpb25Bd2FyZUFjY2Vzc29yKGFjY2Vzc29yOiBhbnkpIHtcbiAgICBpZiAodHlwZW9mIGFjY2Vzc29yICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gYWNjZXNzb3I7XG4gICAgfVxuICAgIHJldHVybiAoZmVhdHVyZTogT2JqZWN0KSA9PiBhY2Nlc3NvcihmZWF0dXJlLCB0aGlzLmlzRmVhdHVyZVNlbGVjdGVkKGZlYXR1cmUpLCB0aGlzLnByb3BzLm1vZGUpO1xuICB9XG5cbiAgaXNGZWF0dXJlU2VsZWN0ZWQoZmVhdHVyZTogT2JqZWN0KSB7XG4gICAgaWYgKCF0aGlzLnByb3BzLmRhdGEgfHwgIXRoaXMucHJvcHMuc2VsZWN0ZWRGZWF0dXJlSW5kZXhlcykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoIXRoaXMucHJvcHMuc2VsZWN0ZWRGZWF0dXJlSW5kZXhlcy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY29uc3QgZmVhdHVyZUluZGV4ID0gdGhpcy5wcm9wcy5kYXRhLmZlYXR1cmVzLmluZGV4T2YoZmVhdHVyZSk7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMuc2VsZWN0ZWRGZWF0dXJlSW5kZXhlcy5pbmNsdWRlcyhmZWF0dXJlSW5kZXgpO1xuICB9XG5cbiAgZ2V0UGlja2luZ0luZm8oeyBpbmZvLCBzb3VyY2VMYXllciB9OiBPYmplY3QpIHtcbiAgICBpZiAoc291cmNlTGF5ZXIuaWQuZW5kc1dpdGgoJy1lZGl0LWhhbmRsZXMnKSkge1xuICAgICAgLy8gSWYgdXNlciBpcyBwaWNraW5nIGFuIGVkaXRpbmcgaGFuZGxlLCBhZGQgYWRkaXRpb25hbCBkYXRhIHRvIHRoZSBpbmZvXG4gICAgICBpbmZvLmlzR3VpZGUgPSB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBpbmZvO1xuICB9XG5cbiAgY3JlYXRlR3VpZGVzTGF5ZXJzKCkge1xuICAgIGNvbnN0IG1vZGUgPSB0aGlzLnByb3BzLm1vZGVIYW5kbGVyc1t0aGlzLnByb3BzLm1vZGVdIHx8IERFRkFVTFRfRURJVF9NT0RFO1xuICAgIGNvbnN0IGd1aWRlczogRmVhdHVyZUNvbGxlY3Rpb24gPSBtb2RlLmdldEd1aWRlcyh0aGlzLmdldE1vZGVQcm9wcyh0aGlzLnByb3BzKSk7XG5cbiAgICBpZiAoIWd1aWRlcyB8fCAhZ3VpZGVzLmZlYXR1cmVzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGxldCBwb2ludExheWVyUHJvcHM7XG4gICAgaWYgKHRoaXMucHJvcHMuZWRpdEhhbmRsZVR5cGUgPT09ICdpY29uJykge1xuICAgICAgcG9pbnRMYXllclByb3BzID0ge1xuICAgICAgICB0eXBlOiBJY29uTGF5ZXIsXG4gICAgICAgIGljb25BdGxhczogdGhpcy5wcm9wcy5lZGl0SGFuZGxlSWNvbkF0bGFzLFxuICAgICAgICBpY29uTWFwcGluZzogdGhpcy5wcm9wcy5lZGl0SGFuZGxlSWNvbk1hcHBpbmcsXG4gICAgICAgIHNpemVTY2FsZTogdGhpcy5wcm9wcy5lZGl0SGFuZGxlSWNvblNpemVTY2FsZSxcbiAgICAgICAgZ2V0SWNvbjogdGhpcy5wcm9wcy5nZXRFZGl0SGFuZGxlSWNvbixcbiAgICAgICAgZ2V0U2l6ZTogdGhpcy5wcm9wcy5nZXRFZGl0SGFuZGxlSWNvblNpemUsXG4gICAgICAgIGdldENvbG9yOiB0aGlzLnByb3BzLmdldEVkaXRIYW5kbGVJY29uQ29sb3IsXG4gICAgICAgIGdldEFuZ2xlOiB0aGlzLnByb3BzLmdldEVkaXRIYW5kbGVJY29uQW5nbGVcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHBvaW50TGF5ZXJQcm9wcyA9IHtcbiAgICAgICAgdHlwZTogU2NhdHRlcnBsb3RMYXllcixcbiAgICAgICAgcmFkaXVzU2NhbGU6IHRoaXMucHJvcHMuZWRpdEhhbmRsZVBvaW50UmFkaXVzU2NhbGUsXG4gICAgICAgIHN0cm9rZWQ6IHRoaXMucHJvcHMuZWRpdEhhbmRsZVBvaW50T3V0bGluZSxcbiAgICAgICAgZ2V0TGluZVdpZHRoOiB0aGlzLnByb3BzLmVkaXRIYW5kbGVQb2ludFN0cm9rZVdpZHRoLFxuICAgICAgICByYWRpdXNNaW5QaXhlbHM6IHRoaXMucHJvcHMuZWRpdEhhbmRsZVBvaW50UmFkaXVzTWluUGl4ZWxzLFxuICAgICAgICByYWRpdXNNYXhQaXhlbHM6IHRoaXMucHJvcHMuZWRpdEhhbmRsZVBvaW50UmFkaXVzTWF4UGl4ZWxzLFxuICAgICAgICBnZXRSYWRpdXM6IHRoaXMucHJvcHMuZ2V0RWRpdEhhbmRsZVBvaW50UmFkaXVzLFxuICAgICAgICBnZXRGaWxsQ29sb3I6IHRoaXMucHJvcHMuZ2V0RWRpdEhhbmRsZVBvaW50Q29sb3IsXG4gICAgICAgIGdldGxpbmVDb2xvcjogdGhpcy5wcm9wcy5nZXRFZGl0SGFuZGxlUG9pbnRDb2xvclxuICAgICAgfTtcbiAgICB9XG5cbiAgICBjb25zdCBsYXllciA9IG5ldyBHZW9Kc29uTGF5ZXIoXG4gICAgICB0aGlzLmdldFN1YkxheWVyUHJvcHMoe1xuICAgICAgICBpZDogYGd1aWRlc2AsXG4gICAgICAgIGRhdGE6IGd1aWRlcyxcbiAgICAgICAgZnA2NDogdGhpcy5wcm9wcy5mcDY0LFxuICAgICAgICBfc3ViTGF5ZXJQcm9wczoge1xuICAgICAgICAgIHBvaW50czogcG9pbnRMYXllclByb3BzXG4gICAgICAgIH0sXG4gICAgICAgIGxpbmVXaWR0aFNjYWxlOiB0aGlzLnByb3BzLmxpbmVXaWR0aFNjYWxlLFxuICAgICAgICBsaW5lV2lkdGhNaW5QaXhlbHM6IHRoaXMucHJvcHMubGluZVdpZHRoTWluUGl4ZWxzLFxuICAgICAgICBsaW5lV2lkdGhNYXhQaXhlbHM6IHRoaXMucHJvcHMubGluZVdpZHRoTWF4UGl4ZWxzLFxuICAgICAgICBsaW5lV2lkdGhVbml0czogdGhpcy5wcm9wcy5saW5lV2lkdGhVbml0cyxcbiAgICAgICAgbGluZUpvaW50Um91bmRlZDogdGhpcy5wcm9wcy5saW5lSm9pbnRSb3VuZGVkLFxuICAgICAgICBsaW5lTWl0ZXJMaW1pdDogdGhpcy5wcm9wcy5saW5lTWl0ZXJMaW1pdCxcbiAgICAgICAgZ2V0TGluZUNvbG9yOiB0aGlzLnByb3BzLmdldFRlbnRhdGl2ZUxpbmVDb2xvcixcbiAgICAgICAgZ2V0TGluZVdpZHRoOiB0aGlzLnByb3BzLmdldFRlbnRhdGl2ZUxpbmVXaWR0aCxcbiAgICAgICAgZ2V0RmlsbENvbG9yOiB0aGlzLnByb3BzLmdldFRlbnRhdGl2ZUZpbGxDb2xvcixcbiAgICAgICAgZ2V0TGluZURhc2hBcnJheTogdGhpcy5wcm9wcy5nZXRUZW50YXRpdmVMaW5lRGFzaEFycmF5XG4gICAgICB9KVxuICAgICk7XG5cbiAgICByZXR1cm4gW2xheWVyXTtcbiAgfVxuXG4gIG9uTGF5ZXJDbGljayhldmVudDogQ2xpY2tFdmVudCkge1xuICAgIHRoaXMuZ2V0QWN0aXZlTW9kZUhhbmRsZXIoKS5oYW5kbGVDbGljayhldmVudCwgdGhpcy5nZXRNb2RlUHJvcHModGhpcy5wcm9wcykpO1xuICB9XG5cbiAgb25TdGFydERyYWdnaW5nKGV2ZW50OiBTdGFydERyYWdnaW5nRXZlbnQpIHtcbiAgICB0aGlzLmdldEFjdGl2ZU1vZGVIYW5kbGVyKCkuaGFuZGxlU3RhcnREcmFnZ2luZyhldmVudCwgdGhpcy5nZXRNb2RlUHJvcHModGhpcy5wcm9wcykpO1xuICB9XG5cbiAgb25TdG9wRHJhZ2dpbmcoZXZlbnQ6IFN0b3BEcmFnZ2luZ0V2ZW50KSB7XG4gICAgdGhpcy5nZXRBY3RpdmVNb2RlSGFuZGxlcigpLmhhbmRsZVN0b3BEcmFnZ2luZyhldmVudCwgdGhpcy5nZXRNb2RlUHJvcHModGhpcy5wcm9wcykpO1xuICB9XG5cbiAgb25Qb2ludGVyTW92ZShldmVudDogUG9pbnRlck1vdmVFdmVudCkge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBsYXN0UG9pbnRlck1vdmVFdmVudDogZXZlbnQgfSk7XG4gICAgdGhpcy5nZXRBY3RpdmVNb2RlSGFuZGxlcigpLmhhbmRsZVBvaW50ZXJNb3ZlKGV2ZW50LCB0aGlzLmdldE1vZGVQcm9wcyh0aGlzLnByb3BzKSk7XG4gIH1cblxuICBnZXRDdXJzb3IoeyBpc0RyYWdnaW5nIH06IHsgaXNEcmFnZ2luZzogYm9vbGVhbiB9KSB7XG4gICAgbGV0IHsgY3Vyc29yIH0gPSB0aGlzLnN0YXRlO1xuICAgIGlmICghY3Vyc29yKSB7XG4gICAgICBjdXJzb3IgPSBpc0RyYWdnaW5nID8gJ2dyYWJiaW5nJyA6ICdncmFiJztcbiAgICB9XG4gICAgcmV0dXJuIGN1cnNvcjtcbiAgfVxuXG4gIGdldEFjdGl2ZU1vZGVIYW5kbGVyKCk6IEdlb0pzb25FZGl0TW9kZSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUubW9kZUhhbmRsZXI7XG4gIH1cbn1cblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNhbWVsY2FzZVxuRWRpdGFibGVHZW9Kc29uTGF5ZXJfRURJVF9NT0RFX1BPQy5sYXllck5hbWUgPSAnRWRpdGFibGVHZW9Kc29uTGF5ZXJfRURJVF9NT0RFX1BPQyc7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY2FtZWxjYXNlXG5FZGl0YWJsZUdlb0pzb25MYXllcl9FRElUX01PREVfUE9DLmRlZmF1bHRQcm9wcyA9IGRlZmF1bHRQcm9wcztcbiJdfQ==