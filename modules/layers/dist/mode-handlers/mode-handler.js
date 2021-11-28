"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPickedEditHandle = getPickedEditHandle;
exports.getIntermediatePosition = getIntermediatePosition;
exports.getEditHandlesForGeometry = getEditHandlesForGeometry;
exports.ModeHandler = void 0;

var _union = _interopRequireDefault(require("@turf/union"));

var _difference = _interopRequireDefault(require("@turf/difference"));

var _intersect = _interopRequireDefault(require("@turf/intersect"));

var _editModes = require("@nebula.gl/edit-modes");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ModeHandler =
/*#__PURE__*/
function () {
  // TODO: add underscore
  function ModeHandler(featureCollection) {
    _classCallCheck(this, ModeHandler);

    _defineProperty(this, "featureCollection", void 0);

    _defineProperty(this, "_tentativeFeature", void 0);

    _defineProperty(this, "_modeConfig", null);

    _defineProperty(this, "_selectedFeatureIndexes", []);

    _defineProperty(this, "_clickSequence", []);

    if (featureCollection) {
      this.setFeatureCollection(featureCollection);
    }
  }

  _createClass(ModeHandler, [{
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
    value: function getSelectedFeature() {
      if (this._selectedFeatureIndexes.length === 1) {
        return this.featureCollection.getObject().features[this._selectedFeatureIndexes[0]];
      }

      return null;
    }
  }, {
    key: "getSelectedGeometry",
    value: function getSelectedGeometry() {
      var feature = this.getSelectedFeature();

      if (feature) {
        return feature.geometry;
      }

      return null;
    }
  }, {
    key: "getSelectedFeaturesAsFeatureCollection",
    value: function getSelectedFeaturesAsFeatureCollection() {
      var _this$featureCollecti = this.featureCollection.getObject(),
          features = _this$featureCollecti.features;

      var selectedFeatures = this.getSelectedFeatureIndexes().map(function (selectedIndex) {
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
      this.featureCollection = new _editModes.ImmutableFeatureCollection(featureCollection);
    }
  }, {
    key: "getModeConfig",
    value: function getModeConfig() {
      return this._modeConfig;
    }
  }, {
    key: "setModeConfig",
    value: function setModeConfig(modeConfig) {
      if (this._modeConfig === modeConfig) {
        return;
      }

      this._modeConfig = modeConfig;

      this._setTentativeFeature(null);
    }
  }, {
    key: "getSelectedFeatureIndexes",
    value: function getSelectedFeatureIndexes() {
      return this._selectedFeatureIndexes;
    }
  }, {
    key: "setSelectedFeatureIndexes",
    value: function setSelectedFeatureIndexes(indexes) {
      if (this._selectedFeatureIndexes === indexes) {
        return;
      }

      this._selectedFeatureIndexes = indexes;

      this._setTentativeFeature(null);
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
    } // TODO: remove the underscore

  }, {
    key: "_setTentativeFeature",
    value: function _setTentativeFeature(tentativeFeature) {
      this._tentativeFeature = tentativeFeature;

      if (!tentativeFeature) {
        // Reset the click sequence
        this._clickSequence = [];
      }
    }
    /**
     * Returns a flat array of positions for the given feature along with their indexes into the feature's geometry's coordinates.
     *
     * @param featureIndex The index of the feature to get edit handles
     */

  }, {
    key: "getEditHandles",
    value: function getEditHandles(picks, groundCoords) {
      return [];
    }
  }, {
    key: "getCursor",
    value: function getCursor(_ref) {
      var isDragging = _ref.isDragging;
      return 'cell';
    }
  }, {
    key: "isSelectionPicked",
    value: function isSelectionPicked(picks) {
      if (!picks.length) return false;
      var pickedIndexes = picks.map(function (_ref2) {
        var index = _ref2.index;
        return index;
      });
      var selectedFeatureIndexes = this.getSelectedFeatureIndexes();
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
        featureIndexes: [updatedData.features.length - 1],
        editContext: null
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
        featureIndexes: updatedIndexes,
        editContext: null
      };
    }
  }, {
    key: "getAddFeatureOrBooleanPolygonAction",
    value: function getAddFeatureOrBooleanPolygonAction(geometry) {
      var selectedFeature = this.getSelectedFeature();
      var modeConfig = this.getModeConfig();

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

        var featureIndex = this.getSelectedFeatureIndexes()[0];
        var updatedData = this.getImmutableFeatureCollection().replaceGeometry(featureIndex, updatedGeometry.geometry).getObject();
        var editAction = {
          updatedData: updatedData,
          editType: 'unionGeometry',
          featureIndexes: [featureIndex],
          editContext: null
        };
        return editAction;
      }

      return this.getAddFeatureAction(geometry);
    }
  }, {
    key: "handleClick",
    value: function handleClick(event) {
      this._clickSequence.push(event.groundCoords);

      return null;
    }
  }, {
    key: "handlePointerMove",
    value: function handlePointerMove(event) {
      return {
        editAction: null,
        cancelMapPan: false
      };
    }
  }, {
    key: "handleStartDragging",
    value: function handleStartDragging(event) {
      return null;
    }
  }, {
    key: "handleStopDragging",
    value: function handleStopDragging(event) {
      return null;
    }
  }]);

  return ModeHandler;
}();

