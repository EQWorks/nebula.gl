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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DEFAULT_EDIT_HANDLES = []; // Main interface for `EditMode`s that edit GeoJSON

class BaseGeoJsonEditMode {
  constructor() {
    _defineProperty(this, "_clickSequence", []);

    _defineProperty(this, "_tentativeFeature", void 0);
  }

  getGuides(props) {
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

  getSelectedFeature(props) {
    if (props.selectedIndexes.length === 1) {
      return props.data.features[props.selectedIndexes[0]];
    }

    return null;
  }

  getSelectedGeometry(props) {
    var feature = this.getSelectedFeature(props);

    if (feature) {
      return feature.geometry;
    }

    return null;
  }

  getSelectedFeaturesAsFeatureCollection(props) {
    var features = props.data.features;
    var selectedFeatures = props.selectedIndexes.map(function (selectedIndex) {
      return features[selectedIndex];
    });
    return {
      type: 'FeatureCollection',
      features: selectedFeatures
    };
  }

  getClickSequence() {
    return this._clickSequence;
  }

  resetClickSequence() {
    this._clickSequence = [];
  }

  getTentativeFeature() {
    return this._tentativeFeature;
  } // TODO edit-modes: delete me once mode handlers do getEditHandles lazily


  _setTentativeFeature(tentativeFeature) {
    if (tentativeFeature) {
      tentativeFeature.properties = _objectSpread({}, tentativeFeature.properties || {}, {
        guideType: 'tentative'
      });
    }

    this._tentativeFeature = tentativeFeature;
  }

  _refreshCursor(props) {
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


  getEditHandlesAdapter(picks, mapCoords, props) {
    return DEFAULT_EDIT_HANDLES;
  }

  getCursorAdapter(props) {
    return null;
  }

  isSelectionPicked(picks, props) {
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

  getAddFeatureAction(geometry, features) {
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

  getAddManyFeaturesAction(_ref2, features) {
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

  getAddFeatureOrBooleanPolygonAction(geometry, props) {
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

  handleClick(event, props) {
    var editAction = this.handleClickAdapter(event, props);

    if (editAction) {
      props.onEdit(editAction);
    }
  }

  handlePointerMove(event, props) {
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

  handleStartDragging(event, props) {
    var editAction = this.handleStartDraggingAdapter(event, props);

    if (editAction) {
      props.onEdit(editAction);
    }
  }

  handleStopDragging(event, props) {
    var editAction = this.handleStopDraggingAdapter(event, props);

    if (editAction) {
      props.onEdit(editAction);
    }
  } // TODO edit-modes: delete these adapters once all ModeHandler implementations don't use them


  handleClickAdapter(event, props) {
    this._clickSequence.push(event.mapCoords);

    return null;
  }

  handlePointerMoveAdapter(event, props) {
    return {
      editAction: null,
      cancelMapPan: false
    };
  }

  handleStartDraggingAdapter(event, props) {
    return null;
  }

  handleStopDraggingAdapter(event, props) {
    return null;
  }

}

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvZ2VvanNvbi1lZGl0LW1vZGUuanMiXSwibmFtZXMiOlsiREVGQVVMVF9FRElUX0hBTkRMRVMiLCJCYXNlR2VvSnNvbkVkaXRNb2RlIiwiZ2V0R3VpZGVzIiwicHJvcHMiLCJsYXN0UG9pbnRlck1vdmVFdmVudCIsInBpY2tzIiwibWFwQ29vcmRzIiwiZWRpdEhhbmRsZXMiLCJnZXRFZGl0SGFuZGxlc0FkYXB0ZXIiLCJ0ZW50YXRpdmVGZWF0dXJlIiwiZ2V0VGVudGF0aXZlRmVhdHVyZSIsInRlbnRhdGl2ZUZlYXR1cmVzIiwiZWRpdEhhbmRsZUZlYXR1cmVzIiwibWFwIiwiaGFuZGxlIiwidHlwZSIsInByb3BlcnRpZXMiLCJndWlkZVR5cGUiLCJlZGl0SGFuZGxlVHlwZSIsImZlYXR1cmVJbmRleCIsInBvc2l0aW9uSW5kZXhlcyIsImdlb21ldHJ5IiwiY29vcmRpbmF0ZXMiLCJwb3NpdGlvbiIsImZlYXR1cmVzIiwiZ2V0U2VsZWN0ZWRGZWF0dXJlIiwic2VsZWN0ZWRJbmRleGVzIiwibGVuZ3RoIiwiZGF0YSIsImdldFNlbGVjdGVkR2VvbWV0cnkiLCJmZWF0dXJlIiwiZ2V0U2VsZWN0ZWRGZWF0dXJlc0FzRmVhdHVyZUNvbGxlY3Rpb24iLCJzZWxlY3RlZEZlYXR1cmVzIiwic2VsZWN0ZWRJbmRleCIsImdldENsaWNrU2VxdWVuY2UiLCJfY2xpY2tTZXF1ZW5jZSIsInJlc2V0Q2xpY2tTZXF1ZW5jZSIsIl90ZW50YXRpdmVGZWF0dXJlIiwiX3NldFRlbnRhdGl2ZUZlYXR1cmUiLCJfcmVmcmVzaEN1cnNvciIsImN1cnJlbnRDdXJzb3IiLCJjdXJzb3IiLCJ1cGRhdGVkQ3Vyc29yIiwiZ2V0Q3Vyc29yQWRhcHRlciIsIm9uVXBkYXRlQ3Vyc29yIiwiaXNTZWxlY3Rpb25QaWNrZWQiLCJwaWNrZWRGZWF0dXJlcyIsImdldE5vbkd1aWRlUGlja3MiLCJpbmRleCIsInBpY2tlZEhhbmRsZXMiLCJnZXRQaWNrZWRFZGl0SGFuZGxlcyIsInBpY2tlZEluZGV4ZXMiLCJTZXQiLCJzb21lIiwiaGFzIiwiZ2V0QWRkRmVhdHVyZUFjdGlvbiIsImdlb21ldHJ5QXNBbnkiLCJ1cGRhdGVkRGF0YSIsIkltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uIiwiYWRkRmVhdHVyZSIsImdldE9iamVjdCIsImVkaXRUeXBlIiwiZWRpdENvbnRleHQiLCJmZWF0dXJlSW5kZXhlcyIsImdldEFkZE1hbnlGZWF0dXJlc0FjdGlvbiIsImZlYXR1cmVzVG9BZGQiLCJpbml0aWFsSW5kZXgiLCJ1cGRhdGVkSW5kZXhlcyIsInB1c2giLCJnZXRBZGRGZWF0dXJlT3JCb29sZWFuUG9seWdvbkFjdGlvbiIsInNlbGVjdGVkRmVhdHVyZSIsIm1vZGVDb25maWciLCJib29sZWFuT3BlcmF0aW9uIiwiY29uc29sZSIsIndhcm4iLCJ1cGRhdGVkR2VvbWV0cnkiLCJyZXBsYWNlR2VvbWV0cnkiLCJlZGl0QWN0aW9uIiwiaGFuZGxlQ2xpY2siLCJldmVudCIsImhhbmRsZUNsaWNrQWRhcHRlciIsIm9uRWRpdCIsImhhbmRsZVBvaW50ZXJNb3ZlIiwiaGFuZGxlUG9pbnRlck1vdmVBZGFwdGVyIiwiY2FuY2VsTWFwUGFuIiwic291cmNlRXZlbnQiLCJzdG9wUHJvcGFnYXRpb24iLCJoYW5kbGVTdGFydERyYWdnaW5nIiwiaGFuZGxlU3RhcnREcmFnZ2luZ0FkYXB0ZXIiLCJoYW5kbGVTdG9wRHJhZ2dpbmciLCJoYW5kbGVTdG9wRHJhZ2dpbmdBZGFwdGVyIiwiZ2V0UGlja2VkRWRpdEhhbmRsZSIsImhhbmRsZXMiLCJmaWx0ZXIiLCJwaWNrIiwiaXNHdWlkZSIsIm9iamVjdCIsImdldFBpY2tlZEV4aXN0aW5nRWRpdEhhbmRsZSIsImZpbmQiLCJoIiwiZ2V0UGlja2VkSW50ZXJtZWRpYXRlRWRpdEhhbmRsZSIsImdldEludGVybWVkaWF0ZVBvc2l0aW9uIiwicG9zaXRpb24xIiwicG9zaXRpb24yIiwiaW50ZXJtZWRpYXRlUG9zaXRpb24iLCJnZXRFZGl0SGFuZGxlc0Zvckdlb21ldHJ5IiwiY29uY2F0IiwiZ2V0RWRpdEhhbmRsZXNGb3JDb29yZGluYXRlcyIsImEiLCJzbGljZSIsImIiLCJFcnJvciIsInBvc2l0aW9uSW5kZXhQcmVmaXgiLCJpIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUVBOztBQUNBOztBQUNBOztBQW9CQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7OztBQWNBLElBQU1BLG9CQUFrQyxHQUFHLEVBQTNDLEMsQ0FFQTs7QUFHTyxNQUFNQyxtQkFBTixDQUFvRjtBQUFBO0FBQUEsNENBQzVELEVBRDREOztBQUFBO0FBQUE7O0FBSXpGQyxFQUFBQSxTQUFTLENBQUNDLEtBQUQsRUFBeUQ7QUFBQSxRQUN4REMsb0JBRHdELEdBQy9CRCxLQUQrQixDQUN4REMsb0JBRHdEO0FBRWhFLFFBQU1DLEtBQUssR0FBR0Qsb0JBQW9CLElBQUlBLG9CQUFvQixDQUFDQyxLQUEzRDtBQUNBLFFBQU1DLFNBQVMsR0FBR0Ysb0JBQW9CLElBQUlBLG9CQUFvQixDQUFDRSxTQUEvRDtBQUNBLFFBQU1DLFdBQVcsR0FBRyxLQUFLQyxxQkFBTCxDQUEyQkgsS0FBM0IsRUFBa0NDLFNBQWxDLEVBQTZDSCxLQUE3QyxDQUFwQjtBQUVBLFFBQU1NLGdCQUFnQixHQUFHLEtBQUtDLG1CQUFMLEVBQXpCO0FBQ0EsUUFBTUMsaUJBQTRCLEdBQUdGLGdCQUFnQixHQUFHLENBQUNBLGdCQUFELENBQUgsR0FBd0IsRUFBN0U7QUFDQSxRQUFNRyxrQkFBc0MsR0FBR0wsV0FBVyxDQUFDTSxHQUFaLENBQWdCLFVBQUFDLE1BQU07QUFBQSxhQUFLO0FBQ3hFQyxRQUFBQSxJQUFJLEVBQUUsU0FEa0U7QUFFeEVDLFFBQUFBLFVBQVUsRUFBRTtBQUNWQyxVQUFBQSxTQUFTLEVBQUUsWUFERDtBQUVWQyxVQUFBQSxjQUFjLEVBQUVKLE1BQU0sQ0FBQ0MsSUFGYjtBQUdWSSxVQUFBQSxZQUFZLEVBQUVMLE1BQU0sQ0FBQ0ssWUFIWDtBQUlWQyxVQUFBQSxlQUFlLEVBQUVOLE1BQU0sQ0FBQ007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QUdmOUYsTUFBQUEsWUFBWSxFQUFaQSxZQUhlO0FBSWZKLE1BQUFBLElBQUksRUFBRUc7QUFKUyxLQUFqQjtBQU1EOztBQUNELFNBQU9YLFdBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbmltcG9ydCB0dXJmVW5pb24gZnJvbSAnQHR1cmYvdW5pb24nO1xuaW1wb3J0IHR1cmZEaWZmZXJlbmNlIGZyb20gJ0B0dXJmL2RpZmZlcmVuY2UnO1xuaW1wb3J0IHR1cmZJbnRlcnNlY3QgZnJvbSAnQHR1cmYvaW50ZXJzZWN0JztcblxuaW1wb3J0IHR5cGUge1xuICBFZGl0QWN0aW9uLFxuICBDbGlja0V2ZW50LFxuICBQb2ludGVyTW92ZUV2ZW50LFxuICBTdGFydERyYWdnaW5nRXZlbnQsXG4gIFN0b3BEcmFnZ2luZ0V2ZW50LFxuICBQaWNrLFxuICBNb2RlUHJvcHNcbn0gZnJvbSAnLi4vdHlwZXMuanMnO1xuaW1wb3J0IHR5cGUge1xuICBGZWF0dXJlQ29sbGVjdGlvbixcbiAgRmVhdHVyZSxcbiAgRmVhdHVyZU9mLFxuICBQb2ludCxcbiAgUG9seWdvbixcbiAgR2VvbWV0cnksXG4gIFBvc2l0aW9uXG59IGZyb20gJy4uL2dlb2pzb24tdHlwZXMuanMnO1xuaW1wb3J0IHsgRWRpdE1vZGUgfSBmcm9tICcuL2VkaXQtbW9kZS5qcyc7XG5cbmltcG9ydCB7IEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uIH0gZnJvbSAnLi9pbW11dGFibGUtZmVhdHVyZS1jb2xsZWN0aW9uLmpzJztcblxuZXhwb3J0IHR5cGUgRWRpdEhhbmRsZVR5cGUgPSAnZXhpc3RpbmcnIHwgJ2ludGVybWVkaWF0ZScgfCAnc25hcCc7XG5cbi8vIFRPRE8gZWRpdC1tb2RlczogLSBDaGFuZ2UgdGhpcyB0byBqdXN0IGJlIGEgR29lSlNPTiBpbnN0ZWFkXG5leHBvcnQgdHlwZSBFZGl0SGFuZGxlID0ge1xuICBwb3NpdGlvbjogUG9zaXRpb24sXG4gIHBvc2l0aW9uSW5kZXhlczogbnVtYmVyW10sXG4gIGZlYXR1cmVJbmRleDogbnVtYmVyLFxuICB0eXBlOiBFZGl0SGFuZGxlVHlwZVxufTtcblxuZXhwb3J0IHR5cGUgR2VvSnNvbkVkaXRBY3Rpb24gPSBFZGl0QWN0aW9uPEZlYXR1cmVDb2xsZWN0aW9uPjtcblxuY29uc3QgREVGQVVMVF9FRElUX0hBTkRMRVM6IEVkaXRIYW5kbGVbXSA9IFtdO1xuXG4vLyBNYWluIGludGVyZmFjZSBmb3IgYEVkaXRNb2RlYHMgdGhhdCBlZGl0IEdlb0pTT05cbmV4cG9ydCB0eXBlIEdlb0pzb25FZGl0TW9kZSA9IEVkaXRNb2RlPEZlYXR1cmVDb2xsZWN0aW9uLCBGZWF0dXJlQ29sbGVjdGlvbj47XG5cbmV4cG9ydCBjbGFzcyBCYXNlR2VvSnNvbkVkaXRNb2RlIGltcGxlbWVudHMgRWRpdE1vZGU8RmVhdHVyZUNvbGxlY3Rpb24sIEZlYXR1cmVDb2xsZWN0aW9uPiB7XG4gIF9jbGlja1NlcXVlbmNlOiBQb3NpdGlvbltdID0gW107XG4gIF90ZW50YXRpdmVGZWF0dXJlOiA/RmVhdHVyZTtcblxuICBnZXRHdWlkZXMocHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pOiBGZWF0dXJlQ29sbGVjdGlvbiB7XG4gICAgY29uc3QgeyBsYXN0UG9pbnRlck1vdmVFdmVudCB9ID0gcHJvcHM7XG4gICAgY29uc3QgcGlja3MgPSBsYXN0UG9pbnRlck1vdmVFdmVudCAmJiBsYXN0UG9pbnRlck1vdmVFdmVudC5waWNrcztcbiAgICBjb25zdCBtYXBDb29yZHMgPSBsYXN0UG9pbnRlck1vdmVFdmVudCAmJiBsYXN0UG9pbnRlck1vdmVFdmVudC5tYXBDb29yZHM7XG4gICAgY29uc3QgZWRpdEhhbmRsZXMgPSB0aGlzLmdldEVkaXRIYW5kbGVzQWRhcHRlcihwaWNrcywgbWFwQ29vcmRzLCBwcm9wcyk7XG5cbiAgICBjb25zdCB0ZW50YXRpdmVGZWF0dXJlID0gdGhpcy5nZXRUZW50YXRpdmVGZWF0dXJlKCk7XG4gICAgY29uc3QgdGVudGF0aXZlRmVhdHVyZXM6IEZlYXR1cmVbXSA9IHRlbnRhdGl2ZUZlYXR1cmUgPyBbdGVudGF0aXZlRmVhdHVyZV0gOiBbXTtcbiAgICBjb25zdCBlZGl0SGFuZGxlRmVhdHVyZXM6IEZlYXR1cmVPZjxQb2ludD5bXSA9IGVkaXRIYW5kbGVzLm1hcChoYW5kbGUgPT4gKHtcbiAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgZ3VpZGVUeXBlOiAnZWRpdEhhbmRsZScsXG4gICAgICAgIGVkaXRIYW5kbGVUeXBlOiBoYW5kbGUudHlwZSxcbiAgICAgICAgZmVhdHVyZUluZGV4OiBoYW5kbGUuZmVhdHVyZUluZGV4LFxuICAgICAgICBwb3NpdGlvbkluZGV4ZXM6IGhhbmRsZS5wb3NpdGlvbkluZGV4ZXNcbiAgICAgIH0sXG4gICAgICBnZW9tZXRyeToge1xuICAgICAgICB0eXBlOiAnUG9pbnQnLFxuICAgICAgICBjb29yZGluYXRlczogaGFuZGxlLnBvc2l0aW9uXG4gICAgICB9XG4gICAgfSkpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6ICdGZWF0dXJlQ29sbGVjdGlvbicsXG4gICAgICBmZWF0dXJlczogWy4uLnRlbnRhdGl2ZUZlYXR1cmVzLCAuLi5lZGl0SGFuZGxlRmVhdHVyZXNdXG4gICAgfTtcbiAgfVxuXG4gIGdldFNlbGVjdGVkRmVhdHVyZShwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPik6ID9GZWF0dXJlIHtcbiAgICBpZiAocHJvcHMuc2VsZWN0ZWRJbmRleGVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgcmV0dXJuIHByb3BzLmRhdGEuZmVhdHVyZXNbcHJvcHMuc2VsZWN0ZWRJbmRleGVzWzBdXTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBnZXRTZWxlY3RlZEdlb21ldHJ5KHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KTogP0dlb21ldHJ5IHtcbiAgICBjb25zdCBmZWF0dXJlID0gdGhpcy5nZXRTZWxlY3RlZEZlYXR1cmUocHJvcHMpO1xuICAgIGlmIChmZWF0dXJlKSB7XG4gICAgICByZXR1cm4gZmVhdHVyZS5nZW9tZXRyeTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBnZXRTZWxlY3RlZEZlYXR1cmVzQXNGZWF0dXJlQ29sbGVjdGlvbihwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPik6IEZlYXR1cmVDb2xsZWN0aW9uIHtcbiAgICBjb25zdCB7IGZlYXR1cmVzIH0gPSBwcm9wcy5kYXRhO1xuICAgIGNvbnN0IHNlbGVjdGVkRmVhdHVyZXMgPSBwcm9wcy5zZWxlY3RlZEluZGV4ZXMubWFwKHNlbGVjdGVkSW5kZXggPT4gZmVhdHVyZXNbc2VsZWN0ZWRJbmRleF0pO1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiAnRmVhdHVyZUNvbGxlY3Rpb24nLFxuICAgICAgZmVhdHVyZXM6IHNlbGVjdGVkRmVhdHVyZXNcbiAgICB9O1xuICB9XG5cbiAgZ2V0Q2xpY2tTZXF1ZW5jZSgpOiBQb3NpdGlvbltdIHtcbiAgICByZXR1cm4gdGhpcy5fY2xpY2tTZXF1ZW5jZTtcbiAgfVxuXG4gIHJlc2V0Q2xpY2tTZXF1ZW5jZSgpOiB2b2lkIHtcbiAgICB0aGlzLl9jbGlja1NlcXVlbmNlID0gW107XG4gIH1cblxuICBnZXRUZW50YXRpdmVGZWF0dXJlKCk6ID9GZWF0dXJlIHtcbiAgICByZXR1cm4gdGhpcy5fdGVudGF0aXZlRmVhdHVyZTtcbiAgfVxuXG4gIC8vIFRPRE8gZWRpdC1tb2RlczogZGVsZXRlIG1lIG9uY2UgbW9kZSBoYW5kbGVycyBkbyBnZXRFZGl0SGFuZGxlcyBsYXppbHlcbiAgX3NldFRlbnRhdGl2ZUZlYXR1cmUodGVudGF0aXZlRmVhdHVyZTogP0ZlYXR1cmUpOiB2b2lkIHtcbiAgICBpZiAodGVudGF0aXZlRmVhdHVyZSkge1xuICAgICAgdGVudGF0aXZlRmVhdHVyZS5wcm9wZXJ0aWVzID0ge1xuICAgICAgICAuLi4odGVudGF0aXZlRmVhdHVyZS5wcm9wZXJ0aWVzIHx8IHt9KSxcbiAgICAgICAgZ3VpZGVUeXBlOiAndGVudGF0aXZlJ1xuICAgICAgfTtcbiAgICB9XG4gICAgdGhpcy5fdGVudGF0aXZlRmVhdHVyZSA9IHRlbnRhdGl2ZUZlYXR1cmU7XG4gIH1cblxuICBfcmVmcmVzaEN1cnNvcihwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPik6IHZvaWQge1xuICAgIGNvbnN0IGN1cnJlbnRDdXJzb3IgPSBwcm9wcy5jdXJzb3I7XG4gICAgY29uc3QgdXBkYXRlZEN1cnNvciA9IHRoaXMuZ2V0Q3Vyc29yQWRhcHRlcihwcm9wcyk7XG5cbiAgICBpZiAoY3VycmVudEN1cnNvciAhPT0gdXBkYXRlZEN1cnNvcikge1xuICAgICAgcHJvcHMub25VcGRhdGVDdXJzb3IodXBkYXRlZEN1cnNvcik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBmbGF0IGFycmF5IG9mIHBvc2l0aW9ucyBmb3IgdGhlIGdpdmVuIGZlYXR1cmUgYWxvbmcgd2l0aCB0aGVpciBpbmRleGVzIGludG8gdGhlIGZlYXR1cmUncyBnZW9tZXRyeSdzIGNvb3JkaW5hdGVzLlxuICAgKlxuICAgKiBAcGFyYW0gZmVhdHVyZUluZGV4IFRoZSBpbmRleCBvZiB0aGUgZmVhdHVyZSB0byBnZXQgZWRpdCBoYW5kbGVzXG4gICAqL1xuICBnZXRFZGl0SGFuZGxlc0FkYXB0ZXIoXG4gICAgcGlja3M6ID9BcnJheTxPYmplY3Q+LFxuICAgIG1hcENvb3JkczogP1Bvc2l0aW9uLFxuICAgIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+XG4gICk6IEVkaXRIYW5kbGVbXSB7XG4gICAgcmV0dXJuIERFRkFVTFRfRURJVF9IQU5ETEVTO1xuICB9XG5cbiAgZ2V0Q3Vyc29yQWRhcHRlcihwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPik6ID9zdHJpbmcge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgaXNTZWxlY3Rpb25QaWNrZWQocGlja3M6IFBpY2tbXSwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pOiBib29sZWFuIHtcbiAgICBpZiAoIXBpY2tzLmxlbmd0aCkgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IHBpY2tlZEZlYXR1cmVzID0gZ2V0Tm9uR3VpZGVQaWNrcyhwaWNrcykubWFwKCh7IGluZGV4IH0pID0+IGluZGV4KTtcbiAgICBjb25zdCBwaWNrZWRIYW5kbGVzID0gZ2V0UGlja2VkRWRpdEhhbmRsZXMocGlja3MpLm1hcChoYW5kbGUgPT4gaGFuZGxlLmZlYXR1cmVJbmRleCk7XG4gICAgY29uc3QgcGlja2VkSW5kZXhlcyA9IG5ldyBTZXQoWy4uLnBpY2tlZEZlYXR1cmVzLCAuLi5waWNrZWRIYW5kbGVzXSk7XG4gICAgcmV0dXJuIHByb3BzLnNlbGVjdGVkSW5kZXhlcy5zb21lKGluZGV4ID0+IHBpY2tlZEluZGV4ZXMuaGFzKGluZGV4KSk7XG4gIH1cblxuICBnZXRBZGRGZWF0dXJlQWN0aW9uKGdlb21ldHJ5OiBHZW9tZXRyeSwgZmVhdHVyZXM6IEZlYXR1cmVDb2xsZWN0aW9uKTogR2VvSnNvbkVkaXRBY3Rpb24ge1xuICAgIC8vIFVuc3VyZSB3aHkgZmxvdyBjYW4ndCBkZWFsIHdpdGggR2VvbWV0cnkgdHlwZSwgYnV0IHRoZXJlIEkgZml4ZWQgaXRcbiAgICBjb25zdCBnZW9tZXRyeUFzQW55OiBhbnkgPSBnZW9tZXRyeTtcblxuICAgIGNvbnN0IHVwZGF0ZWREYXRhID0gbmV3IEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uKGZlYXR1cmVzKVxuICAgICAgLmFkZEZlYXR1cmUoe1xuICAgICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICAgIHByb3BlcnRpZXM6IHt9LFxuICAgICAgICBnZW9tZXRyeTogZ2VvbWV0cnlBc0FueVxuICAgICAgfSlcbiAgICAgIC5nZXRPYmplY3QoKTtcblxuICAgIHJldHVybiB7XG4gICAgICB1cGRhdGVkRGF0YSxcbiAgICAgIGVkaXRUeXBlOiAnYWRkRmVhdHVyZScsXG4gICAgICBlZGl0Q29udGV4dDoge1xuICAgICAgICBmZWF0dXJlSW5kZXhlczogW3VwZGF0ZWREYXRhLmZlYXR1cmVzLmxlbmd0aCAtIDFdXG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIGdldEFkZE1hbnlGZWF0dXJlc0FjdGlvbihcbiAgICB7IGZlYXR1cmVzOiBmZWF0dXJlc1RvQWRkIH06IEZlYXR1cmVDb2xsZWN0aW9uLFxuICAgIGZlYXR1cmVzOiBGZWF0dXJlQ29sbGVjdGlvblxuICApOiBHZW9Kc29uRWRpdEFjdGlvbiB7XG4gICAgbGV0IHVwZGF0ZWREYXRhID0gbmV3IEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uKGZlYXR1cmVzKTtcbiAgICBjb25zdCBpbml0aWFsSW5kZXggPSB1cGRhdGVkRGF0YS5nZXRPYmplY3QoKS5mZWF0dXJlcy5sZW5ndGg7XG4gICAgY29uc3QgdXBkYXRlZEluZGV4ZXMgPSBbXTtcbiAgICBmb3IgKGNvbnN0IGZlYXR1cmUgb2YgZmVhdHVyZXNUb0FkZCkge1xuICAgICAgY29uc3QgeyBwcm9wZXJ0aWVzLCBnZW9tZXRyeSB9ID0gZmVhdHVyZTtcbiAgICAgIGNvbnN0IGdlb21ldHJ5QXNBbnk6IGFueSA9IGdlb21ldHJ5O1xuICAgICAgdXBkYXRlZERhdGEgPSB1cGRhdGVkRGF0YS5hZGRGZWF0dXJlKHtcbiAgICAgICAgdHlwZTogJ0ZlYXR1cmUnLFxuICAgICAgICBwcm9wZXJ0aWVzLFxuICAgICAgICBnZW9tZXRyeTogZ2VvbWV0cnlBc0FueVxuICAgICAgfSk7XG4gICAgICB1cGRhdGVkSW5kZXhlcy5wdXNoKGluaXRpYWxJbmRleCArIHVwZGF0ZWRJbmRleGVzLmxlbmd0aCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHVwZGF0ZWREYXRhOiB1cGRhdGVkRGF0YS5nZXRPYmplY3QoKSxcbiAgICAgIGVkaXRUeXBlOiAnYWRkRmVhdHVyZScsXG4gICAgICBlZGl0Q29udGV4dDoge1xuICAgICAgICBmZWF0dXJlSW5kZXhlczogdXBkYXRlZEluZGV4ZXNcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgZ2V0QWRkRmVhdHVyZU9yQm9vbGVhblBvbHlnb25BY3Rpb24oXG4gICAgZ2VvbWV0cnk6IFBvbHlnb24sXG4gICAgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj5cbiAgKTogP0dlb0pzb25FZGl0QWN0aW9uIHtcbiAgICBjb25zdCBzZWxlY3RlZEZlYXR1cmUgPSB0aGlzLmdldFNlbGVjdGVkRmVhdHVyZShwcm9wcyk7XG4gICAgY29uc3QgeyBtb2RlQ29uZmlnIH0gPSBwcm9wcztcbiAgICBpZiAobW9kZUNvbmZpZyAmJiBtb2RlQ29uZmlnLmJvb2xlYW5PcGVyYXRpb24pIHtcbiAgICAgIGlmIChcbiAgICAgICAgIXNlbGVjdGVkRmVhdHVyZSB8fFxuICAgICAgICAoc2VsZWN0ZWRGZWF0dXJlLmdlb21ldHJ5LnR5cGUgIT09ICdQb2x5Z29uJyAmJlxuICAgICAgICAgIHNlbGVjdGVkRmVhdHVyZS5nZW9tZXRyeS50eXBlICE9PSAnTXVsdGlQb2x5Z29uJylcbiAgICAgICkge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZSxuby11bmRlZlxuICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgJ2Jvb2xlYW5PcGVyYXRpb24gb25seSBzdXBwb3J0ZWQgZm9yIHNpbmdsZSBQb2x5Z29uIG9yIE11bHRpUG9seWdvbiBzZWxlY3Rpb24nXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBmZWF0dXJlID0ge1xuICAgICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICAgIGdlb21ldHJ5XG4gICAgICB9O1xuXG4gICAgICBsZXQgdXBkYXRlZEdlb21ldHJ5O1xuICAgICAgaWYgKG1vZGVDb25maWcuYm9vbGVhbk9wZXJhdGlvbiA9PT0gJ3VuaW9uJykge1xuICAgICAgICB1cGRhdGVkR2VvbWV0cnkgPSB0dXJmVW5pb24oc2VsZWN0ZWRGZWF0dXJlLCBmZWF0dXJlKTtcbiAgICAgIH0gZWxzZSBpZiAobW9kZUNvbmZpZy5ib29sZWFuT3BlcmF0aW9uID09PSAnZGlmZmVyZW5jZScpIHtcbiAgICAgICAgdXBkYXRlZEdlb21ldHJ5ID0gdHVyZkRpZmZlcmVuY2Uoc2VsZWN0ZWRGZWF0dXJlLCBmZWF0dXJlKTtcbiAgICAgIH0gZWxzZSBpZiAobW9kZUNvbmZpZy5ib29sZWFuT3BlcmF0aW9uID09PSAnaW50ZXJzZWN0aW9uJykge1xuICAgICAgICB1cGRhdGVkR2VvbWV0cnkgPSB0dXJmSW50ZXJzZWN0KHNlbGVjdGVkRmVhdHVyZSwgZmVhdHVyZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZSxuby11bmRlZlxuICAgICAgICBjb25zb2xlLndhcm4oYEludmFsaWQgYm9vbGVhbk9wZXJhdGlvbiAke21vZGVDb25maWcuYm9vbGVhbk9wZXJhdGlvbn1gKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIGlmICghdXBkYXRlZEdlb21ldHJ5KSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlLG5vLXVuZGVmXG4gICAgICAgIGNvbnNvbGUud2FybignQ2FuY2VsaW5nIGVkaXQuIEJvb2xlYW4gb3BlcmF0aW9uIGVyYXNlZCBlbnRpcmUgcG9seWdvbi4nKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGZlYXR1cmVJbmRleCA9IHByb3BzLnNlbGVjdGVkSW5kZXhlc1swXTtcblxuICAgICAgY29uc3QgdXBkYXRlZERhdGEgPSBuZXcgSW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24ocHJvcHMuZGF0YSlcbiAgICAgICAgLnJlcGxhY2VHZW9tZXRyeShmZWF0dXJlSW5kZXgsIHVwZGF0ZWRHZW9tZXRyeS5nZW9tZXRyeSlcbiAgICAgICAgLmdldE9iamVjdCgpO1xuXG4gICAgICBjb25zdCBlZGl0QWN0aW9uOiBHZW9Kc29uRWRpdEFjdGlvbiA9IHtcbiAgICAgICAgdXBkYXRlZERhdGEsXG4gICAgICAgIGVkaXRUeXBlOiAndW5pb25HZW9tZXRyeScsXG4gICAgICAgIGVkaXRDb250ZXh0OiB7XG4gICAgICAgICAgZmVhdHVyZUluZGV4ZXM6IFtmZWF0dXJlSW5kZXhdXG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBlZGl0QWN0aW9uO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5nZXRBZGRGZWF0dXJlQWN0aW9uKGdlb21ldHJ5LCBwcm9wcy5kYXRhKTtcbiAgfVxuXG4gIGhhbmRsZUNsaWNrKGV2ZW50OiBDbGlja0V2ZW50LCBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPik6IHZvaWQge1xuICAgIGNvbnN0IGVkaXRBY3Rpb24gPSB0aGlzLmhhbmRsZUNsaWNrQWRhcHRlcihldmVudCwgcHJvcHMpO1xuXG4gICAgaWYgKGVkaXRBY3Rpb24pIHtcbiAgICAgIHByb3BzLm9uRWRpdChlZGl0QWN0aW9uKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVQb2ludGVyTW92ZShldmVudDogUG9pbnRlck1vdmVFdmVudCwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pOiB2b2lkIHtcbiAgICBjb25zdCB7IGVkaXRBY3Rpb24sIGNhbmNlbE1hcFBhbiB9ID0gdGhpcy5oYW5kbGVQb2ludGVyTW92ZUFkYXB0ZXIoZXZlbnQsIHByb3BzKTtcblxuICAgIGlmIChjYW5jZWxNYXBQYW4pIHtcbiAgICAgIC8vIFRPRE86IGlzIHRoZXJlIGEgbGVzcyBoYWNreSB3YXkgdG8gcHJldmVudCBtYXAgcGFubmluZz9cbiAgICAgIC8vIFN0b3AgcHJvcGFnYXRpb24gdG8gcHJldmVudCBtYXAgcGFubmluZyB3aGlsZSBkcmFnZ2luZyBhbiBlZGl0IGhhbmRsZVxuICAgICAgZXZlbnQuc291cmNlRXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfVxuXG4gICAgdGhpcy5fcmVmcmVzaEN1cnNvcihwcm9wcyk7XG4gICAgaWYgKGVkaXRBY3Rpb24pIHtcbiAgICAgIHByb3BzLm9uRWRpdChlZGl0QWN0aW9uKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVTdGFydERyYWdnaW5nKGV2ZW50OiBTdGFydERyYWdnaW5nRXZlbnQsIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KTogdm9pZCB7XG4gICAgY29uc3QgZWRpdEFjdGlvbiA9IHRoaXMuaGFuZGxlU3RhcnREcmFnZ2luZ0FkYXB0ZXIoZXZlbnQsIHByb3BzKTtcblxuICAgIGlmIChlZGl0QWN0aW9uKSB7XG4gICAgICBwcm9wcy5vbkVkaXQoZWRpdEFjdGlvbik7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlU3RvcERyYWdnaW5nKGV2ZW50OiBTdG9wRHJhZ2dpbmdFdmVudCwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pOiB2b2lkIHtcbiAgICBjb25zdCBlZGl0QWN0aW9uID0gdGhpcy5oYW5kbGVTdG9wRHJhZ2dpbmdBZGFwdGVyKGV2ZW50LCBwcm9wcyk7XG5cbiAgICBpZiAoZWRpdEFjdGlvbikge1xuICAgICAgcHJvcHMub25FZGl0KGVkaXRBY3Rpb24pO1xuICAgIH1cbiAgfVxuXG4gIC8vIFRPRE8gZWRpdC1tb2RlczogZGVsZXRlIHRoZXNlIGFkYXB0ZXJzIG9uY2UgYWxsIE1vZGVIYW5kbGVyIGltcGxlbWVudGF0aW9ucyBkb24ndCB1c2UgdGhlbVxuICBoYW5kbGVDbGlja0FkYXB0ZXIoZXZlbnQ6IENsaWNrRXZlbnQsIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KTogP0dlb0pzb25FZGl0QWN0aW9uIHtcbiAgICB0aGlzLl9jbGlja1NlcXVlbmNlLnB1c2goZXZlbnQubWFwQ29vcmRzKTtcblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgaGFuZGxlUG9pbnRlck1vdmVBZGFwdGVyKFxuICAgIGV2ZW50OiBQb2ludGVyTW92ZUV2ZW50LFxuICAgIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+XG4gICk6IHsgZWRpdEFjdGlvbjogP0dlb0pzb25FZGl0QWN0aW9uLCBjYW5jZWxNYXBQYW46IGJvb2xlYW4gfSB7XG4gICAgcmV0dXJuIHsgZWRpdEFjdGlvbjogbnVsbCwgY2FuY2VsTWFwUGFuOiBmYWxzZSB9O1xuICB9XG5cbiAgaGFuZGxlU3RhcnREcmFnZ2luZ0FkYXB0ZXIoXG4gICAgZXZlbnQ6IFN0YXJ0RHJhZ2dpbmdFdmVudCxcbiAgICBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPlxuICApOiA/R2VvSnNvbkVkaXRBY3Rpb24ge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgaGFuZGxlU3RvcERyYWdnaW5nQWRhcHRlcihcbiAgICBldmVudDogU3RvcERyYWdnaW5nRXZlbnQsXG4gICAgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj5cbiAgKTogP0dlb0pzb25FZGl0QWN0aW9uIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGlja2VkRWRpdEhhbmRsZShwaWNrczogPyhhbnlbXSkpOiA/RWRpdEhhbmRsZSB7XG4gIGNvbnN0IGhhbmRsZXMgPSBnZXRQaWNrZWRFZGl0SGFuZGxlcyhwaWNrcyk7XG4gIHJldHVybiBoYW5kbGVzLmxlbmd0aCA/IGhhbmRsZXNbMF0gOiBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Tm9uR3VpZGVQaWNrcyhwaWNrczogYW55W10pOiBhbnlbXSB7XG4gIHJldHVybiBwaWNrcyAmJiBwaWNrcy5maWx0ZXIocGljayA9PiAhcGljay5pc0d1aWRlKTtcbn1cblxuLy8gVE9ETyBlZGl0LW1vZGVzOiByZWZhY3RvciB0byBqdXN0IHJldHVybiBgaW5mby5vYmplY3RgXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGlja2VkRWRpdEhhbmRsZXMocGlja3M6ID8oYW55W10pKTogRWRpdEhhbmRsZVtdIHtcbiAgY29uc3QgaGFuZGxlcyA9XG4gICAgKHBpY2tzICYmXG4gICAgICBwaWNrc1xuICAgICAgICAuZmlsdGVyKHBpY2sgPT4gcGljay5pc0d1aWRlICYmIHBpY2sub2JqZWN0LnByb3BlcnRpZXMuZ3VpZGVUeXBlID09PSAnZWRpdEhhbmRsZScpXG4gICAgICAgIC5tYXAocGljayA9PiBwaWNrLm9iamVjdCkpIHx8XG4gICAgW107XG5cbiAgcmV0dXJuIGhhbmRsZXMubWFwKGhhbmRsZSA9PiB7XG4gICAgY29uc3QgZmVhdHVyZTogRmVhdHVyZU9mPFBvaW50PiA9IGhhbmRsZTtcbiAgICBjb25zdCB7IGdlb21ldHJ5IH0gPSBmZWF0dXJlO1xuXG4gICAgLy8gJEZsb3dGaXhNZVxuICAgIGNvbnN0IHByb3BlcnRpZXM6IHsgW3N0cmluZ106IGFueSB9ID0gZmVhdHVyZS5wcm9wZXJ0aWVzO1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiBwcm9wZXJ0aWVzLmVkaXRIYW5kbGVUeXBlLFxuICAgICAgcG9zaXRpb246IGdlb21ldHJ5LmNvb3JkaW5hdGVzLFxuICAgICAgcG9zaXRpb25JbmRleGVzOiBwcm9wZXJ0aWVzLnBvc2l0aW9uSW5kZXhlcyxcbiAgICAgIGZlYXR1cmVJbmRleDogcHJvcGVydGllcy5mZWF0dXJlSW5kZXhcbiAgICB9O1xuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBpY2tlZEV4aXN0aW5nRWRpdEhhbmRsZShwaWNrczogPyhhbnlbXSkpOiA/RWRpdEhhbmRsZSB7XG4gIGNvbnN0IGhhbmRsZXMgPSBnZXRQaWNrZWRFZGl0SGFuZGxlcyhwaWNrcyk7XG4gIHJldHVybiBoYW5kbGVzLmZpbmQoaCA9PiBoLmZlYXR1cmVJbmRleCA+PSAwICYmIGgudHlwZSA9PT0gJ2V4aXN0aW5nJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQaWNrZWRJbnRlcm1lZGlhdGVFZGl0SGFuZGxlKHBpY2tzOiA/KGFueVtdKSk6ID9FZGl0SGFuZGxlIHtcbiAgY29uc3QgaGFuZGxlcyA9IGdldFBpY2tlZEVkaXRIYW5kbGVzKHBpY2tzKTtcbiAgcmV0dXJuIGhhbmRsZXMuZmluZChoID0+IGguZmVhdHVyZUluZGV4ID49IDAgJiYgaC50eXBlID09PSAnaW50ZXJtZWRpYXRlJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRJbnRlcm1lZGlhdGVQb3NpdGlvbihwb3NpdGlvbjE6IFBvc2l0aW9uLCBwb3NpdGlvbjI6IFBvc2l0aW9uKTogUG9zaXRpb24ge1xuICBjb25zdCBpbnRlcm1lZGlhdGVQb3NpdGlvbiA9IFtcbiAgICAocG9zaXRpb24xWzBdICsgcG9zaXRpb24yWzBdKSAvIDIuMCxcbiAgICAocG9zaXRpb24xWzFdICsgcG9zaXRpb24yWzFdKSAvIDIuMFxuICBdO1xuICByZXR1cm4gaW50ZXJtZWRpYXRlUG9zaXRpb247XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRFZGl0SGFuZGxlc0Zvckdlb21ldHJ5KFxuICBnZW9tZXRyeTogR2VvbWV0cnksXG4gIGZlYXR1cmVJbmRleDogbnVtYmVyLFxuICBlZGl0SGFuZGxlVHlwZTogRWRpdEhhbmRsZVR5cGUgPSAnZXhpc3RpbmcnXG4pIHtcbiAgbGV0IGhhbmRsZXM6IEVkaXRIYW5kbGVbXSA9IFtdO1xuXG4gIHN3aXRjaCAoZ2VvbWV0cnkudHlwZSkge1xuICAgIGNhc2UgJ1BvaW50JzpcbiAgICAgIC8vIHBvc2l0aW9ucyBhcmUgbm90IG5lc3RlZFxuICAgICAgaGFuZGxlcyA9IFtcbiAgICAgICAge1xuICAgICAgICAgIHBvc2l0aW9uOiBnZW9tZXRyeS5jb29yZGluYXRlcyxcbiAgICAgICAgICBwb3NpdGlvbkluZGV4ZXM6IFtdLFxuICAgICAgICAgIGZlYXR1cmVJbmRleCxcbiAgICAgICAgICB0eXBlOiBlZGl0SGFuZGxlVHlwZVxuICAgICAgICB9XG4gICAgICBdO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnTXVsdGlQb2ludCc6XG4gICAgY2FzZSAnTGluZVN0cmluZyc6XG4gICAgICAvLyBwb3NpdGlvbnMgYXJlIG5lc3RlZCAxIGxldmVsXG4gICAgICBoYW5kbGVzID0gaGFuZGxlcy5jb25jYXQoXG4gICAgICAgIGdldEVkaXRIYW5kbGVzRm9yQ29vcmRpbmF0ZXMoZ2VvbWV0cnkuY29vcmRpbmF0ZXMsIFtdLCBmZWF0dXJlSW5kZXgsIGVkaXRIYW5kbGVUeXBlKVxuICAgICAgKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ1BvbHlnb24nOlxuICAgIGNhc2UgJ011bHRpTGluZVN0cmluZyc6XG4gICAgICAvLyBwb3NpdGlvbnMgYXJlIG5lc3RlZCAyIGxldmVsc1xuICAgICAgZm9yIChsZXQgYSA9IDA7IGEgPCBnZW9tZXRyeS5jb29yZGluYXRlcy5sZW5ndGg7IGErKykge1xuICAgICAgICBoYW5kbGVzID0gaGFuZGxlcy5jb25jYXQoXG4gICAgICAgICAgZ2V0RWRpdEhhbmRsZXNGb3JDb29yZGluYXRlcyhnZW9tZXRyeS5jb29yZGluYXRlc1thXSwgW2FdLCBmZWF0dXJlSW5kZXgsIGVkaXRIYW5kbGVUeXBlKVxuICAgICAgICApO1xuICAgICAgICBpZiAoZ2VvbWV0cnkudHlwZSA9PT0gJ1BvbHlnb24nKSB7XG4gICAgICAgICAgLy8gRG9uJ3QgcmVwZWF0IHRoZSBmaXJzdC9sYXN0IGhhbmRsZSBmb3IgUG9seWdvbnNcbiAgICAgICAgICBoYW5kbGVzID0gaGFuZGxlcy5zbGljZSgwLCAtMSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ011bHRpUG9seWdvbic6XG4gICAgICAvLyBwb3NpdGlvbnMgYXJlIG5lc3RlZCAzIGxldmVsc1xuICAgICAgZm9yIChsZXQgYSA9IDA7IGEgPCBnZW9tZXRyeS5jb29yZGluYXRlcy5sZW5ndGg7IGErKykge1xuICAgICAgICBmb3IgKGxldCBiID0gMDsgYiA8IGdlb21ldHJ5LmNvb3JkaW5hdGVzW2FdLmxlbmd0aDsgYisrKSB7XG4gICAgICAgICAgaGFuZGxlcyA9IGhhbmRsZXMuY29uY2F0KFxuICAgICAgICAgICAgZ2V0RWRpdEhhbmRsZXNGb3JDb29yZGluYXRlcyhcbiAgICAgICAgICAgICAgZ2VvbWV0cnkuY29vcmRpbmF0ZXNbYV1bYl0sXG4gICAgICAgICAgICAgIFthLCBiXSxcbiAgICAgICAgICAgICAgZmVhdHVyZUluZGV4LFxuICAgICAgICAgICAgICBlZGl0SGFuZGxlVHlwZVxuICAgICAgICAgICAgKVxuICAgICAgICAgICk7XG4gICAgICAgICAgLy8gRG9uJ3QgcmVwZWF0IHRoZSBmaXJzdC9sYXN0IGhhbmRsZSBmb3IgUG9seWdvbnNcbiAgICAgICAgICBoYW5kbGVzID0gaGFuZGxlcy5zbGljZSgwLCAtMSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBFcnJvcihgVW5oYW5kbGVkIGdlb21ldHJ5IHR5cGU6ICR7Z2VvbWV0cnkudHlwZX1gKTtcbiAgfVxuXG4gIHJldHVybiBoYW5kbGVzO1xufVxuXG5mdW5jdGlvbiBnZXRFZGl0SGFuZGxlc0ZvckNvb3JkaW5hdGVzKFxuICBjb29yZGluYXRlczogYW55W10sXG4gIHBvc2l0aW9uSW5kZXhQcmVmaXg6IG51bWJlcltdLFxuICBmZWF0dXJlSW5kZXg6IG51bWJlcixcbiAgZWRpdEhhbmRsZVR5cGU6IEVkaXRIYW5kbGVUeXBlID0gJ2V4aXN0aW5nJ1xuKTogRWRpdEhhbmRsZVtdIHtcbiAgY29uc3QgZWRpdEhhbmRsZXMgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb29yZGluYXRlcy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHBvc2l0aW9uID0gY29vcmRpbmF0ZXNbaV07XG4gICAgZWRpdEhhbmRsZXMucHVzaCh7XG4gICAgICBwb3NpdGlvbixcbiAgICAgIHBvc2l0aW9uSW5kZXhlczogWy4uLnBvc2l0aW9uSW5kZXhQcmVmaXgsIGldLFxuICAgICAgZmVhdHVyZUluZGV4LFxuICAgICAgdHlwZTogZWRpdEhhbmRsZVR5cGVcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gZWRpdEhhbmRsZXM7XG59XG4iXX0=