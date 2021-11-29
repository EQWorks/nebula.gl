"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TranslateMode = void 0;

var _bearing = _interopRequireDefault(require("@turf/bearing"));

var _distance = _interopRequireDefault(require("@turf/distance"));

var _transformTranslate = _interopRequireDefault(require("@turf/transform-translate"));

var _helpers = require("@turf/helpers");

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

var TranslateMode =
/*#__PURE__*/
function (_BaseGeoJsonEditMode) {
  _inherits(TranslateMode, _BaseGeoJsonEditMode);

  function TranslateMode() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, TranslateMode);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(TranslateMode)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_geometryBeforeTranslate", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_isTranslatable", void 0);

    return _this;
  }

  _createClass(TranslateMode, [{
    key: "handlePointerMoveAdapter",
    value: function handlePointerMoveAdapter(event, props) {
      var editAction = null;
      this._isTranslatable = Boolean(this._geometryBeforeTranslate) || this.isSelectionPicked(event.picks, props);

      if (!this._isTranslatable || !event.pointerDownMapCoords) {
        // Nothing to do
        return {
          editAction: null,
          cancelMapPan: false
        };
      }

      if (event.isDragging && this._geometryBeforeTranslate) {
        // Translate the geometry
        editAction = this.getTranslateAction(event.pointerDownMapCoords, event.mapCoords, 'translating', props);
      }

      return {
        editAction: editAction,
        cancelMapPan: true
      };
    }
  }, {
    key: "handleStartDraggingAdapter",
    value: function handleStartDraggingAdapter(event, props) {
      if (!this._isTranslatable) {
        return null;
      }

      this._geometryBeforeTranslate = this.getSelectedFeaturesAsFeatureCollection(props);
      return null;
    }
  }, {
    key: "handleStopDraggingAdapter",
    value: function handleStopDraggingAdapter(event, props) {
      var editAction = null;

      if (this._geometryBeforeTranslate) {
        // Translate the geometry
        editAction = this.getTranslateAction(event.pointerDownMapCoords, event.mapCoords, 'translated', props);
        this._geometryBeforeTranslate = null;
      }

      return editAction;
    }
  }, {
    key: "getCursorAdapter",
    value: function getCursorAdapter() {
      if (this._isTranslatable) {
        return 'move';
      }

      return null;
    }
  }, {
    key: "getTranslateAction",
    value: function getTranslateAction(startDragPoint, currentPoint, editType, props) {
      if (!this._geometryBeforeTranslate) {
        return null;
      }

      var p1 = (0, _helpers.point)(startDragPoint);
      var p2 = (0, _helpers.point)(currentPoint);
      var distanceMoved = (0, _distance.default)(p1, p2);
      var direction = (0, _bearing.default)(p1, p2);
      var movedFeatures = (0, _transformTranslate.default)(this._geometryBeforeTranslate, distanceMoved, direction);
      var updatedData = new _immutableFeatureCollection.ImmutableFeatureCollection(props.data);
      var selectedIndexes = props.selectedIndexes;

      for (var i = 0; i < selectedIndexes.length; i++) {
        var selectedIndex = selectedIndexes[i];
        var movedFeature = movedFeatures.features[i];
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

  return TranslateMode;
}(_geojsonEditMode.BaseGeoJsonEditMode);

exports.TranslateMode = TranslateMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvdHJhbnNsYXRlLW1vZGUuanMiXSwibmFtZXMiOlsiVHJhbnNsYXRlTW9kZSIsImV2ZW50IiwicHJvcHMiLCJlZGl0QWN0aW9uIiwiX2lzVHJhbnNsYXRhYmxlIiwiQm9vbGVhbiIsIl9nZW9tZXRyeUJlZm9yZVRyYW5zbGF0ZSIsImlzU2VsZWN0aW9uUGlja2VkIiwicGlja3MiLCJwb2ludGVyRG93bk1hcENvb3JkcyIsImNhbmNlbE1hcFBhbiIsImlzRHJhZ2dpbmciLCJnZXRUcmFuc2xhdGVBY3Rpb24iLCJtYXBDb29yZHMiLCJnZXRTZWxlY3RlZEZlYXR1cmVzQXNGZWF0dXJlQ29sbGVjdGlvbiIsInN0YXJ0RHJhZ1BvaW50IiwiY3VycmVudFBvaW50IiwiZWRpdFR5cGUiLCJwMSIsInAyIiwiZGlzdGFuY2VNb3ZlZCIsImRpcmVjdGlvbiIsIm1vdmVkRmVhdHVyZXMiLCJ1cGRhdGVkRGF0YSIsIkltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uIiwiZGF0YSIsInNlbGVjdGVkSW5kZXhlcyIsImkiLCJsZW5ndGgiLCJzZWxlY3RlZEluZGV4IiwibW92ZWRGZWF0dXJlIiwiZmVhdHVyZXMiLCJyZXBsYWNlR2VvbWV0cnkiLCJnZW9tZXRyeSIsImdldE9iamVjdCIsImVkaXRDb250ZXh0IiwiZmVhdHVyZUluZGV4ZXMiLCJCYXNlR2VvSnNvbkVkaXRNb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBUUE7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUVhQSxhOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7NkNBS1RDLEssRUFDQUMsSyxFQUMyRDtBQUMzRCxVQUFJQyxVQUE4QixHQUFHLElBQXJDO0FBRUEsV0FBS0MsZUFBTCxHQUNFQyxPQUFPLENBQUMsS0FBS0Msd0JBQU4sQ0FBUCxJQUEwQyxLQUFLQyxpQkFBTCxDQUF1Qk4sS0FBSyxDQUFDTyxLQUE3QixFQUFvQ04sS0FB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WyIvLyBAZmxvd1xuXG5pbXBvcnQgdHVyZkJlYXJpbmcgZnJvbSAnQHR1cmYvYmVhcmluZyc7XG5pbXBvcnQgdHVyZkRpc3RhbmNlIGZyb20gJ0B0dXJmL2Rpc3RhbmNlJztcbmltcG9ydCB0dXJmVHJhbnNmb3JtVHJhbnNsYXRlIGZyb20gJ0B0dXJmL3RyYW5zZm9ybS10cmFuc2xhdGUnO1xuaW1wb3J0IHsgcG9pbnQgfSBmcm9tICdAdHVyZi9oZWxwZXJzJztcbmltcG9ydCB0eXBlIHsgRmVhdHVyZUNvbGxlY3Rpb24sIFBvc2l0aW9uIH0gZnJvbSAnLi4vZ2VvanNvbi10eXBlcy5qcyc7XG5pbXBvcnQgdHlwZSB7XG4gIFBvaW50ZXJNb3ZlRXZlbnQsXG4gIFN0YXJ0RHJhZ2dpbmdFdmVudCxcbiAgU3RvcERyYWdnaW5nRXZlbnQsXG4gIE1vZGVQcm9wc1xufSBmcm9tICcuLi90eXBlcy5qcyc7XG5pbXBvcnQgeyBCYXNlR2VvSnNvbkVkaXRNb2RlLCB0eXBlIEdlb0pzb25FZGl0QWN0aW9uIH0gZnJvbSAnLi9nZW9qc29uLWVkaXQtbW9kZS5qcyc7XG5pbXBvcnQgeyBJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbiB9IGZyb20gJy4vaW1tdXRhYmxlLWZlYXR1cmUtY29sbGVjdGlvbi5qcyc7XG5cbmV4cG9ydCBjbGFzcyBUcmFuc2xhdGVNb2RlIGV4dGVuZHMgQmFzZUdlb0pzb25FZGl0TW9kZSB7XG4gIF9nZW9tZXRyeUJlZm9yZVRyYW5zbGF0ZTogP0ZlYXR1cmVDb2xsZWN0aW9uO1xuICBfaXNUcmFuc2xhdGFibGU6IGJvb2xlYW47XG5cbiAgaGFuZGxlUG9pbnRlck1vdmVBZGFwdGVyKFxuICAgIGV2ZW50OiBQb2ludGVyTW92ZUV2ZW50LFxuICAgIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+XG4gICk6IHsgZWRpdEFjdGlvbjogP0dlb0pzb25FZGl0QWN0aW9uLCBjYW5jZWxNYXBQYW46IGJvb2xlYW4gfSB7XG4gICAgbGV0IGVkaXRBY3Rpb246ID9HZW9Kc29uRWRpdEFjdGlvbiA9IG51bGw7XG5cbiAgICB0aGlzLl9pc1RyYW5zbGF0YWJsZSA9XG4gICAgICBCb29sZWFuKHRoaXMuX2dlb21ldHJ5QmVmb3JlVHJhbnNsYXRlKSB8fCB0aGlzLmlzU2VsZWN0aW9uUGlja2VkKGV2ZW50LnBpY2tzLCBwcm9wcyk7XG5cbiAgICBpZiAoIXRoaXMuX2lzVHJhbnNsYXRhYmxlIHx8ICFldmVudC5wb2ludGVyRG93bk1hcENvb3Jkcykge1xuICAgICAgLy8gTm90aGluZyB0byBkb1xuICAgICAgcmV0dXJuIHsgZWRpdEFjdGlvbjogbnVsbCwgY2FuY2VsTWFwUGFuOiBmYWxzZSB9O1xuICAgIH1cblxuICAgIGlmIChldmVudC5pc0RyYWdnaW5nICYmIHRoaXMuX2dlb21ldHJ5QmVmb3JlVHJhbnNsYXRlKSB7XG4gICAgICAvLyBUcmFuc2xhdGUgdGhlIGdlb21ldHJ5XG4gICAgICBlZGl0QWN0aW9uID0gdGhpcy5nZXRUcmFuc2xhdGVBY3Rpb24oXG4gICAgICAgIGV2ZW50LnBvaW50ZXJEb3duTWFwQ29vcmRzLFxuICAgICAgICBldmVudC5tYXBDb29yZHMsXG4gICAgICAgICd0cmFuc2xhdGluZycsXG4gICAgICAgIHByb3BzXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiB7IGVkaXRBY3Rpb24sIGNhbmNlbE1hcFBhbjogdHJ1ZSB9O1xuICB9XG5cbiAgaGFuZGxlU3RhcnREcmFnZ2luZ0FkYXB0ZXIoXG4gICAgZXZlbnQ6IFN0YXJ0RHJhZ2dpbmdFdmVudCxcbiAgICBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPlxuICApOiA/R2VvSnNvbkVkaXRBY3Rpb24ge1xuICAgIGlmICghdGhpcy5faXNUcmFuc2xhdGFibGUpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHRoaXMuX2dlb21ldHJ5QmVmb3JlVHJhbnNsYXRlID0gdGhpcy5nZXRTZWxlY3RlZEZlYXR1cmVzQXNGZWF0dXJlQ29sbGVjdGlvbihwcm9wcyk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBoYW5kbGVTdG9wRHJhZ2dpbmdBZGFwdGVyKFxuICAgIGV2ZW50OiBTdG9wRHJhZ2dpbmdFdmVudCxcbiAgICBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPlxuICApOiA/R2VvSnNvbkVkaXRBY3Rpb24ge1xuICAgIGxldCBlZGl0QWN0aW9uOiA/R2VvSnNvbkVkaXRBY3Rpb24gPSBudWxsO1xuXG4gICAgaWYgKHRoaXMuX2dlb21ldHJ5QmVmb3JlVHJhbnNsYXRlKSB7XG4gICAgICAvLyBUcmFuc2xhdGUgdGhlIGdlb21ldHJ5XG4gICAgICBlZGl0QWN0aW9uID0gdGhpcy5nZXRUcmFuc2xhdGVBY3Rpb24oXG4gICAgICAgIGV2ZW50LnBvaW50ZXJEb3duTWFwQ29vcmRzLFxuICAgICAgICBldmVudC5tYXBDb29yZHMsXG4gICAgICAgICd0cmFuc2xhdGVkJyxcbiAgICAgICAgcHJvcHNcbiAgICAgICk7XG4gICAgICB0aGlzLl9nZW9tZXRyeUJlZm9yZVRyYW5zbGF0ZSA9IG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVkaXRBY3Rpb247XG4gIH1cblxuICBnZXRDdXJzb3JBZGFwdGVyKCk6ID9zdHJpbmcge1xuICAgIGlmICh0aGlzLl9pc1RyYW5zbGF0YWJsZSkge1xuICAgICAgcmV0dXJuICdtb3ZlJztcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBnZXRUcmFuc2xhdGVBY3Rpb24oXG4gICAgc3RhcnREcmFnUG9pbnQ6IFBvc2l0aW9uLFxuICAgIGN1cnJlbnRQb2ludDogUG9zaXRpb24sXG4gICAgZWRpdFR5cGU6IHN0cmluZyxcbiAgICBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPlxuICApOiA/R2VvSnNvbkVkaXRBY3Rpb24ge1xuICAgIGlmICghdGhpcy5fZ2VvbWV0cnlCZWZvcmVUcmFuc2xhdGUpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBwMSA9IHBvaW50KHN0YXJ0RHJhZ1BvaW50KTtcbiAgICBjb25zdCBwMiA9IHBvaW50KGN1cnJlbnRQb2ludCk7XG5cbiAgICBjb25zdCBkaXN0YW5jZU1vdmVkID0gdHVyZkRpc3RhbmNlKHAxLCBwMik7XG4gICAgY29uc3QgZGlyZWN0aW9uID0gdHVyZkJlYXJpbmcocDEsIHAyKTtcblxuICAgIGNvbnN0IG1vdmVkRmVhdHVyZXMgPSB0dXJmVHJhbnNmb3JtVHJhbnNsYXRlKFxuICAgICAgdGhpcy5fZ2VvbWV0cnlCZWZvcmVUcmFuc2xhdGUsXG4gICAgICBkaXN0YW5jZU1vdmVkLFxuICAgICAgZGlyZWN0aW9uXG4gICAgKTtcblxuICAgIGxldCB1cGRhdGVkRGF0YSA9IG5ldyBJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbihwcm9wcy5kYXRhKTtcblxuICAgIGNvbnN0IHNlbGVjdGVkSW5kZXhlcyA9IHByb3BzLnNlbGVjdGVkSW5kZXhlcztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNlbGVjdGVkSW5kZXhlcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3Qgc2VsZWN0ZWRJbmRleCA9IHNlbGVjdGVkSW5kZXhlc1tpXTtcbiAgICAgIGNvbnN0IG1vdmVkRmVhdHVyZSA9IG1vdmVkRmVhdHVyZXMuZmVhdHVyZXNbaV07XG4gICAgICB1cGRhdGVkRGF0YSA9IHVwZGF0ZWREYXRhLnJlcGxhY2VHZW9tZXRyeShzZWxlY3RlZEluZGV4LCBtb3ZlZEZlYXR1cmUuZ2VvbWV0cnkpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICB1cGRhdGVkRGF0YTogdXBkYXRlZERhdGEuZ2V0T2JqZWN0KCksXG4gICAgICBlZGl0VHlwZSxcbiAgICAgIGVkaXRDb250ZXh0OiB7XG4gICAgICAgIGZlYXR1cmVJbmRleGVzOiBzZWxlY3RlZEluZGV4ZXNcbiAgICAgIH1cbiAgICB9O1xuICB9XG59XG4iXX0=