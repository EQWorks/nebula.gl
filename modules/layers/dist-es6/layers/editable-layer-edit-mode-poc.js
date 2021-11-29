"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _keplerOutdatedDeck = require("kepler-outdated-deck.gl-core");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Minimum number of pixels the pointer must move from the original pointer down to be considered dragging
var MINIMUM_POINTER_MOVE_THRESHOLD_PIXELS = 7;

class EditableLayerEditModePoc extends _keplerOutdatedDeck.CompositeLayer {
  // Overridable interaction event handlers
  onLayerClick(event) {// default implementation - do nothing
  }

  onDoubleClick(event) {// default implementation - do nothing
  }

  onStartDragging(event) {// default implementation - do nothing
  }

  onStopDragging(event) {// default implementation - do nothing
  }

  onPointerMove(event) {} // default implementation - do nothing
  // TODO: implement onCancelDragging (e.g. drag off screen)


  initializeState() {
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

  finalizeState() {
    this._removePointerHandlers();
  }

  updateState(_ref) {
    var props = _ref.props,
        changeFlags = _ref.changeFlags;

    // unsubscribe previous layer instance's handlers
    this._removePointerHandlers();

    this._addPointerHandlers();
  }

  _removePointerHandlers() {
    if (this.state._editableLayerState.pointerHandlers) {
      this.context.gl.canvas.removeEventListener('pointermove', this.state._editableLayerState.pointerHandlers.onPointerMove);
      this.context.gl.canvas.removeEventListener('pointerdown', this.state._editableLayerState.pointerHandlers.onPointerDown);
      this.context.gl.canvas.removeEventListener('pointerup', this.state._editableLayerState.pointerHandlers.onPointerUp);
      this.context.gl.canvas.removeEventListener('dblclick', this.state._editableLayerState.pointerHandlers.onDoubleClick);
    }

    this.state._editableLayerState.pointerHandlers = null;
  }

  _addPointerHandlers() {
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

  _onDoubleClick(event) {
    var screenCoords = this.getScreenCoords(event);
    var mapCoords = this.getMapCoords(screenCoords);
    this.onDoubleClick({
      mapCoords: mapCoords,
      sourceEvent: event
    });
  }

  _onPointerDown(event) {
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

  _onPointerMove(event) {
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

  _onPointerUp(event) {
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

  getScreenCoords(pointerEvent) {
    return [pointerEvent.clientX - this.context.gl.canvas.getBoundingClientRect().x, pointerEvent.clientY - this.context.gl.canvas.getBoundingClientRect().y];
  }

  getMapCoords(screenCoords) {
    return this.context.viewport.unproject([screenCoords[0], screenCoords[1]]);
  }

  movedEnoughForDrag(screenCoords1, screenCoords2) {
    return Math.abs(screenCoords1[0] - screenCoords2[0]) > MINIMUM_POINTER_MOVE_THRESHOLD_PIXELS || Math.abs(screenCoords1[1] - screenCoords2[1]) > MINIMUM_POINTER_MOVE_THRESHOLD_PIXELS;
  }

}

exports.default = EditableLayerEditModePoc;
EditableLayerEditModePoc.layerName = 'EditableLayerEditModePoc';
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sYXllcnMvZWRpdGFibGUtbGF5ZXItZWRpdC1tb2RlLXBvYy5qcyJdLCJuYW1lcyI6WyJNSU5JTVVNX1BPSU5URVJfTU9WRV9USFJFU0hPTERfUElYRUxTIiwiRWRpdGFibGVMYXllckVkaXRNb2RlUG9jIiwiQ29tcG9zaXRlTGF5ZXIiLCJvbkxheWVyQ2xpY2siLCJldmVudCIsIm9uRG91YmxlQ2xpY2siLCJvblN0YXJ0RHJhZ2dpbmciLCJvblN0b3BEcmFnZ2luZyIsIm9uUG9pbnRlck1vdmUiLCJpbml0aWFsaXplU3RhdGUiLCJzZXRTdGF0ZSIsIl9lZGl0YWJsZUxheWVyU3RhdGUiLCJwb2ludGVySGFuZGxlcnMiLCJwb2ludGVyRG93blBpY2tzIiwicG9pbnRlckRvd25TY3JlZW5Db29yZHMiLCJwb2ludGVyRG93bk1hcENvb3JkcyIsImlzRHJhZ2dpbmciLCJmaW5hbGl6ZVN0YXRlIiwiX3JlbW92ZVBvaW50ZXJIYW5kbGVycyIsInVwZGF0ZVN0YXRlIiwicHJvcHMiLCJjaGFuZ2VGbGFncyIsIl9hZGRQb2ludGVySGFuZGxlcnMiLCJzdGF0ZSIsImNvbnRleHQiLCJnbCIsImNhbnZhcyIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJvblBvaW50ZXJEb3duIiwib25Qb2ludGVyVXAiLCJfb25Qb2ludGVyTW92ZSIsImJpbmQiLCJfb25Qb2ludGVyRG93biIsIl9vblBvaW50ZXJVcCIsIl9vbkRvdWJsZUNsaWNrIiwiYWRkRXZlbnRMaXN0ZW5lciIsInNjcmVlbkNvb3JkcyIsImdldFNjcmVlbkNvb3JkcyIsIm1hcENvb3JkcyIsImdldE1hcENvb3JkcyIsInNvdXJjZUV2ZW50IiwicGlja3MiLCJkZWNrIiwicGlja011bHRpcGxlT2JqZWN0cyIsIngiLCJ5IiwibGF5ZXJJZHMiLCJpZCIsInJhZGl1cyIsInBpY2tpbmdSYWRpdXMiLCJkZXB0aCIsInBpY2tpbmdEZXB0aCIsInN0YXJ0ZWREcmFnZ2luZyIsIm1vdmVkRW5vdWdoRm9yRHJhZyIsInBvaW50ZXJFdmVudCIsImNsaWVudFgiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJjbGllbnRZIiwidmlld3BvcnQiLCJ1bnByb2plY3QiLCJzY3JlZW5Db29yZHMxIiwic2NyZWVuQ29vcmRzMiIsIk1hdGgiLCJhYnMiLCJsYXllck5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFHQTs7Ozs7O0FBU0E7QUFDQSxJQUFNQSxxQ0FBcUMsR0FBRyxDQUE5Qzs7QUFFZSxNQUFNQyx3QkFBTixTQUF1Q0Msa0NBQXZDLENBQXNEO0FBQ25FO0FBQ0FDLEVBQUFBLFlBQVksQ0FBQ0MsS0FBRCxFQUFvQixDQUM5QjtBQUNEOztBQUVEQyxFQUFBQSxhQUFhLENBQUNELEtBQUQsRUFBMEIsQ0FDckM7QUFDRDs7QUFFREUsRUFBQUEsZUFBZSxDQUFDRixLQUFELEVBQTRCLENBQ3pDO0FBQ0Q7O0FBRURHLEVBQUFBLGNBQWMsQ0FBQ0gsS0FBRCxFQUEyQixDQUN2QztBQUNEOztBQUVESSxFQUFBQSxhQUFhLENBQUNKLEtBQUQsRUFBMEIsQ0FFdEMsQ0FGWSxDQUNYO0FBR0Y7OztBQUVBSyxFQUFBQSxlQUFlLEdBQUc7QUFDaEIsU0FBS0MsUUFBTCxDQUFjO0FBQ1pDLE1BQUFBLG1CQUFtQixFQUFFO0FBQ25CO0FBQ0FDLFFBQUFBLGVBQWUsRUFBRSxJQUZFO0FBR25CO0FBQ0FDLFFBQUFBLGdCQUFnQixFQUFFLElBSkM7QUFLbkI7QUFDQUMsUUFBQUEsdUJBQXVCLEVBQUUsSUFOTjtBQU9uQjtBQUNBQyxRQUFBQSxvQkFBb0IsRUFBRSxJQVJIO0FBU25CO0FBQ0FDLFFBQUFBLFVBQVUsRUFBRTtBQVZPO0FBRFQsS0FBZDtBQWNEOztBQUVEQyxFQUFBQSxhQUFhLEdBQUc7QUFDZCxTQUFLQyxzQkFBTDtBQUNEOztBQUVEQyxFQUFBQSxXQUFXLE9BQWlDO0FBQUEsUUFBOUJDLEtBQThCLFFBQTlCQSxLQUE4QjtBQUFBLFFBQXZCQyxXQUF1QixRQUF2QkEsV0FBdUI7O0FBQzFDO0FBQ0EsU0FBS0gsc0JB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QUExQixFQUFtRDtBQUNuRSxXQUNFQyxJQUFJLENBQUNDLEdBQUwsQ0FBU0gsYUFBYSxDQUFDLENBQUQsQ0FBYixHQUFtQkMsYUFBYSxDQUFDLENBQUQsQ0FBekMsSUFBZ0Q3RCxxQ0FBaEQsSUFDQThELElBQUksQ0FBQ0MsR0FBTCxDQUFTSCxhQUFhLENBQUMsQ0FBRCxDQUFiLEdBQW1CQyxhQUFhLENBQUMsQ0FBRCxDQUF6QyxJQUFnRDdELHFDQUZsRDtBQUlEOztBQWhRa0U7OztBQW1RckVDLHdCQUF3QixDQUFDK0QsU0FBekIsR0FBcUMsMEJBQXJDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcbi8qIGVzbGludC1lbnYgYnJvd3NlciAqL1xuXG5pbXBvcnQgeyBDb21wb3NpdGVMYXllciB9IGZyb20gJ2tlcGxlci1vdXRkYXRlZC1kZWNrLmdsLWNvcmUnO1xuaW1wb3J0IHR5cGUge1xuICBDbGlja0V2ZW50LFxuICBTdGFydERyYWdnaW5nRXZlbnQsXG4gIFN0b3BEcmFnZ2luZ0V2ZW50LFxuICBQb2ludGVyTW92ZUV2ZW50LFxuICBEb3VibGVDbGlja0V2ZW50XG59IGZyb20gJ2tlcGxlci1vdXRkYXRlZC1uZWJ1bGEuZ2wtZWRpdC1tb2Rlcyc7XG5cbi8vIE1pbmltdW0gbnVtYmVyIG9mIHBpeGVscyB0aGUgcG9pbnRlciBtdXN0IG1vdmUgZnJvbSB0aGUgb3JpZ2luYWwgcG9pbnRlciBkb3duIHRvIGJlIGNvbnNpZGVyZWQgZHJhZ2dpbmdcbmNvbnN0IE1JTklNVU1fUE9JTlRFUl9NT1ZFX1RIUkVTSE9MRF9QSVhFTFMgPSA3O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFZGl0YWJsZUxheWVyRWRpdE1vZGVQb2MgZXh0ZW5kcyBDb21wb3NpdGVMYXllciB7XG4gIC8vIE92ZXJyaWRhYmxlIGludGVyYWN0aW9uIGV2ZW50IGhhbmRsZXJzXG4gIG9uTGF5ZXJDbGljayhldmVudDogQ2xpY2tFdmVudCkge1xuICAgIC8vIGRlZmF1bHQgaW1wbGVtZW50YXRpb24gLSBkbyBub3RoaW5nXG4gIH1cblxuICBvbkRvdWJsZUNsaWNrKGV2ZW50OiBEb3VibGVDbGlja0V2ZW50KSB7XG4gICAgLy8gZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiAtIGRvIG5vdGhpbmdcbiAgfVxuXG4gIG9uU3RhcnREcmFnZ2luZyhldmVudDogU3RhcnREcmFnZ2luZ0V2ZW50KSB7XG4gICAgLy8gZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiAtIGRvIG5vdGhpbmdcbiAgfVxuXG4gIG9uU3RvcERyYWdnaW5nKGV2ZW50OiBTdG9wRHJhZ2dpbmdFdmVudCkge1xuICAgIC8vIGRlZmF1bHQgaW1wbGVtZW50YXRpb24gLSBkbyBub3RoaW5nXG4gIH1cblxuICBvblBvaW50ZXJNb3ZlKGV2ZW50OiBQb2ludGVyTW92ZUV2ZW50KSB7XG4gICAgLy8gZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiAtIGRvIG5vdGhpbmdcbiAgfVxuXG4gIC8vIFRPRE86IGltcGxlbWVudCBvbkNhbmNlbERyYWdnaW5nIChlLmcuIGRyYWcgb2ZmIHNjcmVlbilcblxuICBpbml0aWFsaXplU3RhdGUoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBfZWRpdGFibGVMYXllclN0YXRlOiB7XG4gICAgICAgIC8vIFBvaW50ZXIgZXZlbnQgaGFuZGxlcnNcbiAgICAgICAgcG9pbnRlckhhbmRsZXJzOiBudWxsLFxuICAgICAgICAvLyBQaWNrZWQgb2JqZWN0cyBhdCB0aGUgdGltZSB0aGUgcG9pbnRlciB3ZW50IGRvd25cbiAgICAgICAgcG9pbnRlckRvd25QaWNrczogbnVsbCxcbiAgICAgICAgLy8gU2NyZWVuIGNvb3JkaW5hdGVzIHdoZXJlIHRoZSBwb2ludGVyIHdlbnQgZG93blxuICAgICAgICBwb2ludGVyRG93blNjcmVlbkNvb3JkczogbnVsbCxcbiAgICAgICAgLy8gR3JvdW5kIGNvb3JkaW5hdGVzIHdoZXJlIHRoZSBwb2ludGVyIHdlbnQgZG93blxuICAgICAgICBwb2ludGVyRG93bk1hcENvb3JkczogbnVsbCxcbiAgICAgICAgLy8gSXMgdGhlIHBvaW50ZXIgZHJhZ2dpbmcgKHBvaW50ZXIgZG93biArIG1vdmVkIGF0IGxlYXN0IE1JTklNVU1fUE9JTlRFUl9NT1ZFX1RIUkVTSE9MRF9QSVhFTFMpXG4gICAgICAgIGlzRHJhZ2dpbmc6IGZhbHNlXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBmaW5hbGl6ZVN0YXRlKCkge1xuICAgIHRoaXMuX3JlbW92ZVBvaW50ZXJIYW5kbGVycygpO1xuICB9XG5cbiAgdXBkYXRlU3RhdGUoeyBwcm9wcywgY2hhbmdlRmxhZ3MgfTogT2JqZWN0KSB7XG4gICAgLy8gdW5zdWJzY3JpYmUgcHJldmlvdXMgbGF5ZXIgaW5zdGFuY2UncyBoYW5kbGVyc1xuICAgIHRoaXMuX3JlbW92ZVBvaW50ZXJIYW5kbGVycygpO1xuICAgIHRoaXMuX2FkZFBvaW50ZXJIYW5kbGVycygpO1xuICB9XG5cbiAgX3JlbW92ZVBvaW50ZXJIYW5kbGVycygpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5fZWRpdGFibGVMYXllclN0YXRlLnBvaW50ZXJIYW5kbGVycykge1xuICAgICAgdGhpcy5jb250ZXh0LmdsLmNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKFxuICAgICAgICAncG9pbnRlcm1vdmUnLFxuICAgICAgICB0aGlzLnN0YXRlLl9lZGl0YWJsZUxheWVyU3RhdGUucG9pbnRlckhhbmRsZXJzLm9uUG9pbnRlck1vdmVcbiAgICAgICk7XG4gICAgICB0aGlzLmNvbnRleHQuZ2wuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoXG4gICAgICAgICdwb2ludGVyZG93bicsXG4gICAgICAgIHRoaXMuc3RhdGUuX2VkaXRhYmxlTGF5ZXJTdGF0ZS5wb2ludGVySGFuZGxlcnMub25Qb2ludGVyRG93blxuICAgICAgKTtcbiAgICAgIHRoaXMuY29udGV4dC5nbC5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgJ3BvaW50ZXJ1cCcsXG4gICAgICAgIHRoaXMuc3RhdGUuX2VkaXRhYmxlTGF5ZXJTdGF0ZS5wb2ludGVySGFuZGxlcnMub25Qb2ludGVyVXBcbiAgICAgICk7XG4gICAgICB0aGlzLmNvbnRleHQuZ2wuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoXG4gICAgICAgICdkYmxjbGljaycsXG4gICAgICAgIHRoaXMuc3RhdGUuX2VkaXRhYmxlTGF5ZXJTdGF0ZS5wb2ludGVySGFuZGxlcnMub25Eb3VibGVDbGlja1xuICAgICAgKTtcbiAgICB9XG4gICAgdGhpcy5zdGF0ZS5fZWRpdGFibGVMYXllclN0YXRlLnBvaW50ZXJIYW5kbGVycyA9IG51bGw7XG4gIH1cblxuICBfYWRkUG9pbnRlckhhbmRsZXJzKCkge1xuICAgIHRoaXMuc3RhdGUuX2VkaXRhYmxlTGF5ZXJTdGF0ZS5wb2ludGVySGFuZGxlcnMgPSB7XG4gICAgICBvblBvaW50ZXJNb3ZlOiB0aGlzLl9vblBvaW50ZXJNb3ZlLmJpbmQodGhpcyksXG4gICAgICBvblBvaW50ZXJEb3duOiB0aGlzLl9vblBvaW50ZXJEb3duLmJpbmQodGhpcyksXG4gICAgICBvblBvaW50ZXJVcDogdGhpcy5fb25Qb2ludGVyVXAuYmluZCh0aGlzKSxcbiAgICAgIG9uRG91YmxlQ2xpY2s6IHRoaXMuX29uRG91YmxlQ2xpY2suYmluZCh0aGlzKVxuICAgIH07XG5cbiAgICB0aGlzLmNvbnRleHQuZ2wuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAncG9pbnRlcm1vdmUnLFxuICAgICAgdGhpcy5zdGF0ZS5fZWRpdGFibGVMYXllclN0YXRlLnBvaW50ZXJIYW5kbGVycy5vblBvaW50ZXJNb3ZlXG4gICAgKTtcbiAgICB0aGlzLmNvbnRleHQuZ2wuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAncG9pbnRlcmRvd24nLFxuICAgICAgdGhpcy5zdGF0ZS5fZWRpdGFibGVMYXllclN0YXRlLnBvaW50ZXJIYW5kbGVycy5vblBvaW50ZXJEb3duXG4gICAgKTtcbiAgICB0aGlzLmNvbnRleHQuZ2wuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAncG9pbnRlcnVwJyxcbiAgICAgIHRoaXMuc3RhdGUuX2VkaXRhYmxlTGF5ZXJTdGF0ZS5wb2ludGVySGFuZGxlcnMub25Qb2ludGVyVXBcbiAgICApO1xuICAgIHRoaXMuY29udGV4dC5nbC5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICdkYmxjbGljaycsXG4gICAgICB0aGlzLnN0YXRlLl9lZGl0YWJsZUxheWVyU3RhdGUucG9pbnRlckhhbmRsZXJzLm9uRG91YmxlQ2xpY2tcbiAgICApO1xuICB9XG5cbiAgX29uRG91YmxlQ2xpY2soZXZlbnQ6IE9iamVjdCkge1xuICAgIGNvbnN0IHNjcmVlbkNvb3JkcyA9IHRoaXMuZ2V0U2NyZWVuQ29vcmRzKGV2ZW50KTtcbiAgICBjb25zdCBtYXBDb29yZHMgPSB0aGlzLmdldE1hcENvb3JkcyhzY3JlZW5Db29yZHMpO1xuICAgIHRoaXMub25Eb3VibGVDbGljayh7XG4gICAgICBtYXBDb29yZHMsXG4gICAgICBzb3VyY2VFdmVudDogZXZlbnRcbiAgICB9KTtcbiAgfVxuXG4gIF9vblBvaW50ZXJEb3duKGV2ZW50OiBPYmplY3QpIHtcbiAgICBjb25zdCBzY3JlZW5Db29yZHMgPSB0aGlzLmdldFNjcmVlbkNvb3JkcyhldmVudCk7XG4gICAgY29uc3QgbWFwQ29vcmRzID0gdGhpcy5nZXRNYXBDb29yZHMoc2NyZWVuQ29vcmRzKTtcblxuICAgIGNvbnN0IHBpY2tzID0gdGhpcy5jb250ZXh0LmRlY2sucGlja011bHRpcGxlT2JqZWN0cyh7XG4gICAgICB4OiBzY3JlZW5Db29yZHNbMF0sXG4gICAgICB5OiBzY3JlZW5Db29yZHNbMV0sXG4gICAgICBsYXllcklkczogW3RoaXMucHJvcHMuaWRdLFxuICAgICAgcmFkaXVzOiB0aGlzLnByb3BzLnBpY2tpbmdSYWRpdXMsXG4gICAgICBkZXB0aDogdGhpcy5wcm9wcy5waWNraW5nRGVwdGhcbiAgICB9KTtcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgX2VkaXRhYmxlTGF5ZXJTdGF0ZToge1xuICAgICAgICAuLi50aGlzLnN0YXRlLl9lZGl0YWJsZUxheWVyU3RhdGUsXG4gICAgICAgIHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzOiBzY3JlZW5Db29yZHMsXG4gICAgICAgIHBvaW50ZXJEb3duTWFwQ29vcmRzOiBtYXBDb29yZHMsXG4gICAgICAgIHBvaW50ZXJEb3duUGlja3M6IHBpY2tzLFxuICAgICAgICBpc0RyYWdnaW5nOiBmYWxzZVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgX29uUG9pbnRlck1vdmUoZXZlbnQ6IE9iamVjdCkge1xuICAgIGNvbnN0IHNjcmVlbkNvb3JkcyA9IHRoaXMuZ2V0U2NyZWVuQ29vcmRzKGV2ZW50KTtcbiAgICBjb25zdCBtYXBDb29yZHMgPSB0aGlzLmdldE1hcENvb3JkcyhzY3JlZW5Db29yZHMpO1xuXG4gICAgY29uc3Qge1xuICAgICAgcG9pbnRlckRvd25QaWNrcyxcbiAgICAgIHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzLFxuICAgICAgcG9pbnRlckRvd25NYXBDb29yZHNcbiAgICB9ID0gdGhpcy5zdGF0ZS5fZWRpdGFibGVMYXllclN0YXRlO1xuXG4gICAgbGV0IHsgaXNEcmFnZ2luZyB9ID0gdGhpcy5zdGF0ZS5fZWRpdGFibGVMYXllclN0YXRlO1xuICAgIGxldCBzdGFydGVkRHJhZ2dpbmcgPSBmYWxzZTtcblxuICAgIGlmIChwb2ludGVyRG93blNjcmVlbkNvb3Jkcykge1xuICAgICAgLy8gUG9pbnRlciB3ZW50IGRvd24gYW5kIGlzIG1vdmluZ1xuXG4gICAgICAvLyBEaWQgaXQgbW92ZSBlbm91Z2ggdG8gY29uc2lkZXIgaXQgYSBkcmFnXG4gICAgICBpZiAoIWlzRHJhZ2dpbmcgJiYgdGhpcy5tb3ZlZEVub3VnaEZvckRyYWcocG9pbnRlckRvd25TY3JlZW5Db29yZHMsIHNjcmVlbkNvb3JkcykpIHtcbiAgICAgICAgLy8gT0ssIHRoaXMgaXMgY29uc2lkZXJlZCBkcmFnZ2luZ1xuXG4gICAgICAgIC8vIEZpcmUgdGhlIHN0YXJ0IGRyYWdnaW5nIGV2ZW50XG4gICAgICAgIHRoaXMub25TdGFydERyYWdnaW5nKHtcbiAgICAgICAgICBwaWNrczogcG9pbnRlckRvd25QaWNrcyxcbiAgICAgICAgICBzY3JlZW5Db29yZHMsXG4gICAgICAgICAgbWFwQ29vcmRzLFxuICAgICAgICAgIHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzLFxuICAgICAgICAgIHBvaW50ZXJEb3duTWFwQ29vcmRzLFxuICAgICAgICAgIHNvdXJjZUV2ZW50OiBldmVudFxuICAgICAgICB9KTtcblxuICAgICAgICBzdGFydGVkRHJhZ2dpbmcgPSB0cnVlO1xuXG4gICAgICAgIGlzRHJhZ2dpbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBfZWRpdGFibGVMYXllclN0YXRlOiB7XG4gICAgICAgICAgICAuLi50aGlzLnN0YXRlLl9lZGl0YWJsZUxheWVyU3RhdGUsXG4gICAgICAgICAgICBpc0RyYWdnaW5nXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIXN0YXJ0ZWREcmFnZ2luZykge1xuICAgICAgY29uc3QgcGlja3MgPSB0aGlzLmNvbnRleHQuZGVjay5waWNrTXVsdGlwbGVPYmplY3RzKHtcbiAgICAgICAgeDogc2NyZWVuQ29vcmRzWzBdLFxuICAgICAgICB5OiBzY3JlZW5Db29yZHNbMV0sXG4gICAgICAgIGxheWVySWRzOiBbdGhpcy5wcm9wcy5pZF0sXG4gICAgICAgIHJhZGl1czogdGhpcy5wcm9wcy5waWNraW5nUmFkaXVzLFxuICAgICAgICBkZXB0aDogdGhpcy5wcm9wcy5waWNraW5nRGVwdGhcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLm9uUG9pbnRlck1vdmUoe1xuICAgICAgICBzY3JlZW5Db29yZHMsXG4gICAgICAgIG1hcENvb3JkcyxcbiAgICAgICAgcGlja3MsXG4gICAgICAgIGlzRHJhZ2dpbmcsXG4gICAgICAgIHBvaW50ZXJEb3duUGlja3MsXG4gICAgICAgIHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzLFxuICAgICAgICBwb2ludGVyRG93bk1hcENvb3JkcyxcbiAgICAgICAgc291cmNlRXZlbnQ6IGV2ZW50XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBfb25Qb2ludGVyVXAoZXZlbnQ6IE9iamVjdCkge1xuICAgIGNvbnN0IHNjcmVlbkNvb3JkcyA9IHRoaXMuZ2V0U2NyZWVuQ29vcmRzKGV2ZW50KTtcbiAgICBjb25zdCBtYXBDb29yZHMgPSB0aGlzLmdldE1hcENvb3JkcyhzY3JlZW5Db29yZHMpO1xuXG4gICAgY29uc3Qge1xuICAgICAgcG9pbnRlckRvd25QaWNrcyxcbiAgICAgIHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzLFxuICAgICAgcG9pbnRlckRvd25NYXBDb29yZHMsXG4gICAgICBpc0RyYWdnaW5nXG4gICAgfSA9IHRoaXMuc3RhdGUuX2VkaXRhYmxlTGF5ZXJTdGF0ZTtcblxuICAgIGlmICghcG9pbnRlckRvd25TY3JlZW5Db29yZHMpIHtcbiAgICAgIC8vIFRoaXMgaXMgYSBwb2ludGVyIHVwIHdpdGhvdXQgYSBwb2ludGVyIGRvd24gKGUuZy4gdXNlciBwb2ludGVyIGRvd25lZCBlbHNld2hlcmUpLCBzbyBpZ25vcmVcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoaXNEcmFnZ2luZykge1xuICAgICAgdGhpcy5vblN0b3BEcmFnZ2luZyh7XG4gICAgICAgIHBpY2tzOiBwb2ludGVyRG93blBpY2tzLFxuICAgICAgICBzY3JlZW5Db29yZHMsXG4gICAgICAgIG1hcENvb3JkcyxcbiAgICAgICAgcG9pbnRlckRvd25TY3JlZW5Db29yZHMsXG4gICAgICAgIHBvaW50ZXJEb3duTWFwQ29vcmRzLFxuICAgICAgICBzb3VyY2VFdmVudDogZXZlbnRcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoIXRoaXMubW92ZWRFbm91Z2hGb3JEcmFnKHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzLCBzY3JlZW5Db29yZHMpKSB7XG4gICAgICB0aGlzLm9uTGF5ZXJDbGljayh7XG4gICAgICAgIHBpY2tzOiBwb2ludGVyRG93blBpY2tzLFxuICAgICAgICBzY3JlZW5Db29yZHMsXG4gICAgICAgIG1hcENvb3JkcyxcbiAgICAgICAgc291cmNlRXZlbnQ6IGV2ZW50XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIF9lZGl0YWJsZUxheWVyU3RhdGU6IHtcbiAgICAgICAgLi4udGhpcy5zdGF0ZS5fZWRpdGFibGVMYXllclN0YXRlLFxuICAgICAgICBwb2ludGVyRG93blNjcmVlbkNvb3JkczogbnVsbCxcbiAgICAgICAgcG9pbnRlckRvd25NYXBDb29yZHM6IG51bGwsXG4gICAgICAgIHBvaW50ZXJEb3duUGlja3M6IG51bGwsXG4gICAgICAgIGlzRHJhZ2dpbmc6IGZhbHNlXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBnZXRTY3JlZW5Db29yZHMocG9pbnRlckV2ZW50OiBPYmplY3QpIHtcbiAgICByZXR1cm4gW1xuICAgICAgcG9pbnRlckV2ZW50LmNsaWVudFggLSB0aGlzLmNvbnRleHQuZ2wuY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLngsXG4gICAgICBwb2ludGVyRXZlbnQuY2xpZW50WSAtIHRoaXMuY29udGV4dC5nbC5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkueVxuICAgIF07XG4gIH1cblxuICBnZXRNYXBDb29yZHMoc2NyZWVuQ29vcmRzOiBudW1iZXJbXSkge1xuICAgIHJldHVybiB0aGlzLmNvbnRleHQudmlld3BvcnQudW5wcm9qZWN0KFtzY3JlZW5Db29yZHNbMF0sIHNjcmVlbkNvb3Jkc1sxXV0pO1xuICB9XG5cbiAgbW92ZWRFbm91Z2hGb3JEcmFnKHNjcmVlbkNvb3JkczE6IG51bWJlcltdLCBzY3JlZW5Db29yZHMyOiBudW1iZXJbXSkge1xuICAgIHJldHVybiAoXG4gICAgICBNYXRoLmFicyhzY3JlZW5Db29yZHMxWzBdIC0gc2NyZWVuQ29vcmRzMlswXSkgPiBNSU5JTVVNX1BPSU5URVJfTU9WRV9USFJFU0hPTERfUElYRUxTIHx8XG4gICAgICBNYXRoLmFicyhzY3JlZW5Db29yZHMxWzFdIC0gc2NyZWVuQ29vcmRzMlsxXSkgPiBNSU5JTVVNX1BPSU5URVJfTU9WRV9USFJFU0hPTERfUElYRUxTXG4gICAgKTtcbiAgfVxufVxuXG5FZGl0YWJsZUxheWVyRWRpdE1vZGVQb2MubGF5ZXJOYW1lID0gJ0VkaXRhYmxlTGF5ZXJFZGl0TW9kZVBvYyc7XG4iXX0=