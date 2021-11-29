"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactMapGl = require("react-map-gl");

var _react = _interopRequireWildcard(require("react"));

var _keplerOutdatedNebula = require("kepler-outdated-nebula.gl-edit-modes");

var _memoize = _interopRequireDefault(require("./memoize"));

var _constants = require("./constants");

var _utils = require("./edit-modes/utils");

var _editModes = require("./edit-modes");

var _Object$freeze;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var MODE_TO_HANDLER = Object.freeze((_Object$freeze = {}, _defineProperty(_Object$freeze, _constants.MODES.READ_ONLY, null), _defineProperty(_Object$freeze, _constants.MODES.SELECT, _editModes.SelectMode), _defineProperty(_Object$freeze, _constants.MODES.EDITING, _editModes.EditingMode), _defineProperty(_Object$freeze, _constants.MODES.DRAW_POINT, _editModes.DrawPointMode), _defineProperty(_Object$freeze, _constants.MODES.DRAW_PATH, _editModes.DrawLineStringMode), _defineProperty(_Object$freeze, _constants.MODES.DRAW_RECTANGLE, _editModes.DrawRectangleMode), _defineProperty(_Object$freeze, _constants.MODES.DRAW_POLYGON, _editModes.DrawPolygonMode), _Object$freeze));
var defaultProps = {
  mode: _constants.MODES.READ_ONLY,
  features: null,
  onSelect: null,
  onUpdate: null
};
var defaultState = {
  featureCollection: new _keplerOutdatedNebula.ImmutableFeatureCollection({
    type: 'FeatureCollection',
    features: []
  }),
  selectedFeatureIndex: null,
  // index, isGuide, mapCoords, screenCoords
  hovered: null,
  isDragging: false,
  didDrag: false,
  lastPointerMoveEvent: null,
  pointerDownPicks: null,
  pointerDownScreenCoords: null,
  pointerDownMapCoords: null
};

