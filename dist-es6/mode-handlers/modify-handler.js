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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL21vZGlmeS1oYW5kbGVyLmpzIl0sIm5hbWVzIjpbIk1vZGlmeUhhbmRsZXIiLCJwaWNrcyIsImdyb3VuZENvb3JkcyIsImhhbmRsZXMiLCJmZWF0dXJlQ29sbGVjdGlvbiIsImdldE9iamVjdCIsImZlYXR1cmVzIiwiZ2V0U2VsZWN0ZWRGZWF0dXJlSW5kZXhlcyIsImluZGV4IiwibGVuZ3RoIiwiZ2VvbWV0cnkiLCJwdXNoIiwiY29uc29sZSIsIndhcm4iLCJleGlzdGluZ0VkaXRIYW5kbGUiLCJmaW5kIiwicGljayIsImlzRWRpdGluZ0hhbmRsZSIsIm9iamVjdCIsInR5cGUiLCJmZWF0dXJlQXNQaWNrIiwiaW5jbHVkZXMiLCJpbnRlcm1lZGlhdGVQb2ludCIsInBvc2l0aW9uSW5kZXhQcmVmaXgiLCJyZWZlcmVuY2VQb2ludCIsImNvb3JkaW5hdGVzIiwibGluZVN0cmluZyIsInByZWZpeCIsImxpbmVTdHJpbmdGZWF0dXJlIiwiY2FuZGlkYXRlSW50ZXJtZWRpYXRlUG9pbnQiLCJuZWFyZXN0UG9pbnRPbkxpbmUiLCJwcm9wZXJ0aWVzIiwiZGlzdCIsInBvc2l0aW9uIiwicG9zaXRpb25JbmRleGVzIiwiZmVhdHVyZUluZGV4IiwibGluZSIsImluUG9pbnQiLCJzb21lIiwiY29vcmQiLCJtb2RlQ29uZmlnIiwiZ2V0TW9kZUNvbmZpZyIsInZpZXdwb3J0IiwibG9nIiwiZXZlbnQiLCJlZGl0QWN0aW9uIiwiY2xpY2tlZEVkaXRIYW5kbGUiLCJ1cGRhdGVkRGF0YSIsImdldEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uIiwicmVtb3ZlUG9zaXRpb24iLCJpZ25vcmVkIiwiZWRpdFR5cGUiLCJmZWF0dXJlSW5kZXhlcyIsImVkaXRDb250ZXh0IiwiYWRkUG9zaXRpb24iLCJfbGFzdFBvaW50ZXJNb3ZlUGlja3MiLCJlZGl0SGFuZGxlIiwicG9pbnRlckRvd25QaWNrcyIsImlzRHJhZ2dpbmciLCJyZXBsYWNlUG9zaXRpb24iLCJjYW5jZWxNYXBQYW4iLCJCb29sZWFuIiwic2VsZWN0ZWRGZWF0dXJlSW5kZXhlcyIsImhhbmRsZVBpY2tlZCIsIk1vZGVIYW5kbGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBRUE7O0FBQ0E7O0FBRUE7O0FBWUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBRWFBLGE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7bUNBR0lDLEssRUFBdUJDLFksRUFBdUM7QUFBQTs7QUFDM0UsVUFBSUMsT0FBTyxHQUFHLEVBQWQ7O0FBRDJFLGtDQUV0RCxLQUFLQyxpQkFBTCxDQUF1QkMsU0FBdkIsRUFGc0Q7QUFBQSxVQUVuRUMsUUFGbUUseUJBRW5FQSxRQUZtRTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFJM0UsNkJBQW9CLEtBQUtDLHlCQUFMLEVBQXBCLDhIQUFzRDtBQUFBLGNBQTNDQyxNQUEyQzs7QUFDcEQsY0FBSUEsTUFBSyxHQUFHRixRQUFRLENBQUNHLE1BQXJCLEVBQTZCO0FBQUE7O0FBQUEsZ0JBQ25CQyxRQURtQixHQUNOSixRQUFRLENBQUNFLE1BQUQsQ0FERixDQUNuQkUsUUFEbUI7O0FBRTNCLHdCQUFBUCxPQUFPLEVBQUNRLElBQVIsb0NBQWdCLDRDQUEwQkQsUUFBMUIsRUFBb0NGLE1BQXBDLENBQWhCO0FBQ0QsV0FIRCxNQUdPO0FBQ0xJLFlBQUFBLE9BQU8sQ0FBQ0MsSUFBUiwrQ0FBb0RMLE1BQXBELEdBREssQ0FDeUQ7QUFDL0Q7QUFDRixTQVgwRSxDQWEzRTs7QUFiMkU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFjM0UsVUFBSVAsS0FBSyxJQUFJQSxLQUFLLENBQUNRLE1BQWYsSUFBeUJQLFlBQTdCLEVBQTJDO0FBQ3pDLFlBQU1ZLGtCQUFrQixHQUFHYixLQUFLLENBQUNjLElBQU4sQ0FDekIsVUFBQUMsSUFBSTtBQUFBLGlCQUFJQSxJQUFJLENBQUNDLGVBQUwsSUFB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ckMsRUFBaUQ7QUFDL0MsWUFBTVQsV0FBVyxHQUFHLEtBQUtDLDZCQUFMLEdBQ2pCVyxlQURpQixDQUNESCxVQUFVLENBQUNyQixZQURWLEVBQ3dCcUIsVUFBVSxDQUFDdEIsZUFEbkMsRUFDb0RVLEtBQUssQ0FBQzFDLFlBRDFELEVBRWpCRyxTQUZpQixFQUFwQjtBQUlBd0MsUUFBQUEsVUFBVSxHQUFHO0FBQ1hFLFVBQUFBLFdBQVcsRUFBWEEsV0FEVztBQUVYSSxVQUFBQSxRQUFRLEVBQUUsb0JBRkM7QUFHWEMsVUFBQUEsY0FBYyxFQUFFLENBQUNJLFVBQVUsQ0FBQ3JCLFlBQVosQ0FITDtBQUlYa0IsVUFBQUEsV0FBVyxFQUFFO0FBQ1huQixZQUFBQSxlQUFlLEVBQUVzQixVQUFVLENBQUN0QixlQURqQjtBQUVYRCxZQUFBQSxRQUFRLEVBQUVXLEtBQUssQ0FBQzFDO0FBRkw7QUFKRixTQUFiO0FBU0Q7O0FBRUQsYUFBTzJDLFVBQVA7QUFDRDs7O29DQUUwRDtBQUFBLFVBQS9DYSxVQUErQyxRQUEvQ0EsVUFBK0M7QUFDekQsVUFBTXpELEtBQUssR0FBRyxLQUFLc0QscUJBQW5COztBQUVBLFVBQUl0RCxLQUFLLElBQUlBLEtBQUssQ0FBQ1EsTUFBTixHQUFlLENBQTVCLEVBQStCO0FBQzdCLFlBQU1zRCxZQUFZLEdBQUc5RCxLQUFLLENBQUNxQyxJQUFOLENBQVcsVUFBQXRCLElBQUk7QUFBQSxpQkFBSUEsSUFBSSxDQUFDQyxlQUFUO0FBQUEsU0FBZixDQUFyQjs7QUFDQSxZQUFJOEMsWUFBSixFQUFrQjtBQUNoQixpQkFBTyxNQUFQO0FBQ0Q7QUFDRjs7QUFFRCxhQUFPTCxVQUFVLEdBQUcsVUFBSCxHQUFnQixNQUFqQztBQUNEOzs7O0VBek9nQ00sd0IiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuXG5pbXBvcnQgbmVhcmVzdFBvaW50T25MaW5lIGZyb20gJ0B0dXJmL25lYXJlc3QtcG9pbnQtb24tbGluZSc7XG5pbXBvcnQgeyBwb2ludCwgbGluZVN0cmluZyBhcyB0b0xpbmVTdHJpbmcgfSBmcm9tICdAdHVyZi9oZWxwZXJzJztcbmltcG9ydCB0eXBlIHsgUG9zaXRpb24sIEZlYXR1cmVPZiwgUG9pbnQsIExpbmVTdHJpbmcgfSBmcm9tICdAbmVidWxhLmdsL2VkaXQtbW9kZXMnO1xuaW1wb3J0IHtcbiAgcmVjdXJzaXZlbHlUcmF2ZXJzZU5lc3RlZEFycmF5cyxcbiAgbmVhcmVzdFBvaW50T25Qcm9qZWN0ZWRMaW5lLFxuICB0eXBlIE5lYXJlc3RQb2ludFR5cGVcbn0gZnJvbSAnLi4vdXRpbHMuanMnO1xuaW1wb3J0IHR5cGUge1xuICBDbGlja0V2ZW50LFxuICBQb2ludGVyTW92ZUV2ZW50LFxuICBTdGFydERyYWdnaW5nRXZlbnQsXG4gIFN0b3BEcmFnZ2luZ0V2ZW50XG59IGZyb20gJy4uL2V2ZW50LXR5cGVzLmpzJztcbmltcG9ydCB0eXBlIHsgRWRpdEFjdGlvbiwgRWRpdEhhbmRsZSB9IGZyb20gJy4vbW9kZS1oYW5kbGVyLmpzJztcbmltcG9ydCB7IE1vZGVIYW5kbGVyLCBnZXRQaWNrZWRFZGl0SGFuZGxlLCBnZXRFZGl0SGFuZGxlc0Zvckdlb21ldHJ5IH0gZnJvbSAnLi9tb2RlLWhhbmRsZXIuanMnO1xuXG5leHBvcnQgY2xhc3MgTW9kaWZ5SGFuZGxlciBleHRlbmRzIE1vZGVIYW5kbGVyIHtcbiAgX2xhc3RQb2ludGVyTW92ZVBpY2tzOiAqO1xuXG4gIGdldEVkaXRIYW5kbGVzKHBpY2tzPzogQXJyYXk8T2JqZWN0PiwgZ3JvdW5kQ29vcmRzPzogUG9zaXRpb24pOiBFZGl0SGFuZGxlW10ge1xuICAgIGxldCBoYW5kbGVzID0gW107XG4gICAgY29uc3QgeyBmZWF0dXJlcyB9ID0gdGhpcy5mZWF0dXJlQ29sbGVjdGlvbi5nZXRPYmplY3QoKTtcblxuICAgIGZvciAoY29uc3QgaW5kZXggb2YgdGhpcy5nZXRTZWxlY3RlZEZlYXR1cmVJbmRleGVzKCkpIHtcbiAgICAgIGlmIChpbmRleCA8IGZlYXR1cmVzLmxlbmd0aCkge1xuICAgICAgICBjb25zdCB7IGdlb21ldHJ5IH0gPSBmZWF0dXJlc1tpbmRleF07XG4gICAgICAgIGhhbmRsZXMucHVzaCguLi5nZXRFZGl0SGFuZGxlc0Zvckdlb21ldHJ5KGdlb21ldHJ5LCBpbmRleCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS53YXJuKGBzZWxlY3RlZEZlYXR1cmVJbmRleGVzIG91dCBvZiByYW5nZSAke2luZGV4fWApOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGUsbm8tdW5kZWZcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBpbnRlcm1lZGlhdGUgZWRpdCBoYW5kbGVcbiAgICBpZiAocGlja3MgJiYgcGlja3MubGVuZ3RoICYmIGdyb3VuZENvb3Jkcykge1xuICAgICAgY29uc3QgZXhpc3RpbmdFZGl0SGFuZGxlID0gcGlja3MuZmluZChcbiAgICAgICAgcGljayA9PiBwaWNrLmlzRWRpdGluZ0hhbmRsZSAmJiBwaWNrLm9iamVjdCAmJiBwaWNrLm9iamVjdC50eXBlID09PSAnZXhpc3RpbmcnXG4gICAgICApO1xuICAgICAgLy8gZG9uJ3Qgc2hvdyBpbnRlcm1lZGlhdGUgcG9pbnQgd2hlbiB0b28gY2xvc2UgdG8gYW4gZXhpc3RpbmcgZWRpdCBoYW5kbGVcbiAgICAgIGNvbnN0IGZlYXR1cmVBc1BpY2sgPSAhZXhpc3RpbmdFZGl0SGFuZGxlICYmIHBpY2tzLmZpbmQocGljayA9PiAhcGljay5pc0VkaXRpbmdIYW5kbGUpO1xuXG4gICAgICAvLyBpcyB0aGUgZmVhdHVyZSBpbiB0aGUgcGljayBzZWxlY3RlZFxuICAgICAgaWYgKFxuICAgICAgICBmZWF0dXJlQXNQaWNrICYmXG4gICAgICAgICFmZWF0dXJlQXNQaWNrLm9iamVjdC5nZW9tZXRyeS50eXBlLmluY2x1ZGVzKCdQb2ludCcpICYmXG4gICAgICAgIHRoaXMuZ2V0U2VsZWN0ZWRGZWF0dXJlSW5kZXhlcygpLmluY2x1ZGVzKGZlYXR1cmVBc1BpY2suaW5kZXgpXG4gICAgICApIHtcbiAgICAgICAgbGV0IGludGVybWVkaWF0ZVBvaW50OiA/TmVhcmVzdFBvaW50VHlwZSA9IG51bGw7XG4gICAgICAgIGxldCBwb3NpdGlvbkluZGV4UHJlZml4ID0gW107XG4gICAgICAgIGNvbnN0IHJlZmVyZW5jZVBvaW50ID0gcG9pbnQoZ3JvdW5kQ29vcmRzKTtcbiAgICAgICAgLy8gcHJvY2VzcyBhbGwgbGluZXMgb2YgdGhlIChzaW5nbGUpIGZlYXR1cmVcbiAgICAgICAgcmVjdXJzaXZlbHlUcmF2ZXJzZU5lc3RlZEFycmF5cyhcbiAgICAgICAgICBmZWF0dXJlQXNQaWNrLm9iamVjdC5nZW9tZXRyeS5jb29yZGluYXRlcyxcbiAgICAgICAgICBbXSxcbiAgICAgICAgICAobGluZVN0cmluZywgcHJlZml4KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBsaW5lU3RyaW5nRmVhdHVyZSA9IHRvTGluZVN0cmluZyhsaW5lU3RyaW5nKTtcbiAgICAgICAgICAgIGNvbnN0IGNhbmRpZGF0ZUludGVybWVkaWF0ZVBvaW50ID0gdGhpcy5uZWFyZXN0UG9pbnRPbkxpbmUoXG4gICAgICAgICAgICAgIGxpbmVTdHJpbmdGZWF0dXJlLFxuICAgICAgICAgICAgICByZWZlcmVuY2VQb2ludFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgIWludGVybWVkaWF0ZVBvaW50IHx8XG4gICAgICAgICAgICAgIGNhbmRpZGF0ZUludGVybWVkaWF0ZVBvaW50LnByb3BlcnRpZXMuZGlzdCA8IGludGVybWVkaWF0ZVBvaW50LnByb3BlcnRpZXMuZGlzdFxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIGludGVybWVkaWF0ZVBvaW50ID0gY2FuZGlkYXRlSW50ZXJtZWRpYXRlUG9pbnQ7XG4gICAgICAgICAgICAgIHBvc2l0aW9uSW5kZXhQcmVmaXggPSBwcmVmaXg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgICAvLyB0YWNrIG9uIHRoZSBsb25lIGludGVybWVkaWF0ZSBwb2ludCB0byB0aGUgc2V0IG9mIGhhbmRsZXNcbiAgICAgICAgaWYgKGludGVybWVkaWF0ZVBvaW50KSB7XG4gICAgICAgICAgY29uc3Qge1xuICAgICAgICAgICAgZ2VvbWV0cnk6IHsgY29vcmRpbmF0ZXM6IHBvc2l0aW9uIH0sXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7IGluZGV4IH1cbiAgICAgICAgICB9ID0gaW50ZXJtZWRpYXRlUG9pbnQ7XG4gICAgICAgICAgaGFuZGxlcyA9IFtcbiAgICAgICAgICAgIC4uLmhhbmRsZXMsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHBvc2l0aW9uLFxuICAgICAgICAgICAgICBwb3NpdGlvbkluZGV4ZXM6IFsuLi5wb3NpdGlvbkluZGV4UHJlZml4LCBpbmRleCArIDFdLFxuICAgICAgICAgICAgICBmZWF0dXJlSW5kZXg6IGZlYXR1cmVBc1BpY2suaW5kZXgsXG4gICAgICAgICAgICAgIHR5cGU6ICdpbnRlcm1lZGlhdGUnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBoYW5kbGVzO1xuICB9XG5cbiAgLy8gdHVyZi5qcyBkb2VzIG5vdCBzdXBwb3J0IGVsZXZhdGlvbiBmb3IgbmVhcmVzdFBvaW50T25MaW5lXG4gIG5lYXJlc3RQb2ludE9uTGluZShsaW5lOiBGZWF0dXJlT2Y8TGluZVN0cmluZz4sIGluUG9pbnQ6IEZlYXR1cmVPZjxQb2ludD4pOiBOZWFyZXN0UG9pbnRUeXBlIHtcbiAgICBjb25zdCB7IGNvb3JkaW5hdGVzIH0gPSBsaW5lLmdlb21ldHJ5O1xuICAgIGlmIChjb29yZGluYXRlcy5zb21lKGNvb3JkID0+IGNvb3JkLmxlbmd0aCA+IDIpKSB7XG4gICAgICBjb25zdCBtb2RlQ29uZmlnID0gdGhpcy5nZXRNb2RlQ29uZmlnKCk7XG4gICAgICBpZiAobW9kZUNvbmZpZyAmJiBtb2RlQ29uZmlnLnZpZXdwb3J0KSB7XG4gICAgICAgIC8vIFRoaXMgbGluZSBoYXMgZWxldmF0aW9uLCB3ZSBuZWVkIHRvIHVzZSBhbHRlcm5hdGl2ZSBhbGdvcml0aG1cbiAgICAgICAgcmV0dXJuIG5lYXJlc3RQb2ludE9uUHJvamVjdGVkTGluZShsaW5lLCBpblBvaW50LCBtb2RlQ29uZmlnLnZpZXdwb3J0KTtcbiAgICAgIH1cbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlLG5vLXVuZGVmXG4gICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgJ0VkaXRpbmcgM0QgcG9pbnQgYnV0IG1vZGVDb25maWcudmlld3BvcnQgbm90IHByb3ZpZGVkLiBGYWxsaW5nIGJhY2sgdG8gMkQgbG9naWMuJ1xuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmVhcmVzdFBvaW50T25MaW5lKGxpbmUsIGluUG9pbnQpO1xuICB9XG5cbiAgaGFuZGxlQ2xpY2soZXZlbnQ6IENsaWNrRXZlbnQpOiA/RWRpdEFjdGlvbiB7XG4gICAgbGV0IGVkaXRBY3Rpb246ID9FZGl0QWN0aW9uID0gbnVsbDtcblxuICAgIGNvbnN0IGNsaWNrZWRFZGl0SGFuZGxlID0gZ2V0UGlja2VkRWRpdEhhbmRsZShldmVudC5waWNrcyk7XG5cbiAgICBpZiAoY2xpY2tlZEVkaXRIYW5kbGUgJiYgY2xpY2tlZEVkaXRIYW5kbGUuZmVhdHVyZUluZGV4ID49IDApIHtcbiAgICAgIGlmIChjbGlja2VkRWRpdEhhbmRsZS50eXBlID09PSAnZXhpc3RpbmcnKSB7XG4gICAgICAgIGxldCB1cGRhdGVkRGF0YTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB1cGRhdGVkRGF0YSA9IHRoaXMuZ2V0SW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24oKVxuICAgICAgICAgICAgLnJlbW92ZVBvc2l0aW9uKGNsaWNrZWRFZGl0SGFuZGxlLmZlYXR1cmVJbmRleCwgY2xpY2tlZEVkaXRIYW5kbGUucG9zaXRpb25JbmRleGVzKVxuICAgICAgICAgICAgLmdldE9iamVjdCgpO1xuICAgICAgICB9IGNhdGNoIChpZ25vcmVkKSB7XG4gICAgICAgICAgLy8gVGhpcyBoYXBwZW5zIGlmIHVzZXIgYXR0ZW1wdHMgdG8gcmVtb3ZlIHRoZSBsYXN0IHBvaW50XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodXBkYXRlZERhdGEpIHtcbiAgICAgICAgICBlZGl0QWN0aW9uID0ge1xuICAgICAgICAgICAgdXBkYXRlZERhdGEsXG4gICAgICAgICAgICBlZGl0VHlwZTogJ3JlbW92ZVBvc2l0aW9uJyxcbiAgICAgICAgICAgIGZlYXR1cmVJbmRleGVzOiBbY2xpY2tlZEVkaXRIYW5kbGUuZmVhdHVyZUluZGV4XSxcbiAgICAgICAgICAgIGVkaXRDb250ZXh0OiB7XG4gICAgICAgICAgICAgIHBvc2l0aW9uSW5kZXhlczogY2xpY2tlZEVkaXRIYW5kbGUucG9zaXRpb25JbmRleGVzLFxuICAgICAgICAgICAgICBwb3NpdGlvbjogY2xpY2tlZEVkaXRIYW5kbGUucG9zaXRpb25cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGNsaWNrZWRFZGl0SGFuZGxlLnR5cGUgPT09ICdpbnRlcm1lZGlhdGUnKSB7XG4gICAgICAgIGNvbnN0IHVwZGF0ZWREYXRhID0gdGhpcy5nZXRJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbigpXG4gICAgICAgICAgLmFkZFBvc2l0aW9uKFxuICAgICAgICAgICAgY2xpY2tlZEVkaXRIYW5kbGUuZmVhdHVyZUluZGV4LFxuICAgICAgICAgICAgY2xpY2tlZEVkaXRIYW5kbGUucG9zaXRpb25JbmRleGVzLFxuICAgICAgICAgICAgY2xpY2tlZEVkaXRIYW5kbGUucG9zaXRpb25cbiAgICAgICAgICApXG4gICAgICAgICAgLmdldE9iamVjdCgpO1xuXG4gICAgICAgIGlmICh1cGRhdGVkRGF0YSkge1xuICAgICAgICAgIGVkaXRBY3Rpb24gPSB7XG4gICAgICAgICAgICB1cGRhdGVkRGF0YSxcbiAgICAgICAgICAgIGVkaXRUeXBlOiAnYWRkUG9zaXRpb24nLFxuICAgICAgICAgICAgZmVhdHVyZUluZGV4ZXM6IFtjbGlja2VkRWRpdEhhbmRsZS5mZWF0dXJlSW5kZXhdLFxuICAgICAgICAgICAgZWRpdENvbnRleHQ6IHtcbiAgICAgICAgICAgICAgcG9zaXRpb25JbmRleGVzOiBjbGlja2VkRWRpdEhhbmRsZS5wb3NpdGlvbkluZGV4ZXMsXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiBjbGlja2VkRWRpdEhhbmRsZS5wb3NpdGlvblxuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGVkaXRBY3Rpb247XG4gIH1cblxuICBoYW5kbGVQb2ludGVyTW92ZShldmVudDogUG9pbnRlck1vdmVFdmVudCk6IHsgZWRpdEFjdGlvbjogP0VkaXRBY3Rpb24sIGNhbmNlbE1hcFBhbjogYm9vbGVhbiB9IHtcbiAgICB0aGlzLl9sYXN0UG9pbnRlck1vdmVQaWNrcyA9IGV2ZW50LnBpY2tzO1xuXG4gICAgbGV0IGVkaXRBY3Rpb246ID9FZGl0QWN0aW9uID0gbnVsbDtcblxuICAgIGNvbnN0IGVkaXRIYW5kbGUgPSBnZXRQaWNrZWRFZGl0SGFuZGxlKGV2ZW50LnBvaW50ZXJEb3duUGlja3MpO1xuXG4gICAgaWYgKGV2ZW50LmlzRHJhZ2dpbmcgJiYgZWRpdEhhbmRsZSkge1xuICAgICAgY29uc3QgdXBkYXRlZERhdGEgPSB0aGlzLmdldEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uKClcbiAgICAgICAgLnJlcGxhY2VQb3NpdGlvbihlZGl0SGFuZGxlLmZlYXR1cmVJbmRleCwgZWRpdEhhbmRsZS5wb3NpdGlvbkluZGV4ZXMsIGV2ZW50Lmdyb3VuZENvb3JkcylcbiAgICAgICAgLmdldE9iamVjdCgpO1xuXG4gICAgICBlZGl0QWN0aW9uID0ge1xuICAgICAgICB1cGRhdGVkRGF0YSxcbiAgICAgICAgZWRpdFR5cGU6ICdtb3ZlUG9zaXRpb24nLFxuICAgICAgICBmZWF0dXJlSW5kZXhlczogW2VkaXRIYW5kbGUuZmVhdHVyZUluZGV4XSxcbiAgICAgICAgZWRpdENvbnRleHQ6IHtcbiAgICAgICAgICBwb3NpdGlvbkluZGV4ZXM6IGVkaXRIYW5kbGUucG9zaXRpb25JbmRleGVzLFxuICAgICAgICAgIHBvc2l0aW9uOiBldmVudC5ncm91bmRDb29yZHNcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBDYW5jZWwgbWFwIHBhbm5pbmcgaWYgcG9pbnRlciB3ZW50IGRvd24gb24gYW4gZWRpdCBoYW5kbGVcbiAgICBjb25zdCBjYW5jZWxNYXBQYW4gPSBCb29sZWFuKGVkaXRIYW5kbGUpO1xuXG4gICAgcmV0dXJuIHsgZWRpdEFjdGlvbiwgY2FuY2VsTWFwUGFuIH07XG4gIH1cblxuICBoYW5kbGVTdGFydERyYWdnaW5nKGV2ZW50OiBTdGFydERyYWdnaW5nRXZlbnQpOiA/RWRpdEFjdGlvbiB7XG4gICAgbGV0IGVkaXRBY3Rpb246ID9FZGl0QWN0aW9uID0gbnVsbDtcblxuICAgIGNvbnN0IHNlbGVjdGVkRmVhdHVyZUluZGV4ZXMgPSB0aGlzLmdldFNlbGVjdGVkRmVhdHVyZUluZGV4ZXMoKTtcblxuICAgIGNvbnN0IGVkaXRIYW5kbGUgPSBnZXRQaWNrZWRFZGl0SGFuZGxlKGV2ZW50LnBpY2tzKTtcbiAgICBpZiAoc2VsZWN0ZWRGZWF0dXJlSW5kZXhlcy5sZW5ndGggJiYgZWRpdEhhbmRsZSAmJiBlZGl0SGFuZGxlLnR5cGUgPT09ICdpbnRlcm1lZGlhdGUnKSB7XG4gICAgICBjb25zdCB1cGRhdGVkRGF0YSA9IHRoaXMuZ2V0SW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24oKVxuICAgICAgICAuYWRkUG9zaXRpb24oZWRpdEhhbmRsZS5mZWF0dXJlSW5kZXgsIGVkaXRIYW5kbGUucG9zaXRpb25JbmRleGVzLCBldmVudC5ncm91bmRDb29yZHMpXG4gICAgICAgIC5nZXRPYmplY3QoKTtcblxuICAgICAgZWRpdEFjdGlvbiA9IHtcbiAgICAgICAgdXBkYXRlZERhdGEsXG4gICAgICAgIGVkaXRUeXBlOiAnYWRkUG9zaXRpb24nLFxuICAgICAgICBmZWF0dXJlSW5kZXhlczogW2VkaXRIYW5kbGUuZmVhdHVyZUluZGV4XSxcbiAgICAgICAgZWRpdENvbnRleHQ6IHtcbiAgICAgICAgICBwb3NpdGlvbkluZGV4ZXM6IGVkaXRIYW5kbGUucG9zaXRpb25JbmRleGVzLFxuICAgICAgICAgIHBvc2l0aW9uOiBldmVudC5ncm91bmRDb29yZHNcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gZWRpdEFjdGlvbjtcbiAgfVxuXG4gIGhhbmRsZVN0b3BEcmFnZ2luZyhldmVudDogU3RvcERyYWdnaW5nRXZlbnQpOiA/RWRpdEFjdGlvbiB7XG4gICAgbGV0IGVkaXRBY3Rpb246ID9FZGl0QWN0aW9uID0gbnVsbDtcblxuICAgIGNvbnN0IHNlbGVjdGVkRmVhdHVyZUluZGV4ZXMgPSB0aGlzLmdldFNlbGVjdGVkRmVhdHVyZUluZGV4ZXMoKTtcbiAgICBjb25zdCBlZGl0SGFuZGxlID0gZ2V0UGlja2VkRWRpdEhhbmRsZShldmVudC5waWNrcyk7XG4gICAgaWYgKHNlbGVjdGVkRmVhdHVyZUluZGV4ZXMubGVuZ3RoICYmIGVkaXRIYW5kbGUpIHtcbiAgICAgIGNvbnN0IHVwZGF0ZWREYXRhID0gdGhpcy5nZXRJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbigpXG4gICAgICAgIC5yZXBsYWNlUG9zaXRpb24oZWRpdEhhbmRsZS5mZWF0dXJlSW5kZXgsIGVkaXRIYW5kbGUucG9zaXRpb25JbmRleGVzLCBldmVudC5ncm91bmRDb29yZHMpXG4gICAgICAgIC5nZXRPYmplY3QoKTtcblxuICAgICAgZWRpdEFjdGlvbiA9IHtcbiAgICAgICAgdXBkYXRlZERhdGEsXG4gICAgICAgIGVkaXRUeXBlOiAnZmluaXNoTW92ZVBvc2l0aW9uJyxcbiAgICAgICAgZmVhdHVyZUluZGV4ZXM6IFtlZGl0SGFuZGxlLmZlYXR1cmVJbmRleF0sXG4gICAgICAgIGVkaXRDb250ZXh0OiB7XG4gICAgICAgICAgcG9zaXRpb25JbmRleGVzOiBlZGl0SGFuZGxlLnBvc2l0aW9uSW5kZXhlcyxcbiAgICAgICAgICBwb3NpdGlvbjogZXZlbnQuZ3JvdW5kQ29vcmRzXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIGVkaXRBY3Rpb247XG4gIH1cblxuICBnZXRDdXJzb3IoeyBpc0RyYWdnaW5nIH06IHsgaXNEcmFnZ2luZzogYm9vbGVhbiB9KTogc3RyaW5nIHtcbiAgICBjb25zdCBwaWNrcyA9IHRoaXMuX2xhc3RQb2ludGVyTW92ZVBpY2tzO1xuXG4gICAgaWYgKHBpY2tzICYmIHBpY2tzLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IGhhbmRsZVBpY2tlZCA9IHBpY2tzLnNvbWUocGljayA9PiBwaWNrLmlzRWRpdGluZ0hhbmRsZSk7XG4gICAgICBpZiAoaGFuZGxlUGlja2VkKSB7XG4gICAgICAgIHJldHVybiAnY2VsbCc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGlzRHJhZ2dpbmcgPyAnZ3JhYmJpbmcnIDogJ2dyYWInO1xuICB9XG59XG4iXX0=