"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _constants = require("../constants");

var _baseMode = _interopRequireDefault(require("./base-mode"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class SelectMode extends _baseMode.default {
  constructor() {
    var _this;

    super(...arguments);
    _this = this;

    _defineProperty(this, "_handleDragging", function (event, props) {
      var onEdit = props.onEdit; // nothing clicked

      var isDragging = event.isDragging,
          pointerDownPicks = event.pointerDownPicks,
          screenCoords = event.screenCoords;
      var lastPointerMoveEvent = props.lastPointerMoveEvent;
      var clickedObject = pointerDownPicks && pointerDownPicks[0] && pointerDownPicks[0].object;

      if (!clickedObject || !(0, _utils.isNumeric)(clickedObject.featureIndex)) {
        return;
      } // not dragging


      var updatedData = null;
      var editType = isDragging ? _constants.EDIT_TYPE.MOVE_POSITION : _constants.EDIT_TYPE.FINISH_MOVE_POSITION;

      switch (clickedObject.type) {
        case _constants.ELEMENT_TYPE.FEATURE:
        case _constants.ELEMENT_TYPE.FILL:
        case _constants.ELEMENT_TYPE.SEGMENT:
        case _constants.ELEMENT_TYPE.EDIT_HANDLE:
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

        default:
      }
    });

    _defineProperty(this, "handlePointerMove", function (event, props) {
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

    _defineProperty(this, "_updateFeature", function (props, type) {
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

    _defineProperty(this, "getGuides", function (props) {
      var selectedFeature = _this.getSelectedFeature(props);

      var selectedFeatureIndex = props.selectedIndexes && props.selectedIndexes[0];

      if (!selectedFeature || selectedFeature.geometry.type === _constants.GEOJSON_TYPE.POINT) {
        return null;
      } // feature editHandles


      var editHandles = _this.getEditHandlesFromFeature(selectedFeature, selectedFeatureIndex) || [];
      return {
        editHandles: editHandles.length ? editHandles : null
      };
    });
  }

  handleStopDragging(event, props) {
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

}

exports.default = SelectMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lZGl0LW1vZGVzL3NlbGVjdC1tb2RlLmpzIl0sIm5hbWVzIjpbIlNlbGVjdE1vZGUiLCJCYXNlTW9kZSIsImV2ZW50IiwicHJvcHMiLCJvbkVkaXQiLCJpc0RyYWdnaW5nIiwicG9pbnRlckRvd25QaWNrcyIsInNjcmVlbkNvb3JkcyIsImxhc3RQb2ludGVyTW92ZUV2ZW50IiwiY2xpY2tlZE9iamVjdCIsIm9iamVjdCIsImZlYXR1cmVJbmRleCIsInVwZGF0ZWREYXRhIiwiZWRpdFR5cGUiLCJFRElUX1RZUEUiLCJNT1ZFX1BPU0lUSU9OIiwiRklOSVNIX01PVkVfUE9TSVRJT04iLCJ0eXBlIiwiRUxFTUVOVF9UWVBFIiwiRkVBVFVSRSIsIkZJTEwiLCJTRUdNRU5UIiwiRURJVF9IQU5ETEUiLCJkeCIsImR5IiwiX3VwZGF0ZUZlYXR1cmUiLCJlZGl0Q29udGV4dCIsInNlbGVjdGVkRmVhdHVyZSIsImdldFNlbGVjdGVkRmVhdHVyZSIsIl9oYW5kbGVEcmFnZ2luZyIsIm9wdGlvbnMiLCJkYXRhIiwic2VsZWN0ZWRJbmRleGVzIiwidmlld3BvcnQiLCJmZWF0dXJlIiwiZ2VvbWV0cnkiLCJjb29yZGluYXRlcyIsIm5ld0Nvb3JkaW5hdGVzIiwibWFwIiwibWFwQ29vcmRzIiwicGl4ZWxzIiwicHJvamVjdCIsInVucHJvamVjdCIsImZpbHRlciIsIkJvb2xlYW4iLCJHRU9KU09OX1RZUEUiLCJQT0xZR09OIiwicmVwbGFjZUdlb21ldHJ5IiwiZ2V0T2JqZWN0IiwiZWRpdEhhbmRsZUluZGV4Iiwic2VsZWN0ZWRGZWF0dXJlSW5kZXgiLCJQT0lOVCIsImVkaXRIYW5kbGVzIiwiZ2V0RWRpdEhhbmRsZXNGcm9tRmVhdHVyZSIsImxlbmd0aCIsImhhbmRsZVN0b3BEcmFnZ2luZyIsInBpY2tlZE9iamVjdCIsInBpY2tzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBS0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FBRWUsTUFBTUEsVUFBTixT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SUFBZXZELEtBQUssQ0FBQ3VELEtBQU4sQ0FBWSxDQUFaLENBQWYsSUFBaUN2RCxLQUFLLENBQUN1RCxLQUFOLENBQVksQ0FBWixFQUFlL0MsTUFBckU7O0FBQ0EsUUFBSSxDQUFDOEMsWUFBRCxJQUFpQixDQUFDLHNCQUFVQSxZQUFZLENBQUM3QyxZQUF2QixDQUF0QixFQUE0RDtBQUMxRDtBQUNEOztBQUVELFlBQVE2QyxZQUFZLENBQUN2QyxJQUFyQjtBQUNFLFdBQUtDLHdCQUFhQyxPQUFsQjtBQUNBLFdBQUtELHdCQUFhSSxXQUFsQjtBQUNFLGFBQUtPLGVBQUwsQ0FBcUIzQixLQUFyQixFQUE0QkMsS0FBNUI7O0FBQ0E7O0FBQ0Y7QUFMRjtBQU9EOztBQWY4QyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbmltcG9ydCB0eXBlIHsgRmVhdHVyZUNvbGxlY3Rpb24sIFN0b3BEcmFnZ2luZ0V2ZW50LCBQb2ludGVyTW92ZUV2ZW50IH0gZnJvbSAna2VwbGVyLW91dGRhdGVkLW5lYnVsYS5nbC1lZGl0LW1vZGVzJztcbmltcG9ydCB0eXBlIHsgTW9kZVByb3BzIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5pbXBvcnQgeyBFRElUX1RZUEUsIEVMRU1FTlRfVFlQRSwgR0VPSlNPTl9UWVBFIH0gZnJvbSAnLi4vY29uc3RhbnRzJztcbmltcG9ydCBCYXNlTW9kZSBmcm9tICcuL2Jhc2UtbW9kZSc7XG5pbXBvcnQgeyBnZXRGZWF0dXJlQ29vcmRpbmF0ZXMsIGlzTnVtZXJpYywgdXBkYXRlUmVjdGFuZ2xlUG9zaXRpb24gfSBmcm9tICcuL3V0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VsZWN0TW9kZSBleHRlbmRzIEJhc2VNb2RlIHtcbiAgaGFuZGxlU3RvcERyYWdnaW5nKGV2ZW50OiBTdG9wRHJhZ2dpbmdFdmVudCwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pIHtcbiAgICAvLyByZXBsYWNlIHBvaW50XG4gICAgY29uc3QgcGlja2VkT2JqZWN0ID0gZXZlbnQucGlja3MgJiYgZXZlbnQucGlja3NbMF0gJiYgZXZlbnQucGlja3NbMF0ub2JqZWN0O1xuICAgIGlmICghcGlja2VkT2JqZWN0IHx8ICFpc051bWVyaWMocGlja2VkT2JqZWN0LmZlYXR1cmVJbmRleCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzd2l0Y2ggKHBpY2tlZE9iamVjdC50eXBlKSB7XG4gICAgICBjYXNlIEVMRU1FTlRfVFlQRS5GRUFUVVJFOlxuICAgICAgY2FzZSBFTEVNRU5UX1RZUEUuRURJVF9IQU5ETEU6XG4gICAgICAgIHRoaXMuX2hhbmRsZURyYWdnaW5nKGV2ZW50LCBwcm9wcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICB9XG4gIH1cblxuICBfaGFuZGxlRHJhZ2dpbmcgPSAoXG4gICAgZXZlbnQ6IFBvaW50ZXJNb3ZlRXZlbnQgfCBTdG9wRHJhZ2dpbmdFdmVudCxcbiAgICBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPlxuICApID0+IHtcbiAgICBjb25zdCB7IG9uRWRpdCB9ID0gcHJvcHM7XG4gICAgLy8gbm90aGluZyBjbGlja2VkXG4gICAgY29uc3QgeyBpc0RyYWdnaW5nLCBwb2ludGVyRG93blBpY2tzLCBzY3JlZW5Db29yZHMgfSA9IGV2ZW50O1xuICAgIGNvbnN0IHsgbGFzdFBvaW50ZXJNb3ZlRXZlbnQgfSA9IHByb3BzO1xuXG4gICAgY29uc3QgY2xpY2tlZE9iamVjdCA9IHBvaW50ZXJEb3duUGlja3MgJiYgcG9pbnRlckRvd25QaWNrc1swXSAmJiBwb2ludGVyRG93blBpY2tzWzBdLm9iamVjdDtcbiAgICBpZiAoIWNsaWNrZWRPYmplY3QgfHwgIWlzTnVtZXJpYyhjbGlja2VkT2JqZWN0LmZlYXR1cmVJbmRleCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBub3QgZHJhZ2dpbmdcbiAgICBsZXQgdXBkYXRlZERhdGEgPSBudWxsO1xuICAgIGNvbnN0IGVkaXRUeXBlID0gaXNEcmFnZ2luZyA/IEVESVRfVFlQRS5NT1ZFX1BPU0lUSU9OIDogRURJVF9UWVBFLkZJTklTSF9NT1ZFX1BPU0lUSU9OO1xuXG4gICAgc3dpdGNoIChjbGlja2VkT2JqZWN0LnR5cGUpIHtcbiAgICAgIGNhc2UgRUxFTUVOVF9UWVBFLkZFQVRVUkU6XG4gICAgICBjYXNlIEVMRU1FTlRfVFlQRS5GSUxMOlxuICAgICAgY2FzZSBFTEVNRU5UX1RZUEUuU0VHTUVOVDpcbiAgICAgIGNhc2UgRUxFTUVOVF9UWVBFLkVESVRfSEFORExFOlxuICAgICAgICAvLyBkcmFnZ2luZyBmZWF0dXJlXG4gICAgICAgIGNvbnN0IGR4ID0gc2NyZWVuQ29vcmRzWzBdIC0gbGFzdFBvaW50ZXJNb3ZlRXZlbnQuc2NyZWVuQ29vcmRzWzBdO1xuICAgICAgICBjb25zdCBkeSA9IHNjcmVlbkNvb3Jkc1sxXSAtIGxhc3RQb2ludGVyTW92ZUV2ZW50LnNjcmVlbkNvb3Jkc1sxXTtcbiAgICAgICAgdXBkYXRlZERhdGEgPSB0aGlzLl91cGRhdGVGZWF0dXJlKHByb3BzLCAnZmVhdHVyZScsIHsgZHgsIGR5IH0pO1xuICAgICAgICBvbkVkaXQoe1xuICAgICAgICAgIGVkaXRUeXBlLFxuICAgICAgICAgIHVwZGF0ZWREYXRhLFxuICAgICAgICAgIGVkaXRDb250ZXh0OiBudWxsXG4gICAgICAgIH0pO1xuICAgICAgICBicmVhaztcblxuICAgICAgZGVmYXVsdDpcbiAgICB9XG4gIH07XG5cbiAgaGFuZGxlUG9pbnRlck1vdmUgPSAoZXZlbnQ6IFBvaW50ZXJNb3ZlRXZlbnQsIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KSA9PiB7XG4gICAgLy8gbm8gc2VsZWN0ZWQgZmVhdHVyZVxuICAgIGNvbnN0IHNlbGVjdGVkRmVhdHVyZSA9IHRoaXMuZ2V0U2VsZWN0ZWRGZWF0dXJlKHByb3BzKTtcbiAgICBpZiAoIXNlbGVjdGVkRmVhdHVyZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghZXZlbnQuaXNEcmFnZ2luZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX2hhbmRsZURyYWdnaW5nKGV2ZW50LCBwcm9wcyk7XG4gIH07XG5cbiAgLy8gVE9ETyAtIHJlZmFjdG9yXG4gIF91cGRhdGVGZWF0dXJlID0gKHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+LCB0eXBlOiBzdHJpbmcsIG9wdGlvbnM6IGFueSA9IHt9KSA9PiB7XG4gICAgY29uc3QgeyBkYXRhLCBzZWxlY3RlZEluZGV4ZXMsIHZpZXdwb3J0IH0gPSBwcm9wcztcblxuICAgIGNvbnN0IGZlYXR1cmVJbmRleCA9IHNlbGVjdGVkSW5kZXhlcyAmJiBzZWxlY3RlZEluZGV4ZXNbMF07XG4gICAgY29uc3QgZmVhdHVyZSA9IHRoaXMuZ2V0U2VsZWN0ZWRGZWF0dXJlKHByb3BzLCBmZWF0dXJlSW5kZXgpO1xuXG4gICAgbGV0IGdlb21ldHJ5ID0gbnVsbDtcbiAgICBjb25zdCBjb29yZGluYXRlcyA9IGdldEZlYXR1cmVDb29yZGluYXRlcyhmZWF0dXJlKTtcbiAgICBpZiAoIWNvb3JkaW5hdGVzKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBsZXQgbmV3Q29vcmRpbmF0ZXMgPSBbLi4uY29vcmRpbmF0ZXNdO1xuXG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlICdmZWF0dXJlJzpcbiAgICAgICAgY29uc3QgeyBkeCwgZHkgfSA9IG9wdGlvbnM7XG4gICAgICAgIG5ld0Nvb3JkaW5hdGVzID0gbmV3Q29vcmRpbmF0ZXNcbiAgICAgICAgICAubWFwKG1hcENvb3JkcyA9PiB7XG4gICAgICAgICAgICBjb25zdCBwaXhlbHMgPSB2aWV3cG9ydCAmJiB2aWV3cG9ydC5wcm9qZWN0KG1hcENvb3Jkcyk7XG4gICAgICAgICAgICBpZiAocGl4ZWxzKSB7XG4gICAgICAgICAgICAgIHBpeGVsc1swXSArPSBkeDtcbiAgICAgICAgICAgICAgcGl4ZWxzWzFdICs9IGR5O1xuICAgICAgICAgICAgICByZXR1cm4gdmlld3BvcnQgJiYgdmlld3BvcnQudW5wcm9qZWN0KHBpeGVscyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5maWx0ZXIoQm9vbGVhbik7XG5cbiAgICAgICAgZ2VvbWV0cnkgPSB7XG4gICAgICAgICAgdHlwZTogZmVhdHVyZS5nZW9tZXRyeS50eXBlLFxuICAgICAgICAgIGNvb3JkaW5hdGVzOlxuICAgICAgICAgICAgZmVhdHVyZS5nZW9tZXRyeS50eXBlID09PSBHRU9KU09OX1RZUEUuUE9MWUdPTiA/IFtuZXdDb29yZGluYXRlc10gOiBuZXdDb29yZGluYXRlc1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBkYXRhLnJlcGxhY2VHZW9tZXRyeShmZWF0dXJlSW5kZXgsIGdlb21ldHJ5KS5nZXRPYmplY3QoKTtcblxuICAgICAgY2FzZSAncmVjdGFuZ2xlJzpcbiAgICAgICAgLy8gbW92ZWQgZWRpdEhhbmRsZUluZGV4IGFuZCBkZXN0aW5hdGlvbiBtYXBDb29yZHNcbiAgICAgICAgbmV3Q29vcmRpbmF0ZXMgPSB1cGRhdGVSZWN0YW5nbGVQb3NpdGlvbihcbiAgICAgICAgICBmZWF0dXJlLFxuICAgICAgICAgIG9wdGlvbnMuZWRpdEhhbmRsZUluZGV4LFxuICAgICAgICAgIG9wdGlvbnMubWFwQ29vcmRzXG4gICAgICAgICk7XG5cbiAgICAgICAgZ2VvbWV0cnkgPSB7XG4gICAgICAgICAgdHlwZTogR0VPSlNPTl9UWVBFLlBPTFlHT04sXG4gICAgICAgICAgY29vcmRpbmF0ZXM6IG5ld0Nvb3JkaW5hdGVzXG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIGRhdGEucmVwbGFjZUdlb21ldHJ5KGZlYXR1cmVJbmRleCwgZ2VvbWV0cnkpLmdldE9iamVjdCgpO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gZGF0YSAmJiBkYXRhLmdldE9iamVjdCgpO1xuICAgIH1cbiAgfTtcblxuICBnZXRHdWlkZXMgPSAocHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pID0+IHtcbiAgICBjb25zdCBzZWxlY3RlZEZlYXR1cmUgPSB0aGlzLmdldFNlbGVjdGVkRmVhdHVyZShwcm9wcyk7XG4gICAgY29uc3Qgc2VsZWN0ZWRGZWF0dXJlSW5kZXggPSBwcm9wcy5zZWxlY3RlZEluZGV4ZXMgJiYgcHJvcHMuc2VsZWN0ZWRJbmRleGVzWzBdO1xuXG4gICAgaWYgKCFzZWxlY3RlZEZlYXR1cmUgfHwgc2VsZWN0ZWRGZWF0dXJlLmdlb21ldHJ5LnR5cGUgPT09IEdFT0pTT05fVFlQRS5QT0lOVCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gZmVhdHVyZSBlZGl0SGFuZGxlc1xuICAgIGNvbnN0IGVkaXRIYW5kbGVzID0gdGhpcy5nZXRFZGl0SGFuZGxlc0Zyb21GZWF0dXJlKHNlbGVjdGVkRmVhdHVyZSwgc2VsZWN0ZWRGZWF0dXJlSW5kZXgpIHx8IFtdO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGVkaXRIYW5kbGVzOiBlZGl0SGFuZGxlcy5sZW5ndGggPyBlZGl0SGFuZGxlcyA6IG51bGxcbiAgICB9O1xuICB9O1xufVxuIl19