var ModeHandler =
/*#__PURE__*/
function (_PureComponent) {
  _inherits(ModeHandler, _PureComponent);

  function ModeHandler() {
    var _this;

    _classCallCheck(this, ModeHandler);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ModeHandler).call(this));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_events", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_eventsRegistered", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_modeHandler", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_context", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_containerRef", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "getFeatures", function () {
      var featureCollection = _this._getFeatureCollection();

      featureCollection = featureCollection && featureCollection.getObject();
      return featureCollection && featureCollection.features;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "addFeatures", function (features) {
      var featureCollection = _this._getFeatureCollection();

      if (featureCollection) {
        if (!Array.isArray(features)) {
          features = [features];
        }

        featureCollection = featureCollection.addFeatures(features);

        _this.setState({
          featureCollection: featureCollection
        });
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "deleteFeatures", function (featureIndexes) {
      var featureCollection = _this._getFeatureCollection();

      var selectedFeatureIndex = _this._getSelectedFeatureIndex();

      if (featureCollection) {
        if (!Array.isArray(featureIndexes)) {
          featureIndexes = [featureIndexes];
        }

        featureCollection = featureCollection.deleteFeatures(featureIndexes);
        var newState = {
          featureCollection: featureCollection
        };

        if (featureIndexes.findIndex(function (index) {
          return selectedFeatureIndex === index;
        }) >= 0) {
          newState.selectedFeatureIndex = null;
        }

        _this.setState(newState);
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_getMemorizedFeatureCollection", (0, _memoize.default)(function (_ref) {
      var propsFeatures = _ref.propsFeatures,
          stateFeatures = _ref.stateFeatures;
      var features = propsFeatures || stateFeatures; // Any changes in ImmutableFeatureCollection will create a new object

      if (features instanceof _keplerOutdatedNebula.ImmutableFeatureCollection) {
        return features;
      }

      if (features && features.type === 'FeatureCollection') {
        return new _keplerOutdatedNebula.ImmutableFeatureCollection({
          type: 'FeatureCollection',
          features: features.features
        });
      }

      return new _keplerOutdatedNebula.ImmutableFeatureCollection({
        type: 'FeatureCollection',
        features: features || []
      });
    }));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_getFeatureCollection", function () {
      return _this._getMemorizedFeatureCollection({
        propsFeatures: _this.props.features,
        stateFeatures: _this.state.featureCollection
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_setupModeHandler", function () {
      var mode = _this.props.mode;

      if (!mode || mode === _constants.MODES.READ_ONLY) {
        _this._degregisterEvents();

        _this._modeHandler = null;
        return;
      }

      _this._registerEvents();

      var HandlerClass = MODE_TO_HANDLER[mode];
      _this._modeHandler = HandlerClass ? new HandlerClass() : null;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_clearEditingState", function () {
      _this.setState({
        selectedFeatureIndex: null,
        hovered: null,
        pointerDownPicks: null,
        pointerDownScreenCoords: null,
        pointerDownMapCoords: null,
        isDragging: false,
        didDrag: false
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_getSelectedFeatureIndex", function () {
      return (0, _utils.isNumeric)(_this.props.selectedFeatureIndex) ? _this.props.selectedFeatureIndex : _this.state.selectedFeatureIndex;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_getSelectedFeature", function (featureIndex) {
      var features = _this.getFeatures();

      featureIndex = (0, _utils.isNumeric)(featureIndex) ? featureIndex : _this._getSelectedFeatureIndex();
      return features[featureIndex];
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_onSelect", function (selected) {
      _this.setState({
        selectedFeatureIndex: selected && selected.selectedFeatureIndex
      });

      if (_this.props.onSelect) {
        _this.props.onSelect(selected);
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_onUpdate", function (editAction, isInternal) {
      var editType = editAction.editType,
          updatedData = editAction.updatedData,
          editContext = editAction.editContext;

      _this.setState({
        featureCollection: new _keplerOutdatedNebula.ImmutableFeatureCollection(updatedData)
      });

      if (_this.props.onUpdate && !isInternal) {
        _this.props.onUpdate({
          data: updatedData && updatedData.features,
          editType: editType,
          editContext: editContext
        });
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_onEdit", function (editAction) {
      var mode = _this.props.mode;
      var editType = editAction.editType,
          updatedData = editAction.updatedData;

      switch (editType) {
        case _constants.EDIT_TYPE.MOVE_POSITION:
          // intermediate feature, do not need forward to application
          // only need update editor internal state
          _this._onUpdate(editAction, true);

          break;

        case _constants.EDIT_TYPE.ADD_FEATURE:
          _this._onUpdate(editAction);

          if (mode === _constants.MODES.DRAW_PATH) {
            var context = editAction.editContext && editAction.editContext[0] || {};
            var screenCoords = context.screenCoords,
                mapCoords = context.mapCoords;
            var featureIndex = updatedData.features.length - 1;

            var selectedFeature = _this._getSelectedFeature(featureIndex);

            _this._onSelect({
              selectedFeature: selectedFeature,
              selectedFeatureIndex: featureIndex,
              selectedEditHandleIndex: null,
              screenCoords: screenCoords,
              mapCoords: mapCoords
            });
          }

          break;

        case _constants.EDIT_TYPE.ADD_POSITION:
        case _constants.EDIT_TYPE.REMOVE_POSITION:
        case _constants.EDIT_TYPE.FINISH_MOVE_POSITION:
          _this._onUpdate(editAction);

          break;

        default:
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_degregisterEvents", function () {
      var eventManager = _this._context && _this._context.eventManager;

      if (!_this._events || !eventManager) {
        return;
      }

      if (_this._eventsRegistered) {
        eventManager.off(_this._events);
        _this._eventsRegistered = false;
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_registerEvents", function () {
      var ref = _this._containerRef;
      var eventManager = _this._context && _this._context.eventManager;

      if (!_this._events || !ref || !eventManager) {
        return;
      }

      if (_this._eventsRegistered) {
        return;
      }

      eventManager.on(_this._events, ref);
      _this._eventsRegistered = true;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_onEvent", function (handler, evt, stopPropagation) {
      var event = _this._getEvent(evt);

      handler(event);

      if (stopPropagation) {
        evt.stopImmediatePropagation();
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_onClick", function (event) {
      var mode = _this.props.mode;

      if (mode === _constants.MODES.SELECT || mode === _constants.MODES.EDITING) {
        var mapCoords = event.mapCoords,
            screenCoords = event.screenCoords;
        var pickedObject = event.picks && event.picks[0] && event.picks[0].object;

        if (pickedObject && (0, _utils.isNumeric)(pickedObject.featureIndex)) {
          var selectedFeatureIndex = pickedObject.featureIndex;

          var selectedFeature = _this._getSelectedFeature(selectedFeatureIndex);

          _this._onSelect({
            selectedFeature: selectedFeature,
            selectedFeatureIndex: selectedFeatureIndex,
            selectedEditHandleIndex: pickedObject.type === _constants.ELEMENT_TYPE.EDIT_HANDLE ? pickedObject.index : null,
            mapCoords: mapCoords,
            screenCoords: screenCoords
          });
        } else {
          _this._onSelect({
            selectedFeature: null,
            selectedFeatureIndex: null,
            selectedEditHandleIndex: null,
            mapCoords: mapCoords,
            screenCoords: screenCoords
          });
        }
      }

      var modeProps = _this.getModeProps();

      _this._modeHandler.handleClick(event, modeProps);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_onPointerMove", function (event) {
      // hovering
      var hovered = _this._getHoverState(event);

      var _this$state = _this.state,
          isDragging = _this$state.isDragging,
          didDrag = _this$state.didDrag,
          pointerDownPicks = _this$state.pointerDownPicks,
          pointerDownScreenCoords = _this$state.pointerDownScreenCoords,
          pointerDownMapCoords = _this$state.pointerDownMapCoords;

      if (isDragging && !didDrag && pointerDownScreenCoords) {
        var dx = event.screenCoords[0] - pointerDownScreenCoords[0];
        var dy = event.screenCoords[1] - pointerDownScreenCoords[1];

        if (dx * dx + dy * dy > 5) {
          _this.setState({
            didDrag: true
          });
        }
      }

      var pointerMoveEvent = _objectSpread({}, event, {
        isDragging: isDragging,
        pointerDownPicks: pointerDownPicks,
        pointerDownScreenCoords: pointerDownScreenCoords,
        pointerDownMapCoords: pointerDownMapCoords
      });

      if (_this.state.didDrag) {
        var modeProps = _this.getModeProps();

        _this._modeHandler.handlePointerMove(pointerMoveEvent, modeProps);
      }

      _this.setState({
        hovered: hovered,
        lastPointerMoveEvent: pointerMoveEvent
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_onPointerDown", function (event) {
      var pickedObject = event.picks && event.picks[0] && event.picks[0].object;

      var startDraggingEvent = _objectSpread({}, event, {
        pointerDownScreenCoords: event.screenCoords,
        pointerDownMapCoords: event.mapCoords
      });

      var newState = {
        isDragging: pickedObject && (0, _utils.isNumeric)(pickedObject.featureIndex),
        pointerDownPicks: event.picks,
        pointerDownScreenCoords: event.screenCoords,
        pointerDownMapCoords: event.mapCoords
      };

      _this.setState(newState);

      var modeProps = _this.getModeProps();

      _this._modeHandler.handleStartDragging(startDraggingEvent, modeProps);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_onPointerUp", function (event) {
      var stopDraggingEvent = _objectSpread({}, event, {
        pointerDownScreenCoords: _this.state.pointerDownScreenCoords,
        pointerDownMapCoords: _this.state.pointerDownMapCoords
      });

      var newState = {
        isDragging: false,
        didDrag: false,
        pointerDownPicks: null,
        pointerDownScreenCoords: null,
        pointerDownMapCoords: null
      };

      _this.setState(newState);

      var modeProps = _this.getModeProps();

      _this._modeHandler.handleStopDragging(stopDraggingEvent, modeProps);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_onPan", function (event) {
      var isDragging = _this.state.isDragging;

      if (isDragging) {
        event.sourceEvent.stopImmediatePropagation();
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "project", function (pt) {
      var viewport = _this._context && _this._context.viewport;
      return viewport && viewport.project(pt);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "unproject", function (pt) {
      var viewport = _this._context && _this._context.viewport;
      return viewport && viewport.unproject(pt);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_getHoverState", function (event) {
      var object = event.picks && event.picks[0] && event.picks[0].object;

      if (!object) {
        return null;
      }

      return _objectSpread({
        screenCoords: event.screenCoords,
        mapCoords: event.mapCoords
      }, object);
    });

    _this.state = defaultState;
    _this._eventsRegistered = false;
    _this._events = {
      anyclick: function anyclick(evt) {
        return _this._onEvent(_this._onClick, evt, true);
      },
      click: function click(evt) {
        return evt.stopImmediatePropagation();
      },
      pointermove: function pointermove(evt) {
        return _this._onEvent(_this._onPointerMove, evt, true);
      },
      pointerdown: function pointerdown(evt) {
        return _this._onEvent(_this._onPointerDown, evt, true);
      },
      pointerup: function pointerup(evt) {
        return _this._onEvent(_this._onPointerUp, evt, true);
      },
      panmove: function panmove(evt) {
        return _this._onEvent(_this._onPan, evt, false);
      },
      panstart: function panstart(evt) {
        return _this._onEvent(_this._onPan, evt, false);
      },
      panend: function panend(evt) {
        return _this._onEvent(_this._onPan, evt, false);
      }
    };
    return _this;
  }

  _createClass(ModeHandler, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (prevProps.mode !== this.props.mode) {
        this._clearEditingState();

        this._setupModeHandler();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this._degregisterEvents();
    }
  }, {
    key: "getModeProps",
    value: function getModeProps() {
      var featureCollection = this._getFeatureCollection();

      var lastPointerMoveEvent = this.state.lastPointerMoveEvent;

      var selectedFeatureIndex = this._getSelectedFeatureIndex();

      var viewport = this._context && this._context.viewport;
      return {
        data: featureCollection,
        selectedIndexes: [selectedFeatureIndex],
        lastPointerMoveEvent: lastPointerMoveEvent,
        viewport: viewport,
        onEdit: this._onEdit
      };
    }
    /* MEMORIZERS */

  }, {
    key: "_getEvent",
    value: function _getEvent(evt) {
      var picked = (0, _utils.parseEventElement)(evt);
      var screenCoords = (0, _utils.getScreenCoords)(evt);
      var mapCoords = this.unproject(screenCoords);
      return {
        picks: picked ? [picked] : null,
        screenCoords: screenCoords,
        mapCoords: mapCoords,
        sourceEvent: evt
      };
    }
  }, {
    key: "_isDrawing",
    value: function _isDrawing() {
      var mode = this.props.mode;
      return _constants.DRAWING_MODE.findIndex(function (m) {
        return m === mode;
      }) >= 0;
    }
  }, {
    key: "render",
    value: function render(child) {
      var _this2 = this;

      return _react.default.createElement(_reactMapGl._MapContext.Consumer, null, function (context) {
        _this2._context = context;
        var viewport = context && context.viewport;

        if (!viewport || viewport.height <= 0 || viewport.width <= 0) {
          return null;
        }

        return child;
      });
    }
  }]);

  return ModeHandler;
}(_react.PureComponent);

exports.default = ModeHandler;

_defineProperty(ModeHandler, "defaultProps", defaultProps);

ModeHandler.displayName = 'ModeHandler';
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tb2RlLWhhbmRsZXIuanMiXSwibmFtZXMiOlsiTU9ERV9UT19IQU5ETEVSIiwiT2JqZWN0IiwiZnJlZXplIiwiTU9ERVMiLCJSRUFEX09OTFkiLCJTRUxFQ1QiLCJTZWxlY3RNb2RlIiwiRURJVElORyIsIkVkaXRpbmdNb2RlIiwiRFJBV19QT0lOVCIsIkRyYXdQb2ludE1vZGUiLCJEUkFXX1BBVEgiLCJEcmF3TGluZVN0cmluZ01vZGUiLCJEUkFXX1JFQ1RBTkdMRSIsIkRyYXdSZWN0YW5nbGVNb2RlIiwiRFJBV19QT0xZR09OIiwiRHJhd1BvbHlnb25Nb2RlIiwiZGVmYXVsdFByb3BzIiwibW9kZSIsImZlYXR1cmVzIiwib25TZWxlY3QiLCJvblVwZGF0ZSIsImRlZmF1bHRTdGF0ZSIsImZlYXR1cmVDb2xsZWN0aW9uIiwiSW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24iLCJ0eXBlIiwic2VsZWN0ZWRGZWF0dXJlSW5kZXgiLCJob3ZlcmVkIiwiaXNEcmFnZ2luZyIsImRpZERyYWciLCJsYXN0UG9pbnRlck1vdmVFdmVudCIsInBvaW50ZXJEb3duUGlja3MiLCJwb2ludGVyRG93blNjcmVlbkNvb3JkcyIsInBvaW50ZXJEb3duTWFwQ29vcmRzIiwiTW9kZUhhbmRsZXIiLCJfZ2V0RmVhdHVyZUNvbGxlY3Rpb24iLCJnZXRPYmplY3QiLCJBcnJheSIsImlzQXJyYXkiLCJhZGRGZWF0dXJlcyIsInNldFN0YXRlIiwiZmVhdHVyZUluZGV4ZXMiLCJfZ2V0U2VsZWN0ZWRGZWF0dXJlSW5kZXgiLCJkZWxldGVGZWF0dXJlcyIsIm5ld1N0YXRlIiwiZmluZEluZGV4IiwiaW5kZXgiLCJwcm9wc0ZlYXR1cmVzIiwic3RhdGVGZWF0dXJlcyIsIl9nZXRNZW1vcml6ZWRGZWF0dXJlQ29sbGVjdGlvbiIsInByb3BzIiwic3RhdGUiLCJfZGVncmVnaXN0ZXJFdmVudHMiLCJfbW9kZUhhbmRsZXIiLCJfcmVnaXN0ZXJFdmVudHMiLCJIYW5kbGVyQ2xhc3MiLCJmZWF0dXJlSW5kZXgiLCJnZXRGZWF0dXJlcyIsInNlbGVjdGVkIiwiZWRpdEFjdGlvbiIsImlzSW50ZXJuYWwiLCJlZGl0VHlwZSIsInVwZGF0ZWREYXRhIiwiZWRpdENvbnRleHQiLCJkYXRhIiwiRURJVF9UWVBFIiwiTU9WRV9QT1NJVElPTiIsIl9vblVwZGF0ZSIsIkFERF9GRUFUVVJFIiwiY29udGV4dCIsInNjcmVlbkNvb3JkcyIsIm1hcENvb3JkcyIsImxlbmd0aCIsInNlbGVjdGVkRmVhdHVyZSIsIl9nZXRTZWxlY3RlZEZlYXR1cmUiLCJfb25TZWxlY3QiLCJzZWxlY3RlZEVkaXRIYW5kbGVJbmRleCIsIkFERF9QT1NJVElPTiIsIlJFTU9WRV9QT1NJVElPTiIsIkZJTklTSF9NT1ZFX1BPU0lUSU9OIiwiZXZlbnRNYW5hZ2VyIiwiX2NvbnRleHQiLCJfZXZlbnRzIiwiX2V2ZW50c1JlZ2lzdGVyZWQiLCJvZmYiLCJyZWYiLCJfY29udGFpbmVyUmVmIiwib24iLCJoYW5kbGVyIiwiZXZ0Iiwic3RvcFByb3BhZ2F0aW9uIiwiZXZlbnQiLCJfZ2V0RXZlbnQiLCJzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24iLCJwaWNrZWRPYmplY3QiLCJwaWNrcyIsIm9iamVjdCIsIkVMRU1FTlRfVFlQRSIsIkVESVRfSEFORExFIiwibW9kZVByb3BzIiwiZ2V0TW9kZVByb3BzIiwiaGFuZGxlQ2xpY2siLCJfZ2V0SG92ZXJTdGF0ZSIsImR4IiwiZHkiLCJwb2ludGVyTW92ZUV2ZW50IiwiaGFuZGxlUG9pbnRlck1vdmUiLCJzdGFydERyYWdnaW5nRXZlbnQiLCJoYW5kbGVTdGFydERyYWdnaW5nIiwic3RvcERyYWdnaW5nRXZlbnQiLCJoYW5kbGVTdG9wRHJhZ2dpbmciLCJzb3VyY2VFdmVudCIsInB0Iiwidmlld3BvcnQiLCJwcm9qZWN0IiwidW5wcm9qZWN0IiwiYW55Y2xpY2siLCJfb25FdmVudCIsIl9vbkNsaWNrIiwiY2xpY2siLCJwb2ludGVybW92ZSIsIl9vblBvaW50ZXJNb3ZlIiwicG9pbnRlcmRvd24iLCJfb25Qb2ludGVyRG93biIsInBvaW50ZXJ1cCIsIl9vblBvaW50ZXJVcCIsInBhbm1vdmUiLCJfb25QYW4iLCJwYW5zdGFydCIsInBhbmVuZCIsInByZXZQcm9wcyIsIl9jbGVhckVkaXRpbmdTdGF0ZSIsIl9zZXR1cE1vZGVIYW5kbGVyIiwic2VsZWN0ZWRJbmRleGVzIiwib25FZGl0IiwiX29uRWRpdCIsInBpY2tlZCIsIkRSQVdJTkdfTU9ERSIsIm0iLCJjaGlsZCIsImhlaWdodCIsIndpZHRoIiwiUHVyZUNvbXBvbmVudCIsImRpc3BsYXlOYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBS0E7O0FBRUE7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVNBLElBQU1BLGVBQWUsR0FBR0MsTUFBTSxDQUFDQyxNQUFQLHVEQUNyQkMsaUJBQU1DLFNBRGUsRUFDSCxJQURHLG1DQUVyQkQsaUJBQU1FLE1BRmUsRUFFTkMscUJBRk0sbUNBR3JCSCxpQkFBTUksT0FIZSxFQUdMQyxzQkFISyxtQ0FJckJMLGlCQUFNTSxVQUplLEVBSUZDLHdCQUpFLG1DQUtyQlAsaUJBQU1RLFNBTGUsRUFLSEMsNkJBTEcsbUNBTXJCVCxpQkFBTVUsY0FOZSxFQU1FQyw0QkFORixtQ0FPckJYLGlCQUFNWSxZQVBlLEVBT0FDLDBCQVBBLG1CQUF4QjtBQVVBLElBQU1DLFlBQVksR0FBRztBQUNuQkMsRUFBQUEsSUFBSSxFQUFFZixpQkFBTUMsU0FETztBQUVuQmUsRUFBQUEsUUFBUSxFQUFFLElBRlM7QUFHbkJDLEVBQUFBLFFBQVEsRUFBRSxJQUhTO0FBSW5CQyxFQUFBQSxRQUFRLEVBQUU7QUFKUyxDQUFyQjtBQU9BLElBQU1DLFlBQVksR0FBRztBQUNuQkMsRUFBQUEsaUJBQWlCLEVBQUUsSUFBSUMsZ0RBQUosQ0FBK0I7QUFDaERDLElBQUFBLElBQUksRUFBRSxtQkFEMEM7QUFFaEROLElBQUFBLFFBQVEsRUFBRTtBQUZzQyxHQUEvQixDQURBO0FBTW5CTyxFQUFBQSxvQkFBb0IsRUFBRSxJQU5IO0FBUW5CO0FBQ0FDLEVBQUFBLE9BQU8sRUFBRSxJQVRVO0FBV25CQyxFQUFBQSxVQUFVLEVBQUUsS0FYTztBQVluQkMsRUFBQUEsT0FBTyxFQUFFLEtBWlU7QUFjbkJDLEVBQUFBLG9CQUFvQixFQUFFLElBZEg7QUFnQm5CQyxFQUFBQSxnQkFBZ0IsRUFBRSxJQWhCQztBQWlCbkJDLEVBQUFBLHVCQUF1QixFQUFFLElBakJOO0FBa0JuQkMsRUFBQUEsb0JBQW9CLEVBQUU7QUFsQkgsQ0FBckI7O0lBcUJxQkMsVzs7Ozs7QUFHbkIseUJBQWM7QUFBQTs7QUFBQTs7QUFDWjs7QUFEWTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQSwwRkFrQ0EsWUFBTTtBQUNsQixVQUFJWCxpQkFBaUIsR0FBRyxNQUFLWSxxQkFBTCxFQUF4Qjs7QUFDQVosTUFBQUEsaUJBQWlCLEdBQUdBLGlCQUFpQixJQUFJQSxpQkFBaUIsQ0FBQ2EsU0FBbEIsRUFBekM7QUFDQSxhQUFPYixpQkFBaUIsSUFBSUEsaUJBQWlCLENBQUNKLFFBQTlDO0FBQ0QsS0F0Q2E7O0FBQUEsMEZBd0NBLFVBQUNBLFFBQUQsRUFBbUM7QUFDL0MsVUFBSUksaUJBQWlCLEdBQUcsTUFBS1kscUJBQUwsRUFBeEI7O0FBQ0EsVUFBSVosaUJBQUosRUFBdUI7QUFDckIsWUFBSSxDQUFDYyxLQUFLLENBQUNDLE9BQU4sQ0FBY25CLFFBQWQsQ0FBTCxFQUE4QjtBQUM1QkEsVUFBQUEsUUFBUSxHQUFHLENBQUNBLFFBQUQsQ0FBWDtBQUNEOztBQUVESSxRQUFBQSxpQkFBaUIsR0FBR0EsaUJBQWlCLENBQUNnQixXQUFsQixDQUE4QnBCLFFBQTlCLENBQXBCOztBQUNBLGNBQUtxQixRQUFMLENBQWM7QUFBRWpCLFVBQUFBLGlCQUFpQixFQUFqQkE7QUFBRixTQUFkO0FBQ0Q7QUFDRixLQWxEYTs7QUFBQSw2RkFvREcsVUFBQ2tCLGNBQUQsRUFBdUM7QUFDdEQsVUFBSWxCLGlCQUFpQixHQUFHLE1BQUtZLHFCQUFMLEVBQXhCOztBQUNBLFVBQU1ULG9CQUFvQixHQUFHLE1BQUtnQix3QkFBTCxFQUE3Qjs7QUFDQSxVQUFJbkIsaUJBQUosRUFBdUI7QUFDckIsWUFBSSxDQUFDYyxLQUFLLENBQUNDLE9BQU4sQ0FBY0csY0FBZCxDQUFMLEVBQW9DO0FBQ2xDQSxVQUFBQSxjQUFjLEdBQUcsQ0FBQ0EsY0FBRCxDQUFqQjtBQUNEOztBQUNEbEIsUUFBQUEsaUJBQWlCLEdBQUdBLGlCQUFpQixDQUFDb0IsY0FBbEIsQ0FBaUNGLGNBQWpDLENBQXBCO0FBQ0EsWUFBTUcsUUFBYSxHQUFHO0FBQUVyQixVQUFBQSxpQkFBaUIsRUFBakJBO0FBQUYsU0FBdEI7O0FBQ0EsWUFBSWtCLGNBQWMsQ0FBQ0ksU0FBZixDQUF5QixVQUFBQyxLQUFLO0FBQUEsaUJBQUlwQixvQkFBb0IsS0FBS29CLEtBQTdCO0FBQUEsU0FBOUIsS0FBcUUsQ0FBekUsRUFBNEU7QUFDMUVGLFVBQUFBLFFBQVEsQ0FBQ2xCLG9CQUFULEdBQWdDLElBQWhDO0FBQ0Q7O0FBQ0QsY0FBS2MsUUFBTCxDQUFjSSxRQUFkO0FBQ0Q7QUFDRixLQWxFYTs7QUFBQSw2R0FxRm1CLHNCQUFRLGdCQUEyQztBQUFBLFVBQXhDRyxhQUF3QyxRQUF4Q0EsYUFBd0M7QUFBQSxVQUF6QkMsYUFBeUIsUUFBekJBLGFBQXlCO0FBQ2xGLFVBQU03QixRQUFRLEdBQUc0QixhQUFhLElBQUlDLGFBQWxDLENBRGtGLENBRWxGOztBQUNBLFVBQUk3QixRQUFRLFlBQVlLLGdEQUF4QixFQUFvRDtBQUNsRCxlQUFPTCxRQUFQO0FBQ0Q7O0FBRUQsVUFBSUEsUUFBUSxJQUFJQSxRQUFRLENBQUNNLElBQVQsS0FBa0IsbUJBQWxDLEVBQXVEO0FBQ3JELGVBQU8sSUFBSUQsZ0RBQUosQ0FBK0I7QUFDcENDLFVBQUFBLElBQUksRUFBRSxtQkFEOEI7QUFFcENOLFVBQUFBLFFBQVEsRUFBRUEsUUFBUSxDQUFDQTtBQUZpQixTQUEvQixDQUFQO0FBSUQ7O0FBRUQsYUFBTyxJQUFJSyxnREFBSixDQUErQjtBQUNwQ0MsUUFBQUEsSUFBSSxFQUFFLG1CQUQ4QjtBQUVwQ04sUUFBQUEsUUFBUSxFQUFFQSxRQUFRLElBQUk7QUFGYyxPQUEvQixDQUFQO0FBSUQsS0FsQmdDLENBckZuQjs7QUFBQSxvR0F5R1UsWUFBTTtBQUM1QixhQUFPLE1BQUs4Qiw4QkFBTCxDQUFvQztBQUN6Q0YsUUFBQUEsYUFBYSxFQUFFLE1BQUtHLEtBQUwsQ0FBVy9CLFFBRGU7QUFFekM2QixRQUFBQSxhQUFhLEVBQUUsTUFBS0csS0FBTCxDQUFXNUI7QUFGZSxPQUFwQyxDQUFQO0FBSUQsS0E5R2E7O0FBQUEsZ0dBZ0hNLFlBQU07QUFDeEIsVUFBTUwsSUFBSSxHQUFHLE1BQUtnQyxLQUFMLENBQVdoQyxJQUF4Qjs7QUFFQSxVQUFJLENBQUNBLElBQUQsSUFBU0EsSUFBSSxLQUFLZixpQkFBTUMsU0FBNUIsRUFBdUM7QUFDckMsY0FBS2dELGtCQUFMOztBQUNBLGNBQUtDLFlBQUwsR0FBb0IsSUFBcEI7QUFDQTtBQUNEOztBQUVELFlBQUtDLGVBQUw7O0FBRUEsVUFBTUMsWUFBWSxHQUFHdkQsZUFBZSxDQUFDa0IsSUFBRCxDQUFwQztBQUNBLFlBQUttQyxZQUFMLEdBQW9CRSxZQUFZLEdBQUcsSUFBSUEsWUFBSixFQUFILEdBQXdCLElBQXhEO0FBQ0QsS0E3SGE7O0FBQUEsaUdBZ0lPLFlBQU07QUFDekIsWUFBS2YsUUFBTCxDQUFjO0FBQ1pkLFFBQUFBLG9CQUFvQixFQUFFLElBRFY7QUFHWkMsUUFBQUEsT0FBTyxFQUFFLElBSEc7QUFLWkksUUFBQUEsZ0JBQWdCLEVBQUUsSUFMTjtBQU1aQyxRQUFBQSx1QkFBdUIsRUFBRSxJQU5iO0FBT1pDLFFBQUFBLG9CQUFvQixFQUFFLElBUFY7QUFTWkwsUUFBQUEsVUFBVSxFQUFFLEtBVEE7QUFVWkMsUUFBQUEsT0FBTyxFQUFFO0FBVkcsT0FBZDtBQVlELEtBN0lhOztBQUFBLHVHQStJYSxZQUFNO0FBQy9CLGFBQU8sc0JBQVUsTUFBS3FCLEtBQUwsQ0FBV3hCLG9CQUFyQixJQUNILE1BQUt3QixLQUFMLENBQVd4QixvQkFEUixHQUVILE1BQUt5QixLQUFMLENBQVd6QixvQkFGZjtBQUdELEtBbkphOztBQUFBLGtHQXFKUSxVQUFDOEIsWUFBRCxFQUEyQjtBQUMvQyxVQUFNckMsUUFBUSxHQUFHLE1BQUtzQyxXQUFMLEVBQWpCOztBQUNBRCxNQUFBQSxZQUFZLEdBQUcsc0JBQVVBLFlBQVYsSUFBMEJBLFlBQTFCLEdBQXlDLE1BQUtkLHdCQUFMLEVBQXhEO0FBQ0EsYUFBT3ZCLFFBQVEsQ0FBQ3FDLFlBQUQsQ0FBZjtBQUNELEtBekphOztBQUFBLHdGQTJKRixVQUFDRSxRQUFELEVBQTRCO0FBQ3RDLFlBQUtsQixRQUFMLENBQWM7QUFBRWQsUUFBQUEsb0JBQW9CLEVBQUVnQyxRQUFRLElBQUlBLFFBQVEsQ0FBQ2hDO0FBQTdDLE9BQWQ7O0FBQ0EsVUFBSSxNQUFLd0IsS0FBTCxDQUFXOUIsUUFBZixFQUF5QjtBQUN2QixjQUFLOEIsS0FBTCxDQUFXOUIsUUFBWCxDQUFvQnNDLFFBQXBCO0FBQ0Q7QUFDRixLQWhLYTs7QUFBQSx3RkFrS0YsVUFBQ0MsVUFBRCxFQUF5QkMsVUFBekIsRUFBa0Q7QUFBQSxVQUNwREMsUUFEb0QsR0FDYkYsVUFEYSxDQUNwREUsUUFEb0Q7QUFBQSxVQUMxQ0MsV0FEMEMsR0FDYkgsVUFEYSxDQUMxQ0csV0FEMEM7QUFBQSxVQUM3QkMsV0FENkIsR0FDYkosVUFEYSxDQUM3QkksV0FENkI7O0FBRTVELFlBQUt2QixRQUFMLENBQWM7QUFBRWpCLFFBQUFBLGlCQUFpQixFQUFFLElBQUlDLGdEQUFKLENBQStCc0MsV0FBL0I7QUFBckIsT0FBZDs7QUFDQSxVQUFJLE1BQUtaLEtBQUwsQ0FBVzdCLFFBQVgsSUFBdUIsQ0FBQ3VDLFVBQTVCLEVBQXdDO0FBQ3RDLGNBQUtWLEtBQUwsQ0FBVzdCLFFBQVgsQ0FBb0I7QUFDbEIyQyxVQUFBQSxJQUFJLEVBQUVGLFdBQVcsSUFBSUEsV0FBVyxDQUFDM0MsUUFEZjtBQUVsQjBDLFVBQUFBLFFBQVEsRUFBUkEsUUFGa0I7QUFHbEJFLFVBQUFBLFdBQVcsRUFBWEE7QUFIa0IsU0FBcEI7QUFLRDtBQUNGLEtBNUthOztBQUFBLHNGQThLSixVQUFDSixVQUFELEVBQTRCO0FBQUEsVUFDNUJ6QyxJQUQ0QixHQUNuQixNQUFLZ0MsS0FEYyxDQUM1QmhDLElBRDRCO0FBQUEsVUFFNUIyQyxRQUY0QixHQUVGRixVQUZFLENBRTVCRSxRQUY0QjtBQUFBLFVBRWxCQyxXQUZrQixHQUVGSCxVQUZFLENBRWxCRyxXQUZrQjs7QUFJcEMsY0FBUUQsUUFBUjtBQUNFLGFBQUtJLHFCQUFVQyxhQUFmO0FBQ0U7QUFDQTtBQUNBLGdCQUFLQyxTQUFMLENBQWVSLFVBQWYsRUFBMkIsSUFBM0I7O0FBQ0E7O0FBQ0YsYUFBS00scUJBQVVHLFdBQWY7QUFDRSxnQkFBS0QsU0FBTCxDQUFlUixVQUFmOztBQUNBLGNBQUl6QyxJQUFJLEtBQUtmLGlCQUFNUSxTQUFuQixFQUE4QjtBQUM1QixnQkFBTTBELE9BQU8sR0FBSVYsVUFBVSxDQUFDSSxXQUFYLElBQTBCSixVQUFVLENBQUNJLFdBQVgsQ0FBdUIsQ0FBdkIsQ0FBM0IsSUFBeUQsRUFBekU7QUFENEIsZ0JBRXBCTyxZQUZvQixHQUVRRCxPQUZSLENBRXBCQyxZQUZvQjtBQUFBLGdCQUVOQyxTQUZNLEdBRVFGLE9BRlIsQ0FFTkUsU0FGTTtBQUc1QixnQkFBTWYsWUFBWSxHQUFHTSxXQUFXLENBQUMzQyxRQUFaLENBQXFCcUQsTUFBckIsR0FBOEIsQ0FBbkQ7O0FBQ0EsZ0JBQU1DLGVBQWUsR0FBRyxNQUFLQyxtQkFBTCxDQUF5QmxCLFlBQXpCLENBQXhCOztBQUNBLGtCQUFLbUIsU0FBTCxDQUFlO0FBQ2JGLGNBQUFBLGVBQWUsRUFBZkEsZUFEYTtBQUViL0MsY0FBQUEsb0JBQW9CLEVBQUU4QixZQUZUO0FBR2JvQixjQUFBQSx1QkFBdUIsRUFBRSxJQUhaO0FBSWJOLGNBQUFBLFlBQVksRUFBWkEsWUFKYTtBQUtiQyxjQUFBQSxTQUFTLEVBQVRBO0FBTGEsYUFBZjtBQU9EOztBQUNEOztBQUNGLGFBQUtOLHFCQUFVWSxZQUFmO0FBQ0EsYUFBS1oscUJBQVVhLGVBQWY7QUFDQSxhQUFLYixxQkFBVWMsb0JBQWY7QUFDRSxnQkFBS1osU0FBTCxDQUFlUixVQUFmOztBQUNBOztBQUVGO0FBNUJGO0FBOEJELEtBaE5hOztBQUFBLGlHQW1OTyxZQUFNO0FBQ3pCLFVBQU1xQixZQUFZLEdBQUcsTUFBS0MsUUFBTCxJQUFpQixNQUFLQSxRQUFMLENBQWNELFlBQXBEOztBQUNBLFVBQUksQ0FBQyxNQUFLRSxPQUFOLElBQWlCLENBQUNGLFlBQXRCLEVBQW9DO0FBQ2xDO0FBQ0Q7O0FBRUQsVUFBSSxNQUFLRyxpQkFBVCxFQUE0QjtBQUMxQkgsUUFBQUEsWUFBWSxDQUFDSSxHQUFiLENBQWlCLE1BQUtGLE9BQXRCO0FBQ0EsY0FBS0MsaUJBQUwsR0FBeUIsS0FBekI7QUFDRDtBQUNGLEtBN05hOztBQUFBLDhGQStOSSxZQUFNO0FBQ3RCLFVBQU1FLEdBQUcsR0FBRyxNQUFLQyxhQUFqQjtBQUNBLFVBQU1OLFlBQVksR0FBRyxNQUFLQyxRQUFMLElBQWlCLE1BQUtBLFFBQUwsQ0FBY0QsWUFBcEQ7O0FBQ0EsVUFBSSxDQUFDLE1BQUtFLE9BQU4sSUFBaUIsQ0FBQ0csR0FBbEIsSUFBeUIsQ0FBQ0wsWUFBOUIsRUFBNEM7QUFDMUM7QUFDRDs7QUFFRCxVQUFJLE1BQUtHLGlCQUFULEVBQTRCO0FBQzFCO0FBQ0Q7O0FBRURILE1BQUFBLFlBQVksQ0FBQ08sRUFBYixDQUFnQixNQUFLTCxPQUFyQixFQUE4QkcsR0FBOUI7QUFDQSxZQUFLRixpQkFBTCxHQUF5QixJQUF6QjtBQUNELEtBNU9hOztBQUFBLHVGQThPSCxVQUFDSyxPQUFELEVBQW9CQyxHQUFwQixFQUF1Q0MsZUFBdkMsRUFBb0U7QUFDN0UsVUFBTUMsS0FBSyxHQUFHLE1BQUtDLFNBQUwsQ0FBZUgsR0FBZixDQUFkOztBQUNBRCxNQUFBQSxPQUFPLENBQUNHLEtBQUQsQ0FBUDs7QUFFQSxVQUFJRCxlQUFKLEVBQXFCO0FBQ25CRCxRQUFBQSxHQUFHLENBQUNJLHdCQUFKO0FBQ0Q7QUFDRixLQXJQYTs7QUFBQSx1RkF1UEgsVUFBQ0YsS0FBRCxFQUFzQjtBQUFBLFVBQ3ZCekUsSUFEdUIsR0FDZCxNQUFLZ0MsS0FEUyxDQUN2QmhDLElBRHVCOztBQUUvQixVQUFJQSxJQUFJLEtBQUtmLGlCQUFNRSxNQUFmLElBQXlCYSxJQUFJLEtBQUtmLGlCQUFNSSxPQUE1QyxFQUFxRDtBQUFBLFlBQzNDZ0UsU0FEMkMsR0FDZm9CLEtBRGUsQ0FDM0NwQixTQUQyQztBQUFBLFlBQ2hDRCxZQURnQyxHQUNmcUIsS0FEZSxDQUNoQ3JCLFlBRGdDO0FBRW5ELFlBQU13QixZQUFZLEdBQUdILEtBQUssQ0FBQ0ksS0FBTixJQUFlSixLQUFLLENBQUNJLEtBQU4sQ0FBWSxDQUFaLENBQWYsSUFBaUNKLEtBQUssQ0FBQ0ksS0FBTixDQUFZLENBQVosRUFBZUMsTUFBckU7O0FBQ0EsWUFBSUYsWUFBWSxJQUFJLHNCQUFVQSxZQUFZLENBQUN0QyxZQUF2QixDQUFwQixFQUEwRDtBQUN4RCxjQUFNOUIsb0JBQW9CLEdBQUdvRSxZQUFZLENBQUN0QyxZQUExQzs7QUFDQSxjQUFNaUIsZUFBZSxHQUFHLE1BQUtDLG1CQUFMLENBQXlCaEQsb0JBQXpCLENBQXhCOztBQUNBLGdCQUFLaUQsU0FBTCxDQUFlO0FBQ2JGLFlBQUFBLGVBQWUsRUFBZkEsZUFEYTtBQUViL0MsWUFBQUEsb0JBQW9CLEVBQXBCQSxvQkFGYTtBQUdia0QsWUFBQUEsdUJBQXVCLEVBQ3JCa0IsWUFBWSxDQUFDckUsSUFBYixLQUFzQndFLHdCQUFhQyxXQUFuQyxHQUFpREosWUFBWSxDQUFDaEQsS0FBOUQsR0FBc0UsSUFKM0Q7QUFLYnlCLFlBQUFBLFNBQVMsRUFBVEEsU0FMYTtBQU1iRCxZQUFBQSxZQUFZLEVBQVpBO0FBTmEsV0FBZjtBQVFELFNBWEQsTUFXTztBQUNMLGdCQUFLSyxTQUFMLENBQWU7QUFDYkYsWUFBQUEsZUFBZSxFQUFFLElBREo7QUFFYi9DLFlBQUFBLG9CQUFvQixFQUFFLElBRlQ7QUFHYmtELFlBQUFBLHVCQUF1QixFQUFFLElBSFo7QUFJYkwsWUFBQUEsU0FBUyxFQUFUQSxTQUphO0FBS2JELFlBQUFBLFlBQVksRUFBWkE7QUFMYSxXQUFmO0FBT0Q7QUFDRjs7QUFFRCxVQUFNNkIsU0FBUyxHQUFHLE1BQUtDLFlBQUwsRUFBbEI7O0FBQ0EsWUFBSy9DLFlBQUwsQ0FBa0JnRCxXQUFsQixDQUE4QlYsS0FBOUIsRUFBcUNRLFNBQXJDO0FBQ0QsS0FwUmE7O0FBQUEsNkZBc1JHLFVBQUNSLEtBQUQsRUFBc0I7QUFDckM7QUFDQSxVQUFNaEUsT0FBTyxHQUFHLE1BQUsyRSxjQUFMLENBQW9CWCxLQUFwQixDQUFoQjs7QUFGcUMsd0JBU2pDLE1BQUt4QyxLQVQ0QjtBQUFBLFVBSW5DdkIsVUFKbUMsZUFJbkNBLFVBSm1DO0FBQUEsVUFLbkNDLE9BTG1DLGVBS25DQSxPQUxtQztBQUFBLFVBTW5DRSxnQkFObUMsZUFNbkNBLGdCQU5tQztBQUFBLFVBT25DQyx1QkFQbUMsZUFPbkNBLHVCQVBtQztBQUFBLFVBUW5DQyxvQkFSbUMsZUFRbkNBLG9CQVJtQzs7QUFXckMsVUFBSUwsVUFBVSxJQUFJLENBQUNDLE9BQWYsSUFBMEJHLHVCQUE5QixFQUF1RDtBQUNyRCxZQUFNdUUsRUFBRSxHQUFHWixLQUFLLENBQUNyQixZQUFOLENBQW1CLENBQW5CLElBQXdCdEMsdUJBQXVCLENBQUMsQ0FBRCxDQUExRDtBQUNBLFlBQU13RSxFQUFFLEdBQUdiLEtBQUssQ0FBQ3JCLFlBQU4sQ0FBbUIsQ0FBbkIsSUFBd0J0Qyx1QkFBdUIsQ0FBQyxDQUFELENBQTFEOztBQUNBLFlBQUl1RSxFQUFFLEdBQUdBLEVBQUwsR0FBVUMsRUFBRSxHQUFHQSxFQUFmLEdBQW9CLENBQXhCLEVBQTJCO0FBQ3pCLGdCQUFLaEUsUUFBTCxDQUFjO0FBQUVYLFlBQUFBLE9BQU8sRUFBRTtBQUFYLFdBQWQ7QUFDRDtBQUNGOztBQUVELFVBQU00RSxnQkFBZ0IscUJBQ2pCZCxLQURpQjtBQUVwQi9ELFFBQUFBLFVBQVUsRUFBVkEsVUFGb0I7QUFHcEJHLFFBQUFBLGdCQUFnQixFQUFoQkEsZ0JBSG9CO0FBSXBCQyxRQUFBQSx1QkFBdUIsRUFBdkJBLHVCQUpvQjtBQUtwQkMsUUFBQUEsb0JBQW9CLEVBQXBCQTtBQUxvQixRQUF0Qjs7QUFRQSxVQUFJLE1BQUtrQixLQUFMLENBQVd0QixPQUFmLEVBQXdCO0FBQ3RCLFlBQU1zRSxTQUFTLEdBQUcsTUFBS0MsWUFBTCxFQUFsQjs7QUFDQSxjQUFLL0MsWUFBTCxDQUFrQnFELGlCQUFsQixDQUFvQ0QsZ0JBQXBDLEVBQXNETixTQUF0RDtBQUNEOztBQUVELFlBQUszRCxRQUFMLENBQWM7QUFDWmIsUUFBQUEsT0FBTyxFQUFQQSxPQURZO0FBRVpHLFFBQUFBLG9CQUFvQixFQUFFMkU7QUFGVixPQUFkO0FBSUQsS0ExVGE7O0FBQUEsNkZBNFRHLFVBQUNkLEtBQUQsRUFBc0I7QUFDckMsVUFBTUcsWUFBWSxHQUFHSCxLQUFLLENBQUNJLEtBQU4sSUFBZUosS0FBSyxDQUFDSSxLQUFOLENBQVksQ0FBWixDQUFmLElBQWlDSixLQUFLLENBQUNJLEtBQU4sQ0FBWSxDQUFaLEVBQWVDLE1BQXJFOztBQUNBLFVBQU1XLGtCQUFrQixxQkFDbkJoQixLQURtQjtBQUV0QjNELFFBQUFBLHVCQUF1QixFQUFFMkQsS0FBSyxDQUFDckIsWUFGVDtBQUd0QnJDLFFBQUFBLG9CQUFvQixFQUFFMEQsS0FBSyxDQUFDcEI7QUFITixRQUF4Qjs7QUFNQSxVQUFNM0IsUUFBUSxHQUFHO0FBQ2ZoQixRQUFBQSxVQUFVLEVBQUVrRSxZQUFZLElBQUksc0JBQVVBLFlBQVksQ0FBQ3RDLFlBQXZCLENBRGI7QUFFZnpCLFFBQUFBLGdCQUFnQixFQUFFNEQsS0FBSyxDQUFDSSxLQUZUO0FBR2YvRCxRQUFBQSx1QkFBdUIsRUFBRTJELEtBQUssQ0FBQ3JCLFlBSGhCO0FBSWZyQyxRQUFBQSxvQkFBb0IsRUFBRTBELEtBQUssQ0FBQ3BCO0FBSmIsT0FBakI7O0FBT0EsWUFBSy9CLFFBQUwsQ0FBY0ksUUFBZDs7QUFFQSxVQUFNdUQsU0FBUyxHQUFHLE1BQUtDLFlBQUwsRUFBbEI7O0FBQ0EsWUFBSy9DLFlBQUwsQ0FBa0J1RCxtQkFBbEIsQ0FBc0NELGtCQUF0QyxFQUEwRFIsU0FBMUQ7QUFDRCxLQS9VYTs7QUFBQSwyRkFpVkMsVUFBQ1IsS0FBRCxFQUF5QjtBQUN0QyxVQUFNa0IsaUJBQWlCLHFCQUNsQmxCLEtBRGtCO0FBRXJCM0QsUUFBQUEsdUJBQXVCLEVBQUUsTUFBS21CLEtBQUwsQ0FBV25CLHVCQUZmO0FBR3JCQyxRQUFBQSxvQkFBb0IsRUFBRSxNQUFLa0IsS0FBTCxDQUFXbEI7QUFIWixRQUF2Qjs7QUFNQSxVQUFNVyxRQUFRLEdBQUc7QUFDZmhCLFFBQUFBLFVBQVUsRUFBRSxLQURHO0FBRWZDLFFBQUFBLE9BQU8sRUFBRSxLQUZNO0FBR2ZFLFFBQUFBLGdCQUFnQixFQUFFLElBSEg7QUFJZkMsUUFBQUEsdUJBQXVCLEVBQUUsSUFKVjtBQUtmQyxRQUFBQSxvQkFBb0IsRUFBRTtBQUxQLE9BQWpCOztBQVFBLFlBQUtPLFFBQUwsQ0FBY0ksUUFBZDs7QUFFQSxVQUFNdUQsU0FBUyxHQUFHLE1BQUtDLFlBQUwsRUFBbEI7O0FBQ0EsWUFBSy9DLFlBQUwsQ0FBa0J5RCxrQkFBbEIsQ0FBcUNELGlCQUFyQyxFQUF3RFYsU0FBeEQ7QUFDRCxLQXBXYTs7QUFBQSxxRkFzV0wsVUFBQ1IsS0FBRCxFQUFzQjtBQUFBLFVBQ3JCL0QsVUFEcUIsR0FDTixNQUFLdUIsS0FEQyxDQUNyQnZCLFVBRHFCOztBQUU3QixVQUFJQSxVQUFKLEVBQWdCO0FBQ2QrRCxRQUFBQSxLQUFLLENBQUNvQixXQUFOLENBQWtCbEIsd0JBQWxCO0FBQ0Q7QUFDRixLQTNXYTs7QUFBQSxzRkE4V0osVUFBQ21CLEVBQUQsRUFBa0I7QUFDMUIsVUFBTUMsUUFBUSxHQUFHLE1BQUtoQyxRQUFMLElBQWlCLE1BQUtBLFFBQUwsQ0FBY2dDLFFBQWhEO0FBQ0EsYUFBT0EsUUFBUSxJQUFJQSxRQUFRLENBQUNDLE9BQVQsQ0FBaUJGLEVBQWpCLENBQW5CO0FBQ0QsS0FqWGE7O0FBQUEsd0ZBbVhGLFVBQUNBLEVBQUQsRUFBa0I7QUFDNUIsVUFBTUMsUUFBUSxHQUFHLE1BQUtoQyxRQUFMLElBQWlCLE1BQUtBLFFBQUwsQ0FBY2dDLFFBQWhEO0FBQ0EsYUFBT0EsUUFBUSxJQUFJQSxRQUFRLENBQUNFLFNBQVQsQ0FBbUJILEVBQW5CLENBQW5CO0FBQ0QsS0F0WGE7O0FBQUEsNkZBcVlHLFVBQUNyQixLQUFELEVBQXNCO0FBQ3JDLFVBQU1LLE1BQU0sR0FBR0wsS0FBSyxDQUFDSSxLQUFOLElBQWVKLEtBQUssQ0FBQ0ksS0FBTixDQUFZLENBQVosQ0FBZixJQUFpQ0osS0FBSyxDQUFDSSxLQUFOLENBQVksQ0FBWixFQUFlQyxNQUEvRDs7QUFDQSxVQUFJLENBQUNBLE1BQUwsRUFBYTtBQUNYLGVBQU8sSUFBUDtBQUNEOztBQUVEO0FBQ0UxQixRQUFBQSxZQUFZLEVBQUVxQixLQUFLLENBQUNyQixZQUR0QjtBQUVFQyxRQUFBQSxTQUFTLEVBQUVvQixLQUFLLENBQUNwQjtBQUZuQixTQUdLeUIsTUFITDtBQUtELEtBaFphOztBQUVaLFVBQUs3QyxLQUFMLEdBQWE3QixZQUFiO0FBQ0EsVUFBSzZELGlCQUFMLEdBQXlCLEtBQXpCO0FBRUEsVUFBS0QsT0FBTCxHQUFlO0FBQ2JrQyxNQUFBQSxRQUFRLEVBQUUsa0JBQUEzQixHQUFHO0FBQUEsZUFBSSxNQUFLNEIsUUFBTCxDQUFjLE1BQUtDLFFBQW5CLEVBQTZCN0IsR0FBN0IsRUFBa0MsSUFBbEMsQ0FBSjtBQUFBLE9BREE7QUFFYjhCLE1BQUFBLEtBQUssRUFBRSxlQUFBOUIsR0FBRztBQUFBLGVBQUlBLEdBQUcsQ0FBQ0ksd0JBQUosRUFBSjtBQUFBLE9BRkc7QUFHYjJCLE1BQUFBLFdBQVcsRUFBRSxxQkFBQS9CLEdBQUc7QUFBQSxlQUFJLE1BQUs0QixRQUFMLENBQWMsTUFBS0ksY0FBbkIsRUFBbUNoQyxHQUFuQyxFQUF3QyxJQUF4QyxDQUFKO0FBQUEsT0FISDtBQUliaUMsTUFBQUEsV0FBVyxFQUFFLHFCQUFBakMsR0FBRztBQUFBLGVBQUksTUFBSzRCLFFBQUwsQ0FBYyxNQUFLTSxjQUFuQixFQUFtQ2xDLEdBQW5DLEVBQXdDLElBQXhDLENBQUo7QUFBQSxPQUpIO0FBS2JtQyxNQUFBQSxTQUFTLEVBQUUsbUJBQUFuQyxHQUFHO0FBQUEsZUFBSSxNQUFLNEIsUUFBTCxDQUFjLE1BQUtRLFlBQW5CLEVBQWlDcEMsR0FBakMsRUFBc0MsSUFBdEMsQ0FBSjtBQUFBLE9BTEQ7QUFNYnFDLE1BQUFBLE9BQU8sRUFBRSxpQkFBQXJDLEdBQUc7QUFBQSxlQUFJLE1BQUs0QixRQUFMLENBQWMsTUFBS1UsTUFBbkIsRUFBMkJ0QyxHQUEzQixFQUFnQyxLQUFoQyxDQUFKO0FBQUEsT0FOQztBQU9idUMsTUFBQUEsUUFBUSxFQUFFLGtCQUFBdkMsR0FBRztBQUFBLGVBQUksTUFBSzRCLFFBQUwsQ0FBYyxNQUFLVSxNQUFuQixFQUEyQnRDLEdBQTNCLEVBQWdDLEtBQWhDLENBQUo7QUFBQSxPQVBBO0FBUWJ3QyxNQUFBQSxNQUFNLEVBQUUsZ0JBQUF4QyxHQUFHO0FBQUEsZUFBSSxNQUFLNEIsUUFBTCxDQUFjLE1BQUtVLE1BQW5CLEVBQTJCdEMsR0FBM0IsRUFBZ0MsS0FBaEMsQ0FBSjtBQUFBO0FBUkUsS0FBZjtBQUxZO0FBZWI7Ozs7dUNBRWtCeUMsUyxFQUF3QjtBQUN6QyxVQUFJQSxTQUFTLENBQUNoSCxJQUFWLEtBQW1CLEtBQUtnQyxLQUFMLENBQVdoQyxJQUFsQyxFQUF3QztBQUN0QyxhQUFLaUgsa0JBQUw7O0FBQ0EsYUFBS0MsaUJBQUw7QUFDRDtBQUNGOzs7MkNBRXNCO0FBQ3JCLFdBQUtoRixrQkFBTDtBQUNEOzs7bUNBMENjO0FBQ2IsVUFBTTdCLGlCQUFpQixHQUFHLEtBQUtZLHFCQUFMLEVBQTFCOztBQURhLFVBR0xMLG9CQUhLLEdBR29CLEtBQUtxQixLQUh6QixDQUdMckIsb0JBSEs7O0FBSWIsVUFBTUosb0JBQW9CLEdBQUcsS0FBS2dCLHdCQUFMLEVBQTdCOztBQUNBLFVBQU11RSxRQUFRLEdBQUcsS0FBS2hDLFFBQUwsSUFBaUIsS0FBS0EsUUFBTCxDQUFjZ0MsUUFBaEQ7QUFFQSxhQUFPO0FBQ0xqRCxRQUFBQSxJQUFJLEVBQUV6QyxpQkFERDtBQUVMOEcsUUFBQUEsZUFBZSxFQUFFLENBQUMzRyxvQkFBRCxDQUZaO0FBR0xJLFFBQUFBLG9CQUFvQixFQUFwQkEsb0JBSEs7QUFJTG1GLFFBQUFBLFFBQVEsRUFBUkEsUUFKSztBQUtMcUIsUUFBQUEsTUFBTSxFQUFFLEtBQUtDO0FBTFIsT0FBUDtBQU9EO0FBRUQ7Ozs7OEJBb1NVOUMsRyxFQUFtQjtBQUMzQixVQUFNK0MsTUFBTSxHQUFHLDhCQUFrQi9DLEdBQWxCLENBQWY7QUFDQSxVQUFNbkIsWUFBWSxHQUFHLDRCQUFnQm1CLEdBQWhCLENBQXJCO0FBQ0EsVUFBTWxCLFNBQVMsR0FBRyxLQUFLNEMsU0FBTCxDQUFlN0MsWUFBZixDQUFsQjtBQUVBLGFBQU87QUFDTHlCLFFBQUFBLEtBQUssRUFBRXlDLE1BQU0sR0FBRyxDQUFDQSxNQUFELENBQUgsR0FBYyxJQUR0QjtBQUVMbEUsUUFBQUEsWUFBWSxFQUFaQSxZQUZLO0FBR0xDLFFBQUFBLFNBQVMsRUFBVEEsU0FISztBQUlMd0MsUUFBQUEsV0FBVyxFQUFFdEI7QUFKUixPQUFQO0FBTUQ7OztpQ0FlWTtBQUFBLFVBQ0h2RSxJQURHLEdBQ00sS0FBS2dDLEtBRFgsQ0FDSGhDLElBREc7QUFFWCxhQUFPdUgsd0JBQWE1RixTQUFiLENBQXVCLFVBQUE2RixDQUFDO0FBQUEsZUFBSUEsQ0FBQyxLQUFLeEgsSUFBVjtBQUFBLE9BQXhCLEtBQTJDLENBQWxEO0FBQ0Q7OzsyQkFFTXlILEssRUFBWTtBQUFBOztBQUNqQixhQUNFLDZCQUFDLHVCQUFELENBQVksUUFBWixRQUNHLFVBQUF0RSxPQUFPLEVBQUk7QUFDVixRQUFBLE1BQUksQ0FBQ1ksUUFBTCxHQUFnQlosT0FBaEI7QUFDQSxZQUFNNEMsUUFBUSxHQUFHNUMsT0FBTyxJQUFJQSxPQUFPLENBQUM0QyxRQUFwQzs7QUFFQSxZQUFJLENBQUNBLFFBQUQsSUFBYUEsUUFBUSxDQUFDMkIsTUFBVCxJQUFtQixDQUFoQyxJQUFxQzNCLFFBQVEsQ0FBQzRCLEtBQVQsSUFBa0IsQ0FBM0QsRUFBOEQ7QUFDNUQsaUJBQU8sSUFBUDtBQUNEOztBQUVELGVBQU9GLEtBQVA7QUFDRCxPQVZILENBREY7QUFjRDs7OztFQXphc0NHLG9COzs7O2dCQUFwQjVHLFcsa0JBQ0dqQixZOztBQTJheEJpQixXQUFXLENBQUM2RyxXQUFaLEdBQTBCLGFBQTFCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcbmltcG9ydCB7IF9NYXBDb250ZXh0IGFzIE1hcENvbnRleHQgfSBmcm9tICdyZWFjdC1tYXAtZ2wnO1xuaW1wb3J0IFJlYWN0LCB7IFB1cmVDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbiB9IGZyb20gJ2tlcGxlci1vdXRkYXRlZC1uZWJ1bGEuZ2wtZWRpdC1tb2Rlcyc7XG5cbmltcG9ydCB0eXBlIHsgRmVhdHVyZSwgUG9zaXRpb24sIEVkaXRBY3Rpb24gfSBmcm9tICdrZXBsZXItb3V0ZGF0ZWQtbmVidWxhLmdsLWVkaXQtbW9kZXMnO1xuaW1wb3J0IHR5cGUgeyBNam9sbmlyRXZlbnQgfSBmcm9tICdtam9sbmlyLmpzJztcbmltcG9ydCB0eXBlIHsgQmFzZUV2ZW50LCBFZGl0b3JQcm9wcywgRWRpdG9yU3RhdGUsIFNlbGVjdEFjdGlvbiB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IG1lbW9pemUgZnJvbSAnLi9tZW1vaXplJztcblxuaW1wb3J0IHsgRFJBV0lOR19NT0RFLCBFRElUX1RZUEUsIEVMRU1FTlRfVFlQRSwgTU9ERVMgfSBmcm9tICcuL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBnZXRTY3JlZW5Db29yZHMsIGlzTnVtZXJpYywgcGFyc2VFdmVudEVsZW1lbnQgfSBmcm9tICcuL2VkaXQtbW9kZXMvdXRpbHMnO1xuaW1wb3J0IHtcbiAgU2VsZWN0TW9kZSxcbiAgRWRpdGluZ01vZGUsXG4gIERyYXdQb2ludE1vZGUsXG4gIERyYXdMaW5lU3RyaW5nTW9kZSxcbiAgRHJhd1JlY3RhbmdsZU1vZGUsXG4gIERyYXdQb2x5Z29uTW9kZVxufSBmcm9tICcuL2VkaXQtbW9kZXMnO1xuXG5jb25zdCBNT0RFX1RPX0hBTkRMRVIgPSBPYmplY3QuZnJlZXplKHtcbiAgW01PREVTLlJFQURfT05MWV06IG51bGwsXG4gIFtNT0RFUy5TRUxFQ1RdOiBTZWxlY3RNb2RlLFxuICBbTU9ERVMuRURJVElOR106IEVkaXRpbmdNb2RlLFxuICBbTU9ERVMuRFJBV19QT0lOVF06IERyYXdQb2ludE1vZGUsXG4gIFtNT0RFUy5EUkFXX1BBVEhdOiBEcmF3TGluZVN0cmluZ01vZGUsXG4gIFtNT0RFUy5EUkFXX1JFQ1RBTkdMRV06IERyYXdSZWN0YW5nbGVNb2RlLFxuICBbTU9ERVMuRFJBV19QT0xZR09OXTogRHJhd1BvbHlnb25Nb2RlXG59KTtcblxuY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICBtb2RlOiBNT0RFUy5SRUFEX09OTFksXG4gIGZlYXR1cmVzOiBudWxsLFxuICBvblNlbGVjdDogbnVsbCxcbiAgb25VcGRhdGU6IG51bGxcbn07XG5cbmNvbnN0IGRlZmF1bHRTdGF0ZSA9IHtcbiAgZmVhdHVyZUNvbGxlY3Rpb246IG5ldyBJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbih7XG4gICAgdHlwZTogJ0ZlYXR1cmVDb2xsZWN0aW9uJyxcbiAgICBmZWF0dXJlczogW11cbiAgfSksXG5cbiAgc2VsZWN0ZWRGZWF0dXJlSW5kZXg6IG51bGwsXG5cbiAgLy8gaW5kZXgsIGlzR3VpZGUsIG1hcENvb3Jkcywgc2NyZWVuQ29vcmRzXG4gIGhvdmVyZWQ6IG51bGwsXG5cbiAgaXNEcmFnZ2luZzogZmFsc2UsXG4gIGRpZERyYWc6IGZhbHNlLFxuXG4gIGxhc3RQb2ludGVyTW92ZUV2ZW50OiBudWxsLFxuXG4gIHBvaW50ZXJEb3duUGlja3M6IG51bGwsXG4gIHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzOiBudWxsLFxuICBwb2ludGVyRG93bk1hcENvb3JkczogbnVsbFxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTW9kZUhhbmRsZXIgZXh0ZW5kcyBQdXJlQ29tcG9uZW50PEVkaXRvclByb3BzLCBFZGl0b3JTdGF0ZT4ge1xuICBzdGF0aWMgZGVmYXVsdFByb3BzID0gZGVmYXVsdFByb3BzO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5zdGF0ZSA9IGRlZmF1bHRTdGF0ZTtcbiAgICB0aGlzLl9ldmVudHNSZWdpc3RlcmVkID0gZmFsc2U7XG5cbiAgICB0aGlzLl9ldmVudHMgPSB7XG4gICAgICBhbnljbGljazogZXZ0ID0+IHRoaXMuX29uRXZlbnQodGhpcy5fb25DbGljaywgZXZ0LCB0cnVlKSxcbiAgICAgIGNsaWNrOiBldnQgPT4gZXZ0LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpLFxuICAgICAgcG9pbnRlcm1vdmU6IGV2dCA9PiB0aGlzLl9vbkV2ZW50KHRoaXMuX29uUG9pbnRlck1vdmUsIGV2dCwgdHJ1ZSksXG4gICAgICBwb2ludGVyZG93bjogZXZ0ID0+IHRoaXMuX29uRXZlbnQodGhpcy5fb25Qb2ludGVyRG93biwgZXZ0LCB0cnVlKSxcbiAgICAgIHBvaW50ZXJ1cDogZXZ0ID0+IHRoaXMuX29uRXZlbnQodGhpcy5fb25Qb2ludGVyVXAsIGV2dCwgdHJ1ZSksXG4gICAgICBwYW5tb3ZlOiBldnQgPT4gdGhpcy5fb25FdmVudCh0aGlzLl9vblBhbiwgZXZ0LCBmYWxzZSksXG4gICAgICBwYW5zdGFydDogZXZ0ID0+IHRoaXMuX29uRXZlbnQodGhpcy5fb25QYW4sIGV2dCwgZmFsc2UpLFxuICAgICAgcGFuZW5kOiBldnQgPT4gdGhpcy5fb25FdmVudCh0aGlzLl9vblBhbiwgZXZ0LCBmYWxzZSlcbiAgICB9O1xuICB9XG5cbiAgY29tcG9uZW50RGlkVXBkYXRlKHByZXZQcm9wczogRWRpdG9yUHJvcHMpIHtcbiAgICBpZiAocHJldlByb3BzLm1vZGUgIT09IHRoaXMucHJvcHMubW9kZSkge1xuICAgICAgdGhpcy5fY2xlYXJFZGl0aW5nU3RhdGUoKTtcbiAgICAgIHRoaXMuX3NldHVwTW9kZUhhbmRsZXIoKTtcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB0aGlzLl9kZWdyZWdpc3RlckV2ZW50cygpO1xuICB9XG5cbiAgX2V2ZW50czogYW55O1xuICBfZXZlbnRzUmVnaXN0ZXJlZDogYm9vbGVhbjtcbiAgX21vZGVIYW5kbGVyOiBhbnk7XG4gIF9jb250ZXh0OiA/TWFwQ29udGV4dDtcbiAgX2NvbnRhaW5lclJlZjogP0hUTUxFbGVtZW50O1xuXG4gIGdldEZlYXR1cmVzID0gKCkgPT4ge1xuICAgIGxldCBmZWF0dXJlQ29sbGVjdGlvbiA9IHRoaXMuX2dldEZlYXR1cmVDb2xsZWN0aW9uKCk7XG4gICAgZmVhdHVyZUNvbGxlY3Rpb24gPSBmZWF0dXJlQ29sbGVjdGlvbiAmJiBmZWF0dXJlQ29sbGVjdGlvbi5nZXRPYmplY3QoKTtcbiAgICByZXR1cm4gZmVhdHVyZUNvbGxlY3Rpb24gJiYgZmVhdHVyZUNvbGxlY3Rpb24uZmVhdHVyZXM7XG4gIH07XG5cbiAgYWRkRmVhdHVyZXMgPSAoZmVhdHVyZXM6IEZlYXR1cmUgfCBGZWF0dXJlW10pID0+IHtcbiAgICBsZXQgZmVhdHVyZUNvbGxlY3Rpb24gPSB0aGlzLl9nZXRGZWF0dXJlQ29sbGVjdGlvbigpO1xuICAgIGlmIChmZWF0dXJlQ29sbGVjdGlvbikge1xuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGZlYXR1cmVzKSkge1xuICAgICAgICBmZWF0dXJlcyA9IFtmZWF0dXJlc107XG4gICAgICB9XG5cbiAgICAgIGZlYXR1cmVDb2xsZWN0aW9uID0gZmVhdHVyZUNvbGxlY3Rpb24uYWRkRmVhdHVyZXMoZmVhdHVyZXMpO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IGZlYXR1cmVDb2xsZWN0aW9uIH0pO1xuICAgIH1cbiAgfTtcblxuICBkZWxldGVGZWF0dXJlcyA9IChmZWF0dXJlSW5kZXhlczogbnVtYmVyIHwgbnVtYmVyW10pID0+IHtcbiAgICBsZXQgZmVhdHVyZUNvbGxlY3Rpb24gPSB0aGlzLl9nZXRGZWF0dXJlQ29sbGVjdGlvbigpO1xuICAgIGNvbnN0IHNlbGVjdGVkRmVhdHVyZUluZGV4ID0gdGhpcy5fZ2V0U2VsZWN0ZWRGZWF0dXJlSW5kZXgoKTtcbiAgICBpZiAoZmVhdHVyZUNvbGxlY3Rpb24pIHtcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShmZWF0dXJlSW5kZXhlcykpIHtcbiAgICAgICAgZmVhdHVyZUluZGV4ZXMgPSBbZmVhdHVyZUluZGV4ZXNdO1xuICAgICAgfVxuICAgICAgZmVhdHVyZUNvbGxlY3Rpb24gPSBmZWF0dXJlQ29sbGVjdGlvbi5kZWxldGVGZWF0dXJlcyhmZWF0dXJlSW5kZXhlcyk7XG4gICAgICBjb25zdCBuZXdTdGF0ZTogYW55ID0geyBmZWF0dXJlQ29sbGVjdGlvbiB9O1xuICAgICAgaWYgKGZlYXR1cmVJbmRleGVzLmZpbmRJbmRleChpbmRleCA9PiBzZWxlY3RlZEZlYXR1cmVJbmRleCA9PT0gaW5kZXgpID49IDApIHtcbiAgICAgICAgbmV3U3RhdGUuc2VsZWN0ZWRGZWF0dXJlSW5kZXggPSBudWxsO1xuICAgICAgfVxuICAgICAgdGhpcy5zZXRTdGF0ZShuZXdTdGF0ZSk7XG4gICAgfVxuICB9O1xuXG4gIGdldE1vZGVQcm9wcygpIHtcbiAgICBjb25zdCBmZWF0dXJlQ29sbGVjdGlvbiA9IHRoaXMuX2dldEZlYXR1cmVDb2xsZWN0aW9uKCk7XG5cbiAgICBjb25zdCB7IGxhc3RQb2ludGVyTW92ZUV2ZW50IH0gPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IHNlbGVjdGVkRmVhdHVyZUluZGV4ID0gdGhpcy5fZ2V0U2VsZWN0ZWRGZWF0dXJlSW5kZXgoKTtcbiAgICBjb25zdCB2aWV3cG9ydCA9IHRoaXMuX2NvbnRleHQgJiYgdGhpcy5fY29udGV4dC52aWV3cG9ydDtcblxuICAgIHJldHVybiB7XG4gICAgICBkYXRhOiBmZWF0dXJlQ29sbGVjdGlvbixcbiAgICAgIHNlbGVjdGVkSW5kZXhlczogW3NlbGVjdGVkRmVhdHVyZUluZGV4XSxcbiAgICAgIGxhc3RQb2ludGVyTW92ZUV2ZW50LFxuICAgICAgdmlld3BvcnQsXG4gICAgICBvbkVkaXQ6IHRoaXMuX29uRWRpdFxuICAgIH07XG4gIH1cblxuICAvKiBNRU1PUklaRVJTICovXG4gIF9nZXRNZW1vcml6ZWRGZWF0dXJlQ29sbGVjdGlvbiA9IG1lbW9pemUoKHsgcHJvcHNGZWF0dXJlcywgc3RhdGVGZWF0dXJlcyB9OiBhbnkpID0+IHtcbiAgICBjb25zdCBmZWF0dXJlcyA9IHByb3BzRmVhdHVyZXMgfHwgc3RhdGVGZWF0dXJlcztcbiAgICAvLyBBbnkgY2hhbmdlcyBpbiBJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbiB3aWxsIGNyZWF0ZSBhIG5ldyBvYmplY3RcbiAgICBpZiAoZmVhdHVyZXMgaW5zdGFuY2VvZiBJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIGZlYXR1cmVzO1xuICAgIH1cblxuICAgIGlmIChmZWF0dXJlcyAmJiBmZWF0dXJlcy50eXBlID09PSAnRmVhdHVyZUNvbGxlY3Rpb24nKSB7XG4gICAgICByZXR1cm4gbmV3IEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uKHtcbiAgICAgICAgdHlwZTogJ0ZlYXR1cmVDb2xsZWN0aW9uJyxcbiAgICAgICAgZmVhdHVyZXM6IGZlYXR1cmVzLmZlYXR1cmVzXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uKHtcbiAgICAgIHR5cGU6ICdGZWF0dXJlQ29sbGVjdGlvbicsXG4gICAgICBmZWF0dXJlczogZmVhdHVyZXMgfHwgW11cbiAgICB9KTtcbiAgfSk7XG5cbiAgX2dldEZlYXR1cmVDb2xsZWN0aW9uID0gKCkgPT4ge1xuICAgIHJldHVybiB0aGlzLl9nZXRNZW1vcml6ZWRGZWF0dXJlQ29sbGVjdGlvbih7XG4gICAgICBwcm9wc0ZlYXR1cmVzOiB0aGlzLnByb3BzLmZlYXR1cmVzLFxuICAgICAgc3RhdGVGZWF0dXJlczogdGhpcy5zdGF0ZS5mZWF0dXJlQ29sbGVjdGlvblxuICAgIH0pO1xuICB9O1xuXG4gIF9zZXR1cE1vZGVIYW5kbGVyID0gKCkgPT4ge1xuICAgIGNvbnN0IG1vZGUgPSB0aGlzLnByb3BzLm1vZGU7XG5cbiAgICBpZiAoIW1vZGUgfHwgbW9kZSA9PT0gTU9ERVMuUkVBRF9PTkxZKSB7XG4gICAgICB0aGlzLl9kZWdyZWdpc3RlckV2ZW50cygpO1xuICAgICAgdGhpcy5fbW9kZUhhbmRsZXIgPSBudWxsO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX3JlZ2lzdGVyRXZlbnRzKCk7XG5cbiAgICBjb25zdCBIYW5kbGVyQ2xhc3MgPSBNT0RFX1RPX0hBTkRMRVJbbW9kZV07XG4gICAgdGhpcy5fbW9kZUhhbmRsZXIgPSBIYW5kbGVyQ2xhc3MgPyBuZXcgSGFuZGxlckNsYXNzKCkgOiBudWxsO1xuICB9O1xuXG4gIC8qIEVESVRJTkcgT1BFUkFUSU9OUyAqL1xuICBfY2xlYXJFZGl0aW5nU3RhdGUgPSAoKSA9PiB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzZWxlY3RlZEZlYXR1cmVJbmRleDogbnVsbCxcblxuICAgICAgaG92ZXJlZDogbnVsbCxcblxuICAgICAgcG9pbnRlckRvd25QaWNrczogbnVsbCxcbiAgICAgIHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzOiBudWxsLFxuICAgICAgcG9pbnRlckRvd25NYXBDb29yZHM6IG51bGwsXG5cbiAgICAgIGlzRHJhZ2dpbmc6IGZhbHNlLFxuICAgICAgZGlkRHJhZzogZmFsc2VcbiAgICB9KTtcbiAgfTtcblxuICBfZ2V0U2VsZWN0ZWRGZWF0dXJlSW5kZXggPSAoKSA9PiB7XG4gICAgcmV0dXJuIGlzTnVtZXJpYyh0aGlzLnByb3BzLnNlbGVjdGVkRmVhdHVyZUluZGV4KVxuICAgICAgPyB0aGlzLnByb3BzLnNlbGVjdGVkRmVhdHVyZUluZGV4XG4gICAgICA6IHRoaXMuc3RhdGUuc2VsZWN0ZWRGZWF0dXJlSW5kZXg7XG4gIH07XG5cbiAgX2dldFNlbGVjdGVkRmVhdHVyZSA9IChmZWF0dXJlSW5kZXg6ID9udW1iZXIpID0+IHtcbiAgICBjb25zdCBmZWF0dXJlcyA9IHRoaXMuZ2V0RmVhdHVyZXMoKTtcbiAgICBmZWF0dXJlSW5kZXggPSBpc051bWVyaWMoZmVhdHVyZUluZGV4KSA/IGZlYXR1cmVJbmRleCA6IHRoaXMuX2dldFNlbGVjdGVkRmVhdHVyZUluZGV4KCk7XG4gICAgcmV0dXJuIGZlYXR1cmVzW2ZlYXR1cmVJbmRleF07XG4gIH07XG5cbiAgX29uU2VsZWN0ID0gKHNlbGVjdGVkOiBTZWxlY3RBY3Rpb24pID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHsgc2VsZWN0ZWRGZWF0dXJlSW5kZXg6IHNlbGVjdGVkICYmIHNlbGVjdGVkLnNlbGVjdGVkRmVhdHVyZUluZGV4IH0pO1xuICAgIGlmICh0aGlzLnByb3BzLm9uU2VsZWN0KSB7XG4gICAgICB0aGlzLnByb3BzLm9uU2VsZWN0KHNlbGVjdGVkKTtcbiAgICB9XG4gIH07XG5cbiAgX29uVXBkYXRlID0gKGVkaXRBY3Rpb246IEVkaXRBY3Rpb24sIGlzSW50ZXJuYWw6ID9ib29sZWFuKSA9PiB7XG4gICAgY29uc3QgeyBlZGl0VHlwZSwgdXBkYXRlZERhdGEsIGVkaXRDb250ZXh0IH0gPSBlZGl0QWN0aW9uO1xuICAgIHRoaXMuc2V0U3RhdGUoeyBmZWF0dXJlQ29sbGVjdGlvbjogbmV3IEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uKHVwZGF0ZWREYXRhKSB9KTtcbiAgICBpZiAodGhpcy5wcm9wcy5vblVwZGF0ZSAmJiAhaXNJbnRlcm5hbCkge1xuICAgICAgdGhpcy5wcm9wcy5vblVwZGF0ZSh7XG4gICAgICAgIGRhdGE6IHVwZGF0ZWREYXRhICYmIHVwZGF0ZWREYXRhLmZlYXR1cmVzLFxuICAgICAgICBlZGl0VHlwZSxcbiAgICAgICAgZWRpdENvbnRleHRcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICBfb25FZGl0ID0gKGVkaXRBY3Rpb246IEVkaXRBY3Rpb24pID0+IHtcbiAgICBjb25zdCB7IG1vZGUgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgeyBlZGl0VHlwZSwgdXBkYXRlZERhdGEgfSA9IGVkaXRBY3Rpb247XG5cbiAgICBzd2l0Y2ggKGVkaXRUeXBlKSB7XG4gICAgICBjYXNlIEVESVRfVFlQRS5NT1ZFX1BPU0lUSU9OOlxuICAgICAgICAvLyBpbnRlcm1lZGlhdGUgZmVhdHVyZSwgZG8gbm90IG5lZWQgZm9yd2FyZCB0byBhcHBsaWNhdGlvblxuICAgICAgICAvLyBvbmx5IG5lZWQgdXBkYXRlIGVkaXRvciBpbnRlcm5hbCBzdGF0ZVxuICAgICAgICB0aGlzLl9vblVwZGF0ZShlZGl0QWN0aW9uLCB0cnVlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEVESVRfVFlQRS5BRERfRkVBVFVSRTpcbiAgICAgICAgdGhpcy5fb25VcGRhdGUoZWRpdEFjdGlvbik7XG4gICAgICAgIGlmIChtb2RlID09PSBNT0RFUy5EUkFXX1BBVEgpIHtcbiAgICAgICAgICBjb25zdCBjb250ZXh0ID0gKGVkaXRBY3Rpb24uZWRpdENvbnRleHQgJiYgZWRpdEFjdGlvbi5lZGl0Q29udGV4dFswXSkgfHwge307XG4gICAgICAgICAgY29uc3QgeyBzY3JlZW5Db29yZHMsIG1hcENvb3JkcyB9ID0gY29udGV4dDtcbiAgICAgICAgICBjb25zdCBmZWF0dXJlSW5kZXggPSB1cGRhdGVkRGF0YS5mZWF0dXJlcy5sZW5ndGggLSAxO1xuICAgICAgICAgIGNvbnN0IHNlbGVjdGVkRmVhdHVyZSA9IHRoaXMuX2dldFNlbGVjdGVkRmVhdHVyZShmZWF0dXJlSW5kZXgpO1xuICAgICAgICAgIHRoaXMuX29uU2VsZWN0KHtcbiAgICAgICAgICAgIHNlbGVjdGVkRmVhdHVyZSxcbiAgICAgICAgICAgIHNlbGVjdGVkRmVhdHVyZUluZGV4OiBmZWF0dXJlSW5kZXgsXG4gICAgICAgICAgICBzZWxlY3RlZEVkaXRIYW5kbGVJbmRleDogbnVsbCxcbiAgICAgICAgICAgIHNjcmVlbkNvb3JkcyxcbiAgICAgICAgICAgIG1hcENvb3Jkc1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBFRElUX1RZUEUuQUREX1BPU0lUSU9OOlxuICAgICAgY2FzZSBFRElUX1RZUEUuUkVNT1ZFX1BPU0lUSU9OOlxuICAgICAgY2FzZSBFRElUX1RZUEUuRklOSVNIX01PVkVfUE9TSVRJT046XG4gICAgICAgIHRoaXMuX29uVXBkYXRlKGVkaXRBY3Rpb24pO1xuICAgICAgICBicmVhaztcblxuICAgICAgZGVmYXVsdDpcbiAgICB9XG4gIH07XG5cbiAgLyogRVZFTlRTICovXG4gIF9kZWdyZWdpc3RlckV2ZW50cyA9ICgpID0+IHtcbiAgICBjb25zdCBldmVudE1hbmFnZXIgPSB0aGlzLl9jb250ZXh0ICYmIHRoaXMuX2NvbnRleHQuZXZlbnRNYW5hZ2VyO1xuICAgIGlmICghdGhpcy5fZXZlbnRzIHx8ICFldmVudE1hbmFnZXIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZXZlbnRzUmVnaXN0ZXJlZCkge1xuICAgICAgZXZlbnRNYW5hZ2VyLm9mZih0aGlzLl9ldmVudHMpO1xuICAgICAgdGhpcy5fZXZlbnRzUmVnaXN0ZXJlZCA9IGZhbHNlO1xuICAgIH1cbiAgfTtcblxuICBfcmVnaXN0ZXJFdmVudHMgPSAoKSA9PiB7XG4gICAgY29uc3QgcmVmID0gdGhpcy5fY29udGFpbmVyUmVmO1xuICAgIGNvbnN0IGV2ZW50TWFuYWdlciA9IHRoaXMuX2NvbnRleHQgJiYgdGhpcy5fY29udGV4dC5ldmVudE1hbmFnZXI7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXJlZiB8fCAhZXZlbnRNYW5hZ2VyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2V2ZW50c1JlZ2lzdGVyZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBldmVudE1hbmFnZXIub24odGhpcy5fZXZlbnRzLCByZWYpO1xuICAgIHRoaXMuX2V2ZW50c1JlZ2lzdGVyZWQgPSB0cnVlO1xuICB9O1xuXG4gIF9vbkV2ZW50ID0gKGhhbmRsZXI6IEZ1bmN0aW9uLCBldnQ6IE1qb2xuaXJFdmVudCwgc3RvcFByb3BhZ2F0aW9uOiBib29sZWFuKSA9PiB7XG4gICAgY29uc3QgZXZlbnQgPSB0aGlzLl9nZXRFdmVudChldnQpO1xuICAgIGhhbmRsZXIoZXZlbnQpO1xuXG4gICAgaWYgKHN0b3BQcm9wYWdhdGlvbikge1xuICAgICAgZXZ0LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgIH1cbiAgfTtcblxuICBfb25DbGljayA9IChldmVudDogQmFzZUV2ZW50KSA9PiB7XG4gICAgY29uc3QgeyBtb2RlIH0gPSB0aGlzLnByb3BzO1xuICAgIGlmIChtb2RlID09PSBNT0RFUy5TRUxFQ1QgfHwgbW9kZSA9PT0gTU9ERVMuRURJVElORykge1xuICAgICAgY29uc3QgeyBtYXBDb29yZHMsIHNjcmVlbkNvb3JkcyB9ID0gZXZlbnQ7XG4gICAgICBjb25zdCBwaWNrZWRPYmplY3QgPSBldmVudC5waWNrcyAmJiBldmVudC5waWNrc1swXSAmJiBldmVudC5waWNrc1swXS5vYmplY3Q7XG4gICAgICBpZiAocGlja2VkT2JqZWN0ICYmIGlzTnVtZXJpYyhwaWNrZWRPYmplY3QuZmVhdHVyZUluZGV4KSkge1xuICAgICAgICBjb25zdCBzZWxlY3RlZEZlYXR1cmVJbmRleCA9IHBpY2tlZE9iamVjdC5mZWF0dXJlSW5kZXg7XG4gICAgICAgIGNvbnN0IHNlbGVjdGVkRmVhdHVyZSA9IHRoaXMuX2dldFNlbGVjdGVkRmVhdHVyZShzZWxlY3RlZEZlYXR1cmVJbmRleCk7XG4gICAgICAgIHRoaXMuX29uU2VsZWN0KHtcbiAgICAgICAgICBzZWxlY3RlZEZlYXR1cmUsXG4gICAgICAgICAgc2VsZWN0ZWRGZWF0dXJlSW5kZXgsXG4gICAgICAgICAgc2VsZWN0ZWRFZGl0SGFuZGxlSW5kZXg6XG4gICAgICAgICAgICBwaWNrZWRPYmplY3QudHlwZSA9PT0gRUxFTUVOVF9UWVBFLkVESVRfSEFORExFID8gcGlja2VkT2JqZWN0LmluZGV4IDogbnVsbCxcbiAgICAgICAgICBtYXBDb29yZHMsXG4gICAgICAgICAgc2NyZWVuQ29vcmRzXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fb25TZWxlY3Qoe1xuICAgICAgICAgIHNlbGVjdGVkRmVhdHVyZTogbnVsbCxcbiAgICAgICAgICBzZWxlY3RlZEZlYXR1cmVJbmRleDogbnVsbCxcbiAgICAgICAgICBzZWxlY3RlZEVkaXRIYW5kbGVJbmRleDogbnVsbCxcbiAgICAgICAgICBtYXBDb29yZHMsXG4gICAgICAgICAgc2NyZWVuQ29vcmRzXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IG1vZGVQcm9wcyA9IHRoaXMuZ2V0TW9kZVByb3BzKCk7XG4gICAgdGhpcy5fbW9kZUhhbmRsZXIuaGFuZGxlQ2xpY2soZXZlbnQsIG1vZGVQcm9wcyk7XG4gIH07XG5cbiAgX29uUG9pbnRlck1vdmUgPSAoZXZlbnQ6IEJhc2VFdmVudCkgPT4ge1xuICAgIC8vIGhvdmVyaW5nXG4gICAgY29uc3QgaG92ZXJlZCA9IHRoaXMuX2dldEhvdmVyU3RhdGUoZXZlbnQpO1xuICAgIGNvbnN0IHtcbiAgICAgIGlzRHJhZ2dpbmcsXG4gICAgICBkaWREcmFnLFxuICAgICAgcG9pbnRlckRvd25QaWNrcyxcbiAgICAgIHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzLFxuICAgICAgcG9pbnRlckRvd25NYXBDb29yZHNcbiAgICB9ID0gdGhpcy5zdGF0ZTtcblxuICAgIGlmIChpc0RyYWdnaW5nICYmICFkaWREcmFnICYmIHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzKSB7XG4gICAgICBjb25zdCBkeCA9IGV2ZW50LnNjcmVlbkNvb3Jkc1swXSAtIHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzWzBdO1xuICAgICAgY29uc3QgZHkgPSBldmVudC5zY3JlZW5Db29yZHNbMV0gLSBwb2ludGVyRG93blNjcmVlbkNvb3Jkc1sxXTtcbiAgICAgIGlmIChkeCAqIGR4ICsgZHkgKiBkeSA+IDUpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGRpZERyYWc6IHRydWUgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgcG9pbnRlck1vdmVFdmVudCA9IHtcbiAgICAgIC4uLmV2ZW50LFxuICAgICAgaXNEcmFnZ2luZyxcbiAgICAgIHBvaW50ZXJEb3duUGlja3MsXG4gICAgICBwb2ludGVyRG93blNjcmVlbkNvb3JkcyxcbiAgICAgIHBvaW50ZXJEb3duTWFwQ29vcmRzXG4gICAgfTtcblxuICAgIGlmICh0aGlzLnN0YXRlLmRpZERyYWcpIHtcbiAgICAgIGNvbnN0IG1vZGVQcm9wcyA9IHRoaXMuZ2V0TW9kZVByb3BzKCk7XG4gICAgICB0aGlzLl9tb2RlSGFuZGxlci5oYW5kbGVQb2ludGVyTW92ZShwb2ludGVyTW92ZUV2ZW50LCBtb2RlUHJvcHMpO1xuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaG92ZXJlZCxcbiAgICAgIGxhc3RQb2ludGVyTW92ZUV2ZW50OiBwb2ludGVyTW92ZUV2ZW50XG4gICAgfSk7XG4gIH07XG5cbiAgX29uUG9pbnRlckRvd24gPSAoZXZlbnQ6IEJhc2VFdmVudCkgPT4ge1xuICAgIGNvbnN0IHBpY2tlZE9iamVjdCA9IGV2ZW50LnBpY2tzICYmIGV2ZW50LnBpY2tzWzBdICYmIGV2ZW50LnBpY2tzWzBdLm9iamVjdDtcbiAgICBjb25zdCBzdGFydERyYWdnaW5nRXZlbnQgPSB7XG4gICAgICAuLi5ldmVudCxcbiAgICAgIHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzOiBldmVudC5zY3JlZW5Db29yZHMsXG4gICAgICBwb2ludGVyRG93bk1hcENvb3JkczogZXZlbnQubWFwQ29vcmRzXG4gICAgfTtcblxuICAgIGNvbnN0IG5ld1N0YXRlID0ge1xuICAgICAgaXNEcmFnZ2luZzogcGlja2VkT2JqZWN0ICYmIGlzTnVtZXJpYyhwaWNrZWRPYmplY3QuZmVhdHVyZUluZGV4KSxcbiAgICAgIHBvaW50ZXJEb3duUGlja3M6IGV2ZW50LnBpY2tzLFxuICAgICAgcG9pbnRlckRvd25TY3JlZW5Db29yZHM6IGV2ZW50LnNjcmVlbkNvb3JkcyxcbiAgICAgIHBvaW50ZXJEb3duTWFwQ29vcmRzOiBldmVudC5tYXBDb29yZHNcbiAgICB9O1xuXG4gICAgdGhpcy5zZXRTdGF0ZShuZXdTdGF0ZSk7XG5cbiAgICBjb25zdCBtb2RlUHJvcHMgPSB0aGlzLmdldE1vZGVQcm9wcygpO1xuICAgIHRoaXMuX21vZGVIYW5kbGVyLmhhbmRsZVN0YXJ0RHJhZ2dpbmcoc3RhcnREcmFnZ2luZ0V2ZW50LCBtb2RlUHJvcHMpO1xuICB9O1xuXG4gIF9vblBvaW50ZXJVcCA9IChldmVudDogTWpvbG5pckV2ZW50KSA9PiB7XG4gICAgY29uc3Qgc3RvcERyYWdnaW5nRXZlbnQgPSB7XG4gICAgICAuLi5ldmVudCxcbiAgICAgIHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzOiB0aGlzLnN0YXRlLnBvaW50ZXJEb3duU2NyZWVuQ29vcmRzLFxuICAgICAgcG9pbnRlckRvd25NYXBDb29yZHM6IHRoaXMuc3RhdGUucG9pbnRlckRvd25NYXBDb29yZHNcbiAgICB9O1xuXG4gICAgY29uc3QgbmV3U3RhdGUgPSB7XG4gICAgICBpc0RyYWdnaW5nOiBmYWxzZSxcbiAgICAgIGRpZERyYWc6IGZhbHNlLFxuICAgICAgcG9pbnRlckRvd25QaWNrczogbnVsbCxcbiAgICAgIHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzOiBudWxsLFxuICAgICAgcG9pbnRlckRvd25NYXBDb29yZHM6IG51bGxcbiAgICB9O1xuXG4gICAgdGhpcy5zZXRTdGF0ZShuZXdTdGF0ZSk7XG5cbiAgICBjb25zdCBtb2RlUHJvcHMgPSB0aGlzLmdldE1vZGVQcm9wcygpO1xuICAgIHRoaXMuX21vZGVIYW5kbGVyLmhhbmRsZVN0b3BEcmFnZ2luZyhzdG9wRHJhZ2dpbmdFdmVudCwgbW9kZVByb3BzKTtcbiAgfTtcblxuICBfb25QYW4gPSAoZXZlbnQ6IEJhc2VFdmVudCkgPT4ge1xuICAgIGNvbnN0IHsgaXNEcmFnZ2luZyB9ID0gdGhpcy5zdGF0ZTtcbiAgICBpZiAoaXNEcmFnZ2luZykge1xuICAgICAgZXZlbnQuc291cmNlRXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgfVxuICB9O1xuXG4gIC8qIEhFTFBFUlMgKi9cbiAgcHJvamVjdCA9IChwdDogUG9zaXRpb24pID0+IHtcbiAgICBjb25zdCB2aWV3cG9ydCA9IHRoaXMuX2NvbnRleHQgJiYgdGhpcy5fY29udGV4dC52aWV3cG9ydDtcbiAgICByZXR1cm4gdmlld3BvcnQgJiYgdmlld3BvcnQucHJvamVjdChwdCk7XG4gIH07XG5cbiAgdW5wcm9qZWN0ID0gKHB0OiBQb3NpdGlvbikgPT4ge1xuICAgIGNvbnN0IHZpZXdwb3J0ID0gdGhpcy5fY29udGV4dCAmJiB0aGlzLl9jb250ZXh0LnZpZXdwb3J0O1xuICAgIHJldHVybiB2aWV3cG9ydCAmJiB2aWV3cG9ydC51bnByb2plY3QocHQpO1xuICB9O1xuXG4gIF9nZXRFdmVudChldnQ6IE1qb2xuaXJFdmVudCkge1xuICAgIGNvbnN0IHBpY2tlZCA9IHBhcnNlRXZlbnRFbGVtZW50KGV2dCk7XG4gICAgY29uc3Qgc2NyZWVuQ29vcmRzID0gZ2V0U2NyZWVuQ29vcmRzKGV2dCk7XG4gICAgY29uc3QgbWFwQ29vcmRzID0gdGhpcy51bnByb2plY3Qoc2NyZWVuQ29vcmRzKTtcblxuICAgIHJldHVybiB7XG4gICAgICBwaWNrczogcGlja2VkID8gW3BpY2tlZF0gOiBudWxsLFxuICAgICAgc2NyZWVuQ29vcmRzLFxuICAgICAgbWFwQ29vcmRzLFxuICAgICAgc291cmNlRXZlbnQ6IGV2dFxuICAgIH07XG4gIH1cblxuICBfZ2V0SG92ZXJTdGF0ZSA9IChldmVudDogQmFzZUV2ZW50KSA9PiB7XG4gICAgY29uc3Qgb2JqZWN0ID0gZXZlbnQucGlja3MgJiYgZXZlbnQucGlja3NbMF0gJiYgZXZlbnQucGlja3NbMF0ub2JqZWN0O1xuICAgIGlmICghb2JqZWN0KSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgc2NyZWVuQ29vcmRzOiBldmVudC5zY3JlZW5Db29yZHMsXG4gICAgICBtYXBDb29yZHM6IGV2ZW50Lm1hcENvb3JkcyxcbiAgICAgIC4uLm9iamVjdFxuICAgIH07XG4gIH07XG5cbiAgX2lzRHJhd2luZygpIHtcbiAgICBjb25zdCB7IG1vZGUgfSA9IHRoaXMucHJvcHM7XG4gICAgcmV0dXJuIERSQVdJTkdfTU9ERS5maW5kSW5kZXgobSA9PiBtID09PSBtb2RlKSA+PSAwO1xuICB9XG5cbiAgcmVuZGVyKGNoaWxkOiBhbnkpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPE1hcENvbnRleHQuQ29uc3VtZXI+XG4gICAgICAgIHtjb250ZXh0ID0+IHtcbiAgICAgICAgICB0aGlzLl9jb250ZXh0ID0gY29udGV4dDtcbiAgICAgICAgICBjb25zdCB2aWV3cG9ydCA9IGNvbnRleHQgJiYgY29udGV4dC52aWV3cG9ydDtcblxuICAgICAgICAgIGlmICghdmlld3BvcnQgfHwgdmlld3BvcnQuaGVpZ2h0IDw9IDAgfHwgdmlld3BvcnQud2lkdGggPD0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIGNoaWxkO1xuICAgICAgICB9fVxuICAgICAgPC9NYXBDb250ZXh0LkNvbnN1bWVyPlxuICAgICk7XG4gIH1cbn1cblxuTW9kZUhhbmRsZXIuZGlzcGxheU5hbWUgPSAnTW9kZUhhbmRsZXInO1xuIl19