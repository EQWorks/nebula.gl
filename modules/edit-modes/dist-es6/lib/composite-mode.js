"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CompositeMode = void 0;

var _geojsonEditMode = require("./geojson-edit-mode.js");

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

var CompositeMode =
/*#__PURE__*/
function (_BaseGeoJsonEditMode) {
  _inherits(CompositeMode, _BaseGeoJsonEditMode);

  function CompositeMode(handlers) {
    var _this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, CompositeMode);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CompositeMode).call(this));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handlers", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "options", void 0);

    _this.handlers = handlers;
    _this.options = options;
    return _this;
  }

  _createClass(CompositeMode, [{
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
    key: "handleClick",
    value: function handleClick(event, props) {
      this._coalesce(function (handler) {
        return handler.handleClick(event, props);
      });
    }
  }, {
    key: "handlePointerMove",
    value: function handlePointerMove(event, props) {
      return this._coalesce(function (handler) {
        return handler.handlePointerMove(event, props);
      });
    }
  }, {
    key: "handleStartDragging",
    value: function handleStartDragging(event, props) {
      return this._coalesce(function (handler) {
        return handler.handleStartDragging(event, props);
      });
    }
  }, {
    key: "handleStopDragging",
    value: function handleStopDragging(event, props) {
      return this._coalesce(function (handler) {
        return handler.handleStopDragging(event, props);
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
    key: "getEditHandlesAdapter",
    value: function getEditHandlesAdapter(picks, mapCoords, props) {
      // TODO: Combine the handles *BUT* make sure if none of the results have
      // changed to return the same object so that "editHandles !== this.state.editHandles"
      // in editable-geojson-layer works.
      return this._coalesce(function (handler) {
        return handler.getEditHandlesAdapter(picks, mapCoords, props);
      }, function (handles) {
        return Array.isArray(handles) && handles.length > 0;
      });
    }
  }, {
    key: "getCursorAdapter",
    value: function getCursorAdapter(props) {
      return this._coalesce(function (handler) {
        return handler.getCursorAdapter(props);
      });
    }
  }]);

  return CompositeMode;
}(_geojsonEditMode.BaseGeoJsonEditMode);

exports.CompositeMode = CompositeMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvY29tcG9zaXRlLW1vZGUuanMiXSwibmFtZXMiOlsiQ29tcG9zaXRlTW9kZSIsImhhbmRsZXJzIiwib3B0aW9ucyIsImNhbGxiYWNrIiwicmVzdWx0RXZhbCIsInJlc3VsdCIsImkiLCJsZW5ndGgiLCJldmVudCIsInByb3BzIiwiX2NvYWxlc2NlIiwiaGFuZGxlciIsImhhbmRsZUNsaWNrIiwiaGFuZGxlUG9pbnRlck1vdmUiLCJoYW5kbGVTdGFydERyYWdnaW5nIiwiaGFuZGxlU3RvcERyYWdnaW5nIiwiZ2V0VGVudGF0aXZlRmVhdHVyZSIsInBpY2tzIiwibWFwQ29vcmRzIiwiZ2V0RWRpdEhhbmRsZXNBZGFwdGVyIiwiaGFuZGxlcyIsIkFycmF5IiwiaXNBcnJheSIsImdldEN1cnNvckFkYXB0ZXIiLCJCYXNlR2VvSnNvbkVkaXRNb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBVUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFFYUEsYTs7Ozs7QUFJWCx5QkFBWUMsUUFBWixFQUF3RTtBQUFBOztBQUFBLFFBQXRCQyxPQUFzQix1RUFBSixFQUFJOztBQUFBOztBQUN0RTs7QUFEc0U7O0FBQUE7O0FBRXRFLFVBQUtELFFBQUwsR0FBZ0JBLFFBQWhCO0FBQ0EsVUFBS0MsT0FBTCxHQUFlQSxPQUFmO0FBSHNFO0FBSXZFOzs7OzhCQUVZQyxRLEVBQTJFO0FBQUEsVUFBdkNDLFVBQXVDLHVFQUFULElBQVM7QUFDdEYsVUFBSUMsTUFBSjs7QUFFQSxXQUFLLElBQUlDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUcsS0FBS0wsUUFBTCxDQUFjTSxNQUFsQyxFQUEwQ0QsQ0FBQyxFQUEzQyxFQUErQztBQUM3Q0QsUUFBQUEsTUFBTSxHQUFHRixRQUFRLENBQUMsS0FBS0YsUUFBTCxDQUFjSyxDQUFkLENBQUQsQ0FBakI7O0FBQ0EsWUFBSUYsVUFBVSxHQUFHQSxVQUFVLENBQUNDLE1BQUQsQ0FBYixHQUF3QkEsTUFBdEMsRUFBOEM7QUFDNUM7QUFDRDtBQUNGOztBQUVELGFBQVFBLE1BQVI7QUFDRDs7O2dDQUVXRyxLLEVBQW1CQyxLLEVBQTJDO0FBQ3hFLFdBQUtDLFNBQUwsQ0FBZSxVQUFBQyxPQUFPO0FBQUEsZUFBSUEsT0FBTyxDQUFDQyxXQUFSLENBQW9CSixLQUFwQixFQUEyQkMsS0FBM0IsQ0FBSjtBQUFBLE9BQXRCO0FBQ0Q7OztzQ0FFaUJELEssRUFBeUJDLEssRUFBMkM7QUFDcEYsYUFBTyxLQUFLQyxTQUFMLENBQWUsVUFBQUMsT0FBTztBQUFBLGVBQUlBLE9BQU8sQ0FBQ0UsaUJBQVIsQ0FBMEJMLEtBQTFCLEVBQWlDQyxLQUFqQyxDQUFKO0FBQUEsT0FBdEIsQ0FBUDtBQUNEOzs7d0NBRW1CRCxLLEVBQTJCQyxLLEVBQTJDO0FBQ3hGLGFBQU8sS0FBS0MsU0FBTCxDQUFlLFVBQUFDLE9BQU87QUFBQSxlQUFJQSxPQUFPLENBQUNHLG1CQUFSLENBQTRCTixLQUE1QixFQUFtQ0MsS0FBbkMsQ0FBSjtBQUFBLE9BQXRCLENBQVA7QUFDRDs7O3VDQUVrQkQsSyxFQUEwQkMsSyxFQUEyQztBQUN0RixhQUFPLEtBQUtDLFNBQUwsQ0FBZSxVQUFBQyxPQUFPO0FBQUEsZUFBSUEsT0FBTyxDQUFDSSxrQkFBUixDQUEyQlAsS0FBM0IsRUFBa0NDLEtBQWxDLENBQUo7QUFBQSxPQUF0QixDQUFQO0FBQ0Q7OzswQ0FFK0I7QUFDOUIsYUFBTyxLQUFLQyxTQUFMLENBQWUsVUFBQUMsT0FBTztBQUFBLGVBQUlBLE9BQU8sQ0FBQ0ssbUJBQVIsRUFBSjtBQUFBLE9BQXRCLENBQVA7QUFDRDs7OzBDQUdDQyxLLEVBQ0FDLFMsRUFDQVQsSyxFQUNjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0EsYUFBTyxLQUFLQyxTQUFMLENBQ0wsVUFBQUMsT0FBTztBQUFBLGVBQUlBLE9BQU8sQ0FBQ1EscUJBQVIsQ0FBOEJGLEtBQTlCLEVBQXFDQyxTQUFyQyxFQUFnRFQsS0FBaEQsQ0FBSjtBQUFBLE9BREYsRUFFTCxVQUFBVyxPQUFPO0FBQUEsZUFBSUMsS0FBSyxDQUFDQyxPQUFOLENBQWNGLE9BQWQsS0FBMEJBLE9BQU8sQ0FBQ2IsTUFBUixHQUFpQixDQUEvQztBQUFBLE9BRkYsQ0FBUDtBQUlEOzs7cUNBRWdCRSxLLEVBQThDO0FBQzdELGFBQU8sS0FBS0MsU0FBTCxDQUFlLFVBQUFDLE9BQU87QUFBQSxlQUFJQSxPQUFPLENBQUNZLGdCQUFSLENBQXlCZCxLQUF6QixDQUFKO0FBQUEsT0FBdEIsQ0FBUDtBQUNEOzs7O0VBM0RnQ2Usb0MiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuXG5pbXBvcnQgdHlwZSB7IEZlYXR1cmVDb2xsZWN0aW9uLCBGZWF0dXJlLCBQb3NpdGlvbiB9IGZyb20gJy4uL2dlb2pzb24tdHlwZXMuanMnO1xuaW1wb3J0IHR5cGUge1xuICBNb2RlUHJvcHMsXG4gIENsaWNrRXZlbnQsXG4gIFBvaW50ZXJNb3ZlRXZlbnQsXG4gIFN0YXJ0RHJhZ2dpbmdFdmVudCxcbiAgU3RvcERyYWdnaW5nRXZlbnRcbn0gZnJvbSAnLi4vdHlwZXMuanMnO1xuaW1wb3J0IHsgQmFzZUdlb0pzb25FZGl0TW9kZSwgdHlwZSBFZGl0SGFuZGxlIH0gZnJvbSAnLi9nZW9qc29uLWVkaXQtbW9kZS5qcyc7XG5cbmV4cG9ydCBjbGFzcyBDb21wb3NpdGVNb2RlIGV4dGVuZHMgQmFzZUdlb0pzb25FZGl0TW9kZSB7XG4gIGhhbmRsZXJzOiBBcnJheTxCYXNlR2VvSnNvbkVkaXRNb2RlPjtcbiAgb3B0aW9uczogT2JqZWN0O1xuXG4gIGNvbnN0cnVjdG9yKGhhbmRsZXJzOiBBcnJheTxCYXNlR2VvSnNvbkVkaXRNb2RlPiwgb3B0aW9uczogT2JqZWN0ID0ge30pIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuaGFuZGxlcnMgPSBoYW5kbGVycztcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICB9XG5cbiAgX2NvYWxlc2NlPFQ+KGNhbGxiYWNrOiBCYXNlR2VvSnNvbkVkaXRNb2RlID0+IFQsIHJlc3VsdEV2YWw6ID8oVCkgPT4gYm9vbGVhbiA9IG51bGwpOiBUIHtcbiAgICBsZXQgcmVzdWx0OiBUO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmhhbmRsZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICByZXN1bHQgPSBjYWxsYmFjayh0aGlzLmhhbmRsZXJzW2ldKTtcbiAgICAgIGlmIChyZXN1bHRFdmFsID8gcmVzdWx0RXZhbChyZXN1bHQpIDogcmVzdWx0KSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAocmVzdWx0OiBhbnkpO1xuICB9XG5cbiAgaGFuZGxlQ2xpY2soZXZlbnQ6IENsaWNrRXZlbnQsIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KTogdm9pZCB7XG4gICAgdGhpcy5fY29hbGVzY2UoaGFuZGxlciA9PiBoYW5kbGVyLmhhbmRsZUNsaWNrKGV2ZW50LCBwcm9wcykpO1xuICB9XG5cbiAgaGFuZGxlUG9pbnRlck1vdmUoZXZlbnQ6IFBvaW50ZXJNb3ZlRXZlbnQsIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KTogdm9pZCB7XG4gICAgcmV0dXJuIHRoaXMuX2NvYWxlc2NlKGhhbmRsZXIgPT4gaGFuZGxlci5oYW5kbGVQb2ludGVyTW92ZShldmVudCwgcHJvcHMpKTtcbiAgfVxuXG4gIGhhbmRsZVN0YXJ0RHJhZ2dpbmcoZXZlbnQ6IFN0YXJ0RHJhZ2dpbmdFdmVudCwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pOiB2b2lkIHtcbiAgICByZXR1cm4gdGhpcy5fY29hbGVzY2UoaGFuZGxlciA9PiBoYW5kbGVyLmhhbmRsZVN0YXJ0RHJhZ2dpbmcoZXZlbnQsIHByb3BzKSk7XG4gIH1cblxuICBoYW5kbGVTdG9wRHJhZ2dpbmcoZXZlbnQ6IFN0b3BEcmFnZ2luZ0V2ZW50LCBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPik6IHZvaWQge1xuICAgIHJldHVybiB0aGlzLl9jb2FsZXNjZShoYW5kbGVyID0+IGhhbmRsZXIuaGFuZGxlU3RvcERyYWdnaW5nKGV2ZW50LCBwcm9wcykpO1xuICB9XG5cbiAgZ2V0VGVudGF0aXZlRmVhdHVyZSgpOiA/RmVhdHVyZSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvYWxlc2NlKGhhbmRsZXIgPT4gaGFuZGxlci5nZXRUZW50YXRpdmVGZWF0dXJlKCkpO1xuICB9XG5cbiAgZ2V0RWRpdEhhbmRsZXNBZGFwdGVyKFxuICAgIHBpY2tzOiA/QXJyYXk8T2JqZWN0PixcbiAgICBtYXBDb29yZHM6ID9Qb3NpdGlvbixcbiAgICBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPlxuICApOiBFZGl0SGFuZGxlW10ge1xuICAgIC8vIFRPRE86IENvbWJpbmUgdGhlIGhhbmRsZXMgKkJVVCogbWFrZSBzdXJlIGlmIG5vbmUgb2YgdGhlIHJlc3VsdHMgaGF2ZVxuICAgIC8vIGNoYW5nZWQgdG8gcmV0dXJuIHRoZSBzYW1lIG9iamVjdCBzbyB0aGF0IFwiZWRpdEhhbmRsZXMgIT09IHRoaXMuc3RhdGUuZWRpdEhhbmRsZXNcIlxuICAgIC8vIGluIGVkaXRhYmxlLWdlb2pzb24tbGF5ZXIgd29ya3MuXG4gICAgcmV0dXJuIHRoaXMuX2NvYWxlc2NlKFxuICAgICAgaGFuZGxlciA9PiBoYW5kbGVyLmdldEVkaXRIYW5kbGVzQWRhcHRlcihwaWNrcywgbWFwQ29vcmRzLCBwcm9wcyksXG4gICAgICBoYW5kbGVzID0+IEFycmF5LmlzQXJyYXkoaGFuZGxlcykgJiYgaGFuZGxlcy5sZW5ndGggPiAwXG4gICAgKTtcbiAgfVxuXG4gIGdldEN1cnNvckFkYXB0ZXIocHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pOiA/c3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fY29hbGVzY2UoaGFuZGxlciA9PiBoYW5kbGVyLmdldEN1cnNvckFkYXB0ZXIocHJvcHMpKTtcbiAgfVxufVxuIl19