"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SnappableMode = void 0;

var _geojsonEditMode = require("./geojson-edit-mode.js");

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

var SnappableMode =
/*#__PURE__*/
function (_BaseGeoJsonEditMode) {
  _inherits(SnappableMode, _BaseGeoJsonEditMode);

  function SnappableMode(handler) {
    var _this;

    _classCallCheck(this, SnappableMode);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SnappableMode).call(this));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_handler", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_editHandlePicks", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_startDragSnapHandlePosition", void 0);

    _this._handler = handler;
    return _this;
  }

  _createClass(SnappableMode, [{
    key: "_getSnappedMouseEvent",
    value: function _getSnappedMouseEvent(event, snapPoint) {
      return Object.assign({}, event, {
        mapCoords: snapPoint,
        pointerDownMapCoords: this._startDragSnapHandlePosition
      });
    }
  }, {
    key: "_getEditHandlePicks",
    value: function _getEditHandlePicks(event) {
      var picks = event.picks;
      var potentialSnapHandle = (0, _geojsonEditMode.getPickedEditHandles)(picks).find(function (handle) {
        return handle.type === 'intermediate';
      });
      var handles = {
        potentialSnapHandle: potentialSnapHandle
      };
      var pickedHandle = (0, _geojsonEditMode.getPickedEditHandle)(event.pointerDownPicks);

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
        var editContext = editAction.editContext,
            updatedData = editAction.updatedData;
        var featureIndexes = editContext.featureIndexes;

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
    value: function _getSnapTargets(props) {
      var _ref2 = props.modeConfig || {},
          additionalSnapTargets = _ref2.additionalSnapTargets;

      additionalSnapTargets = additionalSnapTargets || [];

      var features = _toConsumableArray(props.data.features).concat(_toConsumableArray(additionalSnapTargets));

      return features;
    }
  }, {
    key: "_getNonPickedIntermediateHandles",
    value: function _getNonPickedIntermediateHandles(props) {
      var handles = [];

      var features = this._getSnapTargets(props);

      for (var i = 0; i < features.length; i++) {
        // Filter out the currently selected feature(s)
        var isCurrentIndexFeatureNotSelected = !props.selectedIndexes.includes(i);

        if (isCurrentIndexFeatureNotSelected) {
          var geometry = features[i].geometry;
          handles.push.apply(handles, _toConsumableArray((0, _geojsonEditMode.getEditHandlesForGeometry)(geometry, i, 'intermediate')));
        }
      }

      return handles;
    } // If no snap handle has been picked, only display the edit handles of the
    // selected feature. If a snap handle has been picked, display said snap handle
    // along with all snappable points on all non-selected features.

  }, {
    key: "getEditHandlesAdapter",
    value: function getEditHandlesAdapter(picks, mapCoords, props) {
      var _ref3 = props.modeConfig || {},
          enableSnapping = _ref3.enableSnapping;

      var handles = _toConsumableArray(this._handler.getEditHandlesAdapter(picks, mapCoords, props));

      if (!enableSnapping) return handles;

      var _ref4 = this._editHandlePicks || {},
          pickedHandle = _ref4.pickedHandle;

      if (pickedHandle) {
        handles.push.apply(handles, _toConsumableArray(this._getNonPickedIntermediateHandles(props)).concat([pickedHandle]));
        return handles;
      }

      var features = props.data.features;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = props.selectedIndexes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var index = _step.value;

          if (index < features.length) {
            var geometry = features[index].geometry;
            handles.push.apply(handles, _toConsumableArray((0, _geojsonEditMode.getEditHandlesForGeometry)(geometry, index, 'snap')));
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
    key: "handleStartDraggingAdapter",
    value: function handleStartDraggingAdapter(event, props) {
      this._startDragSnapHandlePosition = ((0, _geojsonEditMode.getPickedEditHandle)(event.picks) || {}).position;
      return this._handler.handleStartDraggingAdapter(event, props);
    }
  }, {
    key: "handleStopDraggingAdapter",
    value: function handleStopDraggingAdapter(event, props) {
      var modeActionSummary = this._handler.handleStopDraggingAdapter(this._getSnapAwareEvent(event), props);

      this._editHandlePicks = null;
      return modeActionSummary;
    }
  }, {
    key: "getCursorAdapter",
    value: function getCursorAdapter(props) {
      return this._handler.getCursorAdapter(props);
    }
  }, {
    key: "handlePointerMoveAdapter",
    value: function handlePointerMoveAdapter(event, props) {
      var _ref6 = props.modeConfig || {},
          enableSnapping = _ref6.enableSnapping;

      if (enableSnapping) {
        this._editHandlePicks = this._getEditHandlePicks(event);
      }

      var modeActionSummary = this._handler.handlePointerMoveAdapter(this._getSnapAwareEvent(event), props);

      var editAction = modeActionSummary.editAction;

      if (editAction) {
        this._updatePickedHandlePosition(editAction);
      }

      return modeActionSummary;
    }
  }]);

  return SnappableMode;
}(_geojsonEditMode.BaseGeoJsonEditMode);

exports.SnappableMode = SnappableMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvc25hcHBhYmxlLW1vZGUuanMiXSwibmFtZXMiOlsiU25hcHBhYmxlTW9kZSIsImhhbmRsZXIiLCJfaGFuZGxlciIsImV2ZW50Iiwic25hcFBvaW50IiwiT2JqZWN0IiwiYXNzaWduIiwibWFwQ29vcmRzIiwicG9pbnRlckRvd25NYXBDb29yZHMiLCJfc3RhcnREcmFnU25hcEhhbmRsZVBvc2l0aW9uIiwicGlja3MiLCJwb3RlbnRpYWxTbmFwSGFuZGxlIiwiZmluZCIsImhhbmRsZSIsInR5cGUiLCJoYW5kbGVzIiwicGlja2VkSGFuZGxlIiwicG9pbnRlckRvd25QaWNrcyIsImVkaXRBY3Rpb24iLCJfZWRpdEhhbmRsZVBpY2tzIiwiZWRpdENvbnRleHQiLCJ1cGRhdGVkRGF0YSIsImZlYXR1cmVJbmRleGVzIiwiaSIsImxlbmd0aCIsInNlbGVjdGVkSW5kZXgiLCJ1cGRhdGVkRmVhdHVyZSIsImZlYXR1cmVzIiwicG9zaXRpb25JbmRleGVzIiwiZmVhdHVyZUluZGV4IiwiY29vcmRpbmF0ZXMiLCJnZW9tZXRyeSIsInBvc2l0aW9uIiwicmVkdWNlIiwiYSIsImIiLCJwcm9wcyIsIm1vZGVDb25maWciLCJhZGRpdGlvbmFsU25hcFRhcmdldHMiLCJkYXRhIiwiX2dldFNuYXBUYXJnZXRzIiwiaXNDdXJyZW50SW5kZXhGZWF0dXJlTm90U2VsZWN0ZWQiLCJzZWxlY3RlZEluZGV4ZXMiLCJpbmNsdWRlcyIsInB1c2giLCJlbmFibGVTbmFwcGluZyIsImdldEVkaXRIYW5kbGVzQWRhcHRlciIsIl9nZXROb25QaWNrZWRJbnRlcm1lZGlhdGVIYW5kbGVzIiwiaW5kZXgiLCJmaWx0ZXIiLCJCb29sZWFuIiwiX2dldFNuYXBwZWRNb3VzZUV2ZW50IiwiaGFuZGxlU3RhcnREcmFnZ2luZ0FkYXB0ZXIiLCJtb2RlQWN0aW9uU3VtbWFyeSIsImhhbmRsZVN0b3BEcmFnZ2luZ0FkYXB0ZXIiLCJfZ2V0U25hcEF3YXJlRXZlbnQiLCJnZXRDdXJzb3JBZGFwdGVyIiwiX2dldEVkaXRIYW5kbGVQaWNrcyIsImhhbmRsZVBvaW50ZXJNb3ZlQWRhcHRlciIsIl91cGRhdGVQaWNrZWRIYW5kbGVQb3NpdGlvbiIsIkJhc2VHZW9Kc29uRWRpdE1vZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFVQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFTYUEsYTs7Ozs7QUFLWCx5QkFBWUMsT0FBWixFQUEwQztBQUFBOztBQUFBOztBQUN4Qzs7QUFEd0M7O0FBQUE7O0FBQUE7O0FBRXhDLFVBQUtDLFFBQUwsR0FBZ0JELE9BQWhCO0FBRndDO0FBR3pDOzs7OzBDQUVxQkUsSyxFQUFlQyxTLEVBQXVDO0FBQzFFLGFBQU9DLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLEVBQWQsRUFBa0JILEtBQWxCLEVBQXlCO0FBQzlCSSxRQUFBQSxTQUFTLEVBQUVILFNBRG1CO0FBRTlCSSxRQUFBQSxvQkFBb0IsRUFBRSxLQUFLQztBQUZHLE9BQXpCLENBQVA7QUFJRDs7O3dDQUVtQk4sSyxFQUFzQztBQUFBLFVBQ2hETyxLQURnRCxHQUN0Q1AsS0FEc0MsQ0FDaERPLEtBRGdEO0FBR3hELFVBQU1DLG1CQUFtQixHQUFHLDJDQUFxQkQsS0FBckIsRUFBNEJFLElBQTVCLENBQzFCLFVBQUFDLE1BQU07QUFBQSxlQUFJQSxNQUFNLENBQUNDLElBQVAsS0FBZ0IsY0FBcEI7QUFBQSxPQURvQixDQUE1QjtBQUdBLFVBQU1DLE9BQU8sR0FBRztBQUFFSixRQUFBQSxtQkFBbUIsRUFBbkJBO0FBQUYsT0FBaEI7QUFFQSxVQUFNSyxZQUFZLEdBQUcsMENBQW9CYixLQUFLLENBQUNjLGdCQUExQixDQUFyQjs7QUFDQSxVQUFJRCxZQUFKLEVBQWtCO0FBQ2hCLGlDQUFZRCxPQUFaO0FBQXFCQyxVQUFBQSxZQUFZLEVBQVpBO0FBQXJCO0FBQ0Q7O0FBRUQsYUFBT0QsT0FBUDtBQUNEOzs7Z0RBRTJCRyxVLEVBQStCO0FBQUEsaUJBQ2hDLEtBQUtDLGdCQUFMLElBQXlCLEVBRE87QUFB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Y3Rpb24sIFBvc2l0aW9uIH0gZnJvbSAnLi4vZ2VvanNvbi10eXBlcy5qcyc7XG5pbXBvcnQgdHlwZSB7XG4gIFBvaW50ZXJNb3ZlRXZlbnQsXG4gIFN0YXJ0RHJhZ2dpbmdFdmVudCxcbiAgU3RvcERyYWdnaW5nRXZlbnQsXG4gIE1vZGVQcm9wc1xufSBmcm9tICcuLi90eXBlcy5qcyc7XG5pbXBvcnQgdHlwZSB7IEVkaXRIYW5kbGUsIEdlb0pzb25FZGl0QWN0aW9uIH0gZnJvbSAnLi9nZW9qc29uLWVkaXQtbW9kZS5qcyc7XG5pbXBvcnQge1xuICBCYXNlR2VvSnNvbkVkaXRNb2RlLFxuICBnZXRQaWNrZWRFZGl0SGFuZGxlLFxuICBnZXRQaWNrZWRFZGl0SGFuZGxlcyxcbiAgZ2V0RWRpdEhhbmRsZXNGb3JHZW9tZXRyeVxufSBmcm9tICcuL2dlb2pzb24tZWRpdC1tb2RlLmpzJztcblxudHlwZSBIYW5kbGVQaWNrcyA9IHsgcGlja2VkSGFuZGxlPzogRWRpdEhhbmRsZSwgcG90ZW50aWFsU25hcEhhbmRsZT86IEVkaXRIYW5kbGUgfTtcblxuZXhwb3J0IGNsYXNzIFNuYXBwYWJsZU1vZGUgZXh0ZW5kcyBCYXNlR2VvSnNvbkVkaXRNb2RlIHtcbiAgX2hhbmRsZXI6IEJhc2VHZW9Kc29uRWRpdE1vZGU7XG4gIF9lZGl0SGFuZGxlUGlja3M6ID9IYW5kbGVQaWNrcztcbiAgX3N0YXJ0RHJhZ1NuYXBIYW5kbGVQb3NpdGlvbjogUG9zaXRpb247XG5cbiAgY29uc3RydWN0b3IoaGFuZGxlcjogQmFzZUdlb0pzb25FZGl0TW9kZSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5faGFuZGxlciA9IGhhbmRsZXI7XG4gIH1cblxuICBfZ2V0U25hcHBlZE1vdXNlRXZlbnQoZXZlbnQ6IE9iamVjdCwgc25hcFBvaW50OiBQb3NpdGlvbik6IFBvaW50ZXJNb3ZlRXZlbnQge1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBldmVudCwge1xuICAgICAgbWFwQ29vcmRzOiBzbmFwUG9pbnQsXG4gICAgICBwb2ludGVyRG93bk1hcENvb3JkczogdGhpcy5fc3RhcnREcmFnU25hcEhhbmRsZVBvc2l0aW9uXG4gICAgfSk7XG4gIH1cblxuICBfZ2V0RWRpdEhhbmRsZVBpY2tzKGV2ZW50OiBQb2ludGVyTW92ZUV2ZW50KTogSGFuZGxlUGlja3Mge1xuICAgIGNvbnN0IHsgcGlja3MgfSA9IGV2ZW50O1xuXG4gICAgY29uc3QgcG90ZW50aWFsU25hcEhhbmRsZSA9IGdldFBpY2tlZEVkaXRIYW5kbGVzKHBpY2tzKS5maW5kKFxuICAgICAgaGFuZGxlID0+IGhhbmRsZS50eXBlID09PSAnaW50ZXJtZWRpYXRlJ1xuICAgICk7XG4gICAgY29uc3QgaGFuZGxlcyA9IHsgcG90ZW50aWFsU25hcEhhbmRsZSB9O1xuXG4gICAgY29uc3QgcGlja2VkSGFuZGxlID0gZ2V0UGlja2VkRWRpdEhhbmRsZShldmVudC5wb2ludGVyRG93blBpY2tzKTtcbiAgICBpZiAocGlja2VkSGFuZGxlKSB7XG4gICAgICByZXR1cm4geyAuLi5oYW5kbGVzLCBwaWNrZWRIYW5kbGUgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gaGFuZGxlcztcbiAgfVxuXG4gIF91cGRhdGVQaWNrZWRIYW5kbGVQb3NpdGlvbihlZGl0QWN0aW9uOiBHZW9Kc29uRWRpdEFjdGlvbikge1xuICAgIGNvbnN0IHsgcGlja2VkSGFuZGxlIH0gPSB0aGlzLl9lZGl0SGFuZGxlUGlja3MgfHwge307XG5cbiAgICBpZiAocGlja2VkSGFuZGxlICYmIGVkaXRBY3Rpb24pIHtcbiAgICAgIGNvbnN0IHsgZWRpdENvbnRleHQsIHVwZGF0ZWREYXRhIH0gPSBlZGl0QWN0aW9uO1xuICAgICAgY29uc3QgeyBmZWF0dXJlSW5kZXhlcyB9ID0gZWRpdENvbnRleHQ7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmVhdHVyZUluZGV4ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3Qgc2VsZWN0ZWRJbmRleCA9IGZlYXR1cmVJbmRleGVzW2ldO1xuICAgICAgICBjb25zdCB1cGRhdGVkRmVhdHVyZSA9IHVwZGF0ZWREYXRhLmZlYXR1cmVzW3NlbGVjdGVkSW5kZXhdO1xuXG4gICAgICAgIGNvbnN0IHsgcG9zaXRpb25JbmRleGVzLCBmZWF0dXJlSW5kZXggfSA9IHBpY2tlZEhhbmRsZTtcbiAgICAgICAgaWYgKHNlbGVjdGVkSW5kZXggPj0gMCAmJiBmZWF0dXJlSW5kZXggPT09IHNlbGVjdGVkSW5kZXgpIHtcbiAgICAgICAgICBjb25zdCB7IGNvb3JkaW5hdGVzIH0gPSB1cGRhdGVkRmVhdHVyZS5nZW9tZXRyeTtcbiAgICAgICAgICAvLyAkRmxvd0ZpeE1lXG4gICAgICAgICAgcGlja2VkSGFuZGxlLnBvc2l0aW9uID0gcG9zaXRpb25JbmRleGVzLnJlZHVjZShcbiAgICAgICAgICAgIChhOiBhbnlbXSwgYjogbnVtYmVyKSA9PiBhW2JdLFxuICAgICAgICAgICAgY29vcmRpbmF0ZXNcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gSWYgYWRkaXRpb25hbFNuYXBUYXJnZXRzIGlzIHByZXNlbnQgaW4gbW9kZUNvbmZpZyBhbmQgaXMgcG9wdWxhdGVkLCB0aGlzXG4gIC8vIG1ldGhvZCB3aWxsIHJldHVybiB0aG9zZSBmZWF0dXJlcyBhbG9uZyB3aXRoIHRoZSBmZWF0dXJlc1xuICAvLyB0aGF0IGxpdmUgaW4gdGhlIGN1cnJlbnQgbGF5ZXIuIE90aGVyd2lzZSwgdGhpcyBtZXRob2Qgd2lsbCBzaW1wbHkgcmV0dXJuIHRoZVxuICAvLyBmZWF0dXJlcyBmcm9tIHRoZSBjdXJyZW50IGxheWVyXG4gIF9nZXRTbmFwVGFyZ2V0cyhwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPik6IEZlYXR1cmVbXSB7XG4gICAgbGV0IHsgYWRkaXRpb25hbFNuYXBUYXJnZXRzIH0gPSBwcm9wcy5tb2RlQ29uZmlnIHx8IHt9O1xuICAgIGFkZGl0aW9uYWxTbmFwVGFyZ2V0cyA9IGFkZGl0aW9uYWxTbmFwVGFyZ2V0cyB8fCBbXTtcblxuICAgIGNvbnN0IGZlYXR1cmVzID0gWy4uLnByb3BzLmRhdGEuZmVhdHVyZXMsIC4uLmFkZGl0aW9uYWxTbmFwVGFyZ2V0c107XG4gICAgcmV0dXJuIGZlYXR1cmVzO1xuICB9XG5cbiAgX2dldE5vblBpY2tlZEludGVybWVkaWF0ZUhhbmRsZXMocHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pOiBFZGl0SGFuZGxlW10ge1xuICAgIGNvbnN0IGhhbmRsZXMgPSBbXTtcbiAgICBjb25zdCBmZWF0dXJlcyA9IHRoaXMuX2dldFNuYXBUYXJnZXRzKHByb3BzKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmVhdHVyZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIC8vIEZpbHRlciBvdXQgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCBmZWF0dXJlKHMpXG4gICAgICBjb25zdCBpc0N1cnJlbnRJbmRleEZlYXR1cmVOb3RTZWxlY3RlZCA9ICFwcm9wcy5zZWxlY3RlZEluZGV4ZXMuaW5jbHVkZXMoaSk7XG5cbiAgICAgIGlmIChpc0N1cnJlbnRJbmRleEZlYXR1cmVOb3RTZWxlY3RlZCkge1xuICAgICAgICBjb25zdCB7IGdlb21ldHJ5IH0gPSBmZWF0dXJlc1tpXTtcbiAgICAgICAgaGFuZGxlcy5wdXNoKC4uLmdldEVkaXRIYW5kbGVzRm9yR2VvbWV0cnkoZ2VvbWV0cnksIGksICdpbnRlcm1lZGlhdGUnKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBoYW5kbGVzO1xuICB9XG5cbiAgLy8gSWYgbm8gc25hcCBoYW5kbGUgaGFzIGJlZW4gcGlja2VkLCBvbmx5IGRpc3BsYXkgdGhlIGVkaXQgaGFuZGxlcyBvZiB0aGVcbiAgLy8gc2VsZWN0ZWQgZmVhdHVyZS4gSWYgYSBzbmFwIGhhbmRsZSBoYXMgYmVlbiBwaWNrZWQsIGRpc3BsYXkgc2FpZCBzbmFwIGhhbmRsZVxuICAvLyBhbG9uZyB3aXRoIGFsbCBzbmFwcGFibGUgcG9pbnRzIG9uIGFsbCBub24tc2VsZWN0ZWQgZmVhdHVyZXMuXG4gIGdldEVkaXRIYW5kbGVzQWRhcHRlcihcbiAgICBwaWNrczogP0FycmF5PE9iamVjdD4sXG4gICAgbWFwQ29vcmRzOiA/UG9zaXRpb24sXG4gICAgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj5cbiAgKTogYW55W10ge1xuICAgIGNvbnN0IHsgZW5hYmxlU25hcHBpbmcgfSA9IHByb3BzLm1vZGVDb25maWcgfHwge307XG4gICAgY29uc3QgaGFuZGxlcyA9IFsuLi50aGlzLl9oYW5kbGVyLmdldEVkaXRIYW5kbGVzQWRhcHRlcihwaWNrcywgbWFwQ29vcmRzLCBwcm9wcyldO1xuXG4gICAgaWYgKCFlbmFibGVTbmFwcGluZykgcmV0dXJuIGhhbmRsZXM7XG4gICAgY29uc3QgeyBwaWNrZWRIYW5kbGUgfSA9IHRoaXMuX2VkaXRIYW5kbGVQaWNrcyB8fCB7fTtcblxuICAgIGlmIChwaWNrZWRIYW5kbGUpIHtcbiAgICAgIGhhbmRsZXMucHVzaCguLi50aGlzLl9nZXROb25QaWNrZWRJbnRlcm1lZGlhdGVIYW5kbGVzKHByb3BzKSwgcGlja2VkSGFuZGxlKTtcbiAgICAgIHJldHVybiBoYW5kbGVzO1xuICAgIH1cblxuICAgIGNvbnN0IHsgZmVhdHVyZXMgfSA9IHByb3BzLmRhdGE7XG4gICAgZm9yIChjb25zdCBpbmRleCBvZiBwcm9wcy5zZWxlY3RlZEluZGV4ZXMpIHtcbiAgICAgIGlmIChpbmRleCA8IGZlYXR1cmVzLmxlbmd0aCkge1xuICAgICAgICBjb25zdCB7IGdlb21ldHJ5IH0gPSBmZWF0dXJlc1tpbmRleF07XG4gICAgICAgIGhhbmRsZXMucHVzaCguLi5nZXRFZGl0SGFuZGxlc0Zvckdlb21ldHJ5KGdlb21ldHJ5LCBpbmRleCwgJ3NuYXAnKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGhhbmRsZXMuZmlsdGVyKEJvb2xlYW4pO1xuICB9XG5cbiAgX2dldFNuYXBBd2FyZUV2ZW50KGV2ZW50OiBPYmplY3QpOiBPYmplY3Qge1xuICAgIGNvbnN0IHsgcG90ZW50aWFsU25hcEhhbmRsZSB9ID0gdGhpcy5fZWRpdEhhbmRsZVBpY2tzIHx8IHt9O1xuXG4gICAgcmV0dXJuIHBvdGVudGlhbFNuYXBIYW5kbGUgJiYgcG90ZW50aWFsU25hcEhhbmRsZS5wb3NpdGlvblxuICAgICAgPyB0aGlzLl9nZXRTbmFwcGVkTW91c2VFdmVudChldmVudCwgcG90ZW50aWFsU25hcEhhbmRsZS5wb3NpdGlvbilcbiAgICAgIDogZXZlbnQ7XG4gIH1cblxuICBoYW5kbGVTdGFydERyYWdnaW5nQWRhcHRlcihcbiAgICBldmVudDogU3RhcnREcmFnZ2luZ0V2ZW50LFxuICAgIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+XG4gICk6ID9HZW9Kc29uRWRpdEFjdGlvbiB7XG4gICAgdGhpcy5fc3RhcnREcmFnU25hcEhhbmRsZVBvc2l0aW9uID0gKGdldFBpY2tlZEVkaXRIYW5kbGUoZXZlbnQucGlja3MpIHx8IHt9KS5wb3NpdGlvbjtcbiAgICByZXR1cm4gdGhpcy5faGFuZGxlci5oYW5kbGVTdGFydERyYWdnaW5nQWRhcHRlcihldmVudCwgcHJvcHMpO1xuICB9XG5cbiAgaGFuZGxlU3RvcERyYWdnaW5nQWRhcHRlcihcbiAgICBldmVudDogU3RvcERyYWdnaW5nRXZlbnQsXG4gICAgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj5cbiAgKTogP0dlb0pzb25FZGl0QWN0aW9uIHtcbiAgICBjb25zdCBtb2RlQWN0aW9uU3VtbWFyeSA9IHRoaXMuX2hhbmRsZXIuaGFuZGxlU3RvcERyYWdnaW5nQWRhcHRlcihcbiAgICAgIHRoaXMuX2dldFNuYXBBd2FyZUV2ZW50KGV2ZW50KSxcbiAgICAgIHByb3BzXG4gICAgKTtcblxuICAgIHRoaXMuX2VkaXRIYW5kbGVQaWNrcyA9IG51bGw7XG4gICAgcmV0dXJuIG1vZGVBY3Rpb25TdW1tYXJ5O1xuICB9XG5cbiAgZ2V0Q3Vyc29yQWRhcHRlcihwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPik6ID9zdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9oYW5kbGVyLmdldEN1cnNvckFkYXB0ZXIocHJvcHMpO1xuICB9XG5cbiAgaGFuZGxlUG9pbnRlck1vdmVBZGFwdGVyKFxuICAgIGV2ZW50OiBQb2ludGVyTW92ZUV2ZW50LFxuICAgIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+XG4gICk6IHsgZWRpdEFjdGlvbjogP0dlb0pzb25FZGl0QWN0aW9uLCBjYW5jZWxNYXBQYW46IGJvb2xlYW4gfSB7XG4gICAgY29uc3QgeyBlbmFibGVTbmFwcGluZyB9ID0gcHJvcHMubW9kZUNvbmZpZyB8fCB7fTtcblxuICAgIGlmIChlbmFibGVTbmFwcGluZykge1xuICAgICAgdGhpcy5fZWRpdEhhbmRsZVBpY2tzID0gdGhpcy5fZ2V0RWRpdEhhbmRsZVBpY2tzKGV2ZW50KTtcbiAgICB9XG5cbiAgICBjb25zdCBtb2RlQWN0aW9uU3VtbWFyeSA9IHRoaXMuX2hhbmRsZXIuaGFuZGxlUG9pbnRlck1vdmVBZGFwdGVyKFxuICAgICAgdGhpcy5fZ2V0U25hcEF3YXJlRXZlbnQoZXZlbnQpLFxuICAgICAgcHJvcHNcbiAgICApO1xuICAgIGNvbnN0IHsgZWRpdEFjdGlvbiB9ID0gbW9kZUFjdGlvblN1bW1hcnk7XG4gICAgaWYgKGVkaXRBY3Rpb24pIHtcbiAgICAgIHRoaXMuX3VwZGF0ZVBpY2tlZEhhbmRsZVBvc2l0aW9uKGVkaXRBY3Rpb24pO1xuICAgIH1cblxuICAgIHJldHVybiBtb2RlQWN0aW9uU3VtbWFyeTtcbiAgfVxufVxuIl19