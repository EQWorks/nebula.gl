"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _constants = require("./constants");

var _modeHandler = _interopRequireDefault(require("./mode-handler"));

var _utils = require("./edit-modes/utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Editor =
/*#__PURE__*/
function (_ModeHandler) {
  _inherits(Editor, _ModeHandler);

  function Editor() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, Editor);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Editor)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_getEditHandleState", function (editHandle, renderState) {
      var _this$state = _this.state,
          pointerDownPicks = _this$state.pointerDownPicks,
          hovered = _this$state.hovered;

      if (renderState) {
        return renderState;
      }

      var editHandleIndex = editHandle.properties.positionIndexes[0];
      var draggingEditHandleIndex = null;
      var pickedObject = pointerDownPicks && pointerDownPicks[0] && pointerDownPicks[0].object;

      if (pickedObject && pickedObject.guideType === _constants.GUIDE_TYPE.EDIT_HANDLE) {
        draggingEditHandleIndex = pickedObject.index;
      }

      if (editHandleIndex === draggingEditHandleIndex) {
        return _constants.RENDER_STATE.SELECTED;
      }

      if (hovered && hovered.type === _constants.ELEMENT_TYPE.EDIT_HANDLE && hovered.index === editHandleIndex) {
        return _constants.RENDER_STATE.HOVERED;
      }

      return _constants.RENDER_STATE.INACTIVE;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_getFeatureRenderState", function (index, renderState) {
      var _this$state2 = _this.state,
          selectedFeatureIndex = _this$state2.selectedFeatureIndex,
          hovered = _this$state2.hovered;

      if (renderState) {
        return renderState;
      }

      if (index === selectedFeatureIndex) {
        return _constants.RENDER_STATE.SELECTED;
      }

      if (hovered && hovered.type === _constants.ELEMENT_TYPE.FEATURE && hovered.featureIndex === index) {
        return _constants.RENDER_STATE.HOVERED;
      }

      return _constants.RENDER_STATE.INACTIVE;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_renderEditHandle", function (editHandle, feature) {
      /* eslint-enable max-params */
      var coordinates = (0, _utils.getFeatureCoordinates)(editHandle);

      var p = _this.project(coordinates && coordinates[0]);

      if (!p) {
        return null;
      }

      var _editHandle$propertie = editHandle.properties,
          featureIndex = _editHandle$propertie.featureIndex,
          positionIndexes = _editHandle$propertie.positionIndexes;
      var _this$props = _this.props,
          clickRadius = _this$props.clickRadius,
          getEditHandleShape = _this$props.getEditHandleShape,
          getEditHandleStyle = _this$props.getEditHandleStyle;
      var index = positionIndexes[0];
      var shape = typeof getEditHandleShape === 'function' ? getEditHandleShape({
        feature: feature || editHandle,
        index: index,
        featureIndex: featureIndex
      }) : getEditHandleShape;
      var style = getEditHandleStyle({
        feature: feature || editHandle,
        index: index,
        state: _this._getEditHandleState(editHandle)
      }); // disable events for cursor editHandle

      if (editHandle.properties.guideType === _constants.GUIDE_TYPE.CURSOR_EDIT_HANDLE) {
        style = _objectSpread({}, style, {
          pointerEvents: 'none'
        });
      }

      var elemKey = "".concat(_constants.ELEMENT_TYPE.EDIT_HANDLE, ".").concat(featureIndex, ".").concat(index); // first <circle|rect> is to make path easily interacted with

      switch (shape) {
        case 'circle':
          return _react.default.createElement("g", {
            key: elemKey,
            transform: "translate(".concat(p[0], ", ").concat(p[1], ")")
          }, _react.default.createElement("circle", {
            "data-type": _constants.ELEMENT_TYPE.EDIT_HANDLE,
            "data-index": index,
            "data-feature-index": featureIndex,
            key: "".concat(elemKey, ".hidden"),
            style: _objectSpread({}, style, {
              stroke: 'none',
              fill: '#000',
              fillOpacity: 0
            }),
            cx: 0,
            cy: 0,
            r: clickRadius
          }), _react.default.createElement("circle", {
            "data-type": _constants.ELEMENT_TYPE.EDIT_HANDLE,
            "data-index": index,
            "data-feature-index": featureIndex,
            key: elemKey,
            style: style,
            cx: 0,
            cy: 0
          }));

        case 'rect':
          return _react.default.createElement("g", {
            key: elemKey,
            transform: "translate(".concat(p[0], ", ").concat(p[1], ")")
          }, _react.default.createElement("rect", {
            "data-type": _constants.ELEMENT_TYPE.EDIT_HANDLE,
            "data-index": index,
            "data-feature-index": featureIndex,
            key: "".concat(elemKey, ".hidden"),
            style: _objectSpread({}, style, {
              height: clickRadius,
              width: clickRadius,
              fill: '#000',
              fillOpacity: 0
            }),
            r: clickRadius
          }), _react.default.createElement("rect", {
            "data-type": _constants.ELEMENT_TYPE.EDIT_HANDLE,
            "data-index": index,
            "data-feature-index": featureIndex,
            key: "".concat(elemKey),
            style: style
          }));

        default:
          return null;
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_renderSegment", function (featureIndex, index, coordinates, style) {
      var path = _this._getPathInScreenCoords(coordinates, _constants.GEOJSON_TYPE.LINE_STRING);

      var radius = style.radius,
          others = _objectWithoutProperties(style, ["radius"]);

      var clickRadius = _this.props.clickRadius;
      var elemKey = "".concat(_constants.ELEMENT_TYPE.SEGMENT, ".").concat(featureIndex, ".").concat(index);
      return _react.default.createElement("g", {
        key: elemKey
      }, _react.default.createElement("path", {
        key: "".concat(elemKey, ".hidden"),
        "data-type": _constants.ELEMENT_TYPE.SEGMENT,
        "data-index": index,
        "data-feature-index": featureIndex,
        style: _objectSpread({}, others, {
          strokeWidth: clickRadius || radius,
          opacity: 0
        }),
        d: path
      }), _react.default.createElement("path", {
        key: elemKey,
        "data-type": _constants.ELEMENT_TYPE.SEGMENT,
        "data-index": index,
        "data-feature-index": featureIndex,
        style: others,
        d: path
      }));
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_renderSegments", function (featureIndex, coordinates, style) {
      var segments = [];

      for (var i = 0; i < coordinates.length - 1; i++) {
        segments.push(_this._renderSegment(featureIndex, i, [coordinates[i], coordinates[i + 1]], style));
      }

      return segments;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_renderFill", function (featureIndex, coordinates, style) {
      var path = _this._getPathInScreenCoords(coordinates, _constants.GEOJSON_TYPE.POLYGON);

      return _react.default.createElement("path", {
        key: "".concat(_constants.ELEMENT_TYPE.FILL, ".").concat(featureIndex),
        "data-type": _constants.ELEMENT_TYPE.FILL,
        "data-feature-index": featureIndex,
        style: _objectSpread({}, style, {
          stroke: 'none'
        }),
        d: path
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_renderTentativeFeature", function (feature, cursorEditHandle) {
      var getFeatureStyle = _this.props.getFeatureStyle;
      var coordinates = feature.geometry.coordinates,
          renderType = feature.properties.renderType;

      if (!coordinates || coordinates.length < 2) {
        return null;
      } // >= 2 coordinates


      var firstCoords = coordinates[0];
      var lastCoords = coordinates[coordinates.length - 1];
      var uncommittedStyle = getFeatureStyle({
        feature: feature,
        state: _constants.RENDER_STATE.UNCOMMITTED
      });
      var committedPath;
      var uncommittedPath;
      var closingPath;

      var fill = _this._renderFill('tentative', coordinates, uncommittedStyle);

      switch (renderType) {
        case _constants.RENDER_TYPE.LINE_STRING:
        case _constants.RENDER_TYPE.POLYGON:
          var committedStyle = getFeatureStyle({
            feature: feature,
            state: _constants.RENDER_STATE.SELECTED
          });

          if (cursorEditHandle) {
            var cursorCoords = coordinates[coordinates.length - 2];
            committedPath = _this._renderSegments('tentative', coordinates.slice(0, coordinates.length - 1), committedStyle);
            uncommittedPath = _this._renderSegment('tentative-uncommitted', coordinates.length - 2, [cursorCoords, lastCoords], uncommittedStyle);
          } else {
            committedPath = _this._renderSegments('tentative', coordinates, committedStyle);
          }

          if (renderType === _constants.RENDER_TYPE.POLYGON) {
            var closingStyle = getFeatureStyle({
              feature: feature,
              state: _constants.RENDER_STATE.CLOSING
            });
            closingPath = _this._renderSegment('tentative-closing', coordinates.length - 1, [lastCoords, firstCoords], closingStyle);
          }

          break;

        case _constants.RENDER_TYPE.RECTANGLE:
          uncommittedPath = _this._renderSegments('tentative', _toConsumableArray(coordinates).concat([firstCoords]), uncommittedStyle);
          break;

        default:
      }

      return [fill, committedPath, uncommittedPath, closingPath].filter(Boolean);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_renderGuides", function (_ref) {
      var tentativeFeature = _ref.tentativeFeature,
          editHandles = _ref.editHandles;

      var features = _this.getFeatures();

      var cursorEditHandle = editHandles.find(function (f) {
        return f.properties.guideType === _constants.GUIDE_TYPE.CURSOR_EDIT_HANDLE;
      });
      return _react.default.createElement("g", {
        key: "feature-guides"
      }, tentativeFeature && _this._renderTentativeFeature(tentativeFeature, cursorEditHandle), editHandles && editHandles.map(function (editHandle) {
        var feature = features && features[editHandle.properties.featureIndex] || tentativeFeature;
        return _this._renderEditHandle(editHandle, feature);
      }));
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_renderPoint", function (feature, index, path) {
      var renderState = _this._getFeatureRenderState(index);

      var _this$props2 = _this.props,
          getFeatureStyle = _this$props2.getFeatureStyle,
          getFeatureShape = _this$props2.getFeatureShape,
          clickRadius = _this$props2.clickRadius;
      var style = getFeatureStyle({
        feature: feature,
        state: renderState
      });
      var shape = typeof getFeatureShape === 'function' ? getFeatureShape({
        feature: feature,
        state: renderState
      }) : getFeatureShape;
      var elemKey = "feature.".concat(index);

      if (shape === 'rect') {
        return _react.default.createElement("g", {
          key: elemKey,
          transform: "translate(".concat(path[0][0], ", ").concat(path[0][1], ")")
        }, _react.default.createElement("rect", {
          "data-type": _constants.ELEMENT_TYPE.FEATURE,
          "data-feature-index": index,
          key: "".concat(elemKey, ".hidden"),
          style: _objectSpread({}, style, {
            width: clickRadius,
            height: clickRadius,
            fill: '#000',
            fillOpacity: 0
          })
        }), _react.default.createElement("rect", {
          "data-type": _constants.ELEMENT_TYPE.FEATURE,
          "data-feature-index": index,
          key: elemKey,
          style: style
        }));
      }

      return _react.default.createElement("g", {
        key: "feature.".concat(index),
        transform: "translate(".concat(path[0][0], ", ").concat(path[0][1], ")")
      }, _react.default.createElement("circle", {
        "data-type": _constants.ELEMENT_TYPE.FEATURE,
        "data-feature-index": index,
        key: "".concat(elemKey, ".hidden"),
        style: _objectSpread({}, style, {
          opacity: 0
        }),
        cx: 0,
        cy: 0,
        r: clickRadius
      }), _react.default.createElement("circle", {
        "data-type": _constants.ELEMENT_TYPE.FEATURE,
        "data-feature-index": index,
        key: elemKey,
        style: style,
        cx: 0,
        cy: 0
      }));
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_renderPath", function (feature, index, path) {
      var _this$props3 = _this.props,
          getFeatureStyle = _this$props3.getFeatureStyle,
          clickRadius = _this$props3.clickRadius;
      var selectedFeatureIndex = _this.state.selectedFeatureIndex;
      var selected = index === selectedFeatureIndex;

      var renderState = _this._getFeatureRenderState(index);

      var style = getFeatureStyle({
        feature: feature,
        state: renderState
      });
      var elemKey = "feature.".concat(index);

      if (selected) {
        return _react.default.createElement("g", {
          key: elemKey
        }, _this._renderSegments(index, feature.geometry.coordinates, style));
      } // first <path> is to make path easily interacted with


      return _react.default.createElement("g", {
        key: elemKey
      }, _react.default.createElement("path", {
        "data-type": _constants.ELEMENT_TYPE.FEATURE,
        "data-feature-index": index,
        key: "".concat(elemKey, ".hidden"),
        style: _objectSpread({}, style, {
          strokeWidth: clickRadius,
          opacity: 0
        }),
        d: path
      }), _react.default.createElement("path", {
        "data-type": _constants.ELEMENT_TYPE.FEATURE,
        "data-feature-index": index,
        key: elemKey,
        style: style,
        d: path
      }));
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_renderPolygon", function (feature, index, path) {
      var getFeatureStyle = _this.props.getFeatureStyle;
      var selectedFeatureIndex = _this.state.selectedFeatureIndex;
      var selected = index === selectedFeatureIndex;

      var renderState = _this._getFeatureRenderState(index);

      var style = getFeatureStyle({
        feature: feature,
        state: renderState
      });
      var elemKey = "feature.".concat(index);

      if (selected) {
        var coordinates = (0, _utils.getFeatureCoordinates)(feature);

        if (!coordinates) {
          return null;
        }

        return _react.default.createElement("g", {
          key: elemKey
        }, _this._renderFill(index, coordinates, style), _this._renderSegments(index, coordinates, style));
      }

      return _react.default.createElement("path", {
        "data-type": _constants.ELEMENT_TYPE.FEATURE,
        "data-feature-index": index,
        key: elemKey,
        style: style,
        d: path
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_renderFeature", function (feature, index) {
      var coordinates = (0, _utils.getFeatureCoordinates)(feature);

      if (!coordinates || !coordinates.length) {
        return null;
      }

      var renderType = feature.properties.renderType,
          type = feature.geometry.type;

      var path = _this._getPathInScreenCoords(coordinates, type);

      if (!path) {
        return null;
      }

      switch (renderType) {
        case _constants.RENDER_TYPE.POINT:
          return _this._renderPoint(feature, index, path);

        case _constants.RENDER_TYPE.LINE_STRING:
          return _this._renderPath(feature, index, path);

        case _constants.RENDER_TYPE.POLYGON:
        case _constants.RENDER_TYPE.RECTANGLE:
          return _this._renderPolygon(feature, index, path);

        default:
          return null;
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_renderCanvas", function () {
      var features = _this.getFeatures();

      var guides = _this._modeHandler && _this._modeHandler.getGuides(_this.getModeProps());

      return _react.default.createElement("svg", {
        key: "draw-canvas",
        width: "100%",
        height: "100%"
      }, features && features.length > 0 && _react.default.createElement("g", {
        key: "feature-group"
      }, features.map(_this._renderFeature)), guides && _react.default.createElement("g", {
        key: "feature-guides"
      }, _this._renderGuides(guides)));
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_renderEditor", function () {
      var viewport = _this._context && _this._context.viewport || {};
      var style = _this.props.style;
      var width = viewport.width,
          height = viewport.height;
      return _react.default.createElement("div", {
        id: "editor",
        style: _objectSpread({
          width: width,
          height: height
        }, style),
        ref: function ref(_) {
          _this._containerRef = _;
        }
      }, _this._renderCanvas());
    });

    return _this;
  }

  _createClass(Editor, [{
    key: "_getPathInScreenCoords",

    /* HELPERS */
    value: function _getPathInScreenCoords(coordinates, type) {
      var _this2 = this;

      if (coordinates.length === 0) {
        return '';
      }

      var screenCoords = coordinates.map(function (p) {
        return _this2.project(p);
      });
      var pathString = '';

      switch (type) {
        case _constants.GEOJSON_TYPE.POINT:
          return screenCoords;

        case _constants.GEOJSON_TYPE.LINE_STRING:
          pathString = screenCoords.map(function (p) {
            return "".concat(p[0], ",").concat(p[1]);
          }).join('L');
          return "M ".concat(pathString);

        case _constants.GEOJSON_TYPE.POLYGON:
          pathString = screenCoords.map(function (p) {
            return "".concat(p[0], ",").concat(p[1]);
          }).join('L');
          return "M ".concat(pathString, " z");

        default:
          return null;
      }
    }
  }, {
    key: "render",
    value: function render() {
      return _get(_getPrototypeOf(Editor.prototype), "render", this).call(this, this._renderEditor());
    }
  }]);

  return Editor;
}(_modeHandler.default);

exports.default = Editor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9lZGl0b3IuanMiXSwibmFtZXMiOlsiRWRpdG9yIiwiZWRpdEhhbmRsZSIsInJlbmRlclN0YXRlIiwic3RhdGUiLCJwb2ludGVyRG93blBpY2tzIiwiaG92ZXJlZCIsImVkaXRIYW5kbGVJbmRleCIsInByb3BlcnRpZXMiLCJwb3NpdGlvbkluZGV4ZXMiLCJkcmFnZ2luZ0VkaXRIYW5kbGVJbmRleCIsInBpY2tlZE9iamVjdCIsIm9iamVjdCIsImd1aWRlVHlwZSIsIkdVSURFX1RZUEUiLCJFRElUX0hBTkRMRSIsImluZGV4IiwiUkVOREVSX1NUQVRFIiwiU0VMRUNURUQiLCJ0eXBlIiwiRUxFTUVOVF9UWVBFIiwiSE9WRVJFRCIsIklOQUNUSVZFIiwic2VsZWN0ZWRGZWF0dXJlSW5kZXgiLCJGRUFUVVJFIiwiZmVhdHVyZUluZGV4IiwiZmVhdHVyZSIsImNvb3JkaW5hdGVzIiwicCIsInByb2plY3QiLCJwcm9wcyIsImNsaWNrUmFkaXVzIiwiZ2V0RWRpdEhhbmRsZVNoYXBlIiwiZ2V0RWRpdEhhbmRsZVN0eWxlIiwic2hhcGUiLCJzdHlsZSIsIl9nZXRFZGl0SGFuZGxlU3RhdGUiLCJDVVJTT1JfRURJVF9IQU5ETEUiLCJwb2ludGVyRXZlbnRzIiwiZWxlbUtleSIsInN0cm9rZSIsImZpbGwiLCJmaWxsT3BhY2l0eSIsImhlaWdodCIsIndpZHRoIiwicGF0aCIsIl9nZXRQYXRoSW5TY3JlZW5Db29yZHMiLCJHRU9KU09OX1RZUEUiLCJMSU5FX1NUUklORyIsInJhZGl1cyIsIm90aGVycyIsIlNFR01FTlQiLCJzdHJva2VXaWR0aCIsIm9wYWNpdHkiLCJzZWdtZW50cyIsImkiLCJsZW5ndGgiLCJwdXNoIiwiX3JlbmRlclNlZ21lbnQiLCJQT0xZR09OIiwiRklMTCIsImN1cnNvckVkaXRIYW5kbGUiLCJnZXRGZWF0dXJlU3R5bGUiLCJnZW9tZXRyeSIsInJlbmRlclR5cGUiLCJmaXJzdENvb3JkcyIsImxhc3RDb29yZHMiLCJ1bmNvbW1pdHRlZFN0eWxlIiwiVU5DT01NSVRURUQiLCJjb21taXR0ZWRQYXRoIiwidW5jb21taXR0ZWRQYXRoIiwiY2xvc2luZ1BhdGgiLCJfcmVuZGVyRmlsbCIsIlJFTkRFUl9UWVBFIiwiY29tbWl0dGVkU3R5bGUiLCJjdXJzb3JDb29yZHMiLCJfcmVuZGVyU2VnbWVudHMiLCJzbGljZSIsImNsb3NpbmdTdHlsZSIsIkNMT1NJTkciLCJSRUNUQU5HTEUiLCJmaWx0ZXIiLCJCb29sZWFuIiwidGVudGF0aXZlRmVhdHVyZSIsImVkaXRIYW5kbGVzIiwiZmVhdHVyZXMiLCJnZXRGZWF0dXJlcyIsImZpbmQiLCJmIiwiX3JlbmRlclRlbnRhdGl2ZUZlYXR1cmUiLCJtYXAiLCJfcmVuZGVyRWRpdEhhbmRsZSIsIl9nZXRGZWF0dXJlUmVuZGVyU3RhdGUiLCJnZXRGZWF0dXJlU2hhcGUiLCJzZWxlY3RlZCIsIlBPSU5UIiwiX3JlbmRlclBvaW50IiwiX3JlbmRlclBhdGgiLCJfcmVuZGVyUG9seWdvbiIsImd1aWRlcyIsIl9tb2RlSGFuZGxlciIsImdldEd1aWRlcyIsImdldE1vZGVQcm9wcyIsIl9yZW5kZXJGZWF0dXJlIiwiX3JlbmRlckd1aWRlcyIsInZpZXdwb3J0IiwiX2NvbnRleHQiLCJfIiwiX2NvbnRhaW5lclJlZiIsIl9yZW5kZXJDYW52YXMiLCJzY3JlZW5Db29yZHMiLCJwYXRoU3RyaW5nIiwiam9pbiIsIl9yZW5kZXJFZGl0b3IiLCJNb2RlSGFuZGxlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVBOztBQUtBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFFcUJBLE07Ozs7Ozs7Ozs7Ozs7Ozs7OztrR0EyQkcsVUFBQ0MsVUFBRCxFQUFzQkMsV0FBdEIsRUFBK0M7QUFBQSx3QkFDN0IsTUFBS0MsS0FEd0I7QUFBQSxVQUMzREMsZ0JBRDJELGVBQzNEQSxnQkFEMkQ7QUFBQSxVQUN6Q0MsT0FEeUMsZUFDekNBLE9BRHlDOztBQUduRSxVQUFJSCxXQUFK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VUFBVSxHQUFHRCxZQUFZLENBQUNwQixHQUFiLENBQWlCLFVBQUE5RCxDQUFDO0FBQUEsNkJBQU9BLENBQUMsQ0FBQyxDQUFELENBQVIsY0FBZUEsQ0FBQyxDQUFDLENBQUQsQ0FBaEI7QUFBQSxXQUFsQixFQUF5Q29GLElBQXpDLENBQThDLEdBQTlDLENBQWI7QUFDQSw2QkFBWUQsVUFBWjs7QUFFRixhQUFLaEUsd0JBQWFZLE9BQWxCO0FBQ0VvRCxVQUFBQSxVQUFVLEdBQUdELFlBQVksQ0FBQ3BCLEdBQWIsQ0FBaUIsVUFBQTlELENBQUM7QUFBQSw2QkFBT0EsQ0FBQyxDQUFDLENBQUQsQ0FBUixjQUFlQSxDQUFDLENBQUMsQ0FBRCxDQUFoQjtBQUFBLFdBQWxCLEVBQXlDb0YsSUFBekMsQ0FBOEMsR0FBOUMsQ0FBYjtBQUNBLDZCQUFZRCxVQUFaOztBQUVGO0FBQ0UsaUJBQU8sSUFBUDtBQWJKO0FBZUQ7Ozs2QkFrZVE7QUFDUCxnRkFBb0IsS0FBS0UsYUFBTCxFQUFwQjtBQUNEOzs7O0VBN2ZpQ0Msb0IiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgdHlwZSB7IEZlYXR1cmUgfSBmcm9tICdAbmVidWxhLmdsL2VkaXQtbW9kZXMnO1xuaW1wb3J0IHR5cGUgeyBHZW9Kc29uVHlwZSwgUmVuZGVyU3RhdGUsIElkIH0gZnJvbSAnLi90eXBlcyc7XG5cbmltcG9ydCB7IFJFTkRFUl9TVEFURSwgUkVOREVSX1RZUEUsIEdFT0pTT05fVFlQRSwgR1VJREVfVFlQRSwgRUxFTUVOVF9UWVBFIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuaW1wb3J0IE1vZGVIYW5kbGVyIGZyb20gJy4vbW9kZS1oYW5kbGVyJztcbmltcG9ydCB7IGdldEZlYXR1cmVDb29yZGluYXRlcyB9IGZyb20gJy4vZWRpdC1tb2Rlcy91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVkaXRvciBleHRlbmRzIE1vZGVIYW5kbGVyIHtcbiAgLyogSEVMUEVSUyAqL1xuICBfZ2V0UGF0aEluU2NyZWVuQ29vcmRzKGNvb3JkaW5hdGVzOiBhbnksIHR5cGU6IEdlb0pzb25UeXBlKSB7XG4gICAgaWYgKGNvb3JkaW5hdGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIGNvbnN0IHNjcmVlbkNvb3JkcyA9IGNvb3JkaW5hdGVzLm1hcChwID0+IHRoaXMucHJvamVjdChwKSk7XG5cbiAgICBsZXQgcGF0aFN0cmluZyA9ICcnO1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSBHRU9KU09OX1RZUEUuUE9JTlQ6XG4gICAgICAgIHJldHVybiBzY3JlZW5Db29yZHM7XG5cbiAgICAgIGNhc2UgR0VPSlNPTl9UWVBFLkxJTkVfU1RSSU5HOlxuICAgICAgICBwYXRoU3RyaW5nID0gc2NyZWVuQ29vcmRzLm1hcChwID0+IGAke3BbMF19LCR7cFsxXX1gKS5qb2luKCdMJyk7XG4gICAgICAgIHJldHVybiBgTSAke3BhdGhTdHJpbmd9YDtcblxuICAgICAgY2FzZSBHRU9KU09OX1RZUEUuUE9MWUdPTjpcbiAgICAgICAgcGF0aFN0cmluZyA9IHNjcmVlbkNvb3Jkcy5tYXAocCA9PiBgJHtwWzBdfSwke3BbMV19YCkuam9pbignTCcpO1xuICAgICAgICByZXR1cm4gYE0gJHtwYXRoU3RyaW5nfSB6YDtcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgX2dldEVkaXRIYW5kbGVTdGF0ZSA9IChlZGl0SGFuZGxlOiBGZWF0dXJlLCByZW5kZXJTdGF0ZTogP3N0cmluZykgPT4ge1xuICAgIGNvbnN0IHsgcG9pbnRlckRvd25QaWNrcywgaG92ZXJlZCB9ID0gdGhpcy5zdGF0ZTtcblxuICAgIGlmIChyZW5kZXJTdGF0ZSkge1xuICAgICAgcmV0dXJuIHJlbmRlclN0YXRlO1xuICAgIH1cblxuICAgIGNvbnN0IGVkaXRIYW5kbGVJbmRleCA9IGVkaXRIYW5kbGUucHJvcGVydGllcy5wb3NpdGlvbkluZGV4ZXNbMF07XG4gICAgbGV0IGRyYWdnaW5nRWRpdEhhbmRsZUluZGV4ID0gbnVsbDtcbiAgICBjb25zdCBwaWNrZWRPYmplY3QgPSBwb2ludGVyRG93blBpY2tzICYmIHBvaW50ZXJEb3duUGlja3NbMF0gJiYgcG9pbnRlckRvd25QaWNrc1swXS5vYmplY3Q7XG4gICAgaWYgKHBpY2tlZE9iamVjdCAmJiBwaWNrZWRPYmplY3QuZ3VpZGVUeXBlID09PSBHVUlERV9UWVBFLkVESVRfSEFORExFKSB7XG4gICAgICBkcmFnZ2luZ0VkaXRIYW5kbGVJbmRleCA9IHBpY2tlZE9iamVjdC5pbmRleDtcbiAgICB9XG5cbiAgICBpZiAoZWRpdEhhbmRsZUluZGV4ID09PSBkcmFnZ2luZ0VkaXRIYW5kbGVJbmRleCkge1xuICAgICAgcmV0dXJuIFJFTkRFUl9TVEFURS5TRUxFQ1RFRDtcbiAgICB9XG5cbiAgICBpZiAoaG92ZXJlZCAmJiBob3ZlcmVkLnR5cGUgPT09IEVMRU1FTlRfVFlQRS5FRElUX0hBTkRMRSAmJiBob3ZlcmVkLmluZGV4ID09PSBlZGl0SGFuZGxlSW5kZXgpIHtcbiAgICAgIHJldHVybiBSRU5ERVJfU1RBVEUuSE9WRVJFRDtcbiAgICB9XG5cbiAgICByZXR1cm4gUkVOREVSX1NUQVRFLklOQUNUSVZFO1xuICB9O1xuXG4gIF9nZXRGZWF0dXJlUmVuZGVyU3RhdGUgPSAoaW5kZXg6IG51bWJlciwgcmVuZGVyU3RhdGU6ID9SZW5kZXJTdGF0ZSkgPT4ge1xuICAgIGNvbnN0IHsgc2VsZWN0ZWRGZWF0dXJlSW5kZXgsIGhvdmVyZWQgfSA9IHRoaXMuc3RhdGU7XG4gICAgaWYgKHJlbmRlclN0YXRlKSB7XG4gICAgICByZXR1cm4gcmVuZGVyU3RhdGU7XG4gICAgfVxuXG4gICAgaWYgKGluZGV4ID09PSBzZWxlY3RlZEZlYXR1cmVJbmRleCkge1xuICAgICAgcmV0dXJuIFJFTkRFUl9TVEFURS5TRUxFQ1RFRDtcbiAgICB9XG5cbiAgICBpZiAoaG92ZXJlZCAmJiBob3ZlcmVkLnR5cGUgPT09IEVMRU1FTlRfVFlQRS5GRUFUVVJFICYmIGhvdmVyZWQuZmVhdHVyZUluZGV4ID09PSBpbmRleCkge1xuICAgICAgcmV0dXJuIFJFTkRFUl9TVEFURS5IT1ZFUkVEO1xuICAgIH1cblxuICAgIHJldHVybiBSRU5ERVJfU1RBVEUuSU5BQ1RJVkU7XG4gIH07XG5cbiAgLyogUkVOREVSICovXG4gIC8qIGVzbGludC1kaXNhYmxlIG1heC1wYXJhbXMgKi9cbiAgX3JlbmRlckVkaXRIYW5kbGUgPSAoZWRpdEhhbmRsZTogRmVhdHVyZSwgZmVhdHVyZTogRmVhdHVyZSkgPT4ge1xuICAgIC8qIGVzbGludC1lbmFibGUgbWF4LXBhcmFtcyAqL1xuICAgIGNvbnN0IGNvb3JkaW5hdGVzID0gZ2V0RmVhdHVyZUNvb3JkaW5hdGVzKGVkaXRIYW5kbGUpO1xuICAgIGNvbnN0IHAgPSB0aGlzLnByb2plY3QoY29vcmRpbmF0ZXMgJiYgY29vcmRpbmF0ZXNbMF0pO1xuICAgIGlmICghcCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3Qge1xuICAgICAgcHJvcGVydGllczogeyBmZWF0dXJlSW5kZXgsIHBvc2l0aW9uSW5kZXhlcyB9XG4gICAgfSA9IGVkaXRIYW5kbGU7XG4gICAgY29uc3QgeyBjbGlja1JhZGl1cywgZ2V0RWRpdEhhbmRsZVNoYXBlLCBnZXRFZGl0SGFuZGxlU3R5bGUgfSA9IHRoaXMucHJvcHM7XG5cbiAgICBjb25zdCBpbmRleCA9IHBvc2l0aW9uSW5kZXhlc1swXTtcblxuICAgIGNvbnN0IHNoYXBlID1cbiAgICAgIHR5cGVvZiBnZXRFZGl0SGFuZGxlU2hhcGUgPT09ICdmdW5jdGlvbidcbiAgICAgICAgPyBnZXRFZGl0SGFuZGxlU2hhcGUoe1xuICAgICAgICAgICAgZmVhdHVyZTogZmVhdHVyZSB8fCBlZGl0SGFuZGxlLFxuICAgICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgICBmZWF0dXJlSW5kZXhcbiAgICAgICAgICB9KVxuICAgICAgICA6IGdldEVkaXRIYW5kbGVTaGFwZTtcblxuICAgIGxldCBzdHlsZSA9IGdldEVkaXRIYW5kbGVTdHlsZSh7XG4gICAgICBmZWF0dXJlOiBmZWF0dXJlIHx8IGVkaXRIYW5kbGUsXG4gICAgICBpbmRleCxcbiAgICAgIHN0YXRlOiB0aGlzLl9nZXRFZGl0SGFuZGxlU3RhdGUoZWRpdEhhbmRsZSlcbiAgICB9KTtcblxuICAgIC8vIGRpc2FibGUgZXZlbnRzIGZvciBjdXJzb3IgZWRpdEhhbmRsZVxuICAgIGlmIChlZGl0SGFuZGxlLnByb3BlcnRpZXMuZ3VpZGVUeXBlID09PSBHVUlERV9UWVBFLkNVUlNPUl9FRElUX0hBTkRMRSkge1xuICAgICAgc3R5bGUgPSB7XG4gICAgICAgIC4uLnN0eWxlLFxuICAgICAgICBwb2ludGVyRXZlbnRzOiAnbm9uZSdcbiAgICAgIH07XG4gICAgfVxuXG4gICAgY29uc3QgZWxlbUtleSA9IGAke0VMRU1FTlRfVFlQRS5FRElUX0hBTkRMRX0uJHtmZWF0dXJlSW5kZXh9LiR7aW5kZXh9YDtcbiAgICAvLyBmaXJzdCA8Y2lyY2xlfHJlY3Q+IGlzIHRvIG1ha2UgcGF0aCBlYXNpbHkgaW50ZXJhY3RlZCB3aXRoXG4gICAgc3dpdGNoIChzaGFwZSkge1xuICAgICAgY2FzZSAnY2lyY2xlJzpcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8ZyBrZXk9e2VsZW1LZXl9IHRyYW5zZm9ybT17YHRyYW5zbGF0ZSgke3BbMF19LCAke3BbMV19KWB9PlxuICAgICAgICAgICAgPGNpcmNsZVxuICAgICAgICAgICAgICBkYXRhLXR5cGU9e0VMRU1FTlRfVFlQRS5FRElUX0hBTkRMRX1cbiAgICAgICAgICAgICAgZGF0YS1pbmRleD17aW5kZXh9XG4gICAgICAgICAgICAgIGRhdGEtZmVhdHVyZS1pbmRleD17ZmVhdHVyZUluZGV4fVxuICAgICAgICAgICAgICBrZXk9e2Ake2VsZW1LZXl9LmhpZGRlbmB9XG4gICAgICAgICAgICAgIHN0eWxlPXt7IC4uLnN0eWxlLCBzdHJva2U6ICdub25lJywgZmlsbDogJyMwMDAnLCBmaWxsT3BhY2l0eTogMCB9fVxuICAgICAgICAgICAgICBjeD17MH1cbiAgICAgICAgICAgICAgY3k9ezB9XG4gICAgICAgICAgICAgIHI9e2NsaWNrUmFkaXVzfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxjaXJjbGVcbiAgICAgICAgICAgICAgZGF0YS10eXBlPXtFTEVNRU5UX1RZUEUuRURJVF9IQU5ETEV9XG4gICAgICAgICAgICAgIGRhdGEtaW5kZXg9e2luZGV4fVxuICAgICAgICAgICAgICBkYXRhLWZlYXR1cmUtaW5kZXg9e2ZlYXR1cmVJbmRleH1cbiAgICAgICAgICAgICAga2V5PXtlbGVtS2V5fVxuICAgICAgICAgICAgICBzdHlsZT17c3R5bGV9XG4gICAgICAgICAgICAgIGN4PXswfVxuICAgICAgICAgICAgICBjeT17MH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9nPlxuICAgICAgICApO1xuICAgICAgY2FzZSAncmVjdCc6XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPGcga2V5PXtlbGVtS2V5fSB0cmFuc2Zvcm09e2B0cmFuc2xhdGUoJHtwWzBdfSwgJHtwWzFdfSlgfT5cbiAgICAgICAgICAgIDxyZWN0XG4gICAgICAgICAgICAgIGRhdGEtdHlwZT17RUxFTUVOVF9UWVBFLkVESVRfSEFORExFfVxuICAgICAgICAgICAgICBkYXRhLWluZGV4PXtpbmRleH1cbiAgICAgICAgICAgICAgZGF0YS1mZWF0dXJlLWluZGV4PXtmZWF0dXJlSW5kZXh9XG4gICAgICAgICAgICAgIGtleT17YCR7ZWxlbUtleX0uaGlkZGVuYH1cbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAuLi5zdHlsZSxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IGNsaWNrUmFkaXVzLFxuICAgICAgICAgICAgICAgIHdpZHRoOiBjbGlja1JhZGl1cyxcbiAgICAgICAgICAgICAgICBmaWxsOiAnIzAwMCcsXG4gICAgICAgICAgICAgICAgZmlsbE9wYWNpdHk6IDBcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgcj17Y2xpY2tSYWRpdXN9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPHJlY3RcbiAgICAgICAgICAgICAgZGF0YS10eXBlPXtFTEVNRU5UX1RZUEUuRURJVF9IQU5ETEV9XG4gICAgICAgICAgICAgIGRhdGEtaW5kZXg9e2luZGV4fVxuICAgICAgICAgICAgICBkYXRhLWZlYXR1cmUtaW5kZXg9e2ZlYXR1cmVJbmRleH1cbiAgICAgICAgICAgICAga2V5PXtgJHtlbGVtS2V5fWB9XG4gICAgICAgICAgICAgIHN0eWxlPXtzdHlsZX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9nPlxuICAgICAgICApO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH07XG5cbiAgX3JlbmRlclNlZ21lbnQgPSAoZmVhdHVyZUluZGV4OiBJZCwgaW5kZXg6IG51bWJlciwgY29vcmRpbmF0ZXM6IG51bWJlcltdLCBzdHlsZTogT2JqZWN0KSA9PiB7XG4gICAgY29uc3QgcGF0aCA9IHRoaXMuX2dldFBhdGhJblNjcmVlbkNvb3Jkcyhjb29yZGluYXRlcywgR0VPSlNPTl9UWVBFLkxJTkVfU1RSSU5HKTtcbiAgICBjb25zdCB7IHJhZGl1cywgLi4ub3RoZXJzIH0gPSBzdHlsZTtcbiAgICBjb25zdCB7IGNsaWNrUmFkaXVzIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgY29uc3QgZWxlbUtleSA9IGAke0VMRU1FTlRfVFlQRS5TRUdNRU5UfS4ke2ZlYXR1cmVJbmRleH0uJHtpbmRleH1gO1xuICAgIHJldHVybiAoXG4gICAgICA8ZyBrZXk9e2VsZW1LZXl9PlxuICAgICAgICA8cGF0aFxuICAgICAgICAgIGtleT17YCR7ZWxlbUtleX0uaGlkZGVuYH1cbiAgICAgICAgICBkYXRhLXR5cGU9e0VMRU1FTlRfVFlQRS5TRUdNRU5UfVxuICAgICAgICAgIGRhdGEtaW5kZXg9e2luZGV4fVxuICAgICAgICAgIGRhdGEtZmVhdHVyZS1pbmRleD17ZmVhdHVyZUluZGV4fVxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAuLi5vdGhlcnMsXG4gICAgICAgICAgICBzdHJva2VXaWR0aDogY2xpY2tSYWRpdXMgfHwgcmFkaXVzLFxuICAgICAgICAgICAgb3BhY2l0eTogMFxuICAgICAgICAgIH19XG4gICAgICAgICAgZD17cGF0aH1cbiAgICAgICAgLz5cbiAgICAgICAgPHBhdGhcbiAgICAgICAgICBrZXk9e2VsZW1LZXl9XG4gICAgICAgICAgZGF0YS10eXBlPXtFTEVNRU5UX1RZUEUuU0VHTUVOVH1cbiAgICAgICAgICBkYXRhLWluZGV4PXtpbmRleH1cbiAgICAgICAgICBkYXRhLWZlYXR1cmUtaW5kZXg9e2ZlYXR1cmVJbmRleH1cbiAgICAgICAgICBzdHlsZT17b3RoZXJzfVxuICAgICAgICAgIGQ9e3BhdGh9XG4gICAgICAgIC8+XG4gICAgICA8L2c+XG4gICAgKTtcbiAgfTtcblxuICBfcmVuZGVyU2VnbWVudHMgPSAoZmVhdHVyZUluZGV4OiBJZCwgY29vcmRpbmF0ZXM6IG51bWJlcltdLCBzdHlsZTogT2JqZWN0KSA9PiB7XG4gICAgY29uc3Qgc2VnbWVudHMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvb3JkaW5hdGVzLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgc2VnbWVudHMucHVzaChcbiAgICAgICAgdGhpcy5fcmVuZGVyU2VnbWVudChmZWF0dXJlSW5kZXgsIGksIFtjb29yZGluYXRlc1tpXSwgY29vcmRpbmF0ZXNbaSArIDFdXSwgc3R5bGUpXG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gc2VnbWVudHM7XG4gIH07XG5cbiAgX3JlbmRlckZpbGwgPSAoZmVhdHVyZUluZGV4OiBJZCwgY29vcmRpbmF0ZXM6IG51bWJlcltdLCBzdHlsZTogT2JqZWN0KSA9PiB7XG4gICAgY29uc3QgcGF0aCA9IHRoaXMuX2dldFBhdGhJblNjcmVlbkNvb3Jkcyhjb29yZGluYXRlcywgR0VPSlNPTl9UWVBFLlBPTFlHT04pO1xuICAgIHJldHVybiAoXG4gICAgICA8cGF0aFxuICAgICAgICBrZXk9e2Ake0VMRU1FTlRfVFlQRS5GSUxMfS4ke2ZlYXR1cmVJbmRleH1gfVxuICAgICAgICBkYXRhLXR5cGU9e0VMRU1FTlRfVFlQRS5GSUxMfVxuICAgICAgICBkYXRhLWZlYXR1cmUtaW5kZXg9e2ZlYXR1cmVJbmRleH1cbiAgICAgICAgc3R5bGU9e3sgLi4uc3R5bGUsIHN0cm9rZTogJ25vbmUnIH19XG4gICAgICAgIGQ9e3BhdGh9XG4gICAgICAvPlxuICAgICk7XG4gIH07XG5cbiAgX3JlbmRlclRlbnRhdGl2ZUZlYXR1cmUgPSAoZmVhdHVyZTogRmVhdHVyZSwgY3Vyc29yRWRpdEhhbmRsZTogRmVhdHVyZSkgPT4ge1xuICAgIGNvbnN0IHsgZ2V0RmVhdHVyZVN0eWxlIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHtcbiAgICAgIGdlb21ldHJ5OiB7IGNvb3JkaW5hdGVzIH0sXG4gICAgICBwcm9wZXJ0aWVzOiB7IHJlbmRlclR5cGUgfVxuICAgIH0gPSBmZWF0dXJlO1xuXG4gICAgaWYgKCFjb29yZGluYXRlcyB8fCBjb29yZGluYXRlcy5sZW5ndGggPCAyKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyA+PSAyIGNvb3JkaW5hdGVzXG4gICAgY29uc3QgZmlyc3RDb29yZHMgPSBjb29yZGluYXRlc1swXTtcbiAgICBjb25zdCBsYXN0Q29vcmRzID0gY29vcmRpbmF0ZXNbY29vcmRpbmF0ZXMubGVuZ3RoIC0gMV07XG4gICAgY29uc3QgdW5jb21taXR0ZWRTdHlsZSA9IGdldEZlYXR1cmVTdHlsZSh7IGZlYXR1cmUsIHN0YXRlOiBSRU5ERVJfU1RBVEUuVU5DT01NSVRURUQgfSk7XG5cbiAgICBsZXQgY29tbWl0dGVkUGF0aDtcbiAgICBsZXQgdW5jb21taXR0ZWRQYXRoO1xuICAgIGxldCBjbG9zaW5nUGF0aDtcbiAgICBjb25zdCBmaWxsID0gdGhpcy5fcmVuZGVyRmlsbCgndGVudGF0aXZlJywgY29vcmRpbmF0ZXMsIHVuY29tbWl0dGVkU3R5bGUpO1xuXG4gICAgc3dpdGNoIChyZW5kZXJUeXBlKSB7XG4gICAgICBjYXNlIFJFTkRFUl9UWVBFLkxJTkVfU1RSSU5HOlxuICAgICAgY2FzZSBSRU5ERVJfVFlQRS5QT0xZR09OOlxuICAgICAgICBjb25zdCBjb21taXR0ZWRTdHlsZSA9IGdldEZlYXR1cmVTdHlsZSh7IGZlYXR1cmUsIHN0YXRlOiBSRU5ERVJfU1RBVEUuU0VMRUNURUQgfSk7XG4gICAgICAgIGlmIChjdXJzb3JFZGl0SGFuZGxlKSB7XG4gICAgICAgICAgY29uc3QgY3Vyc29yQ29vcmRzID0gY29vcmRpbmF0ZXNbY29vcmRpbmF0ZXMubGVuZ3RoIC0gMl07XG4gICAgICAgICAgY29tbWl0dGVkUGF0aCA9IHRoaXMuX3JlbmRlclNlZ21lbnRzKFxuICAgICAgICAgICAgJ3RlbnRhdGl2ZScsXG4gICAgICAgICAgICBjb29yZGluYXRlcy5zbGljZSgwLCBjb29yZGluYXRlcy5sZW5ndGggLSAxKSxcbiAgICAgICAgICAgIGNvbW1pdHRlZFN0eWxlXG4gICAgICAgICAgKTtcbiAgICAgICAgICB1bmNvbW1pdHRlZFBhdGggPSB0aGlzLl9yZW5kZXJTZWdtZW50KFxuICAgICAgICAgICAgJ3RlbnRhdGl2ZS11bmNvbW1pdHRlZCcsXG4gICAgICAgICAgICBjb29yZGluYXRlcy5sZW5ndGggLSAyLFxuICAgICAgICAgICAgW2N1cnNvckNvb3JkcywgbGFzdENvb3Jkc10sXG4gICAgICAgICAgICB1bmNvbW1pdHRlZFN0eWxlXG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb21taXR0ZWRQYXRoID0gdGhpcy5fcmVuZGVyU2VnbWVudHMoJ3RlbnRhdGl2ZScsIGNvb3JkaW5hdGVzLCBjb21taXR0ZWRTdHlsZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmVuZGVyVHlwZSA9PT0gUkVOREVSX1RZUEUuUE9MWUdPTikge1xuICAgICAgICAgIGNvbnN0IGNsb3NpbmdTdHlsZSA9IGdldEZlYXR1cmVTdHlsZSh7IGZlYXR1cmUsIHN0YXRlOiBSRU5ERVJfU1RBVEUuQ0xPU0lORyB9KTtcbiAgICAgICAgICBjbG9zaW5nUGF0aCA9IHRoaXMuX3JlbmRlclNlZ21lbnQoXG4gICAgICAgICAgICAndGVudGF0aXZlLWNsb3NpbmcnLFxuICAgICAgICAgICAgY29vcmRpbmF0ZXMubGVuZ3RoIC0gMSxcbiAgICAgICAgICAgIFtsYXN0Q29vcmRzLCBmaXJzdENvb3Jkc10sXG4gICAgICAgICAgICBjbG9zaW5nU3R5bGVcbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgUkVOREVSX1RZUEUuUkVDVEFOR0xFOlxuICAgICAgICB1bmNvbW1pdHRlZFBhdGggPSB0aGlzLl9yZW5kZXJTZWdtZW50cyhcbiAgICAgICAgICAndGVudGF0aXZlJyxcbiAgICAgICAgICBbLi4uY29vcmRpbmF0ZXMsIGZpcnN0Q29vcmRzXSxcbiAgICAgICAgICB1bmNvbW1pdHRlZFN0eWxlXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBkZWZhdWx0OlxuICAgIH1cblxuICAgIHJldHVybiBbZmlsbCwgY29tbWl0dGVkUGF0aCwgdW5jb21taXR0ZWRQYXRoLCBjbG9zaW5nUGF0aF0uZmlsdGVyKEJvb2xlYW4pO1xuICB9O1xuXG4gIF9yZW5kZXJHdWlkZXMgPSAoeyB0ZW50YXRpdmVGZWF0dXJlLCBlZGl0SGFuZGxlcyB9OiBPYmplY3QpID0+IHtcbiAgICBjb25zdCBmZWF0dXJlcyA9IHRoaXMuZ2V0RmVhdHVyZXMoKTtcbiAgICBjb25zdCBjdXJzb3JFZGl0SGFuZGxlID0gZWRpdEhhbmRsZXMuZmluZChcbiAgICAgIGYgPT4gZi5wcm9wZXJ0aWVzLmd1aWRlVHlwZSA9PT0gR1VJREVfVFlQRS5DVVJTT1JfRURJVF9IQU5ETEVcbiAgICApO1xuICAgIHJldHVybiAoXG4gICAgICA8ZyBrZXk9XCJmZWF0dXJlLWd1aWRlc1wiPlxuICAgICAgICB7dGVudGF0aXZlRmVhdHVyZSAmJiB0aGlzLl9yZW5kZXJUZW50YXRpdmVGZWF0dXJlKHRlbnRhdGl2ZUZlYXR1cmUsIGN1cnNvckVkaXRIYW5kbGUpfVxuICAgICAgICB7ZWRpdEhhbmRsZXMgJiZcbiAgICAgICAgICBlZGl0SGFuZGxlcy5tYXAoZWRpdEhhbmRsZSA9PiB7XG4gICAgICAgICAgICBjb25zdCBmZWF0dXJlID1cbiAgICAgICAgICAgICAgKGZlYXR1cmVzICYmIGZlYXR1cmVzW2VkaXRIYW5kbGUucHJvcGVydGllcy5mZWF0dXJlSW5kZXhdKSB8fCB0ZW50YXRpdmVGZWF0dXJlO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JlbmRlckVkaXRIYW5kbGUoZWRpdEhhbmRsZSwgZmVhdHVyZSk7XG4gICAgICAgICAgfSl9XG4gICAgICA8L2c+XG4gICAgKTtcbiAgfTtcblxuICBfcmVuZGVyUG9pbnQgPSAoZmVhdHVyZTogRmVhdHVyZSwgaW5kZXg6IG51bWJlciwgcGF0aDogc3RyaW5nKSA9PiB7XG4gICAgY29uc3QgcmVuZGVyU3RhdGUgPSB0aGlzLl9nZXRGZWF0dXJlUmVuZGVyU3RhdGUoaW5kZXgpO1xuICAgIGNvbnN0IHsgZ2V0RmVhdHVyZVN0eWxlLCBnZXRGZWF0dXJlU2hhcGUsIGNsaWNrUmFkaXVzIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHN0eWxlID0gZ2V0RmVhdHVyZVN0eWxlKHsgZmVhdHVyZSwgc3RhdGU6IHJlbmRlclN0YXRlIH0pO1xuICAgIGNvbnN0IHNoYXBlID1cbiAgICAgIHR5cGVvZiBnZXRGZWF0dXJlU2hhcGUgPT09ICdmdW5jdGlvbidcbiAgICAgICAgPyBnZXRGZWF0dXJlU2hhcGUoeyBmZWF0dXJlLCBzdGF0ZTogcmVuZGVyU3RhdGUgfSlcbiAgICAgICAgOiBnZXRGZWF0dXJlU2hhcGU7XG5cbiAgICBjb25zdCBlbGVtS2V5ID0gYGZlYXR1cmUuJHtpbmRleH1gO1xuICAgIGlmIChzaGFwZSA9PT0gJ3JlY3QnKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZyBrZXk9e2VsZW1LZXl9IHRyYW5zZm9ybT17YHRyYW5zbGF0ZSgke3BhdGhbMF1bMF19LCAke3BhdGhbMF1bMV19KWB9PlxuICAgICAgICAgIDxyZWN0XG4gICAgICAgICAgICBkYXRhLXR5cGU9e0VMRU1FTlRfVFlQRS5GRUFUVVJFfVxuICAgICAgICAgICAgZGF0YS1mZWF0dXJlLWluZGV4PXtpbmRleH1cbiAgICAgICAgICAgIGtleT17YCR7ZWxlbUtleX0uaGlkZGVuYH1cbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIC4uLnN0eWxlLFxuICAgICAgICAgICAgICB3aWR0aDogY2xpY2tSYWRpdXMsXG4gICAgICAgICAgICAgIGhlaWdodDogY2xpY2tSYWRpdXMsXG4gICAgICAgICAgICAgIGZpbGw6ICcjMDAwJyxcbiAgICAgICAgICAgICAgZmlsbE9wYWNpdHk6IDBcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8cmVjdFxuICAgICAgICAgICAgZGF0YS10eXBlPXtFTEVNRU5UX1RZUEUuRkVBVFVSRX1cbiAgICAgICAgICAgIGRhdGEtZmVhdHVyZS1pbmRleD17aW5kZXh9XG4gICAgICAgICAgICBrZXk9e2VsZW1LZXl9XG4gICAgICAgICAgICBzdHlsZT17c3R5bGV9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9nPlxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGcga2V5PXtgZmVhdHVyZS4ke2luZGV4fWB9IHRyYW5zZm9ybT17YHRyYW5zbGF0ZSgke3BhdGhbMF1bMF19LCAke3BhdGhbMF1bMV19KWB9PlxuICAgICAgICA8Y2lyY2xlXG4gICAgICAgICAgZGF0YS10eXBlPXtFTEVNRU5UX1RZUEUuRkVBVFVSRX1cbiAgICAgICAgICBkYXRhLWZlYXR1cmUtaW5kZXg9e2luZGV4fVxuICAgICAgICAgIGtleT17YCR7ZWxlbUtleX0uaGlkZGVuYH1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgLi4uc3R5bGUsXG4gICAgICAgICAgICBvcGFjaXR5OiAwXG4gICAgICAgICAgfX1cbiAgICAgICAgICBjeD17MH1cbiAgICAgICAgICBjeT17MH1cbiAgICAgICAgICByPXtjbGlja1JhZGl1c31cbiAgICAgICAgLz5cbiAgICAgICAgPGNpcmNsZVxuICAgICAgICAgIGRhdGEtdHlwZT17RUxFTUVOVF9UWVBFLkZFQVRVUkV9XG4gICAgICAgICAgZGF0YS1mZWF0dXJlLWluZGV4PXtpbmRleH1cbiAgICAgICAgICBrZXk9e2VsZW1LZXl9XG4gICAgICAgICAgc3R5bGU9e3N0eWxlfVxuICAgICAgICAgIGN4PXswfVxuICAgICAgICAgIGN5PXswfVxuICAgICAgICAvPlxuICAgICAgPC9nPlxuICAgICk7XG4gIH07XG5cbiAgX3JlbmRlclBhdGggPSAoZmVhdHVyZTogRmVhdHVyZSwgaW5kZXg6IG51bWJlciwgcGF0aDogc3RyaW5nKSA9PiB7XG4gICAgY29uc3QgeyBnZXRGZWF0dXJlU3R5bGUsIGNsaWNrUmFkaXVzIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHsgc2VsZWN0ZWRGZWF0dXJlSW5kZXggfSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3Qgc2VsZWN0ZWQgPSBpbmRleCA9PT0gc2VsZWN0ZWRGZWF0dXJlSW5kZXg7XG4gICAgY29uc3QgcmVuZGVyU3RhdGUgPSB0aGlzLl9nZXRGZWF0dXJlUmVuZGVyU3RhdGUoaW5kZXgpO1xuICAgIGNvbnN0IHN0eWxlID0gZ2V0RmVhdHVyZVN0eWxlKHsgZmVhdHVyZSwgc3RhdGU6IHJlbmRlclN0YXRlIH0pO1xuXG4gICAgY29uc3QgZWxlbUtleSA9IGBmZWF0dXJlLiR7aW5kZXh9YDtcbiAgICBpZiAoc2VsZWN0ZWQpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxnIGtleT17ZWxlbUtleX0+e3RoaXMuX3JlbmRlclNlZ21lbnRzKGluZGV4LCBmZWF0dXJlLmdlb21ldHJ5LmNvb3JkaW5hdGVzLCBzdHlsZSl9PC9nPlxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBmaXJzdCA8cGF0aD4gaXMgdG8gbWFrZSBwYXRoIGVhc2lseSBpbnRlcmFjdGVkIHdpdGhcbiAgICByZXR1cm4gKFxuICAgICAgPGcga2V5PXtlbGVtS2V5fT5cbiAgICAgICAgPHBhdGhcbiAgICAgICAgICBkYXRhLXR5cGU9e0VMRU1FTlRfVFlQRS5GRUFUVVJFfVxuICAgICAgICAgIGRhdGEtZmVhdHVyZS1pbmRleD17aW5kZXh9XG4gICAgICAgICAga2V5PXtgJHtlbGVtS2V5fS5oaWRkZW5gfVxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAuLi5zdHlsZSxcbiAgICAgICAgICAgIHN0cm9rZVdpZHRoOiBjbGlja1JhZGl1cyxcbiAgICAgICAgICAgIG9wYWNpdHk6IDBcbiAgICAgICAgICB9fVxuICAgICAgICAgIGQ9e3BhdGh9XG4gICAgICAgIC8+XG4gICAgICAgIDxwYXRoXG4gICAgICAgICAgZGF0YS10eXBlPXtFTEVNRU5UX1RZUEUuRkVBVFVSRX1cbiAgICAgICAgICBkYXRhLWZlYXR1cmUtaW5kZXg9e2luZGV4fVxuICAgICAgICAgIGtleT17ZWxlbUtleX1cbiAgICAgICAgICBzdHlsZT17c3R5bGV9XG4gICAgICAgICAgZD17cGF0aH1cbiAgICAgICAgLz5cbiAgICAgIDwvZz5cbiAgICApO1xuICB9O1xuXG4gIF9yZW5kZXJQb2x5Z29uID0gKGZlYXR1cmU6IEZlYXR1cmUsIGluZGV4OiBudW1iZXIsIHBhdGg6IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IHsgZ2V0RmVhdHVyZVN0eWxlIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHsgc2VsZWN0ZWRGZWF0dXJlSW5kZXggfSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3Qgc2VsZWN0ZWQgPSBpbmRleCA9PT0gc2VsZWN0ZWRGZWF0dXJlSW5kZXg7XG5cbiAgICBjb25zdCByZW5kZXJTdGF0ZSA9IHRoaXMuX2dldEZlYXR1cmVSZW5kZXJTdGF0ZShpbmRleCk7XG4gICAgY29uc3Qgc3R5bGUgPSBnZXRGZWF0dXJlU3R5bGUoeyBmZWF0dXJlLCBzdGF0ZTogcmVuZGVyU3RhdGUgfSk7XG5cbiAgICBjb25zdCBlbGVtS2V5ID0gYGZlYXR1cmUuJHtpbmRleH1gO1xuICAgIGlmIChzZWxlY3RlZCkge1xuICAgICAgY29uc3QgY29vcmRpbmF0ZXMgPSBnZXRGZWF0dXJlQ29vcmRpbmF0ZXMoZmVhdHVyZSk7XG4gICAgICBpZiAoIWNvb3JkaW5hdGVzKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGcga2V5PXtlbGVtS2V5fT5cbiAgICAgICAgICB7dGhpcy5fcmVuZGVyRmlsbChpbmRleCwgY29vcmRpbmF0ZXMsIHN0eWxlKX1cbiAgICAgICAgICB7dGhpcy5fcmVuZGVyU2VnbWVudHMoaW5kZXgsIGNvb3JkaW5hdGVzLCBzdHlsZSl9XG4gICAgICAgIDwvZz5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxwYXRoXG4gICAgICAgIGRhdGEtdHlwZT17RUxFTUVOVF9UWVBFLkZFQVRVUkV9XG4gICAgICAgIGRhdGEtZmVhdHVyZS1pbmRleD17aW5kZXh9XG4gICAgICAgIGtleT17ZWxlbUtleX1cbiAgICAgICAgc3R5bGU9e3N0eWxlfVxuICAgICAgICBkPXtwYXRofVxuICAgICAgLz5cbiAgICApO1xuICB9O1xuXG4gIF9yZW5kZXJGZWF0dXJlID0gKGZlYXR1cmU6IEZlYXR1cmUsIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICBjb25zdCBjb29yZGluYXRlcyA9IGdldEZlYXR1cmVDb29yZGluYXRlcyhmZWF0dXJlKTtcbiAgICBpZiAoIWNvb3JkaW5hdGVzIHx8ICFjb29yZGluYXRlcy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHtcbiAgICAgIHByb3BlcnRpZXM6IHsgcmVuZGVyVHlwZSB9LFxuICAgICAgZ2VvbWV0cnk6IHsgdHlwZSB9XG4gICAgfSA9IGZlYXR1cmU7XG4gICAgY29uc3QgcGF0aCA9IHRoaXMuX2dldFBhdGhJblNjcmVlbkNvb3Jkcyhjb29yZGluYXRlcywgdHlwZSk7XG4gICAgaWYgKCFwYXRoKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBzd2l0Y2ggKHJlbmRlclR5cGUpIHtcbiAgICAgIGNhc2UgUkVOREVSX1RZUEUuUE9JTlQ6XG4gICAgICAgIHJldHVybiB0aGlzLl9yZW5kZXJQb2ludChmZWF0dXJlLCBpbmRleCwgcGF0aCk7XG4gICAgICBjYXNlIFJFTkRFUl9UWVBFLkxJTkVfU1RSSU5HOlxuICAgICAgICByZXR1cm4gdGhpcy5fcmVuZGVyUGF0aChmZWF0dXJlLCBpbmRleCwgcGF0aCk7XG5cbiAgICAgIGNhc2UgUkVOREVSX1RZUEUuUE9MWUdPTjpcbiAgICAgIGNhc2UgUkVOREVSX1RZUEUuUkVDVEFOR0xFOlxuICAgICAgICByZXR1cm4gdGhpcy5fcmVuZGVyUG9seWdvbihmZWF0dXJlLCBpbmRleCwgcGF0aCk7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfTtcblxuICBfcmVuZGVyQ2FudmFzID0gKCkgPT4ge1xuICAgIGNvbnN0IGZlYXR1cmVzID0gdGhpcy5nZXRGZWF0dXJlcygpO1xuICAgIGNvbnN0IGd1aWRlcyA9IHRoaXMuX21vZGVIYW5kbGVyICYmIHRoaXMuX21vZGVIYW5kbGVyLmdldEd1aWRlcyh0aGlzLmdldE1vZGVQcm9wcygpKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8c3ZnIGtleT1cImRyYXctY2FudmFzXCIgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiPlxuICAgICAgICB7ZmVhdHVyZXMgJiZcbiAgICAgICAgICBmZWF0dXJlcy5sZW5ndGggPiAwICYmIDxnIGtleT1cImZlYXR1cmUtZ3JvdXBcIj57ZmVhdHVyZXMubWFwKHRoaXMuX3JlbmRlckZlYXR1cmUpfTwvZz59XG4gICAgICAgIHtndWlkZXMgJiYgPGcga2V5PVwiZmVhdHVyZS1ndWlkZXNcIj57dGhpcy5fcmVuZGVyR3VpZGVzKGd1aWRlcyl9PC9nPn1cbiAgICAgIDwvc3ZnPlxuICAgICk7XG4gIH07XG5cbiAgX3JlbmRlckVkaXRvciA9ICgpID0+IHtcbiAgICBjb25zdCB2aWV3cG9ydCA9ICh0aGlzLl9jb250ZXh0ICYmIHRoaXMuX2NvbnRleHQudmlld3BvcnQpIHx8IHt9O1xuICAgIGNvbnN0IHsgc3R5bGUgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0IH0gPSB2aWV3cG9ydDtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIGlkPVwiZWRpdG9yXCJcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICB3aWR0aCxcbiAgICAgICAgICBoZWlnaHQsXG4gICAgICAgICAgLi4uc3R5bGVcbiAgICAgICAgfX1cbiAgICAgICAgcmVmPXtfID0+IHtcbiAgICAgICAgICB0aGlzLl9jb250YWluZXJSZWYgPSBfO1xuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICB7dGhpcy5fcmVuZGVyQ2FudmFzKCl9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gc3VwZXIucmVuZGVyKHRoaXMuX3JlbmRlckVkaXRvcigpKTtcbiAgfVxufVxuIl19