"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScaleHandler = void 0;

var _centroid = _interopRequireDefault(require("@turf/centroid"));

var _distance = _interopRequireDefault(require("@turf/distance"));

var _transformScale = _interopRequireDefault(require("@turf/transform-scale"));

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

var ScaleHandler =
/*#__PURE__*/
function (_ModeHandler) {
  _inherits(ScaleHandler, _ModeHandler);

  function ScaleHandler() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, ScaleHandler);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ScaleHandler)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_isScalable", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_geometryBeingScaled", void 0);

    return _this;
  }

  _createClass(ScaleHandler, [{
    key: "handlePointerMove",
    value: function handlePointerMove(event) {
      var editAction = null;
      this._isScalable = Boolean(this._geometryBeingScaled) || this.isSelectionPicked(event.picks);

      if (!this._isScalable || !event.pointerDownGroundCoords) {
        // Nothing to do
        return {
          editAction: null,
          cancelMapPan: false
        };
      }

      if (event.isDragging && this._geometryBeingScaled) {
        // Scale the geometry
        editAction = this.getScaleAction(event.pointerDownGroundCoords, event.groundCoords, 'scaling');
      }

      return {
        editAction: editAction,
        cancelMapPan: true
      };
    }
  }, {
    key: "handleStartDragging",
    value: function handleStartDragging(event) {
      if (!this._isScalable) {
        return null;
      }

      this._geometryBeingScaled = this.getSelectedFeaturesAsFeatureCollection();
      return null;
    }
  }, {
    key: "handleStopDragging",
    value: function handleStopDragging(event) {
      var editAction = null;

      if (this._geometryBeingScaled) {
        // Scale the geometry
        editAction = this.getScaleAction(event.pointerDownGroundCoords, event.groundCoords, 'scaled');
        this._geometryBeingScaled = null;
      }

      return editAction;
    }
  }, {
    key: "getCursor",
    value: function getCursor(_ref) {
      var isDragging = _ref.isDragging;

      if (this._isScalable) {
        // TODO: look at doing SVG cursors to get a better "scale" cursor
        return 'move';
      }

      return isDragging ? 'grabbing' : 'grab';
    }
  }, {
    key: "getScaleAction",
    value: function getScaleAction(startDragPoint, currentPoint, editType) {
      var startPosition = startDragPoint;
      var centroid = (0, _centroid.default)(this._geometryBeingScaled);
      var factor = getScaleFactor(centroid, startPosition, currentPoint);
      var scaledFeatures = (0, _transformScale.default)(this._geometryBeingScaled, factor, {
        origin: centroid
      });
      var updatedData = this.getImmutableFeatureCollection();
      var selectedIndexes = this.getSelectedFeatureIndexes();

      for (var i = 0; i < selectedIndexes.length; i++) {
        var selectedIndex = selectedIndexes[i];
        var movedFeature = scaledFeatures.features[i];
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

  return ScaleHandler;
}(_modeHandler.ModeHandler);

exports.ScaleHandler = ScaleHandler;

function getScaleFactor(centroid, startDragPoint, currentPoint) {
  var startDistance = (0, _distance.default)(centroid, startDragPoint);
  var endDistance = (0, _distance.default)(centroid, currentPoint);
  return endDistance / startDistance;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL3NjYWxlLWhhbmRsZXIuanMiXSwibmFtZXMiOlsiU2NhbGVIYW5kbGVyIiwiZXZlbnQiLCJlZGl0QWN0aW9uIiwiX2lzU2NhbGFibGUiLCJCb29sZWFuIiwiX2dlb21ldHJ5QmVpbmdTY2FsZWQiLCJpc1NlbGVjdGlvblBpY2tlZCIsInBpY2tzIiwicG9pbnRlckRvd25Hcm91bmRDb29yZHMiLCJjYW5jZWxNYXBQYW4iLCJpc0RyYWdnaW5nIiwiZ2V0U2NhbGVBY3Rpb24iLCJncm91bmRDb29yZHMiLCJnZXRTZWxlY3RlZEZlYXR1cmVzQXNGZWF0dXJlQ29sbGVjdGlvbiIsInN0YXJ0RHJhZ1BvaW50IiwiY3VycmVudFBvaW50IiwiZWRpdFR5cGUiLCJzdGFydFBvc2l0aW9uIiwiY2VudHJvaWQiLCJmYWN0b3IiLCJnZXRTY2FsZUZhY3RvciIsInNjYWxlZEZlYXR1cmVzIiwib3JpZ2luIiwidXBkYXRlZERhdGEiLCJnZXRJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbiIsInNlbGVjdGVkSW5kZXhlcyIsImdldFNlbGVjdGVkRmVhdHVyZUluZGV4ZXMiLCJpIiwibGVuZ3RoIiwic2VsZWN0ZWRJbmRleCIsIm1vdmVkRmVhdHVyZSIsImZlYXR1cmVzIiwicmVwbGFjZUdlb21ldHJ5IiwiZ2VvbWV0cnkiLCJnZXRPYmplY3QiLCJmZWF0dXJlSW5kZXhlcyIsImVkaXRDb250ZXh0IiwiTW9kZUhhbmRsZXIiLCJzdGFydERpc3RhbmNlIiwiZW5kRGlzdGFuY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFFQTs7QUFDQTs7QUFDQTs7QUFJQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBRWFBLFk7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztzQ0FJT0MsSyxFQUE2RTtBQUM3RixVQUFJQyxVQUF1QixHQUFHLElBQTlCO0FBRUEsV0FBS0MsV0FBTCxHQUFtQkMsT0FBTyxDQUFDLEtBQUtDLG9CQUFOLENBQVAsSUFBc0Ms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QUFDNUYsTUFBTXVCLGFBQWEsR0FBRyx1QkFBYXBCLFFBQWIsRUFBdUJKLGNBQXZCLENBQXRCO0FBQ0EsTUFBTXlCLFdBQVcsR0FBRyx1QkFBYXJCLFFBQWIsRUFBdUJILFlBQXZCLENBQXBCO0FBQ0EsU0FBT3dCLFdBQVcsR0FBR0QsYUFBckI7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbmltcG9ydCB0dXJmQ2VudHJvaWQgZnJvbSAnQHR1cmYvY2VudHJvaWQnO1xuaW1wb3J0IHR1cmZEaXN0YW5jZSBmcm9tICdAdHVyZi9kaXN0YW5jZSc7XG5pbXBvcnQgdHVyZlRyYW5zZm9ybVNjYWxlIGZyb20gJ0B0dXJmL3RyYW5zZm9ybS1zY2FsZSc7XG5pbXBvcnQgdHlwZSB7IEZlYXR1cmVDb2xsZWN0aW9uLCBQb3NpdGlvbiB9IGZyb20gJ0BuZWJ1bGEuZ2wvZWRpdC1tb2Rlcyc7XG5pbXBvcnQgdHlwZSB7IFBvaW50ZXJNb3ZlRXZlbnQsIFN0YXJ0RHJhZ2dpbmdFdmVudCwgU3RvcERyYWdnaW5nRXZlbnQgfSBmcm9tICcuLi9ldmVudC10eXBlcy5qcyc7XG5pbXBvcnQgdHlwZSB7IEVkaXRBY3Rpb24gfSBmcm9tICcuL21vZGUtaGFuZGxlci5qcyc7XG5pbXBvcnQgeyBNb2RlSGFuZGxlciB9IGZyb20gJy4vbW9kZS1oYW5kbGVyLmpzJztcblxuZXhwb3J0IGNsYXNzIFNjYWxlSGFuZGxlciBleHRlbmRzIE1vZGVIYW5kbGVyIHtcbiAgX2lzU2NhbGFibGU6IGJvb2xlYW47XG4gIF9nZW9tZXRyeUJlaW5nU2NhbGVkOiA/RmVhdHVyZUNvbGxlY3Rpb247XG5cbiAgaGFuZGxlUG9pbnRlck1vdmUoZXZlbnQ6IFBvaW50ZXJNb3ZlRXZlbnQpOiB7IGVkaXRBY3Rpb246ID9FZGl0QWN0aW9uLCBjYW5jZWxNYXBQYW46IGJvb2xlYW4gfSB7XG4gICAgbGV0IGVkaXRBY3Rpb246ID9FZGl0QWN0aW9uID0gbnVsbDtcblxuICAgIHRoaXMuX2lzU2NhbGFibGUgPSBCb29sZWFuKHRoaXMuX2dlb21ldHJ5QmVpbmdTY2FsZWQpIHx8IHRoaXMuaXNTZWxlY3Rpb25QaWNrZWQoZXZlbnQucGlja3MpO1xuXG4gICAgaWYgKCF0aGlzLl9pc1NjYWxhYmxlIHx8ICFldmVudC5wb2ludGVyRG93bkdyb3VuZENvb3Jkcykge1xuICAgICAgLy8gTm90aGluZyB0byBkb1xuICAgICAgcmV0dXJuIHsgZWRpdEFjdGlvbjogbnVsbCwgY2FuY2VsTWFwUGFuOiBmYWxzZSB9O1xuICAgIH1cblxuICAgIGlmIChldmVudC5pc0RyYWdnaW5nICYmIHRoaXMuX2dlb21ldHJ5QmVpbmdTY2FsZWQpIHtcbiAgICAgIC8vIFNjYWxlIHRoZSBnZW9tZXRyeVxuICAgICAgZWRpdEFjdGlvbiA9IHRoaXMuZ2V0U2NhbGVBY3Rpb24oXG4gICAgICAgIGV2ZW50LnBvaW50ZXJEb3duR3JvdW5kQ29vcmRzLFxuICAgICAgICBldmVudC5ncm91bmRDb29yZHMsXG4gICAgICAgICdzY2FsaW5nJ1xuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4geyBlZGl0QWN0aW9uLCBjYW5jZWxNYXBQYW46IHRydWUgfTtcbiAgfVxuXG4gIGhhbmRsZVN0YXJ0RHJhZ2dpbmcoZXZlbnQ6IFN0YXJ0RHJhZ2dpbmdFdmVudCk6ID9FZGl0QWN0aW9uIHtcbiAgICBpZiAoIXRoaXMuX2lzU2NhbGFibGUpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHRoaXMuX2dlb21ldHJ5QmVpbmdTY2FsZWQgPSB0aGlzLmdldFNlbGVjdGVkRmVhdHVyZXNBc0ZlYXR1cmVDb2xsZWN0aW9uKCk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBoYW5kbGVTdG9wRHJhZ2dpbmcoZXZlbnQ6IFN0b3BEcmFnZ2luZ0V2ZW50KTogP0VkaXRBY3Rpb24ge1xuICAgIGxldCBlZGl0QWN0aW9uOiA/RWRpdEFjdGlvbiA9IG51bGw7XG5cbiAgICBpZiAodGhpcy5fZ2VvbWV0cnlCZWluZ1NjYWxlZCkge1xuICAgICAgLy8gU2NhbGUgdGhlIGdlb21ldHJ5XG4gICAgICBlZGl0QWN0aW9uID0gdGhpcy5nZXRTY2FsZUFjdGlvbihldmVudC5wb2ludGVyRG93bkdyb3VuZENvb3JkcywgZXZlbnQuZ3JvdW5kQ29vcmRzLCAnc2NhbGVkJyk7XG4gICAgICB0aGlzLl9nZW9tZXRyeUJlaW5nU2NhbGVkID0gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gZWRpdEFjdGlvbjtcbiAgfVxuXG4gIGdldEN1cnNvcih7IGlzRHJhZ2dpbmcgfTogeyBpc0RyYWdnaW5nOiBib29sZWFuIH0pOiBzdHJpbmcge1xuICAgIGlmICh0aGlzLl9pc1NjYWxhYmxlKSB7XG4gICAgICAvLyBUT0RPOiBsb29rIGF0IGRvaW5nIFNWRyBjdXJzb3JzIHRvIGdldCBhIGJldHRlciBcInNjYWxlXCIgY3Vyc29yXG4gICAgICByZXR1cm4gJ21vdmUnO1xuICAgIH1cbiAgICByZXR1cm4gaXNEcmFnZ2luZyA/ICdncmFiYmluZycgOiAnZ3JhYic7XG4gIH1cblxuICBnZXRTY2FsZUFjdGlvbihzdGFydERyYWdQb2ludDogUG9zaXRpb24sIGN1cnJlbnRQb2ludDogUG9zaXRpb24sIGVkaXRUeXBlOiBzdHJpbmcpOiBFZGl0QWN0aW9uIHtcbiAgICBjb25zdCBzdGFydFBvc2l0aW9uID0gc3RhcnREcmFnUG9pbnQ7XG4gICAgY29uc3QgY2VudHJvaWQgPSB0dXJmQ2VudHJvaWQodGhpcy5fZ2VvbWV0cnlCZWluZ1NjYWxlZCk7XG4gICAgY29uc3QgZmFjdG9yID0gZ2V0U2NhbGVGYWN0b3IoY2VudHJvaWQsIHN0YXJ0UG9zaXRpb24sIGN1cnJlbnRQb2ludCk7XG4gICAgY29uc3Qgc2NhbGVkRmVhdHVyZXMgPSB0dXJmVHJhbnNmb3JtU2NhbGUodGhpcy5fZ2VvbWV0cnlCZWluZ1NjYWxlZCwgZmFjdG9yLCB7XG4gICAgICBvcmlnaW46IGNlbnRyb2lkXG4gICAgfSk7XG5cbiAgICBsZXQgdXBkYXRlZERhdGEgPSB0aGlzLmdldEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uKCk7XG5cbiAgICBjb25zdCBzZWxlY3RlZEluZGV4ZXMgPSB0aGlzLmdldFNlbGVjdGVkRmVhdHVyZUluZGV4ZXMoKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNlbGVjdGVkSW5kZXhlcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3Qgc2VsZWN0ZWRJbmRleCA9IHNlbGVjdGVkSW5kZXhlc1tpXTtcbiAgICAgIGNvbnN0IG1vdmVkRmVhdHVyZSA9IHNjYWxlZEZlYXR1cmVzLmZlYXR1cmVzW2ldO1xuICAgICAgdXBkYXRlZERhdGEgPSB1cGRhdGVkRGF0YS5yZXBsYWNlR2VvbWV0cnkoc2VsZWN0ZWRJbmRleCwgbW92ZWRGZWF0dXJlLmdlb21ldHJ5KTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgdXBkYXRlZERhdGE6IHVwZGF0ZWREYXRhLmdldE9iamVjdCgpLFxuICAgICAgZWRpdFR5cGUsXG4gICAgICBmZWF0dXJlSW5kZXhlczogc2VsZWN0ZWRJbmRleGVzLFxuICAgICAgZWRpdENvbnRleHQ6IG51bGxcbiAgICB9O1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldFNjYWxlRmFjdG9yKGNlbnRyb2lkOiBQb3NpdGlvbiwgc3RhcnREcmFnUG9pbnQ6IFBvc2l0aW9uLCBjdXJyZW50UG9pbnQ6IFBvc2l0aW9uKSB7XG4gIGNvbnN0IHN0YXJ0RGlzdGFuY2UgPSB0dXJmRGlzdGFuY2UoY2VudHJvaWQsIHN0YXJ0RHJhZ1BvaW50KTtcbiAgY29uc3QgZW5kRGlzdGFuY2UgPSB0dXJmRGlzdGFuY2UoY2VudHJvaWQsIGN1cnJlbnRQb2ludCk7XG4gIHJldHVybiBlbmREaXN0YW5jZSAvIHN0YXJ0RGlzdGFuY2U7XG59XG4iXX0=