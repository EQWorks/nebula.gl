"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TranslateMode = void 0;

var _bearing = _interopRequireDefault(require("@turf/bearing"));

var _distance = _interopRequireDefault(require("@turf/distance"));

var _transformTranslate = _interopRequireDefault(require("@turf/transform-translate"));

var _helpers = require("@turf/helpers");

var _geojsonEditMode = require("./geojson-edit-mode.js");

var _immutableFeatureCollection = require("./immutable-feature-collection.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class TranslateMode extends _geojsonEditMode.BaseGeoJsonEditMode {
  constructor() {
    super(...arguments);

    _defineProperty(this, "_geometryBeforeTranslate", void 0);

    _defineProperty(this, "_isTranslatable", void 0);
  }

  handlePointerMoveAdapter(event, props) {
    var editAction = null;
    this._isTranslatable = Boolean(this._geometryBeforeTranslate) || this.isSelectionPicked(event.picks, props);

    if (!this._isTranslatable || !event.pointerDownMapCoords) {
      // Nothing to do
      return {
        editAction: null,
        cancelMapPan: false
      };
    }

    if (event.isDragging && this._geometryBeforeTranslate) {
      // Translate the geometry
      editAction = this.getTranslateAction(event.pointerDownMapCoords, event.mapCoords, 'translating', props);
    }

    return {
      editAction: editAction,
      cancelMapPan: true
    };
  }

  handleStartDraggingAdapter(event, props) {
    if (!this._isTranslatable) {
      return null;
    }

    this._geometryBeforeTranslate = this.getSelectedFeaturesAsFeatureCollection(props);
    return null;
  }

  handleStopDraggingAdapter(event, props) {
    var editAction = null;

    if (this._geometryBeforeTranslate) {
      // Translate the geometry
      editAction = this.getTranslateAction(event.pointerDownMapCoords, event.mapCoords, 'translated', props);
      this._geometryBeforeTranslate = null;
    }

    return editAction;
  }

  getCursorAdapter() {
    if (this._isTranslatable) {
      return 'move';
    }

    return null;
  }

  getTranslateAction(startDragPoint, currentPoint, editType, props) {
    if (!this._geometryBeforeTranslate) {
      return null;
    }

    var p1 = (0, _helpers.point)(startDragPoint);
    var p2 = (0, _helpers.point)(currentPoint);
    var distanceMoved = (0, _distance.default)(p1, p2);
    var direction = (0, _bearing.default)(p1, p2);
    var movedFeatures = (0, _transformTranslate.default)(this._geometryBeforeTranslate, distanceMoved, direction);
    var updatedData = new _immutableFeatureCollection.ImmutableFeatureCollection(props.data);
    var selectedIndexes = props.selectedIndexes;

    for (var i = 0; i < selectedIndexes.length; i++) {
      var selectedIndex = selectedIndexes[i];
      var movedFeature = movedFeatures.features[i];
      updatedData = updatedData.replaceGeometry(selectedIndex, movedFeature.geometry);
    }

    return {
      updatedData: updatedData.getObject(),
      editType: editType,
      editContext: {
        featureIndexes: selectedIndexes
      }
    };
  }

}

