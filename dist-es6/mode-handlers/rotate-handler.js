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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL3JvdGF0ZS1oYW5kbGVyLmpzIl0sIm5hbWVzIjpbIlJvdGF0ZUhhbmRsZXIiLCJldmVudCIsImVkaXRBY3Rpb24iLCJfaXNSb3RhdGFibGUiLCJCb29sZWFuIiwiX2dlb21ldHJ5QmVpbmdSb3RhdGVkIiwiaXNTZWxlY3Rpb25QaWNrZWQiLCJwaWNrcyIsInBvaW50ZXJEb3duR3JvdW5kQ29vcmRzIiwiY2FuY2VsTWFwUGFuIiwiaXNEcmFnZ2luZyIsImdldFJvdGF0ZUFjdGlvbiIsImdyb3VuZENvb3JkcyIsImdldFNlbGVjdGVkRmVhdHVyZXNBc0ZlYXR1cmVDb2xsZWN0aW9uIiwic3RhcnREcmFnUG9pbnQiLCJjdXJyZW50UG9pbnQiLCJlZGl0VHlwZSIsInN0YXJ0UG9zaXRpb24iLCJjZW50cm9pZCIsImFuZ2xlIiwiZ2V0Um90YXRpb25BbmdsZSIsInJvdGF0ZWRGZWF0dXJlcyIsInVwZGF0ZWREYXRhIiwiZ2V0SW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24iLCJzZWxlY3RlZEluZGV4ZXMiLCJnZXRTZWxlY3RlZEZlYXR1cmVJbmRleGVzIiwiaSIsImxlbmd0aCIsInNlbGVjdGVkSW5kZXgiLCJtb3ZlZEZlYXR1cmUiLCJmZWF0dXJlcyIsInJlcGxhY2VHZW9tZXRyeSIsImdlb21ldHJ5IiwiZ2V0T2JqZWN0IiwiZmVhdHVyZUluZGV4ZXMiLCJlZGl0Q29udGV4dCIsIk1vZGVIYW5kbGVyIiwiYmVhcmluZzEiLCJiZWFyaW5nMiJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVBOztBQUNBOztBQUNBOztBQUlBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFFYUEsYTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3NDQUlPQyxLLEVBQTZFO0FBQzdGLFVBQUlDLFVBQXVCLEdBQUcsSUFBOUI7QUFFQSxXQUFLQyxZQUFMLEdBQW9CQyxPQUFPLENBQUMsS0FBS0MscUJBQU4sQ0FBUCxJQUF1QyxLQUFLQyxpQkFBTCxDQUF1QkwsS0FBSyxDQUFDTSxLQUE3QixDQUEzRDs7QUFFQSxVQUFJLENBQUMsS0FBS0osWUFBTixJQUFzQixDQUFDRixLQUFLLENBQUNPLHVCQUFqQyxFQUEwRDtBQUN4RDtBQUNBLGVBQU87QUFBRU4sVUFBQUEsVUFBVSxFQUFFLElBQWQ7QUFBb0JPLFVBQUFBLFlBQVksRUFBRTtBQUFsQyxTQUFQO0FBQ0Q7O0FBRUQsVUFBSVIsS0FBSyxDQUFDUyxVQUFOLElBQW9CLEtBQUtMLHFCQUE3QixFQUFvRDtBQUNsRDtBQUNBSCxRQUFBQSxVQUFVLEdBQUcsS0FBS1MsZUFBTCxDQUNYVixLQUFLLENBQUNPLHVCQURLLEVBRVhQLEtBQUssQ0FBQ1csWUFGSyxFQUdYLFVBSFcsQ0FBYjtBQUtEOztBQUVELGFBQU87QUFBRVYsUUFBQUEsVUFBVSxFQUFWQSxVQUFGO0FBQWNPLFFBQUFBLFlBQVksRUFBRTtBQUE1QixPQUFQO0FBQ0Q7Ozt3Q0FFbUJSLEssRUFBd0M7QUFDMUQsVUFBSSxDQUFDLEtBQUtFLFlBQVYsRUFBd0I7QUFDdEIsZUFBTyxJQUFQO0FBQ0Q7O0FBRUQsV0FBS0UscUJBQUwsR0FBNkIsS0FBS1Esc0NBQUwsRUFBN0I7QUFDQSxhQUFPLElBQVA7QUFDRDs7O3VDQUVrQlosSyxFQUF1QztBQUN4RCxVQUFJQyxVQUF1QixHQUFHLElBQTlCOztBQUVBLFVBQUksS0FBS0cscUJBQVQsRUFBZ0M7QUFDOUI7QUFDQUgsUUFBQUEsVUFBVSxHQUFHLEtBQUtTLGVBQUwsQ0FDWFYsS0FBSyxDQUFDTyx1QkFESyxFQUVYUCxLQUFLLENBQUNXLFlBRkssRUFHWCxTQUhXLENBQWI7QUFLQSxhQUFLUCxxQkFBTCxHQUE2QixJQUE3QjtBQUNEOztBQUVELGFBQU9ILFVBQVA7QUFDRDs7O29DQUUwRDtBQUFBLFVBQS9DUSxVQUErQyxRQUEvQ0EsVUFBK0M7O0FBQ3pELFVBQUksS0FBS1AsWUFBVCxFQUF1QjtBQUNyQjtBQUNBLGVBQU8sTUFBUDtBQUNEOztBQUNELGFBQU9PLFVBQVUsR0FBRyxVQUFILEdBQWdCLE1BQWpDO0FBQ0Q7OztvQ0FFZUksYyxFQUEwQkMsWSxFQUF3QkMsUSxFQUE4QjtBQUM5RixVQUFNQyxhQUFhLEdBQUdILGNBQXRCO0FBQ0EsVUFBTUksUUFBUSxHQUFHLHVCQUFhLEtBQUtiLHFCQUFsQixDQUFqQjtBQUNBLFVBQU1jLEtBQUssR0FBR0MsZ0JBQWdCLENBQUNGLFFBQUQsRUFBV0QsYUFBWCxFQUEwQkYsWUFBMUIsQ0FBOUI7QUFFQSxVQUFNTSxlQUFlLEdBQUcsOEJBQW9CLEtBQUtoQixxQkFBekIsRUFBZ0RjLEtBQWhELENBQXhCO0FBRUEsVUFBSUcsV0FBVyxHQUFHLEtBQUtDLDZCQUFMLEVBQWxCO0FBRUEsVUFBTUMsZUFBZSxHQUFHLEtBQUtDLHlCQUFMLEVBQXhCOztBQUNBLFdBQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0YsZUFBZSxDQUFDRyxNQUFwQyxFQUE0Q0QsQ0FBQyxFQUE3QyxFQUFpRDtBQUMvQyxZQUFNRSxhQUFhLEdBQUdKLGVBQWUsQ0FBQ0UsQ0FBRCxDQUFyQztBQUNBLFlBQU1HLFlBQVksR0FBR1IsZUFBZSxDQUFDUyxRQUFoQixDQUF5QkosQ0FBekIsQ0FBckI7QUFDQUosUUFBQUEsV0FBVyxHQUFHQSxXQUFXLENBQUNTLGVBQVosQ0FBNEJILGFBQTVCLEVBQTJDQyxZQUFZLENBQUNHLFFBQXhELENBQWQ7QUFDRDs7QUFFRCxhQUFPO0FBQ0xWLFFBQUFBLFdBQVcsRUFBRUEsV0FBVyxDQUFDVyxTQUFaLEVBRFI7QUFFTGpCLFFBQUFBLFFBQVEsRUFBUkEsUUFGSztBQUdMa0IsUUFBQUEsY0FBYyxFQUFFVixlQUhYO0FBSUxXLFFBQUFBLFdBQVcsRUFBRTtBQUpSLE9BQVA7QUFNRDs7OztFQWpGZ0NDLHdCOzs7O0FBb0ZuQyxTQUFTaEIsZ0JBQVQsQ0FBMEJGLFFBQTFCLEVBQThDSixjQUE5QyxFQUF3RUMsWUFBeEUsRUFBZ0c7QUFDOUYsTUFBTXNCLFFBQVEsR0FBRyxzQkFBWW5CLFFBQVosRUFBc0JKLGNBQXRCLENBQWpCO0FBQ0EsTUFBTXdCLFFBQVEsR0FBRyxzQkFBWXBCLFFBQVosRUFBc0JILFlBQXRCLENBQWpCO0FBQ0EsU0FBT3VCLFFBQVEsR0FBR0QsUUFBbEI7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbmltcG9ydCB0dXJmQ2VudHJvaWQgZnJvbSAnQHR1cmYvY2VudHJvaWQnO1xuaW1wb3J0IHR1cmZCZWFyaW5nIGZyb20gJ0B0dXJmL2JlYXJpbmcnO1xuaW1wb3J0IHR1cmZUcmFuc2Zvcm1Sb3RhdGUgZnJvbSAnQHR1cmYvdHJhbnNmb3JtLXJvdGF0ZSc7XG5pbXBvcnQgdHlwZSB7IEZlYXR1cmVDb2xsZWN0aW9uLCBQb3NpdGlvbiB9IGZyb20gJ0BuZWJ1bGEuZ2wvZWRpdC1tb2Rlcyc7XG5pbXBvcnQgdHlwZSB7IFBvaW50ZXJNb3ZlRXZlbnQsIFN0YXJ0RHJhZ2dpbmdFdmVudCwgU3RvcERyYWdnaW5nRXZlbnQgfSBmcm9tICcuLi9ldmVudC10eXBlcy5qcyc7XG5pbXBvcnQgdHlwZSB7IEVkaXRBY3Rpb24gfSBmcm9tICcuL21vZGUtaGFuZGxlci5qcyc7XG5pbXBvcnQgeyBNb2RlSGFuZGxlciB9IGZyb20gJy4vbW9kZS1oYW5kbGVyLmpzJztcblxuZXhwb3J0IGNsYXNzIFJvdGF0ZUhhbmRsZXIgZXh0ZW5kcyBNb2RlSGFuZGxlciB7XG4gIF9pc1JvdGF0YWJsZTogYm9vbGVhbjtcbiAgX2dlb21ldHJ5QmVpbmdSb3RhdGVkOiA/RmVhdHVyZUNvbGxlY3Rpb247XG5cbiAgaGFuZGxlUG9pbnRlck1vdmUoZXZlbnQ6IFBvaW50ZXJNb3ZlRXZlbnQpOiB7IGVkaXRBY3Rpb246ID9FZGl0QWN0aW9uLCBjYW5jZWxNYXBQYW46IGJvb2xlYW4gfSB7XG4gICAgbGV0IGVkaXRBY3Rpb246ID9FZGl0QWN0aW9uID0gbnVsbDtcblxuICAgIHRoaXMuX2lzUm90YXRhYmxlID0gQm9vbGVhbih0aGlzLl9nZW9tZXRyeUJlaW5nUm90YXRlZCkgfHwgdGhpcy5pc1NlbGVjdGlvblBpY2tlZChldmVudC5waWNrcyk7XG5cbiAgICBpZiAoIXRoaXMuX2lzUm90YXRhYmxlIHx8ICFldmVudC5wb2ludGVyRG93bkdyb3VuZENvb3Jkcykge1xuICAgICAgLy8gTm90aGluZyB0byBkb1xuICAgICAgcmV0dXJuIHsgZWRpdEFjdGlvbjogbnVsbCwgY2FuY2VsTWFwUGFuOiBmYWxzZSB9O1xuICAgIH1cblxuICAgIGlmIChldmVudC5pc0RyYWdnaW5nICYmIHRoaXMuX2dlb21ldHJ5QmVpbmdSb3RhdGVkKSB7XG4gICAgICAvLyBSb3RhdGUgdGhlIGdlb21ldHJ5XG4gICAgICBlZGl0QWN0aW9uID0gdGhpcy5nZXRSb3RhdGVBY3Rpb24oXG4gICAgICAgIGV2ZW50LnBvaW50ZXJEb3duR3JvdW5kQ29vcmRzLFxuICAgICAgICBldmVudC5ncm91bmRDb29yZHMsXG4gICAgICAgICdyb3RhdGluZydcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgZWRpdEFjdGlvbiwgY2FuY2VsTWFwUGFuOiB0cnVlIH07XG4gIH1cblxuICBoYW5kbGVTdGFydERyYWdnaW5nKGV2ZW50OiBTdGFydERyYWdnaW5nRXZlbnQpOiA/RWRpdEFjdGlvbiB7XG4gICAgaWYgKCF0aGlzLl9pc1JvdGF0YWJsZSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgdGhpcy5fZ2VvbWV0cnlCZWluZ1JvdGF0ZWQgPSB0aGlzLmdldFNlbGVjdGVkRmVhdHVyZXNBc0ZlYXR1cmVDb2xsZWN0aW9uKCk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBoYW5kbGVTdG9wRHJhZ2dpbmcoZXZlbnQ6IFN0b3BEcmFnZ2luZ0V2ZW50KTogP0VkaXRBY3Rpb24ge1xuICAgIGxldCBlZGl0QWN0aW9uOiA/RWRpdEFjdGlvbiA9IG51bGw7XG5cbiAgICBpZiAodGhpcy5fZ2VvbWV0cnlCZWluZ1JvdGF0ZWQpIHtcbiAgICAgIC8vIFJvdGF0ZSB0aGUgZ2VvbWV0cnlcbiAgICAgIGVkaXRBY3Rpb24gPSB0aGlzLmdldFJvdGF0ZUFjdGlvbihcbiAgICAgICAgZXZlbnQucG9pbnRlckRvd25Hcm91bmRDb29yZHMsXG4gICAgICAgIGV2ZW50Lmdyb3VuZENvb3JkcyxcbiAgICAgICAgJ3JvdGF0ZWQnXG4gICAgICApO1xuICAgICAgdGhpcy5fZ2VvbWV0cnlCZWluZ1JvdGF0ZWQgPSBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBlZGl0QWN0aW9uO1xuICB9XG5cbiAgZ2V0Q3Vyc29yKHsgaXNEcmFnZ2luZyB9OiB7IGlzRHJhZ2dpbmc6IGJvb2xlYW4gfSk6IHN0cmluZyB7XG4gICAgaWYgKHRoaXMuX2lzUm90YXRhYmxlKSB7XG4gICAgICAvLyBUT0RPOiBsb29rIGF0IGRvaW5nIFNWRyBjdXJzb3JzIHRvIGdldCBhIGJldHRlciBcInJvdGF0ZVwiIGN1cnNvclxuICAgICAgcmV0dXJuICdtb3ZlJztcbiAgICB9XG4gICAgcmV0dXJuIGlzRHJhZ2dpbmcgPyAnZ3JhYmJpbmcnIDogJ2dyYWInO1xuICB9XG5cbiAgZ2V0Um90YXRlQWN0aW9uKHN0YXJ0RHJhZ1BvaW50OiBQb3NpdGlvbiwgY3VycmVudFBvaW50OiBQb3NpdGlvbiwgZWRpdFR5cGU6IHN0cmluZyk6IEVkaXRBY3Rpb24ge1xuICAgIGNvbnN0IHN0YXJ0UG9zaXRpb24gPSBzdGFydERyYWdQb2ludDtcbiAgICBjb25zdCBjZW50cm9pZCA9IHR1cmZDZW50cm9pZCh0aGlzLl9nZW9tZXRyeUJlaW5nUm90YXRlZCk7XG4gICAgY29uc3QgYW5nbGUgPSBnZXRSb3RhdGlvbkFuZ2xlKGNlbnRyb2lkLCBzdGFydFBvc2l0aW9uLCBjdXJyZW50UG9pbnQpO1xuXG4gICAgY29uc3Qgcm90YXRlZEZlYXR1cmVzID0gdHVyZlRyYW5zZm9ybVJvdGF0ZSh0aGlzLl9nZW9tZXRyeUJlaW5nUm90YXRlZCwgYW5nbGUpO1xuXG4gICAgbGV0IHVwZGF0ZWREYXRhID0gdGhpcy5nZXRJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbigpO1xuXG4gICAgY29uc3Qgc2VsZWN0ZWRJbmRleGVzID0gdGhpcy5nZXRTZWxlY3RlZEZlYXR1cmVJbmRleGVzKCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWxlY3RlZEluZGV4ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHNlbGVjdGVkSW5kZXggPSBzZWxlY3RlZEluZGV4ZXNbaV07XG4gICAgICBjb25zdCBtb3ZlZEZlYXR1cmUgPSByb3RhdGVkRmVhdHVyZXMuZmVhdHVyZXNbaV07XG4gICAgICB1cGRhdGVkRGF0YSA9IHVwZGF0ZWREYXRhLnJlcGxhY2VHZW9tZXRyeShzZWxlY3RlZEluZGV4LCBtb3ZlZEZlYXR1cmUuZ2VvbWV0cnkpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICB1cGRhdGVkRGF0YTogdXBkYXRlZERhdGEuZ2V0T2JqZWN0KCksXG4gICAgICBlZGl0VHlwZSxcbiAgICAgIGZlYXR1cmVJbmRleGVzOiBzZWxlY3RlZEluZGV4ZXMsXG4gICAgICBlZGl0Q29udGV4dDogbnVsbFxuICAgIH07XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0Um90YXRpb25BbmdsZShjZW50cm9pZDogUG9zaXRpb24sIHN0YXJ0RHJhZ1BvaW50OiBQb3NpdGlvbiwgY3VycmVudFBvaW50OiBQb3NpdGlvbikge1xuICBjb25zdCBiZWFyaW5nMSA9IHR1cmZCZWFyaW5nKGNlbnRyb2lkLCBzdGFydERyYWdQb2ludCk7XG4gIGNvbnN0IGJlYXJpbmcyID0gdHVyZkJlYXJpbmcoY2VudHJvaWQsIGN1cnJlbnRQb2ludCk7XG4gIHJldHVybiBiZWFyaW5nMiAtIGJlYXJpbmcxO1xufVxuIl19