"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SnappableHandler = void 0;

var _modeHandler = require("./mode-handler.js");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// TODO edit-modes: delete handlers once EditMode fully implemented
class SnappableHandler extends _modeHandler.ModeHandler {
  constructor(handler) {
    super();

    _defineProperty(this, "_handler", void 0);

    _defineProperty(this, "_editHandlePicks", void 0);

    _defineProperty(this, "_startDragSnapHandlePosition", void 0);

    this._handler = handler;
  }

  setFeatureCollection(featureCollection) {
    this._handler.setFeatureCollection(featureCollection);
  }

  setModeConfig(modeConfig) {
    this._modeConfig = modeConfig;

    this._handler.setModeConfig(modeConfig);
  }

  setSelectedFeatureIndexes(indexes) {
    this._handler.setSelectedFeatureIndexes(indexes);
  }

  _getSnappedMouseEvent(event, snapPoint) {
    return Object.assign({}, event, {
      groundCoords: snapPoint,
      pointerDownGroundCoords: this._startDragSnapHandlePosition
    });
  }

  _getEditHandlePicks(event) {
    var picks = event.picks;
    var potentialSnapHandle = picks.find(function (pick) {
      return pick.object && pick.object.type === 'intermediate';
    });
    var handles = {
      potentialSnapHandle: potentialSnapHandle && potentialSnapHandle.object
    };
    var pickedHandle = (0, _modeHandler.getPickedEditHandle)(event.pointerDownPicks);

    if (pickedHandle) {
      return _objectSpread({}, handles, {
        pickedHandle: pickedHandle
      });
    }

    return handles;
  }

  _updatePickedHandlePosition(editAction) {
    var _ref = this._editHandlePicks || {},
        pickedHandle = _ref.pickedHandle;

    if (pickedHandle && editAction) {
      var featureIndexes = editAction.featureIndexes,
          updatedData = editAction.updatedData;

      for (var i = 0; i < featureIndexes.length; i++) {
        var selectedIndex = featureIndexes[i];
        var updatedFeature = updatedData.features[selectedIndex];
        var positionIndexes = pickedHandle.positionIndexes,
            featureIndex = pickedHandle.featureIndex;

        if (selectedIndex >= 0 && featureIndex === selectedIndex) {
          var coordinates = updatedFeature.geometry.coordinates;
          pickedHandle.position = positionIndexes.reduce(function (a, b) {
            return a[b];
          }, coordinates);
        }
      }
    }
  } // If additionalSnapTargets is present in modeConfig and is populated, this
  // method will return those features along with the features
  // that live in the current layer. Otherwise, this method will simply return the
  // features from the current layer


  _getSnapTargets() {
    var _ref2 = this.getModeConfig() || {},
        additionalSnapTargets = _ref2.additionalSnapTargets;

    additionalSnapTargets = additionalSnapTargets || [];

    var features = _toConsumableArray(this._handler.featureCollection.getObject().features).concat(_toConsumableArray(additionalSnapTargets));

    return features;
  }

  _getNonPickedIntermediateHandles() {
    var handles = [];

    var features = this._getSnapTargets();

    for (var i = 0; i < features.length; i++) {
      // Filter out the currently selected feature(s)
      var isCurrentIndexFeatureNotSelected = i < features.length && !this._handler.getSelectedFeatureIndexes().includes(i);

      if (isCurrentIndexFeatureNotSelected) {
        var geometry = features[i].geometry;
        handles.push.apply(handles, _toConsumableArray((0, _modeHandler.getEditHandlesForGeometry)(geometry, i, 'intermediate')));
      }
    }

    return handles;
  } // If no snap handle has been picked, only display the edit handles of the
  // selected feature. If a snap handle has been picked, display said snap handle
  // along with all snappable points on all non-selected features.


