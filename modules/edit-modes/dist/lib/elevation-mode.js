"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ElevationMode = void 0;

var _geojsonEditMode = require("./geojson-edit-mode.js");

var _modifyMode = require("./modify-mode.js");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function defaultCalculateElevationChange(_ref) {
  var pointerDownScreenCoords = _ref.pointerDownScreenCoords,
      screenCoords = _ref.screenCoords;
  return 10 * (pointerDownScreenCoords[1] - screenCoords[1]);
}

var ElevationMode =
/*#__PURE__*/
function (_ModifyMode) {
  _inherits(ElevationMode, _ModifyMode);

  function ElevationMode() {
    _classCallCheck(this, ElevationMode);

    return _possibleConstructorReturn(this, _getPrototypeOf(ElevationMode).apply(this, arguments));
  }

  _createClass(ElevationMode, [{
    key: "makeElevatedEvent",
    value: function makeElevatedEvent(event, position, props) {
      var _ref2 = props.modeConfig || {},
          _ref2$minElevation = _ref2.minElevation,
          minElevation = _ref2$minElevation === void 0 ? 0 : _ref2$minElevation,
          _ref2$maxElevation = _ref2.maxElevation,
          maxElevation = _ref2$maxElevation === void 0 ? 20000 : _ref2$maxElevation,
          _ref2$calculateElevat = _ref2.calculateElevationChange,
          calculateElevationChange = _ref2$calculateElevat === void 0 ? defaultCalculateElevationChange : _ref2$calculateElevat;

      if (!event.pointerDownScreenCoords) {
        return event;
      } // $FlowFixMe - really, I know it has something at index 2


      var elevation = position.length === 3 ? position[2] : 0; // calculateElevationChange is configurable because (at this time) modes are not aware of the viewport

      elevation += calculateElevationChange({
        pointerDownScreenCoords: event.pointerDownScreenCoords,
        screenCoords: event.screenCoords
      });
      elevation = Math.min(elevation, maxElevation);
      elevation = Math.max(elevation, minElevation);
      return Object.assign({}, event, {
        mapCoords: [position[0], position[1], elevation]
      });
    }
  }, {
    key: "handlePointerMoveAdapter",
    value: function handlePointerMoveAdapter(event, props) {
      var editHandle = (0, _geojsonEditMode.getPickedEditHandle)(event.pointerDownPicks);
      var position = editHandle ? editHandle.position : event.mapCoords;
      return _get(_getPrototypeOf(ElevationMode.prototype), "handlePointerMoveAdapter", this).call(this, this.makeElevatedEvent(event, position, props), props);
    }
  }, {
    key: "handleStopDraggingAdapter",
    value: function handleStopDraggingAdapter(event, props) {
      var editHandle = (0, _geojsonEditMode.getPickedEditHandle)(event.picks);
      var position = editHandle ? editHandle.position : event.mapCoords;
      return _get(_getPrototypeOf(ElevationMode.prototype), "handleStopDraggingAdapter", this).call(this, this.makeElevatedEvent(event, position, props), props);
    }
  }, {
    key: "getCursor",
    value: function getCursor(event) {
      var cursor = _get(_getPrototypeOf(ElevationMode.prototype), "getCursor", this).call(this, event);

      if (cursor === 'cell') {
        cursor = 'ns-resize';
      }

      return cursor;
    }
  }], [{
    key: "calculateElevationChangeWithViewport",
    value: function calculateElevationChangeWithViewport(viewport, _ref3) {
      var pointerDownScreenCoords = _ref3.pointerDownScreenCoords,
          screenCoords = _ref3.screenCoords;
      // Source: https://gis.stackexchange.com/a/127949/111804
      var metersPerPixel = 156543.03392 * Math.cos(viewport.latitude * Math.PI / 180) / Math.pow(2, viewport.zoom);
      return metersPerPixel * (pointerDownScreenCoords[1] - screenCoords[1]) / 2;
    }
  }]);

  return ElevationMode;
}(_modifyMode.ModifyMode);

