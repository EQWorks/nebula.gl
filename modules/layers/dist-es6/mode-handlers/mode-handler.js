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
        featureIndexes: updatedIndexes,
        editContext: {
          featureIndexes: updatedIndexes
        }
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
          editContext: {
            featureIndexes: [featureIndex]
          }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL21vZGUtaGFuZGxlci5qcyJdLCJuYW1lcyI6WyJNb2RlSGFuZGxlciIsImZlYXR1cmVDb2xsZWN0aW9uIiwic2V0RmVhdHVyZUNvbGxlY3Rpb24iLCJnZXRPYmplY3QiLCJfc2VsZWN0ZWRGZWF0dXJlSW5kZXhlcyIsImxlbmd0aCIsImZlYXR1cmVzIiwiZmVhdHVyZSIsImdldFNlbGVjdGVkRmVhdHVyZSIsImdlb21ldHJ5Iiwic2VsZWN0ZWRGZWF0dXJlcyIsImdldFNlbGVjdGVkRmVhdHVyZUluZGV4ZXMiLCJtYXAiLCJzZWxlY3RlZEluZGV4IiwidHlwZSIsIkltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uIiwiX21vZGVDb25maWciLCJtb2RlQ29uZmlnIiwiX3NldFRlbnRhdGl2ZUZlYXR1cmUiLCJpbmRleGVzIiwiX2NsaWNrU2VxdWVuY2UiLCJfdGVudGF0aXZlRmVhdHVyZSIsInRlbnRhdGl2ZUZlYXR1cmUiLCJwaWNrcyIsImdyb3VuZENvb3JkcyIsImlzRHJhZ2dpbmciLCJwaWNrZWRJbmRleGVzIiwiaW5kZXgiLCJzZWxlY3RlZEZlYXR1cmVJbmRleGVzIiwic29tZSIsImluY2x1ZGVzIiwiZ2VvbWV0cnlBc0FueSIsInVwZGF0ZWREYXRhIiwiZ2V0SW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24iLCJhZGRGZWF0dXJlIiwicHJvcGVydGllcyIsImVkaXRUeXBlIiwiZmVhdHVyZUluZGV4ZXMiLCJlZGl0Q29udGV4dCIsImluaXRpYWxJbmRleCIsInVwZGF0ZWRJbmRleGVzIiwicHVzaCIsInNlbGVjdGVkRmVhdHVyZSIsImdldE1vZGVDb25maWciLCJib29sZWFuT3BlcmF0aW9uIiwiY29uc29sZSIsIndhcm4iLCJ1cGRhdGVkR2VvbWV0cnkiLCJmZWF0dXJlSW5kZXgiLCJyZXBsYWNlR2VvbWV0cnkiLCJlZGl0QWN0aW9uIiwiZ2V0QWRkRmVhdHVyZUFjdGlvbiIsImV2ZW50IiwiY2FuY2VsTWFwUGFuIiwiZ2V0UGlja2VkRWRpdEhhbmRsZSIsImluZm8iLCJmaW5kIiwicGljayIsImlzRWRpdGluZ0hhbmRsZSIsIm9iamVjdCIsImdldEludGVybWVkaWF0ZVBvc2l0aW9uIiwicG9zaXRpb24xIiwicG9zaXRpb24yIiwiaW50ZXJtZWRpYXRlUG9zaXRpb24iLCJnZXRFZGl0SGFuZGxlc0Zvckdlb21ldHJ5IiwiZWRpdEhhbmRsZVR5cGUiLCJoYW5kbGVzIiwicG9zaXRpb24iLCJjb29yZGluYXRlcyIsInBvc2l0aW9uSW5kZXhlcyIsImNvbmNhdCIsImdldEVkaXRIYW5kbGVzRm9yQ29vcmRpbmF0ZXMiLCJhIiwic2xpY2UiLCJiIiwiRXJyb3IiLCJwb3NpdGlvbkluZGV4UHJlZml4IiwiZWRpdEhhbmRsZXMiLCJpIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBSUE7O0FBQ0E7O0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBZ0NhQSxXOzs7QUFDWDtBQU9BLHVCQUFZQyxpQkFBWixFQUFtRDtBQUFBOztBQUFBOztBQUFBOztBQUFBLHlDQUpoQyxJQUlnQzs7QUFBQSxxREFIZixFQUdlOztBQUFBLDRDQUZ0QixFQUVzQjs7QUFDakQsUUFBSUEsaUJBQUosRUFBdUI7QUFDckIsV0FBS0Msb0JBQUwsQ0FBMEJELGlCQUExQjtBQUNEO0FBQ0Y7Ozs7MkNBRXlDO0FBQ3hDLGFBQU8sS0FBS0EsaUJBQUwsQ0FBdUJFLFNBQXZCLEVBQVA7QUFDRDs7O29EQUUyRDtBQUMxRCxhQUFPLEtBQUtGLGlCQUFaO0FBQ0Q7Ozt5Q0FFOEI7QUFDN0IsVUFBSSxLQUFLRyx1QkFBTCxDQUE2QkMsTUFBN0IsS0FBd0MsQ0FBNUMsRUFBK0M7QUFDN0MsZUFBTyxLQUFLSixpQkFBTCxDQUF1QkUsU0FBdkIsR0FBbUNHLFFBQW5DLENBQTRDLEtBQUtGLHVCQUFMLENBQTZCLENBQTdCLENBQTVDLENBQVA7QUFDRDs7QUFDRCxhQUFPLElBQVA7QUFDRDs7OzBDQUVnQztBQUMvQixVQUFNRyxPQUFPLEdBQUcsS0FB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QVN2RDs7QUFDQUMsVUFBQUEsT0FBTyxHQUFHQSxPQUFPLENBQUNPLEtBQVIsQ0FBYyxDQUFkLEVBQWlCLENBQUMsQ0FBbEIsQ0FBVjtBQUNEO0FBQ0Y7O0FBQ0Q7O0FBQ0Y7QUFDRSxZQUFNRSxLQUFLLG9DQUE2QmxFLFFBQVEsQ0FBQ0ssSUFBdEMsRUFBWDtBQWxESjs7QUFxREEsU0FBT29ELE9BQVA7QUFDRDs7QUFFRCxTQUFTSyw0QkFBVCxDQUNFSCxXQURGLEVBRUVRLG1CQUZGLEVBR0U1QixZQUhGLEVBS2dCO0FBQUEsTUFEZGlCLGNBQ2MsdUVBRG1CLFVBQ25CO0FBQ2QsTUFBTVksV0FBVyxHQUFHLEVBQXBCOztBQUNBLE9BQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR1YsV0FBVyxDQUFDL0QsTUFBaEMsRUFBd0N5RSxDQUFDLEVBQXpDLEVBQTZDO0FBQzNDLFFBQU1YLFFBQVEsR0FBR0MsV0FBVyxDQUFDVSxDQUFELENBQTVCO0FBQ0FELElBQUFBLFdBQVcsQ0FBQ3BDLElBQVosQ0FBaUI7QUFDZjBCLE1BQUFBLFFBQVEsRUFBUkEsUUFEZTtBQUVmRSxNQUFBQSxlQUFlLHFCQUFNTyxtQkFBTixVQUEyQkUsQ0FBM0IsRUFGQTtBQUdmOUIsTUFBQUEsWUFBWSxFQUFaQSxZQUhlO0FBSWZsQyxNQUFBQSxJQUFJLEVBQUVtRDtBQUpTLEtBQWpCO0FBTUQ7O0FBQ0QsU0FBT1ksV0FBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuLy8gVE9ETyBlZGl0LW1vZGVzOiBkZWxldGUgaGFuZGxlcnMgb25jZSBFZGl0TW9kZSBmdWxseSBpbXBsZW1lbnRlZFxuXG5pbXBvcnQgdHVyZlVuaW9uIGZyb20gJ0B0dXJmL3VuaW9uJztcbmltcG9ydCB0dXJmRGlmZmVyZW5jZSBmcm9tICdAdHVyZi9kaWZmZXJlbmNlJztcbmltcG9ydCB0dXJmSW50ZXJzZWN0IGZyb20gJ0B0dXJmL2ludGVyc2VjdCc7XG5cbmltcG9ydCB7IEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uIH0gZnJvbSAnQG5lYnVsYS5nbC9lZGl0LW1vZGVzJztcbmltcG9ydCB0eXBlIHtcbiAgRmVhdHVyZUNvbGxlY3Rpb24sXG4gIEZlYXR1cmUsXG4gIFBvbHlnb24sXG4gIEdlb21ldHJ5LFxuICBQb3NpdGlvblxufSBmcm9tICdAbmVidWxhLmdsL2VkaXQtbW9kZXMnO1xuaW1wb3J0IHR5cGUge1xuICBDbGlja0V2ZW50LFxuICBQb2ludGVyTW92ZUV2ZW50LFxuICBTdGFydERyYWdnaW5nRXZlbnQsXG4gIFN0b3BEcmFnZ2luZ0V2ZW50LFxuICBEZWNrR0xQaWNrXG59IGZyb20gJy4uL2V2ZW50LXR5cGVzLmpzJztcblxuZXhwb3J0IHR5cGUgRWRpdEhhbmRsZVR5cGUgPSAnZXhpc3RpbmcnIHwgJ2ludGVybWVkaWF0ZScgfCAnc25hcCc7XG5cbmV4cG9ydCB0eXBlIEVkaXRIYW5kbGUgPSB7XG4gIHBvc2l0aW9uOiBQb3NpdGlvbixcbiAgcG9zaXRpb25JbmRleGVzOiBudW1iZXJbXSxcbiAgZmVhdHVyZUluZGV4OiBudW1iZXIsXG4gIHR5cGU6IEVkaXRIYW5kbGVUeXBlXG59O1xuXG5leHBvcnQgdHlwZSBFZGl0QWN0aW9uID0ge1xuICB1cGRhdGVkRGF0YTogRmVhdHVyZUNvbGxlY3Rpb24sXG4gIGVkaXRUeXBlOiBzdHJpbmcsXG4gIGZlYXR1cmVJbmRleGVzOiBudW1iZXJbXSxcbiAgZWRpdENvbnRleHQ6IGFueVxufTtcblxuZXhwb3J0IGNsYXNzIE1vZGVIYW5kbGVyIHtcbiAgLy8gVE9ETzogYWRkIHVuZGVyc2NvcmVcbiAgZmVhdHVyZUNvbGxlY3Rpb246IEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uO1xuICBfdGVudGF0aXZlRmVhdHVyZTogP0ZlYXR1cmU7XG4gIF9tb2RlQ29uZmlnOiBhbnkgPSBudWxsO1xuICBfc2VsZWN0ZWRGZWF0dXJlSW5kZXhlczogbnVtYmVyW10gPSBbXTtcbiAgX2NsaWNrU2VxdWVuY2U6IFBvc2l0aW9uW10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihmZWF0dXJlQ29sbGVjdGlvbj86IEZlYXR1cmVDb2xsZWN0aW9uKSB7XG4gICAgaWYgKGZlYXR1cmVDb2xsZWN0aW9uKSB7XG4gICAgICB0aGlzLnNldEZlYXR1cmVDb2xsZWN0aW9uKGZlYXR1cmVDb2xsZWN0aW9uKTtcbiAgICB9XG4gIH1cblxuICBnZXRGZWF0dXJlQ29sbGVjdGlvbigpOiBGZWF0dXJlQ29sbGVjdGlvbiB7XG4gICAgcmV0dXJuIHRoaXMuZmVhdHVyZUNvbGxlY3Rpb24uZ2V0T2JqZWN0KCk7XG4gIH1cblxuICBnZXRJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbigpOiBJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbiB7XG4gICAgcmV0dXJuIHRoaXMuZmVhdHVyZUNvbGxlY3Rpb247XG4gIH1cblxuICBnZXRTZWxlY3RlZEZlYXR1cmUoKTogP0ZlYXR1cmUge1xuICAgIGlmICh0aGlzLl9zZWxlY3RlZEZlYXR1cmVJbmRleGVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgcmV0dXJuIHRoaXMuZmVhdHVyZUNvbGxlY3Rpb24uZ2V0T2JqZWN0KCkuZmVhdHVyZXNbdGhpcy5fc2VsZWN0ZWRGZWF0dXJlSW5kZXhlc1swXV07XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZ2V0U2VsZWN0ZWRHZW9tZXRyeSgpOiA/R2VvbWV0cnkge1xuICAgIGNvbnN0IGZlYXR1cmUgPSB0aGlzLmdldFNlbGVjdGVkRmVhdHVyZSgpO1xuICAgIGlmIChmZWF0dXJlKSB7XG4gICAgICByZXR1cm4gZmVhdHVyZS5nZW9tZXRyeTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBnZXRTZWxlY3RlZEZlYXR1cmVzQXNGZWF0dXJlQ29sbGVjdGlvbigpOiBGZWF0dXJlQ29sbGVjdGlvbiB7XG4gICAgY29uc3QgeyBmZWF0dXJlcyB9ID0gdGhpcy5mZWF0dXJlQ29sbGVjdGlvbi5nZXRPYmplY3QoKTtcbiAgICBjb25zdCBzZWxlY3RlZEZlYXR1cmVzID0gdGhpcy5nZXRTZWxlY3RlZEZlYXR1cmVJbmRleGVzKCkubWFwKFxuICAgICAgc2VsZWN0ZWRJbmRleCA9PiBmZWF0dXJlc1tzZWxlY3RlZEluZGV4XVxuICAgICk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6ICdGZWF0dXJlQ29sbGVjdGlvbicsXG4gICAgICBmZWF0dXJlczogc2VsZWN0ZWRGZWF0dXJlc1xuICAgIH07XG4gIH1cblxuICBzZXRGZWF0dXJlQ29sbGVjdGlvbihmZWF0dXJlQ29sbGVjdGlvbjogRmVhdHVyZUNvbGxlY3Rpb24pOiB2b2lkIHtcbiAgICB0aGlzLmZlYXR1cmVDb2xsZWN0aW9uID0gbmV3IEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uKGZlYXR1cmVDb2xsZWN0aW9uKTtcbiAgfVxuXG4gIGdldE1vZGVDb25maWcoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5fbW9kZUNvbmZpZztcbiAgfVxuXG4gIHNldE1vZGVDb25maWcobW9kZUNvbmZpZzogYW55KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX21vZGVDb25maWcgPT09IG1vZGVDb25maWcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9tb2RlQ29uZmlnID0gbW9kZUNvbmZpZztcbiAgICB0aGlzLl9zZXRUZW50YXRpdmVGZWF0dXJlKG51bGwpO1xuICB9XG5cbiAgZ2V0U2VsZWN0ZWRGZWF0dXJlSW5kZXhlcygpOiBudW1iZXJbXSB7XG4gICAgcmV0dXJuIHRoaXMuX3NlbGVjdGVkRmVhdHVyZUluZGV4ZXM7XG4gIH1cblxuICBzZXRTZWxlY3RlZEZlYXR1cmVJbmRleGVzKGluZGV4ZXM6IG51bWJlcltdKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX3NlbGVjdGVkRmVhdHVyZUluZGV4ZXMgPT09IGluZGV4ZXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9zZWxlY3RlZEZlYXR1cmVJbmRleGVzID0gaW5kZXhlcztcbiAgICB0aGlzLl9zZXRUZW50YXRpdmVGZWF0dXJlKG51bGwpO1xuICB9XG5cbiAgZ2V0Q2xpY2tTZXF1ZW5jZSgpOiBQb3NpdGlvbltdIHtcbiAgICByZXR1cm4gdGhpcy5fY2xpY2tTZXF1ZW5jZTtcbiAgfVxuXG4gIHJlc2V0Q2xpY2tTZXF1ZW5jZSgpOiB2b2lkIHtcbiAgICB0aGlzLl9jbGlja1NlcXVlbmNlID0gW107XG4gIH1cblxuICBnZXRUZW50YXRpdmVGZWF0dXJlKCk6ID9GZWF0dXJlIHtcbiAgICByZXR1cm4gdGhpcy5fdGVudGF0aXZlRmVhdHVyZTtcbiAgfVxuXG4gIC8vIFRPRE86IHJlbW92ZSB0aGUgdW5kZXJzY29yZVxuICBfc2V0VGVudGF0aXZlRmVhdHVyZSh0ZW50YXRpdmVGZWF0dXJlOiA/RmVhdHVyZSk6IHZvaWQge1xuICAgIHRoaXMuX3RlbnRhdGl2ZUZlYXR1cmUgPSB0ZW50YXRpdmVGZWF0dXJlO1xuICAgIGlmICghdGVudGF0aXZlRmVhdHVyZSkge1xuICAgICAgLy8gUmVzZXQgdGhlIGNsaWNrIHNlcXVlbmNlXG4gICAgICB0aGlzLl9jbGlja1NlcXVlbmNlID0gW107XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBmbGF0IGFycmF5IG9mIHBvc2l0aW9ucyBmb3IgdGhlIGdpdmVuIGZlYXR1cmUgYWxvbmcgd2l0aCB0aGVpciBpbmRleGVzIGludG8gdGhlIGZlYXR1cmUncyBnZW9tZXRyeSdzIGNvb3JkaW5hdGVzLlxuICAgKlxuICAgKiBAcGFyYW0gZmVhdHVyZUluZGV4IFRoZSBpbmRleCBvZiB0aGUgZmVhdHVyZSB0byBnZXQgZWRpdCBoYW5kbGVzXG4gICAqL1xuICBnZXRFZGl0SGFuZGxlcyhwaWNrcz86IEFycmF5PE9iamVjdD4sIGdyb3VuZENvb3Jkcz86IFBvc2l0aW9uKTogRWRpdEhhbmRsZVtdIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBnZXRDdXJzb3IoeyBpc0RyYWdnaW5nIH06IHsgaXNEcmFnZ2luZzogYm9vbGVhbiB9KTogc3RyaW5nIHtcbiAgICByZXR1cm4gJ2NlbGwnO1xuICB9XG5cbiAgaXNTZWxlY3Rpb25QaWNrZWQocGlja3M6IERlY2tHTFBpY2tbXSk6IGJvb2xlYW4ge1xuICAgIGlmICghcGlja3MubGVuZ3RoKSByZXR1cm4gZmFsc2U7XG4gICAgY29uc3QgcGlja2VkSW5kZXhlcyA9IHBpY2tzLm1hcCgoeyBpbmRleCB9KSA9PiBpbmRleCk7XG4gICAgY29uc3Qgc2VsZWN0ZWRGZWF0dXJlSW5kZXhlcyA9IHRoaXMuZ2V0U2VsZWN0ZWRGZWF0dXJlSW5kZXhlcygpO1xuICAgIHJldHVybiBzZWxlY3RlZEZlYXR1cmVJbmRleGVzLnNvbWUoaW5kZXggPT4gcGlja2VkSW5kZXhlcy5pbmNsdWRlcyhpbmRleCkpO1xuICB9XG5cbiAgZ2V0QWRkRmVhdHVyZUFjdGlvbihnZW9tZXRyeTogR2VvbWV0cnkpOiBFZGl0QWN0aW9uIHtcbiAgICAvLyBVbnN1cmUgd2h5IGZsb3cgY2FuJ3QgZGVhbCB3aXRoIEdlb21ldHJ5IHR5cGUsIGJ1dCB0aGVyZSBJIGZpeGVkIGl0XG4gICAgY29uc3QgZ2VvbWV0cnlBc0FueTogYW55ID0gZ2VvbWV0cnk7XG5cbiAgICBjb25zdCB1cGRhdGVkRGF0YSA9IHRoaXMuZ2V0SW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24oKVxuICAgICAgLmFkZEZlYXR1cmUoe1xuICAgICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICAgIHByb3BlcnRpZXM6IHt9LFxuICAgICAgICBnZW9tZXRyeTogZ2VvbWV0cnlBc0FueVxuICAgICAgfSlcbiAgICAgIC5nZXRPYmplY3QoKTtcblxuICAgIHJldHVybiB7XG4gICAgICB1cGRhdGVkRGF0YSxcbiAgICAgIGVkaXRUeXBlOiAnYWRkRmVhdHVyZScsXG4gICAgICBmZWF0dXJlSW5kZXhlczogW3VwZGF0ZWREYXRhLmZlYXR1cmVzLmxlbmd0aCAtIDFdLFxuICAgICAgZWRpdENvbnRleHQ6IHtcbiAgICAgICAgZmVhdHVyZUluZGV4ZXM6IFt1cGRhdGVkRGF0YS5mZWF0dXJlcy5sZW5ndGggLSAxXVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBnZXRBZGRNYW55RmVhdHVyZXNBY3Rpb24oZmVhdHVyZUNvbGxlY3Rpb246IEZlYXR1cmVDb2xsZWN0aW9uKTogRWRpdEFjdGlvbiB7XG4gICAgY29uc3QgZmVhdHVyZXMgPSBmZWF0dXJlQ29sbGVjdGlvbi5mZWF0dXJlcztcbiAgICBsZXQgdXBkYXRlZERhdGEgPSB0aGlzLmdldEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uKCk7XG4gICAgY29uc3QgaW5pdGlhbEluZGV4ID0gdXBkYXRlZERhdGEuZ2V0T2JqZWN0KCkuZmVhdHVyZXMubGVuZ3RoO1xuICAgIGNvbnN0IHVwZGF0ZWRJbmRleGVzID0gW107XG4gICAgZm9yIChjb25zdCBmZWF0dXJlIG9mIGZlYXR1cmVzKSB7XG4gICAgICBjb25zdCB7IHByb3BlcnRpZXMsIGdlb21ldHJ5IH0gPSBmZWF0dXJlO1xuICAgICAgY29uc3QgZ2VvbWV0cnlBc0FueTogYW55ID0gZ2VvbWV0cnk7XG4gICAgICB1cGRhdGVkRGF0YSA9IHVwZGF0ZWREYXRhLmFkZEZlYXR1cmUoe1xuICAgICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICAgIHByb3BlcnRpZXMsXG4gICAgICAgIGdlb21ldHJ5OiBnZW9tZXRyeUFzQW55XG4gICAgICB9KTtcbiAgICAgIHVwZGF0ZWRJbmRleGVzLnB1c2goaW5pdGlhbEluZGV4ICsgdXBkYXRlZEluZGV4ZXMubGVuZ3RoKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgdXBkYXRlZERhdGE6IHVwZGF0ZWREYXRhLmdldE9iamVjdCgpLFxuICAgICAgZWRpdFR5cGU6ICdhZGRGZWF0dXJlJyxcbiAgICAgIGZlYXR1cmVJbmRleGVzOiB1cGRhdGVkSW5kZXhlcyxcbiAgICAgIGVkaXRDb250ZXh0OiB7XG4gICAgICAgIGZlYXR1cmVJbmRleGVzOiB1cGRhdGVkSW5kZXhlc1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBnZXRBZGRGZWF0dXJlT3JCb29sZWFuUG9seWdvbkFjdGlvbihnZW9tZXRyeTogUG9seWdvbik6ID9FZGl0QWN0aW9uIHtcbiAgICBjb25zdCBzZWxlY3RlZEZlYXR1cmUgPSB0aGlzLmdldFNlbGVjdGVkRmVhdHVyZSgpO1xuICAgIGNvbnN0IG1vZGVDb25maWcgPSB0aGlzLmdldE1vZGVDb25maWcoKTtcbiAgICBpZiAobW9kZUNvbmZpZyAmJiBtb2RlQ29uZmlnLmJvb2xlYW5PcGVyYXRpb24pIHtcbiAgICAgIGlmIChcbiAgICAgICAgIXNlbGVjdGVkRmVhdHVyZSB8fFxuICAgICAgICAoc2VsZWN0ZWRGZWF0dXJlLmdlb21ldHJ5LnR5cGUgIT09ICdQb2x5Z29uJyAmJlxuICAgICAgICAgIHNlbGVjdGVkRmVhdHVyZS5nZW9tZXRyeS50eXBlICE9PSAnTXVsdGlQb2x5Z29uJylcbiAgICAgICkge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZSxuby11bmRlZlxuICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgJ2Jvb2xlYW5PcGVyYXRpb24gb25seSBzdXBwb3J0ZWQgZm9yIHNpbmdsZSBQb2x5Z29uIG9yIE11bHRpUG9seWdvbiBzZWxlY3Rpb24nXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBmZWF0dXJlID0ge1xuICAgICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICAgIGdlb21ldHJ5XG4gICAgICB9O1xuXG4gICAgICBsZXQgdXBkYXRlZEdlb21ldHJ5O1xuICAgICAgaWYgKG1vZGVDb25maWcuYm9vbGVhbk9wZXJhdGlvbiA9PT0gJ3VuaW9uJykge1xuICAgICAgICB1cGRhdGVkR2VvbWV0cnkgPSB0dXJmVW5pb24oc2VsZWN0ZWRGZWF0dXJlLCBmZWF0dXJlKTtcbiAgICAgIH0gZWxzZSBpZiAobW9kZUNvbmZpZy5ib29sZWFuT3BlcmF0aW9uID09PSAnZGlmZmVyZW5jZScpIHtcbiAgICAgICAgdXBkYXRlZEdlb21ldHJ5ID0gdHVyZkRpZmZlcmVuY2Uoc2VsZWN0ZWRGZWF0dXJlLCBmZWF0dXJlKTtcbiAgICAgIH0gZWxzZSBpZiAobW9kZUNvbmZpZy5ib29sZWFuT3BlcmF0aW9uID09PSAnaW50ZXJzZWN0aW9uJykge1xuICAgICAgICB1cGRhdGVkR2VvbWV0cnkgPSB0dXJmSW50ZXJzZWN0KHNlbGVjdGVkRmVhdHVyZSwgZmVhdHVyZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZSxuby11bmRlZlxuICAgICAgICBjb25zb2xlLndhcm4oYEludmFsaWQgYm9vbGVhbk9wZXJhdGlvbiAke21vZGVDb25maWcuYm9vbGVhbk9wZXJhdGlvbn1gKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIGlmICghdXBkYXRlZEdlb21ldHJ5KSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlLG5vLXVuZGVmXG4gICAgICAgIGNvbnNvbGUud2FybignQ2FuY2VsaW5nIGVkaXQuIEJvb2xlYW4gb3BlcmF0aW9uIGVyYXNlZCBlbnRpcmUgcG9seWdvbi4nKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGZlYXR1cmVJbmRleCA9IHRoaXMuZ2V0U2VsZWN0ZWRGZWF0dXJlSW5kZXhlcygpWzBdO1xuXG4gICAgICBjb25zdCB1cGRhdGVkRGF0YSA9IHRoaXMuZ2V0SW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24oKVxuICAgICAgICAucmVwbGFjZUdlb21ldHJ5KGZlYXR1cmVJbmRleCwgdXBkYXRlZEdlb21ldHJ5Lmdlb21ldHJ5KVxuICAgICAgICAuZ2V0T2JqZWN0KCk7XG5cbiAgICAgIGNvbnN0IGVkaXRBY3Rpb246IEVkaXRBY3Rpb24gPSB7XG4gICAgICAgIHVwZGF0ZWREYXRhLFxuICAgICAgICBlZGl0VHlwZTogJ3VuaW9uR2VvbWV0cnknLFxuICAgICAgICBmZWF0dXJlSW5kZXhlczogW2ZlYXR1cmVJbmRleF0sXG4gICAgICAgIGVkaXRDb250ZXh0OiB7XG4gICAgICAgICAgZmVhdHVyZUluZGV4ZXM6IFtmZWF0dXJlSW5kZXhdXG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBlZGl0QWN0aW9uO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5nZXRBZGRGZWF0dXJlQWN0aW9uKGdlb21ldHJ5KTtcbiAgfVxuXG4gIGhhbmRsZUNsaWNrKGV2ZW50OiBDbGlja0V2ZW50KTogP0VkaXRBY3Rpb24ge1xuICAgIHRoaXMuX2NsaWNrU2VxdWVuY2UucHVzaChldmVudC5ncm91bmRDb29yZHMpO1xuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBoYW5kbGVQb2ludGVyTW92ZShldmVudDogUG9pbnRlck1vdmVFdmVudCk6IHsgZWRpdEFjdGlvbjogP0VkaXRBY3Rpb24sIGNhbmNlbE1hcFBhbjogYm9vbGVhbiB9IHtcbiAgICByZXR1cm4geyBlZGl0QWN0aW9uOiBudWxsLCBjYW5jZWxNYXBQYW46IGZhbHNlIH07XG4gIH1cblxuICBoYW5kbGVTdGFydERyYWdnaW5nKGV2ZW50OiBTdGFydERyYWdnaW5nRXZlbnQpOiA/RWRpdEFjdGlvbiB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBoYW5kbGVTdG9wRHJhZ2dpbmcoZXZlbnQ6IFN0b3BEcmFnZ2luZ0V2ZW50KTogP0VkaXRBY3Rpb24ge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQaWNrZWRFZGl0SGFuZGxlKHBpY2tzOiA/KGFueVtdKSk6ID9FZGl0SGFuZGxlIHtcbiAgY29uc3QgaW5mbyA9IHBpY2tzICYmIHBpY2tzLmZpbmQocGljayA9PiBwaWNrLmlzRWRpdGluZ0hhbmRsZSk7XG4gIGlmIChpbmZvKSB7XG4gICAgcmV0dXJuIGluZm8ub2JqZWN0O1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SW50ZXJtZWRpYXRlUG9zaXRpb24ocG9zaXRpb24xOiBQb3NpdGlvbiwgcG9zaXRpb24yOiBQb3NpdGlvbik6IFBvc2l0aW9uIHtcbiAgY29uc3QgaW50ZXJtZWRpYXRlUG9zaXRpb24gPSBbXG4gICAgKHBvc2l0aW9uMVswXSArIHBvc2l0aW9uMlswXSkgLyAyLjAsXG4gICAgKHBvc2l0aW9uMVsxXSArIHBvc2l0aW9uMlsxXSkgLyAyLjBcbiAgXTtcbiAgcmV0dXJuIGludGVybWVkaWF0ZVBvc2l0aW9uO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RWRpdEhhbmRsZXNGb3JHZW9tZXRyeShcbiAgZ2VvbWV0cnk6IEdlb21ldHJ5LFxuICBmZWF0dXJlSW5kZXg6IG51bWJlcixcbiAgZWRpdEhhbmRsZVR5cGU6IEVkaXRIYW5kbGVUeXBlID0gJ2V4aXN0aW5nJ1xuKSB7XG4gIGxldCBoYW5kbGVzOiBFZGl0SGFuZGxlW10gPSBbXTtcblxuICBzd2l0Y2ggKGdlb21ldHJ5LnR5cGUpIHtcbiAgICBjYXNlICdQb2ludCc6XG4gICAgICAvLyBwb3NpdGlvbnMgYXJlIG5vdCBuZXN0ZWRcbiAgICAgIGhhbmRsZXMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICBwb3NpdGlvbjogZ2VvbWV0cnkuY29vcmRpbmF0ZXMsXG4gICAgICAgICAgcG9zaXRpb25JbmRleGVzOiBbXSxcbiAgICAgICAgICBmZWF0dXJlSW5kZXgsXG4gICAgICAgICAgdHlwZTogZWRpdEhhbmRsZVR5cGVcbiAgICAgICAgfVxuICAgICAgXTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ011bHRpUG9pbnQnOlxuICAgIGNhc2UgJ0xpbmVTdHJpbmcnOlxuICAgICAgLy8gcG9zaXRpb25zIGFyZSBuZXN0ZWQgMSBsZXZlbFxuICAgICAgaGFuZGxlcyA9IGhhbmRsZXMuY29uY2F0KFxuICAgICAgICBnZXRFZGl0SGFuZGxlc0ZvckNvb3JkaW5hdGVzKGdlb21ldHJ5LmNvb3JkaW5hdGVzLCBbXSwgZmVhdHVyZUluZGV4LCBlZGl0SGFuZGxlVHlwZSlcbiAgICAgICk7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdQb2x5Z29uJzpcbiAgICBjYXNlICdNdWx0aUxpbmVTdHJpbmcnOlxuICAgICAgLy8gcG9zaXRpb25zIGFyZSBuZXN0ZWQgMiBsZXZlbHNcbiAgICAgIGZvciAobGV0IGEgPSAwOyBhIDwgZ2VvbWV0cnkuY29vcmRpbmF0ZXMubGVuZ3RoOyBhKyspIHtcbiAgICAgICAgaGFuZGxlcyA9IGhhbmRsZXMuY29uY2F0KFxuICAgICAgICAgIGdldEVkaXRIYW5kbGVzRm9yQ29vcmRpbmF0ZXMoZ2VvbWV0cnkuY29vcmRpbmF0ZXNbYV0sIFthXSwgZmVhdHVyZUluZGV4LCBlZGl0SGFuZGxlVHlwZSlcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKGdlb21ldHJ5LnR5cGUgPT09ICdQb2x5Z29uJykge1xuICAgICAgICAgIC8vIERvbid0IHJlcGVhdCB0aGUgZmlyc3QvbGFzdCBoYW5kbGUgZm9yIFBvbHlnb25zXG4gICAgICAgICAgaGFuZGxlcyA9IGhhbmRsZXMuc2xpY2UoMCwgLTEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlICdNdWx0aVBvbHlnb24nOlxuICAgICAgLy8gcG9zaXRpb25zIGFyZSBuZXN0ZWQgMyBsZXZlbHNcbiAgICAgIGZvciAobGV0IGEgPSAwOyBhIDwgZ2VvbWV0cnkuY29vcmRpbmF0ZXMubGVuZ3RoOyBhKyspIHtcbiAgICAgICAgZm9yIChsZXQgYiA9IDA7IGIgPCBnZW9tZXRyeS5jb29yZGluYXRlc1thXS5sZW5ndGg7IGIrKykge1xuICAgICAgICAgIGhhbmRsZXMgPSBoYW5kbGVzLmNvbmNhdChcbiAgICAgICAgICAgIGdldEVkaXRIYW5kbGVzRm9yQ29vcmRpbmF0ZXMoXG4gICAgICAgICAgICAgIGdlb21ldHJ5LmNvb3JkaW5hdGVzW2FdW2JdLFxuICAgICAgICAgICAgICBbYSwgYl0sXG4gICAgICAgICAgICAgIGZlYXR1cmVJbmRleCxcbiAgICAgICAgICAgICAgZWRpdEhhbmRsZVR5cGVcbiAgICAgICAgICAgIClcbiAgICAgICAgICApO1xuICAgICAgICAgIC8vIERvbid0IHJlcGVhdCB0aGUgZmlyc3QvbGFzdCBoYW5kbGUgZm9yIFBvbHlnb25zXG4gICAgICAgICAgaGFuZGxlcyA9IGhhbmRsZXMuc2xpY2UoMCwgLTEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgRXJyb3IoYFVuaGFuZGxlZCBnZW9tZXRyeSB0eXBlOiAke2dlb21ldHJ5LnR5cGV9YCk7XG4gIH1cblxuICByZXR1cm4gaGFuZGxlcztcbn1cblxuZnVuY3Rpb24gZ2V0RWRpdEhhbmRsZXNGb3JDb29yZGluYXRlcyhcbiAgY29vcmRpbmF0ZXM6IGFueVtdLFxuICBwb3NpdGlvbkluZGV4UHJlZml4OiBudW1iZXJbXSxcbiAgZmVhdHVyZUluZGV4OiBudW1iZXIsXG4gIGVkaXRIYW5kbGVUeXBlOiBFZGl0SGFuZGxlVHlwZSA9ICdleGlzdGluZydcbik6IEVkaXRIYW5kbGVbXSB7XG4gIGNvbnN0IGVkaXRIYW5kbGVzID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY29vcmRpbmF0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBwb3NpdGlvbiA9IGNvb3JkaW5hdGVzW2ldO1xuICAgIGVkaXRIYW5kbGVzLnB1c2goe1xuICAgICAgcG9zaXRpb24sXG4gICAgICBwb3NpdGlvbkluZGV4ZXM6IFsuLi5wb3NpdGlvbkluZGV4UHJlZml4LCBpXSxcbiAgICAgIGZlYXR1cmVJbmRleCxcbiAgICAgIHR5cGU6IGVkaXRIYW5kbGVUeXBlXG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIGVkaXRIYW5kbGVzO1xufVxuIl19