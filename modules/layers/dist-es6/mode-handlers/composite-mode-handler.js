"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CompositeModeHandler = void 0;

var _modeHandler = require("./mode-handler.js");

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

var CompositeModeHandler =
/*#__PURE__*/
function (_ModeHandler) {
  _inherits(CompositeModeHandler, _ModeHandler);

  function CompositeModeHandler(handlers) {
    var _this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, CompositeModeHandler);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CompositeModeHandler).call(this));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handlers", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "options", void 0);

    _this.handlers = handlers;
    _this.options = options;
    return _this;
  }

  _createClass(CompositeModeHandler, [{
    key: "_coalesce",
    value: function _coalesce(callback) {
      var resultEval = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var result;

      for (var i = 0; i < this.handlers.length; i++) {
        result = callback(this.handlers[i]);

        if (resultEval ? resultEval(result) : result) {
          break;
        }
      }

      return result;
    }
  }, {
    key: "setFeatureCollection",
    value: function setFeatureCollection(featureCollection) {
      this.handlers.forEach(function (handler) {
        return handler.setFeatureCollection(featureCollection);
      });
    }
  }, {
    key: "setModeConfig",
    value: function setModeConfig(modeConfig) {
      this.handlers.forEach(function (handler) {
        return handler.setModeConfig(modeConfig);
      });
    }
  }, {
    key: "setSelectedFeatureIndexes",
    value: function setSelectedFeatureIndexes(indexes) {
      this.handlers.forEach(function (handler) {
        return handler.setSelectedFeatureIndexes(indexes);
      });
    }
  }, {
    key: "handleClick",
    value: function handleClick(event) {
      return this._coalesce(function (handler) {
        return handler.handleClick(event);
      });
    }
  }, {
    key: "handlePointerMove",
    value: function handlePointerMove(event) {
      return this._coalesce(function (handler) {
        return handler.handlePointerMove(event);
      }, function (result) {
        return result && Boolean(result.editAction);
      });
    }
  }, {
    key: "handleStartDragging",
    value: function handleStartDragging(event) {
      return this._coalesce(function (handler) {
        return handler.handleStartDragging(event);
      });
    }
  }, {
    key: "handleStopDragging",
    value: function handleStopDragging(event) {
      return this._coalesce(function (handler) {
        return handler.handleStopDragging(event);
      });
    }
  }, {
    key: "getTentativeFeature",
    value: function getTentativeFeature() {
      return this._coalesce(function (handler) {
        return handler.getTentativeFeature();
      });
    }
  }, {
    key: "getEditHandles",
    value: function getEditHandles(picks, groundCoords) {
      // TODO: Combine the handles *BUT* make sure if none of the results have
      // changed to return the same object so that "editHandles !== this.state.editHandles"
      // in editable-geojson-layer works.
      return this._coalesce(function (handler) {
        return handler.getEditHandles(picks, groundCoords);
      }, function (handles) {
        return Array.isArray(handles) && handles.length > 0;
      });
    }
  }, {
    key: "getCursor",
    value: function getCursor(_ref) {
      var isDragging = _ref.isDragging;
      return this._coalesce(function (handler) {
        return handler.getCursor({
          isDragging: isDragging
        });
      });
    }
  }]);

  return CompositeModeHandler;
}(_modeHandler.ModeHandler);

