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
var MINIMUM_POINTER_MOVE_THRESHOLD_PIXELS = 7;

var EditableLayer =
/*#__PURE__*/
function (_CompositeLayer) {
  _inherits(EditableLayer, _CompositeLayer);

  function EditableLayer() {
    _classCallCheck(this, EditableLayer);

    return _possibleConstructorReturn(this, _getPrototypeOf(EditableLayer).apply(this, arguments));
  }

  _createClass(EditableLayer, [{
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
          pointerDownGroundCoords: null,
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
      var groundCoords = this.getGroundCoords(screenCoords);
      this.onDoubleClick({
        groundCoords: groundCoords,
        sourceEvent: event
      });
    }
  }, {
    key: "_onPointerDown",
    value: function _onPointerDown(event) {
      var screenCoords = this.getScreenCoords(event);
      var groundCoords = this.getGroundCoords(screenCoords);
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
          pointerDownGroundCoords: groundCoords,
          pointerDownPicks: picks,
          isDragging: false
        })
      });
    }
  }, {
    key: "_onPointerMove",
    value: function _onPointerMove(event) {
      var screenCoords = this.getScreenCoords(event);
      var groundCoords = this.getGroundCoords(screenCoords);
      var _this$state$_editable = this.state._editableLayerState,
          pointerDownPicks = _this$state$_editable.pointerDownPicks,
          pointerDownScreenCoords = _this$state$_editable.pointerDownScreenCoords,
          pointerDownGroundCoords = _this$state$_editable.pointerDownGroundCoords;
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
            groundCoords: groundCoords,
            pointerDownScreenCoords: pointerDownScreenCoords,
            pointerDownGroundCoords: pointerDownGroundCoords,
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
        radius: this.props.pickingRadius,
        depth: this.props.pickingDepth
      });
      this.onPointerMove({
        screenCoords: screenCoords,
        groundCoords: groundCoords,
        picks: picks,
        isDragging: isDragging,
        pointerDownPicks: pointerDownPicks,
        pointerDownScreenCoords: pointerDownScreenCoords,
        pointerDownGroundCoords: pointerDownGroundCoords,
        sourceEvent: event
      });
    }
  }, {
    key: "_onPointerUp",
    value: function _onPointerUp(event) {
      var screenCoords = this.getScreenCoords(event);
      var groundCoords = this.getGroundCoords(screenCoords);
      var _this$state$_editable2 = this.state._editableLayerState,
          pointerDownPicks = _this$state$_editable2.pointerDownPicks,
          pointerDownScreenCoords = _this$state$_editable2.pointerDownScreenCoords,
          pointerDownGroundCoords = _this$state$_editable2.pointerDownGroundCoords,
          isDragging = _this$state$_editable2.isDragging;

      if (!pointerDownScreenCoords) {
        // This is a pointer up without a pointer down (e.g. user pointer downed elsewhere), so ignore
        return;
      }

      if (isDragging) {
        this.onStopDragging({
          picks: pointerDownPicks,
          screenCoords: screenCoords,
          groundCoords: groundCoords,
          pointerDownScreenCoords: pointerDownScreenCoords,
          pointerDownGroundCoords: pointerDownGroundCoords,
          sourceEvent: event
        });
      } else if (!this.movedEnoughForDrag(pointerDownScreenCoords, screenCoords)) {
        this.onLayerClick({
          picks: pointerDownPicks,
          screenCoords: screenCoords,
          groundCoords: groundCoords,
          sourceEvent: event
        });
      }

      this.setState({
        _editableLayerState: _objectSpread({}, this.state._editableLayerState, {
          pointerDownScreenCoords: null,
          pointerDownGroundCoords: null,
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
    key: "getGroundCoords",
    value: function getGroundCoords(screenCoords) {
      return this.context.viewport.unproject([screenCoords[0], screenCoords[1]]);
    }
  }, {
    key: "movedEnoughForDrag",
    value: function movedEnoughForDrag(screenCoords1, screenCoords2) {
      return Math.abs(screenCoords1[0] - screenCoords2[0]) > MINIMUM_POINTER_MOVE_THRESHOLD_PIXELS || Math.abs(screenCoords1[1] - screenCoords2[1]) > MINIMUM_POINTER_MOVE_THRESHOLD_PIXELS;
    }
  }]);

  return EditableLayer;
}(_keplerOudatedDeck.CompositeLayer);

exports.default = EditableLayer;
EditableLayer.layerName = 'EditableLayer';
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sYXllcnMvZWRpdGFibGUtbGF5ZXIuanMiXSwibmFtZXMiOlsiTUlOSU1VTV9QT0lOVEVSX01PVkVfVEhSRVNIT0xEX1BJWEVMUyIsIkVkaXRhYmxlTGF5ZXIiLCJldmVudCIsInNldFN0YXRlIiwiX2VkaXRhYmxlTGF5ZXJTdGF0ZSIsInBvaW50ZXJIYW5kbGVycyIsInBvaW50ZXJEb3duUGlja3MiLCJwb2ludGVyRG93blNjcmVlbkNvb3JkcyIsInBvaW50ZXJEb3duR3JvdW5kQ29vcmRzIiwiaXNEcmFnZ2luZyIsIl9yZW1vdmVQb2ludGVySGFuZGxlcnMiLCJwcm9wcyIsImNoYW5nZUZsYWdzIiwiX2FkZFBvaW50ZXJIYW5kbGVycyIsInN0YXRlIiwiY29udGV4dCIsImdsIiwiY2FudmFzIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIm9uUG9pbnRlck1vdmUiLCJvblBvaW50ZXJEb3duIiwib25Qb2ludGVyVXAiLCJvbkRvdWJsZUNsaWNrIiwiX29uUG9pbnRlck1vdmUiLCJiaW5kIiwiX29uUG9pbnRlckRvd24iLCJfb25Qb2ludGVyVXAiLCJfb25Eb3VibGVDbGljayIsImFkZEV2ZW50TGlzdGVuZXIiLCJzY3JlZW5Db29yZHMiLCJnZXRTY3JlZW5Db29yZHMiLCJncm91bmRDb29yZHMiLCJnZXRHcm91bmRDb29yZHMiLCJzb3VyY2VFdmVudCIsInBpY2tzIiwiZGVjayIsInBpY2tNdWx0aXBsZU9iamVjdHMiLCJ4IiwieSIsImxheWVySWRzIiwiaWQiLCJyYWRpdXMiLCJwaWNraW5nUmFkaXVzIiwiZGVwdGgiLCJwaWNraW5nRGVwdGgiLCJtb3ZlZEVub3VnaEZvckRyYWciLCJvblN0YXJ0RHJhZ2dpbmciLCJvblN0b3BEcmFnZ2luZyIsIm9uTGF5ZXJDbGljayIsInBvaW50ZXJFdmVudCIsImNsaWVudFgiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJjbGllbnRZIiwidmlld3BvcnQiLCJ1bnByb2plY3QiLCJzY3JlZW5Db29yZHMxIiwic2NyZWVuQ29vcmRzMiIsIk1hdGgiLCJhYnMiLCJDb21wb3NpdGVMYXllciIsImxheWVyTmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUdBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFTQTtBQUNBLElBQU1BLHFDQUFxQyxHQUFHLENBQTlDOztJQUVxQkMsYTs7Ozs7Ozs7Ozs7OztBQUNuQjtpQ0FDYUMsSyxFQUFtQixDQUM5QjtBQUNEOzs7a0NBRWFBLEssRUFBeUIsQ0FDckM7QUFDRDs7O29DQUVlQSxLLEVBQTJCLENBQ3pDO0FBQ0Q7OzttQ0FFY0EsSyxFQUEwQixDQUN2QztBQUNEOzs7a0NBRWFBLEssRUFBeUIsQ0FFdEMsQyxDQURDO0FBR0Y7Ozs7c0NBRWtCO0FBQ2hCLFdBQUtDLFFBQUwsQ0FBYztBQUNaQyxRQUFBQSxtQkFBbUIsRUFBRTtBQUNuQjtBQUNBQyxVQUFBQSxlQUFlLEVBQUUsSUFGRTtBQUduQjtBQUNBQyxVQUFBQSxnQkFBZ0IsRUFBRSxJQUpDO0FBS25CO0FBQ0FDLFVBQUFBLHVCQUF1QixFQUFFLElBTk47QUFPbkI7QUFDQUMsVUFBQUEsdUJBQXVCLEVBQUUsSUFSTjtBQVNuQjtBQUNBQyxVQUFBQSxVQUFVLEVBQUU7QUFWTztBQURULE9BQWQ7QUFjRDs7O29DQUVlO0FBQ2QsV0FBS0Msc0JBQUw7QUFDRDs7O3NDQUUyQztBQUFBLFVBQTlCQyxLQUE4QixRQUE5QkEsS0FBOEI7QUFBQSxVQUF2QkMsV0FBdUIsUUFBdkJBLFdBQXVCOztBQUMxQztBQUNBLFdBQUtGLHNCQUFMOztBQUNBLFdBQUtHLG1CQUFMO0FBQ0Q7Ozs2Q0FFd0I7QUFDdkIsVUFBSSxLQUFLQyxLQUFMLENBQVdWLG1CQUFYLENBQStCQyxlQUFuQyxFQUFvRDtBQUNsRCxhQUFLVSxPQUFMLENBQWFDLEVBQWIsQ0FBZ0JDLE1BQWhCLENBQXVCQyxtQkFBdkIsQ0FDRSxhQURGLEVBRUUsS0FBS0osS0FBTCxDQUFXVixtQkFBWCxDQUErQkMsZUFBL0IsQ0FBK0NjLGFBRmpEO0FBSUEsYUFBS0osT0FBTCxDQUFhQyxFQUFiLENBQWdCQyxNQUFoQixDQUF1QkMsbUJBQXZCLENBQ0UsYUFERixFQUVFLEtBQUtKLEtBQUwsQ0FBV1YsbUJBQVgsQ0FBK0JDLGVBQS9CLENBQStDZSxhQUZqRDtBQUlBLGFBQUtMLE9BQUwsQ0FBYUMsRUFBYixDQUFnQkMsTUFBaEIsQ0FBdUJDLG1CQUF2QixDQUNFLFdBREYsRUFFRSxLQUFLSixLQUFMLENBQVdWLG1CQUFYLENBQStCQyxlQUEvQixDQUErQ2dCLFdBRmpEO0FBSUEsYUFBS04sT0FBTCxDQUFhQyxFQUFiLENBQWdCQyxNQUFoQixDQUF1QkMsbUJBQXZCLENBQ0UsVUFERixFQUVFLEtBQUtKLEtBQUwsQ0FBV1YsbUJBQVgsQ0FBK0JDLGVBQS9CLENBQStDaUIsYUFGakQ7QUFJRDs7QUFDRCxXQUFLUixLQUFMLENBQVdWLG1CQUFYLENBQStCQyxlQUEvQixHQUFpRCxJQUFqRDtBQUNEOzs7MENBRXFCO0FBQ3BCLFdBQUtTLEtBQUwsQ0FBV1YsbUJBQVgsQ0FBK0JDLGVBQS9CLEdBQWlEO0FBQy9DYyxRQUFBQSxhQUFhLEVBQUUsS0FBS0ksY0FBTCxDQUFvQkMsSUFBcEIsQ0FBeUIsSUFBekIsQ0FEZ0M7QUFFL0NKLFFBQUFBLGFBQWEsRUFBRSxLQUFLSyxjQUFMLENBQW9CRCxJQUFwQixDQUF5QixJQUF6QixDQUZnQztBQUcvQ0gsUUFBQUEsV0FBVyxFQUFFLEtBQUtLLFlBQUwsQ0FBa0JGLElBQWxCLENBQXVCLElBQXZCLENBSGtDO0FBSS9DRixRQUFBQSxhQUFhLEVBQUUsS0FBS0ssY0FBTCxDQUFvQkgsSUFBcEIsQ0FBeUIsSUFBekI7QUFKZ0MsT0FBakQ7QUFPQSxXQUFLVCxPQUFMLENBQWFDLEVBQWIsQ0FBZ0JDLE1BQWhCLENBQXVCVyxnQkFBdkIsQ0FDRSxhQURGLEVBRUUsS0FBS2QsS0FBTCxDQUFXVixtQkFBWCxDQUErQkMsZUFBL0IsQ0FBK0NjLGFBRmpEO0FBSUEsV0FBS0osT0FBTCxDQUFhQyxFQUFiLENBQWdCQyxNQUFoQixDQUF1QlcsZ0JBQXZCLENBQ0UsYUFERixFQUVFLEtBQUtkLEtBQUwsQ0FBV1YsbUJBQVgsQ0FBK0JDLGVBQS9CLENBQStDZSxhQUZqRDtBQUlBLFdBQUtMLE9BQUwsQ0FBYUMsRUFBYixDQUFnQkMsTUFBaEIsQ0FBdUJXLGdCQUF2QixDQUNFLFdBREYsRUFFRSxLQUFLZCxLQUFMLENBQVdWLG1CQUFYLENBQStCQyxlQUEvQixDQUErQ2dCLFdBRmpEO0FBSUEsV0FBS04sT0FBTCxDQUFhQyxFQUFiLENBQWdCQyxNQUFoQixDQUF1QlcsZ0JBQXZCLENBQ0UsVUFERixFQUVFLEtBQUtkLEtBQUwsQ0FBV1YsbUJBQVgsQ0FBK0JDLGVBQS9CLENBQStDaUIsYUFGakQ7QUFJRDs7O21DQUVjcEIsSyxFQUFlO0FBQzVCLFVBQU0yQixZQUFZLEdBQUcsS0FBS0MsZUFBTCxDQUFxQjVCLEtBQXJCLENBQXJCO0FBQ0EsVUFBTTZCLFlBQVksR0FBRyxLQUFLQyxlQUFMLENBQXFCSCxZQUFyQixDQUFyQjtBQUNBLFdBQUtQLGFBQUwsQ0FBbUI7QUFDakJTLFFBQUFBLFlBQVksRUFBWkEsWUFEaUI7QUFFakJFLFFBQUFBLFdBQVcsRUFBRS9CO0FBRkksT0FBbkI7QUFJRDs7O21DQUVjQSxLLEVBQWU7QUFDNUIsVUFBTTJCLFlBQVksR0FBRyxLQUFLQyxlQUFMLENBQXFCNUIsS0FBckIsQ0FBckI7QUFDQSxVQUFNNkIsWUFBWSxHQUFHLEtBQUtDLGVBQUwsQ0FBcUJILFlBQXJCLENBQXJCO0FBRUEsVUFBTUssS0FBSyxHQUFHLEtBQUtuQixPQUFMLENBQWFvQixJQUFiLENBQWtCQyxtQkFBbEIsQ0FBc0M7QUFDbERDLFFBQUFBLENBQUMsRUFBRVIsWUFBWSxDQUFDLENBQUQsQ0FEbUM7QUFFbERTLFFBQUFBLENBQUMsRUFBRVQsWUFBWSxDQUFDLENBQUQsQ0FGbUM7QUFHbERVLFFBQUFBLFFBQVEsRUFBRSxDQUFDLEtBQUs1QixLQUFMLENBQVc2QixFQUFaLENBSHdDO0FBSWxEQyxRQUFBQSxNQUFNLEVBQUUsS0FBSzlCLEtBQUwsQ0FBVytCLGFBSitCO0FBS2xEQyxRQUFBQSxLQUFLLEVBQUUsS0FBS2hDLEtBQUwsQ0FBV2lDO0FBTGdDLE9BQXRDLENBQWQ7QUFRQSxXQUFLekMsUUFBTCxDQUFjO0FBQ1pDLFFBQUFBLG1CQUFtQixvQkFDZCxLQUFLVSxLQUFMLENBQVdWLG1CQURHO0FBRWpCRyxVQUFBQSx1QkFBdUIsRUFBRXNCLFlBRlI7QUFHakJyQixVQUFBQSx1QkFBdUIsRUFBRXVCLFlBSFI7QUFJakJ6QixVQUFBQSxnQkFBZ0IsRUFBRTRCLEtBSkQ7QUFLakJ6QixVQUFBQSxVQUFVLEVBQUU7QUFMSztBQURQLE9BQWQ7QUFTRDs7O21DQUVjUCxLLEVBQWU7QUFDNUIsVUFBTTJCLFlBQVksR0FBRyxLQUFLQyxlQUFMLENBQXFCNUIsS0FBckIsQ0FBckI7QUFDQSxVQUFNNkIsWUFBWSxHQUFHLEtBQUtDLGVBQUwsQ0FBcUJILFlBQXJCLENBQXJCO0FBRjRCLGtDQVF4QixLQUFLZixLQUFMLENBQVdWLG1CQVJhO0FBQUEsVUFLMUJFLGdCQUwwQix5QkFLMUJBLGdCQUwwQjtBQUFBLFVBTTFCQyx1QkFOMEIseUJBTTFCQSx1QkFOMEI7QUFBQSxVQU8xQkMsdUJBUDBCLHlCQU8xQkEsdUJBUDBCO0FBQUEsVUFVdEJDLFVBVnNCLEdBVVAsS0FBS0ssS0FBTCxDQUFXVixtQkFWSixDQVV0QkssVUFWc0I7O0FBWTVCLFVBQUlGLHVCQUFKLEVBQTZCO0FBQzNCO0FBRUE7QUFDQSxZQUFJLENBQUNFLFVBQUQsSUFBZSxLQUFLb0Msa0JBQUwsQ0FBd0J0Qyx1QkFBeEIsRUFBaURzQixZQUFqRCxDQUFuQixFQUFtRjtBQUNqRjtBQUVBO0FBQ0EsZUFBS2lCLGVBQUwsQ0FBcUI7QUFDbkJaLFlBQUFBLEtBQUssRUFBRTVCLGdCQURZO0FBRW5CdUIsWUFBQUEsWUFBWSxFQUFaQSxZQUZtQjtBQUduQkUsWUFBQUEsWUFBWSxFQUFaQSxZQUhtQjtBQUluQnhCLFlBQUFBLHVCQUF1QixFQUF2QkEsdUJBSm1CO0FBS25CQyxZQUFBQSx1QkFBdUIsRUFBdkJBLHVCQUxtQjtBQU1uQnlCLFlBQUFBLFdBQVcsRUFBRS9CO0FBTk0sV0FBckI7QUFTQU8sVUFBQUEsVUFBVSxHQUFHLElBQWI7QUFDQSxlQUFLTixRQUFMLENBQWM7QUFDWkMsWUFBQUEsbUJBQW1CLG9CQUNkLEtBQUtVLEtBQUwsQ0FBV1YsbUJBREc7QUFFakJLLGNBQUFBLFVBQVUsRUFBVkE7QUFGaUI7QUFEUCxXQUFkO0FBTUQ7QUFDRjs7QUFFRCxVQUFNeUIsS0FBSyxHQUFHLEtBQUtuQixPQUFMLENBQWFvQixJQUFiLENBQWtCQyxtQkFBbEIsQ0FBc0M7QUFDbERDLFFBQUFBLENBQUMsRUFBRVIsWUFBWSxDQUFDLENBQUQsQ0FEbUM7QUFFbERTLFFBQUFBLENBQUMsRUFBRVQsWUFBWSxDQUFDLENBQUQsQ0FGbUM7QUFHbERVLFFBQUFBLFFBQVEsRUFBRSxDQUFDLEtBQUs1QixLQUFMLENBQVc2QixFQUFaLENBSHdDO0FBSWxEQyxRQUFBQSxNQUFNLEVBQUUsS0FBSzlCLEtBQUwsQ0FBVytCLGFBSitCO0FBS2xEQyxRQUFBQSxLQUFLLEVBQUUsS0FBS2hDLEtBQUwsQ0FBV2lDO0FBTGdDLE9BQXRDLENBQWQ7QUFRQSxXQUFLekIsYUFBTCxDQUFtQjtBQUNqQlUsUUFBQUEsWUFBWSxFQUFaQSxZQURpQjtBQUVqQkUsUUFBQUEsWUFBWSxFQUFaQSxZQUZpQjtBQUdqQkcsUUFBQUEsS0FBSyxFQUFMQSxLQUhpQjtBQUlqQnpCLFFBQUFBLFVBQVUsRUFBVkEsVUFKaUI7QUFLakJILFFBQUFBLGdCQUFnQixFQUFoQkEsZ0JBTGlCO0FBTWpCQyxRQUFBQSx1QkFBdUIsRUFBdkJBLHVCQU5pQjtBQU9qQkMsUUFBQUEsdUJBQXVCLEVBQXZCQSx1QkFQaUI7QUFRakJ5QixRQUFBQSxXQUFXLEVBQUUvQjtBQVJJLE9BQW5CO0FBVUQ7OztpQ0FFWUEsSyxFQUFlO0FBQzFCLFVBQU0yQixZQUFZLEdBQUcsS0FBS0MsZUFBTCxDQUFxQjVCLEtBQXJCLENBQXJCO0FBQ0EsVUFBTTZCLFlBQVksR0FBRyxLQUFLQyxlQUFMLENBQXFCSCxZQUFyQixDQUFyQjtBQUYwQixtQ0FTdEIsS0FBS2YsS0FBTCxDQUFXVixtQkFUVztBQUFBLFVBS3hCRSxnQkFMd0IsMEJBS3hCQSxnQkFMd0I7QUFBQSxVQU14QkMsdUJBTndCLDBCQU14QkEsdUJBTndCO0FBQUEsVUFPeEJDLHVCQVB3QiwwQkFPeEJBLHVCQVB3QjtBQUFBLFVBUXhCQyxVQVJ3QiwwQkFReEJBLFVBUndCOztBQVcxQixVQUFJLENBQUNGLHVCQUFMLEVBQThCO0FBQzVCO0FBQ0E7QUFDRDs7QUFFRCxVQUFJRSxVQUFKLEVBQWdCO0FBQ2QsYUFBS3NDLGNBQUwsQ0FBb0I7QUFDbEJiLFVBQUFBLEtBQUssRUFBRTVCLGdCQURXO0FBRWxCdUIsVUFBQUEsWUFBWSxFQUFaQSxZQUZrQjtBQUdsQkUsVUFBQUEsWUFBWSxFQUFaQSxZQUhrQjtBQUlsQnhCLFVBQUFBLHVCQUF1QixFQUF2QkEsdUJBSmtCO0FBS2xCQyxVQUFBQSx1QkFBdUIsRUFBdkJBLHVCQUxrQjtBQU1sQnlCLFVBQUFBLFdBQVcsRUFBRS9CO0FBTkssU0FBcEI7QUFRRCxPQVRELE1BU08sSUFBSSxDQUFDLEtBQUsyQyxrQkFBTCxDQUF3QnRDLHVCQUF4QixFQUFpRHNCLFlBQWpELENBQUwsRUFBcUU7QUFDMUUsYUFBS21CLFlBQUwsQ0FBa0I7QUFDaEJkLFVBQUFBLEtBQUssRUFBRTVCLGdCQURTO0FBRWhCdUIsVUFBQUEsWUFBWSxFQUFaQSxZQUZnQjtBQUdoQkUsVUFBQUEsWUFBWSxFQUFaQSxZQUhnQjtBQUloQkUsVUFBQUEsV0FBVyxFQUFFL0I7QUFKRyxTQUFsQjtBQU1EOztBQUVELFdBQUtDLFFBQUwsQ0FBYztBQUNaQyxRQUFBQSxtQkFBbUIsb0JBQ2QsS0FBS1UsS0FBTCxDQUFXVixtQkFERztBQUVqQkcsVUFBQUEsdUJBQXVCLEVBQUUsSUFGUjtBQUdqQkMsVUFBQUEsdUJBQXVCLEVBQUUsSUFIUjtBQUlqQkYsVUFBQUEsZ0JBQWdCLEVBQUUsSUFKRDtBQUtqQkcsVUFBQUEsVUFBVSxFQUFFO0FBTEs7QUFEUCxPQUFkO0FBU0Q7OztvQ0FFZXdDLFksRUFBc0I7QUFDcEMsYUFBTyxDQUNMQSxZQUFZLENBQUNDLE9BQWIsR0FBdUIsS0FBS25DLE9BQUwsQ0FBYUMsRUFBYixDQUFnQkMsTUFBaEIsQ0FBdUJrQyxxQkFBdkIsR0FBK0NkLENBRGpFLEVBRUxZLFlBQVksQ0FBQ0csT0FBYixHQUF1QixLQUFLckMsT0FBTCxDQUFhQyxFQUFiLENBQWdCQyxNQUFoQixDQUF1QmtDLHFCQUF2QixHQUErQ2IsQ0FGakUsQ0FBUDtBQUlEOzs7b0NBRWVULFksRUFBd0I7QUFDdEMsYUFBTyxLQUFLZCxPQUFMLENBQWFzQyxRQUFiLENBQXNCQyxTQUF0QixDQUFnQyxDQUFDekIsWUFBWSxDQUFDLENBQUQsQ0FBYixFQUFrQkEsWUFBWSxDQUFDLENBQUQsQ0FBOUIsQ0FBaEMsQ0FBUDtBQUNEOzs7dUNBRWtCMEIsYSxFQUF5QkMsYSxFQUF5QjtBQUNuRSxhQUNFQyxJQUFJLENBQUNDLEdBQUwsQ0FBU0gsYUFBYSxDQUFDLENBQUQsQ0FBYixHQUFtQkMsYUFBYSxDQUFDLENBQUQsQ0FBekMsSUFBZ0R4RCxxQ0FBaEQsSUFDQXlELElBQUksQ0FBQ0MsR0FBTCxDQUFTSCxhQUFhLENBQUMsQ0FBRCxDQUFiLEdBQW1CQyxhQUFhLENBQUMsQ0FBRCxDQUF6QyxJQUFnRHhELHFDQUZsRDtBQUlEOzs7O0VBM1B3QzJELGlDOzs7QUE4UDNDMUQsYUFBYSxDQUFDMkQsU0FBZCxHQUEwQixlQUExQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG4vKiBlc2xpbnQtZW52IGJyb3dzZXIgKi9cblxuaW1wb3J0IHsgQ29tcG9zaXRlTGF5ZXIgfSBmcm9tICdrZXBsZXItb3VkYXRlZC1kZWNrLmdsLWNvcmUnO1xuaW1wb3J0IHR5cGUge1xuICBDbGlja0V2ZW50LFxuICBTdGFydERyYWdnaW5nRXZlbnQsXG4gIFN0b3BEcmFnZ2luZ0V2ZW50LFxuICBQb2ludGVyTW92ZUV2ZW50LFxuICBEb3VibGVDbGlja0V2ZW50XG59IGZyb20gJy4uL2V2ZW50LXR5cGVzLmpzJztcblxuLy8gTWluaW11bSBudW1iZXIgb2YgcGl4ZWxzIHRoZSBwb2ludGVyIG11c3QgbW92ZSBmcm9tIHRoZSBvcmlnaW5hbCBwb2ludGVyIGRvd24gdG8gYmUgY29uc2lkZXJlZCBkcmFnZ2luZ1xuY29uc3QgTUlOSU1VTV9QT0lOVEVSX01PVkVfVEhSRVNIT0xEX1BJWEVMUyA9IDc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVkaXRhYmxlTGF5ZXIgZXh0ZW5kcyBDb21wb3NpdGVMYXllciB7XG4gIC8vIE92ZXJyaWRhYmxlIGludGVyYWN0aW9uIGV2ZW50IGhhbmRsZXJzXG4gIG9uTGF5ZXJDbGljayhldmVudDogQ2xpY2tFdmVudCkge1xuICAgIC8vIGRlZmF1bHQgaW1wbGVtZW50YXRpb24gLSBkbyBub3RoaW5nXG4gIH1cblxuICBvbkRvdWJsZUNsaWNrKGV2ZW50OiBEb3VibGVDbGlja0V2ZW50KSB7XG4gICAgLy8gZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiAtIGRvIG5vdGhpbmdcbiAgfVxuXG4gIG9uU3RhcnREcmFnZ2luZyhldmVudDogU3RhcnREcmFnZ2luZ0V2ZW50KSB7XG4gICAgLy8gZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiAtIGRvIG5vdGhpbmdcbiAgfVxuXG4gIG9uU3RvcERyYWdnaW5nKGV2ZW50OiBTdG9wRHJhZ2dpbmdFdmVudCkge1xuICAgIC8vIGRlZmF1bHQgaW1wbGVtZW50YXRpb24gLSBkbyBub3RoaW5nXG4gIH1cblxuICBvblBvaW50ZXJNb3ZlKGV2ZW50OiBQb2ludGVyTW92ZUV2ZW50KSB7XG4gICAgLy8gZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiAtIGRvIG5vdGhpbmdcbiAgfVxuXG4gIC8vIFRPRE86IGltcGxlbWVudCBvbkNhbmNlbERyYWdnaW5nIChlLmcuIGRyYWcgb2ZmIHNjcmVlbilcblxuICBpbml0aWFsaXplU3RhdGUoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBfZWRpdGFibGVMYXllclN0YXRlOiB7XG4gICAgICAgIC8vIFBvaW50ZXIgZXZlbnQgaGFuZGxlcnNcbiAgICAgICAgcG9pbnRlckhhbmRsZXJzOiBudWxsLFxuICAgICAgICAvLyBQaWNrZWQgb2JqZWN0cyBhdCB0aGUgdGltZSB0aGUgcG9pbnRlciB3ZW50IGRvd25cbiAgICAgICAgcG9pbnRlckRvd25QaWNrczogbnVsbCxcbiAgICAgICAgLy8gU2NyZWVuIGNvb3JkaW5hdGVzIHdoZXJlIHRoZSBwb2ludGVyIHdlbnQgZG93blxuICAgICAgICBwb2ludGVyRG93blNjcmVlbkNvb3JkczogbnVsbCxcbiAgICAgICAgLy8gR3JvdW5kIGNvb3JkaW5hdGVzIHdoZXJlIHRoZSBwb2ludGVyIHdlbnQgZG93blxuICAgICAgICBwb2ludGVyRG93bkdyb3VuZENvb3JkczogbnVsbCxcbiAgICAgICAgLy8gSXMgdGhlIHBvaW50ZXIgZHJhZ2dpbmcgKHBvaW50ZXIgZG93biArIG1vdmVkIGF0IGxlYXN0IE1JTklNVU1fUE9JTlRFUl9NT1ZFX1RIUkVTSE9MRF9QSVhFTFMpXG4gICAgICAgIGlzRHJhZ2dpbmc6IGZhbHNlXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBmaW5hbGl6ZVN0YXRlKCkge1xuICAgIHRoaXMuX3JlbW92ZVBvaW50ZXJIYW5kbGVycygpO1xuICB9XG5cbiAgdXBkYXRlU3RhdGUoeyBwcm9wcywgY2hhbmdlRmxhZ3MgfTogT2JqZWN0KSB7XG4gICAgLy8gdW5zdWJzY3JpYmUgcHJldmlvdXMgbGF5ZXIgaW5zdGFuY2UncyBoYW5kbGVyc1xuICAgIHRoaXMuX3JlbW92ZVBvaW50ZXJIYW5kbGVycygpO1xuICAgIHRoaXMuX2FkZFBvaW50ZXJIYW5kbGVycygpO1xuICB9XG5cbiAgX3JlbW92ZVBvaW50ZXJIYW5kbGVycygpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5fZWRpdGFibGVMYXllclN0YXRlLnBvaW50ZXJIYW5kbGVycykge1xuICAgICAgdGhpcy5jb250ZXh0LmdsLmNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKFxuICAgICAgICAncG9pbnRlcm1vdmUnLFxuICAgICAgICB0aGlzLnN0YXRlLl9lZGl0YWJsZUxheWVyU3RhdGUucG9pbnRlckhhbmRsZXJzLm9uUG9pbnRlck1vdmVcbiAgICAgICk7XG4gICAgICB0aGlzLmNvbnRleHQuZ2wuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoXG4gICAgICAgICdwb2ludGVyZG93bicsXG4gICAgICAgIHRoaXMuc3RhdGUuX2VkaXRhYmxlTGF5ZXJTdGF0ZS5wb2ludGVySGFuZGxlcnMub25Qb2ludGVyRG93blxuICAgICAgKTtcbiAgICAgIHRoaXMuY29udGV4dC5nbC5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgJ3BvaW50ZXJ1cCcsXG4gICAgICAgIHRoaXMuc3RhdGUuX2VkaXRhYmxlTGF5ZXJTdGF0ZS5wb2ludGVySGFuZGxlcnMub25Qb2ludGVyVXBcbiAgICAgICk7XG4gICAgICB0aGlzLmNvbnRleHQuZ2wuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoXG4gICAgICAgICdkYmxjbGljaycsXG4gICAgICAgIHRoaXMuc3RhdGUuX2VkaXRhYmxlTGF5ZXJTdGF0ZS5wb2ludGVySGFuZGxlcnMub25Eb3VibGVDbGlja1xuICAgICAgKTtcbiAgICB9XG4gICAgdGhpcy5zdGF0ZS5fZWRpdGFibGVMYXllclN0YXRlLnBvaW50ZXJIYW5kbGVycyA9IG51bGw7XG4gIH1cblxuICBfYWRkUG9pbnRlckhhbmRsZXJzKCkge1xuICAgIHRoaXMuc3RhdGUuX2VkaXRhYmxlTGF5ZXJTdGF0ZS5wb2ludGVySGFuZGxlcnMgPSB7XG4gICAgICBvblBvaW50ZXJNb3ZlOiB0aGlzLl9vblBvaW50ZXJNb3ZlLmJpbmQodGhpcyksXG4gICAgICBvblBvaW50ZXJEb3duOiB0aGlzLl9vblBvaW50ZXJEb3duLmJpbmQodGhpcyksXG4gICAgICBvblBvaW50ZXJVcDogdGhpcy5fb25Qb2ludGVyVXAuYmluZCh0aGlzKSxcbiAgICAgIG9uRG91YmxlQ2xpY2s6IHRoaXMuX29uRG91YmxlQ2xpY2suYmluZCh0aGlzKVxuICAgIH07XG5cbiAgICB0aGlzLmNvbnRleHQuZ2wuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAncG9pbnRlcm1vdmUnLFxuICAgICAgdGhpcy5zdGF0ZS5fZWRpdGFibGVMYXllclN0YXRlLnBvaW50ZXJIYW5kbGVycy5vblBvaW50ZXJNb3ZlXG4gICAgKTtcbiAgICB0aGlzLmNvbnRleHQuZ2wuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAncG9pbnRlcmRvd24nLFxuICAgICAgdGhpcy5zdGF0ZS5fZWRpdGFibGVMYXllclN0YXRlLnBvaW50ZXJIYW5kbGVycy5vblBvaW50ZXJEb3duXG4gICAgKTtcbiAgICB0aGlzLmNvbnRleHQuZ2wuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAncG9pbnRlcnVwJyxcbiAgICAgIHRoaXMuc3RhdGUuX2VkaXRhYmxlTGF5ZXJTdGF0ZS5wb2ludGVySGFuZGxlcnMub25Qb2ludGVyVXBcbiAgICApO1xuICAgIHRoaXMuY29udGV4dC5nbC5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICdkYmxjbGljaycsXG4gICAgICB0aGlzLnN0YXRlLl9lZGl0YWJsZUxheWVyU3RhdGUucG9pbnRlckhhbmRsZXJzLm9uRG91YmxlQ2xpY2tcbiAgICApO1xuICB9XG5cbiAgX29uRG91YmxlQ2xpY2soZXZlbnQ6IE9iamVjdCkge1xuICAgIGNvbnN0IHNjcmVlbkNvb3JkcyA9IHRoaXMuZ2V0U2NyZWVuQ29vcmRzKGV2ZW50KTtcbiAgICBjb25zdCBncm91bmRDb29yZHMgPSB0aGlzLmdldEdyb3VuZENvb3JkcyhzY3JlZW5Db29yZHMpO1xuICAgIHRoaXMub25Eb3VibGVDbGljayh7XG4gICAgICBncm91bmRDb29yZHMsXG4gICAgICBzb3VyY2VFdmVudDogZXZlbnRcbiAgICB9KTtcbiAgfVxuXG4gIF9vblBvaW50ZXJEb3duKGV2ZW50OiBPYmplY3QpIHtcbiAgICBjb25zdCBzY3JlZW5Db29yZHMgPSB0aGlzLmdldFNjcmVlbkNvb3JkcyhldmVudCk7XG4gICAgY29uc3QgZ3JvdW5kQ29vcmRzID0gdGhpcy5nZXRHcm91bmRDb29yZHMoc2NyZWVuQ29vcmRzKTtcblxuICAgIGNvbnN0IHBpY2tzID0gdGhpcy5jb250ZXh0LmRlY2sucGlja011bHRpcGxlT2JqZWN0cyh7XG4gICAgICB4OiBzY3JlZW5Db29yZHNbMF0sXG4gICAgICB5OiBzY3JlZW5Db29yZHNbMV0sXG4gICAgICBsYXllcklkczogW3RoaXMucHJvcHMuaWRdLFxuICAgICAgcmFkaXVzOiB0aGlzLnByb3BzLnBpY2tpbmdSYWRpdXMsXG4gICAgICBkZXB0aDogdGhpcy5wcm9wcy5waWNraW5nRGVwdGhcbiAgICB9KTtcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgX2VkaXRhYmxlTGF5ZXJTdGF0ZToge1xuICAgICAgICAuLi50aGlzLnN0YXRlLl9lZGl0YWJsZUxheWVyU3RhdGUsXG4gICAgICAgIHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzOiBzY3JlZW5Db29yZHMsXG4gICAgICAgIHBvaW50ZXJEb3duR3JvdW5kQ29vcmRzOiBncm91bmRDb29yZHMsXG4gICAgICAgIHBvaW50ZXJEb3duUGlja3M6IHBpY2tzLFxuICAgICAgICBpc0RyYWdnaW5nOiBmYWxzZVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgX29uUG9pbnRlck1vdmUoZXZlbnQ6IE9iamVjdCkge1xuICAgIGNvbnN0IHNjcmVlbkNvb3JkcyA9IHRoaXMuZ2V0U2NyZWVuQ29vcmRzKGV2ZW50KTtcbiAgICBjb25zdCBncm91bmRDb29yZHMgPSB0aGlzLmdldEdyb3VuZENvb3JkcyhzY3JlZW5Db29yZHMpO1xuXG4gICAgY29uc3Qge1xuICAgICAgcG9pbnRlckRvd25QaWNrcyxcbiAgICAgIHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzLFxuICAgICAgcG9pbnRlckRvd25Hcm91bmRDb29yZHNcbiAgICB9ID0gdGhpcy5zdGF0ZS5fZWRpdGFibGVMYXllclN0YXRlO1xuXG4gICAgbGV0IHsgaXNEcmFnZ2luZyB9ID0gdGhpcy5zdGF0ZS5fZWRpdGFibGVMYXllclN0YXRlO1xuXG4gICAgaWYgKHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzKSB7XG4gICAgICAvLyBQb2ludGVyIHdlbnQgZG93biBhbmQgaXMgbW92aW5nXG5cbiAgICAgIC8vIERpZCBpdCBtb3ZlIGVub3VnaCB0byBjb25zaWRlciBpdCBhIGRyYWdcbiAgICAgIGlmICghaXNEcmFnZ2luZyAmJiB0aGlzLm1vdmVkRW5vdWdoRm9yRHJhZyhwb2ludGVyRG93blNjcmVlbkNvb3Jkcywgc2NyZWVuQ29vcmRzKSkge1xuICAgICAgICAvLyBPSywgdGhpcyBpcyBjb25zaWRlcmVkIGRyYWdnaW5nXG5cbiAgICAgICAgLy8gRmlyZSB0aGUgc3RhcnQgZHJhZ2dpbmcgZXZlbnRcbiAgICAgICAgdGhpcy5vblN0YXJ0RHJhZ2dpbmcoe1xuICAgICAgICAgIHBpY2tzOiBwb2ludGVyRG93blBpY2tzLFxuICAgICAgICAgIHNjcmVlbkNvb3JkcyxcbiAgICAgICAgICBncm91bmRDb29yZHMsXG4gICAgICAgICAgcG9pbnRlckRvd25TY3JlZW5Db29yZHMsXG4gICAgICAgICAgcG9pbnRlckRvd25Hcm91bmRDb29yZHMsXG4gICAgICAgICAgc291cmNlRXZlbnQ6IGV2ZW50XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlzRHJhZ2dpbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBfZWRpdGFibGVMYXllclN0YXRlOiB7XG4gICAgICAgICAgICAuLi50aGlzLnN0YXRlLl9lZGl0YWJsZUxheWVyU3RhdGUsXG4gICAgICAgICAgICBpc0RyYWdnaW5nXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBwaWNrcyA9IHRoaXMuY29udGV4dC5kZWNrLnBpY2tNdWx0aXBsZU9iamVjdHMoe1xuICAgICAgeDogc2NyZWVuQ29vcmRzWzBdLFxuICAgICAgeTogc2NyZWVuQ29vcmRzWzFdLFxuICAgICAgbGF5ZXJJZHM6IFt0aGlzLnByb3BzLmlkXSxcbiAgICAgIHJhZGl1czogdGhpcy5wcm9wcy5waWNraW5nUmFkaXVzLFxuICAgICAgZGVwdGg6IHRoaXMucHJvcHMucGlja2luZ0RlcHRoXG4gICAgfSk7XG5cbiAgICB0aGlzLm9uUG9pbnRlck1vdmUoe1xuICAgICAgc2NyZWVuQ29vcmRzLFxuICAgICAgZ3JvdW5kQ29vcmRzLFxuICAgICAgcGlja3MsXG4gICAgICBpc0RyYWdnaW5nLFxuICAgICAgcG9pbnRlckRvd25QaWNrcyxcbiAgICAgIHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzLFxuICAgICAgcG9pbnRlckRvd25Hcm91bmRDb29yZHMsXG4gICAgICBzb3VyY2VFdmVudDogZXZlbnRcbiAgICB9KTtcbiAgfVxuXG4gIF9vblBvaW50ZXJVcChldmVudDogT2JqZWN0KSB7XG4gICAgY29uc3Qgc2NyZWVuQ29vcmRzID0gdGhpcy5nZXRTY3JlZW5Db29yZHMoZXZlbnQpO1xuICAgIGNvbnN0IGdyb3VuZENvb3JkcyA9IHRoaXMuZ2V0R3JvdW5kQ29vcmRzKHNjcmVlbkNvb3Jkcyk7XG5cbiAgICBjb25zdCB7XG4gICAgICBwb2ludGVyRG93blBpY2tzLFxuICAgICAgcG9pbnRlckRvd25TY3JlZW5Db29yZHMsXG4gICAgICBwb2ludGVyRG93bkdyb3VuZENvb3JkcyxcbiAgICAgIGlzRHJhZ2dpbmdcbiAgICB9ID0gdGhpcy5zdGF0ZS5fZWRpdGFibGVMYXllclN0YXRlO1xuXG4gICAgaWYgKCFwb2ludGVyRG93blNjcmVlbkNvb3Jkcykge1xuICAgICAgLy8gVGhpcyBpcyBhIHBvaW50ZXIgdXAgd2l0aG91dCBhIHBvaW50ZXIgZG93biAoZS5nLiB1c2VyIHBvaW50ZXIgZG93bmVkIGVsc2V3aGVyZSksIHNvIGlnbm9yZVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChpc0RyYWdnaW5nKSB7XG4gICAgICB0aGlzLm9uU3RvcERyYWdnaW5nKHtcbiAgICAgICAgcGlja3M6IHBvaW50ZXJEb3duUGlja3MsXG4gICAgICAgIHNjcmVlbkNvb3JkcyxcbiAgICAgICAgZ3JvdW5kQ29vcmRzLFxuICAgICAgICBwb2ludGVyRG93blNjcmVlbkNvb3JkcyxcbiAgICAgICAgcG9pbnRlckRvd25Hcm91bmRDb29yZHMsXG4gICAgICAgIHNvdXJjZUV2ZW50OiBldmVudFxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICghdGhpcy5tb3ZlZEVub3VnaEZvckRyYWcocG9pbnRlckRvd25TY3JlZW5Db29yZHMsIHNjcmVlbkNvb3JkcykpIHtcbiAgICAgIHRoaXMub25MYXllckNsaWNrKHtcbiAgICAgICAgcGlja3M6IHBvaW50ZXJEb3duUGlja3MsXG4gICAgICAgIHNjcmVlbkNvb3JkcyxcbiAgICAgICAgZ3JvdW5kQ29vcmRzLFxuICAgICAgICBzb3VyY2VFdmVudDogZXZlbnRcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgX2VkaXRhYmxlTGF5ZXJTdGF0ZToge1xuICAgICAgICAuLi50aGlzLnN0YXRlLl9lZGl0YWJsZUxheWVyU3RhdGUsXG4gICAgICAgIHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzOiBudWxsLFxuICAgICAgICBwb2ludGVyRG93bkdyb3VuZENvb3JkczogbnVsbCxcbiAgICAgICAgcG9pbnRlckRvd25QaWNrczogbnVsbCxcbiAgICAgICAgaXNEcmFnZ2luZzogZmFsc2VcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdldFNjcmVlbkNvb3Jkcyhwb2ludGVyRXZlbnQ6IE9iamVjdCkge1xuICAgIHJldHVybiBbXG4gICAgICBwb2ludGVyRXZlbnQuY2xpZW50WCAtIHRoaXMuY29udGV4dC5nbC5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkueCxcbiAgICAgIHBvaW50ZXJFdmVudC5jbGllbnRZIC0gdGhpcy5jb250ZXh0LmdsLmNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS55XG4gICAgXTtcbiAgfVxuXG4gIGdldEdyb3VuZENvb3JkcyhzY3JlZW5Db29yZHM6IG51bWJlcltdKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGV4dC52aWV3cG9ydC51bnByb2plY3QoW3NjcmVlbkNvb3Jkc1swXSwgc2NyZWVuQ29vcmRzWzFdXSk7XG4gIH1cblxuICBtb3ZlZEVub3VnaEZvckRyYWcoc2NyZWVuQ29vcmRzMTogbnVtYmVyW10sIHNjcmVlbkNvb3JkczI6IG51bWJlcltdKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIE1hdGguYWJzKHNjcmVlbkNvb3JkczFbMF0gLSBzY3JlZW5Db29yZHMyWzBdKSA+IE1JTklNVU1fUE9JTlRFUl9NT1ZFX1RIUkVTSE9MRF9QSVhFTFMgfHxcbiAgICAgIE1hdGguYWJzKHNjcmVlbkNvb3JkczFbMV0gLSBzY3JlZW5Db29yZHMyWzFdKSA+IE1JTklNVU1fUE9JTlRFUl9NT1ZFX1RIUkVTSE9MRF9QSVhFTFNcbiAgICApO1xuICB9XG59XG5cbkVkaXRhYmxlTGF5ZXIubGF5ZXJOYW1lID0gJ0VkaXRhYmxlTGF5ZXInO1xuIl19