  getEditHandles(picks, groundCoords) {
    var _ref3 = this._modeConfig || {},
        enableSnapping = _ref3.enableSnapping;

    var handles = this._handler.getEditHandles(picks, groundCoords);

    if (!enableSnapping) return handles;

    var _ref4 = this._editHandlePicks || {},
        pickedHandle = _ref4.pickedHandle;

    if (pickedHandle) {
      handles.push.apply(handles, _toConsumableArray(this._getNonPickedIntermediateHandles()).concat([pickedHandle]));
      return handles;
    }

    var _this$_handler$featur = this._handler.featureCollection.getObject(),
        features = _this$_handler$featur.features;

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = this._handler.getSelectedFeatureIndexes()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var index = _step.value;

        if (index < features.length) {
          var geometry = features[index].geometry;
          handles.push.apply(handles, _toConsumableArray((0, _modeHandler.getEditHandlesForGeometry)(geometry, index, 'snap')));
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return handles.filter(Boolean);
  }

  _getSnapAwareEvent(event) {
    var _ref5 = this._editHandlePicks || {},
        potentialSnapHandle = _ref5.potentialSnapHandle;

    return potentialSnapHandle && potentialSnapHandle.position ? this._getSnappedMouseEvent(event, potentialSnapHandle.position) : event;
  }

  handleStartDragging(event) {
    this._startDragSnapHandlePosition = ((0, _modeHandler.getPickedEditHandle)(event.picks) || {}).position;
    return this._handler.handleStartDragging(event);
  }

  handleStopDragging(event) {
    var modeActionSummary = this._handler.handleStopDragging(this._getSnapAwareEvent(event));

    this._editHandlePicks = null;
    return modeActionSummary;
  }

  getCursor(event) {
    return this._handler.getCursor(event);
  }

  handlePointerMove(event) {
    var _ref6 = this._handler.getModeConfig() || {},
        enableSnapping = _ref6.enableSnapping;

    if (enableSnapping) {
      this._editHandlePicks = this._getEditHandlePicks(event);
    }

    var modeActionSummary = this._handler.handlePointerMove(this._getSnapAwareEvent(event));

    var editAction = modeActionSummary.editAction;

    if (editAction) {
      this._updatePickedHandlePosition(editAction);
    }

    return modeActionSummary;
  }

}

exports.SnappableHandler = SnappableHandler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL3NuYXBwYWJsZS1oYW5kbGVyLmpzIl0sIm5hbWVzIjpbIlNuYXBwYWJsZUhhbmRsZXIiLCJNb2RlSGFuZGxlciIsImNvbnN0cnVjdG9yIiwiaGFuZGxlciIsIl9oYW5kbGVyIiwic2V0RmVhdHVyZUNvbGxlY3Rpb24iLCJmZWF0dXJlQ29sbGVjdGlvbiIsInNldE1vZGVDb25maWciLCJtb2RlQ29uZmlnIiwiX21vZGVDb25maWciLCJzZXRTZWxlY3RlZEZlYXR1cmVJbmRleGVzIiwiaW5kZXhlcyIsIl9nZXRTbmFwcGVkTW91c2VFdmVudCIsImV2ZW50Iiwic25hcFBvaW50IiwiT2JqZWN0IiwiYXNzaWduIiwiZ3JvdW5kQ29vcmRzIiwicG9pbnRlckRvd25Hcm91bmRDb29yZHMiLCJfc3RhcnREcmFnU25hcEhhbmRsZVBvc2l0aW9uIiwiX2dldEVkaXRIYW5kbGVQaWNrcyIsInBpY2tzIiwicG90ZW50aWFsU25hcEhhbmRsZSIsImZpbmQiLCJwaWNrIiwib2JqZWN0IiwidHlwZSIsImhhbmRsZXMiLCJwaWNrZWRIYW5kbGUiLCJwb2ludGVyRG93blBpY2tzIiwiX3VwZGF0ZVBpY2tlZEhhbmRsZVBvc2l0aW9uIiwiZWRpdEFjdGlvbiIsIl9lZGl0SGFuZGxlUGlja3MiLCJmZWF0dXJlSW5kZXhlcyIsInVwZGF0ZWREYXRhIiwiaSIsImxlbmd0aCIsInNlbGVjdGVkSW5kZXgiLCJ1cGRhdGVkRmVhdHVyZSIsImZlYXR1cmVzIiwicG9zaXRpb25JbmRleGVzIiwiZmVhdHVyZUluZGV4IiwiY29vcmRpbmF0ZXMiLCJnZW9tZXRyeSIsInBvc2l0aW9uIiwicmVkdWNlIiwiYSIsImIiLCJfZ2V0U25hcFRhcmdldHMiLCJnZXRNb2RlQ29uZmlnIiwiYWRkaXRpb25hbFNuYXBUYXJnZXRzIiwiZ2V0T2JqZWN0IiwiX2dldE5vblBpY2tlZEludGVybWVkaWF0ZUhhbmRsZXMiLCJpc0N1cnJlbnRJbmRleEZlYXR1cmVOb3RTZWxlY3RlZCIsImdldFNlbGVjdGVkRmVhdHVyZUluZGV4ZXMiLCJpbmNsdWRlcyIsInB1c2giLCJnZXRFZGl0SGFuZGxlcyIsImVuYWJsZVNuYXBwaW5nIiwiaW5kZXgiLCJmaWx0ZXIiLCJCb29sZWFuIiwiX2dldFNuYXBBd2FyZUV2ZW50IiwiaGFuZGxlU3RhcnREcmFnZ2luZyIsImhhbmRsZVN0b3BEcmFnZ2luZyIsIm1vZGVBY3Rpb25TdW1tYXJ5IiwiZ2V0Q3Vyc29yIiwiaGFuZGxlUG9pbnRlck1vdmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFLQTs7Ozs7Ozs7Ozs7Ozs7QUFJQTtBQUNPLE1BQU1BLGdCQUFOLFNBQStCQyx3QkFBL0IsQ0FBMkM7QUFLaERDLEVBQUFBLFdBQVcsQ0FBQ0MsT0FBRCxFQUF1QjtBQUNoQzs7QUFEZ0M7O0FBQUE7O0FBQUE7O0FBRWhDLFNBQUtDLFFBQUwsR0FBZ0JELE9BQWhCO0FBQ0Q7O0FBRURFLEVBQUFBLG9CQUFvQixDQUFDQyxpQkFBRCxFQUE2QztBQUMvRCxTQUFLRixRQUFMLENBQWNDLG9CQUFkLENBQW1DQyxpQkFBbkM7QUFDRDs7QUFFREMsRUFBQUEsYUFBYSxDQUFDQyxVQUFELEVBQXdCO0FBQ25DLFNBQUtDLFdBQUwsR0FBbUJELFVBQW5COztBQUNBLFNBQUtKLFFBQUwsQ0FBY0csYUFBZCxDQUE0QkMsVUFBNUI7QUFDRDs7QUFFREUsRUFBQUEseUJBQXlCLENBQUNDLE9BQUQsRUFBMEI7QUFDakQsU0FBS1AsUUFBTCxDQUFjTSx5QkFBZCxDQUF3Q0MsT0FBeEM7QUFDRDs7QUFFREMsRUFBQUEscUJBQXFCLENBQUNDLEtBQUQsRUFBZ0JDLFNBQWhCLEVBQXVEO0FBQzFFLFdBQU9DLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLEVBQWQsRUFBa0JILEtBQWxCLEVBQXlCO0FBQzlCSSxNQUFBQSxZQUFZLEVBQUVILFNBRGdCO0FBRTlCSSxNQUFBQSx1QkFBdUIsRUFBRSxLQUFLQztBQUZBLEtBQXpCLENBQVA7QUFJRDs7QUFFREMsRUFBQUEsbUJBQW1CLENB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LGlCQUFQO0FBQ0Q7O0FBRURDLEVBQUFBLFNBQVMsQ0FBQ3JELEtBQUQsRUFBeUM7QUFDaEQsV0FBTyxLQUFLVCxRQUFMLENBQWM4RCxTQUFkLENBQXdCckQsS0FBeEIsQ0FBUDtBQUNEOztBQUVEc0QsRUFBQUEsaUJBQWlCLENBQUN0RCxLQUFELEVBQThFO0FBQUEsZ0JBQ2xFLEtBQUtULFFBQUwsQ0FBYzZDLGFBQWQsTUFBaUMsRUFEaUM7QUFBQSxRQUNyRlMsY0FEcUYsU0FDckZBLGNBRHFGOztBQUc3RixRQUFJQSxjQUFKLEVBQW9CO0FBQ2xCLFdBQUsxQixnQkFBTCxHQUF3QixLQUFLWixtQkFBTCxDQUF5QlAsS0FBekIsQ0FBeEI7QUFDRDs7QUFFRCxRQUFNb0QsaUJBQWlCLEdBQUcsS0FBSzdELFFBQUwsQ0FBYytELGlCQUFkLENBQWdDLEtBQUtMLGtCQUFMLENBQXdCakQsS0FBeEIsQ0FBaEMsQ0FBMUI7O0FBUDZGLFFBUXJGa0IsVUFScUYsR0FRdEVrQyxpQkFSc0UsQ0FRckZsQyxVQVJxRjs7QUFTN0YsUUFBSUEsVUFBSixFQUFnQjtBQUNkLFdBQUtELDJCQUFMLENBQWlDQyxVQUFqQztBQUNEOztBQUVELFdBQU9rQyxpQkFBUDtBQUNEOztBQXBLK0MiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuXG5pbXBvcnQgdHlwZSB7IEZlYXR1cmUsIEZlYXR1cmVDb2xsZWN0aW9uLCBQb3NpdGlvbiB9IGZyb20gJ2tlcGxlci1vdXRkYXRlZC1uZWJ1bGEuZ2wtZWRpdC1tb2Rlcyc7XG5pbXBvcnQgdHlwZSB7IFBvaW50ZXJNb3ZlRXZlbnQsIFN0YXJ0RHJhZ2dpbmdFdmVudCwgU3RvcERyYWdnaW5nRXZlbnQgfSBmcm9tICcuLi9ldmVudC10eXBlcy5qcyc7XG5pbXBvcnQgdHlwZSB7IEVkaXRIYW5kbGUsIEVkaXRBY3Rpb24gfSBmcm9tICcuL21vZGUtaGFuZGxlci5qcyc7XG5pbXBvcnQgeyBNb2RlSGFuZGxlciwgZ2V0UGlja2VkRWRpdEhhbmRsZSwgZ2V0RWRpdEhhbmRsZXNGb3JHZW9tZXRyeSB9IGZyb20gJy4vbW9kZS1oYW5kbGVyLmpzJztcblxudHlwZSBIYW5kbGVQaWNrcyA9IHsgcGlja2VkSGFuZGxlPzogRWRpdEhhbmRsZSwgcG90ZW50aWFsU25hcEhhbmRsZT86IEVkaXRIYW5kbGUgfTtcblxuLy8gVE9ETyBlZGl0LW1vZGVzOiBkZWxldGUgaGFuZGxlcnMgb25jZSBFZGl0TW9kZSBmdWxseSBpbXBsZW1lbnRlZFxuZXhwb3J0IGNsYXNzIFNuYXBwYWJsZUhhbmRsZXIgZXh0ZW5kcyBNb2RlSGFuZGxlciB7XG4gIF9oYW5kbGVyOiBNb2RlSGFuZGxlcjtcbiAgX2VkaXRIYW5kbGVQaWNrczogP0hhbmRsZVBpY2tzO1xuICBfc3RhcnREcmFnU25hcEhhbmRsZVBvc2l0aW9uOiBQb3NpdGlvbjtcblxuICBjb25zdHJ1Y3RvcihoYW5kbGVyOiBNb2RlSGFuZGxlcikge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5faGFuZGxlciA9IGhhbmRsZXI7XG4gIH1cblxuICBzZXRGZWF0dXJlQ29sbGVjdGlvbihmZWF0dXJlQ29sbGVjdGlvbjogRmVhdHVyZUNvbGxlY3Rpb24pOiB2b2lkIHtcbiAgICB0aGlzLl9oYW5kbGVyLnNldEZlYXR1cmVDb2xsZWN0aW9uKGZlYXR1cmVDb2xsZWN0aW9uKTtcbiAgfVxuXG4gIHNldE1vZGVDb25maWcobW9kZUNvbmZpZzogYW55KTogdm9pZCB7XG4gICAgdGhpcy5fbW9kZUNvbmZpZyA9IG1vZGVDb25maWc7XG4gICAgdGhpcy5faGFuZGxlci5zZXRNb2RlQ29uZmlnKG1vZGVDb25maWcpO1xuICB9XG5cbiAgc2V0U2VsZWN0ZWRGZWF0dXJlSW5kZXhlcyhpbmRleGVzOiBudW1iZXJbXSk6IHZvaWQge1xuICAgIHRoaXMuX2hhbmRsZXIuc2V0U2VsZWN0ZWRGZWF0dXJlSW5kZXhlcyhpbmRleGVzKTtcbiAgfVxuXG4gIF9nZXRTbmFwcGVkTW91c2VFdmVudChldmVudDogT2JqZWN0LCBzbmFwUG9pbnQ6IFBvc2l0aW9uKTogUG9pbnRlck1vdmVFdmVudCB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIGV2ZW50LCB7XG4gICAgICBncm91bmRDb29yZHM6IHNuYXBQb2ludCxcbiAgICAgIHBvaW50ZXJEb3duR3JvdW5kQ29vcmRzOiB0aGlzLl9zdGFydERyYWdTbmFwSGFuZGxlUG9zaXRpb25cbiAgICB9KTtcbiAgfVxuXG4gIF9nZXRFZGl0SGFuZGxlUGlja3MoZXZlbnQ6IFBvaW50ZXJNb3ZlRXZlbnQpOiBIYW5kbGVQaWNrcyB7XG4gICAgY29uc3QgeyBwaWNrcyB9ID0gZXZlbnQ7XG5cbiAgICBjb25zdCBwb3RlbnRpYWxTbmFwSGFuZGxlID0gcGlja3MuZmluZChcbiAgICAgIHBpY2sgPT4gcGljay5vYmplY3QgJiYgcGljay5vYmplY3QudHlwZSA9PT0gJ2ludGVybWVkaWF0ZSdcbiAgICApO1xuICAgIGNvbnN0IGhhbmRsZXMgPSB7IHBvdGVudGlhbFNuYXBIYW5kbGU6IHBvdGVudGlhbFNuYXBIYW5kbGUgJiYgcG90ZW50aWFsU25hcEhhbmRsZS5vYmplY3QgfTtcblxuICAgIGNvbnN0IHBpY2tlZEhhbmRsZSA9IGdldFBpY2tlZEVkaXRIYW5kbGUoZXZlbnQucG9pbnRlckRvd25QaWNrcyk7XG4gICAgaWYgKHBpY2tlZEhhbmRsZSkge1xuICAgICAgcmV0dXJuIHsgLi4uaGFuZGxlcywgcGlja2VkSGFuZGxlIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIGhhbmRsZXM7XG4gIH1cblxuICBfdXBkYXRlUGlja2VkSGFuZGxlUG9zaXRpb24oZWRpdEFjdGlvbjogRWRpdEFjdGlvbikge1xuICAgIGNvbnN0IHsgcGlja2VkSGFuZGxlIH0gPSB0aGlzLl9lZGl0SGFuZGxlUGlja3MgfHwge307XG5cbiAgICBpZiAocGlja2VkSGFuZGxlICYmIGVkaXRBY3Rpb24pIHtcbiAgICAgIGNvbnN0IHsgZmVhdHVyZUluZGV4ZXMsIHVwZGF0ZWREYXRhIH0gPSBlZGl0QWN0aW9uO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZlYXR1cmVJbmRleGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHNlbGVjdGVkSW5kZXggPSBmZWF0dXJlSW5kZXhlc1tpXTtcbiAgICAgICAgY29uc3QgdXBkYXRlZEZlYXR1cmUgPSB1cGRhdGVkRGF0YS5mZWF0dXJlc1tzZWxlY3RlZEluZGV4XTtcblxuICAgICAgICBjb25zdCB7IHBvc2l0aW9uSW5kZXhlcywgZmVhdHVyZUluZGV4IH0gPSBwaWNrZWRIYW5kbGU7XG4gICAgICAgIGlmIChzZWxlY3RlZEluZGV4ID49IDAgJiYgZmVhdHVyZUluZGV4ID09PSBzZWxlY3RlZEluZGV4KSB7XG4gICAgICAgICAgY29uc3QgeyBjb29yZGluYXRlcyB9ID0gdXBkYXRlZEZlYXR1cmUuZ2VvbWV0cnk7XG4gICAgICAgICAgcGlja2VkSGFuZGxlLnBvc2l0aW9uID0gcG9zaXRpb25JbmRleGVzLnJlZHVjZShcbiAgICAgICAgICAgIChhOiBhbnlbXSwgYjogbnVtYmVyKSA9PiBhW2JdLFxuICAgICAgICAgICAgY29vcmRpbmF0ZXNcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gSWYgYWRkaXRpb25hbFNuYXBUYXJnZXRzIGlzIHByZXNlbnQgaW4gbW9kZUNvbmZpZyBhbmQgaXMgcG9wdWxhdGVkLCB0aGlzXG4gIC8vIG1ldGhvZCB3aWxsIHJldHVybiB0aG9zZSBmZWF0dXJlcyBhbG9uZyB3aXRoIHRoZSBmZWF0dXJlc1xuICAvLyB0aGF0IGxpdmUgaW4gdGhlIGN1cnJlbnQgbGF5ZXIuIE90aGVyd2lzZSwgdGhpcyBtZXRob2Qgd2lsbCBzaW1wbHkgcmV0dXJuIHRoZVxuICAvLyBmZWF0dXJlcyBmcm9tIHRoZSBjdXJyZW50IGxheWVyXG4gIF9nZXRTbmFwVGFyZ2V0cygpOiBGZWF0dXJlW10ge1xuICAgIGxldCB7IGFkZGl0aW9uYWxTbmFwVGFyZ2V0cyB9ID0gdGhpcy5nZXRNb2RlQ29uZmlnKCkgfHwge307XG4gICAgYWRkaXRpb25hbFNuYXBUYXJnZXRzID0gYWRkaXRpb25hbFNuYXBUYXJnZXRzIHx8IFtdO1xuXG4gICAgY29uc3QgZmVhdHVyZXMgPSBbXG4gICAgICAuLi50aGlzLl9oYW5kbGVyLmZlYXR1cmVDb2xsZWN0aW9uLmdldE9iamVjdCgpLmZlYXR1cmVzLFxuICAgICAgLi4uYWRkaXRpb25hbFNuYXBUYXJnZXRzXG4gICAgXTtcbiAgICByZXR1cm4gZmVhdHVyZXM7XG4gIH1cblxuICBfZ2V0Tm9uUGlja2VkSW50ZXJtZWRpYXRlSGFuZGxlcygpOiBFZGl0SGFuZGxlW10ge1xuICAgIGNvbnN0IGhhbmRsZXMgPSBbXTtcbiAgICBjb25zdCBmZWF0dXJlcyA9IHRoaXMuX2dldFNuYXBUYXJnZXRzKCk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZlYXR1cmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAvLyBGaWx0ZXIgb3V0IHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgZmVhdHVyZShzKVxuICAgICAgY29uc3QgaXNDdXJyZW50SW5kZXhGZWF0dXJlTm90U2VsZWN0ZWQgPVxuICAgICAgICBpIDwgZmVhdHVyZXMubGVuZ3RoICYmICF0aGlzLl9oYW5kbGVyLmdldFNlbGVjdGVkRmVhdHVyZUluZGV4ZXMoKS5pbmNsdWRlcyhpKTtcblxuICAgICAgaWYgKGlzQ3VycmVudEluZGV4RmVhdHVyZU5vdFNlbGVjdGVkKSB7XG4gICAgICAgIGNvbnN0IHsgZ2VvbWV0cnkgfSA9IGZlYXR1cmVzW2ldO1xuICAgICAgICBoYW5kbGVzLnB1c2goLi4uZ2V0RWRpdEhhbmRsZXNGb3JHZW9tZXRyeShnZW9tZXRyeSwgaSwgJ2ludGVybWVkaWF0ZScpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGhhbmRsZXM7XG4gIH1cblxuICAvLyBJZiBubyBzbmFwIGhhbmRsZSBoYXMgYmVlbiBwaWNrZWQsIG9ubHkgZGlzcGxheSB0aGUgZWRpdCBoYW5kbGVzIG9mIHRoZVxuICAvLyBzZWxlY3RlZCBmZWF0dXJlLiBJZiBhIHNuYXAgaGFuZGxlIGhhcyBiZWVuIHBpY2tlZCwgZGlzcGxheSBzYWlkIHNuYXAgaGFuZGxlXG4gIC8vIGFsb25nIHdpdGggYWxsIHNuYXBwYWJsZSBwb2ludHMgb24gYWxsIG5vbi1zZWxlY3RlZCBmZWF0dXJlcy5cbiAgZ2V0RWRpdEhhbmRsZXMocGlja3M/OiBBcnJheTxPYmplY3Q+LCBncm91bmRDb29yZHM/OiBQb3NpdGlvbik6IGFueVtdIHtcbiAgICBjb25zdCB7IGVuYWJsZVNuYXBwaW5nIH0gPSB0aGlzLl9tb2RlQ29uZmlnIHx8IHt9O1xuICAgIGNvbnN0IGhhbmRsZXMgPSB0aGlzLl9oYW5kbGVyLmdldEVkaXRIYW5kbGVzKHBpY2tzLCBncm91bmRDb29yZHMpO1xuXG4gICAgaWYgKCFlbmFibGVTbmFwcGluZykgcmV0dXJuIGhhbmRsZXM7XG4gICAgY29uc3QgeyBwaWNrZWRIYW5kbGUgfSA9IHRoaXMuX2VkaXRIYW5kbGVQaWNrcyB8fCB7fTtcblxuICAgIGlmIChwaWNrZWRIYW5kbGUpIHtcbiAgICAgIGhhbmRsZXMucHVzaCguLi50aGlzLl9nZXROb25QaWNrZWRJbnRlcm1lZGlhdGVIYW5kbGVzKCksIHBpY2tlZEhhbmRsZSk7XG4gICAgICByZXR1cm4gaGFuZGxlcztcbiAgICB9XG5cbiAgICBjb25zdCB7IGZlYXR1cmVzIH0gPSB0aGlzLl9oYW5kbGVyLmZlYXR1cmVDb2xsZWN0aW9uLmdldE9iamVjdCgpO1xuICAgIGZvciAoY29uc3QgaW5kZXggb2YgdGhpcy5faGFuZGxlci5nZXRTZWxlY3RlZEZlYXR1cmVJbmRleGVzKCkpIHtcbiAgICAgIGlmIChpbmRleCA8IGZlYXR1cmVzLmxlbmd0aCkge1xuICAgICAgICBjb25zdCB7IGdlb21ldHJ5IH0gPSBmZWF0dXJlc1tpbmRleF07XG4gICAgICAgIGhhbmRsZXMucHVzaCguLi5nZXRFZGl0SGFuZGxlc0Zvckdlb21ldHJ5KGdlb21ldHJ5LCBpbmRleCwgJ3NuYXAnKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGhhbmRsZXMuZmlsdGVyKEJvb2xlYW4pO1xuICB9XG5cbiAgX2dldFNuYXBBd2FyZUV2ZW50KGV2ZW50OiBPYmplY3QpOiBPYmplY3Qge1xuICAgIGNvbnN0IHsgcG90ZW50aWFsU25hcEhhbmRsZSB9ID0gdGhpcy5fZWRpdEhhbmRsZVBpY2tzIHx8IHt9O1xuXG4gICAgcmV0dXJuIHBvdGVudGlhbFNuYXBIYW5kbGUgJiYgcG90ZW50aWFsU25hcEhhbmRsZS5wb3NpdGlvblxuICAgICAgPyB0aGlzLl9nZXRTbmFwcGVkTW91c2VFdmVudChldmVudCwgcG90ZW50aWFsU25hcEhhbmRsZS5wb3NpdGlvbilcbiAgICAgIDogZXZlbnQ7XG4gIH1cblxuICBoYW5kbGVTdGFydERyYWdnaW5nKGV2ZW50OiBTdGFydERyYWdnaW5nRXZlbnQpOiA/RWRpdEFjdGlvbiB7XG4gICAgdGhpcy5fc3RhcnREcmFnU25hcEhhbmRsZVBvc2l0aW9uID0gKGdldFBpY2tlZEVkaXRIYW5kbGUoZXZlbnQucGlja3MpIHx8IHt9KS5wb3NpdGlvbjtcbiAgICByZXR1cm4gdGhpcy5faGFuZGxlci5oYW5kbGVTdGFydERyYWdnaW5nKGV2ZW50KTtcbiAgfVxuXG4gIGhhbmRsZVN0b3BEcmFnZ2luZyhldmVudDogU3RvcERyYWdnaW5nRXZlbnQpOiA/RWRpdEFjdGlvbiB7XG4gICAgY29uc3QgbW9kZUFjdGlvblN1bW1hcnkgPSB0aGlzLl9oYW5kbGVyLmhhbmRsZVN0b3BEcmFnZ2luZyh0aGlzLl9nZXRTbmFwQXdhcmVFdmVudChldmVudCkpO1xuXG4gICAgdGhpcy5fZWRpdEhhbmRsZVBpY2tzID0gbnVsbDtcbiAgICByZXR1cm4gbW9kZUFjdGlvblN1bW1hcnk7XG4gIH1cblxuICBnZXRDdXJzb3IoZXZlbnQ6IHsgaXNEcmFnZ2luZzogYm9vbGVhbiB9KTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5faGFuZGxlci5nZXRDdXJzb3IoZXZlbnQpO1xuICB9XG5cbiAgaGFuZGxlUG9pbnRlck1vdmUoZXZlbnQ6IFBvaW50ZXJNb3ZlRXZlbnQpOiB7IGVkaXRBY3Rpb246ID9FZGl0QWN0aW9uLCBjYW5jZWxNYXBQYW46IGJvb2xlYW4gfSB7XG4gICAgY29uc3QgeyBlbmFibGVTbmFwcGluZyB9ID0gdGhpcy5faGFuZGxlci5nZXRNb2RlQ29uZmlnKCkgfHwge307XG5cbiAgICBpZiAoZW5hYmxlU25hcHBpbmcpIHtcbiAgICAgIHRoaXMuX2VkaXRIYW5kbGVQaWNrcyA9IHRoaXMuX2dldEVkaXRIYW5kbGVQaWNrcyhldmVudCk7XG4gICAgfVxuXG4gICAgY29uc3QgbW9kZUFjdGlvblN1bW1hcnkgPSB0aGlzLl9oYW5kbGVyLmhhbmRsZVBvaW50ZXJNb3ZlKHRoaXMuX2dldFNuYXBBd2FyZUV2ZW50KGV2ZW50KSk7XG4gICAgY29uc3QgeyBlZGl0QWN0aW9uIH0gPSBtb2RlQWN0aW9uU3VtbWFyeTtcbiAgICBpZiAoZWRpdEFjdGlvbikge1xuICAgICAgdGhpcy5fdXBkYXRlUGlja2VkSGFuZGxlUG9zaXRpb24oZWRpdEFjdGlvbik7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1vZGVBY3Rpb25TdW1tYXJ5O1xuICB9XG59XG4iXX0=