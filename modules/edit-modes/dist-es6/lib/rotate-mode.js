"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RotateMode = void 0;

var _centroid = _interopRequireDefault(require("@turf/centroid"));

var _bearing = _interopRequireDefault(require("@turf/bearing"));

var _transformRotate = _interopRequireDefault(require("@turf/transform-rotate"));

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

var RotateMode =
/*#__PURE__*/
function (_BaseGeoJsonEditMode) {
  _inherits(RotateMode, _BaseGeoJsonEditMode);

  function RotateMode() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, RotateMode);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(RotateMode)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_isRotatable", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_geometryBeingRotated", void 0);

    return _this;
  }

  _createClass(RotateMode, [{
    key: "handlePointerMoveAdapter",
    value: function handlePointerMoveAdapter(event, props) {
      var editAction = null;
      this._isRotatable = Boolean(this._geometryBeingRotated) || this.isSelectionPicked(event.picks, props);

      if (!this._isRotatable || !event.pointerDownMapCoords) {
        // Nothing to do
        return {
          editAction: null,
          cancelMapPan: false
        };
      }

      if (event.isDragging && this._geometryBeingRotated) {
        // Rotate the geometry
        editAction = this.getRotateAction(event.pointerDownMapCoords, event.mapCoords, 'rotating', props);
      }

      return {
        editAction: editAction,
        cancelMapPan: true
      };
    }
  }, {
    key: "handleStartDraggingAdapter",
    value: function handleStartDraggingAdapter(event, props) {
      if (!this._isRotatable) {
        return null;
      }

      this._geometryBeingRotated = this.getSelectedFeaturesAsFeatureCollection(props);
      return null;
    }
  }, {
    key: "handleStopDraggingAdapter",
    value: function handleStopDraggingAdapter(event, props) {
      var editAction = null;

      if (this._geometryBeingRotated) {
        // Rotate the geometry
        editAction = this.getRotateAction(event.pointerDownMapCoords, event.mapCoords, 'rotated', props);
        this._geometryBeingRotated = null;
      }

      return editAction;
    }
  }, {
    key: "getCursorAdapter",
    value: function getCursorAdapter() {
      if (this._isRotatable) {
        // TODO: look at doing SVG cursors to get a better "rotate" cursor
        return 'move';
      }

      return null;
    }
  }, {
    key: "getRotateAction",
    value: function getRotateAction(startDragPoint, currentPoint, editType, props) {
      var startPosition = startDragPoint;
      var centroid = (0, _centroid.default)(this._geometryBeingRotated);
      var angle = getRotationAngle(centroid, startPosition, currentPoint);
      var rotatedFeatures = (0, _transformRotate.default)(this._geometryBeingRotated, angle);
      var updatedData = new _immutableFeatureCollection.ImmutableFeatureCollection(props.data);
      var selectedIndexes = props.selectedIndexes;

      for (var i = 0; i < selectedIndexes.length; i++) {
        var selectedIndex = selectedIndexes[i];
        var movedFeature = rotatedFeatures.features[i];
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

  return RotateMode;
}(_geojsonEditMode.BaseGeoJsonEditMode);

exports.RotateMode = RotateMode;

function getRotationAngle(centroid, startDragPoint, currentPoint) {
  var bearing1 = (0, _bearing.default)(centroid, startDragPoint);
  var bearing2 = (0, _bearing.default)(centroid, currentPoint);
  return bearing2 - bearing1;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvcm90YXRlLW1vZGUuanMiXSwibmFtZXMiOlsiUm90YXRlTW9kZSIsImV2ZW50IiwicHJvcHMiLCJlZGl0QWN0aW9uIiwiX2lzUm90YXRhYmxlIiwiQm9vbGVhbiIsIl9nZW9tZXRyeUJlaW5nUm90YXRlZCIsImlzU2VsZWN0aW9uUGlja2VkIiwicGlja3MiLCJwb2ludGVyRG93bk1hcENvb3JkcyIsImNhbmNlbE1hcFBhbiIsImlzRHJhZ2dpbmciLCJnZXRSb3RhdGVBY3Rpb24iLCJtYXBDb29yZHMiLCJnZXRTZWxlY3RlZEZlYXR1cmVzQXNGZWF0dXJlQ29sbGVjdGlvbiIsInN0YXJ0RHJhZ1BvaW50IiwiY3VycmVudFBvaW50IiwiZWRpdFR5cGUiLCJzdGFydFBvc2l0aW9uIiwiY2VudHJvaWQiLCJhbmdsZSIsImdldFJvdGF0aW9uQW5nbGUiLCJyb3RhdGVkRmVhdHVyZXMiLCJ1cGRhdGVkRGF0YSIsIkltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uIiwiZGF0YSIsInNlbGVjdGVkSW5kZXhlcyIsImkiLCJsZW5ndGgiLCJzZWxlY3RlZEluZGV4IiwibW92ZWRGZWF0dXJlIiwiZmVhdHVyZXMiLCJyZXBsYWNlR2VvbWV0cnkiLCJnZW9tZXRyeSIsImdldE9iamVjdCIsImVkaXRDb250ZXh0IiwiZmVhdHVyZUluZGV4ZXMiLCJCYXNlR2VvSnNvbkVkaXRNb2RlIiwiYmVhcmluZzEiLCJiZWFyaW5nMiJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVBOztBQUNBOztBQUNBOztBQVFBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFFYUEsVTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzZDQUtUQyxLLEVBQ0FDLEssRUFDMkQ7QUFDM0QsVUFBSUMsVUFBOEIsR0FBRyxJQUFyQztBQUVBLFdBQUtDLFlBQUwsR0FDRUMsT0FBTyxDQUFDLEtBQUtDLHFCQUFOLENBQVAsSUFBdUMsS0FBS0MsaUJBQUwsQ0FBdUJOLEtBQUssQ0FBQ08sS0FBN0IsRUFBb0NOLEtBQXBDLENBRHpDOztBQUdBLFVBQUksQ0FBQyxLQUFLRSxZQUFOLElBQXNCLENBQUNILEtBQUssQ0FBQ1Esb0JBQWpDLEVBQXVEO0FBQ3JEO0FBQ0EsZUFBTztBQUFFTixVQUFBQSxVQUFVLEVBQUUsSUFBZDtBQUFvQk8sVUFBQUEsWUFBWSxFQUFFO0FBQWxDLFNBQVA7QUFDRDs7QUFFRCxVQUFJVCxLQUFLLENBQUNVLFVBQU4sSUFBb0IsS0FBS0wscUJBQTdCLEVBQW9EO0FBQ2xEO0FBQ0FILFFBQUFBLFVBQVUsR0FBRyxLQUFLUyxlQUFMLENBQ1hYLEtBQUssQ0FBQ1Esb0JBREssRUFFWFIsS0FBSyxDQUFDWSxTQUZLLEVBR1gsVUFIVyxFQUlYWCxLQUpXLENBQWI7QUFNRDs7QUFFRCxhQUFPO0FBQUVDLFFBQUFBLFVBQVUsRUFBVkEsVUFBRjtBQUFjTyxRQUFBQSxZQUFZLEVBQUU7QUFBNUIsT0FBUDtBQUNEOzs7K0NBR0NULEssRUFDQUMsSyxFQUNvQjtBQUNwQixVQUFJLENBQUMsS0FBS0UsWUFBVixFQUF3QjtBQUN0QixlQUFPLElBQVA7QUFDRDs7QUFFRCxXQUFLRSxxQkFBTCxHQUE2QixLQUFLUSxzQ0FBTCxDQUE0Q1osS0FBNUMsQ0FBN0I7QUFDQSxhQUFPLElBQVA7QUFDRDs7OzhDQUdDRCxLLEVBQ0FDLEssRUFDb0I7QUFDcEIsVUFBSUMsVUFBOEIsR0FBRyxJQUFyQzs7QUFFQSxVQUFJLEtBQUtHLHFCQUFULEVBQWdDO0FBQzlCO0FBQ0FILFFBQUFBLFVBQVUsR0FBRyxLQUFLUyxlQUFMLENBQ1hYLEtBQUssQ0FBQ1Esb0JBREssRUFFWFIsS0FBSyxDQUFDWSxTQUZLLEVBR1gsU0FIVyxFQUlYWCxLQUpXLENBQWI7QUFNQSxhQUFLSSxxQkFBTCxHQUE2QixJQUE3QjtBQUNEOztBQUVELGFBQU9ILFVBQVA7QUFDRDs7O3VDQUUyQjtBQUMxQixVQUFJLEtBQUtDLFlBQVQsRUFBdUI7QUFDckI7QUFDQSxlQUFPLE1BQVA7QUFDRDs7QUFDRCxhQUFPLElBQVA7QUFDRDs7O29DQUdDVyxjLEVBQ0FDLFksRUFDQUMsUSxFQUNBZixLLEVBQ21CO0FBQ25CLFVBQU1nQixhQUFhLEdBQUdILGNBQXRCO0FBQ0EsVUFBTUksUUFBUSxHQUFHLHVCQUFhLEtBQUtiLHFCQUFsQixDQUFqQjtBQUNBLFVBQU1jLEtBQUssR0FBR0MsZ0JBQWdCLENBQUNGLFFBQUQsRUFBV0QsYUFBWCxFQUEwQkYsWUFBMUIsQ0FBOUI7QUFFQSxVQUFNTSxlQUFlLEdBQUcsOEJBQW9CLEtBQUtoQixxQkFBekIsRUFBZ0RjLEtBQWhELENBQXhCO0FBRUEsVUFBSUcsV0FBVyxHQUFHLElBQUlDLHNEQUFKLENBQStCdEIsS0FBSyxDQUFDdUIsSUFBckMsQ0FBbEI7QUFFQSxVQUFNQyxlQUFlLEdBQUd4QixLQUFLLENBQUN3QixlQUE5Qjs7QUFDQSxXQUFLLElBQUlDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdELGVBQWUsQ0FBQ0UsTUFBcEMsRUFBNENELENBQUMsRUFBN0MsRUFBaUQ7QUFDL0MsWUFBTUUsYUFBYSxHQUFHSCxlQUFlLENBQUNDLENBQUQsQ0FBckM7QUFDQSxZQUFNRyxZQUFZLEdBQUdSLGVBQWUsQ0FBQ1MsUUFBaEIsQ0FBeUJKLENBQXpCLENBQXJCO0FBQ0FKLFFBQUFBLFdBQVcsR0FBR0EsV0FBVyxDQUFDUyxlQUFaLENBQTRCSCxhQUE1QixFQUEyQ0MsWUFBWSxDQUFDRyxRQUF4RCxDQUFkO0FBQ0Q7O0FBRUQsYUFBTztBQUNMVixRQUFBQSxXQUFXLEVBQUVBLFdBQVcsQ0FBQ1csU0FBWixFQURSO0FBRUxqQixRQUFBQSxRQUFRLEVBQVJBLFFBRks7QUFHTGtCLFFBQUFBLFdBQVcsRUFBRTtBQUNYQyxVQUFBQSxjQUFjLEVBQUVWO0FBREw7QUFIUixPQUFQO0FBT0Q7Ozs7RUFuRzZCVyxvQzs7OztBQXNHaEMsU0FBU2hCLGdCQUFULENBQTBCRixRQUExQixFQUE4Q0osY0FBOUMsRUFBd0VDLFlBQXhFLEVBQWdHO0FBQzlGLE1BQU1zQixRQUFRLEdBQUcsc0JBQVluQixRQUFaLEVBQXNCSixjQUF0QixDQUFqQjtBQUNBLE1BQU13QixRQUFRLEdBQUcsc0JBQVlwQixRQUFaLEVBQXNCSCxZQUF0QixDQUFqQjtBQUNBLFNBQU91QixRQUFRLEdBQUdELFFBQWxCO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuXG5pbXBvcnQgdHVyZkNlbnRyb2lkIGZyb20gJ0B0dXJmL2NlbnRyb2lkJztcbmltcG9ydCB0dXJmQmVhcmluZyBmcm9tICdAdHVyZi9iZWFyaW5nJztcbmltcG9ydCB0dXJmVHJhbnNmb3JtUm90YXRlIGZyb20gJ0B0dXJmL3RyYW5zZm9ybS1yb3RhdGUnO1xuaW1wb3J0IHR5cGUge1xuICBQb2ludGVyTW92ZUV2ZW50LFxuICBTdGFydERyYWdnaW5nRXZlbnQsXG4gIFN0b3BEcmFnZ2luZ0V2ZW50LFxuICBNb2RlUHJvcHNcbn0gZnJvbSAnLi4vdHlwZXMuanMnO1xuaW1wb3J0IHR5cGUgeyBGZWF0dXJlQ29sbGVjdGlvbiwgUG9zaXRpb24gfSBmcm9tICcuLi9nZW9qc29uLXR5cGVzLmpzJztcbmltcG9ydCB7IEJhc2VHZW9Kc29uRWRpdE1vZGUsIHR5cGUgR2VvSnNvbkVkaXRBY3Rpb24gfSBmcm9tICcuL2dlb2pzb24tZWRpdC1tb2RlLmpzJztcbmltcG9ydCB7IEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uIH0gZnJvbSAnLi9pbW11dGFibGUtZmVhdHVyZS1jb2xsZWN0aW9uLmpzJztcblxuZXhwb3J0IGNsYXNzIFJvdGF0ZU1vZGUgZXh0ZW5kcyBCYXNlR2VvSnNvbkVkaXRNb2RlIHtcbiAgX2lzUm90YXRhYmxlOiBib29sZWFuO1xuICBfZ2VvbWV0cnlCZWluZ1JvdGF0ZWQ6ID9GZWF0dXJlQ29sbGVjdGlvbjtcblxuICBoYW5kbGVQb2ludGVyTW92ZUFkYXB0ZXIoXG4gICAgZXZlbnQ6IFBvaW50ZXJNb3ZlRXZlbnQsXG4gICAgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj5cbiAgKTogeyBlZGl0QWN0aW9uOiA/R2VvSnNvbkVkaXRBY3Rpb24sIGNhbmNlbE1hcFBhbjogYm9vbGVhbiB9IHtcbiAgICBsZXQgZWRpdEFjdGlvbjogP0dlb0pzb25FZGl0QWN0aW9uID0gbnVsbDtcblxuICAgIHRoaXMuX2lzUm90YXRhYmxlID1cbiAgICAgIEJvb2xlYW4odGhpcy5fZ2VvbWV0cnlCZWluZ1JvdGF0ZWQpIHx8IHRoaXMuaXNTZWxlY3Rpb25QaWNrZWQoZXZlbnQucGlja3MsIHByb3BzKTtcblxuICAgIGlmICghdGhpcy5faXNSb3RhdGFibGUgfHwgIWV2ZW50LnBvaW50ZXJEb3duTWFwQ29vcmRzKSB7XG4gICAgICAvLyBOb3RoaW5nIHRvIGRvXG4gICAgICByZXR1cm4geyBlZGl0QWN0aW9uOiBudWxsLCBjYW5jZWxNYXBQYW46IGZhbHNlIH07XG4gICAgfVxuXG4gICAgaWYgKGV2ZW50LmlzRHJhZ2dpbmcgJiYgdGhpcy5fZ2VvbWV0cnlCZWluZ1JvdGF0ZWQpIHtcbiAgICAgIC8vIFJvdGF0ZSB0aGUgZ2VvbWV0cnlcbiAgICAgIGVkaXRBY3Rpb24gPSB0aGlzLmdldFJvdGF0ZUFjdGlvbihcbiAgICAgICAgZXZlbnQucG9pbnRlckRvd25NYXBDb29yZHMsXG4gICAgICAgIGV2ZW50Lm1hcENvb3JkcyxcbiAgICAgICAgJ3JvdGF0aW5nJyxcbiAgICAgICAgcHJvcHNcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgZWRpdEFjdGlvbiwgY2FuY2VsTWFwUGFuOiB0cnVlIH07XG4gIH1cblxuICBoYW5kbGVTdGFydERyYWdnaW5nQWRhcHRlcihcbiAgICBldmVudDogU3RhcnREcmFnZ2luZ0V2ZW50LFxuICAgIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+XG4gICk6ID9HZW9Kc29uRWRpdEFjdGlvbiB7XG4gICAgaWYgKCF0aGlzLl9pc1JvdGF0YWJsZSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgdGhpcy5fZ2VvbWV0cnlCZWluZ1JvdGF0ZWQgPSB0aGlzLmdldFNlbGVjdGVkRmVhdHVyZXNBc0ZlYXR1cmVDb2xsZWN0aW9uKHByb3BzKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGhhbmRsZVN0b3BEcmFnZ2luZ0FkYXB0ZXIoXG4gICAgZXZlbnQ6IFN0b3BEcmFnZ2luZ0V2ZW50LFxuICAgIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+XG4gICk6ID9HZW9Kc29uRWRpdEFjdGlvbiB7XG4gICAgbGV0IGVkaXRBY3Rpb246ID9HZW9Kc29uRWRpdEFjdGlvbiA9IG51bGw7XG5cbiAgICBpZiAodGhpcy5fZ2VvbWV0cnlCZWluZ1JvdGF0ZWQpIHtcbiAgICAgIC8vIFJvdGF0ZSB0aGUgZ2VvbWV0cnlcbiAgICAgIGVkaXRBY3Rpb24gPSB0aGlzLmdldFJvdGF0ZUFjdGlvbihcbiAgICAgICAgZXZlbnQucG9pbnRlckRvd25NYXBDb29yZHMsXG4gICAgICAgIGV2ZW50Lm1hcENvb3JkcyxcbiAgICAgICAgJ3JvdGF0ZWQnLFxuICAgICAgICBwcm9wc1xuICAgICAgKTtcbiAgICAgIHRoaXMuX2dlb21ldHJ5QmVpbmdSb3RhdGVkID0gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gZWRpdEFjdGlvbjtcbiAgfVxuXG4gIGdldEN1cnNvckFkYXB0ZXIoKTogP3N0cmluZyB7XG4gICAgaWYgKHRoaXMuX2lzUm90YXRhYmxlKSB7XG4gICAgICAvLyBUT0RPOiBsb29rIGF0IGRvaW5nIFNWRyBjdXJzb3JzIHRvIGdldCBhIGJldHRlciBcInJvdGF0ZVwiIGN1cnNvclxuICAgICAgcmV0dXJuICdtb3ZlJztcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBnZXRSb3RhdGVBY3Rpb24oXG4gICAgc3RhcnREcmFnUG9pbnQ6IFBvc2l0aW9uLFxuICAgIGN1cnJlbnRQb2ludDogUG9zaXRpb24sXG4gICAgZWRpdFR5cGU6IHN0cmluZyxcbiAgICBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPlxuICApOiBHZW9Kc29uRWRpdEFjdGlvbiB7XG4gICAgY29uc3Qgc3RhcnRQb3NpdGlvbiA9IHN0YXJ0RHJhZ1BvaW50O1xuICAgIGNvbnN0IGNlbnRyb2lkID0gdHVyZkNlbnRyb2lkKHRoaXMuX2dlb21ldHJ5QmVpbmdSb3RhdGVkKTtcbiAgICBjb25zdCBhbmdsZSA9IGdldFJvdGF0aW9uQW5nbGUoY2VudHJvaWQsIHN0YXJ0UG9zaXRpb24sIGN1cnJlbnRQb2ludCk7XG5cbiAgICBjb25zdCByb3RhdGVkRmVhdHVyZXMgPSB0dXJmVHJhbnNmb3JtUm90YXRlKHRoaXMuX2dlb21ldHJ5QmVpbmdSb3RhdGVkLCBhbmdsZSk7XG5cbiAgICBsZXQgdXBkYXRlZERhdGEgPSBuZXcgSW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24ocHJvcHMuZGF0YSk7XG5cbiAgICBjb25zdCBzZWxlY3RlZEluZGV4ZXMgPSBwcm9wcy5zZWxlY3RlZEluZGV4ZXM7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWxlY3RlZEluZGV4ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHNlbGVjdGVkSW5kZXggPSBzZWxlY3RlZEluZGV4ZXNbaV07XG4gICAgICBjb25zdCBtb3ZlZEZlYXR1cmUgPSByb3RhdGVkRmVhdHVyZXMuZmVhdHVyZXNbaV07XG4gICAgICB1cGRhdGVkRGF0YSA9IHVwZGF0ZWREYXRhLnJlcGxhY2VHZW9tZXRyeShzZWxlY3RlZEluZGV4LCBtb3ZlZEZlYXR1cmUuZ2VvbWV0cnkpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICB1cGRhdGVkRGF0YTogdXBkYXRlZERhdGEuZ2V0T2JqZWN0KCksXG4gICAgICBlZGl0VHlwZSxcbiAgICAgIGVkaXRDb250ZXh0OiB7XG4gICAgICAgIGZlYXR1cmVJbmRleGVzOiBzZWxlY3RlZEluZGV4ZXNcbiAgICAgIH1cbiAgICB9O1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldFJvdGF0aW9uQW5nbGUoY2VudHJvaWQ6IFBvc2l0aW9uLCBzdGFydERyYWdQb2ludDogUG9zaXRpb24sIGN1cnJlbnRQb2ludDogUG9zaXRpb24pIHtcbiAgY29uc3QgYmVhcmluZzEgPSB0dXJmQmVhcmluZyhjZW50cm9pZCwgc3RhcnREcmFnUG9pbnQpO1xuICBjb25zdCBiZWFyaW5nMiA9IHR1cmZCZWFyaW5nKGNlbnRyb2lkLCBjdXJyZW50UG9pbnQpO1xuICByZXR1cm4gYmVhcmluZzIgLSBiZWFyaW5nMTtcbn1cbiJdfQ==