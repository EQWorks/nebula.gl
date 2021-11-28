"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _keplerOudatedDeck = require("kepler-oudated-deck.gl-core");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

// Minimum number of pixels the pointer must move from the original pointer down to be considered dragging
var MINIMUM_POINTER_MOVE_THRESHOLD_PIXELS = 7; // eslint-disable-next-line camelcase

var EditableLayer_EDIT_MODE_POC =
/*#__PURE__*/
function (_CompositeLayer) {
  _inherits(EditableLayer_EDIT_MODE_POC, _CompositeLayer);

  function EditableLayer_EDIT_MODE_POC() {
    _classCallCheck(this, EditableLayer_EDIT_MODE_POC);

    return _possibleConstructorReturn(this, _getPrototypeOf(EditableLayer_EDIT_MODE_POC).apply(this, arguments));
  }

  _createClass(EditableLayer_EDIT_MODE_POC, [{
    key: "onLayerClick",
    // Overridable interaction event handlers
    value: function onLayerClick(event) {// default implementation - do nothing
    }
  }, {
    key: "onDoubleClick",
    value: function onDoubleClick(event) {// default implementation - do nothing
    }
  }, {
    key: "onStartDragging",
    value: function onStartDragging(event) {// default implementation - do nothing
    }
  }, {
    key: "onStopDragging",
    value: function onStopDragging(event) {// default implementation - do nothing
    }
  }, {
    key: "onPointerMove",
    value: function onPointerMove(event) {} // default implementation - do nothing
    // TODO: implement onCancelDragging (e.g. drag off screen)

  }, {
    key: "initializeState",
    value: function initializeState() {
      this.setState({
        _editableLayerState: {
          // Pointer event handlers
          pointerHandlers: null,
          // Picked objects at the time the pointer went down
          pointerDownPicks: null,
          // Screen coordinates where the pointer went down
          pointerDownScreenCoords: null,
          // Ground coordinates where the pointer went down
          pointerDownMapCoords: null,
          // Is the pointer dragging (pointer down + moved at least MINIMUM_POINTER_MOVE_THRESHOLD_PIXELS)
          isDragging: false
        }
      });
    }
  }, {
    key: "finalizeState",
    value: function finalizeState() {
      this._removePointerHandlers();
    }
  }, {
    key: "updateState",
    value: function updateState(_ref) {
      var props = _ref.props,
          changeFlags = _ref.changeFlags;

      // unsubscribe previous layer instance's handlers
      this._removePointerHandlers();

      this._addPointerHandlers();
    }
  }, {
    key: "_removePointerHandlers",
    value: function _removePointerHandlers() {
      if (this.state._editableLayerState.pointerHandlers) {
        this.context.gl.canvas.removeEventListener('pointermove', this.state._editableLayerState.pointerHandlers.onPointerMove);
        this.context.gl.canvas.removeEventListener('pointerdown', this.state._editableLayerState.pointerHandlers.onPointerDown);
        this.context.gl.canvas.removeEventListener('pointerup', this.state._editableLayerState.pointerHandlers.onPointerUp);
        this.context.gl.canvas.removeEventListener('dblclick', this.state._editableLayerState.pointerHandlers.onDoubleClick);
      }

      this.state._editableLayerState.pointerHandlers = null;
    }
  }, {
    key: "_addPointerHandlers",
    value: function _addPointerHandlers() {
      this.state._editableLayerState.pointerHandlers = {
        onPointerMove: this._onPointerMove.bind(this),
        onPointerDown: this._onPointerDown.bind(this),
        onPointerUp: this._onPointerUp.bind(this),
        onDoubleClick: this._onDoubleClick.bind(this)
      };
      this.context.gl.canvas.addEventListener('pointermove', this.state._editableLayerState.pointerHandlers.onPointerMove);
      this.context.gl.canvas.addEventListener('pointerdown', this.state._editableLayerState.pointerHandlers.onPointerDown);
      this.context.gl.canvas.addEventListener('pointerup', this.state._editableLayerState.pointerHandlers.onPointerUp);
      this.context.gl.canvas.addEventListener('dblclick', this.state._editableLayerState.pointerHandlers.onDoubleClick);
    }
  }, {
    key: "_onDoubleClick",
    value: function _onDoubleClick(event) {
      var screenCoords = this.getScreenCoords(event);
      var mapCoords = this.getMapCoords(screenCoords);
      this.onDoubleClick({
        mapCoords: mapCoords,
        sourceEvent: event
      });
    }
  }, {
    key: "_onPointerDown",
    value: function _onPointerDown(event) {
      var screenCoords = this.getScreenCoords(event);
      var mapCoords = this.getMapCoords(screenCoords);
      var picks = this.context.deck.pickMultipleObjects({
        x: screenCoords[0],
        y: screenCoords[1],
        layerIds: [this.props.id],
        radius: this.props.pickingRadius || 10,
        depth: 2
      });
      this.setState({
        _editableLayerState: _objectSpread({}, this.state._editableLayerState, {
          pointerDownScreenCoords: screenCoords,
          pointerDownMapCoords: mapCoords,
          pointerDownPicks: picks,
          isDragging: false
        })
      });
    }
  }, {
    key: "_onPointerMove",
    value: function _onPointerMove(event) {
      var screenCoords = this.getScreenCoords(event);
      var mapCoords = this.getMapCoords(screenCoords);
      var _this$state$_editable = this.state._editableLayerState,
          pointerDownPicks = _this$state$_editable.pointerDownPicks,
          pointerDownScreenCoords = _this$state$_editable.pointerDownScreenCoords,
          pointerDownMapCoords = _this$state$_editable.pointerDownMapCoords;
      var isDragging = this.state._editableLayerState.isDragging;

      if (pointerDownScreenCoords) {
        // Pointer went down and is moving
        // Did it move enough to consider it a drag
        if (!isDragging && this.movedEnoughForDrag(pointerDownScreenCoords, screenCoords)) {
          // OK, this is considered dragging
          // Fire the start dragging event
          this.onStartDragging({
            picks: pointerDownPicks,
            screenCoords: screenCoords,
            mapCoords: mapCoords,
            pointerDownScreenCoords: pointerDownScreenCoords,
            pointerDownMapCoords: pointerDownMapCoords,
            sourceEvent: event
          });
          isDragging = true;
          this.setState({
            _editableLayerState: _objectSpread({}, this.state._editableLayerState, {
              isDragging: isDragging
            })
          });
        }
      }

      var picks = this.context.deck.pickMultipleObjects({
        x: screenCoords[0],
        y: screenCoords[1],
        layerIds: [this.props.id],
        radius: this.props.pickingRadius || 10,
        depth: 2
      });
      this.onPointerMove({
        screenCoords: screenCoords,
        mapCoords: mapCoords,
        picks: picks,
        isDragging: isDragging,
        pointerDownPicks: pointerDownPicks,
        pointerDownScreenCoords: pointerDownScreenCoords,
        pointerDownMapCoords: pointerDownMapCoords,
        sourceEvent: event
      });
    }
  }, {
    key: "_onPointerUp",
    value: function _onPointerUp(event) {
      var screenCoords = this.getScreenCoords(event);
      var mapCoords = this.getMapCoords(screenCoords);
      var _this$state$_editable2 = this.state._editableLayerState,
          pointerDownPicks = _this$state$_editable2.pointerDownPicks,
          pointerDownScreenCoords = _this$state$_editable2.pointerDownScreenCoords,
          pointerDownMapCoords = _this$state$_editable2.pointerDownMapCoords,
          isDragging = _this$state$_editable2.isDragging;

      if (!pointerDownScreenCoords) {
        // This is a pointer up without a pointer down (e.g. user pointer downed elsewhere), so ignore
        return;
      }

      if (isDragging) {
        this.onStopDragging({
          picks: pointerDownPicks,
          screenCoords: screenCoords,
          mapCoords: mapCoords,
          pointerDownScreenCoords: pointerDownScreenCoords,
          pointerDownMapCoords: pointerDownMapCoords,
          sourceEvent: event
        });
      } else if (!this.movedEnoughForDrag(pointerDownScreenCoords, screenCoords)) {
        this.onLayerClick({
          picks: pointerDownPicks,
          screenCoords: screenCoords,
          mapCoords: mapCoords,
          sourceEvent: event
        });
      }

      this.setState({
        _editableLayerState: _objectSpread({}, this.state._editableLayerState, {
          pointerDownScreenCoords: null,
          pointerDownMapCoords: null,
          pointerDownPicks: null,
          isDragging: false
        })
      });
    }
  }, {
    key: "getScreenCoords",
    value: function getScreenCoords(pointerEvent) {
      return [pointerEvent.clientX - this.context.gl.canvas.getBoundingClientRect().x, pointerEvent.clientY - this.context.gl.canvas.getBoundingClientRect().y];
    }
  }, {
    key: "getMapCoords",
    value: function getMapCoords(screenCoords) {
      return this.context.viewport.unproject([screenCoords[0], screenCoords[1]]);
    }
  }, {
    key: "movedEnoughForDrag",
    value: function movedEnoughForDrag(screenCoords1, screenCoords2) {
      return Math.abs(screenCoords1[0] - screenCoords2[0]) > MINIMUM_POINTER_MOVE_THRESHOLD_PIXELS || Math.abs(screenCoords1[1] - screenCoords2[1]) > MINIMUM_POINTER_MOVE_THRESHOLD_PIXELS;
    }
  }]);

  return EditableLayer_EDIT_MODE_POC;
}(_keplerOudatedDeck.CompositeLayer); // eslint-disable-next-line camelcase


