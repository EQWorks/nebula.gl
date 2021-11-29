"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TranslateHandler = void 0;

var _bearing = _interopRequireDefault(require("@turf/bearing"));

var _distance = _interopRequireDefault(require("@turf/distance"));

var _transformTranslate = _interopRequireDefault(require("@turf/transform-translate"));

var _helpers = require("@turf/helpers");

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

var TranslateHandler =
/*#__PURE__*/
function (_ModeHandler) {
  _inherits(TranslateHandler, _ModeHandler);

  function TranslateHandler() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, TranslateHandler);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(TranslateHandler)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_geometryBeforeTranslate", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_isTranslatable", void 0);

    return _this;
  }

  _createClass(TranslateHandler, [{
    key: "handlePointerMove",
    value: function handlePointerMove(event) {
      var editAction = null;
      this._isTranslatable = Boolean(this._geometryBeforeTranslate) || this.isSelectionPicked(event.picks);

      if (!this._isTranslatable || !event.pointerDownGroundCoords) {
        // Nothing to do
        return {
          editAction: null,
          cancelMapPan: false
        };
      }

      if (event.isDragging && this._geometryBeforeTranslate) {
        // Translate the geometry
        editAction = this.getTranslateAction(event.pointerDownGroundCoords, event.groundCoords, 'translating');
      }

      return {
        editAction: editAction,
        cancelMapPan: true
      };
    }
  }, {
    key: "handleStartDragging",
    value: function handleStartDragging(event) {
      if (!this._isTranslatable) {
        return null;
      }

      this._geometryBeforeTranslate = this.getSelectedFeaturesAsFeatureCollection();
      return null;
    }
  }, {
    key: "handleStopDragging",
    value: function handleStopDragging(event) {
      var editAction = null;

      if (this._geometryBeforeTranslate) {
        // Translate the geometry
        editAction = this.getTranslateAction(event.pointerDownGroundCoords, event.groundCoords, 'translated');
        this._geometryBeforeTranslate = null;
      }

      return editAction;
    }
  }, {
    key: "getCursor",
    value: function getCursor(_ref) {
      var isDragging = _ref.isDragging;

      if (this._isTranslatable) {
        return 'move';
      }

      return isDragging ? 'grabbing' : 'grab';
    }
  }, {
    key: "getTranslateAction",
    value: function getTranslateAction(startDragPoint, currentPoint, editType) {
      if (!this._geometryBeforeTranslate) {
        return null;
      }

      var p1 = (0, _helpers.point)(startDragPoint);
      var p2 = (0, _helpers.point)(currentPoint);
      var distanceMoved = (0, _distance.default)(p1, p2);
      var direction = (0, _bearing.default)(p1, p2);
      var movedFeatures = (0, _transformTranslate.default)(this._geometryBeforeTranslate, distanceMoved, direction);
      var updatedData = this.getImmutableFeatureCollection();
      var selectedIndexes = this.getSelectedFeatureIndexes();

      for (var i = 0; i < selectedIndexes.length; i++) {
        var selectedIndex = selectedIndexes[i];
        var movedFeature = movedFeatures.features[i];
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

  return TranslateHandler;
}(_modeHandler.ModeHandler);

exports.TranslateHandler = TranslateHandler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL3RyYW5zbGF0ZS1oYW5kbGVyLmpzIl0sIm5hbWVzIjpbIlRyYW5zbGF0ZUhhbmRsZXIiLCJldmVudCIsImVkaXRBY3Rpb24iLCJfaXNUcmFuc2xhdGFibGUiLCJCb29sZWFuIiwiX2dlb21ldHJ5QmVmb3JlVHJhbnNsYXRlIiwiaXNTZWxlY3Rpb25QaWNrZWQiLCJwaWNrcyIsInBvaW50ZXJEb3duR3JvdW5kQ29vcmRzIiwiY2FuY2VsTWFwUGFuIiwiaXNEcmFnZ2luZyIsImdldFRyYW5zbGF0ZUFjdGlvbiIsImdyb3VuZENvb3JkcyIsImdldFNlbGVjdGVkRmVhdHVyZXNBc0ZlYXR1cmVDb2xsZWN0aW9uIiwic3RhcnREcmFnUG9pbnQiLCJjdXJyZW50UG9pbnQiLCJlZGl0VHlwZSIsInAxIiwicDIiLCJkaXN0YW5jZU1vdmVkIiwiZGlyZWN0aW9uIiwibW92ZWRGZWF0dXJlcyIsInVwZGF0ZWREYXRhIiwiZ2V0SW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24iLCJzZWxlY3RlZEluZGV4ZXMiLCJnZXRTZWxlY3RlZEZlYXR1cmVJbmRleGVzIiwiaSIsImxlbmd0aCIsInNlbGVjdGVkSW5kZXgiLCJtb3ZlZEZlYXR1cmUiLCJmZWF0dXJlcyIsInJlcGxhY2VHZW9tZXRyeSIsImdlb21ldHJ5IiwiZ2V0T2JqZWN0IiwiZmVhdHVyZUluZGV4ZXMiLCJlZGl0Q29udGV4dCIsIk1vZGVIYW5kbGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBSUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUVhQSxnQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3NDQUlPQyxLLEVBQTZFO0FBQzdGLFVBQUlDLFVBQXVCLEdBQUcsSUFBOUI7QUFFQSxXQUFLQyxlQUFMLEdBQ0VDLE9BQU8sQ0FBQyxLQUFLQyx3QkFBTixDQUFQLElBQTBDLEtBQUtDLGlCQUFMLENBQXVCTCxLQUFLLENBQUNN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cmluZyBmcm9tICdAdHVyZi9iZWFyaW5nJztcbmltcG9ydCB0dXJmRGlzdGFuY2UgZnJvbSAnQHR1cmYvZGlzdGFuY2UnO1xuaW1wb3J0IHR1cmZUcmFuc2Zvcm1UcmFuc2xhdGUgZnJvbSAnQHR1cmYvdHJhbnNmb3JtLXRyYW5zbGF0ZSc7XG5pbXBvcnQgeyBwb2ludCB9IGZyb20gJ0B0dXJmL2hlbHBlcnMnO1xuaW1wb3J0IHR5cGUgeyBGZWF0dXJlQ29sbGVjdGlvbiwgUG9zaXRpb24gfSBmcm9tICdAbmVidWxhLmdsL2VkaXQtbW9kZXMnO1xuaW1wb3J0IHR5cGUgeyBQb2ludGVyTW92ZUV2ZW50LCBTdGFydERyYWdnaW5nRXZlbnQsIFN0b3BEcmFnZ2luZ0V2ZW50IH0gZnJvbSAnLi4vZXZlbnQtdHlwZXMuanMnO1xuaW1wb3J0IHR5cGUgeyBFZGl0QWN0aW9uIH0gZnJvbSAnLi9tb2RlLWhhbmRsZXIuanMnO1xuaW1wb3J0IHsgTW9kZUhhbmRsZXIgfSBmcm9tICcuL21vZGUtaGFuZGxlci5qcyc7XG5cbmV4cG9ydCBjbGFzcyBUcmFuc2xhdGVIYW5kbGVyIGV4dGVuZHMgTW9kZUhhbmRsZXIge1xuICBfZ2VvbWV0cnlCZWZvcmVUcmFuc2xhdGU6ID9GZWF0dXJlQ29sbGVjdGlvbjtcbiAgX2lzVHJhbnNsYXRhYmxlOiBib29sZWFuO1xuXG4gIGhhbmRsZVBvaW50ZXJNb3ZlKGV2ZW50OiBQb2ludGVyTW92ZUV2ZW50KTogeyBlZGl0QWN0aW9uOiA/RWRpdEFjdGlvbiwgY2FuY2VsTWFwUGFuOiBib29sZWFuIH0ge1xuICAgIGxldCBlZGl0QWN0aW9uOiA/RWRpdEFjdGlvbiA9IG51bGw7XG5cbiAgICB0aGlzLl9pc1RyYW5zbGF0YWJsZSA9XG4gICAgICBCb29sZWFuKHRoaXMuX2dlb21ldHJ5QmVmb3JlVHJhbnNsYXRlKSB8fCB0aGlzLmlzU2VsZWN0aW9uUGlja2VkKGV2ZW50LnBpY2tzKTtcblxuICAgIGlmICghdGhpcy5faXNUcmFuc2xhdGFibGUgfHwgIWV2ZW50LnBvaW50ZXJEb3duR3JvdW5kQ29vcmRzKSB7XG4gICAgICAvLyBOb3RoaW5nIHRvIGRvXG4gICAgICByZXR1cm4geyBlZGl0QWN0aW9uOiBudWxsLCBjYW5jZWxNYXBQYW46IGZhbHNlIH07XG4gICAgfVxuXG4gICAgaWYgKGV2ZW50LmlzRHJhZ2dpbmcgJiYgdGhpcy5fZ2VvbWV0cnlCZWZvcmVUcmFuc2xhdGUpIHtcbiAgICAgIC8vIFRyYW5zbGF0ZSB0aGUgZ2VvbWV0cnlcbiAgICAgIGVkaXRBY3Rpb24gPSB0aGlzLmdldFRyYW5zbGF0ZUFjdGlvbihcbiAgICAgICAgZXZlbnQucG9pbnRlckRvd25Hcm91bmRDb29yZHMsXG4gICAgICAgIGV2ZW50Lmdyb3VuZENvb3JkcyxcbiAgICAgICAgJ3RyYW5zbGF0aW5nJ1xuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4geyBlZGl0QWN0aW9uLCBjYW5jZWxNYXBQYW46IHRydWUgfTtcbiAgfVxuXG4gIGhhbmRsZVN0YXJ0RHJhZ2dpbmcoZXZlbnQ6IFN0YXJ0RHJhZ2dpbmdFdmVudCk6ID9FZGl0QWN0aW9uIHtcbiAgICBpZiAoIXRoaXMuX2lzVHJhbnNsYXRhYmxlKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB0aGlzLl9nZW9tZXRyeUJlZm9yZVRyYW5zbGF0ZSA9IHRoaXMuZ2V0U2VsZWN0ZWRGZWF0dXJlc0FzRmVhdHVyZUNvbGxlY3Rpb24oKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGhhbmRsZVN0b3BEcmFnZ2luZyhldmVudDogU3RvcERyYWdnaW5nRXZlbnQpOiA/RWRpdEFjdGlvbiB7XG4gICAgbGV0IGVkaXRBY3Rpb246ID9FZGl0QWN0aW9uID0gbnVsbDtcblxuICAgIGlmICh0aGlzLl9nZW9tZXRyeUJlZm9yZVRyYW5zbGF0ZSkge1xuICAgICAgLy8gVHJhbnNsYXRlIHRoZSBnZW9tZXRyeVxuICAgICAgZWRpdEFjdGlvbiA9IHRoaXMuZ2V0VHJhbnNsYXRlQWN0aW9uKFxuICAgICAgICBldmVudC5wb2ludGVyRG93bkdyb3VuZENvb3JkcyxcbiAgICAgICAgZXZlbnQuZ3JvdW5kQ29vcmRzLFxuICAgICAgICAndHJhbnNsYXRlZCdcbiAgICAgICk7XG4gICAgICB0aGlzLl9nZW9tZXRyeUJlZm9yZVRyYW5zbGF0ZSA9IG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVkaXRBY3Rpb247XG4gIH1cblxuICBnZXRDdXJzb3IoeyBpc0RyYWdnaW5nIH06IHsgaXNEcmFnZ2luZzogYm9vbGVhbiB9KTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy5faXNUcmFuc2xhdGFibGUpIHtcbiAgICAgIHJldHVybiAnbW92ZSc7XG4gICAgfVxuICAgIHJldHVybiBpc0RyYWdnaW5nID8gJ2dyYWJiaW5nJyA6ICdncmFiJztcbiAgfVxuXG4gIGdldFRyYW5zbGF0ZUFjdGlvbihcbiAgICBzdGFydERyYWdQb2ludDogUG9zaXRpb24sXG4gICAgY3VycmVudFBvaW50OiBQb3NpdGlvbixcbiAgICBlZGl0VHlwZTogc3RyaW5nXG4gICk6ID9FZGl0QWN0aW9uIHtcbiAgICBpZiAoIXRoaXMuX2dlb21ldHJ5QmVmb3JlVHJhbnNsYXRlKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgcDEgPSBwb2ludChzdGFydERyYWdQb2ludCk7XG4gICAgY29uc3QgcDIgPSBwb2ludChjdXJyZW50UG9pbnQpO1xuXG4gICAgY29uc3QgZGlzdGFuY2VNb3ZlZCA9IHR1cmZEaXN0YW5jZShwMSwgcDIpO1xuICAgIGNvbnN0IGRpcmVjdGlvbiA9IHR1cmZCZWFyaW5nKHAxLCBwMik7XG5cbiAgICBjb25zdCBtb3ZlZEZlYXR1cmVzID0gdHVyZlRyYW5zZm9ybVRyYW5zbGF0ZShcbiAgICAgIHRoaXMuX2dlb21ldHJ5QmVmb3JlVHJhbnNsYXRlLFxuICAgICAgZGlzdGFuY2VNb3ZlZCxcbiAgICAgIGRpcmVjdGlvblxuICAgICk7XG5cbiAgICBsZXQgdXBkYXRlZERhdGEgPSB0aGlzLmdldEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uKCk7XG5cbiAgICBjb25zdCBzZWxlY3RlZEluZGV4ZXMgPSB0aGlzLmdldFNlbGVjdGVkRmVhdHVyZUluZGV4ZXMoKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNlbGVjdGVkSW5kZXhlcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3Qgc2VsZWN0ZWRJbmRleCA9IHNlbGVjdGVkSW5kZXhlc1tpXTtcbiAgICAgIGNvbnN0IG1vdmVkRmVhdHVyZSA9IG1vdmVkRmVhdHVyZXMuZmVhdHVyZXNbaV07XG4gICAgICB1cGRhdGVkRGF0YSA9IHVwZGF0ZWREYXRhLnJlcGxhY2VHZW9tZXRyeShzZWxlY3RlZEluZGV4LCBtb3ZlZEZlYXR1cmUuZ2VvbWV0cnkpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICB1cGRhdGVkRGF0YTogdXBkYXRlZERhdGEuZ2V0T2JqZWN0KCksXG4gICAgICBlZGl0VHlwZSxcbiAgICAgIGZlYXR1cmVJbmRleGVzOiBzZWxlY3RlZEluZGV4ZXMsXG4gICAgICBlZGl0Q29udGV4dDogbnVsbFxuICAgIH07XG4gIH1cbn1cbiJdfQ==