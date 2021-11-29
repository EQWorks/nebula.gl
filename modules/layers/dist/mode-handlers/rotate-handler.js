"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RotateHandler = void 0;

var _centroid = _interopRequireDefault(require("@turf/centroid"));

var _bearing = _interopRequireDefault(require("@turf/bearing"));

var _transformRotate = _interopRequireDefault(require("@turf/transform-rotate"));

var _modeHandler = require("./mode-handler.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
var RotateHandler =
/*#__PURE__*/
function (_ModeHandler) {
  _inherits(RotateHandler, _ModeHandler);

  function RotateHandler() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, RotateHandler);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(RotateHandler)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_isRotatable", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_geometryBeingRotated", void 0);

    return _this;
  }

  _createClass(RotateHandler, [{
    key: "handlePointerMove",
    value: function handlePointerMove(event) {
      var editAction = null;
      this._isRotatable = Boolean(this._geometryBeingRotated) || this.isSelectionPicked(event.picks);

      if (!this._isRotatable || !event.pointerDownGroundCoords) {
        // Nothing to do
        return {
          editAction: null,
          cancelMapPan: false
        };
      }

      if (event.isDragging && this._geometryBeingRotated) {
        // Rotate the geometry
        editAction = this.getRotateAction(event.pointerDownGroundCoords, event.groundCoords, 'rotating');
      }

      return {
        editAction: editAction,
        cancelMapPan: true
      };
    }
  }, {
    key: "handleStartDragging",
    value: function handleStartDragging(event) {
      if (!this._isRotatable) {
        return null;
      }

      this._geometryBeingRotated = this.getSelectedFeaturesAsFeatureCollection();
      return null;
    }
  }, {
    key: "handleStopDragging",
    value: function handleStopDragging(event) {
      var editAction = null;

      if (this._geometryBeingRotated) {
        // Rotate the geometry
        editAction = this.getRotateAction(event.pointerDownGroundCoords, event.groundCoords, 'rotated');
        this._geometryBeingRotated = null;
      }

      return editAction;
    }
  }, {
    key: "getCursor",
    value: function getCursor(_ref) {
      var isDragging = _ref.isDragging;

      if (this._isRotatable) {
        // TODO: look at doing SVG cursors to get a better "rotate" cursor
        return 'move';
      }

      return isDragging ? 'grabbing' : 'grab';
    }
  }, {
    key: "getRotateAction",
    value: function getRotateAction(startDragPoint, currentPoint, editType) {
      var startPosition = startDragPoint;
      var centroid = (0, _centroid.default)(this._geometryBeingRotated);
      var angle = getRotationAngle(centroid, startPosition, currentPoint);
      var rotatedFeatures = (0, _transformRotate.default)(this._geometryBeingRotated, angle);
      var updatedData = this.getImmutableFeatureCollection();
      var selectedIndexes = this.getSelectedFeatureIndexes();

      for (var i = 0; i < selectedIndexes.length; i++) {
        var selectedIndex = selectedIndexes[i];
        var movedFeature = rotatedFeatures.features[i];
        updatedData = updatedData.replaceGeometry(selectedIndex, movedFeature.geometry);
      }

      return {
        updatedData: updatedData.getObject(),
        editType: editType,
        featureIndexes: selectedIndexes,
        editContext: null
      };
    }
  }]);

  return RotateHandler;
}(_modeHandler.ModeHandler);

exports.RotateHandler = RotateHandler;

