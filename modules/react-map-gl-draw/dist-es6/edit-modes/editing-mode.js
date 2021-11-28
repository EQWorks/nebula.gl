"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _constants = require("../constants");

var _baseMode = _interopRequireDefault(require("./base-mode"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var EditingMode =
/*#__PURE__*/
function (_BaseMode) {
  _inherits(EditingMode, _BaseMode);

  function EditingMode() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, EditingMode);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(EditingMode)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleClick", function (event, props) {
      var pickedObject = event.picks && event.picks[0] && event.picks[0].object;
      var selectedFeatureIndex = props.selectedIndexes && props.selectedIndexes[0];

      if (!pickedObject || pickedObject.featureIndex !== selectedFeatureIndex) {
        return;
      }

      var featureIndex = pickedObject.featureIndex,
          index = pickedObject.index;

      var feature = _this.getSelectedFeature(props, featureIndex);

      if (feature && (feature.geometry.type === _constants.RENDER_TYPE.POLYGON || feature.geometry.type === _constants.RENDER_TYPE.LINE_STRING) && pickedObject.type === _constants.ELEMENT_TYPE.SEGMENT) {
        var coordinates = (0, _utils.getFeatureCoordinates)(feature);

        if (!coordinates) {
          return;
        }

        var insertIndex = (index + 1) % coordinates.length;
        var positionIndexes = feature.geometry.type === _constants.RENDER_TYPE.POLYGON ? [0, insertIndex] : [insertIndex];

        var insertMapCoords = _this._getPointOnSegment(feature, pickedObject, event.mapCoords);

        var updatedData = props.data.addPosition(featureIndex, positionIndexes, insertMapCoords).getObject();
        props.onEdit({
          editType: _constants.EDIT_TYPE.ADD_POSITION,
          updatedData: updatedData,
          editContext: {
            positionIndexes: positionIndexes,
            position: insertMapCoords
          }
        });
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_handleDragging", function (event, props) {
      var onEdit = props.onEdit;

      var selectedFeature = _this.getSelectedFeature(props); // nothing clicked


      var isDragging = event.isDragging,
          pointerDownPicks = event.pointerDownPicks,
          screenCoords = event.screenCoords;
      var lastPointerMoveEvent = props.lastPointerMoveEvent;
      var clickedObject = pointerDownPicks && pointerDownPicks[0] && pointerDownPicks[0].object;

      if (!clickedObject || !(0, _utils.isNumeric)(clickedObject.featureIndex)) {
        return;
      }

      var editHandleIndex = clickedObject.index; // not dragging

      var updatedData = null;
      var editType = isDragging ? _constants.EDIT_TYPE.MOVE_POSITION : _constants.EDIT_TYPE.FINISH_MOVE_POSITION;

      switch (clickedObject.type) {
        case _constants.ELEMENT_TYPE.FEATURE:
        case _constants.ELEMENT_TYPE.FILL:
        case _constants.ELEMENT_TYPE.SEGMENT:
          // dragging feature
          var dx = screenCoords[0] - lastPointerMoveEvent.screenCoords[0];
          var dy = screenCoords[1] - lastPointerMoveEvent.screenCoords[1];
          updatedData = _this._updateFeature(props, 'feature', {
            dx: dx,
            dy: dy
          });
          onEdit({
            editType: editType,
            updatedData: updatedData,
            editContext: null
          });
          break;

        case _constants.ELEMENT_TYPE.EDIT_HANDLE:
          // dragging editHandle
          // dragging rectangle or other shapes
          var updateType = selectedFeature.properties.renderType === _constants.RENDER_TYPE.RECTANGLE ? 'rectangle' : 'editHandle';
          updatedData = _this._updateFeature(props, updateType, {
            editHandleIndex: editHandleIndex,
            mapCoords: event.mapCoords
          });
          onEdit({
            editType: editType,
            updatedData: updatedData,
            editContext: null
          });
          break;

        default:
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handlePointerMove", function (event, props) {
      // no selected feature
      var selectedFeature = _this.getSelectedFeature(props);

      if (!selectedFeature) {
        return;
      }

      if (!event.isDragging) {
        return;
      }

      _this._handleDragging(event, props);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_updateFeature", function (props, type) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var data = props.data,
          selectedIndexes = props.selectedIndexes,
          viewport = props.viewport;
      var featureIndex = selectedIndexes && selectedIndexes[0];

      var feature = _this.getSelectedFeature(props, featureIndex);

      var geometry = null;
      var coordinates = (0, _utils.getFeatureCoordinates)(feature);

      if (!coordinates) {
        return null;
      }

      var newCoordinates = _toConsumableArray(coordinates);

      switch (type) {
        case 'editHandle':
          var positionIndexes = feature.geometry.type === _constants.GEOJSON_TYPE.POLYGON ? [0, options.editHandleIndex] : [options.editHandleIndex];
          return data.replacePosition(featureIndex, positionIndexes, options.mapCoords).getObject();

        case 'feature':
          var dx = options.dx,
              dy = options.dy;
          newCoordinates = newCoordinates.map(function (mapCoords) {
            var pixels = viewport && viewport.project(mapCoords);

            if (pixels) {
              pixels[0] += dx;
              pixels[1] += dy;
              return viewport && viewport.unproject(pixels);
            }

            return null;
          }).filter(Boolean);
          geometry = {
            type: feature.geometry.type,
            coordinates: feature.geometry.type === _constants.GEOJSON_TYPE.POLYGON ? [newCoordinates] : newCoordinates
          };
          return data.replaceGeometry(featureIndex, geometry).getObject();

        case 'rectangle':
          // moved editHandleIndex and destination mapCoords
          newCoordinates = (0, _utils.updateRectanglePosition)(feature, options.editHandleIndex, options.mapCoords);
          geometry = {
            type: _constants.GEOJSON_TYPE.POLYGON,
            coordinates: newCoordinates
          };
          return data.replaceGeometry(featureIndex, geometry).getObject();

        default:
          return data && data.getObject();
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_getCursorEditHandle", function (event, feature) {
      var isDragging = event.isDragging,
          picks = event.picks; // if not pick segment

      var pickedObject = picks && picks[0] && picks[0].object;

      if (!pickedObject || !(0, _utils.isNumeric)(pickedObject.featureIndex) || pickedObject.type !== _constants.ELEMENT_TYPE.SEGMENT) {
        return null;
      } // if dragging or feature is neither polygon nor line string


      if (isDragging || feature.properties.renderType !== _constants.GEOJSON_TYPE.POLYGON && feature.properties.renderType !== _constants.GEOJSON_TYPE.LINE_STRING) {
        return null;
      }

      var insertMapCoords = _this._getPointOnSegment(feature, pickedObject, event.mapCoords);

      if (!insertMapCoords) {
        return null;
      }

      return {
        type: 'Feature',
        properties: {
          guideType: _constants.GUIDE_TYPE.CURSOR_EDIT_HANDLE,
          renderType: feature.properties.renderType,
          positionIndexes: [null]
        },
        geometry: {
          type: _constants.GEOJSON_TYPE.POINT,
          coordinates: [insertMapCoords]
        }
      };
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "getGuides", function (props) {
      var selectedFeature = _this.getSelectedFeature(props);

      var selectedFeatureIndex = props.selectedIndexes && props.selectedIndexes[0];

      if (!selectedFeature || selectedFeature.geometry.type === _constants.GEOJSON_TYPE.POINT) {
        return null;
      }

      var event = props.lastPointerMoveEvent; // feature editHandles

      var editHandles = _this.getEditHandlesFromFeature(selectedFeature, selectedFeatureIndex) || []; // cursor editHandle

      var cursorEditHandle = _this._getCursorEditHandle(event, selectedFeature);

      if (cursorEditHandle) {
        editHandles.push(_this._getCursorEditHandle(event, selectedFeature));
      }

      return {
        editHandles: editHandles.length ? editHandles : null
      };
    });

    return _this;
  }

  _createClass(EditingMode, [{
    key: "handleStopDragging",
    value: function handleStopDragging(event, props) {
      // replace point
      var pickedObject = event.picks && event.picks[0] && event.picks[0].object;

      if (!pickedObject || !(0, _utils.isNumeric)(pickedObject.featureIndex)) {
        return;
      }

      switch (pickedObject.type) {
        case _constants.ELEMENT_TYPE.FEATURE:
        case _constants.ELEMENT_TYPE.EDIT_HANDLE:
          this._handleDragging(event, props);

          break;

        default:
      }
    }
  }, {
    key: "_getPointOnSegment",
    value: function _getPointOnSegment(feature, pickedObject, pickedMapCoords) {
      var coordinates = (0, _utils.getFeatureCoordinates)(feature);

      if (!coordinates) {
        return null;
      }

      var srcVertexIndex = pickedObject.index;
      var targetVertexIndex = pickedObject.index + 1;
      return (0, _utils.findClosestPointOnLineSegment)(coordinates[srcVertexIndex], coordinates[targetVertexIndex], pickedMapCoords);
    }
  }]);

  return EditingMode;
}(_baseMode.default);

exports.default = EditingMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lZGl0LW1vZGVzL2VkaXRpbmctbW9kZS5qcyJdLCJuYW1lcyI6WyJFZGl0aW5nTW9kZSIsImV2ZW50IiwicHJvcHMiLCJwaWNrZWRPYmplY3QiLCJwaWNrcyIsIm9iamVjdCIsInNlbGVjdGVkRmVhdHVyZUluZGV4Iiwic2VsZWN0ZWRJbmRleGVzIiwiZmVhdHVyZUluZGV4IiwiaW5kZXgiLCJmZWF0dXJlIiwiZ2V0U2VsZWN0ZWRGZWF0dXJlIiwiZ2VvbWV0cnkiLCJ0eXBlIiwiUkVOREVSX1RZUEUiLCJQT0xZR09OIiwiTElORV9TVFJJTkciLCJFTEVNRU5UX1RZUEUiLCJTRUdNRU5UIiwiY29vcmRpbmF0ZXMiLCJpbnNlcnRJbmRleCIsImxlbmd0aCIsInBvc2l0aW9uSW5kZXhlcyIsImluc2VydE1hcENvb3JkcyIsIl9nZXRQb2ludE9uU2VnbWVudCIsIm1hcENvb3JkcyIsInVwZGF0ZWREYXRhIiwiZGF0YSIsImFkZFBvc2l0aW9uIiwiZ2V0T2JqZWN0Iiwib25FZGl0IiwiZWRpdFR5cGUiLCJFRElUX1RZUEUiLCJBRERfUE9TSVRJT04iLCJlZGl0Q29udGV4dCIsInBvc2l0aW9uIiwic2VsZWN0ZWRGZWF0dXJlIiwiaXNEcmFnZ2luZyIsInBvaW50ZXJEb3duUGlja3MiLCJzY3JlZW5Db29yZHMiLCJsYXN0UG9pbnRlck1vdmVFdmVudCIsImNsaWNrZWRPYmplY3QiLCJlZGl0SGFuZGxlSW5kZXgiLCJNT1ZFX1BPU0lUSU9OIiwiRklOSVNIX01PVkVfUE9TSVRJT04iLCJGRUFUVVJFIiwiRklMTCIsImR4IiwiZHkiLCJfdXBkYXRlRmVhdHVyZSIsIkVESVRfSEFORExFIiwidXBkYXRlVHlwZSIsInByb3BlcnRpZXMiLCJyZW5kZXJUeXBlIiwiUkVDVEFOR0xFIiwiX2hhbmRsZURyYWdnaW5nIiwib3B0aW9ucyIsInZpZXdwb3J0IiwibmV3Q29vcmRpbmF0ZXMiLCJHRU9KU09OX1RZUEUiLCJyZXBsYWNlUG9zaXRpb24iLCJtYXAiLCJwaXhlbHMiLCJwcm9qZWN0IiwidW5wcm9qZWN0IiwiZmlsdGVyIiwiQm9vbGVhbiIsInJlcGxhY2VHZW9tZXRyeSIsImd1aWRlVHlwZSIsIkdVSURFX1RZUEUiLCJDVVJTT1JfRURJVF9IQU5ETEUiLCJQT0lOVCIsImVkaXRIYW5kbGVzIiwiZ2V0RWRpdEhhbmRsZXNGcm9tRmVhdHVyZSIsImN1cnNvckVkaXRIYW5kbGUiLCJfZ2V0Q3Vyc29yRWRpdEhhbmRsZSIsInB1c2giLCJwaWNrZWRNYXBDb29yZHMiLCJzcmNWZXJ0ZXhJbmRleCIsInRhcmdldFZlcnRleEluZGV4IiwiQmFzZU1vZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFZQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFPcUJBLFc7Ozs7Ozs7Ozs7Ozs7Ozs7OzswRkFDTCxVQUFDQyxLQUFELEVBQW9CQyxLQUFwQixFQUE0RDtBQUN4RSxVQUFNQyxZQUFZLEdBQUdGLEtBQUssQ0FBQ0csS0FBTixJQUFlSCxLQUFLLENBQUNHLEtBQU4sQ0FBWSxDQUFaLENBQWYsSUFBaUNILEtBQUssQ0FBQ0csS0FBTixDQUFZLENBQVosRUFBZUMsTUFBckU7QUFDQSxVQUFNQyxvQkFBb0IsR0FBR0osS0FBSyxDQUFDSyxlQUFOLElBQXlCTCxLQUFLLENBQUNLLGVBQU4sQ0FBc0IsQ0FBdEIsQ0FBdEQ7O0FBQ0EsVUFBSSxDQUFDSixZQUFELElBQWlCQSxZQUFZLENBQUNLLFlBQWIsS0FBOEJGLG9CQUFuRCxFQUF5RTtBQUN2RTtBQUNEOztBQUx1RSxVQU9oRUUsWUFQZ0UsR0FPeENMLFlBUHdDLENBT2hFSyxZQVBnRTtBQUFBLFVBT2xEQyxLQVBrRCxHQU94Q04sWUFQd0MsQ0FPbERNLEtBUGtEOztBQVF4RSxVQUFNQyxPQUFPLEdBQUcsTUFBS0Msa0JBQUwsQ0FBd0JULEtBQXhCLEVBQStCTSxZQUEvQixDQUFoQjs7QUFDQSxVQUNFRSxPQUFPLEtBQ05BLE9BQU8sQ0FBQ0UsUUFBUixDQUFpQkMsSUFBakIsS0FB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Q0FBWSxDQUFaLEVBQWVDLE1BQXJFOztBQUNBLFVBQUksQ0FBQ0YsWUFBRCxJQUFpQixDQUFDLHNCQUFVQSxZQUFZLENBQUNLLFlBQXZCLENBQXRCLEVBQTREO0FBQzFEO0FBQ0Q7O0FBRUQsY0FBUUwsWUFBWSxDQUFDVSxJQUFyQjtBQUNFLGFBQUtJLHdCQUFhNEIsT0FBbEI7QUFDQSxhQUFLNUIsd0JBQWFpQyxXQUFsQjtBQUNFLGVBQUtLLGVBQUwsQ0FBcUJ0RCxLQUFyQixFQUE0QkMsS0FBNUI7O0FBQ0E7O0FBQ0Y7QUFMRjtBQU9EOzs7dUNBNklrQlEsTyxFQUFrQlAsWSxFQUFtQjBFLGUsRUFBMkI7QUFDakYsVUFBTTFELFdBQVcsR0FBRyxrQ0FBc0JULE9BQXRCLENBQXBCOztBQUNBLFVBQUksQ0FBQ1MsV0FBTCxFQUFrQjtBQUNoQixlQUFPLElBQVA7QUFDRDs7QUFDRCxVQUFNMkQsY0FBYyxHQUFHM0UsWUFBWSxDQUFDTSxLQUFwQztBQUNBLFVBQU1zRSxpQkFBaUIsR0FBRzVFLFlBQVksQ0FBQ00sS0FBYixHQUFxQixDQUEvQztBQUNBLGFBQU8sMENBQ0xVLFdBQVcsQ0FBQzJELGNBQUQsQ0FETixFQUVMM0QsV0FBVyxDQUFDNEQsaUJBQUQsQ0FGTixFQUdMRixlQUhLLENBQVA7QUFLRDs7OztFQS9Nc0NHLGlCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuaW1wb3J0IHR5cGUge1xuICBGZWF0dXJlLFxuICBGZWF0dXJlQ29sbGVjdGlvbixcbiAgQ2xpY2tFdmVudCxcbiAgU3RvcERyYWdnaW5nRXZlbnQsXG4gIFBvaW50ZXJNb3ZlRXZlbnQsXG4gIFBvc2l0aW9uXG59IGZyb20gJ0BuZWJ1bGEuZ2wvZWRpdC1tb2Rlcyc7XG5pbXBvcnQgdHlwZSB7IE1vZGVQcm9wcyB9IGZyb20gJy4uL3R5cGVzJztcblxuaW1wb3J0IHsgUkVOREVSX1RZUEUsIEVESVRfVFlQRSwgRUxFTUVOVF9UWVBFLCBHRU9KU09OX1RZUEUsIEdVSURFX1RZUEUgfSBmcm9tICcuLi9jb25zdGFudHMnO1xuaW1wb3J0IEJhc2VNb2RlIGZyb20gJy4vYmFzZS1tb2RlJztcbmltcG9ydCB7XG4gIGZpbmRDbG9zZXN0UG9pbnRPbkxpbmVTZWdtZW50LFxuICBnZXRGZWF0dXJlQ29vcmRpbmF0ZXMsXG4gIGlzTnVtZXJpYyxcbiAgdXBkYXRlUmVjdGFuZ2xlUG9zaXRpb25cbn0gZnJvbSAnLi91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVkaXRpbmdNb2RlIGV4dGVuZHMgQmFzZU1vZGUge1xuICBoYW5kbGVDbGljayA9IChldmVudDogQ2xpY2tFdmVudCwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pID0+IHtcbiAgICBjb25zdCBwaWNrZWRPYmplY3QgPSBldmVudC5waWNrcyAmJiBldmVudC5waWNrc1swXSAmJiBldmVudC5waWNrc1swXS5vYmplY3Q7XG4gICAgY29uc3Qgc2VsZWN0ZWRGZWF0dXJlSW5kZXggPSBwcm9wcy5zZWxlY3RlZEluZGV4ZXMgJiYgcHJvcHMuc2VsZWN0ZWRJbmRleGVzWzBdO1xuICAgIGlmICghcGlja2VkT2JqZWN0IHx8IHBpY2tlZE9iamVjdC5mZWF0dXJlSW5kZXggIT09IHNlbGVjdGVkRmVhdHVyZUluZGV4KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgeyBmZWF0dXJlSW5kZXgsIGluZGV4IH0gPSBwaWNrZWRPYmplY3Q7XG4gICAgY29uc3QgZmVhdHVyZSA9IHRoaXMuZ2V0U2VsZWN0ZWRGZWF0dXJlKHByb3BzLCBmZWF0dXJlSW5kZXgpO1xuICAgIGlmIChcbiAgICAgIGZlYXR1cmUgJiZcbiAgICAgIChmZWF0dXJlLmdlb21ldHJ5LnR5cGUgPT09IFJFTkRFUl9UWVBFLlBPTFlHT04gfHxcbiAgICAgICAgZmVhdHVyZS5nZW9tZXRyeS50eXBlID09PSBSRU5ERVJfVFlQRS5MSU5FX1NUUklORykgJiZcbiAgICAgIHBpY2tlZE9iamVjdC50eXBlID09PSBFTEVNRU5UX1RZUEUuU0VHTUVOVFxuICAgICkge1xuICAgICAgY29uc3QgY29vcmRpbmF0ZXMgPSBnZXRGZWF0dXJlQ29vcmRpbmF0ZXMoZmVhdHVyZSk7XG4gICAgICBpZiAoIWNvb3JkaW5hdGVzKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGluc2VydEluZGV4ID0gKGluZGV4ICsgMSkgJSBjb29yZGluYXRlcy5sZW5ndGg7XG4gICAgICBjb25zdCBwb3NpdGlvbkluZGV4ZXMgPVxuICAgICAgICBmZWF0dXJlLmdlb21ldHJ5LnR5cGUgPT09IFJFTkRFUl9UWVBFLlBPTFlHT04gPyBbMCwgaW5zZXJ0SW5kZXhdIDogW2luc2VydEluZGV4XTtcbiAgICAgIGNvbnN0IGluc2VydE1hcENvb3JkcyA9IHRoaXMuX2dldFBvaW50T25TZWdtZW50KGZlYXR1cmUsIHBpY2tlZE9iamVjdCwgZXZlbnQubWFwQ29vcmRzKTtcblxuICAgICAgY29uc3QgdXBkYXRlZERhdGEgPSBwcm9wcy5kYXRhXG4gICAgICAgIC5hZGRQb3NpdGlvbihmZWF0dXJlSW5kZXgsIHBvc2l0aW9uSW5kZXhlcywgaW5zZXJ0TWFwQ29vcmRzKVxuICAgICAgICAuZ2V0T2JqZWN0KCk7XG5cbiAgICAgIHByb3BzLm9uRWRpdCh7XG4gICAgICAgIGVkaXRUeXBlOiBFRElUX1RZUEUuQUREX1BPU0lUSU9OLFxuICAgICAgICB1cGRhdGVkRGF0YSxcbiAgICAgICAgZWRpdENvbnRleHQ6IHtcbiAgICAgICAgICBwb3NpdGlvbkluZGV4ZXMsXG4gICAgICAgICAgcG9zaXRpb246IGluc2VydE1hcENvb3Jkc1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgaGFuZGxlU3RvcERyYWdnaW5nKGV2ZW50OiBTdG9wRHJhZ2dpbmdFdmVudCwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pIHtcbiAgICAvLyByZXBsYWNlIHBvaW50XG4gICAgY29uc3QgcGlja2VkT2JqZWN0ID0gZXZlbnQucGlja3MgJiYgZXZlbnQucGlja3NbMF0gJiYgZXZlbnQucGlja3NbMF0ub2JqZWN0O1xuICAgIGlmICghcGlja2VkT2JqZWN0IHx8ICFpc051bWVyaWMocGlja2VkT2JqZWN0LmZlYXR1cmVJbmRleCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzd2l0Y2ggKHBpY2tlZE9iamVjdC50eXBlKSB7XG4gICAgICBjYXNlIEVMRU1FTlRfVFlQRS5GRUFUVVJFOlxuICAgICAgY2FzZSBFTEVNRU5UX1RZUEUuRURJVF9IQU5ETEU6XG4gICAgICAgIHRoaXMuX2hhbmRsZURyYWdnaW5nKGV2ZW50LCBwcm9wcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICB9XG4gIH1cblxuICBfaGFuZGxlRHJhZ2dpbmcgPSAoXG4gICAgZXZlbnQ6IFBvaW50ZXJNb3ZlRXZlbnQgfCBTdG9wRHJhZ2dpbmdFdmVudCxcbiAgICBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPlxuICApID0+IHtcbiAgICBjb25zdCB7IG9uRWRpdCB9ID0gcHJvcHM7XG4gICAgY29uc3Qgc2VsZWN0ZWRGZWF0dXJlID0gdGhpcy5nZXRTZWxlY3RlZEZlYXR1cmUocHJvcHMpO1xuICAgIC8vIG5vdGhpbmcgY2xpY2tlZFxuICAgIGNvbnN0IHsgaXNEcmFnZ2luZywgcG9pbnRlckRvd25QaWNrcywgc2NyZWVuQ29vcmRzIH0gPSBldmVudDtcbiAgICBjb25zdCB7IGxhc3RQb2ludGVyTW92ZUV2ZW50IH0gPSBwcm9wcztcblxuICAgIGNvbnN0IGNsaWNrZWRPYmplY3QgPSBwb2ludGVyRG93blBpY2tzICYmIHBvaW50ZXJEb3duUGlja3NbMF0gJiYgcG9pbnRlckRvd25QaWNrc1swXS5vYmplY3Q7XG4gICAgaWYgKCFjbGlja2VkT2JqZWN0IHx8ICFpc051bWVyaWMoY2xpY2tlZE9iamVjdC5mZWF0dXJlSW5kZXgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgZWRpdEhhbmRsZUluZGV4ID0gY2xpY2tlZE9iamVjdC5pbmRleDtcblxuICAgIC8vIG5vdCBkcmFnZ2luZ1xuICAgIGxldCB1cGRhdGVkRGF0YSA9IG51bGw7XG4gICAgY29uc3QgZWRpdFR5cGUgPSBpc0RyYWdnaW5nID8gRURJVF9UWVBFLk1PVkVfUE9TSVRJT04gOiBFRElUX1RZUEUuRklOSVNIX01PVkVfUE9TSVRJT047XG5cbiAgICBzd2l0Y2ggKGNsaWNrZWRPYmplY3QudHlwZSkge1xuICAgICAgY2FzZSBFTEVNRU5UX1RZUEUuRkVBVFVSRTpcbiAgICAgIGNhc2UgRUxFTUVOVF9UWVBFLkZJTEw6XG4gICAgICBjYXNlIEVMRU1FTlRfVFlQRS5TRUdNRU5UOlxuICAgICAgICAvLyBkcmFnZ2luZyBmZWF0dXJlXG4gICAgICAgIGNvbnN0IGR4ID0gc2NyZWVuQ29vcmRzWzBdIC0gbGFzdFBvaW50ZXJNb3ZlRXZlbnQuc2NyZWVuQ29vcmRzWzBdO1xuICAgICAgICBjb25zdCBkeSA9IHNjcmVlbkNvb3Jkc1sxXSAtIGxhc3RQb2ludGVyTW92ZUV2ZW50LnNjcmVlbkNvb3Jkc1sxXTtcbiAgICAgICAgdXBkYXRlZERhdGEgPSB0aGlzLl91cGRhdGVGZWF0dXJlKHByb3BzLCAnZmVhdHVyZScsIHsgZHgsIGR5IH0pO1xuICAgICAgICBvbkVkaXQoe1xuICAgICAgICAgIGVkaXRUeXBlLFxuICAgICAgICAgIHVwZGF0ZWREYXRhLFxuICAgICAgICAgIGVkaXRDb250ZXh0OiBudWxsXG4gICAgICAgIH0pO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBFTEVNRU5UX1RZUEUuRURJVF9IQU5ETEU6XG4gICAgICAgIC8vIGRyYWdnaW5nIGVkaXRIYW5kbGVcbiAgICAgICAgLy8gZHJhZ2dpbmcgcmVjdGFuZ2xlIG9yIG90aGVyIHNoYXBlc1xuICAgICAgICBjb25zdCB1cGRhdGVUeXBlID1cbiAgICAgICAgICBzZWxlY3RlZEZlYXR1cmUucHJvcGVydGllcy5yZW5kZXJUeXBlID09PSBSRU5ERVJfVFlQRS5SRUNUQU5HTEVcbiAgICAgICAgICAgID8gJ3JlY3RhbmdsZSdcbiAgICAgICAgICAgIDogJ2VkaXRIYW5kbGUnO1xuICAgICAgICB1cGRhdGVkRGF0YSA9IHRoaXMuX3VwZGF0ZUZlYXR1cmUocHJvcHMsIHVwZGF0ZVR5cGUsIHtcbiAgICAgICAgICBlZGl0SGFuZGxlSW5kZXgsXG4gICAgICAgICAgbWFwQ29vcmRzOiBldmVudC5tYXBDb29yZHNcbiAgICAgICAgfSk7XG5cbiAgICAgICAgb25FZGl0KHtcbiAgICAgICAgICBlZGl0VHlwZSxcbiAgICAgICAgICB1cGRhdGVkRGF0YSxcbiAgICAgICAgICBlZGl0Q29udGV4dDogbnVsbFxuICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgfVxuICB9O1xuXG4gIGhhbmRsZVBvaW50ZXJNb3ZlID0gKGV2ZW50OiBQb2ludGVyTW92ZUV2ZW50LCBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPikgPT4ge1xuICAgIC8vIG5vIHNlbGVjdGVkIGZlYXR1cmVcbiAgICBjb25zdCBzZWxlY3RlZEZlYXR1cmUgPSB0aGlzLmdldFNlbGVjdGVkRmVhdHVyZShwcm9wcyk7XG4gICAgaWYgKCFzZWxlY3RlZEZlYXR1cmUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIWV2ZW50LmlzRHJhZ2dpbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9oYW5kbGVEcmFnZ2luZyhldmVudCwgcHJvcHMpO1xuICB9O1xuXG4gIC8vIFRPRE8gLSByZWZhY3RvclxuICBfdXBkYXRlRmVhdHVyZSA9IChwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPiwgdHlwZTogc3RyaW5nLCBvcHRpb25zOiBhbnkgPSB7fSkgPT4ge1xuICAgIGNvbnN0IHsgZGF0YSwgc2VsZWN0ZWRJbmRleGVzLCB2aWV3cG9ydCB9ID0gcHJvcHM7XG5cbiAgICBjb25zdCBmZWF0dXJlSW5kZXggPSBzZWxlY3RlZEluZGV4ZXMgJiYgc2VsZWN0ZWRJbmRleGVzWzBdO1xuICAgIGNvbnN0IGZlYXR1cmUgPSB0aGlzLmdldFNlbGVjdGVkRmVhdHVyZShwcm9wcywgZmVhdHVyZUluZGV4KTtcblxuICAgIGxldCBnZW9tZXRyeSA9IG51bGw7XG4gICAgY29uc3QgY29vcmRpbmF0ZXMgPSBnZXRGZWF0dXJlQ29vcmRpbmF0ZXMoZmVhdHVyZSk7XG4gICAgaWYgKCFjb29yZGluYXRlcykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgbGV0IG5ld0Nvb3JkaW5hdGVzID0gWy4uLmNvb3JkaW5hdGVzXTtcblxuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSAnZWRpdEhhbmRsZSc6XG4gICAgICAgIGNvbnN0IHBvc2l0aW9uSW5kZXhlcyA9XG4gICAgICAgICAgZmVhdHVyZS5nZW9tZXRyeS50eXBlID09PSBHRU9KU09OX1RZUEUuUE9MWUdPTlxuICAgICAgICAgICAgPyBbMCwgb3B0aW9ucy5lZGl0SGFuZGxlSW5kZXhdXG4gICAgICAgICAgICA6IFtvcHRpb25zLmVkaXRIYW5kbGVJbmRleF07XG5cbiAgICAgICAgcmV0dXJuIGRhdGEucmVwbGFjZVBvc2l0aW9uKGZlYXR1cmVJbmRleCwgcG9zaXRpb25JbmRleGVzLCBvcHRpb25zLm1hcENvb3JkcykuZ2V0T2JqZWN0KCk7XG5cbiAgICAgIGNhc2UgJ2ZlYXR1cmUnOlxuICAgICAgICBjb25zdCB7IGR4LCBkeSB9ID0gb3B0aW9ucztcbiAgICAgICAgbmV3Q29vcmRpbmF0ZXMgPSBuZXdDb29yZGluYXRlc1xuICAgICAgICAgIC5tYXAobWFwQ29vcmRzID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBpeGVscyA9IHZpZXdwb3J0ICYmIHZpZXdwb3J0LnByb2plY3QobWFwQ29vcmRzKTtcbiAgICAgICAgICAgIGlmIChwaXhlbHMpIHtcbiAgICAgICAgICAgICAgcGl4ZWxzWzBdICs9IGR4O1xuICAgICAgICAgICAgICBwaXhlbHNbMV0gKz0gZHk7XG4gICAgICAgICAgICAgIHJldHVybiB2aWV3cG9ydCAmJiB2aWV3cG9ydC51bnByb2plY3QocGl4ZWxzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLmZpbHRlcihCb29sZWFuKTtcblxuICAgICAgICBnZW9tZXRyeSA9IHtcbiAgICAgICAgICB0eXBlOiBmZWF0dXJlLmdlb21ldHJ5LnR5cGUsXG4gICAgICAgICAgY29vcmRpbmF0ZXM6XG4gICAgICAgICAgICBmZWF0dXJlLmdlb21ldHJ5LnR5cGUgPT09IEdFT0pTT05fVFlQRS5QT0xZR09OID8gW25ld0Nvb3JkaW5hdGVzXSA6IG5ld0Nvb3JkaW5hdGVzXG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIGRhdGEucmVwbGFjZUdlb21ldHJ5KGZlYXR1cmVJbmRleCwgZ2VvbWV0cnkpLmdldE9iamVjdCgpO1xuXG4gICAgICBjYXNlICdyZWN0YW5nbGUnOlxuICAgICAgICAvLyBtb3ZlZCBlZGl0SGFuZGxlSW5kZXggYW5kIGRlc3RpbmF0aW9uIG1hcENvb3Jkc1xuICAgICAgICBuZXdDb29yZGluYXRlcyA9IHVwZGF0ZVJlY3RhbmdsZVBvc2l0aW9uKFxuICAgICAgICAgIGZlYXR1cmUsXG4gICAgICAgICAgb3B0aW9ucy5lZGl0SGFuZGxlSW5kZXgsXG4gICAgICAgICAgb3B0aW9ucy5tYXBDb29yZHNcbiAgICAgICAgKTtcblxuICAgICAgICBnZW9tZXRyeSA9IHtcbiAgICAgICAgICB0eXBlOiBHRU9KU09OX1RZUEUuUE9MWUdPTixcbiAgICAgICAgICBjb29yZGluYXRlczogbmV3Q29vcmRpbmF0ZXNcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gZGF0YS5yZXBsYWNlR2VvbWV0cnkoZmVhdHVyZUluZGV4LCBnZW9tZXRyeSkuZ2V0T2JqZWN0KCk7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBkYXRhICYmIGRhdGEuZ2V0T2JqZWN0KCk7XG4gICAgfVxuICB9O1xuXG4gIF9nZXRQb2ludE9uU2VnbWVudChmZWF0dXJlOiBGZWF0dXJlLCBwaWNrZWRPYmplY3Q6IGFueSwgcGlja2VkTWFwQ29vcmRzOiBQb3NpdGlvbikge1xuICAgIGNvbnN0IGNvb3JkaW5hdGVzID0gZ2V0RmVhdHVyZUNvb3JkaW5hdGVzKGZlYXR1cmUpO1xuICAgIGlmICghY29vcmRpbmF0ZXMpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBzcmNWZXJ0ZXhJbmRleCA9IHBpY2tlZE9iamVjdC5pbmRleDtcbiAgICBjb25zdCB0YXJnZXRWZXJ0ZXhJbmRleCA9IHBpY2tlZE9iamVjdC5pbmRleCArIDE7XG4gICAgcmV0dXJuIGZpbmRDbG9zZXN0UG9pbnRPbkxpbmVTZWdtZW50KFxuICAgICAgY29vcmRpbmF0ZXNbc3JjVmVydGV4SW5kZXhdLFxuICAgICAgY29vcmRpbmF0ZXNbdGFyZ2V0VmVydGV4SW5kZXhdLFxuICAgICAgcGlja2VkTWFwQ29vcmRzXG4gICAgKTtcbiAgfVxuXG4gIF9nZXRDdXJzb3JFZGl0SGFuZGxlID0gKGV2ZW50OiBQb2ludGVyTW92ZUV2ZW50LCBmZWF0dXJlOiBGZWF0dXJlKSA9PiB7XG4gICAgY29uc3QgeyBpc0RyYWdnaW5nLCBwaWNrcyB9ID0gZXZlbnQ7XG4gICAgLy8gaWYgbm90IHBpY2sgc2VnbWVudFxuICAgIGNvbnN0IHBpY2tlZE9iamVjdCA9IHBpY2tzICYmIHBpY2tzWzBdICYmIHBpY2tzWzBdLm9iamVjdDtcbiAgICBpZiAoXG4gICAgICAhcGlja2VkT2JqZWN0IHx8XG4gICAgICAhaXNOdW1lcmljKHBpY2tlZE9iamVjdC5mZWF0dXJlSW5kZXgpIHx8XG4gICAgICBwaWNrZWRPYmplY3QudHlwZSAhPT0gRUxFTUVOVF9UWVBFLlNFR01FTlRcbiAgICApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIGlmIGRyYWdnaW5nIG9yIGZlYXR1cmUgaXMgbmVpdGhlciBwb2x5Z29uIG5vciBsaW5lIHN0cmluZ1xuICAgIGlmIChcbiAgICAgIGlzRHJhZ2dpbmcgfHxcbiAgICAgIChmZWF0dXJlLnByb3BlcnRpZXMucmVuZGVyVHlwZSAhPT0gR0VPSlNPTl9UWVBFLlBPTFlHT04gJiZcbiAgICAgICAgZmVhdHVyZS5wcm9wZXJ0aWVzLnJlbmRlclR5cGUgIT09IEdFT0pTT05fVFlQRS5MSU5FX1NUUklORylcbiAgICApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGluc2VydE1hcENvb3JkcyA9IHRoaXMuX2dldFBvaW50T25TZWdtZW50KGZlYXR1cmUsIHBpY2tlZE9iamVjdCwgZXZlbnQubWFwQ29vcmRzKTtcblxuICAgIGlmICghaW5zZXJ0TWFwQ29vcmRzKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogJ0ZlYXR1cmUnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBndWlkZVR5cGU6IEdVSURFX1RZUEUuQ1VSU09SX0VESVRfSEFORExFLFxuICAgICAgICByZW5kZXJUeXBlOiBmZWF0dXJlLnByb3BlcnRpZXMucmVuZGVyVHlwZSxcbiAgICAgICAgcG9zaXRpb25JbmRleGVzOiBbbnVsbF1cbiAgICAgIH0sXG4gICAgICBnZW9tZXRyeToge1xuICAgICAgICB0eXBlOiBHRU9KU09OX1RZUEUuUE9JTlQsXG4gICAgICAgIGNvb3JkaW5hdGVzOiBbaW5zZXJ0TWFwQ29vcmRzXVxuICAgICAgfVxuICAgIH07XG4gIH07XG5cbiAgZ2V0R3VpZGVzID0gKHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KSA9PiB7XG4gICAgY29uc3Qgc2VsZWN0ZWRGZWF0dXJlID0gdGhpcy5nZXRTZWxlY3RlZEZlYXR1cmUocHJvcHMpO1xuICAgIGNvbnN0IHNlbGVjdGVkRmVhdHVyZUluZGV4ID0gcHJvcHMuc2VsZWN0ZWRJbmRleGVzICYmIHByb3BzLnNlbGVjdGVkSW5kZXhlc1swXTtcblxuICAgIGlmICghc2VsZWN0ZWRGZWF0dXJlIHx8IHNlbGVjdGVkRmVhdHVyZS5nZW9tZXRyeS50eXBlID09PSBHRU9KU09OX1RZUEUuUE9JTlQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGV2ZW50ID0gcHJvcHMubGFzdFBvaW50ZXJNb3ZlRXZlbnQ7XG5cbiAgICAvLyBmZWF0dXJlIGVkaXRIYW5kbGVzXG4gICAgY29uc3QgZWRpdEhhbmRsZXMgPSB0aGlzLmdldEVkaXRIYW5kbGVzRnJvbUZlYXR1cmUoc2VsZWN0ZWRGZWF0dXJlLCBzZWxlY3RlZEZlYXR1cmVJbmRleCkgfHwgW107XG5cbiAgICAvLyBjdXJzb3IgZWRpdEhhbmRsZVxuICAgIGNvbnN0IGN1cnNvckVkaXRIYW5kbGUgPSB0aGlzLl9nZXRDdXJzb3JFZGl0SGFuZGxlKGV2ZW50LCBzZWxlY3RlZEZlYXR1cmUpO1xuICAgIGlmIChjdXJzb3JFZGl0SGFuZGxlKSB7XG4gICAgICBlZGl0SGFuZGxlcy5wdXNoKHRoaXMuX2dldEN1cnNvckVkaXRIYW5kbGUoZXZlbnQsIHNlbGVjdGVkRmVhdHVyZSkpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBlZGl0SGFuZGxlczogZWRpdEhhbmRsZXMubGVuZ3RoID8gZWRpdEhhbmRsZXMgOiBudWxsXG4gICAgfTtcbiAgfTtcbn1cbiJdfQ==