exports.ElevationMode = ElevationMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvZWxldmF0aW9uLW1vZGUuanMiXSwibmFtZXMiOlsiZGVmYXVsdENhbGN1bGF0ZUVsZXZhdGlvbkNoYW5nZSIsInBvaW50ZXJEb3duU2NyZWVuQ29vcmRzIiwic2NyZWVuQ29vcmRzIiwiRWxldmF0aW9uTW9kZSIsImV2ZW50IiwicG9zaXRpb24iLCJwcm9wcyIsIm1vZGVDb25maWciLCJtaW5FbGV2YXRpb24iLCJtYXhFbGV2YXRpb24iLCJjYWxjdWxhdGVFbGV2YXRpb25DaGFuZ2UiLCJlbGV2YXRpb24iLCJsZW5ndGgiLCJNYXRoIiwibWluIiwibWF4IiwiT2JqZWN0IiwiYXNzaWduIiwibWFwQ29vcmRzIiwiZWRpdEhhbmRsZSIsInBvaW50ZXJEb3duUGlja3MiLCJtYWtlRWxldmF0ZWRFdmVudCIsInBpY2tzIiwiY3Vyc29yIiwidmlld3BvcnQiLCJtZXRlcnNQZXJQaXhlbCIsImNvcyIsImxhdGl0dWRlIiwiUEkiLCJwb3ciLCJ6b29tIiwiTW9kaWZ5TW9kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUdBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxTQUFTQSwrQkFBVCxPQU1HO0FBQUEsTUFMREMsdUJBS0MsUUFMREEsdUJBS0M7QUFBQSxNQUpEQyxZQUlDLFFBSkRBLFlBSUM7QUFDRCxTQUFPLE1BQU1ELHVCQUF1QixDQUFDLENBQUQsQ0FBdkIsR0FBNkJDLFlBQVksQ0FBQyxDQUFELENBQS9DLENBQVA7QUFDRDs7SUFFWUMsYTs7Ozs7Ozs7Ozs7OztzQ0FFVEMsSyxFQUNBQyxRLEVBQ0FDLEssRUFDUTtBQUFBLGtCQU1OQSxLQUFLLENBQUNDLFVBQU4sSUFBb0IsRUFOZDtBQUFBLHFDQUVOQyxZQUZNO0FBQUEsVUFFTkEsWUFGTSxtQ0FFUyxDQUZUO0FBQUEscUNBR05DLFlBSE07QUFBQSxVQUdOQSxZQUhNLG1DQUdTLEtBSFQ7QUFBQSx3Q0FJTkMsd0JBSk07QUFBQSxVQUlOQSx3QkFKTSxzQ0FJcUJWLCtCQUpyQjs7QUFRUixVQUFJLENBQUNJLEtBQUssQ0FBQ0gsdUJBQVgsRUFBb0M7QUFDbEMsZUFBT0csS0FBUDtBQUNELE9BVk8sQ0FZUjs7O0FBQ0EsVUFBSU8sU0FBUyxHQUFHTixRQUFRLENBQUNPLE1BQVQsS0FBb0IsQ0FBcEIsR0FBd0JQLFFBQVEsQ0FBQyxDQUFELENBQWhDLEdBQXNDLENBQXRELENBYlEsQ0FlUjs7QUFDQU0sTUFBQUEsU0FBUyxJQUFJRCx3QkFBd0IsQ0FBQztBQUNwQ1QsUUFBQUEsdUJBQXVCLEVBQUVHLEtBQUssQ0FBQ0gsdUJBREs7QUFFcENDLFFBQUFBLFlBQVksRUFBRUUsS0FBSyxDQUFDRjtBQUZnQixPQUFELENBQXJDO0FBSUFTLE1BQUFBLFNBQVMsR0FBR0UsSUFBSSxDQUFDQyxHQUFMLENBQVNILFNBQVQsRUFBb0JGLFlBQXBCLENBQVo7QUFDQUUsTUFBQUEsU0FBUyxHQUFHRSxJQUFJLENBQUNFLEdBQUwsQ0FBU0osU0FBVCxFQUFvQkgsWUFBcEIsQ0FBWjtBQUVBLGFBQU9RLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLEVBQWQsRUFBa0JiLEtBQWxCLEVBQXlCO0FBQzlCYyxRQUFBQSxTQUFTLEVBQUUsQ0FBQ2IsUUFBUSxDQUFDLENBQUQsQ0FBVCxFQUFjQSxRQUFRLENBQUMsQ0FBRCxDQUF0QixFQUEyQk0sU0FBM0I7QUFEbUIsT0FBekIsQ0FBUDtBQUdEOzs7NkNBR0NQLEssRUFDQUUsSyxFQUMyRDtBQUMzRCxVQUFNYSxVQUFVLEdBQUcsMENBQW9CZixLQUFLLENBQUNnQixnQkFBMUIsQ0FBbkI7QUFDQSxVQUFNZixRQUFRLEdBQUdjLFVBQVUsR0FBR0EsVUFBVSxDQUFDZCxRQUFkLEdBQXlCRCxLQUFLLENBQUNjLFNBQTFEO0FBQ0EseUdBQXNDLEtBQUtHLGlCQUFMLENBQXVCakIsS0FBdkIsRUFBOEJDLFFBQTlCLEVBQXdDQyxLQUF4QyxDQUF0QyxFQUFzRkEsS0FBdEY7QUFDRDs7OzhDQUdDRixLLEVBQ0FFLEssRUFDb0I7QUFDcEIsVUFBTWEsVUFBVSxHQUFHLDBDQUFvQmYsS0FBSyxDQUFDa0IsS0FBMUIsQ0FBbkI7QUFDQSxVQUFNakIsUUFBUSxHQUFHYyxVQUFVLEdBQUdBLFVBQVUsQ0FBQ2QsUUFBZCxHQUF5QkQsS0FBSyxDQUFDYyxTQUExRDtBQUNBLDBHQUF1QyxLQUFLRyxpQkFBTCxDQUF1QmpCLEtBQXZCLEVBQThCQyxRQUE5QixFQUF3Q0MsS0FBeEMsQ0FBdkMsRUFBdUZBLEtBQXZGO0FBQ0Q7Ozs4QkFFU0YsSyxFQUFrQztBQUMxQyxVQUFJbUIsTUFBTSxnRkFBbUJuQixLQUFuQixDQUFWOztBQUNBLFVBQUltQixNQUFNLEtBQUssTUFBZixFQUF1QjtBQUNyQkEsUUFBQUEsTUFBTSxHQUFHLFdBQVQ7QUFDRDs7QUFDRCxhQUFPQSxNQUFQO0FBQ0Q7Ozt5REFHQ0MsUSxTQVFRO0FBQUEsVUFOTnZCLHVCQU1NLFNBTk5BLHVCQU1NO0FBQUEsVUFMTkMsWUFLTSxTQUxOQSxZQUtNO0FBQ1I7QUFDQSxVQUFNdUIsY0FBYyxHQUNqQixlQUFlWixJQUFJLENBQUNhLEdBQUwsQ0FBVUYsUUFBUSxDQUFDRyxRQUFULEdBQW9CZCxJQUFJLENBQUNlLEVBQTFCLEdBQWdDLEdBQXpDLENBQWhCLEdBQWlFZixJQUFJLENBQUNnQixHQUFMLENBQVMsQ0FBVCxFQUFZTCxRQUFRLENBQUNNLElBQXJCLENBRG5FO0FBR0EsYUFBUUwsY0FBYyxJQUFJeEIsdUJBQXVCLENBQUMsQ0FBRCxDQUF2QixHQUE2QkMsWUFBWSxDQUFDLENBQUQsQ0FBN0MsQ0FBZixHQUFvRSxDQUEzRTtBQUNEOzs7O0VBMUVnQzZCLHNCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcbmltcG9ydCB0eXBlIHsgTW9kZVByb3BzLCBQb2ludGVyTW92ZUV2ZW50LCBTdG9wRHJhZ2dpbmdFdmVudCB9IGZyb20gJy4uL3R5cGVzLmpzJztcbmltcG9ydCB0eXBlIHsgUG9zaXRpb24sIEZlYXR1cmVDb2xsZWN0aW9uIH0gZnJvbSAnLi4vZ2VvanNvbi10eXBlcy5qcyc7XG5pbXBvcnQgeyBnZXRQaWNrZWRFZGl0SGFuZGxlLCB0eXBlIEdlb0pzb25FZGl0QWN0aW9uIH0gZnJvbSAnLi9nZW9qc29uLWVkaXQtbW9kZS5qcyc7XG5pbXBvcnQgeyBNb2RpZnlNb2RlIH0gZnJvbSAnLi9tb2RpZnktbW9kZS5qcyc7XG5cbmZ1bmN0aW9uIGRlZmF1bHRDYWxjdWxhdGVFbGV2YXRpb25DaGFuZ2Uoe1xuICBwb2ludGVyRG93blNjcmVlbkNvb3JkcyxcbiAgc2NyZWVuQ29vcmRzXG59OiB7XG4gIHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzOiBQb3NpdGlvbixcbiAgc2NyZWVuQ29vcmRzOiBQb3NpdGlvblxufSkge1xuICByZXR1cm4gMTAgKiAocG9pbnRlckRvd25TY3JlZW5Db29yZHNbMV0gLSBzY3JlZW5Db29yZHNbMV0pO1xufVxuXG5leHBvcnQgY2xhc3MgRWxldmF0aW9uTW9kZSBleHRlbmRzIE1vZGlmeU1vZGUge1xuICBtYWtlRWxldmF0ZWRFdmVudChcbiAgICBldmVudDogUG9pbnRlck1vdmVFdmVudCB8IFN0b3BEcmFnZ2luZ0V2ZW50LFxuICAgIHBvc2l0aW9uOiBQb3NpdGlvbixcbiAgICBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPlxuICApOiBPYmplY3Qge1xuICAgIGNvbnN0IHtcbiAgICAgIG1pbkVsZXZhdGlvbiA9IDAsXG4gICAgICBtYXhFbGV2YXRpb24gPSAyMDAwMCxcbiAgICAgIGNhbGN1bGF0ZUVsZXZhdGlvbkNoYW5nZSA9IGRlZmF1bHRDYWxjdWxhdGVFbGV2YXRpb25DaGFuZ2VcbiAgICB9ID1cbiAgICAgIHByb3BzLm1vZGVDb25maWcgfHwge307XG5cbiAgICBpZiAoIWV2ZW50LnBvaW50ZXJEb3duU2NyZWVuQ29vcmRzKSB7XG4gICAgICByZXR1cm4gZXZlbnQ7XG4gICAgfVxuXG4gICAgLy8gJEZsb3dGaXhNZSAtIHJlYWxseSwgSSBrbm93IGl0IGhhcyBzb21ldGhpbmcgYXQgaW5kZXggMlxuICAgIGxldCBlbGV2YXRpb24gPSBwb3NpdGlvbi5sZW5ndGggPT09IDMgPyBwb3NpdGlvblsyXSA6IDA7XG5cbiAgICAvLyBjYWxjdWxhdGVFbGV2YXRpb25DaGFuZ2UgaXMgY29uZmlndXJhYmxlIGJlY2F1c2UgKGF0IHRoaXMgdGltZSkgbW9kZXMgYXJlIG5vdCBhd2FyZSBvZiB0aGUgdmlld3BvcnRcbiAgICBlbGV2YXRpb24gKz0gY2FsY3VsYXRlRWxldmF0aW9uQ2hhbmdlKHtcbiAgICAgIHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzOiBldmVudC5wb2ludGVyRG93blNjcmVlbkNvb3JkcyxcbiAgICAgIHNjcmVlbkNvb3JkczogZXZlbnQuc2NyZWVuQ29vcmRzXG4gICAgfSk7XG4gICAgZWxldmF0aW9uID0gTWF0aC5taW4oZWxldmF0aW9uLCBtYXhFbGV2YXRpb24pO1xuICAgIGVsZXZhdGlvbiA9IE1hdGgubWF4KGVsZXZhdGlvbiwgbWluRWxldmF0aW9uKTtcblxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBldmVudCwge1xuICAgICAgbWFwQ29vcmRzOiBbcG9zaXRpb25bMF0sIHBvc2l0aW9uWzFdLCBlbGV2YXRpb25dXG4gICAgfSk7XG4gIH1cblxuICBoYW5kbGVQb2ludGVyTW92ZUFkYXB0ZXIoXG4gICAgZXZlbnQ6IFBvaW50ZXJNb3ZlRXZlbnQsXG4gICAgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj5cbiAgKTogeyBlZGl0QWN0aW9uOiA/R2VvSnNvbkVkaXRBY3Rpb24sIGNhbmNlbE1hcFBhbjogYm9vbGVhbiB9IHtcbiAgICBjb25zdCBlZGl0SGFuZGxlID0gZ2V0UGlja2VkRWRpdEhhbmRsZShldmVudC5wb2ludGVyRG93blBpY2tzKTtcbiAgICBjb25zdCBwb3NpdGlvbiA9IGVkaXRIYW5kbGUgPyBlZGl0SGFuZGxlLnBvc2l0aW9uIDogZXZlbnQubWFwQ29vcmRzO1xuICAgIHJldHVybiBzdXBlci5oYW5kbGVQb2ludGVyTW92ZUFkYXB0ZXIodGhpcy5tYWtlRWxldmF0ZWRFdmVudChldmVudCwgcG9zaXRpb24sIHByb3BzKSwgcHJvcHMpO1xuICB9XG5cbiAgaGFuZGxlU3RvcERyYWdnaW5nQWRhcHRlcihcbiAgICBldmVudDogU3RvcERyYWdnaW5nRXZlbnQsXG4gICAgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj5cbiAgKTogP0dlb0pzb25FZGl0QWN0aW9uIHtcbiAgICBjb25zdCBlZGl0SGFuZGxlID0gZ2V0UGlja2VkRWRpdEhhbmRsZShldmVudC5waWNrcyk7XG4gICAgY29uc3QgcG9zaXRpb24gPSBlZGl0SGFuZGxlID8gZWRpdEhhbmRsZS5wb3NpdGlvbiA6IGV2ZW50Lm1hcENvb3JkcztcbiAgICByZXR1cm4gc3VwZXIuaGFuZGxlU3RvcERyYWdnaW5nQWRhcHRlcih0aGlzLm1ha2VFbGV2YXRlZEV2ZW50KGV2ZW50LCBwb3NpdGlvbiwgcHJvcHMpLCBwcm9wcyk7XG4gIH1cblxuICBnZXRDdXJzb3IoZXZlbnQ6IFBvaW50ZXJNb3ZlRXZlbnQpOiA/c3RyaW5nIHtcbiAgICBsZXQgY3Vyc29yID0gc3VwZXIuZ2V0Q3Vyc29yKGV2ZW50KTtcbiAgICBpZiAoY3Vyc29yID09PSAnY2VsbCcpIHtcbiAgICAgIGN1cnNvciA9ICducy1yZXNpemUnO1xuICAgIH1cbiAgICByZXR1cm4gY3Vyc29yO1xuICB9XG5cbiAgc3RhdGljIGNhbGN1bGF0ZUVsZXZhdGlvbkNoYW5nZVdpdGhWaWV3cG9ydChcbiAgICB2aWV3cG9ydDogYW55LFxuICAgIHtcbiAgICAgIHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzLFxuICAgICAgc2NyZWVuQ29vcmRzXG4gICAgfToge1xuICAgICAgcG9pbnRlckRvd25TY3JlZW5Db29yZHM6IFBvc2l0aW9uLFxuICAgICAgc2NyZWVuQ29vcmRzOiBQb3NpdGlvblxuICAgIH1cbiAgKTogbnVtYmVyIHtcbiAgICAvLyBTb3VyY2U6IGh0dHBzOi8vZ2lzLnN0YWNrZXhjaGFuZ2UuY29tL2EvMTI3OTQ5LzExMTgwNFxuICAgIGNvbnN0IG1ldGVyc1BlclBpeGVsID1cbiAgICAgICgxNTY1NDMuMDMzOTIgKiBNYXRoLmNvcygodmlld3BvcnQubGF0aXR1ZGUgKiBNYXRoLlBJKSAvIDE4MCkpIC8gTWF0aC5wb3coMiwgdmlld3BvcnQuem9vbSk7XG5cbiAgICByZXR1cm4gKG1ldGVyc1BlclBpeGVsICogKHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzWzFdIC0gc2NyZWVuQ29vcmRzWzFdKSkgLyAyO1xuICB9XG59XG4iXX0=