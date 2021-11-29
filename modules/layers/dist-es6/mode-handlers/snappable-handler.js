"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SnappableHandler = void 0;

var _modeHandler = require("./mode-handler.js");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

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

// TODO edit-modes: delete handlers once EditMode fully implemented
var SnappableHandler =
/*#__PURE__*/
function (_ModeHandler) {
  _inherits(SnappableHandler, _ModeHandler);

  function SnappableHandler(handler) {
    var _this;

    _classCallCheck(this, SnappableHandler);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SnappableHandler).call(this));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_handler", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_editHandlePicks", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_startDragSnapHandlePosition", void 0);

    _this._handler = handler;
    return _this;
  }

  _createClass(SnappableHandler, [{
    key: "setFeatureCollection",
    value: function setFeatureCollection(featureCollection) {
      this._handler.setFeatureCollection(featureCollection);
    }
  }, {
    key: "setModeConfig",
    value: function setModeConfig(modeConfig) {
      this._modeConfig = modeConfig;

      this._handler.setModeConfig(modeConfig);
    }
  }, {
    key: "setSelectedFeatureIndexes",
    value: function setSelectedFeatureIndexes(indexes) {
      this._handler.setSelectedFeatureIndexes(indexes);
    }
  }, {
    key: "_getSnappedMouseEvent",
    value: function _getSnappedMouseEvent(event, snapPoint) {
      return Object.assign({}, event, {
        groundCoords: snapPoint,
        pointerDownGroundCoords: this._startDragSnapHandlePosition
      });
    }
  }, {
    key: "_getEditHandlePicks",
    value: function _getEditHandlePicks(event) {
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
  }, {
    key: "_updatePickedHandlePosition",
    value: function _updatePickedHandlePosition(editAction) {
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

  }, {
    key: "_getSnapTargets",
    value: function _getSnapTargets() {
      var _ref2 = this.getModeConfig() || {},
          additionalSnapTargets = _ref2.additionalSnapTargets;

      additionalSnapTargets = additionalSnapTargets || [];

      var features = _toConsumableArray(this._handler.featureCollection.getObject().features).concat(_toConsumableArray(additionalSnapTargets));

      return features;
    }
  }, {
    key: "_getNonPickedIntermediateHandles",
    value: function _getNonPickedIntermediateHandles() {
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

  }, {
    key: "getEditHandles",
    value: function getEditHandles(picks, groundCoords) {
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
  }, {
    key: "_getSnapAwareEvent",
    value: function _getSnapAwareEvent(event) {
      var _ref5 = this._editHandlePicks || {},
          potentialSnapHandle = _ref5.potentialSnapHandle;

      return potentialSnapHandle && potentialSnapHandle.position ? this._getSnappedMouseEvent(event, potentialSnapHandle.position) : event;
    }
  }, {
    key: "handleStartDragging",
    value: function handleStartDragging(event) {
      this._startDragSnapHandlePosition = ((0, _modeHandler.getPickedEditHandle)(event.picks) || {}).position;
      return this._handler.handleStartDragging(event);
    }
  }, {
    key: "handleStopDragging",
    value: function handleStopDragging(event) {
      var modeActionSummary = this._handler.handleStopDragging(this._getSnapAwareEvent(event));

      this._editHandlePicks = null;
      return modeActionSummary;
    }
  }, {
    key: "getCursor",
    value: function getCursor(event) {
      return this._handler.getCursor(event);
    }
  }, {
    key: "handlePointerMove",
    value: function handlePointerMove(event) {
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
  }]);

  return SnappableHandler;
}(_modeHandler.ModeHandler);

exports.SnappableHandler = SnappableHandler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL3NuYXBwYWJsZS1oYW5kbGVyLmpzIl0sIm5hbWVzIjpbIlNuYXBwYWJsZUhhbmRsZXIiLCJoYW5kbGVyIiwiX2hhbmRsZXIiLCJmZWF0dXJlQ29sbGVjdGlvbiIsInNldEZlYXR1cmVDb2xsZWN0aW9uIiwibW9kZUNvbmZpZyIsIl9tb2RlQ29uZmlnIiwic2V0TW9kZUNvbmZpZyIsImluZGV4ZXMiLCJzZXRTZWxlY3RlZEZlYXR1cmVJbmRleGVzIiwiZXZlbnQiLCJzbmFwUG9pbnQiLCJPYmplY3QiLCJhc3NpZ24iLCJncm91bmRDb29yZHMiLCJwb2ludGVyRG93bkdyb3VuZENvb3JkcyIsIl9zdGFydERyYWdTbmFwSGFuZGxlUG9zaXRpb24iLCJwaWNrcyIsInBvdGVudGlhbFNuYXBIYW5kbGUiLCJmaW5kIiwicGljayIsIm9iamVjdCIsInR5cGUiLCJoYW5kbGVzIiwicGlja2VkSGFuZGxlIiwicG9pbnRlckRvd25QaWNrcyIsImVkaXRBY3Rpb24iLCJfZWRpdEhhbmRsZVBpY2tzIiwiZmVhdHVyZUluZGV4ZXMiLCJ1cGRhdGVkRGF0YSIsImkiLCJsZW5ndGgiLCJzZWxlY3RlZEluZGV4IiwidXBkYXRlZEZlYXR1cmUiLCJmZWF0dXJlcyIsInBvc2l0aW9uSW5kZXhlcyIsImZlYXR1cmVJbmRleCIsImNvb3JkaW5hdGVzIiwiZ2VvbWV0cnkiLCJwb3NpdGlvbiIsInJlZHVjZSIsImEiLCJiIiwiZ2V0TW9kZUNvbmZpZyIsImFkZGl0aW9uYWxTbmFwVGFyZ2V0cyIsImdldE9iamVjdCIsIl9nZXRTbmFwVGFyZ2V0cyIsImlzQ3VycmVudEluZGV4RmVhdHVyZU5vdFNlbGVjdGVkIiwiZ2V0U2VsZWN0ZWRGZWF0dXJlSW5kZXhlcyIsImluY2x1ZGVzIiwicHVzaCIsImVuYWJsZVNuYXBwaW5nIiwiZ2V0RWRpdEhhbmRsZXMiLCJfZ2V0Tm9uUGlja2VkSW50ZXJtZWRpYXRlSGFuZGxlcyIsImluZGV4IiwiZmlsdGVyIiwiQm9vbGVhbiIsIl9nZXRTbmFwcGVkTW91c2VFdmVudCIsImhhbmRsZVN0YXJ0RHJhZ2dpbmciLCJtb2RlQWN0aW9uU3VtbWFyeSIsImhhbmRsZVN0b3BEcmFnZ2luZyIsIl9nZXRTbmFwQXdhcmVFdmVudCIsImdldEN1cnNvciIsIl9nZXRFZGl0SGFuZGxlUGlja3MiLCJoYW5kbGVQb2ludGVyTW92ZSIsIl91cGRhdGVQaWNrZWRIYW5kbGVQb3NpdGlvbiIsIk1vZGVIYW5kbGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBS0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBSUE7SUFDYUEsZ0I7Ozs7O0FBS1gsNEJBQVlDLE9BQVosRUFBa0M7QUFBQTs7QUFBQTs7QUFDaEM7O0FBRGdDOztBQUFBOztBQUFBOztBQUVoQyxVQUFLQyxRQUFMLEdBQWdCRCxPQUFoQjtBQUZnQztBQUdqQzs7Ozt5Q0FFb0JFLGlCLEVBQTRDO0FBQy9ELFdBQUtELFFBQUwsQ0FBY0Usb0JBQWQsQ0FBbUNELGlCQUFuQztBQUNEOzs7a0NBRWFFLFUsRUFBdUI7QUFDbkMsV0FBS0MsV0FBTCxHQUFtQkQsVUFBbkI7O0FBQ0EsV0FBS0gsUUFBTCxDQUFjSyxhQUFkLENBQTRCRixVQUE1QjtBQUNEOzs7OENBRXlCRyxPLEVBQXlCO0FBQ2pELFdBQUtOLFFBQUwsQ0FBY08seUJBQWQsQ0FBd0NELE9BQXhDO0FBQ0Q7OzswQ0FFcUJFLEssRUFBZUMsUyxFQUF1QztBQUMxRSxhQUFPQyxNQUFNLENBQUNDLE1BQVAsQ0FBYyxFQUFkLEVBQWtCSCxLQUFsQixFQUF5QjtBQUM5QkksUUFBQUEsWUFBWSxFQUFFSCxTQURnQjtBQUU5QkksUUFBQUEsdUJBQXVCLEVBQUUsS0FBS0M7QUFGQSxPQUF6QixDQUFQO0FBSUQ7Ozt3Q0FFbUJOLEssRUFBc0M7QUFBQSxVQUNoRE8sS0FEZ0QsR0FDdENQLEtBRHNDLENBQ2hETyxLQURnRDtBQUd4RCxVQUFNQyxtQkFBbUIsR0FBR0QsS0FBSyxDQUFDRSxJQUFOLENBQzFCLFVBQUFD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QXhCO0FBQ0Q7O0FBRUQsVUFBTWlELGlCQUFpQixHQUFHLEtBQUt6RCxRQUFMLENBQWM4RCxpQkFBZCxDQUFnQyxLQUFLSCxrQkFBTCxDQUF3Qm5ELEtBQXhCLENBQWhDLENBQTFCOztBQVA2RixVQVFyRmdCLFVBUnFGLEdBUXRFaUMsaUJBUnNFLENBUXJGakMsVUFScUY7O0FBUzdGLFVBQUlBLFVBQUosRUFBZ0I7QUFDZCxhQUFLdUMsMkJBQUwsQ0FBaUN2QyxVQUFqQztBQUNEOztBQUVELGFBQU9pQyxpQkFBUDtBQUNEOzs7O0VBcEttQ08sd0IiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuXG5pbXBvcnQgdHlwZSB7IEZlYXR1cmUsIEZlYXR1cmVDb2xsZWN0aW9uLCBQb3NpdGlvbiB9IGZyb20gJ2tlcGxlci1vdXRkYXRlZC1uZWJ1bGEuZ2wtZWRpdC1tb2Rlcyc7XG5pbXBvcnQgdHlwZSB7IFBvaW50ZXJNb3ZlRXZlbnQsIFN0YXJ0RHJhZ2dpbmdFdmVudCwgU3RvcERyYWdnaW5nRXZlbnQgfSBmcm9tICcuLi9ldmVudC10eXBlcy5qcyc7XG5pbXBvcnQgdHlwZSB7IEVkaXRIYW5kbGUsIEVkaXRBY3Rpb24gfSBmcm9tICcuL21vZGUtaGFuZGxlci5qcyc7XG5pbXBvcnQgeyBNb2RlSGFuZGxlciwgZ2V0UGlja2VkRWRpdEhhbmRsZSwgZ2V0RWRpdEhhbmRsZXNGb3JHZW9tZXRyeSB9IGZyb20gJy4vbW9kZS1oYW5kbGVyLmpzJztcblxudHlwZSBIYW5kbGVQaWNrcyA9IHsgcGlja2VkSGFuZGxlPzogRWRpdEhhbmRsZSwgcG90ZW50aWFsU25hcEhhbmRsZT86IEVkaXRIYW5kbGUgfTtcblxuLy8gVE9ETyBlZGl0LW1vZGVzOiBkZWxldGUgaGFuZGxlcnMgb25jZSBFZGl0TW9kZSBmdWxseSBpbXBsZW1lbnRlZFxuZXhwb3J0IGNsYXNzIFNuYXBwYWJsZUhhbmRsZXIgZXh0ZW5kcyBNb2RlSGFuZGxlciB7XG4gIF9oYW5kbGVyOiBNb2RlSGFuZGxlcjtcbiAgX2VkaXRIYW5kbGVQaWNrczogP0hhbmRsZVBpY2tzO1xuICBfc3RhcnREcmFnU25hcEhhbmRsZVBvc2l0aW9uOiBQb3NpdGlvbjtcblxuICBjb25zdHJ1Y3RvcihoYW5kbGVyOiBNb2RlSGFuZGxlcikge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5faGFuZGxlciA9IGhhbmRsZXI7XG4gIH1cblxuICBzZXRGZWF0dXJlQ29sbGVjdGlvbihmZWF0dXJlQ29sbGVjdGlvbjogRmVhdHVyZUNvbGxlY3Rpb24pOiB2b2lkIHtcbiAgICB0aGlzLl9oYW5kbGVyLnNldEZlYXR1cmVDb2xsZWN0aW9uKGZlYXR1cmVDb2xsZWN0aW9uKTtcbiAgfVxuXG4gIHNldE1vZGVDb25maWcobW9kZUNvbmZpZzogYW55KTogdm9pZCB7XG4gICAgdGhpcy5fbW9kZUNvbmZpZyA9IG1vZGVDb25maWc7XG4gICAgdGhpcy5faGFuZGxlci5zZXRNb2RlQ29uZmlnKG1vZGVDb25maWcpO1xuICB9XG5cbiAgc2V0U2VsZWN0ZWRGZWF0dXJlSW5kZXhlcyhpbmRleGVzOiBudW1iZXJbXSk6IHZvaWQge1xuICAgIHRoaXMuX2hhbmRsZXIuc2V0U2VsZWN0ZWRGZWF0dXJlSW5kZXhlcyhpbmRleGVzKTtcbiAgfVxuXG4gIF9nZXRTbmFwcGVkTW91c2VFdmVudChldmVudDogT2JqZWN0LCBzbmFwUG9pbnQ6IFBvc2l0aW9uKTogUG9pbnRlck1vdmVFdmVudCB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIGV2ZW50LCB7XG4gICAgICBncm91bmRDb29yZHM6IHNuYXBQb2ludCxcbiAgICAgIHBvaW50ZXJEb3duR3JvdW5kQ29vcmRzOiB0aGlzLl9zdGFydERyYWdTbmFwSGFuZGxlUG9zaXRpb25cbiAgICB9KTtcbiAgfVxuXG4gIF9nZXRFZGl0SGFuZGxlUGlja3MoZXZlbnQ6IFBvaW50ZXJNb3ZlRXZlbnQpOiBIYW5kbGVQaWNrcyB7XG4gICAgY29uc3QgeyBwaWNrcyB9ID0gZXZlbnQ7XG5cbiAgICBjb25zdCBwb3RlbnRpYWxTbmFwSGFuZGxlID0gcGlja3MuZmluZChcbiAgICAgIHBpY2sgPT4gcGljay5vYmplY3QgJiYgcGljay5vYmplY3QudHlwZSA9PT0gJ2ludGVybWVkaWF0ZSdcbiAgICApO1xuICAgIGNvbnN0IGhhbmRsZXMgPSB7IHBvdGVudGlhbFNuYXBIYW5kbGU6IHBvdGVudGlhbFNuYXBIYW5kbGUgJiYgcG90ZW50aWFsU25hcEhhbmRsZS5vYmplY3QgfTtcblxuICAgIGNvbnN0IHBpY2tlZEhhbmRsZSA9IGdldFBpY2tlZEVkaXRIYW5kbGUoZXZlbnQucG9pbnRlckRvd25QaWNrcyk7XG4gICAgaWYgKHBpY2tlZEhhbmRsZSkge1xuICAgICAgcmV0dXJuIHsgLi4uaGFuZGxlcywgcGlja2VkSGFuZGxlIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIGhhbmRsZXM7XG4gIH1cblxuICBfdXBkYXRlUGlja2VkSGFuZGxlUG9zaXRpb24oZWRpdEFjdGlvbjogRWRpdEFjdGlvbikge1xuICAgIGNvbnN0IHsgcGlja2VkSGFuZGxlIH0gPSB0aGlzLl9lZGl0SGFuZGxlUGlja3MgfHwge307XG5cbiAgICBpZiAocGlja2VkSGFuZGxlICYmIGVkaXRBY3Rpb24pIHtcbiAgICAgIGNvbnN0IHsgZmVhdHVyZUluZGV4ZXMsIHVwZGF0ZWREYXRhIH0gPSBlZGl0QWN0aW9uO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZlYXR1cmVJbmRleGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHNlbGVjdGVkSW5kZXggPSBmZWF0dXJlSW5kZXhlc1tpXTtcbiAgICAgICAgY29uc3QgdXBkYXRlZEZlYXR1cmUgPSB1cGRhdGVkRGF0YS5mZWF0dXJlc1tzZWxlY3RlZEluZGV4XTtcblxuICAgICAgICBjb25zdCB7IHBvc2l0aW9uSW5kZXhlcywgZmVhdHVyZUluZGV4IH0gPSBwaWNrZWRIYW5kbGU7XG4gICAgICAgIGlmIChzZWxlY3RlZEluZGV4ID49IDAgJiYgZmVhdHVyZUluZGV4ID09PSBzZWxlY3RlZEluZGV4KSB7XG4gICAgICAgICAgY29uc3QgeyBjb29yZGluYXRlcyB9ID0gdXBkYXRlZEZlYXR1cmUuZ2VvbWV0cnk7XG4gICAgICAgICAgcGlja2VkSGFuZGxlLnBvc2l0aW9uID0gcG9zaXRpb25JbmRleGVzLnJlZHVjZShcbiAgICAgICAgICAgIChhOiBhbnlbXSwgYjogbnVtYmVyKSA9PiBhW2JdLFxuICAgICAgICAgICAgY29vcmRpbmF0ZXNcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gSWYgYWRkaXRpb25hbFNuYXBUYXJnZXRzIGlzIHByZXNlbnQgaW4gbW9kZUNvbmZpZyBhbmQgaXMgcG9wdWxhdGVkLCB0aGlzXG4gIC8vIG1ldGhvZCB3aWxsIHJldHVybiB0aG9zZSBmZWF0dXJlcyBhbG9uZyB3aXRoIHRoZSBmZWF0dXJlc1xuICAvLyB0aGF0IGxpdmUgaW4gdGhlIGN1cnJlbnQgbGF5ZXIuIE90aGVyd2lzZSwgdGhpcyBtZXRob2Qgd2lsbCBzaW1wbHkgcmV0dXJuIHRoZVxuICAvLyBmZWF0dXJlcyBmcm9tIHRoZSBjdXJyZW50IGxheWVyXG4gIF9nZXRTbmFwVGFyZ2V0cygpOiBGZWF0dXJlW10ge1xuICAgIGxldCB7IGFkZGl0aW9uYWxTbmFwVGFyZ2V0cyB9ID0gdGhpcy5nZXRNb2RlQ29uZmlnKCkgfHwge307XG4gICAgYWRkaXRpb25hbFNuYXBUYXJnZXRzID0gYWRkaXRpb25hbFNuYXBUYXJnZXRzIHx8IFtdO1xuXG4gICAgY29uc3QgZmVhdHVyZXMgPSBbXG4gICAgICAuLi50aGlzLl9oYW5kbGVyLmZlYXR1cmVDb2xsZWN0aW9uLmdldE9iamVjdCgpLmZlYXR1cmVzLFxuICAgICAgLi4uYWRkaXRpb25hbFNuYXBUYXJnZXRzXG4gICAgXTtcbiAgICByZXR1cm4gZmVhdHVyZXM7XG4gIH1cblxuICBfZ2V0Tm9uUGlja2VkSW50ZXJtZWRpYXRlSGFuZGxlcygpOiBFZGl0SGFuZGxlW10ge1xuICAgIGNvbnN0IGhhbmRsZXMgPSBbXTtcbiAgICBjb25zdCBmZWF0dXJlcyA9IHRoaXMuX2dldFNuYXBUYXJnZXRzKCk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZlYXR1cmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAvLyBGaWx0ZXIgb3V0IHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgZmVhdHVyZShzKVxuICAgICAgY29uc3QgaXNDdXJyZW50SW5kZXhGZWF0dXJlTm90U2VsZWN0ZWQgPVxuICAgICAgICBpIDwgZmVhdHVyZXMubGVuZ3RoICYmICF0aGlzLl9oYW5kbGVyLmdldFNlbGVjdGVkRmVhdHVyZUluZGV4ZXMoKS5pbmNsdWRlcyhpKTtcblxuICAgICAgaWYgKGlzQ3VycmVudEluZGV4RmVhdHVyZU5vdFNlbGVjdGVkKSB7XG4gICAgICAgIGNvbnN0IHsgZ2VvbWV0cnkgfSA9IGZlYXR1cmVzW2ldO1xuICAgICAgICBoYW5kbGVzLnB1c2goLi4uZ2V0RWRpdEhhbmRsZXNGb3JHZW9tZXRyeShnZW9tZXRyeSwgaSwgJ2ludGVybWVkaWF0ZScpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGhhbmRsZXM7XG4gIH1cblxuICAvLyBJZiBubyBzbmFwIGhhbmRsZSBoYXMgYmVlbiBwaWNrZWQsIG9ubHkgZGlzcGxheSB0aGUgZWRpdCBoYW5kbGVzIG9mIHRoZVxuICAvLyBzZWxlY3RlZCBmZWF0dXJlLiBJZiBhIHNuYXAgaGFuZGxlIGhhcyBiZWVuIHBpY2tlZCwgZGlzcGxheSBzYWlkIHNuYXAgaGFuZGxlXG4gIC8vIGFsb25nIHdpdGggYWxsIHNuYXBwYWJsZSBwb2ludHMgb24gYWxsIG5vbi1zZWxlY3RlZCBmZWF0dXJlcy5cbiAgZ2V0RWRpdEhhbmRsZXMocGlja3M/OiBBcnJheTxPYmplY3Q+LCBncm91bmRDb29yZHM/OiBQb3NpdGlvbik6IGFueVtdIHtcbiAgICBjb25zdCB7IGVuYWJsZVNuYXBwaW5nIH0gPSB0aGlzLl9tb2RlQ29uZmlnIHx8IHt9O1xuICAgIGNvbnN0IGhhbmRsZXMgPSB0aGlzLl9oYW5kbGVyLmdldEVkaXRIYW5kbGVzKHBpY2tzLCBncm91bmRDb29yZHMpO1xuXG4gICAgaWYgKCFlbmFibGVTbmFwcGluZykgcmV0dXJuIGhhbmRsZXM7XG4gICAgY29uc3QgeyBwaWNrZWRIYW5kbGUgfSA9IHRoaXMuX2VkaXRIYW5kbGVQaWNrcyB8fCB7fTtcblxuICAgIGlmIChwaWNrZWRIYW5kbGUpIHtcbiAgICAgIGhhbmRsZXMucHVzaCguLi50aGlzLl9nZXROb25QaWNrZWRJbnRlcm1lZGlhdGVIYW5kbGVzKCksIHBpY2tlZEhhbmRsZSk7XG4gICAgICByZXR1cm4gaGFuZGxlcztcbiAgICB9XG5cbiAgICBjb25zdCB7IGZlYXR1cmVzIH0gPSB0aGlzLl9oYW5kbGVyLmZlYXR1cmVDb2xsZWN0aW9uLmdldE9iamVjdCgpO1xuICAgIGZvciAoY29uc3QgaW5kZXggb2YgdGhpcy5faGFuZGxlci5nZXRTZWxlY3RlZEZlYXR1cmVJbmRleGVzKCkpIHtcbiAgICAgIGlmIChpbmRleCA8IGZlYXR1cmVzLmxlbmd0aCkge1xuICAgICAgICBjb25zdCB7IGdlb21ldHJ5IH0gPSBmZWF0dXJlc1tpbmRleF07XG4gICAgICAgIGhhbmRsZXMucHVzaCguLi5nZXRFZGl0SGFuZGxlc0Zvckdlb21ldHJ5KGdlb21ldHJ5LCBpbmRleCwgJ3NuYXAnKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGhhbmRsZXMuZmlsdGVyKEJvb2xlYW4pO1xuICB9XG5cbiAgX2dldFNuYXBBd2FyZUV2ZW50KGV2ZW50OiBPYmplY3QpOiBPYmplY3Qge1xuICAgIGNvbnN0IHsgcG90ZW50aWFsU25hcEhhbmRsZSB9ID0gdGhpcy5fZWRpdEhhbmRsZVBpY2tzIHx8IHt9O1xuXG4gICAgcmV0dXJuIHBvdGVudGlhbFNuYXBIYW5kbGUgJiYgcG90ZW50aWFsU25hcEhhbmRsZS5wb3NpdGlvblxuICAgICAgPyB0aGlzLl9nZXRTbmFwcGVkTW91c2VFdmVudChldmVudCwgcG90ZW50aWFsU25hcEhhbmRsZS5wb3NpdGlvbilcbiAgICAgIDogZXZlbnQ7XG4gIH1cblxuICBoYW5kbGVTdGFydERyYWdnaW5nKGV2ZW50OiBTdGFydERyYWdnaW5nRXZlbnQpOiA/RWRpdEFjdGlvbiB7XG4gICAgdGhpcy5fc3RhcnREcmFnU25hcEhhbmRsZVBvc2l0aW9uID0gKGdldFBpY2tlZEVkaXRIYW5kbGUoZXZlbnQucGlja3MpIHx8IHt9KS5wb3NpdGlvbjtcbiAgICByZXR1cm4gdGhpcy5faGFuZGxlci5oYW5kbGVTdGFydERyYWdnaW5nKGV2ZW50KTtcbiAgfVxuXG4gIGhhbmRsZVN0b3BEcmFnZ2luZyhldmVudDogU3RvcERyYWdnaW5nRXZlbnQpOiA/RWRpdEFjdGlvbiB7XG4gICAgY29uc3QgbW9kZUFjdGlvblN1bW1hcnkgPSB0aGlzLl9oYW5kbGVyLmhhbmRsZVN0b3BEcmFnZ2luZyh0aGlzLl9nZXRTbmFwQXdhcmVFdmVudChldmVudCkpO1xuXG4gICAgdGhpcy5fZWRpdEhhbmRsZVBpY2tzID0gbnVsbDtcbiAgICByZXR1cm4gbW9kZUFjdGlvblN1bW1hcnk7XG4gIH1cblxuICBnZXRDdXJzb3IoZXZlbnQ6IHsgaXNEcmFnZ2luZzogYm9vbGVhbiB9KTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5faGFuZGxlci5nZXRDdXJzb3IoZXZlbnQpO1xuICB9XG5cbiAgaGFuZGxlUG9pbnRlck1vdmUoZXZlbnQ6IFBvaW50ZXJNb3ZlRXZlbnQpOiB7IGVkaXRBY3Rpb246ID9FZGl0QWN0aW9uLCBjYW5jZWxNYXBQYW46IGJvb2xlYW4gfSB7XG4gICAgY29uc3QgeyBlbmFibGVTbmFwcGluZyB9ID0gdGhpcy5faGFuZGxlci5nZXRNb2RlQ29uZmlnKCkgfHwge307XG5cbiAgICBpZiAoZW5hYmxlU25hcHBpbmcpIHtcbiAgICAgIHRoaXMuX2VkaXRIYW5kbGVQaWNrcyA9IHRoaXMuX2dldEVkaXRIYW5kbGVQaWNrcyhldmVudCk7XG4gICAgfVxuXG4gICAgY29uc3QgbW9kZUFjdGlvblN1bW1hcnkgPSB0aGlzLl9oYW5kbGVyLmhhbmRsZVBvaW50ZXJNb3ZlKHRoaXMuX2dldFNuYXBBd2FyZUV2ZW50KGV2ZW50KSk7XG4gICAgY29uc3QgeyBlZGl0QWN0aW9uIH0gPSBtb2RlQWN0aW9uU3VtbWFyeTtcbiAgICBpZiAoZWRpdEFjdGlvbikge1xuICAgICAgdGhpcy5fdXBkYXRlUGlja2VkSGFuZGxlUG9zaXRpb24oZWRpdEFjdGlvbik7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1vZGVBY3Rpb25TdW1tYXJ5O1xuICB9XG59XG4iXX0=