"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScaleMode = void 0;

var _centroid = _interopRequireDefault(require("@turf/centroid"));

var _distance = _interopRequireDefault(require("@turf/distance"));

var _transformScale = _interopRequireDefault(require("@turf/transform-scale"));

var _geojsonEditMode = require("./geojson-edit-mode.js");

var _immutableFeatureCollection = require("./immutable-feature-collection.js");

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

var ScaleMode =
/*#__PURE__*/
function (_BaseGeoJsonEditMode) {
  _inherits(ScaleMode, _BaseGeoJsonEditMode);

  function ScaleMode() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, ScaleMode);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ScaleMode)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_isScalable", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_geometryBeingScaled", void 0);

    return _this;
  }

  _createClass(ScaleMode, [{
    key: "handlePointerMoveAdapter",
    value: function handlePointerMoveAdapter(event, props) {
      var editAction = null;
      this._isScalable = Boolean(this._geometryBeingScaled) || this.isSelectionPicked(event.picks, props);

      if (!this._isScalable || !event.pointerDownMapCoords) {
        // Nothing to do
        return {
          editAction: null,
          cancelMapPan: false
        };
      }

      if (event.isDragging && this._geometryBeingScaled) {
        // Scale the geometry
        editAction = this.getScaleAction(event.pointerDownMapCoords, event.mapCoords, 'scaling', props);
      }

      return {
        editAction: editAction,
        cancelMapPan: true
      };
    }
  }, {
    key: "handleStartDraggingAdapter",
    value: function handleStartDraggingAdapter(event, props) {
      if (!this._isScalable) {
        return null;
      }

      this._geometryBeingScaled = this.getSelectedFeaturesAsFeatureCollection(props);
      return null;
    }
  }, {
    key: "handleStopDraggingAdapter",
    value: function handleStopDraggingAdapter(event, props) {
      var editAction = null;

      if (this._geometryBeingScaled) {
        // Scale the geometry
        editAction = this.getScaleAction(event.pointerDownMapCoords, event.mapCoords, 'scaled', props);
        this._geometryBeingScaled = null;
      }

      return editAction;
    }
  }, {
    key: "getCursorAdapter",
    value: function getCursorAdapter() {
      if (this._isScalable) {
        // TODO: look at doing SVG cursors to get a better "scale" cursor
        return 'move';
      }

      return null;
    }
  }, {
    key: "getScaleAction",
    value: function getScaleAction(startDragPoint, currentPoint, editType, props) {
      var startPosition = startDragPoint;
      var centroid = (0, _centroid.default)(this._geometryBeingScaled);
      var factor = getScaleFactor(centroid, startPosition, currentPoint);
      var scaledFeatures = (0, _transformScale.default)(this._geometryBeingScaled, factor, {
        origin: centroid
      });
      var updatedData = new _immutableFeatureCollection.ImmutableFeatureCollection(props.data);
      var selectedIndexes = props.selectedIndexes;

      for (var i = 0; i < selectedIndexes.length; i++) {
        var selectedIndex = selectedIndexes[i];
        var movedFeature = scaledFeatures.features[i];
        updatedData = updatedData.replaceGeometry(selectedIndex, movedFeature.geometry);
      }

      return {
        updatedData: updatedData.getObject(),
        editType: editType,
        editContext: {
          featureIndexes: selectedIndexes
        }
      };
    }
  }]);

  return ScaleMode;
}(_geojsonEditMode.BaseGeoJsonEditMode);

exports.ScaleMode = ScaleMode;

