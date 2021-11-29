"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ModifyMode = void 0;

var _nearestPointOnLine2 = _interopRequireDefault(require("@turf/nearest-point-on-line"));

var _helpers = require("@turf/helpers");

var _utils = require("../utils.js");

var _geojsonEditMode = require("./geojson-edit-mode.js");

var _immutableFeatureCollection = require("./immutable-feature-collection.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ModifyMode =
/*#__PURE__*/
function (_BaseGeoJsonEditMode) {
  _inherits(ModifyMode, _BaseGeoJsonEditMode);

  function ModifyMode() {
    _classCallCheck(this, ModifyMode);

    return _possibleConstructorReturn(this, _getPrototypeOf(ModifyMode).apply(this, arguments));
  }

  _createClass(ModifyMode, [{
    key: "getEditHandlesAdapter",
    value: function getEditHandlesAdapter(picks, mapCoords, props) {
      var _this = this;

      var handles = [];
      var features = props.data.features;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = props.selectedIndexes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _index = _step.value;

          if (_index < features.length) {
            var _handles;

            var geometry = features[_index].geometry;

            (_handles = handles).push.apply(_handles, _toConsumableArray((0, _geojsonEditMode.getEditHandlesForGeometry)(geometry, _index)));
          } else {
            console.warn("selectedFeatureIndexes out of range ".concat(_index)); // eslint-disable-line no-console,no-undef
          }
        } // intermediate edit handle

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

      if (picks && picks.length && mapCoords) {
        var existingEditHandle = (0, _geojsonEditMode.getPickedExistingEditHandle)(picks); // don't show intermediate point when too close to an existing edit handle

        var featureAsPick = !existingEditHandle && picks.find(function (pick) {
          return !pick.isGuide;
        }); // is the feature in the pick selected

        if (featureAsPick && !featureAsPick.object.geometry.type.includes('Point') && props.selectedIndexes.includes(featureAsPick.index)) {
          var intermediatePoint = null;
          var positionIndexPrefix = [];
          var referencePoint = (0, _helpers.point)(mapCoords); // process all lines of the (single) feature

          (0, _utils.recursivelyTraverseNestedArrays)(featureAsPick.object.geometry.coordinates, [], function (lineString, prefix) {
            var lineStringFeature = (0, _helpers.lineString)(lineString);

            var candidateIntermediatePoint = _this.nearestPointOnLine(lineStringFeature, referencePoint, props.modeConfig && props.modeConfig.viewport);

            if (!intermediatePoint || candidateIntermediatePoint.properties.dist < intermediatePoint.properties.dist) {
              intermediatePoint = candidateIntermediatePoint;
              positionIndexPrefix = prefix;
            }
          }); // tack on the lone intermediate point to the set of handles

          if (intermediatePoint) {
            var _intermediatePoint = intermediatePoint,
                position = _intermediatePoint.geometry.coordinates,
                index = _intermediatePoint.properties.index;
            handles = _toConsumableArray(handles).concat([{
              position: position,
              positionIndexes: _toConsumableArray(positionIndexPrefix).concat([index + 1]),
              featureIndex: featureAsPick.index,
              type: 'intermediate'
            }]);
          }
        }
      }

      return handles;
    } // turf.js does not support elevation for nearestPointOnLine

  }, {
    key: "nearestPointOnLine",
    value: function nearestPointOnLine(line, inPoint, viewport) {
      var coordinates = line.geometry.coordinates;

      if (coordinates.some(function (coord) {
        return coord.length > 2;
      })) {
        if (viewport) {
          // This line has elevation, we need to use alternative algorithm
          return (0, _utils.nearestPointOnProjectedLine)(line, inPoint, viewport);
        } // eslint-disable-next-line no-console,no-undef


        console.log('Editing 3D point but modeConfig.viewport not provided. Falling back to 2D logic.');
      }

      return (0, _nearestPointOnLine2.default)(line, inPoint);
    }
  }, {
    key: "handleClickAdapter",
    value: function handleClickAdapter(event, props) {
      var editAction = null;
      var pickedExistingHandle = (0, _geojsonEditMode.getPickedExistingEditHandle)(event.picks);
      var pickedIntermediateHandle = (0, _geojsonEditMode.getPickedIntermediateEditHandle)(event.picks);

      if (pickedExistingHandle) {
        var updatedData;

        try {
          updatedData = new _immutableFeatureCollection.ImmutableFeatureCollection(props.data).removePosition(pickedExistingHandle.featureIndex, pickedExistingHandle.positionIndexes).getObject();
        } catch (ignored) {// This happens if user attempts to remove the last point
        }

        if (updatedData) {
          editAction = {
            updatedData: updatedData,
            editType: 'removePosition',
            editContext: {
              featureIndexes: [pickedExistingHandle.featureIndex],
              positionIndexes: pickedExistingHandle.positionIndexes,
              position: pickedExistingHandle.position
            }
          };
        }
      } else if (pickedIntermediateHandle) {
        var _updatedData = new _immutableFeatureCollection.ImmutableFeatureCollection(props.data).addPosition(pickedIntermediateHandle.featureIndex, pickedIntermediateHandle.positionIndexes, pickedIntermediateHandle.position).getObject();

        if (_updatedData) {
          editAction = {
            updatedData: _updatedData,
            editType: 'addPosition',
            editContext: {
              featureIndexes: [pickedIntermediateHandle.featureIndex],
              positionIndexes: pickedIntermediateHandle.positionIndexes,
              position: pickedIntermediateHandle.position
            }
          };
        }
      }

      return editAction;
    }
  }, {
    key: "handlePointerMove",
    value: function handlePointerMove(event, props) {
      var editAction = null;
      var editHandle = (0, _geojsonEditMode.getPickedEditHandle)(event.pointerDownPicks);

      if (event.isDragging && editHandle) {
        var updatedData = new _immutableFeatureCollection.ImmutableFeatureCollection(props.data).replacePosition(editHandle.featureIndex, editHandle.positionIndexes, event.mapCoords).getObject();
        editAction = {
          updatedData: updatedData,
          editType: 'movePosition',
          editContext: {
            featureIndexes: [editHandle.featureIndex],
            positionIndexes: editHandle.positionIndexes,
            position: event.mapCoords
          }
        };
        props.onEdit(editAction);
      }

      var cursor = this.getCursor(event);
      props.onUpdateCursor(cursor); // Cancel map panning if pointer went down on an edit handle

      var cancelMapPan = Boolean(editHandle);

      if (cancelMapPan) {
        event.sourceEvent.stopPropagation();
      }
    }
  }, {
    key: "handleStartDraggingAdapter",
    value: function handleStartDraggingAdapter(event, props) {
      var editAction = null;
      var selectedFeatureIndexes = props.selectedIndexes;
      var editHandle = (0, _geojsonEditMode.getPickedIntermediateEditHandle)(event.picks);

      if (selectedFeatureIndexes.length && editHandle) {
        var updatedData = new _immutableFeatureCollection.ImmutableFeatureCollection(props.data).addPosition(editHandle.featureIndex, editHandle.positionIndexes, event.mapCoords).getObject();
        editAction = {
          updatedData: updatedData,
          editType: 'addPosition',
          editContext: {
            featureIndexes: [editHandle.featureIndex],
            positionIndexes: editHandle.positionIndexes,
            position: event.mapCoords
          }
        };
      }

      return editAction;
    }
  }, {
    key: "handleStopDraggingAdapter",
    value: function handleStopDraggingAdapter(event, props) {
      var editAction = null;
      var selectedFeatureIndexes = props.selectedIndexes;
      var editHandle = (0, _geojsonEditMode.getPickedEditHandle)(event.picks);

      if (selectedFeatureIndexes.length && editHandle) {
        var updatedData = new _immutableFeatureCollection.ImmutableFeatureCollection(props.data).replacePosition(editHandle.featureIndex, editHandle.positionIndexes, event.mapCoords).getObject();
        editAction = {
          updatedData: updatedData,
          editType: 'finishMovePosition',
          editContext: {
            featureIndexes: [editHandle.featureIndex],
            positionIndexes: editHandle.positionIndexes,
            position: event.mapCoords
          }
        };
      }

      return editAction;
    }
  }, {
    key: "getCursor",
    value: function getCursor(event) {
      var picks = event && event.picks || [];
      var handlesPicked = (0, _geojsonEditMode.getPickedEditHandles)(picks);

      if (handlesPicked.length) {
        return 'cell';
      }

      return null;
    }
  }]);

  return ModifyMode;
}(_geojsonEditMode.BaseGeoJsonEditMode);