exports.TranslateMode = TranslateMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvdHJhbnNsYXRlLW1vZGUuanMiXSwibmFtZXMiOlsiVHJhbnNsYXRlTW9kZSIsIkJhc2VHZW9Kc29uRWRpdE1vZGUiLCJoYW5kbGVQb2ludGVyTW92ZUFkYXB0ZXIiLCJldmVudCIsInByb3BzIiwiZWRpdEFjdGlvbiIsIl9pc1RyYW5zbGF0YWJsZSIsIkJvb2xlYW4iLCJfZ2VvbWV0cnlCZWZvcmVUcmFuc2xhdGUiLCJpc1NlbGVjdGlvblBpY2tlZCIsInBpY2tzIiwicG9pbnRlckRvd25NYXBDb29yZHMiLCJjYW5jZWxNYXBQYW4iLCJpc0RyYWdnaW5nIiwiZ2V0VHJhbnNsYXRlQWN0aW9uIiwibWFwQ29vcmRzIiwiaGFuZGxlU3RhcnREcmFnZ2luZ0FkYXB0ZXIiLCJnZXRTZWxlY3RlZEZlYXR1cmVzQXNGZWF0dXJlQ29sbGVjdGlvbiIsImhhbmRsZVN0b3BEcmFnZ2luZ0FkYXB0ZXIiLCJnZXRDdXJzb3JBZGFwdGVyIiwic3RhcnREcmFnUG9pbnQiLCJjdXJyZW50UG9pbnQiLCJlZGl0VHlwZSIsInAxIiwicDIiLCJkaXN0YW5jZU1vdmVkIiwiZGlyZWN0aW9uIiwibW92ZWRGZWF0dXJlcyIsInVwZGF0ZWREYXRhIiwiSW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24iLCJkYXRhIiwic2VsZWN0ZWRJbmRleGVzIiwiaSIsImxlbmd0aCIsInNlbGVjdGVkSW5kZXgiLCJtb3ZlZEZlYXR1cmUiLCJmZWF0dXJlcyIsInJlcGxhY2VHZW9tZXRyeSIsImdlb21ldHJ5IiwiZ2V0T2JqZWN0IiwiZWRpdENvbnRleHQiLCJmZWF0dXJlSW5kZXhlcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQVFBOztBQUNBOzs7Ozs7QUFFTyxNQUFNQSxhQUFOLFNBQTRCQyxvQ0FBNUIsQ0FBZ0Q7QUFBQTtBQUFBOztBQUFBOztBQUFBO0FBQUE7O0FBSXJEQyxFQUFBQSx3QkFBd0IsQ0FDdEJDLEtBRHNCLEVBRXRCQyxLQUZzQixFQUdxQztBQUMzRCxRQUFJQyxVQUE4QixHQUFHLElBQXJDO0FBRUEsU0FBS0MsZUFBTCxHQUNFQyxPQUFPLENBQUMsS0FBS0Msd0JBQU4sQ0FBUCxJQUEwQyxLQUFLQyxpQkFBTCxDQUF1Qk4sS0FBSyxDQUFDTyxLQUE3QixFQUFvQ04sS0FBcEMsQ0FENUM7O0FBR0EsUUFBSSxDQUFDLEtBQUtFLGVBQU4sSUFBeUIsQ0FBQ0gsS0FBSyxDQUFDUSxvQkFBcEMsRUFBMEQ7QUFDeEQ7QUFDQSxhQUFPO0FBQUVOLFFBQUFBLFVBQVUsRUFBRSxJQUFkO0FBQW9CTyxRQUFBQSxZQUFZLEVBQUU7QUFBbEMsT0FBUDtBQUNEOztBQUVELFFBQUlULEtBQUssQ0FBQ1UsVUFBTixJQUFvQixLQUFLTCx3QkFBN0IsRUFBdUQ7QUFDckQ7QUFDQUgsTUFBQUEsVUFBVSxHQUFHLEtBQUtTLGtCQUFMLENBQ1hYLEtBQUssQ0FBQ1Esb0JBREssRUFFWFIsS0FBSyxDQUFDWSxTQUZLLEVBR1gsYUFIVyxFQUlYWCxLQUpXLENBQWI7QUFNRDs7QUFFRCxXQUFPO0FBQUVDLE1BQUFBLFVBQVUsRUFBVkEsVUFBRjtBQUFjTyxNQUFBQSxZQUFZLEVBQUU7QUFBNUIsS0FBUDtBQUNEOztBQUVESSxFQUFBQSwwQkFBMEIsQ0FDeEJiLEtBRHdCLEVBRXhCQyxLQUZ3QixFQUdKO0FBQ3BCLFFBQUksQ0FBQyxLQUFLRSxlQUFWLEVBQTJCO0FBQ3pCLGFBQU8sSUFBUDtBQUNEOztBQUVELFNBQUtFLHdCQUFMLEdBQWdDLEtBQUtTLHNDQUFMLENBQTRDYixLQUE1QyxDQUFoQztBQUNBLFdBQU8sSUFBUDtBQUNEOztBQUVEYyxFQUFBQSx5QkFBeUIsQ0FDdkJmLEtBRHVCLEVBRXZCQyxLQUZ1QixFQUdIO0FBQ3BCLFFBQUlDLFVBQThCLEdBQUcsSUFBckM7O0FBRUEsUUFBSSxLQUFLRyx3QkFBVCxFQUFtQztBQUNqQztBQUNBSCxNQUFBQSxVQUFVLEdBQUcsS0FBS1Msa0JBQUwsQ0FDWFgsS0FBSyxDQUFDUSxvQkFESyxFQUVYUixLQUFLLENBQUNZLFNBRkssRUFHWCxZQUhXLEVBSVhYLEtBSlcsQ0FBYjtBQU1BLFdBQUtJLHdCQUFMLEdBQWdDLElBQWhDO0FBQ0Q7O0FBRUQsV0FBT0gsVUFBUDtBQUNEOztBQUVEYyxFQUFBQSxnQkFBZ0IsR0FBWTtBQUMxQixRQUFJLEtBQUtiLGVBQVQsRUFBMEI7QUFDeEIsYUFBTyxNQUFQO0FBQ0Q7O0FBQ0QsV0FBTyxJQUFQO0FBQ0Q7O0FBRURRLEVBQUFBLGtCQUFrQixDQUNoQk0sY0FEZ0IsRUFFaEJDLFlBRmdCLEVBR2hCQyxRQUhnQixFQUloQmxCLEtBSmdCLEVBS0k7QUFDcEIsUUFBSSxDQUFDLEtBQUtJLHdCQUFWLEVBQW9DO0FBQ2xDLGFBQU8sSUFBUDtBQUNEOztBQUNELFFBQU1lLEVBQUUsR0FBRyxvQkFBTUgsY0FBTixDQUFYO0FBQ0EsUUFBTUksRUFBRSxHQUFHLG9CQUFNSCxZQUFOLENBQVg7QUFFQSxRQUFNSSxhQUFhLEdBQUcsdUJBQWFGLEVBQWIsRUFBaUJDLEVBQWpCLENBQXRCO0FBQ0EsUUFBTUUsU0FBUyxHQUFHLHNCQUFZSCxFQUFaLEVBQWdCQyxFQUFoQixDQUFsQjtBQUVBLFFBQU1HLGFBQWEsR0FBRyxpQ0FDcEIsS0FBS25CLHdCQURlLEVBRXBCaUIsYUFGb0IsRUFHcEJDLFNBSG9CLENBQXRCO0FBTUEsUUFBSUUsV0FBVyxHQUFHLElBQUlDLHNEQUFKLENBQStCekIsS0FBSyxDQUFDMEIsSUFBckMsQ0FBbEI7QUFFQSxRQUFNQyxlQUFlLEdBQUczQixLQUFLLENBQUMyQixlQUE5Qjs7QUFDQSxTQUFLLElBQUlDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdELGVBQWUsQ0FBQ0UsTUFBcEMsRUFBNENELENBQUMsRUFBN0MsRUFBaUQ7QUFDL0MsVUFBTUUsYUFBYSxHQUFHSCxlQUFlLENBQUNDLENBQUQsQ0FBckM7QUFDQSxVQUFNRyxZQUFZLEdBQUdSLGFBQWEsQ0FBQ1MsUUFBZCxDQUF1QkosQ0FBdkIsQ0FBckI7QUFDQUosTUFBQUEsV0FBVyxHQUFHQSxXQUFXLENBQUNTLGVBQVosQ0FBNEJILGFBQTVCLEVBQTJDQyxZQUFZLENBQUNHLFFBQXhELENBQWQ7QUFDRDs7QUFFRCxXQUFPO0FBQ0xWLE1BQUFBLFdBQVcsRUFBRUEsV0FBVyxDQUFDVyxTQUFaLEVBRFI7QUFFTGpCLE1BQUFBLFFBQVEsRUFBUkEsUUFGSztBQUdMa0IsTUFBQUEsV0FBVyxFQUFFO0FBQ1hDLFFBQUFBLGNBQWMsRUFBRVY7QUFETDtBQUhSLEtBQVA7QUFPRDs7QUEzR29EIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuaW1wb3J0IHR1cmZCZWFyaW5nIGZyb20gJ0B0dXJmL2JlYXJpbmcnO1xuaW1wb3J0IHR1cmZEaXN0YW5jZSBmcm9tICdAdHVyZi9kaXN0YW5jZSc7XG5pbXBvcnQgdHVyZlRyYW5zZm9ybVRyYW5zbGF0ZSBmcm9tICdAdHVyZi90cmFuc2Zvcm0tdHJhbnNsYXRlJztcbmltcG9ydCB7IHBvaW50IH0gZnJvbSAnQHR1cmYvaGVscGVycyc7XG5pbXBvcnQgdHlwZSB7IEZlYXR1cmVDb2xsZWN0aW9uLCBQb3NpdGlvbiB9IGZyb20gJy4uL2dlb2pzb24tdHlwZXMuanMnO1xuaW1wb3J0IHR5cGUge1xuICBQb2ludGVyTW92ZUV2ZW50LFxuICBTdGFydERyYWdnaW5nRXZlbnQsXG4gIFN0b3BEcmFnZ2luZ0V2ZW50LFxuICBNb2RlUHJvcHNcbn0gZnJvbSAnLi4vdHlwZXMuanMnO1xuaW1wb3J0IHsgQmFzZUdlb0pzb25FZGl0TW9kZSwgdHlwZSBHZW9Kc29uRWRpdEFjdGlvbiB9IGZyb20gJy4vZ2VvanNvbi1lZGl0LW1vZGUuanMnO1xuaW1wb3J0IHsgSW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24gfSBmcm9tICcuL2ltbXV0YWJsZS1mZWF0dXJlLWNvbGxlY3Rpb24uanMnO1xuXG5leHBvcnQgY2xhc3MgVHJhbnNsYXRlTW9kZSBleHRlbmRzIEJhc2VHZW9Kc29uRWRpdE1vZGUge1xuICBfZ2VvbWV0cnlCZWZvcmVUcmFuc2xhdGU6ID9GZWF0dXJlQ29sbGVjdGlvbjtcbiAgX2lzVHJhbnNsYXRhYmxlOiBib29sZWFuO1xuXG4gIGhhbmRsZVBvaW50ZXJNb3ZlQWRhcHRlcihcbiAgICBldmVudDogUG9pbnRlck1vdmVFdmVudCxcbiAgICBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPlxuICApOiB7IGVkaXRBY3Rpb246ID9HZW9Kc29uRWRpdEFjdGlvbiwgY2FuY2VsTWFwUGFuOiBib29sZWFuIH0ge1xuICAgIGxldCBlZGl0QWN0aW9uOiA/R2VvSnNvbkVkaXRBY3Rpb24gPSBudWxsO1xuXG4gICAgdGhpcy5faXNUcmFuc2xhdGFibGUgPVxuICAgICAgQm9vbGVhbih0aGlzLl9nZW9tZXRyeUJlZm9yZVRyYW5zbGF0ZSkgfHwgdGhpcy5pc1NlbGVjdGlvblBpY2tlZChldmVudC5waWNrcywgcHJvcHMpO1xuXG4gICAgaWYgKCF0aGlzLl9pc1RyYW5zbGF0YWJsZSB8fCAhZXZlbnQucG9pbnRlckRvd25NYXBDb29yZHMpIHtcbiAgICAgIC8vIE5vdGhpbmcgdG8gZG9cbiAgICAgIHJldHVybiB7IGVkaXRBY3Rpb246IG51bGwsIGNhbmNlbE1hcFBhbjogZmFsc2UgfTtcbiAgICB9XG5cbiAgICBpZiAoZXZlbnQuaXNEcmFnZ2luZyAmJiB0aGlzLl9nZW9tZXRyeUJlZm9yZVRyYW5zbGF0ZSkge1xuICAgICAgLy8gVHJhbnNsYXRlIHRoZSBnZW9tZXRyeVxuICAgICAgZWRpdEFjdGlvbiA9IHRoaXMuZ2V0VHJhbnNsYXRlQWN0aW9uKFxuICAgICAgICBldmVudC5wb2ludGVyRG93bk1hcENvb3JkcyxcbiAgICAgICAgZXZlbnQubWFwQ29vcmRzLFxuICAgICAgICAndHJhbnNsYXRpbmcnLFxuICAgICAgICBwcm9wc1xuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4geyBlZGl0QWN0aW9uLCBjYW5jZWxNYXBQYW46IHRydWUgfTtcbiAgfVxuXG4gIGhhbmRsZVN0YXJ0RHJhZ2dpbmdBZGFwdGVyKFxuICAgIGV2ZW50OiBTdGFydERyYWdnaW5nRXZlbnQsXG4gICAgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj5cbiAgKTogP0dlb0pzb25FZGl0QWN0aW9uIHtcbiAgICBpZiAoIXRoaXMuX2lzVHJhbnNsYXRhYmxlKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB0aGlzLl9nZW9tZXRyeUJlZm9yZVRyYW5zbGF0ZSA9IHRoaXMuZ2V0U2VsZWN0ZWRGZWF0dXJlc0FzRmVhdHVyZUNvbGxlY3Rpb24ocHJvcHMpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgaGFuZGxlU3RvcERyYWdnaW5nQWRhcHRlcihcbiAgICBldmVudDogU3RvcERyYWdnaW5nRXZlbnQsXG4gICAgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj5cbiAgKTogP0dlb0pzb25FZGl0QWN0aW9uIHtcbiAgICBsZXQgZWRpdEFjdGlvbjogP0dlb0pzb25FZGl0QWN0aW9uID0gbnVsbDtcblxuICAgIGlmICh0aGlzLl9nZW9tZXRyeUJlZm9yZVRyYW5zbGF0ZSkge1xuICAgICAgLy8gVHJhbnNsYXRlIHRoZSBnZW9tZXRyeVxuICAgICAgZWRpdEFjdGlvbiA9IHRoaXMuZ2V0VHJhbnNsYXRlQWN0aW9uKFxuICAgICAgICBldmVudC5wb2ludGVyRG93bk1hcENvb3JkcyxcbiAgICAgICAgZXZlbnQubWFwQ29vcmRzLFxuICAgICAgICAndHJhbnNsYXRlZCcsXG4gICAgICAgIHByb3BzXG4gICAgICApO1xuICAgICAgdGhpcy5fZ2VvbWV0cnlCZWZvcmVUcmFuc2xhdGUgPSBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBlZGl0QWN0aW9uO1xuICB9XG5cbiAgZ2V0Q3Vyc29yQWRhcHRlcigpOiA/c3RyaW5nIHtcbiAgICBpZiAodGhpcy5faXNUcmFuc2xhdGFibGUpIHtcbiAgICAgIHJldHVybiAnbW92ZSc7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZ2V0VHJhbnNsYXRlQWN0aW9uKFxuICAgIHN0YXJ0RHJhZ1BvaW50OiBQb3NpdGlvbixcbiAgICBjdXJyZW50UG9pbnQ6IFBvc2l0aW9uLFxuICAgIGVkaXRUeXBlOiBzdHJpbmcsXG4gICAgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj5cbiAgKTogP0dlb0pzb25FZGl0QWN0aW9uIHtcbiAgICBpZiAoIXRoaXMuX2dlb21ldHJ5QmVmb3JlVHJhbnNsYXRlKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgcDEgPSBwb2ludChzdGFydERyYWdQb2ludCk7XG4gICAgY29uc3QgcDIgPSBwb2ludChjdXJyZW50UG9pbnQpO1xuXG4gICAgY29uc3QgZGlzdGFuY2VNb3ZlZCA9IHR1cmZEaXN0YW5jZShwMSwgcDIpO1xuICAgIGNvbnN0IGRpcmVjdGlvbiA9IHR1cmZCZWFyaW5nKHAxLCBwMik7XG5cbiAgICBjb25zdCBtb3ZlZEZlYXR1cmVzID0gdHVyZlRyYW5zZm9ybVRyYW5zbGF0ZShcbiAgICAgIHRoaXMuX2dlb21ldHJ5QmVmb3JlVHJhbnNsYXRlLFxuICAgICAgZGlzdGFuY2VNb3ZlZCxcbiAgICAgIGRpcmVjdGlvblxuICAgICk7XG5cbiAgICBsZXQgdXBkYXRlZERhdGEgPSBuZXcgSW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24ocHJvcHMuZGF0YSk7XG5cbiAgICBjb25zdCBzZWxlY3RlZEluZGV4ZXMgPSBwcm9wcy5zZWxlY3RlZEluZGV4ZXM7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWxlY3RlZEluZGV4ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHNlbGVjdGVkSW5kZXggPSBzZWxlY3RlZEluZGV4ZXNbaV07XG4gICAgICBjb25zdCBtb3ZlZEZlYXR1cmUgPSBtb3ZlZEZlYXR1cmVzLmZlYXR1cmVzW2ldO1xuICAgICAgdXBkYXRlZERhdGEgPSB1cGRhdGVkRGF0YS5yZXBsYWNlR2VvbWV0cnkoc2VsZWN0ZWRJbmRleCwgbW92ZWRGZWF0dXJlLmdlb21ldHJ5KTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgdXBkYXRlZERhdGE6IHVwZGF0ZWREYXRhLmdldE9iamVjdCgpLFxuICAgICAgZWRpdFR5cGUsXG4gICAgICBlZGl0Q29udGV4dDoge1xuICAgICAgICBmZWF0dXJlSW5kZXhlczogc2VsZWN0ZWRJbmRleGVzXG4gICAgICB9XG4gICAgfTtcbiAgfVxufVxuIl19