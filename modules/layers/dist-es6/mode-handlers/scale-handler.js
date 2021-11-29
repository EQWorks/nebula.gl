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

// TODO edit-modes: delete handlers once EditMode fully implemented
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL3NjYWxlLWhhbmRsZXIuanMiXSwibmFtZXMiOlsiU2NhbGVIYW5kbGVyIiwiZXZlbnQiLCJlZGl0QWN0aW9uIiwiX2lzU2NhbGFibGUiLCJCb29sZWFuIiwiX2dlb21ldHJ5QmVpbmdTY2FsZWQiLCJpc1NlbGVjdGlvblBpY2tlZCIsInBpY2tzIiwicG9pbnRlckRvd25Hcm91bmRDb29yZHMiLCJjYW5jZWxNYXBQYW4iLCJpc0RyYWdnaW5nIiwiZ2V0U2NhbGVBY3Rpb24iLCJncm91bmRDb29yZHMiLCJnZXRTZWxlY3RlZEZlYXR1cmVzQXNGZWF0dXJlQ29sbGVjdGlvbiIsInN0YXJ0RHJhZ1BvaW50IiwiY3VycmVudFBvaW50IiwiZWRpdFR5cGUiLCJzdGFydFBvc2l0aW9uIiwiY2VudHJvaWQiLCJmYWN0b3IiLCJnZXRTY2FsZUZhY3RvciIsInNjYWxlZEZlYXR1cmVzIiwib3JpZ2luIiwidXBkYXRlZERhdGEiLCJnZXRJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbiIsInNlbGVjdGVkSW5kZXhlcyIsImdldFNlbGVjdGVkRmVhdHVyZUluZGV4ZXMiLCJpIiwibGVuZ3RoIiwic2VsZWN0ZWRJbmRleCIsIm1vdmVkRmVhdHVyZSIsImZlYXR1cmVzIiwicmVwbGFjZUdlb21ldHJ5IiwiZ2VvbWV0cnkiLCJnZXRPYmplY3QiLCJmZWF0dXJlSW5kZXhlcyIsImVkaXRDb250ZXh0IiwiTW9kZUhhbmRsZXIiLCJzdGFydERpc3RhbmNlIiwiZW5kRGlzdGFuY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFFQTs7QUFDQTs7QUFDQTs7QUFJQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7SUFDYUEsWTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3NDQUlPQyxLLEVBQTZFO0FBQzdGLFVBQUlDLFVBQXVCLEdBQUcsSUFBOUI7QUFFQSxXQUFLQyxXQUFMLEdBQW1CQyxPQUFPLENBQUMsS0FBS0Msb0JBQU4sQ0FBUCxJ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QUE4RjtBQUM1RixNQUFNdUIsYUFBYSxHQUFHLHVCQUFhcEIsUUFBYixFQUF1QkosY0FBdkIsQ0FBdEI7QUFDQSxNQUFNeUIsV0FBVyxHQUFHLHVCQUFhckIsUUFBYixFQUF1QkgsWUFBdkIsQ0FBcEI7QUFDQSxTQUFPd0IsV0FBVyxHQUFHRCxhQUFyQjtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuaW1wb3J0IHR1cmZDZW50cm9pZCBmcm9tICdAdHVyZi9jZW50cm9pZCc7XG5pbXBvcnQgdHVyZkRpc3RhbmNlIGZyb20gJ0B0dXJmL2Rpc3RhbmNlJztcbmltcG9ydCB0dXJmVHJhbnNmb3JtU2NhbGUgZnJvbSAnQHR1cmYvdHJhbnNmb3JtLXNjYWxlJztcbmltcG9ydCB0eXBlIHsgRmVhdHVyZUNvbGxlY3Rpb24sIFBvc2l0aW9uIH0gZnJvbSAnQG5lYnVsYS5nbC9lZGl0LW1vZGVzJztcbmltcG9ydCB0eXBlIHsgUG9pbnRlck1vdmVFdmVudCwgU3RhcnREcmFnZ2luZ0V2ZW50LCBTdG9wRHJhZ2dpbmdFdmVudCB9IGZyb20gJy4uL2V2ZW50LXR5cGVzLmpzJztcbmltcG9ydCB0eXBlIHsgRWRpdEFjdGlvbiB9IGZyb20gJy4vbW9kZS1oYW5kbGVyLmpzJztcbmltcG9ydCB7IE1vZGVIYW5kbGVyIH0gZnJvbSAnLi9tb2RlLWhhbmRsZXIuanMnO1xuXG4vLyBUT0RPIGVkaXQtbW9kZXM6IGRlbGV0ZSBoYW5kbGVycyBvbmNlIEVkaXRNb2RlIGZ1bGx5IGltcGxlbWVudGVkXG5leHBvcnQgY2xhc3MgU2NhbGVIYW5kbGVyIGV4dGVuZHMgTW9kZUhhbmRsZXIge1xuICBfaXNTY2FsYWJsZTogYm9vbGVhbjtcbiAgX2dlb21ldHJ5QmVpbmdTY2FsZWQ6ID9GZWF0dXJlQ29sbGVjdGlvbjtcblxuICBoYW5kbGVQb2ludGVyTW92ZShldmVudDogUG9pbnRlck1vdmVFdmVudCk6IHsgZWRpdEFjdGlvbjogP0VkaXRBY3Rpb24sIGNhbmNlbE1hcFBhbjogYm9vbGVhbiB9IHtcbiAgICBsZXQgZWRpdEFjdGlvbjogP0VkaXRBY3Rpb24gPSBudWxsO1xuXG4gICAgdGhpcy5faXNTY2FsYWJsZSA9IEJvb2xlYW4odGhpcy5fZ2VvbWV0cnlCZWluZ1NjYWxlZCkgfHwgdGhpcy5pc1NlbGVjdGlvblBpY2tlZChldmVudC5waWNrcyk7XG5cbiAgICBpZiAoIXRoaXMuX2lzU2NhbGFibGUgfHwgIWV2ZW50LnBvaW50ZXJEb3duR3JvdW5kQ29vcmRzKSB7XG4gICAgICAvLyBOb3RoaW5nIHRvIGRvXG4gICAgICByZXR1cm4geyBlZGl0QWN0aW9uOiBudWxsLCBjYW5jZWxNYXBQYW46IGZhbHNlIH07XG4gICAgfVxuXG4gICAgaWYgKGV2ZW50LmlzRHJhZ2dpbmcgJiYgdGhpcy5fZ2VvbWV0cnlCZWluZ1NjYWxlZCkge1xuICAgICAgLy8gU2NhbGUgdGhlIGdlb21ldHJ5XG4gICAgICBlZGl0QWN0aW9uID0gdGhpcy5nZXRTY2FsZUFjdGlvbihcbiAgICAgICAgZXZlbnQucG9pbnRlckRvd25Hcm91bmRDb29yZHMsXG4gICAgICAgIGV2ZW50Lmdyb3VuZENvb3JkcyxcbiAgICAgICAgJ3NjYWxpbmcnXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiB7IGVkaXRBY3Rpb24sIGNhbmNlbE1hcFBhbjogdHJ1ZSB9O1xuICB9XG5cbiAgaGFuZGxlU3RhcnREcmFnZ2luZyhldmVudDogU3RhcnREcmFnZ2luZ0V2ZW50KTogP0VkaXRBY3Rpb24ge1xuICAgIGlmICghdGhpcy5faXNTY2FsYWJsZSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgdGhpcy5fZ2VvbWV0cnlCZWluZ1NjYWxlZCA9IHRoaXMuZ2V0U2VsZWN0ZWRGZWF0dXJlc0FzRmVhdHVyZUNvbGxlY3Rpb24oKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGhhbmRsZVN0b3BEcmFnZ2luZyhldmVudDogU3RvcERyYWdnaW5nRXZlbnQpOiA/RWRpdEFjdGlvbiB7XG4gICAgbGV0IGVkaXRBY3Rpb246ID9FZGl0QWN0aW9uID0gbnVsbDtcblxuICAgIGlmICh0aGlzLl9nZW9tZXRyeUJlaW5nU2NhbGVkKSB7XG4gICAgICAvLyBTY2FsZSB0aGUgZ2VvbWV0cnlcbiAgICAgIGVkaXRBY3Rpb24gPSB0aGlzLmdldFNjYWxlQWN0aW9uKGV2ZW50LnBvaW50ZXJEb3duR3JvdW5kQ29vcmRzLCBldmVudC5ncm91bmRDb29yZHMsICdzY2FsZWQnKTtcbiAgICAgIHRoaXMuX2dlb21ldHJ5QmVpbmdTY2FsZWQgPSBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBlZGl0QWN0aW9uO1xuICB9XG5cbiAgZ2V0Q3Vyc29yKHsgaXNEcmFnZ2luZyB9OiB7IGlzRHJhZ2dpbmc6IGJvb2xlYW4gfSk6IHN0cmluZyB7XG4gICAgaWYgKHRoaXMuX2lzU2NhbGFibGUpIHtcbiAgICAgIC8vIFRPRE86IGxvb2sgYXQgZG9pbmcgU1ZHIGN1cnNvcnMgdG8gZ2V0IGEgYmV0dGVyIFwic2NhbGVcIiBjdXJzb3JcbiAgICAgIHJldHVybiAnbW92ZSc7XG4gICAgfVxuICAgIHJldHVybiBpc0RyYWdnaW5nID8gJ2dyYWJiaW5nJyA6ICdncmFiJztcbiAgfVxuXG4gIGdldFNjYWxlQWN0aW9uKHN0YXJ0RHJhZ1BvaW50OiBQb3NpdGlvbiwgY3VycmVudFBvaW50OiBQb3NpdGlvbiwgZWRpdFR5cGU6IHN0cmluZyk6IEVkaXRBY3Rpb24ge1xuICAgIGNvbnN0IHN0YXJ0UG9zaXRpb24gPSBzdGFydERyYWdQb2ludDtcbiAgICBjb25zdCBjZW50cm9pZCA9IHR1cmZDZW50cm9pZCh0aGlzLl9nZW9tZXRyeUJlaW5nU2NhbGVkKTtcbiAgICBjb25zdCBmYWN0b3IgPSBnZXRTY2FsZUZhY3RvcihjZW50cm9pZCwgc3RhcnRQb3NpdGlvbiwgY3VycmVudFBvaW50KTtcbiAgICBjb25zdCBzY2FsZWRGZWF0dXJlcyA9IHR1cmZUcmFuc2Zvcm1TY2FsZSh0aGlzLl9nZW9tZXRyeUJlaW5nU2NhbGVkLCBmYWN0b3IsIHtcbiAgICAgIG9yaWdpbjogY2VudHJvaWRcbiAgICB9KTtcblxuICAgIGxldCB1cGRhdGVkRGF0YSA9IHRoaXMuZ2V0SW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24oKTtcblxuICAgIGNvbnN0IHNlbGVjdGVkSW5kZXhlcyA9IHRoaXMuZ2V0U2VsZWN0ZWRGZWF0dXJlSW5kZXhlcygpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2VsZWN0ZWRJbmRleGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBzZWxlY3RlZEluZGV4ID0gc2VsZWN0ZWRJbmRleGVzW2ldO1xuICAgICAgY29uc3QgbW92ZWRGZWF0dXJlID0gc2NhbGVkRmVhdHVyZXMuZmVhdHVyZXNbaV07XG4gICAgICB1cGRhdGVkRGF0YSA9IHVwZGF0ZWREYXRhLnJlcGxhY2VHZW9tZXRyeShzZWxlY3RlZEluZGV4LCBtb3ZlZEZlYXR1cmUuZ2VvbWV0cnkpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICB1cGRhdGVkRGF0YTogdXBkYXRlZERhdGEuZ2V0T2JqZWN0KCksXG4gICAgICBlZGl0VHlwZSxcbiAgICAgIGZlYXR1cmVJbmRleGVzOiBzZWxlY3RlZEluZGV4ZXMsXG4gICAgICBlZGl0Q29udGV4dDogbnVsbFxuICAgIH07XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0U2NhbGVGYWN0b3IoY2VudHJvaWQ6IFBvc2l0aW9uLCBzdGFydERyYWdQb2ludDogUG9zaXRpb24sIGN1cnJlbnRQb2ludDogUG9zaXRpb24pIHtcbiAgY29uc3Qgc3RhcnREaXN0YW5jZSA9IHR1cmZEaXN0YW5jZShjZW50cm9pZCwgc3RhcnREcmFnUG9pbnQpO1xuICBjb25zdCBlbmREaXN0YW5jZSA9IHR1cmZEaXN0YW5jZShjZW50cm9pZCwgY3VycmVudFBvaW50KTtcbiAgcmV0dXJuIGVuZERpc3RhbmNlIC8gc3RhcnREaXN0YW5jZTtcbn1cbiJdfQ==