function getRotationAngle(centroid, startDragPoint, currentPoint) {
  var bearing1 = (0, _bearing.default)(centroid, startDragPoint);
  var bearing2 = (0, _bearing.default)(centroid, currentPoint);
  return bearing2 - bearing1;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL3JvdGF0ZS1oYW5kbGVyLmpzIl0sIm5hbWVzIjpbIlJvdGF0ZUhhbmRsZXIiLCJldmVudCIsImVkaXRBY3Rpb24iLCJfaXNSb3RhdGFibGUiLCJCb29sZWFuIiwiX2dlb21ldHJ5QmVpbmdSb3RhdGVkIiwiaXNTZWxlY3Rpb25QaWNrZWQiLCJwaWNrcyIsInBvaW50ZXJEb3duR3JvdW5kQ29vcmRzIiwiY2FuY2VsTWFwUGFuIiwiaXNEcmFnZ2luZyIsImdldFJvdGF0ZUFjdGlvbiIsImdyb3VuZENvb3JkcyIsImdldFNlbGVjdGVkRmVhdHVyZXNBc0ZlYXR1cmVDb2xsZWN0aW9uIiwic3RhcnREcmFnUG9pbnQiLCJjdXJyZW50UG9pbnQiLCJlZGl0VHlwZSIsInN0YXJ0UG9zaXRpb24iLCJjZW50cm9pZCIsImFuZ2xlIiwiZ2V0Um90YXRpb25BbmdsZSIsInJvdGF0ZWRGZWF0dXJlcyIsInVwZGF0ZWREYXRhIiwiZ2V0SW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24iLCJzZWxlY3RlZEluZGV4ZXMiLCJnZXRTZWxlY3RlZEZlYXR1cmVJbmRleGVzIiwiaSIsImxlbmd0aCIsInNlbGVjdGVkSW5kZXgiLCJtb3ZlZEZlYXR1cmUiLCJmZWF0dXJlcyIsInJlcGxhY2VHZW9tZXRyeSIsImdlb21ldHJ5IiwiZ2V0T2JqZWN0IiwiZmVhdHVyZUluZGV4ZXMiLCJlZGl0Q29udGV4dCIsIk1vZGVIYW5kbGVyIiwiYmVhcmluZzEiLCJiZWFyaW5nMiJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVBOztBQUNBOztBQUNBOztBQUlBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQTtJQUNhQSxhOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7c0NBSU9DLEssRUFBNkU7QUFDN0YsVUFBSUMsVUFBdUIsR0FBRyxJQUE5QjtBQUVBLFdBQUtDLFlBQUwsR0FBb0JDLE9BQU8sQ0FBQyxLQUFLQyxxQkFBTixDQUFQLElBQXVDLEtBQUtD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Q0FBakI7QUFDQSxNQUFNd0IsUUFBUSxHQUFHLHNCQUFZcEIsUUFBWixFQUFzQkgsWUFBdEIsQ0FBakI7QUFDQSxTQUFPdUIsUUFBUSxHQUFHRCxRQUFsQjtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuaW1wb3J0IHR1cmZDZW50cm9pZCBmcm9tICdAdHVyZi9jZW50cm9pZCc7XG5pbXBvcnQgdHVyZkJlYXJpbmcgZnJvbSAnQHR1cmYvYmVhcmluZyc7XG5pbXBvcnQgdHVyZlRyYW5zZm9ybVJvdGF0ZSBmcm9tICdAdHVyZi90cmFuc2Zvcm0tcm90YXRlJztcbmltcG9ydCB0eXBlIHsgRmVhdHVyZUNvbGxlY3Rpb24sIFBvc2l0aW9uIH0gZnJvbSAna2VwbGVyLW91dGRhdGVkLW5lYnVsYS5nbC1lZGl0LW1vZGVzJztcbmltcG9ydCB0eXBlIHsgUG9pbnRlck1vdmVFdmVudCwgU3RhcnREcmFnZ2luZ0V2ZW50LCBTdG9wRHJhZ2dpbmdFdmVudCB9IGZyb20gJy4uL2V2ZW50LXR5cGVzLmpzJztcbmltcG9ydCB0eXBlIHsgRWRpdEFjdGlvbiB9IGZyb20gJy4vbW9kZS1oYW5kbGVyLmpzJztcbmltcG9ydCB7IE1vZGVIYW5kbGVyIH0gZnJvbSAnLi9tb2RlLWhhbmRsZXIuanMnO1xuXG4vLyBUT0RPIGVkaXQtbW9kZXM6IGRlbGV0ZSBoYW5kbGVycyBvbmNlIEVkaXRNb2RlIGZ1bGx5IGltcGxlbWVudGVkXG5leHBvcnQgY2xhc3MgUm90YXRlSGFuZGxlciBleHRlbmRzIE1vZGVIYW5kbGVyIHtcbiAgX2lzUm90YXRhYmxlOiBib29sZWFuO1xuICBfZ2VvbWV0cnlCZWluZ1JvdGF0ZWQ6ID9GZWF0dXJlQ29sbGVjdGlvbjtcblxuICBoYW5kbGVQb2ludGVyTW92ZShldmVudDogUG9pbnRlck1vdmVFdmVudCk6IHsgZWRpdEFjdGlvbjogP0VkaXRBY3Rpb24sIGNhbmNlbE1hcFBhbjogYm9vbGVhbiB9IHtcbiAgICBsZXQgZWRpdEFjdGlvbjogP0VkaXRBY3Rpb24gPSBudWxsO1xuXG4gICAgdGhpcy5faXNSb3RhdGFibGUgPSBCb29sZWFuKHRoaXMuX2dlb21ldHJ5QmVpbmdSb3RhdGVkKSB8fCB0aGlzLmlzU2VsZWN0aW9uUGlja2VkKGV2ZW50LnBpY2tzKTtcblxuICAgIGlmICghdGhpcy5faXNSb3RhdGFibGUgfHwgIWV2ZW50LnBvaW50ZXJEb3duR3JvdW5kQ29vcmRzKSB7XG4gICAgICAvLyBOb3RoaW5nIHRvIGRvXG4gICAgICByZXR1cm4geyBlZGl0QWN0aW9uOiBudWxsLCBjYW5jZWxNYXBQYW46IGZhbHNlIH07XG4gICAgfVxuXG4gICAgaWYgKGV2ZW50LmlzRHJhZ2dpbmcgJiYgdGhpcy5fZ2VvbWV0cnlCZWluZ1JvdGF0ZWQpIHtcbiAgICAgIC8vIFJvdGF0ZSB0aGUgZ2VvbWV0cnlcbiAgICAgIGVkaXRBY3Rpb24gPSB0aGlzLmdldFJvdGF0ZUFjdGlvbihcbiAgICAgICAgZXZlbnQucG9pbnRlckRvd25Hcm91bmRDb29yZHMsXG4gICAgICAgIGV2ZW50Lmdyb3VuZENvb3JkcyxcbiAgICAgICAgJ3JvdGF0aW5nJ1xuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4geyBlZGl0QWN0aW9uLCBjYW5jZWxNYXBQYW46IHRydWUgfTtcbiAgfVxuXG4gIGhhbmRsZVN0YXJ0RHJhZ2dpbmcoZXZlbnQ6IFN0YXJ0RHJhZ2dpbmdFdmVudCk6ID9FZGl0QWN0aW9uIHtcbiAgICBpZiAoIXRoaXMuX2lzUm90YXRhYmxlKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB0aGlzLl9nZW9tZXRyeUJlaW5nUm90YXRlZCA9IHRoaXMuZ2V0U2VsZWN0ZWRGZWF0dXJlc0FzRmVhdHVyZUNvbGxlY3Rpb24oKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGhhbmRsZVN0b3BEcmFnZ2luZyhldmVudDogU3RvcERyYWdnaW5nRXZlbnQpOiA/RWRpdEFjdGlvbiB7XG4gICAgbGV0IGVkaXRBY3Rpb246ID9FZGl0QWN0aW9uID0gbnVsbDtcblxuICAgIGlmICh0aGlzLl9nZW9tZXRyeUJlaW5nUm90YXRlZCkge1xuICAgICAgLy8gUm90YXRlIHRoZSBnZW9tZXRyeVxuICAgICAgZWRpdEFjdGlvbiA9IHRoaXMuZ2V0Um90YXRlQWN0aW9uKFxuICAgICAgICBldmVudC5wb2ludGVyRG93bkdyb3VuZENvb3JkcyxcbiAgICAgICAgZXZlbnQuZ3JvdW5kQ29vcmRzLFxuICAgICAgICAncm90YXRlZCdcbiAgICAgICk7XG4gICAgICB0aGlzLl9nZW9tZXRyeUJlaW5nUm90YXRlZCA9IG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVkaXRBY3Rpb247XG4gIH1cblxuICBnZXRDdXJzb3IoeyBpc0RyYWdnaW5nIH06IHsgaXNEcmFnZ2luZzogYm9vbGVhbiB9KTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy5faXNSb3RhdGFibGUpIHtcbiAgICAgIC8vIFRPRE86IGxvb2sgYXQgZG9pbmcgU1ZHIGN1cnNvcnMgdG8gZ2V0IGEgYmV0dGVyIFwicm90YXRlXCIgY3Vyc29yXG4gICAgICByZXR1cm4gJ21vdmUnO1xuICAgIH1cbiAgICByZXR1cm4gaXNEcmFnZ2luZyA/ICdncmFiYmluZycgOiAnZ3JhYic7XG4gIH1cblxuICBnZXRSb3RhdGVBY3Rpb24oc3RhcnREcmFnUG9pbnQ6IFBvc2l0aW9uLCBjdXJyZW50UG9pbnQ6IFBvc2l0aW9uLCBlZGl0VHlwZTogc3RyaW5nKTogRWRpdEFjdGlvbiB7XG4gICAgY29uc3Qgc3RhcnRQb3NpdGlvbiA9IHN0YXJ0RHJhZ1BvaW50O1xuICAgIGNvbnN0IGNlbnRyb2lkID0gdHVyZkNlbnRyb2lkKHRoaXMuX2dlb21ldHJ5QmVpbmdSb3RhdGVkKTtcbiAgICBjb25zdCBhbmdsZSA9IGdldFJvdGF0aW9uQW5nbGUoY2VudHJvaWQsIHN0YXJ0UG9zaXRpb24sIGN1cnJlbnRQb2ludCk7XG5cbiAgICBjb25zdCByb3RhdGVkRmVhdHVyZXMgPSB0dXJmVHJhbnNmb3JtUm90YXRlKHRoaXMuX2dlb21ldHJ5QmVpbmdSb3RhdGVkLCBhbmdsZSk7XG5cbiAgICBsZXQgdXBkYXRlZERhdGEgPSB0aGlzLmdldEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uKCk7XG5cbiAgICBjb25zdCBzZWxlY3RlZEluZGV4ZXMgPSB0aGlzLmdldFNlbGVjdGVkRmVhdHVyZUluZGV4ZXMoKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNlbGVjdGVkSW5kZXhlcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3Qgc2VsZWN0ZWRJbmRleCA9IHNlbGVjdGVkSW5kZXhlc1tpXTtcbiAgICAgIGNvbnN0IG1vdmVkRmVhdHVyZSA9IHJvdGF0ZWRGZWF0dXJlcy5mZWF0dXJlc1tpXTtcbiAgICAgIHVwZGF0ZWREYXRhID0gdXBkYXRlZERhdGEucmVwbGFjZUdlb21ldHJ5KHNlbGVjdGVkSW5kZXgsIG1vdmVkRmVhdHVyZS5nZW9tZXRyeSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHVwZGF0ZWREYXRhOiB1cGRhdGVkRGF0YS5nZXRPYmplY3QoKSxcbiAgICAgIGVkaXRUeXBlLFxuICAgICAgZmVhdHVyZUluZGV4ZXM6IHNlbGVjdGVkSW5kZXhlcyxcbiAgICAgIGVkaXRDb250ZXh0OiBudWxsXG4gICAgfTtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRSb3RhdGlvbkFuZ2xlKGNlbnRyb2lkOiBQb3NpdGlvbiwgc3RhcnREcmFnUG9pbnQ6IFBvc2l0aW9uLCBjdXJyZW50UG9pbnQ6IFBvc2l0aW9uKSB7XG4gIGNvbnN0IGJlYXJpbmcxID0gdHVyZkJlYXJpbmcoY2VudHJvaWQsIHN0YXJ0RHJhZ1BvaW50KTtcbiAgY29uc3QgYmVhcmluZzIgPSB0dXJmQmVhcmluZyhjZW50cm9pZCwgY3VycmVudFBvaW50KTtcbiAgcmV0dXJuIGJlYXJpbmcyIC0gYmVhcmluZzE7XG59XG4iXX0=