function getScaleFactor(centroid, startDragPoint, currentPoint) {
  var startDistance = (0, _distance.default)(centroid, startDragPoint);
  var endDistance = (0, _distance.default)(centroid, currentPoint);
  return endDistance / startDistance;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvc2NhbGUtbW9kZS5qcyJdLCJuYW1lcyI6WyJTY2FsZU1vZGUiLCJldmVudCIsInByb3BzIiwiZWRpdEFjdGlvbiIsIl9pc1NjYWxhYmxlIiwiQm9vbGVhbiIsIl9nZW9tZXRyeUJlaW5nU2NhbGVkIiwiaXNTZWxlY3Rpb25QaWNrZWQiLCJwaWNrcyIsInBvaW50ZXJEb3duTWFwQ29vcmRzIiwiY2FuY2VsTWFwUGFuIiwiaXNEcmFnZ2luZyIsImdldFNjYWxlQWN0aW9uIiwibWFwQ29vcmRzIiwiZ2V0U2VsZWN0ZWRGZWF0dXJlc0FzRmVhdHVyZUNvbGxlY3Rpb24iLCJzdGFydERyYWdQb2ludCIsImN1cnJlbnRQb2ludCIsImVkaXRUeXBlIiwic3RhcnRQb3NpdGlvbiIsImNlbnRyb2lkIiwiZmFjdG9yIiwiZ2V0U2NhbGVGYWN0b3IiLCJzY2FsZWRGZWF0dXJlcyIsIm9yaWdpbiIsInVwZGF0ZWREYXRhIiwiSW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24iLCJkYXRhIiwic2VsZWN0ZWRJbmRleGVzIiwiaSIsImxlbmd0aCIsInNlbGVjdGVkSW5kZXgiLCJtb3ZlZEZlYXR1cmUiLCJmZWF0dXJlcyIsInJlcGxhY2VHZW9tZXRyeSIsImdlb21ldHJ5IiwiZ2V0T2JqZWN0IiwiZWRpdENvbnRleHQiLCJmZWF0dXJlSW5kZXhlcyIsIkJhc2VHZW9Kc29uRWRpdE1vZGUiLCJzdGFydERpc3RhbmNlIiwiZW5kRGlzdGFuY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFFQTs7QUFDQTs7QUFDQTs7QUFRQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBRWFBLFM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs2Q0FLVEMsSyxFQUNBQyxLLEVBQzJEO0FBQzNELFVBQUlDLFVBQThCLEdBQUcsSUFBckM7QUFFQSxXQUFLQyxXQUFMLEdBQ0VDLE9BQU8sQ0FBQyxLQUFLQyxvQkFBTixDQUFQLElBQXNDLEtBQUtDLGlCQUFMLENBQXVC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RUFBc0VDLFlBQXRFLEVBQThGO0FBQzVGLE1BQU11QixhQUFhLEdBQUcsdUJBQWFwQixRQUFiLEVBQXVCSixjQUF2QixDQUF0QjtBQUNBLE1BQU15QixXQUFXLEdBQUcsdUJBQWFyQixRQUFiLEVBQXVCSCxZQUF2QixDQUFwQjtBQUNBLFNBQU93QixXQUFXLEdBQUdELGFBQXJCO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuXG5pbXBvcnQgdHVyZkNlbnRyb2lkIGZyb20gJ0B0dXJmL2NlbnRyb2lkJztcbmltcG9ydCB0dXJmRGlzdGFuY2UgZnJvbSAnQHR1cmYvZGlzdGFuY2UnO1xuaW1wb3J0IHR1cmZUcmFuc2Zvcm1TY2FsZSBmcm9tICdAdHVyZi90cmFuc2Zvcm0tc2NhbGUnO1xuaW1wb3J0IHR5cGUgeyBGZWF0dXJlQ29sbGVjdGlvbiwgUG9zaXRpb24gfSBmcm9tICcuLi9nZW9qc29uLXR5cGVzLmpzJztcbmltcG9ydCB0eXBlIHtcbiAgTW9kZVByb3BzLFxuICBQb2ludGVyTW92ZUV2ZW50LFxuICBTdGFydERyYWdnaW5nRXZlbnQsXG4gIFN0b3BEcmFnZ2luZ0V2ZW50XG59IGZyb20gJy4uL3R5cGVzLmpzJztcbmltcG9ydCB7IEJhc2VHZW9Kc29uRWRpdE1vZGUsIHR5cGUgR2VvSnNvbkVkaXRBY3Rpb24gfSBmcm9tICcuL2dlb2pzb24tZWRpdC1tb2RlLmpzJztcbmltcG9ydCB7IEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uIH0gZnJvbSAnLi9pbW11dGFibGUtZmVhdHVyZS1jb2xsZWN0aW9uLmpzJztcblxuZXhwb3J0IGNsYXNzIFNjYWxlTW9kZSBleHRlbmRzIEJhc2VHZW9Kc29uRWRpdE1vZGUge1xuICBfaXNTY2FsYWJsZTogYm9vbGVhbjtcbiAgX2dlb21ldHJ5QmVpbmdTY2FsZWQ6ID9GZWF0dXJlQ29sbGVjdGlvbjtcblxuICBoYW5kbGVQb2ludGVyTW92ZUFkYXB0ZXIoXG4gICAgZXZlbnQ6IFBvaW50ZXJNb3ZlRXZlbnQsXG4gICAgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj5cbiAgKTogeyBlZGl0QWN0aW9uOiA/R2VvSnNvbkVkaXRBY3Rpb24sIGNhbmNlbE1hcFBhbjogYm9vbGVhbiB9IHtcbiAgICBsZXQgZWRpdEFjdGlvbjogP0dlb0pzb25FZGl0QWN0aW9uID0gbnVsbDtcblxuICAgIHRoaXMuX2lzU2NhbGFibGUgPVxuICAgICAgQm9vbGVhbih0aGlzLl9nZW9tZXRyeUJlaW5nU2NhbGVkKSB8fCB0aGlzLmlzU2VsZWN0aW9uUGlja2VkKGV2ZW50LnBpY2tzLCBwcm9wcyk7XG5cbiAgICBpZiAoIXRoaXMuX2lzU2NhbGFibGUgfHwgIWV2ZW50LnBvaW50ZXJEb3duTWFwQ29vcmRzKSB7XG4gICAgICAvLyBOb3RoaW5nIHRvIGRvXG4gICAgICByZXR1cm4geyBlZGl0QWN0aW9uOiBudWxsLCBjYW5jZWxNYXBQYW46IGZhbHNlIH07XG4gICAgfVxuXG4gICAgaWYgKGV2ZW50LmlzRHJhZ2dpbmcgJiYgdGhpcy5fZ2VvbWV0cnlCZWluZ1NjYWxlZCkge1xuICAgICAgLy8gU2NhbGUgdGhlIGdlb21ldHJ5XG4gICAgICBlZGl0QWN0aW9uID0gdGhpcy5nZXRTY2FsZUFjdGlvbihcbiAgICAgICAgZXZlbnQucG9pbnRlckRvd25NYXBDb29yZHMsXG4gICAgICAgIGV2ZW50Lm1hcENvb3JkcyxcbiAgICAgICAgJ3NjYWxpbmcnLFxuICAgICAgICBwcm9wc1xuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4geyBlZGl0QWN0aW9uLCBjYW5jZWxNYXBQYW46IHRydWUgfTtcbiAgfVxuXG4gIGhhbmRsZVN0YXJ0RHJhZ2dpbmdBZGFwdGVyKFxuICAgIGV2ZW50OiBTdGFydERyYWdnaW5nRXZlbnQsXG4gICAgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj5cbiAgKTogP0dlb0pzb25FZGl0QWN0aW9uIHtcbiAgICBpZiAoIXRoaXMuX2lzU2NhbGFibGUpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHRoaXMuX2dlb21ldHJ5QmVpbmdTY2FsZWQgPSB0aGlzLmdldFNlbGVjdGVkRmVhdHVyZXNBc0ZlYXR1cmVDb2xsZWN0aW9uKHByb3BzKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGhhbmRsZVN0b3BEcmFnZ2luZ0FkYXB0ZXIoXG4gICAgZXZlbnQ6IFN0b3BEcmFnZ2luZ0V2ZW50LFxuICAgIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+XG4gICk6ID9HZW9Kc29uRWRpdEFjdGlvbiB7XG4gICAgbGV0IGVkaXRBY3Rpb246ID9HZW9Kc29uRWRpdEFjdGlvbiA9IG51bGw7XG5cbiAgICBpZiAodGhpcy5fZ2VvbWV0cnlCZWluZ1NjYWxlZCkge1xuICAgICAgLy8gU2NhbGUgdGhlIGdlb21ldHJ5XG4gICAgICBlZGl0QWN0aW9uID0gdGhpcy5nZXRTY2FsZUFjdGlvbihcbiAgICAgICAgZXZlbnQucG9pbnRlckRvd25NYXBDb29yZHMsXG4gICAgICAgIGV2ZW50Lm1hcENvb3JkcyxcbiAgICAgICAgJ3NjYWxlZCcsXG4gICAgICAgIHByb3BzXG4gICAgICApO1xuICAgICAgdGhpcy5fZ2VvbWV0cnlCZWluZ1NjYWxlZCA9IG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVkaXRBY3Rpb247XG4gIH1cblxuICBnZXRDdXJzb3JBZGFwdGVyKCk6ID9zdHJpbmcge1xuICAgIGlmICh0aGlzLl9pc1NjYWxhYmxlKSB7XG4gICAgICAvLyBUT0RPOiBsb29rIGF0IGRvaW5nIFNWRyBjdXJzb3JzIHRvIGdldCBhIGJldHRlciBcInNjYWxlXCIgY3Vyc29yXG4gICAgICByZXR1cm4gJ21vdmUnO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGdldFNjYWxlQWN0aW9uKFxuICAgIHN0YXJ0RHJhZ1BvaW50OiBQb3NpdGlvbixcbiAgICBjdXJyZW50UG9pbnQ6IFBvc2l0aW9uLFxuICAgIGVkaXRUeXBlOiBzdHJpbmcsXG4gICAgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj5cbiAgKTogR2VvSnNvbkVkaXRBY3Rpb24ge1xuICAgIGNvbnN0IHN0YXJ0UG9zaXRpb24gPSBzdGFydERyYWdQb2ludDtcbiAgICBjb25zdCBjZW50cm9pZCA9IHR1cmZDZW50cm9pZCh0aGlzLl9nZW9tZXRyeUJlaW5nU2NhbGVkKTtcbiAgICBjb25zdCBmYWN0b3IgPSBnZXRTY2FsZUZhY3RvcihjZW50cm9pZCwgc3RhcnRQb3NpdGlvbiwgY3VycmVudFBvaW50KTtcbiAgICBjb25zdCBzY2FsZWRGZWF0dXJlcyA9IHR1cmZUcmFuc2Zvcm1TY2FsZSh0aGlzLl9nZW9tZXRyeUJlaW5nU2NhbGVkLCBmYWN0b3IsIHtcbiAgICAgIG9yaWdpbjogY2VudHJvaWRcbiAgICB9KTtcblxuICAgIGxldCB1cGRhdGVkRGF0YSA9IG5ldyBJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbihwcm9wcy5kYXRhKTtcblxuICAgIGNvbnN0IHNlbGVjdGVkSW5kZXhlcyA9IHByb3BzLnNlbGVjdGVkSW5kZXhlcztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNlbGVjdGVkSW5kZXhlcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3Qgc2VsZWN0ZWRJbmRleCA9IHNlbGVjdGVkSW5kZXhlc1tpXTtcbiAgICAgIGNvbnN0IG1vdmVkRmVhdHVyZSA9IHNjYWxlZEZlYXR1cmVzLmZlYXR1cmVzW2ldO1xuICAgICAgdXBkYXRlZERhdGEgPSB1cGRhdGVkRGF0YS5yZXBsYWNlR2VvbWV0cnkoc2VsZWN0ZWRJbmRleCwgbW92ZWRGZWF0dXJlLmdlb21ldHJ5KTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgdXBkYXRlZERhdGE6IHVwZGF0ZWREYXRhLmdldE9iamVjdCgpLFxuICAgICAgZWRpdFR5cGUsXG4gICAgICBlZGl0Q29udGV4dDoge1xuICAgICAgICBmZWF0dXJlSW5kZXhlczogc2VsZWN0ZWRJbmRleGVzXG4gICAgICB9XG4gICAgfTtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRTY2FsZUZhY3RvcihjZW50cm9pZDogUG9zaXRpb24sIHN0YXJ0RHJhZ1BvaW50OiBQb3NpdGlvbiwgY3VycmVudFBvaW50OiBQb3NpdGlvbikge1xuICBjb25zdCBzdGFydERpc3RhbmNlID0gdHVyZkRpc3RhbmNlKGNlbnRyb2lkLCBzdGFydERyYWdQb2ludCk7XG4gIGNvbnN0IGVuZERpc3RhbmNlID0gdHVyZkRpc3RhbmNlKGNlbnRyb2lkLCBjdXJyZW50UG9pbnQpO1xuICByZXR1cm4gZW5kRGlzdGFuY2UgLyBzdGFydERpc3RhbmNlO1xufVxuIl19