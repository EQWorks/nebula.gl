"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ModifyHandler = void 0;

var _nearestPointOnLine = _interopRequireDefault(require("@turf/nearest-point-on-line"));

var _helpers = require("@turf/helpers");

var _utils = require("../utils.js");

var _modeHandler = require("./mode-handler.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// TODO edit-modes: delete handlers once EditMode fully implemented
class ModifyHandler extends _modeHandler.ModeHandler {
  constructor() {
    super(...arguments);

    _defineProperty(this, "_lastPointerMovePicks", void 0);
  }

  getEditHandles(picks, groundCoords) {
    var _this = this;

    var handles = [];

    var _this$featureCollecti = this.featureCollection.getObject(),
        features = _this$featureCollecti.features;

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = this.getSelectedFeatureIndexes()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _index = _step.value;

        if (_index < features.length) {
          var _handles;

          var geometry = features[_index].geometry;

          (_handles = handles).push.apply(_handles, _toConsumableArray((0, _modeHandler.getEditHandlesForGeometry)(geometry, _index)));
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

    if (picks && picks.length && groundCoords) {
      var existingEditHandle = picks.find(function (pick) {
        return pick.isEditingHandle && pick.object && pick.object.type === 'existing';
      }); // don't show intermediate point when too close to an existing edit handle

      var featureAsPick = !existingEditHandle && picks.find(function (pick) {
        return !pick.isEditingHandle;
      }); // is the feature in the pick selected

      if (featureAsPick && !featureAsPick.object.geometry.type.includes('Point') && this.getSelectedFeatureIndexes().includes(featureAsPick.index)) {
        var intermediatePoint = null;
        var positionIndexPrefix = [];
        var referencePoint = (0, _helpers.point)(groundCoords); // process all lines of the (single) feature

        (0, _utils.recursivelyTraverseNestedArrays)(featureAsPick.object.geometry.coordinates, [], function (lineString, prefix) {
          var lineStringFeature = (0, _helpers.lineString)(lineString);

          var candidateIntermediatePoint = _this.nearestPointOnLine(lineStringFeature, referencePoint);

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


  nearestPointOnLine(line, inPoint) {
    var coordinates = line.geometry.coordinates;

    if (coordinates.some(function (coord) {
      return coord.length > 2;
    })) {
      var modeConfig = this.getModeConfig();

      if (modeConfig && modeConfig.viewport) {
        // This line has elevation, we need to use alternative algorithm
        return (0, _utils.nearestPointOnProjectedLine)(line, inPoint, modeConfig.viewport);
      } // eslint-disable-next-line no-console,no-undef


      console.log('Editing 3D point but modeConfig.viewport not provided. Falling back to 2D logic.');
    }

    return (0, _nearestPointOnLine.default)(line, inPoint);
  }

  handleClick(event) {
    var editAction = null;
    var clickedEditHandle = (0, _modeHandler.getPickedEditHandle)(event.picks);

    if (clickedEditHandle && clickedEditHandle.featureIndex >= 0) {
      if (clickedEditHandle.type === 'existing') {
        var updatedData;

        try {
          updatedData = this.getImmutableFeatureCollection().removePosition(clickedEditHandle.featureIndex, clickedEditHandle.positionIndexes).getObject();
        } catch (ignored) {// This happens if user attempts to remove the last point
        }

        if (updatedData) {
          editAction = {
            updatedData: updatedData,
            editType: 'removePosition',
            featureIndexes: [clickedEditHandle.featureIndex],
            editContext: {
              positionIndexes: clickedEditHandle.positionIndexes,
              position: clickedEditHandle.position
            }
          };
        }
      } else if (clickedEditHandle.type === 'intermediate') {
        var _updatedData = this.getImmutableFeatureCollection().addPosition(clickedEditHandle.featureIndex, clickedEditHandle.positionIndexes, clickedEditHandle.position).getObject();

        if (_updatedData) {
          editAction = {
            updatedData: _updatedData,
            editType: 'addPosition',
            featureIndexes: [clickedEditHandle.featureIndex],
            editContext: {
              positionIndexes: clickedEditHandle.positionIndexes,
              position: clickedEditHandle.position
            }
          };
        }
      }
    }

    return editAction;
  }

  handlePointerMove(event) {
    this._lastPointerMovePicks = event.picks;
    var editAction = null;
    var editHandle = (0, _modeHandler.getPickedEditHandle)(event.pointerDownPicks);

    if (event.isDragging && editHandle) {
      var updatedData = this.getImmutableFeatureCollection().replacePosition(editHandle.featureIndex, editHandle.positionIndexes, event.groundCoords).getObject();
      editAction = {
        updatedData: updatedData,
        editType: 'movePosition',
        featureIndexes: [editHandle.featureIndex],
        editContext: {
          positionIndexes: editHandle.positionIndexes,
          position: event.groundCoords
        }
      };
    } // Cancel map panning if pointer went down on an edit handle


    var cancelMapPan = Boolean(editHandle);
    return {
      editAction: editAction,
      cancelMapPan: cancelMapPan
    };
  }

  handleStartDragging(event) {
    var editAction = null;
    var selectedFeatureIndexes = this.getSelectedFeatureIndexes();
    var editHandle = (0, _modeHandler.getPickedEditHandle)(event.picks);

    if (selectedFeatureIndexes.length && editHandle && editHandle.type === 'intermediate') {
      var updatedData = this.getImmutableFeatureCollection().addPosition(editHandle.featureIndex, editHandle.positionIndexes, event.groundCoords).getObject();
      editAction = {
        updatedData: updatedData,
        editType: 'addPosition',
        featureIndexes: [editHandle.featureIndex],
        editContext: {
          positionIndexes: editHandle.positionIndexes,
          position: event.groundCoords
        }
      };
    }

    return editAction;
  }

  handleStopDragging(event) {
    var editAction = null;
    var selectedFeatureIndexes = this.getSelectedFeatureIndexes();
    var editHandle = (0, _modeHandler.getPickedEditHandle)(event.picks);

    if (selectedFeatureIndexes.length && editHandle) {
      var updatedData = this.getImmutableFeatureCollection().replacePosition(editHandle.featureIndex, editHandle.positionIndexes, event.groundCoords).getObject();
      editAction = {
        updatedData: updatedData,
        editType: 'finishMovePosition',
        featureIndexes: [editHandle.featureIndex],
        editContext: {
          positionIndexes: editHandle.positionIndexes,
          position: event.groundCoords
        }
      };
    }

    return editAction;
  }

  getCursor(_ref) {
    var isDragging = _ref.isDragging;
    var picks = this._lastPointerMovePicks;

    if (picks && picks.length > 0) {
      var handlePicked = picks.some(function (pick) {
        return pick.isEditingHandle;
      });

      if (handlePicked) {
        return 'cell';
      }
    }

    return isDragging ? 'grabbing' : 'grab';
  }

}

exports.ModifyHandler = ModifyHandler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL21vZGlmeS1oYW5kbGVyLmpzIl0sIm5hbWVzIjpbIk1vZGlmeUhhbmRsZXIiLCJNb2RlSGFuZGxlciIsImdldEVkaXRIYW5kbGVzIiwicGlja3MiLCJncm91bmRDb29yZHMiLCJoYW5kbGVzIiwiZmVhdHVyZUNvbGxlY3Rpb24iLCJnZXRPYmplY3QiLCJmZWF0dXJlcyIsImdldFNlbGVjdGVkRmVhdHVyZUluZGV4ZXMiLCJpbmRleCIsImxlbmd0aCIsImdlb21ldHJ5IiwicHVzaCIsImNvbnNvbGUiLCJ3YXJuIiwiZXhpc3RpbmdFZGl0SGFuZGxlIiwiZmluZCIsInBpY2siLCJpc0VkaXRpbmdIYW5kbGUiLCJvYmplY3QiLCJ0eXBlIiwiZmVhdHVyZUFzUGljayIsImluY2x1ZGVzIiwiaW50ZXJtZWRpYXRlUG9pbnQiLCJwb3NpdGlvbkluZGV4UHJlZml4IiwicmVmZXJlbmNlUG9pbnQiLCJjb29yZGluYXRlcyIsImxpbmVTdHJpbmciLCJwcmVmaXgiLCJsaW5lU3RyaW5nRmVhdHVyZSIsImNhbmRpZGF0ZUludGVybWVkaWF0ZVBvaW50IiwibmVhcmVzdFBvaW50T25MaW5lIiwicHJvcGVydGllcyIsImRpc3QiLCJwb3NpdGlvbiIsInBvc2l0aW9uSW5kZXhlcyIsImZlYXR1cmVJbmRleCIsImxpbmUiLCJpblBvaW50Iiwic29tZSIsImNvb3JkIiwibW9kZUNvbmZpZyIsImdldE1vZGVDb25maWciLCJ2aWV3cG9ydCIsImxvZyIsImhhbmRsZUNsaWNrIiwiZXZlbnQiLCJlZGl0QWN0aW9uIiwiY2xpY2tlZEVkaXRIYW5kbGUiLCJ1cGRhdGVkRGF0YSIsImdldEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uIiwicmVtb3ZlUG9zaXRpb24iLCJpZ25vcmVkIiwiZWRpdFR5cGUiLCJmZWF0dXJlSW5kZXhlcyIsImVkaXRDb250ZXh0IiwiYWRkUG9zaXRpb24iLCJoYW5kbGVQb2ludGVyTW92ZSIsIl9sYXN0UG9pbnRlck1vdmVQaWNrcyIsImVkaXRIYW5kbGUiLCJwb2ludGVyRG93blBpY2tzIiwiaXNEcmFnZ2luZyIsInJlcGxhY2VQb3NpdGlvbiIsImNhbmNlbE1hcFBhbiIsIkJvb2xlYW4iLCJoYW5kbGVTdGFydERyYWdnaW5nIiwic2VsZWN0ZWRGZWF0dXJlSW5kZXhlcyIsImhhbmRsZVN0b3BEcmFnZ2luZyIsImdldEN1cnNvciIsImhhbmRsZVBpY2tlZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVBOztBQUNBOztBQUVBOztBQVlBOzs7Ozs7Ozs7Ozs7OztBQUVBO0FBQ08sTUFBTUEsYUFBTixTQUE0QkMsd0JBQTVCLENBQXdDO0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUc3Q0MsRUFBQUEsY0FBYyxDQUFDQyxLQUFELEVBQXdCQyxZQUF4QixFQUErRDtBQUFBOztBQUMzRSxRQUFJQyxPQUFPLEdBQUcsRUFBZDs7QUFEMkUsZ0NBRXRELEtBQUtDLGlCQUFMLENBQXVCQyxTQUF2QixFQUZzRDtBQUFBLFFBRW5FQyxRQUZtRSx5QkFFbkVBLFFBRm1FOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUkzRSwyQkFBb0IsS0FBS0MseUJBQUwsRUFBcEIsOEhBQXNEO0FBQUEsWUFBM0NDLE1BQTJDOztBQUNwRCxZQUFJQSxNQUFLLEdBQUdGLFFBQVEsQ0FBQ0csTUFBckIsRUFBNkI7QUFBQTs7QUFBQSxjQUNuQkMsUUFEbUIsR0FDTkosUUFBUSxDQUFDRSxNQUFELENBREYsQ0FDbkJFLFFBRG1COztBQUUzQixzQkFBQVAsT0FBTyxFQUFDUSxJQUFSLG9DQUFnQiw0Q0FBMEJELFFBQTFCLEVBQW9DRixNQUFwQyxDQUFoQjtBQUNELFNBSEQsTUFHTztBQUNMSSxVQUFBQSxPQUFPLENBQUNDLElBQVIsK0NBQW9ETCxNQUFwRCxHQURLLENBQ3lEO0FBQy9EO0FBQ0YsT0FYMEUsQ0FhM0U7O0FBYjJFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBYzNF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LE9BQWYsQ0FBckI7O0FBQ0EsVUFBSW1ELFlBQUosRUFBa0I7QUFDaEIsZUFBTyxNQUFQO0FBQ0Q7QUFDRjs7QUFFRCxXQUFPUixVQUFVLEdBQUcsVUFBSCxHQUFnQixNQUFqQztBQUNEOztBQXpPNEMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuXG5pbXBvcnQgbmVhcmVzdFBvaW50T25MaW5lIGZyb20gJ0B0dXJmL25lYXJlc3QtcG9pbnQtb24tbGluZSc7XG5pbXBvcnQgeyBwb2ludCwgbGluZVN0cmluZyBhcyB0b0xpbmVTdHJpbmcgfSBmcm9tICdAdHVyZi9oZWxwZXJzJztcbmltcG9ydCB0eXBlIHsgUG9zaXRpb24sIEZlYXR1cmVPZiwgUG9pbnQsIExpbmVTdHJpbmcgfSBmcm9tICdrZXBsZXItb3V0ZGF0ZWQtbmVidWxhLmdsLWVkaXQtbW9kZXMnO1xuaW1wb3J0IHtcbiAgcmVjdXJzaXZlbHlUcmF2ZXJzZU5lc3RlZEFycmF5cyxcbiAgbmVhcmVzdFBvaW50T25Qcm9qZWN0ZWRMaW5lLFxuICB0eXBlIE5lYXJlc3RQb2ludFR5cGVcbn0gZnJvbSAnLi4vdXRpbHMuanMnO1xuaW1wb3J0IHR5cGUge1xuICBDbGlja0V2ZW50LFxuICBQb2ludGVyTW92ZUV2ZW50LFxuICBTdGFydERyYWdnaW5nRXZlbnQsXG4gIFN0b3BEcmFnZ2luZ0V2ZW50XG59IGZyb20gJy4uL2V2ZW50LXR5cGVzLmpzJztcbmltcG9ydCB0eXBlIHsgRWRpdEFjdGlvbiwgRWRpdEhhbmRsZSB9IGZyb20gJy4vbW9kZS1oYW5kbGVyLmpzJztcbmltcG9ydCB7IE1vZGVIYW5kbGVyLCBnZXRQaWNrZWRFZGl0SGFuZGxlLCBnZXRFZGl0SGFuZGxlc0Zvckdlb21ldHJ5IH0gZnJvbSAnLi9tb2RlLWhhbmRsZXIuanMnO1xuXG4vLyBUT0RPIGVkaXQtbW9kZXM6IGRlbGV0ZSBoYW5kbGVycyBvbmNlIEVkaXRNb2RlIGZ1bGx5IGltcGxlbWVudGVkXG5leHBvcnQgY2xhc3MgTW9kaWZ5SGFuZGxlciBleHRlbmRzIE1vZGVIYW5kbGVyIHtcbiAgX2xhc3RQb2ludGVyTW92ZVBpY2tzOiAqO1xuXG4gIGdldEVkaXRIYW5kbGVzKHBpY2tzPzogQXJyYXk8T2JqZWN0PiwgZ3JvdW5kQ29vcmRzPzogUG9zaXRpb24pOiBFZGl0SGFuZGxlW10ge1xuICAgIGxldCBoYW5kbGVzID0gW107XG4gICAgY29uc3QgeyBmZWF0dXJlcyB9ID0gdGhpcy5mZWF0dXJlQ29sbGVjdGlvbi5nZXRPYmplY3QoKTtcblxuICAgIGZvciAoY29uc3QgaW5kZXggb2YgdGhpcy5nZXRTZWxlY3RlZEZlYXR1cmVJbmRleGVzKCkpIHtcbiAgICAgIGlmIChpbmRleCA8IGZlYXR1cmVzLmxlbmd0aCkge1xuICAgICAgICBjb25zdCB7IGdlb21ldHJ5IH0gPSBmZWF0dXJlc1tpbmRleF07XG4gICAgICAgIGhhbmRsZXMucHVzaCguLi5nZXRFZGl0SGFuZGxlc0Zvckdlb21ldHJ5KGdlb21ldHJ5LCBpbmRleCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS53YXJuKGBzZWxlY3RlZEZlYXR1cmVJbmRleGVzIG91dCBvZiByYW5nZSAke2luZGV4fWApOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGUsbm8tdW5kZWZcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBpbnRlcm1lZGlhdGUgZWRpdCBoYW5kbGVcbiAgICBpZiAocGlja3MgJiYgcGlja3MubGVuZ3RoICYmIGdyb3VuZENvb3Jkcykge1xuICAgICAgY29uc3QgZXhpc3RpbmdFZGl0SGFuZGxlID0gcGlja3MuZmluZChcbiAgICAgICAgcGljayA9PiBwaWNrLmlzRWRpdGluZ0hhbmRsZSAmJiBwaWNrLm9iamVjdCAmJiBwaWNrLm9iamVjdC50eXBlID09PSAnZXhpc3RpbmcnXG4gICAgICApO1xuICAgICAgLy8gZG9uJ3Qgc2hvdyBpbnRlcm1lZGlhdGUgcG9pbnQgd2hlbiB0b28gY2xvc2UgdG8gYW4gZXhpc3RpbmcgZWRpdCBoYW5kbGVcbiAgICAgIGNvbnN0IGZlYXR1cmVBc1BpY2sgPSAhZXhpc3RpbmdFZGl0SGFuZGxlICYmIHBpY2tzLmZpbmQocGljayA9PiAhcGljay5pc0VkaXRpbmdIYW5kbGUpO1xuXG4gICAgICAvLyBpcyB0aGUgZmVhdHVyZSBpbiB0aGUgcGljayBzZWxlY3RlZFxuICAgICAgaWYgKFxuICAgICAgICBmZWF0dXJlQXNQaWNrICYmXG4gICAgICAgICFmZWF0dXJlQXNQaWNrLm9iamVjdC5nZW9tZXRyeS50eXBlLmluY2x1ZGVzKCdQb2ludCcpICYmXG4gICAgICAgIHRoaXMuZ2V0U2VsZWN0ZWRGZWF0dXJlSW5kZXhlcygpLmluY2x1ZGVzKGZlYXR1cmVBc1BpY2suaW5kZXgpXG4gICAgICApIHtcbiAgICAgICAgbGV0IGludGVybWVkaWF0ZVBvaW50OiA/TmVhcmVzdFBvaW50VHlwZSA9IG51bGw7XG4gICAgICAgIGxldCBwb3NpdGlvbkluZGV4UHJlZml4ID0gW107XG4gICAgICAgIGNvbnN0IHJlZmVyZW5jZVBvaW50ID0gcG9pbnQoZ3JvdW5kQ29vcmRzKTtcbiAgICAgICAgLy8gcHJvY2VzcyBhbGwgbGluZXMgb2YgdGhlIChzaW5nbGUpIGZlYXR1cmVcbiAgICAgICAgcmVjdXJzaXZlbHlUcmF2ZXJzZU5lc3RlZEFycmF5cyhcbiAgICAgICAgICBmZWF0dXJlQXNQaWNrLm9iamVjdC5nZW9tZXRyeS5jb29yZGluYXRlcyxcbiAgICAgICAgICBbXSxcbiAgICAgICAgICAobGluZVN0cmluZywgcHJlZml4KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBsaW5lU3RyaW5nRmVhdHVyZSA9IHRvTGluZVN0cmluZyhsaW5lU3RyaW5nKTtcbiAgICAgICAgICAgIGNvbnN0IGNhbmRpZGF0ZUludGVybWVkaWF0ZVBvaW50ID0gdGhpcy5uZWFyZXN0UG9pbnRPbkxpbmUoXG4gICAgICAgICAgICAgIGxpbmVTdHJpbmdGZWF0dXJlLFxuICAgICAgICAgICAgICByZWZlcmVuY2VQb2ludFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgIWludGVybWVkaWF0ZVBvaW50IHx8XG4gICAgICAgICAgICAgIGNhbmRpZGF0ZUludGVybWVkaWF0ZVBvaW50LnByb3BlcnRpZXMuZGlzdCA8IGludGVybWVkaWF0ZVBvaW50LnByb3BlcnRpZXMuZGlzdFxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIGludGVybWVkaWF0ZVBvaW50ID0gY2FuZGlkYXRlSW50ZXJtZWRpYXRlUG9pbnQ7XG4gICAgICAgICAgICAgIHBvc2l0aW9uSW5kZXhQcmVmaXggPSBwcmVmaXg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgICAvLyB0YWNrIG9uIHRoZSBsb25lIGludGVybWVkaWF0ZSBwb2ludCB0byB0aGUgc2V0IG9mIGhhbmRsZXNcbiAgICAgICAgaWYgKGludGVybWVkaWF0ZVBvaW50KSB7XG4gICAgICAgICAgY29uc3Qge1xuICAgICAgICAgICAgZ2VvbWV0cnk6IHsgY29vcmRpbmF0ZXM6IHBvc2l0aW9uIH0sXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7IGluZGV4IH1cbiAgICAgICAgICB9ID0gaW50ZXJtZWRpYXRlUG9pbnQ7XG4gICAgICAgICAgaGFuZGxlcyA9IFtcbiAgICAgICAgICAgIC4uLmhhbmRsZXMsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHBvc2l0aW9uLFxuICAgICAgICAgICAgICBwb3NpdGlvbkluZGV4ZXM6IFsuLi5wb3NpdGlvbkluZGV4UHJlZml4LCBpbmRleCArIDFdLFxuICAgICAgICAgICAgICBmZWF0dXJlSW5kZXg6IGZlYXR1cmVBc1BpY2suaW5kZXgsXG4gICAgICAgICAgICAgIHR5cGU6ICdpbnRlcm1lZGlhdGUnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBoYW5kbGVzO1xuICB9XG5cbiAgLy8gdHVyZi5qcyBkb2VzIG5vdCBzdXBwb3J0IGVsZXZhdGlvbiBmb3IgbmVhcmVzdFBvaW50T25MaW5lXG4gIG5lYXJlc3RQb2ludE9uTGluZShsaW5lOiBGZWF0dXJlT2Y8TGluZVN0cmluZz4sIGluUG9pbnQ6IEZlYXR1cmVPZjxQb2ludD4pOiBOZWFyZXN0UG9pbnRUeXBlIHtcbiAgICBjb25zdCB7IGNvb3JkaW5hdGVzIH0gPSBsaW5lLmdlb21ldHJ5O1xuICAgIGlmIChjb29yZGluYXRlcy5zb21lKGNvb3JkID0+IGNvb3JkLmxlbmd0aCA+IDIpKSB7XG4gICAgICBjb25zdCBtb2RlQ29uZmlnID0gdGhpcy5nZXRNb2RlQ29uZmlnKCk7XG4gICAgICBpZiAobW9kZUNvbmZpZyAmJiBtb2RlQ29uZmlnLnZpZXdwb3J0KSB7XG4gICAgICAgIC8vIFRoaXMgbGluZSBoYXMgZWxldmF0aW9uLCB3ZSBuZWVkIHRvIHVzZSBhbHRlcm5hdGl2ZSBhbGdvcml0aG1cbiAgICAgICAgcmV0dXJuIG5lYXJlc3RQb2ludE9uUHJvamVjdGVkTGluZShsaW5lLCBpblBvaW50LCBtb2RlQ29uZmlnLnZpZXdwb3J0KTtcbiAgICAgIH1cbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlLG5vLXVuZGVmXG4gICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgJ0VkaXRpbmcgM0QgcG9pbnQgYnV0IG1vZGVDb25maWcudmlld3BvcnQgbm90IHByb3ZpZGVkLiBGYWxsaW5nIGJhY2sgdG8gMkQgbG9naWMuJ1xuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmVhcmVzdFBvaW50T25MaW5lKGxpbmUsIGluUG9pbnQpO1xuICB9XG5cbiAgaGFuZGxlQ2xpY2soZXZlbnQ6IENsaWNrRXZlbnQpOiA/RWRpdEFjdGlvbiB7XG4gICAgbGV0IGVkaXRBY3Rpb246ID9FZGl0QWN0aW9uID0gbnVsbDtcblxuICAgIGNvbnN0IGNsaWNrZWRFZGl0SGFuZGxlID0gZ2V0UGlja2VkRWRpdEhhbmRsZShldmVudC5waWNrcyk7XG5cbiAgICBpZiAoY2xpY2tlZEVkaXRIYW5kbGUgJiYgY2xpY2tlZEVkaXRIYW5kbGUuZmVhdHVyZUluZGV4ID49IDApIHtcbiAgICAgIGlmIChjbGlja2VkRWRpdEhhbmRsZS50eXBlID09PSAnZXhpc3RpbmcnKSB7XG4gICAgICAgIGxldCB1cGRhdGVkRGF0YTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB1cGRhdGVkRGF0YSA9IHRoaXMuZ2V0SW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24oKVxuICAgICAgICAgICAgLnJlbW92ZVBvc2l0aW9uKGNsaWNrZWRFZGl0SGFuZGxlLmZlYXR1cmVJbmRleCwgY2xpY2tlZEVkaXRIYW5kbGUucG9zaXRpb25JbmRleGVzKVxuICAgICAgICAgICAgLmdldE9iamVjdCgpO1xuICAgICAgICB9IGNhdGNoIChpZ25vcmVkKSB7XG4gICAgICAgICAgLy8gVGhpcyBoYXBwZW5zIGlmIHVzZXIgYXR0ZW1wdHMgdG8gcmVtb3ZlIHRoZSBsYXN0IHBvaW50XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodXBkYXRlZERhdGEpIHtcbiAgICAgICAgICBlZGl0QWN0aW9uID0ge1xuICAgICAgICAgICAgdXBkYXRlZERhdGEsXG4gICAgICAgICAgICBlZGl0VHlwZTogJ3JlbW92ZVBvc2l0aW9uJyxcbiAgICAgICAgICAgIGZlYXR1cmVJbmRleGVzOiBbY2xpY2tlZEVkaXRIYW5kbGUuZmVhdHVyZUluZGV4XSxcbiAgICAgICAgICAgIGVkaXRDb250ZXh0OiB7XG4gICAgICAgICAgICAgIHBvc2l0aW9uSW5kZXhlczogY2xpY2tlZEVkaXRIYW5kbGUucG9zaXRpb25JbmRleGVzLFxuICAgICAgICAgICAgICBwb3NpdGlvbjogY2xpY2tlZEVkaXRIYW5kbGUucG9zaXRpb25cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGNsaWNrZWRFZGl0SGFuZGxlLnR5cGUgPT09ICdpbnRlcm1lZGlhdGUnKSB7XG4gICAgICAgIGNvbnN0IHVwZGF0ZWREYXRhID0gdGhpcy5nZXRJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbigpXG4gICAgICAgICAgLmFkZFBvc2l0aW9uKFxuICAgICAgICAgICAgY2xpY2tlZEVkaXRIYW5kbGUuZmVhdHVyZUluZGV4LFxuICAgICAgICAgICAgY2xpY2tlZEVkaXRIYW5kbGUucG9zaXRpb25JbmRleGVzLFxuICAgICAgICAgICAgY2xpY2tlZEVkaXRIYW5kbGUucG9zaXRpb25cbiAgICAgICAgICApXG4gICAgICAgICAgLmdldE9iamVjdCgpO1xuXG4gICAgICAgIGlmICh1cGRhdGVkRGF0YSkge1xuICAgICAgICAgIGVkaXRBY3Rpb24gPSB7XG4gICAgICAgICAgICB1cGRhdGVkRGF0YSxcbiAgICAgICAgICAgIGVkaXRUeXBlOiAnYWRkUG9zaXRpb24nLFxuICAgICAgICAgICAgZmVhdHVyZUluZGV4ZXM6IFtjbGlja2VkRWRpdEhhbmRsZS5mZWF0dXJlSW5kZXhdLFxuICAgICAgICAgICAgZWRpdENvbnRleHQ6IHtcbiAgICAgICAgICAgICAgcG9zaXRpb25JbmRleGVzOiBjbGlja2VkRWRpdEhhbmRsZS5wb3NpdGlvbkluZGV4ZXMsXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiBjbGlja2VkRWRpdEhhbmRsZS5wb3NpdGlvblxuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGVkaXRBY3Rpb247XG4gIH1cblxuICBoYW5kbGVQb2ludGVyTW92ZShldmVudDogUG9pbnRlck1vdmVFdmVudCk6IHsgZWRpdEFjdGlvbjogP0VkaXRBY3Rpb24sIGNhbmNlbE1hcFBhbjogYm9vbGVhbiB9IHtcbiAgICB0aGlzLl9sYXN0UG9pbnRlck1vdmVQaWNrcyA9IGV2ZW50LnBpY2tzO1xuXG4gICAgbGV0IGVkaXRBY3Rpb246ID9FZGl0QWN0aW9uID0gbnVsbDtcblxuICAgIGNvbnN0IGVkaXRIYW5kbGUgPSBnZXRQaWNrZWRFZGl0SGFuZGxlKGV2ZW50LnBvaW50ZXJEb3duUGlja3MpO1xuXG4gICAgaWYgKGV2ZW50LmlzRHJhZ2dpbmcgJiYgZWRpdEhhbmRsZSkge1xuICAgICAgY29uc3QgdXBkYXRlZERhdGEgPSB0aGlzLmdldEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uKClcbiAgICAgICAgLnJlcGxhY2VQb3NpdGlvbihlZGl0SGFuZGxlLmZlYXR1cmVJbmRleCwgZWRpdEhhbmRsZS5wb3NpdGlvbkluZGV4ZXMsIGV2ZW50Lmdyb3VuZENvb3JkcylcbiAgICAgICAgLmdldE9iamVjdCgpO1xuXG4gICAgICBlZGl0QWN0aW9uID0ge1xuICAgICAgICB1cGRhdGVkRGF0YSxcbiAgICAgICAgZWRpdFR5cGU6ICdtb3ZlUG9zaXRpb24nLFxuICAgICAgICBmZWF0dXJlSW5kZXhlczogW2VkaXRIYW5kbGUuZmVhdHVyZUluZGV4XSxcbiAgICAgICAgZWRpdENvbnRleHQ6IHtcbiAgICAgICAgICBwb3NpdGlvbkluZGV4ZXM6IGVkaXRIYW5kbGUucG9zaXRpb25JbmRleGVzLFxuICAgICAgICAgIHBvc2l0aW9uOiBldmVudC5ncm91bmRDb29yZHNcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBDYW5jZWwgbWFwIHBhbm5pbmcgaWYgcG9pbnRlciB3ZW50IGRvd24gb24gYW4gZWRpdCBoYW5kbGVcbiAgICBjb25zdCBjYW5jZWxNYXBQYW4gPSBCb29sZWFuKGVkaXRIYW5kbGUpO1xuXG4gICAgcmV0dXJuIHsgZWRpdEFjdGlvbiwgY2FuY2VsTWFwUGFuIH07XG4gIH1cblxuICBoYW5kbGVTdGFydERyYWdnaW5nKGV2ZW50OiBTdGFydERyYWdnaW5nRXZlbnQpOiA/RWRpdEFjdGlvbiB7XG4gICAgbGV0IGVkaXRBY3Rpb246ID9FZGl0QWN0aW9uID0gbnVsbDtcblxuICAgIGNvbnN0IHNlbGVjdGVkRmVhdHVyZUluZGV4ZXMgPSB0aGlzLmdldFNlbGVjdGVkRmVhdHVyZUluZGV4ZXMoKTtcblxuICAgIGNvbnN0IGVkaXRIYW5kbGUgPSBnZXRQaWNrZWRFZGl0SGFuZGxlKGV2ZW50LnBpY2tzKTtcbiAgICBpZiAoc2VsZWN0ZWRGZWF0dXJlSW5kZXhlcy5sZW5ndGggJiYgZWRpdEhhbmRsZSAmJiBlZGl0SGFuZGxlLnR5cGUgPT09ICdpbnRlcm1lZGlhdGUnKSB7XG4gICAgICBjb25zdCB1cGRhdGVkRGF0YSA9IHRoaXMuZ2V0SW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24oKVxuICAgICAgICAuYWRkUG9zaXRpb24oZWRpdEhhbmRsZS5mZWF0dXJlSW5kZXgsIGVkaXRIYW5kbGUucG9zaXRpb25JbmRleGVzLCBldmVudC5ncm91bmRDb29yZHMpXG4gICAgICAgIC5nZXRPYmplY3QoKTtcblxuICAgICAgZWRpdEFjdGlvbiA9IHtcbiAgICAgICAgdXBkYXRlZERhdGEsXG4gICAgICAgIGVkaXRUeXBlOiAnYWRkUG9zaXRpb24nLFxuICAgICAgICBmZWF0dXJlSW5kZXhlczogW2VkaXRIYW5kbGUuZmVhdHVyZUluZGV4XSxcbiAgICAgICAgZWRpdENvbnRleHQ6IHtcbiAgICAgICAgICBwb3NpdGlvbkluZGV4ZXM6IGVkaXRIYW5kbGUucG9zaXRpb25JbmRleGVzLFxuICAgICAgICAgIHBvc2l0aW9uOiBldmVudC5ncm91bmRDb29yZHNcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gZWRpdEFjdGlvbjtcbiAgfVxuXG4gIGhhbmRsZVN0b3BEcmFnZ2luZyhldmVudDogU3RvcERyYWdnaW5nRXZlbnQpOiA/RWRpdEFjdGlvbiB7XG4gICAgbGV0IGVkaXRBY3Rpb246ID9FZGl0QWN0aW9uID0gbnVsbDtcblxuICAgIGNvbnN0IHNlbGVjdGVkRmVhdHVyZUluZGV4ZXMgPSB0aGlzLmdldFNlbGVjdGVkRmVhdHVyZUluZGV4ZXMoKTtcbiAgICBjb25zdCBlZGl0SGFuZGxlID0gZ2V0UGlja2VkRWRpdEhhbmRsZShldmVudC5waWNrcyk7XG4gICAgaWYgKHNlbGVjdGVkRmVhdHVyZUluZGV4ZXMubGVuZ3RoICYmIGVkaXRIYW5kbGUpIHtcbiAgICAgIGNvbnN0IHVwZGF0ZWREYXRhID0gdGhpcy5nZXRJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbigpXG4gICAgICAgIC5yZXBsYWNlUG9zaXRpb24oZWRpdEhhbmRsZS5mZWF0dXJlSW5kZXgsIGVkaXRIYW5kbGUucG9zaXRpb25JbmRleGVzLCBldmVudC5ncm91bmRDb29yZHMpXG4gICAgICAgIC5nZXRPYmplY3QoKTtcblxuICAgICAgZWRpdEFjdGlvbiA9IHtcbiAgICAgICAgdXBkYXRlZERhdGEsXG4gICAgICAgIGVkaXRUeXBlOiAnZmluaXNoTW92ZVBvc2l0aW9uJyxcbiAgICAgICAgZmVhdHVyZUluZGV4ZXM6IFtlZGl0SGFuZGxlLmZlYXR1cmVJbmRleF0sXG4gICAgICAgIGVkaXRDb250ZXh0OiB7XG4gICAgICAgICAgcG9zaXRpb25JbmRleGVzOiBlZGl0SGFuZGxlLnBvc2l0aW9uSW5kZXhlcyxcbiAgICAgICAgICBwb3NpdGlvbjogZXZlbnQuZ3JvdW5kQ29vcmRzXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIGVkaXRBY3Rpb247XG4gIH1cblxuICBnZXRDdXJzb3IoeyBpc0RyYWdnaW5nIH06IHsgaXNEcmFnZ2luZzogYm9vbGVhbiB9KTogc3RyaW5nIHtcbiAgICBjb25zdCBwaWNrcyA9IHRoaXMuX2xhc3RQb2ludGVyTW92ZVBpY2tzO1xuXG4gICAgaWYgKHBpY2tzICYmIHBpY2tzLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IGhhbmRsZVBpY2tlZCA9IHBpY2tzLnNvbWUocGljayA9PiBwaWNrLmlzRWRpdGluZ0hhbmRsZSk7XG4gICAgICBpZiAoaGFuZGxlUGlja2VkKSB7XG4gICAgICAgIHJldHVybiAnY2VsbCc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGlzRHJhZ2dpbmcgPyAnZ3JhYmJpbmcnIDogJ2dyYWInO1xuICB9XG59XG4iXX0=