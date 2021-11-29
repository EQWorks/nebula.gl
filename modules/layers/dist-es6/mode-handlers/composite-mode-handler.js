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

// TODO edit-modes: delete handlers once EditMode fully implemented
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL2NvbXBvc2l0ZS1tb2RlLWhhbmRsZXIuanMiXSwibmFtZXMiOlsiQ29tcG9zaXRlTW9kZUhhbmRsZXIiLCJoYW5kbGVycyIsIm9wdGlvbnMiLCJjYWxsYmFjayIsInJlc3VsdEV2YWwiLCJyZXN1bHQiLCJpIiwibGVuZ3RoIiwiZmVhdHVyZUNvbGxlY3Rpb24iLCJmb3JFYWNoIiwiaGFuZGxlciIsInNldEZlYXR1cmVDb2xsZWN0aW9uIiwibW9kZUNvbmZpZyIsInNldE1vZGVDb25maWciLCJpbmRleGVzIiwic2V0U2VsZWN0ZWRGZWF0dXJlSW5kZXhlcyIsImV2ZW50IiwiX2NvYWxlc2NlIiwiaGFuZGxlQ2xpY2siLCJoYW5kbGVQb2ludGVyTW92ZSIsIkJvb2xlYW4iLCJlZGl0QWN0aW9uIiwiaGFuZGxlU3RhcnREcmFnZ2luZyIsImhhbmRsZVN0b3BEcmFnZ2luZyIsImdldFRlbnRhdGl2ZUZlYXR1cmUiLCJwaWNrcyIsImdyb3VuZENvb3JkcyIsImdldEVkaXRIYW5kbGVzIiwiaGFuZGxlcyIsIkFycmF5IiwiaXNBcnJheSIsImlzRHJhZ2dpbmciLCJnZXRDdXJzb3IiLCJNb2RlSGFuZGxlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQVNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7SUFDYUEsb0I7Ozs7O0FBSVgsZ0NBQVlDLFFBQVosRUFBZ0U7QUFBQTs7QUFBQSxRQUF0QkMsT0FBc0IsdUVBQUosRUFBSTs7QUFBQTs7QUFDOUQ7O0FBRDhEOztBQUFBOztBQUU5RCxVQUFLRCxRQUFMLEdBQWdCQSxRQUFoQjtBQUNBLFVBQUtDLE9BQUwsR0FBZUEsT0FBZjtBQUg4RDtBQUkvRDs7Ozs4QkFFWUMsUSxFQUFtRTtBQUFBLFVBQXZDQyxVQUF1Qyx1RUFBVCxJQUFTO0FBQzlFLFVBQUlDLE1BQUo7O0FBRUEsV0FBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHLEtBQUtMLFFBQUwsQ0FBY00sTUFBbEMsRUFBMENELENBQUMsRUFBM0MsRUFBK0M7QUFDN0NELFFBQUFBLE1BQU0sR0FBR0YsUUFBUSxDQUFDLEtBQUtGLFFBQUwsQ0FBY0ssQ0FBZCxDQUFELENBQWpCOztBQUNBLFlBQUlGLFVBQVUsR0FBR0EsVUFBVSxDQUFDQyxNQUFELENBQWIsR0FBd0JBLE1BQXRDLEVBQThDO0FBQzVDO0FBQ0Q7QUFDRjs7QUFFRCxhQUFRQSxNQUFSO0FBQ0Q7Ozt5Q0FFb0JHLGlCLEVBQTRDO0FBQy9ELFdBQUtQLFFBQUwsQ0FBY1EsT0FBZCxDQUFzQixVQUFBQyxPQUFPO0FBQUEsZUFBSUEsT0FBTyxDQUFDQyxvQkFBUixDQUE2QkgsaUJBQTdCLENBQUo7QUFBQSxPQUE3QjtBQUNEOzs7a0NBRWFJLFUsRUFBdUI7QUFDbkMsV0FBS1gsUUFBTCxDQUFjUSxPQUFkLENBQXNCLFVBQUFDLE9BQU87QUFBQSxlQUFJQSxPQUFPLENBQUNHLGFBQVIsQ0FBc0JELFVBQXRCLENBQUo7QUFBQSxPQUE3QjtBQUNEOzs7OENBRXlCRSxPLEVBQXlCO0FBQ2pELFdBQUtiLFFBQUwsQ0FBY1EsT0FBZCxDQUFzQixVQUFBQyxPQUFPO0FBQUEsZUFBSUEsT0FBTyxDQUFDSyx5QkFBUixDQUFrQ0QsT0FBbEMsQ0FBSjtBQUFBLE9BQTdCO0FBQ0Q7OztnQ0FFV0UsSyxFQUFnQztBQUMxQyxhQUFPLEtBQUtDLFNBQUwsQ0FBZSxVQUFBUCxPQUFPO0FBQUEsZUFBSUEsT0FBTyxDQUFDUSxXQUFSLENBQW9CRixLQUFwQixDQUFKO0FBQUEsT0FBdEIsQ0FBUDtBQUNEOzs7c0NBRWlCQSxLLEVBQTZFO0FBQzdGLGFBQU8sS0FBS0MsU0FBTCxDQUNMLFVBQUFQLE9BQU87QUFBQSxlQUFJQSxPQUFPLENBQUNTLGlCQUFSLENBQTBCSCxLQUExQixDQUFKO0FBQUEsT0FERixFQUVMLFVBQUFYLE1BQU07QUFBQSxlQUFJQSxNQUFNLElBQUllLE9BQU8sQ0FBQ2YsTUFBTSxDQUFDZ0IsVUFBUixDQUFyQjtBQUFBLE9BRkQsQ0FBUDtBQUlEOzs7d0NBRW1CTCxLLEVBQXdDO0FBQzFELGFBQU8sS0FBS0MsU0FBTCxDQUFlLFVBQUFQLE9BQU87QUFBQSxlQUFJQSxPQUFPLENBQUNZLG1CQUFSLENBQTRCTixLQUE1QixDQUFKO0FBQUEsT0FBdEIsQ0FBUDtBQUNEOzs7dUNBRWtCQSxLLEVBQXVDO0FBQ3hELGFBQU8sS0FBS0MsU0FBTCxDQUFlLFVBQUFQLE9BQU87QUFBQSxlQUFJQSxPQUFPLENBQUNhLGtCQUFSLENBQTJCUCxLQUEzQixDQUFKO0FBQUEsT0FBdEIsQ0FBUDtBQUNEOzs7MENBRStCO0FBQzlCLGFBQU8sS0FBS0MsU0FBTCxDQUFlLFVBQUFQLE9BQU87QUFBQSxlQUFJQSxPQUFPLENBQUNjLG1CQUFSLEVBQUo7QUFBQSxPQUF0QixDQUFQO0FBQ0Q7OzttQ0FFY0MsSyxFQUF1QkMsWSxFQUF1QztBQUMzRTtBQUNBO0FBQ0E7QUFDQSxhQUFPLEtBQUtULFNBQUwsQ0FDTCxVQUFBUCxPQUFPO0FBQUEsZUFBSUEsT0FBTyxDQUFDaUIsY0FBUixDQUF1QkYsS0FBdkIsRUFBOEJDLFlBQTlCLENBQUo7QUFBQSxPQURGLEVBRUwsVUFBQUUsT0FBTztBQUFBLGVBQUlDLEtBQUssQ0FBQ0MsT0FBTixDQUFjRixPQUFkLEtBQTBCQSxPQUFPLENBQUNyQixNQUFSLEdBQWlCLENBQS9DO0FBQUEsT0FGRixDQUFQO0FBSUQ7OztvQ0FFMEQ7QUFBQSxVQUEvQ3dCLFVBQStDLFFBQS9DQSxVQUErQztBQUN6RCxhQUFPLEtBQUtkLFNBQUwsQ0FBZSxVQUFBUCxPQUFPO0FBQUEsZUFBSUEsT0FBTyxDQUFDc0IsU0FBUixDQUFrQjtBQUFFRCxVQUFBQSxVQUFVLEVBQVZBO0FBQUYsU0FBbEIsQ0FBSjtBQUFBLE9BQXRCLENBQVA7QUFDRDs7OztFQXRFdUNFLHdCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuaW1wb3J0IHR5cGUgeyBGZWF0dXJlQ29sbGVjdGlvbiwgRmVhdHVyZSwgUG9zaXRpb24gfSBmcm9tICdrZXBsZXItb3V0ZGF0ZWQtbmVidWxhLmdsLWVkaXQtbW9kZXMnO1xuaW1wb3J0IHR5cGUge1xuICBDbGlja0V2ZW50LFxuICBQb2ludGVyTW92ZUV2ZW50LFxuICBTdGFydERyYWdnaW5nRXZlbnQsXG4gIFN0b3BEcmFnZ2luZ0V2ZW50XG59IGZyb20gJy4uL2V2ZW50LXR5cGVzLmpzJztcbmltcG9ydCB7IE1vZGVIYW5kbGVyLCB0eXBlIEVkaXRBY3Rpb24sIHR5cGUgRWRpdEhhbmRsZSB9IGZyb20gJy4vbW9kZS1oYW5kbGVyLmpzJztcblxuLy8gVE9ETyBlZGl0LW1vZGVzOiBkZWxldGUgaGFuZGxlcnMgb25jZSBFZGl0TW9kZSBmdWxseSBpbXBsZW1lbnRlZFxuZXhwb3J0IGNsYXNzIENvbXBvc2l0ZU1vZGVIYW5kbGVyIGV4dGVuZHMgTW9kZUhhbmRsZXIge1xuICBoYW5kbGVyczogQXJyYXk8TW9kZUhhbmRsZXI+O1xuICBvcHRpb25zOiBPYmplY3Q7XG5cbiAgY29uc3RydWN0b3IoaGFuZGxlcnM6IEFycmF5PE1vZGVIYW5kbGVyPiwgb3B0aW9uczogT2JqZWN0ID0ge30pIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuaGFuZGxlcnMgPSBoYW5kbGVycztcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICB9XG5cbiAgX2NvYWxlc2NlPFQ+KGNhbGxiYWNrOiBNb2RlSGFuZGxlciA9PiBULCByZXN1bHRFdmFsOiA/KFQpID0+IGJvb2xlYW4gPSBudWxsKTogVCB7XG4gICAgbGV0IHJlc3VsdDogVDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5oYW5kbGVycy5sZW5ndGg7IGkrKykge1xuICAgICAgcmVzdWx0ID0gY2FsbGJhY2sodGhpcy5oYW5kbGVyc1tpXSk7XG4gICAgICBpZiAocmVzdWx0RXZhbCA/IHJlc3VsdEV2YWwocmVzdWx0KSA6IHJlc3VsdCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gKHJlc3VsdDogYW55KTtcbiAgfVxuXG4gIHNldEZlYXR1cmVDb2xsZWN0aW9uKGZlYXR1cmVDb2xsZWN0aW9uOiBGZWF0dXJlQ29sbGVjdGlvbik6IHZvaWQge1xuICAgIHRoaXMuaGFuZGxlcnMuZm9yRWFjaChoYW5kbGVyID0+IGhhbmRsZXIuc2V0RmVhdHVyZUNvbGxlY3Rpb24oZmVhdHVyZUNvbGxlY3Rpb24pKTtcbiAgfVxuXG4gIHNldE1vZGVDb25maWcobW9kZUNvbmZpZzogYW55KTogdm9pZCB7XG4gICAgdGhpcy5oYW5kbGVycy5mb3JFYWNoKGhhbmRsZXIgPT4gaGFuZGxlci5zZXRNb2RlQ29uZmlnKG1vZGVDb25maWcpKTtcbiAgfVxuXG4gIHNldFNlbGVjdGVkRmVhdHVyZUluZGV4ZXMoaW5kZXhlczogbnVtYmVyW10pOiB2b2lkIHtcbiAgICB0aGlzLmhhbmRsZXJzLmZvckVhY2goaGFuZGxlciA9PiBoYW5kbGVyLnNldFNlbGVjdGVkRmVhdHVyZUluZGV4ZXMoaW5kZXhlcykpO1xuICB9XG5cbiAgaGFuZGxlQ2xpY2soZXZlbnQ6IENsaWNrRXZlbnQpOiA/RWRpdEFjdGlvbiB7XG4gICAgcmV0dXJuIHRoaXMuX2NvYWxlc2NlKGhhbmRsZXIgPT4gaGFuZGxlci5oYW5kbGVDbGljayhldmVudCkpO1xuICB9XG5cbiAgaGFuZGxlUG9pbnRlck1vdmUoZXZlbnQ6IFBvaW50ZXJNb3ZlRXZlbnQpOiB7IGVkaXRBY3Rpb246ID9FZGl0QWN0aW9uLCBjYW5jZWxNYXBQYW46IGJvb2xlYW4gfSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvYWxlc2NlKFxuICAgICAgaGFuZGxlciA9PiBoYW5kbGVyLmhhbmRsZVBvaW50ZXJNb3ZlKGV2ZW50KSxcbiAgICAgIHJlc3VsdCA9PiByZXN1bHQgJiYgQm9vbGVhbihyZXN1bHQuZWRpdEFjdGlvbilcbiAgICApO1xuICB9XG5cbiAgaGFuZGxlU3RhcnREcmFnZ2luZyhldmVudDogU3RhcnREcmFnZ2luZ0V2ZW50KTogP0VkaXRBY3Rpb24ge1xuICAgIHJldHVybiB0aGlzLl9jb2FsZXNjZShoYW5kbGVyID0+IGhhbmRsZXIuaGFuZGxlU3RhcnREcmFnZ2luZyhldmVudCkpO1xuICB9XG5cbiAgaGFuZGxlU3RvcERyYWdnaW5nKGV2ZW50OiBTdG9wRHJhZ2dpbmdFdmVudCk6ID9FZGl0QWN0aW9uIHtcbiAgICByZXR1cm4gdGhpcy5fY29hbGVzY2UoaGFuZGxlciA9PiBoYW5kbGVyLmhhbmRsZVN0b3BEcmFnZ2luZyhldmVudCkpO1xuICB9XG5cbiAgZ2V0VGVudGF0aXZlRmVhdHVyZSgpOiA/RmVhdHVyZSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvYWxlc2NlKGhhbmRsZXIgPT4gaGFuZGxlci5nZXRUZW50YXRpdmVGZWF0dXJlKCkpO1xuICB9XG5cbiAgZ2V0RWRpdEhhbmRsZXMocGlja3M/OiBBcnJheTxPYmplY3Q+LCBncm91bmRDb29yZHM/OiBQb3NpdGlvbik6IEVkaXRIYW5kbGVbXSB7XG4gICAgLy8gVE9ETzogQ29tYmluZSB0aGUgaGFuZGxlcyAqQlVUKiBtYWtlIHN1cmUgaWYgbm9uZSBvZiB0aGUgcmVzdWx0cyBoYXZlXG4gICAgLy8gY2hhbmdlZCB0byByZXR1cm4gdGhlIHNhbWUgb2JqZWN0IHNvIHRoYXQgXCJlZGl0SGFuZGxlcyAhPT0gdGhpcy5zdGF0ZS5lZGl0SGFuZGxlc1wiXG4gICAgLy8gaW4gZWRpdGFibGUtZ2VvanNvbi1sYXllciB3b3Jrcy5cbiAgICByZXR1cm4gdGhpcy5fY29hbGVzY2UoXG4gICAgICBoYW5kbGVyID0+IGhhbmRsZXIuZ2V0RWRpdEhhbmRsZXMocGlja3MsIGdyb3VuZENvb3JkcyksXG4gICAgICBoYW5kbGVzID0+IEFycmF5LmlzQXJyYXkoaGFuZGxlcykgJiYgaGFuZGxlcy5sZW5ndGggPiAwXG4gICAgKTtcbiAgfVxuXG4gIGdldEN1cnNvcih7IGlzRHJhZ2dpbmcgfTogeyBpc0RyYWdnaW5nOiBib29sZWFuIH0pOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9jb2FsZXNjZShoYW5kbGVyID0+IGhhbmRsZXIuZ2V0Q3Vyc29yKHsgaXNEcmFnZ2luZyB9KSk7XG4gIH1cbn1cbiJdfQ==