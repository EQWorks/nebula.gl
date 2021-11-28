"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactMapGl = require("react-map-gl");

var _react = _interopRequireWildcard(require("react"));

var _editModes = require("@nebula.gl/edit-modes");

var _constants = require("./constants");

var _utils = require("./edit-modes/utils");

var _editModes2 = require("./edit-modes");

var _style = require("./style");

var _Object$freeze;

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

var MODE_TO_HANDLER = Object.freeze((_Object$freeze = {}, _defineProperty(_Object$freeze, _constants.MODES.READ_ONLY, null), _defineProperty(_Object$freeze, _constants.MODES.SELECT, _editModes2.BaseMode), _defineProperty(_Object$freeze, _constants.MODES.EDITING, _editModes2.EditingMode), _defineProperty(_Object$freeze, _constants.MODES.DRAW_POINT, _editModes2.DrawPointMode), _defineProperty(_Object$freeze, _constants.MODES.DRAW_PATH, _editModes2.DrawLineStringMode), _defineProperty(_Object$freeze, _constants.MODES.DRAW_RECTANGLE, _editModes2.DrawRectangleMode), _defineProperty(_Object$freeze, _constants.MODES.DRAW_POLYGON, _editModes2.DrawPolygonMode), _Object$freeze));
var defaultProps = {
  mode: _constants.MODES.READ_ONLY,
  selectedFeatureId: null,
  clickRadius: 0,
  getEditHandleStyle: _style.getEditHandleStyle,
  getFeatureStyle: _style.getFeatureStyle,
  getFeatureShape: 'circle',
  getEditHandleShape: 'circle',
  onSelect: function onSelect() {}
};
var defaultState = {
  featureCollection: new _editModes.ImmutableFeatureCollection({
    type: 'FeatureCollection',
    features: []
  }),
  selectedFeatureIndex: null,
  selectedFeatureId: null,
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
function (_Component) {
  _inherits(ModeHandler, _Component);

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
      var featureCollection = _this.state.featureCollection;
      featureCollection = featureCollection && featureCollection.getObject();
      return featureCollection && featureCollection.features;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_setupModeHandler", function (mode) {
      if (mode === _constants.MODES.READ_ONLY) {
        _this._modeHandler = null;
        return;
      }

      var HandlerClass = MODE_TO_HANDLER[mode];

      if (HandlerClass) {
        _this._modeHandler = new HandlerClass();
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_clearEditingState", function () {
      _this.setState({
        hovered: null,
        pointerDownPicks: null,
        pointerDownScreenCoords: null,
        pointerDownMapCoords: null,
        isDragging: false,
        didDrag: false
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_onEdit", function (editAction) {
      var _this$props = _this.props,
          mode = _this$props.mode,
          onSelect = _this$props.onSelect,
          onUpdate = _this$props.onUpdate;
      var editType = editAction.editType,
          updatedData = editAction.updatedData;

      switch (editType) {
        case _constants.EDIT_TYPE.MOVE_POSITION:
          // intermediate feature, do not need forward to application
          // update editor state
          _this.setState({
            featureCollection: new _editModes.ImmutableFeatureCollection(updatedData)
          });

          break;

        case _constants.EDIT_TYPE.ADD_FEATURE:
          onUpdate(updatedData && updatedData.features);

          if (mode === _constants.MODES.DRAW_PATH) {
            var featureIndex = updatedData.features.length - 1;
            var feature = updatedData.features[featureIndex]; // TODO deprecate selectedFeatureId

            onSelect({
              selectedFeatureId: feature.properties.id,
              selectedFeatureIndex: featureIndex
            });
          } else {
            onSelect({
              selectedFeatureId: null,
              selectedFeatureIndex: null
            });
          }

          break;

        case _constants.EDIT_TYPE.ADD_POSITION:
        case _constants.EDIT_TYPE.REMOVE_POSITION:
        case _constants.EDIT_TYPE.FINISH_MOVE_POSITION:
          onUpdate(updatedData && updatedData.features);
          break;

        default:
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_degregisterEvents", function () {
      var eventManager = _this._context && _this._context.eventManager;

      if (!_this._events || !eventManager) {
        return;
      }

      eventManager.off(_this._events);
      _this._eventsRegistered = false;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_registerEvents", function () {
      var ref = _this._containerRef;
      var eventManager = _this._context && _this._context.eventManager;

      if (!_this._events || !ref || !eventManager) {
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
        var onSelect = _this.props.onSelect;
        var pickedObject = event.picks && event.picks[0] && event.picks[0].object;

        if (pickedObject && (0, _utils.isNumeric)(pickedObject.featureIndex)) {
          var features = _this.getFeatures();

          var feature = features && features[pickedObject.featureIndex];
          onSelect({
            selectedFeatureIndex: pickedObject.featureIndex,
            selectedFeatureId: feature && feature.properties.id
          });
        } else if (_this.state.selectedFeatureId) {
          onSelect({
            selectedFeatureIndex: null,
            selectedFeatureId: null
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
      if (_this._isDrawing()) {
        return null;
      }

      return event.picks && event.picks[0] && event.picks[0].object;
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
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps, nextContext) {
      if (this.props.mode !== nextProps.mode) {
        this._clearEditingState();

        if (this._eventsRegistered && (!nextProps.mode || nextProps.mode === _constants.MODES.READ_ONLY)) {
          this._degregisterEvents();
        }

        if (!this._eventsRegistered && nextProps.mode && nextProps.mode !== _constants.MODES.READ_ONLY) {
          this._registerEvents();
        }

        this._setupModeHandler(nextProps.mode);
      }

      if (this.props.features !== nextProps.features) {
        var featureCollection = nextProps.features;

        if (nextProps.features && Array.isArray(nextProps.features)) {
          featureCollection = {
            type: 'FeatureCollection',
            features: nextProps.features
          };
        }

        featureCollection = new _editModes.ImmutableFeatureCollection(featureCollection);
        this.setState({
          featureCollection: featureCollection
        });
      }

      if (this.props.selectedFeatureId !== nextProps.selectedFeatureId) {
        this._clearEditingState();

        var features = this.getFeatures();
        var selectedFeatureIndex = features && features.findIndex(function (f) {
          return f.properties.id === nextProps.selectedFeatureId;
        });
        this.setState({
          selectedFeatureId: nextProps.selectedFeatureId,
          selectedFeatureIndex: (0, _utils.isNumeric)(selectedFeatureIndex) ? selectedFeatureIndex : null
        });
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
      var _this$state2 = this.state,
          selectedFeatureIndex = _this$state2.selectedFeatureIndex,
          lastPointerMoveEvent = _this$state2.lastPointerMoveEvent,
          featureCollection = _this$state2.featureCollection;
      var viewport = this._context && this._context.viewport;
      return {
        data: featureCollection,
        selectedIndexes: [selectedFeatureIndex],
        lastPointerMoveEvent: lastPointerMoveEvent,
        viewport: viewport,
        onEdit: this._onEdit
      };
    }
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
}(_react.Component);

exports.default = ModeHandler;

_defineProperty(ModeHandler, "defaultProps", defaultProps);

ModeHandler.displayName = 'ModeHandler';
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tb2RlLWhhbmRsZXIuanMiXSwibmFtZXMiOlsiTU9ERV9UT19IQU5ETEVSIiwiT2JqZWN0IiwiZnJlZXplIiwiTU9ERVMiLCJSRUFEX09OTFkiLCJTRUxFQ1QiLCJCYXNlTW9kZSIsIkVESVRJTkciLCJFZGl0aW5nTW9kZSIsIkRSQVdfUE9JTlQiLCJEcmF3UG9pbnRNb2RlIiwiRFJBV19QQVRIIiwiRHJhd0xpbmVTdHJpbmdNb2RlIiwiRFJBV19SRUNUQU5HTEUiLCJEcmF3UmVjdGFuZ2xlTW9kZSIsIkRSQVdfUE9MWUdPTiIsIkRyYXdQb2x5Z29uTW9kZSIsImRlZmF1bHRQcm9wcyIsIm1vZGUiLCJzZWxlY3RlZEZlYXR1cmVJZCIsImNsaWNrUmFkaXVzIiwiZ2V0RWRpdEhhbmRsZVN0eWxlIiwiZGVmYXVsdEdldEVkaXRIYW5kbGVTdHlsZSIsImdldEZlYXR1cmVTdHlsZSIsImRlZmF1bHRHZXRGZWF0dXJlU3R5bGUiLCJnZXRGZWF0dXJlU2hhcGUiLCJnZXRFZGl0SGFuZGxlU2hhcGUiLCJvblNlbGVjdCIsImRlZmF1bHRTdGF0ZSIsImZlYXR1cmVDb2xsZWN0aW9uIiwiSW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24iLCJ0eXBlIiwiZmVhdHVyZXMiLCJzZWxlY3RlZEZlYXR1cmVJbmRleCIsImhvdmVyZWQiLCJpc0RyYWdnaW5nIiwiZGlkRHJhZyIsImxhc3RQb2ludGVyTW92ZUV2ZW50IiwicG9pbnRlckRvd25QaWNrcyIsInBvaW50ZXJEb3duU2NyZWVuQ29vcmRzIiwicG9pbnRlckRvd25NYXBDb29yZHMiLCJNb2RlSGFuZGxlciIsInN0YXRlIiwiZ2V0T2JqZWN0IiwiX21vZGVIYW5kbGVyIiwiSGFuZGxlckNsYXNzIiwic2V0U3RhdGUiLCJlZGl0QWN0aW9uIiwicHJvcHMiLCJvblVwZGF0ZSIsImVkaXRUeXBlIiwidXBkYXRlZERhdGEiLCJFRElUX1RZUEUiLCJNT1ZFX1BPU0lUSU9OIiwiQUREX0ZFQVRVUkUiLCJmZWF0dXJlSW5kZXgiLCJsZW5ndGgiLCJmZWF0dXJlIiwicHJvcGVydGllcyIsImlkIiwiQUREX1BPU0lUSU9OIiwiUkVNT1ZFX1BPU0lUSU9OIiwiRklOSVNIX01PVkVfUE9TSVRJT04iLCJldmVudE1hbmFnZXIiLCJfY29udGV4dCIsIl9ldmVudHMiLCJvZmYiLCJfZXZlbnRzUmVnaXN0ZXJlZCIsInJlZiIsIl9jb250YWluZXJSZWYiLCJvbiIsImhhbmRsZXIiLCJldnQiLCJzdG9wUHJvcGFnYXRpb24iLCJldmVudCIsIl9nZXRFdmVudCIsInN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbiIsInBpY2tlZE9iamVjdCIsInBpY2tzIiwib2JqZWN0IiwiZ2V0RmVhdHVyZXMiLCJtb2RlUHJvcHMiLCJnZXRNb2RlUHJvcHMiLCJoYW5kbGVDbGljayIsIl9nZXRIb3ZlclN0YXRlIiwiZHgiLCJzY3JlZW5Db29yZHMiLCJkeSIsInBvaW50ZXJNb3ZlRXZlbnQiLCJoYW5kbGVQb2ludGVyTW92ZSIsInN0YXJ0RHJhZ2dpbmdFdmVudCIsIm1hcENvb3JkcyIsIm5ld1N0YXRlIiwiaGFuZGxlU3RhcnREcmFnZ2luZyIsInN0b3BEcmFnZ2luZ0V2ZW50IiwiaGFuZGxlU3RvcERyYWdnaW5nIiwic291cmNlRXZlbnQiLCJwdCIsInZpZXdwb3J0IiwicHJvamVjdCIsInVucHJvamVjdCIsIl9pc0RyYXdpbmciLCJhbnljbGljayIsIl9vbkV2ZW50IiwiX29uQ2xpY2siLCJjbGljayIsInBvaW50ZXJtb3ZlIiwiX29uUG9pbnRlck1vdmUiLCJwb2ludGVyZG93biIsIl9vblBvaW50ZXJEb3duIiwicG9pbnRlcnVwIiwiX29uUG9pbnRlclVwIiwicGFubW92ZSIsIl9vblBhbiIsInBhbnN0YXJ0IiwicGFuZW5kIiwibmV4dFByb3BzIiwibmV4dENvbnRleHQiLCJfY2xlYXJFZGl0aW5nU3RhdGUiLCJfZGVncmVnaXN0ZXJFdmVudHMiLCJfcmVnaXN0ZXJFdmVudHMiLCJfc2V0dXBNb2RlSGFuZGxlciIsIkFycmF5IiwiaXNBcnJheSIsImZpbmRJbmRleCIsImYiLCJkYXRhIiwic2VsZWN0ZWRJbmRleGVzIiwib25FZGl0IiwiX29uRWRpdCIsInBpY2tlZCIsIkRSQVdJTkdfTU9ERSIsIm0iLCJjaGlsZCIsImNvbnRleHQiLCJoZWlnaHQiLCJ3aWR0aCIsIkNvbXBvbmVudCIsImRpc3BsYXlOYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBTUE7O0FBQ0E7O0FBQ0E7O0FBUUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFLQSxJQUFNQSxlQUFlLEdBQUdDLE1BQU0sQ0FBQ0MsTUFBUCx1REFDckJDLGlCQUFNQyxTQURlLEVBQ0gsSUFERyxtQ0FFckJELGlCQUFNRSxNQUZlLEVBRU5DLG9CQUZNLG1DQUdyQkgsaUJBQU1JLE9BSGUsRUFHTEMsdUJBSEssbUNBSXJCTCxpQkFBTU0sVUFKZSxFQUlGQyx5QkFKRSxtQ0FLckJQLGlCQUFNUSxTQUxlLEVBS0hDLDhCQUxHLG1DQU1yQlQsaUJBQU1VLGNBTmUsRUFNRUMsNkJBTkYsbUNBT3JCWCxpQkFBTVksWUFQZSxFQU9BQywyQkFQQSxtQkFBeEI7QUFVQSxJQUFNQyxZQUFZLEdBQUc7QUFDbkJDLEVBQUFBLElBQUksRUFBRWYsaUJBQU1DLFNBRE87QUFFbkJlLEVBQUFBLGlCQUFpQixFQUFFLElBRkE7QUFHbkJDLEVBQUFBLFdBQVcsRUFBRSxDQUhNO0FBSW5CQyxFQUFBQSxrQkFBa0IsRUFBRUMseUJBSkQ7QUFLbkJDLEVBQUFBLGVBQWUsRUFBRUMsc0JBTEU7QUFNbkJDLEVBQUFBLGVBQWUsRUFBRSxRQU5FO0FBT25CQyxFQUFBQSxrQkFBa0IsRUFBRSxRQVBEO0FBUW5CQyxFQUFBQSxRQUFRLEVBQUUsb0JBQU0sQ0FBRTtBQVJDLENBQXJCO0FBV0EsSUFBTUMsWUFBWSxHQUFHO0FBQ25CQyxFQUFBQSxpQkFBaUIsRUFBRSxJQUFJQyxxQ0FBSixDQUErQjtBQUNoREMsSUFBQUEsSUFBSSxFQUFFLG1CQUQwQztBQUVoREMsSUFBQUEsUUFBUSxF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QVEsQ0FBQ3FDLE1BQVQsSUFBbUIsQ0FBaEMsSUFBcUNyQyxRQUFRLENBQUNzQyxLQUFULElBQWtCLENBQTNELEVBQThEO0FBQzVELGlCQUFPLElBQVA7QUFDRDs7QUFFRCxlQUFPSCxLQUFQO0FBQ0QsT0FWSCxDQURGO0FBY0Q7Ozs7RUE5VnNDSSxnQjs7OztnQkFBcEJoRyxXLGtCQUNHeEIsWTs7QUFnV3hCd0IsV0FBVyxDQUFDaUcsV0FBWixHQUEwQixhQUExQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5pbXBvcnQgeyBfTWFwQ29udGV4dCBhcyBNYXBDb250ZXh0IH0gZnJvbSAncmVhY3QtbWFwLWdsJztcbmltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbiB9IGZyb20gJ0BuZWJ1bGEuZ2wvZWRpdC1tb2Rlcyc7XG5cbmltcG9ydCB0eXBlIHsgUG9zaXRpb24sIEVkaXRBY3Rpb24gfSBmcm9tICdAbmVidWxhLmdsL2VkaXQtbW9kZXMnO1xuaW1wb3J0IHR5cGUgeyBNam9sbmlyRXZlbnQgfSBmcm9tICdtam9sbmlyLmpzJztcbmltcG9ydCB0eXBlIHsgQmFzZUV2ZW50LCBFZGl0b3JQcm9wcywgRWRpdG9yU3RhdGUsIE1vZGUgfSBmcm9tICcuL3R5cGVzJztcblxuaW1wb3J0IHsgRFJBV0lOR19NT0RFLCBFRElUX1RZUEUsIE1PREVTIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuaW1wb3J0IHsgZ2V0U2NyZWVuQ29vcmRzLCBpc051bWVyaWMsIHBhcnNlRXZlbnRFbGVtZW50IH0gZnJvbSAnLi9lZGl0LW1vZGVzL3V0aWxzJztcbmltcG9ydCB7XG4gIEJhc2VNb2RlLFxuICBFZGl0aW5nTW9kZSxcbiAgRHJhd1BvaW50TW9kZSxcbiAgRHJhd0xpbmVTdHJpbmdNb2RlLFxuICBEcmF3UmVjdGFuZ2xlTW9kZSxcbiAgRHJhd1BvbHlnb25Nb2RlXG59IGZyb20gJy4vZWRpdC1tb2Rlcyc7XG5pbXBvcnQge1xuICBnZXRFZGl0SGFuZGxlU3R5bGUgYXMgZGVmYXVsdEdldEVkaXRIYW5kbGVTdHlsZSxcbiAgZ2V0RmVhdHVyZVN0eWxlIGFzIGRlZmF1bHRHZXRGZWF0dXJlU3R5bGVcbn0gZnJvbSAnLi9zdHlsZSc7XG5cbmNvbnN0IE1PREVfVE9fSEFORExFUiA9IE9iamVjdC5mcmVlemUoe1xuICBbTU9ERVMuUkVBRF9PTkxZXTogbnVsbCxcbiAgW01PREVTLlNFTEVDVF06IEJhc2VNb2RlLFxuICBbTU9ERVMuRURJVElOR106IEVkaXRpbmdNb2RlLFxuICBbTU9ERVMuRFJBV19QT0lOVF06IERyYXdQb2ludE1vZGUsXG4gIFtNT0RFUy5EUkFXX1BBVEhdOiBEcmF3TGluZVN0cmluZ01vZGUsXG4gIFtNT0RFUy5EUkFXX1JFQ1RBTkdMRV06IERyYXdSZWN0YW5nbGVNb2RlLFxuICBbTU9ERVMuRFJBV19QT0xZR09OXTogRHJhd1BvbHlnb25Nb2RlXG59KTtcblxuY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICBtb2RlOiBNT0RFUy5SRUFEX09OTFksXG4gIHNlbGVjdGVkRmVhdHVyZUlkOiBudWxsLFxuICBjbGlja1JhZGl1czogMCxcbiAgZ2V0RWRpdEhhbmRsZVN0eWxlOiBkZWZhdWx0R2V0RWRpdEhhbmRsZVN0eWxlLFxuICBnZXRGZWF0dXJlU3R5bGU6IGRlZmF1bHRHZXRGZWF0dXJlU3R5bGUsXG4gIGdldEZlYXR1cmVTaGFwZTogJ2NpcmNsZScsXG4gIGdldEVkaXRIYW5kbGVTaGFwZTogJ2NpcmNsZScsXG4gIG9uU2VsZWN0OiAoKSA9PiB7fVxufTtcblxuY29uc3QgZGVmYXVsdFN0YXRlID0ge1xuICBmZWF0dXJlQ29sbGVjdGlvbjogbmV3IEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uKHtcbiAgICB0eXBlOiAnRmVhdHVyZUNvbGxlY3Rpb24nLFxuICAgIGZlYXR1cmVzOiBbXVxuICB9KSxcblxuICBzZWxlY3RlZEZlYXR1cmVJbmRleDogbnVsbCxcbiAgc2VsZWN0ZWRGZWF0dXJlSWQ6IG51bGwsXG5cbiAgLy8gaW5kZXgsIGlzR3VpZGUsIG1hcENvb3Jkcywgc2NyZWVuQ29vcmRzXG4gIGhvdmVyZWQ6IG51bGwsXG5cbiAgaXNEcmFnZ2luZzogZmFsc2UsXG4gIGRpZERyYWc6IGZhbHNlLFxuXG4gIGxhc3RQb2ludGVyTW92ZUV2ZW50OiBudWxsLFxuXG4gIHBvaW50ZXJEb3duUGlja3M6IG51bGwsXG4gIHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzOiBudWxsLFxuICBwb2ludGVyRG93bk1hcENvb3JkczogbnVsbFxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTW9kZUhhbmRsZXIgZXh0ZW5kcyBDb21wb25lbnQ8RWRpdG9yUHJvcHMsIEVkaXRvclN0YXRlPiB7XG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSBkZWZhdWx0UHJvcHM7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnN0YXRlID0gZGVmYXVsdFN0YXRlO1xuICAgIHRoaXMuX2V2ZW50c1JlZ2lzdGVyZWQgPSBmYWxzZTtcblxuICAgIHRoaXMuX2V2ZW50cyA9IHtcbiAgICAgIGFueWNsaWNrOiBldnQgPT4gdGhpcy5fb25FdmVudCh0aGlzLl9vbkNsaWNrLCBldnQsIHRydWUpLFxuICAgICAgY2xpY2s6IGV2dCA9PiBldnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCksXG4gICAgICBwb2ludGVybW92ZTogZXZ0ID0+IHRoaXMuX29uRXZlbnQodGhpcy5fb25Qb2ludGVyTW92ZSwgZXZ0LCB0cnVlKSxcbiAgICAgIHBvaW50ZXJkb3duOiBldnQgPT4gdGhpcy5fb25FdmVudCh0aGlzLl9vblBvaW50ZXJEb3duLCBldnQsIHRydWUpLFxuICAgICAgcG9pbnRlcnVwOiBldnQgPT4gdGhpcy5fb25FdmVudCh0aGlzLl9vblBvaW50ZXJVcCwgZXZ0LCB0cnVlKSxcbiAgICAgIHBhbm1vdmU6IGV2dCA9PiB0aGlzLl9vbkV2ZW50KHRoaXMuX29uUGFuLCBldnQsIGZhbHNlKSxcbiAgICAgIHBhbnN0YXJ0OiBldnQgPT4gdGhpcy5fb25FdmVudCh0aGlzLl9vblBhbiwgZXZ0LCBmYWxzZSksXG4gICAgICBwYW5lbmQ6IGV2dCA9PiB0aGlzLl9vbkV2ZW50KHRoaXMuX29uUGFuLCBldnQsIGZhbHNlKVxuICAgIH07XG4gIH1cblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wczogRWRpdG9yUHJvcHMsIG5leHRDb250ZXh0OiBhbnkpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5tb2RlICE9PSBuZXh0UHJvcHMubW9kZSkge1xuICAgICAgdGhpcy5fY2xlYXJFZGl0aW5nU3RhdGUoKTtcblxuICAgICAgaWYgKHRoaXMuX2V2ZW50c1JlZ2lzdGVyZWQgJiYgKCFuZXh0UHJvcHMubW9kZSB8fCBuZXh0UHJvcHMubW9kZSA9PT0gTU9ERVMuUkVBRF9PTkxZKSkge1xuICAgICAgICB0aGlzLl9kZWdyZWdpc3RlckV2ZW50cygpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMuX2V2ZW50c1JlZ2lzdGVyZWQgJiYgbmV4dFByb3BzLm1vZGUgJiYgbmV4dFByb3BzLm1vZGUgIT09IE1PREVTLlJFQURfT05MWSkge1xuICAgICAgICB0aGlzLl9yZWdpc3RlckV2ZW50cygpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9zZXR1cE1vZGVIYW5kbGVyKG5leHRQcm9wcy5tb2RlKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy5mZWF0dXJlcyAhPT0gbmV4dFByb3BzLmZlYXR1cmVzKSB7XG4gICAgICBsZXQgZmVhdHVyZUNvbGxlY3Rpb24gPSBuZXh0UHJvcHMuZmVhdHVyZXM7XG5cbiAgICAgIGlmIChuZXh0UHJvcHMuZmVhdHVyZXMgJiYgQXJyYXkuaXNBcnJheShuZXh0UHJvcHMuZmVhdHVyZXMpKSB7XG4gICAgICAgIGZlYXR1cmVDb2xsZWN0aW9uID0ge1xuICAgICAgICAgIHR5cGU6ICdGZWF0dXJlQ29sbGVjdGlvbicsXG4gICAgICAgICAgZmVhdHVyZXM6IG5leHRQcm9wcy5mZWF0dXJlc1xuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBmZWF0dXJlQ29sbGVjdGlvbiA9IG5ldyBJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbihmZWF0dXJlQ29sbGVjdGlvbik7XG5cbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBmZWF0dXJlQ29sbGVjdGlvblxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMuc2VsZWN0ZWRGZWF0dXJlSWQgIT09IG5leHRQcm9wcy5zZWxlY3RlZEZlYXR1cmVJZCkge1xuICAgICAgdGhpcy5fY2xlYXJFZGl0aW5nU3RhdGUoKTtcbiAgICAgIGNvbnN0IGZlYXR1cmVzID0gdGhpcy5nZXRGZWF0dXJlcygpO1xuICAgICAgY29uc3Qgc2VsZWN0ZWRGZWF0dXJlSW5kZXggPVxuICAgICAgICBmZWF0dXJlcyAmJiBmZWF0dXJlcy5maW5kSW5kZXgoZiA9PiBmLnByb3BlcnRpZXMuaWQgPT09IG5leHRQcm9wcy5zZWxlY3RlZEZlYXR1cmVJZCk7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgc2VsZWN0ZWRGZWF0dXJlSWQ6IG5leHRQcm9wcy5zZWxlY3RlZEZlYXR1cmVJZCxcbiAgICAgICAgc2VsZWN0ZWRGZWF0dXJlSW5kZXg6IGlzTnVtZXJpYyhzZWxlY3RlZEZlYXR1cmVJbmRleCkgPyBzZWxlY3RlZEZlYXR1cmVJbmRleCA6IG51bGxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHRoaXMuX2RlZ3JlZ2lzdGVyRXZlbnRzKCk7XG4gIH1cblxuICBfZXZlbnRzOiBhbnk7XG4gIF9ldmVudHNSZWdpc3RlcmVkOiBib29sZWFuO1xuICBfbW9kZUhhbmRsZXI6IGFueTtcbiAgX2NvbnRleHQ6ID9NYXBDb250ZXh0O1xuICBfY29udGFpbmVyUmVmOiA/SFRNTEVsZW1lbnQ7XG5cbiAgZ2V0RmVhdHVyZXMgPSAoKSA9PiB7XG4gICAgbGV0IGZlYXR1cmVDb2xsZWN0aW9uID0gdGhpcy5zdGF0ZS5mZWF0dXJlQ29sbGVjdGlvbjtcbiAgICBmZWF0dXJlQ29sbGVjdGlvbiA9IGZlYXR1cmVDb2xsZWN0aW9uICYmIGZlYXR1cmVDb2xsZWN0aW9uLmdldE9iamVjdCgpO1xuICAgIHJldHVybiBmZWF0dXJlQ29sbGVjdGlvbiAmJiBmZWF0dXJlQ29sbGVjdGlvbi5mZWF0dXJlcztcbiAgfTtcblxuICBnZXRNb2RlUHJvcHMoKSB7XG4gICAgY29uc3QgeyBzZWxlY3RlZEZlYXR1cmVJbmRleCwgbGFzdFBvaW50ZXJNb3ZlRXZlbnQsIGZlYXR1cmVDb2xsZWN0aW9uIH0gPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IHZpZXdwb3J0ID0gdGhpcy5fY29udGV4dCAmJiB0aGlzLl9jb250ZXh0LnZpZXdwb3J0O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGRhdGE6IGZlYXR1cmVDb2xsZWN0aW9uLFxuICAgICAgc2VsZWN0ZWRJbmRleGVzOiBbc2VsZWN0ZWRGZWF0dXJlSW5kZXhdLFxuICAgICAgbGFzdFBvaW50ZXJNb3ZlRXZlbnQsXG4gICAgICB2aWV3cG9ydCxcbiAgICAgIG9uRWRpdDogdGhpcy5fb25FZGl0XG4gICAgfTtcbiAgfVxuXG4gIF9zZXR1cE1vZGVIYW5kbGVyID0gKG1vZGU6IE1vZGUpID0+IHtcbiAgICBpZiAobW9kZSA9PT0gTU9ERVMuUkVBRF9PTkxZKSB7XG4gICAgICB0aGlzLl9tb2RlSGFuZGxlciA9IG51bGw7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgSGFuZGxlckNsYXNzID0gTU9ERV9UT19IQU5ETEVSW21vZGVdO1xuICAgIGlmIChIYW5kbGVyQ2xhc3MpIHtcbiAgICAgIHRoaXMuX21vZGVIYW5kbGVyID0gbmV3IEhhbmRsZXJDbGFzcygpO1xuICAgIH1cbiAgfTtcblxuICBfY2xlYXJFZGl0aW5nU3RhdGUgPSAoKSA9PiB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBob3ZlcmVkOiBudWxsLFxuXG4gICAgICBwb2ludGVyRG93blBpY2tzOiBudWxsLFxuICAgICAgcG9pbnRlckRvd25TY3JlZW5Db29yZHM6IG51bGwsXG4gICAgICBwb2ludGVyRG93bk1hcENvb3JkczogbnVsbCxcblxuICAgICAgaXNEcmFnZ2luZzogZmFsc2UsXG4gICAgICBkaWREcmFnOiBmYWxzZVxuICAgIH0pO1xuICB9O1xuXG4gIF9vbkVkaXQgPSAoZWRpdEFjdGlvbjogRWRpdEFjdGlvbikgPT4ge1xuICAgIGNvbnN0IHsgbW9kZSwgb25TZWxlY3QsIG9uVXBkYXRlIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHsgZWRpdFR5cGUsIHVwZGF0ZWREYXRhIH0gPSBlZGl0QWN0aW9uO1xuXG4gICAgc3dpdGNoIChlZGl0VHlwZSkge1xuICAgICAgY2FzZSBFRElUX1RZUEUuTU9WRV9QT1NJVElPTjpcbiAgICAgICAgLy8gaW50ZXJtZWRpYXRlIGZlYXR1cmUsIGRvIG5vdCBuZWVkIGZvcndhcmQgdG8gYXBwbGljYXRpb25cbiAgICAgICAgLy8gdXBkYXRlIGVkaXRvciBzdGF0ZVxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBmZWF0dXJlQ29sbGVjdGlvbjogbmV3IEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uKHVwZGF0ZWREYXRhKVxuICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEVESVRfVFlQRS5BRERfRkVBVFVSRTpcbiAgICAgICAgb25VcGRhdGUodXBkYXRlZERhdGEgJiYgdXBkYXRlZERhdGEuZmVhdHVyZXMpO1xuICAgICAgICBpZiAobW9kZSA9PT0gTU9ERVMuRFJBV19QQVRIKSB7XG4gICAgICAgICAgY29uc3QgZmVhdHVyZUluZGV4ID0gdXBkYXRlZERhdGEuZmVhdHVyZXMubGVuZ3RoIC0gMTtcbiAgICAgICAgICBjb25zdCBmZWF0dXJlID0gdXBkYXRlZERhdGEuZmVhdHVyZXNbZmVhdHVyZUluZGV4XTtcblxuICAgICAgICAgIC8vIFRPRE8gZGVwcmVjYXRlIHNlbGVjdGVkRmVhdHVyZUlkXG4gICAgICAgICAgb25TZWxlY3Qoe1xuICAgICAgICAgICAgc2VsZWN0ZWRGZWF0dXJlSWQ6IGZlYXR1cmUucHJvcGVydGllcy5pZCxcbiAgICAgICAgICAgIHNlbGVjdGVkRmVhdHVyZUluZGV4OiBmZWF0dXJlSW5kZXhcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvblNlbGVjdCh7XG4gICAgICAgICAgICBzZWxlY3RlZEZlYXR1cmVJZDogbnVsbCxcbiAgICAgICAgICAgIHNlbGVjdGVkRmVhdHVyZUluZGV4OiBudWxsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEVESVRfVFlQRS5BRERfUE9TSVRJT046XG4gICAgICBjYXNlIEVESVRfVFlQRS5SRU1PVkVfUE9TSVRJT046XG4gICAgICBjYXNlIEVESVRfVFlQRS5GSU5JU0hfTU9WRV9QT1NJVElPTjpcbiAgICAgICAgb25VcGRhdGUodXBkYXRlZERhdGEgJiYgdXBkYXRlZERhdGEuZmVhdHVyZXMpO1xuICAgICAgICBicmVhaztcblxuICAgICAgZGVmYXVsdDpcbiAgICB9XG4gIH07XG5cbiAgLyogRVZFTlRTICovXG4gIF9kZWdyZWdpc3RlckV2ZW50cyA9ICgpID0+IHtcbiAgICBjb25zdCBldmVudE1hbmFnZXIgPSB0aGlzLl9jb250ZXh0ICYmIHRoaXMuX2NvbnRleHQuZXZlbnRNYW5hZ2VyO1xuICAgIGlmICghdGhpcy5fZXZlbnRzIHx8ICFldmVudE1hbmFnZXIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZXZlbnRNYW5hZ2VyLm9mZih0aGlzLl9ldmVudHMpO1xuICAgIHRoaXMuX2V2ZW50c1JlZ2lzdGVyZWQgPSBmYWxzZTtcbiAgfTtcblxuICBfcmVnaXN0ZXJFdmVudHMgPSAoKSA9PiB7XG4gICAgY29uc3QgcmVmID0gdGhpcy5fY29udGFpbmVyUmVmO1xuICAgIGNvbnN0IGV2ZW50TWFuYWdlciA9IHRoaXMuX2NvbnRleHQgJiYgdGhpcy5fY29udGV4dC5ldmVudE1hbmFnZXI7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXJlZiB8fCAhZXZlbnRNYW5hZ2VyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGV2ZW50TWFuYWdlci5vbih0aGlzLl9ldmVudHMsIHJlZik7XG4gICAgdGhpcy5fZXZlbnRzUmVnaXN0ZXJlZCA9IHRydWU7XG4gIH07XG5cbiAgX29uRXZlbnQgPSAoaGFuZGxlcjogRnVuY3Rpb24sIGV2dDogTWpvbG5pckV2ZW50LCBzdG9wUHJvcGFnYXRpb246IGJvb2xlYW4pID0+IHtcbiAgICBjb25zdCBldmVudCA9IHRoaXMuX2dldEV2ZW50KGV2dCk7XG4gICAgaGFuZGxlcihldmVudCk7XG5cbiAgICBpZiAoc3RvcFByb3BhZ2F0aW9uKSB7XG4gICAgICBldnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgfVxuICB9O1xuXG4gIF9vbkNsaWNrID0gKGV2ZW50OiBCYXNlRXZlbnQpID0+IHtcbiAgICBjb25zdCB7IG1vZGUgfSA9IHRoaXMucHJvcHM7XG4gICAgaWYgKG1vZGUgPT09IE1PREVTLlNFTEVDVCB8fCBtb2RlID09PSBNT0RFUy5FRElUSU5HKSB7XG4gICAgICBjb25zdCB7IG9uU2VsZWN0IH0gPSB0aGlzLnByb3BzO1xuICAgICAgY29uc3QgcGlja2VkT2JqZWN0ID0gZXZlbnQucGlja3MgJiYgZXZlbnQucGlja3NbMF0gJiYgZXZlbnQucGlja3NbMF0ub2JqZWN0O1xuICAgICAgaWYgKHBpY2tlZE9iamVjdCAmJiBpc051bWVyaWMocGlja2VkT2JqZWN0LmZlYXR1cmVJbmRleCkpIHtcbiAgICAgICAgY29uc3QgZmVhdHVyZXMgPSB0aGlzLmdldEZlYXR1cmVzKCk7XG4gICAgICAgIGNvbnN0IGZlYXR1cmUgPSBmZWF0dXJlcyAmJiBmZWF0dXJlc1twaWNrZWRPYmplY3QuZmVhdHVyZUluZGV4XTtcbiAgICAgICAgb25TZWxlY3Qoe1xuICAgICAgICAgIHNlbGVjdGVkRmVhdHVyZUluZGV4OiBwaWNrZWRPYmplY3QuZmVhdHVyZUluZGV4LFxuICAgICAgICAgIHNlbGVjdGVkRmVhdHVyZUlkOiBmZWF0dXJlICYmIGZlYXR1cmUucHJvcGVydGllcy5pZFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS5zZWxlY3RlZEZlYXR1cmVJZCkge1xuICAgICAgICBvblNlbGVjdCh7XG4gICAgICAgICAgc2VsZWN0ZWRGZWF0dXJlSW5kZXg6IG51bGwsXG4gICAgICAgICAgc2VsZWN0ZWRGZWF0dXJlSWQ6IG51bGxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgbW9kZVByb3BzID0gdGhpcy5nZXRNb2RlUHJvcHMoKTtcbiAgICB0aGlzLl9tb2RlSGFuZGxlci5oYW5kbGVDbGljayhldmVudCwgbW9kZVByb3BzKTtcbiAgfTtcblxuICBfb25Qb2ludGVyTW92ZSA9IChldmVudDogQmFzZUV2ZW50KSA9PiB7XG4gICAgLy8gaG92ZXJpbmdcbiAgICBjb25zdCBob3ZlcmVkID0gdGhpcy5fZ2V0SG92ZXJTdGF0ZShldmVudCk7XG4gICAgY29uc3Qge1xuICAgICAgaXNEcmFnZ2luZyxcbiAgICAgIGRpZERyYWcsXG4gICAgICBwb2ludGVyRG93blBpY2tzLFxuICAgICAgcG9pbnRlckRvd25TY3JlZW5Db29yZHMsXG4gICAgICBwb2ludGVyRG93bk1hcENvb3Jkc1xuICAgIH0gPSB0aGlzLnN0YXRlO1xuXG4gICAgaWYgKGlzRHJhZ2dpbmcgJiYgIWRpZERyYWcgJiYgcG9pbnRlckRvd25TY3JlZW5Db29yZHMpIHtcbiAgICAgIGNvbnN0IGR4ID0gZXZlbnQuc2NyZWVuQ29vcmRzWzBdIC0gcG9pbnRlckRvd25TY3JlZW5Db29yZHNbMF07XG4gICAgICBjb25zdCBkeSA9IGV2ZW50LnNjcmVlbkNvb3Jkc1sxXSAtIHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzWzFdO1xuICAgICAgaWYgKGR4ICogZHggKyBkeSAqIGR5ID4gNSkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHsgZGlkRHJhZzogdHJ1ZSB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBwb2ludGVyTW92ZUV2ZW50ID0ge1xuICAgICAgLi4uZXZlbnQsXG4gICAgICBpc0RyYWdnaW5nLFxuICAgICAgcG9pbnRlckRvd25QaWNrcyxcbiAgICAgIHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzLFxuICAgICAgcG9pbnRlckRvd25NYXBDb29yZHNcbiAgICB9O1xuXG4gICAgaWYgKHRoaXMuc3RhdGUuZGlkRHJhZykge1xuICAgICAgY29uc3QgbW9kZVByb3BzID0gdGhpcy5nZXRNb2RlUHJvcHMoKTtcbiAgICAgIHRoaXMuX21vZGVIYW5kbGVyLmhhbmRsZVBvaW50ZXJNb3ZlKHBvaW50ZXJNb3ZlRXZlbnQsIG1vZGVQcm9wcyk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBob3ZlcmVkLFxuICAgICAgbGFzdFBvaW50ZXJNb3ZlRXZlbnQ6IHBvaW50ZXJNb3ZlRXZlbnRcbiAgICB9KTtcbiAgfTtcblxuICBfb25Qb2ludGVyRG93biA9IChldmVudDogQmFzZUV2ZW50KSA9PiB7XG4gICAgY29uc3QgcGlja2VkT2JqZWN0ID0gZXZlbnQucGlja3MgJiYgZXZlbnQucGlja3NbMF0gJiYgZXZlbnQucGlja3NbMF0ub2JqZWN0O1xuICAgIGNvbnN0IHN0YXJ0RHJhZ2dpbmdFdmVudCA9IHtcbiAgICAgIC4uLmV2ZW50LFxuICAgICAgcG9pbnRlckRvd25TY3JlZW5Db29yZHM6IGV2ZW50LnNjcmVlbkNvb3JkcyxcbiAgICAgIHBvaW50ZXJEb3duTWFwQ29vcmRzOiBldmVudC5tYXBDb29yZHNcbiAgICB9O1xuXG4gICAgY29uc3QgbmV3U3RhdGUgPSB7XG4gICAgICBpc0RyYWdnaW5nOiBwaWNrZWRPYmplY3QgJiYgaXNOdW1lcmljKHBpY2tlZE9iamVjdC5mZWF0dXJlSW5kZXgpLFxuICAgICAgcG9pbnRlckRvd25QaWNrczogZXZlbnQucGlja3MsXG4gICAgICBwb2ludGVyRG93blNjcmVlbkNvb3JkczogZXZlbnQuc2NyZWVuQ29vcmRzLFxuICAgICAgcG9pbnRlckRvd25NYXBDb29yZHM6IGV2ZW50Lm1hcENvb3Jkc1xuICAgIH07XG5cbiAgICB0aGlzLnNldFN0YXRlKG5ld1N0YXRlKTtcblxuICAgIGNvbnN0IG1vZGVQcm9wcyA9IHRoaXMuZ2V0TW9kZVByb3BzKCk7XG4gICAgdGhpcy5fbW9kZUhhbmRsZXIuaGFuZGxlU3RhcnREcmFnZ2luZyhzdGFydERyYWdnaW5nRXZlbnQsIG1vZGVQcm9wcyk7XG4gIH07XG5cbiAgX29uUG9pbnRlclVwID0gKGV2ZW50OiBNam9sbmlyRXZlbnQpID0+IHtcbiAgICBjb25zdCBzdG9wRHJhZ2dpbmdFdmVudCA9IHtcbiAgICAgIC4uLmV2ZW50LFxuICAgICAgcG9pbnRlckRvd25TY3JlZW5Db29yZHM6IHRoaXMuc3RhdGUucG9pbnRlckRvd25TY3JlZW5Db29yZHMsXG4gICAgICBwb2ludGVyRG93bk1hcENvb3JkczogdGhpcy5zdGF0ZS5wb2ludGVyRG93bk1hcENvb3Jkc1xuICAgIH07XG5cbiAgICBjb25zdCBuZXdTdGF0ZSA9IHtcbiAgICAgIGlzRHJhZ2dpbmc6IGZhbHNlLFxuICAgICAgZGlkRHJhZzogZmFsc2UsXG4gICAgICBwb2ludGVyRG93blBpY2tzOiBudWxsLFxuICAgICAgcG9pbnRlckRvd25TY3JlZW5Db29yZHM6IG51bGwsXG4gICAgICBwb2ludGVyRG93bk1hcENvb3JkczogbnVsbFxuICAgIH07XG5cbiAgICB0aGlzLnNldFN0YXRlKG5ld1N0YXRlKTtcblxuICAgIGNvbnN0IG1vZGVQcm9wcyA9IHRoaXMuZ2V0TW9kZVByb3BzKCk7XG4gICAgdGhpcy5fbW9kZUhhbmRsZXIuaGFuZGxlU3RvcERyYWdnaW5nKHN0b3BEcmFnZ2luZ0V2ZW50LCBtb2RlUHJvcHMpO1xuICB9O1xuXG4gIF9vblBhbiA9IChldmVudDogQmFzZUV2ZW50KSA9PiB7XG4gICAgY29uc3QgeyBpc0RyYWdnaW5nIH0gPSB0aGlzLnN0YXRlO1xuICAgIGlmIChpc0RyYWdnaW5nKSB7XG4gICAgICBldmVudC5zb3VyY2VFdmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICB9XG4gIH07XG5cbiAgLyogSEVMUEVSUyAqL1xuICBwcm9qZWN0ID0gKHB0OiBQb3NpdGlvbikgPT4ge1xuICAgIGNvbnN0IHZpZXdwb3J0ID0gdGhpcy5fY29udGV4dCAmJiB0aGlzLl9jb250ZXh0LnZpZXdwb3J0O1xuICAgIHJldHVybiB2aWV3cG9ydCAmJiB2aWV3cG9ydC5wcm9qZWN0KHB0KTtcbiAgfTtcblxuICB1bnByb2plY3QgPSAocHQ6IFBvc2l0aW9uKSA9PiB7XG4gICAgY29uc3Qgdmlld3BvcnQgPSB0aGlzLl9jb250ZXh0ICYmIHRoaXMuX2NvbnRleHQudmlld3BvcnQ7XG4gICAgcmV0dXJuIHZpZXdwb3J0ICYmIHZpZXdwb3J0LnVucHJvamVjdChwdCk7XG4gIH07XG5cbiAgX2dldEV2ZW50KGV2dDogTWpvbG5pckV2ZW50KSB7XG4gICAgY29uc3QgcGlja2VkID0gcGFyc2VFdmVudEVsZW1lbnQoZXZ0KTtcbiAgICBjb25zdCBzY3JlZW5Db29yZHMgPSBnZXRTY3JlZW5Db29yZHMoZXZ0KTtcbiAgICBjb25zdCBtYXBDb29yZHMgPSB0aGlzLnVucHJvamVjdChzY3JlZW5Db29yZHMpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHBpY2tzOiBwaWNrZWQgPyBbcGlja2VkXSA6IG51bGwsXG4gICAgICBzY3JlZW5Db29yZHMsXG4gICAgICBtYXBDb29yZHMsXG4gICAgICBzb3VyY2VFdmVudDogZXZ0XG4gICAgfTtcbiAgfVxuXG4gIF9nZXRIb3ZlclN0YXRlID0gKGV2ZW50OiBCYXNlRXZlbnQpID0+IHtcbiAgICBpZiAodGhpcy5faXNEcmF3aW5nKCkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBldmVudC5waWNrcyAmJiBldmVudC5waWNrc1swXSAmJiBldmVudC5waWNrc1swXS5vYmplY3Q7XG4gIH07XG5cbiAgX2lzRHJhd2luZygpIHtcbiAgICBjb25zdCB7IG1vZGUgfSA9IHRoaXMucHJvcHM7XG4gICAgcmV0dXJuIERSQVdJTkdfTU9ERS5maW5kSW5kZXgobSA9PiBtID09PSBtb2RlKSA+PSAwO1xuICB9XG5cbiAgcmVuZGVyKGNoaWxkOiBhbnkpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPE1hcENvbnRleHQuQ29uc3VtZXI+XG4gICAgICAgIHtjb250ZXh0ID0+IHtcbiAgICAgICAgICB0aGlzLl9jb250ZXh0ID0gY29udGV4dDtcbiAgICAgICAgICBjb25zdCB2aWV3cG9ydCA9IGNvbnRleHQgJiYgY29udGV4dC52aWV3cG9ydDtcblxuICAgICAgICAgIGlmICghdmlld3BvcnQgfHwgdmlld3BvcnQuaGVpZ2h0IDw9IDAgfHwgdmlld3BvcnQud2lkdGggPD0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIGNoaWxkO1xuICAgICAgICB9fVxuICAgICAgPC9NYXBDb250ZXh0LkNvbnN1bWVyPlxuICAgICk7XG4gIH1cbn1cblxuTW9kZUhhbmRsZXIuZGlzcGxheU5hbWUgPSAnTW9kZUhhbmRsZXInO1xuIl19