exports.default = EditableLayer_EDIT_MODE_POC;
EditableLayer_EDIT_MODE_POC.layerName = 'EditableLayer_EDIT_MODE_POC';
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sYXllcnMvZWRpdGFibGUtbGF5ZXItZWRpdC1tb2RlLXBvYy5qcyJdLCJuYW1lcyI6WyJNSU5JTVVNX1BPSU5URVJfTU9WRV9USFJFU0hPTERfUElYRUxTIiwiRWRpdGFibGVMYXllcl9FRElUX01PREVfUE9DIiwiZXZlbnQiLCJzZXRTdGF0ZSIsIl9lZGl0YWJsZUxheWVyU3RhdGUiLCJwb2ludGVySGFuZGxlcnMiLCJwb2ludGVyRG93blBpY2tzIiwicG9pbnRlckRvd25TY3JlZW5Db29yZHMiLCJwb2ludGVyRG93bk1hcENvb3JkcyIsImlzRHJhZ2dpbmciLCJfcmVtb3ZlUG9pbnRlckhhbmRsZXJzIiwicHJvcHMiLCJjaGFuZ2VGbGFncyIsIl9hZGRQb2ludGVySGFuZGxlcnMiLCJzdGF0ZSIsImNvbnRleHQiLCJnbCIsImNhbnZhcyIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJvblBvaW50ZXJNb3ZlIiwib25Qb2ludGVyRG93biIsIm9uUG9pbnRlclVwIiwib25Eb3VibGVDbGljayIsIl9vblBvaW50ZXJNb3ZlIiwiYmluZCIsIl9vblBvaW50ZXJEb3duIiwiX29uUG9pbnRlclVwIiwiX29uRG91YmxlQ2xpY2siLCJhZGRFdmVudExpc3RlbmVyIiwic2NyZWVuQ29vcmRzIiwiZ2V0U2NyZWVuQ29vcmRzIiwibWFwQ29vcmRzIiwiZ2V0TWFwQ29vcmRzIiwic291cmNlRXZlbnQiLCJwaWNrcyIsImRlY2siLCJwaWNrTXVsdGlwbGVPYmplY3RzIiwieCIsInkiLCJsYXllcklkcyIsImlkIiwicmFkaXVzIiwicGlja2luZ1JhZGl1cyIsImRlcHRoIiwibW92ZWRFbm91Z2hGb3JEcmFnIiwib25TdGFydERyYWdnaW5nIiwib25TdG9wRHJhZ2dpbmciLCJvbkxheWVyQ2xpY2siLCJwb2ludGVyRXZlbnQiLCJjbGllbnRYIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiY2xpZW50WSIsInZpZXdwb3J0IiwidW5wcm9qZWN0Iiwic2NyZWVuQ29vcmRzMSIsInNjcmVlbkNvb3JkczIiLCJNYXRoIiwiYWJzIiwiQ29tcG9zaXRlTGF5ZXIiLCJsYXllck5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFHQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBU0E7QUFDQSxJQUFNQSxxQ0FBcUMsR0FBRyxDQUE5QyxDLENBRUE7O0lBQ3FCQywyQjs7Ozs7Ozs7Ozs7OztBQUNuQjtpQ0FDYUMsSyxFQUFtQixDQUM5QjtBQUNEOzs7a0NBRWFBLEssRUFBeUIsQ0FDckM7QUFDRDs7O29DQUVlQSxLLEVBQTJCLENBQ3pDO0FBQ0Q7OzttQ0FFY0EsSyxFQUEwQixDQUN2QztBQUNEOzs7a0NBRWFBLEssRUFBeUIsQ0FFdEMsQyxDQURDO0FBR0Y7Ozs7c0NBRWtCO0FBQ2hCLFdBQUtDLFFBQUwsQ0FBYztBQUNaQyxRQUFBQSxtQkFBbUIsRUFBRTtBQUNuQjtBQUNBQyxVQUFBQSxlQUFlLEVBQUUsSUFGRTtBQUduQjtBQUNBQyxVQUFBQSxnQkFBZ0IsRUFBRSxJQUpDO0FBS25CO0FBQ0FDLFVBQUFBLHVCQUF1QixFQUFFLElBTk47QUFPbkI7QUFDQUMsVUFBQUEsb0JBQW9CLEVBQUUsSUFSSDtBQVNuQjtBQUNBQyxVQUFBQSxVQUFVLEVBQUU7QUFWTztBQURULE9BQWQ7QUFjRDs7O29DQUVlO0FBQ2QsV0FBS0Msc0JBQUw7QUFDRDs7O3NDQUUyQztBQUFBLFVBQTlCQyxLQUE4QixRQUE5QkEsS0FBOEI7QUFBQSxVQUF2QkMsV0FBdUIsUUFBdkJBLFdBQXVCOztBQUMxQztBQUNBLFdBQUtGLHNCQUFMOztBQUNBLFdBQUtHLG1CQUFMO0FBQ0Q7Ozs2Q0FFd0I7QUFDdkIsVUFBSSxLQUFLQyxLQUFMLENBQVdWLG1CQUFYLENBQStCQyxlQUFuQyxFQUFvRDtBQUNsRCxhQUFLVSxPQUFMLENBQWFDLEVBQWIsQ0FBZ0JDLE1BQWhCLENBQXVCQyxtQkFBdkIsQ0FDRSxhQURGLEVBRUUsS0FBS0osS0FBTCxDQUFXVixtQkFBWCxDQUErQkMsZUFBL0IsQ0FBK0NjLGFBRmpE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TEs7QUFEUCxPQUFkO0FBU0Q7OztvQ0FFZXVDLFksRUFBc0I7QUFDcEMsYUFBTyxDQUNMQSxZQUFZLENBQUNDLE9BQWIsR0FBdUIsS0FBS2xDLE9BQUwsQ0FBYUMsRUFBYixDQUFnQkMsTUFBaEIsQ0FBdUJpQyxxQkFBdkIsR0FBK0NiLENBRGpFLEVBRUxXLFlBQVksQ0FBQ0csT0FBYixHQUF1QixLQUFLcEMsT0FBTCxDQUFhQyxFQUFiLENBQWdCQyxNQUFoQixDQUF1QmlDLHFCQUF2QixHQUErQ1osQ0FGakUsQ0FBUDtBQUlEOzs7aUNBRVlULFksRUFBd0I7QUFDbkMsYUFBTyxLQUFLZCxPQUFMLENBQWFxQyxRQUFiLENBQXNCQyxTQUF0QixDQUFnQyxDQUFDeEIsWUFBWSxDQUFDLENBQUQsQ0FBYixFQUFrQkEsWUFBWSxDQUFDLENBQUQsQ0FBOUIsQ0FBaEMsQ0FBUDtBQUNEOzs7dUNBRWtCeUIsYSxFQUF5QkMsYSxFQUF5QjtBQUNuRSxhQUNFQyxJQUFJLENBQUNDLEdBQUwsQ0FBU0gsYUFBYSxDQUFDLENBQUQsQ0FBYixHQUFtQkMsYUFBYSxDQUFDLENBQUQsQ0FBekMsSUFBZ0R2RCxxQ0FBaEQsSUFDQXdELElBQUksQ0FBQ0MsR0FBTCxDQUFTSCxhQUFhLENBQUMsQ0FBRCxDQUFiLEdBQW1CQyxhQUFhLENBQUMsQ0FBRCxDQUF6QyxJQUFnRHZELHFDQUZsRDtBQUlEOzs7O0VBM1BzRDBELGlDLEdBOFB6RDs7OztBQUNBekQsMkJBQTJCLENBQUMwRCxTQUE1QixHQUF3Qyw2QkFBeEMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuLyogZXNsaW50LWVudiBicm93c2VyICovXG5cbmltcG9ydCB7IENvbXBvc2l0ZUxheWVyIH0gZnJvbSAna2VwbGVyLW91ZGF0ZWQtZGVjay5nbC1jb3JlJztcbmltcG9ydCB0eXBlIHtcbiAgQ2xpY2tFdmVudCxcbiAgU3RhcnREcmFnZ2luZ0V2ZW50LFxuICBTdG9wRHJhZ2dpbmdFdmVudCxcbiAgUG9pbnRlck1vdmVFdmVudCxcbiAgRG91YmxlQ2xpY2tFdmVudFxufSBmcm9tICdAbmVidWxhLmdsL2VkaXQtbW9kZXMnO1xuXG4vLyBNaW5pbXVtIG51bWJlciBvZiBwaXhlbHMgdGhlIHBvaW50ZXIgbXVzdCBtb3ZlIGZyb20gdGhlIG9yaWdpbmFsIHBvaW50ZXIgZG93biB0byBiZSBjb25zaWRlcmVkIGRyYWdnaW5nXG5jb25zdCBNSU5JTVVNX1BPSU5URVJfTU9WRV9USFJFU0hPTERfUElYRUxTID0gNztcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNhbWVsY2FzZVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWRpdGFibGVMYXllcl9FRElUX01PREVfUE9DIGV4dGVuZHMgQ29tcG9zaXRlTGF5ZXIge1xuICAvLyBPdmVycmlkYWJsZSBpbnRlcmFjdGlvbiBldmVudCBoYW5kbGVyc1xuICBvbkxheWVyQ2xpY2soZXZlbnQ6IENsaWNrRXZlbnQpIHtcbiAgICAvLyBkZWZhdWx0IGltcGxlbWVudGF0aW9uIC0gZG8gbm90aGluZ1xuICB9XG5cbiAgb25Eb3VibGVDbGljayhldmVudDogRG91YmxlQ2xpY2tFdmVudCkge1xuICAgIC8vIGRlZmF1bHQgaW1wbGVtZW50YXRpb24gLSBkbyBub3RoaW5nXG4gIH1cblxuICBvblN0YXJ0RHJhZ2dpbmcoZXZlbnQ6IFN0YXJ0RHJhZ2dpbmdFdmVudCkge1xuICAgIC8vIGRlZmF1bHQgaW1wbGVtZW50YXRpb24gLSBkbyBub3RoaW5nXG4gIH1cblxuICBvblN0b3BEcmFnZ2luZyhldmVudDogU3RvcERyYWdnaW5nRXZlbnQpIHtcbiAgICAvLyBkZWZhdWx0IGltcGxlbWVudGF0aW9uIC0gZG8gbm90aGluZ1xuICB9XG5cbiAgb25Qb2ludGVyTW92ZShldmVudDogUG9pbnRlck1vdmVFdmVudCkge1xuICAgIC8vIGRlZmF1bHQgaW1wbGVtZW50YXRpb24gLSBkbyBub3RoaW5nXG4gIH1cblxuICAvLyBUT0RPOiBpbXBsZW1lbnQgb25DYW5jZWxEcmFnZ2luZyAoZS5nLiBkcmFnIG9mZiBzY3JlZW4pXG5cbiAgaW5pdGlhbGl6ZVN0YXRlKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgX2VkaXRhYmxlTGF5ZXJTdGF0ZToge1xuICAgICAgICAvLyBQb2ludGVyIGV2ZW50IGhhbmRsZXJzXG4gICAgICAgIHBvaW50ZXJIYW5kbGVyczogbnVsbCxcbiAgICAgICAgLy8gUGlja2VkIG9iamVjdHMgYXQgdGhlIHRpbWUgdGhlIHBvaW50ZXIgd2VudCBkb3duXG4gICAgICAgIHBvaW50ZXJEb3duUGlja3M6IG51bGwsXG4gICAgICAgIC8vIFNjcmVlbiBjb29yZGluYXRlcyB3aGVyZSB0aGUgcG9pbnRlciB3ZW50IGRvd25cbiAgICAgICAgcG9pbnRlckRvd25TY3JlZW5Db29yZHM6IG51bGwsXG4gICAgICAgIC8vIEdyb3VuZCBjb29yZGluYXRlcyB3aGVyZSB0aGUgcG9pbnRlciB3ZW50IGRvd25cbiAgICAgICAgcG9pbnRlckRvd25NYXBDb29yZHM6IG51bGwsXG4gICAgICAgIC8vIElzIHRoZSBwb2ludGVyIGRyYWdnaW5nIChwb2ludGVyIGRvd24gKyBtb3ZlZCBhdCBsZWFzdCBNSU5JTVVNX1BPSU5URVJfTU9WRV9USFJFU0hPTERfUElYRUxTKVxuICAgICAgICBpc0RyYWdnaW5nOiBmYWxzZVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZmluYWxpemVTdGF0ZSgpIHtcbiAgICB0aGlzLl9yZW1vdmVQb2ludGVySGFuZGxlcnMoKTtcbiAgfVxuXG4gIHVwZGF0ZVN0YXRlKHsgcHJvcHMsIGNoYW5nZUZsYWdzIH06IE9iamVjdCkge1xuICAgIC8vIHVuc3Vic2NyaWJlIHByZXZpb3VzIGxheWVyIGluc3RhbmNlJ3MgaGFuZGxlcnNcbiAgICB0aGlzLl9yZW1vdmVQb2ludGVySGFuZGxlcnMoKTtcbiAgICB0aGlzLl9hZGRQb2ludGVySGFuZGxlcnMoKTtcbiAgfVxuXG4gIF9yZW1vdmVQb2ludGVySGFuZGxlcnMoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuX2VkaXRhYmxlTGF5ZXJTdGF0ZS5wb2ludGVySGFuZGxlcnMpIHtcbiAgICAgIHRoaXMuY29udGV4dC5nbC5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgJ3BvaW50ZXJtb3ZlJyxcbiAgICAgICAgdGhpcy5zdGF0ZS5fZWRpdGFibGVMYXllclN0YXRlLnBvaW50ZXJIYW5kbGVycy5vblBvaW50ZXJNb3ZlXG4gICAgICApO1xuICAgICAgdGhpcy5jb250ZXh0LmdsLmNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKFxuICAgICAgICAncG9pbnRlcmRvd24nLFxuICAgICAgICB0aGlzLnN0YXRlLl9lZGl0YWJsZUxheWVyU3RhdGUucG9pbnRlckhhbmRsZXJzLm9uUG9pbnRlckRvd25cbiAgICAgICk7XG4gICAgICB0aGlzLmNvbnRleHQuZ2wuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoXG4gICAgICAgICdwb2ludGVydXAnLFxuICAgICAgICB0aGlzLnN0YXRlLl9lZGl0YWJsZUxheWVyU3RhdGUucG9pbnRlckhhbmRsZXJzLm9uUG9pbnRlclVwXG4gICAgICApO1xuICAgICAgdGhpcy5jb250ZXh0LmdsLmNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKFxuICAgICAgICAnZGJsY2xpY2snLFxuICAgICAgICB0aGlzLnN0YXRlLl9lZGl0YWJsZUxheWVyU3RhdGUucG9pbnRlckhhbmRsZXJzLm9uRG91YmxlQ2xpY2tcbiAgICAgICk7XG4gICAgfVxuICAgIHRoaXMuc3RhdGUuX2VkaXRhYmxlTGF5ZXJTdGF0ZS5wb2ludGVySGFuZGxlcnMgPSBudWxsO1xuICB9XG5cbiAgX2FkZFBvaW50ZXJIYW5kbGVycygpIHtcbiAgICB0aGlzLnN0YXRlLl9lZGl0YWJsZUxheWVyU3RhdGUucG9pbnRlckhhbmRsZXJzID0ge1xuICAgICAgb25Qb2ludGVyTW92ZTogdGhpcy5fb25Qb2ludGVyTW92ZS5iaW5kKHRoaXMpLFxuICAgICAgb25Qb2ludGVyRG93bjogdGhpcy5fb25Qb2ludGVyRG93bi5iaW5kKHRoaXMpLFxuICAgICAgb25Qb2ludGVyVXA6IHRoaXMuX29uUG9pbnRlclVwLmJpbmQodGhpcyksXG4gICAgICBvbkRvdWJsZUNsaWNrOiB0aGlzLl9vbkRvdWJsZUNsaWNrLmJpbmQodGhpcylcbiAgICB9O1xuXG4gICAgdGhpcy5jb250ZXh0LmdsLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgJ3BvaW50ZXJtb3ZlJyxcbiAgICAgIHRoaXMuc3RhdGUuX2VkaXRhYmxlTGF5ZXJTdGF0ZS5wb2ludGVySGFuZGxlcnMub25Qb2ludGVyTW92ZVxuICAgICk7XG4gICAgdGhpcy5jb250ZXh0LmdsLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgJ3BvaW50ZXJkb3duJyxcbiAgICAgIHRoaXMuc3RhdGUuX2VkaXRhYmxlTGF5ZXJTdGF0ZS5wb2ludGVySGFuZGxlcnMub25Qb2ludGVyRG93blxuICAgICk7XG4gICAgdGhpcy5jb250ZXh0LmdsLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgJ3BvaW50ZXJ1cCcsXG4gICAgICB0aGlzLnN0YXRlLl9lZGl0YWJsZUxheWVyU3RhdGUucG9pbnRlckhhbmRsZXJzLm9uUG9pbnRlclVwXG4gICAgKTtcbiAgICB0aGlzLmNvbnRleHQuZ2wuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAnZGJsY2xpY2snLFxuICAgICAgdGhpcy5zdGF0ZS5fZWRpdGFibGVMYXllclN0YXRlLnBvaW50ZXJIYW5kbGVycy5vbkRvdWJsZUNsaWNrXG4gICAgKTtcbiAgfVxuXG4gIF9vbkRvdWJsZUNsaWNrKGV2ZW50OiBPYmplY3QpIHtcbiAgICBjb25zdCBzY3JlZW5Db29yZHMgPSB0aGlzLmdldFNjcmVlbkNvb3JkcyhldmVudCk7XG4gICAgY29uc3QgbWFwQ29vcmRzID0gdGhpcy5nZXRNYXBDb29yZHMoc2NyZWVuQ29vcmRzKTtcbiAgICB0aGlzLm9uRG91YmxlQ2xpY2soe1xuICAgICAgbWFwQ29vcmRzLFxuICAgICAgc291cmNlRXZlbnQ6IGV2ZW50XG4gICAgfSk7XG4gIH1cblxuICBfb25Qb2ludGVyRG93bihldmVudDogT2JqZWN0KSB7XG4gICAgY29uc3Qgc2NyZWVuQ29vcmRzID0gdGhpcy5nZXRTY3JlZW5Db29yZHMoZXZlbnQpO1xuICAgIGNvbnN0IG1hcENvb3JkcyA9IHRoaXMuZ2V0TWFwQ29vcmRzKHNjcmVlbkNvb3Jkcyk7XG5cbiAgICBjb25zdCBwaWNrcyA9IHRoaXMuY29udGV4dC5kZWNrLnBpY2tNdWx0aXBsZU9iamVjdHMoe1xuICAgICAgeDogc2NyZWVuQ29vcmRzWzBdLFxuICAgICAgeTogc2NyZWVuQ29vcmRzWzFdLFxuICAgICAgbGF5ZXJJZHM6IFt0aGlzLnByb3BzLmlkXSxcbiAgICAgIHJhZGl1czogdGhpcy5wcm9wcy5waWNraW5nUmFkaXVzIHx8IDEwLFxuICAgICAgZGVwdGg6IDJcbiAgICB9KTtcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgX2VkaXRhYmxlTGF5ZXJTdGF0ZToge1xuICAgICAgICAuLi50aGlzLnN0YXRlLl9lZGl0YWJsZUxheWVyU3RhdGUsXG4gICAgICAgIHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzOiBzY3JlZW5Db29yZHMsXG4gICAgICAgIHBvaW50ZXJEb3duTWFwQ29vcmRzOiBtYXBDb29yZHMsXG4gICAgICAgIHBvaW50ZXJEb3duUGlja3M6IHBpY2tzLFxuICAgICAgICBpc0RyYWdnaW5nOiBmYWxzZVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgX29uUG9pbnRlck1vdmUoZXZlbnQ6IE9iamVjdCkge1xuICAgIGNvbnN0IHNjcmVlbkNvb3JkcyA9IHRoaXMuZ2V0U2NyZWVuQ29vcmRzKGV2ZW50KTtcbiAgICBjb25zdCBtYXBDb29yZHMgPSB0aGlzLmdldE1hcENvb3JkcyhzY3JlZW5Db29yZHMpO1xuXG4gICAgY29uc3Qge1xuICAgICAgcG9pbnRlckRvd25QaWNrcyxcbiAgICAgIHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzLFxuICAgICAgcG9pbnRlckRvd25NYXBDb29yZHNcbiAgICB9ID0gdGhpcy5zdGF0ZS5fZWRpdGFibGVMYXllclN0YXRlO1xuXG4gICAgbGV0IHsgaXNEcmFnZ2luZyB9ID0gdGhpcy5zdGF0ZS5fZWRpdGFibGVMYXllclN0YXRlO1xuXG4gICAgaWYgKHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzKSB7XG4gICAgICAvLyBQb2ludGVyIHdlbnQgZG93biBhbmQgaXMgbW92aW5nXG5cbiAgICAgIC8vIERpZCBpdCBtb3ZlIGVub3VnaCB0byBjb25zaWRlciBpdCBhIGRyYWdcbiAgICAgIGlmICghaXNEcmFnZ2luZyAmJiB0aGlzLm1vdmVkRW5vdWdoRm9yRHJhZyhwb2ludGVyRG93blNjcmVlbkNvb3Jkcywgc2NyZWVuQ29vcmRzKSkge1xuICAgICAgICAvLyBPSywgdGhpcyBpcyBjb25zaWRlcmVkIGRyYWdnaW5nXG5cbiAgICAgICAgLy8gRmlyZSB0aGUgc3RhcnQgZHJhZ2dpbmcgZXZlbnRcbiAgICAgICAgdGhpcy5vblN0YXJ0RHJhZ2dpbmcoe1xuICAgICAgICAgIHBpY2tzOiBwb2ludGVyRG93blBpY2tzLFxuICAgICAgICAgIHNjcmVlbkNvb3JkcyxcbiAgICAgICAgICBtYXBDb29yZHMsXG4gICAgICAgICAgcG9pbnRlckRvd25TY3JlZW5Db29yZHMsXG4gICAgICAgICAgcG9pbnRlckRvd25NYXBDb29yZHMsXG4gICAgICAgICAgc291cmNlRXZlbnQ6IGV2ZW50XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlzRHJhZ2dpbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBfZWRpdGFibGVMYXllclN0YXRlOiB7XG4gICAgICAgICAgICAuLi50aGlzLnN0YXRlLl9lZGl0YWJsZUxheWVyU3RhdGUsXG4gICAgICAgICAgICBpc0RyYWdnaW5nXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBwaWNrcyA9IHRoaXMuY29udGV4dC5kZWNrLnBpY2tNdWx0aXBsZU9iamVjdHMoe1xuICAgICAgeDogc2NyZWVuQ29vcmRzWzBdLFxuICAgICAgeTogc2NyZWVuQ29vcmRzWzFdLFxuICAgICAgbGF5ZXJJZHM6IFt0aGlzLnByb3BzLmlkXSxcbiAgICAgIHJhZGl1czogdGhpcy5wcm9wcy5waWNraW5nUmFkaXVzIHx8IDEwLFxuICAgICAgZGVwdGg6IDJcbiAgICB9KTtcblxuICAgIHRoaXMub25Qb2ludGVyTW92ZSh7XG4gICAgICBzY3JlZW5Db29yZHMsXG4gICAgICBtYXBDb29yZHMsXG4gICAgICBwaWNrcyxcbiAgICAgIGlzRHJhZ2dpbmcsXG4gICAgICBwb2ludGVyRG93blBpY2tzLFxuICAgICAgcG9pbnRlckRvd25TY3JlZW5Db29yZHMsXG4gICAgICBwb2ludGVyRG93bk1hcENvb3JkcyxcbiAgICAgIHNvdXJjZUV2ZW50OiBldmVudFxuICAgIH0pO1xuICB9XG5cbiAgX29uUG9pbnRlclVwKGV2ZW50OiBPYmplY3QpIHtcbiAgICBjb25zdCBzY3JlZW5Db29yZHMgPSB0aGlzLmdldFNjcmVlbkNvb3JkcyhldmVudCk7XG4gICAgY29uc3QgbWFwQ29vcmRzID0gdGhpcy5nZXRNYXBDb29yZHMoc2NyZWVuQ29vcmRzKTtcblxuICAgIGNvbnN0IHtcbiAgICAgIHBvaW50ZXJEb3duUGlja3MsXG4gICAgICBwb2ludGVyRG93blNjcmVlbkNvb3JkcyxcbiAgICAgIHBvaW50ZXJEb3duTWFwQ29vcmRzLFxuICAgICAgaXNEcmFnZ2luZ1xuICAgIH0gPSB0aGlzLnN0YXRlLl9lZGl0YWJsZUxheWVyU3RhdGU7XG5cbiAgICBpZiAoIXBvaW50ZXJEb3duU2NyZWVuQ29vcmRzKSB7XG4gICAgICAvLyBUaGlzIGlzIGEgcG9pbnRlciB1cCB3aXRob3V0IGEgcG9pbnRlciBkb3duIChlLmcuIHVzZXIgcG9pbnRlciBkb3duZWQgZWxzZXdoZXJlKSwgc28gaWdub3JlXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGlzRHJhZ2dpbmcpIHtcbiAgICAgIHRoaXMub25TdG9wRHJhZ2dpbmcoe1xuICAgICAgICBwaWNrczogcG9pbnRlckRvd25QaWNrcyxcbiAgICAgICAgc2NyZWVuQ29vcmRzLFxuICAgICAgICBtYXBDb29yZHMsXG4gICAgICAgIHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzLFxuICAgICAgICBwb2ludGVyRG93bk1hcENvb3JkcyxcbiAgICAgICAgc291cmNlRXZlbnQ6IGV2ZW50XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKCF0aGlzLm1vdmVkRW5vdWdoRm9yRHJhZyhwb2ludGVyRG93blNjcmVlbkNvb3Jkcywgc2NyZWVuQ29vcmRzKSkge1xuICAgICAgdGhpcy5vbkxheWVyQ2xpY2soe1xuICAgICAgICBwaWNrczogcG9pbnRlckRvd25QaWNrcyxcbiAgICAgICAgc2NyZWVuQ29vcmRzLFxuICAgICAgICBtYXBDb29yZHMsXG4gICAgICAgIHNvdXJjZUV2ZW50OiBldmVudFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBfZWRpdGFibGVMYXllclN0YXRlOiB7XG4gICAgICAgIC4uLnRoaXMuc3RhdGUuX2VkaXRhYmxlTGF5ZXJTdGF0ZSxcbiAgICAgICAgcG9pbnRlckRvd25TY3JlZW5Db29yZHM6IG51bGwsXG4gICAgICAgIHBvaW50ZXJEb3duTWFwQ29vcmRzOiBudWxsLFxuICAgICAgICBwb2ludGVyRG93blBpY2tzOiBudWxsLFxuICAgICAgICBpc0RyYWdnaW5nOiBmYWxzZVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZ2V0U2NyZWVuQ29vcmRzKHBvaW50ZXJFdmVudDogT2JqZWN0KSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIHBvaW50ZXJFdmVudC5jbGllbnRYIC0gdGhpcy5jb250ZXh0LmdsLmNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS54LFxuICAgICAgcG9pbnRlckV2ZW50LmNsaWVudFkgLSB0aGlzLmNvbnRleHQuZ2wuY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnlcbiAgICBdO1xuICB9XG5cbiAgZ2V0TWFwQ29vcmRzKHNjcmVlbkNvb3JkczogbnVtYmVyW10pIHtcbiAgICByZXR1cm4gdGhpcy5jb250ZXh0LnZpZXdwb3J0LnVucHJvamVjdChbc2NyZWVuQ29vcmRzWzBdLCBzY3JlZW5Db29yZHNbMV1dKTtcbiAgfVxuXG4gIG1vdmVkRW5vdWdoRm9yRHJhZyhzY3JlZW5Db29yZHMxOiBudW1iZXJbXSwgc2NyZWVuQ29vcmRzMjogbnVtYmVyW10pIHtcbiAgICByZXR1cm4gKFxuICAgICAgTWF0aC5hYnMoc2NyZWVuQ29vcmRzMVswXSAtIHNjcmVlbkNvb3JkczJbMF0pID4gTUlOSU1VTV9QT0lOVEVSX01PVkVfVEhSRVNIT0xEX1BJWEVMUyB8fFxuICAgICAgTWF0aC5hYnMoc2NyZWVuQ29vcmRzMVsxXSAtIHNjcmVlbkNvb3JkczJbMV0pID4gTUlOSU1VTV9QT0lOVEVSX01PVkVfVEhSRVNIT0xEX1BJWEVMU1xuICAgICk7XG4gIH1cbn1cblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNhbWVsY2FzZVxuRWRpdGFibGVMYXllcl9FRElUX01PREVfUE9DLmxheWVyTmFtZSA9ICdFZGl0YWJsZUxheWVyX0VESVRfTU9ERV9QT0MnO1xuIl19