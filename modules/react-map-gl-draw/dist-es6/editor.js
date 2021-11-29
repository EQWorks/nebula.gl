"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _constants = require("./constants");

var _modeHandler = _interopRequireDefault(require("./mode-handler"));

var _utils = require("./edit-modes/utils");

var _style = require("./style");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var defaultProps = _objectSpread({}, _modeHandler.default.defaultProps, {
  clickRadius: 0,
  featureShape: 'circle',
  editHandleShape: 'rect',
  editHandleStyle: _style.editHandleStyle,
  featureStyle: _style.featureStyle
});

class Editor extends _modeHandler.default {
  constructor() {
    var _this;

    super(...arguments);
    _this = this;

    _defineProperty(this, "_getEditHandleState", function (editHandle, renderState) {
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

      if (hovered && hovered.type === _constants.ELEMENT_TYPE.EDIT_HANDLE) {
        if (hovered.index === editHandleIndex) {
          return _constants.RENDER_STATE.HOVERED;
        } // cursor hovered on first vertex when drawing polygon


        if (hovered.index === 0 && editHandle.properties.guideType === _constants.GUIDE_TYPE.CURSOR_EDIT_HANDLE) {
          return _constants.RENDER_STATE.CLOSING;
        }
      }

      return _constants.RENDER_STATE.INACTIVE;
    });

    _defineProperty(this, "_getFeatureRenderState", function (index, renderState) {
      var hovered = _this.state.hovered;

      var selectedFeatureIndex = _this._getSelectedFeatureIndex();

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

    _defineProperty(this, "_getStyleProp", function (styleProp, params) {
      return typeof styleProp === 'function' ? styleProp(params) : styleProp;
    });

    _defineProperty(this, "_renderEditHandle", function (editHandle, feature) {
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
          editHandleShape = _this$props.editHandleShape,
          editHandleStyle = _this$props.editHandleStyle;
      var index = positionIndexes[0];

      var shape = _this._getStyleProp(editHandleShape, {
        feature: feature || editHandle,
        index: index,
        featureIndex: featureIndex,
        state: _this._getEditHandleState(editHandle)
      });

      var style = _this._getStyleProp(editHandleStyle, {
        feature: feature || editHandle,
        index: index,
        featureIndex: featureIndex,
        shape: shape,
        state: _this._getEditHandleState(editHandle)
      }); // disable events for cursor editHandle


      if (editHandle.properties.guideType === _constants.GUIDE_TYPE.CURSOR_EDIT_HANDLE) {
        style = _objectSpread({}, style, {
          // disable pointer events for cursor
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

    _defineProperty(this, "_renderSegment", function (featureIndex, index, coordinates, style) {
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

    _defineProperty(this, "_renderSegments", function (featureIndex, coordinates, style) {
      var segments = [];

      for (var i = 0; i < coordinates.length - 1; i++) {
        segments.push(_this._renderSegment(featureIndex, i, [coordinates[i], coordinates[i + 1]], style));
      }

      return segments;
    });

    _defineProperty(this, "_renderFill", function (featureIndex, coordinates, style) {
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

    _defineProperty(this, "_renderTentativeFeature", function (feature, cursorEditHandle) {
      var featureStyle = _this.props.featureStyle;
      var coordinates = feature.geometry.coordinates,
          renderType = feature.properties.renderType;

      if (!coordinates || coordinates.length < 2) {
        return null;
      } // >= 2 coordinates


      var firstCoords = coordinates[0];
      var lastCoords = coordinates[coordinates.length - 1];

      var uncommittedStyle = _this._getStyleProp(featureStyle, {
        feature: feature,
        index: null,
        state: _constants.RENDER_STATE.UNCOMMITTED
      });

      var committedPath;
      var uncommittedPath;
      var closingPath;

      var fill = _this._renderFill('tentative', coordinates, uncommittedStyle);

      switch (renderType) {
        case _constants.RENDER_TYPE.LINE_STRING:
        case _constants.RENDER_TYPE.POLYGON:
          var committedStyle = _this._getStyleProp(featureStyle, {
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
            var closingStyle = _this._getStyleProp(featureStyle, {
              feature: feature,
              index: null,
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

    _defineProperty(this, "_renderGuides", function (_ref) {
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

    _defineProperty(this, "_renderPoint", function (feature, index, path) {
      var renderState = _this._getFeatureRenderState(index);

      var _this$props2 = _this.props,
          featureStyle = _this$props2.featureStyle,
          featureShape = _this$props2.featureShape,
          clickRadius = _this$props2.clickRadius;

      var shape = _this._getStyleProp(featureShape, {
        feature: feature,
        index: index,
        state: renderState
      });

      var style = _this._getStyleProp(featureStyle, {
        feature: feature,
        index: index,
        state: renderState
      });

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

    _defineProperty(this, "_renderPath", function (feature, index, path) {
      var _this$props3 = _this.props,
          featureStyle = _this$props3.featureStyle,
          clickRadius = _this$props3.clickRadius;

      var selectedFeatureIndex = _this._getSelectedFeatureIndex();

      var selected = index === selectedFeatureIndex;

      var renderState = _this._getFeatureRenderState(index);

      var style = _this._getStyleProp(featureStyle, {
        feature: feature,
        index: index,
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

    _defineProperty(this, "_renderPolygon", function (feature, index, path) {
      var featureStyle = _this.props.featureStyle;

      var selectedFeatureIndex = _this._getSelectedFeatureIndex();

      var selected = index === selectedFeatureIndex;

      var renderState = _this._getFeatureRenderState(index);

      var style = _this._getStyleProp(featureStyle, {
        feature: feature,
        index: index,
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

    _defineProperty(this, "_renderFeature", function (feature, index) {
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

    _defineProperty(this, "_renderCanvas", function () {
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

    _defineProperty(this, "_renderEditor", function () {
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
  }

  /* HELPERS */
  _getPathInScreenCoords(coordinates, type) {
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

  render() {
    return super.render(this._renderEditor());
  }

}

exports.default = Editor;

_defineProperty(Editor, "defaultProps", defaultProps);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9lZGl0b3IuanMiXSwibmFtZXMiOlsiZGVmYXVsdFByb3BzIiwiTW9kZUhhbmRsZXIiLCJjbGlja1JhZGl1cyIsImZlYXR1cmVTaGFwZSIsImVkaXRIYW5kbGVTaGFwZSIsImVkaXRIYW5kbGVTdHlsZSIsImRlZmF1bHRFZGl0SGFuZGxlU3R5bGUiLCJmZWF0dXJlU3R5bGUiLCJkZWZhdWx0RmVhdHVyZVN0eWxlIiwiRWRpdG9yIiwiZWRpdEhhbmRsZSIsInJlbmRlclN0YXRlIiwic3RhdGUiLCJwb2ludGVyRG93blBpY2tzIiwiaG92ZXJlZCIsImVkaXRIYW5kbGVJbmRleCIsInByb3BlcnRpZXMiLCJwb3NpdGlvbkluZGV4ZXMiLCJkcmFnZ2luZ0VkaXRIYW5kbGVJbmRleCIsInBpY2tlZE9iamVjdCIsIm9iamVjdCIsImd1aWRlVHlwZSIsIkdVSURFX1RZUEUiLCJFRElUX0hBTkRMRSIsImluZGV4IiwiUkVOREVSX1NUQVRFIiwiU0VMRUNURUQiLCJ0eXBlIiwiRUxFTUVOVF9UWVBFIiwiSE9WRVJFRCIsIkNVUlNPUl9FRElUX0hBTkRMRSIsIkNMT1NJTkciLCJJTkFDVElWRSIsInNlbGVjdGVkRmVhdHVyZUluZGV4IiwiX2dldFNlbGVjdGVkRmVhdHVyZUluZGV4IiwiRkVBVFVSRSIsImZlYXR1cmVJbmRleCIsInN0eWxlUHJvcCIsInBhcmFtcyIsImZlYXR1cmUiLCJjb29yZGluYXRlcyIsInAiLCJwcm9qZWN0IiwicHJvcHMiLCJzaGFwZSIsIl9nZXRTdHlsZVByb3AiLCJfZ2V0RWRpdEhhbmRsZVN0YXRlIiwic3R5bGUiLCJwb2ludGVyRXZlbnRzIiwiZWxlbUtleSIsInN0cm9rZSIsImZpbGwiLCJmaWxsT3BhY2l0eSIsImhlaWdodCIsIndpZHRoIiwicGF0aCIsIl9nZXRQYXRoSW5TY3JlZW5Db29yZHMiLCJHRU9KU09OX1RZUEUiLCJMSU5FX1NUUklORyIsInJhZGl1cyIsIm90aGVycyIsIlNFR01FTlQiLCJzdHJva2VXaWR0aCIsIm9wYWNpdHkiLCJzZWdtZW50cyIsImkiLCJsZW5ndGgiLCJwdXNoIiwiX3JlbmRlclNlZ21lbnQiLCJQT0xZR09OIiwiRklMTCIsImN1cnNvckVkaXRIYW5kbGUiLCJnZW9tZXRyeSIsInJlbmRlclR5cGUiLCJmaXJzdENvb3JkcyIsImxhc3RDb29yZHMiLCJ1bmNvbW1pdHRlZFN0eWxlIiwiVU5DT01NSVRURUQiLCJjb21taXR0ZWRQYXRoIiwidW5jb21taXR0ZWRQYXRoIiwiY2xvc2luZ1BhdGgiLCJfcmVuZGVyRmlsbCIsIlJFTkRFUl9UWVBFIiwiY29tbWl0dGVkU3R5bGUiLCJjdXJzb3JDb29yZHMiLCJfcmVuZGVyU2VnbWVudHMiLCJzbGljZSIsImNsb3NpbmdTdHlsZSIsIlJFQ1RBTkdMRSIsImZpbHRlciIsIkJvb2xlYW4iLCJ0ZW50YXRpdmVGZWF0dXJlIiwiZWRpdEhhbmRsZXMiLCJmZWF0dXJlcyIsImdldEZlYXR1cmVzIiwiZmluZCIsImYiLCJfcmVuZGVyVGVudGF0aXZlRmVhdHVyZSIsIm1hcCIsIl9yZW5kZXJFZGl0SGFuZGxlIiwiX2dldEZlYXR1cmVSZW5kZXJTdGF0ZSIsInNlbGVjdGVkIiwiUE9JTlQiLCJfcmVuZGVyUG9pbnQiLCJfcmVuZGVyUGF0aCIsIl9yZW5kZXJQb2x5Z29uIiwiZ3VpZGVzIiwiX21vZGVIYW5kbGVyIiwiZ2V0R3VpZGVzIiwiZ2V0TW9kZVByb3BzIiwiX3JlbmRlckZlYXR1cmUiLCJfcmVuZGVyR3VpZGVzIiwidmlld3BvcnQiLCJfY29udGV4dCIsIl8iLCJfY29udGFpbmVyUmVmIiwiX3JlbmRlckNhbnZhcyIsInNjcmVlbkNvb3JkcyIsInBhdGhTdHJpbmciLCJqb2luIiwicmVuZGVyIiwiX3JlbmRlckVkaXRvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVBOztBQUtBOztBQUNBOztBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUtBLElBQU1BLFlBQVkscUJBQ2JDLHFCQUFZRCxZQURDO0FBRWhCRSxFQUFBQSxXQUFXLEVBQUUsQ0FG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QUFoQjtBQUFBLFNBQWxCLEVBQXlDOEUsSUFBekMsQ0FBOEMsR0FBOUMsQ0FBYjtBQUNBLDJCQUFZRCxVQUFaOztBQUVGO0FBQ0UsZUFBTyxJQUFQO0FBYko7QUFlRDs7QUE0ZkRFLEVBQUFBLE1BQU0sR0FBRztBQUNQLFdBQU8sTUFBTUEsTUFBTixDQUFhLEtBQUtDLGFBQUwsRUFBYixDQUFQO0FBQ0Q7O0FBemhCNkM7Ozs7Z0JBQTNCaEgsTSxrQkFDR1QsWSIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCB0eXBlIHsgRmVhdHVyZSB9IGZyb20gJ2tlcGxlci1vdXRkYXRlZC1uZWJ1bGEuZ2wtZWRpdC1tb2Rlcyc7XG5pbXBvcnQgdHlwZSB7IEdlb0pzb25UeXBlLCBSZW5kZXJTdGF0ZSwgSWQgfSBmcm9tICcuL3R5cGVzJztcblxuaW1wb3J0IHsgUkVOREVSX1NUQVRFLCBSRU5ERVJfVFlQRSwgR0VPSlNPTl9UWVBFLCBHVUlERV9UWVBFLCBFTEVNRU5UX1RZUEUgfSBmcm9tICcuL2NvbnN0YW50cyc7XG5pbXBvcnQgTW9kZUhhbmRsZXIgZnJvbSAnLi9tb2RlLWhhbmRsZXInO1xuaW1wb3J0IHsgZ2V0RmVhdHVyZUNvb3JkaW5hdGVzIH0gZnJvbSAnLi9lZGl0LW1vZGVzL3V0aWxzJztcblxuaW1wb3J0IHtcbiAgZWRpdEhhbmRsZVN0eWxlIGFzIGRlZmF1bHRFZGl0SGFuZGxlU3R5bGUsXG4gIGZlYXR1cmVTdHlsZSBhcyBkZWZhdWx0RmVhdHVyZVN0eWxlXG59IGZyb20gJy4vc3R5bGUnO1xuXG5jb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gIC4uLk1vZGVIYW5kbGVyLmRlZmF1bHRQcm9wcyxcbiAgY2xpY2tSYWRpdXM6IDAsXG4gIGZlYXR1cmVTaGFwZTogJ2NpcmNsZScsXG4gIGVkaXRIYW5kbGVTaGFwZTogJ3JlY3QnLFxuICBlZGl0SGFuZGxlU3R5bGU6IGRlZmF1bHRFZGl0SGFuZGxlU3R5bGUsXG4gIGZlYXR1cmVTdHlsZTogZGVmYXVsdEZlYXR1cmVTdHlsZVxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWRpdG9yIGV4dGVuZHMgTW9kZUhhbmRsZXIge1xuICBzdGF0aWMgZGVmYXVsdFByb3BzID0gZGVmYXVsdFByb3BzO1xuXG4gIC8qIEhFTFBFUlMgKi9cbiAgX2dldFBhdGhJblNjcmVlbkNvb3Jkcyhjb29yZGluYXRlczogYW55LCB0eXBlOiBHZW9Kc29uVHlwZSkge1xuICAgIGlmIChjb29yZGluYXRlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG5cbiAgICBjb25zdCBzY3JlZW5Db29yZHMgPSBjb29yZGluYXRlcy5tYXAocCA9PiB0aGlzLnByb2plY3QocCkpO1xuXG4gICAgbGV0IHBhdGhTdHJpbmcgPSAnJztcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgR0VPSlNPTl9UWVBFLlBPSU5UOlxuICAgICAgICByZXR1cm4gc2NyZWVuQ29vcmRzO1xuXG4gICAgICBjYXNlIEdFT0pTT05fVFlQRS5MSU5FX1NUUklORzpcbiAgICAgICAgcGF0aFN0cmluZyA9IHNjcmVlbkNvb3Jkcy5tYXAocCA9PiBgJHtwWzBdfSwke3BbMV19YCkuam9pbignTCcpO1xuICAgICAgICByZXR1cm4gYE0gJHtwYXRoU3RyaW5nfWA7XG5cbiAgICAgIGNhc2UgR0VPSlNPTl9UWVBFLlBPTFlHT046XG4gICAgICAgIHBhdGhTdHJpbmcgPSBzY3JlZW5Db29yZHMubWFwKHAgPT4gYCR7cFswXX0sJHtwWzFdfWApLmpvaW4oJ0wnKTtcbiAgICAgICAgcmV0dXJuIGBNICR7cGF0aFN0cmluZ30gemA7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIF9nZXRFZGl0SGFuZGxlU3RhdGUgPSAoZWRpdEhhbmRsZTogRmVhdHVyZSwgcmVuZGVyU3RhdGU6ID9zdHJpbmcpID0+IHtcbiAgICBjb25zdCB7IHBvaW50ZXJEb3duUGlja3MsIGhvdmVyZWQgfSA9IHRoaXMuc3RhdGU7XG5cbiAgICBpZiAocmVuZGVyU3RhdGUpIHtcbiAgICAgIHJldHVybiByZW5kZXJTdGF0ZTtcbiAgICB9XG5cbiAgICBjb25zdCBlZGl0SGFuZGxlSW5kZXggPSBlZGl0SGFuZGxlLnByb3BlcnRpZXMucG9zaXRpb25JbmRleGVzWzBdO1xuICAgIGxldCBkcmFnZ2luZ0VkaXRIYW5kbGVJbmRleCA9IG51bGw7XG4gICAgY29uc3QgcGlja2VkT2JqZWN0ID0gcG9pbnRlckRvd25QaWNrcyAmJiBwb2ludGVyRG93blBpY2tzWzBdICYmIHBvaW50ZXJEb3duUGlja3NbMF0ub2JqZWN0O1xuICAgIGlmIChwaWNrZWRPYmplY3QgJiYgcGlja2VkT2JqZWN0Lmd1aWRlVHlwZSA9PT0gR1VJREVfVFlQRS5FRElUX0hBTkRMRSkge1xuICAgICAgZHJhZ2dpbmdFZGl0SGFuZGxlSW5kZXggPSBwaWNrZWRPYmplY3QuaW5kZXg7XG4gICAgfVxuXG4gICAgaWYgKGVkaXRIYW5kbGVJbmRleCA9PT0gZHJhZ2dpbmdFZGl0SGFuZGxlSW5kZXgpIHtcbiAgICAgIHJldHVybiBSRU5ERVJfU1RBVEUuU0VMRUNURUQ7XG4gICAgfVxuXG4gICAgaWYgKGhvdmVyZWQgJiYgaG92ZXJlZC50eXBlID09PSBFTEVNRU5UX1RZUEUuRURJVF9IQU5ETEUpIHtcbiAgICAgIGlmIChob3ZlcmVkLmluZGV4ID09PSBlZGl0SGFuZGxlSW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIFJFTkRFUl9TVEFURS5IT1ZFUkVEO1xuICAgICAgfVxuXG4gICAgICAvLyBjdXJzb3IgaG92ZXJlZCBvbiBmaXJzdCB2ZXJ0ZXggd2hlbiBkcmF3aW5nIHBvbHlnb25cbiAgICAgIGlmIChcbiAgICAgICAgaG92ZXJlZC5pbmRleCA9PT0gMCAmJlxuICAgICAgICBlZGl0SGFuZGxlLnByb3BlcnRpZXMuZ3VpZGVUeXBlID09PSBHVUlERV9UWVBFLkNVUlNPUl9FRElUX0hBTkRMRVxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiBSRU5ERVJfU1RBVEUuQ0xPU0lORztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gUkVOREVSX1NUQVRFLklOQUNUSVZFO1xuICB9O1xuXG4gIF9nZXRGZWF0dXJlUmVuZGVyU3RhdGUgPSAoaW5kZXg6IG51bWJlciwgcmVuZGVyU3RhdGU6ID9SZW5kZXJTdGF0ZSkgPT4ge1xuICAgIGNvbnN0IHsgaG92ZXJlZCB9ID0gdGhpcy5zdGF0ZTtcbiAgICBjb25zdCBzZWxlY3RlZEZlYXR1cmVJbmRleCA9IHRoaXMuX2dldFNlbGVjdGVkRmVhdHVyZUluZGV4KCk7XG4gICAgaWYgKHJlbmRlclN0YXRlKSB7XG4gICAgICByZXR1cm4gcmVuZGVyU3RhdGU7XG4gICAgfVxuXG4gICAgaWYgKGluZGV4ID09PSBzZWxlY3RlZEZlYXR1cmVJbmRleCkge1xuICAgICAgcmV0dXJuIFJFTkRFUl9TVEFURS5TRUxFQ1RFRDtcbiAgICB9XG5cbiAgICBpZiAoaG92ZXJlZCAmJiBob3ZlcmVkLnR5cGUgPT09IEVMRU1FTlRfVFlQRS5GRUFUVVJFICYmIGhvdmVyZWQuZmVhdHVyZUluZGV4ID09PSBpbmRleCkge1xuICAgICAgcmV0dXJuIFJFTkRFUl9TVEFURS5IT1ZFUkVEO1xuICAgIH1cblxuICAgIHJldHVybiBSRU5ERVJfU1RBVEUuSU5BQ1RJVkU7XG4gIH07XG5cbiAgX2dldFN0eWxlUHJvcCA9IChzdHlsZVByb3A6IGFueSwgcGFyYW1zOiBhbnkpID0+IHtcbiAgICByZXR1cm4gdHlwZW9mIHN0eWxlUHJvcCA9PT0gJ2Z1bmN0aW9uJyA/IHN0eWxlUHJvcChwYXJhbXMpIDogc3R5bGVQcm9wO1xuICB9O1xuXG4gIC8qIFJFTkRFUiAqL1xuICAvKiBlc2xpbnQtZGlzYWJsZSBtYXgtcGFyYW1zICovXG4gIF9yZW5kZXJFZGl0SGFuZGxlID0gKGVkaXRIYW5kbGU6IEZlYXR1cmUsIGZlYXR1cmU6IEZlYXR1cmUpID0+IHtcbiAgICAvKiBlc2xpbnQtZW5hYmxlIG1heC1wYXJhbXMgKi9cbiAgICBjb25zdCBjb29yZGluYXRlcyA9IGdldEZlYXR1cmVDb29yZGluYXRlcyhlZGl0SGFuZGxlKTtcbiAgICBjb25zdCBwID0gdGhpcy5wcm9qZWN0KGNvb3JkaW5hdGVzICYmIGNvb3JkaW5hdGVzWzBdKTtcbiAgICBpZiAoIXApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHtcbiAgICAgIHByb3BlcnRpZXM6IHsgZmVhdHVyZUluZGV4LCBwb3NpdGlvbkluZGV4ZXMgfVxuICAgIH0gPSBlZGl0SGFuZGxlO1xuICAgIGNvbnN0IHsgY2xpY2tSYWRpdXMsIGVkaXRIYW5kbGVTaGFwZSwgZWRpdEhhbmRsZVN0eWxlIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgY29uc3QgaW5kZXggPSBwb3NpdGlvbkluZGV4ZXNbMF07XG5cbiAgICBjb25zdCBzaGFwZSA9IHRoaXMuX2dldFN0eWxlUHJvcChlZGl0SGFuZGxlU2hhcGUsIHtcbiAgICAgIGZlYXR1cmU6IGZlYXR1cmUgfHwgZWRpdEhhbmRsZSxcbiAgICAgIGluZGV4LFxuICAgICAgZmVhdHVyZUluZGV4LFxuICAgICAgc3RhdGU6IHRoaXMuX2dldEVkaXRIYW5kbGVTdGF0ZShlZGl0SGFuZGxlKVxuICAgIH0pO1xuXG4gICAgbGV0IHN0eWxlID0gdGhpcy5fZ2V0U3R5bGVQcm9wKGVkaXRIYW5kbGVTdHlsZSwge1xuICAgICAgZmVhdHVyZTogZmVhdHVyZSB8fCBlZGl0SGFuZGxlLFxuICAgICAgaW5kZXgsXG4gICAgICBmZWF0dXJlSW5kZXgsXG4gICAgICBzaGFwZSxcbiAgICAgIHN0YXRlOiB0aGlzLl9nZXRFZGl0SGFuZGxlU3RhdGUoZWRpdEhhbmRsZSlcbiAgICB9KTtcblxuICAgIC8vIGRpc2FibGUgZXZlbnRzIGZvciBjdXJzb3IgZWRpdEhhbmRsZVxuICAgIGlmIChlZGl0SGFuZGxlLnByb3BlcnRpZXMuZ3VpZGVUeXBlID09PSBHVUlERV9UWVBFLkNVUlNPUl9FRElUX0hBTkRMRSkge1xuICAgICAgc3R5bGUgPSB7XG4gICAgICAgIC4uLnN0eWxlLFxuICAgICAgICAvLyBkaXNhYmxlIHBvaW50ZXIgZXZlbnRzIGZvciBjdXJzb3JcbiAgICAgICAgcG9pbnRlckV2ZW50czogJ25vbmUnXG4gICAgICB9O1xuICAgIH1cblxuICAgIGNvbnN0IGVsZW1LZXkgPSBgJHtFTEVNRU5UX1RZUEUuRURJVF9IQU5ETEV9LiR7ZmVhdHVyZUluZGV4fS4ke2luZGV4fWA7XG4gICAgLy8gZmlyc3QgPGNpcmNsZXxyZWN0PiBpcyB0byBtYWtlIHBhdGggZWFzaWx5IGludGVyYWN0ZWQgd2l0aFxuICAgIHN3aXRjaCAoc2hhcGUpIHtcbiAgICAgIGNhc2UgJ2NpcmNsZSc6XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPGcga2V5PXtlbGVtS2V5fSB0cmFuc2Zvcm09e2B0cmFuc2xhdGUoJHtwWzBdfSwgJHtwWzFdfSlgfT5cbiAgICAgICAgICAgIDxjaXJjbGVcbiAgICAgICAgICAgICAgZGF0YS10eXBlPXtFTEVNRU5UX1RZUEUuRURJVF9IQU5ETEV9XG4gICAgICAgICAgICAgIGRhdGEtaW5kZXg9e2luZGV4fVxuICAgICAgICAgICAgICBkYXRhLWZlYXR1cmUtaW5kZXg9e2ZlYXR1cmVJbmRleH1cbiAgICAgICAgICAgICAga2V5PXtgJHtlbGVtS2V5fS5oaWRkZW5gfVxuICAgICAgICAgICAgICBzdHlsZT17eyAuLi5zdHlsZSwgc3Ryb2tlOiAnbm9uZScsIGZpbGw6ICcjMDAwJywgZmlsbE9wYWNpdHk6IDAgfX1cbiAgICAgICAgICAgICAgY3g9ezB9XG4gICAgICAgICAgICAgIGN5PXswfVxuICAgICAgICAgICAgICByPXtjbGlja1JhZGl1c31cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8Y2lyY2xlXG4gICAgICAgICAgICAgIGRhdGEtdHlwZT17RUxFTUVOVF9UWVBFLkVESVRfSEFORExFfVxuICAgICAgICAgICAgICBkYXRhLWluZGV4PXtpbmRleH1cbiAgICAgICAgICAgICAgZGF0YS1mZWF0dXJlLWluZGV4PXtmZWF0dXJlSW5kZXh9XG4gICAgICAgICAgICAgIGtleT17ZWxlbUtleX1cbiAgICAgICAgICAgICAgc3R5bGU9e3N0eWxlfVxuICAgICAgICAgICAgICBjeD17MH1cbiAgICAgICAgICAgICAgY3k9ezB9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZz5cbiAgICAgICAgKTtcbiAgICAgIGNhc2UgJ3JlY3QnOlxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxnIGtleT17ZWxlbUtleX0gdHJhbnNmb3JtPXtgdHJhbnNsYXRlKCR7cFswXX0sICR7cFsxXX0pYH0+XG4gICAgICAgICAgICA8cmVjdFxuICAgICAgICAgICAgICBkYXRhLXR5cGU9e0VMRU1FTlRfVFlQRS5FRElUX0hBTkRMRX1cbiAgICAgICAgICAgICAgZGF0YS1pbmRleD17aW5kZXh9XG4gICAgICAgICAgICAgIGRhdGEtZmVhdHVyZS1pbmRleD17ZmVhdHVyZUluZGV4fVxuICAgICAgICAgICAgICBrZXk9e2Ake2VsZW1LZXl9LmhpZGRlbmB9XG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgLi4uc3R5bGUsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBjbGlja1JhZGl1cyxcbiAgICAgICAgICAgICAgICB3aWR0aDogY2xpY2tSYWRpdXMsXG4gICAgICAgICAgICAgICAgZmlsbDogJyMwMDAnLFxuICAgICAgICAgICAgICAgIGZpbGxPcGFjaXR5OiAwXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIHI9e2NsaWNrUmFkaXVzfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxyZWN0XG4gICAgICAgICAgICAgIGRhdGEtdHlwZT17RUxFTUVOVF9UWVBFLkVESVRfSEFORExFfVxuICAgICAgICAgICAgICBkYXRhLWluZGV4PXtpbmRleH1cbiAgICAgICAgICAgICAgZGF0YS1mZWF0dXJlLWluZGV4PXtmZWF0dXJlSW5kZXh9XG4gICAgICAgICAgICAgIGtleT17YCR7ZWxlbUtleX1gfVxuICAgICAgICAgICAgICBzdHlsZT17c3R5bGV9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZz5cbiAgICAgICAgKTtcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9O1xuXG4gIF9yZW5kZXJTZWdtZW50ID0gKGZlYXR1cmVJbmRleDogSWQsIGluZGV4OiBudW1iZXIsIGNvb3JkaW5hdGVzOiBudW1iZXJbXSwgc3R5bGU6IE9iamVjdCkgPT4ge1xuICAgIGNvbnN0IHBhdGggPSB0aGlzLl9nZXRQYXRoSW5TY3JlZW5Db29yZHMoY29vcmRpbmF0ZXMsIEdFT0pTT05fVFlQRS5MSU5FX1NUUklORyk7XG4gICAgY29uc3QgeyByYWRpdXMsIC4uLm90aGVycyB9ID0gc3R5bGU7XG4gICAgY29uc3QgeyBjbGlja1JhZGl1cyB9ID0gdGhpcy5wcm9wcztcblxuICAgIGNvbnN0IGVsZW1LZXkgPSBgJHtFTEVNRU5UX1RZUEUuU0VHTUVOVH0uJHtmZWF0dXJlSW5kZXh9LiR7aW5kZXh9YDtcbiAgICByZXR1cm4gKFxuICAgICAgPGcga2V5PXtlbGVtS2V5fT5cbiAgICAgICAgPHBhdGhcbiAgICAgICAgICBrZXk9e2Ake2VsZW1LZXl9LmhpZGRlbmB9XG4gICAgICAgICAgZGF0YS10eXBlPXtFTEVNRU5UX1RZUEUuU0VHTUVOVH1cbiAgICAgICAgICBkYXRhLWluZGV4PXtpbmRleH1cbiAgICAgICAgICBkYXRhLWZlYXR1cmUtaW5kZXg9e2ZlYXR1cmVJbmRleH1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgLi4ub3RoZXJzLFxuICAgICAgICAgICAgc3Ryb2tlV2lkdGg6IGNsaWNrUmFkaXVzIHx8IHJhZGl1cyxcbiAgICAgICAgICAgIG9wYWNpdHk6IDBcbiAgICAgICAgICB9fVxuICAgICAgICAgIGQ9e3BhdGh9XG4gICAgICAgIC8+XG4gICAgICAgIDxwYXRoXG4gICAgICAgICAga2V5PXtlbGVtS2V5fVxuICAgICAgICAgIGRhdGEtdHlwZT17RUxFTUVOVF9UWVBFLlNFR01FTlR9XG4gICAgICAgICAgZGF0YS1pbmRleD17aW5kZXh9XG4gICAgICAgICAgZGF0YS1mZWF0dXJlLWluZGV4PXtmZWF0dXJlSW5kZXh9XG4gICAgICAgICAgc3R5bGU9e290aGVyc31cbiAgICAgICAgICBkPXtwYXRofVxuICAgICAgICAvPlxuICAgICAgPC9nPlxuICAgICk7XG4gIH07XG5cbiAgX3JlbmRlclNlZ21lbnRzID0gKGZlYXR1cmVJbmRleDogSWQsIGNvb3JkaW5hdGVzOiBudW1iZXJbXSwgc3R5bGU6IE9iamVjdCkgPT4ge1xuICAgIGNvbnN0IHNlZ21lbnRzID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb29yZGluYXRlcy5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgIHNlZ21lbnRzLnB1c2goXG4gICAgICAgIHRoaXMuX3JlbmRlclNlZ21lbnQoZmVhdHVyZUluZGV4LCBpLCBbY29vcmRpbmF0ZXNbaV0sIGNvb3JkaW5hdGVzW2kgKyAxXV0sIHN0eWxlKVxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIHNlZ21lbnRzO1xuICB9O1xuXG4gIF9yZW5kZXJGaWxsID0gKGZlYXR1cmVJbmRleDogSWQsIGNvb3JkaW5hdGVzOiBudW1iZXJbXSwgc3R5bGU6IE9iamVjdCkgPT4ge1xuICAgIGNvbnN0IHBhdGggPSB0aGlzLl9nZXRQYXRoSW5TY3JlZW5Db29yZHMoY29vcmRpbmF0ZXMsIEdFT0pTT05fVFlQRS5QT0xZR09OKTtcbiAgICByZXR1cm4gKFxuICAgICAgPHBhdGhcbiAgICAgICAga2V5PXtgJHtFTEVNRU5UX1RZUEUuRklMTH0uJHtmZWF0dXJlSW5kZXh9YH1cbiAgICAgICAgZGF0YS10eXBlPXtFTEVNRU5UX1RZUEUuRklMTH1cbiAgICAgICAgZGF0YS1mZWF0dXJlLWluZGV4PXtmZWF0dXJlSW5kZXh9XG4gICAgICAgIHN0eWxlPXt7IC4uLnN0eWxlLCBzdHJva2U6ICdub25lJyB9fVxuICAgICAgICBkPXtwYXRofVxuICAgICAgLz5cbiAgICApO1xuICB9O1xuXG4gIF9yZW5kZXJUZW50YXRpdmVGZWF0dXJlID0gKGZlYXR1cmU6IEZlYXR1cmUsIGN1cnNvckVkaXRIYW5kbGU6IEZlYXR1cmUpID0+IHtcbiAgICBjb25zdCB7IGZlYXR1cmVTdHlsZSB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB7XG4gICAgICBnZW9tZXRyeTogeyBjb29yZGluYXRlcyB9LFxuICAgICAgcHJvcGVydGllczogeyByZW5kZXJUeXBlIH1cbiAgICB9ID0gZmVhdHVyZTtcblxuICAgIGlmICghY29vcmRpbmF0ZXMgfHwgY29vcmRpbmF0ZXMubGVuZ3RoIDwgMikge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gPj0gMiBjb29yZGluYXRlc1xuICAgIGNvbnN0IGZpcnN0Q29vcmRzID0gY29vcmRpbmF0ZXNbMF07XG4gICAgY29uc3QgbGFzdENvb3JkcyA9IGNvb3JkaW5hdGVzW2Nvb3JkaW5hdGVzLmxlbmd0aCAtIDFdO1xuICAgIGNvbnN0IHVuY29tbWl0dGVkU3R5bGUgPSB0aGlzLl9nZXRTdHlsZVByb3AoZmVhdHVyZVN0eWxlLCB7XG4gICAgICBmZWF0dXJlLFxuICAgICAgaW5kZXg6IG51bGwsXG4gICAgICBzdGF0ZTogUkVOREVSX1NUQVRFLlVOQ09NTUlUVEVEXG4gICAgfSk7XG5cbiAgICBsZXQgY29tbWl0dGVkUGF0aDtcbiAgICBsZXQgdW5jb21taXR0ZWRQYXRoO1xuICAgIGxldCBjbG9zaW5nUGF0aDtcbiAgICBjb25zdCBmaWxsID0gdGhpcy5fcmVuZGVyRmlsbCgndGVudGF0aXZlJywgY29vcmRpbmF0ZXMsIHVuY29tbWl0dGVkU3R5bGUpO1xuXG4gICAgc3dpdGNoIChyZW5kZXJUeXBlKSB7XG4gICAgICBjYXNlIFJFTkRFUl9UWVBFLkxJTkVfU1RSSU5HOlxuICAgICAgY2FzZSBSRU5ERVJfVFlQRS5QT0xZR09OOlxuICAgICAgICBjb25zdCBjb21taXR0ZWRTdHlsZSA9IHRoaXMuX2dldFN0eWxlUHJvcChmZWF0dXJlU3R5bGUsIHtcbiAgICAgICAgICBmZWF0dXJlLFxuICAgICAgICAgIHN0YXRlOiBSRU5ERVJfU1RBVEUuU0VMRUNURURcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKGN1cnNvckVkaXRIYW5kbGUpIHtcbiAgICAgICAgICBjb25zdCBjdXJzb3JDb29yZHMgPSBjb29yZGluYXRlc1tjb29yZGluYXRlcy5sZW5ndGggLSAyXTtcbiAgICAgICAgICBjb21taXR0ZWRQYXRoID0gdGhpcy5fcmVuZGVyU2VnbWVudHMoXG4gICAgICAgICAgICAndGVudGF0aXZlJyxcbiAgICAgICAgICAgIGNvb3JkaW5hdGVzLnNsaWNlKDAsIGNvb3JkaW5hdGVzLmxlbmd0aCAtIDEpLFxuICAgICAgICAgICAgY29tbWl0dGVkU3R5bGVcbiAgICAgICAgICApO1xuICAgICAgICAgIHVuY29tbWl0dGVkUGF0aCA9IHRoaXMuX3JlbmRlclNlZ21lbnQoXG4gICAgICAgICAgICAndGVudGF0aXZlLXVuY29tbWl0dGVkJyxcbiAgICAgICAgICAgIGNvb3JkaW5hdGVzLmxlbmd0aCAtIDIsXG4gICAgICAgICAgICBbY3Vyc29yQ29vcmRzLCBsYXN0Q29vcmRzXSxcbiAgICAgICAgICAgIHVuY29tbWl0dGVkU3R5bGVcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbW1pdHRlZFBhdGggPSB0aGlzLl9yZW5kZXJTZWdtZW50cygndGVudGF0aXZlJywgY29vcmRpbmF0ZXMsIGNvbW1pdHRlZFN0eWxlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZW5kZXJUeXBlID09PSBSRU5ERVJfVFlQRS5QT0xZR09OKSB7XG4gICAgICAgICAgY29uc3QgY2xvc2luZ1N0eWxlID0gdGhpcy5fZ2V0U3R5bGVQcm9wKGZlYXR1cmVTdHlsZSwge1xuICAgICAgICAgICAgZmVhdHVyZSxcbiAgICAgICAgICAgIGluZGV4OiBudWxsLFxuICAgICAgICAgICAgc3RhdGU6IFJFTkRFUl9TVEFURS5DTE9TSU5HXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBjbG9zaW5nUGF0aCA9IHRoaXMuX3JlbmRlclNlZ21lbnQoXG4gICAgICAgICAgICAndGVudGF0aXZlLWNsb3NpbmcnLFxuICAgICAgICAgICAgY29vcmRpbmF0ZXMubGVuZ3RoIC0gMSxcbiAgICAgICAgICAgIFtsYXN0Q29vcmRzLCBmaXJzdENvb3Jkc10sXG4gICAgICAgICAgICBjbG9zaW5nU3R5bGVcbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgUkVOREVSX1RZUEUuUkVDVEFOR0xFOlxuICAgICAgICB1bmNvbW1pdHRlZFBhdGggPSB0aGlzLl9yZW5kZXJTZWdtZW50cyhcbiAgICAgICAgICAndGVudGF0aXZlJyxcbiAgICAgICAgICBbLi4uY29vcmRpbmF0ZXMsIGZpcnN0Q29vcmRzXSxcbiAgICAgICAgICB1bmNvbW1pdHRlZFN0eWxlXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBkZWZhdWx0OlxuICAgIH1cblxuICAgIHJldHVybiBbZmlsbCwgY29tbWl0dGVkUGF0aCwgdW5jb21taXR0ZWRQYXRoLCBjbG9zaW5nUGF0aF0uZmlsdGVyKEJvb2xlYW4pO1xuICB9O1xuXG4gIF9yZW5kZXJHdWlkZXMgPSAoeyB0ZW50YXRpdmVGZWF0dXJlLCBlZGl0SGFuZGxlcyB9OiBPYmplY3QpID0+IHtcbiAgICBjb25zdCBmZWF0dXJlcyA9IHRoaXMuZ2V0RmVhdHVyZXMoKTtcbiAgICBjb25zdCBjdXJzb3JFZGl0SGFuZGxlID0gZWRpdEhhbmRsZXMuZmluZChcbiAgICAgIGYgPT4gZi5wcm9wZXJ0aWVzLmd1aWRlVHlwZSA9PT0gR1VJREVfVFlQRS5DVVJTT1JfRURJVF9IQU5ETEVcbiAgICApO1xuICAgIHJldHVybiAoXG4gICAgICA8ZyBrZXk9XCJmZWF0dXJlLWd1aWRlc1wiPlxuICAgICAgICB7dGVudGF0aXZlRmVhdHVyZSAmJiB0aGlzLl9yZW5kZXJUZW50YXRpdmVGZWF0dXJlKHRlbnRhdGl2ZUZlYXR1cmUsIGN1cnNvckVkaXRIYW5kbGUpfVxuICAgICAgICB7ZWRpdEhhbmRsZXMgJiZcbiAgICAgICAgICBlZGl0SGFuZGxlcy5tYXAoZWRpdEhhbmRsZSA9PiB7XG4gICAgICAgICAgICBjb25zdCBmZWF0dXJlID1cbiAgICAgICAgICAgICAgKGZlYXR1cmVzICYmIGZlYXR1cmVzW2VkaXRIYW5kbGUucHJvcGVydGllcy5mZWF0dXJlSW5kZXhdKSB8fCB0ZW50YXRpdmVGZWF0dXJlO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JlbmRlckVkaXRIYW5kbGUoZWRpdEhhbmRsZSwgZmVhdHVyZSk7XG4gICAgICAgICAgfSl9XG4gICAgICA8L2c+XG4gICAgKTtcbiAgfTtcblxuICBfcmVuZGVyUG9pbnQgPSAoZmVhdHVyZTogRmVhdHVyZSwgaW5kZXg6IG51bWJlciwgcGF0aDogc3RyaW5nKSA9PiB7XG4gICAgY29uc3QgcmVuZGVyU3RhdGUgPSB0aGlzLl9nZXRGZWF0dXJlUmVuZGVyU3RhdGUoaW5kZXgpO1xuICAgIGNvbnN0IHsgZmVhdHVyZVN0eWxlLCBmZWF0dXJlU2hhcGUsIGNsaWNrUmFkaXVzIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHNoYXBlID0gdGhpcy5fZ2V0U3R5bGVQcm9wKGZlYXR1cmVTaGFwZSwgeyBmZWF0dXJlLCBpbmRleCwgc3RhdGU6IHJlbmRlclN0YXRlIH0pO1xuICAgIGNvbnN0IHN0eWxlID0gdGhpcy5fZ2V0U3R5bGVQcm9wKGZlYXR1cmVTdHlsZSwgeyBmZWF0dXJlLCBpbmRleCwgc3RhdGU6IHJlbmRlclN0YXRlIH0pO1xuXG4gICAgY29uc3QgZWxlbUtleSA9IGBmZWF0dXJlLiR7aW5kZXh9YDtcbiAgICBpZiAoc2hhcGUgPT09ICdyZWN0Jykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGcga2V5PXtlbGVtS2V5fSB0cmFuc2Zvcm09e2B0cmFuc2xhdGUoJHtwYXRoWzBdWzBdfSwgJHtwYXRoWzBdWzFdfSlgfT5cbiAgICAgICAgICA8cmVjdFxuICAgICAgICAgICAgZGF0YS10eXBlPXtFTEVNRU5UX1RZUEUuRkVBVFVSRX1cbiAgICAgICAgICAgIGRhdGEtZmVhdHVyZS1pbmRleD17aW5kZXh9XG4gICAgICAgICAgICBrZXk9e2Ake2VsZW1LZXl9LmhpZGRlbmB9XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAuLi5zdHlsZSxcbiAgICAgICAgICAgICAgd2lkdGg6IGNsaWNrUmFkaXVzLFxuICAgICAgICAgICAgICBoZWlnaHQ6IGNsaWNrUmFkaXVzLFxuICAgICAgICAgICAgICBmaWxsOiAnIzAwMCcsXG4gICAgICAgICAgICAgIGZpbGxPcGFjaXR5OiAwXG4gICAgICAgICAgICB9fVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPHJlY3RcbiAgICAgICAgICAgIGRhdGEtdHlwZT17RUxFTUVOVF9UWVBFLkZFQVRVUkV9XG4gICAgICAgICAgICBkYXRhLWZlYXR1cmUtaW5kZXg9e2luZGV4fVxuICAgICAgICAgICAga2V5PXtlbGVtS2V5fVxuICAgICAgICAgICAgc3R5bGU9e3N0eWxlfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZz5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxnIGtleT17YGZlYXR1cmUuJHtpbmRleH1gfSB0cmFuc2Zvcm09e2B0cmFuc2xhdGUoJHtwYXRoWzBdWzBdfSwgJHtwYXRoWzBdWzFdfSlgfT5cbiAgICAgICAgPGNpcmNsZVxuICAgICAgICAgIGRhdGEtdHlwZT17RUxFTUVOVF9UWVBFLkZFQVRVUkV9XG4gICAgICAgICAgZGF0YS1mZWF0dXJlLWluZGV4PXtpbmRleH1cbiAgICAgICAgICBrZXk9e2Ake2VsZW1LZXl9LmhpZGRlbmB9XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIC4uLnN0eWxlLFxuICAgICAgICAgICAgb3BhY2l0eTogMFxuICAgICAgICAgIH19XG4gICAgICAgICAgY3g9ezB9XG4gICAgICAgICAgY3k9ezB9XG4gICAgICAgICAgcj17Y2xpY2tSYWRpdXN9XG4gICAgICAgIC8+XG4gICAgICAgIDxjaXJjbGVcbiAgICAgICAgICBkYXRhLXR5cGU9e0VMRU1FTlRfVFlQRS5GRUFUVVJFfVxuICAgICAgICAgIGRhdGEtZmVhdHVyZS1pbmRleD17aW5kZXh9XG4gICAgICAgICAga2V5PXtlbGVtS2V5fVxuICAgICAgICAgIHN0eWxlPXtzdHlsZX1cbiAgICAgICAgICBjeD17MH1cbiAgICAgICAgICBjeT17MH1cbiAgICAgICAgLz5cbiAgICAgIDwvZz5cbiAgICApO1xuICB9O1xuXG4gIF9yZW5kZXJQYXRoID0gKGZlYXR1cmU6IEZlYXR1cmUsIGluZGV4OiBudW1iZXIsIHBhdGg6IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IHsgZmVhdHVyZVN0eWxlLCBjbGlja1JhZGl1cyB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBzZWxlY3RlZEZlYXR1cmVJbmRleCA9IHRoaXMuX2dldFNlbGVjdGVkRmVhdHVyZUluZGV4KCk7XG4gICAgY29uc3Qgc2VsZWN0ZWQgPSBpbmRleCA9PT0gc2VsZWN0ZWRGZWF0dXJlSW5kZXg7XG4gICAgY29uc3QgcmVuZGVyU3RhdGUgPSB0aGlzLl9nZXRGZWF0dXJlUmVuZGVyU3RhdGUoaW5kZXgpO1xuICAgIGNvbnN0IHN0eWxlID0gdGhpcy5fZ2V0U3R5bGVQcm9wKGZlYXR1cmVTdHlsZSwgeyBmZWF0dXJlLCBpbmRleCwgc3RhdGU6IHJlbmRlclN0YXRlIH0pO1xuXG4gICAgY29uc3QgZWxlbUtleSA9IGBmZWF0dXJlLiR7aW5kZXh9YDtcbiAgICBpZiAoc2VsZWN0ZWQpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxnIGtleT17ZWxlbUtleX0+e3RoaXMuX3JlbmRlclNlZ21lbnRzKGluZGV4LCBmZWF0dXJlLmdlb21ldHJ5LmNvb3JkaW5hdGVzLCBzdHlsZSl9PC9nPlxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBmaXJzdCA8cGF0aD4gaXMgdG8gbWFrZSBwYXRoIGVhc2lseSBpbnRlcmFjdGVkIHdpdGhcbiAgICByZXR1cm4gKFxuICAgICAgPGcga2V5PXtlbGVtS2V5fT5cbiAgICAgICAgPHBhdGhcbiAgICAgICAgICBkYXRhLXR5cGU9e0VMRU1FTlRfVFlQRS5GRUFUVVJFfVxuICAgICAgICAgIGRhdGEtZmVhdHVyZS1pbmRleD17aW5kZXh9XG4gICAgICAgICAga2V5PXtgJHtlbGVtS2V5fS5oaWRkZW5gfVxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAuLi5zdHlsZSxcbiAgICAgICAgICAgIHN0cm9rZVdpZHRoOiBjbGlja1JhZGl1cyxcbiAgICAgICAgICAgIG9wYWNpdHk6IDBcbiAgICAgICAgICB9fVxuICAgICAgICAgIGQ9e3BhdGh9XG4gICAgICAgIC8+XG4gICAgICAgIDxwYXRoXG4gICAgICAgICAgZGF0YS10eXBlPXtFTEVNRU5UX1RZUEUuRkVBVFVSRX1cbiAgICAgICAgICBkYXRhLWZlYXR1cmUtaW5kZXg9e2luZGV4fVxuICAgICAgICAgIGtleT17ZWxlbUtleX1cbiAgICAgICAgICBzdHlsZT17c3R5bGV9XG4gICAgICAgICAgZD17cGF0aH1cbiAgICAgICAgLz5cbiAgICAgIDwvZz5cbiAgICApO1xuICB9O1xuXG4gIF9yZW5kZXJQb2x5Z29uID0gKGZlYXR1cmU6IEZlYXR1cmUsIGluZGV4OiBudW1iZXIsIHBhdGg6IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IHsgZmVhdHVyZVN0eWxlIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHNlbGVjdGVkRmVhdHVyZUluZGV4ID0gdGhpcy5fZ2V0U2VsZWN0ZWRGZWF0dXJlSW5kZXgoKTtcbiAgICBjb25zdCBzZWxlY3RlZCA9IGluZGV4ID09PSBzZWxlY3RlZEZlYXR1cmVJbmRleDtcblxuICAgIGNvbnN0IHJlbmRlclN0YXRlID0gdGhpcy5fZ2V0RmVhdHVyZVJlbmRlclN0YXRlKGluZGV4KTtcbiAgICBjb25zdCBzdHlsZSA9IHRoaXMuX2dldFN0eWxlUHJvcChmZWF0dXJlU3R5bGUsIHsgZmVhdHVyZSwgaW5kZXgsIHN0YXRlOiByZW5kZXJTdGF0ZSB9KTtcblxuICAgIGNvbnN0IGVsZW1LZXkgPSBgZmVhdHVyZS4ke2luZGV4fWA7XG4gICAgaWYgKHNlbGVjdGVkKSB7XG4gICAgICBjb25zdCBjb29yZGluYXRlcyA9IGdldEZlYXR1cmVDb29yZGluYXRlcyhmZWF0dXJlKTtcbiAgICAgIGlmICghY29vcmRpbmF0ZXMpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZyBrZXk9e2VsZW1LZXl9PlxuICAgICAgICAgIHt0aGlzLl9yZW5kZXJGaWxsKGluZGV4LCBjb29yZGluYXRlcywgc3R5bGUpfVxuICAgICAgICAgIHt0aGlzLl9yZW5kZXJTZWdtZW50cyhpbmRleCwgY29vcmRpbmF0ZXMsIHN0eWxlKX1cbiAgICAgICAgPC9nPlxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPHBhdGhcbiAgICAgICAgZGF0YS10eXBlPXtFTEVNRU5UX1RZUEUuRkVBVFVSRX1cbiAgICAgICAgZGF0YS1mZWF0dXJlLWluZGV4PXtpbmRleH1cbiAgICAgICAga2V5PXtlbGVtS2V5fVxuICAgICAgICBzdHlsZT17c3R5bGV9XG4gICAgICAgIGQ9e3BhdGh9XG4gICAgICAvPlxuICAgICk7XG4gIH07XG5cbiAgX3JlbmRlckZlYXR1cmUgPSAoZmVhdHVyZTogRmVhdHVyZSwgaW5kZXg6IG51bWJlcikgPT4ge1xuICAgIGNvbnN0IGNvb3JkaW5hdGVzID0gZ2V0RmVhdHVyZUNvb3JkaW5hdGVzKGZlYXR1cmUpO1xuICAgIGlmICghY29vcmRpbmF0ZXMgfHwgIWNvb3JkaW5hdGVzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3Qge1xuICAgICAgcHJvcGVydGllczogeyByZW5kZXJUeXBlIH0sXG4gICAgICBnZW9tZXRyeTogeyB0eXBlIH1cbiAgICB9ID0gZmVhdHVyZTtcbiAgICBjb25zdCBwYXRoID0gdGhpcy5fZ2V0UGF0aEluU2NyZWVuQ29vcmRzKGNvb3JkaW5hdGVzLCB0eXBlKTtcbiAgICBpZiAoIXBhdGgpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHN3aXRjaCAocmVuZGVyVHlwZSkge1xuICAgICAgY2FzZSBSRU5ERVJfVFlQRS5QT0lOVDpcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlbmRlclBvaW50KGZlYXR1cmUsIGluZGV4LCBwYXRoKTtcbiAgICAgIGNhc2UgUkVOREVSX1RZUEUuTElORV9TVFJJTkc6XG4gICAgICAgIHJldHVybiB0aGlzLl9yZW5kZXJQYXRoKGZlYXR1cmUsIGluZGV4LCBwYXRoKTtcblxuICAgICAgY2FzZSBSRU5ERVJfVFlQRS5QT0xZR09OOlxuICAgICAgY2FzZSBSRU5ERVJfVFlQRS5SRUNUQU5HTEU6XG4gICAgICAgIHJldHVybiB0aGlzLl9yZW5kZXJQb2x5Z29uKGZlYXR1cmUsIGluZGV4LCBwYXRoKTtcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9O1xuXG4gIF9yZW5kZXJDYW52YXMgPSAoKSA9PiB7XG4gICAgY29uc3QgZmVhdHVyZXMgPSB0aGlzLmdldEZlYXR1cmVzKCk7XG4gICAgY29uc3QgZ3VpZGVzID0gdGhpcy5fbW9kZUhhbmRsZXIgJiYgdGhpcy5fbW9kZUhhbmRsZXIuZ2V0R3VpZGVzKHRoaXMuZ2V0TW9kZVByb3BzKCkpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxzdmcga2V5PVwiZHJhdy1jYW52YXNcIiB3aWR0aD1cIjEwMCVcIiBoZWlnaHQ9XCIxMDAlXCI+XG4gICAgICAgIHtmZWF0dXJlcyAmJlxuICAgICAgICAgIGZlYXR1cmVzLmxlbmd0aCA+IDAgJiYgPGcga2V5PVwiZmVhdHVyZS1ncm91cFwiPntmZWF0dXJlcy5tYXAodGhpcy5fcmVuZGVyRmVhdHVyZSl9PC9nPn1cbiAgICAgICAge2d1aWRlcyAmJiA8ZyBrZXk9XCJmZWF0dXJlLWd1aWRlc1wiPnt0aGlzLl9yZW5kZXJHdWlkZXMoZ3VpZGVzKX08L2c+fVxuICAgICAgPC9zdmc+XG4gICAgKTtcbiAgfTtcblxuICBfcmVuZGVyRWRpdG9yID0gKCkgPT4ge1xuICAgIGNvbnN0IHZpZXdwb3J0ID0gKHRoaXMuX2NvbnRleHQgJiYgdGhpcy5fY29udGV4dC52aWV3cG9ydCkgfHwge307XG4gICAgY29uc3QgeyBzdHlsZSB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQgfSA9IHZpZXdwb3J0O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgaWQ9XCJlZGl0b3JcIlxuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIHdpZHRoLFxuICAgICAgICAgIGhlaWdodCxcbiAgICAgICAgICAuLi5zdHlsZVxuICAgICAgICB9fVxuICAgICAgICByZWY9e18gPT4ge1xuICAgICAgICAgIHRoaXMuX2NvbnRhaW5lclJlZiA9IF87XG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIHt0aGlzLl9yZW5kZXJDYW52YXMoKX1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiBzdXBlci5yZW5kZXIodGhpcy5fcmVuZGVyRWRpdG9yKCkpO1xuICB9XG59XG4iXX0=