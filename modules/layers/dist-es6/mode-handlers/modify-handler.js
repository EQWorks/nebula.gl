"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ModifyHandler = void 0;

var _nearestPointOnLine2 = _interopRequireDefault(require("@turf/nearest-point-on-line"));

var _helpers = require("@turf/helpers");

var _utils = require("../utils.js");

var _modeHandler = require("./mode-handler.js");

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

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// TODO edit-modes: delete handlers once EditMode fully implemented
var ModifyHandler =
/*#__PURE__*/
function (_ModeHandler) {
  _inherits(ModifyHandler, _ModeHandler);

  function ModifyHandler() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, ModifyHandler);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ModifyHandler)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_lastPointerMovePicks", void 0);

    return _this;
  }

  _createClass(ModifyHandler, [{
    key: "getEditHandles",
    value: function getEditHandles(picks, groundCoords) {
      var _this2 = this;

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

            var candidateIntermediatePoint = _this2.nearestPointOnLine(lineStringFeature, referencePoint);

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
    value: function nearestPointOnLine(line, inPoint) {
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

      return (0, _nearestPointOnLine2.default)(line, inPoint);
    }
  }, {
    key: "handleClick",
    value: function handleClick(event) {
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
  }, {
    key: "handlePointerMove",
    value: function handlePointerMove(event) {
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
  }, {
    key: "handleStartDragging",
    value: function handleStartDragging(event) {
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
  }, {
    key: "handleStopDragging",
    value: function handleStopDragging(event) {
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
  }, {
    key: "getCursor",
    value: function getCursor(_ref) {
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
  }]);

  return ModifyHandler;
}(_modeHandler.ModeHandler);

exports.ModifyHandler = ModifyHandler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL21vZGlmeS1oYW5kbGVyLmpzIl0sIm5hbWVzIjpbIk1vZGlmeUhhbmRsZXIiLCJwaWNrcyIsImdyb3VuZENvb3JkcyIsImhhbmRsZXMiLCJmZWF0dXJlQ29sbGVjdGlvbiIsImdldE9iamVjdCIsImZlYXR1cmVzIiwiZ2V0U2VsZWN0ZWRGZWF0dXJlSW5kZXhlcyIsImluZGV4IiwibGVuZ3RoIiwiZ2VvbWV0cnkiLCJwdXNoIiwiY29uc29sZSIsIndhcm4iLCJleGlzdGluZ0VkaXRIYW5kbGUiLCJmaW5kIiwicGljayIsImlzRWRpdGluZ0hhbmRsZSIsIm9iamVjdCIsInR5cGUiLCJmZWF0dXJlQXNQaWNrIiwiaW5jbHVkZXMiLCJpbnRlcm1lZGlhdGVQb2ludCIsInBvc2l0aW9uSW5kZXhQcmVmaXgiLCJyZWZlcmVuY2VQb2ludCIsImNvb3JkaW5hdGVzIiwibGluZVN0cmluZyIsInByZWZpeCIsImxpbmVTdHJpbmdGZWF0dXJlIiwiY2FuZGlkYXRlSW50ZXJtZWRpYXRlUG9pbnQiLCJuZWFyZXN0UG9pbnRPbkxpbmUiLCJwcm9wZXJ0aWVzIiwiZGlzdCIsInBvc2l0aW9uIiwicG9zaXRpb25JbmRleGVzIiwiZmVhdHVyZUluZGV4IiwibGluZSIsImluUG9pbnQiLCJzb21lIiwiY29vcmQiLCJtb2RlQ29uZmlnIiwiZ2V0TW9kZUNvbmZpZyIsInZpZXdwb3J0IiwibG9nIiwiZXZlbnQiLCJlZGl0QWN0aW9uIiwiY2xpY2tlZEVkaXRIYW5kbGUiLCJ1cGRhdGVkRGF0YSIsImdldEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uIiwicmVtb3ZlUG9zaXRpb24iLCJpZ25vcmVkIiwiZWRpdFR5cGUiLCJmZWF0dXJlSW5kZXhlcyIsImVkaXRDb250ZXh0IiwiYWRkUG9zaXRpb24iLCJfbGFzdFBvaW50ZXJNb3ZlUGlja3MiLCJlZGl0SGFuZGxlIiwicG9pbnRlckRvd25QaWNrcyIsImlzRHJhZ2dpbmciLCJyZXBsYWNlUG9zaXRpb24iLCJjYW5jZWxNYXBQYW4iLCJCb29sZWFuIiwic2VsZWN0ZWRGZWF0dXJlSW5kZXhlcyIsImhhbmRsZVBpY2tlZCIsIk1vZGVIYW5kbGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBRUE7O0FBQ0E7O0FBRUE7O0FBWUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7SUFDYUEsYTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzttQ0FHSUMsSyxFQUF1QkMsWSxFQUF1QztBQUFBOztBQUMzRSxVQUFJQyxPQUFPLEdBQUcsRUFBZDs7QUFEMkUsa0NBRXRELEtBQUtDLGlCQUFMLENBQXVCQyxTQUF2QixFQUZzRDtBQUFBLFVBRW5FQyxRQUZtRSx5QkFFbkVBLFFBRm1FOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUkzRSw2QkFBb0IsS0FBS0MseUJBQUwsRUFBcEIsOEhBQXNEO0FBQUEsY0FBM0NDLE1BQTJDOztBQUNwRCxjQUFJQSxNQUFLLEdBQUdGLFFBQVEsQ0FBQ0csTUFBckIsRUFBNkI7QUFBQTs7QUFBQSxnQkFDbkJDLFFBRG1CLEdBQ05KLFFBQVEsQ0FBQ0UsTUFBRCxDQURGLENBQ25CRSxRQURtQjs7QUFFM0Isd0JBQUFQLE9BQU8sRUFBQ1EsSUFBUixvQ0FBZ0IsNENBQTBCRCxRQUExQixFQUFvQ0YsTUFBcEMsQ0FBaEI7QUFDRCxXQUhELE1BR087QUFDTEksWUFBQUEsT0FBTyxDQUFDQyxJQUFSLCtDQUFvREwsTUFBcEQsR0FESyxDQUN5RDtBQUMvRDtBQUNGLFNBWDBFLENBYTNFOztBQWIyRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQWMzRSxVQUFJUCxLQUFLLElBQUlBLEtBQUssQ0FBQ1EsTUFBZixJQUF5QlAsWUFBN0IsRUFBMkM7QUFDekMsWUFBTVksa0JBQWtCLEdBQUdiLEtBQUssQ0FBQ2MsSUFBTixDQUN6QixVQUFBQyxJQUFJO0FBQUEsaUJBQUlBLElBQUksQ0FBQ0MsZUFB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QyxVQUFyQyxFQUFpRDtBQUMvQyxZQUFNVCxXQUFXLEdBQUcsS0FBS0MsNkJBQUwsR0FDakJXLGVBRGlCLENBQ0RILFVBQVUsQ0FBQ3JCLFlBRFYsRUFDd0JxQixVQUFVLENBQUN0QixlQURuQyxFQUNvRFUsS0FBSyxDQUFDMUMsWUFEMUQsRUFFakJHLFNBRmlCLEVBQXBCO0FBSUF3QyxRQUFBQSxVQUFVLEdBQUc7QUFDWEUsVUFBQUEsV0FBVyxFQUFYQSxXQURXO0FBRVhJLFVBQUFBLFFBQVEsRUFBRSxvQkFGQztBQUdYQyxVQUFBQSxjQUFjLEVBQUUsQ0FBQ0ksVUFBVSxDQUFDckIsWUFBWixDQUhMO0FBSVhrQixVQUFBQSxXQUFXLEVBQUU7QUFDWG5CLFlBQUFBLGVBQWUsRUFBRXNCLFVBQVUsQ0FBQ3RCLGVBRGpCO0FBRVhELFlBQUFBLFFBQVEsRUFBRVcsS0FBSyxDQUFDMUM7QUFGTDtBQUpGLFNBQWI7QUFTRDs7QUFFRCxhQUFPMkMsVUFBUDtBQUNEOzs7b0NBRTBEO0FBQUEsVUFBL0NhLFVBQStDLFFBQS9DQSxVQUErQztBQUN6RCxVQUFNekQsS0FBSyxHQUFHLEtBQUtzRCxxQkFBbkI7O0FBRUEsVUFBSXRELEtBQUssSUFBSUEsS0FBSyxDQUFDUSxNQUFOLEdBQWUsQ0FBNUIsRUFBK0I7QUFDN0IsWUFBTXNELFlBQVksR0FBRzlELEtBQUssQ0FBQ3FDLElBQU4sQ0FBVyxVQUFBdEIsSUFBSTtBQUFBLGlCQUFJQSxJQUFJLENBQUNDLGVBQVQ7QUFBQSxTQUFmLENBQXJCOztBQUNBLFlBQUk4QyxZQUFKLEVBQWtCO0FBQ2hCLGlCQUFPLE1BQVA7QUFDRDtBQUNGOztBQUVELGFBQU9MLFVBQVUsR0FBRyxVQUFILEdBQWdCLE1BQWpDO0FBQ0Q7Ozs7RUF6T2dDTSx3QiIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbmltcG9ydCBuZWFyZXN0UG9pbnRPbkxpbmUgZnJvbSAnQHR1cmYvbmVhcmVzdC1wb2ludC1vbi1saW5lJztcbmltcG9ydCB7IHBvaW50LCBsaW5lU3RyaW5nIGFzIHRvTGluZVN0cmluZyB9IGZyb20gJ0B0dXJmL2hlbHBlcnMnO1xuaW1wb3J0IHR5cGUgeyBQb3NpdGlvbiwgRmVhdHVyZU9mLCBQb2ludCwgTGluZVN0cmluZyB9IGZyb20gJ2tlcGxlci1vdXRkYXRlZC1uZWJ1bGEuZ2wtZWRpdC1tb2Rlcyc7XG5pbXBvcnQge1xuICByZWN1cnNpdmVseVRyYXZlcnNlTmVzdGVkQXJyYXlzLFxuICBuZWFyZXN0UG9pbnRPblByb2plY3RlZExpbmUsXG4gIHR5cGUgTmVhcmVzdFBvaW50VHlwZVxufSBmcm9tICcuLi91dGlscy5qcyc7XG5pbXBvcnQgdHlwZSB7XG4gIENsaWNrRXZlbnQsXG4gIFBvaW50ZXJNb3ZlRXZlbnQsXG4gIFN0YXJ0RHJhZ2dpbmdFdmVudCxcbiAgU3RvcERyYWdnaW5nRXZlbnRcbn0gZnJvbSAnLi4vZXZlbnQtdHlwZXMuanMnO1xuaW1wb3J0IHR5cGUgeyBFZGl0QWN0aW9uLCBFZGl0SGFuZGxlIH0gZnJvbSAnLi9tb2RlLWhhbmRsZXIuanMnO1xuaW1wb3J0IHsgTW9kZUhhbmRsZXIsIGdldFBpY2tlZEVkaXRIYW5kbGUsIGdldEVkaXRIYW5kbGVzRm9yR2VvbWV0cnkgfSBmcm9tICcuL21vZGUtaGFuZGxlci5qcyc7XG5cbi8vIFRPRE8gZWRpdC1tb2RlczogZGVsZXRlIGhhbmRsZXJzIG9uY2UgRWRpdE1vZGUgZnVsbHkgaW1wbGVtZW50ZWRcbmV4cG9ydCBjbGFzcyBNb2RpZnlIYW5kbGVyIGV4dGVuZHMgTW9kZUhhbmRsZXIge1xuICBfbGFzdFBvaW50ZXJNb3ZlUGlja3M6ICo7XG5cbiAgZ2V0RWRpdEhhbmRsZXMocGlja3M/OiBBcnJheTxPYmplY3Q+LCBncm91bmRDb29yZHM/OiBQb3NpdGlvbik6IEVkaXRIYW5kbGVbXSB7XG4gICAgbGV0IGhhbmRsZXMgPSBbXTtcbiAgICBjb25zdCB7IGZlYXR1cmVzIH0gPSB0aGlzLmZlYXR1cmVDb2xsZWN0aW9uLmdldE9iamVjdCgpO1xuXG4gICAgZm9yIChjb25zdCBpbmRleCBvZiB0aGlzLmdldFNlbGVjdGVkRmVhdHVyZUluZGV4ZXMoKSkge1xuICAgICAgaWYgKGluZGV4IDwgZmVhdHVyZXMubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IHsgZ2VvbWV0cnkgfSA9IGZlYXR1cmVzW2luZGV4XTtcbiAgICAgICAgaGFuZGxlcy5wdXNoKC4uLmdldEVkaXRIYW5kbGVzRm9yR2VvbWV0cnkoZ2VvbWV0cnksIGluZGV4KSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLndhcm4oYHNlbGVjdGVkRmVhdHVyZUluZGV4ZXMgb3V0IG9mIHJhbmdlICR7aW5kZXh9YCk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZSxuby11bmRlZlxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGludGVybWVkaWF0ZSBlZGl0IGhhbmRsZVxuICAgIGlmIChwaWNrcyAmJiBwaWNrcy5sZW5ndGggJiYgZ3JvdW5kQ29vcmRzKSB7XG4gICAgICBjb25zdCBleGlzdGluZ0VkaXRIYW5kbGUgPSBwaWNrcy5maW5kKFxuICAgICAgICBwaWNrID0+IHBpY2suaXNFZGl0aW5nSGFuZGxlICYmIHBpY2sub2JqZWN0ICYmIHBpY2sub2JqZWN0LnR5cGUgPT09ICdleGlzdGluZydcbiAgICAgICk7XG4gICAgICAvLyBkb24ndCBzaG93IGludGVybWVkaWF0ZSBwb2ludCB3aGVuIHRvbyBjbG9zZSB0byBhbiBleGlzdGluZyBlZGl0IGhhbmRsZVxuICAgICAgY29uc3QgZmVhdHVyZUFzUGljayA9ICFleGlzdGluZ0VkaXRIYW5kbGUgJiYgcGlja3MuZmluZChwaWNrID0+ICFwaWNrLmlzRWRpdGluZ0hhbmRsZSk7XG5cbiAgICAgIC8vIGlzIHRoZSBmZWF0dXJlIGluIHRoZSBwaWNrIHNlbGVjdGVkXG4gICAgICBpZiAoXG4gICAgICAgIGZlYXR1cmVBc1BpY2sgJiZcbiAgICAgICAgIWZlYXR1cmVBc1BpY2sub2JqZWN0Lmdlb21ldHJ5LnR5cGUuaW5jbHVkZXMoJ1BvaW50JykgJiZcbiAgICAgICAgdGhpcy5nZXRTZWxlY3RlZEZlYXR1cmVJbmRleGVzKCkuaW5jbHVkZXMoZmVhdHVyZUFzUGljay5pbmRleClcbiAgICAgICkge1xuICAgICAgICBsZXQgaW50ZXJtZWRpYXRlUG9pbnQ6ID9OZWFyZXN0UG9pbnRUeXBlID0gbnVsbDtcbiAgICAgICAgbGV0IHBvc2l0aW9uSW5kZXhQcmVmaXggPSBbXTtcbiAgICAgICAgY29uc3QgcmVmZXJlbmNlUG9pbnQgPSBwb2ludChncm91bmRDb29yZHMpO1xuICAgICAgICAvLyBwcm9jZXNzIGFsbCBsaW5lcyBvZiB0aGUgKHNpbmdsZSkgZmVhdHVyZVxuICAgICAgICByZWN1cnNpdmVseVRyYXZlcnNlTmVzdGVkQXJyYXlzKFxuICAgICAgICAgIGZlYXR1cmVBc1BpY2sub2JqZWN0Lmdlb21ldHJ5LmNvb3JkaW5hdGVzLFxuICAgICAgICAgIFtdLFxuICAgICAgICAgIChsaW5lU3RyaW5nLCBwcmVmaXgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGxpbmVTdHJpbmdGZWF0dXJlID0gdG9MaW5lU3RyaW5nKGxpbmVTdHJpbmcpO1xuICAgICAgICAgICAgY29uc3QgY2FuZGlkYXRlSW50ZXJtZWRpYXRlUG9pbnQgPSB0aGlzLm5lYXJlc3RQb2ludE9uTGluZShcbiAgICAgICAgICAgICAgbGluZVN0cmluZ0ZlYXR1cmUsXG4gICAgICAgICAgICAgIHJlZmVyZW5jZVBvaW50XG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAhaW50ZXJtZWRpYXRlUG9pbnQgfHxcbiAgICAgICAgICAgICAgY2FuZGlkYXRlSW50ZXJtZWRpYXRlUG9pbnQucHJvcGVydGllcy5kaXN0IDwgaW50ZXJtZWRpYXRlUG9pbnQucHJvcGVydGllcy5kaXN0XG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgaW50ZXJtZWRpYXRlUG9pbnQgPSBjYW5kaWRhdGVJbnRlcm1lZGlhdGVQb2ludDtcbiAgICAgICAgICAgICAgcG9zaXRpb25JbmRleFByZWZpeCA9IHByZWZpeDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICAgIC8vIHRhY2sgb24gdGhlIGxvbmUgaW50ZXJtZWRpYXRlIHBvaW50IHRvIHRoZSBzZXQgb2YgaGFuZGxlc1xuICAgICAgICBpZiAoaW50ZXJtZWRpYXRlUG9pbnQpIHtcbiAgICAgICAgICBjb25zdCB7XG4gICAgICAgICAgICBnZW9tZXRyeTogeyBjb29yZGluYXRlczogcG9zaXRpb24gfSxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHsgaW5kZXggfVxuICAgICAgICAgIH0gPSBpbnRlcm1lZGlhdGVQb2ludDtcbiAgICAgICAgICBoYW5kbGVzID0gW1xuICAgICAgICAgICAgLi4uaGFuZGxlcyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgcG9zaXRpb24sXG4gICAgICAgICAgICAgIHBvc2l0aW9uSW5kZXhlczogWy4uLnBvc2l0aW9uSW5kZXhQcmVmaXgsIGluZGV4ICsgMV0sXG4gICAgICAgICAgICAgIGZlYXR1cmVJbmRleDogZmVhdHVyZUFzUGljay5pbmRleCxcbiAgICAgICAgICAgICAgdHlwZTogJ2ludGVybWVkaWF0ZSdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGhhbmRsZXM7XG4gIH1cblxuICAvLyB0dXJmLmpzIGRvZXMgbm90IHN1cHBvcnQgZWxldmF0aW9uIGZvciBuZWFyZXN0UG9pbnRPbkxpbmVcbiAgbmVhcmVzdFBvaW50T25MaW5lKGxpbmU6IEZlYXR1cmVPZjxMaW5lU3RyaW5nPiwgaW5Qb2ludDogRmVhdHVyZU9mPFBvaW50Pik6IE5lYXJlc3RQb2ludFR5cGUge1xuICAgIGNvbnN0IHsgY29vcmRpbmF0ZXMgfSA9IGxpbmUuZ2VvbWV0cnk7XG4gICAgaWYgKGNvb3JkaW5hdGVzLnNvbWUoY29vcmQgPT4gY29vcmQubGVuZ3RoID4gMikpIHtcbiAgICAgIGNvbnN0IG1vZGVDb25maWcgPSB0aGlzLmdldE1vZGVDb25maWcoKTtcbiAgICAgIGlmIChtb2RlQ29uZmlnICYmIG1vZGVDb25maWcudmlld3BvcnQpIHtcbiAgICAgICAgLy8gVGhpcyBsaW5lIGhhcyBlbGV2YXRpb24sIHdlIG5lZWQgdG8gdXNlIGFsdGVybmF0aXZlIGFsZ29yaXRobVxuICAgICAgICByZXR1cm4gbmVhcmVzdFBvaW50T25Qcm9qZWN0ZWRMaW5lKGxpbmUsIGluUG9pbnQsIG1vZGVDb25maWcudmlld3BvcnQpO1xuICAgICAgfVxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGUsbm8tdW5kZWZcbiAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAnRWRpdGluZyAzRCBwb2ludCBidXQgbW9kZUNvbmZpZy52aWV3cG9ydCBub3QgcHJvdmlkZWQuIEZhbGxpbmcgYmFjayB0byAyRCBsb2dpYy4nXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiBuZWFyZXN0UG9pbnRPbkxpbmUobGluZSwgaW5Qb2ludCk7XG4gIH1cblxuICBoYW5kbGVDbGljayhldmVudDogQ2xpY2tFdmVudCk6ID9FZGl0QWN0aW9uIHtcbiAgICBsZXQgZWRpdEFjdGlvbjogP0VkaXRBY3Rpb24gPSBudWxsO1xuXG4gICAgY29uc3QgY2xpY2tlZEVkaXRIYW5kbGUgPSBnZXRQaWNrZWRFZGl0SGFuZGxlKGV2ZW50LnBpY2tzKTtcblxuICAgIGlmIChjbGlja2VkRWRpdEhhbmRsZSAmJiBjbGlja2VkRWRpdEhhbmRsZS5mZWF0dXJlSW5kZXggPj0gMCkge1xuICAgICAgaWYgKGNsaWNrZWRFZGl0SGFuZGxlLnR5cGUgPT09ICdleGlzdGluZycpIHtcbiAgICAgICAgbGV0IHVwZGF0ZWREYXRhO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHVwZGF0ZWREYXRhID0gdGhpcy5nZXRJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbigpXG4gICAgICAgICAgICAucmVtb3ZlUG9zaXRpb24oY2xpY2tlZEVkaXRIYW5kbGUuZmVhdHVyZUluZGV4LCBjbGlja2VkRWRpdEhhbmRsZS5wb3NpdGlvbkluZGV4ZXMpXG4gICAgICAgICAgICAuZ2V0T2JqZWN0KCk7XG4gICAgICAgIH0gY2F0Y2ggKGlnbm9yZWQpIHtcbiAgICAgICAgICAvLyBUaGlzIGhhcHBlbnMgaWYgdXNlciBhdHRlbXB0cyB0byByZW1vdmUgdGhlIGxhc3QgcG9pbnRcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh1cGRhdGVkRGF0YSkge1xuICAgICAgICAgIGVkaXRBY3Rpb24gPSB7XG4gICAgICAgICAgICB1cGRhdGVkRGF0YSxcbiAgICAgICAgICAgIGVkaXRUeXBlOiAncmVtb3ZlUG9zaXRpb24nLFxuICAgICAgICAgICAgZmVhdHVyZUluZGV4ZXM6IFtjbGlja2VkRWRpdEhhbmRsZS5mZWF0dXJlSW5kZXhdLFxuICAgICAgICAgICAgZWRpdENvbnRleHQ6IHtcbiAgICAgICAgICAgICAgcG9zaXRpb25JbmRleGVzOiBjbGlja2VkRWRpdEhhbmRsZS5wb3NpdGlvbkluZGV4ZXMsXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiBjbGlja2VkRWRpdEhhbmRsZS5wb3NpdGlvblxuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoY2xpY2tlZEVkaXRIYW5kbGUudHlwZSA9PT0gJ2ludGVybWVkaWF0ZScpIHtcbiAgICAgICAgY29uc3QgdXBkYXRlZERhdGEgPSB0aGlzLmdldEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uKClcbiAgICAgICAgICAuYWRkUG9zaXRpb24oXG4gICAgICAgICAgICBjbGlja2VkRWRpdEhhbmRsZS5mZWF0dXJlSW5kZXgsXG4gICAgICAgICAgICBjbGlja2VkRWRpdEhhbmRsZS5wb3NpdGlvbkluZGV4ZXMsXG4gICAgICAgICAgICBjbGlja2VkRWRpdEhhbmRsZS5wb3NpdGlvblxuICAgICAgICAgIClcbiAgICAgICAgICAuZ2V0T2JqZWN0KCk7XG5cbiAgICAgICAgaWYgKHVwZGF0ZWREYXRhKSB7XG4gICAgICAgICAgZWRpdEFjdGlvbiA9IHtcbiAgICAgICAgICAgIHVwZGF0ZWREYXRhLFxuICAgICAgICAgICAgZWRpdFR5cGU6ICdhZGRQb3NpdGlvbicsXG4gICAgICAgICAgICBmZWF0dXJlSW5kZXhlczogW2NsaWNrZWRFZGl0SGFuZGxlLmZlYXR1cmVJbmRleF0sXG4gICAgICAgICAgICBlZGl0Q29udGV4dDoge1xuICAgICAgICAgICAgICBwb3NpdGlvbkluZGV4ZXM6IGNsaWNrZWRFZGl0SGFuZGxlLnBvc2l0aW9uSW5kZXhlcyxcbiAgICAgICAgICAgICAgcG9zaXRpb246IGNsaWNrZWRFZGl0SGFuZGxlLnBvc2l0aW9uXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZWRpdEFjdGlvbjtcbiAgfVxuXG4gIGhhbmRsZVBvaW50ZXJNb3ZlKGV2ZW50OiBQb2ludGVyTW92ZUV2ZW50KTogeyBlZGl0QWN0aW9uOiA/RWRpdEFjdGlvbiwgY2FuY2VsTWFwUGFuOiBib29sZWFuIH0ge1xuICAgIHRoaXMuX2xhc3RQb2ludGVyTW92ZVBpY2tzID0gZXZlbnQucGlja3M7XG5cbiAgICBsZXQgZWRpdEFjdGlvbjogP0VkaXRBY3Rpb24gPSBudWxsO1xuXG4gICAgY29uc3QgZWRpdEhhbmRsZSA9IGdldFBpY2tlZEVkaXRIYW5kbGUoZXZlbnQucG9pbnRlckRvd25QaWNrcyk7XG5cbiAgICBpZiAoZXZlbnQuaXNEcmFnZ2luZyAmJiBlZGl0SGFuZGxlKSB7XG4gICAgICBjb25zdCB1cGRhdGVkRGF0YSA9IHRoaXMuZ2V0SW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24oKVxuICAgICAgICAucmVwbGFjZVBvc2l0aW9uKGVkaXRIYW5kbGUuZmVhdHVyZUluZGV4LCBlZGl0SGFuZGxlLnBvc2l0aW9uSW5kZXhlcywgZXZlbnQuZ3JvdW5kQ29vcmRzKVxuICAgICAgICAuZ2V0T2JqZWN0KCk7XG5cbiAgICAgIGVkaXRBY3Rpb24gPSB7XG4gICAgICAgIHVwZGF0ZWREYXRhLFxuICAgICAgICBlZGl0VHlwZTogJ21vdmVQb3NpdGlvbicsXG4gICAgICAgIGZlYXR1cmVJbmRleGVzOiBbZWRpdEhhbmRsZS5mZWF0dXJlSW5kZXhdLFxuICAgICAgICBlZGl0Q29udGV4dDoge1xuICAgICAgICAgIHBvc2l0aW9uSW5kZXhlczogZWRpdEhhbmRsZS5wb3NpdGlvbkluZGV4ZXMsXG4gICAgICAgICAgcG9zaXRpb246IGV2ZW50Lmdyb3VuZENvb3Jkc1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cblxuICAgIC8vIENhbmNlbCBtYXAgcGFubmluZyBpZiBwb2ludGVyIHdlbnQgZG93biBvbiBhbiBlZGl0IGhhbmRsZVxuICAgIGNvbnN0IGNhbmNlbE1hcFBhbiA9IEJvb2xlYW4oZWRpdEhhbmRsZSk7XG5cbiAgICByZXR1cm4geyBlZGl0QWN0aW9uLCBjYW5jZWxNYXBQYW4gfTtcbiAgfVxuXG4gIGhhbmRsZVN0YXJ0RHJhZ2dpbmcoZXZlbnQ6IFN0YXJ0RHJhZ2dpbmdFdmVudCk6ID9FZGl0QWN0aW9uIHtcbiAgICBsZXQgZWRpdEFjdGlvbjogP0VkaXRBY3Rpb24gPSBudWxsO1xuXG4gICAgY29uc3Qgc2VsZWN0ZWRGZWF0dXJlSW5kZXhlcyA9IHRoaXMuZ2V0U2VsZWN0ZWRGZWF0dXJlSW5kZXhlcygpO1xuXG4gICAgY29uc3QgZWRpdEhhbmRsZSA9IGdldFBpY2tlZEVkaXRIYW5kbGUoZXZlbnQucGlja3MpO1xuICAgIGlmIChzZWxlY3RlZEZlYXR1cmVJbmRleGVzLmxlbmd0aCAmJiBlZGl0SGFuZGxlICYmIGVkaXRIYW5kbGUudHlwZSA9PT0gJ2ludGVybWVkaWF0ZScpIHtcbiAgICAgIGNvbnN0IHVwZGF0ZWREYXRhID0gdGhpcy5nZXRJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbigpXG4gICAgICAgIC5hZGRQb3NpdGlvbihlZGl0SGFuZGxlLmZlYXR1cmVJbmRleCwgZWRpdEhhbmRsZS5wb3NpdGlvbkluZGV4ZXMsIGV2ZW50Lmdyb3VuZENvb3JkcylcbiAgICAgICAgLmdldE9iamVjdCgpO1xuXG4gICAgICBlZGl0QWN0aW9uID0ge1xuICAgICAgICB1cGRhdGVkRGF0YSxcbiAgICAgICAgZWRpdFR5cGU6ICdhZGRQb3NpdGlvbicsXG4gICAgICAgIGZlYXR1cmVJbmRleGVzOiBbZWRpdEhhbmRsZS5mZWF0dXJlSW5kZXhdLFxuICAgICAgICBlZGl0Q29udGV4dDoge1xuICAgICAgICAgIHBvc2l0aW9uSW5kZXhlczogZWRpdEhhbmRsZS5wb3NpdGlvbkluZGV4ZXMsXG4gICAgICAgICAgcG9zaXRpb246IGV2ZW50Lmdyb3VuZENvb3Jkc1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBlZGl0QWN0aW9uO1xuICB9XG5cbiAgaGFuZGxlU3RvcERyYWdnaW5nKGV2ZW50OiBTdG9wRHJhZ2dpbmdFdmVudCk6ID9FZGl0QWN0aW9uIHtcbiAgICBsZXQgZWRpdEFjdGlvbjogP0VkaXRBY3Rpb24gPSBudWxsO1xuXG4gICAgY29uc3Qgc2VsZWN0ZWRGZWF0dXJlSW5kZXhlcyA9IHRoaXMuZ2V0U2VsZWN0ZWRGZWF0dXJlSW5kZXhlcygpO1xuICAgIGNvbnN0IGVkaXRIYW5kbGUgPSBnZXRQaWNrZWRFZGl0SGFuZGxlKGV2ZW50LnBpY2tzKTtcbiAgICBpZiAoc2VsZWN0ZWRGZWF0dXJlSW5kZXhlcy5sZW5ndGggJiYgZWRpdEhhbmRsZSkge1xuICAgICAgY29uc3QgdXBkYXRlZERhdGEgPSB0aGlzLmdldEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uKClcbiAgICAgICAgLnJlcGxhY2VQb3NpdGlvbihlZGl0SGFuZGxlLmZlYXR1cmVJbmRleCwgZWRpdEhhbmRsZS5wb3NpdGlvbkluZGV4ZXMsIGV2ZW50Lmdyb3VuZENvb3JkcylcbiAgICAgICAgLmdldE9iamVjdCgpO1xuXG4gICAgICBlZGl0QWN0aW9uID0ge1xuICAgICAgICB1cGRhdGVkRGF0YSxcbiAgICAgICAgZWRpdFR5cGU6ICdmaW5pc2hNb3ZlUG9zaXRpb24nLFxuICAgICAgICBmZWF0dXJlSW5kZXhlczogW2VkaXRIYW5kbGUuZmVhdHVyZUluZGV4XSxcbiAgICAgICAgZWRpdENvbnRleHQ6IHtcbiAgICAgICAgICBwb3NpdGlvbkluZGV4ZXM6IGVkaXRIYW5kbGUucG9zaXRpb25JbmRleGVzLFxuICAgICAgICAgIHBvc2l0aW9uOiBldmVudC5ncm91bmRDb29yZHNcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gZWRpdEFjdGlvbjtcbiAgfVxuXG4gIGdldEN1cnNvcih7IGlzRHJhZ2dpbmcgfTogeyBpc0RyYWdnaW5nOiBib29sZWFuIH0pOiBzdHJpbmcge1xuICAgIGNvbnN0IHBpY2tzID0gdGhpcy5fbGFzdFBvaW50ZXJNb3ZlUGlja3M7XG5cbiAgICBpZiAocGlja3MgJiYgcGlja3MubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgaGFuZGxlUGlja2VkID0gcGlja3Muc29tZShwaWNrID0+IHBpY2suaXNFZGl0aW5nSGFuZGxlKTtcbiAgICAgIGlmIChoYW5kbGVQaWNrZWQpIHtcbiAgICAgICAgcmV0dXJuICdjZWxsJztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gaXNEcmFnZ2luZyA/ICdncmFiYmluZycgOiAnZ3JhYic7XG4gIH1cbn1cbiJdfQ==