exports.ModeHandler = ModeHandler;

function getPickedEditHandle(picks) {
  var info = picks && picks.find(function (pick) {
    return pick.isEditingHandle;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL21vZGUtaGFuZGxlci5qcyJdLCJuYW1lcyI6WyJNb2RlSGFuZGxlciIsImZlYXR1cmVDb2xsZWN0aW9uIiwic2V0RmVhdHVyZUNvbGxlY3Rpb24iLCJnZXRPYmplY3QiLCJfc2VsZWN0ZWRGZWF0dXJlSW5kZXhlcyIsImxlbmd0aCIsImZlYXR1cmVzIiwiZmVhdHVyZSIsImdldFNlbGVjdGVkRmVhdHVyZSIsImdlb21ldHJ5Iiwic2VsZWN0ZWRGZWF0dXJlcyIsImdldFNlbGVjdGVkRmVhdHVyZUluZGV4ZXMiLCJtYXAiLCJzZWxlY3RlZEluZGV4IiwidHlwZSIsIkltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uIiwiX21vZGVDb25maWciLCJtb2RlQ29uZmlnIiwiX3NldFRlbnRhdGl2ZUZlYXR1cmUiLCJpbmRleGVzIiwiX2NsaWNrU2VxdWVuY2UiLCJfdGVudGF0aXZlRmVhdHVyZSIsInRlbnRhdGl2ZUZlYXR1cmUiLCJwaWNrcyIsImdyb3VuZENvb3JkcyIsImlzRHJhZ2dpbmciLCJwaWNrZWRJbmRleGVzIiwiaW5kZXgiLCJzZWxlY3RlZEZlYXR1cmVJbmRleGVzIiwic29tZSIsImluY2x1ZGVzIiwiZ2VvbWV0cnlBc0FueSIsInVwZGF0ZWREYXRhIiwiZ2V0SW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24iLCJhZGRGZWF0dXJlIiwicHJvcGVydGllcyIsImVkaXRUeXBlIiwiZmVhdHVyZUluZGV4ZXMiLCJlZGl0Q29udGV4dCIsImluaXRpYWxJbmRleCIsInVwZGF0ZWRJbmRleGVzIiwicHVzaCIsInNlbGVjdGVkRmVhdHVyZSIsImdldE1vZGVDb25maWciLCJib29sZWFuT3BlcmF0aW9uIiwiY29uc29sZSIsIndhcm4iLCJ1cGRhdGVkR2VvbWV0cnkiLCJmZWF0dXJlSW5kZXgiLCJyZXBsYWNlR2VvbWV0cnkiLCJlZGl0QWN0aW9uIiwiZ2V0QWRkRmVhdHVyZUFjdGlvbiIsImV2ZW50IiwiY2FuY2VsTWFwUGFuIiwiZ2V0UGlja2VkRWRpdEhhbmRsZSIsImluZm8iLCJmaW5kIiwicGljayIsImlzRWRpdGluZ0hhbmRsZSIsIm9iamVjdCIsImdldEludGVybWVkaWF0ZVBvc2l0aW9uIiwicG9zaXRpb24xIiwicG9zaXRpb24yIiwiaW50ZXJtZWRpYXRlUG9zaXRpb24iLCJnZXRFZGl0SGFuZGxlc0Zvckdlb21ldHJ5IiwiZWRpdEhhbmRsZVR5cGUiLCJoYW5kbGVzIiwicG9zaXRpb24iLCJjb29yZGluYXRlcyIsInBvc2l0aW9uSW5kZXhlcyIsImNvbmNhdCIsImdldEVkaXRIYW5kbGVzRm9yQ29vcmRpbmF0ZXMiLCJhIiwic2xpY2UiLCJiIiwiRXJyb3IiLCJwb3NpdGlvbkluZGV4UHJlZml4IiwiZWRpdEhhbmRsZXMiLCJpIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBSUE7O0FBQ0E7O0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBZ0NhQSxXOzs7QUFDWDtBQU9BLHVCQUFZQyxpQkFBWixFQUFtRDtBQUFBOztBQUFBOztBQUFBOztBQUFBLHlDQUpoQyxJQUlnQzs7QUFBQSxxREFIZixFQUdlOztBQUFBLDRDQUZ0QixFQUVzQjs7QUFDakQsUUFBSUEsaUJBQUosRUFBdUI7QUFDckIsV0FBS0Msb0JBQUwsQ0FBMEJELGlCQUExQjtBQUNEO0FBQ0Y7Ozs7MkNBRXlDO0FBQ3hDLGFBQU8sS0FBS0EsaUJBQUwsQ0FBdUJFLFNBQXZCLEVBQVA7QUFDRDs7O29EQUUyRDtBQUMxRCxhQUFPLEtBQUtGLGlCQUFaO0FBQ0Q7Ozt5Q0FFOEI7QUFDN0IsVUFBSSxLQUFLRyx1QkFBTCxDQUE2QkMsTUFBN0IsS0FBd0MsQ0FBNUMsRUFBK0M7QUFDN0MsZUFBTyxLQUFLSixpQkFBTCxDQUF1QkUsU0FBdkIsR0FBbUNHLFFBQW5DLENBQTRDLEtBQUtGLHVCQUFMLENBQTZCLENBQTdCLENBQTVDLENBQVA7QUFDRDs7QUFDRCxhQUFPLElBQVA7QUFDRDs7OzBDQUVnQztBQUMvQixVQUFNRyxPQUFPLEdBQUcsS0FB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LEVBQVg7QUFsREo7O0FBcURBLFNBQU9vRCxPQUFQO0FBQ0Q7O0FBRUQsU0FBU0ssNEJBQVQsQ0FDRUgsV0FERixFQUVFUSxtQkFGRixFQUdFNUIsWUFIRixFQUtnQjtBQUFBLE1BRGRpQixjQUNjLHVFQURtQixVQUNuQjtBQUNkLE1BQU1ZLFdBQVcsR0FBRyxFQUFwQjs7QUFDQSxPQUFLLElBQUlDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdWLFdBQVcsQ0FBQy9ELE1BQWhDLEVBQXdDeUUsQ0FBQyxFQUF6QyxFQUE2QztBQUMzQyxRQUFNWCxRQUFRLEdBQUdDLFdBQVcsQ0FBQ1UsQ0FBRCxDQUE1QjtBQUNBRCxJQUFBQSxXQUFXLENBQUNwQyxJQUFaLENBQWlCO0FBQ2YwQixNQUFBQSxRQUFRLEVBQVJBLFFBRGU7QUFFZkUsTUFBQUEsZUFBZSxxQkFBTU8sbUJBQU4sVUFBMkJFLENBQTNCLEVBRkE7QUFHZjlCLE1BQUFBLFlBQVksRUFBWkEsWUFIZTtBQUlmbEMsTUFBQUEsSUFBSSxFQUFFbUQ7QUFKUyxLQUFqQjtBQU1EOztBQUNELFNBQU9ZLFdBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbi8vIFRPRE86IGRlbGV0ZSB0aGlzIG9uY2UgYWxsIG1vZGUgaGFuZGxlcnMgZGVyaXZlIGZyb20gR2VvSnNvbkVkaXRNb2RlXG5cbmltcG9ydCB0dXJmVW5pb24gZnJvbSAnQHR1cmYvdW5pb24nO1xuaW1wb3J0IHR1cmZEaWZmZXJlbmNlIGZyb20gJ0B0dXJmL2RpZmZlcmVuY2UnO1xuaW1wb3J0IHR1cmZJbnRlcnNlY3QgZnJvbSAnQHR1cmYvaW50ZXJzZWN0JztcblxuaW1wb3J0IHsgSW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24gfSBmcm9tICdAbmVidWxhLmdsL2VkaXQtbW9kZXMnO1xuaW1wb3J0IHR5cGUge1xuICBGZWF0dXJlQ29sbGVjdGlvbixcbiAgRmVhdHVyZSxcbiAgUG9seWdvbixcbiAgR2VvbWV0cnksXG4gIFBvc2l0aW9uXG59IGZyb20gJ0BuZWJ1bGEuZ2wvZWRpdC1tb2Rlcyc7XG5pbXBvcnQgdHlwZSB7XG4gIENsaWNrRXZlbnQsXG4gIFBvaW50ZXJNb3ZlRXZlbnQsXG4gIFN0YXJ0RHJhZ2dpbmdFdmVudCxcbiAgU3RvcERyYWdnaW5nRXZlbnQsXG4gIERlY2tHTFBpY2tcbn0gZnJvbSAnLi4vZXZlbnQtdHlwZXMuanMnO1xuXG5leHBvcnQgdHlwZSBFZGl0SGFuZGxlVHlwZSA9ICdleGlzdGluZycgfCAnaW50ZXJtZWRpYXRlJyB8ICdzbmFwJztcblxuZXhwb3J0IHR5cGUgRWRpdEhhbmRsZSA9IHtcbiAgcG9zaXRpb246IFBvc2l0aW9uLFxuICBwb3NpdGlvbkluZGV4ZXM6IG51bWJlcltdLFxuICBmZWF0dXJlSW5kZXg6IG51bWJlcixcbiAgdHlwZTogRWRpdEhhbmRsZVR5cGVcbn07XG5cbmV4cG9ydCB0eXBlIEVkaXRBY3Rpb24gPSB7XG4gIHVwZGF0ZWREYXRhOiBGZWF0dXJlQ29sbGVjdGlvbixcbiAgZWRpdFR5cGU6IHN0cmluZyxcbiAgZmVhdHVyZUluZGV4ZXM6IG51bWJlcltdLFxuICBlZGl0Q29udGV4dDogYW55XG59O1xuXG5leHBvcnQgY2xhc3MgTW9kZUhhbmRsZXIge1xuICAvLyBUT0RPOiBhZGQgdW5kZXJzY29yZVxuICBmZWF0dXJlQ29sbGVjdGlvbjogSW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb247XG4gIF90ZW50YXRpdmVGZWF0dXJlOiA/RmVhdHVyZTtcbiAgX21vZGVDb25maWc6IGFueSA9IG51bGw7XG4gIF9zZWxlY3RlZEZlYXR1cmVJbmRleGVzOiBudW1iZXJbXSA9IFtdO1xuICBfY2xpY2tTZXF1ZW5jZTogUG9zaXRpb25bXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKGZlYXR1cmVDb2xsZWN0aW9uPzogRmVhdHVyZUNvbGxlY3Rpb24pIHtcbiAgICBpZiAoZmVhdHVyZUNvbGxlY3Rpb24pIHtcbiAgICAgIHRoaXMuc2V0RmVhdHVyZUNvbGxlY3Rpb24oZmVhdHVyZUNvbGxlY3Rpb24pO1xuICAgIH1cbiAgfVxuXG4gIGdldEZlYXR1cmVDb2xsZWN0aW9uKCk6IEZlYXR1cmVDb2xsZWN0aW9uIHtcbiAgICByZXR1cm4gdGhpcy5mZWF0dXJlQ29sbGVjdGlvbi5nZXRPYmplY3QoKTtcbiAgfVxuXG4gIGdldEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uKCk6IEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uIHtcbiAgICByZXR1cm4gdGhpcy5mZWF0dXJlQ29sbGVjdGlvbjtcbiAgfVxuXG4gIGdldFNlbGVjdGVkRmVhdHVyZSgpOiA/RmVhdHVyZSB7XG4gICAgaWYgKHRoaXMuX3NlbGVjdGVkRmVhdHVyZUluZGV4ZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICByZXR1cm4gdGhpcy5mZWF0dXJlQ29sbGVjdGlvbi5nZXRPYmplY3QoKS5mZWF0dXJlc1t0aGlzLl9zZWxlY3RlZEZlYXR1cmVJbmRleGVzWzBdXTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBnZXRTZWxlY3RlZEdlb21ldHJ5KCk6ID9HZW9tZXRyeSB7XG4gICAgY29uc3QgZmVhdHVyZSA9IHRoaXMuZ2V0U2VsZWN0ZWRGZWF0dXJlKCk7XG4gICAgaWYgKGZlYXR1cmUpIHtcbiAgICAgIHJldHVybiBmZWF0dXJlLmdlb21ldHJ5O1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGdldFNlbGVjdGVkRmVhdHVyZXNBc0ZlYXR1cmVDb2xsZWN0aW9uKCk6IEZlYXR1cmVDb2xsZWN0aW9uIHtcbiAgICBjb25zdCB7IGZlYXR1cmVzIH0gPSB0aGlzLmZlYXR1cmVDb2xsZWN0aW9uLmdldE9iamVjdCgpO1xuICAgIGNvbnN0IHNlbGVjdGVkRmVhdHVyZXMgPSB0aGlzLmdldFNlbGVjdGVkRmVhdHVyZUluZGV4ZXMoKS5tYXAoXG4gICAgICBzZWxlY3RlZEluZGV4ID0+IGZlYXR1cmVzW3NlbGVjdGVkSW5kZXhdXG4gICAgKTtcbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogJ0ZlYXR1cmVDb2xsZWN0aW9uJyxcbiAgICAgIGZlYXR1cmVzOiBzZWxlY3RlZEZlYXR1cmVzXG4gICAgfTtcbiAgfVxuXG4gIHNldEZlYXR1cmVDb2xsZWN0aW9uKGZlYXR1cmVDb2xsZWN0aW9uOiBGZWF0dXJlQ29sbGVjdGlvbik6IHZvaWQge1xuICAgIHRoaXMuZmVhdHVyZUNvbGxlY3Rpb24gPSBuZXcgSW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24oZmVhdHVyZUNvbGxlY3Rpb24pO1xuICB9XG5cbiAgZ2V0TW9kZUNvbmZpZygpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLl9tb2RlQ29uZmlnO1xuICB9XG5cbiAgc2V0TW9kZUNvbmZpZyhtb2RlQ29uZmlnOiBhbnkpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fbW9kZUNvbmZpZyA9PT0gbW9kZUNvbmZpZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX21vZGVDb25maWcgPSBtb2RlQ29uZmlnO1xuICAgIHRoaXMuX3NldFRlbnRhdGl2ZUZlYXR1cmUobnVsbCk7XG4gIH1cblxuICBnZXRTZWxlY3RlZEZlYXR1cmVJbmRleGVzKCk6IG51bWJlcltdIHtcbiAgICByZXR1cm4gdGhpcy5fc2VsZWN0ZWRGZWF0dXJlSW5kZXhlcztcbiAgfVxuXG4gIHNldFNlbGVjdGVkRmVhdHVyZUluZGV4ZXMoaW5kZXhlczogbnVtYmVyW10pOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fc2VsZWN0ZWRGZWF0dXJlSW5kZXhlcyA9PT0gaW5kZXhlcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX3NlbGVjdGVkRmVhdHVyZUluZGV4ZXMgPSBpbmRleGVzO1xuICAgIHRoaXMuX3NldFRlbnRhdGl2ZUZlYXR1cmUobnVsbCk7XG4gIH1cblxuICBnZXRDbGlja1NlcXVlbmNlKCk6IFBvc2l0aW9uW10ge1xuICAgIHJldHVybiB0aGlzLl9jbGlja1NlcXVlbmNlO1xuICB9XG5cbiAgcmVzZXRDbGlja1NlcXVlbmNlKCk6IHZvaWQge1xuICAgIHRoaXMuX2NsaWNrU2VxdWVuY2UgPSBbXTtcbiAgfVxuXG4gIGdldFRlbnRhdGl2ZUZlYXR1cmUoKTogP0ZlYXR1cmUge1xuICAgIHJldHVybiB0aGlzLl90ZW50YXRpdmVGZWF0dXJlO1xuICB9XG5cbiAgLy8gVE9ETzogcmVtb3ZlIHRoZSB1bmRlcnNjb3JlXG4gIF9zZXRUZW50YXRpdmVGZWF0dXJlKHRlbnRhdGl2ZUZlYXR1cmU6ID9GZWF0dXJlKTogdm9pZCB7XG4gICAgdGhpcy5fdGVudGF0aXZlRmVhdHVyZSA9IHRlbnRhdGl2ZUZlYXR1cmU7XG4gICAgaWYgKCF0ZW50YXRpdmVGZWF0dXJlKSB7XG4gICAgICAvLyBSZXNldCB0aGUgY2xpY2sgc2VxdWVuY2VcbiAgICAgIHRoaXMuX2NsaWNrU2VxdWVuY2UgPSBbXTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIGZsYXQgYXJyYXkgb2YgcG9zaXRpb25zIGZvciB0aGUgZ2l2ZW4gZmVhdHVyZSBhbG9uZyB3aXRoIHRoZWlyIGluZGV4ZXMgaW50byB0aGUgZmVhdHVyZSdzIGdlb21ldHJ5J3MgY29vcmRpbmF0ZXMuXG4gICAqXG4gICAqIEBwYXJhbSBmZWF0dXJlSW5kZXggVGhlIGluZGV4IG9mIHRoZSBmZWF0dXJlIHRvIGdldCBlZGl0IGhhbmRsZXNcbiAgICovXG4gIGdldEVkaXRIYW5kbGVzKHBpY2tzPzogQXJyYXk8T2JqZWN0PiwgZ3JvdW5kQ29vcmRzPzogUG9zaXRpb24pOiBFZGl0SGFuZGxlW10ge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGdldEN1cnNvcih7IGlzRHJhZ2dpbmcgfTogeyBpc0RyYWdnaW5nOiBib29sZWFuIH0pOiBzdHJpbmcge1xuICAgIHJldHVybiAnY2VsbCc7XG4gIH1cblxuICBpc1NlbGVjdGlvblBpY2tlZChwaWNrczogRGVja0dMUGlja1tdKTogYm9vbGVhbiB7XG4gICAgaWYgKCFwaWNrcy5sZW5ndGgpIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBwaWNrZWRJbmRleGVzID0gcGlja3MubWFwKCh7IGluZGV4IH0pID0+IGluZGV4KTtcbiAgICBjb25zdCBzZWxlY3RlZEZlYXR1cmVJbmRleGVzID0gdGhpcy5nZXRTZWxlY3RlZEZlYXR1cmVJbmRleGVzKCk7XG4gICAgcmV0dXJuIHNlbGVjdGVkRmVhdHVyZUluZGV4ZXMuc29tZShpbmRleCA9PiBwaWNrZWRJbmRleGVzLmluY2x1ZGVzKGluZGV4KSk7XG4gIH1cblxuICBnZXRBZGRGZWF0dXJlQWN0aW9uKGdlb21ldHJ5OiBHZW9tZXRyeSk6IEVkaXRBY3Rpb24ge1xuICAgIC8vIFVuc3VyZSB3aHkgZmxvdyBjYW4ndCBkZWFsIHdpdGggR2VvbWV0cnkgdHlwZSwgYnV0IHRoZXJlIEkgZml4ZWQgaXRcbiAgICBjb25zdCBnZW9tZXRyeUFzQW55OiBhbnkgPSBnZW9tZXRyeTtcblxuICAgIGNvbnN0IHVwZGF0ZWREYXRhID0gdGhpcy5nZXRJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbigpXG4gICAgICAuYWRkRmVhdHVyZSh7XG4gICAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgICAgcHJvcGVydGllczoge30sXG4gICAgICAgIGdlb21ldHJ5OiBnZW9tZXRyeUFzQW55XG4gICAgICB9KVxuICAgICAgLmdldE9iamVjdCgpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHVwZGF0ZWREYXRhLFxuICAgICAgZWRpdFR5cGU6ICdhZGRGZWF0dXJlJyxcbiAgICAgIGZlYXR1cmVJbmRleGVzOiBbdXBkYXRlZERhdGEuZmVhdHVyZXMubGVuZ3RoIC0gMV0sXG4gICAgICBlZGl0Q29udGV4dDogbnVsbFxuICAgIH07XG4gIH1cblxuICBnZXRBZGRNYW55RmVhdHVyZXNBY3Rpb24oZmVhdHVyZUNvbGxlY3Rpb246IEZlYXR1cmVDb2xsZWN0aW9uKTogRWRpdEFjdGlvbiB7XG4gICAgY29uc3QgZmVhdHVyZXMgPSBmZWF0dXJlQ29sbGVjdGlvbi5mZWF0dXJlcztcbiAgICBsZXQgdXBkYXRlZERhdGEgPSB0aGlzLmdldEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uKCk7XG4gICAgY29uc3QgaW5pdGlhbEluZGV4ID0gdXBkYXRlZERhdGEuZ2V0T2JqZWN0KCkuZmVhdHVyZXMubGVuZ3RoO1xuICAgIGNvbnN0IHVwZGF0ZWRJbmRleGVzID0gW107XG4gICAgZm9yIChjb25zdCBmZWF0dXJlIG9mIGZlYXR1cmVzKSB7XG4gICAgICBjb25zdCB7IHByb3BlcnRpZXMsIGdlb21ldHJ5IH0gPSBmZWF0dXJlO1xuICAgICAgY29uc3QgZ2VvbWV0cnlBc0FueTogYW55ID0gZ2VvbWV0cnk7XG4gICAgICB1cGRhdGVkRGF0YSA9IHVwZGF0ZWREYXRhLmFkZEZlYXR1cmUoe1xuICAgICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICAgIHByb3BlcnRpZXMsXG4gICAgICAgIGdlb21ldHJ5OiBnZW9tZXRyeUFzQW55XG4gICAgICB9KTtcbiAgICAgIHVwZGF0ZWRJbmRleGVzLnB1c2goaW5pdGlhbEluZGV4ICsgdXBkYXRlZEluZGV4ZXMubGVuZ3RoKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgdXBkYXRlZERhdGE6IHVwZGF0ZWREYXRhLmdldE9iamVjdCgpLFxuICAgICAgZWRpdFR5cGU6ICdhZGRGZWF0dXJlJyxcbiAgICAgIGZlYXR1cmVJbmRleGVzOiB1cGRhdGVkSW5kZXhlcyxcbiAgICAgIGVkaXRDb250ZXh0OiBudWxsXG4gICAgfTtcbiAgfVxuXG4gIGdldEFkZEZlYXR1cmVPckJvb2xlYW5Qb2x5Z29uQWN0aW9uKGdlb21ldHJ5OiBQb2x5Z29uKTogP0VkaXRBY3Rpb24ge1xuICAgIGNvbnN0IHNlbGVjdGVkRmVhdHVyZSA9IHRoaXMuZ2V0U2VsZWN0ZWRGZWF0dXJlKCk7XG4gICAgY29uc3QgbW9kZUNvbmZpZyA9IHRoaXMuZ2V0TW9kZUNvbmZpZygpO1xuICAgIGlmIChtb2RlQ29uZmlnICYmIG1vZGVDb25maWcuYm9vbGVhbk9wZXJhdGlvbikge1xuICAgICAgaWYgKFxuICAgICAgICAhc2VsZWN0ZWRGZWF0dXJlIHx8XG4gICAgICAgIChzZWxlY3RlZEZlYXR1cmUuZ2VvbWV0cnkudHlwZSAhPT0gJ1BvbHlnb24nICYmXG4gICAgICAgICAgc2VsZWN0ZWRGZWF0dXJlLmdlb21ldHJ5LnR5cGUgIT09ICdNdWx0aVBvbHlnb24nKVxuICAgICAgKSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlLG5vLXVuZGVmXG4gICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICAnYm9vbGVhbk9wZXJhdGlvbiBvbmx5IHN1cHBvcnRlZCBmb3Igc2luZ2xlIFBvbHlnb24gb3IgTXVsdGlQb2x5Z29uIHNlbGVjdGlvbidcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGZlYXR1cmUgPSB7XG4gICAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgICAgZ2VvbWV0cnlcbiAgICAgIH07XG5cbiAgICAgIGxldCB1cGRhdGVkR2VvbWV0cnk7XG4gICAgICBpZiAobW9kZUNvbmZpZy5ib29sZWFuT3BlcmF0aW9uID09PSAndW5pb24nKSB7XG4gICAgICAgIHVwZGF0ZWRHZW9tZXRyeSA9IHR1cmZVbmlvbihzZWxlY3RlZEZlYXR1cmUsIGZlYXR1cmUpO1xuICAgICAgfSBlbHNlIGlmIChtb2RlQ29uZmlnLmJvb2xlYW5PcGVyYXRpb24gPT09ICdkaWZmZXJlbmNlJykge1xuICAgICAgICB1cGRhdGVkR2VvbWV0cnkgPSB0dXJmRGlmZmVyZW5jZShzZWxlY3RlZEZlYXR1cmUsIGZlYXR1cmUpO1xuICAgICAgfSBlbHNlIGlmIChtb2RlQ29uZmlnLmJvb2xlYW5PcGVyYXRpb24gPT09ICdpbnRlcnNlY3Rpb24nKSB7XG4gICAgICAgIHVwZGF0ZWRHZW9tZXRyeSA9IHR1cmZJbnRlcnNlY3Qoc2VsZWN0ZWRGZWF0dXJlLCBmZWF0dXJlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlLG5vLXVuZGVmXG4gICAgICAgIGNvbnNvbGUud2FybihgSW52YWxpZCBib29sZWFuT3BlcmF0aW9uICR7bW9kZUNvbmZpZy5ib29sZWFuT3BlcmF0aW9ufWApO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgaWYgKCF1cGRhdGVkR2VvbWV0cnkpIHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGUsbm8tdW5kZWZcbiAgICAgICAgY29uc29sZS53YXJuKCdDYW5jZWxpbmcgZWRpdC4gQm9vbGVhbiBvcGVyYXRpb24gZXJhc2VkIGVudGlyZSBwb2x5Z29uLicpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZmVhdHVyZUluZGV4ID0gdGhpcy5nZXRTZWxlY3RlZEZlYXR1cmVJbmRleGVzKClbMF07XG5cbiAgICAgIGNvbnN0IHVwZGF0ZWREYXRhID0gdGhpcy5nZXRJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbigpXG4gICAgICAgIC5yZXBsYWNlR2VvbWV0cnkoZmVhdHVyZUluZGV4LCB1cGRhdGVkR2VvbWV0cnkuZ2VvbWV0cnkpXG4gICAgICAgIC5nZXRPYmplY3QoKTtcblxuICAgICAgY29uc3QgZWRpdEFjdGlvbjogRWRpdEFjdGlvbiA9IHtcbiAgICAgICAgdXBkYXRlZERhdGEsXG4gICAgICAgIGVkaXRUeXBlOiAndW5pb25HZW9tZXRyeScsXG4gICAgICAgIGZlYXR1cmVJbmRleGVzOiBbZmVhdHVyZUluZGV4XSxcbiAgICAgICAgZWRpdENvbnRleHQ6IG51bGxcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBlZGl0QWN0aW9uO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5nZXRBZGRGZWF0dXJlQWN0aW9uKGdlb21ldHJ5KTtcbiAgfVxuXG4gIGhhbmRsZUNsaWNrKGV2ZW50OiBDbGlja0V2ZW50KTogP0VkaXRBY3Rpb24ge1xuICAgIHRoaXMuX2NsaWNrU2VxdWVuY2UucHVzaChldmVudC5ncm91bmRDb29yZHMpO1xuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBoYW5kbGVQb2ludGVyTW92ZShldmVudDogUG9pbnRlck1vdmVFdmVudCk6IHsgZWRpdEFjdGlvbjogP0VkaXRBY3Rpb24sIGNhbmNlbE1hcFBhbjogYm9vbGVhbiB9IHtcbiAgICByZXR1cm4geyBlZGl0QWN0aW9uOiBudWxsLCBjYW5jZWxNYXBQYW46IGZhbHNlIH07XG4gIH1cblxuICBoYW5kbGVTdGFydERyYWdnaW5nKGV2ZW50OiBTdGFydERyYWdnaW5nRXZlbnQpOiA/RWRpdEFjdGlvbiB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBoYW5kbGVTdG9wRHJhZ2dpbmcoZXZlbnQ6IFN0b3BEcmFnZ2luZ0V2ZW50KTogP0VkaXRBY3Rpb24ge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQaWNrZWRFZGl0SGFuZGxlKHBpY2tzOiA/KGFueVtdKSk6ID9FZGl0SGFuZGxlIHtcbiAgY29uc3QgaW5mbyA9IHBpY2tzICYmIHBpY2tzLmZpbmQocGljayA9PiBwaWNrLmlzRWRpdGluZ0hhbmRsZSk7XG4gIGlmIChpbmZvKSB7XG4gICAgcmV0dXJuIGluZm8ub2JqZWN0O1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SW50ZXJtZWRpYXRlUG9zaXRpb24ocG9zaXRpb24xOiBQb3NpdGlvbiwgcG9zaXRpb24yOiBQb3NpdGlvbik6IFBvc2l0aW9uIHtcbiAgY29uc3QgaW50ZXJtZWRpYXRlUG9zaXRpb24gPSBbXG4gICAgKHBvc2l0aW9uMVswXSArIHBvc2l0aW9uMlswXSkgLyAyLjAsXG4gICAgKHBvc2l0aW9uMVsxXSArIHBvc2l0aW9uMlsxXSkgLyAyLjBcbiAgXTtcbiAgcmV0dXJuIGludGVybWVkaWF0ZVBvc2l0aW9uO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RWRpdEhhbmRsZXNGb3JHZW9tZXRyeShcbiAgZ2VvbWV0cnk6IEdlb21ldHJ5LFxuICBmZWF0dXJlSW5kZXg6IG51bWJlcixcbiAgZWRpdEhhbmRsZVR5cGU6IEVkaXRIYW5kbGVUeXBlID0gJ2V4aXN0aW5nJ1xuKSB7XG4gIGxldCBoYW5kbGVzOiBFZGl0SGFuZGxlW10gPSBbXTtcblxuICBzd2l0Y2ggKGdlb21ldHJ5LnR5cGUpIHtcbiAgICBjYXNlICdQb2ludCc6XG4gICAgICAvLyBwb3NpdGlvbnMgYXJlIG5vdCBuZXN0ZWRcbiAgICAgIGhhbmRsZXMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICBwb3NpdGlvbjogZ2VvbWV0cnkuY29vcmRpbmF0ZXMsXG4gICAgICAgICAgcG9zaXRpb25JbmRleGVzOiBbXSxcbiAgICAgICAgICBmZWF0dXJlSW5kZXgsXG4gICAgICAgICAgdHlwZTogZWRpdEhhbmRsZVR5cGVcbiAgICAgICAgfVxuICAgICAgXTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ011bHRpUG9pbnQnOlxuICAgIGNhc2UgJ0xpbmVTdHJpbmcnOlxuICAgICAgLy8gcG9zaXRpb25zIGFyZSBuZXN0ZWQgMSBsZXZlbFxuICAgICAgaGFuZGxlcyA9IGhhbmRsZXMuY29uY2F0KFxuICAgICAgICBnZXRFZGl0SGFuZGxlc0ZvckNvb3JkaW5hdGVzKGdlb21ldHJ5LmNvb3JkaW5hdGVzLCBbXSwgZmVhdHVyZUluZGV4LCBlZGl0SGFuZGxlVHlwZSlcbiAgICAgICk7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdQb2x5Z29uJzpcbiAgICBjYXNlICdNdWx0aUxpbmVTdHJpbmcnOlxuICAgICAgLy8gcG9zaXRpb25zIGFyZSBuZXN0ZWQgMiBsZXZlbHNcbiAgICAgIGZvciAobGV0IGEgPSAwOyBhIDwgZ2VvbWV0cnkuY29vcmRpbmF0ZXMubGVuZ3RoOyBhKyspIHtcbiAgICAgICAgaGFuZGxlcyA9IGhhbmRsZXMuY29uY2F0KFxuICAgICAgICAgIGdldEVkaXRIYW5kbGVzRm9yQ29vcmRpbmF0ZXMoZ2VvbWV0cnkuY29vcmRpbmF0ZXNbYV0sIFthXSwgZmVhdHVyZUluZGV4LCBlZGl0SGFuZGxlVHlwZSlcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKGdlb21ldHJ5LnR5cGUgPT09ICdQb2x5Z29uJykge1xuICAgICAgICAgIC8vIERvbid0IHJlcGVhdCB0aGUgZmlyc3QvbGFzdCBoYW5kbGUgZm9yIFBvbHlnb25zXG4gICAgICAgICAgaGFuZGxlcyA9IGhhbmRsZXMuc2xpY2UoMCwgLTEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlICdNdWx0aVBvbHlnb24nOlxuICAgICAgLy8gcG9zaXRpb25zIGFyZSBuZXN0ZWQgMyBsZXZlbHNcbiAgICAgIGZvciAobGV0IGEgPSAwOyBhIDwgZ2VvbWV0cnkuY29vcmRpbmF0ZXMubGVuZ3RoOyBhKyspIHtcbiAgICAgICAgZm9yIChsZXQgYiA9IDA7IGIgPCBnZW9tZXRyeS5jb29yZGluYXRlc1thXS5sZW5ndGg7IGIrKykge1xuICAgICAgICAgIGhhbmRsZXMgPSBoYW5kbGVzLmNvbmNhdChcbiAgICAgICAgICAgIGdldEVkaXRIYW5kbGVzRm9yQ29vcmRpbmF0ZXMoXG4gICAgICAgICAgICAgIGdlb21ldHJ5LmNvb3JkaW5hdGVzW2FdW2JdLFxuICAgICAgICAgICAgICBbYSwgYl0sXG4gICAgICAgICAgICAgIGZlYXR1cmVJbmRleCxcbiAgICAgICAgICAgICAgZWRpdEhhbmRsZVR5cGVcbiAgICAgICAgICAgIClcbiAgICAgICAgICApO1xuICAgICAgICAgIC8vIERvbid0IHJlcGVhdCB0aGUgZmlyc3QvbGFzdCBoYW5kbGUgZm9yIFBvbHlnb25zXG4gICAgICAgICAgaGFuZGxlcyA9IGhhbmRsZXMuc2xpY2UoMCwgLTEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgRXJyb3IoYFVuaGFuZGxlZCBnZW9tZXRyeSB0eXBlOiAke2dlb21ldHJ5LnR5cGV9YCk7XG4gIH1cblxuICByZXR1cm4gaGFuZGxlcztcbn1cblxuZnVuY3Rpb24gZ2V0RWRpdEhhbmRsZXNGb3JDb29yZGluYXRlcyhcbiAgY29vcmRpbmF0ZXM6IGFueVtdLFxuICBwb3NpdGlvbkluZGV4UHJlZml4OiBudW1iZXJbXSxcbiAgZmVhdHVyZUluZGV4OiBudW1iZXIsXG4gIGVkaXRIYW5kbGVUeXBlOiBFZGl0SGFuZGxlVHlwZSA9ICdleGlzdGluZydcbik6IEVkaXRIYW5kbGVbXSB7XG4gIGNvbnN0IGVkaXRIYW5kbGVzID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY29vcmRpbmF0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBwb3NpdGlvbiA9IGNvb3JkaW5hdGVzW2ldO1xuICAgIGVkaXRIYW5kbGVzLnB1c2goe1xuICAgICAgcG9zaXRpb24sXG4gICAgICBwb3NpdGlvbkluZGV4ZXM6IFsuLi5wb3NpdGlvbkluZGV4UHJlZml4LCBpXSxcbiAgICAgIGZlYXR1cmVJbmRleCxcbiAgICAgIHR5cGU6IGVkaXRIYW5kbGVUeXBlXG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIGVkaXRIYW5kbGVzO1xufVxuIl19