exports.ModifyMode = ModifyMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvbW9kaWZ5LW1vZGUuanMiXSwibmFtZXMiOlsiTW9kaWZ5TW9kZSIsInBpY2tzIiwibWFwQ29vcmRzIiwicHJvcHMiLCJoYW5kbGVzIiwiZmVhdHVyZXMiLCJkYXRhIiwic2VsZWN0ZWRJbmRleGVzIiwiaW5kZXgiLCJsZW5ndGgiLCJnZW9tZXRyeSIsInB1c2giLCJjb25zb2xlIiwid2FybiIsImV4aXN0aW5nRWRpdEhhbmRsZSIsImZlYXR1cmVBc1BpY2siLCJmaW5kIiwicGljayIsImlzR3VpZGUiLCJvYmplY3QiLCJ0eXBlIiwiaW5jbHVkZXMiLCJpbnRlcm1lZGlhdGVQb2ludCIsInBvc2l0aW9uSW5kZXhQcmVmaXgiLCJyZWZlcmVuY2VQb2ludCIsImNvb3JkaW5hdGVzIiwibGluZVN0cmluZyIsInByZWZpeCIsImxpbmVTdHJpbmdGZWF0dXJlIiwiY2FuZGlkYXRlSW50ZXJtZWRpYXRlUG9pbnQiLCJuZWFyZXN0UG9pbnRPbkxpbmUiLCJtb2RlQ29uZmlnIiwidmlld3BvcnQiLCJwcm9wZXJ0aWVzIiwiZGlzdCIsInBvc2l0aW9uIiwicG9zaXRpb25JbmRleGVzIiwiZmVhdHVyZUluZGV4IiwibGluZSIsImluUG9pbnQiLCJzb21lIiwiY29vcmQiLCJsb2ciLCJldmVudCIsImVkaXRBY3Rpb24iLCJwaWNrZWRFeGlzdGluZ0hhbmRsZSIsInBpY2tlZEludGVybWVkaWF0ZUhhbmRsZSIsInVwZGF0ZWREYXRhIiwiSW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24iLCJyZW1vdmVQb3NpdGlvbiIsImdldE9iamVjdCIsImlnbm9yZWQiLCJlZGl0VHlwZSIsImVkaXRDb250ZXh0IiwiZmVhdHVyZUluZGV4ZXMiLCJhZGRQb3NpdGlvbiIsImVkaXRIYW5kbGUiLCJwb2ludGVyRG93blBpY2tzIiwiaXNEcmFnZ2luZyIsInJlcGxhY2VQb3NpdGlvbiIsIm9uRWRpdCIsImN1cnNvciIsImdldEN1cnNvciIsIm9uVXBkYXRlQ3Vyc29yIiwiY2FuY2VsTWFwUGFuIiwiQm9vbGVhbiIsInNvdXJjZUV2ZW50Iiwic3RvcFByb3BhZ2F0aW9uIiwic2VsZWN0ZWRGZWF0dXJlSW5kZXhlcyIsImhhbmRsZXNQaWNrZWQiLCJCYXNlR2VvSnNvbkVkaXRNb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBb0JBOztBQVVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFFYUEsVTs7Ozs7Ozs7Ozs7OzswQ0FFVEMsSyxFQUNBQyxTLEVBQ0FDLEssRUFDYztBQUFBOztBQUNkLFVBQUlDLE9BQU8sR0FBRyxFQUFkO0FBRGMsVUFFTkMsUUFGTSxHQUVPRixLQUFLLENBQUNHLElBRmIsQ0FFTkQsUUFGTTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUlkLDZCQUFvQkYsS0FBSyxDQUFDSSxlQUExQiw4SEFBMkM7QUFBQSxjQUFoQ0MsTUFBZ0M7O0FBQ3pDLGNBQUlBLE1BQUssR0FBR0gsUUFBUSxDQUFDSSxNQUFyQixFQUE2QjtBQUFBOztBQUFBLGdCQUNuQkMsUUFEbUIsR0FDTkwsUUFBUSxDQUFDRyxNQUFELENBREYsQ0FDbkJFLFFBRG1COztBQUUzQix3QkFBQU4sT0FBTyxFQUFDTyxJQUFSLG9DQUFnQixnREFBMEJELFFBQTFCLEVBQW9DRixNQUFwQyxDQUFoQjtBQUNELFdBSEQsTUFHTztBQUNMSSxZQUFBQSxPQUFPLENBQUNDLElBQVIsK0NBQW9ETCxNQUFwRCxHQURLLENBQ3lEO0FBQy9EO0FBQ0YsU0FYYSxDQWFkOztBQWJjO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBY2QsVUFBSVAsS0FBSyxJQUFJQSxLQUFLLENBQUNRLE1BQWYsSUFBeUJQLFNBQTdCLEVBQXdDO0FBQ3RDLFlBQU1ZLGtCQUFrQixHQUFHLGtEQUE0QmIsS0FBNUIsQ0FBM0IsQ0FEc0MsQ0FFdEM7O0FBQ0EsWUFBTWMsYUFBYSxHQUFHLENBQUNELGtCQUFELElB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V0FBVyxHQUFHLElBQUlDLHNEQUFKLENBQStCN0MsS0FBSyxDQUFDRyxJQUFyQyxFQUNqQnFELGVBRGlCLENBQ0RILFVBQVUsQ0FBQ25CLFlBRFYsRUFDd0JtQixVQUFVLENBQUNwQixlQURuQyxFQUNvRE8sS0FBSyxDQUFDekMsU0FEMUQsRUFFakJnRCxTQUZpQixFQUFwQjtBQUlBTixRQUFBQSxVQUFVLEdBQUc7QUFDWEcsVUFBQUEsV0FBVyxFQUFYQSxXQURXO0FBRVhLLFVBQUFBLFFBQVEsRUFBRSxvQkFGQztBQUdYQyxVQUFBQSxXQUFXLEVBQUU7QUFDWEMsWUFBQUEsY0FBYyxFQUFFLENBQUNFLFVBQVUsQ0FBQ25CLFlBQVosQ0FETDtBQUVYRCxZQUFBQSxlQUFlLEVBQUVvQixVQUFVLENBQUNwQixlQUZqQjtBQUdYRCxZQUFBQSxRQUFRLEVBQUVRLEtBQUssQ0FBQ3pDO0FBSEw7QUFIRixTQUFiO0FBU0Q7O0FBRUQsYUFBTzBDLFVBQVA7QUFDRDs7OzhCQUVTRCxLLEVBQWtDO0FBQzFDLFVBQU0xQyxLQUFLLEdBQUkwQyxLQUFLLElBQUlBLEtBQUssQ0FBQzFDLEtBQWhCLElBQTBCLEVBQXhDO0FBRUEsVUFBTW9FLGFBQWEsR0FBRywyQ0FBcUJwRSxLQUFyQixDQUF0Qjs7QUFDQSxVQUFJb0UsYUFBYSxDQUFDNUQsTUFBbEIsRUFBMEI7QUFDeEIsZUFBTyxNQUFQO0FBQ0Q7O0FBQ0QsYUFBTyxJQUFQO0FBQ0Q7Ozs7RUFuUDZCNkQsb0MiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuXG5pbXBvcnQgbmVhcmVzdFBvaW50T25MaW5lIGZyb20gJ0B0dXJmL25lYXJlc3QtcG9pbnQtb24tbGluZSc7XG5pbXBvcnQgeyBwb2ludCwgbGluZVN0cmluZyBhcyB0b0xpbmVTdHJpbmcgfSBmcm9tICdAdHVyZi9oZWxwZXJzJztcbmltcG9ydCB7XG4gIHJlY3Vyc2l2ZWx5VHJhdmVyc2VOZXN0ZWRBcnJheXMsXG4gIG5lYXJlc3RQb2ludE9uUHJvamVjdGVkTGluZSxcbiAgdHlwZSBOZWFyZXN0UG9pbnRUeXBlXG59IGZyb20gJy4uL3V0aWxzLmpzJztcbmltcG9ydCB0eXBlIHtcbiAgUG9zaXRpb24sXG4gIExpbmVTdHJpbmcsXG4gIFBvaW50LFxuICBGZWF0dXJlQ29sbGVjdGlvbixcbiAgRmVhdHVyZU9mXG59IGZyb20gJy4uL2dlb2pzb24tdHlwZXMuanMnO1xuaW1wb3J0IHR5cGUge1xuICBNb2RlUHJvcHMsXG4gIENsaWNrRXZlbnQsXG4gIFBvaW50ZXJNb3ZlRXZlbnQsXG4gIFN0YXJ0RHJhZ2dpbmdFdmVudCxcbiAgU3RvcERyYWdnaW5nRXZlbnQsXG4gIFZpZXdwb3J0XG59IGZyb20gJy4uL3R5cGVzLmpzJztcbmltcG9ydCB7XG4gIEJhc2VHZW9Kc29uRWRpdE1vZGUsXG4gIGdldFBpY2tlZEVkaXRIYW5kbGUsXG4gIGdldFBpY2tlZEVkaXRIYW5kbGVzLFxuICBnZXRQaWNrZWRFeGlzdGluZ0VkaXRIYW5kbGUsXG4gIGdldFBpY2tlZEludGVybWVkaWF0ZUVkaXRIYW5kbGUsXG4gIGdldEVkaXRIYW5kbGVzRm9yR2VvbWV0cnksXG4gIHR5cGUgR2VvSnNvbkVkaXRBY3Rpb24sXG4gIHR5cGUgRWRpdEhhbmRsZVxufSBmcm9tICcuL2dlb2pzb24tZWRpdC1tb2RlLmpzJztcbmltcG9ydCB7IEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uIH0gZnJvbSAnLi9pbW11dGFibGUtZmVhdHVyZS1jb2xsZWN0aW9uLmpzJztcblxuZXhwb3J0IGNsYXNzIE1vZGlmeU1vZGUgZXh0ZW5kcyBCYXNlR2VvSnNvbkVkaXRNb2RlIHtcbiAgZ2V0RWRpdEhhbmRsZXNBZGFwdGVyKFxuICAgIHBpY2tzOiA/QXJyYXk8T2JqZWN0PixcbiAgICBtYXBDb29yZHM6ID9Qb3NpdGlvbixcbiAgICBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPlxuICApOiBFZGl0SGFuZGxlW10ge1xuICAgIGxldCBoYW5kbGVzID0gW107XG4gICAgY29uc3QgeyBmZWF0dXJlcyB9ID0gcHJvcHMuZGF0YTtcblxuICAgIGZvciAoY29uc3QgaW5kZXggb2YgcHJvcHMuc2VsZWN0ZWRJbmRleGVzKSB7XG4gICAgICBpZiAoaW5kZXggPCBmZWF0dXJlcy5sZW5ndGgpIHtcbiAgICAgICAgY29uc3QgeyBnZW9tZXRyeSB9ID0gZmVhdHVyZXNbaW5kZXhdO1xuICAgICAgICBoYW5kbGVzLnB1c2goLi4uZ2V0RWRpdEhhbmRsZXNGb3JHZW9tZXRyeShnZW9tZXRyeSwgaW5kZXgpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUud2Fybihgc2VsZWN0ZWRGZWF0dXJlSW5kZXhlcyBvdXQgb2YgcmFuZ2UgJHtpbmRleH1gKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlLG5vLXVuZGVmXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gaW50ZXJtZWRpYXRlIGVkaXQgaGFuZGxlXG4gICAgaWYgKHBpY2tzICYmIHBpY2tzLmxlbmd0aCAmJiBtYXBDb29yZHMpIHtcbiAgICAgIGNvbnN0IGV4aXN0aW5nRWRpdEhhbmRsZSA9IGdldFBpY2tlZEV4aXN0aW5nRWRpdEhhbmRsZShwaWNrcyk7XG4gICAgICAvLyBkb24ndCBzaG93IGludGVybWVkaWF0ZSBwb2ludCB3aGVuIHRvbyBjbG9zZSB0byBhbiBleGlzdGluZyBlZGl0IGhhbmRsZVxuICAgICAgY29uc3QgZmVhdHVyZUFzUGljayA9ICFleGlzdGluZ0VkaXRIYW5kbGUgJiYgcGlja3MuZmluZChwaWNrID0+ICFwaWNrLmlzR3VpZGUpO1xuXG4gICAgICAvLyBpcyB0aGUgZmVhdHVyZSBpbiB0aGUgcGljayBzZWxlY3RlZFxuICAgICAgaWYgKFxuICAgICAgICBmZWF0dXJlQXNQaWNrICYmXG4gICAgICAgICFmZWF0dXJlQXNQaWNrLm9iamVjdC5nZW9tZXRyeS50eXBlLmluY2x1ZGVzKCdQb2ludCcpICYmXG4gICAgICAgIHByb3BzLnNlbGVjdGVkSW5kZXhlcy5pbmNsdWRlcyhmZWF0dXJlQXNQaWNrLmluZGV4KVxuICAgICAgKSB7XG4gICAgICAgIGxldCBpbnRlcm1lZGlhdGVQb2ludDogP05lYXJlc3RQb2ludFR5cGUgPSBudWxsO1xuICAgICAgICBsZXQgcG9zaXRpb25JbmRleFByZWZpeCA9IFtdO1xuICAgICAgICBjb25zdCByZWZlcmVuY2VQb2ludCA9IHBvaW50KG1hcENvb3Jkcyk7XG4gICAgICAgIC8vIHByb2Nlc3MgYWxsIGxpbmVzIG9mIHRoZSAoc2luZ2xlKSBmZWF0dXJlXG4gICAgICAgIHJlY3Vyc2l2ZWx5VHJhdmVyc2VOZXN0ZWRBcnJheXMoXG4gICAgICAgICAgZmVhdHVyZUFzUGljay5vYmplY3QuZ2VvbWV0cnkuY29vcmRpbmF0ZXMsXG4gICAgICAgICAgW10sXG4gICAgICAgICAgKGxpbmVTdHJpbmcsIHByZWZpeCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbGluZVN0cmluZ0ZlYXR1cmUgPSB0b0xpbmVTdHJpbmcobGluZVN0cmluZyk7XG4gICAgICAgICAgICBjb25zdCBjYW5kaWRhdGVJbnRlcm1lZGlhdGVQb2ludCA9IHRoaXMubmVhcmVzdFBvaW50T25MaW5lKFxuICAgICAgICAgICAgICBsaW5lU3RyaW5nRmVhdHVyZSxcbiAgICAgICAgICAgICAgcmVmZXJlbmNlUG9pbnQsXG4gICAgICAgICAgICAgIHByb3BzLm1vZGVDb25maWcgJiYgcHJvcHMubW9kZUNvbmZpZy52aWV3cG9ydFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgIWludGVybWVkaWF0ZVBvaW50IHx8XG4gICAgICAgICAgICAgIGNhbmRpZGF0ZUludGVybWVkaWF0ZVBvaW50LnByb3BlcnRpZXMuZGlzdCA8IGludGVybWVkaWF0ZVBvaW50LnByb3BlcnRpZXMuZGlzdFxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIGludGVybWVkaWF0ZVBvaW50ID0gY2FuZGlkYXRlSW50ZXJtZWRpYXRlUG9pbnQ7XG4gICAgICAgICAgICAgIHBvc2l0aW9uSW5kZXhQcmVmaXggPSBwcmVmaXg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgICAvLyB0YWNrIG9uIHRoZSBsb25lIGludGVybWVkaWF0ZSBwb2ludCB0byB0aGUgc2V0IG9mIGhhbmRsZXNcbiAgICAgICAgaWYgKGludGVybWVkaWF0ZVBvaW50KSB7XG4gICAgICAgICAgY29uc3Qge1xuICAgICAgICAgICAgZ2VvbWV0cnk6IHsgY29vcmRpbmF0ZXM6IHBvc2l0aW9uIH0sXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7IGluZGV4IH1cbiAgICAgICAgICB9ID0gaW50ZXJtZWRpYXRlUG9pbnQ7XG4gICAgICAgICAgaGFuZGxlcyA9IFtcbiAgICAgICAgICAgIC4uLmhhbmRsZXMsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHBvc2l0aW9uLFxuICAgICAgICAgICAgICBwb3NpdGlvbkluZGV4ZXM6IFsuLi5wb3NpdGlvbkluZGV4UHJlZml4LCBpbmRleCArIDFdLFxuICAgICAgICAgICAgICBmZWF0dXJlSW5kZXg6IGZlYXR1cmVBc1BpY2suaW5kZXgsXG4gICAgICAgICAgICAgIHR5cGU6ICdpbnRlcm1lZGlhdGUnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBoYW5kbGVzO1xuICB9XG5cbiAgLy8gdHVyZi5qcyBkb2VzIG5vdCBzdXBwb3J0IGVsZXZhdGlvbiBmb3IgbmVhcmVzdFBvaW50T25MaW5lXG4gIG5lYXJlc3RQb2ludE9uTGluZShcbiAgICBsaW5lOiBGZWF0dXJlT2Y8TGluZVN0cmluZz4sXG4gICAgaW5Qb2ludDogRmVhdHVyZU9mPFBvaW50PixcbiAgICB2aWV3cG9ydDogP1ZpZXdwb3J0XG4gICk6IE5lYXJlc3RQb2ludFR5cGUge1xuICAgIGNvbnN0IHsgY29vcmRpbmF0ZXMgfSA9IGxpbmUuZ2VvbWV0cnk7XG4gICAgaWYgKGNvb3JkaW5hdGVzLnNvbWUoY29vcmQgPT4gY29vcmQubGVuZ3RoID4gMikpIHtcbiAgICAgIGlmICh2aWV3cG9ydCkge1xuICAgICAgICAvLyBUaGlzIGxpbmUgaGFzIGVsZXZhdGlvbiwgd2UgbmVlZCB0byB1c2UgYWx0ZXJuYXRpdmUgYWxnb3JpdGhtXG4gICAgICAgIHJldHVybiBuZWFyZXN0UG9pbnRPblByb2plY3RlZExpbmUobGluZSwgaW5Qb2ludCwgdmlld3BvcnQpO1xuICAgICAgfVxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGUsbm8tdW5kZWZcbiAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAnRWRpdGluZyAzRCBwb2ludCBidXQgbW9kZUNvbmZpZy52aWV3cG9ydCBub3QgcHJvdmlkZWQuIEZhbGxpbmcgYmFjayB0byAyRCBsb2dpYy4nXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiBuZWFyZXN0UG9pbnRPbkxpbmUobGluZSwgaW5Qb2ludCk7XG4gIH1cblxuICBoYW5kbGVDbGlja0FkYXB0ZXIoZXZlbnQ6IENsaWNrRXZlbnQsIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KTogP0dlb0pzb25FZGl0QWN0aW9uIHtcbiAgICBsZXQgZWRpdEFjdGlvbjogP0dlb0pzb25FZGl0QWN0aW9uID0gbnVsbDtcblxuICAgIGNvbnN0IHBpY2tlZEV4aXN0aW5nSGFuZGxlID0gZ2V0UGlja2VkRXhpc3RpbmdFZGl0SGFuZGxlKGV2ZW50LnBpY2tzKTtcbiAgICBjb25zdCBwaWNrZWRJbnRlcm1lZGlhdGVIYW5kbGUgPSBnZXRQaWNrZWRJbnRlcm1lZGlhdGVFZGl0SGFuZGxlKGV2ZW50LnBpY2tzKTtcblxuICAgIGlmIChwaWNrZWRFeGlzdGluZ0hhbmRsZSkge1xuICAgICAgbGV0IHVwZGF0ZWREYXRhO1xuICAgICAgdHJ5IHtcbiAgICAgICAgdXBkYXRlZERhdGEgPSBuZXcgSW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24ocHJvcHMuZGF0YSlcbiAgICAgICAgICAucmVtb3ZlUG9zaXRpb24ocGlja2VkRXhpc3RpbmdIYW5kbGUuZmVhdHVyZUluZGV4LCBwaWNrZWRFeGlzdGluZ0hhbmRsZS5wb3NpdGlvbkluZGV4ZXMpXG4gICAgICAgICAgLmdldE9iamVjdCgpO1xuICAgICAgfSBjYXRjaCAoaWdub3JlZCkge1xuICAgICAgICAvLyBUaGlzIGhhcHBlbnMgaWYgdXNlciBhdHRlbXB0cyB0byByZW1vdmUgdGhlIGxhc3QgcG9pbnRcbiAgICAgIH1cblxuICAgICAgaWYgKHVwZGF0ZWREYXRhKSB7XG4gICAgICAgIGVkaXRBY3Rpb24gPSB7XG4gICAgICAgICAgdXBkYXRlZERhdGEsXG4gICAgICAgICAgZWRpdFR5cGU6ICdyZW1vdmVQb3NpdGlvbicsXG4gICAgICAgICAgZWRpdENvbnRleHQ6IHtcbiAgICAgICAgICAgIGZlYXR1cmVJbmRleGVzOiBbcGlja2VkRXhpc3RpbmdIYW5kbGUuZmVhdHVyZUluZGV4XSxcbiAgICAgICAgICAgIHBvc2l0aW9uSW5kZXhlczogcGlja2VkRXhpc3RpbmdIYW5kbGUucG9zaXRpb25JbmRleGVzLFxuICAgICAgICAgICAgcG9zaXRpb246IHBpY2tlZEV4aXN0aW5nSGFuZGxlLnBvc2l0aW9uXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAocGlja2VkSW50ZXJtZWRpYXRlSGFuZGxlKSB7XG4gICAgICBjb25zdCB1cGRhdGVkRGF0YSA9IG5ldyBJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbihwcm9wcy5kYXRhKVxuICAgICAgICAuYWRkUG9zaXRpb24oXG4gICAgICAgICAgcGlja2VkSW50ZXJtZWRpYXRlSGFuZGxlLmZlYXR1cmVJbmRleCxcbiAgICAgICAgICBwaWNrZWRJbnRlcm1lZGlhdGVIYW5kbGUucG9zaXRpb25JbmRleGVzLFxuICAgICAgICAgIHBpY2tlZEludGVybWVkaWF0ZUhhbmRsZS5wb3NpdGlvblxuICAgICAgICApXG4gICAgICAgIC5nZXRPYmplY3QoKTtcblxuICAgICAgaWYgKHVwZGF0ZWREYXRhKSB7XG4gICAgICAgIGVkaXRBY3Rpb24gPSB7XG4gICAgICAgICAgdXBkYXRlZERhdGEsXG4gICAgICAgICAgZWRpdFR5cGU6ICdhZGRQb3NpdGlvbicsXG4gICAgICAgICAgZWRpdENvbnRleHQ6IHtcbiAgICAgICAgICAgIGZlYXR1cmVJbmRleGVzOiBbcGlja2VkSW50ZXJtZWRpYXRlSGFuZGxlLmZlYXR1cmVJbmRleF0sXG4gICAgICAgICAgICBwb3NpdGlvbkluZGV4ZXM6IHBpY2tlZEludGVybWVkaWF0ZUhhbmRsZS5wb3NpdGlvbkluZGV4ZXMsXG4gICAgICAgICAgICBwb3NpdGlvbjogcGlja2VkSW50ZXJtZWRpYXRlSGFuZGxlLnBvc2l0aW9uXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZWRpdEFjdGlvbjtcbiAgfVxuXG4gIGhhbmRsZVBvaW50ZXJNb3ZlKGV2ZW50OiBQb2ludGVyTW92ZUV2ZW50LCBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPik6IHZvaWQge1xuICAgIGxldCBlZGl0QWN0aW9uOiA/R2VvSnNvbkVkaXRBY3Rpb24gPSBudWxsO1xuXG4gICAgY29uc3QgZWRpdEhhbmRsZSA9IGdldFBpY2tlZEVkaXRIYW5kbGUoZXZlbnQucG9pbnRlckRvd25QaWNrcyk7XG5cbiAgICBpZiAoZXZlbnQuaXNEcmFnZ2luZyAmJiBlZGl0SGFuZGxlKSB7XG4gICAgICBjb25zdCB1cGRhdGVkRGF0YSA9IG5ldyBJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbihwcm9wcy5kYXRhKVxuICAgICAgICAucmVwbGFjZVBvc2l0aW9uKGVkaXRIYW5kbGUuZmVhdHVyZUluZGV4LCBlZGl0SGFuZGxlLnBvc2l0aW9uSW5kZXhlcywgZXZlbnQubWFwQ29vcmRzKVxuICAgICAgICAuZ2V0T2JqZWN0KCk7XG5cbiAgICAgIGVkaXRBY3Rpb24gPSB7XG4gICAgICAgIHVwZGF0ZWREYXRhLFxuICAgICAgICBlZGl0VHlwZTogJ21vdmVQb3NpdGlvbicsXG4gICAgICAgIGVkaXRDb250ZXh0OiB7XG4gICAgICAgICAgZmVhdHVyZUluZGV4ZXM6IFtlZGl0SGFuZGxlLmZlYXR1cmVJbmRleF0sXG4gICAgICAgICAgcG9zaXRpb25JbmRleGVzOiBlZGl0SGFuZGxlLnBvc2l0aW9uSW5kZXhlcyxcbiAgICAgICAgICBwb3NpdGlvbjogZXZlbnQubWFwQ29vcmRzXG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHByb3BzLm9uRWRpdChlZGl0QWN0aW9uKTtcbiAgICB9XG5cbiAgICBjb25zdCBjdXJzb3IgPSB0aGlzLmdldEN1cnNvcihldmVudCk7XG4gICAgcHJvcHMub25VcGRhdGVDdXJzb3IoY3Vyc29yKTtcblxuICAgIC8vIENhbmNlbCBtYXAgcGFubmluZyBpZiBwb2ludGVyIHdlbnQgZG93biBvbiBhbiBlZGl0IGhhbmRsZVxuICAgIGNvbnN0IGNhbmNlbE1hcFBhbiA9IEJvb2xlYW4oZWRpdEhhbmRsZSk7XG4gICAgaWYgKGNhbmNlbE1hcFBhbikge1xuICAgICAgZXZlbnQuc291cmNlRXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlU3RhcnREcmFnZ2luZ0FkYXB0ZXIoXG4gICAgZXZlbnQ6IFN0YXJ0RHJhZ2dpbmdFdmVudCxcbiAgICBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPlxuICApOiA/R2VvSnNvbkVkaXRBY3Rpb24ge1xuICAgIGxldCBlZGl0QWN0aW9uOiA/R2VvSnNvbkVkaXRBY3Rpb24gPSBudWxsO1xuXG4gICAgY29uc3Qgc2VsZWN0ZWRGZWF0dXJlSW5kZXhlcyA9IHByb3BzLnNlbGVjdGVkSW5kZXhlcztcblxuICAgIGNvbnN0IGVkaXRIYW5kbGUgPSBnZXRQaWNrZWRJbnRlcm1lZGlhdGVFZGl0SGFuZGxlKGV2ZW50LnBpY2tzKTtcbiAgICBpZiAoc2VsZWN0ZWRGZWF0dXJlSW5kZXhlcy5sZW5ndGggJiYgZWRpdEhhbmRsZSkge1xuICAgICAgY29uc3QgdXBkYXRlZERhdGEgPSBuZXcgSW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24ocHJvcHMuZGF0YSlcbiAgICAgICAgLmFkZFBvc2l0aW9uKGVkaXRIYW5kbGUuZmVhdHVyZUluZGV4LCBlZGl0SGFuZGxlLnBvc2l0aW9uSW5kZXhlcywgZXZlbnQubWFwQ29vcmRzKVxuICAgICAgICAuZ2V0T2JqZWN0KCk7XG5cbiAgICAgIGVkaXRBY3Rpb24gPSB7XG4gICAgICAgIHVwZGF0ZWREYXRhLFxuICAgICAgICBlZGl0VHlwZTogJ2FkZFBvc2l0aW9uJyxcbiAgICAgICAgZWRpdENvbnRleHQ6IHtcbiAgICAgICAgICBmZWF0dXJlSW5kZXhlczogW2VkaXRIYW5kbGUuZmVhdHVyZUluZGV4XSxcbiAgICAgICAgICBwb3NpdGlvbkluZGV4ZXM6IGVkaXRIYW5kbGUucG9zaXRpb25JbmRleGVzLFxuICAgICAgICAgIHBvc2l0aW9uOiBldmVudC5tYXBDb29yZHNcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gZWRpdEFjdGlvbjtcbiAgfVxuXG4gIGhhbmRsZVN0b3BEcmFnZ2luZ0FkYXB0ZXIoXG4gICAgZXZlbnQ6IFN0b3BEcmFnZ2luZ0V2ZW50LFxuICAgIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+XG4gICk6ID9HZW9Kc29uRWRpdEFjdGlvbiB7XG4gICAgbGV0IGVkaXRBY3Rpb246ID9HZW9Kc29uRWRpdEFjdGlvbiA9IG51bGw7XG5cbiAgICBjb25zdCBzZWxlY3RlZEZlYXR1cmVJbmRleGVzID0gcHJvcHMuc2VsZWN0ZWRJbmRleGVzO1xuICAgIGNvbnN0IGVkaXRIYW5kbGUgPSBnZXRQaWNrZWRFZGl0SGFuZGxlKGV2ZW50LnBpY2tzKTtcbiAgICBpZiAoc2VsZWN0ZWRGZWF0dXJlSW5kZXhlcy5sZW5ndGggJiYgZWRpdEhhbmRsZSkge1xuICAgICAgY29uc3QgdXBkYXRlZERhdGEgPSBuZXcgSW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24ocHJvcHMuZGF0YSlcbiAgICAgICAgLnJlcGxhY2VQb3NpdGlvbihlZGl0SGFuZGxlLmZlYXR1cmVJbmRleCwgZWRpdEhhbmRsZS5wb3NpdGlvbkluZGV4ZXMsIGV2ZW50Lm1hcENvb3JkcylcbiAgICAgICAgLmdldE9iamVjdCgpO1xuXG4gICAgICBlZGl0QWN0aW9uID0ge1xuICAgICAgICB1cGRhdGVkRGF0YSxcbiAgICAgICAgZWRpdFR5cGU6ICdmaW5pc2hNb3ZlUG9zaXRpb24nLFxuICAgICAgICBlZGl0Q29udGV4dDoge1xuICAgICAgICAgIGZlYXR1cmVJbmRleGVzOiBbZWRpdEhhbmRsZS5mZWF0dXJlSW5kZXhdLFxuICAgICAgICAgIHBvc2l0aW9uSW5kZXhlczogZWRpdEhhbmRsZS5wb3NpdGlvbkluZGV4ZXMsXG4gICAgICAgICAgcG9zaXRpb246IGV2ZW50Lm1hcENvb3Jkc1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBlZGl0QWN0aW9uO1xuICB9XG5cbiAgZ2V0Q3Vyc29yKGV2ZW50OiBQb2ludGVyTW92ZUV2ZW50KTogP3N0cmluZyB7XG4gICAgY29uc3QgcGlja3MgPSAoZXZlbnQgJiYgZXZlbnQucGlja3MpIHx8IFtdO1xuXG4gICAgY29uc3QgaGFuZGxlc1BpY2tlZCA9IGdldFBpY2tlZEVkaXRIYW5kbGVzKHBpY2tzKTtcbiAgICBpZiAoaGFuZGxlc1BpY2tlZC5sZW5ndGgpIHtcbiAgICAgIHJldHVybiAnY2VsbCc7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG59XG4iXX0=