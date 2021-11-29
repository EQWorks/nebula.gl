"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _keplerOutdatedDeck = require("kepler-outdated-deck.gl-core");

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
var MINIMUM_POINTER_MOVE_THRESHOLD_PIXELS = 7;

var EditableLayerEditModePoc =
/*#__PURE__*/
function (_CompositeLayer) {
  _inherits(EditableLayerEditModePoc, _CompositeLayer);

  function EditableLayerEditModePoc() {
    _classCallCheck(this, EditableLayerEditModePoc);

    return _possibleConstructorReturn(this, _getPrototypeOf(EditableLayerEditModePoc).apply(this, arguments));
  }

  _createClass(EditableLayerEditModePoc, [{
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
        radius: this.props.pickingRadius,
        depth: this.props.pickingDepth
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
      var startedDragging = false;

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
          startedDragging = true;
          isDragging = true;
          this.setState({
            _editableLayerState: _objectSpread({}, this.state._editableLayerState, {
              isDragging: isDragging
            })
          });
        }
      }

      if (!startedDragging) {
        var picks = this.context.deck.pickMultipleObjects({
          x: screenCoords[0],
          y: screenCoords[1],
          layerIds: [this.props.id],
          radius: this.props.pickingRadius,
          depth: this.props.pickingDepth
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

  return EditableLayerEditModePoc;
}(_keplerOutdatedDeck.CompositeLayer);

exports.default = EditableLayerEditModePoc;
EditableLayerEditModePoc.layerName = 'EditableLayerEditModePoc';
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sYXllcnMvZWRpdGFibGUtbGF5ZXItZWRpdC1tb2RlLXBvYy5qcyJdLCJuYW1lcyI6WyJNSU5JTVVNX1BPSU5URVJfTU9WRV9USFJFU0hPTERfUElYRUxTIiwiRWRpdGFibGVMYXllckVkaXRNb2RlUG9jIiwiZXZlbnQiLCJzZXRTdGF0ZSIsIl9lZGl0YWJsZUxheWVyU3RhdGUiLCJwb2ludGVySGFuZGxlcnMiLCJwb2ludGVyRG93blBpY2tzIiwicG9pbnRlckRvd25TY3JlZW5Db29yZHMiLCJwb2ludGVyRG93bk1hcENvb3JkcyIsImlzRHJhZ2dpbmciLCJfcmVtb3ZlUG9pbnRlckhhbmRsZXJzIiwicHJvcHMiLCJjaGFuZ2VGbGFncyIsIl9hZGRQb2ludGVySGFuZGxlcnMiLCJzdGF0ZSIsImNvbnRleHQiLCJnbCIsImNhbnZhcyIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJvblBvaW50ZXJNb3ZlIiwib25Qb2ludGVyRG93biIsIm9uUG9pbnRlclVwIiwib25Eb3VibGVDbGljayIsIl9vblBvaW50ZXJNb3ZlIiwiYmluZCIsIl9vblBvaW50ZXJEb3duIiwiX29uUG9pbnRlclVwIiwiX29uRG91YmxlQ2xpY2siLCJhZGRFdmVudExpc3RlbmVyIiwic2NyZWVuQ29vcmRzIiwiZ2V0U2NyZWVuQ29vcmRzIiwibWFwQ29vcmRzIiwiZ2V0TWFwQ29vcmRzIiwic291cmNlRXZlbnQiLCJwaWNrcyIsImRlY2siLCJwaWNrTXVsdGlwbGVPYmplY3RzIiwieCIsInkiLCJsYXllcklkcyIsImlkIiwicmFkaXVzIiwicGlja2luZ1JhZGl1cyIsImRlcHRoIiwicGlja2luZ0RlcHRoIiwic3RhcnRlZERyYWdnaW5nIiwibW92ZWRFbm91Z2hGb3JEcmFnIiwib25TdGFydERyYWdnaW5nIiwib25TdG9wRHJhZ2dpbmciLCJvbkxheWVyQ2xpY2siLCJwb2ludGVyRXZlbnQiLCJjbGllbnRYIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiY2xpZW50WSIsInZpZXdwb3J0IiwidW5wcm9qZWN0Iiwic2NyZWVuQ29vcmRzMSIsInNjcmVlbkNvb3JkczIiLCJNYXRoIiwiYWJzIiwiQ29tcG9zaXRlTGF5ZXIiLCJsYXllck5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFHQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBU0E7QUFDQSxJQUFNQSxxQ0FBcUMsR0FBRyxDQUE5Qzs7SUFFcUJDLHdCOzs7Ozs7Ozs7Ozs7O0FBQ25CO2lDQUNhQyxLLEVBQW1CLENBQzlCO0FBQ0Q7OztrQ0FFYUEsSyxFQUF5QixDQUNyQztBQUNEOzs7b0NBRWVBLEssRUFBMkIsQ0FDekM7QUFDRDs7O21DQUVjQSxLLEVBQTBCLENBQ3ZDO0FBQ0Q7OztrQ0FFYUEsSyxFQUF5QixDQUV0QyxDLENBREM7QUFHRjs7OztzQ0FFa0I7QUFDaEIsV0FBS0MsUUFBTCxDQUFjO0FBQ1pDLFFBQUFBLG1CQUFtQixFQUFFO0FBQ25CO0FBQ0FDLFVBQUFBLGVBQWUsRUFBRSxJQUZFO0FBR25CO0FBQ0FDLFVBQUFBLGdCQUFnQixFQUFFLElBSkM7QUFLbkI7QUFDQUMsVUFBQUEsdUJBQXVCLEVBQUUsSUFOTjtBQU9uQjtBQUNBQyxVQUFBQSxvQkFBb0IsRUFBRSxJQVJIO0FBU25CO0FBQ0FDLFVBQUFBLFVBQVUsRUFBRTtBQVZPO0FBRFQsT0FBZDtBQWNEOzs7b0NBRWU7QUFDZCxXQUFLQyxzQkFBTDtBQUNEOzs7c0NBRTJDO0FBQUEsVUFBOUJDLEtBQThCLFFBQTlCQSxLQUE4QjtBQUFBLFVBQXZCQyxXQUF1QixRQUF2QkEsV0FBdUI7O0FBQzFDO0FBQ0EsV0FBS0Ysc0JBQUw7O0FBQ0EsV0FBS0csbUJBQUw7QUFDRDs7OzZDQUV3QjtBQUN2QixVQUFJLEtBQUtDLEtBQUwsQ0FBV1YsbUJBQVgsQ0FBK0JDLGVBQW5DLEVBQW9EO0FBQ2xELGFBQUtVLE9BQUwsQ0FBYUMsRUFBYixDQUFnQkMsTUFBaEIsQ0FBdUJDLG1CQUF2QixDQUNFLGFBREYsRUFFRSxLQUFLSixLQUFMLENBQVdWLG1CQUFYLENB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LEtBQUwsQ0FBV1YsbUJBREc7QUFFakJHLFVBQUFBLHVCQUF1QixFQUFFLElBRlI7QUFHakJDLFVBQUFBLG9CQUFvQixFQUFFLElBSEw7QUFJakJGLFVBQUFBLGdCQUFnQixFQUFFLElBSkQ7QUFLakJHLFVBQUFBLFVBQVUsRUFBRTtBQUxLO0FBRFAsT0FBZDtBQVNEOzs7b0NBRWV5QyxZLEVBQXNCO0FBQ3BDLGFBQU8sQ0FDTEEsWUFBWSxDQUFDQyxPQUFiLEdBQXVCLEtBQUtwQyxPQUFMLENBQWFDLEVBQWIsQ0FBZ0JDLE1BQWhCLENBQXVCbUMscUJBQXZCLEdBQStDZixDQURqRSxFQUVMYSxZQUFZLENBQUNHLE9BQWIsR0FBdUIsS0FBS3RDLE9BQUwsQ0FBYUMsRUFBYixDQUFnQkMsTUFBaEIsQ0FBdUJtQyxxQkFBdkIsR0FBK0NkLENBRmpFLENBQVA7QUFJRDs7O2lDQUVZVCxZLEVBQXdCO0FBQ25DLGFBQU8sS0FBS2QsT0FBTCxDQUFhdUMsUUFBYixDQUFzQkMsU0FBdEIsQ0FBZ0MsQ0FBQzFCLFlBQVksQ0FBQyxDQUFELENBQWIsRUFBa0JBLFlBQVksQ0FBQyxDQUFELENBQTlCLENBQWhDLENBQVA7QUFDRDs7O3VDQUVrQjJCLGEsRUFBeUJDLGEsRUFBeUI7QUFDbkUsYUFDRUMsSUFBSSxDQUFDQyxHQUFMLENBQVNILGFBQWEsQ0FBQyxDQUFELENBQWIsR0FBbUJDLGFBQWEsQ0FBQyxDQUFELENBQXpDLElBQWdEekQscUNBQWhELElBQ0EwRCxJQUFJLENBQUNDLEdBQUwsQ0FBU0gsYUFBYSxDQUFDLENBQUQsQ0FBYixHQUFtQkMsYUFBYSxDQUFDLENBQUQsQ0FBekMsSUFBZ0R6RCxxQ0FGbEQ7QUFJRDs7OztFQWhRbUQ0RCxrQzs7O0FBbVF0RDNELHdCQUF3QixDQUFDNEQsU0FBekIsR0FBcUMsMEJBQXJDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcbi8qIGVzbGludC1lbnYgYnJvd3NlciAqL1xuXG5pbXBvcnQgeyBDb21wb3NpdGVMYXllciB9IGZyb20gJ2tlcGxlci1vdXRkYXRlZC1kZWNrLmdsLWNvcmUnO1xuaW1wb3J0IHR5cGUge1xuICBDbGlja0V2ZW50LFxuICBTdGFydERyYWdnaW5nRXZlbnQsXG4gIFN0b3BEcmFnZ2luZ0V2ZW50LFxuICBQb2ludGVyTW92ZUV2ZW50LFxuICBEb3VibGVDbGlja0V2ZW50XG59IGZyb20gJ2tlcGxlci1vdXRkYXRlZC1uZWJ1bGEuZ2wtZWRpdC1tb2Rlcyc7XG5cbi8vIE1pbmltdW0gbnVtYmVyIG9mIHBpeGVscyB0aGUgcG9pbnRlciBtdXN0IG1vdmUgZnJvbSB0aGUgb3JpZ2luYWwgcG9pbnRlciBkb3duIHRvIGJlIGNvbnNpZGVyZWQgZHJhZ2dpbmdcbmNvbnN0IE1JTklNVU1fUE9JTlRFUl9NT1ZFX1RIUkVTSE9MRF9QSVhFTFMgPSA3O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFZGl0YWJsZUxheWVyRWRpdE1vZGVQb2MgZXh0ZW5kcyBDb21wb3NpdGVMYXllciB7XG4gIC8vIE92ZXJyaWRhYmxlIGludGVyYWN0aW9uIGV2ZW50IGhhbmRsZXJzXG4gIG9uTGF5ZXJDbGljayhldmVudDogQ2xpY2tFdmVudCkge1xuICAgIC8vIGRlZmF1bHQgaW1wbGVtZW50YXRpb24gLSBkbyBub3RoaW5nXG4gIH1cblxuICBvbkRvdWJsZUNsaWNrKGV2ZW50OiBEb3VibGVDbGlja0V2ZW50KSB7XG4gICAgLy8gZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiAtIGRvIG5vdGhpbmdcbiAgfVxuXG4gIG9uU3RhcnREcmFnZ2luZyhldmVudDogU3RhcnREcmFnZ2luZ0V2ZW50KSB7XG4gICAgLy8gZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiAtIGRvIG5vdGhpbmdcbiAgfVxuXG4gIG9uU3RvcERyYWdnaW5nKGV2ZW50OiBTdG9wRHJhZ2dpbmdFdmVudCkge1xuICAgIC8vIGRlZmF1bHQgaW1wbGVtZW50YXRpb24gLSBkbyBub3RoaW5nXG4gIH1cblxuICBvblBvaW50ZXJNb3ZlKGV2ZW50OiBQb2ludGVyTW92ZUV2ZW50KSB7XG4gICAgLy8gZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiAtIGRvIG5vdGhpbmdcbiAgfVxuXG4gIC8vIFRPRE86IGltcGxlbWVudCBvbkNhbmNlbERyYWdnaW5nIChlLmcuIGRyYWcgb2ZmIHNjcmVlbilcblxuICBpbml0aWFsaXplU3RhdGUoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBfZWRpdGFibGVMYXllclN0YXRlOiB7XG4gICAgICAgIC8vIFBvaW50ZXIgZXZlbnQgaGFuZGxlcnNcbiAgICAgICAgcG9pbnRlckhhbmRsZXJzOiBudWxsLFxuICAgICAgICAvLyBQaWNrZWQgb2JqZWN0cyBhdCB0aGUgdGltZSB0aGUgcG9pbnRlciB3ZW50IGRvd25cbiAgICAgICAgcG9pbnRlckRvd25QaWNrczogbnVsbCxcbiAgICAgICAgLy8gU2NyZWVuIGNvb3JkaW5hdGVzIHdoZXJlIHRoZSBwb2ludGVyIHdlbnQgZG93blxuICAgICAgICBwb2ludGVyRG93blNjcmVlbkNvb3JkczogbnVsbCxcbiAgICAgICAgLy8gR3JvdW5kIGNvb3JkaW5hdGVzIHdoZXJlIHRoZSBwb2ludGVyIHdlbnQgZG93blxuICAgICAgICBwb2ludGVyRG93bk1hcENvb3JkczogbnVsbCxcbiAgICAgICAgLy8gSXMgdGhlIHBvaW50ZXIgZHJhZ2dpbmcgKHBvaW50ZXIgZG93biArIG1vdmVkIGF0IGxlYXN0IE1JTklNVU1fUE9JTlRFUl9NT1ZFX1RIUkVTSE9MRF9QSVhFTFMpXG4gICAgICAgIGlzRHJhZ2dpbmc6IGZhbHNlXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBmaW5hbGl6ZVN0YXRlKCkge1xuICAgIHRoaXMuX3JlbW92ZVBvaW50ZXJIYW5kbGVycygpO1xuICB9XG5cbiAgdXBkYXRlU3RhdGUoeyBwcm9wcywgY2hhbmdlRmxhZ3MgfTogT2JqZWN0KSB7XG4gICAgLy8gdW5zdWJzY3JpYmUgcHJldmlvdXMgbGF5ZXIgaW5zdGFuY2UncyBoYW5kbGVyc1xuICAgIHRoaXMuX3JlbW92ZVBvaW50ZXJIYW5kbGVycygpO1xuICAgIHRoaXMuX2FkZFBvaW50ZXJIYW5kbGVycygpO1xuICB9XG5cbiAgX3JlbW92ZVBvaW50ZXJIYW5kbGVycygpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5fZWRpdGFibGVMYXllclN0YXRlLnBvaW50ZXJIYW5kbGVycykge1xuICAgICAgdGhpcy5jb250ZXh0LmdsLmNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKFxuICAgICAgICAncG9pbnRlcm1vdmUnLFxuICAgICAgICB0aGlzLnN0YXRlLl9lZGl0YWJsZUxheWVyU3RhdGUucG9pbnRlckhhbmRsZXJzLm9uUG9pbnRlck1vdmVcbiAgICAgICk7XG4gICAgICB0aGlzLmNvbnRleHQuZ2wuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoXG4gICAgICAgICdwb2ludGVyZG93bicsXG4gICAgICAgIHRoaXMuc3RhdGUuX2VkaXRhYmxlTGF5ZXJTdGF0ZS5wb2ludGVySGFuZGxlcnMub25Qb2ludGVyRG93blxuICAgICAgKTtcbiAgICAgIHRoaXMuY29udGV4dC5nbC5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgJ3BvaW50ZXJ1cCcsXG4gICAgICAgIHRoaXMuc3RhdGUuX2VkaXRhYmxlTGF5ZXJTdGF0ZS5wb2ludGVySGFuZGxlcnMub25Qb2ludGVyVXBcbiAgICAgICk7XG4gICAgICB0aGlzLmNvbnRleHQuZ2wuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoXG4gICAgICAgICdkYmxjbGljaycsXG4gICAgICAgIHRoaXMuc3RhdGUuX2VkaXRhYmxlTGF5ZXJTdGF0ZS5wb2ludGVySGFuZGxlcnMub25Eb3VibGVDbGlja1xuICAgICAgKTtcbiAgICB9XG4gICAgdGhpcy5zdGF0ZS5fZWRpdGFibGVMYXllclN0YXRlLnBvaW50ZXJIYW5kbGVycyA9IG51bGw7XG4gIH1cblxuICBfYWRkUG9pbnRlckhhbmRsZXJzKCkge1xuICAgIHRoaXMuc3RhdGUuX2VkaXRhYmxlTGF5ZXJTdGF0ZS5wb2ludGVySGFuZGxlcnMgPSB7XG4gICAgICBvblBvaW50ZXJNb3ZlOiB0aGlzLl9vblBvaW50ZXJNb3ZlLmJpbmQodGhpcyksXG4gICAgICBvblBvaW50ZXJEb3duOiB0aGlzLl9vblBvaW50ZXJEb3duLmJpbmQodGhpcyksXG4gICAgICBvblBvaW50ZXJVcDogdGhpcy5fb25Qb2ludGVyVXAuYmluZCh0aGlzKSxcbiAgICAgIG9uRG91YmxlQ2xpY2s6IHRoaXMuX29uRG91YmxlQ2xpY2suYmluZCh0aGlzKVxuICAgIH07XG5cbiAgICB0aGlzLmNvbnRleHQuZ2wuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAncG9pbnRlcm1vdmUnLFxuICAgICAgdGhpcy5zdGF0ZS5fZWRpdGFibGVMYXllclN0YXRlLnBvaW50ZXJIYW5kbGVycy5vblBvaW50ZXJNb3ZlXG4gICAgKTtcbiAgICB0aGlzLmNvbnRleHQuZ2wuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAncG9pbnRlcmRvd24nLFxuICAgICAgdGhpcy5zdGF0ZS5fZWRpdGFibGVMYXllclN0YXRlLnBvaW50ZXJIYW5kbGVycy5vblBvaW50ZXJEb3duXG4gICAgKTtcbiAgICB0aGlzLmNvbnRleHQuZ2wuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAncG9pbnRlcnVwJyxcbiAgICAgIHRoaXMuc3RhdGUuX2VkaXRhYmxlTGF5ZXJTdGF0ZS5wb2ludGVySGFuZGxlcnMub25Qb2ludGVyVXBcbiAgICApO1xuICAgIHRoaXMuY29udGV4dC5nbC5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICdkYmxjbGljaycsXG4gICAgICB0aGlzLnN0YXRlLl9lZGl0YWJsZUxheWVyU3RhdGUucG9pbnRlckhhbmRsZXJzLm9uRG91YmxlQ2xpY2tcbiAgICApO1xuICB9XG5cbiAgX29uRG91YmxlQ2xpY2soZXZlbnQ6IE9iamVjdCkge1xuICAgIGNvbnN0IHNjcmVlbkNvb3JkcyA9IHRoaXMuZ2V0U2NyZWVuQ29vcmRzKGV2ZW50KTtcbiAgICBjb25zdCBtYXBDb29yZHMgPSB0aGlzLmdldE1hcENvb3JkcyhzY3JlZW5Db29yZHMpO1xuICAgIHRoaXMub25Eb3VibGVDbGljayh7XG4gICAgICBtYXBDb29yZHMsXG4gICAgICBzb3VyY2VFdmVudDogZXZlbnRcbiAgICB9KTtcbiAgfVxuXG4gIF9vblBvaW50ZXJEb3duKGV2ZW50OiBPYmplY3QpIHtcbiAgICBjb25zdCBzY3JlZW5Db29yZHMgPSB0aGlzLmdldFNjcmVlbkNvb3JkcyhldmVudCk7XG4gICAgY29uc3QgbWFwQ29vcmRzID0gdGhpcy5nZXRNYXBDb29yZHMoc2NyZWVuQ29vcmRzKTtcblxuICAgIGNvbnN0IHBpY2tzID0gdGhpcy5jb250ZXh0LmRlY2sucGlja011bHRpcGxlT2JqZWN0cyh7XG4gICAgICB4OiBzY3JlZW5Db29yZHNbMF0sXG4gICAgICB5OiBzY3JlZW5Db29yZHNbMV0sXG4gICAgICBsYXllcklkczogW3RoaXMucHJvcHMuaWRdLFxuICAgICAgcmFkaXVzOiB0aGlzLnByb3BzLnBpY2tpbmdSYWRpdXMsXG4gICAgICBkZXB0aDogdGhpcy5wcm9wcy5waWNraW5nRGVwdGhcbiAgICB9KTtcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgX2VkaXRhYmxlTGF5ZXJTdGF0ZToge1xuICAgICAgICAuLi50aGlzLnN0YXRlLl9lZGl0YWJsZUxheWVyU3RhdGUsXG4gICAgICAgIHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzOiBzY3JlZW5Db29yZHMsXG4gICAgICAgIHBvaW50ZXJEb3duTWFwQ29vcmRzOiBtYXBDb29yZHMsXG4gICAgICAgIHBvaW50ZXJEb3duUGlja3M6IHBpY2tzLFxuICAgICAgICBpc0RyYWdnaW5nOiBmYWxzZVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgX29uUG9pbnRlck1vdmUoZXZlbnQ6IE9iamVjdCkge1xuICAgIGNvbnN0IHNjcmVlbkNvb3JkcyA9IHRoaXMuZ2V0U2NyZWVuQ29vcmRzKGV2ZW50KTtcbiAgICBjb25zdCBtYXBDb29yZHMgPSB0aGlzLmdldE1hcENvb3JkcyhzY3JlZW5Db29yZHMpO1xuXG4gICAgY29uc3Qge1xuICAgICAgcG9pbnRlckRvd25QaWNrcyxcbiAgICAgIHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzLFxuICAgICAgcG9pbnRlckRvd25NYXBDb29yZHNcbiAgICB9ID0gdGhpcy5zdGF0ZS5fZWRpdGFibGVMYXllclN0YXRlO1xuXG4gICAgbGV0IHsgaXNEcmFnZ2luZyB9ID0gdGhpcy5zdGF0ZS5fZWRpdGFibGVMYXllclN0YXRlO1xuICAgIGxldCBzdGFydGVkRHJhZ2dpbmcgPSBmYWxzZTtcblxuICAgIGlmIChwb2ludGVyRG93blNjcmVlbkNvb3Jkcykge1xuICAgICAgLy8gUG9pbnRlciB3ZW50IGRvd24gYW5kIGlzIG1vdmluZ1xuXG4gICAgICAvLyBEaWQgaXQgbW92ZSBlbm91Z2ggdG8gY29uc2lkZXIgaXQgYSBkcmFnXG4gICAgICBpZiAoIWlzRHJhZ2dpbmcgJiYgdGhpcy5tb3ZlZEVub3VnaEZvckRyYWcocG9pbnRlckRvd25TY3JlZW5Db29yZHMsIHNjcmVlbkNvb3JkcykpIHtcbiAgICAgICAgLy8gT0ssIHRoaXMgaXMgY29uc2lkZXJlZCBkcmFnZ2luZ1xuXG4gICAgICAgIC8vIEZpcmUgdGhlIHN0YXJ0IGRyYWdnaW5nIGV2ZW50XG4gICAgICAgIHRoaXMub25TdGFydERyYWdnaW5nKHtcbiAgICAgICAgICBwaWNrczogcG9pbnRlckRvd25QaWNrcyxcbiAgICAgICAgICBzY3JlZW5Db29yZHMsXG4gICAgICAgICAgbWFwQ29vcmRzLFxuICAgICAgICAgIHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzLFxuICAgICAgICAgIHBvaW50ZXJEb3duTWFwQ29vcmRzLFxuICAgICAgICAgIHNvdXJjZUV2ZW50OiBldmVudFxuICAgICAgICB9KTtcblxuICAgICAgICBzdGFydGVkRHJhZ2dpbmcgPSB0cnVlO1xuXG4gICAgICAgIGlzRHJhZ2dpbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBfZWRpdGFibGVMYXllclN0YXRlOiB7XG4gICAgICAgICAgICAuLi50aGlzLnN0YXRlLl9lZGl0YWJsZUxheWVyU3RhdGUsXG4gICAgICAgICAgICBpc0RyYWdnaW5nXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIXN0YXJ0ZWREcmFnZ2luZykge1xuICAgICAgY29uc3QgcGlja3MgPSB0aGlzLmNvbnRleHQuZGVjay5waWNrTXVsdGlwbGVPYmplY3RzKHtcbiAgICAgICAgeDogc2NyZWVuQ29vcmRzWzBdLFxuICAgICAgICB5OiBzY3JlZW5Db29yZHNbMV0sXG4gICAgICAgIGxheWVySWRzOiBbdGhpcy5wcm9wcy5pZF0sXG4gICAgICAgIHJhZGl1czogdGhpcy5wcm9wcy5waWNraW5nUmFkaXVzLFxuICAgICAgICBkZXB0aDogdGhpcy5wcm9wcy5waWNraW5nRGVwdGhcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLm9uUG9pbnRlck1vdmUoe1xuICAgICAgICBzY3JlZW5Db29yZHMsXG4gICAgICAgIG1hcENvb3JkcyxcbiAgICAgICAgcGlja3MsXG4gICAgICAgIGlzRHJhZ2dpbmcsXG4gICAgICAgIHBvaW50ZXJEb3duUGlja3MsXG4gICAgICAgIHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzLFxuICAgICAgICBwb2ludGVyRG93bk1hcENvb3JkcyxcbiAgICAgICAgc291cmNlRXZlbnQ6IGV2ZW50XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBfb25Qb2ludGVyVXAoZXZlbnQ6IE9iamVjdCkge1xuICAgIGNvbnN0IHNjcmVlbkNvb3JkcyA9IHRoaXMuZ2V0U2NyZWVuQ29vcmRzKGV2ZW50KTtcbiAgICBjb25zdCBtYXBDb29yZHMgPSB0aGlzLmdldE1hcENvb3JkcyhzY3JlZW5Db29yZHMpO1xuXG4gICAgY29uc3Qge1xuICAgICAgcG9pbnRlckRvd25QaWNrcyxcbiAgICAgIHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzLFxuICAgICAgcG9pbnRlckRvd25NYXBDb29yZHMsXG4gICAgICBpc0RyYWdnaW5nXG4gICAgfSA9IHRoaXMuc3RhdGUuX2VkaXRhYmxlTGF5ZXJTdGF0ZTtcblxuICAgIGlmICghcG9pbnRlckRvd25TY3JlZW5Db29yZHMpIHtcbiAgICAgIC8vIFRoaXMgaXMgYSBwb2ludGVyIHVwIHdpdGhvdXQgYSBwb2ludGVyIGRvd24gKGUuZy4gdXNlciBwb2ludGVyIGRvd25lZCBlbHNld2hlcmUpLCBzbyBpZ25vcmVcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoaXNEcmFnZ2luZykge1xuICAgICAgdGhpcy5vblN0b3BEcmFnZ2luZyh7XG4gICAgICAgIHBpY2tzOiBwb2ludGVyRG93blBpY2tzLFxuICAgICAgICBzY3JlZW5Db29yZHMsXG4gICAgICAgIG1hcENvb3JkcyxcbiAgICAgICAgcG9pbnRlckRvd25TY3JlZW5Db29yZHMsXG4gICAgICAgIHBvaW50ZXJEb3duTWFwQ29vcmRzLFxuICAgICAgICBzb3VyY2VFdmVudDogZXZlbnRcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoIXRoaXMubW92ZWRFbm91Z2hGb3JEcmFnKHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzLCBzY3JlZW5Db29yZHMpKSB7XG4gICAgICB0aGlzLm9uTGF5ZXJDbGljayh7XG4gICAgICAgIHBpY2tzOiBwb2ludGVyRG93blBpY2tzLFxuICAgICAgICBzY3JlZW5Db29yZHMsXG4gICAgICAgIG1hcENvb3JkcyxcbiAgICAgICAgc291cmNlRXZlbnQ6IGV2ZW50XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIF9lZGl0YWJsZUxheWVyU3RhdGU6IHtcbiAgICAgICAgLi4udGhpcy5zdGF0ZS5fZWRpdGFibGVMYXllclN0YXRlLFxuICAgICAgICBwb2ludGVyRG93blNjcmVlbkNvb3JkczogbnVsbCxcbiAgICAgICAgcG9pbnRlckRvd25NYXBDb29yZHM6IG51bGwsXG4gICAgICAgIHBvaW50ZXJEb3duUGlja3M6IG51bGwsXG4gICAgICAgIGlzRHJhZ2dpbmc6IGZhbHNlXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBnZXRTY3JlZW5Db29yZHMocG9pbnRlckV2ZW50OiBPYmplY3QpIHtcbiAgICByZXR1cm4gW1xuICAgICAgcG9pbnRlckV2ZW50LmNsaWVudFggLSB0aGlzLmNvbnRleHQuZ2wuY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLngsXG4gICAgICBwb2ludGVyRXZlbnQuY2xpZW50WSAtIHRoaXMuY29udGV4dC5nbC5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkueVxuICAgIF07XG4gIH1cblxuICBnZXRNYXBDb29yZHMoc2NyZWVuQ29vcmRzOiBudW1iZXJbXSkge1xuICAgIHJldHVybiB0aGlzLmNvbnRleHQudmlld3BvcnQudW5wcm9qZWN0KFtzY3JlZW5Db29yZHNbMF0sIHNjcmVlbkNvb3Jkc1sxXV0pO1xuICB9XG5cbiAgbW92ZWRFbm91Z2hGb3JEcmFnKHNjcmVlbkNvb3JkczE6IG51bWJlcltdLCBzY3JlZW5Db29yZHMyOiBudW1iZXJbXSkge1xuICAgIHJldHVybiAoXG4gICAgICBNYXRoLmFicyhzY3JlZW5Db29yZHMxWzBdIC0gc2NyZWVuQ29vcmRzMlswXSkgPiBNSU5JTVVNX1BPSU5URVJfTU9WRV9USFJFU0hPTERfUElYRUxTIHx8XG4gICAgICBNYXRoLmFicyhzY3JlZW5Db29yZHMxWzFdIC0gc2NyZWVuQ29vcmRzMlsxXSkgPiBNSU5JTVVNX1BPSU5URVJfTU9WRV9USFJFU0hPTERfUElYRUxTXG4gICAgKTtcbiAgfVxufVxuXG5FZGl0YWJsZUxheWVyRWRpdE1vZGVQb2MubGF5ZXJOYW1lID0gJ0VkaXRhYmxlTGF5ZXJFZGl0TW9kZVBvYyc7XG4iXX0=