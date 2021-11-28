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

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_isSnapped", void 0);

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
            var coordinates = updatedFeature.geometry.coordinates; // $FlowFixMe

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
    key: "_performSnapIfRequired",
    value: function _performSnapIfRequired() {
      if (this._isSnapped) return;

      var _ref5 = this._editHandlePicks || {},
          pickedHandle = _ref5.pickedHandle,
          potentialSnapHandle = _ref5.potentialSnapHandle;

      if (pickedHandle && potentialSnapHandle) {
        this._isSnapped = true;
      }
    } // Unsnapping only occurs after the user snaps two polygons but continues to drag the
    // cursor past the point of resistance.

  }, {
    key: "_performUnsnapIfRequired",
    value: function _performUnsnapIfRequired() {
      if (!this._isSnapped) return;

      var _ref6 = this._editHandlePicks || {},
          potentialSnapHandle = _ref6.potentialSnapHandle;

      if (!potentialSnapHandle) {
        this._isSnapped = false;
      }
    }
  }, {
    key: "_getSnapAwareEvent",
    value: function _getSnapAwareEvent(event) {
      var _ref7 = this._editHandlePicks || {},
          potentialSnapHandle = _ref7.potentialSnapHandle;

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
      this._isSnapped = false;
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
      var _ref8 = this._handler.getModeConfig() || {},
          enableSnapping = _ref8.enableSnapping;

      if (enableSnapping) {
        this._editHandlePicks = this._getEditHandlePicks(event);

        if (this._editHandlePicks) {
          this._performSnapIfRequired();

          this._performUnsnapIfRequired();
        }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL3NuYXBwYWJsZS1oYW5kbGVyLmpzIl0sIm5hbWVzIjpbIlNuYXBwYWJsZUhhbmRsZXIiLCJoYW5kbGVyIiwiX2hhbmRsZXIiLCJmZWF0dXJlQ29sbGVjdGlvbiIsInNldEZlYXR1cmVDb2xsZWN0aW9uIiwibW9kZUNvbmZpZyIsIl9tb2RlQ29uZmlnIiwic2V0TW9kZUNvbmZpZyIsImluZGV4ZXMiLCJzZXRTZWxlY3RlZEZlYXR1cmVJbmRleGVzIiwiZXZlbnQiLCJzbmFwUG9pbnQiLCJPYmplY3QiLCJhc3NpZ24iLCJncm91bmRDb29yZHMiLCJwb2ludGVyRG93bkdyb3VuZENvb3JkcyIsIl9zdGFydERyYWdTbmFwSGFuZGxlUG9zaXRpb24iLCJwaWNrcyIsInBvdGVudGlhbFNuYXBIYW5kbGUiLCJmaW5kIiwicGljayIsIm9iamVjdCIsInR5cGUiLCJoYW5kbGVzIiwicGlja2VkSGFuZGxlIiwicG9pbnRlckRvd25QaWNrcyIsImVkaXRBY3Rpb24iLCJfZWRpdEhhbmRsZVBpY2tzIiwiZmVhdHVyZUluZGV4ZXMiLCJ1cGRhdGVkRGF0YSIsImkiLCJsZW5ndGgiLCJzZWxlY3RlZEluZGV4IiwidXBkYXRlZEZlYXR1cmUiLCJmZWF0dXJlcyIsInBvc2l0aW9uSW5kZXhlcyIsImZlYXR1cmVJbmRleCIsImNvb3JkaW5hdGVzIiwiZ2VvbWV0cnkiLCJwb3NpdGlvbiIsInJlZHVjZSIsImEiLCJiIiwiZ2V0TW9kZUNvbmZpZyIsImFkZGl0aW9uYWxTbmFwVGFyZ2V0cyIsImdldE9iamVjdCIsIl9nZXRTbmFwVGFyZ2V0cyIsImlzQ3VycmVudEluZGV4RmVhdHVyZU5vdFNlbGVjdGVkIiwiZ2V0U2VsZWN0ZWRGZWF0dXJlSW5kZXhlcyIsImluY2x1ZGVzIiwicHVzaCIsImVuYWJsZVNuYXBwaW5nIiwiZ2V0RWRpdEhhbmRsZXMiLCJfZ2V0Tm9uUGlja2VkSW50ZXJtZWRpYXRlSGFuZGxlcyIsImluZGV4IiwiZmlsdGVyIiwiQm9vbGVhbiIsIl9pc1NuYXBwZWQiLCJfZ2V0U25hcHBlZE1vdXNlRXZlbnQiLCJoYW5kbGVTdGFydERyYWdnaW5nIiwibW9kZUFjdGlvblN1bW1hcnkiLCJoYW5kbGVTdG9wRHJhZ2dpbmciLCJfZ2V0U25hcEF3YXJlRXZlbnQiLCJnZXRDdXJzb3IiLCJfZ2V0RWRpdEhhbmRsZVBpY2tzIiwiX3BlcmZvcm1TbmFwSWZSZXF1aXJlZCIsIl9wZXJmb3JtVW5zbmFwSWZSZXF1aXJlZCIsImhhbmRsZVBvaW50ZXJNb3ZlIiwiX3VwZGF0ZVBpY2tlZEhhbmRsZVBvc2l0aW9uIiwiTW9kZUhhbmRsZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFLQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFJYUEsZ0I7Ozs7O0FBTVgsNEJBQVlDLE9BQVosRUFBa0M7QUFBQTs7QUFBQTs7QUFDaEM7O0FBRGdDOztBQUFBOztBQUFBOztBQUFBOztBQUVoQyxVQUFLQyxRQUFMLEdBQWdCRCxPQUFoQjtBQUZnQztBQUdqQzs7Ozt5Q0FFb0JFLGlCLEVBQTRDO0FBQy9ELFdBQUtELFFBQUwsQ0FBY0Usb0JBQWQsQ0FBbUNELGlCQUFuQztBQUNEOzs7a0NBRWFFLFUsRUFBdUI7QUFDbkMsV0FBS0MsV0FBTCxHQUFtQkQsVUFBbkI7O0FBQ0EsV0FBS0gsUUFBTCxDQUFjSyxhQUFkLENBQTRCRixVQUE1QjtBQUNEOzs7OENBRXlCRyxPLEVBQXlCO0FBQ2pELFdBQUtOLFFBQUwsQ0FBY08seUJBQWQsQ0FBd0NELE9BQXhDO0FBQ0Q7OzswQ0FFcUJFLEssRUFBZUMsUyxFQUF1QztBQUMxRSxhQUFPQyxNQUFNLENBQUNDLE1BQVAsQ0FBYyxFQUFkLEVBQWtCSCxLQUFsQixFQUF5QjtBQUM5QkksUUFBQUEsWUFBWSxFQUFFSCxTQURnQjtBQUU5QkksUUFBQUEsdUJBQXVCLEVBQUUsS0FBS0M7QUFGQSxPQUF6QixDQUFQO0FBSUQ7Ozt3Q0FFbUJOLEssRUFBc0M7QUFBQSxVQUNoRE8sS0FEZ0QsR0FDdENQLEtBRHND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UG9zaXRpb24gfSBmcm9tICdAbmVidWxhLmdsL2VkaXQtbW9kZXMnO1xuaW1wb3J0IHR5cGUgeyBQb2ludGVyTW92ZUV2ZW50LCBTdGFydERyYWdnaW5nRXZlbnQsIFN0b3BEcmFnZ2luZ0V2ZW50IH0gZnJvbSAnLi4vZXZlbnQtdHlwZXMuanMnO1xuaW1wb3J0IHR5cGUgeyBFZGl0SGFuZGxlLCBFZGl0QWN0aW9uIH0gZnJvbSAnLi9tb2RlLWhhbmRsZXIuanMnO1xuaW1wb3J0IHsgTW9kZUhhbmRsZXIsIGdldFBpY2tlZEVkaXRIYW5kbGUsIGdldEVkaXRIYW5kbGVzRm9yR2VvbWV0cnkgfSBmcm9tICcuL21vZGUtaGFuZGxlci5qcyc7XG5cbnR5cGUgSGFuZGxlUGlja3MgPSB7IHBpY2tlZEhhbmRsZT86IEVkaXRIYW5kbGUsIHBvdGVudGlhbFNuYXBIYW5kbGU/OiBFZGl0SGFuZGxlIH07XG5cbmV4cG9ydCBjbGFzcyBTbmFwcGFibGVIYW5kbGVyIGV4dGVuZHMgTW9kZUhhbmRsZXIge1xuICBfaGFuZGxlcjogTW9kZUhhbmRsZXI7XG4gIF9lZGl0SGFuZGxlUGlja3M6ID9IYW5kbGVQaWNrcztcbiAgX3N0YXJ0RHJhZ1NuYXBIYW5kbGVQb3NpdGlvbjogUG9zaXRpb247XG4gIF9pc1NuYXBwZWQ6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IoaGFuZGxlcjogTW9kZUhhbmRsZXIpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX2hhbmRsZXIgPSBoYW5kbGVyO1xuICB9XG5cbiAgc2V0RmVhdHVyZUNvbGxlY3Rpb24oZmVhdHVyZUNvbGxlY3Rpb246IEZlYXR1cmVDb2xsZWN0aW9uKTogdm9pZCB7XG4gICAgdGhpcy5faGFuZGxlci5zZXRGZWF0dXJlQ29sbGVjdGlvbihmZWF0dXJlQ29sbGVjdGlvbik7XG4gIH1cblxuICBzZXRNb2RlQ29uZmlnKG1vZGVDb25maWc6IGFueSk6IHZvaWQge1xuICAgIHRoaXMuX21vZGVDb25maWcgPSBtb2RlQ29uZmlnO1xuICAgIHRoaXMuX2hhbmRsZXIuc2V0TW9kZUNvbmZpZyhtb2RlQ29uZmlnKTtcbiAgfVxuXG4gIHNldFNlbGVjdGVkRmVhdHVyZUluZGV4ZXMoaW5kZXhlczogbnVtYmVyW10pOiB2b2lkIHtcbiAgICB0aGlzLl9oYW5kbGVyLnNldFNlbGVjdGVkRmVhdHVyZUluZGV4ZXMoaW5kZXhlcyk7XG4gIH1cblxuICBfZ2V0U25hcHBlZE1vdXNlRXZlbnQoZXZlbnQ6IE9iamVjdCwgc25hcFBvaW50OiBQb3NpdGlvbik6IFBvaW50ZXJNb3ZlRXZlbnQge1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBldmVudCwge1xuICAgICAgZ3JvdW5kQ29vcmRzOiBzbmFwUG9pbnQsXG4gICAgICBwb2ludGVyRG93bkdyb3VuZENvb3JkczogdGhpcy5fc3RhcnREcmFnU25hcEhhbmRsZVBvc2l0aW9uXG4gICAgfSk7XG4gIH1cblxuICBfZ2V0RWRpdEhhbmRsZVBpY2tzKGV2ZW50OiBQb2ludGVyTW92ZUV2ZW50KTogSGFuZGxlUGlja3Mge1xuICAgIGNvbnN0IHsgcGlja3MgfSA9IGV2ZW50O1xuXG4gICAgY29uc3QgcG90ZW50aWFsU25hcEhhbmRsZSA9IHBpY2tzLmZpbmQoXG4gICAgICBwaWNrID0+IHBpY2sub2JqZWN0ICYmIHBpY2sub2JqZWN0LnR5cGUgPT09ICdpbnRlcm1lZGlhdGUnXG4gICAgKTtcbiAgICBjb25zdCBoYW5kbGVzID0geyBwb3RlbnRpYWxTbmFwSGFuZGxlOiBwb3RlbnRpYWxTbmFwSGFuZGxlICYmIHBvdGVudGlhbFNuYXBIYW5kbGUub2JqZWN0IH07XG5cbiAgICBjb25zdCBwaWNrZWRIYW5kbGUgPSBnZXRQaWNrZWRFZGl0SGFuZGxlKGV2ZW50LnBvaW50ZXJEb3duUGlja3MpO1xuICAgIGlmIChwaWNrZWRIYW5kbGUpIHtcbiAgICAgIHJldHVybiB7IC4uLmhhbmRsZXMsIHBpY2tlZEhhbmRsZSB9O1xuICAgIH1cblxuICAgIHJldHVybiBoYW5kbGVzO1xuICB9XG5cbiAgX3VwZGF0ZVBpY2tlZEhhbmRsZVBvc2l0aW9uKGVkaXRBY3Rpb246IEVkaXRBY3Rpb24pIHtcbiAgICBjb25zdCB7IHBpY2tlZEhhbmRsZSB9ID0gdGhpcy5fZWRpdEhhbmRsZVBpY2tzIHx8IHt9O1xuXG4gICAgaWYgKHBpY2tlZEhhbmRsZSAmJiBlZGl0QWN0aW9uKSB7XG4gICAgICBjb25zdCB7IGZlYXR1cmVJbmRleGVzLCB1cGRhdGVkRGF0YSB9ID0gZWRpdEFjdGlvbjtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmZWF0dXJlSW5kZXhlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBzZWxlY3RlZEluZGV4ID0gZmVhdHVyZUluZGV4ZXNbaV07XG4gICAgICAgIGNvbnN0IHVwZGF0ZWRGZWF0dXJlID0gdXBkYXRlZERhdGEuZmVhdHVyZXNbc2VsZWN0ZWRJbmRleF07XG5cbiAgICAgICAgY29uc3QgeyBwb3NpdGlvbkluZGV4ZXMsIGZlYXR1cmVJbmRleCB9ID0gcGlja2VkSGFuZGxlO1xuICAgICAgICBpZiAoc2VsZWN0ZWRJbmRleCA+PSAwICYmIGZlYXR1cmVJbmRleCA9PT0gc2VsZWN0ZWRJbmRleCkge1xuICAgICAgICAgIGNvbnN0IHsgY29vcmRpbmF0ZXMgfSA9IHVwZGF0ZWRGZWF0dXJlLmdlb21ldHJ5O1xuICAgICAgICAgIC8vICRGbG93Rml4TWVcbiAgICAgICAgICBwaWNrZWRIYW5kbGUucG9zaXRpb24gPSBwb3NpdGlvbkluZGV4ZXMucmVkdWNlKFxuICAgICAgICAgICAgKGE6IGFueVtdLCBiOiBudW1iZXIpID0+IGFbYl0sXG4gICAgICAgICAgICBjb29yZGluYXRlc1xuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBJZiBhZGRpdGlvbmFsU25hcFRhcmdldHMgaXMgcHJlc2VudCBpbiBtb2RlQ29uZmlnIGFuZCBpcyBwb3B1bGF0ZWQsIHRoaXNcbiAgLy8gbWV0aG9kIHdpbGwgcmV0dXJuIHRob3NlIGZlYXR1cmVzIGFsb25nIHdpdGggdGhlIGZlYXR1cmVzXG4gIC8vIHRoYXQgbGl2ZSBpbiB0aGUgY3VycmVudCBsYXllci4gT3RoZXJ3aXNlLCB0aGlzIG1ldGhvZCB3aWxsIHNpbXBseSByZXR1cm4gdGhlXG4gIC8vIGZlYXR1cmVzIGZyb20gdGhlIGN1cnJlbnQgbGF5ZXJcbiAgX2dldFNuYXBUYXJnZXRzKCk6IEZlYXR1cmVbXSB7XG4gICAgbGV0IHsgYWRkaXRpb25hbFNuYXBUYXJnZXRzIH0gPSB0aGlzLmdldE1vZGVDb25maWcoKSB8fCB7fTtcbiAgICBhZGRpdGlvbmFsU25hcFRhcmdldHMgPSBhZGRpdGlvbmFsU25hcFRhcmdldHMgfHwgW107XG5cbiAgICBjb25zdCBmZWF0dXJlcyA9IFtcbiAgICAgIC4uLnRoaXMuX2hhbmRsZXIuZmVhdHVyZUNvbGxlY3Rpb24uZ2V0T2JqZWN0KCkuZmVhdHVyZXMsXG4gICAgICAuLi5hZGRpdGlvbmFsU25hcFRhcmdldHNcbiAgICBdO1xuICAgIHJldHVybiBmZWF0dXJlcztcbiAgfVxuXG4gIF9nZXROb25QaWNrZWRJbnRlcm1lZGlhdGVIYW5kbGVzKCk6IEVkaXRIYW5kbGVbXSB7XG4gICAgY29uc3QgaGFuZGxlcyA9IFtdO1xuICAgIGNvbnN0IGZlYXR1cmVzID0gdGhpcy5fZ2V0U25hcFRhcmdldHMoKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmVhdHVyZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIC8vIEZpbHRlciBvdXQgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCBmZWF0dXJlKHMpXG4gICAgICBjb25zdCBpc0N1cnJlbnRJbmRleEZlYXR1cmVOb3RTZWxlY3RlZCA9XG4gICAgICAgIGkgPCBmZWF0dXJlcy5sZW5ndGggJiYgIXRoaXMuX2hhbmRsZXIuZ2V0U2VsZWN0ZWRGZWF0dXJlSW5kZXhlcygpLmluY2x1ZGVzKGkpO1xuXG4gICAgICBpZiAoaXNDdXJyZW50SW5kZXhGZWF0dXJlTm90U2VsZWN0ZWQpIHtcbiAgICAgICAgY29uc3QgeyBnZW9tZXRyeSB9ID0gZmVhdHVyZXNbaV07XG4gICAgICAgIGhhbmRsZXMucHVzaCguLi5nZXRFZGl0SGFuZGxlc0Zvckdlb21ldHJ5KGdlb21ldHJ5LCBpLCAnaW50ZXJtZWRpYXRlJykpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaGFuZGxlcztcbiAgfVxuXG4gIC8vIElmIG5vIHNuYXAgaGFuZGxlIGhhcyBiZWVuIHBpY2tlZCwgb25seSBkaXNwbGF5IHRoZSBlZGl0IGhhbmRsZXMgb2YgdGhlXG4gIC8vIHNlbGVjdGVkIGZlYXR1cmUuIElmIGEgc25hcCBoYW5kbGUgaGFzIGJlZW4gcGlja2VkLCBkaXNwbGF5IHNhaWQgc25hcCBoYW5kbGVcbiAgLy8gYWxvbmcgd2l0aCBhbGwgc25hcHBhYmxlIHBvaW50cyBvbiBhbGwgbm9uLXNlbGVjdGVkIGZlYXR1cmVzLlxuICBnZXRFZGl0SGFuZGxlcyhwaWNrcz86IEFycmF5PE9iamVjdD4sIGdyb3VuZENvb3Jkcz86IFBvc2l0aW9uKTogYW55W10ge1xuICAgIGNvbnN0IHsgZW5hYmxlU25hcHBpbmcgfSA9IHRoaXMuX21vZGVDb25maWcgfHwge307XG4gICAgY29uc3QgaGFuZGxlcyA9IHRoaXMuX2hhbmRsZXIuZ2V0RWRpdEhhbmRsZXMocGlja3MsIGdyb3VuZENvb3Jkcyk7XG5cbiAgICBpZiAoIWVuYWJsZVNuYXBwaW5nKSByZXR1cm4gaGFuZGxlcztcbiAgICBjb25zdCB7IHBpY2tlZEhhbmRsZSB9ID0gdGhpcy5fZWRpdEhhbmRsZVBpY2tzIHx8IHt9O1xuXG4gICAgaWYgKHBpY2tlZEhhbmRsZSkge1xuICAgICAgaGFuZGxlcy5wdXNoKC4uLnRoaXMuX2dldE5vblBpY2tlZEludGVybWVkaWF0ZUhhbmRsZXMoKSwgcGlja2VkSGFuZGxlKTtcbiAgICAgIHJldHVybiBoYW5kbGVzO1xuICAgIH1cblxuICAgIGNvbnN0IHsgZmVhdHVyZXMgfSA9IHRoaXMuX2hhbmRsZXIuZmVhdHVyZUNvbGxlY3Rpb24uZ2V0T2JqZWN0KCk7XG4gICAgZm9yIChjb25zdCBpbmRleCBvZiB0aGlzLl9oYW5kbGVyLmdldFNlbGVjdGVkRmVhdHVyZUluZGV4ZXMoKSkge1xuICAgICAgaWYgKGluZGV4IDwgZmVhdHVyZXMubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IHsgZ2VvbWV0cnkgfSA9IGZlYXR1cmVzW2luZGV4XTtcbiAgICAgICAgaGFuZGxlcy5wdXNoKC4uLmdldEVkaXRIYW5kbGVzRm9yR2VvbWV0cnkoZ2VvbWV0cnksIGluZGV4LCAnc25hcCcpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gaGFuZGxlcy5maWx0ZXIoQm9vbGVhbik7XG4gIH1cblxuICBfcGVyZm9ybVNuYXBJZlJlcXVpcmVkKCkge1xuICAgIGlmICh0aGlzLl9pc1NuYXBwZWQpIHJldHVybjtcbiAgICBjb25zdCB7IHBpY2tlZEhhbmRsZSwgcG90ZW50aWFsU25hcEhhbmRsZSB9ID0gdGhpcy5fZWRpdEhhbmRsZVBpY2tzIHx8IHt9O1xuICAgIGlmIChwaWNrZWRIYW5kbGUgJiYgcG90ZW50aWFsU25hcEhhbmRsZSkge1xuICAgICAgdGhpcy5faXNTbmFwcGVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICAvLyBVbnNuYXBwaW5nIG9ubHkgb2NjdXJzIGFmdGVyIHRoZSB1c2VyIHNuYXBzIHR3byBwb2x5Z29ucyBidXQgY29udGludWVzIHRvIGRyYWcgdGhlXG4gIC8vIGN1cnNvciBwYXN0IHRoZSBwb2ludCBvZiByZXNpc3RhbmNlLlxuICBfcGVyZm9ybVVuc25hcElmUmVxdWlyZWQoKSB7XG4gICAgaWYgKCF0aGlzLl9pc1NuYXBwZWQpIHJldHVybjtcblxuICAgIGNvbnN0IHsgcG90ZW50aWFsU25hcEhhbmRsZSB9ID0gdGhpcy5fZWRpdEhhbmRsZVBpY2tzIHx8IHt9O1xuICAgIGlmICghcG90ZW50aWFsU25hcEhhbmRsZSkge1xuICAgICAgdGhpcy5faXNTbmFwcGVkID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgX2dldFNuYXBBd2FyZUV2ZW50KGV2ZW50OiBPYmplY3QpOiBPYmplY3Qge1xuICAgIGNvbnN0IHsgcG90ZW50aWFsU25hcEhhbmRsZSB9ID0gdGhpcy5fZWRpdEhhbmRsZVBpY2tzIHx8IHt9O1xuXG4gICAgcmV0dXJuIHBvdGVudGlhbFNuYXBIYW5kbGUgJiYgcG90ZW50aWFsU25hcEhhbmRsZS5wb3NpdGlvblxuICAgICAgPyB0aGlzLl9nZXRTbmFwcGVkTW91c2VFdmVudChldmVudCwgcG90ZW50aWFsU25hcEhhbmRsZS5wb3NpdGlvbilcbiAgICAgIDogZXZlbnQ7XG4gIH1cblxuICBoYW5kbGVTdGFydERyYWdnaW5nKGV2ZW50OiBTdGFydERyYWdnaW5nRXZlbnQpOiA/RWRpdEFjdGlvbiB7XG4gICAgdGhpcy5fc3RhcnREcmFnU25hcEhhbmRsZVBvc2l0aW9uID0gKGdldFBpY2tlZEVkaXRIYW5kbGUoZXZlbnQucGlja3MpIHx8IHt9KS5wb3NpdGlvbjtcbiAgICByZXR1cm4gdGhpcy5faGFuZGxlci5oYW5kbGVTdGFydERyYWdnaW5nKGV2ZW50KTtcbiAgfVxuXG4gIGhhbmRsZVN0b3BEcmFnZ2luZyhldmVudDogU3RvcERyYWdnaW5nRXZlbnQpOiA/RWRpdEFjdGlvbiB7XG4gICAgY29uc3QgbW9kZUFjdGlvblN1bW1hcnkgPSB0aGlzLl9oYW5kbGVyLmhhbmRsZVN0b3BEcmFnZ2luZyh0aGlzLl9nZXRTbmFwQXdhcmVFdmVudChldmVudCkpO1xuXG4gICAgdGhpcy5fZWRpdEhhbmRsZVBpY2tzID0gbnVsbDtcbiAgICB0aGlzLl9pc1NuYXBwZWQgPSBmYWxzZTtcbiAgICByZXR1cm4gbW9kZUFjdGlvblN1bW1hcnk7XG4gIH1cblxuICBnZXRDdXJzb3IoZXZlbnQ6IHsgaXNEcmFnZ2luZzogYm9vbGVhbiB9KTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5faGFuZGxlci5nZXRDdXJzb3IoZXZlbnQpO1xuICB9XG5cbiAgaGFuZGxlUG9pbnRlck1vdmUoZXZlbnQ6IFBvaW50ZXJNb3ZlRXZlbnQpOiB7IGVkaXRBY3Rpb246ID9FZGl0QWN0aW9uLCBjYW5jZWxNYXBQYW46IGJvb2xlYW4gfSB7XG4gICAgY29uc3QgeyBlbmFibGVTbmFwcGluZyB9ID0gdGhpcy5faGFuZGxlci5nZXRNb2RlQ29uZmlnKCkgfHwge307XG5cbiAgICBpZiAoZW5hYmxlU25hcHBpbmcpIHtcbiAgICAgIHRoaXMuX2VkaXRIYW5kbGVQaWNrcyA9IHRoaXMuX2dldEVkaXRIYW5kbGVQaWNrcyhldmVudCk7XG4gICAgICBpZiAodGhpcy5fZWRpdEhhbmRsZVBpY2tzKSB7XG4gICAgICAgIHRoaXMuX3BlcmZvcm1TbmFwSWZSZXF1aXJlZCgpO1xuICAgICAgICB0aGlzLl9wZXJmb3JtVW5zbmFwSWZSZXF1aXJlZCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IG1vZGVBY3Rpb25TdW1tYXJ5ID0gdGhpcy5faGFuZGxlci5oYW5kbGVQb2ludGVyTW92ZSh0aGlzLl9nZXRTbmFwQXdhcmVFdmVudChldmVudCkpO1xuICAgIGNvbnN0IHsgZWRpdEFjdGlvbiB9ID0gbW9kZUFjdGlvblN1bW1hcnk7XG4gICAgaWYgKGVkaXRBY3Rpb24pIHtcbiAgICAgIHRoaXMuX3VwZGF0ZVBpY2tlZEhhbmRsZVBvc2l0aW9uKGVkaXRBY3Rpb24pO1xuICAgIH1cblxuICAgIHJldHVybiBtb2RlQWN0aW9uU3VtbWFyeTtcbiAgfVxufVxuIl19