exports.CompositeModeHandler = CompositeModeHandler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL2NvbXBvc2l0ZS1tb2RlLWhhbmRsZXIuanMiXSwibmFtZXMiOlsiQ29tcG9zaXRlTW9kZUhhbmRsZXIiLCJoYW5kbGVycyIsIm9wdGlvbnMiLCJjYWxsYmFjayIsInJlc3VsdEV2YWwiLCJyZXN1bHQiLCJpIiwibGVuZ3RoIiwiZmVhdHVyZUNvbGxlY3Rpb24iLCJmb3JFYWNoIiwiaGFuZGxlciIsInNldEZlYXR1cmVDb2xsZWN0aW9uIiwibW9kZUNvbmZpZyIsInNldE1vZGVDb25maWciLCJpbmRleGVzIiwic2V0U2VsZWN0ZWRGZWF0dXJlSW5kZXhlcyIsImV2ZW50IiwiX2NvYWxlc2NlIiwiaGFuZGxlQ2xpY2siLCJoYW5kbGVQb2ludGVyTW92ZSIsIkJvb2xlYW4iLCJlZGl0QWN0aW9uIiwiaGFuZGxlU3RhcnREcmFnZ2luZyIsImhhbmRsZVN0b3BEcmFnZ2luZyIsImdldFRlbnRhdGl2ZUZlYXR1cmUiLCJwaWNrcyIsImdyb3VuZENvb3JkcyIsImdldEVkaXRIYW5kbGVzIiwiaGFuZGxlcyIsIkFycmF5IiwiaXNBcnJheSIsImlzRHJhZ2dpbmciLCJnZXRDdXJzb3IiLCJNb2RlSGFuZGxlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQVNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBRWFBLG9COzs7OztBQUlYLGdDQUFZQyxRQUFaLEVBQWdFO0FBQUE7O0FBQUEsUUFBdEJDLE9BQXNCLHVFQUFKLEVBQUk7O0FBQUE7O0FBQzlEOztBQUQ4RDs7QUFBQTs7QUFFOUQsVUFBS0QsUUFBTCxHQUFnQkEsUUFBaEI7QUFDQSxVQUFLQyxPQUFMLEdBQWVBLE9BQWY7QUFIOEQ7QUFJL0Q7Ozs7OEJBRVlDLFEsRUFBbUU7QUFBQSxVQUF2Q0MsVUFBdUMsdUVBQVQsSUFBUztBQUM5RSxVQUFJQyxNQUFKOztBQUVBLFdBQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRyxLQUFLTCxRQUFMLENBQWNNLE1BQWxDLEVBQTBDRCxDQUFDLEVBQTNDLEVBQStDO0FBQzdDRCxRQUFBQSxNQUFNLEdBQUdGLFFBQVEsQ0FBQyxLQUFLRixRQUFMLENBQWNLLENBQWQsQ0FBRCxDQUFqQjs7QUFDQSxZQUFJRixVQUFVLEdBQUdBLFVBQVUsQ0FBQ0MsTUFBRCxDQUFiLEdBQXdCQSxNQUF0QyxFQUE4QztBQUM1QztBQUNEO0FBQ0Y7O0FBRUQsYUFBUUEsTUFBUjtBQUNEOzs7eUNBRW9CRyxpQixFQUE0QztBQUMvRCxXQUFLUCxRQUFMLENBQWNRLE9BQWQsQ0FBc0IsVUFBQUMsT0FBTztBQUFBLGVBQUlBLE9BQU8sQ0FBQ0Msb0JBQVIsQ0FBNkJILGlCQUE3QixDQUFKO0FBQUEsT0FBN0I7QUFDRDs7O2tDQUVhSSxVLEVBQXVCO0FBQ25DLFdBQUtYLFFBQUwsQ0FBY1EsT0FBZCxDQUFzQixVQUFBQyxPQUFPO0FBQUEsZUFBSUEsT0FBTyxDQUFDRyxhQUFSLENBQXNCRCxVQUF0QixDQUFKO0FBQUEsT0FBN0I7QUFDRDs7OzhDQUV5QkUsTyxFQUF5QjtBQUNqRCxXQUFLYixRQUFMLENBQWNRLE9BQWQsQ0FBc0IsVUFBQUMsT0FBTztBQUFBLGVBQUlBLE9BQU8sQ0FBQ0sseUJBQVIsQ0FBa0NELE9BQWxDLENBQUo7QUFBQSxPQUE3QjtBQUNEOzs7Z0NBRVdFLEssRUFBZ0M7QUFDMUMsYUFBTyxLQUFLQyxTQUFMLENBQWUsVUFBQVAsT0FBTztBQUFBLGVBQUlBLE9BQU8sQ0FBQ1EsV0FBUixDQUFvQkYsS0FBcEIsQ0FBSjtBQUFBLE9BQXRCLENBQVA7QUFDRDs7O3NDQUVpQkEsSyxFQUE2RTtBQUM3RixhQUFPLEtBQUtDLFNBQUwsQ0FDTCxVQUFBUCxPQUFPO0FBQUEsZUFBSUEsT0FBTyxDQUFDUyxpQkFBUixDQUEwQkgsS0FBMUIsQ0FBSjtBQUFBLE9BREYsRUFFTCxVQUFBWCxNQUFNO0FBQUEsZUFBSUEsTUFBTSxJQUFJZSxPQUFPLENBQUNmLE1BQU0sQ0FBQ2dCLFVBQVIsQ0FBckI7QUFBQSxPQUZELENBQVA7QUFJRDs7O3dDQUVtQkwsSyxFQUF3QztBQUMxRCxhQUFPLEtBQUtDLFNBQUwsQ0FBZSxVQUFBUCxPQUFPO0FBQUEsZUFBSUEsT0FBTyxDQUFDWSxtQkFBUixDQUE0Qk4sS0FBNUIsQ0FBSjtBQUFBLE9BQXRCLENBQVA7QUFDRDs7O3VDQUVrQkEsSyxFQUF1QztBQUN4RCxhQUFPLEtBQUtDLFNBQUwsQ0FBZSxVQUFBUCxPQUFPO0FBQUEsZUFBSUEsT0FBTyxDQUFDYSxrQkFBUixDQUEyQlAsS0FBM0IsQ0FBSjtBQUFBLE9BQXRCLENBQVA7QUFDRDs7OzBDQUUrQjtBQUM5QixhQUFPLEtBQUtDLFNBQUwsQ0FBZSxVQUFBUCxPQUFPO0FBQUEsZUFBSUEsT0FBTyxDQUFDYyxtQkFBUixFQUFKO0FBQUEsT0FBdEIsQ0FBUDtBQUNEOzs7bUNBRWNDLEssRUFBdUJDLFksRUFBdUM7QUFDM0U7QUFDQTtBQUNBO0FBQ0EsYUFBTyxLQUFLVCxTQUFMLENBQ0wsVUFBQVAsT0FBTztBQUFBLGVBQUlBLE9BQU8sQ0FBQ2lCLGNBQVIsQ0FBdUJGLEtBQXZCLEVBQThCQyxZQUE5QixDQUFKO0FBQUEsT0FERixFQUVMLFVBQUFFLE9BQU87QUFBQSxlQUFJQyxLQUFLLENBQUNDLE9BQU4sQ0FBY0YsT0FBZCxLQUEwQkEsT0FBTyxDQUFDckIsTUFBUixHQUFpQixDQUEvQztBQUFBLE9BRkYsQ0FBUDtBQUlEOzs7b0NBRTBEO0FBQUEsVUFBL0N3QixVQUErQyxRQUEvQ0EsVUFBK0M7QUFDekQsYUFBTyxLQUFLZCxTQUFMLENBQWUsVUFBQVAsT0FBTztBQUFBLGVBQUlBLE9BQU8sQ0FBQ3NCLFNBQVIsQ0FBa0I7QUFBRUQsVUFBQUEsVUFBVSxFQUFWQTtBQUFGLFNBQWxCLENBQUo7QUFBQSxPQUF0QixDQUFQO0FBQ0Q7Ozs7RUF0RXVDRSx3QiIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbmltcG9ydCB0eXBlIHsgRmVhdHVyZUNvbGxlY3Rpb24sIEZlYXR1cmUsIFBvc2l0aW9uIH0gZnJvbSAnQG5lYnVsYS5nbC9lZGl0LW1vZGVzJztcbmltcG9ydCB0eXBlIHtcbiAgQ2xpY2tFdmVudCxcbiAgUG9pbnRlck1vdmVFdmVudCxcbiAgU3RhcnREcmFnZ2luZ0V2ZW50LFxuICBTdG9wRHJhZ2dpbmdFdmVudFxufSBmcm9tICcuLi9ldmVudC10eXBlcy5qcyc7XG5pbXBvcnQgeyBNb2RlSGFuZGxlciwgdHlwZSBFZGl0QWN0aW9uLCB0eXBlIEVkaXRIYW5kbGUgfSBmcm9tICcuL21vZGUtaGFuZGxlci5qcyc7XG5cbmV4cG9ydCBjbGFzcyBDb21wb3NpdGVNb2RlSGFuZGxlciBleHRlbmRzIE1vZGVIYW5kbGVyIHtcbiAgaGFuZGxlcnM6IEFycmF5PE1vZGVIYW5kbGVyPjtcbiAgb3B0aW9uczogT2JqZWN0O1xuXG4gIGNvbnN0cnVjdG9yKGhhbmRsZXJzOiBBcnJheTxNb2RlSGFuZGxlcj4sIG9wdGlvbnM6IE9iamVjdCA9IHt9KSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmhhbmRsZXJzID0gaGFuZGxlcnM7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgfVxuXG4gIF9jb2FsZXNjZTxUPihjYWxsYmFjazogTW9kZUhhbmRsZXIgPT4gVCwgcmVzdWx0RXZhbDogPyhUKSA9PiBib29sZWFuID0gbnVsbCk6IFQge1xuICAgIGxldCByZXN1bHQ6IFQ7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaGFuZGxlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHJlc3VsdCA9IGNhbGxiYWNrKHRoaXMuaGFuZGxlcnNbaV0pO1xuICAgICAgaWYgKHJlc3VsdEV2YWwgPyByZXN1bHRFdmFsKHJlc3VsdCkgOiByZXN1bHQpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIChyZXN1bHQ6IGFueSk7XG4gIH1cblxuICBzZXRGZWF0dXJlQ29sbGVjdGlvbihmZWF0dXJlQ29sbGVjdGlvbjogRmVhdHVyZUNvbGxlY3Rpb24pOiB2b2lkIHtcbiAgICB0aGlzLmhhbmRsZXJzLmZvckVhY2goaGFuZGxlciA9PiBoYW5kbGVyLnNldEZlYXR1cmVDb2xsZWN0aW9uKGZlYXR1cmVDb2xsZWN0aW9uKSk7XG4gIH1cblxuICBzZXRNb2RlQ29uZmlnKG1vZGVDb25maWc6IGFueSk6IHZvaWQge1xuICAgIHRoaXMuaGFuZGxlcnMuZm9yRWFjaChoYW5kbGVyID0+IGhhbmRsZXIuc2V0TW9kZUNvbmZpZyhtb2RlQ29uZmlnKSk7XG4gIH1cblxuICBzZXRTZWxlY3RlZEZlYXR1cmVJbmRleGVzKGluZGV4ZXM6IG51bWJlcltdKTogdm9pZCB7XG4gICAgdGhpcy5oYW5kbGVycy5mb3JFYWNoKGhhbmRsZXIgPT4gaGFuZGxlci5zZXRTZWxlY3RlZEZlYXR1cmVJbmRleGVzKGluZGV4ZXMpKTtcbiAgfVxuXG4gIGhhbmRsZUNsaWNrKGV2ZW50OiBDbGlja0V2ZW50KTogP0VkaXRBY3Rpb24ge1xuICAgIHJldHVybiB0aGlzLl9jb2FsZXNjZShoYW5kbGVyID0+IGhhbmRsZXIuaGFuZGxlQ2xpY2soZXZlbnQpKTtcbiAgfVxuXG4gIGhhbmRsZVBvaW50ZXJNb3ZlKGV2ZW50OiBQb2ludGVyTW92ZUV2ZW50KTogeyBlZGl0QWN0aW9uOiA/RWRpdEFjdGlvbiwgY2FuY2VsTWFwUGFuOiBib29sZWFuIH0ge1xuICAgIHJldHVybiB0aGlzLl9jb2FsZXNjZShcbiAgICAgIGhhbmRsZXIgPT4gaGFuZGxlci5oYW5kbGVQb2ludGVyTW92ZShldmVudCksXG4gICAgICByZXN1bHQgPT4gcmVzdWx0ICYmIEJvb2xlYW4ocmVzdWx0LmVkaXRBY3Rpb24pXG4gICAgKTtcbiAgfVxuXG4gIGhhbmRsZVN0YXJ0RHJhZ2dpbmcoZXZlbnQ6IFN0YXJ0RHJhZ2dpbmdFdmVudCk6ID9FZGl0QWN0aW9uIHtcbiAgICByZXR1cm4gdGhpcy5fY29hbGVzY2UoaGFuZGxlciA9PiBoYW5kbGVyLmhhbmRsZVN0YXJ0RHJhZ2dpbmcoZXZlbnQpKTtcbiAgfVxuXG4gIGhhbmRsZVN0b3BEcmFnZ2luZyhldmVudDogU3RvcERyYWdnaW5nRXZlbnQpOiA/RWRpdEFjdGlvbiB7XG4gICAgcmV0dXJuIHRoaXMuX2NvYWxlc2NlKGhhbmRsZXIgPT4gaGFuZGxlci5oYW5kbGVTdG9wRHJhZ2dpbmcoZXZlbnQpKTtcbiAgfVxuXG4gIGdldFRlbnRhdGl2ZUZlYXR1cmUoKTogP0ZlYXR1cmUge1xuICAgIHJldHVybiB0aGlzLl9jb2FsZXNjZShoYW5kbGVyID0+IGhhbmRsZXIuZ2V0VGVudGF0aXZlRmVhdHVyZSgpKTtcbiAgfVxuXG4gIGdldEVkaXRIYW5kbGVzKHBpY2tzPzogQXJyYXk8T2JqZWN0PiwgZ3JvdW5kQ29vcmRzPzogUG9zaXRpb24pOiBFZGl0SGFuZGxlW10ge1xuICAgIC8vIFRPRE86IENvbWJpbmUgdGhlIGhhbmRsZXMgKkJVVCogbWFrZSBzdXJlIGlmIG5vbmUgb2YgdGhlIHJlc3VsdHMgaGF2ZVxuICAgIC8vIGNoYW5nZWQgdG8gcmV0dXJuIHRoZSBzYW1lIG9iamVjdCBzbyB0aGF0IFwiZWRpdEhhbmRsZXMgIT09IHRoaXMuc3RhdGUuZWRpdEhhbmRsZXNcIlxuICAgIC8vIGluIGVkaXRhYmxlLWdlb2pzb24tbGF5ZXIgd29ya3MuXG4gICAgcmV0dXJuIHRoaXMuX2NvYWxlc2NlKFxuICAgICAgaGFuZGxlciA9PiBoYW5kbGVyLmdldEVkaXRIYW5kbGVzKHBpY2tzLCBncm91bmRDb29yZHMpLFxuICAgICAgaGFuZGxlcyA9PiBBcnJheS5pc0FycmF5KGhhbmRsZXMpICYmIGhhbmRsZXMubGVuZ3RoID4gMFxuICAgICk7XG4gIH1cblxuICBnZXRDdXJzb3IoeyBpc0RyYWdnaW5nIH06IHsgaXNEcmFnZ2luZzogYm9vbGVhbiB9KTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fY29hbGVzY2UoaGFuZGxlciA9PiBoYW5kbGVyLmdldEN1cnNvcih7IGlzRHJhZ2dpbmcgfSkpO1xuICB9XG59XG4iXX0=