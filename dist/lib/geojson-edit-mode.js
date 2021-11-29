"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPickedEditHandle = getPickedEditHandle;
exports.getIntermediatePosition = getIntermediatePosition;
exports.getEditHandlesForGeometry = getEditHandlesForGeometry;
exports.BaseGeoJsonEditMode = void 0;

var _union = _interopRequireDefault(require("@turf/union"));

var _difference = _interopRequireDefault(require("@turf/difference"));

var _intersect = _interopRequireDefault(require("@turf/intersect"));

var _editMode = require("./edit-mode.js");

var _immutableFeatureCollection = require("./immutable-feature-collection.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DEFAULT_EDIT_HANDLES = []; // Main interface for `EditMode`s that edit GeoJSON

var BaseGeoJsonEditMode =
/*#__PURE__*/
function () {
  // TODO: add underscore
  function BaseGeoJsonEditMode(featureCollection) {
    _classCallCheck(this, BaseGeoJsonEditMode);

    _defineProperty(this, "featureCollection", void 0);

    _defineProperty(this, "_clickSequence", []);

    _defineProperty(this, "_editHandles", DEFAULT_EDIT_HANDLES);

    _defineProperty(this, "_tentativeFeature", void 0);

    if (featureCollection) {
      this.setFeatureCollection(featureCollection);
    }
  }

  _createClass(BaseGeoJsonEditMode, [{
    key: "getGuides",
    value: function getGuides(_ref) {
      var lastPointerMoveEvent = _ref.lastPointerMoveEvent;
      var picks = lastPointerMoveEvent && lastPointerMoveEvent.picks;
      var mapCoords = lastPointerMoveEvent && lastPointerMoveEvent.mapCoords;
      var editHandles = this.getEditHandlesAdapter(picks, mapCoords);
      var tentative = this._tentativeFeature ? [// $FlowFixMe
      _objectSpread({}, this._tentativeFeature, {
        properties: {
          guideType: 'tentative'
        }
      })] : [];
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
        features: tentative.concat(_toConsumableArray(editHandleFeatures))
      };
    }
  }, {
    key: "getFeatureCollection",
    value: function getFeatureCollection() {
      return this.featureCollection.getObject();
    }
  }, {
    key: "getImmutableFeatureCollection",
    value: function getImmutableFeatureCollection() {
      return this.featureCollection;
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
    key: "setFeatureCollection",
    value: function setFeatureCollection(featureCollection) {
      this.featureCollection = new _immutableFeatureCollection.ImmutableFeatureCollection(featureCollection);
    } // TODO: delete me

  }, {
    key: "setModeConfig",
    value: function setModeConfig(modeConfig) {
      console.warn('TODO: call to obsolete setModeConfig'); // eslint-disable-line
    } // TODO: delete me

  }, {
    key: "getSelectedFeatureIndexes",
    value: function getSelectedFeatureIndexes(props) {
      return props.selectedIndexes;
    } // TODO: delete me

  }, {
    key: "setSelectedFeatureIndexes",
    value: function setSelectedFeatureIndexes(indexes) {
      console.warn('TODO: call to obsolete setSelectedFeatureIndexes'); // eslint-disable-line
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
    }
  }, {
    key: "getEditHandles",
    value: function getEditHandles() {
      return this._editHandles;
    } // TODO: delete me once mode handlers do getEditHandles lazily

  }, {
    key: "_setTentativeFeature",
    value: function _setTentativeFeature(tentativeFeature) {
      this._tentativeFeature = tentativeFeature;
    }
  }, {
    key: "_refreshCursor",
    value: function _refreshCursor(props) {
      var currentCursor = props.cursor;
      var updatedCursor = this.getCursorAdapter();

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
    value: function getEditHandlesAdapter(picks, mapCoords, tentativeFeature) {
      return DEFAULT_EDIT_HANDLES;
    }
  }, {
    key: "getCursorAdapter",
    value: function getCursorAdapter() {
      return null;
    }
  }, {
    key: "isSelectionPicked",
    value: function isSelectionPicked(picks, props) {
      if (!picks.length) return false;
      var pickedIndexes = picks.map(function (_ref2) {
        var index = _ref2.index;
        return index;
      });
      var selectedFeatureIndexes = props.selectedIndexes;
      return selectedFeatureIndexes.some(function (index) {
        return pickedIndexes.includes(index);
      });
    }
  }, {
    key: "getAddFeatureAction",
    value: function getAddFeatureAction(geometry) {
      // Unsure why flow can't deal with Geometry type, but there I fixed it
      var geometryAsAny = geometry;
      var updatedData = this.getImmutableFeatureCollection().addFeature({
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
    value: function getAddManyFeaturesAction(featureCollection) {
      var features = featureCollection.features;
      var updatedData = this.getImmutableFeatureCollection();
      var initialIndex = updatedData.getObject().features.length;
      var updatedIndexes = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = features[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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
        var updatedData = this.getImmutableFeatureCollection().replaceGeometry(featureIndex, updatedGeometry.geometry).getObject();
        var editAction = {
          updatedData: updatedData,
          editType: 'unionGeometry',
          editContext: {
            featureIndexes: [featureIndex]
          }
        };
        return editAction;
      }

      return this.getAddFeatureAction(geometry);
    } // TODO: factor out all the duplicate calls to setFeatureCollection

  }, {
    key: "handleClick",
    value: function handleClick(event, props) {
      this.setFeatureCollection(props.data);
      var editAction = this.handleClickAdapter(event, props);

      if (editAction) {
        props.onEdit(editAction);
      }
    }
  }, {
    key: "handlePointerMove",
    value: function handlePointerMove(event, props) {
      this.setFeatureCollection(props.data);

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
      this.setFeatureCollection(props.data);
      var editAction = this.handleStartDraggingAdapter(event, props);

      if (editAction) {
        props.onEdit(editAction);
      }
    }
  }, {
    key: "handleStopDragging",
    value: function handleStopDragging(event, props) {
      this.setFeatureCollection(props.data);
      var editAction = this.handleStopDraggingAdapter(event, props);

      if (editAction) {
        props.onEdit(editAction);
      }
    } // TODO: delete these adapters once all ModeHandler implementations don't use them

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
  var info = picks && picks.find(function (pick) {
    return pick.isGuide;
  });

  if (info) {
    return info.object;
  }

  return null;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvZ2VvanNvbi1lZGl0LW1vZGUuanMiXSwibmFtZXMiOlsiREVGQVVMVF9FRElUX0hBTkRMRVMiLCJCYXNlR2VvSnNvbkVkaXRNb2RlIiwiZmVhdHVyZUNvbGxlY3Rpb24iLCJzZXRGZWF0dXJlQ29sbGVjdGlvbiIsImxhc3RQb2ludGVyTW92ZUV2ZW50IiwicGlja3MiLCJtYXBDb29yZHMiLCJlZGl0SGFuZGxlcyIsImdldEVkaXRIYW5kbGVzQWRhcHRlciIsInRlbnRhdGl2ZSIsIl90ZW50YXRpdmVGZWF0dXJlIiwicHJvcGVydGllcyIsImd1aWRlVHlwZSIsImVkaXRIYW5kbGVGZWF0dXJlcyIsIm1hcCIsImhhbmRsZSIsInR5cGUiLCJlZGl0SGFuZGxlVHlwZSIsImZlYXR1cmVJbmRleCIsInBvc2l0aW9uSW5kZXhlcyIsImdlb21ldHJ5IiwiY29vcmRpbmF0ZXMiLCJwb3NpdGlvbiIsImZlYXR1cmVzIiwiZ2V0T2JqZWN0IiwicHJvcHMiLCJzZWxlY3RlZEluZGV4ZXMiLCJsZW5ndGgiLCJkYXRhIiwiZmVhdHVyZSIsImdldFNlbGVjdGVkRmVhdHVyZSIsInNlbGVjdGVkRmVhdHVyZXMiLCJzZWxlY3RlZEluZGV4IiwiSW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24iLCJtb2RlQ29uZmlnIiwiY29uc29sZSIsIndhcm4iLCJpbmRleGVzIiwiX2NsaWNrU2VxdWVuY2UiLCJfZWRpdEhhbmRsZXMiLCJ0ZW50YXRpdmVGZWF0dXJlIiwiY3VycmVudEN1cnNvciIsImN1cnNvciIsInVwZGF0ZWRDdXJzb3IiLCJnZXRDdXJzb3JBZGFwdGVyIiwib25VcGRhdGVDdXJzb3IiLCJwaWNrZWRJbmRleGVzIiwiaW5kZXgiLCJzZWxlY3RlZEZlYXR1cmVJbmRleGVzIiwic29tZSIsImluY2x1ZGVzIiwiZ2VvbWV0cnlBc0FueSIsInVwZGF0ZWREYXRhIiwiZ2V0SW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24iLCJhZGRGZWF0dXJlIiwiZWRpdFR5cGUiLCJlZGl0Q29udGV4dCIsImZlYXR1cmVJbmRleGVzIiwiaW5pdGlhbEluZGV4IiwidXBkYXRlZEluZGV4ZXMiLCJwdXNoIiwic2VsZWN0ZWRGZWF0dXJlIiwiYm9vbGVhbk9wZXJhdGlvbiIsInVwZGF0ZWRHZW9tZXRyeSIsInJlcGxhY2VHZW9tZXRyeSIsImVkaXRBY3Rpb24iLCJnZXRBZGRGZWF0dXJlQWN0aW9uIiwiZXZlbnQiLCJoYW5kbGVDbGlja0FkYXB0ZXIiLCJvbkVkaXQiLCJoYW5kbGVQb2ludGVyTW92ZUFkYXB0ZXIiLCJjYW5jZWxNYXBQYW4iLCJzb3VyY2VFdmVudCIsInN0b3BQcm9wYWdhdGlvbiIsIl9yZWZyZXNoQ3Vyc29yIiwiaGFuZGxlU3RhcnREcmFnZ2luZ0FkYXB0ZXIiLCJoYW5kbGVTdG9wRHJhZ2dpbmdBZGFwdGVyIiwiZ2V0UGlja2VkRWRpdEhhbmRsZSIsImluZm8iLCJmaW5kIiwicGljayIsImlzR3VpZGUiLCJvYmplY3QiLCJnZXRJbnRlcm1lZGlhdGVQb3NpdGlvbiIsInBvc2l0aW9uMSIsInBvc2l0aW9uMiIsImludGVybWVkaWF0ZVBvc2l0aW9uIiwiZ2V0RWRpdEhhbmRsZXNGb3JHZW9tZXRyeSIsImhhbmRsZXMiLCJjb25jYXQiLCJnZXRFZGl0SGFuZGxlc0ZvckNvb3JkaW5hdGVzIiwiYSIsInNsaWNlIiwiYiIsIkVycm9yIiwicG9zaXRpb25JbmRleFByZWZpeCIsImkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFFQTs7QUFDQTs7QUFDQTs7QUFvQkE7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFhQSxJQUFNQSxvQkFBa0MsR0FBRyxFQUEzQyxDLENBRUE7O0lBR2FDLG1COzs7QUFDWDtBQU1BLCtCQUFZQyxpQkFBWixFQUFtRDtBQUFBOztBQUFBOztBQUFBLDRDQUp0QixFQUlzQjs7QUFBQSwwQ0FIdEJGLG9CQUdzQjs7QUFBQTs7QUFDakQsUUFBSUUsaUJBQUosRUFBdUI7QUFDckIsV0FBS0Msb0JBQUwsQ0FBMEJELGlCQUExQjtB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QTJCQyxDQUEzQixFQUZBO0FBR2Y5RSxNQUFBQSxZQUFZLEVBQVpBLFlBSGU7QUFJZkYsTUFBQUEsSUFBSSxFQUFFQztBQUpTLEtBQWpCO0FBTUQ7O0FBQ0QsU0FBT1YsV0FBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuaW1wb3J0IHR1cmZVbmlvbiBmcm9tICdAdHVyZi91bmlvbic7XG5pbXBvcnQgdHVyZkRpZmZlcmVuY2UgZnJvbSAnQHR1cmYvZGlmZmVyZW5jZSc7XG5pbXBvcnQgdHVyZkludGVyc2VjdCBmcm9tICdAdHVyZi9pbnRlcnNlY3QnO1xuXG5pbXBvcnQgdHlwZSB7XG4gIEVkaXRBY3Rpb24sXG4gIENsaWNrRXZlbnQsXG4gIFBvaW50ZXJNb3ZlRXZlbnQsXG4gIFN0YXJ0RHJhZ2dpbmdFdmVudCxcbiAgU3RvcERyYWdnaW5nRXZlbnQsXG4gIFBpY2ssXG4gIE1vZGVQcm9wc1xufSBmcm9tICcuLi90eXBlcy5qcyc7XG5pbXBvcnQgdHlwZSB7XG4gIEZlYXR1cmVDb2xsZWN0aW9uLFxuICBGZWF0dXJlLFxuICBGZWF0dXJlT2YsXG4gIFBvaW50LFxuICBQb2x5Z29uLFxuICBHZW9tZXRyeSxcbiAgUG9zaXRpb25cbn0gZnJvbSAnLi4vZ2VvanNvbi10eXBlcy5qcyc7XG5pbXBvcnQgeyBFZGl0TW9kZSB9IGZyb20gJy4vZWRpdC1tb2RlLmpzJztcblxuaW1wb3J0IHsgSW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24gfSBmcm9tICcuL2ltbXV0YWJsZS1mZWF0dXJlLWNvbGxlY3Rpb24uanMnO1xuXG5leHBvcnQgdHlwZSBFZGl0SGFuZGxlVHlwZSA9ICdleGlzdGluZycgfCAnaW50ZXJtZWRpYXRlJyB8ICdzbmFwJztcblxuZXhwb3J0IHR5cGUgRWRpdEhhbmRsZSA9IHtcbiAgcG9zaXRpb246IFBvc2l0aW9uLFxuICBwb3NpdGlvbkluZGV4ZXM6IG51bWJlcltdLFxuICBmZWF0dXJlSW5kZXg6IG51bWJlcixcbiAgdHlwZTogRWRpdEhhbmRsZVR5cGVcbn07XG5cbmV4cG9ydCB0eXBlIEdlb0pzb25FZGl0QWN0aW9uID0gRWRpdEFjdGlvbjxGZWF0dXJlQ29sbGVjdGlvbj47XG5cbmNvbnN0IERFRkFVTFRfRURJVF9IQU5ETEVTOiBFZGl0SGFuZGxlW10gPSBbXTtcblxuLy8gTWFpbiBpbnRlcmZhY2UgZm9yIGBFZGl0TW9kZWBzIHRoYXQgZWRpdCBHZW9KU09OXG5leHBvcnQgdHlwZSBHZW9Kc29uRWRpdE1vZGUgPSBFZGl0TW9kZTxGZWF0dXJlQ29sbGVjdGlvbiwgRmVhdHVyZUNvbGxlY3Rpb24+O1xuXG5leHBvcnQgY2xhc3MgQmFzZUdlb0pzb25FZGl0TW9kZSBpbXBsZW1lbnRzIEVkaXRNb2RlPEZlYXR1cmVDb2xsZWN0aW9uLCBGZWF0dXJlQ29sbGVjdGlvbj4ge1xuICAvLyBUT0RPOiBhZGQgdW5kZXJzY29yZVxuICBmZWF0dXJlQ29sbGVjdGlvbjogSW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb247XG4gIF9jbGlja1NlcXVlbmNlOiBQb3NpdGlvbltdID0gW107XG4gIF9lZGl0SGFuZGxlczogRWRpdEhhbmRsZVtdID0gREVGQVVMVF9FRElUX0hBTkRMRVM7XG4gIF90ZW50YXRpdmVGZWF0dXJlOiA/RmVhdHVyZTtcblxuICBjb25zdHJ1Y3RvcihmZWF0dXJlQ29sbGVjdGlvbj86IEZlYXR1cmVDb2xsZWN0aW9uKSB7XG4gICAgaWYgKGZlYXR1cmVDb2xsZWN0aW9uKSB7XG4gICAgICB0aGlzLnNldEZlYXR1cmVDb2xsZWN0aW9uKGZlYXR1cmVDb2xsZWN0aW9uKTtcbiAgICB9XG4gIH1cblxuICBnZXRHdWlkZXMoeyBsYXN0UG9pbnRlck1vdmVFdmVudCB9OiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KTogRmVhdHVyZUNvbGxlY3Rpb24ge1xuICAgIGNvbnN0IHBpY2tzID0gbGFzdFBvaW50ZXJNb3ZlRXZlbnQgJiYgbGFzdFBvaW50ZXJNb3ZlRXZlbnQucGlja3M7XG4gICAgY29uc3QgbWFwQ29vcmRzID0gbGFzdFBvaW50ZXJNb3ZlRXZlbnQgJiYgbGFzdFBvaW50ZXJNb3ZlRXZlbnQubWFwQ29vcmRzO1xuICAgIGNvbnN0IGVkaXRIYW5kbGVzID0gdGhpcy5nZXRFZGl0SGFuZGxlc0FkYXB0ZXIocGlja3MsIG1hcENvb3Jkcyk7XG5cbiAgICBjb25zdCB0ZW50YXRpdmU6IEZlYXR1cmVbXSA9IHRoaXMuX3RlbnRhdGl2ZUZlYXR1cmVcbiAgICAgID8gW1xuICAgICAgICAgIC8vICRGbG93Rml4TWVcbiAgICAgICAgICB7XG4gICAgICAgICAgICAuLi50aGlzLl90ZW50YXRpdmVGZWF0dXJlLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBndWlkZVR5cGU6ICd0ZW50YXRpdmUnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICA6IFtdO1xuICAgIGNvbnN0IGVkaXRIYW5kbGVGZWF0dXJlczogRmVhdHVyZU9mPFBvaW50PltdID0gZWRpdEhhbmRsZXMubWFwKGhhbmRsZSA9PiAoe1xuICAgICAgdHlwZTogJ0ZlYXR1cmUnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBndWlkZVR5cGU6ICdlZGl0SGFuZGxlJyxcbiAgICAgICAgZWRpdEhhbmRsZVR5cGU6IGhhbmRsZS50eXBlLFxuICAgICAgICBmZWF0dXJlSW5kZXg6IGhhbmRsZS5mZWF0dXJlSW5kZXgsXG4gICAgICAgIHBvc2l0aW9uSW5kZXhlczogaGFuZGxlLnBvc2l0aW9uSW5kZXhlc1xuICAgICAgfSxcbiAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgIHR5cGU6ICdQb2ludCcsXG4gICAgICAgIGNvb3JkaW5hdGVzOiBoYW5kbGUucG9zaXRpb25cbiAgICAgIH1cbiAgICB9KSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogJ0ZlYXR1cmVDb2xsZWN0aW9uJyxcbiAgICAgIGZlYXR1cmVzOiBbLi4udGVudGF0aXZlLCAuLi5lZGl0SGFuZGxlRmVhdHVyZXNdXG4gICAgfTtcbiAgfVxuXG4gIGdldEZlYXR1cmVDb2xsZWN0aW9uKCk6IEZlYXR1cmVDb2xsZWN0aW9uIHtcbiAgICByZXR1cm4gdGhpcy5mZWF0dXJlQ29sbGVjdGlvbi5nZXRPYmplY3QoKTtcbiAgfVxuXG4gIGdldEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uKCk6IEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uIHtcbiAgICByZXR1cm4gdGhpcy5mZWF0dXJlQ29sbGVjdGlvbjtcbiAgfVxuXG4gIGdldFNlbGVjdGVkRmVhdHVyZShwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPik6ID9GZWF0dXJlIHtcbiAgICBpZiAocHJvcHMuc2VsZWN0ZWRJbmRleGVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgcmV0dXJuIHByb3BzLmRhdGEuZmVhdHVyZXNbcHJvcHMuc2VsZWN0ZWRJbmRleGVzWzBdXTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBnZXRTZWxlY3RlZEdlb21ldHJ5KHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KTogP0dlb21ldHJ5IHtcbiAgICBjb25zdCBmZWF0dXJlID0gdGhpcy5nZXRTZWxlY3RlZEZlYXR1cmUocHJvcHMpO1xuICAgIGlmIChmZWF0dXJlKSB7XG4gICAgICByZXR1cm4gZmVhdHVyZS5nZW9tZXRyeTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBnZXRTZWxlY3RlZEZlYXR1cmVzQXNGZWF0dXJlQ29sbGVjdGlvbihwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPik6IEZlYXR1cmVDb2xsZWN0aW9uIHtcbiAgICBjb25zdCB7IGZlYXR1cmVzIH0gPSBwcm9wcy5kYXRhO1xuICAgIGNvbnN0IHNlbGVjdGVkRmVhdHVyZXMgPSBwcm9wcy5zZWxlY3RlZEluZGV4ZXMubWFwKHNlbGVjdGVkSW5kZXggPT4gZmVhdHVyZXNbc2VsZWN0ZWRJbmRleF0pO1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiAnRmVhdHVyZUNvbGxlY3Rpb24nLFxuICAgICAgZmVhdHVyZXM6IHNlbGVjdGVkRmVhdHVyZXNcbiAgICB9O1xuICB9XG5cbiAgc2V0RmVhdHVyZUNvbGxlY3Rpb24oZmVhdHVyZUNvbGxlY3Rpb246IEZlYXR1cmVDb2xsZWN0aW9uKTogdm9pZCB7XG4gICAgdGhpcy5mZWF0dXJlQ29sbGVjdGlvbiA9IG5ldyBJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbihmZWF0dXJlQ29sbGVjdGlvbik7XG4gIH1cblxuICAvLyBUT0RPOiBkZWxldGUgbWVcbiAgc2V0TW9kZUNvbmZpZyhtb2RlQ29uZmlnOiBhbnkpOiB2b2lkIHtcbiAgICBjb25zb2xlLndhcm4oJ1RPRE86IGNhbGwgdG8gb2Jzb2xldGUgc2V0TW9kZUNvbmZpZycpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIH1cblxuICAvLyBUT0RPOiBkZWxldGUgbWVcbiAgZ2V0U2VsZWN0ZWRGZWF0dXJlSW5kZXhlcyhwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPik6IG51bWJlcltdIHtcbiAgICByZXR1cm4gcHJvcHMuc2VsZWN0ZWRJbmRleGVzO1xuICB9XG5cbiAgLy8gVE9ETzogZGVsZXRlIG1lXG4gIHNldFNlbGVjdGVkRmVhdHVyZUluZGV4ZXMoaW5kZXhlczogbnVtYmVyW10pOiB2b2lkIHtcbiAgICBjb25zb2xlLndhcm4oJ1RPRE86IGNhbGwgdG8gb2Jzb2xldGUgc2V0U2VsZWN0ZWRGZWF0dXJlSW5kZXhlcycpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIH1cblxuICBnZXRDbGlja1NlcXVlbmNlKCk6IFBvc2l0aW9uW10ge1xuICAgIHJldHVybiB0aGlzLl9jbGlja1NlcXVlbmNlO1xuICB9XG5cbiAgcmVzZXRDbGlja1NlcXVlbmNlKCk6IHZvaWQge1xuICAgIHRoaXMuX2NsaWNrU2VxdWVuY2UgPSBbXTtcbiAgfVxuXG4gIGdldFRlbnRhdGl2ZUZlYXR1cmUoKTogP0ZlYXR1cmUge1xuICAgIHJldHVybiB0aGlzLl90ZW50YXRpdmVGZWF0dXJlO1xuICB9XG5cbiAgZ2V0RWRpdEhhbmRsZXMoKTogRWRpdEhhbmRsZVtdIHtcbiAgICByZXR1cm4gdGhpcy5fZWRpdEhhbmRsZXM7XG4gIH1cblxuICAvLyBUT0RPOiBkZWxldGUgbWUgb25jZSBtb2RlIGhhbmRsZXJzIGRvIGdldEVkaXRIYW5kbGVzIGxhemlseVxuICBfc2V0VGVudGF0aXZlRmVhdHVyZSh0ZW50YXRpdmVGZWF0dXJlOiA/RmVhdHVyZSk6IHZvaWQge1xuICAgIHRoaXMuX3RlbnRhdGl2ZUZlYXR1cmUgPSB0ZW50YXRpdmVGZWF0dXJlO1xuICB9XG5cbiAgX3JlZnJlc2hDdXJzb3IocHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pOiB2b2lkIHtcbiAgICBjb25zdCBjdXJyZW50Q3Vyc29yID0gcHJvcHMuY3Vyc29yO1xuICAgIGNvbnN0IHVwZGF0ZWRDdXJzb3IgPSB0aGlzLmdldEN1cnNvckFkYXB0ZXIoKTtcblxuICAgIGlmIChjdXJyZW50Q3Vyc29yICE9PSB1cGRhdGVkQ3Vyc29yKSB7XG4gICAgICBwcm9wcy5vblVwZGF0ZUN1cnNvcih1cGRhdGVkQ3Vyc29yKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIGZsYXQgYXJyYXkgb2YgcG9zaXRpb25zIGZvciB0aGUgZ2l2ZW4gZmVhdHVyZSBhbG9uZyB3aXRoIHRoZWlyIGluZGV4ZXMgaW50byB0aGUgZmVhdHVyZSdzIGdlb21ldHJ5J3MgY29vcmRpbmF0ZXMuXG4gICAqXG4gICAqIEBwYXJhbSBmZWF0dXJlSW5kZXggVGhlIGluZGV4IG9mIHRoZSBmZWF0dXJlIHRvIGdldCBlZGl0IGhhbmRsZXNcbiAgICovXG4gIGdldEVkaXRIYW5kbGVzQWRhcHRlcihcbiAgICBwaWNrcz86IEFycmF5PE9iamVjdD4sXG4gICAgbWFwQ29vcmRzPzogUG9zaXRpb24sXG4gICAgdGVudGF0aXZlRmVhdHVyZT86ID9GZWF0dXJlXG4gICk6IEVkaXRIYW5kbGVbXSB7XG4gICAgcmV0dXJuIERFRkFVTFRfRURJVF9IQU5ETEVTO1xuICB9XG5cbiAgZ2V0Q3Vyc29yQWRhcHRlcigpOiA/c3RyaW5nIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGlzU2VsZWN0aW9uUGlja2VkKHBpY2tzOiBQaWNrW10sIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KTogYm9vbGVhbiB7XG4gICAgaWYgKCFwaWNrcy5sZW5ndGgpIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBwaWNrZWRJbmRleGVzID0gcGlja3MubWFwKCh7IGluZGV4IH0pID0+IGluZGV4KTtcbiAgICBjb25zdCBzZWxlY3RlZEZlYXR1cmVJbmRleGVzID0gcHJvcHMuc2VsZWN0ZWRJbmRleGVzO1xuICAgIHJldHVybiBzZWxlY3RlZEZlYXR1cmVJbmRleGVzLnNvbWUoaW5kZXggPT4gcGlja2VkSW5kZXhlcy5pbmNsdWRlcyhpbmRleCkpO1xuICB9XG5cbiAgZ2V0QWRkRmVhdHVyZUFjdGlvbihnZW9tZXRyeTogR2VvbWV0cnkpOiBHZW9Kc29uRWRpdEFjdGlvbiB7XG4gICAgLy8gVW5zdXJlIHdoeSBmbG93IGNhbid0IGRlYWwgd2l0aCBHZW9tZXRyeSB0eXBlLCBidXQgdGhlcmUgSSBmaXhlZCBpdFxuICAgIGNvbnN0IGdlb21ldHJ5QXNBbnk6IGFueSA9IGdlb21ldHJ5O1xuXG4gICAgY29uc3QgdXBkYXRlZERhdGEgPSB0aGlzLmdldEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uKClcbiAgICAgIC5hZGRGZWF0dXJlKHtcbiAgICAgICAgdHlwZTogJ0ZlYXR1cmUnLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7fSxcbiAgICAgICAgZ2VvbWV0cnk6IGdlb21ldHJ5QXNBbnlcbiAgICAgIH0pXG4gICAgICAuZ2V0T2JqZWN0KCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgdXBkYXRlZERhdGEsXG4gICAgICBlZGl0VHlwZTogJ2FkZEZlYXR1cmUnLFxuICAgICAgZWRpdENvbnRleHQ6IHtcbiAgICAgICAgZmVhdHVyZUluZGV4ZXM6IFt1cGRhdGVkRGF0YS5mZWF0dXJlcy5sZW5ndGggLSAxXVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBnZXRBZGRNYW55RmVhdHVyZXNBY3Rpb24oZmVhdHVyZUNvbGxlY3Rpb246IEZlYXR1cmVDb2xsZWN0aW9uKTogR2VvSnNvbkVkaXRBY3Rpb24ge1xuICAgIGNvbnN0IGZlYXR1cmVzID0gZmVhdHVyZUNvbGxlY3Rpb24uZmVhdHVyZXM7XG4gICAgbGV0IHVwZGF0ZWREYXRhID0gdGhpcy5nZXRJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbigpO1xuICAgIGNvbnN0IGluaXRpYWxJbmRleCA9IHVwZGF0ZWREYXRhLmdldE9iamVjdCgpLmZlYXR1cmVzLmxlbmd0aDtcbiAgICBjb25zdCB1cGRhdGVkSW5kZXhlcyA9IFtdO1xuICAgIGZvciAoY29uc3QgZmVhdHVyZSBvZiBmZWF0dXJlcykge1xuICAgICAgY29uc3QgeyBwcm9wZXJ0aWVzLCBnZW9tZXRyeSB9ID0gZmVhdHVyZTtcbiAgICAgIGNvbnN0IGdlb21ldHJ5QXNBbnk6IGFueSA9IGdlb21ldHJ5O1xuICAgICAgdXBkYXRlZERhdGEgPSB1cGRhdGVkRGF0YS5hZGRGZWF0dXJlKHtcbiAgICAgICAgdHlwZTogJ0ZlYXR1cmUnLFxuICAgICAgICBwcm9wZXJ0aWVzLFxuICAgICAgICBnZW9tZXRyeTogZ2VvbWV0cnlBc0FueVxuICAgICAgfSk7XG4gICAgICB1cGRhdGVkSW5kZXhlcy5wdXNoKGluaXRpYWxJbmRleCArIHVwZGF0ZWRJbmRleGVzLmxlbmd0aCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHVwZGF0ZWREYXRhOiB1cGRhdGVkRGF0YS5nZXRPYmplY3QoKSxcbiAgICAgIGVkaXRUeXBlOiAnYWRkRmVhdHVyZScsXG4gICAgICBlZGl0Q29udGV4dDoge1xuICAgICAgICBmZWF0dXJlSW5kZXhlczogdXBkYXRlZEluZGV4ZXNcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgZ2V0QWRkRmVhdHVyZU9yQm9vbGVhblBvbHlnb25BY3Rpb24oXG4gICAgZ2VvbWV0cnk6IFBvbHlnb24sXG4gICAgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj5cbiAgKTogP0dlb0pzb25FZGl0QWN0aW9uIHtcbiAgICBjb25zdCBzZWxlY3RlZEZlYXR1cmUgPSB0aGlzLmdldFNlbGVjdGVkRmVhdHVyZShwcm9wcyk7XG4gICAgY29uc3QgeyBtb2RlQ29uZmlnIH0gPSBwcm9wcztcbiAgICBpZiAobW9kZUNvbmZpZyAmJiBtb2RlQ29uZmlnLmJvb2xlYW5PcGVyYXRpb24pIHtcbiAgICAgIGlmIChcbiAgICAgICAgIXNlbGVjdGVkRmVhdHVyZSB8fFxuICAgICAgICAoc2VsZWN0ZWRGZWF0dXJlLmdlb21ldHJ5LnR5cGUgIT09ICdQb2x5Z29uJyAmJlxuICAgICAgICAgIHNlbGVjdGVkRmVhdHVyZS5nZW9tZXRyeS50eXBlICE9PSAnTXVsdGlQb2x5Z29uJylcbiAgICAgICkge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZSxuby11bmRlZlxuICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgJ2Jvb2xlYW5PcGVyYXRpb24gb25seSBzdXBwb3J0ZWQgZm9yIHNpbmdsZSBQb2x5Z29uIG9yIE11bHRpUG9seWdvbiBzZWxlY3Rpb24nXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBmZWF0dXJlID0ge1xuICAgICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICAgIGdlb21ldHJ5XG4gICAgICB9O1xuXG4gICAgICBsZXQgdXBkYXRlZEdlb21ldHJ5O1xuICAgICAgaWYgKG1vZGVDb25maWcuYm9vbGVhbk9wZXJhdGlvbiA9PT0gJ3VuaW9uJykge1xuICAgICAgICB1cGRhdGVkR2VvbWV0cnkgPSB0dXJmVW5pb24oc2VsZWN0ZWRGZWF0dXJlLCBmZWF0dXJlKTtcbiAgICAgIH0gZWxzZSBpZiAobW9kZUNvbmZpZy5ib29sZWFuT3BlcmF0aW9uID09PSAnZGlmZmVyZW5jZScpIHtcbiAgICAgICAgdXBkYXRlZEdlb21ldHJ5ID0gdHVyZkRpZmZlcmVuY2Uoc2VsZWN0ZWRGZWF0dXJlLCBmZWF0dXJlKTtcbiAgICAgIH0gZWxzZSBpZiAobW9kZUNvbmZpZy5ib29sZWFuT3BlcmF0aW9uID09PSAnaW50ZXJzZWN0aW9uJykge1xuICAgICAgICB1cGRhdGVkR2VvbWV0cnkgPSB0dXJmSW50ZXJzZWN0KHNlbGVjdGVkRmVhdHVyZSwgZmVhdHVyZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZSxuby11bmRlZlxuICAgICAgICBjb25zb2xlLndhcm4oYEludmFsaWQgYm9vbGVhbk9wZXJhdGlvbiAke21vZGVDb25maWcuYm9vbGVhbk9wZXJhdGlvbn1gKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIGlmICghdXBkYXRlZEdlb21ldHJ5KSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlLG5vLXVuZGVmXG4gICAgICAgIGNvbnNvbGUud2FybignQ2FuY2VsaW5nIGVkaXQuIEJvb2xlYW4gb3BlcmF0aW9uIGVyYXNlZCBlbnRpcmUgcG9seWdvbi4nKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGZlYXR1cmVJbmRleCA9IHByb3BzLnNlbGVjdGVkSW5kZXhlc1swXTtcblxuICAgICAgY29uc3QgdXBkYXRlZERhdGEgPSB0aGlzLmdldEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uKClcbiAgICAgICAgLnJlcGxhY2VHZW9tZXRyeShmZWF0dXJlSW5kZXgsIHVwZGF0ZWRHZW9tZXRyeS5nZW9tZXRyeSlcbiAgICAgICAgLmdldE9iamVjdCgpO1xuXG4gICAgICBjb25zdCBlZGl0QWN0aW9uOiBHZW9Kc29uRWRpdEFjdGlvbiA9IHtcbiAgICAgICAgdXBkYXRlZERhdGEsXG4gICAgICAgIGVkaXRUeXBlOiAndW5pb25HZW9tZXRyeScsXG4gICAgICAgIGVkaXRDb250ZXh0OiB7XG4gICAgICAgICAgZmVhdHVyZUluZGV4ZXM6IFtmZWF0dXJlSW5kZXhdXG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBlZGl0QWN0aW9uO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5nZXRBZGRGZWF0dXJlQWN0aW9uKGdlb21ldHJ5KTtcbiAgfVxuXG4gIC8vIFRPRE86IGZhY3RvciBvdXQgYWxsIHRoZSBkdXBsaWNhdGUgY2FsbHMgdG8gc2V0RmVhdHVyZUNvbGxlY3Rpb25cblxuICBoYW5kbGVDbGljayhldmVudDogQ2xpY2tFdmVudCwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pOiB2b2lkIHtcbiAgICB0aGlzLnNldEZlYXR1cmVDb2xsZWN0aW9uKHByb3BzLmRhdGEpO1xuICAgIGNvbnN0IGVkaXRBY3Rpb24gPSB0aGlzLmhhbmRsZUNsaWNrQWRhcHRlcihldmVudCwgcHJvcHMpO1xuXG4gICAgaWYgKGVkaXRBY3Rpb24pIHtcbiAgICAgIHByb3BzLm9uRWRpdChlZGl0QWN0aW9uKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVQb2ludGVyTW92ZShldmVudDogUG9pbnRlck1vdmVFdmVudCwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pOiB2b2lkIHtcbiAgICB0aGlzLnNldEZlYXR1cmVDb2xsZWN0aW9uKHByb3BzLmRhdGEpO1xuICAgIGNvbnN0IHsgZWRpdEFjdGlvbiwgY2FuY2VsTWFwUGFuIH0gPSB0aGlzLmhhbmRsZVBvaW50ZXJNb3ZlQWRhcHRlcihldmVudCwgcHJvcHMpO1xuXG4gICAgaWYgKGNhbmNlbE1hcFBhbikge1xuICAgICAgLy8gVE9ETzogaXMgdGhlcmUgYSBsZXNzIGhhY2t5IHdheSB0byBwcmV2ZW50IG1hcCBwYW5uaW5nP1xuICAgICAgLy8gU3RvcCBwcm9wYWdhdGlvbiB0byBwcmV2ZW50IG1hcCBwYW5uaW5nIHdoaWxlIGRyYWdnaW5nIGFuIGVkaXQgaGFuZGxlXG4gICAgICBldmVudC5zb3VyY2VFdmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG5cbiAgICB0aGlzLl9yZWZyZXNoQ3Vyc29yKHByb3BzKTtcbiAgICBpZiAoZWRpdEFjdGlvbikge1xuICAgICAgcHJvcHMub25FZGl0KGVkaXRBY3Rpb24pO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZVN0YXJ0RHJhZ2dpbmcoZXZlbnQ6IFN0YXJ0RHJhZ2dpbmdFdmVudCwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pOiB2b2lkIHtcbiAgICB0aGlzLnNldEZlYXR1cmVDb2xsZWN0aW9uKHByb3BzLmRhdGEpO1xuXG4gICAgY29uc3QgZWRpdEFjdGlvbiA9IHRoaXMuaGFuZGxlU3RhcnREcmFnZ2luZ0FkYXB0ZXIoZXZlbnQsIHByb3BzKTtcblxuICAgIGlmIChlZGl0QWN0aW9uKSB7XG4gICAgICBwcm9wcy5vbkVkaXQoZWRpdEFjdGlvbik7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlU3RvcERyYWdnaW5nKGV2ZW50OiBTdG9wRHJhZ2dpbmdFdmVudCwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pOiB2b2lkIHtcbiAgICB0aGlzLnNldEZlYXR1cmVDb2xsZWN0aW9uKHByb3BzLmRhdGEpO1xuXG4gICAgY29uc3QgZWRpdEFjdGlvbiA9IHRoaXMuaGFuZGxlU3RvcERyYWdnaW5nQWRhcHRlcihldmVudCwgcHJvcHMpO1xuXG4gICAgaWYgKGVkaXRBY3Rpb24pIHtcbiAgICAgIHByb3BzLm9uRWRpdChlZGl0QWN0aW9uKTtcbiAgICB9XG4gIH1cblxuICAvLyBUT0RPOiBkZWxldGUgdGhlc2UgYWRhcHRlcnMgb25jZSBhbGwgTW9kZUhhbmRsZXIgaW1wbGVtZW50YXRpb25zIGRvbid0IHVzZSB0aGVtXG4gIGhhbmRsZUNsaWNrQWRhcHRlcihldmVudDogQ2xpY2tFdmVudCwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pOiA/R2VvSnNvbkVkaXRBY3Rpb24ge1xuICAgIHRoaXMuX2NsaWNrU2VxdWVuY2UucHVzaChldmVudC5tYXBDb29yZHMpO1xuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBoYW5kbGVQb2ludGVyTW92ZUFkYXB0ZXIoXG4gICAgZXZlbnQ6IFBvaW50ZXJNb3ZlRXZlbnQsXG4gICAgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj5cbiAgKTogeyBlZGl0QWN0aW9uOiA/R2VvSnNvbkVkaXRBY3Rpb24sIGNhbmNlbE1hcFBhbjogYm9vbGVhbiB9IHtcbiAgICByZXR1cm4geyBlZGl0QWN0aW9uOiBudWxsLCBjYW5jZWxNYXBQYW46IGZhbHNlIH07XG4gIH1cblxuICBoYW5kbGVTdGFydERyYWdnaW5nQWRhcHRlcihcbiAgICBldmVudDogU3RhcnREcmFnZ2luZ0V2ZW50LFxuICAgIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+XG4gICk6ID9HZW9Kc29uRWRpdEFjdGlvbiB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBoYW5kbGVTdG9wRHJhZ2dpbmdBZGFwdGVyKFxuICAgIGV2ZW50OiBTdG9wRHJhZ2dpbmdFdmVudCxcbiAgICBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPlxuICApOiA/R2VvSnNvbkVkaXRBY3Rpb24ge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQaWNrZWRFZGl0SGFuZGxlKHBpY2tzOiA/KGFueVtdKSk6ID9FZGl0SGFuZGxlIHtcbiAgY29uc3QgaW5mbyA9IHBpY2tzICYmIHBpY2tzLmZpbmQocGljayA9PiBwaWNrLmlzR3VpZGUpO1xuICBpZiAoaW5mbykge1xuICAgIHJldHVybiBpbmZvLm9iamVjdDtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEludGVybWVkaWF0ZVBvc2l0aW9uKHBvc2l0aW9uMTogUG9zaXRpb24sIHBvc2l0aW9uMjogUG9zaXRpb24pOiBQb3NpdGlvbiB7XG4gIGNvbnN0IGludGVybWVkaWF0ZVBvc2l0aW9uID0gW1xuICAgIChwb3NpdGlvbjFbMF0gKyBwb3NpdGlvbjJbMF0pIC8gMi4wLFxuICAgIChwb3NpdGlvbjFbMV0gKyBwb3NpdGlvbjJbMV0pIC8gMi4wXG4gIF07XG4gIHJldHVybiBpbnRlcm1lZGlhdGVQb3NpdGlvbjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEVkaXRIYW5kbGVzRm9yR2VvbWV0cnkoXG4gIGdlb21ldHJ5OiBHZW9tZXRyeSxcbiAgZmVhdHVyZUluZGV4OiBudW1iZXIsXG4gIGVkaXRIYW5kbGVUeXBlOiBFZGl0SGFuZGxlVHlwZSA9ICdleGlzdGluZydcbikge1xuICBsZXQgaGFuZGxlczogRWRpdEhhbmRsZVtdID0gW107XG5cbiAgc3dpdGNoIChnZW9tZXRyeS50eXBlKSB7XG4gICAgY2FzZSAnUG9pbnQnOlxuICAgICAgLy8gcG9zaXRpb25zIGFyZSBub3QgbmVzdGVkXG4gICAgICBoYW5kbGVzID0gW1xuICAgICAgICB7XG4gICAgICAgICAgcG9zaXRpb246IGdlb21ldHJ5LmNvb3JkaW5hdGVzLFxuICAgICAgICAgIHBvc2l0aW9uSW5kZXhlczogW10sXG4gICAgICAgICAgZmVhdHVyZUluZGV4LFxuICAgICAgICAgIHR5cGU6IGVkaXRIYW5kbGVUeXBlXG4gICAgICAgIH1cbiAgICAgIF07XG4gICAgICBicmVhaztcbiAgICBjYXNlICdNdWx0aVBvaW50JzpcbiAgICBjYXNlICdMaW5lU3RyaW5nJzpcbiAgICAgIC8vIHBvc2l0aW9ucyBhcmUgbmVzdGVkIDEgbGV2ZWxcbiAgICAgIGhhbmRsZXMgPSBoYW5kbGVzLmNvbmNhdChcbiAgICAgICAgZ2V0RWRpdEhhbmRsZXNGb3JDb29yZGluYXRlcyhnZW9tZXRyeS5jb29yZGluYXRlcywgW10sIGZlYXR1cmVJbmRleCwgZWRpdEhhbmRsZVR5cGUpXG4gICAgICApO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnUG9seWdvbic6XG4gICAgY2FzZSAnTXVsdGlMaW5lU3RyaW5nJzpcbiAgICAgIC8vIHBvc2l0aW9ucyBhcmUgbmVzdGVkIDIgbGV2ZWxzXG4gICAgICBmb3IgKGxldCBhID0gMDsgYSA8IGdlb21ldHJ5LmNvb3JkaW5hdGVzLmxlbmd0aDsgYSsrKSB7XG4gICAgICAgIGhhbmRsZXMgPSBoYW5kbGVzLmNvbmNhdChcbiAgICAgICAgICBnZXRFZGl0SGFuZGxlc0ZvckNvb3JkaW5hdGVzKGdlb21ldHJ5LmNvb3JkaW5hdGVzW2FdLCBbYV0sIGZlYXR1cmVJbmRleCwgZWRpdEhhbmRsZVR5cGUpXG4gICAgICAgICk7XG4gICAgICAgIGlmIChnZW9tZXRyeS50eXBlID09PSAnUG9seWdvbicpIHtcbiAgICAgICAgICAvLyBEb24ndCByZXBlYXQgdGhlIGZpcnN0L2xhc3QgaGFuZGxlIGZvciBQb2x5Z29uc1xuICAgICAgICAgIGhhbmRsZXMgPSBoYW5kbGVzLnNsaWNlKDAsIC0xKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnTXVsdGlQb2x5Z29uJzpcbiAgICAgIC8vIHBvc2l0aW9ucyBhcmUgbmVzdGVkIDMgbGV2ZWxzXG4gICAgICBmb3IgKGxldCBhID0gMDsgYSA8IGdlb21ldHJ5LmNvb3JkaW5hdGVzLmxlbmd0aDsgYSsrKSB7XG4gICAgICAgIGZvciAobGV0IGIgPSAwOyBiIDwgZ2VvbWV0cnkuY29vcmRpbmF0ZXNbYV0ubGVuZ3RoOyBiKyspIHtcbiAgICAgICAgICBoYW5kbGVzID0gaGFuZGxlcy5jb25jYXQoXG4gICAgICAgICAgICBnZXRFZGl0SGFuZGxlc0ZvckNvb3JkaW5hdGVzKFxuICAgICAgICAgICAgICBnZW9tZXRyeS5jb29yZGluYXRlc1thXVtiXSxcbiAgICAgICAgICAgICAgW2EsIGJdLFxuICAgICAgICAgICAgICBmZWF0dXJlSW5kZXgsXG4gICAgICAgICAgICAgIGVkaXRIYW5kbGVUeXBlXG4gICAgICAgICAgICApXG4gICAgICAgICAgKTtcbiAgICAgICAgICAvLyBEb24ndCByZXBlYXQgdGhlIGZpcnN0L2xhc3QgaGFuZGxlIGZvciBQb2x5Z29uc1xuICAgICAgICAgIGhhbmRsZXMgPSBoYW5kbGVzLnNsaWNlKDAsIC0xKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IEVycm9yKGBVbmhhbmRsZWQgZ2VvbWV0cnkgdHlwZTogJHtnZW9tZXRyeS50eXBlfWApO1xuICB9XG5cbiAgcmV0dXJuIGhhbmRsZXM7XG59XG5cbmZ1bmN0aW9uIGdldEVkaXRIYW5kbGVzRm9yQ29vcmRpbmF0ZXMoXG4gIGNvb3JkaW5hdGVzOiBhbnlbXSxcbiAgcG9zaXRpb25JbmRleFByZWZpeDogbnVtYmVyW10sXG4gIGZlYXR1cmVJbmRleDogbnVtYmVyLFxuICBlZGl0SGFuZGxlVHlwZTogRWRpdEhhbmRsZVR5cGUgPSAnZXhpc3RpbmcnXG4pOiBFZGl0SGFuZGxlW10ge1xuICBjb25zdCBlZGl0SGFuZGxlcyA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGNvb3JkaW5hdGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgcG9zaXRpb24gPSBjb29yZGluYXRlc1tpXTtcbiAgICBlZGl0SGFuZGxlcy5wdXNoKHtcbiAgICAgIHBvc2l0aW9uLFxuICAgICAgcG9zaXRpb25JbmRleGVzOiBbLi4ucG9zaXRpb25JbmRleFByZWZpeCwgaV0sXG4gICAgICBmZWF0dXJlSW5kZXgsXG4gICAgICB0eXBlOiBlZGl0SGFuZGxlVHlwZVxuICAgIH0pO1xuICB9XG4gIHJldHVybiBlZGl0SGFuZGxlcztcbn1cbiJdfQ==