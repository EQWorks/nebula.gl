"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPickedEditHandle = getPickedEditHandle;
exports.getNonGuidePicks = getNonGuidePicks;
exports.getPickedEditHandles = getPickedEditHandles;
exports.getPickedExistingEditHandle = getPickedExistingEditHandle;
exports.getPickedIntermediateEditHandle = getPickedIntermediateEditHandle;
exports.getIntermediatePosition = getIntermediatePosition;
exports.getEditHandlesForGeometry = getEditHandlesForGeometry;
exports.BaseGeoJsonEditMode = void 0;

var _union = _interopRequireDefault(require("@turf/union"));

var _difference = _interopRequireDefault(require("@turf/difference"));

var _intersect = _interopRequireDefault(require("@turf/intersect"));

var _editMode = require("./edit-mode.js");

var _immutableFeatureCollection = require("./immutable-feature-collection.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DEFAULT_EDIT_HANDLES = []; // Main interface for `EditMode`s that edit GeoJSON

var BaseGeoJsonEditMode =
/*#__PURE__*/
function () {
  function BaseGeoJsonEditMode() {
    _classCallCheck(this, BaseGeoJsonEditMode);

    _defineProperty(this, "_clickSequence", []);

    _defineProperty(this, "_tentativeFeature", void 0);
  }

  _createClass(BaseGeoJsonEditMode, [{
    key: "getGuides",
    value: function getGuides(props) {
      var lastPointerMoveEvent = props.lastPointerMoveEvent;
      var picks = lastPointerMoveEvent && lastPointerMoveEvent.picks;
      var mapCoords = lastPointerMoveEvent && lastPointerMoveEvent.mapCoords;
      var editHandles = this.getEditHandlesAdapter(picks, mapCoords, props);
      var tentativeFeature = this.getTentativeFeature();
      var tentativeFeatures = tentativeFeature ? [tentativeFeature] : [];
      var editHandleFeatures = editHandles.map(function (handle) {
        return {
          type: 'Feature',
          properties: {
            guideType: 'editHandle',
            editHandleType: handle.type,
            featureIndex: handle.featureIndex,
            positionIndexes: handle.positionIndexes
          },
          geometry: {
            type: 'Point',
            coordinates: handle.position
          }
        };
      });
      return {
        type: 'FeatureCollection',
        features: tentativeFeatures.concat(_toConsumableArray(editHandleFeatures))
      };
    }
  }, {
    key: "getSelectedFeature",
    value: function getSelectedFeature(props) {
      if (props.selectedIndexes.length === 1) {
        return props.data.features[props.selectedIndexes[0]];
      }

      return null;
    }
  }, {
    key: "getSelectedGeometry",
    value: function getSelectedGeometry(props) {
      var feature = this.getSelectedFeature(props);

      if (feature) {
        return feature.geometry;
      }

      return null;
    }
  }, {
    key: "getSelectedFeaturesAsFeatureCollection",
    value: function getSelectedFeaturesAsFeatureCollection(props) {
      var features = props.data.features;
      var selectedFeatures = props.selectedIndexes.map(function (selectedIndex) {
        return features[selectedIndex];
      });
      return {
        type: 'FeatureCollection',
        features: selectedFeatures
      };
    }
  }, {
    key: "getClickSequence",
    value: function getClickSequence() {
      return this._clickSequence;
    }
  }, {
    key: "resetClickSequence",
    value: function resetClickSequence() {
      this._clickSequence = [];
    }
  }, {
    key: "getTentativeFeature",
    value: function getTentativeFeature() {
      return this._tentativeFeature;
    } // TODO edit-modes: delete me once mode handlers do getEditHandles lazily

  }, {
    key: "_setTentativeFeature",
    value: function _setTentativeFeature(tentativeFeature) {
      if (tentativeFeature) {
        tentativeFeature.properties = _objectSpread({}, tentativeFeature.properties || {}, {
          guideType: 'tentative'
        });
      }

      this._tentativeFeature = tentativeFeature;
    }
  }, {
    key: "_refreshCursor",
    value: function _refreshCursor(props) {
      var currentCursor = props.cursor;
      var updatedCursor = this.getCursorAdapter(props);

      if (currentCursor !== updatedCursor) {
        props.onUpdateCursor(updatedCursor);
      }
    }
    /**
     * Returns a flat array of positions for the given feature along with their indexes into the feature's geometry's coordinates.
     *
     * @param featureIndex The index of the feature to get edit handles
     */

  }, {
    key: "getEditHandlesAdapter",
    value: function getEditHandlesAdapter(picks, mapCoords, props) {
      return DEFAULT_EDIT_HANDLES;
    }
  }, {
    key: "getCursorAdapter",
    value: function getCursorAdapter(props) {
      return null;
    }
  }, {
    key: "isSelectionPicked",
    value: function isSelectionPicked(picks, props) {
      if (!picks.length) return false;
      var pickedFeatures = getNonGuidePicks(picks).map(function (_ref) {
        var index = _ref.index;
        return index;
      });
      var pickedHandles = getPickedEditHandles(picks).map(function (handle) {
        return handle.featureIndex;
      });
      var pickedIndexes = new Set(_toConsumableArray(pickedFeatures).concat(_toConsumableArray(pickedHandles)));
      return props.selectedIndexes.some(function (index) {
        return pickedIndexes.has(index);
      });
    }
  }, {
    key: "getAddFeatureAction",
    value: function getAddFeatureAction(geometry, features) {
      // Unsure why flow can't deal with Geometry type, but there I fixed it
      var geometryAsAny = geometry;
      var updatedData = new _immutableFeatureCollection.ImmutableFeatureCollection(features).addFeature({
        type: 'Feature',
        properties: {},
        geometry: geometryAsAny
      }).getObject();
      return {
        updatedData: updatedData,
        editType: 'addFeature',
        editContext: {
          featureIndexes: [updatedData.features.length - 1]
        }
      };
    }
  }, {
    key: "getAddManyFeaturesAction",
    value: function getAddManyFeaturesAction(_ref2, features) {
      var featuresToAdd = _ref2.features;
      var updatedData = new _immutableFeatureCollection.ImmutableFeatureCollection(features);
      var initialIndex = updatedData.getObject().features.length;
      var updatedIndexes = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = featuresToAdd[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var feature = _step.value;
          var properties = feature.properties,
              geometry = feature.geometry;
          var geometryAsAny = geometry;
          updatedData = updatedData.addFeature({
            type: 'Feature',
            properties: properties,
            geometry: geometryAsAny
          });
          updatedIndexes.push(initialIndex + updatedIndexes.length);
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

      return {
        updatedData: updatedData.getObject(),
        editType: 'addFeature',
        editContext: {
          featureIndexes: updatedIndexes
        }
      };
    }
  }, {
    key: "getAddFeatureOrBooleanPolygonAction",
    value: function getAddFeatureOrBooleanPolygonAction(geometry, props) {
      var selectedFeature = this.getSelectedFeature(props);
      var modeConfig = props.modeConfig;

      if (modeConfig && modeConfig.booleanOperation) {
        if (!selectedFeature || selectedFeature.geometry.type !== 'Polygon' && selectedFeature.geometry.type !== 'MultiPolygon') {
          // eslint-disable-next-line no-console,no-undef
          console.warn('booleanOperation only supported for single Polygon or MultiPolygon selection');
          return null;
        }

        var feature = {
          type: 'Feature',
          geometry: geometry
        };
        var updatedGeometry;

        if (modeConfig.booleanOperation === 'union') {
          updatedGeometry = (0, _union.default)(selectedFeature, feature);
        } else if (modeConfig.booleanOperation === 'difference') {
          updatedGeometry = (0, _difference.default)(selectedFeature, feature);
        } else if (modeConfig.booleanOperation === 'intersection') {
          updatedGeometry = (0, _intersect.default)(selectedFeature, feature);
        } else {
          // eslint-disable-next-line no-console,no-undef
          console.warn("Invalid booleanOperation ".concat(modeConfig.booleanOperation));
          return null;
        }

        if (!updatedGeometry) {
          // eslint-disable-next-line no-console,no-undef
          console.warn('Canceling edit. Boolean operation erased entire polygon.');
          return null;
        }

        var featureIndex = props.selectedIndexes[0];
        var updatedData = new _immutableFeatureCollection.ImmutableFeatureCollection(props.data).replaceGeometry(featureIndex, updatedGeometry.geometry).getObject();
        var editAction = {
          updatedData: updatedData,
          editType: 'unionGeometry',
          editContext: {
            featureIndexes: [featureIndex]
          }
        };
        return editAction;
      }

      return this.getAddFeatureAction(geometry, props.data);
    }
  }, {
    key: "handleClick",
    value: function handleClick(event, props) {
      var editAction = this.handleClickAdapter(event, props);

      if (editAction) {
        props.onEdit(editAction);
      }
    }
  }, {
    key: "handlePointerMove",
    value: function handlePointerMove(event, props) {
      var _this$handlePointerMo = this.handlePointerMoveAdapter(event, props),
          editAction = _this$handlePointerMo.editAction,
          cancelMapPan = _this$handlePointerMo.cancelMapPan;

      if (cancelMapPan) {
        // TODO: is there a less hacky way to prevent map panning?
        // Stop propagation to prevent map panning while dragging an edit handle
        event.sourceEvent.stopPropagation();
      }

      this._refreshCursor(props);

      if (editAction) {
        props.onEdit(editAction);
      }
    }
  }, {
    key: "handleStartDragging",
    value: function handleStartDragging(event, props) {
      var editAction = this.handleStartDraggingAdapter(event, props);

      if (editAction) {
        props.onEdit(editAction);
      }
    }
  }, {
    key: "handleStopDragging",
    value: function handleStopDragging(event, props) {
      var editAction = this.handleStopDraggingAdapter(event, props);

      if (editAction) {
        props.onEdit(editAction);
      }
    } // TODO edit-modes: delete these adapters once all ModeHandler implementations don't use them

  }, {
    key: "handleClickAdapter",
    value: function handleClickAdapter(event, props) {
      this._clickSequence.push(event.mapCoords);

      return null;
    }
  }, {
    key: "handlePointerMoveAdapter",
    value: function handlePointerMoveAdapter(event, props) {
      return {
        editAction: null,
        cancelMapPan: false
      };
    }
  }, {
    key: "handleStartDraggingAdapter",
    value: function handleStartDraggingAdapter(event, props) {
      return null;
    }
  }, {
    key: "handleStopDraggingAdapter",
    value: function handleStopDraggingAdapter(event, props) {
      return null;
    }
  }]);

  return BaseGeoJsonEditMode;
}();

exports.BaseGeoJsonEditMode = BaseGeoJsonEditMode;

function getPickedEditHandle(picks) {
  var handles = getPickedEditHandles(picks);
  return handles.length ? handles[0] : null;
}

function getNonGuidePicks(picks) {
  return picks && picks.filter(function (pick) {
    return !pick.isGuide;
  });
} // TODO edit-modes: refactor to just return `info.object`


function getPickedEditHandles(picks) {
  var handles = picks && picks.filter(function (pick) {
    return pick.isGuide && pick.object.properties.guideType === 'editHandle';
  }).map(function (pick) {
    return pick.object;
  }) || [];
  return handles.map(function (handle) {
    var feature = handle;
    var geometry = feature.geometry; // $FlowFixMe

    var properties = feature.properties;
    return {
      type: properties.editHandleType,
      position: geometry.coordinates,
      positionIndexes: properties.positionIndexes,
      featureIndex: properties.featureIndex
    };
  });
}

function getPickedExistingEditHandle(picks) {
  var handles = getPickedEditHandles(picks);
  return handles.find(function (h) {
    return h.featureIndex >= 0 && h.type === 'existing';
  });
}

function getPickedIntermediateEditHandle(picks) {
  var handles = getPickedEditHandles(picks);
  return handles.find(function (h) {
    return h.featureIndex >= 0 && h.type === 'intermediate';
  });
}

function getIntermediatePosition(position1, position2) {
  var intermediatePosition = [(position1[0] + position2[0]) / 2.0, (position1[1] + position2[1]) / 2.0];
  return intermediatePosition;
}

function getEditHandlesForGeometry(geometry, featureIndex) {
  var editHandleType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'existing';
  var handles = [];

  switch (geometry.type) {
    case 'Point':
      // positions are not nested
      handles = [{
        position: geometry.coordinates,
        positionIndexes: [],
        featureIndex: featureIndex,
        type: editHandleType
      }];
      break;

    case 'MultiPoint':
    case 'LineString':
      // positions are nested 1 level
      handles = handles.concat(getEditHandlesForCoordinates(geometry.coordinates, [], featureIndex, editHandleType));
      break;

    case 'Polygon':
    case 'MultiLineString':
      // positions are nested 2 levels
      for (var a = 0; a < geometry.coordinates.length; a++) {
        handles = handles.concat(getEditHandlesForCoordinates(geometry.coordinates[a], [a], featureIndex, editHandleType));

        if (geometry.type === 'Polygon') {
          // Don't repeat the first/last handle for Polygons
          handles = handles.slice(0, -1);
        }
      }

      break;

    case 'MultiPolygon':
      // positions are nested 3 levels
      for (var _a = 0; _a < geometry.coordinates.length; _a++) {
        for (var b = 0; b < geometry.coordinates[_a].length; b++) {
          handles = handles.concat(getEditHandlesForCoordinates(geometry.coordinates[_a][b], [_a, b], featureIndex, editHandleType)); // Don't repeat the first/last handle for Polygons

          handles = handles.slice(0, -1);
        }
      }

      break;

    default:
      throw Error("Unhandled geometry type: ".concat(geometry.type));
  }

  return handles;
}

function getEditHandlesForCoordinates(coordinates, positionIndexPrefix, featureIndex) {
  var editHandleType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'existing';
  var editHandles = [];

  for (var i = 0; i < coordinates.length; i++) {
    var position = coordinates[i];
    editHandles.push({
      position: position,
      positionIndexes: _toConsumableArray(positionIndexPrefix).concat([i]),
      featureIndex: featureIndex,
      type: editHandleType
    });
  }

  return editHandles;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvZ2VvanNvbi1lZGl0LW1vZGUuanMiXSwibmFtZXMiOlsiREVGQVVMVF9FRElUX0hBTkRMRVMiLCJCYXNlR2VvSnNvbkVkaXRNb2RlIiwicHJvcHMiLCJsYXN0UG9pbnRlck1vdmVFdmVudCIsInBpY2tzIiwibWFwQ29vcmRzIiwiZWRpdEhhbmRsZXMiLCJnZXRFZGl0SGFuZGxlc0FkYXB0ZXIiLCJ0ZW50YXRpdmVGZWF0dXJlIiwiZ2V0VGVudGF0aXZlRmVhdHVyZSIsInRlbnRhdGl2ZUZlYXR1cmVzIiwiZWRpdEhhbmRsZUZlYXR1cmVzIiwibWFwIiwiaGFuZGxlIiwidHlwZSIsInByb3BlcnRpZXMiLCJndWlkZVR5cGUiLCJlZGl0SGFuZGxlVHlwZSIsImZlYXR1cmVJbmRleCIsInBvc2l0aW9uSW5kZXhlcyIsImdlb21ldHJ5IiwiY29vcmRpbmF0ZXMiLCJwb3NpdGlvbiIsImZlYXR1cmVzIiwic2VsZWN0ZWRJbmRleGVzIiwibGVuZ3RoIiwiZGF0YSIsImZlYXR1cmUiLCJnZXRTZWxlY3RlZEZlYXR1cmUiLCJzZWxlY3RlZEZlYXR1cmVzIiwic2VsZWN0ZWRJbmRleCIsIl9jbGlja1NlcXVlbmNlIiwiX3RlbnRhdGl2ZUZlYXR1cmUiLCJjdXJyZW50Q3Vyc29yIiwiY3Vyc29yIiwidXBkYXRlZEN1cnNvciIsImdldEN1cnNvckFkYXB0ZXIiLCJvblVwZGF0ZUN1cnNvciIsInBpY2tlZEZlYXR1cmVzIiwiZ2V0Tm9uR3VpZGVQaWNrcyIsImluZGV4IiwicGlja2VkSGFuZGxlcyIsImdldFBpY2tlZEVkaXRIYW5kbGVzIiwicGlja2VkSW5kZXhlcyIsIlNldCIsInNvbWUiLCJoYXMiLCJnZW9tZXRyeUFzQW55IiwidXBkYXRlZERhdGEiLCJJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbiIsImFkZEZlYXR1cmUiLCJnZXRPYmplY3QiLCJlZGl0VHlwZSIsImVkaXRDb250ZXh0IiwiZmVhdHVyZUluZGV4ZXMiLCJmZWF0dXJlc1RvQWRkIiwiaW5pdGlhbEluZGV4IiwidXBkYXRlZEluZGV4ZXMiLCJwdXNoIiwic2VsZWN0ZWRGZWF0dXJlIiwibW9kZUNvbmZpZyIsImJvb2xlYW5PcGVyYXRpb24iLCJjb25zb2xlIiwid2FybiIsInVwZGF0ZWRHZW9tZXRyeSIsInJlcGxhY2VHZW9tZXRyeSIsImVkaXRBY3Rpb24iLCJnZXRBZGRGZWF0dXJlQWN0aW9uIiwiZXZlbnQiLCJoYW5kbGVDbGlja0FkYXB0ZXIiLCJvbkVkaXQiLCJoYW5kbGVQb2ludGVyTW92ZUFkYXB0ZXIiLCJjYW5jZWxNYXBQYW4iLCJzb3VyY2VFdmVudCIsInN0b3BQcm9wYWdhdGlvbiIsIl9yZWZyZXNoQ3Vyc29yIiwiaGFuZGxlU3RhcnREcmFnZ2luZ0FkYXB0ZXIiLCJoYW5kbGVTdG9wRHJhZ2dpbmdBZGFwdGVyIiwiZ2V0UGlja2VkRWRpdEhhbmRsZSIsImhhbmRsZXMiLCJmaWx0ZXIiLCJwaWNrIiwiaXNHdWlkZSIsIm9iamVjdCIsImdldFBpY2tlZEV4aXN0aW5nRWRpdEhhbmRsZSIsImZpbmQiLCJoIiwiZ2V0UGlja2VkSW50ZXJtZWRpYXRlRWRpdEhhbmRsZSIsImdldEludGVybWVkaWF0ZVBvc2l0aW9uIiwicG9zaXRpb24xIiwicG9zaXRpb24yIiwiaW50ZXJtZWRpYXRlUG9zaXRpb24iLCJnZXRFZGl0SGFuZGxlc0Zvckdlb21ldHJ5IiwiY29uY2F0IiwiZ2V0RWRpdEhhbmRsZXNGb3JDb29yZGluYXRlcyIsImEiLCJzbGljZSIsImIiLCJFcnJvciIsInBvc2l0aW9uSW5kZXhQcmVmaXgiLCJpIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUVBOztBQUNBOztBQUNBOztBQW9CQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWNBLElBQU1BLG9CQUFrQyxHQUFHLEVBQTNDLEMsQ0FFQTs7SUFHYUMsbUI7Ozs7Ozs0Q0FDa0IsRTs7Ozs7Ozs4QkFHbkJDLEssRUFBd0Q7QUFBQSxVQUN4REMsb0JBRHdELEdBQy9CRCxLQUQrQixDQUN4REMs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TUFBQUEsZUFBZSxxQkFBTWdGLG1CQUFOLFVBQTJCQyxDQUEzQixFQUZBO0FBR2ZsRixNQUFBQSxZQUFZLEVBQVpBLFlBSGU7QUFJZkosTUFBQUEsSUFBSSxFQUFFRztBQUpTLEtBQWpCO0FBTUQ7O0FBQ0QsU0FBT1gsV0FBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuaW1wb3J0IHR1cmZVbmlvbiBmcm9tICdAdHVyZi91bmlvbic7XG5pbXBvcnQgdHVyZkRpZmZlcmVuY2UgZnJvbSAnQHR1cmYvZGlmZmVyZW5jZSc7XG5pbXBvcnQgdHVyZkludGVyc2VjdCBmcm9tICdAdHVyZi9pbnRlcnNlY3QnO1xuXG5pbXBvcnQgdHlwZSB7XG4gIEVkaXRBY3Rpb24sXG4gIENsaWNrRXZlbnQsXG4gIFBvaW50ZXJNb3ZlRXZlbnQsXG4gIFN0YXJ0RHJhZ2dpbmdFdmVudCxcbiAgU3RvcERyYWdnaW5nRXZlbnQsXG4gIFBpY2ssXG4gIE1vZGVQcm9wc1xufSBmcm9tICcuLi90eXBlcy5qcyc7XG5pbXBvcnQgdHlwZSB7XG4gIEZlYXR1cmVDb2xsZWN0aW9uLFxuICBGZWF0dXJlLFxuICBGZWF0dXJlT2YsXG4gIFBvaW50LFxuICBQb2x5Z29uLFxuICBHZW9tZXRyeSxcbiAgUG9zaXRpb25cbn0gZnJvbSAnLi4vZ2VvanNvbi10eXBlcy5qcyc7XG5pbXBvcnQgeyBFZGl0TW9kZSB9IGZyb20gJy4vZWRpdC1tb2RlLmpzJztcblxuaW1wb3J0IHsgSW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24gfSBmcm9tICcuL2ltbXV0YWJsZS1mZWF0dXJlLWNvbGxlY3Rpb24uanMnO1xuXG5leHBvcnQgdHlwZSBFZGl0SGFuZGxlVHlwZSA9ICdleGlzdGluZycgfCAnaW50ZXJtZWRpYXRlJyB8ICdzbmFwJztcblxuLy8gVE9ETyBlZGl0LW1vZGVzOiAtIENoYW5nZSB0aGlzIHRvIGp1c3QgYmUgYSBHb2VKU09OIGluc3RlYWRcbmV4cG9ydCB0eXBlIEVkaXRIYW5kbGUgPSB7XG4gIHBvc2l0aW9uOiBQb3NpdGlvbixcbiAgcG9zaXRpb25JbmRleGVzOiBudW1iZXJbXSxcbiAgZmVhdHVyZUluZGV4OiBudW1iZXIsXG4gIHR5cGU6IEVkaXRIYW5kbGVUeXBlXG59O1xuXG5leHBvcnQgdHlwZSBHZW9Kc29uRWRpdEFjdGlvbiA9IEVkaXRBY3Rpb248RmVhdHVyZUNvbGxlY3Rpb24+O1xuXG5jb25zdCBERUZBVUxUX0VESVRfSEFORExFUzogRWRpdEhhbmRsZVtdID0gW107XG5cbi8vIE1haW4gaW50ZXJmYWNlIGZvciBgRWRpdE1vZGVgcyB0aGF0IGVkaXQgR2VvSlNPTlxuZXhwb3J0IHR5cGUgR2VvSnNvbkVkaXRNb2RlID0gRWRpdE1vZGU8RmVhdHVyZUNvbGxlY3Rpb24sIEZlYXR1cmVDb2xsZWN0aW9uPjtcblxuZXhwb3J0IGNsYXNzIEJhc2VHZW9Kc29uRWRpdE1vZGUgaW1wbGVtZW50cyBFZGl0TW9kZTxGZWF0dXJlQ29sbGVjdGlvbiwgRmVhdHVyZUNvbGxlY3Rpb24+IHtcbiAgX2NsaWNrU2VxdWVuY2U6IFBvc2l0aW9uW10gPSBbXTtcbiAgX3RlbnRhdGl2ZUZlYXR1cmU6ID9GZWF0dXJlO1xuXG4gIGdldEd1aWRlcyhwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPik6IEZlYXR1cmVDb2xsZWN0aW9uIHtcbiAgICBjb25zdCB7IGxhc3RQb2ludGVyTW92ZUV2ZW50IH0gPSBwcm9wcztcbiAgICBjb25zdCBwaWNrcyA9IGxhc3RQb2ludGVyTW92ZUV2ZW50ICYmIGxhc3RQb2ludGVyTW92ZUV2ZW50LnBpY2tzO1xuICAgIGNvbnN0IG1hcENvb3JkcyA9IGxhc3RQb2ludGVyTW92ZUV2ZW50ICYmIGxhc3RQb2ludGVyTW92ZUV2ZW50Lm1hcENvb3JkcztcbiAgICBjb25zdCBlZGl0SGFuZGxlcyA9IHRoaXMuZ2V0RWRpdEhhbmRsZXNBZGFwdGVyKHBpY2tzLCBtYXBDb29yZHMsIHByb3BzKTtcblxuICAgIGNvbnN0IHRlbnRhdGl2ZUZlYXR1cmUgPSB0aGlzLmdldFRlbnRhdGl2ZUZlYXR1cmUoKTtcbiAgICBjb25zdCB0ZW50YXRpdmVGZWF0dXJlczogRmVhdHVyZVtdID0gdGVudGF0aXZlRmVhdHVyZSA/IFt0ZW50YXRpdmVGZWF0dXJlXSA6IFtdO1xuICAgIGNvbnN0IGVkaXRIYW5kbGVGZWF0dXJlczogRmVhdHVyZU9mPFBvaW50PltdID0gZWRpdEhhbmRsZXMubWFwKGhhbmRsZSA9PiAoe1xuICAgICAgdHlwZTogJ0ZlYXR1cmUnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBndWlkZVR5cGU6ICdlZGl0SGFuZGxlJyxcbiAgICAgICAgZWRpdEhhbmRsZVR5cGU6IGhhbmRsZS50eXBlLFxuICAgICAgICBmZWF0dXJlSW5kZXg6IGhhbmRsZS5mZWF0dXJlSW5kZXgsXG4gICAgICAgIHBvc2l0aW9uSW5kZXhlczogaGFuZGxlLnBvc2l0aW9uSW5kZXhlc1xuICAgICAgfSxcbiAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgIHR5cGU6ICdQb2ludCcsXG4gICAgICAgIGNvb3JkaW5hdGVzOiBoYW5kbGUucG9zaXRpb25cbiAgICAgIH1cbiAgICB9KSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogJ0ZlYXR1cmVDb2xsZWN0aW9uJyxcbiAgICAgIGZlYXR1cmVzOiBbLi4udGVudGF0aXZlRmVhdHVyZXMsIC4uLmVkaXRIYW5kbGVGZWF0dXJlc11cbiAgICB9O1xuICB9XG5cbiAgZ2V0U2VsZWN0ZWRGZWF0dXJlKHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KTogP0ZlYXR1cmUge1xuICAgIGlmIChwcm9wcy5zZWxlY3RlZEluZGV4ZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICByZXR1cm4gcHJvcHMuZGF0YS5mZWF0dXJlc1twcm9wcy5zZWxlY3RlZEluZGV4ZXNbMF1dO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGdldFNlbGVjdGVkR2VvbWV0cnkocHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pOiA/R2VvbWV0cnkge1xuICAgIGNvbnN0IGZlYXR1cmUgPSB0aGlzLmdldFNlbGVjdGVkRmVhdHVyZShwcm9wcyk7XG4gICAgaWYgKGZlYXR1cmUpIHtcbiAgICAgIHJldHVybiBmZWF0dXJlLmdlb21ldHJ5O1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGdldFNlbGVjdGVkRmVhdHVyZXNBc0ZlYXR1cmVDb2xsZWN0aW9uKHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KTogRmVhdHVyZUNvbGxlY3Rpb24ge1xuICAgIGNvbnN0IHsgZmVhdHVyZXMgfSA9IHByb3BzLmRhdGE7XG4gICAgY29uc3Qgc2VsZWN0ZWRGZWF0dXJlcyA9IHByb3BzLnNlbGVjdGVkSW5kZXhlcy5tYXAoc2VsZWN0ZWRJbmRleCA9PiBmZWF0dXJlc1tzZWxlY3RlZEluZGV4XSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6ICdGZWF0dXJlQ29sbGVjdGlvbicsXG4gICAgICBmZWF0dXJlczogc2VsZWN0ZWRGZWF0dXJlc1xuICAgIH07XG4gIH1cblxuICBnZXRDbGlja1NlcXVlbmNlKCk6IFBvc2l0aW9uW10ge1xuICAgIHJldHVybiB0aGlzLl9jbGlja1NlcXVlbmNlO1xuICB9XG5cbiAgcmVzZXRDbGlja1NlcXVlbmNlKCk6IHZvaWQge1xuICAgIHRoaXMuX2NsaWNrU2VxdWVuY2UgPSBbXTtcbiAgfVxuXG4gIGdldFRlbnRhdGl2ZUZlYXR1cmUoKTogP0ZlYXR1cmUge1xuICAgIHJldHVybiB0aGlzLl90ZW50YXRpdmVGZWF0dXJlO1xuICB9XG5cbiAgLy8gVE9ETyBlZGl0LW1vZGVzOiBkZWxldGUgbWUgb25jZSBtb2RlIGhhbmRsZXJzIGRvIGdldEVkaXRIYW5kbGVzIGxhemlseVxuICBfc2V0VGVudGF0aXZlRmVhdHVyZSh0ZW50YXRpdmVGZWF0dXJlOiA/RmVhdHVyZSk6IHZvaWQge1xuICAgIGlmICh0ZW50YXRpdmVGZWF0dXJlKSB7XG4gICAgICB0ZW50YXRpdmVGZWF0dXJlLnByb3BlcnRpZXMgPSB7XG4gICAgICAgIC4uLih0ZW50YXRpdmVGZWF0dXJlLnByb3BlcnRpZXMgfHwge30pLFxuICAgICAgICBndWlkZVR5cGU6ICd0ZW50YXRpdmUnXG4gICAgICB9O1xuICAgIH1cbiAgICB0aGlzLl90ZW50YXRpdmVGZWF0dXJlID0gdGVudGF0aXZlRmVhdHVyZTtcbiAgfVxuXG4gIF9yZWZyZXNoQ3Vyc29yKHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KTogdm9pZCB7XG4gICAgY29uc3QgY3VycmVudEN1cnNvciA9IHByb3BzLmN1cnNvcjtcbiAgICBjb25zdCB1cGRhdGVkQ3Vyc29yID0gdGhpcy5nZXRDdXJzb3JBZGFwdGVyKHByb3BzKTtcblxuICAgIGlmIChjdXJyZW50Q3Vyc29yICE9PSB1cGRhdGVkQ3Vyc29yKSB7XG4gICAgICBwcm9wcy5vblVwZGF0ZUN1cnNvcih1cGRhdGVkQ3Vyc29yKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIGZsYXQgYXJyYXkgb2YgcG9zaXRpb25zIGZvciB0aGUgZ2l2ZW4gZmVhdHVyZSBhbG9uZyB3aXRoIHRoZWlyIGluZGV4ZXMgaW50byB0aGUgZmVhdHVyZSdzIGdlb21ldHJ5J3MgY29vcmRpbmF0ZXMuXG4gICAqXG4gICAqIEBwYXJhbSBmZWF0dXJlSW5kZXggVGhlIGluZGV4IG9mIHRoZSBmZWF0dXJlIHRvIGdldCBlZGl0IGhhbmRsZXNcbiAgICovXG4gIGdldEVkaXRIYW5kbGVzQWRhcHRlcihcbiAgICBwaWNrczogP0FycmF5PE9iamVjdD4sXG4gICAgbWFwQ29vcmRzOiA/UG9zaXRpb24sXG4gICAgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj5cbiAgKTogRWRpdEhhbmRsZVtdIHtcbiAgICByZXR1cm4gREVGQVVMVF9FRElUX0hBTkRMRVM7XG4gIH1cblxuICBnZXRDdXJzb3JBZGFwdGVyKHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KTogP3N0cmluZyB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBpc1NlbGVjdGlvblBpY2tlZChwaWNrczogUGlja1tdLCBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPik6IGJvb2xlYW4ge1xuICAgIGlmICghcGlja3MubGVuZ3RoKSByZXR1cm4gZmFsc2U7XG4gICAgY29uc3QgcGlja2VkRmVhdHVyZXMgPSBnZXROb25HdWlkZVBpY2tzKHBpY2tzKS5tYXAoKHsgaW5kZXggfSkgPT4gaW5kZXgpO1xuICAgIGNvbnN0IHBpY2tlZEhhbmRsZXMgPSBnZXRQaWNrZWRFZGl0SGFuZGxlcyhwaWNrcykubWFwKGhhbmRsZSA9PiBoYW5kbGUuZmVhdHVyZUluZGV4KTtcbiAgICBjb25zdCBwaWNrZWRJbmRleGVzID0gbmV3IFNldChbLi4ucGlja2VkRmVhdHVyZXMsIC4uLnBpY2tlZEhhbmRsZXNdKTtcbiAgICByZXR1cm4gcHJvcHMuc2VsZWN0ZWRJbmRleGVzLnNvbWUoaW5kZXggPT4gcGlja2VkSW5kZXhlcy5oYXMoaW5kZXgpKTtcbiAgfVxuXG4gIGdldEFkZEZlYXR1cmVBY3Rpb24oZ2VvbWV0cnk6IEdlb21ldHJ5LCBmZWF0dXJlczogRmVhdHVyZUNvbGxlY3Rpb24pOiBHZW9Kc29uRWRpdEFjdGlvbiB7XG4gICAgLy8gVW5zdXJlIHdoeSBmbG93IGNhbid0IGRlYWwgd2l0aCBHZW9tZXRyeSB0eXBlLCBidXQgdGhlcmUgSSBmaXhlZCBpdFxuICAgIGNvbnN0IGdlb21ldHJ5QXNBbnk6IGFueSA9IGdlb21ldHJ5O1xuXG4gICAgY29uc3QgdXBkYXRlZERhdGEgPSBuZXcgSW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24oZmVhdHVyZXMpXG4gICAgICAuYWRkRmVhdHVyZSh7XG4gICAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgICAgcHJvcGVydGllczoge30sXG4gICAgICAgIGdlb21ldHJ5OiBnZW9tZXRyeUFzQW55XG4gICAgICB9KVxuICAgICAgLmdldE9iamVjdCgpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHVwZGF0ZWREYXRhLFxuICAgICAgZWRpdFR5cGU6ICdhZGRGZWF0dXJlJyxcbiAgICAgIGVkaXRDb250ZXh0OiB7XG4gICAgICAgIGZlYXR1cmVJbmRleGVzOiBbdXBkYXRlZERhdGEuZmVhdHVyZXMubGVuZ3RoIC0gMV1cbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgZ2V0QWRkTWFueUZlYXR1cmVzQWN0aW9uKFxuICAgIHsgZmVhdHVyZXM6IGZlYXR1cmVzVG9BZGQgfTogRmVhdHVyZUNvbGxlY3Rpb24sXG4gICAgZmVhdHVyZXM6IEZlYXR1cmVDb2xsZWN0aW9uXG4gICk6IEdlb0pzb25FZGl0QWN0aW9uIHtcbiAgICBsZXQgdXBkYXRlZERhdGEgPSBuZXcgSW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24oZmVhdHVyZXMpO1xuICAgIGNvbnN0IGluaXRpYWxJbmRleCA9IHVwZGF0ZWREYXRhLmdldE9iamVjdCgpLmZlYXR1cmVzLmxlbmd0aDtcbiAgICBjb25zdCB1cGRhdGVkSW5kZXhlcyA9IFtdO1xuICAgIGZvciAoY29uc3QgZmVhdHVyZSBvZiBmZWF0dXJlc1RvQWRkKSB7XG4gICAgICBjb25zdCB7IHByb3BlcnRpZXMsIGdlb21ldHJ5IH0gPSBmZWF0dXJlO1xuICAgICAgY29uc3QgZ2VvbWV0cnlBc0FueTogYW55ID0gZ2VvbWV0cnk7XG4gICAgICB1cGRhdGVkRGF0YSA9IHVwZGF0ZWREYXRhLmFkZEZlYXR1cmUoe1xuICAgICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICAgIHByb3BlcnRpZXMsXG4gICAgICAgIGdlb21ldHJ5OiBnZW9tZXRyeUFzQW55XG4gICAgICB9KTtcbiAgICAgIHVwZGF0ZWRJbmRleGVzLnB1c2goaW5pdGlhbEluZGV4ICsgdXBkYXRlZEluZGV4ZXMubGVuZ3RoKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgdXBkYXRlZERhdGE6IHVwZGF0ZWREYXRhLmdldE9iamVjdCgpLFxuICAgICAgZWRpdFR5cGU6ICdhZGRGZWF0dXJlJyxcbiAgICAgIGVkaXRDb250ZXh0OiB7XG4gICAgICAgIGZlYXR1cmVJbmRleGVzOiB1cGRhdGVkSW5kZXhlc1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBnZXRBZGRGZWF0dXJlT3JCb29sZWFuUG9seWdvbkFjdGlvbihcbiAgICBnZW9tZXRyeTogUG9seWdvbixcbiAgICBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPlxuICApOiA/R2VvSnNvbkVkaXRBY3Rpb24ge1xuICAgIGNvbnN0IHNlbGVjdGVkRmVhdHVyZSA9IHRoaXMuZ2V0U2VsZWN0ZWRGZWF0dXJlKHByb3BzKTtcbiAgICBjb25zdCB7IG1vZGVDb25maWcgfSA9IHByb3BzO1xuICAgIGlmIChtb2RlQ29uZmlnICYmIG1vZGVDb25maWcuYm9vbGVhbk9wZXJhdGlvbikge1xuICAgICAgaWYgKFxuICAgICAgICAhc2VsZWN0ZWRGZWF0dXJlIHx8XG4gICAgICAgIChzZWxlY3RlZEZlYXR1cmUuZ2VvbWV0cnkudHlwZSAhPT0gJ1BvbHlnb24nICYmXG4gICAgICAgICAgc2VsZWN0ZWRGZWF0dXJlLmdlb21ldHJ5LnR5cGUgIT09ICdNdWx0aVBvbHlnb24nKVxuICAgICAgKSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlLG5vLXVuZGVmXG4gICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICAnYm9vbGVhbk9wZXJhdGlvbiBvbmx5IHN1cHBvcnRlZCBmb3Igc2luZ2xlIFBvbHlnb24gb3IgTXVsdGlQb2x5Z29uIHNlbGVjdGlvbidcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGZlYXR1cmUgPSB7XG4gICAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgICAgZ2VvbWV0cnlcbiAgICAgIH07XG5cbiAgICAgIGxldCB1cGRhdGVkR2VvbWV0cnk7XG4gICAgICBpZiAobW9kZUNvbmZpZy5ib29sZWFuT3BlcmF0aW9uID09PSAndW5pb24nKSB7XG4gICAgICAgIHVwZGF0ZWRHZW9tZXRyeSA9IHR1cmZVbmlvbihzZWxlY3RlZEZlYXR1cmUsIGZlYXR1cmUpO1xuICAgICAgfSBlbHNlIGlmIChtb2RlQ29uZmlnLmJvb2xlYW5PcGVyYXRpb24gPT09ICdkaWZmZXJlbmNlJykge1xuICAgICAgICB1cGRhdGVkR2VvbWV0cnkgPSB0dXJmRGlmZmVyZW5jZShzZWxlY3RlZEZlYXR1cmUsIGZlYXR1cmUpO1xuICAgICAgfSBlbHNlIGlmIChtb2RlQ29uZmlnLmJvb2xlYW5PcGVyYXRpb24gPT09ICdpbnRlcnNlY3Rpb24nKSB7XG4gICAgICAgIHVwZGF0ZWRHZW9tZXRyeSA9IHR1cmZJbnRlcnNlY3Qoc2VsZWN0ZWRGZWF0dXJlLCBmZWF0dXJlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlLG5vLXVuZGVmXG4gICAgICAgIGNvbnNvbGUud2FybihgSW52YWxpZCBib29sZWFuT3BlcmF0aW9uICR7bW9kZUNvbmZpZy5ib29sZWFuT3BlcmF0aW9ufWApO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgaWYgKCF1cGRhdGVkR2VvbWV0cnkpIHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGUsbm8tdW5kZWZcbiAgICAgICAgY29uc29sZS53YXJuKCdDYW5jZWxpbmcgZWRpdC4gQm9vbGVhbiBvcGVyYXRpb24gZXJhc2VkIGVudGlyZSBwb2x5Z29uLicpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZmVhdHVyZUluZGV4ID0gcHJvcHMuc2VsZWN0ZWRJbmRleGVzWzBdO1xuXG4gICAgICBjb25zdCB1cGRhdGVkRGF0YSA9IG5ldyBJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbihwcm9wcy5kYXRhKVxuICAgICAgICAucmVwbGFjZUdlb21ldHJ5KGZlYXR1cmVJbmRleCwgdXBkYXRlZEdlb21ldHJ5Lmdlb21ldHJ5KVxuICAgICAgICAuZ2V0T2JqZWN0KCk7XG5cbiAgICAgIGNvbnN0IGVkaXRBY3Rpb246IEdlb0pzb25FZGl0QWN0aW9uID0ge1xuICAgICAgICB1cGRhdGVkRGF0YSxcbiAgICAgICAgZWRpdFR5cGU6ICd1bmlvbkdlb21ldHJ5JyxcbiAgICAgICAgZWRpdENvbnRleHQ6IHtcbiAgICAgICAgICBmZWF0dXJlSW5kZXhlczogW2ZlYXR1cmVJbmRleF1cbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgcmV0dXJuIGVkaXRBY3Rpb247XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmdldEFkZEZlYXR1cmVBY3Rpb24oZ2VvbWV0cnksIHByb3BzLmRhdGEpO1xuICB9XG5cbiAgaGFuZGxlQ2xpY2soZXZlbnQ6IENsaWNrRXZlbnQsIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KTogdm9pZCB7XG4gICAgY29uc3QgZWRpdEFjdGlvbiA9IHRoaXMuaGFuZGxlQ2xpY2tBZGFwdGVyKGV2ZW50LCBwcm9wcyk7XG5cbiAgICBpZiAoZWRpdEFjdGlvbikge1xuICAgICAgcHJvcHMub25FZGl0KGVkaXRBY3Rpb24pO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZVBvaW50ZXJNb3ZlKGV2ZW50OiBQb2ludGVyTW92ZUV2ZW50LCBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPik6IHZvaWQge1xuICAgIGNvbnN0IHsgZWRpdEFjdGlvbiwgY2FuY2VsTWFwUGFuIH0gPSB0aGlzLmhhbmRsZVBvaW50ZXJNb3ZlQWRhcHRlcihldmVudCwgcHJvcHMpO1xuXG4gICAgaWYgKGNhbmNlbE1hcFBhbikge1xuICAgICAgLy8gVE9ETzogaXMgdGhlcmUgYSBsZXNzIGhhY2t5IHdheSB0byBwcmV2ZW50IG1hcCBwYW5uaW5nP1xuICAgICAgLy8gU3RvcCBwcm9wYWdhdGlvbiB0byBwcmV2ZW50IG1hcCBwYW5uaW5nIHdoaWxlIGRyYWdnaW5nIGFuIGVkaXQgaGFuZGxlXG4gICAgICBldmVudC5zb3VyY2VFdmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG5cbiAgICB0aGlzLl9yZWZyZXNoQ3Vyc29yKHByb3BzKTtcbiAgICBpZiAoZWRpdEFjdGlvbikge1xuICAgICAgcHJvcHMub25FZGl0KGVkaXRBY3Rpb24pO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZVN0YXJ0RHJhZ2dpbmcoZXZlbnQ6IFN0YXJ0RHJhZ2dpbmdFdmVudCwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pOiB2b2lkIHtcbiAgICBjb25zdCBlZGl0QWN0aW9uID0gdGhpcy5oYW5kbGVTdGFydERyYWdnaW5nQWRhcHRlcihldmVudCwgcHJvcHMpO1xuXG4gICAgaWYgKGVkaXRBY3Rpb24pIHtcbiAgICAgIHByb3BzLm9uRWRpdChlZGl0QWN0aW9uKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVTdG9wRHJhZ2dpbmcoZXZlbnQ6IFN0b3BEcmFnZ2luZ0V2ZW50LCBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPik6IHZvaWQge1xuICAgIGNvbnN0IGVkaXRBY3Rpb24gPSB0aGlzLmhhbmRsZVN0b3BEcmFnZ2luZ0FkYXB0ZXIoZXZlbnQsIHByb3BzKTtcblxuICAgIGlmIChlZGl0QWN0aW9uKSB7XG4gICAgICBwcm9wcy5vbkVkaXQoZWRpdEFjdGlvbik7XG4gICAgfVxuICB9XG5cbiAgLy8gVE9ETyBlZGl0LW1vZGVzOiBkZWxldGUgdGhlc2UgYWRhcHRlcnMgb25jZSBhbGwgTW9kZUhhbmRsZXIgaW1wbGVtZW50YXRpb25zIGRvbid0IHVzZSB0aGVtXG4gIGhhbmRsZUNsaWNrQWRhcHRlcihldmVudDogQ2xpY2tFdmVudCwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pOiA/R2VvSnNvbkVkaXRBY3Rpb24ge1xuICAgIHRoaXMuX2NsaWNrU2VxdWVuY2UucHVzaChldmVudC5tYXBDb29yZHMpO1xuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBoYW5kbGVQb2ludGVyTW92ZUFkYXB0ZXIoXG4gICAgZXZlbnQ6IFBvaW50ZXJNb3ZlRXZlbnQsXG4gICAgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj5cbiAgKTogeyBlZGl0QWN0aW9uOiA/R2VvSnNvbkVkaXRBY3Rpb24sIGNhbmNlbE1hcFBhbjogYm9vbGVhbiB9IHtcbiAgICByZXR1cm4geyBlZGl0QWN0aW9uOiBudWxsLCBjYW5jZWxNYXBQYW46IGZhbHNlIH07XG4gIH1cblxuICBoYW5kbGVTdGFydERyYWdnaW5nQWRhcHRlcihcbiAgICBldmVudDogU3RhcnREcmFnZ2luZ0V2ZW50LFxuICAgIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+XG4gICk6ID9HZW9Kc29uRWRpdEFjdGlvbiB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBoYW5kbGVTdG9wRHJhZ2dpbmdBZGFwdGVyKFxuICAgIGV2ZW50OiBTdG9wRHJhZ2dpbmdFdmVudCxcbiAgICBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPlxuICApOiA/R2VvSnNvbkVkaXRBY3Rpb24ge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQaWNrZWRFZGl0SGFuZGxlKHBpY2tzOiA/KGFueVtdKSk6ID9FZGl0SGFuZGxlIHtcbiAgY29uc3QgaGFuZGxlcyA9IGdldFBpY2tlZEVkaXRIYW5kbGVzKHBpY2tzKTtcbiAgcmV0dXJuIGhhbmRsZXMubGVuZ3RoID8gaGFuZGxlc1swXSA6IG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXROb25HdWlkZVBpY2tzKHBpY2tzOiBhbnlbXSk6IGFueVtdIHtcbiAgcmV0dXJuIHBpY2tzICYmIHBpY2tzLmZpbHRlcihwaWNrID0+ICFwaWNrLmlzR3VpZGUpO1xufVxuXG4vLyBUT0RPIGVkaXQtbW9kZXM6IHJlZmFjdG9yIHRvIGp1c3QgcmV0dXJuIGBpbmZvLm9iamVjdGBcbmV4cG9ydCBmdW5jdGlvbiBnZXRQaWNrZWRFZGl0SGFuZGxlcyhwaWNrczogPyhhbnlbXSkpOiBFZGl0SGFuZGxlW10ge1xuICBjb25zdCBoYW5kbGVzID1cbiAgICAocGlja3MgJiZcbiAgICAgIHBpY2tzXG4gICAgICAgIC5maWx0ZXIocGljayA9PiBwaWNrLmlzR3VpZGUgJiYgcGljay5vYmplY3QucHJvcGVydGllcy5ndWlkZVR5cGUgPT09ICdlZGl0SGFuZGxlJylcbiAgICAgICAgLm1hcChwaWNrID0+IHBpY2sub2JqZWN0KSkgfHxcbiAgICBbXTtcblxuICByZXR1cm4gaGFuZGxlcy5tYXAoaGFuZGxlID0+IHtcbiAgICBjb25zdCBmZWF0dXJlOiBGZWF0dXJlT2Y8UG9pbnQ+ID0gaGFuZGxlO1xuICAgIGNvbnN0IHsgZ2VvbWV0cnkgfSA9IGZlYXR1cmU7XG5cbiAgICAvLyAkRmxvd0ZpeE1lXG4gICAgY29uc3QgcHJvcGVydGllczogeyBbc3RyaW5nXTogYW55IH0gPSBmZWF0dXJlLnByb3BlcnRpZXM7XG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6IHByb3BlcnRpZXMuZWRpdEhhbmRsZVR5cGUsXG4gICAgICBwb3NpdGlvbjogZ2VvbWV0cnkuY29vcmRpbmF0ZXMsXG4gICAgICBwb3NpdGlvbkluZGV4ZXM6IHByb3BlcnRpZXMucG9zaXRpb25JbmRleGVzLFxuICAgICAgZmVhdHVyZUluZGV4OiBwcm9wZXJ0aWVzLmZlYXR1cmVJbmRleFxuICAgIH07XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGlja2VkRXhpc3RpbmdFZGl0SGFuZGxlKHBpY2tzOiA/KGFueVtdKSk6ID9FZGl0SGFuZGxlIHtcbiAgY29uc3QgaGFuZGxlcyA9IGdldFBpY2tlZEVkaXRIYW5kbGVzKHBpY2tzKTtcbiAgcmV0dXJuIGhhbmRsZXMuZmluZChoID0+IGguZmVhdHVyZUluZGV4ID49IDAgJiYgaC50eXBlID09PSAnZXhpc3RpbmcnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBpY2tlZEludGVybWVkaWF0ZUVkaXRIYW5kbGUocGlja3M6ID8oYW55W10pKTogP0VkaXRIYW5kbGUge1xuICBjb25zdCBoYW5kbGVzID0gZ2V0UGlja2VkRWRpdEhhbmRsZXMocGlja3MpO1xuICByZXR1cm4gaGFuZGxlcy5maW5kKGggPT4gaC5mZWF0dXJlSW5kZXggPj0gMCAmJiBoLnR5cGUgPT09ICdpbnRlcm1lZGlhdGUnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEludGVybWVkaWF0ZVBvc2l0aW9uKHBvc2l0aW9uMTogUG9zaXRpb24sIHBvc2l0aW9uMjogUG9zaXRpb24pOiBQb3NpdGlvbiB7XG4gIGNvbnN0IGludGVybWVkaWF0ZVBvc2l0aW9uID0gW1xuICAgIChwb3NpdGlvbjFbMF0gKyBwb3NpdGlvbjJbMF0pIC8gMi4wLFxuICAgIChwb3NpdGlvbjFbMV0gKyBwb3NpdGlvbjJbMV0pIC8gMi4wXG4gIF07XG4gIHJldHVybiBpbnRlcm1lZGlhdGVQb3NpdGlvbjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEVkaXRIYW5kbGVzRm9yR2VvbWV0cnkoXG4gIGdlb21ldHJ5OiBHZW9tZXRyeSxcbiAgZmVhdHVyZUluZGV4OiBudW1iZXIsXG4gIGVkaXRIYW5kbGVUeXBlOiBFZGl0SGFuZGxlVHlwZSA9ICdleGlzdGluZydcbikge1xuICBsZXQgaGFuZGxlczogRWRpdEhhbmRsZVtdID0gW107XG5cbiAgc3dpdGNoIChnZW9tZXRyeS50eXBlKSB7XG4gICAgY2FzZSAnUG9pbnQnOlxuICAgICAgLy8gcG9zaXRpb25zIGFyZSBub3QgbmVzdGVkXG4gICAgICBoYW5kbGVzID0gW1xuICAgICAgICB7XG4gICAgICAgICAgcG9zaXRpb246IGdlb21ldHJ5LmNvb3JkaW5hdGVzLFxuICAgICAgICAgIHBvc2l0aW9uSW5kZXhlczogW10sXG4gICAgICAgICAgZmVhdHVyZUluZGV4LFxuICAgICAgICAgIHR5cGU6IGVkaXRIYW5kbGVUeXBlXG4gICAgICAgIH1cbiAgICAgIF07XG4gICAgICBicmVhaztcbiAgICBjYXNlICdNdWx0aVBvaW50JzpcbiAgICBjYXNlICdMaW5lU3RyaW5nJzpcbiAgICAgIC8vIHBvc2l0aW9ucyBhcmUgbmVzdGVkIDEgbGV2ZWxcbiAgICAgIGhhbmRsZXMgPSBoYW5kbGVzLmNvbmNhdChcbiAgICAgICAgZ2V0RWRpdEhhbmRsZXNGb3JDb29yZGluYXRlcyhnZW9tZXRyeS5jb29yZGluYXRlcywgW10sIGZlYXR1cmVJbmRleCwgZWRpdEhhbmRsZVR5cGUpXG4gICAgICApO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnUG9seWdvbic6XG4gICAgY2FzZSAnTXVsdGlMaW5lU3RyaW5nJzpcbiAgICAgIC8vIHBvc2l0aW9ucyBhcmUgbmVzdGVkIDIgbGV2ZWxzXG4gICAgICBmb3IgKGxldCBhID0gMDsgYSA8IGdlb21ldHJ5LmNvb3JkaW5hdGVzLmxlbmd0aDsgYSsrKSB7XG4gICAgICAgIGhhbmRsZXMgPSBoYW5kbGVzLmNvbmNhdChcbiAgICAgICAgICBnZXRFZGl0SGFuZGxlc0ZvckNvb3JkaW5hdGVzKGdlb21ldHJ5LmNvb3JkaW5hdGVzW2FdLCBbYV0sIGZlYXR1cmVJbmRleCwgZWRpdEhhbmRsZVR5cGUpXG4gICAgICAgICk7XG4gICAgICAgIGlmIChnZW9tZXRyeS50eXBlID09PSAnUG9seWdvbicpIHtcbiAgICAgICAgICAvLyBEb24ndCByZXBlYXQgdGhlIGZpcnN0L2xhc3QgaGFuZGxlIGZvciBQb2x5Z29uc1xuICAgICAgICAgIGhhbmRsZXMgPSBoYW5kbGVzLnNsaWNlKDAsIC0xKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnTXVsdGlQb2x5Z29uJzpcbiAgICAgIC8vIHBvc2l0aW9ucyBhcmUgbmVzdGVkIDMgbGV2ZWxzXG4gICAgICBmb3IgKGxldCBhID0gMDsgYSA8IGdlb21ldHJ5LmNvb3JkaW5hdGVzLmxlbmd0aDsgYSsrKSB7XG4gICAgICAgIGZvciAobGV0IGIgPSAwOyBiIDwgZ2VvbWV0cnkuY29vcmRpbmF0ZXNbYV0ubGVuZ3RoOyBiKyspIHtcbiAgICAgICAgICBoYW5kbGVzID0gaGFuZGxlcy5jb25jYXQoXG4gICAgICAgICAgICBnZXRFZGl0SGFuZGxlc0ZvckNvb3JkaW5hdGVzKFxuICAgICAgICAgICAgICBnZW9tZXRyeS5jb29yZGluYXRlc1thXVtiXSxcbiAgICAgICAgICAgICAgW2EsIGJdLFxuICAgICAgICAgICAgICBmZWF0dXJlSW5kZXgsXG4gICAgICAgICAgICAgIGVkaXRIYW5kbGVUeXBlXG4gICAgICAgICAgICApXG4gICAgICAgICAgKTtcbiAgICAgICAgICAvLyBEb24ndCByZXBlYXQgdGhlIGZpcnN0L2xhc3QgaGFuZGxlIGZvciBQb2x5Z29uc1xuICAgICAgICAgIGhhbmRsZXMgPSBoYW5kbGVzLnNsaWNlKDAsIC0xKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IEVycm9yKGBVbmhhbmRsZWQgZ2VvbWV0cnkgdHlwZTogJHtnZW9tZXRyeS50eXBlfWApO1xuICB9XG5cbiAgcmV0dXJuIGhhbmRsZXM7XG59XG5cbmZ1bmN0aW9uIGdldEVkaXRIYW5kbGVzRm9yQ29vcmRpbmF0ZXMoXG4gIGNvb3JkaW5hdGVzOiBhbnlbXSxcbiAgcG9zaXRpb25JbmRleFByZWZpeDogbnVtYmVyW10sXG4gIGZlYXR1cmVJbmRleDogbnVtYmVyLFxuICBlZGl0SGFuZGxlVHlwZTogRWRpdEhhbmRsZVR5cGUgPSAnZXhpc3RpbmcnXG4pOiBFZGl0SGFuZGxlW10ge1xuICBjb25zdCBlZGl0SGFuZGxlcyA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGNvb3JkaW5hdGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgcG9zaXRpb24gPSBjb29yZGluYXRlc1tpXTtcbiAgICBlZGl0SGFuZGxlcy5wdXNoKHtcbiAgICAgIHBvc2l0aW9uLFxuICAgICAgcG9zaXRpb25JbmRleGVzOiBbLi4ucG9zaXRpb25JbmRleFByZWZpeCwgaV0sXG4gICAgICBmZWF0dXJlSW5kZXgsXG4gICAgICB0eXBlOiBlZGl0SGFuZGxlVHlwZVxuICAgIH0pO1xuICB9XG4gIHJldHVybiBlZGl0SGFuZGxlcztcbn1cbiJdfQ==